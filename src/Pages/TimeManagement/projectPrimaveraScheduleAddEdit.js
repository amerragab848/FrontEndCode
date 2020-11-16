import React, { Component, Fragment } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from "../../Services/Config.js";
import XSLfile from '../../Componants/OptionsPanels/XSLfiel'
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight from 'react-skylight';
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Select from 'react-select';
import Api from "../../api";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Steps from "../../Componants/publicComponants/Steps";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";

var steps_defination = [];
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
const find = require('lodash/find')

let StatusDataDrop = [{ label: 'Opended', value: true }, { label: 'Closed', value: false }]

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage])
})
const AssignContactValidationSchema = Yup.object().shape({
    companyId: Yup.string().required(Resources['actionByCompanyRequired'][currentLanguage]),
    contactId: Yup.string().required(Resources['actionByContactRequired'][currentLanguage])
})

const EditItemValidationSchema = Yup.object().shape({
    task_code: Yup.string().required(Resources['taskCodeRequired'][currentLanguage]),
    description: Yup.string().required(Resources['activityDescriptionRequired'][currentLanguage])
})

const UpdateItemValidationSchema = Yup.object().shape({
    earnedValue: Yup.string().required(Resources['earnedValueRequired'][currentLanguage]),
    percentageWorkComplete: Yup.string().required(Resources['percentageWorkCompleteRequired'][currentLanguage])
})


class projectPrimaveraScheduleAddEdit extends Component {

    constructor(props) {

        super(props)

        const query = new URLSearchParams(this.props.location.search);
        let index = 0;
        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));

                    docId = obj.docId;
                    projectId = obj.projectId;
                    projectName = obj.projectName;
                    isApproveMode = obj.isApproveMode;
                    docApprovalId = obj.docApprovalId;
                    arrange = obj.arrange;
                    perviousRoute = obj.perviousRoute;
                }
                catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            rows: [],
            isLoading: true,
            CurrentStep: 0,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 13,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            permission: [{ name: 'sendByEmail', code: 588 }, { name: 'sendByInbox', code: 587 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 952 },
            { name: 'createTransmittal', code: 3034 }, { name: 'sendToWorkFlow', code: 704 },
            { name: 'viewAttachments', code: 3291 }, { name: 'deleteAttachments', code: 872 }],
            IsEditMode: false,
            SelectedBOQDrop: { label: Resources.selectBoq[currentLanguage], value: "0" },
            TotalFactors: 0,
            IsAddModel: false,
            SelectedCurrency: { label: Resources.pleaseSelectCurrency[currentLanguage], value: "0" },
            ActionByCompanyData: [],
            TotalPages: 0,
            contactsList: [],
            selectedRows: [],
            showAssignModal: false,
            selectedContact: { label: Resources.actionByContactsSummary[currentLanguage], value: "0" },
            selectedCompany: { label: Resources.actionByCompany[currentLanguage], value: "0" },
            showItemEditPopup: false,
            itemObj: {
                id: "",
                task_code: "",
                description: "",
                earnedValue: "",
                percentageWorkComplete: "",
                start_date: moment().format(),
                finish_date: moment().format(),
                actualStartDate: moment().format(),
                actualFinishDate: moment().format(),
                status: false
            }
        }
        if (!Config.IsAllow(583) && !Config.IsAllow(582) && !Config.IsAllow(585)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }

        steps_defination = [
            {
                name: "primaveraLog",
                callBackFn: null
            },
            {
                name: "primaveraShceduleItems",
                callBackFn: null
            }
        ];
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(583))) {
                this.setState({ isViewMode: true });
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (this.state.isApproveMode != true && Config.IsAllow(583)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(583)) {
                        if (this.props.document.status !== false && Config.IsAllow(583)) {
                            this.setState({ isViewMode: false });
                        } else {
                            this.setState({ isViewMode: true });
                        }
                    } else {
                        this.setState({ isViewMode: true });
                    }
                }
            }
        }
        else {
            this.setState({ isViewMode: false });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            let doc = nextProps.document
            doc.docDate = doc.docDate === null ? moment().format('YYYY-MM-DD') : moment(doc.docDate).format('YYYY-MM-DD')
            this.setState({
                document: doc,
                hasWorkflow: nextProps.hasWorkflow,
            });
            this.checkDocumentIsView();
        }
    }

    handleChange(e, field) {

        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document
        })

    }

    handleChangeItem(e, field) {

        let original_document = { ...this.state.itemObj };
        let updated_document = {};
        updated_document[field] = e;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            itemObj: updated_document
        })

    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrentStep: stepNo });
    };

    componentWillMount() {
        if (docId > 0) {
            this.setState({ showContactDrop: false })
            let url = "GetPrimaveraScheduleForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url);
            this.setState({
                IsEditMode: true,
                isLoading: false
            })
            this.getTabelData()

        } else {
            ///Is Add Mode
            dataservice.GetNextArrangeMainDocument('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=' + this.state.docTypeId + '&companyId=undefined&contactId=undefined').then
                (
                    res => {
                        let Doc = {
                            id: -1, projectId: projectId, subject: '', alertStatus: true,
                            arrange: res, docDate: moment(), status: true,
                        }
                        this.setState({
                            document: Doc,
                            isLoading: false
                        })
                    }
                )
        }
        dataservice.GetDataListCached('GetProjectProjectsCompaniesForList?projectId= ' + projectId + '', 'companyName', 'companyId', 'companies', this.state.projectId, "projectId").then(
            data => {
                this.setState({
                    ActionByCompanyData: data,
                })
            })

    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentDidMount = () => {
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    handleChangeDate(e, field) {

        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });

    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    viewAttachments() {
        return (
            this.state.docId !== 0 ? (
                Config.IsAllow(3291) === true ?
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{this.state.IsAddModel ? Resources.next[currentLanguage] : Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = <button className="primaryBtn-1 btn mediumBtn" >{Resources.next[currentLanguage]}</button>
        }
        return btn;
    }

    AddEditDoc = () => {
        if (this.state.IsAddModel) {
            this.changeCurrentStep(1);
        }
        else {
            this.setState({
                isLoading: true
            })

            let Doc = { ...this.state.document }
            Doc.docDate = moment(Doc.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
            this.changeCurrentStep(1);

            if (this.state.docId > 0) {
                dataservice.addObject('EditPrimaveraSchedule', Doc).then(
                    res => {
                        this.setState({
                            isLoading: false
                        })
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    })


            }
            else {

                dataservice.addObject('AddPrimaveraSchedule', Doc).then(
                    res => {
                        this.setState({
                            docId: res.id,
                            isLoading: false,
                            IsAddModel: true
                        })

                        dataservice.GetDataGrid('GetProjectEstimateItemsByProjectEstimateId?projectEstimateId=' + res.id + '').then(
                            Data => {

                                this.setState({
                                    rows: Data,
                                })
                            })

                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    })
            }
        }
    }

    getTabelData = () => {
        this.setState({
            isLoading: true
        })
        Api.get('GetPrimaveraScheduleItems?scheduleId=' + this.state.docId + '').then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false,
                })
                let data = { items: res };

                this.props.actions.ExportingData(data);

            }

        )
    }

    HandlerChangeTableDrop = (key, e, Name) => {
        if (Name === 'Status') {
            let companyId = key.bic_company_id === null ? 0 : key.bic_company_id
            //int id, int action_by_company, bool? isStatus, bool? status, int action_by_contact = 0
            Api.post('UpdatePrimaveraScheduleItems?id=' + key.id + '&action_by_company=' + companyId + '&isStatus=true&status=' + e.value).then(res => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
        }
        // else {
        //     Api.post('UpdatePrimaveraScheduleItems?id=' + key.id + '&action_by_company=' + companyId + '&isStatus=false&status=false+&action_by_contact=' + e.value).then(
        //         res => {
        //             toast.success(Resources["operationSuccess"][currentLanguage]);
        //         }).catch(ex => {
        //             toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        //         })
        // }
    }

    HandlerChangeParentDrop = (e, subDropList) => {
        dataservice.GetDataList('GetContactsByCompanyId?companyId=' + e.value, "contactName", "id").then(
            res => {
                this.setState({ [subDropList]: res || [] })
            }).catch(ex => {
                console.log("error...", ex)
            })
    }

    assignContact = () => {
        let ids = this.state.selectedRows.map(x => x.id);
        this.setState({ isLoading: true })
        Api.post('UpdatePrimaveraScheduleItem?ids=' + ids + '&action_by_company=' + this.state.selectedCompany.value + '&action_by_contact=' + this.state.selectedContact.value).then(
            res => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                let rows = this.state.rows;
                this.state.selectedRows.forEach(i => {
                    let rowIndex = rows.findIndex(x => x.id == i.id);
                    rows[rowIndex].bic_company_name = this.state.selectedCompany.label;
                    rows[rowIndex].bic_contact_name = this.state.selectedContact.label;
                })
                this.setState({
                    rows: rows,
                    selectedRows: [],
                    showAssignModal: false,
                    isLoading: false,
                    selectedCompany: { label: Resources.actionByCompany[currentLanguage], value: "0" },
                    selectedContact: { label: Resources.actionByContactsSummary[currentLanguage], value: "0" }
                });
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
    }

    toggleRow(obj) {
        let selectedRows = this.state.selectedRows;
        let setIndex = selectedRows.findIndex(x => x.id === obj.id);
        if (setIndex > -1) {
            selectedRows.splice(setIndex, 1);
        } else {
            selectedRows.push(obj);
        }
        this.setState({
            selectedRows: selectedRows
        });
    }

    onItemRowClick = (obj) => {
        this.simpleDialogItem.show();
        this.setState({ showItemEditPopup: true, itemObj: obj })
    }

    EditItem = () => {
        if (Config.IsAllow(10076) || Config.IsAllow(10077)) {
            this.setState({ isLoading: true });
            let serverObj = { ...this.state.itemObj };
            serverObj.start_date = moment(serverObj.start_date || moment().format(), 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
            serverObj.finish_date = moment(serverObj.finish_date || moment().format(), 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
            serverObj.actualStartDate = moment(serverObj.actualStartDate || moment().format(), 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
            serverObj.actualFinishDate = moment(serverObj.actualFinishDate || moment().format(), 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
            dataservice.addObject('EditPrimaveraSchedulsItem', serverObj).then(result => {
                if (result) {
                    this.setState({
                        isLoading: false,
                        showItemEditPopup: false,
                        itemObj: {
                            id: "",
                            task_code: "",
                            description: "",
                            earnedValue: "",
                            percentageWorkComplete: "",
                            start_date: moment().format(),
                            finish_date: moment().format(),
                            actualStartDate: moment().format(),
                            actualFinishDate: moment().format(),
                            status: false
                        }
                    });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }
            });
        } else {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
        }
    }


    render() {
        const columnsCycles = [
            {
                Header: Resources["checkList"][currentLanguage],
                id: "checkbox",
                accessor: 'id',
                Cell: ({ row }) => {
                    return (
                        <div className="ui checked checkbox  checkBoxGray300 ">
                            <input type="checkbox"
                                className="checkbox"
                                checked={this.state.selectedRows.findIndex(x => x.id == row._original.id) > -1 ? true : false}
                                onChange={() => this.toggleRow(row._original)} />
                            <label></label>
                        </div>
                    );
                },
                width: 50
            },
            {
                Header: Resources["numberAbb"][currentLanguage],
                accessor: "arrange",
                sortabel: true,
                width: 80
            },
            {
                Header: Resources["statusName"][currentLanguage],
                accessor: "status",
                width: 200,
                sortabel: true,
                Cell: (row) => {
                    return (
                        <div className="fillter-status fillter-item-c">
                            <div className="customD_Menu">
                                <Select options={StatusDataDrop}
                                    defaultValue={row.value === true ? { label: 'Opended', value: true } : { label: 'Closed', value: false }}
                                    onChange={e => this.HandlerChangeTableDrop(row.original, e, "Status")}
                                />
                            </div>
                        </div>
                    )
                }
            },
            {
                Header: Resources["taskId"][currentLanguage],
                accessor: "task_id",
                width: 100,
                sortabel: true
            },
            {
                Header: Resources["taskCode"][currentLanguage],
                accessor: "task_code",
                width: 100,
                sortabel: true
            },
            {
                Header: Resources["activityDescription"][currentLanguage],
                accessor: "description",
                width: 300,
                sortabel: true
            },
            {
                Header: Resources["actualStartDate"][currentLanguage],
                accessor: "actualStartDate",
                width: 200,
                sortabel: true,
                Cell: row => (
                    <span>
                        <span>{row.value === null ? 'No Date' : moment(row.value).format("DD/MM/YYYY")}</span>
                    </span>
                )
            },
            {
                Header: Resources["actualFinishDate"][currentLanguage],
                accessor: "actualFinishDate",
                width: 200,
                sortabel: true,
                Cell: row => (
                    <span>
                        <span>{row.value === null ? 'No Date' : moment(row.value).format("DD/MM/YYYY")}</span>
                    </span>
                )
            },
            {
                Header: Resources["plannedStart"][currentLanguage],
                accessor: "start_date",
                width: 200,
                sortabel: true,
                Cell: row => (
                    <span>
                        <span>{row.value === null ? 'No Date' : moment(row.value).format("DD/MM/YYYY")}</span>
                    </span>
                )
            },
            {
                Header: Resources["plannedFinish"][currentLanguage],
                accessor: "finish_date",
                width: 200,
                sortabel: true,
                Cell: row => (
                    <span>
                        <span>{row.value === null ? 'No Date' : moment(row.value).format("DD/MM/YYYY")}</span>
                    </span>
                )
            },
            {
                Header: Resources["actionByCompany"][currentLanguage],
                accessor: "bic_company_name",
                width: 200,
                sortabel: true,
                Cell: row => (
                    <span>
                        <span>{row.value === null ? 'Not Selected' : row.value}</span>
                    </span>
                )
            },
            {
                Header: Resources["actionByContact"][currentLanguage],
                accessor: "bic_contact_name",
                width: 200,
                sortabel: true,
                Cell: row => (
                    <span>
                        <span>{row.value === null ? 'Not Selected' : row.value}</span>
                    </span>
                )
            },
            {
                Header: Resources["actualDuration"][currentLanguage],
                accessor: "actualDuration",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["percentageWorkComplete"][currentLanguage],
                accessor: "percentageWorkComplete",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["earnedValue"][currentLanguage],
                accessor: "earnedValue",
                width: 200,
                sortabel: true
            },
        ];
        const assignContactModal = (
            <Formik
                initialValues={{ companyId: this.state.selectedCompany.value, contactId: this.state.selectedContact.value }}
                validationSchema={AssignContactValidationSchema}
                enableReinitialize={true}
                onSubmit={() => {
                    this.assignContact()
                }}>
                {({ errors, touched, handleBlur, handleChange, handleSubmit, values, setFieldTouched }) => (
                    <Form id="letterForm" className="proForm datepickerContainer customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                        <Dropdown title="actionByCompany" data={this.state.ActionByCompanyData}
                            selectedValue={this.state.selectedCompany}
                            handleChange={event => { this.HandlerChangeParentDrop(event, "contactsList"); this.setState({ selectedCompany: { label: event.label, value: event.value } }) }}
                            onBlur={setFieldTouched}
                            error={errors.companyId}
                            touched={touched.companyId}
                            name="companyId"
                            index="companyId"
                        />
                        <Dropdown title="actionByContactsSummary" data={this.state.contactsList}
                            selectedValue={this.state.selectedContact}
                            handleChange={event => this.setState({ selectedContact: { label: event.label, value: event.value } })}
                            onBlur={setFieldTouched}
                            error={errors.companyId}
                            touched={touched.companyId}
                            name="contactId"
                            index="contactId"
                        />
                        <div className="fullWidthWrapper">
                            <button
                                className="primaryBtn-1 btn mediumBtn"
                                type="submit"
                            >  {Resources['save'][currentLanguage]}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        );
        const EditItemPopup = (
            <Formik
                initialValues={{ ...this.state.itemObj }}
                validationSchema={Config.IsAllow(10076) && Config.IsAllow(10077) ? (EditItemValidationSchema.concat(UpdateItemValidationSchema)) : Config.IsAllow(10076) ? EditItemValidationSchema : Config.IsAllow(10077) ? UpdateItemValidationSchema : null}
                enableReinitialize={true}
                onSubmit={() => {
                    this.EditItem()
                }}>
                {({ errors, touched, handleSubmit, handleBlur }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className='document-fields'>
                            <div className="proForm datepickerContainer">
                                {Config.IsAllow(10076) ?
                                    <>
                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <label className="control-label">{Resources.taskCode[currentLanguage]}</label>
                                            <div className={"inputDev ui input" + (errors.task_code && touched.task_code ? (" has-error") : !errors.task_code && touched.task_code ? (" has-success") : " ")} >
                                                <div className="inputDev ui input">
                                                    <input name='task_code' id="task_code" className="form-control fsadfsadsa"
                                                        placeholder={Resources.taskCode[currentLanguage]}
                                                        autoComplete='off'
                                                        value={this.state.itemObj.task_code}
                                                        onBlur={(e) => { handleBlur(e); }}
                                                        onChange={(e) => this.handleChangeItem(e.target.value, 'task_code')} />
                                                    {errors.task_code && touched.task_code ? (<em className="pError">{errors.task_code}</em>) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <label className="control-label">{Resources.activityDescription[currentLanguage]}</label>
                                            <div className={"inputDev ui input" + (errors.description && touched.description ? (" has-error") : !errors.description && touched.description ? (" has-success") : " ")} >
                                                <div className="inputDev ui input">
                                                    <input name='description' id="description" className="form-control fsadfsadsa"
                                                        placeholder={Resources.activityDescription[currentLanguage]}
                                                        autoComplete='off'
                                                        value={this.state.itemObj.description}
                                                        onBlur={(e) => { handleBlur(e); }}
                                                        onChange={(e) => this.handleChangeItem(e.target.value, 'description')} />
                                                    {errors.description && touched.description ? (<em className="pError">{errors.description}</em>) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <DatePicker title='plannedStart'
                                                name="start_date"
                                                startDate={this.state.itemObj.start_date}
                                                handleChange={e => this.handleChangeItem(e, 'start_date')} />
                                        </div>
                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <DatePicker title='plannedFinish'
                                                name="finish_date"
                                                startDate={this.state.itemObj.finish_date}
                                                handleChange={e => this.handleChangeItem(e, 'finish_date')} />
                                        </div>
                                    </> : null}
                                {Config.IsAllow(10077) ? <>
                                    <div className="linebylineInput valid-input fullInputWidth">
                                        <label className="control-label">{Resources.earnedValue[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.earnedValue && touched.earnedValue ? (" has-error") : !errors.earnedValue && touched.earnedValue ? (" has-success") : " ")} >
                                            <input name='earnedValue' id="earnedValue" className="form-control fsadfsadsa"
                                                placeholder={Resources.earnedValue[currentLanguage]}
                                                autoComplete='off'
                                                value={this.state.itemObj.earnedValue}
                                                onBlur={(e) => { handleBlur(e); }}
                                                onChange={(e) => this.handleChangeItem(e.target.value, 'earnedValue')} />
                                            {errors.earnedValue && touched.earnedValue ? (<em className="pError">{errors.earnedValue}</em>) : null}
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input fullInputWidth">
                                        <label className="control-label">{Resources.percentageWorkComplete[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.percentageWorkComplete && touched.percentageWorkComplete ? (" has-error") : !errors.percentageWorkComplete && touched.percentageWorkComplete ? (" has-success") : " ")} >
                                            <input name='percentageWorkComplete' id="percentageWorkComplete" className="form-control fsadfsadsa"
                                                placeholder={Resources.percentageWorkComplete[currentLanguage]}
                                                autoComplete='off'
                                                value={this.state.itemObj.percentageWorkComplete}
                                                onBlur={(e) => { handleBlur(e); }}
                                                onChange={(e) => this.handleChangeItem(e.target.value, 'percentageWorkComplete')} />
                                            {errors.percentageWorkComplete && touched.percentageWorkComplete ? (<em className="pError">{errors.percentageWorkComplete}</em>) : null}
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input fullInputWidth">
                                        <DatePicker title='actualStartDate'
                                            name="actualStartDate"
                                            startDate={this.state.itemObj.actualStartDate}
                                            handleChange={e => this.handleChangeItem(e, 'actualStartDate')} />
                                    </div>
                                    <div className="linebylineInput valid-input fullInputWidth">
                                        <DatePicker title='actualFinishDate'
                                            name="actualFinishDate"
                                            startDate={this.state.itemObj.actualFinishDate}
                                            handleChange={e => this.handleChangeItem(e, 'actualFinishDate')} />
                                    </div>
                                    <div className="linebylineInput linebylineInput__checkbox">
                                        <label className="control-label">{Resources.status[currentLanguage]}</label>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="status" defaultChecked={this.state.itemObj.status === false ? null : 'checked'} value="true" onChange={e => this.handleChangeItem(true, 'status')} />
                                            <label>{Resources.yes[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="status" defaultChecked={this.state.itemObj.status === false ? 'checked' : null} value="false" onChange={e => this.handleChangeItem(false, 'status')} />
                                            <label>{Resources.no[currentLanguage]}</label>
                                        </div>
                                    </div>
                                </> : null}
                            </div>
                            <div className="slider-Btns">
                                <button
                                    className="primaryBtn-1 btn mediumBtn"
                                    type="submit"
                                >  {Resources['save'][currentLanguage]}
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        );

        return (

            <div className="mainContainer">

                {this.state.isLoading == true ? <LoadingSection /> : null}

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>


                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.primaveraLog[currentLanguage]}
                        moduleTitle={Resources['timeCoordination'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            {this.state.CurrentStep == 0 ?
                                <div className="subiTabsContent">
                                    <div className="document-fields">
                                        <Formik
                                            initialValues={
                                                { ...this.state.document }
                                            }
                                            validationSchema={validationSchema}
                                            enableReinitialize={true}
                                            onSubmit={(values) => {
                                                this.AddEditDoc();
                                            }}  >

                                            {({ errors, touched, handleBlur, values, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form id="InspectionRequestForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                                    <div className="proForm first-proform">

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                                    placeholder={Resources.subject[currentLanguage]} autoComplete='off'
                                                                    value={this.state.document.subject}
                                                                    onChange={(e) => this.handleChange(e, 'subject')}
                                                                    onBlur={(e) => {
                                                                        handleBlur(e)
                                                                        handleChange(e)
                                                                    }}
                                                                />
                                                                {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.status[currentLanguage]}</label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                                                <label>{Resources.oppened[currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
                                                                <label>{Resources.closed[currentLanguage]}</label>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="proForm datepickerContainer">
                                                        <div className="linebylineInput valid-input alternativeDate">
                                                            <DatePicker title='docDate' startDate={this.state.document.docDate}
                                                                handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                                            <div className="inputDev ui input" >
                                                                <input autoComplete="off" className="form-control" readOnly
                                                                    onChange={(e) => this.handleChange(e, 'arrange')}
                                                                    value={this.state.document.arrange} name="arrange" placeholder={Resources['numberAbb'][currentLanguage]} />
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.alertStatus[currentLanguage]}</label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="alertStatus" defaultChecked={this.state.document.alertStatus === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'alertStatus')} />
                                                                <label>{Resources.on[currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="alertStatus" defaultChecked={this.state.document.alertStatus === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'alertStatus')} />
                                                                <label>{Resources.off[currentLanguage]}</label>
                                                            </div>
                                                        </div>


                                                    </div>

                                                    <div className="slider-Btns">
                                                        {this.showBtnsSaving()}
                                                    </div>
                                                    {this.state.IsEditMode === true && docId !== 0 ?
                                                        <div className="approveDocument">
                                                            <div className="approveDocumentBTNS">
                                                                <DocumentActions
                                                                    isApproveMode={this.state.isApproveMode}
                                                                    docTypeId={this.state.docTypeId}
                                                                    docId={this.state.docId}
                                                                    projectId={this.state.projectId}
                                                                    previousRoute={this.state.previousRoute}
                                                                    docApprovalId={this.state.docApprovalId}
                                                                    currentArrange={this.state.arrange}
                                                                    showModal={this.props.showModal}
                                                                    showOptionPanel={this.showOptionPanel}
                                                                    permission={this.state.permission}
                                                                />
                                                            </div>
                                                        </div>
                                                        : null
                                                    }
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={871} EditAttachments={3250} ShowDropBox={3557} ShowGoogleDrive={3558} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true ?
                                                <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                :
                                <Fragment>

                                    <XSLfile CustomAccept={true} key='gen_primavera_schedule_items' docId={this.state.docId}
                                        docType='gen_primavera_schedule_items' CantDownload={true} CustomUpload={true} projectId={this.state.projectId}
                                        afterUpload={() => this.getTabelData()}
                                    />
                                    {this.state.selectedRows.length > 0 ? <button type="button" onClick={() => { this.simpleDialog.show(); this.setState({ showAssignModal: true }) }} className={"btn btn-success "} >Assign</button> : null}
                                    <ReactTable data={this.state.rows}
                                        columns={columnsCycles}
                                        defaultPageSize={5}
                                        noDataText={Resources["noData"][currentLanguage]}
                                        className="-striped -highlight"
                                        getTrProps={(state, rowInfo, column, instance) => {
                                            return { onClick: e => { this.onItemRowClick(rowInfo.original) } };
                                        }} />

                                </Fragment>
                            }
                        </div>
                        <Steps
                            steps_defination={steps_defination}
                            exist_link="/projectPrimaveraSchedule/"
                            docId={this.state.docId}
                            changeCurrentStep={stepNo =>
                                this.changeCurrentStep(stepNo)
                            }
                            stepNo={this.state.CurrentStep} changeStatus={docId === 0 ? false : true}
                        />

                        <div className="largePopup" style={{ display: this.state.showAssignModal == true ? 'block' : 'none' }}>
                            <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources["assignContact"][currentLanguage]}>
                                {assignContactModal}
                            </SkyLight>
                        </div>

                        <div className="skyLight__form" style={{ display: this.state.showItemEditPopup == true ? 'block' : 'none' }}>
                            <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialogItem = ref} title={Resources["editTitle"][currentLanguage]}>
                                {EditItemPopup}
                            </SkyLight>
                        </div>

                    </div>

                </div>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        changeStatus: state.communication.changeStatus,
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow,
        projectId: state.communication.projectId,
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(projectPrimaveraScheduleAddEdit))


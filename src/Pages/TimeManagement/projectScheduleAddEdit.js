import React, { Component, Fragment } from "react";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import InputMelcous from "../../Componants/OptionsPanels/InputMelcous";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SkyLightStateless } from 'react-skylight';
import * as communicationActions from '../../store/actions/communication';
import GridSetup from "../Communication/GridSetup";
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight from 'react-skylight';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import XSLfiel from '../../Componants/OptionsPanels/XSLfiel'
import { toast } from "react-toastify";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import ReactTable from "react-table";
import Api from "../../api";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
})

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

const validationItemsForAddEdit = Yup.object().shape({
    taskId: Yup.string().required(Resources["taskIdRequired"][currentLanguage]),
    description: Yup.string().required(Resources["descriptionRequired"][currentLanguage]),
    bicContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
});

// const validationItemsForAdd = Yup.object().shape({
//     taskIdItem: Yup.string().required(Resources["taskIdRequired"][currentLanguage]),
//     descriptionitem: Yup.string().required(Resources["descriptionRequired"][currentLanguage]),
//     toContactIdItem: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
// });



class drawingListAddEdit extends Component {

    constructor(props) {

        const columnsGrid = [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "arrange",
                name: Resources.arrange[currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "statusName",
                name: Resources.status[currentLanguage],
                width: 90,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "description",
                name: Resources["description"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "bicCompanyName",
                name: Resources["toCompany"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "bicContactName",
                name: Resources["ToContact"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "startDate",
                name: Resources["startDate"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "finishDate",
                name: Resources["finishDate"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "taskId",
                name: Resources["taskId"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ]

        super(props)

        const query = new URLSearchParams(this.props.location.search);
        let index = 0;
        for (let param of query.entries()) {
            if (index === 0) {
                try {
                    let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));

                    docId = obj.docId;
                    projectId = obj.projectId;
                    projectName = obj.projectName;
                    isApproveMode = obj.isApproveMode;
                    docApprovalId = obj.docApprovalId;
                    arrange = obj.arrange;
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            showCheckbox: true,
            columns: columnsGrid.filter(column => column.visible !== false),
            rows: [],
            FirstStep: true,
            SecondStep: false,
            SecondStepComplate: false,
            isLoading: false,
            CurrStep: 1,
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 10,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            permission: [
                { name: 'sendByEmail', code: 307 }, { name: 'sendByInbox', code: 306 },
                { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 999 },
                { name: 'createTransmittal', code: 3085 }, { name: 'sendToWorkFlow', code: 745 },
                { name: 'viewAttachments', code: 3732 }, { name: 'deleteAttachments', code: 3733 }
            ],
            IsEditMode: false,
            showPopUp: false,
            IsAddModel: false,
            ProjectDropData: [],
            ShowAddItem: false,
            IsEditModeItem: false,
            ItemForEdit: {},
            arrangeItems: 1,
            scheduleItemData: [],
            showDeleteModal: false,
            selectedRows: '',
            showPopUpProjectTask: false,
            documentItem: {
                bicContactId: "",
                bicCompanyId: "",
                startDate: moment(),
                finishDate: moment(),
                status: true,
                description: '',
                taskId: '',
                projectId: projectId,
                scheduleId: docId
            },
            documentItemEdit: {
                taskId: '',
                description: '',
                startDate: '',
                finishDate: '',
                arrange: '',
                status: true,
                bicContactId: '',
                bicCompanyId: '',
                projectId: projectId,
                scheduleId: docId
            },
            ToContacts: [],
            fromContacts: [],
            ToCompany: [],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(302))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode !== true && Config.IsAllow(302)) {
                if (this.props.hasWorkflow === false && Config.IsAllow(302)) {
                    if (this.props.document.status !== false && Config.IsAllow(302)) {
                        this.setState({ isViewMode: false });
                    } else {
                        this.setState({ isViewMode: true });
                    }
                } else {
                    this.setState({ isViewMode: true });
                }
            }
        }
        else {
            this.setState({ isViewMode: false });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document && nextProps.document.id) {
            let Doc = nextProps.document
            Doc.docDate = moment(Doc.docDate).format('DD/MM/YYYY')

            this.setState({
                document: Doc,
                hasWorkflow: nextProps.hasWorkflow,
            });
            this.checkDocumentIsView();
            this.FillDrowDowns(nextProps.document.id > 0 ? true : false);
        }
        dataservice.GetDataGrid("GetProjectScheduleItemsByScheduleId?scheduleId=" + this.state.docId).then(result => {
            this.setState({
                scheduleItemData: result
            });
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
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

    handleChangeItemsAdd = (e, field) => {

        let original_documentItem = { ...this.state.documentItem };
        let updated_documentItem = {};
        updated_documentItem[field] = e.target.value;
        updated_documentItem = Object.assign(original_documentItem, updated_documentItem);
        this.setState({
            documentItem: updated_documentItem
        })

    }

    handleChangeDropItemsEdit = (e, field) => {

        let updated_documentItem = this.state.documentItem
        updated_documentItem[field] = e.value;
        this.setState({
            documentItem: updated_documentItem
        })

    }

    handleChangeItems(e, field) {

        let original_document = { ...this.state.documentItemEdit };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            documentItemEdit: updated_document
        })
    }

    NextStep = () => {

        if (this.state.CurrStep === 1) {
            window.scrollTo(0, 0);
            this.setState({
                FirstStep: false,
                SecondStep: true,
                SecondStepComplate: true,
                CurrStep: this.state.CurrStep + 1,
            })
        }
        else if (this.state.CurrStep === 2) {
            this.saveAndExit()
        }
    }

    PreviousStep = () => {

        if (this.state.IsEditMode) {
            if (this.state.CurrStep === 2) {
                window.scrollTo(0, 0)
                this.setState({
                    FirstStep: true,
                    SecondStep: false,
                    SecondStepComplate: false,
                    CurrStep: this.state.CurrStep - 1
                })
            }
        }
    }

    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetProjectScheduleForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url);
            this.setState({
                IsEditMode: true
            })

            this.FillDrowDowns()

            dataservice.GetDataGrid('GetProjectScheduleItemsByScheduleId?scheduleId=' + this.state.docId + '').then(
                data => {
                    this.setState({
                        rows: data,
                    })
                })
        } else {
            //Is Add Mode
            dataservice.GetNextArrangeMainDocument('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=' + this.state.docTypeId + '&companyId=undefined&contactId=undefined').then
                (res => {
                    let Doc = {
                        subject: '',
                        id: 0,
                        projectId: this.state.projectId,
                        arrange: res,
                        docDate: moment(),
                        status: 'false',
                    };

                    this.setState({ document: Doc });
                })

            this.FillDrowDowns();
            this.props.actions.documentForAdding();
            //this.GetMaxArrangeItem();

        }
    }

    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = _.find(result, function (i) { return i.value === toSubField; });
                console.log(targetFieldSelected);
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result,
                    isLoading: false
                });
            }
        });
    }

    FillDrowDowns = (isEdit) => {
        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId').then(result => {

            if (isEdit) {
                let companyId = this.props.document.fromCompanyId;
                if (companyId) {
                    this.setState({
                        selectedFromCompany: { label: this.props.document.fromCompanyName, value: companyId }
                    });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', companyId, 'fromContactId', 'selectedFromContact', 'fromContacts');
                }

                let toCompanyId = this.props.document.toCompanyId;
                if (toCompanyId) {
                    this.setState({
                        selectedToCompany: { label: this.props.document.toCompanyName, value: toCompanyId }
                    });

                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', toCompanyId, 'toContactId', 'selectedToContact', 'ToContacts');
                }
            }
            this.setState({
                companies: [...result]
            });
        });
    }

    componentWillUnmount() {
        this.setState({
            docId: 0
        });
    }

    componentDidMount = () => {

        // dataservice.GetDataList('GetDesignDiscipline?accountOwnerId=2&pageNumber=0&pageSize=10000', 'title', 'id').then(
        //     data => {
        //         this.setState({
        //             DesciplineDropData: data,
        //         })
        //     })
        // let url = "GetProjectProjectsCompaniesForList?projectId=" + projectId;
        // this.GetData(url, 'companyName', 'companyId', 'ToCompany');
        // this.GetData("GetAccountsDefaultList?listType=priority&pageNumber=0&pageSize=10000", 'title', 'id', 'PriorityData');
    }

    startDatehandleChange = (date) => {
        this.setState({ documentItem: { ...this.state.documentItem, startDate: date } });
    }

    finishDatehandleChange = (date) => {
        this.setState({ documentItem: { ...this.state.documentItem, finishDate: date } });
    }

    startDatehandleChangeForEdit = (date) => {
        this.setState({ documentItemEdit: { ...this.state.documentItemEdit, startDate: date } });
    }

    finishDatehandleChangeForEdit = (date) => {
        this.setState({ documentItemEdit: { ...this.state.documentItemEdit, finishDate: date } });
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

    handleShowAction = (item) => {

        if (item.value !== "0") {
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })
            this.simpleDialog.show()
        }
    }

    handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {
        if (event == null) return;
        let updated_document = this.state.documentItem
        updated_document[field] = event.value;

        this.setState({
            document: updated_document,
            [selectedValue]: event
        });

        if (isSubscrib) {
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'contactName', 'id').then(result => {
                this.setState({
                    [targetState]: result
                });
            });
        }
    }

    viewAttachments() {
        return (
            this.state.docId !== 0 ? (
                Config.IsAllow(3732) === true ?
                    <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    saveAndExit = () => {
        this.props.history.push({
            pathname: '/projectSchedule/' + projectId + '',
        })
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{this.state.IsAddModel ? Resources.next[currentLanguage] : Resources.save[currentLanguage]}</button>;
        } //else if (this.state.docId > 0) {
        //     btn = <button className="primaryBtn-1 btn mediumBtn" >{Resources.next[currentLanguage]}</button>
        // }
        return btn;
    }

    AddEditDoc = () => {
        if (this.state.IsAddModel) {
            this.NextStep()
        }
        else {
            this.setState({
                isLoading: true
            })

            let Doc = { ...this.state.document }
            Doc.docDate = moment(Doc.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')

            if (this.state.docId > 0) {
                dataservice.addObject('EditProjectSchedule', Doc).then(
                    res => {
                        this.setState({
                            isLoading: false,
                        })
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    })

                this.NextStep()

            }
            else {
                dataservice.addObject('AddProjectSchedule', Doc).then(
                    res => {
                        this.setState({
                            docId: res.id,
                            isLoading: false,
                            IsAddModel: true
                        })

                        dataservice.GetDataGrid('GetProjectScheduleItemsByScheduleId?scheduleId=' + res.id + '').then(
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

    ShowPopUpForEdit = (obj) => {

        dataservice.GetRowById('GetProjectScheduleItemsById?id=' + obj.id + '').then(
            res => {
                if (obj) {
                    this.setState({
                        IsEditModeItem: true,
                        documentItemEdit: res,
                        showPopUp: true,
                        ItemForEdit: obj,
                    })
                }
            }

        )
    }

    EditItems = (values) => {
        this.setState({
            isLoading: true,
            showPopUp: false,
            IsEditModeItem: false
        })

        let Doc = { ...this.state.documentItemEdit }

        Doc.finishDate = moment(Doc.finishDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        Doc.startDate = moment(Doc.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('EditProjectScheduleItem', Doc).then(res => {
            this.setState({
                rows: res,
                isLoading: false
            })

            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        })
    }

    AddItems = (values) => {
        this.setState({
            isLoading: true
        })

        let DocAdd = this.state.documentItem
        DocAdd.finishDate = moment(DocAdd.finishDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        DocAdd.startDate = moment(DocAdd.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');


        dataservice.addObject('AddProjectScheduleItem', DocAdd).then(res => {
            this.setState({
                rows: res,
                isLoading: false,
            })
            //this.GetMaxArrangeItem()
            this.fillDropDowns(false);
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        })
    }
    /*
        // GetMaxArrangeItem = () => {
    
        //     dataservice.GetNextArrangeMainDocument('GetNextArrangeItems?docId=' + this.state.docId + '&docType=' + this.state.docTypeId + '').then(
        //         res => {
        //             // let DocItem = {
        //             //     arrange: res,
        //             //     bicContactId: "",
        //             //     bicCompanyId: "",
        //             //     startDate: moment(),
        //             //     finishDate: moment(),
        //             //     status: true,
        //             // }
        //             this.setState({
        //                 arrange: res,
        //                 documentItem: DocItem
        //             })
        //         }
        //     )
        // }
    
        // ShowPopUpForAdd = () => {
        //     this.setState({ showPopUp: true, IsEditModeItem: false })
        //     this.GetMaxArrangeItem()
        // }
    */
    onCloseModal = () => {
        this.setState({ showDeleteModal: false, IsEditModeItem: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    DeleteItem = (selectedRows) => {

        this.setState({
            showDeleteModal: true,
            selectedRows
        })
    }

    ConfirmDelete = () => {
        this.setState({
            isLoading: true
        })
        Api.post('DeleteMultipleProjectScheduleItem', this.state.selectedRows).then(
            res => {
                let originalRows = this.state.rows

                this.state.selectedRows.map(i => {
                    originalRows = originalRows.filter(r => r.id !== i);
                })
                this.setState({
                    rows: originalRows,
                    showDeleteModal: false,
                    isLoading: false,
                })
            },
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
        ).catch(ex => {
            this.setState({
                isLoading: false,
            })
        });
    }

    render() {

        const columnsSchedule = [

            {
                Header: Resources.arrange[currentLanguage],
                accessor: "arrange",
                sortabel: true,
                width: 60
            },
            {
                Header: Resources.status[currentLanguage],
                accessor: "statusName",
                width: 100,
                sortabel: true
            },
            {
                Header: Resources.activityDescription[currentLanguage],
                accessor: "description",
                width: 150,
                sortabel: true,

            },
            {
                Header: Resources.toCompany[currentLanguage],
                accessor: "bicCompanyName",
                width: 150,
                sortabel: true
            },
            {
                Header: Resources.ToContact[currentLanguage],
                accessor: "bicContactName",
                width: 150,
                sortabel: true
            },
            {
                Header: Resources.startDate[currentLanguage],
                accessor: "startDate",
                width: 100,
                sortabel: true,
                Cell: row => (
                    <span>
                        <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                    </span>
                )
            },
            {
                Header: Resources.finishDate[currentLanguage],
                accessor: "finishDate",
                width: 100,
                sortabel: true,
                Cell: row => (
                    <span>
                        <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                    </span>
                )
            },
            {
                Header: Resources.taskId[currentLanguage],
                accessor: "taskId",
                width: 100,
                sortabel: true
            }
        ];

        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox} minHeight={350}
                    onRowClick={this.ShowPopUpForEdit}
                    clickHandlerDeleteRows={this.DeleteItem}
                    // Panels={true} TaskGroupFun={this.TaskGroupFun} ProjectTaskFun={this.ProjectTaskFun}
                    single={false}
                />
            ) : <LoadingSection />

        let AddEditProjectScheduleItems = () => {
            return (
                <div className="dropWrapper">
                    <Formik
                        // initialValues={{ ...this.state.documentItem }}
                        initialValues={{ ...this.state.documentItemEdit }}
                        enableReinitialize={true}
                        validationSchema={validationItemsForAddEdit}
                        onSubmit={(values) => {
                            this.EditItems(values);
                        }}>

                        {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched, values }) => (
                            <Form id="scheduleItemFormGrid" className="proForm customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">
                                        {Resources.arrange[currentLanguage]}
                                    </label>
                                    <div className={"ui input inputDev " + (errors.arrange && touched.arrange ? "has-error" : !errors.arrange && touched.arrange ? "has-success" : "")} >
                                        <input type="text" readOnly className="form-control" value={this.state.documentItemEdit.arrange} name="arrange" placeholder={Resources.arrange[currentLanguage]}
                                            onBlur={e => { handleChange(e); handleBlur(e); }}
                                            onChange={e => this.handleChangeItems(e, "arrange")} />
                                        {errors.arrange && touched.arrange ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) :
                                            !errors.arrange && touched.arrange ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                                        {errors.arrange && touched.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                    </div>
                                </div>

                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources.status[currentLanguage]}</label>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="letter-status" defaultChecked={this.state.documentItem.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                        <label>{Resources.oppened[currentLanguage]}</label>
                                    </div>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="letter-status" defaultChecked={this.state.documentItem.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
                                        <label>{Resources.closed[currentLanguage]}</label>
                                    </div>
                                </div>

                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">
                                        {Resources.activityDescription[currentLanguage]}
                                    </label>
                                    <div className={"ui input inputDev " + (errors.description && touched.description ? "has-error" : !errors.description && touched.description ? "has-success" : "")}>
                                        <input type="text" className="form-control" value={this.state.documentItemEdit.description} name="description"
                                            placeholder={Resources.activityDescription[currentLanguage]}
                                            onBlur={e => { handleChange(e); handleBlur(e); }}
                                            onChange={e => this.handleChangeItems(e, "description")} />
                                        {errors.description && touched.description ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) :
                                            !errors.description && touched.description ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                                        {errors.description && touched.description ? (<em className="pError"> {errors.description} </em>) : null}
                                    </div>
                                </div>

                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">
                                        {Resources.activityId[currentLanguage]}
                                    </label>
                                    <div className={"ui input inputDev " + (errors.taskId && touched.taskId ? "has-error" : !errors.taskId && touched.taskId ? "has-success" : "")}>
                                        <input type="text" className="form-control" value={this.state.documentItemEdit.taskId} name="taskId"
                                            placeholder={Resources.activityId[currentLanguage]}
                                            onBlur={e => { handleChange(e); handleBlur(e); }}
                                            onChange={e => this.handleChangeItems(e, "taskId")} />
                                        {errors.taskId && touched.taskId ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) :
                                            !errors.taskId && touched.taskId ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                                        {errors.taskId && touched.taskId ? (<em className="pError"> {errors.taskId} </em>) : null}
                                    </div>
                                </div>

                                <div className="fillter-status fillter-item-c alternativeDate">
                                    <DatePicker title='startDate'
                                        startDate={this.state.documentItemEdit.startDate}
                                        handleChange={this.startDatehandleChangeForEdit} />
                                </div>

                                <div className="fillter-status fillter-item-c alternativeDate">
                                    <DatePicker title='finishDate'
                                        startDate={this.state.documentItemEdit.finishDate}
                                        handleChange={this.finishDatehandleChangeForEdit} />
                                </div>

                                <div className="fillter-status fillter-item-c mix_dropdown">
                                    <label className="control-label">{Resources.toCompany[currentLanguage]}</label>
                                    <div className="supervisor__company">
                                        <div className="super_name">
                                            <Dropdown
                                                isMulti={false}
                                                data={this.state.ToContacts}
                                                selectedValue={this.state.selectedToContact}
                                                handleChange={event => this.handleChangeDropDown(event, 'bicContactId', false, '', '', '', 'selectedToContact')}

                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.bicContactId}
                                                touched={touched.bicContactId}

                                                index="letter-bicContactId"
                                                name="bicContactId"
                                                id="bicContactId" />
                                        </div>
                                        <div className="super_company">
                                            <Dropdown
                                                isMulti={false}
                                                data={this.state.companies}
                                                selectedValue={this.state.selectedToCompany}
                                                handleChange={event =>
                                                    this.handleChangeDropDown(event, 'bicCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedToCompany', 'selectedToContact')}

                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.bicCompanyId}
                                                touched={touched.bicCompanyId}

                                                index="letter-bicCompanyId"
                                                name="bicCompanyId"
                                                id="bicCompanyId" />
                                        </div>
                                    </div>
                                </div>

                                <div className="slider-Btns fullWidthWrapper">
                                    {this.state.isViewMode === false ?
                                        (this.state.isLoading === false ?
                                            <button className="primaryBtn-1 btn meduimBtn" type="submit">{Resources["save"][currentLanguage]}</button>
                                            :
                                            <button className="primaryBtn-1 btn disabled">
                                                <div className="spinner">
                                                    <div className="bounce1" />
                                                    <div className="bounce2" />
                                                    <div className="bounce3" />
                                                </div>
                                            </button>)
                                        : null}
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )
        }

        let SecondStepItems = () => {
            return (
                <div className="subiTabsContent feilds__top">

                    <div className="document-fields">
                        <Formik
                            initialValues={{ ...this.state.documentItem }}
                            enableReinitialize={true}
                            validationSchema={validationItemsForAddEdit}
                            onSubmit={(values) => {
                                this.AddItems(values);
                            }}>

                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched, values }) => (
                                <Form id="scheduleItemForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                    <div className="doc-pre-cycle ">
                                        <header>
                                            <h2 className="zero">
                                                {Resources["items"][currentLanguage]}
                                            </h2>
                                        </header>
                                    </div>

                                    <div className="proForm first-proform">

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources.arrange[currentLanguage]}
                                            </label>
                                            <div className={"ui input inputDev"}>
                                                <input type="text" readOnly className="form-control" value='3' name="arrange" placeholder={Resources.arrange[currentLanguage]}
                                                    onBlur={e => { handleChange(e); handleBlur(e); }}
                                                    onChange={e => this.handleChangeItemsAdd(e, "arrange")} />
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources.status[currentLanguage]}</label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="letter-status" defaultChecked={this.state.documentItem.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                                <label>{Resources.oppened[currentLanguage]}</label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="letter-status" defaultChecked={this.state.documentItem.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
                                                <label>{Resources.closed[currentLanguage]}</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="proForm datepickerContainer">

                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <label className="control-label">
                                                {Resources.activityDescription[currentLanguage]}
                                            </label>
                                            <div className={"ui input inputDev " + (errors.description && touched.description ? "has-error" : !errors.description && touched.description ? "has-success" : "")}>
                                                <input type="text" className="form-control" value={this.state.documentItem.description} name="description"
                                                    placeholder={Resources.activityDescription[currentLanguage]}
                                                    onBlur={e => { handleChange(e); handleBlur(e); }}
                                                    onChange={e => this.handleChangeItemsAdd(e, "description")} />
                                                {errors.description && touched.description ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) :
                                                    !errors.description && touched.description ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                                                {errors.description && touched.description ? (<em className="pError"> {errors.description} </em>) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <label className="control-label">
                                                {Resources.activityId[currentLanguage]}
                                            </label>
                                            <div className={"ui input inputDev " + (errors.taskId && touched.taskId ? "has-error" : !errors.taskId && touched.taskId ? "has-success" : "")}>
                                                <input type="text" className="form-control" value={this.state.documentItem.taskId} name="taskId"
                                                    placeholder={Resources.activityId[currentLanguage]}
                                                    onBlur={e => { handleChange(e); handleBlur(e); }}
                                                    onChange={e => this.handleChangeItemsAdd(e, "taskId")} />
                                                {errors.taskId && touched.taskId ? (<span className="glyphicon glyphicon-remove form-control-feedback spanError" />) :
                                                    !errors.taskId && touched.taskId ? (<span className="glyphicon form-control-feedback glyphicon-ok" />) : null}
                                                {errors.taskId && touched.taskId ? (<em className="pError"> {errors.taskId} </em>) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input alternativeDate">
                                            <DatePicker title='startDate'
                                                startDate={this.state.documentItem.startDate}
                                                handleChange={this.startDatehandleChange} />
                                        </div>

                                        <div className="linebylineInput valid-input alternativeDate">
                                            <DatePicker title='finishDate'
                                                startDate={this.state.documentItem.finishDate}
                                                handleChange={this.finishDatehandleChange} />
                                        </div>

                                        <div className="linebylineInput valid-input mix_dropdown">
                                            <label className="control-label">{Resources.toCompany[currentLanguage]}</label>
                                            <div className="supervisor__company">
                                                <div className="super_name">
                                                    <Dropdown
                                                        isMulti={false}
                                                        data={this.state.ToContacts}
                                                        selectedValue={this.state.selectedToContact}
                                                        handleChange={event => this.handleChangeDropDown(event, 'bicContactId', false, '', '', '', 'selectedToContact')}

                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={errors.bicContactId}
                                                        touched={touched.bicContactId}

                                                        index="letter-bicContactId"
                                                        name="bicContactId"
                                                        id="bicContactId" />
                                                </div>
                                                <div className="super_company">
                                                    <Dropdown
                                                        isMulti={false}
                                                        data={this.state.companies}
                                                        selectedValue={this.state.selectedToCompany}
                                                        handleChange={event =>
                                                            this.handleChangeDropDown(event, 'bicCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedToCompany', 'selectedToContact')}

                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={errors.bicCompanyId}
                                                        touched={touched.bicCompanyId}

                                                        index="letter-bicCompanyId"
                                                        name="bicCompanyId"
                                                        id="bicCompanyId" />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="slider-Btns">
                                        {this.state.isViewMode === false ?
                                            (this.state.isLoading === false ?
                                                <button className="primaryBtn-1 btn meduimBtn" type="submit">{Resources["add"][currentLanguage]}</button>
                                                :
                                                <button className="primaryBtn-1 btn disabled">
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button>)
                                            : null}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                    <XSLfiel header="addManyActivities" />
                    <div className="doc-pre-cycle">
                        <header>
                            <h2 className="zero">{Resources.addedActivities[currentLanguage]}</h2>
                        </header>
                        {dataGrid}
                    </div>
                    <div className="slider-Btns">
                        <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>{Resources['next'][currentLanguage]}</button>
                    </div>
                </div>
            )
        }

        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }, {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }

        ]

        return (

            <div className="mainContainer">

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>

                    <div className="submittalHead">
                        <h2 className="zero">{Resources.schedule[currentLanguage]}
                            <span>{projectName.replace(/_/gi, ' ')} · {Resources.timeCordination[currentLanguage]}</span>
                        </h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                    <g id="Group">
                                                        <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                        <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="doc-container">
                        <div className="step-content">
                            {this.state.FirstStep ?

                                <div className="subiTabsContent">
                                    {this.state.isLoading ? <LoadingSection /> : null}
                                    <div className="document-fields">
                                        <Formik
                                            initialValues={{ ...this.state.document }}

                                            validationSchema={validationSchema}
                                            enableReinitialize={true}
                                            onSubmit={(values) => {
                                                this.AddEditDoc();
                                            }}>

                                            {({ errors, touched, handleBlur, values, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form id="scheduleForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

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

                                                    </div>

                                                    <div className="slider-Btns">
                                                        {this.showBtnsSaving()}
                                                    </div>

                                                    {this.state.IsEditMode === true && docId !== 0 ?
                                                        <div className="approveDocument">
                                                            <div className="approveDocumentBTNS">
                                                                <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={this.saveNCR}>{Resources.save[currentLanguage]}</button>

                                                                {this.state.isApproveMode === true ?
                                                                    <div >
                                                                        <button type="button" className="primaryBtn-1 btn " onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                                        <button type="button" className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                                                    </div>
                                                                    : null
                                                                }
                                                                <button className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                                                <button className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                                                                <span className="border"></span>
                                                                <div className="document__action--menu">
                                                                    <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : null
                                                    }
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                    {this.state.docId > 0 ?
                                        <div className="doc-pre-cycle">
                                            <div className="precycle-grid" style={{ marginBottom: '30px' }}>
                                                <header>
                                                    <h2 className="zero">{Resources.items[currentLanguage]}</h2>
                                                </header>
                                                <ReactTable data={this.state.scheduleItemData}
                                                    columns={columnsSchedule}
                                                    defaultPageSize={5}
                                                    noDataText={Resources["noData"][currentLanguage]}
                                                    className="-striped -highlight" />
                                            </div>
                                        </div>
                                        : null
                                    }
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId > 0 ?
                                                <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }
                                            {this.viewAttachments()}

                                            {this.props.changeStatus === true && docId > 0 ?
                                                <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }
                                        </div>
                                    </div>
                                    {this.state.docId > 0 ?
                                        <button className="primaryBtn-1 btn mediumBtn" onClick={this.NextStep}>{Resources.next[currentLanguage]}</button>
                                        : null}
                                </div>
                                :
                                <Fragment>
                                    {SecondStepItems()}
                                </Fragment>
                            }

                            <div className="skyLight__form">
                                <SkyLightStateless onOverlayClicked={() => this.setState({ showPopUp: false, IsEditModeItem: false, })}
                                    title={this.state.IsEditModeItem ? Resources['editTitle'][currentLanguage] : Resources['goAdd'][currentLanguage]}
                                    onCloseClicked={() => this.setState({ showPopUp: false, IsEditModeItem: false, })} isVisible={this.state.showPopUp}>
                                    {AddEditProjectScheduleItems()}
                                </SkyLightStateless>
                            </div>
                        </div>
                        {/* Right Menu */}
                        <div className="docstepper-levels">
                            {/* Next & Previous */}
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={!this.state.FirstStep && this.state.IsEditMode ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}><i className="fa fa-caret-left" aria-hidden="true"></i>{Resources['previous'][currentLanguage]}</span>

                                <span onClick={this.NextStep} className={this.state.IsEditMode ? "step-content-btn-prev "
                                    : "step-content-btn-prev disabled"}>{Resources['next'][currentLanguage]} <i className="fa fa-caret-right" aria-hidden="true"></i>
                                </span>
                            </div>
                            {/* Steps Active  */}
                            <div className="workflow-sliderSteps">
                                <div className="step-slider">
                                    <div data-id="step1" className={'step-slider-item ' + (this.state.SecondStepComplate ? "active" : 'current__step')} >
                                        <div className="steps-timeline">
                                            <span>1</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources['drawingList'][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div data-id="step2 " className={'step-slider-item ' + (this.state.SecondStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources['addDrawingListItems'][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                {
                    this.state.showDeleteModal === true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                        />
                    ) : null
                }

                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {this.state.currentComponent}
                    </SkyLight>
                </div>
            </div>
        )
    }

    GetData = (url, label, value, currState) => {
        let Data = []
        Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];

                Data.push(obj);

            });

            this.setState({
                [currState]: [...Data]
            });
        }).catch(ex => {
        });

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
        projectId: state.communication.projectId
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
)(withRouter(drawingListAddEdit))








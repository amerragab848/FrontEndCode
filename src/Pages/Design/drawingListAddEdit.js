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
import { toast } from "react-toastify";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
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
    projectTypeId: Yup.string().required(Resources['selectProjects'][currentLanguage])
        .nullable(true),
})

const ValidtionSchemaDrawItems = Yup.object().shape({
    details: Yup.string().required(Resources['isRequiredField'][currentLanguage]),
    scale: Yup.string().required(Resources['isRequiredField'][currentLanguage]),
    papers: Yup.string().required(Resources['isRequiredField'][currentLanguage]),
    estimateTime: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
})




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
                key: "details",
                name: Resources["details"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "paper",
                name: Resources["paper"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "scale",
                name: Resources["scale"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "estimatedTime",
                name: Resources["estimatedTime"][currentLanguage],
                width: 100,
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
            if (index == 0) {
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
            isLoading: true,
            CurrStep: 1,
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 39,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            permission: [{ name: 'sendByEmail', code: 307 }, { name: 'sendByInbox', code: 306 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 999 },
            { name: 'createTransmittal', code: 3085 }, { name: 'sendToWorkFlow', code: 745 },
            { name: 'viewAttachments', code: 3732 }, { name: 'deleteAttachments', code: 3733 }],
            selectDescipline: { label: Resources.selectDescipline[currentLanguage], value: "0" },
            selectProject: { label: Resources.selectProjects[currentLanguage], value: "0" },
            IsEditMode: false,
            showPopUp: false,
            IsAddModel: false,
            ProjectDropData: [],
            DesciplineDropData: [],
            ShowAddItem: false,
            IsEditModeItem: false,
            ItemForEdit: {},
            arrangeItems: 1,
            showDeleteModal: false,
            selectedRows: '',
            showPopUpProjectTask: false,
            sendingData: {
                projectId: projectId,
                docId: docId,
                docType: 39,
                bicContactId: "",
                arrange: "1",
                bicCompanyId: "",
                subject: "",
                priorityId: "",
                status: true,
                startDate: moment(),
                finishDate: moment(),
                estimatedTime: "",
            },

            PriorityData: [],
            ToCompany: [],
            contactData: []
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(302))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(302)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(302)) {
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

    handleChangeItems(e, field) {

        let original_document = { ...this.state.ItemForEdit };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            ItemForEdit: updated_document
        })

    }

    NextStep = () => {

        if (this.state.CurrStep === 1) {
            window.scrollTo(0, 0)
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
        if (docId > 0) {

            let url = "GetDesignDrawingListForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId ,'drawingList');
            this.setState({
                IsEditMode: true
            })

            this.FillDrowDowns()

            dataservice.GetDataGrid('GetProjectEstimateItemsByProjectEstimateId?projectEstimateId=' + this.state.docId + '').then(
                data => {
                    this.setState({
                        rows: data,
                    })
                })

        } else {
            ///Is Add Mode
            dataservice.GetNextArrangeMainDocument('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=' + this.state.docTypeId + '&companyId=undefined&contactId=undefined').then
                (
                res => {
                    let Doc = {
                        id: undefined, status: true, subject: '',
                        arrange: res, projectTypeId: '',
                        docDate: moment(), projectId: projectId,

                    }
                    this.setState({
                        document: Doc,

                    })
                }
                )


            this.FillDrowDowns()
        }


    }

    FillDrowDowns = () => {
        dataservice.GetDataList('GetAccountsDefaultList?listType=project_type&pageNumber=0&pageSize=10000', 'title', 'id').then(
            result => {
                this.setState({
                    ProjectDropData: result,
                    isLoading: false
                })
                if (docId !== 0) {
                    let elementID = this.state.document.projectTypeId;
                    let selectProject = _.find(result, function (i) { return i.value == elementID });
                    this.setState({
                        selectProject,
                        isLoading: false
                    })
                }
            }
        )
    }

    componentWillUnmount() {
        this.setState({
            docId: 0
        });
    }

    componentDidMount = () => {

        dataservice.GetDataList('GetDesignDiscipline?accountOwnerId=2&pageNumber=0&pageSize=10000', 'title', 'id').then(
            data => {
                this.setState({
                    DesciplineDropData: data,
                })
            })
        let url = "GetProjectProjectsCompaniesForList?projectId=" + projectId;
        this.GetData(url, 'companyName', 'companyId', 'ToCompany');
        this.GetData("GetAccountsDefaultList?listType=priority&pageNumber=0&pageSize=10000", 'title', 'id', 'PriorityData');
    }

    clickHandler = (e) => {
        let inboxDto = { ...this.state.sendingData };
        let id = ''
        this.state.selectedRows.map(i => {
            id = i
        })

        let seletedRowData = this.state.rows.filter(s => s.id === id)
        inboxDto.docId = seletedRowData[0]['id']
        inboxDto.estimatedTime = seletedRowData[0]['estimatedTime']
        console.log(inboxDto);
        Api.post("SaveDrawingListAsTask", inboxDto).then(
            res => {
                this.setState({
                    showPopUpProjectTask: false
                })
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
    }

    startDatehandleChange = (date) => {
        this.setState({ sendingData: { ...this.state.sendingData, startDate: date } });
    }

    finishDatehandleChange = (date) => {
        this.setState({ sendingData: { ...this.state.sendingData, finishDate: date } });
    }

    inputSubjectChangeHandler = (e) => {
        this.setState({ sendingData: { ...this.state.sendingData, subject: e.target.value } });
    }


    To_company_handleChange = (selectedOption) => {
        let url = "GetContactsByCompanyId?companyId=" + selectedOption.value;
        this.setState({
            sendingData: { ...this.state.sendingData, bicCompanyId: selectedOption.value },
        });
        this.GetData(url, "contactName", "id", "contactData");
    }

    Priority_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, priorityId: item.value },
        })
    }

    Contact_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, bicContactId: item.value },
        })
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

        if (item.value != "0") {
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
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
            [selectedValue]: event
        });
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
            pathname: '/drawingList/' + projectId + '',
        })
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
            this.NextStep()
        }
        else {
            this.setState({
                isLoading: true
            })

            let Doc = { ...this.state.document }
            Doc.docDate = moment(Doc.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')

            if (this.state.docId > 0) {
                dataservice.addObject('EditDesignDrawingList', Doc).then(
                    res => {
                        this.setState({
                            isLoading: false
                        })
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    })
                this.NextStep()

            }
            else {

                dataservice.addObject('AddDesignDrawingList', Doc).then(
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

    handleChangeDisciplineDrop = (e) => {
        this.setState({
            selectDescipline: e,
            isLoading: true,
        })
        if (e.value === '0') {
            this.setState({
                ShowAddItem: false
            })

        }
        else {

            this.setState({
                ShowAddItem: true,
            })

        }

        dataservice.GetDataGrid('GetDesignDrawingListItemsByDrawingListId?drawingId=' + this.state.docId + '&disciplineId=' + e.value + '').then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        )
    }

    ShowPopUpForEdit = (obj) => {
        this.setState({
            showPopUp: true,
            ItemForEdit: obj,
            IsEditModeItem: true
        })
    }

    AddEditItems = (values) => {
        this.setState({
            isLoading: true
        })
        if (this.state.IsEditModeItem) {
            dataservice.addObject('EditDesignDrawingListItems', this.state.ItemForEdit).then(
                res => {
                    this.setState({
                        rows: res,
                        isLoading: false,
                        showPopUp: false,
                        IsEditModeItem: false
                    })

                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                })
        }
        else {
            dataservice.addObject('AddDesignDrawingListItems', this.state.ItemForEdit).then(
                res => {
                    this.setState({
                        rows: res,
                        isLoading: false,
                        showPopUp: false,
                    })
                    this.GetMaxArrangeItem()
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                })
        }
    }

    GetMaxArrangeItem = () => {

        dataservice.GetNextArrangeMainDocument('GetNextArrangeItems?docId=' + this.state.docId + '&docType=' + this.state.docTypeId + '').then(
            res => {
                let ObjItem =
                    {
                        id: undefined, disciplineId: this.state.selectDescipline.value,
                        arrange: res, details: '',
                        scale: '', paper: '', estimatedTime: '',
                        drawingListId: this.state.docId
                    }
                this.setState({
                    arrangeItems: res,
                    ItemForEdit: ObjItem
                })
            }
        )
    }

    ShowPopUpForAdd = () => {
        this.setState({ showPopUp: true, IsEditModeItem: false })
        this.GetMaxArrangeItem()
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
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

    TaskGroupFun = (selectedRows) => {
        console.log(selectedRows)
    }

    ProjectTaskFun = (selectedRows) => {
        this.setState({
            showPopUpProjectTask: true,
            selectedRows
        })
    }

    ConfirmDelete = () => {
        this.setState({
            isLoading: true
        })
        Api.post('DeleteMultipleDesignDrawingListItemsById', this.state.selectedRows).then(
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

        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox} minHeight={350}
                    onRowClick={this.ShowPopUpForEdit}
                    clickHandlerDeleteRows={this.DeleteItem}
                    Panels={true} TaskGroupFun={this.TaskGroupFun} ProjectTaskFun={this.ProjectTaskFun}
                    single={true}
                />
            ) : <LoadingSection />

        let SecondStepItems = () => {
            return (
                < div className="subiTabsContent feilds__top">

                    <div className='document-fields'>
                        <div className="proForm datepickerContainer">
                            <div className="proForm first-proform fullWidthWrapper textLeft">
                                <div className='ui input inputDev linebylineInput '>
                                    <Dropdown title='descipline' data={this.state.DesciplineDropData}
                                        selectedValue={this.state.selectDescipline}
                                        handleChange={(e) => this.handleChangeDisciplineDrop(e)} />
                                </div>
                                <div className='ui input inputDev linebylineInput '>
                                    {this.state.ShowAddItem ? <button className="primaryBtn-1 btn meduimBtn" onClick={this.ShowPopUpForAdd}>Add</button> : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="doc-pre-cycle">
                        <div className="filterBTNS">
                        </div>
                        {dataGrid}
                    </div>
                    <div className="slider-Btns">
                        <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>{Resources['next'][currentLanguage]}</button>
                    </div>
                </div>
            )
        }

        let AddEditDrawingListItems = () => {
            return (
                <div>

                    <Formik
                        initialValues={{
                            details: this.state.IsEditModeItem ? this.state.ItemForEdit.details : '',
                            scale: this.state.IsEditModeItem ? this.state.ItemForEdit.scale : '',
                            papers: this.state.IsEditModeItem ? this.state.ItemForEdit.paper : '',
                            estimateTime: this.state.IsEditModeItem ? this.state.ItemForEdit.estimatedTime : '',
                            arrangeItems: this.state.ItemForEdit.arrange,
                        }}

                        enableReinitialize={true}

                        validationSchema={ValidtionSchemaDrawItems}

                        onSubmit={(values, actions) => {
                            this.AddEditItems(values)
                        }}>

                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>


                                <div className='dropWrapper'>
                                    <div className="proForm customProform">

                                        <div className="fullWidthWrapper textLeft">
                                            <label className="control-label">{Resources['details'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.details && touched.details ? 'has-error' : null) + ' '}>
                                                <input autoComplete="off" value={this.state.ItemForEdit.details} className="form-control" name="details"
                                                    onChange={(e) => this.handleChangeItems(e, 'details')} onBlur={(e) => {
                                                        handleChange(e)
                                                        handleBlur(e)
                                                    }}
                                                    placeholder={Resources['details'][currentLanguage]} />
                                                {errors.details && touched.details ? (<em className="pError">{errors.details}</em>) : null}
                                            </div>
                                        </div>

                                        <div className="fillter-status fillter-item-c">
                                            <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                            <div className="ui input inputDev"  >
                                                <input type="text" className="form-control" id="arrangeItems" readOnly
                                                    value={this.state.ItemForEdit.arrange} placeholder={Resources.arrange[currentLanguage]}
                                                    onChange={(e) => this.handleChangeItems(e, 'arrange')} onBlur={(e) => {
                                                        handleChange(e)
                                                        handleBlur(e)
                                                    }} name="arrangeItems" />
                                            </div>
                                        </div>


                                        <div className="fillter-status fillter-item-c">
                                            <label className="control-label">{Resources['scale'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.scale && touched.scale ? 'has-error' : null) + ' '}>
                                                <input autoComplete="off" value={this.state.ItemForEdit.scale} className="form-control" name="scale"
                                                    onBlur={(e) => {
                                                        handleBlur(e)
                                                        handleChange(e)
                                                    }}
                                                    onChange={(e) => this.handleChangeItems(e, 'scale')}

                                                    placeholder={Resources['scale'][currentLanguage]} />
                                                {errors.scale && touched.scale ? (<em className="pError">{errors.scale}</em>) : null}
                                            </div>
                                        </div>

                                        <div className="fillter-status fillter-item-c">
                                            <label className="control-label">{Resources['paper'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.papers && touched.papers ? 'has-error' : null) + ' '}>
                                                <input autoComplete="off" value={this.state.ItemForEdit.paper} className="form-control" name="papers"
                                                    onBlur={(e) => {
                                                        handleBlur(e)
                                                        handleChange(e)
                                                    }}
                                                    onChange={(e) => this.handleChangeItems(e, 'paper')}
                                                    placeholder={Resources['paper'][currentLanguage]} />
                                                {errors.papers && touched.papers ? (<em className="pError">{errors.papers}</em>) : null}
                                            </div>
                                        </div>

                                        <div className="fillter-status fillter-item-c">
                                            <label className="control-label">{Resources['estimateTime'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.estimateTime && touched.estimateTime ? 'has-error' : null) + ' '}>
                                                <input autoComplete="off" value={this.state.ItemForEdit.estimatedTime} className="form-control" name="estimateTime"
                                                    onBlur={(e) => {
                                                        handleBlur(e)
                                                        handleChange(e)
                                                    }}
                                                    onChange={(e) => this.handleChangeItems(e, 'estimatedTime')}
                                                    placeholder={Resources['estimateTime'][currentLanguage]} />
                                                {errors.estimateTime && touched.estimateTime ? (<em className="pError">{errors.estimateTime}</em>) : null}
                                            </div>
                                        </div>

                                    </div>
                                    <div className="slider-Btns fullWidthWrapper">
                                        <button className="primaryBtn-1 btn meduimBtn" type='submit' >ADD</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
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

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ showPopUp: false, IsEditModeItem: false })}
                        title={this.state.IsEditModeItem ? Resources['editTitle'][currentLanguage] : Resources['goAdd'][currentLanguage]}
                        onCloseClicked={() => this.setState({ showPopUp: false, IsEditModeItem: false })} isVisible={this.state.showPopUp}>
                        {AddEditDrawingListItems()}
                    </SkyLightStateless>
                </div>

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ showPopUpProjectTask: false })}
                        title={Resources['projectTask'][currentLanguage]}
                        onCloseClicked={() => this.setState({ showPopUpProjectTask: false })} isVisible={this.state.showPopUpProjectTask}>
                        <div className="dropWrapper">
                            <InputMelcous fullwidth='true' title='subject'
                                placeholderText='subject'
                                defaultValue={Resources['Task'][currentLanguage] + ':'}
                                inputChangeHandler={this.inputSubjectChangeHandler} />

                            <Dropdown title='toCompany'
                                data={this.state.ToCompany} handleChange={this.To_company_handleChange}
                                placeholder='selectCompany' />

                            <Dropdown title='ContactName'
                                data={this.state.contactData} handleChange={this.Contact_handelChange}
                                placeholder='selectContact' />

                            <DatePicker title='startDate'
                                startDate={this.state.sendingData.startDate}
                                handleChange={this.startDatehandleChange} />

                            <DatePicker title='finishDate'
                                startDate={this.state.sendingData.finishDate}
                                handleChange={this.finishDatehandleChange} />

                            <Dropdown title='priority' data={this.state.PriorityData}
                                handleChange={this.Priority_handelChange}
                                placeholder='prioritySelect' />

                            <div className="fullWidthWrapper">
                                <button className="primaryBtn-1 btn" onClick={this.clickHandler}>
                                    {Resources['save'][currentLanguage]}</button>
                            </div>

                        </div>
                    </SkyLightStateless>
                </div>


                {/* {this.state.isLoading ? <LoadingSection /> : null} */}

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                <HeaderDocument projectName={projectName} docTitle={Resources.drawingList[currentLanguage]} moduleTitle={Resources['designCoordination'][currentLanguage]} />

                    {/* <div className="submittalHead">
                        <h2 className="zero">{Resources.drawingList[currentLanguage]}
                            <span>{projectName.replace(/_/gi, ' ')} · {Resources.designCoordination[currentLanguage]}</span>
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
                    </div> */}

                    <div className="doc-container">

                        <div className="step-content">
                            {this.state.FirstStep ?
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
                                                            <Dropdown title="projectType" data={this.state.ProjectDropData} name="projectTypeId"
                                                                selectedValue={this.state.selectProject}
                                                                onChange={setFieldValue}
                                                                handleChange={event => this.handleChangeDropDown(event, 'projectTypeId', false, '', '', '', 'selectProject')}
                                                                onBlur={setFieldTouched}
                                                                error={errors.projectTypeId}
                                                                touched={touched.projectTypeId}
                                                                value={values.projectTypeId} />
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
                                                                        <button className="primaryBtn-1 btn " type="button" onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                                        <button className="primaryBtn-2 btn middle__btn" type="button" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>


                                                                    </div>
                                                                    : null
                                                                }
                                                                <button type="button" className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                                                <button type="button" className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
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


                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId !== 0 ?
                                                <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }
                                            {this.viewAttachments()}

                                            {this.props.changeStatus === true && docId !== 0 ?
                                                <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                :
                                <Fragment>
                                    {SecondStepItems()}
                                </Fragment>
                            }
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

                                    <div data-id="step2 " className={'step-slider-item ' + (this.state.ThirdStepComplate ? 'active' : this.state.SecondStepComplate ? "current__step" : "")} >
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

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null}


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


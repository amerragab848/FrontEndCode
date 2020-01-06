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
// import GridSetup from "../Communication/GridSetup";
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight from 'react-skylight';
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Api from "../../api";
import Steps from "../../Componants/publicComponants/Steps";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";
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
            { title: '', type: 'check-box', fixed: true, field: 'id' },
           
            {
                field: "details",
                title: Resources["details"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
               
                sortable: true,
                type: "text"

            },
            {
                field: "paper",
                title: Resources["paper"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
              
                sortable: true,
                type: "text"
            },
            {
                field: "scale",
                title: Resources["scale"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                sortable: true,
               type:"text"
            },
            {
                field: "estimatedTime",
                title: Resources["estimatedTime"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                sortable: true,
                type:"text"
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
                    perviousRoute = obj.perviousRoute;
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
            isLoading: true,
            CurrentStep: 0,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
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


        if (!Config.IsAllow(301) && !Config.IsAllow(302) && !Config.IsAllow(303)) {

            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/drawingList/" + this.state.projectId);
        }
      
        steps_defination = [
            {
                name: "drawingList",
                callBackFn: null
            },
            {
                name: "addDrawingListItems",
                callBackFn: null
            }
        ];
        this.actions = [
            {
                title: 'Delete',
                handleClick: selectedRows => {
                    console.log(selectedRows);
                    this.setState({
                        showDeleteModal: true,
                        selectedRows
            
                    })
                },
                classes: '',
            }, {
                title: 'TaskGroup',
                handleClick: selectedRows => {
                    console.log(selectedRows);
                   
                },
                classes: 'autoGridBtn',
            },
            {
                title: 'ProjectTasks',
                handleClick: selectedRows => {
                    this.setState({
                        showPopUpProjectTask: true,
                        selectedRows
                    })
                   
                },
                classes: 'autoGridBtn',
            }
        ];
        this.rowActions = [];
        this.groups=[];
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

    handleChangeItems(e, field) {

        let original_document = { ...this.state.ItemForEdit };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            ItemForEdit: updated_document
        })

    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrentStep: stepNo });
    };

    componentWillMount() {
        if (docId > 0) {

            let url = "GetDesignDrawingListForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'drawingList');
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
        dataservice.GetDataListCached('GetAccountsDefaultListForList?listType=project_type', 'title', 'id', 'defaultLists', "project_type", "listType").then(
            result => {
                this.setState({
                    ProjectDropData: result,
                    isLoading: false
                })
                if (docId !== 0) {
                    let elementID = this.state.document.projectTypeId;
                    let selectProject = find(result, function (i) { return i.value == elementID });
                    this.setState({
                        selectProject,
                        isLoading: false
                    })
                }
            }
        )
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({ docId: 0 });
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
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={3733} />
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
                this.changeCurrentStep(1);

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

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    render() {

        const dataGrid =
            this.state.isLoading === false ? (
                // <GridSetup rows={this.state.rows} 
                //     columns={this.state.columns}
                //     showCheckbox={this.state.showCheckbox} 
                //     minHeight={350}
                //     onRowClick={this.ShowPopUpForEdit}
                //     clickHandlerDeleteRows={this.DeleteItem}
                //     Panels={true} 
                //     TaskGroupFun={this.TaskGroupFun} 
                //     ProjectTaskFun={this.ProjectTaskFun}
                //     single={true}
                // />
                <GridCustom
                cells={this.state.columns}
                data={this.state.rows}
                groups={[]}
                pageSize={50}
                actions={this.actions}
                rowActions={this.rowActions}
                rowClick={obj => {
                    this.setState({
                        showPopUp: true,
                        ItemForEdit: obj,
                        IsEditModeItem: true
                    })
                }}
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
                        <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(2)}>{Resources['next'][currentLanguage]}</button>
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
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.drawingList[currentLanguage]} moduleTitle={Resources['designCoordination'][currentLanguage]} />
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
                                                if (this.props.showModal) { return; }

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

                                                                {this.state.isLoading ?
                                                                    <button className="primaryBtn-1 btn disabled">
                                                                        <div className="spinner">
                                                                            <div className="bounce1" />
                                                                            <div className="bounce2" />
                                                                            <div className="bounce3" />
                                                                        </div>
                                                                    </button> :
                                                                    <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={this.saveNCR} type="submit">{Resources.save[currentLanguage]}</button>
                                                                }
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
                                            {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={3730} EditAttachments={3731} ShowDropBox={3734} ShowGoogleDrive={3735} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true && docId !== 0 ? <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null}
                                        </div>
                                    </div>
                                </div>
                                :
                                <Fragment>
                                    {SecondStepItems()}
                                </Fragment>
                            }
                        </div>
                        <Steps
                            steps_defination={steps_defination}
                            exist_link="/drawingList/"
                            docId={this.state.docId}
                            changeCurrentStep={stepNo =>
                                this.changeCurrentStep(stepNo)
                            }
                            stepNo={this.state.CurrentStep} changeStatus={docId === 0 ? false : true}
                        />
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
)(withRouter(drawingListAddEdit))


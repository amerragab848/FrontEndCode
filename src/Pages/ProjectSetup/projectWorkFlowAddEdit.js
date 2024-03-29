import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Config from "../../Services/Config";
import { toast } from "react-toastify";
import Resources from "../../resources.json";
import Api from '../../api';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import dataservice from "../../Dataservice"
import * as communicationActions from '../../store/actions/communication';
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import DatePicker from '../../Componants/OptionsPanels/DatePicker';
import SkyLight from 'react-skylight';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import { SkyLightStateless } from 'react-skylight';
import Recycle from '../../Styles/images/attacheRecycle.png'
import Steps from "../../Componants/publicComponants/Steps";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument';
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

import find from 'lodash/find';
import filter from 'lodash/filter';
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;

var steps_defination = [];

let selectedRows = [];
steps_defination = [
    { name: "workFlow", callBackFn: null },
    { name: "contacts", callBackFn: null },
    { name: "followingUps", callBackFn: null },
    { name: "docType", callBackFn: null },
    { name: "multiApproval", callBackFn: null },
];

const ValidtionSchemaContactsForAdd = Yup.object().shape({
    Company: Yup.string()
        .required(Resources['toCompanyRequired'][currentLanguage])
        .nullable(true),
    ContactName: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage])
        .nullable(true),
    levelNo: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
});

const ValidtionSchemaDocumentTypeDrop=Yup.object().shape({
     DocumentTypeDrop: Yup.string()
        .required(Resources['selectDocType'][currentLanguage])
        .nullable(true),
});

const ValidtionSchemaDocumentType = Yup.object().shape({
    DocumentTypeDrop: Yup.string()
        .required(Resources['selectDocType'][currentLanguage])
        .nullable(true),
    redAlert: Yup.number()
        .required(Resources['redAlertDaysRequired'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
    yellowAlert: Yup.number()
        .required(Resources['yellowAlertDaysRequired'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
    GreenAlert: Yup.number()
        .required(Resources['greenAlertDaysRequired'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
});

const ValidtionSchemaForFollowUps = Yup.object().shape({
    CompanyFollowUp: Yup.string()
        .required(Resources['toCompanyRequired'][currentLanguage])
        .nullable(true),
    ContactNameFollowUp: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage])
        .nullable(true),
});

const ValidtionSchemaContactsForEdit = Yup.object().shape({
    levelNoForEdit: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
});

const validationSchemaForAddEditWorkFlow = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    alertDays: Yup.number().required(Resources['isRequiredField'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]),
    rejectionOptions: Yup.string().required(Resources['rejectionOption'][currentLanguage]).nullable(true)
})

class projectWorkFlowAddEdit extends Component {

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

        const columnsGrid = [
            { title: '', type: 'check-box', fixed: true, field: 'id',width:10 },
            {
                "field": "arrange",
                "title": Resources.numberAbb[currentLanguage],
                "type": "text",
                "width": 8,
                "groupable": true,
                "sortable": true
            }, {
                "field": "companyName",
                "title": Resources.CompanyName[currentLanguage],
                "type": "text",
                "width": 20,
                "groupable": true,
                "sortable": true
            }, {
                "field": "contactName",
                "title": Resources.ContactName[currentLanguage],
                "type": "text",
                "width": 20,
                "groupable": true,
                "sortable": true
            }, {
                "field": "description",
                "title": Resources.description[currentLanguage],
                "type": "text",
                "width": 20,
                "groupable": true,
                "sortable": true
            }, {
                "field": "approvalStatusText",
                "title": Resources.approvalText[currentLanguage],
                "type": "text",
                "width": 20,
                "groupable": true,
                "sortable": true
            }
        ];

        this.state = {
            DistributionList: [],
            IsAddModel: false,
            CurrStep: 0,
            rows: [],
            showDeleteModal: false,
            selectedRows: [],
            showCheckbox: true,
            columns: columnsGrid.filter(column => column.visible !== false),
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 16,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            RejectionOptionData: [],
            NextWorkFlowData: [],
            IsLoadingCheckCode: false,
            durationLoading: false,
            selectedRejectionOptions: {},
            selectedNextWorkFlow: {},
            CompanyData: [],
            FollowUpsData: [],
            DocumentType: [],
            DocumentTypeDropData: [],
            MultiApprovalData: [],
            LevelDurationData: [],
            LevelDurationUpdateList: [],
            ApprovalData: [],
            ContactDataForEdit: {},
            SelectedContactForEditContacts: {},
            SelectedContactForEditContacts: {},
            rowIdFollowUp: [],
            indexFollowUp: '',
            WorkFlowDocumentData: [],
            NewMultiApprovalData: [],
            SelectedApproval: { label: "Select Approval", value: "0" },
            selectedDistributionList: { label: "Select Distribution List", value: "0" },
            permission: [{ name: 'sendByEmail', code: 606 }, { name: 'sendByInbox', code: 605 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 949 },
            { name: 'createTransmittal', code: 3035 }, { name: 'sendToWorkFlow', code: 702 }],
            IsAddModel: false
        }

        if (!Config.IsAllow(600) && !Config.IsAllow(601) && !Config.IsAllow(603)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: '/WorkFlow/' + projectId + '',
            });
        }
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }

        if (prevProps.showModal != this.props.showModal) {
            this.setState({ showModal: this.props.showModal });
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(601))) {
                this.setState({ isViewMode: true });
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (this.state.isApproveMode != true && Config.IsAllow(601)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(601)) {
                        if (this.props.document.status !== false && Config.IsAllow(601)) {
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

    handleShowAction = (item) => {
        if (item.title == "sendToWorkFlow") { this.props.actions.SendingWorkFlow(true); }

        if (item.value != "0") {
            this.props.actions.showOptionPanel(false);

            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })

            this.simpleDialog.show()
        }
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{this.state.IsAddModel ? Resources.next[currentLanguage] : Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = this.state.isViewMode === false ?
                <button className="primaryBtn-1 btn mediumBtn" >{Resources.next[currentLanguage]}</button> : null
        }
        return btn;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            let doc = nextProps.document
            doc.docDate = doc.docDate === null ? moment().format('YYYY-MM-DD') : moment(doc.docDate).format('YYYY-MM-DD')
            doc.code = doc.code === null ? '' : doc.code
            this.setState({
                document: doc,
                IsEditMode: true,
                hasWorkflow: nextProps.hasWorkflow,
            });
            this.FillDropDowns(true)

            this.checkDocumentIsView();
        }
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        })

        if (docId > 0) {
            let url = "GetWorkFlowForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'workFlow').then(
                res => {
                    this.setState({
                        isLoading: false
                    })
                }
            )

            this.setState({
                IsEditMode: true,
            })

            dataservice.GetDataGrid('GetWorkFlowItemsByWorkFlowId?workFlow=' + this.state.docId).then(
                res => {
                    this.setState({
                        IsEditMode: true,
                        rows: res,
                        isLoading: false
                    })
                    let data = { items: res };
                    this.props.actions.ExportingData(data);
                }
            )
            dataservice.GetDataGrid('getFollowingUpsByWorkFlowId?workFlow=' + this.state.docId).then(
                res => {
                    this.setState({
                        FollowUpsData: res
                    })

                   this.props.actions.ExportingDataSec({secItems:res});

                }

            )

            dataservice.GetDataGrid('GetWorkFlowItemsByWorkFlowIdLevel?workFlow=' + this.state.docId).then(
                res => {
                    this.setState({
                        MultiApprovalData: res,
                        NewMultiApprovalData: res
                    })
                }
            )
            dataservice.GetDataGrid('GetProjectWorkFlowLevelByWorkFlowId?workFlow=' + this.state.docId).then(
                res => {
                    this.setState({
                        LevelDurationData: res
                    })
                }
            )
            dataservice.GetDataGrid('GetWorkFlowDocumentsByWorkFlowId?workFlow=530').then(
                res => {
                    this.setState({
                        WorkFlowDocumentData: res,
                        isLoading: false
                    })
                }
            )
        }
        else {
            let cmi = Config.getPayload().cmi
            let cni = Config.getPayload().cni
            dataservice.GetRowById('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=' + this.state.docTypeId + '&companyId=' + cmi + '&contactId=' + cni + '').then(
                res => {
                    let WorkFlowDoc = {
                        projectId: projectId,
                        alertDays: 0,
                        arrange: res,
                        closeAfterApproval: true,
                        code: '',
                        docDate: moment(),
                        docId: '',
                        nextWorkFlowId: '',
                        rejectionOptions: '',
                        status: true,
                        subject: '',
                        useSelection: true,
                        distributionId: ''
                    }
                    this.setState({
                        document: WorkFlowDoc
                    })
                }
            )
            this.FillDropDowns(false)
            this.props.actions.documentForAdding();
        }

        dataservice.GetDataList('GetAccountsDocType', 'docType', 'id').then(
            res => {
                this.setState({
                    DocumentTypeDropData: res,
                })
            }
        )

        dataservice.GetDataListCached('GetProjectProjectsCompaniesForList?projectId=' + projectId + '', 'companyName', 'companyId', 'companies', this.state.projectId, "projectId").then(
            res => {
                this.setState({
                    CompanyData: res,
                })
            }
        )
    }

    handleChangeDrops = (item, name) => {
        switch (name) {
            case "DocumentTypeDrop":
               this.setState({ DocumentTypeDrop: item })
                break;
            case "ProjectName":
                this.setState({ selectedProject: item })
                break;

            case 'multiApproval':
                this.setState({ selectedMultiApproval: item })
                break;

            case 'ContactName':
                this.setState({ SelectedContact: item })
                break;
            case 'Approval':
                this.setState({ SelectedApproval: item })
                break;
            case 'SelectedCompanyForEditContacts':
                this.setState({ SelectedCompanyForEditContacts: item })
            case 'Company':
                this.setState({ SelectedCompany: item })
                if (item !== null) {
                    dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + item.value + '', 'contactName', 'id').then(
                        res => {
                            this.setState({
                                ContactData: res,
                            })
                        }
                    )
                }
                break;
            case 'CompanyFollowUp':
                //this.setState({ SelectedCompany: item })
                if (item !== null) {
                    dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + item.value + '', 'contactName', 'accountId').then(
                        res => {
                            this.setState({
                                ContactData: res,
                            })
                        }
                    )
                }
                break;

            default:
                break;
        }
    }

    handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource,subDatasourceId) {
       
        let original_document = { ...this.state.document };
        let updated_document = {};
        if (event == null) {
                updated_document[field] = event;
                updated_document[subDatasourceId] = event;
            this.setState({
                
                [subDatasource]: event
            });
         }else{
            
         }
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
            [selectedValue]: event
        });
    }

    handleBlurCheckCode = (value) => {

        if (value.target.value !== '') {
            this.setState({ IsLoadingCheckCode: true })
            dataservice.GetRowById('CheckWorkFlowCode?projectId=3527&code=' + value.target.value + '&id=' + this.state.docId + '').then(
                res => {
                    let Reuslt = res
                    if (Reuslt === true) {
                        toast.error(Resources['projectAddErrorMessagesReferenceCodeExists'][currentLanguage])
                        this.setState({ IsLoadingCheckCode: false })
                        let original_document = { ...this.state.document };

                        let updated_document = {};

                        updated_document['code'] = '';

                        updated_document = Object.assign(original_document, updated_document);

                        this.setState({
                            document: updated_document
                        });
                    }
                    else {
                        this.setState({ IsLoadingCheckCode: false })
                    }
                }
            )
        }

    }

    handleChange(e, field) {
        let updated_document = this.state.document
        updated_document[field] = e.target.value;
        this.setState({
            document: updated_document
        });
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

    FillDropDowns = (isEdit) => {
        dataservice.GetDataList('GetDefaultListForList?listType=rejectionOptions', 'title', 'id').then(res => {

            this.setState({
                RejectionOptionData: res,
                isLoading: false
            })
            if (isEdit === true) {
                let RejectionOptionsId = this.state.document.rejectionOptions;
                let selectedRejectionOptions = find(res, function (i) { return i.value == RejectionOptionsId });

                this.setState({
                    selectedRejectionOptions: selectedRejectionOptions,
                })
            }
        })

        dataservice.GetDataList('GetDefaultListForList?listType=WFApprovalstatus', 'title', 'id').then(res => {

            this.setState({
                ApprovalData: res,
                isLoading: false
            })
        })

        dataservice.GetDataList('ProjectWorkFlowGetList?projectId=' + projectId + '', 'subject', 'id').then(result => {

            this.setState({
                NextWorkFlowData: result,
                isLoading: false
            })

            if (isEdit === true) {
                let NextWorkFlowId = this.state.document.nextWorkFlowId;
                let selectedNextWorkFlow = find(result, function (i) { return i.value == NextWorkFlowId });
                this.setState({
                    selectedNextWorkFlow: selectedNextWorkFlow
                })
            }
        })

        //DistributionList
        dataservice.GetDataList('GetProjectDistributionListByProjectId?projectId=' + projectId + '', 'subject', 'id').then(result => {

            this.setState({
                DistributionList: result,
                isLoading: false
            })

            if (isEdit === true) {
                let distributionId = this.state.document.distributionId;
                let selectedDistributionList = find(result, function (i) { return i.value == distributionId });
                this.setState({
                    selectedDistributionList: selectedDistributionList
                })
            }
        })
    }

    AddEditWorkFlow = () => {
        if (this.state.IsAddModel) {
            this.changeCurrentStep(1)
        }
        else {

            let WorkFlowObj = this.state.document
            WorkFlowObj.docDate = moment(WorkFlowObj.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS')

            if (this.props.changeStatus) {
                dataservice.addObject('EditWorkFlow', WorkFlowObj).then(res => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });
                this.changeCurrentStep(1)
            }
            else {
                dataservice.addObject('AddWorkFlow', WorkFlowObj).then(res => {
                    this.setState({
                        docId: res.id,
                        IsAddModel: true
                    })
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });

                this.changeCurrentStep(1)
            }
        }
    }

    AddContact = (values, actions) => {
        this.setState({
            isLoading: true
        })
        let contactData = this.state.rows
        let ValidLeaveAndContactId = contactData.filter(s => s.contactId === values.ContactName.value
            && s.arrange === parseInt(values.levelNo))

        if (!ValidLeaveAndContactId.length) {
            Api.post('AddWorkFlowItem',
                {
                    id: 1,
                    arrange: values.levelNo,
                    companyId: values.Company.value,
                    contactId: values.ContactName.value,
                    Description: values.Description,
                    Duration: values.Duration,
                    workFlowId: this.state.docId,
                    multiApproval: false,
                    approvalId: values.approvalText!==null?values.approvalText.value:null
                }
            ).then(
                res => {
                    values.ArrangeContact = Math.max.apply(Math, res.map(function (o) { return o.arrange + 1 }))
                    this.setState({
                        rows: res,
                        isLoading: false,
                    })
                    let data = { items: res };
                    this.props.actions.ExportingData(data);
                    toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
                    values.Company = ''
                    values.ContactName = ''
                    values.Description = ''
                    Api.get('GetWorkFlowItemsByWorkFlowIdLevel?workFlow=' + this.state.docId + '').then(
                        result => {
                            this.setState({
                                MultiApprovalData: result,
                                NewMultiApprovalData: result
                            })
                        }
                    )
                }
            )
        }
        else {
            setTimeout(() => {
                this.setState({
                    isLoading: false,
                })
            }, 300);
            toast.error('This Contact Already Exist in Same Level ....')
            values.ContactName = ''
        }
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false, showDeleteModalFollowUp: false, showDeleteModalDocType: false });
    }

    clickHandlerDeleteRowsMain = (selectedRows) => {
        this.setState({
            selectedRows,
            showDeleteModal: true
        })
    }

    ConfirmDelete = () => {
        this.setState({
            isLoading: true
        })
        Api.post('WorkFlowItemsByWorkFlowIdObservableMultipleDelete', this.state.selectedRows).then(
            res => {
                let originalRows = this.state.rows

                this.state.selectedRows.map(i => {
                    originalRows = originalRows.filter(r => r.id !== i);
                })
                let data = { items: originalRows };
                this.props.actions.ExportingData(data);
                this.setState({
                    rows: originalRows,
                    showDeleteModal: false,
                    isLoading: false,
                    MaxArrange: Math.max.apply(Math, originalRows.map(function (o) { return o.arrange + 1 }))
                })
            },
            toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
        ).catch(ex => {
            this.setState({
                isLoading: false,

            })
        });
    }
    toggleRow(e, row) {

        this.setState({
            durationLoading: true
        });

        const newSelected = {};
        var obj = {};

        var oldList = this.state.LevelDurationUpdateList;
        var newList = [];
        var sendedList = [];

        sendedList = oldList.length > 0 ? filter(this.state.LevelDurationUpdateList, function (i) { return i.level != row.arrange }) : [];
        obj.level = row.arrange;
        obj.value = e.target.value;

        sendedList.push(obj);

        this.state.LevelDurationData.forEach(item => {
            if (row.id == item.id) {
                item.arrange = item.arrange;
                item.duration = e.target.value;
                newList.push(item);
            } else {
                newList.push(item);
            }
        });

        this.setState({
            LevelDurationData: newList,
            LevelDurationUpdateList: sendedList,
            durationLoading: false
        });
    }

    UpdateDurationLevel = () => {

        Api.post('UpdateWorkFlowItemsDuration?workFlow=' + this.state.docId,
            this.state.LevelDurationUpdateList
        ).then(res => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
    }
    EditContact = (values, actions) => {

        this.setState({
            isLoading: true
        })
        let arrange = this.state.ContactDataForEdit.arrange
        let ValidLeaveAndContactId = []
        if (arrange !== parseInt(values.levelNoForEdit)) {
            let contactData = this.state.rows
            ValidLeaveAndContactId = contactData.filter(s => s.contactId === values.SelectedContactForEditContacts.value
                && s.arrange === parseInt(values.levelNoForEdit))
        }
        if (!ValidLeaveAndContactId.length) {
            Api.post('EditFmWorkFlowItems',
                {
                    id: this.state.ContactDataForEdit.id,
                    arrange: values.levelNoForEdit,
                    companyId: this.state.SelectedCompanyForEditContacts!==null?this.state.SelectedCompanyForEditContacts.value:null,
                    contactId: values.SelectedContactForEditContacts!==null?values.SelectedContactForEditContacts.value:null,
                    Description: values.DescriptionForEdit,
                    workFlowId: this.state.docId,
                    multiApproval: false,
                    Duration: values.Duration,
                    //approvalId: values.approvalText.value
                    approvalId: this.state.SelectedApproval!==null?this.state.SelectedApproval.value:null
                }
            ).then(
                res => {
                    let data = this.state.rows.filter(s => s.id !== this.state.ContactDataForEdit.id)
                    data.unshift(res)
                    this.setState({
                        rows: data,
                        isLoading: false,
                        showPopUp: false,
                    })
                    let Data = { items: data };
                    this.props.actions.ExportingData(Data);
                    toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
                }
            )
        }
        else {
            values.SelectedCompanyForEditContacts = ''
            setTimeout(() => {
                this.setState({
                    isLoading: false,
                    showPopUp: false,
                })
            }, 300);
            toast.error('This Contact Already Exist in Same Level ....')
        }

    }

    AddFollowUps = (values) => {
        this.setState({ IsLoadingCheckCode: true })

        let FollowUps = {
            workFlowId: this.state.docId, followingUpsContactId: '',
            accountId: values.ContactNameFollowUp.value,
            followingUpsCompanyId: values.CompanyFollowUp.value
        }

        Api.post('AddFollowingUps', FollowUps).then(
            res => {
                if (res === "isExist") {
                    this.setState({
                        IsLoadingCheckCode: false
                    })
                    toast.error(Resources['operationCanceled'][currentLanguage])
                    values.ContactNameFollowUp = ''
                }

                else {
                    let FollowUpsDataCopy = this.state.FollowUpsData
                    FollowUpsDataCopy.unshift(res)
                    this.setState({
                        FollowUpsData: FollowUpsDataCopy,
                        IsLoadingCheckCode: false
                    })
                    toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
                    values.ContactNameFollowUp = ''
                }
            }

        )
    }

    ShowPopUpForEdit = (obj) => {
        Api.get('GetFmWorkFlowItemsById?id=' + obj.id + '').then(
            res => {

                this.setState({ showPopUp: true, IsEditWorkFlowItem: true })
                this.setState({
                    ContactDataForEdit: res,
                    Duration: res.duration,
                    SelectedApproval: { label: res.approvalStatusText, value: res.approvalId },
                    SelectedCompanyForEditContacts: { 'value': res.companyId, 'label': res.companyName },
                    Approval: res.approvalStatusText,
                    SelectedContactForEditContacts: { 'value': res.contactId, 'label': res.contactName }
                })
            }
        )
    }

    DeleteFollowUp = (rowId, index) => {
        let data = []
        data.push(rowId)
        this.setState({
            showDeleteModalFollowUp: true,
            rowIdFollowUp: data,
            indexFollowUp: index,
        })
    }

    ConfirmationDeleteFollowup = () => {
        this.setState({ isLoading: true })
        let Data = this.state.FollowUpsData;
        let NewData = []
        Data.splice(this.state.indexFollowUp, 1);
        this.setState({ FollowUpsData: Data });
        Api.post("DeleteFollowingUps", this.state.rowIdFollowUp).then(
            res => {
                this.setState({
                    showDeleteModalFollowUp: false,
                    isLoading: false,
                    DeleteFromLog: false
                })
                toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
            }
        ).catch(ex => {
            this.setState({
                showDeleteModalFollowUp: false,
                isLoading: false,
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });

    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    AddDocumentType = (values) => {
        this.setState({ IsLoadingCheckCode: true })
        let WorkFlowDocument = {
            workFlowId: this.state.docId,
            docTypeId: values.DocumentTypeDrop.value,
            redAlert: values.redAlert,
            greenAlert: values.GreenAlert,
            yellowAlert: values.yellowAlert,
        }

        dataservice.addObject('AddWorkFlowDocument', WorkFlowDocument).then(
            res => {

                values.DocumentTypeDrop = ''
                values.redAlert = ''
                values.GreenAlert = ''
                values.yellowAlert = ''

                this.setState({
                    WorkFlowDocumentData: res||[],
                    IsLoadingCheckCode: false
                })

                toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
            }
        ).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
    }

    DeleteDocType = (rowId, index) => {

        this.setState({
            showDeleteModalDocType: true,
            rowIdFollowUp: rowId,
            indexFollowUp: index,
        })
    }

    handleBlurmultiApproval = (id, value) => {

        let Data = this.state.NewMultiApprovalData

        let SelectedRow = Data.filter(s => s.workFlowItemId === id)
        let OldData = Data.filter(s => s.workFlowItemId !== id)

        let SelectedValue = this.state.MultiApproval.val.value
        filter(SelectedRow, function (i) {
            let x = {};
            x.arrange = i.arrange
            x.workFlowItemId = i.workFlowItemId
            x.count = i.count
            x.workFlowId = i.workFlowId
            x.multiApproval = SelectedValue
            OldData.push(x)
        })
        this.setState({
            NewMultiApprovalData: OldData
        })
    }

    MultiApprovalhandleChange = (id, Value) => {

        this.setState({
            MultiApproval: { id: id, val: Value }
        });
    }

    SaveMultiApproval = () => {
        Api.post('UpdateMultiApproval', this.state.NewMultiApprovalData).then(
            toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
        )

        this.props.history.push({
            pathname: '/WorkFlow/' + projectId + '',
        })
    }

    ConfirmationDeleteDocType = () => {
        this.setState({ isLoading: true })
        let Data = this.state.WorkFlowDocumentData;
        let NewData = []
        Data.splice(this.state.indexFollowUp, 1);
        this.setState({ WorkFlowDocumentData: Data });
        Api.post('WorkFlowDocumentsByWorkFlowIdObservableDelete?id=' + this.state.rowIdFollowUp + '').then(
            res => {
                this.setState({
                    showDeleteModalDocType: false,
                    isLoading: false,

                })
                toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
            }
        ).catch(ex => {
            this.setState({
                showDeleteModalDocType: false,
                isLoading: false,
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });

    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrStep: stepNo });
    };

    render() {

        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={true} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage] },
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={false} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage] }
        ]

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                gridKey={'workFlowItem'}
                cells={this.state.columns}
                data={this.state.rows}
                groups={[]}
                pageSize={this.state.rows.length}
                actions={[{
                    title: 'Delete',
                    handleClick: (values) => {
                        this.clickHandlerDeleteRowsMain(values);
                    },
                    classes: '',
                }]}
                rowActions={[]}
                rowClick={(values) => {
                    this.ShowPopUpForEdit(values);
                }}
            />
        ) : <LoadingSection />

        let FollowUpsData = this.state.FollowUpsData;

        let RenderFollowUpsTable = FollowUpsData.map((item, index) => {
            return (
                <tr key={item.id}>
                    <td className="removeTr">
                        <div className="contentCell tableCell-1">
                            <span className="pdfImage" onClick={() => this.DeleteFollowUp(item.id, index)}>
                                <img src={Recycle} alt="pdf" />
                            </span>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-2">
                            <p>{item.actionByCompanyName}</p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-2">
                            <p>{item.actionByContactName}</p>
                        </div>
                    </td>
                </tr>
            )
        })

        let DocumentTypeData = this.state.WorkFlowDocumentData;

        let RenderDocumentTypeTable = DocumentTypeData.map((item, index) => {
            return (
                <tr key={item.id}>
                    <td className="removeTr">
                        <div className="contentCell tableCell-1">
                            <span className="pdfImage" onClick={() => this.DeleteDocType(item.id, index)}>
                                <img src={Recycle} alt="pdf" />
                            </span>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-2">
                            <p>{item.docTypeTitle}</p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-2">
                            <p>{item.redAlert}</p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-2">
                            <p>{item.yellowAlert}</p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-2">
                            <p>{item.greenAlert}</p>
                        </div>
                    </td>
                </tr>
            )
        });

        const renderMultiApprovalTable = this.state.MultiApprovalData.map((item) => {
            return (
                <tr key={item.workFlowItemId}>
                    <td>
                        <div className="contentCell tableCell-1">
                            <p>
                                {item.arrange}
                            </p>
                        </div>
                    </td>
                    {() => this.setState({ MultiApproval: item.multiApproval ? { label: 'Multi', value: true } : { label: 'Single', value: false } })}
                    <td>
                        <Select options={[{ label: 'Multi', value: true }, { label: 'Single', value: false }]}
                            onChange={e => this.MultiApprovalhandleChange(item.workFlowItemId, e)}
                            onBlur={() => this.handleBlurmultiApproval(item.workFlowItemId)}
                            defaultValue={item.multiApproval ? { label: 'Multi', value: true } : { label: 'Single', value: false }}
                        />
                    </td>
                </tr>
            )
        });

        const renderLevelDurationTable = this.state.LevelDurationData.map((item) => {
            return (
                <tr key={item.workFlowItemId}>
                    <td>
                        <div className="contentCell tableCell-1">
                            <p>
                                {item.arrange}
                            </p>
                        </div>
                    </td>

                    <td>
                        <div className="linebylineInput valid-input fullInputWidth">
                            <div className="inputDev ui input">
                                <input autoComplete="off" className="form-control"
                                    value={item.duration}
                                    name="Duration"
                                    onChange={(e) => { this.toggleRow(e, item) }}
                                    placeholder={Resources['duration'][currentLanguage]} />
                            </div>
                        </div>
                    </td>
                </tr>
            )
        });

        let FirstStepWorkFlow = () => {
            return (
                <Formik
                    initialValues={{ ...this.state.document }}
                    enableReinitialize={true}
                    validationSchema={validationSchemaForAddEditWorkFlow}
                    onSubmit={(values, actions) => {
                        this.AddEditWorkFlow(values, actions)
                    }}>
                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldValue, setFieldTouched }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className="document-fields">
                                <div className="proForm first-proform">
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                            <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                placeholder={Resources.subject[currentLanguage]} value={this.state.document.subject}
                                                autoComplete='off' onChange={(e) => this.handleChange(e, 'subject')}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }} />
                                            {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.status[currentLanguage]}</label>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="status"
                                                onBlur={e => this.handleChange(e, 'status')}
                                                defaultChecked={this.state.document.status === false ? null : 'checked'}
                                                value="true" onChange={e => this.handleChange(e, 'status')} />
                                            <label>{Resources.oppened[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="status"
                                                defaultChecked={this.state.document.status === false ? 'checked' : null}
                                                onBlur={e => this.handleChange(e, 'status')} value="false" onChange={e => this.handleChange(e, 'status')} />
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
                                        <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                        <div className="ui input inputDev"  >
                                            <input type="text" className="form-control" id="arrange" readOnly
                                                value={this.state.document.arrange} placeholder={Resources.arrange[currentLanguage]}
                                                onChange={(e) => this.handleChange(e, 'arrange')} onBlur={(e) => {
                                                    handleChange(e)
                                                    handleBlur(e)
                                                }} name="arrange" />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown 
                                            isClear={true}
                                            data={this.state.RejectionOptionData} selectedValue={this.state.selectedRejectionOptions}
                                            handleChange={event => this.handleChangeDropDown(event, 'rejectionOptions', false, '', '', '', 'selectedRejectionOptions')}
                                            onChange={setFieldValue} onBlur={setFieldTouched} title="rejectionOption"
                                            error={errors.rejectionOptions} touched={touched.rejectionOptions}
                                            index="IR-rejectionOptions" name="rejectionOptions" id="rejectionOptions" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown 
                                            isClear={true}
                                            data={this.state.NextWorkFlowData} selectedValue={this.state.selectedNextWorkFlow}
                                            handleChange={event => this.handleChangeDropDown(event, 'nextWorkFlowId', false, '', '', '', 'selectedNextWorkFlow')}
                                            onChange={setFieldValue} onBlur={setFieldTouched} title="nextWorkFlow"
                                            error={errors.nextWorkFlowId} touched={touched.nextWorkFlowId}
                                            index="IR-nextWorkFlowId" name="nextWorkFlowId" id="nextWorkFlowId" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            isClear={true}
                                            data={this.state.DistributionList} selectedValue={this.state.selectedDistributionList}
                                            handleChange={event => this.handleChangeDropDown(event, 'distributionId', false, '', '', '', 'selectedDistributionList')}
                                            onChange={setFieldValue} onBlur={setFieldTouched} title="distributionList"
                                            index="distributionId" name="distributionList" id="distributionList" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.alertDays[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.alertDays && touched.alertDays ? (" has-error") : !errors.alertDays && touched.alertDays ? (" has-success") : " ")} >
                                            <input name='alertDays' className="form-control fsadfsadsa" id="alertDays"
                                                placeholder={Resources.alertDays[currentLanguage]} value={this.state.document.alertDays}
                                                autoComplete='off' onChange={(e) => this.handleChange(e, 'alertDays')}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }} />
                                            {touched.alertDays ? (<em className="pError">{errors.alertDays}</em>) : null}
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.code[currentLanguage]}</label>
                                        <div className="ui input inputDev">
                                            <input type="text" className="form-control" id="code"
                                                value={this.state.document.code} placeholder={Resources.referenceCode[currentLanguage]}
                                                onChange={(e) => this.handleChange(e, 'code')}
                                                onBlur={(e) => {
                                                    handleChange(e)
                                                    this.handleBlurCheckCode(e)
                                                }} name="code" />
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.closeAfterApproval[currentLanguage]}</label>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="closeAfterApproval"
                                                onBlur={e => this.handleChange(e, 'closeAfterApproval')} defaultChecked={this.state.document.closeAfterApproval === false ? null : 'checked'}
                                                value="true" onChange={e => this.handleChange(e, 'closeAfterApproval')} />
                                            <label>{Resources.yes[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="closeAfterApproval"
                                                onBlur={e => this.handleChange(e, 'closeAfterApproval')} defaultChecked={this.state.document.closeAfterApproval === false ? 'checked' : null}
                                                value="false" onChange={e => this.handleChange(e, 'closeAfterApproval')} />
                                            <label>{Resources.no[currentLanguage]}</label>
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.useSelection[currentLanguage]}</label>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="useSelection" onBlur={e => this.handleChange(e, 'useSelection')} defaultChecked={this.state.document.useSelection === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'useSelection')} />
                                            <label>{Resources.yes[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="useSelection" onBlur={e => this.handleChange(e, 'useSelection')} defaultChecked={this.state.document.useSelection === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'useSelection')} />
                                            <label>{Resources.no[currentLanguage]}</label>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className="doc-pre-cycle">
                                <div className="slider-Btns">
                                    {this.showBtnsSaving()}
                                </div>
                            </div>

                            <div className="doc-pre-cycle letterFullWidth">
                                <div>
                                    {this.props.changeStatus === true ?
                                        <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                        : null
                                    }
                                </div>
                            </div>

                        </Form>
                    )}
                </Formik>
            )
        }

        let SecondStepContacts = () => {
            return (
                <div className="subiTabsContent feilds__top">
                    <Formik
                        initialValues={{
                            levelNo: this.state.rows.length ? Math.max.apply(Math, this.state.rows.map(function (o) { return o.arrange + 1 })) : 1,
                            Company: '',
                            ContactName: '',
                            Description: '',
                            approval: '',
                            Duration: 0
                        }}

                        enableReinitialize={true}
                        validationSchema={ValidtionSchemaContactsForAdd}
                        onSubmit={(values, actions) => {
                            this.AddContact(values, actions)
                        }}>

                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">{Resources['addContact'][currentLanguage]}</h2>
                                    </div>
                                </header>
                                <div className='document-fields'>
                                    <div className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input">
                                            <Dropdown 
                                                isClear={true}
                                                title="company" data={this.state.CompanyData} name="Company"
                                                selectedValue={values.Company} onChange={setFieldValue}
                                                handleChange={(e) => this.handleChangeDrops(e, "Company")} touched={touched.Company}
                                                onBlur={setFieldTouched} error={errors.Company} value={values.Company} />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <Dropdown 
                                                isClear={true}
                                                title="ContactName" data={this.state.ContactData} name="ContactName"
                                                selectedValue={values.ContactName} onChange={setFieldValue} value={values.ContactName}
                                                handleChange={(e) => this.handleChangeDrops(e, "ContactName")}
                                                onBlur={setFieldTouched} error={errors.ContactName} touched={touched.ContactName} />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['levelNo'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.levelNo && touched.levelNo ? 'has-error' : null) + ' '}>
                                                <input autoComplete="off" value={values.levelNo} className="form-control" name="levelNo"
                                                    onBlur={(e) => { handleBlur(e) }} onChange={(e) => { handleChange(e) }}
                                                    placeholder={Resources['levelNo'][currentLanguage]} />
                                                {errors.levelNo && touched.levelNo ? (<em className="pError">{errors.levelNo}</em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <label className="control-label">{Resources['description'][currentLanguage]}</label>
                                            <div className="inputDev ui input">
                                                <input autoComplete="off" className="form-control" value={values.Description} name="Description"
                                                    onChange={(e) => { handleChange(e) }} placeholder={Resources['description'][currentLanguage]} />
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <Dropdown 
                                                isClear={true}
                                                title="approvalText" 
                                                data={this.state.ApprovalData} 
                                                name="approvalText"
                                                selectedValue={this.state.SelectedApproval}
                                                onChange={setFieldValue} 
                                                value={this.state.SelectedApproval!==null?this.state.SelectedApproval.value:""}
                                                handleChange={(e) => this.handleChangeDrops(e, "Approval")}
                                                onBlur={setFieldTouched} error={errors.approval} touched={touched.approval} />
                                        </div>
                                        {/* <div className="linebylineInput valid-input fullInputWidth">
                                            <label className="control-label">{Resources['duration'][currentLanguage]}</label>
                                            <div className="inputDev ui input">
                                                <input autoComplete="off" className="form-control" value={values.Duration} name="Duration"
                                                    onChange={(e) => { handleChange(e) }} placeholder={Resources['duration'][currentLanguage]} />
                                            </div>
                                        </div> */}
                                        <div className="slider-Btns letterFullWidth">
                                            <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['add'][currentLanguage]}</button>
                                        </div>
                                    </div>
                                    <div className="doc-pre-cycle">
                                        <header>
                                            <h2 className="zero">{Resources['contactList'][currentLanguage]}</h2>
                                        </header>
                                        {dataGrid}
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <div className="doc-pre-cycle">
                        <div className="slider-Btns">
                            <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(2)}>NEXT STEP</button>
                        </div>
                    </div>
                </div>
            )
        }

        let ThirdStepFollowingUps = () => {
            return (
                <div className="subiTabsContent feilds__top">

                    <Formik
                        initialValues={{

                            CompanyFollowUp: '',
                            ContactNameFollowUp: '',
                        }}

                        enableReinitialize={true}

                        validationSchema={ValidtionSchemaForFollowUps}

                        onSubmit={(values, actions) => {
                            this.AddFollowUps(values, actions)
                        }}>

                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">{Resources['addFollowUps'][currentLanguage]}</h2>
                                    </div>
                                </header>

                                <div className='document-fields'>
                                    <div className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                isClear={true}
                                                title="company" data={this.state.CompanyData} name="CompanyFollowUp"
                                                selectedValue={values.CompanyFollowUp} onChange={setFieldValue}
                                                handleChange={(e) => this.handleChangeDrops(e, "CompanyFollowUp")}
                                                onBlur={setFieldTouched} error={errors.CompanyFollowUp}
                                                touched={touched.CompanyFollowUp} value={values.CompanyFollowUp} />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                               isClear={true}
                                                title="ContactName" data={this.state.ContactData} name="ContactNameFollowUp"
                                                selectedValue={values.ContactNameFollowUp} onChange={setFieldValue}
                                                handleChange={(e) => this.handleChangeDrops(e, "ContactNameFollowUp")}
                                                onBlur={setFieldTouched} error={errors.ContactNameFollowUp}
                                                touched={touched.ContactNameFollowUp} value={values.ContactNameFollowUp} />
                                        </div>
                                    </div>

                                    <div className="slider-Btns">
                                        <button className="primaryBtn-1 btn meduimBtn" type='submit' >ADD</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <div className="doc-pre-cycle">
                        <header>
                            <h2 className="zero">{Resources['addFollowUps'][currentLanguage]}</h2>
                        </header>

                        <div className='document-fields'>
                            <table className="attachmentTable">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className="headCell tableCell-1">
                                                <span>{Resources['actions'][currentLanguage]}</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="headCell tableCell-2">
                                                <span>{Resources['CompanyName'][currentLanguage]}</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="headCell tableCell-2">
                                                <span>{Resources['ContactName'][currentLanguage]}</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RenderFollowUpsTable}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="doc-pre-cycle">
                        <div className="slider-Btns">
                            <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(3)}>NEXT STEP</button>
                        </div>
                    </div>
                </div>
            )
        }

        let FouthStepDocumentType = () => {
            return (
                <div className="subiTabsContent feilds__top">
                    <Formik
                        initialValues={{
                            DocumentTypeDrop: '',
                            redAlert: '',
                            yellowAlert: '',
                            GreenAlert: '',
                        }}
                        enableReinitialize={true}
                       validationSchema={ValidtionSchemaDocumentTypeDrop}
                        onSubmit={(values, actions) => {
                            this.AddDocumentType(values, actions)
                        }}>
                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">{Resources['addItems'][currentLanguage]}</h2>
                                    </div>
                                </header>
                                <div className='document-fields'>
                                    <div className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                 isClear={true}
                                                 title="docType" data={this.state.DocumentTypeDropData} name="DocumentTypeDrop"
                                                selectedValue={values.DocumentTypeDrop} onChange={setFieldValue}
                                                handleChange={(e) => this.handleChangeDrops(e, "DocumentTypeDrop")}
                                                onBlur={setFieldTouched}
                                                error={errors.DocumentTypeDrop}
                                                touched={touched.DocumentTypeDrop}
                                                value={values.DocumentTypeDrop} 
                                                />
                                        </div>
                                    </div>
                                    <div className="slider-Btns">
                                        <button className="primaryBtn-1 btn meduimBtn" type='submit' >ADD</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <div className="doc-pre-cycle">
                        <header>
                            <h2 className="zero">{Resources['itemsList'][currentLanguage]}</h2>
                        </header>
                        <div className='document-fields'>
                            <table className="attachmentTable">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className="headCell tableCell-1">
                                                <span>{Resources['actions'][currentLanguage]}</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="headCell tableCell-2">
                                                <span>{Resources['docType'][currentLanguage]}</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="headCell tableCell-2">
                                                <span>{Resources['redAlert'][currentLanguage]}</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="headCell tableCell-2">
                                                <span>{Resources['yellowAlert'][currentLanguage]}</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="headCell tableCell-2">
                                                <span>{Resources['GreenAlert'][currentLanguage]}</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RenderDocumentTypeTable}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="doc-pre-cycle">
                        <div className="slider-Btns">
                            <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(4)}>NEXT STEP</button>
                        </div>
                    </div>
                </div>
            )
        }

        let FivethStepMultiApproval = () => {
            return (
                <Fragment>
                    <div className='document-fields'>
                        <table className="attachmentTable">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="headCell tableCell-1">
                                            <span>No.</span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="headCell tableCell-1">
                                            <span> Subject</span>
                                        </div>
                                    </th>

                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>

                                {renderMultiApprovalTable}

                            </tbody>
                        </table>
                    </div>
                    <div className="doc-pre-cycle">
                        <div className="slider-Btns">
                            <button className="primaryBtn-1 btn meduimBtn" onClick={this.SaveMultiApproval} >Save STEP</button>
                        </div>
                    </div>

                    <div className='document-fields'>
                        {this.state.durationLoading == false ?
                            (
                                <table className="attachmentTable">
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="headCell tableCell-1">
                                                    <span>No.</span>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="headCell tableCell-1">
                                                    <span>Duration</span>
                                                </div>
                                            </th>

                                            <th></th>
                                        </tr>
                                    </thead> 
                                    <tbody>
                                        {renderLevelDurationTable} 
                                    </tbody>
                                </table>
                            )
                            : null}
                    </div>
                    {this.state.docId > 0 ?
                        (
                            <div className="doc-pre-cycle">
                                <div className="slider-Btns">
                                    <button className="primaryBtn-1 btn meduimBtn" onClick={this.UpdateDurationLevel} >Update Duration</button>
                                </div>
                            </div>
                        )
                        : null}
                    <div className="doc-pre-cycle">
                        <div className="slider-Btns">
                            <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(5)}>NEXT STEP</button>
                        </div>
                    </div>
                </Fragment>

            )
        }

        let RenderEditContacts = () => {
            return (
                <Formik
                    initialValues={{
                        levelNoForEdit: this.state.ContactDataForEdit.arrange,
                        SelectedCompanyForEditContacts: this.state.SelectedCompanyForEditContacts,
                        SelectedContactForEditContacts: this.state.SelectedContactForEditContacts,
                        DescriptionForEdit: this.state.ContactDataForEdit.description,
                        Duration: this.state.Duration != null ? this.state.Duration : 0,
                        Approval: this.state.Approval
                    }}

                    enableReinitialize={true}
                    validationSchema={ValidtionSchemaContactsForEdit}
                    onSubmit={(values, actions) => {
                        this.EditContact(values, actions)
                    }}>
                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit}>
                            <header className="main__header">
                                <div className="main__header--div">
                                    <h2 className="zero">{Resources['addContact'][currentLanguage]}</h2>
                                </div>
                            </header>
                            <div className='document-fields'>
                                <div className="proForm datepickerContainer">
                                    <div className="linebylineInput fullInputWidth disabled">
                                        <label className="control-label">{Resources['company'][currentLanguage]}</label>
                                        <div className="ui input inputDev">
                                            <input autoComplete="off" value={this.state.SelectedCompanyForEditContacts ? this.state.SelectedCompanyForEditContacts.label : null} className="form-control" name="SelectedCompanyForEditContacts"
                                                onChange={() => { }}
                                                placeholder={Resources['company'][currentLanguage]} />
                                        </div>
                                    </div>

                                    <div className="linebylineInput fullInputWidth disabled">
                                        <label className="control-label">{Resources['ContactName'][currentLanguage]}</label>
                                        <div className="ui input inputDev">
                                            <input autoComplete="off" value={values.SelectedContactForEditContacts ? values.SelectedContactForEditContacts.label : null} className="form-control" name="SelectedContactForEditContacts"
                                                onChange={() => { }}
                                                placeholder={Resources['ContactName'][currentLanguage]} />
                                        </div>
                                    </div>

                                    <div className="linebylineInput fullInputWidth">
                                        <label className="control-label">{Resources['levelNo'][currentLanguage]}</label>
                                        <div className={'ui input inputDev ' + (errors.levelNoForEdit && touched.levelNoForEdit ? 'has-error' : null) + ' '}>
                                            <input autoComplete="off" value={values.levelNoForEdit} className="form-control" name="levelNoForEdit"
                                                onBlur={(e) => { handleBlur(e) }} onChange={(e) => { handleChange(e) }}
                                                placeholder={Resources['levelNo'][currentLanguage]} />
                                            {errors.levelNoForEdit && touched.levelNoForEdit ? (<em className="pError">{errors.levelNoForEdit}</em>) : null}
                                        </div>
                                    </div>
                                    <div className="linebylineInput fullInputWidth">
                                        <label className="control-label">{Resources['description'][currentLanguage]}</label>
                                        <div className="inputDev ui input">
                                            <input autoComplete="off" className="form-control" value={values.DescriptionForEdit} name="DescriptionForEdit"
                                                onChange={(e) => { handleChange(e) }} placeholder={Resources['description'][currentLanguage]} />
                                        </div>
                                    </div>
                                    <div className="linebylineInput fullInputWidth">
                                        <label className="control-label">{Resources['duration'][currentLanguage]}</label>
                                        <div className="inputDev ui input">
                                            <input autoComplete="off" className="form-control" value={values.Duration} name="Duration"
                                                onChange={(e) => { handleChange(e) }} placeholder={Resources['duration'][currentLanguage]} />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown 
                                            isClear={true}
                                            title="approvalText" data={this.state.ApprovalData} name="Approval"
                                            selectedValue={this.state.SelectedApproval} onChange={setFieldValue}
                                            value={this.state.SelectedApproval!==null?this.state.SelectedApproval.value:""}
                                            handleChange={(e) => this.handleChangeDrops(e, "Approval")}
                                            onBlur={setFieldTouched} error={errors.Approval} touched={touched.Approval} />
                                    </div>
                                    <div className="fullWidthWrapper">
                                        <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['save'][currentLanguage]}</button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            )
        }

        return (
            <div className="mainContainer">
                {this.state.IsLoadingCheckCode ?
                    <LoadingSection /> : null
                }

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.workFlow[currentLanguage]} moduleTitle={Resources['generalCoordination'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="skyLight__form">
                            <SkyLightStateless onOverlayClicked={() => this.setState({ showPopUp: false })}
                                title={Resources['editTitle'][currentLanguage]}
                                onCloseClicked={() => this.setState({ showPopUp: false })} isVisible={this.state.showPopUp}>
                                {RenderEditContacts()}
                            </SkyLightStateless>
                        </div>
                        <div className="step-content">
                            {this.state.CurrStep === 0 ? <Fragment>{FirstStepWorkFlow()}</Fragment> :
                                this.state.CurrStep === 1 ? <Fragment> {SecondStepContacts()}</Fragment> :
                                    this.state.CurrStep === 2 ? <Fragment> {ThirdStepFollowingUps()}</Fragment> :
                                        this.state.CurrStep === 3 ? <Fragment> {FouthStepDocumentType()}</Fragment> :
                                            <Fragment> {FivethStepMultiApproval()}</Fragment>}
                        </div>
                        <Fragment>
                            <Steps
                                steps_defination={steps_defination}
                                exist_link="/WorkFlow/"
                                docId={this.state.docId}
                                changeCurrentStep={stepNo =>
                                    this.changeCurrentStep(stepNo)
                                }
                                stepNo={this.state.CurrStep} changeStatus={docId === 0 ? false : true}
                            />
                        </Fragment>

                    </div>

                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessageContent'][currentLanguage]}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModalContact}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                        />
                    ) : null}

                    {this.state.showDeleteModalFollowUp == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessageContent'][currentLanguage]}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModalFollowUp}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmationDeleteFollowup}
                        />
                    ) : null}

                    {this.state.showDeleteModalDocType == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessageContent'][currentLanguage]}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModalDocType}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmationDeleteDocType}
                        />
                    ) : null}


                    <div className="doc-pre-cycle letterFullWidth">

                        {this.props.changeStatus === true ? (
                            <div className="approveDocument">
                                <div className="approveDocumentBTNS">
                                    {this.state.isLoading ? (
                                        <button className="primaryBtn-1 btn disabled">
                                            <div className="spinner">
                                                <div className="bounce1" />
                                                <div className="bounce2" />
                                                <div className="bounce3" />
                                            </div>
                                        </button>
                                    ) : (
                                            <button
                                                className={this.state.isViewMode === true
                                                    ? "primaryBtn-1 btn middle__btn disNone"
                                                    : "primaryBtn-1 btn middle__btn"
                                                }>
                                                {
                                                    Resources.save[currentLanguage]
                                                }
                                            </button>
                                        )}
                                    <DocumentActions
                                        isApproveMode={this.state.isApproveMode}
                                        docTypeId={this.state.docTypeId}
                                        docId={this.state.docId}
                                        projectId={this.state.projectId}
                                        previousRoute={this.state.previousRoute}
                                        docApprovalId={this.state.docApprovalId}
                                        currentArrange={this.state.arrange}
                                        showModal={true}
                                        showOptionPanel={this.showOptionPanel}
                                        permission={this.state.permission}
                                        documentName="workFlow"
                                    />
                                </div>
                            </div>
                        ) : null}
                        <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                            <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                                {this.state.currentComponent}
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
)(withRouter(projectWorkFlowAddEdit))
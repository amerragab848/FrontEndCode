import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import GridSetup from "../Communication/GridSetup";
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
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { SkyLightStateless } from 'react-skylight';
import Recycle from '../../Styles/images/attacheRecycle.png'
import { __esModule } from 'react-data-export/dist/ExcelPlugin/components/ExcelFile';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')

const ValidtionSchemaContactsForAdd = Yup.object().shape({
    Company: Yup.string()
        .required(Resources['toCompanyRequired'][currentLanguage])
        .nullable(true),
    ContactName: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage])
        .nullable(false),
    levelNo: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
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
        .nullable(false),
});

const ValidtionSchemaContactsForEdit = Yup.object().shape({
    SelectedCompanyForEditContacts: Yup.string()
        .required(Resources['toCompanyRequired'][currentLanguage])
        .nullable(true),
    SelectedContactForEditContacts: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage])
        .nullable(false),
    levelNoForEdit: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
});

const validationSchemaForAddEditWorkFlow = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    alertDays: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
    rejectionOptions: Yup.string().required(Resources['rejectionOption'][currentLanguage]),
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
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        const columnsGrid = [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "arrange",
                name: Resources["numberAbb"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "description",
                name: Resources["description"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ]

        this.state = {
            IsAddModel: false,
            FirstStep: true,
            SecondStep: false,
            SecondStepComplate: false,
            ThirdStep: false,
            ThirdStepComplate: false,
            FourthStepComplate: false,
            FourthStep: false,
            FivethStepComplate: false,
            FivethStep: false,
            isLoading: true,
            CurrStep: 1,
            rows: [],
            showDeleteModal: false,
            selectedRows: [],
            showCheckbox: true,
            columns: columnsGrid.filter(column => column.visible !== false),
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
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
            selectedRejectionOptions: {},
            selectedNextWorkFlow: {},
            CompanyData: [],
            FollowUpsData: [],
            DocumentType: [],
            DocumentTypeDropData: [],
            MultiApprovalData: [],
            ContactDataForEdit: {},
            SelectedContactForEditContacts: {},
            SelectedContactForEditContacts: {},
            rowIdFollowUp: [],
            indexFollowUp: '',
            WorkFlowDocumentData: [],
            NewMultiApprovalData: [],
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
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(601))) {
                this.setState({ isViewMode: true });
            }
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
        else {
            this.setState({ isViewMode: false });
        }
    }

    handleShowAction = (item) => {
        console.log(item);
        if (item.value != "0") {

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
            btn = <button className="primaryBtn-1 btn mediumBtn" >{Resources.next[currentLanguage]}</button>
        }
        return btn;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            let WorkFlowDoc = nextProps.document
            WorkFlowDoc.docDate = moment(WorkFlowDoc.docDate).format("DD/MM/YYYY")

            this.setState({
                document: WorkFlowDoc,
                IsEditMode: true,
                hasWorkflow: nextProps.hasWorkflow,
            });
            this.checkDocumentIsView();
        }
    }

    componentDidMount = () => {

    }

    componentWillMount() {
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
            this.FillDropDowns()

            dataservice.GetDataGrid('GetWorkFlowItemsByWorkFlowId?workFlow=' + this.state.docId + '').then(
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
            dataservice.GetDataGrid('getFollowingUpsByWorkFlowId?workFlow=' + this.state.docId + '').then(
                res => {
                    this.setState({
                        FollowUpsData: res
                    })
                }
            )

            dataservice.GetDataGrid('GetWorkFlowItemsByWorkFlowIdLevel?workFlow=' + this.state.docId + '').then(
                res => {
                    this.setState({
                        MultiApprovalData: res,
                        NewMultiApprovalData: res
                    })
                }
            )

            dataservice.GetDataGrid('GetWorkFlowDocumentsByWorkFlowId?workFlow=' + this.state.docId + '').then(
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
                    }
                    this.setState({
                        document: WorkFlowDoc
                    })
                }
            )
            this.FillDropDowns()
            this.props.actions.documentForAdding();
        }
        dataservice.GetDataList('GetAccountsDocType', 'docType', 'id').then(
            res => {
                this.setState({
                    DocumentTypeDropData: res,
                })
            }
        )

        dataservice.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + projectId + '', 'companyName', 'companyId').then(
            res => {
                this.setState({
                    CompanyData: res,
                })
            }
        )


    }

    handleChangeDrops = (item, name) => {
        switch (name) {
            case "ProjectName":
                this.setState({ selectedProject: item })
                break;

            case 'multiApproval':
                this.setState({ selectedMultiApproval: item })
                break;

            case 'ContactName':
                this.setState({ SelectedContact: item })
                break;

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

    handleBlurCheckCode = (value) => {

        if (value.target.value !== '') {
            this.setState({ IsLoadingCheckCode: true })
            dataservice.GetRowById('CheckWorkFlowCode?projectId=3527&code=' + value.target.value + '&id=' + this.state.docId + '').then(
                res => {
                    let Reuslt = res
                    if (Reuslt === true) {
                        toast.error(Resources['projectAddErrorMessages'][currentLanguage].ReferenceCodeExists)
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
        //console.log(field, e.target.value);
        let updated_document = this.state.document
        updated_document[field] = e.target.value;
        this.setState({
            document: updated_document
        });
    }

    handleChangeDate(e, field) {
        console.log(field, e);
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    SelectedValueDropsInEditMode = (RejData, NextWFData) => {
        if (docId !== 0) {
            let RejectionOptionsId = this.state.document.rejectionOptions;
            let selectedRejectionOptions = _.find(RejData, function (i) { return i.value == RejectionOptionsId });
            let NextWorkFlowId = this.state.document.nextWorkFlowId;
            let selectedNextWorkFlow = _.find(NextWFData, function (i) { return i.value == NextWorkFlowId });
            this.setState({
                selectedRejectionOptions: selectedRejectionOptions,
                selectedNextWorkFlow: selectedNextWorkFlow,
            })
        }
    }

    FillDropDowns = () => {
        dataservice.GetDataList('GetDefaultListForList?listType=rejectionOptions', 'title', 'id').then(
            res => {
                this.setState({
                    RejectionOptionData: res,
                })
                dataservice.GetDataList('ProjectWorkFlowGetList?projectId=' + projectId + '', 'subject', 'id').then(
                    result => {
                        this.setState({
                            NextWorkFlowData: result,
                        })
                        this.SelectedValueDropsInEditMode(res, result)
                    }
                )
            }
        )

    }

    AddEditWorkFlow = () => {
        if (this.state.IsAddModel) {
            this.NextStep()
        }
        else {
            let WorkFlowObj = this.state.document
            WorkFlowObj.docDate = moment(WorkFlowObj.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')

            if (docId > 0) {

                dataservice.addObject('EditWorkFlow', WorkFlowObj).then(
                    res => {
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    });
                this.NextStep()
            }

            else {
                dataservice.addObject('AddWorkFlow', WorkFlowObj).then(
                    res => {
                        this.setState({
                            docId: res.id,
                            IsAddModel: true
                        })
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    });
                this.NextStep()
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
                    workFlowId: this.state.docId,
                    multiApproval: false,
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
                    toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
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
            else if (this.state.CurrStep === 3) {
                window.scrollTo(0, 0)
                this.setState({
                    ThirdStep: true,
                    ThirdStepComplate: false,
                    CurrStep: this.state.CurrStep - 1,
                })
            }
            else if (this.state.CurrStep === 4) {
                window.scrollTo(0, 0)
                this.setState({
                    FourthStep: true,
                    FivethStep: false,
                    FourthStepComplate: false,
                    CurrStep: this.state.CurrStep - 1,
                })
            }


            else if (this.state.CurrStep === 5) {
                window.scrollTo(0, 0)
                this.setState({
                    FourthStep: true,
                    FivethStep: false,
                    FivethStepComplate: false,
                    CurrStep: this.state.CurrStep - 1,
                })
            }


        }
    }

    NextStep = () => {

        let sss = this.state.CurrStep

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
            window.scrollTo(0, 0)
            this.setState({
                SecondStep: false,
                ThirdStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: true,
                CurrStep: this.state.CurrStep + 1,
            })
        }
        else if (this.state.CurrStep === 3) {
            window.scrollTo(0, 0)
            this.setState({
                FourthStep: true,
                ThirdStep: false,
                FourthStepComplate: true,
                CurrStep: this.state.CurrStep + 1,
            })
        }
        else if (this.state.CurrStep === 4) {
            window.scrollTo(0, 0)
            this.setState({
                FourthStep: false,
                FivethStep: true,
                FivethStepComplate: true,
                CurrStep: this.state.CurrStep + 1,
            })
        }
        else if (this.state.CurrStep === 5) {
            this.props.history.push({
                pathname: '/WorkFlow/' + projectId + '',
            })
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
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
        ).catch(ex => {
            this.setState({
                isLoading: false,

            })
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
                    companyId: this.state.SelectedCompanyForEditContacts.value,
                    contactId: values.SelectedContactForEditContacts.value,
                    Description: values.DescriptionForEdit,
                    workFlowId: this.state.docId,
                    multiApproval: false,
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
                    toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
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
        console.log(values)
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
                    toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
                    values.ContactNameFollowUp = ''
                }
            }

        )
    }

    ShowPopUpForEdit = (obj) => {
        Api.get('GetFmWorkFlowItemsById?id=' + obj.id + '').then(
            res => {

                this.setState({ showPopUp: true, IsEditWorkFlowItem: true })
                let Companies = this.state.CompanyData
                let SelectedCompany = _.find(Companies, function (i) { return i.value == res.companyId });

                dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + res.companyId + '', 'contactName', 'id').then(
                    res => {
                        this.setState({
                            ContactData: res,
                        })
                    }
                )

                this.setState({
                    ContactDataForEdit: res,
                    SelectedCompanyForEditContacts: SelectedCompany,
                    SelectedContactForEditContacts: { 'value': res.contactId, 'label': res.contactName },
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
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }
        ).catch(ex => {
            this.setState({
                showDeleteModalFollowUp: false,
                isLoading: false,
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });

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
                    WorkFlowDocumentData: res,
                    IsLoadingCheckCode: false
                })

                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
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
        _.filter(SelectedRow, function (i) {
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
        })

    }

    SaveMultiApproval = () => {
        Api.post('UpdateMultiApproval', this.state.NewMultiApprovalData).then(
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)

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
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }
        ).catch(ex => {
            this.setState({
                showDeleteModalDocType: false,
                isLoading: false,
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });

    }

    StepOneLink = () => {
        if (this.state.IsEditMode) {
            this.setState({
                FirstStep: true,
                SecondStep: false,
                SecondStepComplate: false,
                CurrStep: 1,
                ThirdStepComplate: false,
                FourthStepComplate: false,
                FivethStepComplate: false,
                FivethStep: false,
            })
        }
    }

    StepTwoLink = () => {
        if (this.state.IsEditMode) {
            this.setState({
                FirstStep: false,
                SecondStep: true,
                SecondStepComplate: true,
                CurrStep: 2,
                ThirdStepComplate: false,
                FourthStepComplate: false,
                FivethStepComplate: false,
                FivethStep: false,
            })
        }
    }

    StepThreeLink = () => {
        if (this.state.IsEditMode) {
            this.setState({
                ThirdStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: true,
                CurrStep: 3,
                FourthStepComplate: false,
                FivethStepComplate: false,
                FourthStep: false,
                FivethStep: false,
                FirstStep: false,
                SecondStep: false,
            })
        }
    }

    StepFourLink = () => {
        if (this.state.IsEditMode) {
            this.setState({
                FourthStep: true,
                ThirdStep: false,
                FirstStep: false,
                SecondStep: false,
                FourthStepComplate: true,
                CurrStep: 4,
                FivethStepComplate: false,
                FivethStep: false,
                ThirdStepComplate: true,
                SecondStepComplate: true
            })
        }
    }

    StepFiveLink = () => {
        if (this.state.IsEditMode) {
            this.setState({
                FourthStep: false,
                FivethStep: true,
                FivethStepComplate: true,
                CurrStep: 5,
                FivethStepComplate: true,
                FivethStep: true,
                ThirdStepComplate: true,
                SecondStepComplate: true,
                FourthStepComplate: true,
                SecondStep: false,
                ThirdStep: false,
                FirstStep: false
            })
        }
    }

    render() {

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

        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    minHeight={350}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    onRowClick={this.ShowPopUpForEdit}
                />
            ) : <LoadingSection />

        let FollowUpsData = this.state.FollowUpsData
        let RenderFollowUpsTable =
            FollowUpsData.map((item, index) => {
                return (
                    <tr key={item.id}>
                        <td className="removeTr">
                            <div className="contentCell tableCell-1">
                                <span className="pdfImage"
                                    onClick={() => this.DeleteFollowUp(item.id, index)}
                                >
                                    <img src={Recycle} alt="pdf" />
                                </span>
                            </div>
                        </td>
                        <td>{item.actionByCompanyName}</td>
                        <td>{item.actionByContactName}</td>
                    </tr>
                )
            })

        let DocumentTypeData = this.state.WorkFlowDocumentData
        let RenderDocumentTypeTable =
            DocumentTypeData.map((item, index) => {
                return (
                    <tr key={item.id}>
                        <td className="removeTr">
                            <div className="contentCell tableCell-1">
                                <span className="pdfImage"
                                    onClick={() => this.DeleteDocType(item.id, index)}
                                >
                                    <img src={Recycle} alt="pdf" />
                                </span>
                            </div>
                        </td>
                        <td>{item.docTypeTitle}</td>
                        <td>{item.redAlert}</td>
                        <td>{item.yellowAlert}</td>
                        <td>{item.greenAlert}</td>
                    </tr>
                )
            })

        const renderMultiApprovalTable =
            this.state.MultiApprovalData.map((item) => {

                return (
                    <tr key={item.workFlowItemId}>
                        <td>{item.arrange}</td>
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
            })

        let FirstStepWorkFlow = () => {
            return (
                <Formik
                    initialValues={{ ...this.state.document }}
                    enableReinitialize={true}
                    validationSchema={validationSchemaForAddEditWorkFlow}
                    onSubmit={(values, actions) => {
                        this.AddEditWorkFlow(values, actions)
                    }}
                >

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
                                        <Dropdown data={this.state.RejectionOptionData} selectedValue={this.state.selectedRejectionOptions}
                                            handleChange={event => this.handleChangeDropDown(event, 'rejectionOptions', false, '', '', '', 'selectedRejectionOptions')}
                                            onChange={setFieldValue} onBlur={setFieldTouched} title="rejectionOption"
                                            error={errors.rejectionOptions} touched={touched.rejectionOptions}
                                            index="IR-rejectionOptions" name="rejectionOptions" id="rejectionOptions" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown data={this.state.NextWorkFlowData} selectedValue={this.state.selectedNextWorkFlow}
                                            handleChange={event => this.handleChangeDropDown(event, 'nextWorkFlowId', false, '', '', '', 'selectedNextWorkFlow')}
                                            onChange={setFieldValue} onBlur={setFieldTouched} title="nextWorkFlow"
                                            error={errors.nextWorkFlowId} touched={touched.nextWorkFlowId}
                                            index="IR-nextWorkFlowId" name="nextWorkFlowId" id="nextWorkFlowId" />
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
                                        <div className="ui input inputDev"  >
                                            <input type="text" className="form-control" id="code"
                                                value={this.state.document.code} placeholder={Resources.referenceCode[currentLanguage]}
                                                onChange={(e) => this.handleChange(e, 'code')}
                                                onBlur={(e) => {
                                                    handleChange(e)
                                                    this.handleBlurCheckCode(e)
                                                }} name="code" />
                                        </div>
                                    </div>


                                </div>

                                <div className="proForm first-proform">

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

                                            <Dropdown title="company" data={this.state.CompanyData} name="Company"
                                                selectedValue={values.Company} onChange={setFieldValue}
                                                handleChange={(e) => this.handleChangeDrops(e, "Company")} touched={touched.Company}
                                                onBlur={setFieldTouched} error={errors.Company} value={values.Company} />

                                        </div>

                                        <div className="linebylineInput valid-input">

                                            <Dropdown title="ContactName" data={this.state.ContactData} name="ContactName"
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

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['description'][currentLanguage]}</label>
                                            <div className="inputDev ui input">
                                                <input autoComplete="off" className="form-control" value={values.Description} name="Description"
                                                    onChange={(e) => { handleChange(e) }} placeholder={Resources['description'][currentLanguage]} />
                                            </div>
                                        </div>

                                        <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['add'][currentLanguage]}</button>
                                        </div>
                                    </div>

                                    <div className="doc-pre-cycle">
                                        <header>
                                            <h2 className="zero">{Resources['AddedItems'][currentLanguage]}</h2>
                                        </header>
                                        {dataGrid}

                                    </div>
                                </div>
                            </Form>
                        )}

                    </Formik>
                    <div className="doc-pre-cycle">
                        <div className="slider-Btns">
                            <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>NEXT STEP</button>
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
                                            <div className="inputDev ui input">
                                                <Dropdown title="company" data={this.state.CompanyData} name="CompanyFollowUp"
                                                    selectedValue={values.CompanyFollowUp} onChange={setFieldValue}
                                                    handleChange={(e) => this.handleChangeDrops(e, "CompanyFollowUp")}
                                                    onBlur={setFieldTouched}
                                                    error={errors.CompanyFollowUp}
                                                    touched={touched.CompanyFollowUp}
                                                    value={values.CompanyFollowUp} />
                                            </div>
                                        </div>


                                        <div className="linebylineInput valid-input">
                                            <div className="inputDev ui input">
                                                <Dropdown title="ContactName" data={this.state.ContactData} name="ContactNameFollowUp"
                                                    selectedValue={values.ContactNameFollowUp} onChange={setFieldValue}
                                                    handleChange={(e) => this.handleChangeDrops(e, "ContactNameFollowUp")}
                                                    onBlur={setFieldTouched}
                                                    error={errors.ContactNameFollowUp}
                                                    touched={touched.ContactNameFollowUp}
                                                    value={values.ContactNameFollowUp} />
                                            </div>
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
                            <table className="ui table">
                                <thead>
                                    <tr>
                                        <th>{Resources['actions'][currentLanguage]}</th>
                                        <th>{Resources['CompanyName'][currentLanguage]}</th>
                                        <th>{Resources['ContactName'][currentLanguage]}</th>
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
                            <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>NEXT STEP</button>
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

                        validationSchema={ValidtionSchemaDocumentType}

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
                                            <div className="inputDev ui input">
                                                <Dropdown title="docType" data={this.state.DocumentTypeDropData} name="DocumentTypeDrop"
                                                    selectedValue={values.DocumentTypeDrop} onChange={setFieldValue}
                                                    handleChange={(e) => this.handleChangeDrops(e, "DocumentTypeDrop")}
                                                    onBlur={setFieldTouched}
                                                    error={errors.DocumentTypeDrop}
                                                    touched={touched.DocumentTypeDrop}
                                                    value={values.DocumentTypeDrop} />
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['redAlert'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.redAlert && touched.redAlert ? 'has-error' : null) + ' '}>
                                                <input autoComplete="off" value={values.redAlert} className="form-control" name="redAlert"
                                                    onBlur={(e) => { handleBlur(e) }}
                                                    onChange={(e) => {
                                                        handleChange(e)
                                                    }}
                                                    placeholder={Resources['redAlert'][currentLanguage]} />
                                                {errors.redAlert && touched.redAlert ? (<em className="pError">{errors.redAlert}</em>) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['yellowAlert'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.yellowAlert && touched.yellowAlert ? 'has-error' : null) + ' '}>
                                                <input autoComplete="off" value={values.yellowAlert} className="form-control" name="yellowAlert"
                                                    onBlur={(e) => { handleBlur(e) }}
                                                    onChange={(e) => {
                                                        handleChange(e)
                                                    }}
                                                    placeholder={Resources['yellowAlert'][currentLanguage]} />
                                                {errors.yellowAlert && touched.yellowAlert ? (<em className="pError">{errors.yellowAlert}</em>) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['GreenAlert'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.GreenAlert && touched.GreenAlert ? 'has-error' : null) + ' '}>
                                                <input autoComplete="off" value={values.GreenAlert} className="form-control" name="GreenAlert"
                                                    onBlur={(e) => { handleBlur(e) }}
                                                    onChange={(e) => {
                                                        handleChange(e)
                                                    }}
                                                    placeholder={Resources['GreenAlert'][currentLanguage]} />
                                                {errors.GreenAlert && touched.GreenAlert ? (<em className="pError">{errors.GreenAlert}</em>) : null}
                                            </div>
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
                            <table className="ui table">
                                <thead>
                                    <tr>
                                        <th>{Resources['actions'][currentLanguage]}</th>
                                        <th>{Resources['docType'][currentLanguage]}</th>
                                        <th>{Resources['redAlert'][currentLanguage]}</th>
                                        <th>{Resources['yellowAlert'][currentLanguage]}</th>
                                        <th>{Resources['GreenAlert'][currentLanguage]}</th>
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
                            <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>NEXT STEP</button>
                        </div>
                        {/* <div className="slider-Btns">
                        <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.setState({ FirstStep: true, SecondStepComplate: false, ThirdStepComplate: false ,CurrStep:this.state.CurrStep -1 })}>Last STEP</button>
                    </div> */}
                    </div>
                </div>
            )
        }

        let FivethStepMultiApproval = () => {
            return (
                <Fragment>
                    <div className='document-fields'>
                        <table className="ui table">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Subject</th>

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

                                    <div className="linebylineInput valid-input">
                                        <div className="inputDev ui input">
                                            <Dropdown title="company" data={this.state.CompanyData} name="SelectedCompanyForEditContacts"
                                                selectedValue={this.state.SelectedCompanyForEditContacts} onChange={setFieldValue}
                                                handleChange={(e) => this.handleChangeDrops(e, "SelectedCompanyForEditContacts")} touched={touched.SelectedCompanyForEditContacts}
                                                onBlur={setFieldTouched} error={errors.SelectedCompanyForEditContacts} value={values.SelectedCompanyForEditContacts} />
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <div className="inputDev ui input">
                                            <Dropdown title="ContactName" data={this.state.ContactData} name="SelectedContactForEditContacts"
                                                selectedValue={values.SelectedContactForEditContacts} onChange={setFieldValue} value={values.SelectedContactForEditContacts}
                                                handleChange={(e) => this.handleChangeDrops(e, "SelectedContactForEditContacts")}
                                                onBlur={setFieldTouched} error={errors.SelectedContactForEditContacts} touched={touched.SelectedContactForEditContacts} />
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['levelNo'][currentLanguage]}</label>
                                        <div className={'ui input inputDev ' + (errors.levelNoForEdit && touched.levelNoForEdit ? 'has-error' : null) + ' '}>
                                            <input autoComplete="off" value={values.levelNoForEdit} className="form-control" name="levelNoForEdit"
                                                onBlur={(e) => { handleBlur(e) }} onChange={(e) => { handleChange(e) }}
                                                placeholder={Resources['levelNo'][currentLanguage]} />
                                            {errors.levelNoForEdit && touched.levelNoForEdit ? (<em className="pError">{errors.levelNoForEdit}</em>) : null}
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['description'][currentLanguage]}</label>
                                        <div className="inputDev ui input">
                                            <input autoComplete="off" className="form-control" value={values.DescriptionForEdit} name="DescriptionForEdit"
                                                onChange={(e) => { handleChange(e) }} placeholder={Resources['description'][currentLanguage]} />
                                        </div>
                                    </div>

                                    <div className="slider-Btns">
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


                    <HeaderDocument projectName={projectName} docTitle={Resources.workFlow[currentLanguage]} moduleTitle={Resources['generalCoordination'][currentLanguage]} />


                    <div className="doc-container">

                        <div className="skyLight__form">
                            <SkyLightStateless onOverlayClicked={() => this.setState({ showPopUp: false })}
                                title={Resources['editTitle'][currentLanguage]}
                                onCloseClicked={() => this.setState({ showPopUp: false })} isVisible={this.state.showPopUp}>
                                {RenderEditContacts()}
                            </SkyLightStateless>
                        </div>

                        <div className="step-content">
                            {this.state.FirstStep ?
                                <Fragment>
                                    {FirstStepWorkFlow()}
                                </Fragment>
                                :
                                <Fragment>{this.state.SecondStep ? SecondStepContacts() : this.state.ThirdStep ? ThirdStepFollowingUps()
                                    : this.state.FourthStep ? FouthStepDocumentType() : FivethStepMultiApproval()}
                                </Fragment>
                            }
                        </div>

                        {/* Right Menu */}
                        <div className="docstepper-levels">
                            {/* Next & Previous */}
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={this.state.CurrStep !== 1 && this.state.IsEditMode ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}><i className="fa fa-caret-left" aria-hidden="true"></i>{Resources['previous'][currentLanguage]}</span>

                                <span onClick={this.NextStep} className={this.state.docId !== 0 ? "step-content-btn-prev "
                                    : "step-content-btn-prev disabled"}>{Resources['next'][currentLanguage]} <i className="fa fa-caret-right" aria-hidden="true"></i>
                                </span>
                            </div>
                            {/* Steps Active  */}
                            <div className="workflow-sliderSteps">
                                <div className="step-slider">
                                    <div onClick={this.StepOneLink} data-id="step1" className={'step-slider-item ' + (this.state.SecondStepComplate ? "active" : 'current__step')} >
                                        <div className="steps-timeline">
                                            <span>1</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 onClick={e => this.setState({ CurrStep: 1 })}>{Resources['workFlow'][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div onClick={this.StepTwoLink} data-id="step2 " className={'step-slider-item ' + (this.state.ThirdStepComplate ? 'active' : this.state.SecondStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources['contacts'][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div onClick={this.StepThreeLink} data-id="step3" className={'step-slider-item ' + (this.state.FourthStepComplate ? 'active' : this.state.ThirdStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>3</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources['followingUps'][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div onClick={this.StepFourLink} data-id="step4" className={'step-slider-item ' + (this.state.FivethStepComplate ? 'active' : this.state.FourthStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>4</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources['docType'][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div onClick={this.StepFiveLink} data-id="step5" className={this.state.FivethStep ? "step-slider-item  current__step" : "step-slider-item"} >
                                        <div className="steps-timeline">
                                            <span>5</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources['multiApproval'][currentLanguage]}</h6>
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
                            showDeleteModal={this.state.showDeleteModalContact}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                        />
                    ) : null}

                    {this.state.showDeleteModalFollowUp == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModalFollowUp}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmationDeleteFollowup}
                        />
                    ) : null}

                    {this.state.showDeleteModalDocType == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModalDocType}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmationDeleteDocType}
                        />
                    ) : null}


                    <div className="doc-pre-cycle letterFullWidth">
                        {
                            this.props.changeStatus === true ?
                                <div className="approveDocument">
                                    <div className="approveDocumentBTNS">
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
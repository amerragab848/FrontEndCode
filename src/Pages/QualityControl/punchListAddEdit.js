import React, { Component, Fragment } from "react";

import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import Api from '../../api';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import * as communicationActions from '../../store/actions/communication';

import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import GridSetup from "../Communication/GridSetup";
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";

import SkyLight, { SkyLightStateless } from 'react-skylight';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'

import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')

const validationSchemaForAddEditSnagList = Yup.object().shape({

    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    toCompanyId: Yup.string().required(Resources['toCompanyRequired'][currentLanguage])
        .nullable(true),

    fromCompanyId: Yup.string().required(Resources['fromCompanyRequired'][currentLanguage])
        .nullable(true),

    bicContactId: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage]),

    areaId: Yup.string()
        .required(Resources['selectArea'][currentLanguage]),

    disciplineId: Yup.string()
        .required(Resources['disciplineRequired'][currentLanguage])
})

const validationSchemaForAddItem = Yup.object().shape({
    description:
        Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    ActionByContactItem:
        Yup.string().required(Resources['toContactRequired'][currentLanguage]),
})

const validationSchemaForEditItem = Yup.object().shape({
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    ActionByContactItem: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage]),
})

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}

class punchListAddEdit extends Component {

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
                name: Resources["numberAbb"][currentLanguage],
                width: 50,
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
                name: Resources["actionByCompany"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "bicContactId",
                name: Resources["actionByContact"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "areaName",
                name: Resources["area"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "locationName",
                name: Resources["location"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "openedDate",
                name: Resources["openedDate"][currentLanguage],
                width: 110,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate,
            },
            {
                key: "requiredDate",
                name: Resources["requiredDate"][currentLanguage],
                width: 110,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate,
            }


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
            IsAddModel: false,
            FirstStep: true,
            SecondStep: false,
            SecondStepComplate: false,
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
            docTypeId: 61,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            fromContacts: [],
            approvalstatusList: [],
            discplines: [],
            permission: [{ name: 'sendByEmail', code: 280 }, { name: 'sendByInbox', code: 279 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 992 },
            { name: 'createTransmittal', code: 3078 }, { name: 'sendToWorkFlow', code: 738 },
            { name: 'viewAttachments', code: 3311 }, { name: 'deleteAttachments', code: 888 }],

            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },

            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },

            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },

            selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },

            selectedActionByCompanyId: { label: Resources.actionByCompany[currentLanguage], value: "0" },
            selectedContract: { label: Resources.contractPoSelection[currentLanguage], value: "0" },
            selecetedArea: { label: Resources.selectArea[currentLanguage], value: "0" },
            contractsPos: [],
            areas: [],
            IsEditMode: false,
            showPopUp: false,

            //Adding Items States
            ToContactsItem: [],
            StatusItem: 'true',
            MaxArrangeItem: 1,
            OpenedDateItem: moment(),
            RequiredDateItem: moment(),
            SelectedAreaItem: { label: Resources.selectArea[currentLanguage], value: "0" },
            selectedActionByCompanyIdItem: { label: Resources.actionByCompany[currentLanguage], value: "0" },
            selectedActionByContactItem: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedLocationItem: { label: Resources.locationRequired[currentLanguage], value: "0" },
            //Edit Items States
            EditItems: [],
            StatusItemForEdit: 'true'
            // OpenedDateItem: moment(),
            // RequiredDateItem: moment(),
            // SelectedAreaItem: { label: Resources.selectArea[currentLanguage], value: "0" },
            // selectedActionByCompanyIdItem: { label: Resources.actionByCompany[currentLanguage], value: "0" },
            // selectedActionByContactItem: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            // selectedLocationItem: { label: Resources.locationRequired[currentLanguage], value: "0" },

        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document && nextProps.document.id) {
            let SnagListDoc = nextProps.document
            SnagListDoc.docDate = moment(SnagListDoc.docDate).format("DD/MM/YYYY")
            this.setState({
                document: SnagListDoc,
                IsEditMode: true,
                hasWorkflow: nextProps.hasWorkflow,
            });

            this.checkDocumentIsView();
        }
    }

    componentWillUnmount() {
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

    componentWillMount() {
        if (docId > 0) {
            let url = "GetLogsPunchListsForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url);
            dataservice.GetDataGrid('GetLogsPunchListDetailsByPunchListId?projectId=' + this.state.docId + '').then(
                res => {
                    this.setState({
                        IsEditMode: true,
                        rows: res
                    })
                    this.FillDropDowns()
                }
            )
            this.GetMaxArrageItem()


        } else {
            let cmi = Config.getPayload().cmi
            let cni = Config.getPayload().cni
            dataservice.GetRowById('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=61&companyId=' + cmi + '&contactId=' + cni + '').then(
                res => {
                    let SnagListDoc = {
                        projectId: projectId, fromCompanyId: '', toCompanyId: '', subject: '', status: true,
                        disciplineId: '', areaId: '', docDate: moment(), bicCompanyId: '', bicContactId: '', arrange: res,
                        contractId: '', orderId: '', orderType: 'Contract'
                    }
                    this.setState({
                        document: SnagListDoc
                    })
                }
            )
            this.FillDropDowns()
            this.props.actions.documentForAdding();
        }
    }

    componentDidMount = () => {
        this.setState({
            isLoading: false
        })
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(275))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(275)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(275)) {
                    if (this.props.document.status !== false && Config.IsAllow(275)) {
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
        else {
            if (this.state.CurrStep === 2) {
                window.scrollTo(0, 0)
                this.setState({
                    FirstStep: false,
                    SecondStep: false,
                    CurrStep: this.state.CurrStep + 1,
                })
            }
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

    FillDropDowns = () => {

        let DropDownsData = [
            { Api: 'GetAccountsDefaultList?listType=discipline&pageNumber=0&pageSize=10000', DropDataName: 'discplines', Label: 'title', Value: 'id', Name: 'disciplineId', selectedValue: 'selectedDiscpline' },
            { Api: 'GetAccountsDefaultList?listType=area&pageNumber=0&pageSize=10000', DropDataName: 'areas', Label: 'title', Value: 'id', Name: 'areaId', selectedValue: 'selecetedArea' },
            { Api: 'GetProjectProjectsCompaniesForList?projectId=' + projectId + '', DropDataName: 'companies', Label: 'companyName', Value: 'companyId', Name: 'toCompanyId', selectedValue: 'selectedFromCompany' },
            { Api: 'GetPoContractForList?projectId=' + projectId + '', DropDataName: 'contractsPos', Label: 'subject', Value: 'id', Name: 'contractId', selectedValue: 'selectedContract' },
            { Api: 'GetAccountsDefaultList?listType=location&pageNumber=0&pageSize=10000', DropDataName: 'locations', Label: 'title', Value: 'id', Name: 'locationId', selectedValue: 'selectedlocation' },
        ]

        let CompaniesDropDownsData = [
            { Name: 'bicCompanyId', SelectedValueCompany: 'selectedActionByCompanyId', ContactName: 'bicContactId', DropDataContactName: 'ToContacts', SelectedValueContact: 'selectedToContact' },
            { Name: 'toCompanyId', SelectedValueCompany: 'selectedToCompany', ContactName: '', DropDataContactName: '', SelectedValueContact: '' },
            { Name: 'fromCompanyId', SelectedValueCompany: 'selectedFromCompany', ContactName: '', DropDataContactName: '', SelectedValueContact: '' },
        ]

        DropDownsData.map(element => {
            return dataservice.GetDataList(element.Api, element.Label, element.Value).then(
                result => {
                    this.setState({
                        [element.DropDataName]: result,
                    })

                    if (this.state.IsEditMode && docId > 0) {
                        if (element.DropDataName === 'companies') {
                            CompaniesDropDownsData.map(company => {
                                let elementID = this.state.document[company.Name];
                                let SelectedValue = _.find(result, function (i) { return i.value == elementID });
                                this.setState({
                                    [company.SelectedValueCompany]: SelectedValue,
                                })
                                if (company.ContactName !== '') {
                                    dataservice.GetDataList('GetContactsByCompanyId?companyId=' + elementID + '', 'contactName', 'id').then(
                                        res => {
                                            let ContactId = this.state.document[company.ContactName];
                                            let SelectedValueContact = _.find(res, function (i) { return i.value == ContactId; });
                                            this.setState({
                                                [company.DropDataContactName]: res,
                                                [company.SelectedValueContact]: SelectedValueContact,
                                            })
                                        }
                                    )
                                }
                            })
                        }
                        else {
                            let elementID = this.state.document[element.Name];
                            let SelectedValue = _.find(result, function (i) { return i.value == elementID; });
                            this.setState({
                                [element.selectedValue]: SelectedValue,
                            });
                        }
                    }
                }
            )
        })
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

        if (field == "toContactId") {
            let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + event.value;
            this.props.actions.GetNextArrange(url);
            dataservice.GetNextArrangeMainDocument(url).then(res => {
                updated_document.arrange = res;
                updated_document = Object.assign(original_document, updated_document);

                this.setState({
                    document: updated_document
                });
            })
        }

        if (isSubscrib) {
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'contactName', 'id').then(result => {
                this.setState({
                    [targetState]: result
                });
            });
        }

        if (field === 'orderId') {
            let orderId = updated_document.orderId.split('-')
            updated_document.orderId = orderId[0]
            let orderTypeID = orderId[1]
            if (orderTypeID === '1') {
                updated_document.orderType = 'Contract'
            } else {
                updated_document.orderType = 'purchaseOrder'
            }
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document
            });
        }
    }

    handleChange(e, field) {
        console.log(field, e);
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

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

    handleChangeDateItems = (e, Name) => {
        switch (Name) {

            case 'OpenedDateItem':
                this.setState({
                    OpenedDateItem: e
                })
                break;

            case 'RequiredDateItem':
                this.setState({
                    RequiredDateItem: e
                })
                break;

            default:
                break;
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

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
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
        Api.post('DeleteMultipleLogsPunchListDetails', this.state.selectedRows).then(
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
                this.GetMaxArrageItem()
            },
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
        ).catch(ex => {
            this.setState({
                isLoading: false,

            })
        });
    }

    SaveAddEditSnagList = () => {
        if (this.state.IsAddModel) {
            this.NextStep()
        }
        else {
            let SnagListObj = this.state.document
            SnagListObj.docDate = moment(SnagListObj.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')

            if (docId > 0) {

                dataservice.addObject('EditLogsPunchLists', SnagListObj).then(
                    res => {
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    });
                this.NextStep()
            }

            else {
                dataservice.addObject('AddLogsPunchLists', SnagListObj).then(
                    res => {
                        this.setState({
                            docId: res.id,
                            IsAddModel: true
                        })
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    });
                //this.NextStep()
            }
        }
    }

    GetMaxArrageItem = () => {
        Api.get('GetNextArrangeItems?docId=' + this.state.docId + '&docType=61').then(
            res => {
                this.setState({
                    MaxArrangeItem: res
                })
            }
        )
    }

    AddItem = (values) => {
        this.setState({ isLoading: true })
        let OpenedDateItem = moment(this.state.OpenedDateItem, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        let RequiredDateItem = moment(this.state.RequiredDateItem, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        let DocCloseDate = moment().format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        let AddItemObj = {
            id: undefined, punchListId: this.state.docId,
            arrange: values.arrangeItem, bicCompanyId: values.ActionByCompanyIdItem.value,
            bicContactId: values.ActionByContactItem.value, status: this.state.StatusItem,
            openedDate: OpenedDateItem, requiredDate: RequiredDateItem, docCloseDate: DocCloseDate,
            description: values.description, locationId: values.location.value, areaId: values.AreaIdItem.value,
        }

        Api.post('AddLogsPunchListDetails', AddItemObj).then(
            res => {
                let NewRows = this.state.rows
                NewRows.unshift(res)
                this.setState({
                    rows: NewRows,
                    isLoading: false
                })
                toast.success(Resources["operationSuccess"][currentLanguage]);

                values.description = ''

                this.setState({
                    SelectedAreaItem: { label: Resources.selectArea[currentLanguage], value: "0" },
                    selectedActionByCompanyIdItem: { label: Resources.actionByCompany[currentLanguage], value: "0" },
                    selectedActionByContactItem: { label: Resources.toContactRequired[currentLanguage], value: "0" },
                    selectedLocationItem: { label: Resources.locationRequired[currentLanguage], value: "0" },
                })

                this.GetMaxArrageItem()
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    EditItem = (values) => {
        this.setState({ isLoading: true })
        let OpenedDateItem = moment(this.state.OpenedDateItem, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        let RequiredDateItem = moment(this.state.RequiredDateItem, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        let DocCloseDate = moment().format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        let AddItemObj = {
            id: this.state.EditItems.id, punchListId: this.state.docId,
            arrange: values.arrangeItem, status: this.state.StatusItemForEdit,
            openedDate: OpenedDateItem, requiredDate: RequiredDateItem,
            docCloseDate: DocCloseDate, areaId: this.state.SelectedAreaItem.value,
            locationId: this.state.selectedLocationItem.value, description: values.description,
            bicCompanyId: this.state.selectedActionByCompanyIdItem.value,
            bicContactId: this.state.selectedActionByContactItem.value,
        }

        Api.post('EditLogsPunchListDetails', AddItemObj).then(
            res => {
                let NewRows = this.state.rows
                let id = this.state.EditItems.id
                NewRows = this.state.rows.filter(r => r.id !== id);
                NewRows.unshift(res)
                this.setState({
                    rows: NewRows,
                    isLoading: false,
                    showPopUp: false
                })
                this.ClosePopup()
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    ShowPopUp = (obj) => {
        Api.get('GetLogsPunchListDetailsForEdit?id=' + obj.id + '').then(
            res => {
                this.setState({ showPopUp: true, StatusItemForEdit: res.status })
                let SelectedCompany = _.find(this.state.companies, function (i) { return i.value == res.bicCompanyId });
                let SelectedAreaItem = _.find(this.state.areas, function (i) { return i.value == res.areaId });
                let selectedLocationItem = _.find(this.state.locations, function (i) { return i.value == res.locationId });

                dataservice.GetDataList('GetContactsByCompanyId?companyId=' + res.bicCompanyId + '', 'contactName', 'id').then(
                    result => {
                        let selectedActionByContactItem = _.find(result, function (i) { return i.value == res.bicContactId });
                        this.setState({
                            ToContactsItem: result,
                            EditItems: res,
                            OpenedDateItem: moment(res.openedDate).format('DD/MM/YYYY'),
                            RequiredDateItem: moment(res.requiredDate).format('DD/MM/YYYY'),
                            SelectedAreaItem: SelectedAreaItem,
                            selectedActionByCompanyIdItem: SelectedCompany,
                            selectedActionByContactItem: selectedActionByContactItem,
                            selectedLocationItem: selectedLocationItem,
                        })
                    }
                )
            }
        )
    }

    viewAttachments() {
        return (
            this.state.docId > 0 ? (
                Config.IsAllow(3311) === true ?
                    <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={888} />
                    : null)
                : null
        )
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

    ClosePopup = () => {
        this.setState({
            showPopUp: false,
            StatusItemForEdit: 'true',
            SelectedAreaItem: { label: Resources.selectArea[currentLanguage], value: "0" },
            selectedActionByCompanyIdItem: { label: Resources.actionByCompany[currentLanguage], value: "0" },
            selectedActionByContactItem: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedLocationItem: { label: Resources.locationRequired[currentLanguage], value: "0" },
            RequiredDateItem: moment(),
            OpenedDateItem: moment(),
        })
    }

    saveAndExit = () => {
        this.props.history.push({
            pathname: '/punchList/' + projectId + '',
        })
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

        //Render First Step 
        let RenderSnagListAddEdit = () => {
            return (
                <div id="step1" className="step-content-body">
                    <div className="subiTabsContent">
                        <div className="document-fields">
                            <Formik
                                initialValues={{ ...this.state.document }}
                                validationSchema={validationSchemaForAddEditSnagList}
                                enableReinitialize={true}
                                onSubmit={(values) => {
                                    this.SaveAddEditSnagList();
                                }}  >

                                {({ errors, touched, handleBlur, values, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                    <Form id="letterForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

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
                                                <Dropdown data={this.state.companies} selectedValue={this.state.selectedFromCompany}
                                                    handleChange={event => this.handleChangeDropDown(event, 'fromCompanyId', false, '', '', '', 'selectedFromCompany')}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} title="fromCompany"
                                                    error={errors.fromCompanyId} touched={touched.fromCompanyId}
                                                    index="IR-fromCompanyId" name="fromCompanyId" id="fromCompanyId" />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown data={this.state.companies} selectedValue={this.state.selectedToCompany}
                                                    handleChange={event => this.handleChangeDropDown(event, 'toCompanyId', false, '', '', '', 'selectedToCompany')}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} title="toCompany"
                                                    error={errors.toCompanyId} touched={touched.toCompanyId}
                                                    index="IR-toCompanyId" name="toCompanyId" id="toCompanyId" />
                                            </div>


                                            <div className="linebylineInput valid-input mix_dropdown">
                                                <label className="control-label">{Resources.actionByCompany[currentLanguage]}</label>
                                                <div className="supervisor__company">
                                                    <div className="super_name">
                                                        <Dropdown data={this.state.ToContacts} selectedValue={this.state.selectedToContact}
                                                            handleChange={event => this.handleChangeDropDown(event, 'bicContactId', false, '', '', '', 'selectedToContact')}
                                                            onChange={setFieldValue} onBlur={setFieldTouched}
                                                            error={errors.bicContactId} touched={touched.bicContactId}
                                                            index="IR-bicContactId" name="bicContactId" id="bicContactId" />
                                                    </div>

                                                    <div className="super_company">
                                                        <Dropdown data={this.state.companies} selectedValue={this.state.selectedActionByCompanyId}
                                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.bicCompanyId}
                                                            touched={touched.bicCompanyId} name="bicCompanyId"
                                                            handleChange={event =>
                                                                this.handleChangeDropDown(event, 'bicCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedActionByCompanyId', 'selectedToContact')}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown data={this.state.discplines} selectedValue={this.state.selectedDiscpline}
                                                    handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedDiscpline')}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} title="discipline"
                                                    error={errors.disciplineId} touched={touched.disciplineId}
                                                    index="IR-disciplineId" name="disciplineId" id="disciplineId" />
                                            </div>


                                            <div className="linebylineInput valid-input">
                                                <Dropdown data={this.state.contractsPos} selectedValue={this.state.selectedContract}
                                                    handleChange={event => this.handleChangeDropDown(event, 'orderId', false, '', '', '', 'selectedContract')}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} title="contractPo"
                                                    error={errors.contractId} touched={touched.contractId}
                                                    index="IR-contractId" name="contractId" id="contractId" />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown data={this.state.areas} selectedValue={this.state.selecetedArea}
                                                    handleChange={event => this.handleChangeDropDown(event, 'areaId', false, '', '', '', 'selecetedArea')}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} title="areaName"
                                                    error={errors.areaId} touched={touched.areaId}
                                                    index="IR-areaId" name="areaId" id="areaId" />
                                            </div>

                                        </div>

                                        <div className="slider-Btns">
                                            {this.showBtnsSaving()}
                                        </div>

                                    </Form>
                                )}
                            </Formik>
                        </div>

                        <div className="doc-pre-cycle letterFullWidth">
                            <div>
                                {this.state.docId > 0 ?
                                    <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                    : null
                                }

                                {this.viewAttachments()}

                                {this.props.changeStatus === true ?
                                    <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        //Render Add Item In Second Step
        let RenderAddItem = () => {
            return (
                <Formik
                    initialValues={{
                        description: '',
                        ActionByContactItem: '',
                        arrangeItem: this.state.MaxArrangeItem,
                        location: '',
                        ActionByCompanyIdItem: '',
                        AreaIdItem: '',
                    }}

                    enableReinitialize={true}
                    validationSchema={validationSchemaForAddItem}
                    onSubmit={(values, actions) => {
                        console.log(values)
                        this.AddItem(values)
                    }}>

                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form onSubmit={handleSubmit}>


                            <div className="documents-stepper noTabs__document">
                                <div className="doc-container">
                                    <div className="step-content">
                                        <div className='document-fields'>
                                            <div className="proForm datepickerContainer">
                                                <div className="proForm first-proform fullWidthWrapper textLeft">

                                                    <div className={'ui input inputDev linebylineInput ' + (errors.description && touched.description ? 'has-error' : null) + ' '}>
                                                        <label className="control-label">{Resources['description'][currentLanguage]}</label>
                                                        <div className="inputDev ui input">
                                                            <input autoComplete="off" className="form-control" name="description"
                                                                value={values.description}
                                                                onBlur={(e) => { handleBlur(e) }}
                                                                onChange={(e) => {
                                                                    handleChange(e)
                                                                }}
                                                                placeholder={Resources['description'][currentLanguage]} />
                                                            {errors.description && touched.description ? (<em className="pError">{errors.description}</em>) : null}
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label"> {Resources['status'][currentLanguage]} </label>
                                                        <div className="ui checkbox radio radioBoxBlue checked">
                                                            <input type="radio"
                                                                defaultChecked={this.state.StatusItem ? 'checked' : null}
                                                                name="StatusItem" value="true" onChange={(e) => this.setState({ StatusItem: e.target.value })} />
                                                            <label>{Resources['oppened'][currentLanguage]}</label>
                                                        </div>
                                                        <div className="ui checkbox radio radioBoxBlue ">
                                                            <input type="radio" name="StatusItem" value="false"
                                                                defaultChecked={this.state.StatusItem ? null : 'checked'}
                                                                onChange={(e) => this.setState({ StatusItem: e.target.value })} />
                                                            <label> {Resources['closed'][currentLanguage]}</label>
                                                        </div>

                                                    </div>

                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control" readOnly
                                                            onChange={(e) => {
                                                                handleChange(e)
                                                            }} value={values.arrangeItem} name="arrangeItem" placeholder={Resources['numberAbb'][currentLanguage]} />
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <div className="inputDev ui input">
                                                        <DatePicker title='openedDate'
                                                            handleChange={(e) => this.handleChangeDateItems(e, "OpenedDateItem")}
                                                            startDate={this.state.OpenedDateItem}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <div className="inputDev ui input">
                                                        <DatePicker title='requiredDate'
                                                            handleChange={(e) => this.handleChangeDateItems(e, "RequiredDateItem")}
                                                            startDate={this.state.RequiredDateItem}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <Dropdown title="location" data={this.state.locations} name="location"
                                                        selectedValue={this.state.selectedLocationItem}
                                                        onChange={setFieldValue} onBlur={setFieldTouched}
                                                        handleChange={event => this.handleChangeDropDown(event, 'location', false, '', '', '', 'selectedLocationItem')} />
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <Dropdown data={this.state.areas} selectedValue={this.state.SelectedAreaItem}
                                                        handleChange={event => this.handleChangeDropDown(event, 'AreaIdItem', false, '', '', '', 'SelectedAreaItem')}
                                                        onChange={setFieldValue} onBlur={setFieldTouched} title="areaName"
                                                        error={errors.AreaIdItem} touched={touched.AreaIdItem}
                                                        index="IR-AreaIdItem" name="AreaIdItem" id="AreaIdItem" />
                                                </div>

                                                <div className="linebylineInput valid-input mix_dropdown">
                                                    <label className="control-label">{Resources.actionByCompany[currentLanguage]}</label>
                                                    <div className="supervisor__company">
                                                        <div className="super_name">
                                                            <Dropdown data={this.state.ToContactsItem} selectedValue={this.state.selectedActionByContactItem}
                                                                handleChange={event => this.handleChangeDropDown(event, 'ActionByContactItem', false, '', '', '', 'selectedActionByContactItem')}
                                                                onChange={setFieldValue} onBlur={setFieldTouched}
                                                                error={errors.ActionByContactItem} touched={touched.ActionByContactItem}
                                                                index="IR-ActionByContactItem" name="ActionByContactItem" id="ActionByContactItem" />
                                                        </div>

                                                        <div className="super_company">
                                                            <Dropdown data={this.state.companies} selectedValue={this.state.selectedActionByCompanyIdItem}
                                                                onChange={setFieldValue} onBlur={setFieldTouched} error={errors.ActionByCompanyIdItem}
                                                                touched={touched.ActionByCompanyIdItem} name="ActionByCompanyIdItem"
                                                                handleChange={event =>
                                                                    this.handleChangeDropDown(event, 'ActionByCompanyIdItem', true, 'ToContactsItem', 'GetContactsByCompanyId', 'companyId', 'selectedActionByCompanyIdItem', 'selectedActionByContactItem')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="slider-Btns">
                                                <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['addTitle'][currentLanguage]}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            )
        }

        //Render Grid In Second Step
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    minHeight={350}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    onRowClick={this.ShowPopUp}
                />
            ) : <LoadingSection />

        //Render Edit Item Popup In Second Step

        let RenderEditItem = () => {
            return (
                <Formik
                    initialValues={{
                        description: this.state.EditItems.description,
                        ActionByContactItem: ' ',
                        arrangeItem: this.state.EditItems.arrange,
                        location: ' ',
                        ActionByCompanyIdItem: ' ',
                        AreaIdItem: ' ',
                    }}

                    enableReinitialize={true}
                    validationSchema={validationSchemaForEditItem}
                    onSubmit={(values, actions) => {
                        //console.log(values)
                        this.EditItem(values)
                    }}>

                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                        <Form className="dropWrapper" onSubmit={handleSubmit}>

                            <div className="proForm customProform">

                                <div className={'fillter-status fillter-item-c ' + (errors.description && touched.description ? 'has-error' : null) + ' '}>
                                    <label className="control-label">{Resources['description'][currentLanguage]}</label>
                                    <div className="inputDev ui input">
                                        <input autoComplete="off" className="form-control" name="description"
                                            value={values.description}
                                            onBlur={(e) => { handleBlur(e) }}
                                            onChange={(e) => {
                                                handleChange(e)
                                            }}
                                            placeholder={Resources['description'][currentLanguage]} />
                                        {errors.description && touched.description ? (<em className="pError">{errors.description}</em>) : null}
                                    </div>
                                </div>

                                <div className="fillter-status fillter-item-c">
                                    <label className="control-label"> {Resources['status'][currentLanguage]} </label>
                                    <div className="ui checkbox radio radioBoxBlue checked">
                                        <input type="radio" name="StatusItemForEdit" id='StatusItemForEdit'
                                            checked={this.state.StatusItemForEdit} value='true'
                                            onChange={(e) => this.setState({ StatusItemForEdit: e.target.value })} />
                                        <label>{Resources['oppened'][currentLanguage]}</label>
                                    </div>
                                    <div className="ui checkbox radio radioBoxBlue ">
                                        <input type="radio" name="StatusItemForEdit"
                                            checked={!this.state.StatusItemForEdit} value='false'
                                            onChange={(e) => this.setState({ StatusItemForEdit: e.target.value })} />
                                        <label> {Resources['closed'][currentLanguage]}</label>
                                    </div>

                                </div>

                                <div className="fillter-status fillter-item-c">
                                    <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                    <div className="inputDev ui input">
                                        <input autoComplete="off" className="form-control" readOnly
                                            onChange={(e) => {
                                                handleChange(e)
                                            }} value={values.arrangeItem} name="arrangeItem" placeholder={Resources['numberAbb'][currentLanguage]} />
                                    </div>
                                </div>

                                <div className="fillter-status fillter-item-c">
                                    <DatePicker title='openedDate'
                                        handleChange={(e) => this.handleChangeDateItems(e, "OpenedDateItem")}
                                        startDate={this.state.OpenedDateItem}
                                    />
                                </div>

                                <div className="fillter-status fillter-item-c">
                                    <div className="inputDev ui input">
                                        <DatePicker title='requiredDate'
                                            handleChange={(e) => this.handleChangeDateItems(e, "RequiredDateItem")}
                                            startDate={this.state.RequiredDateItem}
                                        />
                                    </div>
                                </div>

                                <Dropdown title="location" data={this.state.locations} name="location"
                                    selectedValue={this.state.selectedLocationItem}
                                    onChange={setFieldValue} onBlur={setFieldTouched}
                                    handleChange={event => this.handleChangeDropDown(event, 'location', false, '', '', '', 'selectedLocationItem')} />

                                <Dropdown data={this.state.areas} selectedValue={this.state.SelectedAreaItem}
                                    handleChange={event => this.handleChangeDropDown(event, 'AreaIdItem', false, '', '', '', 'SelectedAreaItem')}
                                    onChange={setFieldValue} onBlur={setFieldTouched} title="areaName"
                                    error={errors.AreaIdItem} touched={touched.AreaIdItem}
                                    index="IR-AreaIdItem" name="AreaIdItem" id="AreaIdItem" />

                                <div className="linebylineInput valid-input mix_dropdown">
                                    <label className="control-label">{Resources.actionByCompany[currentLanguage]}</label>
                                    <div className="supervisor__company">
                                        <div className="super_name">
                                            <Dropdown data={this.state.ToContacts} selectedValue={this.state.selectedToContact}
                                                handleChange={event => this.handleChangeDropDown(event, 'bicContactId', false, '', '', '', 'selectedToContact')}
                                                onChange={setFieldValue} onBlur={setFieldTouched}
                                                error={errors.bicContactId} touched={touched.bicContactId}
                                                index="IR-bicContactId" name="bicContactId" id="bicContactId" />
                                        </div>

                                        <div className="super_company">
                                            <Dropdown data={this.state.companies} selectedValue={this.state.selectedActionByCompanyId}
                                                onChange={setFieldValue} onBlur={setFieldTouched} error={errors.bicCompanyId}
                                                touched={touched.bicCompanyId} name="bicCompanyId"
                                                handleChange={event =>
                                                    this.handleChangeDropDown(event, 'bicCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedActionByCompanyId', 'selectedToContact')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="slider-Btns fullWidthWrapper">
                                    <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['addTitle'][currentLanguage]}</button>
                                </div>

                            </div>


                        </Form>
                    )}
                </Formik>
            )
        }

        return (
            <div className="mainContainer">

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>

                    <div className="submittalHead">
                        <h2 className="zero">{Resources.punchList[currentLanguage]}
                            <span>{projectName.replace(/_/gi, ' ')} · {Resources['qualityControl'][currentLanguage]}</span>
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

                        <div className="skyLight__form">
                            <SkyLightStateless onOverlayClicked={() => this.ClosePopup()}
                                title={Resources['editTitle'][currentLanguage]}
                                onCloseClicked={() => this.ClosePopup()} isVisible={this.state.showPopUp}>
                                {RenderEditItem()}
                            </SkyLightStateless>
                        </div>

                        <div className="step-content">
                            {this.state.FirstStep ?
                                <Fragment>
                                    {RenderSnagListAddEdit()}
                                </Fragment>

                                : < div className="subiTabsContent feilds__top">

                                    {RenderAddItem()}
                                    <div className="doc-pre-cycle">
                                        <header>
                                            <h2 className="zero">{Resources['AddedItems'][currentLanguage]}</h2>
                                        </header>
                                        {dataGrid}
                                        <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" onClick={this.saveAndExit}>{Resources['next'][currentLanguage]}</button>
                                        </div>
                                    </div>
                                </div>}
                        </div>
                        {/* Right Menu */}
                        <div className="docstepper-levels">
                            {/* Next & Previous */}
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={!this.state.FirstStep && this.state.IsEditMode ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}>{Resources['previous'][currentLanguage]}<i className="fa fa-caret-left" aria-hidden="true"></i></span>

                                <span onClick={this.NextStep} className={!this.state.ThirdStepComplate && this.state.IsEditMode ? "step-content-btn-prev "
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
                                            <h6>{Resources['punchList'][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div data-id="step2 " className={'step-slider-item ' + (this.state.ThirdStepComplate ? 'active' : this.state.SecondStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources['items'][currentLanguage]}</h6>
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

                    <div className="doc-pre-cycle letterFullWidth">
                        {
                            this.props.changeStatus === true ?
                                <div className="approveDocument">
                                    <div className="approveDocumentBTNS">
                                        {this.state.isApproveMode === true ?
                                            <div >
                                                <button className="primaryBtn-1 btn " onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                <button className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>


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
)(withRouter(punchListAddEdit))
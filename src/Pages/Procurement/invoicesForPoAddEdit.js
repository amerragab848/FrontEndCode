import React, { Component, Fragment } from "react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import { SkyLightStateless } from 'react-skylight';
import Tree from '../../Componants/OptionsPanels/Tree'
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Api from "../../api";
import ReactTable from "react-table";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Steps from "../../Componants/publicComponants/Steps";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

var steps_defination = [];
steps_defination = [
    { name: "invoicesForPO", callBackFn: null },
    { name: "items", callBackFn: null },
    { name: "deductions", callBackFn: null }
];

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
})

const documentItemValidationSchema = Yup.object().shape({
    description: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    quantity: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage])
        .required(Resources['quantityRequired'][currentLanguage]),

    resourceCode: Yup.string().required(Resources['resourceCodeRequired'][currentLanguage]),

    unitPrice: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage])
        .required(Resources['unitSelection'][currentLanguage]),

    unit: Yup.string().required(Resources['unitSelection'][currentLanguage]),

    itemType: Yup.string().required(Resources['itemTypeSelection'][currentLanguage]),

    days: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
})

const validationDeductionSchema = Yup.object().shape({
    description: Yup.string().required(Resources['description'][currentLanguage]),
    value: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage])
        .required(Resources['requiredField'][currentLanguage])
})

const documentItemValidationSchemaEdit = Yup.object().shape({

    details: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    quantity: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage])
        .required(Resources['quantityRequired'][currentLanguage]),

    resourceCode: Yup.string().required(Resources['resourceCodeRequired'][currentLanguage]),

    unitPrice: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage])
        .required(Resources['unitSelection'][currentLanguage]),

    unit: Yup.string().required(Resources['unitSelection'][currentLanguage]),
})

const AprovalsData = [
    { label: Resources.pending[currentLanguage], value: null },
    { label: Resources.approved[currentLanguage], value: 'true' },
    { label: Resources.rejected[currentLanguage], value: 'false' }
];

const DeductionsDataDrop = [
    { label: Resources.addition[currentLanguage], value: 1 },
    { label: Resources.deductions[currentLanguage], value: '-1' },
];

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
const _ = require('lodash')

let selectedRows = [];

class invoicesForPoAddEdit extends Component {

    constructor(props) {
        super(props);
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
            CurrStep: 0,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 72,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            permission: [{ name: 'sendByEmail', code: 199 }, { name: 'sendByInbox', code: 198 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 981 },
            { name: 'createTransmittal', code: 3067 }, { name: 'sendToWorkFlow', code: 729 },
            { name: 'viewAttachments', code: 3286 }, { name: 'deleteAttachments', code: 858 }],
            selectedCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedPurchaseOrders: { label: Resources.selectPurchaseOrder[currentLanguage], value: "0" },
            selectedBOQCostCoding: { label: Resources.costCodingSelection[currentLanguage], value: "0" },
            selectedBoqItem: { label: Resources.selectBoq[currentLanguage], value: "0" },
            selectedTransactionType: { label: Resources.selectTransaction[currentLanguage], value: "0" },
            selectedApprovalStatus: { label: Resources.selectStatus[currentLanguage], value: "0" },
            CompaniesData: [],
            PurchaseOrdersData: [],
            BOQCostCodingData: [],
            BoqItemData: [],
            TransactionTypeData: [],
            InvoicesItems: [],
            ShowTree: false,
            AprovalsData: [],
            InvoicesDeductions: [],
            IsDeductionEdit: false,
            ObjDeduction: {},
            selectedDeductionsType: { label: Resources.typeSelect[currentLanguage], value: "" },
            selectedDeductionsTypeAdd: { label: Resources.typeSelect[currentLanguage], value: "" },
            showDeleteModal: false,
            Loading: false,
            selected: {},
            selectedRows: [],
            showDeleteModalItem: false,
            itemTypes: [],
            selectedItemType: { label: Resources.itemTypeSelection[currentLanguage], value: "" },
            ObjItem: {},
            ArrangeItem: 1,
            dueBack: moment(),
            EquipmentTypeData: [],
            selectedEquipmentType: { label: Resources.equipmentTypeSelection[currentLanguage], value: "" },
            BtnLoading: false,
            action: 0,
            showEdititem: false,
            BtnLoadingEdit: false
        }

        if (!Config.IsAllow(193) && !Config.IsAllow(194) && !Config.IsAllow(196)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/invoicesForPo/" + projectId
            });
        }
    }

    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add('even');
            }
            else {
                links[i].classList.add('odd');
            }
        }

        dataservice.GetDataList('GetAccountsDefaultList?listType=equipmenttype&pageNumber=0&pageSize=10000', 'title', 'id').then(
            result => {
                this.setState({
                    EquipmentTypeData: result
                })
            }
        )
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id != this.props.document.id) {
            let document = nextProps.document
            document.docDate = document.docDate === null ? moment().format('YYYY-MM-DD') : moment(document.docDate).format('YYYY-MM-DD')
            this.setState({
                document: document,
                hasWorkflow: nextProps.hasWorkflow,
                message: nextProps.document.message
            });
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(194))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(194)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(194)) {
                    if (this.props.document.status !== false && Config.IsAllow(194)) {
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

    componentWillMount() {

        if (this.state.docId > 0) {
            let url = "GetContractsInvoicesForPoForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'lettertitle');

            Api.get('GetContractsInvoicesForPoItemsByInvoiceId?invoiceId=' + this.state.docId).then(
                result => {
                    this.setState({
                        InvoicesItems: result
                    })
                }
            )

            Api.get('GetContractsInvoicesForPoDeductionssByInvoiceId?invoiceId=' + this.state.docId).then(
                result => {
                    let items = []
                    let data = []
                    items = result
                    items.map(i => {
                        let obj = {}
                        obj.id = i.id
                        obj.invoiceId = i.invoiceId
                        obj.deduction = i.deduction
                        obj.description = i.description
                        obj.factor = i.factor
                        obj.factorName = i.factor === 1 ? Resources.addition[currentLanguage] : Resources.deductions[currentLanguage]
                        data.push(obj)
                    })

                    this.setState({
                        InvoicesDeductions: data
                    })
                }
            )

        } else {
            dataservice.GetNextArrangeMainDocument('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=' + this.state.docTypeId + '&companyId=undefined&contactId=undefined').then(
                result => {
                    let document = {
                        subject: '',
                        id: 0,
                        projectId: this.state.projectId,
                        arrange: result,
                        docDate: moment(),
                        status: true,
                        showItems: true,
                        comment: '',
                        approvalStatus: true,
                        boqId: '',
                        companyId: '',
                        total: undefined,
                        costCodingTreeId: '',
                        costCodingTreeName: '',
                        collected: 1,
                        transactionType: '',
                        purchaseOrderId: '',
                        isCanceled: false,
                        expensesType: undefined,
                        usedInAccounting: false,
                        boqItemId: '',
                        items: []
                    }
                    this.setState({ document });
                    this.fillDropDowns(false);
                    this.props.actions.documentForAdding();
                }
            )
        }
        dataservice.GetDataList('GetaccountsDefaultListWithAction?listType=estimationitemtype', 'title', 'id').then(res => {
            this.setState({ itemTypes: [...res] })
        })
    }

    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource, DropLable, DropValue) {
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, DropLable, DropValue).then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = _.find(result, function (i) { return i.value == toSubField; });
                console.log(targetFieldSelected);
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        });
    }

    fillDropDowns(isEdit) {

        dataservice.GetDataList('GetContractsBoqShowInCostCodingTree?projectId=' + this.state.projectId + '&pageNumber=0&pageSize=1000000', 'subject', 'id').then(result => {

            if (isEdit) {
                let id = this.props.document.boqId;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value == id })
                    this.setState({
                        selectedBOQCostCoding: selectedValue
                    });
                    this.fillSubDropDownInEdit('GetContractsBoqItems', 'boqId', id, 'boqItemId', 'selectedBoqItem', 'BoqItemData', 'details', 'id');
                }
            }
            this.setState({
                BOQCostCodingData: [...result]
            });
        })

        dataservice.GetDataList('GetProjectProjectsCompaniesForList?projectId= ' + this.state.projectId, 'companyName', 'companyId').then(result => {
            if (isEdit) {
                let id = this.props.document.companyId;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value == id });

                    this.setState({
                        selectedCompany: selectedValue
                    });
                }
            }
            this.setState({
                CompaniesData: [...result]
            });
        })

        dataservice.GetDataList('GetPurchaseOrdersList?projectId= ' + this.state.projectId, 'subject', 'id').then(
            result => {
                if (isEdit) {
                    let id = this.props.document.purchaseOrderId;
                    let selectedValue = {};
                    if (id) {
                        selectedValue = _.find(result, function (i) { return i.value == id });
                        this.setState({
                            selectedPurchaseOrders: selectedValue
                        });
                    }
                }
                this.setState({
                    PurchaseOrdersData: result
                });
            })

        dataservice.GetDataList('GetAccountsDefaultList?listType=transactiontype&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            if (isEdit) {
                let id = this.props.document.transactionType;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value == id; });
                    this.setState({
                        selectedTransactionType: selectedValue
                    });
                }
            }
            this.setState({
                selectedApprovalStatus: isEdit ? { label: this.props.document.approvalStatusName, value: this.props.document.approvalStatus } : { label: Resources.selectStatus[currentLanguage], value: "0" },
                TransactionTypeData: result,
                AprovalsData: AprovalsData
            })
        })
        this.checkDocumentIsView();
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
        if (field === 'dueBack') {
            this.setState({
                dueBack: e
            })
        }
        else {
            let original_document = { ...this.state.document };
            let updated_document = {};
            updated_document[field] = e;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({
                document: updated_document
            })
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
        })

        if (isSubscrib) {
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'details', 'id').then(result => {
                this.setState({
                    BoqItemData: result
                });
            });
        }
        if (field === 'purchaseOrderId') {
            if (docId === 0) {
                Api.get('GetContractsOrdersItemsExcutionPoByPurchaseId?purchaseId=' + event.value).then(
                    result => {
                        this.setState({
                            InvoicesItems: result
                        })
                    }
                )
            }
        }
    }

    EditDoc(event) {
        this.setState({
            isLoading: true
        });
        let saveDocument = { ...this.state.document };
        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.items = this.state.InvoicesItems
        dataservice.addObject('EditContractsInvoicesForPo', saveDocument).then(result => {
            this.setState({
                isLoading: false
            })
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
        this.changeCurrentStep(1);
    }

    AddDoc(event) {
        if (this.state.docId !== 0) {
            this.changeCurrentStep(1);
        }
        else {
            this.setState({
                isLoading: true
            });
            let saveDocument = { ...this.state.document };

            saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");

            dataservice.addObject('AddContractsInvoicesForPo', saveDocument).then(result => {
                let itemsList = []
                let InvoicesItems = this.state.InvoicesItems
                let invoiceId = result.id
                InvoicesItems.map(item => {
                    let items = {}
                    items.invoiceId = invoiceId
                    items.itemId = item.itemId
                    items.specsSectionId = item.specsSectionId
                    items.details = item.details
                    items.unit = item.unit
                    items.days = item.days
                    items.unitPrice = item.unitPrice
                    items.equipmenttypeId = item.equipmenttypeId
                    items.quantity = item.quantity
                    items.quantityComplete = item.quantityComplete
                    items.resourceCode = item.resourceCode
                    items.purchaseOrderId = this.state.selectedPurchaseOrders.value
                    itemsList.push(items)
                })
                this.setState({
                    docId: result.id,
                    InvoicesItems: itemsList,
                    isLoading: false
                })
                saveDocument.items = itemsList
                dataservice.addObject('AddContractsInvoicesForPoItemsList', saveDocument).then(
                    res => {

                    })
                toast.success(Resources["operationSuccess"][currentLanguage]);
            })
        }

    }

    saveAndExit(event) {
        this.props.history.push({
            pathname: "/invoicesForPo/" + this.state.projectId
        });
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0 && this.props.changeStatus === false) {
            btn = <button className="primaryBtn-1 btn mediumBtn" type="submit" >{Resources.next[currentLanguage]}</button>
        }
        return btn;
    }

    viewAttachments() {
        return (
            this.state.docId > 0 ? (
                Config.IsAllow(857) === true ?
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    ShowCostTree = () => {
        this.setState({ ShowTree: true })
    }

    GetNodeData = (item) => {
        console.log(item)
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document['costCodingTreeName'] = item.codeTreeTitle;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    OnBlurTaxesValue = (e, index) => {
    }

    HandleChangeTaxesValue = (e, index) => {
        let data = this.state.InvoicesItems
        let element = data[index]
        let quantityComplete = data[index]['minQnty']
        let minQnty = data[index]['minQnty']
        let maxQnty = data[index]['maxQnty']
        let value = parseInt(e.target.value)
        if (value > maxQnty) {
            e.target.value = quantityComplete
        }
        else if (value < minQnty) {
            e.target.value = quantityComplete
        }
        else {
            if (e.target.value === '') {
                e.target.value = quantityComplete
            }
            data[index]['quantityComplete'] = e.target.value
            this.setState({ InvoicesItems: data })
        }
    }

    EditDeduction = (obj) => {
        this.setState({
            ObjDeduction: obj._original,
            IsDeductionEdit: true,
            ShowDeductionPopup: true,
            selectedDeductionsType: obj._original.factor === 1 ? { label: Resources.addition[currentLanguage], value: 1 } :
                { label: Resources.deductions[currentLanguage], value: '-1' }
        })
    }

    DeleteDeduction = (obj) => {
        this.setState({
            ObjDeduction: obj._original,
            showDeleteModal: true
        })
    }

    ConfirmationDeleteDeduction = () => {
        this.setState({ Loading: true })

        Api.post('DeleteContractsInvoicesForPoDeductions?id=' + this.state.ObjDeduction.id).then(
            res => {
                let id = this.state.ObjDeduction.id
                let Data = this.state.InvoicesDeductions;
                Data = Data.filter(s => s.id !== id)
                this.setState({
                    InvoicesDeductions: Data,
                    showDeleteModal: false,
                    Loading: false,
                })
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }
        ).catch(ex => {
            this.setState({
                showDeleteModal: false,
                Loading: false,
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });

    }

    ConfirmationDeleteItem = () => {
        this.setState({ Loading: true })
        let ids = []
        selectedRows.map(s => {
            ids.push(s.id)
        })
        Api.post('DeleteMultipleContractsInvoicesForPoItems', ids).then(
            res => {
                let originalRows = this.state.InvoicesItems

                ids.map(i => {
                    originalRows = originalRows.filter(r => r.id !== i);
                })
                selectedRows = []
                let data = { items: originalRows };
                this.props.actions.ExportingData(data);
                this.setState({
                    InvoicesItems: originalRows,
                    showDeleteModalItem: false,
                    Loading: false,
                })
            },
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
        ).catch(ex => {
            this.setState({
                showDeleteModal: false,
                Loading: false,
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
    }

    AddEditDeduction = (values) => {
        this.setState({ Loading: true })
        if (this.state.IsDeductionEdit) {
            let obj = this.state.ObjDeduction
            obj.factor = this.state.selectedDeductionsType.value
            obj.deduction = values.value
            obj.description = values.description
            obj.invoiceId = this.state.docId
            dataservice.addObject('EditContractsInvoicesForPoDeductions', obj).then(
                res => {
                    let items = []
                    let data = []
                    items = res
                    items.map(i => {
                        let obj = {}
                        obj.id = i.id
                        obj.invoiceId = i.invoiceId
                        obj.deduction = i.deduction
                        obj.description = i.description
                        obj.factor = i.factor
                        obj.factorName = i.factor === 1 ? Resources.addition[currentLanguage] : Resources.deductions[currentLanguage]
                        data.push(obj)
                    })
                    this.setState({ InvoicesDeductions: data, Loading: false })
                    toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
                }
            ).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
        }
        else {
            let obj =
            {
                factor: this.state.selectedDeductionsTypeAdd.value,
                invoiceId: this.state.docId,
                deduction: values.value,
                description: values.description
            }
            dataservice.addObject('AddContractsInvoicesForPoDeductions', obj).then(
                res => {
                    let items = []
                    let data = []
                    items = res
                    items.map(i => {
                        let obj = {}
                        obj.id = i.id
                        obj.invoiceId = i.invoiceId
                        obj.deduction = i.deduction
                        obj.description = i.description
                        obj.factor = i.factor
                        obj.factorName = i.factor === 1 ? Resources.addition[currentLanguage] : Resources.deductions[currentLanguage]
                        data.push(obj)
                    })
                    values.value = ''
                    values.description = ''
                    this.setState({
                        InvoicesDeductions: data, Loading: false,
                        selectedDeductionsTypeAdd: { label: Resources.typeSelect[currentLanguage], value: "" }
                    })

                    toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
                }
            ).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
        }
    }

    toggleRow(obj) {

        const newSelected = Object.assign({}, this.state.selected);
        newSelected[obj.id] = !this.state.selected[obj.id];
        let setIndex = selectedRows.findIndex(x => x.id === obj.id);
        if (setIndex > -1) {
            selectedRows.splice(setIndex, 1);
        } else {
            selectedRows.push(obj);
        }
        this.setState({
            selected: newSelected,
        })

    }

    DeleteItems = () => {
        this.setState({ showDeleteModalItem: true })
    }

    GetNextArrangeItems = () => {
        dataservice.GetNextArrangeMainDocument('GetNextArrangeItems?docId=' + this.state.docId + '&docType=' + this.state.docTypeId).then(
            res => {
                this.setState({
                    ArrangeItem: res
                })
            }
        )
    }

    handleChangeItemType = (e) => {
        switch (e.label) {

            case 'Material':
                this.setState({
                    selectedItemType: e,
                    ShowDays: false,
                    ShowEquipmentType: false,
                    action: 1
                })
                break;
            case 'Labor':
                this.setState({
                    selectedItemType: e,
                    ShowDays: true,
                    ShowEquipmentType: false,
                    action: 2
                })
                break;

            case 'Equipment':
                this.setState({
                    selectedItemType: e,
                    ShowDays: true,
                    ShowEquipmentType: true,
                    action: 3
                })
                break;
            case 'lumpSum':
                this.setState({
                    selectedItemType: e,
                    ShowDays: false,
                    ShowEquipmentType: false,
                    action: 5
                })
                break;

            default:
                this.setState({
                    selectedItemType: e,
                    ShowDays: false,
                    ShowEquipmentType: false
                })
        }

    }

    AddNewItem = (values) => {
        this.setState({ isLoading: true, BtnLoading: true })
        let obj = {
            invoiceId: this.state.docId,
            details: values.description,
            unit: values.unit,
            quantity: values.quantity,
            unitPrice: values.unitPrice,
            arrange: this.state.ArrangeItem,
            resourceCode: values.resourceCode,
            quantityComplete: values.quantity,
            days: values.days,
            dueBack: this.state.dueBack,
            action: this.state.action,
            approvalStatus: true,
        }
        let objWithActions = {
            invoiceId: this.state.docId,
            details: values.description,
            unit: values.unit,
            quantity: values.quantity,
            unitPrice: values.unitPrice,
            arrange: this.state.ArrangeItem,
            resourceCode: values.resourceCode,
            quantityComplete: values.quantity,
            days: values.days,
            equipmenttypeId: this.state.selectedEquipmentType.value,
            dueBack: this.state.dueBack,
            action: this.state.action,
            approvalStatus: true,
        }
        let sendobj = this.state.action === 3 ? objWithActions : obj
        dataservice.addObject('AddContractsInvoicesForPoItems', sendobj).then(
            res => {
                values.description = ''
                values.unit = ''
                values.quantity = ''
                values.unitPrice = ''
                values.resourceCode = ''
                values.days = 1
                this.GetNextArrangeItems()
                let data = this.state.InvoicesItems
                data.push(res)
                this.setState({
                    InvoicesItems: data,
                    isLoading: false, BtnLoading: false
                })
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }
        ).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        })
    }

    EditItem = (obj) => {
        console.log(obj._original)
        this.setState({
            ObjItem: obj._original,
            showEdititem: true,
        })

    }

    handleChangeItems = (e, field) => {
        let original_document = { ...this.state.ObjItem };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            ObjItem: updated_document
        })
    }

    EditItemSave = () => {
        this.setState({ isLoading: true, BtnLoadingEdit: true })
        dataservice.addObject('EditContractsInvoicesForPoItems', this.state.ObjItem).then(
            res => {
                let data = this.state.InvoicesItems
                let NewData = data.filter(s => s.id !== this.state.ObjItem.id)
                NewData.push(this.state.ObjItem)
                this.setState({
                    InvoicesItems: NewData,
                    isLoading: false, BtnLoadingEdit: false, showEdititem: false
                })
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }
        ).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        })
    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrStep: stepNo });
    };

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    render() {

        let columnsDeduction = [
            {
                Header: Resources["action"][currentLanguage],
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <Fragment>
                            <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.EditDeduction(row)}>
                                <i style={{ fontSize: "1.6em" }} className="fa fa-pencil-square-o" />
                            </div>
                            <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.DeleteDeduction(row)}>
                                <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                            </div>
                        </Fragment>
                    )
                },
                width: 120
            },
            {
                Header: Resources['description'][currentLanguage],
                accessor: 'description',
                width: 250,
            }, {
                Header: Resources['deductions'][currentLanguage],
                accessor: 'deduction',
                width: 150,
            }, {
                Header: Resources['factor'][currentLanguage],
                accessor: 'factorName',
                width: 200,
            }
        ]

        let RenderItemsTable = () => {
            return (
                <div className='document-fields'>
                    <header>
                        <h2 className="zero">{Resources['itemsList'][currentLanguage]}</h2>
                    </header>
                    <div className="table__overflow">
                        <table className="attachmentTable">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="headCell tableCell-1">
                                            <span>{Resources.number[currentLanguage]} </span>
                                        </div>
                                    </th>
                                    <th colSpan={6}>
                                        <div className="headCell tableCell-2">
                                            <span>{Resources.description[currentLanguage]} </span>
                                        </div>
                                    </th>
                                    <th >
                                        <div className="headCell tableCell-2">
                                            <span>{Resources['specsSection'][currentLanguage]} </span>
                                        </div>
                                    </th>

                                    <th>
                                        <div className="headCell tableCell-3">
                                            <span>{Resources.poQuantity[currentLanguage]} </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="headCell tableCell-3">
                                            <span>{Resources.price[currentLanguage]} </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="headCell tableCell-3">
                                            <span>{Resources.unit[currentLanguage]} </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="headCell tableCell-3">
                                            <span>{Resources.total[currentLanguage]} </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="headCell tableCell-3">
                                            <span>{Resources.totalExcuted[currentLanguage]} </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="headCell tableCell-3">
                                            <span>{Resources.previousQuantity[currentLanguage]} </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="headCell tableCell-3">
                                            <span>{Resources.quantityComplete[currentLanguage]} </span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.InvoicesItems.map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="contentCell tableCell-1"> <span>{item.arrange} </span> </div>
                                            </td>
                                            <td colSpan={6}>
                                                <div className="contentCell tableCell-2"> <span>{item.details} </span> </div>
                                            </td>

                                            <td>
                                                <div className="contentCell tableCell-3"> <span>{item.specsSectionTitle} </span> </div>
                                            </td>
                                            <td>
                                                <div className="contentCell tableCell-3"> <span>{item.quantity} </span> </div>
                                            </td>
                                            <td>
                                                <div className="contentCell tableCell-3"> <span>{item.unitPrice} </span> </div>
                                            </td>
                                            <td>
                                                <div className="contentCell tableCell-2"> <span>{item.unit} </span> </div>
                                            </td>
                                            <td>
                                                <div className="contentCell tableCell-2"><span>{item.total} </span> </div>
                                            </td>
                                            <td>
                                                <div className="contentCell tableCell-2"> <span>{item.totalExcuted} </span> </div>
                                            </td>
                                            <td>
                                                <div className="contentCell tableCell-2"> <span>{item.prevoiusedQuantity} </span> </div>
                                            </td>
                                            <td>
                                                <div className="contentCell tableCell-3">
                                                    <div className='ui input inputDev linebylineInput'>
                                                        <input type="number" onBlur={(e) => this.OnBlurTaxesValue(e, index)} className="form-control" defaultValue={item.quantityComplete} onChange={(e) => this.HandleChangeTaxesValue(e, index)} />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }

        let RenderDocDetails = () => {
            return (
                <Fragment>
                    <header className="main__header">
                        <div className="main__header--div">
                            <h2 className="zero">{Resources["docDetails"][currentLanguage]}</h2>
                        </div>
                    </header>
                    <div className="proForm datepickerContainer">

                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources.originalPOSum[currentLanguage]}</label>
                            <div className="ui input inputDev">
                                <input type="text" className="form-control" readOnly defaultValue={this.state.document.originalContractSum} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label"> {Resources.totalCurrentInvoice[currentLanguage]}</label>
                            <div className="ui input inputDev">
                                <input type="text" className="form-control" readOnly defaultValue={this.state.document.payed} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label"> {Resources.totalDeductions[currentLanguage]} </label>
                            <div className="ui input inputDev">
                                <input type="text" className="form-control" readOnly defaultValue={this.state.document.totalDeduction} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources.totalAddition[currentLanguage]}</label>
                            <div className="ui input inputDev">
                                <input type="text" className="form-control" readOnly defaultValue={this.state.document.totalAddition} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources.finalTotal[currentLanguage]}</label>
                            <div className="ui input inputDev">
                                <input type="text" className="form-control" readOnly defaultValue={this.state.document.finalTotal} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources.balanceToFinish[currentLanguage]}</label>
                            <div className="ui input inputDev">
                                <input type="text" className="form-control" readOnly defaultValue={this.state.document.balance} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources.poExcutedToDate[currentLanguage]}</label>
                            <div className="ui input inputDev">
                                <input type="text" className="form-control" readOnly defaultValue={this.state.document.totalPayed} />
                            </div>
                        </div>

                    </div>
                </Fragment>
            )
        }

        let StepOne = () => {
            return (
                <div id="step1" className="step-content-body">
                    <div className="subiTabsContent">
                        <div className="document-fields">
                            <Formik
                                initialValues={{ ...this.state.document }}
                                validationSchema={validationSchema}
                                enableReinitialize={true}
                                onSubmit={values => {
                                    if (this.props.showModal) { return; }
                                    if (this.props.changeStatus === true && this.state.docId > 0) {
                                        this.EditDoc();
                                        this.changeCurrentStep(1);
                                    } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                        this.AddDoc();
                                    } else {
                                        this.changeCurrentStep(1);
                                    }
                                }}>

                                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
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

                                                    <input type="text" className="form-control" readOnly
                                                        value={this.state.document.arrange} placeholder={Resources.arrange[currentLanguage]}
                                                        onBlur={(e) => {
                                                            handleChange(e)
                                                            handleBlur(e)
                                                        }}
                                                        onChange={(e) => this.handleChange(e, 'arrange')} />
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input linebylineInput__name">
                                                <label className="control-label">{Resources.comment[currentLanguage]}</label>
                                                <div className="ui input inputDev"  >
                                                    <input type="text" className="form-control" value={this.state.document.comment}
                                                        placeholder={Resources.comment[currentLanguage]} onChange={(e) => this.handleChange(e, 'comment')} />
                                                </div>
                                            </div>


                                            <div className="linebylineInput valid-input">
                                                <Dropdown isDisabled={this.props.changeStatus} title="purchaseOrder" data={this.state.PurchaseOrdersData} selectedValue={this.state.selectedPurchaseOrders}
                                                    handleChange={event => this.handleChangeDropDown(event, 'purchaseOrderId', false, '', '', '', 'selectedPurchaseOrders')} />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="CompanyName" data={this.state.CompaniesData} selectedValue={this.state.selectedCompany}
                                                    handleChange={event => this.handleChangeDropDown(event, 'companyId', false, '', '', '', 'selectedCompany')} />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="BOQCostCoding" data={this.state.BOQCostCodingData} selectedValue={this.state.selectedBOQCostCoding}
                                                    handleChange={event => this.handleChangeDropDown(event, 'boqId', true, 'selectedBoqItem', 'GetContractsBoqItems', 'boqId', 'selectedBOQCostCoding', 'selectedBoqItem')} />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.costCoding[currentLanguage]}</label>
                                                <div className="shareLinks">
                                                    <div className="inputDev ui input">
                                                        <input type="text" className="form-control"
                                                            onChange={(e) => this.handleChange(e, 'costCodingTreeName')}
                                                            value={this.state.document.costCodingTreeName}
                                                            name="costCodingTreeName"
                                                            placeholder={Resources.costCoding[currentLanguage]} />
                                                    </div>
                                                    <div style={{ marginLeft: '8px' }} onClick={e => this.ShowCostTree()}>
                                                        <span className="collapseIcon"><span className="plusSpan greenSpan">+</span>
                                                            <span>{Resources.add[currentLanguage]}</span>  </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="boqItem" data={this.state.BoqItemData} selectedValue={this.state.selectedBoqItem}
                                                    handleChange={event => this.handleChangeDropDown(event, 'boqItemId', false, '', '', '', 'selectedBoqItem')} />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.collectedStatus[currentLanguage]}</label>
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input type="radio" name="collected"
                                                        onBlur={e => this.handleChange(e, 'collected')} defaultChecked={this.state.document.collected === 0 ? null : 'checked'}
                                                        value="true" onChange={e => this.handleChange(e, 'collected')} />
                                                    <label>{Resources.yes[currentLanguage]}</label>
                                                </div>

                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input type="radio" name="collected"
                                                        onBlur={e => this.handleChange(e, 'collected')} defaultChecked={this.state.document.collected === 0 ? 'checked' : null}
                                                        value="false" onChange={e => this.handleChange(e, 'collected')} />
                                                    <label>{Resources.no[currentLanguage]}</label>
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.canceled[currentLanguage]}</label>
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input type="radio" name="isCanceled" onBlur={e => this.handleChange(e, 'isCanceled')} defaultChecked={this.state.document.isCanceled === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'isCanceled')} />
                                                    <label>{Resources.yes[currentLanguage]}</label>
                                                </div>

                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input type="radio" name="isCanceled" onBlur={e => this.handleChange(e, 'isCanceled')} defaultChecked={this.state.document.isCanceled === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'isCanceled')} />
                                                    <label>{Resources.no[currentLanguage]}</label>
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="transactionType" data={this.state.TransactionTypeData} selectedValue={this.state.selectedTransactionType}
                                                    handleChange={event => this.handleChangeDropDown(event, 'transactionType', false, '', '', '', 'selectedTransactionType')} />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="approvalStatus" data={this.state.AprovalsData} selectedValue={this.state.selectedApprovalStatus}
                                                    handleChange={event => this.handleChangeDropDown(event, 'approvalStatus', false, '', '', '', 'selectedApprovalStatus')} />
                                            </div>

                                        </div>
                                        {RenderItemsTable()}

                                        {this.state.docId !== 0 ?
                                            <Fragment>
                                                {RenderDocDetails()}
                                            </Fragment>
                                            : null}

                                        <div className="slider-Btns">
                                            {this.state.isLoading ?
                                                <button className="primaryBtn-1 btn disabled">
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button> :
                                                this.showBtnsSaving()}
                                        </div>
                                        {this.props.changeStatus === true ?
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
                                                        <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} type="submit">{Resources.save[currentLanguage]}</button>
                                                    }
                                                    <DocumentActions
                                                        isApproveMode={this.state.isApproveMode}
                                                        docTypeId={this.state.docTypeId}
                                                        docId={this.state.docId}
                                                        projectId={this.state.projectId}
                                                        previousRoute={this.state.previousRoute}
                                                        docApprovalId={this.state.docApprovalId}
                                                        currentArrange={this.state.currentArrange}
                                                        showModal={this.props.showModal}
                                                        showOptionPanel={this.showOptionPanel}
                                                        permission={this.state.permission}
                                                    />

                                                </div>
                                            </div>
                                            : null}

                                        <div className="doc-pre-cycle letterFullWidth">
                                            <div>
                                                {this.state.docId > 0 ?
                                                    <UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={857} EditAttachments={3245} ShowDropBox={3545}
                                                        ShowGoogleDrive={3546} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                    : null}
                                                {this.viewAttachments()}
                                                {this.props.changeStatus === true ?
                                                    <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                    : null}
                                            </div>
                                        </div>

                                        <div className="slider-Btns">
                                            {this.state.isLoading ?
                                                <button className="primaryBtn-1 btn disabled">
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button>
                                                :
                                                this.showBtnsSaving()}
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>



                    </div>
                </div>
            )
        }

        let StepThree = () => {

            return (
                <div className="doc-pre-cycle">
                    <div className="subiTabsContent feilds__top">
                        <Formik
                            initialValues={{
                                value: '',
                                description: '',
                                type: ''
                            }}

                            enableReinitialize={true}
                            validationSchema={validationDeductionSchema}
                            onSubmit={(values, actions) => {
                                this.AddEditDeduction(values)
                            }}>

                            {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                <Form onSubmit={handleSubmit}>
                                    {this.state.IsDeductionEdit === false ?
                                        <header>
                                            <h2 className="zero">{Resources['deductions'][currentLanguage]}</h2>
                                        </header> : null}


                                    <div className='document-fields'>

                                        <div className="proForm first-proform">
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.description && touched.description ? (" has-error") : !errors.description && touched.description ? (" has-success") : " ")} >
                                                    <input name='description' className="form-control fsadfsadsa" id="description"
                                                        placeholder={Resources.description[currentLanguage]} value={values.description}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                    {touched.description ? (<em className="pError">{errors.description}</em>) : null}

                                                </div>
                                            </div>
                                        </div>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="type" data={DeductionsDataDrop} name="type"
                                                    selectedValue={this.state.selectedDeductionsTypeAdd}
                                                    handleChange={e => this.setState({ selectedDeductionsTypeAdd: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['value'][currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.value && touched.value ? (" has-error") : !errors.value && touched.value ? (" has-success") : " ")} >
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control" value={values.value} name="value"
                                                            onBlur={(e) => {
                                                                handleBlur(e)
                                                                handleChange(e)
                                                            }} onChange={handleChange} placeholder={Resources['value'][currentLanguage]} />
                                                        {touched.value ? (<em className="pError">{errors.value}</em>) : null}
                                                    </div>
                                                </div>

                                            </div>

                                        </div> <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['save'][currentLanguage]}</button>
                                        </div>
                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['informationDeductions'][currentLanguage]}</h2>
                                            </header>

                                            <ReactTable
                                                // filterable
                                                ref={(r) => { this.selectTable = r }}
                                                data={this.state.InvoicesDeductions} noDataText={Resources['noData'][currentLanguage]}
                                                columns={columnsDeduction} defaultPageSize={10} minRows={2} />
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        <div className="doc-pre-cycle">
                            <div className="slider-Btns">
                                <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(3)}>NEXT STEP</button>
                            </div>
                        </div>

                    </div>
                </div >
            )
        }

        let EditDeductionPopup = () => {
            return (
                <div className="doc-pre-cycle">
                    <div className="subiTabsContent feilds__top">
                        <Formik
                            initialValues={{
                                value: this.state.ObjDeduction.deduction,
                                description: this.state.ObjDeduction.description,
                            }}

                            enableReinitialize={true}
                            validationSchema={validationDeductionSchema}
                            onSubmit={(values, actions) => {
                                this.AddEditDeduction(values, actions)
                            }}>

                            {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                <Form onSubmit={handleSubmit}>


                                    <div className='document-fields'>

                                        <div className="proForm first-proform">
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.description && touched.description ? (" has-error") : !errors.description && touched.description ? (" has-success") : " ")} >
                                                    <input name='description' className="form-control fsadfsadsa" id="description"
                                                        placeholder={Resources.description[currentLanguage]} value={values.description}
                                                        autoComplete='off' onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                    {touched.description ? (<em className="pError">{errors.description}</em>) : null}

                                                </div>
                                            </div>
                                        </div>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="type" data={DeductionsDataDrop}
                                                    selectedValue={this.state.selectedDeductionsType}
                                                    handleChange={e => this.setState({ selectedDeductionsType: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['value'][currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.value && touched.value ? (" has-error") : !errors.value && touched.value ? (" has-success") : " ")} >
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control" value={values.value} name="value"
                                                            onBlur={(e) => {
                                                                handleBlur(e)
                                                                handleChange(e)
                                                            }} onChange={handleChange} placeholder={Resources['value'][currentLanguage]} />
                                                        {touched.value ? (<em className="pError">{errors.value}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>

                                        </div> <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['save'][currentLanguage]}</button>
                                        </div>

                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div >
            )
        }

        let StepTwo = () => {

            let columnsItem = [
                {
                    Header: Resources["select"][currentLanguage],
                    id: "checkbox",
                    accessor: "id",
                    Cell: ({ row }) => {
                        return (
                            <div className="ui checked checkbox  checkBoxGray300 ">
                                <input type="checkbox" className="checkbox" checked={this.state.selected[row._original.id] === true} onChange={() => this.toggleRow(row._original)} />
                                <label />
                            </div>
                        );
                    },
                    width: 70
                },
                {
                    Header: Resources["action"][currentLanguage],
                    accessor: "id",
                    Cell: ({ row }) => {
                        return (
                            <Fragment>
                                <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.EditItem(row)}>
                                    <i style={{ fontSize: "1.6em" }} className="fa fa-pencil-square-o" />
                                </div>
                            </Fragment>
                        )
                    },
                    width: 70
                },
                {
                    Header: Resources['number'][currentLanguage],
                    accessor: 'arrange',
                    width: 100,
                }, {
                    Header: Resources['details'][currentLanguage],
                    accessor: 'details',
                    width: 200,
                },
                {
                    Header: Resources['resourceCode'][currentLanguage],
                    accessor: 'resourceCode',
                    width: 100,
                },
                {
                    Header: Resources['quantity'][currentLanguage],
                    accessor: 'quantity',
                    width: 100,
                }, {
                    Header: Resources['unitPrice'][currentLanguage],
                    accessor: 'unitPrice',
                    width: 100,
                },
                {
                    Header: Resources['total'][currentLanguage],
                    accessor: 'total',
                    width: 100,
                }, {
                    Header: Resources['days'][currentLanguage],
                    accessor: 'days',
                    width: 100,
                }, {
                    Header: Resources['quantityComplete'][currentLanguage],
                    accessor: 'quantityComplete',
                    width: 100,
                }
            ]
            return (
                <div className="step-content">
                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                description: '',
                                quantity: '',
                                unit: '',
                                unitPrice: '',
                                itemType: '',
                                resourceCode: '',
                                days: 1
                            }}
                            validationSchema={documentItemValidationSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => {
                                this.AddNewItem(values)
                            }}                >
                            {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <header className="main__header">
                                        <div className="main__header--div">
                                            <h2 className="zero">{Resources['addItems'][currentLanguage]}</h2>
                                        </div>
                                    </header>
                                    <div className='document-fields'>

                                        <div className="letterFullWidth proForm  first-proform proform__twoInput">
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['description'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.description ? 'has-error' : !errors.description && touched.description ? (" has-success") : " ")}>
                                                    <input name='description' className="form-control" autoComplete='off' placeholder={Resources['description'][currentLanguage]}
                                                        value={values.description} onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                    {errors.description ? (<em className="pError">{errors.description}</em>) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['no'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.itemCode ? 'has-error' : !errors.itemCode && touched.itemCode ? (" has-success") : " ")}>
                                                    <input readOnly className="form-control"
                                                        placeholder={Resources['no'][currentLanguage]}
                                                        value={this.state.ArrangeItem} onChange={handleChange} onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                    {errors.itemCode ? (<em className="pError">{errors.itemCode}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['resourceCode'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.resourceCode ? 'has-error' : !errors.resourceCode && touched.resourceCode ? (" has-success") : " ")}>
                                                    <input name='resourceCode' className="form-control" autoComplete='off' placeholder={Resources['resourceCode'][currentLanguage]}
                                                        value={values.resourceCode} onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }}
                                                    />
                                                    {errors.resourceCode ? (<em className="pError">{errors.resourceCode}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['quantity'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.quantity ? 'has-error' : !errors.quantity && touched.quantity ? (" has-success") : " ")}>
                                                    <input name='quantity' className="form-control" autoComplete='off' placeholder={Resources['quantity'][currentLanguage]}
                                                        value={values.quantity} onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                    {errors.quantity ? (<em className="pError">{errors.quantity}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['unit'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.unit ? 'has-error' : !errors.unit && touched.unit ? (" has-success") : " ")}>
                                                    <input name='unit' className="form-control" autoComplete='off' placeholder={Resources['unit'][currentLanguage]}
                                                        value={values.unit} onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                    {errors.unit ? (<em className="pError">{errors.unit}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['unitPrice'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.unitPrice ? 'has-error' : !errors.unitPrice && touched.unitPrice ? (" has-success") : " ")}>
                                                    <input name='unitPrice' className="form-control" autoComplete='off' placeholder={Resources['unitPrice'][currentLanguage]}
                                                        value={values.unitPrice} onChange={handleChange}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                    {errors.unitPrice ? (<em className="pError">{errors.unitPrice}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='dueBack' startDate={this.state.dueBack}
                                                    handleChange={e => this.handleChangeDate(e, 'dueBack')} />
                                            </div>

                                            <div className="linebylineInput valid-input ">
                                                <Dropdown title="itemType" data={this.state.itemTypes} selectedValue={this.state.selectedItemType}
                                                    onChange={setFieldValue} onBlur={setFieldTouched} error={errors.itemType}
                                                    touched={touched.itemType} name="itemType"
                                                    handleChange={event => this.handleChangeItemType(event)}
                                                />
                                            </div>

                                            {this.state.ShowDays ?
                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['days'][currentLanguage]} </label>
                                                    <div className={"inputDev ui input " + (errors.days ? 'has-error' : !errors.days && touched.days ? (" has-success") : " ")}>
                                                        <input name='days' className="form-control" autoComplete='off' placeholder={Resources['days'][currentLanguage]}
                                                            value={values.days} onChange={handleChange}
                                                            onBlur={(e) => {
                                                                handleBlur(e)
                                                                handleChange(e)
                                                            }}
                                                        />
                                                        {errors.days ? (<em className="pError">{errors.days}</em>) : null}
                                                    </div>
                                                </div> : null}

                                            {this.state.ShowEquipmentType ?
                                                <div className="linebylineInput valid-input ">
                                                    <Dropdown title="equipmentType" data={this.state.EquipmentTypeData} name="equipmentType"
                                                        selectedValue={this.state.selectedEquipmentType}
                                                        handleChange={e => this.setState({ selectedEquipmentType: e })} />
                                                </div> : null}

                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                {this.state.BtnLoading === false ?
                                                    <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                                    : <button className="primaryBtn-1 btn  disabled" disabled="disabled">
                                                        <div className="spinner">
                                                            <div className="bounce1" />
                                                            <div className="bounce2" />
                                                            <div className="bounce3" />
                                                        </div>
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>

                        <div className="doc-pre-cycle">
                            <header>
                                <h2 className="zero">{Resources['AddedItems'][currentLanguage]}</h2>
                            </header>
                            <div className="reactTableActions">
                                {selectedRows.length > 0 ? (
                                    <div className={"gridSystemSelected " + (selectedRows.length > 0 ? " active" : "")} >
                                        <div className="tableselcted-items">
                                            <span id="count-checked-checkboxes">
                                                {selectedRows.length}
                                            </span>
                                            <span>Selected</span>
                                        </div>
                                        <div className="tableSelctedBTNs">
                                            <button className="defaultBtn btn smallBtn" onClick={this.DeleteItems.bind(this)}>DELETE</button>
                                        </div>
                                    </div>
                                ) : null}
                                <ReactTable
                                    filterable
                                    ref={(r) => {
                                        this.selectTable = r;
                                    }}
                                    data={this.state.InvoicesItems}
                                    columns={columnsItem}
                                    defaultPageSize={10}
                                    minRows={2}
                                    noDataText={Resources['noData'][currentLanguage]}
                                />
                            </div>

                        </div>
                        <div className="doc-pre-cycle">
                            <div className="slider-Btns">
                                <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(2)}>NEXT STEP</button>
                            </div>
                        </div>
                    </div>

                </div>
            )
        }

        let EditItemView = () => {
            return (
                <div className="doc-pre-cycle">
                    <div className="subiTabsContent feilds__top">
                        <Formik
                            initialValues={{
                                ... this.state.ObjItem,
                            }}
                            validationSchema={documentItemValidationSchemaEdit}
                            enableReinitialize={true}
                            onSubmit={(values) => {
                                this.EditItemSave(values)
                            }}                >
                            {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <div className='document-fields'>

                                        <div className="letterFullWidth proForm  first-proform ">
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['description'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.details ? 'has-error' : !errors.details && touched.details ? (" has-success") : " ")}>
                                                    <input name='details' className="form-control" autoComplete='off' placeholder={Resources['details'][currentLanguage]}
                                                        value={this.state.ObjItem.details} onChange={e => this.handleChangeItems(e, 'details')} onBlur={handleBlur} />
                                                    {errors.details ? (<em className="pError">{errors.details}</em>) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['resourceCode'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.resourceCode ? 'has-error' : !errors.resourceCode && touched.resourceCode ? (" has-success") : " ")}>
                                                    <input name='resourceCode' className="form-control" autoComplete='off' placeholder={Resources['resourceCode'][currentLanguage]}
                                                        value={this.state.ObjItem.resourceCode} onChange={e => this.handleChangeItems(e, 'resourceCode')} onBlur={handleBlur} />
                                                    {errors.resourceCode ? (<em className="pError">{errors.resourceCode}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['quantity'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.quantity ? 'has-error' : !errors.quantity && touched.quantity ? (" has-success") : " ")}>
                                                    <input name='quantity' className="form-control" autoComplete='off' placeholder={Resources['quantity'][currentLanguage]}
                                                        value={this.state.ObjItem.quantity} onChange={e => this.handleChangeItems(e, 'quantity')} onBlur={handleBlur} />
                                                    {errors.quantity ? (<em className="pError">{errors.quantity}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['unit'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.unit ? 'has-error' : !errors.unit && touched.unit ? (" has-success") : " ")}>
                                                    <input name='unit' className="form-control" autoComplete='off' placeholder={Resources['unit'][currentLanguage]}
                                                        value={this.state.ObjItem.unit} onChange={e => this.handleChangeItems(e, 'unit')} onBlur={handleBlur} />
                                                    {errors.unit ? (<em className="pError">{errors.unit}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['unitPrice'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.unitPrice ? 'has-error' : !errors.unitPrice && touched.unitPrice ? (" has-success") : " ")}>
                                                    <input name='unitPrice' className="form-control" autoComplete='off' placeholder={Resources['unitPrice'][currentLanguage]}
                                                        value={this.state.ObjItem.unitPrice} onChange={e => this.handleChangeItems(e, 'unitPrice')} onBlur={handleBlur} />
                                                    {errors.unitPrice ? (<em className="pError">{errors.unitPrice}</em>) : null}
                                                </div>
                                            </div>


                                            <div className="slider-Btns fullWidthWrapper textLeft ">
                                                {this.state.BtnLoadingEdit === false ?
                                                    <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.props.isViewMode} >{Resources["save"][currentLanguage]}</button>
                                                    : <button className="primaryBtn-1 btn  disabled" disabled="disabled">
                                                        <div className="spinner">
                                                            <div className="bounce1" />
                                                            <div className="bounce2" />
                                                            <div className="bounce3" />
                                                        </div>
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )
        }

        return (
            <div className="mainContainer">

                {this.state.Loading ? <LoadingSection /> : null}

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={e => this.setState({ ShowTree: false })}
                        title={Resources['add'][currentLanguage]}
                        onCloseClicked={e => this.setState({ ShowTree: false })} isVisible={this.state.ShowTree}>
                        <Tree projectId={this.state.projectId} GetNodeData={this.GetNodeData} />
                        <div className="fullWidthWrapper">
                            <button className="primaryBtn-1 btn meduimBtn" onClick={e => this.setState({ ShowTree: false })}  >{Resources.add[currentLanguage]}</button>
                        </div>
                    </SkyLightStateless>
                </div>

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={e => this.setState({ showEdititem: false, ObjItem: false })}
                        title={Resources['editTitle'][currentLanguage]}
                        onCloseClicked={e => this.setState({ showEdititem: false, ObjItem: {} })} isVisible={this.state.showEdititem}>
                        {EditItemView()}
                    </SkyLightStateless>
                </div>

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={e => this.setState({ ShowDeductionPopup: false, IsDeductionEdit: false, ObjDeduction: {} })}
                        title={Resources['editTitle'][currentLanguage]}
                        onCloseClicked={e => this.setState({ ShowDeductionPopup: false, IsDeductionEdit: false, ObjDeduction: {} })} isVisible={this.state.ShowDeductionPopup}>
                        {EditDeductionPopup()}
                    </SkyLightStateless>
                </div>

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.invoicesForPO[currentLanguage]} moduleTitle={Resources['procurement'][currentLanguage]} />
                    <div className="doc-container">

                        <div className="step-content">

                            {this.props.changeStatus == true ?
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero"> {Resources.goEdit[currentLanguage]} </h2>
                                        <p className="doc-infohead"><span> {this.state.document.refDoc}</span> - <span> {this.state.document.arrange}</span> - <span>{moment(this.state.document.docDate).format('DD/MM/YYYY')}</span></p>
                                    </div>
                                </header> : null}

                            {this.state.CurrStep == 0 ? StepOne() : this.state.CurrStep == 1 ? StepTwo() : StepThree()}

                        </div>

                        <Fragment>
                            <Steps
                                steps_defination={steps_defination}
                                exist_link="/invoicesForPo/"
                                docId={this.state.docId}
                                changeCurrentStep={stepNo =>
                                    this.changeCurrentStep(stepNo)
                                }
                                stepNo={this.state.CurrStep}
                            />
                        </Fragment>

                    </div>
                </div>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={e => this.setState({ showDeleteModal: false })}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={e => this.setState({ showDeleteModal: false })}
                        buttonName='delete' clickHandlerContinue={this.ConfirmationDeleteDeduction} />
                ) : null}

                {this.state.showDeleteModalItem == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={e => this.setState({ showDeleteModalItem: false })}
                        showDeleteModal={this.state.showDeleteModalItem}
                        clickHandlerCancel={e => this.setState({ showDeleteModalItem: false })}
                        buttonName='delete' clickHandlerContinue={this.ConfirmationDeleteItem} />
                ) : null}

            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        changeStatus: state.communication.changeStatus,
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
)(withRouter(invoicesForPoAddEdit))
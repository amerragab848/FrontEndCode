import React, { Component, Fragment } from "react";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
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
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Api from "../../api";
import ReactTable from "react-table";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import { SkyLightStateless } from 'react-skylight';
import Steps from "../../Componants/publicComponants/Steps";
import Tree from '../../Componants/OptionsPanels/Tree'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
let perviousRoute = '';
const find = require('lodash/find')

let selectedRows = [];
var steps_defination = [];
steps_defination = [
    { name: "materialRelease", callBackFn: null },
    { name: "items", callBackFn: null }
];


const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    orderFromCompanyId: Yup.string().required(Resources['fromCompany'][currentLanguage]),
    specsSectionId: Yup.string().required(Resources['specsSectionSelection'][currentLanguage]),
    orderFromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    materialReleaseId: Yup.string().required(Resources['materialReleaseTypeSelection'][currentLanguage]),
})

const documentItemValidationSchema = Yup.object().shape({

    itemId: Yup.string().required(Resources['itemDescription'][currentLanguage]),

    returnedQuantity: Yup.number().required(Resources['returnedQuantity'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),

    arrangeItem: Yup.number().required(Resources['resourceCodeRequired'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),

    unitPrice: Yup.number().required(Resources['unitPrice'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),

})

const documentItemValidationSchemaForEdit = Yup.object().shape({

    returnedQuantity: Yup.number().required(Resources['returnedQuantity'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),

    arrangeItem: Yup.number().required(Resources['resourceCodeRequired'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),

    unitPrice: Yup.number().required(Resources['unitPrice'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),

})

let ApproveOrRejectData = [
    { label: Resources.approved[currentLanguage], value: 'true' },
    { label: Resources.rejected[currentLanguage], value: 'false' }
]

class materialReleaseAddEdit extends Component {

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
                } catch { this.props.history.goBack(); }
            }
            index++;
        }
        this.state = {
            selectedRows: [],
            CurrentStep: 0,
            showDeleteModal: false,
            isLoading: false,
            isEdit: false,
            perviousRoute: perviousRoute,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 51,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            selected: {},
            descriptionDropData: [],
            Items: [],
            permission: [
                { name: "sendByEmail", code: 253 },
                { name: "sendByInbox", code: 252 },
                { name: "sendTask", code: 0 },
                { name: "distributionList", code: 987 },
                { name: "createTransmittal", code: 3073 },
                { name: "sendToWorkFlow", code: 735 },
                { name: "viewAttachments", code: 3284 },
                { name: "deleteAttachments", code: 890 }
            ],
            selectedFromCompany: { label: Resources.fromCompany[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedSpecsSection: { label: Resources.specsSectionSelection[currentLanguage], value: "0" },
            selectedMaterialRelease: { 
                label: Resources.materialReleaseTypeSelection[currentLanguage], 
                value: "0" ,
                contractId:"0",
                contractName:""
            },
            selectedCostCoding: { label: Resources.costCodingSelection[currentLanguage], value: "0" },
            SpecsSectionData: [],
            FromCompaniesData: [],
            FromContactsData: [],
            MaterialReleaseData: [],
            CostCodingData: [],
            ShowTree: false,
            SelectedAreaForEdit: { label: Resources.selectArea[currentLanguage], value: "0" },
            SelectedLocationForEdit: { label: Resources.locationRequired[currentLanguage], value: "0" },
            SelectedBoqItem: { label: Resources.boqItemSelection[currentLanguage], value: "0" },
            SelectedArea: { label: Resources.selectArea[currentLanguage], value: "0" },
            SelectedLocation: { label: Resources.locationRequired[currentLanguage], value: "0" },
            BoqItemData: [],
            AreaData: [],
            LocationData: [],
            quantity: 0,
            unitPrice: 0,
            costCodeTreeId: 0,
            costCodingTreeName: '',
            selectedItemId: { label: Resources.itemDescription[currentLanguage], value: "0" },
            remarks: '',
            arrangeItem: 1,
            ItemDescriptionInfo: {},
            BtnLoading: false,
            ShowPopup: false,
            contractName:'',
            objItemForEdit: {},
            quantityEdit: 0,
            IsAddMood: false,
            MaterialReleaseType: [],
            SelectedMaterialReleaseType: { label: Resources.itemDescription[currentLanguage], value: "0" },
        }

        if (!Config.IsAllow(247) && !Config.IsAllow(248) && !Config.IsAllow(250)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }
    }

    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) { links[i].classList.add("even") }
            else { links[i].classList.add("odd") }
        }
        this.checkDocumentIsView()

        if (this.state.docId !== 0) {
            dataservice.GetNextArrangeMainDocument('GetNextArrangeItems?docId=' + this.state.docId + '&docType=' + this.state.docTypeId).then(
                result => {
                    this.setState({ arrangeItem: result })
                }
            )
        }

    }

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.document.id) {
            let doc = nextProps.document
            doc.docDate = doc.docDate === null ? moment().format('YYYY-MM-DD') : moment(doc.docDate).format('YYYY-MM-DD')
            this.setState({ isEdit: true, document: doc, hasWorkflow: this.props.hasWorkflow })
            let isEdit = nextProps.document.id > 0 ? true : false
            this.fillDropDowns(isEdit);
            this.checkDocumentIsView();
            dataservice.GetDataGrid('GetItemBySiteRequestId?requestId=' + doc.siteRequestId).then(
                res => {
                    let Data = res
                    let ListData = []
                    Data.map(i => {
                        let obj = {}
                        obj.value = i.id
                        obj.label = i.description
                        ListData.push(obj)
                    })
                    this.setState({ descriptionDropData: ListData, descriptionList: res })
                }
            )
            dataservice.GetDataGrid('GetLogsMaterialReleaseTickets?releaseId=' + doc.id).then(
                res => {
                    this.setState({ Items: res })
                    this.props.actions.ExportingData({ items: res });
                }
            )
        }

    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }

    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetLogsMaterialReleasesForEdit?id=" + this.state.docId;
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'materialRelease')
        }
        else {
            dataservice.GetNextArrangeMainDocument('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=' + this.state.docTypeId + '&companyId=undefined&contactId=undefined').then(
                res => {
                    const Document = {
                        projectId: projectId, arrange: res, status: "true", specsSectionId: "", subject: "",
                        docDate: moment(), boqId: '', orderFromContactId: '',
                        orderFromCompanyId: '', docCloseDate: moment(), materialReleaseId: '', strictNumber: 0, siteRequestId: ''
                    }
                    this.setState({ document: Document })
                }
            )
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    }

    fillSubDropDown = (value, isEdit) => {
        let action = 'GetContactsByCompanyId?companyId=' + value
        
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
            if (isEdit) {
                let toSubField = this.state.document.orderFromContactId;
                let targetFieldSelected = find(result, function (i) { return i.value == toSubField; });
                this.setState({
                    selectedFromContact: targetFieldSelected,
                })
            }
            this.setState({ FromContactsData: result });
        });
    }

    fillDropDowns(isEdit) {

        dataservice.GetDataListCached('GetProjectProjectsCompaniesForList?projectId= ' + this.state.projectId, 'companyName', 'companyId', 'companies', this.state.projectId, "projectId").then(result => {
            if (isEdit) {
                let id = this.props.document.orderFromCompanyId;
                let selectedValue = {};
                if (id) {
                    selectedValue = find(result, function (i) { return i.value === id });
                    this.setState({ selectedFromCompany: selectedValue })
                    this.fillSubDropDown(id, isEdit)
                }
            }
            this.setState({ FromCompaniesData: [...result] })
        })

        dataservice.GetDataListCached('GetAccountsDefaultListForList?listType=specsSection', 'title', 'id', 'defaultLists', "specssection", "listType").then(result => {
            if (isEdit) {
                let id = this.props.document.specsSectionId;
                let selectedValue = {};
                if (id) {
                    selectedValue = find(result, function (i) { return i.value == id });
                    this.setState({ selectedSpecsSection: selectedValue })
                }
            }
            this.setState({ SpecsSectionData: [...result] })
        })
 
        dataservice.GetDataListSiteRequestNewVersion("GetSiteRequestForListByProjectId?projectId=" + this.state.projectId, 'subject', 'id','contractId','contractName').then(result => {
            if (isEdit) {
                let id = this.props.document.siteRequestId;
                let selectedValue = {};
                if (id) {
                    selectedValue = find(result, function (i)
                     { 
                           if( i.value == id )
                             return i

                        });
                    this.setState({ selectedMaterialRelease: selectedValue })
                }
            }
            this.setState({ MaterialReleaseData: [...result] })
        }) 

        dataservice.GetDataListWithNewVersion('GetContractsBoq?projectId=2&pageNumber=0&pageSize=1000000000', 'subject', 'id').then(result => {
            if (isEdit) {
                let id = this.props.document.boqId;
                let selectedValue = {};
                if (id) {
                    selectedValue = find(result, function (i) { return i.value == id });
                    this.setState({ selectedCostCoding: selectedValue })
                }
            }
            this.setState({ CostCodingData: [...result] })
        })

        dataservice.GetDataListCached('GetAccountsDefaultListForList?listType=area', 'title', 'id', 'defaultLists', "area", "listType").then(result => {
            this.setState({ AreaData: result })
        })

        dataservice.GetDataListCached('GetAccountsDefaultListForList?listType=location', 'title', 'id', 'defaultLists', "location", "listType").then(result => {
            this.setState({ LocationData: result })
        })

        dataservice.GetDataListCached('GetAccountsDefaultListForList?listType=materialtitle', 'title', 'id', 'defaultLists', "materialtitle", "listType").then(result => {
            if (isEdit) {
                let id = this.props.document.materialReleaseId;
                let selectedValue = {};
                if (id) {
                    selectedValue = find(result, function (i) { return i.value == id });
                    this.setState({ SelectedMaterialReleaseType: selectedValue })
                }
            }
            this.setState({ MaterialReleaseType: [...result] })
        })

    }

    handleChangeDropDown(event, field, isSubscrib, selectedValue) {
        if (event == null) return
        let original_document = { ...this.state.document }
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document, [selectedValue]: event })
        if (isSubscrib) {
            this.fillSubDropDown(event.value, false)
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(248)) {
                this.setState({ isViewMode: true })
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (this.state.isApproveMode != true && Config.IsAllow(248)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(248)) {
                        if (this.props.document.status !== false && Config.IsAllow(248)) {
                            this.setState({ isViewMode: false })
                        }
                        else { this.setState({ isViewMode: true }) }
                    }
                    else { this.setState({ isViewMode: true }) }
                }
            }
        }
        else { this.setState({ isViewMode: false }) }
    }

    handleChange(e, field) {
        let original_document = { ...this.state.document };
        let updated_document = {}
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document })
    }

    saveAndExit(event) {
        if (this.state.CurrentStep === 1) { this.setState({ CurrentStep: this.state.CurrentStep + 1 }) }
        else { this.props.history.push("/materialRelease/" + this.state.projectId) }
    }

    showBtnsSaving() {
        let btn = null;
        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = <button type="submit" className={"primaryBtn-1 btn meduimBtn " + (this.state.isViewMode === true ? " disNone" : " ")} >{Resources.next[currentLanguage]}</button>
        }
        return btn;
    }

    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(3284) === true ?
                (<ViewAttachment isApproveMode={this.state.isApproveMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={854} />) : null) : null;
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({ docId: 0 })
    }

    handleChangeDate(e, field) {
        let original_document = { ...this.state.document }
        let updated_document = {};
        updated_document[field] = e;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document })
    }

    SaveDoc = (Mood) => {
        this.setState({ isLoading: true, IsAddMood: false })
        if (Mood === 'EditMood') {
            let doc = { ...this.state.document };
            doc.docDate = moment(doc.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            doc.contractId=this.state.selectedMaterialRelease.contractId;
            dataservice.addObject('EditLogsMaterialRelease', doc).then(result => {
                this.setState({ isLoading: false, IsAddMood: true })
                toast.success(Resources["operationSuccess"][currentLanguage])
            }).catch(ex => {
                this.setState({ Loading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
        } else {
            let doc = { ...this.state.document };
            doc.docDate = moment(doc.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            doc.contractId=this.state.selectedMaterialRelease.contractId;
            dataservice.addObject('AddLogsMaterialRelease', doc).then(result => {
                this.setState({ isLoading: false, docId: result.id, IsAddMood: true })
                toast.success(Resources["operationSuccess"][currentLanguage])
            }).catch(ex => {
                this.setState({ Loading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
        }
        this.AfterSaveDoc()
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

    ConfirmationDeleteItem = () => {
        this.setState({ isLoading: true })
        let ids = []
        selectedRows.map(s => {
            ids.push(s.id)
        })
        Api.post('DeleteMultipleLogsMaterialReleaseTicketsById', ids).then(
            res => {
                let originalRows = this.state.Items

                ids.map(i => {
                    originalRows = originalRows.filter(r => r.id !== i);
                })
                selectedRows = []
                let data = { items: originalRows };
                this.props.actions.ExportingData(data);
                this.setState({
                    Items: originalRows,
                    showDeleteModal: false,
                    isLoading: false,
                })
            },
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
        ).catch(ex => {
            this.setState({
                showDeleteModal: false,
                isLoading: false,
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
    }

    SaveItem = (values) => {
        let Qty = parseInt(this.state.quantity)
        let ActaulQty = parseInt(this.state.ItemDescriptionInfo.originalQuantity)
        if (Qty <= ActaulQty) {
            this.setState({ isLoading: true })
            let obj = {
                materialReleaseId: this.state.docId,
                itemId: this.state.ItemDescriptionInfo.itemId,
                id: this.state.ItemDescriptionInfo.id,
                areaId: this.state.SelectedArea.value === '0' ? undefined : this.state.SelectedArea.value,
                locationId: this.state.SelectedLocation.value === '0' ? undefined : this.state.SelectedLocation.value,
                boqItemId: this.state.ItemDescriptionInfo.boqItemId,
                arrange: this.state.arrangeItem,
                quantity: this.state.quantity,
                requestedQuantity: this.state.ItemDescriptionInfo.originalQuantity,
                unitPrice: this.state.unitPrice,
                description: this.state.ItemDescriptionInfo.description,
                remarks: this.state.remarks,
                costCodeTreeId: this.state.costCodeTreeId === 0 ? undefined : this.state.costCodeTreeId,
                resourceCode: this.state.ItemDescriptionInfo.resourceCode,
            }

            dataservice.addObject('AddLogsMaterialReleaseTickets', obj).then(result => {
                let Items = this.state.Items
                Items.push(result)
                let ItemDescriptionInfo = this.state.ItemDescriptionInfo
                ItemDescriptionInfo.resourceCode = ''
                this.setState({
                    Items,
                    isLoading: false,
                    unitPrice: 0,
                    selectedItemId: { label: Resources.itemDescription[currentLanguage], value: "0" },
                    quantity: 0, remarks: '', ItemDescriptionInfo,
                    SelectedBoqItem: { label: Resources.boqItemSelection[currentLanguage], value: "0" },
                    SelectedArea: { label: Resources.selectArea[currentLanguage], value: "0" },
                    SelectedLocation: { label: Resources.locationRequired[currentLanguage], value: "0" },
                    costCodingTreeName: '', costCodeTreeId: 0
                })
                dataservice.GetNextArrangeMainDocument('GetNextArrangeItems?docId=' + this.state.docId + '&docType=' + this.state.docTypeId).then(
                    result => {
                        this.setState({ arrangeItem: result })
                    }
                )
                toast.success(Resources["operationSuccess"][currentLanguage])

            }).catch(ex => {
                this.setState({ Loading: false })
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            })
        }
        else {
            toast.error(' ' + ActaulQty + ' Is Max Quantit')
        }
    }

    handleChangeItemId = (e) => {
        let data = []
        data = this.state.descriptionList.filter(i => i.id === e.value)
        let obj = data[0]
        console.log(obj)
        this.setState({
            selectedItemId: e,
            unitPrice: obj.unitPrice,
            ItemDescriptionInfo: obj,
            quantity: obj.quantity

        })
    }

    ShowCostTree = () => {
        this.setState({ ShowTree: true })
    }

    GetNodeData = (item) => {

        if (this.state.ShowPopup) {
            let updated_document = { ...this.state.objItemForEdit }
            updated_document.costCodeTreeId = item.costCodingTreeId;
            updated_document.costCodeTreeName = item.costCodingTreeName;
            this.setState({ objItemForEdit: updated_document })
        }
        else {
            this.setState({
                costCodeTreeId: item.costCodingTreeId,
                costCodingTreeName: item.costCodingTreeName
            })
        }
    }

    AfterSaveDoc = () => {

        dataservice.GetDataGrid('GetItemBySiteRequestId?requestId=' + this.state.document.siteRequestId).then(
            res => {
                let Data = res
                let ListData = []
                Data.map(i => {
                    let obj = {}
                    obj.value = i.id
                    obj.label = i.description
                    ListData.push(obj)
                })
                this.setState({ descriptionDropData: ListData, descriptionList: res })
            }
        )

        dataservice.GetNextArrangeMainDocument('GetNextArrangeItems?docId=' + this.state.docId + '&docType=' + this.state.docTypeId).then(
            result => {
                this.setState({ arrangeItem: result })
            }
        )
    }

    viewModelToEdit(id, type) {

        if (this.state.isViewMode === false) {

            if (type != "checkbox") {
                if (id) {
                    dataservice.GetDataGrid("GetLogsMaterialReleaseTicketsForEdit?id=" + id).then(
                        result => {
                            let SelectedAreaForEdit = find(this.state.AreaData, function (i) { return i.value == result.areaId });
                            let SelectedLocationForEdit = find(this.state.LocationData, function (i) { return i.value == result.locationId });
                            this.setState({
                                objItemForEdit: result, ShowPopup: true,
                                SelectedAreaForEdit,
                                SelectedLocationForEdit,
                                quantityEdit: result.quantity
                            })
                        }
                    )
                }
            }
        }
    }

    HandleChangeItemsForEdit = (Name, Value) => {
        let updated_document = { ...this.state.objItemForEdit }
        updated_document[Name] = Value.target.value;
        this.setState({ objItemForEdit: updated_document })
    }

    SaveEditItem = () => {
        this.setState({ isLoading: true })
        let obj = {
            id: this.state.objItemForEdit.id,
            materialReleaseId: this.state.document.id,
            itemId: this.state.objItemForEdit.itemId,
            areaId: this.state.SelectedAreaForEdit.value === '0' ? undefined : this.state.SelectedAreaForEdit.value,
            locationId: this.state.SelectedLocationForEdit.value === '0' ? undefined : this.state.SelectedLocationForEdit.value,
            arrange: this.state.objItemForEdit.arrange,
            quantity: this.state.objItemForEdit.quantity,
            unitPrice: this.state.objItemForEdit.unitPrice,
            description: this.state.objItemForEdit.description,
            remarks: this.state.objItemForEdit.remarks,
            costCodeTreeId: this.state.objItemForEdit.costCodeTreeId,
            resourceCode: this.state.objItemForEdit.resourceCode,
            requestedQuantity: this.state.objItemForEdit.requestedQuantity,
            total: parseInt(this.state.objItemForEdit.quantity) * parseInt(this.state.objItemForEdit.unitPrice)
        }
        dataservice.addObject('EditLogsMaterialReleaseTickets', obj).then(result => {
            let Items = this.state.Items.filter(s => s.id !== this.state.objItemForEdit.id)
            console.log(Items)
            Items.push(this.state.objItemForEdit)
            this.setState({
                isLoading: false, Items, ShowPopup: false
            })
            toast.success(Resources["operationSuccess"][currentLanguage])

        }).catch(ex => {
            this.setState({ Loading: false })
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        })

    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrentStep: stepNo });
    };

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    render() {

        let StepOne = () => {
            return (
                <div className="document-fields">
                    <Formik initialValues={this.state.document}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={values => {
                            if (this.props.showModal) { return; }

                            if (this.state.IsAddMood) {
                                this.changeCurrentStep(1);
                            }
                            else {
                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                    this.SaveDoc('EditMood');
                                    this.changeCurrentStep(1);
                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                    this.SaveDoc('AddMood');
                                }
                            }
                        }}>
                        {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="QsForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
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
                                                }} /> {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
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
                                        <Dropdown title="specsSection" data={this.state.SpecsSectionData} selectedValue={this.state.selectedSpecsSection}
                                            handleChange={event => this.handleChangeDropDown(event, "specsSectionId", false, "selectedSpecsSection")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.specsSectionId}
                                            touched={touched.specsSectionId} name="specsSectionId" id="specsSectionId" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="fromCompany" data={this.state.FromCompaniesData} selectedValue={this.state.selectedFromCompany}
                                            handleChange={event => this.handleChangeDropDown(event, "orderFromCompanyId", true, "selectedFromCompany")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.orderFromCompanyId}
                                            touched={touched.orderFromCompanyId} name="orderFromCompanyId" id="orderFromCompanyId" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="orderFromContact" data={this.state.FromContactsData} selectedValue={this.state.selectedFromContact}
                                            handleChange={event => this.handleChangeDropDown(event, "orderFromContactId", false, "selectedFromContact")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.orderFromContactId}
                                            touched={touched.orderFromContactId} name="orderFromContactId" id="orderFromContactId" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="siteRequest" data={this.state.MaterialReleaseData} selectedValue={this.state.selectedMaterialRelease}
                                            handleChange={event => this.handleChangeDropDown(event, "siteRequestId", false, "selectedMaterialRelease")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.materialReleaseId}
                                            touched={touched.materialReleaseId} name="materialReleaseId" id="materialReleaseId" />
                                    </div>
                                    {/* added */}
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.contract[currentLanguage]}</label> 
                                        <div className={"inputDev ui input" } width="100%" >
                                            <input name='contract' className="form-control fsadfsadsa" id="contract" value={this.props.changeStatus == true ?this.props.document.contractName:this.state.selectedMaterialRelease.contractName}
                                                autoComplete='off' readOnly="true" /> 
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="materialReleaseType" data={this.state.MaterialReleaseType} selectedValue={this.state.SelectedMaterialReleaseType}
                                            handleChange={event => this.handleChangeDropDown(event, 'materialReleaseId', false, 'SelectedMaterialReleaseType')} />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="boqLog" data={this.state.CostCodingData} selectedValue={this.state.selectedCostCoding}
                                            handleChange={event => this.handleChangeDropDown(event, 'boqId', false, 'selectedCostCoding')} />
                                    </div>

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
                                                currentArrange={this.state.arrange}
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
                                            <UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={889} EditAttachments={3243} ShowDropBox={3541}
                                                ShowGoogleDrive={3542} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
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
                    Header: Resources['arrange'][currentLanguage],
                    accessor: 'arrange',
                    width: 50,
                }, {
                    Header: Resources['description'][currentLanguage],
                    accessor: 'description',
                    width: 250,
                },
                {
                    Header: Resources['quantity'][currentLanguage],
                    accessor: 'quantity',
                    width: 100,
                },
                {
                    Header: Resources['unitPrice'][currentLanguage],
                    accessor: 'unitPrice',
                    width: 100,
                },
                {
                    Header: Resources['resourceCode'][currentLanguage],
                    accessor: 'resourceCode',
                    width: 180,
                }, {
                    Header: Resources['area'][currentLanguage],
                    accessor: 'areaName',
                    width: 150,
                },
                {
                    Header: Resources['location'][currentLanguage],
                    accessor: 'locationName',
                    width: 150,
                }, {
                    Header: Resources['remarks'][currentLanguage],
                    accessor: 'remarks',
                    width: 150,
                }
            ]

            return (
                <div className="step-content">

                    <div className={"subiTabsContent feilds__top " + (this.props.isViewMode ? "readOnly_inputs" : " ")}>
                        <Formik
                            initialValues={{
                                itemId: this.state.selectedItemId.value !== '0' ? this.state.selectedItemId : '',
                                unitPrice: this.state.ItemDescriptionInfo.unitPrice,
                                returnedQuantity: this.state.quantity,
                                arrangeItem: this.state.arrangeItem,
                            }}
                            validationSchema={documentItemValidationSchema}
                            enableReinitialize={true}
                            onSubmit={() => {
                                this.SaveItem()
                            }}                >
                            {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                    <header className="main__header">
                                        <div className="main__header--div">
                                            <h2 className="zero">{Resources['addItems'][currentLanguage]}</h2>
                                        </div>
                                    </header>
                                    <div className='document-fields'>

                                        <div className="proForm datepickerContainer">

                                            <div className="linebylineInput valid-input letterFullWidth ">
                                                <Dropdown title="itemDescription" data={this.state.descriptionDropData} selectedValue={this.state.selectedItemId}
                                                    handleChange={event => this.handleChangeItemId(event)} onBlur={setFieldTouched} error={errors.itemId}
                                                    onChange={setFieldValue} touched={touched.itemId} name="itemId" id="itemId" />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['no'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.arrangeItem ? 'has-error' : !errors.arrangeItem && touched.arrangeItem ? (" has-success") : " ")}>
                                                    <input className="form-control" name='arrangeItem'
                                                        placeholder={Resources['no'][currentLanguage]}
                                                        value={this.state.arrangeItem} onChange={e => this.setState({ arrangeItem: e.target.value })}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                    {errors.arrangeItem ? (<em className="pError">{errors.arrangeItem}</em>) : null}
                                                </div>
                                            </div>


                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['resourceCode'][currentLanguage]}  </label>
                                                <div className="inputDev ui input has-success">
                                                    <input className="form-control" placeholder={Resources['resourceCode'][currentLanguage]}
                                                        readOnly value={this.state.ItemDescriptionInfo.resourceCode} />
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['releasedQuantity'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.returnedQuantity ? 'has-error' : !errors.returnedQuantity && touched.returnedQuantity ? (" has-success") : " ")}>
                                                    <input name='returnedQuantity' className="form-control" autoComplete='off' placeholder={Resources['releasedQuantity'][currentLanguage]}
                                                        value={this.state.quantity} onChange={e => this.setState({ quantity: e.target.value })}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                    {errors.returnedQuantity ? (<em className="pError">{errors.returnedQuantity}</em>) : null}
                                                </div>
                                            </div>


                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.costCoding[currentLanguage]}</label>
                                                <div className="shareLinks">
                                                    <div className="inputDev ui input">
                                                        <input type="text" className="form-control" name="costCodingTreeName"
                                                            onChange={(e) => this.handleChange(e, 'costCodingTreeName')}
                                                            value={this.state.costCodingTreeName}
                                                            placeholder={Resources.costCoding[currentLanguage]} />
                                                    </div>
                                                    <div style={{ marginLeft: '8px' }} onClick={e => this.ShowCostTree()}>
                                                        <span className="collapseIcon"><span className="plusSpan greenSpan">+</span>
                                                            <span>{Resources.add[currentLanguage]}</span>  </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources.remarks[currentLanguage]}</label>
                                                <div className="ui input inputDev"  >
                                                    <input type="text" className="form-control" placeholder={Resources.remarks[currentLanguage]}
                                                        value={this.state.remarks} onChange={(e) => this.setState({ remarks: e.target.value })} />
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['unitPrice'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.unitPrice ? 'has-error' : !errors.unitPrice && touched.unitPrice ? (" has-success") : " ")}>
                                                    <input name='unitPrice' className="form-control" autoComplete='off' placeholder={Resources['unitPrice'][currentLanguage]}
                                                        value={this.state.ItemDescriptionInfo.unitPrice} onChange={e => this.setState({ unitPrice: e.target.value })}
                                                        onBlur={(e) => {
                                                            handleBlur(e)
                                                            handleChange(e)
                                                        }} />
                                                    {errors.unitPrice ? (<em className="pError">{errors.unitPrice}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input ">
                                                <Dropdown data={this.state.AreaData} selectedValue={this.state.SelectedArea}
                                                    title="area" handleChange={e => this.setState({ SelectedArea: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input ">
                                                <Dropdown data={this.state.LocationData} selectedValue={this.state.SelectedLocation}
                                                    title="location" handleChange={e => this.setState({ SelectedLocation: e })} />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['requestedQuantity'][currentLanguage]}  </label>
                                                <div className="inputDev ui input has-success">
                                                    <input className="form-control" placeholder={Resources['requestedQuantity'][currentLanguage]}
                                                        readOnly value={this.state.ItemDescriptionInfo.requestedQuantity} />
                                                </div>
                                            </div>

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
                                            <button className="defaultBtn btn smallBtn" onClick={e => this.setState({ showDeleteModal: true })}>DELETE</button>
                                        </div>
                                    </div>
                                ) : null}
                                <ReactTable
                                    filterable
                                    ref={(r) => {
                                        this.selectTable = r;
                                    }}
                                    data={this.state.Items}
                                    columns={columnsItem}
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                    getTrProps={(state, rowInfo, column, instance) => {
                                        return { onClick: e => { this.viewModelToEdit(rowInfo.original.id, e.target.type); } };
                                    }}
                                    minRows={2}
                                    noDataText={Resources['noData'][currentLanguage]}
                                />
                            </div>

                        </div>
                        <div className="doc-pre-cycle">
                            <div className="slider-Btns">
                                <button className="primaryBtn-1 btn meduimBtn" onClick={() => { this.props.history.push("/materialRelease/2") }}>Finish</button>
                            </div>
                        </div>
                    </div>

                </div>
            )
        }

        let EditItem = () => {
            return (
                <div className="doc-pre-cycle">
                    <Formik
                        initialValues={{
                            unitPrice: this.state.objItemForEdit.unitPrice,
                            returnedQuantity: this.state.objItemForEdit.quantity,
                            arrangeItem: this.state.objItemForEdit.arrange,
                        }}
                        validationSchema={documentItemValidationSchemaForEdit}
                        enableReinitialize={true}
                        onSubmit={() => {
                            this.SaveEditItem()
                        }}                >
                        {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                            <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >

                                <div className='document-fields'>

                                    <div className="proForm datepickerContainer">

                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <label className="control-label">{Resources.description[currentLanguage]}</label>
                                            <div className="ui input inputDev"  >
                                                <input type="text" className="form-control" placeholder={Resources.description[currentLanguage]}
                                                    value={this.state.objItemForEdit.description} onChange={e => this.HandleChangeItemsForEdit('description', e)} />
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['no'][currentLanguage]} </label>
                                            <div className={"inputDev ui input " + (errors.arrangeItem ? 'has-error' : !errors.arrangeItem && touched.arrangeItem ? (" has-success") : " ")}>
                                                <input className="form-control" name='arrangeItem'
                                                    placeholder={Resources['no'][currentLanguage]}
                                                    value={this.state.objItemForEdit.arrange} onChange={e => this.HandleChangeItemsForEdit('arrange', e)}
                                                    onBlur={(e) => {
                                                        handleBlur(e)
                                                        handleChange(e)
                                                    }} />
                                                {errors.arrangeItem ? (<em className="pError">{errors.arrangeItem}</em>) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['resourceCode'][currentLanguage]}  </label>
                                            <div className="inputDev ui input has-success">
                                                <input className="form-control" readOnly placeholder={Resources['resourceCode'][currentLanguage]}
                                                    value={this.state.objItemForEdit.resourceCode} />
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['releasedQuantity'][currentLanguage]} </label>
                                            <div className={"inputDev ui input " + (errors.returnedQuantity ? 'has-error' : !errors.returnedQuantity && touched.returnedQuantity ? (" has-success") : " ")}>
                                                <input name='returnedQuantity' className="form-control" autoComplete='off' placeholder={Resources['releasedQuantity'][currentLanguage]}
                                                    value={this.state.objItemForEdit.quantity} onChange={e => this.HandleChangeItemsForEdit('quantity', e)}
                                                    onBlur={(e) => {
                                                        handleBlur(e)
                                                        handleChange(e)
                                                    }} />
                                                {errors.returnedQuantity ? (<em className="pError">{errors.returnedQuantity}</em>) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources.costCoding[currentLanguage]}</label>
                                            <div className="shareLinks">
                                                <div className="inputDev ui input">
                                                    <input type="text" className="form-control" name="costCodingTreeName"
                                                        onChange={e => this.HandleChangeItemsForEdit('costCodingTreeName', e)}
                                                        value={this.state.objItemForEdit.costCodeTreeName}
                                                        placeholder={Resources.costCoding[currentLanguage]} />
                                                </div>
                                                <div style={{ marginLeft: '8px' }} onClick={e => this.ShowCostTree()}>
                                                    <span className="collapseIcon"><span className="plusSpan greenSpan">+</span>
                                                        <span>{Resources.add[currentLanguage]}</span>  </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <label className="control-label">{Resources.remarks[currentLanguage]}</label>
                                            <div className="ui input inputDev"  >
                                                <input type="text" className="form-control" placeholder={Resources.remarks[currentLanguage]}
                                                    value={this.state.objItemForEdit.remarks} onChange={e => this.HandleChangeItemsForEdit('remarks', e)} />
                                            </div>
                                        </div>

                                        {/* <div className="linebylineInput valid-input ">
                                            <Dropdown data={this.state.BoqItemData} selectedValue={this.state.SelectedBoqItemForEdit}
                                                title="boqItem" handleChange={e => this.setState({ SelectedBoqItemForEdit: e })} />
                                        </div> */}

                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <label className="control-label">{Resources['unitPrice'][currentLanguage]} </label>
                                            <div className={"inputDev ui input " + (errors.unitPrice ? 'has-error' : !errors.unitPrice && touched.unitPrice ? (" has-success") : " ")}>
                                                <input  type="text"  name='unitPrice' className="form-control" autoComplete='off' placeholder={Resources['unitPrice'][currentLanguage]}
                                                    value={this.state.objItemForEdit.unitPrice} onChange={e => this.HandleChangeItemsForEdit('unitPrice', e)}
                                                    onBlur={(e) => {
                                                        handleBlur(e)
                                                        handleChange(e)
                                                    }} />
                                                {errors.unitPrice ? (<em className="pError">{errors.unitPrice}</em>) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input ">
                                            <Dropdown data={this.state.AreaData} selectedValue={this.state.SelectedAreaForEdit}
                                                title="area" handleChange={e => this.setState({ SelectedAreaForEdit: e })} />
                                        </div>

                                        <div className="linebylineInput valid-input ">
                                            <Dropdown data={this.state.LocationData} selectedValue={this.state.SelectedLocationForEdit}
                                                title="location" handleChange={e => this.setState({ SelectedLocationForEdit: e })} />
                                        </div>

                                        <div className="slider-Btns fullWidthWrapper">
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

                </div>
            )
        }

        return (
            <div className="mainContainer">

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={e => this.setState({ ShowPopup: false })}
                        title={Resources['editTitle'][currentLanguage]}
                        onCloseClicked={e => this.setState({ ShowPopup: false })} isVisible={this.state.ShowPopup}>
                        {EditItem()}
                    </SkyLightStateless>
                </div>

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={e => this.setState({ ShowTree: false })}
                        title={Resources['add'][currentLanguage]}
                        onCloseClicked={e => this.setState({ ShowTree: false })} isVisible={this.state.ShowTree}>
                        <Tree projectId={this.state.projectId} GetNodeData={e => this.GetNodeData(e)} />
                        <div className="fullWidthWrapper">
                            <button className="primaryBtn-1 btn meduimBtn" onClick={e => this.setState({ ShowTree: false })}  >{Resources.add[currentLanguage]}</button>
                        </div>
                    </SkyLightStateless>
                </div>

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} docTitle={Resources.materialRelease[currentLanguage]} perviousRoute={this.state.perviousRoute} moduleTitle={Resources['procurement'][currentLanguage]} />
                    <div className="doc-container">

                        <div className="step-content"> 
                            {this.state.isLoading ? <LoadingSection /> : null}
                            {this.state.CurrentStep === 0 ?
                                <Fragment>
                                    {StepOne()}

                                </Fragment> : StepTwo()}

                        </div>


                        <Fragment>
                            <Steps
                                steps_defination={steps_defination}
                                exist_link="/materialRelease/"
                                docId={this.state.docId}
                                changeCurrentStep={stepNo =>
                                    this.changeCurrentStep(stepNo)
                                }
                                stepNo={this.state.CurrentStep} changeStatus={docId === 0 ? false : true}
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
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(materialReleaseAddEdit))
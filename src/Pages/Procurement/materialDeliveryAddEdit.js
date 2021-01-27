import React, { Component, Fragment } from "react";

import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachmentWithProgress";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import UploadSingleAttachment from "../../Componants/OptionsPanels/UploadSingleAttachment";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import moment from "moment";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import { toast } from "react-toastify";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import Api from "../../api";
import ReactTable from "react-table";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import { SkyLightStateless } from "react-skylight";
import Steps from "../../Componants/publicComponants/Steps";
var steps_defination = [];
steps_defination = [
    { name: "materialDelivery", callBackFn: null },
    { name: "items", callBackFn: null }
];
let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = "";
let arrange = 0;
const find = require("lodash/find");
const includes = require("lodash/includes");

let selectedRows = [];

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(
        Resources["subjectRequired"][currentLanguage]
    ),
    contractId: Yup.string().required(
        Resources["contractPoSelection"][currentLanguage]
    )
});

const documentItemValidationSchema = Yup.object().shape({
    itemId: Yup.string().required(
        Resources["itemDescription"][currentLanguage]
    ),

    approvedQuantity: Yup.number()
        .required(Resources["approvedQuantity"][currentLanguage])
        .typeError(Resources["onlyNumbers"][currentLanguage]),

    rejectedQuantity: Yup.number()
        .required(Resources["rejectedQuantity"][currentLanguage])
        .typeError(Resources["onlyNumbers"][currentLanguage]),

    pendingQuantity: Yup.number()
        .required(Resources["pendingQuantity"][currentLanguage])
        .typeError(Resources["onlyNumbers"][currentLanguage]),

    arrangeItem: Yup.string().required(
        Resources["resourceCodeRequired"][currentLanguage]
    ),

    unitPrice: Yup.number()
        .required(Resources["unitPrice"][currentLanguage])
        .typeError(Resources["onlyNumbers"][currentLanguage])
});

let ApproveOrRejectData = [
    { label: Resources.approved[currentLanguage], value: "true" },
    { label: Resources.rejected[currentLanguage], value: "false" }
];

class materialDeliveryAddEdit extends Component {
    constructor(props) {
        super(props);
        const query = new URLSearchParams(this.props.location.search);

        let index = 0;
        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(
                        CryptoJS.enc.Base64.parse(param[1]).toString(
                            CryptoJS.enc.Utf8
                        )
                    );
                    docId = obj.docId;
                    projectId = obj.projectId;
                    projectName = obj.projectName;
                    isApproveMode = obj.isApproveMode;
                    docApprovalId = obj.docApprovalId;
                    arrange = obj.arrange;
                    perviousRoute = obj.perviousRoute;
                } catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            selectedRows: [],
            CurrentStep: 0,
            showDeleteModal: false,
            isLoading: false,
            isEdit: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 49,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document
                ? Object.assign({}, this.props.document)
                : {},
            itemDocument: {},
            addItemDocument: {},
            selected: {},
            specsSectionData: [],
            disciplines: [],
            contractPoData: [],
            materialTypeData: [],
            descriptionList: [],
            descriptionDropData: [],
            MaterialCodeData: [],
            Items: [],
            permission: [
                { name: "sendByEmail", code: 244 },
                { name: "sendByInbox", code: 243 },
                { name: "sendTask", code: 0 },
                { name: "distributionList", code: 986 },
                { name: "createTransmittal", code: 3072 },
                { name: "sendToWorkFlow", code: 734 },
                { name: "viewAttachments", code: 3283 },
                { name: "deleteAttachments", code: 892 }
            ],
            selectedContractId: {
                label: Resources.contractPoSelection[currentLanguage],
                value: "0"
            },
            selectedMaterialType: {
                label: Resources.selectMaterialDeliveryType[currentLanguage],
                value: "0"
            },
            selectedSpecsSection: {
                label: Resources.specsSectionSelection[currentLanguage],
                value: "0"
            },

            selectedItemId: {
                label: Resources.itemDescription[currentLanguage],
                value: "0"
            },
            selectedMaterialCode: {
                label: Resources.specsSectionSelection[currentLanguage],
                value: "0"
            },
            unitPrice: 0,
            approvedQuantity: 0,
            rejectedQuantity: 0,
            pendingQuantity: 0,
            remarks: "",
            arrangeItem: 1,
            receivedDate: moment(),
            nextDeliveryDate: moment(),
            ItemDescriptionInfo: {},
            BtnLoading: false,
            ShowPopup: false,
            objItem: {},
            selectedApproveOrRejectData: {
                label: Resources.approved[currentLanguage],
                value: "true"
            },
            PendingQuantityCheck: false,
            LastPendingQuantity: 0
        };

        if (
            !Config.IsAllow(238) &&
            !Config.IsAllow(239) &&
            !Config.IsAllow(241)
        ) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
    }

    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add("even");
            } else {
                links[i].classList.add("odd");
            }
        }
        this.checkDocumentIsView();

        dataservice.GetDataList("GetAccountsDefaultList?listType=materialcode&pageNumber=0&pageSize=10000", "title", "id").then(res => {
            this.setState({ MaterialCodeData: res });
        });
        if (this.state.docId !== 0) {
            dataservice.GetDataGrid("GetLogsMaterialDeliveryTickets?deliveryId=" + this.state.docId).then(res => {
                this.setState({ Items: res, arrangeItem: res.length + 1 });
            });
          
        }
    }

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.document.id) {
            let doc = nextProps.document;
            doc.docDate =
                doc.docDate === null
                    ? moment().format("YYYY-MM-DD")
                    : moment(doc.docDate).format("YYYY-MM-DD");
            this.setState({
                isEdit: true,
                document: doc,
                hasWorkflow: this.props.hasWorkflow
            });
            let isEdit = nextProps.document.id > 0 ? true : false;
            this.fillDropDowns(isEdit);
            this.checkDocumentIsView();
            dataservice
                .GetDataGrid("GetPoContractItemMaterial?id=" + doc.id)
                .then(res => {
                    let Data = res;
                    let ListData = [];
                    Data.map(i => {
                        let obj = {};
                        obj.value = i.id;
                        obj.label = i.details;
                        ListData.push(obj);
                    });
                    this.setState({
                        descriptionDropData: ListData,
                        descriptionList: res
                    });
                    this.props.actions.ExportingData({ items: res });
                });
        }

    }

    componentDidUpdate(prevProps) {
        if (
            this.props.hasWorkflow !== prevProps.hasWorkflow ||
            this.props.changeStatus !== prevProps.changeStatus
        ) {
            this.checkDocumentIsView();
        }
    }

    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetMaterialDeliveryForEdit?id=" + this.state.docId;
            this.props.actions.documentForEdit(url, this.state.docTypeId, "materialDelivery");
        } else {
            dataservice.GetNextArrangeMainDocument("GetNextArrangeMainDoc?projectId=" + projectId + "&docType=" + this.state.docTypeId + "&companyId=undefined&contactId=undefined").then(res => {
                const Document = {
                    projectId: projectId,
                    applyInventory: false,
                    arrange: res,
                    status: "true",
                    contractId: "",
                    subject: "",
                    docDate: moment(),
                    specsSectionId: "",
                    materialDeliveryTypeId: "",
                    orderType: ""
                };
                this.setState({ document: Document });
            });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    }

    fillDropDowns(isEdit) {
        dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId= " + this.state.projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId")
            .then(result => {
                if (isEdit) {
                    let id = this.props.document.contractId;
                    let selectedValue = {};
                    if (id) {
                        selectedValue = find(result, function (i) {
                            return i.value === id;
                        });
                    }
                }
            });

        dataservice.GetDataList(
            "GetPoContractForList?projectId= " + this.state.projectId, "subject", "id").then(result => {
                if (isEdit) {
                    let id = this.props.document.contractId;
                    let selectedValue = {};
                    if (id) {
                        selectedValue = find(result, function (i) {
                            return i.value === id;
                        });
                        this.setState({ selectedContractId: selectedValue });
                    }
                }
                this.setState({ contractPoData: [...result] });
            });
        dataservice.GetDataList("GetAccountsDefaultList?listType=specsSection&pageNumber=0&pageSize=10000", "title", "id").then(result => {
            if (isEdit) {
                let id = this.props.document.specsSectionId;
                let selectedValue = {};
                if (id) {
                    selectedValue = find(result, function (i) {
                        return i.value === id;
                    });
                    this.setState({ selectedSpecsSection: selectedValue });
                }
            }
            this.setState({ specsSectionData: result });
        });
        dataservice.GetDataList("GetAccountsDefaultList?listType=materialtitle&pageNumber=0&pageSize=10000", "title", "id").then(result => {
            if (isEdit) {
                let id = this.props.document.materialDeliveryTypeId;
                let selectedValue = {};
                if (id) {
                    selectedValue = find(result, function (i) {
                        return i.value === id;
                    });
                    this.setState({ selectedMaterialType: selectedValue });
                }
            }
            this.setState({ materialTypeData: result });
        });
    }

    handleChangeDropDown(
        event,
        field,
        isSubscrib,
        targetState,
        url,
        param,
        selectedValue,
        subDatasource,
        subDatasourceId
    ) {
     
        let original_document = { ...this.state.document };
        let updated_document = {};
        if (event == null) {
            updated_document[field] = event;
            updated_document[subDatasourceId] = event;
            this.setState({ [subDatasource]: event });
         }
         else{
             updated_document[field] = event.value;
         }
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document, [selectedValue]: event });
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(239)) {
                this.setState({ isViewMode: true });
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (this.state.isApproveMode != true && Config.IsAllow(239)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(239)) {
                        if (
                            this.props.document.status !== false &&
                            Config.IsAllow(239)
                        ) {
                            this.setState({ isViewMode: false });
                        } else {
                            this.setState({ isViewMode: true });
                        }
                    } else {
                        this.setState({ isViewMode: true });
                    }
                }
            }
        } else {
            this.setState({ isViewMode: false });
        }
    }

    handleChange(e, field) {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document });
    }

    saveAndExit(event) {
        if (this.state.CurrentStep === 1) {
            this.setState({ CurrentStep: this.state.CurrentStep + 1 });
        } else {
            this.props.history.push(
                "/materialDelivery/" + this.state.projectId
            );
        }
    }

    showBtnsSaving() {
        let btn = null;
        if (this.state.docId === 0) {
            btn = (
                <button className="primaryBtn-1 btn meduimBtn" type="submit">
                    {Resources.save[currentLanguage]}
                </button>
            );
        } else if (this.state.docId > 0) {
            btn = (
                <button
                    type="submit"
                    className={
                        "primaryBtn-1 btn meduimBtn " +
                        (this.state.isViewMode === true ? " disNone" : " ")
                    }>
                    {Resources.next[currentLanguage]}
                </button>
            );
        }
        return btn;
    }

    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(891) === true ? (
                <ViewAttachment isApproveMode={this.state.isViewMode}
                    docTypeId={this.state.docTypeId}
                    docId={this.state.docId}
                    projectId={this.state.projectId}
                    deleteAttachments={854}
                />
            ) : null
        ) : null;
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({ docId: 0 });
    }

    handleChangeDate(e, field) {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = e;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document });
    }

    SaveDoc = Mood => {
        this.setState({ isLoading: true });

        if (Mood === "EditMood") {
            let doc = { ...this.state.document };
            doc.docDate = moment(doc.docDate, "YYYY-MM-DD").format(
                "YYYY-MM-DD[T]HH:mm:ss.SSS"
            );
            doc.status =  doc.applyInventory == "true" ? false : doc.status;

            dataservice.addObject("EditMaterialDelivery", doc).then(result => {
                this.setState({ isLoading: false });
                toast.success(
                    Resources["operationSuccess"][currentLanguage]
                );
            }).catch(ex => {
                this.setState({ Loading: false });
                toast.error(Resources["operationCanceled"][currentLanguage].successTitle);
            });
        } else {
            let doc = { ...this.state.document };

            doc.docDate = moment(doc.docDate, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            dataservice.addObject("AddMaterialDelivery", doc).then(result => {
                this.setState({ isLoading: false, docId: result.id });
                toast.success(
                    Resources["operationSuccess"][currentLanguage]
                );
                dataservice.GetDataGrid("GetPoContractItemMaterial?id=" + result.id).then(res => {
                    let Data = res;
                    let ListData = [];
                    Data.map(i => {
                        let obj = {};
                        obj.value = i.id;
                        obj.label = i.details;
                        ListData.push(obj);
                    });
                    this.setState({
                        descriptionDropData: ListData,
                        descriptionList: res
                    });
                });
            }).catch(ex => {
                this.setState({ Loading: false });
                toast.error(Resources["operationCanceled"][currentLanguage].successTitle);
            });
        }
    };

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
            selected: newSelected
        });
    }

    ConfirmationDeleteItem = () => {
        let originalRows = this.state.Items;
        this.setState({ isLoading: true });

        let ids = [];
        selectedRows.map(s => {
            ids.push(s.id);
        });
        let output = originalRows.filter((v) => includes(ids, v.id));
        let checkInventoryQty = find(output, function (o) { return o.isInInventory == false });
        if (checkInventoryQty) {
            toast.error("There is at least one Item With Quantity Not In Inventory");
            selectedRows = [];
            this.setState({
                showDeleteModal: false,
                isLoading: false
            });
        }
        else {
            Api.post("DeleteMultipleLogsMaterialDeliveryTickets", ids)
                .then(res => {
                    if (res) {
                        ids.map(i => {
                            originalRows = originalRows.filter(r => r.id !== i);
                        });
                        selectedRows = [];
                        let data = { items: originalRows };
                     
                        this.setState({
                            Items: originalRows,
                            showDeleteModal: false,
                            isLoading: false
                        });
                        toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
                    }
                })
                .catch(ex => {
                    this.setState({
                        showDeleteModal: false,
                        isLoading: false
                    });
                    toast.error(
                        Resources["operationCanceled"][currentLanguage].successTitle
                    );
                });
        }
    };

    SaveItem = values => {
        let Qty =
            parseInt(this.state.approvedQuantity) +
            parseInt(this.state.rejectedQuantity) +
            parseInt(this.state.pendingQuantity);
        let ActaulQty = parseInt(this.state.ItemDescriptionInfo.quantity);
        if (Qty <= ActaulQty) {
            this.setState({ isLoading: true });
            let obj = {
                projectId: this.state.projectId,
                materialDeliveryId: this.state.docId,
                details: this.state.ItemDescriptionInfo.details,
                arrange: this.state.arrangeItem,
                description: this.state.ItemDescriptionInfo.description,
                receivedDate: moment(
                    this.state.receivedDate,
                    "YYYY-MM-DD"
                ).format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
                nextDeliveryDate: moment(
                    this.state.nextDeliveryDate,
                    "YYYY-MM-DD"
                ).format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
                approvedQuantity: this.state.approvedQuantity,
                rejectedQuantity: this.state.rejectedQuantity,
                pendingQuantity: this.state.pendingQuantity,
                materialCode:
                    this.state.selectedMaterialCode!==null? this.state.selectedMaterialCode.value !== "0"
                        ? this.state.selectedMaterialCode.value
                        : "":"",
                resourceCode: this.state.ItemDescriptionInfo.resourceCode,
                unitPrice: this.state.unitPrice,
                itemId: this.state.selectedItemId.value,
                unit: this.state.ItemDescriptionInfo.unit,
                quantity: this.state.ItemDescriptionInfo.remaining,
                maxQnty: Qty,
                maxQuantity:this.state.ItemDescriptionInfo.remaining,
                remarks: this.state.remarks,
            };

            dataservice
                .addObject("AddLogsMaterialDeliveryTickets", obj)
                .then(result => {
                    let Items = this.state.Items;
                    result.originalQuantity=this.state.ItemDescriptionInfo.quantity
                    Items.push(result);
                    this.setState({
                        Items,
                        arrangeItem: Items.length + 1,
                        approvedQuantity: 0,
                        rejectedQuantity: 0,
                        pendingQuantity: 0,
                        remarks: "",
                        isLoading: false,
                        selectedMaterialCode: {
                            label:
                                Resources.specsSectionSelection[
                                currentLanguage
                                ],
                            value: "0"
                        }
                    });
                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                })
                .catch(ex => {
                    this.setState({ Loading: false });
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                            .successTitle
                    );
                });
        } else {
            toast.error(
                "Approved, Pending, and Rejected Quantity Greater than " +
                ActaulQty +
                " And Greater Than 0"
            );
        }
    };

    handleChangeItemId = event => {
        let data = [];
        if(event!==null){
            data = this.state.descriptionList.filter(i => i.id === event.value);
            let obj = data[0];
            console.log(obj);
            this.setState({
                selectedItemId: event,
                unitPrice: obj.unitPrice,
                ItemDescriptionInfo: obj
            });
        }
        else{
            this.setState({
                selectedItemId: event,
                unitPrice: "",
                ItemDescriptionInfo: {}
            });
        }
      
    };

    HandelChangeItems = (e, name) => {
        this.setState({ [name]: e.target.value });
    };

    PendingQuantityHandelChange = e => {
        let value = parseInt(e.target.value);
        let originalValue = this.state.objItem.pendingQuantity;
        if (value <= originalValue) {
            this.setState({
                PendingQuantityCheck: false
            });
        } else {
            this.setState({
                PendingQuantityCheck: true
            });
        }
    };

    EditPendingQty = () => {
        if (!this.state.PendingQuantityCheck) {
            this.setState({ isLoading: true });
            Api.post(
                "UpdateQuantityMaterialDelivery?materialDeliveryId=" +
                this.state.objItem.id +
                "&quantity=" +
                this.state.LastPendingQuantity +
                "&status=" +
                this.state.selectedApproveOrRejectData.value
            ).then(result => {
                dataservice
                    .GetDataGrid(
                        "GetLogsMaterialDeliveryTickets?deliveryId=" +
                        this.state.docId
                    )
                    .then(res => {
                        this.setState({
                            Items: res,
                            arrangeItem: res.length + 1,
                            isLoading: false,
                            ShowPopup: false
                        });
                        toast.success(
                            Resources["operationSuccess"][currentLanguage]
                        );
                    })
                    .catch(ex => {
                        this.setState({ isLoading: false, ShowPopup: false });
                        toast.error(
                            Resources["operationCanceled"][currentLanguage]
                                .successTitle
                        );
                    });
            });
        }
    };

    fillTable = () => {
        this.setState({ isLoading: true });
        dataservice
            .GetDataGrid(
                "GetLogsMaterialDeliveryTickets?deliveryId=" + this.state.docId
            )
            .then(res => {
                this.setState({
                    Items: res,
                    arrangeItem: res.length + 1,
                    isLoading: false
                });
               
                toast.success(Resources["operationSuccess"][currentLanguage]);
            })
            .catch(ex => {
                this.setState({ isLoading: false, ShowPopup: false });
                toast.error(
                    Resources["operationCanceled"][currentLanguage].successTitle
                );
            });
    };

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }


    changeCurrentStep = stepNo => {
        this.setState({ CurrentStep: stepNo });
    };

    render() {

        let StepOne = () => {
            return (
                <div className="document-fields">
                    <Formik
                        initialValues={this.state.document}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={values => {
                            if (this.props.showModal) {
                                return;
                            }
                            if (this.props.changeStatus === true && this.state.docId > 0) {
                                this.SaveDoc("EditMood");
                                this.changeCurrentStep(1);
                            } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                this.SaveDoc("AddMood");
                            } else {
                                this.changeCurrentStep(1);
                            }
                        }}>
                        {({
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            setFieldValue,
                            setFieldTouched
                        }) => (
                                <Form
                                    id="QsForm"
                                    className="customProform"
                                    noValidate="novalidate"
                                    onSubmit={handleSubmit}>
                                    <div className="proForm first-proform">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources.subject[currentLanguage]}
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input" +
                                                    (errors.subject &&
                                                        touched.subject
                                                        ? " has-error"
                                                        : !errors.subject &&
                                                            touched.subject
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    name="subject"
                                                    className="form-control fsadfsadsa"
                                                    id="subject"
                                                    placeholder={
                                                        Resources.subject[
                                                        currentLanguage
                                                        ]
                                                    }
                                                    value={
                                                        this.state.document.subject
                                                    }
                                                    autoComplete="off"
                                                    onChange={e =>
                                                        this.handleChange(
                                                            e,
                                                            "subject"
                                                        )
                                                    }
                                                    onBlur={e => {
                                                        handleBlur(e);
                                                        handleChange(e);
                                                    }}
                                                />{" "}
                                                {touched.subject ? (
                                                    <em className="pError">
                                                        {errors.subject}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className={this.state.document.status == false ? "linebylineInput valid-input disabled" : "linebylineInput valid-input"}>
                                            <label className="control-label">
                                                {Resources.status[currentLanguage]}
                                            </label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio"
                                                    name="letter-status"
                                                    defaultChecked={this.state.document.status === false ? null : "checked"}
                                                    value="true"
                                                    onChange={e => this.handleChange(e, "status")} />
                                                <label>{Resources.oppened[currentLanguage]}</label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio"
                                                    name="letter-status"
                                                    defaultChecked={this.state.document.status === false ? "checked" : null}
                                                    value="false"
                                                    onChange={e => this.handleChange(e, "status")} />
                                                <label>{Resources.closed[currentLanguage]}
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input alternativeDate">
                                            <DatePicker
                                                title="docDate"
                                                startDate={
                                                    this.state.document.docDate
                                                }
                                                handleChange={e =>
                                                    this.handleChangeDate(
                                                        e,
                                                        "docDate"
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources.arrange[currentLanguage]}
                                            </label>
                                            <div className="ui input inputDev">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    readOnly
                                                    value={
                                                        this.state.document.arrange
                                                    }
                                                    onBlur={e => {
                                                        handleChange(e);
                                                        handleBlur(e);
                                                    }}
                                                    onChange={e =>
                                                        this.handleChange(
                                                            e,
                                                            "arrange"
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                isClear={true}
                                                title="contractPo"
                                                data={this.state.contractPoData}
                                                selectedValue={
                                                    this.state.selectedContractId
                                                }
                                                handleChange={event =>
                                                    this.handleChangeDropDown(
                                                        event,
                                                        "contractId",
                                                        false,
                                                        "",
                                                        "",
                                                        "",
                                                        "selectedContractId"
                                                    )
                                                }
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.contractId}
                                                isDisabled={this.props.changeStatus}
                                                touched={touched.contractId}
                                                name="contractId"
                                                id="contractId"
                                            />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                isClear={true}
                                                title="specsSection"
                                                data={this.state.specsSectionData}
                                                selectedValue={
                                                    this.state.selectedSpecsSection
                                                }
                                                handleChange={event =>
                                                    this.handleChangeDropDown(
                                                        event,
                                                        "specsSectionId",
                                                        false,
                                                        "",
                                                        "",
                                                        "",
                                                        "selectedSpecsSection"
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                isClear={true}
                                                title="materialDeliveryType"
                                                data={this.state.materialTypeData}
                                                selectedValue={
                                                    this.state.selectedMaterialType
                                                }
                                                handleChange={event =>
                                                    this.handleChangeDropDown(
                                                        event,
                                                        "materialDeliveryTypeId",
                                                        false,
                                                        "",
                                                        "",
                                                        "",
                                                        "selectedMaterialType"
                                                    )
                                                }
                                            />
                                        </div>
                                        {this.props.changeStatus === true ?
                                            <div className={(this.state.document.applyInventory == true || this.state.document.applyInventory =="true") ? "linebylineInput valid-input disabled" : "linebylineInput valid-input"}>
                                                <label className="control-label">
                                                    {Resources.applyInventory[currentLanguage]}
                                                </label>
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input type="radio"
                                                        name="letter-applyInventory"
                                                        defaultChecked={this.state.document.applyInventory === true ? null : "checked"}
                                                        value="false"
                                                        onChange={e => this.handleChange(e, "applyInventory")} />
                                                    <label>{Resources.no[currentLanguage]}</label>
                                                </div>
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input type="radio"
                                                        name="letter-applyInventory"
                                                        defaultChecked={this.state.document.applyInventory === true ? "checked" : null}
                                                        value="true"
                                                        onChange={e => this.handleChange(e, "applyInventory")} />
                                                    <label>{Resources.yes[currentLanguage]}
                                                    </label>
                                                </div>
                                            </div>
                                            : null}
                                    </div>

                                    {this.props.changeStatus === true ? (
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
                                    ) : null}

                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId > 0 ? (
                                                <UploadAttachment
                                                    changeStatus={
                                                        this.props.changeStatus
                                                    }
                                                    AddAttachments={891}
                                                    EditAttachments={3242}
                                                    ShowDropBox={3539}
                                                    ShowGoogleDrive={3540}
                                                    docTypeId={this.state.docTypeId}
                                                    docId={this.state.docId}
                                                    projectId={this.state.projectId}
                                                />
                                            ) : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true ? (
                                                <ViewWorkFlow
                                                    docType={this.state.docTypeId}
                                                    docId={this.state.docId}
                                                    projectId={this.state.projectId}
                                                />
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="slider-Btns">
                                        {this.state.isLoading ? (
                                            <button className="primaryBtn-1 btn disabled">
                                                <div className="spinner">
                                                    <div className="bounce1" />
                                                    <div className="bounce2" />
                                                    <div className="bounce3" />
                                                </div>
                                            </button>
                                        ) : (
                                                this.showBtnsSaving()
                                            )}
                                    </div>
                                </Form>
                            )}
                    </Formik>
                </div>
            );
        };

        let StepTwo = () => {
            let columnsItem = [
                {
                    Header: Resources["select"][currentLanguage],
                    id: "checkbox",
                    accessor: "id",
                    Cell: ({ row }) => {
                        return (
                            <div className="ui checked checkbox  checkBoxGray300 ">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={
                                        this.state.selected[
                                        row._original.id
                                        ] === true
                                    }
                                    onChange={() =>
                                        this.toggleRow(row._original)
                                    }
                                />
                                <label />
                            </div>
                        );
                    },
                    width: 70
                },
                {
                    Header:Resources["originalQuantity"][currentLanguage],
                    accessor:"originalQuantity",
                    width:100
                },
                {
                    Header: Resources["arrange"][currentLanguage],
                    accessor: "arrange",
                    width: 50
                },
                {
                    Header: Resources["description"][currentLanguage],
                    accessor: "description",
                    width: 300
                },
                {
                    Header: Resources["remaining"][currentLanguage],
                    accessor: "quantity",
                    width: 100
                },
                {
                    Header: Resources["unitPrice"][currentLanguage],
                    accessor: "unitPrice",
                    width: 100
                },
                {
                    Header: Resources["approvedQuantity"][currentLanguage],
                    accessor: "approvedQuantity",
                    width: 100
                },
                {
                    Header: Resources["rejectedQuantity"][currentLanguage],
                    accessor: "rejectedQuantity",
                    width: 100
                },
                {
                    Header: Resources["pendingQuantity"][currentLanguage],
                    accessor: "pendingQuantity",
                    width: 100,
                    Cell: row => (
                        <span>
                            <a
                                className="editorCell"
                                onClick={() =>
                                    this.setState({
                                        ShowPopup:
                                            row.value !== 0 ? true : false,
                                        objItem: row.original,
                                        LastPendingQuantity:
                                            row.original.pendingQuantity
                                    })
                                }>
                                <span
                                    style={{
                                        padding: "0 6px",
                                        margin: "5px 0",
                                        border: "1px dashed",
                                        cursor: "pointer"
                                    }}>
                                    {row.value}
                                </span>
                            </a>
                        </span>
                    )
                },
                {
                    Header: Resources["remainingQuantity"][currentLanguage],
                    accessor: "remaining",
                    width: 100
                },
                {
                    Header: Resources["grandRemainingQuantity"][currentLanguage],
                    accessor: "grandRemainingQuantity",
                    width: 100
                },
                {
                    Header: Resources["recievedDate"][currentLanguage],
                    accessor: "receivedDate",
                    width: 100,
                    Cell: row => (
                        <span>
                            <span>
                                {moment(row.value).format("DD/MM/YYYY")}
                            </span>
                        </span>
                    )
                },
                {
                    Header: Resources["nextDate"][currentLanguage],
                    accessor: "nextDeliveryDate",
                    width: 100,
                    Cell: row => (
                        <span>
                            <span>
                                {moment(row.value).format("DD/MM/YYYY")}
                            </span>
                        </span>
                    )
                },
                {
                    Header: Resources["resourceCode"][currentLanguage],
                    accessor: "resourceCode",
                    width: 100
                },
                {
                    Header: Resources["remarks"][currentLanguage],
                    accessor: "remarks",
                    width: 100
                }
            ];

            return (
                <div className="step-content">
                    <UploadSingleAttachment
                        key="materialDeliveryitem"
                        docType="MaterialDelivery"
                        projectId={this.state.docId}
                        link={
                            Config.getPublicConfiguartion().downloads +
                            "/DownLoads/Excel/MaterialDelivery.xlsx"
                        }
                        header="addManyItems"
                        disabled={
                            this.props.changeStatus
                                ? this.props.docId === 0
                                    ? true
                                    : false
                                : false
                        }
                        afterUpload={() => this.fillTable()}
                    />

                    <div
                        className={
                            "subiTabsContent feilds__top " +
                            (this.props.isViewMode ? "readOnly_inputs" : " ")
                        }>
                        <Formik
                            initialValues={{
                                itemId:
                                    this.state.selectedItemId!==null?this.state.selectedItemId.value !== "0"
                                        ? this.state.selectedItemId
                                        : "":"",
                                unitPrice: this.state.unitPrice,
                                approvedQuantity: this.state.approvedQuantity,
                                rejectedQuantity: this.state.rejectedQuantity,
                                pendingQuantity: this.state.pendingQuantity,
                                arrangeItem: this.state.arrangeItem
                            }}
                            validationSchema={documentItemValidationSchema}
                            enableReinitialize={true}
                            onSubmit={() => {
                                this.SaveItem();
                            }}>
                            {({
                                errors,
                                touched,
                                setFieldTouched,
                                setFieldValue,
                                handleBlur,
                                handleChange
                            }) => (
                                    <Form
                                        id="voItemForm"
                                        className="proForm datepickerContainer customProform"
                                        noValidate="novalidate">
                                        <header className="main__header">
                                            <div className="main__header--div">
                                                <h2 className="zero">
                                                    {
                                                        Resources["addItems"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                </h2>
                                            </div>
                                        </header>
                                        <div className="document-fields">
                                            <div className="proForm datepickerContainer">
                                                <div className="linebylineInput valid-input letterFullWidth ">
                                                    <Dropdown
                                                        isClear={true}
                                                        title="itemDescription"
                                                        data={
                                                            this.state
                                                                .descriptionDropData
                                                        }
                                                        selectedValue={
                                                            this.state
                                                                .selectedItemId
                                                        }
                                                        handleChange={event =>
                                                            this.handleChangeItemId(
                                                                event
                                                            )
                                                        }
                                                        onBlur={setFieldTouched}
                                                        error={errors.itemId}
                                                        onChange={setFieldValue}
                                                        touched={touched.itemId}
                                                        name="itemId"
                                                        id="itemId"
                                                    />
                                                </div>

                                                <div className="linebylineInput valid-input alternativeDate">
                                                    <DatePicker
                                                        title="recievedDate"
                                                        startDate={
                                                            this.state.receivedDate
                                                        }
                                                        handleChange={e =>
                                                            this.setState({
                                                                receivedDate: e
                                                            })
                                                        }
                                                    />
                                                </div>

                                                <div className="linebylineInput valid-input alternativeDate">
                                                    <DatePicker
                                                        title="nextDate"
                                                        startDate={
                                                            this.state
                                                                .nextDeliveryDate
                                                        }
                                                        handleChange={e =>
                                                            this.setState({
                                                                nextDeliveryDate: e
                                                            })
                                                        }
                                                    />
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">
                                                        {
                                                            Resources["no"][
                                                            currentLanguage
                                                            ]
                                                        }{" "}
                                                    </label>
                                                    <div
                                                        className={
                                                            "inputDev ui input " +
                                                            (errors.arrange
                                                                ? "has-error"
                                                                : !errors.arrange &&
                                                                    touched.arrange
                                                                    ? " has-success"
                                                                    : " ")
                                                        }>
                                                        <input
                                                            className="form-control"
                                                            name="arrangeItem"
                                                            placeholder={
                                                                Resources["no"][
                                                                currentLanguage
                                                                ]
                                                            }
                                                            value={
                                                                this.state
                                                                    .arrangeItem
                                                            }
                                                            onChange={e =>
                                                                this.HandelChangeItems(
                                                                    e,
                                                                    "arrangeItem"
                                                                )
                                                            }
                                                            onBlur={e => {
                                                                handleBlur(e);
                                                                handleChange(e);
                                                            }}
                                                        />
                                                        {errors.arrange ? (
                                                            <em className="pError">
                                                                {errors.arrange}
                                                            </em>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input ">
                                                    <Dropdown
                                                        isClear={true}
                                                        title="materialCode"
                                                        data={
                                                            this.state
                                                                .MaterialCodeData
                                                        }
                                                        name="materialCode"
                                                        selectedValue={
                                                            this.state
                                                                .selectedMaterialCode
                                                        }
                                                        handleChange={e =>
                                                            this.setState({
                                                                selectedMaterialCode: e
                                                            })
                                                        }
                                                    />
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">
                                                        {
                                                            Resources["unitPrice"][
                                                            currentLanguage
                                                            ]
                                                        }{" "}
                                                    </label>
                                                    <div
                                                        className={
                                                            "inputDev ui input " +
                                                            (errors.unitPrice
                                                                ? "has-error"
                                                                : !errors.unitPrice &&
                                                                    touched.unitPrice
                                                                    ? " has-success"
                                                                    : " ")
                                                        }>
                                                        <input
                                                            name="unitPrice"
                                                            className="form-control"
                                                            autoComplete="off"
                                                            placeholder={
                                                                Resources[
                                                                "unitPrice"
                                                                ][currentLanguage]
                                                            }
                                                            value={
                                                                this.state.unitPrice
                                                            }
                                                            onChange={e =>
                                                                this.HandelChangeItems(
                                                                    e,
                                                                    "unitPrice"
                                                                )
                                                            }
                                                            onBlur={e => {
                                                                handleBlur(e);
                                                                handleChange(e);
                                                            }}
                                                        />
                                                        {errors.unitPrice ? (
                                                            <em className="pError">
                                                                {errors.unitPrice}
                                                            </em>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">
                                                        {
                                                            Resources[
                                                            "approvedQuantity"
                                                            ][currentLanguage]
                                                        }{" "}
                                                    </label>
                                                    <div
                                                        className={
                                                            "inputDev ui input " +
                                                            (errors.approvedQuantity
                                                                ? "has-error"
                                                                : !errors.approvedQuantity &&
                                                                    touched.approvedQuantity
                                                                    ? " has-success"
                                                                    : " ")
                                                        }>
                                                        <input
                                                            name="approvedQuantity"
                                                            className="form-control"
                                                            autoComplete="off"
                                                            placeholder={
                                                                Resources[
                                                                "approvedQuantity"
                                                                ][currentLanguage]
                                                            }
                                                            value={
                                                                this.state
                                                                    .approvedQuantity
                                                            }
                                                            onChange={e =>
                                                                this.HandelChangeItems(
                                                                    e,
                                                                    "approvedQuantity"
                                                                )
                                                            }
                                                            onBlur={e => {
                                                                handleBlur(e);
                                                                handleChange(e);
                                                            }}
                                                        />
                                                        {errors.approvedQuantity ? (
                                                            <em className="pError">
                                                                {
                                                                    errors.approvedQuantity
                                                                }
                                                            </em>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                {/* <div className="linebylineInput valid-input">
                                                    <label className="control-label">
                                                        {
                                                            Resources[
                                                            "pendingQuantity"
                                                            ][currentLanguage]
                                                        }{" "}
                                                    </label>
                                                    <div
                                                        className={
                                                            "inputDev ui input " +
                                                            (errors.pendingQuantity
                                                                ? "has-error"
                                                                : !errors.pendingQuantity &&
                                                                    touched.pendingQuantity
                                                                    ? " has-success"
                                                                    : " ")
                                                        }>
                                                        <input
                                                            name="pendingQuantity"
                                                            className="form-control"
                                                            autoComplete="off"
                                                            placeholder={
                                                                Resources[
                                                                "pendingQuantity"
                                                                ][currentLanguage]
                                                            }
                                                            value={
                                                                this.state
                                                                    .pendingQuantity
                                                            }
                                                            onChange={e =>
                                                                this.HandelChangeItems(
                                                                    e,
                                                                    "pendingQuantity"
                                                                )
                                                            }
                                                            onBlur={e => {
                                                                handleBlur(e);
                                                                handleChange(e);
                                                            }}
                                                        />
                                                        {errors.pendingQuantity ? (
                                                            <em className="pError">
                                                                {
                                                                    errors.pendingQuantity
                                                                }
                                                            </em>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input"> 
                                                    <label className="control-label">
                                                        {
                                                            Resources[
                                                            "rejectedQuantity"
                                                            ][currentLanguage]
                                                        }{" "}
                                                    </label>
                                                    <div
                                                        className={
                                                            "inputDev ui input " +
                                                            (errors.rejectedQuantity
                                                                ? "has-error"
                                                                : !errors.rejectedQuantity &&
                                                                    touched.rejectedQuantity
                                                                    ? " has-success"
                                                                    : " ")
                                                        }>
                                                        <input
                                                            name="rejectedQuantity"
                                                            className="form-control"
                                                            autoComplete="off"
                                                            placeholder={
                                                                Resources[
                                                                "rejectedQuantity"
                                                                ][currentLanguage]
                                                            }
                                                            value={
                                                                this.state
                                                                    .rejectedQuantity
                                                            }
                                                            onChange={e =>
                                                                this.HandelChangeItems(
                                                                    e,
                                                                    "rejectedQuantity"
                                                                )
                                                            }
                                                            onBlur={e => {
                                                                handleBlur(e);
                                                                handleChange(e);
                                                            }}
                                                        />
                                                        {errors.rejectedQuantity ? (
                                                            <em className="pError">
                                                                {
                                                                    errors.rejectedQuantity
                                                                }
                                                            </em>
                                                        ) : null}
                                                    </div>
                                                </div>*/}

                                                <div className="linebylineInput valid-input fullInputWidth">
                                                    <label className="control-label">
                                                        {
                                                            Resources.remarks[
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </label>
                                                    <div className="ui input inputDev">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={
                                                                this.state.remarks
                                                            }
                                                            placeholder={
                                                                Resources.remarks[
                                                                currentLanguage
                                                                ]
                                                            }
                                                            onBlur={e => {
                                                                handleChange(e);
                                                                handleBlur(e);
                                                            }}
                                                            onChange={e =>
                                                                this.setState({
                                                                    remarks:
                                                                        e.target
                                                                            .value
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="slider-Btns fullWidthWrapper textLeft ">
                                                    {this.state.BtnLoading ===
                                                        false ? (
                                                            <button
                                                                className={
                                                                    "primaryBtn-1 btn " + (this.props.isViewMode === true ? " disNone" : "")
                                                                }
                                                                type="submit"
                                                                disabled={this.props.isViewMode}>
                                                                {
                                                                    Resources["save"][currentLanguage]
                                                                }
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="primaryBtn-1 btn  disabled"
                                                                disabled="disabled">
                                                                <div className="spinner">
                                                                    <div className="bounce1" />
                                                                    <div className="bounce2" />
                                                                    <div className="bounce3" />
                                                                </div>
                                                            </button>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                        </Formik>

                        <div className="doc-pre-cycle">
                            <header>
                                <h2 className="zero">
                                    {Resources["AddedItems"][currentLanguage]}
                                </h2>
                            </header>
                            <div className="reactTableActions">
                                {selectedRows.length > 0 ? (
                                    <div
                                        className={
                                            "gridSystemSelected " +
                                            (selectedRows.length > 0
                                                ? " active"
                                                : "")
                                        }>
                                        <div className="tableselcted-items">
                                            <span id="count-checked-checkboxes">
                                                {selectedRows.length}
                                            </span>
                                            <span>Selected</span>
                                        </div>
                                        <div className="tableSelctedBTNs">
                                            <button
                                                className="defaultBtn btn smallBtn"
                                                onClick={e =>
                                                    this.setState({
                                                        showDeleteModal: true
                                                    })
                                                }>
                                                DELETE
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                                <span>Grand Remaining Equation : (Approved Quantity + Rejected Quantity + Pending Quantity)-(Released Quantity)</span>
                                <ReactTable
                                    filterable
                                    ref={r => {
                                        this.selectTable = r;
                                    }}
                                    data={this.state.Items}
                                    columns={columnsItem}
                                    defaultPageSize={10}
                                    minRows={2}
                                    noDataText={
                                        Resources["noData"][currentLanguage]
                                    }
                                />
                            </div>
                        </div>
                        <div className="doc-pre-cycle">
                            <div className="slider-Btns">
                            <button className="primaryBtn-1 btn meduimBtn" onClick={() => { this.props.history.push("/materialDelivery/"+ this.props.projectId) }}>Finish</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        let EditItem = () => {
            return (
                <div className="doc-pre-cycle">
                    <div className="subiTabsContent feilds__top">
                        <div className="document-fields">
                            <div className="proForm datepickerContainer">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">
                                        {Resources.quantity[currentLanguage]}
                                    </label>
                                    <div
                                        className={
                                            "inputDev ui input" +
                                            (this.state.PendingQuantityCheck
                                                ? " has-error"
                                                : "")
                                        }>
                                        <input
                                            name="description"
                                            className="form-control"
                                            type="number"
                                            defaultValue={
                                                this.state.objItem
                                                    .pendingQuantity
                                            }
                                            onBlur={e =>
                                                this.PendingQuantityHandelChange(
                                                    e
                                                )
                                            }
                                            onChange={e =>
                                                this.setState({
                                                    LastPendingQuantity:
                                                        e.target.value
                                                })
                                            }
                                        />
                                        {this.state.PendingQuantityCheck ? (
                                            <em className="pError">
                                                Please enter a value greater
                                                than or equal to{" "}
                                                {
                                                    this.state.objItem
                                                        .pendingQuantity
                                                }
                                                .
                                            </em>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        isClear={true}
                                        title="approveOrReject"
                                        data={ApproveOrRejectData}
                                        selectedValue={
                                            this.state
                                                .selectedApproveOrRejectData
                                        }
                                        handleChange={e =>
                                            this.setState({
                                                selectedApproveOrRejectData: e
                                            })
                                        }
                                    />
                                </div>
                            </div>{" "}
                            <div className="slider-Btns">
                                <button
                                    className="primaryBtn-1 btn meduimBtn"
                                    onClick={e => this.EditPendingQty()}>
                                    {Resources["save"][currentLanguage]}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div className="mainContainer">
                <div className="skyLight__form">
                    <SkyLightStateless
                        onOverlayClicked={e =>
                            this.setState({ ShowPopup: false })
                        }
                        title={Resources["editTitle"][currentLanguage]}
                        onCloseClicked={e =>
                            this.setState({ ShowPopup: false })
                        }
                        isVisible={this.state.ShowPopup}>
                        {EditItem()}
                    </SkyLightStateless>
                </div>

                <div
                    className={
                        this.state.isViewMode === true
                            ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs"
                            : "documents-stepper noTabs__document one__tab one_step"
                    }>
                    <HeaderDocument
                        projectName={projectName}
                        isViewMode={this.state.isViewMode}
                        perviousRoute={this.state.perviousRoute}
                        docTitle={Resources.materialDelivery[currentLanguage]}
                        moduleTitle={Resources["procurement"][currentLanguage]}
                    />
                    <div className="doc-container">
                        <div className="step-content">
                            {this.props.changeStatus == true ? (
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">
                                            {" "}
                                            {
                                                Resources.goEdit[
                                                currentLanguage
                                                ]
                                            }{" "}
                                        </h2>
                                        <p className="doc-infohead">
                                            <span>
                                                {" "}
                                                {this.state.document.refDoc}
                                            </span>{" "}
                                            -{" "}
                                            <span>
                                                {" "}
                                                {this.state.document.arrange}
                                            </span>{" "}
                                            -{" "}
                                            <span>
                                                {moment(
                                                    this.state.document.docDate
                                                ).format("DD/MM/YYYY")}
                                            </span>
                                        </p>
                                    </div>
                                </header>
                            ) : null}
                            {this.state.isLoading ? <LoadingSection /> : null}
                            {this.state.CurrentStep === 0 ? (
                                <Fragment>{StepOne()}</Fragment>
                            ) : (
                                    StepTwo()
                                )}
                        </div>

                        <Fragment>
                            <Steps
                                steps_defination={steps_defination}
                                exist_link="/materialDelivery/"
                                docId={this.state.docId}
                                changeCurrentStep={stepNo =>
                                    this.changeCurrentStep(stepNo)
                                }
                                stepNo={this.state.CurrentStep} 
                                changeStatus={docId === 0 ? false : true}
                            />
                        </Fragment>
                    </div>
                </div>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={
                            Resources["smartDeleteMessage"][currentLanguage]
                                .content
                        }
                        closed={e => this.setState({ showDeleteModal: false })}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={e =>
                            this.setState({
                                showDeleteModal: false,
                                isLoading: true
                            })
                        }
                        buttonName="delete"
                        clickHandlerContinue={this.ConfirmationDeleteItem}
                    />
                ) : null}
            </div>
        );
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
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(materialDeliveryAddEdit));

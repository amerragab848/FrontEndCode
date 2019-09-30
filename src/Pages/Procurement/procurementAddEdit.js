import React, { Component, Fragment } from "react";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import moment from "moment";
import SkyLight from "react-skylight";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import { toast } from "react-toastify";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import ReactTable from "react-table";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import XSLfile from "../../Componants/OptionsPanels/XSLfiel";
import Steps from "../../Componants/publicComponants/Steps";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
let perviousRoute = "";
const _ = require("lodash");
var steps_defination = [];
steps_defination = [
    { name: "procurement", callBackFn: null },
    { name: "procurementItems", callBackFn: null },
    { name: "procurementContractors", callBackFn: null },
    { name: "procurementContractorsItems", callBackFn: null },
    { name: "ordering", callBackFn: null },
];

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
    companyId: Yup.string().required(Resources["fromCompany"][currentLanguage]),
    disciplineId: Yup.string().required(Resources["disciplineRequired"][currentLanguage])
});

const SuppliersAdditionvalidation = Yup.object().shape({
    contractorId: Yup.string().required(Resources["selectSupplier"][currentLanguage]),
    notes: Yup.string().required(Resources["NotesRequired"][currentLanguage])
});

const documentItemValidationSchema = Yup.object().shape({
    description: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
    specsSectionId: Yup.string().required(Resources["specsSectionSelection"][currentLanguage]),
    arrange: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage]).required(Resources["selectNumber"][currentLanguage]),
    quantity: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage])
        .required(Resources["quantityRequired"][currentLanguage]),

    revQuantity: Yup.number()
        .typeError(Resources["onlyNumbers"][currentLanguage])
        .required(Resources["revQuantityRequired"][currentLanguage]),

    resourceCode: Yup.string().required(
        Resources["resourceCodeRequired"][currentLanguage]
    ),

    unitPrice: Yup.number()
        .typeError(Resources["onlyNumbers"][currentLanguage])
        .required(Resources["unitSelection"][currentLanguage]),

    itemType: Yup.string().required(
        Resources["itemTypeSelection"][currentLanguage]
    ),

    days: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage])
});

class procurementAddEdit extends Component {

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
            isLoading: false,
            perviousRoute: perviousRoute,
            CurrStep: 0,
            showDeleteModal: false,
            isEdit: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 69,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document
                ? Object.assign({}, this.props.document)
                : {},
            permission: [
                { name: "sendByEmail", code: 172 },
                { name: "sendByInbox", code: 171 },
                { name: "sendTask", code: 0 },
                { name: "distributionList", code: 978 },
                { name: "createTransmittal", code: 3064 },
                { name: "sendToWorkFlow", code: 726 },
                { name: "viewAttachments", code: 4020 },
                { name: "deleteAttachments", code: 3273 }
            ],
            selectedFromCompany: {
                label: Resources.fromCompany[currentLanguage],
                value: "0"
            },
            selectedSpecsSection: {
                label: Resources.specsSectionSelection[currentLanguage],
                value: "0"
            },
            SpecsSectionData: [],
            FromCompaniesData: [],
            disciplineData: [],
            selectedItemId: {
                label: Resources.itemDescription[currentLanguage],
                value: "0"
            },
            BtnLoading: false,
            IsAddMood: false,
            SupplierData: [],
            selectedDisciplineId: {
                label: Resources.disciplineRequired[currentLanguage],
                value: "0"
            },
            selectedSupplier: {
                label: Resources.selectSupplier[currentLanguage],
                value: "0"
            },
            itemTypes: [],
            selectedItemType: {
                label: Resources.itemTypeSelection[currentLanguage],
                value: "0"
            },
            EquipmentTypeData: [],
            selectedEquipmentType: {
                label: Resources.equipmentTypeSelection[currentLanguage],
                value: "0"
            },
            ProcurementItems: [],
            action: 0
        };

        if (
            !Config.IsAllow(166) &&
            !Config.IsAllow(167) &&
            !Config.IsAllow(169)
        ) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
    }

    componentDidMount() {
        var links = document.querySelectorAll(
            ".noTabs__document .doc-container .linebylineInput"
        );
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add("even");
            } else {
                links[i].classList.add("odd");
            }
        }
        this.checkDocumentIsView();

        if (this.state.docId !== 0) {
            dataservice
                .GetNextArrangeMainDocument(
                    "GetNextArrangeItems?docId=" +
                    this.state.docId +
                    "&docType=" +
                    this.state.docTypeId
                )
                .then(result => {
                    this.setState({ arrangeItem: result });
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
                .GetDataGrid(
                    "GetContractsProcurementContractors?procurmentId=" + doc.id
                )
                .then(res => {
                    this.setState({ SupplierData: res });
                });

            dataservice
                .GetDataGrid(
                    "GetProcurmentItemCustomizeTable?procurmentId=" + doc.id
                )
                .then(res => {
                    this.setState({ procurementItems: res });
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
            let url = "GetContractsProcurementForEdit?id=" + this.state.docId;
            this.props.actions.documentForEdit(
                url,
                this.state.docTypeId,
                "procurement"
            );
        } else {
            const Document = {
                projectId: projectId,
                status: "true",
                companyId: "",
                subject: "",
                docDate: moment(),
                disciplineId: ""
            };
            this.setState({ document: Document });
        }

        this.fillDropDowns(false);
        this.props.actions.documentForAdding();
    }

    fillDropDowns(isEdit) {
        dataservice
            .GetDataList(
                "GetProjectProjectsCompaniesForList?projectId= " +
                this.state.projectId,
                "companyName",
                "companyId"
            )
            .then(result => {
                if (isEdit) {
                    let id = this.props.document.companyId;
                    let selectedValue = {};
                    if (id) {
                        selectedValue = _.find(result, function (i) {
                            return i.value === id;
                        });
                        this.setState({ selectedFromCompany: selectedValue });
                    }
                }
                this.setState({ FromCompaniesData: [...result] });
            });

        dataservice
            .GetDataList(
                "GetAccountsDefaultList?listType=discipline&pageNumber=0&pageSize=10000",
                "title",
                "id"
            )
            .then(result => {
                if (isEdit) {
                    let id = this.props.document.disciplineId;
                    let selectedValue = {};
                    if (id) {
                        selectedValue = _.find(result, function (i) {
                            return i.value == id;
                        });
                        this.setState({ selectedDisciplineId: selectedValue });
                    }
                }
                this.setState({ disciplineData: [...result] });
            });

        dataservice
            .GetDataList(
                "GetaccountsDefaultListWithAction?listType=estimationitemtype",
                "title",
                "id"
            )
            .then(res => {
                this.setState({ itemTypes: [...res] });
            });

        dataservice
            .GetDataList(
                "GetAccountsDefaultList?listType=equipmenttype&pageNumber=0&pageSize=10000",
                "title",
                "id"
            )
            .then(result => {
                this.setState({
                    EquipmentTypeData: result
                });
            });

        dataservice
            .GetDataList(
                "GetAccountsDefaultList?listType=specsSection&pageNumber=0&pageSize=10000",
                "title",
                "id"
            )
            .then(result => {
                if (isEdit) {
                    let id = this.props.document.specsSectionId;
                    let selectedValue = {};
                    if (id) {
                        selectedValue = _.find(result, function (i) {
                            return i.value == id;
                        });
                        this.setState({ selectedSpecsSection: selectedValue });
                    }
                }
                this.setState({ SpecsSectionData: [...result] });
            });
    }

    handleChangeDropDown(event, field, isSubscrib, selectedValue) {
        if (event == null) return;
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ document: updated_document, [selectedValue]: event });
        if (isSubscrib) {
            this.fillSubDropDown(event.value, false);
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(167)) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(167)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(167)) {
                    if (
                        this.props.document.status !== false &&
                        Config.IsAllow(167)
                    ) {
                        this.setState({ isViewMode: false });
                    } else {
                        this.setState({ isViewMode: true });
                    }
                } else {
                    this.setState({ isViewMode: true });
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
        if (this.state.CurrStep === 1) {
            this.setState({ CurrStep: this.state.CurrStep + 1 });
        } else {
            this.props.history.push("/procurement/" + this.state.projectId);
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
            Config.IsAllow(4020) === true ? (
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
        this.setState({ isLoading: true, IsAddMood: false });
        if (Mood === "EditMood") {
            let doc = { ...this.state.document };
            doc.docDate = moment(doc.docDate, "YYYY-MM-DD").format(
                "YYYY-MM-DD[T]HH:mm:ss.SSS"
            );
            dataservice
                .addObject("EditContractsProcurement", doc)
                .then(result => {
                    this.setState({ isLoading: false, IsAddMood: true });
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
            let doc = { ...this.state.document };
            doc.docDate = moment(doc.docDate, "YYYY-MM-DD").format(
                "YYYY-MM-DD[T]HH:mm:ss.SSS"
            );
            dataservice
                .addObject("AddContractsProcurement", doc)
                .then(result => {
                    this.setState({
                        isLoading: false,
                        docId: result.id,
                        IsAddMood: true
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
        }
        //this.AfterSaveDoc()
    };

    executeBeforeModalClose = e => {
        this.setState({ showModal: false });
    };

    AddingSuppliersAddition = values => {
        this.setState({ isLoading: true });
        let SaveObj = {
            contractorId: this.state.selectedSupplier.value,
            notes: values.notes,
            procurementId: this.state.docId
        };
        dataservice
            .addObject("AddContractsProcurementContractors", SaveObj)
            .then(result => {
                values.notes = "";
                values.contractorId = "";
                this.setState({
                    selectedSupplier: {
                        label: Resources.selectSupplier[currentLanguage],
                        value: "0"
                    },
                    SupplierData: result,
                    isLoading: false
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            })
            .catch(ex => {
                this.setState({ isLoading: false });
                toast.error(
                    Resources["operationCanceled"][currentLanguage].successTitle
                );
            });
    };

    handleChangeItemType = e => {
        switch (e.label) {
            case "Material":
                this.setState({
                    selectedItemType: e,
                    ShowDays: false,
                    ShowEquipmentType: false,
                    action: 1
                });
                break;
            case "Labor":
                this.setState({
                    selectedItemType: e,
                    ShowDays: true,
                    ShowEquipmentType: false,
                    action: 2
                });
                break;

            case "Equipment":
                this.setState({
                    selectedItemType: e,
                    ShowDays: true,
                    ShowEquipmentType: true,
                    action: 3
                });
                break;
            case "lumpSum":
                this.setState({
                    selectedItemType: e,
                    ShowDays: false,
                    ShowEquipmentType: false,
                    action: 5
                });
                break;

            default:
                this.setState({
                    selectedItemType: e,
                    ShowDays: false,
                    ShowEquipmentType: false
                });
        }
    };

    SaveItem = values => {
        this.setState({ isLoading: true });
        let SaveObj = {
            projectId: this.state.projectId,
            specsSectionId: this.state.selectedSpecsSection.value,
            details: values.description,
            days: values.days,
            quantity: values.quantity,
            revQuantity: values.revQuantity,
            unitPrice: values.unitPrice,
            procurementId: this.state.docId,
            itemType: this.state.selectedItemType.value,
            equipmenttypeId:
                this.state.selectedEquipmentType.value === "0"
                    ? undefined
                    : this.state.selectedEquipmentType.value,
            resourceCode: values.resourceCode,
            arrange: values.arrange,
            action: this.state.action
        };
        dataservice
            .addObject("AddContractsProcurementItems", SaveObj)
            .then(res => {
                values.description = "";
                values.quantity = "";
                values.revQuantity = "";
                values.unitPrice = "";
                values.resourceCode = "";
                values.days = 1;
                this.setState({
                    isLoading: false,
                    procurementItems: res,
                    selectedItemType: {
                        label: Resources.itemTypeSelection[currentLanguage],
                        value: "0"
                    },
                    selectedEquipmentType: {
                        label:
                            Resources.equipmentTypeSelection[currentLanguage],
                        value: "0"
                    },
                    selectedSpecsSection: {
                        label: Resources.specsSectionSelection[currentLanguage],
                        value: "0"
                    }
                });
            }, toast.success(Resources["operationSuccess"][currentLanguage].successTitle))
            .catch(ex => {
                this.setState({
                    isLoading: false
                });
                toast.error(
                    Resources["operationCanceled"][currentLanguage].successTitle
                );
            });
    };

    fillTable = () => {
        this.setState({ isLoading: true });
        dataservice
            .GetDataGrid(
                "GetContractsProcurementItems?procurmentId=" + this.state.docId
            )
            .then(res => {
                this.setState({ ProcurementItems: res, isLoading: false });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            })
            .catch(ex => {
                this.setState({ isLoading: false });
                toast.error(
                    Resources["operationCanceled"][currentLanguage].successTitle
                );
            });
    };

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrStep: stepNo });
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

                            if (this.state.IsAddMood) {
                                this.changeCurrentStep(1);
                            } else {
                                if (
                                    this.props.changeStatus === true &&
                                    this.state.docId > 0
                                ) {
                                    this.SaveDoc("EditMood");
                                    this.changeCurrentStep(1);
                                } else if (
                                    this.props.changeStatus === false &&
                                    this.state.docId === 0
                                ) {
                                    this.SaveDoc("AddMood");
                                }
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

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources.status[currentLanguage]}
                                            </label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input
                                                    type="radio"
                                                    name="letter-status"
                                                    defaultChecked={
                                                        this.state.document
                                                            .status === false
                                                            ? null
                                                            : "checked"
                                                    }
                                                    value="true"
                                                    onChange={e =>
                                                        this.handleChange(
                                                            e,
                                                            "status"
                                                        )
                                                    }
                                                />
                                                <label>
                                                    {
                                                        Resources.oppened[
                                                        currentLanguage
                                                        ]
                                                    }
                                                </label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input
                                                    type="radio"
                                                    name="letter-status"
                                                    defaultChecked={
                                                        this.state.document
                                                            .status === false
                                                            ? "checked"
                                                            : null
                                                    }
                                                    value="false"
                                                    onChange={e =>
                                                        this.handleChange(
                                                            e,
                                                            "status"
                                                        )
                                                    }
                                                />
                                                <label>
                                                    {
                                                        Resources.closed[
                                                        currentLanguage
                                                        ]
                                                    }
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
                                            <Dropdown
                                                title="fromCompany"
                                                data={this.state.FromCompaniesData}
                                                selectedValue={
                                                    this.state.selectedFromCompany
                                                }
                                                handleChange={event =>
                                                    this.handleChangeDropDown(
                                                        event,
                                                        "companyId",
                                                        false,
                                                        "selectedFromCompany"
                                                    )
                                                }
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.companyId}
                                                touched={touched.companyId}
                                                name="companyId"
                                                id="companyId"
                                            />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                title="descipline"
                                                data={this.state.disciplineData}
                                                selectedValue={
                                                    this.state.selectedDisciplineId
                                                }
                                                handleChange={event =>
                                                    this.handleChangeDropDown(
                                                        event,
                                                        "disciplineId",
                                                        false,
                                                        "selectedDisciplineId"
                                                    )
                                                }
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.disciplineId}
                                                touched={touched.disciplineId}
                                                name="disciplineId"
                                                id="disciplineId"
                                            />
                                        </div>
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
                                                    AddAttachments={942}
                                                    EditAttachments={3272}
                                                    ShowDropBox={3547}
                                                    ShowGoogleDrive={35428}
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
                    Header: Resources["arrange"][currentLanguage],
                    accessor: "arrange",
                    width: 50
                },
                {
                    Header: Resources["description"][currentLanguage],
                    accessor: "details",
                    width: 250
                },
                {
                    Header: Resources["quantity"][currentLanguage],
                    accessor: "quantity",
                    width: 100
                },
                {
                    Header: Resources["unitPrice"][currentLanguage],
                    accessor: "unitPrice",
                    width: 100
                },
                {
                    Header: Resources["total"][currentLanguage],
                    accessor: "total",
                    width: 100
                },
                {
                    Header: Resources["resourceCode"][currentLanguage],
                    accessor: "resourceCode",
                    width: 180
                },
                {
                    Header: Resources["specsSection"][currentLanguage],
                    accessor: "specsSection",
                    width: 150
                }
            ];

            return (
                <div className="step-content">
                    <div
                        className={
                            "subiTabsContent feilds__top " +
                            (this.props.isViewMode ? "readOnly_inputs" : " ")
                        }>
                        <Formik
                            initialValues={{
                                description: "",
                                quantity: "",
                                revQuantity: "",
                                unitPrice: "",
                                itemType: "",
                                resourceCode: "",
                                days: 1,
                                specsSectionId: "",
                                arrange: this.state.ProcurementItems.length + 1
                            }}
                            validationSchema={documentItemValidationSchema}
                            enableReinitialize={true}
                            onSubmit={values => {
                                this.SaveItem(values);
                            }}>
                            {({
                                errors,
                                touched,
                                setFieldTouched,
                                setFieldValue,
                                handleBlur,
                                handleChange,
                                values
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
                                            <div className="proForm first-proform">
                                                <div className="linebylineInput valid-input letterFullWidth ">
                                                    <label className="control-label">
                                                        {
                                                            Resources.description[
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </label>
                                                    <div
                                                        className={
                                                            "inputDev ui input" +
                                                            (errors.description &&
                                                                touched.description
                                                                ? " has-error"
                                                                : !errors.description &&
                                                                    touched.description
                                                                    ? " has-success"
                                                                    : " ")
                                                        }>
                                                        <input
                                                            name="description"
                                                            className="form-control fsadfsadsa"
                                                            id="description"
                                                            autoComplete="off"
                                                            placeholder={
                                                                Resources
                                                                    .description[
                                                                currentLanguage
                                                                ]
                                                            }
                                                            value={
                                                                values.description
                                                            }
                                                            onChange={handleChange}
                                                            onBlur={e => {
                                                                handleBlur(e);
                                                                handleChange(e);
                                                            }}
                                                        />{" "}
                                                        {touched.description ? (
                                                            <em className="pError">
                                                                {errors.description}
                                                            </em>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="proForm datepickerContainer">
                                                <div className="linebylineInput valid-input">
                                                    <Dropdown
                                                        title="specsSection"
                                                        data={
                                                            this.state
                                                                .SpecsSectionData
                                                        }
                                                        selectedValue={
                                                            this.state
                                                                .selectedSpecsSection
                                                        }
                                                        handleChange={event =>
                                                            this.setState({
                                                                selectedSpecsSection: event
                                                            })
                                                        }
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={
                                                            errors.specsSectionId
                                                        }
                                                        touched={
                                                            touched.specsSectionId
                                                        }
                                                        name="specsSectionId"
                                                        id="specsSectionId"
                                                    />
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">
                                                        {
                                                            Resources["quantity"][
                                                            currentLanguage
                                                            ]
                                                        }{" "}
                                                    </label>
                                                    <div
                                                        className={
                                                            "inputDev ui input " +
                                                            (errors.quantity
                                                                ? "has-error"
                                                                : !errors.quantity &&
                                                                    touched.quantity
                                                                    ? " has-success"
                                                                    : " ")
                                                        }>
                                                        <input
                                                            className="form-control"
                                                            name="quantity"
                                                            value={values.quantity}
                                                            placeholder={
                                                                Resources[
                                                                "quantity"
                                                                ][currentLanguage]
                                                            }
                                                            onChange={handleChange}
                                                            onBlur={e => {
                                                                handleBlur(e);
                                                                handleChange(e);
                                                            }}
                                                        />
                                                        {errors.quantity ? (
                                                            <em className="pError">
                                                                {errors.quantity}
                                                            </em>
                                                        ) : null}
                                                    </div>
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
                                                            name="arrange"
                                                            value={values.arrange}
                                                            placeholder={
                                                                Resources["no"][
                                                                currentLanguage
                                                                ]
                                                            }
                                                            onChange={handleChange}
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

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">
                                                        {
                                                            Resources[
                                                            "revQuantity"
                                                            ][currentLanguage]
                                                        }{" "}
                                                    </label>
                                                    <div
                                                        className={
                                                            "inputDev ui input " +
                                                            (errors.revQuantity
                                                                ? "has-error"
                                                                : !errors.revQuantity &&
                                                                    touched.revQuantity
                                                                    ? " has-success"
                                                                    : " ")
                                                        }>
                                                        <input
                                                            className="form-control"
                                                            name="revQuantity"
                                                            placeholder={
                                                                Resources[
                                                                "revQuantity"
                                                                ][currentLanguage]
                                                            }
                                                            value={
                                                                values.revQuantity
                                                            }
                                                            onChange={handleChange}
                                                            onBlur={e => {
                                                                handleBlur(e);
                                                                handleChange(e);
                                                            }}
                                                        />
                                                        {errors.revQuantity ? (
                                                            <em className="pError">
                                                                {errors.revQuantity}
                                                            </em>
                                                        ) : null}
                                                    </div>
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
                                                            value={values.unitPrice}
                                                            onChange={handleChange}
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
                                                            "resourceCode"
                                                            ][currentLanguage]
                                                        }{" "}
                                                    </label>
                                                    <div
                                                        className={
                                                            "inputDev ui input " +
                                                            (errors.resourceCode
                                                                ? "has-error"
                                                                : !errors.resourceCode &&
                                                                    touched.resourceCode
                                                                    ? " has-success"
                                                                    : " ")
                                                        }>
                                                        <input
                                                            name="resourceCode"
                                                            className="form-control"
                                                            autoComplete="off"
                                                            placeholder={
                                                                Resources[
                                                                "resourceCode"
                                                                ][currentLanguage]
                                                            }
                                                            value={
                                                                values.resourceCode
                                                            }
                                                            onChange={handleChange}
                                                            onBlur={e => {
                                                                handleBlur(e);
                                                                handleChange(e);
                                                            }}
                                                        />
                                                        {errors.resourceCode ? (
                                                            <em className="pError">
                                                                {
                                                                    errors.resourceCode
                                                                }
                                                            </em>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input ">
                                                    <Dropdown
                                                        title="itemType"
                                                        data={this.state.itemTypes}
                                                        selectedValue={
                                                            this.state
                                                                .selectedItemType
                                                        }
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={errors.itemType}
                                                        touched={touched.itemType}
                                                        name="itemType"
                                                        handleChange={event =>
                                                            this.handleChangeItemType(
                                                                event
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {this.state.ShowDays ? (
                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">
                                                            {
                                                                Resources["days"][
                                                                currentLanguage
                                                                ]
                                                            }{" "}
                                                        </label>
                                                        <div
                                                            className={
                                                                "inputDev ui input " +
                                                                (errors.days
                                                                    ? "has-error"
                                                                    : !errors.days &&
                                                                        touched.days
                                                                        ? " has-success"
                                                                        : " ")
                                                            }>
                                                            <input
                                                                name="days"
                                                                className="form-control"
                                                                autoComplete="off"
                                                                placeholder={
                                                                    Resources[
                                                                    "days"
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                                value={values.days}
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={e => {
                                                                    handleBlur(e);
                                                                    handleChange(e);
                                                                }}
                                                            />
                                                            {errors.days ? (
                                                                <em className="pError">
                                                                    {errors.days}
                                                                </em>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                ) : null}

                                                {this.state.ShowEquipmentType ? (
                                                    <div className="linebylineInput valid-input ">
                                                        <Dropdown
                                                            title="equipmentType"
                                                            data={
                                                                this.state
                                                                    .EquipmentTypeData
                                                            }
                                                            name="equipmentType"
                                                            selectedValue={
                                                                this.state
                                                                    .selectedEquipmentType
                                                            }
                                                            handleChange={e =>
                                                                this.setState({
                                                                    selectedEquipmentType: e
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                ) : null}

                                                <div className="slider-Btns fullWidthWrapper textLeft ">
                                                    {this.state.BtnLoading ===
                                                        false ? (
                                                            <button
                                                                className={
                                                                    "primaryBtn-1 btn " +
                                                                    (this.props
                                                                        .isViewMode ===
                                                                        true
                                                                        ? " disNone"
                                                                        : "")
                                                                }
                                                                type="submit"
                                                                disabled={
                                                                    this.props
                                                                        .isViewMode
                                                                }>
                                                                {
                                                                    Resources["save"][
                                                                    currentLanguage
                                                                    ]
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

                        <XSLfile
                            key="procurementitem"
                            docId={this.state.docId}
                            docType={this.state.docType}
                            link={
                                Config.getPublicConfiguartion().downloads + "/DownLoads/Excel/procurement.xlsx"
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
                        <div className="doc-pre-cycle">
                            <header>
                                <h2 className="zero">
                                    {
                                        Resources["procurementItems"][
                                        currentLanguage
                                        ]
                                    }
                                </h2>
                            </header>
                            <div className="reactTableActions">
                                <ReactTable
                                    filterable
                                    ref={r => {
                                        this.selectTable = r;
                                    }}
                                    data={this.state.procurementItems}
                                    columns={columnsItem}
                                    defaultPageSize={10}
                                    className="-striped -highlight"
                                    minRows={2}
                                    noDataText={
                                        Resources["noData"][currentLanguage]
                                    }
                                />
                            </div>
                        </div>
                        <div className="doc-pre-cycle">
                            <div className="slider-Btns">
                                <button
                                    className="primaryBtn-1 btn meduimBtn"
                                    onClick={()=>this.changeCurrentStep(2)}>
                                    NEXT STEP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        let StepThree = () => {
            let columnsItem = [
                {
                    Header: Resources["suppliers"][currentLanguage],
                    accessor: "contractorName",
                    width: 500
                },
                {
                    Header: Resources["Notes"][currentLanguage],
                    accessor: "notes",
                    width: 350
                }
            ];

            return (
                <div className="doc-pre-cycle">
                    <div className="subiTabsContent feilds__top">
                        <Formik
                            initialValues={{ contractorId: "", notes: "" }}
                            enableReinitialize={true}
                            validationSchema={SuppliersAdditionvalidation}
                            onSubmit={(values, actions) => {
                                this.AddingSuppliersAddition(values);
                            }}>
                            {({
                                errors,
                                touched,
                                handleBlur,
                                handleChange,
                                values,
                                handleSubmit,
                                setFieldTouched,
                                setFieldValue
                            }) => (
                                    <Form onSubmit={handleSubmit}>
                                        {this.state.IsDeductionEdit === false ? (
                                            <header>
                                                <h2 className="zero">
                                                    {
                                                        Resources["deductions"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                </h2>
                                            </header>
                                        ) : null}

                                        <div className="document-fields">
                                            <div className="proForm datepickerContainer">
                                                <div className="linebylineInput valid-input">
                                                    <Dropdown
                                                        title="suppliers"
                                                        data={
                                                            this.state
                                                                .FromCompaniesData
                                                        }
                                                        selectedValue={
                                                            this.state
                                                                .selectedSupplier
                                                        }
                                                        handleChange={e =>
                                                            this.setState({
                                                                selectedSupplier: e
                                                            })
                                                        }
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={errors.contractorId}
                                                        touched={
                                                            touched.contractorId
                                                        }
                                                        name="contractorId"
                                                        id="contractorId"
                                                    />
                                                </div>

                                                <div className="linebylineInput valid-input fullInputWidth">
                                                    <label className="control-label">
                                                        {
                                                            Resources["Notes"][
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </label>
                                                    <div
                                                        className={
                                                            "inputDev ui input" +
                                                            (errors.notes &&
                                                                touched.notes
                                                                ? " has-error"
                                                                : !errors.notes &&
                                                                    touched.notes
                                                                    ? " has-success"
                                                                    : " ")
                                                        }>
                                                        <div className="inputDev ui input">
                                                            <input
                                                                autoComplete="off"
                                                                className="form-control"
                                                                value={values.notes}
                                                                name="notes"
                                                                onBlur={e => {
                                                                    handleBlur(e);
                                                                    handleChange(e);
                                                                }}
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                placeholder={
                                                                    Resources[
                                                                    "Notes"
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            />
                                                            {touched.notes ? (
                                                                <em className="pError">
                                                                    {errors.notes}
                                                                </em>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>{" "}
                                            <div className="slider-Btns">
                                                <button
                                                    className="primaryBtn-1 btn meduimBtn"
                                                    type="submit">
                                                    {
                                                        Resources["save"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                </button>
                                            </div>
                                            <div className="doc-pre-cycle">
                                                <header>
                                                    <h2 className="zero">
                                                        {
                                                            Resources[
                                                            "procurementContractorsItems"
                                                            ][currentLanguage]
                                                        }
                                                    </h2>
                                                </header>
                                                <ReactTable
                                                    ref={r => {
                                                        this.selectTable = r;
                                                    }}
                                                    columns={columnsItem}
                                                    defaultPageSize={10}
                                                    minRows={2}
                                                    data={this.state.SupplierData}
                                                    noDataText={
                                                        Resources["noData"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </Form>
                                )}
                        </Formik>
                        <div className="doc-pre-cycle">
                            <div className="slider-Btns">
                                <button
                                    className="primaryBtn-1 btn meduimBtn"
                                    onClick={()=>this.changeCurrentStep(3)}>
                                    NEXT STEP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        let StepFour = () => {
            return (
                <Fragment>
                    <h1>StepFour</h1>
                </Fragment>
            );
        };

        let StepFive = () => {
            return (
                <Fragment>
                    <h1>StepFive</h1>
                </Fragment>
            );
        };

        return (
            <div className="mainContainer">
                <div
                    className={
                        this.state.isViewMode === true
                            ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs"
                            : "documents-stepper noTabs__document one__tab one_step"
                    }>
                    <HeaderDocument
                        projectName={projectName}
                        isViewMode={this.state.isViewMode}
                        docTitle={
                            Resources.proposalsComparison[currentLanguage]
                        }
                        perviousRoute={this.state.perviousRoute}
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
                            <div className="step-content">
                            {this.state.CurrStep === 0 ? <Fragment>{StepOne()}</Fragment> :
                                this.state.CurrStep === 1 ? <Fragment> {StepTwo()}</Fragment> :
                                    this.state.CurrStep === 2 ? <Fragment> {StepThree()}</Fragment> :
                                        this.state.CurrStep === 3 ? <Fragment> {StepFour()}</Fragment> :
                                            <Fragment> {StepFive()}</Fragment>}
                        </div>
                        </div>
                        <Fragment>
                            <Steps
                                steps_defination={steps_defination}
                                exist_link="/procurement/"
                                docId={this.state.docId}
                                changeCurrentStep={stepNo =>
                                    this.changeCurrentStep(stepNo)
                                }
                                stepNo={this.state.CurrStep} changeStatus={docId === 0 ? false : true}
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
                            this.setState({ showDeleteModal: false })
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
)(withRouter(procurementAddEdit));

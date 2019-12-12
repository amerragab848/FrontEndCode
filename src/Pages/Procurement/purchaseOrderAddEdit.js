import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Config from "../../Services/Config";
import { toast } from "react-toastify";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import Resources from "../../resources.json";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextEditor from "../../Componants/OptionsPanels/TextEditor";
import dataservice from "../../Dataservice";
import * as communicationActions from "../../store/actions/communication";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import SkyLight from "react-skylight";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReactTable from "react-table";
import "react-table/react-table.css";
import CryptoJS from "crypto-js";
import moment from "moment";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { SkyLightStateless } from "react-skylight";
import Recycle from "../../Styles/images/attacheRecycle.png";
import XSLfile from "../../Componants/OptionsPanels/XSLfiel";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import Schedule from "../Contracts/Schedule";
import ContractInsurance from "../Contracts/ContractInsurance";
import SubPurchaseOrderLog from "../Contracts/subPurchaseOrderLog";
import SubContract from "../Contracts/SubContractLog";
import Steps from "../../Componants/publicComponants/Steps";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'
let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = "";
let arrange = 0;
let specsId = "";
let boqId = "";
const find = require("lodash/find");

const ValidtionSchemaForTermsPurchaseOrder = Yup.object().shape({
    details: Yup.string()
        .required(Resources["descriptionRequired"][currentLanguage])
        .nullable(false)
});

const ValidtionSchemaForNewItems = Yup.object().shape({
    itemType: Yup.string()
        .required(Resources["itemTypeSelection"][currentLanguage])
        .nullable(false),
    details: Yup.string()
        .required(Resources["descriptionRequired"][currentLanguage])
        .nullable(false),
    unitPrice: Yup.number()
        .required(Resources["unitPriceRequired"][currentLanguage])
        .typeError(Resources["onlyNumbers"][currentLanguage]),
    quantity: Yup.number()
        .required(Resources["quantityRequired"][currentLanguage])
        .typeError(Resources["onlyNumbers"][currentLanguage]),
    days: Yup.string().required(Resources["daysRequired"][currentLanguage]),
    itemCode: Yup.string().required(Resources["itemCode"][currentLanguage])
});

const ValidtionSchemaForEditItems = Yup.object().shape({
    details: Yup.string().required(
        Resources["descriptionRequired"][currentLanguage]
    ),
    unit: Yup.string().required(Resources["unit"][currentLanguage]),
    unitPrice: Yup.number()
        .required(Resources["unitPriceRequired"][currentLanguage])
        .typeError(Resources["onlyNumbers"][currentLanguage]),
    quantity: Yup.number()
        .required(Resources["quantityRequired"][currentLanguage])
        .typeError(Resources["onlyNumbers"][currentLanguage]),
    resourceCode: Yup.string().required(
        Resources["resourceCodeRequired"][currentLanguage]
    )
});

const ValidtionSchemaForInventoryItems = Yup.object().shape({
    unit: Yup.string()
        .required(Resources["unitSelection"][currentLanguage])
        .nullable(false),
    itemType: Yup.string()
        .required(Resources["itemTypeSelection"][currentLanguage])
        .nullable(false),
    details: Yup.string()
        .required(Resources["descriptionRequired"][currentLanguage])
        .nullable(false),
    unitPrice: Yup.number()
        .required(Resources["unitPriceRequired"][currentLanguage])
        .typeError(Resources["onlyNumbers"][currentLanguage]),
    quantity: Yup.number()
        .required(Resources["quantityRequired"][currentLanguage])
        .typeError(Resources["onlyNumbers"][currentLanguage]),
    details: Yup.string().required(
        Resources["descriptionRequired"][currentLanguage]
    ),
    resourceCode: Yup.string().required(
        Resources["resourceCodeRequired"][currentLanguage]
    ),
    days: Yup.string().required(Resources["daysRequired"][currentLanguage]),
    itemCode: Yup.string().required(Resources["itemCode"][currentLanguage])
});

const validationSchemaForMainDocument = Yup.object().shape({
    subject: Yup.string().required(
        Resources["subjectRequired"][currentLanguage]
    ),
    refDoc: Yup.string().required(Resources["selectRefNo"][currentLanguage]),
    toCompanyId: Yup.string().required(
        Resources["toCompanyRequired"][currentLanguage]
    ),
    toContactId: Yup.string().required(
        Resources["toContactRequired"][currentLanguage]
    ),
    advancePaymentPercent: Yup.number().typeError(
        Resources["onlyNumbers"][currentLanguage]
    )
});

const steps_defination = [
    {
        name: "purchaseOrder",
        callBackFn: null
    },
    {
        name: "items",
        callBackFn: null
    },
    {
        name: "termsOfPurchaseOrder",
        callBackFn: null
    },
    {
        name: "schedule",
        callBackFn: null
    },
    {
        name: "insurance",
        callBackFn: null
    },
    {
        name: "subPOs",
        callBackFn: null
    },
    {
        name: "subContracts",
        callBackFn: null
    }
];

class PurchaseOrderAddEdit extends Component {
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
                    perviousRoute = obj.perviousRoute;
                    arrange = obj.arrange;
                } catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }

        let columns = [
            {
                Header: Resources["numberAbb"][currentLanguage],
                accessor: "arrange",
                sortabel: true,
                width: 80
            },
            {
                Header: Resources["goEdit"][currentLanguage],
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <div
                            className="btn table-btn-tooltip"
                            style={{ marginLeft: "5px" }}
                            onClick={() => this.ViewEditItems(row, 2)}>
                            <i
                                style={{ fontSize: "1.6em" }}
                                className="fa fa-pencil-square-o"
                            />
                        </div>
                    );
                },
                width: 70
            },
            {
                Header: Resources["delete"][currentLanguage],
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <div
                            className="btn table-btn-tooltip"
                            style={{ marginLeft: "5px" }}
                            onClick={() => this.ConfirmDelete(row.id, "Items")}>
                            <i
                                style={{ fontSize: "1.6em" }}
                                className="fa fa-trash-o"
                            />
                        </div>
                    );
                },
                width: 70
            },
            {
                Header: Resources["description"][currentLanguage],
                accessor: "details",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["unit"][currentLanguage],
                accessor: "unit",
                width: 200
            },
            {
                Header: Resources["quantity"][currentLanguage],
                accessor: "quantity",
                width: 200
            },
            {
                Header: Resources["unitPrice"][currentLanguage],
                accessor: "unitPrice",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["total"][currentLanguage],
                accessor: "total",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["resourceCode"][currentLanguage],
                accessor: "resourceCode",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["itemCode"][currentLanguage],
                accessor: "itemCode",
                width: 200,
                sortabel: true
            }
        ];

        this.state = {
            currentStep: 0,
            currentId: 0,
            purchaseOrderDataItems: [],
            termPurchaseOrderData: [],
            BoqData: [],
            moduleTitle: "",
            viewDisription: 0,
            FirstStep: true,
            SecondStep: false,
            SecondStepComplate: false,
            ThirdStep: false,
            ThirdStepComplate: false,
            FourthStepComplate: false,
            FourthStep: false,
            FivethStepComplate: false,
            FivethStep: false,
            SixthStep: false,
            SixthStepComplate: false,
            SeventhStep: false,
            SeventhStepComplate: false,
            isLoading: false,
            CurrStep: 1,
            rows: [],
            showDeleteModal: false,
            selectedRows: [],
            showCheckbox: true,
            columns: columns,
            showModalForEdit: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            docId: docId,
            docTypeId: 70,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document
                ? Object.assign({}, this.props.document)
                : {},
            purchaseOrderItems: {
                id: 0,
                projectId: "",
                specsSectionId: "",
                quantity: 1,
                poQuantity: 0,
                unit: "",
                unitPrice: 1,
                details: "",
                arrange: 1,
                resourceCode: "",
                itemType: "",
                equipmenttypeId: "",
                orderType: "PurchaseOrder",
                docId: "",
                itemId: "",
                purchaseId: "",
                action: "",
                dueBack: moment(),
                days: 1,
                itemCode: ""
            },
            purchaseOrderTerms: { details: "", arrange: 1 },
            IsLoadingCheckCode: false,
            companies: [],
            contacts: [],
            message: "",
            selectedFromCompany: {
                label: Resources.fromCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedToCompany: {
                label: Resources.toCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedToContact: {
                label: Resources.toContactRequired[currentLanguage],
                value: "0"
            },
            selectedItemType: {
                label: Resources.itemTypeSelection[currentLanguage],
                value: "0"
            },
            selectedEquipmentType: {
                label: Resources.equipmentTypeSelection[currentLanguage],
                value: "0"
            },
            permission: [
                { name: "sendByEmail", code: 181 },
                { name: "sendByInbox", code: 180 },
                { name: "sendTask", code: 0 },
                { name: "distributionList", code: 979 },
                { name: "createTransmittal", code: 3065 },
                { name: "sendToWorkFlow", code: 727 }
            ],
            IsAddModel: false,
            status: true,
            statusTermsPO: true,
            activeItems: 0,
            activeTermsPO: 0,
            descriptions: [],
            selectedDescription: {
                label: Resources.descriptionRequired[currentLanguage],
                value: "0"
            },
            itemType: [],
            specssectionType: [],
            selectedSpecssection: {
                label: Resources.specsSectionSelection[currentLanguage],
                value: "0"
            },
            equipmentType: [],
            selectedEquipment: {
                label: Resources.equipmentTypeSelection[currentLanguage],
                value: "0"
            },
            units: [],
            Boq: [],
            itemBoq: [],
            selectedBoq: {
                label: Resources.selectBOQCostCoding[currentLanguage],
                value: "0"
            },
            selectedUnit: {
                label: Resources.unitSelection[currentLanguage],
                value: "0"
            },
            activePopUpItems: 0
        };

        if (
            !Config.IsAllow(175) &&
            !Config.IsAllow(176) &&
            !Config.IsAllow(178)
        ) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.hasWorkflow !== prevProps.hasWorkflow ||
            this.props.changeStatus !== prevProps.changeStatus
        ) {
            this.checkDocumentIsView();
        }

        if (prevProps.showModal != this.props.showModal) {
            this.setState({ showModal: this.props.showModal });
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(176)) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(176)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(176)) {
                    if (
                        this.props.document.status !== false &&
                        Config.IsAllow(176)
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

    changeCurrentStep = stepNo => {
        this.setState({ currentStep: stepNo });
    };

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = (
                <button className="primaryBtn-1 btn meduimBtn" type="submit">
                    {this.state.IsAddModel
                        ? Resources.next[currentLanguage]
                        : Resources.save[currentLanguage]}
                </button>
            );
        } else if (this.state.docId > 0) {
            btn =
                this.state.isViewMode === false ? (
                    <button className="primaryBtn-1 btn mediumBtn">
                        {Resources.next[currentLanguage]}
                    </button>
                ) : null;
        }
        return btn;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            let doc = nextProps.document;
            doc.docDate =
                doc.docDate === null
                    ? moment().format("YYYY-MM-DD")
                    : moment(doc.docDate).format("YYYY-MM-DD");
            doc.completionDate =
                doc.completionDate === null
                    ? moment().format("YYYY-MM-DD")
                    : moment(doc.completionDate).format("YYYY-MM-DD");
            this.setState({
                message: doc.details,
                document: doc,
                IsEditMode: true,
                hasWorkflow: nextProps.hasWorkflow
            });
            this.FillDropDowns(true);

            this.checkDocumentIsView();
        }
    }

    componentWillMount() {
        this.setState({
            isLoading: true
        });

        if (docId > 0) {
            let url =
                "GetContractsPurchaseOrdersForEdit?id=" + this.state.docId;
            this.props.actions
                .documentForEdit(url, this.state.docTypeId, "purchaseOrder")
                .then(res => {
                    this.setState({
                        isLoading: false
                    });
                });

            dataservice
                .GetDataGrid(
                    "GetContractsOrdersItemsExcutionPosByPurchaseId?purchaseId=" +
                    this.state.docId
                )
                .then(result => {
                    this.setState({
                        purchaseOrderDataItems: result
                    });
                });

            dataservice
                .GetDataGrid(
                    "GetContractsPurchaseOrderTermssByProjectId?projectId=" +
                    this.state.docId
                )
                .then(result => {
                    this.setState({
                        termPurchaseOrderData: result
                    });
                });
        } else {
            let mainDocument = {
                projectId: projectId,
                subject: "",
                refDoc: "",
                status: true,
                arrange: 1,
                advancePaymentPercent: "",
                docDate: moment(),
                completionDate: moment(),
                companyId: "",
                toCompanyId: "",
                toContactId: "",
                details: "",
                parentType: "PurchaseOrder",
                id: 0
            };

            this.setState({
                document: mainDocument,
                isLoading: false
            });

            this.FillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    }

    onChangeMessage = value => {
        if (value != null) {
            this.setState({ message: value });

            let original_document = { ...this.state.document };

            let updated_document = {};

            updated_document.details = value;

            updated_document = Object.assign(
                original_document,
                updated_document
            );

            this.setState({
                document: updated_document
            });
        }
    };

    handleChangeDropDown(
        event,
        field,
        isSubscrib,
        targetState,
        url,
        param,
        selectedValue,
        subDatasource
    ) {
        if (event == null) return;
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        if (field == "fromCompanyId") {
            let url =
                "GetNextArrangeMainDoc?projectId=" +
                this.state.projectId +
                "&docType=" +
                this.state.docTypeId +
                "&companyId=" +
                event.value +
                "&contactId=";
            this.props.actions.GetNextArrange(url);
            dataservice.GetNextArrangeMainDocument(url).then(res => {
                updated_document.arrange = res;
                updated_document = Object.assign(
                    original_document,
                    updated_document
                );

                this.setState({
                    document: updated_document
                });
            });
        }
        if (isSubscrib) {
            let action = url + "?" + param + "=" + event.value;
            dataservice
                .GetDataList(action, "contactName", "id")
                .then(result => {
                    this.setState({
                        [targetState]: result
                    });
                });
        }

        this.setState({
            document: updated_document,
            [selectedValue]: event
        });
    }

    handleChangeDropDownTerms(
        event,
        field,
        isSubscrib,
        targetState,
        url,
        param,
        selectedValue,
        subDatasource
    ) {
        if (event == null) return;
        let original_document = { ...this.state.purchaseOrderTerms };
        let updated_document = {};
        if (field === "details") {
            updated_document[field] = event.label;
        }

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            purchaseOrderTerms: updated_document,
            [selectedValue]: event
        });
    }

    handleChangeDropDownItems(
        event,
        field,
        isSubscrib,
        targetState,
        url,
        param,
        selectedValue,
        subDatasource
    ) {
        if (event == null) return;

        let original_document = { ...this.state.purchaseOrderItems };

        let updated_document = {};

        if (field === "details" || field === "unit") {
            updated_document[field] = event.label;
        } else {
            updated_document[field] = event.value;
        }

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            purchaseOrderItems: updated_document,
            [selectedValue]: event
        });
    }

    handleChangeDropDownItemsForBoq(
        event,
        field,
        isSubscrib,
        targetState,
        url,
        param,
        selectedValue,
        subDatasource
    ) {
        if (event == null) return;

        if (field === "specsId") {
            specsId = event.value;
        } else if (field === "boqId") {
            boqId = event.value;
        }

        if (boqId != "" && specsId != "") {
            dataservice
                .GetDataGrid(
                    "GetContractsBoqItemsBySpecsId?boqId=" +
                    boqId +
                    "&specsId=" +
                    specsId
                )
                .then(result => {
                    result.map(item => {
                        item.orderType = "PurchaseOrder";
                        return null;
                    });

                    this.setState({
                        BoqData: result
                    });
                });
        }

        this.setState({
            [selectedValue]: event
        });
    }

    handleChange(e, field) {
        let updated_document = this.state.document;
        updated_document[field] = e.target.value;
        this.setState({
            document: updated_document
        });
    }

    handleChangeTerms(e, field) {
        let updated_document = this.state.purchaseOrderTerms;

        updated_document[field] = e.target.value;

        this.setState({
            purchaseOrderTerms: updated_document
        });
    }

    handleChangeItems(e, field) {
        let updated_document = this.state.purchaseOrderItems;
        updated_document[field] = e.target.value;
        if (field === "itemCode") {
            dataservice
                .GetDataGrid(
                    "GetItemCode?itemCode=" +
                    e.target.value +
                    "&projectId=" +
                    projectId
                )
                .then(result => {
                    if (result === false) {
                        this.setState({
                            purchaseOrderItems: updated_document
                        });
                    } else {
                        toast.info(Resources["itemCodeExist"][currentLanguage]);
                    }
                });
        } else {
            this.setState({
                purchaseOrderItems: updated_document
            });
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

    FillDropDowns = isEdit => {
        dataservice
            .GetDataListCached(
                "GetProjectProjectsCompaniesForList?projectId=" + projectId,
                "companyName",
                "companyId", 'companies', this.state.projectId, "projectId"
            )
            .then(result => {
                this.setState({
                    companies: result,
                    isLoading: false
                });

                if (isEdit === true) {
                    let fromCompanyId = this.state.document.companyId;

                    let toCompanyId = this.state.document.toCompanyId;

                    let selectedFromCompany = find(result, function (i) {
                        return i.value == fromCompanyId;
                    });

                    let selectedToCompany = find(result, function (i) {
                        return i.value == toCompanyId;
                    });

                    this.setState({
                        selectedFromCompany: selectedFromCompany,
                        selectedToCompany: selectedToCompany
                    });

                    this.fillSubDropDownInEdit(
                        "GetContactsByCompanyId",
                        "companyId",
                        fromCompanyId,
                        "toContactId",
                        "selectedToContact",
                        "contacts"
                    );
                }
            });

        dataservice
            .GetDataList(
                "GetDescriptionForDrop?projectId=" + projectId,
                "description",
                "id"
            )
            .then(result => {
                this.setState({
                    descriptions: result
                });
            });

        dataservice
            .GetDataListCached(
                "GetAccountsDefaultListForList?listType=estimationitemtype",
                "title",
                "action",
                 'defaultLists', "estimationitemtype", "listType"
            )
            .then(result => {
                this.setState({
                    itemType: result
                });
            });

        dataservice
            .GetDataListCached(
                "GetAccountsDefaultListForList?listType=specssection",
                "title",
                "id",'defaultLists', "specssection", "listType"
            )
            .then(result => {
                this.setState({
                    specssectionType: result
                });
            });

        dataservice
            .GetDataListCached(
                "GetAccountsDefaultListForList?listType=equipmentType",
                "title",
                "id",'defaultLists', "equipmentType", "listType"
            )
            .then(result => {
                this.setState({
                    equipmentType: result
                });
            });

        dataservice
            .GetDataListCached(
                "GetAccountsDefaultListForList?listType=unit",
                "title",
                "id",'defaultLists', "unit", "listType"
            )
            .then(result => {
                this.setState({
                    units: result
                });
            });

        dataservice
            .GetDataListWithNewVersion(
                "GetContractsBoq?projectId=" +
                projectId +
                "&pageNumber=0&pageSize=1000000000",
                "subject",
                "id"
            )
            .then(result => {
                this.setState({
                    Boq: result
                });
            });
    };

    fillSubDropDownInEdit(
        url,
        param,
        value,
        subField,
        subSelectedValue,
        subDatasource
    ) {
        let action = url + "?" + param + "=" + value;
        dataservice.GetDataList(action, "contactName", "id").then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = find(result, function (i) {
                    return i.value == toSubField;
                });

                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        });
    }

    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(3289) === true ? (
                <ViewAttachment
                    isApproveMode={this.state.isViewMode}
                    docTypeId={this.state.docTypeId}
                    docId={this.state.docId}
                    projectId={this.state.projectId}
                    deleteAttachments={856}
                />
            ) : null
        ) : null;
    }

    AddEditPurchaseOrder = () => {
        if (this.state.IsAddModel) {
            this.changeCurrentStep(1);
        } else {
            this.setState({
                isLoading: true
            });

            let objDocument = this.state.document;
            objDocument.docDate = moment(
                objDocument.docDate,
                "YYYY-MM-DD"
            ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            objDocument.completionDate = moment(
                objDocument.completionDate,
                "YYYY-MM-DD"
            ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            this.changeCurrentStep(1);
            if (this.props.changeStatus) {
                dataservice
                    .addObject("EditContractsPurchaseOrders", objDocument)
                    .then(res => {
                        this.setState({
                            isLoading: false
                        });
                        toast.success(
                            Resources["operationSuccess"][currentLanguage]
                        );
                    })
                    .catch(ex => {
                        toast.error(
                            Resources["operationCanceled"][currentLanguage]
                                .successTitle
                        );
                    });
            } else {
                dataservice
                    .addObject("AddContractsPurchaseOrders", objDocument)
                    .then(res => {
                        this.setState({
                            isLoading: false,
                            docId: res.id,
                            IsAddModel: true
                        });
                        toast.success(
                            Resources["operationSuccess"][currentLanguage]
                        );
                    })
                    .catch(ex => {
                        toast.error(
                            Resources["operationCanceled"][currentLanguage]
                                .successTitle
                        );
                    });
            }
        }
    };

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    ConfirmDelete = (id, moduleTitle) => {
        this.setState({
            currentId: id,
            showDeleteModal: true,
            moduleTitle: moduleTitle
        });
    };

    ViewEditItems = (obj, activePopUpItems) => {
        let getEquipment = this.state.equipmentType.find(
            x => x.value === obj._original.equipmenttypeId
        );
        let getSpecsSection = this.state.specssectionType.find(
            x => x.value === obj._original.specsSectionId
        );

        obj.equipmenttypeId = obj._original.equipmenttypeId;
        obj.specsSectionId = obj._original.specsSectionId;
        obj.days = obj._original.days;
        obj.dueBack =
            obj._original.dueBack != null
                ? moment(obj._original.dueBack).format("YYYY-MM-DD")
                : moment();
        obj.itemType = obj._original.itemType;
        obj.itemId = obj._original.itemId;
        obj.orderType = "PurchaseOrder";
        obj.purchaseId = this.state.docId;

        this.setState({
            activePopUpItems: activePopUpItems,
            purchaseOrderItems: obj,
            showModalForEdit: true,
            selectedEquipmentType:
                getEquipment != null
                    ? { label: getEquipment.label, value: obj.equipmenttypeId }
                    : {
                        label:
                            Resources.equipmentTypeSelection[currentLanguage],
                        value: "0"
                    },
            selectedSpecssection:
                getSpecsSection != null
                    ? {
                        label: getSpecsSection.label,
                        value: obj.specsSectionId
                    }
                    : {
                        label:
                            Resources.specsSectionSelection[currentLanguage],
                        value: "0"
                    }
        });

        this.simpleDialog.show();
    };

    getTabelData() {
        this.setState({ isLoading: true, LoadingPage: true });

        dataservice
            .GetDataGrid(
                "GetContractsOrdersItemsExcutionPosByPurchaseId?purchaseId=" +
                this.state.docId
            )
            .then(result => {
                this.setState({
                    purchaseOrderDataItems: result,
                    isLoading: false,
                    LoadingPage: false
                });
            });
    }

    renderNormalItems = (
        errors,
        touched,
        values,
        handleBlur,
        handleChange,
        setFieldValue,
        setFieldTouched
    ) => {
        return (
            <div className="proForm datepickerContainer letterFullWidth">
                {this.state.viewDisription === 0 ? (
                    <Fragment>
                        <div className="proForm datepickerContainer letterFullWidth">
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="description"
                                    data={this.state.descriptions}
                                    selectedValue={
                                        this.state.selectedDescription
                                    }
                                    handleChange={event => {
                                        this.handleChangeDropDownItems(
                                            event,
                                            "details",
                                            false,
                                            "",
                                            "",
                                            "",
                                            "selectedDescription",
                                            ""
                                        );
                                    }}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                    error={errors.details}
                                    touched={touched.details}
                                    name="details"
                                    index="details"
                                />
                            </div>
                            <button
                                className="primaryBtn-1 btn "
                                type="submit"
                                onClick={e =>
                                    this.renderFromInventory(
                                        this.state.viewDisription
                                    )
                                }>
                                {Resources["addNewItem"][currentLanguage]}
                            </button>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label">
                                {Resources.arrange[currentLanguage]}
                            </label>
                            <div className="ui input inputDev">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="arrange"
                                    readOnly
                                    value={
                                        this.state.purchaseOrderItems.arrange
                                    }
                                    placeholder={
                                        Resources.arrange[currentLanguage]
                                    }
                                    onChange={e =>
                                        this.handleChangeItems(e, "arrange")
                                    }
                                    onBlur={e => {
                                        handleChange(e);
                                        handleBlur(e);
                                    }}
                                    name="arrange"
                                />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label">
                                {Resources.quantity[currentLanguage]}
                            </label>
                            <div
                                className={
                                    "inputDev ui input" +
                                    (errors.quantity && touched.quantity
                                        ? " has-error"
                                        : !errors.quantity && touched.quantity
                                            ? " has-success"
                                            : " ")
                                }>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="advancePaymentPercent"
                                    value={
                                        this.state.purchaseOrderItems.quantity
                                    }
                                    placeholder={
                                        Resources.quantity[currentLanguage]
                                    }
                                    onChange={e =>
                                        this.handleChangeItems(e, "quantity")
                                    }
                                    onBlur={e => {
                                        handleChange(e);
                                        handleBlur(e);
                                    }}
                                    name="quantity"
                                />
                                {errors.quantity && touched.quantity ? (
                                    <em className="pError">
                                        {errors.quantity}
                                    </em>
                                ) : null}
                            </div>
                        </div>

                        <div className="linebylineInput valid-input fullInputWidth">
                            <label className="control-label">
                                {Resources.unitPrice[currentLanguage]}
                            </label>
                            <div
                                className={
                                    "inputDev ui input" +
                                    (errors.unitPrice && touched.unitPrice
                                        ? " has-error"
                                        : !errors.unitPrice && touched.unitPrice
                                            ? " has-success"
                                            : " ")
                                }>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="unitPrice"
                                    value={
                                        this.state.purchaseOrderItems.unitPrice
                                    }
                                    placeholder={
                                        Resources.unitPrice[currentLanguage]
                                    }
                                    onChange={e =>
                                        this.handleChangeItems(e, "unitPrice")
                                    }
                                    onBlur={e => {
                                        handleChange(e);
                                        handleBlur(e);
                                    }}
                                    name="unitPrice"
                                />
                                {errors.unitPrice && touched.unitPrice ? (
                                    <em className="pError">
                                        {errors.unitPrice}
                                    </em>
                                ) : null}
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <Dropdown
                                title="itemType"
                                data={this.state.itemType}
                                selectedValue={this.state.selectedItemType}
                                handleChange={event => {
                                    this.handleChangeDropDownItems(
                                        event,
                                        "itemType",
                                        false,
                                        "",
                                        "",
                                        "",
                                        "selectedItemType",
                                        ""
                                    );
                                }}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.itemType}
                                touched={touched.itemType}
                                name="itemType"
                                index="itemType"
                            />
                        </div>

                        {this.state.selectedItemType.value === 3 ? (
                            <Fragment>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">
                                        {Resources.days[currentLanguage]}
                                    </label>
                                    <div
                                        className={
                                            "inputDev ui input" +
                                            (errors.days && touched.days
                                                ? " has-error"
                                                : !errors.days && touched.days
                                                    ? " has-success"
                                                    : " ")
                                        }>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="days"
                                            value={
                                                this.state.purchaseOrderItems
                                                    .days
                                            }
                                            placeholder={
                                                Resources.days[currentLanguage]
                                            }
                                            onChange={e =>
                                                this.handleChangeItems(
                                                    e,
                                                    "days"
                                                )
                                            }
                                            onBlur={e => {
                                                handleChange(e);
                                                handleBlur(e);
                                            }}
                                            name="days"
                                        />
                                        {errors.days && touched.days ? (
                                            <em className="pError">
                                                {errors.days}
                                            </em>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="equipmentType"
                                        data={this.state.equipmentType}
                                        selectedValue={
                                            this.state.selectedEquipmentType
                                        }
                                        handleChange={event => {
                                            this.handleChangeDropDownItems(
                                                event,
                                                "equipmenttypeId",
                                                false,
                                                "",
                                                "",
                                                "",
                                                "selectedEquipmentType",
                                                ""
                                            );
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.equipmentType}
                                        touched={touched.equipmentType}
                                        name="equipmentType"
                                        index="equipmentType"
                                    />
                                </div>
                            </Fragment>
                        ) : this.state.selectedItemType.value === 2 ? (
                            <Fragment>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">
                                        {Resources.days[currentLanguage]}
                                    </label>
                                    <div
                                        className={
                                            "inputDev ui input" +
                                            (errors.days && touched.days
                                                ? " has-error"
                                                : !errors.days && touched.days
                                                    ? " has-success"
                                                    : " ")
                                        }>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="itemCode"
                                            value={
                                                this.state.purchaseOrderItems
                                                    .days
                                            }
                                            placeholder={
                                                Resources.days[currentLanguage]
                                            }
                                            onChange={e =>
                                                this.handleChangeItems(
                                                    e,
                                                    "days"
                                                )
                                            }
                                            onBlur={e => {
                                                handleChange(e);
                                                handleBlur(e);
                                            }}
                                            name="days"
                                        />
                                        {errors.days && touched.days ? (
                                            <em className="pError">
                                                {errors.days}
                                            </em>
                                        ) : null}
                                    </div>
                                </div>
                            </Fragment>
                        ) : (
                                    ""
                                )}

                        <div className="linebylineInput valid-input">
                            <Dropdown
                                title="specsSection"
                                data={this.state.specssectionType}
                                selectedValue={this.state.selectedSpecssection}
                                handleChange={event => {
                                    this.handleChangeDropDownItems(
                                        event,
                                        "specsSectionId",
                                        false,
                                        "",
                                        "",
                                        "",
                                        "selectedSpecssection",
                                        ""
                                    );
                                }}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.specsSectionId}
                                touched={touched.specsSectionId}
                                name="specsSectionId"
                                index="specsSectionId"
                            />
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label">
                                {Resources.itemCode[currentLanguage]}
                            </label>
                            <div
                                className={
                                    "inputDev ui input" +
                                    (errors.itemCode && touched.itemCode
                                        ? " has-error"
                                        : !errors.itemCode && touched.itemCode
                                            ? " has-success"
                                            : " ")
                                }>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="itemCode"
                                    value={
                                        this.state.purchaseOrderItems.itemCode
                                    }
                                    placeholder={
                                        Resources.itemCode[currentLanguage]
                                    }
                                    onChange={e =>
                                        this.handleChangeItems(e, "itemCode")
                                    }
                                    onBlur={e => {
                                        handleChange(e);
                                        handleBlur(e);
                                    }}
                                    name="itemCode"
                                />
                                {errors.itemCode && touched.itemCode ? (
                                    <em className="pError">
                                        {errors.itemCode}
                                    </em>
                                ) : null}
                            </div>
                        </div>
                    </Fragment>
                ) : (
                        <Fragment>
                            <div className="proForm datepickerContainer letterFullWidth">
                                <div className="proForm datepickerContainer letterFullWidth">
                                    <div className="linebylineInput fullInputWidth">
                                        <label className="control-label">
                                            {Resources.details[currentLanguage]}
                                        </label>
                                        <div
                                            className={
                                                "inputDev ui input " +
                                                (errors.details
                                                    ? "has-error"
                                                    : !errors.details &&
                                                        touched.details
                                                        ? " has-success"
                                                        : " ")
                                            }>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="details"
                                                value={
                                                    this.state.purchaseOrderItems
                                                        .details
                                                }
                                                placeholder={
                                                    Resources.details[
                                                    currentLanguage
                                                    ]
                                                }
                                                onChange={e =>
                                                    this.handleChangeItems(
                                                        e,
                                                        "details"
                                                    )
                                                }
                                                onBlur={e => {
                                                    handleChange(e);
                                                    handleBlur(e);
                                                }}
                                                name="details"
                                            />
                                            {errors.details ? (
                                                <em className="pError">
                                                    {errors.details}
                                                </em>
                                            ) : null}
                                        </div>
                                    </div>
                                    <button
                                        className="primaryBtn-1 btn "
                                        type="submit"
                                        onClick={e =>
                                            this.renderFromInventory(
                                                this.state.viewDisription
                                            )
                                        }>
                                        {
                                            Resources["fromInventory"][
                                            currentLanguage
                                            ]
                                        }
                                    </button>
                                </div>

                                <div className="linebylineInput valid-input">
                                    <label className="control-label">
                                        {Resources.arrange[currentLanguage]}
                                    </label>
                                    <div className="ui input inputDev">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="arrange"
                                            readOnly
                                            value={
                                                this.state.purchaseOrderItems
                                                    .arrange
                                            }
                                            placeholder={
                                                Resources.arrange[currentLanguage]
                                            }
                                            onChange={e =>
                                                this.handleChangeItems(e, "arrange")
                                            }
                                            onBlur={e => {
                                                handleChange(e);
                                                handleBlur(e);
                                            }}
                                            name="arrange"
                                        />
                                    </div>
                                </div>

                                <div className="linebylineInput valid-input">
                                    <label className="control-label">
                                        {Resources.quantity[currentLanguage]}
                                    </label>
                                    <div
                                        className={
                                            "inputDev ui input" +
                                            (errors.quantity && touched.quantity
                                                ? " has-error"
                                                : !errors.quantity &&
                                                    touched.quantity
                                                    ? " has-success"
                                                    : " ")
                                        }>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="quantity"
                                            value={
                                                this.state.purchaseOrderItems
                                                    .quantity
                                            }
                                            placeholder={
                                                Resources.quantity[currentLanguage]
                                            }
                                            onChange={e =>
                                                this.handleChangeItems(
                                                    e,
                                                    "quantity"
                                                )
                                            }
                                            onBlur={e => {
                                                handleChange(e);
                                                handleBlur(e);
                                            }}
                                            name="quantity"
                                        />
                                        {errors.quantity && touched.quantity ? (
                                            <em className="pError">
                                                {errors.quantity}
                                            </em>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="unit"
                                        data={this.state.units}
                                        selectedValue={this.state.selectedUnit}
                                        handleChange={event => {
                                            this.handleChangeDropDownItems(
                                                event,
                                                "unit",
                                                false,
                                                "",
                                                "",
                                                "",
                                                "selectedUnit",
                                                ""
                                            );
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.unit}
                                        touched={touched.unit}
                                        name="unit"
                                        index="unit"
                                    />
                                </div>

                                <div className="linebylineInput valid-input">
                                    <label className="control-label">
                                        {Resources.unitPrice[currentLanguage]}
                                    </label>
                                    <div
                                        className={
                                            "inputDev ui input" +
                                            (errors.unitPrice && touched.unitPrice
                                                ? " has-error"
                                                : !errors.unitPrice &&
                                                    touched.unitPrice
                                                    ? " has-success"
                                                    : " ")
                                        }>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="unitPrice"
                                            value={
                                                this.state.purchaseOrderItems
                                                    .unitPrice
                                            }
                                            placeholder={
                                                Resources.unitPrice[currentLanguage]
                                            }
                                            onChange={e =>
                                                this.handleChangeItems(
                                                    e,
                                                    "unitPrice"
                                                )
                                            }
                                            onBlur={e => {
                                                handleChange(e);
                                                handleBlur(e);
                                            }}
                                            name="unitPrice"
                                        />
                                        {errors.unitPrice && touched.unitPrice ? (
                                            <em className="pError">
                                                {errors.unitPrice}
                                            </em>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="linebylineInput valid-input">
                                    <label className="control-label">
                                        {Resources.resourceCode[currentLanguage]}
                                    </label>
                                    <div
                                        className={
                                            "inputDev ui input" +
                                            (errors.resourceCode &&
                                                touched.resourceCode
                                                ? " has-error"
                                                : !errors.resourceCode &&
                                                    touched.resourceCode
                                                    ? " has-success"
                                                    : " ")
                                        }>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="resourceCode"
                                            value={
                                                this.state.purchaseOrderItems
                                                    .resourceCode
                                            }
                                            placeholder={
                                                Resources.resourceCode[
                                                currentLanguage
                                                ]
                                            }
                                            onChange={e =>
                                                this.handleChangeItems(
                                                    e,
                                                    "resourceCode"
                                                )
                                            }
                                            onBlur={e => {
                                                handleChange(e);
                                                handleBlur(e);
                                            }}
                                            name="resourceCode"
                                        />
                                        {errors.resourceCode &&
                                            touched.resourceCode ? (
                                                <em className="pError">
                                                    {errors.resourceCode}
                                                </em>
                                            ) : null}
                                    </div>
                                </div>

                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="itemType"
                                        data={this.state.itemType}
                                        selectedValue={this.state.selectedItemType}
                                        handleChange={event => {
                                            this.handleChangeDropDownItems(
                                                event,
                                                "itemType",
                                                false,
                                                "",
                                                "",
                                                "",
                                                "selectedItemType",
                                                ""
                                            );
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.itemType}
                                        touched={touched.itemType}
                                        name="itemType"
                                        index="itemType"
                                    />
                                </div>
                                {this.state.selectedItemType.value === 3 ? (
                                    <Fragment>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources.days[currentLanguage]}
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input" +
                                                    (errors.days && touched.days
                                                        ? " has-error"
                                                        : !errors.days &&
                                                            touched.days
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="days"
                                                    value={
                                                        this.state
                                                            .purchaseOrderItems.days
                                                    }
                                                    placeholder={
                                                        Resources.days[
                                                        currentLanguage
                                                        ]
                                                    }
                                                    onChange={e =>
                                                        this.handleChangeItems(
                                                            e,
                                                            "days"
                                                        )
                                                    }
                                                    onBlur={e => {
                                                        handleChange(e);
                                                        handleBlur(e);
                                                    }}
                                                    name="days"
                                                />
                                                {errors.days && touched.days ? (
                                                    <em className="pError">
                                                        {errors.days}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                title="equipmentType"
                                                data={this.state.equipmentType}
                                                selectedValue={
                                                    this.state.selectedEquipmentType
                                                }
                                                handleChange={event => {
                                                    this.handleChangeDropDownItems(
                                                        event,
                                                        "equipmenttypeId",
                                                        false,
                                                        "",
                                                        "",
                                                        "",
                                                        "selectedEquipmentType",
                                                        ""
                                                    );
                                                }}
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.equipmentType}
                                                touched={touched.equipmentType}
                                                name="equipmentType"
                                                index="equipmentType"
                                            />
                                        </div>
                                    </Fragment>
                                ) : this.state.selectedItemType.value === 2 ? (
                                    <Fragment>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources.days[currentLanguage]}
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input" +
                                                    (errors.days && touched.days
                                                        ? " has-error"
                                                        : !errors.days &&
                                                            touched.days
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="itemCode"
                                                    value={
                                                        this.state
                                                            .purchaseOrderItems.days
                                                    }
                                                    placeholder={
                                                        Resources.days[
                                                        currentLanguage
                                                        ]
                                                    }
                                                    onChange={e =>
                                                        this.handleChangeItems(
                                                            e,
                                                            "days"
                                                        )
                                                    }
                                                    onBlur={e => {
                                                        handleChange(e);
                                                        handleBlur(e);
                                                    }}
                                                    name="days"
                                                />
                                                {errors.days && touched.days ? (
                                                    <em className="pError">
                                                        {errors.days}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                    </Fragment>
                                ) : (
                                            ""
                                        )}
                                <div className="linebylineInput valid-input">
                                    <Dropdown
                                        title="specsSection"
                                        data={this.state.specssectionType}
                                        selectedValue={
                                            this.state.selectedSpecssection
                                        }
                                        handleChange={event => {
                                            this.handleChangeDropDownItems(
                                                event,
                                                "specsSectionId",
                                                false,
                                                "",
                                                "",
                                                "",
                                                "selectedSpecssection",
                                                ""
                                            );
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.specsSectionId}
                                        touched={touched.specsSectionId}
                                        name="specsSectionId"
                                        index="specsSectionId"
                                    />
                                </div>
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">
                                        {Resources.itemCode[currentLanguage]}
                                    </label>
                                    <div
                                        className={
                                            "inputDev ui input" +
                                            (errors.itemCode && touched.itemCode
                                                ? " has-error"
                                                : !errors.itemCode &&
                                                    touched.itemCode
                                                    ? " has-success"
                                                    : " ")
                                        }>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="itemCode"
                                            value={
                                                this.state.purchaseOrderItems
                                                    .itemCode
                                            }
                                            placeholder={
                                                Resources.itemCode[currentLanguage]
                                            }
                                            onChange={e =>
                                                this.handleChangeItems(
                                                    e,
                                                    "itemCode"
                                                )
                                            }
                                            onBlur={e => {
                                                handleChange(e);
                                                handleBlur(e);
                                            }}
                                            name="itemCode"
                                        />
                                        {errors.itemCode && touched.itemCode ? (
                                            <em className="pError">
                                                {errors.itemCode}
                                            </em>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )}

                <div className="step-content">
                    <XSLfile
                        key="POImport"
                        docId={this.state.docId}
                        docType="po"
                        link={
                            Config.getPublicConfiguartion().downloads +
                            "/Downloads/Excel/PO.xlsx"
                        }
                        header="items"
                        disabled={this.state.isViewMode}
                        afterUpload={() => this.getTabelData()}
                    />
                </div>
            </div>
        );
    };

    renderBOQItems = (
        errors,
        touched,
        values,
        handleBlur,
        handleChange,
        setFieldValue,
        setFieldTouched
    ) => {
        return (
            <div className="proForm datepickerContainer letterFullWidth">
                <div className="proForm datepickerContainer letterFullWidth">
                    <div className="linebylineInput valid-input">
                        <Dropdown
                            title="boq"
                            data={this.state.Boq}
                            selectedValue={this.state.selectedBoq}
                            handleChange={event => {
                                this.handleChangeDropDownItemsForBoq(
                                    event,
                                    "boqId",
                                    false,
                                    "",
                                    "",
                                    "",
                                    "selectedBoq",
                                    ""
                                );
                            }}
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                            error={errors.fromContract}
                            touched={touched.fromContract}
                            name="fromContract"
                            index="fromContract"
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
                                id="arrange"
                                readOnly
                                value={this.state.document.arrange}
                                placeholder={Resources.arrange[currentLanguage]}
                                onChange={e => this.handleChange(e, "arrange")}
                                onBlur={e => {
                                    handleChange(e);
                                    handleBlur(e);
                                }}
                                name="arrange"
                            />
                        </div>
                    </div>
                </div>

                <div className="linebylineInput valid-input">
                    <Dropdown
                        title={"specsSection"}
                        data={this.state.specssectionType}
                        selectedValue={this.state.selectedSpecssection}
                        handleChange={event => {
                            this.handleChangeDropDownItemsForBoq(
                                event,
                                "specsId",
                                false,
                                "",
                                "",
                                "",
                                "selectedSpecssection",
                                ""
                            );
                        }}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        error={errors.fromContract}
                        touched={touched.fromContract}
                        name="fromContract"
                        index="fromContract"
                    />
                </div>
            </div>
        );
    };

    renderFromInventory = viewDisription => {
        this.setState({
            viewDisription:
                this.state.viewDisription === 0
                    ? this.state.viewDisription + 1
                    : 0
        });
    };

    AddContractsOrderForPo = () => {
        this.setState({ isLoading: true });

        if (this.state.activeItems === 0) {
            let mainDoc = this.state.purchaseOrderItems;

            mainDoc.docId = this.state.docId;
            mainDoc.projectId = projectId;
            mainDoc.purchaseId = this.state.docId;

            dataservice
                .addObject("AddContractsOrderForPo", mainDoc)
                .then(result => {
                    let purchaseOrderItems = {
                        specsSectionId: "",
                        quantity: 1,
                        poQuantity: 0,
                        unit: "",
                        unitPrice: 1,
                        details: "",
                        arrange: mainDoc.arrange + 1,
                        resourceCode: "",
                        itemType: "",
                        equipmenttypeId: "",
                        orderType: "PurchaseOrder",
                        docId: "",
                        itemId: "",
                        action: "",
                        dueBack: moment(),
                        days: 1,
                        itemCode: ""
                    };

                    this.setState({
                        isLoading: false,
                        purchaseOrderDataItems: result != null ? result : [],
                        purchaseOrderItems: purchaseOrderItems,
                        selectedDescription: {
                            label:
                                Resources.descriptionRequired[currentLanguage],
                            value: "0"
                        },
                        selectedSpecssection: {
                            label:
                                Resources.specsSectionSelection[
                                currentLanguage
                                ],
                            value: "0"
                        },
                        selectedEquipmentType: {
                            label:
                                Resources.equipmentTypeSelection[
                                currentLanguage
                                ],
                            value: "0"
                        },
                        selectedItemType: {
                            label: Resources.itemTypeSelection[currentLanguage],
                            value: "0"
                        },
                        selectedUnit: {
                            label: Resources.unitSelection[currentLanguage],
                            value: "0"
                        }
                    });

                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                })
                .catch(ex => {
                    this.setState({
                        isLoading: false
                    });
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                            .successTitle
                    );
                });
        } else {
            dataservice
                .addObject(
                    "AddMultipleContractsOrderForPo?docId=" + this.state.docId,
                    this.state.itemBoq
                )
                .then(result => {
                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                    this.setState({
                        purchaseOrderDataItems: result,
                        isLoading: false
                    });
                })
                .catch(ex => {
                    this.setState({
                        isLoading: false
                    });
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                            .successTitle
                    );
                });
        }
    };

    DeleteItems = () => {
        let id = this.state.currentId;

        if (this.state.moduleTitle === "Items") {
            dataservice
                .GetDataGrid(
                    "ContractsOrdersItemsExcutionPoDelete?id=" +
                    this.state.currentId +
                    "&orderType=PurchaseOrder"
                )
                .then(result => {
                    this.setState({
                        purchaseOrderDataItems: result,
                        showDeleteModal: false
                    });
                })
                .catch(ex => {
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                            .successTitle
                    );
                });
        } else {
            dataservice
                .addObject(
                    "DeleteContractsPurchaseOrderTermsById?id=" +
                    this.state.currentId
                )
                .then(result => {
                    let originalData = this.state.termPurchaseOrderData;

                    let setIndex = originalData.findIndex(x => x.id === id);

                    originalData.splice(setIndex, 1);

                    this.setState({
                        termPurchaseOrderData: originalData,
                        showDeleteModal: false
                    });
                })
                .catch(ex => {
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                            .successTitle
                    );
                });
        }
    };

    addTermsPurchaseOrder = () => {
        this.setState({ isLoading: true });

        let mainDoc = this.state.purchaseOrderTerms;

        mainDoc.purchaseId = this.state.docId;

        dataservice
            .addObject("AddContractsPurchaseOrderTerms", mainDoc)
            .then(result => {
                toast.success(Resources["operationSuccess"][currentLanguage]);

                let main = { details: "", arrange: mainDoc.arrange + 1 };

                this.setState({
                    purchaseOrderTerms: main,
                    isLoading: false,
                    termPurchaseOrderData: result != null ? result : [],
                    selectedDescription: {
                        label: Resources.descriptionRequired[currentLanguage],
                        value: "0"
                    }
                });
            });
    };

    editItems = () => {
        this.setState({
            isLoading: true
        });

        if (this.state.activePopUpItems === 2) {
            let itemDocument = this.state.purchaseOrderItems;

            itemDocument.dueBack = moment(
                itemDocument.dueBack,
                "YYYY-MM-DD"
            ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");

            dataservice
                .addObject("EditContractsOrdersItemsExcutionPos", itemDocument)
                .then(result => {
                    this.setState({
                        isLoading: false,
                        showModalForEdit: false,
                        purchaseOrderDataItems: result
                    });

                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                });
        } else {
            let mainDoc = this.state.purchaseOrderItems;

            mainDoc.docId = this.state.docId;
            mainDoc.projectId = projectId;
            mainDoc.purchaseId = this.state.docId;

            dataservice
                .addObject("AddContractsOrderForPo", mainDoc)
                .then(result => {
                    let purchaseOrderItems = {
                        specsSectionId: "",
                        quantity: 1,
                        poQuantity: 0,
                        unit: "",
                        unitPrice: 1,
                        details: "",
                        arrange: mainDoc.arrange + 1,
                        resourceCode: "",
                        itemType: "",
                        equipmenttypeId: "",
                        orderType: "PurchaseOrder",
                        docId: "",
                        itemId: "",
                        action: "",
                        dueBack: moment(),
                        days: 1,
                        itemCode: ""
                    };

                    this.setState({
                        purchaseOrderDataItems: result,
                        isLoading: false,
                        showModalForEdit: false,
                        purchaseOrderDataItems: result != null ? result : [],
                        purchaseOrderItems: purchaseOrderItems,
                        selectedDescription: {
                            label:
                                Resources.descriptionRequired[currentLanguage],
                            value: "0"
                        },
                        selectedSpecssection: {
                            label:
                                Resources.specsSectionSelection[
                                currentLanguage
                                ],
                            value: "0"
                        },
                        selectedEquipmentType: {
                            label:
                                Resources.equipmentTypeSelection[
                                currentLanguage
                                ],
                            value: "0"
                        },
                        selectedItemType: {
                            label: Resources.itemTypeSelection[currentLanguage],
                            value: "0"
                        },
                        selectedUnit: {
                            label: Resources.unitSelection[currentLanguage],
                            value: "0"
                        }
                    });

                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                })
                .catch(ex => {
                    this.setState({
                        isLoading: false
                    });
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                            .successTitle
                    );
                });
        }
    };

    _component = () => {
        return (
            <div className="ui modal largeModal ">
                <Formik
                    initialValues={{ ...this.state.purchaseOrderItems }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchemaForEditItems}
                    onSubmit={values => {
                        this.editItems();
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
                            <Form className="dropWrapper" onSubmit={handleSubmit}>
                                <div className=" proForm customProform">
                                    <div className="fillter-status fillter-item-c">
                                        <label className="control-label">
                                            {
                                                Resources["description"][
                                                currentLanguage
                                                ]
                                            }
                                        </label>
                                        <div
                                            className={
                                                "inputDev ui input " +
                                                (errors.details
                                                    ? "has-error"
                                                    : !errors.details &&
                                                        touched.details
                                                        ? " has-success"
                                                        : " ")
                                            }>
                                            <input
                                                name="details"
                                                className="form-control fsadfsadsa"
                                                id="details"
                                                placeholder={
                                                    Resources.description[
                                                    currentLanguage
                                                    ]
                                                }
                                                autoComplete="off"
                                                value={
                                                    this.state.purchaseOrderItems
                                                        .details
                                                }
                                                onBlur={e => {
                                                    handleBlur(e);
                                                    handleChange(e);
                                                }}
                                                onChange={e =>
                                                    this.handleChangeItems(
                                                        e,
                                                        "details"
                                                    )
                                                }
                                            />
                                            {errors.details && touched.details ? (
                                                <em className="pError">
                                                    {errors.details}
                                                </em>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="fillter-status fillter-item-c">
                                        <label className="control-label">
                                            {Resources.arrange[currentLanguage]}
                                        </label>
                                        <div className="ui input inputDev">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="arrange"
                                                readOnly
                                                value={this.state.document.arrange}
                                                placeholder={
                                                    Resources.arrange[
                                                    currentLanguage
                                                    ]
                                                }
                                                onChange={e =>
                                                    this.handleChangeItems(
                                                        e,
                                                        "arrange"
                                                    )
                                                }
                                                onBlur={e => {
                                                    handleChange(e);
                                                    handleBlur(e);
                                                }}
                                                name="arrange"
                                            />
                                        </div>
                                    </div>

                                    <Dropdown
                                        title="specsSection"
                                        data={this.state.specssectionType}
                                        selectedValue={
                                            this.state.selectedSpecssection
                                        }
                                        handleChange={event => {
                                            this.handleChangeDropDownItems(
                                                event,
                                                "specsSectionId",
                                                false,
                                                "",
                                                "",
                                                "",
                                                "selectedSpecssection",
                                                ""
                                            );
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.specsSectionId}
                                        touched={touched.specsSectionId}
                                        name="specsSectionId"
                                        index="specsSectionId"
                                    />

                                    <div className="fillter-status fillter-item-c">
                                        <label className="control-label">
                                            {Resources.unit[currentLanguage]}
                                        </label>
                                        <div
                                            className={
                                                "inputDev ui input " +
                                                (errors.unit
                                                    ? "has-error"
                                                    : !errors.unit && touched.unit
                                                        ? " has-success"
                                                        : " ")
                                            }>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="unit"
                                                value={
                                                    this.state.purchaseOrderItems
                                                        .unit
                                                }
                                                placeholder={
                                                    Resources.unit[currentLanguage]
                                                }
                                                onChange={e =>
                                                    this.handleChangeItems(
                                                        e,
                                                        "unit"
                                                    )
                                                }
                                                onBlur={e => {
                                                    handleChange(e);
                                                    handleBlur(e);
                                                }}
                                                name="unit"
                                            />
                                            {errors.unit && touched.unit ? (
                                                <em className="pError">
                                                    {errors.unit}
                                                </em>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="fillter-status fillter-item-c">
                                        <label className="control-label">
                                            {
                                                Resources.resourceCode[
                                                currentLanguage
                                                ]
                                            }
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
                                                type="text"
                                                className="form-control"
                                                id="resourceCode"
                                                value={
                                                    this.state.purchaseOrderItems
                                                        .resourceCode
                                                }
                                                placeholder={
                                                    Resources.resourceCode[
                                                    currentLanguage
                                                    ]
                                                }
                                                onChange={e =>
                                                    this.handleChangeItems(
                                                        e,
                                                        "resourceCode"
                                                    )
                                                }
                                                onBlur={e => {
                                                    handleChange(e);
                                                    handleBlur(e);
                                                }}
                                                name="resourceCode"
                                            />
                                            {errors.resourceCode &&
                                                touched.resourceCode ? (
                                                    <em className="pError">
                                                        {errors.resourceCode}
                                                    </em>
                                                ) : null}
                                        </div>
                                    </div>

                                    <Dropdown
                                        title="equipmentType"
                                        data={this.state.equipmentType}
                                        selectedValue={
                                            this.state.selectedEquipmentType
                                        }
                                        handleChange={event => {
                                            this.handleChangeDropDownItems(
                                                event,
                                                "equipmenttypeId",
                                                false,
                                                "",
                                                "",
                                                "",
                                                "selectedEquipmentType",
                                                ""
                                            );
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.equipmentType}
                                        touched={touched.equipmentType}
                                        name="equipmentType"
                                        index="equipmentType"
                                    />

                                    <div className="fillter-status fillter-item-c">
                                        <label className="control-label">
                                            {Resources.quantity[currentLanguage]}
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
                                                type="text"
                                                className="form-control"
                                                id="quantity"
                                                value={
                                                    this.state.purchaseOrderItems
                                                        .quantity
                                                }
                                                placeholder={
                                                    Resources.quantity[
                                                    currentLanguage
                                                    ]
                                                }
                                                onChange={e =>
                                                    this.handleChangeItems(
                                                        e,
                                                        "quantity"
                                                    )
                                                }
                                                onBlur={e => {
                                                    handleChange(e);
                                                    handleBlur(e);
                                                }}
                                                name="quantity"
                                            />
                                            {errors.quantity && touched.quantity ? (
                                                <em className="pError">
                                                    {errors.quantity}
                                                </em>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="fillter-status fillter-item-c">
                                        <label className="control-label">
                                            {Resources.unitPrice[currentLanguage]}
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
                                                type="text"
                                                className="form-control"
                                                id="unitPrice"
                                                value={
                                                    this.state.purchaseOrderItems
                                                        .unitPrice
                                                }
                                                placeholder={
                                                    Resources.unitPrice[
                                                    currentLanguage
                                                    ]
                                                }
                                                onChange={e =>
                                                    this.handleChangeItems(
                                                        e,
                                                        "unitPrice"
                                                    )
                                                }
                                                onBlur={e => {
                                                    handleChange(e);
                                                    handleBlur(e);
                                                }}
                                                name="unitPrice"
                                            />
                                            {errors.unitPrice &&
                                                touched.unitPrice ? (
                                                    <em className="pError">
                                                        {errors.unitPrice}
                                                    </em>
                                                ) : null}
                                        </div>
                                    </div>

                                    <div className="fillter-status fillter-item-c">
                                        <label className="control-label">
                                            {Resources.days[currentLanguage]}
                                        </label>
                                        <div className="ui input inputDev">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="days"
                                                value={
                                                    this.state.purchaseOrderItems
                                                        .days
                                                }
                                                placeholder={
                                                    Resources.days[currentLanguage]
                                                }
                                                onChange={e =>
                                                    this.handleChangeItems(
                                                        e,
                                                        "days"
                                                    )
                                                }
                                                onBlur={e => {
                                                    handleChange(e);
                                                    handleBlur(e);
                                                }}
                                                name="days"
                                            />
                                        </div>
                                    </div>
                                    <DatePicker
                                        title="dueBack"
                                        startDate={
                                            this.state.purchaseOrderItems.dueBack
                                        }
                                        handleChange={e =>
                                            this.handleChangeDate(e, "dueBack")
                                        }
                                    />

                                    <div className="slider-Btns fullWidthWrapper">
                                        {this.state.isLoading === false ? (
                                            <button
                                                className="primaryBtn-1 btn meduimBtn"
                                                type="submit">
                                                {
                                                    Resources["goEdit"][
                                                    currentLanguage
                                                    ]
                                                }
                                            </button>
                                        ) : (
                                                <button className="primaryBtn-1 btn disabled">
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button>
                                            )}
                                    </div>
                                </div>
                            </Form>
                        )}
                </Formik>
            </div>
        );
    };

    renderEditable(cellInfo) {
        return (
            <div
                style={{
                    color: "#4382f9 ",
                    padding: "0px 6px",
                    margin: "5px 0px",
                    border: "1px dashed",
                    cursor: "pointer"
                }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const item = this.state.itemBoq;
                    const BoqData = [...this.state.BoqData];
                    BoqData[cellInfo.index][cellInfo.column.id] =
                        e.target.innerHTML;
                    item.push(BoqData[cellInfo.index]);
                    this.setState({ BoqData, itemBoq: item });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.BoqData[cellInfo.index][
                        cellInfo.column.id
                    ]
                }}
            />
        );
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }
    render() {

        let columnsItemView = [
            {
                Header: Resources["numberAbb"][currentLanguage],
                accessor: "arrange",
                sortabel: true,
                width: 80
            },
            {
                Header: Resources["description"][currentLanguage],
                accessor: "details",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["unit"][currentLanguage],
                accessor: "unit",
                width: 200
            },
            {
                Header: Resources["quantity"][currentLanguage],
                accessor: "quantity",
                width: 200
            },
            {
                Header: Resources["unitPrice"][currentLanguage],
                accessor: "unitPrice",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["total"][currentLanguage],
                accessor: "total",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["resourceCode"][currentLanguage],
                accessor: "resourceCode",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["itemCode"][currentLanguage],
                accessor: "itemCode",
                width: 200,
                sortabel: true
            }
        ];

        let columnsBoq = [
            {
                Header: Resources["goEdit"][currentLanguage],
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <div
                            className="btn table-btn-tooltip"
                            style={{ marginLeft: "5px" }}
                            onClick={() => this.ViewEditItems(row, 1)}>
                            <i
                                style={{ fontSize: "1.6em" }}
                                className="fa fa-pencil-square-o"
                            />
                        </div>
                    );
                },
                width: 70
            },
            {
                Header: Resources["numberAbb"][currentLanguage],
                accessor: "arrange",
                sortabel: true,
                width: 80
            },

            {
                Header: Resources["description"][currentLanguage],
                accessor: "details",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["quantity"][currentLanguage],
                accessor: "quantity",
                width: 100
            },

            {
                Header: Resources["unitPrice"][currentLanguage],
                accessor: "unitPrice",
                width: 100,
                sortabel: true
            },
            {
                Header: Resources["resourceCode"][currentLanguage],
                accessor: "resourceCode",
                width: 200,
                sortabel: true
            },
            {
                Header: Resources["poQuantity"][currentLanguage],
                accessor: "poQuantity",
                width: 100,
                Cell: this.renderEditable.bind(this)
            },
            {
                Header: Resources["itemCode"][currentLanguage],
                accessor: "itemCode",
                width: 200,
                sortabel: true
            }
        ];

        let columnsTerms = [
            {
                Header: Resources["arrange"][currentLanguage],
                accessor: "arrange",
                sortabel: true,
                width: 80
            },
            {
                Header: Resources["delete"][currentLanguage],
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <div
                            className="btn table-btn-tooltip"
                            style={{ marginLeft: "5px" }}
                            onClick={() => this.ConfirmDelete(row.id, "terms")}>
                            <i
                                style={{ fontSize: "1.6em" }}
                                className="fa fa-trash-o"
                            />
                        </div>
                    );
                },
                width: 70
            },
            {
                Header: Resources["description"][currentLanguage],
                accessor: "details",
                width: 200,
                sortabel: true
            }
        ];

        let FirstStepMainDocument = () => {
            return (
                <Fragment>
                    <Formik
                        initialValues={{ ...this.state.document }}
                        enableReinitialize={true}
                        validationSchema={validationSchemaForMainDocument}
                        onSubmit={(values, actions) => {
                            this.AddEditPurchaseOrder(values, actions);
                        }}>
                        {({
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            values,
                            handleSubmit,
                            setFieldValue,
                            setFieldTouched
                        }) => (
                                <Form onSubmit={handleSubmit}>
                                    <div className="document-fields">
                                        <div className="proForm first-proform">
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">
                                                    {
                                                        Resources.subject[
                                                        currentLanguage
                                                        ]
                                                    }
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
                                                            this.state.document
                                                                .subject
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
                                                    />
                                                    {touched.subject ? (
                                                        <em className="pError">
                                                            {errors.subject}
                                                        </em>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">
                                                    {
                                                        Resources.status[
                                                        currentLanguage
                                                        ]
                                                    }
                                                </label>
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        onBlur={e =>
                                                            this.handleChange(
                                                                e,
                                                                "status"
                                                            )
                                                        }
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
                                                        name="status"
                                                        defaultChecked={
                                                            this.state.document
                                                                .status === false
                                                                ? "checked"
                                                                : null
                                                        }
                                                        onBlur={e =>
                                                            this.handleChange(
                                                                e,
                                                                "status"
                                                            )
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
                                            <div className="linebylineInput fullInputWidth">
                                                <label className="control-label">
                                                    {
                                                        Resources.refDoc[
                                                        currentLanguage
                                                        ]
                                                    }
                                                </label>
                                                <div
                                                    className={
                                                        "inputDev ui input" +
                                                        (errors.refDoc &&
                                                            touched.refDoc
                                                            ? " has-error"
                                                            : !errors.refDoc &&
                                                                touched.refDoc
                                                                ? " has-success"
                                                                : " ")
                                                    }>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="refDoc"
                                                        value={
                                                            this.state.document
                                                                .refDoc
                                                        }
                                                        placeholder={
                                                            Resources.refDoc[
                                                            currentLanguage
                                                            ]
                                                        }
                                                        onChange={e =>
                                                            this.handleChange(
                                                                e,
                                                                "refDoc"
                                                            )
                                                        }
                                                        onBlur={e => {
                                                            handleChange(e);
                                                            handleBlur(e);
                                                        }}
                                                        name="refDoc"
                                                    />
                                                    {touched.refDoc ? (
                                                        <em className="pError">
                                                            {errors.refDoc}
                                                        </em>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">
                                                    {
                                                        Resources.arrange[
                                                        currentLanguage
                                                        ]
                                                    }
                                                </label>
                                                <div className="ui input inputDev">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="arrange"
                                                        readOnly
                                                        value={
                                                            this.state.document
                                                                .arrange
                                                        }
                                                        placeholder={
                                                            Resources.arrange[
                                                            currentLanguage
                                                            ]
                                                        }
                                                        onChange={e =>
                                                            this.handleChange(
                                                                e,
                                                                "arrange"
                                                            )
                                                        }
                                                        onBlur={e => {
                                                            handleChange(e);
                                                            handleBlur(e);
                                                        }}
                                                        name="arrange"
                                                    />
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">
                                                    {
                                                        Resources
                                                            .advancePaymentPercent[
                                                        currentLanguage
                                                        ]
                                                    }
                                                </label>
                                                <div
                                                    className={
                                                        "inputDev ui input" +
                                                        (errors.advancePaymentPercent &&
                                                            touched.advancePaymentPercent
                                                            ? " has-error"
                                                            : !errors.advancePaymentPercent &&
                                                                touched.advancePaymentPercent
                                                                ? " has-success"
                                                                : " ")
                                                    }>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="advancePaymentPercent"
                                                        value={
                                                            this.state.document
                                                                .advancePaymentPercent
                                                        }
                                                        placeholder={
                                                            Resources
                                                                .advancePaymentPercent[
                                                            currentLanguage
                                                            ]
                                                        }
                                                        onChange={e =>
                                                            this.handleChange(
                                                                e,
                                                                "advancePaymentPercent"
                                                            )
                                                        }
                                                        onBlur={e => {
                                                            handleChange(e);
                                                            handleBlur(e);
                                                        }}
                                                        name="advancePaymentPercent"
                                                    />
                                                    {errors.advancePaymentPercent &&
                                                        touched.advancePaymentPercent ? (
                                                            <em className="pError">
                                                                {
                                                                    errors.advancePaymentPercent
                                                                }
                                                            </em>
                                                        ) : null}
                                                </div>
                                            </div>

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

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker
                                                    title="completionDate"
                                                    startDate={
                                                        this.state.document
                                                            .completionDate
                                                    }
                                                    handleChange={e =>
                                                        this.handleChangeDate(
                                                            e,
                                                            "completionDate"
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="linebylineInput valid-input mix_dropdown">
                                                <label className="control-label">
                                                    {
                                                        Resources.fromCompany[
                                                        currentLanguage
                                                        ]
                                                    }
                                                </label>
                                                <div className="supervisor__company">
                                                    <div className="super_name">
                                                        <Dropdown
                                                            data={
                                                                this.state.companies
                                                            }
                                                            isMulti={false}
                                                            selectedValue={
                                                                this.state
                                                                    .selectedFromCompany
                                                            }
                                                            handleChange={event => {
                                                                this.handleChangeDropDown(
                                                                    event,
                                                                    "companyId",
                                                                    true,
                                                                    "contacts",
                                                                    "GetContactsByCompanyId",
                                                                    "companyId",
                                                                    "selectedFromCompany",
                                                                    "selectedFromContact"
                                                                );
                                                            }}
                                                            onChange={setFieldValue}
                                                            onBlur={setFieldTouched}
                                                            error={errors.companyId}
                                                            touched={
                                                                touched.companyId
                                                            }
                                                            index="companyId"
                                                            name="companyId"
                                                            id="companyId"
                                                            styles={CompanyDropdown} classDrop="companyName1 "
                                                        />
                                                    </div>
                                                    <div className="super_company">
                                                        <Dropdown
                                                            data={
                                                                this.state.contacts
                                                            }
                                                            selectedValue={
                                                                this.state
                                                                    .selectedToContact
                                                            }
                                                            handleChange={event =>
                                                                this.handleChangeDropDown(
                                                                    event,
                                                                    "toContactId",
                                                                    false,
                                                                    "",
                                                                    "",
                                                                    "",
                                                                    "selectedToContact"
                                                                )
                                                            }
                                                            onChange={setFieldValue}
                                                            onBlur={setFieldTouched}
                                                            error={
                                                                errors.toContactId
                                                            }
                                                            touched={
                                                                touched.toContactId
                                                            }
                                                            index="letter-toContactId"
                                                            name="toContactId"
                                                            id="toContactId"
                                                            classDrop=" contactName1" styles={ContactDropdown}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown
                                                    data={this.state.companies}
                                                    selectedValue={
                                                        this.state.selectedToCompany
                                                    }
                                                    handleChange={event =>
                                                        this.handleChangeDropDown(
                                                            event,
                                                            "toCompanyId",
                                                            false,
                                                            "",
                                                            "",
                                                            "",
                                                            "selectedToCompany"
                                                        )
                                                    }
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    title="toCompany"
                                                    error={errors.toCompanyId}
                                                    touched={touched.toCompanyId}
                                                    index="IR-toCompanyId"
                                                    name="toCompanyId"
                                                    id="toCompanyId"
                                                />
                                            </div>
                                            <div className="letterFullWidth">
                                                <label className="control-label">
                                                    {
                                                        Resources.message[
                                                        currentLanguage
                                                        ]
                                                    }
                                                </label>
                                                <div className="inputDev ui input">
                                                    <TextEditor
                                                        value={this.state.message}
                                                        onChange={
                                                            this.onChangeMessage
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="doc-pre-cycle">
                                        <div className="slider-Btns">
                                            {this.state.isLoading === false ? (
                                                this.showBtnsSaving()
                                            ) : (
                                                    <button className="primaryBtn-1 btn disabled">
                                                        <div className="spinner">
                                                            <div className="bounce1" />
                                                            <div className="bounce2" />
                                                            <div className="bounce3" />
                                                        </div>
                                                    </button>
                                                )}
                                        </div>
                                    </div>

                                    {this.props.changeStatus === true ? (
                                        <Fragment>
                                            <ReactTable
                                                data={
                                                    this.state
                                                        .purchaseOrderDataItems
                                                }
                                                columns={columnsItemView}
                                                defaultPageSize={5}
                                                noDataText={
                                                    Resources["noData"][
                                                    currentLanguage
                                                    ]
                                                }
                                                className="-striped -highlight"
                                            />
                                            <div className="document-fields">
                                                <header className="main__header">
                                                    <div className="main__header--div">
                                                        <h2 className="zero">
                                                            {
                                                                Resources[
                                                                "docDetails"
                                                                ][currentLanguage]
                                                            }
                                                        </h2>
                                                    </div>
                                                </header>
                                                <div className="proForm datepickerContainer">
                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">
                                                            {
                                                                Resources
                                                                    .originalPurchaseOrderSum[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="originalContractSum"
                                                                readOnly
                                                                defaultValue={
                                                                    this.state
                                                                        .document
                                                                        .originalContractSum
                                                                }
                                                                name="originalContractSum"
                                                                placeholder={
                                                                    Resources
                                                                        .originalContractSum[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">
                                                            {
                                                                Resources
                                                                    .revisedPoSumToDate[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="revisedContractSumToDate"
                                                                readOnly
                                                                defaultValue={
                                                                    this.state
                                                                        .document
                                                                        .revisedContractSumToDate
                                                                }
                                                                name="revisedContractSumToDate"
                                                                placeholder={
                                                                    Resources
                                                                        .revisedContractSumToDate[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">
                                                            {
                                                                Resources
                                                                    .poExecutedToDate[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="contractExecutedToDate"
                                                                readOnly
                                                                defaultValue={
                                                                    this.state
                                                                        .document
                                                                        .contractExecutedToDate
                                                                }
                                                                name="contractExecutedToDate"
                                                                placeholder={
                                                                    Resources
                                                                        .contractExecutedToDate[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">
                                                            {
                                                                Resources.balance[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="balance"
                                                                readOnly
                                                                defaultValue={
                                                                    this.state
                                                                        .document
                                                                        .balanceToFinish
                                                                }
                                                                name="balance"
                                                                placeholder={
                                                                    Resources
                                                                        .balance[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    ) : null}
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId > 0 &&
                                                this.state.isViewMode === false &&
                                                this.state.CurrStep === 1 ? (
                                                    <UploadAttachment
                                                        changeStatus={
                                                            this.props.changeStatus
                                                        }
                                                        AddAttachments={883}
                                                        EditAttachments={3261}
                                                        ShowDropBox={3581}
                                                        ShowGoogleDrive={3582}
                                                        docTypeId={this.state.docTypeId}
                                                        docId={this.state.docId}
                                                        projectId={this.state.projectId}
                                                    />
                                                ) : null}
                                            {this.state.CurrStep === 1
                                                ? this.viewAttachments()
                                                : null}
                                            {this.props.changeStatus === true ? (
                                                <ViewWorkFlow
                                                    docType={this.state.docTypeId}
                                                    docId={this.state.docId}
                                                    projectId={this.state.projectId}
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                </Form>
                            )}
                    </Formik>
                </Fragment>
            );
        };

        let SecondStepItems = () => {
            return (
                <Fragment>
                    <div className="document-fields">
                        <Formik
                            enableReinitialize={true}
                            initialValues={{ ...this.state.purchaseOrderItems }}
                            validationSchema={
                                this.state.activeItems == 0
                                    ? this.state.viewDisription === 0
                                        ? ValidtionSchemaForNewItems
                                        : ValidtionSchemaForInventoryItems
                                    : ""
                            }
                            onSubmit={values => {
                                this.AddContractsOrderForPo();
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
                                        id="signupForm1"
                                        className="proForm datepickerContainer customProform"
                                        noValidate="novalidate">
                                        <header className="main__header">
                                            <div className="main__header--div">
                                                <h2 className="zero">
                                                    {
                                                        Resources["items"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                </h2>
                                            </div>
                                        </header>
                                        <div className="proForm first-proform letterFullWidth radio__only">
                                            <div className="linebylineInput valid-input">
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        defaultChecked={
                                                            values.status === false
                                                                ? null
                                                                : "checked"
                                                        }
                                                        value="true"
                                                        onChange={e =>
                                                            this.setState({
                                                                activeItems: 0
                                                            })
                                                        }
                                                    />
                                                    <label>
                                                        {
                                                            Resources.normal[
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </label>
                                                </div>
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        defaultChecked={
                                                            values.status === false
                                                                ? "checked"
                                                                : null
                                                        }
                                                        value="false"
                                                        onChange={e =>
                                                            this.setState({
                                                                activeItems: 1
                                                            })
                                                        }
                                                    />
                                                    <label>
                                                        {
                                                            Resources.fromBOQ[
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {this.state.activeItems == 0
                                            ? this.renderNormalItems(
                                                errors,
                                                touched,
                                                values,
                                                handleBlur,
                                                handleChange,
                                                setFieldValue,
                                                setFieldTouched
                                            )
                                            : this.renderBOQItems(
                                                errors,
                                                touched,
                                                values,
                                                handleBlur,
                                                handleChange,
                                                setFieldValue,
                                                setFieldTouched
                                            )}
                                        {this.state.activeItems == 1 ? (
                                            <Fragment>
                                                <header className="main__header">
                                                    <div className="main__header--div">
                                                        <h2 className="zero">
                                                            {
                                                                Resources[
                                                                "boqList"
                                                                ][currentLanguage]
                                                            }
                                                        </h2>
                                                    </div>
                                                </header>
                                                <ReactTable
                                                    data={this.state.BoqData}
                                                    columns={columnsBoq}
                                                    defaultPageSize={5}
                                                    noDataText={
                                                        Resources["noData"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                    className="-striped -highlight"
                                                />
                                            </Fragment>
                                        ) : null}
                                        <Fragment>
                                            <header className="main__header">
                                                <div className="main__header--div">
                                                    <h2 className="zero">
                                                        {
                                                            Resources["items"][
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </h2>
                                                </div>
                                            </header>
                                            <ReactTable
                                                data={
                                                    this.state
                                                        .purchaseOrderDataItems
                                                }
                                                columns={this.state.columns}
                                                defaultPageSize={5}
                                                noDataText={
                                                    Resources["noData"][
                                                    currentLanguage
                                                    ]
                                                }
                                                className="-striped -highlight"
                                            />
                                        </Fragment>
                                        <div
                                            className={
                                                "slider-Btns fullWidthWrapper textLeft "
                                            }>
                                            {this.state.isLoading === false ? (
                                                <button
                                                    className={
                                                        "primaryBtn-1 btn " +
                                                        (this.props.isViewMode ===
                                                            true
                                                            ? "disNone"
                                                            : "")
                                                    }
                                                    type="submit"
                                                    disabled={
                                                        this.state.isViewMode
                                                    }>
                                                    {
                                                        Resources["add"][
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
                                    </Form>
                                )}
                        </Formik>
                    </div>
                </Fragment>
            );
        };

        let ThirdStepTerms = () => {
            return (
                <Fragment>
                    <div className="document-fields">
                        <Formik
                            enableReinitialize={true}
                            initialValues={{
                                ...this.state.purchaseOrderTerms
                            }}
                            validationSchema={
                                ValidtionSchemaForTermsPurchaseOrder
                            }
                            onSubmit={values => {
                                this.addTermsPurchaseOrder();
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
                                        id="signupForm1"
                                        className="proForm datepickerContainer customProform"
                                        noValidate="novalidate">
                                        <header className="main__header">
                                            <div className="main__header--div">
                                                <h2 className="zero">
                                                    {
                                                        Resources[
                                                        "termsOfPurchaseOrder"
                                                        ][currentLanguage]
                                                    }
                                                </h2>
                                            </div>
                                        </header>
                                        <div className="proForm first-proform letterFullWidth radio__only">
                                            <div className="linebylineInput valid-input">
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input
                                                        type="radio"
                                                        name="statusTermsPO"
                                                        defaultChecked={
                                                            values.statusTermsPO ===
                                                                false
                                                                ? null
                                                                : "checked"
                                                        }
                                                        value="true"
                                                        onChange={e =>
                                                            this.setState({
                                                                activeTermsPO: 0
                                                            })
                                                        }
                                                    />
                                                    <label>
                                                        {
                                                            Resources.newTerm[
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </label>
                                                </div>
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input
                                                        type="radio"
                                                        name="statusTermsPO"
                                                        defaultChecked={
                                                            values.statusTermsPO ===
                                                                false
                                                                ? "checked"
                                                                : null
                                                        }
                                                        value="false"
                                                        onChange={e =>
                                                            this.setState({
                                                                activeTermsPO: 1
                                                            })
                                                        }
                                                    />
                                                    <label>
                                                        {
                                                            Resources.templateTerm[
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {this.state.activeTermsPO == 0 ? (
                                            <div className="proForm datepickerContainer letterFullWidth">
                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">
                                                        {
                                                            Resources.newTerm[
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </label>
                                                    <div
                                                        className={
                                                            "inputDev ui input" +
                                                            (errors.details &&
                                                                touched.details
                                                                ? " has-error"
                                                                : !errors.details &&
                                                                    touched.details
                                                                    ? " has-success"
                                                                    : " ")
                                                        }>
                                                        <input
                                                            name="details"
                                                            className="form-control fsadfsadsa"
                                                            id="details"
                                                            placeholder={
                                                                Resources.newTerm[
                                                                currentLanguage
                                                                ]
                                                            }
                                                            value={
                                                                this.state
                                                                    .purchaseOrderTerms
                                                                    .details
                                                            }
                                                            autoComplete="off"
                                                            onChange={e =>
                                                                this.handleChangeTerms(
                                                                    e,
                                                                    "details"
                                                                )
                                                            }
                                                            onBlur={e => {
                                                                handleBlur(e);
                                                                handleChange(e);
                                                            }}
                                                        />
                                                        {touched.details ? (
                                                            <em className="pError">
                                                                {errors.details}
                                                            </em>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">
                                                        {
                                                            Resources.arrange[
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </label>
                                                    <div className="ui input inputDev">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="arrange"
                                                            readOnly
                                                            value={
                                                                this.state
                                                                    .purchaseOrderTerms
                                                                    .arrange
                                                            }
                                                            placeholder={
                                                                Resources.arrange[
                                                                currentLanguage
                                                                ]
                                                            }
                                                            onChange={e =>
                                                                this.handleChangeTerms(
                                                                    e,
                                                                    "arrange"
                                                                )
                                                            }
                                                            onBlur={e => {
                                                                handleChange(e);
                                                                handleBlur(e);
                                                            }}
                                                            name="arrange"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                                <div className="proForm datepickerContainer letterFullWidth">
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown
                                                            title="terms"
                                                            data={
                                                                this.state.descriptions
                                                            }
                                                            selectedValue={
                                                                this.state
                                                                    .selectedDescription
                                                            }
                                                            handleChange={event => {
                                                                this.handleChangeDropDownTerms(
                                                                    event,
                                                                    "details",
                                                                    false,
                                                                    "",
                                                                    "",
                                                                    "",
                                                                    "selectedDescription",
                                                                    ""
                                                                );
                                                            }}
                                                            onChange={setFieldValue}
                                                            onBlur={setFieldTouched}
                                                            error={errors.details}
                                                            touched={touched.details}
                                                            name="details"
                                                            index="details"
                                                        />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">
                                                            {
                                                                Resources.arrange[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="arrange"
                                                                readOnly
                                                                value={
                                                                    this.state
                                                                        .purchaseOrderTerms
                                                                        .arrange
                                                                }
                                                                placeholder={
                                                                    Resources.arrange[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                                onChange={e =>
                                                                    this.handleChangeTerms(
                                                                        e,
                                                                        "arrange"
                                                                    )
                                                                }
                                                                onBlur={e => {
                                                                    handleChange(e);
                                                                    handleBlur(e);
                                                                }}
                                                                name="arrange"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        <div
                                            className={
                                                "slider-Btns fullWidthWrapper textLeft "
                                            }>
                                            {this.state.isLoading === false ? (
                                                <button
                                                    className={
                                                        "primaryBtn-1 btn " +
                                                        (this.props.isViewMode ===
                                                            true
                                                            ? "disNone"
                                                            : "")
                                                    }
                                                    type="submit"
                                                    disabled={
                                                        this.state.isViewMode
                                                    }>
                                                    {
                                                        Resources["add"][
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
                                    </Form>
                                )}
                        </Formik>

                        <header className="main__header">
                            <div className="main__header--div">
                                <h2 className="zero">
                                    {Resources["termList"][currentLanguage]}
                                </h2>
                            </div>
                        </header>
                        <ReactTable
                            data={this.state.termPurchaseOrderData}
                            columns={columnsTerms}
                            defaultPageSize={5}
                            noDataText={Resources["noData"][currentLanguage]}
                            className="-striped -highlight"
                        />
                    </div>
                </Fragment>
            );
        };

        let FouthStepSchedule = () => {
            return (
                <Schedule
                    ApiGet={
                        "GetContractsPurchaseOrderScheduleItemssByPurchaseId?projectId=" +
                        this.state.docId
                    }
                    Api="AddContractsPurchaseOrderScheduleItemss"
                    ApiDelete="DeleteContractsPurchaseOrderScheduleItemsById?id="
                    contractId={this.state.docId}
                    projectId={projectId}
                    isViewMode={this.state.isViewMode}
                    type="purchaseId"
                />
            );
        };

        let FivethStepInsurance = () => {
            return (
                <ContractInsurance
                    contractId={this.state.docId}
                    type="purchaseId"
                    projectId={projectId}
                    ApiGet="GetContractsPurchaseOrderInsurancesByProjectId?projectId="
                    Api="AddContractsPurchaseOrderInsurances"
                    ApiDelete="DeleteContractsPurchaseOrderInsuranceById?id="
                    isViewMode={this.state.isViewMode}
                />
            );
        };

        let SixthStepSubPurchaseOrders = () => {
            return (
                <div className="doc-pre-cycle">
                    <SubPurchaseOrderLog
                        type="PurchaseOrder"
                        items={this.state.purchaseOrderDataItems}
                        ApiGet={
                            "GetContractsPurchaseOrderSubPos?projectId=" +
                            docId +
                            "&parentType=PurchaseOrder"
                        }
                        docId={this.state.docId}
                        projectId={projectId}
                        isViewMode={this.state.isViewMode}
                        subject={this.state.document.subject}
                    />
                </div>
            );
        };

        let SeventhStepSubContracts = () => {
            return (
                <SubContract
                    items={this.state.purchaseOrderDataItems}
                    type="PurchaseOrder"
                    ApiGet={
                        "GetContractsByTypeAndId?parentId=" +
                        docId +
                        "&parentType=PurchaseOrder"
                    }
                    docId={this.state.docId}
                    projectId={projectId}
                    isViewMode={this.state.isViewMode}
                />
            );
        };

        return (
            <div className="mainContainer">
                {this.state.IsLoadingCheckCode ? <LoadingSection /> : null}
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
                        docTitle={Resources.purchaseOrder[currentLanguage]}
                        moduleTitle={Resources["procurement"][currentLanguage]}
                    />
                    <div className="doc-container">
                        <div className="step-content">
                            {this.state.currentStep == 0 ? (
                                <Fragment>{FirstStepMainDocument()}</Fragment>
                            ) : (
                                    <Fragment>
                                        {this.state.currentStep == 1
                                            ? SecondStepItems()
                                            : this.state.currentStep == 2
                                                ? ThirdStepTerms()
                                                : this.state.currentStep == 3
                                                    ? FouthStepSchedule()
                                                    : this.state.currentStep == 4
                                                        ? FivethStepInsurance()
                                                        : this.state.currentStep == 5
                                                            ? SixthStepSubPurchaseOrders()
                                                            : SeventhStepSubContracts()}
                                    </Fragment>
                                )}

                            {this.state.currentStep != 0 ? (
                                <div className="doc-pre-cycle">
                                    <div className="slider-Btns">
                                        <button
                                            className="primaryBtn-1 btn meduimBtn"
                                            onClick={e =>
                                                this.changeCurrentStep(
                                                    this.state.currentStep + 1
                                                )
                                            }>
                                            NEXT STEP
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        {/* Right Menu */}
                        <Steps
                            steps_defination={steps_defination}
                            exist_link="/purchaseOrder/"
                            docId={this.state.docId}
                            changeCurrentStep={stepNo =>
                                this.changeCurrentStep(stepNo)
                            }
                            stepNo={this.state.CurrentStep} changeStatus={docId === 0 ? false : true}
                        />
                    </div>

                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={
                                Resources["smartDeleteMessage"][currentLanguage]
                                    .content
                            }
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModalContact}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName="delete"
                            clickHandlerContinue={this.DeleteItems}
                        />
                    ) : null}

                    <div className="doc-pre-cycle letterFullWidth">
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

                        <div
                            className="largePopup largeModal "
                            style={{
                                display: this.state.showModalForEdit
                                    ? "block"
                                    : "none"
                            }}>
                            <SkyLight
                                hideOnOverlayClicked
                                ref={ref => (this.simpleDialog = ref)}>
                                {this._component()}
                            </SkyLight>
                        </div>
                    </div>
                </div>
            </div>
        );
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
)(withRouter(PurchaseOrderAddEdit));

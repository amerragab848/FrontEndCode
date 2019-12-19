import CryptoJS from "crypto-js";
import { Form, Formik } from "formik";
import find from "lodash/find";
import moment from "moment";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import SkyLight from "react-skylight";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import * as Yup from "yup";
import Api from "../../api";
import AddItemDescription from "../../Componants/OptionsPanels/addItemDescription";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import EditItemDescription from "../../Componants/OptionsPanels/editItemDescription";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import XSLfile from "../../Componants/OptionsPanels/XSLfiel";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Steps from "../../Componants/publicComponants/Steps";
import { default as DataService, default as dataservice } from "../../Dataservice";
import Resources from "../../resources.json";
import Config from "../../Services/Config.js";
import * as communicationActions from "../../store/actions/communication";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const poqSchema = Yup.object().shape({
    subject: Yup.string().required(
        Resources["subjectRequired"][currentLanguage]
    ),
    fromCompany: Yup.string().required(
        Resources["fromCompanyRequired"][currentLanguage]
    ),
    discipline: Yup.string().required(
        Resources["disciplineRequired"][currentLanguage]
    )
});

const contractSchema = Yup.object().shape({
    subject: Yup.string().required(
        Resources["subjectRequired"][currentLanguage]
    ),
    tax: Yup.number()
        .typeError(Resources["onlyNumbers"][currentLanguage])
        .min(0, Resources["onlyNumbers"][currentLanguage]),
    vat: Yup.number()
        .typeError(Resources["onlyNumbers"][currentLanguage])
        .min(0, Resources["onlyNumbers"][currentLanguage]),
    retainage: Yup.number()
        .typeError(Resources["onlyNumbers"][currentLanguage])
        .min(0, Resources["onlyNumbers"][currentLanguage]),
    insurance: Yup.number()
        .typeError(Resources["onlyNumbers"][currentLanguage])
        .min(0, Resources["onlyNumbers"][currentLanguage]),
    advancedPayment: Yup.number()
        .typeError(Resources["onlyNumbers"][currentLanguage])
        .min(0, Resources["onlyNumbers"][currentLanguage]),
    advancedPaymentAmount: Yup.number()
        .typeError(Resources["onlyNumbers"][currentLanguage])
        .min(0, Resources["onlyNumbers"][currentLanguage])
});

const purchaseSchema = Yup.object().shape({
    subject: Yup.string().required(
        Resources["subjectRequired"][currentLanguage]
    ),
    advancedPaymentPercent: Yup.number()
        .typeError(Resources["onlyNumbers"][currentLanguage])
        .min(0, Resources["onlyNumbers"][currentLanguage])
});

const BoqTypeSchema = Yup.object().shape({
    boqType: Yup.string().required(Resources["boqSubType"][currentLanguage]),
    boqChild: Yup.string().required(Resources["boqSubType"][currentLanguage]),
    boqSubType: Yup.string().required(Resources["boqSubType"][currentLanguage])
});

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = 0;
let arrange = 0;
var steps_defination = [];

class bogAddEdit extends Component {
    constructor(props) {
        super(props);
        const query = new URLSearchParams(this.props.location.search);
        let index = 0;
        for (let param of query.entries()) {
            if (index === 0) {
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

        this.boqItems = [
            { title: '', type: 'check-box', fixed: true, field: 'id' },
            {
                field: "arrange",
                title: Resources["no"][currentLanguage],
                width: 4,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "boqType",
                title: Resources["boqType"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "boqTypeChild",
                title: Resources["boqSubType"][currentLanguage],
                width: 8,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "boqSubType",
                title: Resources["boqTypeChild"][currentLanguage],
                width: 8,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "itemCode",
                title: Resources["itemCode"][currentLanguage],
                width: 6,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "description",
                title: Resources["details"][currentLanguage],
                width: 20,
                showTip: true,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "quantity",
                title: Resources["quantity"][currentLanguage],
                width: 6,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "revisedQuantity",
                title: Resources["revisedQuantity"][currentLanguage],
                width: 6,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "unit",
                title: Resources["unit"][currentLanguage],
                width: 8,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "unitPrice",
                title: Resources["unitPrice"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                sortable: true,
                handleChange: (e, cell) => {
                    cell.unitPrice = e.target.value;

                },
                handleBlur: (e, cell) => {
                    this.setState({ isLoading: true });

                    Api.post("EditBoqItemUnitPrice?id=" + cell.id + "&unitPrice=" + cell.unitPrice).then(() => {
                        toast.success(
                            Resources["operationSuccess"][currentLanguage]
                        );
                        this.setState({ isLoading: false });
                    }).catch(() => {
                        toast.error(
                            Resources["operationCanceled"][currentLanguage]
                        );
                        this.setState({ isLoading: false });
                    });
                },
                type: "input"
            },
            {
                field: "total",
                title: Resources["total"][currentLanguage],
                width: 8,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "resourceCode",
                title: Resources["resourceCode"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            }
        ];

        this.actions = [
            {
                title: 'Assign',
                handleClick: values => {
                    console.log(values);
                    this.setState({ showBoqModal: true });
                    this.boqTypeModal.show();
                },
                classes: '',
            }, {
                title: 'Delete',
                handleClick: values => {
                    console.log(values);
                    this.setState({
                        showDeleteModal: true,
                        selectedRow: values
                    });
                },
                classes: '',
            }
        ];

        this.rowActions = [
            {
                title: 'Itemization',
                handleClick: value => {
                    let obj = {
                        id: value.id,
                        boqId: value.boqId,
                        projectId: this.state.projectId,
                        projectName: this.state.projectName
                    };
                    let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
                    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
                    this.props.history.push({ pathname: "/Itemize", search: "?id=" + encodedPaylod });
                }
            }
        ];
        this.groups = [
            { title: 'boqType', field: 'boqType', type: 'text' },
            { title: 'boqSubType', field: 'boqSubType', type: 'text' }
        ];

        this.state = {
            isCompany: Config.getPayload().uty === "company" ? true : false,
            showForm: false,
            isLoadingEdit: false,
            loadingContractPurchase: false,
            AddedPurchase: false,
            loadingContract: false,
            LoadingPage: false,
            docTypeId: 64,
            selectedRow: {},
            pageNumber: 0,
            pageSize: 2000,
            CurrStep: 0,
            firstComplete: false,
            secondComplete: false,
            thirdComplete: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            showPopUp: false,
            btnTxt: "save",
            btnText: "add",
            activeTab: "",
            contractId: 0,
            Companies: [],
            Disciplines: [],
            selectedFromCompany: {
                label: Resources.fromCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedDiscipline: {
                label: Resources.disciplineRequired[currentLanguage],
                value: "0"
            },
            rows: [],
            items: {
                parentId: 0,
                description: "",
                quantity: 0,
                arrange: 1,
                unit: "",
                unitPrice: 0,
                revisedQuantity: 0,
                resourceCode: "",
                itemCode: "",
                itemType: "",
                days: 1,
                equipmentType: "",
                editable: true,
                boqSubTypeId: 0,
                boqTypeId: 0,
                boqChildTypeId: 0
            },
            selectedUnit: {
                label: Resources.unitSelection[currentLanguage],
                value: "0"
            },
            selectedBoqType: {
                label: Resources.boqType[currentLanguage],
                value: "0"
            },
            selectedBoqTypeChild: {
                label: Resources.boqTypeChild[currentLanguage],
                value: "0"
            },
            selectedBoqSubType: {
                label: Resources.boqSubType[currentLanguage],
                value: "0"
            },
            selectedItemType: {
                label: Resources.itemTypeSelection[currentLanguage],
                value: "0"
            },
            selectedequipmentType: {
                label: Resources.equipmentTypeSelection[currentLanguage],
                value: "0"
            },
            Units: [],
            boqTypes: [],
            BoqTypeChilds: [],
            BoqSubTypes: [],
            itemTypes: [],
            equipmentTypes: [],
            currency: [],
            selectedBoqTypeEdit: {
                label: Resources.boqType[currentLanguage],
                value: "0"
            },
            selectedBoqTypeChildEdit: {
                label: Resources.boqTypeChild[currentLanguage],
                value: "0"
            },
            selectedBoqSubTypeEdit: {
                label: Resources.boqSubType[currentLanguage],
                value: "0"
            },
            isLoading: true,
            permission: [
                { name: "sendByEmail", code: 622 },
                { name: "sendByInbox", code: 621 },
                { name: "sendTask", code: 0 },
                { name: "distributionList", code: 971 },
                { name: "createTransmittal", code: 3057 },
                { name: "sendToWorkFlow", code: 720 },
                { name: "viewAttachments", code: 3295 },
                { name: "deleteAttachments", code: 862 }
            ],
            document: {},
            _items: []
        };

        if (!Config.IsAllow(616) && !Config.IsAllow(617) && !Config.IsAllow(619)) {
            toast.warning(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
        steps_defination = [
            {
                name: "boq",
                callBackFn: null
            },
            {
                name: "items",
                callBackFn: null
            },
            {
                name: "changeBoqIntoContractOrPO",
                callBackFn: null
            }
        ];

    }

    customButton = () => {
        return (
            <button className="companies_icon" style={{ cursor: "pointer" }}>
                <i className="fa fa-folder-open" />
            </button>
        );
    };

    itemization = value => {
        let obj = {
            id: value.id,
            boqId: value.boqId,
            projectId: this.state.projectId,
            projectName: this.state.projectName
        };
        let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
        let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
        this.props.history.push({ pathname: "/Itemize", search: "?id=" + encodedPaylod });
    };

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(617) || this.props.document.contractId !== null) {
                this.setState({ isViewMode: true });
            } else if (this.state.isApproveMode !== true && Config.IsAllow(617)) {
                if (this.props.hasWorkflow === false && Config.IsAllow(617)) {
                    if (this.props.document.status !== false && Config.IsAllow(617)) {
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

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
    }

    fillDropDowns(isEdit) {
        DataService.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId").then(res => {
            if (isEdit) {
                let companyId = this.state.document.company;
                if (companyId) {
                    let comapny = find(res, function (x) {
                        return x.value == companyId;
                    });
                    if (comapny) {
                        this.setState({
                            selectedFromCompany: comapny
                        });
                    }
                }
            }
            this.setState({ Companies: [...res], isLoading: false });
        });

        DataService.GetDataListCached("GetAccountsDefaultListForList?listType=discipline", "title", "id", 'defaultLists', "discipline", "listType").then(res => {
            if (isEdit) {
                let disciplineId = this.state.document.discipline;
                if (disciplineId) {
                    let discipline = find(res, function (x) {
                        return x.value == disciplineId;
                    });
                    this.setState({
                        selectedDiscipline: discipline
                    });
                }
            }

            this.setState({ Disciplines: [...res], isLoading: false });
        });
        DataService.GetDataListCached("GetAccountsDefaultListForList?listType=currency", "title", "id", 'defaultLists', "currency", "listType").then(res => {
            this.setState({ currency: [...res], isLoading: false });
        });
    }

    fillSubDropDown(
        url,
        param,
        value,
        subField_lbl,
        subField_value,
        subDatasource,
        subDatasource_2
    ) {
        this.setState({ isLoading: true });
        let action = url + "?" + param + "=" + value;
        DataService.GetDataList(action, subField_lbl, subField_value).then(
            result => {
                this.setState({
                    [subDatasource]: result,
                    [subDatasource_2]: result,
                    isLoading: false
                });
            }
        );
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
        dataservice.GetDataList("GetAllBoqParentNull?projectId=" + this.state.projectId, "title", "id").then(res => {
            this.setState({ boqTypes: res });
        });
    }

    getNextArrange = event => {
        this.setState({ selectedFromCompany: event });
        Api.get(
            "GetBoqNumber?projectId=" +
            this.state.projectId +
            "&companyId=" +
            event.value
        ).then(res => {
            this.setState({
                document: { ...this.state.document, arrange: res },
                isLoading: false
            });
        });
    };

    disablePopUp = () => {
        this.setState({
            showPopUp: false
        });
    }

    componentWillMount() {
        if (this.state.docId > 0) {
            this.setState({ isLoading: true, LoadingPage: true });
            this.props.actions
                .documentForEdit(
                    "GetBoqForEdit?id=" + this.state.docId,
                    this.state.docTypeId,
                    "boq"
                )
                .then(() => {
                    this.setState({
                        isLoading: false,
                        showForm: true,
                        btnTxt: "next",
                        LoadingPage: false
                    });
                    this.checkDocumentIsView();
                    this.getTabelData();
                });
        } else {
            let cmi = Config.getPayload().cmi;
            this.setState({ LoadingPage: true });
            Api.get(
                "GetBoqNumber?projectId=" +
                this.state.projectId +
                "&companyId=" +
                cmi
            ).then(res => {
                this.setState({
                    document: { ...this.state.document, arrange: res },
                    isLoading: false,
                    LoadingPage: false
                });
            });
            this.fillDropDowns(false);

            let document = {
                id: 0,
                project: this.state.projectId,
                documentDate: moment(),
                company: "",
                discipline: "",
                status: true,
                arrange: 0,
                subject: "",
                showInCostCoding: false,
                showInSiteRequest: true,
                showOptimization: true
            };

            this.setState({ document });
            this.props.actions.documentForAdding();
        }
    }

    getTabelData() {
        let Table = [];
        this.setState({ isLoading: true, LoadingPage: true });
        Api.get("GetBoqItemsList?id=" + this.state.docId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(res => {

            let data = { items: res };

            res.forEach((element, index) => {
                Table.push({
                    id: element.id,
                    boqId: element.boqId,
                    unitPrice: this.state.items.unitPrice,
                    itemType: element.itemType,
                    itemTypeLabel: "",
                    days: element.days,
                    equipmentType: element.equipmentType,
                    equipmentTypeLabel: "",
                    editable: true,
                    boqSubTypeId: element.boqSubTypeId,
                    boqTypeId: element.boqTypeId,
                    boqChildTypeId: element.boqChildTypeId,
                    arrange: element.arrange,
                    boqType: element.boqType,
                    boqTypeChild: element.boqTypeChild,
                    boqSubType: element.boqSubType,
                    itemCode: element.itemCode,
                    description: element.description,
                    quantity: element.quantity,
                    revisedQuntitty: element.revisedQuantity,
                    unit: element.unit,
                    unitPrice: element.unitPrice,
                    total: element.total,
                    resourceCode: element.resourceCode
                });
            });
            this.setState({ _items: Table });
            this.props.actions.ExportingData(data);
            setTimeout(() => {
                this.setState({ isLoading: false, LoadingPage: false });
            }, 500);
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    componentWillReceiveProps(props, state) {
        if (props.document.id !== this.props.document.id) {
            let docDate = moment(props.document.documentDate);
            props.document.statusName = props.document.status ? "Opened" : "Closed";
            let document = Object.assign(props.document, {
                documentDate: docDate
            });
            this.setState({ document });
            this.fillDropDowns(true);
            this.checkDocumentIsView();
        }
        let _items = props.items ? props.items : [];
        if (JSON.stringify(this.state._items.length) != JSON.stringify(_items)) {
            this.setState({ isLoading: true });
            this.setState({ _items }, () =>
                this.setState({ isLoading: false })
            );
        }
    }

    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(3295) === true ? (
                <ViewAttachment isApproveMode={this.state.isViewMode}
                    docTypeId={this.state.docTypeId}
                    docId={this.state.docId}
                    projectId={this.state.projectId}
                    deleteAttachments={862}
                />
            ) : null
        ) : null;
    }

    addPoq = values => {
        this.setState({ isLoading: true });

        let documentObj = {
            project: this.state.projectId,
            documentDate: moment(values.documentDate, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
            company: this.state.selectedFromCompany.value,
            discipline: this.state.selectedDiscipline.value,
            status: values.status,
            arrange: this.state.document.arrange,
            subject: values.subject,
            showInCostCoding: false,
            showInSiteRequest: values.showInSiteRequest,
            showOptimization: values.showOptimization
        };

        DataService.addObject("AddBoq", documentObj).then(result => {
            this.props.actions.setDocId(result.id);
            this.setState({
                docId: result.id,
                isLoading: false,
                btnTxt: "next"
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        })
            .catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ isLoading: false });
            });
    };

    editBoq = values => {
        if (this.state.isViewMode) {
            this.changeCurrentStep(1);
        } else {
            this.setState({
                isLoading: true
            });

            let documentObj = {
                project: this.state.projectId,
                id: this.state.docId,
                arrange: this.state.document.arrange,
                DocumentDate: moment(values.documentDate, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
                Company: Config.getPayload().cmi,
                Discipline: this.state.selectedDiscipline.value,
                Status: values.status,
                Subject: values.subject,
                ShowInCostCoding: false,
                ShowInSiteRequest: values.showInSiteRequest,
                ShowOptimization: values.showOptimization
            };
            this.changeCurrentStep(1);
            Api.post("EditBoq", documentObj).then(result => {
                this.setState({
                    isLoading: false
                });
                toast.success(
                    Resources["operationSuccess"][currentLanguage]
                );
            }).catch(() => {
                toast.error(
                    Resources["operationCanceled"][currentLanguage]
                );
                this.setState({ isLoading: false });
            });
        }
    };

    checkItemCode = code => {
        Api.get("GetItemCode?itemCode=" + code + "&projectId=" + this.state.projectId).then(res => {
            if (res == true) {
                toast.error(Resources["itemCodeExist"][currentLanguage]);
                this.setState({ items: { ...this.state.items, itemCode: "" } });
            }
        });
    };

    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    ConfirmDelete = () => {
        this.setState({ isLoading: true });
        if (this.state.CurrStep == 1) {
            Api.post("ContractsBoqItemsMultipleDelete?", this.state.selectedRow)
                .then(res => {
                    let data = [];
                    this.state.selectedRow.forEach((element, index) => {
                        data = this.state._items.filter(item => {
                            return item.id != element;
                        });
                    });
                    this.props.actions.resetItems(data);
                    this.setState({ showDeleteModal: false, isLoading: false });
                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                })
                .catch(() => {
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                    );
                    this.setState({ showDeleteModal: false, isLoading: false });
                });
        }
    };

    changeCurrentStep = stepNo => {
        this.setState({ CurrStep: stepNo });
    };

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    onRowClick = (value, index, column) => {
        if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        } else if (column.key == "customBtn") {
            this.itemization(value);
        } else if (column.key != "select-row" && column.key != "unitPrice") {
            if (this.state.CurrStep == 1) {
                this.setState({
                    showPopUp: true,
                    btnText: "save",
                    selectedRow: value
                });
                this.simpleDialog1.show();
            }
        }
    };
    resetLoading = () => {
        this.setState({
            isLoadingEdit: false
        });
    }

    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedRow: selectedRows
        });
    };

    onRowsSelected = selectedRows => {
        this.setState({
            selectedRow: selectedRows
        });
    };

    onRowsDeselected = () => {
        this.setState({
            selectedRow: []
        });
    };

    assign = () => {
        this.setState({ showBoqModal: true });
        this.boqTypeModal.show();
    };

    assignBoqType = () => {
        this.setState({ showBoqModal: true, isLoading: true });
        let itemsId = [];
        this.state.selectedRow.forEach(element => {
            itemsId.push(element.row.id);
        });
        let boq = {
            boqChildTypeId: this.state.selectedBoqTypeChildEdit.value,
            boqItemId: itemsId,
            boqTypeId: this.state.selectedBoqTypeEdit.value,
            boqSubTypeId: this.state.selectedBoqSubTypeEdit.value
        };
        Api.post("EditBoqItemForSubType", boq)
            .then(() => {
                this.setState({ showBoqModal: false, isLoading: false });
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.getTabelData();
            })
            .catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ showBoqModal: false, isLoading: false });
            });
    };

    _executeBeforeModalClose = () => {
        this.setState({
            showPopUp: false,
            btnText: "add",
            showBoqModal: false
        });
    };

    _executeBeforeModalOpen = () => {
        this.setState({
            btnText: "save"
        });
        this.resetLoading();
    };

    addContract = values => {
        if (this.props.document.contractId != null || this.state.addedContract)
            toast.info(Resources.alreadyContract[currentLanguage]);
        else {
            let contract = {
                projectId: this.state.projectId,
                boqId: this.state.docId,
                subject: values.subject,
                companyId: Config.getPayload().cmi,
                completionDate: moment(
                    values.completionDate,
                    "YYYY-MM-DD"
                ).format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
                status:
                    values.status == undefined
                        ? this.props.document.status
                        : values.status,
                docDate: moment(values.docDate, "YYYY-MM-DD").format(
                    "YYYY-MM-DD[T]HH:mm:ss.SSS"
                ),
                reference: values.reference,
                currencyAction:
                    this.state.selectedCurrency != undefined
                        ? this.state.selectedCurrency.value
                        : 0,
                tax: values.tax,
                vat: values.vat,
                advancedPayment: values.advancedPayment,
                retainage: values.retainage,
                insurance: values.insurance,
                advancedPaymentAmount: values.advancedPaymentAmount
            };
            this.setState({ loadingContractPurchase: true });
            DataService.addObject("AddContractsForBoq", contract)
                .then(() => {
                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                    this.setState({
                        selectedCurrency: {
                            label: Resources.pleaseSelect[currentLanguage],
                            value: "0"
                        },
                        loadingContractPurchase: false,
                        addedContract: true
                    });
                })
                .catch(() => {
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                    );
                    this.setState({ loadingContractPurchase: false });
                });
            this.changeTab();
        }
    };

    addPurchaseOrder = values => {
        if (
            this.props.document.purchaseOrderId != null ||
            this.state.AddedPurchase
        )
            toast.info(Resources.alreadyContract[currentLanguage]);
        else {
            let purchaseOrder = {
                projectId: this.state.projectId,
                boqId: this.state.docId,
                subject: values.subject,
                companyId: Config.getPayload().cmi,
                completionDate: moment(
                    values.completionDate,
                    "YYYY-MM-DD"
                ).format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
                status: values.status,
                useRevised: values.useRevised,
                useItemization: values.useItemization,
                docDate: moment(values.docDate, "YYYY-MM-DD").format(
                    "YYYY-MM-DD[T]HH:mm:ss.SSS"
                ),
                refDoc: values.reference,
                actionCurrency:
                    this.state.selectedCurrency != undefined
                        ? this.state.selectedCurrency.value
                        : 0,
                advancePaymentPercent: values.advancedPaymentPercent
            };
            this.setState({
                loadingContractPurchase: true,
                AddedPurchase: true
            });
            DataService.addObject(
                "AddContractsPurchaseOrdersForBoq",
                purchaseOrder
            )
                .then(() => {
                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                    this.setState({ loadingContractPurchase: false });
                })
                .catch(() => {
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                    );
                    this.setState({ loadingContractPurchase: false });
                });
            this.changeTab();
        }
    };

    changeTab = tabName => {
        if (tabName == "contract") {
            if (this.props.document.contractId != null)
                toast.info(Resources.alreadyContract[currentLanguage]);
            else this.setState({ activeTab: tabName });
        } else if (tabName == "purchase") {
            if (this.props.document.purchaseOrderId != null)
                toast.info(Resources.alreadyContract[currentLanguage]);
            else this.setState({ activeTab: tabName });
        } else this.setState({ activeTab: "" });
    };

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;

        if (pageNumber > 0) {

            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });

            let oldRows = [...this.state._items];

            Api.get(
                "GetBoqItemsList?id=" +
                this.state.docId +
                "&pageNumber=" +
                pageNumber +
                "&pageSize=" +
                this.state.pageSize
            )
                .then(result => {
                    const newRows = [...this.state._items, ...result];

                    this.setState({
                        _items: newRows,
                        isLoading: false
                    });
                })
                .catch(ex => {
                    this.setState({
                        _items: oldRows,
                        isLoading: false
                    });
                });
        }
    }

    GetNextData() {
        let pageNumber = this.state.pageNumber + 1;

        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });

        let oldRows = [...this.state._items];

        Api.get("GetBoqItemsList?id=" + this.state.docId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
            const newRows = [...this.state._items, ...result];

            this.setState({
                _items: newRows,
                isLoading: false
            });
        }).catch(ex => {
            this.setState({
                _items: oldRows,
                isLoading: false
            });
        });
    }

    handleChangeItemDropDown(
        event,
        field,
        selectedValue,
        isSubscribe,
        url,
        param,
        nextTragetState,
        fieldLabel
    ) {
        if (isSubscribe) {
            let action = url + "?" + param + "=" + event.value;
            dataservice.GetDataList(action, "title", "id").then(result => {
                this.setState({
                    [nextTragetState]: result
                });
            });
        }
    }

    render() {

        let ItemsGrid = this.state.isLoading === false ? (
            <GridCustom
                cells={this.boqItems}
                data={this.state._items}
                groups={this.groups}
                pageSize={this.state.pageSize}
                actions={this.actions}
                rowActions={this.rowActions}
                rowClick={cell => {
                    if (!Config.IsAllow(11)) {
                        toast.warning("you don't have permission");
                    } else if (cell.field != "select-row" && cell.field != "unitPrice") {

                        this.setState({
                            showPopUp: true,
                            btnText: "save",
                            selectedRow: cell,
                            isLoadingEdit: true
                        });
                        this.simpleDialog1.show();

                    }
                }}
            />

        ) : (<LoadingSection />);

        const contractContent = (
            <Fragment>
                <div className="document-fields">
                    <Formik enableReinitialize={true} initialValues={{
                        subject: this.props.changeStatus ? this.props.document.subject : "",
                        reference: 1,
                        completionDate: moment(),
                        docDate: this.props.changeStatus ? this.props.document.documentDate : moment(),
                        status: this.props.document.status ? this.props.document.status : true
                    }}
                        validationSchema={contractSchema}
                        onSubmit={values => {
                            this.addContract(values);
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
                                    <div className="proForm first-proform letterFullWidth">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources["subject"][
                                                    currentLanguage
                                                    ]
                                                }{" "}
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.subject
                                                        ? "has-error"
                                                        : !errors.subject &&
                                                            touched.subject
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    name="subject"
                                                    className="form-control"
                                                    id="subject"
                                                    placeholder={
                                                        Resources["subject"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                    autoComplete="off"
                                                    onBlur={handleBlur}
                                                    defaultValue={values.subject}
                                                    onChange={e => handleChange(e)}
                                                />
                                                {errors.subject ? (
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
                                                    name="status"
                                                    defaultChecked={
                                                        values.status === false
                                                            ? null
                                                            : "checked"
                                                    }
                                                    value="true"
                                                    onChange={e =>
                                                        setFieldValue(
                                                            "status",
                                                            true
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
                                                        values.status === false
                                                            ? "checked"
                                                            : null
                                                    }
                                                    value="false"
                                                    onChange={e =>
                                                        setFieldValue(
                                                            "status",
                                                            false
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
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources.reference[
                                                    currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div className="ui input inputDev">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="reference"
                                                    defaultValue={values.reference}
                                                    name="reference"
                                                    placeholder={
                                                        Resources.reference[
                                                        currentLanguage
                                                        ]
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <DatePicker
                                                title="completionDate"
                                                name="completionDate"
                                                startDate={values.completionDate}
                                                handleChange={e =>
                                                    setFieldValue(
                                                        "completionDate",
                                                        e
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <DatePicker
                                                title="docDate"
                                                name="documentDate"
                                                startDate={values.docDate}
                                                handleChange={e =>
                                                    setFieldValue("docDate", e)
                                                }
                                            />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                title="currency"
                                                data={this.state.currency}
                                                selectedValue={
                                                    this.state.selectedCurrency
                                                }
                                                handleChange={event => {
                                                    this.setState({
                                                        selectedCurrency: event
                                                    });
                                                }}
                                                name="currency"
                                                index="currency"
                                            />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources.tax[currentLanguage]}
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.tax
                                                        ? "has-error"
                                                        : !errors.tax && touched.tax
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="tax"
                                                    defaultValue={0}
                                                    onBlur={handleBlur}
                                                    onChange={e => handleChange(e)}
                                                    name="tax"
                                                    placeholder={
                                                        Resources.tax[
                                                        currentLanguage
                                                        ]
                                                    }
                                                />
                                                {errors.tax ? (
                                                    <em className="pError">
                                                        {errors.tax}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {Resources.vat[currentLanguage]}
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.vat
                                                        ? "has-error"
                                                        : !errors.vat && touched.vat
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="vat"
                                                    defaultValue={0}
                                                    onBlur={handleBlur}
                                                    onChange={e => handleChange(e)}
                                                    name="vat"
                                                    placeholder={
                                                        Resources.vat[
                                                        currentLanguage
                                                        ]
                                                    }
                                                />
                                                {errors.vat ? (
                                                    <em className="pError">
                                                        {errors.vat}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources.advancedPayment[
                                                    currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.advancedPayment
                                                        ? "has-error"
                                                        : !errors.advancedPayment &&
                                                            touched.advancedPayment
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="advancedPayment"
                                                    defaultValue={0}
                                                    onBlur={handleBlur}
                                                    onChange={e => handleChange(e)}
                                                    name="advancedPayment"
                                                    placeholder={
                                                        Resources.advancedPayment[
                                                        currentLanguage
                                                        ]
                                                    }
                                                />
                                                {errors.advancedPayment ? (
                                                    <em className="pError">
                                                        {errors.advancedPayment}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources.retainage[
                                                    currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.retainage
                                                        ? "has-error"
                                                        : !errors.retainage &&
                                                            touched.retainage
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="retainage"
                                                    defaultValue={0}
                                                    onBlur={handleBlur}
                                                    onChange={e => handleChange(e)}
                                                    name="retainage"
                                                    placeholder={
                                                        Resources.retainage[
                                                        currentLanguage
                                                        ]
                                                    }
                                                />
                                                {errors.retainage ? (
                                                    <em className="pError">
                                                        {errors.retainage}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources.insurance[
                                                    currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.insurance
                                                        ? "has-error"
                                                        : !errors.insurance &&
                                                            touched.insurance
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="insurance"
                                                    defaultValue={0}
                                                    name="insurance"
                                                    onBlur={handleBlur}
                                                    onChange={e => handleChange(e)}
                                                    placeholder={
                                                        Resources.insurance[
                                                        currentLanguage
                                                        ]
                                                    }
                                                />
                                                {errors.insurance ? (
                                                    <em className="pError">
                                                        {errors.insurance}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources.advancedPaymentAmount[
                                                    currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.advancedPaymentAmount
                                                        ? "has-error"
                                                        : !errors.advancedPaymentAmount &&
                                                            touched.advancedPaymentAmount
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="advancedPaymentAmount"
                                                    defaultValue={0}
                                                    onBlur={handleBlur}
                                                    onChange={e => handleChange(e)}
                                                    name="advancedPaymentAmount"
                                                    placeholder={
                                                        Resources
                                                            .advancedPaymentAmount[
                                                        currentLanguage
                                                        ]
                                                    }
                                                />
                                                {errors.advancedPaymentAmount ? (
                                                    <em className="pError">
                                                        {
                                                            errors.advancedPaymentAmount
                                                        }
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div
                                            className={
                                                "slider-Btns fullWidthWrapper textLeft "
                                            }>
                                            {this.state.isLoading === false ? (
                                                <button
                                                    className={
                                                        "primaryBtn-1 btn " +
                                                        (this.state
                                                            .isApproveMode === true
                                                            ? "disabled"
                                                            : "")
                                                    }
                                                    type="submit"
                                                    disabled={
                                                        this.state.isApproveMode
                                                    }>
                                                    {
                                                        Resources.save[
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
                                </Form>
                            )}
                    </Formik>
                </div>
            </Fragment>
        );

        const purchaseOrderContent = (
            <Fragment>
                <div className="document-fields">
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            subject: this.props.changeStatus
                                ? this.props.document.subject
                                : "",
                            reference: 1,
                            completionDate: moment(),
                            docDate: this.props.changeStatus
                                ? this.props.document.documentDate
                                : moment(),
                            status: this.props.document.status
                                ? this.props.document.status
                                : true,
                            useItemization: false,
                            useRevised: false,
                            advancedPaymentPercent: 0
                        }}
                        validationSchema={purchaseSchema}
                        onSubmit={values => {
                            this.addPurchaseOrder(values);
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
                                    <div className="proForm first-proform letterFullWidth">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources["subject"][
                                                    currentLanguage
                                                    ]
                                                }{" "}
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.subject
                                                        ? "has-error"
                                                        : !errors.subject &&
                                                            touched.subject
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    name="subject"
                                                    className="form-control"
                                                    id="subject"
                                                    placeholder={
                                                        Resources["subject"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                    autoComplete="off"
                                                    onBlur={handleBlur}
                                                    defaultValue={values.subject}
                                                    onChange={e => {
                                                        handleChange(e);
                                                    }}
                                                />
                                                {errors.subject ? (
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
                                                    name="status"
                                                    defaultChecked={
                                                        values.status === false
                                                            ? null
                                                            : "checked"
                                                    }
                                                    value="true"
                                                    onChange={() =>
                                                        setFieldValue(
                                                            "status",
                                                            true
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
                                                        values.status === false
                                                            ? "checked"
                                                            : null
                                                    }
                                                    value="false"
                                                    onChange={() =>
                                                        setFieldValue(
                                                            "status",
                                                            false
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
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources.reference[
                                                    currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div className="ui input inputDev">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="reference"
                                                    readOnly
                                                    defaultValue={values.reference}
                                                    name="reference"
                                                    placeholder={
                                                        Resources.reference[
                                                        currentLanguage
                                                        ]
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <DatePicker
                                                title="completionDate"
                                                name="completionDate"
                                                startDate={values.completionDate}
                                                handleChange={e =>
                                                    setFieldValue(
                                                        "completionDate",
                                                        e
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <DatePicker
                                                title="docDate"
                                                name="documentDate"
                                                startDate={
                                                    this.state.document.documentDate
                                                }
                                                handleChange={e =>
                                                    setFieldValue("documentDate", e)
                                                }
                                            />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources.advancedPayment[
                                                    currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.advancedPaymentPercent
                                                        ? "has-error"
                                                        : !errors.advancedPaymentPercent &&
                                                            touched.advancedPaymentPercent
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="advancedPaymentPercent"
                                                    defaultValue={
                                                        values.advancedPaymentPercent
                                                    }
                                                    name="advancedPaymentPercent"
                                                    placeholder={
                                                        Resources.advancedPayment[
                                                        currentLanguage
                                                        ]
                                                    }
                                                    onChange={e => {
                                                        handleChange(e);
                                                        setFieldValue(
                                                            "advancedPaymentPercent",
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                                {errors.advancedPaymentPercent ? (
                                                    <em className="pError">
                                                        {
                                                            errors.advancedPaymentPercent
                                                        }
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="fullWidthWrapper account__checkbox">
                                            <div className="proForm fullLinearInput">
                                                <div className="linebylineInput">
                                                    <label className="control-label">
                                                        {
                                                            Resources
                                                                .useItemization[
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </label>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input
                                                            type="radio"
                                                            name="useItemization"
                                                            defaultChecked={
                                                                values.useItemization ===
                                                                    false
                                                                    ? null
                                                                    : "checked"
                                                            }
                                                            value="true"
                                                            onChange={() =>
                                                                setFieldValue(
                                                                    "useItemization",
                                                                    true
                                                                )
                                                            }
                                                        />
                                                        <label>
                                                            {
                                                                Resources.yes[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                    </div>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input
                                                            type="radio"
                                                            name="useItemization"
                                                            defaultChecked={
                                                                values.useItemization ===
                                                                    false
                                                                    ? "checked"
                                                                    : null
                                                            }
                                                            value="false"
                                                            onChange={() =>
                                                                setFieldValue(
                                                                    "useItemization",
                                                                    false
                                                                )
                                                            }
                                                        />
                                                        <label>
                                                            {
                                                                Resources.no[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="proForm fullLinearInput">
                                                <div className="linebylineInput">
                                                    <label className="control-label">
                                                        {
                                                            Resources.useRevised[
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </label>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input
                                                            type="radio"
                                                            name="useRevised"
                                                            defaultChecked={
                                                                values.useRevised ===
                                                                    false
                                                                    ? null
                                                                    : "checked"
                                                            }
                                                            value="true"
                                                            onChange={() =>
                                                                setFieldValue(
                                                                    "useRevised",
                                                                    true
                                                                )
                                                            }
                                                        />
                                                        <label>
                                                            {
                                                                Resources.yes[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                    </div>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input
                                                            type="radio"
                                                            name="useRevised"
                                                            defaultChecked={
                                                                values.useRevised ===
                                                                    false
                                                                    ? "checked"
                                                                    : null
                                                            }
                                                            value="false"
                                                            onChange={() =>
                                                                setFieldValue(
                                                                    "useRevised",
                                                                    false
                                                                )
                                                            }
                                                        />
                                                        <label>
                                                            {
                                                                Resources.no[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                title="currency"
                                                data={this.state.currency}
                                                selectedValue={
                                                    this.state.selectedCurrency
                                                }
                                                handleChange={event => {
                                                    this.setState({
                                                        selectedCurrency: event
                                                    });
                                                }}
                                                name="currency"
                                                index="currency"
                                            />
                                        </div>
                                        <div
                                            className={
                                                "slider-Btns fullWidthWrapper textLeft "
                                            }>
                                            {this.state.isLoading === false ? (
                                                <button
                                                    className={
                                                        "primaryBtn-1 btn " +
                                                        (this.state
                                                            .isApproveMode === true
                                                            ? "disabled"
                                                            : "")
                                                    }
                                                    type="submit"
                                                    disabled={
                                                        this.state.isApproveMode
                                                    }>
                                                    {
                                                        Resources[
                                                        this.state.btnText
                                                        ][currentLanguage]
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
                                </Form>
                            )}
                    </Formik>
                </div>
            </Fragment>
        );

        const addItemContent = (
            <Fragment>
                <div className="document-fields">
                    {this.state.isLoading ? <LoadingSection /> : null}
                    <AddItemDescription
                        docId={this.state.docId}
                        docLink="/Downloads/Excel/BOQ.xlsx"
                        showImportExcel={false}
                        docType="boq"
                        isViewMode={this.state.isViewMode}
                        mainColumn="boqId"
                        addItemApi="AddBoqItem"
                        projectId={this.state.projectId}
                        showItemType={true}
                        showBoqType={true}
                    />
                </div>
            </Fragment>
        );

        let itemsContent = this.state.isLoadingEdit === false ? (
            <Fragment>
                <div className=" proForm datepickerContainer customProform document-fields" key="editItem">
                    <EditItemDescription
                        showImportExcel={false}
                        docType="boq"
                        isViewMode={this.state.isViewMode}
                        mainColumn="boqId"
                        editItemApi="EditBoqItem"
                        projectId={this.state.projectId}
                        showItemType={true}
                        item={this.state.selectedRow}
                        onRowClick={this.state.showPopUp}
                        onSave={e => this._executeBeforeModalClose()}
                        disablePopUp={this.disablePopUp}
                    />
                </div>
            </Fragment>
        ) : <LoadingSection />;

        const BoqTypeContent = (
            <Fragment>
                <div className="dropWrapper">
                    {this.state.isLoading ? <LoadingSection /> : null}
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            boqType: "",
                            boqChild: "",
                            boqSubType: ""
                        }}
                        validationSchema={BoqTypeSchema}
                        onSubmit={values => {
                            this.assignBoqType();
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
                                    id="signupForm1"
                                    className="proForm datepickerContainer customProform"
                                    noValidate="novalidate">
                                    <div className="fullWidthWrapper textLeft">
                                        <Dropdown
                                            title="boqType"
                                            data={this.state.boqTypes}
                                            selectedValue={
                                                this.state.selectedBoqTypeEdit
                                            }
                                            handleChange={event => {
                                                this.handleChangeItemDropDown(
                                                    event,
                                                    "boqTypeId",
                                                    "selectedBoqType",
                                                    true,
                                                    "GetAllBoqChild",
                                                    "parentId",
                                                    "BoqTypeChilds",
                                                    "boqType"
                                                );
                                                this.setState({
                                                    selectedBoqTypeEdit: event,
                                                    selectedBoqTypeChildEdit: {
                                                        label:
                                                            Resources.boqTypeChild[
                                                            currentLanguage
                                                            ],
                                                        value: "0"
                                                    },
                                                    selectedBoqSubTypeEdit: {
                                                        label:
                                                            Resources.boqSubType[
                                                            currentLanguage
                                                            ],
                                                        value: "0"
                                                    }
                                                });
                                            }}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.boqType}
                                            touched={touched.boqType}
                                            name="boqType"
                                            index="boqType"
                                        />
                                    </div>
                                    <Dropdown
                                        title="boqTypeChild"
                                        data={this.state.BoqTypeChilds}
                                        selectedValue={
                                            this.state.selectedBoqTypeChildEdit
                                        }
                                        handleChange={event => {
                                            this.handleChangeItemDropDown(
                                                event,
                                                "boqChildTypeId",
                                                "selectedBoqTypeChild",
                                                true,
                                                "GetAllBoqChild",
                                                "parentId",
                                                "BoqSubTypes",
                                                "boqChildType"
                                            );
                                            this.setState({
                                                selectedBoqTypeChildEdit: event
                                            });
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.boqChild}
                                        touched={touched.boqChild}
                                        name="boqChild"
                                        index="boqChild"
                                    />
                                    <Dropdown
                                        title="boqSubType"
                                        data={this.state.BoqSubTypes}
                                        selectedValue={
                                            this.state.selectedBoqSubTypeEdit
                                        }
                                        handleChange={event => {
                                            this.handleChangeItemDropDown(
                                                event,
                                                "boqSubTypeId",
                                                "selectedBoqSubType",
                                                false,
                                                "",
                                                "",
                                                "",
                                                "boqSubType"
                                            );
                                            this.setState({
                                                selectedBoqSubTypeEdit: event
                                            });
                                        }}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.boqSubType}
                                        touched={touched.boqSubType}
                                        name="boqSubType"
                                        index="boqSubType"
                                    />

                                    <div className={"slider-Btns fullWidthWrapper"}>
                                        <button
                                            className={
                                                this.state.isViewMode === true
                                                    ? "primaryBtn-1 btn  disNone"
                                                    : "primaryBtn-1 btn "
                                            }
                                            type="submit">
                                            {
                                                Resources[this.state.btnText][
                                                currentLanguage
                                                ]
                                            }
                                        </button>
                                    </div>
                                </Form>
                            )}
                    </Formik>
                </div>
            </Fragment>
        );

        let Step_1 = (
            <Fragment>
                <div id="step1" className="step-content-body">
                    <div className="subiTabsContent">
                        <div className="document-fields">
                            <Formik
                                initialValues={{
                                    subject: this.props.changeStatus
                                        ? this.state.document.subject
                                        : "",
                                    fromCompany:
                                        this.state.selectedFromCompany.value != "0"
                                            ? this.state.selectedFromCompany
                                                .value
                                            : "",
                                    discipline:
                                        this.state.selectedDiscipline.value != "0"
                                            ? this.state.selectedDiscipline
                                                .value
                                            : "",
                                    status: this.props.changeStatus
                                        ? this.props.document.status
                                        : true,
                                    documentDate: this.props.changeStatus
                                        ? this.props.document.documentDate
                                        : moment(),
                                    showInSiteRequest: this.props.changeStatus
                                        ? this.props.document.showInSiteRequest
                                        : false,
                                    showOptimization: this.props.changeStatus
                                        ? this.props.document.showOptimization
                                        : false
                                }}
                                validationSchema={poqSchema}
                                enableReinitialize={this.props.changeStatus}
                                onSubmit={values => {
                                    if (this.props.showModal) {
                                        return;
                                    }

                                    if (
                                        this.props.changeStatus === true &&
                                        this.state.docId > 0
                                    ) {
                                        this.editBoq(values);
                                    } else if (
                                        this.props.changeStatus === false &&
                                        this.state.docId === 0
                                    ) {
                                        this.addPoq(values);
                                    } else if (
                                        this.props.changeStatus === false &&
                                        this.state.docId > 0
                                    ) {
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
                                    setFieldTouched,
                                    values
                                }) => (
                                        <Form
                                            id="ClientSelectionForm"
                                            className="customProform"
                                            noValidate="novalidate"
                                            onSubmit={handleSubmit}>
                                            <div className="proForm first-proform">
                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">
                                                        {
                                                            Resources["subject"][
                                                            currentLanguage
                                                            ]
                                                        }{" "}
                                                    </label>
                                                    <div
                                                        className={
                                                            "inputDev ui input " +
                                                            (errors.subject
                                                                ? "has-error"
                                                                : !errors.subject &&
                                                                    touched.subject
                                                                    ? " has-success"
                                                                    : " ")
                                                        }>
                                                        <input
                                                            name="subject"
                                                            className="form-control"
                                                            id="subject"
                                                            placeholder={
                                                                Resources[
                                                                "subject"
                                                                ][currentLanguage]
                                                            }
                                                            autoComplete="off"
                                                            onBlur={handleBlur}
                                                            defaultValue={
                                                                values.subject
                                                            }
                                                            onChange={e => {
                                                                handleChange(e);
                                                            }}
                                                        />
                                                        {errors.subject ? (
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
                                                            defaultChecked={
                                                                values.status ===
                                                                    false
                                                                    ? null
                                                                    : "checked"
                                                            }
                                                            value="true"
                                                            onChange={() =>
                                                                setFieldValue(
                                                                    "status",
                                                                    true
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
                                                                values.status ===
                                                                    false
                                                                    ? "checked"
                                                                    : null
                                                            }
                                                            value="false"
                                                            onChange={() =>
                                                                setFieldValue(
                                                                    "status",
                                                                    false
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
                                                            defaultValue={
                                                                this.state.document
                                                                    .arrange
                                                            }
                                                            name="arrange"
                                                            placeholder={
                                                                Resources.arrange[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="linebylineInput valid-input">
                                                    <DatePicker
                                                        title="docDate"
                                                        name="documentDate"
                                                        startDate={
                                                            values.documentDate
                                                        }
                                                        handleChange={e => {
                                                            handleChange(e);
                                                            setFieldValue(
                                                                "documentDate",
                                                                e
                                                            );
                                                        }}
                                                    />
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <Dropdown
                                                        title="fromCompany"
                                                        data={this.state.Companies}
                                                        selectedValue={
                                                            this.state
                                                                .selectedFromCompany
                                                        }
                                                        handleChange={event => {
                                                            this.getNextArrange(
                                                                event
                                                            );
                                                        }}
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={errors.fromCompany}
                                                        touched={
                                                            touched.fromCompany
                                                        }
                                                        name="fromCompany"
                                                        index="fromCompany"
                                                    />
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <Dropdown
                                                        title="discipline"
                                                        data={
                                                            this.state.Disciplines
                                                        }
                                                        selectedValue={
                                                            this.state
                                                                .selectedDiscipline
                                                        }
                                                        handleChange={event => {
                                                            this.setState({
                                                                selectedDiscipline: event
                                                            });
                                                        }}
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={errors.discipline}
                                                        touched={touched.discipline}
                                                        name="discipline"
                                                        index="discipline"
                                                    />
                                                </div>

                                                <div className="fullWidthWrapper account__checkbox">
                                                    <div className="proForm fullLinearInput">
                                                        <div className="linebylineInput">
                                                            <label className="control-label">
                                                                {
                                                                    Resources
                                                                        .showInSiteRequest[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input
                                                                    type="radio"
                                                                    name="showInSiteRequest"
                                                                    defaultChecked={
                                                                        values.showInSiteRequest ===
                                                                            false
                                                                            ? null
                                                                            : "checked"
                                                                    }
                                                                    value="true"
                                                                    onChange={() =>
                                                                        setFieldValue(
                                                                            "showInSiteRequest",
                                                                            true
                                                                        )
                                                                    }
                                                                />
                                                                <label>
                                                                    {
                                                                        Resources
                                                                            .yes[
                                                                        currentLanguage
                                                                        ]
                                                                    }
                                                                </label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input
                                                                    type="radio"
                                                                    name="showInSiteRequest"
                                                                    defaultChecked={
                                                                        values.showInSiteRequest ===
                                                                            false
                                                                            ? "checked"
                                                                            : null
                                                                    }
                                                                    value="false"
                                                                    onChange={() =>
                                                                        setFieldValue(
                                                                            "showInSiteRequest",
                                                                            false
                                                                        )
                                                                    }
                                                                />
                                                                <label>
                                                                    {
                                                                        Resources
                                                                            .no[
                                                                        currentLanguage
                                                                        ]
                                                                    }
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="proForm fullLinearInput">
                                                        <div className="linebylineInput">
                                                            <label className="control-label">
                                                                {
                                                                    Resources
                                                                        .showOptemization[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input
                                                                    type="radio"
                                                                    name="showOptimization"
                                                                    defaultChecked={
                                                                        values.showOptimization ===
                                                                            false
                                                                            ? null
                                                                            : "checked"
                                                                    }
                                                                    value="true"
                                                                    onChange={() =>
                                                                        setFieldValue(
                                                                            "showOptimization",
                                                                            true
                                                                        )
                                                                    }
                                                                />
                                                                <label>
                                                                    {
                                                                        Resources
                                                                            .yes[
                                                                        currentLanguage
                                                                        ]
                                                                    }
                                                                </label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input
                                                                    type="radio"
                                                                    name="showOptimization"
                                                                    defaultChecked={
                                                                        values.showOptimization ===
                                                                            false
                                                                            ? "checked"
                                                                            : null
                                                                    }
                                                                    value="false"
                                                                    onChange={() =>
                                                                        setFieldValue(
                                                                            "showOptimization",
                                                                            false
                                                                        )
                                                                    }
                                                                />
                                                                <label>
                                                                    {
                                                                        Resources
                                                                            .no[
                                                                        currentLanguage
                                                                        ]
                                                                    }
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    className={
                                                        "slider-Btns fullWidthWrapper textLeft "
                                                    }>
                                                    {this.state.isLoading ===
                                                        false ? (
                                                            <button
                                                                className={
                                                                    "primaryBtn-1 btn " +
                                                                    (this.state
                                                                        .isViewMode ===
                                                                        true
                                                                        ? "disNone"
                                                                        : "")
                                                                }
                                                                type="submit"
                                                                disabled={
                                                                    this.state
                                                                        .isViewMode
                                                                }>
                                                                {
                                                                    Resources[
                                                                    this.state
                                                                        .btnTxt
                                                                    ][currentLanguage]
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
                                        </Form>
                                    )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </Fragment>
        );

        let Step_2 = (
            <Fragment>
                {addItemContent}
                <Fragment>
                    <XSLfile key="boqStructure" docId={this.state.docId} docType="boq2"
                        link={Config.getPublicConfiguartion().downloads + "/Downloads/Excel/BOQStructure.xlsx"}
                        header="addManyItems"
                        disabled={this.props.changeStatus ? this.props.document.contractId > 0 ? true : false : false}
                        afterUpload={() => this.getTabelData()} />
                </Fragment>

                <div className="doc-pre-cycle letterFullWidth">
                    <header>
                        <h2 className="zero">
                            {Resources.itemList[currentLanguage]}
                        </h2>
                    </header>
                    <div className="precycle-grid">
                        <div className="grid-container">
                            <div className="submittalFilter readOnly__disabled">
                                <div className="subFilter">
                                    <h3 className="zero">
                                        {Resources["items"][currentLanguage]}
                                    </h3>
                                    <span>{this.state._items.length}</span>
                                </div>
                                <div className="rowsPaginations readOnly__disabled">
                                    <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}>
                                        <i className="angle left icon" />
                                    </button>
                                    <button className={this.state.totalRows !== this.state.pageSize * this.state.pageNumber + this.state.pageSize ? "rowunActive" : ""} onClick={() => this.GetNextData()}>
                                        <i className="angle right icon" />
                                    </button>
                                </div>
                            </div>
                            {ItemsGrid}
                        </div>
                        <div className="slider-Btns">
                            <button className="primaryBtn-1 btn meduimBtn  " type="submit" onClick={() => this.changeCurrentStep(2)}>
                                {Resources.next[currentLanguage]}
                            </button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );

        let Step_3 = (
            <Fragment>
                {this.state.loadingContractPurchase ? <LoadingSection /> : null}
                <div className="company__total proForm">
                    <div className="form-group linebylineInput ">
                        <label className="control-label">
                            {Resources.company[currentLanguage]}
                        </label>
                        <div className="ui right labeled input inputDev  " style={{ display: "flex" }}>
                            <input className="form-control" autoComplete="off" type="text"
                                value={this.state.selectedFromCompany.label} readOnly data-toggle="tooltip" title="procoor Company" />
                            <span className="total_money">
                                {Resources.total[currentLanguage]}
                            </span>
                            <div className="ui basic label greyLabel">
                                {this.props.document.total}
                            </div>
                        </div>
                    </div>
                    <ul id="stepper__tabs" className="data__tabs">
                        <li className={" data__tabs--list " + (this.state.activeTab == "contract" ? "active" : "")}
                            onClick={() => this.changeTab("contract")}>
                            {Resources.contract[currentLanguage]}
                        </li>
                        <li
                            className={
                                "data__tabs--list " +
                                (this.state.activeTab == "purchase"
                                    ? "active"
                                    : "")
                            }
                            onClick={() => this.changeTab("purchase")}>
                            {Resources.po[currentLanguage]}
                        </li>
                    </ul>
                </div>
                {this.state.activeTab == "purchase" ? (
                    <Fragment>{purchaseOrderContent}</Fragment>
                ) : this.state.activeTab == "contract" ? (
                    <Fragment>{contractContent}</Fragment>
                ) : null}
                <div className="doc-pre-cycle letterFullWidth">
                    <div className="precycle-grid">
                        <div className="slider-Btns">
                            <button
                                className="primaryBtn-1 btn meduimBtn  "
                                type="submit"
                                onClick={() => this.changeCurrentStep(3)}>
                                {Resources.next[currentLanguage]}
                            </button>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
        return (
            <Fragment>
                <div className="mainContainer">
                    <div
                        className={
                            this.state.isViewMode === true && this.state.CurrStep != 2 ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"
                        }>
                        <HeaderDocument
                            projectName={projectName}
                            isViewMode={this.state.isViewMode}
                            perviousRoute={this.state.perviousRoute}
                            docTitle={Resources.boq[currentLanguage]}
                            moduleTitle={
                                Resources["contracts"][currentLanguage]
                            }
                        />
                        <div className="doc-container">
                            <div className="step-content">
                                {this.state.LoadingPage ? (<LoadingSection />) : (
                                    <Fragment>
                                        {this.state.CurrStep == 0 ? Step_1 : this.state.CurrStep == 1 ? Step_2 : Step_3}
                                        <div className="largePopup largeModal " style={{ display: this.state.showPopUp ? "block" : "none" }}>
                                            <SkyLight hideOnOverlayClicked
                                                ref={ref => (this.simpleDialog1 = ref)}
                                                title={Resources.editTitle[currentLanguage] + " - " + Resources.edit[currentLanguage]
                                                }
                                                beforeClose={this._executeBeforeModalClose}
                                                beforeOpen={this._executeBeforeModalOpen}>

                                                {itemsContent}
                                            </SkyLight>
                                        </div>
                                        {this.props.changeStatus === true ? (
                                            <div className="approveDocument">
                                                <div className="approveDocumentBTNS">
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
                                                        documentName="boq"

                                                    />
                                                </div>
                                            </div>
                                        ) : null}
                                    </Fragment>
                                )}
                                {this.state.CurrStep == 0 ? (
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId > 0 && this.state.isViewMode === false ? (
                                                <UploadAttachment
                                                    changeStatus={
                                                        this.props.changeStatus
                                                    }
                                                    AddAttachments={861}
                                                    EditAttachments={3254}
                                                    ShowDropBox={3565}
                                                    ShowGoogleDrive={3566}
                                                    docTypeId={
                                                        this.state.docTypeId
                                                    }
                                                    docId={this.state.docId}
                                                    projectId={
                                                        this.state.projectId
                                                    }
                                                />
                                            ) : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true ? (
                                                <ViewWorkFlow
                                                    docType={
                                                        this.state.docTypeId
                                                    }
                                                    docId={this.state.docId}
                                                    projectId={
                                                        this.state.projectId
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            <div>
                                <Steps
                                    steps_defination={steps_defination}
                                    exist_link="/boq/"
                                    docId={this.state.docId}
                                    changeCurrentStep={stepNo =>
                                        this.changeCurrentStep(stepNo)
                                    }
                                    stepNo={this.state.CurrStep} changeStatus={docId === 0 ? false : true}
                                />
                            </div>
                        </div>
                    </div>

                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources["smartDeleteMessage"][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName="delete"
                            clickHandlerContinue={this.ConfirmDelete}
                        />
                    ) : null}
                    <div className="largePopup largeModal " style={{ display: this.state.showBoqModal ? "block" : "none" }}>
                        <SkyLight
                            hideOnOverlayClicked
                            ref={ref => (this.boqTypeModal = ref)}
                            title={Resources.boqType[currentLanguage]}>
                            {BoqTypeContent}
                        </SkyLight>
                    </div>
                </div>
            </Fragment>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        changeStatus: state.communication.changeStatus,
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow,
        items: state.communication.items,
        projectId: state.communication.projectId,
        showModal: state.communication.showModal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(bogAddEdit));

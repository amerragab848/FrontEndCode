import CryptoJS from "crypto-js";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import SkyLight from "react-skylight";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import * as Yup from "yup";
import Api from "../../api";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import XSLfile from "../../Componants/OptionsPanels/XSLfiel";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown';
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown';
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Steps from "../../Componants/publicComponants/Steps";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import Config from "../../Services/Config.js";
import * as communicationActions from "../../store/actions/communication";
import GridCustom from 'react-customized-grid';


let publicFonts = currentLanguage === "ar" ? 'cairo-b' : 'Muli, sans-serif'
const actionPanel = {
    control: (styles, { isFocused }) => ({
        ...styles,
        height: '36px',
        borderRadius: '4px',
        boxShadow: 'none',
        transition: ' all 0.4s ease-in-out',
        width: '166px',
        backgroundColor: isFocused ? '#fafbfc' : 'rgba(255, 255, 255, 0)',
        border: isFocused ? 'solid 1px #858d9e' : ' solid 1px #ccd2db',
        '&:hover': {
            border: 'solid 1px #a8b0bf',
            backgroundColor: ' #fafbfc'
        }
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled ? '#fff' : isSelected ? '#e9ecf0' : isFocused ? '#f2f6fa' : "#fff",
            color: '#3e4352',
            fontSize: '14px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            textTransform: 'capitalize',
            fontFamily: publicFonts,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            fontWeight: '700',
            textOverflow: 'ellipsis',
            zIndex: '155'
        };
    },
    input: styles => ({ ...styles, maxWidth: '100%' }),
    placeholder: styles => ({ ...styles, color: '#5e6475', fontSize: '14px', width: '100%', fontFamily: publicFonts, fontWeight: '700' }),
    singleValue: styles => ({ ...styles, color: '#5e6475', fontSize: '14px', width: '100%', fontFamily: publicFonts, fontWeight: '700', textAlign: 'center' }),
    menu: styles => ({ ...styles, zIndex: 155, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)', border: 'solid 1px #ccd2db' }),
    indicatorSeparator: styles => ({ ...styles, backgroundColor: '#dadee6' }),
};

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(
        Resources["subjectRequired"][currentLanguage]
    ),
    arrange: Yup.string().required(
        Resources["arrangeRequired"][currentLanguage]
    ),
    fromCompany: Yup.string()
        .required(Resources["fromCompanyRequired"][currentLanguage])
        .nullable(true),
    discipline: Yup.string()
        .required(Resources["disciplineRequired"][currentLanguage])
        .nullable(true)
});

const contractSchema = Yup.object().shape({
    subject: Yup.string().required(
        Resources["subjectRequired"][currentLanguage]
    )
});

const materialSchema = Yup.object().shape({
    subject: Yup.string().required(
        Resources["subjectRequired"][currentLanguage]
    ),
    M_contact: Yup.string()
        .required(Resources["fromContactRequired"][currentLanguage])
        .nullable(true),
    M_siteRequest: Yup.string()
        .required(Resources["siteRequestSelection"][currentLanguage])
        .nullable(true),
    M_specsSection: Yup.string()
        .required(Resources["specsSectionSelection"][currentLanguage])
        .nullable(true),
    M_releaseType: Yup.string()
        .required(Resources["materialReleaseTypeSelection"][currentLanguage])
        .nullable(true),
    M_contractBoq: Yup.string()
        .required(Resources["boqLog"][currentLanguage])
        .nullable(true)
});
const normalItemsSchema = Yup.object().shape({
    details: Yup.string().required(
        Resources["descriptionRequired"][currentLanguage]
    ),
    quantity: Yup.number().min(1, Resources['numbersGreaterThanZero'][currentLanguage])
        .required(Resources["quantityRequired"][currentLanguage])
        .nullable(true),
    resourceCode: Yup.string()
        .required(Resources["resourceCodeRequired"][currentLanguage])
        .nullable(true),
    unit: Yup.string()
        .required(Resources["unitSelection"][currentLanguage])
        .nullable(true)

});
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = "";
let arrange = 0;
var steps_defination = [];
steps_defination = [
    { name: "siteRequest", callBackFn: null },
    { name: "items", callBackFn: null }
];

class materialRequestAddEdit extends Component {

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
        let editQuantity = ({ value, row }) => {
            if (Config.IsAllow(117)) {
                if (row) {
                    return (
                        <a className="editorCell">
                            <span
                                style={{
                                    padding: "0 6px",
                                    margin: "5px 0",
                                    border: "1px dashed",
                                    cursor: "pointer"
                                }}>
                                {row.quantity != null ? row.quantity : 0}
                            </span>
                        </a>
                    );
                }
                return 0;
            }
            else {
                return (
                    <span>
                        {row.quantity != null ? row.quantity : 0}
                    </span>
                );
            }
        };

        let editStock = ({ value, row }) => {
            if (Config.IsAllow(117)) {

                if (row) {
                    return (
                        <a className="editorCell">
                            <span
                                style={{
                                    padding: "0 6px",
                                    margin: "5px 0",
                                    border: "1px dashed",
                                    cursor: "pointer"
                                }}>
                                {row.stock != null ? row.stock : 0}
                            </span>
                        </a>
                    );
                }
                return 0;
            } else {
                return (
                    <span>
                        {row.stock != null ? row.stock : 0}
                    </span>
                );
            }
        };
        this.itemsColumns = [
            {
                field: 'id',
                title: "",
                width: 10,
                groupable: true,
                fixed: true,
                type: "check-box"
            },
            {
                field: 'arrange',
                title: Resources['arrange'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "number",
                sortable: true,
            },
            {
                field: 'details',
                title: Resources['details'][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'quantity',
                title: Resources['quantity'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "input",
                sortable: true,
                handleChange: (e, cell) => {
                    let cellInstance = Object.assign({}, cell);
                    cellInstance.quantity = parseFloat(e.target.value);
                    let items = JSON.parse(JSON.stringify(this.state._items));
                    let cellIndex = items.findIndex(c => c.id == cell.id);
                    items[cellIndex] = cellInstance;
                    this.setState({
                        _items: items,
                    });
                },
                handleBlur: (e, cell) => {
                    this._onGridQuantityUpdated(cell);
                }
            },
            {
                field: 'stock',
                title: Resources['stock'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "input",
                sortable: true,
                handleChange: (e, cell) => {
                    let cellInstance = Object.assign({}, cell);
                    cellInstance.stock = parseFloat(e.target.value);
                    let items = JSON.parse(JSON.stringify(this.state._items));
                    let cellIndex = items.findIndex(c => c.id == cell.id);
                    items[cellIndex] = cellInstance;
                    this.setState({
                        _items: items,
                    });
                },
                handleBlur: (e, cell) => {
                    this._onGridStockUpdated(cell);
                }
            },
            {
                field: 'unit',
                title: Resources['unit'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'days',
                title: Resources['days'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "number",
                sortable: true,
            },
            {
                field: 'resourceCode',
                title: Resources['resourceCode'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'itemCode',
                title: Resources['itemCode'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }
        ];

        this.actions = [
            {
                title: 'Delete',
                handleClick: values => {
                    this.clickHandlerDeleteRowsMain(values);
                }
            }
        ]
        this.state = {
            pageNumber: 0,
            pageSize: 500,
            updatedItems: [],
            updatedchilderns: [],
            selectedRows: [],
            childerns: [],
            MRItems: [],
            materialTypes: [
                { label: Resources.actions[currentLanguage], value: 0 },
                { label: Resources.newBoq[currentLanguage], value: 1 },
                { label: Resources.addContract[currentLanguage], value: 2 },
                { label: Resources.addPurchaseOrder[currentLanguage], value: 3 },
                { label: Resources.addMaterialRelease[currentLanguage], value: 4 }
            ],
            materialType: { label: Resources.actions[currentLanguage], value: 0 },
            _items: [],
            M_arrange: 0,
            isEdit: false,
            showContractModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 88,
            docType: 51,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            contacts: [],
            discplines: [],
            items: [],
            siteRequests: [],
            releaseTypes: [],
            specsSections: [],
            contractBoqs: [],
            permission: [
                { name: "sendByEmail", code: 122 },
                { name: "sendByInbox", code: 121 },
                { name: "sendTask", code: 0 },
                { name: "distributionList", code: 973 },
                { name: "createTransmittal", code: 3059 },
                { name: "sendToWorkFlow", code: 721 },
                { name: "viewAttachments", code: 3282 },
                { name: "deleteAttachments", code: 852 }
            ],
            fromCompany: {
                label: Resources.fromCompanyRequired[currentLanguage],
                value: "0"
            },
            M_fromCompany: {
                label: Resources.fromCompanyRequired[currentLanguage],
                value: "0"
            },
            M_contact: {
                label: Resources.fromContactRequired[currentLanguage],
                value: "0"
            },
            M_specsSection: {
                label: Resources.specsSectionSelection[currentLanguage],
                value: "0"
            },
            M_releaseType: {
                label: Resources.materialReleaseTypeSelection[currentLanguage],
                value: "0"
            },
            M_siteRequest: {
                label: Resources.siteRequestSelection[currentLanguage],
                value: "0"
            },
            M_contractBoq: {
                label: Resources.boqLog[currentLanguage],
                value: "0"
            },
            
            boqLog: { label: Resources.selectBoq[currentLanguage], value: "0" },
             //added
             selectedContract:{
                label:Resources.selectContract[currentLanguage],
                value:"0",
                boqId:"0"
            },
            area: { label: Resources.selectArea[currentLanguage], value: "0" },
            location: {
                label: Resources.locationRequired[currentLanguage],
                value: "0"
            },
            discipline: {
                label: Resources.disciplineRequired[currentLanguage],
                value: "0"
            },
            buildingNumber: {
                label: Resources.buildingNumberSelection[currentLanguage],
                value: "0"
            },
            apartmentNo: {
                label: Resources.apartmentNumberSelection[currentLanguage],
                value: "0"
            },
            CurrStep: 0,
            updatedItem: null,
            contractLoading: false,
            showPoModal: false,
            inventoryTable: [],
            showInventory: false,
            normalItems: {
                requestId: null,
                details: null,
                arrange: null,
                unit: null,
                quantity: null,
                stock: null,
                resourceCode: null,
                itemType: null,
                action: null,
                days: null,
                revQuantity: null,
                itemCode: null,
                unitPrice: null
            },
            itemTypesList: [],
            contractBoqLogs:[],
            unitsList: [],
            selectedItemType: null,
            selectedUnit: null,
            inventoryFilter: {
                description: null,
                resourceCode: null
            },
            updatedItemsInventoryTable: [],
            updatedItemInventoryTable: null
        };

        if (!Config.IsAllow(116) && !Config.IsAllow(117) && !Config.IsAllow(118)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
    }

    renderEditable = cellInfo => {
        if (Config.IsAllow(117)) {
            if (cellInfo.original.childerns.length == 0) {
                return (
                    <div style={{ color: "#4382f9 ", padding: "0px 6px", margin: "5px 0px", border: "1px dashed", cursor: "pointer" }}
                        contentEditable suppressContentEditableWarning
                        onBlur={e => {
                            const items = [...this.state.items];
                            items[cellInfo.index][cellInfo.column.id] =
                                e.target.innerHTML;
                            const updatedItem = items[cellInfo.index];
                            const updatedItems = this.state.updatedItems;
                            let index = updatedItems.findIndex(
                                item => item.id == updatedItem.id
                            );
                            if (index != -1) updatedItems[index] = updatedItem;
                            else updatedItems.push(updatedItem);
                            this.setState({ items, updatedItem, updatedItems });
                        }}
                        dangerouslySetInnerHTML={{
                            __html: this.state.items[cellInfo.index][
                                cellInfo.column.id
                            ]
                        }}
                    />
                );
            } else {
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: this.state.items[cellInfo.index][
                                cellInfo.column.id
                            ]
                        }}
                    />
                );
            }
        } else {
            return (
                <div
                    dangerouslySetInnerHTML={{
                        __html: this.state.items[cellInfo.index][
                            cellInfo.column.id
                        ]
                    }}
                />
            );
        }
    };
    renderEditableInventoryfilter = cellInfo => {
        if (Config.IsAllow(117)) {
            if (cellInfo.original.parentId == null) {
                return (
                    <div style={{ color: "#4382f9 ", padding: "0px 6px", margin: "5px 0px", border: "1px dashed", cursor: "pointer" }}
                        contentEditable suppressContentEditableWarning
                        onBlur={e => {
                            const inventoryTable = [...this.state.inventoryTable];
                            inventoryTable[cellInfo.index][cellInfo.column.id] =
                                e.target.innerHTML;
                            const updatedItemInventoryTable = inventoryTable[cellInfo.index];
                            const updatedItemsInventoryTable = this.state.updatedItemsInventoryTable;
                            let index = updatedItemsInventoryTable.findIndex(
                                item => item.id == updatedItemInventoryTable.id
                            );
                            if (index != -1) updatedItemsInventoryTable[index] = updatedItemInventoryTable;
                            else updatedItemsInventoryTable.push(updatedItemInventoryTable);
                            this.setState({ inventoryTable, updatedItemInventoryTable, updatedItemsInventoryTable });
                        }}
                        dangerouslySetInnerHTML={{
                            __html: this.state.inventoryTable[cellInfo.index][
                                cellInfo.column.id
                            ]
                        }}
                    />
                );
            } else {
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: this.state.inventoryTable[cellInfo.index][
                                cellInfo.column.id
                            ]
                        }}
                    />
                );
            }
        } else {
            return (
                <div
                    dangerouslySetInnerHTML={{
                        __html: this.state.items[cellInfo.index][
                            cellInfo.column.id
                        ]
                    }}
                />
            );
        }
    };

    renderEditableQuantity = cellInfo => {
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
                    const updatedItem = this.state.MRItems[cellInfo.index]
                        .quantity;
                    const MRItems = [...this.state.MRItems];
                    if (
                        this.state.MRItems[cellInfo.index].quantity <
                        parseInt(e.target.innerHTML, 10) ||
                        this.state.MRItems[cellInfo.index].stock <
                        parseInt(e.target.innerHTML, 10)
                    ) {
                        toast.error(
                            "Quantity Cannot more Than Quantity and Stock Quantity "
                        );
                    } else {
                        MRItems[cellInfo.index][cellInfo.column.id] =
                            e.target.innerHTML;
                        updatedItem = MRItems[cellInfo.index];
                    }
                    this.setState({ MRItems, updatedItem });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.MRItems[cellInfo.index].quantity
                }}
            />
        );
    };

    editChildren = cellInfo => {
        return (
            <div style={{ color: "#4382f9 ", padding: "0px 6px", margin: "5px 0px", border: "1px dashed", cursor: "pointer" }}
                contentEditable suppressContentEditableWarning
                onBlur={e => {
                    const items = [...this.state.childerns];
                    items[cellInfo.index][cellInfo.column.id] =
                        e.target.innerHTML;
                    const updatedItem = items[cellInfo.index];
                    const updatedchilderns = this.state.updatedchilderns;
                    let index = updatedchilderns.findIndex(
                        item => item.id == updatedItem.id
                    );
                    if (index != -1) updatedchilderns[index] = updatedItem;
                    else updatedchilderns.push(updatedItem);
                    this.setState({ childerns: items, updatedchilderns });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.childerns[cellInfo.index][
                        cellInfo.column.id
                    ]
                }}
            />
        );
    };

    componentDidMount() {
        dataservice.GetDataList("GetaccountsDefaultListWithAction?listType=estimationitemtype", "title", "action").then(result => {
            this.setState({ itemTypesList: result });
        });
        dataservice.GetDataList("GetAccountsDefaultList?listType=unit&pageNumber=" + 0 + "&pageSize=10000", "title", "title").then(result => {
            this.setState({ unitsList: result });
        });
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
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id != this.props.document.id) {
            let doc = nextProps.document;
            doc.docDate =
                doc.docDate === null
                    ? moment().format("YYYY-MM-DD")
                    : moment(doc.docDate).format("YYYY-MM-DD");
            doc.requiredDate =
                doc.requiredDate === null
                    ? moment().format("YYYY-MM-DD")
                    : moment(doc.requiredDate).format("YYYY-MM-DD");
            this.setState({
                document: doc,
                hasWorkflow: nextProps.hasWorkflow
            });
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
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
        if (
            this.props.hasWorkflow !== prevProps.hasWorkflow ||
            this.props.changeStatus !== prevProps.changeStatus
        ) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(119)) {
                this.setState({ isViewMode: true });
            }

            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (this.state.isApproveMode != true && Config.IsAllow(119)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(119)) {
                        if (this.props.document.status != false && Config.IsAllow(119)) {
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

    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetContractsSiteRequestForEdit?id=" + this.state.docId;
            this.props.actions.documentForEdit(
                url,
                this.state.docTypeId,
                "procurement"
            );
            Api.get(
                "GetContractsSiteRequestItemsByRequestIdUsingPaging?requestId=" +
                this.state.docId +
                "&pageNumber=" +
                this.state.pageNumber +
                "&pageSize=" +
                this.state.pageSize
            ).then(res => {
                if (res) {
                    let maxArrange = res.length > 0 ? Math.max.apply(Math, res.map(function (o) { return o.arrange; })) : 0
                    let resetNormal = {
                        details: null,
                        arrange: maxArrange + 1,
                        unit: null,
                        quantity: null,
                        stock: null,
                        resourceCode: null,
                        itemType: null,
                        action: null,
                        days: null,
                        revQuantity: null,
                        itemCode: null,
                        unitPrice: null
                    }
                    this.setState({ _items: res, normalItems: resetNormal });
                    this.props.actions.ExportingData({ items: res });
                }
            });
            this.setState({ isEdit: true });
            this.getMarterialArrange();
        } else {
            let materialRequest = {
                subject: "",
                id: 0,
                projectId: this.state.projectId,
                arrange: 1,
                fromCompany: "",
                discipline: "",
                docDate: moment(),
                requiredDate: moment(),
                showInDashboard: false,
                useQntyRevised: false,
                status: true
            };
            let normalItems = this.state.normalItems;
            normalItems.arrange = 1;
            this.setState({ document: materialRequest, normalItems: normalItems });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    }

    getNextArrange(companyId) {
        this.setState({ isLoading: true });
        Api.get(
            "GetNextArrangeMainDoc?projectId=" +
            this.state.projectId +
            "&docType=" +
            this.state.docTypeId +
            "&companyId=" +
            companyId +
            "&&contactId=undefined"
        ).then(arrange => {
            this.setState({
                document: { ...this.state.document, arrange },
                isLoading: false
            });
        });
    }

    fillDropDowns(isEdit) {
        this.setState({ isLoading: true });
        dataservice
            .GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId")
            .then(result => {
                if (isEdit) {
                    let companyId = this.props.document.companyId;
                    if (companyId) {
                        this.setState({
                            fromCompany: {
                                label: this.props.document.companyName,
                                value: companyId
                            }
                        });
                    }
                }
                this.setState({
                    companies: [...result],
                    isLoading: false
                });
            });
        this.setState({ isLoading: true });
        dataservice
            .GetDataList("GetContractsBoqShowInSiteRequest?projectId=" + this.state.projectId, "subject", "boqId")
            .then(result => {
                if (isEdit) {
                    let boqId = this.props.document.boqId;
                    this.GetBoqItemsStracture(boqId);
                    if (boqId) {
                        let boq = result.find(function (item) {
                            return item.value == boqId;
                        });
                        this.setState({
                            boqLog: boq
                        });
                    }
                }
                this.setState({
                    boqLogs: [...result],
                    isLoading: false
                });
            });
            //added
            this.setState({ isLoading: true });
            dataservice
                .GetDataListForContract("GetContractsWithBoqsForDrop?projectId=" + this.state.projectId, "subject", "id","boqId")
                .then(result => {
                    
                    if (isEdit) {
                        let boqId = this.props.document.boqId;
                        this.GetBoqItemsStracture(boqId);
                        if (boqId) {
                            let contract = result.find(function (item) {
                                return item.boqId == boqId;
                            });
                            this.setState({
                                selectedContract: contract
                            });
                        }
                    }
                    this.setState({
                        contractBoqLogs: result,
                        isLoading: false
                    });
                });
        this.setState({ isLoading: true });
        dataservice
            .GetDataListCached(
                "GetAccountsDefaultListForList?listType=discipline",
                "title",
                "id", 'defaultLists', "discipline", "listType"
            )
            .then(result => {
                if (isEdit) {
                    let disciplineId = this.props.document.disciplineId;
                    if (disciplineId) {
                        this.setState({
                            discipline: {
                                label: this.props.document.disciplineName,
                                value: disciplineId
                            }
                        });
                    }
                }
                this.setState({
                    discplines: [...result],
                    isLoading: false
                });
            });
        this.setState({ isLoading: true });
        dataservice
            .GetDataListCached(
                "GetAccountsDefaultListForList?listType=buildingno",
                "title",
                "id", 'defaultLists', "buildingno", "listType"
            )
            .then(result => {
                if (isEdit) {
                    let buildingNoId = this.props.document.buildingNoId;
                    if (buildingNoId) {
                        this.setState({
                            buildingNumber: {
                                label: this.props.document.buildingNo,
                                value: buildingNoId
                            }
                        });
                    }
                }
                this.setState({
                    buildings: [...result],
                    isLoading: false
                });
            });
        this.setState({ isLoading: true });
        dataservice
            .GetDataListCached(
                "GetAccountsDefaultListForList?listType=apartmentno",
                "title",
                "id", 'defaultLists', "apartmentno", "listType"
            )
            .then(result => {
                if (isEdit) {
                    let apartmentNoId = this.props.document.apartmentNoId;
                    if (apartmentNoId) {
                        this.setState({
                            apartmentNo: {
                                label: this.props.document.apartmentNo,
                                value: apartmentNoId
                            }
                        });
                    }
                }
                this.setState({
                    apartmentNumbers: [...result],
                    isLoading: false
                });
            });
        this.setState({ isLoading: true });
        dataservice
            .GetDataListCached(
                "GetAccountsDefaultListForList?listType=location",
                "title",
                "id", 'defaultLists', "location", "listType"
            )
            .then(result => {
                if (isEdit) {
                    let location = this.props.document.location;
                    if (location) {
                        this.setState({
                            location: {
                                label: this.props.document.location,
                                value: 0
                            }
                        });
                    }
                }
                this.setState({
                    locations: [...result],
                    isLoading: false
                });
            });
        this.setState({ isLoading: true });
        dataservice
            .GetDataListCached(
                "GetAccountsDefaultListForList?listType=area",
                "title",
                "id", 'defaultLists', "area", "listType"
            )
            .then(result => {
                if (isEdit) {
                    let area = this.props.document.area;
                    if (area) {
                        this.setState({
                            area: { label: this.props.document.area, value: 0 }
                        });
                    }
                }
                this.setState({
                    areas: [...result],
                    isLoading: false
                });
            });
        this.setState({ isLoading: true });
        dataservice
            .GetDataListCached(
                "GetAccountsDefaultListForList?listType=specsSection",
                "title",
                "id", 'defaultLists', "specsSection", "listType"
            )
            .then(result => {
                if (result)
                    this.setState({
                        specsSections: [...result],
                        isLoading: false
                    });
            });
        this.setState({ isLoading: true });
        dataservice
            .GetDataListCached(
                "GetAccountsDefaultListForList?listType=materialtitle",
                "title",
                "id", 'defaultLists', "materialtitle", "listType"
            )
            .then(result => {
                if (result)
                    this.setState({
                        releaseTypes: [...result],
                        isLoading: false
                    });
            });
        this.setState({ isLoading: true });
        Api.get(
            "GetContractsBoq?projectId=" +
            this.state.projectId +
            "&pageNumber=0&pageSize=10000"
        ).then(result => {
            if (result.data) {
                let data = [];
                let temp = result.data;
                temp.forEach(element => {
                    data.push({ label: element.subject, value: element.id });
                });
                this.setState({
                    contractBoqs: [...data],
                    isLoading: false
                });
            }
        });

        this.setState({ isLoading: true });
        Api.get(
            "GetContractsSiteRequestByProjectId?projectId=" +
            this.state.projectId +
            "&pageNumber=0&pageSize=1000"
        ).then(result => {
            if (result.data) {
                let data = [];
                let temp = result.data;
                temp.forEach(element => {
                    data.push({ label: element.subject, value: element.id });
                });
                this.setState({
                    siteRequests: [...data],
                    isLoading: false
                });
            }
        });
    }

    GetBoqItemsStracture(boqId) {
        this.setState({ isLoading: true });
      
        Api.get("GetBoqItemsStracture?boqId=" + boqId)
            .then(res => {
                if (res) this.setState({ items: res, isLoading: false });
                else this.setState({ items: [], isLoading: false });
            })
            .catch(() => this.setState({ items: [], isLoading: false }));
    }
    fillInventoryItemsFilterTable() {
        let obj = { ...this.state.inventoryFilter };
        let obje = {};
        Object.entries(obj).reduce((a, [key, val]) => {
            if (val) {
                obje[key] = val;
            }
        }, []);
        console.log("obje", obje)
        let StringfiedObj = JSON.stringify(obje);
        this.setState({ isLoading: true })
        Api.get(`GetInventoryListByFilter?projectId=${this.state.projectId}&query=${StringfiedObj}`).then(res => {
            this.setState({
                inventoryTable: res,
                isLoading: false
            })
        })
    }
    handleChangeInventoryFilterInput(e, field) {
        let original_document = { ...this.state.inventoryFilter };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            inventoryFilter: updated_document
        });
    }
    handleChangeNormalInput(e, field) {
        let original_document = { ...this.state.normalItems };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            normalItems: updated_document
        });
    }
    handleChangeNormalDropdown(event, field, selected) {
        let original_document = { ...this.state.normalItems };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            normalItems: updated_document,
            [selected]: event
        });
    }

    handleChange(e, field) {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = e.target.value;
        updated_document = Object.assign(original_document, updated_document);
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

    handleCheckBox(e) {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document["useQntyRevised"] = !this.state.document
            .useQntyRevised;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document
        });
    }

    getMarterialArrange() {
        this.setState({ isLoading: true });
        Api.get(
            "GetNextArrangeMainDoc?projectId=" +
            this.state.projectId +
            "&docType=" +
            this.state.docType +
            "&companyId=undefined&contactId=undefined"
        ).then(arrange => {
            this.setState({ M_arrange: arrange, isLoading: false });
        });
    }

    editMaterialRequest(event) {
        this.setState({ isLoading: true });
        let saveDocument = { ...this.state.document };
        saveDocument.docDate = moment(
            saveDocument.docDate,
            "YYYY-MM-DD"
        ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.requiredDate = moment(
            saveDocument.requiredDate,
            "YYYY-MM-DD"
        ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.boqId = this.state.selectedContract.boqId;
        saveDocument.companyId = this.state.fromCompany.value;
       // saveDocument.contractName=this.selectedContract.contr
        saveDocument.area = this.state.area.label;
        saveDocument.location = this.state.location.label;
        saveDocument.disciplineId = this.state.discipline.value;
        saveDocument.buildingNoId = this.state.buildingNumber.value;
        saveDocument.apartmentNoId = this.state.apartmentNo.value;
        saveDocument.companyName = this.state.fromCompany.value;
        saveDocument.id = this.state.docId;
        dataservice
            .addObject("EditContractsSiteRequest", saveDocument)
            .then(result => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.changeCurrentStep(1);
                this.setState({
                    isLoading: false
                });
            })
            .catch(() => {
                this.setState({ isLoading: false });
                toast.success(Resources["operationCanceled"][currentLanguage]);
            });
    }

    saveMaterialReques(event) {
        if (this.state.selectedContract.value != "0"&&this.state.selectedContract.boqId != "0") {
            if (this.state.items.length > 0) {
                this.setState({ isLoading: true });
                let saveDocument = { ...this.state.document };
                saveDocument.docDate = moment(
                    saveDocument.docDate,
                    "YYYY-MM-DD"
                ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
                saveDocument.requiredDate = moment(
                    saveDocument.requiredDate,
                    "YYYY-MM-DD"
                ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
                saveDocument.boqId = this.state.selectedContract.boqId;
                saveDocument.companyId = this.state.fromCompany.value;
                saveDocument.companyName = this.state.fromCompany.value;
                saveDocument.area = this.state.area.label;
                saveDocument.location = this.state.location.label;
                saveDocument.disciplineId = this.state.discipline.value;
                saveDocument.disciplineName = this.state.discipline.label;
                saveDocument.buildingNoId = this.state.buildingNumber.value;
                saveDocument.apartmentNoId = this.state.apartmentNo.value;
                dataservice
                    .addObject("AddContractsSiteRequest", saveDocument)
                    .then(result => {
                        this.setState({ docId: result.id, isLoading: false });
                        toast.success(
                            Resources["operationSuccess"][currentLanguage]
                        );
                    })
                    .catch(() => {
                        this.setState({ isLoading: false });
                        toast.success(
                            Resources["operationCanceled"][currentLanguage]
                        );
                    });
            } else {
                toast.info("this boq not have items choice another boq");
            }
        } else {
            this.setState({ isLoading: true });
            let saveDocument = { ...this.state.document };
            saveDocument.docDate = moment(
                saveDocument.docDate,
                "YYYY-MM-DD"
            ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            saveDocument.requiredDate = moment(
                saveDocument.requiredDate,
                "YYYY-MM-DD"
            ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
            saveDocument.boqId = this.state.selectedContract.boqId;
            saveDocument.companyId = this.state.fromCompany.value;
            saveDocument.companyName = this.state.fromCompany.value;
            saveDocument.area = this.state.area.label;
            saveDocument.location = this.state.location.label;
            saveDocument.disciplineId = this.state.discipline.value;
            saveDocument.disciplineName = this.state.discipline.label;
            saveDocument.buildingNoId = this.state.buildingNumber.value;
            saveDocument.apartmentNoId = this.state.apartmentNo.value;
            dataservice
                .addObject("AddContractsSiteRequest", saveDocument)
                .then(result => {
                    this.setState({ docId: result.id, isLoading: false });
                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                })
                .catch(() => {
                    this.setState({ isLoading: false });
                    toast.success(
                        Resources["operationCanceled"][currentLanguage]
                    );
                });
        }
    }

    saveAndExit(event) {
        this.changeCurrentStep(1);
    }

    showBtnsSaving() {
        // && this.props.changeStatus === true
        let btn = null;
        if (Config.IsAllow(117) || Config.IsAllow(116)) {
            if (this.state.docId === 0) {
                btn = (
                    <button className="primaryBtn-1 btn meduimBtn" type="submit">
                        {Resources.save[currentLanguage]}
                    </button>
                );
            } else if (this.state.docId > 0) {
                btn = (
                    <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"}>
                        {Resources.next[currentLanguage]}
                    </button>
                );
            }
        }

        return btn;
    }

    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(3282) === true ? (
                <ViewAttachment isApproveMode={this.state.isViewMode}
                    docTypeId={this.state.docTypeId}
                    docId={this.state.docId}
                    projectId={this.state.projectId}
                    deleteAttachments={852}
                />
            ) : null
        ) : null;
    }

    actionsChange(event) {
        switch (event.value) {
            case 1:
                this.setState({ isLoading: true });
                Api.post("AddNewBoq?id=" + this.state.docId)
                    .then(() => {
                        toast.success(
                            Resources["operationSuccess"][currentLanguage]
                        );
                        this.props.history.push({
                            pathname: "/siteRequest/" + this.state.projectId
                        });
                    })
                    .catch(() => {
                        toast.error(
                            Resources["operationCanceled"][currentLanguage]
                        );
                    });
                break;
            case 2:
                this.setState({ showContractModal: true });
                this.simpleDialog1.show();
                break;
            case 3:
                this.setState({ showPoModal: true });
                this.simpleDialog2.show();
                break;
            case 4:
                if (Config.IsAllow(3675)) {
                    this.setState({ isLoading: true });
                    Api.get(
                        "GetContractsSiteRequestItemsByRequestId?requestId=" +
                        this.state.docId
                    ).then(res => {
                        if (res) {
                            this.setState({
                                showMRModal: true,
                                MRItems: res,
                                isLoading: false
                            });
                            this.simpleDialog3.show();
                        }
                    });
                }
                break;
        }
    }
    addOneItem = () => {
        let length = this.state.updatedItems.length;
        let item = this.state.normalItems;
        if (item.quantity > 0) {
            this.setState({ isLoading: true });
            item.requestId = this.state.docId;
            Api.post("AddContractsSiteRequestItems", item).then(() => {
                const _items = this.state._items;
                _items.push(item);
                let maxArrange = Math.max.apply(Math, _items.map(function (o) { return o.arrange; }))
                let resetNormal = {
                    details: null,
                    arrange: maxArrange + 1,
                    unit: null,
                    quantity: null,
                    stock: null,
                    resourceCode: null,
                    itemType: null,
                    action: null,
                    days: null,
                    revQuantity: null,
                    itemCode: null,
                    unitPrice: null
                }
                this.setState({
                    _items,
                    normalItems: resetNormal,
                    isLoading: false,
                    updatedItems: [],
                    showChildren: false

                });
                this.props.actions.resetItems(_items);

                let items = [];
                this.state.items.forEach(element => {
                    items.push({ ...element, quantity: 0, stock: 0 });
                });
                this.setState({ items });

            });
        }

    };
    addManyItem = () => {
        let length = this.state.updatedItemsInventoryTable.length;
        this.state.updatedItemsInventoryTable.forEach((item, index) => {
            if (item.quantity > 0) {
                this.setState({ isLoading: true });
                item.requestId = this.state.docId;
                item.days == null ? item.days = 1 : item.days = item.days;
                item.details = item.description;
                Api.post("AddContractsSiteRequestItems", item).then(() => {
                    const _items = this.state._items;
                    _items.push(item);
                    this.setState({
                        _items,
                        isLoading: false,
                        updatedItemsInventoryTable: [],
                        showChildren: false
                    });
                    this.props.actions.resetItems(_items);
                    if (index == length - 1) {
                        let inventoryTable = [];
                        this.state.inventoryTable.forEach(element => {
                            inventoryTable.push({ ...element, quantity: 0, stock: 0 });
                        });
                        this.setState({ inventoryTable });
                    }
                });
            }
        });
        let maxArrange = Math.max.apply(Math, this.state._items.map(function (o) { return o.arrange; }))
        let resetNormal = {
            details: null,
            arrange: maxArrange + 1,
            unit: null,
            quantity: null,
            stock: null,
            resourceCode: null,
            itemType: null,
            action: null,
            days: null,
            revQuantity: null,
            itemCode: null,
            unitPrice: null
        }
        this.setState({ normalItems: resetNormal })
    };
    addItem = () => {
        let length = this.state.updatedItems.length;
        this.state.updatedItems.forEach((item, index) => {
            if (item.quantity > 0) {
                this.setState({ isLoading: true });
                item.requestId = this.state.docId;
                Api.post("AddContractsSiteRequestItems", item).then(() => {
                    const _items = this.state._items;
                    _items.push(item);
                    this.setState({
                        _items,
                        isLoading: false,
                        updatedItems: [],
                        showChildren: false
                    });
                    this.props.actions.resetItems(_items);
                    if (index == length - 1) {
                        let items = [];
                        this.state.items.forEach(element => {
                            items.push({ ...element, quantity: 0, stock: 0 });
                        });
                        this.setState({ items });
                    }
                });
            }
        });
    };
    renderNormalItems = () => {
        return (
            <Formik
                enableReinitialize={true}
                initialValues={{ ...this.state.normalItems }}
                validationSchema={normalItemsSchema}
                onSubmit={() => {
                    this.addOneItem();
                }}>
                {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                    <Form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate">
                        <div className="linebylineInput fullInputWidth">
                            <label className="control-label">
                                {Resources["description"][currentLanguage]}{" "}
                            </label>
                            <div className={"inputDev ui input " + (errors.details ? "has-error" : !errors.details && touched.details ? " has-success" : " ")}>
                                <input name="details"
                                    className="form-control"
                                    id="details"
                                    placeholder={
                                        Resources["description"][
                                        currentLanguage
                                        ]
                                    }
                                    autoComplete="off"
                                    onBlur={handleBlur}
                                    defaultValue={this.state.normalItems.details}
                                    value={this.state.normalItems.details}
                                    onChange={e => this.handleChangeNormalInput(e, "details")}
                                />
                                {errors.details ? (
                                    <em className="pError">
                                        {errors.details}
                                    </em>
                                ) : null}
                            </div>
                        </div>
                        <div className="linebylineInput fullInputWidth">
                            <label className="control-label">
                                {Resources["quantity"][currentLanguage]}{" "}
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
                                    name="quantity"
                                    className="form-control"
                                    id="quantity"
                                    placeholder={
                                        Resources["quantity"][
                                        currentLanguage
                                        ]
                                    }
                                    autoComplete="off"
                                    onBlur={handleBlur}
                                    defaultValue={this.state.normalItems.quantity}
                                    value={this.state.normalItems.quantity}
                                    onChange={e => this.handleChangeNormalInput(e, "quantity")}
                                />
                                {errors.quantity ? (
                                    <em className="pError">
                                        {errors.quantity}
                                    </em>
                                ) : null}
                            </div>
                        </div>
                        <div className="linebylineInput fullInputWidth">
                            <label className="control-label">
                                {Resources["stock"][currentLanguage]}{" "}
                            </label>
                            <div
                                className={
                                    "inputDev ui input " +
                                    (errors.stock
                                        ? "has-error"
                                        : !errors.stock &&
                                            touched.stock
                                            ? " has-success"
                                            : " ")
                                }>
                                <input
                                    name="stock"
                                    className="form-control"
                                    id="stock"
                                    placeholder={
                                        Resources["stock"][
                                        currentLanguage
                                        ]
                                    }
                                    autoComplete="off"
                                    onBlur={handleBlur}
                                    defaultValue={this.state.normalItems.stock}
                                    value={this.state.normalItems.stock}
                                    onChange={e => this.handleChangeNormalInput(e, "stock")}
                                />
                                {errors.stock ? (
                                    <em className="pError">
                                        {errors.stock}
                                    </em>
                                ) : null}
                            </div>
                        </div>
                        <div className="linebylineInput">
                            <label className="control-label">
                                {Resources["arrange"][currentLanguage]}{" "}
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
                                    name="arrange"
                                    className="form-control"
                                    id="arrange"
                                    placeholder={
                                        Resources["arrange"][
                                        currentLanguage
                                        ]
                                    }
                                    autoComplete="off"
                                    onBlur={handleBlur}
                                    defaultValue={this.state.normalItems.arrange}
                                    value={this.state.normalItems.arrange}
                                    onChange={e => this.handleChangeNormalInput(e, "arrange")}
                                />
                                {errors.arrange ? (
                                    <em className="pError">
                                        {errors.arrange}
                                    </em>
                                ) : null}
                            </div>
                        </div>
                        <div className="linebylineInput">
                            <label className="control-label">
                                {Resources["itemCode"][currentLanguage]}{" "}
                            </label>
                            <div
                                className={
                                    "inputDev ui input " +
                                    (errors.itemCode
                                        ? "has-error"
                                        : !errors.itemCode &&
                                            touched.itemCode
                                            ? " has-success"
                                            : " ")
                                }>
                                <input
                                    name="itemCode"
                                    className="form-control"
                                    id="itemCode"
                                    placeholder={
                                        Resources["itemCode"][
                                        currentLanguage
                                        ]
                                    }
                                    autoComplete="off"
                                    onBlur={handleBlur}
                                    defaultValue={this.state.normalItems.itemCode}
                                    value={this.state.normalItems.itemCode}
                                    onChange={e => this.handleChangeNormalInput(e, "itemCode")}
                                />
                                {errors.itemCode ? (
                                    <em className="pError">
                                        {errors.itemCode}
                                    </em>
                                ) : null}
                            </div>
                        </div>
                        <div className="linebylineInput valid-input">
                            <Dropdown
                                title="itemType"
                                data={this.state.itemTypesList}
                                selectedValue={this.state.selectedItemType}
                                value={this.state.normalItems.selectedItemType}
                                handleChange={event => {
                                    this.handleChangeNormalDropdown(event, "itemType", "selectedItemType");
                                }}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.itemType}
                                touched={touched.itemType}
                            />
                        </div>
                        <div className="linebylineInput">
                            <label className="control-label">
                                {Resources["resourceCode"][currentLanguage]}{" "}
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
                                    id="resourceCode"
                                    placeholder={
                                        Resources["resourceCode"][
                                        currentLanguage
                                        ]
                                    }
                                    autoComplete="off"
                                    onBlur={handleBlur}
                                    defaultValue={this.state.normalItems.resourceCode}
                                    value={this.state.normalItems.resourceCode}
                                    onChange={e => this.handleChangeNormalInput(e, "resourceCode")}
                                />
                                {errors.resourceCode ? (
                                    <em className="pError">
                                        {errors.resourceCode}
                                    </em>
                                ) : null}
                            </div>
                        </div>
                        <div className="linebylineInput valid-input">
                            <Dropdown
                                title="unit"
                                data={this.state.unitsList}
                                selectedValue={this.state.selectedUnit}
                                value={this.state.selectedUnit}
                                handleChange={event => {
                                    this.handleChangeNormalDropdown(event, "unit", "selectedUnit")
                                }}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.unit}
                                touched={touched.unit}
                            />
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
                                    <button
                                        className="primaryBtn-1 btn meduimBtn"
                                        type="submit">

                                        {Resources.add[currentLanguage]}
                                    </button>
                                )}
                        </div>
                    </Form>
                )}
            </Formik>
        );
    };
    renderInventory = () => {
        return (
            <div>
                <div className="proForm datepickerContainer">
                    <div className="linebylineInput ">
                        <label className="control-label">
                            {Resources["description"][currentLanguage]}{" "}
                        </label>
                        <div className={"inputDev ui input "}>
                            <input name="description" className="form-control" id="description" placeholder={Resources["description"][currentLanguage]}
                                defaultValue={this.state.inventoryFilter.description}
                                onChange={e => this.handleChangeInventoryFilterInput(e, "description")}
                            />
                        </div>
                    </div>
                    <div className="linebylineInput ">
                        <label className="control-label">
                            {Resources["resourceCode"][currentLanguage]}{" "}
                        </label>
                        <div className={"inputDev ui input "}>
                            <input name="resourceCode" className="form-control" id="resourceCode" placeholder={Resources["resourceCode"][currentLanguage]} defaultValue={this.state.inventoryFilter.resourceCode}
                                onChange={e => this.handleChangeInventoryFilterInput(e, "resourceCode")}
                            />
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
                                <button
                                    className="primaryBtn-1 btn meduimBtn"
                                    type="submit"
                                    onClick={() => this.fillInventoryItemsFilterTable()}>
                                    {Resources.search[currentLanguage]}
                                </button>
                            )}
                    </div>
                </div>
                <ReactTable
                    data={this.state.inventoryTable}
                    columns={[
                        {
                            Header: Resources.description[currentLanguage],
                            accessor: "description"
                        },
                        {
                            Header: Resources.resourceCode[currentLanguage],
                            accessor: "resourceCode"
                        },
                        {
                            Header: Resources.unit[currentLanguage],
                            accessor: "unit"
                        },
                        {
                            Header: Resources.unitPrice[currentLanguage],
                            accessor: "unitPrice"
                        },
                        {
                            Header: Resources.quantity[currentLanguage],
                            accessor: "quantity",
                            Cell: this.renderEditableInventoryfilter
                        },
                        {
                            Header: Resources.itemCode[currentLanguage],
                            accessor: "itemCode"
                        }
                    ]}
                    defaultPageSize={5}
                    className="-striped -highlight"
                />
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
                            <button
                                className="primaryBtn-1 btn meduimBtn"
                                type="submit"
                                onClick={() => this.addManyItem()}>
                                {Resources.add[currentLanguage]}
                            </button>
                        )}
                </div>
            </div>
        )
    }

    addChild = () => {
        let length = this.state.updatedchilderns.length;
        this.state.updatedchilderns.forEach((item, index) => {
            if (item.quantity > 0) {
                this.setState({ isLoading: true });
                let updatedItem = { ...item };
                updatedItem.requestId = this.state.docId;
                Api.post("AddContractsSiteRequestItems", updatedItem).then(
                    () => {
                        const _items = this.state._items;
                        _items.push(updatedItem);
                        this.setState({ _items, isLoading: false });
                        this.props.actions.resetItems(_items);
                        if (index == length - 1) {
                            let items = this.state.items;
                            for (var i = 0; i < items.length; i++)
                                if (
                                    items[i].id ==
                                    this.state.updatedchilderns[0].parentId
                                ) {
                                    items[i].childerns.forEach(child => {
                                        child.quantity = 0;
                                        child.stock = 0;
                                    });
                                    this.setState({
                                        items,
                                        showChildren: false
                                    });
                                    break;
                                }
                        }
                    }
                );
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
        Api.post(
            "DeleteMultipleContractsSiteRequestItems",
            this.state.selectedRows
        )
            .then(res => {
                let _items = [...this.state._items];
                this.state.selectedRows.forEach((element, index) => {
                    _items = _items.filter(item => {
                        return item.id != element;
                    });
                });
                this.props.actions.resetItems(_items);
                this.setState({
                    _items,
                    showDeleteModal: false,
                    isLoading: false
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            })
            .catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ showDeleteModal: false, isLoading: false });
            });
    };

    clickHandlerDeleteRowsMain = selectedRows => {
        if (Config.IsAllow(118)) {
            this.setState({
                showDeleteModal: true,
                selectedRows: selectedRows
            });
        } else {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
        }
    };

    // _onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    //     let updateRow = this.state._items[fromRow];
    //     this.setState(
    //         state => {
    //             const _items = state._items.slice();
    //             for (let i = fromRow; i <= toRow; i++) {
    //                 _items[i] = { ..._items[i], ...updated };
    //             }
    //             this.props.actions.resetItems(_items);
    //             return { _items };
    //         },
    //         function () {
    //             if (
    //                 updateRow[Object.keys(updated)[0]] !==
    //                 updated[Object.keys(updated)[0]] &&
    //                 Object.keys(updated)[0] == "quantity"
    //             ) {
    //                 updateRow[Object.keys(updated)[0]] =
    //                     updated[Object.keys(updated)[0]];
    //                 this.setState({ isLoading: true });
    //                 Api.post(
    //                     "UpdateQuantitySiteRequestItems?id=" +
    //                     this.state._items[fromRow].id +
    //                     "&quantity=" +
    //                     updated.quantity
    //                 )
    //                     .then(() => {
    //                         toast.success(
    //                             Resources["operationSuccess"][currentLanguage]
    //                         );
    //                         this.setState({ isLoading: false });
    //                     })
    //                     .catch(() => {
    //                         toast.error(
    //                             Resources["operationCanceled"][currentLanguage]
    //                         );
    //                         this.setState({ isLoading: false });
    //                     });
    //             }
    //             if (
    //                 updateRow[Object.keys(updated)[0]] !==
    //                 updated[Object.keys(updated)[0]] &&
    //                 Object.keys(updated)[0] == "stock"
    //             ) {
    //                 updateRow[Object.keys(updated)[0]] =
    //                     updated[Object.keys(updated)[0]];
    //                 this.setState({ isLoading: true });
    //                 Api.post(
    //                     "UpdateQuantitySiteRequestItems?id=" +
    //                     this.state._items[fromRow].id +
    //                     "&stock=" +
    //                     updated.stock
    //                 )
    //                     .then(() => {
    //                         toast.success(
    //                             Resources["operationSuccess"][currentLanguage]
    //                         );
    //                         this.setState({ isLoading: false });
    //                     })
    //                     .catch(() => {
    //                         toast.error(
    //                             Resources["operationCanceled"][currentLanguage]
    //                         );
    //                         this.setState({ isLoading: false });
    //                     });
    //             }
    //         }
    //     );
    // };
    _onGridQuantityUpdated = (cell) => {
        if (cell) {
            this.setState({ isLoading: true });
            Api.post(
                "UpdateQuantitySiteRequestItems?id=" +
                cell.id +
                "&quantity=" +
                cell.quantity
            )
                .then(() => {
                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                    this.setState({ isLoading: false });
                })
                .catch(() => {
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                    );
                    this.setState({ isLoading: false });
                });
        }
    };
    _onGridStockUpdated = (cell) => {
        if (cell) {
            this.setState({ isLoading: true });
            Api.post(
                "UpdateStockSiteRequestItems?id=" +
                cell.id +
                "&stock=" +
                cell.stock
            )
                .then(() => {
                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                    this.setState({ isLoading: false });
                })
                .catch(() => {
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                    );
                    this.setState({ isLoading: false });
                });
        }
    };
    onRowClick = (value) => {
        // if (!Config.IsAllow(3751)) {
        //     toast.warning("you don't have permission");
        // } else if (column.key == "customBtn") {
        //     this.itemization(value);
        // }
    };

    addContract(values) {
        this.setState({ contractLoading: true });
        let contract = {
            completionDate: moment(values.completionDate, "YYYY-MM-DD").format(
                "YYYY-MM-DD[T]HH:mm:ss.SSS"
            ),
            docDate: moment(values.docDate, "YYYY-MM-DD").format(
                "YYYY-MM-DD[T]HH:mm:ss.SSS"
            ),
            subject: values.subject,
            refDoc: values.reference,
            status: values.status,
            siteRequestId: this.state.docId
        };
        Api.post("AddNewContract", contract)
            .then(() => {
                this.setState({
                    contractLoading: false,
                    showContractModal: false
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.props.history.push({
                    pathname: "/siteRequest/" + this.state.projectId
                });
            })
            .catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
            });
    }

    addPurchaseOrder(values) {
        this.setState({ contractLoading: true });
        let contract = {
            completionDate: moment(values.completionDate, "YYYY-MM-DD").format(
                "YYYY-MM-DD[T]HH:mm:ss.SSS"
            ),
            docDate: moment(values.docDate, "YYYY-MM-DD").format(
                "YYYY-MM-DD[T]HH:mm:ss.SSS"
            ),
            subject: values.subject,
            refDoc: values.reference,
            advancePaymentPercent: values.advancePayment,
            status: values.status,
            siteRequestId: this.state.docId
        };
        Api.post("AddNewPurchaseOrder", contract)
            .then(() => {
                this.setState({
                    contractLoading: false,
                    showContractModal: false
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.props.history.push({
                    pathname: "/siteRequest/" + this.state.projectId
                });
            })
            .catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
            });
    }

    addMR(values) {
        let MR = {
            docDate: moment(values.docDate, "YYYY-MM-DD").format(
                "YYYY-MM-DD[T]HH:mm:ss.SSS"
            ),
            subject: values.subject,
            status: values.status,
            siteRequestId: this.state.M_siteRequest.value,
            orderFromCompanyId: this.state.M_fromCompany.value,
            orderFromContactId: this.state.M_contact.value,
            specsSectionId: this.state.M_specsSection.value,
            materialReleaseId: this.state.M_releaseType.value,
            boqId: this.state.M_contractBoq.value,
            requestId: this.state.docId,
            projectId: this.state.projectId,
            arrange: this.state.M_arrange,
            docCloseDate: moment(values.docDate, "YYYY-MM-DD").format(
                "YYYY-MM-DD[T]HH:mm:ss.SSS"
            )
        };
        this.setState({ contractLoading: true });
        Api.post("AddLogsMaterialRelease", MR)
            .then(res => {
                if (res.id)
                    Api.post(
                        "AddMaterialReleaseItemsFromSiteRequestItems?materialReleaseId=" +
                        res.id,
                        this.state.MRItems
                    ).then(() => {
                        this.setState({
                            contractLoading: false,
                            showMRModalModal: false
                        });
                        toast.success(
                            Resources["operationSuccess"][currentLanguage]
                        );
                        this.getMarterialArrange();
                    });
            })
            .catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
            });
    }

    handleChangeDropDown(event) {
        this.setState({ isLoading: true });
        dataservice.GetDataList("GetContactsByCompanyId?companyId=" + event.value, "contactName", "id").then(res => {
            if (res)
                this.setState({
                    isLoading: false,
                    contacts: res,
                    M_fromCompany: event
                });
        });
    }

    showChildern(childerns) {
        if (Config.IsAllow(117)) {
            this.setState({ showChildren: true, childerns });
            this.simpleDialog4.show();
        } else {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
        }
    }

    _executeAfterModalOpen() {
        document.body.classList.add("noScrolling");
        window.scrollTo(0, 0);
    }

    _executeBeforeModalOpen() {
        document.body.classList.add("noScrolling");
        window.scrollTo(0, 0);
    }

    _executeAfterModalClose() {
        document.body.classList.remove("noScrolling");
    }

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;

        if (pageNumber > 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });

            let oldRows = [...this.state._items];

            dataservice
                .GetDataGrid(
                    "GetContractsSiteRequestItemsByRequestIdUsingPaging?requestId=" +
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
                    this.props.actions.resetItems(newRows);
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

        dataservice
            .GetDataGrid(
                "GetContractsSiteRequestItemsByRequestIdUsingPaging?requestId=" +
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
                this.props.actions.resetItems(newRows);
            })
            .catch(ex => {
                this.setState({
                    _items: oldRows,
                    isLoading: false
                });
            });
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrStep: stepNo });
    };

    render() {
        const childerns =
            this.state.isLoading == false ? (
                <div>
                    <ReactTable
                        data={this.state.childerns}
                        columns={[
                            {
                                Header: Resources.numberAbb[currentLanguage],
                                accessor: "arrange"
                            },
                            {
                                Header: Resources.description[currentLanguage],
                                accessor: "details"
                            },
                            {
                                Header: Resources.unit[currentLanguage],
                                accessor: "unit"
                            },
                            {
                                Header: Resources.quantity[currentLanguage],
                                accessor: "quantity",
                                Cell: this.editChildren
                            },
                            {
                                Header: Resources.stock[currentLanguage],
                                accessor: "stock",
                                Cell: this.editChildren
                            },
                            {
                                Header: Resources.resourceCode[currentLanguage],
                                accessor: "resourceCode"
                            },
                            {
                                Header: Resources.itemCode[currentLanguage],
                                accessor: "itemCode"
                            }
                        ]}
                        defaultPageSize={5}
                        className="-striped -highlight"
                    />
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
                                <button
                                    className="primaryBtn-1 btn meduimBtn"
                                    type="submit"
                                    onClick={() => this.addChild()}>
                                    {Resources.add[currentLanguage]}
                                </button>
                            )}
                    </div>
                </div>
            ) : (
                    <LoadingSection />
                );
        const ItemsGrid =
            this.state.isLoading == false ? (
                <GridCustom ref='custom-data-grid' groups={[]} data={this.state._items || []}
                    cells={this.itemsColumns}
                    pageSize={this.state.pageSize} actions={this.actions} rowActions={[]}
                    rowClick={(cell) => { this.onRowClick(cell) }}
                />
            ) : (<LoadingSection />);
        const MRGrid = (
            <ReactTable
                data={this.state.MRItems}
                columns={[
                    {
                        Header: Resources.resourceCode[currentLanguage],
                        accessor: "resourceCode"
                    },
                    {
                        Header: Resources.itemCode[currentLanguage],
                        accessor: "itemCode"
                    },
                    {
                        Header: Resources.quantity[currentLanguage],
                        accessor: "quantity"
                    },
                    {
                        Header: Resources.stock[currentLanguage],
                        accessor: "stock"
                    },
                    {
                        Header: Resources.requestedVariance[currentLanguage],
                        accessor: "requestedVariance",
                        Cell: (value, row) => {
                            return (
                                <span>
                                    {value.original.quantity != null ? value.original.quantity - value.original.stock : 0}
                                </span>
                            );
                        }
                    },
                    {
                        Header: Resources.releasedQuantity[currentLanguage],
                        accessor: "releasedQuantity",
                        Cell: this.renderEditableQuantity
                    }
                ]}
                defaultPageSize={5}
                className="-striped -highlight"
            />
        );


        let Step_1 = (
            <Fragment>
                <Formik
                    initialValues={{
                        ...this.state.document,
                        fromCompany:
                            this.state.fromCompany.value > 0
                                ? this.state.fromCompany
                                : "",
                        discipline:
                            this.state.discipline.value > 0
                                ? this.state.discipline
                                : ""
                    }}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={values => {
                        if (this.props.showModal) {
                            return;
                        }
                        if (this.props.showModal) {
                            return;
                        }
                        if (
                            this.props.changeStatus === true &&
                            this.state.docId > 0
                        ) {
                            this.editMaterialRequest(values);
                        } else if (
                            this.props.changeStatus === false &&
                            this.state.docId === 0
                        ) {
                            this.saveMaterialReques();
                        } else {
                            this.saveAndExit();
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
                                id="ProposalForm"
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
                                                (errors.subject && touched.subject
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
                                                autoComplete="off"
                                                defaultValue={
                                                    this.state.document.subject
                                                }
                                                onBlur={e => {
                                                    handleBlur(e);
                                                    handleChange(e);
                                                }}
                                                onChange={e =>
                                                    this.handleChange(e, "subject")
                                                }
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
                                            {Resources.status[currentLanguage]}
                                        </label>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input
                                                type="radio"
                                                name="proposal-status"
                                                defaultChecked={
                                                    this.state.document.status ===
                                                        false
                                                        ? null
                                                        : "checked"
                                                }
                                                value="true"
                                                onChange={e =>
                                                    this.handleChange(e, "status")
                                                }
                                            />
                                            <label>
                                                {Resources.oppened[currentLanguage]}
                                            </label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input
                                                type="radio"
                                                name="proposal-status"
                                                defaultChecked={
                                                    this.state.document.status ===
                                                        false
                                                        ? "checked"
                                                        : null
                                                }
                                                value="false"
                                                onChange={e =>
                                                    this.handleChange(e, "status")
                                                }
                                            />
                                            <label>
                                                {Resources.closed[currentLanguage]}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="proForm datepickerContainer">
                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker
                                            title="docDate"
                                            startDate={this.state.document.docDate}
                                            handleChange={e =>
                                                this.handleChangeDate(e, "docDate")
                                            }
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker
                                            title="requiredDate"
                                            startDate={
                                                this.state.document.requiredDate
                                            }
                                            handleChange={e =>
                                                this.handleChangeDate(
                                                    e,
                                                    "requiredDate"
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">
                                            {Resources.arrange[currentLanguage]}
                                        </label>
                                        <div
                                            className={
                                                "inputDev ui input" +
                                                (errors.arrange && touched.arrange
                                                    ? " has-error"
                                                    : !errors.arrange &&
                                                        touched.arrange
                                                        ? " has-success"
                                                        : " ")
                                            }>
                                            <input
                                                name="arrange"
                                                className="form-control fsadfsadsa"
                                                id="arrange"
                                                placeholder={
                                                    Resources.arrange[
                                                    currentLanguage
                                                    ]
                                                }
                                                autoComplete="off"
                                                defaultValue={
                                                    this.state.document.arrange
                                                }
                                                onBlur={e => {
                                                    handleBlur(e);
                                                    handleChange(e);
                                                }}
                                                onChange={e =>
                                                    this.handleChange(e, "arrange")
                                                }
                                            />
                                            {touched.arrange ? (
                                                <em className="pError">
                                                    {errors.arrange}
                                                </em>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input ">
                                        <div id="allSelected">
                                            <div
                                                className={
                                                    "ui checkbox checkBoxGray300 checked"
                                                }
                                                checked={
                                                    this.state.document
                                                        .useQntyRevised
                                                }
                                                onClick={e =>
                                                    this.handleCheckBox(e)
                                                }>
                                                <input
                                                    name="CheckBox"
                                                    type="checkbox"
                                                    id="allPermissionInput"
                                                    defaultChecked={
                                                        this.state.document
                                                            .useQntyRevised
                                                    }
                                                />
                                                <label>
                                                    {
                                                        Resources.revQuantity[
                                                        currentLanguage
                                                        ]
                                                    }
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="fromCompany"
                                            data={this.state.companies}
                                            selectedValue={this.state.fromCompany}
                                            handleChange={event => {
                                                this.getNextArrange(event.value);
                                                this.setState({
                                                    fromCompany: event
                                                });
                                            }}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.fromCompany}
                                            touched={touched.fromCompany}
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                   
                                        <Dropdown
                                            title="contractBoq"
                                             isDisabled={this.props.changeStatus}
                                            data={this.state.contractBoqLogs}
                                            selectedValue={this.state.selectedContract}
                                            handleChange={event => {
                                                this.setState({ selectedContract: event });
                                                this.GetBoqItemsStracture(
                                                    event.boqId
                                                );
                                            }}
                                        />
                                    </div> 
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="area"
                                            data={this.state.areas}
                                            selectedValue={this.state.area}
                                            handleChange={event =>
                                                this.setState({ area: event })
                                            }
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="location"
                                            data={this.state.locations}
                                            selectedValue={this.state.location}
                                            handleChange={event =>
                                                this.setState({ location: event })
                                            }
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="disciplineTitle"
                                            data={this.state.discplines}
                                            selectedValue={this.state.discipline}
                                            handleChange={event =>
                                                this.setState({ discipline: event })
                                            }
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.discipline}
                                            touched={touched.discipline}
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="buildingNumber"
                                            data={this.state.buildings}
                                            selectedValue={
                                                this.state.buildingNumber
                                            }
                                            handleChange={event =>
                                                this.setState({
                                                    buildingNumber: event
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="apartmentNumber"
                                            data={this.state.apartmentNumbers}
                                            selectedValue={this.state.apartmentNo}
                                            handleChange={event =>
                                                this.setState({
                                                    apartmentNo: event
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">
                                            {
                                                Resources.showInDashboard[
                                                currentLanguage
                                                ]
                                            }
                                        </label>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input
                                                type="radio"
                                                name="proposal-showInDashboard"
                                                defaultChecked={
                                                    this.state.document
                                                        .showInDashboard === false
                                                        ? null
                                                        : "checked"
                                                }
                                                value={true}
                                                onChange={e =>
                                                    this.handleChange(
                                                        e,
                                                        "showInDashboard"
                                                    )
                                                }
                                            />
                                            <label>
                                                {Resources.show[currentLanguage]}
                                            </label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input
                                                type="radio"
                                                name="proposal-showInDashboard"
                                                defaultChecked={
                                                    this.state.document
                                                        .showInDashboard === false
                                                        ? "checked"
                                                        : null
                                                }
                                                value={false}
                                                onChange={e =>
                                                    this.handleChange(
                                                        e,
                                                        "showInDashboard"
                                                    )
                                                }
                                            />
                                            <label>
                                                {Resources.hide[currentLanguage]}
                                            </label>
                                        </div>
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
                                    ) : (this.showBtnsSaving())}
                                </div>
                                {Config.IsAllow(117) ? this.props.changeStatus === true ? (
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
                                            />
                                        </div>
                                    </div>
                                ) : null : null}
                            </Form>
                        )}
                </Formik>
                <div className="doc-pre-cycle letterFullWidth">
                    <div>
                        {this.state.docId > 0 &&
                            this.state.isViewMode === false ? (
                                <UploadAttachment
                                    changeStatus={this.props.changeStatus}
                                    AddAttachments={851}
                                    EditAttachments={3241}
                                    ShowDropBox={3537}
                                    ShowGoogleDrive={3538}
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
            </Fragment>
        );

        let Step_2 = (
            <React.Fragment>
                <header>
                    <h2 className="zero">{Resources.items[currentLanguage]}</h2>
                </header>
                <div>
                    <div className="proForm first-proform letterFullWidth radio__only">
                        <div className="linebylineInput valid-input">
                            <div className="ui checkbox radio radioBoxBlue">
                                <input
                                    type="radio"
                                    name="status"
                                    defaultChecked={
                                        this.state.showInventory === true
                                            ? null
                                            : "checked"
                                    }
                                    value="false"
                                    onChange={e =>
                                        this.setState({
                                            showInventory: false
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
                                        this.state.showInventory === true
                                            ? "checked"
                                            : null
                                    }
                                    value="true"
                                    onChange={e =>
                                        this.setState({
                                            showInventory: true
                                        })
                                    }
                                />
                                <label>
                                    {Resources.fromInventory[currentLanguage]}
                                </label>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.showInventory == true ? this.renderInventory() :
                            this.renderNormalItems()

                        // <ReactTable
                        //     data={this.state.items}
                        //     columns={[
                        //         {
                        //             Cell: props => {
                        //                 if (props.original.childerns.length > 0)
                        //                     return (
                        //                         <i
                        //                             className="fa fa-plus-circle"
                        //                             onClick={e => this.showChildern(props.original.childerns, e)}
                        //                         />
                        //                     );
                        //                 else return null;
                        //             },
                        //             width: 30
                        //         },
                        //         {
                        //             Header: Resources.numberAbb[currentLanguage],
                        //             accessor: "arrange"
                        //         },
                        //         {
                        //             Header: Resources.description[currentLanguage],
                        //             accessor: "details"
                        //         },
                        //         {
                        //             Header: Resources.unit[currentLanguage],
                        //             accessor: "unit"
                        //         },
                        //         {
                        //             Header: Resources.quantity[currentLanguage],
                        //             accessor: "quantity",
                        //             Cell: this.renderEditable
                        //         },
                        //         {
                        //             Header: Resources.stock[currentLanguage],
                        //             accessor: "stock",
                        //             Cell: this.renderEditable
                        //         },
                        //         {
                        //             Header: Resources.resourceCode[currentLanguage],
                        //             accessor: "resourceCode"
                        //         },
                        //         {
                        //             Header: Resources.itemCode[currentLanguage],
                        //             accessor: "itemCode"
                        //         }
                        //     ]}
                        //     defaultPageSize={5}
                        //     className="-striped -highlight"
                        // />
                    }
                </div>
                {Config.IsAllow(117) ? <XSLfile key="boqImport" docId={this.state.docId} docType="siteRequest"
                    link={Config.getPublicConfiguartion().downloads + "/Downloads/Excel/SiteRequest.xlsx"}
                    header="addManyItems"
                    disabled={this.state.isViewMode}
                    afterUpload={() => this.GetBoqItemsStracture(this.props.document.boqId)}
                /> : null}
                <div class="submittalFilter">
                    <div class="subFilter">
                        <h3 class="zero">
                            {Resources["AddedItems"][currentLanguage]}
                        </h3>
                        <span>{this.state._items.length}</span>
                    </div>
                    <div class="filterBTNS">
                        <div className="default__dropdown--custom" style={{ marginBottom: "0" }}>
                            {this.state.isViewMode == true ? null : (
                                <div className="default__dropdown">
                                    <Dropdown title="" data={this.state.materialTypes} selectedValue={this.state.materialType}
                                        handleChange={event => {
                                            this.setState({
                                                materialType: event
                                            });
                                            this.actionsChange(event);
                                        }}
                                        styles={actionPanel}
                                    />
                                </div>
                            )}
                        </div>
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
            </React.Fragment>
        );

        const contractContent = (
            <React.Fragment>
                <div className="dropWrapper">
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            subject: "",
                            reference: 0,
                            completionDate: moment(),
                            docDate: moment(),
                            status: true
                        }}
                        validationSchema={contractSchema}
                        onSubmit={values => {
                            if (this.props.showModal) {
                                return;
                            }
                            this.addContract(values);
                        }}>
                        {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                            <Form id="signupForm1" className="proForm customProform" noValidate="novalidate">
                                <div className="fillter-item-c">
                                    <label className="control-label">
                                        {Resources["subject"][currentLanguage]}{" "}
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
                                <div className="fillter-item-c">
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
                                                setFieldValue("status", true)
                                            }
                                        />
                                        <label>
                                            {Resources.oppened[currentLanguage]}
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
                                                setFieldValue("status", false)
                                            }
                                        />
                                        <label>
                                            {Resources.closed[currentLanguage]}
                                        </label>
                                    </div>
                                </div>
                                <DatePicker
                                    title="docDate"
                                    name="documentDate"
                                    startDate={values.docDate}
                                    handleChange={e =>
                                        setFieldValue("docDate", e)
                                    }
                                />
                                <DatePicker
                                    title="completionDate"
                                    name="completionDate"
                                    startDate={values.completionDate}
                                    handleChange={e =>
                                        setFieldValue("completionDate", e)
                                    }
                                />
                                <div className="fillter-item-c">
                                    <label className="control-label">
                                        {Resources.reference[currentLanguage]}
                                    </label>
                                    <div className="ui input inputDev">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="reference"
                                            defaultValue={values.reference}
                                            name="reference"
                                            onChange={e => handleChange(e)}
                                            placeholder={
                                                Resources.reference[
                                                currentLanguage
                                                ]
                                            }
                                        />
                                    </div>
                                    <div
                                        className={
                                            "slider-Btns fullWidthWrapper textLeft "
                                        }>
                                        {this.state.contractLoading ===
                                            false ? (
                                                <button
                                                    className={"primaryBtn-1 btn "}
                                                    type="submit">
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
            </React.Fragment>
        );
        const purchaseOrder = (
            <React.Fragment>
                <div className="dropWrapper">
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            subject: "",
                            reference: 0,
                            advancePayment: 0,
                            completionDate: moment(),
                            docDate: moment(),
                            status: true
                        }}
                        validationSchema={contractSchema}
                        onSubmit={values => {
                            if (this.props.showModal) {
                                return;
                            }
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
                                    className="proForm  customProform"
                                    noValidate="novalidate">
                                    <div className="fillter-item-c">
                                        <label className="control-label">
                                            {Resources["subject"][currentLanguage]}{" "}
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

                                    <div className="fillter-item-c">
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
                                                    setFieldValue("status", true)
                                                }
                                            />
                                            <label>
                                                {Resources.oppened[currentLanguage]}
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
                                                    setFieldValue("status", false)
                                                }
                                            />
                                            <label>
                                                {Resources.closed[currentLanguage]}
                                            </label>
                                        </div>
                                    </div>

                                    <DatePicker
                                        title="completionDate"
                                        name="completionDate"
                                        startDate={values.completionDate}
                                        handleChange={e =>
                                            setFieldValue("completionDate", e)
                                        }
                                    />
                                    <DatePicker
                                        title="docDate"
                                        name="documentDate"
                                        startDate={values.docDate}
                                        handleChange={e =>
                                            setFieldValue("docDate", e)
                                        }
                                    />
                                    <div className="fillter-item-c">
                                        <label className="control-label">
                                            {Resources.reference[currentLanguage]}
                                        </label>
                                        <div className="ui input inputDev">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="reference"
                                                defaultValue={values.reference}
                                                name="reference"
                                                onChange={e => handleChange(e)}
                                                placeholder={
                                                    Resources.reference[
                                                    currentLanguage
                                                    ]
                                                }
                                            />
                                        </div>
                                        <label className="control-label">
                                            {
                                                Resources.advancePayment[
                                                currentLanguage
                                                ]
                                            }
                                        </label>
                                        <div className="ui input inputDev">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="advancePayment"
                                                defaultValue={values.advancePayment}
                                                name="advancePayment"
                                                onChange={e => handleChange(e)}
                                                placeholder={
                                                    Resources.advancePayment[
                                                    currentLanguage
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div
                                            className={
                                                "slider-Btns fullWidthWrapper textLeft "
                                            }>
                                            {this.state.contractLoading ===
                                                false ? (
                                                    <button
                                                        className={"primaryBtn-1 btn "}
                                                        type="submit">
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
            </React.Fragment>
        );

        const materialRelease =
            this.state.isLoading == false ? (
                <React.Fragment>
                    <div className="dropWrapper">
                        <Formik
                            initialValues={{
                                subject: this.state.M_subject,
                                M_siteRequest:
                                    this.state.M_siteRequest.value != "0"
                                        ? this.state.M_siteRequest.label
                                        : "",
                                M_specsSection:
                                    this.state.M_specsSection.value != "0"
                                        ? this.state.M_specsSection.label
                                        : "",
                                M_releaseType:
                                    this.state.M_releaseType.value != "0"
                                        ? this.state.M_releaseType.label
                                        : "",
                                M_contractBoq:
                                    this.state.M_contractBoq.value != "0"
                                        ? this.state.M_contractBoq.label
                                        : "",
                                M_contact:
                                    this.state.M_contact.value != "0"
                                        ? this.state.M_contact.label
                                        : "",
                                docDate: moment(),
                                status: true
                            }}
                            validationSchema={materialSchema}
                            onSubmit={values => {
                                if (this.props.showModal) {
                                    return;
                                }
                                this.addMR(values);
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
                                        className="proForm  customProform"
                                        noValidate="novalidate">
                                        <div className="fillter-item-c">
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
                                                        this.setState({
                                                            M_subject:
                                                                e.target.value
                                                        });
                                                    }}
                                                />
                                                {errors.subject ? (
                                                    <em className="pError">
                                                        {errors.subject}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="fillter-item-c">
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
                                        <DatePicker
                                            title="docDate"
                                            name="docDate"
                                            startDate={values.docDate}
                                            handleChange={e =>
                                                setFieldValue("docDate", e)
                                            }
                                        />
                                        <div className="mix_dropdown">
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
                                                        data={this.state.companies}
                                                        selectedValue={
                                                            this.state.M_fromCompany
                                                        }
                                                        handleChange={event => {
                                                            this.handleChangeDropDown(
                                                                event
                                                            );
                                                        }}
                                                        name="M_fromCompanyId"
                                                        id="M_fromCompanyId" styles={CompanyDropdown} classDrop="companyName1 "
                                                    />
                                                </div>
                                                <div className="super_company">
                                                    <Dropdown
                                                        data={this.state.contacts}
                                                        selectedValue={
                                                            this.state.M_contact
                                                        }
                                                        handleChange={event =>
                                                            this.setState({
                                                                M_contact: event
                                                            })
                                                        }
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={errors.M_contact}
                                                        touched={touched.M_contact}
                                                        name="M_contact"
                                                        id="M_contact" classDrop=" contactName1" styles={ContactDropdown}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Dropdown
                                            title="siteRequest"
                                            data={this.state.siteRequests}
                                            selectedValue={this.state.M_siteRequest}
                                            handleChange={event =>
                                                this.setState({
                                                    M_siteRequest: event
                                                })
                                            }
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.M_siteRequest}
                                            touched={touched.M_siteRequest}
                                            name="M_siteRequest"
                                        />
                                        <Dropdown
                                            title="specsSection"
                                            data={this.state.specsSections}
                                            selectedValue={
                                                this.state.M_specsSection
                                            }
                                            handleChange={event =>
                                                this.setState({
                                                    M_specsSection: event
                                                })
                                            }
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.M_specsSection}
                                            touched={touched.M_specsSection}
                                            name="M_specsSection"
                                        />
                                        <Dropdown
                                            title="materialReleaseType"
                                            data={this.state.releaseTypes}
                                            selectedValue={this.state.M_releaseType}
                                            handleChange={event =>
                                                this.setState({
                                                    M_releaseType: event
                                                })
                                            }
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.M_releaseType}
                                            touched={touched.M_releaseType}
                                            name="M_releaseType"
                                        />
                                        <Dropdown
                                            title="boqLog"
                                            data={this.state.contractBoqs}
                                            selectedValue={this.state.M_contractBoq}
                                            handleChange={event =>
                                                this.setState({
                                                    M_contractBoq: event
                                                })
                                            }
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.M_contractBoq}
                                            touched={touched.M_contractBoq}
                                            name="M_contractBoq"
                                        />
                                        <div className="letterFullWidth">
                                            {MRGrid}
                                        </div>
                                        <div
                                            className={
                                                "slider-Btns fullWidthWrapper "
                                            }>
                                            {this.state.contractLoading ===
                                                false ? (
                                                    <button
                                                        className={"primaryBtn-1 btn "}
                                                        type="submit">
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
                                    </Form>
                                )}
                        </Formik>
                    </div>
                </React.Fragment>
            ) : (
                    <LoadingSection />
                );

        return (
            <div className="mainContainer" id={"mainContainer"}>
                <div
                    className={
                        this.state.isViewMode === true
                            ? "documents-stepper noTabs__document readOnly_inputs one__tab one_step"
                            : "documents-stepper noTabs__document one__tab one_step"
                    }>
                    <HeaderDocument
                        projectName={projectName}
                        isViewMode={this.state.isViewMode}
                        perviousRoute={this.state.perviousRoute}
                        docTitle={Resources.siteRequest[currentLanguage]}
                        moduleTitle={Resources["procurement"][currentLanguage]}
                    />
                    <div className="doc-container">
                        <div className="step-content">
                            <div id="step1" className="step-content-body">
                                <div className="subiTabsContent">
                                    {this.props.changeStatus == true ? (
                                        <header className="main__header">
                                            <div className="main__header--div">
                                                <h2 className="zero">
                                                    {
                                                        Resources.goEdit[
                                                        currentLanguage
                                                        ]
                                                    }
                                                </h2>
                                                <p className="doc-infohead">
                                                    <span>
                                                        {" "}
                                                        {
                                                            this.state.document
                                                                .refDoc
                                                        }
                                                    </span>{" "}
                                                    -{" "}
                                                    <span>
                                                        {" "}
                                                        {
                                                            this.state.document
                                                                .arrange
                                                        }
                                                    </span>{" "}
                                                    -{" "}
                                                    <span>
                                                        {moment(
                                                            this.state.document
                                                                .docDate
                                                        ).format("DD/MM/YYYY")}
                                                    </span>
                                                </p>
                                            </div>
                                        </header>
                                    ) : null}
                                    <div className="document-fields">
                                        <React.Fragment>
                                            {this.state.CurrStep == 0
                                                ? Step_1
                                                : Step_2}
                                            <div
                                                className="largePopup largeModal "
                                                style={{
                                                    display: this.state
                                                        .showContractModal
                                                        ? "block"
                                                        : "none"
                                                }}>
                                                <SkyLight
                                                    afterClose={
                                                        this
                                                            ._executeAfterModalClose
                                                    }
                                                    afterOpen={
                                                        this
                                                            ._executeAfterModalOpen
                                                    }
                                                    hideOnOverlayClicked
                                                    beforeOpen={
                                                        this
                                                            ._executeBeforeModalOpen
                                                    }
                                                    ref={ref =>
                                                        (this.simpleDialog1 = ref)
                                                    }
                                                    title={
                                                        Resources.contract[
                                                        currentLanguage
                                                        ]
                                                    }>
                                                    {contractContent}
                                                </SkyLight>
                                            </div>
                                            <div
                                                className="largePopup largeModal "
                                                style={{
                                                    display: this.state
                                                        .showPoModal
                                                        ? "block"
                                                        : "none"
                                                }}>
                                                <SkyLight
                                                    afterClose={
                                                        this
                                                            ._executeAfterModalClose
                                                    }
                                                    afterOpen={
                                                        this
                                                            ._executeAfterModalOpen
                                                    }
                                                    hideOnOverlayClicked
                                                    beforeOpen={
                                                        this
                                                            ._executeBeforeModalOpen
                                                    }
                                                    ref={ref =>
                                                        (this.simpleDialog2 = ref)
                                                    }
                                                    title={
                                                        Resources.po[
                                                        currentLanguage
                                                        ]
                                                    }>
                                                    {purchaseOrder}
                                                </SkyLight>
                                            </div>
                                            <div
                                                className="largePopup largeModal "
                                                style={{
                                                    display: this.state
                                                        .showMRModal
                                                        ? "block"
                                                        : "none"
                                                }}>
                                                <SkyLight
                                                    afterClose={
                                                        this
                                                            ._executeAfterModalClose
                                                    }
                                                    afterOpen={
                                                        this
                                                            ._executeAfterModalOpen
                                                    }
                                                    hideOnOverlayClicked
                                                    beforeOpen={
                                                        this
                                                            ._executeBeforeModalOpen
                                                    }
                                                    ref={ref =>
                                                        (this.simpleDialog3 = ref)
                                                    }
                                                    title={
                                                        Resources
                                                            .materialRelease[
                                                        currentLanguage
                                                        ]
                                                    }>
                                                    {materialRelease}
                                                </SkyLight>
                                            </div>
                                            <div className="largePopup largeModal " style={{ display: this.state.showChildren ? "block" : "none" }}>
                                                <SkyLight afterClose={this._executeAfterModalClose}
                                                    afterOpen={this._executeAfterModalOpen}
                                                    hideOnOverlayClicked
                                                    beforeOpen={this._executeBeforeModalOpen}
                                                    ref={ref => (this.simpleDialog4 = ref)}
                                                    title={Resources.materialRelease[currentLanguage]}>
                                                    {childerns}
                                                </SkyLight>
                                            </div>
                                        </React.Fragment>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Fragment>
                            <Steps
                                steps_defination={steps_defination}
                                exist_link="/siteRequest/"
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
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName="delete"
                        clickHandlerContinue={this.ConfirmDelete}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(materialRequestAddEdit));

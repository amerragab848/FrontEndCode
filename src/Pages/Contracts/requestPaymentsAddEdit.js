import React, { Component, Fragment } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import TextEditor from "../../Componants/OptionsPanels/TextEditor";
import GridSetupWithFilter from "../Communication/GridSetupWithFilter";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import moment from "moment";
import SkyLight from "react-skylight";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import { toast } from "react-toastify";
import ReactTable from "react-table";
import "react-table/react-table.css";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Export from "../../Componants/OptionsPanels/Export";
import Api from "../../api";
import Steps from "../../Componants/publicComponants/Steps";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
    contractId: Yup.string().required(Resources["selectContract"][currentLanguage]).nullable(true),
    vat: Yup.string().matches(/(^[0-9]+$)/, Resources["onlyNumbers"][currentLanguage]),
    tax: Yup.string().matches(/(^[0-9]+$)/, Resources["onlyNumbers"][currentLanguage]),
    insurance: Yup.string().matches(/(^[0-9]+$)/, Resources["onlyNumbers"][currentLanguage]),
    advancePaymentPercent: Yup.string().matches(/(^[0-9]+$)/, Resources["onlyNumbers"][currentLanguage]),
    retainagePercent: Yup.string().matches(/(^[0-9]+$)/, Resources["onlyNumbers"][currentLanguage])
});

const validationDeductionSchema = Yup.object().shape({
    title: Yup.string().required(Resources["description"][currentLanguage]),
    deductionValue: Yup.string().matches(/(^[0-9]+$)/, Resources["onlyNumbers"][currentLanguage])
});

const validationItemsSchema = Yup.object().shape({
    percentComplete: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage]).required(Resources["percentComplete"][currentLanguage]),
    quantityComplete: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage]).required(Resources["quantityComplete"][currentLanguage]),
    paymentPercent: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage]).required(Resources["paymentPercent"][currentLanguage])
});

const BoqTypeSchema = Yup.object().shape({
    boqType: Yup.string().required(Resources["boqSubType"][currentLanguage]),
    boqChild: Yup.string().required(Resources["boqSubType"][currentLanguage]),
    boqSubType: Yup.string().required(Resources["boqSubType"][currentLanguage])
});

let publicFonts = currentLanguage === "ar" ? 'cairo-b' : 'Muli, sans-serif';

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
    indicatorSeparator: styles => ({ ...styles, backgroundColor: '#dadee6' }),
    menu: styles => ({ ...styles, zIndex: 155, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)', border: 'solid 1px #ccd2db' }),
};

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = "";
let arrange = 0;
let type = 1;
const find = require("lodash/find");
let itemsColumns = [];
let VOItemsColumns = [];
const isCompany = Config.getPayload().uty == "company" ? true : false;
var steps_defination = [];

const columnOfInterimPayment = [{
    name: Resources["workDescription"][currentLanguage],
    key: 'description'
}, {
    name: Resources["previousConsultatnt"][currentLanguage],
    key: 'prevoiuse'
}, {
    name: Resources["currentConsultatnt"][currentLanguage],
    key: 'currentValue'
}, {
    name: Resources["totalConsultatnt"][currentLanguage],
    key: 'total'
}, {
    name: Resources["previousContractor"][currentLanguage],
    key: 'contractorPrevoiuse'
}, {
    name: Resources["currentContractor"][currentLanguage],
    key: 'contractorCurrentValue'
}, {
    name: Resources["totalContractor"][currentLanguage],
    key: 'contractorTotal'
}, {
    name: Resources["comments"][currentLanguage],
    key: 'comment'
}]

class requestPaymentsAddEdit extends Component {
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
                } catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }

        let userType = Config.getPayload();

        this.state = {
            isItemUpdate: false,
            isFilter: false,
            advancedPayment: null,
            currentStep: 0,
            trees: [],
            showCostCodingTree: false,
            showDeleteModal: false,
            userType: userType.uty,
            addDeducation: false,
            fillDropDown: [
                { label: "Add Missing Amendments", value: "1" },
                { label: "ReCalculator Payment", value: "2" },
                { label: "Update Items From VO", value: "3" },
                { label: "Add Missing Items", value: "4" },
                { label: "Edit Advanced Payment Amount", value: "5" },
                { label: "Calculate Interim Invoice", value: "6" },
                { label: "Add Deductions", value: "7" },
                { label: "Update Advance Payment Amount", value: "8" }
            ],
            selectedDropDownTrees: { label: Resources.codingTree[currentLanguage], value: "0" },
            selectedPercentageStatus: { label: Resources.percentageStatus[currentLanguage], value: "0" },
            fillDropDownTress: [],
            fillDropDownExport: [
                { label: "Export", value: "1" },
                { label: "ExportAsVo", value: "2" }
            ],
            selectedDropDown: [{ label: "Admin Actions", value: "0" }],
            selectedDropDownExport: [{ label: "Export File", value: "0" }],
            selectedBoqTypeEdit: { label: Resources.boqType[currentLanguage], value: "0" },
            selectedBoqTypeChildEdit: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
            selectedBoqSubTypeEdit: { label: Resources.boqSubType[currentLanguage], value: "0" },
            boqTypes: [],
            BoqTypeChilds: [],
            BoqSubTypes: [],
            boqStractureObj: {},
            documentDeduction: {},
            interimInvoicedTable: [],
            approvedInvoicesParent: [],
            approvedInvoicesChilds: [],
            deductionObservableArray: [],
            paymentRequestItemsHistory: [],
            isLoading: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            pageNumber: 0,
            pageSize: 2000,
            docId: docId,
            docTypeId: 71,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            voItem: {},
            permission: [
                { name: "sendByEmail", code: 54 },
                { name: "sendByInbox", code: 53 },
                { name: "sendTask", code: 1 },
                { name: "distributionList", code: 956 },
                { name: "createTransmittal", code: 3042 },
                { name: "sendToWorkFlow", code: 707 },
                { name: "viewAttachments", code: 3317 },
                { name: "deleteAttachments", code: 840 }
            ],
            selectContract: { label: Resources.selectContract[currentLanguage], value: "0" },
            contractsPos: [],
            paymentsItems: [],
            CurrentStep: 0,
            editRows: [],
            comment: "",
            viewPopUpRows: false,
            viewContractorPopUpRows: false,
            currentObject: {},
            currentId: 0,
            exportFile: "",
            isView: false,
            viewUpdatePayment: false,
            viewUpdateCalc: false,
            actualPayments: 0,
            percentageStatus: [
                { label: "percentage", value: 1 },
                { label: "Actual Value", value: 2 }
            ],
            id: 1,
            itemId: 0,
            quantityComplete: 0,
            currentDocument: "",
            columnsApprovedInvoices: [],
            CalculateRow: true
        };

        if (!Config.IsAllow(184) && !Config.IsAllow(187) && !Config.IsAllow(185)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }


        steps_defination = [
            {
                name: "paymentRequisitions",
                callBackFn: null
            },
            {
                name: "items",
                callBackFn: () => this.fillGridItems()
            },
            {
                name: "deductions",
                callBackFn: this.fillDeductions()
            },
            {
                name: "summaries",
                callBackFn: () => this.fillSummariesTab()
            }
        ];

        //this.editRowsClick = this.editRowsClick.bind(this);
    }

    buildColumns(changeStatus) {
        let editPaymentPercent = ({ value, row }) => {
            if (row) {
                return (
                    <a className="editorCell">
                        <span style={{ padding: "0 6px", margin: "5px 0", border: "1px dashed", cursor: "pointer" }}>
                            {row.paymentPercent}
                        </span>
                    </a>
                );
            }
            return null;
        };

        let editQuantityComplete = ({ value, row }) => {
            if (row) {
                return (
                    <a className="editorCell">
                        <span style={{ padding: "0 6px", margin: "5px 0", border: "1px dashed", cursor: "pointer", color: row.revisedQuantity >= row.quantityComplete ? "black" : "#F50505" }}>
                            {row.quantityComplete}
                        </span>
                    </a>
                );
            }
            return null;
        };

        let editPercentComplete = ({ value, row }) => {
            if (row) {
                return (
                    <a className="editorCell">
                        <span style={{ padding: "0 6px", margin: "5px 0", border: "1px dashed", cursor: "pointer" }}>
                            {row.percentComplete}
                        </span>
                    </a>
                );
            }
            return null;
        };

        let editSiteQuantityComplete = ({ value, row }) => {
            if (row) {
                return (
                    <a className="editorCell">
                        <span style={{ padding: "0 6px", margin: "5px 0", border: "1px dashed", cursor: "pointer" }}>
                            {row.siteQuantityComplete}
                        </span>
                    </a>
                );
            }
            return null;
        };

        let editsitePaymentPercent = ({ value, row }) => {
            if (row) {
                return (
                    <a className="editorCell">
                        <span style={{ padding: "0 6px", margin: "5px 0", border: "1px dashed", cursor: "pointer" }}>
                            {row.sitePaymentPercent}
                        </span>
                    </a>
                );
            }
            return null;
        };

        let editSitePercentComplete = ({ value, row }) => {
            if (row) {
                return (
                    <a className="editorCell">
                        <span style={{ padding: "0 6px", margin: "5px 0", border: "1px dashed", cursor: "pointer" }}>
                            {row.sitePercentComplete}
                        </span>
                    </a>
                );
            }
            return null;
        };

        let addCostCodingTree = ({ value, row }) => {
            if (row) {
                return (
                    <button className="primaryBtn-1 btn meduimBtn" type="submit">
                        Add Cost Coding Tree
                    </button>
                );
            }
            return null;
        };

        if (this.state.isViewMode !== true) { itemsColumns.push({ key: "BtnActions", width: 150 }) }

        itemsColumns = [
            ...(this.props.changeStatus ? [
                {
                    key: "BtnActions",
                    name: Resources["LogControls"][currentLanguage],
                    width: 150,
                    draggable: false,
                    sortable: false,
                    resizable: true,
                    filterable: false,
                    sortDescendingFirst: false
                }] : []),
            {
                key: "arrange",
                name: Resources["no"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                type: "number"
            },
            {
                key: "itemCode",
                name: Resources["itemCode"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                type: "string"
            },
            {
                key: "details",
                name: Resources["description"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                type: "string"
            },
            {
                key: "boqType",
                name: Resources["boqType"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                type: "string"
            },
            {
                key: "secondLevel",
                name: Resources["boqTypeChild"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true,
                type: "string"
            },
            {
                key: "boqSubType",
                name: Resources["boqSubType"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                type: "string"
            },
            {
                key: "quantity",
                name: Resources["boqQuanty"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                type: "number"
            },
            {
                key: "revisedQuantity",
                name: Resources["approvedQuantity"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true,
                type: "number"
            },
            {
                key: "actualPercentage",
                name: Resources["actualPercentage"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true,
                type: "number"
            },
            {
                key: "unitPrice",
                name: Resources["unitPrice"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                type: "number"
            },
            {
                key: "unit",
                name: Resources["unit"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true,
                type: "string"
            },
            {
                key: "prevoiuseQnty",
                name: Resources["previousQuantity"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true,
                type: "number"
            },
            {
                key: "oldPaymentPercent",
                name: Resources["previousPaymentPercent"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true,
                type: "number"
            },
            {
                key: "sitePercentComplete",
                name: Resources["sitePercentComplete"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true,
                formatter: changeStatus ? null : editSitePercentComplete,
                editable: !changeStatus,
                type: "number"
            },
            {
                key: "siteQuantityComplete",
                name: Resources["siteQuantityComplete"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true,
                formatter: changeStatus ? null : editSiteQuantityComplete,
                editable: !changeStatus,
                type: "number"
            },
            {
                key: "sitePaymentPercent",
                name: Resources["contractPaymentPercent"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true,
                formatter: changeStatus ? null : editsitePaymentPercent,
                editable: !changeStatus,
                type: "number"
            },
            ...(this.props.changeStatus ? [{
                key: "percentComplete",
                name: Resources["percentComplete"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true,
                formatter: changeStatus ? null : editPercentComplete,
                editable: !changeStatus,
                visible: this.props.changeStatus,
                type: "number"
            },
            {
                key: "quantityComplete",
                name: Resources["quantityComplete"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: changeStatus ? null : editQuantityComplete,
                editable: !changeStatus,
                visible: this.props.changeStatus,
                type: "number"
            },
            {
                key: "paymentPercent",
                name: Resources["paymentPercent"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: changeStatus ? null : editPaymentPercent,
                editable: !changeStatus,
                type: "number"
            }] : []),
            {
                key: "wasAdded",
                name: Resources["status"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "totalExcutedPayment",
                name: Resources["totalAmount"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            },
            {
                key: "lastComment",
                name: Resources["comment"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            },
            {
                key: "itemStatus",
                name: Resources["itemStatus"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }
        ];

        if (changeStatus) {
            itemsColumns.push({
                key: "actions",
                name: Resources["LogControls"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true,
                formatter: addCostCodingTree
            });
        }

        VOItemsColumns = [
            {
                key: "id",
                name: "id",
                width: 50
            },
            {
                key: "voItemId",
                name: "voItemId",
                width: 100
            },
            {
                key: "itemId",
                name: Resources["itemId"][currentLanguage],
                width: 120
            },
            {
                key: "itemCode",
                name: Resources["itemCode"][currentLanguage],
                width: 100
            },
            {
                key: "resourceCode",
                name: Resources["resourceCode"][currentLanguage],
                width: 100
            },
            {
                key: "revisedQuantity",
                name: Resources["approvedQuantity"][currentLanguage],
                width: 100
            },
            {
                key: "unitPrice",
                name: Resources["unitPrice"][currentLanguage],
                width: 100
            },
            {
                key: "unitPrice",
                name: "newUnitPrice",
                width: 100
            },
            {
                key: "quantity",
                name: "newBoqQuantity",
                width: 100
            },
            {
                key: "details",
                name: Resources["description"][currentLanguage],
                width: 100
            },
            {
                key: "boqType",
                name: Resources["boqType"][currentLanguage],
                width: 120
            },
            {
                key: "secondLevel",
                name: Resources["boqTypeChild"][currentLanguage],
                width: 120
            },
            {
                key: "boqSubType",
                name: Resources["boqSubType"][currentLanguage],
                width: 120
            }
        ];
    }

    customCellActions(column, row) {
        if (column.key === "BtnActions") {
            const custom = [{
                icon: <span style={{ cursor: 'pointer' }} className="fa fa-history" />,
                callback: e => {
                    this.setState({
                        isLoading: true
                    });
                    dataservice.GetDataGrid("GetContractsRequestPaymentsItemsHistory?id=" + row.id).then(result => {
                        this.setState({
                            paymentRequestItemsHistory: result,
                            isLoading: false,
                            showViewHistoryModal: true
                        });

                        this.ViewHistoryModal.show();
                    });
                }
            },
            {
                icon: <span style={{ cursor: 'pointer' }} className="fa fa-pencil" />,
                callback: () => {
                    if (Config.IsAllow(1001104)) {
                        let boqStractureObj = {
                            ...this.state.boqStractureObj
                        };
                        let boqTypes = [...this.state.boqTypes];
                        boqStractureObj.id = row.id;
                        boqStractureObj.requestId = this.state.docId;
                        boqStractureObj.contractId = this.state.document.contractId;

                        if (boqTypes.length > 0) {
                            this.setState({
                                boqStractureObj: boqStractureObj,
                                showBoqModal: true
                            });
                            this.boqTypeModal.show();
                        } else {
                            dataservice.GetDataList("GetAllBoqParentNull?projectId=" + projectId, "title", "id").then(data => {
                                this.setState({
                                    boqTypes: data,
                                    boqStractureObj: boqStractureObj,
                                    showBoqModal: true
                                });
                                this.boqTypeModal.show();
                            });
                        }
                    }
                }
            }];

            return custom;

        }
    }

    getCellActions(column, row) {

        const cellActions = {
            BtnActions: this.customCellActions(column, row)
        };
        return cellActions[column.key];
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

        let documentDeduction = {
            title: "",
            deductionValue: 0
        };

        if (this.state.docId > 0) {
            this.props.actions.documentForEdit("GetContractsRequestPaymentsForEdit?id=" + this.state.docId);
            this.props.actions.ExportingData({ items: [] });

            dataservice.GetDataList("GetCostCodingTreeByProjectId?projectId=" + this.state.projectId, "codeTreeTitle", "id").then(result => {
                this.setState({
                    fillDropDownTress: result
                });
            });
            this.setState({
                isLoading: true,
                documentDeduction: documentDeduction
            });
        } else {
            let paymentRequistion = {
                subject: "..",
                id: 0,
                projectId: this.state.projectId,
                arrange: "",
                docDate: moment(),
                status: true,
                useCommulative: true,
                advancedPaymentAmount: 0,
                contractId: "",
                vat: 0,
                tax: 0,
                insurance: 0,
                advancePaymentPercent: 0,
                collected: 0,
                useQuantity: false,
                percentComplete: "",
                quantityComplete: "",
                paymentPercent: ""
            };

            this.setState(
                {
                    document: paymentRequistion,
                    documentDeduction: documentDeduction
                },
                function () {
                    this.GetNExtArrange();
                }
            );
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.document.id !== state.document.id && nextProps.changeStatus === true) {
            let serverChangeOrder = { ...nextProps.document };
            serverChangeOrder.docDate = moment(serverChangeOrder.docDate).format("YYYY-MM-DD");
            serverChangeOrder.advancePaymentPercent = serverChangeOrder.advancePaymentPercent != null ? serverChangeOrder.advancePaymentPercent : 0;
            serverChangeOrder.tax = serverChangeOrder.tax != null ? serverChangeOrder.tax : 0;
            serverChangeOrder.vat = serverChangeOrder.vat != null ? serverChangeOrder.vat : 0;
            serverChangeOrder.insurance = serverChangeOrder.insurance != null ? serverChangeOrder.insurance : 0;
            serverChangeOrder.actualPayment = serverChangeOrder.actualPayment != null ? serverChangeOrder.actualPayment : 0;
            serverChangeOrder.advancedPaymentAmount = serverChangeOrder.advancedPaymentAmount != null ? serverChangeOrder.advancedPaymentAmount : 0;
            serverChangeOrder.retainagePercent = serverChangeOrder.retainagePercent != null ? serverChangeOrder.retainagePercent : 0;
            serverChangeOrder.remainingPayment = serverChangeOrder.remainingPayment != null ? serverChangeOrder.remainingPayment : 0;
            serverChangeOrder.percentComplete = "";
            serverChangeOrder.quantityComplete = "";
            serverChangeOrder.paymentPercent = "";
            serverChangeOrder.lastComment = "";

            return {
                document: { ...serverChangeOrder },
                hasWorkflow: nextProps.hasWorkflow
            };
        }
        return null
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.document.id !== this.props.document.id && this.props.changeStatus === true) {
            this.fillDropDowns(this.props.document.id > 0 ? true : false);
            this.checkDocumentIsView();
            this.fillSummariesTab();
        }

        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (this.state.isCompany() === true) 
            { 
                this.setState({ isViewMode: false }); 
            } else {
                if (!Config.IsAllow(187)) {
                    this.setState({ isViewMode: true });
                }
                if (this.state.isApproveMode != true && Config.IsAllow(187)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(187)) {
                        //close => false
                        if (this.props.document.status !== false && Config.IsAllow(187)) {
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

    GetNExtArrange() {
        let original_document = { ...this.state.document };

        let updated_document = {};

        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=0&contactId=0";

        dataservice.GetNextArrangeMainDocument(url).then(res => {

            updated_document.arrange = res;

            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document
            });
        });
    }

    fillDropDowns(isEdit) {
        if (isEdit === false) {
            dataservice.GetDataGrid("GetContractsListForPaymentRequistion?projectId=" + this.state.projectId).then(result => {
                let Data = [];
                result.forEach(item => {
                    var obj = {};
                    obj.label = item["subject"];
                    obj.value = item["id"];
                    Data.push(obj);
                });

                this.setState({
                    contractsPos: [...Data],
                    contractsPool: result
                });
            });

        }
        // else {
        //this.fillSummariesTab();
        // }
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    onChangeMessage = value => {
        if (value != null) {
            let original_document = { ...this.state.document };

            let updated_document = {};

            updated_document.comment = value;

            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document,
                comment: value
            });
        }
    };

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

    handleChangeDropDownContract(event, field, selectedValue) {
        if (event == null) return;
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
            [selectedValue]: event
        });

        if (this.props.changeStatus === false) {
            this.setState({
                isLoading: true
            });

            this.buildColumns(this.props.changeStatus);

            dataservice.GetDataGrid("GetRequestItemsOrderByContractId?contractId=" + event.value + "&isAdd=true&requestId=" + this.state.docId + "&pageNumber=" +
                this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                    this.setState({
                        paymentsItems: result,
                        isLoading: false
                    });
                });

            let contract = find(this.state.contractsPool, function (x) {
                return x.id == event.value;
            });

            if (contract) {
                var objDate = new Date(),
                    month = objDate.toLocaleString("en", { month: "long" });
                var year = objDate.getFullYear();

                updated_document.subject = "Payment Requisition " + contract.subject + " (" + year + "/" + month + ") " + original_document.arrange;

                updated_document.vat = parseFloat(contract.vat);
                updated_document.tax = parseFloat(contract.tax);
                updated_document.insurance = parseFloat(contract.insurance);
                updated_document.advancePaymentPercent = parseFloat(contract.advancedPayment);
                updated_document.retainagePercent = parseFloat(contract.retainage);
                updated_document.advancedPaymentAmount = contract.advancedPaymentAmount != null ? parseFloat(contract.advancedPaymentAmount) : 0;

                this.setState({
                    document: updated_document
                });
            }
        }
    }

    editPaymentRequistion(event) {
        this.setState({
            isLoading: true
        });

        let saveDocument = this.state.document;
        this.changeCurrentStep(1);
        saveDocument.docDate = moment(saveDocument.docDate, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        dataservice.addObject("EditContractsRequestPayments", saveDocument).then(result => {
            this.setState({
                isLoading: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(res => {
            this.setState({
                isLoading: false
            });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    saveVariationOrder(event) {
        this.setState({
            isLoading: true
        });
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

        saveDocument.projectId = this.state.projectId;

        dataservice.addObject("AddContractsRequestPayment", saveDocument).then(result => {
            if (result.id) {

                this.setState({
                    docId: result.id,
                    isLoading: false
                });

                this.changeCurrentStep(1);

                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        }).catch(res => {
            this.setState({
                isLoading: false
            });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
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
                <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type="submit">
                    {Resources.next[currentLanguage]}
                </button>
            );
        }

        return btn;
    }

    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(3317) === true ? (
                <ViewAttachment
                    isApproveMode={this.state.isViewMode}
                    docTypeId={this.state.docTypeId}
                    docId={this.state.docId}
                    projectId={this.state.projectId}
                    deleteAttachments={840}
                />
            ) : null
        ) : null;
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    fillGridItems = () => {
        let contractId = this.state.document.contractId;
        if (this.props.changeStatus == true) {
            let paymentsItems = [...this.state.paymentsItems];

            if (paymentsItems.length === 0) {
                this.buildColumns(this.props.changeStatus);
                this.setState({ isLoading: true });
                dataservice.GetDataGrid("GetRequestItemsOrderByContractId?contractId=" + contractId + "&isAdd=false&requestId=" + this.state.docId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                    this.setState({
                        paymentsItems: result != null ? result : [],
                        isLoading: false
                    });
                });
            }
        }
    };

    fillSummariesTab = () => {
        let contractId = this.state.document.contractId;
        let interimInvoicedTable = [...this.state.interimInvoicedTable];
        let isItemUpdate = this.state.isItemUpdate;

        if ((interimInvoicedTable.length == 0 || isItemUpdate === true) && contractId > 0) {
            this.setState({
                isLoading: true
            });

            dataservice.GetDataGrid("GetTotalForReqPay?projectId=" + projectId + "&contractId=" + contractId + "&requestId=" + this.state.docId).then(result => {

                this.props.actions.ExportingData({ items: result });
                this.setState({
                    interimInvoicedTable: result || [],
                    isLoading: false,
                    isItemUpdate: false
                });
            }).catch(res => {
                this.setState({
                    interimInvoicedTable: [],
                    isLoading: false,
                    isItemUpdate: false
                });
            });
        } else {
            this.setState({
                isLoading: false,
                isItemUpdate: false
            });

        }

        let approvedInvoicesChilds = [...this.state.approvedInvoicesChilds];

        if (approvedInvoicesChilds.length == 0 && contractId > 0) {
            this.setState({
                isLoading: true
            });
            let rowTotal = 0;

            dataservice.GetDataGridPost("GetApprovedInvoicesParent?contractId=" + contractId + "&requestId=" + this.state.docId).then(result => {
                var obj = {};
                var conditionString = "";
                result = result || [];
                dataservice.GetDataGridPost("GetApprovedInvoicesChilds?projectId=" + projectId + "&contractId=" + contractId + "&requestId=" + this.state.docId).then(res => {

                    let approvedInvoicesParent = [];
                    res = res || [];
                    let columnsApprovedInvoices = [{
                        name: Resources["JobBuilding"][currentLanguage],
                        key: 'building'
                    }]
                    let trFoot = {};
                    result.map(parent => {
                        let sumRowTotal = 0;
                        let sumtotal = 0;

                        trFoot.building = Resources["total"][currentLanguage];

                        res.map(child => {
                            var total = child[parent.details];

                            trFoot[parent.details] = child[parent.details];

                            sumRowTotal += parseFloat(child.rowTotal);
                            sumtotal = total + sumtotal;
                            parent.total = sumtotal;
                        });

                        rowTotal = sumRowTotal;

                        conditionString = parent.details;

                        obj.building = "Total";
                        obj.code = "";
                        obj.exists = "";
                        obj.serial = "";
                        obj[conditionString] = parent.total;
                        obj.rowTotal = rowTotal;

                        approvedInvoicesChilds.push(obj);

                        columnsApprovedInvoices.push({
                            name: parent.details,
                            key: parent.details
                        })

                        if (parent.total === null) {
                            parent.total = 0;
                        }

                        approvedInvoicesParent.push(parent);
                    });

                    columnsApprovedInvoices.push({
                        name: Resources["total"][currentLanguage],
                        key: rowTotal
                    })
                    trFoot["rowTotal"] = rowTotal;
                    res.push({ ...trFoot });
                    this.setState({
                        approvedInvoicesChilds: res,
                        approvedInvoicesParent: approvedInvoicesParent,
                        isLoading: false,
                        rowTotal: rowTotal,
                        columnsApprovedInvoices
                    });
                });
            });
        }
    };

    fillDeductions = () => {
        let deductionObservableArray = [...this.state.deductionObservableArray];

        if (deductionObservableArray.length == 0) {
            this.setState({
                isLoading: true
            });

            dataservice.GetDataGrid("GetContractsRequestPaymentsDeductions?requestId=" + this.state.docId).then(result => {

                this.setState({
                    deductionObservableArray: result,
                    isLoading: false
                });
            }).catch(res => {
                this.setState({
                    isLoading: false
                });
            });
        }
    };

    changeCurrentStep = stepNo => {
        this.setState({ currentStep: stepNo });
    };

    saveVariationOrderItem(event) {

        let saveDocument = { ...this.state.voItem };

        saveDocument.changeOrderId = this.state.docId;

        dataservice.addObject("AddVOItems", saveDocument).then(result => {

            if (result) {
                let oldItems = [...this.state.voItems];
                oldItems.push(result);
                this.setState({
                    voItems: [...oldItems]
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        }).catch(res => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    handleChangeItem(e, field) {

        let original_document = { ...this.state.documentDeduction };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            documentDeduction: updated_document
        });
    }

    handleChangeItemDropDown(event, field, selectedValue, isSubscribe, url, param, nextTragetState) {

        if (event == null) return;
        let original_document = { ...this.state.voItem };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            voItem: updated_document,
            [selectedValue]: event
        });

        if (isSubscribe) {
            let action = url + "?" + param + "=" + event.value;
            dataservice.GetDataList(action, "title", "id").then(result => {
                this.setState({
                    [nextTragetState]: result
                });
            });
        }
    }

    onRowClick = (value, index, column) => {

        if (column.key != "BtnActions" && column.key != "actions") {

            let userType = Config.getPayload();

            if (this.props.hasWorkflow == false || this.state.isApproveMode == true) {
                if (this.props.changeStatus) {
                    let obj = this.state.document;
                    if (obj.status === true && obj.editable === true) {

                        let original_document = { ...this.state.currentObject };

                        let updated_document = {};

                        updated_document.percentComplete = value.percentComplete;
                        updated_document.quantityComplete = value.quantityComplete;
                        updated_document.paymentPercent = value.paymentPercent;
                        updated_document.lastComment = value.comment;
                        updated_document.id = value.id;

                        updated_document = Object.assign(original_document, updated_document);

                        this.setState({
                            viewPopUpRows: true,
                            currentObject: value
                        });
                        this.addCommentModal.show();
                    } else {
                        toast.warn(Resources["adminItemEditable"][currentLanguage]);
                    }
                }
            } else {
                toast.warn(Resources["adminItemEditable"][currentLanguage]);
            }
        } else if (column.key === "actions") {
            dataservice.GetDataGrid("GetReqPayCostCodingByRequestItemId?requestId=" + this.state.docId + "&reqItemId=" + value.id).then(result => {
                this.setState({
                    itemId: value.id,
                    quantityComplete: value.quantityComplete,
                    trees: result != null ? result : [],
                    showCostCodingTree: true
                });
                this.costCodingTree.show();
            });
        }
    };

    handleChangeItemDropDownItems(event, field, selectedValue, isSubscribe, url, param, nextTragetState) {
        if (event == null) return;
        let original_document = { ...this.state.boqStractureObj };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            boqStractureObj: updated_document,
            [selectedValue]: event
        });

        if (isSubscribe) {
            let action = url + "?" + param + "=" + event.value;
            dataservice.GetDataList(action, "title", "id").then(result => {
                this.setState({
                    [nextTragetState]: result
                });
            });
        }
    }

    _onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let paymentsItems = JSON.parse(JSON.stringify(this.state.paymentsItems));

        let updateRow = paymentsItems[fromRow];

        paymentsItems[fromRow] = Object.assign(paymentsItems[fromRow], updated);

        let newValue = parseFloat(updated[Object.keys(updated)[0]]);
        //let oldValue = parseFloat(updateRow[Object.keys(updated)[0]]);


        let sitePercentComplete = 0;
        let siteQuantityComplete = 0;
        if (parseFloat(updateRow.revisedQuantity) == 0 && (parseFloat(updateRow.siteQuantityComplete) > 0 || parseFloat(updateRow.sitePercentComplete) > 0)) {
            updateRow.revisedQuantity = 1;
        }

        updateRow[Object.keys(updated)[0]] = parseFloat(updated[Object.keys(updated)[0]]);

        switch (Object.keys(updated)[0]) {

            case "quantityComplete":
                updateRow.percentComplete = (parseFloat(newValue) / updateRow.revisedQuantity) * 100;
                updateRow.quantityComplete = parseFloat(newValue);
                break;

            case "sitePaymentPercent":
                updateRow.paymentPercent = parseFloat(newValue);
                updateRow.sitePaymentPercent = parseFloat(newValue);
                break;

            case "percentComplete":
                updateRow.quantityComplete = (parseFloat(newValue) / 100) * updateRow.revisedQuantity;
                updateRow.percentComplete = parseFloat(newValue);
                break;

            case "sitePercentComplete":
                sitePercentComplete = parseFloat(newValue);
                siteQuantityComplete = (parseFloat(newValue) / 100) * updateRow.revisedQuantity;

                updateRow.siteQuantityComplete = siteQuantityComplete;
                updateRow.quantityComplete = siteQuantityComplete;

                updateRow.percentComplete = sitePercentComplete;
                updateRow.sitePercentComplete = sitePercentComplete;

                break;

            case "siteQuantityComplete":
                sitePercentComplete = (parseFloat(newValue) / updateRow.revisedQuantity) * 100;
                siteQuantityComplete = parseFloat(newValue);

                updateRow.sitePercentComplete = sitePercentComplete;
                updateRow.percentComplete = sitePercentComplete;

                updateRow.quantityComplete = siteQuantityComplete;
                updateRow.siteQuantityComplete = siteQuantityComplete;

                break;
        }

        let editRows = [...this.state.editRows];

        let sameRow = find(editRows, function (x) {
            return x.id === updateRow.id;
        });

        if (sameRow) {
            editRows = editRows.filter(function (i) {
                return i.id != updateRow.id;
            });
        }

        editRows.push(updateRow);

        this.setState({
            editRows: editRows,
            paymentsItems,
            isFilter: true
        });
    };

    changeValueOfProps = () => {
        this.setState({ isFilter: false });
    }

    editRowsClick() {
        this.setState({ isLoading: true });

        let editItems = [...this.state.editRows];
        editItems.map(i => {
            if (i.revisedQuantity == 0 && i.siteQuantityComplete > 0) {
                i.revisedQuantity = 1;
            }
            i.percentComplete = (parseFloat(i.siteQuantityComplete) / i.revisedQuantity) * 100;
            i.sitePercentComplete = (parseFloat(i.siteQuantityComplete) / i.revisedQuantity) * 100;
            i.contractId = this.state.document.contractId;
            i.requestId = this.state.docId;
            i.projectId = projectId;
        });

        let api = this.props.changeStatus === true ? "EditContractsRequestPaymentsItems" : "AddContractsRequestPaymentsItemsNewScenario";
        dataservice.addObject(api, editItems).then(() => {

            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({
                isLoading: false, currentStep: 2
            });
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ isLoading: false });
        });
    }

    assign = () => {
        this.setState({ showBoqModal: true });
        this.boqTypeModal.show();
    };

    addDeduction() {
        this.setState({
            isLoading: true
        });

        let saveDocument = this.state.documentDeduction;

        saveDocument.requestId = this.state.docId;

        dataservice.addObject("AddContractsRequestPaymentsDeductions", saveDocument).then(result => {

            let list = [...this.state.deductionObservableArray];
            list.push(result);

            let documentDeduction = {
                title: "",
                deductionValue: 0,
                deductionObservableArray: list
            };

            this.setState({
                isLoading: false,
                documentDeduction: documentDeduction,
                deductionObservableArray: list
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(res => {
            this.setState({
                isLoading: false
            });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    assignBoqType = () => {
        let boqStractureObj = { ...this.state.boqStractureObj };

        this.setState({ showBoqModal: true, isLoading: true });

        dataservice.addObject("EditBoqStarcureRequestItem", boqStractureObj).then(() => {

            this.setState({ showBoqModal: false, isLoading: false });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ showBoqModal: false, isLoading: false });
        });
    };

    addCommentClick = () => {
        let comment = { ...this.state.comment };

        this.setState({ showCommentModal: true, isLoading: true });
        if (this.props.changeStatus) {
            this.setState({ showCommentModal: false, isLoading: false });
        }
    };

    handleChangeForEdit = (e, updated) => {
        let updateRow = this.state.currentObject;

        this.setState({
            isLoading: true
        });

        let sitePercentComplete = 0;
        let siteQuantityComplete = 0;
        let currentvalue = parseFloat(e.target.value);

        if (parseFloat(updateRow.revisedQuantity) == 0 && (parseFloat(updateRow.siteQuantityComplete) > 0 || parseFloat(updateRow.sitePercentComplete) > 0)) {
            updateRow.revisedQuantity = 1;
        }

        switch (updated) {

            case "quantityComplete":
                updateRow.percentComplete = (currentvalue / updateRow.revisedQuantity) * 100;
                updateRow.quantityComplete = currentvalue;
                break;

            case "sitePaymentPercent":
                updateRow.paymentPercent = currentvalue;
                updateRow.sitePaymentPercent = currentvalue;
                break;

            case "paymentPercent":
                updateRow.paymentPercent = currentvalue;
                break;

            case "percentComplete":
                updateRow.quantityComplete = (currentvalue / 100) * updateRow.revisedQuantity;
                updateRow.percentComplete = currentvalue;
                break;

            case "sitePercentComplete":
                sitePercentComplete = currentvalue;
                siteQuantityComplete = (currentvalue / 100) * updateRow.revisedQuantity;

                updateRow.siteQuantityComplete = siteQuantityComplete;
                updateRow.quantityComplete = siteQuantityComplete;

                updateRow.percentComplete = sitePercentComplete;
                updateRow.sitePercentComplete = sitePercentComplete;

                break;

            case "siteQuantityComplete":
                sitePercentComplete = (currentvalue / updateRow.revisedQuantity) * 100;
                siteQuantityComplete = currentvalue;

                updateRow.sitePercentComplete = sitePercentComplete;
                updateRow.percentComplete = sitePercentComplete;

                updateRow.quantityComplete = siteQuantityComplete;
                updateRow.siteQuantityComplete = siteQuantityComplete;

                break;

            case "lastComment":
                updateRow.comment = e.target.value;
                break;
        }

        this.setState({
            currentObject: updateRow,
            isLoading: false
        });
    };

    editPaymentRequistionItems = () => {

        let mainDoc = this.state.currentObject;
        mainDoc.requestId = this.state.docId;
        mainDoc.contractId = this.state.document.contractId;

        this.setState({
            isLoading: true
        });

        dataservice.addObject("EditRequestPaymentItem", mainDoc).then(result => {

            toast.success(Resources["operationSuccess"][currentLanguage]);

            this.setState({
                viewPopUpRows: false,
                isItemUpdate: true,
                isLoading: false
            });

        }).catch(res => {
            toast.error(
                Resources["operationCanceled"][currentLanguage]
            );
            this.setState({
                isLoading: false
            });
        });

    };

    handleDropAction(event) {

        switch (event.value) {
            case "1":
                dataservice.GetDataGrid("AddMissingAmendments?requestId=" + this.state.docId + "&contractId=" + this.state.document.contractId).then(result => {
                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                }).catch(res => {
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                    );
                });
                break;
            case "2":
                dataservice.GetDataGrid("UpdatePayemtRequistionTotals?id=" + this.state.docId).then(result => {
                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                }).catch(res => {
                    toast.error(
                        Resources["operationCanceled"][currentLanguage]
                    );
                });
                break;
            case "3":
                dataservice.GetDataGrid("UpdatePRItemsByVariationOrders?requestId=" + this.state.docId).then(result => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(res => {
                    toast.error(Resources["operationCanceled"][currentLanguage]);
                });
                break;
            case "4":
                dataservice.GetDataGrid("AddMissingItems?requestId=" + this.state.docId + "&contractId=" + this.state.document.contractId).then(result => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(res => {
                    toast.error(Resources["operationCanceled"][currentLanguage]);
                });
                break;
            case "5":
                this.editPayment.show();
                break;
            case "6":
                dataservice.GetDataGrid("UpdateInterimForRequest?requestId=" + this.state.docId + "&contractId=" + this.state.document.contractId).then(result => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(res => {
                    toast.error(Resources["operationCanceled"][currentLanguage]);
                });

            case "7":
                this.setState({
                    addDeducation: true
                });
                break;
            case "8":
                dataservice.GetDataGrid("UpdateAdvancedPaymentAmount?requestPaymentId=" + this.state.docId).then(result => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(res => {
                    toast.error(Resources["operationCanceled"][currentLanguage]);
                });
                break;
        }

        this.setState({
            selectedDropDown: event
        });
    }

    viewConfirmDelete(id, type) {
        this.setState({
            currentId: id,
            showDeleteModal: true,
            currentDocument: type
        });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerContinueMain = () => {
        if (this.state.currentDocument === "deduction") {
            let id = this.state.currentId;

            dataservice.GetDataGrid("ContractsRequestPaymentsDeductionsDelete?id=" + id + "&requestId=" + this.state.docId).then(result => {

                let originalData = this.state.deductionObservableArray;

                let getIndex = originalData.findIndex(x => x.id === id);

                originalData.splice(getIndex, 1);

                this.setState({
                    deductionObservableArray: originalData,
                    showDeleteModal: false
                });

                toast.success(
                    Resources["operationSuccess"][currentLanguage]
                );
            }).catch(ex => {
                toast.success(
                    Resources["operationSuccess"][currentLanguage]
                );
            });
        } else if (this.state.currentDocument === "requestItems") {
            this.setState({ isLoading: true });
            Api.post("DeletePaymentRequestItems", this.state.currentId).then(result => {

                let originalData = this.state.paymentsItems;
                let ids = this.state.currentId;
                let newItems = originalData.filter(
                    item => !ids.includes(item.id)
                );
                this.setState({
                    paymentsItems: newItems,
                    showDeleteModal: false,
                    isLoading: false
                });
                toast.success(
                    Resources["operationSuccess"][currentLanguage]
                );
            }).catch(ex => {

                toast.success(
                    Resources["operationCanceled"][currentLanguage]
                );
                this.setState({
                    showDeleteModal: false,
                    isLoading: false
                });
            });
        } else {
            if (this.props.changeStatus) {
                dataservice.GetDataGrid("DeleteDistributionItems?id=" + this.state.currentId).then(result => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                });
            }

            let originalData = this.state.trees;

            let getIndex = originalData.findIndex(x => x.id === this.state.currentId);

            originalData.splice(getIndex, 1);

            this.setState({
                trees: originalData,
                showDeleteModal: false
            });
        }
    };

    handleDropActionForExportFile = event => {
        let exportFile = "";

        if (event.label === "Export") {
            this.setState({ isView: false, exportFile: "" });

            const ExportColumns = itemsColumns.filter(
                i => i.key !== "BtnActions"
            );

            exportFile = (
                <Export isExportRequestPayment={true} type={1}
                    key={"Export-1"}
                    rows={this.state.isLoading === false ? this.state.paymentsItems : []}
                    columns={ExportColumns}
                    fileName={"Request Payments Items"} />
            );
        } else {
            this.setState({ isView: false, exportFile: "" });

            exportFile = (
                <Export isExportRequestPayment={true}
                    key={"Export-2"}
                    rows={this.state.isLoading === false ? this.state.paymentsItems : []}
                    columns={VOItemsColumns}
                    fileName={"Request Payments Items"}
                />
            );
        }
        this.setState({
            exportFile,
            isView: true,
            selectedDropDownExport: event
        });
    };

    updateActualPayments = () => {
        this.setState({ viewUpdatePayment: true });

        let obj = {};

        obj.id = this.state.docId;

        obj.actualPayment = this.state.actualPayments;

        dataservice.addObject("EditActualPayment", obj).then(result => {

            this.setState({ viewUpdatePayment: false });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(res => {

            this.setState({
                viewUpdatePayment: false
            });

            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    };

    updatePayemtWithVariationOrderByAdmin = () => {

        this.setState({ viewUpdateCalc: true });

        let requestId = this.state.docId;

        let contactId = this.state.document.contractId;

        dataservice.GetDataGrid("UpdatePayemtWithVariationOrderByAdmin?requestId=" + requestId + "&contractId=" + contactId).then(result => {
            this.setState({ viewUpdateCalc: false });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(res => {
            this.setState({
                viewUpdateCalc: false
            });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    };

    addCostTree = () => {

        let costCodingId = this.state.selectedDropDownTrees.value;

        if (costCodingId != "0") {
            let isExist = this.state.trees.find(x => x.costCodingId === costCodingId);

            if (isExist == undefined) {
                let objTree = {};

                objTree.id = this.state.id;
                objTree.requestItemId = this.state.itemId;
                objTree.requestId = this.state.docId;
                objTree.costCodingId = this.state.selectedDropDownTrees.value;
                objTree.costCodingTitle = this.state.selectedDropDownTrees.label;
                objTree.value = 0;
                objTree.percentageId = 1;
                objTree.qtyCompelete = this.state.quantityComplete;
                objTree.date = moment(this.state.document.docDate, "YYYY-MM-DD").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

                if (this.props.changeStatus) {
                    let lastCodingItems = this.state.trees;

                    dataservice.addObject("AddDistributionQuantityForEdit", objTree).then(result => {
                        lastCodingItems.push(objTree);
                        this.setState({
                            trees: lastCodingItems
                        });
                    });
                } else {
                    let lastCodingItems = this.state.trees;

                    lastCodingItems.push(objTree);

                    this.setState({
                        id: this.state.id + 1,
                        trees: lastCodingItems
                    });
                }
            } else {
                toast.warn("This CostCodingTree Already Added");
            }
        } else {
            toast.warn("Please Choose CostCodingTree");
        }
    };

    handleDropTrees = event => {
        if (event == null) return;

        this.setState({
            selectedDropDownTrees: event
        });
    };

    renderEditableValue = cellInfo => {
        return (
            <div style={{ color: "#4382f9 ", padding: "0px 6px", margin: "5px 0px", border: "1px dashed", cursor: "pointer" }} contentEditable suppressContentEditableWarning
                onBlur={e => {
                    const trees = [...this.state.trees];
                    trees[cellInfo.index][cellInfo.column.id] =
                        e.target.innerHTML;
                    this.setState({ trees });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.trees[cellInfo.index].value
                }}
            />
        );
    };

    actionHandler = (key, e) => {
        let state = this.state;

        state[key.id + "-drop"] = e;

        let lastData = this.state.trees;

        let data = lastData.findIndex(x => x.id === key.id);

        if (data != undefined || data != null) {
            if (lastData[data].percentageId != 1) {
                lastData[data].value =
                    lastData[data].qtyCompelete * lastData[data].value;
            }
        }

        this.setState({ state, trees: lastData });
    };

    AddedItems = () => {
        if (this.state.trees.length > 0) {
            this.setState({ isLoading: true });

            let originalData = this.state.trees;

            originalData = originalData.map(x => (x.value = parseFloat(x.value)));

            dataservice.addObject("AddDistributionQuantity", originalData).then(result => {

                toast.success(Resources["operationSuccess"][currentLanguage]);

                this.setState({
                    showCostCodingTree: false,
                    isLoading: false
                });
            });
        } else {
            toast.success("Please Add CostCodingTree");
        }
    };

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;

        if (pageNumber > 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });

            let oldRows = [...this.state.paymentsItems];

            dataservice.GetDataGrid("GetRequestItemsOrderByContractId?contractId=" + this.state.document.contractId + "&isAdd=true&requestId=" + this.state.docId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize).then(result => {

                const newRows = [...this.state.paymentsItems, ...result];

                this.setState({
                    paymentsItems: newRows,
                    isLoading: false
                });
            }).catch(ex => {
                this.setState({
                    paymentsItems: oldRows,
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

        let oldRows = [...this.state.paymentsItems];

        dataservice.GetDataGrid("GetRequestItemsOrderByContractId?contractId=" + this.state.document.contractId + "&isAdd=true&requestId=" + this.state.docId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
            const newRows = [...this.state.paymentsItems, ...result];

            this.setState({
                paymentsItems: newRows,
                isLoading: false
            });
        }).catch(ex => {
            this.setState({
                paymentsItems: oldRows,
                isLoading: false
            });
        });
    }

    clickHandlerDeleteRows = rows => {
        this.viewConfirmDelete(rows, "requestItems");
    };

    editAdvancedPayment() {
        if (this.state.advancedPayment != 0) {

            this.setState({
                isLoading: true
            });

            dataservice.addObject(`EditPaymentAmount?requestId=${this.state.docId}&value=${this.state.advancedPayment}`).then(result => {
                this.setState({
                    isLoading: false
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            });
        } else {
            toast.warn("Please Write Value MoreZane Zero");
        }
    }

    render() {

        let columns = [];

        if (this.state.userType !== "user") {
            columns.push(
                {
                    Header: "Controls",
                    id: "checkbox",
                    accessor: "id",
                    Cell: ({ row }) => {
                        return (
                            <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }}
                                onClick={() => this.viewConfirmDelete(row._original.id, "deduction")}>
                                <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                            </div>
                        );
                    },
                    width: 50
                },
                {
                    Header: Resources["description"][currentLanguage],
                    accessor: "title",
                    sortabel: true,
                    width: 200,
                    name: Resources["description"][currentLanguage],
                    key: 'title'
                },
                {
                    Header: Resources["deductions"][currentLanguage],
                    accessor: "deductionValue",
                    width: 200,
                    sortabel: true,
                    name: Resources["deductions"][currentLanguage],
                    key: 'deductionValue'
                }
            );
        } else {
            columns.push(
                {
                    Header: Resources["description"][currentLanguage],
                    accessor: "title",
                    sortabel: true,
                    width: 200,
                    name: Resources["description"][currentLanguage],
                    key: 'title'
                },
                {
                    Header: Resources["deductions"][currentLanguage],
                    accessor: "deductionValue",
                    width: 200,
                    sortabel: true,
                    name: Resources["deductions"][currentLanguage],
                    key: 'deductionValue'
                }
            );
        }

        //ExportDeducation
        const btnExportDeducation = this.state.isLoading === false ?
            (
                <Export key={"Export-3"} rows={this.state.isLoading === false ? this.state.deductionObservableArray : []}
                    columns={columns.filter(x => x.id != "checkbox")} fileName={Resources["informationDeductions"][currentLanguage]} />
            ) : null;

        //ExportInterimPayment 
        const btnExportInterimPayment = this.state.isLoading === false ?
            (
                <Export key={"Export-4"} rows={this.state.isLoading === false ? this.state.interimInvoicedTable : []} columns={columnOfInterimPayment}
                    fileName={Resources["interimPaymentCertificate"][currentLanguage]} />
            ) : null;

        //ExportApprovedInvoices
        const btnExportApprovedInvoices = this.state.isLoading === false ?
            (
                <Export key={"Export-5"}
                    rows={this.state.isLoading === false ? this.state.approvedInvoicesChilds : []}
                    columns={this.state.columnsApprovedInvoices}
                    fileName={Resources["summaryOfApprovedInvoices"][currentLanguage]} />
            ) : null;

        let columnsTrees = [
            {
                Header: "Delete",
                id: "checkbox",
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }}
                            onClick={() => this.viewConfirmDelete(row._original.id, "trees")}>
                            <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                        </div>
                    );
                },
                width: 100
            },
            {
                Header: Resources["costCodingTree"][currentLanguage],
                accessor: "costCodingTitle",
                sortabel: true,
                width: 200
            },
            {
                Header: Resources["value"][currentLanguage],
                accessor: "value",
                Cell: this.renderEditableValue,
                width: 200
            },
            {
                Header: Resources["percentageStatus"][currentLanguage],
                accessor: "percentageStatus",
                Cell: ({ row }) => {
                    return (
                        <div className="shareLinks">
                            <Dropdown title="" data={this.state.percentageStatus}
                                handleChange={e => this.actionHandler(row._original, e)}
                                selectedValue={this.state[row._original.id + "-drop"]}
                                name={row._original.id + "-drop"}
                                index={Date.now()}
                            />
                        </div>
                    );
                },
                width: 200
            }
        ];

        const ItemsGrid = this.state.isLoading === false && this.state.currentStep === 1 ? (
            <GridSetupWithFilter
                groupBy={this.props.changeStatus ? [
                    { key: 'wasAdded', name: 'status' }
                    , { key: 'boqType', name: 'boqType' }
                    , { key: 'secondLevel', name: 'boqTypeChild' }] : null}
                rows={this.state.paymentsItems}
                isFilter={this.state.isFilter}
                showCheckbox={isCompany && this.props.changeStatus ? true : false}
                clickHandlerDeleteRows={this.clickHandlerDeleteRows}
                pageSize={this.state.pageSize}
                onRowClick={this.onRowClick}
                columns={itemsColumns}
                onGridRowsUpdated={this._onGridRowsUpdated}
                getCellActions={(column, row) => this.getCellActions(column, row)}
                key="PRitems"
                changeValueOfProps={this.changeValueOfProps.bind(this)} />

        ) : null;

        const BoqTypeContent = (
            <Fragment>
                <div className="dropWrapper">
                    {this.state.isLoading ? <LoadingSection /> : null}
                    <Formik enableReinitialize={true} initialValues={{ boqType: "", boqChild: "", boqSubType: "" }}
                        validationSchema={BoqTypeSchema}
                        onSubmit={values => { this.assignBoqType(); }}>
                        {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                            <Form id="signupForm1" className="proForm datepickerContainer customProform" noValidate="novalidate">
                                <div className="fullWidthWrapper textLeft">
                                    <Dropdown title="boqType" data={this.state.boqTypes} selectedValue={this.state.selectedBoqTypeEdit}
                                        handleChange={event => this.handleChangeItemDropDownItems(event, "boqTypeId", "selectedBoqTypeEdit", true, "GetAllBoqChild", "parentId", "BoqTypeChilds")}
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.boqType}
                                        touched={touched.boqType}
                                        name="boqType"
                                        index="boqType"
                                    />
                                </div>
                                <Dropdown title="boqTypeChild" data={this.state.BoqTypeChilds}
                                    selectedValue={this.state.selectedBoqTypeChildEdit}
                                    handleChange={event => this.handleChangeItemDropDownItems(event, "boqTypeChildId", "selectedBoqTypeChildEdit", true, "GetAllBoqChild", "parentId", "BoqSubTypes")}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                    error={errors.boqChild}
                                    touched={touched.boqChild}
                                    name="boqChild"
                                    index="boqChild"
                                />
                                <Dropdown title="boqSubType" data={this.state.BoqSubTypes}
                                    selectedValue={this.state.selectedBoqSubTypeEdit}
                                    handleChange={event => this.handleChangeItemDropDownItems(event, "boqSubTypeId", "selectedBoqSubTypeEdit", false, "", "", "")}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                    error={errors.boqSubType}
                                    touched={touched.boqSubType}
                                    name="boqSubType"
                                    index="boqSubType"
                                />
                                <div className={"slider-Btns fullWidthWrapper"}>
                                    <button className={this.state.isViewMode === true ? "primaryBtn-1 btn  disNone" : "primaryBtn-1 btn "} type="submit">
                                        {Resources["save"][currentLanguage]}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Fragment>
        );

        let interimTable =
            this.state.interimInvoicedTable.map(i => (
                <tr key={i.id}>
                    {i.comment == "True" ? (
                        <td colSpan="3">
                            <div className="contentCell tableCell-2">
                                <a>
                                    {i.description != null ? i.description.slice(0, i.description.lastIndexOf("-") == -1 ? i.description.length : i.description.lastIndexOf("-")) : ""}
                                </a>
                            </div>
                        </td>
                    ) : (
                            <Fragment>
                                <td colSpan="3">
                                    <div className="contentCell tableCell-2">
                                        <a data-toggle="tooltip" title={i.description != null ? i.description.slice(0, i.description.lastIndexOf("-") == -1 ? i.description.length : i.description.lastIndexOf("-")) : ""}>
                                            {i.description != null ? i.description.slice(0, i.description.lastIndexOf("-") == -1 ? i.description.length : i.description.lastIndexOf("-")) : ""}
                                        </a>
                                    </div>
                                </td>
                                <td colSpan="1">
                                    <div className="contentCell">
                                        {i.prevoiuse != null ? parseFloat(i.prevoiuse).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                                    </div>
                                </td>
                                <td colSpan="1">
                                    <div className="contentCell">
                                        {i.currentValue != null ? parseFloat(i.currentValue.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                                    </div>
                                </td>
                                <td colSpan="1">
                                    <div className="contentCell">
                                        {i.total != null ? parseFloat(i.total.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                                    </div>
                                </td>
                                <td colSpan="1">
                                    <div className="contentCell">
                                        {i.contractorPrevoiuse != null ? parseFloat(i.contractorPrevoiuse).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                                    </div>
                                </td>
                                <td colSpan="1">
                                    <div className="contentCell">
                                        {i.contractorCurrentValue != null ? parseFloat(i.contractorCurrentValue.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                                    </div>
                                </td>
                                <td colSpan="1">
                                    <div className="contentCell">
                                        {i.contractorTotal != null ? parseFloat(i.contractorTotal.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}
                                    </div>
                                </td>
                                <td colSpan="3">
                                    <div className="contentCell">
                                        {i.comment}
                                    </div>
                                </td>
                            </Fragment>
                        )}
                </tr>
            ))

        let viewHistory = (
            <div className="doc-pre-cycle">
                <table className="attachmentTable" key="DeductionsCertificate">
                    <thead>
                        <tr>
                            <th style={{ width: "30%" }}>
                                <div className="headCell">
                                    {Resources["description"][currentLanguage]}
                                </div>
                            </th>
                            <th style={{ width: "10%" }}>
                                <div className="headCell">
                                    {Resources["completedQuantity"][currentLanguage]}
                                </div>
                            </th>
                            <th style={{ width: "10%" }}>
                                <div className="headCell">
                                    {Resources["paymentPercent"][currentLanguage]}
                                </div>
                            </th>
                            <th style={{ width: "10%" }}>
                                <div className="headCell">
                                    {Resources["addedBy"][currentLanguage]}
                                </div>
                            </th>
                            <th style={{ width: "10%" }}>
                                <div className="headCell">
                                    {Resources["addedDate"][currentLanguage]}
                                </div>
                            </th>
                            <th style={{ width: "10%" }}>
                                <div className="headCell">
                                    {Resources["comment"][currentLanguage]}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.paymentRequestItemsHistory.map(i => (
                            <tr key={i.id}>
                                <Fragment>
                                    <td style={{ width: "50%" }}>
                                        <div className="contentCell">
                                            {i.description}
                                        </div>
                                    </td>
                                    <td style={{ width: "50%" }}>
                                        <div className="contentCell">
                                            {i.completedQnty}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contentCell">
                                            {i.paymentPercent}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contentCell">
                                            {i.addedByName}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contentCell">
                                            {moment(i.addedDate).format("YYYY-MM-DD")}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contentCell">
                                            {i.comment}
                                        </div>
                                    </td>
                                </Fragment>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

        let approvedSummaries = this.state.isLoading === false ? (
            <Fragment>
                <header>
                    <h2 className="zero">
                        {Resources["summaryOfApprovedInvoices"][currentLanguage]}
                    </h2>
                </header>
                {btnExportApprovedInvoices}
                <div style={{ maxWidth: '100%', overflowX: 'scroll' }}>
                    <table className="attachmentTable " key="summaryOfApprovedInvoices">
                        <thead>
                            <tr>
                                <th width="15%">
                                    <div className="headCell">
                                        {Resources["JobBuilding"][currentLanguage]}
                                    </div>
                                </th>
                                {this.state.approvedInvoicesParent.map((i, index) => (
                                    <th key={'th-approvedInvoicesParent' + index}>
                                        <div className="headCell">
                                            {i.details ? i.details.slice(0, i.details.lastIndexOf("-")) : ""}
                                        </div>
                                    </th>
                                ))}
                                <th width="10%">
                                    <div className="headCell">
                                        {Resources["total"][currentLanguage]}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.approvedInvoicesChilds.map((i, idx) => (
                                <tr key={'tr-approvedInvoicesChilds-' + idx}>
                                    <td>
                                        {i.building ? i.building.slice(0, i.building.lastIndexOf("-")) : ""}
                                    </td>

                                    {this.state.approvedInvoicesParent.map((data, index) => (

                                        <td key={'td-approvedInvoicesParent-' + index}>
                                            {parseFloat(i[data.details]).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </td>

                                    )
                                    )}
                                    <td>
                                        {parseFloat(i.rowTotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ,")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Fragment>
        ) : (<LoadingSection />);

        let ExportColumns = itemsColumns.filter(i => i.key !== "BtnActions");

        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute}
                        docTitle={Resources.paymentRequisitions[currentLanguage]} moduleTitle={Resources["contracts"][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            {this.state.currentStep == 0 ? (
                                <Fragment>
                                    <div id="step1" className="step-content-body">
                                        <div className="subiTabsContent">
                                            <div className="document-fields">
                                                <Formik initialValues={{ ...this.state.document }}
                                                    validationSchema={validationSchema}
                                                    enableReinitialize={this.props.changeStatus}
                                                    onSubmit={values => {
                                                        if (this.props.showModal) { return; }

                                                        if (this.props.changeStatus === false && this.state.docId === 0) {
                                                            this.saveVariationOrder();
                                                        } else {
                                                            this.editPaymentRequistion();
                                                        }
                                                    }}>
                                                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                        <Form id="RequestPaymentForm" className="customProform" noValidate="novalidate"
                                                            onSubmit={handleSubmit}>
                                                            <div className="proForm first-proform">
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">
                                                                        {Resources.subject[currentLanguage]}
                                                                    </label>
                                                                    <div className={"inputDev ui input" + (errors.subject && touched.subject ? " has-error" : !errors.subject && touched.subject ? " has-success" : " ")}>
                                                                        <input name="subject" className="form-control fsadfsadsa" id="subject"
                                                                            placeholder={Resources.subject[currentLanguage]}
                                                                            autoComplete="off" value={this.state.document.subject || ''}
                                                                            onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                            onChange={e => this.handleChange(e, "subject")} />
                                                                        {touched.subject ? (<em className="pError"> {errors.subject} </em>) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">
                                                                        {Resources.status[currentLanguage]}
                                                                    </label>
                                                                    <div className="ui checkbox radio radioBoxBlue">
                                                                        <input type="radio" name="letter-status"
                                                                            defaultChecked={this.state.document.status === false ? null : "checked"}
                                                                            value="true" onChange={e => this.handleChange(e, "status")} />
                                                                        <label>
                                                                            {Resources.oppened[currentLanguage]}
                                                                        </label>
                                                                    </div>
                                                                    <div className="ui checkbox radio radioBoxBlue">
                                                                        <input type="radio" name="letter-status"
                                                                            defaultChecked={this.state.document.status === false ? "checked" : null}
                                                                            value="false" onChange={e => this.handleChange(e, "status")} />
                                                                        <label>
                                                                            {Resources.closed[currentLanguage]}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="proForm datepickerContainer">
                                                                <div className="linebylineInput valid-input alternativeDate">
                                                                    <DatePicker title="docDate"
                                                                        onChange={e => setFieldValue("docDate", e)}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.docDate}
                                                                        touched={touched.docDate}
                                                                        name="docDate"
                                                                        startDate={this.state.document.docDate}
                                                                        handleChange={e => this.handleChangeDate(e, "docDate")} />
                                                                </div>

                                                                <div className="linebylineInput  account__checkbox">
                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">
                                                                            {Resources.collectedStatus[currentLanguage]}
                                                                        </label>
                                                                        <div className="ui checkbox radio radioBoxBlue">
                                                                            <input type="radio" name="PR-collected" defaultChecked={this.state.document.collected === 0 ? null : "checked"}
                                                                                value="1" onChange={e => this.handleChange(e, "collected")} />
                                                                            <label>
                                                                                {Resources.yes[currentLanguage]}
                                                                            </label>
                                                                        </div>
                                                                        <div className="ui checkbox radio radioBoxBlue">
                                                                            <input type="radio" name="PR-collected"
                                                                                defaultChecked={this.state.document.collected === 0 ? "checked" : null}
                                                                                value="0" onChange={e => this.handleChange(e, "collected")} />
                                                                            <label>
                                                                                {Resources.no[currentLanguage]}
                                                                            </label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">
                                                                            {Resources.useCommulative[currentLanguage]}
                                                                        </label>
                                                                        <div className="ui checkbox radio radioBoxBlue">
                                                                            <input type="radio" name="PR-useCommulativeValue"
                                                                                defaultChecked={this.state.document.useCommulativeValue === false ? null : "checked"}
                                                                                value="true" onChange={e => this.handleChange(e, "useCommulativeValue")} />
                                                                            <label>
                                                                                {Resources.yes[currentLanguage]}
                                                                            </label>
                                                                        </div>
                                                                        <div className="ui checkbox radio radioBoxBlue">
                                                                            <input type="radio" name="PR-useCommulativeValue"
                                                                                defaultChecked={this.state.document.useCommulativeValue === false ? "checked" : null}
                                                                                value="false" onChange={e => this.handleChange(e, "useCommulativeValue")} />
                                                                            <label>
                                                                                {Resources.no[currentLanguage]}
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">
                                                                        {Resources.arrange[currentLanguage]}
                                                                    </label>
                                                                    <div className="ui input inputDev">
                                                                        <input type="text" className="form-control" id="arrange"
                                                                            readOnly value={this.state.document.arrange || 1}
                                                                            name="arrange" placeholder={Resources.arrange[currentLanguage]}
                                                                            onBlur={e => { handleChange(e); handleBlur(e); }}
                                                                            onChange={e => this.handleChange(e, "arrange")} />
                                                                    </div>
                                                                </div>

                                                                {this.props.changeStatus === true ? (
                                                                    <div className="proForm first-proform letterFullWidth proform__twoInput">
                                                                        <div className="linebylineInput valid-input">
                                                                            <label className="control-label">
                                                                                {Resources.contractName[currentLanguage]}
                                                                            </label>
                                                                            <div className="ui input inputDev">
                                                                                <input type="text" className="form-control" id="contractSubject" readOnly
                                                                                    value={this.state.document.contractName}
                                                                                    name="contractSubject" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                        <div className="linebylineInput valid-input">
                                                                            <Dropdown title="contractName"
                                                                                data={this.state.contractsPos}
                                                                                selectedValue={this.state.selectContract}
                                                                                handleChange={event => this.handleChangeDropDownContract(event, "contractId", "selectContract")}
                                                                                index="contractId"
                                                                                onChange={setFieldValue}
                                                                                onBlur={setFieldTouched}
                                                                                error={errors.contractId}
                                                                                touched={touched.contractId}
                                                                                isClear={false}
                                                                                name="contractId"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">
                                                                        {Resources.advancePaymentPercent[currentLanguage]}
                                                                    </label>
                                                                    <div className={"ui input inputDev" + (errors.advancePaymentPercent && touched.advancePaymentPercent ? " has-error" : "ui input inputDev")}>
                                                                        <input type="text" className="form-control"
                                                                            value={this.state.document.advancePaymentPercent || ''}
                                                                            name="advancePaymentPercent"
                                                                            placeholder={Resources.advancePaymentPercent[currentLanguage]}
                                                                            onBlur={e => { handleChange(e); handleBlur(e); }}
                                                                            onChange={e => this.handleChange(e, "advancePaymentPercent")} />
                                                                        {touched.advancePaymentPercent ? (<em className="pError"> {errors.advancePaymentPercent} </em>) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">
                                                                        {Resources.retainagePercent[currentLanguage]}
                                                                    </label>
                                                                    <div className={"ui input inputDev" + (errors.retainagePercent && touched.retainagePercent ? " has-error" : "ui input inputDev")}>
                                                                        <input type="text" className="form-control" id="retainagePercent" name="retainagePercent" readOnly value={this.state.document.retainagePercent || ''}
                                                                            placeholder={Resources.retainagePercent[currentLanguage]}
                                                                            onBlur={e => { handleChange(e); handleBlur(e); }}
                                                                            onChange={e => this.handleChange(e, "retainagePercent")}
                                                                        />
                                                                        {touched.retainagePercent ? (<em className="pError"> {errors.retainagePercent} </em>) : null}
                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">
                                                                        {Resources.tax[currentLanguage]}
                                                                    </label>
                                                                    <div className={"ui input inputDev" + (errors.tax && touched.tax ? " has-error" : "ui input inputDev")}>
                                                                        <input type="text" className="form-control" id="tax" name="tax" readOnly value={this.state.document.tax || ''}
                                                                            placeholder={Resources.tax[currentLanguage]} onBlur={e => { handleChange(e); handleBlur(e); }} onChange={e => this.handleChange(e, "tax")} />
                                                                        {touched.tax ? (<em className="pError"> {errors.tax} </em>) : null}
                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">
                                                                        {Resources.vat[currentLanguage]}
                                                                    </label>
                                                                    <div className={"ui input inputDev" + (errors.vat && touched.vat ? " has-error" : "ui input inputDev")}>
                                                                        <input type="text" className="form-control" id="vat" name="vat" readOnly value={this.state.document.vat || ''}
                                                                            placeholder={Resources.vat[currentLanguage]}
                                                                            onBlur={e => { handleChange(e); handleBlur(e); }}
                                                                            onChange={e => this.handleChange(e, "vat")} />
                                                                        {touched.vat ? (<em className="pError"> {errors.vat} </em>) : null}
                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">
                                                                        {Resources.insurance[currentLanguage]}
                                                                    </label>
                                                                    <div className={"ui input inputDev" + (errors.insurance && touched.insurance ? " has-error" : "ui input inputDev")}>
                                                                        <input type="text" className="form-control" id="insurance" name="insurance" readOnly
                                                                            value={this.state.document.insurance || ''}
                                                                            placeholder={Resources.insurance[currentLanguage]}
                                                                            onBlur={e => { handleChange(e); handleBlur(e); }}
                                                                            onChange={e => this.handleChange(e, "insurance")}
                                                                        />
                                                                        {touched.insurance ? (<em className="pError"> {errors.insurance} </em>) : null}
                                                                    </div>
                                                                </div>

                                                                {this.props.changeStatus ?
                                                                    <Fragment>
                                                                        <div className="linebylineInput valid-input">
                                                                            <label className="control-label">
                                                                                {Resources.actualPayment[currentLanguage]}
                                                                            </label>
                                                                            <div className={"ui input inputDev" + (errors.actualPayment && touched.actualPayment ? " has-error" : "ui input inputDev")}>
                                                                                <input type="text" className="form-control" id="actualPayment" name="actualPayment"
                                                                                    value={this.state.document.actualPayment || ''}
                                                                                    placeholder={Resources.actualPayment[currentLanguage]}
                                                                                    onBlur={e => { handleChange(e); handleBlur(e); }}
                                                                                    onChange={e => this.handleChange(e, "actualPayment")} />
                                                                                {touched.actualPayment ? (<em className="pError"> {errors.actualPayment} </em>) : null}
                                                                            </div>
                                                                        </div>
                                                                        <div className="linebylineInput valid-input">
                                                                            <label className="control-label">
                                                                                {Resources.remainingPayment[currentLanguage]}
                                                                            </label>
                                                                            <div className="ui input inputDev">
                                                                                <input type="text" className="form-control" name="remainingPayment"
                                                                                    value={this.state.document.remainingPayment || ''}
                                                                                    placeholder={Resources.remainingPayment[currentLanguage]}
                                                                                    onChange={e => this.handleChange(e, "remainingPayment")} />
                                                                            </div>
                                                                        </div>
                                                                    </Fragment>
                                                                    : null}
                                                            </div>
                                                            <div className="slider-Btns slider-Btns--menu">
                                                                {this.state.isLoading === false ? (this.showBtnsSaving()) : (
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

                                                                {this.props.changeStatus === true ? (this.state.userType != "user" ? (
                                                                    <div className="default__dropdown" style={{ minWidth: "225px" }}>
                                                                        <Dropdown data={this.state.fillDropDown}
                                                                            selectedValue={this.state.selectedDropDown}
                                                                            handleChange={event => { this.handleDropAction(event); }}
                                                                            onChange={setFieldValue}
                                                                            name="actions"
                                                                            index="actions"
                                                                        />
                                                                    </div>
                                                                ) : null
                                                                ) : null}
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </div>
                                            <div className="doc-pre-cycle letterFullWidth">
                                                <div>
                                                    {this.state.docId > 0 && this.state.isViewMode === false ?
                                                        (<UploadAttachment changeStatus={this.props.changeStatus}
                                                            AddAttachments={839}
                                                            EditAttachments={3223}
                                                            ShowDropBox={3607}
                                                            ShowGoogleDrive={3608}
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
                                                            projectId={this.state.projectId} />
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            ) : null}
                            {this.state.currentStep == 1 ? (
                                <Fragment>
                                    <div className="subiTabsContent feilds__top">
                                        {this.props.changeStatus ? (
                                            <div className="doc-pre-cycle">
                                                <header>
                                                    <h2 className="zero">
                                                        {Resources["actualPayment"][currentLanguage]}
                                                    </h2>
                                                </header>
                                                <div className="inpuBtn proForm">
                                                    <div className="linebylineInput valid-input ">
                                                        <label className="control-label">
                                                            {Resources.actualPayment[currentLanguage]}
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input type="text" className="form-control" name="actualPayment"
                                                                value={this.state.actualPayments}
                                                                placeholder={Resources.actualPayment[currentLanguage]}
                                                                onChange={event => this.setState({ actualPayments: event.target.value })} />
                                                        </div>
                                                    </div>

                                                    {this.state.viewUpdatePayment ? (
                                                        <button className="primaryBtn-1 btn  disabled" disabled="disabled">
                                                            <div className="spinner">
                                                                <div className="bounce1" />
                                                                <div className="bounce2" />
                                                                <div className="bounce3" />
                                                            </div>
                                                        </button>
                                                    ) : (
                                                            <button className="primaryBtn-1 btn meduimBtn"
                                                                onClick={this.updateActualPayments}>
                                                                {Resources["update"][currentLanguage]}
                                                            </button>
                                                        )}
                                                </div>
                                                {this.state.viewUpdateCalc ? (
                                                    <button
                                                        className="primaryBtn-1 btn  disabled"
                                                        disabled="disabled">
                                                        <div className="spinner">
                                                            <div className="bounce1" />
                                                            <div className="bounce2" />
                                                            <div className="bounce3" />
                                                        </div>
                                                    </button>
                                                ) : (
                                                        <div className="slider-Btns ">
                                                            {this.state.isViewMode !== true ? <button className="primaryBtn-1 btn meduimBtn" onClick={this.updatePayemtWithVariationOrderByAdmin}>
                                                                {Resources["recalculateWithVariation"][currentLanguage]}
                                                            </button> : null}
                                                        </div>
                                                    )}
                                            </div>
                                        ) : ("")}
                                        <div className="doc-pre-cycle">
                                            <div className="submittalFilter readOnly__disabled">
                                                <div className="subFilter">
                                                    <h3 className="zero">
                                                        {Resources["AddedItems"][currentLanguage]}
                                                    </h3>
                                                    <span>
                                                        {this.state.paymentsItems.length}
                                                    </span>
                                                </div>
                                                <div className="filterBTNS">
                                                    <div className="default__dropdown--custom" style={{ marginBottom: "0" }}>
                                                        <div className="default__dropdown">
                                                            <Dropdown data={this.state.fillDropDownExport}
                                                                selectedValue={this.state.selectedDropDownExport}
                                                                handleChange={event => this.handleDropActionForExportFile(event)}
                                                                index="contractId"
                                                                name="contractId"
                                                                styles={actionPanel}
                                                            />
                                                            <div style={{ display: "none" }}>
                                                                {this.state.exportFile}
                                                            </div>
                                                        </div>
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

                                            {this.state.editRows.length > 0 ? (
                                                <div className="doc-pre-cycle">
                                                    <div className="slider-Btns editableRows">
                                                        <span>
                                                            No.Update Rows.
                                                            {this.state.editRows.length}
                                                        </span>
                                                        <button className="primaryBtn-1 btn meduimBtn" onClick={this.editRowsClick}>
                                                            {
                                                                Resources["edit"][currentLanguage]
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : null}

                            {this.state.currentStep == 3 ? (
                                <Fragment>
                                    <div className="subiTabsContent feilds__top">
                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">
                                                    {Resources["interimPaymentCertificate"][currentLanguage]}
                                                </h2>
                                            </header>
                                            {btnExportInterimPayment}
                                            <table className="attachmentTable attachmentTableAuto specialTable" key="interimPaymentCertificate">
                                                <thead>
                                                    <tr>
                                                        <th colSpan="3">
                                                            <div className="headCell">
                                                                {Resources["workDescription"][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th colSpan="3">
                                                            <div className="headCell">
                                                                {Resources["consultatnt"][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th colSpan="3">
                                                            <div className="headCell">
                                                                {Resources["contractor"][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th colSpan="3">
                                                            <div className="headCell">
                                                                {Resources["comments"][currentLanguage]}
                                                            </div>
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan="3"></th>
                                                        <th colSpan="1">
                                                            <div className="headCell">
                                                                {Resources["previous"][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th colSpan="1">
                                                            <div className="headCell">
                                                                {Resources["current"][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th colSpan="1">
                                                            <div className="headCell">
                                                                {Resources["total"][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th colSpan="1">
                                                            <div className="headCell">
                                                                {Resources["previous"][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th colSpan="1">
                                                            <div className="headCell">
                                                                {Resources["current"][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th colSpan="1">
                                                            <div className="headCell">
                                                                {Resources["total"][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th colSpan="3"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>{interimTable}</tbody>
                                            </table>
                                            {approvedSummaries}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : null}

                            {this.state.currentStep == 2 ? (
                                <Fragment>
                                    <div className="subiTabsContent feilds__top">
                                        <header>
                                            <h2 className="zero">
                                                {Resources["deductions"][currentLanguage]}
                                            </h2>
                                        </header>
                                        <div className="document-fields">
                                            <Formik initialValues={{ ...this.state.documentDeduction }}
                                                validationSchema={validationDeductionSchema}
                                                enableReinitialize={true}
                                                onSubmit={values => { this.addDeduction(); }}>
                                                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                    <Form id="deductionForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                        <div className="proForm datepickerContainer">
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">
                                                                    {Resources.description[currentLanguage]}
                                                                </label>
                                                                <div className="ui input inputDev">
                                                                    <input type="text" className="form-control" id="title" name="title"
                                                                        value={this.state.documentDeduction.title}
                                                                        placeholder={Resources.description[currentLanguage]}
                                                                        onBlur={e => { handleChange(e); handleBlur(e); }}
                                                                        onChange={e => this.handleChangeItem(e, "title")} />
                                                                    {touched.title ? (<em className="pError"> {errors.title} </em>) : null}
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">
                                                                    {Resources.deductions[currentLanguage]}
                                                                </label>
                                                                <div className={"ui input inputDev" + (errors.deductionValue && touched.deductionValue ? " has-error" : "ui input inputDev")}>
                                                                    <input type="text" className="form-control" id="deductionValue" name="deductionValue"
                                                                        value={this.state.documentDeduction.deductionValue}
                                                                        placeholder={Resources.deductions[currentLanguage]}
                                                                        onBlur={e => { handleChange(e); handleBlur(e); }}
                                                                        onChange={e => this.handleChangeItem(e, "deductionValue")} />
                                                                    {touched.deductionValue ? (<em className="pError"> {errors.deductionValue} </em>) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="slider-Btns">
                                                            {this.state.isLoading === false ?
                                                                (this.state.document.editable === true ? <button className="primaryBtn-1 btn meduimBtn">{Resources["save"][currentLanguage]}</button>
                                                                    : (this.state.addDeducation ? <button className="primaryBtn-1 btn meduimBtn">{Resources["save"][currentLanguage]}</button> : null)
                                                                )
                                                                :
                                                                <button
                                                                    className="primaryBtn-1 btn  disabled"
                                                                    disabled="disabled">
                                                                    <div className="spinner">
                                                                        <div className="bounce1" />
                                                                        <div className="bounce2" />
                                                                        <div className="bounce3" />
                                                                    </div>
                                                                </button>
                                                            }
                                                            {btnExportDeducation}
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                        <div className="doc-pre-cycle">
                                            <ReactTable
                                                data={this.state.deductionObservableArray}
                                                columns={columns}
                                                defaultPageSize={5}
                                                noDataText={Resources["noData"][currentLanguage]}
                                                className="-striped -highlight"
                                            />
                                            <div className="slider-Btns">
                                                <button
                                                    className="primaryBtn-1 btn meduimBtn"
                                                    onClick={e => this.changeCurrentStep(4)}>
                                                    {Resources["next"][currentLanguage]}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            ) : null}

                        </div>
                        <Steps steps_defination={steps_defination}
                            exist_link="/requestPayments/"
                            docId={this.state.docId}
                            changeCurrentStep={stepNo => this.changeCurrentStep(stepNo)}
                            stepNo={this.state.currentStep}
                            changeStatus={docId === 0 ? false : true} />

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
                                        documentName="paymentRequisitions"
                                    />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="largePopup largeModal " style={{ display: this.state.showBoqModal ? "block" : "none" }}>
                    <SkyLight hideOnOverlayClicked ref={ref => (this.boqTypeModal = ref)} title={Resources.boqType[currentLanguage]}>
                        {BoqTypeContent}
                    </SkyLight>
                </div>
                {/* Edit Comment of Grid */}
                <div className="largePopup largeModal " style={{ display: this.state.showCommentModal ? "block" : "none" }}>
                    <SkyLight hideOnOverlayClicked ref={ref => (this.commentModal = ref)} title={Resources.comments[currentLanguage]}>
                        <div className="proForm">
                            <div className="dropWrapper">
                                <div className="letterFullWidth">
                                    <label className="control-label">
                                        {Resources.comment[currentLanguage]}
                                    </label>
                                    <div className="inputDev ui input" style={{ width: '100%' }}>
                                        <TextEditor value={this.state.comment} onChange={this.onChangeMessage.bind(this)} />
                                    </div>
                                </div>
                                <div className="fullWidthWrapper">
                                    <button className="primaryBtn-1 btn " onClick={e => this.addCommentClick(e)}>
                                        {Resources.save[currentLanguage]}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SkyLight>
                </div>

                <div className="largePopup largeModal " style={{ display: this.state.showCostCodingTree ? "block" : "none" }}>
                    <SkyLight hideOnOverlayClicked ref={ref => (this.costCodingTree = ref)} title={Resources.comments[currentLanguage]}>
                        <div className="dropWrapper proForm">
                            <div className="fullWidthWrapper linebylineInput">
                                <label className="control-label">
                                    {Resources.costCodingTree[currentLanguage]}
                                </label>
                                <div className="shareLinks">
                                    <Dropdown data={this.state.fillDropDownTress} selectedValue={this.state.selectedDropDownTrees}
                                        handleChange={event => this.handleDropTrees(event)} name="costCodingTree" index="costCodingTree" />
                                    <div
                                        style={{ marginLeft: "8px" }}
                                        onClick={e => this.addCostTree()}>
                                        <span className="collapseIcon">
                                            <span className="plusSpan greenSpan">
                                                +
                                            </span>
                                            <span>
                                                {Resources.add[currentLanguage]}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="fullWidthWrapper">
                            <ReactTable data={this.state.trees} columns={columnsTrees} defaultPageSize={5} noDataText={Resources["noData"][currentLanguage]} className="-striped -highlight" />
                        </div>
                        {this.state.isLoading === false ? (
                            <div className="fullWidthWrapper">
                                <button
                                    className="primaryBtn-1 btn "
                                    type="button"
                                    onClick={this.AddedItems}>
                                    {Resources.save[currentLanguage]}
                                </button>
                            </div>
                        ) : (
                                <div className="fullWidthWrapper">
                                    <button className="primaryBtn-1 btn  disabled" disabled="disabled">
                                        <div className="spinner">
                                            <div className="bounce1" />
                                            <div className="bounce2" />
                                            <div className="bounce3" />
                                        </div>
                                    </button>
                                </div>
                            )}
                    </SkyLight>
                </div>

                {/* Edit Qty Value */}
                <div className="largePopup largeModal " style={{ display: this.state.viewPopUpRows ? "block" : "none" }}>
                    <SkyLight hideOnOverlayClicked ref={ref => (this.addCommentModal = ref)}>
                        <Formik
                            initialValues={{ ...this.state.currentObject }}
                            validationSchema={validationItemsSchema}
                            enableReinitialize={true}
                            onSubmit={values => {
                                this.editPaymentRequistionItems();
                            }}>
                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                <Form id="RequestPaymentItemEditForm" className="customProform proForm" noValidate="novalidate" onSubmit={handleSubmit}>
                                    <div className="dropWrapper">
                                        {
                                            Config.IsAllow(3674) ?
                                                <Fragment>
                                                    <div className="fillter-item-c fullInputWidth">
                                                        <label className="control-label">
                                                            {Resources.percentComplete[currentLanguage]}
                                                        </label>
                                                        <div className={"inputDev ui input" + (errors.percentComplete && touched.percentComplete ? " has-error" : !errors.percentComplete && touched.percentComplete ? " has-success" : " ")}>
                                                            <input name="percentComplete" className="form-control fsadfsadsa" id="percentComplete"
                                                                placeholder={Resources.percentComplete[currentLanguage]}
                                                                autoComplete="off"
                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                defaultValue={this.state.currentObject.percentComplete}
                                                                onChange={e => this.handleChangeForEdit(e, "percentComplete")}
                                                            />
                                                            {touched.percentComplete ? (<em className="pError"> {errors.percentComplete} </em>) : null}
                                                        </div>
                                                    </div>
                                                    <div className="fillter-item-c fullInputWidth">
                                                        <label className="control-label">
                                                            {Resources.quantityComplete[currentLanguage]}
                                                        </label>
                                                        <div className={"inputDev ui input" + (errors.quantityComplete && touched.quantityComplete ? " has-error" : !errors.quantityComplete && touched.quantityComplete ? " has-success" : " ")}>
                                                            <input name="quantityComplete" className="form-control fsadfsadsa" id="quantityComplete"
                                                                placeholder={Resources.quantityComplete[currentLanguage]}
                                                                autoComplete="off"
                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                defaultValue={this.state.currentObject.quantityComplete}
                                                                onChange={e => this.handleChangeForEdit(e, "quantityComplete")}
                                                            />
                                                            {touched.quantityComplete ? (<em className="pError">{errors.quantityComplete}</em>) : null}
                                                        </div>
                                                    </div>

                                                    <div className="fillter-item-c fullInputWidth">
                                                        <label className="control-label">
                                                            {Resources.paymentPercent[currentLanguage]}
                                                        </label>
                                                        <div className={"inputDev ui input" + (errors.paymentPercent && touched.paymentPercent ? " has-error" : !errors.paymentPercent && touched.paymentPercent ? " has-success" : " ")}>
                                                            <input name="paymentPercent" className="form-control fsadfsadsa" id="paymentPercent"
                                                                placeholder={Resources.paymentPercent[currentLanguage]}
                                                                autoComplete="off"
                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                defaultValue={this.state.currentObject.paymentPercent}
                                                                onChange={e => { this.handleChangeForEdit(e, "paymentPercent"); }}
                                                            />
                                                            {touched.paymentPercent ? (<em className="pError"> {errors.paymentPercent} </em>) : null}
                                                        </div>
                                                    </div>

                                                </Fragment> : null}

                                        {Config.IsAllow(3673) ?
                                            <Fragment>
                                                <div className="fillter-item-c fullInputWidth">
                                                    <label className="control-label">
                                                        {Resources.sitePercentComplete[currentLanguage]}
                                                    </label>
                                                    <div className={"inputDev ui input" + (errors.sitePercentComplete && touched.sitePercentComplete ? " has-error" : !errors.sitePercentComplete && touched.sitePercentComplete ? " has-success" : " ")}>
                                                        <input
                                                            name="sitePercentComplete"
                                                            className="form-control fsadfsadsa"
                                                            id="sitePercentComplete"
                                                            placeholder={Resources.percentComplete[currentLanguage]}
                                                            autoComplete="off"
                                                            onBlur={e => { handleBlur(e); handleChange(e); }}
                                                            defaultValue={this.state.currentObject.sitePercentComplete}
                                                            onChange={e => { this.handleChangeForEdit(e, "sitePercentComplete"); }} />
                                                        {touched.sitePercentComplete ? (<em className="pError"> {errors.sitePercentComplete} </em>) : null}
                                                    </div>
                                                </div>
                                                <div className="fillter-item-c fullInputWidth">
                                                    <label className="control-label">
                                                        {Resources.siteQuantityComplete[currentLanguage]}
                                                    </label>
                                                    <div className={"inputDev ui input" + (errors.siteQuantityComplete && touched.siteQuantityComplete ? " has-error" : !errors.siteQuantityComplete && touched.siteQuantityComplete ? " has-success" : " ")}>
                                                        <input
                                                            name="siteQuantityComplete"
                                                            className="form-control fsadfsadsa"
                                                            id="siteQuantityComplete"
                                                            placeholder={Resources.siteQuantityComplete[currentLanguage]}
                                                            autoComplete="off"
                                                            onBlur={e => { handleBlur(e); handleChange(e); }}
                                                            defaultValue={this.state.currentObject.siteQuantityComplete}
                                                            onChange={e => { this.handleChangeForEdit(e, "siteQuantityComplete"); }}
                                                        />
                                                        {touched.siteQuantityComplete ? (<em className="pError">{errors.siteQuantityComplete}</em>) : null}
                                                    </div>
                                                </div>

                                                <div className="fillter-item-c fullInputWidth">
                                                    <label className="control-label">
                                                        {Resources.contractPaymentPercent[currentLanguage]}
                                                    </label>
                                                    <div className={"inputDev ui input" + (errors.sitePaymentPercent && touched.sitePaymentPercent ? " has-error" : !errors.sitePaymentPercent && touched.sitePaymentPercent ? " has-success" : " ")}>
                                                        <input name="sitePaymentPercent" className="form-control fsadfsadsa" id="sitePaymentPercent"
                                                            placeholder={Resources.contractPaymentPercent[currentLanguage]}
                                                            autoComplete="off"
                                                            onBlur={e => { handleBlur(e); handleChange(e); }}
                                                            defaultValue={this.state.currentObject.sitePaymentPercent}
                                                            onChange={e => { this.handleChangeForEdit(e, "sitePaymentPercent"); }}
                                                        />
                                                        {touched.sitePaymentPercent ? (<em className="pError"> {errors.sitePaymentPercent} </em>) : null}
                                                    </div>
                                                </div></Fragment> : null
                                        }

                                        <div className="fillter-item-c fullInputWidth">
                                            <label className="control-label">
                                                {Resources.comments[currentLanguage]}
                                            </label>
                                            <div className={"inputDev ui input"}>
                                                <input name="comments" className="form-control fsadfsadsa" id="comments"
                                                    placeholder={Resources.comments[currentLanguage]}
                                                    autoComplete="off"
                                                    onBlur={e => { handleBlur(e); handleChange(e); }}
                                                    defaultValue={this.state.currentObject.lastComment}
                                                    onChange={e => { this.handleChangeForEdit(e, "lastComment"); }}
                                                />
                                            </div>
                                        </div>

                                        <div className="fullWidthWrapper">
                                            {this.state.isLoading === true ? (
                                                <button
                                                    className="primaryBtn-1 btn  disabled"
                                                    disabled="disabled">
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button>
                                            ) : (
                                                    <button className="primaryBtn-1 btn " type="submit">
                                                        {Resources.save[currentLanguage]}
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </SkyLight>
                </div>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources["smartDeleteMessage"][currentLanguage].content}
                        buttonName="delete"
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        clickHandlerContinue={this.clickHandlerContinueMain.bind(this)} />
                ) : null}
                <div className="largePopup largeModal " style={{ display: this.state.showViewHistoryModal ? "block" : "none" }}>
                    <SkyLight hideOnOverlayClicked ref={ref => (this.ViewHistoryModal = ref)} title={Resources.viewHistory[currentLanguage]}>
                        {viewHistory}
                    </SkyLight>
                </div>

                <SkyLight hideOnOverlayClicked ref={ref => (this.editPayment = ref)} title={Resources.editPayment[currentLanguage]}>
                    <div className="doc-pre-cycle">
                        <div className="inpuBtn proForm">
                            <div className="linebylineInput valid-input ">
                                <label className="control-label">
                                    {Resources.advancedPayment[currentLanguage]}
                                </label>
                                <div className="ui input inputDev">
                                    <input type="text" className="form-control" name="advancedPayment"
                                        value={this.state.advancedPayment || ''}
                                        placeholder={Resources.advancedPayment[currentLanguage]}
                                        onChange={event => this.setState({ advancedPayment: event.target.value })}
                                    />
                                </div>
                            </div>
                            {this.state.isLoading === false ? (
                                <button className="primaryBtn-1 btn meduimBtn" onClick={this.editAdvancedPayment.bind(this)}>
                                    {Resources["save"][currentLanguage]}
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
                </SkyLight>
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
        items: state.communication.items,
        showModal: state.communication.showModal,
        //docTypeId: state.communication.docTypeId,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(requestPaymentsAddEdit));

//#region importComponent
import CryptoJS from "crypto-js";
import { Form, Formik } from "formik";
import moment from "moment";
<<<<<<< HEAD
import React, { Component, Fragment, useContext } from "react";
=======
import React, { Component, Fragment } from "react";
>>>>>>> f6dd6eddb5eb6a4e8923973fb83eb3b2eafcce1f
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import SkyLight from "react-skylight";
import ReactTable from "react-table";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import * as Yup from "yup";
import Api from "../../api";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import Export from '../../Componants/OptionsPanels/Export';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument';
import TextEditor from '../../Componants/OptionsPanels/TextEditor';
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment';
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments';
import ViewWorkFlow from '../../Componants/OptionsPanels/ViewWorkFlow';
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal';
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import Steps from '../../Componants/publicComponants/Steps';
import GridCustom from '../../Componants/Templates/Grid/CustomGrid';
import dataservice from '../../Dataservice';
import Resources from '../../resources.json';
import Config from '../../Services/Config.js';
import * as communicationActions from '../../store/actions/communication';
import { loadavg } from "os";

//import ConnectionContext from '../../Componants/Layouts/Context'; 
//import "react-table/react-table.css";
//#endregion importComponent

let currentLanguage =
    localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

//#region validation

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(
        Resources['subjectRequired'][currentLanguage],
    ),
    contractId: Yup.string()
        .required(Resources['selectContract'][currentLanguage])
        .nullable(true),
    vat: Yup.string().matches(
        /(^[0-9]+$)/,
        Resources['onlyNumbers'][currentLanguage],
    ),
    tax: Yup.string().matches(
        /(^[0-9]+$)/,
        Resources['onlyNumbers'][currentLanguage],
    ),
    insurance: Yup.string().matches(
        /(^[0-9]+$)/,
        Resources['onlyNumbers'][currentLanguage],
    ),
    advancePaymentPercent: Yup.string().matches(
        /(^[0-9]+$)/,
        Resources['onlyNumbers'][currentLanguage],
    ),
    retainagePercent: Yup.string().matches(
        /(^[0-9]+$)/,
        Resources['onlyNumbers'][currentLanguage],
    ),
});

const validationDeductionSchema = Yup.object().shape({
    title: Yup.string().required(Resources['description'][currentLanguage]),
    deductionValue: Yup.string().matches(
        /(^[0-9]+$)/,
        Resources['onlyNumbers'][currentLanguage],
    ),
});

const validationItemsSchema = Yup.object().shape({
    percentComplete: Yup.number()
        .typeError(Resources['onlyNumbers'][currentLanguage])
        .required(Resources['percentComplete'][currentLanguage]),
    quantityComplete: Yup.number()
        .typeError(Resources['onlyNumbers'][currentLanguage])
        .required(Resources['quantityComplete'][currentLanguage]),
    paymentPercent: Yup.number()
        .typeError(Resources['onlyNumbers'][currentLanguage])
        .required(Resources['paymentPercent'][currentLanguage]),
});

const BoqTypeSchema = Yup.object().shape({
    boqType: Yup.string().required(Resources['boqSubType'][currentLanguage]),
    boqChild: Yup.string().required(Resources['boqSubType'][currentLanguage]),
    boqSubType: Yup.string().required(Resources['boqSubType'][currentLanguage]),
});

//#endregion validation

let publicFonts = currentLanguage === 'ar' ? 'cairo-b' : 'Muli, sans-serif';

//#region  Styles

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
            backgroundColor: ' #fafbfc',
        },
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled
                ? '#fff'
                : isSelected
                    ? '#e9ecf0'
                    : isFocused
                        ? '#f2f6fa'
                        : '#fff',
            color: '#3e4352',
            fontSize: '14px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            textTransform: 'capitalize',
            fontFamily: publicFonts,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            fontWeight: '700',
            textOverflow: 'ellipsis',
            zIndex: '155',
        };
    },
    input: styles => ({ ...styles, maxWidth: '100%' }),
    placeholder: styles => ({
        ...styles,
        color: '#5e6475',
        fontSize: '14px',
        width: '100%',
        fontFamily: publicFonts,
        fontWeight: '700',
    }),
    singleValue: styles => ({
        ...styles,
        color: '#5e6475',
        fontSize: '14px',
        width: '100%',
        fontFamily: publicFonts,
        fontWeight: '700',
        textAlign: 'center',
    }),
    indicatorSeparator: styles => ({ ...styles, backgroundColor: '#dadee6' }),
    menu: styles => ({
        ...styles,
        zIndex: 155,
        boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)',
        border: 'solid 1px #ccd2db',
    }),
};

//#endregion

//#region globalVariable
let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
const find = require('lodash/find');
let itemsColumns = [];
let VOItemsColumns = [];
var steps_defination = [];
//#endregion globalVariable

//#region  columnOfInterimPayment
const columnOfInterimPayment = [
    {
        title: Resources['workDescription'][currentLanguage],
        field: 'description',
    },
    {
        title: Resources['previousConsultatnt'][currentLanguage],
        field: 'prevoiuse',
    },
    {
        title: Resources['currentConsultatnt'][currentLanguage],
        field: 'currentValue',
    },
    {
        title: Resources['totalConsultatnt'][currentLanguage],
        field: 'total',
    },
    {
        title: Resources['previousContractor'][currentLanguage],
        field: 'contractorPrevoiuse',
    },
    {
        title: Resources['currentContractor'][currentLanguage],
        field: 'contractorCurrentValue',
    },
    {
        title: Resources['totalContractor'][currentLanguage],
        field: 'contractorTotal',
    },
    {
        title: Resources['comments'][currentLanguage],
        field: 'comment',
    },
];
//#endregion columnOfInterimPayment

class requestPaymentsAddEdit extends Component {
    constructor(props) {
        super(props);

        const query = new URLSearchParams(this.props.location.search);

        let index = 0;

        //#region getDataFromURL

        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(
                        CryptoJS.enc.Base64.parse(param[1]).toString(
                            CryptoJS.enc.Utf8,
                        ),
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

        let userType = Config.getPayload();
        //#endregion getDataFromURL

        //#region variableofState

        this.state = {
            noItems: 0,
            gridLoader: true,
            isLoadingItems: false,
            isItemUpdate: false,
            isFilter: false,
            advancedPayment: null,
            currentStep: 0,
            trees: [],
            showCostCodingTree: false,
            showDeleteModal: false,
            userType: userType.uty,
            addDeducation: false,
            treesLoader: false,
            isMultipleItems: false,
            isEditingPercentage: 'true',
            editItemsLoading: false,
            fillDropDown: [
                { label: 'Add Missing Amendments', value: '1' },
                { label: 'ReCalculator Payment', value: '2' },
                { label: 'Update Items From VO', value: '3' },
                { label: 'Add Missing Items', value: '4' },
                { label: 'Edit Advanced Payment Amount', value: '5' },
                { label: 'Calculate Interim Invoice', value: '6' },
                { label: 'Add Deductions', value: '7' },
                { label: 'Update Advance Payment Amount', value: '8' },
                { label: 'Update VO Prices', value: '9' },
                { label: 'Change Editable Status', value: '10' },
            ],
            selectedDropDownTrees: {
                label: Resources.codingTree[currentLanguage],
                value: '0',
            },
            selectedPercentageStatus: {
                label: Resources.percentageStatus[currentLanguage],
                value: '0',
            },
            fillDropDownTress: [],
            fillDropDownExport: [
                { label: 'Export', value: '1' },
                { label: 'ExportAsVo', value: '2' },
            ],
            selectedDropDown: [{ label: 'Admin Actions', value: '0' }],
            selectedDropDownExport: [{ label: 'Export File', value: '0' }],
            selectedBoqTypeEdit: {
                label: Resources.boqType[currentLanguage],
                value: '0',
            },
            selectedBoqTypeChildEdit: {
                label: Resources.boqTypeChild[currentLanguage],
                value: '0',
            },
            selectedBoqSubTypeEdit: {
                label: Resources.boqSubType[currentLanguage],
                value: '0',
            },
            boqTypes: [],
            BoqTypeChilds: [],
            BoqSubTypes: [],
            boqStractureObj: {},
            documentDeduction: {},
            interimInvoicedTable: [],
            approvedInvoicesParent: [],
            approvedInvoicesChilds: [],
            ColumnsHideShow: [],
            columns: [],
            groups: [],
            multiplePayReqItems: [],
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
            pageSize: 1500,
            docId: docId,
            docTypeId: 71,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document
                ? Object.assign({}, this.props.document)
                : {},
            voItem: {},
            permission: [
                { name: 'sendByEmail', code: 54 },
                { name: 'sendByInbox', code: 53 },
                { name: 'sendTask', code: 1 },
                { name: 'distributionList', code: 956 },
                { name: 'createTransmittal', code: 3042 },
                { name: 'sendToWorkFlow', code: 707 },
                { name: 'viewAttachments', code: 3317 },
                { name: 'deleteAttachments', code: 840 },
            ],
            selectContract: {
                label: Resources.selectContract[currentLanguage],
                value: '0',
            },
            contractsPos: [],
            paymentsItems: [],
            CurrentStep: 0,
            editRows: [],
            comment: '',
            viewPopUpRows: false,
            viewContractorPopUpRows: false,
            currentObject: {},
            currentId: 0,
            exportFile: '',
            isView: false,
            viewUpdatePayment: false,
            viewUpdateCalc: false,
            actualPayments: 0,
            percentageStatus: [
                { label: 'percentage', value: 1 },
                { label: 'Actual Value', value: 2 },
            ],
            id: 1,
            itemId: 0,
            quantityComplete: 0,
            currentDocument: '',
            columnsApprovedInvoices: [],
            CalculateRow: true,
            updateVoPricesModal: false,
            deductionTypesList: [],
            updateVoListData: [],
            selected: {},
            selectedDeductionType: {
                label: Resources.selectDedutionType[currentLanguage],
                value: '0',
            },
            interimInvoicesLoading: false,
            approvedSummaryLoading: false
        };

        //#endregion variableofState

        //#region permisssion
        if (
            !Config.IsAllow(184) &&
            !Config.IsAllow(187) &&
            !Config.IsAllow(185)
        ) {
            toast.warn(Resources['missingPermissions'][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
        //#endregion permisssion

        //#region steps
        steps_defination = [
            {
                name: 'paymentRequisitions',
                callBackFn: null,
            },
            {
                name: 'items',
                callBackFn: null,
            },
            {
                name: 'deductions',
                callBackFn: this.fillDeductions(),
            },
            {
                name: 'summaries',
                callBackFn: () => this.fillSummariesTab(),
            },
        ];
        //#endregion steps

        this.actions = [
            {
                title: 'Edit',
                handleClick: ids => {
                    this.setState({
                        isMultipleItems: true,
                    });
                    this.editItemsRows(ids);
                },
                classes: '',
            },
        ];
        //#region rowActions
        this.rowActions = [
            ...(userType.uty === 'company'
                ? [
                    {
                        title: Resources['delete'][currentLanguage],
                        handleClick: value => {
                            this.viewConfirmDelete(value.id, 'requestItems');
                        },
                    },
                ]
                : []),
            {
                title: Resources['viewHistory'][currentLanguage],
                handleClick: value => {
                    this.setState({
                        isLoading: true,
                    });
                    dataservice
                        .GetDataGrid(
                            'GetContractsRequestPaymentsItemsHistory?id=' +
                            value.id,
                        )
                        .then(result => {
                            this.setState({
                                paymentRequestItemsHistory: result,
                                isLoading: false,
                                showViewHistoryModal: true,
                            });

                            this.ViewHistoryModal.show();
                        });
                },
            },
            {
                title: 'Boq',
                handleClick: value => {
                    if (Config.IsAllow(1001104)) {
                        let boqStractureObj = {
                            ...this.state.boqStractureObj,
                        };
                        let boqTypes = [...this.state.boqTypes];
                        boqStractureObj.id = value.id;
                        boqStractureObj.requestId = this.state.docId;
                        boqStractureObj.contractId = this.state.document.contractId;

                        if (boqTypes.length > 0) {
                            this.setState({
                                boqStractureObj: boqStractureObj,
                                showBoqModal: true,
                            });
                            this.boqTypeModal.show();
                        } else {
                            dataservice
                                .GetDataList(
                                    'GetAllBoqParentNull?projectId=' +
                                    projectId,
                                    'title',
                                    'id',
                                )
                                .then(data => {
                                    this.setState({
                                        boqTypes: data,
                                        boqStractureObj: boqStractureObj,
                                        showBoqModal: true,
                                    });
                                    this.boqTypeModal.show();
                                });
                        }
                    } else {
                        toast.warn(
                            Resources['missingPermissions'][currentLanguage],
                        );
                    }
                },
            },
        ];

        if (docId > 0) {
            this.rowActions.push({
                title: 'Add Cost Coding Tree',
                handleClick: value => {
                    dataservice
                        .GetDataGrid(
                            'GetReqPayCostCodingByRequestItemId?requestId=' +
                            this.state.docId +
                            '&reqItemId=' +
                            value.id,
                        )
                        .then(result => {
                            this.setState({
                                itemId: value.id,
                                quantityComplete: value.quantityComplete,
                                trees: result != null ? result : [],
                                showCostCodingTree: true,
                            });
                            this.costCodingTree.show();
                        });
                },
            });
        }
        //#endregion rowActions
    }
    showEditModalByRows(obj, ids) {
        let original_document = { ...this.state.currentObject };

        let updated_document = {};

        updated_document.percentComplete = 0;
        updated_document.quantityComplete = 0;
        updated_document.paymentPercent = 0;
        updated_document.lastComment = '';
        updated_document.id = 0;
        updated_document.revisedQuantity = 0;
        updated_document.sitePaymentPercent = 0;
        updated_document.sitePercentComplete = 0;
        updated_document.siteQuantityComplete = 0;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            viewPopUpRows: true,
            currentObject: updated_document,
            multiplePayReqItems: ids,
            isEditingPercentage: 'true',
        });
        this.reqPayModal.show();
    }

    editItemsRows(ids) {
        let userType = Config.getPayload();

        let obj = this.state.document;
        if (
            this.props.hasWorkflow == false ||
            this.state.isApproveMode == true
        ) {
            if (this.props.changeStatus) {
                if (obj.status === true && obj.editable === true) {
                    this.showEditModalByRows(obj, ids);
                } else {
                    toast.warn(Resources['adminItemEditable'][currentLanguage]);
                }
            } else {
                if (this.state.document.status === true) {
                    this.showEditModalByRows(obj, ids);
                } else {
                    toast.warn(Resources['adminItemEditable'][currentLanguage]);
                }
            }
        } else if (Config.getUserTypeIsAdmin() === true) {
            this.showEditModalByRows(obj, ids);
        } else {
            toast.warn(Resources['adminItemEditable'][currentLanguage]);
        }
    }

    buildColumns(changeStatus) {
        itemsColumns = [
            {
                title: '',
                type: 'check-box',
                fixed: true,
                field: 'id',
                hidden: false,
            },
            {
                field: 'arrange',
                title: Resources['no'][currentLanguage],
                width: 4,
                groupable: true,
                fixed: true,
                sortable: true,
                hidden: false,
                type: 'number',
            },
            {
                field: 'itemCode',
                title: Resources['itemCode'][currentLanguage],
                width: 8,
                groupable: true,
                fixed: true,
                sortable: true,
                hidden: false,
                type: 'text',
            },
            {
                field: 'details',
                title: Resources['description'][currentLanguage],
                width: 15,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'text',
                //showTip: true
            },
            {
                field: 'boqType',
                title: Resources['boqType'][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'text',
            },
            {
                field: 'secondLevel',
                title: Resources['boqTypeChild'][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'text',
            },
            {
                field: 'boqSubType',
                title: Resources['boqSubType'][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                hidden: true,
                type: 'text',
            },
            {
                field: 'quantity',
                title: Resources['boqQuanty'][currentLanguage],
                width: 6,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'text',
            },
            {
                field: 'revisedQuantity',
                title: Resources['approvedQuantity'][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'text',
            },
            {
                field: 'actualPercentage',
                title: Resources['actualPercentage'][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: true,
                type: 'number',
            },
            {
                field: 'unitPrice',
                title: Resources['unitPrice'][currentLanguage],
                width: 6,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'number',
            },
            {
                field: 'unit',
                title: Resources['unit'][currentLanguage],
                width: 6,
                groupable: true,
                sortable: true,
                hidden: true,
                type: 'text',
            },
            {
                field: 'prevoiuseQnty',
                title: Resources['previousQuantity'][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'number',
            },
            {
                field: 'oldPaymentPercent',
                title: Resources['previousPaymentPercent'][currentLanguage],
                width: 13,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'number',
            },
            {
                field: 'sitePercentComplete',
                title: Resources['sitePercentComplete'][currentLanguage],
                width: 13,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'number',
            },
            {
                field: 'siteQuantityComplete',
                title: Resources['siteQuantityComplete'][currentLanguage],
                width: 13,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'number',
            },
            {
                field: 'sitePaymentPercent',
                title: Resources['contractPaymentPercent'][currentLanguage],
                width: 13,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'number',
            },
            ...(this.props.changeStatus
                ? [
                    {
                        field: 'percentComplete',
                        title: Resources['percentComplete'][currentLanguage],
                        width: 12,
                        groupable: true,
                        sortable: true,
                        hidden: false,
                        type: 'number',
                    },
                    {
                        field: 'quantityComplete',
                        title: Resources['quantityComplete'][currentLanguage],
                        width: 9,
                        groupable: true,
                        sortable: true,
                        hidden: false,
                        type: 'number',
                    },
                    {
                        field: 'paymentPercent',
                        title: Resources['paymentPercent'][currentLanguage],
                        width: 9,
                        groupable: true,
                        sortable: true,
                        hidden: false,
                        type: 'number',
                    },
                ]
                : []),
            {
                field: 'wasAdded',
                title: Resources['status'][currentLanguage],
                width: 6,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'text',
            },
            {
                field: 'totalExcutedPayment',
                title: Resources['totalAmount'][currentLanguage],
                width: 9,
                groupable: true,
                sortable: true,
                hidden: false,
                type: 'number',
            },
            {
                field: 'lastComment',
                title: Resources['comment'][currentLanguage],
                width: 10,
                groupable: true,
                sortable: true,
                hidden: true,
                type: 'text',
            },
            {
                field: 'itemStatus',
                title: Resources['itemStatus'][currentLanguage],
                width: 7,
                groupable: true,
                sortable: true,
                hidden: true,
                type: 'text',
            },
        ];

        VOItemsColumns = [
            {
                key: 'id',
                name: 'id',
                width: 50,
            },
            {
                key: 'voItemId',
                name: 'voItemId',
                width: 100,
            },
            {
                key: 'itemId',
                name: Resources['itemId'][currentLanguage],
                width: 120,
            },
            {
                key: 'itemCode',
                name: Resources['itemCode'][currentLanguage],
                width: 100,
            },
            {
                key: 'resourceCode',
                name: Resources['resourceCode'][currentLanguage],
                width: 100,
            },
            {
                key: 'revisedQuantity',
                name: Resources['approvedQuantity'][currentLanguage],
                width: 100,
            },
            {
                key: 'unitPrice',
                name: Resources['unitPrice'][currentLanguage],
                width: 100,
            },
            {
                key: 'unitPrice',
                name: 'newUnitPrice',
                width: 100,
            },
            {
                key: 'quantity',
                name: 'newBoqQuantity',
                width: 100,
            },
            {
                key: 'details',
                name: Resources['description'][currentLanguage],
                width: 100,
            },
            {
                key: 'boqType',
                name: Resources['boqType'][currentLanguage],
                width: 120,
            },
            {
                key: 'secondLevel',
                name: Resources['boqTypeChild'][currentLanguage],
                width: 120,
            },
            {
                key: 'boqSubType',
                name: Resources['boqSubType'][currentLanguage],
                width: 120,
            },
        ];

        var selectedCols =
            JSON.parse(localStorage.getItem('ReqPaymentsItems')) || [];

        var currentGP = [
            { field: 'wasAdded', title: 'status', type: 'text' },
            { field: 'boqType', title: 'boqType', type: 'text' },
            { field: 'secondLevel', title: 'boqTypeChild', type: 'text' },
        ];

        if (selectedCols.length === 0) {
            var gridLocalStor = { columnsList: [], groups: [] };
            gridLocalStor.columnsList = JSON.stringify(itemsColumns);
            gridLocalStor.groups = JSON.stringify(currentGP);
            localStorage.setItem(
                'ReqPaymentsItems',
                JSON.stringify(gridLocalStor),
            );
        } else {
            var parsingList = JSON.parse(selectedCols.columnsList);
            for (var item in parsingList) {
                for (var i in itemsColumns) {
                    if (itemsColumns[i].field === parsingList[item].field) {
                        let status = parsingList[item].hidden;
                        itemsColumns[i].hidden = status;
                        break;
                    }
                }
            }
            currentGP = JSON.parse(selectedCols.groups);
        }

        this.setState({
            ColumnsHideShow: itemsColumns,
            columns: itemsColumns,
            groups: currentGP,
        });
    }

    customCellActions(column, row) {
        if (column.key === 'BtnActions') {
            const custom = [
                {
                    icon: (
                        <span
                            style={{ cursor: 'pointer' }}
                            className="fa fa-history"
                        />
                    ),
                    callback: e => {
                        this.setState({
                            isLoading: true,
                        });
                        dataservice
                            .GetDataGrid(
                                'GetContractsRequestPaymentsItemsHistory?id=' +
                                row.id,
                            )
                            .then(result => {
                                this.setState({
                                    paymentRequestItemsHistory: result,
                                    isLoading: false,
                                    showViewHistoryModal: true,
                                });

                                this.ViewHistoryModal.show();
                            });
                    },
                },
                {
                    icon: (
                        <span
                            style={{ cursor: 'pointer' }}
                            className="fa fa-pencil"
                        />
                    ),
                    callback: () => {
                        if (Config.IsAllow(1001104)) {
                            let boqStractureObj = {
                                ...this.state.boqStractureObj,
                            };
                            let boqTypes = [...this.state.boqTypes];
                            boqStractureObj.id = row.id;
                            boqStractureObj.requestId = this.state.docId;
                            boqStractureObj.contractId = this.state.document.contractId;

                            if (boqTypes.length > 0) {
                                this.setState({
                                    boqStractureObj: boqStractureObj,
                                    showBoqModal: true,
                                });
                                this.boqTypeModal.show();
                            } else {
                                dataservice
                                    .GetDataList(
                                        'GetAllBoqParentNull?projectId=' +
                                        projectId,
                                        'title',
                                        'id',
                                    )
                                    .then(data => {
                                        this.setState({
                                            boqTypes: data,
                                            boqStractureObj: boqStractureObj,
                                            showBoqModal: true,
                                        });
                                        this.boqTypeModal.show();
                                    });
                            }
                        }
                    },
                },
            ];

            return custom;
        }
    }

    getCellActions(column, row) {
        const cellActions = {
            BtnActions: this.customCellActions(column, row),
        };
        return cellActions[column.key];
    }
    toggleRow(obj) {
        const newSelected = {};
        newSelected[obj.id] = !this.state.selected[obj.id];
        let setIndex = this.state.updateVoListData.findIndex(
            x => x.id === obj.id,
        );

        this.setState({
            selected: newSelected,
        });
    }
    componentDidMount() {
        var links = document.querySelectorAll(
            '.noTabs__document .doc-container .linebylineInput',
        );
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add('even');
            } else {
                links[i].classList.add('odd');
            }
        }

        let documentDeduction = {
            title: '',
            deductionValue: 0,
            deductionTypeId: 0,
        };
        dataservice
            .GetDataList(
                'GetaccountsDefaultListForList?listType=deductionType',
                'title',
                'id',
            )
            .then(res => {
                this.setState({
                    deductionTypesList: res,
                });
            });

        if (this.state.docId > 0) {
            this.props.actions.documentForEdit(
                'GetContractsRequestPaymentsForEdit?id=' + this.state.docId,
            );
            this.props.actions.ExportingData({ items: [] });
            dataservice
                .GetDataList(
                    'GetCostCodingTreeNewByProjectIdForList?projectId=' +
                    this.state.projectId,
                    'codeTreeTitle',
                    'id',
                )
                .then(result => {
                    this.setState({
                        fillDropDownTress: result,
                    });
                });

            this.setState({
                isLoading: true,
                documentDeduction: documentDeduction,
            });
        } else {
            let paymentRequistion = {
                subject: '',
                id: 0,
                projectId: this.state.projectId,
                arrange: '',
                docDate: moment(),
                status: true,
                useCommulative: true,
                advancedPaymentAmount: 0,
                contractId: '',
                vat: 0,
                tax: 0,
                insurance: 0,
                advancePaymentPercent: 0,
                collected: 0,
                useQuantity: false,
                percentComplete: '',
                quantityComplete: '',
                paymentPercent: '',
                nextId: 0,
                previousId: 0,
            };

            this.setState(
                {
                    document: paymentRequistion,
                    documentDeduction: documentDeduction,
                },
                function () {
                    this.GetNExtArrange();
                },
            );
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
            this.buildColumns(false);
        }
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (
            nextProps.document.id !== state.document.id &&
            nextProps.changeStatus === true
        ) {
            let serverChangeOrder = { ...nextProps.document };
            serverChangeOrder.docDate = moment(
                serverChangeOrder.docDate,
            ).format('YYYY-MM-DD');
            serverChangeOrder.advancePaymentPercent =
                serverChangeOrder.advancePaymentPercent != null
                    ? serverChangeOrder.advancePaymentPercent
                    : 0;
            serverChangeOrder.tax =
                serverChangeOrder.tax != null ? serverChangeOrder.tax : 0;
            serverChangeOrder.vat =
                serverChangeOrder.vat != null ? serverChangeOrder.vat : 0;
            serverChangeOrder.insurance =
                serverChangeOrder.insurance != null
                    ? serverChangeOrder.insurance
                    : 0;
            serverChangeOrder.actualPayment =
                serverChangeOrder.actualPayment != null
                    ? serverChangeOrder.actualPayment
                    : 0;
            serverChangeOrder.advancedPaymentAmount =
                serverChangeOrder.advancedPaymentAmount != null
                    ? serverChangeOrder.advancedPaymentAmount
                    : 0;
            serverChangeOrder.retainagePercent =
                serverChangeOrder.retainagePercent != null
                    ? serverChangeOrder.retainagePercent
                    : 0;
            serverChangeOrder.remainingPayment =
                serverChangeOrder.remainingPayment != null
                    ? serverChangeOrder.remainingPayment
                    : 0;
            serverChangeOrder.percentComplete = '';
            serverChangeOrder.quantityComplete = '';
            serverChangeOrder.paymentPercent = '';
            serverChangeOrder.lastComment = '';

            return {
                document: { ...serverChangeOrder },
                hasWorkflow: nextProps.hasWorkflow,
                noItems: serverChangeOrder.noItems,
            };
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.document.id !== this.props.document.id &&
            this.props.changeStatus === true
        ) {
            this.fillDropDowns(this.props.document.id > 0 ? true : false);
            this.checkDocumentIsView();
            this.fillSummariesTab();

            this.buildColumns(true);
        }

        if (
            this.props.hasWorkflow !== prevProps.hasWorkflow ||
            this.props.changeStatus !== prevProps.changeStatus
        ) {
            this.checkDocumentIsView();
        }
    }
    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (Config.getUserTypeIsAdmin() === true) {
                    this.setState({ isViewMode: false });
                } else {
                    if (!Config.IsAllow(187)) {
                        this.setState({ isViewMode: true });
                    }
                    if (
                        this.state.isApproveMode != true &&
                        Config.IsAllow(187)
                    ) {
                        if (
                            this.props.hasWorkflow == false &&
                            Config.IsAllow(187)
                        ) {
                            if (
                                this.props.document.status !== false &&
                                Config.IsAllow(187)
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
            }
        } else {
            this.setState({ isViewMode: false });
        }
    }
    GetNExtArrange() {
        let original_document = { ...this.state.document };

        let updated_document = {};

        let url =
            'GetNextArrangeMainDoc?projectId=' +
            this.state.projectId +
            '&docType=' +
            this.state.docTypeId +
            '&companyId=0&contactId=0';

        dataservice.GetNextArrangeMainDocument(url).then(res => {
            updated_document.arrange = res;

            updated_document = Object.assign(
                original_document,
                updated_document,
            );

            this.setState({
                document: updated_document,
            });
        });
    }
    fillDropDowns(isEdit) {
        if (isEdit === false) {
            dataservice
                .GetDataGrid(
                    'GetContractsListForPaymentRequistion?projectId=' +
                    this.state.projectId,
                )
                .then(result => {
                    let Data = [];
                    result.forEach(item => {
                        var obj = {};
                        obj.label = item['subject'];
                        obj.value = item['id'];
                        Data.push(obj);
                    });

                    this.setState({
                        contractsPos: [...Data],
                        contractsPool: result,
                    });
                });
        }
    }
    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0,
        });
    }
    onChangeMessage = value => {
        if (value != null) {
            let original_document = { ...this.state.document };

            let updated_document = {};

            updated_document.comment = value;

            updated_document = Object.assign(
                original_document,
                updated_document,
            );

            this.setState({
                document: updated_document,
                comment: value,
            });
        }
    };
    handleChange(e, field) {
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
        });
    }
    handleChangeMultiple(e, field) {
        this.setState({
            editItemsLoading: true,
        });
        let status = e.target.value === 'true' ? true : false;

        this.setState({
            isEditingPercentage: status,
            editItemsLoading: false,
        });
    }
    handleChangeDate(e, field) {
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
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
            [selectedValue]: event,
        });

        if (this.props.changeStatus === false) {
            this.setState({
                gridLoader: true,
            });

            let contract = find(this.state.contractsPool, function (x) {
                return x.id == event.value;
            });

            dataservice
                .GetDataGrid(
                    'GetRequestItemsOrderByContractId?contractId=' +
                    event.value +
                    '&isAdd=' +
                    !this.props.changeStatus +
                    '&requestId=' +
                    this.state.docId +
                    '&pageNumber=' +
                    this.state.pageNumber +
                    '&pageSize=' +
                    this.state.pageSize,
                )
                .then(result => {
                    this.setState({
                        paymentsItems: result,
                        gridLoader: false,
                        noItems: contract.noItems,
                    });
                });

            if (contract) {
                var objDate = new Date(),
                    month = objDate.toLocaleString('en', { month: 'long' });
                var year = objDate.getFullYear();

                updated_document.subject =
                    'Payment Requisition ' +
                    contract.subject +
                    ' (' +
                    year +
                    '/' +
                    month +
                    ') ' +
                    original_document.arrange;

                updated_document.vat = parseFloat(contract.vat);
                updated_document.tax = parseFloat(contract.tax);
                updated_document.insurance = parseFloat(contract.insurance);
                updated_document.advancePaymentPercent = parseFloat(
                    contract.advancedPayment,
                );
                updated_document.retainagePercent = parseFloat(
                    contract.retainage,
                );
                updated_document.advancedPaymentAmount =
                    contract.advancedPaymentAmount != null
                        ? parseFloat(contract.advancedPaymentAmount)
                        : 0;

                this.setState({
                    document: updated_document,
                });
            }
        }
    }
    handleChangeDropDownDeduction(event, field, selectedValue) {
        if (event == null) return;
        let original_document = { ...this.state.documentDeduction };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            documentDeduction: updated_document,
            [selectedValue]: event,
        });
    }
    editPaymentRequistion(event) {
        this.setState({
            isLoading: true,
        });

        let saveDocument = this.state.document;
        this.changeCurrentStep(1);
        saveDocument.docDate = moment(
            saveDocument.docDate,
            'YYYY-MM-DD',
        ).format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        dataservice
            .addObject('EditContractsRequestPayments', saveDocument)
            .then(result => {
                this.setState({
                    isLoading: false,
                });
                toast.success(Resources['operationSuccess'][currentLanguage]);
            })
            .catch(res => {
                this.setState({
                    isLoading: false,
                });
                toast.error(Resources['operationCanceled'][currentLanguage]);
            });
    }
    savePaymentRequistion(event) {
        this.setState({
            isLoading: true,
        });
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(
            saveDocument.docDate,
            'YYYY-MM-DD',
        ).format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        saveDocument.projectId = this.state.projectId;

        dataservice
            .addObject('AddContractsRequestPayment', saveDocument)
            .then(result => {
                if (result.id) {
                    this.setState({
                        docId: result.id,
                        isLoading: false,
                    });

                    this.changeCurrentStep(1);

                    toast.success(
                        Resources['operationSuccess'][currentLanguage],
                    );
                }
            })
            .catch(res => {
                this.setState({
                    isLoading: false,
                });
                toast.error(Resources['operationCanceled'][currentLanguage]);
            });
    }
    showBtnsSaving() {
        let btn = null;
        // if (this.state.docId === 0) {
        //     btn = (
        //         <button className="primaryBtn-1 btn meduimBtn" type="submit">
        //             {Resources.save[currentLanguage]}
        //         </button>
        //     );
        // } else if (this.state.docId > 0) {changeCurrentStep

        btn = (
            <button
                className={
                    this.state.isViewMode === true
                        ? 'primaryBtn-1 btn meduimBtn disNone'
                        : 'primaryBtn-1 btn meduimBtn'
                }
                onClick={e =>
                    this.state.docId === 0
                        ? this.changeCurrentStep(1)
                        : this.editPaymentRequistion(e)
                }>
                {Resources.next[currentLanguage]}
            </button>
        );
        //}

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
    };

    fillGridItems = () => {
        let contractId = this.state.document.contractId;
        if (this.props.changeStatus == true) {
            let paymentsItems = [...this.state.paymentsItems];

            if (paymentsItems.length === 0) {
                this.setState({ gridLoader: true });
                dataservice
                    .GetDataGrid(
                        'GetRequestItemsOrderByContractId?contractId=' +
                        contractId +
                        '&isAdd=' +
                        !this.props.changeStatus +
                        '&requestId=' +
                        this.state.docId +
                        '&pageNumber=' +
                        this.state.pageNumber +
                        '&pageSize=' +
                        this.state.pageSize,
                    )
                    .then(result => {
                        let items = result != null ? result : [];

                        this.setState({
                            paymentsItems: items,
                            gridLoader: false,
                            isFilter: true,
                        });
                    });
            }
        }
    };
    fillSummariesTab = () => {
        let contractId = this.state.document.contractId;
        let interimInvoicedTable = [...this.state.interimInvoicedTable];
        let isItemUpdate = this.state.isItemUpdate;

        if (
            (interimInvoicedTable.length == 0 || isItemUpdate === true) &&
            contractId > 0
        ) {
            this.setState({
                interimInvoicesLoading: true,
            });

            dataservice.GetDataGrid('GetTotalForReqPay?projectId=' + projectId + '&contractId=' +
                contractId +
                '&requestId=' +
                this.state.docId,
            )
                .then(result => {
                    this.props.actions.ExportingData({ items: result });
                    this.setState({
                        interimInvoicedTable: result || [],
                        interimInvoicesLoading: false,
                        isItemUpdate: false,
                    });
                })
                .catch(res => {
                    this.setState({
                        interimInvoicedTable: [],
                        isLoading: false,
                        isItemUpdate: false,
                    });
                });
        } else {
            this.setState({
                isLoading: false,
                isItemUpdate: false,
            });
        }

        let approvedInvoicesChilds = [...this.state.approvedInvoicesChilds];

        if (approvedInvoicesChilds.length == 0 && contractId > 0) {
            this.setState({
                approvedSummaryLoading: true,
            });
            let rowTotal = 0;

            dataservice
                .GetDataGridPost(
                    'GetApprovedInvoicesParent?contractId=' +
                    contractId +
                    '&requestId=' +
                    this.state.docId,
                )
                .then(result => {
                    var obj = {};
                    var conditionString = '';
                    result = result || [];
                    dataservice
                        .GetDataGridPost(
                            'GetApprovedInvoicesChilds?projectId=' +
                            projectId +
                            '&contractId=' +
                            contractId +
                            '&requestId=' +
                            this.state.docId,
                        )
                        .then(res => {
                            let approvedInvoicesParent = [];
                            res = res || [];
                            let columnsApprovedInvoices = [
                                {
                                    title:
                                        Resources['JobBuilding'][
                                        currentLanguage
                                        ],
                                    field: 'building',
                                },
                            ];
                            let trFoot = {};
                            result.map(parent => {
                                let sumRowTotal = 0;
                                let sumtotal = 0;

                                trFoot.building =
                                    Resources['total'][currentLanguage];
                                let prevTotal = 0;
                                res.map(child => {
                                    var total = child[parent.details]
                                        ? child[parent.details]
                                        : 0;
                                    prevTotal = trFoot[parent.details]
                                        ? trFoot[parent.details]
                                        : 0;
                                    trFoot[parent.details] = trFoot[
                                        parent.details
                                    ]
                                        ? trFoot[parent.details]
                                        : 0;
                                    trFoot[parent.details] = prevTotal + total;

                                    sumRowTotal += parseFloat(child.rowTotal);
                                    sumtotal = total + sumtotal;
                                    parent.total = sumtotal;
                                });

                                rowTotal = sumRowTotal;

                                conditionString = parent.details;

                                obj.building = 'Total';
                                obj.code = '';
                                obj.exists = '';
                                obj.serial = '';
                                obj[conditionString] = parent.total;
                                obj.rowTotal = rowTotal;

                                approvedInvoicesChilds.push(obj);

                                columnsApprovedInvoices.push({
                                    title: parent.details,
                                    field: parent.details,
                                });

                                if (parent.total === null) {
                                    parent.total = 0;
                                }

                                approvedInvoicesParent.push(parent);
                            });

                            columnsApprovedInvoices.push({
                                title: Resources['total'][currentLanguage],
                                field: 'rowTotal',
                            });

                            trFoot['rowTotal'] = rowTotal.toFixed(2);
                            res.push({ ...trFoot });
                            this.setState({
                                approvedInvoicesChilds: res,
                                approvedInvoicesParent: approvedInvoicesParent,
                                approvedSummaryLoading: false,
                                rowTotal: rowTotal,
                                columnsApprovedInvoices,
                            });
                        });
                });
        }
    };
    fillDeductions = () => {
        let deductionObservableArray = [...this.state.deductionObservableArray];

        if (deductionObservableArray.length == 0) {
            this.setState({
                isLoading: true,
            });

            dataservice
                .GetDataGrid(
                    'GetContractsRequestPaymentsDeductions?requestId=' +
                    this.state.docId,
                )
                .then(result => {
                    this.setState({
                        deductionObservableArray: result,
                        isLoading: false,
                    });
                })
                .catch(res => {
                    this.setState({
                        isLoading: false,
                    });
                });
        }
    };
    changeCurrentStep = stepNo => {
        if (stepNo == 1 && this.state.docId > 0) {
            this.fillGridItems();
        }
        this.setState({ currentStep: stepNo });
    };
    savePaymentRequistionItem(event) {
        let saveDocument = { ...this.state.voItem };

        saveDocument.changeOrderId = this.state.docId;

        dataservice
            .addObject('AddVOItems', saveDocument)
            .then(result => {
                if (result) {
                    let oldItems = [...this.state.voItems];
                    oldItems.push(result);
                    this.setState({
                        voItems: [...oldItems],
                    });
                    toast.success(
                        Resources['operationSuccess'][currentLanguage],
                    );
                }
            })
            .catch(res => {
                toast.error(Resources['operationCanceled'][currentLanguage]);
            });
    }
    handleChangeItem(e, field) {
        let original_document = { ...this.state.documentDeduction };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            documentDeduction: updated_document,
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
    ) {
        if (event == null) return;
        let original_document = { ...this.state.voItem };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            voItem: updated_document,
            [selectedValue]: event,
        });

        if (isSubscribe) {
            let action = url + '?' + param + '=' + event.value;
            dataservice.GetDataList(action, 'title', 'id').then(result => {
                this.setState({
                    [nextTragetState]: result,
                });
            });
        }
    }

    showRowEditModal(value) {
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
            currentObject: value,
        });
        this.addCommentModal.show();
    }
    showRowEditConstantModal(value) {
        let original_document = { ...this.state.currentObject };

        let updated_document = {};

        updated_document.sitePaymentPercent = value.sitePaymentPercent;
        updated_document.sitePercentComplete = value.sitePercentComplete;
        updated_document.siteQuantityComplete = value.siteQuantityComplete;
        updated_document.id = value.id;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            viewPopUpRows: true,
            currentObject: value,
        });
        this.addCommentModal.show();
    }

    onRowClick = value => {
        let userType = Config.getPayload();

        let obj = this.state.document;
        if (
            this.props.hasWorkflow == false ||
            this.state.isApproveMode == true
        ) {
            if (this.props.changeStatus) {
                if (obj.status === true && obj.editable === true) {
                    this.showRowEditModal(value);
                } else if (Config.getUserTypeIsAdmin() === true) {
                    this.showRowEditModal(value);
                } else {
                    toast.warn(Resources['adminItemEditable'][currentLanguage]);
                }
            } else {
                if (this.state.document.status === true) {
                    this.showRowEditConstantModal(value);
                } else if (Config.getUserTypeIsAdmin() === true) {
                    this.showRowEditConstantModal(value);
                } else {
                    toast.warn(Resources['adminItemEditable'][currentLanguage]);
                }
            }
        } else if (Config.getUserTypeIsAdmin() === true) {
            if (
                obj.status === true &&
                obj.editable === true &&
                this.props.changeStatus
            ) {
                this.showRowEditModal(value);
            } else if (this.state.document.status === true) {
                this.showRowEditConstantModal(value);
            } else {
                toast.warn(Resources['adminItemEditable'][currentLanguage]);
            }
        } else {
            toast.warn(Resources['adminItemEditable'][currentLanguage]);
        }
    };

    handleChangeItemDropDownItems(
        event,
        field,
        selectedValue,
        isSubscribe,
        url,
        param,
        nextTragetState,
    ) {
        if (event == null) return;
        let original_document = { ...this.state.boqStractureObj };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            boqStractureObj: updated_document,
            [selectedValue]: event,
        });

        if (isSubscribe) {
            let action = url + '?' + param + '=' + event.value;
            dataservice.GetDataList(action, 'title', 'id').then(result => {
                this.setState({
                    [nextTragetState]: result,
                });
            });
        }
    }

    rowsUpdated = (cell, type) => {
        if (this.state.isMultipleItems === true) {
            this.setState({
                gridLoader: true,
            });

            var ids = this.state.multiplePayReqItems;

            var paymentsItems = this.state.paymentsItems;
            let editRows = [...this.state.editRows];
            let updateR = this.state.currentObject;

            ids.forEach(id => {
                updateR.id = id;
                let updateRow = Object.assign({}, updateR);
                let originalRow = find(paymentsItems, function (x) {
                    return x.id === id;
                });

                if (editRows.length > 0) {
                    editRows = editRows.filter(function (i) {
                        return i.id != id;
                    });
                }

                if (
                    parseFloat(originalRow.revisedQuantity) == 0 &&
                    (parseFloat(originalRow.siteQuantityComplete) > 0 ||
                        parseFloat(originalRow.sitePercentComplete) > 0)
                ) {
                    originalRow.revisedQuantity = 1;
                }
                updateRow.revisedQuantity = originalRow.revisedQuantity;
                updateRow.quantityComplete = updateRow.siteQuantityComplete;
                updateRow.percentComplete = updateRow.sitePercentComplete;

                updateRow = Object.assign(originalRow, updateRow);
                editRows.push(updateRow);
                paymentsItems.map(function (i) {
                    if (i.id === id) {
                        i = updateRow;
                    }
                });
            });
            this.setState({
                editRows: editRows,
                paymentsItems: paymentsItems,
                viewPopUpRows: false,
                isItemUpdate: true,
                gridLoader: false,
                isFilter: true,
                isEditItems: true,
                isLoading: false,
                isEditingPercentage: 'true',
                ColumnsHideShow: this.state.columns,
                isMultipleItems: false,
            });

            this.reqPayModal.hide();
        } else {
            this.setState({
                isLoading: true,
            });

            let pItems = this.state.paymentsItems;

            let newValue = this.state.currentObject;

            let editRows = [...this.state.editRows];

            let sameRow = find(editRows, function (x) {
                return x.id === newValue.id;
            });

            if (sameRow) {
                editRows = editRows.filter(function (i) {
                    return i.id != newValue.id;
                });
            }
            editRows.push(newValue);

            let index = pItems.findIndex(x => x.id === newValue.id);

            pItems[index] = newValue;

            this.setState({
                editRows: editRows,
                paymentsItems: pItems,
                viewPopUpRows: false,
                isItemUpdate: true,
                gridLoader: false,
                isFilter: true,
                isEditItems: true,
                isLoading: false,
            });
            this.addCommentModal.hide();
        }
    };

    changeValueOfProps = () => {
        this.setState({ isFilter: false });
    };

    editRowsClick() {
        this.setState({ isLoading: true });
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(
            saveDocument.docDate,
            'YYYY-MM-DD',
        ).format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        saveDocument.projectId = this.state.projectId;

        dataservice
            .addObject('AddContractsRequestPayment', saveDocument)
            .then(result => {
                if (result.id) {
                    this.setState({
                        docId: result.id,
                        isLoading: false,
                    });

                    let editItems = [...this.state.editRows];
                    editItems.map(i => {
                        if (
                            i.revisedQuantity == 0 &&
                            i.siteQuantityComplete > 0
                        ) {
                            i.revisedQuantity = 1;
                        }
                        i.percentComplete =
                            (parseFloat(i.siteQuantityComplete) /
                                i.revisedQuantity) *
                            100;
                        i.sitePercentComplete =
                            (parseFloat(i.siteQuantityComplete) /
                                i.revisedQuantity) *
                            100;
                        i.contractId = this.state.document.contractId;
                        i.requestId = this.state.docId;
                        i.projectId = projectId;
                    });

                    let api =
                        this.props.changeStatus === true
                            ? 'EditContractsRequestPaymentsItems'
                            : 'AddContractsRequestPaymentsItemsNewScenario';
                    dataservice
                        .addObject(api, editItems)
                        .then(res => {
                            toast.success(
                                Resources['operationSuccess'][currentLanguage],
                            );
                            this.setState({
                                isLoading: false,
                                currentStep: 2,
                            });
                        })
                        .catch(() => {
                            toast.error(
                                Resources['operationCanceled'][currentLanguage],
                            );
                            this.setState({ isLoading: false });
                        });
                }
            })
            .catch(res => {
                this.setState({
                    isLoading: false,
                });
                toast.error(Resources['operationCanceled'][currentLanguage]);
            });
    }
    assign = () => {
        this.setState({ showBoqModal: true });
        this.boqTypeModal.show();
    };
    addDeduction() {
        this.setState({
            isLoading: true,
        });

        let saveDocument = this.state.documentDeduction;

        saveDocument.requestId = this.state.docId;

        dataservice
            .addObject('AddContractsRequestPaymentsDeductions', saveDocument)
            .then(result => {
                if (result) {
                    let deductionName = this.state.deductionTypesList.find(
                        x => x.value == result.deductionTypeId,
                    );
                    result.deductionTypeName = deductionName
                        ? deductionName.label
                        : null;
                    let list = [...this.state.deductionObservableArray];
                    list.push(result);

                    let documentDeduction = {
                        title: '',
                        deductionValue: 0,
                        deductionObservableArray: list,
                    };

                    this.setState({
                        isLoading: false,
                        documentDeduction: documentDeduction,
                        deductionObservableArray: list,
                    });

                    toast.success(
                        Resources['operationSuccess'][currentLanguage],
                    );
                }
            })
            .catch(res => {
                this.setState({
                    isLoading: false,
                });
                toast.error(Resources['operationCanceled'][currentLanguage]);
            });
    }
    assignBoqType = () => {
        let boqStractureObj = { ...this.state.boqStractureObj };

        this.setState({ showBoqModal: true, isLoadingItems: true });

        dataservice
            .addObject('EditBoqStarcureRequestItem', boqStractureObj)
            .then(result => {
                let originalData = this.state.paymentsItems;

                let getIndex = originalData.findIndex(
                    x => x.id === boqStractureObj.id,
                );

                let obj = originalData.find(x => x.id === boqStractureObj.id);

                obj.boqTypeChildId = this.state.selectedBoqTypeChildEdit.value;
                obj.boqSubType = this.state.selectedBoqSubTypeEdit.value;
                obj.boqType = this.state.selectedBoqTypeEdit.value;
                obj.secondLevel = this.state.selectedBoqTypeChildEdit.label;
                obj.boqSubType = this.state.selectedBoqSubTypeEdit.label;
                obj.boqType = this.state.selectedBoqTypeEdit.label;

                originalData.splice(getIndex, 1);

                originalData.push(obj);

                this.setState({
                    paymentsItems: originalData,
                    showBoqModal: false,
                    isLoadingItems: false,
                });
                toast.success(Resources['operationSuccess'][currentLanguage]);
            })
            .catch(() => {
                toast.error(Resources['operationCanceled'][currentLanguage]);
                this.setState({ showBoqModal: false, isLoadingItems: false });
            });
    };
    addCommentClick = () => {
        let comment = { ...this.state.comment };

        this.setState({ showCommentModal: true, isLoading: true });
        if (this.props.changeStatus) {
            this.setState({ showCommentModal: false, isLoading: false });
        }
    };
    openModalColumn = () => {
        this.setState({ columnsModal: true });
    };
    closeModalColumn = () => {
        this.setState({ columnsModal: false });
    };

    handleChangeForEdit = (e, updated) => {
        let updateRow = this.state.currentObject;

        this.setState({
            isLoading: true,
        });

        let sitePercentComplete = 0;
        let siteQuantityComplete = 0;
        let splitText = e.target.value.split('.');
        //let currentvalue = 0;
        // if (splitText[1].length == 0) {
        //     currentvalue = parseFloat(e.target.value + '0').toFixed(1);
        // } else if (splitText[1].length == 1) {
        //     currentvalue = parseFloat(e.target.value).toFixed(splitText[1].length);
        // } else {
        //     currentvalue = parseFloat(e.target.value).toFixed(splitText[1].length);
        // }
        //let currentvalue = Number(e.target.value);
        let currentvalue =
            e.target.value == ''
                ? ''
                : e.target.value[e.target.value.length - 1] == '.'
                    ? e.target.value
                    : parseFloat(e.target.value);

        if (
            parseFloat(updateRow.revisedQuantity) == 0 &&
            (parseFloat(updateRow.siteQuantityComplete) > 0 ||
                parseFloat(updateRow.sitePercentComplete) > 0)
        ) {
            updateRow.revisedQuantity = 1;
        }

        switch (updated) {
            case 'quantityComplete':
                updateRow.percentComplete =
                    (currentvalue / updateRow.revisedQuantity) * 100;
                updateRow.quantityComplete = e.target.value; // currentvalue;
                break;

            case 'sitePaymentPercent':
                updateRow.paymentPercent = e.target.value; //currentvalue;
                updateRow.sitePaymentPercent = e.target.value; //currentvalue;
                break;

            case 'paymentPercent':
                updateRow.paymentPercent = e.target.value; //currentvalue;
                break;

            case 'percentComplete':
                updateRow.quantityComplete =
                    (currentvalue / 100) * updateRow.revisedQuantity;
                updateRow.percentComplete = e.target.value; //currentvalue;
                break;

            case 'sitePercentComplete':
                sitePercentComplete = e.target.value; //currentvalue;
                siteQuantityComplete =
                    (currentvalue / 100) * updateRow.revisedQuantity;

                updateRow.siteQuantityComplete = siteQuantityComplete;
                updateRow.quantityComplete = siteQuantityComplete;

                updateRow.percentComplete = sitePercentComplete;
                updateRow.sitePercentComplete = sitePercentComplete;

                break;

            case 'siteQuantityComplete':
                sitePercentComplete =
                    (currentvalue / updateRow.revisedQuantity) * 100;
                siteQuantityComplete = e.target.value; //currentvalue;

                updateRow.sitePercentComplete = sitePercentComplete;
                updateRow.percentComplete = sitePercentComplete;

                updateRow.quantityComplete = siteQuantityComplete;
                updateRow.siteQuantityComplete = siteQuantityComplete;

                break;

            case 'lastComment':
                updateRow.comment = e.target.value;
                break;
        }

        this.setState({
            currentObject: updateRow,
            isLoading: false,
        });
    };
    multipleHandleChangeForEdit = (e, updated) => {
        let updateRow = this.state.currentObject;

        this.setState({
            isLoading: true,
        });

        let sitePercentComplete = 0;
        let siteQuantityComplete = 0;
        let currentvalue =
            e.target.value == ''
                ? ''
                : e.target.value[e.target.value.length - 1] == '.'
                    ? e.target.value
                    : parseFloat(e.target.value);

        switch (updated) {
            case 'quantityComplete':
                updateRow.quantityComplete = e.target.value; // currentvalue;
                break;

            case 'sitePaymentPercent':
                updateRow.sitePaymentPercent = e.target.value; // currentvalue;
                break;

            case 'paymentPercent':
                updateRow.paymentPercent = e.target.value; // currentvalue;
                break;

            case 'percentComplete':
                updateRow.percentComplete = e.target.value; //currentvalue;
                break;

            case 'sitePercentComplete':
                sitePercentComplete = e.target.value; // currentvalue;
                updateRow.sitePercentComplete = sitePercentComplete;
                updateRow.percentComplete =
                    this.props.changeStatus === false
                        ? sitePercentComplete
                        : updateRow.percentComplete;

                break;

            case 'siteQuantityComplete':
                siteQuantityComplete = e.target.value; // currentvalue;

                updateRow.siteQuantityComplete = siteQuantityComplete;

                updateRow.quantityComplete =
                    this.props.changeStatus === false
                        ? siteQuantityComplete
                        : updateRow.quantityComplete;

                break;

            case 'lastComment':
                updateRow.lastComment = e.target.value;
                break;
        }

        this.setState({
            currentObject: updateRow,
            isLoading: false,
        });
    };
    editPaymentRequistionItems = () => {
        if (this.state.isMultipleItems === true) {
            var ids = this.state.multiplePayReqItems;
            var listOfItems = [];
            var paymentsItems = this.state.paymentsItems;
            ids.forEach(id => {
                let originalRow = find(paymentsItems, function (x) {
                    return x.id === id;
                });

                let updateRow = this.state.currentObject;

                let siteQuantityComplete = 0;
                let sitePercentComplete = 0;
                if (
                    parseFloat(originalRow.revisedQuantity) == 0 &&
                    (parseFloat(originalRow.siteQuantityComplete) > 0 ||
                        parseFloat(originalRow.sitePercentComplete) > 0)
                ) {
                    originalRow.revisedQuantity = 1;
                }

                updateRow.totalExcutedPayment = originalRow.totalExcutedPayment;
                updateRow.totalExcuted = originalRow.totalExcuted;
                updateRow.isChangeOrder = originalRow.isChangeOrder;
                updateRow.amendmentId = originalRow.amendmentId;
                updateRow.isAmendment = originalRow.isAmendment;
                updateRow.comment = updateRow.lastComment;
                updateRow.revisedQuantity = originalRow.revisedQuantity;
                updateRow.sitePaymentPercent = Config.IsAllow(3673)
                    ? updateRow.sitePaymentPercent
                    : originalRow.sitePaymentPercent;
                updateRow.sitePercentComplete = Config.IsAllow(3673)
                    ? updateRow.sitePercentComplete
                    : originalRow.sitePercentComplete;
                updateRow.siteQuantityComplete = Config.IsAllow(3673)
                    ? updateRow.siteQuantityComplete
                    : originalRow.siteQuantityComplete;
                updateRow.percentComplete = Config.IsAllow(3674)
                    ? updateRow.percentComplete
                    : originalRow.percentComplete;
                updateRow.quantityComplete = Config.IsAllow(3674)
                    ? updateRow.quantityComplete
                    : originalRow.quantityComplete;
                updateRow.paymentPercent = Config.IsAllow(3674)
                    ? updateRow.paymentPercent
                    : originalRow.paymentPercent;

                if (this.state.isEditingPercentage === true) {
                    updateRow.quantityComplete =
                        (updateRow.percentComplete / 100) *
                        originalRow.revisedQuantity;
                    sitePercentComplete = updateRow.sitePercentComplete;

                    siteQuantityComplete =
                        (updateRow.sitePercentComplete / 100) *
                        originalRow.revisedQuantity;
                    updateRow.siteQuantityComplete = siteQuantityComplete;

                    updateRow.lastComment = updateRow.lastComment;

                    updateRow.id = id;
                } else {
                    updateRow.percentComplete =
                        (updateRow.quantityComplete /
                            originalRow.revisedQuantity) *
                        100;

                    updateRow.sitePercentComplete =
                        (updateRow.siteQuantityComplete /
                            originalRow.revisedQuantity) *
                        100;
                    updateRow.lastComment = updateRow.lastComment;

                    updateRow.id = id;
                }
                updateRow.requestId = this.state.docId;
                updateRow.contractId = this.state.document.contractId;
                updateRow = Object.assign(originalRow, updateRow);
                listOfItems.push(updateRow);
            });

            this.setState({
                gridLoader: true,
                isLoadingItems: true,
                isEditingPercentage: 'true',
                ColumnsHideShow: this.state.columns,
                isMultipleItems: false,
            });

            dataservice
                .addObject('EditRequestPaymentMultipleItems', listOfItems)
                .then(result => {
                    if (result) {
                        toast.success(
                            Resources['operationSuccess'][currentLanguage],
                        );

                        listOfItems.forEach(mainDoc => {
                            let cellInstance = Object.assign({}, mainDoc);

                            cellInstance.sitePercentComplete =
                                mainDoc.sitePercentComplete;
                            cellInstance.siteQuantityComplete =
                                mainDoc.siteQuantityComplete;
                            cellInstance.sitePaymentPercent =
                                mainDoc.sitePaymentPercent;
                            cellInstance.percentComplete =
                                mainDoc.percentComplete;
                            cellInstance.quantityComplete =
                                mainDoc.quantityComplete;
                            cellInstance.paymentPercent =
                                mainDoc.paymentPercent;
                            cellInstance.comment = mainDoc.comment;
                            cellInstance.totalExcutedPayment =
                                mainDoc.totalExcutedPayment;

                            let cellIndex = paymentsItems.findIndex(
                                c => c.id == cellInstance.id,
                            );

                            paymentsItems[cellIndex] = cellInstance;
                        });
                        this.setState({
                            paymentsItems: paymentsItems,
                            viewPopUpRows: false,
                            isItemUpdate: true,
                            isLoadingItems: false,
                            gridLoader: false,
                            isFilter: true,
                            isEditItems: true,
                            isEditingPercentage: 'true',
                            isMultipleItems: false,
                        });
                    } else {
                        this.setState({
                            viewPopUpRows: false,
                            isItemUpdate: true,
                            isLoadingItems: false,
                            gridLoader: false,
                            isFilter: true,
                            isEditItems: true,
                            isEditingPercentage: 'true',
                            isMultipleItems: false,
                        });
                    }
                })
                .catch(res => {
                    toast.error(
                        Resources['operationCanceled'][currentLanguage],
                    );
                    this.setState({
                        isLoadingItems: false,
                        gridLoader: false,
                        isEditingPercentage: 'true',
                    });
                });
        } else {
            let mainDoc = this.state.currentObject;
            mainDoc.requestId = this.state.docId;
            mainDoc.contractId = this.state.document.contractId;

            this.setState({
                gridLoader: true,
                isLoadingItems: true,
                ColumnsHideShow: this.state.columns,
            });

            dataservice
                .addObject('EditRequestPaymentItem', mainDoc)
                .then(result => {
                    toast.success(
                        Resources['operationSuccess'][currentLanguage],
                    );

                    let cellInstance = Object.assign({}, mainDoc);

                    cellInstance.sitePercentComplete =
                        mainDoc.sitePercentComplete;
                    cellInstance.siteQuantityComplete =
                        mainDoc.siteQuantityComplete;
                    cellInstance.sitePaymentPercent =
                        mainDoc.sitePaymentPercent;
                    cellInstance.percentComplete = mainDoc.percentComplete;
                    cellInstance.quantityComplete = mainDoc.quantityComplete;
                    cellInstance.paymentPercent = mainDoc.paymentPercent;
                    cellInstance.comment = mainDoc.comment;

                    let pItems = JSON.parse(
                        JSON.stringify(this.state.paymentsItems),
                    );

                    let cellIndex = pItems.findIndex(
                        c => c.id == cellInstance.id,
                    );

                    pItems[cellIndex] = cellInstance;

                    this.setState({
                        paymentsItems: pItems,
                        viewPopUpRows: false,
                        isItemUpdate: true,
                        gridLoader: false,
                        isLoadingItems: false,
                        isFilter: true,
                        isEditItems: true,
                    });
                })
                .catch(res => {
                    toast.error(
                        Resources['operationCanceled'][currentLanguage],
                    );
                    this.setState({
                        isLoadingItems: false,
                    });
                });
        }
    };

    handleDropAction(event) {
        switch (event.value) {
            case '1':
                dataservice
                    .GetDataGrid(
                        'AddMissingAmendments?requestId=' +
                        this.state.docId +
                        '&contractId=' +
                        this.state.document.contractId,
                    )
                    .then(result => {
                        toast.success(
                            Resources['operationSuccess'][currentLanguage],
                        );
                    })
                    .catch(res => {
                        toast.error(
                            Resources['operationCanceled'][currentLanguage],
                        );
                    });
                break;
            case '2':
                dataservice
                    .GetDataGrid(
                        'UpdatePayemtRequistionTotals?id=' + this.state.docId,
                    )
                    .then(result => {
                        toast.success(
                            Resources['operationSuccess'][currentLanguage],
                        );
                    })
                    .catch(res => {
                        toast.error(
                            Resources['operationCanceled'][currentLanguage],
                        );
                    });
                break;
            case '3':
                dataservice
                    .GetDataGrid(
                        'UpdatePRItemsByVariationOrders?requestId=' +
                        this.state.docId,
                    )
                    .then(result => {
                        toast.success(
                            Resources['operationSuccess'][currentLanguage],
                        );
                    })
                    .catch(res => {
                        toast.error(
                            Resources['operationCanceled'][currentLanguage],
                        );
                    });
                break;
            case '4':
                dataservice
                    .GetDataGrid(
                        'AddMissingItems?requestId=' +
                        this.state.docId +
                        '&contractId=' +
                        this.state.document.contractId,
                    )
                    .then(result => {
                        toast.success(
                            Resources['operationSuccess'][currentLanguage],
                        );
                    })
                    .catch(res => {
                        toast.error(
                            Resources['operationCanceled'][currentLanguage],
                        );
                    });
                break;
            case '5':
                this.editPayment.show();
                break;
            case '6':
                dataservice
                    .GetDataGrid(
                        'UpdateInterimForRequest?requestId=' +
                        this.state.docId +
                        '&contractId=' +
                        this.state.document.contractId,
                    )
                    .then(result => {
                        toast.success(
                            Resources['operationSuccess'][currentLanguage],
                        );
                    })
                    .catch(res => {
                        toast.error(
                            Resources['operationCanceled'][currentLanguage],
                        );
                    });

            case '7':
                this.setState({
                    addDeducation: true,
                });
                break;
            case '8':
                dataservice
                    .GetDataGrid(
                        'UpdateAdvancedPaymentAmount?requestPaymentId=' +
                        this.state.docId,
                    )
                    .then(result => {
                        toast.success(
                            Resources['operationSuccess'][currentLanguage],
                        );
                    })
                    .catch(res => {
                        toast.error(
                            Resources['operationCanceled'][currentLanguage],
                        );
                    });
                break;
            case '9':
                dataservice
                    .GetDataGrid(
                        'GetContractsChangeOrderByContractId?contractId=' +
                        this.state.document.contractId,
                    )
                    .then(res => {
                        this.setState({
                            updateVoListData: res,
                        });
                    });
                this.updateVoPricesModal.show();

                this.setState({
                    updateVoPricesModal: true,
<<<<<<< HEAD
                    selected : {}
=======
>>>>>>> f6dd6eddb5eb6a4e8923973fb83eb3b2eafcce1f
                });
                break;
            case '10':
                dataservice
                    .GetDataGrid(
                        'ChangeEditableStatus?requestId=' + this.state.docId,
                    )
                    .then(res => {
                        let original_document = { ...this.state.document };

                        let updated_document = {};

<<<<<<< HEAD
                    updated_document.editable = !original_document.editable;
=======
                        updated_document.editable = !original_document.editable;
>>>>>>> f6dd6eddb5eb6a4e8923973fb83eb3b2eafcce1f

                        updated_document = Object.assign(
                            original_document,
                            updated_document,
                        );

                        this.setState({
                            document: updated_document,
                        });
                        toast.success(
                            Resources['operationSuccess'][currentLanguage],
                        );
                    })
                    .catch(res => {
                        toast.error(
                            Resources['operationCanceled'][currentLanguage],
                        );
                    });
                break;
        }

        this.setState({
            selectedDropDown: event,
        });
    }

    viewConfirmDelete(id, type) {
        this.setState({
            currentId: id,
            showDeleteModal: true,
            currentDocument: type,
        });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerContinueMain = () => {
        if (this.state.currentDocument === 'deduction') {
            let id = this.state.currentId;

            dataservice
                .GetDataGrid(
                    'ContractsRequestPaymentsDeductionsDelete?id=' +
                    id +
                    '&requestId=' +
                    this.state.docId,
                )
                .then(result => {
                    let originalData = this.state.deductionObservableArray;

                    let getIndex = originalData.findIndex(x => x.id === id);

                    originalData.splice(getIndex, 1);

                    this.setState({
                        deductionObservableArray: originalData,
                        showDeleteModal: false,
                    });

                    toast.success(
                        Resources['operationSuccess'][currentLanguage],
                    );
                })
                .catch(ex => {
                    toast.success(
                        Resources['operationSuccess'][currentLanguage],
                    );
                });
        } else if (this.state.currentDocument === 'requestItems') {
            this.setState({ isLoadingItems: true });
            let doument = [this.state.currentId];
            Api.post('DeletePaymentRequestItems', doument)
                .then(result => {
                    let originalData = this.state.paymentsItems;
                    let ids = this.state.currentId;
                    originalData = originalData.filter(
                        x => x.id !== this.state.currentId,
                    );
                    this.setState({
                        paymentsItems: originalData,
                        showDeleteModal: false,
                        isLoadingItems: false,
                    });
                    toast.success(
                        Resources['operationSuccess'][currentLanguage],
                    );
                })
                .catch(ex => {
                    toast.success(
                        Resources['operationCanceled'][currentLanguage],
                    );
                    this.setState({
                        showDeleteModal: false,
                        isLoadingItems: false,
                    });
                });
        } else {
            if (this.props.changeStatus) {
                this.setState({
                    treesLoader: true,
                });
                dataservice
                    .GetDataGrid(
                        'DeleteDistributionItems?id=' + this.state.currentId,
                    )
                    .then(result => {
                        toast.success(
                            Resources['operationSuccess'][currentLanguage],
                        );

                        let originalData = this.state.trees;

                        let getIndex = originalData.findIndex(
                            x => x.id === this.state.currentId,
                        );

                        originalData.splice(getIndex, 1);

                        this.setState({
                            trees: originalData,
                            treesLoader: false,
                            showDeleteModal: false,
                        });
                    });
            }
        }
    };

    handleDropActionForExportFile = event => {
        let exportFile = '';

        if (event.label === 'Export') {
            this.setState({ isView: false, exportFile: '' });
            let ExportColumnsList = [];

            exportFile = (
                <Export
                    isExportRequestPayment={true}
                    type={1}
                    key={'Export-1'}
                    rows={
                        this.state.isLoading === false
                            ? this.state.paymentsItems
                            : []
                    }
                    columns={itemsColumns}
                    fileName={'Request Payments Items'}
                />
            );
        } else {
            this.setState({ isView: false, exportFile: '' });

            let VOItemsColumnsList = [];
            VOItemsColumns.filter(i => {
                if (i.key !== 'BtnActions') {
                    VOItemsColumnsList.push({ title: i.name, field: i.key });
                }
            });

            exportFile = (
                <Export
                    isExportRequestPayment={true}
                    key={'Export-2'}
                    rows={
                        this.state.isLoading === false
                            ? this.state.paymentsItems
                            : []
                    }
                    columns={VOItemsColumnsList}
                    fileName={'Request Payments Items'}
                />
            );
        }
        this.setState({
            exportFile,
            isView: true,
            selectedDropDownExport: event,
        });
    };

    updateActualPayments = () => {
        this.setState({ viewUpdatePayment: true });

        let obj = {};

        obj.id = this.state.docId;

        obj.actualPayment = this.state.actualPayments;
        obj.contractId = this.state.document.contractId;

        dataservice
            .addObject('EditActualPayment', obj)
            .then(result => {
                this.setState({ viewUpdatePayment: false });

                toast.success(Resources['operationSuccess'][currentLanguage]);
            })
            .catch(res => {
                this.setState({
                    viewUpdatePayment: false,
                });

                toast.error(Resources['operationCanceled'][currentLanguage]);
            });
    };

    updatePayemtWithVariationOrderByAdmin = () => {
        this.setState({ viewUpdateCalc: true });

        let requestId = this.state.docId;

        let contactId = this.state.document.contractId;

        dataservice
            .GetDataGrid(
                'UpdatePayemtWithVariationOrderByAdmin?requestId=' +
                requestId +
                '&contractId=' +
                contactId,
            )
            .then(result => {
                this.setState({ viewUpdateCalc: false });

                toast.success(Resources['operationSuccess'][currentLanguage]);
            })
            .catch(res => {
                this.setState({
                    viewUpdateCalc: false,
                });
                toast.error(Resources['operationCanceled'][currentLanguage]);
            });
    };

    addCostTree = () => {
        let costCodingId = this.state.selectedDropDownTrees.value;

        if (costCodingId != '0') {
            let isExist = this.state.trees.find(
                x => x.costCodingId === costCodingId,
            );

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
                objTree.date = moment(
                    this.state.document.docDate,
                    'YYYY-MM-DD',
                ).format('YYYY-MM-DD[T]HH:mm:ss.SSS');

                if (this.props.changeStatus) {
                    let lastCodingItems = this.state.trees;

                    dataservice
                        .addObject('AddDistributionQuantityForEdit', objTree)
                        .then(result => {
                            lastCodingItems.push(objTree);
                            this.setState({
                                trees: lastCodingItems,
                            });
                        });
                } else {
                    let lastCodingItems = this.state.trees;

                    lastCodingItems.push(objTree);

                    this.setState({
                        id: this.state.id + 1,
                        trees: lastCodingItems,
                    });
                }
            } else {
                toast.warn('This CostCodingTree Already Added');
            }
        } else {
            toast.warn('Please Choose CostCodingTree');
        }
    };

    handleDropTrees = event => {
        if (event == null) return;

        this.setState({
            selectedDropDownTrees: event,
        });
    };

    renderEditableValue = cellInfo => {
        const trees = [...this.state.trees];

        return (
            <div
                style={{
                    color: '#4382f9 ',
                    padding: '0px 6px',
                    margin: '5px 0px',
                    border: '1px dashed',
                    cursor: 'pointer',
                }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    //const trees = [...this.state.trees];
                    trees[cellInfo.index][cellInfo.column.id] =
                        e.target.innerHTML;
                    this.setState({ trees, treesLoader: false });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.trees[cellInfo.index]
                        ? this.state.trees[cellInfo.index].value
                        : 0,
                }}
            />
        );
    };

    actionHandler = (key, e) => {
        let state = this.state;

        state[key.id + '-drop'] = e;

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

            dataservice
                .addObject('AddDistributionQuantity', originalData)
                .then(result => {
                    toast.success(
                        Resources['operationSuccess'][currentLanguage],
                    );

                    this.setState({
                        showCostCodingTree: false,
                        isLoading: false,
                    });
                });
        } else {
            toast.success('Please Add CostCodingTree');
        }
    };

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;

        if (pageNumber > 0) {
            this.setState({
                gridLoader: true,
                pageNumber: pageNumber,
            });

            let oldRows = [...this.state.paymentsItems];

            dataservice
                .GetDataGrid(
                    'GetRequestItemsOrderByContractId?contractId=' +
                    this.state.document.contractId +
                    '&isAdd=' +
                    !this.props.changeStatus +
                    '&requestId=' +
                    this.state.docId +
                    '&pageNumber=' +
                    pageNumber +
                    '&pageSize=' +
                    this.state.pageSize,
                )
                .then(result => {
                    const newRows = [...this.state.paymentsItems, ...result];

                    this.setState({
                        paymentsItems: newRows,
                        gridLoader: false,
                    });
                })
                .catch(ex => {
                    this.setState({
                        paymentsItems: oldRows,
                        gridLoader: false,
                    });
                });
        }
    }

    GetNextData() {
        if (
            this.state.noItems >
            this.state.pageSize * this.state.pageNumber + this.state.pageSize
        ) {
            let pageNumber = this.state.pageNumber + 1;

            this.setState({
                gridLoader: true,
                pageNumber: pageNumber,
            });

            let oldRows = [...this.state.paymentsItems];

            dataservice
                .GetDataGrid(
                    'GetRequestItemsOrderByContractId?contractId=' +
                    this.state.document.contractId +
                    '&isAdd=' +
                    !this.props.changeStatus +
                    '&requestId=' +
                    this.state.docId +
                    '&pageNumber=' +
                    pageNumber +
                    '&pageSize=' +
                    this.state.pageSize,
                )
                .then(result => {
                    const newRows = [...oldRows, ...result];

                    this.setState({
                        paymentsItems: newRows,
                        gridLoader: false,
                    });
                })
                .catch(ex => {
                    this.setState({
                        paymentsItems: oldRows,
                        gridLoader: false,
                    });
                });
        }
    }

    clickHandlerDeleteRows = rows => {
        this.viewConfirmDelete(rows, 'requestItems');
    };

    editAdvancedPayment() {
        if (this.state.advancedPayment != 0) {
            this.setState({
                isLoading: true,
            });

            dataservice
                .addObject(
                    `EditPaymentAmount?requestId=${this.state.docId}&value=${this.state.advancedPayment}`,
                )
                .then(result => {
                    this.setState({
                        isLoading: false,
                    });
                    toast.success(
                        Resources['operationSuccess'][currentLanguage],
                    );
                });
        } else {
            toast.warn('Please Write Value MoreZane Zero');
        }
    }

    renderingGrid() {
        const ItemsGrid =
            this.state.gridLoader === false && this.state.currentStep === 1 ? (
                <GridCustom
                    gridKey="ReqPaymentsItems"
                    data={this.state.paymentsItems}
                    groups={this.state.groups}
                    isFilter={this.state.isFilter}
                    actions={this.actions}
                    openModalColumn={this.state.columnsModal}
                    cells={this.state.columns}
                    rowActions={
                        this.state.isViewMode !== true &&
                            this.props.changeStatus
                            ? this.rowActions
                            : []
                    }
                    rowClick={cell => {
                        this.onRowClick(cell);
                    }}
                    changeValueOfProps={this.changeValueOfProps.bind(this)}
                />
            ) : (
                    <div style={{ position: 'relative' }}>
                        <LoadingSection />
                    </div>
                );

        return ItemsGrid;
    }
    executeVoChangePrices = () => {
        this.setState({ isLoading: true , selected : {}});

        let requestId = this.state.docId;

        let changeOrderId = Object.keys(this.state.selected);

<<<<<<< HEAD
        dataservice.GetDataGrid("UpdatePRItemsByByvoPrices?requestId=" + requestId + "&changeOrderId=" + changeOrderId).then(result => {
            this.setState({ updateVoPricesModal: false, isLoading: false , selected : {}});

            this.updateVoPricesModal.hide();
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(res => {
            this.setState({ updateVoPricesModal: false });
=======
        dataservice
            .GetDataGrid(
                'UpdatePRItemsByByvoPrices?requestId=' +
                requestId +
                '&changeOrderId=' +
                changeOrderId,
            )
            .then(result => {
                this.setState({ updateVoPricesModal: false });

                this.updateVoPricesModal.hide();
                toast.success(Resources['operationSuccess'][currentLanguage]);
            })
            .catch(res => {
                this.setState({ updateVoPricesModal: false });
>>>>>>> f6dd6eddb5eb6a4e8923973fb83eb3b2eafcce1f

                this.updateVoPricesModal.hide();
                toast.error(Resources['operationCanceled'][currentLanguage]);
            });
    };

    getById = id => {
        if (id > 0) {
            let obj = {
                docId: id,
                projectId: projectId,
                projectName: projectName,
                arrange: 0,
                docApprovalId: 0,
                isApproveMode: false,
                perviousRoute:
                    window.location.pathname + window.location.search,
            };
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

            this.props.history.push({
                pathname: '/requestPaymentsAddEdit',
                search: '?id=' + encodedPaylod,
            });
            window.location.reload();
        }
    };
    render() {
        let columns = [];

        if (this.state.userType !== 'user' || Config.IsAllow(3780)) {
            columns.push(
                {
                    Header: 'Controls',
                    id: 'checkbox',
                    accessor: 'id',
                    Cell: ({ row }) => {
                        return (
                            <div
                                className="btn table-btn-tooltip"
                                style={{ marginLeft: '5px' }}
                                onClick={() =>
                                    this.viewConfirmDelete(
                                        row._original.id,
                                        'deduction',
                                    )
                                }>
                                <i
                                    style={{ fontSize: '1.6em' }}
                                    className="fa fa-trash-o"
                                />
                            </div>
                        );
                    },
                    width: 50,
                },
                {
                    Header: Resources['description'][currentLanguage],
                    accessor: 'title',
                    sortabel: true,
                    width: 200,
                    title: Resources['description'][currentLanguage],
                    field: 'title',
                },
                {
                    Header: Resources['deductions'][currentLanguage],
                    accessor: 'deductionValue',
                    width: 200,
                    sortabel: true,
                    title: Resources['deductions'][currentLanguage],
                    field: 'deductionValue',
                },
                {
                    Header: Resources['deductionType'][currentLanguage],
                    accessor: 'deductionTypeName',
                    width: 200,
                    sortabel: true,
                    title: Resources['deductionType'][currentLanguage],
                    field: 'deductionTypeName',
                },
            );
        } else {
            columns.push(
                {
                    Header: Resources['description'][currentLanguage],
                    accessor: 'title',
                    sortabel: true,
                    width: 200,
                    title: Resources['description'][currentLanguage],
                    field: 'title',
                },
                {
                    Header: Resources['deductions'][currentLanguage],
                    accessor: 'deductionValue',
                    width: 200,
                    sortabel: true,
                    title: Resources['deductions'][currentLanguage],
                    field: 'deductionValue',
                },
            );
        }

        //ExportDeducation
        const btnExportDeducation =
            this.state.isLoading === false ? (
                <Export
                    key={'Export-3'}
                    rows={
                        this.state.isLoading === false
                            ? this.state.deductionObservableArray
                            : []
                    }
                    columns={columns.filter(x => x.id != 'checkbox')}
                    fileName={
                        Resources['informationDeductions'][currentLanguage]
                    }
                />
            ) : null;

        //ExportInterimPayment
        const btnExportInterimPayment =
            this.state.interimInvoicesLoading === false ? (
                <Export
                    key={'Export-4'}
                    rows={
                        this.state.interimInvoicedTable === false
                            ? this.state.interimInvoicedTable
                            : []
                    }
                    columns={columnOfInterimPayment}
                    fileName={
                        Resources['interimPaymentCertificate'][currentLanguage]
                    }
                />
            ) : null;

        //ExportApprovedInvoices
        const btnExportApprovedInvoices =
            this.state.approvedSummaryLoading === false ? (
                <Export
                    key={'Export-5'}
                    rows={
                        this.state.isLoading === false
                            ? this.state.approvedInvoicesChilds
                            : []
                    }
                    columns={this.state.columnsApprovedInvoices}
                    fileName={
                        Resources['summaryOfApprovedInvoices'][currentLanguage]
                    }
                />
            ) : null;

        let columnsTrees = [
            {
                Header: 'Delete',
                id: 'checkbox',
                accessor: 'id',
                Cell: ({ row }) => {
                    return (
                        <div
                            className="btn table-btn-tooltip"
                            style={{ marginLeft: '5px' }}
                            onClick={() =>
                                this.viewConfirmDelete(
                                    row._original.id,
                                    'trees',
                                )
                            }>
                            <i
                                style={{ fontSize: '1.6em' }}
                                className="fa fa-trash-o"
                            />
                        </div>
                    );
                },
                width: 100,
            },
            {
                Header: Resources['costCodingTree'][currentLanguage],
                accessor: 'costCodingTitle',
                sortabel: true,
                width: 200,
            },
            {
                Header: Resources['value'][currentLanguage],
                accessor: 'value',
                Cell: this.renderEditableValue,
                width: 200,
            },
            {
                Header: Resources['percentageStatus'][currentLanguage],
                accessor: 'percentageStatus',
                Cell: ({ row }) => {
                    return (
                        <div className="shareLinks">
                            <Dropdown
                                title=""
                                data={this.state.percentageStatus}
                                handleChange={e =>
                                    this.actionHandler(row._original, e)
                                }
                                selectedValue={
                                    this.state[row._original.id + '-drop']
                                }
                                name={row._original.id + '-drop'}
                                index={Date.now()}
                            />
                        </div>
                    );
                },
                width: 200,
            },
        ];
        let voItems = [
            {
                Header: 'Delete',
                id: 'checkbox',
                accessor: 'id',
                Cell: ({ row }) => {
                    return (
                        <div
                            className="btn table-btn-tooltip"
                            style={{ marginLeft: '5px' }}>
                            <i
                                style={{ fontSize: '1.6em' }}
                                className="fa fa-trash-o"
                            />
                        </div>
                    );
                },
                width: 100,
            },
            {
                Header: Resources['costCodingTree'][currentLanguage],
                accessor: 'costCodingTitle',
                sortabel: true,
                width: 200,
            },
            {
                Header: Resources['value'][currentLanguage],
                accessor: 'value',
                Cell: this.renderEditableValue,
                width: 200,
            },
        ];
        let updateVoList = [
            {
                Header: Resources['checkList'][currentLanguage],
                id: 'checkbox',
                accessor: 'id',
                Cell: ({ row }) => {
                    return (
                        <div className="ui checked checkbox  checkBoxGray300 ">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={
                                    this.state.selected[row._original.id] ===
                                    true
                                }
                                onChange={() => this.toggleRow(row._original)}
                            />
                            <label></label>
                        </div>
                    );
                },
<<<<<<< HEAD
                width: 100
=======
                width: 50,
>>>>>>> f6dd6eddb5eb6a4e8923973fb83eb3b2eafcce1f
            },
            {
                Header: Resources['subject'][currentLanguage],
                accessor: 'subject',
                sortabel: true,
<<<<<<< HEAD
                width: 500
=======
                width: 300,
            },
            {
                Header: Resources['contractSubject'][currentLanguage],
                accessor: 'contractSubject',
                sortabel: true,
                width: 300,
>>>>>>> f6dd6eddb5eb6a4e8923973fb83eb3b2eafcce1f
            },
            {
                Header: Resources['total'][currentLanguage],
                accessor: 'total',
                sortabel: true,
                width: 200,
            },
<<<<<<< HEAD
=======
            {
                Header: Resources['docDate'][currentLanguage],
                accessor: 'docDate',
                sortabel: true,
                width: 250,
            },
>>>>>>> f6dd6eddb5eb6a4e8923973fb83eb3b2eafcce1f
        ];
        const updateVoPrices = (
            <Fragment>
                <div className="fullWidthWrapper">
                    <ReactTable
                        data={this.state.updateVoListData}
                        columns={updateVoList}
                        defaultPageSize={5}
                        noDataText={Resources['noData'][currentLanguage]}
                        className="-striped -highlight"
                    />
                    <hr />

                    {this.state.isLoading === false ? (
                        <button
                            className="primaryBtn-1 btn "
                            type="button"
                            onClick={this.executeVoChangePrices}>
                            {Resources.Execute[currentLanguage]}
                        </button>) : (
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
            </Fragment>
        );

        const BoqTypeContent = (
            <Fragment>
                <div className="dropWrapper">
                    {this.state.isLoading ? <LoadingSection /> : null}
                    <Formik
                        enableReinitialize={true}
                        initialValues={{ ...this.state.document }}
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
                            handleChange,
                        }) => (
                                <Form
                                    id="signupForm1"
                                    className="proForm datepickerContainer customProform"
                                    noValidate="novalidate">
                                    <Dropdown
                                        title="boqType"
                                        data={this.state.boqTypes}
                                        selectedValue={
                                            this.state.selectedBoqTypeEdit
                                        }
                                        handleChange={event =>
                                            this.handleChangeItemDropDownItems(
                                                event,
                                                'boqTypeId',
                                                'selectedBoqTypeEdit',
                                                true,
                                                'GetAllBoqChild',
                                                'parentId',
                                                'BoqTypeChilds',
                                            )
                                        }
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.boqType}
                                        touched={touched.boqType}
                                        name="boqType"
                                        index="boqType"
                                    />
                                    <Dropdown
                                        title="boqTypeChild"
                                        data={this.state.BoqTypeChilds}
                                        selectedValue={
                                            this.state.selectedBoqTypeChildEdit
                                        }
                                        handleChange={event =>
                                            this.handleChangeItemDropDownItems(
                                                event,
                                                'boqTypeChildId',
                                                'selectedBoqTypeChildEdit',
                                                true,
                                                'GetAllBoqChild',
                                                'parentId',
                                                'BoqSubTypes',
                                            )
                                        }
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
                                        handleChange={event =>
                                            this.handleChangeItemDropDownItems(
                                                event,
                                                'boqSubTypeId',
                                                'selectedBoqSubTypeEdit',
                                                false,
                                                '',
                                                '',
                                                '',
                                            )
                                        }
                                        onChange={setFieldValue}
                                        onBlur={setFieldTouched}
                                        error={errors.boqSubType}
                                        touched={touched.boqSubType}
                                        name="boqSubType"
                                        index="boqSubType"
                                    />
                                    <div className={'slider-Btns fullWidthWrapper'}>
                                        <button
                                            className={
                                                this.state.isViewMode === true
                                                    ? 'primaryBtn-1 btn  disNone'
                                                    : 'primaryBtn-1 btn '
                                            }
                                            type="submit">
                                            {Resources['save'][currentLanguage]}
                                        </button>
                                    </div>
                                </Form>
                            )}
                    </Formik>
                </div>
            </Fragment>
        );

        let interimTable = this.state.interimInvoicedTable.map(i => (
            <tr key={i.id}>
                {i.comment == 'True' ? (
                    <td colSpan="3">
                        <div className="contentCell tableCell-2">
                            <a>
                                {i.description != null
                                    ? i.description.slice(
                                        0,
                                        i.description.lastIndexOf('-') == -1
                                            ? i.description.length
                                            : i.description.lastIndexOf('-'),
                                    )
                                    : ''}
                            </a>
                        </div>
                    </td>
                ) : (
                        <Fragment>
                            <td colSpan="3">
                                <div className="contentCell tableCell-2">
                                    <a data-toggle="tooltip" title={i.description}>
                                        {i.description}
                                    </a>
                                </div>
                            </td>
                            <td colSpan="1">
                                <div className="contentCell">
                                    {i.prevoiuse != null
                                        ? parseFloat(i.prevoiuse)
                                            .toFixed(2)
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        : 0}
                                </div>
                            </td>
                            <td colSpan="1">
                                <div className="contentCell">
                                    {i.currentValue != null
                                        ? parseFloat(i.currentValue.toString())
                                            .toFixed(2)
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        : 0}
                                </div>
                            </td>
                            <td colSpan="1">
                                <div className="contentCell">
                                    {i.total != null
                                        ? parseFloat(i.total.toString())
                                            .toFixed(2)
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        : 0}
                                </div>
                            </td>
                            <td colSpan="1">
                                <div className="contentCell">
                                    {i.contractorPrevoiuse != null
                                        ? parseFloat(i.contractorPrevoiuse)
                                            .toFixed(2)
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        : 0}
                                </div>
                            </td>
                            <td colSpan="1">
                                <div className="contentCell">
                                    {i.contractorCurrentValue != null
                                        ? parseFloat(
                                            i.contractorCurrentValue.toString(),
                                        )
                                            .toFixed(2)
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        : 0}
                                </div>
                            </td>
                            <td colSpan="1">
                                <div className="contentCell">
                                    {i.contractorTotal != null
                                        ? parseFloat(i.contractorTotal.toString())
                                            .toFixed(2)
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                        : 0}
                                </div>
                            </td>
                            <td colSpan="3">
                                <div className="contentCell">{i.comment}</div>
                            </td>
                        </Fragment>
                    )}
            </tr>
        ));

        let viewHistory = (
            <div className="doc-pre-cycle">
                <table className="attachmentTable" key="DeductionsCertificate">
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>
                                <div className="headCell">
                                    {Resources['description'][currentLanguage]}
                                </div>
                            </th>
                            <th style={{ width: '10%' }}>
                                <div className="headCell">
                                    {
                                        Resources['completedQuantity'][
                                        currentLanguage
                                        ]
                                    }
                                </div>
                            </th>
                            <th style={{ width: '10%' }}>
                                <div className="headCell">
                                    {
                                        Resources['paymentPercent'][
                                        currentLanguage
                                        ]
                                    }
                                </div>
                            </th>
                            <th style={{ width: '10%' }}>
                                <div className="headCell">
                                    {Resources['addedBy'][currentLanguage]}
                                </div>
                            </th>
                            <th style={{ width: '10%' }}>
                                <div className="headCell">
                                    {Resources['addedDate'][currentLanguage]}
                                </div>
                            </th>
                            <th style={{ width: '10%' }}>
                                <div className="headCell">
                                    {Resources['comment'][currentLanguage]}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.paymentRequestItemsHistory.map(i => (
                            <tr key={i.id}>
                                <Fragment>
                                    <td style={{ width: '50%' }}>
                                        <div className="contentCell">
                                            {i.description}
                                        </div>
                                    </td>
                                    <td style={{ width: '50%' }}>
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
                                            {moment(i.addedDate).format(
                                                'YYYY-MM-DD',
                                            )}
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

        let approvedSummaries =
            <div style={{ position: "relative" }}>
                {this.state.approvedSummaryLoading === false ? (
                    <Fragment>
                        <header>
                            <h2 className="zero">
                                {
                                    Resources['summaryOfApprovedInvoices'][
                                    currentLanguage
                                    ]
                                }
                            </h2>
                        </header>
                        {btnExportApprovedInvoices}
                        <div style={{ maxWidth: '100%', overflowX: 'scroll' }}>
                            <table
                                className="attachmentTable attachmentTableAuto"
                                key="summaryOfApprovedInvoices">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className="headCell">
                                                {
                                                    Resources['JobBuilding'][
                                                    currentLanguage
                                                    ]
                                                }
                                            </div>
                                        </th>
                                        {this.state.approvedInvoicesParent.map(
                                            (i, index) => (
                                                <th
                                                    key={
                                                        'th-approvedInvoicesParent' +
                                                        index
                                                    }>
                                                    <div className="headCell">
                                                        {i.details
                                                            ? i.details.slice(
                                                                0,
                                                                i.details.lastIndexOf(
                                                                    '-',
                                                                ),
                                                            )
                                                            : ''}
                                                    </div>
                                                </th>
                                            ),
                                        )}
                                        <th>
                                            <div className="headCell">
                                                {
                                                    Resources['total'][
                                                    currentLanguage
                                                    ]
                                                }
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.approvedInvoicesChilds.map(
                                        (i, idx) => (
                                            <tr
                                                key={
                                                    'tr-approvedInvoicesChilds-' +
                                                    idx
                                                }>
                                                <td>{i.building}</td>

                                                {this.state.approvedInvoicesParent.map(
                                                    (data, index) => (
                                                        <td
                                                            key={
                                                                'td-approvedInvoicesParent-' +
                                                                index
                                                            }>
                                                            {parseFloat(
                                                                i[data.details],
                                                            )
                                                                .toFixed(2)
                                                                .replace(
                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                    ',',
                                                                )}
                                                        </td>
                                                    ),
                                                )}
                                                <td>
                                                    {parseFloat(i.rowTotal)
                                                        .toFixed(2)
                                                        .replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ' ,',
                                                        )}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Fragment>
                ) : (
                        <LoadingSection isCustomLoader={true} />
                    )}
            </div>
        return (
            <div className="mainContainer">
                <div
                    className={
                        this.state.isViewMode === true
                            ? 'documents-stepper noTabs__document one__tab one_step readOnly_inputs'
                            : 'documents-stepper noTabs__document one__tab one_step'
                    }>
                    <HeaderDocument
                        projectName={projectName}
                        isViewMode={this.state.isViewMode}
                        perviousRoute={this.state.perviousRoute}
                        docTitle={
                            Resources.paymentRequisitions[currentLanguage]
                        }
                        moduleTitle={Resources['contracts'][currentLanguage]}
                    />
                    <div className="doc-container">
                        <div className="step-content">
                            <div
                                className="rowsPaginations readOnly__disabled "
                                style={{ justifyContent: 'spaceBetween' }}>
                                {this.state.document.previousId > 0 &&
                                    this.state.docId > 0 ? (
                                        <button
                                            className="rowunActive"
                                            title="Prevoius Payment"
                                            style={{ borderRadius: '20px' }}>
                                            <i
                                                className="angle left icon"
                                                onClick={() =>
                                                    this.getById(
                                                        this.state.document
                                                            .previousId,
                                                    )
                                                }></i>
                                        </button>
                                    ) : null}
                                {this.state.document.nextId > 0 &&
                                    this.state.docId > 0 ? (
                                        <button
                                            className="rowunActive"
                                            title="Next Payment"
                                            style={{ borderRadius: '20px' }}>
                                            <i
                                                className="angle right icon"
                                                onClick={() =>
                                                    this.getById(
                                                        this.state.document.nextId,
                                                    )
                                                }></i>
                                        </button>
                                    ) : null}
                            </div>
                            {this.state.currentStep == 0 ? (
                                <Fragment>
                                    <div
                                        id="step1"
                                        className="step-content-body">
                                        <div className="subiTabsContent">
                                            <div className="document-fields">
                                                <Formik
                                                    initialValues={{
                                                        ...this.state.document,
                                                    }}
                                                    validationSchema={
                                                        validationSchema
                                                    }
                                                    enableReinitialize={true}
                                                    onSubmit={values => {
                                                        if (
                                                            this.props.showModal
                                                        ) {
                                                            return;
                                                        }

                                                        if (
                                                            this.props
                                                                .changeStatus ===
                                                            false &&
                                                            this.state.docId ===
                                                            0
                                                        ) {
                                                            this.savePaymentRequistion();
                                                        } else {
                                                            this.editPaymentRequistion();
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
                                                    }) => (
                                                            <Form
                                                                id="RequestPaymentForm"
                                                                className="customProform"
                                                                noValidate="novalidate"
                                                                onSubmit={
                                                                    handleSubmit
                                                                }>
                                                                <div className="proForm first-proform">
                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">
                                                                            {
                                                                                Resources
                                                                                    .subject[
                                                                                currentLanguage
                                                                                ]
                                                                            }
                                                                        </label>
                                                                        <div
                                                                            className={
                                                                                'inputDev ui input' +
                                                                                (errors.subject &&
                                                                                    touched.subject
                                                                                    ? ' has-error'
                                                                                    : !errors.subject &&
                                                                                        touched.subject
                                                                                        ? ' has-success'
                                                                                        : ' ')
                                                                            }>
                                                                            <input
                                                                                name="subject"
                                                                                className="form-control fsadfsadsa"
                                                                                id="subject"
                                                                                placeholder={
                                                                                    Resources
                                                                                        .subject[
                                                                                    currentLanguage
                                                                                    ]
                                                                                }
                                                                                autoComplete="off"
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .document
                                                                                        .subject
                                                                                }
                                                                                onBlur={e => {
                                                                                    handleBlur(
                                                                                        e,
                                                                                    );
                                                                                    handleChange(
                                                                                        e,
                                                                                    );
                                                                                }}
                                                                                onChange={e =>
                                                                                    this.handleChange(
                                                                                        e,
                                                                                        'subject',
                                                                                    )
                                                                                }
                                                                            />
                                                                            {touched.subject ? (
                                                                                <em className="pError">
                                                                                    {' '}
                                                                                    {
                                                                                        errors.subject
                                                                                    }{' '}
                                                                                </em>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">
                                                                            {
                                                                                Resources
                                                                                    .status[
                                                                                currentLanguage
                                                                                ]
                                                                            }
                                                                        </label>
                                                                        <div className="ui checkbox radio radioBoxBlue">
                                                                            <input
                                                                                type="radio"
                                                                                name="letter-status"
                                                                                defaultChecked={
                                                                                    this
                                                                                        .state
                                                                                        .document
                                                                                        .status ===
                                                                                        false
                                                                                        ? null
                                                                                        : 'checked'
                                                                                }
                                                                                value="true"
                                                                                onChange={e =>
                                                                                    this.handleChange(
                                                                                        e,
                                                                                        'status',
                                                                                    )
                                                                                }
                                                                            />
                                                                            <label>
                                                                                {
                                                                                    Resources
                                                                                        .oppened[
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
                                                                                    this
                                                                                        .state
                                                                                        .document
                                                                                        .status ===
                                                                                        false
                                                                                        ? 'checked'
                                                                                        : null
                                                                                }
                                                                                value="false"
                                                                                onChange={e =>
                                                                                    this.handleChange(
                                                                                        e,
                                                                                        'status',
                                                                                    )
                                                                                }
                                                                            />
                                                                            <label>
                                                                                {
                                                                                    Resources
                                                                                        .closed[
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
                                                                            onChange={e =>
                                                                                setFieldValue(
                                                                                    'docDate',
                                                                                    e,
                                                                                )
                                                                            }
                                                                            onBlur={
                                                                                setFieldTouched
                                                                            }
                                                                            error={
                                                                                errors.docDate
                                                                            }
                                                                            touched={
                                                                                touched.docDate
                                                                            }
                                                                            name="docDate"
                                                                            startDate={
                                                                                this
                                                                                    .state
                                                                                    .document
                                                                                    .docDate
                                                                            }
                                                                            handleChange={e =>
                                                                                this.handleChangeDate(
                                                                                    e,
                                                                                    'docDate',
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="linebylineInput  account__checkbox">
                                                                        <div className="linebylineInput valid-input">
                                                                            <label className="control-label">
                                                                                {
                                                                                    Resources
                                                                                        .collectedStatus[
                                                                                    currentLanguage
                                                                                    ]
                                                                                }
                                                                            </label>
                                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                                <input
                                                                                    type="radio"
                                                                                    name="PR-collected"
                                                                                    defaultChecked={
                                                                                        this
                                                                                            .state
                                                                                            .document
                                                                                            .collected ===
                                                                                            0
                                                                                            ? null
                                                                                            : 'checked'
                                                                                    }
                                                                                    value="1"
                                                                                    onChange={e =>
                                                                                        this.handleChange(
                                                                                            e,
                                                                                            'collected',
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
                                                                                    name="PR-collected"
                                                                                    defaultChecked={
                                                                                        this
                                                                                            .state
                                                                                            .document
                                                                                            .collected ===
                                                                                            0
                                                                                            ? 'checked'
                                                                                            : null
                                                                                    }
                                                                                    value="0"
                                                                                    onChange={e =>
                                                                                        this.handleChange(
                                                                                            e,
                                                                                            'collected',
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

                                                                        <div className="linebylineInput valid-input">
                                                                            <label className="control-label">
                                                                                {
                                                                                    Resources
                                                                                        .useCommulative[
                                                                                    currentLanguage
                                                                                    ]
                                                                                }
                                                                            </label>
                                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                                <input
                                                                                    type="radio"
                                                                                    name="PR-useCommulativeValue"
                                                                                    defaultChecked={
                                                                                        this
                                                                                            .state
                                                                                            .document
                                                                                            .useCommulativeValue ===
                                                                                            false
                                                                                            ? null
                                                                                            : 'checked'
                                                                                    }
                                                                                    value="true"
                                                                                    onChange={e =>
                                                                                        this.handleChange(
                                                                                            e,
                                                                                            'useCommulativeValue',
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
                                                                                    name="PR-useCommulativeValue"
                                                                                    defaultChecked={
                                                                                        this
                                                                                            .state
                                                                                            .document
                                                                                            .useCommulativeValue ===
                                                                                            false
                                                                                            ? 'checked'
                                                                                            : null
                                                                                    }
                                                                                    value="false"
                                                                                    onChange={e =>
                                                                                        this.handleChange(
                                                                                            e,
                                                                                            'useCommulativeValue',
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

                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">
                                                                            {
                                                                                Resources
                                                                                    .arrange[
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
                                                                                    this
                                                                                        .state
                                                                                        .document
                                                                                        .arrange ||
                                                                                    1
                                                                                }
                                                                                name="arrange"
                                                                                placeholder={
                                                                                    Resources
                                                                                        .arrange[
                                                                                    currentLanguage
                                                                                    ]
                                                                                }
                                                                                onBlur={e => {
                                                                                    handleChange(
                                                                                        e,
                                                                                    );
                                                                                    handleBlur(
                                                                                        e,
                                                                                    );
                                                                                }}
                                                                                onChange={e =>
                                                                                    this.handleChange(
                                                                                        e,
                                                                                        'arrange',
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {this.props
                                                                        .changeStatus ===
                                                                        true ? (
                                                                            <div className="proForm first-proform letterFullWidth proform__twoInput">
                                                                                <div className="linebylineInput valid-input">
                                                                                    <label className="control-label">
                                                                                        {
                                                                                            Resources
                                                                                                .contractName[
                                                                                            currentLanguage
                                                                                            ]
                                                                                        }
                                                                                    </label>
                                                                                    <div className="ui input inputDev">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            id="contractSubject"
                                                                                            readOnly
                                                                                            value={
                                                                                                this
                                                                                                    .state
                                                                                                    .document
                                                                                                    .contractName
                                                                                            }
                                                                                            name="contractSubject"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="linebylineInput valid-input">
                                                                                <Dropdown
                                                                                    title="contractName"
                                                                                    data={
                                                                                        this
                                                                                            .state
                                                                                            .contractsPos
                                                                                    }
                                                                                    selectedValue={
                                                                                        this
                                                                                            .state
                                                                                            .selectContract
                                                                                    }
                                                                                    handleChange={event =>
                                                                                        this.handleChangeDropDownContract(
                                                                                            event,
                                                                                            'contractId',
                                                                                            'selectContract',
                                                                                        )
                                                                                    }
                                                                                    index="contractId"
                                                                                    onChange={
                                                                                        setFieldValue
                                                                                    }
                                                                                    onBlur={
                                                                                        setFieldTouched
                                                                                    }
                                                                                    error={
                                                                                        errors.contractId
                                                                                    }
                                                                                    touched={
                                                                                        touched.contractId
                                                                                    }
                                                                                    isClear={
                                                                                        false
                                                                                    }
                                                                                    name="contractId"
                                                                                    id="contractId"
                                                                                    classDrop="contractId"
                                                                                />
                                                                            </div>
                                                                        )}
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
                                                                                'ui input inputDev' +
                                                                                (errors.advancePaymentPercent &&
                                                                                    touched.advancePaymentPercent
                                                                                    ? ' has-error'
                                                                                    : 'ui input inputDev')
                                                                            }>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .document
                                                                                        .advancePaymentPercent ||
                                                                                    '0'
                                                                                }
                                                                                name="advancePaymentPercent"
                                                                                placeholder={
                                                                                    Resources
                                                                                        .advancePaymentPercent[
                                                                                    currentLanguage
                                                                                    ]
                                                                                }
                                                                                onBlur={e => {
                                                                                    handleChange(
                                                                                        e,
                                                                                    );
                                                                                    handleBlur(
                                                                                        e,
                                                                                    );
                                                                                }}
                                                                                onChange={e =>
                                                                                    this.handleChange(
                                                                                        e,
                                                                                        'advancePaymentPercent',
                                                                                    )
                                                                                }
                                                                            />
                                                                            {touched.advancePaymentPercent ? (
                                                                                <em className="pError">
                                                                                    {' '}
                                                                                    {
                                                                                        errors.advancePaymentPercent
                                                                                    }{' '}
                                                                                </em>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">
                                                                            {
                                                                                Resources
                                                                                    .retainagePercent[
                                                                                currentLanguage
                                                                                ]
                                                                            }
                                                                        </label>
                                                                        <div
                                                                            className={
                                                                                'ui input inputDev' +
                                                                                (errors.retainagePercent &&
                                                                                    touched.retainagePercent
                                                                                    ? ' has-error'
                                                                                    : 'ui input inputDev')
                                                                            }>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                id="retainagePercent"
                                                                                name="retainagePercent"
                                                                                readOnly
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .document
                                                                                        .retainagePercent ||
                                                                                    ''
                                                                                }
                                                                                placeholder={
                                                                                    Resources
                                                                                        .retainagePercent[
                                                                                    currentLanguage
                                                                                    ]
                                                                                }
                                                                                onBlur={e => {
                                                                                    handleChange(
                                                                                        e,
                                                                                    );
                                                                                    handleBlur(
                                                                                        e,
                                                                                    );
                                                                                }}
                                                                                onChange={e =>
                                                                                    this.handleChange(
                                                                                        e,
                                                                                        'retainagePercent',
                                                                                    )
                                                                                }
                                                                            />
                                                                            {touched.retainagePercent ? (
                                                                                <em className="pError">
                                                                                    {' '}
                                                                                    {
                                                                                        errors.retainagePercent
                                                                                    }{' '}
                                                                                </em>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">
                                                                            {
                                                                                Resources
                                                                                    .tax[
                                                                                currentLanguage
                                                                                ]
                                                                            }
                                                                        </label>
                                                                        <div
                                                                            className={
                                                                                'ui input inputDev' +
                                                                                (errors.tax &&
                                                                                    touched.tax
                                                                                    ? ' has-error'
                                                                                    : 'ui input inputDev')
                                                                            }>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                id="tax"
                                                                                name="tax"
                                                                                readOnly
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .document
                                                                                        .tax ||
                                                                                    ''
                                                                                }
                                                                                placeholder={
                                                                                    Resources
                                                                                        .tax[
                                                                                    currentLanguage
                                                                                    ]
                                                                                }
                                                                                onBlur={e => {
                                                                                    handleChange(
                                                                                        e,
                                                                                    );
                                                                                    handleBlur(
                                                                                        e,
                                                                                    );
                                                                                }}
                                                                                onChange={e =>
                                                                                    this.handleChange(
                                                                                        e,
                                                                                        'tax',
                                                                                    )
                                                                                }
                                                                            />
                                                                            {touched.tax ? (
                                                                                <em className="pError">
                                                                                    {' '}
                                                                                    {
                                                                                        errors.tax
                                                                                    }{' '}
                                                                                </em>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">
                                                                            {
                                                                                Resources
                                                                                    .vat[
                                                                                currentLanguage
                                                                                ]
                                                                            }
                                                                        </label>
                                                                        <div
                                                                            className={
                                                                                'ui input inputDev' +
                                                                                (errors.vat &&
                                                                                    touched.vat
                                                                                    ? ' has-error'
                                                                                    : 'ui input inputDev')
                                                                            }>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                id="vat"
                                                                                name="vat"
                                                                                readOnly
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .document
                                                                                        .vat ||
                                                                                    ''
                                                                                }
                                                                                placeholder={
                                                                                    Resources
                                                                                        .vat[
                                                                                    currentLanguage
                                                                                    ]
                                                                                }
                                                                                onBlur={e => {
                                                                                    handleChange(
                                                                                        e,
                                                                                    );
                                                                                    handleBlur(
                                                                                        e,
                                                                                    );
                                                                                }}
                                                                                onChange={e =>
                                                                                    this.handleChange(
                                                                                        e,
                                                                                        'vat',
                                                                                    )
                                                                                }
                                                                            />
                                                                            {touched.vat ? (
                                                                                <em className="pError">
                                                                                    {' '}
                                                                                    {
                                                                                        errors.vat
                                                                                    }{' '}
                                                                                </em>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">
                                                                            {
                                                                                Resources
                                                                                    .insurance[
                                                                                currentLanguage
                                                                                ]
                                                                            }
                                                                        </label>
                                                                        <div
                                                                            className={
                                                                                'ui input inputDev' +
                                                                                (errors.insurance &&
                                                                                    touched.insurance
                                                                                    ? ' has-error'
                                                                                    : 'ui input inputDev')
                                                                            }>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                id="insurance"
                                                                                name="insurance"
                                                                                readOnly
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .document
                                                                                        .insurance ||
                                                                                    ''
                                                                                }
                                                                                placeholder={
                                                                                    Resources
                                                                                        .insurance[
                                                                                    currentLanguage
                                                                                    ]
                                                                                }
                                                                                onBlur={e => {
                                                                                    handleChange(
                                                                                        e,
                                                                                    );
                                                                                    handleBlur(
                                                                                        e,
                                                                                    );
                                                                                }}
                                                                                onChange={e =>
                                                                                    this.handleChange(
                                                                                        e,
                                                                                        'insurance',
                                                                                    )
                                                                                }
                                                                            />
                                                                            {touched.insurance ? (
                                                                                <em className="pError">
                                                                                    {' '}
                                                                                    {
                                                                                        errors.insurance
                                                                                    }{' '}
                                                                                </em>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>

                                                                    {this.props
                                                                        .changeStatus ? (
                                                                            <Fragment>
                                                                                <div className="linebylineInput valid-input">
                                                                                    <label className="control-label">
                                                                                        {
                                                                                            Resources
                                                                                                .actualPayment[
                                                                                            currentLanguage
                                                                                            ]
                                                                                        }
                                                                                    </label>
                                                                                    <div
                                                                                        className={
                                                                                            'ui input inputDev' +
                                                                                            (errors.actualPayment &&
                                                                                                touched.actualPayment
                                                                                                ? ' has-error'
                                                                                                : 'ui input inputDev')
                                                                                        }>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            id="actualPayment"
                                                                                            name="actualPayment"
                                                                                            value={
                                                                                                this
                                                                                                    .state
                                                                                                    .document
                                                                                                    .actualPayment ||
                                                                                                ''
                                                                                            }
                                                                                            placeholder={
                                                                                                Resources
                                                                                                    .actualPayment[
                                                                                                currentLanguage
                                                                                                ]
                                                                                            }
                                                                                            onBlur={e => {
                                                                                                handleChange(
                                                                                                    e,
                                                                                                );
                                                                                                handleBlur(
                                                                                                    e,
                                                                                                );
                                                                                            }}
                                                                                            onChange={e =>
                                                                                                this.handleChange(
                                                                                                    e,
                                                                                                    'actualPayment',
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                        {touched.actualPayment ? (
                                                                                            <em className="pError">
                                                                                                {' '}
                                                                                                {
                                                                                                    errors.actualPayment
                                                                                                }{' '}
                                                                                            </em>
                                                                                        ) : null}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="linebylineInput valid-input">
                                                                                    <label className="control-label">
                                                                                        {
                                                                                            Resources
                                                                                                .remainingPayment[
                                                                                            currentLanguage
                                                                                            ]
                                                                                        }
                                                                                    </label>
                                                                                    <div className="ui input inputDev">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            name="remainingPayment"
                                                                                            value={
                                                                                                this
                                                                                                    .state
                                                                                                    .document
                                                                                                    .remainingPayment ||
                                                                                                '0'
                                                                                            }
                                                                                            placeholder={
                                                                                                Resources
                                                                                                    .remainingPayment[
                                                                                                currentLanguage
                                                                                                ]
                                                                                            }
                                                                                            onChange={e =>
                                                                                                this.handleChange(
                                                                                                    e,
                                                                                                    'remainingPayment',
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="linebylineInput valid-input">
                                                                                    <label className="control-label">
                                                                                        {
                                                                                            Resources
                                                                                                .advancedPaymentAmount[
                                                                                            currentLanguage
                                                                                            ]
                                                                                        }
                                                                                    </label>
                                                                                    <div className="ui input inputDev">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            name="advancedPaymentAmount"
                                                                                            value={
                                                                                                this
                                                                                                    .state
                                                                                                    .document
                                                                                                    .advancedPaymentAmount ||
                                                                                                '0'
                                                                                            }
                                                                                            placeholder={
                                                                                                Resources
                                                                                                    .advancedPaymentAmount[
                                                                                                currentLanguage
                                                                                                ]
                                                                                            }
                                                                                            onChange={e =>
                                                                                                this.handleChange(
                                                                                                    e,
                                                                                                    'advancedPaymentAmount',
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </Fragment>
                                                                        ) : null}
                                                                </div>
                                                                <div className="slider-Btns slider-Btns--menu">
                                                                    {this.state
                                                                        .isLoading ===
                                                                        false ? (
                                                                            this.showBtnsSaving()
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

                                                                    {this.props
                                                                        .changeStatus ===
                                                                        true ? (
                                                                            this.state
                                                                                .userType !=
                                                                                'user' ? (
                                                                                    <div
                                                                                        className="default__dropdown"
                                                                                        style={{
                                                                                            minWidth:
                                                                                                '225px',
                                                                                        }}>
                                                                                        <Dropdown
                                                                                            data={
                                                                                                this
                                                                                                    .state
                                                                                                    .fillDropDown
                                                                                            }
                                                                                            selectedValue={
                                                                                                this
                                                                                                    .state
                                                                                                    .selectedDropDown
                                                                                            }
                                                                                            handleChange={event => {
                                                                                                this.handleDropAction(
                                                                                                    event,
                                                                                                );
                                                                                            }}
                                                                                            onChange={
                                                                                                setFieldValue
                                                                                            }
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
                                                    {this.state.docId > 0 ? (
                                                        <UploadAttachment
                                                            changeStatus={
                                                                this.props
                                                                    .changeStatus
                                                            }
                                                            AddAttachments={
                                                                3017
                                                            }
                                                            EditAttachments={
                                                                3258
                                                            }
                                                            ShowDropBox={3575}
                                                            ShowGoogleDrive={
                                                                3576
                                                            }
                                                            docTypeId={
                                                                this.state
                                                                    .docTypeId
                                                            }
                                                            docId={
                                                                this.state.docId
                                                            }
                                                            projectId={
                                                                this.state
                                                                    .projectId
                                                            }
                                                        />
                                                    ) : null}
                                                    {this.viewAttachments()}
                                                    {this.props.changeStatus ===
                                                        true ? (
                                                            <ViewWorkFlow
                                                                docType={
                                                                    this.state
                                                                        .docTypeId
                                                                }
                                                                docId={
                                                                    this.state.docId
                                                                }
                                                                projectId={
                                                                    this.state
                                                                        .projectId
                                                                }
                                                            />
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
                                                        {
                                                            Resources[
                                                            'actualPayment'
                                                            ][currentLanguage]
                                                        }
                                                    </h2>
                                                </header>
                                                <div className="inpuBtn proForm">
                                                    <div className="linebylineInput valid-input ">
                                                        <label className="control-label">
                                                            {
                                                                Resources
                                                                    .actualPayment[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                        <div className="ui input inputDev">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="actualPayment"
                                                                value={
                                                                    this.state
                                                                        .actualPayments
                                                                }
                                                                placeholder={
                                                                    Resources
                                                                        .actualPayment[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                                onChange={event =>
                                                                    this.setState(
                                                                        {
                                                                            actualPayments:
                                                                                event
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    {this.state
                                                        .viewUpdatePayment ? (
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
                                                            <button
                                                                className="primaryBtn-1 btn meduimBtn"
                                                                onClick={
                                                                    this
                                                                        .updateActualPayments
                                                                }>
                                                                {
                                                                    Resources[
                                                                    'update'
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
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
                                                            {this.state
                                                                .isViewMode !==
                                                                true ? (
                                                                    <button
                                                                        className="primaryBtn-1 btn meduimBtn"
                                                                        onClick={
                                                                            this
                                                                                .updatePayemtWithVariationOrderByAdmin
                                                                        }>
                                                                        {
                                                                            Resources[
                                                                            'recalculateWithVariation'
                                                                            ][
                                                                            currentLanguage
                                                                            ]
                                                                        }
                                                                    </button>
                                                                ) : null}
                                                        </div>
                                                    )}
                                            </div>
                                        ) : (
                                                ''
                                            )}
                                        <div className="doc-pre-cycle">
                                            <div className="submittalFilter readOnly__disabled">
                                                <div className="subFilter">
                                                    <h3 className="zero">
                                                        {
                                                            Resources[
                                                            'AddedItems'
                                                            ][currentLanguage]
                                                        }
                                                    </h3>
                                                    <span>
                                                        {this.state
                                                            .paymentsItems
                                                            .length +
                                                            ' Of ' +
                                                            this.state.noItems}
                                                    </span>
                                                </div>

                                                <div className="filterBTNS">
                                                    <div
                                                        className="default__dropdown--custom"
                                                        style={{
                                                            marginBottom: '0',
                                                        }}>
                                                        <div className="default__dropdown">
                                                            <Dropdown
                                                                data={
                                                                    this.state
                                                                        .fillDropDownExport
                                                                }
                                                                selectedValue={
                                                                    this.state
                                                                        .selectedDropDownExport
                                                                }
                                                                handleChange={event =>
                                                                    this.handleDropActionForExportFile(
                                                                        event,
                                                                    )
                                                                }
                                                                index="contractId"
                                                                name="contractId"
                                                                styles={
                                                                    actionPanel
                                                                }
                                                            />
                                                            <div
                                                                style={{
                                                                    display:
                                                                        'none',
                                                                }}>
                                                                {
                                                                    this.state
                                                                        .exportFile
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="rowsPaginations readOnly__disabled">
                                                    <button
                                                        className={
                                                            this.state
                                                                .pageNumber == 0
                                                                ? 'rowunActive'
                                                                : ''
                                                        }
                                                        onClick={() =>
                                                            this.GetPrevoiusData()
                                                        }>
                                                        <i className="angle left icon" />
                                                    </button>
                                                    <button
                                                        className={
                                                            this.state
                                                                .noItems !==
                                                                this.state
                                                                    .pageSize *
                                                                this.state
                                                                    .pageNumber +
                                                                this.state
                                                                    .pageSize
                                                                ? 'rowunActive'
                                                                : ''
                                                        }
                                                        disabled={
                                                            this.state
                                                                .noItems !==
                                                                this.state
                                                                    .pageSize *
                                                                this.state
                                                                    .pageNumber +
                                                                this.state
                                                                    .pageSize
                                                                ? ''
                                                                : 'disabled'
                                                        }
                                                        onClick={() =>
                                                            this.GetNextData()
                                                        }>
                                                        <i className="angle right icon" />
                                                    </button>
                                                </div>
                                            </div>
                                            {this.renderingGrid()}

                                            {this.state.editRows.length > 0 ? (
                                                <div className="doc-pre-cycle">
                                                    <div className="slider-Btns editableRows">
                                                        <span>
                                                            No.Update Rows.
                                                            {
                                                                this.state
                                                                    .editRows
                                                                    .length
                                                            }
                                                        </span>

                                                        {this.state
                                                            .isLoading ===
                                                            true ? (
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
                                                                <button
                                                                    className="primaryBtn-1 btn meduimBtn"
                                                                    onClick={e =>
                                                                        this.editRowsClick(
                                                                            e,
                                                                        )
                                                                    }>
                                                                    {
                                                                        Resources[
                                                                        'edit'
                                                                        ][
                                                                        currentLanguage
                                                                        ]
                                                                    }
                                                                </button>
                                                            )}
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
                                                    {
                                                        Resources[
                                                        'interimPaymentCertificate'
                                                        ][currentLanguage]
                                                    }
                                                </h2>
                                            </header>
                                            {btnExportInterimPayment}
                                            <table
                                                className="attachmentTable attachmentTableAuto specialTable tbl-load"
                                                key="interimPaymentCertificate" style={{ position: "relative",minHeight:this.state.interimInvoicesLoading==true?"250px":"auto" }} >
                                                <thead>
                                                    <tr>
                                                        <th colSpan="3">
                                                            <div className="headCell">
                                                                {
                                                                    Resources[
                                                                    'workDescription'
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </div>
                                                        </th>
                                                        <th colSpan="3">
                                                            <div className="headCell">
                                                                {
                                                                    Resources[
                                                                    'consultatnt'
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </div>
                                                        </th>
                                                        <th colSpan="3">
                                                            <div className="headCell">
                                                                {
                                                                    Resources[
                                                                    'contractor'
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </div>
                                                        </th>
                                                        <th colSpan="3">
                                                            <div className="headCell">
                                                                {
                                                                    Resources[
                                                                    'comments'
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </div>
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan="3"></th>
                                                        <th colSpan="1">
                                                            <div className="headCell">
                                                                {
                                                                    Resources[
                                                                    'previous'
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </div>
                                                        </th>
                                                        <th colSpan="1">
                                                            <div className="headCell">
                                                                {
                                                                    Resources[
                                                                    'current'
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </div>
                                                        </th>
                                                        <th colSpan="1">
                                                            <div className="headCell">
                                                                {
                                                                    Resources[
                                                                    'total'
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </div>
                                                        </th>
                                                        <th colSpan="1">
                                                            <div className="headCell">
                                                                {
                                                                    Resources[
                                                                    'previous'
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </div>
                                                        </th>
                                                        <th colSpan="1">
                                                            <div className="headCell">
                                                                {
                                                                    Resources[
                                                                    'current'
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </div>
                                                        </th>
                                                        <th colSpan="1">
                                                            <div className="headCell">
                                                                {
                                                                    Resources[
                                                                    'total'
                                                                    ][
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </div>
                                                        </th>
                                                        <th colSpan="3"></th>
                                                    </tr>
                                                </thead>
                                                    {this.state.interimInvoicesLoading == false ?
                                                        <tbody>
                                                            {interimTable}
                                                        </tbody>
                                                        :  <LoadingSection isCustomLoader={true} />}
                                            </table>
                                            <div>
                                                <header>
                                                    <h2 className="zero">
                                                        {
                                                            Resources['summaryOfApprovedInvoices'][
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </h2>
                                                </header>
                                                {btnExportApprovedInvoices}
                                                <div style={{ maxWidth: '100%', overflowX: 'scroll' }}>
                                                    <table
                                                        className="attachmentTable attachmentTableAuto tbl-load"
                                                        key="summaryOfApprovedInvoices" style={{ position: "relative",minHeight:this.state.approvedSummaryLoading==true?"250px":"auto" }}>
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    <div className="headCell">
                                                                        {
                                                                            Resources['JobBuilding'][
                                                                            currentLanguage
                                                                            ]
                                                                        }
                                                                    </div>
                                                                </th>
                                                                {this.state.approvedInvoicesParent.map(
                                                                    (i, index) => (
                                                                        <th
                                                                            key={
                                                                                'th-approvedInvoicesParent' +
                                                                                index
                                                                            }>
                                                                            <div className="headCell">
                                                                                {i.details
                                                                                    ? i.details.slice(
                                                                                        0,
                                                                                        i.details.lastIndexOf(
                                                                                            '-',
                                                                                        ),
                                                                                    )
                                                                                    : ''}
                                                                            </div>
                                                                        </th>
                                                                    ),
                                                                )}
                                                                <th>
                                                                    <div className="headCell">
                                                                        {
                                                                            Resources['total'][
                                                                            currentLanguage
                                                                            ]
                                                                        }
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                            {this.state.approvedSummaryLoading == false ?
                                                                <tbody>
                                                                    {this.state.approvedInvoicesChilds.map(
                                                                        (i, idx) => (
                                                                            <tr
                                                                                key={
                                                                                    'tr-approvedInvoicesChilds-' +
                                                                                    idx
                                                                                }>
                                                                                <td>{i.building}</td>

                                                                                {this.state.approvedInvoicesParent.map(
                                                                                    (data, index) => (
                                                                                        <td
                                                                                            key={
                                                                                                'td-approvedInvoicesParent-' +
                                                                                                index
                                                                                            }>
                                                                                            {parseFloat(
                                                                                                i[data.details],
                                                                                            )
                                                                                                .toFixed(2)
                                                                                                .replace(
                                                                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                                                                    ',',
                                                                                                )}
                                                                                        </td>
                                                                                    ),
                                                                                )}
                                                                                <td>
                                                                                    {parseFloat(i.rowTotal)
                                                                                        .toFixed(2)
                                                                                        .replace(
                                                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                                                            ' ,',
                                                                                        )}
                                                                                </td>
                                                                            </tr>
                                                                        ),
                                                                    )}
                                                                </tbody>
                                                                : <LoadingSection isCustomLoader={true} />}
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            ) : null}

                            {this.state.currentStep == 2 ? (
                                <Fragment>
                                    <div className="subiTabsContent feilds__top">
                                        <header>
                                            <h2 className="zero">
                                                {
                                                    Resources['deductions'][
                                                    currentLanguage
                                                    ]
                                                }
                                            </h2>
                                        </header>
                                        <div className="document-fields">
                                            <Formik
                                                initialValues={{
                                                    ...this.state
                                                        .documentDeduction,
                                                }}
                                                validationSchema={
                                                    validationDeductionSchema
                                                }
                                                enableReinitialize={true}
                                                onSubmit={values => {
                                                    this.addDeduction();
                                                }}>
                                                {({
                                                    errors,
                                                    touched,
                                                    handleBlur,
                                                    handleChange,
                                                    handleSubmit,
                                                    setFieldValue,
                                                    setFieldTouched,
                                                }) => (
                                                        <Form
                                                            id="deductionForm"
                                                            className="customProform"
                                                            noValidate="novalidate"
                                                            onSubmit={handleSubmit}>
                                                            <div className="proForm datepickerContainer">
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">
                                                                        {
                                                                            Resources
                                                                                .description[
                                                                            currentLanguage
                                                                            ]
                                                                        }
                                                                    </label>
                                                                    <div className="ui input inputDev">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            id="title"
                                                                            name="title"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .documentDeduction
                                                                                    .title
                                                                            }
                                                                            placeholder={
                                                                                Resources
                                                                                    .description[
                                                                                currentLanguage
                                                                                ]
                                                                            }
                                                                            onBlur={e => {
                                                                                handleChange(
                                                                                    e,
                                                                                );
                                                                                handleBlur(
                                                                                    e,
                                                                                );
                                                                            }}
                                                                            onChange={e =>
                                                                                this.handleChangeItem(
                                                                                    e,
                                                                                    'title',
                                                                                )
                                                                            }
                                                                        />
                                                                        {touched.title ? (
                                                                            <em className="pError">
                                                                                {' '}
                                                                                {
                                                                                    errors.title
                                                                                }{' '}
                                                                            </em>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">
                                                                        {
                                                                            Resources
                                                                                .deductions[
                                                                            currentLanguage
                                                                            ]
                                                                        }
                                                                    </label>
                                                                    <div
                                                                        className={
                                                                            'ui input inputDev' +
                                                                            (errors.deductionValue &&
                                                                                touched.deductionValue
                                                                                ? ' has-error'
                                                                                : 'ui input inputDev')
                                                                        }>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            id="deductionValue"
                                                                            name="deductionValue"
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .documentDeduction
                                                                                    .deductionValue
                                                                            }
                                                                            placeholder={
                                                                                Resources
                                                                                    .deductions[
                                                                                currentLanguage
                                                                                ]
                                                                            }
                                                                            onBlur={e => {
                                                                                handleChange(
                                                                                    e,
                                                                                );
                                                                                handleBlur(
                                                                                    e,
                                                                                );
                                                                            }}
                                                                            onChange={e =>
                                                                                this.handleChangeItem(
                                                                                    e,
                                                                                    'deductionValue',
                                                                                )
                                                                            }
                                                                        />
                                                                        {touched.deductionValue ? (
                                                                            <em className="pError">
                                                                                {' '}
                                                                                {
                                                                                    errors.deductionValue
                                                                                }{' '}
                                                                            </em>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="deductionType"
                                                                        data={
                                                                            this
                                                                                .state
                                                                                .deductionTypesList
                                                                        }
                                                                        selectedValue={
                                                                            this
                                                                                .state
                                                                                .selectedDeductionType
                                                                        }
                                                                        handleChange={event =>
                                                                            this.handleChangeDropDownDeduction(
                                                                                event,
                                                                                'deductionTypeId',
                                                                                'selectedDeductionType',
                                                                            )
                                                                        }
                                                                        index="deductionTypeId"
                                                                        onChange={
                                                                            setFieldValue
                                                                        }
                                                                        onBlur={
                                                                            setFieldTouched
                                                                        }
                                                                        error={
                                                                            errors.deductionTypeId
                                                                        }
                                                                        touched={
                                                                            touched.deductionTypeId
                                                                        }
                                                                        isClear={
                                                                            false
                                                                        }
                                                                        name="deductionTypeId"
                                                                        id="deductionTypeId"
                                                                        classDrop="deductionTypeId"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="slider-Btns">
                                                                {this.state
                                                                    .isLoading ===
                                                                    false ? (
                                                                        this.state
                                                                            .document
                                                                            .editable ===
                                                                            true ? (
                                                                                <button className="primaryBtn-1 btn meduimBtn">
                                                                                    {
                                                                                        Resources[
                                                                                        'save'
                                                                                        ][
                                                                                        currentLanguage
                                                                                        ]
                                                                                    }
                                                                                </button>
                                                                            ) : this.state
                                                                                .addDeducation ? (
                                                                                    <button className="primaryBtn-1 btn meduimBtn">
                                                                                        {
                                                                                            Resources[
                                                                                            'save'
                                                                                            ][
                                                                                            currentLanguage
                                                                                            ]
                                                                                        }
                                                                                    </button>
                                                                                ) : null
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
                                                                {
                                                                    btnExportDeducation
                                                                }
                                                            </div>
                                                        </Form>
                                                    )}
                                            </Formik>
                                        </div>
                                        <div className="doc-pre-cycle">
                                            <ReactTable
                                                data={
                                                    this.state
                                                        .deductionObservableArray
                                                }
                                                columns={columns}
                                                defaultPageSize={5}
                                                noDataText={
                                                    Resources['noData'][
                                                    currentLanguage
                                                    ]
                                                }
                                                className="-striped -highlight"
                                            />
                                            <div className="slider-Btns">
                                                <button
                                                    className="primaryBtn-1 btn meduimBtn"
                                                    onClick={e =>
                                                        this.changeCurrentStep(
                                                            4,
                                                        )
                                                    }>
                                                    {
                                                        Resources['next'][
                                                        currentLanguage
                                                        ]
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            ) : null}
                        </div>
                        <Steps
                            steps_defination={steps_defination}
                            exist_link="/requestPayments/"
                            docId={this.state.docId}
                            changeCurrentStep={stepNo =>
                                this.changeCurrentStep(stepNo)
                            }
                            stepNo={this.state.currentStep}
                            changeStatus={docId === 0 ? false : true}
                        />

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
                <div
                    className="largePopup largeModal "
                    style={{
                        display: this.state.updateVoPricesModal
                            ? 'block'
                            : 'none',
                    }}>
                    <SkyLight
                        hideOnOverlayClicked
                        ref={ref => (this.updateVoPricesModal = ref)}
                        title={Resources.updatePrices[currentLanguage]}>
                        {updateVoPrices}
                    </SkyLight>
                </div>
                <div
                    className="largePopup largeModal "
                    style={{
                        display: this.state.showBoqModal ? 'block' : 'none',
                    }}>
                    <SkyLight
                        hideOnOverlayClicked
                        ref={ref => (this.boqTypeModal = ref)}
                        title={Resources.boqType[currentLanguage]}>
                        {BoqTypeContent}
                    </SkyLight>
                </div>
                {/* Edit Comment of Grid */}
                <div
                    className="largePopup largeModal "
                    style={{
                        display: this.state.showCommentModal ? 'block' : 'none',
                    }}>
                    <SkyLight
                        hideOnOverlayClicked
                        ref={ref => (this.commentModal = ref)}
                        title={Resources.comments[currentLanguage]}>
                        <div className="proForm">
                            <div className="dropWrapper">
                                <div className="letterFullWidth">
                                    <label className="control-label">
                                        {Resources.comment[currentLanguage]}
                                    </label>
                                    <div
                                        className="inputDev ui input"
                                        style={{ width: '100%' }}>
                                        <TextEditor
                                            value={this.state.comment}
                                            onChange={this.onChangeMessage.bind(
                                                this,
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="fullWidthWrapper">
                                    <button
                                        className="primaryBtn-1 btn "
                                        onClick={e => this.addCommentClick(e)}>
                                        {Resources.save[currentLanguage]}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SkyLight>
                </div>

                <div
                    className="largePopup largeModal "
                    style={{
                        display: this.state.showCostCodingTree
                            ? 'block'
                            : 'none',
                    }}>
                    <SkyLight
                        hideOnOverlayClicked
                        ref={ref => (this.costCodingTree = ref)}
                        title={Resources.comments[currentLanguage]}>
                        <div className="dropWrapper proForm">
                            <div className="fullWidthWrapper linebylineInput">
                                <label className="control-label">
                                    {Resources.costCodingTree[currentLanguage]}
                                </label>
                                <div className="shareLinks">
                                    <Dropdown
                                        data={this.state.fillDropDownTress}
                                        selectedValue={
                                            this.state.selectedDropDownTrees
                                        }
                                        handleChange={event =>
                                            this.handleDropTrees(event)
                                        }
                                        name="costCodingTree"
                                        index="costCodingTree"
                                    />
                                    <div
                                        style={{ marginLeft: '8px' }}
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
                            {this.state.treesLoader === false ? (
                                <ReactTable
                                    data={this.state.trees}
                                    columns={columnsTrees}
                                    defaultPageSize={5}
                                    noDataText={
                                        Resources['noData'][currentLanguage]
                                    }
                                    className="-striped -highlight"
                                />
                            ) : null}
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
                                    <button
                                        className="primaryBtn-1 btn  disabled"
                                        disabled="disabled">
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
                <div
                    className="largePopup largeModal "
                    style={{
                        display: this.state.viewPopUpRows ? 'block' : 'none',
                    }}>
                    <SkyLight
                        hideOnOverlayClicked
                        ref={ref => (this.addCommentModal = ref)}>
                        <Formik
                            initialValues={{ ...this.state.currentObject }}
                            validationSchema={validationItemsSchema}
                            enableReinitialize={true}
                            onSubmit={values => {
                                this.props.changeStatus === true
                                    ? this.editPaymentRequistionItems()
                                    : this.rowsUpdated();
                            }}>
                            {({
                                errors,
                                touched,
                                handleBlur,
                                handleChange,
                                handleSubmit,
                                setFieldValue,
                                setFieldTouched,
                            }) => (
                                    <Form
                                        id="RequestPaymentItemEditForm"
                                        className="customProform proForm"
                                        noValidate="novalidate"
                                        onSubmit={handleSubmit}>
                                        <div className="dropWrapper">
                                            {Config.IsAllow(3674) &&
                                                this.props.changeStatus == true ? (
                                                    <Fragment>
                                                        <div className="fillter-item-c fullInputWidth">
                                                            <label className="control-label">
                                                                {
                                                                    Resources
                                                                        .percentComplete[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </label>
                                                            <div
                                                                className={
                                                                    'inputDev ui input' +
                                                                    (errors.percentComplete &&
                                                                        touched.percentComplete
                                                                        ? ' has-error'
                                                                        : !errors.percentComplete &&
                                                                            touched.percentComplete
                                                                            ? ' has-success'
                                                                            : ' ')
                                                                }>
                                                                <input
                                                                    name="percentComplete"
                                                                    className="form-control fsadfsadsa"
                                                                    id="percentComplete"
                                                                    placeholder={
                                                                        Resources
                                                                            .percentComplete[
                                                                        currentLanguage
                                                                        ]
                                                                    }
                                                                    autoComplete="off"
                                                                    onBlur={e => {
                                                                        handleBlur(e);
                                                                        handleChange(e);
                                                                    }}
                                                                    value={
                                                                        this.state
                                                                            .currentObject
                                                                            .percentComplete
                                                                    }
                                                                    onChange={e =>
                                                                        this.handleChangeForEdit(
                                                                            e,
                                                                            'percentComplete',
                                                                        )
                                                                    }
                                                                />
                                                                {touched.percentComplete ? (
                                                                    <em className="pError">
                                                                        {' '}
                                                                        {
                                                                            errors.percentComplete
                                                                        }{' '}
                                                                    </em>
                                                                ) : null}
                                                            </div>
                                                        </div>

                                                        <div className="fillter-item-c fullInputWidth">
                                                            <label className="control-label">
                                                                {
                                                                    Resources
                                                                        .quantityComplete[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </label>
                                                            <div
                                                                className={
                                                                    'inputDev ui input' +
                                                                    (errors.quantityComplete &&
                                                                        touched.quantityComplete
                                                                        ? ' has-error'
                                                                        : !errors.quantityComplete &&
                                                                            touched.quantityComplete
                                                                            ? ' has-success'
                                                                            : ' ')
                                                                }>
                                                                <input
                                                                    name="quantityComplete"
                                                                    className="form-control fsadfsadsa"
                                                                    id="quantityComplete"
                                                                    placeholder={
                                                                        Resources
                                                                            .quantityComplete[
                                                                        currentLanguage
                                                                        ]
                                                                    }
                                                                    autoComplete="off"
                                                                    onBlur={e => {
                                                                        handleBlur(e);
                                                                        handleChange(e);
                                                                    }}
                                                                    value={
                                                                        this.state
                                                                            .currentObject
                                                                            .quantityComplete
                                                                    }
                                                                    onChange={e =>
                                                                        this.handleChangeForEdit(
                                                                            e,
                                                                            'quantityComplete',
                                                                        )
                                                                    }
                                                                />
                                                                {touched.quantityComplete ? (
                                                                    <em className="pError">
                                                                        {
                                                                            errors.quantityComplete
                                                                        }
                                                                    </em>
                                                                ) : null}
                                                            </div>
                                                        </div>

                                                        <div className="fillter-item-c fullInputWidth">
                                                            <label className="control-label">
                                                                {
                                                                    Resources
                                                                        .paymentPercent[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </label>
                                                            <div
                                                                className={
                                                                    'inputDev ui input' +
                                                                    (errors.paymentPercent &&
                                                                        touched.paymentPercent
                                                                        ? ' has-error'
                                                                        : !errors.paymentPercent &&
                                                                            touched.paymentPercent
                                                                            ? ' has-success'
                                                                            : ' ')
                                                                }>
                                                                <input
                                                                    name="paymentPercent"
                                                                    className="form-control fsadfsadsa"
                                                                    id="paymentPercent"
                                                                    placeholder={
                                                                        Resources
                                                                            .paymentPercent[
                                                                        currentLanguage
                                                                        ]
                                                                    }
                                                                    autoComplete="off"
                                                                    onBlur={e => {
                                                                        handleBlur(e);
                                                                        handleChange(e);
                                                                    }}
                                                                    value={
                                                                        this.state
                                                                            .currentObject
                                                                            .paymentPercent
                                                                    }
                                                                    onChange={e =>
                                                                        this.handleChangeForEdit(
                                                                            e,
                                                                            'paymentPercent',
                                                                        )
                                                                    }
                                                                />
                                                                {touched.paymentPercent ? (
                                                                    <em className="pError">
                                                                        {' '}
                                                                        {
                                                                            errors.paymentPercent
                                                                        }{' '}
                                                                    </em>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                ) : null}

                                            {Config.IsAllow(3673) ? (
                                                <Fragment>
                                                    <div className="fillter-item-c fullInputWidth">
                                                        <label className="control-label">
                                                            {
                                                                Resources
                                                                    .sitePercentComplete[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                        <div
                                                            className={
                                                                'inputDev ui input' +
                                                                (errors.sitePercentComplete &&
                                                                    touched.sitePercentComplete
                                                                    ? ' has-error'
                                                                    : !errors.sitePercentComplete &&
                                                                        touched.sitePercentComplete
                                                                        ? ' has-success'
                                                                        : ' ')
                                                            }>
                                                            <input
                                                                name="sitePercentComplete"
                                                                className="form-control fsadfsadsa"
                                                                id="sitePercentComplete"
                                                                placeholder={
                                                                    Resources
                                                                        .percentComplete[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                                autoComplete="off"
                                                                onBlur={e => {
                                                                    handleBlur(e);
                                                                    handleChange(e);
                                                                }}
                                                                value={
                                                                    this.state
                                                                        .currentObject
                                                                        .sitePercentComplete
                                                                }
                                                                onChange={e =>
                                                                    this.handleChangeForEdit(
                                                                        e,
                                                                        'sitePercentComplete',
                                                                    )
                                                                }
                                                            />
                                                            {touched.sitePercentComplete ? (
                                                                <em className="pError">
                                                                    {' '}
                                                                    {
                                                                        errors.sitePercentComplete
                                                                    }{' '}
                                                                </em>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="fillter-item-c fullInputWidth">
                                                        <label className="control-label">
                                                            {
                                                                Resources
                                                                    .siteQuantityComplete[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                        <div
                                                            className={
                                                                'inputDev ui input' +
                                                                (errors.siteQuantityComplete &&
                                                                    touched.siteQuantityComplete
                                                                    ? ' has-error'
                                                                    : !errors.siteQuantityComplete &&
                                                                        touched.siteQuantityComplete
                                                                        ? ' has-success'
                                                                        : ' ')
                                                            }>
                                                            <input
                                                                name="siteQuantityComplete"
                                                                className="form-control fsadfsadsa"
                                                                id="siteQuantityComplete"
                                                                placeholder={
                                                                    Resources
                                                                        .siteQuantityComplete[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                                autoComplete="off"
                                                                onBlur={e => {
                                                                    handleBlur(e);
                                                                    handleChange(e);
                                                                }}
                                                                value={
                                                                    this.state
                                                                        .currentObject
                                                                        .siteQuantityComplete
                                                                }
                                                                onChange={e =>
                                                                    this.handleChangeForEdit(
                                                                        e,
                                                                        'siteQuantityComplete',
                                                                    )
                                                                }
                                                            />
                                                            {touched.siteQuantityComplete ? (
                                                                <em className="pError">
                                                                    {
                                                                        errors.siteQuantityComplete
                                                                    }
                                                                </em>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div className="fillter-item-c fullInputWidth">
                                                        <label className="control-label">
                                                            {
                                                                Resources
                                                                    .contractPaymentPercent[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                        <div
                                                            className={
                                                                'inputDev ui input' +
                                                                (errors.sitePaymentPercent &&
                                                                    touched.sitePaymentPercent
                                                                    ? ' has-error'
                                                                    : !errors.sitePaymentPercent &&
                                                                        touched.sitePaymentPercent
                                                                        ? ' has-success'
                                                                        : ' ')
                                                            }>
                                                            <input
                                                                name="sitePaymentPercent"
                                                                className="form-control fsadfsadsa"
                                                                id="sitePaymentPercent"
                                                                placeholder={
                                                                    Resources
                                                                        .contractPaymentPercent[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                                autoComplete="off"
                                                                onBlur={e => {
                                                                    handleBlur(e);
                                                                    handleChange(e);
                                                                }}
                                                                value={
                                                                    this.state
                                                                        .currentObject
                                                                        .sitePaymentPercent
                                                                }
                                                                onChange={e =>
                                                                    this.handleChangeForEdit(
                                                                        e,
                                                                        'sitePaymentPercent',
                                                                    )
                                                                }
                                                            />
                                                            {touched.sitePaymentPercent ? (
                                                                <em className="pError">
                                                                    {' '}
                                                                    {
                                                                        errors.sitePaymentPercent
                                                                    }{' '}
                                                                </em>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="fillter-item-c fullInputWidth">
                                                        <label className="control-label">
                                                            {
                                                                Resources.comments[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                        <div
                                                            className={
                                                                'inputDev ui input'
                                                            }>
                                                            <input
                                                                name="comments"
                                                                className="form-control fsadfsadsa"
                                                                id="comments"
                                                                placeholder={
                                                                    Resources
                                                                        .comments[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                                autoComplete="off"
                                                                onBlur={e => {
                                                                    handleBlur(e);
                                                                    handleChange(e);
                                                                }}
                                                                value={
                                                                    this.state
                                                                        .currentObject
                                                                        .lastComment
                                                                }
                                                                onChange={e =>
                                                                    this.handleChangeForEdit(
                                                                        e,
                                                                        'lastComment',
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            ) : null}

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
                                                        <button
                                                            className="primaryBtn-1 btn "
                                                            type="submit">
                                                            {
                                                                Resources.save[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    </Form>
                                )}
                        </Formik>
                    </SkyLight>
                </div>

                <div
                    className="largePopup largeModal "
                    style={{
                        display: this.state.viewPopUpRows ? 'block' : 'none',
                    }}>
                    {this.state.editItemsLoading === false ? (
                        <SkyLight
                            hideOnOverlayClicked
                            ref={ref => (this.reqPayModal = ref)}>
                            <Formik
                                initialValues={{ ...this.state.currentObject }}
                                //validationSchema={validationItemsSchema}
                                enableReinitialize={true}
                                onSubmit={values => {
                                    this.props.changeStatus === true
                                        ? this.editPaymentRequistionItems()
                                        : this.rowsUpdated();
                                }}>
                                {({
                                    errors,
                                    touched,
                                    handleBlur,
                                    handleChange,
                                    handleSubmit,
                                    setFieldValue,
                                    setFieldTouched,
                                }) => (
                                        <Form
                                            id="RequestPaymentItemMultipleEditForm"
                                            className="customProform proForm"
                                            noValidate="novalidate"
                                            onSubmit={handleSubmit}>
                                            <div className="proForm first-proform">
                                                <div className="linebylineInput valid-input">
                                                    <label
                                                        className="control-label"
                                                        style={{
                                                            marginRight: '15px',
                                                        }}>
                                                        {
                                                            Resources
                                                                .percentageStatus[
                                                            currentLanguage
                                                            ]
                                                        }
                                                    </label>
                                                    <div
                                                        className="ui checkbox radio radioBoxBlue"
                                                        style={{
                                                            marginRight: '15px',
                                                        }}>
                                                        <input
                                                            type="radio"
                                                            name="items-status"
                                                            defaultChecked={
                                                                this.state
                                                                    .isEditingPercentage ===
                                                                    'false'
                                                                    ? null
                                                                    : 'checked'
                                                            }
                                                            value="true"
                                                            onChange={e =>
                                                                this.handleChangeMultiple(
                                                                    e,
                                                                )
                                                            }
                                                        />
                                                        <label>
                                                            {
                                                                Resources
                                                                    .percentage[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                    </div>
                                                    <div className="ui checkbox radio radioBoxBlue">
                                                        <input
                                                            type="radio"
                                                            name="items-status"
                                                            defaultChecked={
                                                                this.state
                                                                    .isEditingPercentage ===
                                                                    'false'
                                                                    ? 'checked'
                                                                    : null
                                                            }
                                                            value="false"
                                                            onChange={e =>
                                                                this.handleChangeMultiple(
                                                                    e,
                                                                )
                                                            }
                                                        />
                                                        <label>
                                                            {
                                                                Resources.quantity[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="dropWrapper">
                                                {Config.IsAllow(3674) &&
                                                    this.props.changeStatus == true ? (
                                                        <Fragment>
                                                            {this.state
                                                                .isEditingPercentage ===
                                                                true ? (
                                                                    <div className="fillter-item-c fullInputWidth">
                                                                        <label className="control-label">
                                                                            {
                                                                                Resources
                                                                                    .percentComplete[
                                                                                currentLanguage
                                                                                ]
                                                                            }
                                                                        </label>
                                                                        <div
                                                                            className={
                                                                                'inputDev ui input' +
                                                                                (errors.percentComplete &&
                                                                                    touched.percentComplete
                                                                                    ? ' has-error'
                                                                                    : !errors.percentComplete &&
                                                                                        touched.percentComplete
                                                                                        ? ' has-success'
                                                                                        : ' ')
                                                                            }>
                                                                            <input
                                                                                name="percentComplete"
                                                                                className="form-control fsadfsadsa"
                                                                                id="percentComplete"
                                                                                placeholder={
                                                                                    Resources
                                                                                        .percentComplete[
                                                                                    currentLanguage
                                                                                    ]
                                                                                }
                                                                                autoComplete="off"
                                                                                onBlur={e => {
                                                                                    handleBlur(
                                                                                        e,
                                                                                    );
                                                                                    handleChange(
                                                                                        e,
                                                                                    );
                                                                                }}
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .currentObject
                                                                                        .percentComplete
                                                                                }
                                                                                onChange={e =>
                                                                                    this
                                                                                        .state
                                                                                        .isMultipleItems ===
                                                                                        false
                                                                                        ? this.handleChangeForEdit(
                                                                                            e,
                                                                                            'percentComplete',
                                                                                        )
                                                                                        : this.multipleHandleChangeForEdit(
                                                                                            e,
                                                                                            'percentComplete',
                                                                                        )
                                                                                }
                                                                            />
                                                                            {touched.percentComplete ? (
                                                                                <em className="pError">
                                                                                    {' '}
                                                                                    {
                                                                                        errors.percentComplete
                                                                                    }{' '}
                                                                                </em>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                ) : null}
                                                            {this.state
                                                                .isEditingPercentage ===
                                                                false ? (
                                                                    <div className="fillter-item-c fullInputWidth">
                                                                        <label className="control-label">
                                                                            {
                                                                                Resources
                                                                                    .quantityComplete[
                                                                                currentLanguage
                                                                                ]
                                                                            }
                                                                        </label>
                                                                        <div
                                                                            className={
                                                                                'inputDev ui input' +
                                                                                (errors.quantityComplete &&
                                                                                    touched.quantityComplete
                                                                                    ? ' has-error'
                                                                                    : !errors.quantityComplete &&
                                                                                        touched.quantityComplete
                                                                                        ? ' has-success'
                                                                                        : ' ')
                                                                            }>
                                                                            <input
                                                                                name="quantityComplete"
                                                                                className="form-control fsadfsadsa"
                                                                                id="quantityComplete"
                                                                                placeholder={
                                                                                    Resources
                                                                                        .quantityComplete[
                                                                                    currentLanguage
                                                                                    ]
                                                                                }
                                                                                autoComplete="off"
                                                                                onBlur={e => {
                                                                                    handleBlur(
                                                                                        e,
                                                                                    );
                                                                                    handleChange(
                                                                                        e,
                                                                                    );
                                                                                }}
                                                                                value={
                                                                                    this
                                                                                        .state
                                                                                        .currentObject
                                                                                        .quantityComplete
                                                                                }
                                                                                onChange={e =>
                                                                                    this
                                                                                        .state
                                                                                        .isMultipleItems ===
                                                                                        false
                                                                                        ? this.handleChangeForEdit(
                                                                                            e,
                                                                                            'quantityComplete',
                                                                                        )
                                                                                        : this.multipleHandleChangeForEdit(
                                                                                            e,
                                                                                            'quantityComplete',
                                                                                        )
                                                                                }
                                                                            />
                                                                            {touched.quantityComplete ? (
                                                                                <em className="pError">
                                                                                    {
                                                                                        errors.quantityComplete
                                                                                    }
                                                                                </em>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                ) : null}

                                                            <div className="fillter-item-c fullInputWidth">
                                                                <label className="control-label">
                                                                    {
                                                                        Resources
                                                                            .paymentPercent[
                                                                        currentLanguage
                                                                        ]
                                                                    }
                                                                </label>
                                                                <div
                                                                    className={
                                                                        'inputDev ui input' +
                                                                        (errors.paymentPercent &&
                                                                            touched.paymentPercent
                                                                            ? ' has-error'
                                                                            : !errors.paymentPercent &&
                                                                                touched.paymentPercent
                                                                                ? ' has-success'
                                                                                : ' ')
                                                                    }>
                                                                    <input
                                                                        name="paymentPercent"
                                                                        className="form-control fsadfsadsa"
                                                                        id="paymentPercent"
                                                                        placeholder={
                                                                            Resources
                                                                                .paymentPercent[
                                                                            currentLanguage
                                                                            ]
                                                                        }
                                                                        autoComplete="off"
                                                                        onBlur={e => {
                                                                            handleBlur(
                                                                                e,
                                                                            );
                                                                            handleChange(
                                                                                e,
                                                                            );
                                                                        }}
                                                                        value={
                                                                            this.state
                                                                                .currentObject
                                                                                .paymentPercent
                                                                        }
                                                                        onChange={e =>
                                                                            this.state
                                                                                .isMultipleItems ===
                                                                                false
                                                                                ? this.handleChangeForEdit(
                                                                                    e,
                                                                                    'paymentPercent',
                                                                                )
                                                                                : this.multipleHandleChangeForEdit(
                                                                                    e,
                                                                                    'paymentPercent',
                                                                                )
                                                                        }
                                                                    />
                                                                    {touched.paymentPercent ? (
                                                                        <em className="pError">
                                                                            {' '}
                                                                            {
                                                                                errors.paymentPercent
                                                                            }{' '}
                                                                        </em>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    ) : null}

                                                {Config.IsAllow(3673) ? (
                                                    <Fragment>
                                                        {this.state
                                                            .isEditingPercentage ===
                                                            true ? (
                                                                <div className="fillter-item-c fullInputWidth">
                                                                    <label className="control-label">
                                                                        {
                                                                            Resources
                                                                                .sitePercentComplete[
                                                                            currentLanguage
                                                                            ]
                                                                        }
                                                                    </label>
                                                                    <div
                                                                        className={
                                                                            'inputDev ui input' +
                                                                            (errors.sitePercentComplete &&
                                                                                touched.sitePercentComplete
                                                                                ? ' has-error'
                                                                                : !errors.sitePercentComplete &&
                                                                                    touched.sitePercentComplete
                                                                                    ? ' has-success'
                                                                                    : ' ')
                                                                        }>
                                                                        <input
                                                                            name="sitePercentComplete"
                                                                            className="form-control fsadfsadsa"
                                                                            id="sitePercentComplete"
                                                                            placeholder={
                                                                                Resources
                                                                                    .percentComplete[
                                                                                currentLanguage
                                                                                ]
                                                                            }
                                                                            autoComplete="off"
                                                                            onBlur={e => {
                                                                                handleBlur(
                                                                                    e,
                                                                                );
                                                                                handleChange(
                                                                                    e,
                                                                                );
                                                                            }}
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .currentObject
                                                                                    .sitePercentComplete
                                                                            }
                                                                            onChange={e =>
                                                                                this
                                                                                    .state
                                                                                    .isMultipleItems ===
                                                                                    false
                                                                                    ? this.handleChangeForEdit(
                                                                                        e,
                                                                                        'sitePercentComplete',
                                                                                    )
                                                                                    : this.multipleHandleChangeForEdit(
                                                                                        e,
                                                                                        'sitePercentComplete',
                                                                                    )
                                                                            }
                                                                        />
                                                                        {touched.sitePercentComplete ? (
                                                                            <em className="pError">
                                                                                {' '}
                                                                                {
                                                                                    errors.sitePercentComplete
                                                                                }{' '}
                                                                            </em>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            ) : null}
                                                        {this.state
                                                            .isEditingPercentage ===
                                                            false ? (
                                                                <div className="fillter-item-c fullInputWidth">
                                                                    <label className="control-label">
                                                                        {
                                                                            Resources
                                                                                .siteQuantityComplete[
                                                                            currentLanguage
                                                                            ]
                                                                        }
                                                                    </label>
                                                                    <div
                                                                        className={
                                                                            'inputDev ui input' +
                                                                            (errors.siteQuantityComplete &&
                                                                                touched.siteQuantityComplete
                                                                                ? ' has-error'
                                                                                : !errors.siteQuantityComplete &&
                                                                                    touched.siteQuantityComplete
                                                                                    ? ' has-success'
                                                                                    : ' ')
                                                                        }>
                                                                        <input
                                                                            name="siteQuantityComplete"
                                                                            className="form-control fsadfsadsa"
                                                                            id="siteQuantityComplete"
                                                                            placeholder={
                                                                                Resources
                                                                                    .siteQuantityComplete[
                                                                                currentLanguage
                                                                                ]
                                                                            }
                                                                            autoComplete="off"
                                                                            onBlur={e => {
                                                                                handleBlur(
                                                                                    e,
                                                                                );
                                                                                handleChange(
                                                                                    e,
                                                                                );
                                                                            }}
                                                                            value={
                                                                                this
                                                                                    .state
                                                                                    .currentObject
                                                                                    .siteQuantityComplete
                                                                            }
                                                                            onChange={e =>
                                                                                this
                                                                                    .state
                                                                                    .isMultipleItems ===
                                                                                    false
                                                                                    ? this.handleChangeForEdit(
                                                                                        e,
                                                                                        'siteQuantityComplete',
                                                                                    )
                                                                                    : this.multipleHandleChangeForEdit(
                                                                                        e,
                                                                                        'siteQuantityComplete',
                                                                                    )
                                                                            }
                                                                        />
                                                                        {touched.siteQuantityComplete ? (
                                                                            <em className="pError">
                                                                                {
                                                                                    errors.siteQuantityComplete
                                                                                }
                                                                            </em>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            ) : null}
                                                        <div className="fillter-item-c fullInputWidth">
                                                            <label className="control-label">
                                                                {
                                                                    Resources
                                                                        .contractPaymentPercent[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </label>
                                                            <div
                                                                className={
                                                                    'inputDev ui input' +
                                                                    (errors.sitePaymentPercent &&
                                                                        touched.sitePaymentPercent
                                                                        ? ' has-error'
                                                                        : !errors.sitePaymentPercent &&
                                                                            touched.sitePaymentPercent
                                                                            ? ' has-success'
                                                                            : ' ')
                                                                }>
                                                                <input
                                                                    name="sitePaymentPercent"
                                                                    className="form-control fsadfsadsa"
                                                                    id="sitePaymentPercent"
                                                                    placeholder={
                                                                        Resources
                                                                            .contractPaymentPercent[
                                                                        currentLanguage
                                                                        ]
                                                                    }
                                                                    autoComplete="off"
                                                                    onBlur={e => {
                                                                        handleBlur(
                                                                            e,
                                                                        );
                                                                        handleChange(
                                                                            e,
                                                                        );
                                                                    }}
                                                                    value={
                                                                        this.state
                                                                            .currentObject
                                                                            .sitePaymentPercent
                                                                    }
                                                                    onChange={e =>
                                                                        this.state
                                                                            .isMultipleItems ===
                                                                            false
                                                                            ? this.handleChangeForEdit(
                                                                                e,
                                                                                'sitePaymentPercent',
                                                                            )
                                                                            : this.multipleHandleChangeForEdit(
                                                                                e,
                                                                                'sitePaymentPercent',
                                                                            )
                                                                    }
                                                                />
                                                                {touched.sitePaymentPercent ? (
                                                                    <em className="pError">
                                                                        {' '}
                                                                        {
                                                                            errors.sitePaymentPercent
                                                                        }{' '}
                                                                    </em>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                ) : null}
                                                <Fragment>
                                                    <div className="fillter-item-c fullInputWidth">
                                                        <label className="control-label">
                                                            {
                                                                Resources.comments[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </label>
                                                        <div
                                                            className={
                                                                'inputDev ui input'
                                                            }>
                                                            <input
                                                                name="comments"
                                                                className="form-control fsadfsadsa"
                                                                id="comments"
                                                                placeholder={
                                                                    Resources
                                                                        .comments[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                                autoComplete="off"
                                                                onBlur={e => {
                                                                    handleBlur(e);
                                                                    handleChange(e);
                                                                }}
                                                                value={
                                                                    this.state
                                                                        .currentObject
                                                                        .lastComment
                                                                }
                                                                onChange={e =>
                                                                    this.state
                                                                        .isMultipleItems ===
                                                                        false
                                                                        ? this.handleChangeForEdit(
                                                                            e,
                                                                            'lastComment',
                                                                        )
                                                                        : this.multipleHandleChangeForEdit(
                                                                            e,
                                                                            'lastComment',
                                                                        )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </Fragment>

                                                <div className="fullWidthWrapper">
                                                    {this.state.isLoadingItems ===
                                                        true ? (
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
                                                            <button
                                                                className="primaryBtn-1 btn "
                                                                type="submit">
                                                                {
                                                                    Resources.save[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </button>
                                                        )}
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                            </Formik>
                        </SkyLight>
                    ) : (
                            <LoadingSection />
                        )}
                </div>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={
                            Resources['smartDeleteMessage'][currentLanguage]
                                .content
                        }
                        buttonName="delete"
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        clickHandlerContinue={this.clickHandlerContinueMain.bind(
                            this,
                        )}
                    />
                ) : null}

                <div
                    className="largePopup largeModal "
                    style={{
                        display: this.state.showViewHistoryModal
                            ? 'block'
                            : 'none',
                    }}>
                    <SkyLight
                        hideOnOverlayClicked
                        ref={ref => (this.ViewHistoryModal = ref)}
                        title={Resources.viewHistory[currentLanguage]}>
                        {viewHistory}
                    </SkyLight>
                </div>

                <SkyLight
                    hideOnOverlayClicked
                    ref={ref => (this.editPayment = ref)}
                    title={Resources.editPayment[currentLanguage]}>
                    <div className="doc-pre-cycle">
                        <div className="inpuBtn proForm">
                            <div className="linebylineInput valid-input ">
                                <label className="control-label">
                                    {Resources.advancedPayment[currentLanguage]}
                                </label>
                                <div className="ui input inputDev">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="advancedPayment"
                                        value={this.state.advancedPayment || ''}
                                        placeholder={
                                            Resources.advancedPayment[
                                            currentLanguage
                                            ]
                                        }
                                        onChange={event =>
                                            this.setState({
                                                advancedPayment:
                                                    event.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            {this.state.isLoading === false ? (
                                <button
                                    className="primaryBtn-1 btn meduimBtn"
                                    onClick={this.editAdvancedPayment.bind(
                                        this,
                                    )}>
                                    {Resources['save'][currentLanguage]}
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
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(requestPaymentsAddEdit));

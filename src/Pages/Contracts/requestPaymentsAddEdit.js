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

import RichTextEditor from 'react-rte';

import GridSetup from "../Communication/GridSetup";

import { withRouter } from "react-router-dom";

import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import * as communicationActions from '../../store/actions/communication';

import LoadingSection from '../../Componants/publicComponants/LoadingSection';

import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";

import SkyLight from 'react-skylight';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'

import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import { func } from "prop-types";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({

    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    contractId: Yup.string().required(Resources['selectContract'][currentLanguage])
        .nullable(true),

    vat: Yup.string()
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),
    tax: Yup.string()
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),
    insurance: Yup.string()
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),
    advancePaymentPercent: Yup.string()
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),
    retainagePercent: Yup.string()
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),
})

const validationDeductionSchema = Yup.object().shape({

    title: Yup.string().required(Resources['description'][currentLanguage]),

    deductionValue: Yup.string()
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),
})

const BoqTypeSchema = Yup.object().shape({
    boqType: Yup.string().required(Resources['boqSubType'][currentLanguage]),
    boqChild: Yup.string().required(Resources['boqSubType'][currentLanguage]),
    boqSubType: Yup.string().required(Resources['boqSubType'][currentLanguage]),
});

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')
let itemsColumns = [];

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
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {

            selectedBoqTypeEdit: { label: Resources.boqType[currentLanguage], value: "0" },
            selectedBoqTypeChildEdit: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
            selectedBoqSubTypeEdit: { label: Resources.boqSubType[currentLanguage], value: "0" },

            boqTypes: [],
            BoqTypeChilds: [],
            BoqSubTypes: [],
            boqStractureObj: {},
            documentDeduction: {},
            currentAndPreviousTotal: [],
            approvedInvoicesParent: [],
            approvedInvoicesChilds: [],
            deductionObservableArray: [],
            paymentRequestItemsHistory: [],
            isLoading: false,
            FirstStep: true,
            SecondStep: false,
            ThirdStep: false,
            FourthStep: false,

            SecondStepComplate: false,
            ThirdStepComplate: false,
            FourthStepComplate: false,

            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
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

            permission: [{ name: 'sendByEmail', code: 54 }, { name: 'sendByInbox', code: 53 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 956 },
            { name: 'createTransmittal', code: 3042 }, { name: 'sendToWorkFlow', code: 707 },
            { name: 'viewAttachments', code: 3317 }, { name: 'deleteAttachments', code: 840 }],
            selectContract: { label: Resources.selectContract[currentLanguage], value: "0" },
            contractsPos: [],
            paymentsItems: [],
            CurrentStep: 1,
            editRows: [],
            comment: RichTextEditor.createEmptyValue()

        }

        if (!Config.IsAllow(159) || !Config.IsAllow(158) || !Config.IsAllow(160)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/requestPayments/" + projectId
            });
        }
        this.editRowsClick = this.editRowsClick.bind(this);

        this.GetCellActions = this.GetCellActions.bind(this);
    }

    buildColumns() {
        let editPaymentPercent = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.paymentPercent}</span></a>;
            }
            return null;
        };

        let editQuantityComplete = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer', color: row.revisedQuantity >= row.quantityComplete ? 'black' : '#F50505' }}>{row.quantityComplete}</span></a>;
            }
            return null;
        };

        let editPercentComplete = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.percentComplete}</span></a>;
            }
            return null;
        };

        let editSiteQuantityComplete = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.siteQuantityComplete}</span></a>;
            }
            return null;
        };

        let editSitePercentComplete = ({ value, row }) => {
            if (row) {
                return <a className="editorCell"><span style={{ padding: '0 6px', margin: '5px 0', border: '1px dashed', cursor: 'pointer' }}>{row.sitePercentComplete}</span></a>;
            }
            return null;
        };

        itemsColumns = [
            {
                key: 'BtnActions',
                width: 150
            },
            {
                key: "arrange",
                name: Resources["no"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "boqType",
                name: Resources["boqType"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "secondLevel",
                name: Resources["boqTypeChild"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "boqSubType",
                name: Resources["boqSubType"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "itemCode",
                name: Resources["itemCode"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "description",
                name: Resources["details"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "quantity",
                name: Resources["boqQuanty"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "revisedQuantity",
                name: Resources["approvedQuantity"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "unitPrice",
                name: Resources["unitPrice"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "unit",
                name: Resources["unit"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "prevoiuseQnty",
                name: Resources["previousQuantity"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "oldPaymentPercent",
                name: Resources["previousPaymentPercent"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "sitePercentComplete",
                name: Resources["sitePercentComplete"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: editSitePercentComplete,
                editable: !this.props.changeStatus
            }, {
                key: "siteQuantityComplete",
                name: Resources["siteQuantityComplete"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: editSiteQuantityComplete,
                editable: !this.props.changeStatus
            }, {
                key: "percentComplete",
                name: Resources["percentComplete"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: editPercentComplete,
                editable: this.props.changeStatus,
                visible: this.props.changeStatus
            }, {
                key: "quantityComplete",
                name: Resources["quantityComplete"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: editQuantityComplete,
                editable: this.props.changeStatus,
                visible: this.props.changeStatus
            }, {
                key: "paymentPercent",
                name: Resources["paymentPercent"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: editPaymentPercent,
                editable: true
            }
        ];

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
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.document && nextProps.document.id) {
            let serverChangeOrder = { ...nextProps.document };
            serverChangeOrder.docDate = moment(serverChangeOrder.docDate).format('DD/MM/YYYY');
            serverChangeOrder.advancePaymentPercent = serverChangeOrder.advancePaymentPercent != null ? serverChangeOrder.advancePaymentPercent : 0;
            serverChangeOrder.tax = serverChangeOrder.tax != null ? serverChangeOrder.tax : 0;
            serverChangeOrder.vat = serverChangeOrder.vat != null ? serverChangeOrder.vat : 0;
            serverChangeOrder.insurance = serverChangeOrder.insurance != null ? serverChangeOrder.insurance : 0;
            serverChangeOrder.actualPayment = serverChangeOrder.actualPayment != null ? serverChangeOrder.actualPayment : 0;
            serverChangeOrder.advancedPaymentAmount = serverChangeOrder.advancedPaymentAmount != null ? serverChangeOrder.advancedPaymentAmount : 0;
            serverChangeOrder.retainagePercent = serverChangeOrder.retainagePercent != null ? serverChangeOrder.retainagePercent : 0;
            serverChangeOrder.remainingPayment = serverChangeOrder.remainingPayment != null ? serverChangeOrder.remainingPayment : 0;
            this.setState({
                document: { ...serverChangeOrder },
                hasWorkflow: nextProps.hasWorkflow
            });

            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
            this.setState({
                isLoading: false
            });
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(158)) {
                this.setState({ isViewMode: true });
            }

            if (this.state.isApproveMode != true && Config.IsAllow(158)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(158)) {
                    //close => false
                    if (this.props.document.status !== false && Config.IsAllow(158)) {
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

    fillVoItems() {
        dataservice.GetDataGrid("GetChangeOrderItemsByChangeOrderId?changeOrderId=" + this.state.docId).then(result => {
            this.setState({
                voItems: [...result]
            });
            this.props.actions.setItemDescriptions(result);
        });
    }

    componentWillMount() {
        let documentDeduction = {
            title: '',
            deductionValue: 0
        };

        if (this.state.docId > 0) {
            this.props.actions.documentForEdit("GetContractsRequestPaymentsForEdit?id=" + this.state.docId);

            this.setState({
                isLoading: true,
                documentDeduction: documentDeduction
            });
        } else {
            let paymentRequistion = {
                subject: '..',
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
                useQuantity: false
            };

            this.setState({
                document: paymentRequistion,
                documentDeduction: documentDeduction
            }, function () {
                this.GetNExtArrange();
            });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    };

    GetNExtArrange() {
        let original_document = { ...this.state.document };
        let updated_document = {};
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=0&contactId=0";
        this.props.actions.GetNextArrange(url);
        dataservice.GetNextArrangeMainDocument(url).then(res => {
            updated_document.arrange = res;
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document
            });
        })
    }
    fillDropDowns(isEdit) {

        if (isEdit === false) {

            dataservice.GetDataGrid("GetContractsListForPaymentRequistion?projectId=" + this.state.projectId).then(result => {
                let Data = [];
                (result).forEach(item => {
                    var obj = {};
                    obj.label = item['subject'];
                    obj.value = item['id'];
                    Data.push(obj);
                });
                this.setState({
                    contractsPos: [...Data],
                    contractsPool: result
                });
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            docId: 0
        });
    }

    onChangeMessage = (value, field) => {
        let isEmpty = !value.getEditorState().getCurrentContent().hasText();
        if (isEmpty === false) {

            if (value.toString('markdown').length > 1) {

                let comment = value.toString('markdown');

                this.setState({
                    comment: comment
                });
            }
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

            this.buildColumns();
            dataservice.GetDataGrid("/GetRequestItemsOrderByContractId?contractId=" + event.value + "&isAdd=true&requestId=" + this.state.docId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                this.setState({
                    paymentsItems: result,
                    isLoading: false
                });
            });
            let contract = _.find(this.state.contractsPool, function (x) { return x.id == event.value });
            if (contract) {

                var objDate = new Date(),
                    month = objDate.toLocaleString('en', { month: "long" });
                var year = objDate.getFullYear();

                updated_document.subject = 'Payment Requisition ' + contract.subject + ' (' + year + '/' + month + ') ' + original_document.arrange;
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

        saveDocument.docDate = moment(saveDocument.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('EditContractsRequestPayments', saveDocument).then(result => {
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

        saveDocument.docDate = moment(saveDocument.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        saveDocument.projectId = this.state.projectId;

        dataservice.addObject('AddContractsRequestPayment', saveDocument).then(result => {
            if (result.id) {

                this.setState({
                    docId: result.id,
                    isLoading: false
                });

                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        }).catch(res => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    showBtnsSaving() {
        let btn = null;
        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type='submit'>{Resources.next[currentLanguage]}</button>
        }

        return btn;
    }

    viewAttachments() {
        return (
            this.state.docId > 0 ? (
                Config.IsAllow(3317) === true ?
                    <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    handleShowAction = (item) => {

        if (item.value != "0") {

            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })

            this.simpleDialog.show()
        }
    }

    FillGridItems() {

        let contractId = this.state.document.contractId;

        if (this.props.changeStatus == true) {

            let paymentsItems = [...this.state.paymentsItems];
            if (paymentsItems.length == 0) {
                this.buildColumns();

                dataservice.GetDataGrid("/GetRequestItemsOrderByContractId?contractId=" + contractId + "&isAdd=false&requestId=" + this.state.docId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                    this.setState({
                        paymentsItems: result,
                        isLoading: false
                    });

                });
            }
        }
    }

    NextStep = () => {

        if (this.state.CurrentStep === 1) {
            this.setState({
                isLoading: true
            });
            this.FillGridItems();
            this.editPaymentRequistion();

            window.scrollTo(0, 0)
            this.setState({
                FirstStep: false,
                SecondStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: false,
                CurrentStep: this.state.CurrentStep + 1,
                ThirdStep: false
            })
            if (this.props.changeStatus === true) {
                if (this.props.items.length == 0) {
                    this.fillVoItems();
                }
            }

        }
        else if (this.state.CurrentStep === 2) {
            this.FillSummariesTab();

            window.scrollTo(0, 0)
            this.setState({
                FirstStep: false,
                SecondStep: false,
                ThirdStep: true,
                CurrentStep: (this.state.CurrentStep + 1),
                ThirdStepComplate: true
            })
        }
        else if (this.state.CurrentStep === 3) {
            this.fillDeductions();

            window.scrollTo(0, 0)
            this.setState({
                FirstStep: false,
                SecondStep: false,
                ThirdStep: false,
                CurrentStep: (this.state.CurrentStep + 1),
                ThirdStepComplate: false,
                FourthStep: true,
                FourthStepComplate: true
            })
        } else if (this.state.CurrentStep === 4) {
            this.props.history.push({
                pathname: "/requestPayments/" + projectId
            });
        }

    }

    FillSummariesTab() {
        let contractId = this.state.document.contractId;
        let currentAndPreviousTotal = [...this.state.currentAndPreviousTotal];
        if (currentAndPreviousTotal.length == 0) {
            this.setState({
                isLoading: true
            });
            dataservice.GetDataGridPost("/GetTotalForReqPay?projectId=" + projectId + "&contractId=" + contractId + "&requestId=" + this.state.docId).then(result => {
                this.setState({
                    currentAndPreviousTotal: result,
                    isLoading: false
                });

            });
        }
        let approvedInvoicesChilds = [...this.state.approvedInvoicesChilds];
        if (approvedInvoicesChilds.length == 0) {
            this.setState({
                isLoading: true
            });
            let rowTotal = 0;
            dataservice.GetDataGridPost("/GetApprovedInvoicesParent?contractId=" + contractId + "&requestId=" + this.state.docId).then(result => {
                var obj = {};
                var conditionString = "";
                dataservice.GetDataGridPost("/GetApprovedInvoicesChilds?projectId=" + projectId + "&contractId=" + contractId + "&requestId=" + this.state.docId).then(res => {
                    let approvedInvoicesParent = [];

                    result.map(parent => {
                        let sumRowTotal = 0;
                        let sumtotal = 0;
                        //config.itemsColumnDefenition2.friendlyNames.push(parent.details);

                        res.map(child => {

                            //config.itemsColumnDefenition2.fields.push(child.building);

                            var total = child[parent.details];
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
                        if (parent.total === null) {
                            parent.total = 0;
                        }

                        approvedInvoicesParent.push(parent);
                    });

                    this.setState({
                        approvedInvoicesChilds: res,
                        approvedInvoicesParent: approvedInvoicesParent,
                        isLoading: false,
                        rowTotal: rowTotal
                    });

                });
            });
        }
    }

    fillDeductions() {
        let deductionObservableArray = [...this.state.deductionObservableArray];

        if (deductionObservableArray.length == 0) {
            this.setState({
                isLoading: true
            });

            dataservice.GetDataGrid("/GetContractsRequestPaymentsDeductions?requestId=" + this.state.docId).then(result => {
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
    }

    NextTopStep = () => {

        if (this.state.CurrentStep === 1) {
            this.setState({
                isLoading: true
            });
            this.FillGridItems();

            window.scrollTo(0, 0)
            this.setState({
                FirstStep: false,
                SecondStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: false,
                CurrentStep: this.state.CurrentStep + 1,
                ThirdStep: false
            })

        }
        else if (this.state.CurrentStep === 2) {
            this.FillSummariesTab();
            window.scrollTo(0, 0)
            this.setState({
                FirstStep: false,
                SecondStep: false,
                ThirdStep: true,
                CurrentStep: (this.state.CurrentStep + 1),
                ThirdStepComplate: true
            })
        }
        else if (this.state.CurrentStep === 3) {
            this.fillDeductions();
            window.scrollTo(0, 0)
            this.setState({
                FirstStep: false,
                SecondStep: false,
                ThirdStep: false,
                CurrentStep: (this.state.CurrentStep + 1),
                ThirdStepComplate: false,
                FourthStep: true,
                FourthStepComplate: true
            })
        } else if (this.state.CurrentStep === 4) {
            this.props.history.push({
                pathname: "/requestPayments/" + projectId
            });
        }

    }

    PreviousStep = () => {
        if (this.state.docId !== 0) {
            if (this.state.CurrentStep === 4) {
                window.scrollTo(0, 0)
                this.setState({
                    FirstStep: false,
                    SecondStep: false,
                    ThirdStep: false,
                    CurrentStep: (this.state.CurrentStep - 1),
                    ThirdStepComplate: false,
                    FourthStep: true,
                    FourthStepComplate: true
                })
            }
            if (this.state.CurrentStep === 3) {
                window.scrollTo(0, 0)
                this.setState({
                    FirstStep: false,
                    SecondStep: true,
                    ThirdStep: false,
                    CurrentStep: (this.state.CurrentStep - 1),
                    ThirdStepComplate: false,
                    SecondStepComplate: true
                })
            }
            else {
                if (this.state.CurrentStep === 2) {
                    window.scrollTo(0, 0)
                    this.setState({
                        FirstStep: true,
                        SecondStep: false,
                        SecondStepComplate: false,
                        ThirdStep: false,
                        CurrentStep: (this.state.CurrentStep - 1)
                    })
                }
            }
        }
    }

    saveVariationOrderItem(event) {
        let saveDocument = { ...this.state.voItem };

        saveDocument.changeOrderId = this.state.docId;

        dataservice.addObject('AddVOItems', saveDocument).then(result => {
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
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'title', 'id').then(result => {
                this.setState({
                    [nextTragetState]: result
                });
            });
        }
    }

    onRowClick = (value, index, column) => {
        if (!Config.IsAllow(11)) {
            toast.warning("you don't have permission");
        }
    }

    GetCellActions(column, row) {
        if (column.key === 'BtnActions') {
            return [
                {
                    icon: "fa fa-pencil",
                    actions: [
                        (this.props.changeStatus ?
                            ({
                                text: Resources['viewHistory'][currentLanguage],
                                callback: (e) => {
                                    if (this.props.changeStatus) {
                                        this.setState({
                                            isLoading: true
                                        });
                                        dataservice.GetDataGrid("/GetContractsRequestPaymentsItemsHistory?id=" + this.state.docId).then(result => {
                                            this.setState({
                                                paymentRequestItemsHistory: result,
                                                isLoading: false,
                                                showViewHistoryModal: true
                                            });

                                            this.ViewHistoryModal.show()
                                        });

                                    }
                                }
                            }) : null),
                        {
                            text: 'showAddComment',
                            callback: () => {
                                if (Config.IsAllow(1001103)) {
                                    this.setState({
                                        showCommentModal: true,
                                        comment: RichTextEditor.createValueFromString(row.comment, 'html')

                                    });

                                    this.addCommentModal.show()
                                }
                            }
                        },
                        {
                            text: Resources['editBoq'][currentLanguage],
                            callback: () => {
                                if (Config.IsAllow(1001104)) {
                                    let boqStractureObj = { ...this.state.boqStractureObj };
                                    let boqTypes = [...this.state.boqTypes];
                                    boqStractureObj.id = row.id;
                                    boqStractureObj.requestId = this.state.docId;
                                    boqStractureObj.contractId = this.state.document.contractId;

                                    if (boqTypes.length > 0) {
                                        this.setState({
                                            boqStractureObj: boqStractureObj,
                                            showBoqModal: true
                                        });
                                        this.boqTypeModal.show()
                                    } else {
                                        dataservice.GetDataList("GetAllBoqParentNull?projectId=" + projectId, "title", "id").then(data => {
                                            this.setState({
                                                boqTypes: data,
                                                boqStractureObj: boqStractureObj,
                                                showBoqModal: true
                                            });
                                            this.boqTypeModal.show()
                                        });
                                    }
                                }
                            }
                        }
                    ]
                }];
        }
    }

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
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'title', 'id').then(result => {
                this.setState({
                    [nextTragetState]: result
                });
            });
        }
    }

    _onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        //  this.setState({ isLoading: true })
        let rows = [...this.state.paymentsItems];
        let updateRow = rows[fromRow];

        this.setState(state => {
            const paymentsItems = state.paymentsItems.slice();
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...updated };
            }
            return { paymentsItems };
        }, function () {
            if (updateRow[Object.keys(updated)[0]] !== updated[Object.keys(updated)[0]]) {
                if (updateRow.revisedQuantity == 0 && (updateRow.siteQuantityComplete > 0 || updateRow.sitePercentComplete > 0)) {
                    updateRow.revisedQuantity = 1;
                }
                let newValue = parseFloat(updated[Object.keys(updated)[0]]);
                updateRow[Object.keys(updated)[0]] = parseFloat(updated[Object.keys(updated)[0]]);

                switch (Object.keys(updated)[0]) {
                    case 'quantityComplete':
                        updateRow.percentComplete = (((newValue) / updateRow.revisedQuantity) * 100);
                        break;
                    case 'percentComplete':
                        updateRow.quantityComplete = ((newValue / 100) * updateRow.revisedQuantity);
                        break;
                    case 'sitePercentComplete':
                        updateRow.siteQuantityComplete = ((newValue / 100) * updateRow.revisedQuantity);

                        break;
                    case 'siteQuantityComplete':
                        updateRow.sitePercentComplete = ((newValue / updateRow.revisedQuantity) * 100);
                        if (this.props.changeStatus == false) {
                            updateRow.percentComplete = (((newValue) / updateRow.revisedQuantity) * 100);
                        }
                        break;
                }
                let editRows = [...this.state.editRows];

                let sameRow = _.find(editRows, function (x) { return x.id === updateRow.id });
                if (sameRow) {
                    editRows = editRows.filter(function (i) {
                        return i.id != updateRow.id;
                    });
                }
                editRows.push(updateRow);

                this.setState({
                    editRows: editRows
                    // isLoading: false
                });
            }
        });
    };

    editRowsClick() {
        this.setState({ isLoading: true })

        let editItems = [...this.state.editRows];
        editItems.map(i => {
            if (i.revisedQuantity == 0 && i.siteQuantityComplete > 0) {
                i.revisedQuantity = 1;
            }
            i.percentComplete = ((parseFloat(i.siteQuantityComplete) / i.revisedQuantity) * 100);
            i.sitePercentComplete = ((parseFloat(i.siteQuantityComplete) / i.revisedQuantity) * 100);
            i.contractId = this.state.document.contractId;
            i.requestId = this.state.docId;
            i.projectId = projectId;

        })

        let api = this.props.changeStatus === true ? 'EditContractsRequestPaymentsItems' : 'AddContractsRequestPaymentsItemsNewScenario';
        dataservice.addObject(api, editItems)
            .then(() => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.setState({ isLoading: false })
            })
            .catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ isLoading: false })
            })
    }

    assign = () => {
        this.setState({ showBoqModal: true })
        this.boqTypeModal.show()
    }

    addDeduction() {
        this.setState({
            isLoading: true
        });

        let saveDocument = this.state.documentDeduction;

        saveDocument.requestId = this.state.docId;

        dataservice.addObject('AddContractsRequestPaymentsDeductions', saveDocument).then(result => {
            let list = [...this.state.deductionObservableArray];
            list.push(result);

            let documentDeduction = {
                title: '',
                deductionValue: 0,
                deductionObservableArray: list
            };
            this.setState({
                isLoading: false,
                documentDeduction: documentDeduction
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

        this.setState({ showBoqModal: true, isLoading: true })

        dataservice.addObject('EditBoqStarcureRequestItem', boqStractureObj).then(() => {
            this.setState({ showBoqModal: false, isLoading: false })
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ showBoqModal: false, isLoading: false })
        })

    }

    addCommentClick = () => {
        let comment = { ...this.state.comment };

        this.setState({ showCommentModal: true, isLoading: true })
        if (this.props.changeStatus) {
            this.setState({ showCommentModal: false, isLoading: false })
        }

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

        ];
        const ItemsGrid = this.state.isLoading === false && this.state.CurrentStep === 2 && itemsColumns.length > 0 ? (
            <GridSetup
                rows={this.state.paymentsItems}
                showCheckbox={false}
                pageSize={this.state.pageSize}
                onRowClick={this.onRowClick}
                columns={itemsColumns}
                onGridRowsUpdated={this._onGridRowsUpdated}
                getCellActions={this.GetCellActions}
                key='PRitems'
            />) : <LoadingSection />;

        const BoqTypeContent = <Fragment>
            <div className="dropWrapper">
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        boqType: '',
                        boqChild: '',
                        boqSubType: ''
                    }}
                    validationSchema={BoqTypeSchema}
                    onSubmit={(values) => {
                        this.assignBoqType()
                    }}
                >
                    {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                        <Form id="signupForm1" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                            <div className="fullWidthWrapper textLeft">
                                <Dropdown
                                    title="boqType"
                                    data={this.state.boqTypes}
                                    selectedValue={this.state.selectedBoqTypeEdit}
                                    handleChange={event => this.handleChangeItemDropDownItems(event, 'boqTypeId', 'selectedBoqTypeEdit', true, 'GetAllBoqChild', 'parentId', 'BoqTypeChilds')}

                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                    error={errors.boqType}
                                    touched={touched.boqType}
                                    name="boqType"
                                    index="boqType" />
                            </div>
                            <Dropdown
                                title="boqTypeChild"
                                data={this.state.BoqTypeChilds}
                                selectedValue={this.state.selectedBoqTypeChildEdit}
                                handleChange={event => this.handleChangeItemDropDownItems(event, 'boqTypeChildId', 'selectedBoqTypeChildEdit', true, 'GetAllBoqChild', 'parentId', 'BoqSubTypes')}

                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.boqChild}
                                touched={touched.boqChild}
                                name="boqChild"
                                index="boqChild" />
                            <Dropdown
                                title="boqSubType"
                                data={this.state.BoqSubTypes}
                                selectedValue={this.state.selectedBoqSubTypeEdit}
                                handleChange={event => this.handleChangeItemDropDownItems(event, 'boqSubTypeId', 'selectedBoqSubTypeEdit', false, '', '', '')}

                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.boqSubType}
                                touched={touched.boqSubType}
                                name="boqSubType"
                                index="boqSubType" />

                            <div className={"slider-Btns fullWidthWrapper"}>
                                <button className={this.state.isViewMode === true ? "primaryBtn-1 btn  disNone" : "primaryBtn-1 btn "} type="submit" >{Resources['save'][currentLanguage]}</button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
        </Fragment >

        let interimTable = this.state.isLoading === false ?
            this.state.currentAndPreviousTotal.map(i =>
                <tr key={i.id}>
                    {i.comment == 'True' ?
                        <td colSpan="9" >
                            <div className="contentCell tableCell-2">
                                <a>
                                    {i.workDescription != null ? i.workDescription.slice(0, (i.workDescription.lastIndexOf('-')) == -1 ? i.workDescription.length : (i.workDescription.lastIndexOf('-'))) : ''}
                                </a>
                            </div>
                        </td>
                        :
                        <Fragment>
                            <td colSpan="6" >
                                <div className="contentCell tableCell-2">
                                    <a data-toggle="tooltip"
                                        title={i.workDescription != null ? (i.workDescription.slice(0, (i.workDescription.lastIndexOf('-')) == -1 ? i.workDescription.length : (i.workDescription.lastIndexOf('-')))) : ''}                                    >
                                        {i.workDescription != null ? (i.workDescription.slice(0, (i.workDescription.lastIndexOf('-')) == -1 ? i.workDescription.length : (i.workDescription.lastIndexOf('-')))) : ''}
                                    </a>
                                </div>
                            </td>
                            <td >
                                <div className="contentCell">
                                    {i.previous != null ? parseFloat(i.previous).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}
                                </div> </td>
                            <td >
                                <div className="contentCell">
                                    {i.current != null ? parseFloat(i.current.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}
                                </div> </td>
                            <td >
                                <div className="contentCell">
                                    {i.total != null ? parseFloat(i.total.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}
                                </div> </td>
                            <td >
                                <div className="contentCell">
                                    {i.comment}
                                </div></td>
                        </Fragment>
                    }
                </tr>
            ) : <LoadingSection />;

        let deductionTable = this.state.isLoading === false ?
            this.state.deductionObservableArray.map(i =>
                <tr key={i.id}>
                    <Fragment>
                        <td><div className="contentCell">{i.title}</div> </td>
                        <td><div className="contentCell">{i.deductionValue}</div> </td>
                        {/* <td><div className="contentCell"></div></td> */}
                    </Fragment>

                </tr>
            ) : <LoadingSection />;

        let viewHistory =
            <div className="doc-pre-cycle">
                <table className="attachmentTable" key="DeductionsCertificate">
                    <thead>
                        <tr>
                            <th ><div className="headCell" >{Resources['description'][currentLanguage]}</div></th>
                            <th ><div className="headCell" >{Resources['completedQuantity'][currentLanguage]}</div></th>
                            <th><div className="headCell">{Resources['paymentPercent'][currentLanguage]}</div></th>
                            <th ><div className="headCell" >{Resources['addedBy'][currentLanguage]}</div></th>
                            <th ><div className="headCell" >{Resources['addedDate'][currentLanguage]}</div></th>
                            <th ><div className="headCell" >{Resources['comment'][currentLanguage]}</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.paymentRequestItemsHistory.map(i =>
                            <tr key={i.id}>
                                <Fragment>
                                    <td ><div className="contentCell">{i.description}</div> </td>
                                    <td ><div className="contentCell">{i.completedQnty}</div> </td>
                                    <td ><div className="contentCell">{i.paymentPercent}</div> </td>
                                    <td ><div className="contentCell">{i.addedByName}</div> </td>
                                    <td ><div className="contentCell">{moment(i.addedDate).format('DD/MM/YYYY')}</div> </td>
                                    <td ><div className="contentCell">{i.comment}</div> </td>
                                </Fragment>

                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        let approvedSummaries = this.state.isLoading === false ?
            <Fragment>
                <header>
                    <h2 className="zero">{Resources['interimPaymentCertificate'][currentLanguage]}</h2>
                </header>
                <table className="attachmentTable " key="interimPaymentCertificate">
                    <thead>
                        <tr>
                            <td width="15%" >{Resources['JobBuilding'][currentLanguage]}</td>
                            {this.state.approvedInvoicesParent.map(i =>
                                <td >{i.details.slice(0, i.details.lastIndexOf('-'))}</td>
                            )}
                            <td width="10%" >{Resources['total'][currentLanguage]} </td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.approvedInvoicesChilds.map(i =>
                            <tr>
                                <td >{i.building.slice(0, i.building.lastIndexOf('-'))}</td>

                                {this.state.approvedInvoicesParent.map(data =>
                                    <td>{parseFloat(i[data.details]).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                )}
                                <td >{parseFloat(i.rowTotal).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ,')}</td>

                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr style={{ backgroundColor: 'whitesmoke', color: 'black' }}>
                            <td width="15%">{Resources['total'][currentLanguage]}</td>
                            {this.state.approvedInvoicesParent.map(i =>
                                <td >{parseFloat(i.total.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                            )}
                            <td >{this.state.rowTotal} </td>
                        </tr>
                    </tfoot>
                </table>
            </Fragment>
            : <LoadingSection />

        return (
            <div className="mainContainer">

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <div className="submittalHead">
                        <h2 className="zero">{Resources.paymentRequisitions[currentLanguage]}
                            <span>{projectName.replace(/_/gi, ' ')} · {Resources.contracts[currentLanguage]}</span>
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

                        <div className="step-content">
                            {this.state.FirstStep ?
                                <Fragment>
                                    <div id="step1" className="step-content-body">
                                        <div className="subiTabsContent">
                                            <div className="document-fields">
                                                <Formik
                                                    initialValues={{ ...this.state.document }}
                                                    validationSchema={validationSchema}
                                                    enableReinitialize={this.props.changeStatus}
                                                    onSubmit={(values) => {
                                                        if (this.props.changeStatus === false && this.state.docId === 0) {
                                                            this.saveVariationOrder();
                                                        } else {
                                                            this.NextStep();
                                                        }
                                                    }}  >

                                                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                        <Form id="InspectionRequestForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                                            <div className="proForm first-proform">

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                                    <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                        <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                                            placeholder={Resources.subject[currentLanguage]}
                                                                            autoComplete='off'
                                                                            value={this.state.document.subject}
                                                                            onBlur={(e) => {
                                                                                handleBlur(e)
                                                                                handleChange(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'subject')} />
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
                                                                    <DatePicker title='docDate'
                                                                        format={'DD/MM/YYYY'}
                                                                        onChange={e => setFieldValue('docDate', e)}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.docDate}
                                                                        touched={touched.docDate}
                                                                        name="docDate"
                                                                        startDate={this.state.document.docDate}
                                                                        handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                                </div>

                                                                <div className="linebylineInput  account__checkbox">
                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">{Resources.collectedStatus[currentLanguage]}</label>
                                                                        <div className="ui checkbox radio radioBoxBlue">
                                                                            <input type="radio" name="PR-collected" defaultChecked={this.state.document.collected === false ? null : 'checked'} value="1" onChange={e => this.handleChange(e, 'collected')} />
                                                                            <label>{Resources.yes[currentLanguage]}</label>
                                                                        </div>
                                                                        <div className="ui checkbox radio radioBoxBlue">
                                                                            <input type="radio" name="PR-collected" defaultChecked={this.state.document.collected === false ? 'checked' : null} value="0" onChange={e => this.handleChange(e, 'collected')} />
                                                                            <label>{Resources.no[currentLanguage]}</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">{Resources.useCommulative[currentLanguage]}</label>
                                                                        <div className="ui checkbox radio radioBoxBlue">
                                                                            <input type="radio" name="PR-useCommulativeValue" defaultChecked={this.state.document.useCommulativeValue === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'useCommulativeValue')} />
                                                                            <label>{Resources.yes[currentLanguage]}</label>
                                                                        </div>
                                                                        <div className="ui checkbox radio radioBoxBlue">
                                                                            <input type="radio" name="PR-useCommulativeValue" defaultChecked={this.state.document.useCommulativeValue === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'useCommulativeValue')} />
                                                                            <label>{Resources.no[currentLanguage]}</label>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input">

                                                                    <label className="control-label">{Resources.arrange[currentLanguage]}</label>

                                                                    <div className="ui input inputDev"  >

                                                                        <input type="text" className="form-control" id="arrange" readOnly
                                                                            value={this.state.document.arrange}
                                                                            name="arrange"
                                                                            placeholder={Resources.arrange[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'arrange')} />
                                                                    </div>
                                                                </div>

                                                                {this.props.changeStatus === true ?
                                                                    <div className="proForm first-proform letterFullWidth proform__twoInput">

                                                                        <div className="linebylineInput valid-input">
                                                                            <label className="control-label">{Resources.contractName[currentLanguage]}</label>
                                                                            <div className="ui input inputDev"  >
                                                                                <input type="text" className="form-control" id="contractSubject" readOnly
                                                                                    value={this.state.document.contractName}
                                                                                    name="contractSubject" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <div className="linebylineInput valid-input">
                                                                        <Dropdown
                                                                            title="contractName"
                                                                            data={this.state.contractsPos}
                                                                            selectedValue={this.state.selectContract}
                                                                            handleChange={event => this.handleChangeDropDownContract(event, 'contractId', 'selectContract')}
                                                                            index="contractId"
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}
                                                                            error={errors.contractId}
                                                                            touched={touched.contractId}
                                                                            isClear={false}
                                                                            name="contractId" />
                                                                    </div>
                                                                }
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.advancePaymentPercent[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev" + (errors.advancePaymentPercent && touched.advancePaymentPercent ? (" has-error") : "ui input inputDev")} >
                                                                        <input type="text" className="form-control"
                                                                            value={this.state.document.advancePaymentPercent}
                                                                            name="advancePaymentPercent"
                                                                            placeholder={Resources.advancePaymentPercent[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'advancePaymentPercent')} />
                                                                        {touched.advancePaymentPercent ? (<em className="pError">{errors.advancePaymentPercent}</em>) : null}

                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.retainagePercent[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev" + (errors.retainagePercent && touched.retainagePercent ? (" has-error") : "ui input inputDev")} >
                                                                        <input type="text" className="form-control" id="retainagePercent" name="retainagePercent" readOnly
                                                                            value={this.state.document.retainagePercent}
                                                                            placeholder={Resources.retainagePercent[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'retainagePercent')} />
                                                                        {touched.retainagePercent ? (<em className="pError">{errors.retainagePercent}</em>) : null}

                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.tax[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev" + (errors.tax && touched.tax ? (" has-error") : "ui input inputDev")} >
                                                                        <input type="text" className="form-control" id="tax" name="tax" readOnly
                                                                            value={this.state.document.tax}
                                                                            placeholder={Resources.tax[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'tax')} />
                                                                        {touched.tax ? (<em className="pError">{errors.tax}</em>) : null}

                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.vat[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev" + (errors.vat && touched.vat ? (" has-error") : "ui input inputDev")} >
                                                                        <input type="text" className="form-control" id="vat" name="vat" readOnly
                                                                            value={this.state.document.vat}
                                                                            placeholder={Resources.vat[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'vat')} />
                                                                        {touched.vat ? (<em className="pError">{errors.vat}</em>) : null}

                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.insurance[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev" + (errors.insurance && touched.insurance ? (" has-error") : "ui input inputDev")} >
                                                                        <input type="text" className="form-control" id="insurance" name="insurance"
                                                                            value={this.state.document.insurance}
                                                                            placeholder={Resources.insurance[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'insurance')} />
                                                                        {touched.insurance ? (<em className="pError">{errors.insurance}</em>) : null}

                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.actualPayment[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev" + (errors.actualPayment && touched.actualPayment ? (" has-error") : "ui input inputDev")} >
                                                                        <input type="text" className="form-control" id="actualPayment" name="actualPayment"
                                                                            value={this.state.document.actualPayment}
                                                                            placeholder={Resources.actualPayment[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'actualPayment')} />
                                                                        {touched.actualPayment ? (<em className="pError">{errors.actualPayment}</em>) : null}

                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.remainingPayment[currentLanguage]}</label>
                                                                    <div className="ui input inputDev"   >
                                                                        <input type="text" className="form-control" name="remainingPayment"
                                                                            value={this.state.document.remainingPayment}
                                                                            placeholder={Resources.remainingPayment[currentLanguage]}
                                                                            onChange={(e) => this.handleChange(e, 'remainingPayment')} />

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="slider-Btns">
                                                                {this.state.isLoading === false ? this.showBtnsSaving()
                                                                    :
                                                                    (
                                                                        <button className="primaryBtn-1 btn  disabled" disabled="disabled">
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
                                </Fragment>
                                : null
                            }
                            {this.state.SecondStep ?
                                <Fragment>
                                    <div className="subiTabsContent feilds__top">

                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['AddedItems'][currentLanguage]}</h2>
                                            </header>
                                            {this.state.editRows.length > 0 ?
                                                <div className="doc-pre-cycle">
                                                    <div className="slider-Btns editableRows">
                                                        <span>No.Update Rows.{this.state.editRows.length}</span>
                                                        <button className="primaryBtn-1 btn meduimBtn" onClick={this.editRowsClick}>{Resources['edit'][currentLanguage]}</button>

                                                    </div>

                                                </div>
                                                : null}
                                            {ItemsGrid}
                                        </div>
                                    </div>

                                </Fragment>
                                : null
                            }

                            {this.state.ThirdStep ?

                                <Fragment>
                                    <div className="subiTabsContent feilds__top">

                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['interimPaymentCertificate'][currentLanguage]}</h2>
                                            </header>
                                            <table className="attachmentTable" key="interimPaymentCertificate">
                                                <thead>
                                                    <tr>
                                                        <th colSpan="6">
                                                            <div className="headCell">
                                                                {Resources['workDescription'][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th>
                                                            <div className="headCell">
                                                                {Resources['previous'][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th>
                                                            <div className="headCell">
                                                                {Resources['current'][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th>
                                                            <div className="headCell">
                                                                {Resources['total'][currentLanguage]}
                                                            </div>
                                                        </th>
                                                        <th>

                                                            <div className="headCell">
                                                                {Resources['comments'][currentLanguage]}
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {interimTable}
                                                </tbody>
                                            </table>
                                            {approvedSummaries}
                                        </div>

                                    </div>

                                </Fragment>
                                : null
                            }

                            {this.state.FourthStep ?

                                <Fragment>
                                    <div className="subiTabsContent feilds__top">
                                        <header>
                                            <h2 className="zero">{Resources['deductions'][currentLanguage]}</h2>
                                        </header>

                                        <div className="document-fields">
                                            <Formik
                                                initialValues={{ ...this.state.documentDeduction }}
                                                validationSchema={validationDeductionSchema}
                                                enableReinitialize={true}
                                                onSubmit={(values) => {
                                                    this.addDeduction();
                                                }}  >

                                                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                    <Form id="deductionForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                        <div className="proForm datepickerContainer">
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                                <div className="ui input inputDev" >
                                                                    <input type="text" className="form-control" id="title" name="title"
                                                                        value={this.state.documentDeduction.title}
                                                                        placeholder={Resources.description[currentLanguage]}
                                                                        onBlur={(e) => {
                                                                            handleChange(e)
                                                                            handleBlur(e)
                                                                        }}
                                                                        onChange={(e) => this.handleChangeItem(e, 'title')} />
                                                                    {touched.title ? (<em className="pError">{errors.title}</em>) : null}

                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.deductions[currentLanguage]}</label>
                                                                <div className={"ui input inputDev" + (errors.deductionValue && touched.deductionValue ? (" has-error") : "ui input inputDev")} >
                                                                    <input type="text" className="form-control" id="deductionValue" name="deductionValue"
                                                                        value={this.state.documentDeduction.deductionValue}
                                                                        placeholder={Resources.deductions[currentLanguage]}
                                                                        onBlur={(e) => {
                                                                            handleChange(e)
                                                                            handleBlur(e)
                                                                        }}
                                                                        onChange={(e) => this.handleChangeItem(e, 'deductionValue')} />
                                                                    {touched.deductionValue ? (<em className="pError">{errors.deductionValue}</em>) : null}

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="slider-Btns">
                                                            {this.state.isLoading === false ?
                                                                <button className="primaryBtn-1 btn meduimBtn">{Resources['save'][currentLanguage]}</button>
                                                                :
                                                                (
                                                                    <button className="primaryBtn-1 btn  disabled" disabled="disabled">
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

                                        <div className="doc-pre-cycle">
                                            <table className="attachmentTable" key="DeductionsCertificate">
                                                <thead>
                                                    <tr>
                                                        <th><div className="headCell">{Resources['description'][currentLanguage]}</div>
                                                        </th>
                                                        <th><div className="headCell">{Resources['deductions'][currentLanguage]}</div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {deductionTable}
                                                </tbody>
                                            </table>
                                            <div className="slider-Btns">
                                                <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>{Resources['next'][currentLanguage]}</button>
                                            </div>
                                        </div>
                                    </div>

                                </Fragment>
                                : null
                            }
                        </div>
                        <div className="docstepper-levels">
                            {/* Next & Previous */}
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={!this.state.FirstStep && this.state.docId !== 0 ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}><i className="fa fa-caret-left" aria-hidden="true"></i>{Resources.previous[currentLanguage]}</span>

                                <span onClick={this.NextTopStep} className={!this.state.FourthStepComplate && this.state.docId !== 0 ? "step-content-btn-prev "
                                    : "step-content-btn-prev disabled"}>{Resources.next[currentLanguage]}<i className="fa fa-caret-right" aria-hidden="true"></i>
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
                                            <h6>{Resources.paymentRequisitions[currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div data-id="step2 " className={'step-slider-item ' + (this.state.SecondStepComplate ? 'active' : this.state.SecondStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources.items[currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div data-id="step2 " className={'step-slider-item ' + (this.state.ThirdStepComplate ? 'active' : this.state.ThirdStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>3</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources.summaries[currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div data-id="step2 " className={'step-slider-item ' + (this.state.FourthStepComplate ? 'active' : this.state.FourthStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>4</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources.deductions[currentLanguage]}</h6>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
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
                    </div>
                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {this.state.currentComponent}
                    </SkyLight>
                </div>

                <div className="largePopup largeModal " style={{ display: this.state.showBoqModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.boqTypeModal = ref} title={Resources.boqType[currentLanguage]}>
                        {BoqTypeContent}
                    </SkyLight>
                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showCommentModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.addCommentModal = ref} title={Resources.comments[currentLanguage]}>
                        <div className="proForm datepickerContainer">
                            <div className="linebylineInput valid-input mix_dropdown">

                                <div className="letterFullWidth">
                                    <label className="control-label">{Resources.comment[currentLanguage]}</label>
                                    <div className="inputDev ui input">
                                        <RichTextEditor
                                            value={this.state.comment}
                                            onChange={this.onChangeMessage.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="primaryBtn-1 btn " onClick={(e) => this.addCommentClick(e)} >{Resources.save[currentLanguage]}</button>

                    </SkyLight>
                </div>

                <div className="largePopup largeModal " style={{ display: this.state.showViewHistoryModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.ViewHistoryModal = ref} title={Resources.viewHistory[currentLanguage]}>
                        {viewHistory}
                    </SkyLight>
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
        items: state.communication.items
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
)(withRouter(requestPaymentsAddEdit))
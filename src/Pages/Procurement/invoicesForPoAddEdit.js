import React, { Component } from "react";

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

import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import * as communicationActions from '../../store/actions/communication';

import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";

import SkyLight from 'react-skylight';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'

import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";

import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({

    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage])
        .nullable(true),

    toContactId: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage])

})


const AprovalsData = [
    { label: Resources.pending[currentLanguage], value: null },
    { label: Resources.approved[currentLanguage], value: "true" },
    { label: Resources.rejected[currentLanguage], value: "false" }
];

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')


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
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 72,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},

            permission: [{ name: 'sendByEmail', code: 54 }, { name: 'sendByInbox', code: 53 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 956 },
            { name: 'createTransmittal', code: 3042 }, { name: 'sendToWorkFlow', code: 707 },
            { name: 'viewAttachments', code: 3317 }, { name: 'deleteAttachments', code: 840 }],


            selectedCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },

            selectedPurchaseOrders: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },

            selectedBOQCostCoding: { label: Resources.fromContactRequired[currentLanguage], value: "0" },

            selectedBoqItem: { label: Resources.toContactRequired[currentLanguage], value: "0" },

            selectedTransactionType: { label: Resources.disciplineRequired[currentLanguage], value: "0" },

            selectedApprovalStatus: { label: Resources.disciplineRequired[currentLanguage], value: "0" },

            CompaniesData: [],
            PurchaseOrdersData: [],
            BOQCostCodingData: [],
            BoqItemData: [],
            TransactionTypeData: [],
        }

        if (!Config.IsAllow(48) && !Config.IsAllow(49) && !Config.IsAllow(51)) {
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

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            this.setState({
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow,
                message: nextProps.document.message
            });
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }

        if (this.state.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
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
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }

        if (this.state.showModal != this.props.showModal) {
            this.setState({ showModal: this.props.showModal });
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(49))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(49)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(49)) {
                    if (this.props.document.status !== false && Config.IsAllow(49)) {
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
            let url = "GetLettersById?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'lettertitle');

        } else {
            let letter = {
                subject: '',
                id: 0,
                projectId: this.state.projectId,
                arrange: '',
                fromCompanyId: '',
                fromContactId: '',
                toCompanyId: '',
                toContactId: '',
                replayId: '',
                docDate: moment(),
                status: 'false',
                disciplineId: '',
                refDoc: '',
                sharedSettings: '',
                message: ''
            };
            this.setState({ document: letter });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    };

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
                let id = this.props.document.fromCompanyId;
                if (id) {
                    this.setState({
                        selectedBOQCostCo: { label: this.props.document.fromCompanyName, value: id }
                    });
                    this.fillSubDropDownInEdit('GetContractsBoqItems', 'boqId', id, 'fromContactId', 'selectedBoqItem', 'fromContacts', 'details', 'id');
                }
            }
            this.setState({
                BOQCostCodingData: [...result]
            });
        });



        dataservice.GetDataList('GetProjectProjectsCompaniesForList?projectId= ' + this.state.projectId, 'companyName', 'companyId').then(result => {
            if (isEdit) {
                let id = this.props.document.disciplineId;
                let discpline = {};
                if (id) {
                    discpline = _.find(result, function (i) { return i.value == id });

                    this.setState({
                        selectedCompany: discpline
                    });
                }
            }
            this.setState({
                CompaniesData: [...result]
            });
        })

        dataservice.GetDataList('GetContractsPurchaseOrders?projectId=' + this.state.projectId + '&pageNumber=0&pageSize=1000000', 'subject', 'id').then(
            result => {
                if (isEdit) {
                    let id = this.props.document.replyId;
                    let replyLetter = {};
                    if (id) {
                        replyLetter = _.find(result, function (i) { return i.value == id });
                        this.setState({
                            selectedPurchaseOrders: replyLetter
                        });
                    }
                }
                this.setState({
                    PurchaseOrdersData: result.data
                });
            })
        this.checkDocumentIsView();



        dataservice.GetDataList('GetAccountsDefaultList?listType=transactiontype&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
            if (isEdit) {
                let id = this.props.document.replyId;
                let replyLetter = {};
                if (id) {
                    replyLetter = _.find(result, function (i) { return i.value == id; });
                    this.setState({
                        selectedTransactionType: replyLetter
                    });
                }
            }
            this.setState({
                TransactionTypeData: result
            });
        })

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
        console.log(field, e);
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
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
        });

        if (field == "fromContactId") {
            let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + event.value;
            this.props.actions.GetNextArrange(url);
            dataservice.GetNextArrangeMainDocument(url).then(res => {
                updated_document.arrange = res;
                updated_document = Object.assign(original_document, updated_document);

                this.setState({
                    document: updated_document
                });
            })
        }
        if (isSubscrib) {
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'contactName', 'id').then(result => {
                this.setState({
                    [targetState]: result
                });
            });
        }
    }

    editLetter(event) {
        this.setState({
            isLoading: true
        });

        dataservice.addObject('EditLetterById', this.state.document).then(result => {
            this.setState({
                isLoading: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

            this.props.history.push({
                pathname: "/Letters/" + this.state.projectId
            });
        });
    }

    saveLetter(event) {
        this.setState({
            isLoading: true
        });
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate).format('MM/DD/YYYY');

        dataservice.addObject('AddLetters', saveDocument).then(result => {
            this.setState({
                docId: result,
                isLoading: false
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    saveAndExit(event) {
        this.props.history.push({
            pathname: "/Letters/" + this.state.projectId
        });
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0 && this.props.changeStatus === false) {
            btn = <button className="primaryBtn-1 btn mediumBtn" type="submit" >{Resources.saveAndExit[currentLanguage]}</button>
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
        if (item.title == "sendToWorkFlow") { this.props.actions.SendingWorkFlow(true); }
        if (item.value != "0") {
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })
            this.simpleDialog.show()
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
        return (
            <div className="mainContainer">

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} docTitle={Resources.lettertitle[currentLanguage]} moduleTitle={Resources['communication'][currentLanguage]} />
                    <div className="doc-container">
                        {
                            this.props.changeStatus == true ?
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">
                                            {Resources.goEdit[currentLanguage]}
                                        </h2>
                                        <p className="doc-infohead"><span> {this.state.document.refDoc}</span> - <span> {this.state.document.arrange}</span> - <span>{moment(this.state.document.docDate).format('DD/MM/YYYY')}</span></p>
                                    </div>
                                </header>
                                : null
                        }
                        <div className="step-content">
                            <div id="step1" className="step-content-body">
                                <div className="subiTabsContent">
                                    <div className="document-fields">
                                        <Formik
                                            initialValues={{ ...this.state.document }}
                                            validationSchema={validationSchema}
                                            enableReinitialize={true}
                                            onSubmit={(values) => {
                                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                                    this.editLetter();
                                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                    this.saveLetter();
                                                } else {
                                                    this.saveAndExit();
                                                }
                                            }}  >

                                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form id="letterForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

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
                                                                startDate={this.state.document.docDate}
                                                                handleChange={e => this.handleChangeDate(e, 'docDate')} />
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

                                                        <div className="linebylineInput valid-input linebylineInput__name">
                                                            <label className="control-label">{Resources.comment[currentLanguage]}</label>
                                                            <div className="ui input inputDev"  >
                                                                <input type="text" className="form-control" id="comment"
                                                                    value={this.state.document.comment}
                                                                    name="comment"
                                                                    placeholder={Resources.comment[currentLanguage]}
                                                                    onChange={(e) => this.handleChange(e, 'comment')} />
                                                            </div>
                                                        </div>


                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="purchaseOrder"
                                                                data={this.state.PurchaseOrdersData}
                                                                selectedValue={this.state.selectedPurchaseOrders}
                                                                handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedPurchaseOrders')}
                                                                index="letter-discipline"
                                                            />
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="CompanyName"
                                                                data={this.state.CompaniesData}
                                                                selectedValue={this.state.selectedCompany}
                                                                handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedCompany')}
                                                                index="letter-discipline"
                                                            />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="BOQCostCoding"
                                                                data={this.state.BOQCostCodingData}
                                                                selectedValue={this.state.selectedBOQCostCoding}
                                                                handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedBOQCostCoding')}
                                                                index="letter-discipline"
                                                            />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.costCoding[currentLanguage]}</label>
                                                            <div className="shareLinks">
                                                                <div className="inputDev ui input">
                                                                    <input type="text" className="form-control" id="sharedSettings"
                                                                        onChange={(e) => this.handleChange(e, 'sharedSettings')}
                                                                        value={this.state.document.sharedSettings}
                                                                        name="sharedSettings"
                                                                        placeholder={Resources.costCoding[currentLanguage]} />
                                                                </div>
                                                                <div onClick={e => alert('AA')}>
                                                                    <span className="collapseIcon"><span className="plusSpan greenSpan">+</span>
                                                                        <span>{Resources.add[currentLanguage]}</span>  </span>
                                                                </div>
                                                            </div>

                                                        </div>







                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="boqItem"
                                                                data={this.state.BoqItemData}
                                                                selectedValue={this.state.selectedBoqItem}
                                                                handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedBoqItem')}
                                                                index="letter-discipline"
                                                            />
                                                        </div>


                                                        <div className="proForm first-proform">

                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.collectedStatus[currentLanguage]}</label>
                                                                <div className="ui checkbox radio radioBoxBlue">
                                                                    <input type="radio" name="collectedStatus"
                                                                        onBlur={e => this.handleChange(e, 'collectedStatus')} defaultChecked={this.state.document.collectedStatus === false ? null : 'checked'}
                                                                        value="true" onChange={e => this.handleChange(e, 'collectedStatus')} />
                                                                    <label>{Resources.yes[currentLanguage]}</label>
                                                                </div>
                                                                <div className="ui checkbox radio radioBoxBlue">
                                                                    <input type="radio" name="collectedStatus"
                                                                        onBlur={e => this.handleChange(e, 'collectedStatus')} defaultChecked={this.state.document.collectedStatus === false ? 'checked' : null}
                                                                        value="false" onChange={e => this.handleChange(e, 'collectedStatus')} />
                                                                    <label>{Resources.no[currentLanguage]}</label>
                                                                </div>
                                                            </div>

                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.canceled[currentLanguage]}</label>
                                                                <div className="ui checkbox radio radioBoxBlue">
                                                                    <input type="radio" name="canceled" onBlur={e => this.handleChange(e, 'canceled')} defaultChecked={this.state.document.canceled === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'canceled')} />
                                                                    <label>{Resources.yes[currentLanguage]}</label>
                                                                </div>
                                                                <div className="ui checkbox radio radioBoxBlue">
                                                                    <input type="radio" name="canceled" onBlur={e => this.handleChange(e, 'canceled')} defaultChecked={this.state.document.canceled === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'canceled')} />
                                                                    <label>{Resources.no[currentLanguage]}</label>
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="transactionType"
                                                                data={this.state.TransactionTypeData}
                                                                selectedValue={this.state.selectedTransactionType}
                                                                handleChange={event => this.handleChangeDropDown(event, 'replyId', false, '', '', '', 'selectedTransactionType')}
                                                                index="letter-replyId" />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="approvalStatus"
                                                                data={AprovalsData}
                                                                selectedValue={this.state.selectedApprovalStatus}
                                                                handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedApprovalStatus')}
                                                                index="letter-discipline"
                                                            />
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
                                                            </button> :
                                                            this.showBtnsSaving()}
                                                    </div>
                                                    {
                                                        this.props.changeStatus === true ?
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
                                                                        <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} >{Resources.save[currentLanguage]}</button>
                                                                    }
                                                                    {this.state.isApproveMode === true ?
                                                                        <div >
                                                                            <button className="primaryBtn-1 btn " type="button" onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                                            <button className="primaryBtn-2 btn middle__btn" type="button" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                                                        </div>
                                                                        : null
                                                                    }
                                                                    <button type="button" className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                                                    <button type="button" className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                                                                    <span className="border"></span>
                                                                    <div className="document__action--menu">
                                                                        <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            : null
                                                    }
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
                        </div>
                    </div>

                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {this.state.currentComponent}
                    </SkyLight>
                </div>
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
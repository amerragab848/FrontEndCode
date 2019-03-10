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

import ModernDatepicker from 'react-modern-datepicker';
import { withRouter } from "react-router-dom";

import RichTextEditor from 'react-rte';

import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux'; 

import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";

import NotifiMsg from '../../Componants/publicComponants/NotifiMsg'
import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({

    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    arrange: Yup.number(Resources['onlyNumbers'][currentLanguage])
        .required(Resources['arrangeRequired'][currentLanguage]),

    refDoc: Yup.string().required(Resources['refDoc'][currentLanguage]),

    fromCompanyId: Yup.string() 
        .required(Resources['fromCompanyRequired'][currentLanguage]),

    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),

    toCompanyId: Yup.string() 
        .required(Resources['toCompanyRequired'][currentLanguage]),

    toContactId: Yup.string() 
        .required(Resources['toContactRequired'][currentLanguage])

})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')
class LettersAddEdit extends Component {

    constructor(props) {

        super(props);
        // console.log(this.props.location.search);
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
            isViewMode: false,
            isApproveMode: isApproveMode,
            addComplete: false,
            isView: false,
            docId: docId,
            docTypeId: 19,
            projectId: projectId,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            ToContacts: [],
            fromContacts: [],
            discplines: [],
            letters: [],
            permission: [{ name: 'sendByEmail', code: 54 }, { name: 'sendByInbox', code: 53 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 956 },
            { name: 'createTransmittal', code: 3042 }, { name: 'sendToWorkFlow', code: 707 },
            { name: 'viewAttachments', code: 3317 }, { name: 'deleteAttachments', code: 840 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            selectedReplyLetter: { label: Resources.replyletter[currentLanguage], value: "0" },
            message: RichTextEditor.createEmptyValue()
        }

        if (!Config.IsAllow(48) || !Config.IsAllow(49) || !Config.IsAllow(51)) {
            //alert('Dont have Permissions');
            // this.props.history.push({
            //     pathname: "/Letters/"+projectId 
            // });
            this.props.history.goBack();
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
        this.checkDocumentIsView();
    };

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.document && nextProps.document.id) {
            this.setState({
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow
            });
            this.checkDocumentIsView();
        }
    };

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(49))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(49)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(49)) {
                    if (this.props.document.status == true && Config.IsAllow(49)) {
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
            this.props.actions.documentForEdit(url);

            if (Config.IsAllow(48) || Config.IsAllow(49) || Config.IsAllow(51)) {

            }
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
                docDate: '',
                status: 'false',
                disciplineId: '',
                refDoc: '',
                sharedSettings: '',
                message: RichTextEditor.createEmptyValue()
            };

            this.setState({ document: letter });
            this.fillDropDowns(false);
        }
    };

    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
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
        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId').then(result => {
            let selectedCompany = {};
            let selectedToCompany = {};
            if (isEdit) {
                let companyId = this.props.document.fromCompanyId;
                if (companyId) {
                    this.setState({
                        selectedFromCompany: { label: this.props.document.fromCompanyName, value: companyId }
                    });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', companyId, 'fromContactId', 'selectedFromContact', 'fromContacts');
                }

                let toCompanyId = this.props.document.toCompanyId;
                if (toCompanyId) {
                    this.setState({
                        selectedToCompany: { label: this.props.document.toCompanyName, value: toCompanyId }
                    });

                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', toCompanyId, 'toContactId', 'selectedToContact', 'ToContacts');
                }
            }
            this.setState({
                companies: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=discipline", 'title', 'id').then(result => {
            if (isEdit) {
                let disciplineId = this.props.document.disciplineId;
                let discpline = {};
                if (disciplineId) {
                    discpline = _.find(result, function (i) { return i.value == disciplineId; });

                    this.setState({
                        selectedDiscpline: discpline
                    });
                }
            }
            this.setState({
                discplines: [...result]
            });
        });

        dataservice.GetDataList("GetLettersByProjectId?projectId=" + this.state.projectId + "&pageNumber=0&pageSize=100", 'subject', 'id').then(result => {
            if (isEdit) {
                let replyId = this.props.document.replyId;
                let replyLetter = {};
                if (replyId) {
                    replyLetter = _.find(result, function (i) { return i.value == replyId; });
                    this.setState({
                        [replyLetter]: replyLetter
                    });
                }
            }
            this.setState({
                letters: [...result]
            });
        });
    }

    onChangeMessage = (value) => {
        let isEmpty = !value.getEditorState().getCurrentContent().hasText();
        if (isEmpty === false) {

            this.setState({ message: value });
            if (value.toString('markdown').length > 1) {

                let original_document = { ...this.state.document };

                let updated_document = {};

                updated_document.message = value.toString('markdown');

                updated_document = Object.assign(original_document, updated_document);

                this.setState({
                    document: updated_document
                });
                // console.log(updated_document);
                // console.log(value.toString('markdown'));
                // if (this.props.onChange) {
                //     // Send the changes up to the parent component as an HTML string.
                //     // This is here to demonstrate using `.toString()` but in a real app it
                //     // would be better to avoid generating a string on each change.
                //     this.props.onChange(value.toString('html'));
                // }
            }

        }

    };

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

        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {

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

        // dataservice.addObject('EditLetterById', this.state.document).then(result => {
        //     this.setState({
        //         isLoading: true,
        //         addComplete: true
        //     });
        //     this.props.history.push({
        //         pathname: "/Letters/" + this.state.projectId
        //     });
        // });
    }

    saveLetter(event) {
        let saveDocument = { ...this.state.document };

        console.log('valid');

        saveDocument.docDate = moment(saveDocument.docDate).format('DD/MM/YYYY');

        console.log(saveDocument);
        dataservice.addObject('AddLetters', saveDocument).then(result => {
            this.setState({
                docId: result
            });
        }); 
    }

    saveAndExit(event) {
        let letter = { ...this.state.document };
        console.log(letter);
        this.props.history.push({
            pathname: "/Letters",
            search: "?projectId=" + this.state.projectId
        });
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type='submit' onClick={e => this.saveLetter(e)}>{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0 && this.props.changeStatus === false) {
            btn = <button className="primaryBtn-1 btn mediumBtn" type='submit' onClick={e => this.saveAndExit(e)}>{Resources.saveAndExit[currentLanguage]}</button>
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

    render() {
        return (
            <div className="mainContainer">
                {
                    this.state.addComplete === true ?
                        <NotifiMsg showNotify={this.state.addComplete} IsSuccess={true} Msg={Resources['smartSentAccountingMessage'][currentLanguage].successTitle} /> :
                        null
                }
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>

                    <div className="submittalHead">
                        <h2 className="zero">{Resources.lettertitle[currentLanguage]}
                            <span>{projectName.replace(/_/gi, ' ')} · Communication</span>
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
                                            
                                            onReset={(values) => { }} >
                                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
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
                                                                    onChange={(e) =>
                                                                        this.handleChange(e, 'subject')} />
                                                                {errors.subject && touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
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

                                                        <div className="linebylineInput valid-input">
                                                            <div className="inputDev ui input input-group date NormalInputDate">
                                                                <div className="customDatepicker fillter-status fillter-item-c ">
                                                                    <div className="proForm datepickerContainer">
                                                                        <label className="control-label">{Resources.docDate[currentLanguage]}</label>
                                                                        <div className="linebylineInput" >
                                                                            <div className="inputDev ui input input-group date NormalInputDate">
                                                                                <ModernDatepicker
                                                                                    date={this.state.document.docDate}
                                                                                    format={'DD-MM-YYYY'}
                                                                                    showBorder
                                                                                    onChange={e => this.handleChangeDate(e, 'docDate')}
                                                                                    placeholder={'Select a date'}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                            <div className={"ui input inputDev " + (errors.subject && touched.subject ? (" has-error") : " ")} >

                                                                <input type="text" className="form-control" id="arrange"
                                                                    value={this.state.document.arrange}
                                                                    name="arrange"
                                                                    placeholder={Resources.arrange[currentLanguage]}
                                                                    onBlur={(e) => {
                                                                        handleChange(e)
                                                                        handleBlur(e)
                                                                    }}
                                                                    onChange={(e) => this.handleChange(e, 'arrange')} />
                                                                {errors.arrange ? (<em className="pError">{errors.arrange}</em>) : null}

                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                                            <div className={errors.subject && touched.subject ?
                                                                ("ui input inputDev has-error") : "ui input inputDev"} >

                                                                <input type="text" className="form-control" id="refDoc"
                                                                    value={this.state.document.refDoc}
                                                                    name="refDoc"
                                                                    placeholder={Resources.refDoc[currentLanguage]}
                                                                    onBlur={(e) => {
                                                                        handleChange(e)
                                                                        handleBlur(e)
                                                                    }}
                                                                    onChange={(e) => this.handleChange(e, 'refDoc')} />

                                                                {errors.refDoc && touched.refDoc ? (<em className="pError">{errors.refDoc}</em>) : null}

                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.sharedSettings[currentLanguage]}</label>
                                                            <div className="shareLinks">
                                                                <div className="inputDev ui input">
                                                                    <input type="text" className="form-control" id="sharedSettings"

                                                                        onChange={(e) => this.handleChange(e, 'sharedSettings')}
                                                                        value={this.state.document.sharedSettings}
                                                                        name="sharedSettings"
                                                                        placeholder={Resources.sharedSettings[currentLanguage]} />

                                                                </div>
                                                                <a data-bind="attr: { href: sharedSettings }" target="_blank"><span data-bind="text: $root.language.openFolder[$root.currentLanguage()]">Open Link</span></a>

                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <div className={"ui input inputDev fillter-item-c" + ((errors.fromCompanyId && touched.fromCompanyId) ? " has-error" : (!errors.fromCompanyId && !touched.fromCompanyId) ? (" has-success") : " ")}>
                                                                <Dropdown
                                                                    title="fromCompany"
                                                                    data={this.state.companies}
                                                                    isMulti={false}
                                                                    selectedValue={this.state.selectedFromCompany}
                                                                    handleBlur={setFieldValue}
                                                                    handleChange={event => {
                                                                        this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact')
                                                                    }}
                                                                    index="fromCompanyId"
                                                                    name="fromCompanyId"
                                                                    id="fromCompanyId" /> 
                                                                {(touched.fromCompanyId && errors.fromCompanyId  ) ? ( <em className="pError">{errors.fromCompanyId}</em>) : null}
                                                                {/* {JSON.stringify(touched)} */}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <div className={"ui input inputDev fillter-item-c " + (this.state.document.fromContactId ? (" has-error") : !errors.fromContactId ? (" has-success") : " ")}>
                                                                <Dropdown
                                                                    title="fromContact"
                                                                    isMulti={false}
                                                                    data={this.state.fromContacts}
                                                                    selectedValue={this.state.selectedFromContact}

                                                                    handleBlur={handleBlur}  
                                                                    handleChange={event => this.handleChangeDropDown(event, 'fromContactId', false, '', '', '', 'selectedFromContact')}
                                                                    index="letter-fromContact" 
                                                                    name="fromCompanyId"
                                                                    id="fromCompanyId" />
                                                                {touched.fromContactId ? (<em className="pError">{errors.fromContactId}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <div className={"ui input inputDev fillter-item-c " + (errors.toCompanyId && touched.toCompanyId ? (" has-error") : !errors.toCompanyId && touched.toCompanyId ? (" has-success") : " ")}>

                                                                <Dropdown
                                                                    title="toCompany" 
                                                                    isMulti={false}
                                                                    data={this.state.companies}
                                                                    selectedValue={this.state.selectedToCompany}
                                                                    handleChange={event =>
                                                                        this.handleChangeDropDown(event, 'toCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedToCompany', 'selectedToContact')}
                                                                    index="letter-toCompany"
                                                                    name="fromCompanyId"
                                                                    id="fromCompanyId" />
                                                                {touched.toCompanyId ? (<em className="pError">{errors.toCompanyId}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <div className={"ui input inputDev fillter-item-c " + (errors.toContactId && touched.toContactId ? (" has-error") : !errors.toContactId && touched.toContactId ? (" has-success") : "")}>
                                                                <Dropdown
                                                                    title="toContactName"
                                                                    isMulti={false}
                                                                    data={this.state.ToContacts}
                                                                    selectedValue={this.state.selectedToContact}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'toContactId', false, '', '', '', 'selectedToContact')}
                                                                    index="letter-toContactName"
                                                                    name="fromCompanyId"
                                                                    id="fromCompanyId" />
                                                                {touched.toContactId ? (<em className="pError">{errors.toContactId}</em>) : null}

                                                                {/* {JSON.stringify(errors)} */}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="discipline"
                                                                data={this.state.discplines}
                                                                selectedValue={this.state.selectedDiscpline}
                                                                handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedDiscpline')}
                                                                index="letter-discipline"
                                                            />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="replyletter"
                                                                data={this.state.letters}
                                                                selectedValue={this.state.selectedReplyLetter}
                                                                handleChange={event => this.handleChangeDropDown(event, 'replyId', false, '', '', '', 'selectedReplyLetter')}
                                                                index="letter-replyId"
                                                            />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.message[currentLanguage]}</label>
                                                            <div className="inputDev ui input">
                                                                <RichTextEditor
                                                                    value={this.state.message}
                                                                    onChange={this.onChangeMessage.bind(this)}
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="slider-Btns">
                                                        {this.showBtnsSaving()}
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik> 
                                    </div>
                                    <div className="doc-pre-cycle">
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
                        {
                            this.props.changeStatus === true ?
                                <div className="approveDocument">
                                    <h2 className="zero">ACTIONS</h2>
                                    <div className="approveDocumentBTNS">
                                        <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={e => this.editLetter(e)}>{Resources.save[currentLanguage]}</button>
                                        {this.state.isApproveMode === true ?
                                            <button className="primaryBtn-1 btn ">APPROVE</button>
                                            : null
                                        }
                                        <button className="primaryBtn-2 btn middle__btn">TO WORKFLOW</button>
                                        <button className="primaryBtn-2 btn">TO DIST. LIST</button>
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
            </div>
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
        hasWorkflow: state.communication.hasWorkflow
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
)(withRouter(LettersAddEdit))
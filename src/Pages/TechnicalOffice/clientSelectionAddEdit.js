import React, { Component } from "react";

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import TextEditor from '../../Componants/OptionsPanels/TextEditor';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import DatePicker from '../../Componants/OptionsPanels/DatePicker';
import { toast } from "react-toastify";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({

    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    refDoc: Yup.string().required(Resources['refDoc'][currentLanguage]),

    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage])
        .nullable(true),

    toContactId: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage]),

    total: Yup.string()
        .required(Resources['total'][currentLanguage])
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage])

})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
const _ = require('lodash')
class clientSelectionAddEdit extends Component {

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
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 107,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            ToContacts: [],
            fromContacts: [],
            locations: [],
            clientSelections: [],
            permission: [{ name: 'sendByEmail', code: 3153 }, { name: 'sendByInbox', code: 3152 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 3159 },
            { name: 'createTransmittal', code: 3160 }, { name: 'sendToWorkFlow', code: 3156 },
            { name: 'viewAttachments', code: 3293 }, { name: 'deleteAttachments', code: 3158 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedClientSelection: { label: Resources.clientSelectionType[currentLanguage], value: "0" },
            selectedLocation: { label: Resources.location[currentLanguage], value: "0" },
            selectedbuildingno: { label: Resources.Buildings[currentLanguage], value: "0" },
            answer: '',
        }

        if (!Config.IsAllow(3147) && !Config.IsAllow(3148) && !Config.IsAllow(3150)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/clientSelection/" + projectId
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
        this.checkDocumentIsView();
    };

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            let doc = nextProps.document
            doc.docDate = doc.docDate === null ? moment().format('YYYY-MM-DD') : moment(doc.docDate).format('YYYY-MM-DD')

            this.setState({
                document: doc,
                hasWorkflow: nextProps.hasWorkflow,
                answer: nextProps.document.answer
            });
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }
        if (this.state.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(3148))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(3148)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(3148)) {
                    if (this.props.document.status !== false && Config.IsAllow(3148)) {
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
            let url = "GetLogsClientSelectionForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'clientSelectionLog');
        } else {
            let clientSelection = {
                subject: '',
                id: 0,
                projectId: projectId,
                arrange: '',
                fromCompanyId: '',
                fromContactId: '',
                toCompanyId: '',
                toContactId: '',
                docDate: moment(),
                status: true,
                isModification: true,
                refDoc: '',
                approvalStatusId: '',
                answer: '',
                bicCompanyId: '',
                bicContactId: '',
                fileNumberId: '',
                areaId: '',
                building: '',
                unitType: '',
                apartment: '',
                location: '',
                clientName: '',
                contractId: '',
                letterDate: moment(),
                drawingDate: moment(),
                total: 0,
                letterNo: '',
                clientSelectionType: ''
            };

            this.setState({ document: clientSelection }, function () {
                this.GetNExtArrange();
            });

            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    };

    GetNExtArrange() {
        let original_document = { ...this.state.document };
        let updated_document = {};
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + this.state.document.fromContactId;
        // this.props.actions.GetNextArrange(url);
        dataservice.GetNextArrangeMainDocument(url).then(res => {
            updated_document.arrange = res;
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document
            });
        })
    }

    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = _.find(result, function (i) { return i.value == toSubField; });

                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        });
    }

    fillDropDowns(isEdit) {

        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId').then(result => {

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

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=approvalstatus", 'title', 'id').then(result => {
            if (isEdit) {
                let approvalStatusId = this.state.document.approvalStatusId;
                let approvalStatus = {};
                if (approvalStatusId) {
                    approvalStatus = _.find(result, function (i) { return i.value == approvalStatusId; });

                    this.setState({
                        selectedApprovalStatusId: approvalStatus
                    });
                }
            }
            this.setState({
                approvalstatusList: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=area", 'title', 'title').then(result => {

            this.setState({
                areas: [...result]
            });

            if (isEdit) {
                let areaId = this.props.document.area;
                let area = {};
                if (areaId) {
                    area = _.find(result, function (i) { return i.value == areaId; });

                    // area.lable = areaId;
                    // area.value = areaId;

                    this.setState({
                        selecetedArea: area
                    });
                }
            }
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=location", 'title', 'title').then(result => {


            if (isEdit) {
                let location = this.props.document.location;
                let locationObj = {};
                if (location) {
                    locationObj = _.find(result, function (i) { return i.value == location; });

                    this.setState({
                        selectedLocation: locationObj
                    });
                }
            }
            this.setState({
                locations: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=buildingno", 'title', 'title').then(result => {

            if (isEdit) {
                let buildingno = this.props.document.building;
                let building = {};
                if (buildingno) {
                    building = _.find(result, function (i) { return i.value == buildingno; });


                    this.setState({
                        selectedbuildingno: building
                    });
                }
            }
            this.setState({
                buildings: [...result]
            });

        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=clinetselectionstype", 'title', 'id').then(result => {

            this.setState({
                clientSelections: [...result]
            });

            if (isEdit) {
                let clientSelectionType = this.props.document.clientSelectionType;
                let clientSelection = {};
                if (clientSelectionType) {
                    clientSelection = _.find(result, function (i) { return i.value == clientSelectionType; });
                    this.setState({
                        selectedClientSelection: clientSelection
                    });
                }
            }
        });

        dataservice.GetDataList("GetContractsForList?projectId=" + this.state.projectId, 'subject', 'id').then(result => {
            if (isEdit) {
                let contractId = this.props.document.contractId;
                let selectedContract = {};
                if (contractId) {
                    selectedContract = result.find(i => i.value == contractId);
                    this.setState({
                        selectedContract: selectedContract
                    });
                }
            }
            this.setState({
                contractsPos: [...result]
            });
        });
    }

    onChangeMessage = (value) => {
        if (value != null) {
            let original_document = { ...this.state.document };

            let updated_document = {};
            updated_document.answer = value;
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document,
                answer: value
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
        let saveDocument = { ...this.state.document };
        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        dataservice.addObject('EditLogsClientSelections', saveDocument).then(result => {
            this.setState({
                isLoading: true
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
            if (this.state.isApproveMode === false) {
                this.props.history.push(this.state.perviousRoute);
            }
        });
    }

    saveLetter(event) {
        let saveDocument = { ...this.state.document };
        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.projectId = this.state.projectId;

        dataservice.addObject('AddLogsClientSelections', saveDocument).then(result => {
            this.setState({
                docId: result.id
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    saveAndExit(event) {

        this.props.history.push({
            pathname: "/clientSelection/" + this.state.projectId
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
                Config.IsAllow(3293) === true ?
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    render() {

        return (
            <div className="mainContainer">

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>

                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.clientSelectionLog[currentLanguage]}
                        moduleTitle={Resources['technicalOffice'][currentLanguage]} />

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
                                            enableReinitialize={this.props.changeStatus}
                                            onSubmit={(values) => {

                                                if (this.props.showModal) { return; }

                                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                                    this.editLetter();
                                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                    this.saveLetter();
                                                } else {
                                                    this.saveAndExit();
                                                }
                                            }}  >

                                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form id="ClientSelectionForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                                    <div className="proForm first-proform">

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                <input name='subject' className="form-control fsadfsadsa"
                                                                    id="subject"
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
                                                                onChange={e => setFieldValue('docDate', e)}
                                                                onBlur={setFieldTouched}
                                                                error={errors.docDate}
                                                                touched={touched.docDate}
                                                                name="docDate"
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

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                                            <div className={"ui input inputDev" + (errors.refDoc && touched.refDoc ? (" has-error") : "ui input inputDev")} >
                                                                <input type="text" className="form-control"
                                                                    id="refDoc"
                                                                    value={this.state.document.refDoc}
                                                                    name="refDoc"
                                                                    placeholder={Resources.refDoc[currentLanguage]}
                                                                    onBlur={(e) => {
                                                                        handleChange(e)
                                                                        handleBlur(e)
                                                                    }}
                                                                    onChange={(e) => this.handleChange(e, 'refDoc')} />
                                                                {touched.refDoc ? (<em className="pError">{errors.refDoc}</em>) : null}

                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input mix_dropdown">

                                                            <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown
                                                                        data={this.state.companies}
                                                                        isMulti={false}
                                                                        selectedValue={this.state.selectedFromCompany}
                                                                        handleChange={event => {
                                                                            this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact')
                                                                        }}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.fromCompanyId}
                                                                        touched={touched.fromCompanyId}
                                                                        styles={CompanyDropdown}
                                                                        classDrop="companyName1"
                                                                        index="fromCompanyId"
                                                                        name="fromCompanyId"
                                                                        id="fromCompanyId" />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        isMulti={false}
                                                                        data={this.state.fromContacts}
                                                                        selectedValue={this.state.selectedFromContact}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'fromContactId', false, '', '', '', 'selectedFromContact')}
                                                                        classDrop="contactName1"
                                                                        styles={ContactDropdown}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.fromContactId}
                                                                        touched={touched.fromContactId}
                                                                        isClear={false}
                                                                        index="IR-fromContactId"
                                                                        name="fromContactId"
                                                                        id="fromContactId" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input mix_dropdown">

                                                            <label className="control-label">{Resources.toCompany[currentLanguage]}</label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown
                                                                        isMulti={false}
                                                                        data={this.state.companies}
                                                                        selectedValue={this.state.selectedToCompany}
                                                                        handleChange={event =>
                                                                            this.handleChangeDropDown(event, 'toCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedToCompany', 'selectedToContact')}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.toCompanyId}
                                                                        touched={touched.toCompanyId}
                                                                        name="toCompanyId"
                                                                        styles={CompanyDropdown}
                                                                        classDrop="companyName1"
                                                                    />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        isMulti={false}
                                                                        data={this.state.ToContacts}
                                                                        selectedValue={this.state.selectedToContact}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'toContactId', false, '', '', '', 'selectedToContact')}
                                                                        classDrop="contactName1"
                                                                        styles={ContactDropdown}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.toContactId}
                                                                        touched={touched.toContactId}
                                                                        isClear={false}
                                                                        index="IR-toContactId"
                                                                        name="toContactId"
                                                                        id="toContactId"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="linebylineInput valid-input fullInputWidth">
                                                            <React.Fragment>
                                                                <label className="control-label">{Resources.contractPo[currentLanguage]}</label>
                                                                <div className="ui input inputDev "  >
                                                                    <input type="text" className="form-control" id="contractPo" readOnly
                                                                        value={this.state.document.contractName}
                                                                        name="contractPo"
                                                                        placeholder={Resources.contractPo[currentLanguage]} />
                                                                </div>
                                                            </React.Fragment> :
                                                                <Dropdown
                                                                title="contractPo"
                                                                data={this.state.contractsPos}
                                                                selectedValue={this.state.selectedContract}
                                                                handleChange={event => this.handleChangeDropDown(event, 'contractId', false, '', '', '', 'selectedContract')}
                                                                index="contractId" />}
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown title="approvalStatus"
                                                                isMulti={false}
                                                                data={this.state.approvalstatusList}
                                                                selectedValue={this.state.selectedApprovalStatusId}
                                                                handleChange={(e) => this.handleChangeDropDown(e, "approvalStatusId", false, '', '', '', 'selectedApprovalStatusId')}
                                                                index="clientSelection-approvalStatusId" />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="areaName"
                                                                isMulti={false}
                                                                data={this.state.areas}
                                                                selectedValue={this.state.selecetedArea}
                                                                handleChange={event => this.handleChangeDropDown(event, 'area', false, '', '', '', 'selecetedArea')}
                                                                index="areaId" />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="location"
                                                                isMulti={false}
                                                                data={this.state.locations}
                                                                selectedValue={this.state.selectedLocation}
                                                                handleChange={event => this.handleChangeDropDown(event, 'location', false, '', '', '', 'selectedLocation')}
                                                                index="location" />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="Building"
                                                                isMulti={false}
                                                                data={this.state.buildings}
                                                                selectedValue={this.state.selectedbuildingno}
                                                                handleChange={event => this.handleChangeDropDown(event, 'building', false, '', '', '', 'selectedbuildingno')}
                                                                index="building" />
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.apartmentNumber[currentLanguage]}</label>
                                                            <div className="ui input inputDev"  >
                                                                <input type="text" className="form-control" id="apartment"
                                                                    value={this.state.document.apartment}
                                                                    name="apartment"
                                                                    placeholder={Resources.apartmentNumber[currentLanguage]}
                                                                    onChange={(e) => this.handleChange(e, 'apartment')} />
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.total[currentLanguage]}</label>
                                                            <div className={"ui input inputDev" + (errors.total && touched.total ? (" has-error") : "ui input inputDev")} >
                                                                <input type="text" className="form-control" id="total" value={this.state.document.total} name="total"
                                                                    placeholder={Resources.total[currentLanguage]}
                                                                    onBlur={(e) => {
                                                                        handleChange(e)
                                                                        handleBlur(e)
                                                                    }}
                                                                    onChange={(e) => this.handleChange(e, 'total')} />
                                                                {touched.total ? (<em className="pError">{errors.total}</em>) : null}

                                                            </div>
                                                        </div>

                                                        <div className="letterFullWidth">
                                                            <label className="control-label">{Resources.message[currentLanguage]}</label>
                                                            <div className="inputDev ui input">
                                                                <TextEditor
                                                                    value={this.state.answer}
                                                                    onChange={this.onChangeMessage.bind(this)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="proForm first-proform ">

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.clientName[currentLanguage]}</label>
                                                            <div className="inputDev ui input"  >
                                                                <input type="text" className="form-control" id="clientName"
                                                                    value={this.state.document.clientName}
                                                                    name="clientName"
                                                                    placeholder={Resources.clientName[currentLanguage]}
                                                                    onChange={(e) => this.handleChange(e, 'clientName')} />
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.modifications[currentLanguage]}</label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="clientSelection-status" defaultChecked={this.state.document.isModification === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'isModification')} />
                                                                <label>{Resources.yes[currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="clientSelection-status" defaultChecked={this.state.document.isModification === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'isModification')} />
                                                                <label>{Resources.no[currentLanguage]}</label>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="proForm datepickerContainer">

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.unitType[currentLanguage]}</label>
                                                            <div className="ui input inputDev"  >
                                                                <input type="text" className="form-control" id="unitType"
                                                                    value={this.state.document.unitType}
                                                                    name="unitType"
                                                                    placeholder={Resources.unitType[currentLanguage]}
                                                                    onChange={(e) => this.handleChange(e, 'unitType')} />
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.letterNo[currentLanguage]}</label>
                                                            <div className="ui input inputDev"  >
                                                                <input type="text" className="form-control" id="LetterNo"
                                                                    value={this.state.document.letterNo}
                                                                    name="LetterNo"
                                                                    placeholder={Resources.letterNo[currentLanguage]}
                                                                    onChange={(e) => this.handleChange(e, 'letterNo')} />
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input alternativeDate">
                                                            <DatePicker title='letterDate'
                                                                onChange={e => setFieldValue('letterDate', e)}
                                                                startDate={this.state.document.letterDate}
                                                                handleChange={e => this.handleChangeDate(e, 'letterDate')} />
                                                        </div>

                                                        <div className="linebylineInput valid-input alternativeDate">
                                                            <DatePicker title='drawingDate'
                                                                onChange={e => setFieldValue('drawingDate', e)}
                                                                startDate={this.state.document.drawingDate}
                                                                handleChange={e => this.handleChangeDate(e, 'drawingDate')} />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="clientSelectionType"
                                                                data={this.state.clientSelections}
                                                                selectedValue={this.state.selectedClientSelection}
                                                                handleChange={event => this.handleChangeDropDown(event, 'clientSelectionType', false, '', '', '', 'selectedClientSelection')}
                                                                index="clientSelection" />
                                                        </div>

                                                    </div>

                                                    <div className="slider-Btns">
                                                        {this.showBtnsSaving()}
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={3157} EditAttachments={3252} ShowDropBox={3561} ShowGoogleDrive={3562} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true ?
                                                <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                            <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={e => this.editLetter(e)} type="submit">{Resources.save[currentLanguage]}</button>
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
)(withRouter(clientSelectionAddEdit))
import React, { Component } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment';
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments';
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import TextEditor from '../../Componants/OptionsPanels/TextEditor';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument';
import DatePicker from '../../Componants/OptionsPanels/DatePicker';
import { toast } from "react-toastify";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'
import find from "lodash/find";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
    toContactId: Yup.string().required(Resources['toContactRequired'][currentLanguage])
})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;

class ClaimsAddEdit extends Component {

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
            docTypeId: 116,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            ToContacts: [],
            fromContacts: [],
            discplines: [],
            contracts: [],
            permission: [{ name: 'sendByEmail', code: 5006 }, { name: 'sendByInbox', code: 5005 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 5014 },
            { name: 'createTransmittal', code: 5015 }, { name: 'sendToWorkFlow', code: 5009 },
            { name: 'viewAttachments', code: 5013 }, { name: 'deleteAttachments', code: 5012 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            selectedContract: { label: Resources.contractPoSelection[currentLanguage], value: "0" },
            message: ''
        }

        if (!Config.IsAllow(5001) && !Config.IsAllow(5002) && !Config.IsAllow(5004)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
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

        if (this.state.docId > 0) {
            let url = "GetClaimsById?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'claims');

        } else {
            
            let claimsDocument = {
                subject: '',
                id: 0,
                projectId: this.state.projectId,
                arrange: '',
                fromCompanyId: '',
                fromContactId: '',
                toCompanyId: '',
                toContactId: '',
                docDate: moment(),
                status: "true",
                disciplineId: '',
                refDoc: '',
                sharedSettings: '',
                message: '',
                contractId: ''
            };
            
            this.setState({
                document: claimsDocument
            });

            this.fillDropDowns(false); 
            this.props.actions.documentForAdding();
        }
        this.checkDocumentIsView();
    };

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.document.id != state.document.id && nextProps.changeStatus === true) {
            return {
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow,
                message: nextProps.document.message
            };
        }
        return null
    };

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.document.id !== this.props.document.id && this.props.changeStatus === true) {
            //         // und 976 --1
            //         //976 976 fire modal
            //         //976 976 close modal
            //         //alert('recieve....'); 
            //         //alert('recieve....' + this.state.showModal + '.....' + nextProps.showModal);

            this.fillDropDowns(this.props.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }

        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }

        // if (prevState.document.id !== this.props.document.id && this.props.changeStatus === true) {
        //     this.fillDropDowns(this.props.document.id > 0 ? true : false);
        //     this.checkDocumentIsView();
        // }

        // if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
        //     this.checkDocumentIsView();
        // }

        // if (prevProps.showModal != this.props.showModal) {
        //     this.setState({ showModal: this.props.showModal });
        // }
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

    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = find(result, function (i) { return i.value == toSubField; });

                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        });
    }

    fillDropDowns(isEdit) {
        dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId").then(result => {

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

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=discipline", "title", "id", 'defaultLists', "discipline", "listType").then(result => {
            if (isEdit) {
                let disciplineId = this.props.document.disciplineId;
                let discpline = {};
                if (disciplineId) {
                    discpline = find(result, function (i) { return i.value == disciplineId; });

                    this.setState({
                        selectedDiscpline: discpline
                    });
                }
            }
            this.setState({
                discplines: [...result]
            });
        });

        //contractList
        dataservice.GetDataList("GetContractByProjectId?projectId=" + projectId, "subject", "id").then(result => {

            if (isEdit) {

                let contractId = this.props.document.contractId;

                if (contractId) {

                    let contracts = result.find(i => i.value === contractId);

                    if (contracts) {
                        this.setState({
                            selectedContract: { ...contracts }
                        });
                    }
                }
            }

            this.setState({
                contracts: [...result]
            });
        });
    }

    onChangeMessage = (value) => {

        if (value != null) {
            let original_document = { ...this.state.document };

            let updated_document = {};

            updated_document.message = value;

            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document,
                message: value
            });
        }
    };

    handleChange(e, field) {

        let original_document = { ...this.state.document };

        console.log(original_document, 'handleChange.....');

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

        if (field == "toContactId") {
            let url = "GetRefCodeArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&fromCompanyId=" + this.state.document.fromCompanyId + "&fromContactId=" + this.state.document.fromContactId + "&toCompanyId=" + this.state.document.toCompanyId + "&toContactId=" + event.value;
            dataservice.GetRefCodeArrangeMainDoc(url).then(res => {
                updated_document.arrange = res.arrange;
                if (Config.getPublicConfiguartion().refAutomatic === true) {
                    updated_document.refDoc = res.refCode;
                }

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

    editClaims(event) {
        this.setState({
            isLoading: true
        });

        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate).format('MM/DD/YYYY');

        saveDocument.projectId = this.state.projectId;

        dataservice.addObject('EditClaimById', saveDocument).then(result => {
            this.setState({
                isLoading: true
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
            if (this.state.isApproveMode === false) {
                this.props.history.push(this.state.perviousRoute);
            }
        }).catch(error => {
            toast.error("Sorry. something went wrong .A team of highly trained developers has been dispatched to deal with this situation!");
        });
    }

    saveClaims(event) {
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate).format('MM/DD/YYYY');

        saveDocument.projectId = this.state.projectId;
        console.log(saveDocument);
        // dataservice.addObject('AddClaims', saveDocument).then(result => {
        //     this.setState({
        //         docId: result
        //     });
        //     toast.success(Resources["operationSuccess"][currentLanguage]);
        // }).catch(error => {

        //     toast.error("Sorry. something went wrong .A team of highly trained developers has been dispatched to deal with this situation!");
        // });
    }

    saveAndExit(event) {
        this.props.history.push({
            pathname: "/claims/" + this.state.projectId
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
                Config.IsAllow(5013) === true ?
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={5012} />
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
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.claims[currentLanguage]} moduleTitle={Resources['communication'][currentLanguage]} />
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
                                            initialValues={this.state.document}
                                            validationSchema={validationSchema}
                                            enableReinitialize={true}
                                            onSubmit={(values) => {
                                                if (this.props.showModal) { return; }

                                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                                    this.editClaims();
                                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                    this.saveClaims();
                                                } else {
                                                    this.saveAndExit();
                                                }
                                            }}>
                                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form id="letterForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                    <div className="proForm first-proform">
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                <input
                                                                    name='subject'
                                                                    className="form-control fsadfsadsa"
                                                                    id="subject"
                                                                    placeholder={Resources.subject[currentLanguage]}
                                                                    autoComplete='off'
                                                                    value={this.state.document.subject || ''}
                                                                    onBlur={(e) => {
                                                                        handleBlur(e)
                                                                        handleChange(e)
                                                                    }}
                                                                    onChange={(e) => this.handleChange(e, 'subject')} />
                                                                {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">
                                                                {Resources.status[currentLanguage]}
                                                            </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="status" defaultChecked={this.state.document.status === false ? null : "checked"}
                                                                    value="true" onChange={e => this.handleChange(e, "status")} />
                                                                <label>
                                                                    {Resources.oppened[currentLanguage]}
                                                                </label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="status" defaultChecked={this.state.document.status === false ? "checked" : null}
                                                                    value="false"
                                                                    onChange={e => this.handleChange(e, "status")} />
                                                                <label>
                                                                    {Resources.closed[currentLanguage]}
                                                                </label>
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
                                                            <div className="ui input inputDev">
                                                                <input type="text" className="form-control" id="arrange" readOnly
                                                                    value={this.state.document.arrange || ''}
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
                                                            <div className={"ui input inputDev"} >
                                                                <input type="text" className="form-control" id="refDoc"
                                                                    value={this.state.document.refDoc || ''}
                                                                    name="refDoc"
                                                                    placeholder={Resources.refDoc[currentLanguage]}
                                                                    onBlur={(e) => {
                                                                        handleChange(e)
                                                                        handleBlur(e)
                                                                    }}
                                                                    onChange={(e) => this.handleChange(e, 'refDoc')} />
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.sharedSettings[currentLanguage]}</label>
                                                            <div className="shareLinks">
                                                                <div className="inputDev ui input">
                                                                    <input type="text" className="form-control" id="sharedSettings"
                                                                        onChange={(e) => this.handleChange(e, 'sharedSettings')}
                                                                        value={this.state.document.sharedSettings || ''}
                                                                        name="sharedSettings"
                                                                        placeholder={Resources.sharedSettings[currentLanguage]} />
                                                                </div>
                                                                <a target="_blank" href={this.state.document.sharedSettings}><span>{Resources.openFolder[currentLanguage]}</span></a>
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
                                                                            this.handleChangeDropDown(event, "fromCompanyId", true, "fromContacts", "GetContactsByCompanyId", "companyId", "selectedFromCompany", "selectedFromContact");
                                                                        }}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.fromCompanyId}
                                                                        touched={touched.fromCompanyId}
                                                                        index="fromCompanyId"
                                                                        name="fromCompanyId"
                                                                        id="fromCompanyId"
                                                                        styles={CompanyDropdown} classDrop="companyName1 "
                                                                    />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        isMulti={false}
                                                                        data={this.state.fromContacts}
                                                                        selectedValue={this.state.selectedFromContact}
                                                                        handleChange={
                                                                            event => this.handleChangeDropDown(event, "fromContactId", false, "", "", "", "selectedFromContact")
                                                                        }

                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.fromContactId}
                                                                        touched={touched.fromContactId}
                                                                        touched={true}
                                                                        isClear={false}
                                                                        index="claims-fromContactId"
                                                                        name="fromContactId"
                                                                        id="fromContactId"
                                                                        classDrop=" contactName1" styles={ContactDropdown}
                                                                    />
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
                                                                        index="claims-toCompany"
                                                                        name="toCompanyId"
                                                                        id="toCompanyId"
                                                                        styles={CompanyDropdown} classDrop="companyName1 "
                                                                    />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        isMulti={false}
                                                                        data={this.state.ToContacts}
                                                                        selectedValue={this.state.selectedToContact}
                                                                        handleChange={event => this.handleChangeDropDown(event, "toContactId", false, "", "", "", "selectedToContact")}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.toContactId}
                                                                        touched={touched.toContactId}
                                                                        touched={true}
                                                                        isClear={false}
                                                                        index="claims-toContactId"
                                                                        name="toContactId"
                                                                        id="toContactId"
                                                                        classDrop=" contactName1" styles={ContactDropdown}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="discipline"
                                                                data={this.state.discplines}
                                                                selectedValue={this.state.selectedDiscpline}
                                                                handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedDiscpline')}
                                                                index="claims-discipline" />
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                title="contractName"
                                                                data={this.state.contracts}
                                                                selectedValue={this.state.selectedContract}
                                                                handleChange={event => this.handleChangeDropDown(event, 'contractId', false, '', '', '', 'selectedContract')}
                                                                index="claims-contractId"
                                                            />
                                                        </div>
                                                        <div className="letterFullWidth">
                                                            <label className="control-label">{Resources.message[currentLanguage]}</label>
                                                            <div className="inputDev ui input">
                                                                <TextEditor
                                                                    value={this.state.message || ''}
                                                                    onChange={this.onChangeMessage} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="slider-Btns">
                                                        {this.showBtnsSaving()}
                                                    </div>
                                                    {
                                                        this.props.changeStatus === true ?
                                                            <div className="approveDocument">
                                                                <div className="approveDocumentBTNS">
                                                                    <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} >{Resources.save[currentLanguage]}</button>
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
                                                                        documentName={Resources.claims[currentLanguage]}
                                                                    />
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
                                            {this.state.docId > 0 && this.state.isViewMode === false ?
                                                (
                                                    <UploadAttachment
                                                        changeStatus={this.props.changeStatus}
                                                        AddAttachments={5010}
                                                        EditAttachments={5011}
                                                        ShowDropBox={5016}
                                                        ShowGoogleDrive={5017}
                                                        docTypeId={this.state.docTypeId}
                                                        docId={this.state.docId}
                                                        projectId={this.state.projectId} />) : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true ? <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ClaimsAddEdit))
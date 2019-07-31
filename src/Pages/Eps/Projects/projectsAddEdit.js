import React, { Component } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../../Dataservice";
import Dropdown from "../../../Componants/OptionsPanels/DropdownMelcous";
import Resources from "../../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Config from "../../../Services/Config";
import CryptoJS from 'crypto-js';
import moment from "moment";
import * as communicationActions from '../../../store/actions/communication';
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import { toast } from "react-toastify";
import Api from '../../../api'

import CompanyDropdown from '../../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../../Componants/publicComponants/ContactDropdown'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
var ar = new RegExp("^[\u0621-\u064A\u0660-\u0669 ]+$");
var en = new RegExp("\[\\u0600\-\\u06ff\]\|\[\\u0750\-\\u077f\]\|\[\\ufb50\-\\ufc3f\]\|\[\\ufe70\-\\ufefc\]");
const validationSchema = Yup.object().shape({
    projectNameEn: Yup.string().test('projectNameEn', 'Name cannot be arabic', value => {
        return !en.test(value);
    }).required(Resources['pleaseInsertprojectNameEnglish'][currentLanguage]),
    projectNameAr: Yup.string().test('projectNameAr', 'Name cannot be english', value => { 
        return  ar.test(value)
    }).required(Resources['pleaseInsertprojectNameArabic'][currentLanguage]),
    job: Yup.string().required(Resources['referenceCode'][currentLanguage]),
    projectType: Yup.string().required(Resources['pleaseSelectProjectType'][currentLanguage]),
    country: Yup.string().required(Resources['pleaseSelectCountry'][currentLanguage]),
    projectManagerContact: Yup.string().required(Resources['pleaseSelectProjectManagerContact'][currentLanguage]),
})

let docId = 0;
let epsId = 0;
const _ = require('lodash')
class projectsAddEdit extends Component {
    constructor(props) {
        super(props);
        const query = new URLSearchParams(this.props.location.search);
        let index = 0;
        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));
                    docId = obj.docId;
                    epsId = obj.epsId;
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }
        this.state = {
            isLoading: true,
            saveLoading: false,
            showModal: false,
            isViewMode: false,
            emailSection: false,
            isView: false,
            docId: docId,
            epsId: epsId,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            ownerId: Config.getPayload().aoi,
            companies: [],
            countries: [],
            projectType: [],
            currency: [],
            copmanyRole: [],
            executiveManagerContacts: [],
            projectManagerContacts: [],
            selectedProjectType: { label: Resources.selectProjects[currentLanguage], value: "0" },
            selectedCountry: { label: Resources.pleaseSelectCountry[currentLanguage], value: "0" },
            selectedProjectManagerContact: { label: Resources.selectContact[currentLanguage], value: "0" },
            selectedProjectManagerCompany: { label: Resources.selectCompany[currentLanguage], value: "0" },
            selectedExecutiveManagerContact: { label: Resources.selectContact[currentLanguage], value: "0" },
            selectedExecutiveManagerCompany: { label: Resources.selectCompany[currentLanguage], value: "0" },
            selectedYourCompany: { label: Resources.pleaseSelectYourCompany[currentLanguage], value: "0" },
            selectedYourCompanyRole: { label: Resources.pleaseSelectYourCompanyRole[currentLanguage], value: "0" },
            selectedOwner: { label: Resources.pleaseSelectOwner[currentLanguage], value: "0" },
            selectedGeneralContractor: { label: Resources.pleaseSelectGeneralContractor[currentLanguage], value: "0" },
            selectedEngineerofRecord: { label: Resources.pleaseSelectEngineerOfRecord[currentLanguage], value: "0" },
            selectedProjectManagementCompany: { label: Resources.pleaseSelectProjectManagementCompany[currentLanguage], value: "0" },
            selectedSubmittalCoordinator: { label: Resources.pleaseSelectSubmittalCoordinator[currentLanguage], value: "0" },

        }
        if (!Config.IsAllow(522)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/projects/"
            });
        }
    }

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.document.id) {
            this.setState({
                document: { ...nextProps.document }
            });
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
        }
    };

    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "ProjectProjectsById?id=" + this.state.docId
            this.props.actions.documentForEdit(url).then(() => {
                this.setState({ isLoading: false })
            })

            if (!Config.IsAllow(423) || !Config.IsAllow(424) || !Config.IsAllow(426)) {

            }
        } else {
            let document = {
                projectNameEn: '',
                abbreviationEn: '',
                title: '',
                job: '',
                location: '',
                contractValue: '',
                description: '',
                companyId: '',
                roleId: '',
                ownerId: '',
                generalConstractor: '',
                engineerOfRecord: '',
                projectManagementCompany: '',
                projectManager: '',
                submittalCoordinator: '',
                arrange: '',
                status: true,
                projectNeeds: '',
                clientsConstraints: '',
                countryId: '',
                projectEmail: '',
                projectPassword: '',
                pop3Server: '',
                pop3Port: '',
                useMail: false,
                projectNameAr: '',
                abbreviationAr: '',
                projectManagerContactId: '',
                projectExcuteCompanyId: '',
                projectExcuteContactId: '',
                projectTypeId: '',
                holded: false,
                useSSL: false,
                currencyId: '',
                epsId: '',
                showInReport: false,
            };
            this.setState({ document, emailSection: false });
            this.fillDropDowns(false);
        }
    };

    fillDropDowns(isEdit) {
        this.setState({ isLoading: true })
        dataservice.GetDataList("GetCompanies?accountOwnerId=" + this.state.ownerId, 'companyName', 'id').then(result => {
            if (isEdit) {
                let companyId = this.props.document.projectManager;
                if (companyId) {
                    let selectedProjectManagerCompany = result.find(element => element.value == this.props.document.projectManager)
                    dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + this.props.document.projectManager, 'contactName', 'id').then(result => {
                        let selectedProjectManagerContact = result.find(element => element.value == this.props.document.projectManagerContactId)
                        this.setState({
                            projectManagerContacts: result,
                            selectedProjectManagerCompany, selectedProjectManagerContact
                        });
                    })
                    if (this.props.document.projectExcuteCompanyId) {
                        let selectedExecutiveManagerCompany = result.find(element => element.value == this.props.document.projectExcuteCompanyId)
                        dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + this.props.document.projectExcuteCompanyId, 'contactName', 'id').then(result => {
                            let selectedExecutiveManagerContact = result.find(element => element.value == this.props.document.projectExcuteContactId)
                            this.setState({
                                executiveManagerContacts: result,
                                selectedExecutiveManagerCompany, selectedExecutiveManagerContact
                            });
                        })
                    }
                    let selectedYourCompany = result.find(element => element.value == this.props.document.companyId)
                    let selectedOwner = result.find(element => element.value == this.props.document.ownerId)
                    let selectedGeneralContractor = result.find(element => element.value == this.props.document.generalConstractor)
                    let selectedEngineerofRecord = result.find(element => element.value == this.props.document.engineerOfRecord)
                    let selectedProjectManagementCompany = result.find(element => element.value == this.props.document.projectManagementCompany)
                    let selectedSubmittalCoordinator = result.find(element => element.value == this.props.document.submittalCoordinator)
                    this.setState({
                        selectedYourCompany, selectedOwner,
                        selectedGeneralContractor, selectedEngineerofRecord, selectedProjectManagementCompany, selectedSubmittalCoordinator
                    });
                }
            }
            this.setState({
                companies: [...result], isLoading: false
            });
        });
        this.setState({ isLoading: true })
        dataservice.GetDataList("GetAccountsDefaultList?listType=country&pageNumber=0&pageSize=10000", 'title', 'id').then(result => {
            if (isEdit) {
                let selectedCountry = result.find(element => element.value == this.props.document.countryId)
                this.setState({ selectedCountry })
            }
            this.setState({
                countries: [...result],
                isLoading: false

            });
        });
        this.setState({ isLoading: true })
        dataservice.GetDataList("GetAccountsDefaultList?listType=project_type&pageNumber=0&pageSize=10000", 'title', 'id').then(result => {
            if (isEdit) {
                let selectedProjectType = result.find(element => element.value == this.props.document.projectTypeId)
                this.setState({ selectedProjectType })
            }
            this.setState({
                projectType: [...result],
                isLoading: false
            });
        });
        this.setState({ isLoading: true })
        dataservice.GetDataList("GetAccountsDefaultList?listType=currency&pageNumber=0&pageSize=10000", 'title', 'id').then(result => {
            this.setState({
                currency: [...result],
                isLoading: false
            });
        });
        this.setState({ isLoading: true })
        dataservice.GetDataList("GetAccountsDefaultList?listType=companyrole&pageNumber=0&pageSize=10000", 'title', 'id').then(result => {
            if (isEdit) {
                let selectedYourCompanyRole = result.find(element => element.value == this.props.document.roleId)
                this.setState({ selectedYourCompanyRole })
            }

            this.setState({
                copmanyRole: [...result],
                isLoading: false
            });

        });
    }

    fillSubDropDown(url, param, value, subFieldId, subFieldName, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        this.setState({ isLoading: true })
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
            this.setState({
                projectManagerContacts: result,
                executiveManagerContacts: result,
                isLoading: false
            });
        });
    }

    addEditProject(values) {
        if (!Config.IsAllow(522)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/projects/"
            });
        }
        else {
            let url = ''
            if (this.state.docId > 0) {
                url = 'ProjectProjectsEdit'
            }
            else {
                url = 'ProjectProjectsAdd'
            }
            let project = Object.assign({ ...values },
                { epsId: this.state.epsId },
                { projectTypeId: this.state.selectedProjectType == undefined ? null : (this.state.selectedProjectType.value == '0' ? null : this.state.selectedProjectType.value) },
                { countryId: this.state.selectedCountry == undefined ? null : (this.state.selectedCountry.value == '0' ? null : this.state.selectedCountry.value) },
                { projectManager: this.state.selectedProjectManagerCompany == undefined ? null : (this.state.selectedProjectManagerCompany.value == '0' ? null : this.state.selectedProjectManagerCompany.value) },
                { projectManagerContactId: this.state.selectedProjectManagerContact == undefined ? null : (this.state.selectedProjectManagerContact.value == '0' ? null : this.state.selectedProjectManagerContact.value) },
                { projectExcuteCompanyId: this.state.selectedExecutiveManagerCompany == undefined ? null : (this.state.selectedExecutiveManagerCompany.value == '0' ? null : this.state.selectedExecutiveManagerCompany.value) },
                { projectExcuteContactId: this.state.selectedExecutiveManagerContact == undefined ? null : (this.state.selectedExecutiveManagerContact.value == '0' ? null : this.state.selectedExecutiveManagerContact.value) },
                { companyId: this.state.selectedYourCompany == undefined ? null : (this.state.selectedYourCompany.value == '0' ? null : this.state.selectedYourCompany.value) },
                { roleId: this.state.selectedYourCompanyRole == undefined ? null : (this.state.selectedYourCompanyRole.value == '0' ? null : this.state.selectedYourCompanyRole.value) },
                { ownerId: this.state.selectedOwner == undefined ? null : (this.state.selectedOwner.value == '0' ? null : this.state.selectedOwner.value) },
                { generalConstractor: this.state.selectedGeneralContractor == undefined ? null : (this.state.selectedGeneralContractor.value == '0' ? null : this.state.selectedGeneralContractor.value) },
                { engineerOfRecord: this.state.selectedEngineerofRecord == undefined ? null : (this.state.selectedEngineerofRecord.value == '0' ? null : this.state.selectedEngineerofRecord.value) },
                { projectManagementCompany: this.state.selectedProjectManagementCompany == undefined ? null : (this.state.selectedProjectManagementCompany.value == '0' ? null : this.state.selectedProjectManagementCompany.value) },
                { submittalCoordinator: this.state.selectedSubmittalCoordinator == undefined ? null : (this.state.selectedSubmittalCoordinator.value == '0' ? null : this.state.selectedSubmittalCoordinator.value) },
                { country: null },
                { executiveManagerContact: null },
                { projectManagerContact: null },
                { projectType: null }
            );
            this.setState({ saveLoading: true })
            Api.post(url, project).then(result => {
                if (result != null) {
                    if (result.status == 409) {
                        toast.warn(Resources["englishArabicAlreadyExisted"][currentLanguage]);
                    }
                    this.setState({ saveLoading: false })
                }
                else {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                    this.setState({ saveLoading: false })
                    this.props.history.push({ pathname: '/projects' })
                }


            }).catch((ex) => {
                this.setState({ saveLoading: false })
                toast.error(Resources["operationCanceled"][currentLanguage]);
            })
        }

    }
    checkReferenceCode(code) {
        if (this.state.docI == 0 | code !== this.props.document.job)
            Api.get('CheckReferanceCode?code=' + code).then(res => {
                if (res == true) {
                    toast.error(Resources["itemCodeExist"][currentLanguage])
                    this.setState({ document: { ...this.state.document, job: '' } })
                }
            })
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
    render() {
        return (
            <div className="mainContainer">

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>

                    <div className="submittalHead">
                        <h2 className="zero">{this.state.docId > 0 ? Resources.projectsEdit[currentLanguage] : Resources.projectsAdd[currentLanguage]}
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
                            this.state.docId > 0 ?
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
                                        {this.state.isLoading ? <LoadingSection /> : null}

                                        <Formik
                                            initialValues={{
                                                ...this.state.document,
                                                projectType: this.state.selectedProjectType.value == '0' ? '' : this.state.selectedProjectType.value,
                                                country: this.state.selectedCountry.value == '0' ? '' : this.state.selectedCountry.value,
                                                projectManagerContact: this.state.selectedProjectManagerContact.value == '0' ? '' : this.state.selectedProjectManagerContact.value
                                            }}
                                            enableReinitialize={true}
                                            validationSchema={validationSchema}
                                            onSubmit={(values) => {
                                                this.addEditProject(values)
                                            }}
                                        >
                                            {({ touched, errors, handleBlur, handleChange, values, setFieldValue, setFieldTouched }) => (
                                                <Form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate" >
                                                    <div className="linebylineInput valid-input fullInputWidth">
                                                        <label className="control-label">{Resources.projectNameEnglish[currentLanguage]}</label>
                                                        <div className={"inputDev ui input " + (errors.projectNameEn && touched.projectNameEn ? 'has-error' : !errors.projectNameEn && touched.projectNameEn ? (" has-success") : " ")} >
                                                            <input name='projectNameEn' className="form-control fsadfsadsa" id="projectNameEn"
                                                                placeholder={Resources.projectNameEnglish[currentLanguage]}
                                                                autoComplete='off'
                                                                defaultValue={values.projectNameEn}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => this.handleChange(e, 'projectNameEn')} />
                                                            {touched.projectNameEn ? (<em className="pError">{errors.projectNameEn}</em>) : null}

                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput valid-input fullInputWidth">
                                                        <label className="control-label">{Resources.projectNameArabic[currentLanguage]}</label>
                                                        <div className={"inputDev ui input " + (errors.projectNameAr && touched.projectNameAr ? 'has-error' : !errors.projectNameAr && touched.projectNameAr ? (" has-success") : " ")} >
                                                            <input name='projectNameAr' className="form-control fsadfsadsa" id="projectNameAr"
                                                                placeholder={Resources.projectNameArabic[currentLanguage]}
                                                                autoComplete='off'
                                                                defaultValue={values.projectNameAr}
                                                                onBlur={handleBlur}
                                                                onChange={(e) => this.handleChange(e, 'projectNameAr')} />
                                                            {touched.projectNameAr ? (<em className="pError">{errors.projectNameAr}</em>) : null}

                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput valid-input fullInputWidth">
                                                        <label className="control-label"> {Resources['location'][currentLanguage]} </label>
                                                        <div className="ui input inputDev " >
                                                            <input autoComplete="off" type='text' className="form-control" name="location" defaultValue={values.location}
                                                                onBlur={handleBlur} onChange={(e) => this.handleChange(e, 'location')}
                                                                placeholder={Resources['location'][currentLanguage]} />
                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput valid-input fullInputWidth">
                                                        <label className="control-label"> {Resources['referenceCode'][currentLanguage]} </label>
                                                        <div className={"inputDev ui input " + (errors.job ? 'has-error' : !errors.job && touched.job ? (" has-success") : " ")}>
                                                            <input name='job' className="form-control" defaultValue={values.job}
                                                                id="job" placeholder={Resources['referenceCode'][currentLanguage]} autoComplete='off'
                                                                onBlur={e => {
                                                                    handleBlur(e);
                                                                    this.checkReferenceCode(e.target.value)
                                                                }} onChange={(e) => this.handleChange(e, 'job')} />
                                                            {errors.job ? (<em className="pError">{errors.job}</em>) : null}
                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput valid-input fullInputWidth">
                                                        <label className="control-label"> {Resources['projectNeeds'][currentLanguage]} </label>
                                                        <div className="ui input inputDev">
                                                            <input autoComplete="off" type='text' className="form-control" name="projectNeeds" value={values.projectNeeds}
                                                                onBlur={handleBlur} onChange={(e) => this.handleChange(e, 'projectNeeds')} placeholder={Resources['projectNeeds'][currentLanguage]} />
                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput valid-input fullInputWidth">
                                                        <label className="control-label"> {Resources['clientsConstraints'][currentLanguage]} </label>
                                                        <div className="ui input inputDev" >
                                                            <input autoComplete="off" type='text' className="form-control" name="clientsConstraints" defaultValue={values.clientsConstraints}
                                                                onBlur={handleBlur} onChange={(e) => this.handleChange(e, 'clientsConstraints')} placeholder={Resources['clientsConstraints'][currentLanguage]} />
                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput valid-input ">
                                                        <label className="control-label"> {Resources['contractValue'][currentLanguage]} </label>
                                                        <div className="ui input inputDev" >
                                                            <input autoComplete="off" type='text' className="form-control" name="contractValue" defaultValue={values.contractValue}
                                                                onBlur={handleBlur} onChange={(e) => this.handleChange(e, 'contractValue')} placeholder={Resources['contractValue'][currentLanguage]} />
                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput valid-input fullInputWidth">
                                                        <label className="control-label"> {Resources['description'][currentLanguage]} </label>
                                                        <div className="ui input inputDev" >
                                                            <input autoComplete="off" type='text' className="form-control" name="description" defaultValue={values.description}
                                                                onBlur={handleBlur} onChange={(e) => this.handleChange(e, 'description')} placeholder={Resources['description'][currentLanguage]} />
                                                        </div>
                                                    </div>
                                                    <div className="fullWidthWrapper textLeft proForm datepickerContainer">
                                                        <div className="linebylineInput valid-input ">
                                                            <Dropdown
                                                                title="projectType"
                                                                data={this.state.projectType}
                                                                selectedValue={this.state.selectedProjectType}
                                                                handleChange={event => {
                                                                    this.setState({ selectedProjectType: event })
                                                                }}
                                                                onChange={setFieldValue}
                                                                onBlur={setFieldTouched}
                                                                error={errors.projectType}
                                                                touched={touched.projectType}
                                                                name="projectType"
                                                                index="projectType"
                                                            />
                                                        </div>
                                                        <div className="linebylineInput valid-input ">
                                                            <Dropdown
                                                                title="country"
                                                                data={this.state.countries}
                                                                selectedValue={this.state.selectedCountry}
                                                                handleChange={event => {
                                                                    this.setState({ selectedCountry: event })
                                                                }}
                                                                onChange={setFieldValue}
                                                                onBlur={setFieldTouched}
                                                                error={errors.country}
                                                                touched={touched.country}
                                                                name="country"
                                                                index="country"
                                                            />
                                                        </div>
                                                        <div className="linebylineInput valid-input mix_dropdown">
                                                            <label className="control-label">{Resources.projectManagerCompany[currentLanguage]}</label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown
                                                                        name="projectManagerContact"
                                                                        data={this.state.projectManagerContacts}
                                                                        handleChange={event => this.setState({ selectedProjectManagerContact: event })}
                                                                        placeholder='ContactName'
                                                                        selectedValue={this.state.selectedProjectManagerContact}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.projectManagerContact}
                                                                        touched={touched.projectManagerContact}
                                                                        index="projectManagerContact"
                                                                        id="projectManagerContact" styles={CompanyDropdown} classDrop="companyName1 " />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        data={this.state.companies}
                                                                        isMulti={false}
                                                                        selectedValue={this.state.selectedProjectManagerCompany}
                                                                        handleChange={event => {
                                                                            this.setState({
                                                                                selectedProjectManagerCompany: event,
                                                                                selectedProjectManagerContact: { label: Resources.selectContact[currentLanguage], value: "0" }
                                                                            })
                                                                            this.fillSubDropDown('GetContactsByCompanyIdForOnlyUsers', 'companyId', event.value, 'id', 'contactName', 'selectedProjectManagerContact', 'projectManagerContacts')
                                                                        }}
                                                                        index="projectManagerCompany"
                                                                        name="projectManagerCompany"
                                                                        id="projectManagerCompany" classDrop=" contactName1" styles={ContactDropdown} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input mix_dropdown">
                                                            <label className="control-label">{Resources.executiveManagerCompany[currentLanguage]}</label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown
                                                                        title='executiveManagerCompany'
                                                                        name="executiveManagerContact"
                                                                        data={this.state.executiveManagerContacts}
                                                                        handleChange={event => this.setState({ selectedExecutiveManagerContact: event })}
                                                                        placeholder='ContactName'
                                                                        selectedValue={this.state.selectedExecutiveManagerContact}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.executiveManagerContact}
                                                                        touched={touched.executiveManagerContact}
                                                                        index="executiveManagerContact"
                                                                        id="executiveManagerContact" styles={CompanyDropdown} classDrop="companyName1 "/>
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        data={this.state.companies}
                                                                        isMulti={false}
                                                                        selectedValue={this.state.selectedExecutiveManagerCompany}
                                                                        handleChange={event => {
                                                                            this.fillSubDropDown('GetContactsByCompanyIdForOnlyUsers', 'companyId', event.value, 'id', 'contactName', 'selectedExecutiveManagerCompany', 'executiveManagerContacts')
                                                                            this.setState({
                                                                                selectedExecutiveManagerCompany: event,
                                                                                selectedExecutiveManagerContact: { label: Resources.selectContact[currentLanguage], value: "0" }
                                                                            })
                                                                        }}
                                                                        name="executiveManagerCompany"
                                                                        id="executiveManagerCompany" classDrop=" contactName1" styles={ContactDropdown} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input ">
                                                            <Dropdown
                                                                title="yourCompany"
                                                                data={this.state.companies}
                                                                selectedValue={this.state.selectedYourCompany}
                                                                handleChange={event => this.setState({ selectedYourCompany: event })}
                                                                index="letter-yourCompany"
                                                            />
                                                        </div>
                                                        <div className="linebylineInput valid-input ">
                                                            <Dropdown
                                                                title="yourCompanyRole"
                                                                data={this.state.copmanyRole}
                                                                selectedValue={this.state.selectedYourCompanyRole}
                                                                handleChange={event => this.setState({ selectedYourCompanyRole: event })}
                                                                index="yourCompanyRole"
                                                            />
                                                        </div>
                                                        <div className="linebylineInput valid-input ">
                                                            <Dropdown
                                                                title="owner"
                                                                data={this.state.companies}
                                                                selectedValue={this.state.selectedOwner}
                                                                handleChange={event => this.setState({ selectedOwner: event })}
                                                                index="owner"
                                                            />
                                                        </div>
                                                        <div className="linebylineInput valid-input ">
                                                            <Dropdown
                                                                title="generalContractor"
                                                                data={this.state.companies}
                                                                selectedValue={this.state.selectedGeneralContractor}
                                                                handleChange={event => this.setState({ selectedGeneralContractor: event })}
                                                                index="generalContractor"
                                                            />
                                                        </div>      <div className="linebylineInput valid-input ">
                                                            <Dropdown
                                                                title="engineerofRecord"
                                                                data={this.state.companies}
                                                                selectedValue={this.state.selectedEngineerofRecord}
                                                                handleChange={event => this.setState({ selectedEngineerofRecord: event })}
                                                                index="engineerofRecord"
                                                            />
                                                        </div>
                                                        <div className="linebylineInput valid-input ">
                                                            <Dropdown
                                                                title="projectManagementCompany"
                                                                data={this.state.companies}
                                                                handleChange={event => this.setState({ selectedProjectManagementCompany: event })}
                                                                selectedValue={this.state.selectedProjectManagementCompany}
                                                                index="projectManagementCompany"
                                                            />
                                                        </div>
                                                        <div className="linebylineInput valid-input ">
                                                            <Dropdown
                                                                title="submittalCoordinator"
                                                                data={this.state.companies}
                                                                handleChange={event => this.setState({ selectedSubmittalCoordinator: event })}
                                                                selectedValue={this.state.selectedSubmittalCoordinator}
                                                                index="submittalCoordinator"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="letterFullWidth">
                                                        <label style={{margin: '0', marginBottom: '4px'}} data-toggle="tooltip" title="Design Team" className="control-label">{Resources.projectStatus[currentLanguage]} </label>
                                                        <div className="check__radio">
                                                            <div className="">
                                                                <div className="ui checkbox radio radioBoxBlue checked">
                                                                    <input type="radio" name="status"
                                                                        defaultChecked={values.status === true ? 'checked' : null} value="true" onChange={() => setFieldValue('status', true)} />
                                                                    <label>{Resources.active[currentLanguage]}</label>
                                                                </div>
                                                                <div style={{margin : '0 6px'}} className="ui checkbox radio radioBoxBlue checked">
                                                                    <input type="radio" name="status" value='false' onChange={() => setFieldValue('status', false)}
                                                                        defaultChecked={values.status == false ? 'checked' : null} />
                                                                    <label>{Resources.inActive[currentLanguage]}</label>
                                                                </div>
                                                                <div className="ui checkbox radio radioBoxBlue checked">
                                                                    <input type="radio" name="holded" onChange={e => setFieldValue('holded', true)}
                                                                        defaultChecked={values.holded == true ? 'checked' : null} />
                                                                    <label>{Resources.holded[currentLanguage]}</label>
                                                                </div>
                                                                <div style={{margin : '0 6px'}} className="ui checkbox radio radioBoxBlue">
                                                                    <input type="radio" name="holded" onChange={e => setFieldValue('holded', false)}
                                                                        defaultChecked={values.holded == false ? 'checked' : null} />
                                                                    <label>{Resources.unHolded[currentLanguage]}</label>
                                                                </div>
                                                            </div>
                                                            <div style={{marginTop:' 8px'}} className="ui checkbox checkBoxGray300 checked">
                                                                <input type="checkbox" name='showInReport' defaultChecked={values.showInReport == true ? 'checked' : null} onChange={e => setFieldValue('showInReport', e.target.checked)} />
                                                                <label>{Resources.showInReport[currentLanguage]}</label>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="linebylineInput account__checkbox odd">
                                                        <div className="linebylineInput linebylineInput__checkbox">
                                                            <label data-toggle="tooltip" className="control-label">{Resources.useEmail[currentLanguage]}</label>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" name="useMail" onChange={e => { setFieldValue('useMail', true); this.setState({ emailSection: true }) }}
                                                                    value="true" defaultChecked={values.useMail ? 'checked' : null} />
                                                                <label> {Resources.yes[currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" name="useMail"
                                                                    defaultChecked={values.useMail == false ? 'checked' : null}
                                                                    onBlur={handleBlur}
                                                                    onChange={e => { setFieldValue('useMail', false); this.setState({ emailSection: false }) }} />
                                                                <label> {Resources.no[currentLanguage]}</label>
                                                            </div>
                                                        </div>
                                                        {this.state.emailSection ?
                                                            <div className="linebylineInput valid-input even">

                                                                <label data-toggle="tooltip" className="control-label">{Resources.useSSL[currentLanguage]}</label>
                                                                <div className="ui checkbox radio radioBoxBlue checked">
                                                                    <input type="radio" name="useSSL" onChange={e => setFieldValue('useSSL', true)}
                                                                        value="true" defaultChecked={values.useSSL ? 'checked' : null} />
                                                                    <label> {Resources.yes[currentLanguage]}</label>
                                                                </div>

                                                                <div className="ui checkbox radio radioBoxBlue checked">
                                                                    <input type="radio" name="useSSL"
                                                                        defaultChecked={values.useSSL == false ? 'checked' : null}
                                                                        onBlur={handleBlur}
                                                                        onChange={e => setFieldValue('useSSL', false)} />
                                                                    <label> {Resources.no[currentLanguage]}</label>
                                                                </div>
                                                            </div> : null}
                                                    </div>
                                                    {this.state.emailSection ?
                                                        <React.Fragment>
                                                            <div className="linebylineInput valid-input fullInputWidth">
                                                                <label className="control-label"> {Resources['email'][currentLanguage]} </label>
                                                                <div className="ui input inputDev" >
                                                                    <input autoComplete="off" type='text' className="form-control" name="projectEmail" defaultValue={values.projectEmail}
                                                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['email'][currentLanguage]} />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input fullInputWidth">
                                                                <label className="control-label"> {Resources['password'][currentLanguage]} </label>
                                                                <div className="ui input inputDev" >
                                                                    <input autoComplete="off" type='text' className="form-control" name="projectPassword" defaultValue={values.projectPassword}
                                                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['password'][currentLanguage]} />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input fullInputWidth">
                                                                <label className="control-label"> {Resources['pop3Server'][currentLanguage]} </label>
                                                                <div className="ui input inputDev" >
                                                                    <input autoComplete="off" type='text' className="form-control" name="pop3Server" defaultValue={values.pop3Server}
                                                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['pop3Server'][currentLanguage]} />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input fullInputWidth">
                                                                <label className="control-label"> {Resources['port'][currentLanguage]} </label>
                                                                <div className="ui input inputDev" >
                                                                    <input autoComplete="off" type='text' className="form-control" name="pop3Port" defaultValue={values.pop3Port}
                                                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['port'][currentLanguage]} />
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                        : null}
                                                    <div className="fullWidthWrapper textLeft slider-Btns">
                                                        {this.state.saveLoading === false ? (
                                                            <button
                                                                className="primaryBtn-1 btn "
                                                                type="submit"
                                                            >  {Resources['save'][currentLanguage]}
                                                            </button>
                                                        ) :
                                                            (
                                                                <button className="primaryBtn-1 btn disabled" disabled="disabled">
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
)(withRouter(projectsAddEdit))
import React, { Component } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Api from "../../../api";
import Dropdown from "../../OptionsPanels/DropdownMelcous";
import Dropzone from "react-dropzone";
import Resources from "../../../resources.json";
import TokenStore from '../../../tokenStore'
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import LoadingSection from "../../publicComponants/LoadingSection";
import Dataservice from "../../../Dataservice";
import { connect } from 'react-redux'
import * as AdminstrationActions from '../../../store/actions/Adminstration'
import { bindActionCreators } from 'redux';
import HeaderDocument from "../../../Componants/OptionsPanels/HeaderDocument"

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
var ar = new RegExp("^[\u0621-\u064A\u0660-\u0669 ]+$");
var en = new RegExp("\[\\u0600\-\\u06ff\]\|\[\\u0750\-\\u077f\]\|\[\\ufb50\-\\ufc3f\]\|\[\\ufe70\-\\ufefc\]");
const validationSchema = Yup.object().shape({
    email: Yup.string().max(50, Resources['maxLength'][currentLanguage]).email(Resources['emailFormat'][currentLanguage]).required(Resources['emailRequired'][currentLanguage]),
    titleEnCompany: Yup.string().max(50, Resources['maxLength'][currentLanguage]).test('titleEnCompany', 'Name cannot be arabic', value => {
        return !en.test(value);
    }).required(Resources['ComapnyNameRequired'][currentLanguage]),
    titleArCompany: Yup.string().max(50, Resources['maxLength'][currentLanguage]).test('contactNameAr', 'Name cannot be english', value => {
        return ar.test(value)
    }).required(Resources['ComapnyNameRequired'][currentLanguage]),
    ContactNameEn: Yup.string().max(450, Resources['maxLength'][currentLanguage]).required(Resources['contactNameRequired'][currentLanguage]),
    ContactNameAr: Yup.string().max(450, Resources['maxLength'][currentLanguage]).required(Resources['contactNameRequired'][currentLanguage]),
    Mobile: Yup.string().max(50, Resources['maxLength'][currentLanguage]).required(Resources['mobileRequired'][currentLanguage]),
    positionEn: Yup.string().max(50, Resources['maxLength'][currentLanguage]),
    positionAr: Yup.string().max(50, Resources['maxLength'][currentLanguage]),
    addressAr: Yup.string().max(450, Resources['maxLength'][currentLanguage]),
    addressEn: Yup.string().max(450, Resources['maxLength'][currentLanguage]),
    Telephone: Yup.string().max(450, Resources['maxLength'][currentLanguage]),
    discipline: Yup.string().required(Resources['disciplineRequired'][currentLanguage]),
    title: Yup.string().required(Resources['empTitleRequired'][currentLanguage]),
    companyRole: Yup.string().required(Resources['companyRoleRequired'][currentLanguage])
});

const validationSchemaForEdit = Yup.object().shape({
    titleEnCompany: Yup.string().max(50, Resources['maxLength'][currentLanguage]).test('titleEnCompany', 'Name cannot be arabic', value => {
        return !en.test(value);
    }).required(Resources['ComapnyNameRequired'][currentLanguage]),
    titleArCompany: Yup.string().max(50, Resources['maxLength'][currentLanguage]).test('contactNameAr', 'Name cannot be english', value => {
        return ar.test(value)
    }).required(Resources['ComapnyNameRequired'][currentLanguage]),
    discipline: Yup.string().required(Resources['disciplineRequired'][currentLanguage]),
    companyRole: Yup.string().required(Resources['companyRoleRequired'][currentLanguage])
})

class AddEditCompany extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: {},
            imagePreview: {},
            imageName: '',
            imageIamge: '',
            selectedDiscipline: '',
            disciplineData: [],
            selectedCompanyRole: '',
            CompanyRoleData: [],
            selectedTitle: '',
            TitleData: [],
            projectId: 0,
            companyID: this.props.match.params.companyID,
            profilePath: '',
            isLoading: false,
            sectionLoading: false,
            titleEnCompany: '',
            titleArCompany: '',
            imageFooterPreview: {},
            imageFooter: {},
            imageFooterName: '',
            imageFooterIamge: '',
            document: {}
        }
    }

    onDropImage(file) {
        let _formData = new FormData();
        _formData.append("file", file)
        this.setState({
            image: file,
            imagePreview: URL.createObjectURL(file[0]),
            imageName: file[0].name,
            imageIamge: _formData
        });
    }

    onDropImageFooter = (file) => {
        let _formData = new FormData();
        _formData.append("file", file)
        if (file.length > 0) {
            this.setState({
                imageFooter: file,
                imageFooterPreview: URL.createObjectURL(file[0]),
                imageFooterName: file[0].name,
                imageFooterIamge: _formData,
            });
        } else toast.error("Only Image can be uploaded");
    }

    removeFooterImage = () => this.setState({ imageFooter: {}, imageFooterName: '', imageFooterPreview: {} });

    removeImage = () => {
        this.setState({
            image: {}, imageName: '', imagePreview: {}
        })
    }

    handleChangeDropDown = (item, name) => {
        let original_document = this.state.document;

        switch (name) {
            case "title":
                original_document.discipline = item.label;
                this.setState({ selectedTitle: item, document: original_document })
                break;
            case "companyRole":
                original_document.companyRole = item.label;
                this.setState({ selectedCompanyRole: item, document: original_document })
                break;
            case "discipline":
                original_document.title = item.label;
                this.setState({ selectedDiscipline: item, document: original_document })
                break;
            default:
                break;
        }
    }

    componentDidMount = () => {
        this.setState({ sectionLoading: true })

        URL.revokeObjectURL(this.state.imagePreview)
        URL.revokeObjectURL(this.state.imageFooterPreview)
        if (this.state.companyID == 0) {

            let document = {
                titleEnCompany: this.state.titleEnCompany,
                titleArCompany: this.state.titleArCompany,
                email: '',
                ContactNameEn: '',
                ContactNameAr: '',
                Mobile: '',
                positionEn: '',
                positionAr: '',
                addressEn: '',
                addressAr: '',
                Telephone: '',
                abbrevationEn: '',
                abbrevationAr: '',
                showInWorkOrder: true
            }

            this.GetData('GetaccountsDefaultListForList?listType=discipline', 'title', 'id', 'disciplineData')
            this.GetData('GetaccountsDefaultListForList?listType=companyrole', 'title', 'id', 'CompanyRoleData')
            this.GetData('GetaccountsDefaultListForList?listType=contacttitle', 'title', 'id', 'TitleData')
            let id = TokenStore.getItem('projectIdForaddCompany')
            this.setState({ projectId: (id ? id : 0), document: document })

        } else {
            this.GetData('GetaccountsDefaultListForList?listType=discipline', 'title', 'id', 'disciplineData')
            this.GetData('GetaccountsDefaultListForList?listType=companyrole', 'title', 'id', 'CompanyRoleData')

            Api.get('GetProjectCompaniesForEdit?id=' + this.state.companyID).then(res => {
                res.titleEnCompany = res.companyNameEn;
                res.titleArCompany = res.companyNameAr;
                res.discipline = res.disciplineTitle;
                res.companyRole = res.roleTitle;
                this.setState({
                    document: res,
                    imagePreview: res.logo,
                    sectionLoading: false,
                    selectedDiscipline: { label: res.disciplineTitle, value: res.disciplineId },
                    selectedCompanyRole: { label: res.roleTitle, value: res.roleId },
                    titleEnCompany: res.companyNameEn,
                    titleArCompany: res.companyNameAr
                })
            })
        }
    };

    Save = (values) => {

        let objDocument = this.state.document;
        objDocument.id = this.state.companyID;
        objDocument.companyNameEn = objDocument.titleEnCompany;
        objDocument.companyNameAr = objDocument.titleArCompany;
        objDocument.id = this.state.companyID;
        objDocument.disciplineId = this.state.selectedDiscipline.value;
        objDocument.disciplineTitle = this.state.selectedDiscipline.label;
        objDocument.roleId = this.state.selectedCompanyRole.value;
        objDocument.roleTitle = this.state.selectedCompanyRole.label;
        objDocument.titleId = this.state.selectedTitle.value;
        objDocument.projectId = this.state.projectId;
        objDocument.logoFileData = this.state.imageIamge;

        if (this.state.companyID == 0) {
            Api.post('AddCompanyContact', objDocument).then(() => {
                this.setState({ isLoading: false })
                this.props.actions.routeToTabIndex(2)
                this.props.history.push({ pathname: '/TemplatesSettings' })
                toast.success("operation complete sucessful")
            })
        }
        else {
            Api.post('EditProjectCompanies', objDocument).then(() => {
                this.setState({ isLoading: false })
                this.props.actions.routeToTabIndex(2)
                this.props.history.push({ pathname: '/TemplatesSettings' })
                toast.success("operation complete sucessful");
            })
        }
    }

    uploadCompanyFooter = () => {
        if (this.state.imageFooter) {
            let formData = new FormData();
            formData.append("file", this.state.imageFooter[0]);
            formData.append("companyId", this.state.companyID);

            Api.postFile('UploadCompanyFooter', formData).then(res => {
                res.status === 200 ? toast.success(Resources["operationSuccess"][currentLanguage]) : toast.error(Resources["operationCanceled"][currentLanguage]);
            }).catch(ex => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
            });
        }
    }

    handleChange(e, field) {
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({ document: updated_document });
    }

    render() {
        return (
            <div className="mainContainer main__fulldash">
                <div className="documents-stepper cutome__inputs noTabs__document">
                    <div className="submittalHead">
                        <HeaderDocument
                            projectName={this.state.companyID == 0 ? Resources['add'][currentLanguage] : Resources['goEdit'][currentLanguage]}
                            isViewMode={false}
                            perviousRoute={"/TemplatesSettings"}
                            docTitle={Resources['company'][currentLanguage]}
                            moduleTitle={Resources["settings"][currentLanguage]}
                        />
                    </div>
                    <div className="doc-container">
                        <div className="step-content noBtn__footer">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    {this.state.sectionLoading ? <LoadingSection /> :
                                        <Formik initialValues={{ ...this.state.document }}
                                            enableReinitialize={true}
                                            validationSchema={this.state.companyID == 0 ? validationSchema : validationSchemaForEdit}
                                            onSubmit={(values) => {
                                                this.setState({ isLoading: true })
                                                this.Save(values)
                                            }}>
                                            {({ touched, errors, handleBlur, handleChange, values, setFieldValue, setFieldTouched }) => (
                                                <Form id="signupForm1" noValidate="novalidate" >
                                                    <div className="proForm datepickerContainer">
                                                        <div className="linebylineInput valid-input passWrapperInput">
                                                            <label className="control-label"> {Resources['titleEnCompany'][currentLanguage]} </label>
                                                            <div className={"ui input inputDev fillter-item-c " + (errors.titleEnCompany && touched.titleEnCompany ? ("has-error") : !errors.titleEnCompany && touched.titleEnCompany ? ("has-success") : "")}>
                                                                <input name="titleEnCompany" id="titleEnCompany" className="form-control fsadfsadsa"
                                                                    placeholder={Resources.titleEnCompany[currentLanguage]}
                                                                    autoComplete="off"
                                                                    value={this.state.document.titleEnCompany}
                                                                    onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                    onChange={e => this.handleChange(e, "titleEnCompany")} />
                                                                {errors.titleEnCompany && touched.titleEnCompany ? (<em className="pError">{errors.titleEnCompany}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input passWrapperInput">
                                                            <label className="control-label"> {Resources['titleArCompany'][currentLanguage]} </label>
                                                            <div className={"ui input inputDev fillter-item-c " + (errors.titleArCompany && touched.titleArCompany ? ("has-error") : !errors.titleArCompany && touched.titleArCompany ? ("has-success") : "")}>
                                                                <input name="titleArCompany" id="titleArCompany" className="form-control fsadfsadsa"
                                                                    placeholder={Resources.titleArCompany[currentLanguage]}
                                                                    autoComplete="off"
                                                                    value={this.state.document.titleArCompany}
                                                                    onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                    onChange={e => this.handleChange(e, "titleArCompany")} />
                                                                {errors.titleArCompany && touched.titleArCompany ? (<em className="pError">{errors.titleArCompany}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input passWrapperInput">
                                                            <Dropdown title="discipline" data={this.state.disciplineData}
                                                                name="discipline"
                                                                selectedValue={this.state.selectedDiscipline}
                                                                onChange={setFieldValue}
                                                                handleChange={(e) => this.handleChangeDropDown(e, "discipline")}
                                                                onBlur={setFieldTouched}
                                                                error={errors.discipline}
                                                                touched={touched.discipline}
                                                                value={values.discipline} />
                                                        </div>

                                                        <div className="linebylineInput valid-input passWrapperInput">
                                                            <Dropdown title="companyRole" data={this.state.CompanyRoleData}
                                                                name="companyRole"
                                                                selectedValue={this.state.selectedCompanyRole}
                                                                onChange={setFieldValue}
                                                                handleChange={(e) => this.handleChangeDropDown(e, "companyRole")}
                                                                onBlur={setFieldTouched}
                                                                error={errors.companyRole}
                                                                touched={touched.companyRole}
                                                                value={values.companyRole} />
                                                        </div>
                                                    </div>

                                                    <div className='form-control fullWidthWrapper'>
                                                        <h2 className="upload__title">Upload Logo</h2>
                                                        <section className="singleUploadForm">
                                                            {this.state.imageName.length > 0 || this.state.companyID != 0 ?
                                                                <aside className='thumbsContainer'>
                                                                    <div className="uploadedName ">
                                                                        <p>{this.state.imageName}</p>
                                                                    </div>
                                                                    {this.state.imageName.length > 0 || this.state.companyID != 0 ?
                                                                        <div className="thumbStyle" key={this.state.imageName}>
                                                                            <div className="thumbInnerStyle">
                                                                                <img src={this.state.imagePreview} className="imgStyle" />
                                                                            </div>
                                                                        </div>
                                                                        : null}
                                                                </aside> : null}
                                                            <Dropzone accept="image/*" onDrop={this.onDropImage.bind(this)}>
                                                                {({ getRootProps, getInputProps }) => (
                                                                    <div className="singleDragText" {...getRootProps()}>
                                                                        <input {...getInputProps()} />
                                                                        {this.state.imageName.length > 0 ?
                                                                            null : <p>{Resources['dragFileHere'][currentLanguage]}</p>}
                                                                        <button type='button' className="primaryBtn-1 btn smallBtn">{Resources['chooseFile'][currentLanguage]}</button>
                                                                    </div>
                                                                )}
                                                            </Dropzone>
                                                            {this.state.imageName.length > 0 ?
                                                                <div className="removeBtn">
                                                                    <button className="primaryBtn-2 btn smallBtn" type='button'
                                                                        onClick={this.removeImage}>{Resources['clear'][currentLanguage]}</button>
                                                                </div> : null}
                                                        </section>
                                                    </div>

                                                    {this.state.companyID > 0 ?
                                                        <div className='form-control fullWidthWrapper'>
                                                            <h2 className="upload__title">Upload Company Image</h2>
                                                            <section className="singleUploadForm">
                                                                {this.state.imageFooterIamge.length > 0 || this.state.companyID != 0 ?
                                                                    <aside className='thumbsContainer'>
                                                                        <div className="uploadedName ">
                                                                            <p>{this.state.imageFooterName}</p>
                                                                        </div>
                                                                        {this.state.imageFooter.length > 0 ?
                                                                            <div className="thumbStyle" key={this.state.imageFooterIamge}>
                                                                                <div className="thumbInnerStyle">
                                                                                    <img src={this.state.imageFooterPreview} className="imgStyle" />
                                                                                </div>
                                                                            </div>
                                                                            : null}
                                                                    </aside> : null}
                                                                <Dropzone accept="image/*" onDrop={this.onDropImageFooter}>
                                                                    {({ getRootProps, getInputProps }) => (
                                                                        <div className="singleDragText" {...getRootProps()}>
                                                                            <input {...getInputProps()} />
                                                                            {this.state.imageFooterIamge.length > 0 ?
                                                                                null : <p>{Resources['dragFileHere'][currentLanguage]}</p>}
                                                                            <button type='button' className="primaryBtn-1 btn smallBtn">{Resources['chooseFile'][currentLanguage]}</button>
                                                                        </div>
                                                                    )}
                                                                </Dropzone>
                                                                {this.state.imageFooter.length > 0 ?
                                                                    <div className="removeBtn">
                                                                        <button className="primaryBtn-2 btn smallBtn" type='button' onClick={this.removeFooterImage}>{Resources['clear'][currentLanguage]}</button>
                                                                    </div> : null}
                                                            </section>
                                                        </div> : null}
                                                    <div>
                                                        {this.state.companyID == 0 ?
                                                            <>
                                                                <header className="main__header" style={{ marginBottom: '25px' }}>
                                                                    <h3 className="main__header--div" style={{ padding: '0', fontWeight: 'bold' }}>{Resources['KeyContact'][currentLanguage]}</h3>
                                                                </header>
                                                                <div className="proForm datepickerContainer">
                                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                                        <Dropdown title="empTitle" data={this.state.TitleData}
                                                                            name="title"
                                                                            selectedValue={this.state.selectedTitle}
                                                                            onChange={setFieldValue}
                                                                            handleChange={(e) => this.handleChangeDropDown(e, "title")}
                                                                            onBlur={setFieldTouched}
                                                                            error={errors.title}
                                                                            touched={touched.title}
                                                                            value={values.title} />
                                                                    </div>

                                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                                        <label className="control-label"> {Resources['email'][currentLanguage]} </label>
                                                                        <div className={"ui input inputDev fillter-item-c " + (errors.email && touched.email ? ("has-error") : !errors.email && touched.email ? ("has-success") : "")}>
                                                                            <input name="email" id="email" className="form-control fsadfsadsa"
                                                                                placeholder={Resources.email[currentLanguage]}
                                                                                autoComplete="off"
                                                                                value={this.state.document.email}
                                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                                onChange={e => this.handleChange(e, "email")} />
                                                                            {errors.email && touched.email ? (<em className="pError">{errors.email}</em>) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                                        <label className="control-label"> {Resources['ContactNameEn'][currentLanguage]} </label>
                                                                        <div className={"ui input inputDev fillter-item-c " + (errors.ContactNameEn && touched.ContactNameEn ? ("has-error") : !errors.ContactNameEn && touched.ContactNameEn ? ("has-success") : "")}>
                                                                            <input name="ContactNameEn" id="ContactNameEn" className="form-control fsadfsadsa"
                                                                                placeholder={Resources.ContactNameEn[currentLanguage]}
                                                                                autoComplete="off"
                                                                                value={this.state.document.ContactNameEn}
                                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                                onChange={e => this.handleChange(e, "ContactNameEn")} />
                                                                            {errors.ContactNameEn && touched.ContactNameEn ? (<em className="pError">{errors.ContactNameEn}</em>) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                                        <label className="control-label"> {Resources['ContactNameAr'][currentLanguage]} </label>
                                                                        <div className={"ui input inputDev fillter-item-c " + (errors.ContactNameAr && touched.ContactNameAr ? ("has-error") : !errors.ContactNameAr && touched.ContactNameAr ? ("has-success") : "")}>
                                                                            <input name="ContactNameAr" id="ContactNameAr" className="form-control fsadfsadsa"
                                                                                placeholder={Resources.ContactNameAr[currentLanguage]}
                                                                                autoComplete="off"
                                                                                value={this.state.document.ContactNameAr}
                                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                                onChange={e => this.handleChange(e, "ContactNameAr")} />
                                                                            {errors.ContactNameAr && touched.ContactNameAr ? (<em className="pError">{errors.ContactNameAr}</em>) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                                        <label className="control-label"> {Resources['EnglishPosition'][currentLanguage]} </label>
                                                                        <div className={"ui input inputDev fillter-item-c " + (errors.positionEn && touched.positionEn ? ("has-error") : !errors.positionEn && touched.positionEn ? ("has-success") : "")}>
                                                                            <input name="positionEn" id="positionEn" className="form-control fsadfsadsa"
                                                                                placeholder={Resources.EnglishPosition[currentLanguage]}
                                                                                autoComplete="off"
                                                                                value={this.state.document.positionEn}
                                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                                onChange={e => this.handleChange(e, "positionEn")} />
                                                                            {errors.positionEn && touched.positionEn ? (<em className="pError">{errors.positionEn}</em>) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                                        <label className="control-label"> {Resources['ArabicPosition'][currentLanguage]} </label>
                                                                        <div className={"ui input inputDev fillter-item-c " + (errors.positionAr && touched.positionAr ? ("has-error") : !errors.positionAr && touched.positionAr ? ("has-success") : "")}>
                                                                            <input name="positionAr" id="positionAr" className="form-control fsadfsadsa"
                                                                                placeholder={Resources.ArabicPosition[currentLanguage]}
                                                                                autoComplete="off"
                                                                                value={this.state.document.positionAr}
                                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                                onChange={e => this.handleChange(e, "positionAr")} />
                                                                            {errors.positionAr && touched.positionAr ? (<em className="pError">{errors.positionAr}</em>) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                                        <label className="control-label"> {Resources['EnglishAddress'][currentLanguage]} </label>
                                                                        <div className={"ui input inputDev fillter-item-c " + (errors.addressEn && touched.addressEn ? ("has-error") : !errors.addressEn && touched.addressEn ? ("has-success") : "")}>
                                                                            <input name="addressEn" id="addressEn" className="form-control fsadfsadsa"
                                                                                placeholder={Resources.EnglishAddress[currentLanguage]}
                                                                                autoComplete="off"
                                                                                value={this.state.document.addressEn}
                                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                                onChange={e => this.handleChange(e, "addressEn")} />
                                                                            {errors.addressEn && touched.addressEn ? (<em className="pError">{errors.addressEn}</em>) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                                        <label className="control-label"> {Resources['ArabicAddress'][currentLanguage]} </label>
                                                                        <div className={"ui input inputDev fillter-item-c " + (errors.addressAr && touched.addressAr ? ("has-error") : !errors.addressAr && touched.addressAr ? ("has-success") : "")}>
                                                                            <input name="addressAr" id="addressAr" className="form-control fsadfsadsa"
                                                                                placeholder={Resources.ArabicAddress[currentLanguage]}
                                                                                autoComplete="off"
                                                                                value={this.state.document.addressAr}
                                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                                onChange={e => this.handleChange(e, "addressAr")} />
                                                                            {errors.addressAr && touched.addressAr ? (<em className="pError">{errors.addressAr}</em>) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                                        <label className="control-label"> {Resources['Telephone'][currentLanguage]} </label>
                                                                        <div className={"ui input inputDev fillter-item-c " + (errors.Telephone && touched.Telephone ? ("has-error") : !errors.Telephone && touched.Telephone ? ("has-success") : "")}>

                                                                            <input name="Telephone" id="Telephone" className="form-control fsadfsadsa"
                                                                                placeholder={Resources.Telephone[currentLanguage]}
                                                                                autoComplete="off"
                                                                                value={this.state.document.Telephone}
                                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                                onChange={e => this.handleChange(e, "Telephone")} />
                                                                            {errors.Telephone && touched.Telephone ? (<em className="pError">{errors.Telephone}</em>) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                                        <label className="control-label"> {Resources['Mobile'][currentLanguage]} </label>
                                                                        <div className={"ui input inputDev fillter-item-c " + (errors.Mobile && touched.Mobile ? ("has-error") : !errors.Mobile && touched.Mobile ? ("has-success") : "")}>

                                                                            <input name="Mobile" id="Mobile" className="form-control fsadfsadsa"
                                                                                placeholder={Resources.Mobile[currentLanguage]}
                                                                                autoComplete="off"
                                                                                value={this.state.document.Mobile}
                                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                                onChange={e => this.handleChange(e, "Mobile")} />
                                                                            {errors.Mobile && touched.Mobile ? (<em className="pError">{errors.Mobile}</em>) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                                        <label className="control-label"> {Resources['abbrevationEn'][currentLanguage]} </label>
                                                                        <div className="ui input inputDev fillter-item-c ">
                                                                            <input name="abbrevationEn" id="abbrevationEn" className="form-control fsadfsadsa"
                                                                                placeholder={Resources.abbrevationEn[currentLanguage]}
                                                                                autoComplete="off"
                                                                                value={this.state.document.abbrevationEn}
                                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                                onChange={e => this.handleChange(e, "abbrevationEn")} />
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                                        <label className="control-label"> {Resources['abbrevationAr'][currentLanguage]} </label>
                                                                        <div className="ui input inputDev fillter-item-c ">
                                                                            <input name="abbrevationAr" id="abbrevationAr" className="form-control fsadfsadsa"
                                                                                placeholder={Resources.abbrevationAr[currentLanguage]}
                                                                                autoComplete="off"
                                                                                value={this.state.document.abbrevationAr}
                                                                                onBlur={e => { handleBlur(e); handleChange(e); }}
                                                                                onChange={e => this.handleChange(e, "abbrevationAr")} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            : null}
                                                        <div className="slider-Btns">
                                                            {this.state.isLoading === false ? (
                                                                <button className="primaryBtn-1 btn" type="submit" >{Resources['save'][currentLanguage]}</button>
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
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    GetData = (url, label, value, currState) => {
        Dataservice.GetDataList(url, label, value).then(res => {
            this.setState({
                [currState]: [...res],
                sectionLoading: false
            });
        })
    }
}

const mapStateToProps = (state) => {
    let sState = state;
    return sState;
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AdminstrationActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddEditCompany));

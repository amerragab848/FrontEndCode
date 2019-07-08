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


let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
var ar = new RegExp("^[\u0621-\u064A\u0660-\u0669 ]+$");
var en = new RegExp("\[\\u0600\-\\u06ff\]\|\[\\u0750\-\\u077f\]\|\[\\ufb50\-\\ufc3f\]\|\[\\ufe70\-\\ufefc\]");
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email(Resources['emailFormat'][currentLanguage])
        .required(Resources['emailRequired'][currentLanguage]),
    titleEnCompany: Yup.string().test('titleEnCompany', 'Name cannot be arabic', value => {
        return ! en.test(value);
    }).required(Resources['ComapnyNameRequired'][currentLanguage]),
    titleArCompany: Yup.string().test('contactNameAr', 'Name cannot be english', value => { 
        return  ar.test(value)
    }).required(Resources['ComapnyNameRequired'][currentLanguage]),
    ContactNameEn: Yup.string().required(Resources['contactNameRequired'][currentLanguage]),
    ContactNameAr: Yup.string().required(Resources['contactNameRequired'][currentLanguage]),
    Mobile: Yup.number().required(Resources['mobileRequired'][currentLanguage]),
    Telephone: Yup.number(),
    discipline: Yup.string().required(Resources['disciplineRequired'][currentLanguage]),
    title: Yup.string().required(Resources['empTitleRequired'][currentLanguage]),
    companyRole: Yup.string().required(Resources['companyRoleRequired'][currentLanguage])
})
const validationSchemaForEdit = Yup.object().shape({
    titleEnCompany: Yup.string().test('titleEnCompany', 'Name cannot be arabic', value => {
        return ! en.test(value);
    }).required(Resources['ComapnyNameRequired'][currentLanguage]),
    titleArCompany: Yup.string().test('contactNameAr', 'Name cannot be english', value => { 
        return  ar.test(value)
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
            companyData: [], profilePath: '',
            isLoading: false,
            sectionLoading: false,
            titleEnCompany: '',
            titleArCompany: ''

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
    removeImage = () => {

        this.setState({
            image: {}, imageName: '', imagePreview: {}
        })

    }

    handleChange = (item, name) => {
        switch (name) {
            case "title":
                this.setState({ selectedTitle: item })
                break;
            case "companyRole":
                this.setState({ selectedCompanyRole: item })
                break;
            case "discipline":
                this.setState({ selectedDiscipline: item })
                break;
            default:
                break;
        }
    }

    componentDidMount = () => {
        this.setState({ sectionLoading: true })

        URL.revokeObjectURL(this.state.imagePreview)
        if (this.state.companyID == 0) {
            this.GetData('GetaccountsDefaultListForList?listType=discipline', 'title', 'id', 'disciplineData')
            this.GetData('GetaccountsDefaultListForList?listType=companyrole', 'title', 'id', 'CompanyRoleData')
            this.GetData('GetaccountsDefaultListForList?listType=contacttitle', 'title', 'id', 'TitleData')
            let id = TokenStore.getItem('projectIdForaddCompany')
            this.setState({ projectId: (id ? id : 0) })

        } else {
            this.GetData('GetaccountsDefaultListForList?listType=discipline', 'title', 'id', 'disciplineData')
            this.GetData('GetaccountsDefaultListForList?listType=companyrole', 'title', 'id', 'CompanyRoleData')

            Api.get('GetProjectCompaniesForEdit?id=' + this.state.companyID).then(res => {
                this.setState({
                    companyData: res,
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
        let SendingObject = {
            id: this.state.companyID,
            companyNameEn: values.titleEnCompany,
            companyNameAr: values.titleArCompany,
            disciplineId: this.state.selectedDiscipline.value,
            disciplineTitle: this.state.selectedDiscipline.label,
            roleId: this.state.selectedCompanyRole.value,
            roleTitle: this.state.selectedCompanyRole.label,
            titleId: this.state.selectedTitle.value,
            email: values.email,
            contactNameEn: values.ContactNameEn,
            contactNameAr: values.ContactNameAr,
            positionEn: values.positionEn,
            positionAr: values.positionAr,
            addressEn: values.addressEn,
            addressAr: values.addressAr,
            tele: values.Telephone,
            mobile: values.mobile,
            projectId: this.state.projectId,
            logoFileData: this.state.imageIamge

        }
        if (this.state.companyID == 0) {
            Api.post('AddCompanyContact', SendingObject).then(() => {
                this.setState({ isLoading: false })
                this.props.actions.routeToTabIndex(1)
                this.props.history.push({ pathname: '/TemplatesSettings' })
                toast.success("operation complete sucessful")
            })
        }
        else {
            Api.post('EditProjectCompanies', SendingObject).then(() => {
                this.setState({ isLoading: false })
                this.props.actions.routeToTabIndex(1)
                this.props.history.push({ pathname: '/TemplatesSettings' })
                toast.success("operation complete sucessful");
            })
        }
    }

    render() {
        return (
            <div className="mainContainer main__fulldash">
                <div className="documents-stepper cutome__inputs noTabs__document">
                    <div className="submittalHead">
                        <h2 className="zero">{this.state.companyID == 0 ? Resources['addComapny'][currentLanguage] : Resources['editCompany'][currentLanguage]}</h2>
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
                        <div className="step-content noBtn__footer">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    {this.state.sectionLoading ? <LoadingSection /> :

                                        <Formik

                                            initialValues={{
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
                                                discipline: this.state.selectedDiscipline,
                                                title: this.state.selectedTitle,
                                                companyRole: this.state.selectedCompanyRole
                                            }}
                                            enableReinitialize={true}
                                            validationSchema={this.state.companyID == 0 ? validationSchema : validationSchemaForEdit}
                                            onSubmit={(values) => {
                                                this.setState({ isLoading: true })
                                                this.Save(values)
                                            }}
                                        >
                                            {({ touched, errors, handleBlur, handleChange, values, setFieldValue, setFieldTouched }) => (
                                                <Form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate" >
                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                        <label className="control-label"> {Resources['titleEnCompany'][currentLanguage]} </label>
                                                        <div className={"ui input inputDev fillter-item-c " + (errors.titleEnCompany && touched.titleEnCompany ? (
                                                            "has-error") : !errors.titleEnCompany && touched.titleEnCompany ? ("has-success") : "")}
                                                        >
                                                            <input autoComplete="off" type='text' className="form-control" name="titleEnCompany" value={values.titleEnCompany}
                                                                onBlur={handleBlur} onChange={handleChange} placeholder={Resources['titleEnCompany'][currentLanguage]} />
                                                            {errors.titleEnCompany && touched.titleEnCompany ? (
                                                                <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                            ) : !errors.titleEnCompany && touched.titleEnCompany ? (
                                                                <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                            ) : null}
                                                            {errors.titleEnCompany && touched.titleEnCompany ? (
                                                                <em className="pError">{errors.titleEnCompany}</em>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                        <label className="control-label"> {Resources['titleArCompany'][currentLanguage]} </label>

                                                        <div className={"ui input inputDev fillter-item-c " + (errors.titleArCompany && touched.titleArCompany ? (
                                                            "has-error") : !errors.titleArCompany && touched.titleArCompany ? ("has-success") : "")}
                                                        >
                                                            <input autoComplete="off" type='text' className="form-control" name="titleArCompany" value={values.titleArCompany}
                                                                onBlur={handleBlur} onChange={handleChange} placeholder={Resources['titleArCompany'][currentLanguage]} />
                                                            {errors.titleArCompany && touched.titleArCompany ? (
                                                                <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                            ) : !errors.titleArCompany && touched.titleArCompany ? (
                                                                <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                            ) : null}
                                                            {errors.titleArCompany && touched.titleArCompany ? (
                                                                <em className="pError">{errors.titleArCompany}</em>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                        <Dropdown title="discipline" data={this.state.disciplineData}
                                                            name="discipline"
                                                            selectedValue={values.discipline}
                                                            onChange={setFieldValue}
                                                            handleChange={(e) => this.handleChange(e, "discipline")}
                                                            onBlur={setFieldTouched}
                                                            error={errors.discipline}
                                                            touched={touched.discipline}
                                                            value={values.discipline} />
                                                    </div>
                                                    <div className="linebylineInput valid-input passWrapperInput">
                                                        <Dropdown title="companyRole" data={this.state.CompanyRoleData}
                                                            name="companyRole"
                                                            selectedValue={values.companyRole}
                                                            onChange={setFieldValue}
                                                            handleChange={(e) => this.handleChange(e, "companyRole")}
                                                            onBlur={setFieldTouched}
                                                            error={errors.companyRole}
                                                            touched={touched.companyRole}
                                                            value={values.companyRole} />
                                                    </div>
                                                    <div className='form-control fullWidthWrapper'>
                                                        <section className="singleUploadForm">
                                                            {this.state.imageName.length > 0 || this.state.companyID != 0 ?
                                                                <aside className='thumbsContainer'>
                                                                    <div className="uploadedName ">
                                                                        <p>{this.state.imageName}</p>
                                                                    </div>
                                                                    {this.state.imageName.length > 0 || this.state.companyID != 0 ?
                                                                        <div className="thumbStyle" key={this.state.imageName}>
                                                                            <div className="thumbInnerStyle">
                                                                                <img
                                                                                    src={this.state.imagePreview}
                                                                                    className="imgStyle"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        : null}

                                                                </aside> : null}
                                                            <Dropzone
                                                                accept="image/*"
                                                                onDrop={this.onDropImage.bind(this)}
                                                            >
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

                                                    {this.state.companyID == 0 ?
                                                        <div className="workingHours__cycle">
                                                            <header>
                                                                <h3 className="zero">{Resources['KeyContact'][currentLanguage]}</h3>
                                                            </header>
                                                            <div className="proForm datepickerContainer">
                                                                <div className="linebylineInput valid-input passWrapperInput">
                                                                    <Dropdown title="empTitle" data={this.state.TitleData}
                                                                        name="title"
                                                                        selectedValue={values.title}
                                                                        onChange={setFieldValue}
                                                                        handleChange={(e) => this.handleChange(e, "title")}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.title}
                                                                        touched={touched.title}
                                                                        value={values.title} />
                                                                </div>
                                                                <div className="linebylineInput valid-input passWrapperInput">
                                                                    <label className="control-label"> {Resources['email'][currentLanguage]} </label>

                                                                    <div className={"ui input inputDev fillter-item-c " + (errors.email && touched.email ? (
                                                                        "has-error") : !errors.email && touched.email ? ("has-success") : "")}
                                                                    >
                                                                        <input autoComplete="off" type='text' className="form-control" name="email"
                                                                            onBlur={handleBlur} onChange={handleChange} placeholder={Resources['email'][currentLanguage]} />
                                                                        {errors.email && touched.email ? (
                                                                            <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                                        ) : !errors.email && touched.email ? (
                                                                            <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                                        ) : null}
                                                                        {errors.email && touched.email ? (
                                                                            <em className="pError">{errors.email}</em>
                                                                        ) : null}
                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input passWrapperInput">
                                                                    <label className="control-label"> {Resources['ContactNameEn'][currentLanguage]} </label>

                                                                    <div className={"ui input inputDev fillter-item-c " + (errors.ContactNameEn && touched.ContactNameEn ? (
                                                                        "has-error") : !errors.ContactNameEn && touched.ContactNameEn ? ("has-success") : "")}
                                                                    >
                                                                        <input autoComplete="off" type='text' className="form-control" name="ContactNameEn"
                                                                            onBlur={handleBlur} onChange={handleChange} placeholder={Resources['ContactNameEn'][currentLanguage]} />
                                                                        {errors.ContactNameEn && touched.ContactNameEn ? (
                                                                            <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                                        ) : !errors.ContactNameEn && touched.ContactNameEn ? (
                                                                            <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                                        ) : null}
                                                                        {errors.ContactNameEn && touched.ContactNameEn ? (
                                                                            <em className="pError">{errors.ContactNameEn}</em>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input passWrapperInput">
                                                                    <label className="control-label"> {Resources['ContactNameAr'][currentLanguage]} </label>

                                                                    <div className={"ui input inputDev fillter-item-c " + (errors.ContactNameAr && touched.ContactNameAr ? (
                                                                        "has-error") : !errors.ContactNameAr && touched.ContactNameAr ? ("has-success") : "")}
                                                                    >
                                                                        <input autoComplete="off" type='text' className="form-control" name="ContactNameAr"
                                                                            onBlur={handleBlur} onChange={handleChange} placeholder={Resources['ContactNameAr'][currentLanguage]} />
                                                                        {errors.ContactNameAr && touched.ContactNameAr ? (
                                                                            <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                                        ) : !errors.ContactNameAr && touched.ContactNameAr ? (
                                                                            <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                                        ) : null}
                                                                        {errors.ContactNameAr && touched.ContactNameAr ? (
                                                                            <em className="pError">{errors.ContactNameAr}</em>
                                                                        ) : null}
                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input passWrapperInput">
                                                                    <label className="control-label"> {Resources['EnglishPosition'][currentLanguage]} </label>

                                                                    <div className='ui input inputDev fillter-item-c'>
                                                                        <input autoComplete="off" type='text' className="form-control" name="positionEn"
                                                                            onBlur={handleBlur} onChange={handleChange} placeholder={Resources['EnglishPosition'][currentLanguage]} />

                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input passWrapperInput">
                                                                    <label className="control-label"> {Resources['ArabicPosition'][currentLanguage]} </label>

                                                                    <div className='ui input inputDev fillter-item-c'>
                                                                        <input autoComplete="off" type='text' className="form-control" name="positionAr"
                                                                            onBlur={handleBlur} onChange={handleChange} placeholder={Resources['ArabicPosition'][currentLanguage]} />

                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input passWrapperInput">
                                                                    <label className="control-label"> {Resources['EnglishAddress'][currentLanguage]} </label>

                                                                    <div className="ui input inputDev fillter-item-c">
                                                                        <input autoComplete="off" type='text' className="form-control" name="addressEn"
                                                                            onBlur={handleBlur} onChange={handleChange} placeholder={Resources['EnglishAddress'][currentLanguage]} />

                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input passWrapperInput">
                                                                    <label className="control-label"> {Resources['ArabicAddress'][currentLanguage]} </label>

                                                                    <div className="ui input inputDev fillter-item-c" >
                                                                        <input autoComplete="off" type='text' className="form-control" name="addressAr"
                                                                            onBlur={handleBlur} onChange={handleChange} placeholder={Resources['ArabicAddress'][currentLanguage]} />

                                                                    </div>
                                                                </div>


                                                                <div className="linebylineInput valid-input passWrapperInput">
                                                                    <label className="control-label"> {Resources['Telephone'][currentLanguage]} </label>

                                                                    <div className={"ui input inputDev fillter-item-c " + (errors.Telephone && touched.Telephone ? (
                                                                        "has-error") : !errors.Telephone && touched.Telephone ? ("has-success") : "")}
                                                                    >
                                                                        <input autoComplete="off" type='text' className="form-control" name="Telephone"
                                                                            onBlur={handleBlur} onChange={handleChange} placeholder={Resources['Telephone'][currentLanguage]} />
                                                                        {errors.Telephone && touched.Telephone ? (
                                                                            <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                                        ) : !errors.Telephone && touched.Telephone ? (
                                                                            <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                                        ) : null}
                                                                        {errors.Telephone && touched.Telephone ? (
                                                                            <em className="pError">{errors.Telephone}</em>
                                                                        ) : null}
                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input passWrapperInput">
                                                                    <label className="control-label"> {Resources['Mobile'][currentLanguage]} </label>

                                                                    <div className={"ui input inputDev fillter-item-c " + (errors.Mobile && touched.Mobile ? (
                                                                        "has-error") : !errors.Mobile && touched.Mobile ? ("has-success") : "")}
                                                                    >
                                                                        <input autoComplete="off" type='text' className="form-control" name="Mobile"
                                                                            onBlur={handleBlur} onChange={handleChange} placeholder={Resources['Mobile'][currentLanguage]} />
                                                                        {errors.Mobile && touched.Mobile ? (
                                                                            <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                                        ) : !errors.Mobile && touched.Mobile ? (
                                                                            <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                                        ) : null}
                                                                        {errors.Mobile && touched.Mobile ? (
                                                                            <em className="pError">{errors.Mobile}</em>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : null}

                                                    <div className="slider-Btns">
                                                        {this.state.isLoading === false ? (
                                                            <button
                                                                className="primaryBtn-1 btn"
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
                                    }

                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </div>
        );
    }

    GetData = (url, label, value, currState) => {
        Dataservice.GetDataList(url, label, value).then(res => {
            console.log('res', res)
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

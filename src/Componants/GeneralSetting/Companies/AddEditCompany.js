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

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email(Resources['emailFormat'][currentLanguage])
        .required(Resources['emailRequired'][currentLanguage]),
    titleEnCompany: Yup.string().required(Resources['ComapnyNameRequired'][currentLanguage]),
    titleArCompany: Yup.string().required(Resources['ComapnyNameRequired'][currentLanguage]),
    ContactNameEn: Yup.string().required(Resources['contactNameRequired'][currentLanguage]),
    ContactNameAr: Yup.string().required(Resources['contactNameRequired'][currentLanguage]),
    Mobile: Yup.number().required(Resources['mobileRequired'][currentLanguage]),
    Telephone: Yup.number(),
    discipline: Yup.string().required(Resources['disciplineRequired'][currentLanguage]),
    title:Yup.string().required(Resources['empTitleRequired'][currentLanguage]),
    companyRole:Yup.string().required(Resources['companyRoleRequired'][currentLanguage])
})
const validationSchemaForEdit = Yup.object().shape({
    titleEnCompany: Yup.string().required(Resources['ComapnyNameRequired'][currentLanguage]),
    titleArCompany: Yup.string().required(Resources['ComapnyNameRequired'][currentLanguage]),
    discipline: Yup.string().required(Resources['disciplineRequired'][currentLanguage]),
    companyRole:Yup.string().required(Resources['companyRoleRequired'][currentLanguage])
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
            <div className="mainContainer">
                <div className="dropWrapper">
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
                                discipline:this.state.selectedDiscipline,
                                title:this.state.selectedTitle,
                                companyRole:this.state.CompanyRoleData
                            }}
                            enableReinitialize={true}
                            validationSchema={this.state.companyID==0?validationSchema:validationSchemaForEdit}
                            onSubmit={(values) => {
                                this.setState({ isLoading: true })
                                    this.Save(values)
                            }}
                        >
                            {({ touched, errors, handleBlur, handleChange, values,setFieldValue, setFieldTouched}) => (
                                <Form id="signupForm1" className="proForm customProform" noValidate="novalidate" >

                                    <div className="fullWidthWrapper">
                                        <h2 className="twoLineHeader">{this.state.companyID == 0 ? Resources['addComapny'][currentLanguage] : Resources['editCompany'][currentLanguage]}</h2>
                                    </div>

                                    <div className={"ui input inputDev fillter-item-c " + (errors.titleEnCompany && touched.titleEnCompany ? (
                                        "has-error") : !errors.titleEnCompany && touched.titleEnCompany ? ("has-success") : "")}
                                    >
                                        <label className="control-label"> {Resources['titleEnCompany'][currentLanguage]} </label>
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

                                    <div className={"ui input inputDev fillter-item-c " + (errors.titleArCompany && touched.titleArCompany ? (
                                        "has-error") : !errors.titleArCompany && touched.titleArCompany ? ("has-success") : "")}
                                    >
                                        <label className="control-label"> {Resources['titleArCompany'][currentLanguage]} </label>
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

                                        <Dropdown title="discipline" data={this.state.disciplineData}
                                            name="discipline"
                                            selectedValue={values.discipline}
                                            onChange={  setFieldValue   }
                                            handleChange={(e) =>this.handleChange(e, "discipline")}
                                            onBlur={setFieldTouched}
                                            error={errors.discipline}
                                            touched={touched.discipline}
                                            value={values.discipline} />
                              
                                        <Dropdown title="companyRole" data={this.state.CompanyRoleData}
                                                 name="companyRole"
                                                 selectedValue={values.companyRole}
                                                 onChange={  setFieldValue   }
                                                 handleChange={(e) =>this.handleChange(e, "companyRole")}
                                                 onBlur={setFieldTouched}
                                                 error={errors.companyRole}
                                                 touched={touched.companyRole}
                                                 value={values.companyRole} />
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
                                        <div className="dropWrapper">
                                            <div className="fullWidthWrapper">
                                                <h2 className="twoLineHeader">{Resources['KeyContact'][currentLanguage]}</h2>
                                            </div>

                                           
                                                <Dropdown title="empTitle" data={this.state.TitleData}
                                                       name="title"
                                                       selectedValue={values.title}
                                                       onChange={  setFieldValue   }
                                                       handleChange={(e) =>this.handleChange(e, "title")}
                                                       onBlur={setFieldTouched}
                                                       error={errors.title}
                                                       touched={touched.title}
                                                       value={values.title}/>


                                            <div className={"ui input inputDev fillter-item-c " + (errors.email && touched.email ? (
                                                "has-error") : !errors.email && touched.email ? ("has-success") : "")}
                                            >
                                                <label className="control-label"> {Resources['email'][currentLanguage]} </label>
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


                                            <div className={"ui input inputDev fillter-item-c " + (errors.ContactNameEn && touched.ContactNameEn ? (
                                                "has-error") : !errors.ContactNameEn && touched.ContactNameEn ? ("has-success") : "")}
                                            >
                                                <label className="control-label"> {Resources['ContactNameEn'][currentLanguage]} </label>
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

                                            <div className={"ui input inputDev fillter-item-c " + (errors.ContactNameAr && touched.ContactNameAr ? (
                                                "has-error") : !errors.ContactNameAr && touched.ContactNameAr ? ("has-success") : "")}
                                            >
                                                <label className="control-label"> {Resources['ContactNameAr'][currentLanguage]} </label>
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


                                            <div className='ui input inputDev fillter-item-c'>
                                                <label className="control-label"> {Resources['EnglishPosition'][currentLanguage]} </label>
                                                <input autoComplete="off" type='text' className="form-control" name="positionEn"
                                                    onBlur={handleBlur} onChange={handleChange} placeholder={Resources['EnglishPosition'][currentLanguage]} />

                                            </div>

                                            <div className='ui input inputDev fillter-item-c'>
                                                <label className="control-label"> {Resources['ArabicPosition'][currentLanguage]} </label>
                                                <input autoComplete="off" type='text' className="form-control" name="positionAr"
                                                    onBlur={handleBlur} onChange={handleChange} placeholder={Resources['ArabicPosition'][currentLanguage]} />

                                            </div>


                                            <div className="ui input inputDev fillter-item-c">
                                                <label className="control-label"> {Resources['EnglishAddress'][currentLanguage]} </label>
                                                <input autoComplete="off" type='text' className="form-control" name="addressEn"
                                                    onBlur={handleBlur} onChange={handleChange} placeholder={Resources['EnglishAddress'][currentLanguage]} />

                                            </div>

                                            <div className="ui input inputDev fillter-item-c" >
                                                <label className="control-label"> {Resources['ArabicAddress'][currentLanguage]} </label>
                                                <input autoComplete="off" type='text' className="form-control" name="addressAr"
                                                    onBlur={handleBlur} onChange={handleChange} placeholder={Resources['ArabicAddress'][currentLanguage]} />

                                            </div>



                                            <div className={"ui input inputDev fillter-item-c " + (errors.Telephone && touched.Telephone ? (
                                                "has-error") : !errors.Telephone && touched.Telephone ? ("has-success") : "")}
                                            >
                                                <label className="control-label"> {Resources['Telephone'][currentLanguage]} </label>
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


                                            <div className={"ui input inputDev fillter-item-c " + (errors.Mobile && touched.Mobile ? (
                                                "has-error") : !errors.Mobile && touched.Mobile ? ("has-success") : "")}
                                            >
                                                <label className="control-label"> {Resources['Mobile'][currentLanguage]} </label>
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
                                        : null}

                                    <div className="fullWidthWrapper">
                                        {this.state.isLoading === false ? (
                                            <button
                                                className="primaryBtn-1 btn largeBtn"
                                                type="submit"
                                            >  {Resources['save'][currentLanguage]}
                                            </button>
                                        ) :
                                            (
                                                <button className="primaryBtn-1 btn largeBtn disabled" disabled="disabled">
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

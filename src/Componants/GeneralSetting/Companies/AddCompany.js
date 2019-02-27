import React, { Component } from "react";

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Api from "../../../api";
import Dropdown from "../../../Componants/OptionsPanels/DropdownMelcous";
import Dropzone from "react-dropzone";
import Resources from "../../../resources.json";
import TokenStore from '../../../tokenStore'
 
import { withRouter } from "react-router-dom";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";


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
    Telephone: Yup.number()
})

const validationSchema1 = Yup.object().shape({

})
class AddCompany extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sign: {},
            signPreview: {},
            signName: '',
            signIamge: '',
            selectedDiscipline: '',
            disciplineData: [],
            selectedCompanyRole: '',
            CompanyRoleData: [],
            selectedTitle: '',
            TitleValidation: true,
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
    onDropSign(file) {
        let _formData = new FormData();
        _formData.append("file", file)
        this.setState({
            sign: file,
            signPreview: URL.createObjectURL(file[0]),
            signName: file[0].name,
            signIamge: _formData
        });


    }
    RemoveHandlerSign = () => {

        this.setState({
            sign: {}, signName: '', signPreview: {}
        })

    }



    disciplinehandleChange = (item) => {
        this.setState({ selectedDiscipline: item })
        console.log("path", this.state.signPreview)

    }

    CompanyRolehandleChange = (item) => {
        this.setState({ selectedCompanyRole: item })

    }
    TitlehandleChange = (item) => {
        this.setState({ selectedTitle: item, TitleValidation: false })
    }


    componentDidMount = () => {
        this.setState({ sectionLoading: true })

        URL.revokeObjectURL(this.state.signPreview)
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
                    companyData: res, signPreview: res.logo, sectionLoading: false,
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
            logoFileData: this.state.signIamge

        }

        {
            this.state.companyID == 0 ? Api.post('AddCompanyContact', SendingObject).then(
                this.setState({ isLoading: false }),
                this.props.history.push({
                    pathname: "/"
                })
            )
                : Api.post('EditProjectCompanies', SendingObject).then(
                    this.setState({ isLoading: false }),
                    this.props.history.push({
                        pathname: "/"
                    })
                )
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
                                disciplineValidation: '',
                                CompanyRoleValidation: '',
                                TitleValidation: '',
                                email: '',
                                ContactNameEn: '',
                                ContactNameAr: '',
                                Mobile: '',
                                positionEn: '',
                                positionAr: '',
                                addressEn: '',
                                addressAr: '',
                                Telephone: ''
                            }}
                            enableReinitialize= {true}
                            validationSchema={this.state.companyID > 0 ? validationSchema1 : validationSchema}
                            onSubmit={(values) => {
                                if ((this.state.selectedDiscipline != '' && this.state.selectedCompanyRole != '') &&
                                    (!this.state.TitleValidation || this.state.companyID > 0)) {
                                    this.setState({ isLoading: true })
                                    this.Save(values)
                                }
                            }}
                        >
                            {({ touched, errors, handleBlur, handleChange, values }) => (
                                <Form id="signupForm1" className="proForm customProform" noValidate="novalidate" >

                                    <div className="fullWidthWrapper">
                                        <h2 className="twoLineHeader">{this.state.companyID == 0 ? Resources['addComapny'][currentLanguage] : Resources['editCompany'][currentLanguage]}</h2>
                                    </div>

                                    <div className={errors.titleEnCompany && touched.titleEnCompany ? (
                                        "ui input inputDev fillter-item-c has-error"
                                    ) : !errors.password && touched.password ? (
                                        "ui input inputDev fillter-item-c has-success"
                                    ) : "ui input inputDev fillter-item-c"}
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

                                    <div className={errors.titleArCompany && touched.titleArCompany ? (
                                        "ui input inputDev fillter-item-c has-error"
                                    ) : !errors.password && touched.password ? (
                                        "ui input inputDev fillter-item-c has-success"
                                    ) : "ui input inputDev fillter-item-c"}
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


                                    <div className={this.state.disciplineValidation && touched.disciplineValidation ? (
                                        "ui input inputDev fillter-item-c has-error"
                                    ) : !this.state.disciplineValidation && touched.disciplineValidation ? (
                                        "ui input inputDev fillter-item-c has-success"
                                    ) : "ui input inputDev fillter-item-c"}
                                    >
                                        <Dropdown title="discipline" data={this.state.disciplineData}
                                            handleChange={this.disciplinehandleChange} selectedValue={this.state.selectedDiscipline}
                                            index='discipline' name="disciplineValidation" handleBlur={handleBlur} />
                                        {this.state.disciplineValidation && touched.disciplineValidation ? (
                                            <em className="pError">{this.state.disciplineValidation}</em>
                                        ) : null}

                                        {this.state.disciplineValidation && touched.disciplineValidation ? (
                                            <em className="pError">{Resources['disciplineRequired'][currentLanguage]}</em>
                                        ) : null}
                                    </div>



                                    <div className={this.state.CompanyRoleValidation && touched.CompanyRoleValidation ? (
                                        "ui input inputDev fillter-item-c has-error"
                                    ) : !this.state.CompanyRoleValidation && touched.CompanyRoleValidation ? (
                                        "ui input inputDev fillter-item-c has-success"
                                    ) : "ui input inputDev fillter-item-c"}
                                    >
                                        <Dropdown title="companyRole" data={this.state.CompanyRoleData}
                                            handleChange={this.CompanyRolehandleChange} selectedValue={this.state.selectedCompanyRole}
                                            index='CompanyRole' name="CompanyRoleValidation" />
                                        {this.state.CompanyRoleValidation && touched.CompanyRoleValidation ? (
                                            <em className="pError">{this.state.CompanyRoleValidation}</em>
                                        ) : null}

                                        {this.state.CompanyRoleValidation && touched.CompanyRoleValidation ? (
                                            <em className="pError">{Resources['companyRoleRequired'][currentLanguage]}</em>
                                        ) : null}
                                    </div>



                                    <div className='form-control fullWidthWrapper'>
                                        <section className="singleUploadForm">
                                            {this.state.signName.length > 0 || this.state.companyID != 0 ?
                                                <aside className='thumbsContainer'>
                                                    <div className="uploadedName ">
                                                        <p>{this.state.signName}</p>
                                                    </div>
                                                    {this.state.signName.length > 0 || this.state.companyID != 0 ?
                                                        <div className="thumbStyle" key={this.state.signName}>
                                                            <div className="thumbInnerStyle">
                                                                <img
                                                                    src={this.state.signPreview}
                                                                    className="imgStyle"
                                                                />
                                                            </div>
                                                        </div>
                                                        : null}

                                                </aside> : null}
                                            <Dropzone
                                                accept="image/*"
                                                onDrop={this.onDropSign.bind(this)}
                                            >
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="singleDragText" {...getRootProps()}>
                                                        <input {...getInputProps()} />

                                                        {this.state.signName.length > 0 ?
                                                            null : <p>{Resources['dragFileHere'][currentLanguage]}</p>}
                                                        <button type='button' className="primaryBtn-1 btn smallBtn">{Resources['chooseFile'][currentLanguage]}</button>
                                                    </div>
                                                )}
                                            </Dropzone>
                                            {this.state.signName.length > 0 ?
                                                <div className="removeBtn">
                                                    <button className="primaryBtn-2 btn smallBtn" type='button'
                                                        onClick={this.RemoveHandlerSign}>{Resources['clear'][currentLanguage]}</button>
                                                </div> : null}


                                        </section>


                                    </div>



                                    {this.state.companyID == 0 ?
                                        <div >
                                            <div className="fullWidthWrapper">
                                                <h2 className="twoLineHeader">{Resources['KeyContact'][currentLanguage]}</h2>
                                            </div>

                                            <div className={this.state.TitleValidation && touched.TitleValidation ? (
                                                "ui input inputDev fillter-item-c has-error"
                                            ) : !this.state.TitleValidation && touched.TitleValidation ? (
                                                "ui input inputDev fillter-item-c has-success"
                                            ) : "ui input inputDev fillter-item-c"}
                                            >
                                                <Dropdown title="empTitle" data={this.state.TitleData}
                                                    handleChange={this.TitlehandleChange}
                                                    index='Title' name="TitleValidation" />
                                                {this.state.TitleValidation && touched.TitleValidation ? (
                                                    <em className="pError">{this.state.TitleValidation}</em>
                                                ) : null}

                                                {this.state.TitleValidation && touched.TitleValidation ? (
                                                    <em className="pError">{Resources['titleSelection'][currentLanguage]}</em>
                                                ) : null}
                                            </div>

                                            <div className={errors.email && touched.email ? (
                                                "ui input inputDev fillter-item-c has-error"
                                            ) : !errors.password && touched.password ? (
                                                "ui input inputDev fillter-item-c has-success"
                                            ) : "ui input inputDev fillter-item-c"}
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


                                            <div className={errors.ContactNameEn && touched.ContactNameEn ? (
                                                "ui input inputDev fillter-item-c has-error"
                                            ) : !errors.password && touched.password ? (
                                                "ui input inputDev fillter-item-c has-success"
                                            ) : "ui input inputDev fillter-item-c"}
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

                                            <div className={errors.ContactNameAr && touched.ContactNameAr ? (
                                                "ui input inputDev fillter-item-c has-error"
                                            ) : !errors.password && touched.password ? (
                                                "ui input inputDev fillter-item-c has-success"
                                            ) : "ui input inputDev fillter-item-c"}
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



                                            <div className={errors.Telephone && touched.Telephone ? (
                                                "ui input inputDev fillter-item-c has-error"
                                            ) : !errors.password && touched.password ? (
                                                "ui input inputDev fillter-item-c has-success"
                                            ) : "ui input inputDev fillter-item-c"}
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

                                            <div className={errors.Mobile && touched.Mobile ? (
                                                "ui input inputDev fillter-item-c has-error"
                                            ) : !errors.password && touched.password ? (
                                                "ui input inputDev fillter-item-c has-success"
                                            ) : "ui input inputDev fillter-item-c"}
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
        let Data = []
        Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                Data.push(obj);
            });
            this.setState({
                [currState]: [...Data],
                sectionLoading: false
            });
        }).catch(ex => {
        });
    }

}

export default withRouter(AddCompany);

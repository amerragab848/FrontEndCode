import React, { Component } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Api from "../../../api";
import Dropdown from "../../OptionsPanels/DropdownMelcous";
import { SkyLightStateless } from 'react-skylight';
import Resources from "../../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import * as AdminstrationActions from '../../../store/actions/Adminstration'

import {
    bindActionCreators
} from 'redux';
var ar = new RegExp("^[\u0621-\u064A\u0660-\u0669 ]+$");
var en = new RegExp("\[\\u0600\-\\u06ff\]\|\[\\u0750\-\\u077f\]\|\[\\ufb50\-\\ufc3f\]\|\[\\ufe70\-\\ufefc\]");
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email(Resources['emailFormat'][currentLanguage])
        .required(Resources['emailRequired'][currentLanguage]),
    contactNameEn: Yup.string().test('contactNameEn', 'Name cannot be arabic', value => {
        return !en.test(value);
    }).required(Resources['contactNameRequired'][currentLanguage]),
    contactNameAr: Yup.string().test('contactNameAr', 'Name cannot be english', value => {
        return ar.test(value)
    }).required(Resources['contactNameRequired'][currentLanguage]),
    mobile: Yup.number().required(Resources['mobileRequired'][currentLanguage]),
    telephone: Yup.number().required(Resources['telephoneRequired'][currentLanguage])
})
class AddNewContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTitle: '',
            TitleValidation: true,
            TitleData: [],
            isLoading: false,
            sectionLoading: false,
            exitsNameEn: false,
            exitsNameAr: false,
            editMode: false,
            values: {}
        }
    }


    handleBlur = (item, name) => {
        switch (name) {
            case "title":
                this.setState({
                    values: { ...this.state.values, selectedTitle: item },
                    TitleValidation: false
                })
                break;
            case "ContactNameEn":

                if (this.state.editMode && this.state.values.contactNameEn !== item) {
                    this.setState({ isLoading: true })
                    Api.get('CheckContactNameEn?contactNameEn=' + item).then(result => {
                        this.setState({ isLoading: false, exitsNameEn: result })
                    })
                }
                else if (this.state.editMode && this.state.values.contactNameEn == item) {
                    this.setState({ isLoading: false, exitsNameEn: false })
                }
                else {
                    this.setState({ isLoading: true })
                    Api.get('CheckContactNameEn?contactNameEn=' + item).then(result => {
                        this.setState({ isLoading: false, exitsNameEn: result })
                    })
                }

                break;
            case "ContactNameAr":
                if (this.state.editMode && this.state.values.contactNameAr !== item) {
                    this.setState({ isLoading: true })
                    Api.get('CheckContactNameAr?contactNameAr=' + item).then(result => {
                        this.setState({ isLoading: false, exitsNameAr: result })
                    })
                }
                else if (this.state.editMode && this.state.values.contactNameAr == item) {
                    this.setState({ isLoading: false, exitsNameEn: false })
                }
                else {
                    this.setState({ isLoading: true })
                    Api.get('CheckContactNameAr?contactNameAr=' + item).then(result => {
                        this.setState({ isLoading: false, exitsNameAr: result })
                    })
                }
                break;
            default:
                break;
        }
    }

    Save = (values) => {
        this.setState({ isLoading: true })
        let SendingObject = {
            titleId: this.state.values.selectedTitle ? this.state.values.selectedTitle.value : "",
            title: this.state.values.selectedTitleselectedTitle ? this.state.values.selectedTitle : "",
            contactNameEn: values.contactNameEn,
            contactNameAr: values.contactNameAr,
            positionEn: values.positionEn,
            positionAr: values.positionAr,
            addressEn: values.addressEn,
            addressAr: values.addressAr,
            telephone: values.telephone,
            mobile: values.mobile,
            email: values.email,
            companyId: this.props.companyID,
            id: this.props.contactID
        }
        if (this.state.editMode) {
            this.props.actions.editContact("EditCompanyContact", SendingObject);

        }
        else {

            let url = 'AddCompanyContactOnly'
            this.props.actions.addContact(url, SendingObject);
        }

    }
    componentDidMount() {
        if (this.props.contactID != undefined) {
            this.setState({ isLoading: true })
            Api.get('GetCompanyContactForEdit?id=' + this.props.contactID).then(res => {
                this.setState({
                    isLoading: false,
                    editMode: true,
                    values: {
                        selectedTitle: { label: res.title, value: res.titleId },
                        email: res.email,
                        contactNameEn: res.contactNameEn,
                        contactNameAr: res.contactNameAr,
                        mobile: res.mobile,
                        positionEn: res.positionEn !== "null" ? res.positionEn : '',
                        positionAr: res.positionAr !== "null" ? res.positionAr : '',
                        addressEn: res.addressEn !== "null" ? res.addressEn : '',
                        addressAr: res.addressAr !== "null" ? res.addressAr : '',
                        telephone: res.telephone
                    }
                })
            })
        }

    }

    _component = () => {
        return (
            <div className="dropWrapper">

                <Formik
                    initialValues={{
                        email: this.state.values.email || '',
                        contactNameEn: this.state.values.contactNameEn,
                        contactNameAr: this.state.values.contactNameAr,
                        mobile: this.state.values.mobile,
                        positionEn: this.state.values.positionEn,
                        positionAr: this.state.values.positionAr,
                        addressEn: this.state.values.addressEn,
                        addressAr: this.state.values.addressAr,
                        telephone: this.state.values.telephone
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        if (!this.state.exitsNameEn && !this.state.exitsNameAr)
                            this.Save(values)

                    }}
                >
                    {({ touched, errors, handleBlur, handleChange, values }) => (
                        <Form id="signupForm1" className="proForm customProform" noValidate="novalidate" >
                            <div className="fullWidthWrapper">
                                <h2 className="twoLineHeader">{this.state.editMode ? Resources['editContact'][currentLanguage] : Resources['addContact'][currentLanguage]}</h2>
                            </div>
                            <Dropdown title="empTitle" data={this.props.titleData} selectedValue={this.state.values.selectedTitle}
                                handleChange={(e) => this.handleBlur(e, "title")}
                                index='discipline' name="title" handleBlur={handleBlur} />
                            <div className="fillter-item-c">
                                <label className="control-label"> {Resources['email'][currentLanguage]} </label>
                                <div className={"ui input inputDev  " + (errors.email && touched.email ? (
                                    "has-error") : !errors.email && touched.email ? ("has-success") : " ")}
                                >
                                    <input autoComplete="off" type='text' className="form-control" name="email" value={values.email}
                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['email'][currentLanguage]} />
                                    {errors.email && touched.email ? (
                                        <em className="pError">{errors.email}</em>
                                    ) : null}
                                </div>
                            </div>
                            <div className="fillter-item-c">
                                <label className="control-label"> {Resources['ContactNameEn'][currentLanguage]} </label>
                                <div className={"ui input inputDev  " + (errors.contactNameEn && touched.contactNameEn || this.state.exitsNameEn ? (
                                    " has-error") : !errors.contactNameEn && touched.contactNameEn ? ("has-success") : " ")}
                                >
                                    <input autoComplete="off" type='text' className="form-control" name="contactNameEn" value={values.contactNameEn}
                                        onBlur={(e) => {
                                            this.handleBlur(e.target.value, "ContactNameEn")
                                            handleBlur(e)
                                        }}

                                        onChange={handleChange} placeholder={Resources['ContactNameEn'][currentLanguage]} />

                                    {errors.contactNameEn && touched.contactNameEn ? (
                                        <em className="pError">{errors.contactNameEn}</em>
                                    ) : null}
                                    {!errors.contactNameEn && this.state.exitsNameEn ? (
                                        <em className="pError">{"name is exist"}</em>
                                    ) : null}
                                </div>
                            </div>
                            <div className="fillter-item-c">
                                <label className="control-label"> {Resources['ContactNameAr'][currentLanguage]} </label>
                                <div className={"ui input inputDev  " + (errors.contactNameAr && touched.contactNameAr || this.state.exitsNameAr ? (
                                    " has-error") : !errors.contactNameAr && touched.contactNameAr ? (" has-success") : "")}
                                >
                                    <input autoComplete="off" type='text' className="form-control" name="contactNameAr" value={values.contactNameAr}
                                        onBlur={(e) => {
                                            handleBlur(e)
                                            this.handleBlur(e.target.value, "ContactNameAr")
                                        }} onChange={handleChange} placeholder={Resources['ContactNameAr'][currentLanguage]} />

                                    {errors.contactNameAr && touched.contactNameAr ? (
                                        <em className="pError">{errors.contactNameAr}</em>
                                    ) : null}
                                    {!errors.contactNameAr && this.state.exitsNameAr ? (
                                        <em className="pError">{"name is exist"}</em>
                                    ) : null}
                                </div>
                            </div>
                            <div className="fillter-item-c">
                                <label className="control-label"> {Resources['EnglishPosition'][currentLanguage]} </label>
                                <div className='ui input inputDev'>
                                    <input autoComplete="off" type='text' className="form-control" name="positionEn" value={values.positionEn}
                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['EnglishPosition'][currentLanguage]} />
                                </div>
                            </div>
                            <div className="fillter-item-c">
                                <label className="control-label"> {Resources['ArabicPosition'][currentLanguage]} </label>
                                <div className='ui input inputDev  '>
                                    <input autoComplete="off" type='text' className="form-control" name="positionAr" value={values.positionAr}
                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['ArabicPosition'][currentLanguage]} />
                                </div>
                            </div>
                            <div className="fillter-item-c">
                                <label className="control-label"> {Resources['EnglishAddress'][currentLanguage]} </label>
                                <div className="ui input inputDev ">
                                    <input autoComplete="off" type='text' className="form-control" name="addressEn" value={values.addressEn}
                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['EnglishAddress'][currentLanguage]} />
                                </div>
                            </div>
                            <div className="fillter-item-c">
                                <label className="control-label"> {Resources['ArabicAddress'][currentLanguage]} </label>
                                <div className="ui input inputDev " >
                                    <input autoComplete="off" type='text' className="form-control" name="addressAr" value={values.addressAr}
                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['ArabicAddress'][currentLanguage]} />
                                </div>
                            </div>
                            <div className="fillter-item-c">
                                <label className="control-label"> {Resources['Telephone'][currentLanguage]} </label>
                                <div className={"ui input inputDev  " + (errors.telephone && touched.telephone ? (
                                    "has-error") : !errors.telephone && touched.telephone ? ("has-success") : "")}
                                >
                                    <input autoComplete="off" type='text' className="form-control" name="telephone" value={values.telephone}
                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['Telephone'][currentLanguage]} />

                                    {errors.telephone && touched.telephone ? (
                                        <em className="pError">{errors.telephone}</em>
                                    ) : null}
                                </div>
                            </div>
                            <div className="fillter-item-c">
                                <label className="control-label"> {Resources['Mobile'][currentLanguage]} </label>
                                <div className={"ui input inputDev " + (errors.mobile && touched.mobile ? (
                                    " has-error") : !errors.mobile && touched.mobile ? ("has-success") : "")}
                                >
                                    <input autoComplete="off" type='text' className="form-control" name="mobile" value={values.mobile}
                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['Mobile'][currentLanguage]} />

                                    {errors.mobile && touched.mobile ? (
                                        <em className="pError">{errors.mobile}</em>
                                    ) : null}
                                </div>
                            </div>
                            <div className="fullWidthWrapper">
                                {this.state.isLoading === false ? (
                                    <button
                                        className="primaryBtn-1 btn mediumBtn"
                                        type="submit"
                                    >  {Resources['save'][currentLanguage]}
                                    </button>
                                ) :
                                    (
                                        <button className="primaryBtn-1 btn mediumBtn disabled" disabled="disabled">
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

            </div >
        )
    }

    render() {
        return (
            <div >

                <div className="largePopup" style={{ display: this.props.Adminstration.popUp ? 'block' : 'none' }}>
                    <SkyLightStateless
                        beforeOpen={() => this._executeBeforeModalOpen}
                        onOverlayClicked={() => this.props.actions.TogglePopUp()}
                        isVisible={this.props.Adminstration.popUp}
                        onCloseClicked={() => {
                            this.props.actions.TogglePopUp()
                        }}
                    >
                        {this._component()}
                    </SkyLightStateless>
                </div>
            </div>

        );
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddNewContact));

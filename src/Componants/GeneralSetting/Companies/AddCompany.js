import React, { Component } from "react";

import { Formik, Form } from 'formik';
import Api from "../../../api";
import Dropdown from "../../../Componants/OptionsPanels/DropdownMelcous";
import Dropzone from "react-dropzone";
import Resources from "../../../resources.json";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');


// //const _ = require('lodash')

class AddCompany extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            sign: {},
            signPreview: {},
            signShowRemoveBtn: false, signName: '',
        }
    }

    onDropSign(file) {
        this.setState({
            //   signIamge: config.getPublicConfiguartion().downloads + signiturePath
        });

    }
    uploadSign = () => {
        let formData = new FormData();
        formData.append("file", this.state.sign)
        this.setState({ isLodingSign: true })
        // api.postFile('UploadSignature', formData).then(res => {
        //     this.setState({
        //         signIamge: config.getPublicConfiguartion().downloads + signiturePath, isLodingSign: false,
        //         sign: {}, signName: '', signPreview: ''
        //     })
        // }).catch(ex => {
        //     alert(ex);
        // });

    }
    RemoveHandlerSign = () => {
        this.setState({
            sign: {},
            signName: "",
            signPreview: {}
        });
    };

    componentDidMount = () => {
        URL.revokeObjectURL(this.state.signPreview)
    };



    render() {
        return (
            <div className="mainContainer">
                <div className="dropWrapper">


                    <Formik
                        initialValues={{
                            titleEnCompany: '',
                            titleArCompany: '',
                            discipline: '',
                            companyRole: ''
                        }}
                        onSubmit={(values) => {

                        }}
                    >
                        {({ touched, errors, handleBlur, handleChange }) => (
                            <Form id="signupForm1" className="proForm customProform" noValidate="novalidate" >

                                <div className="fullWidthWrapper">
                                    <h2 className="twoLineHeader">{Resources['addComapny'][currentLanguage]}</h2>
                                </div>




                                <div className={errors.titleEnCompany && touched.titleEnCompany ? (
                                    "ui input inputDev fillter-item-c has-error"
                                ) : !errors.password && touched.password ? (
                                    "ui input inputDev fillter-item-c has-success"
                                ) : "ui input inputDev fillter-item-c"}
                                >
                                    <label className="control-label"> {Resources['titleEnCompany'][currentLanguage]} </label>
                                    <input autoComplete="off" type='text' className="form-control" name="titleEnCompany"
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
                                    <input autoComplete="off" type='text' className="form-control" name="titleArCompany"
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


                                <div className={errors.discipline && touched.discipline ? (
                                    "ui input inputDev fillter-item-c has-error"
                                ) : !errors.password && touched.password ? (
                                    "ui input inputDev fillter-item-c has-success"
                                ) : "ui input inputDev fillter-item-c"}
                                >
                                    <label className="control-label"> {Resources['discipline'][currentLanguage]} </label>
                                    <input autoComplete="off" type='text' className="form-control" name="discipline"
                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['discipline'][currentLanguage]} />
                                    {errors.discipline && touched.discipline ? (
                                        <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                    ) : !errors.discipline && touched.discipline ? (
                                        <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                    ) : null}
                                    {errors.discipline && touched.discipline ? (
                                        <em className="pError">{errors.discipline}</em>
                                    ) : null}
                                </div>

                                <div className={errors.companyRole && touched.companyRole ? (
                                    "ui input inputDev fillter-item-c has-error"
                                ) : !errors.password && touched.password ? (
                                    "ui input inputDev fillter-item-c has-success"
                                ) : "ui input inputDev fillter-item-c"}
                                >
                                    <label className="control-label"> {Resources['companyRole'][currentLanguage]} </label>
                                    <input autoComplete="off" type='text' className="form-control" name="companyRole"
                                        onBlur={handleBlur} onChange={handleChange} placeholder={Resources['companyRole'][currentLanguage]} />
                                    {errors.companyRole && touched.companyRole ? (
                                        <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                    ) : !errors.companyRole && touched.companyRole ? (
                                        <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                    ) : null}
                                    {errors.companyRole && touched.companyRole ? (
                                        <em className="pError">{errors.companyRole}</em>
                                    ) : null}
                                </div>

                                <div className='form-control fullWidthWrapper'>
                                    <section className="singleUploadForm">
                                        {this.state.signShowRemoveBtn ?
                                            <aside className='thumbsContainer'>
                                                <div className="uploadedName ">
                                                    <p>{this.state.signName}</p>
                                                </div>
                                                {this.state.signName ?
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

                                                    {this.state.signName ?
                                                        null : <p>{Resources['dragFileHere'][currentLanguage]}</p>}
                                                    <button className="primaryBtn-1 btn smallBtn">{Resources['chooseFile'][currentLanguage]}</button>
                                                </div>
                                            )}
                                        </Dropzone>
                                        {this.state.signName ?
                                            <div className="removeBtn">
                                                <button className="primaryBtn-2 btn smallBtn" onClick={this.RemoveHandlerSign}>{Resources['clear'][currentLanguage]}</button>
                                            </div> : null}
                                    </section>
                                </div>


                            </Form>
                        )}
                    </Formik>


                </div >
            </div>
        );
    }
}

export default AddCompany;

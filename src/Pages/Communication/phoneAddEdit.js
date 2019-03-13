import React, { Component, Fragment } from 'react';
import DropdownMelcous from '../../Componants/OptionsPanels/DropdownMelcous';
// import Api from '../../../api';
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import moment from 'moment'
import Resources from '../../resources.json';
import _ from "lodash";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { withRouter } from "react-router-dom";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import DataService from '../../Dataservice'
import CryptoJS from 'crypto-js';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    callTime: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    toContactName: Yup.string().required(Resources['toContactRequired'][currentLanguage]),
    toCompany: Yup.string().required(Resources['toCompanyRequired'][currentLanguage])
});

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;

class AddAccount extends Component {
    constructor(props) {
        super(props)
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
            CompanyData: [],
            fromContactNameData: [],
            toContactNameData: [],
            isLoading: true,
            radioBtn: true,
            docDate: moment().format("DD-MM-YYYY"),
            arrange: 0,
            reference: '',
            fromCompany: '',
            toCompany: '',
            enteredBy: '',
            descriptionCall: '',
            numberCall: ''
        }
    }
    handleChange = (key, value) => {
        switch (key) {
            case 'fromCompany':
                this.setState({ isLoading: true })
                DataService.GetDataList('GetContactsByCompanyId?companyId=' + value.value, 'contactName', 'id').then(res => {
                    this.setState({ fromContactNameData: res, isLoading: false, fromCompany: value })
                })
                break;
            case 'toCompany':
                this.setState({ isLoading: true })
                DataService.GetDataList('GetContactsByCompanyId?companyId=' + value.value, 'contactName', 'id').then(res => {
                    this.setState({ toContactNameData: res, isLoading: false })
                })
                break;
            default:
                this.setState({ [key]: value })


        }

    }
    componentDidMount() {
        console.log(this.state.params)
        DataService.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + projectId, 'companyName', 'companyId').then(res => {
            this.setState({ CompanyData: res })
        })
        DataService.GetDataList('GetContactsByCompanyId?companyId=1', 'contactName', 'id').then(res => {
            this.setState({ contactNameData: res, isLoading: false })
        })

    }
    save = (values) => {
        this.setState({ isLoading: true })
        console.log('values', values)
        console.log("state", this.state)
    }
    render() {

        return (
            <div className="mainContainer">
                <div className="documents-stepper cutome__inputs noTabs__document">
                    <div className="submittalHead">
                        <h2 className="zero">Add Account</h2>
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
                        <div className="step-content">
                            <div className="subiTabsContent">

                                <div className="document-fields">

                                    {this.state.isLoading ? <LoadingSection /> : null}

                                    <Formik

                                        initialValues={{
                                            subject: '',
                                            toContactName: '',
                                            toCompany: '',
                                            callTime: ''
                                        }}

                                        validationSchema={validationSchema}

                                        onSubmit={(values) => {
                                            this.save(values)

                                        }} >

                                        {({ errors, touched, handleBlur, handleChange, handleSubmit, values, setFieldTouched, setFieldValue }) => (
                                            <Form id="signupForm1" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                                                <div className="proForm first-proform fullWidth_form">
                                                    <div className="linebylineInput valid-input">

                                                        <div className={"ui input inputDev fillter-item-c " + (errors.subject && touched.subject ? (
                                                            "has-error") : !errors.subject && touched.subject ? ("has-success") : "")}  >
                                                            <label className="control-label">{Resources['subject'][currentLanguage]} </label>
                                                            <div className={'ui input inputDev '}>
                                                                <input name='subject' value={values.subject}
                                                                    className="form-control" id="subject" placeholder={Resources['subject'][currentLanguage]} autoComplete='off'
                                                                    onBlur={handleBlur} onChange={handleChange} />
                                                                {errors.subject && touched.subject ? (
                                                                    <React.Fragment>
                                                                        <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                                        <em className="pError">{errors.subject}</em>
                                                                    </React.Fragment>
                                                                ) : !errors.subject && touched.subject ? (
                                                                    <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                                ) : null}

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput">
                                                        <label data-toggle="tooltip" title={Resources['status'][currentLanguage]} className="control-label"> {Resources['status'][currentLanguage]} </label>
                                                        <div className="ui checkbox radio radioBoxBlue">
                                                            <input type="radio" defaultChecked name="status" value="true" onChange={e => this.handleChange('radioBtn', "true")} />
                                                            <label>{Resources['oppened'][currentLanguage]}</label>
                                                        </div>
                                                        <div className="ui checkbox radio radioBoxBlue checked">
                                                            <input type="radio" name="status" value="false" onChange={e => this.handleChange('radioBtn', "false")} />
                                                            <label> {Resources['closed'][currentLanguage]}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="linebylineInput valid-input alternativeDate">
                                                    <DatePicker title='docDate'
                                                        startDate={this.state.docDate}
                                                        handleChange={e => this.handleChange('docDate', e)} />
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['arrange'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev '}>
                                                        <input name='arrange' className="form-control" id="arrange" placeholder={Resources['arrange'][currentLanguage]} autoComplete='off'
                                                            onChange={e => this.handleChange('arrange', e.target.value)} />
                                                    </div>
                                                </div>


                                                <div className="linebylineInput valid-input fullRowInput">
                                                    <label className="control-label">{Resources['reference'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev '}>
                                                        <input name='reference' className="form-control" id="reference" placeholder={Resources['reference'][currentLanguage]} autoComplete='off'
                                                            onChange={e => this.handleChange('reference', e.target.value)} />
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <DropdownMelcous title='fromCompany'
                                                        data={this.state.CompanyData}
                                                        handleChange={e => this.handleChange('fromCompany', e)}
                                                        placeholder='fromCompany' />
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <DropdownMelcous title='ContactName'
                                                        data={this.state.fromContactNameData}
                                                        handleChange={e => this.handleChange('fromContactName', e)}
                                                        placeholder='ContactName' />
                                                </div>



                                                <div className="linebylineInput valid-input">
                                                    <DropdownMelcous title='toCompany'
                                                        name='toCompany'
                                                        selectedValue={values.toCompany}
                                                        data={this.state.CompanyData}
                                                        onChange={setFieldValue}
                                                        handleChange={(e) => this.handleChange("toCompany", e)}
                                                        placeholder='toCompany'
                                                        onBlur={setFieldTouched}
                                                        error={errors.toCompany}
                                                        touched={touched.toCompany}
                                                        value={values.toCompany} />
                                                </div>
                                                <div className="linebylineInput valid-input">
                                                    <DropdownMelcous title='ContactName'
                                                        name='toContactName'
                                                        selectedValue={values.ToContactName}
                                                        data={this.state.toContactNameData}
                                                        onChange={setFieldValue}
                                                        handleChange={(e) => this.handleChange("toContactName", e)}
                                                        placeholder='ContactName'
                                                        onBlur={setFieldTouched}
                                                        error={errors.toContactName}
                                                        touched={touched.toContactName}
                                                        value={values.toContactName} />
                                                </div>

                                                <div className="linebylineInput valid-input linebylineInput__name">
                                                    <label className="control-label">{Resources['enteredBy'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev '}>
                                                        <input name='enteredBy' className="form-control" id="reference" placeholder={Resources['enteredBy'][currentLanguage]} autoComplete='off'
                                                            onChange={e => this.handleChange('enteredBy', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['descriptionCall'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev '}>
                                                        <input name='descriptionCall' className="form-control" id="reference" placeholder={Resources['descriptionCall'][currentLanguage]} autoComplete='off'
                                                            onChange={e => this.handleChange('descriptionCall', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className={"linebylineInput valid-input " + (errors.callTime && touched.callTime ? (
                                                    "has-error") : !errors.callTime && touched.callTime ? ("has-success") : "")}  >
                                                    <label className="control-label">{Resources['callTime'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev '}>
                                                        <input name='callTime' value={values.callTime}
                                                            className="form-control" id="callTime" placeholder={Resources['callTime'][currentLanguage]} autoComplete='off'
                                                            onBlur={handleBlur} onChange={handleChange} />
                                                        {errors.callTime && touched.callTime ? (
                                                            <React.Fragment>
                                                                <span className="glyphicon glyphicon-remove form-control-feedback spanError"></span>
                                                                <em className="pError">{errors.callTime}</em>
                                                            </React.Fragment>
                                                        ) : !errors.callTime && touched.callTime ? (
                                                            <span className="glyphicon form-control-feedback glyphicon-ok"></span>
                                                        ) : null}

                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['numberCall'][currentLanguage]} </label>
                                                    <div className={'ui input inputDev '}>
                                                        <input name='numberCall' className="form-control" id="reference" placeholder={Resources['numberCall'][currentLanguage]} autoComplete='off'
                                                            onChange={e => this.handleChange('numberCall', e.target.value)} />
                                                    </div>
                                                </div>
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

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

}
export default withRouter(AddAccount)
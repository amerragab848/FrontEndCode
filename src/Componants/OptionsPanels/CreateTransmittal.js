import React, { Component } from 'react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import Resources from '../../resources.json';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
//const _ = require('lodash')
const validationSchema_s = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    toCompany: Yup.string().required(Resources['toCompanyRequired'][currentLanguage]),
    ToContact: Yup.string().required(Resources['selectContact'][currentLanguage]),
    priority: Yup.string().required(Resources['priorityRequired'][currentLanguage]),
})
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class CreateTransmittal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sendingData: {
                projectId: this.props.projectId,
                docId: this.props.docId,
                docTypeId: this.props.docTypeId,
                arrange: "",
                priorityId: "",
                toCompanyId: "",
                Subject: "",
                toContactId: "",
                status: true,
                submittFor: ""
            },
            PriorityData: [],
            ToCompany: [],
            SubmittedForData: [],
            AttentionData: [],
            selectedOption: 'true',
        }
        this.radioChange = this.radioChange.bind(this);
    }
    clickHandler = (e) => {
        let inboxDto = { ...this.state.sendingData };
        console.log(inboxDto);
        Api.post("CreateTransmittal", inboxDto)
    }
    radioChange(e) {

        this.setState({
            selectedOption: e.currentTarget.value,
            sendingData: { ...this.state.sendingData, status: e.currentTarget.value }
        });
    }

    componentDidMount = () => {
        let url = "GetProjectProjectsCompaniesForList?projectId=" + this.state.sendingData.projectId;
        this.GetData(url, 'companyName', 'companyId', 'ToCompany');
        this.GetData("GetAccountsDefaultList?listType=priority&pageNumber=0&pageSize=10000", 'title', 'id', 'PriorityData');
        this.GetData("GetAccountsDefaultList?listType=transmittalsubmittedfor&pageNumber=0&pageSize=10000", 'title', 'id', 'SubmittedForData')

    }

    To_company_handleChange = (selectedOption) => {
        let url = "GetContactsByCompanyId?companyId=" + selectedOption.value;
        this.setState({
            sendingData: { ...this.state.sendingData, toCompanyId: selectedOption.value },
        });
        this.GetData(url, "contactName", "id", "AttentionData");
    }

    Priority_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, priorityId: item.value },
        })
    }

    inputChangeHandler = (e) => {
        this.setState({ sendingData: { ...this.state.sendingData, Subject: e.target.value } });
    }

    SubmittedFor_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, submittFor: item.value }
        })
    }

    Attention_handleChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, toContactId: item.value }
        })
    }

    render() {
        return (
            <div className="dropWrapper">
                <Formik key="ss"
                    validationSchema={validationSchema_s}
                    initialValues={{
                        toCompany:'',
                        ToContact:'',
                        priority:''
                    }}
                    onSubmit={(values) => {
                        alert()
                        //this.clickHandler()
                    }}
                >
                    {({ errors, touched, setFieldValue, setFieldTouched, handleBlur, handleChange }) => (
                        <Form id="signupForm1_s" className="proForm customProform" noValidate="novalidate" >
                            <div className="proForm first-proform letterFullWidth">
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                    <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                        <input name='subject' className="form-control fsadfsadsa" id="subject"
                                            placeholder={Resources.subject[currentLanguage]}
                                            autoComplete='off'
                                            defaultValue={'subject'}
                                            onBlur={(e) => {
                                                handleBlur(e)
                                                handleChange(e)
                                            }}
                                            onChange={(e) => this.inputChangeHandler} />
                                        {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input ">
                                    <label className="control-label">{Resources.status[currentLanguage]}</label>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="letter-status" checked value="true" onChange={e => this.radioChange} />
                                        <label>{Resources.oppened[currentLanguage]}</label>
                                    </div>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="letter-status" value="false" onChange={e => this.radioChange} />
                                        <label>{Resources.closed[currentLanguage]}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="toCompany"
                                    data={this.state.ToCompany}
                                    //  selectedValue={this.state.selectedDiscpline}
                                    handleChange={this.To_company_handleChange}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                    error={errors.toCompany}
                                    touched={touched.toCompany}
                                    name='toCompany'
                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="ToContact"
                                    data={this.state.AttentionData}
                                    //  selectedValue={this.state.selectedDiscpline}
                                    handleChange={this.Attention_handleChange}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                    error={errors.ToContact}
                                    touched={touched.ToContact}
                                    name='ToContact'
                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="priority"
                                    data={this.state.PriorityData}
                                    //  selectedValue={this.state.selectedDiscpline}
                                    handleChange={this.Priority_handelChange}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                    error={errors.priority}
                                    touched={touched.priority}
                                    name='priority'
                                />
                            </div>
                            <div className="linebylineInput valid-input">
                                <Dropdown
                                    title="submittedFor"
                                    data={this.state.PriorityData}
                                    //  selectedValue={this.state.selectedDiscpline}
                                    handleChange={this.SubmittedFor_handelChange}
                                    name='submittedFor'
                                />
                            </div>
                            <div className="fullWidthWrapper">
                                <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
                            </div>
                        </Form>)}
                </Formik>
            </div>
        )
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
                [currState]: [...Data]
            });
        }).catch(ex => {
        });

    }

}
export default CreateTransmittal;
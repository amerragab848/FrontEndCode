import React, { Component } from 'react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import Resources from '../../resources.json';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { toast } from "react-toastify";
import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';

import * as communicationActions from '../../store/actions/communication';

const validationSchema_createTransmittal = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    toCompany: Yup.string().required(Resources['toCompanyRequired'][currentLanguage]),
    ToContact: Yup.string().required(Resources['selectContact'][currentLanguage]),
    priority: Yup.string().required(Resources['priorityRequired'][currentLanguage])
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
                priorityId: null,
                toCompanyId: null,
                subject: this.props.document.subject,
                toContactId: null,
                status: true,
                submittFor: null
            },
            PriorityData: [],
            ToCompany: [],
            SubmittedForData: [],
            AttentionData: [],
            selectedOption: 'true',
            submitLoading: false
        }
        this.radioChange = this.radioChange.bind(this);
    }

    clickHandler = (e) => {
        this.setState({ submitLoading: true })

        let inboxDto = { ...this.state.sendingData };
        Api.post("CreateTransmittal", inboxDto).then(res => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({ submitLoading: false })
            this.props.actions.showOptionPanel(false);
        }).catch(() => {
            this.setState({ submitLoading: false })
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.props.actions.showOptionPanel(false);
        })
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
        this.setState({ sendingData: { ...this.state.sendingData, subject: e.target.value } });
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
                <Formik key="create-trans-panel-form"
                    validationSchema={validationSchema_createTransmittal}
                    initialValues={{ ...this.state.sendingData }}
                    onSubmit={(values) => {
                        this.clickHandler()
                    }}                >
                    {({ errors, touched, setFieldValue, setFieldTouched, handleBlur, handleChange }) => (
                        <Form id="create-trans-panel-form" className="proForm customProform" noValidate="novalidate"  >
                            <div className="proForm first-proform letterFullWidth">
                                <div className="fillter-status fillter-item-c">
                                    <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                    <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                        <input name='subject'
                                            className="form-control fsadfsadsa"
                                            id="subject"
                                            placeholder={Resources.subject[currentLanguage]}
                                            autoComplete='off'
                                            defaultValue={this.state.sendingData.subject}
                                            onBlur={(e) => {
                                                handleBlur(e)
                                                handleChange(e)
                                            }}
                                            onChange={(e) => this.inputChangeHandler(e)} />
                                        {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                    </div>
                                </div>
                                <div className="fillter-status fillter-item-c">
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
                            <Dropdown
                                title="toCompany"
                                data={this.state.ToCompany}
                                handleChange={this.To_company_handleChange}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.toCompany}
                                touched={touched.toCompany}

                                name='toCompany'
                            />
                            <Dropdown
                                title="ToContact"
                                data={this.state.AttentionData}
                                handleChange={this.Attention_handleChange}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.ToContact}
                                touched={touched.ToContact}
                                name='ToContact'
                            />
                            <Dropdown
                                title="priority"
                                data={this.state.PriorityData}
                                handleChange={this.Priority_handelChange}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.priority}
                                touched={touched.priority}
                                name='priority'
                            />
                            <Dropdown
                                title="submittedFor"
                                data={this.state.PriorityData}
                                handleChange={this.SubmittedFor_handelChange}
                                name='submittedFor'
                            />

                            <div className="fullWidthWrapper">
                                {!this.state.submitLoading ?
                                    <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>
                                    :
                                    <button className="primaryBtn-1  btn mediumBtn disabled">
                                        <div className="spinner">
                                            <div className="bounce1" />
                                            <div className="bounce2" />
                                            <div className="bounce3" />
                                        </div>
                                    </button>
                                }
                            </div>
                        </Form>
                    )}
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

function mapStateToProps(state) {

    return {
        document: state.communication.document,
        showModal: state.communication.showModal
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
)(CreateTransmittal);
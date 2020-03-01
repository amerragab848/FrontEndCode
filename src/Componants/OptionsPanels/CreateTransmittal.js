import React, { Component } from 'react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import Resources from '../../resources.json';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as communicationActions from '../../store/actions/communication';

const validationSchema_createTransmittal = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    toCompanyId: Yup.string().required(Resources['toCompanyRequired'][currentLanguage]),
    fromCompanyId: Yup.string().required(Resources['fromCompanyRequired'][currentLanguage]),
    toContactId: Yup.string().required(Resources['selectContact'][currentLanguage]),
    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]),
    priorityId: Yup.string().required(Resources['priorityRequired'][currentLanguage]),
    sendingMethodId: Yup.string().required(Resources['sendingMethodRequired'][currentLanguage]),
    refDoc: Yup.string().max(450, Resources['maxLength'][currentLanguage]),
})

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class CreateTransmittal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            transmittal: {
                projectId: this.props.projectId,
                docId: this.props.docId,
                docType: this.props.docTypeId,
                arrange: "",
                priorityId: '',
                toCompanyId: '',
                fromCompanyId: '',
                subject: this.props.document.subject,
                toContactId: '',
                fromContactId: '',
                sendingMethodId: '',
                status: true,
                submittFor: '',
                refDoc: null
            },
            PriorityData: [],
            ToCompany: [],
            SubmittedForData: [],
            sendingmethods: [],
            AttentionData: [],
            fromContact: [],
            fromCompany: [],
            selectedOption: 'true',
            submitLoading: false
        }
        this.radioChange = this.radioChange.bind(this);
    }

    clickHandler = (e) => {
        this.setState({ submitLoading: true })

        let inboxDto = { ...this.state.transmittal };
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
            transmittal: { ...this.state.transmittal, status: e.currentTarget.value }
        });
    }

    componentDidMount = () => {
        let url = "GetProjectProjectsCompaniesForList?projectId=" + this.state.transmittal.projectId;
        this.GetData(url, 'companyName', 'companyId', 'ToCompany');
        this.GetData(url, 'companyName', 'companyId', 'fromCompany');
        this.GetData("GetAccountsDefaultList?listType=priority&pageNumber=0&pageSize=10000", 'title', 'id', 'PriorityData');
        this.GetData("GetAccountsDefaultList?listType=transmittalsubmittedfor&pageNumber=0&pageSize=10000", 'title', 'id', 'SubmittedForData')
        this.GetData("GetAccountsDefaultList?listType=sendingmethods&pageNumber=0&pageSize=10000", 'title', 'id', 'sendingmethods')
    }

    To_company_handleChange = (selectedOption) => {
        let url = "GetContactsByCompanyId?companyId=" + selectedOption.value;
        this.setState({
            transmittal: { ...this.state.transmittal, toCompanyId: selectedOption.value },
        });
        this.GetData(url, "contactName", "id", "AttentionData");
    }

    from_company_handleChange = (selectedOption) => {
        let url = "GetContactsByCompanyId?companyId=" + selectedOption.value;
        this.setState({
            transmittal: { ...this.state.transmittal, fromCompanyId: selectedOption.value },
        });
        this.GetData(url, "contactName", "id", "fromContact");
    }

    Priority_handelChange = (item) => {
        this.setState({
            transmittal: { ...this.state.transmittal, priorityId: item.value },
        })
    }

    inputChangeHandler = (e, name) => {
        this.setState({ transmittal: { ...this.state.transmittal, [name]: e.target.value } });
    }


    //dropsubmittalfor
    SubmittedFor_handelChange = (item) => {
        this.setState({
            transmittal: { ...this.state.transmittal, submittFor: item.value }
        })
    }

    Attention_handleChange = (item) => {
        this.setState({
            transmittal: { ...this.state.transmittal, toContactId: item.value }
        })
    }

    fromContact_handleChange = (item) => {
        this.setState({
            transmittal: { ...this.state.transmittal, fromContactId: item.value }
        })
    }

    sendingMethodId_handleChange = (item) => {
        this.setState({
            transmittal: { ...this.state.transmittal, sendingMethodId: item.value }
        })
    }

    render() {
        return (
            <div className="dropWrapper">
                <Formik key="create-trans-panel-form"
                    validationSchema={validationSchema_createTransmittal}
                    initialValues={{ ...this.state.transmittal }}
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
                                            defaultValue={this.state.transmittal.subject}
                                            onBlur={(e) => {
                                                handleBlur(e)
                                                handleChange(e)
                                            }}
                                            onChange={(e) => this.inputChangeHandler(e, 'subject')} />
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
                                error={errors.toCompanyId}
                                touched={touched.toCompanyId}
                                name='toCompanyId'
                            />
                            <Dropdown
                                title="ToContact"
                                data={this.state.AttentionData}
                                handleChange={this.Attention_handleChange}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.toContactId}
                                touched={touched.toContactId}
                                name='toContactId'
                            />
                            <Dropdown
                                title="fromCompany"
                                data={this.state.fromCompany}
                                handleChange={this.from_company_handleChange}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.fromCompanyId}
                                touched={touched.fromCompanyId}
                                name='fromCompanyId'
                            />
                            <Dropdown
                                title="fromContact"
                                data={this.state.fromContact}
                                handleChange={this.fromContact_handleChange}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.fromContactId}
                                touched={touched.fromContactId}
                                name='fromContactId'
                            />
                            <Dropdown
                                title="priority"
                                data={this.state.PriorityData}
                                handleChange={this.Priority_handelChange}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.priorityId}
                                touched={touched.priorityId}
                                name='priorityId'
                            />
                            <Dropdown
                                title="submittedFor"
                                data={this.state.SubmittedForData}
                                handleChange={this.SubmittedFor_handelChange}
                                name='submittedFor'
                            />

                            <Dropdown
                                title="sendingMethod"
                                data={this.state.sendingmethods}
                                handleChange={this.sendingMethodId_handleChange}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.sendingMethodId}
                                touched={touched.sendingMethodId}
                                name='sendingMethodId'
                            />
                            <div className="fillter-status fillter-item-c">
                                <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                <div className={"inputDev ui input" + (errors.refDoc && touched.refDoc ? (" has-error") : !errors.refDoc && touched.refDoc ? (" has-success") : " ")} >


                                    <input name='refDoc'
                                        className="form-control fsadfsadsa"
                                        id="refDoc"
                                        placeholder={Resources.refDoc[currentLanguage]}
                                        autoComplete='off'
                                        defaultValue={this.state.transmittal.refDoc}
                                        onBlur={(e) => {
                                            handleBlur(e)
                                            handleChange(e)
                                        }}
                                        onChange={(e) => this.inputChangeHandler(e, 'refDoc')} />
                                    {touched.refDoc ? (<em className="pError">{errors.refDoc}</em>) : null}
                                </div>
                            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(CreateTransmittal);
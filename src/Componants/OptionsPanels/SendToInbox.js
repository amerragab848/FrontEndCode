import React, { Component } from 'react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import InputMelcous from './InputMelcous'
import Resources from '../../resources.json';
import { Formik, Form } from 'formik';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const _ = require('lodash')

class SendToInbox extends Component {
    constructor(props) {
        super(props)
        this.state = {

            sendingData: {
                projectId: this.props.projectId,
                docId: this.props.docId,
                arrange: "",
                docType: this.props.docTypeId,
                priorityId: "",
                toCompanyId: "",
                toContactId: "",
                ccCompanyId: "",
                cc: [],
                Comment: ""
            },

            PriorityData: [],
            To_Cc_CompanyData: [],
            AttentionData: [],
            Cc_ContactData: [],
            Cc_Selected: [],

            validPriority: true,
            validToCompany: true,
            validAttention: true,
            submitLoading: false 
        }
    }
    Priority_handelChange = (item) => {
        this.setState({
            selectedValue: item,
            sendingData: { ...this.state.sendingData, priorityId: item.value },
            validPriority: false  });
    }
    Attention_handleChange = (item) => {
        this.setState({
            selectedConatctId: item,
            sendingData: { ...this.state.sendingData, toContactId: item.value },
            validAttention: false })
    }
    To_company_handleChange = (selectedOption) => {
        let url = "GetContactsByCompanyIdForOnlyUsers?companyId=" + selectedOption.value;
        this.GetData(url, "contactName", "id", "AttentionData", 3);
        this.setState({
            selectedCompanyId: selectedOption,
            sendingData: { ...this.state.sendingData, toCompanyId: selectedOption.value },
            validToCompany: false});
    }
    Cc_company_handleChange = (selectedOption) => {
        let url = "GetContactsByCompanyId?companyId=" + selectedOption.value;
        this.setState({
            selectedCCCompanyId: selectedOption,
            sendingData: { ...this.state.sendingData, ccCompanyId: selectedOption.value } });
        this.GetData(url, "contactName", "id", "Cc_ContactData");
    }
    Cc_Contact_handleChange = (selectedOption) => {
        this.setState({
            sendingData: {
                ...this.state.sendingData, cc: _.map(selectedOption, function (item) { return item.value })
            }
        })
    }
    componentDidMount = () => {
        let url = "GetProjectProjectsCompaniesForList?projectId=" + this.state.sendingData.projectId;
        this.GetData(url, 'companyName', 'companyId', 'To_Cc_CompanyData', 2);
        this.GetData("GetaccountsDefaultListForList?listType=priority", 'title', 'id', 'PriorityData', 1);
    }

    inputChangeHandler = (e) => {
        this.setState({ sendingData: { ...this.state.sendingData, Comment: e.target.value } });
    }
    render() {
        return (
            <div className="dropWrapper">
                <Formik
                    initialValues={{
                        priority: '',
                        toCompany: '',
                        Attention: ''

                    }}

                    onSubmit={values => {
                        if (!this.state.validAttention && !this.state.validPriority && !this.state.validToCompany) {
                            this.setState({submitLoading:true})
                            Api.post("SendByInbox", this.state.sendingData).then(
                                this.setState({submitLoading:false})
                            )
                        }
                    }}

                >
                    {({ errors, touched, handleBlur, handleChange }) => (
                        <Form id="signupForm1" className="proForm customProform" noValidate="novalidate">
                            <div className={this.state.validPriority && touched.priority ? (
                                "ui input inputDev fillter-item-c has-error"
                            ) : !this.state.validPriority && touched.priority ? (
                                "ui input inputDev fillter-item-c has-success"
                            ) : "ui input inputDev fillter-item-c"}
                            >
                                <Dropdown title="priority" data={this.state.PriorityData} handleChange={this.Priority_handelChange}
                                    index='Priorityddinbox' name="priority" />
                                {this.state.validPriority && touched.priority ? (
                                    <em className="pError">{this.state.validPriority}</em>
                                ) : null}
                            </div>
                            <InputMelcous title="comments" placeholderText="discussionPanelCommentPlaceholder" inputChangeHandler={this.inputChangeHandler} fullwidth="false" />
                            <div className={this.state.validToCompany&& touched.toCompany ? (
                                "ui input inputDev fillter-item-c has-error"
                            ) : !this.state.validToCompany&& touched.toCompany ? (
                                "ui input inputDev fillter-item-c has-success"
                            ) : "ui input inputDev fillter-item-c"}
                            >
                                <Dropdown title="toCompanyName" data={this.state.To_Cc_CompanyData} name="toCompanydd" handleChange={this.To_company_handleChange}
                                    index='toCompanyddinbox' name="toCompany" />
                                {this.state.validToCompany&& touched.toCompany ? (
                                    <em className="pError">{this.state.validPriority}</em>
                                ) : null}
                            </div>
                            <div className={this.state.validAttention && touched.Attention? (
                                "ui input inputDev fillter-item-c has-error"
                            ) : !this.state.validAttention && touched.Attention? (
                                "ui input inputDev fillter-item-c has-success"
                            ) : "ui input inputDev fillter-item-c"}
                            >
                                <Dropdown title="ToContact" data={this.state.AttentionData}  handleChange={this.Attention_handleChange}
                                    index='Attentionddinbox' name="Attention" />
                                {this.state.validAttention && touched.Attention? (
                                    <em className="pError">{this.state.validPriority}</em>
                                ) : null}
                            </div>
                            <Dropdown title="ccCompany" data={this.state.To_Cc_CompanyData} name="ccCompanydd" handleChange={this.Cc_company_handleChange}
                                index='ccCompanyddinbox' />
                            <div className="filterWrapper">
                                <Dropdown title="ccContact" data={this.state.Cc_ContactData} name="ccContactsdd" handleChange={this.Cc_Contact_handleChange}
                                    index='ccContactsddinbox' isMulti="true" />

                            </div>
                            { ! this.state.submitLoading ?
                            <div className="fullWidthWrapper">
                                <button className="primaryBtn-1 btn" type="submit">{Resources['send'][currentLanguage]}</button>
                            </div>
                              :   (
                                <span className="primaryBtn-1 btn largeBtn disabled">
                                    <div className="spinner">
                                        <div className="bounce1" />
                                        <div className="bounce2" />
                                        <div className="bounce3" />
                                    </div>
                                </span>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>

        );
    }

    GetData = (url, label, value, currState, type) => {
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

            switch (type) {
                case 1:
                    this.setState({
                        selectedValue: Data[0]
                    });
                    break;

                case 2:
                    this.setState({
                        selectedCompanyId: Data[0]
                    });
                    break;

                case 3:
                    this.setState({
                        selectedConatctId: Data[0]
                    });
                    break;
                default:
                    break;
            }

        }).catch(ex => {
        });
    }


}

export default SendToInbox;
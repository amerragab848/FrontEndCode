import React, { Component } from 'react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import Resources from '../../resources.json';
import { Formik, Form } from 'formik';
import { connect } from 'react-redux';
import * as communicationActions from '../../store/actions/communication';
import { bindActionCreators } from 'redux'
import dataservice from "../../Dataservice";
import * as Yup from 'yup';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const validationSchema = Yup.object().shape({
    priorityId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
    toCompanyId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
    toContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
})

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
            Cc_Selected: []
        }
    }

    componentDidMount = () => {
        let url = "GetProjectProjectsCompaniesForList?projectId=" + this.state.sendingData.projectId;
        this.GetData(url, 'companyName', 'companyId', 'To_Cc_CompanyData', 2);
        this.GetData("GetaccountsDefaultListForList?listType=priority", 'title', 'id', 'PriorityData', 1);
    }

    inputChangeHandler = (e) => {
        this.setState({ sendingData: { ...this.state.sendingData, Comment: e.target.value } });
    }
    sendInbox = (values) => {
        let obj = this.state.sendingData
        obj.Comment = values.Comment
        let cc = []
        let ccContactsdd = this.state.ccContactsdd ? this.state.ccContactsdd : [];
        ccContactsdd.map(i => {
            let ia = i.value
            cc.push(ia)
        });
        obj.cc = cc;
        this.setState({ submitLoading: true })
        values.Comment = '';
        values.priorityId = '';
        values.toCompanyId = '';
        values.toContactId = '';
        values.ccCompanydd = '';
        values.ccContactsdd = '';
        this.props.actions.SendByEmail_Inbox("SendByInbox", obj);
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.showModal == false) {
            return { submitLoading: false, priorityId: "", toContactId: "", toCompanyId: "", ccCompanydd: "", ccContactsdd: [] };
        }
        return null
    }

    handleChange = (state, event, isSubscribe, targetState, calledApi) => {
        if (isSubscribe == true) {
            dataservice.GetDataList(calledApi, "contactName", "id").then(result => {
                this.setState({ [targetState]: result });
            });
        }
        let sendingData = this.state.sendingData;
        sendingData[state] = event.value;
        this.setState({ [state]: event, sendingData });
    }
    handleChangeCC = (values) => {
        this.setState({ ccContactsdd: values })
    }

    render() {
        return (
            <div className="dropWrapper">
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                        priorityId: null,
                        toCompanyId: null,
                        toContactId: null,
                        Comment: '',
                        ccCompanydd: '',
                        ccContactsdd: []
                    }}
                    onSubmit={values => {
                        this.sendInbox(values);
                    }}
                >
                    {({ errors, touched, setFieldValue, setFieldTouched, values, handleBlur, handleChange, }) => (
                        <Form id="SendToInboxForm" className="proForm customProform" noValidate="novalidate">

                            <Dropdown title="priority"
                                data={this.state.PriorityData}
                                handleChange={event => this.handleChange('priorityId', event, false, null, null)}
                                index='priorityId'
                                name="priorityId"
                                id="priorityId"
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.priorityId}
                                touched={touched.priorityId}
                                selectedValue={this.state.priorityId} /> 

                            <div className={this.props.fullwidth == "true" ? "letterFullWidth fullInputWidth linebylineInput" : "fillter-status fillter-item-c"}>
                                <label className="control-label">
                                    {Resources["comments"][currentLanguage]}
                                </label>
                                <div className="inputDev ui input">
                                    <input type={this.props.type === undefined ? "text" : this.props.type} className="form-control" id="lastname1" value={values.Comment} onChange={handleChange} />
                                </div>
                            </div>

                                <Dropdown
                                    title="toCompanyName"
                                    data={this.state.To_Cc_CompanyData}
                                    index='toCompanyId'
                                    name="toCompanyId"
                                    id="toCompanyId"
                                    onChange={setFieldValue}
                                    handleChange={event => this.handleChange('toCompanyId', event, true, "AttentionData", "GetContactsByCompanyIdForOnlyUsers?companyId=" + event.value)}
                                    onBlur={setFieldTouched}
                                    error={errors.toCompanyId}
                                    touched={touched.toCompanyId}
                                    selectedValue={this.state.toCompanyId} />
                             
                                <Dropdown title="ToContact" data={this.state.AttentionData}
                                    index='toContactId'
                                    name="toContactId"
                                    id="toContactId"
                                    onChange={setFieldValue}
                                    handleChange={event => this.handleChange('toContactId', event, false, null, null)}
                                    onBlur={setFieldTouched}
                                    error={errors.toContactId}
                                    touched={touched.toContactId}
                                    selectedValue={this.state.toContactId}
                                />
                             <Dropdown title="ccCompany"
                                data={this.state.To_Cc_CompanyData}
                                name="ccCompanydd"
                                handleChange={event => this.handleChange('ccCompanyId', event, true, "Cc_ContactData", "GetContactsByCompanyId?companyId=" + event.value)}
                                index='ccCompanyddinbox'
                                selectedValue={this.state.ccCompanydd}
                            />
                            <div className="filterWrapper">
                                <Dropdown title="ccContact" data={this.state.Cc_ContactData}
                                    name="ccContactsdd"
                                    handleChange={event => this.handleChangeCC(event)}
                                    index='ccContactsddinbox' isMulti={true}
                                    selectedValue={this.state.ccContactsdd}
                                />

                            </div>

                            {!this.state.submitLoading ?
                                <div className="fullWidthWrapper">
                                    <button className="primaryBtn-1 btn" type="submit" >{Resources['send'][currentLanguage]}</button>
                                </div>
                                : (
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
function mapStateToProps(state) {

    return {
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(SendToInbox); 
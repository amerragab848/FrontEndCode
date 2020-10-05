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
import TextEditor from '../../Componants/OptionsPanels/TextEditor'


let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const validationSchema = Yup.object().shape({
    priorityId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
    toCompanyId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
    toContactIds: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
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
                //toContactId: "",
                toContactIds: [],
                ccCompanyId: "",
                cc: [],
                Comment: ""
            },
            PriorityData: [],
            To_Cc_CompanyData: [],
            AttentionData: [],
            Cc_ContactData: [],
            Cc_Selected: [],
            Comment: ""
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
    sendInbox = (values, { resetForm }) => {
        let obj = this.state.sendingData
        obj.Comment = this.state.Comment
        let cc = []
        let ccContactsdd = this.state.ccContactsdd ? this.state.ccContactsdd : [];
        ccContactsdd.map(i => {
            let ia = i.value
            cc.push(ia)
        });
        let toContactIds = []
        let toContactsdd = this.state.toContactIds ? this.state.toContactIds : [];
        toContactsdd.map(i => {
            let ia = i.value
            toContactIds.push(ia)
        });

        obj.cc = cc;
        obj.toContactIds = toContactIds;
        this.setState({ submitLoading: true, Comment: "", toContactIds: [], ccContactsdd: [] })
        values.Comment = '';
        values.priorityId = '';
        values.toCompanyId = '';
        // values.toContactId = '';
        values.toContactIds = [];
        values.ccCompanydd = '';
        values.ccContactsdd = '';
        this.props.actions.SendByEmail_Inbox("SendByInboxV5", obj);
        resetForm();
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.showModal == false) {
            return { submitLoading: false, priorityId: "", toContactIds: [], toCompanyId: "", ccCompanydd: "", ccContactsdd: [] };
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
    handleChangeMulti = (name, values) => {
        this.setState({ [name]: values })
    }
    onChangeComment = (value, field) => {

        if (value != null) {
            let original_document = { ...this.state.sendingData };

            let updated_document = {};

            updated_document[field] = value;

            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                sendingData: updated_document,
                [field]: value
            });
        }
    };

    render() {
        return (
            <div className="dropWrapper">
                <Formik
                    validationSchema={validationSchema}
                    initialValues={{
                        priorityId: null,
                        toCompanyId: null,
                        toContactIds: [],
                        Comment: this.state.Comment,
                        ccCompanydd: '',
                        ccContactsdd: [],
                        ccCompanyId: null
                    }}
                    onSubmit={(values, { resetForm }) => {
                        this.sendInbox(values, { resetForm });
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
                            <div className="filterWrapper">
                                <Dropdown title="ToContact" data={this.state.AttentionData}
                                    index='toContactIds'
                                    name="toContactIds"
                                    id="toContactIds"
                                    onChange={setFieldValue} isMulti={true}
                                    //handleChange={event => this.handleChange('toContactId', event, false, null, null)}
                                    handleChange={event => this.handleChangeMulti('toContactIds', event)}
                                    onBlur={setFieldTouched}
                                    error={errors.toContactIds}
                                    touched={touched.toContactIds}
                                    value={this.state.toContactIds}
                                    selectedValue={this.state.toContactIds}
                                />
                            </div>
                            <Dropdown title="ccCompany"
                                data={this.state.To_Cc_CompanyData}
                                name="ccCompanyId"
                                index='ccCompanyId'
                                id="ccCompanyId"
                                handleChange={event => this.handleChange('ccCompanyId', event, true, "Cc_ContactData", "GetContactsByCompanyId?companyId=" + event.value)}
                                onBlur={setFieldTouched}
                                onChange={setFieldValue}
                                touched={touched.ccCompanyId}
                                selectedValue={this.state.ccCompanyId}
                            />
                            <div className="filterWrapper">
                                <Dropdown title="ccContact" data={this.state.Cc_ContactData}
                                    name="ccContactsdd"
                                    handleChange={event => this.handleChangeMulti("ccContactsdd", event)}
                                    index='ccContactsddinbox' isMulti={true}
                                    value={this.state.ccContactsdd}
                                    selectedValue={this.state.ccContactsdd}
                                />

                            </div>
                            <div className="letterFullWidth fullInputWidth linebylineInput">
                                <label className="control-label">{Resources.comments[currentLanguage]}</label>
                                <div className="inputDev ui input">
                                    <TextEditor
                                        value={this.state.Comment || ''}
                                        onChange={event => this.onChangeComment(event, "Comment")}
                                    />
                                </div>
                            </div>

                            <div className="fullWidthWrapper">
                                {!this.state.submitLoading ?
                                    <button className="primaryBtn-1 btn" type="submit" >{Resources['send'][currentLanguage]}</button>
                                    : (
                                        <button className="primaryBtn-1 btn disabled">
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
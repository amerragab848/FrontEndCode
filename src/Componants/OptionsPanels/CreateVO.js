import React, { Component } from 'react'
import Api from '../../api'
import Resources from '../../resources.json';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import * as communicationActions from '../../store/actions/communication';


const validationSchema_CreateVO = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
})


let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class CreateVO extends Component {
    constructor(props) {
        super(props)
        this.state = {
            VO: {
                projectId: this.props.projectId,
                docId: this.props.docId,
                docType: this.props.docTypeId,
                arrange: "",
                subject: this.props.document.subject,
                status: 'true',
                docDate: moment(),
            },
            selectedOption: 'true',
            submitLoading: false
        }
    }
    startDatehandleChange = (date) => {
        this.setState({ VO: { ...this.state.VO, docDate: date } });
    }
    clickHandler = (e) => {
        this.setState({ submitLoading: true })

        let inboxDto = { ...this.state.VO };
        Api.post("AddContractsChangeOrderForModel", inboxDto).then(res => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({ submitLoading: false })
            this.props.actions.showOptionPanel(false);
        }).catch(() => {
            this.setState({ submitLoading: false })
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.props.actions.showOptionPanel(false);
        })
    }
    inputChangeHandler = (e) => {
        this.setState({ VO: { ...this.state.VO, Subject: e.target.value } });
    }
    handleChange(e, field) {

        let original_document = { ...this.state.VO };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            VO: updated_document
        });
    } 
    render() {
        return (
            <Formik key="create-trans-panel-form"
                validationSchema={validationSchema_CreateVO}
                initialValues={{ ...this.state.VO }} >
                {({ errors, touched, setFieldValue, setFieldTouched, handleBlur, handleChange }) => (
                    <Form id="create-trans-panel-form" className="proForm " noValidate="novalidate"  >
                        <div className="dropWrapper">
                            <div className="fillter-status fillter-item-c">
                                <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                    <input name='subject'
                                        className="form-control fsadfsadsa"
                                        id="subject"
                                        placeholder={Resources.subject[currentLanguage]}
                                        autoComplete='off'
                                        defaultValue={this.state.VO.subject}
                                        onBlur={(e) => {
                                            handleBlur(e)
                                            handleChange(e)
                                        }}
                                        onChange={(e) => this.inputChangeHandler(e)} />
                                    {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                </div>
                            </div> 
                                <DatePicker title='docDate'
                                    onBlur={setFieldTouched}
                                    error={errors.docDate}
                                    touched={touched.docDate}
                                    name="docDate"
                                    startDate={this.state.VO.docDate}
                                    handleChange={this.startDatehandleChange} /> 

                            <div className="fillter-status fillter-item-c linebylineInput__checkbox">
                                <label className="control-label"> {Resources.executed[currentLanguage]} </label>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="vo-executed" defaultChecked={this.state.VO.executed === "yes" ? "checked" : null}
                                        value="yes" onChange={e => this.handleChange(e, "executed")}
                                    />
                                    <label> {Resources.yes[currentLanguage]} </label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="vo-executed" defaultChecked={this.state.VO.executed === "no" ? null : "checked"}
                                        value="no" onChange={e => this.handleChange(e, "executed")}
                                    />
                                    <label> {Resources.no[currentLanguage]} </label>
                                </div>
                            </div>
                            <div className="fillter-status fillter-item-c linebylineInput__checkbox">
                                <label className="control-label">{Resources.status[currentLanguage]}</label>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="letter-status" defaultChecked={this.state.VO.status === "true" ? "checked" : null}
                                        value="true" onChange={e => this.handleChange(e, "status")} />
                                    <label>{Resources.oppened[currentLanguage]}</label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="letter-status" defaultChecked={this.state.VO.status === "false" ? null :"checked" }
                                        value="false" onChange={e => this.handleChange(e, "status")} />
                                    <label>{Resources.closed[currentLanguage]}</label>
                                </div>
                            </div>

                            <div className="fullWidthWrapper">
                                <button className="primaryBtn-1 btn" onClick={this.clickHandler}>
                                    {Resources['save'][currentLanguage]}</button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        )
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateVO);
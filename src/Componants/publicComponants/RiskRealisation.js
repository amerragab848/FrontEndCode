import React, { Component, Fragment } from 'react'
import Resources from "../../resources.json";
import Api from "../../api";
import { toast } from "react-toastify";
import moment from "moment";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import LoadingSection from './LoadingSection'
import DatePicker from '../OptionsPanels/DatePicker'
import Dropdown from '../OptionsPanels/DropdownMelcous'
const _ = require('lodash');
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({ 
    actualImpact: Yup.string().required(Resources['realizedImpact'][currentLanguage]),
})
let contactApproval = [
    { label: 'Ahmed Moahmed', value: 1 },
    { label: 'Shoqui Ahmed', value: 2 },
    { label: 'Khaled Mahoumed', value: 3 },
    { label: 'Salah Moahmed', value: 4 },
]
class RiskRealisation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            pageLoading: true,
            riskId: props.riskId,
            riskRealisation: {},
            showRiskRealisation: true,
            readOnlyInputs: false
        }
    }

    componentWillMount() {
        Api.get("GetRiskRealisationByRiskId?riskId=" + this.state.riskId).then(result => {
            if (result) {
                let riskRealisation = {
                    id: result.id,
                    riskId: result.riskId,
                    riskRealise: result.riskRealise,
                    actualImpact: result.actualImpact,
                    dateRealisation: moment(result.dateRealisation).format('YYYY-MM-DD'),
                    costMit: result.costMit,
                    postEventMit: result.postEventMit,
                    riskRef: result.riskRef,
                    residualRiskTitle: result.residualRiskTitle,
                }
                this.setState({ riskRealisation, pageLoading: false });
            }
            else {
                let riskRealisation = {
                    id: 0,
                    riskId: 0,
                    riskRealise: '',
                    actualImpact: '',
                    dateRealisation: moment(),
                    costMit: '',
                    postEventMit: '',
                    riskRef: '',
                    residualRiskTitle: ''
                }
                this.setState({ riskRealisation, pageLoading: false });
            }
        }).catch(() => {
            this.setState({ isLoading: false });
        });
    }

    handleChange(e, field) {
        let original_document = { ...this.state.riskRealisation };
        original_document[field] = e.target.value;
        this.setState({ riskRealisation: original_document });
        if (field === 'riskRealise') {
            let value = e.target.value
            if (value === 'true') {

                this.setState({ showRiskRealisation: true });
            }
            else {
                this.setState({ showRiskRealisation: false });
            }

        }

    }

    handleChangeDate = (e, field) => {
        let original_document = { ...this.state.riskRealisation };
        let updated_document = {};
        updated_document[field] = e;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({ riskRealisation: updated_document });
    }

    saveRisk = () => {
        this.setState({ isLoading: true });
        let riskRealisation = this.state.riskRealisation;
        riskRealisation.riskId = this.state.riskId;
        riskRealisation.dateRealisation = moment(riskRealisation.dateRealisation, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
         
        Api.post('AddRiskRealisation', riskRealisation).then(() => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({ isLoading: false });
        })
    }

    render() {
        return (
            <Fragment> 
                {this.state.pageLoading == true ? <LoadingSection /> :
                    <Formik
                        initialValues={{ ...this.state.riskRealisation }}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            this.saveRisk()
                        }}>
                        {({ errors, touched, values, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                            <Form id="signupForm1" className={" proForm datepickerContainer letterFullWidth" + (this.state.readOnlyInputs? " readOnly_inputs":"")} noValidate="novalidate" >
                                <div className="letterFullWidth linebylineInput__checkbox">
                                    <label className="control-label">{Resources.riskRealised[currentLanguage]}</label>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="status" defaultChecked={this.state.riskRealisation.riskRealise === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'riskRealise')} />
                                        <label style={{ paddingLeft: '35px', paddingRight: '15px' }}>{Resources.yes[currentLanguage]}</label>
                                    </div>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" name="status" defaultChecked={this.state.riskRealisation.riskRealise === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'riskRealise')} />
                                        <label style={{ paddingLeft: '35px', paddingRight: '15px' }}>{Resources.no[currentLanguage]}</label>
                                    </div>
                                </div>

                                {this.state.showRiskRealisation === true ?
                                    <Fragment>

                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">{Resources.realizedImpact[currentLanguage]}</label>
                                            <div className={"inputDev ui input" + (errors.actualImpact && touched.actualImpact ? (" has-error") : !errors.actualImpact && touched.actualImpact ? (" has-success") : " ")} >
                                               
                                                <input name='actualImpact' className="form-control fsadfsadsa" id="actualImpact"
                                                    placeholder={Resources.realizedImpact[currentLanguage]}
                                                    autoComplete='off'
                                                    defaultValue={this.state.riskRealisation.actualImpact}
                                                    onChange={(e) => {
                                                        this.handleChange(e, 'actualImpact')
                                                        handleChange(e)
                                                    }} onBlur={handleBlur} />
                                                {touched.actualImpact ? (<em className="pError">{errors.actualImpact}</em>) : null}
                                            </div>
                                        </div>

                                        <div className="linebylineInput  alternativeDate">
                                            <DatePicker title='dateOfRealisation'
                                                startDate={this.state.riskRealisation.dateRealisation}
                                                handleChange={e => this.handleChangeDate(e, 'dateRealisation')} />
                                        </div>
                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">{Resources.costOfPostEventMitigation[currentLanguage]}</label>
                                            <div className="ui input inputDev">
                                                <input type="text" className="form-control" id="postEventMit"
                                                    defaultValue={this.state.riskRealisation.postEventMit}
                                                    name="postEventMit"
                                                    placeholder={Resources.costOfPostEventMitigation[currentLanguage]}
                                                    onChange={(e) => this.handleChange(e, 'postEventMit')} />
                                            </div>
                                        </div>
                                       
                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">{Resources.residualRiskTitle[currentLanguage]}</label>
                                            <div className="ui input inputDev">
                                                <input type="text" className="form-control" id="residualRiskTitle"
                                                    defaultValue={this.state.riskRealisation.residualRiskTitle}
                                                    name="residualRiskTitle"
                                                    placeholder={Resources.residualRiskTitle[currentLanguage]}
                                                    onChange={(e) => this.handleChange(e, 'residualRiskTitle')} />
                                            </div>
                                        </div>
                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">{Resources.residualRiskRefNo[currentLanguage]}</label>
                                            <div className="ui input inputDev">
                                                <input type="text" className="form-control" id="riskRef"
                                                    defaultValue={this.state.riskRealisation.riskRef}
                                                    name="riskRef"
                                                    placeholder={Resources.residualRiskRefNo[currentLanguage]}
                                                    onChange={(e) => this.handleChange(e, 'riskRef')} />
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <Dropdown title="requestApprovalDrop"
                                                data={contactApproval}
                                                selectedValue={values.requestApprovalDrop}
                                                handleChange={(e) => {
                                                    setFieldValue('requestApprovalDrop', e)
                                                    this.setState({
                                                        readOnlyInputs: true
                                                    })
                                                }}
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                isClear={false}
                                                index="requestApprovalDrop"
                                                name="requestApprovalDrop"
                                                id="requestApprovalDrop" />
                                        </div>

                                        <div className="slider-Btns letterFullWidth">
                                            {this.state.isLoading ?
                                                <button className="primaryBtn-1 btn disabled">
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button> :
                                                <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>}
                                        </div>
                                    </Fragment>
                                    : null}
                            </Form>
                        )}
                    </Formik>
                }
            </Fragment>
        );
    }
}

export default RiskRealisation
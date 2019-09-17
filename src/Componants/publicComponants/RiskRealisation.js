import React, { Component, Fragment } from 'react'
import Resources from "../../resources.json";
import Api from "../../api";
import config from "../../Services/Config";
import { toast } from "react-toastify";
import moment from "moment";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import LoadingSection from './LoadingSection';
import DatePicker from '../OptionsPanels/DatePicker';
import Dropdown from '../OptionsPanels/DropdownMelcous';
import dataservice from "../../Dataservice";

const _ = require('lodash');
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    actualImpact: Yup.string().required(Resources['realizedImpact'][currentLanguage]),
});

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
            readOnlyInputs: false,
            isEdit: false,
            accountsData: [],
            selectApproveBy: {},
            riskRealise: true,
            showActions: false,
            riskRelaLog: []
        }
    }

    componentDidMount() {
        let c = config.getPayload().aci
        console.log(c)
        Api.get("GetRiskRealisationByRiskId?riskId=" + this.state.riskId).then(result => {
            if (result) {
                this.setState({
                    riskRealisation: result,
                    pageLoading: false,
                    isEdit: true,
                    showActions: result.approveBy === config.getPayload().aci ? result.isApprove !== null ? false : true : false,
                    readOnlyInputs: result.isApprove !== null ? true : false
                });
                dataservice.GetDataGrid('GetRiskRealisationLogs?riskId=' + this.state.riskId).then(
                    result => {
                        this.setState({ riskRelaLog: result });
                    }
                )
            }
            else {
                this.setState({ riskRealisation: {}, pageLoading: false, isEdit: false, showActions: false });
            }
        }).catch(() => { this.setState({ isLoading: false }) });

        dataservice.GetDataList('GetActiveAccountsByAccountOwnerId?accountOwnerId=2', 'userName', 'id').then(
            result => {

                if (this.state.isEdit) {
                    let selectedValue = result.find(i => i.value === this.state.riskRealisation.approveBy);
                    this.setState({ selectApproveBy: selectedValue });
                }


                this.setState({ accountsData: result });
            }
        )
    }

    handleChange(e) {
        let value = e.target.value
        this.setState({ riskRealise: value });
        if (value === 'true') {

            this.setState({ showRiskRealisation: true });
        }
        else {
            this.setState({ showRiskRealisation: false });
        }
    }

    saveRisk = (values) => {
        this.setState({ isLoading: true });
        let obj = values
        let approveBy = this.state.selectApproveBy === null ? undefined : this.state.selectApproveBy.value
        obj.approveBy = approveBy
        obj.dateRealisation = moment(obj.dateRealisation, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        if (this.state.isEdit) {
            dataservice.addObject('SaveRiskRealisation', obj).then(
                result => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                    this.setState({ isLoading: false });
                }
            ).catch(() => { this.setState({ isLoading: false }) });
        }
        else {
            dataservice.addObject('SaveRiskRealisation', obj).then(
                result => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                    this.setState({ isLoading: false });
                }).catch(() => { this.setState({ isLoading: false }) });
        }
    }

    handleDropChange(e) {
        if (e) {
            this.setState({ selectApproveBy: e });
        }
    }

    saveStatus(status) {
        dataservice.addObject('UpdateRiskRealisationStatus?id=' + this.state.riskRealisation.id + '&status=' + status + ' ', null).then(
            result => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        )
    }

    render() {
        return (
            <Fragment>
                {this.state.pageLoading == true ? <LoadingSection /> :
                    <Fragment>

                        {!this.state.readOnlyInputs ? null :
                            <div className="edit__sign">
                                <div className={"notifiError notifiActionsContainer" + (this.state.riskRealisation.isApprove ? ' approved' : '')} style={{ maxWidth: '350px' }}>
                                    <span className="notfiSpan">{this.state.riskRealisation.isApprove ? ' Approved' : 'Rejected'}</span>
                                </div>
                            </div>
                        }

                        <Formik
                            initialValues={{
                                riskId: this.props.riskId,
                                id: this.state.isEdit ? this.state.riskRealisation.id : -1,
                                riskRealise: this.state.isEdit ? this.state.riskRealisation.riskRealise : true,
                                actualImpact: this.state.isEdit ? this.state.riskRealisation.actualImpact : '',
                                dateRealisation: this.state.isEdit ? moment(this.state.riskRealisation.dateRealisation).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                                postEventMit: this.state.isEdit ? this.state.riskRealisation.postEventMit : '',
                                riskRef: this.state.isEdit ? this.state.riskRealisation.riskRef : '',
                                residualRiskTitle: this.state.isEdit ? this.state.riskRealisation.residualRiskTitle : '',
                                approveBy: '',
                            }}
                            enableReinitialize={true}
                            validationSchema={validationSchema}
                            onSubmit={(values) => { this.saveRisk(values) }}>
                            {({ errors, touched, values, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                <Form id="signupForm1" className={" proForm datepickerContainer letterFullWidth" + (this.state.readOnlyInputs ? " readOnly_inputs" : "")} noValidate="novalidate" >

                                    <div className="letterFullWidth linebylineInput__checkbox">
                                        <label className="control-label">{Resources.riskRealised[currentLanguage]}</label>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="status" defaultChecked={this.state.riskRealisation.riskRealise === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e)} />
                                            <label style={{ paddingLeft: '35px', paddingRight: '15px' }}>{Resources.yes[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="status" defaultChecked={this.state.riskRealisation.riskRealise === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e)} />
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
                                                        value={values.actualImpact}
                                                        onChange={handleChange} onBlur={handleBlur} />
                                                    {touched.actualImpact ? (<em className="pError">{errors.actualImpact}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput  alternativeDate">
                                                <DatePicker title='dateOfRealisation'
                                                    startDate={values.dateRealisation}
                                                    handleChange={e => setFieldValue('dateRealisation', e)} />
                                            </div>

                                            <div className="linebylineInput fullInputWidth">
                                                <label className="control-label">{Resources.costOfPostEventMitigation[currentLanguage]}</label>
                                                <div className="ui input inputDev">
                                                    <input type="text" className="form-control" id="postEventMit"
                                                        value={values.postEventMit}
                                                        name="postEventMit"
                                                        placeholder={Resources.costOfPostEventMitigation[currentLanguage]}
                                                        onChange={handleChange} onBlur={handleBlur} />
                                                </div>
                                            </div>

                                            <div className="linebylineInput fullInputWidth">
                                                <label className="control-label">{Resources.residualRiskTitle[currentLanguage]}</label>
                                                <div className="ui input inputDev">
                                                    <input type="text" className="form-control" id="residualRiskTitle"
                                                        value={values.residualRiskTitle}
                                                        name="residualRiskTitle"
                                                        placeholder={Resources.residualRiskTitle[currentLanguage]}
                                                        onChange={handleChange} onBlur={handleBlur}
                                                    />
                                                </div>
                                            </div>

                                            <div className="linebylineInput fullInputWidth">
                                                <label className="control-label">{Resources.residualRiskRefNo[currentLanguage]}</label>
                                                <div className="ui input inputDev">
                                                    <input type="text" className="form-control" id="riskRef"
                                                        value={values.riskRef} name="riskRef"
                                                        placeholder={Resources.residualRiskRefNo[currentLanguage]}
                                                        onChange={handleChange} onBlur={handleBlur} />
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="requestApprovalDrop"
                                                    data={this.state.accountsData}
                                                    selectedValue={this.state.selectApproveBy}
                                                    handleChange={(e) => {
                                                        this.handleDropChange(e)
                                                    }}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    index="approveBy"
                                                    name="approveBy"
                                                    id="approveBy" />
                                            </div>

                                            <div className="slider-Btns letterFullWidth" style={{ flexFlow: 'row' }}>
                                                {this.state.isLoading ?
                                                    <button className="primaryBtn-1 btn disabled">
                                                        <div className="spinner">
                                                            <div className="bounce1" />
                                                            <div className="bounce2" />
                                                            <div className="bounce3" />
                                                        </div>
                                                    </button> :
                                                    <button className={"primaryBtn-1 btn meduimBtn " + (this.state.readOnlyInputs ? " disabled" : "")} type="submit" >{Resources.save[currentLanguage]}</button>}
                                                {this.state.showActions ?
                                                    <Fragment>
                                                        <button className="defaultBtn btn meduimBtn" onClick={() => this.saveStatus(true)} type="button" >Approve</button>
                                                        <button className="primaryBtn-2 btn meduimBtn" onClick={() => this.saveStatus(false)} type="button" >Reject</button>
                                                    </Fragment>
                                                    : null}
                                            </div>
                                        </Fragment>
                                        : null}
                                </Form>
                            )}
                        </Formik>
                        <div className="doc-pre-cycle">
                            <table className="attachmentTable attachmentTable__fixedWidth">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className="headCell tableCell-1">{Resources['residualRiskRefNo'][currentLanguage]}</div>
                                        </th>
                                        <th>
                                            <div className="headCell"> {Resources['dateOfRealisation'][currentLanguage]}</div>
                                        </th>
                                        <th>
                                            <div className="headCell"> {Resources['costOfPostEventMitigation'][currentLanguage]}</div>
                                        </th>
                                        <th>
                                            <div className="headCell"> {Resources['residualRiskTitle'][currentLanguage]}</div>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.riskRelaLog.map((item, index) => {
                                        return <tr key={item.id + '-' + index}>
                                            <td className="removeTr">
                                                <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.riskRef}</div>
                                            </td>
                                            <td>
                                                <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.dateRealisation != null ? moment(item.dateRealisation).format('DD/MM/YYYY') : 'No Date'}</div>
                                            </td>
                                            <td>
                                                <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.postEventMit}</div>
                                            </td>

                                            <td>
                                                <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.residualRiskTitle}</div>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Fragment>
                }
            </Fragment>
        );
    }
}

export default RiskRealisation
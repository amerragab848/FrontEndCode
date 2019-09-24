import React, { Component } from "react";
import Api from "../../api";
import dataService from "../../Dataservice";
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from "../../resources.json";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadingSection from "../publicComponants/LoadingSection";
import { SkyLightStateless } from "react-skylight";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
//const _ = require('lodash')

const validationSchema = Yup.object().shape({
    workFlowId: Yup.string().required(Resources['slectWorkFlow'][currentLanguage]),
    accountId: Yup.string().required(Resources['approveTo'][currentLanguage]),
});
class sendToExpensesWorkFlow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expenseId: this.props.expenseId,
            subject: this.props.subject,
            expenseTypeId: this.props.expenseTypeId,
            workFlowData: [],
            approvedToData: [],
            selectedWF: { label: Resources.slectWorkFlow[currentLanguage], value: "0" },
            selectedApprovedTo: { label: Resources.approveTo[currentLanguage], value: "0" },
            Loading: false
        };
    }

    componentDidMount() {
        dataService.GetDataList('ExpensesWorkFlowGet', 'subject', 'id').then(result => {
            this.setState({ workFlowData: result });
        });
    };

    workFlowHandelChange(e) {
        this.setState({ selectedWF: e });
        dataService.GetDataList("GetExpensesWorkFlowFirstLevelByWorkFlowId?workFlow=" + e.value, 'contactName', 'contactId').then(
            result => {
                this.setState({ approvedToData: result });
            });
    }


    save(values, resetForm) {
        this.setState({ Loading: true });
        let obj = values
        values.accountId = this.state.selectedApprovedTo.value;
        values.workFlowId = this.state.selectedWF.value;
        dataService.addObject('sendToExpensesWorkFlow', obj).then(
            result => {
                this.setState({ Loading: false });
                this.props.viewWorkFlow();
                this.props.closeModal();

                resetForm();
                //return ViewWork
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            });
    }

    render() {
        return (

            <div className="skyLight__form">
                <SkyLightStateless onOverlayClicked={e => this.props.closeModal()}
                    title={Resources['workFlow'][currentLanguage]}
                    onCloseClicked={e => this.props.closeModal()} isVisible={this.props.showModal}>
                    {this.props.showModal ?
                        <div className="document-fields">
                            <Formik initialValues={{
                                expenseId: this.props.expenseId,
                                subject: this.props.subject,
                                expenseTypeId: this.props.expenseTypeId,
                                accountId: '',
                                workFlowId: ''
                            }}
                                enableReinitialize={true}
                                validationSchema={validationSchema}
                                onSubmit={(values, { resetForm }) => { this.save(values, resetForm) }}>
                                {({ errors, values, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                    <Form id="QsForm2" className="proForm" noValidate="novalidate" onSubmit={handleSubmit}>
                                        <div className="dropWrapper ">

                                            <Dropdown title="workFlow" data={this.state.workFlowData}
                                                selectedValue={this.state.selectedWF}
                                                handleChange={e => this.workFlowHandelChange(e)}
                                                onChange={setFieldValue} onBlur={setFieldTouched} error={errors.workFlowId}
                                                touched={touched.workFlowId} index="workFlowId" name="workFlowId" id="workFlowId" />

                                            <Dropdown title="approvedTo" data={this.state.approvedToData} selectedValue={this.state.selectedApprovedTo}
                                                handleChange={e => this.setState({ selectedApprovedTo: e })}
                                                onChange={setFieldValue} onBlur={setFieldTouched} error={errors.accountId}
                                                touched={touched.accountId} index="accountId" name="accountId" id="accountId" />
                                        </div>

                                        <div className="slider-Btns">
                                            {this.state.Loading ?
                                                <button className="primaryBtn-1 btn disabled">
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button>
                                                : <button className="primaryBtn-1 btn mediumBtn" type="submit" >{Resources.save[currentLanguage]}</button>}
                                        </div>

                                    </Form>
                                )}
                            </Formik>
                        </div >
                        : null}

                </SkyLightStateless>
            </div>
        );
    }
}

export default sendToExpensesWorkFlow;

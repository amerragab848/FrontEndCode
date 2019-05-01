import React, { Component, Fragment } from 'react';
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import Api from '../../api'
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import moment from 'moment'
import Resources from '../../resources.json';
import _ from "lodash";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { withRouter } from "react-router-dom";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import DataService from '../../Dataservice'
import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import Config from "../../Services/Config.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SkyLight from 'react-skylight';
import * as communicationActions from '../../store/actions/communication';
import AddItemDescription from '../../Componants/OptionsPanels/addItemDescription'
import EditItemDescription from '../../Componants/OptionsPanels/editItemDescription'
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'

import 'react-table/react-table.css'
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import GridSetup from "../Communication/GridSetup";
import XSLfile from '../../Componants/OptionsPanels/XSLfiel'
import IPConfig from '../../IP_Configrations'
import Recycle from '../../Styles/images/attacheRecycle.png'
import 'react-table/react-table.css'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const fromContractSchema = Yup.object().shape({
    fromContract: Yup.string().required(Resources['selectConditions'][currentLanguage])
});

const conditionSchema = Yup.object().shape({
    description: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    arrange: Yup.number().required(Resources['arrangeRequired'][currentLanguage]).typeError(Resources['onlyNumbers'][currentLanguage]).min(0, Resources['onlyNumbers'][currentLanguage]),
});


let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;


class ContractsConditions extends Component {
    constructor(props) {
        super(props)
        const query = new URLSearchParams(this.props.location.search);
        let index = 0;
        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));
                    docId = obj.docId;
                    projectId = obj.projectId;
                    projectName = obj.projectName;
                    isApproveMode = obj.isApproveMode;
                    docApprovalId = obj.docApprovalId;
                    arrange = obj.arrange;
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }
        this.state = {
            activeTab: 0,
            activeCondition: 0,
            isLoading: false,
            rows: [],
            item: '',
            showDeleteModal: false,
            addLoadding: false,
            contracts: [],
            arrange: 1
        }
    }

    changeTab = (tabIndex) => {
        this.setState({ activeTab: tabIndex })
    }

    componentWillMount = () => {
        DataService.GetDataList("GetAccountsContractsConditionsCategories?accountOwnerId=2&pageNumber=0&pageSize=1000", 'details', 'id').then((res) => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({ contracts: res })
        }).catch(res => {
        })
    }

    addRecord(values) {
        let record = {
            conditionType: this.state.activeTab == 0 ? 'general' : '',
            details: this.state.activeCondition == 1 ? values.description : '',
            arrange: this.state.activeCondition == 1 ? values.arrange : this.state.arrange,
            contractId: 6697, //this.props.contractId
            accountsContractId: this.state.activeCondition == 1 ? undefined : this.state.selectedContract.value
        }
        if (this.state.activeCondition == 0) {
            let arrange = this.state.arrange + 1
            this.setState({ arrange })
        }
        this.setState({ addLoadding: true })
        Api.post("AddContractCondition", record).then((res) => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({ addLoadding: false, rows: res })
        }).catch(res => {
            this.setState({ addLoadding: false })
        })
    }

    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    ConfirmDelete = () => {
        this.setState({ isLoading: true, showDeleteModal: false })
        Api.post("DeleteGeneralConditionById?id=" + this.state.item.id).then((res) => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            let rows = []
            this.state.rows.forEach(item => {
                if (item.id != this.state.item.id) {
                    rows.push(item)
                }
            })
            this.setState({ isLoading: false, rows })
        }).catch(res => {
            this.setState({ isLoading: false })
        })
    }

    render() {
        let tabel = this.state.rows ? this.state.rows.map((item, Index) => {
            return (
                <tr key={Index}>
                    <td>
                        <div className="contentCell tableCell-1">
                            <span>{item.arrange} </span>
                        </div>
                    </td>
                    <td className="tdHover">
                        <div className="attachmentAction" style={{ opacity: '1' }}>
                            <a className="attachRecycle" onClick={() => this.setState({ item, item, showDeleteModal: true })}>
                                <img src={Recycle} alt="del" width="100%" height="100%" />
                            </a>
                        </div>
                    </td>
                    <td colspan={6}>
                        <div className="contentCell tableCell-2">
                            <span>{item.details} </span>
                        </div>
                    </td>
                </tr>
            );
        }) : ''
        const contractContent = this.state.isLoading == true ? <LoadingSection /> :
            <React.Fragment>
                <div className="document-fields">
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            description: '',
                            arrange: '',
                            fromContract: ''

                        }}
                        validationSchema={this.state.activeCondition == 1 ? conditionSchema : fromContractSchema}
                        onSubmit={(values) => {
                            this.addRecord(values)
                        }}
                    >
                        {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange, values }) => (
                            <Form id="signupForm1" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                                <div className="proForm first-proform letterFullWidth radio__only">
                                    <div className="linebylineInput valid-input">
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="status" defaultChecked={values.status === false ? null : 'checked'} value="true" onChange={e => this.setState({ activeCondition: 0 })} />
                                            <label>{Resources.fromContract[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="status" defaultChecked={values.status === false ? 'checked' : null} value="false" onChange={e => this.setState({ activeCondition: 1 })} />
                                            <label>{Resources.newCondition[currentLanguage]}</label>
                                        </div>
                                    </div>
                                </div>
                                {this.state.activeCondition == 1 ?
                                    <div className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input fullInputWidth">
                                            <label className="control-label">{Resources.description[currentLanguage]}</label>
                                            <div className={"inputDev ui input " + (errors.description ? 'has-error' : !errors.description && touched.description ? (" has-success") : " ")}>
                                                <input type="text" className="form-control" id="description"
                                                    defaultValue={values.description}
                                                    name="description"
                                                    placeholder={Resources.description[currentLanguage]}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                />
                                                {errors.description ? (<em className="pError">{errors.description}</em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                            <div className={"inputDev ui input " + (errors.arrange ? 'has-error' : !errors.arrange && touched.arrange ? (" has-success") : " ")}>
                                                <input type="text" className="form-control" id="arrange"
                                                    defaultValue={values.arrange}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    name="arrange"
                                                    placeholder={Resources.arrange[currentLanguage]}
                                                />
                                                {errors.arrange ? (<em className="pError">{errors.arrange}</em>) : null}
                                            </div>
                                        </div>
                                    </div> :
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="fromContract"
                                            data={this.state.contracts}
                                            selectedValue={this.state.selectedContract}
                                            handleChange={event => {
                                                this.setState({ selectedContract: event })
                                            }}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.fromContract}
                                            touched={touched.fromContract}
                                            name="fromContract"
                                            index="fromContract" />
                                    </div>}
                                <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                    {this.state.addLoadding === false ? (
                                        <button className={"primaryBtn-1 btn " + (this.props.isApproveMode === true ? 'disNone' : '')} type="submit" disabled={this.state.isApproveMode}  >{Resources['add'][currentLanguage]}</button>
                                    ) :
                                        (
                                            <button className="primaryBtn-1 btn  disabled" disabled="disabled">
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
                    <header className="main__header">
                        <div className="main__header--div">
                            <h2 className="zero">{Resources['addGeneralCondition'][currentLanguage]}</h2>
                        </div>
                    </header>
                    <table className="attachmentTable">
                        <thead>
                            <tr>
                                <th>
                                    <div className="headCell tableCell-1">
                                        <span>{Resources.arrange[currentLanguage]} </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-1">
                                        <span>{Resources.delete[currentLanguage]} </span>
                                    </div>
                                </th>
                                <th colspan={6}>
                                    <div className="headCell tableCell-2">
                                        <span>{Resources['description'][currentLanguage]} </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tabel}
                        </tbody>
                    </table>
                </div>
            </React.Fragment >
        return (
            <React.Fragment>
                <div className="mainContainer">
                    <div className="documents-stepper noTabs__document one__tab one_step">
                        <div className="doc-container">
                            <div className="step-content">
                                <div className="company__total proForm">
                                    <ul id="stepper__tabs" className="data__tabs">
                                        <li className={" data__tabs--list " + (this.state.activeTab == 0 ? "active" : '')} onClick={() => this.changeTab(0)}>{Resources.generalConditionsLog[currentLanguage]}</li>
                                        <li className={"data__tabs--list " + (this.state.activeTab == 1 ? "active" : '')} onClick={() => this.changeTab(1)}>{Resources.particularConditionsLog[currentLanguage]}</li>
                                    </ul>
                                </div>
                                {contractContent}
                                {/* <div className="doc-pre-cycle letterFullWidth">
                                    <div className='precycle-grid'>
                                        <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn  " type="submit" onClick={this.NextStep}>{Resources.next[currentLanguage]}</button>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null}
            </React.Fragment>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        changeStatus: state.communication.changeStatus,
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow,
        items: state.communication.items,
        projectId: state.communication.projectId, showModal: state.communication.showModal
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
)(withRouter(ContractsConditions))
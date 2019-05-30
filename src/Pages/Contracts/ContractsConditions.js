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





class ContractsConditions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            activeCondition: 0,
            isLoading: false,
            rows: [],
            generalRows: [],
            particularRows: [],
            item: '',
            showDeleteModal: false,
            addLoadding: false,
            contracts: [],
            G_Arrange: 1,
            P_Arrange: 1,
            selectedContract: { label: Resources.selectConditions[currentLanguage], value: -1 },
            description: ''
        }
    }
    changeTab = (tabIndex) => {
        if (tabIndex == 1)
            this.setState({ selectedContract: { label: Resources.specsSectionSelection[currentLanguage], value: -1 } })
        else
            this.setState({ selectedContract: { label: Resources.selectConditions[currentLanguage], value: -1 } })
        this.setState({ activeTab: tabIndex })
    }
    componentWillMount = () => {
        this.setState({ isLoading: true })
        DataService.GetDataList("GetAccountsContractsConditionsCategories?accountOwnerId=2&pageNumber=0&pageSize=1000", 'details', 'id').then((res) => {
            this.setState({ contracts: res, isLoading: false })
        }).catch(res => {
            this.setState({ isLoading: false })
        })
        this.setState({ isLoading: true })
        Api.get('GetContractGeneralConditions?contractId='+this.props.contractId).then(res=>{
            if(res)
            this.setState({generalRows:res, isLoading: false})
            else
            this.setState({ isLoading: false})
        })
        this.setState({ isLoading: true })
        Api.get('GetContractParticularConditions?contractId='+this.props.contractId).then(res=>{
            if(res)
            this.setState({particularRows:res, isLoading: false})
            else
            this.setState({ isLoading: false})
        })
    }

    addRecord(values) {
        let arrange = this.state.activeTab == 0 ? this.state.G_Arrange : this.state.P_Arrange
        let rows = this.state.activeTab == 0 ? this.state.generalRows : this.state.particularRows
        if (rows.length > 0) {
            rows.forEach(item => {
                if (item.arrange >= arrange)
                    arrange = item.arrange + 1
            })
        }
        if (this.state.activeTab == 0)
            this.setState({ G_Arrange: arrange })
        else
            this.setState({ P_Arrange: arrange })
        let record = {
            conditionType: this.state.activeTab == 0 ? 'general' : 'particular',
            details: this.state.activeCondition == 1 ? values.description : '',
            arrange: this.state.activeCondition == 1 ? values.arrange : arrange,
            contractId: this.props.contractId, 
            accountsContractId: this.state.activeCondition == 0 ? (this.state.activeTab == 1 ? this.state.selectedContract.value : this.state.selectedContract.label) : undefined
        }
        if (this.state.activeTab == 1)
            this.setState({ selectedContract: { label: Resources.specsSectionSelection[currentLanguage], value: -1 } })
        else
            this.setState({ selectedContract: { label: Resources.selectConditions[currentLanguage], value: -1 } })
        this.setState({ addLoadding: true })
        Api.post("AddContractCondition", record).then((res) => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            if (this.state.activeTab == 0)
                this.setState({ generalRows: res })
            else
                this.setState({ particularRows: res })
            this.setState({ addLoadding: false })
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
            let _rows = this.state.activeTab == 0 ? this.state.generalRows : this.state.particularRows
            _rows.forEach(item => {
                if (item.id != this.state.item.id) {
                    rows.push(item)
                }
            })
            if (this.state.activeTab == 0)
                this.setState({ isLoading: false, generalRows: rows })
            else
                this.setState({ isLoading: false, particularRows: rows })
        }).catch(res => {
            this.setState({ isLoading: false })
        })
    }

    render() {
        let rows = this.state.activeTab == 0 ? this.state.generalRows : this.state.particularRows
        let tabel = rows ? rows.map((item, Index) => {
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
                    <td colSpan={6}>
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
                            description: this.state.description,
                            arrange: this.state.activeTab == 0 ? this.state.G_Arrange : this.state.P_Arrange,
                            fromContract: this.state.selectedContract.value == -1 ? '' : this.state.selectedContract.label
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
                                                    value={values.description}
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
                                                    value={values.arrange}
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
                                            title={this.state.activeTab == 1 ? 'specsSection' : "conditions"}
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
                                        <button className={"primaryBtn-1 btn " + (this.props.isViewMode === true ? 'disNone' : '')} type="submit" disabled={this.state.isApproveMode}  >{Resources['add'][currentLanguage]}</button>
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
                            <h2 className="zero">{this.state.activeTab == 1 ? Resources['addParticularCondition'][currentLanguage] : Resources['addGeneralCondition'][currentLanguage]}</h2>
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
                                <th colSpan={6}>
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
            </React.Fragment>
        return (
            <React.Fragment>
                <div>
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
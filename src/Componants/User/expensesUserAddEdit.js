import React, { Component, Fragment } from 'react';
import Api from '../../api'
import config from "../../Services/Config";
import dataservice from "../../Dataservice";
import { toast } from "react-toastify";
import LoadingSection from "../publicComponants/LoadingSection";
import Resources from '../../resources.json';
import Tree from '../OptionsPanels/Tree'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ReactTable from "react-table";
import 'react-table/react-table.css'
import Dropdown from "../OptionsPanels/DropdownMelcous";
import DatePicker from "../OptionsPanels/DatePicker";
import ConfirmationModal from "../publicComponants/ConfirmationModal";
import Steps from "../publicComponants/Steps";
import moment from "moment";
import { SkyLightStateless } from "react-skylight";
var steps_defination = [];
steps_defination = [
    { name: "expenses", callBackFn: null },
    { name: "items", callBackFn: null }
];
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProject = localStorage.getItem('lastSelectedprojectName')
const _ = require('lodash');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    projectId: Yup.string().required(Resources['projectSelection'][currentLanguage]),
    expenseTypeId: Yup.string().required(Resources['expensesTypeRequired'][currentLanguage]),
    unitRate: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
    expenseValue: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
})

class ExpensesUserAddEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CurrentStep: 0,
            projectData: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            expensesTypeData: [],
            selectedExpensesType: { label: Resources.expensesTypeRequired[currentLanguage], value: "0" },
            pettyCashData: [],
            selectedPettyCash: { label: Resources.peetyCash[currentLanguage], value: "0" },
            boqData: [],
            selectedBoq: { label: Resources.selectBoq[currentLanguage], value: "0" },
            boqItemData: [],
            selectedBoqItem: { label: Resources.boqItemSelection[currentLanguage], value: "0" },
            arrange: 0,
            refCode: '',
            costCodingTreeName: '',
            Loading: false
        }

    }

    componentDidMount() {
        this.fillDropDowns(false);
        this.getNextArrange();

    }

    getNextArrange() {
        dataservice.GetRowById('GetNextArrangeExpenses').then(
            res => {
                let arrange = res.split('/')[1];
                this.setState({ refCode: res, arrange })
            }
        )
    }

    fillDropDowns(isEdit) {

        //fill Projects Drop
        dataservice.GetDataList('GetAccountsProjects', 'projectName', 'id').then(result => {
            if (isEdit) {
                let id = this.props.document.boqId;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value == id })
                    this.setState({ selectedProject: selectedValue });
                }
            }
            this.setState({ projectData: [...result] });
        });

        //fill Expenses Type Drop
        dataservice.GetDataList('GetaccountsDefaultlistTypesNotAction?listType=expensestype&action=1', 'title', 'id').then(result => {
            if (isEdit) {
                let id = this.props.document.boqId;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value == id })
                    this.setState({ selectedExpensesType: selectedValue });
                }
            }
            this.setState({ expensesTypeData: [...result] });
        });

    }

    subscribeProject = (projectId, isEdit) => {
        //fill Peety Cash Drop
        dataservice.GetDataList('GetPeetyCashForDrop?projectId=' + projectId, 'subject', 'id').then(result => {
            if (isEdit) {
                let id = this.props.document.boqId;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value == id })
                    this.setState({ selectedPettyCash: selectedValue });
                }
            }
            this.setState({
                pettyCashData: [...result],
                selectedPettyCash: { label: Resources.peetyCash[currentLanguage], value: "0" }
            });
        });

        //fill Boq Drop
        dataservice.GetDataListWithNewVersion('GetContractsBoq?projectId=' + projectId + '&pageNumber=0&pageSize=1000000000', 'subject', 'id').then(result => {
            if (isEdit) {
                let id = this.props.document.boqId;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value == id })
                    this.setState({ selectedBoq: selectedValue });
                }
            }
            this.setState({
                boqData: [...result],
                selectedBoq: { label: Resources.selectBoq[currentLanguage], value: "0" },
                selectedBoqItem: { label: Resources.boqItemSelection[currentLanguage], value: "0" }
            });
        });
    }

    subscribeBoq(boqId, isEdit) {
        //fill boq Item Drop
        dataservice.GetDataList('getContractsBoqItemsForDrop?boqId=' + boqId, 'details', 'id').then(result => {
            if (isEdit) {
                let id = this.props.document.boqId;
                let selectedValue = {};
                if (id) {
                    selectedValue = _.find(result, function (i) { return i.value == id })
                    this.setState({ selectedBoqItem: selectedValue });
                }
            }
            this.setState({
                boqItemData: [...result],
                selectedBoqItem: { label: Resources.boqItemSelection[currentLanguage], value: "0" }
            });
        });
    }


    static getDerivedStateFromProps(props, state) {

    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrentStep: stepNo });
    };

    ShowCostTree = () => {
        this.setState({ ShowTree: true });
    }

    dropsHandleChange(value, name, selectedValue) {
        switch (name) {
            case 'projectId':
                this.subscribeProject(value.value, false);
                break;

            case 'boqId':
                this.subscribeBoq(value.value, false);
                break;

            default:
                break;
        }
        this.setState({ [selectedValue]: value });
    }

    GetNodeData = (item) => {
        this.setState({
            costCodingTreeName: item.codeTreeTitle
        });
    }
    save(values, resetForm) {
        this.setState({ Loading: true });
        let obj = values
        values.projectId = this.state.selectedProject.value
        values.expenseTypeId = this.state.selectedExpensesType.value
        values.boqId = this.state.selectedBoq.value
        values.boqItemId = this.state.selectedBoqItem.value
        values.peetyCashId = this.state.selectedPettyCash.value
        values.peetyCashId = this.state.selectedPettyCash.value
        values.arrange = this.state.arrange;
        values.refCode = this.state.refCode;
        values.costCodingTreeName = this.state.costCodingTreeName;
        dataservice.addObject('AddExpensesUser', obj).then(
            result => {
                this.setState({ Loading: false });
                resetForm();
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
                this.changeCurrentStep(1);
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            })
    }
    render() {

        let stepOne = () => {
            return (
                <div className="document-fields">
                    {this.state.Loading ? <LoadingSection /> : null}
                    <Formik initialValues={{
                        arrange: '',
                        refCode: '',
                        projectId: '',
                        expenseTypeId: '',
                        description: '',
                        subject: '',
                        boqId: '',
                        boqItemId: '',
                        expenseValue: 0,
                        costCodingTreeName: '',
                        unitRate: 0,
                        docDate: moment().format("YYYY-MM-DD"),
                        hasParent: false,
                        peetyCashId: '',
                    }}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => { this.save(values, resetForm) }}>
                        {({ errors, values, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="QsForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className="proForm first-proform">
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                            <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                placeholder={Resources.subject[currentLanguage]} value={values.subject} autoComplete='off'
                                                onChange={handleChange} onBlur={handleBlur} />
                                            {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                        </div>
                                    </div>

                                </div>

                                <div className="proForm datepickerContainer">

                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker title='docDate' startDate={values.docDate}
                                            handleChange={e => setFieldValue('docDate', e)} />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="Projects" data={this.state.projectData} selectedValue={this.state.selectedProject}
                                            handleChange={event => this.dropsHandleChange(event, "projectId", "selectedProject")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.projectId}
                                            touched={touched.projectId} index="projectId" name="projectId" id="projectId" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="peetyCash" data={this.state.pettyCashData} selectedValue={this.state.selectedPettyCash}
                                            handleChange={event => this.dropsHandleChange(event, "peetyCashId", "selectedPettyCash")}
                                            index="peetyCashId" name="peetyCashId" id="peetyCashId" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="expensesType" data={this.state.expensesTypeData} selectedValue={this.state.selectedExpensesType}
                                            handleChange={event => this.dropsHandleChange(event, "expenseTypeId", "selectedExpensesType")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.expenseTypeId}
                                            touched={touched.expenseTypeId} index="expenseTypeId" name="expenseTypeId" id="expenseTypeId" />
                                    </div>

                                    <div className="linebylineInput valid-input fullInputWidth">
                                        <label className="control-label">{Resources['description'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.description ? 'has-error' : !errors.description && touched.description ? (" has-success") : " ")}>
                                            <input className="form-control" name='description' id='description'
                                                placeholder={Resources['description'][currentLanguage]} value={values.description}
                                                onChange={handleChange} onBlur={handleBlur} />
                                            {errors.description ? (<em className="pError">{errors.description}</em>) : null}
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="boq" data={this.state.boqData} selectedValue={this.state.selectedBoq}
                                            handleChange={event => this.dropsHandleChange(event, "boqId", "selectedBoq")}
                                            index="boqId" name="boqId" id="boqId" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.costCoding[currentLanguage]}</label>
                                        <div className="shareLinks">
                                            <div className="inputDev ui input">
                                                <input type="text" className="form-control"
                                                    value={this.state.costCodingTreeName} name="costCodingTreeName"
                                                    placeholder={Resources.costCoding[currentLanguage]} />
                                            </div>
                                            <div style={{ marginLeft: '8px' }} onClick={e => this.ShowCostTree()}>
                                                <span className="collapseIcon"><span className="plusSpan greenSpan">+</span>
                                                    <span>{Resources.add[currentLanguage]}</span>  </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="boqItem" data={this.state.boqItemData} selectedValue={this.state.selectedBoqItem}
                                            handleChange={event => this.dropsHandleChange(event, "boqItemId", "selectedBoqItem")}
                                            index="boqItemId" name="boqItemId" id="boqItemId" />
                                    </div>

                                    <div className="linebylineInput valid-input fullInputWidth">
                                        <label className="control-label">{Resources['unitPrice'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.unitRate ? 'has-error' : !errors.unitRate && touched.unitRate ? (" has-success") : " ")}>
                                            <input className="form-control" name='unitRate'
                                                placeholder={Resources['unitPrice'][currentLanguage]}
                                                value={values.unitRate} onChange={handleChange} onBlur={handleBlur} />
                                            {errors.unitRate ? (<em className="pError">{errors.unitRate}</em>) : null}
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input fullInputWidth">
                                        <label className="control-label">{Resources['quantity'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.expenseValue ? 'has-error' : !errors.expenseValue && touched.expenseValue ? (" has-success") : " ")}>
                                            <input className="form-control" name='expenseValue'
                                                placeholder={Resources['quantity'][currentLanguage]} value={values.expenseValue}
                                                onChange={handleChange} onBlur={handleBlur} />
                                            {errors.expenseValue ? (<em className="pError">{errors.expenseValue}</em>) : null}
                                        </div>
                                    </div>

                                </div>

                                {/* {this.props.changeStatus === true ?
                                                <div className="approveDocument">
                                                    <div className="approveDocumentBTNS">
                                                        {this.state.isLoading ?
                                                            <button className="primaryBtn-1 btn disabled">
                                                                <div className="spinner">
                                                                    <div className="bounce1" />
                                                                    <div className="bounce2" />
                                                                    <div className="bounce3" />
                                                                </div>
                                                            </button> :
                                                            <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} type="submit">{Resources.save[currentLanguage]}</button>
                                                        }
                                                        <DocumentActions
                                                            isApproveMode={this.state.isApproveMode}
                                                            docTypeId={this.state.docTypeId}
                                                            docId={this.state.docId}
                                                            projectId={this.state.projectId}
                                                            previousRoute={this.state.previousRoute}
                                                            docApprovalId={this.state.docApprovalId}
                                                            currentArrange={this.state.arrange}
                                                            showModal={this.props.showModal}
                                                            showOptionPanel={this.showOptionPanel}
                                                            permission={this.state.permission}
                                                        />
                                                    </div>
                                                </div>
                                                : null} */}

                                {/* <div className="doc-pre-cycle letterFullWidth">
                                                <div>
                                                    {this.state.docId > 0 ?
                                                        <UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={899} EditAttachments={3264} ShowDropBox={3587}
                                                            ShowGoogleDrive={3588} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                        : null}
                                                    {this.viewAttachments()}
                                                    {this.props.changeStatus === true ?
                                                        <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                        : null}
                                                </div>
                                            </div> */}

                                <div className="slider-Btns">
                                    {this.state.isLoading ?
                                        <button className="primaryBtn-1 btn disabled">
                                            <div className="spinner">
                                                <div className="bounce1" />
                                                <div className="bounce2" />
                                                <div className="bounce3" />
                                            </div>
                                        </button>
                                        : <button className="primaryBtn-1 btn mediumBtn" type="submit" >{Resources.next[currentLanguage]}</button>}
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <div className="skyLight__form">
                        <SkyLightStateless onOverlayClicked={e => this.setState({ ShowTree: false })}
                            title={Resources['add'][currentLanguage]}
                            onCloseClicked={e => this.setState({ ShowTree: false })} isVisible={this.state.ShowTree}>
                            {this.state.ShowTree ?
                                <Tree isExpenses={true} projectid={this.state.selectedProject.value} GetNodeData={this.GetNodeData} />
                                : null}
                            <div className="fullWidthWrapper">
                                <button className="primaryBtn-1 btn meduimBtn" onClick={e => this.setState({ ShowTree: false })}  >{Resources.add[currentLanguage]}</button>
                            </div>
                        </SkyLightStateless>
                    </div>

                </div >
            )
        }

        let stepTwo = () => {
            return (
                <div className="document-fields">
                    {this.state.Loading ? <LoadingSection /> : null}
                    <Formik initialValues={{
                        arrange: '',
                        refCode: '',
                        projectId: '',
                        expenseTypeId: '',
                        description: '',
                        subject: '',
                        boqId: '',
                        boqItemId: '',
                        expenseValue: 0,
                        costCodingTreeName: '',
                        unitRate: 0,
                        docDate: moment().format("YYYY-MM-DD"),
                        hasParent: false,
                        peetyCashId: '',
                    }}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => { this.save(values, resetForm) }}>
                        {({ errors, values, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="QsForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className="proForm datepickerContainer">


                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="expensesType" data={this.state.expensesTypeData} selectedValue={this.state.selectedExpensesType}
                                            handleChange={event => this.dropsHandleChange(event, "expenseTypeId", "selectedExpensesType")}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.expenseTypeId}
                                            touched={touched.expenseTypeId} index="expenseTypeId" name="expenseTypeId" id="expenseTypeId" />
                                    </div>

                                    <div className="linebylineInput valid-input fullInputWidth">
                                        <label className="control-label">{Resources['description'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.description ? 'has-error' : !errors.description && touched.description ? (" has-success") : " ")}>
                                            <input className="form-control" name='description'
                                                placeholder={Resources['description'][currentLanguage]} value={values.description}
                                                onChange={handleChange} onBlur={handleBlur} />
                                            {errors.description ? (<em className="pError">{errors.description}</em>) : null}
                                        </div>
                                    </div>


                                    <div className="linebylineInput valid-input fullInputWidth">
                                        <label className="control-label">{Resources['unitPrice'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.unitRate ? 'has-error' : !errors.unitRate && touched.unitRate ? (" has-success") : " ")}>
                                            <input className="form-control" name='unitRate'
                                                placeholder={Resources['unitPrice'][currentLanguage]}
                                                value={values.unitRate} onChange={handleChange} onBlur={handleBlur} />
                                            {errors.unitRate ? (<em className="pError">{errors.unitRate}</em>) : null}
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input fullInputWidth">
                                        <label className="control-label">{Resources['quantity'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.expenseValue ? 'has-error' : !errors.expenseValue && touched.expenseValue ? (" has-success") : " ")}>
                                            <input className="form-control" name='expenseValue'
                                                placeholder={Resources['quantity'][currentLanguage]} value={values.expenseValue}
                                                onChange={handleChange} onBlur={handleBlur} />
                                            {errors.expenseValue ? (<em className="pError">{errors.expenseValue}</em>) : null}
                                        </div>
                                    </div>
                                </div>

                                <div className="slider-Btns">
                                    {this.state.isLoading ?
                                        <button className="primaryBtn-1 btn disabled">
                                            <div className="spinner">
                                                <div className="bounce1" />
                                                <div className="bounce2" />
                                                <div className="bounce3" />
                                            </div>
                                        </button>
                                        : <button className="primaryBtn-1 btn mediumBtn" type="submit" >{Resources.next[currentLanguage]}</button>}
                                </div>
                            </Form>
                        )}
                    </Formik>

                </div >
            )
        }


        return (
            <div className="mainContainer main__fulldash" >
                < div className="documents-stepper noTabs__document one__tab one_step" >
                    <div className="submittalHead">
                        <h2 className="zero">{Resources['expenses'][currentLanguage] + ' - ' + Resources['add'][currentLanguage]}</h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                    <g id="Group">
                                                        <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                        <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z"
                                                            id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div className="doc-container">

                        <div className="step-content">
                            {this.state.CurrentStep === 2 ?
                                <Fragment>{stepOne()}</Fragment>
                                : <Fragment>{stepTwo()}</Fragment>}
                        </div>



                        <Fragment>
                            <Steps steps_defination={steps_defination}
                                exist_link="/dailyReports/" docId={100}
                                changeCurrentStep={stepNo => this.changeCurrentStep(stepNo)}
                                stepNo={this.state.CurrentStep} changeStatus={true} />
                        </Fragment>

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
                </div >
            </div >

        )
    }
}
export default ExpensesUserAddEdit;
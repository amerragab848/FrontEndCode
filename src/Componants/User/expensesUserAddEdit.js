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
// import 'react-table/react-table.css'
import UploadExpensesAttachment from "../OptionsPanels/UploadExpensesAttachment";
import Dropdown from "../OptionsPanels/DropdownMelcous";
import DatePicker from "../OptionsPanels/DatePicker";
import ConfirmationModal from "../publicComponants/ConfirmationModal";
import Steps from "../publicComponants/Steps";
import moment from "moment";
import { SkyLightStateless } from "react-skylight";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import * as AdminstrationActions from '../../store/actions/Adminstration';
import { bindActionCreators } from 'redux';
import SendToExpensesWorkFlow from './sendToExpensesWorkFlow';
import ViewExpensesWF from './viewExpensesWF';
import ExpensesWFApproval from './expensesWFApproval';
import CryptoJS from "crypto-js";
//UploadExpensesAttachment
var steps_defination = [];
steps_defination = [
    { name: "expenses", callBackFn: null },
    { name: "items", callBackFn: null }
];

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const find = require('lodash/find');

let selectedRows = [];

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    projectId: Yup.string().required(Resources['projectSelection'][currentLanguage]),
    expenseTypeId: Yup.string().required(Resources['expensesTypeRequired'][currentLanguage]),
    unitRate: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
    expenseValue: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
});

const itemValidationSchema = Yup.object().shape({
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    expenseTypeId: Yup.string().required(Resources['expensesTypeRequired'][currentLanguage]),
    unitRate: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
    expenseValue: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
});

const itemValidationSchemaEdit = Yup.object().shape({
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage]),
    expenseTypeId: Yup.string().required(Resources['expensesTypeRequired'][currentLanguage]),
    unitRate: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
    expenseValue: Yup.number().typeError(Resources['onlyNumbers'][currentLanguage]),
});

class ExpensesUserAddEdit extends Component {

    constructor(props) {
        super(props);
        const query = new URLSearchParams(this.props.location.search);
        let index = 0;
        let approvalData = {};
        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(
                        CryptoJS.enc.Base64.parse(param[1]).toString(
                            CryptoJS.enc.Utf8
                        )
                    );
                    approvalData = obj
                } catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            id: approvalData.id,
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
            Loading: true,
            parentData: {},
            selectedExpensesTypeItem: { label: Resources.expensesTypeRequired[currentLanguage], value: "0" },
            selected: {},
            showDeleteModal: false,
            showEditModal: false,
            itemEdit: {},
            selectedExpensesTypeItemEdit: {},
            itemData: [],
            isEdit: approvalData.id !== 0 ? true : false,
            showWFModal: false,
            viewWorkFlow: false,
            showApproval: false,
            approvalData: approvalData,
            workFlowData: [],
        }

    }

    componentDidMount() {
        if (this.state.id > 0) {
            // get document in edit 
            dataservice.GetRowById('GetExpensesUserForEdit?id=' + this.state.id).then(
                result => {
                    this.setState({ isEdit: true, itemEdit: result, parentData: result });
                    this.fillDropDowns(true);
                });
            //check if this doc have workflow or no 
            dataservice.GetDataGrid('GetExpensesWorkFlowSigntureByExpensesId?expensesId=' + this.state.id).then(
                result => {
                    if (result.length) {
                        this.setState({ viewWorkFlow: true, workFlowData: result });
                    }
                }
            )
            this.getItems();
        }
        else {
            this.getNextArrange();
            this.setState({ isEdit: false });
            this.fillDropDowns(false);
        }
    }

    // get next arrange in add mood and generate arrange and ref code
    getNextArrange() {
        dataservice.GetRowById('GetNextArrangeExpenses').then(
            res => {
                let arrange = res.split('/')[1];
                this.setState({ refCode: res, arrange })
            }
        )
    }

    // fill item table
    getItems() {
        dataservice.GetDataGrid('GetExpensesItemsByParentId?parentId=' + this.state.id).then(
            result => {
                this.setState({ itemData: result });
            }
        )
    }

    // fill drop downs in add and edit moood 
    fillDropDowns(isEdit) {

        //fill Projects Drop
        dataservice.GetDataList('GetAccountsProjects', 'projectName', 'id').then(result => {
            if (isEdit) {
                let id = this.state.itemEdit.projectId;
                let selectedValue = {};
                if (id) {
                    selectedValue = find(result, function (i) { return i.value == id });
                    this.setState({ selectedProject: selectedValue });
                    this.subscribeProject(id, true);
                }
            }

            this.setState({ projectData: [...result] });
        });

        //fill Expenses Type Drop
        dataservice.GetDataList('GetaccountsDefaultlistTypesNotAction?listType=expensestype&action=1', 'title', 'id').then(result => {
            if (isEdit) {
                let id = this.state.itemEdit.expenseTypeId;
                let selectedValue = {};
                if (id) {
                    selectedValue = find(result, function (i) { return i.value == id })
                    this.setState({ selectedExpensesType: selectedValue });
                }
            }

            this.setState({ expensesTypeData: [...result], Loading: false });
        });

    }

    // fill peety cash drop and boq when select project 
    subscribeProject = (projectId, isEdit) => {
        //fill Peety Cash Drop
        dataservice.GetDataList('GetPeetyCashForDrop?projectId=' + projectId, 'subject', 'id').then(result => {
            if (isEdit) {
                let id = this.state.itemEdit.peetyCashId;
                let selectedValue = {};
                if (id) {
                    selectedValue = find(result, function (i) { return i.value == id })
                    this.setState({ selectedPettyCash: selectedValue });
                }
            }
            else {
                this.setState({ selectedPettyCash: { label: Resources.peetyCash[currentLanguage], value: "0" } });
            }
            this.setState({ pettyCashData: [...result], });
        });

        //fill Boq Drop
        dataservice.GetDataListWithNewVersion('GetContractsBoq?projectId=' + projectId + '&pageNumber=0&pageSize=1000000000', 'subject', 'id').then(result => {
            if (isEdit) {
                let id = this.state.itemEdit.boqId;
                let selectedValue = {};
                if (id) {
                    selectedValue = find(result, function (i) { return i.value == id })
                    this.setState({ selectedBoq: selectedValue });
                    this.subscribeBoq(id, true)
                }
            }
            else {
                this.setState({
                    selectedBoqItem: { label: Resources.boqItemSelection[currentLanguage], value: "0" },
                    selectedBoq: { label: Resources.selectBoq[currentLanguage], value: "0" },
                });
            }
            this.setState({ boqData: [...result], });
        });
    }

    //fill boq item drop when select boq 
    subscribeBoq(boqId, isEdit) {
        //fill boq Item Drop
        dataservice.GetDataList('getContractsBoqItemsForDrop?boqId=' + boqId, 'details', 'id').then(result => {
            if (isEdit) {
                let id = this.state.itemEdit.boqItemId;
                let selectedValue = {};
                if (id) {
                    selectedValue = find(result, function (i) { return i.value == id })
                    this.setState({ selectedBoqItem: selectedValue });
                }
            }
            else {
                this.setState({ selectedBoqItem: { label: Resources.boqItemSelection[currentLanguage], value: "0" } });
            }
            this.setState({ boqItemData: [...result], Loading: false });
        });
    }

    // in items table select in unselecte rows 
    toggleRow(obj) {
        const newSelected = Object.assign({}, this.state.selected);

        newSelected[obj.id] = !this.state.selected[obj.id];

        let setIndex = selectedRows.findIndex(x => x.id === obj.id);

        if (setIndex > -1) {
            selectedRows.splice(setIndex, 1);
        } else {
            selectedRows.push(obj);
        }

        this.setState({
            selected: newSelected
        });

    }

    // change step and moved
    changeCurrentStep = stepNo => {
        this.setState({ CurrentStep: stepNo });
    };

    // show cost tree popup 
    ShowCostTree = () => {
        this.setState({ ShowTree: true });
    }

    //drop down events
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

    // set cost tree name when select it 
    GetNodeData = (item) => {
        this.setState({
            costCodingTreeName: item.codeTreeTitle
        });
    }

    // set expenses value in tab 1 to save 
    setExpenseValues(values) {
        let obj = values
        values.projectId = this.state.selectedProject.value;
        values.expenseTypeId = this.state.selectedExpensesType.value;
        values.boqId = this.state.selectedBoq.value === "0" ? undefined : this.state.selectedBoq.value;
        values.boqItemId = this.state.selectedBoqItem.value === "0" ? undefined : this.state.selectedBoqItem.value;
        values.peetyCashId = this.state.selectedPettyCash.value === "0" ? undefined : this.state.selectedPettyCash.value;
        values.arrange = this.state.arrange;
        values.refCode = this.state.refCode;
        values.costCodingTreeName = this.state.costCodingTreeName;
        return obj;
    }

    //add expense in tab 1
    save(values) {
        this.setState({ Loading: true });
        let obj = this.setExpenseValues(values);
        dataservice.addObject('AddExpensesUser', obj).then(
            result => {
                let parentData = obj
                parentData.id = result.id
                parentData.parentId = result.parentId
                this.setState({ Loading: false, parent: obj.subject, parentData, id: obj.id });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
                this.changeCurrentStep(1);
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            });
    }

    setItemValues(values) {
        let obj = values
        values.projectId = this.state.parentData.projectId;
        values.expenseTypeId = this.state.selectedExpensesTypeItem.value;
        values.boqId = this.state.parentData.boqId;
        values.boqItemId = this.state.parentData.boqItemId;
        values.peetyCashId = this.state.parentData.peetyCashId;
        values.arrange = this.state.parentData.arrange;
        values.refCode = this.state.parentData.refCode;
        values.costCodingTreeName = this.state.parentData.costCodingTreeName;
        values.parentId = this.state.isEdit ? this.state.id : this.state.parentData.parentId;
        values.docDate = this.state.parentData.docDate;
        values.id = this.state.parentData.id;
        values.subject = this.state.parentData.subject;
        return obj;
    }
    // set expenses item values in tab 2 to save 
    saveItem(values, resetForm) {
        this.setState({ Loading: true });
        let obj = this.setItemValues(values);
        dataservice.addObject('AddExpensesUser', obj).then(

            result => {
                let data = this.state.itemData
                data.push(result);
                values.expenseTypeId = '';
                values.description = '';
                values.expenseValue = 0;
                values.unitRate = 0;
                this.setState({ Loading: false, itemData: data, selectedExpensesTypeItem: { label: Resources.expensesTypeRequired[currentLanguage], value: "0" } });
                //resetForm();

                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            });
    }

    //in items table row click event  
    viewEditModel(data, type) {
        if (type != "checkbox") {
            if (data) {
                this.setState({
                    showEditModal: true, itemEdit: data,
                    selectedExpensesTypeItemEdit: { label: data.expenseTypeName, value: data.expenseTypeId }
                });
            }
        }
    }

    //delete item from item table
    deleteItem = () => {
        this.setState({ Loading: true });
        let ids = selectedRows.map(rows => rows.id);
        dataservice.addObject('DeleteExpensesUserItemMultiple', ids).then(
            result => {
                let itemData = this.state.itemData;
                selectedRows.forEach(item => {
                    let getIndex = itemData.findIndex(x => x.id === item.id);
                    itemData.splice(getIndex, 1);
                });
                selectedRows = [];
                this.setState({ Loading: false, itemData, showDeleteModal: false });
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            });
    }
    //save edit item
    editItem(values, resetForm) {
        this.setState({ Loading: true });
        let obj = values
        values.expenseTypeId = this.state.selectedExpensesTypeItemEdit.value
        dataservice.addObject('EditExpensesItems', obj).then(
            result => {
                let data = this.state.itemData
                let index = data.findIndex(i => i.id === obj.id);
                data[index] = result;
                this.setState({ Loading: false, itemData: data, showEditModal: false });
                resetForm();
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            });
    }
    //view workflow cycles
    viewWorkFlow() {
        this.setState({ Loading: true });
        setTimeout(() => {
            this.setState({ Loading: false, viewWorkFlow: true });
        }, 1000);
    }

    render() {

        let stepOne = () => {
            return (
                <div className="document-fields">
                    {this.state.Loading ? <LoadingSection /> :
                        <Fragment>
                            <Formik initialValues={{
                                arrange: '',
                                refCode: '',
                                projectId: '',
                                expenseTypeId: '',
                                description: this.state.isEdit ? this.state.itemEdit.description : '',
                                subject: this.state.isEdit ? this.state.itemEdit.subject : '',
                                boqId: '',
                                boqItemId: '',
                                expenseValue: this.state.isEdit ? this.state.itemEdit.expenseValue : 0,
                                costCodingTreeName: this.state.isEdit ? this.state.itemEdit.costCodingTreeName : '',
                                unitRate: this.state.isEdit ? this.state.itemEdit.unitRate : 0,
                                docDate: this.state.isEdit ? moment(this.state.itemEdit.docDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
                                hasParent: false,
                                peetyCashId: '',
                            }}
                                enableReinitialize={true}
                                validationSchema={validationSchema}
                                onSubmit={(values) => { this.save(values) }}>
                                {({ errors, values, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                    <Form id="QsForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                        {this.state.isEdit ? null :
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
                                        }
                                        <div className={"proForm datepickerContainer" + (this.state.isEdit ? ' readOnly_inputs' : '')}>

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
                                                <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.description && touched.description ? (" has-error") : !errors.description && touched.description ? (" has-success") : " ")} >
                                                    <input name='description' className="form-control fsadfsadsa" id="description"
                                                        placeholder={Resources.description[currentLanguage]} value={values.description} autoComplete='off'
                                                        onChange={handleChange} onBlur={handleBlur} />
                                                    {touched.description ? (<em className="pError">{errors.description}</em>) : null}
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

                                            {this.state.isEdit ?
                                                <div className="linebylineInput valid-input fullInputWidth">
                                                    <label className="control-label">{Resources['total'][currentLanguage]} </label>
                                                    <div className="inputDev ui input ">
                                                        <input className="form-control" name='expenseValue'
                                                            placeholder={Resources['total'][currentLanguage]} value={this.state.itemEdit.total}
                                                        />
                                                    </div>
                                                </div>
                                                : null
                                            }
                                        </div>
                                            {this.state.isEdit ? null :
                                                <div className="doc-pre-cycle letterFullWidth">
                                                    <UploadExpensesAttachment changeStatus={false}/>
                                                </div>}
                                        <div className="slider-Btns">
                                            {this.state.isLoading ?
                                                <button className="primaryBtn-1 btn disabled">
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button>
                                                :
                                                this.state.isEdit ? <button className="primaryBtn-1 btn mediumBtn" type="button" onClick={() => this.changeCurrentStep(1)} >
                                                    {Resources.next[currentLanguage]}</button> :
                                                    <button className="primaryBtn-1 btn mediumBtn" type="submit" >{Resources.save[currentLanguage]}</button>
                                            }
                                        </div>
                                    </Form>
                                )}
                            </Formik>

                            {/* show work flow when in edit mood  */}
                            {this.state.showWFModal ?
                                <SendToExpensesWorkFlow expenseId={this.state.id} subject={this.state.itemEdit.description}
                                    expenseTypeId={this.state.itemEdit.expenseTypeId} showModal={this.state.showWFModal}
                                    viewWorkFlow={() => this.viewWorkFlow}
                                    closeModal={e => this.setState({ showWFModal: false })}
                                /> : null}

                            {this.state.viewWorkFlow || this.props.Adminstration.showExpensesWF ? <ViewExpensesWF expensesId={this.state.id} workFlowData={this.state.workFlowData} /> : null}

                            {/* show Expenses WF Approval wheen route from pennding expenses */}
                            {this.state.showApproval ?
                                <ExpensesWFApproval showApproval={this.state.showApproval}
                                    approvalData={this.state.approvalData} approvalStatus={this.state.approvalStatus} closeModal={e => this.setState({ showApproval: false })}
                                />
                                : null}
                            {/* show cost tree */}
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

                        </Fragment>
                    }
                </div >

            )
        }

        let stepTwo = () => {

            const columns = [
                {
                    Header: Resources["select"][currentLanguage],
                    id: "checkbox",
                    accessor: "id",
                    Cell: ({ row }) => {
                        return (
                            <div className="ui checked checkbox  checkBoxGray300 ">
                                <input type="checkbox" className="checkbox" checked={this.state.selected[row._original.id] === true} onChange={() => this.toggleRow(row._original)} />
                                <label />
                            </div>
                        );
                    },
                    width: 70
                },
                {
                    Header: Resources["description"][currentLanguage],
                    accessor: "description",
                    sortabel: true,
                    width: 400
                },
                {
                    Header: Resources["projectName"][currentLanguage],
                    accessor: "projectName",
                    width: 300,
                    sortabel: true
                },
                {
                    Header: Resources["expensesType"][currentLanguage],
                    accessor: "expenseTypeName",
                    width: 350,
                    sortabel: true
                }, {
                    Header: Resources["expenses"][currentLanguage],
                    accessor: "total",
                    width: 150,
                    sortabel: true
                }
            ];

            return (
                <div className="document-fields">
                    {this.state.Loading ? <LoadingSection /> : null}
                    <Formik initialValues={{
                        expenseTypeId: '',
                        description: '',
                        expenseValue: 0,
                        unitRate: 0,
                        hasParent: true,
                    }}
                        enableReinitialize={true}
                        validationSchema={itemValidationSchema}
                        onSubmit={(values, { resetForm }) => { this.saveItem(values, resetForm) }}>
                        {({ errors, values, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="QsForm2" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className={"proForm datepickerContainer" + (this.state.viewWorkFlow ? ' readOnly_inputs' : '')}>

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="expensesType" data={this.state.expensesTypeData} selectedValue={this.state.selectedExpensesTypeItem}
                                            handleChange={e => this.setState({ selectedExpensesTypeItem: e })}
                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.expenseTypeId}
                                            touched={touched.expenseTypeId} index="expenseTypeId" name="expenseTypeId" id="expenseTypeId" />
                                    </div>

                                    <div className="linebylineInput valid-input fullInputWidth">

                                        <label className="control-label">{Resources.description[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.description && touched.description ? (" has-error") : !errors.description && touched.description ? (" has-success") : " ")} >
                                            <input name='description' className="form-control fsadfsadsa" id="description"
                                                placeholder={Resources.description[currentLanguage]} value={values.description} autoComplete='off'
                                                onChange={handleChange} onBlur={handleBlur} />
                                            {touched.description ? (<em className="pError">{errors.description}</em>) : null}
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
                                        : <button className={"primaryBtn-1 btn mediumBtn " + (this.state.viewWorkFlow ? 'disabled' : '')} type="submit" >{Resources.save[currentLanguage]}</button>}
                                </div>

                            </Form>
                        )}
                    </Formik>

                    <div className={"precycle-grid"} >
                        <header className="main__header">
                            <div className="main__header--div">
                                <h2 className="zero"> {Resources["items"][currentLanguage]}</h2>
                            </div>
                        </header>

                        <div className="reactTableActions" style={{ pointerEvents: this.state.viewWorkFlow ? 'none' : 'unset' }}>

                            {selectedRows.length > 0 ? (
                                <div className={"gridSystemSelected " + (selectedRows.length > 0 ? " active" : "")} >
                                    <div className="tableselcted-items">
                                        <span id="count-checked-checkboxes">
                                            {selectedRows.length}
                                        </span>
                                        <span>Selected</span>
                                    </div>
                                    <div className="tableSelctedBTNs">
                                        <button className="defaultBtn btn smallBtn" onClick={() => this.setState({ showDeleteModal: true })}>
                                            {Resources["delete"][currentLanguage]}
                                        </button>
                                    </div>
                                </div>
                            ) : null}

                            <ReactTable data={this.state.itemData} columns={columns} defaultPageSize={5} noDataText={Resources["noData"][currentLanguage]}
                                className="-striped -highlight"
                                getTrProps={(state, rowInfo, column, instance) => {
                                    return { onClick: e => { this.viewEditModel(rowInfo.original, e.target.type); } };
                                }} />

                        </div>

                        <div className="slider-Btns">
                            <button className="primaryBtn-1 btn mediumBtn" type="button" onClick={() => {
                                this.props.actions.userSettingsTabIndex(1)
                                this.changeCurrentStep(2)
                            }}>{Resources.next[currentLanguage]}
                            </button>
                        </div>

                    </div>

                </div >
            )
        }

        let editModal = () => {
            return (
                <div className="document-fields">
                    {this.state.Loading ? <LoadingSection /> : null}
                    <Formik initialValues={{
                        id: this.state.itemEdit.id,
                        expenseTypeId: this.state.itemEdit.expenseTypeId,
                        description: this.state.itemEdit.description,
                        expenseValue: this.state.itemEdit.quantity,
                        unitRate: this.state.itemEdit.unitPrice,
                    }}
                        enableReinitialize={true}
                        validationSchema={itemValidationSchemaEdit}
                        onSubmit={(values, { resetForm }) => { this.editItem(values, resetForm) }}>
                        {({ errors, values, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="QsForm2" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                <div className="proForm datepickerContainer">

                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="expensesType" data={this.state.expensesTypeData} selectedValue={this.state.selectedExpensesTypeItemEdit}
                                            handleChange={e => this.setState({ selectedExpensesTypeItemEdit: e })}
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
                                        : <button className="primaryBtn-1 btn mediumBtn" type="submit" >{Resources.save[currentLanguage]}</button>}
                                </div>

                            </Form>
                        )}
                    </Formik>
                </div >
            )
        }

        return (
            <div className="mainContainer main__fulldash" >

                <div className="documents-stepper noTabs__document one__tab one_step" >

                    <div className="submittalHead">
                        <h2 className="zero">{Resources['expenses'][currentLanguage] + ' - ' + Resources[this.state.isEdit ? 'editTitle' : 'add'][currentLanguage]}</h2>
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

                        <div className="skyLight__form">
                            <SkyLightStateless onOverlayClicked={e => this.setState({ showEditModal: false, itemEdit: false })}
                                title={Resources['editTitle'][currentLanguage]}
                                onCloseClicked={e => this.setState({ showEditModal: false, itemEdit: {} })} isVisible={this.state.showEditModal}>
                                {this.state.showEditModal ? <Fragment>{editModal()}</Fragment> : null}

                            </SkyLightStateless>
                        </div>

                        <div className="step-content">
                            {this.state.CurrentStep === 0 ? <Fragment>{stepOne()}</Fragment> : <Fragment>{stepTwo()}</Fragment>}
                        </div>

                        <Fragment>
                            <Steps steps_defination={steps_defination}
                                exist_link="/ProfileSetting/" docId={this.state.id}
                                changeCurrentStep={stepNo => this.changeCurrentStep(stepNo)}
                                stepNo={this.state.CurrentStep} changeStatus={this.state.id === 0 ? false : true} isEdit={this.state.isEdit} />
                        </Fragment>

                    </div>

                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources["smartDeleteMessage"][currentLanguage].content}
                            closed={e => this.setState({ showDeleteModal: false })}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={e => this.setState({ showDeleteModal: false })}
                            buttonName="delete" clickHandlerContinue={this.deleteItem} />
                    ) : null}
                </div >

                {this.state.isEdit ?
                    <div className="approveDocument">
                        <div className="approveDocumentBTNS">
                            {this.state.approvalData.transactionId === undefined ? null : <Fragment>
                                <button className="primaryBtn-1 btn middle__btn" onClick={e => this.setState({ showApproval: true, approvalStatus: true })}>{Resources["approvalModalApprove"][currentLanguage]}</button>
                                <button type="button" className="primaryBtn-2 btn middle__btn" onClick={e => this.setState({ showApproval: true, approvalStatus: false })} >{Resources["reject"][currentLanguage]}</button>
                            </Fragment>}
                            <button className="primaryBtn-2 btn mediumBtn" type="button" onClick={e => this.setState({ showWFModal: true, viewWorkFlow: false })} >To Workflow</button>
                        </div>
                    </div>
                    : null}

            </div >
        )
    }
}

const mapStateToProps = (state) => {

    let sState = state;
    return sState;
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AdminstrationActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExpensesUserAddEdit));
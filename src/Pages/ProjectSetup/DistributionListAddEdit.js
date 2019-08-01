import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import GridSetup from "../Communication/GridSetup";
import Config from "../../Services/Config";
import { toast } from "react-toastify";
import Resources from "../../resources.json";
import Api from '../../api';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice"
import * as communicationActions from '../../store/actions/communication';
import DropdownMelcous from '../../Componants/OptionsPanels/DropdownMelcous';
import DatePicker from '../../Componants/OptionsPanels/DatePicker';
import SkyLight from 'react-skylight';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import Recycle from '../../Styles/images/attacheRecycle.png';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument';
import Steps from "../../Componants/publicComponants/Steps";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const _ = require('lodash')
let MaxArrange = 1

const ValidtionSchemaForDis_List = Yup.object().shape({
    ArrangeTaskGroups: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    Subject: Yup.string()
        .required(Resources['subjectRequired'][currentLanguage]),
})

const ValidtionSchemaForContact = Yup.object().shape({
    ArrangeContact: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    Company: Yup.string()
        .required(Resources['toCompanyRequired'][currentLanguage])
        .nullable(true),
    ContactName: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage])
        .nullable(false),
});

var steps_defination = [];
steps_defination = [
    { name: "distributionList", callBackFn: null },
    { name: "ContactsLog", callBackFn: null }
];

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
let perviousRoute = 0;
let actions = []

class TaskGroupsAddEdit extends Component {

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
                    perviousRoute = obj.perviousRoute;
                }
                catch{
                    this.props.history.goBack();
                }
                index++;
            }
        }

        const columnsGrid = [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "arrange",
                name: Resources["numberAbb"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ]

        this.state = {
            currentTitle: "sendToWorkFlow",
            IsEditMode: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 89,
            projectId: projectId,
            docApprovalId: docApprovalId,
            DocumentDate: moment(),
            Status: 'true',
            CompanyData: [],
            ContactData: [],
            isLoading: true,
            CurrStep: 0,
            SelectedCompany: '',
            SelectedContact: '',
            selectedRows: [],
            showDeleteModal: false,
            rows: [],
            selectedRows: [],
            showCheckbox: false,
            columns: columnsGrid.filter(column => column.visible !== false),
            ContactsTable: [],
            rowId: [],
            index: 0,
            MaxArrangeContact: 1,
            DeleteFromLog: false,
            Dis_ListData: {},
            permission: [{ name: 'sendByEmail', code: 631 }, { name: 'sendByInbox', code: 630 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 950 },
            { name: 'createTransmittal', code: 3036 }, { name: 'sendToWorkFlow', code: 703 }]
        }

        if (!Config.IsAllow(625) && !Config.IsAllow(626) && !Config.IsAllow(628)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: '/DistributionList/' + projectId + '',
            });
        }
    }

    FillCompanyDrop = () => {
        dataservice.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + projectId + '', 'companyName', 'companyId').then(
            res => {
                this.setState({ CompanyData: res });
            }
        )
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }

        if (prevProps.showModal != this.props.showModal) {
            this.setState({ showModal: this.props.showModal });
        }
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({ docId: 0 });
    }

    MaxArrangeContacts = () => {
        Api.get('GetNextArrangeItems?docId=' + docId + '&docType=89').then(
            res => {
                this.setState({ MaxArrangeContact: res });
            }
        )
    }

    FillContactsList = () => {
        Api.get('GetProjectDistributionListItemsByDistributionId?distributionId=' + docId + '').then(
            res => {
                this.setState({ rows: res, isLoading: false });
                let data = { items: res };
                this.props.actions.ExportingData(data);
            }
        )
    }

    componentWillMount = () => {
        if (docId > 0) {
            let url = 'GetProjectDistributionListForEdit?id=' + docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'distributionList');

        }
        else {
            Api.get('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=' + this.state.docTypeId + '&companyId=undefined&contactId=undefined').then(
                res => { MaxArrange = res }
            )
            this.props.actions.documentForAdding()
        }
        this.FillCompanyDrop();
        this.FillContactsList()
        if (Config.IsAllow(627)) {
            this.setState({ showCheckbox: true });
        }
        this.MaxArrangeContacts();
    }


    handleChangeDrops = (SelectedItem, DropName) => {
        switch (DropName) {
            case 'Company':
                this.setState({ SelectedCompany: SelectedItem })
                if (SelectedItem !== null) {
                    dataservice.GetDataList('GetContactsByCompanyIdForOnlyUsers?companyId=' + SelectedItem.value + '', 'contactName', 'id').then(
                        res => {
                            this.setState({ ContactData: res });
                        }
                    )
                }
                break;
            default:
                break;
        }
    }

    DocumentDatehandleChange = (date) => {
        this.setState({ DocumentDate: date });
    }

    componentWillReceiveProps(props, state) {
        if (props.document.id) {
            let date = props.document.docDate = props.document.docDate === null ? moment().format('YYYY-MM-DD') : moment(props.document.docDate).format('YYYY-MM-DD')
            this.setState({
                IsEditMode: true,
                Dis_ListData: props.document,
                DocumentDate: date,
                isLoading: false
            });
            this.checkDocumentIsView();
        }

    }

    DeleteContact = (rowId, index) => {

        if (index === undefined) {
            this.setState({
                showDeleteModal: true,
                rowId: rowId,
                DeleteFromLog: true
            });
        }
        else {
            let Ids = []
            Ids.push(rowId)
            this.setState({
                showDeleteModal: true,
                rowId: Ids,
                index: index
            });
        }
    }

    ConfirmationDelete = () => {
        this.setState({ isLoading: true })
        Api.post("DeleteMultipleProjectDistributionListItem", this.state.rowId).then(
            res => {
                let originalRows = this.state.rows
                this.state.rowId.map(i => { originalRows = originalRows.filter(r => r.id !== i); });
                this.setState({
                    rows: originalRows,
                    showDeleteModal: false,
                    isLoading: false,
                    DeleteFromLog: false
                })
                let data = { items: originalRows };
                this.props.actions.ExportingData(data);
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
            }

        ).catch(ex => {
            this.setState({
                showDeleteModal: false,
                isLoading: false,
                DeleteFromLog: false
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
        })

    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    AddContact = (values, actions) => {
        this.setState({ isLoading: true });
        let obj = {
            id: undefined,
            arrange: values.ArrangeContact,
            companyId: values.Company.value,
            contactId: values.ContactName.value,
            distributionListId: docId,
        };
        Api.post('AddProjectDistributionListItem', obj).then(
            res => {
                let NewRows = this.state.rows;
                NewRows.unshift(res)
                this.setState({ rows: NewRows, isLoading: false });
                let data = { items: NewRows };
                this.props.actions.ExportingData(data);
                this.MaxArrangeContacts();
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
            }
        ).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
        });

        values.Company = '';
        values.ContactName = '';
        values.ArrangeContact = this.state.MaxArrangeContact;
    }

    AddEditDis_List = (values, actions) => {
        let Date = moment(this.state.DocumentDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        if (this.state.IsEditMode) {
            let saveDoc = {
                arrange: values.ArrangeTaskGroups, docDate: Date,
                id: docId, projectId: projectId,
                status: this.state.Status, subject: values.Subject,
            };
            dataservice.addObject('EditProjectDistributionList', saveDoc).then(
                res => {
                    toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
                    this.changeCurrentStep(1);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                });
        }

        else {
            let saveDoc = {
                id: undefined, projectId: this.state.projectId,
                arrange: values.ArrangeTaskGroups, docDate: Date,
                subject: values.Subject, status: this.state.Status,
            };
            dataservice.addObject('AddProjectDistributionList', saveDoc).then(
                res => {
                    docId = res.id;
                    this.setState({ Dis_ListData: res, docId: res.id });
                    toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle);
                    this.changeCurrentStep(1);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                });
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(626))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(626)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(626)) {
                    if (this.props.document.status == true && Config.IsAllow(626)) {
                        this.setState({ isViewMode: false });
                    } else {
                        this.setState({ isViewMode: true });
                    }
                } else {
                    this.setState({ isViewMode: true });
                }
            }
        }
        else {
            this.setState({ isViewMode: false });
        }
    }

    componentDidMount = () => {
        this.checkDocumentIsView();
    }

    saveAndExit = () => {
        this.props.history.push({ pathname: '/DistributionList/' + projectId + '', });
    }

    handleShowAction = (item) => {
        if (item.title == "sendToWorkFlow") { this.props.actions.SendingWorkFlow(true); }
        if (item.value != "0") {
            this.props.actions.showOptionPanel(false);
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            });
            this.simpleDialog.show();
        }
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{this.state.IsAddModel ? Resources.next[currentLanguage] : Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = this.state.isViewMode === false ?
                <button className="primaryBtn-1 btn mediumBtn" >{Resources.next[currentLanguage]}</button> : null
        }
        return btn;
    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrStep: stepNo });
    };

    render() {

        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={true}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }, {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={false}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }];

        let RenderContactsTable = this.state.rows.map((item, index) => {
            return (
                this.state.isLoading === false ?
                    <tr key={item.id}>
                        <td className="removeTr">
                            <div className="contentCell tableCell-1">
                                <span className="pdfImage" onClick={() => this.DeleteContact(item.id, index)}>
                                    <img src={Recycle} alt="pdf" />
                                </span>
                            </div>
                        </td>
                        <td>
                            <div className="contentCell tableCell-1">
                                <p>{item.arrange}</p>
                            </div>
                        </td>
                        <td>
                            <div className="contentCell tableCell-1">
                                <p>{item.companyName}</p>
                            </div>
                        </td>
                        <td>
                            <div className="contentCell tableCell-1">
                                <p>{item.contactName}</p>
                            </div>
                        </td>
                    </tr>
                    : <LoadingSection />
            )
        });

        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    minHeight={350}
                    clickHandlerDeleteRows={this.DeleteContact}
                    single={true}
                />
            ) : <LoadingSection />

        const RenderAddContact = () => {
            return (
                <Fragment>
                    <Formik
                        initialValues={{
                            ArrangeContact: this.state.MaxArrangeContact,
                            Company: '',
                            ContactName: '',
                        }}
                        enableReinitialize={true}
                        validationSchema={ValidtionSchemaForContact}
                        onSubmit={(values, actions) => { this.AddContact(values, actions) }}>

                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form onSubmit={handleSubmit}>
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">{Resources['addContact'][currentLanguage]}</h2>
                                    </div>
                                </header>

                                <div className='document-fields'>
                                    <div className="proForm datepickerContainer">

                                        <div className="linebylineInput valid-input">
                                            <DropdownMelcous title="company" data={this.state.CompanyData} name="Company"
                                                selectedValue={this.state.IsEditExpensesWorkFlowItem ? this.state.SelectedCompany : values.Company} onChange={setFieldValue}
                                                handleChange={(e) => this.handleChangeDrops(e, "Company")}
                                                onBlur={setFieldTouched}
                                                error={errors.Company}
                                                touched={touched.Company}
                                                value={values.Company} isClear={true} />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <DropdownMelcous title="ContactName" data={this.state.ContactData} name="ContactName"
                                                selectedValue={this.state.IsEditExpensesWorkFlowItem ? this.state.SelectedContact : values.ContactName} onChange={setFieldValue}
                                                handleChange={(e) => this.handleChangeDrops(e, "ContactName")}
                                                onBlur={setFieldTouched}
                                                error={errors.ContactName}
                                                touched={touched.ContactName}
                                                value={values.ContactName} />
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.ArrangeContact && touched.ArrangeContact ? 'has-error' : null) + ' '}>
                                                <input disabled autoComplete="off" value={values.ArrangeContact} className="form-control" name="ArrangeContact"
                                                    onBlur={(e) => { handleBlur(e) }}
                                                    onChange={(e) => {
                                                        handleChange(e)
                                                    }}
                                                    placeholder={Resources['numberAbb'][currentLanguage]} />
                                                {errors.ArrangeContact && touched.ArrangeContact ? (<em className="pError">{errors.ArrangeContact}</em>) : null}
                                            </div>
                                        </div>

                                    </div>
                                    <div className="slider-Btns">
                                        <button className="primaryBtn-1 btn meduimBtn" type='submit' >ADD</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Fragment>
            )
        };

        return (
            <div className="mainContainer" >
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.distributionList[currentLanguage]}
                        moduleTitle={Resources['generalCoordination'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            {this.state.CurrStep === 0 ?
                                <Fragment>
                                    <Formik
                                        initialValues={{
                                            ArrangeTaskGroups: this.state.IsEditMode ? this.state.Dis_ListData.arrange : MaxArrange,
                                            Subject: this.state.IsEditMode ? this.state.Dis_ListData.subject : '',

                                        }}
                                        enableReinitialize={true}
                                        validationSchema={ValidtionSchemaForDis_List}
                                        onSubmit={(values, actions) => { this.AddEditDis_List(values, actions) }}>

                                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit }) => (
                                            <Form onSubmit={handleSubmit}>
                                                <div className="document-fields">
                                                    <div className="proForm first-proform">

                                                        <div className='linebylineInput '>
                                                            <label className="control-label">{Resources['subject'][currentLanguage]}</label>
                                                            <div className={"inputDev ui input " + (errors.Subject && touched.Subject ? 'has-error' : null) + ' '}>
                                                                <input autoComplete="off" className="form-control" name="Subject"
                                                                    value={this.state.IsEditMode ? this.state.Dis_ListData.subject : values.Subject}
                                                                    onBlur={(e) => { handleBlur(e) }}
                                                                    onChange={(e) => {
                                                                        handleChange(e)
                                                                        if (this.state.IsEditMode) {
                                                                            this.setState({ Dis_ListData: { ...this.state.Dis_ListData, subject: e.target.value } })
                                                                        }
                                                                    }}
                                                                    placeholder={Resources['subject'][currentLanguage]} />
                                                                {errors.Subject && touched.Subject ? (<em className="pError">{errors.Subject}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput">
                                                            <label className="control-label"> {Resources['status'][currentLanguage]} </label>
                                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                                <input type="radio" defaultChecked={this.state.IsEditMode ? this.state.Dis_ListData.status ? 'checked' : null : 'checked'}
                                                                    name="Status" value="true" onChange={(e) => this.setState({ Status: e.target.value })} />
                                                                <label>{Resources['oppened'][currentLanguage]}</label>
                                                            </div>

                                                            <div className="ui checkbox radio radioBoxBlue ">
                                                                <input type="radio" defaultChecked={this.state.IsEditMode ? this.state.Dis_ListData.status ? null : 'checked' : null}
                                                                    name="Status" value="false"
                                                                    onChange={(e) => this.setState({ Status: e.target.value })} />
                                                                <label> {Resources['closed'][currentLanguage]}</label>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="proForm datepickerContainer">

                                                        <div className="linebylineInput valid-input">
                                                            <div className="inputDev ui input">
                                                                <DatePicker title='docDate' handleChange={this.DocumentDatehandleChange}
                                                                    startDate={this.state.DocumentDate} CustomFormat={true}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className='linebylineInput '>
                                                            <label className="control-label">{Resources['numberAbb'][currentLanguage]}</label>
                                                            <div className={"inputDev ui input " + (errors.ArrangeTaskGroups && touched.ArrangeTaskGroups ? 'has-error' : null) + ' '}>
                                                                <input disabled autoComplete="off" className="form-control" name="ArrangeTaskGroups"
                                                                    value={this.state.IsEditMode ? this.state.Dis_ListData.arrange : values.ArrangeTaskGroups}
                                                                    onBlur={(e) => { handleBlur(e) }}
                                                                    onChange={(e) => {
                                                                        handleChange(e)
                                                                        if (this.state.IsEditMode) {
                                                                            this.setState({ Dis_ListData: { ...this.state.Dis_ListData, arrange: e.target.value } })
                                                                        }
                                                                    }}
                                                                    placeholder={Resources['numberAbb'][currentLanguage]} />
                                                                {errors.ArrangeTaskGroups && touched.ArrangeTaskGroups ? (<em className="pError">{errors.ArrangeTaskGroups}</em>) : null}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="doc-pre-cycle">
                                                    <div className="slider-Btns"> {this.showBtnsSaving()} </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>


                                    {this.state.IsEditMode ?
                                        <Fragment>
                                            <div className='document-fields'>
                                                <header>
                                                    <h2 className="zero">{Resources['contactList'][currentLanguage]}</h2>
                                                </header>
                                                <table className="attachmentTable attachmentTableAuto">
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                <div className="headCell tableCell-1">
                                                                    {Resources['delete'][currentLanguage]}
                                                                </div>
                                                            </th>
                                                            <th>
                                                                <div className="headCell tableCell-1">
                                                                    {Resources['arrange'][currentLanguage]}
                                                                </div>
                                                            </th>
                                                            <th>
                                                                <div className="headCell tableCell-2">
                                                                    {Resources['CompanyName'][currentLanguage]}
                                                                </div>
                                                            </th>
                                                            <th>
                                                                <div className="headCell tableCell-2">
                                                                    {Resources['ContactName'][currentLanguage]}
                                                                </div>
                                                            </th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {RenderContactsTable}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Fragment>
                                        : null
                                    }

                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.props.changeStatus === true ?
                                                <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }
                                        </div>
                                    </div>
                                </Fragment>
                                :

                                <div className="subiTabsContent feilds__top">

                                    {RenderAddContact()}

                                    <div className="doc-pre-cycle">
                                        <header>
                                            <h2 className="zero">{Resources['contactList'][currentLanguage]}</h2>
                                        </header>
                                        {dataGrid}
                                    </div>

                                    <div className="doc-pre-cycle">
                                        <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" onClick={this.saveAndExit}>{Resources['next'][currentLanguage]}</button>
                                        </div>
                                    </div>
                                </div>
                            }

                        </div>

                        <Fragment>
                            <Steps
                                steps_defination={steps_defination}
                                exist_link="/DistributionList/"
                                docId={this.state.docId}
                                changeCurrentStep={stepNo =>
                                    this.changeCurrentStep(stepNo)
                                }
                                stepNo={this.state.CurrStep}
                            />
                        </Fragment>

                    </div>
                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmationDelete}
                        />
                    ) : null}
                    {
                        this.props.changeStatus === true && this.state.IsEditMode ?
                            <div className="approveDocument">
                                <div className="approveDocumentBTNS">
                                    {/* <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={e => this.editPhone(e)}>{Resources.save[currentLanguage]}</button> */}
                                    {this.state.isApproveMode === true ?
                                        <div >
                                            <button className="primaryBtn-1 btn " type="button" onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                            <button className="primaryBtn-2 btn middle__btn" type="button" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                        </div>
                                        : null
                                    }
                                    <button type="button" className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                    <button type="button" className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                                    <span className="border"></span>
                                    <div className="document__action--menu">
                                        <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                    </div>
                                </div>
                            </div>
                            : null
                    }

                    <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                            {this.state.currentComponent}
                        </SkyLight>
                    </div>
                </div>
            </div>

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
        hasWorkflow: state.communication.hasWorkflow
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
)(withRouter(TaskGroupsAddEdit))

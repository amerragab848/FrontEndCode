import React, { Component, Fragment } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachmentWithProgress'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import { withRouter } from "react-router-dom";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'
import AddDocAttachment from "../../Componants/publicComponants/AddDocAttachment";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import Steps from "../../Componants/publicComponants/Steps";
//import AddItemDescription from "../../Componants/OptionsPanels/AddItemDescription";
//import EditItemDescription from "../../Componants/OptionsPanels/editItemDescription";
import SkyLight from "react-skylight";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

var steps_defination = [];

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    refDoc: Yup.string().required(Resources['selectRefNo'][currentLanguage]),
    timeExtension: Yup.string().required(Resources['timeExtensionRequired'][currentLanguage]),
    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
    contractId: Yup.string().required(Resources['contractRequired'][currentLanguage]).nullable(true),
    toContactId: Yup.string().required(Resources['toContactRequired'][currentLanguage])
})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
const find = require('lodash/find')
class VariationRequestAdd extends Component {

    constructor(props) {

        super(props);
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
            }
            index++;
        }

        this.cells = [
            { title: '', type: 'check-box', fixed: true, field: 'id' },
            {
                field: "arrange",
                title: Resources["arrange"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "description",
                title: Resources["description"][currentLanguage],
                width: 5,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "quantity",
                title: Resources["quantity"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "unitPrice",
                title: Resources["unitPrice"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "resourceCode",
                title: Resources["resourceCode"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "itemCode",
                title: Resources["itemCode"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "boqType",
                title: Resources["boqType"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "boqSubType",
                title: Resources["boqSubType"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "boqTypeChild",
                title: Resources["boqTypeChild"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
        ]

        this.actions = [
            {
                title: Resources['delete'][currentLanguage],
                handleClick: ids => {
                    this.clickHandlerDeleteRowsMain(ids)
                },
                classes: '',
            }
        ];

        this.rowActions = [];

        this.state = {
            showDeleteModal: false,
            LoadingSectionEdit: false,
            showPopUp: false,
            //            itemsColumns: itemsColumns,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 108,
            selectedRow: {},
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            ToContacts: [],
            fromContacts: [],
            contracts: [],
            permission: [{ name: 'sendByEmail', code: 3168 }, { name: 'sendByInbox', code: 3167 },
            { name: 'sendTask', code: 0 }, { name: 'distributionList', code: 3174 },
            { name: 'createTransmittal', code: 3175 }, { name: 'sendToWorkFlow', code: 3171 },
            { name: 'viewAttachments', code: 3294 }, { name: 'deleteAttachments', code: 3173 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedContractSubject: { label: Resources.contractSubject[currentLanguage], value: "0" },
            CurrentStep: 0,
            items: [],
            totalCost: 0,
            selectedRows: [],
            AddItemDescription: null,
            EditItemDescription: null
        }

        if (!Config.IsAllow(3162) && !Config.IsAllow(3163) && !Config.IsAllow(3165)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }

        steps_defination = [
            {
                name: "variationRequest",
                callBackFn: null
            },
            {
                name: "items",
                callBackFn: null
            }
        ];
    }

    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add('even');
            }
            else {
                links[i].classList.add('odd');
            }
        }
        this.checkDocumentIsView();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            this.setState({
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow,
                items: nextProps.items,
                totalCost: nextProps.totalCost,
                isLoading: nextProps.isLoading
            });
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }

        if (this.props.items !== prevProps.items) {
            this.setState({ items: this.props.items });
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(3163))) {
                this.setState({ isViewMode: true });
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (this.state.isApproveMode != true && Config.IsAllow(3163)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(3163)) {
                        if (this.props.document.status !== false && Config.IsAllow(3163)) {
                            this.setState({ isViewMode: false });
                        } else {
                            this.setState({ isViewMode: true });
                        }
                    } else {
                        this.setState({ isViewMode: true });
                    }
                }
            }
        }
        else {
            this.setState({ isViewMode: false });
        }
    }

    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetContractsVariationRequestForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'cvr');
            this.GetVRItems();

        } else {
            let Variation = {
                subject: '',
                id: 0,
                projectId: this.state.projectId,
                arrange: '',
                fromCompanyId: '',
                fromContactId: '',
                toCompanyId: '',
                toContactId: '',
                docDate: moment(),
                status: 'true',
                description: '',
                refDoc: '',
                contractId: ''
            };
            this.setState({ document: Variation });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
            this.GetNextArrange();
        }
    }
    GetVRItems = () => {
        this.setState({isLoading:true})
        dataservice.GetDataGrid(`GetVRItems?variationRequestId=${this.state.docId}`).then(result => {
            this.props.actions.addItemDescription(result);
            this.setState({isLoading:false})
        })
    }

    GetNextArrange() {
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=0&contactId=0";

        dataservice.GetNextArrangeMainDocument(url).then(res => {
            let original_document = { ...this.state.document };
            let updated_document = {};
            updated_document.arrange = res;
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document
            });
        })
    }

    fillSubDropDownInEdit(url, param, value, subField, subSelectedValue, subDatasource) {
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = find(result, function (i) { return i.value == toSubField; });

                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        });
    }

    fillDropDowns(isEdit) {
        dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId', 'companies', this.state.projectId, "projectId").then(result => {

            if (isEdit) {
                let companyId = this.props.document.fromCompanyId;
                if (companyId) {
                    this.setState({
                        selectedFromCompany: { label: this.props.document.fromCompanyName, value: companyId }
                    });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', companyId, 'fromContactId', 'selectedFromContact', 'fromContacts');
                }

                let toCompanyId = this.props.document.toCompanyId;
                if (toCompanyId) {
                    this.setState({
                        selectedToCompany: { label: this.props.document.toCompanyName, value: toCompanyId }
                    });

                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', toCompanyId, 'toContactId', 'selectedToContact', 'ToContacts');
                }
            }
            this.setState({
                companies: [...result]
            });
        });

        dataservice.GetDataList("GetContractsForList?projectId=" + this.state.projectId, 'subject', 'id').then(ContractData => {
            if (isEdit) {
                if (this.state.document.contractId) {
                    let contractId = this.state.document.contractId;
                    let contractSubject = find(ContractData, function (i) { return i.value === contractId });
                    this.setState({
                        selectedContractSubject: contractSubject
                    })
                }
            }
            this.setState({
                contracts: ContractData
            })
        });
    }

    onChangeMessage = (value) => {
        let isEmpty = !value.getEditorState().getCurrentContent().hasText();
        if (isEmpty === false) {

            this.setState({ message: value });
            if (value.toString('markdown').length > 1) {

                let original_document = { ...this.state.document };

                let updated_document = {};

                updated_document.message = value.toString('markdown');

                updated_document = Object.assign(original_document, updated_document);

                this.setState({
                    document: updated_document
                });
            }
        }
    };

    handleChange(e, field) {
        console.log(field, e);
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    handleChangeDate(e, field) {
        console.log(field, e);
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {
        if (event == null) return;
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
            [selectedValue]: event
        });

        if (isSubscrib) {
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'contactName', 'id').then(result => {
                this.setState({
                    [targetState]: result
                });
            });
        }
    }

    editRequest(event) {
        this.setState({
            isLoading: true
        });

        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('EditContractsVariationRequest', saveDocument).then(result => {
            this.setState({
                isLoading: false,
                CurrentStep: 1
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

        });
    }

    saveRequest(event) {
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');


        dataservice.addObject('AddContractsVariationRequest', saveDocument).then(result => {
            this.setState({
                docId: result.id
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    saveAndExit(event) {

        if (this.state.isApproveMode === false) {
            this.props.history.push(this.state.perviousRoute);
        }
    }

    showBtnsSaving() {
        let btn = null;
        if (this.state.docId === 0) {
            btn = (
                <button className="primaryBtn-1 btn meduimBtn" type="submit">
                    {Resources.save[currentLanguage]}
                </button>
            );
        } else if (this.state.docId > 0) {
            btn = (
                <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type="submit">
                    {Resources.next[currentLanguage]}
                </button>
            );
        }
        return btn;
    }

    viewAttachments() {
        return (
            this.state.docId > 0 ? (
                Config.IsAllow(3294) === true ?
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={3173} />
                    : null)
                : null
        )
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    changeCurrentStep = stepNo => {
        if (stepNo === 1) {
            import(`../../Componants/OptionsPanels/AddItemDescription`).then(module => {
                this.setState({ AddItemDescription: module.default })
            });
            import(`../../Componants/OptionsPanels/editItemDescription`).then(module => {
                this.setState({ EditItemDescription: module.default })
            });
        }

        if (stepNo === 2) {
            this.props.history.push(`variationRequest/${projectId}`);
        }
        this.setState({ CurrentStep: stepNo });
    };

    _executeBeforeModalOpen = () => {
        this.setState({
            btnText: "save"
        });
    };

    _executeBeforeModalClose = () => {
        this.setState({
            showPopUp: false,
            btnText: "add",
            showBoqModal: false
        });
    };


    onRowClick = (value) => {
        this.setState({ LoadingSectionEdit: true });
        setTimeout(() => { this.setState({ showPopUp: true, btnText: "save", selectedRow: value, LoadingSectionEdit: false }); }, 200);
        this.simpleDialog1.show();
    };

    disablePopUp = () => {
        this.setState({ showPopUp: false, });
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerContinueMain = () => {
        this.setState({
            isLoading: true
        });

        this.props.actions.setLoading();

        dataservice.addObject(`DeleteMultiVrItems`, this.state.selectedRows).then(result => {

            this.props.actions.deleteItemDescription(this.state.selectedRows);

            this.setState({
                isLoading: false,
                showDeleteModal: false,
                selectedRows: []
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

        }).catch(ex => {
            this.setState({
                isLoading: false,
                showDeleteModal: false
            });
        });
    };

    clickHandlerDeleteRowsMain = (selectedRows) => {
        this.setState({
            showDeleteModal: true,
            selectedRows: selectedRows
        });
    }

    render() {
        const AddItemDescription = this.state.AddItemDescription
        const EditItemDescription = this.state.EditItemDescription
        return this.state.isLoading ? <LoadingSection /> :
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.variationRequest[currentLanguage]} moduleTitle={Resources['contracts'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            {this.state.CurrentStep == 0 ?
                                <Fragment>
                                    <div id="step1" className="step-content-body">
                                        <div className="subiTabsContent">
                                            <div className="document-fields">
                                                <Formik
                                                    initialValues={{ ...this.state.document }}
                                                    validationSchema={validationSchema}
                                                    enableReinitialize={true}
                                                    onSubmit={(values) => {
                                                        if (this.props.showModal) { return; }
                                                        if (this.props.changeStatus === true && this.state.docId > 0) {
                                                            this.editRequest();
                                                        } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                            this.saveRequest();
                                                        } else {
                                                            this.changeCurrentStep(1);
                                                            //this.saveAndExit();
                                                        }
                                                    }}>
                                                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                        <Form id="letterForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                            <div className="proForm first-proform">
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                                    <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                        <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                                            placeholder={Resources.subject[currentLanguage]}
                                                                            autoComplete='off'
                                                                            value={this.state.document.subject || ''}
                                                                            onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                                            onChange={(e) => this.handleChange(e, 'subject')} />
                                                                        {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.status[currentLanguage]}</label>
                                                                    <div className="ui checkbox radio radioBoxBlue">
                                                                        <input type="radio" name="vr-status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                                                        <label>{Resources.oppened[currentLanguage]}</label>
                                                                    </div>
                                                                    <div className="ui checkbox radio radioBoxBlue">
                                                                        <input type="radio" name="vr-status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
                                                                        <label>{Resources.closed[currentLanguage]}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="proForm datepickerContainer">
                                                                <div className="linebylineInput valid-input alternativeDate">
                                                                    <DatePicker title='docDate' startDate={this.state.document.docDate} handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                                    <div className="ui input inputDev"  >
                                                                        <input type="text" className="form-control" id="arrange"
                                                                            value={this.state.document.arrange || ''} name="arrange"
                                                                            placeholder={Resources.arrange[currentLanguage]}
                                                                            onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                            onChange={(e) => this.handleChange(e, 'arrange')} />
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput fullInputWidth">
                                                                    <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev"}>
                                                                        <input type="text" className="form-control" id="refDoc" value={this.state.document.refDoc || ''}
                                                                            name="refDoc" placeholder={Resources.refDoc[currentLanguage]}
                                                                            onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                            onChange={(e) => this.handleChange(e, 'refDoc')} />
                                                                        {/* {touched.refDoc ? (<em className="pError">{errors.refDoc}</em>) : null} */}
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input mix_dropdown">
                                                                    <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                                    <div className="supervisor__company">
                                                                        <div className="super_name">
                                                                            <Dropdown data={this.state.companies} isMulti={false} selectedValue={this.state.selectedFromCompany}
                                                                                handleChange={event => {
                                                                                    this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact')
                                                                                }}
                                                                                onChange={setFieldValue} onBlur={setFieldTouched} error={errors.fromCompanyId}
                                                                                touched={touched.fromCompanyId}
                                                                                index="fromCompanyId"
                                                                                name="fromCompanyId"
                                                                                id="fromCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                                                                        </div>
                                                                        <div className="super_company">
                                                                            <Dropdown
                                                                                isMulti={false}
                                                                                data={this.state.fromContacts}
                                                                                selectedValue={this.state.selectedFromContact}
                                                                                handleChange={event => this.handleChangeDropDown(event, 'fromContactId', false, '', '', '', 'selectedFromContact')}
                                                                                onChange={setFieldValue}
                                                                                onBlur={setFieldTouched}
                                                                                error={errors.fromContactId}
                                                                                touched={touched.fromContactId}
                                                                                isClear={false}
                                                                                index="letter-fromContactId"
                                                                                name="fromContactId"
                                                                                id="fromContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input mix_dropdown">
                                                                    <label className="control-label">{Resources.toCompany[currentLanguage]}</label>
                                                                    <div className="supervisor__company">
                                                                        <div className="super_name">
                                                                            <Dropdown
                                                                                isMulti={false}
                                                                                data={this.state.companies}
                                                                                selectedValue={this.state.selectedToCompany}
                                                                                handleChange={event =>
                                                                                    this.handleChangeDropDown(event, 'toCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedToCompany', 'selectedToContact')}
                                                                                onChange={setFieldValue}
                                                                                onBlur={setFieldTouched}
                                                                                error={errors.toCompanyId}
                                                                                touched={touched.toCompanyId}
                                                                                index="letter-toCompany"
                                                                                name="toCompanyId"
                                                                                id="toCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                                                                        </div>
                                                                        <div className="super_company">
                                                                            <Dropdown
                                                                                isMulti={false}
                                                                                data={this.state.ToContacts}
                                                                                selectedValue={this.state.selectedToContact}
                                                                                handleChange={event => this.handleChangeDropDown(event, 'toContactId', false, '', '', '', 'selectedToContact')}
                                                                                onChange={setFieldValue}
                                                                                onBlur={setFieldTouched}
                                                                                error={errors.toContactId}
                                                                                touched={touched.toContactId}
                                                                                index="letter-toContactId"
                                                                                name="toContactId"
                                                                                id="toContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="contractSubject"
                                                                        data={this.state.contracts}
                                                                        selectedValue={this.state.selectedContractSubject}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'contractId', false, '', '', '', 'selectedContractSubject')}
                                                                        index="vr-contractId"
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.contractId}
                                                                        touched={touched.contractId}
                                                                        name="contractId"
                                                                        id="contractId" />
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.timeExtension[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev" + (errors.timeExtension && touched.timeExtension ? (" has-error") : (!errors.timeExtension && touched.timeExtension ? (" has-success") : "ui input inputDev has-success"))} >
                                                                        <input type="text" className="form-control" id="timeExtension"
                                                                            value={this.state.document.timeExtension || ''}
                                                                            name="timeExtension"
                                                                            placeholder={Resources.timeExtension[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'timeExtension')} />
                                                                        {touched.timeExtension ? (<em className="pError">{errors.timeExtension}</em>) : null}
                                                                    </div>
                                                                </div>
                                                                {this.props.changeStatus ? <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.totalCost[currentLanguage]}</label>
                                                                    <div className="ui input inputDev">
                                                                        <input type="text" className="form-control" id="totalCost"
                                                                            value={this.state.totalCost || ''} name="totalCost" readOnly
                                                                            placeholder={Resources.totalCost[currentLanguage]} />
                                                                    </div>
                                                                </div> : null}
                                                            </div>
                                                            <div className="slider-Btns">
                                                                {this.showBtnsSaving()}
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </div>
                                            <div className="doc-pre-cycle letterFullWidth">
                                                <div>
                                                    {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={3172} EditAttachments={3253} ShowDropBox={3563} ShowGoogleDrive={3564} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                                    {this.state.docId > 0 ? (
                                                        <React.Fragment>
                                                            <div className="document-fields tableBTnabs">
                                                                <AddDocAttachment projectId={this.state.projectId} isViewMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} />
                                                            </div>
                                                        </React.Fragment>
                                                    ) : null}
                                                    {this.viewAttachments()}
                                                    {this.props.changeStatus === true ? <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                                :
                                <Fragment>
                                    <div className="subiTabsContent feilds__top">
                                        {this.state.CurrentStep === 1 && this.state.AddItemDescription != null ?
                                            <AddItemDescription
                                                docLink="/Downloads/Excel/VRItems.xlsx"
                                                docType="VRItems"
                                                isViewMode={this.state.isViewMode}
                                                docId={this.state.docId}
                                                mainColumn="variationRequestId"
                                                showBoqType={true}
                                                addItemApi="AddVRItems"
                                                projectId={this.state.projectId}
                                                showItemType={false}
                                                showImportExcel={true}
                                                afterUpload={()=>{this.GetVRItems();}}
                                            /> : null}
                                        <div className="doc-pre-cycle">
                                         {this.state.isLoading?null:   <GridCustom
                                                gridKey="VariationRequestAddEdit"
                                                cells={this.cells}
                                                data={this.state.items}
                                                groups={[]} pageSize={50}
                                                actions={this.actions}
                                                rowActions={this.rowActions}
                                                rowClick={cells => this.onRowClick(cells)}
                                            />}
                                        </div>
                                        <div className="doc-pre-cycle">
                                            <div className="slider-Btns">
                                                <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(2)}>
                                                    {Resources["next"][currentLanguage]}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            }

                            <div className="largePopup largeModal " style={{ display: this.state.showPopUp ? "block" : "none" }}>
                                <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialog1 = ref)}
                                    title={Resources.editTitle[currentLanguage] + " - " + Resources.edit[currentLanguage]}>
                                    <Fragment>
                                        <div className=" proForm datepickerContainer customProform document-fields" key="editItem">
                                            {this.state.LoadingSectionEdit === false && this.state.EditItemDescription != null && this.state.CurrentStep === 1 ?
                                                <EditItemDescription
                                                    showImportExcel={false}
                                                    docType="vr"
                                                    isViewMode={this.state.isViewMode}
                                                    mainColumn="variationRequestId"
                                                    editItemApi="EditVRItem"
                                                    projectId={this.state.projectId}
                                                    showItemType={false}
                                                    item={this.state.selectedRow}
                                                    showBoqType={true}
                                                    isViewMode={this.state.isViewMode}
                                                    onRowClick={this.state.showPopUp}
                                                    disablePopUp={this.disablePopUp}
                                                />
                                                : <LoadingSection />}
                                        </div>
                                    </Fragment>
                                </SkyLight>
                            </div>
                            <div>
                                {this.state.showDeleteModal == true ? (
                                    <ConfirmationModal
                                        title={Resources["smartDeleteMessageContent"][currentLanguage]}
                                        buttonName="delete"
                                        closed={this.onCloseModal}
                                        showDeleteModal={this.state.showDeleteModal}
                                        clickHandlerCancel={this.clickHandlerCancelMain}
                                        clickHandlerContinue={this.clickHandlerContinueMain}
                                    />
                                ) : null}
                            </div>
                        </div>
                        <Steps steps_defination={steps_defination} exist_link="/variationRequest/" docId={this.state.docId}
                            changeCurrentStep={stepNo => this.changeCurrentStep(stepNo)} stepNo={this.state.CurrentStep} changeStatus={docId === 0 ? false : true} />
                        {
                            this.props.changeStatus === true ?
                                <div className="approveDocument">
                                    <div className="approveDocumentBTNS">
                                        <DocumentActions isApproveMode={this.state.isApproveMode}
                                            docTypeId={this.state.docTypeId}
                                            docId={this.state.docId}
                                            projectId={this.state.projectId}
                                            previousRoute={this.state.previousRoute}
                                            docApprovalId={this.state.docApprovalId}
                                            currentArrange={this.state.arrange}
                                            showModal={this.props.showModal}
                                            showOptionPanel={this.showOptionPanel}
                                            permission={this.state.permission}
                                            documentName={Resources.variationRequest[currentLanguage]}
                                        />
                                    </div>
                                </div> : null
                        }
                    </div>

                </div>
            </div>
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
        projectId: state.communication.projectId,
        showModal: state.communication.showModal,
        items: state.communication.items,
        totalCost: state.communication.totalCost,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VariationRequestAdd))
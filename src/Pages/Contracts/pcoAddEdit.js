import React, { Component, Fragment } from "react";

import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import ReactTable from "react-table";

import { withRouter } from "react-router-dom";

import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import * as communicationActions from '../../store/actions/communication';

import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";

import SkyLight from 'react-skylight';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'

import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({

    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    description: Yup.string().required(Resources['description'][currentLanguage]),

    contractId: Yup.string().required(Resources['selectContract'][currentLanguage])
        .nullable(true),

    companyId: Yup.string().required(Resources['fromCompanyRequired'][currentLanguage])
        .nullable(true),

    profit: Yup.string().required(Resources['profit'][currentLanguage])
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),

    overHead: Yup.string().required(Resources['overHead'][currentLanguage])
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),
    approvalStatusId: Yup.string()
        .required(Resources['overHead'][currentLanguage]),

    timeExtension: Yup.string().required(Resources['timeExtension'][currentLanguage])
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage])
})

const documentItemValidationSchema = Yup.object().shape({
    description: Yup.string()
        .required(Resources['subjectRequired'][currentLanguage]),
    resourceCode: Yup.string()
        .required(Resources['resourceCode'][currentLanguage]),
    itemCode: Yup.string()
        .required(Resources['itemCode'][currentLanguage]),
    unitPrice: Yup.string().required(Resources['unitPrice'][currentLanguage])
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),
    days: Yup.string()
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),
    quantity: Yup.string().required(Resources['quantity'][currentLanguage])
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage])
})

let columns = [
    {
        Header: 'arrange',
        accessor: 'arrange',
        width: 60,
    }, {
        Header: Resources['description'][currentLanguage],
        accessor: 'description',
        width: 180,
    }, {
        Header: Resources['quantity'][currentLanguage],
        accessor: 'quantity',
        width: 80,
    }, {
        Header: Resources['unitPrice'][currentLanguage],
        accessor: 'unitPrice',
        width: 80,
    }, {
        Header: Resources['resourceCode'][currentLanguage],
        accessor: 'resourceCode',
        width: 120,
    }, {
        Header: Resources['itemCode'][currentLanguage],
        accessor: 'itemCode',
        width: 80,
    }, {
        Header: Resources['boqType'][currentLanguage],
        accessor: 'boqType',
        width: 120,
    }, {
        Header: Resources['boqSubType'][currentLanguage],
        accessor: 'boqSubType',
        width: 120,
    }, {
        Header: Resources['boqTypeChild'][currentLanguage],
        accessor: 'boqTypeChild',
        width: 120,
    }
]

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')
class pcoAddEdit extends Component {

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
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            currIndex: 1,
            FirstStep: true,
            SecondStep: false,
            ThirdStep: false,
            SecondStepComplate: false,
            ThirdStepComplate: false,

            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            companies: [],
            approvalstatusList: [],
            units: [],
            variations: [],
            boqTypes: [],
            equipmentTypes: [],
            selectedCVR: { label: Resources.cvr[currentLanguage], value: "0" },
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedApprovalStatusId: { label: Resources.approvalStatus[currentLanguage], value: "0" },

            selectedUnit: { label: Resources.unit[currentLanguage], value: "0" },
            selectedBoqType: { label: Resources.boqType[currentLanguage], value: "0" },
            selectedBoqTypeChild: { label: Resources.boqType[currentLanguage], value: "0" },
            selectedBoqSubType: { label: Resources.boqType[currentLanguage], value: "0" },
            selectedEquipmenttypeId: { label: Resources.equipmentTypeSelection[currentLanguage], value: "0" },

            docId: docId,
            docTypeId: 65,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,

            document: this.props.document ? Object.assign({}, this.props.document) : {},
            voItem: {
                description: '',
                quantity: 1,
                unitPrice: 0,
                unit: '',
                boqTypeId: '',
                boqSubTypeId: '',
                boqTypeChildId: '',
                days: 1,
                itemCode: '',
                resourceCode: '',
                equipmenttypeId: '',
                dueBack: moment()
            },

            permission: [{ name: 'sendByEmail', code: 54 }, { name: 'sendByInbox', code: 53 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 956 },
            { name: 'createTransmittal', code: 3042 }, { name: 'sendToWorkFlow', code: 707 },
            { name: 'viewAttachments', code: 3317 }, { name: 'deleteAttachments', code: 840 }],
            selectContract: { label: Resources.selectContract[currentLanguage], value: "0" },
            selectPco: { label: Resources.pco[currentLanguage], value: "0" },
            pcos: [],
            contractsPos: [],
            voItems: [],
            CurrentStep: 1
        }

        if (!Config.IsAllow(366) || !Config.IsAllow(367) || !Config.IsAllow(369)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/pco/" + projectId
            });
        }
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
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.document && nextProps.document.id) {
            let serverChangeOrder = { ...nextProps.document };
            serverChangeOrder.docDate = moment(serverChangeOrder.docDate).format('DD/MM/YYYY');
            serverChangeOrder.dateApproved = moment(serverChangeOrder.resultDate).format('DD/MM/YYYY');
            serverChangeOrder.timeExtensionRequired = serverChangeOrder.timeExtensionRequired ? parseFloat(serverChangeOrder.timeExtensionRequired) : 0;
            this.setState({
                document: { ...serverChangeOrder },
                hasWorkflow: nextProps.hasWorkflow
            });

            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(367)) {
                alert('not have edit...');
                this.setState({ isViewMode: true });
            }

            if (this.state.isApproveMode != true && Config.IsAllow(367)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(367)) {
                    //close => false
                    if (this.props.document.status !== false && Config.IsAllow(367)) {
                        this.setState({ isViewMode: false });
                    } else {
                        this.setState({ isViewMode: true });
                    }
                } else {

                    alert('not have edit and hasWorkflow = ' + this.props.hasWorkflow);
                    this.setState({ isViewMode: true });
                }
            }
        }
        else {
            this.setState({ isViewMode: false });
        }
        console.log('checkDocumentIsView...', this.props, this.state);
    }

    componentWillMount() {
        if (this.state.docId > 0) {
            this.props.actions.documentForEdit("GetContractsPcoForEdit?id=" + this.state.docId);

            dataservice.GetDataGrid("GetContractsPcoItemsByProposalId?proposalId=" + this.state.docId).then(result => {
                this.setState({
                    voItems: result
                });
            });

        } else {
            let pco = {
                subject: '',
                id: 0,
                projectId: this.state.projectId,
                arrange: '',
                docDate: moment(),
                status: 'true',
                isLumpSum: 'false',
                refDoc: '',
                profit: 0,
                overHead: 0,
                timeExtensionRequired: 0,
                contractId: '',
                companyId: '',
                cvrId: '',
                approvalStatusId: '',
                dateApproved: moment()

            };

            this.setState({ document: pco }, function () {
                this.GetNExtArrange();
            });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    };

    GetNExtArrange() {
        let original_document = { ...this.state.document };
        let updated_document = {};
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=0&contactId=0" ;
        this.props.actions.GetNextArrange(url);
        dataservice.GetNextArrangeMainDocument(url).then(res => {
            updated_document.arrange = res;
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document
            });
        })
    }

    fillDropDowns(isEdit) {
        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId').then(result => {

            if (isEdit) {
                let companyId = this.props.document.companyId;
                if (companyId) {
                    this.setState({
                        selectedFromCompany: { label: this.props.document.companyName, value: companyId }
                    });
                }
            }
            this.setState({
                companies: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=approvalstatus", 'title', 'id').then(result => {
            if (isEdit) {
                let approvalStatusId = this.state.document.approvalStatusId;
                let approvalStatus = {};
                if (approvalStatusId) {
                    approvalStatus = _.find(result, function (i) { return i.value == approvalStatusId; });

                    this.setState({
                        selectedApprovalStatusId: approvalStatus
                    });
                }
            }
            this.setState({
                approvalstatusList: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=unit", 'title', 'title').then(result => {
            this.setState({
                units: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=equipmenttype", 'title', 'id').then(result => {
            this.setState({
                equipmentTypes: [...result]
            });
        });

        dataservice.GetDataList("GetAllBoqParentNull?projectId=" + this.state.projectId, 'title', 'id').then(result => {
            this.setState({
                boqTypes: [...result]
            });
        });

        dataservice.GetDataList("GetContractsVariationRequestByProjectIdForList?projectId=" + this.state.projectId, 'subject', 'id').then(result => {
            if (isEdit) {
                let selectedCVRId = this.state.document.cvrId;
                let cvr = {};
                if (selectedCVRId) {
                    selectedCVRId = _.find(result, function (i) { return i.value == selectedCVRId; });

                    this.setState({
                        selectedCVR: cvr
                    });
                }
            }
            this.setState({
                variations: [...result]
            });
        });
 
    }

    componentWillUnmount() {
        this.setState({
            docId: 0
        });
    }

    onChangeMessage = (value, field) => {
        let isEmpty = !value.getEditorState().getCurrentContent().hasText();
        if (isEmpty === false) {

            this.setState({ [field]: value });
            if (value.toString('markdown').length > 1) {

                let original_document = { ...this.state.document };

                let updated_document = {};

                updated_document[field] = value.toString('markdown');

                updated_document = Object.assign(original_document, updated_document);

                this.setState({
                    document: updated_document
                });
            }
        }
    };

    handleChange(e, field) {

        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    handleChangeDate(e, field) {

        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    handleChangeDateItem(e, field) {

        let original_document = { ...this.state.voItem };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            voItem: updated_document
        });
    }

    handleChangeDropDown(event, field, selectedValue) {
        if (event == null) return;
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
            [selectedValue]: event
        });
       
    }

    editVariationOrder(event) {
        this.setState({
            isLoading: true
        });

        let saveDocument = this.state.document;

        saveDocument.docDate = moment(saveDocument.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('EditContractsPco', saveDocument).then(result => {
            this.setState({
                isLoading: true
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(res => {
            this.setState({
                isLoading: true
            });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    saveVariationOrder(event) {
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        saveDocument.projectId = this.state.projectId;

        dataservice.addObject('AddContractsPco', saveDocument).then(result => {
            if (result.id) {

                this.setState({
                    docId: result.id
                });

                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        }).catch(res => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    showBtnsSaving() {
        let btn = null;
        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type='submit'>{Resources.next[currentLanguage]}</button>
        }
        return btn;
    }

    viewAttachments() {
        return (
            this.state.docId > 0 ? (
                Config.IsAllow(3317) === true ?
                    <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    handleShowAction = (item) => {

        if (item.value != "0") {

            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })

            this.simpleDialog.show()
        }
    }

    NextStep = () => {

        if (this.state.CurrentStep === 1) {
            if (this.props.changeStatus == true) {
                this.editVariationOrder();
            }
            window.scrollTo(0, 0)
            this.setState({
                FirstStep: false,
                SecondStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: false,
                CurrentStep: this.state.CurrentStep + 1,
                ThirdStep: false
            })
        }
        else if (this.state.CurrentStep === 2) { 
            this.props.history.push({
                pathname: "/pco/" + projectId
            });
        }

    }

    NextTopStep = () => {

        if (this.state.CurrentStep === 1) {

            window.scrollTo(0, 0)
            this.setState({
                FirstStep: false,
                SecondStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: false,
                CurrentStep: this.state.CurrentStep + 1,
                ThirdStep: false
            })
        }
        else if (this.state.CurrentStep === 2) {

            window.scrollTo(0, 0)
            this.setState({
                FirstStep: false,
                SecondStep: false,
                ThirdStep: true,
                CurrentStep: (this.state.CurrentStep + 1),
                ThirdStepComplate: true
            })
        } else {
            this.props.history.push({
                pathname: "/pco/" + projectId
            });
        }

    }

    PreviousStep = () => {
        if (this.state.docId !== 0) {
            if (this.state.CurrentStep === 3) {
                window.scrollTo(0, 0)
                this.setState({
                    FirstStep: false,
                    SecondStep: true,
                    ThirdStep: false,
                    CurrentStep: (this.state.CurrentStep - 1),
                    ThirdStepComplate: false,
                    SecondStepComplate: true
                })
            }
            else {
                if (this.state.CurrentStep === 2) {
                    window.scrollTo(0, 0)
                    this.setState({
                        FirstStep: true,
                        SecondStep: false,
                        SecondStepComplate: false,
                        ThirdStep: false,
                        CurrentStep: (this.state.CurrentStep - 1)
                    })
                }
            }
        }
    }

    saveVariationOrderItem(event) {
        let saveDocument = { ...this.state.voItem };

        saveDocument.proposalId = this.state.docId;
        let currentTab = this.state.currIndex;
        saveDocument.action = currentTab;
        dataservice.addObject('AddContractsPcoItems', saveDocument).then(result => {
            if (result) {
                let oldItems = [...this.state.voItems];
                oldItems.push(result);
                this.setState({
                    voItems: [...oldItems]
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        }).catch(res => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    handleChangeItem(e, field) {

        let original_document = { ...this.state.voItem };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            voItem: updated_document
        });
    }

    handleChangeItemDropDown(event, field, selectedValue, isSubscribe, url, param, nextTragetState) {
        if (event == null) return;
        let original_document = { ...this.state.documentCycle };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            documentCycle: updated_document,
            [selectedValue]: event
        });

        if (isSubscribe) {
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'title', 'id').then(result => {
                this.setState({
                    [nextTragetState]: result
                });
            });
        }
    }

    addVariationDraw() {
        return (

            <Fragment>
                <Formik
                    initialValues={{ ...this.state.voItem }}
                    validationSchema={documentItemValidationSchema}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                        this.saveVariationOrderItem()
                    }}                >
                    {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                        <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate" >

                            <div className='document-fields'>

                                <div className="company__total proForm tabinsideItem">

                                    <ul id="stepper__tabs" className="data__tabs ">
                                        <li className={"data__tabs--list " + (this.state.currIndex === 1 ? " active" : " ")} index={this.state.currIndex} onClick={e => { this.setState({ currIndex: 1 }) }} >{Resources.material[currentLanguage]}</li>
                                        <li className={"data__tabs--list " + (this.state.currIndex === 2 ? " active" : " ")} onClick={e => { this.setState({ currIndex: 2 }) }} >{Resources.labor[currentLanguage]}</li>
                                        <li className={"data__tabs--list " + (this.state.currIndex === 3 ? " active" : " ")} onClick={e => { this.setState({ currIndex: 3 }) }} >{Resources.equipment[currentLanguage]}</li>
                                    </ul>
                                </div>

                                <div className="letterFullWidth proForm  first-proform proform__twoInput">
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['description'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.description ? 'has-error' : !errors.description && touched.description ? (" has-success") : " ")}>
                                            <input name='description'
                                                className="form-control"
                                                id="description" placeholder={Resources['description'][currentLanguage]}
                                                autoComplete='off'
                                                onBlur={handleBlur}
                                                value={this.state.voItem.description}
                                                onChange={(e) => this.handleChangeItem(e, 'description')} />
                                            {errors.description ? (<em className="pError">{errors.description}</em>) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="proForm datepickerContainer">
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.quantity[currentLanguage]}</label>
                                        <div className={"ui input inputDev" + (errors.quantity ? 'has-error' : !errors.quantity && touched.quantity ? (" has-success") : " ")}>
                                            <input type="text" className="form-control" id="quantity"
                                                value={this.state.voItem.quantity}
                                                name="quantity"
                                                onBlur={handleBlur}
                                                placeholder={Resources.quantity[currentLanguage]}
                                                onChange={(e) => this.handleChangeItem(e, 'quantity')} />
                                            {errors.quantity ? (<em className="pError">{errors.quantity}</em>) : null}

                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.unitPrice[currentLanguage]}</label>
                                        <div className={"ui input inputDev" + (errors.unitPrice ? 'has-error' : !errors.unitPrice && touched.unitPrice ? (" has-success") : " ")}>
                                            <input type="text" className="form-control" id="unitPrice"
                                                value={this.state.voItem.unitPrice}
                                                name="unitPrice"
                                                onBlur={handleBlur}
                                                placeholder={Resources.unitPrice[currentLanguage]}
                                                onChange={(e) => this.handleChangeItem(e, 'unitPrice')} />
                                            {errors.unitPrice ? (<em className="pError">{errors.unitPrice}</em>) : null}

                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['itemCode'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.itemCode ? 'has-error' : !errors.itemCode && touched.itemCode ? (" has-success") : " ")}>
                                            <input name='itemCode'
                                                className="form-control"
                                                id="itemCode" placeholder={Resources['itemCode'][currentLanguage]} autoComplete='off'
                                                onBlur={handleBlur} value={this.state.voItemitemCode}
                                                onChange={(e) => this.handleChangeItem(e, "itemCode")} />
                                            {errors.itemCode ? (<em className="pError">{errors.itemCode}</em>) : null}
                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['resourceCode'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.resourceCode ? 'has-error' : !errors.resourceCode && touched.resourceCode ? (" has-success") : " ")}>
                                            <input name='resourceCode'
                                                className="form-control"
                                                id="resourceCode" placeholder={Resources['resourceCode'][currentLanguage]} autoComplete='off'
                                                onBlur={handleBlur} value={this.state.voItem.resourceCode}
                                                onChange={(e) => this.handleChangeItem(e, "resourceCode")} />
                                            {errors.resourceCode ? (<em className="pError">{errors.resourceCode}</em>) : null}
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="unit"
                                            data={this.state.units}
                                            selectedValue={this.state.selectedUnit}
                                            handleChange={(e) => this.handleChangeItemDropDown(e, "unit", 'selectedUnit', false, '', '', '')}
                                            index="unit" />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="boqType"
                                            data={this.state.boqTypes}
                                            selectedValue={this.state.selectedBoqType}
                                            handleChange={event => this.handleChangeItemDropDown(event, 'boqTypeId', 'selectedBoqType', true, 'GetAllBoqChild', 'parentId', 'BoqTypeChilds')}
                                            name="boqType"
                                            index="boqType" />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown
                                            title="boqTypeChild"
                                            data={this.state.BoqTypeChilds}

                                            selectedValue={this.state.selectedBoqTypeChild}
                                            handleChange={event => this.handleChangeItemDropDown(event, 'boqTypeChildId', 'selectedBoqTypeChild', true, 'GetAllBoqChild', 'parentId', 'BoqSubTypes')}

                                            name="boqTypeChild"
                                            index="boqTypeChild" />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <div className="linebylineInput valid-input">
                                            <Dropdown
                                                title="boqSubType"
                                                data={this.state.BoqSubTypes}
                                                selectedValue={this.state.selectedBoqSubType}
                                                handleChange={event => this.handleChangeItemDropDown(event, 'boqSubTypeId', 'selectedBoqSubType', false, '', '', '')}
                                                name="boqSubType"
                                                index="boqSubType" />
                                        </div>
                                    </div>

                                    {this.state.currIndex === 3 ?
                                        <Fragment>
                                            <div className="linebylineInput valid-input">
                                                <Dropdown
                                                    title="equipmentType"
                                                    data={this.state.equipmentTypes}
                                                    selectedValue={this.state.selectedEquipmenttypeId}
                                                    handleChange={event => this.handleChangeItemDropDown(event, 'equipmenttypeId', 'selectedEquipmenttypeId', false, '', '', '')}
                                                    name="equipmenttypeId"
                                                    index="equipmenttypeId" />
                                            </div>
                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='dueBack'
                                                    format={'DD/MM/YYYY'}
                                                    name="dueBack"
                                                    startDate={this.state.voItem.dueBack}
                                                    handleChange={e => this.handleChangeDateItem(e, 'dueBack')} />
                                            </div>
                                        </Fragment>


                                        : null
                                    }

                                    {this.state.currIndex != 1 ?
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['days'][currentLanguage]} </label>
                                            <div className={"inputDev ui input " + (errors.days ? 'has-error' : !errors.days && touched.days ? (" has-success") : " ")}>
                                                <input name='days'
                                                    className="form-control"
                                                    id="days" placeholder={Resources['days'][currentLanguage]}
                                                    autoComplete='off'
                                                    onBlur={handleBlur} value={this.state.voItem.days}
                                                    onChange={(e) => this.handleChangeItem(e, "days")} />
                                                {errors.days ? (<em className="pError">{errors.days}</em>) : null}
                                            </div>
                                        </div>
                                        : null
                                    }

                                    <div className={"slider-Btns fullWidthWrapper textLeft "}>
                                        <button className={"primaryBtn-1 btn " + (this.state.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.state.isApproveMode} >{Resources["save"][currentLanguage]}</button>
                                    </div>

                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>

            </Fragment>

        )
    }

    render() {
        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }, {
                title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            }

        ];

        return (
            <div className="mainContainer">

                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <div className="submittalHead">
                        <h2 className="zero">{Resources.pco[currentLanguage]}
                            <span>{projectName.replace(/_/gi, ' ')} · {Resources.contracts[currentLanguage]}</span>
                        </h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                    <g id="Group">
                                                        <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                        <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
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
                            {this.state.FirstStep ?
                                <Fragment>
                                    <div id="step1" className="step-content-body">
                                        <div className="subiTabsContent">
                                            <div className="document-fields">
                                                <Formik
                                                    initialValues={{ ...this.state.document }}
                                                    validationSchema={validationSchema}
                                                    enableReinitialize={this.props.changeStatus}
                                                    onSubmit={(values) => {
                                                        if (this.props.changeStatus === false && this.state.docId === 0) {
                                                            this.saveVariationOrder();
                                                        } else {
                                                            this.NextStep();
                                                        }
                                                    }}  >

                                                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                        <Form id="InspectionRequestForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                                            <div className="proForm first-proform">

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                                    <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                        <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                                            placeholder={Resources.subject[currentLanguage]}
                                                                            autoComplete='off'
                                                                            value={this.state.document.subject}
                                                                            onBlur={(e) => {
                                                                                handleBlur(e)
                                                                                handleChange(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'subject')} />
                                                                        {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}

                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.status[currentLanguage]}</label>
                                                                    <div className="ui checkbox radio radioBoxBlue">
                                                                        <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                                                        <label>{Resources.oppened[currentLanguage]}</label>
                                                                    </div>
                                                                    <div className="ui checkbox radio radioBoxBlue">
                                                                        <input type="radio" name="letter-status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
                                                                        <label>{Resources.closed[currentLanguage]}</label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="proForm datepickerContainer">

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                                    <div className={"inputDev ui input" + (errors.description && touched.description ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                        <input name='description' className="form-control fsadfsadsa" id="description"
                                                                            placeholder={Resources.description[currentLanguage]}
                                                                            autoComplete='off'
                                                                            value={this.state.document.description}
                                                                            onBlur={(e) => {
                                                                                handleBlur(e)
                                                                                handleChange(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'description')} />
                                                                        {touched.description ? (<em className="pError">{errors.description}</em>) : null}

                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input alternativeDate">
                                                                    <DatePicker title='docDate'
                                                                        format={'DD/MM/YYYY'}
                                                                        onChange={e => setFieldValue('docDate', e)}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.docDate}
                                                                        touched={touched.docDate}
                                                                        name="docDate"
                                                                        startDate={this.state.document.docDate}
                                                                        handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="fromCompany"
                                                                        data={this.state.companies}
                                                                        isMulti={false}
                                                                        selectedValue={this.state.selectedFromCompany}
                                                                        handleChange={event => {
                                                                            this.handleChangeDropDown(event, 'companyId', false, '', '', '', '', '')
                                                                        }}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.companyId}
                                                                        touched={touched.companyId}

                                                                        index="companyId"
                                                                        name="companyId"
                                                                        id="companyId" />
                                                                </div>
                                                                {this.props.changeStatus === true ?
                                                                    <div className="linebylineInput valid-input">

                                                                        <label className="control-label">{Resources.contractPo[currentLanguage]}</label>
                                                                        <div className="ui input inputDev"  >
                                                                            <input type="text" className="form-control" id="contractPotitle" readOnly
                                                                                value={this.state.document.contractSubject}
                                                                                name="contractPotitle" />
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <div className="linebylineInput valid-input">
                                                                        <Dropdown
                                                                            title="contractPo"
                                                                            data={this.state.contractsPos}
                                                                            selectedValue={this.state.selectContract}
                                                                            handleChange={event => this.handleChangeDropDown(event, 'contractId', 'selectContract', false)}
                                                                            index="contractId"
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}
                                                                            error={errors.contractId}
                                                                            touched={touched.contractId}
                                                                            isClear={false}
                                                                            name="contractId"
                                                                            id="contractId" />
                                                                    </div>
                                                                }
                                                                <div className="linebylineInput  account__checkbox">
                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">{Resources.isLumpSum[currentLanguage]}</label>
                                                                        <div className="ui checkbox radio radioBoxBlue">
                                                                            <input type="radio" name="vo-isLumpSum" defaultChecked={this.state.document.isLumpSum === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'isLumpSum')} />
                                                                            <label>{Resources.yes[currentLanguage]}</label>
                                                                        </div>
                                                                        <div className="ui checkbox radio radioBoxBlue">
                                                                            <input type="radio" name="vo-isLumpSum" defaultChecked={this.state.document.isLumpSum === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'isLumpSum')} />
                                                                            <label>{Resources.no[currentLanguage]}</label>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input">

                                                                    <label className="control-label">{Resources.arrange[currentLanguage]}</label>

                                                                    <div className="ui input inputDev"  >

                                                                        <input type="text" className="form-control" id="arrange" readOnly
                                                                            value={this.state.document.arrange}
                                                                            name="arrange"
                                                                            placeholder={Resources.arrange[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'arrange')} />
                                                                    </div>
                                                                </div>

                                                                {this.props.changeStatus === true ?
                                                                    <div className="proForm first-proform letterFullWidth proform__twoInput">
                                                                        <div className="linebylineInput valid-input">
                                                                            <label className="control-label">{Resources.approvalStatus[currentLanguage]}</label>
                                                                            <div className="ui input inputDev"  >
                                                                                <input type="text" className="form-control" id="approvalStatusTitle" readOnly
                                                                                    value={this.state.document.approvalStatusTitle}
                                                                                    name="approvalStatusTitle" />
                                                                            </div>
                                                                        </div>

                                                                        <div className="linebylineInput valid-input">
                                                                            <label className="control-label">{Resources.cvr[currentLanguage]}</label>
                                                                            <div className="ui input inputDev"  >
                                                                                <input type="text" className="form-control" id="cvrtitle" readOnly
                                                                                    value={this.state.document.cvrName}
                                                                                    name="cvrtitle" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <Fragment>
                                                                        <div className="linebylineInput valid-input">
                                                                            <Dropdown title="approvalStatus"
                                                                                isMulti={false}
                                                                                data={this.state.approvalstatusList}
                                                                                selectedValue={this.state.selectedApprovalStatusId}
                                                                                handleChange={(e) => this.handleChangeDropDown(e, "approvalStatusId", 'selectedApprovalStatusId', false, '', '', '', '')}

                                                                                onChange={setFieldValue}
                                                                                onBlur={setFieldTouched}
                                                                                error={errors.approvalStatusId}
                                                                                touched={touched.approvalStatusId}

                                                                                isClear={false}
                                                                                index="pco-approvalStatusId"
                                                                                name="approvalStatusId"
                                                                                id="approvalStatusId" />
                                                                        </div>
                                                                        <div className="linebylineInput valid-input">
                                                                            <Dropdown
                                                                                title="cvr"
                                                                                data={this.state.variations}
                                                                                selectedValue={this.state.selectedCVR}
                                                                                handleChange={event => this.handleChangeDropDown(event, 'cvrId', 'selectedCVR', false)}
                                                                                index="cvrId"
                                                                               
                                                                                isClear={false}
                                                                                name="cvrId" />
                                                                        </div>
                                                                    </Fragment>
                                                                }
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.profit[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev" + (errors.profit && touched.profit ? (" has-error") : "ui input inputDev")} >
                                                                        <input type="text" className="form-control" id="profit" value={this.state.document.profit} name="profit"
                                                                            placeholder={Resources.profit[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'profit')} />
                                                                        {touched.profit ? (<em className="pError">{errors.profit}</em>) : null}

                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.overHead[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev" + (errors.overHead && touched.overHead ? (" has-error") : "ui input inputDev")} >
                                                                        <input type="text" className="form-control"
                                                                            id="overHead" value={this.state.document.overHead}
                                                                            name="overHead"
                                                                            placeholder={Resources.overHead[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'overHead')} />
                                                                        {touched.overHead ? (<em className="pError">{errors.overHead}</em>) : null}

                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.timeExtension[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev" + (errors.timeExtension && touched.timeExtension ? (" has-error") : "ui input inputDev")} >
                                                                        <input type="text"
                                                                            className="form-control"
                                                                            id="timeExtension"
                                                                            value={this.state.document.timeExtensionRequired}
                                                                            name="timeExtension"
                                                                            placeholder={Resources.timeExtension[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'timeExtensionRequired')} />
                                                                        {touched.timeExtension ? (<em className="pError">{errors.timeExtension}</em>) : null}

                                                                    </div>
                                                                </div>

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
                                                    {this.state.docId > 0 ?
                                                        <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                        : null
                                                    }
                                                    {this.viewAttachments()}

                                                    {this.props.changeStatus === true ?
                                                        <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                        : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                                :
                                <Fragment>

                                    <div className="subiTabsContent feilds__top">


                                        {this.addVariationDraw()}

                                        <div className="doc-pre-cycle">
                                            <header>
                                                <h2 className="zero">{Resources['AddedItems'][currentLanguage]}</h2>
                                            </header>
                                            <ReactTable
                                                ref={(r) => {
                                                    this.selectTable = r;
                                                }}
                                                data={this.state.voItems}
                                                columns={columns}
                                                defaultPageSize={10}
                                                minRows={2}
                                                noDataText={Resources['noData'][currentLanguage]}
                                            />
                                        </div>

                                        <div className="doc-pre-cycle">
                                            <div className="slider-Btns">
                                                <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>{Resources['next'][currentLanguage]}</button>
                                            </div>

                                        </div>
                                    </div>

                                </Fragment>}

                        </div>
                        <div className="docstepper-levels">
                            {/* Next & Previous */}
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={!this.state.FirstStep && this.state.docId !== 0 ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}><i className="fa fa-caret-left" aria-hidden="true"></i>{Resources.previous[currentLanguage]}</span>

                                <span onClick={this.NextTopStep} className={!this.state.ThirdStepComplate && this.state.docId !== 0 ? "step-content-btn-prev "
                                    : "step-content-btn-prev disabled"}>{Resources.next[currentLanguage]}<i className="fa fa-caret-right" aria-hidden="true"></i>
                                </span>
                            </div>
                            {/* Steps Active  */}
                            <div className="workflow-sliderSteps">
                                <div className="step-slider">
                                    <div data-id="step1" className={'step-slider-item ' + (this.state.SecondStepComplate ? "active" : 'current__step')} >
                                        <div className="steps-timeline">
                                            <span>1</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources.pco[currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div data-id="step2 " className={'step-slider-item ' + (this.state.ThirdStepComplate ? 'active' : this.state.SecondStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources.items[currentLanguage]}</h6>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {
                            this.props.changeStatus === true ?
                                <div className="approveDocument">
                                    <div className="approveDocumentBTNS">

                                        {this.state.isApproveMode === true ?
                                            <div >
                                                <button className="primaryBtn-1 btn " onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                <button className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>


                                            </div>
                                            : null
                                        }
                                        <button className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                        <button className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                                        <span className="border"></span>
                                        <div className="document__action--menu">
                                            <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                        </div>
                                    </div>
                                </div>
                                : null
                        }
                    </div>
                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {this.state.currentComponent}
                    </SkyLight>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        changeStatus: state.communication.changeStatus,
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow,
        projectId: state.communication.projectId
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
)(withRouter(pcoAddEdit))
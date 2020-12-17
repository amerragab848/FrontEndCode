import React, { Component, Fragment } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import ReactTable from "react-table";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight from 'react-skylight';
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import Steps from "../../Componants/publicComponants/Steps";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
//import SkyLight from "react-skylight";

var steps_defination = [];

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({

    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    description: Yup.string().required(Resources['description'][currentLanguage]),

    companyId: Yup.string().required(Resources['fromCompanyRequired'][currentLanguage]),

    profit: Yup.string().required(Resources['profit'][currentLanguage])
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),

    overHead: Yup.string().required(Resources['overHead'][currentLanguage])
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),

    approvalStatusId: Yup.string()
        .required(Resources['overHead'][currentLanguage]),

    timeExtensionRequired: Yup.string().required(Resources['timeExtension'][currentLanguage])
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage])
})

const documentItemValidationSchema = Yup.object().shape({
    description: Yup.string()
        .required(Resources['subjectRequired'][currentLanguage]),
    resourceCode: Yup.string()
        .required(Resources['resourceCode'][currentLanguage]),
    itemCode: Yup.string()
        .required(Resources['itemCode'][currentLanguage]),

    unitPrice: Yup.number().required(Resources['unitPrice'][currentLanguage]),

    days: Yup.string()
        .matches(/(^[0-9]+$)/, Resources['onlyNumbers'][currentLanguage]),

    quantity: Yup.number().required(Resources['quantity'][currentLanguage])
      
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
        Header: Resources['itemType'][currentLanguage],
        accessor: 'itemTypeName',
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
    }, {
        Header: Resources['unit'][currentLanguage],
        accessor: 'unit',
        width: 120,
    }
]

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;

const find = require('lodash/find')

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
                    perviousRoute = obj.perviousRoute;
                }
                catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            currIndex: 1,
            pageSize: 500,
            pageNumber: 0,
            CurrStep: 0,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            showPopUp: false,
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
            selectedUnitToEdit: { label: Resources.unit[currentLanguage], value: "0" },
            selectedBoqTypeToEdit: { label: Resources.boqType[currentLanguage], value: "0" },
            selectedBoqTypeChildToEdit: { label: Resources.boqType[currentLanguage], value: "0" },
            selectedBoqSubTypeToEdit: { label: Resources.boqType[currentLanguage], value: "0" },
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
            voItemToEdit: {
                id: 0,
                description: '',
                quantity: 1,
                unitPrice: 0,
                unit: '',
                unitName: '',
                boqTypeId: '',
                boqSubTypeId: '',
                boqTypeChildId: '',
                days: 1,
                itemCode: '',
                resourceCode: '',
                equipmenttypeId: '',
                dueBack: moment()
            },
            permission: [
                { name: 'sendByEmail', code: 154 },
                { name: 'sendByInbox', code: 153 },
                { name: 'sendTask', code: 1 },
                { name: 'distributionList', code: 976 },
                { name: 'createTransmittal', code: 3062 },
                { name: 'createVO', code: 4021 },
                { name: 'sendToWorkFlow', code: 724 },
                { name: 'viewAttachments', code: 3298 },
                { name: 'deleteAttachments', code: 3020 }],
            selectContract: { label: Resources.selectContract[currentLanguage], value: "0" },
            selectPco: { label: Resources.pco[currentLanguage], value: "0" },
            pcos: [],
            contractsPos: [],
            voItems: [],
            CurrentStep: 0
        }

        if (!Config.IsAllow(148) && !Config.IsAllow(149) && !Config.IsAllow(151)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }

        steps_defination = [
            {
                name: "pco",
                callBackFn: null
            },
            {
                name: "items",
                callBackFn: null
            }
        ];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            let serverChangeOrder = { ...nextProps.document };
            serverChangeOrder.docDate = moment(serverChangeOrder.docDate).format('YYYY-MM-DD');
            serverChangeOrder.dateApproved = moment(serverChangeOrder.resultDate).format('YYYY-MM-DD');
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
            if (!Config.IsAllow(149)) {
                this.setState({ isViewMode: true });
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (this.state.isApproveMode != true && Config.IsAllow(149)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(149)) {
                        //close => false
                        if (this.props.document.status !== false && Config.IsAllow(149)) {
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

        if (this.state.docId > 0) {
            this.props.actions.documentForEdit("GetContractsPcoForEdit?id=" + this.state.docId, this.state.docTypeId, 'pco');

            dataservice.GetDataGrid("GetContractsPcoItemsByProposalIdUsingPaging?proposalId=" + this.state.docId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize).then(result => {
                let data = { items: result };
                this.props.actions.ExportingData(data);
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
                status: true,
                isLumpSum: false,
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
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=0&contactId=0";
        // this.props.actions.GetNextArrange(url);
        dataservice.GetNextArrangeMainDocument(url).then(res => {
            updated_document.arrange = res;
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document
            });
        })
    }

    fillDropDowns(isEdit) {
        dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId', 'companies', this.state.projectId, "projectId").then(result => {

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

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=approvalstatus", 'title', 'id', 'defaultLists', "approvalstatus", "listType").then(result => {
            if (isEdit) {
                let approvalStatusId = this.state.document.approvalStatusId;
                let approvalStatus = {};
                if (approvalStatusId) {
                    approvalStatus = find(result, function (i) { return i.value == approvalStatusId; });

                    this.setState({
                        selectedApprovalStatusId: approvalStatus
                    });
                }
            }
            this.setState({
                approvalstatusList: [...result]
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=unit", 'title', 'title', 'defaultLists', "discipline", "listType").then(result => {
            this.setState({
                units: [...result]
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=equipmenttype", 'title', 'id', 'defaultLists', "discipline", "listType").then(result => {
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
                    selectedCVRId = find(result, function (i) { return i.value == selectedCVRId; });

                    this.setState({
                        selectedCVR: cvr
                    });
                }
            }
            this.setState({
                variations: [...result]
            });
        });

        dataservice.GetDataList("GetContractsForList?projectId=" + this.state.projectId, 'subject', 'id').then(ContractData => {
            if (isEdit) {
                if (this.state.document.contractId) {
                    let contractId = this.state.document.contractId;
                    let contractSubject = find(ContractData, function (i) { return i.value === contractId });
                    this.setState({
                        selectContract: contractSubject
                    })
                }
            }
            this.setState({
                contractsPos: ContractData
            })
        });

    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
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

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('EditContractsPco', saveDocument).then(result => {
            this.setState({
                isLoading: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(res => {
            this.setState({
                isLoading: false
            });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    saveVariationOrder(event) {
        this.setState({
            isLoading: true
        });
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        saveDocument.projectId = this.state.projectId;

        dataservice.addObject('AddContractsPco', saveDocument).then(result => {
            if (result.id) {
                this.setState({
                    isLoading: false,
                    docId: result.id
                });

                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        }).catch(res => {
            this.setState({
                isLoading: false
            });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    showBtnsSaving() {
        let btn = null;
        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = <button type="submit" className={"primaryBtn-1 btn meduimBtn " + (this.state.isViewMode === true ? " disNone" : " ")} >{Resources.next[currentLanguage]}</button>
        }
        return btn;
    }

    viewAttachments() {
        return (
            this.state.docId > 0 ? (
                Config.IsAllow(3298) === true ?
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrStep: stepNo });
    };

    saveVariationOrderItem(event) {
        let saveDocument = { ...this.state.voItem };

        saveDocument.proposalId = this.state.docId;
        saveDocument.unit = this.state.selectedUnit.value;
        saveDocument.boqTypeId = this.state.selectedBoqType.value;
        saveDocument.boqChildTypeId = this.state.selectedBoqTypeChild.value;
        saveDocument.boqSubTypeId = this.state.selectedBoqSubType.value;

        let currentTab = this.state.currIndex;
        saveDocument.action = currentTab;

        if (this.state.currIndex === 3) {
            saveDocument.dueBack = moment(saveDocument.dueBack, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        }
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

    EditVariationOrderItem(event) {
        let saveDocument = { ...this.state.voItemToEdit };

        saveDocument.proposalId = this.state.docId;
        saveDocument.unit = this.state.selectedUnitToEdit.value;
        saveDocument.unitName = this.state.selectedUnitToEdit.label;
        saveDocument.boqTypeId = this.state.selectedBoqTypeToEdit.value;
        saveDocument.boqChildTypeId = this.state.selectedBoqTypeChildToEdit.value;
        saveDocument.boqSubTypeId = this.state.selectedBoqSubTypeToEdit.value;
        saveDocument.boqType = this.state.selectedBoqTypeToEdit.label;
        saveDocument.boqChildType = this.state.selectedBoqTypeChildToEdit.label;
        saveDocument.boqSubType = this.state.selectedBoqSubTypeToEdit.label;


        let currentTab = this.state.currIndex;
        saveDocument.action = currentTab;

        if (this.state.currIndex === 3) {
            saveDocument.dueBack = moment(saveDocument.dueBack, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        }
        dataservice.addObject('EditContractsPcoItems', saveDocument).then(result => {
            if (result) {
                let oldItems = [...this.state.voItems];
                //oldItems.push(result);
                oldItems.map(function (item, i) {
                    if (item.id == saveDocument.id) {
                        item.arrange = saveDocument.arrange;
                        item.description = saveDocument.description;
                        item.quantity = saveDocument.quantity;
                        item.unitPrice = saveDocument.unitPrice;
                        item.resourceCode = saveDocument.resourceCode;
                        item.itemCode = saveDocument.itemCode;
                        item.boqTypeId = saveDocument.boqTypeId;
                        item.boqType = saveDocument.boqType;
                        item.boqTypeChildId = saveDocument.boqTypeChildId;
                        item.boqTypeChild = saveDocument.boqChildType;
                        item.boqSubTypeId = saveDocument.boqSubTypeId;
                        item.boqSubType = saveDocument.boqSubType;
                        item.unit = saveDocument.unitName;

                    }
                })
                this.setState({
                    voItems: [...oldItems],
                    showPopUp: false
                });
                this.simpleDialog1.hide();
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        }).catch(res => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    handleChangeItem(e, field, isEdit) {
        if (isEdit == true) {
            let original_document = { ...this.state.voItemToEdit };

            let updated_document = {};

            updated_document[field] = e.target.value;

            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                voItemToEdit: updated_document
            });
        } else {
            let original_document = { ...this.state.voItem };

            let updated_document = {};

            updated_document[field] = e.target.value;

            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                voItem: updated_document
            });
        }

    }

    handleChangeItemDropDown(event, field, selectedValue, isSubscribe, url, param, nextTragetState, isEdit) {
        if (event == null) return;
        if (isEdit == true) {
            let original_document = { ...this.state.voItemToEdit };
            let updated_document = {};
            updated_document[field] = event.value;
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                voItemToEdit: updated_document,
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
        } else {
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
                    }}>
                    {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                        <Form id="voItemForm" className="proForm datepickerContainer customProform" noValidate="novalidate">
                            <div className='document-fields'>
                                <div className="company__total proForm tabinsideItem">
                                    <ul id="stepper__tabs" className="data__tabs ">
                                        <li className={"data__tabs--list " + (this.state.currIndex === 1 ? " active" : " ")} index={this.state.currIndex} onClick={() => this.setState({ currIndex: 1 })} >{Resources.material[currentLanguage]}</li>
                                        <li className={"data__tabs--list " + (this.state.currIndex === 2 ? " active" : " ")} onClick={() => this.setState({ currIndex: 2 })} >{Resources.labor[currentLanguage]}</li>
                                        <li className={"data__tabs--list " + (this.state.currIndex === 3 ? " active" : " ")} onClick={() => this.setState({ currIndex: 3 })} >{Resources.equipment[currentLanguage]}</li>
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

    GetPrevoiusData() {

        let pageNumber = this.state.pageNumber - 1;

        if (pageNumber >= 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });

            let oldRows = [...this.state.voItems];

            dataservice.GetDataGrid("GetContractsPcoItemsByProposalIdUsingPaging?proposalId=" + this.state.docId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize).then(result => {

                const newRows = [...this.state.voItems, ...result];

                this.setState({
                    voItems: newRows,
                    isLoading: false
                });
            }).catch(ex => {
                this.setState({
                    voItems: oldRows,
                    isLoading: false
                });
            });
        }
    }

    GetNextData() {
        let pageNumber = this.state.pageNumber + 1;

        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });

        let oldRows = [...this.state.voItems];

        dataservice.GetDataGrid("GetContractsPcoItemsByProposalIdUsingPaging?proposalId=" + this.state.docId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize).then(result => {

            const newRows = [...this.state.voItems, ...result];

            this.setState({
                voItems: newRows,
                isLoading: false
            });
        }).catch(ex => {
            this.setState({
                voItems: oldRows,
                isLoading: false
            });
        });
    }

    viewModelToEdit(id, row) {

        var unitObj = {};

        this.setState({
            showPopUp: true,
            voItemToEdit: row,
            selectedBoqTypeToEdit: { value: row.boqTypeId, label: row.boqType },
            selectedBoqTypeChildToEdit: { value: row.boqChildTypeId, label: row.boqTypeChild },
            selectedBoqSubTypeToEdit: { value: row.boqSubTypeId, label: row.boqSubType },
            selectedUnitToEdit: { value: row.unit, label: row.unit }
        })
        this.simpleDialog1.show();
    }

    render() {
        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.pco[currentLanguage]} moduleTitle={Resources['contracts'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            {this.state.CurrStep === 0 ?
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
                                                        if (this.props.changeStatus === false && this.state.docId === 0) {
                                                            this.saveVariationOrder();
                                                        } else {
                                                            if (this.props.changeStatus) {
                                                                this.editVariationOrder();
                                                            } else {
                                                                this.changeCurrentStep(1);
                                                            }
                                                        }
                                                    }}>
                                                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                        <Form id="PCOForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
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
                                                                    <div className={"inputDev ui input" + (errors.description && touched.description ? (" has-error") : !errors.description && touched.description ? (" has-success") : " ")} >
                                                                        <input
                                                                            name='description'
                                                                            id="description"
                                                                            className="form-control fsadfsadsa"
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
                                                                            this.handleChangeDropDown(event, 'companyId', 'selectedFromCompany', '', '', '', '', '')
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
                                                                    <Fragment>
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
                                                                    </Fragment>
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
                                                                        <input type="text"
                                                                            className="form-control"
                                                                            id="profit"
                                                                            value={this.state.document.profit}
                                                                            name="profit"
                                                                            placeholder={Resources.profit[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'profit')} />
                                                                        {touched.profit ? (<em className="pError">{ errors.profit}</em>) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.overHead[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev" + (errors.overHead && touched.overHead ? (" has-error") : "ui input inputDev")} >
                                                                        <input type="text" className="form-control"
                                                                            id="overHead"
                                                                            value={this.state.document.overHead}
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
                                                                    <div className={"ui input inputDev" + (errors.timeExtensionRequired && touched.timeExtensionRequired ? (" has-error") : "ui input inputDev")} >
                                                                        <input type="text"
                                                                            className="form-control"
                                                                            id="timeExtensionRequired"
                                                                            value={this.state.document.timeExtensionRequired}
                                                                            name="timeExtensionRequired"
                                                                            placeholder={Resources.timeExtension[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'timeExtensionRequired')} />
                                                                        {touched.timeExtensionRequired ? (<em className="pError">{errors.timeExtensionRequired}</em>) : null}
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
                                                                    :
                                                                    this.showBtnsSaving()}
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </div>
                                            <div className="doc-pre-cycle letterFullWidth">
                                                <div>
                                                    {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={3019} EditAttachments={3257} ShowDropBox={3571} ShowGoogleDrive={3572} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                                    {this.viewAttachments()}
                                                    {this.props.changeStatus === true ?
                                                        <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                        : null}
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
                                            <div class="submittalFilter">
                                                <div class="subFilter">
                                                    <h3 class="zero"> {Resources['AddedItems'][currentLanguage]}</h3>
                                                    <span>{this.state.voItems.length}</span>
                                                </div>
                                                <div className="rowsPaginations readOnly__disabled">
                                                    <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}>
                                                        <i className="angle left icon" />
                                                    </button>
                                                    <button className={this.state.totalRows !== this.state.pageSize * this.state.pageNumber + this.state.pageSize ? "rowunActive" : ""} onClick={() => this.GetNextData()}>
                                                        <i className="angle right icon" />
                                                    </button>
                                                </div>
                                            </div>
                                            <ReactTable ref={(r) => { this.selectTable = r; }} data={this.state.voItems}
                                                columns={columns} defaultPageSize={10} minRows={2} noDataText={Resources['noData'][currentLanguage]}
                                                getTrProps={(state, rowInfo, column, instance) => {
                                                    return { onClick: e => { this.viewModelToEdit(rowInfo.original.id, rowInfo.original); } };
                                                }} />
                                        </div>
                                        <div className="doc-pre-cycle">
                                            <div className="slider-Btns">
                                                <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(2)}>{Resources['next'][currentLanguage]}</button>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>}
                        </div>
                        <div>
                            <Steps
                                steps_defination={steps_defination}
                                exist_link="/pco/"
                                docId={this.state.docId}
                                changeCurrentStep={stepNo =>
                                    this.changeCurrentStep(stepNo)
                                }
                                stepNo={this.state.CurrStep}
                                changeStatus={docId === 0 ? false : true}
                            />
                        </div>
                        {
                            this.props.changeStatus === true ?
                                <div className="approveDocument">
                                    <div className="approveDocumentBTNS">
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
                                            documentName={Resources.pco[currentLanguage]}
                                        />
                                    </div>
                                </div>
                                : null
                        }
                    </div>
                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showPopUp ? "block" : "none" }}>
                    <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialog1 = ref)}
                        title={Resources.editTitle[currentLanguage] + " - " + Resources.edit[currentLanguage]}>
                        <Fragment>
                            <Formik
                                initialValues={{ ...this.state.voItemToEdit }}
                                validationSchema={documentItemValidationSchema}
                                enableReinitialize={true}
                                onSubmit={(values) => {
                                    this.EditVariationOrderItem()
                                }}
                            >
                                {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                                    <Form id="voItemForm" className="proForm" noValidate="novalidate">

                                        <div className=" dropWrapper">

                                            <div className="fillter-status fillter-item-c">
                                                <label className="control-label">{Resources.quantity[currentLanguage]}</label>
                                                <div className={"ui input inputDev" + (errors.quantity ? 'has-error' : !errors.quantity && touched.quantity ? (" has-success") : " ")}>
                                                    <input type="text" className="form-control" id="quantity"
                                                        value={this.state.voItemToEdit.quantity}
                                                        name="quantity"
                                                        onBlur={handleBlur}
                                                        placeholder={Resources.quantity[currentLanguage]}
                                                        onChange={(e) => this.handleChangeItem(e, 'quantity', true)} />
                                                    {errors.quantity ? (<em className="pError">{errors.quantity}</em>) : null}

                                                </div>
                                            </div>

                                            <div className="fillter-status fillter-item-c">
                                                <label className="control-label">{Resources.unitPrice[currentLanguage]}</label>
                                                <div className={"ui input inputDev" + (errors.unitPrice ? 'has-error' : !errors.unitPrice && touched.unitPrice ? (" has-success") : " ")}>
                                                    <input type="text" className="form-control" id="unitPrice"
                                                        value={this.state.voItemToEdit.unitPrice}
                                                        name="unitPrice"
                                                        onBlur={handleBlur}
                                                        placeholder={Resources.unitPrice[currentLanguage]}
                                                        onChange={(e) => this.handleChangeItem(e, 'unitPrice', true)} />
                                                    {errors.unitPrice ? (<em className="pError">{errors.unitPrice}</em>) : null}

                                                </div>
                                            </div>

                                            <div className="fillter-status fillter-item-c">
                                                <label className="control-label">{Resources['itemCode'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.itemCode ? 'has-error' : !errors.itemCode && touched.itemCode ? (" has-success") : " ")}>
                                                    <input name='itemCode'
                                                        className="form-control"
                                                        id="itemCode" placeholder={Resources['itemCode'][currentLanguage]} autoComplete='off'
                                                        onBlur={handleBlur} value={this.state.voItemToEdit.itemCode}
                                                        onChange={(e) => this.handleChangeItem(e, "itemCode", true)} />
                                                    {errors.itemCode ? (<em className="pError">{errors.itemCode}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="fillter-status fillter-item-c">
                                                <label className="control-label">{Resources['resourceCode'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.resourceCode ? 'has-error' : !errors.resourceCode && touched.resourceCode ? (" has-success") : " ")}>
                                                    <input name='resourceCode'
                                                        className="form-control"
                                                        id="resourceCode" placeholder={Resources['resourceCode'][currentLanguage]} autoComplete='off'
                                                        onBlur={handleBlur} value={this.state.voItemToEdit.resourceCode}
                                                        onChange={(e) => this.handleChangeItem(e, "resourceCode", true)} />
                                                    {errors.resourceCode ? (<em className="pError">{errors.resourceCode}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="fillter-status fillter-item-c">
                                                <label className="control-label">{Resources['description'][currentLanguage]} </label>
                                                <div className={"inputDev ui input " + (errors.description ? 'has-error' : !errors.description && touched.description ? (" has-success") : " ")}>
                                                    <input name='description'
                                                        className="form-control"
                                                        id="description" placeholder={Resources['description'][currentLanguage]} autoComplete='off'
                                                        onBlur={handleBlur} value={this.state.voItemToEdit.description}
                                                        onChange={(e) => this.handleChangeItem(e, "description", true)} />
                                                    {errors.description ? (<em className="pError">{errors.description}</em>) : null}
                                                </div>
                                            </div>

                                            <Dropdown
                                                title="unit"
                                                data={this.state.units}
                                                selectedValue={this.state.selectedUnitToEdit}
                                                handleChange={(e) => this.handleChangeItemDropDown(e, "unit", 'selectedUnitToEdit', false, '', '', '', true)}
                                                index="unit" />

                                            <Dropdown
                                                title="boqType"
                                                data={this.state.boqTypes}
                                                selectedValue={this.state.selectedBoqTypeToEdit}
                                                handleChange={event => this.handleChangeItemDropDown(event, 'boqTypeId', 'selectedBoqTypeToEdit', true, 'GetAllBoqChild', 'parentId', 'BoqTypeChilds', true)}
                                                name="boqType"
                                                index="boqType" />

                                            <Dropdown
                                                title="boqTypeChild"
                                                data={this.state.BoqTypeChilds}
                                                selectedValue={this.state.selectedBoqTypeChildToEdit}
                                                handleChange={event => this.handleChangeItemDropDown(event, 'boqTypeChildId', 'selectedBoqTypeChildToEdit', true, 'GetAllBoqChild', 'parentId', 'BoqSubTypes', true)}

                                                name="boqTypeChild"
                                                index="boqTypeChild" />

                                            <Dropdown
                                                title="boqSubType"
                                                data={this.state.BoqSubTypes}
                                                selectedValue={this.state.selectedBoqSubTypeToEdit}
                                                handleChange={event => this.handleChangeItemDropDown(event, 'boqSubTypeId', 'selectedBoqSubTypeToEdit', false, '', '', '', true)}
                                                name="boqSubType"
                                                index="boqSubType" />

                                            <div className={"fullWidthWrapper "}>
                                                <button className={"primaryBtn-1 btn " + (this.state.isViewMode === true ? ' disNone' : '')} type="submit" disabled={this.state.isApproveMode} >{Resources["save"][currentLanguage]}</button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Fragment>
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
        projectId: state.communication.projectId,
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(pcoAddEdit))
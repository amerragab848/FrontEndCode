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

import TextEditor from '../../Componants/OptionsPanels/TextEditor'

import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import * as communicationActions from '../../store/actions/communication';

import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";

import SkyLight from 'react-skylight';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'

import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import AddDocAttachment from "../../Componants/publicComponants/AddDocAttachment";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({

    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    refDoc: Yup.string().required(Resources['refDoc'][currentLanguage]),

    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage])
        .nullable(true),

    toContactId: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage]),

    bicContactId: Yup.string()
        .required(Resources['actionByContactRequired'][currentLanguage]),

    disciplineId: Yup.string()
        .required(Resources['disciplineRequired'][currentLanguage])
})

const documentCycleValidationSchema = Yup.object().shape({
    subject: Yup.string()
        .required(Resources['subjectRequired'][currentLanguage]).nullable(true),
    approvalStatusId: Yup.string()
        .required(Resources['approvalStatusSelection'][currentLanguage]).nullable(true),
})

let columns = [
    {
        Header: 'arrange',
        accessor: 'arrange',
        width: '30px'
    }, {
        Header: Resources['subject'][currentLanguage],
        accessor: 'subject',
        width: '150px',
    }, {
        Header: Resources['statusName'][currentLanguage],
        accessor: 'statusName',
        width: '40px',
    }, {
        Header: Resources['CompanyName'][currentLanguage],
        accessor: 'flowCompanyName',
        width: '80px',
    }, {
        Header: Resources['ContactName'][currentLanguage],
        accessor: 'flowContactName',
        width: '80px',
    }, {
        Header: Resources['docDate'][currentLanguage],
        accessor: 'docDate',
        format: 'date',
        width: '80px',
    }, {
        Header: Resources['approvalStatus'][currentLanguage],
        accessor: 'approvalStatusName',
        width: '60px',
    }, {
        Header: Resources['progressPercent'][currentLanguage],
        accessor: 'progressPercent',
        width: '60px',
    }, {
        Header: Resources['comment'][currentLanguage],
        accessor: 'cycleComment',
        width: '80px',
    }
]

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')
class materialInspectionRequestAddEdit extends Component {

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
            docId: docId,
            docTypeId: 103,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            documentCycle: {},
            companies: [],
            ToContacts: [],
            fromContacts: [],
            approvalstatusList: [],
            discplines: [],
            letters: [],
            permission: [{ name: 'sendByEmail', code: 54 }, { name: 'sendByInbox', code: 53 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 956 },
            { name: 'createTransmittal', code: 3042 }, { name: 'sendToWorkFlow', code: 707 },
            { name: 'viewAttachments', code: 3317 }, { name: 'deleteAttachments', code: 840 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            selectedActionByContactId: { label: Resources.actionByContact[currentLanguage], value: "0" },
            selectedActionByCompanyId: { label: Resources.actionByCompany[currentLanguage], value: "0" },
            selectedContract: { label: Resources.contractPoSelection[currentLanguage], value: "0" },
            selectedApprovalStatusId: { label: Resources.approvalStatus[currentLanguage], value: "0" },
            bicContacts: [],
            contractsPos: [],
            reasonForIssues: [],
            areas: [],
            buildings: [],
            answer: '',
            rfi: '',
            CurrentStep: 1,
            CycleEditLoading: false,
            CycleAddLoading: false,
            DocLoading: false
        }

        if (!Config.IsAllow(366) && !Config.IsAllow(367) && !Config.IsAllow(369)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/materialInspectionRequest/" + projectId
            });
        }

        this.newCycle = this.newCycle.bind(this);
        this.editCycle = this.editCycle.bind(this);

    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
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
        //this.checkDocumentIsView();
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            let serverInspectionRequest = { ...nextProps.document };
            serverInspectionRequest.docDate = moment(serverInspectionRequest.docDate).format('DD/MM/YYYY');
            serverInspectionRequest.requiredDate = moment(serverInspectionRequest.requiredDate).format('DD/MM/YYYY');
            serverInspectionRequest.resultDate = moment(serverInspectionRequest.resultDate).format('DD/MM/YYYY');

            this.setState({
                document: { ...serverInspectionRequest },
                hasWorkflow: nextProps.hasWorkflow,
                answer: nextProps.document.answer,
                rfi: nextProps.document.rfi
            });

            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }

        if (this.state.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }
    };

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(367)) {
                this.setState({ isViewMode: true });
            }

            if (this.state.isApproveMode != true && Config.IsAllow(367)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(367)) {
                    if (this.props.document.status !== false && Config.IsAllow(367)) {
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
        console.log('checkDocumentIsView...', this.props, this.state);
    }

    componentWillMount() {
        if (this.state.docId > 0) {
            let url = "GetMaterialInspectionRequestForEdit?id=" + this.state.docId;
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'materialInspectionRequest');
            dataservice.GetDataGrid("GetMaterialInspectionRequestCycles?materialInspectionId=" + this.state.docId).then(result => {
                this.setState({
                    IRCycles: [...result]
                })
                let data = { items: result };
                this.props.actions.ExportingData(data);

            })

            dataservice.GetDataGrid("GetMaterialRequestLastCycle?id=" + this.state.docId).then(result => {
                this.setState({
                    documentCycle: { ...result }
                });

            });

        } else {
            let materialInspectionRequest = {
                subject: '',
                id: 0,
                projectId: this.state.projectId,
                arrange: '',
                fromCompanyId: '',
                fromContactId: '',
                toCompanyId: '',
                toContactId: '',
                replayId: '',
                docDate: moment(),
                status: 'false',
                disciplineId: '',
                refDoc: '',
                sharedSettings: '',
                answer: '',
                rfi: '',
                orderId: null,
                orderType: null,
                bicCompanyId: '',
                bicContactId: '',
                fileNumberId: '',
                areaId: '',
                buildingNoId: '',
                apartmentNoId: '',
                specsSectionId: '',
                contractId: '',
                requiredDate: moment(),
                resultDate: moment(),
                reasonForIssueId: ''

            };

            this.setState({ document: materialInspectionRequest }, function () {
                this.GetNExtArrange();
            });
            this.fillDropDowns(false);
            this.props.actions.documentForAdding();
        }
    };

    GetNExtArrange() {
        let original_document = { ...this.state.document };
        let updated_document = {};
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + this.state.document.fromContactId;
        this.props.actions.GetNextArrange(url);
        dataservice.GetNextArrangeMainDocument(url).then(res => {
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
                let targetFieldSelected = _.find(result, function (i) { return i.value == toSubField; });
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        });
    }

    fillDropDowns(isEdit) {

        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId').then(result => {

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

                let bicCompanyId = this.props.document.bicCompanyId;
                if (bicCompanyId) {
                    this.setState({
                        selectedActionByCompanyId: { label: this.props.document.bicCompanyName, value: bicCompanyId }
                    });

                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', bicCompanyId, 'bicContactId', 'selectedActionByContactId', 'bicContacts');
                }
            }
            this.setState({
                companies: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=discipline", 'title', 'id').then(result => {
            if (isEdit) {
                let disciplineId = this.props.document.disciplineId;
                let discpline = {};
                if (disciplineId) {
                    discpline = _.find(result, function (i) { return i.value == disciplineId; });

                    this.setState({
                        selectedDiscpline: discpline
                    });
                }
            }
            this.setState({
                discplines: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=approvalstatus", 'title', 'id').then(result => {
            if (isEdit) {
                let approvalStatusId = this.state.documentCycle.approvalStatusId;
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

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=area", 'title', 'id').then(result => {
            if (isEdit) {
                let areaId = this.props.document.areaId;
                let area = {};
                if (areaId) {
                    area = _.find(result, function (i) { return i.value == areaId; });

                    this.setState({
                        selecetedArea: area
                    });
                }
            }
            this.setState({
                areas: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=buildingno", 'title', 'id').then(result => {
            if (isEdit) {
                let buildingno = this.props.document.buildingNoId;
                let building = {};
                if (buildingno) {
                    building = _.find(result, function (i) { return i.value == buildingno; });
                    this.setState({
                        selectedbuildingno: building
                    });
                }
            }
            this.setState({
                buildings: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=reasonforissue", 'title', 'id').then(result => {
            if (isEdit) {
                let reasonForIssueId = this.props.document.reasonForIssueId;
                let reasonForIssue = {};
                if (reasonForIssueId) {
                    reasonForIssue = _.find(result, function (i) { return i.value == reasonForIssueId; });
                    this.setState({
                        selectedReasonForIssue: reasonForIssue
                    });
                }
            }
            this.setState({
                reasonForIssues: [...result]
            });
        });

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=apartmentNumber", 'title', 'id').then(result => {
            if (isEdit) {
                let apartmentNoId = this.props.document.apartmentNoId;
                let apartmentNo = {};
                if (apartmentNoId) {
                    apartmentNo = _.find(result, function (i) { return i.value == apartmentNoId; });
                    this.setState({
                        selectedApartmentNoId: apartmentNo
                    });
                }
            }
            this.setState({
                apartmentNumbers: [...result]
            });
        });

        if (isEdit === false) {
            dataservice.GetDataList("GetPoContractForList?projectId=" + this.state.projectId, 'subject', 'id').then(result => {
                this.setState({
                    contractsPos: [...result]
                });
            });
        }

    }

    onChangeAnswer = (value) => {
        if (value != null) {
            this.setState({ answer: value });
            let original_document = { ...this.state.document };
            let updated_document = {};
            updated_document['answer'] = value;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({
                document: updated_document
            });
        }
    }
    onChangeRfi = (value) => {
        if (value != null) {
            this.setState({ rfi: value });
            let original_document = { ...this.state.document };
            let updated_document = {};
            updated_document['rfi'] = value;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({
                document: updated_document
            });
        }
    }

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

    editInspectionRequest(event) {
        this.setState({
            isLoading: true,
            DocLoading: true
        });

        let saveDocument = this.state.document;
        saveDocument.docDate = moment(saveDocument.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.resultDate = moment(saveDocument.resultDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('EditMaterialRequestOnly', saveDocument).then(result => {
            this.setState({
                isLoading: true,
                DocLoading: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
            //this.NextStep();
        });
    }

    saveInspectionRequest(event) {
        let saveDocument = { ...this.state.document };
        this.setState({
            DocLoading: true
        });

        saveDocument.docDate = moment(saveDocument.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.resultDate = moment(saveDocument.resultDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        saveDocument.projectId = this.state.projectId;

        dataservice.addObject('AddMaterialRequestOnly', saveDocument).then(result => {
            if (result.id) {
                let cycle = {
                    requestForInspectionId: result.id,
                    subject: this.state.document.subject,
                    docDate: this.state.document.docDate,
                    progressPercent: 0,
                    status: 'false',
                    approvalStatusId: null,
                    cycleComment: '',
                    arrange: 0
                };
                this.setState({
                    docId: result.id,
                    documentCycle: cycle,
                    DocLoading: false
                });

                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        }).catch(res => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({
                DocLoading: false
            });
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
        if (item.title == "sendToWorkFlow") { this.props.actions.SendingWorkFlow(true); }

        if (item.value != "0") { this.props.actions.showOptionPanel(false); 

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
                this.editInspectionRequest();
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
                pathname: "/materialInspectionRequest/" + projectId
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
                pathname: "/materialInspectionRequest/" + projectId
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

    saveInspectionRequestCycle(event) {


        let saveDocument = { ...this.state.documentCycle };

        saveDocument.projectId = this.state.projectId;
        saveDocument.requestForInspectionId = this.state.docId;
        saveDocument.disciplineId = this.state.document.disciplineId;
        saveDocument.flowCompanyId = this.state.document.bicCompanyId;
        saveDocument.flowContactId = this.state.document.bicContactId;

        let api = saveDocument.typeAddOrEdit === "editLastCycle" ? 'EditMaterialRequestCycle' : 'AddMaterialRequestCycleOnly';
        if (saveDocument.typeAddOrEdit === "editLastCycle") {
            this.setState({ CycleEditLoading: true })
        } else {
            this.setState({ CycleAddLoading: true })
        }

        dataservice.addObject(api, saveDocument).then(result => {
            if (result) {
                let cycle = {
                    subject: result.subject,
                    docDate: result.docDate,
                    progressPercent: result.progressPercent,
                    status: result.cycleStatus,
                    requestForInspectionId: this.state.docId,
                    approvalStatusId: result.approvalStatusId,
                    cycleComment: result.cycleComment,
                    arrange: 0,
                    id: result.id
                };

                this.setState({
                    documentCycle: cycle,
                    CycleEditLoading: false,
                    CycleAddLoading: false,
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        }).catch(res => {
            this.setState({
                CycleEditLoading: false,
                CycleAddLoading: false,
            });
            toast.error(Resources["operationCanceled"][currentLanguage]);

        });
    }

    handleChangeCycle(e, field) {

        let original_document = { ...this.state.documentCycle };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            documentCycle: updated_document
        });
    }

    handleChangeCycleDropDown(event, field, selectedValue) {
        if (event == null) return;
        let original_document = { ...this.state.documentCycle };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            documentCycle: updated_document,
            [selectedValue]: event
        });

    }

    newCycle(e) {

        let cycleObj = { ...this.state.documentCycle };
        cycleObj.typeAddOrEdit = "";
        this.setState({
            documentCycle: { ...cycleObj }
        });
    }

    editCycle(e) {

        let cycleObj = { ...this.state.documentCycle };
        cycleObj.typeAddOrEdit = "editLastCycle";
        this.setState({
            documentCycle: { ...cycleObj }
        });
    }

    AddNewCycle() {
        return (
            <Fragment>
                <Formik
                    initialValues={{ ...this.state.documentCycle }}
                    validationSchema={documentCycleValidationSchema}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                        this.saveInspectionRequestCycle()
                    }}>

                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                        <Form id="InspectionRequestCycleForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                            <header className="main__header">
                                <div className="main__header--div">
                                    <h2 className="zero">{Resources['newCycle'][currentLanguage]}</h2>
                                </div>
                            </header>

                            <div className='document-fields'>

                                <div className="proForm first-proform">

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                            <input name='subject'
                                                id="subject"
                                                className="form-control fsadfsadsa"
                                                placeholder={Resources.subject[currentLanguage]}
                                                autoComplete='off'
                                                value={this.state.documentCycle.subject}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }}
                                                onChange={(e) => this.handleChangeCycle(e, 'subject')} />
                                            {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}

                                        </div>
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.status[currentLanguage]}</label>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="IR-cycle-status" defaultChecked={this.state.documentCycle.cycleStatus === false ? null : 'checked'} value="true" onChange={e => this.handleChangeCycle(e, 'status')} />
                                            <label>{Resources.oppened[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="IR-cycle-status" defaultChecked={this.state.documentCycle.cycleStatus === false ? 'checked' : null} value="false" onChange={e => this.handleChangeCycle(e, 'status')} />
                                            <label>{Resources.closed[currentLanguage]}</label>
                                        </div>
                                    </div>

                                </div>
                                <div className="proForm datepickerContainer">
                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="approvalStatus"
                                            isMulti={false}
                                            data={this.state.approvalstatusList}
                                            selectedValue={this.state.selectedApprovalStatusId}
                                            handleChange={(e) => this.handleChangeCycleDropDown(e, "approvalStatusId", 'selectedApprovalStatusId')}

                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.approvalStatusId}
                                            touched={touched.approvalStatusId}
                                            isClear={false}
                                            index="IR-approvalStatusId"
                                            name="approvalStatusId"
                                            id="approvalStatusId" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['comment'][currentLanguage]}</label>
                                        <div className='ui input inputDev '>
                                            <input autoComplete="off"
                                                value={this.state.documentCycle.cycleComment}
                                                className="form-control" name="comment"
                                                onBlur={(e) => { handleBlur(e) }}
                                                onChange={(e) => { this.handleChangeCycle(e, 'cycleComment') }}
                                                placeholder={Resources['comment'][currentLanguage]} />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['progressPercent'][currentLanguage]}</label>
                                        <div className='ui input inputDev '>
                                            <input autoComplete="off"
                                                value={this.state.documentCycle.progressPercent}
                                                className="form-control" name="progressPercent"
                                                onBlur={(e) => { handleBlur(e) }}
                                                onChange={(e) => { this.handleChangeCycle(e, 'progressPercent') }}
                                                placeholder={Resources['progressPercent'][currentLanguage]} />
                                        </div>
                                    </div>
                                </div>
                                <div className="slider-Btns">
                                    {this.state.CycleEditLoading ?
                                        <button className="primaryBtn-1 btn disabled">
                                            <div className="spinner">
                                                <div className="bounce1" />
                                                <div className="bounce2" />
                                                <div className="bounce3" />
                                            </div>
                                        </button>
                                        : <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type='submit' onClick={this.editCycle}>{Resources['editCycle'][currentLanguage]}</button>}
                                    {this.state.CycleAddLoading ?
                                        <button className="primaryBtn-1 btn disabled">
                                            <div className="spinner">
                                                <div className="bounce1" />
                                                <div className="bounce2" />
                                                <div className="bounce3" />
                                            </div>
                                        </button>
                                        : <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type='submit' onClick={this.newCycle}>{Resources['newCycle'][currentLanguage]}</button>}
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Fragment>
        )
    }

    StepOneLink = () => {
        if (docId !== 0) {
            this.setState({
                FirstStep: true,
                SecondStep: false,
                SecondStepComplate: false,
                ThirdStepComplate: false,
                CurrentStep: 1,
            })
        }
    }

    StepTwoLink = () => {
        if (docId !== 0) {
            this.setState({
                FirstStep: false,
                SecondStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: false,
                CurrentStep: 2,
            })
        }
    }

    StepThreeLink = () => {
        if (docId !== 0) {
            this.setState({
                ThirdStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: true,
                CurrentStep: 3,
                FirstStep: false,
                SecondStep: false,
            })
        }
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

                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} docTitle={Resources.materialInspectionRequest[currentLanguage]}
                        moduleTitle={Resources['qualityControl'][currentLanguage]} />

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
                                                            this.saveInspectionRequest();
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

                                                                <div className="linebylineInput valid-input">
                                                                    <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                                                    <div className={"ui input inputDev" + (errors.refDoc && touched.refDoc ? (" has-error") : "ui input inputDev")} >
                                                                        <input type="text" className="form-control" id="refDoc"
                                                                            value={this.state.document.refDoc}
                                                                            name="refDoc"
                                                                            placeholder={Resources.refDoc[currentLanguage]}
                                                                            onBlur={(e) => {
                                                                                handleChange(e)
                                                                                handleBlur(e)
                                                                            }}
                                                                            onChange={(e) => this.handleChange(e, 'refDoc')} />
                                                                        {touched.refDoc ? (<em className="pError">{errors.refDoc}</em>) : null}

                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input alternativeDate">
                                                                    <DatePicker title='requiredDateLog'
                                                                        format={'DD/MM/YYYY'}
                                                                        onChange={e => setFieldValue('requiredDate', e)}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.requiredDate}
                                                                        touched={touched.requiredDate}
                                                                        name="requiredDate"
                                                                        startDate={this.state.document.requiredDate}
                                                                        handleChange={e => this.handleChangeDate(e, 'requiredDate')} />
                                                                </div>

                                                                <div className="linebylineInput valid-input alternativeDate">
                                                                    <DatePicker title='resultDate'
                                                                        date={'DD/MM/YYYY'}
                                                                        onChange={e => setFieldValue('resultDate', e)}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.resultDate}
                                                                        touched={touched.resultDate}
                                                                        name="resultDate"
                                                                        startDate={this.state.document.resultDate}
                                                                        handleChange={e => this.handleChangeDate(e, 'resultDate')} />
                                                                </div>

                                                                <div className="linebylineInput valid-input mix_dropdown">

                                                                    <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                                    <div className="supervisor__company">
                                                                        <div className="super_name">
                                                                            <Dropdown
                                                                                data={this.state.companies}
                                                                                isMulti={false}
                                                                                selectedValue={this.state.selectedFromCompany}
                                                                                handleChange={event => {
                                                                                    this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact')
                                                                                }}
                                                                                onChange={setFieldValue}
                                                                                onBlur={setFieldTouched}
                                                                                error={errors.fromCompanyId}
                                                                                touched={touched.fromCompanyId}

                                                                                index="fromCompanyId"
                                                                                name="fromCompanyId"
                                                                                id="fromCompanyId" />
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
                                                                                index="IR-fromContactId"
                                                                                name="fromContactId"
                                                                                id="fromContactId" />
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
                                                                                name="toCompanyId" />
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
                                                                                isClear={false}
                                                                                index="IR-toContactId"
                                                                                name="toContactId"
                                                                                id="toContactId"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="linebylineInput valid-input mix_dropdown">

                                                                    <label className="control-label">{Resources.actionByCompany[currentLanguage]}</label>
                                                                    <div className="supervisor__company">
                                                                        <div className="super_name">
                                                                            <Dropdown
                                                                                isMulti={false}
                                                                                data={this.state.companies}
                                                                                selectedValue={this.state.selectedActionByCompanyId}
                                                                                handleChange={event =>
                                                                                    this.handleChangeDropDown(event, 'bicCompanyId', true, 'bicContacts', 'GetContactsByCompanyId', 'companyId', 'selectedActionByCompanyId', 'selectedActionByContactId')}
                                                                                name="bicCompanyId" />
                                                                        </div>
                                                                        <div className="super_company">
                                                                            <Dropdown
                                                                                isMulti={false}
                                                                                data={this.state.bicContacts}
                                                                                selectedValue={this.state.selectedActionByContactId}
                                                                                handleChange={event => this.handleChangeDropDown(event, 'bicContactId', false, '', '', '', 'selectedActionByContactId')}

                                                                                onChange={setFieldValue}
                                                                                onBlur={setFieldTouched}
                                                                                error={errors.bicContactId}
                                                                                touched={touched.bicContactId}
                                                                                isClear={false}
                                                                                index="IR-bicContactId"
                                                                                name="bicContactId"
                                                                                id="bicContactId" />

                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="contractPo"
                                                                        data={this.state.contractsPos}
                                                                        selectedValue={this.state.selectedContract}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'contractId', false, '', '', '', 'selectedContract')}
                                                                        index="contractId" />
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="discipline"
                                                                        isMulti={false}
                                                                        data={this.state.discplines}
                                                                        selectedValue={this.state.selectedDiscpline}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedDiscpline')}

                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.disciplineId}
                                                                        touched={touched.disciplineId}
                                                                        isClear={false}
                                                                        index="IR-disciplineId"
                                                                        name="disciplineId"
                                                                        id="disciplineId" />
                                                                </div>


                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="reasonForIssue"
                                                                        data={this.state.reasonForIssues}
                                                                        selectedValue={this.state.selectedReasonForIssue}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'reasonForIssueId', false, '', '', '', 'selectedReasonForIssue')}
                                                                        index="reasonForIssue" />
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="areaName"
                                                                        data={this.state.areas}
                                                                        selectedValue={this.state.selecetedArea}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'areaId', false, '', '', '', 'selecetedArea')}
                                                                        index="areaId" />
                                                                </div>


                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="Buildings"
                                                                        data={this.state.buildings}
                                                                        selectedValue={this.state.selectedbuildingno}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'buildingNoId', false, '', '', '', 'selectedbuildingno')}
                                                                        index="buildingNoId" />
                                                                </div>

                                                                <div className="linebylineInput valid-input">
                                                                    <Dropdown
                                                                        title="apartmentNumber"
                                                                        data={this.state.apartmentNumbers}
                                                                        selectedValue={this.state.selectedApartmentNoId}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'apartmentNoId', false, '', '', '', 'selectedApartmentNoId')}
                                                                        index="apartmentNoId" />
                                                                </div>


                                                                <div className="letterFullWidth">
                                                                    <label className="control-label">{Resources.message[currentLanguage]}</label>
                                                                    <div className="inputDev ui input">
                                                                        <TextEditor
                                                                            value={this.state.rfi}
                                                                            onChange={this.onChangeRfi} />
                                                                    </div>
                                                                </div>

                                                                <div className="letterFullWidth">
                                                                    <label className="control-label">{Resources.replyMessage[currentLanguage]}</label>
                                                                    <div className="inputDev ui input">
                                                                        <div className="inputDev ui input">
                                                                            <TextEditor
                                                                                value={this.state.answer}
                                                                                onChange={this.onChangeAnswer} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="slider-Btns">
                                                                {this.state.CycleEditLoading ?
                                                                    <button className="primaryBtn-1 btn disabled">
                                                                        <div className="spinner">
                                                                            <div className="bounce1" />
                                                                            <div className="bounce2" />
                                                                            <div className="bounce3" />
                                                                        </div>
                                                                    </button>
                                                                    : this.showBtnsSaving()}
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </div>
                                            <div className="doc-pre-cycle letterFullWidth">
                                                <div>

                                                    {this.state.docId > 0 ? this.props.changeStatus === false ?
                                                        (Config.IsAllow(839) ? <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null) :
                                                        (Config.IsAllow(3223) ? <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null) : null
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
                                    {this.state.SecondStep ?
                                        <div className="subiTabsContent feilds__top">

                                            {this.AddNewCycle()}

                                            <div className="doc-pre-cycle">
                                                <header>
                                                    <h2 className="zero">{Resources['cyclesCount'][currentLanguage]}</h2>
                                                </header>
                                                <ReactTable
                                                    ref={(r) => {
                                                        this.selectTable = r;
                                                    }}
                                                    data={this.state.IRCycles}
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
                                        :
                                        //Third Step
                                        <Fragment>
                                            {/* <div className='document-fields'> 
                                            </div> */}


                                            <div className="document-fields tableBTnabs">

                                                {this.state.docId > 0 ? <AddDocAttachment projectId={projectId} docTypeId={this.state.docTypeId} docId={this.state.docId} /> : null}
                                            </div>

                                            <div className="doc-pre-cycle">
                                                <div className="slider-Btns">
                                                    <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>{Resources['next'][currentLanguage]}</button>
                                                </div>

                                            </div>
                                        </Fragment>
                                    }
                                </Fragment>}

                        </div>
                        <div className="docstepper-levels">
                            {/* Next & Previous */}
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={!this.state.FirstStep && this.state.docId !== 0 ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}><i className="fa fa-caret-left" aria-hidden="true"></i>{Resources.previous[currentLanguage]}</span>

                                <span onClick={this.NextTopStep} className={this.state.docId !== 0 ? "step-content-btn-prev "
                                    : "step-content-btn-prev disabled"}>{Resources.next[currentLanguage]}<i className="fa fa-caret-right" aria-hidden="true"></i>
                                </span>
                            </div>
                            {/* Steps Active  */}
                            <div className="workflow-sliderSteps">
                                <div className="step-slider">
                                    <div onClick={this.StepOneLink} data-id="step1" className={'step-slider-item ' + (this.state.SecondStepComplate ? "active" : 'current__step')} >
                                        <div className="steps-timeline">
                                            <span>1</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources.materialInspectionRequest[currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div onClick={this.StepTwoLink} data-id="step2 " className={'step-slider-item ' + (this.state.ThirdStepComplate ? 'active' : this.state.SecondStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources.newCycle[currentLanguage]}</h6>
                                        </div>
                                    </div>
                                    <div onClick={this.StepThreeLink} data-id="step3" className={this.state.ThirdStepComplate ? "step-slider-item  current__step" : "step-slider-item"}>
                                        <div className="steps-timeline">
                                            <span>3</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources.addDocAttachment[currentLanguage]}</h6>
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
        projectId: state.communication.projectId,
        showModal: state.communication.showModal
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
)(withRouter(materialInspectionRequestAddEdit))
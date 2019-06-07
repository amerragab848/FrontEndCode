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
import ModernDatepicker from 'react-modern-datepicker';
import { withRouter } from "react-router-dom";
import TextEditor from '../../Componants/OptionsPanels/TextEditor'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight from 'react-skylight';
import ReactTable from "react-table";

import * as communicationActions from '../../store/actions/communication';
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow';
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval';
import AddDocAttachment from "../../Componants/publicComponants/AddDocAttachment";
import { toast } from "react-toastify";

import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]).max(450, Resources['maxLength'][currentLanguage]),
    refDoc: Yup.string().max(450, Resources['maxLength'][currentLanguage]),
    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
    ownerContactId: Yup.string().required(Resources['toContactRequired'][currentLanguage]).nullable(true)
});

const documentCycleValidationSchema = Yup.object().shape({
    subject: Yup.string()
        .required(Resources['subjectRequired'][currentLanguage]).nullable(true),
    likelihood: Yup.string()
        .required(Resources['likelihood'][currentLanguage]).nullable(true),
    riskLevel: Yup.string()
        .required(Resources['riskLevel'][currentLanguage]).nullable(true),
    riskCause: Yup.string()
        .required(Resources['riskCause'][currentLanguage]).nullable(true),
})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;

const _ = require('lodash');

let columns = [
    {
        Header: 'refNo',
        accessor: 'refNo',
        width: '30px'
    }, {
        Header: Resources['subject'][currentLanguage],
        accessor: 'subject',
        width: '150px',
    }, {
        Header: Resources['statusName'][currentLanguage],
        accessor: 'statusText',
        width: '40px',
    }, {
        Header: Resources['riskCause'][currentLanguage],
        accessor: 'riskCauseTitle',
        width: '80px',
    }, {
        Header: Resources['riskLevel'][currentLanguage],
        accessor: 'riskLevelTitle',
        width: '80px',
    }, {
        Header: Resources['docDate'][currentLanguage],
        accessor: 'cycleDate',
        format: 'date',
        width: '80px',
    }, {
        Header: Resources['likelihood'][currentLanguage],
        accessor: 'likelihoodTitle',
        width: '60px',
    }, {
        Header: Resources['comment'][currentLanguage],
        accessor: 'notes',
        width: '80px',
    }
]

class riskAddEdit extends Component {

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
            updateConsequence: false,
            FirstStep: true,
            SecondStep: false,
            ThirdStep: false,
            FourStep: false,
            FourthStepComplate: false,
            SecondStepComplate: false,
            ThirdStepComplate: false,
            CurrentStep: 1,
            CycleEditLoading: false,
            CycleAddLoading: false,
            DocLoading: false,

            preMedigationCostEMV: 0,
            medigationCost: 0,
            preMedigation: 0,
            EMV: 0,
            likelihood: 0.1,
            documentCycle: {},
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            viewModel: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 115,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            ToContacts: [],
            fromContacts: [],

            riskLevels: [],
            riskCauses: [],
            likelihoods: [],
            items: [],
            areas: [],
            IRCycles: [],
            priority: [],
            permission: [{ name: 'sendByEmail', code: 10006 },
            { name: 'sendByInbox', code: 10005 },
            { name: 'sendTask', code: 0 },
            { name: 'distributionList', code: 10010 },
            { name: 'createTransmittal', code: 10011 },
            { name: 'sendToWorkFlow', code: 10009 },
            { name: 'viewAttachments', code: 10014 },
            { name: 'deleteAttachments', code: 10015 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },

            selectedLikelihood: { label: Resources.likelihood[currentLanguage], value: "0" },
            selectedRiskLevel: { label: Resources.riskLevel[currentLanguage], value: "0" },
            selectedRiskCause: { label: Resources.riskCause[currentLanguage], value: "0" },

            selectedArea: { label: Resources.area[currentLanguage], value: "0" },
            selectedPriorityId: { label: Resources.prioritySelect[currentLanguage], value: "0" },
            message: ''
        }

        if (!Config.IsAllow(10000) && !Config.IsAllow(10001) && !Config.IsAllow(10003)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/Risk/" + this.state.projectId);
        }

        this.newCycle = this.newCycle.bind(this);
        this.editCycle = this.editCycle.bind(this);
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
    };

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id !== this.props.document.id) {
            let sarverObject = nextProps.document;
            sarverObject.docDate = moment(sarverObject.docDate).format('DD/MM/YYYY');
            sarverObject.requiredDate = sarverObject.requiredDate !== null ? moment(sarverObject.requiredDate).format('DD/MM/YYYY') : moment();

            this.setState({
                document: sarverObject,
                hasWorkflow: nextProps.hasWorkflow,
                message: sarverObject.description
            });

            this.fillDropDowns(sarverObject.id > 0 ? true : false);
            this.checkDocumentIsView();
        }

        if (this.state.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }
    };

    componentDidUpdate(prevProps) {
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(10001))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(10001)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(10001)) {
                    if (this.props.document.status == true && Config.IsAllow(10001)) {
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

    componentWillMount() {
        if (this.state.docId > 0) {

            let url = "GetCommunicationRiskForEdit?id=" + this.state.docId;

            this.props.actions.documentForEdit(url);

            dataservice.GetDataGrid("GetRiskCycles?riskId=" + this.state.docId).then(result => {
                this.setState({
                    IRCycles: [...result]
                });

                let data = { items: result };
                this.props.actions.ExportingData(data);
            });

            dataservice.GetDataGrid("GetRiskLastCycle?id=" + this.state.docId).then(result => {
                this.setState({
                    documentCycle: { ...result }
                });

                this.fillDropDownsCycle(true);
            });

            dataservice.GetDataGrid("GetRiskConsequenceByRiskId?riskId=" + this.state.docId).then(result => {
                if (result) {
                    let EMV = 0;
                    let likelihood = this.state.likelihood;
                    result.map(i => {
                        EMV = (parseFloat(likelihood) * parseFloat(i.value)) + EMV;
                    })
                    this.setState({
                        EMV: EMV,
                        items: result
                    });
                }
            });

        } else {
            const riskDocument = {
                id: 0,
                projectId: projectId,
                arrange: "1",
                fromCompanyId: null,
                fromContactId: null,
                ownerCompanyId: null,
                ownerContactId: null,
                subject: "",
                requiredDate: moment(),
                docDate: moment(),
                status: "true",
                refDoc: "",
                discipline: null,
                area: "",
                location: "",
                building: "",
                apartment: "",
                priorityId: "",
                submittedForId: "",
                description: "",
                sendingMethodId: "",
                sharedSettings: ""
            };

            this.setState({
                document: riskDocument
            });

            this.fillDropDowns(false);
            this.fillDropDownsCycle(false);
            this.props.actions.documentForAdding();
            this.GetNextArrange();
        }

    }

    GetNextArrange() {
        let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=0&contactId=0";
        let original_document = { ...this.state.document };
        let updated_document = {};

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
                console.log(targetFieldSelected);
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        });
    }

    fillDropDowns(isEdit) {
        //from Companies
        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + projectId, "companyName", "companyId").then(result => {

            if (isEdit) {

                let companyId = this.props.document.fromCompanyId;

                if (companyId) {
                    this.setState({
                        selectedFromCompany: { label: this.props.document.fromCompanyName, value: companyId }
                    });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', companyId, 'fromContactId', 'selectedFromContact', 'fromContacts');
                }

                let ownerCompanyId = this.props.document.ownerCompanyId;

                if (ownerCompanyId) {

                    this.setState({
                        selectedToCompany: { label: this.props.document.ownerCompanyName, value: ownerCompanyId }
                    });

                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', ownerCompanyId, 'ownerContactId', 'selectedToContact', 'ToContacts');
                }
            }
            this.setState({
                companies: [...result]
            });
        });

        //discplines
        dataservice.GetDataList("GetaccountsDefaultListForList?listType=discipline", "title", "title").then(result => {
            if (isEdit) {
                let disciplineId = this.props.document.discipline;
                if (disciplineId) {
                    let discipline = result.find(i => i.label === parseInt(disciplineId));

                    if (discipline) {
                        this.setState({
                            selectedDiscpline: discipline
                        });
                    }
                }
            }
            this.setState({
                discplines: [...result]
            });
        });
        //area
        dataservice.GetDataList("GetaccountsDefaultListForList?listType=area", "title", "id").then(result => {
            if (isEdit) {

                let areaId = this.props.document.area;

                if (areaId) {

                    let areaIdName = result.find(i => i.value === parseInt(areaId));

                    if (areaIdName) {
                        this.setState({
                            selectedArea: { label: areaIdName.label, value: areaId }
                        });
                    }
                }
            }
            this.setState({
                areas: [...result]
            });
        });

        //priorty
        dataservice.GetDataList("GetaccountsDefaultListForList?listType=priority", "title", "id").then(result => {
            if (isEdit) {

                let priorityId = this.props.document.priorityId;

                if (priorityId) {

                    let priorityName = result.find(i => i.value === parseInt(priorityId));
                    if (priorityName) {
                        this.setState({
                            selectedPriorityId: { label: priorityName.label, value: priorityId }
                        });
                    }
                }
            }
            this.setState({
                priority: [...result]
            });
        });
    }

    fillDropDownsCycle(isEdit) {

        //riskLevels
        dataservice.GetDataList("GetaccountsDefaultListForList?listType=riskLevels", "title", "id").then(result => {
            if (isEdit) {
                let riskLevel = this.state.documentCycle.riskLevel;
                if (riskLevel) {
                    let priorityName = result.find(i => i.value === parseInt(riskLevel));
                    this.setState({
                        selectedRiskLevel: { label: priorityName.label, value: riskLevel }
                    });
                }
            }
            this.setState({
                riskLevels: [...result]
            });
        });

        //riskCauses
        dataservice.GetDataList("GetaccountsDefaultListForList?listType=riskCauses", "title", "id").then(result => {
            if (isEdit) {

                let riskCauses = this.state.documentCycle.riskCause;
                if (riskCauses) {
                    let priorityName = result.find(i => i.value === parseInt(riskCauses));
                    this.setState({
                        selectedRiskCause: { label: priorityName.label, value: riskCauses }
                    });
                }
            }
            this.setState({
                riskCauses: [...result]
            });
        });

        //likelihoods
        dataservice.GetDataList("GetaccountsDefaultListForList?listType=likelihoods", "title", "id").then(result => {
            if (isEdit) {
                let likelihood = this.state.documentCycle.likelihood;
                if (likelihood) {
                    let priorityName = result.find(i => i.value === parseInt(likelihood));
                    this.setState({
                        selectedLikelihood: { label: priorityName.label, value: likelihood }
                    });
                }
            }
            this.setState({
                likelihoods: [...result]
            });
        });

        //consequences
        dataservice.GetDataList("GetaccountsDefaultListForList?listType=consequences", "title", "id").then(result => {
            if (isEdit) {
                let riskConsquence = this.state.documentCycle.riskConsquence;
                if (riskConsquence) {
                    let riskConsquenceObj = result.find(i => i.value === parseInt(riskConsquence));
                    this.setState({
                        selectedconsequence: { label: riskConsquenceObj.label, value: riskConsquence }
                    });
                }
            }
            this.setState({
                consequences: [...result]
            });
        });
    }

    onChangeMessage = (value) => {
        if (value != null) {
            let original_document = { ...this.state.document };

            let updated_document = {};
            updated_document.description = value;
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document,
                description: value
            });
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

    editRisk(event) {
        this.setState({
            isLoading: true,
            DocLoading: true
        });

        let saveDocument = this.state.document;

        saveDocument.docDate = moment(saveDocument.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('EditCommunicationRisk', saveDocument).then(result => {
            this.setState({
                isLoading: true,
                DocLoading: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    saveRisk(event) {
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('AddCommunicationRisk', saveDocument).then(result => {
            if (result.id) {
                toast.success(Resources["operationSuccess"][currentLanguage]);

                let cycle = {
                    subject: this.state.document.subject,
                    status: '1',
                    cycleDate: this.state.document.docDate,
                    refNo: '',
                    riskId: result.id,
                    riskCause: null,
                    notes: '',
                    riskLevel: null,
                    impact: null,
                    id: null
                };

                let items = []
                dataservice.GetDataGrid("GetRiskConsequenceByRiskId?riskId=" + result.id).then(result => {
                    if (result) {
                        let EMV = 0;
                        let likelihood = this.state.likelihood;
                        result.map(i => {
                            EMV = (parseFloat(likelihood) * parseFloat(i.value)) + EMV;
                        })
                        this.setState({
                            EMV: EMV,
                            items: result
                        });
                    }
                });

                this.setState({
                    documentCycle: cycle,
                    docId: result.id,
                    DocLoading: false,
                    items: items
                });
            }
        }).catch(res => {
            this.setState({
                DocLoading: false
            });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });


    }

    saveAndExit(event) {
        this.props.history.push("/Risk/" + this.state.projectId);
    }

    showBtnsSaving() {
        let btn = null;
        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0) {
            btn = <button className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type='submit' >{Resources.next[currentLanguage]}</button>
        }
        return btn;
    }

    viewAttachments() {
        return (
            this.props.document.id > 0 ? (Config.IsAllow(10014) === true ? <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} /> : null) : null
        )
    }

    handleShowAction = (item) => {
        if (item.title == "sendToWorkFlow") { this.props.actions.SendingWorkFlow(true); }

        if (item.value != "0") {
            this.props.actions.showOptionPanel(false);
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true,
                viewModel: false
            })

            this.simpleDialog.show()
        }
    }

    NextStep = () => {

        if (this.state.CurrentStep === 1) {
            if (this.props.changeStatus == true) {
                this.editRisk();
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
        }
        else if (this.state.CurrentStep === 3) {

            window.scrollTo(0, 0)
            this.setState({
                FirstStep: false,
                SecondStep: false,
                ThirdStep: false,
                FourStep: true,
                CurrentStep: (this.state.CurrentStep + 1),
                ThirdStepComplate: false,
                FourthStepComplate: true
            })
        } else {
            this.props.history.push({
                pathname: "/Risk/" + projectId
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
        }
        else if (this.state.CurrentStep === 3) {

            window.scrollTo(0, 0)
            this.setState({
                FirstStep: false,
                SecondStep: false,
                ThirdStep: false,
                FourStep: true,
                CurrentStep: (this.state.CurrentStep + 1),
                ThirdStepComplate: false,
                FourthStepComplate: true
            })
        } else {
            this.props.history.push({
                pathname: "/Risk/" + projectId
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
    saveInspectionRequestCycle(event) {
        let saveDocument = { ...this.state.documentCycle };

        saveDocument.projectId = this.state.projectId;
        saveDocument.riskId = this.state.docId;

        let api = saveDocument.typeAddOrEdit === "editLastCycle" ? 'EditRiskCycle' : 'AddCommunicationRiskCycles';

        if (saveDocument.typeAddOrEdit === "editLastCycle") {
            this.setState({ CycleEditLoading: true })
        } else {
            this.setState({ CycleAddLoading: true })
        }

        dataservice.addObject(api, saveDocument)
            .then(result => {
                if (result) {
                    let cycle = {
                        subject: result.subject,
                        cycleDate: result.cycleDate,
                        refNo: result.refNo,
                        status: result.status,
                        riskId: this.state.docId,
                        riskCause: result.riskCause,
                        notes: result.notes,
                        riskLevel: result.riskLevel,
                        impact: result.impact,
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
                                            <input type="radio" name="IR-cycle-status" defaultChecked={this.state.documentCycle.cycleStatus === false ? null : 'checked'} value="1" onChange={e => this.handleChangeCycle(e, 'status')} />
                                            <label>{Resources.oppened[currentLanguage]}</label>
                                        </div>
                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio" name="IR-cycle-status" defaultChecked={this.state.documentCycle.cycleStatus === false ? 'checked' : null} value="2" onChange={e => this.handleChangeCycle(e, 'status')} />
                                            <label>{Resources.closed[currentLanguage]}</label>
                                        </div>
                                    </div>

                                </div>
                                <div className="proForm datepickerContainer">
                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="riskLevel"
                                            isMulti={false}
                                            data={this.state.riskLevels}
                                            selectedValue={this.state.selectedRiskLevel}
                                            handleChange={(e) => this.handleChangeCycleDropDown(e, "riskLevel", 'selectedRiskLevel')}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.riskLevel}
                                            touched={touched.riskLevel}
                                            isClear={false}
                                            index="IR-riskLevel"
                                            name="riskLevel"
                                            id="riskLevel" />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="likelihood"
                                            isMulti={false}
                                            data={this.state.likelihoods}
                                            selectedValue={this.state.selectedLikelihood}
                                            handleChange={(e) => this.handleChangeCycleDropDown(e, "likelihood", 'selectedLikelihood')}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.likelihood}
                                            touched={touched.likelihood}
                                            isClear={false}
                                            index="risk-likelihood"
                                            name="likelihood"
                                            id="likelihood" />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="riskCause"
                                            isMulti={false}
                                            data={this.state.riskCauses}
                                            selectedValue={this.state.selectedRiskCause}
                                            handleChange={(e) => this.handleChangeCycleDropDown(e, "riskCause", 'selectedRiskCause')}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.riskCause}
                                            touched={touched.riskCause}
                                            isClear={false}
                                            index="risk-riskCause"
                                            name="riskCause"
                                            id="riskCause" />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="consequence"
                                            isMulti={false}
                                            data={this.state.consequences}
                                            selectedValue={this.state.selectedconsequence}
                                            handleChange={(e) => this.handleChangeCycleDropDown(e, "riskConsquence", 'selectedconsequence')}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.riskConsquence}
                                            touched={touched.riskConsquence}
                                            isClear={false}
                                            index="risk-riskConsquence"
                                            name="riskConsquence"
                                            id="riskConsquence" />
                                    </div>

                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['comment'][currentLanguage]}</label>
                                        <div className='ui input inputDev '>
                                            <input autoComplete="off"
                                                value={this.state.documentCycle.notes}
                                                className="form-control" name="comment"
                                                onBlur={(e) => { handleBlur(e) }}
                                                onChange={(e) => { this.handleChangeCycle(e, 'notes') }}
                                                placeholder={Resources['comment'][currentLanguage]} />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources['refNo'][currentLanguage]}</label>
                                        <div className='ui input inputDev '>
                                            <input autoComplete="off"
                                                value={this.state.documentCycle.refNo}
                                                className="form-control" name="refNo"
                                                onBlur={(e) => { handleBlur(e) }}
                                                onChange={(e) => { this.handleChangeCycle(e, 'refNo') }}
                                                placeholder={Resources['refNo'][currentLanguage]} />
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
                                        : <button className={"primaryBtn-1 btn meduimBtn" + (this.state.isViewMode === true ? " disNone" : " ")} type='submit' onClick={this.editCycle}>{Resources['save'][currentLanguage]}</button>}


                                    {this.props.changeStatus === true ?
                                        this.state.CycleAddLoading ?
                                            <button className="primaryBtn-1 btn disabled">
                                                <div className="spinner">
                                                    <div className="bounce1" />
                                                    <div className="bounce2" />
                                                    <div className="bounce3" />
                                                </div>
                                            </button>
                                            : <button className={"primaryBtn-1 btn meduimBtn" + (this.state.isViewMode === true ? " disNone" : " ")} type='submit' onClick={this.newCycle}>{Resources['newCycle'][currentLanguage]}</button>
                                        : null
                                    }

                                </div>

                            </div>
                        </Form>
                    )}
                </Formik>
            </Fragment>
        )
    }

    HandleChangeValue = (e, index, id) => {
        let items = this.state.items;
        let likelihood = this.state.likelihood;
        let value = e.target.value;
        items[index]['value'] = parseInt(value)
        this.setState({
            items
        })
    }

    HandleMitigationChangeValue = (e, field) => {
        let value = parseInt(e.target.value);
        this.setState({
            [field]: value
        })
    }

    HandleChangeDb = (e, index, id) => {
        let items = this.state.items;
        let likelihood = this.state.likelihood;
        let value = e.target.value;
        items[index]['value'] = parseInt(value)
        if (parseInt(value)) {
            if (id != null) {

                this.setState({
                    updateConsequence: true
                })
                dataservice.addObject('EditRiskConsequence?id=' + id + '&value=' + parseInt(value)).then(res => {
                    let EMV = 0;
                    items.map(i => {
                        EMV = (parseFloat(likelihood) * parseFloat(i.value)) + EMV;
                    })
                    this.setState({
                        EMV: EMV,
                        items,
                        updateConsequence: false
                    })
                })
            }
        }
    }

    addItemEquations() {
        return (
            <Fragment>
                <div className='document-fields'>
                    {!this.state.updateConsequence ?
                        <table className="ui table fullInputWidth">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Consequence</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.items.map((item, index) =>
                                    <Fragment>
                                        <tr key={index}>
                                            <td>{item.title}</td>
                                            <td>
                                                <div className='ui input inputDev '>
                                                    <input autoComplete="off"
                                                        value={item.value}
                                                        className="form-control" name="value"
                                                        defaultValue={item.value}
                                                        onBlur={(e) => this.HandleChangeDb(e, index, item.id)}
                                                        onChange={(e) => this.HandleChangeValue(e, index, item.id)}
                                                        placeholder={Resources['value'][currentLanguage]} />
                                                </div>
                                            </td>
                                        </tr>
                                    </Fragment>

                                )}
                            </tbody>
                        </table>
                        : null
                    }
                    <div className="Risk__input">
                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources['EMV'][currentLanguage]}</label>
                            <div className='ui input inputDev '>
                                <input autoComplete="off" readOnly
                                    value={this.state.EMV}
                                    className="form-control" name="EMV"
                                    placeholder={Resources['EMV'][currentLanguage]} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label"> {Resources['riskRanking'][currentLanguage]}</label>
                            <div className='ui input inputDev '>
                                <input autoComplete="off" readOnly
                                    value={this.state.EMV > 0 ? (Math.log10(this.state.EMV)).toFixed(2) : 0}
                                    className="form-control" name="EMV"
                                    placeholder={Resources['EMV'][currentLanguage]} />
                            </div>
                        </div>
                    </div>

                    <header>
                        <h2 className="zero">{Resources['preMedigationRiskQuantification'][currentLanguage]}</h2>
                    </header>

                    <div className="Risk__input">
                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources['preMedigationCostEMV'][currentLanguage]}</label>
                            <div className='ui input inputDev '>
                                <input autoComplete="off"
                                    value={this.state.preMedigationCostEMV == null ? 0 : this.state.preMedigationCostEMV}
                                    onChange={(e) => this.HandleMitigationChangeValue(e, 'preMedigationCostEMV')}
                                    type="number"
                                    className="form-control" name="preMedigationCostEMV"
                                    placeholder={Resources['preMedigationCostEMV'][currentLanguage]} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label"> {Resources['medigationCost'][currentLanguage]}</label>
                            <div className='ui input inputDev '>
                                <input autoComplete="off"
                                    value={this.state.medigationCost == null ? 0 : this.state.medigationCost}
                                    onChange={(e) => this.HandleMitigationChangeValue(e, 'medigationCost')}
                                    type="number" pattern="[0-9]*"
                                    className="form-control" name="medigationCost"
                                    placeholder={Resources['medigationCost'][currentLanguage]} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label"> {this.state.medigationCost == 0 ? Resources['preMedigation'][currentLanguage] : Resources['postMedigation'][currentLanguage]}</label>
                            <div className='ui input inputDev '>
                                <input autoComplete="off" readOnly
                                    value={(this.state.preMedigationCostEMV == null ? 0 : this.state.preMedigationCostEMV) + (this.state.medigationCost == null ? 0 : this.state.medigationCost)}
                                    className="form-control" name="preMedigation"
                                    placeholder={Resources['preMedigation'][currentLanguage]} />
                            </div>
                        </div>
                    </div>
             
                    <header>
                        <h2 className="zero">{Resources['postMedigationRiskQuantification'][currentLanguage]}</h2>
                    </header>

                    <div className="Risk__input">
                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources['postMedigationCostEMV'][currentLanguage]}</label>
                            <div className='ui input inputDev '>
                                <input autoComplete="off"
                                    value={this.state.preMedigationCostEMV == null ? 0 : this.state.preMedigationCostEMV}
                                    onChange={(e) => this.HandleMitigationChangeValue(e, 'preMedigationCostEMV')}
                                    type="number"
                                    className="form-control" name="postMedigationCostEMV"
                                    placeholder={Resources['postMedigationCostEMV'][currentLanguage]} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label"> {Resources['medigationCost'][currentLanguage]}</label>
                            <div className='ui input inputDev '>
                                <input autoComplete="off"
                                    value={this.state.medigationCost == null ? 0 : this.state.medigationCost}
                                    onChange={(e) => this.HandleMitigationChangeValue(e, 'medigationCost')}
                                    type="number" pattern="[0-9]*"
                                    className="form-control" name="medigationCost"
                                    placeholder={Resources['medigationCost'][currentLanguage]} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label"> { Resources['postMedigation'][currentLanguage]}</label>
                            <div className='ui input inputDev '>
                                <input autoComplete="off" readOnly
                                    value={(this.state.preMedigationCostEMV == null ? 0 : this.state.preMedigationCostEMV) + (this.state.medigationCost == null ? 0 : this.state.medigationCost)}
                                    className="form-control" name="preMedigation"
                                    placeholder={Resources['preMedigation'][currentLanguage]} />
                            </div>
                        </div>
                    </div>
             
                </div>
            </Fragment >
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
                FourthStepComplate: false,
                FourStep: false,
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
                FourthStepComplate: false,
                FourStep: false,
            })
        }
    }

    StepThreeLink = () => {
        if (docId !== 0) {
            this.setState({
                ThirdStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: true,

                FourthStepComplate: false,
                FourStep: false,
                CurrentStep: 3,
                FirstStep: false,
                SecondStep: false,
            })
        }
    }

    StepFourLink = () => {
        if (docId !== 0) {
            this.setState({
                FourStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: true,
                FourthStepComplate: true,

                CurrentStep: 4,
                FirstStep: false,
                SecondStep: false,
                ThirdStep: false,
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
            }];

        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} docTitle={Resources.risk[currentLanguage]} moduleTitle={Resources['contracts'][currentLanguage]} />
                    <div className="doc-container">

                        <div className="step-content">
                            {this.state.FirstStep ?
                                <div id="step1" className="step-content-body">
                                    <div className="subiTabsContent">
                                        <div className="document-fields">
                                            <Formik initialValues={{ ...this.state.document }}
                                                validationSchema={validationSchema}
                                                enableReinitialize={this.props.changeStatus}

                                                onSubmit={(values) => {
                                                    if (this.props.showModal) { return; }

                                                    if (this.props.changeStatus === false && this.state.docId === 0) {
                                                        this.saveRisk();
                                                    } else {
                                                        this.NextStep();
                                                    }
                                                }}>

                                                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                    <Form id="rfiForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                        <div className="proForm first-proform">
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                                <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                    <input name='subject' id="subject" className="form-control fsadfsadsa"
                                                                        placeholder={Resources.subject[currentLanguage]}
                                                                        autoComplete='off'
                                                                        value={this.state.document.subject}
                                                                        onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'subject')} />
                                                                    {errors.subject && touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.status[currentLanguage]}</label>
                                                                <div className="ui checkbox radio radioBoxBlue">
                                                                    <input type="radio" name="rfi-status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                                                    <label>{Resources.oppened[currentLanguage]}</label>
                                                                </div>
                                                                <div className="ui checkbox radio radioBoxBlue">
                                                                    <input type="radio" name="rfi-status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
                                                                    <label>{Resources.closed[currentLanguage]}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="proForm datepickerContainer">
                                                            <div className="linebylineInput valid-input">
                                                                <div className="inputDev ui input input-group date NormalInputDate">
                                                                    <div className="customDatepicker fillter-status fillter-item-c ">
                                                                        <div className="proForm datepickerContainer">
                                                                            <label className="control-label">{Resources.docDate[currentLanguage]}</label>
                                                                            <div className="linebylineInput" >
                                                                                <div className="inputDev ui input input-group date NormalInputDate">
                                                                                    <ModernDatepicker date={this.state.document.docDate}
                                                                                        format={'DD/MM/YYYY'}
                                                                                        showBorder
                                                                                        onChange={e => this.handleChangeDate(e, 'docDate')}
                                                                                        placeholder={'Select a date'} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <div className="inputDev ui input input-group date NormalInputDate">
                                                                    <div className="customDatepicker fillter-status fillter-item-c ">
                                                                        <div className="proForm datepickerContainer">
                                                                            <label className="control-label">{Resources.requiredDate[currentLanguage]}</label>
                                                                            <div className="linebylineInput" >
                                                                                <div className="inputDev ui input input-group date NormalInputDate">
                                                                                    <ModernDatepicker date={this.state.document.requiredDate}
                                                                                        format={'DD/MM/YYYY'} showBorder
                                                                                        onChange={e => this.handleChangeDate(e, 'requiredDate')}
                                                                                        placeholder={'Select a date'} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                                <div className={"ui input inputDev " + (errors.arrange && touched.arrange ? (" has-error") : " ")}>
                                                                    <input type="text" className="form-control" id="arrange" readOnly
                                                                        value={this.state.document.arrange}
                                                                        name="arrange"
                                                                        placeholder={Resources.arrange[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
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
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'refDoc')} />
                                                                    {errors.refDoc && touched.refDoc ? (<em className="pError">{errors.refDoc}</em>) : null}
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input mix_dropdown">
                                                                <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                                <div className="supervisor__company">
                                                                    <div className="super_name">
                                                                        <Dropdown data={this.state.companies} isMulti={false}
                                                                            selectedValue={this.state.selectedFromCompany}
                                                                            handleChange={event => { this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact') }}
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}
                                                                            error={errors.fromCompanyId}
                                                                            touched={touched.fromCompanyId}
                                                                            name="fromCompanyId"
                                                                            id="fromCompanyId" />
                                                                    </div>
                                                                    <div className="super_company">
                                                                        <Dropdown isMulti={false} data={this.state.fromContacts}
                                                                            selectedValue={this.state.selectedFromContact}
                                                                            handleChange={event => this.handleChangeDropDown(event, 'fromContactId', false, '', '', '', 'selectedFromContact')}
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}
                                                                            error={errors.fromContactId}
                                                                            touched={touched.fromContactId}
                                                                            name="fromContactId"
                                                                            id="fromContactId" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input mix_dropdown">
                                                                <label className="control-label">{Resources.responsibleCompanyName[currentLanguage]}</label>
                                                                <div className="supervisor__company">
                                                                    <div className="super_name">
                                                                        <Dropdown isMulti={false} data={this.state.companies}
                                                                            selectedValue={this.state.selectedToCompany}
                                                                            handleChange={event => this.handleChangeDropDown(event, 'ownerCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedToCompany', 'selectedToContact')}
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}
                                                                            error={errors.ownerCompanyId}
                                                                            touched={touched.ownerCompanyId}
                                                                            name="ownerCompanyId"
                                                                            id="ownerCompanyId" />
                                                                    </div>
                                                                    <div className="super_company">
                                                                        <Dropdown isMulti={false} data={this.state.ToContacts}
                                                                            selectedValue={this.state.selectedToContact}
                                                                            handleChange={event => this.handleChangeDropDown(event, 'ownerContactId', false, '', '', '', 'selectedToContact')}
                                                                            onChange={setFieldValue}
                                                                            onBlur={setFieldTouched}
                                                                            error={errors.ownerContactId}
                                                                            touched={touched.ownerContactId}
                                                                            name="ownerContactId"
                                                                            id="ownerContactId" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <Dropdown title="discipline" data={this.state.discplines}
                                                                    selectedValue={this.state.selectedDiscpline}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'discipline', false, '', '', '', 'selectedDiscpline')} />
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <Dropdown title="priority" data={this.state.priority}
                                                                    selectedValue={this.state.selectedPriorityId}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'priorityId', false, '', '', '', 'selectedPriorityId')} />
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <Dropdown title="area" data={this.state.areas}
                                                                    selectedValue={this.state.selectedArea}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'area', false, '', '', '', 'selectedArea')} />
                                                            </div>
                                                            <div className="letterFullWidth">
                                                                <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                                <div className="inputDev ui input">
                                                                    <TextEditor value={this.state.message} onChange={event => this.onChangeMessage(event)} />
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
                                                {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={10012} EditAttachments={10013} ShowDropBox={10016} ShowGoogleDrive={10017} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                                {this.viewAttachments()}
                                                {this.props.changeStatus === true ?
                                                    <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                    : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                                        this.state.ThirdStep ?

                                            //Third Step
                                            <Fragment>
                                                <div className="subiTabsContent feilds__top">
                                                    <div className="doc-pre-cycle">
                                                        <header>
                                                            <h2 className="zero">{Resources['consequence'][currentLanguage]}</h2>
                                                        </header>
                                                        {this.addItemEquations()}
                                                    </div>
                                                    <div className="doc-pre-cycle">
                                                        <div className="slider-Btns">
                                                            <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextStep}>{Resources['next'][currentLanguage]}</button>
                                                        </div>

                                                    </div>
                                                </div>


                                            </Fragment>

                                            :
                                            <Fragment>

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
                                            <h6>{Resources.information[currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div onClick={this.StepTwoLink} data-id="step2 " className={'step-slider-item ' + (this.state.ThirdStepComplate ? 'active' : this.state.SecondStepComplate ? "current__step" : "")} >
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 >{Resources.advancedInfo[currentLanguage]}</h6>
                                        </div>
                                    </div>
                                    <div onClick={this.StepThreeLink} data-id="step3" className={this.state.ThirdStepComplate ? "step-slider-item  current__step" : "step-slider-item"}>
                                        <div className="steps-timeline">
                                            <span>3</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources.consequence[currentLanguage]}</h6>
                                        </div>
                                    </div>
                                    <div onClick={this.StepFourLink} data-id="step3" className={this.state.FourthStepComplate ? "step-slider-item  current__step" : "step-slider-item"}>
                                        <div className="steps-timeline">
                                            <span>4</span>
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

function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        changeStatus: state.communication.changeStatus,
        file: state.communication.file,
        files: state.communication.files,
        hasWorkflow: state.communication.hasWorkflow,
        viewModel: state.communication.viewModel
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(riskAddEdit))
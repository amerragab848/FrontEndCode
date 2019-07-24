import React, { Component, Fragment } from "react";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment';
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments';
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import DatePicker from '../../Componants/OptionsPanels/DatePicker';
import { withRouter } from "react-router-dom";
import TextEditor from '../../Componants/OptionsPanels/TextEditor';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import SkyLight from 'react-skylight';
import * as communicationActions from '../../store/actions/communication';
import Distribution from '../../Componants/OptionsPanels/DistributionList';
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow';
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval';
import RiskCause from '../../Componants/OptionsPanels/RiskCause';
import RiskConesquence from '../../Componants/publicComponants/RiskConesquence';
import RiskRealisation from '../../Componants/publicComponants/RiskRealisation';
import AddDocAttachment from "../../Componants/publicComponants/AddDocAttachment";
import { toast } from "react-toastify";
import ReactTable from "react-table";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument';
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import numeral from 'numeral';
import RiskCategorisation from "../../Componants/publicComponants/RiskCategorisation";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]).max(450, Resources['maxLength'][currentLanguage])
});

const documentCycleValidationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    mitigationType: Yup.string().required(Resources['mitigationType'][currentLanguage]).nullable(true)

})

const documentProposedValidationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    mitigationType: Yup.string().required(Resources['mitigationType'][currentLanguage]).nullable(true),
    actionProgress: Yup.string().required(Resources['actionProgress'][currentLanguage]).nullable(true),
    medigationCost: Yup.number().required(Resources['medigationCost'][currentLanguage]),
    actionOwnerContactId: Yup.string().required(Resources['ownerRisk'][currentLanguage]).nullable(true)
})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;

const _ = require('lodash');

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
                    perviousRoute = obj.perviousRoute;
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            totalResidualRisk: 0,
            totalMedigationCost: 0,
            totalProposedMit: 0,
            statusNumbers: true,
            consequenceData: [],
            consequenceDataPost: [],
            currency: [],
            updateConsequence: false,
            FirstStep: true,
            SecondStep: false,
            ThirdStep: false,
            FourthStep: false,
            FivethStep: false,
            SixthStep: false,
            SevenStep: false,
            EightStep: false,
            FourthStepComplate: false,
            FivethStepComplate: false,
            SixthStepComplate: false,
            SecondStepComplate: false,
            ThirdStepComplate: false,
            SeventhStepComplate: false,
            EightthStepComplate: false,
            postQuantitifactionStepComplate: false,
            addDocStepComplate: false,
            postQuantitifactionStep: false,
            addDocStep: false,
            analysisStepComplate: false,
            analysisStep: false,
            CurrentStep: 1,
            CycleEditLoading: false,
            CycleAddLoading: false,
            DocLoading: false,
            perviousRoute: perviousRoute,
            preMedigationCostEMV: 0,
            medigationCost: 0,
            preMedigation: 0,
            EMV: 0,
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
            riskTypes: [],
            mitigationTypes: [],
            likelihoods: [],
            items: [],
            areas: [],
            IRCyclesPre: [],
            IRCyclesPost: [],
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
            selectedMitigationTypes: { label: Resources.mitigationType[currentLanguage], value: "0" },
            selectedRiskCause: { label: Resources.riskCause[currentLanguage], value: "0" },
            selectedArea: { label: Resources.area[currentLanguage], value: "0" },
            selectedPriorityId: { label: Resources.prioritySelect[currentLanguage], value: "0" },
            description: '',
            descriptionMitigation: ''
        }

        if (!Config.IsAllow(10000) && !Config.IsAllow(10001) && !Config.IsAllow(10003)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
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

        this.checkDocumentIsView();

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=currency", 'title', 'id').then(result => {
            this.setState({ currency: result })
        })

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
            sarverObject.docDate = sarverObject.docDate !== null ? moment(sarverObject.docDate).format('YYYY-MM-DD') : moment();
            sarverObject.requiredDate = sarverObject.requiredDate !== null ? moment(sarverObject.requiredDate).format('YYYY-MM-DD') : moment();

            this.setState({
                document: sarverObject,
                hasWorkflow: nextProps.hasWorkflow,
                description: sarverObject.description,
                descriptionMitigation: sarverObject.descriptionMitigation
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

            this.props.actions.documentForEdit("GetCommunicationRiskForEdit?id=" + this.state.docId);

            dataservice.GetDataGrid("GetRiskCycles?riskId=" + this.state.docId).then(result => {
                let IRCyclesPre = [];
                let IRCyclesPost = [];
                let totalProposedMit = 0;
                result.map(i => {
                    if (i.isActive == true) {
                        IRCyclesPre.push(i)
                    } else {
                        IRCyclesPost.push(i)
                        totalProposedMit = totalProposedMit + (i.mitigationCost == null ? 0 : i.mitigationCost);
                    }
                })

                let totalPostRiskEmv = this.state.totalPostRiskEmv;
                let totalResidualRisk = (totalPostRiskEmv == null ? 0 : totalPostRiskEmv) + totalProposedMit;

                this.setState({
                    totalProposedMit: totalProposedMit,
                    totalResidualRisk: totalResidualRisk,

                    IRCyclesPre: IRCyclesPre,
                    IRCyclesPost: IRCyclesPost
                });

                let data = { items: result };
                this.props.actions.ExportingData(data);
            });
            this.fillDropDownsCycle(true);

        } else {
            const riskDocument = {
                id: 0,
                projectId: projectId,
                arrange: "1",
                fromCompanyId: null,
                fromContactId: null,
                ownerCompanyId: null,
                ownerContactId: null,
                riskType: null,
                subject: "",
                requiredDate: moment(),
                docDate: moment(),
                status: true,
                area: "",
                location: "",
                priorityId: "",
                description: "",
                descriptionMitigation: "",
                sharedSettings: "",
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
        //let updated_document = {};

        dataservice.GetNextArrangeMainDocument(url).then(res => {
            original_document.arrange = res;
            // updated_document = Object.assign(original_document, updated_document);
            this.setState({
                document: original_document
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

        //riskType
        dataservice.GetDataList("GetaccountsDefaultListForList?listType=riskTypes", "title", "id").then(result => {
            if (isEdit) {
                let riskType = this.state.document.riskType;
                if (riskType) {
                    let riskTypeObj = result.find(i => i.value === parseInt(riskType));
                    this.setState({
                        selectedRiskType: { label: riskTypeObj.label, value: riskType }
                    });
                }
            }
            this.setState({
                riskTypes: [...result]
            });
        });
    }

    fillDropDownsCycle(isEdit) {

        let mitigationTypes = [{ value: 1, label: 'Preventive' }, { value: 2, label: 'Reactive' }]
        this.setState({
            mitigationTypes: mitigationTypes
        });

        //likelihoods
        dataservice.GetDataGrid("GetaccountsDefaultListForList?listType=likelihoods").then(result => {
            let data = [];
            result.map(i => {
                data.push({
                    label: i['title'], value: i['id'], action: i['value']
                })
            })
            this.setState({
                likelihoods: [...data]
            });
        });

        //consequencesScores
        dataservice.GetDataGrid("GetaccountsDefaultListForList?listType=consequencesScores").then(result => {
            let data = [];
            result.map(i => {
                data.push({
                    label: i['title'], value: i['id'], action: i['value']
                })
            })
            this.setState({
                consequences: [...data]
            });
        });

    }

    onChangeMessage = (value, field) => {
        if (value != null) {
            let original_document = { ...this.state.document };

            let updated_document = {};
            updated_document[field] = value;
            updated_document = Object.assign(original_document, updated_document);

            this.setState({
                document: updated_document,
                [field]: value
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

    handleChangeStatusNumbers(value) {
        this.setState({
            statusNumbers: value
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

    handleChangeDateCycle(e, field) {

        let original_document = { ...this.state.documentCycle };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            documentCycle: updated_document
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

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

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

        saveDocument.projectId = projectId;
        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('AddCommunicationRisk', saveDocument).then(result => {
            if (result.id) {
                toast.success(Resources["operationSuccess"][currentLanguage]);

                let cycle = {
                    subject: '',
                    docDate: moment(),
                    actionOwnerId: null,
                    actionOwnerContactId: null,
                    actionProgress: '',
                    mitigationType: 1,
                    mitigationCost: 0,
                    riskId: this.state.docId,
                    id: null
                };

                let items = []

                dataservice.GetDataGrid("GetRiskConsequenceByRiskId?riskId=" + result.id).then(result => {
                    if (result) {
                        this.setState({
                            items: result
                        });
                    }
                });

                this.setState({
                    documentCycle: cycle,
                    docId: result.id,
                    DocLoading: false
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
            this.props.document.id > 0 ? (Config.IsAllow(10014) === true ? <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} /> : null) : null
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
            window.scrollTo(0, 0);
            this.setState({
                FirstStep: false,
                SecondStep: true,
                SecondStepComplate: true,
                CurrentStep: 2
            });
        }
    }

    NextTopStep = () => {
        if (this.state.CurrentStep === 1) {
            window.scrollTo(0, 0);
            this.setState({
                FirstStep: false,
                SecondStep: true,
                SecondStepComplate: true,
                CurrentStep: 2
            });
        } else if (this.state.CurrentStep === 2) {
            window.scrollTo(0, 0);
            this.setState({
                SecondStep: false,
                ThirdStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: true,
                CurrentStep: 3
            });
        } else if (this.state.CurrentStep === 3) {
            window.scrollTo(0, 0);
            this.setState({
                FourthStep: true,
                ThirdStep: false,
                FourthStepComplate: true,
                CurrentStep: 4
            });
        } else if (this.state.CurrentStep === 4) {
            window.scrollTo(0, 0);
            this.setState({
                FourthStep: false,
                FivethStep: true,
                FivethStepComplate: true,
                CurrentStep: 5
            });
        } else if (this.state.CurrentStep === 5) {
            window.scrollTo(0, 0);
            this.setState({
                FivethStep: false,
                SixthStep: true,
                SixthStepComplate: true,
                CurrentStep: 6
            });
        } else if (this.state.CurrentStep === 6) {
            window.scrollTo(0, 0);
            this.setState({
                SixthStep: false,
                SeventhStep: true,
                SeventhStepComplate: true,
                CurrentStep: 7
            });
        } else if (this.state.CurrentStep === 7) {
            this.props.history.push({
                pathname: "/Risk/" + projectId + ""
            });
        }

        let consequenceData = this.state.consequenceData;
        if (consequenceData.length == 0) {
            this.fillConsequence();
        }
    };

    PreviousStep = () => {
        if (this.state.docId !== 0) {
            if (this.state.CurrentStep === 2) {
                window.scrollTo(0, 0);
                this.setState({
                    FirstStep: true,
                    SecondStep: false,
                    SecondStepComplate: false,
                    CurrentStep: 1
                });
            } else if (this.state.CurrentStep === 3) {
                window.scrollTo(0, 0);
                this.setState({
                    SecondStep: true,
                    ThirdStep: false,
                    ThirdStepComplate: false,
                    CurrentStep: 2
                });
            } else if (this.state.CurrentStep === 4) {
                window.scrollTo(0, 0);
                this.setState({
                    FourthStep: false,
                    ThirdStep: true,
                    FourthStepComplate: false,
                    CurrentStep: 3
                });
            } else if (this.state.CurrentStep === 5) {
                window.scrollTo(0, 0);
                this.setState({
                    FourthStep: true,
                    FivethStep: false,
                    FivethStepComplate: false,
                    CurrentStep: 4
                });
            } else if (this.state.CurrentStep === 6) {
                window.scrollTo(0, 0);
                this.setState({
                    FivethStep: true,
                    SixthStep: false,
                    SixthStepComplate: false,
                    CurrentStep: 5
                });
            } else if (this.state.CurrentStep === 7) {
                window.scrollTo(0, 0);
                this.setState({
                    SixthStep: true,
                    SeventhStep: false,
                    SeventhStepComplate: false,
                    CurrentStep: 6
                });
            }
        }
    };

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

    saveMitigationRequest(isActive) {
        let saveDocument = { ...this.state.documentCycle };

        saveDocument.projectId = this.state.projectId;
        saveDocument.riskId = this.state.docId;
        saveDocument.isActive = isActive;
        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        let api = 'AddCommunicationRiskCycles';

        this.setState({
            CycleEditLoading: true
        });

        dataservice.addObject(api, saveDocument).then(result => {

            if (result) {

                let documentCycleIsFalse = {
                    subject: "",
                    docDate: moment(),
                    actionOwnerId: "",
                    actionOwnerContactId: "",
                    actionProgress: "",
                    mitigationType: "",
                    mitigationCost: "",
                    riskId: this.state.docId,
                    id: null
                };

                let documentCycleIsTrue = {
                    subject: "",
                    mitigationType: "",
                    riskId: this.state.docId
                };

                let IRCyclesPre = [];
                let IRCyclesPost = [];
                let totalProposedMit = 0;

                result.map(i => {
                    if (i.isActive == true) {
                        IRCyclesPre.push(i)
                    } else {
                        IRCyclesPost.push(i)
                        totalProposedMit = totalProposedMit + (i.mitigationCost == null ? 0 : i.mitigationCost);
                    }
                })
                if (isActive === false) {
                    let totalPostRiskEmv = this.state.totalPostRiskEmv;
                    let totalResidualRisk = (totalPostRiskEmv == null ? 0 : totalPostRiskEmv) + totalProposedMit;
                    this.setState({
                        totalProposedMit: totalProposedMit,
                        totalResidualRisk: totalResidualRisk
                    });
                }
                this.setState({
                    IRCyclesPre: IRCyclesPre,
                    IRCyclesPost: IRCyclesPost,
                    documentCycle: isActive ? documentCycleIsTrue : documentCycleIsFalse,
                    CycleEditLoading: false,
                    selectedMitigationTypes: { label: Resources.mitigationType[currentLanguage], value: "0" }
                });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }
        }).catch(res => {
            this.setState({
                CycleEditLoading: false
            });
            toast.error(Resources["operationCanceled"][currentLanguage]);
        });
    }

    CurrentMit() {
        return (
            <div className="subiTabsContent">
                <header className="main__header">
                    <div className="main__header--div">
                        <h2 className="zero">{Resources['currentMitigation'][currentLanguage]}</h2>
                    </div>
                </header>
                <div className='document-fields'>
                    <Formik
                        initialValues={{ subject: "", mitigationType: "" }}
                        validationSchema={documentCycleValidationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            this.saveMitigationRequest(true)
                        }}>
                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form id="InspectionRequestCycleForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                <div className="proForm datepickerContainer">
                                    <div className="fullInputWidth letterFullWidth">
                                        <label className="control-label">{Resources.currentPlannedMitigation[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                            <input name='subject' id="subject" className="form-control fsadfsadsa"
                                                placeholder={Resources.currentPlannedMitigation[currentLanguage]}
                                                autoComplete='off'
                                                value={this.state.documentCycle.subject}
                                                onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                onChange={(e) => this.handleChangeCycle(e, 'subject')} />
                                            {errors.subject && touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="proForm datepickerContainer">
                                    <div className="linebylineInput valid-input">
                                        <Dropdown title="mitigationType"
                                            data={this.state.mitigationTypes}
                                            selectedValue={this.state.selectedMitigationTypes}
                                            handleChange={(e) => this.handleChangeCycleDropDown(e, "mitigationType", 'selectedMitigationTypes')}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.mitigationType}
                                            touched={touched.mitigationType}
                                            index="mitigationType"
                                            name="mitigationType"
                                            id="mitigationType" />
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
                                        : <button className={"primaryBtn-1 btn meduimBtn" + (this.state.isViewMode === true ? " disNone" : " ")} type='submit' >{Resources['goAdd'][currentLanguage]}</button>
                                    }
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <div className="doc-pre-cycle">

                        <table className="attachmentTable">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="headCell tableCell-1">{Resources['subject'][currentLanguage]}</div>
                                    </th>

                                    <th>
                                        <div className="headCell"> {Resources['type'][currentLanguage]}</div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.IRCyclesPre.map((item, index) => {
                                    return <tr key={item.id + '-' + index}>
                                        <td className="removeTr">
                                            <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.subject}</div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.mitigationTypeText}</div>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    ProposedMit(isCurrent) {
        return (
            <div className="subiTabsContent">
                <header className="main__header">
                    <div className="main__header--div">
                        <h2 className="zero">{Resources['proposeMitigation'][currentLanguage]}</h2>
                    </div>
                </header>
                <div className='document-fields'>
                    <Formik initialValues={{
                        subject: "",
                        mitigationType: "",
                        actionProgress: "",
                        medigationCost: "",
                        actionOwnerContactId: null
                    }}
                        validationSchema={documentProposedValidationSchema}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            this.saveMitigationRequest(false)
                        }}>
                        {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                            <Form id="RiskRequestCycleFormPost" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                <Fragment>
                                    <div className="proForm datepickerContainer">
                                        <div className="fullInputWidth letterFullWidth">
                                            <label className="control-label">{Resources.proposeMitigation[currentLanguage]}</label>
                                            <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                <input name='subject' id="subject" className="form-control fsadfsadsa"
                                                    placeholder={Resources.proposeMitigation[currentLanguage]}
                                                    autoComplete='off'
                                                    value={this.state.documentCycle.subject}
                                                    onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                    onChange={(e) => this.handleChangeCycle(e, 'subject')} />
                                                {errors.subject && touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input">
                                            <Dropdown title="mitigationType"
                                                data={this.state.mitigationTypes}
                                                selectedValue={this.state.selectedMitigationTypes}
                                                handleChange={(e) => this.handleChangeCycleDropDown(e, "mitigationType", 'selectedMitigationTypes')}
                                                onChange={setFieldValue}
                                                onBlur={setFieldTouched}
                                                error={errors.mitigationType}
                                                touched={touched.mitigationType}
                                                index="mitigationType"
                                                name="mitigationType"
                                                id="mitigationType" />
                                        </div>
                                        <div className="linebylineInput valid-input alternativeDate">
                                            <DatePicker title='deadLineDate'
                                                startDate={this.state.documentCycle.docDate}
                                                handleChange={e => this.handleChangeDateCycle(e, 'docDate')} />
                                        </div>
                                        <div className="letterFullWidth fullInputWidth">
                                            <label className="control-label">{Resources['actionProgress'][currentLanguage]}</label>
                                            <div className={"inputDev ui input" + (errors.actionProgress && touched.actionProgress ? (" has-error") : !errors.actionProgress && touched.actionProgress ? (" has-success") : " ")} >
                                                <input autoComplete="off" name="actionProgress" id="actionProgress"
                                                    value={this.state.documentCycle.actionProgress}
                                                    className="form-control" name="actionProgress"
                                                    onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                    onChange={(e) => { this.handleChangeCycle(e, 'actionProgress') }}
                                                    placeholder={Resources['actionProgress'][currentLanguage]} />
                                                {errors.actionProgress && touched.actionProgress ? (<em className="pError">{errors.actionProgress}</em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['medigationCost'][currentLanguage]}</label>
                                            <div className={'ui input inputDev' + (errors.medigationCost && touched.medigationCost ? (" has-error") : !errors.medigationCost && touched.medigationCost ? (" has-success") : " ")} >
                                                <input autoComplete="off" name="medigationCost" id="medigationCost"
                                                    value={this.state.documentCycle.medigationCost}
                                                    className="form-control"
                                                    onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                    onChange={(e) => { this.handleChangeCycle(e, 'medigationCost') }}
                                                    placeholder={Resources['medigationCost'][currentLanguage]} />
                                                {errors.medigationCost && touched.medigationCost ? (<em className="pError">{errors.medigationCost}</em>) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput valid-input mix_dropdown">
                                            <label className="control-label">{Resources.ownerRisk[currentLanguage]}</label>
                                            <div className="supervisor__company">
                                                <div className="super_name">
                                                    <Dropdown data={this.state.companies} isMulti={false}
                                                        selectedValue={this.state.selectedFromCompany}
                                                        handleChange={event => { this.handleChangeDropDown(event, 'actionOwnerId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact') }}
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={errors.fromCompanyId}
                                                        touched={touched.fromCompanyId}
                                                        name="fromCompanyId"
                                                        id="actionOwnerId" />
                                                </div>
                                                <div className="super_company">
                                                    <Dropdown isMulti={false} data={this.state.fromContacts}
                                                        selectedValue={this.state.selectedFromContact}
                                                        handleChange={event => this.handleChangeDropDown(event, 'actionOwnerContactId', false, '', '', '', 'selectedFromContact')}
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={errors.actionOwnerContactId}
                                                        touched={touched.actionOwnerContactId}
                                                        name="actionOwnerContactId"
                                                        id="actionOwnerContactId" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                                {/* } */}
                                <div className="slider-Btns">
                                    {this.state.CycleEditLoading ?
                                        <button className="primaryBtn-1 btn disabled">
                                            <div className="spinner">
                                                <div className="bounce1" />
                                                <div className="bounce2" />
                                                <div className="bounce3" />
                                            </div>
                                        </button>
                                        : <button className={"primaryBtn-1 btn meduimBtn" + (this.state.isViewMode === true ? " disNone" : " ")} type='submit' >{Resources['goAdd'][currentLanguage]}</button>
                                    }
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <div className="doc-pre-cycle">
                        {/* <header>
                            <h2 className="zero">{Resources['proposeMitigation'][currentLanguage]}</h2>
                        </header> */}

                        <table className="attachmentTable attachmentTable__fixedWidth">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="headCell tableCell-1">{Resources['subject'][currentLanguage]}</div>
                                    </th>
                                    <th>
                                        <div className="headCell"> {Resources['type'][currentLanguage]}</div>
                                    </th>
                                    <th>
                                        <div className="headCell"> {Resources['responsibleCompanyName'][currentLanguage]}</div>
                                    </th>
                                    <th>
                                        <div className="headCell"> {Resources['deadLineDate'][currentLanguage]}</div>
                                    </th>
                                    <th>
                                        <div className="headCell"> {Resources['actionProgress'][currentLanguage]}</div>
                                    </th>
                                    <th>
                                        <div className="headCell"> {Resources['medigationCost'][currentLanguage]}</div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.IRCyclesPost.map((item, index) => {
                                    return <tr key={item.id + '-' + index}>
                                        <td className="removeTr">
                                            <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.subject}</div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.mitigationTypeText}</div>
                                        </td>
                                        <td style={{ width: 'auto' }}>
                                            <div className="contentCell tableCell-2" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.actionOwnerContactName}</div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.docDate != null ? moment(item.docDate).format('DD/MM/YYYY') : 'No Date'}</div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-2" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.actionProgress}</div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.medigationCost}</div>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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

    fillConsequence() {
        dataservice.GetDataGrid("GetRiskConsequenceByRiskId?riskId=" + this.state.docId).then(result => {
            if (result) {
                this.buildStructureTableThirdTab(result);
            }
        });
    }

    buildStructureTableThirdTab(result) {
        let data = [];
        let dataPost = [];
        let likelihood = {
            label: 'Please Select',
            value: 0
        }
        let consequ = {
            label: 'Please Select',
            value: 0
        }

        let state = { ...this.state };
        let dslikelihood = this.state.likelihoods;
        let consequences = this.state.consequences;

        let totalRankingPost = 0;
        let totalRanking = 0;
        let totalMedigationCost = 0;
        result.map(item => {

            let likelihoodScore = item['likelihoodScore'];
            let consequenceScore = item['conesquenceScore'];

            let riskEMV = 0;

            let statusNumbers = this.state.statusNumbers
            let riskRanking = parseFloat(item['riskRanking']);
            if (statusNumbers) {
                riskEMV = (Math.round(Math.pow(10, riskRanking), (-riskRanking + 1)));
            } else {
                riskEMV = (Math.round(Math.pow(10, riskRanking), (-riskRanking + 1)) / 1000);
            }

            let itemObj = {
                id: item['id'],
                consequenceId: item['consequenceId'],
                title: item['title'],
                likelihoodScore: item['likelihoodScore'],
                conesquenceScore: item['conesquenceScore'],

                consequenceScoreValue: item['consequenceScoreValue'],
                likelihoodScoreValue: item['likelihoodScoreValue'],

                riskEMV: riskEMV,
                action: 0,
                riskRanking: item['riskRanking'],
                isChecked: item['isChecked']
            };

            if (item.mitigationType == 1) {
                if (likelihoodScore) {
                    likelihood = dslikelihood.find(i => i.value === parseInt(likelihoodScore));
                }

                if (consequenceScore) {
                    consequ = consequences.find(i => i.value === parseInt(consequenceScore));
                }

                totalRanking = totalRanking + parseFloat((Math.round(Math.pow(10, riskRanking), (-riskRanking + 1))));

                itemObj.SelectedLikelihood = likelihood;
                itemObj.SelectedConsequence = consequ;
                data.push(itemObj)
                state[item.id + '-1-drop'] = null;
                state[item.id + '-2-drop'] = null;
            } else {

                if (likelihoodScore) {
                    likelihood = dslikelihood.find(i => i.value === parseInt(likelihoodScore));
                }

                if (consequenceScore) {
                    consequ = consequences.find(i => i.value === parseInt(consequenceScore));
                }

                totalRankingPost = totalRankingPost + parseFloat((Math.round(Math.pow(10, riskRanking), (-riskRanking + 1))));

                itemObj.SelectedLikelihoodPost = likelihood;
                itemObj.SelectedConsequencePost = consequ;
                dataPost.push(itemObj)
                state[item.id + '-1-drop-post'] = null;
                state[item.id + '-2-drop-post'] = null;
            }
        })

        this.setState(state);

        let preMedigationCostEMV = Math.log10(totalRanking);
        let postMedigationCostEMV = Math.log10(totalRankingPost);
        let totalPostRiskEmv = totalRankingPost;
        let totalPretRiskEmv = totalRanking;


        let ProposedMit = this.state.totalProposedMit;
        let totalResidualRisk = totalRankingPost + ProposedMit;

        data = _.orderBy(data, ['id'], ['asc']);
        dataPost = _.orderBy(dataPost, ['id'], ['asc']);

        this.setState({
            totalResidualRisk: totalResidualRisk,
            consequenceData: data,
            consequenceDataPost: dataPost,
            preMedigationCostEMV: preMedigationCostEMV,
            postMedigationCostEMV: postMedigationCostEMV,
            totalPostRiskEmv: totalPostRiskEmv,
            totalMedigationCost: totalPostRiskEmv,
            totalPretRiskEmv: totalPretRiskEmv
        })
    }

    actionHandler = (id, consequenceId, e, data, isCon, index) => {
        let state = { ...this.state };
        state[id + '-' + index + '-drop'] = e;
        let consequenceData = state.consequenceData;
        this.setState(state);
        if (id != null) {
            this.setState({
                updateConsequence: true
            })
            let likelihoodScoreValue = 0;
            let consequenceScoreValue = 0;
            if (isCon) {
                let consequences = this.state.consequences;
                if (e.value) {
                    let consequ = consequences.find(i => i.value === parseInt(e.value));
                    consequenceScoreValue = consequ.action;
                    likelihoodScoreValue = data.likelihoodScoreValue;
                }
            } else {
                let likelihoods = this.state.likelihoods;
                if (e.value) {
                    let likelihood = likelihoods.find(i => i.value === parseInt(e.value));
                    likelihoodScoreValue = likelihood.action;
                    consequenceScoreValue = data.consequenceScoreValue;
                }
            }

            let riskRanking = (consequenceScoreValue + likelihoodScoreValue);
            let statusNumbers = this.state.statusNumbers
            let riskEMV = 0;
            if (statusNumbers) {
                riskEMV = (Math.round(Math.pow(10, riskRanking), (-riskRanking + 1)));
            } else {
                riskEMV = (Math.round(Math.pow(10, riskRanking), (-riskRanking + 1)) / 1000);
            }

            let obj = {
                likelihoodScoreValue: likelihoodScoreValue,
                consequenceScoreValue: consequenceScoreValue,
                likelihoodScore: isCon == false ? e.value : data.likelihoodScore,
                conesquenceScore: isCon ? e.value : data.conesquenceScore,
                riskRanking: (consequenceScoreValue + likelihoodScoreValue),
                riskEMV: riskEMV,
                riskId: this.state.docId, id: data.id,
                mitigationType: 1
            };

            dataservice.addObject('EditRiskConsequence', obj).then(res => {
                this.refreshDataAfterAddConsequence(consequenceData, id, 1, riskRanking, riskEMV, obj);
            })
        }
    }

    actionHandlerPost = (id, consequenceId, e, data, isCon, index) => {

        let state = { ...this.state };
        state[id + '-' + index + '-drop-post'] = e;
        let consequenceData = state.consequenceDataPost;
        this.setState(state);
        if (id != null) {
            this.setState({
                updateConsequence: true
            })

            let likelihoodScoreValue = 0;
            let consequenceScoreValue = 0;
            if (isCon) {
                let consequences = this.state.consequences;
                if (e.value) {
                    let consequ = consequences.find(i => i.value === parseInt(e.value));
                    consequenceScoreValue = consequ.action;
                    likelihoodScoreValue = data.likelihoodScoreValue;
                }
            } else {
                let likelihoods = this.state.likelihoods;
                if (e.value) {
                    let likelihood = likelihoods.find(i => i.value === parseInt(e.value));
                    likelihoodScoreValue = likelihood.action;
                    consequenceScoreValue = data.consequenceScoreValue;
                }
            }

            let riskRanking = (consequenceScoreValue + likelihoodScoreValue);
            let statusNumbers = this.state.statusNumbers

            let riskEMV = 0;
            if (statusNumbers) {
                riskEMV = (Math.round(Math.pow(10, riskRanking), (-riskRanking + 1)));
            } else {
                riskEMV = (Math.round(Math.pow(10, riskRanking), (-riskRanking + 1)) / 1000);
            }

            let obj = {
                likelihoodScoreValue: likelihoodScoreValue,
                consequenceScoreValue: consequenceScoreValue,
                likelihoodScore: isCon == false ? e.value : data.likelihoodScore,
                conesquenceScore: isCon ? e.value : data.conesquenceScore,
                riskRanking: (consequenceScoreValue + likelihoodScoreValue),
                riskEMV: riskEMV,
                riskId: this.state.docId,
                id: data.id,
                mitigationType: 2
            };

            dataservice.addObject('EditRiskConsequence', obj).then(res => {
                this.refreshDataAfterAddConsequence(consequenceData, id, 2, riskRanking, riskEMV, obj);
            })
        }
    }

    refreshDataAfterAddConsequence(consequenceData, id, mitigationType, riskRanking, riskEMV, obj) {

        let currentObj = consequenceData.find(i => i.id === id);
        if (currentObj) {
            currentObj.riskRanking = riskRanking;
            currentObj.riskEMV = riskEMV;
            currentObj.likelihoodScoreValue = obj.likelihoodScoreValue;
            currentObj.consequenceScoreValue = obj.consequenceScoreValue;
            currentObj.conesquenceScore = obj.conesquenceScore;
            currentObj.likelihoodScore = obj.likelihoodScore;
        }
        let likelihood = { label: 'Please Select', value: 0 }
        let consequ = { label: 'Please Select', value: 0 }

        let likelihoodScore = currentObj['likelihoodScore'];
        let dslikelihood = this.state.likelihoods;
        if (likelihoodScore) {
            likelihood = dslikelihood.find(i => i.value === parseInt(likelihoodScore));
        }
        let consequenceScore = currentObj['conesquenceScore'];

        let consequences = this.state.consequences;
        if (consequenceScore) {
            consequ = consequences.find(i => i.value === parseInt(consequenceScore));
        }

        let arr = []
        if (mitigationType == 1) {
            currentObj.SelectedLikelihood = { label: likelihood.label, value: likelihood.value };
            currentObj.SelectedConsequence = { label: consequ.label, value: consequ.value };
            let totalRanking = 0;

            consequenceData.map(i => {
                if (i.id != id) {
                    arr.push(i);
                }
                totalRanking = totalRanking + + parseFloat(i.riskEMV);
            });

            let preMedigationCostEMV = Math.log10(totalRanking);

            let totalPostRiskEmv = totalRanking;

            let newData = [...arr, currentObj];
            newData = _.orderBy(newData, ['id'], ['asc']);
            this.setState({
                consequenceData: newData,
                updateConsequence: false,
                preMedigationCostEMV: preMedigationCostEMV,
                totalPretRiskEmv: totalPostRiskEmv
            })
        }
        else {
            currentObj.SelectedLikelihoodPost = { label: likelihood.label, value: likelihood.value };
            currentObj.SelectedConsequencePost = { label: consequ.label, value: consequ.value };
            let totalRanking = 0;
            consequenceData.map(i => {
                if (i.id != id) {
                    arr.push(i);
                }
                totalRanking = totalRanking + parseFloat(i.riskEMV);
            });
            let postMedigationCostEMV = Math.log10(totalRanking);

            let totalPretRiskEmv = totalRanking;

            let newData = [...arr, currentObj];
            newData = _.orderBy(newData, ['id'], ['asc']);


            let totalProposedMit = this.state.totalProposedMit;
            let totalResidualRisk = totalRanking + (totalProposedMit == null ? 0 : totalProposedMit);

            this.setState({
                totalResidualRisk: totalResidualRisk,
                consequenceDataPost: newData,
                updateConsequence: false,
                postMedigationCostEMV: postMedigationCostEMV,
                totalPostRiskEmv: totalPretRiskEmv
            })
        }
    }

    drawConsequence = () => {
        return (
            <div className="modal-header fullWidthWrapper">

                <table className="attachmentTable attachmentTableAuto">
                    <thead>
                        <tr>
                            <th>
                                <div className="headCell tableCell-1">{Resources['consequenceType'][currentLanguage]}</div>
                            </th>
                            <th>
                                <div className="headCell"> {'Likelihood Score'}</div>
                            </th>
                            <th>
                                <div className="headCell" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {'Consequence Score'}</div>
                            </th>
                            <th>
                                <div className="headCell"> {'Likelihood Score'}</div>
                            </th>
                            <th>
                                <div className="headCell tableCell-1"> {'Risk Ranking'}</div>
                            </th>
                            <th>
                                <div className="headCell tableCell-1"> {'Risk EMV'}</div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.consequenceData.map((original, index) => {
                            let riskEMV = original.riskEMV != null ? numeral((this.state.statusNumbers == false ? original.riskEMV / 1000 : original.riskEMV)).format('0,0') : 0
                            return (original.isChecked === true ? <tr key={original.id + '-' + index}>
                                <td className="removeTr">
                                    <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {original.title}</div>
                                </td>
                                <td>
                                    <div className="" style={{ maxWidth: 'inherit', paddingLeft: '16px', padding: '10px 0 10px 16px' }}>
                                        <Dropdown title=""
                                            data={this.state.consequences}
                                            handleChange={e => this.actionHandler(original.id, original.conesquenceScore, e, original, true, 1)}
                                            selectedValue={original.SelectedConsequence}
                                            index={original.id} />

                                    </div>
                                </td>
                                <td className="removeTr">
                                    <div className="" style={{ maxWidth: 'inherit', paddingLeft: '16px', padding: '10px 0 10px 16px' }}>
                                        <Dropdown title=""
                                            data={this.state.likelihoods}
                                            handleChange={e => this.actionHandler(original.id, original.likelihoodScore, e, original, false, 2)}
                                            selectedValue={original.SelectedLikelihood}
                                            index={original.id} />
                                    </div>
                                </td>
                                <td>
                                    <div className="" style={{ maxWidth: 'inherit', paddingLeft: '16px', padding: '10px 0 10px 16px' }}>
                                        <Dropdown title=""
                                            data={this.state.consequences}
                                            handleChange={e => this.actionHandler(original.id, original.conesquenceScore, e, original, true, 1)}
                                            selectedValue={original.SelectedConsequence}
                                            index={original.id} />

                                    </div>
                                </td>
                                <td>
                                    <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {original.riskRanking}</div>
                                </td>
                                <td>
                                    <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {riskEMV} </div>
                                </td>
                            </tr>
                                : null
                            )
                        })}
                    </tbody>
                </table>
                <header>
                    <h2 className="zero">{Resources['preMedigationRiskQuantification'][currentLanguage]}</h2>
                </header>

                <div className="Risk__input proForm">
                    <div className="linebylineInput valid-input">
                        <label className="control-label">{Resources['totalEMV'][currentLanguage]}</label>
                        <div className='ui input inputDev '>
                            <input autoComplete="off" readOnly
                                value={this.state.totalPretRiskEmv == null ? 0 : numeral(this.state.totalPretRiskEmv).format('0,0')}
                                type="text"
                                className="form-control" name="totalRiskRanking"
                                placeholder={Resources['totalEMV'][currentLanguage]} />
                        </div>
                    </div>
                    <div className="linebylineInput valid-input">
                        <label className="control-label">{Resources['totalRiskRanking'][currentLanguage]}</label>
                        <div className='ui input inputDev '>
                            <input autoComplete="off" readOnly
                                value={this.state.preMedigationCostEMV == null ? 0 : (this.state.preMedigationCostEMV).toFixed(2)}
                                type="number"
                                className="form-control" name="preMedigationCostEMV"
                                placeholder={Resources['totalRiskRanking'][currentLanguage]} />
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    drawConsequencePost = () => {
        return (
            <div className="modal-header fullWidthWrapper">

                <table className="attachmentTable attachmentTableAuto">
                    <thead>
                        <tr>
                            <th>
                                <div className="headCell tableCell-1">{Resources['consequenceType'][currentLanguage]}</div>
                            </th>
                            <th>
                                <div className="headCell"> {'Likelihood Score'}</div>
                            </th>
                            <th>
                                <div className="headCell" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {'Consequence Score'}</div>
                            </th>
                            <th>
                                <div className="headCell tableCell-1"> {'Risk Ranking'}</div>
                            </th>
                            <th>
                                <div className="headCell tableCell-1"> {'Risk EMV'}</div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.consequenceDataPost.map((original, index) => {

                            let riskEMV = original.riskEMV != null ? numeral((this.state.statusNumbers == false ? original.riskEMV / 1000 : original.riskEMV)).format('0,0') : 0
                            return (original.isChecked === true ? <tr key={original.id + '-' + index}>
                                <td className="removeTr">
                                    <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {original.title}</div>
                                </td>
                                <td className="removeTr">
                                    <div className="" style={{ maxWidth: 'inherit', paddingLeft: '16px', padding: '10px 0 10px 16px' }}>
                                        <Dropdown title=""
                                            data={this.state.likelihoods}
                                            handleChange={e => this.actionHandlerPost(original.id, original.likelihoodScore, e, original, false, 2)}
                                            selectedValue={original.SelectedLikelihoodPost}
                                            index={original.id} />


                                    </div>
                                </td>
                                <td>
                                    <div className="" style={{ maxWidth: 'inherit', paddingLeft: '16px', padding: '10px 0 10px 16px' }}>
                                        <Dropdown title=""
                                            data={this.state.consequences}
                                            handleChange={e => this.actionHandlerPost(original.id, original.conesquenceScore, e, original, true, 1)}
                                            selectedValue={original.SelectedConsequencePost}
                                            index={original.id} />

                                    </div>
                                </td>
                                <td>
                                    <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {original.riskRanking}</div>
                                </td>
                                <td>
                                    <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {riskEMV}</div>
                                </td>
                            </tr>
                                : null
                            )

                        })}
                    </tbody>
                </table>
                <header>
                    <h2 className="zero">{Resources['postMedigationRiskQuantification'][currentLanguage]}</h2>
                </header>

                <div className="Risk__input proForm">
                    <div className="linebylineInput valid-input">
                        <label className="control-label">{Resources['totalEMV'][currentLanguage]}</label>
                        <div className='ui input inputDev '>
                            <input autoComplete="off" readOnly
                                value={this.state.totalPostRiskEmv == null ? 0 : numeral(this.state.totalPostRiskEmv).format('0,0')}
                                type="text"
                                className="form-control" name="totalRiskRanking"
                                placeholder={Resources['totalEMV'][currentLanguage]} />
                        </div>
                    </div>
                    <div className="linebylineInput valid-input">
                        <label className="control-label">{Resources['totalRiskRanking'][currentLanguage]}</label>
                        <div className='ui input inputDev '>
                            <input autoComplete="off" readOnly
                                value={this.state.postMedigationCostEMV == null ? 0 : (this.state.postMedigationCostEMV).toFixed(2)}
                                type="number"
                                className="form-control" name="postMedigationCostEMV"
                                placeholder={Resources['totalRiskRanking'][currentLanguage]} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    StepOneLink = () => {
        if (this.props.changeStatus === true) {
            this.setState({
                FirstStep: true,
                SecondStep: false,
                SecondStepComplate: false,
                CurrentStep: 1,
                ThirdStepComplate: false,
                FourthStepComplate: false,
                FivethStepComplate: false,
                FivethStep: false,
                SixthStep: false,
                SeventhStep: false,
                SixthStepComplate: false,
                SeventhStepComplate: false
            });
        }
    };

    StepTwoLink = () => {
        if (this.props.changeStatus === true) {
            this.setState({
                FirstStep: false,
                SecondStep: true,
                SecondStepComplate: true,
                CurrentStep: 2,
                ThirdStepComplate: false,
                FourthStepComplate: false,
                FivethStepComplate: false,
                FivethStep: false,
                SixthStep: false,
                SeventhStep: false,
                SixthStepComplate: false,
                SeventhStepComplate: false
            });
        }
    };

    StepThreeLink = () => {
        if (this.props.changeStatus === true) {
            this.setState({
                ThirdStep: true,
                SecondStepComplate: true,
                ThirdStepComplate: true,
                CurrentStep: 3,
                FourthStepComplate: false,
                FivethStepComplate: false,
                FourthStep: false,
                FivethStep: false,
                FirstStep: false,
                SecondStep: false,
                SixthStep: false,
                SeventhStep: false,
                SixthStepComplate: false,
                SeventhStepComplate: false
            });

            let consequenceData = this.state.consequenceData;
            if (consequenceData.length == 0) {
                this.fillConsequence();
            }
        }
    };

    StepFourLink = () => {
        if (this.props.changeStatus === true) {
            this.setState({
                FourthStep: true,
                FourthStepComplate: true,
                ThirdStepComplate: true,
                SecondStepComplate: true,
                ThirdStep: false,
                FirstStep: false,
                SecondStep: false,
                CurrentStep: 4,
                FivethStepComplate: false,
                FivethStep: false,
                SixthStep: false,
                SeventhStep: false,
                SixthStepComplate: false,
                SeventhStepComplate: false
            });
        }
    };

    StepFiveLink = () => {
        if (this.props.changeStatus === true) {
            this.setState({
                FourthStep: false,
                FivethStep: true,
                FivethStepComplate: true,
                CurrentStep: 5,
                ThirdStepComplate: true,
                SecondStepComplate: true,
                FourthStepComplate: true,
                SecondStep: false,
                ThirdStep: false,
                FirstStep: false,
                SixthStep: false,
                SeventhStep: false,
                SixthStepComplate: false,
                SeventhStepComplate: false
            });

            let consequenceData = this.state.consequenceData;
            if (consequenceData.length == 0) {
                this.fillConsequence();
            }
        }
    };

    StepSixLink = () => {
        if (this.props.changeStatus === true) {
            this.setState({
                SixthStep: true,
                FourthStep: false,
                FivethStep: false,
                CurrentStep: 6,
                FivethStepComplate: true,
                ThirdStepComplate: true,
                SecondStepComplate: true,
                FourthStepComplate: true,
                SecondStep: false,
                ThirdStep: false,
                FirstStep: false,
                SeventhStep: false,
                SixthStepComplate: true,
                SeventhStepComplate: false
            });

            let consequenceData = this.state.consequenceData;
            if (consequenceData.length == 0) {
                this.fillConsequence();
            }
        }
    };

    StepSevenLink = () => {
        if (this.props.changeStatus === true) {
            this.setState({
                FourthStep: false,
                FivethStepComplate: true,
                CurrentStep: 7,
                ThirdStepComplate: true,
                SecondStepComplate: true,
                FourthStepComplate: true,
                SecondStep: false,
                ThirdStep: false,
                FirstStep: false,
                SixthStep: false,
                SeventhStep: true,
                SixthStepComplate: true,
                SeventhStepComplate: true
            });
        }
    };

    render() {
        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={true} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage] },
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} previousRoute={this.state.perviousRoute} approvalStatus={false} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage] }
        ];

        let comCause = <RiskCause riskId={this.state.docId} />
        let numberFormats =
            <div className="proForm datepickerContainer ">
                <div className="linebylineInput linebylineInput__checkbox ">
                    <label className="control-label">Number Format</label>
                    <div className="ui checkbox radio radioBoxBlue">
                        <input type="radio" name="risk-statusNumbers" defaultChecked={this.state.statusNumbers === false ? null : 'checked'} value="true" onChange={e => { this.handleChangeStatusNumbers(true); this.handleChange(e, 'statusNumbers') }} />
                        <label>{Resources.normal[currentLanguage]}</label>
                    </div>
                    <div className="ui checkbox radio radioBoxBlue">
                        <input type="radio" name="risk-statusNumbers" defaultChecked={this.state.statusNumbers === false ? 'checked' : null} value="false" onChange={e => { this.handleChangeStatusNumbers(false); this.handleChange(e, 'statusNumbers') }} />
                        <label>{Resources.thousand[currentLanguage]}</label>
                    </div>
                </div>
                <div className="linebylineInput valid-input">
                    <Dropdown title="currencyRates" data={this.state.currency}
                        selectedValue={this.state.selectedCurrency}
                        handleChange={event => this.handleChangeDropDown(event, 'currencyId', false, '', '', '', 'selectedCurrency')} />
                </div>
            </div>
        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.risk[currentLanguage]} moduleTitle={Resources['costControl'][currentLanguage]} />
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
                                                        <div className="proForm datepickerContainer">
                                                            <div className="linebylineInput linebylineInput__checkbox">
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
                                                            <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker title='docDate'
                                                                    startDate={this.state.document.docDate}
                                                                    handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                            </div>
                                                            <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker title='requiredDate'
                                                                    startDate={this.state.document.requiredDate}
                                                                    handleChange={e => this.handleChangeDate(e, 'requiredDate')} />
                                                            </div>
                                                        </div>
                                                        <div className="proForm first-proform">
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.generalListTitle[currentLanguage]}</label>
                                                                <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                    <input name='subject' id="subject" className="form-control fsadfsadsa"
                                                                        placeholder={Resources.generalListTitle[currentLanguage]}
                                                                        autoComplete='off'
                                                                        value={this.state.document.subject}
                                                                        onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'subject')} />
                                                                    {errors.subject && touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="proForm datepickerContainer">
                                                            <div className="letterFullWidth">
                                                                <label className="control-label">{Resources.description[currentLanguage]}</label>
                                                                <div className="inputDev ui input">
                                                                    <TextEditor value={this.state.description} onChange={event => this.onChangeMessage(event, 'description')} />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <Dropdown title="priority" data={this.state.priority}
                                                                    selectedValue={this.state.selectedPriorityId}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'priorityId', false, '', '', '', 'selectedPriorityId')} />
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <Dropdown title="riskType"
                                                                    isMulti={false}
                                                                    data={this.state.riskTypes}
                                                                    selectedValue={this.state.selectedRiskType}
                                                                    handleChange={(e) => this.handleChangeDropDown(e, "riskType", 'selectedRiskType')}
                                                                    onChange={setFieldValue}
                                                                    onBlur={setFieldTouched}
                                                                    isClear={false}
                                                                    index="riskType"
                                                                    name="riskType"
                                                                    id="riskType" />
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
                                                        </div>
                                                        <div className="proForm first-proform">
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources['riskCause'][currentLanguage]}</label>
                                                                <div className={"inputDev ui input"} >
                                                                    <input name='descriptionMitigation' id="descriptionMitigation" className="form-control fsadfsadsa"
                                                                        placeholder={Resources['riskCause'][currentLanguage]}
                                                                        autoComplete='off'
                                                                        value={this.state.document.descriptionMitigation}
                                                                        onChange={(e) => this.handleChange(e, 'descriptionMitigation')} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* {this.state.docId > 0 ?
                                                            <Fragment>
                                                                {comCause}
                                                                < RiskConesquence riskId={this.state.docId} />
                                                            </Fragment>
                                                            : null
                                                        } */}
                                                        <div className="slider-Btns">
                                                            {this.state.isLoading ?
                                                                <button className="primaryBtn-1 btn disabled">
                                                                    <div className="spinner">
                                                                        <div className="bounce1" />
                                                                        <div className="bounce2" />
                                                                        <div className="bounce3" />
                                                                    </div>
                                                                </button> :
                                                                this.showBtnsSaving()}
                                                        </div>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </div>
                                        <div className="doc-pre-cycle letterFullWidth">
                                            <div>
                                                {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={10012} EditAttachments={10013} ShowDropBox={10016} ShowGoogleDrive={10017} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                                {this.viewAttachments()}
                                                {this.props.changeStatus === true ? <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <Fragment>
                                    {this.state.SecondStep ?
                                        <div className="subiTabsContent feilds__top">
                                            {this.CurrentMit()}
                                            <RiskCategorisation riskId={this.state.docId} />
                                            {/* {this.ProposedMit(true)} */}
                                            <div className="doc-pre-cycle">
                                                <div className="slider-Btns">
                                                    <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextTopStep}>{Resources['next'][currentLanguage]}</button>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        this.state.ThirdStep ?
                                            <Fragment>
                                                <div className="subiTabsContent feilds__top">
                                                    <div className="document-fields">
                                                        {numberFormats}
                                                    </div>

                                                    <div className="doc-pre-cycle">
                                                        <header>
                                                            <h2 className="zero">{Resources['preMedigationRiskQuantitfaction'][currentLanguage]}</h2>
                                                        </header>
                                                        {!this.state.updateConsequence ?
                                                            <this.drawConsequence /> : <LoadingSection />
                                                        }
                                                    </div>

                                                    <div className="doc-pre-cycle">
                                                        <div className="slider-Btns">
                                                            <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextTopStep}>{Resources['next'][currentLanguage]}</button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </Fragment>
                                            :
                                            this.state.FourthStep ?
                                                <div className="subiTabsContent feilds__top">
                                                    {this.ProposedMit(false)}
                                                    <div className="doc-pre-cycle">
                                                        <div className="slider-Btns">
                                                            <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextTopStep}>{Resources['next'][currentLanguage]}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                this.state.FivethStep ?
                                                    <div className="subiTabsContent feilds__top">
                                                        <div className="document-fields">
                                                            {numberFormats}
                                                        </div>
                                                        <div className="doc-pre-cycle">
                                                            <header>
                                                                <h2 className="zero">{Resources['postMedigationRiskQuantitfaction'][currentLanguage]}</h2>
                                                            </header>
                                                            {!this.state.updateConsequence ?
                                                                <this.drawConsequencePost /> : <LoadingSection />
                                                            }
                                                        </div>
                                                        <div className="doc-pre-cycle">
                                                            <div className="slider-Btns">
                                                                <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextTopStep}>{Resources['next'][currentLanguage]}</button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    :
                                                    this.state.SixthStep ?
                                                        <div className="document-fields">
                                                            <div className="datepickerContainer proForm">
                                                                <header>
                                                                    <h2 className="zero">{Resources['riskAnalysis'][currentLanguage]}</h2>
                                                                </header>
                                                                <div className="Risk__input">
                                                                    <div className="letterFullWidth">
                                                                        <label className="control-label">{'Pre-Mitigation EMV'}</label>
                                                                        <div className='ui input inputDev '>
                                                                            <input style={{ minWidth: '360px' }} autoComplete="off" readOnly
                                                                                value={this.state.totalPretRiskEmv == null ? 0 : numeral(this.state.totalPretRiskEmv).format('0,0')}
                                                                                type="text"
                                                                                className="form-control" name="PreMedigation"
                                                                                placeholder={'Pre-Mitigation EMV'} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="linebylineInput fullInputWidth" style={{ minWidth: '360px' }}>
                                                                        <label className="control-label">{'Post-Mitigation EMV '}</label>
                                                                        <div className='ui input inputDev '>
                                                                            <input autoComplete="off" readOnly
                                                                                value={this.state.totalPostRiskEmv == null ? 0 : numeral(this.state.totalPostRiskEmv).format('0,0')}
                                                                                type="text"
                                                                                className="form-control" name="PostMedigationCostEMV"
                                                                                placeholder={'Post-Mitigation EMV'} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="linebylineInput fullInputWidth" style={{ minWidth: '360px' }}>
                                                                        <label className="control-label">{'Cost Of  Mitigation'}</label>
                                                                        <div className='ui input inputDev '>
                                                                            <input autoComplete="off" readOnly
                                                                                value={this.state.totalResidualRisk == null ? 0 : numeral(this.state.totalResidualRisk).format('0,0')}
                                                                                type="text"
                                                                                className="form-control" name="CostMedigation"
                                                                                placeholder={'Cost Of  Mitigation'} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="linebylineInput fullInputWidth" style={{ minWidth: '360px' }}>
                                                                        <label className="control-label">{'Post-Mitigation EMV + Cost Of  Mitigation'}</label>
                                                                        <div className='ui input inputDev '>
                                                                            <input autoComplete="off" readOnly
                                                                                value={numeral(this.state.totalResidualRisk + this.state.totalPostRiskEmv).format('0,0')}
                                                                                type="text"
                                                                                className="form-control" name="Mitigation"
                                                                                placeholder={'Post-Mitigation EMV + Cost Of  Mitigation'} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="linebylineInput fullInputWidth" style={{ minWidth: '360px' }}>
                                                                        <label className="control-label">{'Cost Effectiveness'}</label>
                                                                    </div>
                                                                    <div className="ui left pointing label labelWithArrowBorder basic">
                                                                        <span>{this.state.totalResidualRisk > this.state.totalPretRiskEmv ? 'Cost Effective' : 'Not Cost Effective'}</span>
                                                                    </div>

                                                                    <div className="linebylineInput fullInputWidth" style={{ minWidth: '360px' }}>
                                                                        <label className="control-label">{'Cost Benefit'}</label>
                                                                        <div className='ui input inputDev '>
                                                                            <input autoComplete="off" readOnly
                                                                                value={numeral(this.state.totalPretRiskEmv - (this.state.totalResidualRisk + this.state.totalPostRiskEmv)).format('0,0')}
                                                                                type="text"
                                                                                className="form-control" name="CostBenefit"
                                                                                placeholder={'Cost Benefit'} />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <RiskRealisation riskId={this.state.docId} />

                                                            <div className="doc-pre-cycle">
                                                                <div className="slider-Btns">
                                                                    <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextTopStep}>{Resources['next'][currentLanguage]}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <Fragment>
                                                            <div className="document-fields tableBTnabs">
                                                                {this.state.docId > 0 ? <AddDocAttachment projectId={projectId} docTypeId={this.state.docTypeId} docId={this.state.docId} /> : null}
                                                            </div>
                                                            <div className="doc-pre-cycle">
                                                                <div className="slider-Btns">
                                                                    <button className="primaryBtn-1 btn meduimBtn" onClick={this.NextTopStep}>{Resources['next'][currentLanguage]}</button>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                    }
                                </Fragment>}
                        </div>
                        <div className="docstepper-levels">
                            {/* Next & Previous */}
                            <div className="step-content-foot">
                                <span onClick={this.PreviousStep} className={!this.state.FirstStep && this.props.changeStatus === true ? "step-content-btn-prev " :
                                    "step-content-btn-prev disabled"}><i className="fa fa-caret-left" aria-hidden="true"></i>{Resources.previous[currentLanguage]}</span>

                                <span onClick={this.NextTopStep} className={this.props.changeStatus === true ? "step-content-btn-prev "
                                    : "step-content-btn-prev disabled"}>{Resources.next[currentLanguage]}<i className="fa fa-caret-right" aria-hidden="true"></i>
                                </span>
                            </div>
                            {/* Steps Active  */}
                            <div className="workflow-sliderSteps">
                                <div className="step-slider">
                                    <div onClick={this.StepOneLink} data-id="step1" className={"step-slider-item " + (this.state.SecondStepComplate ? "active" : "current__step")}>
                                        <div className="steps-timeline">
                                            <span>1</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6 onClick={e => this.setState({ CurrentStep: 1 })}>
                                                {Resources.information[currentLanguage]}
                                            </h6>
                                        </div>
                                    </div>
                                    <div onClick={this.StepTwoLink} data-id="step2 " className={"step-slider-item " + (this.state.ThirdStepComplate ? "active" : this.state.SecondStepComplate ? "current__step" : "")}>
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources["mitigation"][currentLanguage]}</h6>
                                        </div>
                                    </div>
                                    <div onClick={this.StepThreeLink} data-id="step3" className={"step-slider-item " + (this.state.FourthStepComplate ? "active" : this.state.ThirdStepComplate ? "current__step" : "")}>
                                        <div className="steps-timeline">
                                            <span>3</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>
                                                {Resources["consequence"][currentLanguage]}
                                            </h6>
                                        </div>
                                    </div>

                                    <div
                                        onClick={this.StepFourLink}
                                        data-id="step4" className={"step-slider-item " + (this.state.FivethStepComplate ? "active" : this.state.FourthStepComplate ? "current__step" : "")}>
                                        <div className="steps-timeline">
                                            <span>4</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources["proposeMitigation"][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div
                                        onClick={this.StepFiveLink}
                                        data-id="step5"
                                        className={
                                            "step-slider-item " +
                                            (this.state.SixthStepComplate
                                                ? "active"
                                                : this.state.FivethStepComplate
                                                    ? "current__step"
                                                    : "")
                                        }
                                    >
                                        <div className="steps-timeline">
                                            <span>5</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources["postQuantitifaction"][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div
                                        onClick={this.StepSixLink}
                                        data-id="step6"
                                        className={
                                            "step-slider-item " +
                                            (this.state.SeventhStepComplate
                                                ? "active"
                                                : this.state.SixthStepComplate
                                                    ? "current__step"
                                                    : "")
                                        }
                                    >
                                        <div className="steps-timeline">
                                            <span>6</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources["riskAnalysis"][currentLanguage]}</h6>
                                        </div>
                                    </div>

                                    <div
                                        onClick={this.StepSevenLink}
                                        data-id="step7"
                                        className={
                                            this.state.SeventhStep
                                                ? "step-slider-item  current__step"
                                                : "step-slider-item"
                                        }
                                    >
                                        <div className="steps-timeline">
                                            <span>7</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>{Resources["addDocAttachment"][currentLanguage]}</h6>
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
import React, { Component, Fragment } from "react";
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
import RiskCause from '../../Componants/OptionsPanels/RiskCause';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import * as communicationActions from '../../store/actions/communication';
import RiskConesquence from '../../Componants/publicComponants/RiskConesquence';
import RiskRealisation from '../../Componants/publicComponants/RiskRealisation';
import AddDocAttachment from "../../Componants/publicComponants/AddDocAttachment";
import { toast } from "react-toastify";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument';
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import numeral from 'numeral';
import RiskCategorisation from "../../Componants/publicComponants/RiskCategorisation";
import Steps from "../../Componants/publicComponants/Steps";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'

var steps_defination = [];
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
    //actionProgress: Yup.string().required(Resources['actionProgress'][currentLanguage]).nullable(true),
    medigationCost: Yup.number().required(Resources['medigationCost'][currentLanguage]),
    //actionOwnerContactId: Yup.string().required(Resources['ownerRisk'][currentLanguage]).nullable(true)
});

const riskMitigationProgressValidationSchema = Yup.object().shape({
    proposeMitigation: Yup.string().required(Resources['proposeMitigation'][currentLanguage]).nullable(true),
    actionAchieve: Yup.string().required(Resources['actionAchieve'][currentLanguage]),
    actionPlanned: Yup.string().required(Resources['actionPlanned'][currentLanguage]),
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
            postQuantitifactionStepComplate: false,
            addDocStepComplate: false,
            postQuantitifactionStep: false,
            addDocStep: false,
            analysisStepComplate: false,
            analysisStep: false,
            CurrentStep: 0,
            CycleEditLoading: false,
            CycleAddLoading: false,
            DocLoading: false,
            perviousRoute: perviousRoute,
            preMedigationCostEMV: 0,
            medigationCost: 0,
            preMedigation: 0,
            EMV: 0,
            documentCycle: {},
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
            description: '',
            descriptionMitigation: '',
            riskMitigationProgressData: [],
            isEdit: false
        }

        if (!Config.IsAllow(10000) && !Config.IsAllow(10001) && !Config.IsAllow(10003)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }
        steps_defination = [
            {
                name: "information",
                callBackFn: null
            },
            {
                name: "riskIdentification",
                callBackFn: null
            },
            {
                name: "mitigation",
                callBackFn: null
            }, {
                name: "consequence",
                callBackFn: null
            },
            {
                name: "proposeMitigation",
                callBackFn: null
            }, {
                name: "postQuantitifaction",
                callBackFn: null
            },
            {
                name: "riskAnalysis",
                callBackFn: null
            },
            {
                name: "riskRealisation",
                callBackFn: null
            },
            {
                name: "riskMitigationProgress",
                callBackFn: null
            },
            {
                name: "addDocAttachment",
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

        dataservice.GetDataList("GetaccountsDefaultListForList?listType=currency", 'title', 'id').then(result => {
            this.setState({ currency: result })
        });
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

            this.setState({ isEdit: true });
            this.props.actions.documentForEdit("GetCommunicationRiskForEdit?id=" + this.state.docId);

            dataservice.GetDataGrid("GetRiskCycles?riskId=" + this.state.docId).then(result => {
                let IRCyclesPre = [];
                let IRCyclesPost = [];
                let totalProposedMit = 0;
                if (result) {
                    result.map(i => {
                        if (i.isActive == true) {
                            IRCyclesPre.push(i)
                        } else {
                            IRCyclesPost.push(i)
                            totalProposedMit = totalProposedMit + (i.mitigationCost == null ? 0 : i.mitigationCost);
                        }
                    })
                }

                let totalPostRiskEmv = this.state.totalPostRiskEmv;
                let totalResidualRisk = (totalPostRiskEmv == null ? 0 : totalPostRiskEmv) + totalProposedMit;

                this.setState({
                    totalProposedMit: totalProposedMit,
                    totalResidualRisk: totalResidualRisk,

                    IRCyclesPre: IRCyclesPre,
                    IRCyclesPost: IRCyclesPost
                });

                let data = { items: result ? result : [] };
                this.props.actions.ExportingData(data);
            });
            this.fillDropDownsCycle(true);

        } else {
            const riskDocument = {
                id: 0,
                projectId: projectId,
                arrange: "1",
                refDoc: "",
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
            if (result) {
                let items = _.orderBy(result, ['action'],['desc']);
           
                items.map(i => {
                    data.push({
                        label: i['title'], value: i['id'], action: i['value']
                    })
                })
                this.setState({
                    likelihoods: [...data]
                });
            }
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

    viewAttachments() {
        return (
            this.props.document.id > 0 ? (Config.IsAllow(10014) === true ? <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} /> : null) : null
        )
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrentStep: stepNo });

        let consequenceData = this.state.consequenceData;
        if (consequenceData.length == 0) {
            this.fillConsequence();
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
                                        : <button className={"primaryBtn-1 btn meduimBtn" + (this.state.isViewMode === true ? " disNone" : " ")} type='submit' >{Resources['save'][currentLanguage]}</button>
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
                                        {/* <div className="letterFullWidth fullInputWidth">
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
                                        </div> */}
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['medigationCost'][currentLanguage]}</label>
                                            <div className={'ui input inputDev' + (errors.medigationCost && touched.medigationCost ? (" has-error") : !errors.medigationCost && touched.medigationCost ? (" has-success") : " ")} >
                                                <input autoComplete="off" name="medigationCost" id="medigationCost"
                                                    value={this.state.documentCycle.mitigationCost}
                                                    className="form-control"
                                                    onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                    onChange={(e) => { this.handleChangeCycle(e, 'mitigationCost') }}
                                                    placeholder={Resources['medigationCost'][currentLanguage]} />
                                                {errors.medigationCost && touched.medigationCost ? (<em className="pError">{errors.medigationCost}</em>) : null}
                                            </div>
                                        </div>
                                        {/* <div className="linebylineInput valid-input mix_dropdown">
                                            <label className="control-label">{Resources.responsibleCompanyName[currentLanguage]}</label>
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
                                                        id="actionOwnerId" styles={CompanyDropdown} classDrop="companyName1 " />
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
                                                        id="actionOwnerContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                                </div>
                                            </div>
                                        </div> */}
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
                                        : <button className={"primaryBtn-1 btn meduimBtn" + (this.state.isViewMode === true ? " disNone" : " ")} type='submit' >{Resources['save'][currentLanguage]}</button>
                                    }
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <div className="doc-pre-cycle">
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
                                        <div className="headCell"> {Resources['deadLineDate'][currentLanguage]}</div>
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
                                        <td>
                                            <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.docDate != null ? moment(item.docDate).format('DD/MM/YYYY') : 'No Date'}</div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.mitigationCost}</div>
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
        let likelihood = { label: 'Please Select', value: 0 }
        let consequ = { label: 'Please Select', value: 0 }
        let state = { ...this.state };
        let dslikelihood = this.state.likelihoods;
        let consequences = this.state.consequences;
        let totalRankingPost = 0;
        let totalRanking = 0; 
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
                            return (original.isChecked === true ?

                                <tr key={original.id + '-' + index}>
                                    <td className="removeTr">
                                        <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {original.title}</div>
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
                    <tfoot>
                        <tr key={'-total152'}>
                            <td colSpan='3'></td>
                            <td>{this.state.preMedigationCostEMV == null ? 0 : (this.state.preMedigationCostEMV).toFixed(2)}</td>
                            <td>{this.state.totalPretRiskEmv == null ? 0 : numeral(this.state.totalPretRiskEmv).format('0,0')}</td>
                        </tr>
                    </tfoot>
                </table>
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

                    <tfoot>
                        <tr key={'-total152'}>
                            <td colSpan='3'></td>
                            <td>{this.state.postMedigationCostEMV == null ? 0 : (this.state.postMedigationCostEMV).toFixed(2)}</td>
                            <td>{this.state.totalPostRiskEmv == null ? 0 : numeral(this.state.totalPostRiskEmv).format('0,0')}</td>
                        </tr>

                    </tfoot>
                </table>
            </div>
        );
    }

    saveriskIdentification = (values) => {
        let obj = {
            id: this.state.docId,
            description: this.state.description,
            subject: values.subject,
        }
        this.setState({ btnLoading: true })
        dataservice.addObject('UpdateMainRisk', obj).then(
            res => {
                values.subject = res.subject
                this.setState({ btnLoading: false })
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(res => {
                this.setState({
                    btnLoading: false
                });
                toast.error(Resources["operationCanceled"][currentLanguage]);
            });
    }

    render() {

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

        let riskIdentification =
            < div className="document-fields" >
                <Formik initialValues={{
                    subject: this.state.document.subject,
                    description: this.state.description,

                }}
                    validationSchema={validationSchema}
                    // enableReinitialize={true}
                    onSubmit={(values) => {
                        this.saveriskIdentification(values);
                    }}>
                    {({ errors, touched, handleBlur, handleChange, handleSubmit, values }) => (
                        <Form id="rfiForm25" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                            <div className="proForm datepickerContainer">

                                <div className="proForm first-proform letterFullWidth">
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">{Resources.generalListTitle[currentLanguage]}</label>
                                        <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                            <input name='subject' id="subject" className="form-control fsadfsadsa"
                                                placeholder={Resources.generalListTitle[currentLanguage]}
                                                autoComplete='off'
                                                value={values.subject}
                                                onBlur={handleBlur}
                                                onChange={handleChange} />
                                            {errors.subject && touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                        </div>
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
                            </div>

                            <div className="slider-Btns">
                                {this.state.btnLoading ?
                                    <button className="primaryBtn-1 btn disabled">
                                        <div className="spinner">
                                            <div className="bounce1" />
                                            <div className="bounce2" />
                                            <div className="bounce3" />
                                        </div>
                                    </button> :


                                    <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>
                                }
                            </div>
                            <RiskCause riskId={this.state.docId} />

                            <div className="doc-pre-cycle">
                                <div className="slider-Btns">
                                    <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(2)}>{Resources['next'][currentLanguage]}</button>
                                </div>

                            </div>

                        </Form>
                    )}
                </Formik>
            </div >

        let riskMitigationProgress = () => {
            let dropData = []
            this.state.IRCyclesPost.forEach(item => {
                var obj = {};
                if (item.isActive == false) {
                    obj.value = item['id'];
                    obj.label = item['subject'];
                    dropData.push(obj);
                }
            });
            return (
                <div className="subiTabsContent feilds__top">
                    <div className="subiTabsContent">
                        <header className="main__header">
                            <div className="main__header--div">
                                <h2 className="zero">{Resources['riskMitigationProgress'][currentLanguage]}</h2>
                            </div>
                        </header>
                        <div className='document-fields'>
                            <Formik initialValues={{
                                proposeMitigation: "",
                                date: moment().format('YYYY-MM-DD'),
                                actionAchieve: "",
                                actionPlanned: "",
                                riskId: this.state.docId
                            }}
                                validationSchema={riskMitigationProgressValidationSchema}
                                enableReinitialize={true}
                                onSubmit={(values, ) => {

                                    let data = this.state.riskMitigationProgressData
                                    data.push(values) 
                                    this.setState({
                                        riskMitigationProgressData: data
                                    });
                                    toast.success(Resources["operationSuccess"][currentLanguage]);
                                    //    values.date = moment().format('YYYY-MM-DD')
                                    //    values.actionAchieve = ""
                                    //    values.actionPlanned = ""
                                    //    values.proposeMitigation = ""

                                }}>
                                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched, values }) => (
                                    <Form id="RiskRequestCycleFormPost" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                        <div className="proForm datepickerContainer">
                                            <div className="linebylineInput valid-input">
                                                <Dropdown title="proposeMitigation"
                                                    data={dropData}
                                                    selectedValue={values.proposeMitigation}
                                                    handleChange={e => setFieldValue('proposeMitigation', e)}
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    error={errors.proposeMitigation}
                                                    touched={touched.proposeMitigation}
                                                    index="proposeMitigation"
                                                    name="proposeMitigation"
                                                    id="proposeMitigation" />
                                            </div>

                                            <div className="linebylineInput valid-input alternativeDate">
                                                <DatePicker title='date'
                                                    startDate={values.date}
                                                    handleChange={e => setFieldValue('date', e)} />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['actionAchieve'][currentLanguage]}</label>
                                                <div className={'ui input inputDev' + (errors.actionAchieve && touched.actionAchieve ? (" has-error") : !errors.actionAchieve && touched.actionAchieve ? (" has-success") : " ")} >
                                                    <input autoComplete="off" name="actionAchieve" id="actionAchieve"
                                                        value={values.actionAchieve}
                                                        className="form-control"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        placeholder={Resources['actionAchieve'][currentLanguage]} />
                                                    {errors.actionAchieve && touched.actionAchieve ? (<em className="pError">{errors.actionAchieve}</em>) : null}
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources['actionPlanned'][currentLanguage]}</label>
                                                <div className={'ui input inputDev' + (errors.actionPlanned && touched.actionPlanned ? (" has-error") : !errors.actionPlanned && touched.actionPlanned ? (" has-success") : " ")} >
                                                    <input autoComplete="off" name="actionPlanned" id="actionPlanned"
                                                        value={values.actionPlanned} className="form-control"
                                                        onBlur={handleBlur} onChange={handleChange}
                                                        placeholder={Resources['actionPlanned'][currentLanguage]} />
                                                    {errors.actionPlanned && touched.actionPlanned ? (<em className="pError">{errors.actionPlanned}</em>) : null}
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
                                                : <button className={"primaryBtn-1 btn meduimBtn" + (this.state.isViewMode === true ? " disNone" : " ")} type='submit' >{Resources['save'][currentLanguage]}</button>
                                            }
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                            <div className="doc-pre-cycle">
                                <table className="attachmentTable attachmentTable__fixedWidth">
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="headCell tableCell-1">{Resources['proposeMitigation'][currentLanguage]}</div>
                                            </th>
                                            <th>
                                                <div className="headCell"> {Resources['date'][currentLanguage]}</div>
                                            </th>
                                            <th>
                                                <div className="headCell"> {Resources['actionAchieve'][currentLanguage]}</div>
                                            </th>
                                            <th>
                                                <div className="headCell"> {Resources['actionPlanned'][currentLanguage]}</div>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {this.state.riskMitigationProgressData.map((item, index) => {
                                            return <tr key={item.id + '-' + index}>
                                                <td className="removeTr">
                                                    <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.proposeMitigation['label']}</div>
                                                </td>
                                                <td>
                                                    <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.date != null ? moment(item.date).format('DD/MM/YYYY') : 'No Date'}</div>
                                                </td>
                                                <td>
                                                    <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.actionPlanned}</div>
                                                </td>

                                                <td>
                                                    <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.actionAchieve}</div>
                                                </td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="doc-pre-cycle">
                        <div className="slider-Btns">
                            <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(9)}>{Resources['next'][currentLanguage]}</button>
                        </div>
                    </div>
                </div >

            )
        }

        return (
            <div className="mainContainer" >
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.risk[currentLanguage]} moduleTitle={Resources['costControl'][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            {this.state.CurrentStep == 0 ?
                                <div id="step1" className="step-content-body">
                                    <div className="subiTabsContent">
                                        <div className="document-fields">
                                            <Formik initialValues={{ ...this.state.document }}
                                                //   validationSchema={validationSchema}
                                                enableReinitialize={this.props.changeStatus}
                                                onSubmit={(values) => {
                                                    if (values.isFirstButton) {
                                                        if (this.props.showModal) { return; }

                                                        if (this.props.changeStatus === false && this.state.docId === 0) {
                                                            this.saveRisk();
                                                        } else {
                                                            if (this.props.changeStatus == true)
                                                                this.editRisk();
                                                            this.changeCurrentStep(1);

                                                        }
                                                    }
                                                }}>
                                                {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                    <Form id="rfiForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>

                                                        <div className="proForm datepickerContainer">
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                                <div className={"ui input inputDev " + (errors.arrange && touched.arrange ? (" has-error") : " ")}>
                                                                    <input type="text" className="form-control" id="arrange" readOnly
                                                                        value={this.state.document.arrange || ''}
                                                                        name="arrange"
                                                                        placeholder={Resources.arrange[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'arrange')} />
                                                                </div>
                                                            </div>
                                                            <div className="linebylineInput valid-input">
                                                                <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                                                <div className={"ui input inputDev " + (errors.refDoc && touched.refDoc ? (" has-error") : " ")}>
                                                                    <input type="text" className="form-control" id="refDoc" readOnly
                                                                        value={this.state.document.refDoc || ''}
                                                                        name="refDoc"
                                                                        placeholder={Resources.refDoc[currentLanguage]}
                                                                        onBlur={(e) => { handleChange(e); handleBlur(e) }}
                                                                        onChange={(e) => this.handleChange(e, 'refDoc')} />
                                                                </div>
                                                            </div>
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
                                                            {this.state.docId > 0 ?
                                                                <Fragment>
                                                                    <div className="linebylineInput valid-input">
                                                                        <label className="control-label">{Resources.raisedBy[currentLanguage]}</label>
                                                                        <div className="ui input inputDev">
                                                                            <input type="text" className="form-control" id="createdBy" readOnly
                                                                                value={this.state.document.createdBy || ''}
                                                                                name="createdBy"
                                                                                placeholder={Resources.raisedBy[currentLanguage]} />
                                                                        </div>
                                                                    </div>

                                                                    <div className="linebylineInput valid-input alternativeDate">
                                                                        <DatePicker title='lastEditDate'
                                                                            startDate={this.state.document.lastEditDate} />
                                                                    </div>

                                                                </Fragment>
                                                                :
                                                                null
                                                            }

                                                            <div className="proForm datepickerContainer">
                                                                <div className="linebylineInput valid-input mix_dropdown">
                                                                    <label className="control-label">{Resources.ownerRisk[currentLanguage]}</label>
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
                                                                                id="ownerCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                                                                        </div>
                                                                        <div className="super_company">
                                                                            <Dropdown isMulti={false} data={this.state.ToContacts}
                                                                                title="companyRiskOwnerRequired"
                                                                                selectedValue={this.state.selectedToContact}
                                                                                handleChange={event => this.handleChangeDropDown(event, 'ownerContactId', false, '', '', '', 'selectedToContact')}
                                                                                onChange={setFieldValue}
                                                                                onBlur={setFieldTouched}
                                                                                error={errors.ownerContactId}
                                                                                touched={touched.ownerContactId}
                                                                                name="ownerContactId"
                                                                                id="ownerContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>


                                                            <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker title='docDate'
                                                                    startDate={this.state.document.docDate}
                                                                    handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                            </div>
                                                            {/* <div className="linebylineInput valid-input alternativeDate">
                                                                <DatePicker title='requiredDate'
                                                                    startDate={this.state.document.requiredDate}
                                                                    handleChange={e => this.handleChangeDate(e, 'requiredDate')} />
                                                            </div> */}
                                                        </div>

                                                        {this.state.docId > 0 ?
                                                            <Fragment>

                                                                <RiskConesquence riskId={this.state.docId} />
                                                                <RiskCategorisation riskId={this.state.docId} isEdit={this.state.isEdit} />
                                                            </Fragment>
                                                            : null
                                                        }
                                                        <div className="slider-Btns">
                                                            {this.state.isLoading ?
                                                                <button className="primaryBtn-1 btn disabled">
                                                                    <div className="spinner">
                                                                        <div className="bounce1" />
                                                                        <div className="bounce2" />
                                                                        <div className="bounce3" />
                                                                    </div>
                                                                </button> :

                                                                this.state.docId === 0 ?
                                                                    <button onClick={(e) => setFieldValue('isFirstButton', true)}
                                                                        className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>
                                                                    : <button onClick={(e) => setFieldValue('isFirstButton', true)} className={this.state.isViewMode === true ? "primaryBtn-1 btn meduimBtn disNone" : "primaryBtn-1 btn meduimBtn"} type='submit' >
                                                                        {Resources.next[currentLanguage]}</button>
                                                            }
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
                                    {this.state.CurrentStep == 1 ?
                                        riskIdentification

                                        :
                                        this.state.CurrentStep == 2 ?
                                            <div className="subiTabsContent feilds__top">
                                                {this.CurrentMit()}

                                                <div className="doc-pre-cycle">
                                                    <div className="slider-Btns">
                                                        <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(3)}>{Resources['next'][currentLanguage]}</button>
                                                    </div>
                                                </div>
                                            </div>
                                            : this.state.CurrentStep == 3 ?
                                                <Fragment>
                                                    <div className="subiTabsContent feilds__top">
                                                        {/* <div className="document-fields">
                                                        {numberFormats}
                                                    </div> */}

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
                                                                <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(4)}>{Resources['next'][currentLanguage]}</button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </Fragment>
                                                :
                                                this.state.CurrentStep == 4 ?
                                                    <div className="subiTabsContent feilds__top">
                                                        {this.ProposedMit(false)}
                                                        <div className="doc-pre-cycle">
                                                            <div className="slider-Btns">
                                                                <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(5)}>{Resources['next'][currentLanguage]}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    this.state.CurrentStep == 5 ?
                                                        <div className="subiTabsContent feilds__top">
                                                            {/* <div className="document-fields">
                                                            {numberFormats}
                                                        </div> */}
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
                                                                    <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(6)}>{Resources['next'][currentLanguage]}</button>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        :
                                                        this.state.CurrentStep === 6 ?
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
                                                                                    value={this.state.totalProposedMit == null ? 0 : numeral(this.state.totalProposedMit).format('0,0')}
                                                                                    type="text"
                                                                                    className="form-control" name="CostMedigation"
                                                                                    placeholder={'Cost Of  Mitigation'} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="linebylineInput fullInputWidth" style={{ minWidth: '360px' }}>
                                                                            <label className="control-label">{'Post-Mitigation EMV + Cost Of  Mitigation'}</label>
                                                                            <div className='ui input inputDev '>
                                                                                <input autoComplete="off" readOnly
                                                                                    value={numeral(this.state.totalProposedMit + this.state.totalPostRiskEmv).format('0,0')}
                                                                                    type="text"
                                                                                    className="form-control" name="Mitigation"
                                                                                    placeholder={'Post-Mitigation EMV + Cost Of  Mitigation'} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="linebylineInput fullInputWidth" style={{ minWidth: '360px' }}>
                                                                            <label className="control-label">{'Cost Effectiveness'}</label>
                                                                        </div>
                                                                        <div className="ui left pointing label labelWithArrowBorder basic">
                                                                            <span>{(this.state.totalProposedMit + this.state.totalPostRiskEmv) > this.state.totalPretRiskEmv ? 'Not Cost Effective' : 'Cost Effective'}</span>
                                                                        </div>

                                                                        <div className="linebylineInput fullInputWidth" style={{ minWidth: '360px' }}>
                                                                            <label className="control-label">{'Cost Benefit'}</label>
                                                                            <div className='ui input inputDev '>
                                                                                <input autoComplete="off" readOnly
                                                                                    value={numeral(this.state.totalPretRiskEmv - (this.state.totalProposedMit + this.state.totalPostRiskEmv)).format('0,0')}
                                                                                    type="text"
                                                                                    className="form-control" name="CostBenefit"
                                                                                    placeholder={'Cost Benefit'} />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>

                                                                <div className="doc-pre-cycle">
                                                                    <div className="slider-Btns">
                                                                        <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(7)}>{Resources['next'][currentLanguage]}</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            this.state.CurrentStep === 7 ?
                                                                <div className="document-fields doc-pre-cycle">
                                                                    <header>
                                                                        <h2 className="zero">{Resources['riskRealisation'][currentLanguage]}</h2>
                                                                    </header>
                                                                    <RiskRealisation riskId={this.state.docId} />
                                                                    <div className="doc-pre-cycle">
                                                                        <div className="slider-Btns">
                                                                            <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(8)}>{Resources['next'][currentLanguage]}</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                :
                                                                this.state.CurrentStep === 8 ?
                                                                    riskMitigationProgress() :
                                                                    <Fragment>
                                                                        <div className="document-fields tableBTnabs">
                                                                            {this.state.docId > 0 ? <AddDocAttachment projectId={projectId} docTypeId={this.state.docTypeId} docId={this.state.docId} /> : null}
                                                                        </div>
                                                                        <div className="doc-pre-cycle">
                                                                            <div className="slider-Btns">
                                                                                <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.changeCurrentStep(10)}>{Resources['next'][currentLanguage]}</button>
                                                                            </div>
                                                                        </div>
                                                                    </Fragment>
                                    }
                                </Fragment>}
                        </div>
                        <Steps
                            steps_defination={steps_defination}
                            exist_link="/Risk/"
                            docId={this.state.docId}
                            changeCurrentStep={stepNo =>
                                this.changeCurrentStep(stepNo)
                            }
                            stepNo={this.state.CurrentStep}
                        />
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
                                        />
                                    </div>
                                </div>
                                : null
                        }
                    </div>
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
        viewModel: state.communication.viewModel,
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(riskAddEdit))
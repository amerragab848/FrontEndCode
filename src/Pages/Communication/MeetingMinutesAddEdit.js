import React, { Component, Fragment } from "react";
import DropdownMelcous from "../../Componants/OptionsPanels/DropdownMelcous";
import Api from "../../api";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import moment from "moment";
import Resources from "../../resources.json"; 
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import DataService from "../../Dataservice";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Config from "../../Services/Config.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux"; 
import * as communicationActions from "../../store/actions/communication";
import Recycle from "../../Styles/images/attacheRecycle.png";
import "react-table/react-table.css";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import Steps from "../../Componants/publicComponants/Steps";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(
        Resources["subjectRequired"][currentLanguage]
    ),
    fromContact: Yup.string().required(
        Resources["fromContactRequired"][currentLanguage]
    ),
    calledByContact: Yup.string().required(
        Resources["calledByContactRequired"][currentLanguage]
    ),
    facilitatorContact: Yup.string().required(
        Resources["facilitatorContactReuired"][currentLanguage]
    ),
    noteTakerContact: Yup.string().required(
        Resources["noteTakerContactRequired"][currentLanguage]
    )
});

const attendeesValidationSchema = Yup.object().shape({
    attendeesContact: Yup.string().required(
        Resources["fromContactRequired"][currentLanguage]
    )
});

const topicsValidationSchema = Yup.object().shape({
    description: Yup.string().required(
        Resources["descriptionRequired"][currentLanguage]
    ),
    topicContact: Yup.string().required(
        Resources["calledByContactRequired"][currentLanguage]
    )
});

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
let perviousRoute = 0;
let link = 0;

var steps_defination = [
    {
        name: "addMeetingMinutes",
        callBackFn: null
    },
    {
        name: "attendenceAdttion",
        callBackFn: null
    },
    {
        name: "topicsAddition",
        callBackFn: null
    }
];

class MeetingMinutesAddEdit extends Component {
    constructor(props) {
        super(props);
        
        const query = new URLSearchParams(this.props.location.search); 
        let obj = Config.extractDataFromParamas(query);
        if (Object.entries(obj).length === 0) {
            this.props.history.goBack();
        } else {
            docId = obj.docId;
            projectId = obj.projectId;
            projectName = obj.projectName;
            isApproveMode = obj.isApproveMode;
            docApprovalId = obj.docApprovalId;
            arrange = obj.arrange;
            perviousRoute = obj.perviousRoute;
        }

        link = perviousRoute.split("/")[1];

        this.state = {
            btnTxt: "save",
            CurrStep: 0,
            IsEditMode: false,
            attendenceId: 0,
            validStep: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 33,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            meetingId: 0,
            Companies: [],
            fromContacts: [],
            calledContacts: [],
            facilitatorContacts: [],
            noteTakerContacts: [],
            topics: [],
            topicsContacts: [],
            topicContacts: [],
            selectedTopicContact: {
                label: Resources.calledByContactRequired[currentLanguage],
                value: "0"
            },
            selectedTopicCompany: {
                label: Resources.calledByContactRequired[currentLanguage],
                value: "0"
            },
            attendees: [],
            attendencesContacts: [],
            selectedAttendencesContact: {
                label: Resources.calledByContactRequired[currentLanguage],
                value: "0"
            },
            selectedAttendencesCompany: {
                label: Resources.fromCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedFromCompany: {
                label: Resources.fromCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedFromContact: {
                label: Resources.fromContactRequired[currentLanguage],
                value: "0"
            },
            selectedCalledByCompany: {
                label: Resources.calledByCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedCalledByContact: {
                label: Resources.calledByContactRequired[currentLanguage],
                value: "0"
            },
            selectedFacilitatorCompany: {
                label: Resources.facilitatorCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedFacilitatorContact: {
                label: Resources.facilitatorContactReuired[currentLanguage],
                value: "0"
            },
            selectedNoteTakerCompany: {
                label: Resources.noteTakerCompanyReuired[currentLanguage],
                value: "0"
            },
            selectedNoteTakerContact: {
                label: Resources.noteTakerContactRequired[currentLanguage],
                value: "0"
            },
            requiredDate: moment(),
            isLoading: true,
            permission: [
                { name: "sendByEmail", code: 113 },
                { name: "sendByInbox", code: 112 },
                { name: "sendTask", code: 0 },
                { name: "distributionList", code: 967 },
                { name: "createTransmittal", code: 3053 },
                { name: "sendToWorkFlow", code: 717 },
                { name: "viewAttachments", code: 3325 },
                { name: "deleteAttachments", code: 838364 }
            ],
            document: {},
            attendence: {},
            topics: []
        };
        if (
            !Config.IsAllow(504) &&
            !Config.IsAllow(505) &&
            !Config.IsAllow(507)
        ) {
            toast.warning(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
    }

    changeCurrentStep = stepNo => {
        this.setState({ CurrStep: stepNo });
    };

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(507)) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(507)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(507)) {
                    if (
                        this.props.document.status !== false &&
                        Config.IsAllow(507)
                    ) {
                        this.setState({ isViewMode: false });
                    } else {
                        this.setState({ isViewMode: true });
                    }
                } else {
                    this.setState({ isViewMode: true });
                }
            }
        } else {
            this.setState({ isViewMode: false });
        }
    }

    fillDropDowns(isEdit) {
        DataService.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId").then(res => {
            if (isEdit) {
                let companyId = this.state.document.fromCompanyId;
                if (companyId) {
                    this.setState({
                        selectedFromCompany: {
                            label: this.props.document.fromCompanyName,
                            value: companyId
                        }
                    });

                    this.fillSubDropDownInEdit(
                        "GetContactsByCompanyId",
                        "companyId",
                        companyId,
                        "fromContactId",
                        "fromContactName",
                        "selectedFromContact",
                        "fromContacts"
                    );
                }
                let calledByCompanyId = this.state.document.calledByCompanyId;
                if (calledByCompanyId) {
                    this.setState({
                        selectedCalledByCompany: {
                            label: this.props.document.calledByCompanyName,
                            value: calledByCompanyId
                        }
                    });
                    this.fillSubDropDownInEdit(
                        "GetContactsByCompanyId",
                        "companyId",
                        calledByCompanyId,
                        "calledByContactId",
                        "calledByContactName",
                        "selectedCalledByContact",
                        "calledContacts"
                    );
                }
                let facilitatorCompanyId = this.state.document
                    .facilitatorCompanyId;
                if (facilitatorCompanyId) {
                    this.setState({
                        selectedFacilitatorCompany: {
                            label: this.props.document.facilitatorCompanyName,
                            value: facilitatorCompanyId
                        }
                    });
                    this.fillSubDropDownInEdit(
                        "GetContactsByCompanyId",
                        "companyId",
                        facilitatorCompanyId,
                        "facilitatorContactId",
                        "facilitatorContactName",
                        "selectedFacilitatorContact",
                        "facilitatorContacts"
                    );
                }
                let noteTakerCompanyId = this.state.document.noteTakerCompanyId;
                if (noteTakerCompanyId) {
                    this.setState({
                        selectedNoteTakerCompany: {
                            label: this.props.document.noteTakerCompanyName,
                            value: noteTakerCompanyId
                        }
                    });
                    this.fillSubDropDownInEdit(
                        "GetContactsByCompanyId",
                        "companyId",
                        noteTakerCompanyId,
                        "noteTakerContactId",
                        "noteTakerContactName",
                        "selectedNoteTakerContact",
                        "noteTakerContacts"
                    );
                }
            }
            this.setState({ CompanyData: [...res], isLoading: false });
        });
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
    }

    componentDidMount() {
        if (this.state.docId > 0) {
            this.setState({ isLoading: true });
            this.props.actions
                .documentForEdit(
                    "GetCommunicationMeetingMinutesForEdit?id=" +
                    this.state.docId,
                    this.state.docTypeId,
                    "meetingMinutes"
                )
                .then(() => {
                    this.setState({
                        meetingId: this.state.docId,
                        isLoading: false
                    });
                    this.getTabelData();
                    this.checkDocumentIsView();
                });
        } else {
            this.props.actions.documentForAdding();
            this.fillDropDowns(false);
            let document = {
                projectId: projectId,
                fromCompanyId: "",
                fromContactId: "",
                calledByCompanyId: "",
                calledByContactId: "",
                facilitatorCompanyId: "",
                facilitatorContactId: "",
                noteTakerContactId: "",
                noteTakerCompanyId: "",
                docDate: moment(),
                handOuts: "",
                subject: "",
                refDoc: "",
                docCloseDate: "",
                docLocationId: "",
                requiredDate: "",
                status: true
            };
            this.setState({ document });
        }
        this.setState({ isLoading: false });
        DataService.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId").then(res => {
            this.setState({ Companies: res, isLoading: false });
        });
    }

    getTabelData() {
        let attendeesTable = [];
        this.props.actions
            .GetAttendeesTable(
                "GetCommunicationMeetingMinutesAttendees?meetingId=" +
                this.state.docId
            )
            .then(res => {
                this.props.attendees.forEach((element, index) => {
                    attendeesTable.push(
                        <tr id={"att_" + index}>
                            <td>
                                <span
                                    onClick={e =>
                                        this.deleteRowTable(element.Id, e)
                                    }>
                                    <img
                                        src={Recycle}
                                        alt="DEL"
                                        style={{ maxWidth: "20px" }}
                                    />
                                </span>
                            </td>
                            <td className="disNone">{element.Id}</td>
                            <td className="disNone">{element.companyId}</td>
                            <td>{element.companyName}</td>
                            <td>{element.contactName}</td>
                            <td className="disNone">{element.contactId}</td>
                        </tr>
                    );
                });
                this.setState({ attendees: attendeesTable });
            });
        let topicstable = [];
        this.props.actions
            .GetTopicsTable(
                "GetCommunicationMeetingMinutesTopics?meetingId=" +
                this.state.docId
            )
            .then(res => {
                let data = { items: this.props.topics };
                this.props.actions.ExportingData(data);

                this.props.topics.forEach((element, index) => {
                    topicstable.push(
                        <tr id={"top_" + index}>
                            <td>{element.description}</td>
                            <td className="disNone">
                                {element.byWhomCompanyName}
                            </td>
                            <td className="disNone">
                                {element.byWhomContactName}
                            </td>
                            <td>{element.calledByCompany}</td>
                            <td>{element.calledByContact}</td>
                            <td>{element.decision}</td>
                            <td>{element.action}</td>
                        </tr>
                    );
                });
                this.setState({ topics: topicstable });
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.document.id !== this.props.document.id && this.props.changeStatus === true) {

            this.fillDropDowns(this.props.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }
        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }

    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.document.id != state.document.id && nextProps.changeStatus === true) {
            let docDate = state.document.docDate != null ? moment(state.document.docDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");

            return {
                document: { ...nextProps.document, docDate: docDate } 
            };
        }
        return null; 
    }

    //#region  editting
    editMeeting = () => {
        this.setState({
            isLoading: true
        });

        let docDate = moment(this.state.document.docDate, "YYYY-MM-DD").format(
            "YYYY-MM-DD[T]HH:mm:ss.SSS"
        );

        let document = Object.assign(this.state.document, { docDate: docDate });

        document.docLocationId = link === "InternalMeetingMinutes" ? 0 : 1;

        Api.post("EditCommunicationMeetingMinutes", document).then(result => {
            this.setState({
                isLoading: false
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    };

    //#endregion
    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(3325) === true ? (
                <ViewAttachment
                    isApproveMode={this.state.isViewMode}
                    docTypeId={this.state.docTypeId}
                    docId={this.state.docId}
                    projectId={projectId}
                    deleteAttachments={836}
                />
            ) : null
        ) : null;
    }

    //#region    adding
    addMeeting = () => {
        this.setState({ isLoading: true });

        let documentObj = { ...this.state.document };

        documentObj.docDate = moment(documentObj.docDate, "YYYY-MM-DD").format(
            "YYYY-MM-DD[T]HH:mm:ss.SSS"
        );

        documentObj.docLocationId = link === "InternalMeetingMinutes" ? 0 : 1;

        DataService.addObject(
            "AddCommunicationMeetingMinutes",
            documentObj
        ).then(result => {
            this.setState({
                meetingId: result.id,
                docId: result.id,
                isLoading: false,
                selectedFromCompany: {
                    label: Resources.fromCompanyRequired[currentLanguage],
                    value: "0"
                },
                selectedFromContact: {
                    label: Resources.fromContactRequired[currentLanguage],
                    value: "0"
                },
                selectedCalledByCompany: {
                    label: Resources.calledByCompanyRequired[currentLanguage],
                    value: "0"
                },
                selectedCalledByContact: {
                    label: Resources.calledByContactRequired[currentLanguage],
                    value: "0"
                },
                calledContacts: [],
                btnTxt: "next"
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    };

    addAttendences = values => {
        this.setState({ isLoading: true });

        let attendence = {
            meetingId: this.state.meetingId,
            contactId: this.state.selectedAttendencesContact.value,
            companyId: this.state.selectedAttendencesCompany.value,
            companyName: this.state.selectedAttendencesCompany.label,
            contactName: this.state.selectedAttendencesContact.label
        };

        Api.post("AddCommunicationMeetingMinutesAttendees", attendence)
            .then(res => {
                if (res) {
                    toast.success(
                        Resources["operationSuccess"][currentLanguage]
                    );
                    let data = [...this.state.attendees];
                    data.push(
                        <tr>
                            <td>
                                <span
                                    onClick={e =>
                                        this.deleteRowTable(res.id, e)
                                    }>
                                    <img
                                        src={Recycle}
                                        alt="DEL"
                                        style={{ maxWidth: "20px" }}
                                    />
                                </span>
                            </td>
                            <td className="disNone">{res.id}</td>
                            <td className="disNone">
                                {this.state.selectedAttendencesCompany.value}
                            </td>
                            <td>
                                {this.state.selectedAttendencesCompany.label}
                            </td>
                            <td>
                                {this.state.selectedAttendencesContact.label}
                            </td>
                            <td className="disNone">
                                {this.state.selectedAttendencesContact.value}
                            </td>
                        </tr>
                    );
                    this.setState({
                        isLoading: false,
                        attendees: data,
                        selectedAttendencesCompany: {
                            label:
                                Resources.fromCompanyRequired[currentLanguage],
                            value: "0"
                        },
                        selectedAttendencesContact: {
                            label:
                                Resources.fromContactRequired[currentLanguage],
                            value: "0"
                        }
                    });
                } else {
                    this.setState({ isLoading: false });
                }
            })
            .catch(res => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ isLoading: false });
            });
    };

    addTopics = values => {
        this.setState({ isLoading: true });

        let topic = {
            meetingId: this.state.docId,
            requiredDate: moment(this.state.requiredDate, "YYYY-MM-DD").format(
                "YYYY-MM-DD[T]HH:mm:ss.SSS"
            ),
            itemDescription: values.description,
            action: values.action,
            arrange: values.arrange,
            status: values.status == true ? 1 : 0,
            byWhomContactId: this.state.selectedTopicContact.value,
            byWhomCompanyId: this.state.selectedTopicCompany.value,
            comment: "",
            decisions: values.decision
        };

        Api.post("AddCommunicationMeetingMinutesTopics", topic)
            .then(res => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                let data = [...this.state.topics];
                data.push(
                    <tr>
                        <td>{values.description}</td>
                        <td>{this.state.selectedTopicCompany.label}</td>
                        <td>{this.state.selectedTopicContact.label}</td>
                        <td>{values.decision}</td>
                        <td>{values.action}</td>
                    </tr>
                );
                this.setState({
                    topics: data,
                    selectedTopicCompany: {
                        label:
                            Resources.calledByCompanyRequired[currentLanguage],
                        value: "0"
                    },
                    selectedTopicContact: {
                        label:
                            Resources.calledByContactRequired[currentLanguage],
                        value: "0"
                    },
                    isLoading: false
                });
            })
            .catch(res => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ isLoading: false });
            });
    };
    //#endregion

    deleteRowTable = (id, e) => {
        e.preventDefault();
        this.setState({ attendenceId: id, showDeleteModal: true });
    };

    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    ConfirmDeleteAttendence = () => {
        this.setState({ isLoading: true });
        Api.post(
            "CommunicationMeetingMinutesAttendeesDelete?id=" +
            this.state.attendenceId
        ).then(res => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            let data = this.state.attendees.filter(
                item =>
                    item.props.children[1].props.children !==
                    this.state.attendenceId
            );
            this.setState({
                attendees: data,
                showDeleteModal: false,
                isLoading: false
            });
        });
    };

    //#region General Methods
    fillSubDropDownInEdit(
        url,
        param,
        value,
        subFieldId,
        subFieldName,
        subSelectedValue,
        subDatasource
    ) {
        let action = url + "?" + param + "=" + value;
        DataService.GetDataList(action, "contactName", "id").then(result => {
            if (this.props.changeStatus === true) {
                let _SubFieldId = this.state.document[subFieldId];
                let _SubFieldName = this.state.document[subFieldName];
                let targetFieldSelected = {
                    label: _SubFieldName,
                    value: _SubFieldId
                };
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result
                });
            }
        });
    }

    updateSelectedValue = (selected, label, value, targetSelected) => {
        if (
            label == "fromContactName" &&
            this.props.changeStatus === false &&
            this.state.CurrStep == 0
        ) {
            this.setState({ isLoading: true });
            Api.get(
                "GetNextArrangeMainDoc?projectId=" +
                this.state.projectId +
                "&docType=" +
                this.state.docTypeId +
                "&companyId=" +
                this.state.selectedFromCompany.value +
                "&contactId=" +
                this.state.selectedFromContact.value
            ).then(res => {
                this.setState({
                    document: { ...this.state.document, arrange: res },
                    isLoading: false,
                    validStep: true
                });
            });
        }
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[value] = selected.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document,
            [targetSelected]: selected
        });
    };

    handleChangeDropDowns = (
        item,
        lbl,
        val,
        selected,
        listData,
        selected_subScripe
    ) => {
        this.setState({ isLoading: true });

        DataService.GetDataList(
            "GetContactsByCompanyId?companyId=" + item.value,
            "contactName",
            "id"
        ).then(res => {
            this.setState({
                [listData]: res,
                isLoading: false,
                [selected]: item,
                [selected_subScripe]: this.state[selected_subScripe]
            });
        });

        this.updateSelectedValue(item, lbl, val);
    };

    handleChange = (key, value) => {
        this.setState({ document: { ...this.state.document, [key]: value } });
    };


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
                <button
                    className={
                        this.state.isViewMode === true
                            ? "primaryBtn-1 btn meduimBtn disNone"
                            : "primaryBtn-1 btn meduimBtn"
                    }
                    type="submit">
                    {Resources.next[currentLanguage]}
                </button>
            );
        }
        return btn;
    }
    //#endregion
    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    render() { 
        let Step_1 = (
            <React.Fragment>
                <div className="document-fields">
                    {this.state.isLoading ? <LoadingSection /> : null}
                    <Formik
                        validationSchema={validationSchema}
                        initialValues={{
                            subject: this.state.document.subject,
                            fromContact: this.state.document.fromContactName,
                            calledByContact: this.state.document
                                .calledByContactName,
                            facilitatorContact: this.state.document
                                .facilitatorContactName,
                            noteTakerContact: this.state.document
                                .noteTakerContactName
                        }}
                        enableReinitialize={true}
                        onSubmit={values => {
                            if (this.props.showModal) {
                                return;
                            }

                            if (
                                this.props.changeStatus === false &&
                                this.state.docId === 0
                            ) {
                                this.addMeeting();
                            } else {
                                if (this.props.changeStatus) this.editMeeting();
                                this.changeCurrentStep(1);
                                this.setState({
                                    selectedFromCompany: {
                                        label:
                                            Resources.fromCompanyRequired[
                                            currentLanguage
                                            ],
                                        value: "0"
                                    },
                                    selectedFromContact: {
                                        label:
                                            Resources.fromContactRequired[
                                            currentLanguage
                                            ],
                                        value: "0"
                                    },
                                    fromContacts: [],
                                    selectedCalledByCompany: {
                                        label:
                                            Resources.calledByCompanyRequired[
                                            currentLanguage
                                            ],
                                        value: "0"
                                    },
                                    selectedCalledByContact: {
                                        label:
                                            Resources.calledByContactRequired[
                                            currentLanguage
                                            ],
                                        value: "0"
                                    },
                                    calledByContact: []
                                });
                            }
                        }}>
                        {({
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            setFieldTouched,
                            setFieldValue
                        }) => (
                                <Form
                                    id="MinutesOfMeeting"
                                    className="proForm datepickerContainer"
                                    noValidate="novalidate"
                                    onSubmit={handleSubmit}>
                                    <div className="proForm first-proform fullWidth_form">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources["subject"][
                                                    currentLanguage
                                                    ]
                                                }{" "}
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.subject &&
                                                        touched.subject
                                                        ? "has-error"
                                                        : !errors.subject &&
                                                            touched.subject
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    name="subject"
                                                    defaultValue={
                                                        this.state.document.subject
                                                    }
                                                    className="form-control"
                                                    id="subject"
                                                    placeholder={
                                                        Resources["subject"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                    autoComplete="off"
                                                    onBlur={handleBlur}
                                                    onChange={e => {
                                                        handleChange(e);
                                                        this.handleChange(
                                                            "subject",
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                                {touched.subject ? (
                                                    <em className="pError">
                                                        {errors.subject}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput">
                                            <label
                                                data-toggle="tooltip"
                                                title={
                                                    Resources["status"][
                                                    currentLanguage
                                                    ]
                                                }
                                                className="control-label">
                                                {" "}
                                                {
                                                    Resources["status"][
                                                    currentLanguage
                                                    ]
                                                }{" "}
                                            </label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input
                                                    type="radio"
                                                    defaultChecked
                                                    name="status"
                                                    defaultChecked={
                                                        this.state.document
                                                            .status === false
                                                            ? null
                                                            : "checked"
                                                    }
                                                    value="true"
                                                    onChange={e =>
                                                        this.handleChange(
                                                            "status",
                                                            "true"
                                                        )
                                                    }
                                                />
                                                <label>
                                                    {
                                                        Resources["oppened"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                </label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    defaultChecked={
                                                        this.state.document
                                                            .status === false
                                                            ? "checked"
                                                            : null
                                                    }
                                                    value="false"
                                                    onChange={e =>
                                                        this.handleChange(
                                                            "status",
                                                            "false"
                                                        )
                                                    }
                                                />
                                                <label>
                                                    {" "}
                                                    {
                                                        Resources["closed"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker
                                            title="docDate"
                                            startDate={this.state.document.docDate}
                                            handleChange={e =>
                                                this.handleChange("docDate", e)
                                            }
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">
                                            {Resources["arrange"][currentLanguage]}{" "}
                                        </label>
                                        <div className={"ui input inputDev "}>
                                            <input
                                                name="arrange"
                                                className="form-control"
                                                id="arrange"
                                                placeholder={
                                                    Resources["arrange"][
                                                    currentLanguage
                                                    ]
                                                }
                                                autoComplete="off"
                                                readOnly
                                                defaultValue={
                                                    this.state.document.arrange
                                                }
                                                onChange={e =>
                                                    this.handleChange(
                                                        "arrange",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input linebylineInput__name">
                                        <label className="control-label">
                                            {Resources["handouts"][currentLanguage]}{" "}
                                        </label>
                                        <div className={"ui input inputDev "}>
                                            <input
                                                name="handouts"
                                                className="form-control"
                                                id="handouts"
                                                placeholder={
                                                    Resources["handouts"][
                                                    currentLanguage
                                                    ]
                                                }
                                                autoComplete="off"
                                                defaultValue={
                                                    this.state.document.handouts
                                                }
                                                onChange={e =>
                                                    this.handleChange(
                                                        "handOuts",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input ">
                                        <label className="control-label">
                                            {
                                                Resources["reference"][
                                                currentLanguage
                                                ]
                                            }{" "}
                                        </label>
                                        <div className={"ui input inputDev "}>
                                            <input
                                                name="refDoc"
                                                className="form-control"
                                                id="refDoc"
                                                placeholder={
                                                    Resources["reference"][
                                                    currentLanguage
                                                    ]
                                                }
                                                autoComplete="off"
                                                defaultValue={
                                                    this.state.document.refDoc
                                                }
                                                onChange={e =>
                                                    this.handleChange(
                                                        "refDoc",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input mix_dropdown">
                                        <label className="control-label">
                                            {
                                                Resources["CompanyName"][
                                                currentLanguage
                                                ]
                                            }
                                        </label>
                                        <div className="supervisor__company">
                                            <div className="super_name">
                                                <DropdownMelcous
                                                    name="fromCompany"
                                                    data={this.state.Companies}
                                                    handleChange={e =>
                                                        this.handleChangeDropDowns(
                                                            e,
                                                            "fromCompanyName",
                                                            "fromCompanyId",
                                                            "selectedFromCompany",
                                                            "fromContacts",
                                                            "selectedFromContact"
                                                        )
                                                    }
                                                    placeholder="fromCompany"
                                                    selectedValue={
                                                        this.state
                                                            .selectedFromCompany
                                                    }
                                                    styles={CompanyDropdown} classDrop="companyName1 "
                                                />
                                            </div>
                                            <div className="super_company">
                                                <DropdownMelcous
                                                    name="fromContact"
                                                    data={this.state.fromContacts}
                                                    handleChange={e =>
                                                        this.updateSelectedValue(
                                                            e,
                                                            "fromContactName",
                                                            "fromContactId",
                                                            "selectedFromContact"
                                                        )
                                                    }
                                                    placeholder="ContactName"
                                                    selectedValue={
                                                        this.state
                                                            .selectedFromContact
                                                    }
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    error={errors.fromContact}
                                                    touched={touched.fromContact}
                                                    index="fromContact"
                                                    id="fromContact"
                                                    classDrop=" contactName1" styles={ContactDropdown}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input mix_dropdown">
                                        <label className="control-label">
                                            {
                                                Resources["calledByCompany"][
                                                currentLanguage
                                                ]
                                            }
                                        </label>
                                        <div className="supervisor__company">
                                            <div className="super_name">
                                                <DropdownMelcous
                                                    name="calledCompany"
                                                    data={this.state.Companies}
                                                    handleChange={e =>
                                                        this.handleChangeDropDowns(
                                                            e,
                                                            "calledByCompanyName",
                                                            "calledByCompanyId",
                                                            "selectedCalledByCompany",
                                                            "calledContacts",
                                                            "selectedCalledByContact"
                                                        )
                                                    }
                                                    placeholder="calledByCompany"
                                                    selectedValue={
                                                        this.state
                                                            .selectedCalledByCompany
                                                    }
                                                    styles={CompanyDropdown} classDrop="companyName1 "
                                                />
                                            </div>
                                            <div className="super_company">
                                                <DropdownMelcous
                                                    name="calledByContact"
                                                    data={this.state.calledContacts}
                                                    handleChange={e =>
                                                        this.updateSelectedValue(
                                                            e,
                                                            "calledByContactName",
                                                            "calledByContactId",
                                                            "selectedCalledByContact"
                                                        )
                                                    }
                                                    placeholder="calledByContact"
                                                    selectedValue={
                                                        this.state
                                                            .selectedCalledByContact
                                                    }
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    error={errors.calledByContact}
                                                    touched={
                                                        touched.calledByContact
                                                    }
                                                    classDrop=" contactName1" styles={ContactDropdown}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input mix_dropdown">
                                        <label className="control-label">
                                            {
                                                Resources["facilitatorContact"][
                                                currentLanguage
                                                ]
                                            }
                                        </label>
                                        <div className="supervisor__company">
                                            <div className="super_name">
                                                <DropdownMelcous
                                                    name="facilitatorCompany"
                                                    data={this.state.Companies}
                                                    handleChange={e =>
                                                        this.handleChangeDropDowns(
                                                            e,
                                                            "facilitatorCompanyName",
                                                            "facilitatorCompanyId",
                                                            "selectedFacilitatorCompany",
                                                            "facilitatorContacts",
                                                            "selectedFacilitatorContact"
                                                        )
                                                    }
                                                    placeholder="facilitatorCompany"
                                                    selectedValue={
                                                        this.state
                                                            .selectedFacilitatorCompany
                                                    }
                                                    styles={CompanyDropdown} classDrop="companyName1 "
                                                />
                                            </div>
                                            <div className="super_company">
                                                <DropdownMelcous
                                                    name="facilitatorContact"
                                                    data={
                                                        this.state
                                                            .facilitatorContacts
                                                    }
                                                    handleChange={e =>
                                                        this.updateSelectedValue(
                                                            e,
                                                            "facilitatorContactName",
                                                            "facilitatorContactId",
                                                            "selectedFacilitatorContact"
                                                        )
                                                    }
                                                    placeholder="facilitatorContact"
                                                    selectedValue={
                                                        this.state
                                                            .selectedFacilitatorContact
                                                    }
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    error={
                                                        errors.facilitatorContact
                                                    }
                                                    touched={
                                                        touched.facilitatorContact
                                                    }
                                                    classDrop=" contactName1" styles={ContactDropdown}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input mix_dropdown">
                                        <label className="control-label">
                                            {
                                                Resources["noteTakerCompany"][
                                                currentLanguage
                                                ]
                                            }
                                        </label>
                                        <div className="supervisor__company">
                                            <div className="super_name">
                                                <DropdownMelcous
                                                    name="noteTakerCompany"
                                                    data={this.state.Companies}
                                                    handleChange={e =>
                                                        this.handleChangeDropDowns(
                                                            e,
                                                            "noteTakerCompanyName",
                                                            "noteTakerCompanyId",
                                                            "selectedNoteTakerCompany",
                                                            "noteTakerContacts",
                                                            "selectedNoteTakerContact"
                                                        )
                                                    }
                                                    placeholder="noteTakerCompany"
                                                    selectedValue={
                                                        this.state
                                                            .selectedNoteTakerCompany
                                                    }
                                                    styles={CompanyDropdown} classDrop="companyName1 "
                                                />
                                            </div>
                                            <div className="super_company">
                                                <DropdownMelcous
                                                    name="noteTakerContact"
                                                    data={
                                                        this.state.noteTakerContacts
                                                    }
                                                    handleChange={e =>
                                                        this.updateSelectedValue(
                                                            e,
                                                            "noteTakerContactName",
                                                            "noteTakerContactId",
                                                            "selectedNoteTakerContact"
                                                        )
                                                    }
                                                    placeholder="noteTakerContact"
                                                    selectedValue={
                                                        this.state
                                                            .selectedNoteTakerContact
                                                    }
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    error={errors.noteTakerContact}
                                                    touched={
                                                        touched.noteTakerContact
                                                    }
                                                    classDrop=" contactName1" styles={ContactDropdown}
                                                />
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

                <div className="doc-pre-cycle">
                    <div>
                        {this.state.docId > 0 &&
                            this.state.isViewMode === false ? (
                                <UploadAttachment
                                    changeStatus={this.props.changeStatus}
                                    AddAttachments={835}
                                    EditAttachments={3231}
                                    ShowDropBox={3623}
                                    ShowGoogleDrive={3624}
                                    docTypeId={this.state.docTypeId}
                                    docId={this.state.docId}
                                    projectId={this.state.projectId}
                                />
                            ) : null}
                        {this.viewAttachments()}
                        {this.props.changeStatus === true ? (
                            <ViewWorkFlow
                                docType={this.state.docTypeId}
                                docId={this.state.docId}
                                projectId={this.state.projectId}
                            />
                        ) : null}
                    </div>
                </div>
            </React.Fragment>
        );
        let Step_2 = (
            <React.Fragment>
                <div className="document-fields">
                    {this.state.isLoading ? <LoadingSection /> : null}
                    <Formik
                        initialValues={{
                            attendeesContact: ""
                        }}
                        validationSchema={attendeesValidationSchema}
                        onSubmit={values => {
                            this.addAttendences(values);
                        }}>
                        {({
                            errors,
                            touched,
                            setFieldTouched,
                            setFieldValue
                        }) => (
                                <Form
                                    id="signupForm1"
                                    className="proForm customProform"
                                    noValidate="novalidate">
                                    <div className="proForm customProform">
                                        <br />
                                        <div className="linebylineInput valid-input mix_dropdown">
                                            <label className="control-label">
                                                {
                                                    Resources["CompanyName"][
                                                    currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div className="supervisor__company">
                                                <div className="super_name">
                                                    <DropdownMelcous
                                                        name="fromCompany"
                                                        data={this.state.Companies}
                                                        handleChange={e =>
                                                            this.handleChangeDropDowns(
                                                                e,
                                                                "fromCompanyName",
                                                                "fromCompanyId",
                                                                "selectedAttendencesCompany",
                                                                "attendencesContacts",
                                                                "selectedAttendencesContact"
                                                            )
                                                        }
                                                        placeholder="fromCompany"
                                                        selectedValue={
                                                            this.state
                                                                .selectedAttendencesCompany
                                                        }
                                                        styles={CompanyDropdown} classDrop="companyName1 "
                                                    />
                                                </div>
                                                <div className="super_company">
                                                    <DropdownMelcous
                                                        name="attendeesContact"
                                                        data={
                                                            this.state
                                                                .attendencesContacts
                                                        }
                                                        handleChange={e =>
                                                            this.setState({
                                                                selectedAttendencesContact: e
                                                            })
                                                        }
                                                        placeholder="ContactName"
                                                        selectedValue={
                                                            this.state
                                                                .selectedAttendencesContact
                                                        }
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={
                                                            errors.attendeesContact
                                                        }
                                                        touched={
                                                            touched.attendeesContact
                                                        }
                                                        id="attendeesContact"
                                                        classDrop=" contactName1" styles={ContactDropdown}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slider-Btns">
                                            <button
                                                className="primaryBtn-1 btn"
                                                type="submit">
                                                {Resources["add"][currentLanguage]}
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                    </Formik>
                </div>
                <div className="doc-pre-cycle">
                    <header>
                        <h3 className="zero">
                            {Resources["contactList"][currentLanguage]}
                        </h3>
                    </header>
                    <div className="precycle-grid">
                        <table className="ui table">
                            <thead>
                                <tr>
                                    <th />
                                    <th className="disNone">id</th>
                                    <th className="disNone">
                                        {Resources["company"][currentLanguage]}
                                    </th>
                                    <th>
                                        {Resources["company"][currentLanguage]}
                                    </th>
                                    <th>
                                        {Resources["contact"][currentLanguage]}
                                    </th>
                                    <th className="disNone">
                                        {Resources["contact"][currentLanguage]}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>{this.state.attendees}</tbody>
                        </table>
                    </div>
                    <div className="slider-Btns">
                        <button
                            className={"primaryBtn-1 btn meduimBtn  "}
                            onClick={() => this.changeCurrentStep(2)}
                            type="button">
                            {Resources.next[currentLanguage]}
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
        let Step_3 = (
            <React.Fragment>
                <div className="document-fields">
                    {this.state.isLoading ? <LoadingSection /> : null}
                    <Formik
                        initialValues={{
                            description: "",
                            requiredDate: this.state.requiredDate,
                            topicContact: "",
                            topicArrange: 1
                        }}
                        validationSchema={topicsValidationSchema}
                        onSubmit={values => {
                            this.addTopics(values);
                        }}>
                        {({
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            setFieldTouched,
                            setFieldValue,
                            values
                        }) => (
                                <Form
                                    id=" MinutesOfMeeting"
                                    className="proForm datepickerContainer"
                                    noValidate="novalidate"
                                    onSubmit={handleSubmit}>
                                    <div className="proForm first-proform fullWidth_form">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">
                                                {
                                                    Resources["description"][
                                                    currentLanguage
                                                    ]
                                                }{" "}
                                            </label>
                                            <div
                                                className={
                                                    "inputDev ui input " +
                                                    (errors.description
                                                        ? "has-error"
                                                        : !errors.description &&
                                                            touched.description
                                                            ? " has-success"
                                                            : " ")
                                                }>
                                                <input
                                                    name="description"
                                                    className="form-control"
                                                    id="description"
                                                    placeholder={
                                                        Resources["description"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                    autoComplete="off"
                                                    onBlur={handleBlur}
                                                    defaultValue={
                                                        values.description
                                                    }
                                                    onChange={handleChange}
                                                />
                                                {errors.description ? (
                                                    <em className="pError">
                                                        {errors.description}
                                                    </em>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="linebylineInput">
                                            <label
                                                data-toggle="tooltip"
                                                title={
                                                    Resources["status"][
                                                    currentLanguage
                                                    ]
                                                }
                                                className="control-label">
                                                {" "}
                                                {
                                                    Resources["status"][
                                                    currentLanguage
                                                    ]
                                                }{" "}
                                            </label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    checked
                                                    value="true"
                                                    onChange={handleChange}
                                                />
                                                <label>
                                                    {
                                                        Resources["oppened"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                </label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="false"
                                                    onChange={handleChange}
                                                />
                                                <label>
                                                    {" "}
                                                    {
                                                        Resources["closed"][
                                                        currentLanguage
                                                        ]
                                                    }
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input alternativeDate">
                                        <DatePicker
                                            name="requiredDate"
                                            title="requiredDate"
                                            startDate={this.state.requiredDate}
                                            handleChange={e => {
                                                handleChange(e);
                                                this.setState({ requiredDate: e });
                                            }}
                                        />
                                    </div>
                                    <div className="linebylineInput valid-input">
                                        <label className="control-label">
                                            {Resources["arrange"][currentLanguage]}{" "}
                                        </label>
                                        <div className={"ui input inputDev "}>
                                            <input
                                                name="arrange"
                                                className="form-control"
                                                id="arrange"
                                                placeholder={
                                                    Resources["arrange"][
                                                    currentLanguage
                                                    ]
                                                }
                                                value="1"
                                                   
                                                
                                                autoComplete="off"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input mix_dropdown">
                                        <label className="control-label">
                                            {
                                                Resources["calledByCompany"][
                                                currentLanguage
                                                ]
                                            }
                                        </label>
                                        <div className="supervisor__company">
                                            <div className="super_name">
                                                <DropdownMelcous
                                                    name="topicCompany"
                                                    data={this.state.Companies}
                                                    handleChange={e =>
                                                        this.handleChangeDropDowns(
                                                            e,
                                                            "calledByCompanyName",
                                                            "calledByCompanyId",
                                                            "selectedTopicCompany",
                                                            "topicsContacts",
                                                            "selectedTopicContact"
                                                        )
                                                    }
                                                    placeholder="topicCompany"
                                                    selectedValue={
                                                        this.state
                                                            .selectedTopicCompany
                                                    }
                                                    styles={CompanyDropdown} classDrop="companyName1 "
                                                />
                                            </div>
                                            <div className="super_company">
                                                <DropdownMelcous
                                                    name="topicContact"
                                                    data={this.state.topicsContacts}
                                                    handleChange={e =>
                                                        this.setState({
                                                            selectedTopicContact: e
                                                        })
                                                    }
                                                    placeholder="topicContact"
                                                    selectedValue={
                                                        this.state
                                                            .selectedTopicContact
                                                    }
                                                    onChange={setFieldValue}
                                                    onBlur={setFieldTouched}
                                                    error={errors.topicContact}
                                                    touched={touched.topicContact}
                                                    classDrop=" contactName1" styles={ContactDropdown}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input linebylineInput__name">
                                        <label className="control-label">
                                            {Resources["decision"][currentLanguage]}{" "}
                                        </label>
                                        <div className={"ui input inputDev "}>
                                            <input
                                                name="decision"
                                                onChange={handleChange}
                                                className="form-control"
                                                id="decision"
                                                placeholder={
                                                    Resources["decision"][
                                                    currentLanguage
                                                    ]
                                                }
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="linebylineInput valid-input ">
                                        <label className="control-label">
                                            {Resources["action"][currentLanguage]}{" "}
                                        </label>
                                        <div className={"ui input inputDev "}>
                                            <input
                                                name="action"
                                                className="form-control"
                                                id="action"
                                                placeholder={
                                                    Resources["action"][
                                                    currentLanguage
                                                    ]
                                                }
                                                autoComplete="off"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="slider-Btns fullWidthWrapper textLeft">
                                        <button
                                            className={"primaryBtn-1 btn"}
                                            type="submit">
                                            {Resources["add"][currentLanguage]}
                                        </button>
                                    </div>
                                </Form>
                            )}
                    </Formik>
                </div>
                <div className="doc-pre-cycle">
                    <header>
                        <h3 className="zero">
                            {Resources["contactList"][currentLanguage]}
                        </h3>
                    </header>
                    <div className="precycle-grid">
                        <table className="ui table">
                            <thead>
                                <tr>
                                    <th>
                                        {
                                            Resources["description"][
                                            currentLanguage
                                            ]
                                        }
                                    </th>
                                    <th className="disNone">
                                        {
                                            Resources["calledByCompany"][
                                            currentLanguage
                                            ]
                                        }
                                    </th>
                                    <th className="disNone">
                                        {
                                            Resources["calledByContact"][
                                            currentLanguage
                                            ]
                                        }
                                    </th>
                                    <th>
                                        {
                                            Resources["calledByCompany"][
                                            currentLanguage
                                            ]
                                        }
                                    </th>
                                    <th>
                                        {
                                            Resources["calledByContact"][
                                            currentLanguage
                                            ]
                                        }
                                    </th>
                                    <th>
                                        {
                                            Resources["decisions"][
                                            currentLanguage
                                            ]
                                        }
                                    </th>
                                    <th>
                                        {Resources["action"][currentLanguage]}
                                    </th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>{this.state.topics}</tbody>
                        </table>
                    </div>
                    <div className="slider-Btns">
                        <button
                            className={"primaryBtn-1 btn meduimBtn  "}
                            onClick={() => this.changeCurrentStep(3)}
                            type="button">
                            {Resources.next[currentLanguage]}
                        </button>
                    </div>
                </div>
            </React.Fragment>
        );
        return (
            <React.Fragment>
                <div className="mainContainer">
                    <div
                        className={
                            this.state.isViewMode === true
                                ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs"
                                : "documents-stepper one__tab one_step noTabs__document"
                        }>
                        <HeaderDocument
                            projectName={projectName}
                            isViewMode={this.state.isViewMode}
                            perviousRoute={this.state.perviousRoute}
                            docTitle={
                                Resources.meetingMinutesLog[currentLanguage]
                            }
                            moduleTitle={
                                Resources["communication"][currentLanguage]
                            }
                        />

                        <div className="doc-container">
                            <div className="step-content">
                                <Fragment>
                                    {this.state.CurrStep == 0
                                        ? Step_1
                                        : this.state.CurrStep == 1
                                            ? Step_2
                                            : Step_3}
                                    {this.props.changeStatus === true ? (
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
                                                    documentName={Resources.meetingMinutesLog[currentLanguage]}
                                                />
                                            </div>
                                        </div>
                                    ) : null}
                                </Fragment>
                            </div>
                            <div>
                                <Steps
                                    steps_defination={steps_defination}
                                    exist_link={
                                        link === "InternalMeetingMinutes"
                                            ? "/InternalMeetingMinutes/"
                                            : "/CommunicationMeetingMinutesExternal/"
                                    }
                                    docId={this.state.docId}
                                    changeCurrentStep={stepNo =>
                                        this.changeCurrentStep(stepNo)
                                    }
                                    stepNo={this.state.CurrStep} changeStatus={docId === 0 ? false : true}
                                />
                            </div>
                        </div>
                    </div>
                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={
                                Resources["smartDeleteMessage"][currentLanguage]
                                    .content
                            }
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName="delete"
                            clickHandlerContinue={this.ConfirmDeleteAttendence}
                        />
                    ) : null}
                </div>
            </React.Fragment>
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
        attendees: state.communication.attendees,
        topics: state.communication.topics,
        showModal: state.communication.showModal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(MeetingMinutesAddEdit));

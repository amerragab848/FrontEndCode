import React, { Component, Fragment } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Config from "../../Services/Config.js";
import moment from "moment";
import * as communicationActions from '../../store/actions/communication';
import TextEditor from '../../Componants/OptionsPanels/TextEditor';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import { toast } from "react-toastify";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions'
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'
import AddDocAttachment from "../../Componants/publicComponants/AddDocAttachment";

import find from "lodash/find";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    refDoc: Yup.string().max(450, Resources['maxLength'][currentLanguage]),
    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true),
    toContactId: Yup.string().required(Resources['toContactRequired'][currentLanguage]).nullable(true)
})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = false;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;

class RfiAddEdit extends Component {

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
        this.state = {
            isLoading: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 23,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            ToContacts: [],
            fromContacts: [],
            discplines: [],
            areas: [],
            locations: [],
            permission: [{ name: 'sendByEmail', code: 81 },
            { name: 'sendByInbox', code: 80 },
            { name: 'sendTask', code: 1 },
            { name: 'distributionList', code: 963 },
            { name: 'createTransmittal', code: 3049 },
            { name: 'sendToWorkFlow', code: 713 },
            { name: 'viewAttachments', code: 3318 },
            { name: 'deleteAttachments', code: 828 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
            selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            selectedArea: { label: Resources.area[currentLanguage], value: "0" },
            selectedLocation: { label: Resources.location[currentLanguage], value: "0" },
            message: '',
            replyMessage: ''
        }

        if (!Config.IsAllow(75) && !Config.IsAllow(76) && !Config.IsAllow(78)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }

    }

    componentDidMount() {

        if (this.state.docId > 0) {
            let url = "GetCommunicationRfiForEdit?id=" + this.state.docId;
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'communicationRFI');

        } else {
            const rfiDocument = {
                projectId: projectId,
                fromCompanyId: null,
                toCompanyId: null,
                fromContactId: null,
                toContactId: null,
                subject: "",
                requiredDate: moment(),
                rfi: "",
                answer: "",
                docDate: moment(),
                arrange: "1",
                status: "true",
                contractId: null,
                pcoId: null,
                refDoc: "",
                docLocationId: "true",
                cycleNo: 0,
                parentId: null,
                disciplineId: null,
                area: "",
                location: "",
                building: "",
                apartment: "",
                sharedSettings: "",
                id: 0
            };

            this.setState({ document: rfiDocument });
            this.fillDropDowns(false);
        }

        this.props.actions.documentForAdding();

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

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.document.id != state.document.id && nextProps.changeStatus === true) {

            nextProps.document.docDate = nextProps.document.docDate != null ? moment(nextProps.document.docDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
            nextProps.document.requiredDate = nextProps.document.requiredDate != null ? moment(nextProps.document.requiredDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');

            return {
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow,
                message: nextProps.document.rfi,
                replyMessage: nextProps.document.answer,
            };
        }

        return null
    };

    componentDidUpdate(prevProps, prevState) {

        if (prevState.document.id !== this.props.document.id && this.props.changeStatus === true) {

            this.fillDropDowns(this.props.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }

        if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus) {
            this.checkDocumentIsView();
        }
    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(76))) {
                this.setState({ isViewMode: true });
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (this.state.isApproveMode != true && Config.IsAllow(76)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(76)) {
                        if (this.props.document.status == true && Config.IsAllow(76)) {
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
        //from Companies
        dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, "companyName", "companyId", 'companies', this.state.projectId, "projectId").then(result => {
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

        //discplines
        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=discipline", "title", "id", 'defaultLists', "discipline", "listType").then(result => {
            if (isEdit) {
                let disciplineId = this.props.document.disciplineId;
                if (disciplineId) {
                    let discipline = result.find(i => i.value === disciplineId);
                    if (discipline) {
                        this.setState({
                            selectedDiscpline: { label: discipline.label, value: disciplineId }
                        });
                    }
                }
            }
            this.setState({
                discplines: [...result]
            });
        });

        //area       
        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=area", "title", "id", 'defaultLists', "area", "listType").then(result => {

            if (isEdit) {
                let areaId = this.props.document.area;
                if (areaId) {
                    let area = result.find(i => i.value === areaId);
                    if (area) {
                        this.setState({
                            selectedArea: { label: area.label, value: areaId }
                        });
                    }
                }
            }
            this.setState({
                areas: [...result]
            });
        });

        //location
        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=location", "title", "id", 'defaultLists', "location", "listType").then(result => {
            if (isEdit) {

                let locationId = this.props.document.location;

                if (locationId) {
                    let location = result.find(i => i.value === locationId);
                    if (location) {
                        this.setState({
                            selectedLocation: { label: location.label, value: locationId }
                        });
                    }
                }
            }
            this.setState({
                locations: [...result]
            });
        });
    }

    onChangeMessageRfi = (value) => {
        if (value != null) {
            this.setState({ message: value })
            let original_document = { ...this.state.document };
            let updated_document = {};
            updated_document['rfi'] = value;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({
                document: updated_document
            });
        }
    };

    onChangeMessageAnswer = (value) => {
        if (value != null) {
            this.setState({ replyMessage: value })
            let original_document = { ...this.state.document };
            let updated_document = {};
            updated_document['answer'] = value;
            updated_document = Object.assign(original_document, updated_document);
            this.setState({
                document: updated_document
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

    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
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

        if (field == "toContactId") {
            let url = "GetRefCodeArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&fromCompanyId=" + this.state.document.fromCompanyId + "&fromContactId=" + this.state.document.fromContactId + "&toCompanyId=" + this.state.document.toCompanyId + "&toContactId=" + event.value;

            dataservice.GetRefCodeArrangeMainDoc(url).then(res => {
                updated_document.arrange = res.arrange;
                if (Config.getPublicConfiguartion().refAutomatic === true) {
                    updated_document.refDoc = res.refCode;
                }

                updated_document = Object.assign(original_document, updated_document);

                this.setState({
                    document: updated_document
                });
            });
        }
        if (isSubscrib) {
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'contactName', 'id').then(result => {
                this.setState({
                    [targetState]: result
                });
            });
        }
    }

    editRfi(event) {
        this.setState({
            isLoading: true
        });

        let saveDocument = this.state.document;

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('EditCommunicationRfi', saveDocument).then(result => {
            this.setState({
                isLoading: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
            if (this.state.isApproveMode === false) {
                this.props.history.push(
                    this.state.perviousRoute
                );
            }
        }).catch(ex => {
            this.setState({
                isLoading: false
            });
            toast.error(Resources["failError"][currentLanguage])
        });
    }

    saveRfi(event) {
        this.setState({
            isLoading: true
        });
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.area = this.state.selectedArea.label;
        saveDocument.location = this.state.selectedLocation.label;
        dataservice.addObject('AddCommunicationRfi', saveDocument).then(result => {
            this.setState({
                docId: result.id,
                isLoading: false
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            this.setState({
                isLoading: false
            });
            toast.error(Resources["failError"][currentLanguage])
        });
    }

    saveAndExit(event) {
        this.props.history.push("/Rfi/" + this.state.projectId);
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.docId > 0 && this.props.changeStatus === false) {
            btn = <button className="primaryBtn-1 btn mediumBtn" type="submit" >{Resources.saveAndExit[currentLanguage]}</button>
        }
        return btn;
    }

    viewAttachments() {
        return (this.state.docId > 0 ? (Config.IsAllow(3318) === true ? <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={828} /> : null) : null);
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    render() {
        return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute} docTitle={Resources.communicationRFI[currentLanguage]} moduleTitle={Resources['communication'][currentLanguage]} />
                    <div className="doc-container">

                        <div className="step-content">
                            <div id="step1" className="step-content-body">
                                <div className="subiTabsContent">
                                    <div className="document-fields">
                                        <Formik initialValues={{ ...this.state.document }}
                                            validationSchema={validationSchema}
                                            enableReinitialize={true}
                                            onSubmit={(values) => {
                                                if (this.props.showModal) { return; }

                                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                                    this.editRfi();
                                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                    this.saveRfi();
                                                } else {
                                                    this.saveAndExit();
                                                }
                                            }}>
                                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form id="rfiForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                    <div className="proForm first-proform">
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                                <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                                    placeholder={Resources.subject[currentLanguage]}
                                                                    autoComplete='off' value={this.state.document.subject || ''}
                                                                    onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                                    onChange={(e) => this.handleChange(e, 'subject')} />
                                                                {errors.subject && touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.status[currentLanguage]}</label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="status" defaultChecked={this.state.document.status === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'status')} />
                                                                <label>{Resources.oppened[currentLanguage]}</label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input type="radio" name="status" defaultChecked={this.state.document.status === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'status')} />
                                                                <label>{Resources.closed[currentLanguage]}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="proForm datepickerContainer">
                                                        <div className="linebylineInput valid-input">
                                                            <div className="inputDev ui input input-group date NormalInputDate">
                                                                <div className="customDatepicker fillter-status fillter-item-c ">
                                                                    <div className="proForm datepickerContainer">
                                                                        <div className="linebylineInput valid-input alternativeDate">
                                                                            <DatePicker title='docDate'
                                                                                startDate={this.state.document.docDate}
                                                                                handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <div className="inputDev ui input input-group date NormalInputDate">
                                                                <div className="customDatepicker fillter-status fillter-item-c ">
                                                                    <div className="proForm datepickerContainer">
                                                                        <div className="linebylineInput valid-input alternativeDate">
                                                                            <DatePicker title='requiredDate'
                                                                                startDate={this.state.document.requiredDate}
                                                                                handleChange={e => this.handleChangeDate(e, 'requiredDate')} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
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
                                                        <div className="linebylineInput fullInputWidth">
                                                            <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                                            <div className={"ui input inputDev" + (errors.refDoc && touched.refDoc ? (" has-error") : "ui input inputDev")} >
                                                                <input type="text" className="form-control" id="refDoc"
                                                                    value={this.state.document.refDoc || ''}
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
                                                                        handleChange={event => {
                                                                            this.handleChangeDropDown(event, "fromCompanyId", true, "fromContacts", "GetContactsByCompanyId", "companyId", "selectedFromCompany", "selectedFromContact");
                                                                        }} onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.fromCompanyId}
                                                                        touched={touched.fromCompanyId}
                                                                        name="fromCompanyId"
                                                                        id="fromCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown isMulti={false} data={this.state.fromContacts}
                                                                        selectedValue={this.state.selectedFromContact}
                                                                        handleChange={event =>
                                                                            this.handleChangeDropDown(event, "fromContactId", false, "", "", "", "selectedFromContact")}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.fromContactId}
                                                                        touched={touched.fromContactId}
                                                                        name="fromContactId"
                                                                        id="fromContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input mix_dropdown">
                                                            <label className="control-label">{Resources.toCompany[currentLanguage]}</label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown isMulti={false} data={this.state.companies}
                                                                        selectedValue={this.state.selectedToCompany}
                                                                        handleChange={event => this.handleChangeDropDown(event, "toCompanyId", true, "ToContacts", "GetContactsByCompanyId", "companyId", "selectedToCompany", "selectedToContact")}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.toCompanyId}
                                                                        touched={touched.toCompanyId}
                                                                        name="toCompanyId"
                                                                        id="toCompanyId" styles={CompanyDropdown} classDrop="companyName1 " />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown isMulti={false} data={this.state.ToContacts}
                                                                        selectedValue={this.state.selectedToContact}
                                                                        handleChange={event =>
                                                                            this.handleChangeDropDown(event, "toContactId", false, "", "", "", "selectedToContact")
                                                                        } onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.toContactId}
                                                                        touched={touched.toContactId}
                                                                        name="toContactId"
                                                                        id="toContactId" classDrop=" contactName1" styles={ContactDropdown} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown title="area" data={this.state.areas}
                                                                selectedValue={this.state.selectedArea}
                                                                handleChange={event => this.handleChangeDropDown(event, 'area', false, '', '', '', 'selectedArea')} />
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown title="location" data={this.state.locations}
                                                                selectedValue={this.state.selectedLocation}
                                                                handleChange={event => this.handleChangeDropDown(event, 'location', false, '', '', '', 'selectedLocation')} />
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.Building[currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors.Building && touched.Building ? (" has-error") : !errors.Building && touched.Building ? (" has-success") : " ")} >
                                                                <input name='Building' className="form-control fsadfsadsa" id="Building"
                                                                    placeholder={Resources.Building[currentLanguage]}
                                                                    autoComplete='off' value={this.state.document.building || ''}
                                                                    onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                                    onChange={(e) => this.handleChange(e, 'building')} />
                                                                {errors.Building && touched.Building ? (<em className="pError">{errors.Building}</em>) : null}
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.apartmentNumber[currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors.apartmentNumber && touched.apartmentNumber ? (" has-error") : !errors.apartmentNumber && touched.apartmentNumber ? (" has-success") : " ")} >
                                                                <input name='apartmentNumber' className="form-control fsadfsadsa" id="apartmentNumber"
                                                                    placeholder={Resources.apartmentNumber[currentLanguage]}
                                                                    autoComplete='off' value={this.state.document.apartment || ''}
                                                                    onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                                    onChange={(e) => this.handleChange(e, 'apartment')} />
                                                                {errors.apartmentNumber && touched.apartmentNumber ? (<em className="pError">{errors.apartmentNumber}</em>) : null}
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown title="discipline" data={this.state.discplines}
                                                                selectedValue={this.state.selectedDiscpline}
                                                                handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedDiscpline')} />
                                                        </div>
                                                        <div className="linebylineInput fullInputWidth">
                                                            <label className="control-label">{Resources.sharedSettings[currentLanguage]}</label>
                                                            <div className="shareLinks">
                                                                <div className="inputDev ui input">
                                                                    <input type="text" className="form-control" id="sharedSettings"
                                                                        onChange={(e) => this.handleChange(e, 'sharedSettings')}
                                                                        value={this.state.document.sharedSettings || ''} name="sharedSettings"
                                                                        placeholder={Resources.sharedSettings[currentLanguage]} />
                                                                </div>
                                                                {this.state.document.sharedSettings === '' || this.state.document.sharedSettings === null || this.state.document.sharedSettings === undefined ? null :
                                                                    <a target="_blank" href={this.state.document.sharedSettings}><span>{Resources.openFolder[currentLanguage]}</span></a>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.message[currentLanguage]}</label>
                                                            <div className="inputDev ui input">
                                                                <TextEditor
                                                                    value={this.state.message || ''}
                                                                    onChange={this.onChangeMessageRfi} />
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.replyMessage[currentLanguage]}</label>
                                                            <div className="inputDev ui input">
                                                                <TextEditor
                                                                    value={this.state.replyMessage || ''}
                                                                    onChange={this.onChangeMessageAnswer} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="slider-Btns">
                                                        {
                                                            this.props.changeStatus === false ?
                                                                this.state.isLoading === false ? this.showBtnsSaving() :
                                                                    (<button className="primaryBtn-1 btn disabled">
                                                                        <div className="spinner">
                                                                            <div className="bounce1" />
                                                                            <div className="bounce2" />
                                                                            <div className="bounce3" />
                                                                        </div>
                                                                    </button>) : null}
                                                    </div>
                                                    {
                                                        this.props.changeStatus === true ?
                                                            <div className="approveDocument">
                                                                <div className="approveDocumentBTNS">
                                                                    {this.state.isLoading ?
                                                                        <button className="primaryBtn-1 btn disabled">
                                                                            <div className="spinner">
                                                                                <div className="bounce1" />
                                                                                <div className="bounce2" />
                                                                                <div className="bounce3" />
                                                                            </div>
                                                                        </button> :
                                                                        <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} type="submit">{Resources.save[currentLanguage]}</button>
                                                                    }
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
                                                                        documentName={Resources.communicationRFI[currentLanguage]}
                                                                    />
                                                                </div>
                                                            </div> : null
                                                    }
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId > 0 && this.state.isViewMode === false ?
                                                (<UploadAttachment changeStatus={this.props.changeStatus}
                                                    AddAttachments={827} EditAttachments={3224}
                                                    ShowDropBox={3609} ShowGoogleDrive={3610}
                                                    docTypeId={this.state.docTypeId}
                                                    docId={this.state.docId}
                                                    projectId={this.state.projectId} />)
                                                : null
                                            }

                                            {this.state.docId > 0 ? (
                                                <div className="document-fields tableBTnabs">
                                                    <AddDocAttachment projectId={projectId} isViewMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} />
                                                </div>

                                            ) : null
                                            }
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true ? <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RfiAddEdit))
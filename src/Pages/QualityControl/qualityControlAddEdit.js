import React, { Component, Fragment } from "react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import Api from '../../api';
import { withRouter } from "react-router-dom";
import AddDocAttachment from "../../Componants/publicComponants/AddDocAttachment";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import { toast } from "react-toastify";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown'
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

let docId = 0;
let projectId = 0;
let projectName = "";
let isApproveMode = false;
let docApprovalId = 0;
let perviousRoute = '';
let arrange = 0;
const find = require('lodash/find')

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    contractPoId: Yup.string().required(Resources['contractPoSelection'][currentLanguage]).nullable(),
    disciplineId: Yup.string().required(Resources['disciplineRequired'][currentLanguage]).nullable(),
    areaId: Yup.string().required(Resources['areaRequired'][currentLanguage]).nullable(),
    fileNumberId: Yup.string().required(Resources['selectFileNumber'][currentLanguage]).nullable(),
    specsSectionId: Yup.string().required(Resources['specsSectionSelection'][currentLanguage]).nullable(),
    bicCompanyId: Yup.string().required(Resources['fromCompanyRequired'][currentLanguage]).nullable(),
    bicContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(),
    reasonForIssueId: Yup.string().required(Resources['SelectReasonForIssueId'][currentLanguage]).nullable()
})

class QualityControlAddEdit extends Component {

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
            }
            index++;
        }

        this.state = {
            isLoading: true,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 63,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            fromContacts: [],
            approvalstatusList: [],
            discplines: [],
            letters: [],
            permission: [{ name: 'sendByEmail', code: 923 }, { name: 'sendByInbox', code: 922 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 970 },
            { name: 'createTransmittal', code: 3056 }, { name: 'sendToWorkFlow', code: 926 },
            { name: 'viewAttachments', code: 3308 }, { name: 'deleteAttachments', code: 927 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            selectedDiscpline: { label: Resources.disciplineRequired[currentLanguage], value: "0" },
            selectedContract: { label: Resources.contractPoSelection[currentLanguage], value: "0" },
            selectedSpecsSectionId: { label: Resources.specsSectionSelection[currentLanguage], value: "0" },
            selectedLastRevNumber: { label: Resources.selectResult[currentLanguage], value: "0" },
            selectedInspectionRequestId: { label: Resources.inspectionRequest[currentLanguage], value: "0" },
            selectedFileNumberId: { label: Resources.selectFileNumber[currentLanguage], value: "0" },
            selectedReasonForIssue: { label: Resources.SelectReasonForIssueId[currentLanguage], value: "0" },
            selecetedArea: { label: Resources.selectArea[currentLanguage], value: "0" },
            selectedApartmentNoId: { label: Resources.apartmentNumberSelection[currentLanguage], value: "0" },
            contractsPos: [],
            reasonForIssues: [],
            areas: [],
            answer: '',
            rfi: '',
            specificationSectionList: [],
            lastRevNumberList: [],
            fileNumberList: [],
            apartmentNumbersList: [],
            GetMaxArrange: 1,
            IsEditMode: false,
            NCRCycle: [],
            NCRCycleDocDate: moment(),
            Status: true,
            IsAddModel: false,
            qualityControlItemsList: []
        }

        if (!Config.IsAllow(917) && !Config.IsAllow(918) && !Config.IsAllow(920)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push(
                this.state.perviousRoute
            );
        }

    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(918))) {
                this.setState({ isViewMode: true });
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (this.state.isApproveMode != true && Config.IsAllow(918)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(918)) {
                        if (this.props.document.status !== false && Config.IsAllow(918)) {
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            let qualityControlDoc = nextProps.document
            qualityControlDoc.docDate = qualityControlDoc.docDate === null ? moment().format('YYYY-MM-DD') : moment(qualityControlDoc.docDate).format('YYYY-MM-DD')
            this.setState({
                document: qualityControlDoc,
                hasWorkflow: nextProps.hasWorkflow
            });
            this.FillDropDowns();
            this.checkDocumentIsView();
        }
    }

    componentWillMount() {
        if (docId > 0) {
            let url = "GetLogsQualityControlForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'QualityControlLog');
            this.getQualityControlItems(docId);

            this.setState({
                IsEditMode: true
            })
        } else {
            ///Is Add Mode 
            let cmi = Config.getPayload().cmi
            let cni = Config.getPayload().cni
            Api.get('GetNextArrangeMainDoc?projectId=' + projectId + '&docType=101&companyId=' + cmi + '&contactId=' + cni + '').then(
                res => {
                    let qualityControlDoc = {
                        id: undefined,
                        projectId: projectId,
                        arrange: res,
                        docDate: moment(),
                        docCloseDate: moment(),
                        status: true,
                        rejected:false,
                        accepted:false,
                        bicCompanyId: '',
                        bicContactId: '',
                        lastRevNumber: '',
                        inspectionRequestId: '',
                        fileNumberId: '',
                        disciplineId: '',
                        revisions: '',
                        areaId: '',
                        reasonForIssueId: '',
                        specsSectionId: '',
                        contractPoId: '',
                        subject: ''
                    }
                    this.setState({
                        document: qualityControlDoc
                    })
                    this.FillDropDowns()
                }
            )
            this.props.actions.documentForAdding();

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

    FillDropDowns = () => {

        dataservice.GetDataListCached("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId', 'companies', this.state.projectId, "projectId").then(result => {

            if (docId > 0) {

                let companyId = this.props.document.bicCompanyId;

                let fromCompanyName = find(result, function (i) { return i.value == companyId; });

                if (companyId) {
                    this.setState({
                        selectedFromCompany: { label: fromCompanyName ? fromCompanyName.label : null, value: companyId }
                    });
                    this.fillSubDropDownInEdit('GetContactsByCompanyId', 'companyId', companyId, 'bicContactId', 'selectedFromContact', 'fromContacts');
                }
            }
            this.setState({
                companies: [...result],
            });
        });

        dataservice.GetDataList("GetAccountsQualityControlsByParentId", "title", "id").then(result => {
            if (docId > 0) {
                let disciplineId = this.props.document.disciplineId;
                let discpline = {};
                if (disciplineId) {
                    discpline = find(result, function (i) { return i.value == disciplineId; });
                    if (discpline) {
                        this.setState({
                            selectedDiscpline: discpline
                        });
                    }

                }
            }
            this.setState({
                discplines: [...result]
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=area", 'title', 'id', 'defaultLists', "area", "listType").then(result => {

            if (docId > 0) {
                let areaId = this.props.document.areaId;

                let area = {};
                if (areaId) {
                    area = find(result, function (i) { return i.value == areaId; });
                    if (area) {
                        this.setState({
                            selecetedArea: { label: area.label, value: areaId },
                        });
                    }

                }
            }
            this.setState({
                areas: [...result],
                isLoading: false
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=specsSection", 'title', 'id', 'defaultLists', "specsSection", "listType").then(result => {
            if (docId > 0) {
                let specId = this.props.document.specsSectionId;
                let spec = {};
                if (specId) {

                    spec = find(result, function (i) { return i.value == specId });
                    if (spec) {
                        this.setState({
                            selectedSpecsSectionId: { label: spec.label, value: this.props.document.specsSectionId }
                        });
                    }

                }

            }
            this.setState({
                specificationSectionList: [...result],
                isLoading: false
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=lastRevNumber", "title", "id", 'defaultLists', "lastRevNumber", "listType").then(result => {
            if (docId > 0) {
                let revId = this.props.document.lastRevNumber;
                let review = {};
                if (revId) {
                    review = find(result, function (i) { return i.value == revId });
                    if (review) {
                        this.setState({
                            selectedLastRevNumber: { label: review.label, value: revId }
                        });
                    }

                }
            }

            this.setState({
                lastRevNumberList: [...result],
                isLoading: false
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=reasonforissue", 'title', 'id', 'defaultLists', "reasonforissue", "listType").then(result => {
            if (docId > 0) {
                let reasonForIssueId = this.props.document.reasonForIssueId;
                let reasonForIssue = {};
                if (reasonForIssueId) {
                    reasonForIssue = find(result, function (i) { return i.value == reasonForIssueId; });
                    if (reasonForIssue) {
                        this.setState({
                            selectedReasonForIssue: reasonForIssue
                        });
                    }

                }
            }
            this.setState({
                reasonForIssues: [...result],
                isLoading: false
            });
        });

        dataservice.GetDataListCached("GetaccountsDefaultListForList?listType=drawingfilenumber", 'title', 'id', 'defaultLists', "drawingfilenumber", "listType").then(result => {
            if (docId) {
                let fileId = this.props.document.fileNumberId;

                let file = {};
                if (fileId) {
                    file = find(result, function (i) { return i.value == fileId });

                    if (file) {
                        this.setState({
                            selectedFileNumberId: { label: file.label, value: fileId }
                        });
                    }

                }
            }


            this.setState({
                fileNumberList: [...result]
            });


        });

        dataservice.GetDataList("GetPoContractForList?projectId=" + this.state.projectId, "subject", "id").then(result => {
            if (docId > 0) {
                let conId = this.props.document.contractPoId;
                let con = {};
                if (conId) {
                    con = find(result, function (i) { return i.value == conId });
                    if (con) {
                        this.setState({
                            selectedContract: { label: con.label, value: conId }
                        });
                    }
                }
            }
            this.setState({
                contractsPos: [...result],
                isLoading: false
            });
        });
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

        if (field == "bicContactId") {
            let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + this.state.document.bicCompanyId + "&contactId=" + event.value;
            dataservice.GetNextArrangeMainDocument(url).then(res => {
                updated_document.arrange = res;
                updated_document = Object.assign(original_document, updated_document);

                this.setState({
                    document: updated_document
                });
            })
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

    saveAndExit = () => {

        if (this.state.isApproveMode === false) {
            this.props.history.push(this.state.perviousRoute);
        }

    }

    showBtnsSaving() {
        let btn = <button
            className={this.props.changeStatus == false ? 'primaryBtn-1 btn meduimBtn ' : ' primaryBtn-1 btn meduimBtn  disNone'}
            type="submit">
            {this.state.docId > 0 && this.props.changeStatus === false ? Resources.saveAndExit[currentLanguage] :
                Resources.save[currentLanguage]}
        </button>


        return btn;
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

    saveQualityControl = () => {

        if (this.state.IsAddModel) {
            this.saveAndExit()
        }
        else {
            this.setState({ isLoading: true })

            let saveDocument = this.state.document;
            saveDocument.docDate = moment(saveDocument.docDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

            if (docId > 0) {
                dataservice.addObject('EditLogsQualityControl', saveDocument).then(
                    res => {
                        this.setState({
                            isLoading: false,
                        })
                        this.state.qualityControlItemsList.map(item => {
                            item.qualityControlId = res.id;
                            dataservice.addObject('EditLogsQualityControlItems', item);
                        })
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                        this.saveAndExit();

                    }).catch(ex => {
                        this.setState({
                            isLoading: false
                        })
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    });
            }
            else {
                dataservice.addObject('AddLogsQualityControl', saveDocument).then(
                    res => {
                        this.setState({
                            docId: res.id,
                            isLoading: false,
                            IsAddModel: true
                        })
                        this.state.qualityControlItemsList.map(item => {
                            item.qualityControlId = res.id;
                            dataservice.addObject('AddLogsQualityControlItems', item);
                        })
                        toast.success(Resources["operationSuccess"][currentLanguage]);
                    }).catch(ex => {
                        this.setState({
                            isLoading: false
                        })
                        toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                    });
            }
        }
    }

    viewAttachments() {
        return (
            this.state.docId !== 0 ? (
                Config.IsAllow(3308) === true ?
                    <ViewAttachment isApproveMode={this.state.isViewMode} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    }

    getQualityControlItems = (e) => {
        let url=docId > 0?`GetLogsQualityControlItemsByQualityControlId?qualityControlId=${e}`:`GetLogsQualityControlItemsByQualityControlId?parentId=${e.value}`
        dataservice.GetDataGrid(url).then(result => {
            this.setState({ qualityControlItemsList: result || [] })
        })
    }
    changeTableValue = (field, e, index) => {
        // if (e && index >= 0) {
        let rows = this.state.qualityControlItemsList;
        if (rows.length > 0) {
            rows[index][field] = e;
            this.setState({
                qualityControlItemsList: rows
            })
        }
        //}
    }
    render() {
        let RenderQualityControlItemsTable = this.state.qualityControlItemsList.map((item, index) => {
            return (
                <tr key={item.id}>
                    <td style={{ width: 'auto' }}>
                        <div className="contentCell" style={{ width: 'auto', maxWidth: 'unset' }}>
                            <p className="zero">{item.id}</p>
                        </div>
                    </td>
                    <td style={{ width: 'auto' }}>
                        <div className="contentCell" style={{ width: 'auto', maxWidth: 'unset' }}>
                            <p className="zero">{item.details}</p>
                        </div>
                    </td>
                    <td>  <div className="contenCell" style={{ maxWidth: 'unset' }}>
                        <div className="inputDev ui input">
                            <div className="ui checkbox radio radioBoxBlue">
                                <input key={item} type="radio" name={index} defaultChecked={item.accepted == true ? 'checked' : null}
                                    value="true" onChange={e => { this.changeTableValue('accepted', true, index) }} />
                                <label>{Resources.accepted[currentLanguage]}</label>
                            </div>
                            <div className="ui checkbox radio radioBoxBlue">
                                <input key={item} type="radio" name={index} defaultChecked={item.rejected == true ? 'checked' : null}
                                    value="false" onChange={e => this.changeTableValue('rejected', true, index)} />
                                <label>{Resources.rejected[currentLanguage]}</label>
                            </div>
                        </div>
                    </div>
                    </td>
                    <td>
                        <div className="contenCell" style={{ maxWidth: 'unset' }}>
                            <div className="inputDev ui input">
                                <input key={item} className="form-control" type="text" value={item.comment}
                                    onChange={(e) => this.changeTableValue("comment", e.target.value, index)} style={{ maxHeight: '40px' }} />
                            </div>
                        </div>
                    </td>
                </tr>
            )
        })

        return (
            <div className="mainContainer">
                {this.state.isLoading == true ? <LoadingSection /> : null}
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>

                    <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} perviousRoute={this.state.perviousRoute}
                        docTitle={Resources.qualityCheckListAddEdit[currentLanguage]}
                        moduleTitle={Resources['qualityControl'][currentLanguage]} />

                    <div className="doc-container">
                        <div className="step-content">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    <Formik
                                        initialValues={{ ...this.state.document }}
                                        validationSchema={validationSchema}
                                        enableReinitialize={true}
                                        onSubmit={() => {
                                            this.saveQualityControl();
                                        }}>

                                        {({ errors, touched, handleBlur, values, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                            <Form id="InspectionRequestForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                <div className="proForm first-proform">
                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                        <div className={"inputDev ui input" + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")} >
                                                            <input name='subject' className="form-control fsadfsadsa" id="subject"
                                                                placeholder={Resources.subject[currentLanguage]} autoComplete='off'
                                                                value={this.state.document.subject}
                                                                onChange={(e) => this.handleChange(e, 'subject')}
                                                                onBlur={(e) => {
                                                                    handleBlur(e)
                                                                    handleChange(e)
                                                                }}
                                                            />
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
                                                        <DatePicker title='docDate' startDate={this.state.document.docDate}
                                                            handleChange={e => this.handleChangeDate(e, 'docDate')} />
                                                    </div>
                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                        <div className="ui input inputDev"  >
                                                            <input type="text" className="form-control" id="arrange" readOnly
                                                                value={this.state.document.arrange} name="arrange"
                                                                placeholder={Resources.arrange[currentLanguage]}
                                                                onBlur={(e) => {
                                                                    handleChange(e)
                                                                    handleBlur(e)
                                                                }}
                                                                onChange={(e) => this.handleChange(e, 'arrange')} />
                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="areaName" data={this.state.areas}
                                                            selectedValue={this.state.selecetedArea} index="areaId"
                                                            value={this.state.selecetedArea}
                                                            handleChange={event => this.handleChangeDropDown(event, 'areaId', false, '', '', '', 'selecetedArea')}
                                                            error={errors.areaId} touched={touched.areaId}
                                                            name="areaId" id="areaId"
                                                        />
                                                    </div>
                                                    <div className="linebylineInput valid-input mix_dropdown">
                                                        <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                        <div className="supervisor__company">
                                                            <div className="super_name">
                                                                <Dropdown data={this.state.companies} name="bicCompanyId"
                                                                    selectedValue={this.state.selectedFromCompany}
                                                                    handleChange={event => {
                                                                        this.handleChangeDropDown(event, 'bicCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact')
                                                                    }} styles={CompanyDropdown} classDrop="companyName1 "
                                                                    error={errors.bicCompanyId} touched={touched.bicCompanyId}
                                                                    name="bicCompanyId" id="bicCompanyId"
                                                                />
                                                            </div>
                                                            <div className="super_company">
                                                                <Dropdown data={this.state.fromContacts} name="bicContactId"
                                                                    selectedValue={this.state.selectedFromContact}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'bicContactId', false, '', '', '', 'selectedFromContact')}
                                                                    classDrop=" contactName1" styles={ContactDropdown}
                                                                    error={errors.bicContactId} touched={touched.bicContactId}
                                                                    name="bicContactId" id="bicContactId" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown data={this.state.contractsPos} selectedValue={this.state.selectedContract}
                                                            handleChange={event => this.handleChangeDropDown(event, 'contractPoId', false, '', '', '', 'selectedContract')}
                                                            onChange={setFieldValue} onBlur={setFieldTouched} title="contractPo"
                                                            error={errors.contractPoId} touched={touched.contractPoId}
                                                            index="IR-contractPoId" name="contractPoId" id="contractPoId" />
                                                    </div>
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="discipline" data={this.state.discplines}
                                                            selectedValue={this.state.selectedDiscpline} touched={touched.disciplineId}
                                                            onChange={setFieldValue} onBlur={setFieldTouched} error={errors.disciplineId}
                                                            handleChange={event => {
                                                                this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedDiscpline');
                                                                this.getQualityControlItems(event);
                                                            }}
                                                            index="IR-disciplineId" name="disciplineId" id="disciplineId"
                                                        />
                                                    </div>
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="specsSection" name="specsSectionId"
                                                            data={this.state.specificationSectionList} selectedValue={this.state.selectedSpecsSectionId}
                                                            handleChange={event => this.handleChangeDropDown(event, 'specsSectionId', false, '', '', '', 'selectedSpecsSectionId')}
                                                            error={errors.specsSectionId} touched={touched.specsSectionId}
                                                            name="specsSectionId" id="specsSectionId" />
                                                    </div>
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown
                                                            title="reasonForIssue"
                                                            data={this.state.reasonForIssues}
                                                            selectedValue={this.state.selectedReasonForIssue}
                                                            handleChange={event => this.handleChangeDropDown(event, 'reasonForIssueId', false, '', '', '', 'selectedReasonForIssue')}
                                                            index="reasonForIssueId"
                                                            error={errors.reasonForIssueId} touched={touched.reasonForIssueId}
                                                            name="reasonForIssueId" id="reasonForIssueId" />
                                                    </div>
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="lastRevNumber" data={this.state.lastRevNumberList}
                                                            selectedValue={this.state.selectedLastRevNumber} index="lastRevNumber"
                                                            handleChange={event => this.handleChangeDropDown(event, "lastRevNumber", false, '', '', '', 'selectedLastRevNumber')}
                                                        />
                                                    </div>
                                                    <div className="linebylineInput valid-input">
                                                        <Dropdown title="fileNumber" data={this.state.fileNumberList}
                                                            selectedValue={this.state.selectedFileNumberId} index="fileNumberId"
                                                            handleChange={event => this.handleChangeDropDown(event, 'fileNumberId', false, '', '', '', 'selectedFileNumberId')}
                                                            error={errors.fileNumberId} touched={touched.fileNumberId}
                                                            name="fileNumberId" id="fileNumberId" />
                                                    </div>
                                                </div>
                                                <div className="doc-pre-cycle letterFullWidth">
                                                    <div>
                                                        {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={927} EditAttachments={3263} ShowDropBox={3585} ShowGoogleDrive={3586} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />) : null}
                                                        {this.viewAttachments()}
                                                        <Fragment>
                                                            <div className="document-fields tableBTnabs">
                                                                {this.state.docId > 0 ? <AddDocAttachment isViewMode={this.state.isViewMode} projectId={projectId} docTypeId={this.state.docTypeId} docId={this.state.docId} /> : null}
                                                            </div>
                                                        </Fragment>
                                                        {this.props.changeStatus === true ?
                                                            <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                            : null}
                                                    </div>
                                                </div>
                                                <div className='doc-pre-cycle'>
                                                    <table className="attachmentTable">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    <div className="headCell" style={{ maxWidth: 'unset' }}>
                                                                        <span>{Resources.arrange[currentLanguage]}</span>
                                                                    </div>
                                                                </th>
                                                                <th>
                                                                    <div className="headCell" style={{ maxWidth: 'unset' }}>
                                                                        <span>{Resources.listDetails[currentLanguage]}</span>
                                                                    </div>
                                                                </th>
                                                                <th>
                                                                    <div className="headCell" style={{ maxWidth: 'unset' }}>
                                                                        <span>{Resources.status[currentLanguage]}</span>
                                                                    </div>
                                                                </th>
                                                                <th>
                                                                    <div className="headCell" style={{ maxWidth: 'unset' }}>
                                                                        <span>{Resources.comment[currentLanguage]}</span>
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {RenderQualityControlItemsTable}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="slider-Btns">
                                                    {this.state.isLoading ?
                                                        this.state.IsEditMode === false ?
                                                            <button className="primaryBtn-1 btn disabled">
                                                                <div className="spinner">
                                                                    <div className="bounce1" />
                                                                    <div className="bounce2" />
                                                                    <div className="bounce3" />
                                                                </div>
                                                            </button> : null
                                                        : this.showBtnsSaving()}
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>

                        {this.state.IsEditMode ?
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
                                        <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={this.saveQualityControl} type="submit">{Resources.save[currentLanguage]}</button>
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
                                        documentName={Resources.NCRLog[currentLanguage]}
                                    />
                                </div>
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        )
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
)(withRouter(QualityControlAddEdit))














































































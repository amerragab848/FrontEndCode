import React, { Component, Fragment } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from '../../Dataservice';
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import TextEditor from '../../Componants/OptionsPanels/TextEditor';
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments';
import ViewLetterReplies from '../../Componants/OptionsPanels/ViewLetterReplies';
import ViewWorkFlow from '../../Componants/OptionsPanels/ViewWorkFlow';
import Resources from '../../resources.json';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from '../../Services/Config.js';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import DatePicker from '../../Componants/OptionsPanels/DatePicker';
import { toast } from 'react-toastify';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument';
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown';
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown';
import DocumentActions from '../../Componants/OptionsPanels/DocumentActions';
import find from 'lodash/find';
import Api from '../../api';
import DropdownMelcous from '../../Componants/OptionsPanels/DropdownMelcous'
import UploadAttachmentWithProgress from '../../Componants/OptionsPanels/UploadAttachmentWithProgress';

let currentLanguage =
    localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(
        Resources['subjectRequired'][currentLanguage],
    ),
    fromContactId: Yup.string()
        .required(Resources['fromContactRequired'][currentLanguage])
        .nullable(true),
    toContactId: Yup.string()
        .required(Resources['toContactRequired'][currentLanguage])
        .nullable(true),
    sharedSettings: Yup.string().url(Resources['URLFormat'][currentLanguage]),
});

let docId = 0;
let projectId = 0;
let projectName = '';
let isApproveMode = false;
let docApprovalId = 0;
let docAlertId = 0;

let perviousRoute = '';
let arrange = 0;
let prevLetterId = 0;

let toCompanyId = 0;
let fromCompanyId = 0;
let toContactId = 0;
let fromContactId = 0;
let replyFromCompId = 0;
let replyFromContId = 0;
let replyToCompId = 0;
let replyToContId = 0;

class LettersAddEdit extends Component {
    constructor(props) {
        super(props);

        const query = new URLSearchParams(this.props.location.search);
        let obj = Config.extractDataFromParamas(query);
        //  let obj=this.props.match.params;
        //  console.log(obj);
        if (Object.entries(obj).length === 0) {
            this.props.history.goBack();
        } else {
            docId = obj.docId;
            projectId = obj.projectId;
            projectName = obj.projectName;
            isApproveMode = obj.isApproveMode;
            docApprovalId = obj.docApprovalId;
            docAlertId = obj.docAlertId;
            arrange = obj.arrange;
            perviousRoute = obj.perviousRoute;
            if (obj.prevLetterId) {
                fromCompanyId = obj.fromCompanyId;
                toCompanyId = obj.toCompanyId;
                fromContactId = obj.fromContactId;
                toContactId = obj.toContactId;
            }
            prevLetterId = obj.prevLetterId;
        }

        this.state = {
            replies: [],
            repliesIds: [],
            tCompanyId: toCompanyId,
            frmCompanyId: fromCompanyId,
            tContactId: toContactId,
            frmContactId: fromContactId,
            isViewMode: false,
            isApproveMode: isApproveMode,
            perviousRoute: perviousRoute,
            isView: false,
            docId: docId,
            docTypeId: 19,
            projectId: projectId,
            docApprovalId: docApprovalId,
            docAlertId: docAlertId,
            arrange: arrange,
            docAlertId: 0,
            document: { id: 0 },
            companies: [],
            ToContacts: [],
            fromContacts: [],
            discplines: [],
            letters: [],
            replyLink: '',
            permission: [
                { name: 'sendByEmail', code: 54 },
                { name: 'sendByInbox', code: 53 },
                { name: 'sendTask', code: 1 },
                { name: 'distributionList', code: 956 },
                { name: 'createTransmittal', code: 3042 },
                { name: 'sendToWorkFlow', code: 707 },
                { name: 'viewAttachments', code: 3317 },
                { name: 'deleteAttachments', code: 840 },
                { name: 'previousVersions', code: 8080800 },
            ],
            selectedFromCompany: {
                label: Resources.fromCompanyRequired[currentLanguage],
                value: '0',
            },
            selectedToCompany: {
                label: Resources.toCompanyRequired[currentLanguage],
                value: '0',
            },
            selectedFromContact: {
                label: Resources.fromContactRequired[currentLanguage],
                value: '0',
            },
            selectedToContact: {
                label: Resources.toContactRequired[currentLanguage],
                value: '0',
            },
            selectedDiscpline: {
                label: Resources.disciplineRequired[currentLanguage],
                value: '0',
            },
            selectedReplyLetter: [],
            selectedReplyLetterList: [],
            message: '',
            selectedWorkFlow: { label: 'select WorkFlow', value: 0 },
            selectedApproveId: { label: 'select To Contact', value: 0 },
            submitLoading: false,
            WorkFlowData: [],
            WorkFlowContactData: [],
        };

        if (!Config.IsAllow(48) && !Config.IsAllow(49) && !Config.IsAllow(51)) {
            toast.warn(Resources['missingPermissions'][currentLanguage]);
            this.props.history.push(this.state.perviousRoute);
        }
    }

    workFlowhandelChangeLetter = item => {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document.workFlowId = item.value;
        updated_document = Object.assign(original_document, updated_document);

        let url =
            'GetProjectWorkFlowContactsFirstLevelForList?workFlow=' +
            item.value;
        dataservice.GetDataList(url, 'contactName', 'id').then(result => {
            this.setState({
                document: updated_document,
                WorkFlowContactData: [...result],
                selectedWorkFlow: item,
            });
        });
    };

    toAccounthandelChangeLetter = item => {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document.toAccountId = item.value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document,
            selectedApproveId: item,
        });
    };

    componentDidMount() {
        var links = document.querySelectorAll(
            '.noTabs__document .doc-container .linebylineInput',
        );

        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add('even');
            } else {
                links[i].classList.add('odd');
            }
        }
        if (this.state.docId > 0) {
            let url = 'GetLettersById?id=' + this.state.docId;
            this.props.actions.documentForEdit(
                url,
                this.state.docTypeId,
                'lettertitle',
            );
        } else {
            let letter = {
                subject: '',
                id: 0,
                projectId: this.props.projectId,
                arrange: '',
                fromCompanyId: replyFromCompId || '',
                fromContactId: replyFromContId || '',
                toCompanyId: replyToCompId || '',
                toContactId: replyToContId || '',
                replyId: prevLetterId != null ? prevLetterId : '',
                docDate: moment().format('YYYY-MM-DD'),
                status: 'true',
                disciplineId: '',
                refDoc: '',
                sharedSettings: '',
                message: '',
                workFlowId: '',
                toAccountId: '',
            };

            this.setState({
                document: letter,
            });

            this.fillDropDowns(false);

            this.props.actions.documentForAdding();
        }

        this.checkDocumentIsView();

        this.getReplies();
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.document.id !== state.document.id && nextProps.changeStatus === true) {
            return {
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow,
                message: nextProps.document.message,
            };
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.document.id !== this.props.document.id && this.props.changeStatus === true) {
            //         // und 976 --1
            //         //976 976 fire modal
            //         //976 976 close modal
            //         //alert('recieve....');
            //         //alert('recieve....' + this.state.showModal + '.....' + nextProps.showModal);

            this.fillDropDowns(this.props.document.id > 0 ? true : false);
            this.checkDocumentIsView();
        }

        if (
            this.props.hasWorkflow !== prevProps.hasWorkflow ||
            this.props.changeStatus !== prevProps.changeStatus
        ) {
            this.checkDocumentIsView();
        }
    }
    componentWillUnmount() {
        this.props.actions.clearCashDocument();
        this.setState({
            docId: 0,
        });
    }
    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!Config.IsAllow(49)) {
                this.setState({ isViewMode: true });
            }
            if (Config.getUserTypeIsAdmin() === true) {
                this.setState({ isViewMode: false });
            } else {
                if (this.state.isApproveMode != true && Config.IsAllow(49)) {
                    if (this.props.hasWorkflow == false && Config.IsAllow(49)) {
                        if (
                            this.props.document.status !== false &&
                            Config.IsAllow(49)
                        ) {
                            this.setState({ isViewMode: false });
                        } else {
                            this.setState({ isViewMode: true });
                        }
                    } else {
                        this.setState({ isViewMode: true });
                    }
                }
            }
        } else {
            this.setState({ isViewMode: false });
        }
    }
    getReplies() {
        if (this.state.docId > 0) {
            let url =
                'GetAllReplyLettersByletterId?letterId=' + this.state.docId;
            this.GetLogData(url);
        }
    }
    GetLogData(url) {
        Api.get(url, undefined, 1).then(result => {
            result.forEach(row => {
                let subject = '';
                if (row) {
                    let obj = {
                        docId: row.id,
                        projectId: row.projectId,
                        projectName: row.projectName,
                        arrange: 0,
                        docApprovalId: 0,
                        isApproveMode: false,
                        perviousRoute:
                            window.location.pathname + window.location.search,
                    };
                    let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

                    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

                    let addView = 'LettersAddEdit';
                    var doc_view = addView + '?id=' + encodedPaylod;

                    subject = doc_view;
                }
                row.link = subject;
            });
            this.setState({
                replies: result,
            });
        });
    }
    fillSubDropDownInEdit(
        url,
        param,
        value,
        subField,
        subSelectedValue,
        subDatasource,
        toProps,
    ) {
        let action = url + '?' + param + '=' + value;

        dataservice.GetDataList(action, 'contactName', 'id').then(result => {
            if (this.props.changeStatus === true) {
                let toSubField = this.state.document[subField];
                let targetFieldSelected = result.filter(function (i) {
                    return i.value == toSubField;
                });
                this.setState({
                    [subSelectedValue]: targetFieldSelected,
                    [subDatasource]: result,
                });
            } else {
                if (prevLetterId) {
                    let state = { ...this.state };
                    console.log(state[toProps], toProps, result);
                    let toSubField = state[toProps];
                    let targetFieldSelected = find(result, function (item) {
                        return item.value == state[toProps];
                    });

                    console.log(state[toProps], toProps, targetFieldSelected);
                    let original_document = { ...this.state.document };
                    let updated_document = {};
                    updated_document[subField] = state[toProps];
                    updated_document = Object.assign(
                        original_document,
                        updated_document,
                    );

                    this.setState({
                        document: updated_document,
                        [subSelectedValue]: targetFieldSelected,
                        [subDatasource]: result,
                    });
                }
            }
        });
    }

    fillDropDowns(isEdit, cb) {
        if (!isEdit) {
            dataservice
                .GetDataList(
                    'ProjectWorkFlowGetList?projectId=' + this.state.projectId,
                    'subject',
                    'id',
                )
                .then(result => {
                    this.setState({
                        WorkFlowData: [...result],
                    });
                });
        }
        dataservice
            .GetDataListCached(
                'GetProjectProjectsCompaniesForList?projectId=' +
                this.state.projectId,
                'companyName',
                'companyId',
                'companies',
                this.state.projectId,
                'projectId',
            )
            .then(result => {
                if (isEdit) {
                    let companyId = this.props.document.fromCompanyId;
                    if (companyId) {
                        this.setState({
                            selectedFromCompany: {
                                label: this.props.document.fromCompanyName,
                                value: companyId,
                            },
                        });
                        this.fillSubDropDownInEdit(
                            'GetContactsByCompanyId',
                            'companyId',
                            companyId,
                            'fromContactId',
                            'selectedFromContact',
                            'fromContacts',
                        );
                    }
                    let toCompanyId = this.props.document.toCompanyId;
                    if (toCompanyId) {
                        this.setState({
                            selectedToCompany: {
                                label: this.props.document.toCompanyName,
                                value: toCompanyId,
                            },
                        });

                        this.fillSubDropDownInEdit(
                            'GetContactsByCompanyId',
                            'companyId',
                            toCompanyId,
                            'toContactId',
                            'selectedToContact',
                            'ToContacts',
                        );
                    }
                } else {
                    if (fromCompanyId && toCompanyId) {
                        let fromCompany = find(result, function (item) {
                            return item.value == fromCompanyId;
                        });
                        let toCompany = find(result, function (item) {
                            return item.value == toCompanyId;
                        });

                        this.fillSubDropDownInEdit(
                            'GetContactsByCompanyId',
                            'companyId',
                            fromCompany ? fromCompanyId : null,
                            'fromContactId',
                            'selectedFromContact',
                            'fromContacts',
                            'frmContactId',
                        );

                        this.fillSubDropDownInEdit(
                            'GetContactsByCompanyId',
                            'companyId',
                            toCompany ? toCompanyId : null,
                            'toContactId',
                            'selectedToContact',
                            'ToContacts',
                            'tContactId',
                        );

                        this.setState({
                            selectedFromCompany: {
                                label: fromCompany ? fromCompany.label : '',
                                value: fromCompany ? fromCompanyId : '0',
                            },
                            selectedToCompany: {
                                label: toCompany ? toCompany.label : '',
                                value: toCompany ? toCompanyId : '0',
                            },
                        });

                        this.handleChangeDropDown(
                            fromCompany,
                            'fromCompanyId',
                            true,
                            'fromContacts',
                            'GetContactsByCompanyId',
                            'companyId',
                            'selectedFromCompany',
                            'selectedFromContact',
                        );
                        this.handleChangeDropDown(
                            toCompany,
                            'toCompanyId',
                            true,
                            'ToContacts',
                            'GetContactsByCompanyId',
                            'companyId',
                            'selectedToCompany',
                            'selectedToContact',
                        );
                    }
                }

                this.setState({
                    companies: [...result],
                });
            });

        dataservice
            .GetDataListCached('GetaccountsDefaultListForList?listType=discipline', 'title', 'id', 'defaultLists', 'discipline', 'listType')
            .then(result => {
                if (isEdit) {
                    let disciplineId = this.props.document.disciplineId;
                    let discpline = {};
                    if (disciplineId) {
                        discpline = result.filter(function (i) {
                            return i.value == disciplineId;
                        });

                        this.setState({
                            selectedDiscpline: discpline,
                        });
                    }
                }
                this.setState({
                    discplines: [...result],
                });
            });
        dataservice.GetLettersWithReplies('GetLettersWithRepliesList?projectId=' + this.state.projectId + "&letterId=" + this.state.docId, 'subject', 'id', 'id').then(result => {

            let lettersList = result.letters.filter(function (item) {
                return result.replies.indexOf(item) < 0;
            });
            this.setState({
                letters: lettersList,
                selectedReplyLetter: result.replies,
                selectedReplyLetterList: result.replies,
            });
        });
    }

    onChangeMessage = value => {
        if (value != null) {
            this.setState({ message: value });
            let original_document = { ...this.state.document };
            let updated_document = {};

            updated_document.message = value;

            updated_document = Object.assign(
                original_document,
                updated_document,
            );

            this.setState({
                document: updated_document,
            });
        }
    };

    handleChange(e, field) {
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
        });
    }

    handleChangeDate(e, field) {
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
        });
    }

    handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue,subDatasource,subDatasourceId) {
       
        let original_document = { ...this.state.document };
        let updated_document = {};
        if (event == null) {
            updated_document[field] = event;
            updated_document[subDatasourceId] = event;

            this.setState({
               
                [subDatasource]: event,
            });
         }else{
             updated_document[field] = event.value;
         }
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
            [selectedValue]: event,
        });

        if (field == 'toContactId') {
            if(event!==null){
                let url = 'GetRefCodeArrangeMainDoc?projectId=' + this.state.projectId +
                '&docType=' + this.state.docTypeId + '&fromCompanyId=' + this.state.document.fromCompanyId + '&fromContactId=' + this.state.document.fromContactId +
                '&toCompanyId=' + this.state.document.toCompanyId + '&toContactId=' + event.value;

            dataservice.GetRefCodeArrangeMainDoc(url).then(res => {
                updated_document.arrange = res.arrange;

                if (Config.getPublicConfiguartion().refAutomatic === true) {
                    updated_document.refDoc = res.refCode;
                }

                updated_document = Object.assign(
                    original_document,
                    updated_document,
                );

                this.setState({
                    document: updated_document,
                });
            });
            }else{
                updated_document.arrange ="";

                if (Config.getPublicConfiguartion().refAutomatic === true) {
                    updated_document.refDoc = "";
                }

                updated_document = Object.assign(
                    original_document,
                    updated_document,
                );

                this.setState({
                    document: updated_document,
                });
            }

        }
        if (isSubscrib) {
            if(event!==null) {
                let action = url + '?' + param + '=' + event.value;
                dataservice
                    .GetDataList(action, 'contactName', 'id')
                    .then(result => {
                        this.setState({
                            [targetState]: result,
                        });
                    });
            }else
            {
                this.setState({
                    [targetState]: [],
                });
            }

        
        }
    }

    editLetter(event) {
        this.setState({
            isLoading: true,
        });

        dataservice
            .addObject('EditLetterById', this.state.document)
            .then(result => {
                this.setState({
                    isLoading: false,
                });
                toast.success(Resources['operationSuccess'][currentLanguage]);
                if (this.state.isApproveMode === false) {
                    this.props.history.push(this.state.perviousRoute);
                }
            });
    }

    saveLetter(event) {
        this.setState({
            isLoading: true,
        });

        let saveDocument = { ...this.state.document };
        saveDocument.projectId = this.props.projectId;
        saveDocument.repliesIds = this.state.repliesIds.map(i => i.value);

        saveDocument.docDate = moment(saveDocument.docDate).format(
            'MM/DD/YYYY',
        );

        dataservice.addObject('AddLetters', saveDocument).then(result => {
            this.setState({
                docId: result,
                isLoading: false,
            });
            toast.success(Resources['operationSuccess'][currentLanguage]);
        });
    }

    saveAndExit(event) {
        let replyId = this.state.document.replyId;
        if (replyId) {
            this.props.history.push({
                pathname: '/Letters/' + this.props.projectId,
            });
        } else {
            this.props.history.push(this.state.perviousRoute);
        }
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = (
                <button className="primaryBtn-1 btn meduimBtn" type="submit">
                    {this.state.docId > 0 && this.props.changeStatus === false
                        ? Resources.saveAndExit[currentLanguage]
                        : Resources.save[currentLanguage]}
                </button>
            );
        } else if (this.state.docId > 0 && this.props.changeStatus === false) {
            btn = (
                <button className="primaryBtn-1 btn mediumBtn" type="submit">
                    {Resources.saveAndExit[currentLanguage]}
                </button>
            );
        }
        return btn;
    }

    viewAttachments() {
        return this.state.docId > 0 ? (
            Config.IsAllow(3317) === true ? (
                <ViewAttachment
                    isApproveMode={this.state.isViewMode}
                    docTypeId={this.state.docTypeId}
                    docId={this.state.docId}
                    projectId={this.state.projectId}
                    deleteAttachments={840}
                />
            ) : null
        ) : null;
    }

    ViewLetterReplies() {
        return this.state.docId > 0 ? (
            <ViewLetterReplies
                docTypeId={this.state.docTypeId}
                docId={this.state.docId}
                projectId={this.state.projectId}
                selectedReplyLetter={this.state.selectedReplyLetter}
            />
        ) : null;
    }

    showOptionPanel = () => {
        this.props.actions.showOptionPanel(true);
    };

    replieshandleChange = (e) => {
        var obj = {};
        let selectedReplyLetter = e;
        let selectedReplyLetterList = this.state.selectedReplyLetterList;

        if (this.props.changeStatus === true && this.state.docId > 0) {

            var removeReplies = selectedReplyLetterList.filter(x => selectedReplyLetter.indexOf(x) === -1);
            removeReplies.forEach(item => {
                obj.addRemove = false;
                obj.replyId = item.value;
                obj.letterId = this.state.docId;
                dataservice.addObject('EditReplyLetters', obj).then(result => {
                    this.setState({
                        isLoading: false,
                    });
                    toast.success(Resources['operationSuccess'][currentLanguage]);
                });

            });

            var addReplies = selectedReplyLetter.filter(x => selectedReplyLetterList.indexOf(x) === -1);
            addReplies.forEach(item => {
                obj.addRemove = true;
                obj.replyId = item.value;
                obj.letterId = this.state.docId;
                dataservice.addObject('EditReplyLetters', obj).then(result => {
                    this.setState({
                        isLoading: false,
                    });
                    toast.success(Resources['operationSuccess'][currentLanguage]);
                });

            });
            this.setState({ repliesIds: e, selectedReplyLetter: e, selectedReplyLetterList: e })

        } else {
            this.setState({ repliesIds: e, selectedReplyLetter: e })
        }
    }

    render() {
        let replyId = this.state.document.replyId;

        return (
            <div className="mainContainer" id={'mainContainer'}>
                <div
                    className={
                        this.state.isViewMode === true
                            ? 'documents-stepper noTabs__document readOnly_inputs'
                            : 'documents-stepper noTabs__document'
                    }>
                    <HeaderDocument
                        projectName={projectName}
                        isViewMode={this.state.isViewMode}
                        perviousRoute={
                            replyId
                                ? '/Letters/' + this.props.projectId
                                : this.state.perviousRoute
                        }
                        docTitle={Resources.lettertitle[currentLanguage]}
                        moduleTitle={
                            Resources['communication'][currentLanguage]
                        }
                    />
                    <div className="doc-container">
                        <div className="step-content">
                            <div id="step1" className="step-content-body">
                                <div className="subiTabsContent">
                                    <div className="document-fields">
                                        <Formik
                                            initialValues={{
                                                ...this.state.document,
                                            }}
                                            validationSchema={validationSchema}
                                            enableReinitialize={true}
                                            onSubmit={values => {
                                                if (this.props.showModal) {
                                                    return;
                                                }
                                                if (this.props.changeStatus === true && this.state.docId > 0) {
                                                    this.editLetter();
                                                } else if (this.props.changeStatus === false && this.state.docId === 0) {
                                                    this.saveLetter();
                                                } else {
                                                    this.saveAndExit();
                                                }
                                            }}>
                                            {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                                                <Form
                                                    id="letterForm"
                                                    className="customProform"
                                                    noValidate="novalidate"
                                                    onSubmit={handleSubmit}>
                                                    <div className="proForm first-proform">
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">
                                                                {Resources.subject[currentLanguage]}
                                                            </label>
                                                            <div
                                                                className={'inputDev ui input' + (errors.subject ? ' has-error' : !errors.subject && touched.subject ? ' has-success' : ' ')}>
                                                                <textarea
                                                                    name="subject"
                                                                    id="subject"
                                                                    className="form-control fsadfsadsa"
                                                                    placeholder={Resources.subject[currentLanguage]}
                                                                    autoComplete="off"
                                                                    value={this.state.document.subject}
                                                                    onBlur={e => {
                                                                        handleBlur(e);
                                                                        handleChange(e);
                                                                    }}
                                                                    onChange={e => this.handleChange(e, 'subject')}>
                                                                    {touched.subject ? (<em className="pError">  { errors.subject}   </em>) : null}
                                                                </textarea>
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">
                                                                {Resources.status[currentLanguage]}
                                                            </label>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input
                                                                    type="radio"
                                                                    name="letter-status"
                                                                    defaultChecked={this.state.document.status === false ? null : 'checked'}
                                                                    value="true"
                                                                    onChange={e => this.handleChange(e, 'status')}
                                                                />
                                                                <label>
                                                                    {Resources.oppened[currentLanguage]}
                                                                </label>
                                                            </div>
                                                            <div className="ui checkbox radio radioBoxBlue">
                                                                <input
                                                                    type="radio"
                                                                    name="letter-status"
                                                                    defaultChecked={this.state.document.status === false ? 'checked' : null}
                                                                    value="false"
                                                                    onChange={e =>
                                                                        this.handleChange(e, 'status')
                                                                    }
                                                                />
                                                                <label>
                                                                    {Resources.closed[currentLanguage]}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="proForm datepickerContainer">
                                                        <div className="linebylineInput valid-input alternativeDate">
                                                            <DatePicker
                                                                title="docDate"
                                                                startDate={this.state.document.docDate}
                                                                handleChange={e =>
                                                                    this.handleChangeDate(e, 'docDate')
                                                                }
                                                            />
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">
                                                                {Resources.arrange[currentLanguage]}
                                                            </label>
                                                            <div className="ui input inputDev">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="arrange"
                                                                    readOnly
                                                                    value={this.state.document.arrange}
                                                                    name="arrange"
                                                                    placeholder={Resources.arrange[currentLanguage]}
                                                                    onBlur={e => {
                                                                        handleChange(e);
                                                                        handleBlur(e);
                                                                    }}
                                                                    onChange={e => this.handleChange(e, 'arrange')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput fullInputWidth">
                                                            <label className="control-label">
                                                                {Resources.refDoc[currentLanguage]}
                                                            </label>
                                                            <div className="ui input inputDev">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="refDoc"
                                                                    value={this.state.document.refDoc}
                                                                    name="refDoc"
                                                                    placeholder={Resources.refDoc[currentLanguage]}
                                                                    onChange={e => this.handleChange(e, 'refDoc',)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput fullInputWidth">
                                                            <label className="control-label">
                                                                {Resources.sharedSettings[currentLanguage]}
                                                            </label>
                                                            <div className="shareLinks">
                                                                <div
                                                                    className={'inputDev ui input' + (errors.sharedSettings ? ' has-error' : !errors.sharedSettings && touched.sharedSettings ? ' has-success' : ' ')}>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="sharedSettings"
                                                                        onChange={e => this.handleChange(e, 'sharedSettings')}
                                                                        value={
                                                                            this
                                                                                .state
                                                                                .document
                                                                                .sharedSettings
                                                                        }
                                                                        name="sharedSettings"
                                                                        placeholder={
                                                                            Resources
                                                                                .UrlForm[
                                                                            currentLanguage
                                                                            ]
                                                                        }
                                                                    />
                                                                    {errors.sharedSettings ? (
                                                                        <em className="pError">
                                                                            {
                                                                                errors.sharedSettings
                                                                            }
                                                                        </em>
                                                                    ) : null}
                                                                </div>
                                                                {this.state.document.sharedSettings === '' || this.state.document.sharedSettings === null ||
                                                                    this.state.document.sharedSettings === undefined ? null :
                                                                    (
                                                                        <a
                                                                            target="_blank"
                                                                            href={this.state.document.sharedSettings}>
                                                                            <span>
                                                                                {' '}{Resources.openFolder[currentLanguage]}{' '}
                                                                            </span>
                                                                        </a>
                                                                    )}
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input mix_dropdown">
                                                            <label className="control-label">
                                                                {Resources.fromCompany[currentLanguage]}
                                                            </label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown
                                                                        isClear={true}
                                                                        data={this.state.companies}
                                                                        isMulti={false}
                                                                        selectedValue={this.state.selectedFromCompany}
                                                                        handleChange={event => {
                                                                            this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact','fromContactId');
                                                                        }}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={
                                                                            errors.fromCompanyId
                                                                        }
                                                                        touched={
                                                                            touched.fromCompanyId
                                                                        }
                                                                        index="fromCompanyId"
                                                                        name="fromCompanyId"
                                                                        id="fromCompanyId"
                                                                        styles={
                                                                            CompanyDropdown
                                                                        }
                                                                        classDrop="companyName1"
                                                                    />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        isClear={true}
                                                                        isMulti={false}
                                                                        data={this.state.fromContacts
                                                                        }
                                                                        selectedValue={this.state.selectedFromContact}
                                                                        handleChange={event =>
                                                                            this.handleChangeDropDown(event, 'fromContactId', false, '', '', '', 'selectedFromContact')
                                                                        }
                                                                        onChange={
                                                                            setFieldValue
                                                                        }
                                                                        onBlur={
                                                                            setFieldTouched
                                                                        }
                                                                        error={
                                                                            errors.fromContactId
                                                                        }
                                                                        touched={
                                                                            true
                                                                        }
                                                                        index="letter-fromContactId"
                                                                        name="fromContactId"
                                                                        id="fromContactId"
                                                                        classDrop="contactName1"
                                                                        styles={
                                                                            ContactDropdown
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input mix_dropdown">
                                                            <label className="control-label">
                                                                {
                                                                    Resources
                                                                        .toCompany[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                    <Dropdown
                                                                        isClear={true}
                                                                        isMulti={false}
                                                                        data={this.state.companies}
                                                                        selectedValue={this.state.selectedToCompany}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'toCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedToCompany', 'selectedToContact','toContactId')
                                                                        }
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        error={errors.toCompanyId}
                                                                        touched={touched.toCompanyId}
                                                                        index="letter-toCompany"
                                                                        name="toCompanyId"
                                                                        id="toCompanyId"
                                                                        styles={
                                                                            CompanyDropdown
                                                                        }
                                                                        classDrop="companyName1"
                                                                    />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown
                                                                        isClear={true}
                                                                        isMulti={false}
                                                                        data={this.state.ToContacts}
                                                                        selectedValue={this.state.selectedToContact}
                                                                        handleChange={event => this.handleChangeDropDown(event, 'toContactId', false, '', '', '', 'selectedToContact')}
                                                                        onChange={setFieldValue}
                                                                        onBlur={setFieldTouched}
                                                                        touched={true}
                                                                        error={errors.toContactId}
                                                                        index="letter-toContactId"
                                                                        name="toContactId"
                                                                        id="toContactId"
                                                                        classDrop="contactName1"
                                                                        styles={ContactDropdown}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown
                                                                isClear={true}
                                                                title="discipline"
                                                                data={
                                                                    this.state
                                                                        .discplines
                                                                }
                                                                selectedValue={
                                                                    this.state
                                                                        .selectedDiscpline
                                                                }
                                                                handleChange={event =>
                                                                    this.handleChangeDropDown(
                                                                        event,
                                                                        'disciplineId',
                                                                        false,
                                                                        '',
                                                                        '',
                                                                        '',
                                                                        'selectedDiscpline',
                                                                    )
                                                                }
                                                                index="letter-discipline"
                                                            />
                                                        </div>
                                                        <div
                                                            className="linebylineInput valid-input"
                                                            style={{
                                                                position:
                                                                    'relative',
                                                            }}>
                                                            <div className="dropdownMulti letterFullWidth">
                                                                <DropdownMelcous title='replyletter'
                                                                    data={this.state.letters}
                                                                    value={this.state.selectedReplyLetter}
                                                                    onChange={setFieldValue}
                                                                    handleChange={(e) => this.replieshandleChange(e)}
                                                                    placeholder='selectedReplies'
                                                                    isMulti={true} />
                                                            </div>
                                                        </div>
                                                        <div className="letterFullWidth">
                                                            <label className="control-label">
                                                                {Resources.message[currentLanguage]}
                                                            </label>
                                                            <div className="inputDev ui input">
                                                                <TextEditor
                                                                    value={
                                                                        this
                                                                            .state
                                                                            .message
                                                                    }
                                                                    onChange={
                                                                        this
                                                                            .onChangeMessage
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        {this.props
                                                            .changeStatus ===
                                                            false ? (
                                                                <Fragment>
                                                                    <div className="linebylineInput valid-input">
                                                                        <Dropdown
                                                                            title="workFlow"
                                                                            data={
                                                                                this
                                                                                    .state
                                                                                    .WorkFlowData
                                                                            }
                                                                            handleChange={
                                                                                this
                                                                                    .workFlowhandelChangeLetter
                                                                            }
                                                                            selectedValue={
                                                                                this
                                                                                    .state
                                                                                    .selectedWorkFlow
                                                                            }
                                                                            index="ddlworkFlowId"
                                                                        />
                                                                    </div>
                                                                    <div className="linebylineInput valid-input">
                                                                        <Dropdown
                                                                            title="contact"
                                                                            data={
                                                                                this
                                                                                    .state
                                                                                    .WorkFlowContactData
                                                                            }
                                                                            name="ddlApproveTo"
                                                                            selectedValue={
                                                                                this
                                                                                    .state
                                                                                    .selectedApproveId
                                                                            }
                                                                            index="ddlApproveTo"
                                                                            handleChange={
                                                                                this
                                                                                    .toAccounthandelChangeLetter
                                                                            }
                                                                            className={
                                                                                this
                                                                                    .state
                                                                                    .toCompanyClass
                                                                            }
                                                                        />
                                                                    </div>
                                                                </Fragment>
                                                            ) : null}
                                                    </div>
                                                    <div className="slider-Btns">
                                                        {this.state
                                                            .isLoading ? (
                                                                <button className="primaryBtn-1 btn disabled">
                                                                    <div className="spinner">
                                                                        <div className="bounce1" />
                                                                        <div className="bounce2" />
                                                                        <div className="bounce3" />
                                                                    </div>
                                                                </button>
                                                            ) : (
                                                                <div className="slider-Btns">
                                                                    {this.showBtnsSaving()}
                                                                </div>
                                                            )}
                                                    </div>

                                                    {this.props.changeStatus ===
                                                        true ? (
                                                            <div className="approveDocument">
                                                                <div className="approveDocumentBTNS">
                                                                    {this.state
                                                                        .isLoading ? (
                                                                            <button className="primaryBtn-1 btn disabled">
                                                                                <div className="spinner">
                                                                                    <div className="bounce1" />
                                                                                    <div className="bounce2" />
                                                                                    <div className="bounce3" />
                                                                                </div>
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                className={
                                                                                    this
                                                                                        .state
                                                                                        .isViewMode ===
                                                                                        true
                                                                                        ? 'primaryBtn-1 btn middle__btn disNone'
                                                                                        : 'primaryBtn-1 btn middle__btn'
                                                                                }>
                                                                                {
                                                                                    Resources
                                                                                        .save[
                                                                                    currentLanguage
                                                                                    ]
                                                                                }
                                                                            </button>
                                                                        )}
                                                                    <DocumentActions
                                                                        isApproveMode={
                                                                            this
                                                                                .state
                                                                                .isApproveMode
                                                                        }
                                                                        docTypeId={
                                                                            this
                                                                                .state
                                                                                .docTypeId
                                                                        }
                                                                        docId={
                                                                            this
                                                                                .state
                                                                                .docId
                                                                        }
                                                                        projectId={
                                                                            this
                                                                                .state
                                                                                .projectId
                                                                        }
                                                                        docAlertId={
                                                                            this
                                                                                .state
                                                                                .docAlertId
                                                                        }
                                                                        previousRoute={
                                                                            this
                                                                                .state
                                                                                .previousRoute
                                                                        }
                                                                        docApprovalId={
                                                                            this
                                                                                .state
                                                                                .docApprovalId
                                                                        }
                                                                        currentArrange={
                                                                            this
                                                                                .state
                                                                                .arrange
                                                                        }
                                                                        showModal={
                                                                            this
                                                                                .props
                                                                                .showModal
                                                                        }
                                                                        showOptionPanel={
                                                                            this
                                                                                .showOptionPanel
                                                                        }
                                                                        permission={
                                                                            this
                                                                                .state
                                                                                .permission
                                                                        }
                                                                        documentName="lettertitle"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                    {this.ViewLetterReplies()}
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId > 0 &&
                                                this.state.isViewMode === false ? (
                                                    <UploadAttachmentWithProgress
                                                        changeStatus={this.props.changeStatus}
                                                        AddAttachments={839}
                                                        EditAttachments={3223}
                                                        ShowDropBox={3607}
                                                        ShowGoogleDrive={3608}
                                                        docTypeId={this.state.docTypeId}
                                                        docId={this.state.docId}
                                                        projectId={this.state.projectId}
                                                    />)
                                                : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus ===
                                                true ? (
                                                    <ViewWorkFlow
                                                        docType={
                                                            this.state.docTypeId
                                                        }
                                                        docId={this.state.docId}
                                                        projectId={
                                                            this.state.projectId
                                                        }
                                                    />
                                                ) : null}
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
        hasWorkflow: state.communication.hasWorkflow,
        projectId: state.communication.projectId,
        showModal: state.communication.showModal,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(LettersAddEdit));

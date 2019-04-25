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
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')


const validationSchema = Yup.object().shape({

    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),

    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage])
        .nullable(true),
})

class projectPicturesAddEdit extends Component {

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
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }
        this.state = {
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 2,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            fromContacts: [],
            permission: [{ name: 'sendByEmail', code: 556 }, { name: 'sendByInbox', code: 555 },
            { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 873 },
            { name: 'createTransmittal', code: 874 }, { name: 'sendToWorkFlow', code: 706 },
            { name: 'viewAttachments', code: 3301 }, { name: 'deleteAttachments', code: 3040 }],
            selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
            selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
            IsEditMode: false,
            showPopUp: false,
            IsAddModel: false,
            isLoading: false
        }

    }

    checkDocumentIsView() {
        if (this.props.changeStatus === true) {
            if (!(Config.IsAllow(551))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(551)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(551)) {
                    if (this.props.document.status !== false && Config.IsAllow(551)) {
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.document.id) {
            let ProjectPicDoc = nextProps.document
            ProjectPicDoc.docDate = moment(ProjectPicDoc.docDate).format('DD/MM/YYYY')
            ProjectPicDoc.picDate = moment(ProjectPicDoc.picDate).format('DD/MM/YYYY')
            this.setState({
                document: ProjectPicDoc,
                hasWorkflow: nextProps.hasWorkflow,
            });

            this.checkDocumentIsView();
        }
    }

    handleChange(e, field) {
        console.log(field, e);
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    componentWillMount() {
        if (docId > 0) {
            this.setState({
                IsEditMode: true,
                isLoading: true
            })
            let url = "GetProjectPictureForEdit?id=" + this.state.docId
            this.props.actions.documentForEdit(url, this.state.docTypeId, 'projectPictures').then(
                res => {

                    this.FillDrowDowns()
                }
            )


        } else {
            ///Is Add Mode
            let ProjectPicDoc = {
                projectId: projectId,
                subject: '',
                docDate: moment(),
                picDate: moment(),
                status: true,
                description: '',
                fromCompanyId: '',
                fromContactId: '',
            }
            this.setState({
                document: ProjectPicDoc
            })
            this.FillDrowDowns()
        }


    }

    FillDrowDowns = () => {

        dataservice.GetDataList('GetProjectProjectsCompaniesForList?projectId=' + projectId + '', 'companyName', 'companyId').then(
            res => {
                this.setState({
                    companies: res
                })

                if (docId !== 0) {

                    let elementID = this.state.document.fromCompanyId;
                    let SelectedValue = _.find(res, function (i) { return i.value == elementID; });
                    this.setState({
                        selectedFromCompany: SelectedValue,

                    })
                    dataservice.GetDataList('GetContactsByCompanyId?companyId=' + this.state.document.fromCompanyId + '', 'contactName', 'id').then(result => {
                        let elementIDContact = this.state.document.fromContactId;
                        let SelectedValueContact = _.find(result, function (i) { return i.value == elementIDContact });
                        this.setState({
                            fromContacts: result,
                            selectedFromContact: SelectedValueContact,
                            isLoading: false
                        });
                    });
                }
            }
        )


    }

    componentWillUnmount() {   this.props.actions.clearCashDocument();
        this.setState({
            docId: 0
        });
        this.props.actions.clearCashDocument();
    }
 
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
            this.checkDocumentIsView();
        }
    }

    handleChangeDate(e, field) {
        console.log(field, e);
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });

    }

    handleShowAction = (item) => {
        console.log(item);
        if (item.value != "0") {

            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })

            this.simpleDialog.show()
        }
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

    viewAttachments() {
        return (
            this.state.docId !== 0 ? (
                Config.IsAllow(3301) === true ?
                    <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} />
                    : null)
                : null
        )
    }

    saveAndExit = () => {
        this.props.history.push({
            pathname: '/projectPictures/' + projectId + '',
        })
    }

    showBtnsSaving() {
        let btn = null;

        if (this.state.docId === 0) {
            btn = <button className="primaryBtn-1 btn meduimBtn" type="submit" >{Resources.save[currentLanguage]}</button>;
        } else if (this.state.IsEditMode === false) {
            btn = <button className="primaryBtn-1 btn mediumBtn" onClick={this.saveAndExit} >{Resources.saveAndExit[currentLanguage]}</button>
        }
        return btn;
    }

    AddEditProjectPic = () => {
        this.setState({
            isLoading: true
        })
        let ProjectPicDoc = { ...this.state.document }
        ProjectPicDoc.docDate = moment(ProjectPicDoc.docDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        ProjectPicDoc.picDate = moment(ProjectPicDoc.picDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')

        if (this.state.docId > 0) {
            dataservice.addObject('EditProjectPicture', ProjectPicDoc).then(
                res => {
                    this.setState({
                        isLoading: false
                    })
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });
            this.saveAndExit()

        }
        else {
            dataservice.addObject('AddProjectPicture', ProjectPicDoc).then(
                res => {
                    this.setState({
                        docId: res.id,
                        isLoading: false
                    })
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });
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

        ]

        return (

            <div className="mainContainer">
                {this.state.isLoading ? <LoadingSection /> : null}
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document one__tab one_step readOnly_inputs" : "documents-stepper noTabs__document one__tab one_step"}>

                    <HeaderDocument projectName={projectName} docTitle={Resources.projectPictures[currentLanguage]}
                        moduleTitle={Resources['technicalOffice'][currentLanguage]} />


                    <div className="doc-container">
                        <div className="step-content">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    <Formik
                                        initialValues={
                                            { ...this.state.document }
                                        }
                                        validationSchema={validationSchema}
                                        enableReinitialize={true}
                                        onSubmit={(values) => {
                                            this.AddEditProjectPic();
                                        }}  >

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

                                                    <div className="linebylineInput valid-input alternativeDate">
                                                        <DatePicker title='picDate' startDate={this.state.document.picDate}
                                                            handleChange={e => this.handleChangeDate(e, 'picDate')} />
                                                    </div>

                                                    <div className="linebylineInput valid-input">
                                                        <label className="control-label">{Resources['description'][currentLanguage]}</label>
                                                        <div className="inputDev ui input">
                                                            <input autoComplete="off" className="form-control" value={this.state.document.description} name="description"
                                                                onChange={(e) => this.handleChange(e, 'description')} placeholder={Resources['description'][currentLanguage]} />
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput valid-input mix_dropdown">
                                                        <label className="control-label">{Resources.fromCompany[currentLanguage]}</label>
                                                        <div className="supervisor__company">
                                                            <div className="super_name">
                                                                <Dropdown data={this.state.fromContacts} onChange={setFieldValue} name="fromContactId"
                                                                    onBlur={setFieldTouched} error={errors.fromContactId} id="fromContactId"
                                                                    touched={touched.fromContactId} index="IR-fromContactId"
                                                                    selectedValue={this.state.selectedFromContact}
                                                                    handleChange={event => this.handleChangeDropDown(event, 'fromContactId', false, '', '', '', 'selectedFromContact')}
                                                                />
                                                            </div>

                                                            <div className="super_company">
                                                                <Dropdown data={this.state.companies} name="fromCompanyId"
                                                                    selectedValue={this.state.selectedFromCompany}
                                                                    handleChange={event => {
                                                                        this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact')
                                                                    }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="slider-Btns">
                                                    {this.showBtnsSaving()}
                                                </div>
                                                {this.state.IsEditMode === true && docId !== 0 ?
                                                    <div className="approveDocument">
                                                        <div className="approveDocumentBTNS">
                                                            <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"} onClick={this.saveNCR}>{Resources.save[currentLanguage]}</button>

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
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                                <div className="doc-pre-cycle letterFullWidth">
                                    <div>
                                        {this.state.docId !== 0 ?
                                            <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                            : null
                                        }
                                        {this.viewAttachments()}

                                        {this.props.changeStatus === true && docId !== 0 ?
                                            <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                            : null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {this.state.currentComponent}
                    </SkyLight>
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
)(withRouter(projectPicturesAddEdit))


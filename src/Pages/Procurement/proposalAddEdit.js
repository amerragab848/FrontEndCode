import React, { Component } from "react"; 
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import TextEditor from "../../Componants/OptionsPanels/TextEditor";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom"; 
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication"; 
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import moment from "moment"; 
import SkyLight from "react-skylight";
import Distribution from "../../Componants/OptionsPanels/DistributionList";
import SendToWorkflow from "../../Componants/OptionsPanels/SendWorkFlow";
import DocumentApproval from "../../Componants/OptionsPanels/wfApproval"; 
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import { toast } from "react-toastify"; 
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
  fromContactId: Yup.string().required(Resources["fromContactRequired"][currentLanguage]).nullable(true),
  toContactId: Yup.string().required(Resources["toContactRequired"][currentLanguage]).nullable(true)
});

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require("lodash");

class ProposalAddEdit extends Component {
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

        } catch {
          this.props.history.goBack();
        }
      }
      index++;
    }

    this.state = {
      isEdit:false,
      currentTitle: "sendToWorkFlow",
      showModal: false,
      isViewMode: false,
      isApproveMode: isApproveMode,
      isView: false,
      docId: docId,
      docTypeId: 21,
      projectId: projectId,
      docApprovalId: docApprovalId,
      arrange: arrange,
      document: this.props.document ? Object.assign({}, this.props.document) : {},
      companies: [],
      ToContacts: [],
      fromContacts: [],
      discplines: [],
      letters: [],
      permission: [
        { name: "sendByEmail", code: 72 },
        { name: "sendByInbox", code: 71 },
        { name: "sendTask", code: 0 },
        { name: "distributionList", code: 962 },
        { name: "createTransmittal", code: 3048 },
        { name: "sendToWorkFlow", code: 712 },
        { name: "viewAttachments", code: 3287 },
        { name: "deleteAttachments", code: 832 }
      ],
      selectedFromCompany: { label: Resources.fromCompanyRequired[currentLanguage], value: "0" },
      selectedToCompany: { label: Resources.toCompanyRequired[currentLanguage], value: "0" },
      selectedFromContact: { label: Resources.fromContactRequired[currentLanguage], value: "0" },
      selectedToContact: { label: Resources.toContactRequired[currentLanguage], value: "0" },
      message: ""
    };

    if (!Config.IsAllow(66) && !Config.IsAllow(67) && !Config.IsAllow(69)) {
      toast.warn(Resources["missingPermissions"][currentLanguage]);
      this.props.history.push({
        pathname: "/Proposal/" + projectId
      });
    }
  }

  componentDidMount() {
    var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");

    for (var i = 0; i < links.length; i++) {
      if ((i + 1) % 2 == 0) {
        links[i].classList.add("even");
      } else {
        links[i].classList.add("odd");
      }
    }
    this.checkDocumentIsView();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.document.id) {
     
      nextProps.document.docDate = nextProps.document.docDate != null ? moment(nextProps.document.docDate).format("DD/MM/YYYY") : moment();

      this.setState({
        document: nextProps.document,
        hasWorkflow: nextProps.hasWorkflow,
        message: nextProps.document.message
      });
      this.fillDropDowns(nextProps.document.id > 0 ? true : false);
      this.checkDocumentIsView();
    }

    if (this.state.showModal != nextProps.showModal) {
      this.setState({ showModal: nextProps.showModal });
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
    if (this.props.hasWorkflow !== prevProps.hasWorkflow || this.props.changeStatus !== prevProps.changeStatus ) {
      this.checkDocumentIsView();
    }

    if (this.state.showModal != this.props.showModal) {
      this.setState({ showModal: this.props.showModal });
    }
  }

  checkDocumentIsView() {
    if (this.props.changeStatus === true) {
      if (!Config.IsAllow(67)) {
        this.setState({ isViewMode: true });
      }
      if (this.state.isApproveMode != true && Config.IsAllow(67)) {
        if (this.props.hasWorkflow == false && Config.IsAllow(67)) {
          if (this.props.document.status !== false && Config.IsAllow(67)) {
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

  componentWillMount() {
    if (this.state.docId > 0) {
      
        let url = "GetCommunicationProposalForEdit?id=" + this.state.docId;
       this.props.actions.documentForEdit(url,this.state.docTypeId,"procurement");
        this.setState({
            isEdit:true
        });
    } else {
      let letter = {
        subject: "",
        id: 0,
        projectId: this.state.projectId,
        arrange: 1,
        fromCompanyId: "",
        fromContactId: "",
        toCompanyId: "",
        toContactId: "", 
        docDate: moment(),
        status: false,
        refDoc: "",
        message: ""
      };
      this.setState({ document: letter });
      this.fillDropDowns(false);
      this.props.actions.documentForAdding();
    }
  }

  fillSubDropDownInEdit(url,param,value,subField,subSelectedValue,subDatasource) {

    let action = url + "?" + param + "=" + value;
    
    dataservice.GetDataList(action, "contactName", "id").then(result => {
      if (this.props.changeStatus === true) {
        let toSubField = this.state.document[subField];
        let targetFieldSelected = _.find(result, function(i) {
          return i.value == toSubField;
        });
        console.log(targetFieldSelected);
        this.setState({
          [subSelectedValue]: targetFieldSelected,
          [subDatasource]: result
        });
      }
    });
  }

  fillDropDowns(isEdit) {
    dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId,"companyName","companyId").then(result => {
        
        if (isEdit) {
          let companyId = this.props.document.fromCompanyId;
          if (companyId) {
            this.setState({
              selectedFromCompany: { label: this.props.document.fromCompanyName, value: companyId }
            });
            this.fillSubDropDownInEdit("GetContactsByCompanyId","companyId",companyId,"fromContactId","selectedFromContact","fromContacts");
          }

          let toCompanyId = this.props.document.toCompanyId;

          if (toCompanyId) {
            this.setState({
              selectedToCompany: {label: this.props.document.toCompanyName,value: toCompanyId}
            });

            this.fillSubDropDownInEdit("GetContactsByCompanyId","companyId",toCompanyId,"toContactId","selectedToContact","ToContacts");
          }
        }
        this.setState({
          companies: [...result]
        });
      }); 
  }

  onChangeMessage = value => {
    if (value != null) {
      
        this.setState({ message: value });

      let original_document = { ...this.state.document };
      
      let updated_document = {};

      updated_document.message = value;

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

  handleChangeDate(e, field) { 
    let original_document = { ...this.state.document };

    let updated_document = {};

    updated_document[field] = e;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      document: updated_document
    });
  }

  handleChangeDropDown(event,field,isSubscrib,targetState,url,param,selectedValue,subDatasource) {

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
      let action = url + "?" + param + "=" + event.value;
      dataservice.GetDataList(action, "contactName", "id").then(result => {
        this.setState({
          [targetState]: result
        });
      });
    }
  }

  editProposal(event) {
    this.setState({
      isLoading: true
    });

    let saveDocument = { ...this.state.document };

    saveDocument.docDate = moment(saveDocument.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("EditCommunicationProposal", saveDocument).then(result => {

        this.setState({
          isLoading: false
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);

        this.props.history.push({
          pathname: "/Proposal/" + this.state.projectId
        });
      });
  }

  saveProposal(event) {
    this.setState({
      isLoading: true
    });
    let saveDocument = { ...this.state.document };

    saveDocument.docDate = moment(saveDocument.docDate, "DD/MM/YYYY").format("YYYY-MM-DD[T]HH:mm:ss.SSS");

    dataservice.addObject("AddCommunicationProposal", saveDocument).then(result => {
      this.setState({
        docId: result.id,
        isLoading: false
      });
      toast.success(Resources["operationSuccess"][currentLanguage]);
    });
  }

  saveAndExit(event) {
    this.props.history.push({
      pathname: "/Proposal/" + this.state.projectId
    });
  }

  showBtnsSaving() {
    let btn = null;

    if (this.state.docId === 0) {
      btn = (
        <button className="primaryBtn-1 btn meduimBtn" type="submit">
          {Resources.save[currentLanguage]}
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
      Config.IsAllow(3287) === true ? (
        <ViewAttachment
          docTypeId={this.state.docTypeId}
          docId={this.state.docId}
          projectId={this.state.projectId}
          deleteAttachments={832}
        />
      ) : null
    ) : null;
  }

  handleShowAction = item => {
    if (item.title == "sendToWorkFlow") {
      this.props.actions.SendingWorkFlow(true);
    }
    if (item.value != "0") { this.props.actions.showOptionPanel(false); 
      this.setState({
        currentComponent: item.value,
        currentTitle: item.title,
        showModal: true
      });
      this.simpleDialog.show();
    }
  };

  render() {
    let actions = [
      {
        title: "distributionList",
        value: (<Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />),
        label: Resources["distributionList"][currentLanguage]
      },
      {
        title: "sendToWorkFlow",
        value: (<SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />),
        label: Resources["sendToWorkFlow"][currentLanguage]
      },
      {
        title: "documentApproval",
        value: (<DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />),
        label: Resources["documentApproval"][currentLanguage]
      },
      {
        title: "documentApproval",
        value: (<DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false} projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} /> ),
        label: Resources["documentApproval"][currentLanguage]
      }
    ];

    return (
      <div className="mainContainer" id={"mainContainer"}>
        <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document" }>
          <HeaderDocument projectName={projectName} isViewMode={this.state.isViewMode} docTitle={Resources.communicationProposalAdd[currentLanguage]} moduleTitle={Resources["procurement"][currentLanguage]} />
          <div className="doc-container">
            {this.props.changeStatus == true ? (
              <header className="main__header">
                <div className="main__header--div">
                  <h2 className="zero">{Resources.goEdit[currentLanguage]}</h2>
                  <p className="doc-infohead">
                    <span> {this.state.document.refDoc}</span> - 
                    <span> {this.state.document.arrange}</span> -
                    <span>
                      {moment(this.state.document.docDate).format("DD/MM/YYYY")}
                    </span>
                  </p>
                </div>
              </header>
            ) : null}
            <div className="step-content">
              <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                  <div className="document-fields">
                    <Formik
                      initialValues={{ ...this.state.document }}
                      validationSchema={validationSchema}
                      enableReinitialize={true}
                      onSubmit={values => {
                        if ( this.props.changeStatus === true && this.state.docId > 0 ) {
                          this.editProposal();
                        } else if ( this.props.changeStatus === false && this.state.docId === 0 ) {
                          this.saveProposal();
                        } else {
                          this.saveAndExit();
                        }
                      }}>
                      {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, setFieldTouched }) => (
                        <Form id="ProposalForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                          <div className="proForm first-proform">
                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.subject[currentLanguage]}
                              </label>
                              <div className={ "inputDev ui input" + (errors.subject && touched.subject ? " has-error" : !errors.subject && touched.subject ? " has-success" : " ")}>
                                <input name="subject" className="form-control fsadfsadsa" id="subject"
                                  placeholder={ Resources.subject[currentLanguage] }
                                  autoComplete="off"
                                  value={this.state.document.subject}
                                  onBlur={e => { handleBlur(e); handleChange(e); }}
                                  onChange={e =>
                                    this.handleChange(e, "subject")
                                  }/>
                                {touched.subject ? ( <em className="pError">{errors.subject}</em> ) : null}
                              </div>
                            </div>

                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.status[currentLanguage]}
                              </label>
                              <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="proposal-status" defaultChecked={ this.state.document.status === false ? null : "checked" }
                                       value="true" onChange={e => this.handleChange(e, "status")} />
                                <label>
                                  {Resources.oppened[currentLanguage]}
                                </label>
                              </div>
                              <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="proposal-status" defaultChecked={ this.state.document.status === false ? "checked" : null }
                                       value="false" onChange={e => this.handleChange(e, "status")} />
                                <label>
                                  {Resources.closed[currentLanguage]}
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="proForm datepickerContainer">
                            <div className="linebylineInput valid-input alternativeDate">
                              <DatePicker title="docDate" startDate={this.state.document.docDate}
                                          handleChange={e => this.handleChangeDate(e, "docDate") } />
                            </div>

                          {
                              this.state.isEdit === true ? 
                              <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.arrange[currentLanguage]}
                              </label>
                              <div className="ui input inputDev">
                                <input type="text" className="form-control" id="arrange" readOnly
                                       value={this.state.document.arrange} name="arrange"
                                       placeholder={ Resources.arrange[currentLanguage]}
                                       onBlur={e => { handleChange(e); handleBlur(e); }}
                                       onChange={e => this.handleChange(e, "arrange") } />
                              </div>
                            </div>
                              : null
                          }

                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.refDoc[currentLanguage]}
                              </label>
                              <div className="ui input inputDev">
                                <input type="text" className="form-control" id="refDoc"
                                       value={this.state.document.refDoc} name="refDoc" placeholder={ Resources.refDoc[currentLanguage]}
                                       onChange={e => this.handleChange(e, "refDoc")}/>
                              </div>
                            </div>

                            <div className="linebylineInput valid-input mix_dropdown">
                              <label className="control-label">
                                {Resources.fromCompany[currentLanguage]}
                              </label>
                              <div className="supervisor__company">
                                <div className="super_name">
                                  <Dropdown data={this.state.companies} isMulti={false} selectedValue={ this.state.selectedFromCompany }
                                            handleChange={event => { 
                                             this.handleChangeDropDown( event, "fromCompanyId", true, "fromContacts", "GetContactsByCompanyId", "companyId", "selectedFromCompany", "selectedFromContact" ); }}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.fromCompanyId}
                                            touched={touched.fromCompanyId}
                                            index="fromCompanyId"
                                            name="fromCompanyId"
                                            id="fromCompanyId" />
                                </div>
                                <div className="super_company">
                                  <Dropdown isMulti={false} data={this.state.fromContacts} selectedValue={ this.state.selectedFromContact }
                                            handleChange={event => 
                                             this.handleChangeDropDown( event, "fromContactId", false, "", "", "", "selectedFromContact" )}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.fromContactId}
                                            touched={touched.fromContactId}
                                            isClear={false}
                                            index="proposal-fromContactId"
                                            name="fromContactId"
                                            id="fromContactId" />
                                </div>
                              </div>
                            </div>
                            <div className="linebylineInput valid-input mix_dropdown">
                              <label className="control-label">
                                {Resources.toCompany[currentLanguage]}
                              </label>
                              <div className="supervisor__company">
                                <div className="super_name">
                                  <Dropdown isMulti={false} data={this.state.companies} selectedValue={this.state.selectedToCompany}
                                            handleChange={event =>
                                             this.handleChangeDropDown(event,"toCompanyId",true,"ToContacts","GetContactsByCompanyId","companyId","selectedToCompany","selectedToContact")}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.toCompanyId}
                                            touched={touched.toCompanyId}
                                            index="proposal-toCompany"
                                            name="toCompanyId"
                                            id="toCompanyId" />
                                </div>
                                <div className="super_company">
                                  <Dropdown isMulti={false} data={this.state.ToContacts} selectedValue={this.state.selectedToContact}
                                            handleChange={event =>
                                             this.handleChangeDropDown( event, "toContactId", false, "", "", "", "selectedToContact")}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.toContactId}
                                            touched={touched.toContactId}
                                            index="proposal-toContactId"
                                            name="toContactId"
                                            id="toContactId"/>
                                </div>
                              </div>
                            </div>
                            <div className="letterFullWidth">
                              <label className="control-label">
                                {Resources.message[currentLanguage]}
                              </label>
                              <div className="inputDev ui input">
                                <TextEditor
                                  value={this.state.message}
                                  onChange={this.onChangeMessage}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="slider-Btns">
                            {
                            this.state.isEdit === true ? null :
                             this.state.isLoading ? (
                              <button className="primaryBtn-1 btn disabled">
                                <div className="spinner">
                                  <div className="bounce1" />
                                  <div className="bounce2" />
                                  <div className="bounce3" />
                                </div>
                              </button>
                            ) : (
                              this.showBtnsSaving()
                            )}
                          </div>
                          {this.props.changeStatus === true ? (
                            <div className="approveDocument">
                              <div className="approveDocumentBTNS">
                                {this.state.isLoading ? (
                                  <button className="primaryBtn-1 btn disabled">
                                    <div className="spinner">
                                      <div className="bounce1" />
                                      <div className="bounce2" />
                                      <div className="bounce3" />
                                    </div>
                                  </button>
                                ) : (
                                  <button className={ this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"}>
                                    {Resources.save[currentLanguage]}
                                  </button>
                                )}
                                {this.state.isApproveMode === true ? (
                                  <div>
                                    <button className="primaryBtn-1 btn " type="button"
                                            onClick={e => this.handleShowAction(actions[2]) }>
                                      {Resources.approvalModalApprove[currentLanguage]}
                                    </button>
                                    <button className="primaryBtn-2 btn middle__btn" type="button"
                                            onClick={e => this.handleShowAction(actions[3])}>
                                      { Resources.approvalModalReject[currentLanguage]}
                                    </button>
                                  </div>
                                ) : null}
                                <button type="button" className="primaryBtn-2 btn middle__btn"
                                        onClick={e => this.handleShowAction(actions[1])}>
                                  {Resources.sendToWorkFlow[currentLanguage]}
                                </button>
                                <button type="button" className="primaryBtn-2 btn" onClick={e => this.handleShowAction(actions[0])}>
                                  {Resources.distributionList[currentLanguage]}
                                </button>
                                <span className="border" />
                                <div className="document__action--menu">
                                  <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </Form>
                      )}
                    </Formik>
                  </div>
                  <div className="doc-pre-cycle letterFullWidth">
                    <div>
                      {this.state.docId > 0 && this.state.isViewMode === false ? (<UploadAttachment changeStatus={this.props.changeStatus} AddAttachments={831} EditAttachments={3246} ShowDropBox={3549} ShowGoogleDrive={3550} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId}/>) : null}
                      {this.viewAttachments()}
                      {this.props.changeStatus === true ? ( <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="largePopup largeModal " style={{ display: this.state.showModal ? "block" : "none" }}>
          <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialog = ref)} title={Resources[this.state.currentTitle][currentLanguage]}>
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
    hasWorkflow: state.communication.hasWorkflow,
    projectId: state.communication.projectId,
    showModal: state.communication.showModal
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(ProposalAddEdit));

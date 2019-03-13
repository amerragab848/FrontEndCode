import React, { Component } from "react";
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from "../../Componants/OptionsPanels/UploadAttachment";
import ViewAttachment from "../../Componants/OptionsPanels/ViewAttachmments";
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";
import ModernDatepicker from "react-modern-datepicker";
import { withRouter } from "react-router-dom";
import RichTextEditor from "react-rte";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
import moment from "moment";
import NotifiMsg from "../../Componants/publicComponants/NotifiMsg";
import * as communicationActions from "../../store/actions/communication";
import Api from "../../api";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const _ = require("lodash");

const validationSchema = Yup.object().shape({
  subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]).max(450, Resources["maxLength"][currentLanguage]),
  fromCompanyId: Yup.string().required(Resources["fromCompanyRequired"][currentLanguage]),
  toCompanyId: Yup.string().required(Resources["toCompanyRequired"][currentLanguage]),
  fromContactId: Yup.string().required(Resources["fromContactRequired"][currentLanguage]),
  toContactId: Yup.string().required(Resources["toContactRequired"][currentLanguage]),
  arrange: Yup.number(Resources["onlyNumbers"][currentLanguage]).required(Resources["arrangeRequired"][currentLanguage]),
  refDoc: Yup.string().max(450, Resources["maxLength"][currentLanguage]),
  building: Yup.string().max(450, Resources["maxLength"][currentLanguage]),
  apartment: Yup.string().max(50, Resources["maxLength"][currentLanguage]),
  sharedSettings: Yup.string().max(450, Resources["maxLength"][currentLanguage])
  //requiredDate: Yup.date().default(() => (new Date()).require(Resources['requiredDate'][currentLanguage]),
  //docDate: Yup.date().default(() => (new Date()).require(Resources['docDate'][currentLanguage]),
});

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;

class RfiAddEdit extends Component {
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
      isViewMode: false,
      isApproveMode: isApproveMode,
      addComplete: false,
      isView: false,
      docId: docId,
      docTypeId: 23,
      document: this.props.document? Object.assign({}, this.props.document) : {},
      companies: [],
      ToContacts: [],
      fromContacts: [],
      discplines: [],
      areas : [],
      locations : [],
      permission: [
        { name: "sendByEmail", code: 54 },
        { name: "sendByInbox", code: 53 },
        { name: "sendTask", code: 1 },
        { name: "distributionList", code: 956 },
        { name: "createTransmittal", code: 3042 },
        { name: "sendToWorkFlow", code: 707 },
        { name: "viewAttachments", code: 3317 },
        { name: "deleteAttachments", code: 840 }
      ], 
      
      //field
      projectId: projectId,
      fromCompanyId: null,
      toCompanyId: null,
      fromContactId: null,
      toContactId: null,
      subject: "",
      requiredDate: moment(), 
      rfi: RichTextEditor.createEmptyValue(),
      answer: RichTextEditor.createEmptyValue(),
      docDate: moment().format('DD/MM/YYYY'),
      arrange: "1",
      status: "true",
      contractId:null,
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
      // docCloseDate: moment().format('DD/MM/YYYY'),
     // answerDate: moment().format('DD/MM/YYYY'),
     // creationDate: moment().format('DD/MM/YYYY'),
    };

    if (!Config.IsAllow(75) || !Config.IsAllow(76) || !Config.IsAllow(78)) {
      this.props.history.goBack();
    }

    this.onChangeMessage = this.onChangeMessage.bind(this);
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

  componentWillReceiveProps(nextProps, prevProps) {
    if (nextProps.document && nextProps.document.id) {
      this.setState({
        document: nextProps.document,
        hasWorkflow: nextProps.hasWorkflow
      });
      this.checkDocumentIsView();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.hasWorkflow !== prevProps.hasWorkflow) {
      this.checkDocumentIsView();
    }
  }

  checkDocumentIsView() {
    if (this.props.changeStatus === true) {
      if (!Config.IsAllow(75)) {
        this.setState({ isViewMode: true });
      }
      if (this.state.isApproveMode != true && Config.IsAllow(75)) {
        if (this.props.hasWorkflow == false && Config.IsAllow(75)) {
          if (this.props.document.status == true && Config.IsAllow(75)) {
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
      let url = "GetCommunicationRfiForEdit?id=" + this.state.docId;
      this.props.actions.documentForEdit(url);

      if (Config.IsAllow(75) || Config.IsAllow(76) || Config.IsAllow(78)) {
      }
    } else {
      
        this.fillDropDowns(false);
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
    
        this.setState({
          [subSelectedValue]: targetFieldSelected,
          [subDatasource]: result
        });
      }
    });
  }

  fillDropDowns(isEdit) {
    
    //from Companies
    dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + projectId , "companyName", "companyId")
      .then(result => { 
        this.setState({
          companies: [...result]
        });
      });

      //discplines
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=discipline","title","id")
      .then(result => { 
        this.setState({
          discplines: [...result]
        });
      });
      //area
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=area","title","id")
      .then(result => { 
        this.setState({
            areas : [...result]
        });
      });
      //location
    dataservice.GetDataList("GetaccountsDefaultListForList?listType=location","title","id")
      .then(result => { 
        this.setState({
            locations: [...result]
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

  handleChangeDate(e, field) {
    let original_document = { ...this.state.document };

    let updated_document = {};

    updated_document[field] = e;

    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      document: updated_document
    });
  }

  handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource ) 
  {
    let original_document = { ...this.state.document };
    let updated_document = {};
    updated_document[field] = event.value;
    updated_document = Object.assign(original_document, updated_document);

    this.setState({
      document: updated_document,
      [selectedValue]: event
    });

    if (field == "fromContactId") {
      let url =
        "GetNextArrangeMainDoc?projectId=" +
        this.state.projectId +
        "&docType=" +
        this.state.docTypeId +
        "&companyId=" +
        this.state.document.fromCompanyId +
        "&contactId=" +
        event.value;
      this.props.actions.GetNextArrange(url);
      dataservice.GetNextArrangeMainDocument(url).then(res => {
        updated_document.arrange = res;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
          document: updated_document
        });
      });
    }

    if (isSubscrib) {
      let action = url + "?" + param + "=" + event.value;
      dataservice.GetDataList(action, "contactName", "id").then(result => {
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
  }

  saveRfi(event) {
      
    const data = {   
        projectId: projectId,
        fromCompanyId: this.state.fromCompanyId,
        toCompanyId: this.state.toCompanyId,
        fromContactId: this.state.fromContactId,
        toContactId: this.state.toContactId,
        subject: this.state.subject,
        requiredDate: this.state.requiredDate, 
        rfi: this.state.rfi,
        answer: this.state.answer,
        docDate:this.state.docDate,
        arrange: this.state.arrange,
        status: this.state.status,
        creationDate: this.state.creationDate,
        pcoId: this.state.pcoId,
        docCloseDate: this.state.docCloseDate,
        answerDate: this.state.answerDate,
        refDoc: this.state.refDoc,
        docLocationId: this.state.docLocationId,
        cycleNo: this.state.cycleNo,
        parentId: this.state.parentId,
        disciplineId: this.state.disciplineId,
        area: this.state.area,
        location: this.state.location,
        building: this.state.building,
        apartment: this.state.apartment,
        contractId: this.state.contractId, 
        sharedSettings: this.state.sharedSettings
    }
 
    dataservice.addObject("AddCommunicationRfi", data).then(result => {
      this.setState({
        docId: result != null ? result.id : 0
      });
    });
  }

  saveAndExit(event) {
    let letter = { ...this.state.document };
    console.log(letter);
    this.props.history.push({
      pathname: "/Letters",
      search: "?projectId=" + this.state.projectId
    });
  }

  showBtnsSaving() {
    let btn = null;

    if (this.state.docId === 0) {
      btn = (
        <button className="primaryBtn-1 btn meduimBtn" type="submit" onClick={e => this.saveRfi(e)}>
          {Resources.save[currentLanguage]}
        </button>
      );
    } else if (this.state.docId > 0 && this.props.changeStatus === false) {
      btn = (<button className="primaryBtn-1 btn mediumBtn" type="submit" onClick={e => this.saveAndExit(e)}>
          {Resources.saveAndExit[currentLanguage]}
        </button>
      );
    }
    return btn;
  }

  viewAttachments() {
    return this.state.docId > 0 ? (
      Config.IsAllow(3318) === true ? (
        <ViewAttachment
          docTypeId={this.state.docTypeId}
          docId={this.state.docId}
          projectId={this.state.projectId}
          deleteAttachments={840}
        />
      ) : null
    ) : null;
  }

  dropDownHandler(e,field){
    if(field === "fromCompanyId"){
        dataservice.GetDataList("GetContactsByCompanyId?companyId=" +e.value ,"contactName", "id").then(result => {
            this.setState({
              fromContacts:result,
              fromCompanyId : e.value
            });
        });
    }else if(field === "fromContact"){ 
          dataservice.GetNextArrangeMainDocument("GetNextArrangeMainDoc?projectId=" +projectId +"&docType="+this.state.docTypeId+
                                  "&companyId="+this.state.fromCompanyId+"&contactId="+e.value).then(result => {
            this.setState({
              arrange : result,
              fromContactId:e.value
            });
        });
    }else if(field === "toCompany"){ 
          dataservice.GetDataList("GetContactsByCompanyId?companyId="+ e.value ,"contactName", "id").then(result => {
            this.setState({
                ToContacts:result,
                toCompanyId : e.value  
            });
        });
    }
  }


  onChangeMessage = (value,field) => {

    let isEmpty = !value.getEditorState().getCurrentContent().hasText();
    
    if (isEmpty === false) { 

        if (value.toString('markdown').length > 1) {  

            let original_document = { ...this.state };

            original_document[field]= value.toString('markdown').replace(/\n/g, "");
            
            this.setState(original_document);  
        } 
    } 
};

  render() {
    return (
      <div className="mainContainer">
        {this.state.addComplete === true ? (<NotifiMsg showNotify={this.state.addComplete} IsSuccess={true} Msg={Resources["smartSentAccountingMessage"][currentLanguage].successTitle} />) : null}
        <div className={ this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document" } >
          <div className="submittalHead">
            <h2 className="zero">
              {Resources.requestInformation[currentLanguage]}
              <span>{projectName.replace(/_/gi, " ")} · Communication</span>
            </h2>
            <div className="SubmittalHeadClose">
              <svg
                width="56px"
                height="56px"
                viewBox="0 0 56 56"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g
                  id="Symbols"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g
                    id="Components/Sections/Doc-page/Title/Base"
                    transform="translate(-1286.000000, -24.000000)"
                  >
                    <g id="Group-2">
                      <g
                        id="Action-icons/Close/Circulated/56px/Light-grey_Normal"
                        transform="translate(1286.000000, 24.000000)"
                      >
                        <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                          <g id="Group">
                            <circle
                              id="Oval"
                              fill="#E9ECF0"
                              cx="28"
                              cy="28"
                              r="28"
                            />
                            <path
                              d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z"
                              id="Combined-Shape"
                              fill="#858D9E"
                              fillRule="nonzero"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <div className="doc-container">
            {this.props.changeStatus == true ? (
              <header className="main__header">
                <div className="main__header--div">
                  <h2 className="zero">{Resources.goEdit[currentLanguage]}</h2>
                  <p className="doc-infohead">
                    <span> {this.state.refDoc}</span> -
                    <span> {this.state.arrange}</span> -
                    <span>
                      {moment(this.state.docDate).format("DD/MM/YYYY")}
                    </span>
                  </p>
                </div>
              </header>
            ) : null}
            <div className="step-content">
              <div id="step1" className="step-content-body">
                <div className="subiTabsContent">
                  <div className="document-fields">
                    <Formik initialValues={{ ...this.state.document }} validationSchema={validationSchema} onReset={values => {}} >
                      {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue}) => (
                        <Form id="letterForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit} >
                          <div className="proForm first-proform">
                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.subject[currentLanguage]}
                              </label>
                              <div className={ "inputDev ui input" + (errors.subject && touched.subject ? " has-error" : !errors.subject && touched.subject ? " has-success" : " ")} >
                                <input name="subject" className="form-control fsadfsadsa" id="subject" placeholder={ Resources.subject[currentLanguage] }
                                  autoComplete="off" value={this.state.subject} onChange={(event) => this.setState({subject: event.target.value})} />
                                {errors.subject && touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.status[currentLanguage]}
                              </label>
                              <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" id="true"
                                  name="rfi-status" defaultChecked={this.state.status ===  "true" }
                                  value="true" 
                                  onChange={(e) => this.setState({ status: e.target.value })} />
                                <label>
                                  {Resources.oppened[currentLanguage]}
                                </label>
                              </div>
                              <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" id="false" name="rfi-status" defaultChecked={this.state.status === "false" }
                                  value="false"
                                  onChange={(e) => this.setState({ status: e.target.value })} />
                                <label>
                                  {Resources.closed[currentLanguage]}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="proForm datepickerContainer">
                            <div className="linebylineInput valid-input">
                              <div className="inputDev ui input input-group date NormalInputDate">
                                <div className="customDatepicker fillter-status fillter-item-c ">
                                  <div className="proForm datepickerContainer">
                                    <label className="control-label">
                                      {Resources.docDate[currentLanguage]}
                                    </label>
                                    <div className="linebylineInput">
                                      <div className="inputDev ui input input-group date NormalInputDate">
                                        <ModernDatepicker date={this.state.docDate} format={'DD/MM/YYYY'} showBorder
                                          onChange={(value) => this.setState({ docDate: value })} 
                                          placeholder={"Select a date"} />
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
                                    <label className="control-label">
                                      {Resources.requiredDate[currentLanguage]}
                                    </label>
                                    <div className="linebylineInput">
                                      <div className="inputDev ui input input-group date NormalInputDate">
                                        <ModernDatepicker date={ this.state.requiredDate } format={'DD/MM/YYYY'} showBorder placeholder={"Select a date"}
                                         onChange={(value) => this.setState({ requiredDate: value})}/>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.arrange[currentLanguage]}
                              </label>
                              <div className={ "ui input inputDev "}>
                                <input type="text" className="form-control" id="arrange" value={this.state.arrange} name="arrange" placeholder={ Resources.arrange[currentLanguage]}
                                     onChange={(e) => this.setState({ arrange: e.target.value })}/>
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.refDoc[currentLanguage]}
                              </label>
                              <div className={ errors.subject && touched.subject ? "ui input inputDev has-error" : "ui input inputDev"}>
                                <input type="text" className="form-control" id="refDoc" value={this.state.refDoc} name="refDoc"
                                  placeholder={ Resources.refDoc[currentLanguage] }  onChange={(e) => this.setState({ refDoc: e.target.value })}/>
                                {errors.refDoc && touched.refDoc ? (
                                  <em className="pError">{errors.refDoc}</em>
                                ) : null}
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <div className="ui input inputDev fillter-item-c">
                                 <Dropdown title="fromCompany" data={this.state.companies} name="fromCompanyId"
                                       value ={this.state.fromCompanyId}
                                       handleChange={value => this.dropDownHandler(value,"fromCompanyId")}/> 
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <div className="ui input inputDev fillter-item-c">
                                 <Dropdown title="fromContact" data={this.state.fromContacts} name="fromContact"
                                      value ={this.state.fromContactId}
                                      handleChange={value => this.dropDownHandler(value,"fromContact")}/> 
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <div className="ui input inputDev fillter-item-c">
                                 <Dropdown title="toCompany" data={this.state.companies} name="toCompany"
                                       value ={this.state.toCompanyId}
                                       handleChange={value => this.dropDownHandler(value,"toCompany")}/> 
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <div className="ui input inputDev fillter-item-c">
                                 <Dropdown title="attention" data={this.state.ToContacts} name="attention"
                                       value ={this.state.toContactId}
                                       handleChange={(event) => this.setState({toContactId: event.value})}/> 
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <div className="ui input inputDev fillter-item-c">
                                 <Dropdown title="area" data={this.state.areas} name="areas"
                                       value ={this.state.fromContactId}
                                       handleChange={(event) => this.setState({area: event.value})}/> 
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <div className="ui input inputDev fillter-item-c">
                                 <Dropdown title="location" data={this.state.locations} name="locations"
                                       value ={this.state.location}
                                       handleChange={(event) => this.setState({location: event.value})}/> 
                              </div>
                            </div>
                          
                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.Building[currentLanguage]}
                              </label>
                              <div className={ "inputDev ui input" + (errors.Building && touched.Building ? " has-error" : !errors.Building && touched.Building ? " has-success": " ")}>
                                <input name="Building" className="form-control fsadfsadsa" id="Building" placeholder={Resources.Building[currentLanguage]}
                                  autoComplete="off"
                                  value={this.state.building} 
                                  onChange={(e) => this.setState({ building: e.target.value })} />
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.apartmentNumber[currentLanguage]}
                              </label>
                              <div className={ "inputDev ui input" + (errors.apartment && touched.apartment ? " has-error" : !errors.apartment && touched.apartment ? " has-success" : " ")}>
                                <input name="apartmentNumber" className="form-control fsadfsadsa" id="apartmentNumber" placeholder={ Resources.apartmentNumber[currentLanguage]}
                                  autoComplete="off"
                                  value={this.state.apartment}
                                  onChange={(e) => this.setState({ apartment: e.target.value })} />
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <div className="ui input inputDev fillter-item-c">
                                 <Dropdown title="discipline" data={this.state.discplines} name="discplines"
                                       value ={this.state.disciplineId}
                                       handleChange={(event) => this.setState({disciplineId: event.value})}/> 
                              </div>
                            </div> 
                             <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.message[currentLanguage]}
                              </label>
                              <div className="inputDev ui input">
                                <RichTextEditor
                                  value={this.state.rfi}
                                  onChange={value => this.onChangeMessage(value,"rfi")}/>
                              </div>
                            </div>
                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.message[currentLanguage]}
                              </label>
                              <div className="inputDev ui input">
                                <RichTextEditor
                                  value={this.state.answer}
                                  onChange={value => this.onChangeMessage(value,"answer")}
                                />
                              </div>
                            </div>

                            <div className="linebylineInput valid-input">
                              <label className="control-label">
                                {Resources.sharedSettings[currentLanguage]}
                              </label>
                              <div className="shareLinks">
                                <div className="inputDev ui input">
                                  <input type="text" className="form-control" id="sharedSettings"
                                    value={this.state.sharedSettings}
                                    name="sharedSettings"
                                    onChange={(event) => this.setState({sharedSettings: event.target.value})}
                                    placeholder={ Resources.sharedSettings[currentLanguage]}/>
                                </div>
                                <a  href={this.state.sharedSettings}  target="_blank">
                                  <span>
                                    {Resources["openFolder"][currentLanguage]}
                                  </span>
                                </a>
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
                      {this.state.docId > 0 ? (
                        <UploadAttachment
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
                </div>
              </div>
            </div>
            {this.props.changeStatus === true ? (
              <div className="approveDocument">
                <h2 className="zero">ACTIONS</h2>
                <div className="approveDocumentBTNS">
                  <button
                    className={
                      this.state.isViewMode === true
                        ? "primaryBtn-1 btn middle__btn disNone"
                        : "primaryBtn-1 btn middle__btn"
                    }
                    onClick={e => this.editLetter(e)}
                  >
                    {Resources.save[currentLanguage]}
                  </button>
                  {this.state.isApproveMode === true ? (
                    <button className="primaryBtn-1 btn ">APPROVE</button>
                  ) : null}
                  <button className="primaryBtn-2 btn middle__btn">
                    TO WORKFLOW
                  </button>
                  <button className="primaryBtn-2 btn">TO DIST. LIST</button>
                  <span className="border" />
                  <div className="document__action--menu">
                    {/* <OptionContainer
                      permission={this.state.permission}
                      docTypeId={this.state.docTypeId}
                      docId={this.state.docId}
                      projectId={this.state.projectId}
                    /> */}
                  </div>
                </div>
              </div>
            ) : null}
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
    hasWorkflow: state.communication.hasWorkflow
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
)(withRouter(RfiAddEdit));

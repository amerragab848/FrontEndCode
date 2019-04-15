import React, { Component } from "react"; 
import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json"; 
import ModernDatepicker from 'react-modern-datepicker';
import { withRouter } from "react-router-dom"; 
import RichTextEditor from 'react-rte'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";   
import SkyLight from 'react-skylight';
import * as communicationActions from '../../store/actions/communication'; 
import Distribution from '../../Componants/OptionsPanels/DistributionList'
import SendToWorkflow from '../../Componants/OptionsPanels/SendWorkFlow'
import DocumentApproval from '../../Componants/OptionsPanels/wfApproval'

import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
    refDoc: Yup.string().max(450,Resources['maxLength'][currentLanguage]),  
    fromContactId: Yup.string().required(Resources['fromContactRequired'][currentLanguage]).nullable(true), 
    toContactId: Yup.string().required(Resources['toContactRequired'][currentLanguage]).nullable(true)
})

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;

const _ = require('lodash');

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
            message: RichTextEditor.createEmptyValue(), 
            replyMessage: RichTextEditor.createEmptyValue()
        }

        if (!Config.IsAllow(75) || !Config.IsAllow(76) || !Config.IsAllow(78)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);

            this.props.history.push("/Rfi/" + this.state.projectId);
        } 

        this.onChangeMessage = this.onChangeMessage.bind(this);
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

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.document && nextProps.document.id) {
          
          nextProps.document.docDate = moment(nextProps.document.docDate).format('DD/MM/YYYY');
          nextProps.document.requiredDate = moment(nextProps.document.requiredDate).format('DD/MM/YYYY');
          
            this.setState({
                document: nextProps.document,
                hasWorkflow: nextProps.hasWorkflow,
                message:RichTextEditor.createValueFromString(nextProps.document.rfi, 'html'),
                replyMessage:RichTextEditor.createValueFromString(nextProps.document.answer, 'html'),
            }); 

            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
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
            if (!(Config.IsAllow(49))) {
                this.setState({ isViewMode: true });
            }
            if (this.state.isApproveMode != true && Config.IsAllow(49)) {
                if (this.props.hasWorkflow == false && Config.IsAllow(49)) {
                    if (this.props.document.status == true && Config.IsAllow(49)) {
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
        let url = "GetCommunicationRfiForEdit?id=" + this.state.docId;
        this.props.actions.documentForEdit(url);
  
        if (Config.IsAllow(75) || Config.IsAllow(76) || Config.IsAllow(78)) {
        }
      } else {
        const rfiDocument = {
          //field
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
      dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + projectId,"companyName","companyId").then(result => {
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
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
  
      //discplines
      dataservice.GetDataList("GetaccountsDefaultListForList?listType=discipline","title","id").then(result => {
        if (isEdit) {
          
          let disciplineId = this.props.document.disciplineId;

          if (disciplineId) {

            let disciplineName =result.find(i => i.value === disciplineId);
 
              this.setState({
                selectedDiscpline: { label: disciplineName.label, value: disciplineId }
              });
          } 
       }
          this.setState({
            discplines: [...result]
          });
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
      //area
      dataservice.GetDataList("GetaccountsDefaultListForList?listType=area", "title", "id").then(result => {
        if (isEdit) {
          
          let areaId = this.props.document.area;

          if (areaId) {

            let areaIdName =result.find(i => i.value === parseInt(areaId));
 
              this.setState({
                selectedArea: { label: areaIdName.label, value: areaId}
              });
          } 
       }
          this.setState({
            areas: [...result]
          });
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
      //location
      dataservice.GetDataList("GetaccountsDefaultListForList?listType=location","title","id").then(result => {
        if (isEdit) {
          
          let locationId = this.props.document.location;

          if (locationId) {

            let locationName =result.find(i => i.value === parseInt(locationId));
 
              this.setState({
                selectedLocation: { label: locationName.label, value: locationId}
              });
          } 
       }
          this.setState({
            locations: [...result]
          });
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
    }

    onChangeMessage = (value,field) => {
        let isEmpty = !value.getEditorState().getCurrentContent().hasText();
        if (isEmpty === false) {

          field === "rfi" ? this.setState({ message: value }) : this.setState({ replyMessage: value });

            if (value.toString('markdown').length > 1) {

                let original_document = { ...this.state.document };

                let updated_document = {};

                updated_document[field] = value.toString('markdown');

                updated_document = Object.assign(original_document, updated_document);

                this.setState({
                    document: updated_document
                });
            }

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

        if (field == "fromContactId") {
            let url = "GetNextArrangeMainDoc?projectId=" + this.state.projectId + "&docType=" + this.state.docTypeId + "&companyId=" + this.state.document.fromCompanyId + "&contactId=" + event.value;
            this.props.actions.GetNextArrange(url);
            dataservice.GetNextArrangeMainDocument(url).then(res => {
                updated_document.arrange = res;
                updated_document = Object.assign(original_document, updated_document);

                this.setState({
                    document: updated_document
                });
            }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
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

        saveDocument.docDate = moment(saveDocument.docDate,'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate,'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('EditCommunicationRfi', saveDocument).then(result => {
            this.setState({
                isLoading: true
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

            this.props.history.push("/Rfi/" + this.state.projectId);
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
    }

    saveRfi(event) {
        let saveDocument = { ...this.state.document };

        saveDocument.docDate = moment(saveDocument.docDate,'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        saveDocument.requiredDate = moment(saveDocument.requiredDate,'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS');

        dataservice.addObject('AddCommunicationRfi', saveDocument).then(result => {
            this.setState({
                docId: result.id
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => toast.error(Resources["failError"][currentLanguage]));
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
        return (
            this.state.docId > 0 ? (Config.IsAllow(3317) === true ? <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} deleteAttachments={840} /> : null) : null
        )
    }

    handleShowAction = (item) => { 

        if (item.value != "0") { 
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })

            this.simpleDialog.show()
        }
    }
    render() {
        let actions = [
            { title: "distributionList", value: <Distribution docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["distributionList"][currentLanguage] },
            { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />, label: Resources["sendToWorkFlow"][currentLanguage] },
            { title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={true}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]
            },{ title: "documentApproval", value: <DocumentApproval docTypeId={this.state.docTypeId} docId={this.state.docId} approvalStatus={false}
                    projectId={this.state.projectId} docApprovalId={this.state.docApprovalId} currentArrange={this.state.arrange} />, label: Resources["documentApproval"][currentLanguage]}];

   return (
            <div className="mainContainer">
                <div className={this.state.isViewMode === true ? "documents-stepper noTabs__document readOnly_inputs" : "documents-stepper noTabs__document"}>
                    <div className="submittalHead">
                        <h2 className="zero">{Resources.communicationRFI[currentLanguage]}
                            <span>{projectName.replace(/_/gi, ' ')} · Communication</span>
                        </h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                    <g id="Group">
                                                        <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                        <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
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
                        {
                            this.props.changeStatus == true ?
                                <header className="main__header">
                                    <div className="main__header--div">
                                        <h2 className="zero">
                                            {Resources.goEdit[currentLanguage]}
                                        </h2>
                                        <p className="doc-infohead"><span> {this.state.document.refDoc}</span> - <span> {this.state.document.arrange}</span> - <span>{moment(this.state.document.docDate).format('DD/MM/YYYY')}</span></p>
                                    </div>
                                </header> : null
                        }
                        <div className="step-content"> 
                            <div id="step1" className="step-content-body">
                                <div className="subiTabsContent">
                                    <div className="document-fields">
                                        <Formik initialValues={{ ...this.state.document }}
                                            validationSchema={validationSchema}
                                            onSubmit={(values) => {
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
                                                                    autoComplete='off' value={this.state.document.subject}
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
                                                                                                  placeholder={'Select a date'}/>
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
                                                                    <Dropdown  isMulti={false} data={this.state.fromContacts}
                                                                               selectedValue={this.state.selectedFromContact}
                                                                               handleChange={event => this.handleChangeDropDown(event, 'fromContactId', false, '', '', '', 'selectedFromContact')}
                                                                               onChange={setFieldValue}
                                                                               onBlur={setFieldTouched}
                                                                               error={errors.fromContactId}
                                                                               touched={touched.fromContactId} 
                                                                               name="fromContactId"
                                                                               id="fromContactId" />
                                                                </div>
                                                                <div className="super_company">
                                                                    <Dropdown  data={this.state.companies} isMulti={false}
                                                                               selectedValue={this.state.selectedFromCompany}
                                                                               handleChange={event => { this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId', 'selectedFromCompany', 'selectedFromContact') }}
                                                                               onChange={setFieldValue}
                                                                               onBlur={setFieldTouched}
                                                                               error={errors.fromCompanyId}
                                                                               touched={touched.fromCompanyId}
                                                                               name="fromCompanyId"
                                                                               id="fromCompanyId" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input mix_dropdown"> 
                                                            <label className="control-label">{Resources.toCompany[currentLanguage]}</label>
                                                            <div className="supervisor__company">
                                                                <div className="super_name">
                                                                <Dropdown  isMulti={false} data={this.state.ToContacts}
                                                                           selectedValue={this.state.selectedToContact}
                                                                           handleChange={event => this.handleChangeDropDown(event, 'toContactId', false, '', '', '', 'selectedToContact')}
                                                                           onChange={setFieldValue}
                                                                           onBlur={setFieldTouched}
                                                                           error={errors.toContactId}
                                                                           touched={touched.toContactId} 
                                                                           name="toContactId"
                                                                           id="toContactId" />
                                                                </div>
                                                                <div className="super_company"> 
                                                                <Dropdown  isMulti={false} data={this.state.companies}
                                                                       selectedValue={this.state.selectedToCompany}
                                                                       handleChange={event => this.handleChangeDropDown(event, 'toCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId', 'selectedToCompany', 'selectedToContact')} 
                                                                       onChange={setFieldValue}
                                                                       onBlur={setFieldTouched}
                                                                       error={errors.toCompanyId}
                                                                       touched={touched.toCompanyId}
                                                                       name="toCompanyId"
                                                                       id="toCompanyId" />
                                                                </div>
                                                            </div>
                                                        </div> 
                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown title="area" data={this.state.areas} 
                                                                      selectedValue={this.state.selectedArea}
                                                                      handleChange={event => this.handleChangeDropDown(event, 'area', false, '', '', '', 'selectedArea')}/>
                                                        </div> 
                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown title="location" data={this.state.locations} 
                                                                      selectedValue={this.state.selectedLocation}
                                                                      handleChange={event => this.handleChangeDropDown(event, 'location', false, '', '', '', 'selectedLocation')}/>
                                                        </div> 
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.Building[currentLanguage]}</label>
                                                            <div className={"inputDev ui input" + (errors.Building && touched.Building ? (" has-error") : !errors.Building && touched.Building ? (" has-success") : " ")} >
                                                                <input name='Building' className="form-control fsadfsadsa" id="Building"
                                                                       placeholder={Resources.Building[currentLanguage]}
                                                                       autoComplete='off' value={this.state.document.building}
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
                                                                       autoComplete='off' value={this.state.document.apartment}
                                                                       onBlur={(e) => { handleBlur(e); handleChange(e) }}
                                                                       onChange={(e) => this.handleChange(e, 'apartment')} />
                                                                {errors.apartmentNumber && touched.apartmentNumber ? (<em className="pError">{errors.apartmentNumber}</em>) : null}
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <Dropdown title="discipline" data={this.state.discplines} 
                                                                      selectedValue={this.state.selectedDiscpline}
                                                                      handleChange={event => this.handleChangeDropDown(event, 'disciplineId', false, '', '', '', 'selectedDiscpline')}/>
                                                        </div>  
                                                        
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.sharedSettings[currentLanguage]}</label>
                                                            <div className="shareLinks">
                                                                <div className="inputDev ui input">
                                                                    <input type="text" className="form-control" id="sharedSettings"
                                                                           onChange={(e) => this.handleChange(e, 'sharedSettings')}
                                                                           value={this.state.document.sharedSettings} name="sharedSettings"
                                                                           placeholder={Resources.sharedSettings[currentLanguage]} />
                                                                </div>
                                                                <a target="_blank" href={this.state.document.sharedSettings}><span>{Resources.openFolder[currentLanguage]}</span></a>
                                                            </div>
                                                        </div> 
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.message[currentLanguage]}</label>
                                                            <div className="inputDev ui input">
                                                                <RichTextEditor value={this.state.message} onChange={event => this.onChangeMessage(event,"rfi")} />
                                                            </div>
                                                        </div>
                                                        <div className="linebylineInput valid-input">
                                                            <label className="control-label">{Resources.replyMessage[currentLanguage]}</label>
                                                            <div className="inputDev ui input">
                                                                <RichTextEditor value={this.state.replyMessage} onChange={event => this.onChangeMessage(event,"answer")} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="slider-Btns">
                                                        {this.showBtnsSaving()}
                                                    </div>
                                                    {
                                                        this.props.changeStatus === true ?
                                                            <div className="approveDocument"> 
                                                                <div className="approveDocumentBTNS">
                                                                <button className={this.state.isViewMode === true ? "primaryBtn-1 btn middle__btn disNone" : "primaryBtn-1 btn middle__btn"}>{Resources.save[currentLanguage]}</button>
                                                                    {this.state.isApproveMode === true ?
                                                                        <div >
                                                                            <button className="primaryBtn-1 btn " type="button"  onClick={(e) => this.handleShowAction(actions[2])} >{Resources.approvalModalApprove[currentLanguage]}</button>
                                                                            <button className="primaryBtn-2 btn middle__btn"  type="button" onClick={(e) => this.handleShowAction(actions[3])} >{Resources.approvalModalReject[currentLanguage]}</button>
                                                                        </div> : null
                                                                    }
                                                                    <button type="button" className="primaryBtn-2 btn middle__btn" onClick={(e) => this.handleShowAction(actions[1])}>{Resources.sendToWorkFlow[currentLanguage]}</button>
                                                                   <button  type="button"     className="primaryBtn-2 btn" onClick={(e) => this.handleShowAction(actions[0])}>{Resources.distributionList[currentLanguage]}</button>
                                                                    <span className="border"></span>
                                                                    <div className="document__action--menu">
                                                                        <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                                    </div>
                                                                </div>
                                                            </div> : null
                                                    }
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div>
                                            {this.state.docId > 0 ? <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null}
                                            {this.viewAttachments()}
                                            {this.props.changeStatus === true ? <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} /> : null }
                                        </div>
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(RfiAddEdit))
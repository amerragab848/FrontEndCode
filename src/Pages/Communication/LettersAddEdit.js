import React, { Component } from "react";

import OptionContainer from "../../Componants/OptionsPanels/OptionContainer";
import { Formik, Form } from 'formik';
import dataservice from "../../Dataservice";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";

import ModernDatepicker from 'react-modern-datepicker';
import { withRouter } from "react-router-dom";
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';

import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

let docId = 0;
let projectId = 0;
let projectName = 0;
const _ = require('lodash')
class LettersAddEdit extends Component {
    constructor(props) {
        super(props);

        // console.log(this.props.location.search);
        const query = new URLSearchParams(this.props.location.search);
        let index = 0;
        for (let param of query.entries()) {
            if (index == 0 ) {  
              try{
              let obj= JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));
              
                docId = obj.docId;
                projectId=obj.projectId; 
                projectName=obj.projectName;
             }
             catch{
               this.props.history.goBack();
             }
          } 
            index++;
        }
        this.state = {
            isView: false,
            hasWorkFlow:false,
            docId: docId,
            docTypeId: 19,
            projectId: projectId,
            document: this.props.document ? Object.assign({}, this.props.document) : {},
            companies: [],
            ToContacts: [],
            fromContacts: [],
            discplines: [],
            letters: [],
            permission: [{ name: 'sendByEmail', code: 54 }, { name: 'sendByInbox', code: 53 },
                        { name: 'sendTask', code: 1 }, { name: 'distributionList', code: 956 },
                        { name: 'createTransmittal', code: 3042 }, { name: 'sendToWorkFlow', code: 707 }],
            selectedFromCompany: {label: Resources.fromCompanyRequired[currentLanguage],value: "0"},
            selectedToCompany: {label: Resources.toCompanyRequired[currentLanguage],value: "0"},
            selectedFromContact: {label: Resources.fromContactRequired[currentLanguage],value: "0"},
            selectedToContact: {label: Resources.toContactRequired[currentLanguage],value: "0"}, 
            selectedDiscpline: {label: Resources.disciplineRequired[currentLanguage],value: "0"}, 
            selectedReplyLetter: {label: Resources.replyletter[currentLanguage],value: "0"}
          }
    }
    componentDidMount() {
      //componentWillUnmount
        // alert('in lettersAddEdit page componentDidMount');
    };

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.document && nextProps.document.id) {
            this.setState({ document: nextProps.document }); 
            this.fillDropDowns(nextProps.document.id > 0 ? true : false);
        } 
    };

    componentWillMount() { 
        //this.props.actions.documentForAdding(letter);  
        
        if (this.state.docId > 0) {
            let url = "GetLettersById?id=" + this.state.docId
            this.props.actions.documentForEdit(url);
           
          if (Config.IsAllow(48) || Config.IsAllow(49) || Config.IsAllow(51)) {
            
          }
        } else {
            let letter = {
                subject: ' new ',
                id: 0,
                projectId: this.state.projectId,
                arrange: '',
                fromCompanyId: '',
                fromContactId: '',
                toCompanyId: '',
                toContactId: '',
                replayId: '',
                docDate: '',
                status: 'false',
                disciplineId: '',
                refDoc: '',
                sharedSettings: '',
                message: ''
            };
            this.setState({ document: letter });
            this.fillDropDowns(false);
        } 
    };

    fillDropDowns(isEdit){ 
        dataservice.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, 'companyName', 'companyId').then(result => {
              let selectedCompany={}; 
              let selectedToCompany={}; 
              if (isEdit) { 
                 let companyId = this.props.document.fromCompanyId; 
                 if (companyId) {  
                    this.setState({  
                        selectedFromCompany: {label:this.props.document.fromCompanyName ,value: companyId}  
                    });
                 }
                
                let toCompanyId = this.props.document.toCompanyId; 
                 if (toCompanyId) {  
                    this.setState({  
                        selectedToCompany: {label:this.props.document.toCompanyName ,value: toCompanyId}  
                    });
                 }
              }    
              this.setState({
                  companies: [...result]  
              });
        });
 
        dataservice.GetDataList("GetaccountsDefaultListForList?listType=discipline", 'title', 'id').then(result => {
            if (isEdit) { 
                   let disciplineId = this.props.document.disciplineId; 
                   let discpline={};
                   if (disciplineId) { 
                      discpline = _.find(result, function(i) { return i.value == disciplineId; }); 
             
                      this.setState({  
                          selectedDiscpline: discpline  
                      });
                   }
            }   
            this.setState({
                discplines: [...result]
            });
        }); 

        dataservice.GetDataList("GetLettersByProjectId?projectId=" + this.state.projectId + "&pageNumber=0&pageSize=100", 'subject', 'id').then(result => {
                if (isEdit) { 
                       let replyId = this.props.document.replyId; 
                       let replyLetter={};
                       if (replyId) { 
                         replyLetter = _.find(result, function(i) { return i.value == replyId; });  
                            this.setState({  
                                [replyLetter]: replyLetter  
                            });
                       }
                }  
            this.setState({
                letters: [...result]
            });
        });

    }

    handleChange(e, field) {
        console.log(field,e);
        //this.props.actions.updateField('subject',e.target.value);

        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    handleChangeDate(e, field) {
        console.log(field,e);
        //this.props.actions.updateField('subject',e.target.value);

        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    handleChangeDropDown(event, field, isSubscrib, targetState, url, param,selectedValue,subSelectedValue) {
      //event, 'toCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId'
        //console.log(event.value);
        //this.props.actions.updateField('subject',e.target.value);
        // selectedCompany = _.find(result, function(i) { return i.value == companyId; }); 
                   
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);
        console.log(selectedValue);
        this.setState({
            document: updated_document,
            [selectedValue]: event  
        });
 
        if (isSubscrib) {
            let action = url + "?" + param + "=" + event.value
            dataservice.GetDataList(action, 'contactName', 'id').then(
                result => {
                     // let toCompanyId = this.props.document.toCompanyId; 
                     // if (toCompanyId) {  
                     //    this.setState({  
                     //        [subSelectedValue]: {label:this.props.document.toCompanyName ,value: toCompanyId}  
                     //    });
                     // }
                    this.setState({
                        [targetState]: result
                    });
            });
        }
    }

    saveLetter(event) {
        dataservice.addObject('AddLetters', this.state.document).then(result => {

        });
    }

    saveAndExit(event) {
      let letter = { ...this.state.document };
      console.log(letter);
        // this.props.history.push({
        //     pathname: "/CoomonLog",
        //     search: "?projectId=" + this.state.projectId
        // });
    }

    render() {
        return (
            <div className="mainContainer">
                <div className="documents-stepper">
                    <div className="submittalHead">
                        <h2 className="zero">{Resources.lettertitle[currentLanguage]}
                            <span>{projectName.replace(/_/gi,' ')} · Communication</span>
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
                    
                        <div className="step-content fullWidthContent cutome__inputs">
                            <div id="step1" className="step-content-body">
                                <div className="subiTabsContent">
                                    {
                                        this.props.changeStatus == true ?
                                            <header>
                                                <h2 className="zero">
                                                    {Resources.goEdit[currentLanguage]}
                                                </h2>
                                                <p className="doc-infohead"><span> {this.state.document.refDoc}</span> - <span> {this.state.document.arrange}</span> - <span>{moment(this.state.document.docDate).format('DD/MM/YYYY')}</span></p>
                                            </header>
                                            : null
                                    }
                                    <div className="document-fields">
                                        <form className="proForm first-proform">
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.subject[currentLanguage]}</label>
                                                <div className="inputDev ui input">
                                                    <input type="text" className="form-control fsadfsadsa" value={this.state.document.subject}
                                                        onChange={e => this.handleChange(e, 'subject')} id="subject" name="subject" placeholder={Resources.subject[currentLanguage]} />
                                                </div>
                                            </div>
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.status[currentLanguage]}</label>
                                                <div className="ui checkbox radio radioBoxBlue checked">
                                                    <input type="radio" checked="" tabIndex="0"  onChange={e=>{this.setState({ document:{...document,status: true}})}}  className="hidden" checked={this.state.document.status} name="Close-open" />
                                                    <label>{Resources.oppened[currentLanguage]}</label>
                                                </div>
                                                <div className="ui checkbox radio radioBoxBlue">
                                                    <input type="radio" tabIndex="0" onChange={e=>{this.setState({ document:{...document,status: false}})}} className="hidden" checked={!this.state.document.status} name="Close-open" />
                                                    <label>{Resources.closed[currentLanguage]}</label>
                                                </div>
                                            </div>
                                        </form>
                                        <form className="proForm datepickerContainer">
                                            <div className="linebylineInput ">
                                                <div className="inputDev ui input input-group date NormalInputDate"> 
                                                     <div className="customDatepicker fillter-status fillter-item-c "> 
                                                        <div className="proForm datepickerContainer"> 
                                                        <label className="control-label">{ Resources.docDate[currentLanguage]  }</label>
                                                            <div className="linebylineInput" >
                                                                <div className="inputDev ui input input-group date NormalInputDate">
                                                                    <ModernDatepicker 
                                                                        date={this.state.document.docDate}
                                                                        format={'DD-MM-YYYY'}
                                                                        showBorder
                                                                        onChange={e => this.handleChangeDate(e, 'docDate')}
                                                                        placeholder={'Select a date'}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                  </div> 
                                                </div>
                                            </div>
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.arrange[currentLanguage]}</label>
                                                <div className="inputDev ui input">
                                                    <input type="text" className="form-control" id="arrange"
                                                        onChange={(e) => this.handleChange(e, 'arrange')} value={this.state.document.arrange}
                                                        name="arrange" placeholder={Resources.arrange[currentLanguage]} />

                                                </div>
                                            </div>
                                            <div className="linebylineInput valid-input">
                                                <label className="control-label">{Resources.refDoc[currentLanguage]}</label>
                                                <div className="inputDev ui input">
                                                    <input type="text" className="form-control" id="refDoc"
                                                        onChange={(e) => this.handleChange(e, 'refDoc')} value={this.state.document.refDoc}
                                                        name="arrange" placeholder={Resources.refDoc[currentLanguage]} />
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown
                                                    title="fromCompany"
                                                    data={this.state.companies} 
                                                    selectedValue={this.state.selectedFromCompany} 
                                                    handleChange={event => this.handleChangeDropDown(event, 'fromCompanyId', true, 'fromContacts', 'GetContactsByCompanyId', 'companyId','selectedFromCompany')}
                                                    index="letter-fromCompany"
                                                />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown
                                                    title="fromContact"
                                                    data={this.state.fromContacts}
                                                    handleChange={event => this.handleChangeDropDown(event, 'fromContactId')}
                                                    index="letter-fromContact"
                                                />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown
                                                    title="toCompany"
                                                    data={this.state.companies}
                                                    selectedValue={this.state.selectedToCompany} 
                                                    handleChange={event => this.handleChangeDropDown(event, 'toCompanyId', true, 'ToContacts', 'GetContactsByCompanyId', 'companyId','selectedToCompany')}
                                                    index="letter-toCompany"
                                                />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown
                                                    title="toContactName"
                                                    data={this.state.ToContacts}
                                                    selectedValue={this.state.selectedToContact} 
                                                    handleChange={event => this.handleChangeDropDown(event, 'toContactId')}
                                                    index="letter-toContactName"
                                                />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown
                                                    title="discipline"
                                                    data={this.state.discplines}
                                                    selectedValue={this.state.selectedDiscpline} 
                                                    handleChange={event => this.handleChangeDropDown(event, 'disciplineId',false,'','','','selectedDiscpline')}
                                                    index="letter-discipline"
                                                />
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <Dropdown
                                                    title="replyletter"
                                                    data={this.state.letters} 
                                                    selectedValue={this.state.selectedReplyLetter} 
                                                    handleChange={event => this.handleChangeDropDown(event, 'replyId',false,'','','','selectedReplyLetter')}
                                                    index="letter-replyId"
                                                />
                                            </div>

                                        </form>
                                    </div>
                                    <div className="doc-pre-cycle">
                                        <div>

                                            {this.props.changeStatus === true ?
                                                <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }
                                            {this.props.changeStatus === true ?
                                                <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }

                                            {this.props.changeStatus === true ?
                                                <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                                                : null
                                            }
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="submittalActions doc-submitt submittalActions__add">
                            <header>
                                <h2 className="zero">Actions</h2>
                            </header>
                            <div className="title">
                                {this.state.docId === 0 ?
                                    <button className="primaryBtn-1 btn mediumBtn" onClick={e=>this.saveLetter(e)}>{Resources.save[currentLanguage]}</button>
                                    :
                                    <button className="primaryBtn-1 btn mediumBtn" onClick={e=>this.saveAndExit(e)}>{Resources.saveAndExit[currentLanguage]}</button>
                                }
                                <hr />
                            </div>
                            <div className="actionDropdown customDropdown">
                                <OptionContainer permission={this.state.permission} docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
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
)(withRouter(LettersAddEdit))
import React, { Component } from "react";

import { Formik, Form } from 'formik';
import Api from "../../api";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import UploadAttachment from '../../Componants/OptionsPanels/UploadAttachment'
import ViewAttachment from '../../Componants/OptionsPanels/ViewAttachmments'
import ViewWorkFlow from "../../Componants/OptionsPanels/ViewWorkFlow";
import Resources from "../../resources.json";

import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';

import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
 
class LettersAddEdit extends Component {
    constructor(props) {
        super(props); 
        
        let docId=0;
        let projectId=0;
        console.log(this.props.location.search);
        const query = new URLSearchParams(this.props.location.search);
        let index=0;
        for (let param of query.entries()) {
            index==0?(docId = param[1]):(projectId = param[1]);
          index++;
        } 
        this.state = { 
            docId: docId,
            docTypeId: 19,
            projectId: projectId 
        }
    } 
    componentDidMount () {
          // alert('in lettersAddEdit page componentDidMount');
    }; 
    componentWillMount () {
      if (this.state.docId>0) {

            let url="GetLettersById?id="+this.state.docId
            this.props.actions.documentForEdit(url); 
      }else{
        let letter={subject:' new ',id:'',projectId:'',arrange:'' , fromCompanyId:'',fromContactId:'',toCompanyId:'',toContactId:'',replayId:'',
                               docDate :'', status:'false',disciplineId:'', refDoc:'',sharedSettings:'',message:''};

            this.props.actions.documentForAdding(letter); 

      }
    }; 
    handleEmailChange (e){
       
    }

    render() { 
        return (
            <div className="mainContainer">
            <div className="documents-stepper">
        
        <div className="submittalHead">
            <h2 className="zero">Letter
                <span>Uptown cairo · Technical office</span>
            </h2>
            <div className="SubmittalHeadClose">
                <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                      <g id="Group-2">
                        <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                          <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                            <g id="Group">
                              <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                              <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z" id="Combined-Shape" fill="#858D9E" fill-rule="nonzero"></path>
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

            <div className="step-content fullWidthContent">
                <div id="step1" className="step-content-body">
                    <div className="subiTabsContent">
                        <header>
                            <h2 className="zero">
                                POs
                            </h2>
                            <p className="doc-infohead"><span>#Ubtec (SD#001)</span> - <span>villas 128 &amp; 132</span> - <span>12·09·2017</span></p>
                        </header> 
                        <div className="document-fields">
                            <form className="proForm first-proform">
                                <div className="linebylineInput valid-input">
                                     <label className="control-label">Subject</label> 
                                    <div className="inputDev ui input">
                                        <input autocomplete="off" type="text" className="form-control fsadfsadsa" value ={this.props.document.subject} 
                                        onChange={this.handleEmailChange} id="subject" name="subject" placeholder="" />
                                    </div>
                                </div> 
                                <div className="linebylineInput valid-input"> 
                                    <label className="control-label">Status</label> 
                                    <div className="ui checkbox radio radioBoxBlue checked">
                                        <input type="radio" checked="" tabIndex="0" className="hidden" name="Close-open"/>
                                        <label>Opened</label>
                                    </div>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" tabIndex="0" className="hidden" name="Close-open"/>
                                        <label>Closed</label>
                                    </div>
                                </div> 
                            </form> 
                            <form className="proForm datepickerContainer">
                                <div className="linebylineInput "> 
                                    <label className="control-label">Cycle date</label> 
                                    <div className="inputDev ui input input-group date NormalInputDate">
                                        <input autocomplete="off" type="text" className="form-control" placeholder="Please select date"  />
                                        <span className="input-group-addon"><img src="images/datepicker.png"/></span>
                                    </div>
                                </div> 
                                <div className="linebylineInput valid-input"> 
                                    <label className="control-label">No.</label> 
                                    <div className="inputDev ui input">
                                        <input autocomplete="off" type="text" className="form-control" id="firstname1" name="firstname1" placeholder=""  />
                                    </div>
                                </div> 
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">Approval status</label>

                                    <div className="ui fluid selection dropdown singleDropDown" tabIndex="0">

                                        <input type="hidden" name="country"/>
                                        <i className="dropdown icon"></i>
                                        <div className="default text">
                                            Select status
                                        </div>
                                        <div className="menu transition hidden" tabIndex="-1" >
                                            <div className="item">
                                                Offline
                                            </div>
                                            <div className="item">
                                                Opend
                                            </div>
                                            <div className="item">
                                                Closed
                                            </div>

                                        </div>
                                    </div>
                                </div>
                               
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">Company</label>

                                    <div className="ui fluid selection dropdown singleDropDown" tabIndex="0">

                                        <input type="hidden" name="country" />
                                        <i className="dropdown icon"></i>
                                        <div className="default text">
                                            Select status
                                        </div>
                                        <div className="menu transition hidden" tabIndex="-1" >
                                            <div className="item">
                                                Offline
                                            </div>
                                            <div className="item">
                                                Opend
                                            </div>
                                            <div className="item">
                                                Closed
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">Contact</label>

                                    <div className="ui fluid selection dropdown singleDropDown" tabIndex="0">

                                        <input type="hidden" name="country"/>
                                        <i className="dropdown icon"></i>
                                        <div className="default text">
                                            Select status
                                        </div>
                                        <div className="menu transition hidden" tabIndex="-1" >
                                            <div className="item">
                                                Offline
                                            </div>
                                            <div className="item">
                                                Opend
                                            </div>
                                            <div className="item">
                                                Closed
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                
                                <div className="linebylineInput">
                                    
                                    <label className="control-label">Date approved</label>
                                    
                                    <div className="inputDev ui input input-group date NormalInputDate">
                                        <input autocomplete="off" type="text" className="form-control" placeholder="Please select date" />
                                        <span className="input-group-addon"><img src="images/datepicker.png"/></span>
                                    </div>
                                </div>
                               
                            </form>
                        </div>
                        <div className="doc-pre-cycle">
                            <header>
                                <h2 className="zero">Previous cycle</h2>
                            </header>

                            <div className="precycle-grid">
                                <table className="ui table">
                                 <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Subject</th>
                                            <th>Doc. type</th>
                                            <th>Doc. date</th>
                                            <th>Doc. date</th>
                                            <th>Doc. date</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>1C (RFI#89-2)</td>
                                            <td>Request For Information</td>
                                            <td>12/12/2017</td>
                                            <td>12/12/2017</td>
                                            <td>12/12/2017</td>
                                            <td><img alt="" title="" src="images/table3Dots.png"/></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="slider-Btns">
                                <button className="primaryBtn-1 btn meduimBtn" onClick={ (e)=> { console.log(this.props.document.subject);}}>NEXT STEP</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="step2" className="step-content-body out">
                    <div className="subiTabsContent">
                        <header>
                            <h2 className="zero">
                                POs
                            </h2>
                            <p className="doc-infohead"><span>#Ubtec (SD#001)</span> - <span>villas 128 &amp; 132</span> - <span>12·09·2017</span></p>
                        </header>
                        
                        <div className="document-fields">
                            <form className="proForm first-proform">
                                <div className="linebylineInput valid-input">
                                    
                                    <label className="control-label">Subject</label>
                                    
                                    <div className="inputDev ui input">
                                        <input autocomplete="off" type="text" className="form-control fsadfsadsa" id="firstname1" name="firstname1" placeholder="" />
                                    </div>
                                </div>
                                
                                <div className="linebylineInput valid-input">
                                     
                                    <label className="control-label">Status</label>
                                   
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" checked="" tabIndex="0" className="hidden" name="Close-open" />
                                        <label>Opened</label>
                                    </div>
                                    <div className="ui checkbox radio radioBoxBlue">
                                        <input type="radio" tabIndex="0" className="hidden" name="Close-open" />
                                        <label>Closed</label>
                                    </div>
                                </div>
                               
                            </form>
                            
                            <form className="proForm datepickerContainer">
                                <div className="linebylineInput ">
                                    
                                    <label className="control-label">Cycle date</label>
                                     
                                    <div className="inputDev ui input input-group date NormalInputDate">
                                        <input autocomplete="off" type="text" className="form-control" placeholder="Please select date" />
                                        <span className="input-group-addon"><img src="images/datepicker.png" /></span>
                                    </div>
                                </div>
                                
                                <div className="linebylineInput valid-input">
                                     
                                    <label className="control-label">No.</label>
                                    
                                    <div className="inputDev ui input">
                                        <input autocomplete="off" type="text" className="form-control" id="firstname1" name="firstname1" placeholder="" />
                                    </div>
                                </div>
                                
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">Approval status</label>
                                    <div className="ui fluid selection dropdown singleDropDown" tabIndex="0">
                                        <input type="hidden" name="country" />
                                        <i className="dropdown icon"></i>
                                        <div className="default text">
                                            Select status
                                        </div>
                                        <div className="menu transition hidden" tabIndex="-1" >
                                            <div className="item">
                                                Offline
                                            </div>
                                            <div className="item">
                                                Opend
                                            </div>
                                            <div className="item">
                                                Closed
                                            </div>

                                        </div>
                                    </div>
                                </div>
                              
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">Company</label>
                                    <div className="ui fluid selection dropdown singleDropDown" tabIndex="0">
                                        <input type="hidden" name="country" />
                                        <i className="dropdown icon"></i>
                                        <div className="default text">
                                            Select status
                                        </div>
                                        <div className="menu transition hidden" tabIndex="-1" >
                                            <div className="item">
                                                Offline
                                            </div>
                                            <div className="item">
                                                Opend
                                            </div>
                                            <div className="item">
                                                Closed
                                            </div>
                                        </div>
                                    </div>
                                </div>
                              
                                <div className="linebylineInput valid-input">
                                    <label className="control-label">Contact</label>
                                    <div className="ui fluid selection dropdown singleDropDown" tabIndex="0">
                                        <input type="hidden" name="country" />
                                        <i className="dropdown icon"></i>
                                        <div className="default text">
                                            Select status
                                        </div>
                                        <div className="menu transition hidden" tabIndex="-1" >
                                            <div className="item">
                                                Offline
                                            </div>
                                            <div className="item">
                                                Opend
                                            </div>
                                            <div className="item">
                                                Closed
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                 
                                <div className="linebylineInput">
                                    
                                    <label className="control-label">Date approved</label>
                                    
                                    <div className="inputDev ui input input-group date NormalInputDate">
                                        <input autocomplete="off" type="text" className="form-control" placeholder="Please select date"/>
                                        <span className="input-group-addon"><img src="images/datepicker.png"/></span>
                                    </div>
                                </div>
                               
                            </form>
                        </div>
                        <div className="doc-pre-cycle">
                            <header>
                                <h2 className="zero">Previous cycle</h2>
                            </header>

                            <div className="precycle-grid">
                                <table className="ui table">
                                 <thead>
                                        <tr>
                                            <th>No.</th>
                                            <th>Subject</th>
                                            <th>Doc. type</th>
                                            <th>Doc. date</th>
                                            <th>Doc. date</th>
                                            <th>Doc. date</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>1C (RFI#89-2)</td>
                                            <td>Request For Information</td>
                                            <td>12/12/2017</td>
                                            <td>12/12/2017</td>
                                            <td>12/12/2017</td>
                                            <td><img alt="" title="" src="images/table3Dots.png"/></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="slider-Btns">
                                <button className="primaryBtn-1 btn meduimBtn">NEXT STEP</button>
                            </div>
                        </div>

                    </div>

                </div> 

            </div>
 
        </div> 

    </div>
                <div className="dropWrapper">  
                     
                    {   this.props.changeStatus === true ?
                        <UploadAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                        : null
                    }
                    {   this.props.changeStatus === true ?
                        <ViewAttachment docTypeId={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                        : null
                    }
               
                    {   this.props.changeStatus === true ?
                        <ViewWorkFlow docType={this.state.docTypeId} docId={this.state.docId} projectId={this.state.projectId} />
                        : null
                    } 
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
)(LettersAddEdit)
 

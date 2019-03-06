import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../../publicComponants/ConfirmationModal";
import GridSetup from "../../../../Pages/Communication/GridSetup";
import NotifiMsg from '../../../publicComponants/NotifiMsg'
import Export from "../../../../Componants/OptionsPanels/Export";
import config from "../../../../Services/Config";
import Resources from "../../../../resources.json";
import Api from '../../../../api';
import dataservice from "../../../../Dataservice";
import DropDown from '../../../OptionsPanels/DropdownMelcous'
import DatePicker from '../../../OptionsPanels/DatePicker'
import Contacts, { MultiApproval } from '../ExpensesWorkFlow/ExpensesWorkFlow'
import moment from 'moment';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProject = localStorage.getItem('lastSelectedprojectName')
class ExpensesWorkFlowAddEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ActiveStep: false , 
            ProjectList:[],
            CompanyData:[],
            ContactData:[]

        }
    }
    componentDidMount = () => {
          dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'id').then(
                 res => {
                     this.setState({
                        ProjectList: res,
                     })
                 }
             )
             dataservice.GetDataList('GetProjectCompanies?accountOwnerId=2', 'projectName', 'id').then(
                res => {
                    this.setState({
                        CompanyData: res,
                    })
                }
            )
    }
    render() {

        return (
            <div className="mainContainer">

                <div className="documents-stepper noTabs__document one__tab one_step">
                    <div className="submittalHead">
                        <h2 className="zero">{CurrProject + ' - ' + Resources['expensesWorkFlow'][currentLanguage]}</h2>
                        <div className="SubmittalHeadClose">
                            <svg width="56px" height="56px" viewBox="0 0 56 56" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Components/Sections/Doc-page/Title/Base" transform="translate(-1286.000000, -24.000000)">
                                        <g id="Group-2">
                                            <g id="Action-icons/Close/Circulated/56px/Light-grey_Normal" transform="translate(1286.000000, 24.000000)">
                                                <g id="Action-icons/Close/Circulated/20pt/Grey_Normal">
                                                    <g id="Group">
                                                        <circle id="Oval" fill="#E9ECF0" cx="28" cy="28" r="28"></circle>
                                                        <path d="M36.5221303,34.2147712 C37.1592899,34.8519308 37.1592899,35.8849707 36.5221303,36.5221303 C35.8849707,37.1592899 34.8519308,37.1592899 34.2147712,36.5221303 L28,30.3073591 L21.7852288,36.5221303 C21.1480692,37.1592899 20.1150293,37.1592899 19.4778697,36.5221303 C18.8407101,35.8849707 18.8407101,34.8519308 19.4778697,34.2147712 L25.6926409,28 L19.4778697,21.7852288 C18.8407101,21.1480692 18.8407101,20.1150293 19.4778697,19.4778697 C20.1150293,18.8407101 21.1480692,18.8407101 21.7852288,19.4778697 L28,25.6926409 L34.2147712,19.4778697 C34.8519308,18.8407101 35.8849707,18.8407101 36.5221303,19.4778697 C37.1592899,20.1150293 37.1592899,21.1480692 36.5221303,21.7852288 L30.3073591,28 L36.5221303,34.2147712 Z"
                                                            id="Combined-Shape" fill="#858D9E" fillRule="nonzero"></path>
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
                        <div className="step-content">
                            {!this.state.ActiveStep ?
                                <div className="document-fields">
                                    <form className="proForm first-proform">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">Subject</label>
                                            <div className="inputDev ui input">
                                                <input autoComplete="off" type="text" className="form-control fsadfsadsa" id="firstname1" name="firstname1" placeholder="" />
                                            </div>
                                        </div>
                                        <div className="linebylineInput">
                                            <label className="control-label"> {Resources['status'][currentLanguage]} </label>
                                            <div className="ui checkbox radio radioBoxBlue">
                                                <input type="radio" name="designTeam" value="true" onChange={this.DesignTeamChange} />
                                                <label>{Resources['oppened'][currentLanguage]}</label>
                                            </div>
                                            <div className="ui checkbox radio radioBoxBlue checked">
                                                <input type="radio" defaultChecked name="designTeam" value="false" onChange={this.DesignTeamChange} />
                                                <label> {Resources['closed'][currentLanguage]}</label>
                                            </div>
                                        </div>
                                    </form>
                                    <form className="proForm datepickerContainer">
                                        <div className="linebylineInput valid-input">
                                            <div className="inputDev ui input">
                                                <DropDown data={this.state.ProjectList} />
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <div className="inputDev ui input">
                                                <DatePicker startDate={moment().format('DD:MM:YYYY')}/>
                                            </div>
                                        </div>

                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">NO.</label>
                                            <div className="inputDev ui input">
                                                <input autoComplete="off"  type="text" className="form-control fsadfsadsa" id="firstname1" name="firstname1" placeholder="" />
                                            </div>
                                        </div>

                                    </form>

                                </div>
                                :
                                <div className="doc-pre-cycle">

                                    <Contacts />
                                </div>
                            }
                            <div className="doc-pre-cycle">

                                <div className="slider-Btns">
                                    <button className="primaryBtn-1 btn meduimBtn" onClick={() => this.setState({ ActiveStep: true })}>NEXT STEP</button>
                                </div>
                            </div>




                        </div>

                        <div className="docstepper-levels">
                            <div className="step-content-foot">
                                <span className="step-content-btn-prev disabled"><i className="fa fa-caret-left" aria-hidden="true"></i>
                                    Previous</span>
                                <span className="step-content-btn next-btn disabled">Next <i className="fa fa-caret-right" aria-hidden="true"></i>
                                </span>
                            </div>

                            <div className="workflow-sliderSteps">
                                <div className="step-slider">
                                    <div data-id="step1" className="step-slider-item  first-stepOne active">
                                        <div className="steps-timeline">
                                            <span>1</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>Expenses WorkFlow</h6>

                                        </div>
                                    </div>

                                    <div data-id="step2" className={this.state.ActiveStep ? "step-slider-item  active" : "step-slider-item"}>
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>Contacts</h6>
                                        </div>
                                    </div>
                                    <div data-id="step3" className="step-slider-item">
                                        <div className="steps-timeline">
                                            <span>3</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>Multi Approval</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>




                </div>
            </div>
        )
    }
}
export default withRouter(ExpensesWorkFlowAddEdit)
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
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class ExpensesWorkFlowAddEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ActiveStep:false
        }
    }
    componentDidMount = () => {

    }
    render() {
        return (
            <div className="mainContainer">
                <div className="documents-stepper noTabs__document one__tab one_step">
                    <div className="submittalHead">
                        <h2 className="zero">Expenses WorkFlow </h2>
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
                                    <div data-id="step1" className= "step-slider-item  first-stepOne active">
                                        <div className="steps-timeline">
                                            <span>1</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>Basic info</h6>
                                          
                                        </div>
                                    </div>
                                   
                                    <div data-id="step2" className={this.state.ActiveStep? "step-slider-item  active" : "step-slider-item"}>
                                        <div className="steps-timeline">
                                            <span>2</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>Basic info</h6>
                                        </div>
                                    </div>
                                    <div data-id="step3" className="step-slider-item">
                                        <div className="steps-timeline">
                                            <span>3</span>
                                        </div>
                                        <div className="steps-info">
                                            <h6>Basic info</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 
                    <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" onClick={()=>this.setState({ActiveStep:true})}>NEXT STEP</button>
                                        </div>
                </div>
            </div>
        )
    }
}
export default withRouter(ExpensesWorkFlowAddEdit)
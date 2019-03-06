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

class ExpensesWorkFlow extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount = () => {

    }
    render() {
        return (
            <div>
                <div id="step1" className="step-content-body">
                    <div className="subiTabsContent">
                        <header className="main__header">
                            <div className="main__header--div">
                                <h2 className="zero"> POs    </h2>
                                <p className="doc-infohead"><span>#Ubtec (SD#001)</span> - <span>villas 128 & 132</span> - <span>12·09·2017</span></p>
                            </div>
                        </header>
                        <div className="doc-pre-cycle">
                            <header>
                                <h2 className="zero">Previous cycle</h2>
                            </header>

                            <div className="precycle-grid">

                            </div>

                        </div>
                    </div>
                </div>
                <div className="document-fields">
                    <form className="proForm first-proform">
                        <div className="linebylineInput valid-input">
                            <label className="control-label">Subject</label>
                            <div className="inputDev ui input">
                                <input autoComplete="off" type="text" className="form-control fsadfsadsa" id="firstname1" name="firstname1" placeholder="" />
                            </div>
                        </div>
                        <div className="linebylineInput valid-input">
                            <label className="control-label">Status</label>
                            <div className="ui checkbox radio  radioBoxBlue">
                                <input type="radio" checked="" tabIndex="0" className="hidden" name="Close-open" />
                                <label>Opened</label>
                            </div>
                            <div className="ui checkbox radio  radioBoxBlue">
                                <input type="radio" tabIndex="0" className="hidden" name="Close-open" />
                                <label>Closed</label>
                            </div>
                        </div>
                    </form>
                    <form className="proForm datepickerContainer">
                        <div className="linebylineInput ">
                            <label className="control-label">Cycle date</label>
                            <div className="inputDev ui input input-group date NormalInputDate">
                                <input autoComplete="off" type="text" className="form-control" placeholder="Please select date" />
                                <span className="input-group-addon"></span>
                            </div>
                        </div>
                        <div className="linebylineInput valid-input">
                            <label className="control-label">No.</label>
                            <div className="inputDev ui input">
                                <input autoComplete="off" type="text" className="form-control" id="firstname1" name="firstname1" placeholder="" />
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
                                <div className="menu transition hidden" tabIndex="-1">
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
                                <div className="menu transition hidden" tabIndex="-1">
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
                                <div className="menu transition hidden" tabIndex="-1">
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
                                <input autoComplete="off" type="text" className="form-control" placeholder="Please select date" />
                                <span className="input-group-addon"></span>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        )
    }
}
export default withRouter(ExpensesWorkFlow)
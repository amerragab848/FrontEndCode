
import React, { Component, Fragment } from 'react'
import Moment from 'moment';
import dataService from "../../Dataservice";
import Signature from '../../Styles/images/mySignature.png';
import Avatar from "../../Styles/images/avatar/xavatarBig.svg"
import CommentImg from "../../Styles/images/flowComment.png"
import LoadingSection from "../publicComponants/LoadingSection"; 
const groupBy = require('lodash/groupBy'); 
const map = require('lodash/map'); 
class viewExpensesWF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading: true,
            workFlowCycles: [],
            visualCycle: [],
            showPopup: false,
            comment: '',
            currentLevel: {}
        };
    }

    componentDidMount() {
        if (this.props.workFlowData.length) {
            let grouped = this.props.workFlowData.sort((a, b) => (a.arrangeLevel > b.arrangeLevel) ? 1 : ((b.arrangeLevel > a.arrangeLevel) ? -1 : 0));
            let index = grouped.length - 1
            this.setState({
                isloading: false,
                workFlowCycles: this.props.workFlowData,
                currentLevel: grouped[index]
            });
        }
        else {
            dataService.GetDataGrid('GetExpensesWorkFlowSigntureByExpensesId?expensesId=' + this.props.expensesId).then(
                result => {

                    let grouped = result.sort((a, b) => (a.arrangeLevel > b.arrangeLevel) ? 1 : ((b.arrangeLevel > a.arrangeLevel) ? -1 : 0));
                    let index = grouped.length - 1
                    this.setState({
                        isloading: false,
                        workFlowCycles: result,
                        currentLevel: grouped[index]
                    });
                })
        }
    }

    showPopup(e) {
        if (e != "") {
            this.setState({ showPopup: true, comment: e });
        }
    }

    closePopup(e) {
        this.setState({ showPopup: false });
    }

    renderLevels(items) {

        let grouped = groupBy(items, 'arrangeLevel');

        let mapLevels = map(grouped, (i, index) => {
            return (
                <div className="StepperNum1 StepperNum workFlowStep" key={index}>
                    <div>
                        <div className={i[0].status == null ? 'StepNumber pendingStep' : (i[0].status === true ? "StepNumber approvalstep" : "StepNumber declineStep")}>
                            <span className="Step-Line afterLine"></span>
                            <div className="StepNum">
                                <p className="StepN zero">{i[0].arrangeLevel}</p>
                            </div>
                            <span className="Step-Line"></span>
                        </div>
                        <div className="MultiPeinding">
                            {i.map((level, idx) => {
                                return (
                                    <div key={idx} className={level.status == null ? "card-box cardPending" : level.status === true ? "card-box cardApproval" : "card-box cardDeclined"}>

                                        <div className={level.status == null ? "signature-h signaturePendingd" : "signature-h"}>
                                            <figure className="avatarProfile smallAvatarSize">
                                                <img alt="" title="" src={Avatar} />
                                            </figure>
                                            <div className="avatarName">
                                                <h6>{level.contactName}</h6>
                                                <p>{level.companyName}</p>
                                            </div>
                                        </div>

                                        {level.status !== null ?
                                            <div className="card-signature">
                                                <img src={level.signature != null ? level.signature : Signature} alt="..." />
                                            </div>
                                            : null}

                                        <div className="Status__comment">
                                            {level.status !== null ?
                                                <span>
                                                    {level.comment === null || level.comment === "" ? null :
                                                        <img src={CommentImg} alt="Cooment" onClick={e => this.showPopup(level.comment)} />
                                                    }
                                                </span> : null}
                                            <div className="box-statue">
                                                <h5>{level.statusName}</h5>
                                                <p>{Moment(level.requestDate).format('DD-MM-YYYY')}</p>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    </div>
                </div>
            )
        });

        return mapLevels;
    }


    render() {
        return (
            <Fragment>
                {this.state.isloading ? <LoadingSection /> : null}

                <div className={this.state.showPopup === true ? "popupMedium active" : "popupMedium"}>
                    <button onClick={(e) => this.closePopup()} className="workflowComment__closeBtn">x</button>
                    <div className={this.state.showPopup === true ? "ui modal smallModal active workflowComment" : "ui modal smallModal workflowComment"} id="smallModal2">
                        <h2 className="header zero">Comment</h2>
                        <p className="zero">{this.state.comment}</p>
                        <button onClick={(e) => this.closePopup()} className="smallBtn primaryBtn-1 btn approve">Close</button>
                    </div>
                </div>
                {this.state.workFlowCycles.length ?

                    <div className="workflowWrapper" id='wfCycles'>
                        <div className="workflow-header">
                            <h4><p className="zero"><span>{this.state.currentLevel.subject}</span><span>{"Currently at Level:" + this.state.currentLevel.arrangeLevel}</span></p>
                                <span> {"Sent in:" + Moment(this.state.currentLevel.requestDate).format('DD-MM-YYYY')}</span></h4>
                        </div>
                        <div className="card-status">
                            {this.renderLevels(this.state.workFlowCycles)}
                        </div>
                    </div> : null}
            </Fragment>
        )
    }
}

export default viewExpensesWF;
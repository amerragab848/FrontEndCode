//sayd doing 
//draw html and create levels and subjects titles

// missing and not complated
//create step Number on top of work flow  "when work flow is in multi level" 

import React, { Component, Fragment } from 'react'
import Moment from 'moment';
import Signature from '../../Styles/images/mySignature.png';
import Avatar from "../../Styles/images/avatar/xavatarBig.svg"
import CommentImg from "../../Styles/images/flowComment.png"
import DistributionList from "../OptionsPanels/viewDistributionList";
import Config from "../../Services/Config";
import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';

import * as communicationActions from '../../store/actions/communication';

const _ = require('lodash')

class ViewWorkFlow extends Component {

    constructor(props) {
        super(props)
        this.state = {
            workFlowCycles: [],
            visualCycle: [],
            projectId: this.props.projectId != null ? this.props.projectId : 0,
            docId: this.props.docId != null ? this.props.docId : 0,
            docType: this.props.docType != null ? this.props.docType : 0,
            showPopup: false,
            comment: ''
        }
    }

    componentDidMount() {
        let url = 'GetCycleWorkflowByDocIdDocType?docId=' + this.state.docId + '&docType=' + this.state.docType + '&projectId=' + this.state.projectId;
        if (this.props.workFlowCycles.length === 0) {
            this.props.actions.GetWorkFlowCycles(url);
        }
        else {
            this.renderCycles(this.props.workFlowCycles);
            this.setState({ workFlowCycles: this.props.workFlowCycles })
        }
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.workFlowCycles != state.workFlowCycles) {
            return { workFlowCycles: nextProps.workFlowCycles };
        }
        return null
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.workFlowCycles !== this.props.workFlowCycles) {
            this.renderCycles(this.props.workFlowCycles);
        }
    }

    showPopup(e) {
        if (e != "") {
            this.setState({
                showPopup: true,
                comment: e
            });
        }
    }

    closePopup(e) {
        this.setState({
            showPopup: false
        });
    }

    renderLevels(items) {

        let grouped = _.groupBy(items, 'arrange');

        let mapLevels = _.map(grouped, (i, index) => {
            return (
                <div className="StepperNum1 StepperNum workFlowStep" key={index}>
                    <div>
                        <div className={i[0].statusVal == null ? 'StepNumber pendingStep' : (i[0].statusVal === true ? "StepNumber approvalstep" : "StepNumber declineStep")}>
                            <span className="Step-Line afterLine"></span>
                            <div className="StepNum">
                                <p className="StepN zero">{i[0].arrange}</p>
                            </div>
                            <span className="Step-Line"></span>
                        </div>
                        <div className="MultiPeinding">
                            {i.map((level, idx) => {
                                let levelSignature = Config.getPublicConfiguartion().downloads + '/' + level.signature
                                return (
                                    <div key={idx} className={level.statusVal == null ? "card-box cardPending" : level.statusVal === true ? "card-box cardApproval" : "card-box cardDeclined"}>
                                        <div className={level.statusVal == null ? "signature-h signaturePendingd" : "signature-h"}>
                                            <figure className="avatarProfile smallAvatarSize">
                                                <img alt="" title="" src={Avatar} />
                                            </figure>
                                            <div className="avatarName">
                                                <h6>{level.contactName}</h6>
                                                <p>{level.companyName}</p>
                                            </div>
                                        </div>
                                        {level.statusVal != null ?
                                            <div className="card-signature">
                                                <img src={level.signature != null ? levelSignature : Signature} alt="..." />
                                            </div>
                                            : null}

                                        <div className="Status__comment">
                                            {level.statusVal != null ?
                                                <span>
                                                    {level.comment ? <img src={CommentImg} alt="Cooment" onClick={e => this.showPopup(level.comment)} /> : null
                                                    }
                                                </span> : null}
                                            <div className="box-statue">
                                                <h5>{level.status}</h5>
                                                <p>{Moment(level.creationDate).format('DD-MM-YYYY')}</p>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    </div>
                </div>
            )
        })

        return mapLevels;
    }

    renderCycles(workFlowCycles) {
        let cycles = workFlowCycles.map(cycle => {
            return (
                <div className="workflowWrapper" key={Math.random()} id='wfCycles'>
                    <div className="workflow-header">
                        <h4><p className="zero"><span>{cycle.subject}</span><span>{"Currently at Level:" + cycle.currentLevel}</span></p><span> {"Sent in:" + Moment(cycle.creationDate).format('DD-MM-YYYY')}</span></h4>
                    </div>
                    <div className="card-status">
                        {this.renderLevels(cycle.levels)}
                    </div>
                </div>
            )
        })
        this.setState({
            visualCycle: cycles
        });
        return cycles
    }

    render() {
        return (
            <Fragment>
                <div className={this.state.showPopup === true ? "popupMedium active" : "popupMedium"}>
                    <button onClick={(e) => this.closePopup()} className="workflowComment__closeBtn" type="button" >x</button>
                    <div className={this.state.showPopup === true ? "ui modal smallModal active workflowComment" : "ui modal smallModal workflowComment"} id="smallModal2">
                        <h2 className="header zero">Comment</h2>
                        <p className="zero">{this.state.comment}</p>
                        <button onClick={(e) => this.closePopup()} type="button" className="smallBtn primaryBtn-1 btn approve">Close</button>
                    </div>
                </div>

                {this.state.visualCycle}
                <Fragment>
                    <DistributionList id={this.props.docId} docType={this.props.docType} />
                </Fragment>
            </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        workFlowCycles: state.communication.workFlowCycles,
        hasWorkflow: state.communication.hasWorkflow,
        changeStatus: state.communication.changeStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewWorkFlow);


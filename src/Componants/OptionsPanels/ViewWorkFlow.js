//sayd doing 
//draw html and create levels and subjects titles

// missing and not complated
//create step Number on top of work flow  "when work flow is in multi level" 

import React, { Component, Fragment } from 'react'
import Moment from 'moment';
import Signature from '../../Styles/images/mySignature.png';
import Avatar from "../../Styles/images/avatar/xavatarBig.svg"
import CommentImg from "../../Styles/images/flowComment.png"

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
            docType: this.props.docType != null ? this.props.docType : 0
        }
    }

    componentWillMount() {
        let url = 'GetCycleWorkflowByDocIdDocType?docId=' + this.state.docId + '&docType=' + this.state.docType + '&projectId=' + this.state.projectId;

        if (this.props.workFlowCycles.length === 0 && this.props.changeStatus === true) { //
            this.props.actions.GetWorkFlowCycles(url);
        }
    }
    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.workFlowCycles != prevProps.workFlowCycles) {
            this.setState({ workFlowCycles: nextProps.workFlowCycles });
            this.renderCycles(nextProps.workFlowCycles);
        }
    };

    renderLevels(items) {

        let grouped = _.groupBy(items, 'arrange');

        let groupedLevels = [];

        _.filter(grouped, function (i) {
            let obj = {};
            obj.level = i[0].arrange;
            obj.statusVal = i[0].statusVal;
            obj.count = i.length;
            groupedLevels.push(obj);
        });

        let mapLevels = groupedLevels.map((i, index) => {
            return (
                <div className="StepperNum1 StepperNum workFlowStep" key={index}>
                    <div>
                        <div className={i.statusVal == null ? 'StepNumber pendingStep' : (i.statusVal === true ? "StepNumber approvalstep" : "StepNumber declineStep")}>
                            <span className="Step-Line afterLine"></span>
                            <div className="StepNum">
                                <p className="StepN zero">{i.level}</p>
                            </div>
                            <span className="Step-Line"></span>
                        </div>
                        <div className="MultiPeinding">
                            {items.map((level, idx) => level.arrange === i.level ?
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
                                            <img src={level.signature != null ? level.signature : Signature} alt="..." />
                                        </div>
                                        : null}

                                        <div class="Status__comment">
                                        {level.statusVal != null ?
                                        <span>
                                            <img src={CommentImg} alt="Cooment"/>
                                        </span> : null}
                                        <div className="box-statue">
                                            <h5>{level.status}</h5>
                                            <p>{Moment(level.creationDate).format('DD-MM-YYYY')}</p>
                                        </div>
                                    </div>

                                </div>
                                : null
                            )}
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
        console.log('renderCycles', cycles)
        return cycles
    }

    render() {
        return (
            <Fragment >
                {this.state.visualCycle}
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
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewWorkFlow);


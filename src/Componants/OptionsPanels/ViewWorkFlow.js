//sayd doing 
//draw html and create levels and subjects titles

// missing and not complated
//create step Number on top of work flow  "when work flow is in multi level" 

import React, { Component, Fragment } from 'react'
import Api from '../../api';
import Moment from 'moment';
import Resources from '../../resources.json';
import Signature from '../../Styles/images/mySignature.png';
import Avatar from "../../Styles/images/24176695_10215314500400869_7164682088117484142_n.jpg"
import "../../Styles//scss/en-us/layout22.css"
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const _ = require('lodash')

export default class ViewWorkFlow extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: [],
            data: []
        }
    }

    componentDidMount() {
        let levels = [];
        let cycles = [];

        Api.get('GetCycleWorkflowByDocIdDocType?docId=63&docType=25&projectId=3721').then(result => {

            let workFlowCycles = _.uniqBy(result, 'subject');
            const poolLevels = _.orderBy(result, ['arrange'], 'asc');

            workFlowCycles.forEach(function (item) {
                var obj = {};

                obj.subject = item.subject;
                obj.accountDocWorkFlowId = item.accountDocWorkFlowId;

                //all levels in same subject
                levels = _.filter(poolLevels, function (i) {
                    return i.accountDocWorkFlowId === item.accountDocWorkFlowId;
                });
                obj.levels = levels;
                cycles.push(obj);
            });

            this.setState({
                data: poolLevels,
                title: workFlowCycles
            });
        });
    }



    renderLevels(item) {

        const CountLevels = [];
        const F_Levels = _.filter(this.state.data, function (o) {
            if (o.arrange == item.arrange
                && o.accountDocWorkFlowId == item.accountDocWorkFlowId) return o
        });
        F_Levels.forEach(function (i) {
            var obj = {};
            obj.level = i.arrange;
            obj.count = F_Levels.length;
            CountLevels.push(obj);
        });
        const F_CountLevels = _.uniqBy(CountLevels, 'level');
        console.log(F_CountLevels)

        return (
            <Fragment>
                {item.status === 'Pending' ?
                    <div>
                        <div className="StepNumber pendingStep">
                            <span className="Step-Line afterLine"></span>
                            <div className="StepNum">
                                <p className="StepN zero">{item.arrange}</p>
                                <p className="StepTrue zero">?</p>
                            </div>
                            <span className="Step-Line"></span>
                        </div>
                        <div className="card-box cardPending">
                            <div className="signature-h signaturePendingd">
                                <figure className="avatarProfile smallAvatarSize">
                                    <img alt="" title="" src={Avatar} />
                                </figure>
                                <div className="avatarName">
                                    <h6>{item.contactName}</h6>
                                    <p>{item.companyName}</p>
                                </div>
                            </div>
                            <div className="box-statue">
                                <h5>{item.status}</h5>
                                <p>{Moment(item.creationDate).format('DD-MM-YYYY')}</p>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <div className="StepNumber approved" className={item.status === 'Approved' ? "StepNumber approvalstep" : "StepNumber declineStep"}>
                            <span className="Step-Line afterLine"></span>
                            <div className="StepNum">
                                <p className="StepN zero">{item.arrange}</p>
                            </div>
                            <span className="Step-Line afterLine"></span>
                        </div>


                        <div className={item.status === 'Approved' ? "card-box cardApproval" : "card-box cardDeclined"}>

                            <div className="signature-h">
                                <figure className="avatarProfile smallAvatarSize">
                                    <img alt="" title="" src={Avatar} />
                                </figure>
                                <div className="avatarName">
                                    <h6>{item.contactName}</h6>
                                    <p>{item.companyName}</p>
                                </div>
                            </div>
                            <div className="card-signature">
                                <img src={item.signature === null ? Signature : 'https:demov4.procoor.com/' + item.signature} alt="..." />

                            </div>
                            <div className="box-statue">
                                <h5>{item.status}</h5>
                                <p>{Moment(item.creationDate).format('DD-MM-YYYY')}</p>
                            </div>
                        </div>
                    </div>

                }
            </Fragment>)
    }


    renderWorkFlows(accountDocWorkFlowId) {
        let cycle = this.state.data.map(item => {

            if (accountDocWorkFlowId === item.accountDocWorkFlowId) {
                return (
                    <div className="StepperNum1 StepperNum workFlowStep" key={Math.random()}>
                        {this.renderLevels(item)}
                    </div>
                )
            }
        })

        return cycle;
    }

    renderCycles() {
        let cycles = this.state.title.map(cycle => {
            return (

                <div className="workflowWrapper" key={Math.random()}>
                    <div className="workflow-header">
                        <h4>{cycle.subject + " -Currently at Level:" + cycle.arrange + " -Sent in:" + Moment(cycle.creationDate).format('DD-MM-YYYY')}</h4>
                    </div>
                    <div className="card-status">
                        {this.renderWorkFlows(cycle.accountDocWorkFlowId)}
                    </div>
                </div>
            )
        })

        return cycles
    }


    render() {
        return (
            <Fragment >
                {this.renderCycles()}
            </Fragment>
        )

    }
}


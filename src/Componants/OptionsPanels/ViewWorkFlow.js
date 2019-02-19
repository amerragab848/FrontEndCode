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
 
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const _ = require('lodash')

class ViewWorkFlow extends Component {

    constructor(props) {
        super(props)
        this.state = { 
            cycles: [],
            projectId: this.props.projectId != null ? this.props.projectId :0,
            docId: this.props.docId !=null ? this.props.docId :0,
            docType: this.props.docType !=null ?this.props.docType :0
        }
    }

    componentDidMount() {
        let levels = [];
        let cycles = [];

        Api.get('GetCycleWorkflowByDocIdDocType?docId='+this.state.docId+'&docType='+this.state.docType+'&projectId='+this.state.projectId).then(result => {

            let workFlowCycles = _.uniqBy(result, 'subject');
            const poolLevels = _.orderBy(result, ['arrange'], 'asc');

            workFlowCycles.forEach(function (item) {
                var obj = {};

                obj.subject = item.subject;
                obj.creationDate=item.creationDate;

                obj.accountDocWorkFlowId = item.accountDocWorkFlowId;

                //all levels in same subject
                levels = _.filter(poolLevels, function (i) {
                    return i.accountDocWorkFlowId === item.accountDocWorkFlowId;
                });

                obj.levels = levels;
 
                let maxArrange=_.maxBy(levels,'arrange');
                 
                obj.currentLevel=maxArrange.arrange;
                cycles.push(obj);
            });

            this.setState({ 
                cycles:cycles
            });
        });
    }

    renderLevels(items) {
 
        let grouped=_.groupBy(items, 'arrange');
         
        let groupedLevels=[];

       _.filter(grouped , function (i) {
            let obj = {};
            obj.level=i[0].arrange;
            obj.statusVal=i[0].statusVal;
            obj.count=i.length;
            groupedLevels.push(obj);
        }); 
 
   let mapLevels = groupedLevels.map((i,index) => {
         return (
            <div className="StepperNum1 StepperNum workFlowStep" key={index}>
                        <div>
                            <div className={i.statusVal == null ? 'StepNumber pendingStep':  ( i.statusVal === true ? "StepNumber approvalstep" : "StepNumber declineStep" ) }>
                                <span className="Step-Line afterLine"></span>
                                <div className="StepNum">
                                    <p className="StepN zero">{i.level}</p> 
                                </div>
                                <span className="Step-Line"></span>
                            </div> 
                            <div className="MultiPeinding"> 
                            { items.map((level,idx) =>  level.arrange === i.level ?
                                    <div key={idx} className= {level.statusVal == null ? "card-box cardPending" : level.statusVal === true ? "card-box cardApproval" : "card-box cardDeclined"}>
                                        <div className={ level.statusVal == null ? "signature-h signaturePendingd" : "signature-h" }>
                                            <figure className="avatarProfile smallAvatarSize">
                                                <img alt="" title="" src={Avatar} />
                                            </figure>
                                            <div className="avatarName">
                                                <h6>{level.contactName}</h6>
                                                <p>{level.companyName}</p>
                                            </div>
                                        </div>
                                        { level.statusVal != null? <div className="card-signature"> 
                                            <img src={level.signature !=null ? level.signature: Signature } alt="..." />
                                        </div> : null } 
                                        <div className="box-statue">
                                            <h5>{level.status}</h5>
                                            <p>{Moment(level.creationDate).format('DD-MM-YYYY')}</p>
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
 
    renderCycles() {
        let cycles = this.state.cycles.map(cycle => {
            return ( 
                <div className="workflowWrapper" key={Math.random()}>
                    <div className="workflow-header">
                        <h4>{cycle.subject + " -Currently at Level:" + cycle.currentLevel + " -Sent in:" + Moment(cycle.creationDate).format('DD-MM-YYYY')}</h4>
                    </div>
                    <div className="card-status">
                        {this.renderLevels(cycle.levels)}
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

export default ViewWorkFlow;


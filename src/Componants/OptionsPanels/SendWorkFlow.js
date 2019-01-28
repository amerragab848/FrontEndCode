import React, { Component } from 'react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import InputMelcous from './InputMelcous'
import validations from './validationRules'; 

import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const _ = require('lodash')

class SendWorkFlow extends Component {
    constructor(props) {
        super(props)
        this.state = {

            workFlowData: {
                projectId: "4330",
                docId: "138",
                arrange: "",
                docType: "64",
                workFlowId: "", 
                toAccountId:"",
                dueDate: ""
            }, 
            selectedWorkFlow:{ label: "select WorkFlow" , value: 0 },
            selectedApproveId:{label: "select To Contact" , value: 0}, 

            WorkFlowData: [],
            WorkFlowContactData: []
        }
    }

    workFlowhandelChange = (item) => {
        this.setState({
            selectedWorkFlow: item,
            workFlowData: { ...this.state.workFlowData, workFlowId: item.value }
        }); 

         let url = "GetProjectWorkFlowContactsFirstLevelForList?workFlow=" + item.value;
        
        this.GetData(url, "contactName", "id", "WorkFlowContactData",2);
        
    } 
  
    componentDidMount = () => {
        let url = "ProjectWorkFlowGetList?projectId=" + this.state.workFlowData.projectId;
        this.GetData(url, 'subject', 'id', 'WorkFlowData',1); 
    }
 
    inputChangeHandler = (e) => {
        this.setState({ workFlowData: { ...this.state.workFlowData, Comment: e.target.value } });
    }

    clickHandler = (e) => { 
            let workFlowObj={...this.state.workFlowData};
            workFlowObj.toAccountId=this.state.selectedApproveId.value;
             
            Api.post("SnedToWorkFlow", workFlowObj)
    }
 

    render() {
        return (
            <div className="dropWrapper">
                <Dropdown title="workFlow" data={this.state.WorkFlowData} handleChange={this.workFlowhandelChange} selectedValue={this.state.selectedWorkFlow}
                    index='ddlworkFlow' className={this.state.priorityClass} message={this.state.priorityErrorMess} />
 
                <Dropdown title="contact" data={this.state.WorkFlowContactData} name="ddlApproveTo"  selectedValue={this.state.selectedApproveId} 
                index='ddlApproveTo' className={this.state.toCompanyClass} message={this.state.toCompanyErrorMess} />
  
                <div className="dropBtn">
                    <button className="workFlowDataBtn-1 btn" onClick={this.clickHandler}>{Resources['send'][currentLanguage]}</button>
                </div>
            </div>
        );
    }

    GetData = (url, label, value, currState,type) => {
        let Data = []
        Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];

                Data.push(obj);

            });

            this.setState({
                [currState]: [...Data] 
            });

            switch (type){
                case 1: 
                    this.setState({ 
                        selectedWorkFlow: Data[0]
                    }); 
                 break;

                case 2:
                    this.setState({ 
                        selectedApproveId: Data[0]
                    });
                 break;
 
            }

        }).catch(ex => {
        });
    } 
}
 
export default SendWorkFlow;
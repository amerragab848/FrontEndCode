import React, { Component } from 'react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import InputMelcous from './InputMelcous'
//import validations from './validationRules';


const _ = require('lodash')

class CreateTransmittal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sendingData: {
                projectId: "4330",
                docId: "138",
                arrange: "",
                docType: "64",
                priorityId: "",
                toCompanyId: "",
                Subject: "",
                toContactId: "",
                status: true,
                submittFor: ""
            },
            PriorityData: [],
            ToCompany: [],
            SubmittedForData: [],
            AttentionData: [],
            selectedOption: 'true',
            attentionValue: ''
        }
    }
    clickHandler = (e) => {
        let inboxDto={...this.state.sendingData};      
           console.log(inboxDto);
           Api.post("CreateTransmittal", inboxDto)
    }
    radioChange(e) {
        this.setState({
          selectedOption: e.currentTarget.value,
          sendingData: { ...this.state.sendingData, status: e.currentTarget.value }
        });
      }

    componentDidMount = () => {
        let url = "GetProjectProjectsCompaniesForList?projectId=" + this.state.sendingData.projectId;
        this.GetData(url, 'companyName', 'companyId', 'ToCompany');
        this.GetData("GetAccountsDefaultList?listType=priority&pageNumber=0&pageSize=10000", 'title', 'id', 'PriorityData');
        this.GetData("GetAccountsDefaultList?listType=transmittalsubmittedfor&pageNumber=0&pageSize=10000", 'title', 'id', 'SubmittedForData')
        this.radioChange = this.radioChange.bind(this);
    }

    To_company_handleChange = (selectedOption) => {
       let url = "GetContactsByCompanyId?companyId=" + selectedOption.value;
        this.setState({
            attentionValue: 77,
            sendingData: { ...this.state.sendingData, toCompanyId: selectedOption.value },   
         });     
        this.GetData(url, "contactName", "id", "AttentionData");
    }

    Priority_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, priorityId: item.value },
        })
    }

    inputChangeHandler = (e) => {
        this.setState({ sendingData: { ...this.state.sendingData, Subject: e.target.value } });
    }

    SubmittedFor_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, submittFor: item.value }
        })
    }

    Attention_handleChange = (item) => {
        this.setState({
            attentionValue:item,
            sendingData: { ...this.state.sendingData, toContactId: item.value }
        })
    }

    render() {
        return (
             <div><h1>Create Transmittal</h1>
            <div className="dropWrapper">  

                <InputMelcous title="Subject" fullwidth='true'
                    placeholderText='Subject' fullWidth='true' inputChangeHandler={this.inputChangeHandler}  />

                <Dropdown title="To Company"
                    data={this.state.ToCompany}
                    handleChange={this.To_company_handleChange}
                //   className={this.state.toCompanyClass} message={this.state.toCompanyErrorMess} 
                />

                <Dropdown title="Attention"
                    data={this.state.AttentionData}
                    handleChange={this.Attention_handleChange}
                    value={this.state.attentionValue}
                //className={this.state.attentionClass} message={this.state.attentionErrorMess}
                />

                <Dropdown title="Priority"
                    data={this.state.PriorityData}
                    handleChange={this.Priority_handelChange}
                //className={this.state.priorityClass} message={this.state.priorityErrorMess}
                />

                <Dropdown title="Submitted For"
                    data={this.state.SubmittedForData}
                    handleChange={this.SubmittedFor_handelChange}
                //className={this.state.priorityClass} message={this.state.priorityErrorMess}
                />

                <form className="proForm">
                    <div className="linebylineInput">
                        <label className="control-label">Status</label>
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio"  className="hidden" name="Close-open"  value="true" checked={this.state.selectedOption === "true"} onChange={this.radioChange} />
                            <label>Opened</label>
                        </div>
                        <div className="ui checkbox radio radioBoxBlue checked">
                            <input type="radio"  className="hidden" name="Close-open" value="false" checked={this.state.selectedOption === "false"} onChange={this.radioChange} />
                            <label>Closed</label>
                        </div>
                    </div>
                </form>

                <div className="dropBtn">
                    <button className="primaryBtn-1 btn"
                    onClick={this.clickHandler}
                    >Submit</button>
                </div>
            </div>
            </div>
        )
    }
    GetData = (url, label, value, currState) => {
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
        }).catch(ex => {
        });

    }

}
export default CreateTransmittal;
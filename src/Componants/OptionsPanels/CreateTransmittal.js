import React, { Component } from './node_modules/react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import InputMelcous from './InputMelcous'
import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

//const _ = require('lodash')

class CreateTransmittal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sendingData: {
                projectId: this.props.projectId,
                docId: this.props.docId,
                docTypeId: this.props.docTypeId,
                arrange: "",
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
        }
        this.radioChange = this.radioChange.bind(this);
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
        
    }

    To_company_handleChange = (selectedOption) => {
       let url = "GetContactsByCompanyId?companyId=" + selectedOption.value;
        this.setState({
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
            sendingData: { ...this.state.sendingData, toContactId: item.value }
        })
    }

    render() {
            return (
                        <div className="dropWrapper">   

                            <InputMelcous  title='subject'
                                           placeholderText='subject'
                                           fullwidth='true' inputChangeHandler={this.inputChangeHandler} />

                            <Dropdown title='toCompany'
                                      data={this.state.ToCompany} handleChange={this.To_company_handleChange}
                                      placeholder='selectCompany' />

                            <Dropdown title='ToContact'
                                      data={this.state.AttentionData} handleChange={this.Attention_handleChange} 
                                      placeholder='selectContact'/>

                            <Dropdown title='priority'
                                      data={this.state.PriorityData} handleChange={this.Priority_handelChange} 
                                      placeholder='prioritySelect'/>

                            <Dropdown title='submittedFor'
                                      data={this.state.SubmittedForData} handleChange={this.SubmittedFor_handelChange}
                                      placeholder='submittedForSelect' />

                            <form className="proForm">
                                <div className="linebylineInput">
                                    <label className="control-label"> {Resources['statusName'][currentLanguage]} </label>

                                        <div className="ui checkbox radio radioBoxBlue">
                                            <input type="radio"  className="hidden" name="Close-open" value="true" 
                                                //   checked={this.state.selectedOption === "true"}
                                                 onChange={this.radioChange} />
                                            <label>{Resources['oppened'][currentLanguage]}</label>
                                        </div>

                                        <div className="ui checkbox radio radioBoxBlue checked">
                                            <input type="radio"   name="Close-open" value="false"
                                            // checked={this.state.selectedOption === "false"}
                                             onChange={this.radioChange} />
                                            <label> {Resources['closed'][currentLanguage]}</label>
                                        </div> 
                                </div>
                            </form>

                            <div className="fullWidthWrapper">
                                <button className="primaryBtn-1 btn" onClick={this.clickHandler} >
                                        {Resources['save'][currentLanguage]}</button>
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
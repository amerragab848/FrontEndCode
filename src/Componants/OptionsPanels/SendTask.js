import React, { Component } from 'react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import InputMelcous from './InputMelcous'
import validations from './validationRules';

const _ = require('lodash')

class SendTask extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sendingData: {
                projectId: "4330",
                docId: "183",
                arrange: "",
                docType: "64",

                contactId: "",
                toCompanyId: "",
                Subject: "",
                priorityId: "",
                startDate: '',
                finishDate: '',
                estimatedTime: ''
            },
            PriorityData: [],
            ToCompany: [],
            contactData: [],

        }

    }

    componentDidMount = () => {
        let url = "GetProjectProjectsCompaniesForList?projectId=" + this.state.sendingData.projectId;
        this.GetData(url, 'companyName', 'companyId', 'ToCompany');
        this.GetData("GetAccountsDefaultList?listType=priority&pageNumber=0&pageSize=10000", 'title', 'id', 'PriorityData');
        
    }
    
    inputSubjectChangeHandler = (e) => {
        this.setState({ sendingData: { ...this.state.sendingData, Subject: e.target.value } });
    }

    inputEstimatedTimeChangeHandler = (e) => {
        this.setState({ sendingData: { ...this.state.sendingData, estimatedTime: e.target.value } });
    }

    To_company_handleChange = (selectedOption) => {
        let url = "GetContactsByCompanyId?companyId=" + selectedOption.value;
        this.GetData(url, "contactName", "id", "contactData");
        this.setState({
            sendingData: { ...this.state.sendingData, toCompanyId: selectedOption.value },
        });


    }

    Priority_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, priorityId: item.value },
        })
    }

    Contact_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, contactId: item.value },
        })
    }
    render() {
        return (
            <div><h1>Send Task</h1>
                <div className="dropWrapper">

                    <InputMelcous title="Subject" value="add subject"
                        placeholderText='Subject' inputChangeHandler={this.inputSubjectChangeHandler} text='task:' />

                    <Dropdown title="To Company"
                        data={this.state.ToCompany}
                        handleChange={this.To_company_handleChange}
                    //   className={this.state.toCompanyClass} message={this.state.toCompanyErrorMess} 
                    />

                    <Dropdown title="Contact Name"
                        data={this.state.contactData}
                        handleChange={this.Contact_handelChange}
                    //className={this.state.attentionClass} message={this.state.attentionErrorMess}
                    />
                   
                   {/* // datepicker startDate
                   // datepicker endDate */}

                    <InputMelcous title="Estimated Time" value="add Estimated Time"
                        placeholderText='Estimated Time' inputChangeHandler={this.inputEstimatedTimeSubjectChangeHandler} text='0' />


                    <Dropdown title="Priority"
                        data={this.state.PriorityData}
                        handleChange={this.Priority_handelChange}
                    //className={this.state.priorityClass} message={this.state.priorityErrorMess}
                    />


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
export default SendTask;
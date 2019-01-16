import React, { Component } from 'react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import InputMelcous from './InputMelcous'
import validations from './validationRules';
// datepicker
import DatePicker from './DatePicker'
import moment from 'moment';

const _ = require('lodash')

class SendTask extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sendingData: {
               
                docId: "969",
                arrange: "1",
                docTypeId: '19',

                bicContactId: "",
                bicCompanyId: "",
                Subject: "",
                Priority: "",
                status: true,
                startDate: moment(),
                finishDate: moment(),
                estimateTime: ""
            },
            projectId: "4330",
            PriorityData: [],
            ToCompany: [],
            contactData: [],
            contactValue: ''
        }

    }

    componentDidMount = () => {
        let url = "GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId;
        this.GetData(url, 'companyName', 'companyId', 'ToCompany');
        this.GetData("GetAccountsDefaultList?listType=priority&pageNumber=0&pageSize=10000", 'title', 'id', 'PriorityData');
        
    }

    clickHandler = (e) => {
        let inboxDto={...this.state.sendingData};      
           console.log(inboxDto);
           Api.post("SendTask", inboxDto)
    }
    
    startDatehandleChange = (date) => {
        this.setState({ sendingData: { ...this.state.sendingData, startDate: date } });
    }

    finishDatehandleChange = (date) => {
            this.setState({ sendingData: { ...this.state.sendingData, finishDate: date } });
    }

    inputSubjectChangeHandler = (e) => {
        this.setState({ sendingData: { ...this.state.sendingData, Subject: e.target.value } });
    }

    inputEstimatedTimeChangeHandler = (e) => {
        this.setState({ sendingData: { ...this.state.sendingData, estimateTime: e.target.value } });
    }

    To_company_handleChange = (selectedOption) => {
        let url = "GetContactsByCompanyId?companyId=" + selectedOption.value;
        this.setState({
            contactValue:3258,
            sendingData: { ...this.state.sendingData, bicCompanyId: selectedOption.value },
        });
        this.GetData(url, "contactName", "id", "contactData");
       
        this.setState({
            contactValue:3258,
        });
  
       
      

    }

    valueFromId = (opts, id) => opts.find(o => o.value === id);


    Priority_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, Priority: item.value },
        })
    }

    Contact_handelChange = (item) => {
        this.setState({
            contactValue:item,
            sendingData: { ...this.state.sendingData, bicContactId: item.value },
        })
    }
    render() {
        return (
            <div><h1>Send Task</h1>
                <div className="dropWrapper">
                      
                    <InputMelcous fullwidth='true'
                     title="Subject"
                        placeholderText='Subject' inputChangeHandler={this.inputSubjectChangeHandler} 
                        value={this.state.subjectDefulart} 
                        defulatValue='Task :'
                        />

                    <Dropdown title="To Company"
                        data={this.state.ToCompany}
                        handleChange={this.To_company_handleChange}
                    //   className={this.state.toCompanyClass} message={this.state.toCompanyErrorMess} 
                    />

                    <Dropdown title="Contact Name"
                        data={this.state.contactData}
                        handleChange={this.Contact_handelChange}
                        //value={this.state.contactValue}
                      //  defaultValue={this.state.contactValue}
                      value={this.valueFromId(this.state.contactData, this.state.contactValue)}
                    //className={this.state.attentionClass} message={this.state.attentionErrorMess}
                    />
                   
                 
                    <DatePicker title='Start Date' startDate={this.state.sendingData.startDate} handleChange={this.startDatehandleChange} />
                    <DatePicker title='Finish Date' startDate={this.state.sendingData.finishDate} handleChange={this.finishDatehandleChange} />

                    <InputMelcous title="Estimated Time" 
                        placeholderText='Estimated Time' 
                         inputChangeHandler={this.inputEstimatedTimeChangeHandler} 
                         defulatValue='0' />


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
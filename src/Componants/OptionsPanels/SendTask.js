import React, { Component } from 'react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import InputMelcous from './InputMelcous'
import Resources from '../../resources.json';
import DatePicker from './DatePicker'
import moment from 'moment';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
 
class SendTask extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sendingData: {
                projectId: this.props.projectId,
                docId: this.props.docId,
                docType: this.props.docTypeId,
                bicContactId: "",
                arrange: "1",
                bicCompanyId: "",
                Subject: "",
                Priority: "",
                status: true,
                startDate: moment(),
                finishDate: moment(),
                estimateTime: "",
            },

            PriorityData: [],
            ToCompany: [],
            contactData: []
        }

    }

    componentDidMount = () => {
        let url = "GetProjectProjectsCompaniesForList?projectId=" + this.state.sendingData.projectId;
        this.GetData(url, 'companyName', 'companyId', 'ToCompany');
        this.GetData("GetAccountsDefaultList?listType=priority&pageNumber=0&pageSize=10000", 'title', 'id', 'PriorityData');

    }

    clickHandler = (e) => {
        let inboxDto = { ...this.state.sendingData }; 
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
            sendingData: { ...this.state.sendingData, bicCompanyId: selectedOption.value },
        });
        this.GetData(url, "contactName", "id", "contactData");
    }

    Priority_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, Priority: item.value },
        })
    }

    Contact_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, bicContactId: item.value },
        })
    }
    render() {
        return (

            <div className="proForm">
                <div className="dropWrapper">
                    <InputMelcous fullwidth='true' title='subject'
                        placeholderText='subject'
                        defaultValue={Resources['Task'][currentLanguage] + ':'}
                        inputChangeHandler={this.inputSubjectChangeHandler} />

                    <Dropdown title='toCompany'
                        data={this.state.ToCompany} handleChange={this.To_company_handleChange}
                        placeholder='selectCompany' />

                    <Dropdown title='ContactName'
                        data={this.state.contactData} handleChange={this.Contact_handelChange}
                        placeholder='selectContact' />

                    <DatePicker title='startDate'
                        startDate={this.state.sendingData.startDate}
                        handleChange={this.startDatehandleChange} />

                    <DatePicker title='finishDate'
                        startDate={this.state.sendingData.finishDate}
                        handleChange={this.finishDatehandleChange} />

                    <div className="fullWidthWrapper">
                        <button className="primaryBtn-1 btn" onClick={this.clickHandler}>
                            {Resources['save'][currentLanguage]}</button>
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
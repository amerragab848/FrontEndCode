import React, { Component } from 'react'
import Api from './api'
import Dropdown from "./DropdownMelcous";
import InputMelcous from './InputMelcous'
import validations from './validationRules';
const _ = require('lodash')
class SendToInbox extends Component {
    constructor(props) {
        super(props)
        this.state = {

            sendingData: {
                projectId: "4330",
                docId: "183",
                arrange: "",
                docType: "64",
                priorityId: "",
                toCompanyId: "",

                toContactId: "",
                ccCompanyId: "",

                cc: [],
                Comment: ""
            },


            PriorityData: [],
            To_Cc_CompanyData: [],
            AttentionData: [],
            Cc_ContactData: [],
            Cc_Selected: [],

            validPriority: false,
            priorityErrorMess: "",
            priorityClass: "",

            validToCompany: false,
            toCompanyErrorMess: "",
            toCompanyClass: "",

            validAttention: false,
            attentionErrorMess: "",
            attentionClass: ""
        }
    }
    Priority_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, priorityId: item.value },
            validPriority: !validations.equals("Select...", item.label),
            priorityClass: (validations.equals("Select...", item.label) ? "borderError" : "borderValid"),
            priorityErrorMess: ""

        })

    }

    Attention_handleChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, toContactId: item.value },
            validAttention: !validations.equals("Select...", item.label),
            attentionClass: (validations.equals("Select...", item.label) ? "borderError" : "borderValid"),
            attentionErrorMess: ""
        })

    }

    To_company_handleChange = (selectedOption) => {
        let url = "GetContactsByCompanyIdForOnlyUsers?companyId=" + selectedOption.value;
        this.GetData(url, "contactName", "id", "AttentionData");
        this.setState({
            sendingData: { ...this.state.sendingData, toCompanyId: selectedOption.value },
            validToCompany: !validations.equals("Select...", selectedOption.label),
            toCompanyClass: (validations.equals("Select...", selectedOption.label) ? "borderError" : "borderValid"),
            toCompanyErrorMess: ""
        });

    }

    Cc_company_handleChange = (selectedOption) => {
        let url = "GetContactsByCompanyId?companyId=" + selectedOption.value;
        this.setState({
            sendingData: { ...this.state.sendingData, ccCompanyId: selectedOption.value }
        });

        this.GetData(url, "contactName", "id", "Cc_ContactData");
    }

    Cc_Contact_handleChange = (selectedOption) => {
      
        this.setState({
            sendingData: {
                ...this.state.sendingData, cc: _.map(selectedOption,function(item){return item.value })
            }
        })

    }


    componentDidMount = () => {
        let url = "GetProjectProjectsCompaniesForList?projectId=" + this.state.sendingData.projectId;
        this.GetData(url, 'companyName', 'companyId', 'To_Cc_CompanyData');
        this.GetData("GetAccountsDefaultList?listType=priority&pageNumber=0&pageSize=10000", 'title', 'id', 'PriorityData');
    }


    inputChangeHandler = (e) => {
        this.setState({ sendingData: { ...this.state.sendingData, Comment: e.target.value } });
    }

    clickHandler = (e) => {
        if (!this.state.validPriority) {
            this.setState({
                priorityClass: "borderError",
                priorityErrorMess: "please select Priority"

            })
        }
        if (!this.state.validAttention) {
            this.setState({
                attentionClass: "borderError",
                attentionErrorMess: "please select Attention"

            })
        }
        if (!this.state.validToCompany) {
            this.setState({
                toCompanyClass: "borderError",
                toCompanyErrorMess: "please select To Company"

            })
        }
        if (this.state.validToCompany && this.state.validAttention && this.state.validPriority) {
 

            let inboxDto={...this.state.sendnigData};
            
            
            console.log(inboxDto);
            //Api.post("SendByInbox", inboxDto)
        }
    }

    render() {
        return (
            <div className="dropWrapper">
                <Dropdown title="Priority" data={this.state.PriorityData} handleChange={this.Priority_handelChange}
                    className={this.state.priorityClass} message={this.state.priorityErrorMess} />

                <InputMelcous title="Comment" value="add comment" inputChangeHandler={this.inputChangeHandler} />

                <Dropdown title="To Company" data={this.state.To_Cc_CompanyData} handleChange={this.To_company_handleChange}
                    className={this.state.toCompanyClass} message={this.state.toCompanyErrorMess} />

                <Dropdown title="Attention" data={this.state.AttentionData} handleChange={this.Attention_handleChange}
                    className={this.state.attentionClass} message={this.state.attentionErrorMess} />

                <Dropdown title="CC Company" data={this.state.To_Cc_CompanyData} handleChange={this.Cc_company_handleChange}
                    onblur="" message="" />
                <div className="filterWrapper">
                    <Dropdown title="CC Contact" data={this.state.Cc_ContactData} handleChange={this.Cc_Contact_handleChange}
                        isMulti="true" message="" />

                </div>
                <div className="dropBtn">
                    <button className="primaryBtn-1 btn" onClick={this.clickHandler}>Submit</button>
                </div>
            </div>

        );
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

    Validate() {

    }
}




export default SendToInbox;
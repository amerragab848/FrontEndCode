import React, { Component } from "react";
import Api from "../../api";
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from "../../resources.json";
let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

//const _ = require('lodash')

class WFExpense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sendingData: {
                expenseId: 31451,
                workFlowId: '',
                accountId: '',
                subject: 'trainning',
                expenseTypeId: 177,
            },
            workFlowData: [],
            approvedToData: [],
            selectedWF: '',
            selectedApprovedTo: ''
        };
    }

    componentDidMount = () => {
        Api.get("ExpensesWorkFlowGet").then(result => {
            let data = [];
            result.forEach(element => {
                data.push({ label: element.subject, value: element.id })
            });
            this.setState({
                workFlowData: data
            });
        });


    };

    workFlowHandelChange = (Item) => {
        Api.get("GetExpensesWorkFlowFirstLevelByWorkFlowId?workFlow=" + Item.value).then(result => {
            let data = [];
            result.forEach(element => {
                data.push({ label: element.contactName, value: element.contactId })
            });
            this.setState({
                sendingData: { ...this.state.sendingData, workFlowId: Item.value }, approvedToData: data, selectedApprovedTo: '', selectedWF: Item
            });
        });
    }
    approvedHandelChange = (Item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, accountId: Item.value }, selectedApprovedTo: Item
        });
    }

    sendClick = () => {
        Api.post('sendToExpensesWorkFlow', this.state.sendingData)
    }
    render() {
        return (
            <div className="ui modal mediumModal">
                <div className="dropWrapper">
                    <div className="fullWidthWrapper">
                        <h2 className="headCustom">{Resources["workFlow"][currentLanguage]}</h2>
                    </div>
                    <Dropdown
                        title="workFlow"
                        data={this.state.workFlowData}
                        handleChange={this.workFlowHandelChange}
                        placeholder="workFlow"

                    />
                    <Dropdown
                        title="Projects"
                        data={this.state.approvedToData}
                        handleChange={this.approvedHandelChange}
                        selectedValue={this.state.selectedApprovedTo}
                        placeholder="Projects"
                    />
                    <div className="dropBtn">
                        <button
                            className="primaryBtn-1 btn"
                            onClick={this.sendClick}
                        >
                            {Resources["send"][currentLanguage]}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default WFExpense;

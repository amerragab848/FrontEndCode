import React, { Component } from 'react'
import Api from '../../api'
import Dropdown from "./DropdownMelcous";
import Resources from '../../resources.json';
import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';

import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class SendWorkFlow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            workFlowData: {
                projectId: this.props.projectId,
                docId: this.props.docId,
                docTypeId: this.props.docTypeId,
                arrange: "",
                workFlowId: null,
                contacts: [],
                dueDate: "",
                useSelection: false
            },
            selectedWorkFlow: { label: "select WorkFlow", value: 0 },
            selectedContact: [],
            submitLoading: false,
            WorkFlowData: [],
            WorkFlowContactData: [],
            useSelection: false
        }
    }

    workFlowhandelChange = (item) => {
        this.setState({
            selectedWorkFlow: item,
            selectedContact: [],
            useSelection: item.useSelection == true ? true : false
        });
        console.log(item, 'workFlowhandelChange');

        let url = "GetProjectWorkFlowContactsFirstLevelForList?workFlow=" + item.value;
        this.GetData(url, "contactName", "accountId", "WorkFlowContactData", 2);
    }

    componentDidMount = () => {

        let url = "ProjectWorkFlowGetList?projectId=" + this.state.workFlowData.projectId;
        this.GetData(url, 'subject', 'id', 'WorkFlowData', 1);
        this.props.actions.SendingWorkFlow(true);
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.showModal != state.showModal) {
            return { submitLoading: false };
        }
        return null
    }

    inputChangeHandler = (e) => {
        this.setState({ workFlowData: { ...this.state.workFlowData, Comment: e.target.value } });
    }

    toAccounthandelChange = (item) => {
        this.setState({
            selectedContact: item
        });
    }

    clickHandler = (e) => {
        this.setState({ submitLoading: true })
        var ids = this.state.selectedContact;
        if (this.state.useSelection == true) {
            ids = ids.map(i => i.value)
        } else {
            ids = [ids.value]
        }
        let workFlowObj = { ...this.state.workFlowData };
        workFlowObj.contacts = ids;
        workFlowObj.workFlowId = this.state.selectedWorkFlow.value;
        workFlowObj.useSelection = this.state.useSelection;

        let url = 'GetCycleWorkflowByDocIdDocType?docId=' + this.props.docId + '&docType=' + this.props.docTypeId + '&projectId=' + this.props.projectId;
        this.props.actions.SnedToWorkFlow("SnedToWorkFlow", workFlowObj, url);
    }

    render() {
        return (
            <div className="dropWrapper proForm">
                <Dropdown title="workFlow"
                    data={this.state.WorkFlowData}
                    handleChange={this.workFlowhandelChange}
                    selectedValue={this.state.selectedWorkFlow}
                    index='ddlworkFlow' className={this.state.priorityClass} />

                <Dropdown title="contact"
                    data={this.state.WorkFlowContactData}
                    name="ddlApproveTo"
                    selectedValue={this.state.selectedContact}
                    value={this.state.selectedContact}
                    index='ddlApproveTo'
                    isMulti={this.state.useSelection == true ? true : false}
                    handleChange={this.toAccounthandelChange}
                    className={this.state.toCompanyClass}
                />
                <div className="fullWidthWrapper">
                    {!this.state.submitLoading ?
                        <button className="workFlowDataBtn-1 mediumBtn primaryBtn-1 btn middle__btn" onClick={this.clickHandler}>{Resources['send'][currentLanguage]}</button>
                        : (
                            <button className="primaryBtn-1 btn  mediumBtn disabled">
                                <div className="spinner">
                                    <div className="bounce1" />
                                    <div className="bounce2" />
                                    <div className="bounce3" />
                                </div>
                            </button>
                        )}
                </div>
            </div>
        );
    }

    GetData = (url, label, value, currState, type) => {
        let Data = [];
        Api.get(url).then(result => {

            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                if (type == 1) { obj.useSelection = item["useSelection"] };
                Data.push(obj);
            });

            this.setState({
                [currState]: [...Data]
            });

            switch (type) {

                case 1:
                    Api.get("GetProjectWorkFlowContactsFirstLevelForList?workFlow=" + Data[0].value).then(result2 => {
                        let Data2 = [];
                        (result2).forEach(item => {
                            var obj2 = {};
                            obj2.label = item["contactName"];
                            obj2.value = item["accountId"];
                            Data2.push(obj2);
                        });

                        let useSelection = Data[0]["useSelection"];

                        this.setState({
                            selectedWorkFlow: Data[0],
                            WorkFlowContactData: [...Data2],
                            useSelection
                        });
                    });

                    break;

                case 2:
                    this.setState({
                        selectedContact: []
                    });
                    break;

            }

        }).catch(ex => {
        });
    }
}

function mapStateToProps(state) {

    return {
        workFlowCycles: state.communication.workFlowCycles,
        hasWorkflow: state.communication.hasWorkflow,
        showModal: state.communication.showModal
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SendWorkFlow);
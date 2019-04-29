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

const _ = require('lodash')

class SendWorkFlow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            workFlowData: {
                projectId: this.props.projectId,
                docId: this.props.docId,
                docTypeId: this.props.docTypeId,
                arrange: "",
                workFlowId: "",
                toAccountId: "",
                dueDate: ""
            },
            selectedWorkFlow: { label: "select WorkFlow", value: 0 },
            selectedApproveId: { label: "select To Contact", value: 0 },
            submitLoading: false,
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

        this.GetData(url, "contactName", "id", "WorkFlowContactData", 2);

    }

    componentDidMount = () => {
        let url = "ProjectWorkFlowGetList?projectId=" + this.state.workFlowData.projectId;
        this.GetData(url, 'subject', 'id', 'WorkFlowData', 1);
        this.props.actions.SendingWorkFlow(true);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showModal !== this.props.showModal) {
            this.setState({ submitLoading: false })
            console.log('showmodal changed...', nextProps.showModal)
        }
    }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.showModal != this.props.showModal) {
    //         if (this.props.showModal) {
    //             // this.setState({ submitLoading: true })
    //             this.props.actions.SendingWorkFlow(true);

    //         } else {
    //             this.setState({ submitLoading: false })
    //         }
    //         this.props.actions.SendingWorkFlow(this.props.showModal);
    //     }
    // }

    inputChangeHandler = (e) => {
        this.setState({ workFlowData: { ...this.state.workFlowData, Comment: e.target.value } });
    }

    toAccounthandelChange = (item) => {
        this.setState({
            toAccountId: { ...this.state.workFlowData, toAccountId: item.value },
            selectedApproveId: item
        });
    }

    clickHandler = (e) => {
        this.setState({ submitLoading: true })

        let workFlowObj = { ...this.state.workFlowData };
        workFlowObj.toAccountId = this.state.selectedApproveId.value;
        let url = 'GetCycleWorkflowByDocIdDocType?docId=' + this.props.docId + '&docType=' + this.props.docTypeId + '&projectId=' + this.props.projectId;
        this.props.actions.SnedToWorkFlow("SnedToWorkFlow", workFlowObj, url);

    }

    render() {
        return (
            <div className="dropWrapper">
                <Dropdown title="workFlow"
                    data={this.state.WorkFlowData}
                    handleChange={this.workFlowhandelChange}
                    selectedValue={this.state.selectedWorkFlow}
                    index='ddlworkFlow' className={this.state.priorityClass} />

                <Dropdown title="contact"
                    data={this.state.WorkFlowContactData}
                    name="ddlApproveTo"
                    selectedValue={this.state.selectedApproveId}
                    index='ddlApproveTo'
                    handleChange={this.toAccounthandelChange}
                    className={this.state.toCompanyClass} />
                {!this.state.submitLoading ?
                    <div className="fullWidthWrapper">
                        <button className="workFlowDataBtn-1 primaryBtn-1 btn middle__btn" onClick={this.clickHandler}>{Resources['send'][currentLanguage]}</button>
                    </div>
                    : (
                        <span className="primaryBtn-1 btn largeBtn disabled">
                            <div className="spinner">
                                <div className="bounce1" />
                                <div className="bounce2" />
                                <div className="bounce3" />
                            </div>
                        </span>
                    )}
            </div>
        );
    }

    GetData = (url, label, value, currState, type) => {
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

            switch (type) {
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
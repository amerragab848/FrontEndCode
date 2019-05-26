import React from 'react';
import SkyLight from 'react-skylight';
import DropDown from './DropdownMelcous'
import SendTask from "./SendTask";
import CreateTransmittal from "./CreateTransmittal";
import ExportDetails from "./ExportDetails";
import SendToInbox from './SendToInbox'
import SendByEmails from './SendByEmails'
import CopyTo from './CopyTo'

import Resources from '../../resources.json';
import Config from '../../Services/Config';

import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';

import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const _ = require("lodash")

class OptionContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentComponent: '',
            currentTitle: 'LogControls',
            selectedPanels: [],
            showModal: false,
            defualtValue: { label: Resources["otherActions"][currentLanguage], value: '0' },
            data: [
                { title: "export", value: <ExportDetails />, label: Resources["export"][currentLanguage] },
                { title: "copyTo", value: <CopyTo docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />, label: Resources["copyTo"][currentLanguage] },
                { title: "sendByEmail", value: <SendByEmails docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />, label: Resources["sendByEmail"][currentLanguage] },
                { title: "sendByInbox", value: <SendToInbox docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />, label: Resources["sendByInbox"][currentLanguage] },
                { title: "sendTask", value: <SendTask docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />, label: Resources["sendTask"][currentLanguage] },
                { title: "createTransmittal", value: <CreateTransmittal docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />, label: Resources["createTransmittal"][currentLanguage] },
            ]
        }
    }

    componentWillReceiveProps(nextProps, prevState) {
        if (nextProps.showModal != prevState.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }
    };

    handleChange = (item) => {
        if (item.value != "0") {
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal: true
            })
            this.simpleDialog.show()
        }
    }

    IsAllow = (permission) => {
        let obj = _.find(this.props.permission, function (o) { return o.name == permission; });
        return Config.IsAllow(obj.code);
    }

    componentDidMount = () => {
        let allowPanel = _.filter(this.state.data, (item) => {
            if (item.value != '0') {
                if (item.title != 'export' && item.title != 'copyTo') {
                    return this.IsAllow(item.title)
                } else {
                  return  item
                }
            } else {
                return item;
            }
        })
        this.setState({ selectedPanels: allowPanel })
    }

    render() {
        return (
            <div>
                <DropDown data={this.state.selectedPanels} name="ddlActions" handleChange={this.handleChange} index='ddlActions' selectedValue={this.state.defualtValue} />
                <div className="largePopup" style={{ display: this.state.showModal ? 'block' : 'none' }} key="opActions">
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {this.state.currentComponent}
                    </SkyLight>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
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
)(OptionContainer);
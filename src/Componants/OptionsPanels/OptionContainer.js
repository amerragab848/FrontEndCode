import React from 'react';
import SkyLight from 'react-skylight';
import DropDown from './DropdownMelcous'
import SendTask from "./SendTask";
import CreateTransmittal from "./CreateTransmittal";
import SendToInbox from './SendToInbox'
import SendByEmails from './SendByEmails'

import Resources from '../../resources.json';
import Config from '../../Services/Config';
//import permissions from '../../permissions.json';
 
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
            defualtValue:{label: Resources["LogControls"][currentLanguage],value: '0'},
            data: [ 
                    { title: "sendByEmail", value: <SendByEmails docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />,label: Resources["sendByEmail"][currentLanguage] },
                    { title: "sendByInbox", value: <SendToInbox docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />,label: Resources["sendByInbox"][currentLanguage] },
                    { title: "sendTask", value: <SendTask docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />,label: Resources["sendTask"][currentLanguage] },
                    { title: "createTransmittal", value: <CreateTransmittal docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />,label: Resources["createTransmittal"][currentLanguage] },
                    //{ title: "distributionList", value: <Distribution docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />,label: Resources["distributionList"][currentLanguage] },
                   // { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />,label: Resources["sendToWorkFlow"][currentLanguage] }
                ] 
        }
    }
    
    componentWillReceiveProps(nextProps, prevState) {
        if (nextProps.showModal != prevState.showModal) {
            this.setState({ showModal: nextProps.showModal });  
        } 
    };

    handleChange = (item) => {
        if(item.value!="0"){ 
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title,
                showModal:true
            })
            this.simpleDialog.show()
        }   
    }

    IsAllow = (permission) => {
        let obj=_.find(this.props.permission, function(o) { return o.name == permission; }); 
        return Config.IsAllow(obj.code);
    }

    componentDidMount = () => {  
        let allowPanel = _.filter(this.state.data, (item) => {
            if(item.value != '0') {
                return this.IsAllow(item.title)
            }else{
                return item;
            }
        })
        this.setState({ selectedPanels: allowPanel })
    }

    render() { 
        return (
            <div>
                <DropDown data={this.state.selectedPanels} name="panel" handleChange={this.handleChange} index='panelIndex'  selectedValue={this.state.defualtValue} />
                <div className="largePopup"  style={{ display: this.state.showModal ? 'block': 'none' }}>
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
import React from 'react';
import SkyLight from 'react-skylight';
import DropDown from './DropdownMelcous'
import Distribution from './DistributionList'
import SendToWorkflow from './SendWorkFlow'
import SendTask from "./SendTask";
import CreateTransmittal from "./CreateTransmittal";
import SendToInbox from './SendToInbox'
import SendByEmails from './SendByEmails'

import Resources from '../../resources.json';
import Config from '../../Services/Config';
import permissions from '../../permissions.json';
 
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const _ = require("lodash")
 
class OptionContainer extends React.Component {
    constructor(props) {
        super(props); 
        // let permissionDoc=permissions.authorization;
        // console.log(permissionDoc);
        // let mod=_.find(permissionDoc, function(o) { return o.id === 7; });
        // let permissinsList=_.find(mod.modules, function(o) { return o.id === 19; });
        // console.log(permissinsList);

        this.state = {
            currentComponent: '',
            currentTitle: 'LogControls',
            selectedPanels: [],
            defualtValue:{label: Resources["LogControls"][currentLanguage],value: '0'},
            data: [ 
                    { title: "sendByEmail", value: <SendByEmails docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />,label: Resources["sendByEmail"][currentLanguage] },
                    { title: "sendByInbox", value: <SendToInbox docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />,label: Resources["sendByInbox"][currentLanguage] },
                    { title: "sendTask", value: <SendTask docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />,label: Resources["sendTask"][currentLanguage] },
                    { title: "distributionList", value: <Distribution docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />,label: Resources["distributionList"][currentLanguage] },
                    { title: "createTransmittal", value: <CreateTransmittal docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />,label: Resources["createTransmittal"][currentLanguage] },
                    { title: "sendToWorkFlow", value: <SendToWorkflow docTypeId={this.props.docTypeId} docId={this.props.docId} projectId={this.props.projectId} />,label: Resources["sendToWorkFlow"][currentLanguage] }] 
        }
    }

    handleChange = (item) => {
        if(item.value!="0"){
            this.setState({
                currentComponent: item.value,
                currentTitle: item.title
            })
            this.simpleDialog.show()
        }   
    }

    IsAllow = (permission) => {
        let obj=_.find(this.props.permission, function(o) { return o.name == permission; });
        console.log(obj);
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
                <div className="largePopup">
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {this.state.currentComponent}
                    </SkyLight>
                </div>
            </div>
        )
    }
}


export default OptionContainer;
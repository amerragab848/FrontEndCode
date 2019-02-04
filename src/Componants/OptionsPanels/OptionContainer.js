import React from 'react';
import SkyLight from 'react-skylight';
import DropDown from './DropdownMelcous'
import Distribution from './DistributionList'
import SendToWorkflow from './SendWorkFlow'
import SendTask from "./SendTask";
import CreateTransmittal from "./CreateTransmittal";
import SendToInbox from './SendToInbox'

import Resources from '../../resources.json';
import { Data } from 'react-data-grid-addons';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const _ = require("lodash")

const data = [
    { label: "sendByEmail", value: '' },
    { label: "sendByInbox", value: <SendToInbox /> },
    { label: "sendTask", value: <SendTask /> },
    { label: "distributionList", value: <Distribution /> },
    { label: "createTransmittal", value: <CreateTransmittal /> },
    { label: "sendToWorkFlow", value: <SendToWorkflow /> },
]

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentComponent: '',
            currentTitle: 'sendByEmail',
            Data: []
        }


    }
    handleChange = (item) => {
        this.setState({
            currentComponent: item.value,
            currentTitle: item.label
        })
        this.simpleDialog.show()
    }
    IsAllow = (permission) => {
        if (permission === "sendByEmail")
            return false;
        return true;
    }
    componentDidMount = () => {


        let temp = _.filter(data, (item) => {
            return this.IsAllow(item.label)
        })
        this.setState({ Data: temp })
    }
    render() {

        return (
            <div>
                <DropDown data={this.state.Data} name="toCompanydd" handleChange={this.handleChange}
                    index='toCompanyddinbox' name="toCompany" />
                <div className="largePopup">
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources[this.state.currentTitle][currentLanguage]}>
                        {this.state.currentComponent}
                    </SkyLight>
                </div>
            </div>
        )
    }
}


export default Example;
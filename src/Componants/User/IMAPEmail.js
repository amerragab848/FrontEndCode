import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import config from "../../Services/Config";
import { toast } from "react-toastify";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import Dropdown from '../OptionsPanels/DropdownMelcous';
import LoadingSection from '../publicComponants/LoadingSection';
import moment from 'moment';


let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class filesSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            imapEmailsList: [],
            selectedImapEmail: null,
            isLoading: false,
            rows: []
           
        }
    }

    componentDidMount = () => {
        dataservice.GetDataList('GetImapConfiguration', 'name', 'id').then(result => {
            this.setState({ imapEmailsList: result || [] });
        });
    }
    
    handleChange = (e) => {
        this.setState({ isLoading: true })
        dataservice.GetDataGrid(`SynchronizeEmails?configurationSetId=${e.value}`).then(result => {
            this.setState({
                selectedImapEmail: e.value,
                rows: result || [],
                isLoading: false
            })
        })
    }

    render() {
        let table = <table className="attachmentTable">
            <thead>
                <tr>
                    <th>
                        <div className="headCell">
                            <span>
                                Form Email
                            </span>
                        </div>
                    </th>
                    <th>
                        <div className="headCell">
                            <span>
                                Subject
                            </span>
                        </div>
                    </th>
                    <th>
                        <div className="headCell">
                            <span>
                                Date
                            </span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    this.state.rows.map((element, index) => {
                        return (
                            <>
                                <tr key={index} >
                                    <td colspan="12" style={{ paddingLeft: '18px !important' }}>
                                        {element.fromEmail}
                                    </td>
                                    <td colspan="12" style={{ paddingLeft: '18px !important' }}>
                                        {element.subject}
                                    </td>
                                    <td colspan="12" style={{ paddingLeft: '18px !important' }}>
                                        {moment(element.date).format('DD/MM/YYYY')}
                                    </td>
                                </tr>
                            </>
                        )
                    })
                }
            </tbody>
        </table>

        return (
            <div className="mainContainer">
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                    </div>
                    <div className="filterBTNS">
                    </div>
                </div>
                <header>
                    <h2 className="zero">IMAP Emails</h2>
                </header>
                <div className="proForm reports__proForm">
                    <div className="linebylineInput valid-input">
                        <Dropdown
                            title="imapConfigurationName"
                            data={this.state.imapEmailsList}
                            selectedValue={this.state.selectedImapEmail}
                            handleChange={e => { this.handleChange(e) }} />
                    </div>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {this.state.isLoading == false ? table : <LoadingSection />}
                </div>








            </div>








        )
    }
}
export default withRouter(filesSettings)
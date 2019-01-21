
import React, { Component } from 'react'
import Api from '../../api';
import Dropdown from "./DropdownMelcous";
import DatePicker from './DatePicker'
import Recycle from '../../Styles/images/attacheRecycle.png'
import ReactTable from "react-table";
import 'react-table/react-table.css'
import moment from 'moment';

import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const _ = require('lodash')
class DistributionList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sendingData: {
                projectId: "4330",
                docId: "138",
                DistributionListId: "",
                Priority: "",
                RequiredDate: moment().format(),
                docTypeId: "64",
                itemContacts: [],
                redDays: 1,
                yellowDays: 1,
                greenDays: 1

            },
            PriorityData: [],
            CompanyData: [],
            ContactNameData: [],
            seletedCompany: "",
            selectedConstact: '',
            ActionData: []

        };

    }

    onDelete(key, e) {
        e.preventDefault();
        const data = this.state.sendingData.itemContacts.filter(item => item.contactId !== key);

        this.setState({
            sendingData: { ...this.state.sendingData, itemContacts: data }

        });
    }
    onAdd = () => {
        if (this.state.selectedCompany != null && this.state.selectedConstact != null) {
            const data = [...this.state.sendingData.itemContacts];
            data.push({
                companyId: this.state.selectedCompany.value, companyName: this.state.selectedCompany.label,
                contactId: this.state.selectedConstact.value, contactName: this.state.selectedConstact.label, action: 0,
                SelectedAction: { label: "For Information", value: 0 }

            });

            this.setState({
                sendingData: { ...this.state.sendingData, itemContacts: data },
                selectedCompany: null,
                selectedConstact: null
            });
        }
    }

    Company_handleChange = (item) => {
        let url = "GetContactsByCompanyIdForOnlyUsers?companyId=" + item.value;
        this.GetData(url, "contactName", "id", "ContactNameData");
        this.setState({
            selectedCompany: item
        });

    }
    Contact_handleChange = (item) => {
        this.setState({
            selectedConstact: item
        });
    }

    actionHandler = (key, e) => {
        const data = this.state.sendingData.itemContacts.filter(function (item) {
            if (item.contactId === key) {
                item.SelectedAction = e
                item.action = e.value
            }
            return item
        });

        this.setState({
            sendingData: { ...this.state.sendingData, itemContacts: data }
        });

    }

    DistributionHanleChange = (item) => {
        let url = "GetProjectDistributionListItemsByDistributionId?distributionId=" + item.value;
        this.GetDistributionData(url);
        this.setState({ sendingData: { ...this.state.sendingData, DistributionListId: item.value } })

    }

    Priority_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, Priority: item.value }
        })

    }
    componentDidMount = () => {
        let url = "getProjectDistributionList?projectId=" + this.state.sendingData.projectId;
        let url2 = "GetProjectProjectsCompaniesForList?projectId=" + this.state.sendingData.projectId;
        this.GetData(url, 'subject', 'id', 'DistributionListDate');
        this.GetData("GetaccountsDefaultListForList?listType=priority", 'title', 'id', 'PriorityData');
        this.GetData(url2, 'companyName', 'companyId', 'CompanyData');
        this.GetData("GetaccountsDefaultListForList?listType=distribution_action", 'title', 'action', 'ActionData');

    }


    DatehandleChange = (date) => {
        this.setState({
            sendingData: { ...this.state.sendingData, RequiredDate: date }
        });
    }

    submitBtnHandler = () => {
        /// const currentRecords = this.selectTable.getResolvedState().sortedData;
        let tempData = this.state.sendingData.itemContacts.map(item => {
            return {
                companyId: item['companyId'], contactId: item['contactId'], companyName: item['companyName'],
                contactName: item['contactName'], action: ['action']
            }
        })

        this.setState({
            sendingData: { ...this.state.sendingData, itemContacts: tempData }
        })
        Api.post("SnedToDistributionList", this.state.sendingData)

    }

    render() {
        const columns = [
            {
                Cell: props => {
                    return (

                        <a onClick={e => this.onDelete(props.original.contactId, e)} href="#">
                            <img className="deleteImg" src={Recycle} alt="Del" />
                        </a>

                    )
                }, width: 30
            }, {
                Header: 'companyId',
                accessor: 'companyId',
                sortabel: true,
                filterable: true,
                width: 50, show: false
            }, {
                Header: Resources['CompanyName'][currentLanguage],
                accessor: 'companyName',
                width: 200,
                sortabel: true,
                filterable: true

            }, {
                Header: 'contactId',
                accessor: 'contactId', show: false

            }, {
                Header: Resources['ContactName'][currentLanguage],
                accessor: 'contactName',
                width: 250,
                sortabel: true,
                filterable: true
            }, {
                Header: Resources['action'][currentLanguage],
                accessor: 'action',
                Cell: props => {
                    return (<Dropdown title="" data={this.state.ActionData} handleChange={e => this.actionHandler(props.original.contactId, e)}
                        selectedValue={props.original.SelectedAction} index={Date.now()} />)
                },
                width: 200

            }
        ]

        return (
            <div className="dropWrapper">
                <Dropdown title="distributionList" data={this.state.DistributionListDate} handleChange={this.DistributionHanleChange}
                    index='Distribution' />

                <DatePicker startDate={this.state.sendingData.RequiredDate} handleChange={this.DatehandleChange} />

                <Dropdown title="priority" data={this.state.PriorityData} handleChange={this.Priority_handelChange}
                    index='Priority' />
                <div className="modal-header fullWidthWrapper"><h4 className="modal-title" >{Resources['addAnthorContact'][currentLanguage]}</h4></div>
                <br />

                <Dropdown title="CompanyName" data={this.state.CompanyData} handleChange={this.Company_handleChange}
                    index='Company' />

                <Dropdown title="ContactName" data={this.state.ContactNameData} handleChange={this.Contact_handleChange}
                    index='Contact' />
                <div className="fullWidthWrapper">
                    <button className="primaryBtn-1 btn" onClick={this.onAdd} >{Resources['addTitle'][currentLanguage]}</button>
                </div>
                <div className="fullWidthWrapper">
                    <h4 className="twoLineHeader">{Resources['contactList'][currentLanguage]}</h4>
                </div>
                <div className="modal-header fullWidthWrapper">
                    <ReactTable
                        ref={(r) => {
                            this.selectTable = r;
                        }}
                        data={this.state.sendingData.itemContacts}
                        columns={columns}
                        defaultPageSize={10}
                        minRows={2}
                        noDataText={Resources['noData'][currentLanguage]}
                    />


                </div>
                <div className="fullWidthWrapper">
                    <button className="primaryBtn-1 btn" onClick={this.submitBtnHandler}>{Resources['send'][currentLanguage]}</button>
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

    GetDistributionData = (url) => {
        let data = []
        Api.get(url).then(result => {
            result.map(item => {
                data.push({
                    companyId: item['companyId'], companyName: item['companyName'],
                    contactId: item['contactId'], contactName: item['contactName'], action: 0,
                    SelectedAction: { label: "For Information", value: 0 }
                })
            })
            this.setState({
                sendingData: { ...this.state.sendingData, itemContacts: data }

            })


        }).catch(ex => {
        });
    }
}

export default DistributionList;


import React, { Component } from 'react'
import Api from '../../api';
import Dropdown from "./DropdownMelcous";
import DatePicker from './DatePicker'
import Table from 'rc-table';
import Animate from 'rc-animate';
import Recycle from '../../Styles/images/attacheRecycle.png'
import 'rc-table/assets/index.css';
import 'rc-table/assets/animation.css';



import moment from 'moment';
import Index from '../Index';
const _ = require('lodash')
const AnimateBody = props => <Animate transitionName="move" component="tbody" {...props} />;
class DistributionList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: moment(),
            columns: [
                {
                    title: '',
                    dataIndex: '',
                    key: 'e',
                    render: (text, record) => (
                        <a onClick={e => this.onDelete(record.key, e)} href="#">
                            <img className="deleteImg" src={Recycle} alt="Del" />
                        </a>
                    ),
                },
                { title: 'Company Name', dataIndex: 'b', key: 'b' },
                { title: 'Contact Name', dataIndex: 'c', key: 'c' },
                {
                    title: 'Action',
                    dataIndex: '',
                    key: 'd',
                    render: (text, record) => (
                        <Dropdown title="" data={this.state.ActionData} handleChange={this.actionHandler} selectedValue={this.state.selectedValue} />

                    ),
                    width: 250
                }


            ],
            selectedValue: "",
            sendingData: {
                projectId: "3527",
                docId: "183",
                arrange: "",
                docType: "64",
                priorityId: "",
                DistributionDetails: []

            },
            DistributionListDate: [],
            PriorityData: [],
            CompanyData: [],
            ContactNameData: [],
            DistributionTabelData: [],
            selctedCompany: "",
            slectedConstact: '',
            ActionData: []

        };

    }

    onDelete(key, e) {
        e.preventDefault();
        const data = this.state.DistributionTabelData.filter(item => item.key !== key);
        const data2 = this.state.sendingData.DistributionDetails.filter(item => item.key !== key);

        this.setState({
            DistributionTabelData: data,
            sendingData: { ...this.state.sendingData, DistributionDetails: data2 }
        });
    }
    onAdd = () => {
        const data = [...this.state.DistributionTabelData];
        const _DistributionDetails = [...this.state.sendingData.DistributionDetails]
        data.push({
            b: this.state.selctedCompany.label,
            c: this.state.slectedConstact.label,
            key: Date.now(),
        });
        _DistributionDetails.push({
            'companyId': this.state.selctedCompany.value, 'contactId': this.state.slectedConstact.value,
            'companyName': this.state.selctedCompany.label, 'action': '0'
        })
        this.setState({
            DistributionTabelData: data,
            sendingData: { ...this.state.sendingData, DistributionDetails: _DistributionDetails }
        });



    }

    Company_handleChange = (item) => {
        let url = "GetContactsByCompanyIdForOnlyUsers?companyId=" + item.value;
        this.GetData(url, "contactName", "id", "ContactNameData");
        this.setState({
            selctedCompany: item
        });

    }
    Contact_handleChange = (item) => {
        this.setState({
            slectedConstact: item
        });
    }

    actionHandler = () => {
        this.setState({ selectedValue: this.state.ActionData[3] })
    }

    DistributionHanleChange = (item) => {
        let url = "GetProjectDistributionListItemsByDistributionId?distributionId=" + item.value;
        this.GetDistributionData(url);
      
    }


    Priority_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, priorityId: item.value }
        })

    }
    componentDidMount = () => {
        let url = "getProjectDistributionList?projectId=" + this.state.sendingData.projectId;
        let url2 = "GetProjectProjectsCompaniesForList?projectId=" + this.state.sendingData.projectId;
        this.GetData(url, 'subject', 'id', 'DistributionListDate');
        this.GetData("GetaccountsDefaultListForList?listType=priority", 'title', 'id', 'PriorityData');
        this.GetData(url2, 'companyName', 'companyId', 'CompanyData');
        this.GetData("GetaccountsDefaultListForList?listType=distribution_action", 'title', 'id', 'ActionData');
        this.setState({ selectedValue: this.state.ActionData[0] })

    }


    DatehandleChange = (date) => {
        this.setState({
            startDate: date
        });
    }

    submitBtnHandler = () => {
        console.log(this.state.sendingData)
    }

    render() {

        return (
            <div className="dropWrapper">
                <Dropdown title="Distribution List" data={this.state.DistributionListDate} handleChange={this.DistributionHanleChange} />

                <DatePicker startDate={this.state.startDate} handleChange={this.DatehandleChange} />

                <Dropdown title="Priority" data={this.state.PriorityData} handleChange={this.Priority_handelChange} />
                <div className="modal-header fullWidthWrapper"><h4 className="modal-title" >Add Another Contact</h4></div>
                <br />

                <Dropdown title="Company Name" data={this.state.CompanyData} handleChange={this.Company_handleChange} />

                <Dropdown title="Contact Name" data={this.state.ContactNameData} handleChange={this.Contact_handleChange} />
                <div className="fullWidthWrapper">
                    <button className="primaryBtn-1 btn" onClick={this.onAdd} >ADD</button>
                </div>
                <div className="fullWidthWrapper">
                    <h4 className="twoLineHeader">Contact List</h4>
                </div>
                <div className="modal-header fullWidthWrapper">

                    <Table
                        columns={this.state.columns}
                        data={this.state.DistributionTabelData}
                        components={{
                            body: { wrapper: AnimateBody },
                        }}
                    />

                </div>
                <div className="fullWidthWrapper">
                    <button className="primaryBtn-1 btn" onClick={this.submitBtnHandler}>SEND</button>
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
        let distributiondetail = []

        Api.get(url).then(result => {
            result.map((item, Index) => {
                data.push({ b: item['companyName'], c: item['contactName'], key: Index })


                distributiondetail.push({
                    'companyId': item['companyId'], 'contactId': item['contactId'],
                    'companyName': item['companyName'], 'action': '1', key: Index
                })

            })

            this.setState({
                DistributionTabelData: [...data],
                sendingData: { ...this.state.sendingData, DistributionDetails: distributiondetail }
            })


        }).catch(ex => {
        });
    }
}

export default DistributionList;

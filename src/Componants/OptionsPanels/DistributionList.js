
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
                { title: 'Action', dataIndex: 'a', key: 'a', width: 100 },
                { title: 'Company Name', dataIndex: 'b', key: 'b', width: 100 },
                { title: 'Contact Name', dataIndex: 'c', key: 'c', width: 200 },
                {
                    title: 'Action',
                    dataIndex: '',
                    key: 'd',
                    render: (text, record) => (
                      <Dropdown title="" data={this.state.ActionData} handleChange={this.DistributionDate} />
               
                    ),
                    width: 250,
                }

             
            ],

            data: [
             
            ],




            sendingData: {
                projectId: "3527",
                docId: "183",
                arrange: "",
                docType: "64",
                priorityId: "",
                CompanyId: "",

                toContactId: "",
                ccCompanyId: "",

                cc: [],
                Comment: ""
            },


            DistributionDate: [],
            PriorityData: [],
            CompanyData: [],
            ContactNameData: [],
            ActionData:[],
            DistributionList:[]


        };

    }

    onDelete(key, e) {
        console.log('Delete', key);
        e.preventDefault();
        const data = this.state.data.filter(item => item.key !== key);
        this.setState({ data });
    }
    onAdd=()=> {
        const data = [...this.state.data];
        data.push({
          a: 'new data',
          b: 'new data',
          c: 'new data',
          d: 'new data',
          key: Date.now(),
        });
        this.setState({ data });
      }

    Company_handleChange = (item) => {
        let url = "GetContactsByCompanyIdForOnlyUsers?companyId=" + item.value;
        this.GetData(url, "contactName", "id", "ContactNameData");
        this.setState({
            sendingData: { ...this.state.sendingData, CompanyId: item.value }
        });

    }

    DistributionHanleChange = (item) => {
        let url="GetProjectDistributionListItemsByDistributionId?distributionId="+item.value;
        this.GetDistributionData(url);
        console.log(this.GetDistributionData(url))
    }

    Priority_handelChange = (item) => {
        this.setState({
            sendingData: { ...this.state.sendingData, priorityId: item.value }
        })

    }
    componentDidMount = () => {
        let url = "getProjectDistributionList?projectId=" + this.state.sendingData.projectId;
        let url2 = "GetProjectProjectsCompaniesForList?projectId=" + this.state.sendingData.projectId;
        this.GetData(url, 'subject', 'id', 'DistributionDate');
        this.GetData("GetaccountsDefaultListForList?listType=priority", 'title', 'id', 'PriorityData');
        this.GetData(url2, 'companyName', 'companyId', 'CompanyData');
        this.GetData("GetaccountsDefaultListForList?listType=distribution_action", 'title', 'id', 'ActionData');
    }


    DatehandleChange = (date) => {
        this.setState({
            startDate: date
        });
    }

    render() {

        return (
            <div className="dropWrapper">
                <Dropdown title="Distribution List" data={this.state.DistributionDate} handleChange={this.DistributionHanleChange} />

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
                        data={this.state.DistributionList}
                        components={{
                            body: { wrapper: AnimateBody },
                        }}
                    />
                </div>
                <div className="fullWidthWrapper">
                    <button className="primaryBtn-1 btn">SEND</button>
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
        let data=[]
        Api.get(url).then(result => {
            result.map((item,Index)=>{
                data.push({b:item['companyName'],c:item['contactName'] ,key:Index})
            })
       
        this.setState({DistributionList:[...data]})
        console.log(this.state.DistributionList)
            
        }).catch(ex => {
        });
    }
}

export default DistributionList;

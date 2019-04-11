//////////important note  version of anthor implmentation for this component is pushed with commit No. (5f09adf)////////////
import React, { Component } from './node_modules/react'
import Api from '../../api';
import Dropdown from "./DropdownMelcous";
import DatePicker from './DatePicker'
import Recycle from '../../Styles/images/attacheRecycle.png'
import ReactTable from "./node_modules/react-table";
import moment from './node_modules/moment';
import { Formik, Form } from './node_modules/formik';

import { connect } from './node_modules/react-redux';
import {
    bindActionCreators
} from './node_modules/redux';

import * as communicationActions from '../../store/actions/communication';

import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const _ = require('./node_modules/lodash')


class DistributionList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sendingData: {
                projectId: this.props.projectId,
                docId: this.props.docId,
                docTypeId: this.props.docTypeId,
                DistributionListId: "",
                Priority: "",
                RequiredDate: moment().toDate(),
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
            ActionData: [],
            DistributionValidation: true,
            PriorityValidation: true,
            CompanyValidation: true,
            ContactValidation: true,
            ApiResponse: false,
            removedContact: [],
            submitLoading: false

        };
    }

    onDelete(key, e) {
        e.preventDefault();
        const data = this.state.sendingData.itemContacts.filter(item => item.contactId !== key);
        this.setState({ sendingData: { ...this.state.sendingData, itemContacts: data } });

        var index = this.state.removedContact.map(function (e) { return e.value; }).indexOf(key);

        if (index !== -1) {
            this.setState(prevState => ({
                ContactNameData: [...prevState.ContactNameData, prevState.removedContact[index]]
            }))
        }
    }

    onAdd = () => {
        if (this.state.selectedCompany != null && this.state.selectedConstact != null) {
            const data = [...this.state.sendingData.itemContacts];
            data.push({
                companyId: this.state.selectedCompany.value, companyName: this.state.selectedCompany.label,
                contactId: this.state.selectedConstact.value, contactName: this.state.selectedConstact.label, action: 0
            });
            let array = [...this.state.ContactNameData];
            var index = array.indexOf(this.state.selectedConstact)
            if (index !== -1) {
                array.splice(index, 1);
                let newArray = this.state.removedContact.concat(this.state.selectedConstact)

                this.setState({
                    ContactNameData: array,
                    removedContact: newArray
                });

            }


            let state = { sendingData: { ...this.state.sendingData, itemContacts: data } };
            state[this.state.selectedConstact.value + '-drop'] = this.state.ActionData[3];
            this.setState(state);
            this.setState({ selectedConstact: null });
        }
    }

    Company_handleChange = (item) => {
        let url = "GetContactsByCompanyIdForOnlyUsers?companyId=" + item.value;
        this.GetData(url, "contactName", "id", "ContactNameData");

        this.setState({ selectedCompany: item, CompanyValidation: false, selectedConstact: '' });

    }

    Contact_handleChange = (item) => {
        this.setState({ selectedConstact: item, ContactValidation: false });
    }

    actionHandler = (key, e) => {
        let state = {};
        state[key + '-drop'] = e;
        this.setState(state);
    }

    DistributionHanleChange = (item) => {
        let url = "GetProjectDistributionListItemsByDistributionId?distributionId=" + item.value;
        this.GetDistributionData(url);
        setTimeout(() => {
            let state = { sendingData: { ...this.state.sendingData, DistributionListId: item.value }, DistributionValidation: false, showTabel: true };
            this.state.sendingData.itemContacts.forEach((it) => {
                state[it.contactId + '-drop'] = this.state.ActionData[3];
            });
            this.setState(state);
        }, 400);
    }

    Priority_handelChange = (item) => {
        this.setState({ sendingData: { ...this.state.sendingData, Priority: item.value }, PriorityValidation: false })
    }

    componentDidMount = () => {
        let url = "getProjectDistributionList?projectId=" + this.props.projectId;
        let url2 = "GetProjectProjectsCompaniesForList?projectId=" + this.state.sendingData.projectId;
        this.GetData(url, 'subject', 'id', 'DistributionListDate');
        this.GetData("GetaccountsDefaultListForList?listType=priority", 'title', 'id', 'PriorityData');

        this.GetData(url2, 'companyName', 'companyId', 'CompanyData');
        this.GetData("GetaccountsDefaultListForList?listType=distribution_action", 'title', 'action', 'ActionData');
    }

    DatehandleChange = (date) => {
        this.setState({ sendingData: { ...this.state.sendingData, RequiredDate: date } });
    }

    ContactSection = () => {
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
                        selectedValue={this.state[props.original.contactId + '-drop']} index={Date.now()} />)
                },
                width: 200
            }
        ]
        return (
            <div className="proForm customProform">
                <div className="modal-header fullWidthWrapper"><h4 className="modal-title" >{Resources['addAnthorContact'][currentLanguage]}</h4></div>
                <br />
                <Dropdown title="CompanyName" data={this.state.CompanyData} handleChange={this.Company_handleChange}
                    index='Company' />
                <Dropdown title="ContactName" data={this.state.ContactNameData} handleChange={this.Contact_handleChange}
                    index='Contact' selectedValue={this.state.selectedConstact} />
                <div className="fullWidthWrapper">
                    <button className={this.state.ContactValidation ? "primaryBtn-1 ui disabled button" : "primaryBtn-1 btn"} type="button" onClick={this.onAdd}
                        disabled={this.state.ContactValidation} >{Resources['addTitle'][currentLanguage]}</button>
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
            </div >
        );
    }

    SendDisHandler() {

        let sta={... this.state};

        let tempData = sta.sendingData.itemContacts.map(item => {
            let iContactId=sta[item['contactId'] + '-drop'];
            return {
                companyId: item['companyId'], contactId: item['contactId'], companyName: item['companyName'],
                contactName: item['contactName'], action: iContactId.value
            }
        })

        var emailObj = { ...this.state.sendingData };

        emailObj.itemContacts = tempData;

        this.props.actions.SendByInbox("SnedToDistributionList", emailObj);
    }

    render() {
        return (
            <div className="dropWrapper">
                <Formik
                    initialValues={{
                        DistributionValidation: '',
                        PriorityValidation: ''
                    }}
                    onSubmit={(values) => {

                        if (!this.state.DistributionValidation && !this.state.PriorityValidation) {
                            this.setState({ submitLoading: true })

                            this.SendDisHandler();
                        }
                    }}
                >
                    {({ touched }) => (
                        <Form id="signupForm1" className="proForm customProform" noValidate="novalidate" >

                            <div className={"ui input inputDev fillter-item-c " + (this.state.DistributionValidation && touched.DistributionValidation ? (" has-error") : !this.state.DistributionValidation && touched.DistributionValidation ? (" has-success") : "")}>
                                <Dropdown title="distributionList" data={this.state.DistributionListDate} handleChange={this.DistributionHanleChange} index='Distribution' name="DistributionValidation" />
                                {this.state.DistributionValidation && touched.DistributionValidation ? (
                                    <em className="pError">{this.state.DistributionValidation}</em>
                                ) : null}
                            </div>
                            <DatePicker startDate={this.state.sendingData.RequiredDate} handleChange={this.DatehandleChange} />
                            <div className={"ui input inputDev fillter-item-c " + (this.state.PriorityValidation && touched.PriorityValidation ? (" has-error") : !this.state.PriorityValidation && touched.PriorityValidation ? ("  has-success") : " ")}                            >
                                <Dropdown title="priority" data={this.state.PriorityData} handleChange={this.Priority_handelChange} index='Priority' name="PriorityValidation" />
                                {this.state.PriorityValidation && touched.PriorityValidation ? (
                                    <em className="pError">{this.state.PriorityValidation}</em>
                                ) : null}
                            </div>
                            {!this.state.DistributionValidation && <this.ContactSection />}
                            {!this.state.submitLoading ?
                                <div className="fullWidthWrapper">
                                    <button className="primaryBtn-1 btn" type="submit"  >{Resources['send'][currentLanguage]}</button>
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
                        </Form>
                    )}
                </Formik>


            </div >
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


function mapStateToProps(state) {
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
)(DistributionList);

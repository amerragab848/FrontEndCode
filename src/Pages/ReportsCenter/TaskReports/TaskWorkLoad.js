import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import dataservice from "../../../Dataservice";
import BarChartComp from '../../../Componants/ChartsWidgets/BarChartCompJS';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import moment from "moment";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    CompanyName: Yup.string().required(Resources['companyRequired'][currentLanguage]).nullable(true)
})
class TaskWorkLoad extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            companiesList: [],
            projectsList: [],
            selectedProjects: [],
            selectedCompany: { label: Resources.companyRequired[currentLanguage], value: 0 },
            selectedProjetcs: [],
            rows: [],
            finishDate: moment(),
            startDate: moment(),
            checkedAll: true,
            selectedContact: { label: Resources.selectContact[currentLanguage], value: 0 },
            contactsList: []
        }

        if (!Config.IsAllow(3703)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

        }

        this.columns = [{
            key: "bicContactName",
            name: Resources["ContactName"][currentLanguage],
            width: 150,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            frozen: true,
            sortDescendingFirst: true
        }, {
            key: "subject",
            name: Resources["subject"][currentLanguage],
            width: 150,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true,
        }, {
            key: "projectName",
            name: Resources["projectName"][currentLanguage],
            width: 150,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true
        }, {
            key: "actualTotal",
            name: Resources["actualTotal"][currentLanguage],
            width: 150,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true
        }
        ];

    }

    componentDidMount() {
        this.getDataList('GetCompanies?accountOwnerId=2', 'companyName', 'id', 'companiesList');
        this.getDataList('ProjectProjectsGetAll', 'projectName', 'id', 'projectsList');
        if (Config.IsAllow(3737)) {
            this.columns.push({
                key: "cost",
                name: Resources["cost"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            })
        }
    }

    getGridRows = () => {
        this.setState({ isLoading: true });
        let projectIds = [];
        this.state.selectedProjects.forEach(item => {
            projectIds.push(item.value);
        })
        let obj = {
            bicCompanyId: this.state.selectedCompany.value,
            bicContactId: this.state.checkedAll == false ? this.state.selectedContact.value : undefined,
            startDate: moment(this.state.startDate),
            endDate: moment(this.state.finishDate),
            projectIds
        }
        let url = this.state.checkedAll == true ? 'GetTaskWorkLoadReportForAllContacts' : 'GetTaskWorkLoadReportWithCompany';
        Api.post(url, obj).then((res) => {
            if (res.length > 0) {
                this.setState({
                    rows: res, isLoading: false
                });
            }
            else
                this.setState({
                    rows: [], isLoading: false
                });

        }).catch(() => {
            this.setState({ isLoading: false })
        })

    }

    setDate = (name, value) => {
        this.setState({ [name]: value })
    }

    getDataList = (api, title, value, targetState) => {

        this.setState({ isLoading: true });
        dataservice.GetDataList(api, title, value).then(result => {
            this.setState({
                [targetState]: result,
                isLoading: false
            });
        }).catch(() => {
            this.setState({
                [targetState]: [],
                isLoading: false
            });
            toast.error('somthing wrong')
        })
    }

    checkedAll = () => {
        if (this.state.checkedAll === true)
            this.getDataList('GetContactsByCompanyId?companyId=' + this.state.selectedCompany.value, 'contactName', 'id', 'contactsList');
        this.setState({ checkedAll: !this.state.checkedAll });

    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                selectedCopmleteRow={true}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={Resources['taskWorkLoad'][currentLanguage]} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.taskWorkLoad[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>

                    <div className="linebylineInput valid-input">
                        <Dropdown title="Projects" name="projects" index="projects"
                            data={this.state.projectsList} selectedValue={this.state.selectedProjects}
                            handleChange={event => this.setState({ selectedProjects: event })}
                            isMulti={true} />
                    </div>

                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='startDate'
                            startDate={this.state.startDate}
                            handleChange={e => this.setDate('startDate', e)} />
                    </div>

                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='finishDate'
                            startDate={this.state.finishDate}
                            setDate={e => this.setDate('finishDate', e)} />
                    </div>

                    <div className="linebylineInput valid-input">
                        <Dropdown title="CompanyName" name="CompanyName" index="CompanyName"
                            data={this.state.companiesList} selectedValue={this.state.selectedCompany}
                            handleChange={event => {
                                this.setState({ selectedCompany: event })
                                this.getDataList('GetContactsByCompanyId?companyId=' + event.value, 'contactName', 'id', 'contactsList');
                            }
                            }
                            isClear={false}
                            isMulti={false} />
                    </div>
                    {this.state.selectedCompany.value > 0 ?
                        <div className="project__Permissions--selectAll ">
                            <div id="allSelected" className="ui checkbox checkBoxGray300 checked " >
                                <input name="CheckBox" type="checkbox" id="allPermissionInput" defaultChecked={this.state.checkedAll}
                                    onChange={(e) => this.checkedAll(e)} />
                                <label>{Resources.allContacts[currentLanguage]}</label>
                            </div>
                        </div> : null}
                    {this.state.checkedAll == false ?
                        <div className="linebylineInput valid-input">
                            <Dropdown title="ContactName" name="ContactName" index="ContactName"
                                data={this.state.contactsList} selectedValue={this.state.selectedContact}
                                handleChange={event => this.setState({ selectedContact: event })}
                                isClear={false}
                                isMulti={false} />
                        </div> : null
                    }
                    <button className="primaryBtn-1 btn smallBtn" onClick={this.getGridRows}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

} export default TaskWorkLoad;

import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker';
import moment from "moment";
import ExportDetails from "../ExportReportCenterDetails";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

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
            contactsList: [],
            pageSize: 200,
        }

        if (!Config.IsAllow(3703)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

        }

        this.columns = [{
            field: "bicContactName",
            title: Resources["ContactName"][currentLanguage],
            width: 15,
            groupable: true,
            fixed: true,
            type: "text",
            sortable: true,
        }, {
            field: "subject",
            title: Resources["subject"][currentLanguage],
            width: 15,
            groupable: true,
            fixed: false,
            type: "text",
            sortable: true,
        }, {
            field: "projectName",
            title: Resources["projectName"][currentLanguage],
            width: 15,
            groupable: true,
            fixed: false,
            type: "text",
            sortable: true,
        }, {
            field: "actualTotal",
            title: Resources["actualTotal"][currentLanguage],
            width: 15,
            groupable: true,
            fixed: false,
            type: "text",
            sortable: true,
        }];

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["startDate"][currentLanguage],
            value: this.state.startDate,
            type: "D"
        }, {
            title: Resources["finishDate"][currentLanguage],
            value: this.state.finishDate,
            type: "D"
        }, {
            title: Resources["CompanyName"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["ContactName"][currentLanguage],
            value: "",
            type: "text"
        }];
    }

    componentDidMount() {
        this.getDataList('GetCompanies?accountOwnerId=2', 'companyName', 'id', 'companiesList');
        this.getDataList('ProjectProjectsGetAll', 'projectName', 'id', 'projectsList');
        if (Config.IsAllow(3737)) {
            this.columns.push({
                field: "cost",
                title: Resources["cost"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
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
            <GridCustom
                ref='custom-data-grid'
                gridKey="TaskWorkLoad"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.taskWorkLoad[currentLanguage]} />

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.taskWorkLoad[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm datepickerContainer'>

                    <div className="linebylineInput valid-input">
                        <Dropdown title="Projects" name="projects" index="projects"
                            data={this.state.projectsList} selectedValue={this.state.selectedProjects}
                            handleChange={event => {
                                this.setState({ selectedProjects: event }); let documentText = '';
                                event.map(lable => {
                                    return documentText = lable.label + " - " + documentText
                                });
                                this.fields[0].value = documentText
                            }}
                            isMulti={true} />
                    </div>

                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='startDate'
                            startDate={this.state.startDate}
                            handleChange={e => { this.setDate('startDate', e); this.fields[1].value = e }} />
                    </div>

                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='finishDate'
                            startDate={this.state.finishDate}
                            setDate={e => { this.setDate('finishDate', e); this.fields[2].value = e }} />
                    </div>

                    <div className="linebylineInput valid-input">
                        <Dropdown title="CompanyName" name="CompanyName" index="CompanyName"
                            data={this.state.companiesList} selectedValue={this.state.selectedCompany}
                            handleChange={event => {
                                this.setState({ selectedCompany: event });
                                this.fields[3].value = event.label
                                this.getDataList('GetContactsByCompanyId?companyId=' + event.value, 'contactName', 'id', 'contactsList');
                            }}
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
                                handleChange={event => {
                                    this.setState({ selectedContact: event });
                                    this.fields[4].value = this.state.checkedAll == false ? event.label : ""
                                }}
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

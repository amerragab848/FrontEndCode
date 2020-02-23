import React, { Component } from 'react';
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import ExportDetails from "../ExportReportCenterDetails";
import dataservice from "../../../Dataservice";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class TasksList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            companiesList: [],
            projectsList: [],
            selectedProjects: [],
            selectedCompany: { label: Resources.companyRequired[currentLanguage], value: 0 },
            rows: [],
            selectedContact: { label: Resources.selectContact[currentLanguage], value: 0 },
            contactsList: [],
            pageSize: 200,
        }

        if (!Config.IsAllow(3706)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.columns = [{
            field: "arrange",
            title: Resources["documentNumber"][currentLanguage],
            width: 10,
            groupable: true,
            fixed: true,
            type: "text",
            sortable: true,
        }, {
            field: "subject",
            title: Resources["subject"][currentLanguage],
            width: 25,
            groupable: true,
            fixed: true,
            type: "text",
            sortable: true,
        }, {
            field: "bicContactName",
            title: Resources["ContactName"][currentLanguage],
            width: 15,
            groupable: true,
            fixed: true,
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
            field: "finishDate",
            title: Resources["requiredDate"][currentLanguage],
            width: 15,
            groupable: true,
            fixed: false,
            type: "date",
            sortable: true,
        }, {
            field: "docCloseDate",
            title: Resources["docClosedate"][currentLanguage],
            width: 15,
            groupable: true,
            fixed: false,
            type: "date",
            sortable: true,
        }, {
            field: "variance",
            title: Resources["variance"][currentLanguage],
            width: 15,
            groupable: true,
            fixed: false,
            type: "text",
            sortable: true,
        }
        ];

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
            value: "",
            type: "text"
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
        if (Config.IsAllow(3737))
            this.columns.push({
                field: "cost",
                title: Resources["cost"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            })
    }

    getGridRows = () => {
        this.setState({ isLoading: true });
        let projectIds = [];
        this.state.selectedProjects.forEach(item => {
            projectIds.push(item.value);
        })
        let obj = {
            bicCompanyId: this.state.selectedCompany.value,
            bicContactId: this.state.selectedContact.value,
            projectIds
        }
        Api.post('GetClosedTasksReport', obj).then((res) => {
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

    getDataList = (api, title, value, targetState) => {
        this.setState({
            isLoading: true
        });
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

    render() {

        const dataGrid = this.state.isLoading === false ? (

            <GridCustom
                ref='custom-data-grid'
                key="ClosedTask"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.closedTasks[currentLanguage]} />

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.closedTasks[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>
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

                    <div className="linebylineInput valid-input">
                        <Dropdown title="CompanyName" name="CompanyName" index="CompanyName"
                            data={this.state.companiesList} selectedValue={this.state.selectedCompany}
                            handleChange={event => {
                                this.setState({
                                    selectedCompany: event,
                                    selectedContact: { label: Resources.selectContact[currentLanguage], value: 0 },
                                    rows: []
                                });
                                this.fields[1].value = event.label
                                this.getDataList('GetContactsByCompanyId?companyId=' + event.value, 'contactName', 'id', 'contactsList');
                            }}
                            isClear={false}
                            isMulti={false} />
                    </div>

                    <div className="linebylineInput valid-input">
                        <Dropdown title="ContactName" name="ContactName" index="ContactName"
                            data={this.state.contactsList} selectedValue={this.state.selectedContact}
                            handleChange={event => { this.setState({ selectedContact: event }); this.fields[2].value = event.label }}
                            isClear={false}
                            isMulti={false} />
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" onClick={this.getGridRows}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

} export default TasksList;

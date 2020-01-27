import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export"; 
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";

import moment from "moment";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Dataservice from '../../../Dataservice';
import Api from '../../../api';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}
const StatusDropData = [
    { label: Resources.active[currentLanguage], value: true },
    { label: Resources.inActive[currentLanguage], value: false },]
class ProjectsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: '' },
            selectedStatus: { label: Resources.active[currentLanguage], value: true },
            rows: [],
            finishDate: moment(),
            startDate: moment(),
            pageSize: 200,
        }

        if (!Config.IsAllow(3677)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.columns = [
            {
                field: "projectName",
                title: Resources["projectName"][currentLanguage],
                width: 25, 
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: "job",
                title: Resources["projectCode"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "projectManagerContactName",
                title: Resources["projectManagerContact"][currentLanguage],
                width: 21,
                draggable: true,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "excuteContactManager",
                title: Resources["executiveManagerContact"][currentLanguage],
                width: 21,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "statusName",
                title: Resources["statusName"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "holdedName",
                title: Resources["holded"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "clientsConstraints",
                title: Resources["client"][currentLanguage],
                width: 13,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "projectOpenDate",
                title: Resources["openDate"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            },
            {
                field: "projectCloseDate",
                title: Resources["docClosedate"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            },
        ];
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    componentWillMount() {
        Dataservice.GetDataList('GetAccountsDefaultList?listType=project_type&pageNumber=0&pageSize=10000', 'title', 'id').then(
            result => {
                this.setState({
                    ProjectsData: result
                })
            }).catch(() => {
                toast.error('somthing wrong')
            })
    }

    getGridRows = () => {
        this.setState({ isLoading: true })
        let reportobj = {
            projectTypeId: this.state.selectedProject.value === '' ? '' : this.state.selectedProject.value,
            startDate: moment(this.state.startDate,'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finishDate: moment(this.state.finishDate,'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            status: this.state.selectedStatus.value,
            pageNumber: undefined, pageSize: 200,

        }
        Api.post('GetAllProjectsLists', reportobj).then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
                <GridCustom
                ref='custom-data-grid'
                key="projectList"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'projectsList'} />
            : null

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.projectsList[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className="proForm reports__proForm">
                        <div className="linebylineInput valid-input">
                            <Dropdown title='Projects'
                                data={this.state.ProjectsData}
                                selectedValue={this.state.selectedProject}
                                handleChange={e => this.setState({ selectedProject: e })} />
                        </div>
                        <div className="linebylineInput valid-input">
                            <Dropdown title='status'
                                data={StatusDropData}
                                selectedValue={this.state.selectedStatus}
                                handleChange={e => this.setState({ selectedStatus: e })} />
                        </div>
                        <div className="linebylineInput valid-input alternativeDate">
                            <DatePicker title='startDate'
                                startDate={this.state.startDate}
                                handleChange={e => this.handleChange('startDate', e)} />
                        </div>
                        <div className="linebylineInput valid-input alternativeDate">
                            <DatePicker title='finishDate'
                                startDate={this.state.finishDate}
                                handleChange={e => this.handleChange('finishDate', e)} />
                        </div>
                        <button className="primaryBtn-1 btn smallBtn" onClick={this.getGridRows}>{Resources['search'][currentLanguage]}</button>
                    </div>
                 <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                 </div>
             </div>
         
        )
    }

}
export default withRouter(ProjectsList)

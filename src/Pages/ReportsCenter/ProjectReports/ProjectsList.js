import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
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
        }

        if (!Config.IsAllow(3677)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.columns = [
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "job",
                name: Resources["projectCode"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "projectManagerContactName",
                name: Resources["projectManagerContact"][currentLanguage],
                width: 210,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "excuteContactManager",
                name: Resources["executiveManagerContact"][currentLanguage],
                width: 210,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            },
            {
                key: "statusName",
                name: Resources["statusName"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "holdedName",
                name: Resources["holded"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "clientsConstraints",
                name: Resources["client"][currentLanguage],
                width: 130,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "projectOpenDate",
                name: Resources["openDate"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "projectCloseDate",
                name: Resources["docClosedate"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
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
            startDate: moment(this.state.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finishDate: moment(this.state.finishDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
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
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

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

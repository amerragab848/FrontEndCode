import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import moment from "moment";
import PieChart from '../PieChartComp'

//const _ = require('lodash')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class TaskTimeSheet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedProject: { label: Resources.selectProjects[currentLanguage], value: "0" },
            rows: [],
            series: [],
            startDate: moment(),
            finishDate: moment(),
        }

        if (!Config.IsAllow(3737)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

        }

        this.columns = [{
            key: "taskName",
            name: Resources["taskName"][currentLanguage],
            width: 120,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            frozen: true,
            sortDescendingFirst: true
        }, {
            key: "contactName",
            name: Resources["ContactName"][currentLanguage],
            width: 120,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true,
        }, {
            key: "totalExpenseValue",
            name: Resources["total"][currentLanguage],
            width: 80,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true
        }
        ];
    }

    componentWillMount() {
        if (Config.IsAllow(3737)) {
            this.columns.push(
                {
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
        dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'id').then(result => {
            this.setState({
                dropDownList: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getGridRows = () => {
        let data = [];
        if (this.state.selectedProject.value != '0') {
            this.setState({ isLoading: true })
            let obj = {
                projectId: this.state.selectedProject.value,
                startDate: moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                finishDate: moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
            }
            Api.post('GetTimeSheetByRangeProjectId', obj).then((res) => {
                res.forEach(item => {
                    data.push({ y: item.actualTotal, name: item.subject });

                })
                let series = [{ data }]

                this.setState({
                    rows: res, isLoading: false, series,
                });
            }).catch(() => {
                this.setState({ isLoading: false })
            })
        }
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }


    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                selectedCopmleteRow={true} selectedRows={rows => this.selectedRows(rows)}
                pageSize={this.state.pageSize} columns={this.columns} onRowClick={(value, index, column) => this.onRowClick(value, index, column)} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={Resources['taskStatus'][currentLanguage]} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.taskTimeSheet[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>

                    <div className="linebylineInput valid-input">
                        <Dropdown title="Projects" name="Projects" index="Projects"
                            data={this.state.dropDownList} selectedValue={this.state.selectedProject}
                            handleChange={event => this.setState({ selectedProject: event })} />
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
                    <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getGridRows()}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>




            </div>


        )
    }

}

export default TaskTimeSheet

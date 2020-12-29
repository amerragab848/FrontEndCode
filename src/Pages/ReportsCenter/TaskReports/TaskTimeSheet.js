import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import ExportDetails from "../ExportReportCenterDetails";
import dataservice from "../../../Dataservice";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import moment from "moment";
 
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class TaskTimeSheet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedProject: { label: Resources.selectProjects[currentLanguage], value: "0" },
            rows: [],
            startDate: moment(),
            finishDate: moment(),
            pageSize: 200,

        }

        if (!Config.IsAllow(3737)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.columns = [{
            field: "taskName",
            title: Resources["taskName"][currentLanguage],
            width: 20,
            groupable: true,
            fixed: true,
            type: "text",
            sortable: true,
        }, {
            field: "contactName",
            title: Resources["ContactName"][currentLanguage],
            width: 20,
            groupable: true,
            fixed: false,
            type: "text",
            sortable: true,
        }, {
            field: "totalExpenseValue",
            title: Resources["total"][currentLanguage],
            width: 18,
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
            title: Resources["startDate"][currentLanguage],
            value: this.state.startDate,
            type: "D"
        }, {
            title: Resources["finishDate"][currentLanguage],
            value: this.state.finishDate,
            type: "D"
        }];
    }

    componentDidMount() {
        if (Config.IsAllow(3737)) {
            this.columns.push(
                {
                    field: "cost",
                    title: Resources["cost"][currentLanguage],
                    width: 18,
                    groupable: true,
                    fixed: false,
                    type: "text",
                    sortable: true,
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
                this.setState({
                    rows: res, isLoading: false
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

            <GridCustom
                ref='custom-data-grid'
                gridKey="TaskTimeSheet"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.taskTimeSheet[currentLanguage]} />

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.taskTimeSheet[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm datepickerContainer'>

                    <div className="linebylineInput valid-input">
                        <Dropdown title="Projects" name="Projects" index="Projects"
                            data={this.state.dropDownList} selectedValue={this.state.selectedProject}
                            handleChange={event => { this.setState({ selectedProject: event }); this.fields[0].value = event.label }} />
                    </div>
                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='startDate'
                            startDate={this.state.startDate}
                            handleChange={e => { this.handleChange('startDate', e); this.fields[1].value = e }} />
                    </div>

                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='finishDate'
                            startDate={this.state.finishDate}
                            handleChange={e => { this.handleChange('finishDate', e); this.fields[2].value = e }} />
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

import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Export from "../../../Componants/OptionsPanels/Export"; 
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";

import moment from "moment";
import Api from '../../../api';
import BarChartComp from '../TechnicalOffice/BarChartComp'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}
class projectBackLog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            noClicks: 0,
            ProjectsData: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            rows: [],
            finishDate: moment(),
            startDate: moment(),
            showChart: false,
            pageSize: 200,
        }
        if (!Config.IsAllow(3679)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.columns = [
            {
                field: "docDate",
                title: Resources["docDate"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            },
            {
                field: "total",
                title: Resources["total"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            }
        ];

    }
    getData = () => {
        this.setState({ isLoading: true })
        let reportobj = {
            startDate: moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finishDate: moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        }
        let noClicks = this.state.noClicks;
        Api.post('ProjectBackLogRpt', reportobj).then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false,
                    showChart: true
                })
                let categoriesData = []

                let series = []
                res.map(item => {
                    // var docDate = new Date(item.docDate);
                    // docDate = Date.UTC(docDate.getFullYear(), docDate.getMonth(), docDate.getDate());
                    var categoryData = [item.docDate, item.total];
                    categoriesData.push(categoryData)
                    series.push({ name: moment(item.docDate).format('MMMM Do YYYY'), value: item.total })
                })
                //                series.push({ name: Resources['total'][currentLanguage], data: categoriesData })
                this.setState({ series: series, noClicks: noClicks + 1, showChart: true });
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })

    }
    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }
    render() {

        const Chart = this.state.showChart ?
            (<BarChartComp
                noClicks={this.state.noClicks}
                series={this.state.series}
                xAxis={null}
                multiSeries="no"
                xAxisType='datetime'
                title={Resources['projectsBackLog'][currentLanguage]} yTitle={Resources['total'][currentLanguage]} />) : null

        const dataGrid = this.state.isLoading === false ? (

            <GridCustom
                ref='custom-data-grid'
                key="projectBackLog"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'projectsBackLog'} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.projectsBackLog[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className="proForm reports__proForm">
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
                    <button className="primaryBtn-1 btn smallBtn" type='submit' onClick={e => this.getData()}>{Resources['search'][currentLanguage]} </button>

                </div>
                {this.state.showChart == true ?
                    <div className="row">
                        {Chart}
                    </div> : null}
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}
export default withRouter(projectBackLog)

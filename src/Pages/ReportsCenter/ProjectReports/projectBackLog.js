import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import moment from "moment";
import Highcharts from 'highcharts';
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
            showChart:false
        }
        if (!Config.IsAllow(3679)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.columns = [
            {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 300,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "total",
                name: Resources["total"][currentLanguage],
                width: 300,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];

    }
    getData = () => {
        this.setState({ isLoading: true })
        let reportobj = {
            startDate: moment(this.state.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finishDate: moment(this.state.finishDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        }
        let noClicks = this.state.noClicks;
        Api.post('ProjectBackLogRpt', reportobj).then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false,showChart:true
                })
                let categoriesData = []
                res.map(item => {
                    var docDate = new Date(item.docDate);
                    docDate = Date.UTC(docDate.getFullYear(), docDate.getMonth(), docDate.getDate());
                    var categoryData = [docDate, item.total];
                    categoriesData.push(categoryData)
                })
                let series = []
                series.push({ name: Resources['total'][currentLanguage], data: categoriesData })
                this.setState({ series, noClicks: noClicks + 1 });
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })

    }
    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }
    render() {
        let tooltip = {
            shared: true,
            crosshairs: true,
            formatter: function () {
                var s = Highcharts.dateFormat('%A, %b %e, %Y', this.x) + '<br/> ' +
                    '<b style="color: #7cb5ec">●</b> Total: ' + this.y;
                return s;
            }
        }
        const Chart =
            <BarChartComp
                noClicks={this.state.noClicks}
                series={this.state.series}
                tooltip={tooltip}
                xAxis={null}
                xAxisType='datetime'
                title={Resources['projectsBackLog'][currentLanguage]} yTitle={Resources['total'][currentLanguage]} />
        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

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
                {this.state.showChart==true? 
                <div className="doc-pre-cycle letterFullWidth">
                    {Chart}
                </div>:null}
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}
export default withRouter(projectBackLog)

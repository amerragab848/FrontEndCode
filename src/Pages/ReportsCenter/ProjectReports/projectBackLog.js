import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import moment from "moment";
import * as Yup from 'yup';
import Api from '../../../api';
import BarChartComp from '../TechnicalOffice/BarChartComp'
import HeaderDocument from '../../../Componants/OptionsPanels/HeaderDocument'

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
        }

        if (!Config.IsAllow(3679)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                key: "total",
                name: Resources["total"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 160,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
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
                    isLoading: false
                })
                let _data = []
                res.map((item, index) => {
                    _data.push(item.total)
                })
                let series = []
                series.push({ name: Resources['total'][currentLanguage], data: _data })
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
        const Chart =
            <BarChartComp
                noClicks={this.state.noClicks}
                series={this.state.series}
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

            <div className='mainContainer main__fulldash'>
                <div className="documents-stepper noTabs__document">
                    <HeaderDocument projectName={''} docTitle={Resources.projectsBackLog[currentLanguage]} moduleTitle={Resources['projectReports'][currentLanguage]} />
                    <div className='doc-container'>
                        <div className='step-content'>
                            <div className="document-fields">
                                <div className=" fullWidthWrapper textRight">
                                    {btnExport}
                                </div>
                                <div className="proForm datepickerContainer">
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
                                </div>
                                <div className="fullWidthWrapper ">
                                    <button className="primaryBtn-1 btn mediumBtn" type='submit' onClick={e => this.getData()}>{Resources['search'][currentLanguage]} </button>
                                </div>
                            </div>
                            <div className="doc-pre-cycle letterFullWidth">
                                {Chart}
                            </div>
                            <div className="doc-pre-cycle letterFullWidth">
                                {dataGrid}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
export default withRouter(projectBackLog)

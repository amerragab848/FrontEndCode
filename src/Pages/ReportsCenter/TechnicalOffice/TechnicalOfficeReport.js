import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import moment from "moment";
import dataService from '../../../Dataservice'
import BarChartComp from './BarChartComp'
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
const _ = require('lodash')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class TechnicalOfficeReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showChart: false,
            isLoading: false,
            noClicks: 0,
            projectList: [],
            project: { label: Resources.projectSelection[currentLanguage], value: "-1" },
            finishDate: moment(),
            startDate: moment(), xAxis: {}, series: []
        }

        if (!Config.IsAllow(3760)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

    }

    componentWillMount() {
        this.setState({ isLoading: true })
        dataService.GetDataList('ProjectProjectsForList', 'projectName', 'id').then(res => {
            this.setState({ projectList: res, isLoading: false })
        })
    }

    getChartData = () => {
        if (this.state.project.value != '-1') {
            this.setState({ currentComponent: null, isLoading: true })
            let reportobj = {
                projectId: this.state.project.value,
                fromDate: moment(this.state.startDate,'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                toDate: moment(this.state.finishDate,'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            }
            let noClicks = this.state.noClicks;
            this.setState({ isLoading: true })
            Api.post('GetTechnicalOfficeDocument', reportobj).then(res => {
                this.setState({ isLoading: false,showChart:true })
                let _catag = []
                let _data = []
                let series = []
                res.map((item, index) => {
                    _catag.push(item.docName);
                    _data.push(item.count);
                    series.push({ name: item["docName"], value: item["count"] })
                })
                //let series = []
                //series.push({ name: Resources['count'][currentLanguage], data: _data })
                let xAxis = { categories: _catag }
                this.setState({ series, series, noClicks: noClicks + 1, isLoading: false, showChart: true });
            })
        }
    }
    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }
    render() {
        const Chart = this.state.showChart ?
            (<BarChartComp
                noClicks={this.state.noClicks}
                series={this.state.series}
                xAxis={this.state.xAxis}
                multiSeries="no"
                title={Resources['technicalOfficeDocument'][currentLanguage]} yTitle={Resources['total'][currentLanguage]} />):null
        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.technicalOfficeDocument[currentLanguage]}</h2>
                </header>
                {this.state.isLoading == true ? <LoadingSection /> : <React.Fragment>
                    <div className="proForm reports__proForm">
                        <div className="linebylineInput valid-input">
                            <Dropdown
                                title="Projects"
                                data={this.state.projectList}
                                selectedValue={this.state.project}
                                handleChange={event => { this.setState({ project: event }); }}
                                name="projects"
                                index="projects" />
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

                        <div className="fullWidthWrapper ">
                            <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getChartData()}>{Resources['search'][currentLanguage]}</button>
                        </div>
                    </div>
                    {this.state.showChart == true ?
                        <div className="doc-pre-cycle letterFullWidth">
                            {Chart}
                        </div> : null}
                </React.Fragment>}
            </div>

        )
    }

}


export default TechnicalOfficeReport

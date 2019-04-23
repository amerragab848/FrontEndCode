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

import PieChartComp from '../PieChartComp'
import Api from '../../../api';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')


const StatusDropData = [
    { label: Resources.selectAll[currentLanguage], value: '' },
    { label: Resources.active[currentLanguage], value: true },
    { label: Resources.inActive[currentLanguage], value: false },]


class ActiveProjectsReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            selectedStatus: { label: Resources.selectAll[currentLanguage], value: '' },
            rows: [],
            finishDate: moment(),
            startDate: moment(),
            showChart: true,
            series: [],
            xAxis: { type: 'pie' },
            noClicks: 0,
            showChart:false
        }

        if (!Config.IsAllow(3686)) {
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
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "statusName",
                name: Resources["holded"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];

    }


    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }


    getGridRows = () => {
        this.setState({ isLoading: true })
        let noClicks = this.state.noClicks;
        Api.get('ActiveProjectReport?status=' + this.state.selectedStatus.value + '').then(
            res => {

                let hold = 0
                let unhold = 0
                res.map(i => {

                    if (i.statusName === 'UnHold')
                        unhold = unhold + 1

                    if (i.statusName === 'Hold')
                        hold = hold + 1
                })

                let series = [{
                    name: Resources['activeProjectsReport'][currentLanguage],
                    data: [{ y: hold, name: Resources['holded'][currentLanguage] },
                    { y: unhold, name: Resources['unHolded'][currentLanguage] },],
                    type: "pie"
                }]

                this.setState({
                    series, noClicks: noClicks + 1,
                    rows: res, isLoading: false,showChart:true
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {

        let Chart =
            <PieChartComp
                noClicks={this.state.noClicks}
                series={this.state.series}
                title='activeProjectsReport' />

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'activeProjectsReport'} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.activeProjectsReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className="proForm reports__proForm">
                    <div className="linebylineInput valid-input">
                        <Dropdown  title='status'
                            data={StatusDropData}
                            selectedValue={this.state.selectedStatus}
                            handleChange={e => this.setState({ selectedStatus: e })} />
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" type='submit' onClick={e => this.getGridRows()}>{Resources['search'][currentLanguage]} </button>
                </div>
                {this.state.showChart == true ?
                    <div className="doc-pre-cycle letterFullWidth">
                        {Chart}
                    </div> : null}
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}
export default withRouter(ActiveProjectsReport)

import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous';
import moment from "moment";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import ExportDetails from "../ExportReportCenterDetails";
import PieChartComp from '../PieChartComp'
import Api from '../../../api';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

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
            series: [],
            xAxis: { type: 'pie' },
            noClicks: 0,
            showChart: false,
            pageSize: 200,
        }

        if (!Config.IsAllow(3686)) {
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
                width: 25,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "statusName",
                title: Resources["holded"][currentLanguage],
                width: 25,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }
        ];

        this.fields = [{
            title: Resources["status"][currentLanguage],
            value: this.state.selectedStatus.label,
            type: "text"
        }];
    }


    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }


    getGridRows = () => {
        this.setState({ isLoading: true })
        let noClicks = this.state.noClicks;
        Api.get('ActiveProjectReport?status=' + this.state.selectedStatus.value + '').then(
            res => {
                this.setState({ showChart: true });
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
                    rows: res, isLoading: false, showChart: true
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {

        let Chart = this.state.showChart ?
            (<PieChartComp
                noClicks={this.state.noClicks}
                series={this.state.series}
                title='activeProjectsReport' />) : null

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                gridKey="ActiveProjectsReport"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />


        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.activeProjectsReport[currentLanguage]} />

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.activeProjectsReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className="proForm reports__proForm">
                    <div className="linebylineInput valid-input">
                        <Dropdown title='status'
                            data={StatusDropData}
                            selectedValue={this.state.selectedStatus}
                            handleChange={e => { this.setState({ selectedStatus: e }); this.fields[0].value = e.label }} />
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" type='submit' onClick={e => this.getGridRows()}>{Resources['search'][currentLanguage]} </button>
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
export default withRouter(ActiveProjectsReport)

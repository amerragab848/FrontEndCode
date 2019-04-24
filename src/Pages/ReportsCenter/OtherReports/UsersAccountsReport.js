import React, { Component, Fragment } from 'react'
import dataService from '../../../Dataservice'
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import PieChartComp from '../PieChartComp'
const _ = require('lodash')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class UsersAccountsReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            rows: [],
            TotalAccounts: 0,
            ActiveAccounts: 0,
            InActiveAccounts: 0,
            series: [],
            xAxis: { type: 'pie' },
            noClicks: 0,
        }

        if (!Config.IsAllow(3722)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.columns = [
            {
                key: "groupName",
                name: Resources["GroupName"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "totalActiveAccounts",
                name: Resources["activeAccounts"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "totalInActiveAccounts",
                name: Resources["inActiveAccounts"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "total",
                name: Resources["totalAccounts"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];

    }

    componentDidMount() {
    }

    componentWillMount() {

        dataService.GetDataGrid('GetUsersAccountsReport').then(
            res => {
                let noClicks = this.state.noClicks;
                //Lables Count
                let totals = []
                let totalsAct = []
                let totalsInAc = []
                res.map(i => {
                    totals.push(i.total)
                    totalsAct.push(i.totalActiveAccounts)
                    totalsInAc.push(i.totalInActiveAccounts)
                })
                let TotalAccounts = _.sum(totals)
                let ActiveAccounts = _.sum(totalsAct)
                let InActiveAccounts = _.sum(totalsInAc)

                //Pie Charts
                let series = [{
                    name: Resources['usersAccountsReport'][currentLanguage],
                    data: [{ y: TotalAccounts, name: Resources['totalAccounts'][currentLanguage] },
                    { y: ActiveAccounts, name: Resources['activeAccounts'][currentLanguage] },
                    { y: InActiveAccounts, name: Resources['inActiveAccounts'][currentLanguage] }],
                    type: "pie"
                }]

                this.setState({
                    rows: res, TotalAccounts,
                    ActiveAccounts, InActiveAccounts,
                    series, noClicks: noClicks + 1,
                    isLoading: false
                })

            }
        )
    }


    render() {

        let Chart = <PieChartComp noClicks={this.state.noClicks}
            series={this.state.series} title='usersAccountsReport' />

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'usersAccountsReport'} />
            : null

        return (


            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.usersAccountsReport[currentLanguage]}</h2>
                    {btnExport}
                </header>

                <div className='proForm reports__proForm' >

                    <div className="linebylineInput valid-input">
                        <label className="control-label">{Resources.totalAccounts[currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input readOnly className="form-control" value={this.state.TotalAccounts} />
                        </div>
                    </div>

                    <div className="linebylineInput valid-input">
                        <label className="control-label">{Resources.activeAccounts[currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input readOnly className="form-control" value={this.state.ActiveAccounts} />
                        </div>
                    </div>

                    <div className="linebylineInput valid-input">
                        <label className="control-label">{Resources.inActiveAccounts[currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input readOnly className="form-control" value={this.state.InActiveAccounts} />
                        </div>
                    </div>

                </div>

                <div className="doc-pre-cycle letterFullWidth">
                    {Chart}
                </div>

                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
                
            </div>


        )
    }

}


export default UsersAccountsReport

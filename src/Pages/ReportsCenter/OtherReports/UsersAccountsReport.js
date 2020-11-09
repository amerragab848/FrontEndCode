import React, { Component, Fragment } from 'react'
import dataService from '../../../Dataservice'
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
//import Export from "../../../Componants/OptionsPanels/Export";
import ExportDetails from "../ExportReportCenterDetails";
import GridCustom from 'react-customized-grid';
import PieChartComp from '../PieChartComp'
const sum = require('lodash/sum')
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
            showChart: false
        }

        if (!Config.IsAllow(3722)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.columns = [
            {
                "field": "groupName",
                "title": Resources.GroupName[currentLanguage],
                "type": "text",
                "width": 25,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalActiveAccounts",
                "title": Resources.activeAccounts[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalInActiveAccounts",
                "title": Resources.inActiveAccounts[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "total",
                "title": Resources.totalAccounts[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }
        ]; 
        this.fields = [{
            title:Resources.totalAccounts[currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources.activeAccounts[currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources.inActiveAccounts[currentLanguage],
            value: "",
            type: "text"
        }];
    }

    componentDidMount() {
    }

    componentWillMount() {

        dataService.GetDataGrid('GetUsersAccountsReport').then(
            res => {
                this.setState({ showChart: true });

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
                let TotalAccounts = sum(totals)
                let ActiveAccounts = sum(totalsAct)
                let InActiveAccounts = sum(totalsInAc)

                //Pie Charts
                let series = [{
                    name: Resources['usersAccountsReport'][currentLanguage],
                    data: [{ y: TotalAccounts, name: Resources['totalAccounts'][currentLanguage] },
                    { y: ActiveAccounts, name: Resources['activeAccounts'][currentLanguage] },
                    { y: InActiveAccounts, name: Resources['inActiveAccounts'][currentLanguage] }],
                    type: "pie"
                }]
                this.fields[0].value = TotalAccounts;
                this.fields[1].value = ActiveAccounts;
                this.fields[2].value = InActiveAccounts;
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

        let Chart = this.state.showChart ?
            (<PieChartComp noClicks={this.state.noClicks}
                series={this.state.series} title='usersAccountsReport' />) : null

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />
        ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
           // <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'usersAccountsReport'} />
           <ExportDetails fieldsItems={this.columns}
           rows={this.state.rows}
           fields={this.fields} fileName={'usersAccountsReport'} />
           : null

        return (


            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.usersAccountsReport[currentLanguage]}</h2>
                    {btnExport}
                </header>

                <div className='proForm reports__proForm datepickerContainer' >

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

                <div className="row">
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

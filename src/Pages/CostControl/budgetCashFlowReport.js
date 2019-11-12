import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import Config from '../../Services/Config';
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import Export from "../../Componants/OptionsPanels/Export";
import BarChartComp from '../ReportsCenter/TechnicalOffice/BarChartComp'
import GridSetup from "../Communication/GridSetup"
import { SkyLightStateless } from 'react-skylight';
import moment from 'moment';
import Api from '../../api.js';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')
const sum = require('lodash/sum')
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

class BudgetCashFlowReport extends Component {

    constructor(props) {

        super(props)

        this.state = {
            isLoading: false,
            showChart: false,
            noClicks: 0,
            rows: [],
            RowsDetails: [],
            startDate: moment(),
            finishDate: moment(),
            EstimatedIn: 0,
            EstimatedOut: 0,
            ActualTotalIn: 0,
            ActualTotalOut: 0,
            isLoadingDetails: false,
            ShowPopup: false
        }

        if (!Config.IsAllow(3721)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                key: "date",
                name: Resources["docDate"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate

            },
            {
                key: "estimatedCashIn",
                name: Resources["estimatedCashIn"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "estimatedCashOut",
                name: Resources["estimatedCashOut"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            },
            {
                key: "totalIn",
                name: Resources["actualTotalIn"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "totalOut",
                name: Resources["actualTotalOut"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }
        ];
    }

    componentDidMount() {
        this.props.actions.FillGridLeftMenu();
    }

    getGridRows = () => {
        this.setState({ isLoading: true })
        let obj = {
            startDate: moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finishDate: moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        }
        Api.post('GetBudgetCashFlow', obj).then(res => {
            this.setState({ showChart: true });
            let categories = []
            let estimatedIn = []
            let estimatedOut = []
            let actualIn = []
            let actualOut = []
            res.forEach(element => {
                categories.push(moment(element.date).format("DD/MM/YYYY"));
                estimatedIn.push(element.estimatedCashIn);
                estimatedOut.push(element.estimatedCashOut);
                actualIn.push(element.totalIn);
                actualOut.push(element.totalOut);
            })
            let series = [];

            let stacks = ["Actual In", "Actual Out", "Estimated In", "Estimated Out"];

            let xAxis = { categories: categories }
            let noClicks = this.state.noClicks

            res.forEach(function (item) {
                series.push({ stack: stacks[0], name: moment(item.date).format("DD/MM/YYYY"), total: item.totalIn });
                series.push({ stack: stacks[1], name: moment(item.date).format("DD/MM/YYYY"), total: item.estimatedCashIn });
                series.push({ stack: stacks[2], name: moment(item.date).format("DD/MM/YYYY"), total: item.totalOut });
                series.push({ stack: stacks[3], name: moment(item.date).format("DD/MM/YYYY"), total: item.estimatedCashOut });
            });

            this.setState({ series: series, xAxis, noClicks: noClicks + 1, showChart: true });

            //Lables Count
            let totalsEstimatedIn = []
            let totalsEstimatedOut = []
            let totalsActualTotalIn = []
            let totalsActualTotalOut = []
            res.map(i => {
                totalsEstimatedIn.push(i.estimatedCashIn)
                totalsEstimatedOut.push(i.estimatedCashOut)
                totalsActualTotalIn.push(i.totalIn)
                totalsActualTotalOut.push(i.totalOut)
            })
            let EstimatedIn = sum(totalsEstimatedIn)
            let EstimatedOut = sum(totalsEstimatedOut)
            let ActualTotalIn = sum(totalsActualTotalIn)
            let ActualTotalOut = sum(totalsActualTotalOut)

            this.setState({
                EstimatedIn,
                EstimatedOut,
                ActualTotalIn,
                ActualTotalOut,
                rows: res,
                isLoading: false
            })
        }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    onRowClick = (rowData, value, column) => {
        if (column.idx === 3) {
            if (rowData.totalIn !== 0) {

                this.setState({ isLoading: true })

                let obj = {
                    startDate: moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                    finishDate: moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
                }

                Api.post('GetActualTotalIn', obj).then(
                    res => {
                        this.setState({
                            RowsDetails: res,
                            isLoading: false,
                            ShowPopup: true
                        })
                    }
                )
            }
        }

        if (column.idx === 4) {
            if (rowData.totalOut !== 0) {
                this.setState({ isLoading: true })
                let obj = {
                    startDate: moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                    finishDate: moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
                }
                Api.post('GetActualTotalOut', obj).then(
                    res => {
                        this.setState({
                            RowsDetails: res,
                            isLoading: false,
                            ShowPopup: true
                        })
                    }
                )
            }
        }
    }

    render() {

        const Chart = this.state.showChart ?
            (<BarChartComp
                noClicks={this.state.noClicks}
                type={'spline'}
                series={this.state.series}
                multiSeries="yes"
                xAxis={this.state.xAxis}
                title={Resources['budgetCashFlowReport'][currentLanguage]} yTitle={Resources['total'][currentLanguage]} />) : null

        const columnsCycles = [
            {
                Header: Resources["projectName"][currentLanguage],
                accessor: "projectName",
                sortabel: true,
                width: 200
            },
            {
                Header: Resources["docDate"][currentLanguage],
                accessor: "date",
                width: 150,
                sortabel: true
            },
            {
                Header: Resources["type"][currentLanguage],
                accessor: "type",
                width: 150,
                sortabel: true
            },
            {
                Header: Resources["status"][currentLanguage],
                accessor: "statusName",
                width: 150,
                sortabel: true
            },
            {
                Header: Resources["total"][currentLanguage],
                accessor: "total",
                width: 150,
                sortabel: true
            }
        ]

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} onRowClick={this.onRowClick} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'budgetCashFlowReport'} />
            : null

        return (

            <div className="mainContainer">
                <div class="submittalFilter">
                    <div class="subFilter">
                        <h3 class="zero">{Resources.budgetCashFlowReport[currentLanguage]}</h3>
                    </div>
                    <div class="filterBTNS">
                        {btnExport}
                    </div>
                </div>
                <div className='proForm reports__proForm'>
                    <div className="linebylineInput valid-input alternativeDate" >
                        <DatePicker title='startDate'
                            startDate={this.state.startDate}
                            handleChange={e => this.handleChange('startDate', e)} />
                    </div>

                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='finishDate'
                            startDate={this.state.finishDate}
                            handleChange={e => this.handleChange('finishDate', e)} />
                    </div>

                    <button className="primaryBtn-1 btn smallBtn" onClick={this.getGridRows}>{Resources['search'][currentLanguage]}</button>

                </div>

                <div className="doc-pre-cycle letterFullWidth">

                    <div className='proForm reports__proForm'>

                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources.estimatedCashIn[currentLanguage]}</label>
                            <div className="inputDev ui input">
                                <input readOnly className="form-control" value={this.state.EstimatedIn} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources.estimatedCashOut[currentLanguage]}</label>
                            <div className="inputDev ui input">
                                <input readOnly className="form-control" value={this.state.EstimatedOut} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources.actualTotalIn[currentLanguage]}</label>
                            <div className="inputDev ui input">
                                <input readOnly className="form-control" value={this.state.ActualTotalIn} />
                            </div>
                        </div>

                        <div className="linebylineInput valid-input">
                            <label className="control-label">{Resources.actualTotalOut[currentLanguage]}</label>
                            <div className="inputDev ui input">
                                <input readOnly className="form-control" value={this.state.ActualTotalOut} />
                            </div>
                        </div>

                    </div>

                    {this.state.showChart ?
                        <div className="row">
                            {Chart}
                        </div> : null}
                    {dataGrid}
                </div>

                <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false })}
                    title={Resources['actualTotalInOut'][currentLanguage]}
                    onCloseClicked={() => this.setState({ ShowPopup: false })} isVisible={this.state.ShowPopup}>

                    <div className="doc-pre-cycle letterFullWidth">

                        <ReactTable data={this.state.RowsDetails}
                            columns={columnsCycles}
                            defaultPageSize={5}
                            noDataText={Resources["noData"][currentLanguage]}
                            className="-striped -highlight" />
                    </div>

                </SkyLightStateless>


            </div >

        )
    }

}
function mapStateToProps(state, ownProps) {
    return {
        projectId: state.communication.projectId,
        showLeftMenu: state.communication.showLeftMenu,
        showSelectProject: state.communication.showSelectProject,
        projectName: state.communication.projectName,
        moduleName: state.communication.moduleName
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BudgetCashFlowReport));
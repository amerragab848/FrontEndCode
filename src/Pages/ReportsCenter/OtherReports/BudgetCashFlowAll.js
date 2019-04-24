import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import { SkyLightStateless } from 'react-skylight';
import moment from 'moment';
import Api from '../../../api.js';
import ReactTable from "react-table";
import "react-table/react-table.css";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')
const _ = require('lodash')
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

class BudgetCashFlowAll extends Component {

    constructor(props) {

        super(props)

        this.state = {
            isLoading: false,
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

    componentWillMount() {
    }

    getGridRows = () => {
        this.setState({ isLoading: true })
        let obj = {
            startDate: moment(this.state.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finishDate: moment(this.state.finishDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
        }
        Api.post('GetBudgetCashFlowAll', obj).then(res => {

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
            let EstimatedIn = _.sum(totalsEstimatedIn)
            let EstimatedOut = _.sum(totalsEstimatedOut)
            let ActualTotalIn = _.sum(totalsActualTotalIn)
            let ActualTotalOut = _.sum(totalsActualTotalOut)
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
                    startDate: moment(this.state.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                    finishDate: moment(this.state.finishDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
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
                    startDate: moment(this.state.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                    finishDate: moment(this.state.finishDate, 'DD-MM-YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS')
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

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.budgetCashFlowReport[currentLanguage]}</h2>
                    {btnExport}
                </header>

                <div className='proForm reports__proForm'>

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
export default withRouter(BudgetCashFlowAll)

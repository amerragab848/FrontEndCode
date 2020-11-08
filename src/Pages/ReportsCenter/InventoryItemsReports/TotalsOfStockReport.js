import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import ExportDetails from "../ExportReportCenterDetails";
import GridCustom from 'react-customized-grid';
import Api from '../../../api.js';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

class ExpensesStatus extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            rows: [],
            description: null,
            resourceCode: null,
            tableRows: [],
        }

        if (!Config.IsAllow(3728)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.columns = [
            {
                "field": "projectName",
                "title": Resources.projectName[currentLanguage],
                "type": "text",
                "width": 20,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "description",
                "title": Resources.description[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "resourceCode",
                "title": Resources.resourceCode[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "quantity",
                "title": Resources.transactionQuantity[currentLanguage],
                "type": "number",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "transactionTypeName",
                "title": Resources.transactionTypeName[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "itemCode",
                "title": Resources.itemCode[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "unit",
                "title": Resources.unit[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "unitPrice",
                "title": Resources.unitPrice[currentLanguage],
                "type": "number",
                "width": 15,
                "groupable": true,
                "sortable": true
            }
        ];
        this.fields = [{
            title: Resources["resourceCode"][currentLanguage],
            value: "",
            type: "text"
        }];
    }

    getGridRows = () => {
        this.setState({ isLoading: true, });

        Api.post(`GetMaterialInventoryByResource?resourceCode=${this.state.resourceCode}`).then(
            res => {
                this.setState({ tableRows: res, isLoading: false, });
            }).catch(() => { this.setState({ isLoading: false }) });
    }

    handleChange = (value, name) => this.setState({ [name]: value });

    getDataGrid = (item) => {
        this.setState({ isLoading: true });

        Api.post(`GetTotalsOfStock?resourceCode=${item.resourceCode}&materialInventoryId=${item.orderId}`).then(
            res => {
                this.setState({ rows: res, isLoading: false });
            }).catch(() => { this.setState({ isLoading: false }) });
    }

    render() {

        const tabelBody = this.state.tableRows.length > 0 ? (this.state.tableRows.map((i, index) => {

            return (
                <tr key={index}>
                    <td>
                        <div style={{ width: '100%' }} onClick={() => { this.getDataGrid(i) }} className="contentCell tableCell-1">
                            <span data-toggle="tooltip" title="Details" style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                                <i style={{ height: '16px', width: '16px' }} class="fa fa-pencil-square-o"></i>
                            </span>
                        </div>
                    </td>

                    <td style={{ width: '80px' }}>
                        <div className="contentCell" style={{ width: '100%', justifyContent: 'center', padding: '0' }}>
                            <p className="zero status">{i.arrange}</p>
                        </div>
                    </td>

                    <td style={{ width: '250px' }}> <div className="contentCell" style={{ maxWidth: 'unset', width: '100%' }}><p style={{ width: '100%' }} className="zero status">{i.description}</p> </div></td>

                    <td><div className="contentCell"> <p className="zero status">{i.unit}</p> </div></td>

                    <td><div className="contentCell"> <p className="zero status">{i.unitPrice}</p> </div></td>

                    <td><div className="contentCell"> <p className="zero status">{i.resourceCode}</p> </div></td>

                    <td><div className="contentCell"> <p className="zero status">{i.projectName}</p> </div></td>

                    <td><div className="contentCell"><p className="zero status">{i.quantity}</p></div></td>

                    <td><div className="contentCell"><p className="zero status">{i.total}</p></div></td>

                </tr>
            )
        })) : null

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />
        ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?

            <ExportDetails fieldsItems={this.columns}
                rows={this.state.rows}
                fields={this.fields} fileName={Resources.totalsOfStockReport[currentLanguage]} />
            : null

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.totalsOfStockReport[currentLanguage]}</h2>
                    {btnExport}
                </header>

                <div className='proForm reports__proForm datepickerContainer'>
                    <div className="linebylineInput valid-input">
                        <label className="control-label">{Resources.resourceCode[currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name='resourceCode' className="form-control fsadfsadsa" id="resourceCode"
                                placeholder={Resources.resourceCode[currentLanguage]} value={this.state.resourceCode}
                                onChange={(e) => { this.handleChange(e.target.value, 'resourceCode'); this.fields[0].value = e.target.value }} />
                        </div>
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" onClick={this.getGridRows}>{Resources['search'][currentLanguage]}</button>
                </div>

                <div className="doc-pre-cycle letterFullWidth" style={{ maxHeight: '350px', overflowY: 'scroll', marginBottom: '90px' }}>
                    <table className="attachmentTable" style={{ marginTop: '0' }}>
                        <thead>
                            <tr>
                                <th style={{ position: 'sticky', top: '0', }} >
                                    <div className="headCell tableCell-1">
                                        <span> {Resources["actions"][currentLanguage]} </span>
                                    </div>
                                </th>
                                <th style={{ position: 'sticky', top: '0', width: '80px' }} >
                                    <div className="headCell ">
                                        <span> {Resources["arrange"][currentLanguage]} </span>
                                    </div>
                                </th>
                                <th style={{ position: 'sticky', top: '0', }} >
                                    <div className="headCell ">
                                        <span> {Resources["description"][currentLanguage]} </span>
                                    </div>
                                </th>
                                <th style={{ position: 'sticky', top: '0', }} >
                                    <div className="headCell ">
                                        <span> {Resources["unit"][currentLanguage]} </span>
                                    </div>
                                </th>
                                <th style={{ position: 'sticky', top: '0', }} >
                                    <div className="headCell ">
                                        <span> {Resources["unitPrice"][currentLanguage]} </span>
                                    </div>
                                </th>
                                <th style={{ position: 'sticky', top: '0', }} >
                                    <div className="headCell ">
                                        <span> {Resources["resourceCode"][currentLanguage]} </span>
                                    </div>
                                </th>
                                <th style={{ position: 'sticky', top: '0', }} >
                                    <div className="headCell ">
                                        <span> {Resources["projectName"][currentLanguage]} </span>
                                    </div>
                                </th>
                                <th style={{ position: 'sticky', top: '0', }} >
                                    <div className="headCell ">
                                        <span> {Resources["quantity"][currentLanguage]} </span>
                                    </div>
                                </th>
                                <th style={{ position: 'sticky', top: '0', }} >
                                    <div className="headCell ">
                                        <span> {Resources["total"][currentLanguage]} </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        {this.state.tableRows.length > 0 ? <tbody>{tabelBody}</tbody> : null}
                    </table>
                </div>

                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>

        )
    }

}
export default withRouter(ExpensesStatus)

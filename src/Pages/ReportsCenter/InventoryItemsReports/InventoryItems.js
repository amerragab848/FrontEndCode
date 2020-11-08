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
            resourceCode: null
        }

        if (!Config.IsAllow(3723)) {
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
                "field": "unitPrice",
                "title": Resources.unitPrice[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "quantity",
                "title": Resources.quantity[currentLanguage],
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
                "field": "total",
                "title": Resources.total[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }
        ];
        this.fields = [{
            title: Resources["description"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["resourceCode"][currentLanguage],
            value: "",
            type: "text"
        }];
    }

    getGridRows = () => {
        this.setState({ isLoading: true })

        Api.get("GetByDescriptionAndResourceCode?description=" + this.state.description + "&resourceCode=" + this.state.resourceCode).then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    handleChange = (value, name) => {
        this.setState({ [name]: value })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />
        ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?

            <ExportDetails fieldsItems={this.columns}
                rows={this.state.rows}
                fields={this.fields} fileName={Resources.inventoryItems[currentLanguage]} />
            : null

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.inventoryItems[currentLanguage]}</h2>
                    {btnExport}
                </header>


                <div className='proForm reports__proForm datepickerContainer'>

                    <div className="linebylineInput valid-input">
                        <label className="control-label">{Resources.description[currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name='description' className="form-control fsadfsadsa" id="description"
                                placeholder={Resources.description[currentLanguage]} value={this.state.description}
                                onChange={(e) => { this.handleChange(e.target.value, 'description'); this.fields[0].value = e.target.value }} />
                        </div>
                    </div>
                    <div className="linebylineInput valid-input">
                        <label className="control-label">{Resources.resourceCode[currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name='resourceCode' className="form-control fsadfsadsa" id="resourceCode"
                                placeholder={Resources.resourceCode[currentLanguage]} value={this.state.resourceCode}
                                onChange={(e) => { this.handleChange(e.target.value, 'resourceCode'); this.fields[1].value = e.target.value }} />
                        </div>
                    </div>


                    <button className="primaryBtn-1 btn smallBtn" onClick={this.getGridRows}>{Resources['search'][currentLanguage]}</button>

                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>

        )
    }

}
export default withRouter(ExpensesStatus)

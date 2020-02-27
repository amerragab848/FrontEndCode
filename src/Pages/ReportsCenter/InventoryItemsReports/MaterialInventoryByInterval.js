import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import ExportDetails from "../ExportReportCenterDetails";
import GridCustom from 'react-customized-grid';
import Dataservice from '../../../Dataservice';
import Api from '../../../api.js';
import moment from 'moment';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

class ExpensesStatus extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            projectsData: [],
            projectIds: [],
            selectedProject: { label: Resources.projectName[currentLanguage], value: "0" },
            rows: [],
            startDate: moment(),
            finishDate: moment(),
            allProjects: false
        }

        if (!Config.IsAllow(3726)) {
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
                "width": 15,
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
                "field": "unit",
                "title": Resources.unit[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "purchased",
                "title": Resources.purchased[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "tranfare",
                "title": Resources.transfare[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "returned",
                "title": Resources.returned[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "consumption",
                "title": Resources.consumption[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "exchanges",
                "title": Resources.exchanges[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "drawingContractors",
                "title": Resources.drawingContractors[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalPurchased",
                "title": Resources.totalPurchased[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalTranfare",
                "title": Resources.totalTranfare[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalReturned",
                "title": Resources.totalReturned[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalConsumption",
                "title": Resources.totalConsumption[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalExchanges",
                "title": Resources.totalExchanges[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "totalDrawingContractors",
                "title": Resources.totalDrawingContractors[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "startQuantity",
                "title": Resources.startQuantity[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "finishQuantity",
                "title": Resources.finishQuantity[currentLanguage],
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
            }, {
                "field": "avgUnitPrice",
                "title": Resources.avgUnitPrice[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }
        ];
        this.fields = [{
            title: Resources["projectName"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["startDate"][currentLanguage],
            value: this.state.startDate,
            type: "D"
        }, {
            title: Resources["finishDate"][currentLanguage],
            value: this.state.finishDate,
            type: "D"
        }];
    }

    componentDidMount() {
        Dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'id').then(
            result => {
                this.setState({
                    projectsData: result
                })
            }).catch(() => {
                toast.error('somthing wrong')
            })
    }

    getGridRows = () => {
       
        this.setState({ isLoading: true })
        let obj = {
            startDate: moment(this.state.startDate),
            finishDate: moment(this.state.finishDate),
            projectId: this.state.projectId
        }
        Api.post('GetMaterialsInventoryByProjectId', obj).then(
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
    handleChangeDrop = (name, selected, e) => {
       
        this.setState({
            [name]: e.value,
            [selected]: e,

        })
    }
    handleChange = (name, value) => {
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
                fields={this.fields} fileName={Resources.materialInventoryByInterval[currentLanguage]} />
            : null

        return (


            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.materialInventoryByInterval[currentLanguage]}</h2>
                    {btnExport}
                </header>


                <div className='proForm reports__proForm'>
                    <div className="linebylineInput valid-input">
                        <Dropdown title='projectName' data={this.state.projectsData} name='projectName'
                            selectedValue={this.state.selectedCompany} handleChange={e => { this.handleChangeDrop('projectId', 'selectedProject', e); this.fields[0].value = e.label }} />

                    </div>
                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='startDate'
                            startDate={this.state.startDate}
                            handleChange={e => { this.handleChange('startDate', e); this.fields[1].value = e }} />
                    </div>

                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='finishDate'
                            startDate={this.state.finishDate}
                            handleChange={e => { this.handleChange('finishDate', e); this.fields[2].value = e }} />
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

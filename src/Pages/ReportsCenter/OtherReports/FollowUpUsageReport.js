import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import ExportDetails from "../ExportReportCenterDetails";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import moment from "moment";
//const _ = require('lodash')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
class WFUsageReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedWF: { label: Resources.slectWorkFlow[currentLanguage], value: "0" },
            rows: [],
            columns: [
                {
                    "field": "subject",
                    "title": Resources.subject[currentLanguage],
                    "type": "text",
                    "width": 15,
                    "fixed": true,
                    "groupable": true,
                    "sortable": true
                },
                {
                    "field": "level",
                    "title": Resources.levelNo[currentLanguage],
                    "type": "text",
                    "width": 15,
                    "fixed": true,
                    "groupable": true,
                    "sortable": true
                }
            ]

        }
        this.fields = [{
            title:  Resources["workFlow"][currentLanguage],
            value: "",
            type: "text"
        }
      ];
        if (!Config.IsAllow(3750)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

    }

    componentDidMount() {
        Api.get('GetAllWorkFlowList').then(result => {
            let list = []
            result.forEach((element) => {
                list.push({ label: element.subject, value: element.code })
            })
            this.setState({
                dropDownList: list
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    DropdownChange = (event) => {
        this.setState({ selectedWF: event, isLoading: true })

        Api.post('GetFollowUpsUsageParent?code=' + event.value).then(res => {

            let columns = [
                {
                    "field": "subject",
                    "title": Resources.subject[currentLanguage],
                    "type": "text",
                    "width": 15,
                    "fixed": true,
                    "groupable": true,
                    "sortable": true
                },
                {
                    "field": "level",
                    "title": Resources.levelNo[currentLanguage],
                    "type": "text",
                    "width": 15,
                    "groupable": true,
                    "sortable": true
                }]

            res.forEach((element) => {
                columns.push(
                    {
                        "field": element.projectName,
                        "title": element.projectName,
                        "type": "text",
                        "width": 15,
                        "groupable": true,
                        "sortable": true
                    })
            })

            this.setState({ columns, isLoading: false, rows: [] })
        })
    }

    getGridRows = () => {
        if (this.state.selectedWF.value != '0') {
            this.setState({ isLoading: true })
            Api.post('GetFollowUpsUsageChilds?code=' + this.state.selectedWF.value).then((res) => {
                let data = res != null ? res : []
                this.setState({ rows: data, isLoading: false })
            }).catch(() => {
                this.setState({ isLoading: false, rows: [] })
            })
        }
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' gridKey="FollowUpUsageReport" groups={[]} data={this.state.rows || []} cells={this.state.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />)
            : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
           // <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={'followUpsUsageReport'} />
           <ExportDetails fieldsItems={this.state.columns}
           rows={this.state.rows}
           fields={this.fields} fileName={'followUpsUsageReport'} />  
           : null

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.followUpsUsageReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm datepickerContainer'>
                    <div className="linebylineInput valid-input">
                        <Dropdown title="workFlow" data={this.state.dropDownList}
                            selectedValue={this.state.selectedWF} name="workFlows"
                            handleChange={event => {this.DropdownChange(event); this.fields[0].value = event.label }} index="workFlows" />
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getGridRows()}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}


export default WFUsageReport

import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
//import Export from "../../../Componants/OptionsPanels/Export"; 
import ExportDetails from "../ExportReportCenterDetails";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import CryptoJS from 'crypto-js';
import GridCustom from 'react-customized-grid';
import moment from "moment";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}

class TransmittalReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            employeesList: [],
            dropDownList: [],
            selectedEmployee: { label: Resources.selectEmployee[currentLanguage], value: "0" },
            finishDate: moment(),
            startDate: moment(),
            rows: [],
            status: true
        }

        if (!Config.IsAllow(4018)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }
        this.columns = [
            {
                "field": "arrange",
                "title": Resources.levelNo[currentLanguage],
                "type": "text",
                "width": 10,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "statusName",
                "title": Resources.statusName[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "projectName",
                "title": Resources.projectName[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "subject",
                "title": Resources.subject[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "fromCompanyName",
                "title": Resources.fromCompany[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "sendDate",
                "title": Resources.docDate[currentLanguage],
                "type": "date",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "lastApproveDate",
                "title": Resources.lastApproveDate[currentLanguage],
                "type": "date",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "duration2",
                "title": Resources.duration[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "oppenedBy",
                "title": Resources.openedBy[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "closedBy",
                "title": Resources.closedBy[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "actionByContactName",
                "title": Resources.actionByContact[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "workFlowName",
                "title": Resources.workFlowName[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "lastApprovalByContactName",
                "title": Resources.lastApproval[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "attachDocDate",
                "title": Resources.attachDocDate[currentLanguage],
                "type": "date",
                "width": 15,
                "groupable": true,
                "sortable": true
            }
        ];
        this.fields = [{
            title: Resources["startDate"][currentLanguage],
            value: this.state.startDate,
            type: "D"
        }, {
            title: Resources["finishDate"][currentLanguage],
            value: this.state.finishDate,
            type: "D"
        }];
    }

    subjectLink = ({ value, row }) => {
        let subject = "";
        if (row) {
            let obj = {
                docId: row.id,
                projectId: row.projectId,
                projectName: row.projectName,
                arrange: 0,
                docApprovalId: 0,
                isApproveMode: false
            };
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
            let doc_view = "/TransmittalAddEdit?id=" + encodedPaylod
            subject = row.subject;
            return <a href={doc_view}> {subject} </a>;
        }
        return null;
    };

    getGridRows = () => {
        this.setState({ isLoading: true })
        let reportobj = {
            status: this.state.status,
            startDate: moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finishDate: moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        }
        Api.post('GetTransmittalReports', reportobj).then((res) => {
            this.setState({ rows: res, isLoading: false })
        }).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
           // <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'transmittalReport'} />
           <ExportDetails fieldsItems={this.columns}
           rows={this.state.rows}
           fields={this.fields} fileName={'transmittalReport'} />  
           : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.transmittalReport[currentLanguage]}</h2>
                    {btnExport}
                </header>

                <div className='proForm reports__proForm datepickerContainer' style={{ marginBottom: '0' }}>

                    <div className="linebylineInput valid-input">
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="status" defaultChecked="checked" onChange={e => this.handleChange('status', true)} />
                            <label>{Resources['transmittal'][currentLanguage]}</label>
                        </div>
                    </div>
                    <div className="linebylineInput valid-input">
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="status" onChange={e => this.handleChange('status', false)} />
                            <label>{Resources['Submittal'][currentLanguage]}</label>
                        </div>
                    </div>

                </div>

                <div className='proForm reports__proForm datepickerContainer' style={{ marginTop: '0' }}>

                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='startDate'
                            startDate={this.state.startDate}
                            handleChange={e => {this.handleChange('startDate', e); this.fields[0].value = e }} />
                    </div>
                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='finishDate'
                            startDate={this.state.finishDate}
                            handleChange={e => {this.handleChange('finishDate', e); this.fields[1].value = e }} />
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


export default TransmittalReport

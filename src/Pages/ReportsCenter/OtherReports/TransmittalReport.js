import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import CryptoJS from 'crypto-js';
import moment from "moment";
const _ = require('lodash')
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
                key: "arrange",
                name: Resources["levelNo"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "statusName",
                name: Resources["statusName"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true, formatter: this.subjectLink
            }, {
                key: "fromCompanyName",
                name: Resources["fromCompany"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "sendDate",
                name: Resources["docDate"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "lastApproveDate",
                name: Resources["lastApproveDate"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "duration2",
                name: Resources["duration"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "oppenedBy",
                name: Resources["openedBy"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "closedBy",
                name: Resources["closedBy"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "actionByContactName",
                name: Resources["actionByContact"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "workFlowName",
                name: Resources["workFlowName"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "lastApprovalByContactName",
                name: Resources["lastApproval"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "attachDocDate",
                name: Resources["attachDocDate"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }
        ];

    }

    componentDidMount() {
    }
    componentWillMount() {

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
            startDate: moment(this.state.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            finishDate: moment(this.state.finishDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
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
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'transmittalReport'} />
            : null

        return (


            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.transmittalReport[currentLanguage]}</h2>
                    {btnExport}
                </header>

                <div className='proForm reports__proForm' style={{ marginBottom: '0' }}>

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

                <div className='proForm reports__proForm' style={{ marginTop: '0' }}>

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

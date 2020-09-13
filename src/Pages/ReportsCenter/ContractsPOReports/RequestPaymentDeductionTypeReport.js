import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import moment from "moment";
import dataService from '../../../Dataservice';
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import ExportDetails from "../ExportReportCenterDetails";
import CryptoJS from 'crypto-js';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class RequestPaymentDeductionTypeReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deductionTypesList: [],
            rows: [],
            selectedDeductionType: { label: Resources.deductionType[currentLanguage], value: "-1" },
            finishDate: moment(),
            startDate: moment(),
        }

        this.columns = [
            {
                field: "requestSubject",
                title: Resources["requestSubject"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
                href: 'link',
                classes: 'bold'
            }, {
                field: "description",
                title: Resources["description"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "deductionValue",
                title: Resources["deductionValue"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "deductionName",
                title: Resources["deductionType"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "requestPaymentDate",
                title: Resources["requestDate"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }
        ];
        if (!Config.IsAllow(10075)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.fields = [{
            title: Resources["deductionType"][currentLanguage],
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
        this.setState({ isLoading: true })
        dataService.GetDataList('GetaccountsDefaultListForList?listType=deductionType', 'title', 'id').then(res => {
            this.setState({ deductionTypesList: res, isLoading: false })
        })
    }

    getGridtData = () => {
        if (this.state.selectedDeductionType.value != '-1') {
            this.setState({ isLoading: true })
            Api.get(`GetRequestPaymentDeductionTypeForReport?deductionTypeId=${this.state.selectedDeductionType.value}&start=${this.state.startDate}&end=${this.state.finishDate}`).then(rows => {
                rows.forEach(row => {
                    let obj = {
                        docId: row.requestId,
                        projectId: row.projectId,
                        projectName: row.projectName,
                        docApprovalId : 0,
                        arrange : 0,
                        isApproveMode: false,
                        perviousRoute: window.location.pathname + window.location.search
                    };
                    let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
                    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
                    let doc_view = "/requestPaymentsAddEdit?id=" + encodedPaylod
                    row.link = doc_view;
                });
                this.setState({ rows, isLoading: false })
            }).catch(() => {
                this.setState({ isLoading: false })
                toast.error(Resources.operationCanceled[currentLanguage])
            })
        }
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }
    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                key="requestPaymentDeductionTypeReport"
                data={this.state.rows}
                pageSize={1000}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.RequestPaymentDeductionTypeReport[currentLanguage]} />
        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.RequestPaymentDeductionTypeReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>
                    <div className="linebylineInput valid-input">
                        <Dropdown
                            title="deductionType"
                            data={this.state.deductionTypesList}
                            selectedValue={this.state.selectedDeductionType}
                            handleChange={event => { this.setState({ selectedDeductionType: event }); this.fields[0].value = event.label }}
                            name="deductionType"
                            index="deductionType"
                        />
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

                    <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getGridtData()}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}


export default RequestPaymentDeductionTypeReport

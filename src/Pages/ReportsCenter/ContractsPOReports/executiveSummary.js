import React, { Component, Fragment } from 'react'
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

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}
class executiveSummary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projectList: [],
            rows: [],
            project: { label: Resources.projectSelection[currentLanguage], value: "-1" },
            finishDate: moment(),
            startDate: moment(),
            ContractSum: 0,
            countContract: 0,
            pageSize: 200,
        }

        this.columns = [
            {
                field: "arrange",
                title: Resources["numberAbb"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: "statusName",
                title: Resources["status"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "subject",
                title: Resources["projectManagerContact"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "companyName",
                title: Resources["CompanyName"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "docDate",
                title: Resources["docDate"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: "toCompanyName",
                title: Resources["contractTo"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "toContactName",
                title: Resources["ToContact"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "docCloseDate",
                title: Resources["docClosedate"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: "originalContactSum",
                title: Resources["originalContractSum"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "refDoc",
                title: Resources["refDoc"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "tax",
                title: Resources["tax"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "retainage",
                title: Resources["retainage"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "vat",
                title: Resources["vat"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "advancedPayment",
                title: Resources["advancedPayment"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "insurance",
                title: Resources["insurance"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "oppenedBy",
                title: Resources["openedBy"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "closedBy",
                title: Resources["closedBy"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "lastEditDate",
                title: Resources["lastEditDate"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: "lastSnedTime",
                title: Resources["lastSendTime"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "lastApproveDate",
                title: Resources["lastApproveDate"][currentLanguage],
                width: 80,
                width: 18,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: "lastApproveTime",
                title: Resources["lastApprovedTime"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
        ];
        if (!Config.IsAllow(3697)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
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
        }, {
            title: Resources["originalContractSum"][currentLanguage],
            value: this.state.ContractSum,
            type: "text"
        }, {
            title: Resources["countContract"][currentLanguage],
            value: this.state.countContract,
            type: "text"
        }];
    }
    componentDidMount() {
        this.setState({ isLoading: true })
        dataService.GetDataList('SelectAllCompany', 'companyName', 'id').then(res => {
            this.setState({ projectList: res, isLoading: false })
        })
    }

    getGridtData = () => {
        if (this.state.project.value != '-1') {
            this.setState({ currentComponent: null })
            let reportobj = {
                companyId: this.state.project.value,
                startDate: moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                finishDate: moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            }
            Api.post('GetSumAndCountOfContract', reportobj).then(res => {
                if (res[0]) {
                    this.fields[3].value = res[0].originalContactSum;
                    this.fields[4].value = res[0].countContract;
                    this.setState({ ContractSum: res[0].originalContactSum, countContract: res[0].countContract })
                }
            }).catch(() => {
                toast.error(Resources.operationCanceled[currentLanguage])
            })
            this.setState({ isLoading: true })
            Api.post('GetAllContractByCompanyId', reportobj).then(rows => {
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
                key="executiveSummary"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.executiveSummary[currentLanguage]} />
        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.executiveSummary[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm datepickerContainer'>
                    <div className="linebylineInput valid-input">
                        <Dropdown
                            title="Projects"
                            data={this.state.projectList}
                            selectedValue={this.state.project}
                            handleChange={event => { this.setState({ project: event }); this.fields[0].value = event.label }}
                            name="projects"
                            index="projects"
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
                    <div className="fullWidthWrapper textLeft reports__proForm" style={{ marginBottom: '0' }}>
                        <div className="linebylineInput even ">
                            <label className="control-label">{Resources.originalContractSum[currentLanguage]}</label>
                            <div className="inputDev ui input">
                                <input type="text" name="contractSum" value={this.state.ContractSum} />
                            </div>
                        </div>
                        <div className="linebylineInput even">
                            <label className="control-label">{Resources.countContract[currentLanguage]}</label>
                            <div className="inputDev ui input">
                                <input type="text" name="countContract" value={this.state.countContract} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}


export default executiveSummary

import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Export from "../../../Componants/OptionsPanels/Export";
import moment from "moment";
import dataService from '../../../Dataservice'
import GridSetup from "../../Communication/GridSetup"
import HeaderDocument from '../../../Componants/OptionsPanels/HeaderDocument'
const _ = require('lodash')
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
            countContract: 0
        }
        this.columns = [
            {
                key: "arrange",
                name: Resources["numberAbb"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "statusName",
                name: Resources["status"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "subject",
                name: Resources["projectManagerContact"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "toCompanyName",
                name: Resources["contractTo"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "toContactName",
                name: Resources["ToContact"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "docCloseDate",
                name: Resources["docClosedate"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "originalContactSum",
                name: Resources["originalContractSum"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "refDoc",
                name: Resources["refDoc"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "tax",
                name: Resources["tax"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "retainage",
                name: Resources["retainage"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "vat",
                name: Resources["vat"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "advancedPayment",
                name: Resources["advancedPayment"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "insurance",
                name: Resources["insurance"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "oppenedBy",
                name: Resources["openedBy"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "closedBy",
                name: Resources["closedBy"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "lastEditDate",
                name: Resources["lastEditDate"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "lastSnedTime",
                name: Resources["lastSendTime"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "lastApproveDate",
                name: Resources["lastApproveDate"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "lastApproveTime",
                name: Resources["lastApprovedTime"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ];
        if (!Config.IsAllow(3697)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

    }
    componentWillMount() {
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
                startDate: moment(this.state.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
                finishDate: moment(this.state.finishDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            }
            Api.post('GetSumAndCountOfContract', reportobj).then(res => {
                if (res[0]) {
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
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'executiveSummary'} />
            : null
        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.executiveSummary[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>
                    <div className="linebylineInput valid-input">
                        <Dropdown
                            title="Projects"
                            data={this.state.projectList}
                            selectedValue={this.state.project}
                            handleChange={event => { this.setState({ project: event }); }}
                            name="projects"
                            index="projects"
                        />
                    </div>
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

                    <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getGridtData()}>{Resources['search'][currentLanguage]}</button>
                    <div className="fullWidthWrapper textLeft reports__proForm" style={{marginBottom:'0'}}>
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

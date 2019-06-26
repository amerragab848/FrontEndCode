import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import Dataservice from '../../../Dataservice';
import moment from 'moment';
import Api from '../../../api.js';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

class ExpensesStatus extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            CompaniesData: [],
            AccountsData: [],
            selectedCompany: { label: Resources.ComapnyNameRequired[currentLanguage], value: "0" },
            selectedAccount: { label: Resources.selectAccounts[currentLanguage], value: "0" },
            rows: [],
            startDate: moment(),
            finishDate: moment(),
        }

        if (!Config.IsAllow(3759)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.columns = [
            {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 170,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "description",
                name: Resources["description"][currentLanguage],
                width: 170,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 170,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            },
            {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 170,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "expenseTypeName",
                name: Resources["expensesType"][currentLanguage],
                width: 170,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            },
            {
                key: "refCode",
                name: Resources["refrenceCode"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "total",
                name: Resources["total"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            },
            {
                key: "workFlowName",
                name: Resources["lastWorkFlow"][currentLanguage],
                width: 170,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "approvalStatusName",
                name: Resources["approvalStatus"][currentLanguage],
                width: 170,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "comment",
                name: Resources["comment"][currentLanguage],
                width: 170,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }
        ];
    }

    componentWillMount() {
        Dataservice.GetDataList('SelectAllCompany', 'companyName', 'id').then(
            result => {
                this.setState({
                    CompaniesData: result
                })
            }).catch(() => {
                toast.error('somthing wrong')
            })
    }


    getGridRows = () => {
        this.setState({ isLoading: true })

        let obj = {
            fromDate: this.state.startDate,
            toDate: this.state.finishDate,
            companyId: this.state.selectedCompany.value,
            accountId: this.state.selectedAccount.value
        }
        Api.post('GetAllExpensesByCompanyOrAccount', obj).then(
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

    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    HandleChangeProject = (e) => {

        this.setState({ selectedCompany: e })
        Dataservice.GetDataList('GetAccountsByCompanyId?companyId=' + e.value + '', 'userName', 'id').then(
            res => {
                this.setState({
                    AccountsData: res
                })
            }).catch((e) => {
                toast.error('somthing wrong')
            })
    }

    render() { 
        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'expensesStatus'} />
            : null

        return (


            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.expensesStatus[currentLanguage]}</h2>
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

                    <div className="linebylineInput valid-input">
                        <Dropdown title='CompanyName' data={this.state.CompaniesData} name='selectedCompany'
                            selectedValue={this.state.selectedCompany} handleChange={e => this.HandleChangeProject(e)} />

                    </div>

                    <div className="linebylineInput valid-input " >
                        <Dropdown title='accounts' data={this.state.AccountsData} name='selectedAccount'
                            selectedValue={this.state.selectedAccount}
                            handleChange={e => this.setState({ selectedAccount: e })} />

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

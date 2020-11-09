import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
//import Export from "../../../Componants/OptionsPanels/Export";
import ExportDetails from "../ExportReportCenterDetails";
import GridCustom from 'react-customized-grid';
import Dataservice from '../../../Dataservice';
import moment from 'moment';
import Api from '../../../api.js';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

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
                "field": "docDate",
                "title": Resources.docDate[currentLanguage],
                "type": "date",
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
                "field": "projectName",
                "title": Resources.projectName[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "contactName",
                "title": Resources.ContactName[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "expenseTypeName",
                "title": Resources.expensesType[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "refCode",
                "title": Resources.refrenceCode[currentLanguage],
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
                "field": "workFlowName",
                "title": Resources.lastWorkFlow[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "approvalStatusName",
                "title": Resources.approvalStatus[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "comment",
                "title": Resources.comment[currentLanguage],
                "type": "text",
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
        },{
            title: Resources["CompanyName"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["accounts"][currentLanguage],
            value: "",
            type: "text"
        }];
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
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />
        ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            //<Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'expensesStatus'} />
            <ExportDetails fieldsItems={this.columns}
             rows={this.state.rows}
             fields={this.fields} fileName={'expensesStatus'} />
            : null

        return (


            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.expensesStatus[currentLanguage]}</h2>
                    {btnExport}
                </header>


                <div className='proForm reports__proForm datepickerContainer'>

                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='startDate'
                            startDate={this.state.startDate}
                            handleChange={e => {this.handleChange('startDate', e); this.fields[0].value = e }} />
                    </div>

                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker title='finishDate'
                            startDate={this.state.finishDate}
                            handleChange={e => {this.handleChange('finishDate', e);this.fields[1].value = e}} />
                    </div>

                    <div className="linebylineInput valid-input">
                        <Dropdown title='CompanyName' data={this.state.CompaniesData} name='selectedCompany'
                            selectedValue={this.state.selectedCompany} handleChange={e => {this.HandleChangeProject(e);this.fields[2].value = e.label}} />

                    </div>

                    <div className="linebylineInput valid-input " >
                        <Dropdown title='accounts' data={this.state.AccountsData} name='selectedAccount'
                            selectedValue={this.state.selectedAccount}
                            handleChange={e => {this.setState({ selectedAccount: e });this.fields[3].value = e.label}} />

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

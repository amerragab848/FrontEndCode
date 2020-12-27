import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import moment from "moment";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import ExportDetails from "../ExportReportCenterDetails";
import GridCustom from 'react-customized-grid';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class WFActivityReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            employeesList: [],
            dropDownList: [],
            accountId: 0,
            selectedEmployee: { label: Resources.selectEmployee[currentLanguage], value: "0" },
            rows: [],
            startDate: moment(),
            finishDate: moment(),
            checkAllEmployees: false,
            pageNumber: 0,
            pageSize: 100,
            totalRows: 0
        }

        if (!Config.IsAllow(4017)) {
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
                "width": 5,
                "fixed": true,
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
                "width": 20,
                "groupable": true,
                "sortable": true
            }, {
                "field": "docDurationDays",
                "title": Resources.docDurationDays[currentLanguage],
                "type": "text",
                "width": 20,
                "groupable": true,
                "sortable": true
            }, {
                "field": "docTypeName",
                "title": Resources.docType[currentLanguage],
                "type": "text",
                "width": 20,
                "groupable": true,
                "sortable": true
            }, {
                "field": "previousLevelApprovalDate",
                "title": Resources.previousLevelApprovalDate[currentLanguage],
                "type": "date",
                "width": 20,
                "groupable": true,
                "sortable": true
            }, {
                "field": "userApprovalDate",
                "title": Resources.userApprovalDate[currentLanguage],
                "type": "date",
                "width": 20,
                "groupable": true,
                "sortable": true
            }, {
                "field": "approvalStatusName",
                "title": Resources.approvalStatusName[currentLanguage],
                "type": "text",
                "width": 20,
                "groupable": true,
                "sortable": true
            }, {
                "field": "userDurationDays",
                "title": Resources.userDurationDays[currentLanguage],
                "type": "text",
                "width": 20,
                "groupable": true,
                "sortable": true
            }
        ];
        this.fields = [
            {
                title: Resources["employee"][currentLanguage],
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
    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    componentDidMount() {
    }

    componentWillMount() {
        if (Config.IsAllow(4022) || Config.getPayload().uty === 'company') {
            Api.get('GetAllContactsWithAccount').then(result => {
                let list = []
                result.forEach((element) => {
                    list.push({ label: element.contactName, value: element.id })
                })
                this.setState({
                    employeesList: result,
                    dropDownList: list
                });
            }).catch(() => {
                toast.error('somthing wrong')
            })
        } else {
            let accId = Config.getPayload().aci;
            let contactName = localStorage.getItem("contactName") !== null ? localStorage.getItem('contactName') : 'Procoor User'
            let list = []
            list.push({ label: contactName, value: accId })

            this.setState({
                accountId: accId,
                dropDownList: list
            });
        }
    }

    getGridRows = () => {
        if (this.state.selectedEmployee.value != '0' || this.state.checkAllEmployees == true) {
            let startDate = moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]hh:mm:ss.sss');
            let finishDate = moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]hh:mm:ss.sss');
            if (Config.IsAllow(4022) || Config.getPayload().uty === 'company') {
                let accountId = 0;
                if (this.state.checkAllEmployees != true) {
                    let selectedValue = this.state.selectedEmployee.value;
                    let account = this.state.employeesList.find(x => x.id == selectedValue);
                    accountId = account != undefined ? account.accountId : 0;
                }
                this.setState({
                    accountId: accountId,
                    isLoading: true
                })
                let obj = {
                    employeeId: accountId,
                    startDate: startDate,
                    finishDate: finishDate,
                    pageNumber: this.state.pageNumber,
                    pageSize: this.state.pageSize
                }
                Api.post('GetWorkFlowActivity', obj).then((res) => {
                    this.setState({ rows: res.data || [], totalRows: res.total || 0, isLoading: false })
                }).catch(() => {
                    this.setState({ isLoading: false })
                })
            } else {
                this.setState({ isLoading: true })
                this.fields[0].value = localStorage.getItem("contactName") !== null ? localStorage.getItem('contactName') : 'Procoor User';
                let obj = {
                    employeeId: this.state.accountId,
                    startDate: startDate,
                    finishDate: finishDate,
                    pageNumber: this.state.pageNumber,
                    pageSize: this.state.pageSize
                }
                Api.post('GetWorkFlowActivity', obj).then((res) => {
                    this.setState({ rows: res.data || [], totalRows: res.total || 0, isLoading: false })
                }).catch(() => {
                    this.setState({ isLoading: false })
                })
            }
        }
    }

    checkChange = (e) => {
        this.setState({ checkAllEmployees: e.target.checked });
    }

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;

        if (pageNumber >= 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });

            let startDate = moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]hh:mm:ss.sss');
            let finishDate = moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]hh:mm:ss.sss');

            let obj = {
                employeeId: this.state.accountId,
                startDate: startDate,
                finishDate: finishDate,
                pageNumber: pageNumber,
                pageSize: this.state.pageSize
            }

            Api.post(`GetWorkFlowActivity`, obj).then(result => {
                this.setState({
                    rows: result.data,
                    isLoading: false
                });

            }).catch(ex => {
                let oldRows = this.state.rows;
                this.setState({
                    rows: oldRows,
                    isLoading: false
                });
            });
        }
    };

    GetNextData() {
        let pageNumber = this.state.pageNumber + 1;
        let maxRows = this.state.totalRows;

        if (this.state.pageSize * pageNumber <= maxRows) {

            this.setState({
                isLoading: true,
                pageNumber: pageNumber
            });

            let startDate = moment(this.state.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]hh:mm:ss.sss');
            let finishDate = moment(this.state.finishDate, 'YYYY-MM-DD').format('YYYY-MM-DD[T]hh:mm:ss.sss');

            let obj = {
                employeeId: this.state.accountId,
                startDate: startDate,
                finishDate: finishDate,
                pageNumber: pageNumber,
                pageSize: this.state.pageSize
            }

            Api.post(`GetWorkFlowActivity`, obj).then(result => {
                this.setState({
                    rows: result.data,
                    isLoading: false
                });

            }).catch(ex => {
                let oldRows = this.state.rows;
                this.setState({
                    rows: oldRows,
                    isLoading: false
                });
            });
        }
    };

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows ? this.state.rows.length : 0} actions={[]} rowActions={[]} rowClick={() => { }}
            />
        ) : <LoadingSection />;

        const btnExport = this.state.isLoading === false ?
            <ExportDetails fieldsItems={this.columns}
                rows={this.state.rows}
                fields={this.fields} fileName={'workFlowActivity'} />
            : null

        return (
            <div className="reports__content">
                <header className="pagination">
                    <div>
                        <h2 className="zero">{Resources.workFlowActivity[currentLanguage]}</h2>
                        {btnExport}
                    </div>
                    <div className="rowsPaginations readOnly__disabled">
                        <div className="rowsPagiRange">
                            <span>
                                {this.state.pageSize *
                                    this.state.pageNumber +
                                    1}
                            </span>{' '}
                            -
                                <span>
                                {this.state.filterMode
                                    ? this.state.totalRows
                                    : this.state.pageSize *
                                    this.state.pageNumber +
                                    this.state.pageSize}
                            </span>
                            {
                                Resources['jqxGridLanguage'][
                                    currentLanguage
                                ].localizationobj.pagerrangestring
                            }
                            <span> {this.state.totalRows}</span>
                        </div>
                        <button
                            className={
                                this.state.pageNumber == 0
                                    ? 'rowunActive'
                                    : ''
                            }
                            onClick={() => this.GetPrevoiusData()}>
                            <i className="angle left icon" />
                        </button>
                        <button
                            className={
                                this.state.totalRows !==
                                    this.state.pageSize *
                                    this.state.pageNumber +
                                    this.state.pageSize
                                    ? 'rowunActive'
                                    : ''
                            }
                            onClick={() => this.GetNextData()}>
                            <i className="angle right icon" />
                        </button>
                    </div>

                </header>
                <div className='proForm reports__proForm datepickerContainer'>
                    {this.state.checkAllEmployees != true ?
                        <div className="linebylineInput valid-input">
                            <Dropdown title="employee" data={this.state.dropDownList} index="employees"
                                selectedValue={this.state.selectedEmployee} name="employees"
                                handleChange={event => { this.setState({ selectedEmployee: event }); this.fields[0].value = event.label }} />
                        </div>
                        : null}
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
                    {(Config.IsAllow(4022) || Config.getPayload().uty === 'company') ?
                        <div className="linebylineInput">
                            <div className="ui checkbox checkBoxGray300 checked" >
                                <input type="checkbox"
                                    id="allEmployees"
                                    name="allEmployees"
                                    value={this.state.checkAllEmployees}
                                    checked={this.state.checkAllEmployees}
                                    onChange={(e) => { this.checkChange(e); }}
                                />
                                <label>{Resources.allEmployees[currentLanguage]}</label>
                            </div>
                        </div>
                        : null}
                    <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getGridRows()}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }
}

export default WFActivityReport

import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import moment from "moment";
const _ = require('lodash')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
class WFActivityReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            employeesList: [],
            dropDownList: [],
            selectedEmployee: { label: Resources.selectEmployee[currentLanguage], value: "0" },
            rows: []
        }

        if (!Config.IsAllow(4017)) {
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
            }

            , {
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
                sortDescendingFirst: true
            }, {
                key: "docDurationDays",
                name: Resources["docDurationDays"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "docTypeName",
                name: Resources["docType"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "previousLevelApprovalDate",
                name: Resources["previousLevelApprovalDate"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "userApprovalDate",
                name: Resources["userApprovalDate"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "approvalStatusName",
                name: Resources["approvalStatusName"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "userDurationDays",
                name: Resources["userDurationDays"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ];

    }

    componentDidMount() {
    }

    componentWillMount() {
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
    }

    getGridRows = () => {
        if (this.state.selectedEmployee.value != '0') {
            this.state.employeesList.forEach(employee => {
                if (employee.id == this.state.selectedEmployee.value) {
                    this.setState({ isLoading: true })
                    Api.get('GetWorkFlowActivity?accountId=' + employee.accountId).then((res) => {
                        this.setState({ rows: res, isLoading: false })
                    }).catch(() => {
                        this.setState({ isLoading: false })
                    })
                }
            });

        }
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />;


        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'workFlowActivity'} />
            : null

        return (


            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.workFlowActivity[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>
                    <div className="linebylineInput valid-input">
                        <Dropdown title="employee" data={this.state.dropDownList} index="employees"
                            selectedValue={this.state.selectedEmployee} name="employees"
                            handleChange={event => this.setState({ selectedEmployee: event })} />
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
export default WFActivityReport

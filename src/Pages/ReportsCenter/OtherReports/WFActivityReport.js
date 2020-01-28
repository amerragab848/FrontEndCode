import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from 'react-customized-grid';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

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
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />
        ) : <LoadingSection />;

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

import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import dataservice from "../../../Dataservice";
import moment from "moment";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}

class TasksList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            companiesList: [],
            selectedCompany: { label: Resources.companyRequired[currentLanguage], value: 0 },
            rows: [],
            selectedContact: { label: Resources.selectContact[currentLanguage], value: 0 },
            contactsList: []
        }

        if (!Config.IsAllow(3705)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

        }

        this.columns = [{
            key: "arrange",
            name: Resources["documentNumber"][currentLanguage],
            width: 180,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            frozen: true,
            sortDescendingFirst: true
        }, {
            key: "subject",
            name: Resources["subject"][currentLanguage],
            width: 140,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true,
        }, {
            key: "bicContactName",
            name: Resources["ContactName"][currentLanguage],
            width: 140,
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
            key: "finishDate",
            name: Resources["requiredDate"][currentLanguage],
            width: 120,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true,
            formatter: dateFormate
        }, {
            key: "docDelay",
            name: Resources["delay"][currentLanguage],
            width: 100,
            draggable: true,
            sortable: true,
            resizable: true,
            filterable: true,
            sortDescendingFirst: true
        }
        ];

    }

    componentDidMount() {
        this.getDataList('GetCompanies?accountOwnerId=2', 'companyName', 'id', 'companiesList');
        if (Config.IsAllow(3737))
            this.columns.push({
                key: "cost",
                name: Resources["cost"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            })
    }

    getGridRows = () => {
        this.setState({ isLoading: true });

        let obj = {
            companyId: this.state.selectedCompany.value,
            contactId: this.state.selectedContact.value
        }
        Api.post('GetUsersTasksList', obj).then((res) => {
            if (res.length > 0) {
                this.setState({
                    rows: res, isLoading: false
                });
            }
            else
                this.setState({
                    rows: [], isLoading: false
                });

        }).catch(() => {
            this.setState({ isLoading: false })
        })

    }

    getDataList = (api, title, value, targetState) => {
        this.setState({
            isLoading: true
        });
        dataservice.GetDataList(api, title, value).then(result => {
            this.setState({
                [targetState]: result,
                isLoading: false
            });
        }).catch(() => {
            this.setState({
                [targetState]: [],
                isLoading: false
            });
            toast.error('somthing wrong')
        })
    }
    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                selectedCopmleteRow={true}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={Resources['taskList'][currentLanguage]} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.taskList[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>

                    <div className="linebylineInput valid-input">
                        <Dropdown title="CompanyName" name="CompanyName" index="CompanyName"
                            data={this.state.companiesList} selectedValue={this.state.selectedCompany}
                            handleChange={event => {
                                this.setState({
                                    selectedCompany: event,
                                    selectedContact: { label: Resources.selectContact[currentLanguage], value: 0 },
                                    rows: []
                                })
                                this.getDataList('GetContactsByCompanyId?companyId=' + event.value, 'contactName', 'id', 'contactsList');
                            }}
                            isClear={false}
                            isMulti={false} />
                    </div>

                    <div className="linebylineInput valid-input">
                        <Dropdown title="ContactName" name="ContactName" index="ContactName"
                            data={this.state.contactsList} selectedValue={this.state.selectedContact}
                            handleChange={event => this.setState({ selectedContact: event })}
                            isClear={false}
                            isMulti={false} />
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" onClick={this.getGridRows}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

} export default TasksList;

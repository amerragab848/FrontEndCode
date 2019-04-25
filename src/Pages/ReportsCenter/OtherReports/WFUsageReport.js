import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class WFUsageReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedWF: { label: Resources.slectWorkFlow[currentLanguage], value: "0" },
            rows: [],
            columns: [
                {
                    key: "subject",
                    name: Resources["subject"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }

                , {
                    key: "weekNo",
                    name: Resources["weekNumber"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }, {
                    key: "weeklyPending",
                    name: Resources["weeklyPending"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }, {
                    key: "weeklyTotal",
                    name: Resources["weeklyTotal"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }, {
                    key: "avgDurationWeekly",
                    name: Resources["avgDurationWeekly"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }, {
                    key: "avgDuration",
                    name: Resources["avgDuration"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }, {
                    key: "totalDocs",
                    name: Resources["totalDocs"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }
            ]

        }

        if (!Config.IsAllow(3749)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

    }

    componentDidMount() {
    }

    componentWillMount() {
        Api.get('GetAllWorkFlowList').then(result => {
            let list = []
            result.forEach((element) => {
                list.push({ label: element.subject, value: element.code })
            })
            this.setState({
                dropDownList: list
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getGridRows = () => {
        if (this.state.selectedWF.value != '0') {
            this.setState({ isLoading: true })
            Api.post('GetWFUsageChilds?code=' + this.state.selectedWF.value).then((res) => {
                this.setState({ rows: res, isLoading: false })
            }).catch(() => {
                this.setState({ isLoading: false })
            })
        }

    }

    DropdownChange = (event) => {
        this.setState({ selectedWF: event })
        Api.post('GetWFUsageParent?code=' + event.value).then(res => {
            if (res[0] != undefined) {
                this.setState({ isLoading: true })
                let docNo = res[0].docNo
                let duration = res[0].duration
                let columns = [...this.state.columns];

                columns.push(
                    {
                        key: docNo,
                        name: docNo,
                        width: 100,
                        draggable: true,
                        sortable: true,
                        resizable: true,
                        filterable: true,
                        sortDescendingFirst: true
                    })

                columns.push({
                    key: duration,
                    name: duration,
                    width: 100,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                })

                this.setState({ columns, isLoading: false, rows: [] })
            }
        })
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.state.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={'workFlowActivity'} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.workFlowUsageReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>
                    <div className="linebylineInput valid-input">

                        <Dropdown title="workFlow" name="workFlows" index="workFlows"
                            data={this.state.dropDownList} selectedValue={this.state.selectedWF}
                            handleChange={event => this.DropdownChange(event)} />

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


export default WFUsageReport

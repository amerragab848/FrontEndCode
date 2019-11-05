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
//const _ = require('lodash')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
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
                    width: 150,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }, {
                    key: "level",
                    name: Resources["levelNo"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                },
            ]

        }

        if (!Config.IsAllow(3750)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

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

    DropdownChange = (event) => {
        this.setState({ selectedWF: event, isLoading: true })

        Api.post('GetFollowUpsUsageParent?code=' + event.value).then(res => {

            let columns = [
                {
                    key: "subject",
                    name: Resources["subject"][currentLanguage],
                    width: 150,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }, {
                    key: "level",
                    name: Resources["levelNo"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }, {
                    key: "level",
                    name: Resources["levelNo"][currentLanguage],
                    width: 120,
                    draggable: true,
                    sortable: true,
                    resizable: true,
                    filterable: true,
                    sortDescendingFirst: true
                }]

            res.forEach((element) => {
                columns.push(
                    {
                        key: element.projectName,
                        name: element.projectName,
                        width: 120, draggable: true, sortable: true,
                        resizable: true, filterable: true, sortDescendingFirst: true
                    })
            })

            this.setState({ columns, isLoading: false, rows: [] })
        })
    }

    getGridRows = () => {
        if (this.state.selectedWF.value != '0') {
            this.setState({ isLoading: true })
            Api.post('GetFollowUpsUsageChilds?code=' + this.state.selectedWF.value).then((res) => {
                let data=res!=null?res:[]
                this.setState({ rows: data, isLoading: false })
            }).catch(() => {
                this.setState({ isLoading: false ,rows:[]})
            })
        }
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.state.columns} />)
            : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={'followUpsUsageReport'} />
            : null

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.followUpsUsageReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>
                    <div className="linebylineInput valid-input">
                        <Dropdown title="workFlow" data={this.state.dropDownList}
                            selectedValue={this.state.selectedWF} name="workFlows"
                            handleChange={event => this.DropdownChange(event)} index="workFlows" />
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

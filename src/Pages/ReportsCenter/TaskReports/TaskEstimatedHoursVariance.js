import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export"; 
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";

import dataservice from "../../../Dataservice";
import BarChartComp from '../../../Componants/ChartsWidgets/BarChartCompJS'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class TaskEstimatedHoursVariance extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedProjects: [],
            selectedStatus: { label: Resources['all'][currentLanguage], value: null },
            rows: [],
            showChart: false,
            pageSize: 200,
        }

        if (!Config.IsAllow(3700)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });

        }
        this.statusData = [
            { label: Resources['all'][currentLanguage], value: null },
            { label: Resources['oppened'][currentLanguage], value: true },
            { label: Resources['closed'][currentLanguage], value: false }
        ]
        this.columns = [{
            field: "projectName",
            title: Resources["projectName"][currentLanguage],
            width: 15,
            groupable: true,
            fixed: true,
            type: "text",
            sortable: true,
        }, {
            field: "estimatedTime",
            title: Resources["estimatedTime"][currentLanguage],
            width: 15,
            groupable: true,
            fixed: false,
            type: "text",
            sortable: true,
        }, {
            field: "actualTotal",
            title: Resources["actualTotal"][currentLanguage],
            width: 15,
            groupable: true,
            fixed: false,
            type: "text",
            sortable: true,
        }, {
            field: "variance",
            title: Resources["variance"][currentLanguage],
            width: 15,
            groupable: true,
            fixed: false,
            type: "text",
            sortable: true,
        }
        ];
    }

    componentDidMount() {
        dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'id').then(result => {
            this.setState({
                dropDownList: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
    }

    getGridRows = () => {
        if (this.state.selectedProjects.length != 0) {
            this.setState({ isLoading: true })
            let projectIds = [];
            this.state.selectedProjects.forEach(item => {
                projectIds.push(item.value);
            })
            this.setState({ showChart: false })
            let obj = {
                projectIds,
                status: this.state.selectedStatus.value
            }

            Api.post('GetTasksByProjectIdReport', obj).then((res) => {
                if (res.length > 0) {
                    let data = [];
                    res.forEach(item => {
                        if (item.estimatedTime == undefined || item.estimatedTime == 0) item.estimatedTime = 0;
                        if (item.actualTotal == undefined || item.actualTotal == 0) item.actualTotal = 0;
                        if (item.variance == undefined || item.variance == 0) item.variance = 0;
                        data.push(item)
                    })
                    this.setState({
                        rows: data, isLoading: false, showChart: true
                    });
                }
            }).catch(() => {
                this.setState({ isLoading: false })
            })
        }
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (

            <GridCustom
                ref='custom-data-grid'
                key="TaskEstimatedHoursVariance"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />
            
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={Resources['taskEstimatedHoursVariance'][currentLanguage]} />
            : null

        let Chart = this.state.showChart ?
            <BarChartComp
                api='GetTasksByProjectIdReport'
                reports={true}
                rows={this.state.rows}
                barContent={[
                    { name: "Estimated", value: 'estimatedTime' },
                    { name: "Actual", value: 'actualTotal' },
                    { name: "Variance", value: 'variance' }

                ]}
                catagName="projectName"
                multiSeries="yes"
                ukey="wt-Name203"
                title={Resources['taskEstimatedHoursVariance'][currentLanguage]}
                y="total"
                yTitle={Resources['total'][currentLanguage]} /> : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.taskEstimatedHoursVariance[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>

                    <div className="linebylineInput valid-input">
                        <Dropdown title="Projects" name="Projects" index="Projects"
                            data={this.state.dropDownList} selectedValue={this.state.selectedProjects}
                            handleChange={event => this.setState({ selectedProjects: event })}
                            isMulti={true} />
                    </div>
                    <div className="linebylineInput valid-input">
                        <Dropdown title="status" name="status" index="status"
                            data={this.statusData} selectedValue={this.state.selectedStatus}
                            handleChange={event => this.setState({ selectedStatus: event })} />
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getGridRows()}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="row">
                    {Chart}
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}

export default TaskEstimatedHoursVariance

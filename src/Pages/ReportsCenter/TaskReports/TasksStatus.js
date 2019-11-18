import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import dataservice from "../../../Dataservice";
import SkyLight from 'react-skylight';
import moment from "moment";
import PieChart from '../PieChartComp'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : Resources.noDate[currentLanguage];
};
class TasksStatus extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            dropDownList: [],
            selectedProject: { label: Resources.selectProjects[currentLanguage], value: "0" },
            rows: [], series: [], showModal: false, selectedRow: {}
        }

        if (!Config.IsAllow(3698)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }
        this.columns = [
            {
                key: "arrange",
                name: Resources["arrange"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                frozen: true,
                sortDescendingFirst: true
            }, {
                key: "description",
                name: Resources["Task"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                frozen: true,
                sortDescendingFirst: true
            }, {
                key: "bicCompanyName",
                name: Resources["actionByCompany"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                frozen: true,
                sortDescendingFirst: true
            }, {
                key: "actionBy",
                name: Resources["actionByContact"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "estimatedTime",
                name: Resources["estimatedTime"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "actualTotal",
                name: Resources["actualTotal"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "userProgress",
                name: Resources["userProgress"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "actualProgress",
                name: Resources["actualProgress"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "earnedProgress",
                name: Resources["earnedProgress"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "remaining",
                name: Resources["remaining"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "estimatedCost",
                name: Resources["estimatedCost"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "earnedHours",
                name: Resources["earnedHours"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "startDate",
                name: Resources["startDate"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "finishDate",
                name: Resources["finishDate"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
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
            }
        ];
    }

    componentWillMount() {
        dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'id').then(result => {
            this.setState({
                dropDownList: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
        if (Config.IsAllow(3737)) {
            this.columns.push({
                key: "cost",
                name: Resources["cost"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            })
        }
    }

    getGridRows = () => {
        let data = [];
        if (this.state.selectedProject.value != '0') {
            this.setState({ isLoading: true })
            Api.get('GetTasksByProjectIdWithOutPageNumber?projectId=' + this.state.selectedProject.value).then((res) => {
                let estimat = 0;
                let user = 0;
                let remaining = 0;
                let earnedProgress = 0;
                res.forEach(item => {
                    data.push({ y: item.actualTotal, name: item.subject });

                    estimat += item["estimatedTime"];
                    user += item["actualTotal"];
                    remaining += item["remaining"];
                    earnedProgress += item["earnedProgress"];
                })
                let series = [{ data }]

                this.setState({
                    rows: res, isLoading: false, series,
                    totalEstimatedTime: estimat,
                    totalUserProgress: user,
                    totalRemaining: remaining,
                    totalEarnedProgress: earnedProgress
                });
            }).catch(() => {
                this.setState({ isLoading: false })
            })
        }
    }

    onRowClick(value, index, column) {
        this.setState({ showModal: true, selectedRow: value });
        this.simpleDialog.show()
    }
    render() {
        const View =
            <Fragment>
                <div id="departmentsForm" className="dropWrapper readOnly_inputs"  >
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['fromCompany'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={this.state.selectedRow.fromCompanyName || ""} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['fromContact'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={this.state.selectedRow.fromContactName || ""} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['Task'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={this.state.selectedRow.projectName || ""} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['arrange'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={this.state.selectedRow.arrange || ""} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['actionByCompany'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={this.state.selectedRow.bicCompanyName || ""} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['docDate'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={dateFormate({ value: this.state.selectedRow.docDate })} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['actionByContact'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={this.state.selectedRow.bicContactName || ""} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['finishDate'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={dateFormate({ value: this.state.selectedRow.finishDate })} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['startDate'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={dateFormate({ value: this.state.selectedRow.startDate })} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['totalUserInputs'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={this.state.totalUserProgress || 0} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['estimateTime'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={this.state.selectedRow.estimatedTime || 0} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['remaining'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={this.state.selectedRow.remaining || 0} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['actualProgress'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={this.state.selectedRow.actualProgress || 0} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['earnedProgress'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={this.state.selectedRow.earnedProgress || 0} />
                        </div>
                    </div>
                    <div className="fillter-item-c">
                        <label className="control-label">{Resources['comments'][currentLanguage]}</label>
                        <div className="inputDev ui input">
                            <input name="titleNameEn" className="form-control " id="titleNameEn" value={this.state.selectedRow.comment || ""} />
                        </div>
                    </div>
                </div>

            </Fragment>
        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.rows} showCheckbox={false}
                selectedCopmleteRow={true} selectedRows={rows => this.selectedRows(rows)}
                pageSize={this.state.pageSize} columns={this.columns} onRowClick={(value, index, column) => this.onRowClick(value, index, column)} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={Resources['taskStatus'][currentLanguage]} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.taskStatus[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>

                    <div className="linebylineInput valid-input">
                        <Dropdown title="Projects" name="Projects" index="Projects"
                            data={this.state.dropDownList} selectedValue={this.state.selectedProject}
                            handleChange={event => this.setState({ selectedProject: event })} />
                    </div>
                    <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getGridRows()}>{Resources['search'][currentLanguage]}</button>
                </div>
                <div className="row" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="col-xs-6">
                        <div class=" flexForm" style={{ marginBottom: '20px' }}>
                            <label class="control-label" style={{ marginLeft: '0px' }}>{Resources['totalEstimatedTime'][currentLanguage] + " : "}</label>
                            <div class="inputPassContainer">
                                <label class="control-label">{Number.parseFloat(this.state.totalEstimatedTime || 0).toFixed(2)}</label>
                            </div>
                        </div>
                        <div class=" flexForm" style={{ marginBottom: '20px' }}>
                            <label class="control-label" style={{ marginLeft: '0px' }}>{Resources['totalUserInputs'][currentLanguage] + " : "}</label>
                            <div class="inputPassContainer">
                                <label class="control-label">{Number.parseFloat(this.state.totalUserProgress || 0).toFixed(2)}</label>
                            </div>
                        </div>
                        <div class=" flexForm" style={{ marginBottom: '20px' }}>
                            <label class="control-label" style={{ marginLeft: '0px' }}>{Resources['earnedProgress'][currentLanguage] + " : "}</label>
                            <div class="inputPassContainer">
                                <label class="control-label">{Number.parseFloat(this.state.totalEarnedProgress || 0).toFixed(2)}</label>
                            </div>
                        </div>
                        <div class=" flexForm" style={{ marginBottom: '20px' }}>
                            <label class="control-label" style={{ marginLeft: '0px' }}>{Resources['totalRemaining'][currentLanguage] + " : "}</label>
                            <div class="inputPassContainer">
                                <label class="control-label">{Number.parseFloat(this.state.totalRemaining || 0).toFixed(2)}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6">
                        <PieChart series={this.state.series} title={" "} hideQuntity={true} />
                    </div>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources['View'][currentLanguage]}>
                        <div className="proForm">
                            {View}
                        </div>
                    </SkyLight>
                </div>
            </div>


        )
    }

}

export default TasksStatus

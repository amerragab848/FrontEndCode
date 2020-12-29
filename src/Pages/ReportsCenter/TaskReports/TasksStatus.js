import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import ExportDetails from "../ExportReportCenterDetails";
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
            pageSize: 200,
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
                field: "arrange",
                title: Resources["arrange"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            }, {
                field: "description",
                title: Resources["Task"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            }, {
                field: "bicCompanyName",
                title: Resources["actionByCompany"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            }, {
                field: "actionBy",
                title: Resources["actionByContact"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "estimatedTime",
                title: Resources["estimatedTime"][currentLanguage],
                width: 8,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "actualTotal",
                title: Resources["actualTotal"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "userProgress",
                title: Resources["userProgress"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "actualProgress",
                title: Resources["actualProgress"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "earnedProgress",
                title: Resources["earnedProgress"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "remaining",
                title: Resources["remaining"][currentLanguage],
                width: 8,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "estimatedCost",
                title: Resources["estimatedCost"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "earnedHours",
                title: Resources["earnedHours"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "startDate",
                title: Resources["startDate"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: "finishDate",
                title: Resources["finishDate"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: "docCloseDate",
                title: Resources["docClosedate"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }
        ];

        this.fields = [{
            title: Resources["Projects"][currentLanguage],
            value: "",
            type: "text"
        }, {
            title: Resources["totalEstimatedTime"][currentLanguage],
            value: 0,
            type: "text"
        }, {
            title: Resources["totalUserInputs"][currentLanguage],
            value: 0,
            type: "text"
        }, {
            title: Resources["earnedProgress"][currentLanguage],
            value: 0,
            type: "text"
        }, {
            title: Resources["totalRemaining"][currentLanguage],
            value: 0,
            type: "text"
        }];
    }

    componentDidMount() {
        dataservice.GetDataList('ProjectProjectsGetAll', 'projectName', 'id').then(result => {
            this.setState({
                dropDownList: result
            });
        }).catch(() => {
            toast.error('somthing wrong')
        })
        if (Config.IsAllow(3737)) {
            this.columns.push({
                field: "cost",
                title: Resources["cost"][currentLanguage],
                width: 18,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
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

                this.fields[1].value = estimat;
                this.fields[2].value = user;
                this.fields[3].value = earnedProgress;
                this.fields[4].value = remaining;

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
                <div id="departmentsForm" className="dropWrapper readOnly_inputs">
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

            <GridCustom
                ref='custom-data-grid'
                gridKey="taskStatus"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={cell => {
                    this.setState({ showModal: true, selectedRow: cell });
                    this.simpleDialog.show()
                }}
            />) : <LoadingSection />
        const btnExport = <ExportDetails fieldsItems={this.columns}
            rows={this.state.rows} fields={this.fields} fileName={Resources.taskStatus[currentLanguage]} />

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.taskStatus[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm datepickerContainer'>
                    <div className="linebylineInput valid-input">
                        <Dropdown title="Projects" name="Projects" index="Projects"
                            data={this.state.dropDownList} selectedValue={this.state.selectedProject}
                            handleChange={event => { this.setState({ selectedProject: event }); this.fields[0].value = event.label }} />
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

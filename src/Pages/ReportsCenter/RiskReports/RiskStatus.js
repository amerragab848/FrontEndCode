import React, { Component, Fragment } from "react";
import Resources from "../../../resources.json";
import { toast } from "react-toastify";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Config from "../../../Services/Config";
import Dropdown from "../../../Componants/OptionsPanels/DropdownMelcous";
import ExportDetails from "../ExportReportCenterDetails";
import moment from "moment";
import DatePicker from "../../../Componants/OptionsPanels/DatePicker";
import dataService from "../../../../src/Dataservice";
import GridCustom from 'react-customized-grid';
import 'react-customized-grid/main.css';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const StatusDropData = [
    { label: Resources.open[currentLanguage], value: true },
    { label: Resources.close[currentLanguage], value: false },
    { label: Resources.pending[currentLanguage], value: null }
];

class RiskStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectedStatus: {
                label: Resources.selectAll[currentLanguage],
                value: ""
            },
            rows: [],
            finishDate: moment(),
            startDate: moment()
        };

        if (!Config.IsAllow(4022)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.columns = [
            {
                "field": "subject",
                "title": Resources.subject[currentLanguage],
                "type": "text",
                "width": 15,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "statusName",
                "title": Resources.status[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "toCompanyName",
                "title": Resources.responsibleCompanyName[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "toContactName",
                "title": Resources.responsibleContactName[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "docDate",
                "title": Resources.docDate[currentLanguage],
                "type": "date",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "requiredDate",
                "title": Resources.requiredDate[currentLanguage],
                "type": "date",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "emv",
                "title": Resources.EMV[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "riskRanking",
                "title": Resources.riskRanking10[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "docCloseDate",
                "title": Resources.docClosedate[currentLanguage],
                "type": "date",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "oppenedBy",
                "title": Resources.openedBy[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "closedBy",
                "title": Resources.closedBy[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "lastEditBy",
                "title": Resources.lastEdit[currentLanguage],
                "type": "text",
                "width": 10,
                "groupable": true,
                "sortable": true
            }, {
                "field": "lastEditDate",
                "title": Resources.lastEditDate[currentLanguage],
                "type": "date",
                "width": 10,
                "groupable": true,
                "sortable": true
            }
        ];
        this.fields = [{
            title:  Resources["status"][currentLanguage],
            value: "",
            type: "text"
        },{
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
        this.setState({ [name]: value });
    };

    getGridRows = () => {
        this.setState({ isLoading: true });

        let startDate = moment(this.state.startDate, "YYYY-MM-DD").format(
            "YYYY-MM-DD[T]HH:mm:ss.SSS"
        );

        let finishDate = moment(this.state.finishDate, "YYYY-MM-DD").format(
            "YYYY-MM-DD[T]HH:mm:ss.SSS"
        );

        dataService
            .GetDataGrid(
                "GetRiskByTypeStatus?status=" +
                this.state.selectedStatus.value +
                "&startDate=" +
                startDate +
                "&finishDate=" +
                finishDate
            )
            .then(res => {
                this.setState({
                    rows: res || [],
                    isLoading: false
                });
            })
            .catch(() => {
                this.setState({ isLoading: false });
            });
    };

    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                    pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
                />
            ) : (
                    <LoadingSection />
                );

        const btnExport =
            this.state.isLoading === false ? (
                <ExportDetails fieldsItems={this.columns}
                rows={this.state.rows}
                fields={this.fields} fileName={'activeProjectsReport'} />
            ) : null;

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">
                        {Resources.riskStatus[currentLanguage]}
                    </h2>
                    {btnExport}
                </header>
                <div className="proForm reports__proForm">
                    <div className="linebylineInput valid-input">
                        <Dropdown
                            title="status"
                            data={StatusDropData}
                            selectedValue={this.state.selectedStatus}
                            handleChange={e =>{
                                this.setState({ selectedStatus: e });this.fields[0].value = e.label }
                            }
                        />
                    </div>
                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker
                            title="startDate"
                            startDate={this.state.startDate}
                            handleChange={e =>{
                                this.handleChange("startDate", e); this.fields[1].value = e }
                            }
                        />
                    </div>
                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker
                            title="finishDate"
                            startDate={this.state.finishDate}
                            handleChange={e =>{
                                this.handleChange("finishDate", e); this.fields[2].value = e }
                            }
                        />
                    </div>
                    <button
                        className="primaryBtn-1 btn smallBtn"
                        onClick={this.getGridRows}>
                        {Resources["search"][currentLanguage]}
                    </button>
                </div>
                <div className="doc-pre-cycle letterFullWidth">{dataGrid}</div>
            </div>
        );
    }
}
export default RiskStatus;

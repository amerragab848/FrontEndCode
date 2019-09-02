import React, { Component, Fragment } from "react";
import Resources from "../../../resources.json";
import { toast } from "react-toastify";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Config from "../../../Services/Config";
import Dropdown from "../../../Componants/OptionsPanels/DropdownMelcous";
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup";
import moment from "moment";
import DatePicker from "../../../Componants/OptionsPanels/DatePicker";
import dataService from "../../../../src/Dataservice";

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
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
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "statusName",
                name: Resources["status"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "toCompanyName",
                name: Resources["responsibleCompanyName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "toContactName",
                name: Resources["responsibleContactName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate 
            },
            {
                key: "requiredDate",
                name: Resources["requiredDate"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "emv",
                name: Resources["EMV"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "riskRanking",
                name: Resources["riskRanking10"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "docCloseDate",
                name: Resources["docClosedate"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "oppenedBy",
                name: Resources["openedBy"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "closedBy",
                name: Resources["closedBy"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "lastEditBy",
                name: Resources["lastEdit"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "lastEditDate",
                name: Resources["lastEditDate"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }
        ];
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
                <GridSetup
                    rows={this.state.rows}
                    showCheckbox={false}
                    pageSize={this.state.pageSize}
                    columns={this.columns}
                />
            ) : (
                <LoadingSection />
            );

        const btnExport =
            this.state.isLoading === false ? (
                <Export
                    rows={this.state.isLoading === false ? this.state.rows : []}
                    columns={this.columns}
                    fileName={"activeProjectsReport"}
                />
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
                            handleChange={e =>
                                this.setState({ selectedStatus: e })
                            }
                        />
                    </div>
                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker
                            title="startDate"
                            startDate={this.state.startDate}
                            handleChange={e =>
                                this.handleChange("startDate", e)
                            }
                        />
                    </div>
                    <div className="linebylineInput valid-input alternativeDate">
                        <DatePicker
                            title="finishDate"
                            startDate={this.state.finishDate}
                            handleChange={e =>
                                this.handleChange("finishDate", e)
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

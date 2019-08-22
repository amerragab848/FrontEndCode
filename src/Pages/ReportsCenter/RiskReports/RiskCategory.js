import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Resources from "../../../resources.json";
import { toast } from "react-toastify";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Config from "../../../Services/Config";
import Dropdown from "../../../Componants/OptionsPanels/DropdownMelcous";
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup";
import moment from "moment";
import DatePicker from "../../../Componants/OptionsPanels/DatePicker";
import Api from "../../../api";

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const StatusDropData = [
    { label: Resources.open[currentLanguage], value: true },
    { label: Resources.close[currentLanguage], value: false },
    { label: Resources.pending[currentLanguage], value: null }
];

class RiskCategory extends Component {
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
            startDate: moment(),
            noClicks: 0,
            showChart: false
        };

        if (!Config.IsAllow(3686)) {
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
                sortDescendingFirst: true
            },
            {
                key: "requiredDate",
                name: Resources["requiredDate"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
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
                sortDescendingFirst: true
            }
        ];
    }

    handleChange = (name, value) => {
        this.setState({ [name]: value });
    };

    getGridRows = () => {
        this.setState({ isLoading: true });
        let noClicks = this.state.noClicks;
        Api.get(
            "ActiveProjectReport?status=" + this.state.selectedStatus.value + ""
        )
            .then(res => {
                this.setState({ showChart: true });
                let hold = 0;
                let unhold = 0;
                res.map(i => {
                    if (i.statusName === "UnHold") unhold = unhold + 1;

                    if (i.statusName === "Hold") hold = hold + 1;
                });

                let series = [
                    {
                        name:
                            Resources["activeProjectsReport"][currentLanguage],
                        data: [
                            {
                                y: hold,
                                name: Resources["holded"][currentLanguage]
                            },
                            {
                                y: unhold,
                                name: Resources["unHolded"][currentLanguage]
                            }
                        ],
                        type: "pie"
                    }
                ];

                this.setState({
                    noClicks: noClicks + 1,
                    rows: res,
                    isLoading: false,
                    showChart: true
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
export default withRouter(RiskCategory);

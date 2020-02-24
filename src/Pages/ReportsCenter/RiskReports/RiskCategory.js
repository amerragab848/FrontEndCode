import React, { Component } from "react";
import Resources from "../../../resources.json";
import { toast } from "react-toastify";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Config from "../../../Services/Config";
import Dropdown from "../../../Componants/OptionsPanels/DropdownMelcous";
//import Export from "../../../Componants/OptionsPanels/Export";
import ExportDetails from "../ExportReportCenterDetails";
import GridCustom from 'react-customized-grid';
import moment from "moment";
import DatePicker from "../../../Componants/OptionsPanels/DatePicker";
import dataService from "../../../../src/Dataservice";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class RiskCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectedCategory: {
                label: Resources.selectCategorisation[currentLanguage],
                value: ""
            },
            Categorisation: [],
            rows: [],
            finishDate: moment(),
            startDate: moment()
        };

        if (!Config.IsAllow(4025)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

        this.columns = [
            {
                field: "subject",
                title: Resources["subject"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "statusName",
                title: Resources["status"][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                type: "text"
            }, {
                field: "toCompanyName",
                title: Resources["responsibleCompanyName"][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                type: "text"
            }, {
                field: "toContactName",
                title: Resources["responsibleContactName"][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                type: "text"
            }, {
                field: "docDate",
                title: Resources["docDate"][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                type: "date"
            }, {
                field: "requiredDate",
                title: Resources["requiredDate"][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                type: "date"
            }, {
                field: "emv",
                title: Resources["EMV"][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                type: "text"
            }, {
                field: "riskRanking",
                title: Resources["riskRanking10"][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                type: "text"
            }, {
                field: "docCloseDate",
                title: Resources["docClosedate"][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                type: "date"
            }, {
                field: "oppenedBy",
                title: Resources["openedBy"][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                type: "text"
            }, {
                field: "closedBy",
                title: Resources["closedBy"][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                type: "text"
            }, {
                field: "lastEditBy",
                title: Resources["lastEdit"][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                type: "text"
            }, {
                field: "lastEditDate",
                title: Resources["lastEditDate"][currentLanguage],
                width: 8,
                groupable: true,
                sortable: true,
                type: "date"
            }
        ];
        this.fields = [{
            title:  Resources["categorisation"][currentLanguage],
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

    componentDidMount() {
        dataService.GetDataList("GetRiskCategoriesForDrop", "categoryName", "id").then(res => {
                this.setState({ Categorisation: [...res], isLoading: false });
            });
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
                "GetRiskByCategoryId?categoryId=" +
                this.state.selectedCategory.value +
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
                <GridCustom
                    cells={this.columns}
                    data={this.state.rows}
                    groups={[]}
                    pageSize={this.state.rows.length}
                    actions={[]}
                    rowActions={[]}
                    rowClick={() => { }}
                />
            ) : (
                    <LoadingSection />
                );

        const btnExport =
            this.state.isLoading === false ? (
                // <Export
                //     rows={this.state.isLoading === false ? this.state.rows : []}
                //     columns={this.columns}
                //     fileName={"activeProjectsReport"}
                // />
                <ExportDetails fieldsItems={this.columns}
                rows={this.state.rows}
                fields={this.fields} fileName={'Risk Caategory"'} />
            ) : null;

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">
                        {Resources.riskCategory[currentLanguage]}
                    </h2>
                    {btnExport}
                </header>
                <div className="proForm reports__proForm">
                    <div className="linebylineInput valid-input">
                        <Dropdown
                            title="categorisation"
                            data={this.state.Categorisation}
                            selectedValue={this.state.selectedCategory}
                            handleChange={e =>{
                                this.setState({ selectedCategory: e });this.fields[0].value = e.label}
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
export default RiskCategory;

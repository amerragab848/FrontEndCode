import React, { Component, Fragment } from "react";
import Resources from "../../../resources.json";
import { toast } from "react-toastify";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Config from "../../../Services/Config";
import Dropdown from "../../../Componants/OptionsPanels/DropdownMelcous";
import ExportDetails from "../ExportReportCenterDetails";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import dataService from "../../../../src/Dataservice";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class RiskReports extends Component {

    constructor(props) {

        super(props);

        this.state = {
            isLoading: false,
            selectedType: { label: Resources.selectedType[currentLanguage], value: "0" },
            selectedCompany: { label: Resources.selectCompany[currentLanguage], value: "0" },
            selectedValue: { label: "", value: "0" },
            fillDataGrid: [],
            riskType: [{ label: "Total", value: "1" }, { label: "By Discipline", value: "2" },
            { label: "By Consequence Type", value: "3" }, { label: "By Risk Owner", value: "4" },
            { label: "By Action Owner", value: "5" }, { label: "RBS Type", value: "6" },
            { label: "Phase", value: "7" }, { label: "Stage", value: "8" },
            { label: "G Contractor", value: "9" }, { label: "Structure", value: "10" },
            { label: "Lot", value: "11" }],
            discipline: false,
            owner: false,
            defaultType: false,
            listesType: [],
            listesTypeData: [],
            title: "",
            projectId: window.localStorage.getItem("lastSelectedProject"),
            companies: [],
            typeDocument: ""
        };

        if (!Config.IsAllow(4026)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({ pathname: "/" });
        }

        this.columns = [
            {
                "field": "month",
                "title": 'Newly entered IN LAST MONTH',
                "type": "text",
                "width": 25,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "updated",
                "title": 'Updated',
                "width": 15,
                "groupable": true,
                "sortable": true,
                "type": "text"
            }, {
                "field": "closed",
                "title": 'Closed',
                "width": 15,
                "groupable": true,
                "sortable": true,
                "type": "text"
            }
        ];

        this.fields = [{
            title:  Resources["type"][currentLanguage],
            value: "",
            type: "text"
        },{
            title:this.state.title,
            value: "",
            type: "text"
        },{
            title: Resources["company"][currentLanguage],
            value: "",
            type: "text"
        }];
    }

    componentDidMount() {
        const listType = ["projectPhase", "organisation", "managementlevel", "project_stage", "lots", "assets_types", "discipline"];

        dataService.addObject("GetContainsAccountsDefaultList", listType).then(result => {
            this.setState({ listesType: result || [] });
        });

        dataService.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, "companyName", "companyId").then(result => {
            this.setState({ companies: result || [] });
        });
    }

    handleChange = (e) => {

        this.setState({ isLoading: true });

        switch (e.label) {
            case "Total":
                let totalData = [{ month: 40, closed: 15, updated: 25 }, { month: 50, closed: 25, updated: 25 }, { month: 60, closed: 30, updated: 30 }];

                setTimeout(() => {
                    this.setState({
                        selectedType: e,
                        fillDataGrid: totalData,
                        isLoading: false,
                        typeDocument: "Total"
                    });
                }, 500);
                break;
            case "By Discipline":

                const discipline = this.state.listesType.filter(x => x.listType === "discipline").map(x => { return { label: x.title, value: x.id } });
                setTimeout(() => {
                    this.setState({
                        title: "discipline",
                        defaultType: true,
                        owner: false,
                        selectedType: e,
                        listesTypeData: discipline,
                        isLoading: false,
                        selectedValue: { label: "Selected Discipline", value: "0" },
                        typeDocument: "By Discipline",
                        fillDataGrid: []
                    });
                }, 500);
                break;
            case "By Consequence Type":

                let consequenceData = [{ month: 100, closed: 50, updated: 50 }, { month: 80, closed: 40, updated: 40 }, { month: 70, closed: 35, updated: 35 }];
                setTimeout(() => {
                    this.setState({
                        selectedType: e,
                        defaultType: false,
                        owner: false,
                        isLoading: false,
                        fillDataGrid: consequenceData,
                        typeDocument: "By Consequence Type"
                    });
                }, 500);
                break;
            case "By Risk Owner":
                setTimeout(() => {
                    this.setState({
                        selectedType: e,
                        owner: true,
                        defaultType: false,
                        isLoading: false,
                        typeDocument: "By Risk Owner",
                        fillDataGrid: []
                    });
                }, 500);
                break;
            case "By Action Owner":
                setTimeout(() => {
                    this.setState({
                        selectedType: e,
                        owner: true,
                        defaultType: false,
                        isLoading: false,
                        typeDocument: "By Action Owner",
                        fillDataGrid: []
                    });
                }, 500);
                break;
            case "RBS Type":
                const organisation = this.state.listesType.filter(x => x.listType === "organisation").map(x => { return { label: x.title, value: x.id } });
                setTimeout(() => {
                    this.setState({
                        title: "organisation",
                        defaultType: true,
                        owner: false,
                        selectedType: e,
                        listesTypeData: organisation,
                        selectedValue: { label: "Selected RBS", value: "0" },
                        isLoading: false,
                        typeDocument: "RBS Type",
                        fillDataGrid: []
                    });
                }, 500);
                break;
            case "Phase":
                const projectPhase = this.state.listesType.filter(x => x.listType === "projectPhase").map(x => { return { label: x.title, value: x.id } });
                setTimeout(() => {
                    this.setState({
                        title: "projectPhase",
                        defaultType: true,
                        owner: false,
                        selectedType: e,
                        listesTypeData: projectPhase,
                        selectedValue: { label: "Selected Project Phase", value: "0" },
                        isLoading: false,
                        typeDocument: "Phase",
                        fillDataGrid: []
                    });
                }, 500);
                break;
            case "Stage":

                const project_stage = this.state.listesType.filter(x => x.listType === "project_stage").map(x => { return { label: x.title, value: x.id } });
                setTimeout(() => {
                    this.setState({
                        title: "projectStage",
                        defaultType: true,
                        owner: false,
                        selectedType: e,
                        listesTypeData: project_stage,
                        selectedValue: { label: "Selected Project Stage", value: "0" },
                        isLoading: false,
                        typeDocument: "Stage",
                        fillDataGrid: []
                    });
                }, 500);
                break;
            case "G Contractor":

                const managementlevel = this.state.listesType.filter(x => x.listType === "managementlevel").map(x => { return { label: x.title, value: x.id } });
                setTimeout(() => {
                    this.setState({
                        title: "managementlevel",
                        defaultType: true,
                        owner: false,
                        selectedType: e,
                        listesTypeData: managementlevel,
                        selectedValue: { label: "Selected G Contractor", value: "0" },
                        isLoading: false,
                        typeDocument: "G Contractor",
                        fillDataGrid: []
                    });
                }, 500);
                break;
            case "Structure":
                const assets_types = this.state.listesType.filter(x => x.listType === "assets_types").map(x => { return { label: x.title, value: x.id } });
                setTimeout(() => {
                    this.setState({
                        title: "assetsTypes",
                        defaultType: true,
                        owner: false,
                        selectedType: e,
                        listesTypeData: assets_types,
                        selectedValue: { label: "Selected Assets Types", value: "0" },
                        isLoading: false,
                        typeDocument: "Structure",
                        fillDataGrid: []
                    });
                }, 500);
                break;
            case "Lot":
                const lots = this.state.listesType.filter(x => x.listType === "lots").map(x => { return { label: x.title, value: x.id } });
                setTimeout(() => {
                    this.setState({
                        title: "lots",
                        defaultType: true,
                        owner: false,
                        selectedType: e,
                        listesTypeData: lots,
                        selectedValue: { label: "Selected Lot", value: "0" },
                        isLoading: false,
                        typeDocument: "Lot",
                        fillDataGrid: []
                    });
                }, 500);
                break;
        }
    };

    handleChangeCompany(e) {

        this.setState({ isLoading: true });

        if (this.state.typeDocument === "By Risk Owner") {
            let riskOwnerData = [{ month: 150, closed: 75, updated: 75 }, { month: 200, closed: 100, updated: 100 }, { month: 500, closed: 250, updated: 250 }];
            setTimeout(() => {
                this.setState({
                    selectedCompany: e,
                    fillDataGrid: riskOwnerData,
                    isLoading: false
                });
            }, 500);
        } else {
            let actionOwnerData = [{ month: 400, closed: 200, updated: 200 }, { month: 130, closed: 65, updated: 65 }, { month: 300, closed: 150, updated: 150 }];
            setTimeout(() => {
                this.setState({
                    selectedCompany: e,
                    fillDataGrid: actionOwnerData,
                    isLoading: false
                });
            }, 500);
        }
    }

    handleChangeDefault(e) {

        this.setState({ isLoading: true });

        switch (this.state.typeDocument) {
            case "By Discipline":
                let disciplineData = [{ month: 1000, closed: 500, updated: 500 }, { month: 800, closed: 400, updated: 400 }, { month: 700, closed: 350, updated: 350 }];
                setTimeout(() => {
                    this.setState({
                        selectedValue: e,
                        fillDataGrid: disciplineData,
                        isLoading: false
                    });
                }, 500);
                break;
            case "RBS Type":
                let rbsData = [{ month: 440, closed: 220, updated: 220 }, { month: 740, closed: 370, updated: 370 }, { month: 650, closed: 325, updated: 325 }];
                setTimeout(() => {
                    this.setState({
                        selectedValue: e,
                        fillDataGrid: rbsData,
                        isLoading: false
                    });
                }, 500);
                break;
            case "Phase":
                let phaseData = [{ month: 550, closed: 225, updated: 225 }, { month: 140, closed: 70, updated: 70 }, { month: 70, closed: 35, updated: 35 }];
                setTimeout(() => {
                    this.setState({
                        selectedValue: e,
                        fillDataGrid: phaseData,
                        isLoading: false
                    });
                }, 500);
                break;
            case "Stage":
                let stageData = [{ month: 800, closed: 400, updated: 400 }, { month: 8000, closed: 4000, updated: 4000 }, { month: 70, closed: 35, updated: 35 }];
                setTimeout(() => {
                    this.setState({
                        selectedValue: e,
                        fillDataGrid: stageData,
                        isLoading: false
                    });
                }, 500);
                break;
            case "G Contractor":
                let contractorData = [{ month: 1600, closed: 800, updated: 800 }, { month: 80, closed: 40, updated: 40 }, { month: 70, closed: 35, updated: 35 }];
                setTimeout(() => {
                    this.setState({
                        selectedValue: e,
                        fillDataGrid: contractorData,
                        isLoading: false
                    });
                }, 500);
                break;
            case "Structure":
                let structureData = [{ month: 3500, closed: 1750, updated: 1750 }, { month: 80, closed: 40, updated: 40 }, { month: 70, closed: 35, updated: 35 }];
                setTimeout(() => {
                    this.setState({
                        selectedValue: e,
                        fillDataGrid: structureData,
                        isLoading: false
                    });
                }, 500);
                break;
            case "Lot":
                let lotData = [{ month: 100, closed: 50, updated: 50 }, { month: 80, closed: 40, updated: 40 }, { month: 70, closed: 35, updated: 35 }];
                setTimeout(() => {
                    this.setState({
                        selectedValue: e,
                        fillDataGrid: lotData,
                        isLoading: false
                    });
                }, 500);
                break;
        }
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' gridKey="RiskReport" groups={[]} data={this.state.fillDataGrid || []} cells={this.columns}
                pageSize={this.state.fillDataGrid.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />
        ) : (<LoadingSection />);

        const btnExport = this.state.isLoading === false ? (
        //<Export rows={this.state.isLoading === false ? this.state.fillDataGrid : []} columns={this.columns} fileName={"Risk Report"} />
        <ExportDetails fieldsItems={this.columns}
        rows={this.state.fillDataGrid}
        fields={this.fields} fileName={'Risk Report'} />
): null;

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">
                        {Resources.riskReports[currentLanguage]}
                    </h2>
                    {btnExport}
                </header>
                <div className="proForm reports__proForm">
                    <div className="linebylineInput valid-input">
                        <Dropdown
                            title="type"
                            data={this.state.riskType}
                            handleChange={e=>{this.handleChange(e);this.fields[0].value = e.label} }
                            index="type"
                            name="type"
                            value={this.state.selectedType}
                            id="type" />
                    </div>

                    {this.state.defaultType ? <div className="linebylineInput valid-input">
                        <Dropdown
                            title={this.state.title}
                            data={this.state.listesTypeData}
                            handleChange={e=>{this.handleChangeDefault.bind(this);this.fields[1].value = e.label}}
                            index={this.state.selectedValue.label}
                            name={this.state.selectedValue.label}
                            value={this.state.selectedValue}
                            id={this.state.selectedValue.label} />
                    </div> : null}
                    {this.state.owner ? <div className="linebylineInput valid-input">
                        <Dropdown
                            title="company"
                            data={this.state.companies}
                            handleChange={e=>{this.handleChangeCompany.bind(this);this.fields[2].value = e.label}}
                            index="company"
                            name="company"
                            value={this.state.selectedCompany}
                            id="company" />
                    </div> : null}

                </div>
                <div className="doc-pre-cycle letterFullWidth">{dataGrid}</div>
            </div>
        );
    }
    
}

export default RiskReports;

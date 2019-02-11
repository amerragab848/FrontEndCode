import React, { Component } from "react";
import Api from "../../../api";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Export from "../../../Componants/OptionsPanels/Export";
import Filter from "../../FilterComponent/filterComponent";
import "../../../Styles/css/semantic.min.css";
import "../../../Styles/scss/en-us/layout.css";
import GridSetup from "../../../Pages/Communication/GridSetup";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import moment from "moment";
import Resources from "../../../resources.json";

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
const ProgressBarFormatter = ({ value }) => {
    return <button onClick={console.log("clicked"+value)}></button>;
  };
class Index extends Component {
    constructor(props) {
        super(props);
     
        var columnsGrid = [
            {
          //      formatter: ProgressBarFormatter ,
                key: "id1",
                name: Resources["id"][currentLanguage],
                width: "15%",
                show:false
            },
            {
                key: "id",
                name: Resources["id"][currentLanguage],
                width: "15%",
                locked: false,
            },
            {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "roleTitle",
                name: Resources["companyRole"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "disciplineTitle",
                name: Resources["disciplineTitle"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "keyContactName",
                name: Resources["KeyContact"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "location",
                name: Resources["location"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "contactsTel",
                name: Resources["Telephone"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "contactsMobile",
                name: Resources["Mobile"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "contactsFax",
                name: Resources["Fax"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "grade",
                name: Resources["Grade"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }
            ,
            {
                key: "enteredBy",
                name: Resources["enteredBy"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }
            ,
            {
                key: "lastModified",
                name: Resources["lastModified"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }
        ];

        this.state = {
            columns: columnsGrid,
            isLoading: true,
            rows: []
        };
    }

    componentDidMount() {

        Api.get("GetProjectCompaniesGrid?pageNumber=" + 0 + "&pageSize=" + 200).then(result => {
            this.setState({
                rows: result,
                isLoading: false
            });
        });

    }


    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns} showCheckbox={true} />
            ) : <LoadingSection />;
        return (
            <div className="mainContainer">

                <div>{dataGrid}</div>
            </div>
        );
    }
}

export default Index;

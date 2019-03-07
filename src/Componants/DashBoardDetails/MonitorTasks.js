import React, { Component, Fragment } from "react";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Api from "../../api";
import Resources from "../../resources.json";

import moment from "moment";
import GridSetup from "../../Pages/Communication/GridSetup";
import Export from "../../Componants/OptionsPanels/Export";

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const dateFormate = ({ value }) => {
  return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

export default class MonitorTasks extends Component {
  constructor(props) {
    super(props);

    const columnsGrid = [
      {
        key: "arrange",
        name: Resources["arrange"][currentLanguage],
        width: 100,
        draggable: true,
        sortable: true,
        resizable: true,
        sortDescendingFirst: true,
        formatter: dateFormate
      },
      {
        key: "subject",
        name: Resources["subject"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        sortDescendingFirst: true,
        formatter: dateFormate
      },
      {
        key: "projectName",
        name: Resources["projectName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        sortDescendingFirst: true,
        filterable: true
      },
      {
        key: "docDate",
        name: Resources["docDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        sortDescendingFirst: true,
        filterable: true,
        formatter: dateFormate
      },
      {
        key: "finishDate",
        name: Resources["finishDate"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        sortDescendingFirst: true,
        formatter: dateFormate
      },
      {
        key: "bicCompanyName",
        name: Resources["CompanyName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        sortDescendingFirst: true
      },
      {
        key: "bicContactName",
        name: Resources["ContactName"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        sortDescendingFirst: true
      },
      {
        key: "remaining",
        name: Resources["remaining"][currentLanguage],
        width: 150,
        draggable: true,
        sortable: true,
        resizable: true,
        sortDescendingFirst: true
      }
    ];

    this.state = {
      columns: columnsGrid,
      rows: [],
      totalRows: 0,
      renderGrid: false
    };
  }

  componentDidMount = () => {
    Api.get("GetMonitorTaskDetails").then(res => {
      this.setState({
        renderGrid: true,
        rows: res
      });
    });
  };

  render() {
    console.log(this.state.rows);
    const btnExport = (
      <Export
        rows={this.state.rows}
        columns={this.state.columns}
        fileName={Resources["monitorTasks"][currentLanguage]}
      />
    );

    return (
      <div className="mainContainer">
        <div className="resetPassword">
          <div className="submittalFilter">
            <div className="subFilter">
              <h3 className="zero">
                {" "}
                {Resources["monitorTasks"][currentLanguage]}
              </h3>
              <span>{this.state.rows.length}</span>
              <span>
                <svg
                  width="16px"
                  height="18px"
                  viewBox="0 0 16 18"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <g
                    id="Symbols"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                      transform="translate(-4.000000, -3.000000)"
                    />
                  </g>
                </svg>
              </span>
            </div>

            <div className="filterBTNS">{btnExport}</div>

            <div className="rowsPaginations">
              <div className="rowsPagiRange">
                <span>{this.state.rows.length}</span> of
                <span>{this.state.rows.length}</span>
              </div>
            </div>
          </div>

          <div>
            {this.state.renderGrid ? (
              <GridSetup
                rows={this.state.rows}
                columns={this.state.columns}
                showCheckbox={false}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

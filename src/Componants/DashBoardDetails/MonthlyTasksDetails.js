import React, { Component } from "react";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Api from "../../api";
import Resources from "../../resources.json";
import DatePicker from "../OptionsPanels/DatePicker";
import Dropdown from "../OptionsPanels/DropdownMelcous";
import moment from "moment";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";
import Export from "../OptionsPanels/Export";
import dataservice from "../../Dataservice";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import { withRouter } from "react-router-dom";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
 
class MonthlyTasksDetails extends Component {
  constructor(props) {
    super(props);
    const columnGrid = [
      {
        field: 'arrange',
        title: Resources['arrange'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: true,
        type: "number",
        sortable: true,
      },
      {
        field: 'subject',
        title: Resources['subject'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'projectName',
        title: Resources['projectName'][currentLanguage],
        width: 20,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'docDate',
        title: Resources['docDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true,
      },
      {
        field: 'finishDate',
        title: Resources['finishDate'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "date",
        sortable: true,
      },
      {
        field: 'bicCompanyName',
        title: Resources['CompanyName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'bicContactName',
        title: Resources['ContactName'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'remaining',
        title: Resources['remaining'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      }
    ];
    this.state = {
      startDate: moment(),
      finishDate: moment(),
      contactId: "",
      columns: columnGrid,
      isLoading: true,
      rows: [],
      btnisLoading: false,
      Loading: false,
      totalRows: 0,
      Contacts: [],
      ContactIsEmpty: true,
      valid: false
    };
  }

  ContacthandleChange = e => {
    this.setState({
      contactId: e.value,
      ContactIsEmpty: false,
      valid: false
    });
  };

  startDatehandleChange = date => {
    this.setState({ startDate: date });
  };

  finishDatehandleChange = date => {
    this.setState({ finishDate: date });
  };

  ViewReport = () => {

    this.setState({
      btnisLoading: true,
      isLoading: true
    });

    Api.post("GetMonthlyTaskDetailsByContactId", { startDate: this.state.startDate, finishDate: this.state.finishDate, contactId: this.state.contactId }).then(result => {
      this.setState({
        rows: result != null ? result : [],
        isLoading: false,
        btnisLoading: false,
        Loading: false,
        totalRows: result.length
      });
    });

  };

  componentDidMount = () => {

    this.props.actions.RouteToTemplate();

    Api.get("GetMonthlyTaskDetails").then(result => {
      this.setState({
        rows: result != null ? result : [], isLoading: false
      });
    });

    dataservice.GetDataList("GetAllContactsWithUser", "contactName", "id").then(result => {
      this.setState({
        Contacts: result || []
      })
    })
  };

  render() {
    
    const btnExport = (<Export rows={this.state.rows} columns={this.state.columns} fileName={Resources["monthlyTasks"][currentLanguage]} />);

    const gridCustom = this.state.isLoading ? <LoadingSection /> : (
      <GridCustom
        key="MonthlyTaskDetails"
        data={this.state.rows}
        pageSize={this.state.rows.length}
        groups={[]}
        actions={[]}
        rowActions={[]}
        cells={this.state.columns}
        rowClick={() => { }}
      />
    )
    return (
      <div className="mainContainer">
        <div className="resetPassword">
          <div className="submittalFilter readOnly__disabled">
            <div className="subFilter">
              <h3 className="zero">
                {Resources["monthlyTasks"][currentLanguage]}
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
            <div className="rowsPaginations readOnly__disabled">
              <div className="rowsPagiRange">
                <span>{this.state.rows.length}</span> of
                <span>{this.state.rows.length}</span>
              </div>
            </div>
          </div>
          <div className="gridfillter-container">
            <div className="fillter-status-container">
              <div className="form-group fillterinput fillter-item-c">
                <div>
                  <Dropdown
                    title="ContactName"
                    data={this.state.Contacts}
                    handleChange={this.ContacthandleChange}
                    placeholder="ContactName"
                  />
                </div>
              </div>

              <div className="form-group fillterinput fillter-item-c">
                <DatePicker
                  title="startDate"
                  startDate={this.state.startDate}
                  handleChange={this.startDatehandleChange}
                />
              </div>

              <div className="form-group fillterinput fillter-item-c">
                <DatePicker
                  title="finishDate"
                  startDate={this.state.finishDate}
                  handleChange={this.finishDatehandleChange}
                />
              </div>

              <div className="dropBtn">
                {this.state.btnisLoading === false ? (
                  <button className="primaryBtn-1 btn smallBtn" onClick={this.ViewReport} >
                    {Resources["View"][currentLanguage]}
                  </button>
                ) : (
                    <button className="primaryBtn-1 btn smallBtn">
                      <div className="spinner">
                        <div className="bounce1" />
                        <div className="bounce2" />
                        <div className="bounce3" />
                      </div>
                    </button>
                  )}
              </div>
            </div>
          </div>
          <div>
            {gridCustom}
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state, ownProps) {
  return {
    isLoading: state.communication.isLoading
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MonthlyTasksDetails));
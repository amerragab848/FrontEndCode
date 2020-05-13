import React, { Component } from "react";
import Api from "../../api";
import { withRouter } from "react-router-dom";
import LoadingSection from "../publicComponants/LoadingSection";
import Export from "../OptionsPanels/Export"; 
import Resources from "../../resources.json";
import * as actions from '../../store/actions/communication'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux'; 
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class TimeSheetDetails extends Component {
  constructor(props) {

    super(props);
 const columnGrid = [

      {
        field: 'requestCount',
        title: Resources['requestCount'][currentLanguage],
        width: 10,
        groupable: true,
        fixed: true,
        type: "number",
        sortable: true,
      },
      {
        field: 'requestFromUserName',
        title: Resources['fromContact'][currentLanguage],
        width: 15,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      },
      {
        field: 'companyName',
        title: Resources['fromCompany'][currentLanguage],
        width: 15,
        groupable: true,
        fixed: false,
        type: "text",
        sortable: true,
      }
    ];
 this.state = {
      pageTitle: Resources["timeSheet"][currentLanguage],
      viewfilter: false,
      columns: columnGrid,
      isLoading: true,
      rows: [],
      isCustom: true,
      apiFilter: "",
      viewModal: false
    };
  }
  componentWillMount() {
    Api.get("GetApprovalRequestsGroupByUserId?requestType=timeSheet").then(
      result => {
        this.setState({
          rows: result != null ? result : [],
          isLoading: false
        });
      }
    );
  }
  componentDidMount() {
    this.props.actions.RouteToTemplate();
  }
 isCustomHandlel() {
    this.setState({ isCustom: !this.state.isCustom });
  }
 RouteHandler(obj) {
    if (obj) {
      this.props.history.push({
        pathname: "/TimeSheetWorkFlow",
        search: "?id=" + obj.requestFromUserId
      });
    }
  }
  render() {
    const dataGrid =
      this.state.isLoading === false ? (
        <GridCustom
        ref='custom-data-grid'
        key="TimeSheetDetails"
        data={this.state.rows}
        pageSize={this.state.rows.length}
        groups={[]}
        actions={[]}
        rowActions={[]}
        cells={this.state.columns}
        rowClick={this.RouteHandler.bind(this)}
      />
        ) : <LoadingSection />;

    const btnExport = this.state.isLoading === false ?
      <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
      : <LoadingSection />;
  return (
      <div className="mainContainer">
        <div className="submittalFilter readOnly__disabled">
          <div className="subFilter">
            <h3 className="zero">{this.state.pageTitle}</h3>
            <span>{this.state.rows.length}</span>
          </div>
          <div className="filterBTNS">
            {btnExport}
          </div>
        </div>
        <div
          className="filterHidden"
          style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
          <div className="gridfillter-container">
          </div>
        </div>
        <div>{dataGrid}</div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch)
{
  return{
      actions:bindActionCreators(actions,dispatch)
  };
}
export default connect(null,mapDispatchToProps)(withRouter(TimeSheetDetails));



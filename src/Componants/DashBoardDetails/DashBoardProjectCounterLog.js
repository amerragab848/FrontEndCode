import React, { Component } from "react";
import LoadingSection from "../publicComponants/LoadingSection";
import Api from "../../api";
import Resources from "../../resources.json";
import moment from "moment";
import Export from "../OptionsPanels/Export";
import DashBoardDefenition from "./DashBoardProjectDefenition";
import Filter from "../FilterComponent/filterComponent";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardComponantActions from '../../store/actions/communication';
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const dateFormate = ({ value }) => {
  return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
class DashBoardProjectCounterLog extends Component {
  constructor(props) {

    super(props);

    const query = new URLSearchParams(this.props.location.search);

    let key = null;

    let documentInfo = {
      columns: [],
      filters: [],
      apiDetails: '',
      title: ''
    };

    for (let param of query.entries()) {
      key = param[1];
    }

    if (key) {
      documentInfo = DashBoardDefenition.find(i => i.key === key);
      if (documentInfo) {
        documentInfo.columns.map(item => {
          if (item.formatter) {
            item.formatter = dateFormate;
          }
        });
      }

      let projectId = this.props.projectId == 0 ? localStorage.getItem('lastSelectedProject') : this.props.projectId;

      this.state = {
        gridKey: documentInfo.key,
        columns: documentInfo.columns ? documentInfo.columns : [],
        rows: [],
        isLoading: true,
        filtersColumns: documentInfo.filters,
        viewfilter: false,
        apiDetails: documentInfo.apiDetails + projectId,
        pageTitle: documentInfo.title
      };
    }
  }
  componentWillMount = () => {

    let projectId = this.props.projectId == 0 ? localStorage.getItem('lastSelectedProject') : this.props.projectId;

    var e = { label: this.props.projectName, value: projectId };
    this.props.actions.RouteToDashboardProject(e);
  };
  componentDidMount() {
    if (this.state.apiDetails) {
      let spliteData = this.state.apiDetails.split("-");

      if (spliteData.length > 1) {
        let data = spliteData[1].split("&");
        let obj = {};

        obj.pageNumber = data[0].split("=")[1];
        obj.pageSize = data[1].split("=")[1];

        Api.post(spliteData[0], obj).then(result => {
          this.setState({
            rows: result != null ? result : [],
            isLoading: false
          });
        });
      } else {
        Api.get(this.state.apiDetails).then(result => {
          this.setState({
            rows: result != null ? result : [],
            isLoading: false
          });
        });
      }
    }
  }
  hideFilter(value) {
    this.setState({ viewfilter: !this.state.viewfilter });

    return this.state.viewfilter;
  }
  render() {
    const dataGrid =
      this.state.isLoading === false ? (
        <GridCustom
          ref='custom-data-grid'
          key={"DashBoardProjectCounterLog-" + this.state.gridKey}
          data={this.state.rows}
          pageSize={this.state.rows.length}
          groups={[]}
          actions={[]}
          rowActions={[]}
          cells={this.state.columns}
          rowClick={() => { }}
        />
      )
        : (<LoadingSection />);

    const btnExport = this.state.isLoading === false ? (<Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={Resources[this.state.pageTitle][currentLanguage]} />
    ) : (<LoadingSection />);

    const ComponantFilter = this.state.isLoading === false ? (<Filter filtersColumns={this.state.filtersColumns} apiFilter={this.state.apiFilter} filterMethod={this.filterMethodMain} />) : (
      <LoadingSection />
    );

    return (
      <div className="mainContainer">
        <div className="submittalFilter readOnly__disabled">
          <div className="subFilter">
            <h3 className="zero">
              {Resources[this.state.pageTitle][currentLanguage]}
            </h3>
            <span>{this.state.rows.length}</span>
          </div>
          <div className="filterBTNS">{btnExport}</div>
        </div>
        <div className="filterHidden" style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
          <div className="gridfillter-container">
          </div>
        </div>
        <div>{dataGrid}</div>
      </div>
    );
  }
}
function mapStateToProps(state, ownProps) {
  return {
    projectId: state.communication.projectId
  }
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(dashboardComponantActions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoardProjectCounterLog);
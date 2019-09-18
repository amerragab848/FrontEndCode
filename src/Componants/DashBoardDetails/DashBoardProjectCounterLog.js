import React, { Component } from "react";
import LoadingSection from "../publicComponants/LoadingSection";
import Api from "../../api";
import Resources from "../../resources.json";
import moment from "moment";
import GridSetup from "../../Pages/Communication/GridSetup";
import Export from "../OptionsPanels/Export";
import DashBoardDefenition from "./DashBoardProjectDefenition";
import Filter from "../FilterComponent/filterComponent";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardComponantActions from '../../store/actions/communication';

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
        <GridSetup rows={this.state.rows}
          columns={this.state.columns}
          showCheckbox={false} />
      )
        : (<LoadingSection />);

    const btnExport = this.state.isLoading === false ? (<Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={Resources[this.state.pageTitle][currentLanguage]} />
    ) : (<LoadingSection />);

    const ComponantFilter = this.state.isLoading === false ? (<Filter filtersColumns={this.state.filtersColumns} apiFilter={this.state.apiFilter} filterMethod={this.filterMethodMain} />) : (
      <LoadingSection />
    );

    return (
      <div className="mainContainer">
        <div className="submittalFilter">
          <div className="subFilter">
            <h3 className="zero">
              {Resources[this.state.pageTitle][currentLanguage]}
            </h3>
            <span>{this.state.rows.length}</span>
            <div className="ui labeled icon top right pointing dropdown fillter-button" tabIndex="0" onClick={() => this.hideFilter(this.state.viewfilter)} >
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
                    >
                      <g id="Group-4">
                        <g id="Group-7">
                          <g id="filter">
                            <rect
                              id="bg"
                              fill="#80CBC4"
                              opacity="0"
                              x="0"
                              y="0"
                              width="24"
                              height="24"
                            />
                            <path
                              d="M15.5116598,15.1012559 C14.1738351,15.1012559 13.0012477,14.2345362 12.586259,12.9819466 L4.97668038,12.9819466 C4.43781225,12.9819466 4,12.5415758 4,12 C4,11.4584242 4.43781225,11.0180534 4.97668038,11.0180534 L12.586259,11.0180534 C13.0012477,9.76546385 14.1738351,8.89874411 15.5116598,8.89874411 C16.8494845,8.89874411 18.0220719,9.76546385 18.4370606,11.0180534 L19.0233196,11.0180534 C19.5621878,11.0180534 20,11.4584242 20,12 C20,12.5415758 19.5621878,12.9819466 19.0233196,12.9819466 L18.4370606,12.9819466 C18.0220719,14.2345362 16.8494845,15.1012559 15.5116598,15.1012559 Z M15.5116598,10.8626374 C14.8886602,10.8626374 14.3813443,11.372918 14.3813443,12 C14.3813443,12.627082 14.8886602,13.1373626 15.5116598,13.1373626 C16.1346594,13.1373626 16.6419753,12.627082 16.6419753,12 C16.6419753,11.372918 16.1346594,10.8626374 15.5116598,10.8626374 Z M7.78600823,9.20251177 C6.44547873,9.20251177 5.27202225,8.33246659 4.8586039,7.07576209 C4.37264206,7.01672011 4,6.60191943 4,6.10125589 C4,5.60059914 4.37263163,5.1858019 4.85858244,5.12675203 C5.27168513,3.86979791 6.44573643,3 7.78600823,3 C9.1238329,3 10.2964204,3.86671974 10.711409,5.11930926 L19.0233196,5.11930926 C19.5621878,5.11930926 20,5.5596801 20,6.10125589 C20,6.64283167 19.5621878,7.08320251 19.0233196,7.08320251 L10.711409,7.08320251 C10.2964204,8.33579204 9.1238329,9.20251177 7.78600823,9.20251177 Z M7.78600823,4.96389325 C7.1630086,4.96389325 6.65569273,5.4741739 6.65569273,6.10125589 C6.65569273,6.72833787 7.1630086,7.23861852 7.78600823,7.23861852 C8.40900786,7.23861852 8.91632373,6.72833787 8.91632373,6.10125589 C8.91632373,5.4741739 8.40900786,4.96389325 7.78600823,4.96389325 Z M13.1695709,18.8806907 C12.7545822,20.1332803 11.5819948,21 10.2441701,21 C8.90634542,21 7.73375797,20.1332803 7.3187693,18.8806907 L4.97668038,18.8806907 C4.43781225,18.8806907 4,18.4403199 4,17.8987441 C4,17.3571683 4.43781225,16.9167975 4.97668038,16.9167975 L7.3187693,16.9167975 C7.73375797,15.664208 8.90634542,14.7974882 10.2441701,14.7974882 C11.5819948,14.7974882 12.7545822,15.664208 13.1695709,16.9167975 L19.0233196,16.9167975 C19.5621878,16.9167975 20,17.3571683 20,17.8987441 C20,18.4403199 19.5621878,18.8806907 19.0233196,18.8806907 L13.1695709,18.8806907 Z M10.2441701,16.7613815 C9.62117047,16.7613815 9.1138546,17.2716621 9.1138546,17.8987441 C9.1138546,18.5258261 9.62117047,19.0361068 10.2441701,19.0361068 C10.8671697,19.0361068 11.3744856,18.5258261 11.3744856,17.8987441 C11.3744856,17.2716621 10.8671697,16.7613815 10.2441701,16.7613815 Z"
                              id="Shape"
                              fill="#5E6475"
                              fillRule="nonzero"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </span>

              {this.state.viewfilter === false ? (
                <span className="text active">
                  <span className="show-fillter">
                    {Resources["showFillter"][currentLanguage]}
                  </span>
                  <span className="hide-fillter">
                    {Resources["hideFillter"][currentLanguage]}
                  </span>
                </span>
              ) : (
                  <span className="text">
                    <span className="show-fillter">
                      {Resources["showFillter"][currentLanguage]}
                    </span>
                    <span className="hide-fillter">
                      {Resources["hideFillter"][currentLanguage]}
                    </span>
                  </span>
                )}
            </div>
          </div>
          <div className="filterBTNS">{btnExport}</div>
        </div>
        <div className="filterHidden" style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
          <div className="gridfillter-container">{ComponantFilter}</div>
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
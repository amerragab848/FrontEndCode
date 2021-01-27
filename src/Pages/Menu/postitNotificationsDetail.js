import React, { Component } from "react";
import dataservice from "../../Dataservice";
import ReactTable from "react-table";
import Resources from "../../resources.json";
import moment from "moment";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Export from "../../Componants/OptionsPanels/Export";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let selectedRows = [];

class postitNotificationsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postitData: [],
      selected: {},
      showDeleteModal: false,
      SelectAll: false,
      isLoading: false
    };
  }

  componentDidMount() {
    dataservice.GetDataGrid("GetNotificationPostitDetail").then(result => {
      this.setState({
        postitData: result
      });
    });
    this.props.actions.RouteToTemplate();
  }

  toggleRow(obj) {

    const newSelected = Object.assign({}, this.state.selected);

    newSelected[obj.id] = !this.state.selected[obj.id];

    let setIndex = selectedRows.findIndex(x => x.id === obj.id);

    if (setIndex > -1) {
      selectedRows.splice(setIndex, 1);
    } else {
      selectedRows.push(obj);
    }

    this.setState({
      selected: newSelected
    });
  }

  handleSelectAll(postitData) {
    let newSelected = {}
    selectedRows = []
    let status = !this.state.SelectAll
    for (let i = 0; i < postitData.length; i++) {
      newSelected[postitData[i].id] = status
      if (status === true) {
        selectedRows.push(postitData[i]);
      }
    }
    this.setState({
      selected: newSelected,
      SelectAll: status
    });

  }

  DeletePostit() {
    this.setState({
      showDeleteModal: true
    });
  }

  clickHandlerContinueMain = () => {

    if (selectedRows.length > 0) {

      let listIds = selectedRows.map(rows => rows.id);

      dataservice.addObject("DeleteNotificationPostitMultiple", listIds).then(result => {

        let originalData = this.state.postitData;

        selectedRows.forEach(item => {
          let getIndex = originalData.findIndex(x => x.id === item.id);

          originalData.splice(getIndex, 1);
        });

        selectedRows = [];

        this.setState({
          postitData: originalData,
          showDeleteModal: false
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);

      }).catch(ex => {
        toast.error(Resources["operationSuccess"][currentLanguage]);
      });
    }
  };
  routeToView(docView, projectId, projectName, arrange, docId) {
    dataservice.GetDataGrid("GetAccountsProjectsByIdForList").then(result => {
      result.forEach(item => {
        if (item.projectId === projectId) {
          if (docView.includes("expensesUserAddEdit")) {
            this.props.history.push(docView);
          } else {
            let obj = {
              docId,
              projectId: projectId,
              projectName: projectName,
              arrange: arrange,
              docApprovalId: 0,
              isApproveMode: false
            };

            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

            this.props.history.push({
              pathname: "/" + docView.split("/")[0],
              search: "?id=" + encodedPaylod
            });
          }
        }
      });
    });
  }
  updateStatus(obj) {
    this.setState({
      isLoading: true
    });
    dataservice.addObject(`UpdateStatusPostit?id=${obj.id}`, null).then(result => {
      this.routeToView(obj.docLink, obj.projectId, obj.projectName, obj.arrange, obj.docId);
    });
  };

  handleUpdateAllStatus(Rows) {
    Rows.forEach(obj => {
      if (obj.viewStatus != true) {
        dataservice.addObject(`UpdateStatusPostit?id=${obj.id}`, null).then(result => { })
      }
    });
    selectedRows = []
    toast.success("operation done successfully")
    setTimeout(() => {
      dataservice.GetDataGrid("GetNotificationPostitDetail").then(result => {
        this.setState({
          postitData: result,
          selected: {}
        });
      });
    }, 200)
  }

  render() {
    const filterCaseInsensitive = ({ id, value }, row) =>
      row[id] ? row[id].toLowerCase().includes(value.toLowerCase()) : true
    const columns = [
      {
        Header: Resources["checkList"][currentLanguage],
        id: "id",
        accessor: "id",
        Cell: ({ row }) => {
          return (
            <div className="ui checked checkbox  checkBoxGray300 ">
              <input type="checkbox" className="checkbox" checked={this.state.selected[row._original.id] === true}
                onChange={() => this.toggleRow(row._original)} />
              <label />
            </div>
          );
        },
        width: 50
      },
      {
        Header: Resources["status"][currentLanguage],
        id: "readUnread",
        accessor: "readUnread",
        Cell: ({ row }) => {
          if (row._original.viewStatus === false || row._original.viewStatus === null) {
            return (
              <div onClick={() => this.updateStatus(row._original)} style={{ cursor: "pointer", padding: "4px 8px", margin: "4px auto", borderRadius: "100px", backgroundColor: "#E74C3C", width: "auto", color: "#FFF", minWidth: ' 61px', height: '24px', fontFamily: 'Muli', fontSize: '11px', fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: '1.45', letterSpacing: '-0.2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Resources["unRead"][currentLanguage]}
              </div>
            );
          } else {
            return (
              <div style={{ margin: "4px auto", padding: "4px 8px", borderRadius: '100px', backgroundColor: "#e9ecf0", width: "auto", minWidth: ' 43px', height: '24px', fontFamily: 'Muli', fontSize: '11px', fontWeight: 'bold', fontStyle: 'normal', fontStretch: 'normal', lineHeight: '1.45', letterSpacing: '-0.2px', color: '#858d9e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Resources["read"][currentLanguage]}
              </div>
            );
          }
        },
        width: 150
      },
      {
        Header: Resources["title"][currentLanguage],
        accessor: "title",
        sortabel: true,
        width: 400
      },
      {
        Header: Resources["fromContact"][currentLanguage],
        accessor: "fromContactName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["status"][currentLanguage],
        accessor: "statusName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["sentDate"][currentLanguage],
        accessor: "sentDate",
        width: 200,
        sortabel: true,
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
      },
      {
        Header: Resources["sendMethod"][currentLanguage],
        accessor: "sendMethod",
        width: 200,
        sortabel: true
      },
    ];
    const ExportColumns = [
      { field: "readUnread", title: "Read" },
      { field: "title", title: "title" },
      { field: "statusName", title: "Status" },
      { field: "fromContactName", title: "from Contact Name" },
      { field: "sentDate", title: "sent Date" },
      { field: "sendMethod", title: "send Method" },
    ]
    const btnExport =
      <Export rows={this.state.postitData} columns={ExportColumns} fileName={Resources["notification"][currentLanguage]} />;
    return (
      <div>
        <div className="mainContainer main__withouttabs">
          <div class="submittalFilter">
            <div class="subFilter">
              <h3 class="zero">{Resources["notification"][currentLanguage]}</h3>
            </div>

            <div className="filterBTNS">
              {btnExport}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            {selectedRows.length > 0 ? (
              <div className={"gridSystemSelected " + (selectedRows.length > 0 ? " active" : "")} style={{ top: '0px' }}>
                <div className="tableselcted-items">
                  <span>
                    <div className="ui checked checkbox  checkBoxGray300 ">
                      <input type="checkbox" className="checkbox" checked={this.state.SelectAll}
                        onChange={() => this.handleSelectAll(this.state.postitData)} />
                      <label />
                    </div>
                  </span>
                  <span id="count-checked-checkboxes">{selectedRows.length}</span>
                  <span> Selected</span>
                </div>
                <div className="tableSelctedBTNs">
                  <button className="defaultBtn btn smallBtn" onClick={() => this.handleUpdateAllStatus(selectedRows)}>
                    {Resources["update"][currentLanguage]}
                  </button>
                </div>
              </div>) :
              null}
            {this.state.isLoading == true ? <LoadingSection /> : null}
            <ReactTable
              getTrProps={(state, rowInfo) => {
                if (rowInfo && rowInfo.row) {
                  return {
                    onClick: (e) => {
                      this.updateStatus(rowInfo.row._original);
                    },
                    style: {
                      background: rowInfo.index === this.state.selected ? '#00afec' : 'white',
                      color: rowInfo.index === this.state.selected ? 'white' : 'black'
                    }
                  }
                } else {
                  return {}
                }
              }}
              filterable
              data={this.state.postitData}
              columns={columns}
              defaultPageSize={10}
              noDataText={Resources["noData"][currentLanguage]}
              className="-striped -highlight"
              defaultFilterMethod={filterCaseInsensitive}
            />
          </div>
        </div>
        {this.state.showDeleteModal == true ? (
          <ConfirmationModal title={Resources["smartDeleteMessageContent"][currentLanguage]} buttonName="delete" closed={this.onCloseModal}
            showDeleteModal={this.state.showDeleteModal} clickHandlerCancel={this.clickHandlerCancelMain}
            clickHandlerContinue={this.clickHandlerContinueMain.bind(this)} />) : null}
      </div>
    );
  }
}
function mapStateToProps(state, ownProps) {
  return {
    showLeftMenu: state.communication.showLeftMenu
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(postitNotificationsDetail);

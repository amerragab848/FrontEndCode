import React, { Component, Fragment } from "react";
import moment from "moment";
import Resources from "../../resources.json";
import _ from "lodash";
import dataservice from "../../Dataservice";
import SkyLight from "react-skylight";
import { withRouter } from "react-router-dom";
import SubPurchaseOrders from "./subPurchaseOrders";
import ReactTable from "react-table";
import "react-table/react-table.css";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import "react-table/react-table.css";
import { toast } from "react-toastify";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const dateFormate = ({ value }) => {
  return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

class subPurchaseOrderLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      isLoading: true,
      contractId: this.props.contractId,
      isViewMode: this.props.isViewMode,
      projectId: this.props.projectId,
      showSubPurchaseOrders: false,
      purchaseOrderData: []
    };
  }
  componentWillMount() {
    dataservice
      .GetDataGrid("GetSubPOsByContractId?contractId=" + this.state.contractId)
      .then(data => {
        this.setState({
          purchaseOrderData: data
        });
      })
      .catch(ex => {
        this.setState({ purchaseOrderData: [] });
        toast.error(Resources["failError"][currentLanguage]);
      });
  }

  viewSubPurchaseOrder = () => {
    this.setState({ showSubPurchaseOrders: true });

    this.simpleDialog.show();
  };

  render() {
    const columns = [
      {
        Header: Resources["numberAbb"][currentLanguage],
        accessor: "arrange",
        sortabel: true,
        width: 80
      },
      {
        Header: Resources["subject"][currentLanguage],
        accessor: "subject",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["CompanyName"][currentLanguage],
        accessor: "companyName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["contractTo"][currentLanguage],
        accessor: "toCompanyName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["attention"][currentLanguage],
        accessor: "toContactName",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["docDate"][currentLanguage],
        accessor: "docDate",
        width: 200,
        sortabel: true,
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
      },
      {
        Header: Resources["completionDate"][currentLanguage],
        accessor: "completionDate",
        width: 200,
        sortabel: true,
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
      },
      {
        Header: Resources["actualExecuted"][currentLanguage],
        accessor: "actualExceuted",
        width: 200,
        sortabel: true
      },
      {
        Header: Resources["docClosedate"][currentLanguage],
        accessor: "docCloseDate",
        width: 200,
        sortabel: true,
        Cell: row => (
          <span>
            <span>{moment(row.value).format("DD/MM/YYYY")}</span>
          </span>
        )
      }
    ];

    return (
      <Fragment>
        <header className="main__header">
          <h2 className="zero">{Resources["subPOsList"][currentLanguage]}</h2>
          <button
            className={
              "primaryBtn-1 btn " +
              (this.props.isViewMode === true ? "disNone" : "")
            }
            onClick={this.viewSubPurchaseOrder}
          >
            <i className="fa fa-file-text" />
          </button>
        </header>
        <ReactTable
          data={this.state.purchaseOrderData}
          columns={columns}
          defaultPageSize={5}
          noDataText={Resources["noData"][currentLanguage]}
          className="-striped -highlight"
        />

        <div
          className="largePopup largeModal "
          style={{
            display: this.state.showSubPurchaseOrders ? "block" : "none"
          }}
        >
          <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialog = ref)}>
            <Fragment>
              <SubPurchaseOrders
                contractId={this.state.contractId}
                projectId={this.state.projectId}
                isViewMode={this.state.isViewMode}
              />
            </Fragment>
          </SkyLight>
        </div>
      </Fragment>
    );
  }
}
export default withRouter(subPurchaseOrderLog);

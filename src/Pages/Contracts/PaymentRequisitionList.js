import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Resources from "../../resources.json";
import ReactTable from "react-table";
import moment from "moment";
import dataservice from "../../Dataservice";
import Config from "../../Services/Config.js";
import CryptoJS from "crypto-js";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');


class PaymentRequisitionList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            paymentRequistionList: [],
            contractId:this.props.contractId
           // contractId: 5667
        }
    }

    componentWillMount = () => {
        dataservice.GetDataGrid('GetRequestPaymentsByContractId?contractId=' + this.state.contractId + '').then(
            res => {
                this.setState({
                    paymentRequistionList: res
                })
            }
        )
    }

    GoEdit = (obj) => {
        let objRout = {
            docId: obj._original.id,
            projectId: obj._original.projectId,
            projectName: localStorage.getItem("lastSelectedprojectName"),
            arrange: 0,
            docApprovalId: 0,
            isApproveMode: false
          }
        let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
        let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
        this.props.history.push({
          pathname: "/" + 'requestPaymentsAddEdit',
          search: "?id=" + encodedPaylod
        });
    }

    render() {
       
        let columns = [
            {
                Header: Resources["action"][currentLanguage],
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.GoEdit(row)}>
                            <i style={{ fontSize: "1.6em" }} className="fa fa-pencil-square-o" />
                        </div>
                    );
                },
                width: 70
            },
            {
                Header: Resources['arrange'][currentLanguage],
                accessor: 'arrange',
                width: 100,
            }, {
                Header: Resources['subject'][currentLanguage],
                accessor: 'subject',
                width: 350,
            }, {
                Header: Resources["docDate"][currentLanguage],
                accessor: "docDate",
                width: 180,
                sortabel: true,
                Cell: row => (
                    <span>
                        <span>{moment(row.value).format("DD/MM/YYYY")}</span>
                    </span>
                )
            }, {
                Header: Resources['totalEarned'][currentLanguage],
                accessor: 'totalEarned',
                width: 150,
            }, {
                Header: Resources['currentPaymentDue'][currentLanguage],
                accessor: 'currentPaymentDue',
                width: 250,
            }, {
                Header: Resources['balanceToFinish'][currentLanguage],
                accessor: 'balanceToFinish',
                width: 150,
            }
        ]

        return (
            <div>
                <div className="doc-pre-cycle">
                    <header>
                        <h2 className="zero">{Resources['paymentRequistionList'][currentLanguage]}</h2>
                    </header>
                    <ReactTable
                        ref={(r) => {
                            this.selectTable = r;
                        }}
                        data={this.state.paymentRequistionList}
                        columns={columns}
                        defaultPageSize={10}
                        minRows={2}
                        noDataText={Resources['noData'][currentLanguage]}
                    />
                </div>
            </div>
        )
    }
}
export default withRouter(PaymentRequisitionList)


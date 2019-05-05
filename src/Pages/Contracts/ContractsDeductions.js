import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Resources from "../../resources.json";
import ReactTable from "react-table";
import moment from "moment";
import dataservice from "../../Dataservice";
import Config from "../../Services/Config.js";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');


class ContractsDeductions extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ContractsDeductionsList: [],
            contractId:this.props.contractId
           // contractId: 433
        }
    }

    componentWillMount = () => {
        dataservice.GetDataGrid('GetContractsDeductionsList?contractId=' + this.state.contractId + '').then(
            res => {
                this.setState({
                    ContractsDeductionsList: res
                })
            }
        )
    }

    render() {

        let columns = [
            {
                Header: Resources['description'][currentLanguage],
                accessor: 'title',
                width: 500,
            }, {
                Header: Resources['deductions'][currentLanguage],
                accessor: 'deductionValue',
                width: 500,
            }
        ]

        return (
            <div className="mainContainer">
                <div className="doc-pre-cycle">
                    <header>
                        <h2 className="zero">{Resources['contractsDeductions'][currentLanguage]}</h2>
                    </header>
                    <ReactTable
                        ref={(r) => {
                            this.selectTable = r;
                        }}
                        data={this.state.ContractsDeductionsList}
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
export default withRouter(ContractsDeductions)


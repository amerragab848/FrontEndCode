import React, { Component } from 'react';
import Api from '../../api'
import moment from 'moment'
import Resources from '../../resources.json';
import _ from "lodash";
import { withRouter } from "react-router-dom";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import 'react-table/react-table.css'
import GridSetupWithFilter from "../Communication/GridSetupWithFilter";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
  };
  
class ContractInfo extends Component {
    constructor(props) {
        super(props)
        this.itemsColumns = [
            {
                key: "arrange",
                name: Resources["arrange"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "toCompanyName",
                name: Resources["contractTo"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "toContactName",
                name: Resources["ToContact"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter:dateFormate
            }, {
                key: "completionDate",
                name: Resources["completionDate"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter:dateFormate
            }, {
                key: "actualExceuted",
                name: Resources["actualExecuted"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "docCloseDate",
                name: Resources["closeDate"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter:dateFormate
            }
        ];
        this.state = {
            rows: [],
            isLoading: true,
            contractId: 5667
        }
    }
    componentWillMount() {
        Api.get('GetSubContractsByContractId?contractId=' + this.state.contractId).then(result => {
            this.setState({ isLoading: false, rows: result })
        }).catch(() => {
            this.setState({ isLoading: false, rows: [] })
        })
    }
    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridSetupWithFilter
                rows={this.state.rows}
                showCheckbox={false}
                columns={this.itemsColumns}
                key='items'
            />) : <LoadingSection />;
        return (
            <div className="doc-pre-cycle">
            <header>
                <h2 className="zero">{Resources.subContractsList[currentLanguage]}</h2>
            </header>
            {dataGrid}
        </div>
             )
    }
}
export default withRouter(ContractInfo)
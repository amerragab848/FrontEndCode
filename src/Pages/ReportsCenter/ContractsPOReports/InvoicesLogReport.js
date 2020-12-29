import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export"; 
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";

import moment from "moment";
import Dataservice from '../../../Dataservice';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}

class InvoicesLogReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            ProjectsData: [],
            selectedProject: { label: Resources.projectSelection[currentLanguage], value: "0" },
            rows: [],
            pageSize: 200,
        }

        if (!Config.IsAllow(194)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                field: "projectCode",
                title: Resources["projectCode"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: "subject",
                title: Resources["subject"][currentLanguage],
                width: 25,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "docDate",
                title: Resources["docDate"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: "docCloseDate",
                title: Resources["docClosedate"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            },
            {
                field: "total",
                title: Resources["total"][currentLanguage],
                width: 50,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "balance",
                title: Resources["balanceToFinish"][currentLanguage],
                width: 14,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "comment",
                title: Resources["comment"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "lastEditBy",
                title: Resources["lastEdit"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
        ];

    }

    componentWillMount() {
        this.setState({ isLoading: true })
        Dataservice.GetDataGrid('GetContractsInvoicesForPo').then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        ).catch(() => {
            this.setState({ isLoading: false })
        })
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                gridKey="InvoicesLogReport"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'invoicesReport'} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.invoicesReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}
export default withRouter(InvoicesLogReport)

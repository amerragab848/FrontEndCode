import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";

// import moment from "moment";
// import HeaderDocument from '../../../Componants/OptionsPanels/HeaderDocument'
import Api from '../../../api';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

class projectInvoicesCollected extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            rows: [],
            pageSize: 200,
        }
        if (!Config.IsAllow(3681)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.columns = [
            {
                field: "projectName",
                title: Resources["projectName"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            }, {
                field: "invoiced",
                title: Resources["total"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "collected",
                title: Resources["collected"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "collectedPercentage",
                title: Resources["progressPercent"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "remainingAmount",
                title: Resources["totalRemaining"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
        ];
    }

    componentWillMount = () => {
        this.setState({ isLoading: true })
        Api.get('GetProjectsInvoicedCollectedAndInvoiced').then(res => {
            this.setState({ rows: res, isLoading: false })
        }).catch(() => { this.setState({ isLoading: false }) })
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                key="projectInvoicesColleced"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'projectedInvoicedCollecetd'} />
            : null

        return (
            <div className="reports__content reports__multiDrop">
                <header>
                    <h2 className="zero">{Resources.projectedInvoicedCollecetd[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        )
    }

}
export default withRouter(projectInvoicesCollected)

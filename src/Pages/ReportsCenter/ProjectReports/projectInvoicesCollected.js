import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import moment from "moment";
import Api from '../../../api';
import HeaderDocument from '../../../Componants/OptionsPanels/HeaderDocument'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')





class projectInvoicesCollected extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            rows: []
        }

        if (!Config.IsAllow(3681)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "invoiced",
                name: Resources["total"][currentLanguage],
                width: 160,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "collected",
                name: Resources["collected"][currentLanguage],
                width: 160,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "collectedPercentage",
                name: Resources["progressPercent"][currentLanguage],
                width: 160,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "remainingAmount",
                name: Resources["totalRemaining"][currentLanguage],
                width: 160,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
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
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'projectedInvoicedCollecetd'} />
            : null

        return (

            <div className='mainContainer main__fulldash'>
                <div className="documents-stepper noTabs__document">
                    <HeaderDocument projectName={''} docTitle={Resources.projectedInvoicedCollecetd[currentLanguage]} moduleTitle={Resources['projectReports'][currentLanguage]} />
                    <div className='doc-container'>
                        <div className='step-content'>
                            <div className="document-fields">
                                <div className=" fullWidthWrapper textRight">
                                    {btnExport}
                                </div>
                            </div>
                            <div className="doc-pre-cycle letterFullWidth">
                                {dataGrid}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
export default withRouter(projectInvoicesCollected)

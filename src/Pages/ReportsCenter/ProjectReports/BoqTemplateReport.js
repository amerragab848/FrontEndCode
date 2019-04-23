import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
import moment from "moment";
import Dataservice from '../../../Dataservice';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}

class BoqTemplateReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            rows: []
        }
        if (!Config.IsAllow(3690)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.columns = [
            {
                key: "arrange",
                name: Resources["numberAbb"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "textStatus",
                name: Resources["status"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "docCloseDate",
                name: Resources["docClosedate"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 160,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "disciplineName",
                name: Resources["disciplineName"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "openedBy",
                name: Resources["openedBy"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "closedBy",
                name: Resources["closedBy"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "lastEditBy",
                name: Resources["lastEdit"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "lastEditDate",
                name: Resources["lastEditDate"][currentLanguage],
                width: 160,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "lastSendTime",
                name: Resources["lastSendTime"][currentLanguage],
                width: 160,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "lastSendDate",
                name: Resources["lastSendDate"][currentLanguage],
                width: 160,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "lastApproveTime",
                name: Resources["lastApprovedTime"][currentLanguage],
                width: 160,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "lastApproveDate",
                name: Resources["lastApproveDate"][currentLanguage],
                width: 160,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }
        ];
    }


    componentWillMount() {
        this.setState({ isLoading: true })
        Dataservice.GetDataGrid('GetBoqIsTemplate?pageNumber=0&pageSize=200').then(
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
            <GridSetup rows={this.state.rows} showCheckbox={false}
                columns={this.columns} onRowClick={this.OnRowClick} />) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'boqTemplateReport'} />
            : null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.boqTemplateReport[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className="proForm reports__proForm">
                    <div className=" fullWidthWrapper textRight">
                        {btnExport}
                    </div>
                </div>
                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
       )
    }

}
export default withRouter(BoqTemplateReport)

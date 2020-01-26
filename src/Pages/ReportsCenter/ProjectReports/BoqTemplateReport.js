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

class BoqTemplateReport extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            rows: [],
            pageSize: 200,
        }
        if (!Config.IsAllow(3690)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }
        this.columns = [
            {
                field: "arrange",
                title: Resources["numberAbb"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            }, {
                field: "textStatus",
                title: Resources["status"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
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
                field: "projectName",
                title: Resources["projectName"][currentLanguage],
                width: 23,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "companyName",
                title: Resources["CompanyName"][currentLanguage],
                width: 25,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "docCloseDate",
                title: Resources["docClosedate"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: "docDate",
                title: Resources["docDate"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            },
            {
                field: "disciplineName",
                title: Resources["disciplineName"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "openedBy",
                title: Resources["openedBy"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "closedBy",
                title: Resources["closedBy"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "lastEditBy",
                title: Resources["lastEdit"][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: "lastEditDate",
                title: Resources["lastEditDate"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: "lastSendTime",
                title: Resources["lastSendTime"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "lastSendDate",
                title: Resources["lastSendDate"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            },
            {
                field: "lastApproveTime",
                title: Resources["lastApprovedTime"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: "lastApproveDate",
                title: Resources["lastApproveDate"][currentLanguage],
                width: 16,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
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
            <GridCustom
                ref='custom-data-grid'
                key="BoqTemplateReport"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={[]}
                rowActions={[]}
                cells={this.columns}
                rowClick={() => { }}
            />) : <LoadingSection />

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

import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from 'react-customized-grid';
import Api from '../../../api';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang')

class ExpnesesUserRequests extends Component {

    constructor(props) {

        super(props)

        this.state = {
            isLoading: false,
            rows: []
        }

        if (!Config.IsAllow(3719)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            })
        }

        this.columns = [
            {
                "field": "requestFromUserName",
                "title": Resources.UserName[currentLanguage],
                "type": "text",
                "width": 15,
                "fixed": true,
                "groupable": true,
                "sortable": true
            }, {
                "field": "companyName",
                "title": Resources.CompanyName[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "supervisorName",
                "title": Resources.Supervisor[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }, {
                "field": "requestCount",
                "title": Resources.requestCount[currentLanguage],
                "type": "text",
                "width": 15,
                "groupable": true,
                "sortable": true
            }
        ];
    }

    componentWillMount = () => {
        this.setState({ isLoading: true })
        Api.get('GetProjectProjectsExpensesApprovalRequest?pageNumber=0&pageSize=200').then(res => {
            this.setState({ rows: res, isLoading: false })
        }).catch(() => { this.setState({ isLoading: false }) })
    }

    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom ref='custom-data-grid' groups={[]} data={this.state.rows || []} cells={this.columns}
                pageSize={this.state.rows.length} actions={[]} rowActions={[]} rowClick={() => { }}
            />
        ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.columns} fileName={'expnesesUserRequests'} />
            : null

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.expnesesUserRequests[currentLanguage]}</h2>
                    {btnExport}
                </header>
                <div className='proForm reports__proForm'>
                    <div className="doc-pre-cycle letterFullWidth">
                        {dataGrid}
                    </div>
                </div>
            </div>
        )
    }

}
export default withRouter(ExpnesesUserRequests)

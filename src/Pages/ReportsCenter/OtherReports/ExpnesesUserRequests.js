import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Export from "../../../Componants/OptionsPanels/Export";
import GridSetup from "../../Communication/GridSetup"
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
                key: "requestFromUserName",
                name: Resources["UserName"][currentLanguage],
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
                sortDescendingFirst: true,
            }, {
                key: "supervisorName",
                name: Resources["Supervisor"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }, {
                key: "requestCount",
                name: Resources["requestCount"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
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
            <GridSetup rows={this.state.rows} showCheckbox={false}
                pageSize={this.state.pageSize} columns={this.columns} />) : <LoadingSection />

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

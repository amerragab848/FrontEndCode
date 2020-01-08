import React, { Component, Fragment } from 'react';
import Api from '../../api'
import moment from 'moment'
import Resources from '../../resources.json';
//import _ from "lodash";
import { withRouter } from "react-router-dom";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import 'react-table/react-table.css'
import GridSetupWithFilter from "../Communication/GridSetupWithFilter";
import SubContract from '../Contracts/SubContract';
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

class SubContractLog extends Component {

    constructor(props) {
        super(props)

        this.actions = [];

        this.rowActions = [];

        this.itemsColumns = [
            { title: '', type: 'check-box', fixed: true, field: 'id' },
            {
                field: "arrange",
                title: Resources["arrange"][currentLanguage],
                width: 5,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text"
            },
            {
                field: "subject",
                title: Resources["subject"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "companyName",
                title: Resources["CompanyName"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "toCompanyName",
                title: Resources["contractTo"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "toContactName",
                title: Resources["ToContact"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "docDate",
                title: Resources["docDate"][currentLanguage],
                width: 8,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "date"
            },
            {
                field: "completionDate",
                title: Resources["completionDate"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "date"
            },
            {
                field: "actualExceuted",
                title: Resources["actualExceuted"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "date"
            },
            {
                field: "docCloseDate",
                title: Resources["closeDate"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "date"
            },
        ]

        this.state = {
            ApiGet: this.props.ApiGet,
            rows: [],
            isLoading: true,
            docId: this.props.docId,
            viewModel: false,
            projectId: this.props.projectId,
            isViewMode: this.props.isViewMode
        }
    }

    componentWillMount() {
        Api.get(this.state.ApiGet).then(result => {
            this.setState({ isLoading: false, rows: result })
        }).catch(() => {
            this.setState({ isLoading: false, rows: [] })
        });
    }

    viewSubContract = () => {
        this.setState({ viewModel: true });
    }

    FillTable = () => {

        Api.get(this.state.ApiGet).then(result => {
            this.setState({
                isLoading: false,
                rows: result,
                viewModel: false
            })
        }).catch(() => {
            this.setState({ isLoading: false, rows: [] })
        });
    }

    render() {
        const dataGrid = this.state.isLoading === false ?
            (<GridCustom
                cells={this.itemsColumns} data={this.state.rows} groups={[]} pageSize={50} actions={this.actions}
                rowActions={this.rowActions} rowClick={() => { }}
            />
            ) : <LoadingSection />;
        return (
            <Fragment>
                {this.state.viewModel === false ?
                    <div className="doc-pre-cycle">
                        <header className="doc-pre-btn">
                            <h2 className="zero">{Resources.subContractsList[currentLanguage]}</h2>
                            <button className={"primaryBtn-1 btn " + (this.state.isViewMode === true ? 'disNone' : '')} disabled={this.state.isViewMode} onClick={this.viewSubContract}><i className="fa fa-file-text"></i></button>
                        </header>
                        {dataGrid}
                    </div>
                    :
                    <SubContract projectId={this.state.projectId} type={this.props.type} items={this.props.items} docId={this.state.docId} FillTable={this.FillTable} />
                }
            </Fragment>
        )
    }
}
export default withRouter(SubContractLog)
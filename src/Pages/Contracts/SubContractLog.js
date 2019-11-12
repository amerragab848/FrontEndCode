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
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

class SubContractLog extends Component {

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
                sortDescendingFirst: true,
                type: "number"
            }, {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                type: "string"
            }, {
                key: "companyName",
                name: Resources["CompanyName"][currentLanguage],
                width: 120,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                type: "string"
            }, {
                key: "toCompanyName",
                name: Resources["contractTo"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                type: "string"
            }, {
                key: "toContactName",
                name: Resources["ToContact"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                type: "string"
            }, {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate,
                type: "date"
            }, {
                key: "completionDate",
                name: Resources["completionDate"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate,
                type: "date"
            }, {
                key: "actualExceuted",
                name: Resources["actualExecuted"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                type: "number"
            }, {
                key: "docCloseDate",
                name: Resources["closeDate"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate,
                type: "date"
            }
        ];

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
            (<GridSetupWithFilter rows={this.state.rows} showCheckbox={false} columns={this.itemsColumns} key='items' />) : <LoadingSection />;
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
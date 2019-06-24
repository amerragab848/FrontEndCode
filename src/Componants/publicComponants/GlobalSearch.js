import React, { Component } from 'react'
import GridSetupWithFilter from "../../Pages/Communication/GridSetupWithFilter";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Api from '../../api';
import Resources from "../../resources.json"
import LoadingSection from '../publicComponants/LoadingSection'
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let subject = "test"
class GlobalSearch extends Component {
    constructor(props) {
        super(props)
        //     const query = new URLSearchParams(this.props.location.search);
        //     let index = 0;
        //     for (let param of query.entries()) {
        //         if (index == 0) {
        //             try {
        //                 let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));
        //                 subject = obj.subject; 
        //             }
        //             catch{
        //                 this.props.history.goBack();
        //             }
        //         }
        //         index++;
        //     }
        this.state = {
            subject: subject,
            searchResult: []
        }
        this.searchColumns = [
            {
                key: "arrange",
                name: Resources["no"][currentLanguage],
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
                key: "status",
                name: Resources["status"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: false,
                sortDescendingFirst: true
            }, {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "docType",
                name: Resources["docType"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 100,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }
        ];


    }
    componentWillMount() {
        let searchOptions = {
            // subject: this.state.subject,
            // fromDate: moment().add(-15, 'Y').format('YYYY/MM/DD'),
            // toDate: moment().format('YYYY/MM/DD'),
            // docs: [],
            // status: null,
            // pageNumber:0
        }
        Api.post("GetDataForSearchInApp", searchOptions).then(searchResult => {
            if (searchResult)
                this.setState({ searchResult })
        })
    }

    render() {
        const searchGrid = this.state.isLoading === false ? (
            <GridSetupWithFilter
                rows={this.state.searchResult}
                showCheckbox={false}
                pageSize={this.state.pageSize}
                columns={this.searchColumns}
                key='searchGrid'
            />) : <LoadingSection />;

        return (
            <div className="doc-pre-cycle">
                <header className="doc-pre-btn">
                    <h2 className="zero">{Resources.subContractsList[currentLanguage]}</h2>
                    <button className={"primaryBtn-1 btn " + (this.state.isViewMode === true ? 'disNone' : '')} disabled={this.state.isViewMode} onClick={this.viewSubContract}><i className="fa fa-file-text"></i></button>
                </header>
                {/* {dataGrid} */}
            </div>
        );
    }
}
export default withRouter(GlobalSearch);
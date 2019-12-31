import React, { Component } from 'react'
import LoadingSection from "../publicComponants/LoadingSection";
import Api from '../../api'
import Resources from '../../resources.json';
import Filter from "../../Componants/FilterComponent/filterComponent";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import moment from 'moment';
import { withRouter } from "react-router-dom";
import GridSetup from "../../Pages/Communication/GridSetup";
import Export from "../OptionsPanels/Export";
import dataservice from "../../Dataservice";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};


class PettyCash extends Component {
    constructor(props) {
        super(props)

        const columnsGrid = [
            {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 350,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
            },
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 350,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
                filterable: true,
            },
            {
                key: "date",
                name: Resources["docDate"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate

            },
            {
                key: "amount",
                name: Resources["amount"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            },
            {
                key: "remaining",
                name: Resources["remaining"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            },
            {
                key: "statusName",
                name: Resources["statusName"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            },
            {
                key: "contactName",
                name: Resources["ContactName"][currentLanguage],
                width: 350,
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
            }
        ];

        this.state = {
            startDate: moment(),
            finishDate: moment(),
            Projects: [],
            projectId: '',
            columns: columnsGrid,
            isLoading: true,
            rows: [],
            btnisLoading: false,
            isLoadingsendRequest: false,
            statusClassSuccess: "disNone",
            Loading: false,
            pageSize: 50,
            pageNumber: 0,
            totalRows: 0,
            viewfilter: false,
            showDeleteModal: false,
            selectedRow: 0
        };
    }

    GetNextData = () => {
        let pageNumber = this.state.pageNumber + 1;
        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        if (this.state.projectId) {
            Api.post('GetTimeSheetByRange', { projectId: this.state.projectId, startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(result => {
                let oldRows = this.state.rows;
                const newRows = [...oldRows, ...result];

                this.setState({
                    rows: newRows,
                    totalRows: newRows.length,
                    isLoading: false
                });
            }).catch(ex => {
                let oldRows = this.state.rows;
                this.setState({
                    rows: oldRows,
                    isLoading: false
                });
            });
        }
        else {
            Api.post('GetTimeSheetByRange', { startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(result => {
                let oldRows = this.state.rows;
                const newRows = [...oldRows, ...result];

                this.setState({
                    rows: newRows,
                    totalRows: newRows.length,
                    isLoading: false
                });
            }).catch(ex => {
                let oldRows = this.state.rows;
                this.setState({
                    rows: oldRows,
                    isLoading: false
                });
            });
        }
    }

    // filterMethodMain = (event, query, apiFilter) => {

    //     var stringifiedQuery = JSON.stringify(query);
    //     if (stringifiedQuery == '{"isCustom":true}') {
    //         stringifiedQuery = undefined
    //     }
    //     this.setState({
    //         isLoading: true,
    //         query: stringifiedQuery
    //     });

    //     if (stringifiedQuery !== "{}") {
    //         Api.get(apiFilter + "?projectId=" + this.state.projectId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize + "&query=" + stringifiedQuery).then(result => {
    //             this.setState({
    //                 rows: result.data != undefined ? [...result.data] : result,
    //                 totalRows: result.data != undefined ? result.total : 0,
    //                 isLoading: false
    //             });

    //             this.setState({
    //                 isLoading: false
    //             });
    //         }).catch(ex => {
    //             this.setState({
    //                 rows: [],
    //                 isLoading: false
    //             });
    //         });
    //     } else {
    //         this.GetRecordOfLog(this.state.isCustom === true ? documentObj.documentApi.getCustom : documentObj.documentApi.get, this.state.projectId);
    //     }
    // };

    addRecord() {
        this.props.history.push({ pathname: 'PettyCashAddEdit/0/0' })
    }

    componentDidMount = () => {
        dataservice.GetDataGrid('GetPeetyCashForContact').then(data => {
            this.setState({ rows: data, isLoading: false, totalRows: data.length, });
        })
    }

    ProjectshandleChange = (e) => {
        this.setState({ projectId: e.value, })
    }

    toggleFilter = () => {
        this.setState({ viewfilter: !this.state.viewfilter });
    }

    cellClick = (rowID, colID) => {
        if (colID != 0 && colID != 1) {
            this.props.history.push({ pathname: `/PettyCashAddEdit/${this.state.rows[rowID].id}/${this.state.rows[rowID].projectId}` });
        }
    }

    clickHandlerDeleteRows = (selectedRow) => {
        this.setState({ showDeleteModal: true, selectedRow: selectedRow.slice(-1) });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerContinueMain = () => {
        this.setState({ isLoading: true, showDeleteModal: false });
 
        Api.post(`DeletePeetyCash?id=${this.state.selectedRow}`).then(result => {
            this.setState({ isLoading: false });
        }).catch(ex => {
            this.setState({ isLoading: false, showDeleteModal: false });
        });
    };

    render() {
        const ComponantFilter = this.state.isLoading === false ?
            (
                <Filter
                    filtersColumns={this.state.columns} // apiFilter={this.state.apiFilter}
                    filterMethod={this.filterMethodMain} // key={this.state.docType}
                />
            ) : null;
        const btnExport =
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={Resources["peetyCash"][currentLanguage]} />


        return (
            <div className="main__fulldash--container">

                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero"> {Resources["peetyCash"][currentLanguage]}</h3>
                        <span>{this.state.rows.length}</span>
                        <div className="ui labeled icon top right pointing dropdown fillter-button" tabIndex="0" onClick={this.toggleFilter}>
                            <span>
                                <svg width="16px" height="18px" viewBox="0 0 16 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" >
                                    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"  >
                                        <g id="Action-icons/Filters/Hide+text/24px/Grey_Base" transform="translate(-4.000000, -3.000000)"  >
                                            <g id="Group-4">
                                                <g id="Group-7">
                                                    <g id="filter">
                                                        <rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="24" height="24" />
                                                        <path d="M15.5116598,15.1012559 C14.1738351,15.1012559 13.0012477,14.2345362 12.586259,12.9819466 L4.97668038,12.9819466 C4.43781225,12.9819466 4,12.5415758 4,12 C4,11.4584242 4.43781225,11.0180534 4.97668038,11.0180534 L12.586259,11.0180534 C13.0012477,9.76546385 14.1738351,8.89874411 15.5116598,8.89874411 C16.8494845,8.89874411 18.0220719,9.76546385 18.4370606,11.0180534 L19.0233196,11.0180534 C19.5621878,11.0180534 20,11.4584242 20,12 C20,12.5415758 19.5621878,12.9819466 19.0233196,12.9819466 L18.4370606,12.9819466 C18.0220719,14.2345362 16.8494845,15.1012559 15.5116598,15.1012559 Z M15.5116598,10.8626374 C14.8886602,10.8626374 14.3813443,11.372918 14.3813443,12 C14.3813443,12.627082 14.8886602,13.1373626 15.5116598,13.1373626 C16.1346594,13.1373626 16.6419753,12.627082 16.6419753,12 C16.6419753,11.372918 16.1346594,10.8626374 15.5116598,10.8626374 Z M7.78600823,9.20251177 C6.44547873,9.20251177 5.27202225,8.33246659 4.8586039,7.07576209 C4.37264206,7.01672011 4,6.60191943 4,6.10125589 C4,5.60059914 4.37263163,5.1858019 4.85858244,5.12675203 C5.27168513,3.86979791 6.44573643,3 7.78600823,3 C9.1238329,3 10.2964204,3.86671974 10.711409,5.11930926 L19.0233196,5.11930926 C19.5621878,5.11930926 20,5.5596801 20,6.10125589 C20,6.64283167 19.5621878,7.08320251 19.0233196,7.08320251 L10.711409,7.08320251 C10.2964204,8.33579204 9.1238329,9.20251177 7.78600823,9.20251177 Z M7.78600823,4.96389325 C7.1630086,4.96389325 6.65569273,5.4741739 6.65569273,6.10125589 C6.65569273,6.72833787 7.1630086,7.23861852 7.78600823,7.23861852 C8.40900786,7.23861852 8.91632373,6.72833787 8.91632373,6.10125589 C8.91632373,5.4741739 8.40900786,4.96389325 7.78600823,4.96389325 Z M13.1695709,18.8806907 C12.7545822,20.1332803 11.5819948,21 10.2441701,21 C8.90634542,21 7.73375797,20.1332803 7.3187693,18.8806907 L4.97668038,18.8806907 C4.43781225,18.8806907 4,18.4403199 4,17.8987441 C4,17.3571683 4.43781225,16.9167975 4.97668038,16.9167975 L7.3187693,16.9167975 C7.73375797,15.664208 8.90634542,14.7974882 10.2441701,14.7974882 C11.5819948,14.7974882 12.7545822,15.664208 13.1695709,16.9167975 L19.0233196,16.9167975 C19.5621878,16.9167975 20,17.3571683 20,17.8987441 C20,18.4403199 19.5621878,18.8806907 19.0233196,18.8806907 L13.1695709,18.8806907 Z M10.2441701,16.7613815 C9.62117047,16.7613815 9.1138546,17.2716621 9.1138546,17.8987441 C9.1138546,18.5258261 9.62117047,19.0361068 10.2441701,19.0361068 C10.8671697,19.0361068 11.3744856,18.5258261 11.3744856,17.8987441 C11.3744856,17.2716621 10.8671697,16.7613815 10.2441701,16.7613815 Z"
                                                            id="Shape" fill="#a8b0bf" fillRule="nonzero" />
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </span>

                            <span className={"text " + (this.state.viewfilter ? 'active' : '')}>
                                <span className="show-fillter">{Resources["showFillter"][currentLanguage]}</span>
                                <span className="hide-fillter">{Resources["hideFillter"][currentLanguage]}</span>
                            </span>

                        </div>
                    </div>
                    <div className="filterBTNS">
                        <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.addRecord()}>New</button>
                        {btnExport}
                    </div>
                     <div className="rowsPaginations readOnly__disabled">
                        <div className="rowsPagiRange">
                            <span>0</span> - <span>{this.state.pageSize}</span> of <span>{this.state.totalRows}</span>
                        </div>
                        <button className="rowunActive">
                            <i className="angle left icon" />
                        </button>
                        <button onClick={() => this.GetNextData()}>
                            <i className="angle right icon" />
                        </button>
                    </div>
                </div>
                <div className="filterHidden" style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
                    <div className="gridfillter-container">
                        {ComponantFilter}
                    </div>
                </div>
                <div className="grid-container">
                    {this.state.Loading ? <LoadingSection /> : null}
                    {this.state.isLoading == false ?
                        <GridSetup showCheckbox={true}
                            columns={this.state.columns}
                            rows={this.state.rows}
                            cellClick={this.cellClick}
                            clickHandlerDeleteRows={this.clickHandlerDeleteRows}
                        />
                        : <LoadingSection />}
                </div>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources["smartDeleteMessage"][currentLanguage].content}
                        buttonName="delete"
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        clickHandlerContinue={this.clickHandlerContinueMain}

                    />
                ) : null}
            </div>
        )
    }
}
export default withRouter(PettyCash)
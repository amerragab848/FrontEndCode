import React, { Component } from "react";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Api from "../../api";
import Resources from "../../resources.json";
import moment from "moment";
import GridCustom from '../../Componants/Templates/Grid/CustomCommonLogGrid';
import Export from "../OptionsPanels/Export";
import DashBoardDefenition from "./DashBoardDefenition";
import Filter from '../../Componants/FilterComponent/filterComponent';
import { connect } from 'react-redux';
import CryptoJS from "crypto-js";
import {    bindActionCreators} from 'redux';
import * as dashboardComponantActions from '../../store/actions/communication';
import Config from "../../Services/Config"

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let moduleId = Config.getPublicConfiguartion().dashboardApi;

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
let route = null;
class DashBoardCounterLog extends Component {
    constructor(props) {
        super(props);
        const query = new URLSearchParams(this.props.location.search);
        let key = null;
        let getkeyDetails = null;
        for (let param of query.entries()) {
            key = param[1];
        }
        if (key) {
            getkeyDetails = DashBoardDefenition.find(i => i.key === key);
            route = getkeyDetails.RouteEdit;
            getkeyDetails.columns.forEach(item => {
                if (item.formatter === 'dateFormate') {
                    item.formatter = dateFormate;
                }
            });
            this.state = {
                gridKey: getkeyDetails.key,
                columns: getkeyDetails.columns,
                RouteEdit: getkeyDetails.RouteEdit,
                rows: [],
                isLoading: true,
                filtersColumns: getkeyDetails.filters,
                viewfilter: false,
                apiDetails: getkeyDetails.apiDetails,
                pageTitle: getkeyDetails.title,
                ShowCheckbox: false,
                pageSize: 50,
                pageNumber: 0,
                filterMode: false,
                totalRows: 0,
                apiFilter: getkeyDetails.filterApi,
                api: '',
                query: '',
                isFilter: false,
                maxRows: 50

            };
        }
    }
  
    filterMethodMain = (event, query, apiFilter) => {
        var stringifiedQuery = encodeURIComponent(JSON.stringify(query));

        if (stringifiedQuery == '{"isCustom":true}') {
            stringifiedQuery = undefined;
        }

        this.setState({
            isLoading: true,
            query: stringifiedQuery,
            filterMode: true,
        });

        if (stringifiedQuery !== '{}') {
            Api.get(apiFilter + '?&pageNumber=' + this.state.pageNumber + '&pageSize=' + this.state.pageSize + '&query=' + stringifiedQuery)
                .then(result => {
                    if (result != null && result.length > 0) {

                        this.setState({
                            rows: result || [],
                            totalRows:
                                result != undefined ? result.length : 0,
                            isLoading: false,
                            isFilter: true,
                        });
                    } else {
                        this.setState({
                            rows: [],
                            totalRows: 0,
                            isLoading: false,
                        });
                    }
                })
                .catch(ex => {
                    this.setState({
                        rows: [],
                        isLoading: false,
                    });
                });
        } else {

        }
    };
    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;

        if (pageNumber >= 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber,
            });

            let url = (this.state.query == '' ? this.state.apiDetails : this.state.apiFilter) + '?&pageNumber=' + pageNumber + '&pageSize=' + this.state.pageSize + (this.state.query == '' ? '' : '&query=' + this.state.query);

            Api.get(url)
                .then(result => {
                    let oldRows = []; // this.state.rows;

                    const newRows = [...oldRows, ...result];


                    this.setState({
                        rows: newRows,
                        totalRows: result.length,
                        isLoading: false,
                    });
                })
                .catch(ex => {
                    let oldRows = this.state.rows;
                    this.setState({
                        rows: oldRows,
                        isLoading: false,
                    });
                });
        }
    }

    GetNextData() {
        let pageNumber = this.state.pageNumber + 1;

        this.setState({
            maxRows: this.state.totalRows
        });

        if (this.state.maxRows > 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber,
            });

            let url = (this.state.query == '' ? this.state.apiDetails : this.state.apiFilter) + '?projectId=' + this.state.projectId + '&pageNumber=' + pageNumber + '&pageSize=' + this.state.pageSize + (this.state.query == '' ? '' : '&query=' + this.state.query);

            Api.get(url).then(result => {
                let oldRows = [];
                const newRows = [...oldRows, ...result];
                this.setState({
                    rows: newRows,
                    totalRows: result.length,
                    isLoading: false,
                });
            })
                .catch(ex => {
                    let oldRows = this.state.rows;
                    this.setState({
                        rows: oldRows,
                        isLoading: false,
                    });
                });
        }
    }
    changeValueOfProps = () => {
        this.setState({ isFilter: false });
    };

    componentDidMount() {

        this.props.actions.RouteToTemplate();
        let projectId = this.props.projectId == 0 ? localStorage.getItem('lastSelectedProject') : this.props.projectId;
        var e = { label: this.props.projectName, value: projectId };

        if (this.state.apiDetails) {
            let spliteData = this.state.apiDetails.split("-");
            if (spliteData.length > 1) {
                let data = spliteData[1].split("&");
                let obj = {};
                obj.pageNumber = data[0].split("=")[1];
                obj.pageSize = data[1].split("=")[1];
                Api.post(spliteData[0], obj).then(result => {
                    result.forEach(row => {
                        if (row) {
                            let obj = {
                                docId: row.id,
                                projectId: row.projectId,
                                projectName: row.projectName,
                                arrange: row.arrange,
                                docApprovalId: row.accountDocWorkFlowId,
                                isApproveMode: true,
                                perviousRoute: window.location.pathname + window.location.search
                            };

                            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
                            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
                            row.link = "/" + route + "?id=" + encodedPaylod
                        }
                    })
                    this.setState({
                        rows: result != null ? result : [],
                        isLoading: false
                    });
                });
            } else {
                Api.get(this.state.apiDetails,undefined,moduleId).then(result => {
                    result.forEach(row => {
                        if (row) {
                            let obj = {
                                docId: row.id,
                                projectId: row.projectId,
                                projectName: row.projectName,
                                arrange: row.arrange,
                                docApprovalId: row.accountDocWorkFlowId,
                                isApproveMode: true,
                                perviousRoute: window.location.pathname + window.location.search
                            };

                            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
                            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
                            row.link = "/" + route + "?id=" + encodedPaylod
                        }
                    })
                    this.setState({
                        rows: result != null ? result : [],
                        isLoading: false
                    })
                })
            }
        }
    }

    hideFilter(value) {
        this.setState({ viewfilter: !this.state.viewfilter });

        return this.state.viewfilter;
    }

    onRowClick = (obj) => {
        if (this.state.RouteEdit !== '') {
            let objRout = {
                docId: obj.id,
                projectId: obj.projectId,
                projectName: obj.projectName,
                arrange: 0,
                docApprovalId: 0,
                isApproveMode: false,
                perviousRoute: window.location.pathname + window.location.search
            }
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
            this.props.history.push({
                pathname: "/" + this.state.RouteEdit,
                search: "?id=" + encodedPaylod
            });
        }
    }

    render() {
        const dataGrid =
            this.state.isLoading === false ? (

                <GridCustom
                    gridKey={"DashBoardCounterLog-" + this.state.gridKey}
                    data={this.state.rows}
                    actions={this.actions}
                    rowActions={
                        []
                    }
                    cells={this.state.columns}
                    openModalColumn={this.state.columnsModal}
                    rowClick={(cell) => { this.onRowClick(cell) }}
                    groups={this.state.groups || []}
                    isFilter={this.state.isFilter}
                    changeValueOfProps={
                        this.changeValueOfProps.bind(this)
                    }
                    showCheckAll={true}
                />
            ) : (<LoadingSection />);

        const btnExport = this.state.isLoading === false ? (<Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={Resources[this.state.pageTitle][currentLanguage]} />
        ) : (<LoadingSection />);

        const ComponantFilter = this.state.isLoading === false ?
            (
                <Filter filtersColumns={this.state.filtersColumns}
                    apiFilter={this.state.apiFilter}
                    filterMethod={this.filterMethodMain} />) : (
                <LoadingSection />
            );



        return (
            <div className="mainContainer">
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero">{this.state.pageTitle}</h3>
                        <span>{this.state.rows.length}</span>
                        <div
                            className="ui labeled icon top right pointing dropdown fillter-button"
                            tabIndex="0"
                            onClick={e =>
                                this.hideFilter(e, this.state.viewfilter)
                            }>
                            <span>
                                <svg
                                    width="16px"
                                    height="18px"
                                    viewBox="0 0 16 18"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <g
                                        id="Symbols"
                                        stroke="none"
                                        strokeWidth="1"
                                        fill="none"
                                        fillRule="evenodd">
                                        <g
                                            id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                            transform="translate(-4.000000, -3.000000)">
                                            <g id="Group-4">
                                                <g id="Group-7">
                                                    <g id="filter">
                                                        <rect
                                                            id="bg"
                                                            fill="#80CBC4"
                                                            opacity="0"
                                                            x="0"
                                                            y="0"
                                                            width="24"
                                                            height="24"
                                                        />
                                                        <path
                                                            d="M15.5116598,15.1012559 C14.1738351,15.1012559 13.0012477,14.2345362 12.586259,12.9819466 L4.97668038,12.9819466 C4.43781225,12.9819466 4,12.5415758 4,12 C4,11.4584242 4.43781225,11.0180534 4.97668038,11.0180534 L12.586259,11.0180534 C13.0012477,9.76546385 14.1738351,8.89874411 15.5116598,8.89874411 C16.8494845,8.89874411 18.0220719,9.76546385 18.4370606,11.0180534 L19.0233196,11.0180534 C19.5621878,11.0180534 20,11.4584242 20,12 C20,12.5415758 19.5621878,12.9819466 19.0233196,12.9819466 L18.4370606,12.9819466 C18.0220719,14.2345362 16.8494845,15.1012559 15.5116598,15.1012559 Z M15.5116598,10.8626374 C14.8886602,10.8626374 14.3813443,11.372918 14.3813443,12 C14.3813443,12.627082 14.8886602,13.1373626 15.5116598,13.1373626 C16.1346594,13.1373626 16.6419753,12.627082 16.6419753,12 C16.6419753,11.372918 16.1346594,10.8626374 15.5116598,10.8626374 Z M7.78600823,9.20251177 C6.44547873,9.20251177 5.27202225,8.33246659 4.8586039,7.07576209 C4.37264206,7.01672011 4,6.60191943 4,6.10125589 C4,5.60059914 4.37263163,5.1858019 4.85858244,5.12675203 C5.27168513,3.86979791 6.44573643,3 7.78600823,3 C9.1238329,3 10.2964204,3.86671974 10.711409,5.11930926 L19.0233196,5.11930926 C19.5621878,5.11930926 20,5.5596801 20,6.10125589 C20,6.64283167 19.5621878,7.08320251 19.0233196,7.08320251 L10.711409,7.08320251 C10.2964204,8.33579204 9.1238329,9.20251177 7.78600823,9.20251177 Z M7.78600823,4.96389325 C7.1630086,4.96389325 6.65569273,5.4741739 6.65569273,6.10125589 C6.65569273,6.72833787 7.1630086,7.23861852 7.78600823,7.23861852 C8.40900786,7.23861852 8.91632373,6.72833787 8.91632373,6.10125589 C8.91632373,5.4741739 8.40900786,4.96389325 7.78600823,4.96389325 Z M13.1695709,18.8806907 C12.7545822,20.1332803 11.5819948,21 10.2441701,21 C8.90634542,21 7.73375797,20.1332803 7.3187693,18.8806907 L4.97668038,18.8806907 C4.43781225,18.8806907 4,18.4403199 4,17.8987441 C4,17.3571683 4.43781225,16.9167975 4.97668038,16.9167975 L7.3187693,16.9167975 C7.73375797,15.664208 8.90634542,14.7974882 10.2441701,14.7974882 C11.5819948,14.7974882 12.7545822,15.664208 13.1695709,16.9167975 L19.0233196,16.9167975 C19.5621878,16.9167975 20,17.3571683 20,17.8987441 C20,18.4403199 19.5621878,18.8806907 19.0233196,18.8806907 L13.1695709,18.8806907 Z M10.2441701,16.7613815 C9.62117047,16.7613815 9.1138546,17.2716621 9.1138546,17.8987441 C9.1138546,18.5258261 9.62117047,19.0361068 10.2441701,19.0361068 C10.8671697,19.0361068 11.3744856,18.5258261 11.3744856,17.8987441 C11.3744856,17.2716621 10.8671697,16.7613815 10.2441701,16.7613815 Z"
                                                            id="Shape"
                                                            fill="#5E6475"
                                                            fillRule="nonzero"
                                                        />
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </span>
                            <span
                                className={
                                    'text ' +
                                    (this.state.viewfilter === false
                                        ? ' '
                                        : ' active')
                                }>
                                <span className="show-fillter">
                                    {
                                        Resources['showFillter'][
                                        currentLanguage
                                        ]
                                    }
                                </span>
                                <span className="hide-fillter">
                                    {
                                        Resources['hideFillter'][
                                        currentLanguage
                                        ]
                                    }
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="rowsPaginations readOnly__disabled">
                        <div className="rowsPagiRange">
                            <span>
                                {this.state.pageSize *
                                    this.state.pageNumber +
                                    1}
                            </span>{' '}
                  -
                  <span>
                                {this.state.filterMode
                                    ? this.state.totalRows
                                    : this.state.pageSize *
                                    this.state.pageNumber +
                                    this.state.pageSize}
                            </span>

                        </div>
                        <button
                            className={
                                this.state.pageNumber == 0
                                    ? 'rowunActive'
                                    : ''
                            }
                            onClick={() => this.GetPrevoiusData()}>
                            <i className="angle left icon" />
                        </button>
                        <button
                            className={
                                this.state.totalRows !==
                                    this.state.pageSize *
                                    this.state.pageNumber +
                                    this.state.pageSize
                                    ? 'rowunActive'
                                    : ''
                            }
                            onClick={() => this.GetNextData()}>
                            <i className="angle right icon" />
                        </button>
                    </div>
                </div>
                <div
                    className="filterHidden"
                    style={{
                        maxHeight: this.state.viewfilter ? '' : '0px',
                        overflow: this.state.viewfilter ? '' : 'hidden',
                    }}>
                    <div className="gridfillter-container">
                        {ComponantFilter}
                    </div>
                </div>
                <div>
                    <div
                        className={
                            this.state.minimizeClick
                                ? 'minimizeRelative miniRows'
                                : 'minimizeRelative'
                        }>
                        <div className="minimizeSpan">
                            <div
                                className="H-tableSize"
                                data-toggle="tooltip"
                                title="Minimize Rows"
                                onClick={this.handleMinimize}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24">
                                    <g
                                        fill="none"
                                        fillRule="evenodd"
                                        transform="translate(5 5)">
                                        <g fill="#CCD2DB" mask="url(#b)">
                                            <path
                                                id="a"
                                                d="M0 1.007C0 .45.45 0 1.008 0h1.225c.556 0 1.008.45 1.008 1.007v11.986C3.24 13.55 2.79 14 2.233 14H1.008C.45 14 0 13.55 0 12.993V1.007zm5.38 0C5.38.45 5.83 0 6.387 0h1.226C8.169 0 8.62.45 8.62 1.007v11.986C8.62 13.55 8.17 14 7.613 14H6.387c-.556 0-1.007-.45-1.007-1.007V1.007zm5.38 0C10.76.45 11.21 0 11.766 0h1.225C13.55 0 14 .45 14 1.007v11.986C14 13.55 13.55 14 12.992 14h-1.225c-.556 0-1.008-.45-1.008-1.007V1.007z"
                                            />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <div
                                className="V-tableSize"
                                data-toggle="tooltip"
                                title="Filter Columns"
                                onClick={this.openModalColumn}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24">
                                    <g
                                        fill="none"
                                        fillRule="evenodd"
                                        transform="translate(5 5)">
                                        <g fill="#CCD2DB" mask="url(#b)">
                                            <path
                                                id="a"
                                                d="M0 1.007C0 .45.45 0 1.008 0h1.225c.556 0 1.008.45 1.008 1.007v11.986C3.24 13.55 2.79 14 2.233 14H1.008C.45 14 0 13.55 0 12.993V1.007zm5.38 0C5.38.45 5.83 0 6.387 0h1.226C8.169 0 8.62.45 8.62 1.007v11.986C8.62 13.55 8.17 14 7.613 14H6.387c-.556 0-1.007-.45-1.007-1.007V1.007zm5.38 0C10.76.45 11.21 0 11.766 0h1.225C13.55 0 14 .45 14 1.007v11.986C14 13.55 13.55 14 12.992 14h-1.225c-.556 0-1.008-.45-1.008-1.007V1.007z"
                                            />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div
                            className={
                                'grid-container ' +
                                (this.state.rows.length === 0
                                    ? 'griddata__load'
                                    : ' ')
                            }>
                            {dataGrid}
                        </div>
                    </div>
                </div>
                <div>

                </div>
                <div
                    className={
                        this.state.columnsModal
                            ? 'grid__column active '
                            : 'grid__column '
                    }>
                    <div className="grid__column--container">
                        <button
                            className="closeColumn"
                            onClick={this.closeModalColumn}>
                            X
              </button>
                        <div className="grid__column--title">
                            <h2>
                                {Resources.gridColumns[currentLanguage]}
                            </h2>
                        </div>
                        <div className="grid__column--content" id="grid__column--content">
                            {/* {RenderPopupShowColumns} */}
                        </div>
                        <div className="grid__column--footer">
                            <button
                                className="btn primaryBtn-1"
                                onClick={this.closeModalColumn}>
                                {Resources.close[currentLanguage]}
                            </button>
                            <button
                                className="btn primaryBtn-2"
                                onClick={this.ResetShowHide}>
                                {Resources.reset[currentLanguage]}{' '}
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        this.state.exportColumnsModal
                            ? 'grid__column active '
                            : 'grid__column '
                    }>
                    <div className="grid__column--container">
                        <button
                            className="closeColumn"
                            onClick={this.closeModalColumn}>
                            X
              </button>
                        <div className="grid__column--title">
                            <h2>{Resources.export[currentLanguage]}</h2>
                        </div>
                        <div className="grid__column--content">
                            {/* {RenderPopupShowExportColumns} */}
                        </div>
                        <div className="grid__column--footer">
                            <button
                                className="btn primaryBtn-1"
                                onClick={this.closeModalColumn}>
                                {Resources.close[currentLanguage]}
                            </button>

                            {this.state.isExporting == true ? (
                                <LoadingSection />
                            ) : (
                                    <>
                                        <button className="btn primaryBtn-2" onClick={this.btnExportServerClick}>{Resources.export[currentLanguage]} </button>
                                        <button className="btn primaryBtn-2" onClick={this.btnExportStatisticsClick}>{Resources.exportStatistic[currentLanguage]} </button>
                                    </>
                                )}
                        </div>
                    </div>
                </div>
                <div
                    className={
                        this.state.chartColumnsModal
                            ? 'grid__column fullmodal active '
                            : 'grid__column fullmodal'
                    }>
                    <div className="grid__column--container">
                        <button
                            className="closeColumn"
                            onClick={this.closeModalColumn}>
                            X
              </button>
                        <div className="grid__column--title">
                            <h2>{Resources.chart[currentLanguage]}</h2>
                        </div>
                        <div className="grid__column--content">
                            <div className="grid__column--content-wrapper">
                                {/* {RenderPopupShowChartColumns} */}
                            </div>
                            <div className="gridChart">

                                {this.state.showChart == true ? (
                                    <div className="largePopup largeModal ">
                                        <div>
                                            {this.state.chartContent}
                                        </div>
                                        {this.state.singleChartBtn == true ?
                                            <div class="linebylineInput">
                                                {/* <label class="control-label">Chart Type</label> */}
                                                <div class="ui checkbox radio radioBoxBlue">
                                                    <input type="radio" name="letter-status" defaultChecked={this.state.singleChartType === "true" ? 'checked' : null} value="true" onChange={this.changeChartType} />
                                                    <label>Bar</label>
                                                </div>
                                                <div class="ui checkbox radio radioBoxBlue">
                                                    <input type="radio" name="letter-status" defaultChecked={this.state.singleChartType === "false" ? 'checked' : null} value="false" onChange={this.changeChartType} />
                                                    <label>Pie</label>
                                                </div>
                                            </div>
                                            : null}
                                    </div>
                                ) : null}
                            </div>

                        </div>
                        <div className="grid__column--footer">
                            <button
                                className="btn primaryBtn-1"
                                onClick={this.closeModalColumn}>
                                {Resources.close[currentLanguage]}
                            </button>

                            {this.state.isExporting == true ? (
                                <LoadingSection />
                            ) : (
                                    <div>
                                        <button
                                            className="btn primaryBtn-2"
                                            onClick={this.btnStatisticsServerClick}>
                                            {Resources.chart[currentLanguage]}{' '}
                                        </button>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>


            </div>
            //  end of new 

        );
    }
}
function mapStateToProps(state, ownProps) {
    return {
        projectId: state.communication.projectId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(dashboardComponantActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DashBoardCounterLog);
import React, { Component } from "react";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import Api from '../../api'
import Export from "../../Componants/OptionsPanels/Export";
import { connect } from 'react-redux';
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { toast } from "react-toastify";
import Filter from "../../Componants/FilterComponent/filterComponent";
import GridCustom from "../../Componants/Templates/Grid/CustomCommonLogGrid";
import config from "../../Services/Config";
import CryptoJS from 'crypto-js';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const _ = require('lodash')
class corrRecievedSent extends Component {
    constructor(props) {
        super(props);
        this.rowActions = [
            {
                title: Resources['View'][currentLanguage],
                handleClick: value => {
                    if(config.IsAllow(42))
                    {
                        this.handleRowClicCorrSentView(value);
                    }
                 }
            },
          
        ]
        this.rowActionList = [
        
            {
                title: Resources['View'][currentLanguage],
                handleClick: value => {
                    if(config.IsAllow(42))
                    {
                        this.handleRowClicCorrReceiveView(value);

                    }

                }
            },
        ]
        this.recivedColumns = [
            {
                field: 'arrange',
                title: Resources['arrange'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'statusName',
                title: Resources['status'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'subject',
                title: Resources['subject'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'fromCompanyName',
                title: Resources['fromCompany'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'fromContactName',
                title: Resources['fromContact'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'toCompanyName',
                title: Resources['toCompany'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'toContactName',
                title: Resources['ToContact'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'docDate',
                title: Resources['sendDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: 'docCloseDate',
                title: Resources['docClosedate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: 'docTypeName',
                title: Resources['docType'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'sendingMethod',
                title: Resources['sendingMethod'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'refDoc',
                title: Resources['refDoc'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'lastSendTime',
                title: Resources['lastSendTime'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'lastApproveTime',
                title: Resources['lastApprovedTime'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }]
        this.sendColumns = [
            {
                field: 'arrange',
                title: Resources['arrange'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'statusName',
                title: Resources['status'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'subject',
                title: Resources['subject'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'fromCompanyName',
                title: Resources['fromCompany'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'fromContactName',
                title: Resources['fromContact'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'toCompanyName',
                title: Resources['toCompany'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'toContactName',
                title: Resources['ToContact'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'docDate',
                title: Resources['docDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: 'sendDate',
                title: Resources['sendDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: 'docCloseDate',
                title: Resources['docClosedate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }, {
                field: 'docType',
                title: Resources['docType'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'sendingMethod',
                title: Resources['sendingMethod'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'refDoc',
                title: Resources['refDoc'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'lastSendTime',
                title: Resources['lastSendTime'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'lastApproveTime',
                title: Resources['lastApprovedTime'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }]
        this.sendFiltersColumns = [
            {
                "name": "arrange",
                "field": "arrange",
                "type": "number"
            },
            {
                "name": "status",
                "field": "status",
                "type": "toggle",
                "trueLabel": "oppened",
                "falseLabel": "closed"
            },
            {
                "name": "subject",
                "field": "subject",
                "type": "string"
            },
            {
                "name": "fromCompany",
                "field": "fromCompanyName",
                "type": "string"
            },
            {
                "name": "fromContact",
                "field": "fromContactName",
                "type": "string"
            },
            {
                "name": "toCompany",
                "field": "toCompanyName",
                "type": "string"
            },
            {
                "name": "ToContact",
                "field": "toContactName",
                "type": "string"
            },
            {
                "name": "docDate",
                "field": "docDate",
                "type": "date"
            },
            {
                "name": "sendDate",
                "field": "sendDate",
                "type": "date"
            },
            {
                "name": "docClosedate",
                "field": "docCloseDate",
                "type": "date"
            },
            {
                "name": "docType",
                "field": "docType",
                "type": "number"
            },
            {
                "name": "sendingMethod",
                "field": "sendingMethod",
                "type": "string"
            },
            {
                "name": "refDoc",
                "field": "refDoc",
                "type": "string"
            }]
        this.receivedFiltersColumns = [
            {
                "name": "arrange",
                "field": "arrange",
                "type": "number"
            },
            {
                "name": "status",
                "field": "status",
                "type": "toggle",
                "trueLabel": "oppened",
                "falseLabel": "closed"
            },
            {
                "name": "subject",
                "field": "subject",
                "type": "string"
            },
            {
                "name": "fromCompany",
                "field": "fromCompanyName",
                "type": "string"
            },
            {
                "name": "fromContact",
                "field": "fromContactName",
                "type": "string"
            },
            {
                "name": "toCompany",
                "field": "toCompanyName",
                "type": "string"
            },
            {
                "name": "ToContact",
                "field": "toContactName",
                "type": "string"
            },
            {
                "name": "docDate",
                "field": "docDate",
                "type": "date"
            },
            {
                "name": "sendDate",
                "field": "sendDate",
                "type": "date"
            },
            {
                "name": "docClosedate",
                "field": "docCloseDate",
                "type": "date"
            },
            {
                "name": "docType",
                "field": "docType",
                "type": "number"
            },
            {
                "name": "sendingMethod",
                "field": "sendingMethod",
                "type": "string"
            },
            {
                "name": "refDoc",
                "field": "refDoc",
                "type": "string"
            }]
        this.state = {
            projectId: this.props.match.params.projectId,
            tabIndex: 0,
            receivedLoading: false,
            sendLoading: false,
            showDeleteModal: false,
            receivedRow: [],
            sendRows: [],
            columns: this.sendColumns,
            rows: [],
            viewfilter: false,
            apiFilter: 'CorrespondenceSentFilter',
            pageNumber: 0,
            pageSize: 200,
            selectedRow: []
        }
        this.actions = [
            {
                title: 'Delete',
                handleClick: values => {
                    this.clickHandlerDeleteRowsMain(values);
                }
            }
        ]
    }
    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add('even');
            }
            else {
                links[i].classList.add('odd');
            }
        }
    };
    componentWillReceiveProps(props) {
        if (this.state.projectId != props.projectId)
            this.setState({ projectId: props.projectId })
    }
    handleRowClicCorrSentView = (row) => {
        if (row.id > 0) {

            let obj = {
                docId: row.id,
                arrange: 0,
                docApprovalId: 0,
                isApproveMode: false,
                perviousRoute: window.location.pathname + window.location.search
            };
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
            if (config.IsAllow(42)) {
                this.props.history.push({ pathname: "/corrSentView", search: "?id=" + encodedPaylod });
            }
            
            else {
                toast.warn(Resources.missingPermissions[currentLanguage])
            }

        };
    }
    handleRowClicCorrReceiveView = (row) => {
        if (row.id > 0) {

            let obj = {
                docId: row.id,
                arrange: 0,
                docApprovalId: 0,
                isApproveMode: false,
                perviousRoute: window.location.pathname + window.location.search
            };
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
            if (config.IsAllow(42)) {
                this.props.history.push({ pathname: "/corrReceiveView", search: "?id=" + encodedPaylod });
            }
           
            else {
                toast.warn(Resources.missingPermissions[currentLanguage])
            }

        };
    }
    componentWillMount() {
        this.setState({ receivedLoading: true })
        Api.get('GetCommunicationCorrespondenceReceived?projectId=' + this.state.projectId + '&pageNumber=0&pageSize=200').then(res => {
            let rows = res != null ? res : []
            this.setState({ receivedRow: rows, rows, columns: this.recivedColumns, receivedLoading: false })
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ receivedRow: [], rows: [], columns: this.recivedColumns, receivedLoading: false })
        })
        this.setState({ sendLoading: true })
        Api.get('GetCommunicationCorrespondenceSent?projectId=' + this.state.projectId + '&pageNumber=0&pageSize=200').then(res => {
            let rows = res != null ? res : []
            this.setState({ sendRows: rows, sendLoading: false, rows })
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ sendRows: [], rows: [], columns: this.sendColumns, sendLoading: false })
        })
    };
    onClickTabItem(tabIndex) {
        let rows = tabIndex == 0 ? this.state.sendRows : this.state.receivedRow;
        let columns = tabIndex == 0 ? this.sendColumns : this.recivedColumns
        this.setState({ tabIndex, rows, columns });
    }
    hideFilter(value) {
        this.setState({ viewfilter: !this.state.viewfilter });
        return this.state.viewfilter;
    }

    filterMethodMain = (event, query, apiFilter) => {
        var stringifiedQuery = JSON.stringify(query);
        this.setState({
            query: stringifiedQuery
        });
        if (this.state.tabIndex == 0) {
            this.setState({ sendLoading: true })
            Api.get('CorrespondenceSentFilter' + "?projectId=" + this.state.projectId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize + "&query=" + stringifiedQuery).then(result => {
                let rows = result != null ? result : []
                this.setState({
                    rows,
                    sendRows: rows,
                    totalRows: result.length,
                    sendLoading: false
                });
            }).catch(ex => {
                this.setState({
                    rows: [],
                    sendRows: [],
                    sendLoading: false
                });
                toast.error(Resources["operationCanceled"][currentLanguage]);
            });
        }
        else {
            this.setState({ receivedLoading: true })
            Api.get('CommunicationCorrespondenceReceivedFilter' + "?projectId=" + this.state.projectId + "&pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize + "&query=" + stringifiedQuery).then(result => {
                let rows = result != null ? result : []
                this.setState({
                    rows,
                    receivedRow: rows,
                    totalRows: result.length,
                    receivedLoading: false
                });
            }).catch(ex => {
                this.setState({
                    rows: [],
                    receivedRow: [],
                    receivedLoading: false
                });
                toast.error(Resources["operationCanceled"][currentLanguage]);
            });
        }

    };
    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedRow: selectedRows
        });
    };

    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }
    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }
    ConfirmDelete = () => {
        if (this.state.tabIndex == 0) {
            this.setState({ sendLoading: true })
            Api.post('CommunicationCorrespondenceSentMultipleDelete', this.state.selectedRow).then((res) => {
                let originalData = [...this.state.rows]
                this.state.selectedRow.forEach(item => {
                    let getIndex = originalData.findIndex(x => x.id === item.id);
                    originalData.splice(getIndex, 1);
                });
                this.setState({ rows: originalData, sendRows: originalData, showDeleteModal: false, sendLoading: false });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ showDeleteModal: false, sendLoading: false });
            })
        }
        else {
            this.setState({ receivedLoading: true })
            Api.post('CommunicationCorrespondenceReceivedMultipleDelete', this.state.selectedRow).then((res) => {
                let originalData = [...this.state.rows]
                this.state.selectedRow.forEach(item => {
                    let getIndex = originalData.findIndex(x => x.id === item.id);
                    originalData.splice(getIndex, 1);
                });
                this.setState({ rows: originalData, receivedRow: originalData, showDeleteModal: false, receivedLoading: false });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
                this.setState({ showDeleteModal: false, receivedLoading: false });
            })
        }



    }
    render() {
        const sendGrid = this.state.sendLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                gridKey="CorrRecievedSent"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={this.actions}
                rowActions={this.rowActions}
                cells={this.state.columns}
                rowClick={() => { }}
            />
        ) : <LoadingSection />;
        const receivedGrid = this.state.receivedLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                gridKey="CorrRecievedSent"
                data={this.state.rows}
                pageSize={this.state.pageSize}
                groups={[]}
                actions={this.actions}
                rowActions={this.rowActionList}
                cells={this.state.columns}
                rowClick={() => { }}
            />
        ) : <LoadingSection />;
        const sendExport = this.state.sendLoading === false ?
            <Export rows={this.state.sendLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
            : null;
        const receivedExport = this.state.receivedLoading === false ?
            <Export rows={this.state.receivedLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
            : null;
        const receivedFilter = this.state.receivedLoading === false ?
            <Filter
                filtersColumns={this.receivedFiltersColumns}
                apiFilter={this.state.apiFilter}
                filterMethod={this.filterMethodMain}
                key={this.state.docType}
            /> : null;
        const sendFilter = this.state.sendLoading === false ?
            <Filter
                filtersColumns={this.sendFiltersColumns}
                apiFilter={this.state.apiFilter}
                filterMethod={this.filterMethodMain}
                key={this.state.docType}
            /> : null;
        let step = <React.Fragment>
            <div className="mainContainer">
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero">{this.state.pageTitle}</h3>
                        <span>{this.state.rows.length}</span>
                        <div
                            className="ui labeled icon top right pointing dropdown fillter-button"
                            tabIndex="0"
                            onClick={() => this.hideFilter(this.state.viewfilter)}
                        >
                            <span>
                                <svg
                                    width="16px"
                                    height="18px"
                                    viewBox="0 0 16 18"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                    <g
                                        id="Symbols"
                                        stroke="none"
                                        strokeWidth="1"
                                        fill="none"
                                        fillRule="evenodd"
                                    >
                                        <g
                                            id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                            transform="translate(-4.000000, -3.000000)"
                                        >
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

                            {this.state.viewfilter === false
                                ? (
                                    <span className="text active">
                                        <span className="show-fillter">Show Fillter</span>
                                        <span className="hide-fillter">Hide Fillter</span>
                                    </span>
                                ) : (
                                    <span className="text">
                                        <span className="show-fillter">Show Fillter</span>
                                        <span className="hide-fillter">Hide Fillter</span>
                                    </span>
                                )}
                        </div>
                    </div>
                    <div className="filterBTNS">
                        {this.state.tabIndex == 0 ? sendExport : receivedExport}
                    </div>
                </div>
                <div
                    className="filterHidden"
                    style={{
                        maxHeight: this.state.viewfilter ? "" : "0px",
                        overflow: this.state.viewfilter ? "" : "hidden"
                    }}
                >
                    <div className="gridfillter-container">
                        {this.state.tabIndex == 0 ? sendFilter : receivedFilter}
                    </div>
                </div>
                <div>
                    <div className="minimizeRelative">
                        <div className={"grid-container " + (this.state.rows.length === 0 ? "griddata__load" : " ")}>
                            {this.state.tabIndex == 0 ? sendGrid : receivedGrid}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
        return (
            <div className="mainContainer main__fulldash">
                <div className="customeTabs">
                    <HeaderDocument projectName={this.props.projectName} docTitle={Resources.correspondence[currentLanguage]} moduleTitle={Resources['communication'][currentLanguage]} />
                    <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.onClickTabItem(tabIndex)}>
                        <TabList>
                            <Tab>
                                <span className="subUlTitle">
                                    {Resources["communicationCorrespondenceSent"][currentLanguage]}
                                </span>
                            </Tab>
                            <Tab>
                                <span className="subUlTitle">
                                    {Resources["communicationCorrespondenceReceived"][currentLanguage]}
                                </span>
                            </Tab>
                        </TabList>
                        <TabPanel>{step}</TabPanel>
                        <TabPanel>{step}</TabPanel>
                    </Tabs>
                </div>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources["smartDeleteMessageContent"][currentLanguage]}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null}
            </div>

        );
    }
}
function mapStateToProps(state, ownProps) {
    return {
        projectId: state.communication.projectId,
        projectName: state.communication.projectName
    }
}
export default connect(
    mapStateToProps
)(withRouter(corrRecievedSent))
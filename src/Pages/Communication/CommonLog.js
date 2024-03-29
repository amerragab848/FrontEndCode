import React, { Component, useRef, Fragment, createRef } from 'react';
import GridCustom from '../../Componants/Templates/Grid/CustomCommonLogGrid';
import Filter from '../../Componants/FilterComponent/filterComponent';
import Api from '../../api';
import dataservice from '../../Dataservice';
import Export from '../../Componants/OptionsPanels/Export';
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal';
import InventoryItemsModal from '../../Componants/publicComponants/InventoryItemsModal';
import documentDefenition from '../../documentDefenition.json';
import { withRouter } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import { toast } from 'react-toastify';
import Config from '../../Services/Config.js';
import ExportDetails from '../../Componants/OptionsPanels/ExportDetails';
import SendToWorkFlow from '../../Componants/OptionsPanels/SendWorkFlow';
import SkyLight from 'react-skylight';
import { Resources } from '../../Resources';
import { Bar } from 'react-chartjs-2';

import Loader from '../../../src/Styles/images/ChartLoaders/BarChartLoader.webm';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let documentObj = {};
let docTempLink;

let moduleId = Config.getPublicConfiguartion().commonLogApi;
const colorSchema = [
    '#39bd3d',
    '#ab50df',
    '#dfe2e6',
    '#39bdef',
    '#afe5ef',
    '#522e5f'
];
let options = {
    tooltips: {
        xPadding: 15,
        yPadding: 15,
        bodySpacing: 15,
        mode: 'nearest',
        intersect: false,
        axis: 'x',
        titleFontSize: 18,
        bodyFontSize: 16,
    },
    legend: {
        display: false,
    },
    animation: {
        duration: 1500,
    },
    responsive: true,
    maintainAspectRatio: true,
    scales: {
        yAxes: [
            {
                ticks: {
                    min: 0,
                },
            },
        ],
        xAxes: [
            {
                gridLines: {
                    display: false,
                },
            },
        ],
    },
    dataset: {
        barPercentage: 0.9,
    },
};
class CommonLog extends Component {

    constructor(props) {
        super(props);
        this.chartReference = React.createRef();

        this.state = {
            singleChartBtn: false,
            singleChartType: 'true',
            ExcelFileUploaded: false,
            groups: [],
            finalChosenCol: [],
            projectName: localStorage.getItem('lastSelectedprojectName'),
            isLoading: true,
            isExporting: false,
            pageTitle: '',
            viewfilter: false,
            filterMode: false,
            isFilter: false,
            projectId: this.props.projectId,
            documentName: props.match.params.document,
            filtersColumns: [],
            docType: '',
            rows: [],
            ColumnsHideShow: [],
            exportedColumns: [],
            chartColumns: [],
            totalRows: 0,
            columns: [],
            pageSize: 50,
            pageNumber: 0,
            apiFilter: '',
            api: '',
            apiDelete: '',
            query: '',
            isCustom: true,
            showDeleteModal: false,
            showWFModal: false,
            showExportModal: false,
            showInventoryItemsModal: false,
            inventoryItems: [],
            docTemplateModal: true,
            selectedRows: [],
            minimizeClick: false,
            showExServerBtn: false,
            documentObj: {},
            exportDocument: {},
            match: props.match,
            export: false,
            columnsExport: [],
            selectedcolumnsChart: [],
            inventoryImportAttachmentModal: false,
            showInventoryImportAttachBtn: false,
            showChart: false,
            chartContent: null,
            chartColumnsModal: false,
            showChartBtn: false,
            DocTemplateModalCom: null,
        };
        this.actions = [
            {
                title: 'Delete',
                handleClick: values => {
                    if (documentObj.docTyp == 64) {
                        let contractedBoq = [];
                        values.map(item => {
                            let boq = this.state.rows.find(x => x.id == item);
                            if (boq != undefined && boq.contractId > 0) {
                                contractedBoq.push(boq);
                            }
                        });
                        if (contractedBoq.length > 0) {
                            toast.error(
                                `these Boqs ${contractedBoq.map(
                                    item => item.subject,
                                )} Can not Deleted Because they are Contracted`,
                            );
                        } else {
                            this.setState({
                                showDeleteModal: true,
                                selectedRows: values,
                            });
                        }
                    } else {
                        this.setState({
                            showDeleteModal: true,
                            selectedRows: values,
                        });
                    }
                },
                classes: '',
            },
            {
                title: 'To Work Flow',

                handleClick: values => {
                    this.props.actions.showMultipleWFModal(true);
                    this.setState({
                        showWFModal: true,
                        selectedRows: values,
                    });
                },
                classes: 'toWorkFlow',
            }
        ];

        this.rowActions = [
            {
                title: 'Export Doc & Attachments',
                handleClick: value => {
                    let url =
                        this.state.documentObj.forEditApi +
                        '?id=' +
                        value.id +
                        '';
                    let documentObj = this.state.documentObj;
                    this.props.actions.documentForEdit(
                        url,
                        documentObj.docTyp,
                        documentObj.documentTitle,
                    );
                    this.props.actions.getAttachmentsAndWFCycles(
                        documentObj.docTyp,
                        value.id,
                        this.props.projectId,
                    );

                    this.setState({
                        showExportModal: true,
                    });
                },
            },
        ];
        this.inventoryRowActions = [
            {
                title: 'Transfer To Project',
                handleClick: value => {
                    if (
                        Config.IsAllow(
                            this.state.documentObj.documentAddPermission,
                        )
                    ) {
                        let obj = {
                            docId: value.id,
                            projectId: this.props.projectId,
                            projectName: this.state.projectName,
                            arrange: 0,
                            docApprovalId: 0,
                            isApproveMode: false,
                            isTransferAdd: true,
                            perviousRoute:
                                window.location.pathname +
                                window.location.search,
                        };

                        if (
                            this.state.documentObj.docTyp === 37 ||
                            this.state.documentObj.docTyp === 114
                        ) {
                            obj.isModification =
                                this.state.documentObj.docTyp === 114
                                    ? true
                                    : false;
                        }

                        let parms = CryptoJS.enc.Utf8.parse(
                            JSON.stringify(obj),
                        );

                        let encodedPaylod = CryptoJS.enc.Base64.stringify(
                            parms,
                        );

                        this.props.history.push({
                            pathname: '/TransferInventory',
                            search: '?id=' + encodedPaylod,
                        });
                    } else {
                        toast.warning(
                            Resources['missingPermissions'][currentLanguage],
                        );
                    }
                },
            },
            {
                title: 'Items',
                handleClick: value => {
                    let url =
                        'GetMaterialInventoryItems' + '?id=' + value.id + '';
                    this.props.actions.GetItemsInventory(url);
                    this.setState({
                        inventoryItems: this.props.inventoryItems,
                        showInventoryItemsModal: true,
                    });
                },
            },
        ];
        this.ClosxMX = this.ClosxMX.bind(this);
        this.filterMethodMain = this.filterMethodMain.bind(this);
        this.clickHandlerDeleteRowsMain = this.clickHandlerDeleteRowsMain.bind(
            this,
        );
    }

    componentDidMount() {
        this.props.actions.FillGridLeftMenu();
        this.renderComponent(this.state.documentName, this.props.projectId, !this.state.minimizeClick);
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();

        this.setState({
            isLoading: true,
            isCustom: true,
        });
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.match !== state.match) {
            return {
                isLoading: true,
                isCustom: true,
                documentName: nextProps.match.params.document,
                projectId: nextProps.projectId,
                match: nextProps.match,
            };
        }

        if (nextProps.projectId !== state.projectId) {
            return {
                isLoading: true,
                projectId: nextProps.projectId,
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.match !== this.props.match) {
            this.renderComponent(this.props.match.params.document, this.props.projectId, true);
        }

        if (this.props.document.id > 0) {
            this.ExportDetailsDialog.show();
        }

        if (this.props.projectId !== prevProps.projectId) {
            if (!this.state.documentObj.documentApi) {
                this.renderComponent(this.props.match.params.document, this.props.projectId, true);
            } else {
                this.GetRecordOfLog(this.state.isCustom === true ? this.state.documentObj.documentApi.getCustom : this.state.documentObj.documentApi.get, this.props.projectId);
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let shouldUpdate = this.state.isCustom !== nextProps.isCustom;
        return shouldUpdate;
    }

    hideFilter(e, value) {
        e.preventDefault();
        this.setState({ viewfilter: !this.state.viewfilter });
    }

    addRecord() {
        if (Config.IsAllow(this.state.documentObj.documentAddPermission)) {
            let addView = this.state.routeAddEdit;
            let obj = {
                docId: 0,
                projectId: this.props.projectId,
                projectName: this.state.projectName,
                arrange: 0,
                docApprovalId: 0,
                isApproveMode: false,
                perviousRoute:
                    window.location.pathname + window.location.search,
            };

            if (
                this.state.documentObj.docTyp === 37 ||
                this.state.documentObj.docTyp === 114
            ) {
                obj.isModification =
                    this.state.documentObj.docTyp === 114 ? true : false;
            }

            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

            this.props.history.push({
                //pathname: '/' + addView + '/' + 0 + '/' + this.props.projectId + '/0/0/false/' + this.state.projectName //,
                pathname: '/' + addView,
                search: '?id=' + encodedPaylod,
            });
        } else {
            toast.warning(Resources['missingPermissions'][currentLanguage]);
        }
    }

    editHandler(row) {
        if (Config.IsAllow(this.state.documentObj.documentEditPermission)) {
            let editView = this.state.routeAddEdit;

            let obj = {
                docId: row.id,
                projectId: row.projectId,
                projectName: this.state.projectName,
                arrange: 0,
                docApprovalId: 0,
                isApproveMode: false,
                perviousRoute:
                    window.location.pathname + window.location.search,
            };

            if (
                this.state.documentObj.docTyp === 37 ||
                this.state.documentObj.docTyp === 114
            ) {
                obj.isModification =
                    this.state.documentObj.docTyp === 114 ? true : false;
            }

            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
            ///:id/:projectId/:arrange/:docApprovalId/:isApproveMode/:projectName
            this.props.history.push({

                //pathname: '/' + editView + '/' + row.id + '/' + row.projectId + '/0/0/false/' + this.state.projectName + '/' + window.location.pathname + window.location.search
                pathname: '/' + editView,
                search: '?id=' + encodedPaylod,
            });
        } else {
            toast.warning(Resources['missingPermissions'][currentLanguage]);
        }
    }
    getImage() {
        let instance = this.state.singleChartBtn === true ?
            this.chartReference.current.chartReference.current.chartInstance :
            this.chartReference.current.chartInstance;

        const ctx = instance.toBase64Image();

        var a = document.createElement("a");
        a.href = ctx;
        a.download = "Image.png";
        a.click()
    }
    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;

        if (pageNumber >= 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber,
            });

            let url = (this.state.query == '' ? this.state.api : this.state.apiFilter) + '?projectId=' +
                this.state.projectId + '&pageNumber=' + pageNumber + '&pageSize=' + this.state.pageSize + (this.state.query == '' ? '' : '&query=' + this.state.query);

            Api.get(url, undefined, moduleId)
                .then(result => {
                    let oldRows = []; // this.state.rows;

                    const newRows = [...oldRows, ...result.data];

                    newRows.forEach(row => {
                        let subject = '';
                        if (row) {
                            let obj = {
                                docId: row.id,
                                projectId: row.projectId,
                                projectName: row.projectName,
                                arrange: 0,
                                docApprovalId: 0,
                                isApproveMode: false,
                                perviousRoute:
                                    window.location.pathname +
                                    window.location.search,
                            };
                            if (
                                documentObj.documentAddEditLink.replace(
                                    '/',
                                    '',
                                ) == 'addEditModificationDrawing'
                            ) {
                                obj.isModification = true;
                            }
                            let parms = CryptoJS.enc.Utf8.parse(
                                JSON.stringify(obj),
                            );

                            let encodedPaylod = CryptoJS.enc.Base64.stringify(
                                parms,
                            );

                            let doc_view =
                                '/' +
                                documentObj.documentAddEditLink.replace(
                                    '/',
                                    '',
                                ) +
                                '?id=' +
                                encodedPaylod;

                            subject = doc_view;
                        }
                        if (
                            Config.IsAllow(
                                this.state.documentObj.documentViewPermission,
                            ) ||
                            Config.IsAllow(
                                this.state.documentObj.documentEditPermission,
                            )
                        ) {
                            row.link = subject;
                        }
                    });
                    this.setState({
                        rows: newRows,
                        totalRows: result.total,
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

        let maxRows = this.state.totalRows;

        if (this.state.pageSize * this.state.pageNumber <= maxRows) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber,
            });

            let url = (this.state.query == '' ? this.state.api : this.state.apiFilter) + '?projectId=' + this.state.projectId + '&pageNumber=' + pageNumber + '&pageSize=' + this.state.pageSize + (this.state.query == '' ? '' : '&query=' + this.state.query);

            Api.get(url, undefined, moduleId).then(result => {
                let oldRows = [];

                const newRows = [...oldRows, ...result.data];

                newRows.forEach(row => {
                    let subject = '';
                    if (row) {
                        let obj = {
                            docId: row.id,
                            projectId: row.projectId,
                            projectName: row.projectName,
                            arrange: 0,
                            docApprovalId: 0,
                            isApproveMode: false,
                            perviousRoute:
                                window.location.pathname +
                                window.location.search,
                        };
                        if (documentObj.documentAddEditLink.replace('/', '',) == 'addEditModificationDrawing') { obj.isModification = true; }
                        let parms = CryptoJS.enc.Utf8.parse(
                            JSON.stringify(obj),
                        );

                        let encodedPaylod = CryptoJS.enc.Base64.stringify(
                            parms,
                        );

                        let doc_view = '/' + documentObj.documentAddEditLink.replace('/', '',) + '?id=' + encodedPaylod;

                        subject = doc_view;
                    }
                    if (Config.IsAllow(this.state.documentObj.documentViewPermission) || Config.IsAllow(this.state.documentObj.documentEditPermission)) {
                        row.link = subject;
                    }
                });

                this.setState({
                    rows: newRows,
                    totalRows: result.total,
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

    filterMethodMain = (event, query, apiFilter) => {
        var stringifiedQuery = encodeURIComponent(JSON.stringify(query));
        // var stringifiedQuery = JSON.stringify(query);
        if (stringifiedQuery == '{"isCustom":true}') {
            stringifiedQuery = undefined;
        }

        this.setState({
            isLoading: true,
            query: stringifiedQuery,
            filterMode: true,
        });

        if (stringifiedQuery !== '{}') {
            Api.get(apiFilter + '?projectId=' + this.state.projectId + '&pageNumber=' + this.state.pageNumber + '&pageSize=' + this.state.pageSize + '&query=' + stringifiedQuery, undefined, moduleId)
                .then(result => {
                    if (result.data.length > 0) {
                        result.data.forEach(row => {
                            let subject = '';
                            if (row) {
                                let obj = {
                                    docId: row.id,
                                    projectId: row.projectId,
                                    projectName: row.projectName,
                                    arrange: 0,
                                    docApprovalId: 0,
                                    isApproveMode: false,
                                    perviousRoute:
                                        window.location.pathname +
                                        window.location.search,
                                };
                                if (
                                    documentObj.documentAddEditLink.replace(
                                        '/',
                                        '',
                                    ) == 'addEditModificationDrawing'
                                ) {
                                    obj.isModification = true;
                                }
                                let parms = CryptoJS.enc.Utf8.parse(
                                    JSON.stringify(obj),
                                );

                                let encodedPaylod = CryptoJS.enc.Base64.stringify(
                                    parms,
                                );

                                let doc_view =
                                    '/' +
                                    documentObj.documentAddEditLink.replace(
                                        '/',
                                        '',
                                    ) +
                                    '?id=' +
                                    encodedPaylod;

                                subject = doc_view;
                            }
                            if (
                                Config.IsAllow(
                                    this.state.documentObj
                                        .documentViewPermission,
                                ) ||
                                Config.IsAllow(
                                    this.state.documentObj
                                        .documentEditPermission,
                                )
                            ) {
                                row.link = subject;
                            }
                        });

                        this.setState({
                            rows: result.data,
                            totalRows:
                                result.data != undefined ? result.total : 0,
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
            this.GetRecordOfLog(
                this.state.isCustom === true
                    ? documentObj.documentApi.getCustom
                    : documentObj.documentApi.get,
                this.state.projectId,
            );
        }
    };

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };
    onCloseWFModal = () => {
        this.props.actions.showMultipleWFModal(false);

        this.setState({ showWFModal: false });
    };

    onInventoryItemsCloseModal = () => {
        this.setState({ showInventoryItemsModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };
    clickHandlerCancelWFModal = () => {
        this.props.actions.showMultipleWFModal(false);

        this.setState({ showWFModal: false });
    };

    clickHandlerContinueMain = () => {
        this.setState({
            isLoading: true,
        });

        Api.post(this.state.apiDelete, this.state.selectedRows)
            .then(result => {
                let originalRows = this.state.rows;

                this.state.selectedRows.map(i => {
                    originalRows = originalRows.filter(r => r.id !== i);
                });

                this.setState({
                    rows: originalRows,
                    totalRows: originalRows.length,
                    isLoading: false,
                    showDeleteModal: false,
                });

                toast.success('operation complete sucessful');
            })
            .catch(ex => {
                this.setState({
                    isLoading: false,
                    showDeleteModal: false,
                });
            });
    };

    clickHandlerDeleteRowsMain = selectedRows => {
        if (Config.IsAllow(this.state.documentObj.documentDeletePermission)) {
            this.setState({
                showDeleteModal: true,
                selectedRows: selectedRows,
            });
        } else {
            toast.warning(Resources['missingPermissions'][currentLanguage]);
        }
    };

    renderComponent=(documentName, projectId, isCustom)=> {
        var projectId = projectId;
        var documents = documentName;

        documentObj = documentDefenition[documentName];
        if (documentObj) {
            if (documentObj.docTyp == 42) {
                docTempLink = Config.getPublicConfiguartion().downloads + '/Downloads/Excel/tempSubmittal.xlsx';
            }
            //else if .... for more documents
            else {
                docTempLink = Config.getPublicConfiguartion().downloads + '/Downloads/Excel/tempLetter.xlsx';
            }
            //added
            let docTypeId = documentObj.docTyp;
            let showExServerBtn = false;
            let showChartBtn = false;
            let showDocTemplateBtn = false;

            var cNames = [];
            var filtersColumns = [];
            var exportedColumns = [];
            var chartColumns = [];
            if (documentObj.documentColumns) {
                if (Config.IsAllow(this.state.documentObj.documentDeletePermission) &&
                    documentName !== 'paymentCertification'
                ) {
                    cNames.push({
                        title: '',
                        type: 'check-box',
                        fixed: true,
                        field: 'id',
                    });
                }

                documentObj.documentColumns.map((item, index) => {
                    var obj = {
                        field: item.field,
                        fixed: index < 3 ? true : false,
                        title: Resources[item.friendlyName][currentLanguage],
                        width: item.width.replace('%', ''),
                        sortable: true,
                        groupable: true,
                        type:
                            item.dataType === 'number'
                                ? item.dataType
                                : item.dataType === 'date'
                                    ? item.dataType
                                    : 'text',
                    };

                    if (item.field === 'subject' && (Config.IsAllow(documentObj.documentViewPermission) ||Config.IsAllow(documentObj.documentEditPermission))) {
                        obj.href = 'link';
                        obj.onClick = () => { };
                        obj.classes = 'bold';
                    }

                    if (item.field === 'description' && documentObj.docTyp == 50 && (Config.IsAllow(documentObj.documentViewPermission) ||Config.IsAllow(documentObj.documentEditPermission))) {
                        obj.href = 'link';
                        obj.onClick = () => { };
                        obj.classes = 'bold';
                    }
                    if (
                        item.field === 'statusName' ||
                        item.field === 'statusText'
                    ) {
                        obj.classes = 'grid-status';
                        obj.fixed = false;
                        obj.leftPadding = 17;
                    }

                    if (isCustom !== true) {
                        cNames.push(obj);
                        exportedColumns.push({
                            field: item.field,
                            title: Resources[item.friendlyName][currentLanguage],
                            selected: false,
                            showInExport: item.showInExport,
                        });
                        if (item.showInChart === true) {
                            chartColumns.push({
                                field: item.field,
                                title: Resources[item.friendlyName][currentLanguage],
                                selected: false,
                            })
                        }

                    } else {
                        if (item.isCustom === true) {
                            cNames.push(obj);
                            exportedColumns.push({
                                field: item.field,
                                title:
                                    Resources[item.friendlyName][currentLanguage],
                                selected: false,
                                showInExport: item.showInExport,
                            });
                        }
                        if (item.showInChart === true) {
                            chartColumns.push({
                                field: item.field,
                                title: Resources[item.friendlyName][currentLanguage],
                                selected: false,
                            })
                        }
                    }
                });

                let ColumnsHideShow = [...cNames];

                for (var i in ColumnsHideShow) {
                    ColumnsHideShow[i].hidden = false;
                }
                this.setState({
                    ColumnsHideShow: ColumnsHideShow,
                    exportedColumns: exportedColumns,
                    chartColumns: chartColumns
                });

                if (docTypeId == 19 || docTypeId == 42||docTypeId==23||docTypeId==28||docTypeId==29||docTypeId==25||docTypeId==103) {
                    showChartBtn = true;
                }

                if (
                    docTypeId == 19 ||
                    docTypeId == 23 ||
                    docTypeId == 42 ||
                    docTypeId == 28 ||
                    docTypeId == 103 ||
                    docTypeId == 25
                ) {
                    showExServerBtn = true;
                }

                if (docTypeId == 19 || docTypeId == 64 || docTypeId == 42 || docTypeId == 50) {
                    showDocTemplateBtn = true;
                } else {
                    showDocTemplateBtn = false;
                }

                filtersColumns = documentObj.filters;

                var selectedCols = JSON.parse(localStorage.getItem('CommonLog-' + this.state.documentName)) || [];
                var currentGP = [];
                if (selectedCols.length === 0) {
                    var gridLocalStor = { columnsList: [], groups: [] };
                    gridLocalStor.columnsList = JSON.stringify(cNames);
                    gridLocalStor.groups = JSON.stringify(currentGP);
                    localStorage.setItem('CommonLog-' + this.state.documentName, JSON.stringify(gridLocalStor));
                } else {
                    var parsingList = JSON.parse(selectedCols.columnsList);
                    for (var item in parsingList) {
                        for (var i in cNames) {
                            if (cNames[i].field === parsingList[item].field) {
                                let status = parsingList[item].hidden;
                                cNames[i].hidden = status;
                                cNames[i].width = parsingList[item].width;
                                break;
                            }
                        }
                    }
                    currentGP = JSON.parse(selectedCols.groups);
                }

            }
            this.setState({
                pageTitle: Resources[documentObj.documentTitle][currentLanguage],
                groups: currentGP,
                docType: documents,
                routeAddEdit: documentObj.documentAddEditLink,
                apiFilter: documentObj.filterApi,
                api: documentObj.documentApi.get,
                apiDelete: documentObj.documentApi.delete,
                columns: cNames,
                filtersColumns: filtersColumns,
                documentObj: documentObj,
                projectId: projectId,
                showExServerBtn,
                showDocTemplateBtn,
                showChartBtn
            });

            this.GetRecordOfLog(isCustom === true ? documentObj.documentApi.getCustom : documentObj.documentApi.get, projectId);

        }
    }

    GetRecordOfLog(api, projectId) {
        if (projectId !== 0) {
            let url = api + (documentObj.docTyp == 33 ? 'projectId=' + projectId : '?projectId=' + projectId) + '&pageNumber=' + this.state.pageNumber + '&pageSize=' + this.state.pageSize;
            this.GetLogData(url);
        } else {
            this.setState({ isLoading: false });
        }
    }

    clickMoreDetailsHandler = () => {
        this.addRecord();
    };

    GetLogData(url) {
        Api.get(url, undefined, moduleId)
            .then(result => {
                result.data.forEach(row => {
                    let subject = '';
                    if (row) {
                        let obj = {
                            docId: row.id,
                            projectId: row.projectId,
                            projectName: row.projectName,
                            arrange: 0,
                            docApprovalId: 0,
                            isApproveMode: false,
                            perviousRoute:
                                window.location.pathname +
                                window.location.search,
                        };
                        if (
                            documentObj.documentAddEditLink.replace('/', '') ==
                            'addEditModificationDrawing'
                        ) {
                            obj.isModification = true;
                        }
                        let parms = CryptoJS.enc.Utf8.parse(
                            JSON.stringify(obj),
                        );

                        let encodedPaylod = CryptoJS.enc.Base64.stringify(
                            parms,
                        );

                        let doc_view =
                            '/' +
                            documentObj.documentAddEditLink.replace('/', '') +
                            '?id=' +
                            encodedPaylod;

                        subject = doc_view;
                    }
                    if (
                        Config.IsAllow(
                            this.state.documentObj.documentViewPermission,
                        ) ||
                        Config.IsAllow(
                            this.state.documentObj.documentEditPermission,
                        )
                    ) {
                        row.link = subject;
                    }
                });
                this.setState({
                    rows: result.data,
                    totalRows: result.total,
                    isLoading: false,
                });
            })
            .catch(ex => {
                this.setState({ isLoading: false });
            });
    }

    handleMinimize = () => {
        const currentClass = this.state.minimizeClick;

        const isCustom = this.state.isCustom;

        this.setState({
            minimizeClick: !currentClass,
            isCustom: !isCustom,
            isLoading: true,
        });

        this.renderComponent(
            this.state.documentName,
            this.state.projectId,
            !this.state.isCustom,
        );
    };

    openModalColumn = () => {
        this.setState({ columnsModal: true });
    };

    closeModalColumn = () => {
        this.setState({
            showChart: false,
            finalChosenCol: [],
            columnsExport: [],
            selectedcolumnsChart: [],
            columnsModal: false,
            exportColumnsModal: false,
            docTemplateModal: false,
            chartColumnsModal: false,
            DocTemplateModalCom: null
        });
    };

    ResetShowHide = () => {
        this.setState({ Loading: true });
        let ColumnsHideShow = this.state.ColumnsHideShow;
        for (var i in ColumnsHideShow) {
            ColumnsHideShow[i].hidden = false;
            let key = ColumnsHideShow[i].field;
            this.setState({ [key]: false });
        }
        setTimeout(() => {
            this.setState({
                columns: ColumnsHideShow.filter(i => i.hidden === false),
                ColumnsHideShow: ColumnsHideShow.filter(
                    i => i.hidden === false,
                ),
                Loading: false,
                columnsModal: false,
            });
        }, 300);
    };

    changeChartType = (e) => {
        this.setState({ singleChartType: e.target.value, showChart: false });
        this.btnStatisticsServerClick();
    }
    handleCheck = key => {
        this.setState({ [key]: !this.state[key], isLoading: true });
        let data = this.state.ColumnsHideShow;
        for (var i in data) {
            if (data[i].field === key) {
                let status = data[i].hidden === true ? false : true;
                data[i].hidden = status;
                break;
            }
        }
        setTimeout(() => {
            this.setState({
                columns: data.filter(i => i.hidden === false),
                isLoading: false,
            });
        }, 300);


        /**************************update localStorege************************ */
        var selectedCols = { columnsList: [], groups: [] }
        selectedCols.columnsList = JSON.stringify(data)
        selectedCols.groups = "[]"
        localStorage.setItem('CommonLog-' + this.state.documentName, JSON.stringify(selectedCols))
        /*********************************************************** */
    };

    handleCheckForExport = key => {
        let data = this.state.exportedColumns;

        for (var i in data) {
            if (data[i].field === key) {
                let status = data[i].selected === true ? false : true;
                data[i].selected = status;
                break;
            }
        }

        let chosenColumns = data.filter(i => i.selected === true);

        var columnsExport = [];

        chosenColumns.forEach(function (d) {
            columnsExport.push({
                field: d.field,
                friendlyName: d.title,
            });
        });

        setTimeout(() => {
            this.setState({ columnsExport: columnsExport, Loading: false });
        }, 300);
    };

    handleCheckForChart = key => {
        let finalChosenCol = this.state.finalChosenCol.filter(i => i.field != key);
        let data = this.state.chartColumns;

        for (var i in data) {
            if (data[i].field === key) {
                let status = data[i].selected === true ? false : true;
                data[i].selected = status;
                if (status == true) { finalChosenCol.push(data[i]); }

                break;
            }
        }

        let chosenColumns = finalChosenCol;

        var selectedcolumnsChart = [];

        chosenColumns.forEach(function (d) {
            selectedcolumnsChart.push({
                field: d.field,
                isMain: "true",
                type: "string"
            });
        });

        setTimeout(() => {
            this.setState({ singleChartBtn: selectedcolumnsChart.length == 1 ? true : false, showChart: false, selectedcolumnsChart: selectedcolumnsChart, Loading: false, finalChosenCol });
        }, 300);
    };

    ClosxMX() {
        if (this.props != undefined) {
            this.props.actions.clearCashDocument();
        }

        this.setState({
            showExportModal: false,
            exportColumnsModal: false,
            docTemplateModal: false,
        });
    }

    btnDocumentTemplateShowModal = () => {
        import('./DocTemplateModal').then(module => {
            this.setState({ DocTemplateModalCom: module.default, docTemplateModal: true })
        });
    };

    btnExportServerShowModal = () => {
        let exportedColumns = this.state.exportedColumns;

        for (var i in exportedColumns) {
            exportedColumns[i].selected = false;
        }

        this.setState({
            exportColumnsModal: true,
            exportedColumns: exportedColumns,
        });
    };

    btnChartShowModal = () => {
        let chartColumns = this.state.chartColumns;

        for (var i in chartColumns) {
            chartColumns[i].selected = false;
        }

        this.setState({
            chartColumnsModal: true,
            chartColumns: chartColumns,
        });
    }
    btnExportServerClick = () => {
        let chosenColumns = this.state.columnsExport;
        if (chosenColumns.length < 3) {
            toast.warning("Can't Export With less than 3 Columns Choosen");
            this.setState({ exportColumnsModal: false });
        } else {
            this.setState({ isExporting: true });
            let docTypeId = this.state.documentObj.docTyp;
            let query = this.state.query;
            var stringifiedQuery = JSON.stringify(query);

            if (stringifiedQuery == '{"isCustom":true}') {
                stringifiedQuery = '{"isCustom":' + this.state.isCustom + '}';
            } else {
                stringifiedQuery =
                    '{"projectId":' +
                    this.state.projectId +
                    ',"isCustom":' +
                    this.state.isCustom +
                    '}';
            }

            let data = {};
            data.docType = docTypeId;
            data.query = stringifiedQuery;
            data.chosenColumns = chosenColumns;

            dataservice.addObjectCore('ExcelServerExport', data, 'POST').then(data => {
                if (data) {
                    data =
                        Config.getPublicConfiguartion().downloads +
                        '/' +
                        data;
                    var a = document.createElement('A');
                    a.href = data;
                    a.download = data.substr(data.lastIndexOf('/') + 1);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    this.setState({
                        exportColumnsModal: false,
                        isExporting: false,
                    });
                }
            });
        }
    };

    btnStatisticsServerClick = () => {
        let chosenColumns = this.state.selectedcolumnsChart;
        this.setState({ isExporting: true, showChart: false });
        let docTypeId = this.state.documentObj.docTyp;
        let query = this.state.query;
        var stringifiedQuery = JSON.stringify(query);
        if (stringifiedQuery == '{"isCustom":true}') {
            stringifiedQuery = '{"isCustom":' + this.state.isCustom + '}';
        } else {
            stringifiedQuery =
                '{"projectId":' +
                this.state.projectId +
                ',"isCustom":' +
                this.state.isCustom +
                '}';
        }
        let data = {};
        data.docType = docTypeId;
        data.query = stringifiedQuery;
        data.projectId = this.state.projectId;
        data.chosenColumns = chosenColumns;
        let columns = [];
        for (let i = 0; i < data.chosenColumns.length; i++) {
            let obj = { field: data.chosenColumns[i].field, isMain: true, type: 'string' }
            columns.push(obj);
        }

        data = {};
        data.docType = docTypeId;
        data.query = stringifiedQuery;
        data.projectId = this.state.projectId;
        data.columns = columns;

        if (chosenColumns.length > 1) {
            dataservice.addObjectCore('GetStatisticsData', data, 'POST').then(res => {
                let chartData = [];
                if (res && res.data.length > 0) {  // data is datatable
                    // modal to show chart based on this data !
                    this.setState({
                        isExporting: false,
                        showChart: true
                    })
                    res.data.map((obj, index) => {
                        (Object.assign(obj, { backgroundColor: index / 2 === 0 ? colorSchema[0] : colorSchema[index] }))
                    });
                    chartData.datasets = res.data;
                    chartData.labels = res.categories;

                    let Chart = (
                        <div className="panel">
                            <div className="panel-body">
                                <h2>{'Statistics Chart'}</h2>
                                <Bar
                                    key={'statistics'}
                                    data={chartData}
                                    options={options}
                                    ref={this.chartReference}
                                />
                            </div>
                        </div>)
                    this.setState({
                        //chartColumnsModal: false,
                        isExporting: false,
                        chartContent: Chart,
                        showChart: true,
                        selectedcolumnsChart: []
                    })
                }
                else {
                    this.setState({
                        exportColumnsModal: false,
                        isExporting: false,
                        selectedcolumnsChart: []
                    })
                    toast.warn('no data found !');
                };
            });
        } else {
            dataservice.addObjectCore('GetStatisticsData', data, 'POST').then(data => {
                if (data && data.length > 0) {  // data is datatable
                    // modal to show chart based on this data !

                    let BarChartCompJS = require('../../Componants/ChartsWidgets/BarChartCompJS').default;
                    let PieChartComp = require('../../Componants/ChartsWidgets/PieChartComp').default;

                    let Chart = (
                        this.state.singleChartType === 'true' ?
                            <BarChartCompJS
                                reports=""
                                rows={data != null ? data : {}}
                                categoryName={Object.keys(data[0])[0]}
                                ukey="wt-Name203"
                                title={Resources[Object.keys(data[0])[0]][currentLanguage]}
                                y="total"
                                ref={this.chartReference}
                            />
                            :
                            <PieChartComp
                                reports=""
                                showLegend={true}
                                rows={data}
                                name={Object.keys(data[0])[0]}
                                ukey="wt-Name204"
                                title={Resources[Object.keys(data[0])[0]][currentLanguage]}
                                y="total"
                                ref={this.chartReference}
                            />

                    )

                    //////////////////////////////////////////////////////
                    this.setState({
                        isExporting: false,
                        chartContent: Chart,
                        showChart: true
                    })
                }
                else {
                    this.setState({
                        exportColumnsModal: false,
                        isExporting: false
                    })
                    toast.warn('no data found !');
                }
            });
        }

    };

    btnExportStatisticsClick = () => {

        if (Config.getPublicConfiguartion().activeExport != true) {
            toast.warn('This feature is disabled. Please call your administrator for assistance');
            return;
        }

        let chosenColumns = this.state.columnsExport;
        if (chosenColumns.length > 2) {
            toast.warning("Can't Draw With more than 2 Columns Choosen");
        }
        else {
            this.setState({ isExporting: true });
            let query = this.state.query;
            var stringifiedQuery = JSON.stringify(query);

            if (stringifiedQuery == '{"isCustom":true}') {
                stringifiedQuery = '{"isCustom":' + this.state.isCustom + '}';
            } else {
                stringifiedQuery = '{"projectId":' + this.state.projectId + ',"isCustom":' + this.state.isCustom + '}'
            }

            let data = {};
            data.query = stringifiedQuery;
            data.columns = chosenColumns;
            data.projectId = this.state.projectId;

            dataservice.addObjectCore("GetStatisticSubmittalForProjectId", data, 'POST').then(data => {
                if (data) {
                    data = Config.getPublicConfiguartion().downloads + '/' + data;
                    var a = document.createElement('A');
                    a.href = data;
                    a.download = data.substr(data.lastIndexOf('/') + 1);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    this.setState({ exportColumnsModal: false, isExporting: false })
                }
            }).catch(e => {
                this.setState({ exportColumnsModal: false })
            });
        }
    }
    changeValueOfProps = () => {
        this.setState({ isFilter: false });
    };

    afterUpload = () => {
        this.setState({
            docTemplateModal: false
        });
        this.setState({ isLoading: true });
        this.GetRecordOfLog(this.state.isCustom === true ? this.state.documentObj.documentApi.getCustom : this.state.documentObj.documentApi.get, this.props.projectId);
    };

    handleChangeWidth = (key, newWidth) => {
        this.setState({ isLoading: true });

        let data = this.state.ColumnsHideShow;
        for (var i in data) {
            if (data[i].field === key) {
                data[i].width = newWidth.toString();
                break;
            }
        }
        setTimeout(() => {
            this.setState({
                columns: data.filter(i => i.hidden === false),
                isLoading: false,
            });
        }, 300);

        /**************************update localStorege************************ */
        var selectedCols = { columnsList: [], groups: [] }
        selectedCols.columnsList = JSON.stringify(data)
        selectedCols.groups = "[]"
        localStorage.setItem('CommonLog-' + this.state.documentName, JSON.stringify(selectedCols))
        /*********************************************************** */
    };

    timeLineBalls = (n, onClick, current, key) =>
        Array(n).fill(0).map((i, index) => (
            <div
                key={index}
                className={`timeline__ball ${current >= index ? "active" : null}`}
                onClick={() => onClick(key, (index + 1) * 12)} >
                {index + 1}
            </div>
        ));

    intermediaryBalls = 4;

    render() {
        let DocTemplateModalCom = this.state.DocTemplateModalCom
        let RenderPopupShowColumns = this.state.ColumnsHideShow.map((item, index) => {
            let container = (document.getElementById('grid__column--content').offsetWidth * 0.5) * 0.47 * 0.8
            let BallsWidth = container / 4
            let activeWidth = (item.width * container / BallsWidth) - BallsWidth
            let diff = (activeWidth / BallsWidth) * 4
            return item.field == 'id' ? null : (
                <div className="grid__content" key={item.field}>
                    <div
                        className={'ui checkbox checkBoxGray300 count checked'}>
                        <input
                            name="CheckBox"
                            type="checkbox"
                            id="allPermissionInput"
                            checked={!item.hidden}
                            onChange={e => this.handleCheck(item.field)}
                        />
                        <label>{item.title}</label>
                    </div>
                    <p className="rangeSlider">
                        <div className="timeline" id="timeline">
                            <div className="timeline__progress" style={{ width: `${activeWidth - (activeWidth > BallsWidth ? diff : 0)}px` }} />
                            {this.timeLineBalls(4, this.handleChangeWidth, (item.width / 12) - 1, item.field)}
                        </div>
                        <label className="rnageWidth">width</label>
                    </p>
                </div>
            );
        },
        );

        let RenderPopupShowExportColumns = this.state.exportedColumns.map(
            item => {
                return item.type === 'check-box' ||
                    item.field == 'id' ||
                    item.showInExport === false ? null : (
                        <div className="grid__content" key={item.field}>
                            <div
                                className={
                                    'ui checkbox checkBoxGray300 count checked'
                                }>
                                <input
                                    name="CheckBox"
                                    type="checkbox"
                                    id={'export_' + item.field}
                                    checked={item.selected}
                                    onChange={e =>
                                        this.handleCheckForExport(item.field)
                                    }
                                />
                                <label>{item.title}</label>
                            </div>
                        </div>
                    );
            },
        );
        /******************************************RenderPopupShowChartColumns**************************************** */
        let RenderPopupShowChartColumns = this.state.chartColumns.map(
            item => {
                return item.type === 'check-box' ||
                    item.field == 'id' ? null : (
                        <div className="grid__content" key={item.field}>
                            <div
                                className={
                                    'ui checkbox checkBoxGray300 count checked'
                                }>
                                <input
                                    name="CheckBox"
                                    type="checkbox"
                                    id={'export_' + item.field}
                                    checked={item.selected}
                                    onChange={e =>
                                        this.handleCheckForChart(item.field)
                                    }
                                />
                                <label>{item.title}</label>
                            </div>
                        </div>
                    );
            },
        );

        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                gridKey={'CommonLog-' + this.state.documentName}
                data={this.state.rows}
                actions={this.actions}
                rowActions={
                    this.state.documentObj.docTyp == 50
                        ? this.inventoryRowActions
                        : this.state.documentObj.forEditApi != undefined
                            ? this.rowActions
                            : null
                }
                cells={this.state.columns}
                openModalColumn={this.state.columnsModal}
                rowClick={cell => {
                    if (cell.id != 0) {
                        if (Config.IsAllow(this.state.documentObj.documentViewPermission) ||Config.IsAllow(this.state.documentObj.documentEditPermission)) {
                            let addView = this.state.routeAddEdit;

                            let columns = this.state.columns;

                            let rowData = columns.filter(
                                x => x.id == cell.id - 1,
                            ).key;

                            if (rowData !== 'subject') {
                                let obj = {
                                    docId: cell.id,
                                    projectId: this.state.projectId,
                                    projectName: this.state.projectName,
                                    arrange: 0,
                                    docApprovalId: 0,
                                    isApproveMode: false,
                                    perviousRoute:
                                        window.location.pathname +
                                        window.location.search,
                                };
                                if (
                                    documentObj.documentAddEditLink.replace(
                                        '/',
                                        '',
                                    ) == 'addEditModificationDrawing'
                                ) {
                                    obj.isModification = true;
                                } else {
                                    obj.isModification = false;
                                }
                                if (rowData === 'subject') {
                                    obj.onClick = () => { };
                                    obj.classes = 'bold';
                                }

                                if (
                                    this.state.documentObj.docTyp === 37 ||
                                    this.state.documentObj.docTyp === 114
                                ) {
                                    obj.isModification =
                                        this.state.documentObj.docTyp ===
                                            114
                                            ? true
                                            : false;
                                }

                                let parms = CryptoJS.enc.Utf8.parse(
                                    JSON.stringify(obj),
                                );

                                let encodedPaylod = CryptoJS.enc.Base64.stringify(
                                    parms,
                                );

                                this.props.history.push({

                                    //pathname: '/' + addView + '/' + cell.id + '/' + cell.projectId + '/0/0/false/' + this.state.projectName + '/' + window.location.pathname  
                                    pathname: '/' + addView,
                                    search: '?id=' + encodedPaylod,
                                });
                            }
                        } else {
                            toast.warning(
                                Resources['missingPermissions'][
                                currentLanguage
                                ],
                            );
                        }
                    }
                }}
                groups={this.state.groups}
                isFilter={this.state.isFilter}
                changeValueOfProps={this.changeValueOfProps.bind(this)}
                showCheckAll={true}
            />
        ) : (<LoadingSection />);

        const btnExport = this.state.export === false ? (
            <Export
                rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns}
                fileName={this.state.pageTitle}
            />
        ) : null;

        const btnExportServer =
            this.state.showExServerBtn == true ? (
                <button
                    className="primaryBtn-2 btn mediumBtn"
                    onClick={() => this.btnExportServerShowModal()}>
                    {Resources['exportAll'][currentLanguage]}
                </button>
            ) : null;
        const btnCharts =
            this.state.showChartBtn == true ? (
                <button
                    className="btn primaryBtn-2"
                    onClick={() => this.btnChartShowModal()}>
                    {Resources.chart[currentLanguage]}{' '}
                </button>
            ) : null;

        const btnDocumentTemplate =
            this.state.showDocTemplateBtn == true ? (
                <button
                    className="primaryBtn-2 btn mediumBtn"
                    onClick={() => this.btnDocumentTemplateShowModal()}>
                    {Resources['DocTemplate'][currentLanguage]}
                </button>
            ) : null;

        const ComponantFilter =
            this.state.isLoading === false ? (
                <Filter
                    filtersColumns={this.state.filtersColumns}
                    apiFilter={this.state.apiFilter}
                    filterMethod={this.filterMethodMain}
                    key={this.state.docType}
                />
            ) : null;

        return (
            <Fragment>
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
                        <div className="filterBTNS">
                            {btnExport}
                            {btnExportServer}
                            {btnDocumentTemplate}
                            {btnCharts}
                            {this.state.documentName !==
                                'paymentCertification' ? (
                                    <button
                                        className="primaryBtn-1 btn mediumBtn"
                                        onClick={() => this.addRecord()}>
                                        {Resources['new'][currentLanguage]}
                                    </button>
                                ) : null}
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
                                {
                                    Resources['jqxGridLanguagePagerrangestring'][currentLanguage]
                                }
                                <span> {this.state.totalRows}</span>
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
                        {this.state.showDeleteModal == true ? (
                            <ConfirmationModal
                                title={
                                    Resources["smartDeleteMessageContent"][currentLanguage]
                                }
                                buttonName="delete"
                                closed={this.onCloseModal}
                                showDeleteModal={this.state.showDeleteModal}
                                clickHandlerCancel={this.clickHandlerCancelMain}
                                clickHandlerContinue={
                                    this.clickHandlerContinueMain
                                }
                            />
                        ) : null}
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
                                {RenderPopupShowColumns}
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
                                {RenderPopupShowExportColumns}
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
                    {/********************************chart popup************************************* */}
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
                                    {RenderPopupShowChartColumns}
                                </div>
                                <div className="gridChart">

                                    {/***************************start charts******************************* */}
                                    {this.state.showChart == true ? (
                                        <div className="largePopup largeModal">
                                            <div className="filterBTNS">
                                                <button
                                                    className="btn primaryBtn-2"
                                                    onClick={() => this.getImage()}>
                                                    {Resources.export[currentLanguage]}{' '}
                                                </button>
                                            </div>
                                            <div id="chartDiv">
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
                                    ) : <div className="panel">
                                            <div className="panel-body-loader">
                                                <video style={{ width: '80%' }} autoPlay loop muted>
                                                    <source src={Loader} type="video/webm" />
                                                </video>
                                            </div>
                                        </div>}
                                    {/***************************charts******************************* */}
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
                    {/********************************chart popup************************************* */}

                </div>
                {/********************************docTemplateModal************************************* */}

                {DocTemplateModalCom != null && this.state.docTemplateModal == true ? (
                    <DocTemplateModalCom
                        docType={this.state.documentName}
                        projectId={this.state.projectId}
                        afterUpload={this.afterUpload}
                        onClose={this.closeModalColumn}
                    />
                ) : null}
                {/********************************end docTemplateModal************************************* */}

                {/***************************start export******************************* */}
                {this.props.document.id > 0 &&
                    this.state.showExportModal == true ? (
                        <div className="largePopup largeModal ">
                            <SkyLight
                                hideOnOverlayClicked
                                beforeClose={this.ClosxMX}
                                ref={ref => (this.ExportDetailsDialog = ref)}
                                title={'export'}>
                                <div>
                                    <ExportDetails
                                        docTypeId={this.state.documentObj.docTyp}
                                        document={this.state.exportDocument}
                                        documentName={
                                            this.state.documentObj.documentTitle
                                        }
                                    />
                                </div>
                            </SkyLight>
                        </div>
                    ) : null}
                {/***************************end export******************************* */}

                {/***************************start WF******************************* */}
                {this.props.ShowMultipleWF == true ? (
                    <div className={'grid__column largemodal active'}>
                        <div className="grid__column--container">
                            <button
                                className="closeColumn"
                                onClick={this.onCloseWFModal}>
                                X
                            </button>
                            <div className="grid__column--title">
                                <h2>{Resources.sendToWorkFlow[currentLanguage]}</h2>
                            </div>
                            <div className="grid__column--content">
                                <div className="grid__column--content-wrapper">

                                    <SendToWorkFlow
                                        isMultipleSelect={true}
                                        docId={this.state.selectedRows}
                                        docAlertId={0}
                                        approvalStatus={true}
                                        projectId={this.state.projectId}
                                        docApprovalId={0}
                                        currentArrange={0}
                                        docTypeId={this.state.documentObj.docTyp}
                                        documentName={
                                            this.state.documentObj.documentTitle
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>) : null}

                {/***************************end WF******************************* */}
                {
                    this.state.showInventoryItemsModal == true ? (
                        <div className="largePopup largeModal ">
                            <InventoryItemsModal
                                title={Resources['items'][currentLanguage]}
                                buttonName="MoreDetails"
                                inventoryItems={this.state.inventoryItems}
                                closed={this.onInventoryItemsCloseModal}
                                showInventoryItemsModal={
                                    this.state.showInventoryItemsModal
                                }
                                clickMoreDetailsHandler={
                                    this.clickMoreDetailsHandler
                                }
                            />
                        </div>
                    ) : null
                }


            </Fragment >
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        projectId: state.communication.projectId,
        showLeftMenu: state.communication.showLeftMenu,
        showSelectProject: state.communication.showSelectProject,
        projectName: state.communication.projectName,
        moduleName: state.communication.moduleName,
        document: state.communication.document,
        files: state.communication.files,
        workFlowCycles: state.communication.workFlowCycles,
        inventoryItems: state.communication.inventoryItems,
        ShowMultipleWF: state.communication.ShowMultipleWF, 
        isLoading: state.communication.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(CommonLog));

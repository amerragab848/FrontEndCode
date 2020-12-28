import React, { Component, Fragment } from 'react';
import GridCustom from '../../Componants/Templates/Grid/CustomCommonLogGrid';
import Filter from '../../Componants/FilterComponent/filterComponent';
import Api from '../../api';
import dataservice from '../../Dataservice';
import Export from '../../Componants/OptionsPanels/Export';
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous';
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal';
import InventoryItemsModal from '../../Componants/publicComponants/InventoryItemsModal';
import documentDefenition from '../../documentDefenition.json';
//import Resources from '../../resources.json';
import { withRouter } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import { toast } from 'react-toastify';
import Config from '../../Services/Config.js';
import ExportDetails from '../../Componants/OptionsPanels/ExportDetails';
import SkyLight from 'react-skylight';
import { SkyLightStateless } from 'react-skylight';
import XSLfile from '../../Componants/OptionsPanels/XSLfiel';
import CompanyDropdown from '../../Componants/publicComponants/CompanyDropdown';
import ContactDropdown from '../../Componants/publicComponants/ContactDropdown';
import { Slider } from 'react-semantic-ui-range';
import {Resources} from '../../Resources';

let currentLanguage =
    localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let documentObj = {};
let docTempLink;

let moduleId = Config.getPublicConfiguartion().commonLogApi; 
 
class CommonLog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ExcelFileUploaded: false,
            groups: [],
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
            showExportModal: false,
            showInventoryItemsModal: false,
            inventoryItems: [],
            docTemplateModal: false,
            selectedRows: [],
            minimizeClick: false,
            showExServerBtn: false,
            documentObj: {},
            exportDocument: {},
            match: props.match,
            export: false,
            columnsExport: [],
            companies: [],
            contacts: [],
            ToContacts: [],
            specsSection: [],
            reasonForIssue: [],
            disciplines: [],
            contracts: [],
            areas: [],
            locations: [],
            submittalType: [],
            approvales: [],
            selectedFromCompany: {
                label: Resources.ComapnyNameRequired[currentLanguage],
                value: '0',
            },
            selectedFromContact: {
                label: Resources.contactNameRequired[currentLanguage],
                value: '0',
            },
            selectedToCompany: {
                label: Resources.ComapnyNameRequired[currentLanguage],
                value: '0',
            },
            selectedToContact: {
                label: Resources.contactNameRequired[currentLanguage],
                value: '0',
            },
            selectedSpecsSection: {
                label: Resources.specsSectionSelection[currentLanguage],
                value: '0',
            },
            selectedDiscpline: {
                label: Resources.disciplineRequired[currentLanguage],
                value: '0',
            },
            selectedContract: {
                label: Resources.contractPoSelection[currentLanguage],
                value: '0',
            },
            selectedArea: {
                label: Resources.area[currentLanguage],
                value: '0',
            },
            selectedLocation: {
                label: Resources.locationRequired[currentLanguage],
                value: '0',
            },
            selectedSubmittalType: {
                label: Resources.submittalType[currentLanguage],
                value: '0',
            },
            selectedApprovalStatus: {
                label: Resources.approvalStatusSelection[currentLanguage],
                value: '0',
            },
            inventoryImportAttachmentModal: false,
            showInventoryImportAttachBtn: false,
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
        this.renderComponent(
            this.state.documentName,
            this.props.projectId,
            !this.state.minimizeClick,
        );
        this.fillDropDowns();
    }

    componentWillUnmount() {
        this.props.actions.clearCashDocument();

        this.setState({
            isLoading: true,
            isCustom: true,
        });
    }
    fillDropDowns() {
        if (this.state.docType == 'submittal') {
            dataservice
                .GetDataListCached(
                    'GetProjectProjectsCompaniesForList?projectId=' +
                        this.props.projectId,
                    'companyName',
                    'companyId',
                    'companies',
                    this.props.projectId,
                    'projectId',
                )
                .then(result => {
                    this.setState({
                        companies: [...result],
                    });
                });
            //discplines
            dataservice
                .GetDataListCached(
                    'GetaccountsDefaultListForList?listType=discipline',
                    'title',
                    'id',
                    'defaultLists',
                    'discipline',
                    'listType',
                )
                .then(result => {
                    this.setState({
                        disciplines: [...result],
                    });
                });

            //SubmittalTypes
            dataservice
                .GetDataListCached(
                    'GetaccountsDefaultListForList?listType=SubmittalTypes',
                    'title',
                    'id',
                    'defaultLists',
                    'SubmittalTypes',
                    'listType',
                )
                .then(result => {
                    this.setState({
                        SubmittalTypes: [...result],
                    });
                });

            //location
            dataservice
                .GetDataListCached(
                    'GetaccountsDefaultListForList?listType=location',
                    'title',
                    'id',
                    'defaultLists',
                    'location',
                    'listType',
                )
                .then(result => {
                    this.setState({
                        locations: [...result],
                    });
                });

            //area
            dataservice
                .GetDataListCached(
                    'GetaccountsDefaultListForList?listType=area',
                    'title',
                    'id',
                    'defaultLists',
                    'area',
                    'listType',
                )
                .then(result => {
                    this.setState({
                        areas: [...result],
                    });
                });

            //approvalstatus
            dataservice
                .GetDataListCached(
                    'GetaccountsDefaultListForList?listType=approvalstatus',
                    'title',
                    'id',
                    'defaultLists',
                    'approvalstatus',
                    'listType',
                )
                .then(result => {
                    this.setState({
                        approvales: [...result],
                    });
                });

            //specsSection
            dataservice
                .GetDataListCached(
                    'GetaccountsDefaultListForList?listType=specssection',
                    'title',
                    'id',
                    'defaultLists',
                    'specssection',
                    'listType',
                )
                .then(result => {
                    this.setState({
                        specsSection: [...result],
                    });
                });
            //contractList
            dataservice
                .GetDataList(
                    'GetPoContractForList?projectId=' + this.props.projectId,
                    'subject',
                    'id',
                )
                .then(result => {
                    this.setState({
                        contracts: [...result],
                    });
                });
        }
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
            this.renderComponent(
                this.props.match.params.document,
                this.props.projectId,
                true,
            );
        }

        if (this.props.document.id > 0) {
            this.ExportDetailsDialog.show();
        }

        if (this.props.projectId !== prevProps.projectId) {
            if (!this.state.documentObj.documentApi) {
                this.renderComponent(
                    this.props.match.params.document,
                    this.props.projectId,
                    true,
                );
            } else {
                this.GetRecordOfLog(
                    this.state.isCustom === true
                        ? this.state.documentObj.documentApi.getCustom
                        : this.state.documentObj.documentApi.get,
                    this.props.projectId,
                );
                this.fillDropDowns();
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

            this.props.history.push({
                pathname: '/' + editView,
                search: '?id=' + encodedPaylod,
            });
        } else {
            toast.warning(Resources['missingPermissions'][currentLanguage]);
        }
    }

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;

        if (pageNumber >= 0) {
            this.setState({
                isLoading: true,
                pageNumber: pageNumber,
            });

            let url =
                (this.state.query == ''
                    ? this.state.api
                    : this.state.apiFilter) +
                '?projectId=' +
                this.state.projectId +
                '&pageNumber=' +
                pageNumber +
                '&pageSize=' +
                this.state.pageSize +
                (this.state.query == '' ? '' : '&query=' + this.state.query);

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

            let url =
                (this.state.query == ''
                    ? this.state.api
                    : this.state.apiFilter) +
                '?projectId=' +
                this.state.projectId +
                '&pageNumber=' +
                pageNumber +
                '&pageSize=' +
                this.state.pageSize +
                (this.state.query == '' ? '' : '&query=' + this.state.query);

            Api.get(url, undefined, moduleId)
                .then(result => {
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

    filterMethodMain = (event, query, apiFilter) => {
        var stringifiedQuery = JSON.stringify(query);
        if (stringifiedQuery == '{"isCustom":true}') {
            stringifiedQuery = undefined;
        }

        this.setState({
            isLoading: true,
            query: stringifiedQuery,
            filterMode: true,
        });

        if (stringifiedQuery !== '{}') {
            Api.get(
                apiFilter +
                    '?projectId=' +
                    this.state.projectId +
                    '&pageNumber=' +
                    this.state.pageNumber +
                    '&pageSize=' +
                    this.state.pageSize +
                    '&query=' +
                    stringifiedQuery,
                undefined,
                moduleId,
            )
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
    onInventoryItemsCloseModal = () => {
        this.setState({ showInventoryItemsModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
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

    renderComponent(documentName, projectId, isCustom) {
        var projectId = projectId;
        var documents = documentName;
        console.log(documentDefenition);
        console.log(documentDefenition[documentName]);
        documentObj = documentDefenition[documentName];
        if (documentObj.docTyp == 42) {
            docTempLink =
                Config.getPublicConfiguartion().downloads +
                '/Downloads/Excel/tempSubmittal.xlsx';
        }
        //else if .... for more documents
        else {
            docTempLink =
                Config.getPublicConfiguartion().downloads +
                '/Downloads/Excel/tempLetter.xlsx';
        }

        //added
        let docTypeId = documentObj.docTyp;
        let showExServerBtn = false;
        let showDocTemplateBtn = false;

        var cNames = [];
        var filtersColumns = [];
        var exportedColumns = [];
        if (documentObj.documentColumns) {
            if (
                Config.IsAllow(
                    this.state.documentObj.documentDeletePermission,
                ) &&
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

                if (item.field === 'subject') {
                    obj.href = 'link';
                    obj.onClick = () => {};
                    obj.classes = 'bold';
                    obj.showTip = true;
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
                }
            });

            let ColumnsHideShow = [...cNames];

            for (var i in ColumnsHideShow) {
                ColumnsHideShow[i].hidden = false;
            }
/*

*/
            this.setState({
                ColumnsHideShow: ColumnsHideShow,
                exportedColumns: exportedColumns,
            });
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

        if (docTypeId == 19 || docTypeId == 64 || docTypeId == 42) {
            showDocTemplateBtn = true;
        } else {
            showDocTemplateBtn = false;
        }
        if (docTypeId == 50) {
            this.setState({ showInventoryImportAttachBtn: true });
        } else {
            this.setState({ showInventoryImportAttachBtn: false });
        }

        filtersColumns = documentObj.filters;

        var selectedCols =
            JSON.parse(
                localStorage.getItem('CommonLog-' + this.state.documentName),
            ) || [];
        var currentGP = [];
        if (selectedCols.length === 0) {
            var gridLocalStor = { columnsList: [], groups: [] };
            gridLocalStor.columnsList = JSON.stringify(cNames);
            gridLocalStor.groups = JSON.stringify(currentGP);
            localStorage.setItem(
                'CommonLog-' + this.state.documentName,
                JSON.stringify(gridLocalStor),
            );
        } else {
            var parsingList = JSON.parse(selectedCols.columnsList);
            for (var item in parsingList) {
                for (var i in cNames) {
                    if (cNames[i].field === parsingList[item].field) {
                        let status = parsingList[item].hidden;
                        cNames[i].hidden = status;
                        cNames[i].width=parsingList[item].width;
                        break;
                    }
                }
            }
            currentGP = JSON.parse(selectedCols.groups);
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
        });

        this.GetRecordOfLog(
            isCustom === true
                ? documentObj.documentApi.getCustom
                : documentObj.documentApi.get,
            projectId,
        );
    }

    GetRecordOfLog(api, projectId) {
        if (projectId !== 0) {
            let url =
                api +
                (documentObj.docTyp == 33
                    ? 'projectId=' + projectId
                    : '?projectId=' + projectId) +
                '&pageNumber=' +
                this.state.pageNumber +
                '&pageSize=' +
                this.state.pageSize;
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
            columnsModal: false,
            exportColumnsModal: false,
            docTemplateModal: false,
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
         var selectedCols ={columnsList:[],groups:[]}
        selectedCols.columnsList=JSON.stringify(data)
        selectedCols.groups="[]"
       localStorage.setItem('CommonLog-' + this.state.documentName,JSON.stringify(selectedCols))
         /*********************************************************** */
    };

    handleChangeWidth = (key, newWidth) => {
        console.log('handleChangeWidth...', key, newWidth);
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
         var selectedCols ={columnsList:[],groups:[]}
         selectedCols.columnsList=JSON.stringify(data)
         selectedCols.groups="[]"
        localStorage.setItem('CommonLog-' + this.state.documentName,JSON.stringify(selectedCols))
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

        chosenColumns.forEach(function(d) {
            columnsExport.push({
                field: d.field,
                friendlyName: d.title,
            });
        });

        setTimeout(() => {
            this.setState({ columnsExport: columnsExport, Loading: false });
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
        this.setState({
            docTemplateModal: true,
        });
    };
    btnInventoryImportAttachShowModal = () => {
        this.setState({
            inventoryImportAttachmentModal: true,
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

            dataservice
                .addObjectCore('ExcelServerExport', data, 'POST')
                .then(data => {
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

    changeValueOfProps = () => {
        this.setState({ isFilter: false });
    };

    handleChangeDropDown(
        event,
        field,
        isSubscrib,
        targetState,
        url,
        param,
        selectedValue,
        subDatasource,
    ) {
        if (event == null) return;
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document,
            [selectedValue]: event,
        });

        if (isSubscrib) {
            let action = url + '?' + param + '=' + event.value;
            dataservice
                .GetDataList(action, 'contactName', 'id')
                .then(result => {
                    this.setState({
                        [targetState]: result,
                    });
                });
        }
    }
    handleChangeDropDownCycles(
        event,
        field,
        isSubscrib,
        targetState,
        url,
        param,
        selectedValue,
        subDatasource,
    ) {
        if (event == null) return;

        let original_document = { ...this.state.documentCycle };

        let updated_document = {};

        updated_document[field] = event.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            documentCycle: updated_document,
            [selectedValue]: event,
        });
    }

    render() {
        const settings = {
            start: 2,
            min: 0,
            max: 10,
            step: 1,
            onChange: e => {
                console.log(e);
            },
        };
        let RenderPopupShowColumns = this.state.ColumnsHideShow.map(
            (item, index) => {
                return item.field == 'id' ? null : (
                    <div className="grid__content" key={item.field}>
                        <div
                            className={
                                'ui checkbox checkBoxGray300 count checked'
                            }>
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
                            <Slider
                                key={item.field}
                                discrete
                                color="blue"
                                inverted={false}
                                settings={{
                                    start: parseInt(item.width),
                                    min: 5,
                                    max: 50,
                                    step: 1,
                                    onChange: e => {
                                        this.handleChangeWidth(item.field, e);
                                    },
                                }}
                            />
                            <label className="rangeLabel" color="red">
                                Width: {item.width} px
                            </label>
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

        const dataGrid =
            this.state.isLoading === false ? (
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
                                        obj.onClick = () => {};
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
                    showCheckAll={true}
                    changeValueOfProps={this.changeValueOfProps.bind(this)}
                />
            ) : (
                <LoadingSection />
            );

        const btnExport =
            this.state.export === false ? (
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

        const btnDocumentTemplate =
            this.state.showDocTemplateBtn == true ? (
                <button
                    className="primaryBtn-2 btn mediumBtn"
                    onClick={() => this.btnDocumentTemplateShowModal()}>
                    {Resources['DocTemplate'][currentLanguage]}
                </button>
            ) : null;
        const btnInventoryImportAttach =
            this.state.showInventoryImportAttachBtn == true ? (
                <button
                    className="primaryBtn-2 btn mediumBtn"
                    onClick={() => this.btnInventoryImportAttachShowModal()}>
                    {Resources['uploadAttach'][currentLanguage]}
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
                            {btnInventoryImportAttach}

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
                            <div className="grid__column--content">
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
                                    <button
                                        className="btn primaryBtn-2"
                                        onClick={this.btnExportServerClick}>
                                        {Resources.export[currentLanguage]}{' '}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.docTemplateModal == true ? (
                    <div className="largePopup largeModal ">
                        <SkyLightStateless
                            onOverlayClicked={() =>
                                this.setState({ docTemplateModal: false })
                            }
                            title={Resources['DocTemplate'][currentLanguage]}
                            onCloseClicked={() =>
                                this.setState({ docTemplateModal: false })
                            }
                            isVisible={this.state.docTemplateModal}>
                            <div className="proForm datepickerContainer customLayout">
                                <div className="linebylineInput valid-input mix_dropdown">
                                    <label className="control-label">
                                        {Resources.fromCompany[currentLanguage]}
                                    </label>
                                    <div className="supervisor__company">
                                        <div className="super_name">
                                            <Dropdown
                                                //title={"fromCompany"}
                                                data={this.state.companies}
                                                isMulti={false}
                                                selectedValue={
                                                    this.state
                                                        .selectedFromCompany
                                                }
                                                handleChange={event => {
                                                    this.handleChangeDropDown(
                                                        event,
                                                        'companyId',
                                                        true,
                                                        'contacts',
                                                        'GetContactsByCompanyId',
                                                        'companyId',
                                                        'selectedFromCompany',
                                                        'selectedFromContact',
                                                    );
                                                }}
                                                index="companyId"
                                                name="companyId"
                                                id=" companyId"
                                                styles={CompanyDropdown}
                                                classDrop="companyName1"
                                            />
                                        </div>
                                        <div className="super_company">
                                            <Dropdown
                                                isMulti={false}
                                                data={this.state.contacts}
                                                selectedValue={
                                                    this.state
                                                        .selectedFromContact
                                                }
                                                handleChange={event =>
                                                    this.handleChangeDropDown(
                                                        event,
                                                        'contactId',
                                                        false,
                                                        '',
                                                        '',
                                                        '',
                                                        'selectedFromContact',
                                                    )
                                                }
                                                index="contactId"
                                                name="contactId"
                                                id="contactId"
                                                classDrop="contactName1"
                                                styles={ContactDropdown}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="linebylineInput valid-input mix_dropdown">
                                    <label className="control-label">
                                        {Resources.toCompany[currentLanguage]}
                                    </label>
                                    <div className="supervisor__company">
                                        <div className="super_name">
                                            <Dropdown
                                                isMulti={false}
                                                data={this.state.companies}
                                                selectedValue={
                                                    this.state.selectedToCompany
                                                }
                                                handleChange={event =>
                                                    this.handleChangeDropDown(
                                                        event,
                                                        'toCompanyId',
                                                        true,
                                                        'ToContacts',
                                                        'GetContactsByCompanyId',
                                                        'companyId',
                                                        'selectedToCompany',
                                                        'selectedToContact',
                                                    )
                                                }
                                                index="letter-toCompany"
                                                name="toCompanyId"
                                                id="toCompanyId"
                                                styles={CompanyDropdown}
                                                classDrop="companyName1"
                                            />
                                        </div>
                                        <div className="super_company">
                                            <Dropdown
                                                isMulti={false}
                                                data={this.state.ToContacts}
                                                selectedValue={
                                                    this.state.selectedToContact
                                                }
                                                handleChange={event =>
                                                    this.handleChangeDropDown(
                                                        event,
                                                        'toContactId',
                                                        false,
                                                        '',
                                                        '',
                                                        '',
                                                        'selectedToContact',
                                                    )
                                                }
                                                index="letter-toContactId"
                                                name="toContactId"
                                                id="toContactId"
                                                classDrop="contactName1"
                                                styles={ContactDropdown}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {Config.getPayload().uty == 'company' ? (
                                    this.state.docType == 'submittal' ? (
                                        <Fragment>
                                            <div className="dropdownFullWidthContainer">
                                                <div className="linebylineInput valid-input dropdownFullWidth">
                                                    <Dropdown
                                                        title="disciplineTitle"
                                                        data={
                                                            this.state
                                                                .disciplines
                                                        }
                                                        isMulti={false}
                                                        selectedValue={
                                                            this.state
                                                                .selectedDiscpline
                                                        }
                                                        handleChange={event =>
                                                            this.handleChangeDropDown(
                                                                event,
                                                                'disciplineId',
                                                                false,
                                                                '',
                                                                '',
                                                                '',
                                                                'selectedDiscpline',
                                                            )
                                                        }
                                                        name="disciplineId"
                                                        id="disciplineId"
                                                    />
                                                </div>
                                                <div className="linebylineInput valid-input dropdownFullWidth">
                                                    <Dropdown
                                                        title="specsSection"
                                                        data={
                                                            this.state
                                                                .specsSection
                                                        }
                                                        isMulti={false}
                                                        selectedValue={
                                                            this.state
                                                                .selectedSpecsSection
                                                        }
                                                        handleChange={event =>
                                                            this.handleChangeDropDown(
                                                                event,
                                                                'specsSectionId',
                                                                false,
                                                                '',
                                                                '',
                                                                '',
                                                                'selectedSpecsSection',
                                                            )
                                                        }
                                                        name="specsSectionId"
                                                        id="specsSectionId"
                                                    />
                                                </div>
                                            </div>
                                            <div className="dropdownFullWidthContainer">
                                                <div className="linebylineInput valid-input dropdownFullWidth">
                                                    <Dropdown
                                                        title="submittalType"
                                                        data={
                                                            this.state
                                                                .SubmittalTypes
                                                        }
                                                        selectedValue={
                                                            this.state
                                                                .selectedSubmittalType
                                                        }
                                                        handleChange={event =>
                                                            this.handleChangeDropDown(
                                                                event,
                                                                'submittalTypeId',
                                                                false,
                                                                '',
                                                                '',
                                                                '',
                                                                'selectedSubmittalType',
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="linebylineInput valid-input  dropdownFullWidth">
                                                    <Dropdown
                                                        title="area"
                                                        data={this.state.areas}
                                                        selectedValue={
                                                            this.state
                                                                .selectedArea
                                                        }
                                                        handleChange={event =>
                                                            this.handleChangeDropDown(
                                                                event,
                                                                'area',
                                                                false,
                                                                '',
                                                                '',
                                                                '',
                                                                'selectedArea',
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="dropdownFullWidthContainer">
                                                <div className="linebylineInput valid-input dropdownFullWidth">
                                                    <Dropdown
                                                        title="location"
                                                        data={
                                                            this.state.locations
                                                        }
                                                        selectedValue={
                                                            this.state
                                                                .selectedLocation
                                                        }
                                                        handleChange={event =>
                                                            this.handleChangeDropDown(
                                                                event,
                                                                'location',
                                                                false,
                                                                '',
                                                                '',
                                                                '',
                                                                'selectedLocation',
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="linebylineInput valid-input dropdownFullWidth">
                                                    <Dropdown
                                                        title="contractPo"
                                                        isMulti={false}
                                                        data={
                                                            this.state.contracts
                                                        }
                                                        selectedValue={
                                                            this.state
                                                                .selectedContract
                                                        }
                                                        handleChange={event =>
                                                            this.handleChangeDropDown(
                                                                event,
                                                                'contractId',
                                                                false,
                                                                '',
                                                                '',
                                                                '',
                                                                'selectedContract',
                                                            )
                                                        }
                                                        name="contractId"
                                                        id="contractId"
                                                        index="contractId"
                                                    />
                                                </div>
                                            </div>
                                            <div className="dropdownFullWidthContainer">
                                                <div className="linebylineInput valid-input dropdownFullWidth">
                                                    <Dropdown
                                                        title="approvalStatus"
                                                        isMulti={false}
                                                        data={
                                                            this.state
                                                                .approvales
                                                        }
                                                        selectedValue={
                                                            this.state
                                                                .selectedApprovalStatus
                                                        }
                                                        handleChange={event =>
                                                            this.handleChangeDropDownCycles(
                                                                event,
                                                                'approvalStatusId',
                                                                false,
                                                                '',
                                                                '',
                                                                '',
                                                                'selectedApprovalStatus',
                                                            )
                                                        }
                                                        name="approvalStatusId"
                                                        id="approvalStatusId"
                                                        index="approvalStatusId"
                                                    />
                                                </div>
                                            </div>
                                        </Fragment>
                                    ) : null
                                ) : null}

                                <XSLfile
                                    key="docTemplate"
                                    projectId={this.state.projectId}
                                    companyId={
                                        this.state.document != null
                                            ? this.state.document.companyId
                                            : null
                                    }
                                    contactId={
                                        this.state.document != null
                                            ? this.state.document.contactId
                                            : null
                                    }
                                    toCompanyId={
                                        this.state.document != null
                                            ? this.state.document.toCompanyId
                                            : null
                                    }
                                    toContactId={
                                        this.state.document != null
                                            ? this.state.document.toContactId
                                            : null
                                    }
                                    disciplineId={
                                        this.state.document != null
                                            ? this.state.document.disciplineId
                                            : null
                                    }
                                    specsSectionId={
                                        this.state.document != null
                                            ? this.state.document.specsSectionId
                                            : null
                                    }
                                    submittalTypeId={
                                        this.state.document != null
                                            ? this.state.document
                                                  .submittalTypeId
                                            : null
                                    }
                                    area={
                                        this.state.document != null
                                            ? this.state.selectedArea.label
                                            : null
                                    }
                                    location={
                                        this.state.document != null
                                            ? this.state.selectedLocation.label
                                            : null
                                    }
                                    contractId={
                                        this.state.document != null
                                            ? this.state.document.contractId
                                            : null
                                    }
                                    approvalStatusId={
                                        this.state.documentCycle != null
                                            ? this.state.documentCycle
                                                  .approvalStatusId
                                            : null
                                    }
                                    docType={this.state.docType}
                                    documentTemplate={true}
                                    link={docTempLink}
                                    header="addManyItems"
                                    afterUpload={() => {
                                        this.setState({
                                            docTemplateModal: false,
                                        });
                                        this.setState({ isLoading: true });
                                        this.GetRecordOfLog(
                                            this.state.isCustom === true
                                                ? this.state.documentObj
                                                      .documentApi.getCustom
                                                : this.state.documentObj
                                                      .documentApi.get,
                                            this.props.projectId,
                                        );
                                    }}
                                />
                            </div>
                        </SkyLightStateless>
                    </div>
                ) : null}

                {/* Material Inventory Import Section  Ahmed Yousry */}
                {this.state.inventoryImportAttachmentModal == true ? (
                    <div className="largePopup largeModal ">
                        <SkyLightStateless
                            onOverlayClicked={() =>
                                this.setState({
                                    inventoryImportAttachmentModal: false,
                                })
                            }
                            title={Resources['DocTemplate'][currentLanguage]}
                            onCloseClicked={() =>
                                this.setState({
                                    inventoryImportAttachmentModal: false,
                                })
                            }
                            isVisible={
                                this.state.inventoryImportAttachmentModal
                            }>
                            <div>
                                <XSLfile
                                    key="MaterialInventory"
                                    docId={this.props.projectId}
                                    docType={'inventory'}
                                    link={
                                        Config.getPublicConfiguartion()
                                            .downloads +
                                        '/downloads/excel/inventory.xlsx'
                                    }
                                    header="addManyItems"
                                    afterUpload={() =>
                                        this.setState({
                                            inventoryImportAttachmentModal: false,
                                        })
                                    }
                                />
                            </div>
                        </SkyLightStateless>
                    </div>
                ) : null}
                {/* End Material Inventory Import Section  Ahmed Yousry  */}

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
                {this.state.showInventoryItemsModal == true ? (
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
                ) : null}
            </Fragment>
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

import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../publicComponants/LoadingSection";
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import GridCustom from "../../Templates/Grid/CustomGrid";
import Export from "../../OptionsPanels/Export";
import { SkyLightStateless } from 'react-skylight';
import Select from '../../OptionsPanels/DropdownMelcous';
import { Formik, Form } from 'formik';
import config from "../../../Services/Config";
import * as Yup from 'yup';
import { toast } from "react-toastify";
import dataservice from "../../../Dataservice";
import Resources from "../../../resources.json";
import Api from '../../../api';
import Dropdown from "../../OptionsPanels/DropdownMelcous";
import ReactTable from 'react-table';


let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
var ar = new RegExp("^[\u0621-\u064A\u0660-\u0669 ]+$");
var en = new RegExp("\[\\u0600\-\\u06ff\]\|\[\\u0750\-\\u077f\]\|\[\\ufb50\-\\ufc3f\]\|\[\\ufe70\-\\ufefc\]");

const find = require('lodash/find');

const ValidtionSchemaItems = Yup.object().shape({
    descriptionAr: Yup.string().test('contactNameAr', 'Name cannot be english', value => {
        return ar.test(value)
    }).required(Resources['descriptionAr'][currentLanguage]),
    descriptionEn: Yup.string().test('titleEnCompany', 'Name cannot be arabic', value => {
        return !en.test(value);
    }).required(Resources['descriptionEn'][currentLanguage]),
    dwgNo: Yup.number().required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
});
const ValidtionSchema = Yup.object().shape({
    abbreviation: Yup.string().required(Resources['isRequiredField'][currentLanguage]).max(50, Resources['maxLength'][currentLanguage] + " (50)"),
    titleAr: Yup.string().test('contactNameAr', 'Name cannot be english', value => {
        return ar.test(value)
    }).required(Resources['titleArValid'][currentLanguage]),
    titleEn: Yup.string().test('titleEnCompany', 'Name cannot be arabic', value => {
        return !en.test(value);
    }).required(Resources['titleEnValid'][currentLanguage])
});
class DesignDiscipline extends Component {

    constructor(props) {

        super(props)

        this.columnsGrid = [
            { title: '', type: 'check-box', fixed: true, field: 'id' },
            {
                field: "title",
                title: Resources["title"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 25,
                sortable: true,
                type: "text"
            },
            {
                field: "abbreviation",
                title: Resources["abbreviation"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 25,
                sortable: true,
                type: "text"
            }
        ];

        this.groups = [];

        this.rowActions = [
            {
                title: Resources['addItems'][currentLanguage],
                handleClick: value => {
                    Api.get('GetDesignDicplineSectionsWithoutPagging?sectionId=' + value.id).then(
                        res => {
                            this.setState({
                                disciplineId: value.id,
                                isLoading: false,
                                ShowItemPopup: true,
                                disciplineItems: res,
                                loadingItemsTable: true
                            });
                        }
                    )
                }
            }
        ]

        this.actions = [
            {
                title: 'Delete',
                handleClick: selectedRows => {
                    console.log(selectedRows);
                    this.setState({
                        showDeleteModal: true,
                        selectedRow: selectedRows[0],
                        selectedRows: selectedRows
                    })
                },
                classes: '',
            }
        ];

        this.state = {
            columns: this.columnsGrid,
            isLoading: true,
            rows: [],
            selectedRows: [],
            selectedRowsItems: [],
            totalRows: 0,
            pageSize: 50,
            pageNumber: 0, 
            showCheckbox: false,
            showDeleteModal: false,
            ShowPopup: false,
            ShowItemPopup: false,
            EditListData: {},
            EditItemListData: {},
            IsEdit: false,
            IsEditItem: false,
            selectedrow: '',
            selectedItemRow: '',
            loadingItemsTable:false,
            showNotify: false,
            api: 'GetDesignDiscipline?',
            approvalStatusTypeId: 0,
            selectedApprovalStatus: { label: Resources.approvalStatusSelection[currentLanguage], value: "0" },
        }

        if (!config.IsAllow(1182) && !config.IsAllow(1180) && !config.IsAllow(1179)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.goBack();
        }
    }

    GetNextData() {
        let pageNumber = this.state.pageNumber + 1;
        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        let url = this.state.api + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
        Api.get(url).then(result => {
            let oldRows = this.state.rows;
            const newRows = [...oldRows, ...result]; // arr3 ==> [1,2,3,3,4,5]
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
    };

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;
        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        let url = this.state.api + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
        Api.get(url).then(result => {
            let oldRows = [];// this.state.rows;
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
    };

    componentDidMount = () => {
        if (config.IsAllow(3340)) {
            this.setState({ showCheckbox: true });
        }
        if (config.IsAllow(1181)) {
            Api.get(this.state.api + '&pageNumber=' + this.state.pageNumber + '&pageSize=' + this.state.pageSize + '').then(
                res => {

                    this.setState({
                        rows: res,
                        isLoading: false
                    })
                }
            )
        }
    };

    ConfirmDelete = () => {
        this.setState({
            isLoading: true
        })
        Api.post('designdicplineEntityDelete?id=' + this.state.selectedRow).then(res => {
            let originalRows = this.state.rows

            this.state.selectedRows.map(i => {
                originalRows = originalRows.filter(r => r.id !== i);
            })

            this.setState({
                rows: originalRows,
                showDeleteModal: false,
                isLoading: false,
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        })
    };
    showDeleteITemsModal = (selectedRowsItems) => {
        if (this.state.showCheckbox) {
            this.setState({ selectedItemRow: selectedRowsItems, showDeleteItemModal: true });
        }
        else {
            this.setState({ showDeleteItemModal: false });
            toast.warn(Resources["missingPermissions"][currentLanguage]);
        }
    }
    clickHandlerDeleteRowsITems = (selectedItemRow) => {
        this.setState({
            isLoading: true,
            loadingItemsTable:false
        })
        Api.post('DesignDicplineSectionsDelete?id=' + this.state.selectedItemRow).then(res => {
            let originalRows = this.state.disciplineItems

            originalRows = originalRows.filter(r => r.id !== this.state.selectedItemRow);
            this.setState({
                disciplineItems: originalRows,
                showDeleteItemModal: false,
                isLoading: false,
                loadingItemsTable: true,
                IsEditItem: false,
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        })
    }
    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    ShowItemPopup = (e) => {
        this.setState({ ShowItemPopup: true, IsEditItem: false });
    };

    AddDesignDiscipline = () => {
        this.setState({ ShowPopup: true, IsEdit: false });
    };

    save(values, resetForm) {
        this.setState({ isLoading: true });

        if (this.state.IsEdit) {
            dataservice.addObject('EditdesigndicplineEntity', values).then(
                res => {
                    this.setState({ rows: res, isLoading: false, ShowPopup: false, IsEdit: false });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                    this.setState({ isLoading: false, ShowPopup: false });
                })
        }
        else {
            dataservice.addObject('AdddesignDiscpline', values).then(
                res => {
                    this.setState({ rows: res, isLoading: false, ShowPopup: false });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                    this.setState({ isLoading: false, ShowPopup: false });
                })
        }
        resetForm();
    };
    saveItems(values, resetForm) {
        this.setState({ isLoading: true });

        if (this.state.IsEditItem) {
            dataservice.addObject('EditDesignDicplineSections', values).then(
                res => {
                    this.setState({ disciplineItems: res, isLoading: false, ShowItemPopup: false, IsEditItem: false });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                    this.setState({ isLoading: false, ShowItemPopup: false });
                })
        }
        else {
            dataservice.addObject('AddDesignDicplineSections', values).then(
                res => {
                    this.setState({ disciplineItems: res, isLoading: false, ShowItemPopup: false });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                    this.setState({ isLoading: false, ShowItemPopup: false });
                })
        }
        resetForm();
    };

    render() {
        const disciplineItems = [
            {
                Header: Resources["delete"][currentLanguage],
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <div
                            className="btn table-btn-tooltip"
                            style={{ marginLeft: "5px" }}
                            onClick={() => this.showDeleteITemsModal(row.id)}>
                            <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                        </div>
                    );
                },
                width: 70
            },
            {
                Header: Resources['description'][currentLanguage],
                accessor: 'description',
                sortabel: true,
                width: 200,
            },
            {
                Header: Resources['dwgNo'][currentLanguage],
                accessor: 'dwgNo',
                width: 150,
                sortabel: true,
            }
        ];
        const dataGrid =
            this.state.isLoading === false ? (

                <GridCustom
                    gridKey="disciplineGrid"
                    data={this.state.rows}
                    pageSize={this.state.pageSize}
                    groups={[]}
                    actions={this.actions}
                    cells={this.columnsGrid}
                    rowActions={this.rowActions}
                    showPicker={false}
                    rowClick={(row, cell) => {
                        let id = row.id;
                        if (config.IsAllow(1180)) {
                            Api.get('GetdesigndicplineForEdit?id=' + id).then(
                                res => {

                                    this.setState({
                                        EditListData: res,
                                        IsEdit: true,
                                        selectedrow: id,
                                        ShowPopup: true,
                                    })
                                }
                            )
                        }
                        else {
                            toast.warn(Resources["missingPermissions"][currentLanguage]);
                        }
                    }}
                />
            ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns} fileName={Resources['designDiscipline'][currentLanguage]} />
            : null;

        let RenderItemsPopupAddEdit = () => {
            return (
                <Formik
                    initialValues={{
                        id: this.state.IsEditItem ? this.state.EditItemListData.id : undefined,
                        disciplineId: this.state.disciplineId,
                        descriptionEn: this.state.IsEditItem ? this.state.EditItemListData.descriptionEn : '',
                        descriptionAr: this.state.IsEditItem ? this.state.EditItemListData.descriptionAr : '',
                        dwgNo: this.state.IsEditItem ? this.state.EditItemListData.dwgNo : '',
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchemaItems}
                    onSubmit={(values, { resetForm }) => {
                        this.saveItems(values, resetForm);
                    }}>
                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit }) => (
                        <Form className="proForm" onSubmit={handleSubmit}>
                            <div className="dropWrapper">
                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['titleEn'][currentLanguage]} </label>
                                    <div className={"inputDev ui input customeError" + (errors.descriptionEn && touched.descriptionEn ? (" has-error") : !errors.descriptionEn && touched.descriptionEn ? (" has-success") : " ")} >
                                        <input name='descriptionEn' autoComplete='off' id='descriptionEn' placeholder={Resources['titleEn'][currentLanguage]}
                                            value={values.descriptionEn} className="form-control" onBlur={handleBlur} onChange={handleChange} />
                                        {errors.descriptionEn && touched.descriptionEn ? (<em className="pError dropdown__error">{errors.descriptionEn}</em>) : null}
                                    </div>
                                </div>
                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['titleAr'][currentLanguage]} </label>
                                    <div className={'ui input inputDev customeError' + (errors.descriptionAr && touched.descriptionAr ? ' has-error' : null) + ' '}>
                                        <input
                                            name='descriptionAr'
                                            className="form-control"
                                            autoComplete='off'
                                            id='descriptionAr'
                                            value={values.descriptionAr}
                                            placeholder={Resources['titleAr'][currentLanguage]}
                                            onBlur={handleBlur} onChange={handleChange} />
                                        {errors.descriptionAr && touched.descriptionAr ? <em className="pError dropdown__error">{errors.descriptionAr}</em> : null}
                                    </div>
                                </div>
                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['drawingNo'][currentLanguage]} </label>
                                    <div className={'ui input inputDev customeError ' + (errors.dwgNo && touched.dwgNo ? 'has-error' : null) + ' '}>
                                        <input
                                            name='dwgNo'
                                            autoComplete='off'
                                            className="form-control"
                                            value={values.dwgNo}
                                            placeholder={Resources['drawingNo'][currentLanguage]}
                                            onBlur={handleBlur}
                                            onChange={handleChange} />
                                        {errors.dwgNo ? (<em className="pError dropdown__error">{errors.dwgNo}</em>) : null}

                                    </div>
                                </div>

                                <div className="fullWidthWrapper">
                                    <button className="primaryBtn-1 btn" type='submit'>
                                        {Resources['save'][currentLanguage]}</button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            )
        }
        let RenderPopupAddEdit = () => {
            return (
                <Formik
                    initialValues={{
                        id: this.state.IsEdit ? this.state.EditListData.id : undefined,
                        titleEn: this.state.IsEdit ? this.state.EditListData.titleEn : '',
                        titleAr: this.state.IsEdit ? this.state.EditListData.titleAr : '',
                        abbreviation: this.state.IsEdit ? this.state.EditListData.abbreviation : '',
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={(values, { resetForm }) => {
                        this.save(values, resetForm);
                    }}>
                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit }) => (
                        <Form className="proForm" onSubmit={handleSubmit}>
                            <div className="dropWrapper">
                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['titleEn'][currentLanguage]} </label>
                                    <div className={"inputDev ui input customeError" + (errors.titleEn && touched.titleEn ? (" has-error") : !errors.titleEn && touched.titleEn ? (" has-success") : " ")} >
                                        <input name='titleEn' autoComplete='off' id='titleEn' placeholder={Resources['titleEn'][currentLanguage]}
                                            value={values.titleEn} className="form-control" onBlur={handleBlur} onChange={handleChange} />
                                        {errors.titleEn && touched.titleEn ? (<em className="pError dropdown__error">{errors.titleEn}</em>) : null}
                                    </div>
                                </div>
                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['titleAr'][currentLanguage]} </label>
                                    <div className={'ui input inputDev customeError' + (errors.titleAr && touched.titleAr ? ' has-error' : null) + ' '}>
                                        <input
                                            name='titleAr'
                                            className="form-control"
                                            autoComplete='off'
                                            id='titleAr'
                                            value={values.titleAr}
                                            placeholder={Resources['titleAr'][currentLanguage]}
                                            onBlur={handleBlur} onChange={handleChange} />
                                        {errors.titleAr && touched.titleAr ? <em className="pError dropdown__error">{errors.titleAr}</em> : null}
                                    </div>
                                </div>
                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['abbreviation'][currentLanguage]} </label>
                                    <div className={'ui input inputDev customeError ' + (errors.abbreviation && touched.abbreviation ? 'has-error' : null) + ' '}>
                                        <input
                                            name='abbreviation'
                                            autoComplete='off'
                                            className="form-control"
                                            value={values.abbreviation}
                                            placeholder={Resources['abbreviation'][currentLanguage]}
                                            onBlur={handleBlur}
                                            onChange={handleChange} />
                                        {errors.abbreviation ? (<em className="pError dropdown__error">{errors.abbreviation}</em>) : null}

                                    </div>
                                </div>
                                <div className="fullWidthWrapper">
                                    <button className="primaryBtn-1 btn" type='submit'>
                                        {Resources['save'][currentLanguage]}</button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            )
        }
        return (
            <Fragment >
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero"> {Resources['designDiscipline'][currentLanguage]}</h3>
                        <span>
                            <svg width="16px" height="18px" viewBox="0 0 16 18" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" >
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" >
                                    <g id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                        transform="translate(-4.000000, -3.000000)" >
                                    </g>
                                </g>
                            </svg>
                        </span>
                    </div>

                    <div className="rowsPaginations readOnly__disabled">
                        <div className="rowsPagiRange">
                            <span>{(this.state.pageSize * this.state.pageNumber) + 1}</span> - <span>{(this.state.pageSize * this.state.pageNumber) + this.state.pageSize}</span>of<span> {this.state.totalRows}</span>
                        </div>

                        <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}>
                            <i className="angle left icon" />
                        </button>

                        <button className={this.state.totalRows !== (this.state.pageSize * this.state.pageNumber) + this.state.pageSize ? "rowunActive" : ""} onClick={() => this.GetNextData()}>
                            <i className="angle right icon" />
                        </button>
                    </div>
                    <div className="filterBTNS">
                        {config.IsAllow(3661) ?
                            <button className="primaryBtn-1 btn mediumBtn" onClick={this.AddDesignDiscipline}>New</button>
                            : null}
                        {btnExport}
                    </div>

                </div>

                <div className="grid-container">
                    {dataGrid}
                </div>

                <SkyLightStateless onOverlayClicked={() => this.setState({ ShowItemPopup: false, IsEdit: false, showNotify: false })} title={this.state.IsEdit ?
                    Resources['designDisciplineSections'][currentLanguage] + ' - ' + Resources['editTitle'][currentLanguage]
                    : Resources['designDisciplineSections'][currentLanguage] + ' - ' + Resources['goAdd'][currentLanguage]}
                    onCloseClicked={() => this.setState({ showNotify: false, ShowItemPopup: false, IsEdit: false })} isVisible={this.state.ShowItemPopup}>
                    {RenderItemsPopupAddEdit()}
                    {this.state.loadingItemsTable == true ? (
                        <div className="doc-pre-cycle">
                            <header>
                                <h2 className="zero">
                                    {Resources["AddedItems"][currentLanguage]}
                                </h2>
                            </header>
                            <ReactTable
                                data={this.state.disciplineItems}
                                columns={disciplineItems}
                                defaultPageSize={10}
                                noDataText={Resources['noData'][currentLanguage]}
                                className="-striped -highlight"
                                getTrProps={(state, rowInfo) => {
                                    if (rowInfo && rowInfo.row) {
                                        return {
                                            onClick: e => {
                                                Api.get('GetDesignDicplineSectionsForEdit?id=' + rowInfo.row._original.id).then(
                                                    res => {
                                                        this.setState({
                                                            IsEditItem: true,
                                                            EditItemListData: res
                                                        });
                                                    }
                                                )
                                            },
                                        };
                                    } else {
                                        return {};
                                    }
                                }}
                            /> 
                        </div>
                    ) : null}
                </SkyLightStateless>
                <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false, IsEdit: false, showNotify: false })} title={this.state.IsEdit ?
                    Resources['designDiscipline'][currentLanguage] + ' - ' + Resources['editTitle'][currentLanguage]
                    : Resources['designDiscipline'][currentLanguage] + ' - ' + Resources['goAdd'][currentLanguage]}
                    onCloseClicked={() => this.setState({ showNotify: false, ShowPopup: false, IsEdit: false })} isVisible={this.state.ShowPopup}>
                    {RenderPopupAddEdit()}
                </SkyLightStateless>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal title={Resources["smartDeleteMessageContent"][currentLanguage]}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={() => this.ConfirmDelete()}
                    />
                ) : null}
                {this.state.showDeleteItemModal == true ? (
                    <ConfirmationModal title={Resources["smartDeleteMessageContent"][currentLanguage]}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteItemModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={() => this.clickHandlerDeleteRowsITems()}
                    />
                ) : null}
            </Fragment>
        )
    }
}
export default withRouter(DesignDiscipline)
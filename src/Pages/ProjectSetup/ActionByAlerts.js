import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import GridSetup from "../Communication/GridSetup";
import Export from "../../Componants/OptionsPanels/Export";
import config from "../../Services/Config";
import Resources from "../../resources.json";
import Api from '../../api';
import { toast } from "react-toastify";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice"
import Filter from "../../Componants/FilterComponent/filterComponent";
import DropdownMelcous from '../../Componants/OptionsPanels/DropdownMelcous';
import { SkyLightStateless } from 'react-skylight';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProject = localStorage.getItem('lastSelectedProject')
let CurrProjectName = localStorage.getItem('lastSelectedprojectName')

const ValidtionSchemaForEdit = Yup.object().shape({
    HighAlert: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
    NormalAlert: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
    LowAlert: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
});


const ValidtionSchemaForAdd = Yup.object().shape({
    HighAlert: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
    NormalAlert: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
    LowAlert: Yup.number()
        .required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
    ModuleDrop: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage])
        .nullable(true),
    DocumentTypeDrop: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage])
        .nullable(true),
});

class ActionByAlerts extends Component {
    constructor(props) {
        super(props)

        if (!config.IsAllow(3180)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
            this.props.history.goBack()
        }

        const columnsGrid = [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "redAlertDays",
                name: Resources["redAlert"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "yellowAlertDays",
                name: Resources["yellowAlert"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "greenAlertDays",
                name: Resources["GreenAlert"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "docType",
                name: Resources["docType"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ]

        const FilterColumns = [
            {
                field: "docType",
                name: "docType",
                type: "string",
                isCustom: true
            }
        ]

        this.state = {
            showCheckbox: false,
            columns: columnsGrid.filter(column => column.visible !== false),
            isLoading: true,
            rows: [],
            selectedRows: [],
            showDeleteModal: false,
            IsEditModel: false,
            ShowPopup: false,
            FilterColumns: FilterColumns,
            ApiFilter: 'GetFilterAccountsBic?',
            viewfilter: false,
            query: '',
            PageNumber: 1,
            PageSize: 50,
            ModuleDropData: [],
            ActionByAlertsDataForEdit: {},
            DocumentTypeDropData: [],
            SelectedModuleDrop: {},
            SelectedDocumentTypeDrop: {},

        }
    }

    componentDidMount = () => {
        Api.get('GetAccountBic?projectId=' + CurrProject + '&pageNumber=0&pageSize=200').then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false,
                })
            }
        )
        if (config.IsAllow(3179)) {
            this.setState({
                showCheckbox: true
            })
        }

        this.FillModuleDropData()
    }

    onRowClick = (obj) => {
        if (!config.IsAllow(3178)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
        }
        else {
            Api.get('GetAccountsBicForEdit?id=' + obj.id + '').then(
                res => {
                    this.setState({
                        ActionByAlertsDataForEdit: res,
                        ShowPopup: true,
                        IsEditModel: true
                    })
                }
            )
        }
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerDeleteRowsMain = (selectedRows) => {
        this.setState({
            selectedRows,
            showDeleteModal: true
        })
    }

    ConfirmDelete = () => {
        this.setState({
            isLoading: true
        })
        Api.post('AccountsBicMultipleDelete', this.state.selectedRows).then(
            res => {
                let originalRows = this.state.rows

                this.state.selectedRows.map(i => {
                    originalRows = originalRows.filter(r => r.id !== i);
                })
                this.setState({
                    rows: originalRows,
                    showDeleteModal: false,
                    isLoading: false,
                })
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }
        ).catch(ex => {
            this.setState({
                isLoading: true,
            })
        });
        this.setState({
            isLoading: true,
        })
    }

    AddActionByAlerts = () => {
        this.setState({
            ShowPopup: true, IsEditModel: false
        })
    }

    hideFilter(value) {
        this.setState({ viewfilter: !this.state.viewfilter });
        return this.state.viewfilter;
    }

    filterMethodMain = (event, query, apiFilter) => {
        var stringifiedQuery = JSON.stringify(query);
        this.setState({
            isLoading: true,
            query: stringifiedQuery
        });
        if (stringifiedQuery !== '{"isCustom":true}') {
            this.setState({ isLoading: true, search: true })
            let _query = stringifiedQuery.split(',"isCustom"')
            let url = this.state.ApiFilter + "projectId=" + CurrProject + "&pageNumber=" + this.state.PageNumber + "&pageSize=" + this.state.PageSize + '&query=' + _query[0] + '}'
            Api.get(url).then(result => {
                this.setState({
                    rows: result,
                    isLoading: false,
                    // totalRows: result.length
                });
            })
        }
        else {
            Api.get(this.state.ApiData).then(
                res => {
                    this.setState({
                        rows: res,
                        isLoading: false,
                        MaxArrange: Math.max.apply(Math, res.map(function (o) { return o.arrange + 1 }))
                    })
                }
            )
        }


    }


    handleChangeDropsForEdit = (SelectedItem, DropName) => {
        switch (DropName) {
            case 'ModuleDrop':
                this.setState({ SelectedModuleDrop: SelectedItem })
                if (SelectedItem !== null) {
                    dataservice.GetDataList('GetDocsTypeByModuleId?moduleId=' + SelectedItem.value + '', 'docType', 'id')
                        .then(res => {
                            this.setState({
                                DocumentTypeDropData: res,
                            })
                        })
                }
                break;
            default:
                break;
        }
    }

    FillModuleDropData = () => {
        dataservice.GetDataList('GetModuleList', 'modulType', 'id').then(
            res => {
                this.setState({
                    ModuleDropData: res
                })
            }
        )
    }

    AddEditAction = (values, actions) => {
        this.setState({ ShowPopup: false, isLoading: true })
        if (this.state.IsEditModel) {
            Api.post('EditAccountsBic', {
                id: this.state.ActionByAlertsDataForEdit.id,
                projectId: CurrProject,
                redAlertDays: values.HighAlert,
                yellowAlertDays: values.NormalAlert,
                greenAlertDays: values.LowAlert,
                docTypeId: this.state.ActionByAlertsDataForEdit.docTypeId,
            }).then(
                res => {
                    this.setState({
                        rows: res,
                        isLoading: false
                    })
                }
            )
        }
        else {
            Api.post('AddAccountsBic', {
                id: undefined,
                projectId: CurrProject,
                redAlertDays: values.HighAlert,
                yellowAlertDays: values.NormalAlert,
                greenAlertDays: values.LowAlert,
                docTypeId: values.DocumentTypeDrop.value,
            }).then(
                res => {
                    this.setState({
                        rows: res,
                        isLoading: false
                    })
                }
            )
        }
        values.LowAlert = ''
        values.NormalAlert = ''
        values.HighAlert = ''
        values.ModuleDrop = ''
        values.DocumentTypeDrop = ''
        toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)

    }

    render() {

        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    onRowClick={this.onRowClick.bind(this)}
                />
            ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns} fileName={Resources['bicAlerts'][currentLanguage]} />
            : null

        const ComponantFilter = this.state.isLoading === false ?
            <Filter
                filtersColumns={this.state.FilterColumns}
                filterMethod={this.filterMethodMain}
            /> : null

        return (
            <Fragment>
                <div className='mainContainer'>
                    <div className="submittalFilter">
                        <div className="subFilter">
                            <h3 className="zero">{CurrProjectName + ' - ' + Resources['bicAlerts'][currentLanguage]}</h3>
                            {/* <span>{this.state.totalRows}</span> */}
                            <div className="ui labeled icon top right pointing dropdown fillter-button"
                                tabIndex="0" onClick={() => this.hideFilter(this.state.viewfilter)}>
                                <span>
                                    <svg width="16px" height="18px" viewBox="0 0 16 18" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <g id="Action-icons/Filters/Hide+text/24px/Grey_Base" transform="translate(-4.000000, -3.000000)">
                                                <g id="Group-4"> <g id="Group-7"> <g id="filter">
                                                    <rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="24" height="24" />
                                                    <path d="M15.5116598,15.1012559 C14.1738351,15.1012559 13.0012477,14.2345362 12.586259,12.9819466 L4.97668038,12.9819466 C4.43781225,12.9819466 4,12.5415758 4,12 C4,11.4584242 4.43781225,11.0180534 4.97668038,11.0180534 L12.586259,11.0180534 C13.0012477,9.76546385 14.1738351,8.89874411 15.5116598,8.89874411 C16.8494845,8.89874411 18.0220719,9.76546385 18.4370606,11.0180534 L19.0233196,11.0180534 C19.5621878,11.0180534 20,11.4584242 20,12 C20,12.5415758 19.5621878,12.9819466 19.0233196,12.9819466 L18.4370606,12.9819466 C18.0220719,14.2345362 16.8494845,15.1012559 15.5116598,15.1012559 Z M15.5116598,10.8626374 C14.8886602,10.8626374 14.3813443,11.372918 14.3813443,12 C14.3813443,12.627082 14.8886602,13.1373626 15.5116598,13.1373626 C16.1346594,13.1373626 16.6419753,12.627082 16.6419753,12 C16.6419753,11.372918 16.1346594,10.8626374 15.5116598,10.8626374 Z M7.78600823,9.20251177 C6.44547873,9.20251177 5.27202225,8.33246659 4.8586039,7.07576209 C4.37264206,7.01672011 4,6.60191943 4,6.10125589 C4,5.60059914 4.37263163,5.1858019 4.85858244,5.12675203 C5.27168513,3.86979791 6.44573643,3 7.78600823,3 C9.1238329,3 10.2964204,3.86671974 10.711409,5.11930926 L19.0233196,5.11930926 C19.5621878,5.11930926 20,5.5596801 20,6.10125589 C20,6.64283167 19.5621878,7.08320251 19.0233196,7.08320251 L10.711409,7.08320251 C10.2964204,8.33579204 9.1238329,9.20251177 7.78600823,9.20251177 Z M7.78600823,4.96389325 C7.1630086,4.96389325 6.65569273,5.4741739 6.65569273,6.10125589 C6.65569273,6.72833787 7.1630086,7.23861852 7.78600823,7.23861852 C8.40900786,7.23861852 8.91632373,6.72833787 8.91632373,6.10125589 C8.91632373,5.4741739 8.40900786,4.96389325 7.78600823,4.96389325 Z M13.1695709,18.8806907 C12.7545822,20.1332803 11.5819948,21 10.2441701,21 C8.90634542,21 7.73375797,20.1332803 7.3187693,18.8806907 L4.97668038,18.8806907 C4.43781225,18.8806907 4,18.4403199 4,17.8987441 C4,17.3571683 4.43781225,16.9167975 4.97668038,16.9167975 L7.3187693,16.9167975 C7.73375797,15.664208 8.90634542,14.7974882 10.2441701,14.7974882 C11.5819948,14.7974882 12.7545822,15.664208 13.1695709,16.9167975 L19.0233196,16.9167975 C19.5621878,16.9167975 20,17.3571683 20,17.8987441 C20,18.4403199 19.5621878,18.8806907 19.0233196,18.8806907 L13.1695709,18.8806907 Z M10.2441701,16.7613815 C9.62117047,16.7613815 9.1138546,17.2716621 9.1138546,17.8987441 C9.1138546,18.5258261 9.62117047,19.0361068 10.2441701,19.0361068 C10.8671697,19.0361068 11.3744856,18.5258261 11.3744856,17.8987441 C11.3744856,17.2716621 10.8671697,16.7613815 10.2441701,16.7613815 Z"
                                                        id="Shape" fill="#5E6475" fillRule="nonzero" />
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
                            {config.IsAllow(0) ?
                                <button className="primaryBtn-1 btn mediumBtn" onClick={this.AddActionByAlerts}>New</button>
                                : null}
                            {btnExport}
                        </div>

                    </div>

                    <div className="filterHidden"
                        style={{
                            maxHeight: this.state.viewfilter ? "" : "0px",
                            overflow: this.state.viewfilter ? "" : "hidden"
                        }}>
                        <div className="gridfillter-container">
                            {ComponantFilter}
                        </div>
                    </div>

                    <div className="grid-container">
                        {dataGrid}
                    </div>

                    <div className="skyLight__form">
                        <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false, IsEditModel: false })}
                            title={this.state.IsEditModel ? Resources['editTitle'][currentLanguage] : Resources['goAdd'][currentLanguage]}
                            onCloseClicked={() => this.setState({ IsEditModel: false, ShowPopup: false })} isVisible={this.state.ShowPopup}>

                            <Formik

                                initialValues={{
                                    HighAlert: this.state.IsEditModel ? this.state.ActionByAlertsDataForEdit.redAlertDays : 0,
                                    NormalAlert: this.state.IsEditModel ? this.state.ActionByAlertsDataForEdit.yellowAlertDays : 0,
                                    LowAlert: this.state.IsEditModel ? this.state.ActionByAlertsDataForEdit.greenAlertDays : 0,
                                    ModuleDrop: this.state.IsEditModel ? ' ' : '',
                                    DocumentTypeDrop: this.state.IsEditModel ? ' ' : '',
                                }}

                                enableReinitialize={true}

                                validationSchema={this.state.IsEditModel ? ValidtionSchemaForEdit : ValidtionSchemaForAdd}

                                onSubmit={(values, actions) => {

                                    this.AddEditAction(values, actions)
                                }}>

                                {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                    <Form onSubmit={handleSubmit}>


                                        <div className='document-fields'>
                                            <div className="proForm datepickerContainer">

                                                {!this.state.IsEditModel ?
                                                    <Fragment>
                                                        <div className="linebylineInput valid-input">
                                                            <DropdownMelcous title='selectModule' data={this.state.ModuleDropData} name='ModuleDrop'
                                                                selectedValue={this.state.IsEditModel ? this.state.SelectedModuleDrop : values.ModuleDrop} onChange={setFieldValue}
                                                                handleChange={(e) => this.handleChangeDropsForEdit(e, "ModuleDrop")}
                                                                onBlur={setFieldTouched}
                                                                error={errors.ModuleDrop}
                                                                touched={touched.ModuleDrop}
                                                                value={values.ModuleDrop} />
                                                        </div>

                                                        <div className="linebylineInput valid-input">
                                                            <DropdownMelcous title='docType' data={this.state.DocumentTypeDropData} name='DocumentTypeDrop'
                                                                selectedValue={this.state.IsEditModel ? this.state.SelectedDocumentTypeDrop : values.DocumentTypeDrop} onChange={setFieldValue}
                                                                handleChange={(e) => this.handleChangeDropsForEdit(e, "DocumentTypeDrop")}
                                                                onBlur={setFieldTouched}
                                                                error={errors.DocumentTypeDrop}
                                                                touched={touched.DocumentTypeDrop}
                                                                value={values.DocumentTypeDrop} />
                                                        </div>
                                                    </Fragment>
                                                    : null}

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['redAlertDays'][currentLanguage]}</label>
                                                    <div className={'ui input inputDev ' + (errors.HighAlert && touched.HighAlert ? 'has-error' : null) + ' '}>
                                                        <input autoComplete="off" value={this.state.IsEditModel ? this.state.ActionByAlertsDataForEdit.redAlertDays : values.HighAlert}
                                                            className="form-control" name="HighAlert" onBlur={(e) => { handleBlur(e) }}
                                                            onChange={(e) => {
                                                                handleChange(e)
                                                                if (this.state.IsEditModel) {
                                                                    this.setState({ ActionByAlertsDataForEdit: { ...this.state.ActionByAlertsDataForEdit, redAlertDays: e.target.value } })
                                                                }
                                                            }}
                                                            placeholder={Resources['redAlertDays'][currentLanguage]} />
                                                        {errors.HighAlert && touched.HighAlert ?
                                                            <Fragment>
                                                                <span className='glyphicon glyphicon-remove form-control-feedback spanError'>
                                                                </span>
                                                                <em className="pError">{errors.HighAlert}</em>
                                                            </Fragment>
                                                            : values.HighAlert !== '' ?
                                                                <span className='glyphicon form-control-feedback glyphicon-ok'> </span>
                                                                : null}
                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['yellowAlertDays'][currentLanguage]}</label>
                                                    <div className={'ui input inputDev ' + (errors.NormalAlert && touched.NormalAlert ? 'has-error' : null) + ' '}>
                                                        <input autoComplete="off" value={this.state.IsEditModel ? this.state.ActionByAlertsDataForEdit.yellowAlertDays : values.NormalAlert}
                                                            className="form-control" name="NormalAlert" onBlur={(e) => { handleBlur(e) }}
                                                            onChange={(e) => {
                                                                handleChange(e)
                                                                if (this.state.IsEditModel) {
                                                                    this.setState({ ActionByAlertsDataForEdit: { ...this.state.ActionByAlertsDataForEdit, yellowAlertDays: e.target.value } })
                                                                }
                                                            }}
                                                            placeholder={Resources['yellowAlertDays'][currentLanguage]} />
                                                        {errors.NormalAlert && touched.NormalAlert ? (
                                                            <Fragment>
                                                                <span className='glyphicon glyphicon-remove form-control-feedback spanError'>
                                                                </span>
                                                                <em className="pError">{errors.NormalAlert}</em>
                                                            </Fragment>
                                                        ) :
                                                            values.NormalAlert !== '' ?
                                                                <span className='glyphicon form-control-feedback glyphicon-ok'> </span>
                                                                : null

                                                        }

                                                    </div>
                                                </div>

                                                <div className="linebylineInput valid-input">
                                                    <label className="control-label">{Resources['greenAlertDays'][currentLanguage]}</label>
                                                    <div className={'ui input inputDev ' + (errors.LowAlert && touched.LowAlert ? 'has-error' : null) + ' '}>
                                                        <input autoComplete="off" value={this.state.IsEditModel ? this.state.ActionByAlertsDataForEdit.greenAlertDays : values.LowAlert}
                                                            className="form-control" name="LowAlert" onBlur={(e) => { handleBlur(e) }}
                                                            onChange={(e) => {
                                                                handleChange(e)
                                                                if (this.state.IsEditModel) {
                                                                    this.setState({ ActionByAlertsDataForEdit: { ...this.state.ActionByAlertsDataForEdit, greenAlertDays: e.target.value } })
                                                                }
                                                            }}
                                                            placeholder={Resources['greenAlertDays'][currentLanguage]} />
                                                        {errors.LowAlert && touched.LowAlert ? (
                                                            <Fragment>
                                                                <span className='glyphicon glyphicon-remove form-control-feedback spanError'>
                                                                </span>
                                                                <em className="pError">{errors.LowAlert}</em>
                                                            </Fragment>
                                                        ) :
                                                            values.LowAlert !== '' ?
                                                                <span className='glyphicon form-control-feedback glyphicon-ok'> </span>
                                                                : null

                                                        }

                                                    </div>
                                                </div>





                                            </div>

                                            <div className="slider-Btns">
                                                <button className="primaryBtn-1 btn meduimBtn" type='submit' >{this.state.IsEditModel ? Resources['editTitle'][currentLanguage] : Resources['addTitle'][currentLanguage]}</button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>


                        </SkyLightStateless>
                    </div>

                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                        />
                    ) : null}
                </div>
            </Fragment>
        )

    }
}
export default withRouter(ActionByAlerts)




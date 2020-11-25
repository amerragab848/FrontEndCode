import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
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

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
var ar = new RegExp("^[\u0621-\u064A\u0660-\u0669 ]+$");
var en = new RegExp("\[\\u0600\-\\u06ff\]\|\[\\u0750\-\\u077f\]\|\[\\ufb50\-\\ufc3f\]\|\[\\ufe70\-\\ufefc\]");

const ValidtionSchema = Yup.object().shape({
    titleAr: Yup.string().test('contactNameAr', 'Name cannot be english', value => {
        return ar.test(value)
    }).required(Resources['titleArValid'][currentLanguage]),
    title: Yup.string().test('titleEnCompany', 'Name cannot be arabic', value => {
        return !en.test(value);
    }).required(Resources['titleEnValid'][currentLanguage]),
    value: Yup.number().required(Resources['isRequiredField'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
});

const DropGeneralData =
    [{ label: Resources["approvalStatus"][currentLanguage], value: "approvalstatus" },
    { label: Resources["area"][currentLanguage], value: "area" },
    { label: Resources["buildingNumber"][currentLanguage], value: "buildingno" },
    { label: Resources["companyRole"][currentLanguage], value: "companyrole" },
    { label: Resources["ContactName"][currentLanguage], value: "contacttitle" },
    { label: Resources["currency"][currentLanguage], value: "currency" },
    { label: Resources["clientSelectionType"][currentLanguage], value: "clinetselectionstype" },
    { label: Resources["country"][currentLanguage], value: "country" },
    { label: Resources["cvrRecommendations"][currentLanguage], value: "CVR Recommendations" },
    { label: Resources["dayName"][currentLanguage], value: "dayname" },
    { label: Resources["desginProjectType"][currentLanguage], value: "Desgin Project Type" },
    { label: Resources["discipline"][currentLanguage], value: "discipline" },
    { label: Resources["reviewResult"][currentLanguage], value: "Drawing Item Status" },
    { label: Resources["distributionAction"][currentLanguage], value: "distribution_action" },
    { label: Resources["drawingFileNumber"][currentLanguage], value: "drawingfilenumber" },
    { label: Resources["equipmentCode"][currentLanguage], value: "equipmentcode" },
    { label: Resources["equipmentType"][currentLanguage], value: "equipmenttype" },
    { label: Resources["expenseType"][currentLanguage], value: "expensestype" },
    { label: Resources["fieldForce"][currentLanguage], value: "fieldforce" },
    { label: Resources["itemType"][currentLanguage], value: "Item Type" },
    { label: Resources["location"][currentLanguage], value: "location" },
    { label: Resources["materialCode"][currentLanguage], value: "materialcode" },
    { label: Resources["materialTitle"][currentLanguage], value: "materialtitle" },
    { label: Resources["priority"][currentLanguage], value: "priority" },
    { label: Resources["projectType"][currentLanguage], value: "projecttype" },
    { label: Resources["project_Type"][currentLanguage], value: "project_type" },
    { label: Resources["reportsTypes"][currentLanguage], value: "Reports Types" },
    { label: Resources["reasonForIssue"][currentLanguage], value: "reasonforissue" },
    { label: Resources["reviewResult"][currentLanguage], value: "reviewresult" },
    { label: Resources["sendingMethod"][currentLanguage], value: "sendingmethods" },
    { label: Resources["specsSection"][currentLanguage], value: "specssection" },
    { label: Resources["transmittalSubmittedFor"][currentLanguage], value: "transmittalsubmittedfor" },
    { label: Resources["transactionType"][currentLanguage], value: "transactiontype" },
    { label: Resources["timeSheetLocation"][currentLanguage], value: "timesheetlocation" },
    { label: Resources["weather"][currentLanguage], value: "weather" },
    { label: Resources["weatherFromTo"][currentLanguage], value: "weatherfromto" },
    { label: Resources["unit"][currentLanguage], value: "unit" },
    { label: Resources["apartmentNumber"][currentLanguage], value: "Apartment Number" },
    { label: Resources["boqItemType"][currentLanguage], value: "estimationitemtype" },
    { label: Resources["EstimationType"][currentLanguage], value: "EstimationType" },
    { label: Resources["dailyreporttype"][currentLanguage], value: "dailyreporttype" },
    { label: Resources["riskCause"][currentLanguage], value: "riskCauses" },
    { label: Resources["riskLevel"][currentLanguage], value: "riskLevels" },
    { label: Resources["riskType"][currentLanguage], value: "riskTypes" },
    { label: Resources["mitigationType"][currentLanguage], value: "mitigationTypes" },
    { label: Resources["likelihood"][currentLanguage], value: "likelihoods" },
    { label: Resources["consequence"][currentLanguage], value: "consequences" },
    { label: Resources["consequencesFactosrs"][currentLanguage], value: "ConsequencesFactosrs" },
    { label: Resources["consequencesFactosrs"][currentLanguage], value: "consequencesScores" },
    { label: Resources["projectPhase"][currentLanguage], value: "projectPhase" },
    { label: Resources["organisation"][currentLanguage], value: "organisation" },
    { label: Resources["managementlevel"][currentLanguage], value: "managementlevel" },
    { label: Resources["projectStage"][currentLanguage], value: "project_stage" },
    { label: Resources["lots"][currentLanguage], value: "lots" },
    { label: Resources["assetsTypes"][currentLanguage], value: "assets_types" },
    { label: Resources["companyType"][currentLanguage], value: "companyType" },
    { label: Resources["approvalText"][currentLanguage], value: "WFApprovalstatus" },
    { label: Resources["deductionType"][currentLanguage], value: "deductionType" },
    { label: Resources["submittalType"][currentLanguage], value: "SubmittalTypes" },
    { label: Resources["attachedPaperSize"][currentLanguage], value: "attachedPaperSize" }
    ]

class GeneralList extends Component {

    constructor(props) {

        super(props)

        this.columnsGrid = [
            { title: '', type: 'check-box', fixed: true, field: 'id' },
            {
                field: "title",
                title: Resources["generalListTitle"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 25,
                sortable: true,
                type: "text",
                showTip: true
            }
        ];

        this.groups = [];

        this.actions = [
            {
                title: 'Delete',
                handleClick: selectedRows => {
                    let notEditableList = [];
                    let selectedIds = [];
                    selectedRows.map(id => {
                        let row = this.state.rows.find(x => x.id == id);
                        if (row && row.editable != true) notEditableList.push(row.title);
                        else selectedIds.push(id);

                    })
                    if (notEditableList.length > 0)
                        toast.error(`You Can not Delete ${notEditableList.map(item => item)} Because They are not Editable`)
                    if (selectedIds.length > 0)
                        this.setState({
                            showDeleteModal: true,
                            selectedRow: selectedIds
                        });
                },
                classes: '',
            }
        ];

        this.rowActions = [];

        this.state = {
            showCheckbox: false,
            columns: this.columnsGrid,
            isLoading: true,
            rows: [],
            selectedRows: [],
            totalRows: 0,
            pageSize: 50,
            pageNumber: 0,
            showDeleteModal: false,
            listType: '',
            ShowPopup: false,
            EditListData: {},
            IsEdit: false,
            selectedrow: '',
            showNotify: false,
            api: 'GetAccountsDefaultList?',
            showValue: false
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
        let url = this.state.api + "listType=" + this.state.listType + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
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
        let url = this.state.api + "listType=" + this.state.listType + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
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
        if (config.IsAllow(1181)) {
            this.setState({ showCheckbox: true, isLoading: false })
        }
    };

    ConfirmDelete = () => {
        this.setState({
            isLoading: true
        })
        Api.post('AccountsDefaultListMultipleDelete', this.state.selectedRow).then(res => {
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

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    GeneralListHandelChange = (e) => {

        this.setState({
            isLoading: true,
            listType: e.value,
            showValue: e.value === 'likelihoods' || e.value === "consequencesScores" || e.value === 'consequences' ? true : false
        })
        Api.get('GetAccountsDefaultList?listType=' + e.value + '&pageNumber=' + this.state.pageNumber + '&pageSize=' + this.state.pageSize + '').then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        )
        this.setState({ isLoading: true })
    };

    onRowClick = (obj) => {
        if (config.IsAllow(1180)) {
            // if (obj.editable) {
            Api.get('GetAccountsDefaultListForEdit?id=' + obj.id + '').then(
                res => {
                    this.setState({
                        EditListData: res,
                        IsEdit: true,
                        selectedrow: obj.id,
                        ShowPopup: true,
                    })
                }
            )
            // }
            // else {
            //     toast.error(Resources["adminItemEditable"][currentLanguage]);
            // }
        }
        else {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
        }
    };

    showPopup = (e) => {
        this.setState({ ShowPopup: true, IsEdit: false });
    };

    save(values, resetForm) {
        this.setState({ isLoading: true });
        if (this.state.IsEdit) {
            dataservice.addObject('EditAccountsDefaultList', values).then(
                res => {
                    this.setState({ rows: res, isLoading: false, ShowPopup: false, IsEdit: false });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                    this.setState({ isLoading: false, ShowPopup: false });
                })
        }
        else {
            dataservice.addObject('AddAccountsDefaultList', values).then(
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

    render() {

        const dataGrid =
            this.state.isLoading === false ? (

                <GridCustom
                    key="items"
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
                            Api.get('GetAccountsDefaultListForEdit?id=' + id + '').then(
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
                columns={this.state.columns} fileName={Resources['AccountsDefaultList'][currentLanguage]} />
            : null;

        let RenderPopupAddEdit = () => {
            return (
                <Formik
                    initialValues={{
                        listType: this.state.listType,
                        id: this.state.IsEdit ? this.state.EditListData.id : undefined,
                        title: this.state.IsEdit ? this.state.EditListData.title : '',
                        titleAr: this.state.IsEdit ? this.state.EditListData.titleAr : '',
                        abbreviation: this.state.IsEdit ? this.state.EditListData.abbreviation : '',
                        value: this.state.showValue ? this.state.IsEdit ? this.state.EditListData.value : 0 : 0,
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
                                    <div className={"inputDev ui input" + (errors.title && touched.title ? (" has-error") : !errors.title && touched.title ? (" has-success") : " ")} >
                                        <input name='title' autoComplete='off' id='title' placeholder={Resources['titleEn'][currentLanguage]}
                                            value={values.title} className="form-control" onBlur={handleBlur} onChange={handleChange} />
                                        {errors.title && touched.title ? (<em className="pError">{errors.title}</em>) : null}
                                    </div>
                                </div>
                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['titleAr'][currentLanguage]} </label>
                                    <div className={'ui input inputDev ' + (errors.titleAr && touched.titleAr ? 'has-error' : null) + ' '}>
                                        <input name='titleAr' className="form-control" autoComplete='off'
                                            id='titleAr' value={values.titleAr} placeholder={Resources['titleAr'][currentLanguage]}
                                            onBlur={handleBlur} onChange={handleChange} />
                                        {errors.titleAr && touched.titleAr ? <em className="pError">{errors.titleAr}</em> : null}
                                    </div>
                                </div>
                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['abbreviation'][currentLanguage]} </label>
                                    <div className="ui input inputDev" >
                                        <input name='abbreviation' autoComplete='off' className="form-control"
                                            value={values.abbreviation} placeholder={Resources['abbreviation'][currentLanguage]}
                                            onBlur={handleBlur} onChange={handleChange} />
                                    </div>
                                </div>
                                {this.state.showValue ?
                                    <div className="fillter-status fillter-item-c fullInputWidth">
                                        <label className="control-label">{Resources['value'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.value ? 'has-error' : !errors.value && touched.value ? (" has-success") : " ")}>
                                            <input className="form-control" name='value' id='value' placeholder={Resources['value'][currentLanguage]}
                                                value={this.state.EditListData.value} onChange={handleChange}
                                                onBlur={handleBlur} />
                                            {errors.value ? (<em className="pError">{errors.value}</em>) : null}
                                        </div>
                                    </div>
                                    : null}
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
                        <h3 className="zero"> {Resources['AccountsDefaultList'][currentLanguage]}</h3>
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

                    {this.state.listType ?
                        <div className="filterBTNS">
                            {config.IsAllow(1182) ? <button className="primaryBtn-1 btn mediumBtn" onClick={this.showPopup}>New</button>
                                : null}
                            {btnExport}
                        </div>
                        : null}

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

                </div>
                <div className="proForm">
                    <div className="letterFullWidth">
                        <Select title='AccountsDefaultList' placeholder='AccountsDefaultList' data={DropGeneralData} handleChange={this.GeneralListHandelChange} />
                    </div>
                </div>
                <div className="grid-container">
                    {dataGrid}
                </div>

                <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false, IsEdit: false, showNotify: false })} title={this.state.IsEdit ?
                    Resources['AccountsDefaultList'][currentLanguage] + ' - ' + Resources['editTitle'][currentLanguage]
                    : Resources['AccountsDefaultList'][currentLanguage] + ' - ' + Resources['goAdd'][currentLanguage]}
                    onCloseClicked={() => this.setState({ showNotify: false, ShowPopup: false, IsEdit: false })} isVisible={this.state.ShowPopup}>
                    {RenderPopupAddEdit()}
                </SkyLightStateless>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null}
            </Fragment>
        )
    }
}
export default withRouter(GeneralList)
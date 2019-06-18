import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import GridSetup from "../../../Pages/Communication/GridSetup";
import NotifiMsg from '../../publicComponants/NotifiMsg'
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


const ValidtionSchema = Yup.object().shape({
    ARTitle: Yup.string()
        .required(Resources['titleArValid'][currentLanguage]),
    EnTitle: Yup.string()
        .required(Resources['titleEnValid'][currentLanguage]),
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
    { label: Resources["consequencesFactosrs"][currentLanguage], value: "consequencesScores" }]

class GeneralList extends Component {

    constructor(props) {

        const columnsGrid = [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "title",
                name: Resources["generalListTitle"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ]
        super(props)

        this.state = {
            showCheckbox: false,
            columns: columnsGrid.filter(column => column.visible !== false),
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
        });;
    }

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
        });;
    }

    componentWillMount = () => {
        if (config.IsAllow(1181)) {
            this.setState({ showCheckbox: true, isLoading: false })
        }
    }

    clickHandlerDeleteRowsMain = (selectedRows) => {
        let id = ''
        selectedRows.map(i => { id = i })
        let checkEdit = []
        checkEdit = this.state.rows.filter(s => s.id === id)
        let editable = '';
        checkEdit.map(i => {
            editable = i.editable
        })
        if (editable === true) {
            this.setState({
                selectedRows,
                showDeleteModal: true
            })
        }
        else {
            this.setState({ isLoading: true })
            toast.error(Resources["adminItemEditable"][currentLanguage]);
            setTimeout(() => {
                this.setState({ isLoading: false })
            }, 100);
        }
    }

    ConfirmDelete = () => {
        this.setState({
            isLoading: true
        })
        Api.post('AccountsDefaultListMultipleDelete', this.state.selectedRows).then(
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

    GeneralListHandelChange = (e) => {
        this.setState({
            isLoading: true,
            listType: e.value
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
    }

    onRowClick = (obj) => {
        if (config.IsAllow(1180)) {
            if (obj.editable) {
                Api.get('GetAccountsDefaultListForEdit?id=' + obj.id + '').then(
                    res => {
                        this.setState({
                            IsEdit: true,
                            ShowPopup: true,
                            EditListData: res,
                            selectedrow: obj.id,
                            showNotify: false,
                        })
                    }
                )
            }
            else {
                toast.error(Resources["adminItemEditable"][currentLanguage]);
            }
        }
        else {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
        }
    }

    showAdd = (e) => {
        this.setState({
            ShowPopup: true,
            EditListData: this.state.showValue ? { title: '', titleAr: '', abbreviation: '', listType: this.state.listType, value: 0 }
                : { title: '', titleAr: '', abbreviation: '', listType: this.state.listType }
        });

    }

    AddEditSave = (values, actions) => {
        this.setState({
            isLoading: true,
        })
        if (this.state.IsEdit) {
            dataservice.addObject('EditAccountsDefaultList', this.state.EditListData).then(
                res => {
                    this.setState({
                        rows: res, isLoading: false, ShowPopup: false, IsEdit: false
                    })
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                })
        }
        else {
            dataservice.addObject('AddAccountsDefaultList', this.state.EditListData).then(
                res => {
                    this.setState({
                        rows: res,
                        isLoading: false,
                    })
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                })
        }
        actions.setSubmitting(false);
        values.EnTitle = ''
        values.ARTitle = ''
        values.Abbreviation = ''
        this.setState({
            isLoading: true,
            ShowPopup: false
        })
    }

    HandleInputChange = (e, field) => {
        let originalDoc = { ...this.state.EditListData };
        let NewDoc = {};
        NewDoc[field] = e.target.value;
        NewDoc = Object.assign(originalDoc, NewDoc);
        this.setState({ EditListData: NewDoc })
    }

    render() {

        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    pageSize={this.state.pageSize}
                    onRowClick={this.onRowClick.bind(this)}
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
                        EnTitle: this.state.EditListData.title,
                        ARTitle: this.state.EditListData.titleAr,
                        Abbreviation: this.state.EditListData.abbreviation,
                        value: this.state.showValue ? this.state.EditListData.title.value : 0,
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={(values, actions) => {
                        this.AddEditSave(values, actions)
                    }}>

                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit }) => (

                        <Form className="proForm" onSubmit={handleSubmit}>

                            <div className="dropWrapper">

                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['titleEn'][currentLanguage]} </label>
                                    <div className={"inputDev ui input" + (errors.EnTitle && touched.EnTitle ? (" has-error") : !errors.EnTitle && touched.EnTitle ? (" has-success") : " ")} >
                                        <input name='EnTitle' autoComplete='off' id='EnTitle'
                                            value={this.state.EditListData.title} className="form-control" placeholder={Resources['titleEn'][currentLanguage]}
                                            onBlur={(e) => { handleBlur(e) }}
                                            onChange={(e) => {
                                                handleChange(e)
                                                this.HandleInputChange(e, 'title')
                                            }} />
                                        {errors.EnTitle && touched.EnTitle ? (<em className="pError">{errors.EnTitle}</em>) : null}
                                    </div>
                                </div>

                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['titleAr'][currentLanguage]} </label>
                                    <div className={'ui input inputDev ' + (errors.ARTitle && touched.ARTitle ? 'has-error' : null) + ' '}>
                                        <input name='ARTitle' className="form-control" autoComplete='off'
                                            id='ARTitle' value={this.state.EditListData.titleAr} placeholder={Resources['titleAr'][currentLanguage]}
                                            onBlur={(e) => { handleBlur(e) }}
                                            onChange={(e) => {
                                                handleChange(e)
                                                this.HandleInputChange(e, 'titleAr')
                                            }} />
                                        {errors.ARTitle && touched.ARTitle ? <em className="pError">{errors.ARTitle}</em> : null}
                                    </div>
                                </div>

                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['abbreviation'][currentLanguage]} </label>
                                    <div className="ui input inputDev" >
                                        <input name='Abbreviation' autoComplete='off'
                                            value={this.state.EditListData.abbreviation} className="form-control" placeholder={Resources['abbreviation'][currentLanguage]}
                                            onBlur={(e) => { handleBlur(e) }} onChange={(e) => {
                                                handleChange(e)
                                                this.HandleInputChange(e, 'abbreviation')
                                            }} />
                                    </div>
                                </div>

                                {this.state.showValue ?
                                    <div className="fillter-status fillter-item-c fullInputWidth">
                                        <label className="control-label">{Resources['value'][currentLanguage]} </label>
                                        <div className={"inputDev ui input " + (errors.value ? 'has-error' : !errors.value && touched.value ? (" has-success") : " ")}>
                                            <input className="form-control" name='value' id='value' placeholder={Resources['value'][currentLanguage]}
                                                value={this.state.EditListData.value} onChange={e => this.HandleInputChange(e, 'value')}
                                                onBlur={(e) => {
                                                    handleBlur(e)
                                                    handleChange(e)
                                                }} />
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


                <div className="submittalFilter">
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
                            {config.IsAllow(1182) ?
                                <button className="primaryBtn-1 btn mediumBtn" onClick={this.showAdd}>New</button>
                                : null}
                            {btnExport}
                        </div>
                        : null}

                    <div className="rowsPaginations">
                        <div className="rowsPagiRange">
                            <span>{(this.state.pageSize * this.state.pageNumber) + 1}</span> - <span>{(this.state.pageSize * this.state.pageNumber) + this.state.pageSize}</span> of
               <span> {this.state.totalRows}</span>
                        </div>

                        <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}>
                            <i className="angle left icon" />
                        </button>

                        <button className={this.state.totalRows !== (this.state.pageSize * this.state.pageNumber) + this.state.pageSize ? "rowunActive" : ""} onClick={() => this.GetNextData()}>
                            <i className="angle right icon" />
                        </button>
                    </div>

                </div>

                <div className="linebylineInput valid-input">
                    <Select title='AccountsDefaultList' placeholder='AccountsDefaultList' data={DropGeneralData} handleChange={this.GeneralListHandelChange} />
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
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
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
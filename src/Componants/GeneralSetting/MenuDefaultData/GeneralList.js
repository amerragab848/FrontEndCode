import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import GridSetup from "../../../Pages/Communication/GridSetup";
import NotifiMsg from '../../publicComponants/NotifiMsg'
import Export from "../../../Componants/OptionsPanels/Export";
import { SkyLightStateless } from 'react-skylight';
import Select from '../../OptionsPanels/DropdownMelcous';
import { Formik, Form, Field } from 'formik';
import config from "../../../Services/Config";
import * as Yup from 'yup';
import dataservice from "../../../Dataservice";
import Resources from "../../../resources.json";
import Api from '../../../api';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");


const ValidtionSchema = Yup.object().shape({
    ARTitle: Yup.string()
        .required('Required'),

    Abbreviation: Yup.string()
        .required('Required'),

});

const validationEdit = Yup.object().shape({
    ARTitleForEdit: Yup.string()
        .required('Required'),

    AbbreviationForEdit: Yup.string()
        .required('Required'),
});

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
                name: Resources["title"][currentLanguage],
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
            GeneralList: [],
            showCheckbox: false,
            columns: columnsGrid.filter(column => column.visible !== false),
            isLoading: true,
            rows: [],
            selectedRows: [],
            totalRows: 0,
            pageSize: 50,
            pageNumber: 0,
            pageTitle: Resources['accounts'][currentLanguage],
            showDeleteModal: false,
            listType: '',
            ShowPopup: false,
            EditListData: {},
            IsEdit: false,
            selectedrow: ''

        }
    }

    componentWillMount = () => {
        if (config.IsAllow(1179)) {
            if (config.IsAllow(1181)) {
                this.setState({
                    showCheckbox: true
                })
            }
            dataservice.GetDataList('GetListTypesOnly', 'listType', 'listType').then(
                res => {
                    this.setState({
                        GeneralList: res,
                        isLoading: false
                    })
                }
            )
        }
    }

    clickHandlerDeleteRowsMain = (selectedRows) => {
        let id = ''
        selectedRows.map(i => {
            id = i
        })
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
            }
        )
        this.setState({
            isLoading: true
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
        Api.get('GetAccountsDefaultList?listType=' + e.value + '&pageNumber=0&pageSize=200').then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        )
        this.setState({
            isLoading: true
        })
    }

    cellClick = (obj) => {
        if (config.IsAllow(1180)) {
            if (obj.editable) {
                Api.get('GetAccountsDefaultListForEdit?id=' + obj.id + '').then(
                    res => {
                        this.setState({
                            IsEdit: true,
                            ShowPopup: true,
                            EditListData: res,
                            selectedrow: obj.id
                        })
                    }
                )
            }
        }
    }


    render() {
        console.log(this.state.EditListData)
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    pageSize={this.state.pageSize}
                    onRowClick={this.cellClick.bind(this)}
                />
            ) : <LoadingSection />
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns} fileName={Resources['AccountsDefaultList'][currentLanguage]} />
            : null;
        return (

            <Fragment >

                <div className="linebylineInput valid-input">
                    <Select title='AccountsDefaultList' placeholder='AccountsDefaultList' data={this.state.GeneralList} handleChange={this.GeneralListHandelChange} />
                </div>

                <div className="submittalFilter">
                    <div className="subFilter">
                        <h3 className="zero"> {Resources['AccountsDefaultList'][currentLanguage]}</h3>
                        <span>{this.state.rows.length}</span>
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
                                <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.setState({ ShowPopup: true })}>New</button>
                                : null}{btnExport}
                        </div>
                        : null}

                    <div className="rowsPaginations">
                        <div className="rowsPagiRange">
                            <span>0</span> - <span>{this.state.pageSize}</span> of
                   <span>{this.state.totalRows}</span>
                        </div>
                        <button className="rowunActive">
                            <i className="angle left icon" />
                        </button>
                        <button onClick={() => this.GetNextData()}>
                            <i className="angle right icon" />
                        </button>
                    </div>
                </div>

                <div className="grid-container">
                    {dataGrid}
                </div>

                <SkyLightStateless isVisible={this.state.ShowPopup} title={Resources['AccountsDefaultList'][currentLanguage] + ' - ' + Resources['goAdd'][currentLanguage]} onCloseClicked={() => this.setState({ ShowPopup: false, IsEdit: false })}>
                    {this.state.IsEdit ?
                        <Formik
                            initialValues={{
                                EnTitleForEdit: '',
                                ARTitleForEdit: '',
                                AbbreviationForEdit: ''
                            }}
                            validationSchema={validationEdit}
                            onSubmit={() => {
                                this.setState({
                                    isLoading: true,
                                })
                                {

                                    Api.post('EditAccountsDefaultList', this.state.EditListData).then(
                                        res => {
                                            this.setState({
                                                rows: res,
                                                isLoading: false,
                                                IsEdit: false
                                            })
                                        }
                                    )
                                    this.setState({
                                        isLoading: true,
                                        ShowPopup: false,
                                        IsEdit: false
                                    })
                                }
                            }} >

                            {({ errors, touched, handleBlur, handleChange, handleSubmit }) => (

                                <Form onSubmit={handleSubmit}>
                                    <div className="dropWrapper">

                                        <div className="fillter-status fillter-item-c">
                                            <div className="linebylineInput valid-input label__block">
                                                <label className="control-label">{Resources['titleEn'][currentLanguage]} </label>
                                                <div className="ui input inputDev" >
                                                    <input type='text' name='EnTitleForEdit' className="form-control" autoComplete='off'
                                                        value={this.state.EditListData.title} placeholder={Resources['titleEn'][currentLanguage]}
                                                        onBlur={(e) => { handleBlur(e) }}
                                                        onChange={(e) => {
                                                            handleChange(e)
                                                            this.setState({ EditListData: { ...this.state.EditListData, title: e.target.value } })
                                                        }
                                                        } />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="fillter-status fillter-item-c">
                                            <div className="linebylineInput valid-input label__block">
                                                <label className="control-label">{Resources['titleAr'][currentLanguage]} </label>
                                                <div className={errors.ARTitleForEdit && touched.ARTitleForEdit ?
                                                    ("ui input inputDev has-error") : "ui input inputDev"} >
                                                    <input name='ARTitleForEdit' className="form-control" autoComplete='off'
                                                        value={this.state.EditListData.titleAr} placeholder={Resources['titleAr'][currentLanguage]}
                                                        onBlur={(e) => { handleBlur(e) }} onChange={(e) => {
                                                            handleChange(e)
                                                            this.setState({ EditListData: { ...this.state.EditListData, titleAr: e.target.value } })
                                                        }} />
                                                    {errors.ARTitleForEdit && touched.ARTitleForEdit ? (
                                                        <em className="pError">{errors.ARTitleForEdit}</em>) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="fillter-status fillter-item-c">
                                            <div className="linebylineInput valid-input label__block">
                                                <label className="control-label">{Resources['abbreviation'][currentLanguage]} </label>
                                                <div className={errors.AbbreviationForEdit && touched.AbbreviationForEdit ?
                                                    ("ui input inputDev has-error") : "ui input inputDev"} >
                                                    <input name='AbbreviationForEdit' autoComplete='off'
                                                        value={this.state.EditListData.abbreviation} className="form-control" placeholder={Resources['abbreviation'][currentLanguage]}
                                                        onBlur={(e) => { handleBlur(e) }} onChange={(e) => {
                                                            handleChange(e)
                                                            this.setState({ EditListData: { ...this.state.EditListData, abbreviation: e.target.value } })
                                                        }} />
                                                    {errors.AbbreviationForEdit && touched.AbbreviationForEdit ? (
                                                        <em className="pError">{errors.AbbreviationForEdit}</em>) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropBtn">
                                            <button className="primaryBtn-1 btn" type='submit'   >
                                                {Resources['save'][currentLanguage]}</button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>

                        :

                        <Formik
                            initialValues={{
                                EnTitle: '',
                                ARTitle: '',
                                Abbreviation: ''
                            }}
                            validationSchema={ValidtionSchema}

                            onSubmit={(values, actions) => {
                                this.setState({
                                    isLoading: true,
                                })
                                Api.post('AddAccountsDefaultList', { 'title': values.EnTitle, 'titleAr': values.ARTitle, 'abbreviation': values.Abbreviation, 'listType': this.state.listType }).then(
                                    res => {
                                        this.setState({
                                            rows: res,
                                            isLoading: false,
                                        })
                                    }
                                )
                                actions.setSubmitting(false);
                                values.EnTitle = ''
                                values.ARTitle = ''
                                values.Abbreviation = ''
                                this.setState({
                                    isLoading: true,
                                    ShowPopup: false
                                })
                            }} >

                            {({ errors, touched, handleBlur, handleChange, values, handleSubmit }) => (
                                <Form onSubmit={handleSubmit}>
                                    <div className="dropWrapper">
                                        <div className="fillter-status fillter-item-c">
                                            <div className="linebylineInput valid-input label__block">
                                                <label className="control-label">{Resources['titleEn'][currentLanguage]} </label>
                                                <div className="ui input inputDev" >
                                                    <input type='text' name='EnTitle' className="form-control" autoComplete='off'
                                                        value={values.EnTitle} placeholder={Resources['titleEn'][currentLanguage]}
                                                        onBlur={(e) => { handleBlur(e) }}
                                                        onChange={(e) => { handleChange(e) }
                                                        } />

                                                </div>
                                            </div>
                                        </div>

                                        <div className="fillter-status fillter-item-c">
                                            <div className="linebylineInput valid-input label__block">
                                                <label className="control-label">{Resources['titleAr'][currentLanguage]} </label>
                                                <div className={errors.ARTitle && touched.ARTitle ?
                                                    ("ui input inputDev has-error") : "ui input inputDev"} >
                                                    <input name='ARTitle' className="form-control" autoComplete='off'
                                                        value={values.ARTitle} placeholder={Resources['titleAr'][currentLanguage]}
                                                        onBlur={(e) => { handleBlur(e) }} onChange={(e) => { handleChange(e) }} />
                                                    {errors.ARTitle && touched.ARTitle ? (
                                                        <em className="pError">{errors.ARTitle}</em>) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="fillter-status fillter-item-c">
                                            <div className="linebylineInput valid-input label__block">
                                                <label className="control-label">{Resources['abbreviation'][currentLanguage]} </label>
                                                <div className={errors.Abbreviation && touched.Abbreviation ?
                                                    ("ui input inputDev has-error") : "ui input inputDev"} >
                                                    <input name='Abbreviation' autoComplete='off'
                                                        value={values.Abbreviation} className="form-control" placeholder={Resources['abbreviation'][currentLanguage]}
                                                        onBlur={(e) => { handleBlur(e) }} onChange={(e) => { handleChange(e) }} />
                                                    {errors.Abbreviation && touched.Abbreviation ? (
                                                        <em className="pError">{errors.Abbreviation}</em>) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="dropBtn">
                                            <button className="primaryBtn-1 btn" type='submit'   >
                                                {Resources['save'][currentLanguage]}</button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    }
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
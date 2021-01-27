import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Export from "../../Componants/OptionsPanels/Export";
import config from "../../Services/Config";
import Resources from "../../resources.json";
import Api from '../../api';
import { SelectedProjectEps } from './ProjectEPSData'
import { toast } from "react-toastify";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice"
import DropdownMelcous from '../../Componants/OptionsPanels/DropdownMelcous';
import { SkyLightStateless } from 'react-skylight';
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";

import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProject = localStorage.getItem('lastSelectedProject')
const find = require('lodash/find')
let PathName = '';
let ProjectEps = ''
const ValidtionSchema = Yup.object().shape({
    ArabicTitle: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    EnglishTitle: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    DropName: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage])
        .nullable(true),
});

const ValidtionSchemaForArea = Yup.object().shape({
    ArabicTitle: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
    EnglishTitle: Yup.string()
        .required(Resources['isRequiredField'][currentLanguage]),
});


class ProjectSetup extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showCheckbox: false,
            columns: [],
            isLoading: true,
            rows: [],
            selectedRows: [],
            showDeleteModal: false,
            MaxArrange: 0,
            ApiData: '',
            title: '',
            ApiAdd: '',
            ApiEdit: '',
            ApiDelete: '',
            ApiDrop: '',
            ApiGetById: '',
            ProjectEps: [],
            ShowPopup: false,
            IsEditModel: false,
            DropName: '',
            ProjectEPSDataForEdit: '',
            DropData: [],
            SelectDropData: '',
            TypeId: 0,
            FilterColumns: [],
            ApiFilter: '',
            viewfilter: false,
            query: '',

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

    componentWillMount = () => {
        PathName = this.props.location.pathname.split('/')

        this.props.actions.FillGridLeftMenu();
        this.renderComponent()
    }

    renderComponent() {
        this.setState({
            isLoading: true
        })

        ProjectEps = SelectedProjectEps(PathName[1])
        let ViewPermission = 0
        ProjectEps.map(s => { ViewPermission = s.ViewPermission });

        if (!config.IsAllow(ViewPermission)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
        }
        else {
            this.setState({
                ProjectEps: ProjectEps[0], ApiData: ProjectEps[0].ApiData, title: ProjectEps[0].title, ApiAdd: ProjectEps[0].ApiAdd, ApiEdit: ProjectEps[0].ApiEdit,
                ApiDelete: ProjectEps[0].ApiDelete, ApiDrop: ProjectEps[0].ApiDrop, ApiGetById: ProjectEps[0].ApiGetById, FilterColumns: ProjectEps[0].FilterColumns,
                columns: ProjectEps[0].Columns.filter(column => column.visible !== false), DropName: ProjectEps[0].DropName, TypeId: ProjectEps[0].TypeId,
                ApiFilter: ProjectEps[0].ApiFilter, EditPermission: ProjectEps[0].EditPermission, AddPermission: ProjectEps[0].AddPermission, ViewPermission: ProjectEps[0].ViewPermission,
                DeletePermission: ProjectEps[0].DeletePermission
            })

            if (ProjectEps[0].title !== 'Area') {
                dataservice.GetDataList(ProjectEps[0].ApiDrop, 'parentName', 'id').then(
                    res => {
                        this.setState({
                            DropData: res
                        })
                    }
                )
            }
        }
    }

    componentDidMountRender = () => {
        Api.get(ProjectEps[0].ApiData).then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        )
        if (config.IsAllow(this.state.DeletePermission)) {
            this.setState({
                showCheckbox: true
            })
        }
    }

    componentWillReceiveProps(nextProps, prevState) {
        if (nextProps.match !== this.props.match) {

            PathName = nextProps.match.url.split('/')
            this.renderComponent()
            this.componentDidMountRender()
        }

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
            let url = this.state.ApiFilter + "&projectId=" + CurrProject + "&type=" + this.state.TypeId + '&query=' + _query[0] + '}'
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


    };

    componentDidMount = () => {
        this.componentDidMountRender()
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

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
        Api.post(this.state.ApiDelete, this.state.selectedRows).then(
            res => {
                let originalRows = this.state.rows
                let selectedRows = this.state.selectedRows;
                selectedRows.map((i) => {
                    originalRows = originalRows.filter(r => r.id !== i);
                })
                this.setState({
                    rows: originalRows,
                    showDeleteModal: false,
                    isLoading: false,
                    MaxArrange: Math.max.apply(Math, originalRows.map(function (o) { return o.arrange + 1 }))
                })
                toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
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

    ShowPopup = () => {
        this.setState({
            ShowPopup: true,
        })
    }

    onRowClick = (obj) => {
        if (!config.IsAllow(this.state.EditPermission)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
        }
        else {
            Api.get(this.state.ApiGetById + obj.id).then(
                res => {
                    let selectDrop = find(this.state.DropData, function (i) { return i.value === res.parentId });
                    {
                        this.state.title === 'Area' ?
                            this.setState({
                                ShowPopup: true,
                                IsEditModel: true,
                                ProjectEPSDataForEdit: res,
                            })
                            :
                            this.setState({
                                ShowPopup: true,
                                IsEditModel: true,
                                ProjectEPSDataForEdit: res,
                                SelectDropData: selectDrop
                            })
                    }
                }
            )
        }
    }

    handleChangeDropsForEdit = (e) => {
        this.setState({
            SelectDropData: e
        })
    }

    AddEditProjectEps = (values, actions) => {

        this.setState({
            isLoading: true
        })

        if (this.state.IsEditModel) {
            if (this.state.title === 'Area') {
                let ObjArea = {
                    id: this.state.ProjectEPSDataForEdit.id,
                    titleEn: this.state.ProjectEPSDataForEdit.titleEn,
                    titleAr: this.state.ProjectEPSDataForEdit.titleAr,
                    projectId: CurrProject,
                    code: '',
                    type: this.state.TypeId,
                }
                Api.post(this.state.ApiEdit, ObjArea).then(
                    res => {
                        let NewData = this.state.rows.filter(s => s.id !== this.state.ProjectEPSDataForEdit.id)
                        NewData.unshift(res)
                        this.setState({
                            rows: NewData,
                            isLoading: false,
                            ShowPopup: false,
                        })
                    }
                )
            }
            else {
                Api.post(this.state.ApiEdit, {
                    id: this.state.ProjectEPSDataForEdit.id,
                    titleEn: this.state.ProjectEPSDataForEdit.titleEn,
                    titleAr: this.state.ProjectEPSDataForEdit.titleAr,
                    parentId: this.state.SelectDropData.value,
                    code: '',
                    type: this.state.TypeId,
                }).then(
                    res => {
                        let NewData = this.state.rows.filter(s => s.id !== this.state.ProjectEPSDataForEdit.id)
                        NewData.unshift(res)
                        this.setState({
                            rows: NewData,
                            isLoading: false,
                            ShowPopup: false
                        })
                    }
                )
            }
        }

        else {
            if (this.state.title === 'Area') {
                Api.post(this.state.ApiAdd, {
                    id: undefined,
                    titleEn: values.EnglishTitle,
                    titleAr: values.ArabicTitle,
                    projectId: CurrProject,
                    code: '',
                    type: this.state.TypeId,
                }).then(
                    res => {
                        let OldData = this.state.rows
                        OldData.unshift(res)
                        this.setState({
                            rows: OldData,
                            isLoading: false,
                            ShowPopup: false
                        })
                    }
                )
            }
            else {
                Api.post(this.state.ApiAdd, {
                    id: undefined,
                    titleEn: values.EnglishTitle,
                    titleAr: values.ArabicTitle,
                    parentId: values.DropName.value,
                    code: '',
                    type: this.state.TypeId,
                }).then(
                    res => {
                        let OldData = this.state.rows
                        OldData.unshift(res)
                        this.setState({
                            rows: OldData,
                            isLoading: false,
                            ShowPopup: false
                        })
                    }
                )
            }
        }
        this.setState({
            IsEditModel: false
        })
        values.EnglishTitle = ''
        values.ArabicTitle = ''
        values.DropName = ''
        toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
    }

    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridCustom
                    ref='custom-data-grid'
                    gridKey="ProjectSetup"
                    data={this.state.rows}
                    pageSize={this.state.rows.length}
                    groups={[]}
                    actions={this.actions}
                    rowActions={[]}
                    cells={this.state.columns}
                    rowClick={(cell) => { this.onRowClick(cell) }}
                />
            ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns} fileName={this.state.title} />
            : null
        return (
            <Fragment>
                {!this.state.isLoading ?
                    <div className='mainContainer'>
                        {/*Render Filter  */}
                        <div className="submittalFilter readOnly__disabled">
                            <div className="subFilter">
                                <h3 className="zero">{this.state.title}</h3>
                            </div>
                            <div className="filterBTNS">
                                {config.IsAllow(this.state.AddPermission) ?
                                    <button className="primaryBtn-1 btn mediumBtn" onClick={this.ShowPopup}>New</button>
                                    : null}
                                {btnExport}
                            </div>

                        </div>
                        {/* PopupAddEdit */}
                        <div className="skyLight__form">
                            <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false, IsEditModel: false })}
                                title={this.state.IsEditModel ? Resources['editTitle'][currentLanguage] : Resources['goAdd'][currentLanguage]}
                                onCloseClicked={() => this.setState({ IsEditModel: false, ShowPopup: false })} isVisible={this.state.ShowPopup}>
                                <Formik

                                    initialValues={{
                                        EnglishTitle: this.state.IsEditModel ? this.state.ProjectEPSDataForEdit.titleEn : '',
                                        ArabicTitle: this.state.IsEditModel ? this.state.ProjectEPSDataForEdit.titleAr : '',
                                        DropName: this.state.IsEditModel ? ' ' : '',

                                    }}

                                    enableReinitialize={true}

                                    validationSchema={this.state.title === 'Area' ? ValidtionSchemaForArea : ValidtionSchema}

                                    onSubmit={(values, actions) => {

                                        this.AddEditProjectEps(values, actions)
                                    }}>

                                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                        <Form onSubmit={handleSubmit}>


                                            <div className='document-fields'>
                                                <div className="proForm datepickerContainer">

                                                    <div className="linebylineInput fullInputWidth">
                                                        <label className="control-label">{Resources['titleEn'][currentLanguage]}</label>
                                                        <div className={'ui input inputDev ' + (errors.EnglishTitle && touched.EnglishTitle ? 'has-error' : null) + ' '}>
                                                            <input autoComplete="off" value={this.state.IsEditModel ? this.state.ProjectEPSDataForEdit.titleEn : values.EnglishTitle}
                                                                className="form-control" name="EnglishTitle" onBlur={(e) => { handleBlur(e) }}
                                                                onChange={(e) => {
                                                                    handleChange(e)
                                                                    if (this.state.IsEditModel) {
                                                                        this.setState({ ProjectEPSDataForEdit: { ...this.state.ProjectEPSDataForEdit, titleEn: e.target.value } })
                                                                    }
                                                                }}
                                                                placeholder={Resources['titleEn'][currentLanguage]} />
                                                            {errors.EnglishTitle && touched.EnglishTitle ?
                                                                <Fragment>
                                                                    <span className='glyphicon glyphicon-remove form-control-feedback spanError'>
                                                                    </span>
                                                                    <em className="pError">{errors.EnglishTitle}</em>
                                                                </Fragment>
                                                                : values.EnglishTitle !== '' ?
                                                                    <span className='glyphicon form-control-feedback glyphicon-ok'> </span>
                                                                    : null}
                                                        </div>
                                                    </div>

                                                    <div className="linebylineInput fullInputWidth">
                                                        <label className="control-label">{Resources['titleAr'][currentLanguage]}</label>
                                                        <div className={'ui input inputDev ' + (errors.ArabicTitle && touched.ArabicTitle ? 'has-error' : null) + ' '}>
                                                            <input autoComplete="off" value={this.state.IsEditModel ? this.state.ProjectEPSDataForEdit.titleAr : values.ArabicTitle}
                                                                className="form-control" name="ArabicTitle" onBlur={(e) => { handleBlur(e) }}
                                                                onChange={(e) => {
                                                                    handleChange(e)
                                                                    if (this.state.IsEditModel) {
                                                                        this.setState({ ProjectEPSDataForEdit: { ...this.state.ProjectEPSDataForEdit, titleAr: e.target.value } })
                                                                    }
                                                                }}
                                                                placeholder={Resources['titleAr'][currentLanguage]} />
                                                            {errors.ArabicTitle && touched.ArabicTitle ? (
                                                                <Fragment>
                                                                    <span className='glyphicon glyphicon-remove form-control-feedback spanError'>
                                                                    </span>
                                                                    <em className="pError">{errors.ArabicTitle}</em>
                                                                </Fragment>
                                                            ) :
                                                                values.ArabicTitle !== '' ?
                                                                    <span className='glyphicon form-control-feedback glyphicon-ok'> </span>
                                                                    : null

                                                            }

                                                        </div>
                                                    </div>
                                                    {this.state.title === 'Area' ? null
                                                        : <div className="linebylineInput valid-input">
                                                            <DropdownMelcous
                                                             isClear={true} title={this.state.DropName} data={this.state.DropData} name='DropName'
                                                                selectedValue={this.state.IsEditModel ? this.state.SelectDropData : values.DropName} onChange={setFieldValue}
                                                                handleChange={(e) => this.handleChangeDropsForEdit(e, "DropName")}
                                                                onBlur={setFieldTouched}
                                                                error={errors.DropName}
                                                                touched={touched.DropName}
                                                                value={values.DropName} />
                                                        </div>}
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

                        {/* Grid And Filter  */}
                        <div className="filterHidden"
                            style={{
                                maxHeight: this.state.viewfilter ? "" : "0px",
                                overflow: this.state.viewfilter ? "" : "hidden"
                            }}>
                            <div className="gridfillter-container">
                            </div>
                        </div>
                        <div className="grid-container">
                            {dataGrid}
                        </div>

                        {this.state.showDeleteModal === true ? (
                            <ConfirmationModal
                                title={Resources['smartDeleteMessageContent'][currentLanguage]}
                                closed={this.onCloseModal}
                                showDeleteModal={this.state.showDeleteModal}
                                clickHandlerCancel={this.clickHandlerCancelMain}
                                buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                            />
                        ) : null}

                    </div>
                    : <LoadingSection />}
            </Fragment>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        projectId: state.communication.projectId,
        showLeftMenu: state.communication.showLeftMenu,
        showSelectProject: state.communication.showSelectProject,
        projectName: state.communication.projectName
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ProjectSetup))
import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import GridSetup from "../Communication/GridSetup";
import Export from "../../Componants/OptionsPanels/Export";
import config from "../../Services/Config";
import Resources from "../../resources.json";
import Api from '../../api';
import { SelectedProjectEps } from './ProjectEPSData'
import { toast } from "react-toastify";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice"
import Filter from "../../Componants/FilterComponent/filterComponent";
import DropdownMelcous from '../../Componants/OptionsPanels/DropdownMelcous';
import { SkyLightStateless } from 'react-skylight';

import { connect } from 'react-redux';
import {
  bindActionCreators
} from 'redux';
import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProject = localStorage.getItem('lastSelectedProject')
const _ = require('lodash') 
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
    }

    componentWillMount = () => {
        PathName = this.props.location.pathname.split('/')
        this.renderComponent()
    }

    renderComponent = () => {
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
        this.props.actions.FillGridLeftMenu();

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

                this.state.selectedRows.map(i => {
                    originalRows = originalRows.filter(r => r.id !== i);
                })
                this.setState({
                    rows: originalRows,
                    showDeleteModal: false,
                    isLoading: false,
                    MaxArrange: Math.max.apply(Math, originalRows.map(function (o) { return o.arrange + 1 }))
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
                    let selectDrop = _.find(this.state.DropData, function (i) { return i.value == res.parentId });
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
                columns={this.state.columns} fileName={this.state.title} />
            : null
        const ComponantFilter = this.state.isLoading === false ?
            <Filter
                filtersColumns={this.state.FilterColumns}
                filterMethod={this.filterMethodMain}
            /> : null;

        return (
            <Fragment>
                {!this.state.isLoading ?
                    <div className='mainContainer'>
                        {/*Render Filter  */}
                        <div className="submittalFilter">
                            <div className="subFilter">
                                <h3 className="zero">{this.state.title}</h3>
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

                                                    <div className="linebylineInput valid-input">
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

                                                    <div className="linebylineInput valid-input">
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
                                                            <div className="inputDev ui input">
                                                                <DropdownMelcous title={this.state.DropName} data={this.state.DropData} name='DropName'
                                                                    selectedValue={this.state.IsEditModel ? this.state.SelectDropData : values.DropName} onChange={setFieldValue}
                                                                    handleChange={(e) => this.handleChangeDropsForEdit(e, "DropName")}
                                                                    onBlur={setFieldTouched}
                                                                    error={errors.DropName}
                                                                    touched={touched.DropName}
                                                                    value={values.DropName} />
                                                            </div>
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
                                {ComponantFilter}
                            </div>
                        </div>
                        <div className="grid-container">
                            {dataGrid}
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
  )( withRouter(ProjectSetup))
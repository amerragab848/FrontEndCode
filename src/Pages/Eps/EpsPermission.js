import React, { Component, Fragment } from 'react'
import Edit from "../../Styles/images/epsActions/edit.png";
import Plus from "../../Styles/images/epsActions/plus.png";
import Delete from "../../Styles/images/epsActions/delete.png";
import EyeShow from '../../Styles/images/EyeShow.png'
import Api from '../../api';
import Resources from '../../resources.json';
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import CryptoJS from 'crypto-js'
import { bindActionCreators } from 'redux';
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import SkyLight from 'react-skylight';
import { Formik, Form } from 'formik';
import { object, string } from 'yup';
import * as communicationActions from '../../store/actions/communication';
import Config from '../../Services/Config';
import Dropdown from '../../Componants/OptionsPanels/DropdownMelcous'
import Dataservice from '../../Dataservice';
import { withRouter } from "react-router-dom";

const _ = require('lodash')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const validationSchema = object().shape({
    englishTitle: string().required(Resources['titleEnValid'][currentLanguage]),
    arabicTitle: string().required(Resources['titleArValid'][currentLanguage])

});

var treeContainer = []
class EpsPermission extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoadingEps: false,
            isLoading: false,
            values: {
                showInReport: true
            },
            eps: [],
            projects: [],
            item: {},
            type: '',
            isEdit: false,
            showDeleteModal: false
        }

        if (!Config.IsAllow(1260) || !Config.IsAllow(1263) || !Config.IsAllow(1264)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({ pathname: "/" });
        }
    }

    addEditEps = () => {
        if (this.state.isEdit) {
            if (!Config.IsAllow(1263)) {
                toast.success(Resources["missingPermissions"][currentLanguage]);
            }
            else {
                this.setState({ isLoading: true })
                let item = Object.assign(this.state.item,
                    { title: this.state.values.englishTitle },
                    { titleAr: this.state.values.arabicTitle },
                    { titleEn: this.state.values.englishTitle },
                    { abbrevation: this.state.values.abbrevation },
                    { showInReport: this.state.values.showInReport }
                )
                Dataservice.addObject("EditEpsById", item).then((res) => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                    this.setState({ isLoading: false, showModal: false, type: '' })
                }).catch(res => {
                    this.setState({ isLoading: false, showModal: false })

                });
            }
        } else {
            if (this.state.type != 'child' && !Config.IsAllow(1261)) {
                toast.success(Resources["missingPermissions"][currentLanguage]);
            }
            else if (this.state.type == 'child' && !Config.IsAllow(1262)) {
                toast.success(Resources["missingPermissions"][currentLanguage]);
            }
            else {
                let Eps = {
                    parentId: this.state.type == 'child' ? this.state.item.id : null,
                    titleEn: this.state.values.englishTitle,
                    titleAr: this.state.values.arabicTitle,
                    abbrevation: this.state.values.abbrevation,
                    showInReport: this.state.values.showInReport
                }
                this.setState({ isLoading: true })
                Dataservice.addObject("AddEps", Eps).then((res) => {
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                    this.setState({ isLoading: false, showModal: false, type: '', eps: res })
                }).catch(res => {
                    this.setState({ isLoading: false, showModal: false })

                });
            }
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true })
        Api.get('GetActiveProjects').then(res => {
            let projects = []
            if (res) {
                res.forEach(element => {
                    projects.push({ label: element.projectName, value: element.epsId })
                })
                this.setState({ projectsList: res, isLoading: false, projects })
            }
        })
        this.getData()
    }

    deleteRecord(recod) {
        if (!Config.IsAllow(1264)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
        }
        else {
            this.setState({ isLoadingEps: true })
            Api.get('GetEps').then(res => {
                this.setState({ eps: res, isLoadingEps: false })
            }).catch(() => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
            })
        }
    }

    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    ConfirmDelete = () => {

        if (!Config.IsAllow(1264)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
        }
        else {
            this.setState({ isLoading: true, showDeleteModal: false })
            Api.post("DeletEpsById?id=" + this.state.item.id).then((res) => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.setState({ isLoading: false, showModal: false, type: '' })
                this.deleteRecord(this.state.item)
            }).catch(res => {
                this.setState({ isLoading: false, showModal: false })
            });
        }
    }

    getData() {
        this.setState({ isLoadingEps: true })
        Api.get('GetEps').then(res => {
            this.setState({ eps: res ? res : [], isLoadingEps: false })
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
        })
    }

    view = (item) => {
        if (!Config.IsAllow(1265)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
        }
        else {
            let obj = {
                epsName: item.title,
                epsId: item.id
            };
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
            this.props.history.push({
                pathname: "/projects",
                search: "?id=" + encodedPaylod
            });
        }
    }

    openModal = (item, isEdit) => {
        if (isEdit) {
            this.setState({
                values: { ...this.state.values, englishTitle: item.titleEn, arabicTitle: item.titleAr, abbrevation: item.abbrevation, showInReport: item.showInReport },
                showModal: true
            })
            setTimeout(() => this.simpleDialog.show(), 300)
        }
        else {
            this.setState({ showModal: true, values: { ...this.state.values, englishTitle: '', arabicTitle: '', abbrevation: '', showInReport: false }, })
            this.simpleDialog.show()
        }
    }

    routeProjects = (event) => {
        if (!Config.IsAllow(1265)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
        }
        else {
            let eps = _.find(this.state.projectsList, (item) => item.epsId == event.value)
            let obj = {
                epsName: eps.projectName,
                epsId: eps.epsId
            };
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj))
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms)
            this.props.history.push({
                pathname: "/projects",
                search: "?id=" + encodedPaylod
            });
        }
    }

    search(id, trees, updateTrees, parentId) {
        trees.map(item => {
            updateTrees.push(item);
            if (item.epses.length > 0) {
                let state = this.state;
                state['_' + item.id] = state['_' + item.id] ? state['_' + item.id] : false;
                this.setState({ state });
                this.search(id, item.epses, updateTrees, parentId);
            }
        });
        return updateTrees;
    };


    viewChild(item) {
        let eps = [...this.state.eps];
        let state = this.state;
        state['_' + item.id] = !state['_' + item.id];
        this.search(item.id, eps, [], item.parentId);
        this.setState({
            eps,
            isLoadingEps: false
        });
    }

    printChild(children) {
        return (
            children.map((item, i) => {
                return (
                    <Fragment key={item.id}>
                        <div className={this.state[item.id] == -1 ? ' epsTitle' : this.state['_' + item.id] === true ? 'epsTitle active' : 'epsTitle'} key={item.id} onClick={() => this.viewChild(item)}
                            style={{ display: this.state[item.id] == -1 ? 'none' : '' }} >
                            <div className="listTitle">
                                <span className="dropArrow" style={{ visibility: (item.epses.length > 0 ? '' : 'hidden') }}>
                                    <i className="dropdown icon" />
                                </span>
                                <span className="accordionTitle">{this.state[item.id] ? this.state[item.id].titleEn : item.titleEn}
                                </span>
                            </div>
                            <div className="Project__num">
                                <div className="eps__actions">
                                    <a className="editIcon" onClick={() => { this.setState({ item: item, isEdit: true, type: 'child' }, function () { this.openModal(item, true); }) }}>
                                        <img src={Edit} alt="Edit" />
                                    </a>
                                    <a className="plusIcon" onClick={() => { this.setState({ item: item, isEdit: false, type: 'child' }, function () { this.openModal(item, false); }) }}>
                                        <img src={Plus} alt="Add" />
                                    </a>
                                    <a className="deleteIcon" onClick={() => this.setState({ item, item, showDeleteModal: true })}>
                                        <img src={Delete} alt="Delete" />
                                    </a>
                                    <a className="fourth_epsIcon" onClick={() => this.view(item)}>
                                        <img src={EyeShow} alt="pend" width="100%" height="100%" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="epsContent">
                            {item.epses.length > 0 ? this.printChild(item.epses) : null}
                        </div>
                    </Fragment>
                )
            })
        )
    }

    clear = () => {
        let treeDocument = {
            parentId: "",
            titleEn: "",
            showInReport: false,
            titleAr: "",
            parentId: ""
        };
        this.setState({ document: treeDocument })
    }

    render() {

        let RenderAddEditEps = <Fragment>
            <div>
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik
                    initialValues={{
                        englishTitle: this.state.values.englishTitle,
                        arabicTitle: this.state.values.arabicTitle,
                        abbrevation: this.state.values.abbrevation
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        this.addEditEps()
                    }} >
                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldTouched, setFieldValue, values }) => (
                        <Form id=" MinutesOfMeeting" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                            <div className="dropWrapper fullInputWidth">
                                <div className="fillter-status fillter-item-c ">
                                    <label className="control-label">{Resources['titleEn'][currentLanguage]} </label>
                                    <div className={"inputDev ui input " + (errors.englishTitle ? 'has-error' : !errors.englishTitle && touched.englishTitle ? (" has-success") : " ")}>
                                        <input name='englishTitle'
                                            className="form-control"
                                            id="englishTitle" placeholder={Resources['titleEn'][currentLanguage]} autoComplete='off'
                                            onBlur={handleBlur} value={values.englishTitle || ''}
                                            onChange={e => {
                                                handleChange(e);
                                                this.setState({ values: { ...this.state.values, englishTitle: e.target.value } })
                                            }} />
                                        {errors.englishTitle ? (<em className="pError">{errors.englishTitle}</em>) : null}
                                    </div>
                                </div>
                                <div className="fillter-status fillter-item-c">
                                    <label className="control-label">{Resources['titleAr'][currentLanguage]} </label>
                                    <div className={"inputDev ui input " + (errors.arabicTitle ? 'has-error' : !errors.arabicTitle && touched.arabicTitle ? (" has-success") : " ")}>
                                        <input name='arabicTitle'
                                            className="form-control"
                                            id="arabicTitle" placeholder={Resources['titleAr'][currentLanguage]} autoComplete='off'
                                            onBlur={handleBlur} value={values.arabicTitle || ''}
                                            onChange={e => {
                                                handleChange(e);
                                                this.setState({ values: { ...this.state.values, arabicTitle: e.target.value } })
                                            }} />
                                        {errors.arabicTitle ? (<em className="pError">{errors.arabicTitle}</em>) : null}
                                    </div>
                                </div>
                                <div className="fillter-status fillter-item-c">
                                    <label className="control-label">{Resources['abbrevation'][currentLanguage]} </label>
                                    <div className="inputDev ui input ">
                                        <input name='abbrevation'
                                            className="form-control"
                                            id="abbrevation" placeholder={Resources['abbrevation'][currentLanguage]} autoComplete='off'
                                            onBlur={handleBlur} value={values.abbrevation || ''}
                                            onChange={e => {
                                                handleChange(e);
                                                this.setState({ values: { ...this.state.values, abbrevation: e.target.value } })
                                            }} />
                                    </div>
                                </div>
                                <div className="fillter-status fillter-item-c">
                                    <div className="ui checkbox checkBoxGray300 checked">
                                        <input type="checkbox" defaultChecked={this.state.item.showInReport} onChange={e => {
                                            handleChange(e);
                                            this.setState({ values: { ...this.state.values, showInReport: e.target.checked } })
                                        }} />
                                        <label>{Resources.showInReport[currentLanguage]}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="slider-Btns fullWidthWrapper">
                                <button className={"primaryBtn-1 btn"} type="submit"  >{Resources['save'][currentLanguage]}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Fragment>

        return (
            <div className="mainContainer main__fulldash white-bg" style={{ padding: '40px' }}>
                <Dropdown title="chooseProject" handleChange={event => this.routeProjects(event)}
                    data={this.state.projects} selectedValue={this.state.selectedProject} />

                {this.state.isLoadingEps == true ? <LoadingSection /> :
                    <Fragment>
                        <div className="tree__header" >
                            <h2 className="zero"></h2>
                            <button className="primaryBtn-1 btn" onClick={() => { this.setState({ isEdit: false, type: 'parent' }, function () { this.openModal('', false); }) }}>{Resources.addNew[currentLanguage]}</button>
                        </div>
                        <div className="documents-stepper noTabs__document">
                            <div className="tree__header">
                                <h2 className="zero">{Resources.EPS[currentLanguage]}</h2>
                            </div>
                            <div className="Eps__list">
                                {this.state.eps.map((item, i) => {
                                    if (treeContainer != null)
                                        treeContainer[item.id] = item
                                    return (
                                        <Fragment key={item.id}>
                                            <div className={this.state[item.id] == -1 ? ' epsTitle' : this.state['_' + item.id] === true ? 'epsTitle active' : 'epsTitle'} key={item.id}
                                                style={{ display: this.state[item.id] == -1 ? 'none' : '' }} onClick={() => this.viewChild(item)} >
                                                <div className="listTitle">
                                                    <span className="dropArrow" style={{ visibility: (item.epses.length > 0 ? '' : 'hidden') }}>
                                                        <i className="dropdown icon" />
                                                    </span>
                                                    <span className="accordionTitle" >{this.state[item.id] ? this.state[item.id].titleEn : item.titleEn}
                                                    </span>
                                                </div>
                                                <div className="Project__num">
                                                    <div className="eps__actions">
                                                        <a className="editIcon" onClick={() => { this.setState({ item: item, isEdit: true, type: 'child' }, function () { this.openModal(item, true); }) }}>
                                                            <img src={Edit} alt="Edit" />
                                                        </a>
                                                        <a className="plusIcon" onClick={() => { this.setState({ item: item, isEdit: false, type: 'child' }, function () { this.openModal(item, false); }) }}>
                                                            <img src={Plus} alt="Add" />
                                                        </a>
                                                        <a className="deleteIcon" onClick={() => this.setState({ item, item, showDeleteModal: true })}>
                                                            <img src={Delete} alt="Delete" />
                                                        </a>
                                                        <a className="fourth_epsIcon" onClick={() => this.view(item)}>
                                                            <img src={EyeShow} alt="pend" width="100%" height="100%" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="epsContent">
                                                {item.epses.length > 0 ? this.printChild(item.epses) : null}
                                            </div>
                                        </Fragment>
                                    )
                                })}
                            </div>
                        </div>
                    </Fragment>
                }
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null}
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref}
                        title={this.state.isEdit ? Resources['editEPS'][currentLanguage] : Resources['addEPS'][currentLanguage]}>
                        {RenderAddEditEps}
                    </SkyLight>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        files: state.communication.files,
        isLoadingFiles: state.communication.isLoadingFiles,
        changeStatus: state.communication.changeStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EpsPermission))

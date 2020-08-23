import React, { Component, Fragment } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Config from "../../Services/Config.js";
import * as communicationActions from "../../store/actions/communication";
import Edit from "../../Styles/images/epsActions/edit.png";
import Plus from "../../Styles/images/epsActions/plus.png";
import Delete from "../../Styles/images/epsActions/delete.png";
import CopyTo from "../../Styles/images/epsActions/copyTo.png";
import { SkyLightStateless } from 'react-skylight';
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import { toast } from "react-toastify";
var ar = new RegExp("^[\u0621-\u064A\u0660-\u0669 ]+$");
var en = new RegExp("\[\\u0600\-\\u06ff\]\|\[\\u0750\-\\u077f\]\|\[\\ufb50\-\\ufc3f\]\|\[\\ufe70\-\\ufefc\]");
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationSchema = Yup.object().shape({
    code: Yup.string().required(Resources['isRequiredField'][currentLanguage]),
    titleEn: Yup.string().test('projectNameEn', 'Name cannot be arabic', value => {
        return !en.test(value);
    }).required(Resources["titleEnRequired"][currentLanguage]),
    titleAr: Yup.string().required(Resources["titleArRequired"][currentLanguage]),
});

const validationSchemaForCopyTo = Yup.object().shape({
    newProjectId: Yup.string()
        .required(Resources['projectRequired'][currentLanguage])
        .nullable(true),
});


class boqStructure extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projectId: localStorage.getItem("lastSelectedProject"),
            trees: [],
            childerns: [],
            rowIndex: null,
            viewPopUp: false,
            AddingObj: {},
            isEdit: false,
            parentId: "",
            isLoading: false,
            drawChilderns: false,
            showDeleteModal: false,
            SelectedNodeId: "",
            IsEditMode: false,
            SelectedNode: {},
            ProjectsData: [],
            ViewCopyTo: false,
            number: 1,
            ViewCopyMultiple: false,
            newProjectId: { label: Resources.projectRequired[currentLanguage], value: "0" },
            ShowPayment: false,
            IsFirstParent: false
        };

        if (!Config.IsAllow(3670)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/DashBoard/" + this.state.projectId);
        }

        this.printChild = this.printChild.bind(this);
    }

    componentDidMount() {
        var links = document.querySelectorAll(
            ".noTabs__document .doc-container .linebylineInput"
        );

        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add("even");
            } else {
                links[i].classList.add("odd");
            }
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.projectId !== this.state.projectId) {
            this.setState({ isLoading: true });
            dataservice.GetDataGrid("GetAllBoqStructure?projectId=" + nextProps.projectId).then(result => {
                if (result) {
                    this.setState({ trees: result, projectId: nextProps.projectId, isLoading: false });
                }
                else {
                    this.setState({ trees: [], projectId: nextProps.projectId, isLoading: false });
                }
            }).catch(ex => {
                this.setState({ isLoading: false, trees: [] });
            });
        }
    }

    componentWillMount() {

        this.props.actions.documentForAdding();
        this.setState({ isLoading: true });
        dataservice.GetDataGrid("GetAllBoqStructure?projectId=" + this.state.projectId).then(result => {
            if (result) {
                this.setState({ trees: result, isLoading: false });
            }
            else {
                this.setState({ trees: [], isLoading: false });
            }
        }).catch(ex => {
            this.setState({ trees: [], isLoading: false });
        })

        dataservice.GetDataList('GetAccountsProjects', 'projectName', 'projectId').then(
            res => {
                this.setState({ ProjectsData: res });
            }
        ).catch(ex => { })
    }

    AddNode(item) {
        let AddingObj = {
            id: undefined, perentId: item.id,
            projectId: this.state.projectId, titleEn: '',
            titleAr: '', title: '', costCodingId: undefined,
            trees: '', showPaymentRequsition: false, code: '',
        }
        this.setState({
            parentId: item.id,
            viewPopUp: true,
            objDocument: item,
            SelectedNode: AddingObj,

        });
    }

    EditNode(item) {
        this.setState({
            parentId: item.id,
            SelectedNode: item,
            IsEditMode: true,
            viewPopUp: true,
        });
    }

    search(id, trees, updateTrees, parentId) {

        trees.map(item => {
            if (item.collapse === undefined) { item.collapse = true }
            if (id == item.id) {
                item.collapse = !item.collapse;
            } else {
                //item.collapse = item.id != parentId ? true : item.collapse; 
            }
            updateTrees.push(item);
            if (item.trees &&item.trees.length > 0) {
                this.search(id, item.trees, updateTrees, parentId);
            }
        });
        return updateTrees;
    }

    ViewPopUpCopyTo = (NodeId) => {
        this.setState({
            ViewCopyTo: true,
            SelectedNodeId: NodeId
        })
    }

    CopyToNode = (values) => {

        let obj = {
            oldProjectId: this.state.projectId,
            newProjectId: values.newProjectId.value,
            boqStractureId: this.state.SelectedNodeId
        }

        dataservice.addObject('CopyToBoqStracture', obj).then(
            res => {
                this.setState({
                    ViewCopyTo: false
                })
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }
        ).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        })

    }


    ViewPopUpCopyMultiple = (NodeId) => {
        this.setState({
            ViewCopyMultiple: true,
            SelectedNodeId: NodeId
        })
    }

    CopyMultipleNode = (values) => {

        dataservice.GetDataGrid('CopyBoqStractureMultipleTimes?number=' + this.state.number + "&boqStractureId=" + this.state.SelectedNodeId).then(res => {
            this.setState({
                ViewCopyMultiple: false
            })
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
        }
        ).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        })

    }

    printChild(children) {
        return (
            children.map((item, i) => {
                return (
                    <Fragment key={item.id}>
                        <div className={"epsTitle" + (item.collapse === false ? ' active' : ' ')} key={item.id} onClick={() => this.viewChild(item)} >
                            <div className="listTitle">

                                <span className="dropArrow" style={{ visibility: (item.trees.length > 0 ? '' : 'hidden') }}>
                                    <i className="dropdown icon" />
                                </span>

                                <span className="accordionTitle">{item.title + '-' + item.code}</span>
                            </div>
                            <div className="Project__num">
                                <div className="eps__actions">
                                    {Config.IsAllow(3657) ?
                                        <a className="editIcon" data-toggle="tooltip" title={Resources.edit[currentLanguage]} onClick={() => this.EditNode(item)}>
                                            <img src={Edit} alt="Edit" />
                                        </a>
                                        : null}

                                    {Config.IsAllow(3656) ?
                                        <a className="plusIcon" data-toggle="tooltip" title={Resources.add[currentLanguage]} onClick={() => this.AddNode(item)}>
                                            <img src={Plus} alt="Add" />
                                        </a>
                                        : null}

                                    {Config.IsAllow(3658) ?
                                        <a className="deleteIcon" data-toggle="tooltip" title={Resources.delete[currentLanguage]} onClick={() => this.DeleteNode(item.id)}>
                                            <img src={Delete} alt="Delete" />
                                        </a>
                                        : null}

                                    {Config.IsAllow(3671) ?
                                        <a className="copyTo" data-toggle="tooltip" title={Resources.copyTo[currentLanguage]} onClick={() => this.ViewPopUpCopyTo(item.id)}>
                                            <img src={CopyTo} alt="CopyTO" />
                                        </a>
                                        : null}
                                </div>
                            </div>
                        </div>
                        <div className="epsContent">
                            {item.trees.length > 0 ? this.printChild(item.trees) : null}
                        </div>
                    </Fragment>
                )
            })
        )
    }

    viewChild(item) {

        this.setState({
            isLoading: true
        });

        let trees = [...this.state.trees];

        this.search(item.id, trees, [], item.parentId);
        this.setState({
            trees,
            isLoading: false
        });
    }

    closePopUp() {
        this.state({
            viewPopUp: false
        });
    }

    handleChangePaymentRequisition = () => {
        let val = !this.state.ShowPayment
        this.setState({
            ShowPayment: val
        })
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    }

    DeleteNode(id) {
        this.setState({
            SelectedNodeId: id,
            showDeleteModal: true
        });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    ConfirmDeleteNode() {
        dataservice.addObject('DeleteBoqStructure?id=' + this.state.SelectedNodeId + '').then(result => {


            this.setState({
                showDeleteModal: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

        }).catch(ex => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    UpdateTree = (SelectedNode, NewNode) => {

        //let x = this.state.trees.trees.filter(s => s.perentId === NewNode.perentId)

        if (SelectedNode.perentId !== null) {
            if (this.state.IsEditMode) {
            }
            else {
                let data = this.state.trees
                let SelectedParent = ''

                data.map(element => {
                    if (element.trees) {
                        SelectedParent = element.trees.filter(s => s.id === SelectedNode.perentId)
                    }
                })
            }
            this.setState({
                isLoading: false,
                viewPopUp: false
            })
        }

        else {
            let data = this.state.trees
            if (this.state.IsEditMode) {
                data= data.filter(s => s.id !== SelectedNode.id)
                 data.push(NewNode)
            }

            else {
                data.push(NewNode)
            }

            this.setState({
                trees: data,
                isLoading: false,
                viewPopUp: false
            })
        }

    }

    AddEditNode = () => {

        this.setState({ isLoading: true })

        let EditObj = this.state.SelectedNode
        if (this.state.IsEditMode) {
            if (EditObj.perentId !== null) {
                EditObj.showPaymentRequsition = this.state.ShowPayment
            }

            dataservice.addObject('EditBoqStructure', EditObj).then(
                res => {
                    this.setState({ isLoading: false, viewPopUp: false })
                    this.UpdateTree(EditObj, res)
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    this.setState({ isLoading: false, viewPopUp: false })
                    toast.error(Resources["operationCanceled"][currentLanguage]);
                })
        }
        else {

            let AddingObj = {
                id: undefined, title: '', code: this.state.SelectedNode.code,
                perentId: this.state.IsFirstParent ? '' : this.state.SelectedNode.perentId,
                projectId: this.state.projectId, showPaymentRequsition: false,
                titleEn: this.state.SelectedNode.titleEn,
                titleAr: this.state.SelectedNode.titleAr,
                costCodingId: undefined, trees: '',
            }

            dataservice.addObject('AddBoqStructure', AddingObj).then(
                res => {
                    this.setState({ isLoading: false, viewPopUp: false })
                    this.UpdateTree(EditObj, res)
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    this.setState({ isLoading: false, viewPopUp: false })
                    toast.error(Resources["operationCanceled"][currentLanguage]);
                });
        }
    }

    handleChange(e, field) {
        let updated_document = this.state.SelectedNode;
        updated_document[field] = e.target.value;
        this.setState({
            SelectedNode: updated_document
        });
    }

    render() {

        let CopyMultiplePopup = () => {
            return (
                <Fragment>
                    <div className="dropWrapper" >
                        <div className="ui input inputDev">
                            <input type="number" className="form-control"
                                id="number"
                                value={this.state.number}
                                name="number"
                                placeholder={Resources.numberAbb[currentLanguage]}
                                onChange={e => this.setState({ number: e.target.value })}
                            />
                        </div> 
                        <div className="fullWidthWrapper">
                            <button className="primaryBtn-1 btn middle__btn" type="submit" onClick={e => this.CopyMultipleNode(e)} >{Resources["save"][currentLanguage]}</button>
                        </div> 
                    </div>
                </Fragment>
            )
        }

        let CopyToPopup = () => {
            return (
                <Fragment>
                    <Formik
                        initialValues={{
                            newProjectId: '',
                        }}

                        enableReinitialize={true}
                        validationSchema={validationSchemaForCopyTo}
                        onSubmit={(values) => {
                            this.CopyToNode(values)
                        }}>
                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                            <Form className="dropWrapper" onSubmit={handleSubmit}>

                                <Dropdown data={this.state.ProjectsData}
                                    selectedValue={this.state.newProjectId}
                                    handleChange={e => this.setState({ newProjectId: e })}
                                    onChange={setFieldValue} onBlur={setFieldTouched} title="Projects"
                                    error={errors.newProjectId} touched={touched.newProjectId}
                                    index="IR-newProjectId" name="newProjectId" id="newProjectId" />

                                <div className="fullWidthWrapper">
                                    <button className="primaryBtn-1 btn middle__btn" type="submit" >{Resources["save"][currentLanguage]}</button>
                                </div>

                            </Form>
                        )}
                    </Formik>
                </Fragment>
            )
        }

        return (
            <div className="mainContainer">
                <div className="documents-stepper noTabs__document">
                    <div className="tree__header">
                        <h2 className="zero">{Resources.boqStructure[currentLanguage]}</h2>
                        <button className="primaryBtn-1 btn " onClick={() => this.setState({ viewPopUp: true, IsEditMode: false, IsFirstParent: true })}>{Resources["goAdd"][currentLanguage]}</button>
                    </div>


                    {/* ParentNode */}
                    <div className="Eps__list">
                        {this.state.trees.length < 0 ? this.setState({ isLoading: false }) :
                            <Fragment>
                                {this.state.trees.map((item, i) => {
                                    return (
                                        <Fragment key={item.id}>
                                            <div className={"epsTitle" + (item.collapse === false ? ' active' : ' ')} key={item.id} onClick={() => this.viewChild(item)}>
                                                <div className="listTitle">
                                                    <span className="dropArrow">
                                                        <i className="dropdown icon" />
                                                    </span>
                                                    <span className="accordionTitle">{item.title + '-' + item.code}</span>
                                                </div>
                                                <div className="Project__num">
                                                    <div className="eps__actions">
                                                        {Config.IsAllow(3657) ?
                                                            <a className="editIcon" data-toggle="tooltip" title={Resources.edit[currentLanguage]} onClick={() => this.EditNode(item)}>
                                                                <img src={Edit} alt="Edit" />
                                                            </a>
                                                            : null}

                                                        {Config.IsAllow(3656) ?
                                                            <a className="plusIcon" data-toggle="tooltip" title={Resources.add[currentLanguage]} onClick={() => this.AddNode(item)}>
                                                                <img src={Plus} alt="Add" />
                                                            </a>
                                                            : null}

                                                        {Config.IsAllow(3658) ?
                                                            <a className="deleteIcon" data-toggle="tooltip" title={Resources.delete[currentLanguage]} onClick={() => this.DeleteNode(item.id)}>
                                                                <img src={Delete} alt="Delete" />
                                                            </a>
                                                            : null}

                                                        {Config.IsAllow(3671) ?

                                                            <Fragment>
                                                                <a className="copyTo" data-toggle="tooltip" title={Resources.copyTo[currentLanguage]} onClick={() => this.ViewPopUpCopyTo(item.id)}>
                                                                    <img src={CopyTo} alt="CopyTO" />
                                                                </a>
                                                                <a className="copyTo" data-toggle="tooltip" title={Resources.copyMultiple[currentLanguage]} onClick={() => this.ViewPopUpCopyMultiple(item.id)}>
                                                                    <img src={CopyTo} alt="copyMultiple" />
                                                                </a>
                                                            </Fragment>
                                                            : null}

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="epsContent">
                                                {item.trees?item.trees.length > 0 ? this.printChild(item.trees) : null:null}
                                            </div>
                                        </Fragment>
                                    )
                                })
                                }
                            </Fragment>
                        }
                    </div>
                </div>

                {this.state.isLoading ?
                    <LoadingSection /> : null
                }

                {/* CopyTo */}
                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ ViewCopyTo: false })}
                        title={Resources['copyTo'][currentLanguage]}
                        onCloseClicked={() => this.setState({ ViewCopyTo: false })} isVisible={this.state.ViewCopyTo}>
                        {CopyToPopup()}
                    </SkyLightStateless>
                </div>

                {/* CopyTo */}
                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ ViewCopyMultiple: false })}
                        title={Resources['copyMultiple'][currentLanguage]}
                        onCloseClicked={() => this.setState({ ViewCopyMultiple: false })} isVisible={this.state.ViewCopyMultiple}>
                        {CopyMultiplePopup()}
                    </SkyLightStateless>
                </div>


                {/* AddEditNode */}
                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ viewPopUp: false, IsEditMode: false })}
                        title={this.state.IsEditMode ? Resources['editTitle'][currentLanguage] : Resources['goAdd'][currentLanguage]}
                        onCloseClicked={() => this.setState({ viewPopUp: false, IsEditMode: false })} isVisible={this.state.viewPopUp}>
                        <Formik
                            initialValues={{
                                ...this.state.SelectedNode
                            }}

                            enableReinitialize={true}
                            validationSchema={validationSchema}
                            onSubmit={(values, actions) => {
                                this.AddEditNode()
                            }}>
                            {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                <Form className="dropWrapper proForm" onSubmit={handleSubmit}>

                                    <div className="fillter-item-c textarea-group">
                                        <label className="control-label">{Resources['titleEn'][currentLanguage]}</label>
                                        <div className={'ui input inputDev ' + (errors.titleEn && touched.titleEn ? 'has-error' : null) + ' '}>
                                            <textarea style={{ maxWidth: '100%' }} value={this.state.SelectedNode.titleEn} className="form-control" name="titleEn"
                                                onBlur={(e) => { handleBlur(e) }} onChange={(e) => { this.handleChange(e, 'titleEn') }}
                                                placeholder={Resources['titleEn'][currentLanguage]} ></textarea>
                                        </div>
                                        {errors.titleEn && touched.titleEn ? (<em className="pError">{errors.titleEn}</em>) : null}
                                    </div>

                                    <div className="fillter-item-c textarea-group">
                                        <label className="control-label">{Resources['titleAr'][currentLanguage]}</label>
                                        <div className={'ui input inputDev ' + (errors.titleAr && touched.titleAr ? 'has-error' : null) + ' '}>
                                            <textarea style={{ maxWidth: '100%' }} value={this.state.SelectedNode.titleAr} className="form-control" name="titleAr"
                                                onBlur={(e) => { handleBlur(e) }} onChange={(e) => { this.handleChange(e, 'titleAr') }}
                                                placeholder={Resources['titleAr'][currentLanguage]} ></textarea>
                                        </div>
                                        {errors.titleAr && touched.titleAr ? (<em className="pError">{errors.titleAr}</em>) : null}
                                    </div>

                                    <div className="letterFullWidth" style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <div className="linebylineInput">
                                            <label className="control-label">{Resources['code'][currentLanguage]}</label>
                                            <div className={'ui input inputDev ' + (errors.code && touched.code ? 'has-error' : null) + ' '}>
                                                <input autoComplete="off" value={this.state.SelectedNode.code} className="form-control" name="code"
                                                    onBlur={(e) => { handleBlur(e) }} onChange={(e) => { this.handleChange(e, 'code') }}
                                                    placeholder={Resources['code'][currentLanguage]} />
                                                {errors.code && touched.code ? (<em className="pError">{errors.code}</em>) : null}
                                            </div>
                                        </div>
                                        {this.state.IsEditMode ?
                                            this.state.SelectedNode.perentId === null ? null :
                                                <div className="ui checkbox checkBoxGray300 checked" style={{ marginLeft: currentLanguage === 'ar' ? '0' : '15px', marginRight: currentLanguage === 'ar' ? '15px' : '0', marginTop: '10px' }}>
                                                    <input type="checkbox" defaultChecked={this.state.SelectedNode.showPaymentRequsition ? 'checked' : null}
                                                        onChange={() => this.handleChangePaymentRequisition()} />
                                                    <label>{Resources['showPaymentRequisition'][currentLanguage]}</label>
                                                </div>
                                            : null}
                                    </div>

                                    <div className="fullWidthWrapper">
                                        {this.state.isLoading === false ? (
                                            <button className="primaryBtn-1 btn middle__btn" type="submit">{Resources["save"][currentLanguage]}</button>)
                                            : (<button className="primaryBtn-1 btn disabled">
                                                <div className="spinner"> <div className="bounce1" />  <div className="bounce2" /> <div className="bounce3" />
                                                </div>
                                            </button>
                                            )}
                                    </div>
                                </Form>
                            )}
                        </Formik>

                    </SkyLightStateless>
                </div>

                {/* DeleteModel */}
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources["smartDeleteMessage"][currentLanguage].content}
                        buttonName="delete"
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        clickHandlerContinue={this.ConfirmDeleteNode.bind(this)} />
                ) : null}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading,
        projectId: state.communication.projectId
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(boqStructure));

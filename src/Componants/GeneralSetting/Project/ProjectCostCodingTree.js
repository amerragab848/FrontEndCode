import React, { Component, Fragment } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import dataservice from "../../../Dataservice";
import Resources from "../../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Config from "../../../Services/Config.js";
import * as communicationActions from "../../../store/actions/communication";
import Delete from "../../../Styles/images/epsActions/delete.png";
import ConfirmationModal from "../../../Componants/publicComponants/ConfirmationModal";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import { toast } from "react-toastify";
import SkyLight from "react-skylight";
import Dropdown from "../../../Componants/OptionsPanels/DropdownMelcous";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");


const validationSchemaCostCodingTree = Yup.object().shape({
    costCodingTreeId: Yup.string().required(Resources["selectCostCosingTree"][currentLanguage]).nullable(true)
});

var treeContainer = []

class ProjectCostCodingTree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: 'add',
            projectId: props.match.params.projectId,
            trees: [],
            childerns: [],
            rowIndex: null,
            viewPopUp: false,
            objDocument: {},
            isEdit: false,
            parentId: "",
            isLoading: false,
            drawChilderns: false,
            showDeleteModal: false,
            docId: "",
            IsFirstParent: false,
            finish: false,
            document: {},
            costCodingTree: [],
            selectedValue: {
                label: Resources.selectCostCosingTree[currentLanguage],
                value: "0"
            },
            projects: [],
            viewAssignProject: false
        };

        if (!Config.IsAllow(3393) || !Config.IsAllow(3796)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push("/DashBoard/" + this.state.projectId);
        }

        this.printChild = this.printChild.bind(this);
    }

    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");

        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add("even");
            } else {
                links[i].classList.add("odd");
            }
        }

        this.props.actions.documentForAdding();

        dataservice.GetDataList("GetAllCostCodingTreeWithParentId?parentId=null", "codeTreeTitle", "id").then(result => {
            this.setState({
                costCodingTree: result
            });
        });

        this.getTree(this.state.projectId);
    }

    getTree = (projectId) => {
        this.setState({ isLoading: true });

        dataservice.GetDataGrid("GetNewCostCodingTreeByProjectId?projectId=" + projectId).then(result => {

            let state = this.state

            this.clear();

            if (result) {
                result.forEach(item => {
                    state[item.id] = item;
                    state['_' + item.id] = false
                });

                this.setState({
                    trees: result,
                    state,
                    isLoading: false,
                });
            }

            this.setState({ isLoading: false })
        });
    }

    AddDocument(item) {
        this.setState({
            parentId: item.id,
            isEdit: true,
            viewPopUp: true,
            objDocument: item,
            mode: 'add'
        });
        this.simpleDialog.show();
        this.clear();
    }

    EditDocument(item) {
        this.setState({
            isEdit: false,
            viewPopUp: true,
            document: item,
            mode: 'goEdit'
        });
        this.simpleDialog.show();
    }

    GetNodeData = (item) => {
        this.props.GetNodeData(item)
    }

    clear = () => {
        this.setState({
            selectedValue: {
                label: Resources.selectCostCosingTree[currentLanguage],
                value: "0"
            }
        });
    }

    search(id, trees, updateTrees, parentId) {

        trees.map(item => {
            updateTrees.push(item);
            if (item.trees.length > 0) {
                let state = this.state;
                state['_' + item.id] = state['_' + item.id] ? state['_' + item.id] : false;
                this.setState({ state });
                this.search(id, item.trees, updateTrees, parentId);
            }
        });
        return updateTrees;
    };

    printChild(children) {
        return (
            children.map((item, i) => {
                if (treeContainer != null)
                    treeContainer[item.id] = item
                return (
                    <Fragment key={i}>
                        <div className={this.state[item.id] === -1 ? ' epsTitle' : this.state['_' + item.id] === true ? 'epsTitle active' : 'epsTitle'} key={item.id} onClick={() => this.viewChild(item)}
                            style={{ display: this.state[item.id] === -1 ? 'none' : '' }} >
                            <div className="listTitle">
                                <span className="dropArrow" style={{ visibility: (item.trees.length > 0 ? '' : 'hidden') }}>
                                    <i className="dropdown icon" />
                                </span>
                                <span className="accordionTitle">
                                    {this.state[item.id] ? this.state[item.id].costCodingTreeName : item.costCodingTreeName}
                                </span>
                            </div>
                            {this.props.showActions == false ? null :
                                <div className="Project__num">
                                    {item.isView === true ? <div className="eps__actions">
                                        <a className="deleteIcon" data-toggle="tooltip" title="Delete" onClick={() => this.DeleteDocument(item.id)}>
                                            <img src={Delete} alt="Delete" />
                                        </a>
                                    </div> : null}
                                </div>}
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

        let trees = [...this.state.trees];
        let state = this.state;
        state['_' + item.id] = !state['_' + item.id];
        this.search(item.id, trees, [], item.parentId);
        this.setState({
            trees, state
        });
    }

    closePopUp() {
        this.setState({
            viewPopUp: false
        });
    }

    handleChange(e, field) {
        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = e.target.value;

        updated_document = Object.assign(original_document, updated_document);

        this.setState({
            document: updated_document
        });
    }

    DeleteDocument(id) {
        this.setState({
            docId: id,
            showDeleteModal: true
        });
    }

    clickHandlerContinueMain() {
        let state = this.state
        if (treeContainer != null) {
            treeContainer.forEach(item => {
                state[item.id] = item
            })
            this.setState({ state, isLoading: true })
        }
        dataservice.GetDataGrid("DeleteContractsCostCodingTreeProject?id=" + this.state.docId).then(result => {
            let state = this.state
            state[this.state.docId] = -1
            if (result != null)
                this.setState({ trees: result, showDeleteModal: false, state, isLoading: false })
            else
                this.setState({ showDeleteModal: false, state, isLoading: false });
            treeContainer = null;
            toast.success(Resources["operationSuccess"][currentLanguage]);

        }).catch(ex => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({ showDeleteModal: false, isLoading: false });
        });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    viewModalForFirst = () => {
        this.setState({ mode: 'goAdd', viewPopUp: true, isEdit: true, IsFirstParent: true });
        this.clear();
        this.simpleDialog.show();
    }


    assignCostCodingTreeByProject = () => {

        this.setState({
            isLoading: true
        });

        let obj = {
            projectId: this.state.projectId,
            costCodingTreeId: this.state.selectedValue.value
        }

        dataservice.addObject("AddContractsCostCodingTreeProject", obj).then(result => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({
                isLoading: false
            });
 
        });
    }


    render() {
        return (
            <div className={this.props.showActions == false ? '' : "mainContainer"}>
                <div className="documents-stepper noTabs__document">
                    {this.props.showActions == false ? null :
                        <div className="tree__header">
                            <h2 className="zero">{Resources.costCodingTree[currentLanguage]}</h2>
                            <button className="primaryBtn-1 btn" onClick={this.viewModalForFirst.bind(this)}>
                                {Resources["goAdd"][currentLanguage]}
                            </button>
                        </div>
                    }
                    {this.state.isLoading == true ? <LoadingSection /> :
                        <div className="Eps__list">
                            {
                                this.state.trees.map((item, i) => {
                                    if (treeContainer != null)
                                        treeContainer[item.id] = item
                                    return (
                                        <Fragment key={i}>
                                            <div className={this.state[item.id] == -1 ? ' epsTitle' : this.state['_' + item.id] === true ? 'epsTitle active' : 'epsTitle'} key={item.id}
                                                style={{ display: this.state[item.id] == -1 ? 'none' : '' }} onClick={() => this.viewChild(item)} >
                                                <div className="listTitle">
                                                    <span className="dropArrow" style={{ visibility: (item.trees.length > 0 ? '' : 'hidden') }}>
                                                        <i className="dropdown icon" />
                                                    </span>
                                                    <span className="accordionTitle">
                                                        {this.state[item.id] ? this.state[item.id].costCodingTreeName : item.costCodingTreeName}
                                                    </span>
                                                </div>
                                                {this.props.showActions == false ? null :
                                                    <div className="Project__num" key={i}>
                                                        {item.isView === true ? <div className="eps__actions">
                                                            <a className="deleteIcon" data-toggle="tooltip" title="Delete" onClick={() => this.DeleteDocument(item.id)}>
                                                                <img src={Delete} alt="Delete" />
                                                            </a>
                                                        </div> : null}
                                                    </div>
                                                }
                                            </div>
                                            <div className="epsContent">
                                                {item.trees.length > 0 ? this.printChild(item.trees) : null}
                                            </div>
                                        </Fragment>
                                    )
                                })
                            }
                        </div>
                    }
                </div>

                <SkyLight ref={ref => (this.simpleDialog = ref)} >
                    <div className="ui modal largeModal ">
                        <header className="costHeader">
                            <h2 className="zero">
                                {Resources[this.state.mode][currentLanguage]}
                            </h2>
                        </header>
                        <Formik initialValues={{ costCodingTreeId: '' }}
                            validationSchema={validationSchemaCostCodingTree}
                            onSubmit={values => {
                                this.assignCostCodingTreeByProject()
                            }}>
                            {({ handleSubmit, setFieldValue, setFieldTouched, errors, touched }) => (
                                <Form className="dropWrapper proForm" onSubmit={handleSubmit}>
                                    <div className="letterFullWidth ">
                                        <Dropdown title="costCodingTree"
                                            data={this.state.costCodingTree}
                                            selectedValue={this.state.selectedValue}
                                            handleChange={event =>
                                                this.setState({ selectedValue: event })
                                            }
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.costCodingTreeId}
                                            touched={touched.costCodingTreeId}
                                            name="costCodingTreeId" id="costCodingTreeId" />
                                    </div>
                                    <div className="fullWidthWrapper">
                                        {this.state.isLoading === false ? (
                                            <button className="primaryBtn-1 btn middle__btn" type="submit">
                                                {Resources["save"][currentLanguage]}
                                            </button>
                                        ) : (
                                                <button className="primaryBtn-1 btn middle__btn disabled">
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button>
                                            )}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </SkyLight>


                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources["smartDeleteMessage"][currentLanguage].content}
                        buttonName="delete"
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        clickHandlerContinue={this.clickHandlerContinueMain.bind(this)} />
                ) : null}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        isLoading: state.communication.isLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProjectCostCodingTree));

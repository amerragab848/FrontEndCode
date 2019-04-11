import React, { Component, Fragment } from "react";
import { Formik, Form, Field } from "formik";
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
import Rodal from "../../Styles/js/rodal";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';

import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");


class CostCodingTreeAddEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
            docId: ""
        };
    }


    parentCollapsed(rowIndex) {
        this.setState({
            rowIndex: rowIndex
        });
    }

    viewChild(item) {
        this.setState({
            [item.id]: item.id
        });
        console.log(item.trees);
    }

    AddDocument(item) {
        this.setState({
            parentId: item.id,
            isEdit: true,
            viewPopUp: true,
            objDocument: item
        });
    }

    EditDocument(item) {
        this.setState({
            isEdit: false,
            viewPopUp: true,
            document: item
        });
    }

    openChild(item, parentId) {
        let childerns = [];

        return item.trees.map((result, index) => {
            return (
                <Fragment>
                    <div className={parentId === result.id ? "epsTitle active" : "epsTitle"} key={result.id} onClick={() => this.viewChild(result)}>
                        <div className="listTitle">
                            <span className="dropArrow">
                                <i className="dropdown icon" />
                            </span>
                            <span className="accordionTitle">{result.codeTreeTitle}</span>
                        </div>
                        <div className="Project__num">
                            <div className="eps__actions">
                                <a className="editIcon" onClick={() => this.EditDocument(result)}>
                                    <img src={Edit} alt="Edit" />
                                </a>
                                <a className="plusIcon" onClick={() => this.AddDocument(result)}>
                                    <img src={Plus} alt="Add" />
                                </a>
                                <a className="deleteIcon" onClick={() => this.DeleteDocument(result.id)}>
                                    <img src={Delete} alt="Delete" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="epsContent" key={index + "-" + result.id}>
                        {this.state[result.id] === result.id ? this.openChild(result, result.id) : null}
                    </div>
                </Fragment>
            )
        });

    }

    designParent() {
        return this.state.trees.map((item, index) => {
            return (
                <Fragment>
                    {/* parent */}
                    <div className={this.state.rowIndex === item.id ? "epsTitle active" : "epsTitle"} key={item.id} onClick={() => this.viewChild(item)}>
                        <div className="listTitle">
                            <span className="dropArrow">
                                <i className="dropdown icon" />
                            </span>
                            <span className="accordionTitle">{item.codeTreeTitle}</span>
                        </div>
                        <div className="Project__num">
                            <div className="eps__actions">
                                <a className="editIcon" onClick={() => this.EditDocument(item)}>
                                    <img src={Edit} alt="Edit" />
                                </a>
                                <a className="plusIcon" onClick={() => this.AddDocument(item)}>
                                    <img src={Plus} alt="Add" />
                                </a>
                                <a className="deleteIcon" onClick={() => this.DeleteDocument(item.id)}>
                                    <img
                                        src={Delete}
                                        alt="Delete"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="epsContent" key={index + "-" + item.id}>
                        {this.state.rowIndex === item.id ? this.openChild(item, item.id) : null}
                    </div>
                </Fragment>
            );
        });
    }

    closePopUp() {
        this.state({
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

    saveTree() {
        this.setState({
            isLoading: true
        });
        let saveDocument = { ...this.state.document };
        saveDocument.parentId = this.state.parentId;
        saveDocument.projectId = this.state.projectId;

        dataservice
            .addObject("AddcostCodeTree", saveDocument)
            .then(result => {
                toast.success(Resources["operationSuccess"][currentLanguage]);

                let treeDocument = {
                    codeTreeTitle: "",
                    budgetThisPeriod: "",
                    budgetAtComplete: "",
                    originalBudget: "",
                    costForcast: "",
                    parentId: ""
                };

                this.setState({
                    viewPopUp: false,
                    document: treeDocument,
                    isLoading: false
                });
            })
            .catch(ex => {
                this.setState({ viewPopUp: false });

                toast.error(Resources["failError"][currentLanguage]);
            });
    }

    editTree() {
        this.setState({
            isLoading: true
        });
        let saveDocument = { ...this.state.document };
        saveDocument.projectId = this.state.projectId;

        dataservice
            .addObject("EditCostCodeTree", saveDocument)
            .then(result => {
                toast.success(Resources["operationSuccess"][currentLanguage]);

                let treeDocument = {
                    codeTreeTitle: "",
                    budgetThisPeriod: "",
                    budgetAtComplete: "",
                    originalBudget: "",
                    costForcast: "",
                    parentId: ""
                };

                this.setState({
                    viewPopUp: false,
                    document: treeDocument,
                    isLoading: false
                });
            })
            .catch(ex => {
                this.setState({ viewPopUp: false });

                toast.error(Resources["failError"][currentLanguage]);
            });
    }

    DeleteDocument(id) {
        this.setState({
            docId: id,
            showDeleteModal: true
        });
    }

    clickHandlerContinueMain() {
        dataservice.addObject("DeleteCostCodeTree", this.state.docId).then(result => {

            this.setState({
                showDeleteModal: false
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

        }).catch(ex => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
        });
    }

    render() {
        //let drawChilderns = 

        return (

            this.props.trees.map((result, index) => {
                (
                    <Fragment>
                        <div className={parentId === result.id ? "epsTitle active" : "epsTitle"} key={result.id} onClick={() => this.viewChild(result)}>
                            <div className="listTitle">
                                <span className="dropArrow">
                                    <i className="dropdown icon" />
                                </span>
                                <span className="accordionTitle">{result.codeTreeTitle}</span>
                            </div>
                            <div className="Project__num">
                                <div className="eps__actions">
                                    <a className="editIcon" onClick={() => this.EditDocument(result)}>
                                        <img src={Edit} alt="Edit" />
                                    </a>
                                    <a className="plusIcon" onClick={() => this.AddDocument(result)}>
                                        <img src={Plus} alt="Add" />
                                    </a>
                                    <a className="deleteIcon" onClick={() => this.DeleteDocument(result.id)}>
                                        <img src={Delete} alt="Delete" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="epsContent" key={index + "-" + result.id}>
                            {this.state[result.id] === result.id ? this.openChild(result, result.id) : null}
                        </div>
                    </Fragment>
                )
            })
        )
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(CostCodingTreeAddEdit));

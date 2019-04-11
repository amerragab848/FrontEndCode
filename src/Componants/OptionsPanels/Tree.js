import React, { Component, Fragment } from "react";

import Api from '../../api'
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Config from "../../Services/Config.js";
import * as communicationActions from "../../store/actions/communication";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");


class Tree extends Component {

    constructor(props) {

        super(props);

        this.state = {
            projectId: this.props.projectId,
            trees: [],
            childerns: [],
            rowIndex: null,
            isEdit: false,
            parentId: "",
            isLoading: false,
            ApiDrawTree: 'GetCostTreeByProjectId?projectId=',
            IsNodeModeData: this.props.IsNodeModeData,
            NodeData: {},
        };
        this.printChild = this.printChild.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.projectId !== this.props.projectId) {
            dataservice.GetDataGrid(this.state.ApiDrawTree + nextProps.projectId).then(result => {
                this.setState({
                    trees: result,
                    projectId: nextProps.projectId
                })
            })
        }
    }

    componentWillMount() {
        this.props.actions.documentForAdding();

        dataservice.GetDataGrid(this.state.ApiDrawTree + this.state.projectId).then(result => {
            this.setState({
                trees: result
            });
        });
    }

    GetNodeData = (id) => {
        if (this.state.IsNodeModeData) {
            Api.get('GetSummaryOfCostCoding?id=' + id + '').then(
                res => {
                    this.setState({
                        NodeData: res
                    })
                }
            )
        }
    }
    search(id, trees, updateTrees, parentId) {

        trees.map(item => {
            if (id == item.id) {
                item.collapse = !item.collapse;
            } else {
                //item.collapse = item.id != parentId ? true : item.collapse; 
            }
            updateTrees.push(item);
            if (item.trees.length > 0) {
                this.search(id, item.trees, updateTrees, parentId);
            }
        });
        return updateTrees;
    };

    printChild(children) {
        return (
            children.map((item, i) => {
                return (
                    <Fragment>
                        <div className={"epsTitle" + (item.collapse === false ? ' active' : ' ')} key={item.id}>
                            <div className="listTitle">

                                <span className="dropArrow" style={{ visibility: (item.trees.length > 0 ? '' : 'hidden') }} onClick={() => this.viewChild(item)}>
                                    <i className="dropdown icon" />
                                </span>

                                <span className="accordionTitle"   onClick={() => this.GetNodeData(item.id)}>{item.codeTreeTitle}</span>
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

        let trees = [...this.state.trees];

        this.search(item.id, trees, [], item.parentId);
        this.setState({
            trees
        });
    }

    render() {
        return (
            <Fragment>

                <div className="Eps__list">
                    {
                        this.state.trees.map((item, i) => {
                            return (
                                <Fragment>
                                    <div className="epsTitle active" key={item.id}>
                                        <div className="listTitle">
                                            <span className="dropArrow">
                                                <i className="dropdown icon" />
                                            </span>
                                            <span className="accordionTitle">{item.codeTreeTitle}</span>
                                        </div> 
                                    </div>
                                    <div class="epsContent">
                                        {item.trees.length > 0 ? this.printChild(item.trees) : null}
                                    </div>
                                </Fragment>
                            )
                        })
                    }
                </div>

                {this.state.IsNodeModeData ?
                    <div className="doc-pre-cycle">
                        <div className='document-fields'>
                            <table className="ui table">
                                <tbody>

                                    <tr>
                                        <td>{Resources['projectName'][currentLanguage]}</td>
                                        <td>{this.state.NodeData.projectName}</td>
                                    </tr>

                                    <tr>
                                        <td>{Resources['costCoding'][currentLanguage]}</td>
                                        <td>{this.state.NodeData.costCodingTitle}</td>
                                    </tr>

                                    <tr>
                                        <td>{Resources['totalCost'][currentLanguage]}</td>
                                        <td>{this.state.NodeData.totalCostCode}</td>
                                    </tr>

                                    <tr>
                                        <td>{Resources['invoicesTotal'][currentLanguage]}</td>
                                        <td>{this.state.NodeData.invoicesTotal}</td>
                                    </tr>

                                    <tr>
                                        <td>{Resources['paymentTotal'][currentLanguage]}</td>
                                        <td>{this.state.NodeData.paymentTotal}</td>
                                    </tr>
                                    <tr>
                                        <td>{Resources['materialRequestcount'][currentLanguage]}</td>
                                        <td>{this.state.NodeData.totalMaterialRelease}</td>
                                    </tr>
                                    <tr>
                                        <td>{Resources['expensesTotal'][currentLanguage]}</td>
                                        <td>{this.state.NodeData.expenses}</td>
                                    </tr>


                                </tbody>
                            </table>
                        </div>
                    </div>
                    : null}
            </Fragment>
        )
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
)(withRouter(Tree));

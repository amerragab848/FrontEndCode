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
            projectId:this.props.projectId,
            trees: [],
            childerns: [],
            rowIndex: null,
            isEdit: false,
            parentId: "",
            isLoading: false,
            drawChilderns: false,
            docId: "",
            ApiDrawTree: 'GetCostCodingTreeByProjectId?projectId=',
            IsNodeModeData: this.props.IsNodeModeData,
            NodeData: {},
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.projectId !== this.props.projectId) {

            dataservice.GetDataGrid(this.state.ApiDrawTree + nextProps.projectId).then(result => {
                this.setState({
                    trees: result ,
                    projectId:nextProps.projectId
                })
            })
        }
    }

    componentWillMount() {
        let treeDocument = {
            codeTreeTitle: "",
            budgetThisPeriod: "",
            budgetAtComplete: "",
            originalBudget: "",
            costForcast: "",
            parentId: ""
        };

        this.props.actions.documentForAdding();

        dataservice.GetDataGrid(this.state.ApiDrawTree + this.state.projectId).then(result => {
            this.setState({
                trees: result,
                document: treeDocument
            });
        });
    }

    parentCollapsed(rowIndex) {
        this.setState({
            rowIndex: rowIndex
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
    viewChild(item) {
        this.setState({
            rowIndex: item.id,
        })

        this.GetNodeData(item.id)

        console.log(item.trees)
    }

    openChild(item) {
        let childerns = [];
        //let childern =
        return item.trees.map(result => {
            return (
                <div className="epsContent" key={result.id}>
                    <div className="epsTitle">
                        <div className="listTitle">
                            <span className="dropArrow">
                                <i className="dropdown icon" />
                            </span>
                            <span className="accordionTitle">{result.codeTreeTitle}</span>
                        </div>
                    </div>
                </div>
            )

        });
    }

    designParent() {
        return this.state.trees.map((item, index) => {
            return (
                <Fragment>
                    <div className={this.state.rowIndex === item.id ? "epsTitle active" : "epsTitle"} key={item.id} onClick={() => this.viewChild(item)}>
                        <div className="listTitle">
                            <span className="dropArrow">
                                <i className="dropdown icon" />
                            </span>
                            <span className="accordionTitle">{item.codeTreeTitle}</span>
                        </div>
                    </div>
                    {this.state.rowIndex === item.id ? this.openChild(item) : null}
                </Fragment>
            );
        });
    }


    render() {
        return (


            <Fragment>
                <div className="Eps__list">
                    {this.designParent()}
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
        projectId:state.communication.projectId
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

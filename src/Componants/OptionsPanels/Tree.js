import React, { Component, Fragment } from "react";


import dataservice from "../../Dataservice";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";

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
    }


    printChild(children) {
        return (
            children.map((item, i) => {
                return (

                     <Fragment>
                         <div className={"epsTitle" + (item.collapse === false ? ' ' : ' ')} key={item.id}>
                             <div className="listTitle">

                                 <span className="dropArrow" style={{ visibility: (item.trees.length > 0 ? '' : 'hidden') }} onClick={() => this.viewChild(item)}>
                                     <i className="dropdown icon" />
                                 </span>

                                 <span className="accordionTitle"   onClick={() => this.props.GetNodeData(item)}>{item.codeTreeTitle}</span>
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
                                            <span className="accordionTitle" onClick={() => this.props.GetNodeData(item)}>{item.codeTreeTitle}</span>
                                        </div> 
                                    </div>
                                    <div className="epsContent">
                                        {item.trees.length > 0 ? this.printChild(item.trees) : null}
                                    </div>
                                </Fragment>
                            )
                        })
                    }
                </div>

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

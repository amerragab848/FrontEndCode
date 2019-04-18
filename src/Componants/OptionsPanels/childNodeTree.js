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
        
        this.printChild = this.printChild.bind(this);
        this.recursiveSearch = this.recursiveSearch.bind(this);
        this.noResultFound = this.noResultFound.bind(this);
        this.processPattern = this.processPattern.bind(this);
    }

    constructor(){
        super();
        var userTreeViewList = {
           tree: [
             {
               "node": {
                 "id": "1",
                 "description": "test1",
                 "children": [
                     {
                      "node": {
                           "id": "1_1",
                           "description": "test1_1",
                           "children": [
                               {
                                "node": {
                                     "id": "1_1_1",
                                     "description": "test1_1_1",
                                     "children": [
                                         {
                                          "node": {
                                               "id": "1_1_1_1",
                                               "description": "test1_1_1_1",
                                               "children": [
   
                                               ]
                                           }
                                         }
                                     ]
                                 }
                               }
                           ]
                       }
                     },
                     {
                       "node": {
                         "id": "1_2",
                         "description": "test1_2",
                           "children": []
                       }
                     }
                 ]
               }
             },
             {
               "node": {
                 "id": "2",
                 "description": "test2",
                 "children": [
                     {
                      "node": {
                           "id": "2_1",
                           "description": "test2_1",
                           "children": [
                             {
                              "node": {
                                   "id": "2_1_1",
                                   "description": "test2_1_1",
                                   "children": [
   
                                   ]
                               }
                             }
                         ]
                       }
                     },
                     {
                       "node": {
                            "id": "2_2",
                            "description": "test2_2",
                            "children": [
                              {
                               "node": {
                                    "id": "2_2_1",
                                    "description": "test2_2_1",
                                    "children": [
   
                                    ]
                                }
                              }
                          ]
                        }
                      }
                 ]
               }
             }
           ]
         };
        this.state = {
          userTreeViewList: userTreeViewList.tree, tempUserTreeViewList: userTreeViewList.tree
        }
   
     }
   
   
     printChild(children){
        return(    
          children.map( (item, i)=> {
             return <ul>
             <li>{item.codeTreeTitle}</li>
             {item.trees.length>0 ? this.printChild(item.trees): null}
             </ul>
          })  
        )
     }
   
     processPattern(){
       //it removes * from end of patten and returns
       var pattern= this.refs.myInput.value;
       var len = pattern.length
       if(pattern[len-1] === '*')
       pattern = pattern.substring(0, len-1);
       return pattern;
     }
   
     recursiveSearch(children){
       //itsearch recursively the children for the pattern, and returns if found 
       var pattern= this.processPattern();
       var tree = [];
       if(children && children.length > 0){
         children.forEach( (item) => {
            item.node.description.includes(pattern) ? tree.push(item) : this.recursiveSearch(item.node.children);
         });
       } 
       return tree;
     };
   
     NameSearch(){
       //on seachButton click this is called
       var pattern= this.processPattern();
       if(pattern)
       var filteredUsers = [];
       this.state.userTreeViewList.forEach( (item)=>{
         if(item.node.description.includes(pattern)){
           filteredUsers.push(item);
           //;
         }
         else if(item.node.children.length>0){
           var res = this.recursiveSearch(item.node.children); 
           if(res.length>0 ) 
             filteredUsers=res;
         }
       })
   
   
       this.setState({  userTreeViewList: this.state.userTreeViewList, tempUserTreeViewList: filteredUsers  });
   
     }
   
     noResultFound(){
       if(this.state.tempUserTreeViewList.length===0)
         return(
           <div className="alert alert-danger">
             <span>No result found</span>
           </div>
         )
     }
   
   
      render() {
   
   
         return (
           <div>
               <h3>Tree View Search</h3>
               <hr />
               <div className="row">
                   <div className="col-md-5"> 
                         <div className="input-group">
                           <input type="text" 
                                 ref="myInput" 
                                 className="form-control" 
                                 placeholder="Search for..." 
                           />
                           <span className="input-group-btn">
                             <button className="btn btn-success" type="button" onClick={this.NameSearch.bind(this)}>
                               <span className="glyphicon glyphicon-search"></span> Search
                             </button>
                           </span>
                         </div>
                         {this.noResultFound()}
   
                   </div>  
               </div>      
             <ul>
               {
                   this.state.trees.map( (item, i)=>{
                     return( 
                       <li key={i}>
                           {item.codeTreeTitle}
                           {item.trees.length > 0 ? this.printChild(item.children): null}
                       </li>
                     )
                   }) 
               }
             </ul>         
         </div>
       );
     }
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

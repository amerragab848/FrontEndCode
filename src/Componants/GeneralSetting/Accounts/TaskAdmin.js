import React, { Component, Fragment } from "react";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Api from "../../../api";
import "../../../Styles/scss/en-us/layout.css";
import Resources from "../../../resources.json";
import { withRouter } from "react-router-dom";
import SkyLight from 'react-skylight';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let id = null;
 


class TaskAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TaskAdminData: [],
            clickCheck:true,
            showPopup:''
        }
    }
    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        for (let param of query.entries()) {
            id = param[1];
        }

        // if(this.props.show===true)
        // {
        // 
        // }
//this.simpleDialog.show();
        Api.get("GetAccountsProjectsById?accountId="+id).then(
            res => {
                this.setState({
                    TaskAdminData: res
                })
            }
        ) 
    }
    SelectFun = (e) => {
       this.setState({
          clickCheck:false
       })
        Api.get("UpdateProjectTaskAdminById?taskAdmin=" + e).then(   
       setTimeout(() => {
            Api.get("GetAccountsProjectsById?accountId="+id).then(
                res => {
                    this.setState({
                        TaskAdminData: res ,
                        clickCheck:true
                    })
                }
               )}, 300
             )
            )  
    }
    ssss=()=>{
     
    }
    render() {
        let data=this.state.TaskAdminData;
        let RenderTable = data.map((item) => {
            return (
                <tr key={item.id}>
                    <td>
                         <div className={item.isTaskAdmin ? "ui checkbox checkBoxGray300 checked" : "ui checkbox checkBoxGray300 "}>
                            <input type="checkbox" defaultChecked={item.isTaskAdmin?'checked':'unchecked'}
                               onClick={() => this.SelectFun(item.id)} />
                             <label></label>
                         </div>
                    </td> 
                    <td>{item.id}</td>
                    <td>{item.projectName}</td>
                </tr>
            )
        })

        return (
            <div className="mainContainer">
       
       <h3> {Resources['taskAdministratorProjects'][currentLanguage]}</h3>
        {/* <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources['taskAdministratorProjects'][currentLanguage]}> */}
        <table className="taskAdminTable">
                    <thead>
                        <tr>
                            <th>{Resources['select'][currentLanguage]}</th>
                            <th>{Resources['arrange'][currentLanguage]}</th>
                            <th>{Resources['projectName'][currentLanguage]}</th>
                        </tr>
                    </thead>
                    <tbody> 
                        {this.state.clickCheck ?RenderTable:<LoadingSection />  }
                    </tbody>
                   
                </table>
        {/* </SkyLight> */}
             
            </div>
        )
    }

}
export default withRouter(TaskAdmin)
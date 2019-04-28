import React, { Component, Fragment } from "react";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Api from "../../../api";
import "../../../Styles/scss/en-us/layout.css";
import Resources from "../../../resources.json";
import { withRouter } from "react-router-dom";
import config from "../../../Services/Config";
import SkyLight from 'react-skylight';
import HeaderDocument from '../../OptionsPanels/HeaderDocument'

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let id = null;



class TaskAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TaskAdminData: [],
            clickCheck: true,
            showPopup: ''
        }
    }
    componentDidMount() {
        if (config.IsAllow(1001102)) {
            const query = new URLSearchParams(this.props.location.search);
            for (let param of query.entries()) {
                id = param[1];
            }
            // if(this.props.show===true)
            // {
            // 
            // }
            //this.simpleDialog.show();
            Api.get("GetAccountsProjectsById?accountId=" + id).then(
                res => {
                    this.setState({
                        TaskAdminData: res
                    })
                }
            )
        }
        else {
            alert('You Don`t Have Permissions')
            this.props.history.goBack()
        }
    }

    SelectFun = (e) => {
        this.setState({
            clickCheck: false
        })
        Api.get("UpdateProjectTaskAdminById?taskAdmin=" + e).then(
            setTimeout(() => {
                Api.get("GetAccountsProjectsById?accountId=" + id).then(
                    res => {
                        this.setState({
                            TaskAdminData: res,
                            clickCheck: true
                        })
                    }
                )
            }, 300
            )
        )
    }

    render() {
        let data = this.state.TaskAdminData;
        let RenderTable = data.map((item) => {
            return (
                <tr key={item.id}>
                    <td>
                        <div className="contentCell tableCell-1">
                            <div className={item.isTaskAdmin ? "ui checkbox checkBoxGray300 checked" : "ui checkbox checkBoxGray300 "}>
                                <input type="checkbox" defaultChecked={item.isTaskAdmin ? 'checked' : 'unchecked'}
                                    onClick={() => this.SelectFun(item.id)} />
                                <label></label>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-3">
                            {item.id}
                        </div>
                    </td>
                    <td colSpan="6">
                        <div className="contentCell tableCell-3">
                            {item.projectName}
                        </div>
                    </td>
                </tr>
            )
        })

        return (
            <div className="mainContainer main__fulldash">
                {/* <h3> {Resources['taskAdministratorProjects'][currentLanguage]}</h3> */}
                {/* <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources['taskAdministratorProjects'][currentLanguage]}> */}


                <div className="documents-stepper cutome__inputs noTabs__document">
                    <HeaderDocument docTitle={Resources.taskAdministratorProjects[currentLanguage]} />

                    <div className="doc-container">
                        <div className="step-content noBtn__footer">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    <div className="precycle-grid">
                                        <table className="attachmentTable">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <div className="headCell tableCell-1">
                                                            {Resources['select'][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th>

                                                        <div className="headCell tableCell-2">
                                                            {Resources['arrange'][currentLanguage]}
                                                        </div>
                                                    </th>
                                                    <th>
                                                        <div className="headCell tableCell-1">
                                                            {Resources['projectName'][currentLanguage]}
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.clickCheck ? RenderTable : <LoadingSection />}
                                            </tbody>

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </SkyLight> */}
            </div>
        )
    }

}
export default withRouter(TaskAdmin)
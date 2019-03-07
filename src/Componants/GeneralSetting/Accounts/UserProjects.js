import React, { Component, Fragment } from "react";
import Api from "../../../api";
import "../../../Styles/css/semantic.min.css";
import "../../../Styles/scss/en-us/layout.css";
import Resources from "../../../resources.json";
import config from "../../../Services/Config";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Recycle from '../../../Styles/images/attacheRecycle.png'
import DropdownMelcous from '../../OptionsPanels/DropdownMelcous'
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import { withRouter } from "react-router-dom";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let id = null;



class UserProjects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ProjectsData: [],
            ProjectsDataList: [],
            LoadingTable: false,
            projectIds: [],
            showDeleteModal: false
        }

    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    componentDidMount() {
        if (config.IsAllow(1001104)) 
        {
        const query = new URLSearchParams(this.props.location.search);
        for (let param of query.entries()) {
            id = param[1];
        }

        this.GetData("GetProjectsNotAccountsProjects?accountId=" + id, "projectName", "id", "ProjectsData")

        Api.get("GetAccountsProjectsById?accountId=" + id).then(
            res =>
                this.setState({
                    ProjectsDataList: res,
                    LoadingTable: true,
                    rowId: '',
                    index: ''
                })
        )
        this.setState({ LoadingTable: false })
            }
        else {
            alert('You Don`t Have Permissions')
            this.props.history.goBack()
        }
    }

    DeleteProject = (rowId, index) => {
        this.setState({
            showDeleteModal: true,
            rowId: rowId,
            index: index
        })
    }

    ConfirmationDelete = () => {
        const themData = this.state.ProjectsDataList;
        themData.splice(this.state.index, 1);
        this.setState({
            ProjectsDataList: themData
        });
        Api.get("DeleteAccountsProjects?id=" + this.state.rowId).then(
            this.setState({
                showDeleteModal: false
            })
        ).catch(ex => {
            this.setState({
                showDeleteModal: false
            });
        });
        this.setState({
        });
    }

    ProjectshandleChange = (e) => {
        this.setState({ projectIds: e })
    }

    SaveProjects = () => {
        const Ids = []
        this.state.projectIds.forEach(function (item) {
            Ids.push(item.value)
        })
        console.log(Ids)
        Api.post("AddAccountsProjectsList?accountId=" + id, Ids)
       
    }

    goBack=()=>{
        this.props.history.goBack()
    }

    render() {
        let data = this.state.ProjectsDataList;
        let RenderTable = data.map((item, index) => {
            return (
                <tr key={item.id}>
                    <td className="removeTr">
                        <div className="contentCell tableCell-1">
                            <span className="pdfImage" onClick={() => this.DeleteProject(item.id, index)}>
                                <img src={Recycle} alt="pdf" />
                            </span>
                        </div>
                    </td>
                    <td>{item.projectName}</td>
                </tr>
            )
        })

        return (
            <div className="mainContainer dropdownMulti">
                <h3> {Resources['userProjects'][currentLanguage]}</h3>
                <DropdownMelcous title='selectProjects' data={this.state.ProjectsData}
                    handleChange={this.ProjectshandleChange} placeholder='selectProjects' isMulti={true} />
              

                    <div className="dropBtn">
                    <button className="primaryBtn-2 btn smallBtn" onClick={this.goBack}>Back</button>
                            <span className="border" ></span>
                        <button className="primaryBtn-1 btn smallBtn" onClick={this.SaveProjects}>
                            {Resources['save'][currentLanguage]}</button>
                 
                </div>
                <table className="taskAdminTable">
                    <thead>
                        <tr>
                            <th>{Resources['delete'][currentLanguage]}</th>
                            <th>{Resources['projectName'][currentLanguage]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.LoadingTable ? RenderTable : <LoadingSection />}
                    </tbody>
                </table>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmationDelete}
                    />
                ) : null}
            </div>
        )
    }

    GetData = (url, label, value, currState) => {
        let Data = []
        Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                Data.push(obj);
            });
            this.setState({
                [currState]: [...Data]
            });
        }).catch(ex => {
        });
    }

}
export default withRouter(UserProjects)
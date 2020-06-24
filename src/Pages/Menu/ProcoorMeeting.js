import React, { Component, Fragment } from "react";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import DropdownMelcous from "../../Componants/OptionsPanels/DropdownMelcous";
import SkyLight from "react-skylight";
import { toast } from "react-toastify"; 
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const _ = require("lodash");

class ProcoorMeeting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedUsers: [],
            poolUSers: [],
            currentId: 0,
            showModal: false,
            isLoading: false,
            docDate: "",
            bicCompanyName: "",
            bicContactName: "",
            subject: "",
            startDate: "",
            finishDate: "",
            estimatedTime: "",
            description: ""
        };
    }

    componentWillMount = () => {
        dataservice.GetDataGrid("GetMyTasksTimeSheet").then(data => {
            let result = _(data)
                .groupBy(x => x.priorityName)
                .map((value, key) => ({ Group: key, GroupData: value }))
                .value();
            this.setState({
                originalData: data,
                taskData: result
            });
        });
    };

    addMeeting(e, id) {
        this.simpleDialog.show();
        this.setState({
            showModal: true
        });
    }

    editRow() {
        this.setState({
            showModal: false
        });

        toast.success(Resources["operationSuccess"][currentLanguage]);

        let obj = {};

        obj.id = this.state.currentId;
        obj.docDate = this.state.docDate;
        obj.bicCompanyName = this.state.bicCompanyName;
        obj.bicContactName = this.state.bicContactName;
        obj.subject = this.state.subject;

        dataservice.addObject("EditTaskStatus", obj).then(result => {
            this.state.originalData.forEach(item => {
                if (this.state.currentId === item.id) {
                    item.status = result["status"];
                    item.statusName = result["statusName"];
                }
            });

            let data = _(this.state.originalData)
                .groupBy(x => x.priorityName)
                .map((value, key) => ({ Group: key, GroupData: value }))
                .value();
            this.setState({
                taskData: data
            });
        });
    }

    usershandleChange = (e) => {
        this.setState({ selectedUsers: e })
    }

    SaveMeeting = () => {

        this.setState({ isLoading: true });

        const Ids = []
        this.state.selectedUsers.forEach(function (item) {
            Ids.push(item.value)
        })

        dataservice.addObject("AddAccountsProjectsList?accountId=" , Ids).then(result => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({ isLoading: false });
        });
    }

    render() {
        return (
            <div className="mainContainer main__fulldash">
                <div className="documents-stepper cutome__inputs noTabs__document">

                    <div className="doc-container">
                        <div className="step-content noBtn__footer">
                            <div className="subiTabsContent">
                                <div className="document-fields userProject">

                                    <div className="proForm datepickerContainer">
                                        <div className="subFilter">
                                            <h3 className="zero">{Resources["meetings"][currentLanguage]}</h3>
                                        </div>
                                        <div className="filterBTNS">
                                            <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.addMeeting()}>{Resources["new"][currentLanguage]}</button>
                                        </div>
                                    </div>
                                    <div className="proForm datepickerContainer">
                                        <div className="dropdownMulti letterFullWidth">
                                            <DropdownMelcous title='selectProjects' data={this.state.ProjectsData}
                                                handleChange={this.ProjectshandleChange} placeholder='selectProjects' isMulti={true} />
                                        </div>
                                        <div className="dropBtn fullWidthWrapper">
                                            <button className="primaryBtn-2 btn smallBtn" onClick={this.goBack}>Back</button>
                                            <span className="border" ></span>
                                            {this.state.isLoading === false ? <button className="primaryBtn-1 btn smallBtn" onClick={this.SaveProjects}>
                                                {Resources['save'][currentLanguage]}</button>
                                                : <button className="primaryBtn-1 btn disabled">
                                                    <div className="spinner">
                                                        <div className="bounce1" />
                                                        <div className="bounce2" />
                                                        <div className="bounce3" />
                                                    </div>
                                                </button>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div
                    className="largePopup largeModal " style={{ display: this.state.showModal ? "block" : "none" }}          >
                    <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialog = ref)} title={Resources["goEdit"][currentLanguage]}                        >
                        <div className="proForm">
                            <div className="dropWrapper">
                                <div className="proForm datepickerContainer">
                                    <div className="dropdownMulti letterFullWidth">
                                        <DropdownMelcous
                                            title='selectProjects'
                                            data={this.state.poolUSers}
                                            handleChange={this.usershandleChange}
                                            placeholder='selectEmployee'
                                            isMulti={true} />
                                    </div>
                                    <div className="dropBtn fullWidthWrapper">
                                        {this.state.isLoading === false ? <button className="primaryBtn-1 btn smallBtn" onClick={this.SaveMeeting}>
                                            {Resources['save'][currentLanguage]}</button>
                                            : <button className="primaryBtn-1 btn disabled">
                                                <div className="spinner">
                                                    <div className="bounce1" />
                                                    <div className="bounce2" />
                                                    <div className="bounce3" />
                                                </div>
                                            </button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SkyLight>
                </div>
            </div>
        );
    }
}

export default ProcoorMeeting;

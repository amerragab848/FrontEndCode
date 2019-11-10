import React, { Component, Fragment } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Widgets, WidgetsWithText } from "./Componants/CounterWidget";
import DashBoard from "./Componants/DashBoardProject";
import language from "./resources.json";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Details from "./Componants/widgetsDashBoardDetails";
import * as dashboardComponantActions from "./store/actions/communication";
import IndexedDb from "./IndexedDb";
import orderBy from "lodash/orderBy"; 
import map from "lodash/map";
import groupBy from "lodash/groupBy";
import SkyLight from "react-skylight";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ConfirmationModal from "./Componants/publicComponants/ConfirmationModal";
import Dropdown from "./Componants/OptionsPanels/DropdownMelcous";
import dataService from "./Dataservice";
import LoadingSection from "./Componants/publicComponants/LoadingSection";
import Edit from "./Styles/images/epsActions/edit.png";
import Plus from "./Styles/images/epsActions/plus.png";
import Delete from "./Styles/images/epsActions/delete.png";
import { toast } from "react-toastify";
import moment from "moment";
import Config from "./Services/Config";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let treeContainer = [];

const validationSchema = Yup.object().shape({
    companyId: Yup.string().required(
        language["fromCompanyRequired"][currentLanguage]
    ),
    contactId: Yup.string().required(
        language["fromContactRequired"][currentLanguage]
    )
});

class DashboardProject extends Component {
    constructor(props) {
        super(props);

        let accountImage = localStorage.getItem("profilePath");

        accountImage = accountImage.split("downloads");

        let contactName = localStorage.getItem("contactName");

        this.state = {
            mode: "add",
            trees: [],
            tabIndex: 0,
            dashBoardIndex: 0,
            value: 0,
            counterData: [],
            counterDataDetails: [],
            viewDashBoard: false,
            viewWidget: false,
            viewMenu: 0,
            isLoading: false,
            widgets: [],
            showDeleteModal: false,
            isEdit: false,
            IsFirstParent: false,
            companies: [],
            contacts: [],
            documentPost: {
                id: null,
                message: "",
                image: localStorage.getItem("profilePath"),
                date: moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS"),
                name: contactName,
                projectId: this.props.projectId,
                attachment: ""
            },
            document: {
                id: 0,
                projectId:
                    this.props.projectId == 0
                        ? localStorage.getItem("lastSelectedProject")
                        : this.props.projectId,
                parentId: null,
                companyId: null,
                contactId: null
            },
            documentCommentDiscussion: {
                message: "",
                DiscussionId: "",
                Date: moment(),
                image: "downloads" + accountImage[1],
                Name: contactName
            },
            projectId:
                this.props.projectId == 0
                    ? localStorage.getItem("lastSelectedProject")
                    : this.props.projectId,
            selectedFromCompany: {
                label: language.fromCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedFromContact: {
                label: language.fromCompanyRequired[currentLanguage],
                value: "0"
            },
            Discussions: [],
            viewComment: false,
            profilePath: localStorage.getItem("profilePath"),
            rowPosts: null,
            viewBtnDiscussion: true,
            preview: false,
            filesupload: false,
            attachment: ""
        };
    }

    componentDidMount() {
        let projectId = this.props.projectId == 0 ? localStorage.getItem("lastSelectedProject") : this.props.projectId;

        var e = { label: this.props.projectName, value: projectId };
        this.props.actions.RouteToDashboardProject(e);
        this.getWidgets();

        dataService.GetDataGrid("GetProjectOrganizationChart?projectId=" + this.state.projectId).then(result => {
            let state = this.state;

            if (result) {
                result.forEach(item => {
                    state[item.id] = item;
                    state["_" + item.id] = false;
                });
                this.setState({
                    trees: result,
                    state,
                    isLoading: false
                });
            }
        });

        dataService.GetDataGrid("GetDiscussions?projectId=" + this.state.projectId)
            .then(result => {
                if (result) {
                    this.setState({
                        Discussions: result
                    });
                }
            });

        dataService.GetDataList("GetProjectProjectsCompaniesForList?projectId=" + this.state.projectId, "companyName", "companyId").then(result => {
            this.setState({
                companies: result,
                isLoading: false
            });
        });
    }

    async getWidgets() {
        const data = orderBy(
            await IndexedDb.getSelectedDashBoardWidgets(),
            "order",
            "asc"
        );

        const categoryOrder = await IndexedDb.getDashBoardCategoryOrder();

        let widgets = "";

        if (data.length > 0) {
            widgets = map(
                groupBy(data, widget => widget.categoryId),
                (widgets, categoryId) => {
                    return {
                        categoryId: categoryId,
                        title: Details.categories[categoryId].title,
                        widgets,
                        order: categoryOrder[categoryId].order
                    };
                }
            );

            widgets = orderBy(widgets, "order", "asc");
        } else {
            const getAllWidgets = await IndexedDb.getAllDashBoradProject(
                "widget"
            );

            widgets = map(
                groupBy(getAllWidgets, widget => widget.categoryId),
                (widgets, categoryId) => {
                    return {
                        categoryId: categoryId,
                        title: Details.categories[categoryId].title,
                        widgets,
                        order: categoryOrder[categoryId].order
                    };
                }
            );
        }

        this.setState({
            widgets: widgets || [],
            viewWidget: true
        });
    }

    renderCategoryWidget() {
        return (
            <Fragment>
                {this.renderCategory()}
            </Fragment>
        );
    }

    renderCategory() {
        let categoryWidget = this.state.widgets.map((category, index) => {

            return (
                <div className="SummeriesContainer" key={index + "DIV"}>
                    <Fragment key={index}>
                        <h2 className={"SummeriesTitle " + (category.title == "counters" ? 'disNone' : '')}>
                            {language[category.title][currentLanguage]}
                        </h2>
                        <div className={"SummeriesContainerContent " + (category.title == "Submittal" || category.title == "communication" ? " numbersContainerContent" : " ")}>
                            {category.widgets.map((widget, widgetIndex) => {
                                if (widget.permission === 0 || Config.IsAllow(widget.permission)) {
                                    return this.renderWidget(widget, widgetIndex);
                                }
                            })}
                        </div>
                    </Fragment>
                </div>
            );
        });

        return categoryWidget;
    }

    renderWidget(widget, index) {

        if (this.state.tabIndex === 0) {
 
            let drawWidget = Details.widgets.find(x => x.title === widget.title);

            let projectId = this.props.projectId == 0 ? localStorage.getItem("lastSelectedProject") : this.props.projectId;

            drawWidget.props.api = drawWidget.props.api + projectId;

            if (drawWidget.props.type === "twoWidget") {
                return (
                    <WidgetsWithText key={index + "DIV"} title={widget.title} {...drawWidget} />
                );
            } else if (drawWidget.props.type === "oneWidget") {
                return (
                    <Widgets key={(index + '_' + drawWidget.props.key) + "DIV"} title={widget.title} {...drawWidget} />
                );
            }
        }
    }

    viewDashBoardHandler() {
        this.setState({
            viewDashBoard: true
        });
    }

    closeModal() {
        this.setState({
            viewDashBoard: false
        });
        this.getWidgets();
    }

    onClickTabItem(tabIndex) {
        this.setState({
            tabIndex: tabIndex,
            viewWidget: tabIndex === 1 ? true : false
        });
    }

    viewModalForFirst = () => {
        this.setState({ mode: "goAdd", isEdit: true, IsFirstParent: true });
        this.simpleDialog.show();
    };

    renderOrganizationChart() {
        if (this.state.trees.length > 0) {
            return (
                <Fragment>
                    <div className="tree__header">
                        <h2 className="zero">
                            {language.organizationChart[currentLanguage]}
                        </h2>
                        <button
                            className="primaryBtn-1 btn"
                            onClick={this.viewModalForFirst.bind(this)}>
                            {language["goAdd"][currentLanguage]}
                        </button>
                    </div>
                    {this.state.isLoading == true ? (
                        <LoadingSection />
                    ) : (
                            <div className="Eps__list">
                                {this.state.trees.map((item, i) => {
                                    if (treeContainer != null)
                                        treeContainer[item.id] = item;
                                    return (
                                        <Fragment key={i}>
                                            <div
                                                className={
                                                    this.state[item.id] == -1
                                                        ? " epsTitle"
                                                        : this.state[
                                                            "_" + item.id
                                                        ] === true
                                                            ? "epsTitle active"
                                                            : "epsTitle"
                                                }
                                                key={item.id}
                                                style={{
                                                    display:
                                                        this.state[item.id] == -1
                                                            ? "none"
                                                            : ""
                                                }}
                                                onClick={() =>
                                                    this.viewChild(item)
                                                }>
                                                <div className="listTitle">
                                                    <span
                                                        className="dropArrow"
                                                        style={{
                                                            visibility:
                                                                item.charts.length >
                                                                    0
                                                                    ? ""
                                                                    : "hidden"
                                                        }}>
                                                        <i className="dropdown icon" />
                                                    </span>
                                                    <span
                                                        className="accordionTitle"
                                                        onClick={
                                                            this.props.GetNodeData
                                                                ? () =>
                                                                    this.GetNodeData(
                                                                        item
                                                                    )
                                                                : null
                                                        }>
                                                        {this.state[item.id]
                                                            ? `${this.state[item.id].contactName} - ${this.state[item.id].companyName}`
                                                            : `${item.contactName} - ${item.companyName}`}
                                                    </span>
                                                </div>
                                                {this.props.showActions ==
                                                    false ? null : (
                                                        <div className="Project__num">
                                                            <div className="eps__actions">
                                                                <a
                                                                    className="editIcon"
                                                                    onClick={() =>
                                                                        this.EditDocument(
                                                                            item
                                                                        )
                                                                    }>
                                                                    <img
                                                                        src={Edit}
                                                                        alt="Edit"
                                                                    />
                                                                </a>
                                                                <a
                                                                    className="plusIcon"
                                                                    onClick={() =>
                                                                        this.AddDocument(
                                                                            item
                                                                        )
                                                                    }>
                                                                    <img
                                                                        src={Plus}
                                                                        alt="Add"
                                                                    />
                                                                </a>
                                                                <a
                                                                    className="deleteIcon"
                                                                    onClick={() =>
                                                                        this.DeleteDocument(
                                                                            item.id
                                                                        )
                                                                    }>
                                                                    <img
                                                                        src={Delete}
                                                                        alt="Delete"
                                                                    />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                            <div
                                                className="epsContent"
                                                id={item.id}>
                                                {item.charts.length > 0
                                                    ? this.printChild(item.charts)
                                                    : null}
                                            </div>
                                        </Fragment>
                                    );
                                })}
                            </div>
                        )}
                </Fragment>
            );
        }
    }

    printChild(children) {
        return children.map((item, i) => {
            if (treeContainer != null) treeContainer[item.id] = item;
            return (
                <Fragment key={i}>
                    <div
                        className={
                            this.state[item.id] == -1
                                ? " epsTitle"
                                : this.state["_" + item.id] === true
                                    ? "epsTitle active"
                                    : "epsTitle"
                        }
                        key={item.id}
                        onClick={() => this.viewChild(item)}
                        style={{
                            display: this.state[item.id] == -1 ? "none" : ""
                        }}>
                        <div className="listTitle">
                            <span
                                className="dropArrow"
                                style={{
                                    visibility:
                                        item.charts.length > 0 ? "" : "hidden"
                                }}>
                                <i className="dropdown icon" />
                            </span>
                            <span
                                className="accordionTitle"
                                onClick={
                                    this.props.GetNodeData
                                        ? () => this.GetNodeData(item)
                                        : null
                                }>
                                {this.state[item.id]
                                    ? this.state[item.id].companyName
                                    : item.companyName}
                            </span>
                        </div>
                        {this.props.showActions == false ? null : (
                            <div className="Project__num">
                                <div className="eps__actions">
                                    <a
                                        className="editIcon"
                                        onClick={() => this.EditDocument(item)}>
                                        <img src={Edit} alt="Edit" />
                                    </a>
                                    <a
                                        className="plusIcon"
                                        onClick={() => this.AddDocument(item)}>
                                        <img src={Plus} alt="Add" />
                                    </a>
                                    <a
                                        className="deleteIcon"
                                        onClick={() =>
                                            this.DeleteDocument(item.id)
                                        }>
                                        <img src={Delete} alt="Delete" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="epsContent">
                        {item.charts.length > 0
                            ? this.printChild(item.charts)
                            : null}
                    </div>
                </Fragment>
            );
        });
    }

    DeleteDocument(id) {
        this.setState({
            docId: id,
            showDeleteModal: true
        });
    }

    viewChild(item) {
        let trees = [...this.state.trees];
        let state = this.state;
        state["_" + item.id] = !state["_" + item.id];
        this.search(item.id, trees, [], item.parentId);
        this.setState({
            trees,
            state
        });
    }

    search(id, trees, updateTrees, parentId) {
        trees.map(item => {
            updateTrees.push(item);
            if (item.charts.length > 0) {
                let state = this.state;
                state["_" + item.id] = state["_" + item.id]
                    ? state["_" + item.id]
                    : false;
                this.setState({ state });
                this.search(id, item.charts, updateTrees, parentId);
            }
        });
        return updateTrees;
    }

    saveTree() {
        this.setState({
            isLoading: true
        });
        let saveDocument = { ...this.state.document };
        saveDocument.parentId = this.state.IsFirstParent
            ? ""
            : this.state.parentId;
        saveDocument.projectId = this.state.projectId;
        dataService
            .addObject("AddNewProjectOrganizationChart", saveDocument)
            .then(result => {
                toast.success(language["operationSuccess"][currentLanguage]);
                let data = result;
                let state = this.state;
                state["_" + saveDocument.id] = true;
                this.setState({
                    trees: data,
                    state,
                    isLoading: false,
                    IsFirstParent: false,
                    selectedFromCompany: {
                        label: language.fromCompanyRequired[currentLanguage],
                        value: "0"
                    },
                    selectedFromContact: {
                        label: language.fromCompanyRequired[currentLanguage],
                        value: "0"
                    }
                });
            })
            .catch(ex => {
                this.setState({ isLoading: false });
                toast.error(language["failError"][currentLanguage]);
            });
    }

    editTree = () => {
        this.setState({ isLoading: true });
        let saveDocument = { ...this.state.document };
        saveDocument.projectId = this.state.projectId;
        let state = this.state;
        if (treeContainer != null) {
            treeContainer.forEach(item => {
                state[item.id] = item;
            });
            this.setState({ state });
        }

        dataService
            .addObject("EditProjectOrganizationChart", saveDocument)
            .then(result => {
                toast.success(language["operationSuccess"][currentLanguage]);
                let itemId = saveDocument.id;
                let state = this.state;
                state[itemId] = result;
                this.setState({
                    state,
                    isLoading: false
                });
                treeContainer = null;
            })
            .catch(ex => {
                this.setState({ isLoading: false });
                toast.error(language["failError"][currentLanguage]);
            });
    };

    clickHandlerContinueMain() {
        let state = this.state;
        if (treeContainer != null) {
            treeContainer.forEach(item => {
                state[item.id] = item;
            });
            this.setState({ state, isLoading: true });
        }
        dataService
            .addObject("ProjectOrganizationChartDelete?id=" + this.state.docId)
            .then(result => {
                let state = this.state;
                state[this.state.docId] = -1;
                if (result != null)
                    this.setState({
                        trees: result,
                        showDeleteModal: false,
                        state,
                        isLoading: false
                    });
                else
                    this.setState({
                        showDeleteModal: false,
                        state,
                        isLoading: false
                    });
                treeContainer = null;
                toast.success(language["operationSuccess"][currentLanguage]);
            })
            .catch(ex => {
                toast.success(language["operationSuccess"][currentLanguage]);
                this.setState({ showDeleteModal: false, isLoading: false });
            });
    }

    handleChangeDropDown(event, field, isSubscrib, targetState, url, param, selectedValue, subDatasource) {

        if (event == null) return;

        let original_document = { ...this.state.document };

        let updated_document = {};

        updated_document[field] = event.value;

        updated_document = Object.assign(original_document, updated_document);

        if (isSubscrib) {
            let action = url + "?" + param + "=" + event.value;
            dataService.GetDataList(action, "contactName", "id").then(result => {
                this.setState({
                    [targetState]: result
                });
            });
        }

        this.setState({
            document: updated_document,
            [selectedValue]: event
        });
    }

    AddDocument(item) {
        this.setState({
            parentId: item.id,
            isEdit: true,
            objDocument: item,
            mode: "add",
            selectedFromCompany: {
                label: language.fromCompanyRequired[currentLanguage],
                value: "0"
            },
            selectedFromContact: {
                label: language.fromCompanyRequired[currentLanguage],
                value: "0"
            }
        });
        this.simpleDialog.show();
    }

    EditDocument(item) {
        this.setState({
            isEdit: false,
            document: item,
            mode: "goEdit",
            selectedFromCompany: {
                label: item.companyName,
                value: item.companyId
            },
            selectedFromContact: {
                label: item.contactName,
                value: item.contactId
            }
        });
        this.simpleDialog.show();
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    updateImageDisplay = () => {
        let originalData = this.state.documentPost;

        var input = document.getElementById("imageInput"),
            preview = document.getElementById("preview");
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
        var curFiles = input.files;

        originalData.attachment = curFiles[0].name;

        this.setState({
            documentPost: originalData,
            attachment: window.URL.createObjectURL(curFiles[0])
        });

        var list = document.createElement("ul");
        preview.appendChild(list);
        for (var i = 0; i < curFiles.length; i++) {
            var listItem = document.createElement("li"),
                image = document.createElement("img"),
                btnRemove = document.createElement("button");
            image.src = window.URL.createObjectURL(curFiles[i]);
            btnRemove.textContent = "X";
            btnRemove.setAttribute("id", "previewBtn");
            listItem.appendChild(image);
            listItem.appendChild(btnRemove);
            list.appendChild(listItem);
        }
        var buttonPreview = document.getElementById("previewBtn");
        if (buttonPreview !== null) {
            buttonPreview.addEventListener(
                "click",
                this.hideUploadFiles,
                false
            );
        }
    };

    hideUploadFiles = () => {
        this.setState({ preview: false });
    };

    removePreview = () => {
        this.setState({
            preview: false
        });
    };

    updateVideoDisplay = () => {
        var videoInput = document.getElementById("videoInput");
        var preview = document.getElementById("preview");
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
        var curFiles = videoInput.files;
        var list = document.createElement("ul");
        preview.appendChild(list);
        for (var i = 0; i < curFiles.length; i++) {
            var listItem = document.createElement("li"),
                video = document.createElement("video"),
                videoSrc = document.createElement("source"),
                btnRemove = document.createElement("button");
            videoSrc.src = window.URL.createObjectURL(curFiles[i]);
            videoSrc.type = "video/mp4";
            video.controls = true;
            btnRemove.textContent = "X";
            btnRemove.setAttribute("id", "previewBtn");
            video.appendChild(videoSrc);
            listItem.appendChild(video);
            listItem.appendChild(btnRemove);
            list.appendChild(listItem);
        }
        var buttonPreview = document.getElementById("previewBtn");
        if (buttonPreview !== null) {
            buttonPreview.addEventListener("click", this.hideUploadFiles, false);
        }
    };

    updateFileDisplay = () => {
        var videoInput = document.getElementById("filesInput");
        var preview = document.getElementById("preview");
        this.setState({ filesupload: true });
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
        var curFiles = videoInput.files;
        for (var i = 0; i < curFiles.length; i++) {
            var btnRemove = document.createElement("button");

            btnRemove.textContent = "X";
            btnRemove.setAttribute("id", "previewBtn");
            preview.appendChild(btnRemove);
        }

        var buttonPreview = document.getElementById("previewBtn");
        if (buttonPreview !== null) {
            buttonPreview.addEventListener("click", this.hideUploadFiles, false);
        }
    };

    viewComments(index) {
        if (this.state.rowPosts != index) {
            this.setState({
                viewComment: !this.state.viewComment,
                rowPosts: index
            });
        } else {
            this.setState({
                viewComment: !this.state.viewComment,
                rowPosts: null
            });
        }
    }

    addNewComment(index, id) {
        if (this.state.rowPosts != index) {
            let originalDocument = this.state.documentCommentDiscussion;

            originalDocument.DiscussionId = id;

            this.setState({
                documentCommentDiscussion: originalDocument,
                viewComment: true,
                rowPosts: index
            });
        }
    }

    focusBtn(type, e) {
        if (type === "change") {
            let originalData = this.state.documentPost;
            originalData.message = e.target.value;

            this.setState({
                viewBtnDiscussion: false,
                documentPost: originalData
            });
        } else {
            if (this.state.documentPost.message === "") {
                this.setState({
                    viewBtnDiscussion: true
                });
            }
        }
    }

    addComments = () => {
        if (this.state.documentCommentDiscussion.message != "") {
            let DiscussionId = this.state.documentCommentDiscussion.DiscussionId;

            dataService.addObject("AddDiscussionComment", this.state.documentCommentDiscussion).then(result => {

                let originalData = this.state.Discussions;

                let indexDiscussionId = originalData.findIndex(
                    x => x.id === DiscussionId
                );

                originalData[indexDiscussionId].comments.push(result);

                this.setState({ Discussions: originalData });

                toast.success(
                    language["operationSuccess"][currentLanguage]
                );
            }).catch(ex => {
                toast.error(language["failError"][currentLanguage]);
            });
        }
    };

    handleCommentChange(e) {
        let original_document = this.state.documentCommentDiscussion;

        original_document.message = e.target.value;

        this.setState({
            documentCommentDiscussion: original_document
        });
    }

    addPosts() {
        if (this.state.documentPost.message != "") {

            let saveDocument = this.state.documentPost;

            saveDocument.projectId = this.state.projectId;

            dataService
                .addObject("AddDiscussion", saveDocument)
                .then(result => {
                    let originalData = this.state.Discussions;
                    if (result != null) {
                        if (result.comments === null) {
                            result.comments = [];
                        }
                    }

                    dataService.addObject("UploadDiscussionAttachment", this.state.attachment).then(data => {

                        originalData.push(result);

                        this.setState({ Discussions: originalData });

                        toast.success(
                            language["operationSuccess"][currentLanguage]
                        );
                    });
                });
        }
    }

    renderDiscussions() {
        return (
            <div className="discussion__panel">
                <div
                    className="post__panel"
                    onBlur={() => this.focusBtn("Blur")}>
                    <div className="post__panel--box">
                        <div className="post__input">
                            <figure className="zero avatarProfile ">
                                <img
                                    alt=""
                                    title=""
                                    src={this.state.profilePath}
                                />
                            </figure>
                            <input
                                id="discussion__input"
                                type="text"
                                className="form-control "
                                placeholder="What’s happening?"
                                value={this.state.documentPost.message}
                                onChange={e => this.focusBtn("change", e)}
                            />
                        </div>
                        {this.state.preview ? (
                            <div
                                id="preview"
                                className={
                                    this.state.filesupload ? "file_upload" : ""
                                }>
                                {this.state.filesupload ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        width="60"
                                        height="66"
                                        viewBox="0 0 60 66">
                                        <g
                                            fill="#CCD2DB"
                                            fill-rule="evenodd"
                                            transform="translate(-246 -72)">
                                            <path
                                                id="a"
                                                d="M305.045 90.939c.728.571 1.04 1.333.936 2.19l.019 37.538c0 3.43-2.743 7.333-7.5 7.333h-45c-4.565 0-7.5-3.6-7.5-7.333V79.333c0-4.77 4.267-7.333 7.5-7.333h30.665c.935 0 1.767.286 2.39.857l18.49 18.082zm-28.917-5.59c0-3.29-2.826-6.016-6.237-6.016H253.5v51.334h45v-23.152c0-2.588-2.033-6.182-6.27-6.182h-12.984c-1.754 0-3.118-1.316-3.118-3.008V85.35zM261 116h22.5v7.333H261V116z"
                                            />
                                        </g>
                                    </svg>
                                ) : null}
                            </div>
                        ) : null}
                        <div className="post__attachment--container">
                            <div className="post__attachment">
                                <h3 className="zero">Add</h3>
                                <span className="border" />
                                <form
                                    className="file__upload"
                                    method="post"
                                    encType="multipart/form-data">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24">
                                        <g
                                            fill="none"
                                            fillRule="evenodd"
                                            transform="translate(2 2)">
                                            <g fill="#4382F9" mask="url(#b)">
                                                <path
                                                    id="a"
                                                    d="M7.054 16.998c-1.157-.002-2.05-.71-2.333-1.858a2.684 2.684 0 0 1-.063-.634c-.005-2.635-.004-5.27-.003-7.906 0-1.454.986-2.498 2.409-2.503 3.768-.012 7.536-.01 11.304 0 1.18.002 2.05.705 2.341 1.85.047.187.064.385.065.578.004 2.68.006 5.359 0 8.038-.002 1.236-.803 2.197-1.994 2.41-.156.028-.318.025-.477.025C16.44 17 14.578 17 12.715 17c-1.887 0-3.774.003-5.66 0zm12.048-3.885c0-2.196.001-4.113-.001-6.31 0-.676-.45-1.128-1.118-1.128-3.769-.002-6.701-.001-10.47 0-.104 0-.21.008-.31.034-.514.132-.802.53-.802 1.115-.002 2.423 0 4.565 0 6.988 0 .041.003.083.006.149.064-.065.113-.11.157-.158.636-.716 1.27-1.434 1.909-2.147a1.7 1.7 0 0 1 .346-.306c.569-.359 1.249-.238 1.716.293l1 1.14.23-.272c.88-1.04 1.303-2.084 2.187-3.12.608-.713 1.201-.706 1.81.003.27.317.54.634.812.95l2.528 2.947v-.178zM14.65 2.823c-.034 0-.088-.076-.097-.123-.033-.166-.02-.078-.046-.245-.14-.903-.762-.834-1.428-.741-2.689.376-4.667.642-7.356 1.018-1.028.144-1.863.234-2.89.386-.728.108-1.144.581-1.053 1.324.118.964.231 1.745.36 2.708.19 1.435.37 2.588.56 4.024.03.217.053.435.085.652.095.644.434.97 1.1 1.049l-.443 1.508a2.319 2.319 0 0 1-1.615-.623c-.539-.486-.705-1.13-.79-1.827-.213-1.717-.45-3.43-.677-5.145-.115-.87-.245-1.737-.345-2.61C-.133 2.878.82 1.725 2.14 1.553c1.718-.225 3.433-.468 5.15-.703l4.82-.657c.39-.053.78-.1 1.169-.16 1.368-.213 2.54.672 2.736 2.072.036.253.066.507.103.784-.414 0-1.07-.056-1.467-.065zM10.3 8.268c.001.712-.564 1.296-1.26 1.301-.7.006-1.283-.587-1.28-1.302.003-.71.577-1.291 1.272-1.291.697 0 1.266.58 1.268 1.292z"
                                                />
                                            </g>
                                        </g>
                                    </svg>
                                    <input
                                        className="input__dissUpload"
                                        type="file"
                                        name="file"
                                        id="imageInput"
                                        onChange={this.updateImageDisplay}
                                        onClick={() =>
                                            this.setState({
                                                preview: true,
                                                filesupload: false
                                            })
                                        }
                                        accept="image/*"
                                        className="inputfile"
                                    />
                                    <label htmlFor="file">
                                        {language.image[currentLanguage]}
                                    </label>
                                </form>
                                <form
                                    className="file__upload"
                                    method="post"
                                    encType="multipart/form-data">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24">
                                        <g
                                            fill="none"
                                            fillRule="evenodd"
                                            transform="translate(4 5)">
                                            <g fill="#4382F9" mask="url(#b)">
                                                <path
                                                    id="a"
                                                    d="M8.5 13.266v.733H3.04c-1.454-.003-2.603-.924-2.956-2.362a3.26 3.26 0 0 1-.082-.79C0 8.654 0 6.582.001 3.17 0 1.355 1.276.014 3.049.008c3.373-.01 6.901-.01 10.901 0 1.466.003 2.598.91 2.961 2.35.059.232.084.478.085.739.005 3.294.006 5.539 0 7.806-.002 1.55-1.024 2.79-2.522 3.06a2.49 2.49 0 0 1-.435.035h-.153L11.192 14H8.5v-.733zm0-.31v-.733H13.77c.091-.002.15-.006.192-.013.801-.145 1.32-.775 1.322-1.62.005-2.264.004-3.962 0-7.254 0-.149-.014-.277-.04-.381-.201-.797-.758-1.242-1.553-1.244-3.998-.01-6.914-.01-10.284 0-.956.003-1.595.676-1.596 1.696-.001 3.411-.001 4.937.002 7.129 0 .19.013.33.04.44.193.788.764 1.245 1.544 1.246.81.002 1.29.002 2.372.002H8.5v.733zM6.501 6.923c0-.714-.004-1.428.003-2.142.001-.132.023-.274.075-.392.168-.38.597-.498.973-.277.917.54 1.833 1.083 2.75 1.625.313.186.628.37.94.557.506.304.505.946-.003 1.247-1.221.725-2.443 1.448-3.665 2.17-.522.309-1.066-.002-1.072-.617-.006-.723-.001-1.447-.001-2.17z"
                                                />
                                            </g>
                                        </g>
                                    </svg>
                                    <input
                                        className="input__dissUpload"
                                        type="file"
                                        name="file"
                                        id="videoInput"
                                        onChange={this.updateVideoDisplay}
                                        onClick={() =>
                                            this.setState({
                                                preview: true,
                                                filesupload: false
                                            })
                                        }
                                        accept="video/*"
                                        className="inputfile"
                                    />
                                    <label htmlFor="file">
                                        {language.video[currentLanguage]}
                                    </label>
                                </form>
                                <form
                                    className="file__upload"
                                    method="post"
                                    encType="multipart/form-data">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24">
                                        <g
                                            fill="none"
                                            fillRule="evenodd"
                                            transform="translate(5 5)">
                                            <g fill="#4382F9" mask="url(#b)">
                                                <path
                                                    id="a"
                                                    d="M13.42 4.304c.165.13.236.303.212.498l.004 8.531c0 .78-.623 1.667-1.704 1.667H1.705A1.67 1.67 0 0 1 0 13.333V1.667C0 .583.97 0 1.705 0h6.969c.212 0 .401.065.543.195l4.202 4.11zm-6.573-1.27c0-.748-.642-1.367-1.417-1.367H1.705v11.666h10.227V8.072c0-.589-.462-1.405-1.425-1.405H7.556c-.399 0-.709-.3-.709-.684V3.034zM3.41 9.6h5.114v1.87H3.409V9.6z"
                                                />
                                            </g>
                                        </g>
                                    </svg>
                                    <input
                                        className="input__dissUpload"
                                        type="file"
                                        name="file"
                                        id="filesInput"
                                        onChange={this.updateFileDisplay}
                                        onClick={() =>
                                            this.setState({ preview: true })
                                        }
                                        accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        className="inputfile"
                                    />
                                    <label htmlFor="file">
                                        {language.document[currentLanguage]}
                                    </label>
                                </form>
                            </div>
                            <button
                                className={
                                    "primaryBtn-1 btn smallBtn " +
                                    (this.state.viewBtnDiscussion === true
                                        ? " disabled "
                                        : "")
                                }
                                onClick={() => this.addPosts()}>
                                {language.adddiscussion[currentLanguage]}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="timeline">
                    {/* overlay */}
                    <div
                        className={
                            "timeline__month--container " +
                            (this.state.viewComment === true ? "overlay " : "")
                        }
                        id="august">
                        <div className="month__container">
                            <span>August</span>
                        </div>
                        {this.state.Discussions.map((item, index) => {
                            return (
                                //  overlay
                                <div
                                    className={
                                        "timeline__posts " +
                                        (this.state.rowPosts === index
                                            ? " overlay "
                                            : "")
                                    }
                                    key={index}
                                    tabIndex="1"
                                    onBlur={() => this.viewComments(index)}>
                                    <div className="timeline__posts--header">
                                        <figure className="zero avatarProfile ">
                                            <img
                                                alt=""
                                                title=""
                                                src={item.image ? item.image : Plus}
                                            />
                                        </figure>
                                        <div className="header__info">
                                            <h2 className="zero">
                                                {item.name}
                                                <span>@Procoor</span>
                                            </h2>
                                            <p className="zero">
                                                3 minutes ago
                                            </p>
                                        </div>
                                    </div>
                                    <div className="timeline__posts--body">
                                        <p className="zero">{item.message}</p>
                                        <div className="items__uploades">
                                            <img
                                                src={item.attachment}
                                                alt="Discussion"
                                            />
                                        </div>
                                    </div>
                                    <div className="timeline__posts--comments">
                                        <div className="comment_number">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24">
                                                <g
                                                    fill="none"
                                                    fillRule="nonzero">
                                                    <path
                                                        fill="#A8B0BF"
                                                        d="M3.55 16.448c-.305.193-.694.21-1.017.046A.963.963 0 0 1 2 15.647v-9.48C2 4.968 3.011 4 4.256 4h10.821c.597 0 1.17.227 1.594.632.424.406.662.958.662 1.535v6.409c0 1.27-.793 1.975-2.32 1.975H6.688L3.55 16.448zm.43-2.58l1.673-1.04c.162-.106.353-.164.552-.167h8.896a.263.263 0 0 0 .182-.071.225.225 0 0 0 .071-.162V6.167a.224.224 0 0 0-.071-.162.263.263 0 0 0-.182-.072H4.233c-.141 0-.253.107-.254.234l.001 7.7z"
                                                    />
                                                    <path
                                                        fill="#A8B0BF"
                                                        d="M7.96 16.495a.051.051 0 0 0 .022.005h6.905c.199.004-2.683 0 .905 0s3.588-2.393 3.588-3.329V6.803c1.124.185 2.253 1.067 2.253 2.13v10.724a.963.963 0 0 1-.533.847 1.036 1.036 0 0 1-1.018-.046l-3.284-1.74H8.069c-1.526 0-2.319-.706-2.319-1.976v-.247h2.21zm9.79-9.728h1.204c.046 0 .092.001.138.004l-1.342.003v-.007z"
                                                    />
                                                    <path
                                                        fill="#E9ECF0"
                                                        d="M3.98 13.868l1.673-1.04c.162-.106.353-.164.552-.167h8.896a.263.263 0 0 0 .182-.071.225.225 0 0 0 .071-.162V6.167a.224.224 0 0 0-.071-.162.263.263 0 0 0-.182-.072H4.233c-.141 0-.253.107-.254.234l.001 7.7z"
                                                    />
                                                </g>
                                            </svg>
                                            <span
                                                onClick={() =>
                                                    this.viewComments(index)
                                                }>
                                                {item.comments.length} Comments
                                            </span>
                                            {/* active */}
                                            <div
                                                className={
                                                    "comments__number--list " +
                                                    (this.state.rowPosts ===
                                                        index
                                                        ? " active "
                                                        : "")
                                                }>
                                                {item.comments.length > 0
                                                    ? item.comments.map(
                                                        (comments, i) => {
                                                            return (
                                                                <div
                                                                    className="timeline__posts"
                                                                    key={i}>
                                                                    <div className="timeline__posts--header">
                                                                        <figure className="zero avatarProfile ">
                                                                            <img
                                                                                alt=""
                                                                                title=""
                                                                                src={
                                                                                    comments.image
                                                                                }
                                                                            />
                                                                        </figure>
                                                                        <div className="header__info">
                                                                            <h2 className="zero">
                                                                                {
                                                                                    comments.name
                                                                                }
                                                                                <span>
                                                                                    @Procoor
                                                                                  </span>
                                                                            </h2>
                                                                            <p className="zero">
                                                                                3
                                                                                minutes
                                                                                ago
                                                                              </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="timeline__posts--body">
                                                                        <p className="zero">
                                                                            {
                                                                                comments.message
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                    : null}
                                            </div>
                                        </div>
                                        <div className="comment__field">
                                            <figure className="zero avatarProfile ">
                                                <img
                                                    alt=""
                                                    title=""
                                                    src={this.state.profilePath}
                                                />
                                            </figure>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Write your comment…"
                                                onFocus={() =>
                                                    this.addNewComment(
                                                        index,
                                                        item.id
                                                    )
                                                }
                                                onChange={e =>
                                                    this.handleCommentChange(e)
                                                }
                                            />
                                            <button
                                                className={
                                                    this.state.viewComment ===
                                                        true
                                                        ? "active "
                                                        : ""
                                                }
                                                onClick={() =>
                                                    this.addComments()
                                                }>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="32"
                                                    height="32"
                                                    viewBox="0 0 32 32">
                                                    <path
                                                        fill="#4382F9"
                                                        fillRule="evenodd"
                                                        d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm-6.398-8.697c-.009.247.043.39.169.508.234.221.47.24.826.063l13.758-6.86c.286-.142.574-.282.859-.429.347-.179.473-.505.325-.836-.075-.17-.22-.264-.38-.344l-7.834-3.92c-2.245-1.124-4.49-2.246-6.734-3.372-.266-.133-.518-.175-.77.02-.253.197-.248.457-.183.735l.991 4.278c.107.463.213.925.323 1.387.074.314.24.458.557.497.074.01.149.017.223.024l2.598.252 2.955.288 1.732.17c.123.012.197.07.193.2-.004.13-.089.162-.201.174-.637.065-1.273.135-1.91.201l-5.459.57c-.467.048-.608.179-.715.642l-1.103 4.775c-.08.35-.158.701-.22.977z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="customeTabs">
                <Tabs
                    selectedIndex={this.state.tabIndex}
                    onSelect={tabIndex => this.onClickTabItem(tabIndex)}>
                    <TabList>
                        <Tab>
                            <span className="subUlTitle">
                                {language["dashboard"][currentLanguage]}
                            </span>
                        </Tab>
                        <Tab>
                            <span className="subUlTitle">
                                {language["discussionPanel"][currentLanguage]}
                            </span>
                        </Tab>
                        <Tab>
                            <span className="subUlTitle">
                                {language["organizationChart"][currentLanguage]}
                            </span>
                        </Tab>
                    </TabList>
                    {/* View renderCategoryWidget */}
                    <TabPanel>
                        <div className="mainContainer dashboardCon projectDashboard">
                            {this.state.viewWidget
                                ? this.renderCategoryWidget()
                                : null}
                        </div>
                    </TabPanel>
                    {/* view renderDiscussions */}
                    <TabPanel>
                        <div className="mainContainer dashboardCon">
                            {this.renderDiscussions()}
                        </div>
                    </TabPanel>
                    {/* view renderOrganizationChart */}
                    <TabPanel>
                        <div className="mainContainer dashboardCon projectDashboard">
                            {this.renderOrganizationChart()}
                        </div>
                    </TabPanel>
                </Tabs>

                {/* Custom DashBoard */}
                {this.state.viewDashBoard ? (
                    <DashBoard
                        opened={this.state.viewDashBoard}
                        closed={this.closeModal.bind(this)}
                    />
                ) : null}

                {/* this for Add organizationChart */}
                <SkyLight ref={ref => (this.simpleDialog = ref)}>
                    <div>
                        <header className="costHeader">
                            <h2 className="zero">
                                {language[this.state.mode][currentLanguage]}
                            </h2>
                        </header>
                        <Formik
                            initialValues={{ ...this.state.document }}
                            validationSchema={validationSchema}
                            onSubmit={values => {
                                if (this.state.isEdit === false) {
                                    this.editTree();
                                } else if (this.state.isEdit) {
                                    this.saveTree();
                                }
                            }}>
                            {({
                                errors,
                                touched,
                                handleBlur,
                                handleChange,
                                values,
                                handleSubmit,
                                setFieldTouched,
                                setFieldValue
                            }) => (
                                    <Form
                                        className="dropWrapper proForm"
                                        onSubmit={handleSubmit}>
                                        <Dropdown
                                            title="company"
                                            data={this.state.companies}
                                            selectedValue={
                                                this.state.selectedFromCompany
                                            }
                                            handleChange={event => {
                                                this.handleChangeDropDown(
                                                    event,
                                                    "companyId",
                                                    true,
                                                    "contacts",
                                                    "GetContactsByCompanyId",
                                                    "companyId",
                                                    "selectedFromCompany",
                                                    "selectedFromContact"
                                                );
                                            }}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.companyId}
                                            touched={touched.companyId}
                                            name="companyId"
                                            index="companyId"
                                        />

                                        <Dropdown
                                            title="fromContact"
                                            data={this.state.contacts}
                                            selectedValue={
                                                this.state.selectedFromContact
                                            }
                                            handleChange={event => {
                                                this.handleChangeDropDown(
                                                    event,
                                                    "contactId",
                                                    false,
                                                    "contacts",
                                                    "",
                                                    "contactId",
                                                    "selectedFromContact",
                                                    ""
                                                );
                                            }}
                                            onChange={setFieldValue}
                                            onBlur={setFieldTouched}
                                            error={errors.contactId}
                                            touched={touched.contactId}
                                            name="contactId"
                                            index="contactId"
                                        />
                                        <div className="fullWidthWrapper">
                                            {this.state.isLoading === false ? (
                                                <button
                                                    className="primaryBtn-1 btn middle__btn"
                                                    type="submit">
                                                    {
                                                        language["save"][
                                                        currentLanguage
                                                        ]
                                                    }
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
                        title={
                            language["smartDeleteMessage"][currentLanguage]
                                .content
                        }
                        buttonName="delete"
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        clickHandlerContinue={this.clickHandlerContinueMain.bind(
                            this
                        )}
                    />
                ) : null}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        showLeftMenu: state.communication.showLeftMenu,
        showSelectProject: state.communication.showSelectProject,
        projectId: state.communication.projectId,
        projectName: state.communication.projectName
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(dashboardComponantActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardProject);

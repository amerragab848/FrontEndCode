import React, { Component, Fragment } from "react";
import Api from "../../api";
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import moment from "moment";
import CryptoJS from "crypto-js";
import { withRouter } from "react-router-dom";
import Config from "../../Services/Config.js";

const Autodesk = window.Autodesk;

const listOfOptions = [
    { label: "View WithOut Markups", value: 1 },
    { label: "View Markups", value: 2 },
    { label: "Edit Markups", value: 3 }
];

const markUpsModel = {
    projectId: 0,
    docType: 17,
    docId: "",
    docFileId: "",
    svg: "",
    viewerState: ""
};

let docId = 0;
let docTypeId = 0;
let encrypte = "";
let fileName = "";
let id = 0;
let projectId = 0;

let oDocument = null,
    oViewer = null;
let oViews3D = null,
    oViews2D = null;
let urn = null;
class AutoDeskViewer extends Component {
    constructor(props) {

        super(props);

        const query = new URLSearchParams(this.props.location.search);

        let index = 0;

        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));
                    docId = obj.docId;
                    docTypeId = obj.docTypeId;
                    encrypte = obj.encrypte;
                    fileName = obj.fileName;
                    id = obj.id;
                    projectId = obj.projectId;
                } catch {
                    this.props.history.goBack();
                }
            }
            index++;
        }

        this.state = {
            docId: docId,
            projectId: projectId,
            docType: docTypeId,
            docFileId: id,
            fileName: fileName,
            attachFile: encrypte,
            view: null,
            loaded: false,
            showCheckBox: true,
            selectedMode: { label: "Select Mode", value: 0 },
            isViewEdit: false,
            viewLoading: true,
            viewEditMarkUps: false,
            contactName: localStorage.getItem("contactName") !== null ? localStorage.getItem("contactName") : "Procoor User",
            showAll: true,
            markupId: 0,
            modeId: 0,
            markups: [],
            markupCore: {},
            markup: {},
            viewer: null,
            loadingPer: false
        };
    }

    getForgeToken() {
        return {
            access_token: this.state.access_token,
            expires_in: 3600,
            token_type: "Bearer"
        };
    }

    handleTokenRequested(onAccessToken) {
        if (onAccessToken) {
            let token = this.getForgeToken();
            if (token) onAccessToken(token.access_token, token.expires_in);
        }
    }


    componentDidMount() {
        var PercentageID = document.getElementById("precent");

        this.animateValue(PercentageID, 0, 98);

        let obj = {
            fileName: this.state.fileName,
            attachFile: decodeURIComponent(this.state.attachFile)
        };

        Api.post("translateAutoDesk", obj).then(data => {
            this.showModel(data);
        });

        Api.get("GetAllMarkUps?docId=" + this.state.docId + "&docType=" + this.state.docType + "&docFileId=" + this.state.docFileId).then(markups => {
            this.setState({ markups });
            let markupsList = [];
            markups.forEach((item, index) => {
                markupsList.push({ label: item.viewerState, value: index });
            });
            this.setState({ markupsList });
        });

        this.setState({
            selectedMode: { label: "View Markups", value: 2 }
        });
    }

    animateValue(id, start, end) {
        var current = start,
            obj = id,
            duration = this.state.loadingPer === true ? 0 : 1000;

        var timer = setInterval(function () {
            current = current + 1;
            obj.innerHTML = current + "%";
            if (current === end) {
                clearInterval(timer);
            }
        }, duration);
    }

    showAllToggle = () => {

        this.setState({
            showCheckBox: !this.state.showCheckBox,
            showAll: !this.state.showAll,
            isViewEdit: !this.state.isViewEdit,
            viewEditMarkUps: !this.state.viewEditMarkUps,
        });

        // if (this.state.showAll == true) {
        //     this.setState({ showAll: false, viewEditMarkUps: true });
        // } else {
        //     this.setState({ viewEditMarkUps: false, showAll: true });
        //     this.state.markups.forEach(item => {
        //         this.restoreState(item.svg, item.viewerState);
        //     });
        // }
    };

    restoreState = (svg, name) => {
        let markup = svg;
        let viewer = this.state.viewer;
        viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then(markupsExt => {
            let markupCore = markupsExt;
            // load the markups
            markupCore.show();
            markupCore.loadMarkups(markup, name);
            this.setState({ markupCore });
        });
    };

    modeIdToggle = value => {
        if (value == 1) {
            let markupCore = this.state.markupCore;
            if (markupCore) {
                markupCore.leaveEditMode();
                markupCore.hide();
            }
            this.setState({
                showCheckBox: false,
                showAll: false,
                isViewEdit: false,
                viewEditMarkUps: false,
                markupCore
            });
        } else if (value == 2) {
            this.setState({
                showCheckBox: true,
                showAll: true,
                isViewEdit: false,
                viewEditMarkUps: false
            });
        } else {
            this.setState({
                showCheckBox: false,
                showAll: false,
                isViewEdit: true,
                viewEditMarkUps: false
            });
            this.state.markups.forEach(item => {
                this.restoreState(item.svg, item.viewerState);
            });
            this.editingMarkUps();
        }
    };

    editingMarkUps = () => {
        if (this.state.markups.length > 0) {
            this.state.markups.forEach(item => {
                this.state.viewer.loadExtension("Autodesk.Viewing.MarkupsCore").then(markupsExt => {
                    let markupCore = markupsExt;
                    // load the markups
                    markupCore.show();
                    markupCore.loadMarkups(item.svg, item.viewerState);
                    markupCore.enterEditMode();
                    this.setState({ markupCore });
                });
            });
        } else {
            let viewer = this.state.viewer;
            viewer.loadExtension("Autodesk.Viewing.MarkupsCore")
                .then(markupsExt => {
                    this.setState({ markupCore: markupsExt, viewer });
                });
        }
    };

    showModel = urn => {
        var options = {
            env: "AutodeskProduction",
            getAccessToken: this.getAccessToken,
            refreshToken: this.getAccessToken,
            useADP: true
        };

        var documentId = "urn:" + urn;
        Autodesk.Viewing.Initializer(options, () => {
            Autodesk.Viewing.Document.load(documentId, doc => {
                // A document contains references to 3D and 2D geometries.
                var geometries = doc.getRoot().search({ type: "geometry" });
                if (geometries.length === 0) {
                    console.error("Document contains no geometries.");
                    return;
                }
                // Choose any of the avialable geometries
                var initGeom = geometries[0];
                // Create Viewer instance
                var viewerDiv = document.getElementById("forgeViewer");
                var config = {
                    extensions: initGeom.extensions() || []
                };
                var viewer = new Autodesk.Viewing.Private.GuiViewer3D(
                    viewerDiv,
                    config
                );
                var svfUrl = doc.getViewablePath(initGeom);
                var modelOptions = {
                    sharedPropertyDbPath: doc.getPropertyDbPath()
                };
                viewer.start(svfUrl, modelOptions, () => {
                    this.state.markups.forEach(item => {
                        this.restoreState(item.svg, item.viewerState);
                    });
                },
                    console.log("....Loading fail model autoDesk")
                );
                this.setState({ viewer, loaded: true });
            },
                function (errorCode, errorMessage) {
                    console.log("....Loading fail model autoDesk", errorCode, errorMessage);
                }
            );
            this.setState({ loadingPer: true });
        });
    };

    getAccessToken = () => {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", Config.getPublicConfiguartion().static + "/api/Procoor/getAccessToken",
            false /*forge viewer requires SYNC*/
        );
        xmlHttp.send(null);
        return xmlHttp.responseText;
    };

    undo = () => {
        if (this.state.markupCore) {
            let markupCore = this.state.markupCore;
            markupCore.undo();
            this.setState({ markupCore });
        }
    };

    redo = () => {
        if (this.state.markupCore) {
            let markupCore = this.state.markupCore;
            markupCore.redo();
            this.setState({ markupCore });
        }
    };

    addComment = () => {
        if (this.state.markupCore) {
            let viewer = this.state.viewer;
            var extension = viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeText(
                this.state.markupCore
            );
            extension.enterEditMode();
            extension.changeEditMode(mode);
        }
    };

    addCircle = () => {
        if (this.state.markupCore) {
            let viewer = this.state.viewer;
            var extension = viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeCircle(
                this.state.markupCore
            );
            extension.enterEditMode();
            extension.changeEditMode(mode);
        }
    };

    addArrow = () => {
        if (this.state.markupCore) {
            let viewer = this.state.viewer;
            var extension = viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeArrow(
                this.state.markupCore
            );
            extension.enterEditMode();
            extension.changeEditMode(mode);
        }
    };

    addRectangle = () => {
        if (this.state.markupCore) {
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeRectangle(
                this.state.markupCore
            );
            let viewer = this.state.viewer;
            var extension = viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            extension.enterEditMode();
            extension.changeEditMode(mode);
        }
    };

    Freehand = () => {
        if (this.state.markupCore) {
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeFreehand(
                this.state.markupCore
            );
            let viewer = this.state.viewer;
            var extension = viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            extension.enterEditMode();
            extension.changeEditMode(mode);
        }
    };

    clear = () => {
        let markupCore = this.state.markupCore;
        if (this.state.markupCore) {
            markupCore.clear();
            this.setState({ markupCore });
        }
    };

    close = () => {
        let markupCore = this.state.markupCore;
        if (this.state.markupCore) {
            markupCore.leaveEditMode();
            markupCore.hide();
            this.setState({
                markupCore,
                viewEditMarkUps: false,
                showCheckBox: false,
                isViewEdit: false
            });
        }
    };

    deleteAction = () => {
        let markupCore = this.state.markupCore;
        markupCore.deleteMarkup();
        this.setState({ markupCore });
    };

    saveState = () => {
        if (this.state.markupCore) {
            // markups we just created as a string svg
            let markupCore = this.state.markupCore;
            var markupsPersist = markupCore.generateData();
            // current view state (zoom, direction, sections)
            let markUpObj = markUpsModel;
            markUpObj.svg = markupsPersist;
            markUpObj.viewerState = this.state.contactName + "-" + moment().format("DD/MM/YYYY") + "-" + new Date().getTime();
            markUpObj.docType = this.state.docType;
            markUpObj.docId = this.state.docId;
            markUpObj.docFileId = this.state.docFileId;
            markUpObj.projectId = this.state.projectId;
            Api.post("SaveMarkupsState", markUpObj).then(data => {
                markupCore.leaveEditMode();
                markupCore.hide();
                let markupsList = [];
                data.forEach((item, index) => {
                    markupsList.push({ label: item.viewerState, value: index });
                    this.restoreState(item.svg, item.viewerState);
                });
                this.setState({
                    markupsList,
                    markups: data,
                    markupCore,
                    showCheckBox: true,
                    showAll: true,
                    isViewEdit: false,
                    viewEditMarkUps: false,
                    selectedMode: listOfOptions[1]
                });
            });
        }
    };

    changeMarkup = value => {
        let item = this.state.markups[value];
        this.restoreState(item.svg, item.viewerState);
    };

    render() {
        return (
            <div className="mainContainer main__withouttabs white-bg">
                {this.state.loaded == true ? (
                    <Fragment>
                        <div className="autoDisk__dropdown">
                            <div className="autoDisk__dropdown--comp">
                                <Dropdown title="mode" data={listOfOptions} selectedValue={this.state.selectedMode}
                                    handleChange={event => {
                                        this.modeIdToggle(event.value);
                                        this.setState({ selectedMode: event });
                                    }}
                                    index="mode"
                                />
                            </div>
                            <div id="markupBox" className={"ui checkbox checkBoxGray300 " + (this.state.showAll == true ? "checked" : "")} onClick={this.showAllToggle}>
                                <input name="CheckBox" type="checkbox" id="allPermissionInput"
                                    checked={this.state.showAll == true ? "checked" : ""} />
                                <label>Show</label>
                            </div>
                            <div className="autoDisk__dropdown--comp">
                                <Dropdown title="markups" data={this.state.markupsList} selectedValue={this.state.selectedMarkup}
                                    handleChange={event => this.changeMarkup(event.value)} index="markups" />
                            </div>
                        </div>
                        {this.state.isViewEdit == true ? (
                            <div id="markup-panel" className="docking-panel"
                                style={{
                                    resize: "none",
                                    border: "1px solid rgba(0, 0, 0, 0.2)",
                                    backgroundColor: "transparent",
                                    top: "20%",
                                    width: "15%",
                                    height: "27%",
                                    maxHeight: "513px",
                                    maxWidth: "881.406px"
                                }}>
                                <section className="docking-panel-title"
                                    style={{
                                        color: "#0a131c",
                                        backgroundColor: "transparent",
                                        borderBottom:
                                            "solid 1px rgba(0, 0, 0, 0.2)"
                                    }}>
                                    Markup Editor
                                </section>
                                <section className="docking-panel-close" />
                                <div className="docking-panel-footer" />
                                <div className="docking-panel-scroll docking-panel-container-solid-color-a right" id="markup-panel-scroll-container">
                                    <div className="markups-panel-content">
                                        <div className="edit-tools">
                                            <div className="markup-actions"
                                                style={{
                                                    marginTop: "7%",
                                                    textAlign: "center"
                                                }}>
                                                <button className="primaryBtn-1 btn" dataToggle="tooltip" title="Undo" onClick={this.undo}>
                                                    Undo
                                                </button>
                                                <button className="primaryBtn-2 btnbtn table-btn-tooltip btn-xs btn-default" dataToggle="tooltip" title="Redo" onClick={this.redo}>
                                                    Redo
                                                </button>
                                            </div>
                                            <div className="markup-buttons" style={{ marginTop: "7%", textAlign: "center" }}>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" title="Arrow" onClick={this.addArrow}>
                                                    <i style={{ fontSize: "1.6em" }} className="fa fa-long-arrow-up" />
                                                </button>
                                                <button className="primaryBtn-1 btn" dataToggle="tooltip" title="Comment" onClick={this.addComment}>
                                                    <i style={{ fontSize: "1.6em" }} className="fa fa-comments" />
                                                </button>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" title="Circle" onClick={this.addCircle}>
                                                    <i style={{ fontSize: "1.6em" }} className="fa fa-circle" />
                                                </button>
                                                <button className="primaryBtn-1 btn" dataToggle="tooltip" title="Rectangle" onClick={this.addRectangle}>
                                                    <i style={{ fontSize: "1.6em" }} className="fa fa-square-o" />
                                                </button>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" title="Freehand" onClick={this.Freehand}>
                                                    <i style={{ fontSize: "1.6em" }} className="fa fa-pencil" />
                                                </button>
                                            </div>
                                            <div className="panel-actions" style={{ marginTop: "7%", textAlign: "center" }}>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" title="Clear" onClick={this.clear}>
                                                    Clear
                                                </button>
                                                <button className="primaryBtn-1 btn" style={{ margin: "0 5px" }} dataToggle="tooltip" title="Close" onClick={this.close}>
                                                    Close
                                                </button>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" title="Save" onClick={this.saveState}>
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </Fragment>
                ) : this.state.loadingPer === true ? null : (
                    <div id="my_percentage" className="loadingShow">
                        <span />
                        <div className="percentage" id="precent" />
                    </div>
                )}
                <div id="forgeViewer" />
            </div>
        );
    }
}
export default withRouter(AutoDeskViewer);

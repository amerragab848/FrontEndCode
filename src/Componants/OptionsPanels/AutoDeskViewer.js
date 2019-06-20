import React, { Component, Fragment } from 'react'
import Api from '../../api';
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import moment from "moment";
import CryptoJS from "crypto-js";
import { withRouter } from "react-router-dom";

const Autodesk = window.Autodesk;

const listOfOptions = [
    { label: 'View WithOut Markups', value: 1 },
    { label: 'View Markups', value: 2 },
    { label: 'Edit Markups', value: 3 },
];
const markUpsModel = {
    projectId: 0,
    docType: 17,
    docId: '',
    docFileId: '',
    svg: '',
    viewerState: ''
};
let docId = 0;
let docTypeId = 0;
let encrypte = "";
let fileName = "";
let id = 0;
let projectId = 0;

class AutoDeskViewer extends Component {
    constructor(props) {
        super(props)
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

                }
                catch{
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
            view: null, loaded: false,
            showCheckBox: false,
            selectedMode: { label: 'Select Mode', value: 0 },
            isViewEdit: false,
            viewLoading: true,
            viewEditMarkUps: false,
            contactName: localStorage.getItem("contactName") !== null ? localStorage.getItem('contactName') : 'Procoor User',
            showAll: true,
            markupId: 0,
            modeId: 0,
            markups: [],
            markupCore: {},
            markup: {},
            viewer: null,
            loadingPer: false
        }

    }

    getForgeToken() {
        /* Normally, this would call an endpoint on your server to generate a public
        access token (using your client id and sercret). Doing so should yield a
        response that looks something like the following...
        */

        return {
            access_token: this.state.access_token,
            expires_in: 3600,
            token_type: "Bearer"
        };
    }

    /* Once the viewer has initialized, it will ask us for a forge token so it can
    access the specified document. */
    handleTokenRequested(onAccessToken) {
        console.log('Token requested by the viewer.');
        if (onAccessToken) {
            let token = this.getForgeToken();
            if (token)
                onAccessToken(
                    token.access_token, token.expires_in);
        }
    }

    componentWillMount() {
        Api.get('GetAllMarkUps?docId=' + this.state.docId + '&docType=' + this.state.docType + '&docFileId=' + this.state.docFileId).then((markups) => {
            this.setState({ markups })
            let markupsList = []
            markups.forEach((item, index) => {
                markupsList.push({ label: item.viewerState, value: index })
            })
            this.setState({ markupsList })
            let obj = {
                fileName: 'visualization_-_conference_room.dwg',//this.state.fileName,// 
                attachFile: 'https://newgiza.azureedge.net/project-files/570dfbea-2046-4dc3-a704-5d8dc966befc.dwg'//this.state.attachFile // 
            }
            Api.post("translateAutoDesk", obj).then(data => {
                this.showModel(data);
            })
        })
    }

    componentDidMount() {
        var PercentageID = document.getElementById("precent");
        this.animateValue(PercentageID, 0, 98);
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
        let markupCore = this.state.markupCore;
        if (this.state.showAll == true) {
            if (markupCore) {
                // markupCore.leaveEditMode();
                // markupCore.hide();
            }
            this.setState({ showAll: false, viewEditMarkUps: true })
            // if (markup) {
            //     markup.leaveEditMode();
            //     markup.hide();
            // }
        } else {
            this.setState({ viewEditMarkUps: false, showAll: true })
            this.state.markups.forEach(item => {
                this.restoreState(item.svg, item.viewerState);
            })
        }
    }

    restoreState = (svg, name) => {
        let markup = svg;
        let viewer = this.state.viewer
        viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then(markupsExt => {
            let markupCore = markupsExt
            // load the markups
            markupCore.show();
            markupCore.loadMarkups(markup, name);
            this.setState({ markupCore })
        });
    }

    modeIdToggle = (value) => {
        if (value == 1) {
            let markupCore = this.state.markupCore
            if (markupCore) {
                markupCore.leaveEditMode();
                markupCore.hide();
            }
            // if (this.state.markup) {
            //     this.state.markup.leaveEditMode();
            //     this.state.markup.hide();
            // }
            this.setState({ showCheckBox: false, showAll: false, isViewEdit: false, viewEditMarkUps: false, markupCore })

        } else if (value == 2) {
            this.setState({ showCheckBox: true, showAll: true, isViewEdit: false, viewEditMarkUps: false })
            this.state.markups.forEach(item => {
                this.restoreState(item.svg, item.viewerState);
            })
        } else {
            this.setState({ showCheckBox: false, showAll: false, isViewEdit: true, viewEditMarkUps: false })
            this.state.markups.forEach(item => {
                this.restoreState(item.svg, item.viewerState);
            })
            this.editingMarkUps();

        }
    }

    editingMarkUps = () => {
        if (this.state.markups.length > 0) {
            this.state.markups.forEach(item => {
                this.state.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then(markupsExt => {
                    let markupCore = markupsExt
                    // load the markups
                    markupCore.show();
                    markupCore.loadMarkups(item.svg, item.viewerState);
                    markupCore.enterEditMode();
                    this.setState({ markupCore })
                });
            })

        } else {
            let viewer = this.state.viewer
            viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then(markupsExt => {
                this.setState({ markupCore: markupsExt, viewer })
            })

        }
    }

    showModel = (urn) => {
        var options = {
            env: 'AutodeskProduction',
            getAccessToken: this.getAccessToken,
            refreshToken: this.getAccessToken,
            useADP: false,
        };
        var documentId = 'urn:' + urn;
        Autodesk.Viewing.Initializer(options, () => {
            Autodesk.Viewing.Document.load(documentId, (doc) => {
                // A document contains references to 3D and 2D geometries.
                var geometries = doc.getRoot().search({ 'type': 'geometry' });
                if (geometries.length === 0) {
                    console.error('Document contains no geometries.');
                    return;
                }
                // Choose any of the avialable geometries
                var initGeom = geometries[0];
                // Create Viewer instance
                var viewerDiv = document.getElementById('forgeViewer');
                var config = {
                    extensions: initGeom.extensions() || []
                };
                var viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv, config);
                var svfUrl = doc.getViewablePath(initGeom);
                var modelOptions = {
                    sharedPropertyDbPath: doc.getPropertyDbPath()
                };
                viewer.start(svfUrl, modelOptions, () => {
                    this.state.markups.forEach(item => {
                        this.restoreState(item.svg, item.viewerState);
                    })
                }, console.log("Loading fail model autoDesk"));
                this.setState({ viewer, loaded: true })
            }, console.log("Loading fail model autoDesk"));
            this.setState({ loadingPer: true })
        });
    }

    getAccessToken = () => {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'http://172.30.1.17:8900/api/Procoor/getAccessToken', false /*forge viewer requires SYNC*/);
        xmlHttp.send(null);
        return xmlHttp.responseText;

    }

    undo = () => {
        if (this.state.markupCore) {
            let markupCore = this.state.markupCore;
            markupCore.undo();
            this.setState({ markupCore })

        } else {
            //  markup.undo();

        }
    }

    redo = () => {
        if (this.state.markupCore) {
            let markupCore = this.state.markupCore;
            markupCore.redo();
            this.setState({ markupCore })

        } else {
            //   markup.redo();

        }
    }

    addComment = () => {
        if (this.state.markupCore) {
            let viewer = this.state.viewer
            var extension = viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeText(this.state.markupCore);
            extension.enterEditMode();
            extension.changeEditMode(mode)

        } else {
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeText(this.state.markup);
            //      markup.changeEditMode(mode);

        }
    }

    addCircle = () => {
        if (this.state.markupCore) {
            let viewer = this.state.viewer
            var extension = viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeCircle(this.state.markupCore);
            extension.enterEditMode();
            extension.changeEditMode(mode)

        } else {
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeCircle(this.state.markup);
            //    markup.changeEditMode(mode);

        }

    }

    addArrow = () => {
        if (this.state.markupCore) {
            let viewer = this.state.viewer
            var extension = viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeArrow(this.state.markupCore);
            extension.enterEditMode();
            extension.changeEditMode(mode)

        } else {
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeArrow(this.state.markup);
            //   markup.changeEditMode(mode);

        }
    }

    addRectangle = () => {
        if (this.state.markupCore) {
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeRectangle(this.state.markupCore);
            let viewer = this.state.viewer
            var extension = viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            extension.enterEditMode();
            extension.changeEditMode(mode)

        } else {
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeRectangle(this.state.markup);
            //  markup.changeEditMode(mode);

        }
    }

    Freehand = () => {
        if (this.state.markupCore) {
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeFreehand(this.state.markupCore);
            let viewer = this.state.viewer
            var extension = viewer.getExtension("Autodesk.Viewing.MarkupsCore");
            extension.enterEditMode();
            extension.changeEditMode(mode)

        } else {
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeFreehand(this.state.markup);
            //markup.changeEditMode(mode);

        }
    }

    clear = () => {
        let markupCore = this.state.markupCore
        if (this.state.markupCore) {
            markupCore.clear();
            this.setState({ markupCore })
        } else {
            //markup.clear()
        }

    }

    close = () => {
        let markupCore = this.state.markupCore
        if (this.state.markupCore) {
            markupCore.leaveEditMode();
            markupCore.hide();
            this.setState({ markupCore, viewEditMarkUps: false, showCheckBox: false, isViewEdit: false })
        }
        //else {
        //     viewEditMarkUps(false);

        //     isViewEdit(false);

        //     markup.leaveEditMode();

        //     markup.hide();
        // }

    }

    deleteAction = () => {
        let markupCore = this.state.markupCore;
        markupCore.deleteMarkup();
        this.setState({ markupCore })
    }

    saveState = () => {
        if (this.state.markupCore) {
            // markups we just created as a string svg
            let markupCore = this.state.markupCore
            var markupsPersist = markupCore.generateData();
            // current view state (zoom, direction, sections)
            var viewerStatePersist = markupCore.viewer.getState();

            let markUpObj = markUpsModel;
            markUpObj.svg = markupsPersist;
            markUpObj.viewerState = this.state.contactName + "-" + moment().format("DD/MM/YYYY") + "-" + new Date().getTime();
            markUpObj.docType = this.state.docType;
            markUpObj.docId = this.state.docId;
            markUpObj.docFileId = this.state.docFileId;
            markUpObj.projectId = this.state.projectId;
            Api.post('SaveMarkupsState', markUpObj).then(data => {
                markupCore.leaveEditMode();
                markupCore.hide();
                let markupsList = []
                data.forEach((item, index) => {
                    markupsList.push({ label: item.viewerState, value: index })
                    this.restoreState(item.svg, item.viewerState)
                })
                this.setState({
                    markupsList, markups: data, markupCore, showCheckBox: true, showAll: true, isViewEdit: false, viewEditMarkUps: false,
                    selectedMode: listOfOptions[1]
                })
            })
        }
        // } else {
        //     // markups we just created as a string svg
        //     var markupsPersist = markup.generateData();
        //     // current view state (zoom, direction, sections)
        //     var viewerStatePersist = markup.viewer.getState();

        //     markUpObj(new markUpsModel());

        //     markUpObj().svg(markupsPersist);
        //     markUpObj().viewerState("doc" + moment().format());
        //     markUpObj().docType(docType());
        //     markUpObj().docId(docId());
        //     markUpObj().docFileId(docFileId());
        //     markUpObj().projectId(currentProjectId());

        //     dataservice.saveMarkupsState(undefined, markUpObj()).done(function (data) {
        //         markups(data);

        //         // finish edit of markup
        //         markup.leaveEditMode();
        //         // hide markups (and restore Viewer tools)
        //         markup.hide();

        //         viewEditMarkUps(false);

        //         isViewEdit(false);

        //         modeId(2);
        //     });
        // }


    }

    changeMarkup = (value) => {
        let item = this.state.markups[value]
        this.restoreState(item.svg, item.viewerState);
    }

    render() {
        return (
            <div className="mainContainer main__withouttabs white-bg">
                {this.state.loaded == true ?
                    <Fragment>
                        <div className="autoDisk__dropdown">
                            <div className="autoDisk__dropdown--comp">
                                <Dropdown
                                    title="mode"
                                    data={listOfOptions}
                                    selectedValue={this.state.selectedMode}
                                    handleChange={event => { this.modeIdToggle(event.value); this.setState({ selectedMode: event }) }}
                                    index="mode" />
                            </div>
                            {this.state.showCheckBox == true ?
                                <div id="markupBox" className={"ui checkbox checkBoxGray300 " + (this.state.showAll == true ? "checked" : "")} onClick={this.showAllToggle}>
                                    <input name="CheckBox" type="checkbox" id="allPermissionInput" checked={this.state.showAll == true ? "checked" : ""} />
                                    <label>Show</label>
                                </div> : null}
                            {this.state.viewEditMarkUps == true ?
                                <div className="autoDisk__dropdown--comp">
                                    <Dropdown
                                        title="markups"
                                        data={this.state.markupsList}
                                        selectedValue={this.state.selectedMarkup}
                                        handleChange={event => this.changeMarkup(event.value)}
                                        index="markups" />
                                </div> : null}
                        </div>

                        {this.state.isViewEdit == true ?
                            <div id="markup-panel" className="docking-panel" style={{ resize: 'none', border: '1px solid rgba(0, 0, 0, 0.2)', backgroundColor: 'transparent', top: '20%', width: '15%', height: '27%', maxHeight: '513px', maxWidth: '881.406px' }} >
                                <section className="docking-panel-title" style={{ color: '#0a131c', backgroundColor: 'transparent', borderBottom: 'solid 1px rgba(0, 0, 0, 0.2)' }}  >Markup Editor</section>
                                <section className="docking-panel-close"></section>
                                <div className="docking-panel-footer"></div>
                                <div className="docking-panel-scroll docking-panel-container-solid-color-a right" id="markup-panel-scroll-container">
                                    <div className="markups-panel-content">
                                        <div className="edit-tools">
                                            <div className="markup-actions" style={{ marginTop: '7%', textAlign: 'center' }}>
                                                <button className="primaryBtn-1 btn" dataToggle="tooltip" title="Undo" onClick={this.undo} >Undo</button>
                                                <button className="primaryBtn-2 btnbtn table-btn-tooltip btn-xs btn-default" dataToggle="tooltip" title="Redo" onClick={this.redo}>Redo</button>
                                            </div>
                                            <div className="markup-buttons" style={{ marginTop: '7%', textAlign: 'center' }}>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" title="Arrow" onClick={this.addArrow}>
                                                    <i style={{ fontSize: '1.6em' }} className="fa fa-long-arrow-up"></i>
                                                </button>
                                                <button className="primaryBtn-1 btn" dataToggle="tooltip" title="Comment" onClick={this.addComment}>
                                                    <i style={{ fontSize: '1.6em' }} className="fa fa-comments"></i>
                                                </button>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" title="Circle" onClick={this.addCircle}>
                                                    <i style={{ fontSize: '1.6em' }} className="fa fa-circle"></i>
                                                </button>
                                                <button className="primaryBtn-1 btn" dataToggle="tooltip" title="Rectangle" onClick={this.addRectangle}>
                                                    <i style={{ fontSize: '1.6em' }} className="fa fa-square-o"></i>
                                                </button>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" title="Freehand" onClick={this.Freehand}>
                                                    <i style={{ fontSize: '1.6em' }} className="fa fa-pencil"></i>
                                                </button>
                                            </div>
                                            <div className="panel-actions" style={{ marginTop: '7%', textAlign: 'center' }}>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" title="Clear" onClick={this.clear}>Clear</button>
                                                <button className="primaryBtn-1 btn" style={{ margin: '0 5px' }} dataToggle="tooltip" title="Close" onClick={this.close}>Close</button>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" title="Save" onClick={this.saveState}>Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null}
                    </Fragment>
                    : this.state.loadingPer === true ?
                        null :
                        <div id="my_percentage" className="loadingShow" >
                            <span></span>
                            <div className="percentage" id="precent"></div>
                        </div>
                }
                <div id="forgeViewer" >

                </div>
            </div>
        );
    }


} export default withRouter(AutoDeskViewer);






// var markUpObj = markUpsModel;
// var modeOptions = listOfOptions;




 //         markupId.subscribe(function (value) {

//             ko.utils.arrayForEach(markups(), function (item) {
//                 if (item.id == value) {

//                     restoreState(item.svg, item.viewerState);
//                 }
//             });
//         });

//         var elem = "";



//         function attached() {
//             // elem = document.getElementById("myBar");


//         };

//         function compositionComplete() {

//             $.fn.progressCircle = function (options) {
//                 return this.each(function (key, value) {
//                     var element = $(this);
//                     if (element.data('progressCircle')) {
//                         var progressCircle = new ProgressCircle(this, options);
//                         return element.data('progressCircle');
//                     }
//                     $(this).append('<div class="prog-circle">' +
//                                             '	<div class="percenttext"> </div>' +
//                                             '	<div class="slice">' +
//                                             '		<div class="bar"> </div>' +
//                                             '		<div class="fill"> </div>' +
//                                             '	</div>' +
//                                             '	<div class="after"> </div>' +
//                                             '</div>');
//                     var progressCircle = new ProgressCircle(this, options);
//                     element.data('progressCircle', progressCircle);
//                 });
//             };

//             $.fn.progressCircle.defaults = {
//                 nPercent: 10,
//                 showPercentText: true,
//                 circleSize: 100,
//                 thickness: 3
//             };

//             $('.circle').each(function () {
//                 $(this).progressCircle({
//                     nPercent: 0,
//                     showPercentText: true,
//                     thickness: 10,
//                     circleSize: 150
//                 });
//             });

//             var speed = $(this).data("size");
//             var speed = parseInt(speed) * 10;
//             var speed = parseInt(speed) / 1024;
//             var speed = parseInt(speed);

//             $(this).addClass("active");

//             circle('#circle', "#cricleinput", 1024);
//         };

//         function circle(circleID, cricleinput, speed) {

//             setTimeout(function () {
//                 $(circleID).each(function () {
//                     var ci = $(cricleinput).val();
//                     var ci = parseInt(ci) + 1;

//                     if (viewLoading() == false) ci = 100;

//                     if (ci < 100) {
//                         $(this).progressCircle({
//                             nPercent: ci,
//                             showPercentText: true,
//                             thickness: 10,
//                             circleSize: 150
//                         });
//                     }
//                     else
//                         if (ci == 100) {
//                             if (viewLoading() == false) {
//                                 ci = 99;

//                                 $(this).addClass("end").progressCircle({
//                                     nPercent: 100,
//                                     showPercentText: true,
//                                     thickness: 9,
//                                     circleSize: 150
//                                 });
//                             }
//                         }
//                     $(cricleinput).val(ci);
//                 });

//                 $(circleID).promise().done(function () {
//                     var ci = $("#cricleinput").val();
//                     if (ci < 105) {
//                         circle(circleID, cricleinput, speed);
//                     }
//                     else {
//                         var nextid = $(this).data("next");
//                         if (nextid != 'none') {
//                             $(cricleinput).val(0);
//                             circle(nextid, cricleinput, speed);
//                         }
//                         else {
//                             $(".end").addClass("complate");
//                         }
//                     }
//                 })
//             }, speed);
//         }

//         var ProgressCircle = function (element, options) {

//             var settings = $.extend({}, $.fn.progressCircle.defaults, options);
//             var thicknessConstant = 0.02;
//             var nRadian = 0;

//             computePercent();
//             setThickness();

//             var border = (settings.thickness * thicknessConstant) + 'em';
//             var offset = (1 - thicknessConstant * settings.thickness * 2) + 'em';
//             var circle = $(element);
//             var progCirc = circle.find('.prog-circle');
//             var circleDiv = progCirc.find('.bar');
//             var circleSpan = progCirc.children('.percenttext');
//             var circleFill = progCirc.find('.fill');
//             var circleSlice = progCirc.find('.slice');

//             if (settings.nPercent == 0) {
//                 circleSlice.hide();
//             } else {
//                 resetCircle();
//                 transformCircle(nRadians, circleDiv);
//             }
//             setBorderThickness();
//             updatePercentage();
//             setCircleSize();

//             function computePercent() {
//                 settings.nPercent > 100 || settings.nPercent < 0 ? settings.nPercent = 0 : settings.nPercent;
//                 nRadians = (360 * settings.nPercent) / 100;
//             }

//             function setThickness() {
//                 if (settings.thickness > 10) {
//                     settings.thickness = 10;
//                 } else if (settings.thickness < 1) {
//                     settings.thickness = 1;
//                 } else {
//                     settings.thickness = Math.round(settings.thickness);
//                 }
//             }

//             function setCircleSize() {
//                 progCirc.css('font-size', settings.circleSize + 'px');
//             }

//             function transformCircle(nRadians, cDiv) {
//                 var rotate = "rotate(" + nRadians + "deg)";
//                 cDiv.css({
//                     "-webkit-transform": rotate,
//                     "-moz-transform": rotate,
//                     "-ms-transform": rotate,
//                     "-o-transform": rotate,
//                     "transform": rotate
//                 });
//                 if (nRadians > 180) {
//                     transformCircle(180, circleFill);
//                     circleSlice.addClass(' clipauto ');
//                 }
//             }

//             function setBorderThickness() {

//                 progCirc.find(' .slice > div ').css({
//                     'border-width': border,
//                     'width': offset,
//                     'height': offset
//                 });

//                 progCirc.find('.after').css({
//                     'top': border,
//                     'left': border,
//                     'width': offset,
//                     'height': offset
//                 });

//             }

//             function resetCircle() {
//                 circleSlice.show();
//                 circleSpan.text('');
//                 circleSlice.removeClass('clipauto')
//                 transformCircle(20, circleDiv);
//                 transformCircle(20, circleFill);
//                 return this;
//             }

//             function updatePercentage() {
//                 settings.showPercentText && circleSpan.text(settings.nPercent + '%');
//             }
//         };

//         function move() {
//             var width = 10;
//             var sec = 2.5;
//             var count = 0;
//             var id = setInterval(frame, 2000);
//             function frame() {
//                 if (width >= 95) {
//                     clearInterval(id);
//                 } else {
//                     width++;
//                     sec++;
//                     count++;
//                     //elem.style.width = width - 6 + '%';
//                     //elem.innerHTML = width * 1 + '%';
//                 }
//             }
//         }

//         var viewer;
//         var markup;



//         function close() {

//             if (markupCore) {
//                 viewEditMarkUps(false);

//                 isViewEdit(false);

//                 markupCore.leaveEditMode();

//                 markupCore.hide();
//             } else {
//                 viewEditMarkUps(false);

//                 isViewEdit(false);

//                 markup.leaveEditMode();

//                 markup.hide();
//             }

//         }

//         function deleteAction() {

//             markup.deleteMarkup();
//         }

//        
//         var markupCore;

//    


//     }
// } export default AutoDeskViewer;

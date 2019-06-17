import React, { Component, Fragment } from 'react'
import Api from '../../api';
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import { func } from 'prop-types';

const Autodesk = window.Autodesk;

const listOfOptions = [
    { label: 'View WithOut Markups', value: 1 },
    { label: 'View Markups', value: 2 },
    { label: 'Edit Markups', value: 3 },
];

class AutoDeskViewer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            view: null, loaded: false,
            selectedMode: { label: 'View WithOut Markups', value: 1 },
            isViewEdit: false,
            markupCore: null,
            viewLoading: true,
            viewEditMarkUps: false,
            isViewMarkUp: false,
            showAll: true,
            docId: 0,
            currentProjectId: 0,
            docType: 0,
            docFileId: 0,
            markupId: 0,
            modeId: 0,
            markups: [],
            markupCore: {},
            markup: {},
            viewer: null,
        }

    }

    handleViewerError(error) {
        console.log('Error loading viewer.');
    }

    /* after the viewer loads a document, we need to select which viewable to
    display in our component */
    handleDocumentLoaded(doc, viewables) {
        if (viewables.length === 0) {
            console.error('Document contains no viewables.');
        }
        else {
            //Select the first viewable in the list to use in our viewer component
            this.setState({ view: viewables[0] });
        }
    }

    handleDocumentError(viewer, error) {
        console.log('Error loading a document');
    }

    handleModelLoaded(viewer, model) {
        console.log('Loaded model:', model);
        viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then((markupCore) => {
            // load the markups 
            // markupCore.loadMarkups(model.svg, model.viewerState);
            this.setState({ isViewEdit: true, markupCore })
        })
    }

    handleModelError(viewer, error) {
        console.log('Error loading the model.');
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
        Api.get('GetAllMarkUps?docId=640&docType=20&docFileId=38425').then((markups) => {
            this.setState({ markups })
            let obj = {
                fileName: 'visualization_-_conference_room.dwg',
                attachFile: 'https://newgiza.azureedge.net/project-files/570dfbea-2046-4dc3-a704-5d8dc966befc.dwg'
            }
            Api.post("translateAutoDesk", obj).then(data => {
                this.showModel(data,markups);
                //this.modeIdToggle(2);
            })
        })
    }
    showAllToggle = (value) => {
        if (value == false) {
            if (this.state.markupCore) {
                this.state.markupCore.leaveEditMode();
                this.state.markupCore.hide();
            }
            if (this.state.markup) {
                this.state.markup.leaveEditMode();
                this.state.markup.hide();
            }
        } else {
            this.setState({ isViewMarkUp: true, isViewEdit: false, viewEditMarkUps: false })
            this.state.markups.forEach(item => {
                this.restoreState(item.svg, item.viewerState);
            })
        }
    }

    restoreState = (svg, name) => {
        let markup = svg;
        this.state.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then(markupsExt => {
            this.setState({ markupCore: markupsExt })
            // load the markups
            this.state.markupCore.show();
            this.state.markupCore.loadMarkups(markup, name);
            this.setState({ viewEditMarkUps: false, isViewEdit: false })
        });
    }

    modeIdToggle = (value) => {
        if (value == 1) {
            if (this.state.markupCore) {
                this.state.markupCore.leaveEditMode();
                this.state.markupCore.hide();
            }
            if (this.state.markup) {
                this.state.markup.leaveEditMode();
                this.state.markup.hide();
            }
            this.setState({ isViewMarkUp: false, isViewEdit: false, viewEditMarkUps: false })

        } else if (value == 2) {
            this.setState({ isViewMarkUp: true, isViewEdit: false, viewEditMarkUps: false })
            this.state.markups.forEach(item => {
                this.restoreState(item.svg, item.viewerState);
            })
        } else {
            this.setState({ isViewMarkUp: false, isViewEdit: true, viewEditMarkUps: true })
            this.editingMarkUps();

        }
    }

    editingMarkUps = () => {
        this.setState({ isViewEdit: true, viewEditMarkUps: true })

        if (this.state.markups.length > 0) {
            this.state.markups.forEach(item => {
                this.state.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then(markupsExt => {
                    this.setState({ markupCore: markupsExt })
                    // load the markups
                    this.state.markupCore.show();
                    this.state.markupCore.loadMarkups(item.svg, item.viewerState);
                    this.setState({ isViewEdit: true, viewEditMarkUps: true })
                });
            })
            this.state.markupCore.enterEditMode();

        } else {
            this.state.viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then(function (markupsExt) {
                this.setState({ markupCore: markupsExt })
                this.state.markup.enterEditMode();

            });
        }

    }

    showModel = (urn,markups) => {  
        var options = {
            env: 'AutodeskProduction',
            getAccessToken: this.getAccessToken,
            refreshToken: this.getAccessToken
        };
        var documentId = 'urn:' + urn;
        Autodesk.Viewing.Initializer(options, function onInitialized() {
            Autodesk.Viewing.Document.load(documentId, function(doc)  {
         
                var viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), { 'type': 'geometry' }, true);
                if (viewables.length === 0) {
                    console.error('Document contains no viewables.');
                    return;
                }
                // Choose any of the avialble viewables
                var initialViewable = viewables[0];
                var svfUrl = doc.getViewablePath(initialViewable);
                var modelOptions = {
                    sharedPropertyDbPath: doc.getPropertyDbPath()
                };
                var viewerDiv = document.getElementById('forgeViewer');
                let viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
                viewer.start(svfUrl, modelOptions, function() {
                    //      this.setState({ loaded: true }) 
                 
                    markups.forEach(item => {
                        this.restoreState(item.svg, item.viewerState);
                    });
                }, function () {
                    console.error('onLoadModelError() - errorCode:');
                });
                // this.setState({ viewer })
            }, alert("onDocumentLoadFailure"));
        }); 
    }

    getAccessToken = () => {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'http://172.30.1.17:8900/api/Procoor/getAccessToken', false /*forge viewer requires SYNC*/);
        xmlHttp.send(null);
        return xmlHttp.responseText;

    }
    onDocumentLoadSuccess = (doc) => {
        // A document contains references to 3D and 2D viewables.

    }

    /**
     * Autodesk.Viewing.Document.load() failuire callback.
     */
    onDocumentLoadFailure = (viewerErrorCode) => {
        console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
    }

    /**
     * viewer.loadModel() success callback.
     * Invoked after the model's SVF has been initially loaded.
     * It may trigger before any geometry has been downloaded and displayed on-screen.
     */
    onLoadModelSuccess(model) {
        console.log('onLoadModelSuccess()!');
        console.log('Validate model loaded: ' + (this.state.viewer.model === model));
        console.log(model);
        this.setState({ loaded: true })
        this.state.markups.forEach(item => {
            this.restoreState(item.svg, item.viewerState);
        });
    }

    /**
     * viewer.loadModel() failure callback.
     * Invoked when there's an error fetching the SVF file.
     */
    onLoadModelError(viewerErrorCode) {
        console.error('onLoadModelError() - errorCode:' + viewerErrorCode);
    }


    handleChangeItemDropDown = () => {

    }

    undo() {
        if (this.state.markupCore) {
            this.state.markupCore.undo();

        } else {
            //  markup.undo();

        }
    }
    redo() {
        if (this.state.markupCore) {
            this.state.markupCore.redo();

        } else {
            //   markup.redo();

        }
    }
    addComment = () => {
        if (this.ForgeViewer) {
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeText(this.state.markupCore);
            console.log(this.state.markupCore)
            let markUpObj = this.state.markupCore;
            markUpObj.changeEditMode(mode)
            this.setState({ markupCore: markUpObj })

        } else {
            var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeText(this.state.markup);
            //      markup.changeEditMode(mode);

        }
    }
    // addCircle() {
    //     if (this.state.markupCore) {
    //         var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeCircle(this.state.markupCore);
    //         this.state.markupCore.changeEditMode(mode);

    //     } else {
    //         var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeCircle(this.state.markup);
    //     //    markup.changeEditMode(mode);

    //     }

    // }
    // addArrow() {
    //     if (this.state.markupCore) {
    //         var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeArrow(this.state.markupCore);
    //         this.state.markupCore.changeEditMode(mode);

    //     } else {
    //         var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeArrow(this.state.markup);
    //      //   markup.changeEditMode(mode);

    //     }
    // }
    // addRectangle() {
    //     if (markupCore) {
    //         var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeRectangle(this.state.markupCore);
    //         this.state.markupCore.changeEditMode(mode);

    //     } else {
    //         var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeRectangle(this.state.markup);
    //       //  markup.changeEditMode(mode);

    //     }
    // }
    // Freehand() {
    //     if (markupCore) {
    //         var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeFreehand(this.state.markupCore);
    //         this.state.markupCore.changeEditMode(mode);

    //     } else {
    //         var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeFreehand(this.state.markup);
    //         //markup.changeEditMode(mode);

    //     }
    // }
    // freeMoving() {
    //     if (this.state.markupCore) {
    //         var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModePen(this.state.markupCore);
    //         this.state.markupCore.changeEditMode(mode);

    //     } else {
    //         var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModePen(this.state.markup);
    //         //markup.changeEditMode(mode);

    //     }

    // }
    // clear() {
    //     if (this.state.markupCore) {
    //         this.state.markupCore.clear()
    //     } else {
    //         //markup.clear()
    //     }

    // }

    // close() {

    //     // if (markupCore) {
    //     //     viewEditMarkUps(false);

    //     //     isViewEdit(false);

    //     //     markupCore.leaveEditMode();

    //     //     markupCore.hide();
    //     // } else {
    //     //     viewEditMarkUps(false);

    //     //     isViewEdit(false);

    //     //     markup.leaveEditMode();

    //     //     markup.hide();
    //     // }

    // }

    // deleteAction() {

    //     //markup.deleteMarkup();
    // }



    render() {
        return (
            <div className="mainContainer main__withouttabs">
                    <div id="forgeViewer">

</div>
                {this.state.loaded == true ?

                    <Fragment>
                        <div className="autoDisk__dropdown">
                            <div className="autoDisk__dropdown--comp">
                                <Dropdown
                                    title="unit"
                                    data={listOfOptions}
                                    selectedValue={this.state.selectedMode}
                                    handleChange={event => this.handleChangeItemDropDown(event)}
                                    index="unit" />
                            </div>
                            <div className="autoDisk__dropdown--comp">

                            </div>
                        </div>
                        {this.state.isViewEdit == true ?
                            <div id="markup-panel" className="docking-panel" style={{ resize: 'none', border: '1px solid rgba(0, 0, 0, 0.2)', backgroundColor: 'transparent', top: '20%', width: '15%', height: '27%', maxHeight: '513px', maxWidth: '881.406px' }} >
                                <section className="docking-panel-title" style={{ color: '#0a131c', backgroundColor: 'transparent', borderBottom: 'solid 1px rgba(0, 0, 0, 0.2)' }} dataI18n="Markup Editor">Markup Editor</section>
                                <section className="docking-panel-close"></section>
                                <div className="docking-panel-footer"></div>
                                <div className="docking-panel-scroll docking-panel-container-solid-color-a right" id="markup-panel-scroll-container">
                                    <div className="markups-panel-content">
                                        <div className="edit-tools">
                                            <div className="markup-actions" style={{ marginTop: '7%', textAlign: 'center' }}>
                                                <button className="primaryBtn-1 btn" dataToggle="tooltip" dataPlacement="bottom" title="" dataOriginalTitle="Undo">Undo</button>
                                                <button className="primaryBtn-2 btnbtn table-btn-tooltip btn-xs btn-default" dataToggle="tooltip" dataPlacement="bottom" title="" dataOriginalTitle="Redo">Redo</button>
                                            </div>
                                            <div className="markup-buttons" style={{ marginTop: '7%', textAlign: 'center' }}>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" dataPlacement="bottom" title="" dataOriginalTitle="Arrow">
                                                    <i style={{ fontSize: '1.6em' }} className="fa fa-long-arrow-up"></i>
                                                </button>
                                                <button className="primaryBtn-1 btn" dataToggle="tooltip" dataPlacement="bottom" title="" dataOriginalTitle="Comment" onClick={this.addComment}>
                                                    <i style={{ fontSize: '1.6em' }} className="fa fa-comments"></i>
                                                </button>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" dataPlacement="bottom" title="" dataOriginalTitle="Circle">
                                                    <i style={{ fontSize: '1.6em' }} className="fa fa-circle"></i>
                                                </button>
                                                <button className="primaryBtn-1 btn" dataToggle="tooltip" dataPlacement="bottom" title="" dataOriginalTitle="Rectangle">
                                                    <i style={{ fontSize: '1.6em' }} className="fa fa-square-o"></i>
                                                </button>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" dataPlacement="bottom" title="" dataOriginalTitle="Freehand">
                                                    <i style={{ fontSize: '1.6em' }} className="fa fa-pencil"></i>
                                                </button>
                                            </div>
                                            <div className="panel-actions" style={{ marginTop: '7%', textAlign: 'center' }}>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" dataPlacement="bottom" title="" dataOriginalTitle="Clear">Clear</button>
                                                <button className="primaryBtn-1 btn" style={{ margin: '0 5px' }} dataToggle="tooltip" dataPlacement="bottom" title="" dataOriginalTitle="Close">Close</button>
                                                <button className="btn primaryBtn-2" dataToggle="tooltip" dataPlacement="bottom" title="" dataOriginalTitle="Save">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null}
                    
                        {/* <ForgeViewer ref={ref => this.ForgeViewer = ref}
                            version="6.0"
                            urn={this.state.urn}
                            view={this.state.view}
                            headless={false}
                            onViewerError={this.handleViewerError.bind(this)}
                            onTokenRequest={this.handleTokenRequested.bind(this)}
                            onDocumentLoad={this.handleDocumentLoaded.bind(this)}
                            onDocumentError={this.handleDocumentError.bind(this)}
                            onModelLoad={this.handleModelLoaded.bind(this)}
                            onModelError={this.handleModelError.bind(this)} */}
                        />
                    </Fragment>
                    : <h2>Loading...</h2>}
            </div>
        );
    }


} export default AutoDeskViewer;


// const markUpsModel = {
//     projectId = 0,
//     docType =  17,
//     docId = '',
//     docFileId =  '',
//     svg = '',
//     viewerState =''
// };



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



//         /**
//         * Autodesk.Viewing.Document.load() success callback.
//         * Proceeds with model initialization.
//         */
//        //       
//         function undo() {
//             if (markupCore) {
//                 markupCore.undo();

//             } else {
//                 markup.undo();

//             }
//         }
//         function redo() {
//             if (markupCore) {
//                 markupCore.redo();

//             } else {
//                 markup.redo();

//             }
//         }
//         function addComment() {
//             if (markupCore) {
//                 var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeText(markupCore);
//                 markupCore.changeEditMode(mode);

//             } else {
//                 var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeText(markup);
//                 markup.changeEditMode(mode);

//             }
//         }
//         function addCircle() {
//             if (markupCore) {
//                 var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeCircle(markupCore);
//                 markupCore.changeEditMode(mode);

//             } else {
//                 var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeCircle(markup);
//                 markup.changeEditMode(mode);

//             }

//         }
//         function addArrow() {
//             if (markupCore) {
//                 var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeArrow(markupCore);
//                 markupCore.changeEditMode(mode);

//             } else {
//                 var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeArrow(markup);
//                 markup.changeEditMode(mode);

//             }
//         }
//         function addRectangle() {
//             if (markupCore) {
//                 var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeRectangle(markupCore);
//                 markupCore.changeEditMode(mode);

//             } else {
//                 var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeRectangle(markup);
//                 markup.changeEditMode(mode);

//             }
//         }
//         function Freehand() {
//             if (markupCore) {
//                 var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeFreehand(markupCore);
//                 markupCore.changeEditMode(mode);

//             } else {
//                 var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeFreehand(markup);
//                 markup.changeEditMode(mode);

//             }
//         }
//         function freeMoving() {
//             if (markupCore) {
//                 var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModePen(markupCore);
//                 markupCore.changeEditMode(mode);

//             } else {
//                 var mode = new Autodesk.Viewing.Extensions.Markups.Core.EditModePen(markup);
//                 markup.changeEditMode(mode);

//             }

//         }
//         function clear() {
//             if (markupCore) {
//                 markupCore.clear()
//             } else {
//                 markup.clear()
//             }

//         }

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

//         function saveState() {
//             if (markupCore) {
//                 // markups we just created as a string svg
//                 var markupsPersist = markupCore.generateData();
//                 // current view state (zoom, direction, sections)
//                 var viewerStatePersist = markupCore.viewer.getState();

//                 markUpObj(new markUpsModel());

//                 markUpObj().svg(markupsPersist);
//                 markUpObj().viewerState(config.contactName() + "-" + moment().format("DD/MM/YYYY") + "-" + new Date().getTime());
//                 markUpObj().docType(docType());
//                 markUpObj().docId(docId());
//                 markUpObj().docFileId(docFileId());
//                 markUpObj().projectId(currentProjectId());

//                 dataservice.saveMarkupsState(undefined, markUpObj()).done(function (data) {
//                     markups(data);

//                     // finish edit of markup
//                     markupCore.leaveEditMode();
//                     // hide markups (and restore Viewer tools)
//                     markupCore.hide();

//                     viewEditMarkUps(false);

//                     isViewEdit(false);

//                     modeId(2);
//                 });
//             } else {
//                 // markups we just created as a string svg
//                 var markupsPersist = markup.generateData();
//                 // current view state (zoom, direction, sections)
//                 var viewerStatePersist = markup.viewer.getState();

//                 markUpObj(new markUpsModel());

//                 markUpObj().svg(markupsPersist);
//                 markUpObj().viewerState("doc" + moment().format());
//                 markUpObj().docType(docType());
//                 markUpObj().docId(docId());
//                 markUpObj().docFileId(docFileId());
//                 markUpObj().projectId(currentProjectId());

//                 dataservice.saveMarkupsState(undefined, markUpObj()).done(function (data) {
//                     markups(data);

//                     // finish edit of markup
//                     markup.leaveEditMode();
//                     // hide markups (and restore Viewer tools)
//                     markup.hide();

//                     viewEditMarkUps(false);

//                     isViewEdit(false);

//                     modeId(2);
//                 });
//             }


//         }

//         var markupCore;

//    


//     }
// } export default AutoDeskViewer;

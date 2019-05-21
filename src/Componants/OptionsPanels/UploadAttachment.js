import React, { Component, Fragment } from "react";
import classNames from "classnames";
import AttachUpload from "../../Styles/images/attacthUpload.png";
import AttachDrag from "../../Styles/images/attachDraggable.png";

import DropboxChooser from "react-dropbox-chooser";
import GooglePicker from "react-google-picker";

import Dropzone from "react-dropzone";
import Drive from '../../Styles/images/gdrive.png'
import dropbox from '../../Styles/images/dropbox.png'

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as communicationActions from "../../store/actions/communication";
import Config from "../../Services/Config";

class UploadAttachment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            docTypeId: this.props.docTypeId,
            docId: this.props.docId,
            link: this.props.link,
            parentId: "",
            _className: ""
        };
    }

    onCancel(files) { }

    onSuccess(files) {
        let selectedFiles = [];

        files.forEach(function (doc) {
            var newFile = {
                url: doc.link,
                progress: 0,
                fileName: doc.name
            };
            selectedFiles.push(newFile);
        });

        this.props.actions.uploadFileLinks("UploadFilesModalLinksByDocId?docId=" + this.props.docId + "&docTypeId=" + this.props.docTypeId, selectedFiles);
    }

    onDrop = (acceptedFiles, rejectedFiles) => {
        this.setState({ _className: " dragHover dropHover fullProgressBar" });
    };

    onDropRejected = rejectedFiles => {
        setTimeout(() => {
            this.setState({ _className: "hundredPercent" });
        }, 1000);
    };

    onDropAcceptedHandler = acceptedFiles => {
        setTimeout(() => {
            this.setState({ _className: "hundredPercent" });
        }, 500);

        acceptedFiles.forEach(element => {
            let formData = new FormData();
            formData.append("file", element);
            let header = {
                docTypeId: this.props.docTypeId,
                docId: this.props.docId,
                parentId: this.state.parentId
            };
            this.props.actions.uploadFile("BlobUpload", formData, header);
        });
        setTimeout(() => {
            this.setState({ _className: "zeropercent" });
        }, 1000);
    };

    renderAddAttachments = () => {
        return (
            <Dropzone onDrop={e => this.onDrop(e)} onDragLeave={e => this.setState({ _className: " " })}
                onDragOver={e => this.setState({ _className: "dragHover" })}
                onDropAccepted={e => this.onDropAcceptedHandler(e)}
                onDropRejected={this.onDropRejected}>
                {({ getRootProps, getInputProps, isDragActive }) => {
                    return (
                        <Fragment>
                            <div {...getRootProps()} className={classNames("dropzone", { "dropzone--isActive": isDragActive })}>
                                <input {...getInputProps()} />
                                {
                                    <div className={"uploadForm" + " " + this.state._className}>
                                        <div className="uploadFormDiv">
                                            <img src={AttachUpload} />
                                            <div className="dragUpload">
                                                <p>Drag and drop your files here</p>

                                                <form>
                                                    <input type="file" name="file" id="file" className="inputfile" />
                                                    <label>Upload</label>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="dragHoverDiv">
                                            <div id="myBar" />
                                            <img src={AttachDrag} />
                                            <div className="dragUpload">
                                                <p>Drop your files here!</p>
                                            </div>
                                        </div>
                                        <div className="progressBar">
                                            <div className="smallProgress" />
                                        </div>
                                    </div>
                                }
                            </div>
                        </Fragment>
                    );
                }}
            </Dropzone>
        );
    };

    renderEditAttachments = () => {
        return (
            <Dropzone onDrop={e => this.onDrop(e)} onDragLeave={e => this.setState({ _className: " " })}
                onDragOver={e => this.setState({ _className: "dragHover" })}
                onDropAccepted={e => this.onDropAcceptedHandler(e)}
                onDropRejected={this.onDropRejected}>
                {({ getRootProps, getInputProps, isDragActive }) => {
                    return (
                        <Fragment>
                            <div {...getRootProps()} className={classNames("dropzone", { "dropzone--isActive": isDragActive })}>
                                <input {...getInputProps()} />
                                {
                                    <div className={"uploadForm" + " " + this.state._className}>
                                        <div className="uploadFormDiv">
                                            <img src={AttachUpload} />
                                            <div className="dragUpload">
                                                <p>Drag and drop your files here</p>

                                                <form>
                                                    <input type="file" name="file" id="file" className="inputfile" />
                                                    <label>Upload</label>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="dragHoverDiv">
                                            <div id="myBar" />
                                            <img src={AttachDrag} />
                                            <div className="dragUpload">
                                                <p>Drop your files here!</p>
                                            </div>
                                        </div>
                                        <div className="progressBar">
                                            <div className="smallProgress" />
                                        </div>
                                    </div>
                                }
                            </div>
                        </Fragment>
                    );
                }}
            </Dropzone>
        );
    };

    renderDropBox = () => {
        return (
            <Fragment>
                <DropboxChooser
                    appKey={"einhoekbvh9jws7"}
                    success={files => this.onSuccess(files)}
                    cancel={() => this.onCancel()}
                    multiselect={true}
                    accessToken={"l7phamm2skocwwy"}
                    extensions={[".pdf", ".doc", ".docx", ".png"]}>
                    <div class="drive__button--tooltip">
                        <div class="drive__button Dbox">
                            <img src={dropbox} alt="drobBox" />

                        </div>
                        <div class="drive__toolTip">Dropbox</div>
                    </div>
                </DropboxChooser>
            </Fragment>
        );
    };

    renderGoogleDrive = () => {
        return (
            <GooglePicker
                clientId={"850532811390-1tqkrqcgjghv9tis79l92avsv03on7nf.apps.googleusercontent.com"}
                developerKey={"uof5qzvtwpq1dao"}
                scope={["https://www.googleapis.com/auth/drive.readonly"]}
                onChange={data => console.log("on change:", data)}
                onAuthFailed={data => console.log("on auth failed:", data)}
                multiselect={true}
                navHidden={true}
                authImmediate={false}
                mimeTypes={["image/png", "image/jpeg", "image/jpg"]}
                query={"a query string like .txt or fileName"}
                viewId={"DOCS"}
                createPicker={(google, oauthToken) => {
                    const googleViewId = google.picker.ViewId.FOLDERS;
                    const docsView = new google.picker.DocsView(googleViewId)
                        .setIncludeFolders(true)
                        .setMimeTypes("application/vnd.google-apps.folder")
                        .setSelectFolderEnabled(true);

                    const picker = new window.google.picker.PickerBuilder()
                        .addView(docsView)
                        .setOAuthToken(oauthToken)
                        .setDeveloperKey("AIzaSyDS-GpZszvOVwnS_E8I7CVZX7gNaVwvBHg")
                        .setCallback(() => {
                            console.log("Custom picker is ready!");
                        });

                    picker.build().setVisible(true);
                }}>
                <div class="drive__button--tooltip">
                    <div class="drive__button gDrive">
                        <img src={Drive} alt="googleDrive" />
                    </div>
                    <div class="drive__toolTip">Google drive</div>
                </div>
            </GooglePicker>
        );
    };

    render() {
        return (
            <Fragment>
                <div>
                    {this.props.changeStatus === false ? (Config.IsAllow(this.props.AddAttachments) ? this.renderAddAttachments() : null)
                        : (Config.IsAllow(this.props.EditAttachments) ? this.renderEditAttachments() : null)}
                    <div class="drives__upload">
                        <form>
                            <input type="file" name="file" id="file" class="inputfile" />
                            <label for="file">Open my folders</label>
                        </form>
                        <span class="upload__border"></span>
                        <div className="drive__wrapper">
                            <h2 className="zero">Upload from</h2>
                            {Config.IsAllow(this.props.ShowGoogleDrive)
                                ? this.renderGoogleDrive()
                                : null}
                            {Config.IsAllow(this.props.ShowDropBox)
                                ? this.renderDropBox()
                                : null}

                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        file: state.communication.file,
        files: state.communication.files,
        isLoadingFiles: state.communication.isLoadingFiles
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadAttachment);

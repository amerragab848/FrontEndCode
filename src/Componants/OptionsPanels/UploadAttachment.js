import React, { Component, Fragment } from "react";
import classNames from "classnames";
import AttachUpload from "../../Styles/images/attacthUpload.png";
import AttachDrag from "../../Styles/images/attachDraggable.png";
import DropboxChooser from "react-dropbox-chooser";
import GooglePicker from "react-google-picker";
import Dropzone from "react-dropzone";
import Drive from '../../Styles/images/gdrive.png';
import dropbox from '../../Styles/images/dropbox.png';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import Config from "../../Services/Config";
import Resources from "../../resources.json";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class UploadAttachment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            docTypeId: this.props.docTypeId,
            docId: this.props.docId,
            link: this.props.link,
            parentId: "",
            _className: "",
            onDragUpload: ''
        };
    }

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
        this.props.actions.setLoadingFiles();

        this.setState({ _className: " dragHover dropHover fullProgressBar" });
    };

    onDropRejected = rejectedFiles => {
        setTimeout(() => {
            this.setState({ _className: "hundredPercent" });
        }, 1000);
    };

    onDropAcceptedHandler = acceptedFiles => {

        this.setState({ _className: "hundredPercent" });


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
        // setTimeout(() => {

        // }, 1000);
        this.setState({ _className: "zeropercent" });
    };

    static getDerivedStateFromProps(props, state) {
        if (!props.isLoadingFilesUpload) {

            return {
                _className: ""
            }
        }
    }

    dragOverDiv = () => {
        this.props.actions.setLoadingFiles();
        this.setState({ _className: "dragHover" });
    }

    renderAddAttachments = () => {
        return (
            <Dropzone
                //onClick={evt => evt.preventDefault()}
                onDrop={e => this.onDrop(e)}
                onDragLeave={e => this.setState({ _className: " " })}
                onDragOver={this.dragOverDiv}
                onDropAccepted={e => this.onDropAcceptedHandler(e)}
                onDropRejected={this.onDropRejected} >
                {({ getRootProps, getInputProps, isDragActive }) => {
                    return (
                        <Fragment>
                            <div {...getRootProps()}  className={classNames("dropzone", { "dropzone--isActive": isDragActive })}>
                                <input {...getInputProps()} />
                                {
                                    <div className={"uploadForm" + " " + this.state._className}>
                                        <div className="uploadFormDiv">
                                            <img src={AttachUpload} />
                                            <div className="dragUpload">
                                                <p>{Resources.dropOrClick[currentLanguage]}</p>
                                            </div>
                                        </div>
                                        <div className="dragHoverDiv">
                                            <div id="myBar" />
                                            <img src={AttachDrag} />
                                            <div className="dragUpload">
                                                <p>{Resources.dropFiles[currentLanguage]}</p>
                                            </div>
                                        </div>
                                        <div className="progressBar">
                                            <div className={("smallProgress" + this.state.onDragUpload)} />
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
            <Dropzone
                //onClick={evt => evt.preventDefault()}
                onDrop={e => this.onDrop(e)}
                onDragLeave={e => this.setState({ _className: " " })}
                onDragOver={this.dragOverDiv}
                onDropAccepted={e => this.onDropAcceptedHandler(e)}
                onDropRejected={this.onDropRejected}>
                {({ getRootProps, getInputProps, isDragActive }) => {
                    return (
                        <Fragment>
                            <div {...getRootProps()}   className={classNames("dropzone", { "dropzone--isActive": isDragActive })}>
                                <input {...getInputProps()} />
                                {
                                    <div className={"uploadForm" + " " + this.state._className}>
                                        <div className="uploadFormDiv">
                                            <img src={AttachUpload} />
                                            <div className="dragUpload">
                                                <p>{Resources.dropOrClick[currentLanguage]}</p>

                                                <form>
                                                    <input type="file" name="file" id="file" className="inputfile" />
                                                    <label>{Resources.upload[currentLanguage]}</label>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="dragHoverDiv">
                                            <div id="myBar" />
                                            <img src={AttachDrag} />
                                            <div className="dragUpload">
                                                <p>{Resources.dropFiles[currentLanguage]}</p>
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
                    appKey={Config.getPublicConfiguartion().dropBoxappKey || ''}
                    accessToken={Config.getPublicConfiguartion().dropBoxToken}
                    success={files => this.onSuccess(files)}
                    cancel={() => this.onCancel()}
                    multiselect={true}
                    extensions={[".pdf", ".doc", ".docx", ".png", ".dwg", ".rvt"]}>
                    <div className="drive__button--tooltip">
                        <div className="drive__button Dbox">
                            <img src={dropbox} alt="drobBox" />
                        </div>
                        <div className="drive__toolTip">Dropbox</div>
                    </div>
                </DropboxChooser>
            </Fragment>
        );
    };

    renderGoogleDrive = () => {
        return (
            <GooglePicker
                clientId={Config.getPublicConfiguartion().googleDriveClientId || ''}
                developerKey={Config.getPublicConfiguartion().googleDriveKey}
                scope={["https://www.googleapis.com/auth/drive.readonly"]}
                onChange={data => console.log("on change:", data)}
                onAuthFailed={data => console.log("on auth failed:", data)}
                multiselect={true}
                navHidden={true}
                authImmediate={false}
                mimeTypes={["image/png", "image/jpeg", "image/jpg", "application/autocad_dwg", "application/dwg", "application/octet-stream"]}
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
                        .setDeveloperKey(Config.getPublicConfiguartion().googleDriveKey)
                        .setCallback(() => {
                        });

                    picker.build().setVisible(true);
                }}>
                <div className="drive__button--tooltip">
                    <div className="drive__button gDrive">
                        <img src={Drive} alt="googleDrive" />
                    </div>
                    <div className="drive__toolTip">Google drive</div>
                </div>
            </GooglePicker>
        );
    };

    render() {
        return (
            <Fragment>
                <div>
                    {this.props.changeStatus === false ?
                        (Config.IsAllow(this.props.AddAttachments) ? this.renderAddAttachments() : this.props.docTypeId === 6 ? this.renderAddAttachments() : null)
                        : (Config.IsAllow(this.props.EditAttachments) ? this.renderEditAttachments() : this.props.docTypeId === 6 ? this.renderEditAttachments() : null)}
                    <div className="drives__upload">
                        <form>
                            <input type="file" name="file" id="file" className="inputfile" />
                            <label htmlFor="file">{Resources.openMyFolders[currentLanguage]}</label>
                        </form>
                        <span className="upload__border"></span>
                        <div className="drive__wrapper">
                            <h2 className="zero">{Resources.uploadFrom[currentLanguage]}</h2>
                            {Config.IsAllow(this.props.ShowGoogleDrive) ? this.renderGoogleDrive() : null}
                            {Config.IsAllow(this.props.ShowDropBox) ? this.renderDropBox() : null}
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
        isLoadingFiles: state.communication.isLoadingFiles,
        isLoadingFilesUpload: state.communication.isLoadingFilesUpload

    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadAttachment);

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


class UploadExpensesAttachment extends Component {
    constructor(props) {
        super(props);

        this.state = {  
            parentId: "",
            _className: "",
            onDragUpload: ''
        };
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
                docType: "expenses_Attach" 
            };
            this.props.actions.uploadFile("UploadFiles", formData, header);
        }); 
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
            <Dropzone onDrop={e => this.onDrop(e)} onDragLeave={e => this.setState({ _className: " " })}
                onDragOver={this.dragOverDiv}
                onDropAccepted={e => this.onDropAcceptedHandler(e)}
                onDropRejected={this.onDropRejected} >
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
            </Dropzone >
        );
    };
 
    render() {
        return (
            <Fragment>
                <div>
                    {this.props.changeStatus === false ? this.renderAddAttachments()
                        :   null}
                    {/* <div className="drives__upload">
                        <form>
                            <input type="file" name="file" id="file" className="inputfile" />
                            <label htmlFor="file">{Resources.openMyFolders[currentLanguage]}</label>
                        </form>
                      
                    </div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(UploadExpensesAttachment);

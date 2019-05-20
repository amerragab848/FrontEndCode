import React, { Component, Fragment } from 'react'
import classNames from 'classnames'
import AttachUpload from '../../Styles/images/attacthUpload.png';
import AttachDrag from '../../Styles/images/attachDraggable.png';

import DropboxChooser from 'react-dropbox-chooser';
import GooglePicker from 'react-google-picker';

import Dropzone from 'react-dropzone';
import Drive from '../../Styles/images/googleDrive.png'
import dropbox from '../../Styles/images/dropbox.png'
import Config from "../../Services/Config.js";

import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';

import * as communicationActions from '../../store/actions/communication';

class UploadAttachment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            docTypeId: this.props.docTypeId,
            docId: this.props.docId,
            link: this.props.link,
            parentId: '',
            _className: ''
        }
    }

    onCancel(files) {

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
        this.setState({ _className: " dragHover dropHover fullProgressBar" })
    }

    onDropRejected = (rejectedFiles) => {
        setTimeout(() => {
            this.setState({ _className: "hundredPercent" })
        }, 1000)
    }

    onDropAcceptedHandler = (acceptedFiles) => {

        setTimeout(() => {
            this.setState({ _className: "hundredPercent" })
        }, 500)

        acceptedFiles.forEach(element => {
            let formData = new FormData();
            formData.append("file", element)
            let header = { 'docTypeId': this.props.docTypeId, 'docId': this.props.docId, 'parentId': this.state.parentId }
            this.props.actions.uploadFile("BlobUpload", formData, header);
        });
        setTimeout(() => {
            this.setState({ _className: "zeropercent" })
        }, 1000)
    }

    render() {
        return (// className={this.props.changeStatus === false ? (Config.IsAllow(addPermission) === true ? '' : 'disNone') : (Config.IsAllow(editPermission) === true ? '' : 'disNone')}
            <div>
                <Dropzone onDrop={e => this.onDrop(e)}
                    onDragLeave={e => this.setState({ _className: " " })}
                    onDragOver={e => this.setState({ _className: "dragHover" })} onDropAccepted={e => this.onDropAcceptedHandler(e)}
                    onDropRejected={this.onDropRejected} >
                    {({ getRootProps, getInputProps, isDragActive }) => {
                        return (
                            <Fragment>
                                <div
                                    {...getRootProps()}
                                    className={classNames('dropzone', { 'dropzone--isActive': isDragActive })}
                                >
                                    <input {...getInputProps()} />
                                    {
                                        <div className={"uploadForm" + " " + this.state._className}>
                                            <div className="uploadFormDiv">
                                                <img src={AttachUpload} />
                                                <div className="dragUpload">
                                                    <p>Drag and drop photos here to share your food shots! or</p>
                                                    <form>
                                                        <input type="file" name="file" id="file" className="inputfile" />
                                                        <label >Upload</label>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className="dragHoverDiv">
                                                <div id="myBar"></div>
                                                <img src={AttachDrag} />
                                                <div className="dragUpload">
                                                    <p>Drop your files here!</p>
                                                </div>
                                            </div>
                                            <div className='progressBar'>
                                                <div className='smallProgress'>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="drive__wrapper">
                                    <h2 className="zero">Upload from</h2>
                                    <div className="upload__drive">
                                        {/* <img src={Drive} alt="googleDrive" />
                                        <img src={dropbox} alt="googleDrive" /> */}
                                        <Fragment>
                                            <DropboxChooser
                                                appKey={'einhoekbvh9jws7'}
                                                success={files => this.onSuccess(files)}
                                                cancel={() => this.onCancel()}
                                                multiselect={true}
                                                accessToken={'l7phamm2skocwwy'}
                                                extensions={['.pdf', '.doc', '.docx', '.png']} >
                                                <div className="dropbox-button" >
                                                    <img src={dropbox} alt="googleDrive" />
                                                </div>
                                            </DropboxChooser>

                                            <GooglePicker
                                                clientId={'850532811390-1tqkrqcgjghv9tis79l92avsv03on7nf.apps.googleusercontent.com'}
                                                developerKey={'uof5qzvtwpq1dao'}
                                                scope={['https://www.googleapis.com/auth/drive.readonly']}
                                                onChange={data => console.log('on change:', data)}
                                                onAuthFailed={data => console.log('on auth failed:', data)}
                                                multiselect={true}
                                                navHidden={true}
                                                authImmediate={false}
                                                mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
                                                query={'a query string like .txt or fileName'}
                                                viewId={'DOCS'}
                                                createPicker={(google, oauthToken) => {
                                                    const googleViewId = google.picker.ViewId.FOLDERS;
                                                    const docsView = new google.picker.DocsView(googleViewId)
                                                        .setIncludeFolders(true)
                                                        .setMimeTypes('application/vnd.google-apps.folder')
                                                        .setSelectFolderEnabled(true);

                                                    const picker = new window.google.picker.PickerBuilder()
                                                        .addView(docsView)
                                                        .setOAuthToken(oauthToken)
                                                        .setDeveloperKey('AIzaSyDS-GpZszvOVwnS_E8I7CVZX7gNaVwvBHg')
                                                        .setCallback(() => {
                                                            console.log('Custom picker is ready!');
                                                        });

                                                    picker.build().setVisible(true);
                                                }}
                                            >
                                                <img src={Drive} alt="googleDrive" />

                                                <div className="google"></div>
                                            </GooglePicker>
                                        </Fragment>

                                    </div>
                                </div>

                            </Fragment>
                        )
                    }}
                </Dropzone>

            </div>
        )
    }
}


function mapStateToProps(state) {

    return {
        file: state.communication.file,
        files: state.communication.files,
        isLoadingFiles: state.communication.isLoadingFiles
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UploadAttachment)

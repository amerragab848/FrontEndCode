import React, { Component, createRef, Fragment } from 'react';
import DropboxChooser from 'react-dropbox-chooser';
import GooglePicker from 'react-google-picker';
import Dropzone from 'react-dropzone-uploader';
import Drive from '../../Styles/images/gdrive.png';
import dropbox from '../../Styles/images/dropbox.png';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Config from '../../Services/Config'; 
import { getDroppedOrSelectedFiles } from 'html5-file-selector';

// import classNames from 'classnames';
// import AttachUpload from '../../Styles/images/attacthUpload.png';
// import AttachDrag from '../../Styles/images/attachDraggable.png';
// import Resources from '../../resources.json';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class UploadAttachmentWithProgress extends Component {

    addBtnRef = createRef();
    uploadBtnRef = createRef();

    constructor(props) {
        super(props);

        this.state = {
            docTypeId: this.props.docTypeId,
            docId: this.props.docId,
            link: this.props.link,
            parentId: '',
            _className: '',
            onDragUpload: '',
            fileStatus: '',
        };
    }
    
    onSuccess(files) {
        let selectedFiles = [];

        files.forEach(function (doc) {
            var newFile = {
                url: doc.link,
                progress: 0,
                fileName: doc.name,
            };
            selectedFiles.push(newFile);
        });

        this.props.actions.uploadFileLinks('UploadFilesModalLinksByDocId?docId=' + this.props.docId + '&docTypeId=' + this.props.docTypeId, selectedFiles,);
    }

    onDrop = (acceptedFiles, rejectedFiles) => {
        this.props.actions.setLoadingFiles();

        this.setState({ _className: ' dragHover dropHover fullProgressBar' });
    };

    onDropRejected = rejectedFiles => {
        setTimeout(() => {
            this.setState({ _className: 'hundredPercent' });
        }, 1000);
    };

    onDropAcceptedHandler = acceptedFiles => {
        this.setState({ _className: 'hundredPercent' });

        acceptedFiles.forEach(element => {
            console.log(element.file);
            let formData = new FormData();
            formData.append('file', element.file);
            let header = {
                docTypeId: this.props.docTypeId,
                docId: this.props.docId,
                parentId: this.state.parentId,
            };

            console.log(formData);
            this.props.actions.uploadFile('BlobUpload', formData, header);
        });
        this.setState({ _className: 'zeropercent' });
    };

    static getDerivedStateFromProps(props, state) {
        if (!props.isLoadingFilesUpload) {
            return {
                _className: '',
            };
        }
    }

    renderDropBox = () => {
        return (
            <Fragment>
                <DropboxChooser
                    appKey={Config.getPublicConfiguartion().dropBoxappKey || ''}
                    accessToken={Config.getPublicConfiguartion().dropBoxToken}
                    success={files => this.onSuccess(files)}
                    cancel={() => this.onCancel()}
                    multiselect={true}
                    extensions={[
                        '.pdf',
                        '.doc',
                        '.docx',
                        '.png',
                        '.dwg',
                        '.rvt',
                    ]}>
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
                clientId={
                    Config.getPublicConfiguartion().googleDriveClientId || ''
                }
                developerKey={Config.getPublicConfiguartion().googleDriveKey}
                scope={['https://www.googleapis.com/auth/drive.readonly']}
                onChange={data => console.log('on change:', data)}
                onAuthFailed={data => console.log('on auth failed:', data)}
                multiselect={true}
                navHidden={true}
                authImmediate={false}
                mimeTypes={[
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'application/autocad_dwg',
                    'application/dwg',
                    'application/octet-stream',
                ]}
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
                        .setDeveloperKey(
                            Config.getPublicConfiguartion().googleDriveKey,
                        )
                        .setCallback(() => { });

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

    getUploadParams = ({ file, meta }) => {
        let header = {
            Authorization: localStorage.getItem('userToken'),
            docTypeId: this.props.docTypeId,
            docId: this.props.docId,
            parentId: this.state.parentId,
        };
        let url = Config.getPublicConfiguartion().static + 'PM/api/Procoor/BlobUpload';
        return { url: url, headers: header };
    };

    handleChangeStatus = ({ meta, file }, status, allFiles, response) => {
        this.setState({ fileStatus: status });
        if (allFiles.length && this.state.fileStatus == 'done') {
            this.uploadBtnRef.current.click();
            this.setState({ fileStatus: '' });
            if (response) {
                this.props.actions.insertFiletoAttachments(JSON.parse(response));
            }
        }
    };

    handleSubmit = (files, allFiles) => {
        allFiles.forEach(f => f.remove());
    };

    getFilesFromEvent = e => {
        return new Promise(resolve => {
            getDroppedOrSelectedFiles(e).then(chosenFiles => {
                resolve(chosenFiles.map(f => f.fileObject));
            });
        });
    };

    InputChooseFile = ({ accept, onFiles, files, getFilesFromEvent }) => {
        const text =
            files.length > 0 ? 'Add more files' : 'Choose files to upload';

        const buttonStyle = {
            backgroundColor: '#67b0ff',
            color: '#fff',
            cursor: 'pointer',
            padding: 15,
            borderRadius: 30,
        };

        return (
            <div className="dzu_actionbtns">
                <label
                    className="action_inner_btn dzu-inputLabel"
                    ref={this.addBtnRef}>
                    <input
                        style={{ display: 'none' }}
                        type="file"
                        accept={accept}
                        multiple
                        onChange={e => {
                            getFilesFromEvent(e).then(chosenFiles => {
                                onFiles(chosenFiles);
                            });
                        }}
                    />
                </label>
            </div>
        );
    };

    UploadFiles = ({ files }) => {
        return (
            <div
                className="dzu_actionbtns submitButton"
                ref={this.uploadBtnRef}>
                Upload
            </div>
        );
    }; 

    render() {
        return Config.IsAllow(this.props.AddAttachments) ||
            Config.IsAllow(this.props.EditAttachments) ? (
                <div>
                    <Dropzone
                        autoUpload={true}
                        getUploadParams={this.getUploadParams}
                        onChangeStatus={this.handleChangeStatus}
                        onSubmit={this.handleSubmit}
                        InputComponent={this.InputChooseFile}
                        submitButtonContent={this.UploadFiles}
                        getFilesFromEvent={this.getFilesFromEvent}
                        classNames
                    />

                    <div className="drives__upload">
                        <label
                            className="btn__upload"
                            onClick={() => this.addBtnRef.current.click()}>
                            Open my folders
                    </label>
                        <span class="upload__border"></span>
                        <div className="drive__wrapper">
                            <h2 class="zero">Upload From</h2>
                            {Config.IsAllow(this.props.ShowGoogleDrive)
                                ? this.renderGoogleDrive()
                                : null}
                            {Config.IsAllow(this.props.ShowDropBox)
                                ? this.renderDropBox()
                                : null}
                        </div>
                    </div>
                </div>
            ) : null;
    }
} 

function mapStateToProps(state) {
    return {
        file: state.communication.file,
        files: state.communication.files,
        isLoadingFiles: state.communication.isLoadingFiles,
        isLoadingFilesUpload: state.communication.isLoadingFilesUpload,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UploadAttachmentWithProgress);

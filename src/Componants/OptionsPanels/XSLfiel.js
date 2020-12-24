import React, { Component, createRef } from 'react';
import Dropzone from 'react-dropzone';
import { getDroppedOrSelectedFiles } from 'html5-file-selector';
import classNames from 'classnames';
import AttachUpload from '../../Styles/images/attacthUpload.png';
import AttachDrag from '../../Styles/images/attachDraggable.png';
import Resources from '../../../src/resources';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Api from '../../api';

import * as communicationActions from '../../store/actions/communication';
let currentLanguage =
    localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class XSLfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docType: this.props.docType,
            docId: this.props.docId,
            link: this.props.link,
            parentId: '',
            _className: '',
            header: this.props.header,
            acceptedFiles: [],
            Isloading: false,
            uploaded: false,
        };
    }
    uploadBtnRef = createRef();
    onDrop = (acceptedFiles, rejectedFiles) => {
        this.setState({ _className: ' dragHover dropHover fullProgressBar' });
    };

    onDropRejected = rejectedFiles => {
        toast.warning(Resources['chooseExcelFormat'][currentLanguage]);
        setTimeout(() => {
            this.setState({ _className: 'hundredPercent' });
        }, 1000);
    };

    onDropAcceptedHandler = acceptedFiles => {
        setTimeout(() => {
            this.setState({ _className: 'hundredPercent' });
        }, 500);
        this.setState({ acceptedFiles });
    };

    documentTemplateUpload = () => {
        if (this.state.acceptedFiles.length > 0) {
            let formData = new FormData();

            let file = this.state.acceptedFiles[0];
            formData.append('file0', file);

            let docType = this.props.docType;
            let header = { docType: docType };

            this.setState({ Isloading: true });

            let submittalOptions = {
                disciplineId: this.props.disciplineId,
                specsSectionId: this.props.specsSectionId,
                submittalTypeId: this.props.submittalTypeId,
                area: this.props.area,
                location: this.props.location,
                contractId: this.props.contractId,
                approvalStatusId: this.props.approvalStatusId,
            };

            for (var item in submittalOptions) {
                formData.append(item, submittalOptions[item]);
            }
            Api.postFile(
                'UploadExcelFilesTemplate?projectId=' +
                this.props.projectId +
                '&fromCompanyId=' +
                this.props.companyId +
                '&fromContactId=' +
                this.props.contactId +
                '&toCompanyId=' +
                this.props.toCompanyId +
                '&toContactId=' +
                this.props.toContactId,
                formData,
                header,
            )
                .then(resp => {
                    if (this.props.afterUpload != undefined) {
                        this.setState({ Isloading: false });
                        this.props.afterUpload();
                    }
                    setTimeout(() => {
                        this.setState({
                            _className: 'zeropercent',
                            Isloading: false,
                        });
                    }, 1000);
                })
                .catch(ex => {
                    toast.error(
                        Resources['operationCanceled'][currentLanguage],
                    );
                });
        }
    };

    upload = () => {
        if (this.state.acceptedFiles.length > 0) {
            let formData = new FormData();
            let file = this.state.acceptedFiles[0];
            formData.append('file0', file);
            let docType = this.props.docType;
            let header = { docType: docType };
            this.setState({ Isloading: true });
            Api.postFile('UploadExcelFiles?docId=' + this.props.docId, formData, header).then(resp => {
                if (this.props.afterUpload != undefined) {
                    this.setState({ Isloading: false });
                    this.props.afterUpload();
                }
                setTimeout(() => {
                    this.setState({ _className: 'zeropercent' });
                }, 1000);
            })
                .catch(ex => {
                    toast.error(
                        Resources['operationCanceled'][currentLanguage],
                    );
                });
        }
    };

    CustomUpload = () => {
        if (this.state.acceptedFiles.length > 0) {
            this.setState({
                Isloading: true,
            });
            let formData = new FormData();
            let file = this.state.acceptedFiles[0];
            let fileName = file.name;
            let testName = [];
            testName.push(fileName);
            formData.append('file0', file);
            let docType = this.props.docType;
            let header = { docType: docType };
            let id = this.props.docId;
            let projectId = this.props.projectId;
            Api.postFile(
                'UploadSingleFile?scheduleId=' +
                id +
                '&projectId=' +
                projectId +
                '&fileName=' +
                testName +
                '&isEdit=true',
                formData,
                header,
            )
                .then(resp => {
                    if (this.props.afterUpload != undefined) {
                        this.props.afterUpload();
                    }
                    setTimeout(() => {
                        this.setState({ _className: 'zeropercent' });
                    }, 1000);
                    this.setState({
                        Isloading: false,
                    });
                })
                .catch(ex => {
                    toast.error(
                        Resources['operationCanceled'][currentLanguage],
                    );
                });
        }
    };

    handleChangeStatus = ({ meta, file }, status) => {
        console.log(status);
        if (status == 'rejected_file_type') {
            toast.warning(Resources['chooseExcelFormat'][currentLanguage]);
        } else if (status == 'removed' && this.state.uploaded) {
            toast.success(Resources['uploadedSuccessfully'][currentLanguage]);
        } else if (status == 'done') {
            this.setState({ fileStatus: status });
        }
    };

    handleSubmit = async (files, allFiles) => {
        this.props.documentTemplate
            ? await this.documentTemplateUpload(files)
            : this.props.CustomUpload
                ? await this.CustomUpload(files)
                : await this.upload(files);
        this.setState({ uploaded: true });
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
        return (
            <div className="doc-pre-cycle">
                <header>
                    <h2 className="zero">
                        {this.state.header
                            ? Resources[this.state.header][currentLanguage]
                            : ''}
                    </h2>
                </header>
                <div style={{ position: 'relative' }}>
                    <React.Fragment>
                        {this.props.CantDownload ? null : (
                            <div className="fileDownUp">
                                <a href={this.state.link}>
                                    <i
                                        className="fa fa-download"
                                        aria-hidden="true"></i>
                                    {
                                        Resources.downloadExcelFormatFile[
                                        currentLanguage
                                        ]
                                    }
                                </a>
                            </div>
                        )}

                        <Dropzone
                            multiple={false}
                            accept={this.props.CustomAccept ? '.xer' : '.xlsx'}
                            onDrop={e => this.onDrop(e)}
                            onDragLeave={e =>
                                this.setState({ _className: ' ' })
                            }
                            onDragOver={e =>
                                this.setState({ _className: 'dragHover' })
                            }
                            onDropAccepted={e => this.onDropAcceptedHandler(e)}
                            onDropRejected={this.onDropRejected}>
                            {({
                                getRootProps,
                                getInputProps,
                                isDragActive,
                            }) => {
                                return (
                                    <div
                                        {...getRootProps()}
                                        className={classNames('dropzone', {
                                            'dropzone--isActive': isDragActive,
                                        })}>
                                        <input {...getInputProps()} />
                                        {
                                            <div
                                                className={
                                                    'uploadForm ' +
                                                    this.state._className
                                                }>
                                                <div className="uploadFormDiv">
                                                    <img src={AttachUpload} />
                                                    <div className="dragUpload">
                                                        <p>
                                                            {
                                                                Resources
                                                                    .includeFiles[
                                                                currentLanguage
                                                                ]
                                                            }
                                                        </p>
                                                        <form>
                                                            <input
                                                                type="file"
                                                                name="file"
                                                                id="file"
                                                                className="inputfile"
                                                            />
                                                            <label>
                                                                {
                                                                    Resources
                                                                        .upload[
                                                                    currentLanguage
                                                                    ]
                                                                }
                                                            </label>
                                                        </form>
                                                    </div>
                                                </div>
                                                <div className="dragHoverDiv">
                                                    <div id="myBar"></div>
                                                    <img src={AttachDrag} />
                                                    <div className="dragUpload">
                                                        <p>
                                                            Drop your files
                                                            here!
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="progressBar">
                                                    <div className="completeProgress"></div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                );
                            }}
                        </Dropzone>
                        <div className="removeBtn">
                            <div className="fileNameUploaded">
                                {this.state.acceptedFiles.length > 0 ? (
                                    <p>
                                        {Resources.fileName[currentLanguage]}
                                        {this.state.acceptedFiles.length > 0 ? (
                                            <span>
                                                {
                                                    this.state.acceptedFiles[0]
                                                        .name
                                                }
                                            </span>
                                        ) : null}
                                    </p>
                                ) : null}
                            </div>
                            {this.state.Isloading ? (
                                <button
                                    className="primaryBtn-1 btn smallBtn disabled"
                                    disabled="disabled">
                                    <div className="spinner">
                                        <div className="bounce1" />
                                        <div className="bounce2" />
                                        <div className="bounce3" />
                                    </div>
                                </button>
                            ) : (
                                    <button
                                        className={
                                            'primaryBtn-1 btn smallBtn ' +
                                            (this.props.disabled ? 'disabled' : '')
                                        }
                                        disabled={
                                            this.props.disabled ? 'disabled' : ''
                                        }
                                        onClick={
                                            this.props.documentTemplate
                                                ? this.documentTemplateUpload
                                                : this.props.CustomUpload
                                                    ? this.CustomUpload
                                                    : this.upload
                                        }>
                                        {Resources['upload'][currentLanguage]}
                                    </button>
                                )}
                        </div>
                    </React.Fragment>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        file: state.communication.file,
        files: state.communication.files,
        isLoadingFiles: state.communication.isLoadingFiles,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(XSLfile);

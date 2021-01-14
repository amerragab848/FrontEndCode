import React, { Component, createRef } from 'react';
import Dropzone from 'react-dropzone-uploader';
import { getDroppedOrSelectedFiles } from 'html5-file-selector';
import Resources from '../../resources.json';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Api from '../../api';

import * as communicationActions from '../../store/actions/communication';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let projectId=localStorage.getItem('lastSelectedProject') == null ? null : localStorage.getItem('lastSelectedProject');

class UploadBoqAttachment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            docType: this.props.docType,
            docId: this.props.docId,
            link: this.props.link,
            parentId: '',
            _className: '',
            header: this.props.header,
            filesExist: false,
            Isloading: false,
            uploaded: false,
        };
    }

    uploadBtnRef = createRef();

    documentTemplateUpload = (files, allFiles) => {
        if (files.length > 0) {
            let formData = new FormData();
            let file = files[0].file;
            formData.append('file0', file);
            let docType = this.props.docType;
            let header = { docType: docType };
            this.setState({ Isloading: true });
            Api.postFile('UploadExcelFilesTemplate?projectId=' + this.props.projectId + '&fromCompanyId=' + this.props.companyId + '&fromContactId=' + this.props.contactId + '&toCompanyId=' + this.props.toCompanyId + '&toContactId=' + this.props.toContactId, formData, header)
                .then(resp => {
                    if (this.props.afterUpload != undefined) {
                        this.setState({ uploaded: true, filesExist: false, Isloading: true });
                        allFiles.forEach(f => f.remove());
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

    PcoItemsTemplateUpload = (files, allFiles) => {
        if (files.length > 0) {
            this.setState({
                Isloading: true,
            });
            let formData = new FormData();
            let file = files[0].file;
            let fileName = file.name;
            let testName = [];
            testName.push(fileName);
            formData.append('file0', file);
            let docType = this.props.docType;
            let header = { docType: docType };
            Api.postFile('AddMultiplePcoItemsFromExcel?docId=' + this.props.docId + '&action=' + this.props.action, formData, header).then(resp => {
                if (this.props.afterUpload != undefined) {
                    this.setState({ uploaded: true, filesExist: false, Isloading: true });
                    allFiles.forEach(f => f.remove());
                    this.props.afterUpload();
                    toast.success(Resources['operationSuccess'][currentLanguage]);
                }
                setTimeout(() => {
                    this.setState({ _className: 'zeropercent' });
                }, 1000);
                this.setState({
                    Isloading: false,
                });
            }).catch(ex => {
                toast.error(
                    Resources['operationCanceled'][currentLanguage]);
            });
        }
    };

    CustomUpload = (files, allFiles) => {
        if (files.length > 0) {
            this.setState({
                Isloading: true,
            });
            let formData = new FormData();
            let file = files[0].file;
            let fileName = file.name;
            let testName = [];
            testName.push(fileName);
            formData.append('file0', file);
            let docType = this.props.docType;
            let header = { docType: docType };
            let id = this.props.docId;
            let projectId = this.props.projectId;
            Api.postFile('UploadSingleFile?scheduleId=' + id + '&projectId=' + projectId + '&fileName=' + testName + '&isEdit=true', formData, header).then(resp => {
                if (this.props.afterUpload != undefined) {
                    this.setState({ uploaded: true, filesExist: false, Isloading: true });
                    allFiles.forEach(f => f.remove());
                    this.setState({ Isloading: false });
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

    submittalItemsTemplateUpload = (files, allFiles) => {
        if (files.length > 0) {
            this.setState({
                Isloading: true,
            });
            let formData = new FormData();
            let file = files[0].file;
            let fileName = file.name;
            let testName = [];
            testName.push(fileName);
            formData.append('file0', file);
            let docType = this.props.docType;
            let header = { docType: docType };
            let submittalId = this.props.submittalId;
            let projectId = this.props.projectId;
            let reviewResultId = this.props.reviewResultId;
            Api.postFile('UploadSubmittalItems?projectId=' +projectId +'&submittalId=' +submittalId +"&reviewResultId=" +reviewResultId,formData,header).then(resp => {
                    if (this.props.afterUpload != undefined) {
                        this.setState({ uploaded: true, filesExist: false, Isloading: true });
                        allFiles.forEach(f => f.remove());
                        this.setState({ Isloading: false });
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

    drawinListItemsTemplateUpload=(files, allFiles)=>{
        if (files.length > 0) {
            this.setState({
                Isloading: true,
            });
            let formData = new FormData();
            let file = files[0].file;
            let fileName = file.name;
            let testName = [];
            let header="";
            testName.push(fileName);
            formData.append('file0', file);
            let docId = this.props.docId;
            let disciplineId = this.props.disciplineId;
            Api.postFile('UploadDrawingListItems?docId=' +docId +"&disciplineId=" +disciplineId,formData,header).then(resp => {
                    if (this.props.afterUpload != undefined) {
                        this.setState({ uploaded: true, filesExist: false, Isloading: true });
                        allFiles.forEach(f => f.remove());
                        this.setState({ Isloading: false });
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

    updateMaterialInventoryQuantityHandler = (files, allFiles) => {
        if(projectId !=null){
        if (files.length > 0) {
            this.setState({
                Isloading: true,
            });
            let formData = new FormData();
            let file = files[0].file;
            let fileName = file.name;
            let testName = [];
            testName.push(fileName);
            formData.append('file0', file);
            let docType = this.props.docType;
            let header = { docType: docType };
            Api.postFile('UpdateInventoryQuantitiesAndPricesFromExcel?projectId=' +projectId,formData,header).then(resp => {
                    if (this.props.afterUpload != undefined) {
                        this.setState({ uploaded: true, filesExist: false, Isloading: true });
                        allFiles.forEach(f => f.remove());
                        this.setState({ Isloading: false });
                        this.props.afterUpload();
                        toast.success(Resources['operationSuccess'][currentLanguage]);
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
    }else{
        toast.error("Please Select Project")
    }
    };

    handleSubmit = (files, allFiles) => {
        if (files.length > 0) {
            let formData = new FormData();
            let file = files[0].file;
            formData.append('file0', file);
            let docType = this.props.docType;
            let header = { docType: docType };
            formData.append('disciplineId', this.props.disciplineId);
            formData.append('specsSectionId', this.props.specsSectionId);
            this.setState({ Isloading: true });
            Api.postFile('UploadExcelFiles?docId=' + this.props.projectId, formData, header).then(resp => {
                if (this.props.afterUpload != undefined) {
                    this.setState({ uploaded: true, filesExist: false, Isloading: true });
                    allFiles.forEach(f => f.remove());
                    this.setState({ Isloading: false });
                    this.props.afterUpload();
                    //toast.success(Resources['operationSuccess'][currentLanguage]);
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

    handleChangeStatus = ({ meta, file }, status, allFiles) => {
        if (status == 'rejected_file_type') {
            toast.warning(Resources['chooseExcelFormat'][currentLanguage]);
        } else if (status == 'removed' && this.state.uploaded) {
            toast.success(Resources['uploadedSuccessfully'][currentLanguage]);
        } else if (allFiles.length && status == 'done') {
            this.setState({ fileStatus: status, filesExist: true });
        }
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
                        {(this.props.CantDownload || this.props.link =="")? null : (
                            <div className="fileDownUp">
                                <a href={this.props.link}>
                                    <i className="fa fa-download" aria-hidden="true"></i>
                                    {Resources.downloadExcelFormatFile[currentLanguage]}
                                </a>
                            </div>
                        )}
                        <div className="singleUpload dropZoneUploader">
                            <Dropzone
                                accept={this.props.CustomAccept ? '.xer' : '.xlsx'}
                                maxFiles={1}
                                multiple={false}
                                autoUpload={false}
                                getUploadParams={null}
                                onChangeStatus={this.handleChangeStatus}
                                InputComponent={this.InputChooseFile}
                                submitButtonContent={this.UploadFiles}
                                getFilesFromEvent={this.getFilesFromEvent}
                                classNames
                                onSubmit={
                                    this.props.documentTemplate
                                        ? this.documentTemplateUpload
                                        : this.props.CustomUpload
                                            ? this.CustomUpload
                                            : this.props.submittalItemdocumentTemplate
                                                ? this.submittalItemsTemplateUpload
                                                : this.props.drawinListItemdocumentTemplate ?
                                                    this.drawinListItemsTemplateUpload
                                                    : this.props.uploadPcoItems ?
                                                        this.PcoItemsTemplateUpload
                                                        : this.props.updateMaterialInventoryQuantity ?
                                                            this.updateMaterialInventoryQuantityHandler
                                                            : this.handleSubmit
                                }
                            />

                            <div className="drives__upload">
                                <label
                                    className={this.props.disabled ? 'btn__upload--left primaryBtn-1 btn disabled' : 'btn__upload--left primaryBtn-1 btn'}
                                    style={{
                                        pointerEvents: this.state.filesExist
                                            ? 'auto'
                                            : 'none',
                                    }}
                                    disabled={
                                        this.props.disabled ? 'disabled' : ''
                                    }
                                    onClick={() =>
                                        this.uploadBtnRef.current.click()
                                    }>
                                    Upload
                                </label>
                            </div>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UploadBoqAttachment);

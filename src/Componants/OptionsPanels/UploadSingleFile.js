import React, { Component } from 'react';
import Dropzone from 'react-dropzone-uploader';
import { getDroppedOrSelectedFiles } from 'html5-file-selector';
import Config from '../../Services/Config';

class UploadSingleFile extends Component {

    handleSubmit = (files, allFiles) => {
        allFiles.forEach(f => f.remove());
    };

    getFilesFromEvent = e => {
        return new Promise(resolve => {
            getDroppedOrSelectedFiles(e).then(chosenFiles => {
                let files = chosenFiles.length > 0 ? chosenFiles.map(item => item.fileObject) : [];
                this.props.onDrop(files);
                resolve(chosenFiles.map(f => f.fileObject));
            });
        });
    };

    InputChooseFile = ({ accept, onFiles, files, getFilesFromEvent }) => {

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

    render() {
        return Config.IsAllow(this.props.AddAttachments) ||
            Config.IsAllow(this.props.EditAttachments) ? (
                <div>
                    <Dropzone
                        accept={this.props.accept ? this.props.accept : "image/*"}
                        autoUpload={false}
                        getUploadParams={null}
                        InputComponent={this.InputChooseFile}
                        onSubmit={this.handleSubmit}
                        maxFiles={1}
                        getFilesFromEvent={this.getFilesFromEvent}
                        classNames
                    />
                </div>
            ) : null;
    }
}


export default UploadSingleFile;

import React, { Component } from 'react'
import Dropzone from 'react-dropzone';
import classNames from 'classnames'
import AttachUpload from '../../Styles/images/attacthUpload.png';
import AttachDrag from '../../Styles/images/attachDraggable.png';
import 'react-table/react-table.css'
import Api from '../../api';

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
            parentId:'',
            _className: ''
        }
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
            
            formData.append("file",element)
           
            let header={'docTypeId':this.props.docTypeId,'docId':this.props.docId,'parentId':this.state.parentId}
            
            //Api.postFile("BlobUpload",formData,header)  
            //let url = "GetAzureFiles?docTypeId=" + this.props.docTypeId + "&docId=" + this.props.docId

            this.props.actions.uploadFile("BlobUpload",formData,header);
        }); 
        setTimeout(() => {
            this.setState({ _className: "zeropercent" })
        }, 1000) 
    }


    render() {
        return (
            <div>
                <Dropzone   onDrop={e => this.onDrop(e)}
                            onDragLeave={e => this.setState({ _className: " " })}
                            onDragOver={e => this.setState({ _className: "dragHover" })} onDropAccepted={e=>this.onDropAcceptedHandler(e)}
                            onDropRejected={this.onDropRejected} >
                    {({ getRootProps, getInputProps, isDragActive }) => {
                        return (
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
                        )
                    }}
                </Dropzone>

            </div>
        )
    }
}


function mapStateToProps(state) {
    console.log(state);
    
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
 
import React, { Component, Fragment } from 'react'
import Dropzone from 'react-dropzone';
import classNames from 'classnames'
import AttachUpload from '../../Styles/images/attacthUpload.png';
import AttachDrag from '../../Styles/images/attachDraggable.png';
import 'react-table/react-table.css'
import Resources from '../../../src/resources'
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class XSLfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docType: this.props.docType,
            docId: this.props.docId,
            link:this.props.link,
            parentId: '',
            _className: ''
        }
    }
    onDrop = (acceptedFiles, rejectedFiles) => {
        this.setState({ _className: " dragHover dropHover fullProgressBar" })
    }

    onDropRejected = (rejectedFiles) => {
        toast.warning(Resources['chooseExcelFormat'][currentLanguage])
        setTimeout(() => {
            this.setState({ _className: "hundredPercent" })
        }, 1000)
    }

    onDropAcceptedHandler = (acceptedFiles) => {
        alert(acceptedFiles.length)
        setTimeout(() => {
            this.setState({ _className: "hundredPercent" })
        }, 500)

        let formData = new FormData();
        formData.append("file0", acceptedFiles[0])
        let header = { 'docType': this.props.docType }
        this.props.actions.uploadFile("UploadExcelFiles?docId=" + this.state.docId, formData, header);

        setTimeout(() => {
            this.setState({ _className: "zeropercent" })
        }, 1000)
    }

    render() {
        return (
            <div >
                <div className="fileNameUp">
                    <a href={this.state.link} >moutasem</a>
                </div>
                <Dropzone
                    multiple={false}
                    accept='.xlsx'
                    onDrop={e => this.onDrop(e)}
                    onDragLeave={e => this.setState({ _className: " " })}
                    onDragOver={e => this.setState({ _className: "dragHover" })}
                    onDropAccepted={e => this.onDropAcceptedHandler(e)}
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
                                                <p>{Resources.includeFiles[currentLanguage]}</p>
                                                <form>
                                                    <input type="file" name="file" id="file" className="inputfile" />
                                                    <label >{Resources.upload[currentLanguage]}</label>
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



export default XSLfile

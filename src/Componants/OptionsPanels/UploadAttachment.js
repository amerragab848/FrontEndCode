import React, { Component } from 'react'
import Dropzone from 'react-dropzone';
import classNames from 'classnames'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import { blue500, red500, greenA200 } from 'material-ui/styles/colors';
class UploadAttachment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filesPreview: [],
            filesToBeSent: [],
            printcount: 10,
        }
    }
    onDrop = (acceptedFiles, rejectedFiles) => {
         console.log('sabo');
        var filesToBeSent = this.state.filesToBeSent;
        if (filesToBeSent.length < this.state.printcount) {
            filesToBeSent.push(acceptedFiles);
            var filesPreview = [];
            for (var i in filesToBeSent) {
                filesPreview.push(<div>
                    {filesToBeSent[i][0].name}
                    <MuiThemeProvider>
                        <a href="#"><FontIcon
                            className="material-icons customstyle"
                            color={blue500}
                            styles={{ top: 10, }}
                        >clear</FontIcon></a>
                    </MuiThemeProvider>
                </div>
                )
            }
            this.setState({ filesToBeSent, filesPreview });
        }
        else {
            alert("You have reached the limit of printing files at a time")
        }
        setTimeout(() => {
            console.log(this.state.filesToBeSent)

        }, 500)
    }

    render() {
        return (
            <div>
                <Dropzone onDrop={this.onDrop} onDragEnter={e=>console.log("enter")}  onDragLeave={e=>console.log("onDragLeave")}
                 onDragOver={e=>console.log("onDragOver")}  onDragStart={e=>console.log("onDragStart")}> 
                    {({ getRootProps, getInputProps, isDragActive }) => {
                        return (
                            <div
                                {...getRootProps()}
                                className={classNames('dropzone', { 'dropzone--isActive': isDragActive })}
                            >
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p>Drop files here...</p> :
                                        <p>Try dropping some files here, or click to select files to upload.</p>
                                }
                            </div>
                        )
                    }}
                </Dropzone>
                <div>
                    Files to be printed are:
              {this.state.filesPreview}
                </div>
            </div>
        )
    }
}

export default UploadAttachment;
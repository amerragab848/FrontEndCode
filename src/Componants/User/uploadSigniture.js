import React from 'react';
import Dropzone from 'react-dropzone';
import 'react-table/react-table.css';
import api from '../../api'


const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 150,
    height: 150,
    padding: 1,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
}

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};
export default class uploadSignture extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: {},
            preview: {},
            showRemoveBtn: false, name: ''
        };
    }

    onDrop(file) {
        this.setState({
            file: file,
            preview: URL.createObjectURL(file[0]),
            showRemoveBtn: true,
            name: file[0].name
        });

    }
    RemoveHandler = () => {
        this.setState({
            file: {}, name: ''
        })
    }
    componentWillUnmount() {
        URL.revokeObjectURL(this.state.preview)
    }

    upload = () => {
        let formData = new FormData();  
        formData.append("file",this.state.file)

        api.postFile('UploadSignature',formData )
    }


    render() {
        return (
            <div>
                <section className="singleUploadForm">
                    {this.state.showRemoveBtn ?
                        <aside className='thumbsContainer'>
                            <div className="uploadedName ">
                                <p>{this.state.name}</p>
                            </div>
                            <div style={thumb} key={this.state.name}>
                                <div style={thumbInner}>
                                    <img
                                        src={this.state.preview}
                                        className={img}
                                    />
                                </div>
                            </div>
                        </aside> : null}
                    <Dropzone
                        accept="image/*"
                        onDrop={this.onDrop.bind(this)}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div className="singleDragText" {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>Drag and drop photos here to share your food shots! or</p>
                                <button className="primaryBtn-1 btn smallBtn">Choose file</button>
                            </div>
                        )}
                    </Dropzone>
                    {this.state.showRemoveBtn ?
                        <div className="removeBtn">
                            <button className="primaryBtn-2 btn smallBtn" onClick={this.RemoveHandler}>Remove</button>
                        </div> : null}


                </section>
                <div className="removeBtn">
                    <button className="primaryBtn-1 btn smallBtn" onClick={this.upload}>UploadSigntur</button>
                </div>
            </div>
        );
    }
}
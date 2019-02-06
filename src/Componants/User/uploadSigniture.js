import React from 'react';
import Dropzone from 'react-dropzone';
import 'react-table/react-table.css';
import api from '../../api'
import config from "../../Services/Config";

const profilePath = '/downloads/users/sign_s_' + config.getPayload().aci + '.jpg';

export default class uploadSignture extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: {},
            preview: {},
            showRemoveBtn: false, name: '',
            newIamge: config.getPublicConfiguartion().downloads + profilePath
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
            file: {}, name: '', preview: {}
        })
    }
    componentWillUnmount() {
        URL.revokeObjectURL(this.state.preview)
    }

    upload = () => {
        let formData = new FormData();
        formData.append("file", this.state.file)

        api.postFile('UploadSignature', formData).then(res => {
            console.log(config.getPublicConfiguartion().download + profilePath)
            this.setState({ newIamge: config.getPublicConfiguartion().downloads + profilePath })
        }).catch(ex => {
            alert(ex);

            this.setState({ newIamge: config.getPublicConfiguartion().downloads + profilePath })
        });

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
                            {this.state.name ?
                                <div className="thumbStyle" key={this.state.name}>
                                    <div className="thumbInnerStyle">
                                        <img
                                            src={this.state.preview}
                                            className="imgStyle"
                                        />
                                    </div>
                                </div>
                                : null}

                        </aside> : null}
                    <Dropzone
                        accept="image/*"
                        onDrop={this.onDrop.bind(this)}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div className="singleDragText" {...getRootProps()}>
                                <input {...getInputProps()} />

                                {this.state.name ?
                                    null : <p>Drag and drop photos here to share your food shots! or</p>}
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

                <div className="a7medImg">
                    {this.state.newIamge ? <img
                        src={this.state.newIamge}
                    />
                        :
                        null}

                </div>
            </div>

        );
    }
}
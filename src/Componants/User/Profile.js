import React from 'react';
import Dropzone from 'react-dropzone';
import 'react-table/react-table.css';
import api from '../../api'
import config from "../../Services/Config";

const signiturePath = '/downloads/users/sign_s_' + config.getPayload().aci + '.jpg';
const profilePath = '/downloads/contacts/photo/img_s_'+config.getPayload().aci+'.gif';

export default class uploadSignture extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sign: {},
            signPreview: {},
            signShowRemoveBtn: false, signName: '',
            signIamge: config.getPublicConfiguartion().downloads + signiturePath,
            profile: {},
            profilePreview: {},
            profileShowRemoveBtn: false, profileName: '',
            profileIamge: config.getPublicConfiguartion().downloads + profilePath
        };
    }
//signture Methods
    onDropSign(file) {
        this.setState({
            sign: file,
            signPreview: URL.createObjectURL(file[0]),
            signShowRemoveBtn: true,
            signName: file[0].name
        });
    }
    RemoveHandlerSign = () => {
        this.setState({
            sign: {}, signName: '', signPreview: {}
        })
    }
    componentWillUnmount() {
        URL.revokeObjectURL(this.state.signPreview)
        URL.revokeObjectURL(this.state.profilePreview)
    }

    uploadSign = () => {
        let formData = new FormData();
        formData.append("file", this.state.sign)

        api.postFile('UploadSignature', formData).then(res => {
            this.setState({ signIamge: config.getPublicConfiguartion().downloads + signiturePath })
        }).catch(ex => {
            alert(ex);
        });

    }


    onDropPP(file) {
        this.setState({
            profile: file,
            profilePreview: URL.createObjectURL(file[0]),
            profileShowRemoveBtn: true,
            profileName: file[0].name
        });
    }
    RemoveHandlerPP = () => {
        this.setState({
            profile: {}, profileName: '', profilePreview: {}
        })
    }
    

    uploadPP = () => {
        let formData = new FormData();
        formData.append("file", this.state.profile)

        api.postFile('UploadSignature', formData).then(res => {
            this.setState({ profileIamge: config.getPublicConfiguartion().downloads + profilePath })
        }).catch(ex => {
            alert(ex);
        });

    }

    render() {
        return (
            ///signture section
            <div>
            <div>
                <section className="singleUploadForm">
                    {this.state.signShowRemoveBtn ?
                        <aside className='thumbsContainer'>
                            <div className="uploadedName ">
                                <p>{this.state.signName}</p>
                            </div>
                            {this.state.signName ?
                                <div className="thumbStyle" key={this.state.signName}>
                                    <div className="thumbInnerStyle">
                                        <img
                                            src={this.state.signPreview}
                                            className="imgStyle"
                                        />
                                    </div>
                                </div>
                                : null}

                        </aside> : null}
                    <Dropzone
                        accept="image/*"
                        onDrop={this.onDropSign.bind(this)}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div className="singleDragText" {...getRootProps()}>
                                <input {...getInputProps()} />

                                {this.state.signName ?
                                    null : <p>Drag and drop photos here to share your food shots! or</p>}
                                <button className="primaryBtn-1 btn smallBtn">Choose file</button>
                            </div>
                        )}
                    </Dropzone>
                    {this.state.signShowRemoveBtn ?
                        <div className="removeBtn">
                            <button className="primaryBtn-2 btn smallBtn" onClick={this.RemoveHandlerSign}>Remove</button>
                        </div> : null}


                </section>

                <div className="removeBtn">
                    <button className="primaryBtn-1 btn smallBtn" onClick={this.uploadSign}>UploadSigntur</button>
                </div>

                <div className="a7medImg">
                    {this.state.signIamge ? <img
                        src={this.state.signIamge}
                    /> : null}
                </div>
            </div>
            <hr /><hr />
            <div>
                <section className="singleUploadForm">
                    {this.state.signShowRemoveBtn ?
                        <aside className='thumbsContainer'>
                            <div className="uploadedName ">
                                <p>{this.state.profileName}</p>
                            </div>
                            {this.state.profileName ?
                                <div className="thumbStyle" key={this.state.profileName}>
                                    <div className="thumbInnerStyle">
                                        <img
                                            src={this.state.profilePreview}
                                            className="imgStyle"
                                        />
                                    </div>
                                </div>
                                : null}

                        </aside> : null}
                    <Dropzone
                        accept="image/*"
                        onDrop={this.onDropPP.bind(this)}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div className="singleDragText" {...getRootProps()}>
                                <input {...getInputProps()} />

                                {this.state.profileName ?
                                    null : <p>Drag and drop photos here to share your food shots! or</p>}
                                <button className="primaryBtn-1 btn smallBtn">Choose file</button>
                            </div>
                        )}
                    </Dropzone>
                    {this.state.profileShowRemoveBtn ?
                        <div className="removeBtn">
                            <button className="primaryBtn-2 btn smallBtn" onClick={this.RemoveHandlerPP}>Remove</button>
                        </div> : null}


                </section>

                <div className="removeBtn">
                    <button className="primaryBtn-1 btn smallBtn" onClick={this.uploadPP}>UploadSigntur</button>
                </div>

                <div className="a7medImg">
                    {this.state.profileIamgeIamge ? <img
                        src={this.state.profileIamge}
                    /> : null}
                </div>
            </div>

            </div>
        );
    }
}
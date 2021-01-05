import React from 'react';
import Dropzone from 'react-dropzone'; 
import api from '../../api'
import config from "../../Services/Config";
import resources from '../../resources.json'
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const signiturePath = '/downloads/users/sign_s_' + config.getPayload().aci + '.jpg';
const profilePath = '/downloads/contacts/photo/img_s_' + config.getPayload().cni + '.gif';

export default class uploadSignture extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sign: {},
            signPreview: {},
            signShowRemoveBtn: false, signName: '',
            signIamge: signiturePath,
            profile: {},
            profilePreview: {},
            profileShowRemoveBtn: false, profileName: '',
            profileIamge: profilePath
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
        if (this.state.sign) {
            let formData = new FormData();
            formData.append("file", this.state.sign[0])
            api.postFile('UploadSignature', formData).then(res => {
                this.setState({ signIamge: signiturePath })
                toast.success(resources["operationSuccess"][currentLanguage]);
            }).catch(ex => {
                toast.error(resources["operationCanceled"][currentLanguage]);
            });
        }
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
        if (this.state.profile) {
            let formData = new FormData();
            formData.append("file", this.state.profile[0])
            api.postFile('UploadPhoto', formData).then(res => {
                this.setState({ profileIamge: profilePath })
                toast.success(resources["operationSuccess"][currentLanguage]);
            }).catch(ex => {
                toast.error(resources["operationCanceled"][currentLanguage]);
            });
        }
    }

    render() {
        return (
            <div className="mainContainer main__fulldash white-bg">
                <div className="main__fulldash--container">
                    <div >
                        <h4>{resources.uploadSignature[currentLanguage]}</h4>
                        <section className="singleUploadForm">
                            {this.state.signShowRemoveBtn ?
                                <aside className='thumbsContainer'>
                                    <div className="uploadedName ">
                                        <p>{this.state.signName}</p>
                                    </div>
                                    {this.state.signName ?
                                        <div className="thumbStyle" key={this.state.signName}>
                                            <div className="thumbInnerStyle">
                                                <img alt=''
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
                                            null : <p>{resources['dragFileHere'][currentLanguage]}</p>}
                                        <button className="primaryBtn-2 btn smallBtn">{resources['chooseFile'][currentLanguage]}</button>
                                    </div>
                                )}
                            </Dropzone>
                            {this.state.signShowRemoveBtn ?
                                <div className="removeBtn">
                                    <button className="primaryBtn-2 btn smallBtn" onClick={this.RemoveHandlerSign}>{resources['clear'][currentLanguage]}</button>
                                </div> : null}
                        </section>
                        <div className="removeBtn">
                            <button className="primaryBtn-1 btn smallBtn" onClick={this.uploadSign}>{resources['uploadSignature'][currentLanguage]}</button>
                        </div>

                        <div className="thumbUploadedImg">
                            {this.state.signIamge ? <img alt='' src={this.state.signIamge} /> : null}
                        </div>
                    </div>
                    <div>
                        <h4>{resources.uploadPhoto[currentLanguage]}</h4>
                        <section className="singleUploadForm">
                            {this.state.profileShowRemoveBtn ?
                                <aside className='thumbsContainer'>
                                    <div className="uploadedName ">
                                        <p>{this.state.profileName}</p>
                                    </div>
                                    {this.state.profileName ?
                                        <div className="thumbStyle" key={this.state.profileName}>
                                            <div className="thumbInnerStyle">
                                                <img alt='' src={this.state.profilePreview}
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
                                            null : <p>{resources['dragFileHere'][currentLanguage]}</p>}
                                        <button className="primaryBtn-2 btn smallBtn">{resources['chooseFile'][currentLanguage]}</button>
                                    </div>
                                )}
                            </Dropzone>
                            {this.state.profileShowRemoveBtn ?
                                <div className="removeBtn">
                                    <button className="primaryBtn-2 btn smallBtn" onClick={this.RemoveHandlerPP}>{resources['clear'][currentLanguage]}</button>
                                </div> : null}
                        </section>
                        <div className="removeBtn">
                            <button className="primaryBtn-1 btn smallBtn" onClick={this.uploadPP}>{resources['uploadPhoto'][currentLanguage]}</button>
                        </div>
                        <div className="thumbUploadedImg">
                            {this.state.profileIamge ? <img src={this.state.profileIamge} /> : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
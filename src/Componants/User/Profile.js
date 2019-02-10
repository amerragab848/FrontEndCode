import React, { Component } from "react";
import Dropzone from "react-dropzone";
import "react-table/react-table.css";
import api from "../../api";
import config from "../../Services/Config";
import resources from '../../resources.json';
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const signiturePath = '/downloads/users/sign_s_' + config.getPayload().aci + '.jpg';
const profilePath = '/downloads/contacts/photo/img_s_' + config.getPayload().aci + '.gif';

export default class profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLodingSign: false,
      isLodingProfile: false,
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
      signIamge: config.getPublicConfiguartion().downloads + signiturePath
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
      profile: {},
      profileName: "",
      profilePreview: {}
    });
  };

  uploadPP = () => {
    let formData = new FormData();
    formData.append("file", this.state.profile);

    api.postFile("UploadPhoto", formData).then(res => {
      this.setState({
        sign: {}, signName: '', signPreview: {}
      })
    })
  }
    componentWillUnmount() {
        URL.revokeObjectURL(this.state.signPreview)
        URL.revokeObjectURL(this.state.profilePreview)
      }

    uploadSign = () => {
        let formData = new FormData();
        formData.append("file", this.state.sign)
        this.setState({ isLodingSign: true })
        api.postFile('UploadSignature', formData).then(res => {
          this.setState({
            signIamge: config.getPublicConfiguartion().downloads + signiturePath, isLodingSign: false,
            sign: {}, signName: '', signPreview: ''
          })
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
        this.setState({ isLodingProfile: true })

        api.postFile('UploadPhoto', formData).then(res => {
          this.setState({
            profileIamge: config.getPublicConfiguartion().downloads + profilePath, isLodingProfile: false,
            profile: {}, profileName: '', profilePreview: ''
          })
        }).catch(ex => {
          alert(ex);
        });


      }

    render() {
        return(
            ///signture section
            <div>

      {
        this.state.isLodingSign ? <LoadingSection /> :
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
                      null : <p>{resources['dragFileHere'][currentLanguage]}</p>}
                    <button className="primaryBtn-1 btn smallBtn">{resources['chooseFile'][currentLanguage]}</button>
                  </div>
                )}
              </Dropzone>
              {this.state.signName ?
                <div className="removeBtn">
                  <button className="primaryBtn-2 btn smallBtn" onClick={this.RemoveHandlerSign}>{resources['clear'][currentLanguage]}</button>
                </div> : null}


            </section>
            <div className="a7medImg">
              {this.state.signIamge ? <img
                src={this.state.signIamge}
              /> : null}
            </div>
            <div className="fullWidthWrapper">
              <button className="primaryBtn-1 btn smallBtn" onClick={this.uploadSign}>{resources['uploadSignature'][currentLanguage]}</button>
            </div>


          </div>
      }




                {
        this.state.isLodingProfile ? <LoadingSection /> :

          <div>
            <section className="singleUploadForm">
              {this.state.profileShowRemoveBtn ?
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
                      null : <p>{resources['dragFileHere'][currentLanguage]}</p>}
                    <button className="primaryBtn-1 btn smallBtn">{resources['chooseFile'][currentLanguage]}</button>
                  </div>
                )}
              </Dropzone>
              {this.state.profileName ?
                <div className="removeBtn">
                  <button className="primaryBtn-2 btn smallBtn" onClick={this.RemoveHandlerPP}>{this.RemoveHandlerSign}{resources['clear'][currentLanguage]}</button>
                </div> : null}

            </section>
            <div className="a7medImg">
              {this.state.profileIamge ? <img
                src={this.state.profileIamge}
              /> : null}
            </div>
            <div className="fullWidthWrapper">
              <button className="primaryBtn-1 btn smallBtn" onClick={this.uploadPP}>{resources['uploadPhoto'][currentLanguage]}</button>
            </div>




          </div>
      }

            </div >
        );
  }
}

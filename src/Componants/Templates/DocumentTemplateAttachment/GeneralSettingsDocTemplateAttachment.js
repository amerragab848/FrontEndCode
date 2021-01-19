import React, { Component, Fragment } from 'react';
import DataService from "../../../Dataservice";
import { withRouter } from 'react-router-dom';
import config from "../../../Services/Config.js";
import { SkyLightStateless } from 'react-skylight';
import {Resources} from "../../../Resources";
import UploadSingleAttachment from "../../OptionsPanels/UploadSingleAttachment";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class GeneralSettingsDocTemplateAttachment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docTemplateModal:true
        }
    }
    render() {
        return (
            <div className="largePopup largeModal ">
                <SkyLightStateless
                    onOverlayClicked={() =>
                        this.props.onClose()
                    }
                    title={Resources['DocTemplate'][currentLanguage]}
                    onCloseClicked={() =>
                        this.props.onClose()
                    }
                    isVisible={this.state.docTemplateModal}>
                    <div className="proForm datepickerContainer customLayout">
                        <UploadSingleAttachment
                            key="docTemplate"
                            link={this.props.docTempLink}
                            header="addManyItems"
                            uploadAccounts={true}
                            afterUpload={() => {
                                this.props.afterUpload()
                            }}
                        />
                    </div>
                </SkyLightStateless>
            </div>
        );
    }
}

export default withRouter(GeneralSettingsDocTemplateAttachment)
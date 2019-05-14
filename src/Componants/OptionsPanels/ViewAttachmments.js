import React, { Component } from 'react'
import pdf from '../../Styles/images/pdfAttache.png'
import xlsx from '../../Styles/images/attatcheXLS.png'
import doc from '../../Styles/images/attatcheDOC.png'
import png from '../../Styles/images/ex.png'
import jpeg from '../../Styles/images/ex.png'
import jpg from '../../Styles/images/ex.png'
import Recycle from '../../Styles/images/attacheRecycle.png'
import Download from '../../Styles/images/attacthDownloadPdf.png'
import Pending from '../../Styles/images/AttacthePending.png'
import Api from '../../api';
import Resources from '../../resources.json';
import Submittals from '../../../src/submittals.pdf'
import PDFViewer from 'mgr-pdf-viewer-react'
import { connect } from 'react-redux';
import SkyLight from 'react-skylight';
import {
    bindActionCreators
} from 'redux';
import moment from "moment";

import * as communicationActions from '../../store/actions/communication';
import Config from '../../Services/Config';
import _ from "lodash";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class ViewAttachmments extends Component {

    constructor(props) {
        super(props)

        this.state = {
            data: [],
            docTypeId: this.props.docTypeId,
            docId: this.props.docId
        }
    }

    deletehandler = (file) => {
        let urlDelete = 'DeleteAttachFileById?id=' + file.id
        this.props.actions.deleteFile(urlDelete, file);
    }

    versionHandler = (parentId, extension) => {
        if (extension == 'pdf') {
            let urlVersion = 'GetChildFiles?docTypeId=' + this.state.docTypeId + '&docId=' + this.state.docId + '&parentId=' + parentId
            Api.get(urlVersion).then(result => {
                if (result)
                    this.setState({ view: true })
                    this.simpleDialog.show()
            }).catch(ex => {
            });
        }
    }

    componentDidMount() {
        this.getData()
    }

    has_ar(str) {
        var x = /[\u0600-\u06FF]+/;
        return x.test(str);
    }

    getData() {
        let url = "GetAzureFiles?docTypeId=" + this.props.docTypeId + "&docId=" + this.props.docId
        console.log('viewFiles...' + this.props.files.length)
        if (this.props.files.length === 0) {//&& this.props.changeStatus === true)
            this.props.actions.GetUploadedFiles(url).then(file => {
                console.log('file', file)
            });
        }
    }
    render() {
        let tabel = this.props.isLoadingFiles == true ? this.props.files.map((item, Index) => {

            let ext = item['fileName'].split(".")[1] ? item['fileName'].split(".")[1].toLowerCase() : 'png';
            let extension = (ext == 'xlsx' ? xlsx : ext == 'pdf' ? pdf : ext == 'jpeg' ? jpeg : ext == 'png' ? png : ext == 'jpg' ? jpg : doc)
            let createdDate = moment(item['createdDate']).format('DD/MM/YYYY');
            if (item.fileName) {
                item.fileNameDisplay = item.fileName.replace(/%23/g, '#');
                item.fileNameDisplay = item.fileNameDisplay.replace(/%20/g, " ");
                item.fileNameDisplay = item.fileNameDisplay.replace(/%2C/g, ",");

                if (!this.has_ar(item.fileNameDisplay)) {
                    item.fileNameDisplay = decodeURI(item.fileNameDisplay);
                };
            } else {
                item.fileNameDisplay = "";
            }

            return (
                <tr key={Index}>
                    <td>
                        <div className="contentCell tableCell-1">
                            <span>
                                <img src={extension} alt={extension} width="100%" height="100%" />
                            </span>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-2">
                            <a href={item['attachFile']} className="pdfPopup various zero" data-toggle="tooltip" title={item['fileName']}>{item.fileNameDisplay}</a>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-3">
                            <p className="zero status">{createdDate}</p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-4">
                            <p className="zero">{item['uploadedBy']} </p>
                        </div>
                    </td>
                    <td className="tdHover">
                        <div className="attachmentAction">
                            {Config.IsAllow(this.props.deleteAttachments) ?
                                <a className="attachRecycle" onClick={() => this.deletehandler(item)} >
                                    <img src={Recycle} alt="del" width="100%" height="100%" />
                                </a> :
                                null
                            }

                            <a href={item['attachFile']} className="pdfPopup various zero attachPdf">
                                <img src={Download} alt="dLoad" width="100%" height="100%" />
                            </a>
                            <a className="attachPend" onClick={() => this.versionHandler(item['parentId'], ext)}>
                                <img src={Pending} alt="pend" width="100%" height="100%" />
                            </a>
                        </div>
                    </td>
                </tr>
            );
        }) : null

        return (
            <React.Fragment>
                <table className="attachmentTable">
                    <thead>
                        <tr>
                            <th>
                                <div className="headCell tableCell-1">
                                    <span> {Resources['actions'][currentLanguage]} </span>
                                </div>
                            </th>
                            <th>
                                <div className="headCell tableCell-2">
                                    <span>{Resources['fileName'][currentLanguage]} </span>
                                </div>
                            </th>
                            <th>
                                <div className="headCell tableCell-3">
                                    <span>{Resources['docDate'][currentLanguage]}
                                    </span>
                                </div>
                            </th>
                            <th>
                                <div className="headCell tableCell-4">
                                    <span>{Resources['uploadedBy'][currentLanguage]} </span>
                                </div>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tabel}
                    </tbody>
                </table>
                {this.state.view ?
                    <div className="largePopup largeModal " style={{ display: this.state.view ? 'block' : 'none' }}>
                        <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref}>
                            <div >
                                <PDFViewer document={{
                                    file: Submittals
                                    //url: 'https://newgizastorage.blob.core.windows.net/project-files/b9a8b348-45fd-4f86-ba94-7a9d90cee1c6.pdf'
                                }} />
                            </div>
                        </SkyLight>
                    </div>

                    : null}
            </React.Fragment>
        )
    }

}

function mapStateToProps(state, ownProps) {
    return {
        files: state.communication.files,
        isLoadingFiles: state.communication.isLoadingFiles,
        changeStatus: state.communication.changeStatus
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
)(ViewAttachmments)

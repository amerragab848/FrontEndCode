import React, { Component } from 'react'
import 'react-table/react-table.css'
import pdf from '../../Styles/images/pdfAttache.png'
import xlsx from '../../Styles/images/attatcheXLS.png'
import doc from '../../Styles/images/attatcheDOC.png'
import Recycle from '../../Styles/images/attacheRecycle.png'
import Download from '../../Styles/images/attacthDownloadPdf.png'
import Pending from '../../Styles/images/AttacthePending.png'
import Api from '../../api';
import Resources from '../../resources.json';
import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import moment from "moment";

import * as communicationActions from '../../store/actions/communication';
import Config from '../../Services/Config';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class ViewAttachmments extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            docTypeId: this.props.docTypeId,
            docId: this.props.docId,
        }
    }

    deletehandler = (file) => {
        let urlDelete = 'DeleteAttachFileById?id=' + file.id
        this.props.actions.deleteFile(urlDelete, file);
    }

    versionHandler = (parentId) => {
        let urlVersion = 'GetChildFiles?docTypeId=' + this.state.docTypeId + '&docId=' + this.state.docId + '&parentId=' + parentId
        Api.get(urlVersion).then(result => {

        }).catch(ex => {
        });
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        let url = "GetAzureFiles?docTypeId=" + this.props.docTypeId + "&docId=" + this.props.docId
        if (this.props.files.length === 0 && this.props.changeStatus === true) {//
            this.props.actions.GetUploadedFiles(url);
        }
    }
    render() {
        let tabel = this.props.isLoadingFiles == true ? this.props.files.map((item, Index) => {
            let extension = item['fileName'].split(".")[1] === 'xlsx' ? xlsx : (item['fileName'].split(".")[1] === 'pdf' ? pdf : doc)
            let createdDate = moment(item['createdDate']).format('DD/MM/YYYY');
            return (
                <tr key={Index}>
                    <td>
                        <div className="contentCell tableCell-1">
                            <span>
                                <img src={extension} alt="pdf" width="100%" height="100%" />
                            </span>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-2">
                            <a href={item['attachFile']} className="pdfPopup various zero" data-toggle="tooltip" title={item['fileName']}>{item['fileName']}</a>
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
                            <a className="attachPend" onClick={() => this.versionHandler(item['parentId'])}>
                                <img src={Pending} alt="pend" width="100%" height="100%" />
                            </a>
                        </div>
                    </td>
                </tr>
            );
        }) : null

        return (
            <table className="attachmentTable">
                <thead>
                    <tr>
                        <th>
                            <div className="headCell tableCell-1">
                                <span> {Resources['arrange'][currentLanguage]} </span>
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

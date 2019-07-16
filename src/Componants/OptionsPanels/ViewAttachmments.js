import React, { Component, Fragment } from "react";
import pdf from "../../Styles/images/pdfAttache.png";
import xlsx from "../../Styles/images/attatcheXLS.png";
import doc from "../../Styles/images/attatcheDOC.png";
import png from "../../Styles/images/ex.png";
import jpeg from "../../Styles/images/ex.png";
import jpg from "../../Styles/images/ex.png";
import Recycle from "../../Styles/images/attacheRecycle.png";
import Download from "../../Styles/images/attacthDownloadPdf.png";
import Pending from "../../Styles/images/AttacthePending.png";
import pdfPrint from "../../Styles/images/pdfPrint.png";
import pdfDelete from "../../Styles/images/pdfMDelete.png";
import pdfMenuAction from "../../Styles/images/pdfMenuAction.png";
import autocad from "../../Styles/images/autocad.png";
import pdfMaxi from "../../Styles/images/pdfMaxi.png";
import CryptoJS from "crypto-js";
import Api from "../../api";
//import IP_Configrations from "../../IP_Configrations.json";
import Resources from "../../resources.json";
import PDFViewer from "mgr-pdf-viewer-react";
import { connect } from "react-redux";
import SkyLight from "react-skylight";
import axios from "axios";
import { bindActionCreators } from "redux";
import moment from "moment";

import * as communicationActions from "../../store/actions/communication";
import Config from "../../Services/Config";
import _ from "lodash";

let currentLanguage =
    localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let activeURL = "";
class ViewAttachmments extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            docTypeId: this.props.docTypeId,
            docId: this.props.docId,
            activeURL: "",
            viewVersion: false,
            Versionfiles: []
        };
    }

    deletehandler = file => {
        let urlDelete = "DeleteAttachFileById?id=" + file.id;
        this.props.actions.deleteFile(urlDelete, file);
    };

    versionHandler = (parentId, extension) => {
        if (extension == "pdf") {
            let urlVersion =
                "GetChildFiles?docTypeId=" +
                this.state.docTypeId +
                "&docId=" +
                this.state.docId +
                "&parentId=" +
                parentId;
            Api.get(urlVersion).then(result => {
                if (result) {
                    this.setState({ viewVersion: true, Versionfiles: result });
                    this.simpleDialogVersion.show();
                }
            });
        }
    };

    previewPDF = (item, extension) => {
        if (extension == "pdf") {
            this.setState({
                //view: true,
                activeURL: item.attachFile
            });
            activeURL = item.attachFile;
            // this.simpleDialog.show()
            this.getPDFblob(item.attachFile);
        }
    };

    goEditPdf = (item, ext) => {
        var stamp = new Date().getTime();
        var data = JSON.stringify({
            refer: window.location.href.replace("#", "-hashfill-"),
            docTypeId: this.props.docTypeId,
            docId: this.props.docId,
            name:
                localStorage.getItem("contactName") !== null
                    ? localStorage.getItem("contactName")
                    : "Procoor User",
            photo: window.IP_CONFIG.static + "/public/img/signature.png",
            file: item.parentAttachFile,
            fileName: item.parentAttachFile.split("/")[4],
            fileId: item.id,
            stamp: stamp,
            editable: Config.IsAllow(4501),
            server: Config.getPublicConfiguartion().static + "/api/Procoor/"
        });

        window.open(
            window.IP_CONFIG.exportLocal +
            "/edit-pdf/?zoom=page-actual&q=" +
            this.b64EncodeUnicode(data) +
            "#/public/edit-pdf/" +
            stamp +
            item.parentAttachFile.split("/")[4]
        );
    };

    b64EncodeUnicode = str => {
        return btoa(
            encodeURIComponent(str).replace(
                /%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode("0x" + p1);
                }
            )
        );
    };

    viewAutoDeskModal = (obj, e) => {
        var encrypte = encodeURIComponent(obj.attachFile);
        let obj1 = {
            fileName: obj.fileName,
            encrypte: encrypte,
            docId: this.state.docId,
            docTypeId: this.state.docTypeId,
            id: obj.id,
            projectId: obj.projectId
        };
        let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj1));
        let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
        window.open("autoDeskViewer?id=" + encodedPaylod);
    };

    getPDFblob = fileLink => {
        //   Send filename (text string) to server and then retrieves file as a blob back.
        //   using blob as input, converts it to a fileURL that is a link that loads the pdf
        // let tagetServer = 'https://newgiza.azureedge.net/project-files-demov4';

        axios
            .get(fileLink, {
                method: "GET",
                responseType: "blob",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                mode: "no-cors",
                withCredentials: false
            })
            .then(response => {
                if (response) {
                    //Create a Blob from the PDF Stream
                    const blob = new Blob([response.data], {
                        type: "application/pdf"
                    });
                    //Build a URL from the file
                    const fileURL = URL.createObjectURL(blob);

                    this.setState({
                        activeURL: fileURL
                    });

                    activeURL = fileURL;
                    this.simpleDialog.show();
                }
            })
            .catch(error => {
                activeURL = "";
            });
    };

    componentDidMount() {
        this.getData();
    }

    has_ar(str) {
        var x = /[\u0600-\u06FF]+/;
        return x.test(str);
    }

    getData() {
        let url =
            "GetAzureFiles?docTypeId=" +
            this.props.docTypeId +
            "&docId=" +
            this.props.docId;
        if (this.props.files.length === 0) {
            //&& this.props.changeStatus === true)
            this.props.actions.GetUploadedFiles(url);
        }
    }

    render() {
        let tabelVersion = this.state.Versionfiles.map((item, Index) => {
            let ext = item["fileName"].split(".")[1]
                ? item["fileName"].split(".")[1].toLowerCase()
                : "png";
            let extension =
                ext == "xlsx"
                    ? xlsx
                    : ext == "pdf"
                        ? pdf
                        : ext == "jpeg"
                            ? jpeg
                            : ext == "png"
                                ? png
                                : ext == "jpg"
                                    ? jpg
                                    : doc;
            let createdDate = moment(item["createdDate"]).format("DD/MM/YYYY");
            if (item.isCloud !== true) {
                var containerIndex = item.attachFile.indexOf(
                    "/" + window.IP_CONFIG.BlobStorageContainerName
                );
                var filePath = item.attachFile.substr(containerIndex);
                item.attachFile = window.IP_CONFIG.cdn + filePath;
            }

            if (item.fileName) {
                item.fileNameDisplay = item.fileName.replace(/%23/g, "#");
                item.fileNameDisplay = item.fileNameDisplay.replace(
                    /%20/g,
                    " "
                );
                item.fileNameDisplay = item.fileNameDisplay.replace(
                    /%2C/g,
                    ","
                );

                if (!this.has_ar(item.fileNameDisplay)) {
                    item.fileNameDisplay = decodeURI(item.fileNameDisplay);
                }
            } else {
                item.fileNameDisplay = "";
            }

            return (
                <tr key={Index}>
                    <td>
                        <div className="contentCell tableCell-1">
                            <span>
                                <img
                                    src={extension}
                                    alt={extension}
                                    width="100%"
                                    height="100%"
                                    onClick={() => this.previewPDF(item, ext)}
                                />
                            </span>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-2">
                            <a
                                href={item["attachFile"]}
                                className="pdfPopup various zero"
                                data-toggle="tooltip"
                                title={item["fileName"]}>
                                {item.fileNameDisplay}
                            </a>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-3">
                            <p className="zero status">{createdDate}</p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-4">
                            <p className="zero">{item["uploadedBy"]} </p>
                        </div>
                    </td>
                    <td className="tdHover">
                        <div className="attachmentAction">
                            <a
                                href={item["attachFile"]}
                                download={item.fileNameDisplay}
                                className="pdfPopup various zero attachPdf">
                                <img
                                    src={Download}
                                    alt="dLoad"
                                    width="100%"
                                    height="100%"
                                />
                            </a>

                            {Config.IsAllow(4502) ? (
                                <a
                                    className="attachRecycle"
                                    onClick={() => this.deletehandler(item)}>
                                    <img
                                        src={Recycle}
                                        alt="del"
                                        width="100%"
                                        height="100%"
                                    />
                                </a>
                            ) : null}
                        </div>
                    </td>
                </tr>
            );
        });

        let ViewVersionDetails = () => {
            return (
                <Fragment>
                    <table className="attachmentTable">
                        <thead>
                            <tr>
                                <th>
                                    <div className="headCell tableCell-1">
                                        <span>
                                            {" "}
                                            {
                                                Resources["actions"][
                                                currentLanguage
                                                ]
                                            }{" "}
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-2">
                                        <span>
                                            {
                                                Resources["fileName"][
                                                currentLanguage
                                                ]
                                            }{" "}
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-3">
                                        <span>
                                            {
                                                Resources["docDate"][
                                                currentLanguage
                                                ]
                                            }
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-4">
                                        <span>
                                            {
                                                Resources["uploadedBy"][
                                                currentLanguage
                                                ]
                                            }{" "}
                                        </span>
                                    </div>
                                </th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>{tabelVersion}</tbody>
                    </table>
                </Fragment>
            );
        };

        let tabel =
            this.props.isLoadingFiles == true
                ? this.props.files.map((item, Index) => {
                    let ext = item["fileName"].split(".")[1]
                        ? item["fileName"].split(".")[1].toLowerCase()
                        : "png";
                    let extension =
                        ext == "xlsx"
                            ? xlsx
                            : ext == "pdf"
                                ? pdf
                                : ext == "jpeg"
                                    ? jpeg
                                    : ext == "png"
                                        ? png
                                        : ext == "jpg"
                                            ? jpg
                                            : doc;
                    let createdDate = moment(item["createdDate"]).format(
                        "DD/MM/YYYY"
                    );
                    if (item.isCloud !== true) {
                        var containerIndex = item.attachFile ? item.attachFile.indexOf("/" + window.IP_CONFIG.BlobStorageContainerName) : -1;
                        var filePath = item.attachFile ? item.attachFile.substr(containerIndex) : item.attachFile;
                        item.attachFile = window.IP_CONFIG.cdn + filePath;
                    }

                    if (item.fileName) {
                        item.fileNameDisplay = item.fileName.replace(
                            /%23/g,
                            "#"
                        );
                        item.fileNameDisplay = item.fileNameDisplay.replace(
                            /%20/g,
                            " "
                        );
                        item.fileNameDisplay = item.fileNameDisplay.replace(
                            /%2C/g,
                            ","
                        );

                        if (!this.has_ar(item.fileNameDisplay)) {
                            item.fileNameDisplay = decodeURI(
                                item.fileNameDisplay
                            );
                        }
                    } else {
                        item.fileNameDisplay = "";
                    }

                    return (
                        <tr key={Index}>
                            <td>
                                <div className="contentCell tableCell-1">
                                    <span>
                                        <img
                                            src={extension}
                                            alt={extension}
                                            width="100%"
                                            height="100%"
                                            onClick={() =>
                                                this.previewPDF(item, ext)
                                            }
                                        />
                                    </span>
                                </div>
                            </td>
                            <td>
                                <div className="contentCell tableCell-2">
                                    <a
                                        href={item["attachFile"]}
                                        className="pdfPopup various zero"
                                        data-toggle="tooltip"
                                        title={item["fileName"]}>
                                        {item.fileNameDisplay}
                                    </a>
                                </div>
                            </td>
                            <td>
                                <div className="contentCell tableCell-3">
                                    <p className="zero status">
                                        {createdDate}
                                    </p>
                                </div>
                            </td>
                            <td>
                                <div className="contentCell tableCell-4">
                                    <p className="zero">
                                        {item["uploadedBy"]}{" "}
                                    </p>
                                </div>
                            </td>
                            <td className="tdHover">
                                <div className="attachmentAction">
                                    {Config.IsAllow(
                                        this.props.deleteAttachments
                                    ) ? (
                                            <a
                                                className="attachRecycle"
                                                onClick={() =>
                                                    this.deletehandler(item)
                                                }>
                                                <img
                                                    src={Recycle}
                                                    alt="del"
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </a>
                                        ) : null}

                                    <a
                                        href={item["attachFile"]}
                                        download={item.fileNameDisplay}
                                        className="pdfPopup various zero attachPdf">
                                        <img
                                            src={Download}
                                            alt="dLoad"
                                            width="100%"
                                            height="100%"
                                        />
                                    </a>
                                    {Config.IsAllow(4501) ? (
                                        <a
                                            className="attachPend"
                                            onClick={() =>
                                                this.versionHandler(
                                                    item["parentId"],
                                                    ext
                                                )
                                            }>
                                            <img
                                                src={Pending}
                                                alt="pend"
                                                width="100%"
                                                height="100%"
                                            />
                                        </a>
                                    ) : null}

                                    {ext === "pdf" ? (
                                        <a
                                            className="rootIcon"
                                            onClick={() =>
                                                this.goEditPdf(item, ext)
                                            }>
                                            <i
                                                className=" fa fa-link"
                                                width="100%"
                                                height="100%"
                                            />
                                        </a>
                                    ) : null}

                                    {ext === "dwg" || ext === "rvt" ? (
                                        <a
                                            className="autocadIcon"
                                            onClick={e =>
                                                this.viewAutoDeskModal(
                                                    item,
                                                    e
                                                )
                                            }>
                                            <img
                                                src={autocad}
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "100%"
                                                }}
                                                alt="autoDesk"
                                            />
                                        </a>
                                    ) : null}
                                </div>
                            </td>
                        </tr>
                    );
                })
                : null;

        return (
            <React.Fragment>
                <table className="attachmentTable">
                    <thead>
                        <tr>
                            <th>
                                <div className="headCell tableCell-1">
                                    <span>
                                        {" "}
                                        {
                                            Resources["actions"][
                                            currentLanguage
                                            ]
                                        }{" "}
                                    </span>
                                </div>
                            </th>
                            <th>
                                <div className="headCell tableCell-2">
                                    <span>
                                        {Resources["fileName"][currentLanguage]}{" "}
                                    </span>
                                </div>
                            </th>
                            <th>
                                <div className="headCell tableCell-3">
                                    <span>
                                        {Resources["docDate"][currentLanguage]}
                                    </span>
                                </div>
                            </th>
                            <th>
                                <div className="headCell tableCell-4">
                                    <span>
                                        {
                                            Resources["uploadedBy"][
                                            currentLanguage
                                            ]
                                        }{" "}
                                    </span>
                                </div>
                            </th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>{tabel}</tbody>
                </table>

                {this.state.view ? (
                    <div
                        className="largePopup largeModal pdf__popup"
                        style={{ display: this.state.view ? "block" : "none" }}>
                        <SkyLight
                            hideOnOverlayClicked
                            ref={ref => (this.simpleDialog = ref)}>
                            <div id="pdf__size">
                                <div className="pdf__action">
                                    <div className="pdf__action--btns">
                                        <h2 className="zero">PDF Name</h2>
                                        <div className="pdf__action--items">
                                            <div className="pdf__maxi">
                                                <p className="zero">-</p>
                                                <span>
                                                    {" "}
                                                    <img
                                                        src={pdfMaxi}
                                                        alt="Print"
                                                    />
                                                </span>
                                                <p className="zero">+</p>
                                            </div>
                                            <div className="pdf__print">
                                                <span>
                                                    {" "}
                                                    <img
                                                        src={pdfPrint}
                                                        alt="Print"
                                                    />
                                                </span>
                                                <span>
                                                    {" "}
                                                    <img
                                                        src={pdfDelete}
                                                        alt="Print"
                                                    />
                                                </span>
                                                <span>
                                                    {" "}
                                                    <img
                                                        src={pdfMenuAction}
                                                        alt="Print"
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {activeURL === "" ? null : (
                                    <PDFViewer
                                        document={{
                                            url: activeURL
                                        }}
                                    />
                                )}
                            </div>
                        </SkyLight>
                    </div>
                ) : null}

                <div
                    className="largePopup largeModal "
                    style={{
                        display: this.state.viewVersion ? "block" : "none"
                    }}>
                    <SkyLight
                        hideOnOverlayClicked
                        ref={ref => (this.simpleDialogVersion = ref)}>
                        <div className="dropWrapper">
                            {ViewVersionDetails()}
                        </div>
                    </SkyLight>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        files: state.communication.files,
        isLoadingFiles: state.communication.isLoadingFiles,
        changeStatus: state.communication.changeStatus
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewAttachmments);

import React, { Component, Fragment } from "react";
import pdf from "../../Styles/images/pdfAttache.png";
import xlsx from "../../Styles/images/attatcheXLS.png";
import doc from "../../Styles/images/attatcheDOC.png";
import png from "../../Styles/images/ex.png";
import jpeg from "../../Styles/images/ex.png";
import jpg from "../../Styles/images/ex.png";
// import pdfPrint from "../../Styles/images/pdfPrint.png";
// import pdfDelete from "../../Styles/images/pdfMDelete.png";
// import pdfMenuAction from "../../Styles/images/pdfMenuAction.png";
// import pdfMaxi from "../../Styles/images/pdfMaxi.png";
import autocad from "../../Styles/images/autocad.png";
import CryptoJS from "crypto-js";
import Api from "../../api";
import Resources from "../../resources.json";
// import PDFViewer from "mgr-pdf-viewer-react";
import { connect } from "react-redux";
import SkyLight from "react-skylight";
import axios from "axios";
import { bindActionCreators } from "redux";
import moment from "moment";
import * as communicationActions from "../../store/actions/communication";
import Config from "../../Services/Config";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let activeURL = "";

class ViewExpensesAttachmments extends Component {

    constructor(props) {

        super(props);

        this.state = {
            data: [],
            docTypeId: this.props.docTypeId,
            docId: this.props.docId,
            activeURL: "",
            viewVersion: false,
            Versionfiles: [],
            viewImage: false,
            imagePath: ""
        };
    }

    deletehandler = file => {
        let urlDelete = "DeleteAttachFileById?id=" + file.id;
        this.props.actions.deleteFile(urlDelete, file);
    };

    versionHandler = (parentId, extension) => {
        if (extension == "pdf") {
            let urlVersion = "GetChildFiles?docTypeId=" + this.state.docTypeId + "&docId=" + this.state.docId + "&parentId=" + parentId;
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
            // this.setState({
            //     activeURL: item.parentAttachFile
            // });
            // this.getPDFblob(item.parentAttachFile);
        } else {

            this.setState({
                viewImage: true,
                imagePath: item.attachFile
            });

            this.simpleDialogImage.show();
        }
    };

    // getPDFblob = fileLink => {
    //     //   Send filename (text string) to server and then retrieves file as a blob back.
    //     //   using blob as input, converts it to a fileURL that is a link that loads the pdf
    //     // let tagetServer = 'https://newgiza.azureedge.net/project-files-demov4';

    //     axios.get(fileLink, {
    //         method: "GET",
    //         responseType: "blob",
    //         headers: {
    //             "Access-Control-Allow-Origin": "*",
    //             "Content-Type": "application/json"
    //         },
    //         mode: "no-cors",
    //         withCredentials: false
    //     }).then(response => {
    //         if (response) {
    //             //Create a Blob from the PDF Stream
    //             const blob = new Blob([response.data], {
    //                 type: "application/pdf"
    //             });
    //             //Build a URL from the file
    //             const fileURL = URL.createObjectURL(blob);
    //             this.setState({
    //                 activeURL: fileURL,
    //                 view: true
    //             });
    //             this.simpleDialog.show();
    //         }
    //     }).catch(error => {
    //         activeURL = "";
    //     });
    // };

    goEditPdf = (item, ext) => {
        var stamp = new Date().getTime();
        var data = JSON.stringify({
            refer: window.location.href.replace("#", "-hashfill-"),
            docTypeId: this.props.docTypeId,
            docId: this.props.docId,
            name: localStorage.getItem("contactName") !== null ? localStorage.getItem("contactName") : "Procoor User",
            photo: Config.getPublicConfiguartion().downloads + "/" + Config.getSignature(),
            file: item.parentAttachFile,
            fileName: item.parentAttachFile.split("/")[4],
            fileId: item.id,
            stamp: stamp,
            editable: Config.IsAllow(4501),
            server: Config.getPublicConfiguartion().static + "/api/Procoor/"
        });

        window.open(
            Config.getPublicConfiguartion().exportLocal + "/edit-pdf/?zoom=page-actual&q=" + this.b64EncodeUnicode(data) + "#/public/edit-pdf/" + stamp +
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

        let attachFile = obj.attachFile.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
        var encrypte = encodeURIComponent(attachFile);

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

    componentDidMount() {
        this.getData();
    }

    has_ar(str) {
        var x = /[\u0600-\u06FF]+/;
        return x.test(str);
    }

    getData() {
        let url = "GetAzureFiles?docTypeId=" + this.props.docTypeId + "&docId=" + this.props.docId;
        if (this.props.files.length === 0) {
            this.props.actions.GetUploadedFiles(url);
        }
    }

    render() {
        let tabelVersion = this.state.Versionfiles.map((item, Index) => {
            let ext = item["fileName"].split(".")[1] ? item["fileName"].split(".")[1].toLowerCase() : "png";
            let extension = ext == "xlsx" ? xlsx : ext == "pdf" ? pdf : ext == "jpeg" ? jpeg
                : ext == "png" ? png : ext == "jpg" ? jpg : doc;

            let createdDate = moment(item["createdDate"]).format("DD/MM/YYYY");
            if (item.isCloud !== true) {
                var containerIndex = item.attachFile.indexOf("/" + Config.getPublicConfiguartion().BlobStorageContainerName);
                var filePath = item.attachFile.substr(containerIndex);
                item.attachFile = Config.getPublicConfiguartion().cdn + filePath;
            }

            if (item.fileName) {
                item.fileNameDisplay = item.fileName.replace(/%23/g, "#");
                item.fileNameDisplay = item.fileNameDisplay.replace(/%20/g, " ");
                item.fileNameDisplay = item.fileNameDisplay.replace(/%2C/g, ",");

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
                                <img src={extension} alt={extension} width="100%" height="100%" onClick={() => this.previewPDF(item, ext)} />
                            </span>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-2">
                            <a href={item["attachFile"]} className="pdfPopup various zero" data-toggle="tooltip" title={item["fileName"]}>{item.fileNameDisplay}
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
                            <a href={item["attachFile"]} download={item.fileNameDisplay} className="pdfPopup various zero attachPdf" data-toggle="tooltip" title={Resources["download"][currentLanguage]}>
                                {/* <img src={Download} alt="dLoad" width="100%" height="100%" /> */}
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                                    <g fill="none" fillRule="evenodd" transform="translate(1)">
                                        <g fill="#A8B0BF" mask="url(#b)">
                                            <path id="a" d="M7.495 15H1.387c-.625 0-1.006-.347-1.062-.965-.018-.21-.031-.42-.045-.63L.04 9.714c-.015-.22-.032-.44-.038-.66-.018-.623.379-1.057 1-1.062 1.248-.01 2.496-.009 3.743.001.439.004.739.243.907.644.122.29.237.585.35.88.029.072.062.106.147.105.898-.003 1.797-.003 2.696 0 .091 0 .129-.036.158-.113.108-.282.22-.562.333-.843.181-.45.514-.677.998-.677h3.618c.555.001.966.313 1.035.828.035.264-.005.54-.021.809-.059.933-.12 1.865-.183 2.798-.04.594-.068 1.19-.134 1.781-.05.443-.445.77-.892.79-.078.005-.156.004-.234.004H7.495zM2.02 9.943l.2 3.094H12.78l.198-3.086h-2.037c-.005.011-.013.023-.018.035-.121.302-.241.604-.363.905-.19.465-.507.683-1.006.684-1.37.002-2.742.002-4.113 0-.498 0-.817-.222-1.003-.687-.105-.264-.213-.526-.312-.792-.04-.112-.093-.16-.223-.157-.574.01-1.147.004-1.72.004h-.164zM8.52 4.504c.092-.098.181-.2.276-.295.408-.41.917-.453 1.35-.119a.955.955 0 0 1 .172 1.337c-.138.176-.304.33-.462.489-.547.549-1.095 1.096-1.642 1.643a.99.99 0 0 1-1.436-.005c-.653-.657-1.31-1.31-1.963-1.966-.392-.393-.44-.925-.127-1.33a.954.954 0 0 1 1.367-.176c.121.096.226.213.339.32.031.03.065.058.13.116V4.32c0-1.119-.003-2.237.003-3.355.003-.422.214-.724.599-.89.617-.268 1.348.208 1.351.882.006 1.128.002 2.255.002 3.382v.144l.041.02z" />
                                        </g>
                                    </g>
                                </svg>
                            </a>

                            {Config.IsAllow(4502) && (this.props.isApproveMode === false) ? (
                                <a className="attachRecycle" onClick={() => this.deletehandler(item)} data-toggle="tooltip" title={Resources["delete"][currentLanguage]}>
                                    {/* <img src={Recycle} alt="del" width="100%" height="100%" /> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                                        <g fill="none" fillRule="evenodd" transform="translate(1)">
                                            <g fill="#A8B0BF" mask="url(#b)">
                                                <path id="a" d="M5.628 2.771h2.748v-.805H5.628v.805zm5.094 1.972H3.278l.711 8.292h6.022l.71-8.292zm-9.38.015C1.106 4.73.88 4.73.67 4.676c-.444-.115-.712-.56-.663-1.05.04-.42.422-.8.846-.837.14-.012.28-.01.42-.01h2.414V2.62 1.052c.002-.643.4-1.05 1.034-1.05C6.24 0 7.76-.002 9.28.001c.634 0 1.028.405 1.03 1.052.003.518.001 1.037.001 1.555v.17h.166c.837 0 1.674-.002 2.51.001.471.002.822.244.957.65.22.661-.226 1.28-.938 1.303-.112.003-.224 0-.347 0l-.086.967a8623.91 8623.91 0 0 0-.711 8.355c-.048.567-.442.943-1.004.944H3.15c-.575 0-.96-.368-1.01-.95l-.533-6.203c-.086-1-.169-2-.254-3-.002-.031-.008-.063-.01-.088zm6.065 3.795c0-.394.015-.789-.004-1.182-.028-.6.452-1.035.93-1.038.574-.005.994.402 1.002 1.012.012.82.01 1.64 0 2.46-.006.54-.378.93-.907.984-.451.045-.884-.28-.998-.755a1.21 1.21 0 0 1-.022-.272c-.002-.403-.001-.806-.001-1.21zm-2.741 0c0-.412-.004-.825.001-1.237.006-.472.32-.864.751-.954a.955.955 0 0 1 1.174.932c.015.847.012 1.695 0 2.543a.953.953 0 0 1-.75.925c-.455.095-.881-.105-1.079-.534a1.188 1.188 0 0 1-.093-.451c-.012-.408-.004-.816-.004-1.224z" />
                                            </g>
                                        </g>
                                    </svg>
                                </a>
                            ) : null}
                        </div>
                    </td>
                </tr >
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
                                            {Resources["actions"][currentLanguage]}
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-2">
                                        <span>
                                            {Resources["fileName"][currentLanguage]}
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
                                            {Resources["uploadedBy"][currentLanguage]}
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

        let tabel = this.props.isLoadingFiles == true ? this.props.files.map((item, Index) => {
            let ext = item["fileName"] ? item["fileName"].split(".")[1] ? item["fileName"].split(".")[1].toLowerCase() : "png" : "";
            let extension = ext == "xlsx" ? xlsx : ext == "pdf" ? pdf : ext == "jpeg" ? jpeg : ext == "png" ? png : ext == "jpg" ? jpg : doc;
            let createdDate = moment(item["createdDate"]).format("DD/MM/YYYY");
            if (item.isCloud !== true) {
                var containerIndex = item.attachFile ? item.attachFile.indexOf("/" + Config.getPublicConfiguartion().BlobStorageContainerName) : -1;
                var filePath = item.attachFile ? item.attachFile.substr(containerIndex) : item.attachFile;
                item.attachFile = Config.getPublicConfiguartion().cdn + filePath;
            }

            if (item.fileName) {
                item.fileNameDisplay = item.fileName.replace(/%23/g, "#");
                item.fileNameDisplay = item.fileNameDisplay.replace(/%20/g, " ");
                item.fileNameDisplay = item.fileNameDisplay.replace(/%2C/g, ",");

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
                                <img src={extension} alt={extension} width="100%" height="100%"
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
                                {item["uploadedBy"]}
                            </p>
                        </div>
                    </td>
                    <td className="tdHover">
                        <div className="attachmentAction">
                            {Config.IsAllow(this.props.deleteAttachments) && (this.props.isApproveMode === false) ? (
                                <a className="attachRecycle" onClick={() => this.deletehandler(item)} data-toggle="tooltip" title={Resources["delete"][currentLanguage]}>

                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                                        <g fill="none" fillRule="evenodd" transform="translate(1)">
                                            <g fill="#A8B0BF" mask="url(#b)">
                                                <path id="a" d="M5.628 2.771h2.748v-.805H5.628v.805zm5.094 1.972H3.278l.711 8.292h6.022l.71-8.292zm-9.38.015C1.106 4.73.88 4.73.67 4.676c-.444-.115-.712-.56-.663-1.05.04-.42.422-.8.846-.837.14-.012.28-.01.42-.01h2.414V2.62 1.052c.002-.643.4-1.05 1.034-1.05C6.24 0 7.76-.002 9.28.001c.634 0 1.028.405 1.03 1.052.003.518.001 1.037.001 1.555v.17h.166c.837 0 1.674-.002 2.51.001.471.002.822.244.957.65.22.661-.226 1.28-.938 1.303-.112.003-.224 0-.347 0l-.086.967a8623.91 8623.91 0 0 0-.711 8.355c-.048.567-.442.943-1.004.944H3.15c-.575 0-.96-.368-1.01-.95l-.533-6.203c-.086-1-.169-2-.254-3-.002-.031-.008-.063-.01-.088zm6.065 3.795c0-.394.015-.789-.004-1.182-.028-.6.452-1.035.93-1.038.574-.005.994.402 1.002 1.012.012.82.01 1.64 0 2.46-.006.54-.378.93-.907.984-.451.045-.884-.28-.998-.755a1.21 1.21 0 0 1-.022-.272c-.002-.403-.001-.806-.001-1.21zm-2.741 0c0-.412-.004-.825.001-1.237.006-.472.32-.864.751-.954a.955.955 0 0 1 1.174.932c.015.847.012 1.695 0 2.543a.953.953 0 0 1-.75.925c-.455.095-.881-.105-1.079-.534a1.188 1.188 0 0 1-.093-.451c-.012-.408-.004-.816-.004-1.224z" />
                                            </g>
                                        </g>
                                    </svg>
                                </a>
                            ) : null}

                            <a href={item["attachFile"]} download={item.fileNameDisplay} target="_" className="pdfPopup various zero attachPdf" data-toggle="tooltip" title={Resources["download"][currentLanguage]}>

                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                                    <g fill="none" fillRule="evenodd" transform="translate(1)">
                                        <g fill="#A8B0BF" mask="url(#b)">
                                            <path id="a" d="M7.495 15H1.387c-.625 0-1.006-.347-1.062-.965-.018-.21-.031-.42-.045-.63L.04 9.714c-.015-.22-.032-.44-.038-.66-.018-.623.379-1.057 1-1.062 1.248-.01 2.496-.009 3.743.001.439.004.739.243.907.644.122.29.237.585.35.88.029.072.062.106.147.105.898-.003 1.797-.003 2.696 0 .091 0 .129-.036.158-.113.108-.282.22-.562.333-.843.181-.45.514-.677.998-.677h3.618c.555.001.966.313 1.035.828.035.264-.005.54-.021.809-.059.933-.12 1.865-.183 2.798-.04.594-.068 1.19-.134 1.781-.05.443-.445.77-.892.79-.078.005-.156.004-.234.004H7.495zM2.02 9.943l.2 3.094H12.78l.198-3.086h-2.037c-.005.011-.013.023-.018.035-.121.302-.241.604-.363.905-.19.465-.507.683-1.006.684-1.37.002-2.742.002-4.113 0-.498 0-.817-.222-1.003-.687-.105-.264-.213-.526-.312-.792-.04-.112-.093-.16-.223-.157-.574.01-1.147.004-1.72.004h-.164zM8.52 4.504c.092-.098.181-.2.276-.295.408-.41.917-.453 1.35-.119a.955.955 0 0 1 .172 1.337c-.138.176-.304.33-.462.489-.547.549-1.095 1.096-1.642 1.643a.99.99 0 0 1-1.436-.005c-.653-.657-1.31-1.31-1.963-1.966-.392-.393-.44-.925-.127-1.33a.954.954 0 0 1 1.367-.176c.121.096.226.213.339.32.031.03.065.058.13.116V4.32c0-1.119-.003-2.237.003-3.355.003-.422.214-.724.599-.89.617-.268 1.348.208 1.351.882.006 1.128.002 2.255.002 3.382v.144l.041.02z" />
                                        </g>
                                    </g>
                                </svg>
                            </a>
                            {Config.IsAllow(4501) ? (
                                <a className="attachPend" onClick={() => this.versionHandler(item["parentId"], ext)} data-toggle="tooltip" title={Resources["versions"][currentLanguage]}>

                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                                        <g fill="none" fillRule="evenodd" transform="translate(1 1)">
                                            <g fill="#A8B0BF" mask="url(#b)">
                                                <path id="a" d="M7.002.002C7.81.002 8.619.006 9.427 0c.319-.002.578.105.803.33a925.297 925.297 0 0 0 3.415 3.41c.239.236.356.508.355.846a888.57 888.57 0 0 0 0 4.838c0 .323-.108.588-.337.815a1207.202 1207.202 0 0 0-3.423 3.419c-.23.232-.496.343-.825.342a873.21 873.21 0 0 0-4.838 0c-.323 0-.585-.109-.814-.337a1027.606 1027.606 0 0 0-3.415-3.409A1.114 1.114 0 0 1 0 9.418C.006 7.806.006 6.193 0 4.58a1.113 1.113 0 0 1 .348-.835A909.544 909.544 0 0 0 3.763.336c.229-.229.49-.339.814-.336.808.007 1.617.002 2.425.002zm-.01 12.173c.677 0 1.353-.002 2.028.001.083 0 .143-.02.202-.08.957-.961 1.917-1.919 2.873-2.88a.293.293 0 0 0 .076-.188c.005-1.351.005-2.703 0-4.054a.294.294 0 0 0-.075-.188c-.958-.965-1.92-1.927-2.885-2.886a.276.276 0 0 0-.176-.071 659.005 659.005 0 0 0-4.068 0 .293.293 0 0 0-.186.079 663.38 663.38 0 0 0-2.877 2.876.277.277 0 0 0-.075.175 667.31 667.31 0 0 0 0 4.08c0 .06.033.133.075.176.959.964 1.92 1.926 2.885 2.885a.278.278 0 0 0 .177.072c.675.004 1.351.003 2.027.003zm-.904-6.476c0-.44-.002-.88 0-1.321.003-.508.3-.856.8-.943.4-.069.859.215.971.609.03.105.051.218.052.327.004.89.004 1.78.001 2.67-.001.474-.304.847-.745.925-.57.102-1.064-.308-1.079-.894v-.026V5.7zM7 8.75a.915.915 0 0 1 .911.915.927.927 0 0 1-.915.914.917.917 0 0 1-.909-.93.91.91 0 0 1 .913-.898z" />
                                            </g>
                                        </g>
                                    </svg>
                                </a>
                            ) : null}

                            {ext === "pdf" ? (
                                <a className="rootIcon" onClick={() => this.goEditPdf(item, ext)}>
                                    <i className=" fa fa-link" width="100%" height="100%" />
                                </a>
                            ) : null}

                            {ext === "dwg" || ext === "rvt" ? (
                                <a className="autocadIcon" onClick={e => this.viewAutoDeskModal(item, e)}>
                                    <img src={autocad} style={{ maxWidth: "100%", maxHeight: "100%" }} alt="autoDesk" />
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
                                        {Resources["actions"][currentLanguage]}
                                    </span>
                                </div>
                            </th>
                            <th>
                                <div className="headCell tableCell-2">
                                    <span>
                                        {Resources["fileName"][currentLanguage]}
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
                                        {Resources["uploadedBy"][currentLanguage]}
                                    </span>
                                </div>
                            </th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>{tabel}</tbody>
                </table>

                {/* {this.state.view ? (
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
                                                    <img src={pdfMaxi} alt="Print" />
                                                </span>
                                                <p className="zero">+</p>
                                            </div>
                                            <div className="pdf__print">
                                                <span>
                                                    <img src={pdfPrint} alt="Print" />
                                                </span>
                                                <span>
                                                    <img src={pdfDelete} alt="Print" />
                                                </span>
                                                <span>
                                                    <img src={pdfMenuAction} alt="Print" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {activeURL === "" ? null : (<PDFViewer document={{ url: this.state.activeURL }} />)}
                            </div>
                        </SkyLight>
                    </div> 
                ) : null}*/}
                <div className="largePopup largeModal " style={{ display: this.state.viewVersion ? "block" : "none" }}>
                    <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialogVersion = ref)}>
                        <div className="dropWrapper">
                            {ViewVersionDetails()}
                        </div>
                    </SkyLight>
                </div>

                <div className="largePopup largeModal " style={{ display: this.state.viewImage ? "block" : "none" }}>
                    <SkyLight hideOnOverlayClicked ref={ref => (this.simpleDialogImage = ref)}>
                        <div className="dropWrapper">
                            <div className="fullWidthWrapper">
                                <img src={this.state.imagePath.replace('www.dropbox.com', 'dl.dropboxusercontent.com')} alt="doc img" style={{ maxWidth: '100 %' }} />
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewExpensesAttachmments);

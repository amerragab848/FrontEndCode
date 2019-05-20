import React, { Component, Fragment } from 'react'
import moment from "moment";
import Resources from '../../resources.json';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DED from './DocumentExportDefination.json'
import { connect } from 'react-redux';
import Profile from '../../Styles/images/icons/person.svg'
import PdfImg from '../../Styles/images/pdfAttache.png'
import LoadingSection from '../publicComponants/LoadingSection'
import Signature from '../../Styles/images/mySignature.png';
import {
    bindActionCreators
} from 'redux';

import * as communicationActions from '../../store/actions/communication';
const _ = require('lodash')

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const filedsIgnor = ['status', 'docDate'];
class ExportDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isExcel: "false",
            isLandscape: false,
            disNone: "disNone",
            isLoading: false
        };

        this.ExportDocument = this.ExportDocument.bind(this);
    }

    ExportDocument(Fields, items, name) {
        if (this.state.isExcel == "false") {

            this.setState({
                isLoading: true
            });
            const input = document.getElementById('printPdf');
            input.style.height = 'auto'
            input.style.visibility = 'visible'
            // html2canvas(input).then((canvas) => {
            //     const imgData = canvas.toDataURL('image/png');
            //     const pdf = new jsPDF();
            //     pdf.addImage(imgData, 'JPEG', 0, 0);
            //     pdf.save("download.pdf");
            //     input.style.visibility = 'hidden';
            //     input.style.height = '0';
            //     this.setState({
            //         isLoading: false
            //     });
            // }) 

            html2canvas(input).then((canvas) => {
                var imgData = canvas.toDataURL('image/png');
                var imgWidth = 210;
                var pageHeight = 295;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;
                var doc = new jsPDF('p', 'mm','a4');
                var position = 0;

                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                doc.save(Resources[this.props.documentTitle][currentLanguage] + '.pdf');
                input.style.visibility = 'hidden';
                input.style.height = '0';
                this.setState({
                    isLoading: false
                });

            })
        }
        else {
            var uri = 'data:application/vnd.ms-excel;base64,'
                , template = '<html xmlns: o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">'
                    + '<head> '
                    + '<style>td {border: 0.5pt solid #c0c0c0} .tRight {text - align: right} .tLeft {text - align: left} </style>'
                    + '<xml><x: ExcelWorkbook><x: ExcelWorksheets><x: ExcelWorksheet><x: Name>{worksheet}</x: Name><x: WorksheetOptions><x: DisplayGridlines/></x: WorksheetOptions></x: ExcelWorksheet ></x: ExcelWorksheets ></x: ExcelWorkbook ></xml >'
                    + '<meta http-equiv="content-type" content="text/plain; charset=UTF-8" />'
                    + '<h2> Procoor Document </h2>'
                    + '</head > '
                    + '<body>'
                    + ' <table>{Fields}</table>   <table> <h6>Document Cycles </h6></table> '
                    + ' <table>{items}</table>   <table> <h6> Attachments </h6></table> '
                    + ' <table>{attachmentTable}</table>   <table><h6>   </table> '
                    + ' <table>{workflowCycles}</table>   <table> Doc. Attachments </table> '
                    + ' <table>{docAttachments}</table>     '
                    + '</body></html > '
                , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
                , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

            var Fields = '', items = '', attachmentTable = '', workflowCycles = '', docAttachments = '';
            if (!'Fields'.nodeType) Fields = document.getElementById('Fields').innerHTML

            if (this.props.items.length) items = document.getElementById('items').innerHTML

            if (!'attachmentTable'.nodeType) attachmentTable = document.getElementById('attachmentTable').innerHTML
            if (this.props.workFlowCycles.length) workflowCycles = document.getElementById('workflowCycles').innerHTML
            if (this.props.attachDocuments.length) docAttachments = document.getElementById('attachDocuments').innerHTML

            var ctx = {
                name: 'procoor Export',
                Fields: Fields,
                items: items,
                attachmentTable: attachmentTable,
                workflowCycles: workflowCycles,
                docAttachments: docAttachments
            }

            var blob = new Blob([format(template, ctx)]);
            //var blobURL = window.URL.createObjectURL(blob);

            if (this.ifIE()) {
                //csvData = table.innerHTML;
                if (window.navigator.msSaveBlob) {
                    var blob = new Blob([format(template, ctx)], {
                        type: "text/html"
                    });
                    return navigator.msSaveBlob(blob, '' + name + '.xls');
                }
            }
            else
                return window.location.href = uri + base64(format(template, ctx))

        }
    }

    ifIE() {
        var isIE11 = navigator.userAgent.indexOf(".NET CLR") > -1;
        var isIE11orLess = isIE11 || navigator.appVersion.indexOf("MSIE") != -1;
        return isIE11orLess;
    }

    drawFields() {
        let fields = DED[this.props.docTypeId]
        let data = this.props.document

        let rows = fields.fields.map((field, index) => {
            let formatData = field.type == "D" ? moment(data[field.value]).format('DD/MM/YYYY') : data[field.value]
            let nextIndex = (index + 1);
            if ((index % 2) === 0) {
                return (<tr key={index}>
                    <td style={{ backgroundColor: '#f3f6f9' }}>
                        <h4 className="ui image header">
                            <div className="content">{Resources[field.name][currentLanguage]} :</div>
                        </h4>
                    </td>

                    <td><span>{formatData}</span></td>
                    {nextIndex < fields.fields.length ?

                        <Fragment>
                            <td style={{ backgroundColor: '#f3f6f9' }}>
                                <h4 className="ui image header">
                                    <div className="content">{Resources[fields.fields[nextIndex].name][currentLanguage]} :</div>
                                </h4>
                            </td>
                            <td><span>{fields.fields[nextIndex]["type"] == "D" ? moment(data[fields.fields[nextIndex]["value"]]).format("DD/MM/YYYY") : data[fields.fields[nextIndex]["value"]]}</span></td>
                        </Fragment>
                        : null
                    }

                </tr>
                )
            }
        });
        return (
            <table id="Fields" className="subiTable" >
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }

    drawFields_pdf() {
        let fields = DED[this.props.docTypeId]
        let data = this.props.document
        let rows = fields.fields.map((field, index) => {
            let formatData = field.type == "D" ? moment(data[field.value]).format('DD/MM/YYYY') : data[field.value]

            let notExist = _.find(filedsIgnor, function (x) { return x == field.name })
            return (

                !notExist ?
                    <tr key={index}>
                        <td>
                            <h4 className="ui image header">
                                <img src={Profile} alt="Doc." />
                                <div className="content">
                                    {Resources[field.name][currentLanguage]}
                                </div>
                            </h4>
                        </td>
                        <td>
                            {formatData}
                        </td>
                    </tr>

                    : null
            )
        });
        return (
            <table id="Fields"  >
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }

    drawItems() {
        let fieldsItems = DED[this.props.docTypeId].columnsItems
        let rows = this.props.items.length > 0 ?
            (this.props.items.map((row, index) => {
                return (
                    <tr key={'rwow- ' + index}>
                        {fieldsItems.map((field, index) => {
                            return (<td key={'field- ' + index}>{row[field]}</td>)
                        })}
                    </tr>
                )
            })
            )
            : null
        let fieldsName = DED[this.props.docTypeId].friendlyNames
        if (fieldsName.length > 0) {
            return (
                <table id="items " style={{ border: 'double' }}>

                    <thead valign="top">
                        <tr key={'dd- '} style={{ border: '4px' }}>
                            {fieldsName.map((column, index) => {
                                return (
                                    <th key={'dddd- ' + index} style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}> {Resources[column][currentLanguage]}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            )
        }
        else {
            return (null)
        }
    }

    drawAttachments() {
        return (
            <table className="attachmentTable" id="attachmentTable">
                <thead>
                    <tr>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>
                            <div className="headCell tableCell-2">
                                <span>Subject  </span>
                            </div>
                        </th>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>
                            <div className="headCell tableCell-3">
                                <span>Upload date</span>
                            </div>
                        </th>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>
                            <div className="headCell tableCell-4">
                                <span>Uploaded by</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.files.map(file => {
                        return (<tr>
                            <td>
                                <div className="contentCell tableCell-2">
                                    <a className="pdfPopup various zero">{file.fileName}</a>
                                </div>
                            </td>
                            <td>
                                <div className="contentCell tableCell-3">
                                    <p className="zero status">{file.uploadedDate}</p>
                                </div>
                            </td>
                            <td>
                                <div className="contentCell tableCell-4">
                                    <p className="zero">{file.uploadBy}</p>
                                </div>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>

        )
    }

    drawattachDocuments() {
        return (
            <table className="attachmentTable" id="attachDocuments">
                <thead>
                    <tr>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>
                            <div className="headCell tableCell-2">
                                <span>{Resources["subject"][currentLanguage]}  </span>
                            </div>
                        </th>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>
                            <div className="headCell tableCell-3">
                                <span>{Resources["docType"][currentLanguage]}</span>
                            </div>
                        </th>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>
                            <div className="headCell tableCell-4">
                                <span>{Resources["docDate"][currentLanguage]}</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.attachDocuments.map(file => {
                        return (<tr>
                            <td>
                                <div className="contentCell tableCell-2">
                                    <a className="pdfPopup various zero">{file.subject}</a>
                                </div>
                            </td>
                            <td>
                                <div className="contentCell tableCell-3">
                                    <p className="zero status">{file.docTypeName}</p>
                                </div>
                            </td>
                            <td>
                                <div className="contentCell tableCell-4">
                                    <p className="zero">{file.docDate}</p>
                                </div>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>

        )
    }

    drawItems_pdf() {
        let fieldsItems = DED[this.props.docTypeId].columnsItems
        let rows = this.props.items.length > 0 ?
            (this.props.items.map((row, index) => {
                return (
                    <tr key={'tr- ' + index}>
                        {fieldsItems.map((field, index) => {
                            return (<td key={'td- ' + index}><div className="contentCell tableCell-2"><a>{row[field]}</a></div></td>)
                        })}
                    </tr>
                )
            })
            )
            : null
        let fieldsName = DED[this.props.docTypeId].friendlyNames
        if (fieldsName.length > 0) {
            return (
                <Fragment>
                    <p id="pdfLength">{Resources.itemsList[currentLanguage]}</p>
                    <table id="items" className="attachmentTable attachmentTable__items">
                        <thead >
                            <tr >
                                {fieldsName.map((column, index) => {
                                    return (
                                        <th key={'th- ' + index}>
                                            <div className="headCell ">
                                                {Resources[column][currentLanguage]}
                                            </div>
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </Fragment>)
        }
        else {
            return (null)
        }
    }

    drawAttachments_pdf() {
        return (
            this.props.files.length > 0 ?
                <Fragment>
                    <p id="pdfLength">Attached files</p>
                    <table className="attachmentTable" id="attachmentTable">
                        <thead>
                            <tr> 
                                <th>
                                    <div className="headCell tableCell-2">
                                        <span>{Resources.fileName[currentLanguage]} </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-3">
                                        <span>{Resources.uploadedDate[currentLanguage]}</span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell tableCell-4">
                                        <span>{Resources.uploadedBy[currentLanguage]}</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.files.map(file => {
                                let formatData = moment(file.createdDate).format('DD/MM/YYYY')
                                return (
                                    <tr> 
                                        <td>
                                            <div className="contentCell tableCell-2">
                                                <a className="pdfPopup various zero">{file.fileNameDisplay}</a>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-3">
                                                <p className="zero status">{formatData}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-4">
                                                <p className="zero">{file.uploadBy}</p>
                                            </div>
                                        </td>

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Fragment>
                : null
        )
    }

    drawattachDocuments_pdf() {
        return (
            this.props.attachDocuments.length > 0 ?
                <Fragment>
                    <p id="pdfLength">Attached documents</p>

                    <table className="attachmentTable" id="attachDocumentss">
                        <thead>
                            <tr>
                                <th >
                                    <div className="headCell tableCell-2">
                                        <span>{Resources["subject"][currentLanguage]}  </span>
                                    </div>
                                </th>
                                <th >
                                    <div className="headCell tableCell-3">
                                        <span>{Resources["docType"][currentLanguage]}</span>
                                    </div>
                                </th>
                                <th >
                                    <div className="headCell tableCell-4">
                                        <span>{Resources["docDate"][currentLanguage]}</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.attachDocuments.map(file => {
                                return (<tr>
                                    <td>
                                        <div className="contentCell tableCell-2">
                                            <a className="pdfPopup various zero">{file.subject}</a>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contentCell tableCell-3">
                                            <p className="zero status">{file.docTypeName}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="contentCell tableCell-4">
                                            <p className="zero">{file.docDate}</p>
                                        </div>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Fragment>
                : null
        )
    }

    drawWorkFlow() {
        let levels = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0].levels : []
        return (
            <table id="workflowCycles" className="printWrapper printSecondPage" style={{ marginTob: '10px' }} >
                <tbody>
                    {levels.length > 0 ?
                        <Fragment >
                            <tr rowSpan="2">
                                <td colSpan={levels.length}>
                                    <span> {this.props.workFlowCycles[0].subject} at Level: {this.props.workFlowCycles[0].currentLevel} - Sent in: {moment(this.props.workFlowCycles[0].creationDate).format('DD-MM-YYYY')} </span>
                                </td>
                            </tr>
                            <tr className="workflowPrint">

                                {levels.map((cycle, index) => {
                                    return (
                                        <td key={'cyc-' + index} className="flowNumber">
                                            <div className="FlowText">
                                                <h3 style={{ margin: '0' }}>{cycle.contactName}</h3>
                                                <p style={{ textAlign: 'center', margin: '0' }}>{cycle.arrange}</p>
                                                <span className=" statueName">{cycle.status} - </span>
                                                <span style={{ display: 'block' }} className="statueDate">{moment(cycle.creationDate).format('DD-MM-YYYY')}</span>
                                                <br />
                                                <span>{cycle.companyName}</span>
                                            </div>
                                        </td>
                                    )

                                })}

                            </tr>
                        </Fragment>
                        : null
                    }
                </tbody>
            </table >
        )
    }

    handleChange(e, field) {
        this.setState({
            [field]: e.target.value
        });
    }

    render() {
        let formatData = moment(this.props.document.docDate).format('DD/MM/YYYY')
        let levels = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0].levels : []
        let exportPdf =
            <div>
                <div id="printPdf" className="printWrapper" style={{ height: 0, visibility: "hidden" }} >
                    <div className="company__name">
                        <span className="company__logo"></span>
                        <h3>Company name</h3>
                    </div>
                    <div className="subiGrid printGrid">
                        <div className="printHead">
                            <h3 className="zero">
                                {Resources[this.props.documentTitle][currentLanguage]}
                            </h3>
                        </div>
                        <div className="docStatus">
                            <div className="highClosed">
                                <span className="subiStatus">{Resources.status[currentLanguage]} </span>
                                <span className="subiPriority redSpan"> {this.props.document.status == true ? 'Opended' : 'Closed'}</span>
                            </div>
                            <div className="requireDate">
                                <span>{Resources.docDate[currentLanguage] + ' '}</span>
                                <span>{formatData}</span>
                            </div>
                        </div>
                        <div className="subiTable">
                            {this.drawFields_pdf()}
                        </div>

                    </div>
                    <div className="table__withItem">
                        {this.drawItems_pdf()}
                    </div>


                    {this.drawAttachments_pdf()}

                    <p id="pdfLength"><span>{this.props.workFlowCycles[0].subject}</span><span>{" at Level: " + this.props.workFlowCycles[0].currentLevel}</span><span> {" Sent:" + moment(this.props.workFlowCycles[0].creationDate).format('DD-MM-YYYY')}</span></p>

                    <div className=" printSecondPage">
                        {levels.map((cycle, index) => {
                            return (
                                <div key={'row- ' + index} className="workflowPrint">
                                    <div className="flowLevel">
                                        <div className="flowNumber">
                                            <span className="stepLevel">{index + 1}</span>
                                        </div>
                                        <div className="flowMember">
                                            <div className="FlowText">
                                                <h3>{cycle.contactName}</h3>
                                                <p>{cycle.companyName}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={cycle.statusVal == null ? "flowStatus pendingStatue" : cycle.statusVal === true ? "flowStatus approvedStatue" : "flowStatus rejectedStatue"}>
                                        <span className=" statueName">{cycle.status}</span>
                                        <span className="statueDate">{moment(cycle.creationDate).format('DD-MM-YYYY')}</span>
                                        <span className="statueSignature">
                                            <img src={cycle.statusVal == null ? null : cycle.signature != null ? cycle.signature : Signature} alt="..." />
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {this.drawattachDocuments_pdf()}

                </div>
            </div>
        return (
            <div id={'docExport'} >
                <div className="dropWrapper">
                    <div className="proForm customProform">
                        <div className="fillter-status fillter-item-c">
                            <label className="control-label">{Resources.export[currentLanguage]}</label>
                            <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="vo-excel" defaultChecked={this.state.isExcel === "false" ? null : 'checked'} value={true} onChange={e => this.handleChange(e, 'isExcel')} />
                                <label>{Resources.excel[currentLanguage]}</label>
                            </div>
                            <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="vo-excel" defaultChecked={this.state.isExcel === "false" ? 'checked' : null} value={false} onChange={e => this.handleChange(e, 'isExcel')} />
                                <label>{Resources.pdf[currentLanguage]}</label>
                            </div>
                        </div>
                        <div className="fillter-status fillter-item-c">
                            <label className="control-label">{Resources.design[currentLanguage]}</label>
                            <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="vo-executed" defaultChecked={this.state.isLandscape === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'isLandscape')} />
                                <label>{Resources.landscape[currentLanguage]}</label>
                            </div>
                            <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="vo-executed" defaultChecked={this.state.isLandscape === false ? 'checked' : null} value="true" onChange={e => this.handleChange(e, 'isLandscape')} />
                                <label>{Resources.portrait[currentLanguage]}</label>
                            </div>
                        </div>
                    </div>
                    <div className="fullWidthWrapper">
                        <button className="primaryBtn-1 btn mediumBtn" type="button" onClick={e => this.ExportDocument('salaryTable', 'testTable', 'procoor ')}>{Resources["export"][currentLanguage]}</button>
                    </div>
                </div>

                {this.state.isLoading === true ?
                    <LoadingSection /> : null}

                <div style={{ display: 'none' }}>
                    {this.drawFields()}
                    {this.drawItems()}
                    {this.drawAttachments()}
                    {this.drawWorkFlow()}
                    {this.drawattachDocuments()}
                </div>
                {exportPdf}
            </div>

        )
    }
}


function mapStateToProps(state, ownProps) {
    return {
        document: state.communication.document,
        files: state.communication.files,
        workFlowCycles: state.communication.workFlowCycles,
        items: state.communication.items,
        fields: state.communication.fields,
        fieldsItems: state.communication.fieldsItems,
        attachDocuments: state.communication.attachDocuments,
        docTypeId: state.communication.docTypeId,
        documentTitle: state.communication.documentTitle
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
)(ExportDetails);


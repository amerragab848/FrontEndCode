import React, { Component, Fragment } from 'react'
import moment from "moment";
import Resources from '../../resources.json';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DED from './DocumentExportDefination.json'
import { connect } from 'react-redux';
import Profile from '../../Styles/images/icons/person.svg'
import PdfImg from '../../Styles/images/pdfAttache.png'
import {
    bindActionCreators
} from 'redux';

import * as communicationActions from '../../store/actions/communication';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');


class ExportDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isExcel: false,
            isLandscape: false
        };

        this.tableToExcel = this.tableToExcel.bind(this);
    }

    tableToExcel(Fields, items, name) {
        if (this.state.isExcel == false) {
            const input = document.getElementById('printPdf');
            html2canvas(input)
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF();
                    pdf.addImage(imgData, 'JPEG', 0, 0);
                    pdf.save("download.pdf");
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

    drawFiled() {
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

    drawFiled_pdf() {
        let fields = DED[this.props.docTypeId]
        let data = this.props.document
        let rows = fields.fields.map((field, index) => {
            let formatData = field.type == "D" ? moment(data[field.value]).format('DD/MM/YYYY') : data[field.value]
            return (<tr key={index}>
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
            (this.props.items.map(row => {
                return (
                    <tr>
                        {fieldsItems.map(field => {
                            return (<td>{row[field]}</td>)
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
                        <tr style={{ border: '4px' }}>
                            {fieldsName.map(column => {
                                return (
                                    <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}> {Resources[column][currentLanguage]}</th>
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

    drawItems_pdf() {
        let fieldsItems = DED[this.props.docTypeId].columnsItems
        let rows = this.props.items.length > 0 ?
            (this.props.items.map(row => {
                return (
                    <tr>
                        {fieldsItems.map(field => {
                            return (<td><div className="contentCell tableCell-2"><span>{row[field]}</span></div></td>)
                        })}
                    </tr>
                )
            })
            )
            : null
        let fieldsName = DED[this.props.docTypeId].friendlyNames
        if (fieldsName.length > 0) {
            return (
                <table id="items" className="attachmentTable attachmentTable__items">
                    <thead >
                        <tr >
                            {fieldsName.map(column => {
                                return (
                                    <th>
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

    drawAttachments_pdf() {
        return (
            <table className="attachmentTable" id="attachmentTable">
                <thead>
                    <tr>
                        <th>
                            <div className="headCell tableCell-1">
                                <span>{Resources.type[currentLanguage]}</span>
                            </div>
                        </th>
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
                                <td className="nameOfAttach">
                                    <div className="contentCell tableCell-1">
                                        <span className="pdfImage">
                                            <img src={PdfImg} alt="pdf" />
                                        </span>
                                    </div>
                                </td>
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
    drawattachDocuments_pdf() {
        return (
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

                                {levels.map(cycle => {
                                    return (
                                        <td className="flowNumber">
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


    drawWorkFlow_pdf() {
        let levels = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0].levels : []
        levels.map((cycle, index) => {
            return (
                <div className="workflowPrint">
                    <div className="flowLevel">
                        <div className="flowNumber">
                            <span className="stepLevel">{index + 1}</span>
                        </div>
                        <div className="flowMember">
                            <figure className="avatarProfile smallAvatarSize">
                                <img alt="" title="" src="../images/24176695_10215314500400869_7164682088117484142_n.jpg" />
                            </figure>
                            <div className="FlowText">
                                <h3>{cycle.contactName}</h3>
                                <p>{cycle.companyName}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flowStatus approvedStatue">
                        <span className=" statueName">{cycle.status}</span>
                        <span className="statueDate">{moment(cycle.creationDate).format('DD-MM-YYYY')}</span>
                        <span className="statueSignature"><img src="../images/mySignature.png" /></span>
                    </div>
                </div>
            )
        })
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
            <div className="">
                <div id="printPdf" className="printWrapper">
                    <div className="company__name">
                        <span className="company__logo"></span>
                        <h3>Company name</h3>
                    </div>
                    <div className="subiGrid printGrid">
                        <div className="printHead">
                            <h3 className="zero">
                                {this.props.documentTitle}
                            </h3>
                        </div>
                        <div className="docStatus">
                            <div className="highClosed">
                                <span className="subiStatus">{this.props.document.status == true ? 'Opended' : 'Closed'}</span>
                            </div>
                            <div className="requireDate">
                                <span>{Resources.docDate[currentLanguage] + ' '}</span>
                                <span>{formatData}</span>
                            </div>
                        </div>
                        <div className="subiTable">
                            {this.drawFiled_pdf()}
                        </div>

                    </div>
                    <div className="table__withItem">
                        {this.drawItems_pdf()}
                    </div>
                    <hr />

                    <p id="pdfLength">Attached documents</p>
                    {this.drawAttachments_pdf()}
                    <div class="printWrapper printSecondPage">
                        {levels.map((cycle, index) => {
                            return (
                                <div className="workflowPrint">
                                    <div className="flowLevel">
                                        <div className="flowNumber">
                                            <span className="stepLevel">{index + 1}</span>
                                        </div>
                                        <div className="flowMember">
                                            <figure className="avatarProfile smallAvatarSize">
                                                <img alt="" title="" src="../images/24176695_10215314500400869_7164682088117484142_n.jpg" />
                                            </figure>
                                            <div className="FlowText">
                                                <h3>{cycle.contactName}</h3>
                                                <p>{cycle.companyName}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flowStatus approvedStatue">
                                        <span className=" statueName">{cycle.status}</span>
                                        <span className="statueDate">{moment(cycle.creationDate).format('DD-MM-YYYY')}</span>
                                        <span className="statueSignature"><img src="../images/mySignature.png" /></span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="subiTable">
                        {this.drawattachDocuments_pdf()}
                    </div>
                </div>
            </div>
        return (
            <div id={'docExport'}>
                <div className="dropWrapper">
                    <div className="proForm customProform">
                        <div className="fillter-status fillter-item-c">
                            <label className="control-label">{Resources.export[currentLanguage]}</label>
                            <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="vo-excel" defaultChecked={this.state.isExcel === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'isExcel')} />
                                <label>{Resources.excel[currentLanguage]}</label>
                            </div>
                            <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="vo-excel" defaultChecked={this.state.isExcel === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'isExcel')} />
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
                            <button className="primaryBtn-1 btn mediumBtn" type="button" onClick={e => this.tableToExcel('salaryTable', 'testTable', 'procoor ')}>{Resources["export"][currentLanguage]}</button>
                        </div>
                    </div>
                        <div style={{ display: 'none' }}>
                            {this.drawFiled()}
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
                

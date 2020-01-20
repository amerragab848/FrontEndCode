import React, { Component, Fragment } from 'react'
import moment from "moment";
import Resources from '../../resources.json';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import DED from './DocumentExportDefination.json'
import { connect } from 'react-redux';
import Profile from '../../Styles/images/icons/person.svg'
import LoadingSection from '../publicComponants/LoadingSection'
import Signature from '../../Styles/images/mySignature.png';
import Config from "../../Services/Config";
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Dataservice from '../../Dataservice.js'; 
const find = require('lodash/find')

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const filedsIgnor = ['status', 'docDate']; 

class ExportDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isExcel: false,
            isLandscape: false,
            disNone: "disNone",
            isLoading: false,
            random: 0
        };

        this.ExportDocument = this.ExportDocument.bind(this);
    }

    ExportDocument(Fields, items, name) {
        this.setState({
            isLoading: true
        });

        if (this.state.isExcel === false) {

            var route = 'ExportDocumentServerSide';
            var title = this.props.documentName.replace(/ /g, '_');

            Dataservice.GetNextArrangeMainDocument(route + `?documentName=${title}&documentId=${this.props.docId}&projectId=${this.props.projectId}&docTypeId=${this.props.docTypeId}`)
                .then(result => {
                    if (result != null) {
                        result = Config.getPublicConfiguartion().downloads + result;

                        var a = document.createElement('A');
                        a.href = result;
                        a.download = result.substr(result.lastIndexOf('/') + 1);
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        this.setState({
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            isLoading: false
                        });
                    }
                }).catch(err => {
                    this.setState({
                        isLoading: false
                    });
                });
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
            if (this.props.docsAttachData.length) docAttachments = document.getElementById('attachDocuments').innerHTML

            var ctx = {
                name: 'procoor Export',
                Fields: Fields,
                items: items,
                attachmentTable: attachmentTable,
                workflowCycles: workflowCycles,
                docAttachments: docAttachments
            }

            this.setState({
                isLoading: false
            });

            var blob = new Blob([format(template, ctx)]);
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

    componentDidMount() {
        // this.ExportDocument('salaryTable', 'testTable', 'procoor ');
        // console.log(this.props.workFlowCycles);
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

    drawItems() {
        let fieldsItems = DED[this.props.docTypeId].columnsItems

        let fieldsName = DED[this.props.docTypeId].friendlyNames
        if (fieldsName.length > 0) {
            return (
                <table id="items" style={{ border: 'double' }}>

                    <thead valign="top">
                        <tr key={'dd- '} style={{ border: '4px' }}>
                            {fieldsName.map((column, index) => {
                                console.log(Resources[column][currentLanguage]);
                                return (
                                    <th key={'dddd- ' + index} style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>{Resources[column][currentLanguage]}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.items.map((row, index) => {
                            return (
                                <tr key={'rwow- ' + index}>
                                    {fieldsItems.map((field, index) => {
                                        return (<td key={'field- ' + index}>{row[field]}</td>)
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )
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
                    {this.props.files.map((file, index) => {
                        return (<tr key={index}>
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
                    {this.props.docsAttachData.map(file => {
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

    drawFields_pdf() {
        let fields = DED[this.props.docTypeId]
        let data = this.props.document
        let rows = fields.fields.map((field, index) => {
            let formatData = field.type == "D" ? moment(data[field.value]).format('DD/MM/YYYY') : data[field.value]

            let notExist = find(filedsIgnor, function (x) { return x == field.name })
            return (

                !notExist ?
                    <tr key={index}>
                        <td>
                            <div className="table__wrapper">
                                <h4 className="ui image header ">
                                    <img src={Profile} alt="Doc." />
                                    <div className="content">
                                        {Resources[field.name][currentLanguage]}
                                    </div>
                                </h4>
                            </div>
                        </td>
                        <td className="white mt5 tc f3" >
                            <div className="table__wrapper">

                                {formatData}
                            </div>
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

    drawItems_pdf() {
        let fieldsItems = DED[this.props.docTypeId].columnsItems
        let rows = this.props.items.length > 0 ?
            (this.props.items.map((row, index) => {
                return (
                    <tr key={'tr-item- ' + index}>
                        {fieldsItems.map((field, index) => {
                            return (<td key={'td-item- ' + index}><div className="contentCell tableCell-2"><a>{row[field]}</a></div></td>)
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
                                        <th key={'th-items ' + index}>
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
                            {this.props.files.map((file, index) => {
                                let formatData = moment(file.createdDate).format('DD/MM/YYYY')
                                return (
                                    <tr key={index}>
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
            this.props.docsAttachData.length > 0 ?
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
                            {this.props.docsAttachData.map(file => {
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

    handleChange(value, field) {
        console.log(value, field);
        this.setState({
            [field]: value
        });
    }

    exportPDFFile() {
        if (this.state.isExcel === true) return;
        let formatData = moment(this.props.document.docDate).format('DD/MM/YYYY');
        let levels = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0].levels : [];
        let cycleWF = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0] : null;
        return (
            <div id="invoice" className="invoice">
                <div id="printPdf" className="printWrapper">
                    <div className="company__name  company__name--image"> 
                        {/* <span className="company__logo" style={{ backgroundColor: 'transparent', }}>  */}
                        <img src="/static/media/logo.f73844e0.svg" alt="Procoor" title="Procoor" style={{ maxWidth: '100%' }} />
                        {/* </span> */}
                        {/* <h3> {this.props.documentName}</h3> */}
                    </div>
                    <div className="subiGrid printGrid">
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
                    {this.props.items.length > 0 ?
                        < div className="table__withItem">
                            {this.drawItems_pdf()}
                        </div>
                        : null
                    }
                    {this.drawAttachments_pdf()}
                    {this.drawattachDocuments_pdf()}
                    {this.props.workFlowCycles.length > 0 ?
                        <Fragment>
                            <p id="pdfLength"><span>{cycleWF.subject}</span><span>{" at Level: " + cycleWF.currentLevel}</span><span> {" Sent:" + moment(cycleWF.creationDate).format('DD-MM-YYYY')}</span></p>
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
                                                {cycle.statusVal == null ? null :<span className="statueDate">{moment(cycle.creationDate).format('DD-MM-YYYY')}</span>}
                                                {cycle.statusVal == null ? null :
                                                    <span className="statueSignature">
                                                        <img src={cycle.signature != null ? Config.getPublicConfiguartion().downloads + "/" + cycle.signature : Signature} alt="..." />
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Fragment>
                        : null
                    }

                  <div className="footer_print">
                      <img src="static/media/logo.f73844e0.svg" alt="Logo" />
                  </div>
                </div>
            </div >

        )
    }

    PrintDocument() {
        this.setState({
            isExcel: false
        });
        var contents = document.getElementById("invoice").innerHTML;
        var frame1 = document.getElementById('iframePrint'); 
        var link = document.createElement('style');
        var css =  `
        .company__name {
          display: flex;
          padding-top: 28px;
          padding-left: 40px;
          margin-bottom: 29px;
          align-items: center;
        }
        
        .company__name .company__logo {
          width: 60px;
          height: 60px;
          border-radius: 30px;
          background-color: #e9ecf0;
          margin-right: 26px;
        }
        
        .company__name h3 {
          font-family: "Open Sans", sans-serif;
          font-weight: 400;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.4px;
          color: #4f515a;
          margin: 0;
        }

        .company__name.company__name--image {
          padding: 40px; 
          margin-bottom: 15px; 
          align-items: unset;
          border-bottom: 2px solid #E9ECF0;
        }

        .company__name.company__name--image img {
            max-width: 100%;
            max-height: 150px;
        }
        
        .footer_print {
            margin-top: 15px;
            padding:  40px;
        }
        
        .footer_print img {
            max-width: 100%;
            max-height: 120px;
        }
        
        .docStatus {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px 0 28px;
        }
        
        .docStatus .highClosed {
          width: 138px;
          height: 37px;
          border-radius: 18px;
          border: 1px solid #e9ecf0;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }
        
        .docStatus .highClosed span {
          font-family: "Muli", sans-serif;
          font-weight: 600;
          font-size: 11px;
          font-weight: normal;
          line-height: 1.45;
          letter-spacing: -0.3px;
          color: #3e4352;
        }
        
        .avatarProfile img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        
        .smallAvatarSize {
          width: 32px;
          height: 32px;
          box-shadow: none;
        }
        .avatarProfile {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e9ecf0;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }
        
        .docStatus .highClosed span.redSpan {
          font-weight: 600;
          position: relative;
        }
        
        .docStatus .highClosed span.redSpan::after {
          content: "";
          position: absolute;
          top: 3px;
          left: -15px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: red;
        }
        
        .docStatus .requireDate span:first-child {
          font-weight: 600;
        }
        .docStatus .requireDate span {
          font-family: "Muli", sans-serif;
          font-weight: 600;
          font-size: 12px;
          font-weight: normal;
          line-height: 2;
          letter-spacing: -0.2px;
          color: #3e4352;
        }
        
        .printWrapper .subiGrid .subiTable {
          border-bottom: none;
        }
        .subiGrid .subiTable {
          margin-bottom: 28px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e9ecf0;
        }
        
        .attachmentTable {
          width: 100%;
          background: #fff;
          margin: 1em 0;
          box-shadow: none;
          border-collapse: separate;
          border-spacing: 0;
          border: none;
          border-top: 1px solid #e9ecf0;
          border-bottom: 1px solid #e9ecf0;
          border-radius: 0;
          text-align: left;
        }
        
        .attachmentTable thead tr th {
          padding: 0 !important;
          height: 47px;
          min-width: 70px;
          background-color: #fafbfc;
          border-radius: 0;
        }
        
        @media screen and (max-width: 1300px) {
          .attachmentTable thead tr th {
            height: 41px;
          }
        }
        .attachmentTable thead tr th:first-child {
          min-width: 40px;
        }
        
        .attachmentTable thead tr th:nth-child(2) {
          border-right: 1px solid #e9ecf0;
        }
        
        .attachmentTable thead tr .headCell {
          display: -webkit-inline-box;
          display: -ms-inline-flexbox;
          display: inline-flex;
          -webkit-box-pack: start;
          -ms-flex-pack: start;
          justify-content: flex-start;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          padding-left: 10px;
          color: #a8b0bf;
          font-family: "Muli";
          font-weight: 700;
          font-size: 14px;
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        @media screen and (max-width: 1300px) {
          .attachmentTable thead tr .headCell {
            font-size: 10px;
            max-width: 100px;
          }
        }
        .attachmentTable thead tr .headCell span {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .attachmentTable tbody tr td {
          padding: 0 !important;
          height: auto;
          border-top: 1px solid #e9ecf0;
        }
        
        @media screen and (max-width: 1300px) {
          .attachmentTable tbody tr td {
            height: 34px;
          }
        }
        .attachmentTable tbody tr td:first-child {
          width: 45px;
        }
        
        .attachmentTable tbody tr td:nth-child(2) {
          border-right: 1px solid #e9ecf0;
          width: 200px;
        }
        
        .attachmentTable tbody tr td:nth-child(3) {
          width: 100px;
        }
        
        .attachmentTable tbody tr td.tdHover {
          min-width: 100px;
          position: relative;
        }
        
        @media screen and (max-width: 1300px) {
          .attachmentTable tbody tr td.tdHover {
            min-width: 70px;
          }
        }
        .attachmentTable tbody tr td.tdHover .attachmentAction {
          display: flex;
          align-items: center;
          opacity: 0;
          transition: all 0.4s ease-in-out;
          position: absolute;
          left: 0;
          top: calc(50% - 8px);
        }
        
        .attachmentTable tbody tr td.tdHover .attachmentAction a {
          margin: 0 8px;
          width: 16px;
          height: 16px;
          display: inline-block;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        
        @media screen and (max-width: 1300px) {
          .attachmentTable tbody tr td.tdHover .attachmentAction a {
            height: 14px;
            width: 14px;
            margin: 0 4px;
          }
        }
        .attachmentTable tbody tr td.tdHover .attachmentAction a img {
          transition: all 0.4s ease-in-out;
          transform: translateY(0);
        }
        
        .attachmentTable tbody tr td.tdHover .attachmentAction a svg g g {
          transition: all 0.4s ease-in-out;
        }
        
        .attachmentTable tbody tr td.tdHover .attachmentAction a:hover svg g g {
          fill: #969eab;
        }
        
        .attachmentTable tbody tr td.tdHover .attachmentAction a::after {
          content: "";
          width: 16px;
          position: absolute;
          height: 16px;
          background-size: 100% 100%;
          transform: translateY(-20px);
          top: 0;
          left: 0;
          transition: all 0.4s ease-in-out;
        }
        
        @media screen and (max-width: 1300px) {
          .attachmentTable tbody tr td.tdHover .attachmentAction a::after {
            height: 14px;
            width: 14px;
          }
        }
        .attachmentTable tbody tr td.tdHover .attachmentAction a:hover img {
          transform: translateY(20px);
        }
        
        .attachmentTable tbody tr td.tdHover .attachmentAction a:hover::after {
          transform: translateY(0);
        }
        
        .attachmentTable tbody tr:hover {
          background-color: #edf0f2;
          transition: 0.2s ease;
          cursor: pointer;
        }
        
        .attachmentTable tbody tr:hover td.tdHover .attachmentAction {
          opacity: 1;
        }
        
        .attachmentTable tbody tr .contentCell {
          display: -webkit-inline-box;
          display: -ms-inline-flexbox;
          display: inline-flex;
          -webkit-box-pack: start;
          -ms-flex-pack: start;
          justify-content: flex-start;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          padding-left: 10px;
          font-family: "Muli";
          font-weight: 700;
          font-size: 14px;
          max-width: 140px;
          min-height: 40px;
        }
        
        @media screen and (max-width: 1300px) {
          .attachmentTable tbody tr .contentCell {
            font-size: 10px;
            max-width: 100px;
          }
        }
        .attachmentTable tbody tr .contentCell.tableCell-2 {
          max-width: 300px;
        }
        
        .attachmentTable tbody tr .contentCell.tableCell-1 span {
          width: 20px;
          height: 24px;
        }
        
        .attachmentTable tbody tr .contentCell.tableCell-1 span img {
          width: 100%;
          height: 100%;
        }
        
        .attachmentTable tbody tr .contentCell a {
          font-size: 14px;
          line-height: 1.71;
          letter-spacing: -0.2px;
          color: #3e4352;
          display: block; 
          padding: 0 5px;
          font-family: "Open Sans";
          font-weight: normal;
        }
        
        @media screen and (max-width: 1300px) {
          .attachmentTable tbody tr .contentCell a {
            font-size: 11px;
          }
        }
        .attachmentTable tbody tr .contentCell p {
          font-family: "Open Sans";
          font-weight: normal;
          font-size: 14px;
          line-height: 1.71;
          letter-spacing: -0.2px;
          color: #3e4352;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        @media screen and (max-width: 1300px) {
          .attachmentTable tbody tr .contentCell p {
            font-size: 11px;
          }
        }
        #pdfLength {
          font-size: 14px;
          letter-spacing: -0.2px;
          color: #3e4352;
          padding-left: 32px;
          margin-bottom: 8px;
        }
        
        .attachmentTable tbody tr .contentCell.tableCell-4 {
          max-width: 185px;
        }
        
        .attachmentTable tbody tr .contentCell.tableCell-3 {
          min-width: 150px;
          max-width: 200px;
        }
        
        .attachmentTable tbody tr .contentCell.tableCell-4 {
          min-width: 185px;
          max-width: 250px;
        }
        
        .attachmentTable tbody tr .contentCell.tableCell-2 {
          padding: 0;
        }
        
        .attachmentTable tbody tr td.tdHover .attachmentAction a.attachPlus::after {
          background-image: url(../../images/plus-EpsHover.png);
        }
        
        .attachmentTable tbody tr td.tdHover .attachmentAction a.attachEdit::after {
          background-image: url(../../images/DesignmanagementHover.png);
        }
        
        .attachmentTable tbody tr td.tdHover .attachmentAction a.attachEye img {
          height: auto;
        }
        
        .attachmentTable tbody tr td.tdHover .attachmentAction a.attachEye::after {
          background-image: url(../../images/EyeShowHover.png);
          height: 11px;
          top: 3px;
        }
        
        .dropWrapper .attachmentTable .form-group {
          margin-bottom: 0;
        }
        
        .tableReports.attachmentTable tbody tr .contentCell {
          font-family: "Muli";
          font-weight: normal;
        }
        
        .tableReports.attachmentTable tbody tr .contentCell.tableCell-4 span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: "Muli";
          font-weight: 700;
        }
        
        .attachmentTable__items tbody tr td:first-child {
          max-width: 50px;
        }
        
        .attachmentTable__items tbody tr td .contentCell.tableCell-2 {
          padding-left: 16px;
        }
        
        .attachmentTable__items tbody tr td .contentCell.tableCell-2 span {
          white-space: nowrap;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .attachmentTable__fixedWidth.attachmentTable tbody tr td:first-child,
        .attachmentTable__fixedWidth.attachmentTable thead tr th:first-child {
          width: auto;
        }
        
        .attachmentTable.attachmentTableAuto tbody tr td {
          padding: 0 6px !important;
        }
        
        .attachmentTable tbody tr td {
          width: auto;
        }
        
        .removeTr div .pdfImage img {
          height: 20px;
        }
        
        .attachmentTable tfoot tr {
          height: 40px;
          background-color: #a8b0bf;
        }
        
        .attachmentTable tfoot tr td p {
          padding-left: 20px;
          font-size: 15px;
          font-weight: bold;
        }
        
        
        /**/
        .ui.header:last-child {
          margin-bottom: 0;
        }
        .ui.header:first-child {
          margin-top: -.14285714em;
        }
        .subiGrid .subiTable td h4 {
          display: flex;
        }
        h4.ui.header {
          font-size: 1.07142857rem;
        }
        .ui.image {
          position: relative;
          display: inline-block;
          vertical-align: middle;
          max-width: 100%;
          background-color: transparent;
        }
        .ui.header {
          border: none;
          margin: calc(2rem - .14285714em) 0 1rem;
          padding: 0 0;
          font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
          font-weight: 700;
          line-height: 1.28571429em;
          text-transform: none;
          color: rgba(0,0,0,.87);
        }
        
        .subiGrid .subiTable .ui.header>.image:not(.icon), .subiGrid .subiTable .ui.header>img {
          width: 16px;
          height: 16px;
        }
        .ui.image img, .ui.image svg {
          display: block;
          max-width: 100%;
          height: auto;
        }
        .ui.header>.image:not(.icon), .ui.header>img {
          display: inline-block;
          margin-top: .14285714em;
          width: 2.5em;
          height: auto;
          vertical-align: middle;
        }
        
        
        
        
        
        
        
        
        /**/
        
        .printWrapper {
          width: 595px;
          /* width: 750px; */
          margin: auto;
          box-shadow: 0 0 20px 7px #f1f1f1;
          padding-bottom: 50px;
          background: #fff;
        }
        
        .company__name {
          display: flex;
          padding-top: 28px;
          padding-left: 40px;
          margin-bottom: 29px;
          align-items: center;
        }
        
        .company__name .company__logo {
          width: 60px;
          height: 60px;
          border-radius: 30px;
          background-color: #e9ecf0;
          margin-right: 26px;
        }
        
        .company__name h3 {
          font-family: "Open Sans";
          font-weight: normal;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.4px;
          color: #4f515a;
          margin: 0;
        }
        
        .printGrid {
          padding-left: 126px;
          padding-right: 35px;
        }
        
        .printGrid .printHead h3 {
          font-family: "Open Sans";
          font-weight: 700;
          font-size: 18px;
          letter-spacing: -0.5px;
          color: #2c2e37;
          padding: 0;
        }
        
        .printGrid .printHead .divspans {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          font-family: "Open Sans";
          font-weight: normal;
          font-size: 11px;
          line-height: 2.18;
          letter-spacing: -0.2px;
          color: #a8b0bf;
        }
        
        .printGrid .subiTable td {
          padding-bottom: 16px;
          padding-right: 16px;
          letter-spacing: -0.2px;
          color: #3e4352;
          font-size: 12px;
          font-family: "Open Sans";
          font-weight: normal;
        }
        
        .printGrid .subiTable td h4 .content {
          font-size: 12px;
          font-family: "Open Sans";
          font-weight: 600;
          font-size: 12px;
          line-height: 2;
          letter-spacing: -0.2px;
          color: #3e4352;
        }
        
        .docStatus {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px 0 28px;
        }
        
        .docStatus .highClosed {
          width: 138px;
          height: 37px;
          border-radius: 18px;
          border: 1px solid #e9ecf0;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }
        
        .docStatus .highClosed span {
          font-family: "Open Sans";
          font-weight: 600;
          font-size: 11px;
          font-weight: normal;
          line-height: 1.45;
          letter-spacing: -0.3px;
          color: #3e4352;
        }
        
        .docStatus .highClosed span.redSpan {
          font-weight: 600;
          position: relative;
        }
        
        .docStatus .highClosed span.redSpan::after {
          content: "";
          position: absolute;
          top: 3px;
          left: -15px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: red;
        }
        
        .docStatus .requireDate span {
          font-family: "Open Sans";
          font-weight: 600;
          font-size: 12px;
          font-weight: normal;
          line-height: 2;
          letter-spacing: -0.2px;
          color: #3e4352;
        }
        
        .docStatus .requireDate span:first-child {
          font-weight: 600;
        }
        
        .printSecondPage hr {
          margin: 50px 30px 29px;
          border: 1px solid #e9ecf0;
        }
        
        .printSecondPage .company__name {
          justify-content: flex-start;
          flex-flow: row-reverse;
          padding-top: 25px;
          padding-right: 28px;
        }
        
        .printSecondPage .company__name .company__logo {
          width: 28px;
          height: 28px;
          margin-right: 0;
          margin-left: 8px;
        }
        
        .printSecondPage .company__name h3 {
          font-size: 8px;
          color: #a8b0bf;
        }
        
        .printSecondPage .attachmentTable thead {
          display: none;
        }
        
        .printSecondPage .workflowPrint {
          display: flex;
          align-items: center;
          height: 60px;
          padding: 16px 40px;
          justify-content: space-around;
        }
        
        .printSecondPage .workflowPrint .flowLevel {
          display: flex;
          align-items: center;
          width: 50%;
        }
        
        .printSecondPage .workflowPrint .flowLevel .flowNumber .stepLevel {
          width: 28px;
          height: 28px;
          background: #e9ecf0;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Open Sans";
          font-weight: normal;
          font-size: 13px;
          color: #5e6475;
        }
        
        .printSecondPage .workflowPrint .flowLevel .flowNumber .stepLevel.pendingLevel {
          color: #ccd2db;
        }
        
        .printSecondPage .workflowPrint .flowLevel .flowMember {
          display: flex;
          align-items: center;
        }
        
        .printSecondPage .workflowPrint .flowLevel .flowMember .smallAvatarSize {
          width: 28px;
          height: 28px;
          margin: 0 8px 0 12px;
        }
        
        .printSecondPage .workflowPrint .flowLevel .flowMember .FlowText h3 {
          font-family: "Open Sans";
          font-weight: normal;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.33;
          letter-spacing: -0.2px;
          color: #252833;
          margin: 0;
        }
        
        .printSecondPage .workflowPrint .flowLevel .flowMember .FlowText p {
          font-family: "Open Sans";
          font-weight: normal;
          font-size: 12px;
          line-height: 1.33;
          letter-spacing: -0.2px;
          color: #858d9e;
        }
        
        .printSecondPage .workflowPrint .flowStatus {
          display: flex;
          align-items: center;
          position: relative;
          min-width: 36%;
        }
        
        .printSecondPage .workflowPrint .flowStatus::after {
          content: "";
          position: absolute;
          left: -30px;
          width: 24px;
          height: 24px;
          background-size: 100% 100%;
        }
        
        .printSecondPage .workflowPrint .flowStatus.approvedStatue::after {
          background-image: url(../../images/approval.png);
        }
        
        .printSecondPage .workflowPrint .flowStatus.pendingStatue::after {
          background-image: url(../../images/pending.png);
        }
        
        .printSecondPage .workflowPrint .flowStatus .statueName {
          font-family: "Open Sans";
          font-weight: 600;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.67;
          letter-spacing: -0.2px;
          color: #252833;
        }
        
        .printSecondPage .workflowPrint .flowStatus .statueDate {
          font-family: "Open Sans";
          font-weight: 600;
          font-size: 10px;
          line-height: 1.6;
          letter-spacing: -0.2px;
          color: #858d9e;
          margin-left: 3px;
          margin-right: 12px;
        }
        
        .printSecondPage .workflowPrint .flowStatus .statueSignature {
          width: 50px;
          height: 30px;
        }
        
        .printSecondPage .workflowPrint .flowStatus .statueSignature img {
          width: 100%;
        }
        
        .printWrapper .subiGrid .subiTable {
          border-bottom: none;
        }
        
        .printWrapper .subiGrid {
          position: relative;
        }
        
        .printWrapper .subiGrid::after {
          content: "";
          position: absolute;
          right: 32px;
          left: 32px;
          height: 1px;
          background-color: #e9ecf0;
          bottom: 0;
        }
        
        .printWrapper #pdfLength {
          padding-left: 126px;
        }
        
        .printWrapper hr {
          margin: 50px 30px 29px;
          border: 1px solid #e9ecf0;
        }
        
        .printWrapper {
          width: 100% !important;
        }
        `
        link.appendChild(document.createTextNode(css));
        // link.setAttribute('href', "'../../Styles/scss/en-us/printStyle.css'");
        link.setAttribute("rel", "stylesheet");  

        var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
        frameDoc.document.open();
        frameDoc.document.write(contents);
        frameDoc.document.head.appendChild(link)
        frameDoc.document.close();

        setTimeout(function () {
            window.frames["iframePrint"].focus();
            window.frames["iframePrint"].print();
        }, 1000);
    }

    render() {
        return (
            <div id={'docExport'}   >
                {this.state.isLoading === true ? null :
                    <div className="dropWrapper">
                        <div className="proForm customProform">
                            <div className="fillter-status fillter-item-c">
                                <label className="control-label">{Resources.export[currentLanguage]}</label>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="vo-excel" defaultChecked={this.state.isExcel === false ? null : 'checked'} value={true} onChange={e => this.handleChange(true, 'isExcel')} />
                                    <label>{Resources.excel[currentLanguage]}</label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="vo-excel" defaultChecked={this.state.isExcel === false ? 'checked' : null} value={false} onChange={e => this.handleChange(false, 'isExcel')} />
                                    <label>{Resources.pdf[currentLanguage]}</label>
                                </div>
                            </div>
                            <div className="fillter-status fillter-item-c">
                                <label className="control-label">{Resources.design[currentLanguage]}</label>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="vo-executed" defaultChecked={this.state.isLandscape === false ? null : 'checked'} value="true" onChange={e => this.handleChange(true, 'isLandscape')} />
                                    <label>{Resources.landscape[currentLanguage]}</label>
                                </div>
                                <div className="ui checkbox radio radioBoxBlue">
                                    <input type="radio" name="vo-executed" defaultChecked={this.state.isLandscape === false ? 'checked' : null} value="true" onChange={e => this.handleChange(false, 'isLandscape')} />
                                    <label>{Resources.portrait[currentLanguage]}</label>
                                </div>
                            </div>
                        </div>
                        <div className="fullWidthWrapper">
                            <button className="primaryBtn-1 btn mediumBtn" type="button" onClick={e => this.ExportDocument('salaryTable', 'testTable', 'procoor ')}>{Resources["export"][currentLanguage]}</button>

                            <button className="primaryBtn-1 btn mediumBtn" type="button" onClick={e => this.PrintDocument()}>{Resources["print"][currentLanguage]}</button>
                        </div>
                        <div id="exportLink"></div>
                    </div>
                }

                {this.state.isLoading === true ?
                    <LoadingSection /> : null}

                <div style={{ display: 'none' }}>
                    {this.drawFields()}
                    {this.drawItems()}
                    {this.drawAttachments()}
                    {this.drawWorkFlow()}
                    {this.drawattachDocuments()}
                </div>

                <div style={{display: 'block'}}>
                {this.exportPDFFile()}
                </div>
                <div style={{display: 'none'}}>
                <iframe id="iframePrint" name="iframePrint">

                </iframe>
                </div>
            </div >
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
        docsAttachData: state.communication.docsAttachData,
        documentTitle: state.communication.documentTitle
        //docTypeId: state.communication.docTypeId,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportDetails);


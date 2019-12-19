import React, { Component, Fragment } from 'react'
import moment from "moment";
import Resources from '../../resources.json';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
            isExcel: "false",
            isLandscape: false,
            disNone: "disNone",
            isLoading: false,
            random: 0
        };

        this.ExportDocument = this.ExportDocument.bind(this);
        // this.exportPDFFile = this.exportPDFFile.bind(this);
    }

    ExportDocument(Fields, items, name) {
        if (this.state.isExcel == "false") {

            this.setState({
                isLoading: true
            });
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
                    }
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
    componentDidMount() {
        // this.ExportDocument('salaryTable', 'testTable', 'procoor ');
        // console.log(this.props.workFlowCycles);
    }

    // static getDerivedStateFromProps(nextProps, state) {
    //     let random = new Date().valueOf();
    //     if (random !== state.random) {
    //         return {
    //             random
    //         };
    //     }
    //     return null;

    // }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.random !== this.props.random) {
    //         this.ExportDocument('salaryTable', 'testTable', 'procoor ');
    //     }
    // }

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

    handleChange(e, field) {
        this.setState({
            [field]: e.target.value
        });
    }

    exportPDFFile() { 
        let formatData = moment(this.props.document.docDate).format('DD/MM/YYYY');
        let levels = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0].levels : [];
        let cycleWF = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0] : null;
        return (
            <div>
                <div id="printPdf" className="printWrapper">
                    <div className="company__name">
                        <span className="company__logo" style={{ background: 'transparent' }}> <img src="/static/media/logo.f73844e0.svg" alt="Procoor" title="Procoor" style={{ maxWidth: '100%' }} /></span>
                        <h3> {this.props.documentName}</h3>
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
                                                <span className="statueDate">{moment(cycle.creationDate).format('DD-MM-YYYY')}</span>
                                                <span className="statueSignature">
                                                    <img src={cycle.statusVal == null ? null : cycle.signature != null ? cycle.signature : Signature} alt="..." />
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Fragment>
                        : null
                    }
                </div>
            </div >
        )
    }

    render() {
        // let formatData = moment(this.props.document.docDate).format('DD/MM/YYYY')
        // let levels = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0].levels : []
        // let cycle = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles : {}

        return (
            <div id={'docExport'}   >
                {this.state.isLoading === true ? null :
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
                {this.state.isLoading === true ? this.exportPDFFile() : null}
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


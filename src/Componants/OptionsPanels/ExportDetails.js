import React, { Component, Fragment } from 'react'
import moment from "moment";
import Resources from '../../resources.json';

import DED from './DocumentExportDefination.json'
import { connect } from 'react-redux';
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
                return (<tr>
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
                <table id="items" style={{ border: 'double' }}>
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

    handleChange(e, field) {

        this.setState({
            [field]: e.target
        });
    }

    render() {
        return (
            <Fragment>
                <div className="dropWrapper">
                    <div className="proForm customProform">

                        <div className="fillter-status fillter-item-c undefined valid-input">
                            <label className="control-label">{Resources.export[currentLanguage]}</label>
                            <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="vo-excel" defaultChecked={this.state.isExcel === false ? null : 'checked'} value="true" onChange={e => this.handleChange(e, 'isExcel')} />
                                <label>{Resources.excel[currentLanguage]}</label>
                            </div>
                            <div className="ui checkbox radio radioBoxBlue">
                                <input type="radio" name="vo-excel" defaultChecked={this.state.isExcel === false ? 'checked' : null} value="false" onChange={e => this.handleChange(e, 'isExcel')} />
                                <label>{Resources.no[currentLanguage]}</label>
                            </div>
                        </div>
                        <div className="fillter-status fillter-item-c undefined valid-input">
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
                        <button className="primaryBtn-2 btn mediumBtn" type="button" onClick={e => this.tableToExcel('salaryTable', 'testTable', 'procoor ')}>{Resources["export"][currentLanguage]}</button>
                    </div>
                </div>
                <div style={{ display: 'none' }}>
                    {this.drawFiled()}
                    {this.drawItems()}
                    {this.drawAttachments()}
                    {this.drawWorkFlow()}
                    {this.drawattachDocuments()}
                </div>
            </Fragment>
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
        docTypeId: state.communication.docTypeId
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


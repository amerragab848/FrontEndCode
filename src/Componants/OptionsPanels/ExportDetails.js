import React, { Component, Fragment } from 'react'

import Signature from '../../Styles/images/mySignature.png';
import Moment from 'moment';
import Resources from '../../resources.json';

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
                + ' Procoor Document '
                + '</head > '
                + '<body>'
                + ' <table>{Fields}</table>'
                + ' <table>{items}</table> '
                + ' <table>{attachmentTable}</table>'
                + ' <table>{workflowCycles}</table> '
                + '</body></html > '
            , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }


        if (!Fields.nodeType) Fields = document.getElementById('Fields')
        if (!items.nodeType) items = document.getElementById('items')
        var attachmentTable = document.getElementById('attachmentTable')
        var workflowCycles = document.getElementById('workflowCycles')

        var ctx = {
            worksheet: 'procoor Export' || 'Worksheet', Fields: Fields.innerHTML, items: items.innerHTML,
            attachmentTable: attachmentTable.innerHTML,
            workflowCycles: workflowCycles.innerHTML
        }

        var blob = new Blob([format(template, ctx)]);
        var blobURL = window.URL.createObjectURL(blob);

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
        let rows = this.props.fields.map(field => {
            return (
                <tr>
                    <td style={{ backgroundColor: '#d6dde7' }}>
                        <h4 className="ui image header">
                            <div className="content">{field.name} :</div>
                        </h4>
                    </td>
                    <td><span>{field.value}</span></td>
                </tr>
            )
        });
        return (
            <table id="Fields" className="subiTable">
                <tbody>
                    {/* <tr rowSpan="2">
                        <td colSpan="4">
                            <span>Letter Document</span>
                        </td>
                    </tr> */}
                    {rows}
                </tbody>
            </table>
        )
    }
    drawItems() {
        return (
            <table id="items" style={{ border: 'double' }}>
                <thead valign="top">
                    <tr>
                        <td colSpan="7">
                            <span>  Document Cycles</span>
                        </td>
                    </tr>
                    <tr style={{ border: '4px' }}>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}> ID</th>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>Name ö,ü,ö</th>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>ACP</th>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>OEMCP</th>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>Windows NT 3.1</th>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>Windows NT 3.51</th>
                        <th style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>Windows 95</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.items.map(field => {
                        return (
                            <tr>
                                <td>{field.value}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        )
    }

    drawAttachments() {
        return (

            <table className="attachmentTable" id="attachmentTable">
                <thead>
                    <tr>
                        <td colSpan="3"><span>Attachments</span></td>
                    </tr>
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

    drawWorkFlow() {
        console.log('this.props.workFlowCycles', this.props.workFlowCycles)
        let levels = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0].levels : []
        return (
            <table id="workflowCycles" className="printWrapper printSecondPage" style={{ marginTob: '10px' }} >
                <tbody>
                    {levels.length > 0 ?
                        <Fragment >
                            <tr rowSpan="2">
                                <td colSpan="5">
                                    <span> {this.props.workFlowCycles[0].subject} at Level: {this.props.workFlowCycles[0].currentLevel} - Sent in: {Moment(this.props.workFlowCycles[0].creationDate).format('DD-MM-YYYY')} </span>
                                </td>
                            </tr>
                            <tr className="workflowPrint">

                                {levels.map(cycle => {
                                    return (
                                        <td className="flowNumber">
                                            <div className="FlowText">
                                                <h3>{cycle.contactName}</h3>
                                                <p style={{ width: '24px', height: '24px', backgroundColor: '#86939e', borderRadius: '50%', top: '-12px', textAlign: 'center', paddingTop: '3px', left: '12px' }}>{cycle.arrange}</p>
                                                <span className=" statueName">{cycle.status}</span>
                                                <span className="statueDate">{Moment(cycle.creationDate).format('DD-MM-YYYY')}</span>
                                                <p>{cycle.companyName}</p>
                                            </div>
                                            <span >
                                                {cycle.statusVal != null ? <div className="card-signature">
                                                    <img src={cycle.signature != null ? cycle.signature : Signature} alt="..." />
                                                </div> : null}
                                            </span>
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

    handleChangeItem(e, field) {

        this.setState({
            [field]: e.target
        });
    }

    render() {
        return (
            <Fragment>
                <div className="dropWrapper">
                    <div className="proForm datepickerContainer fullWidthWrapper textLeft">

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


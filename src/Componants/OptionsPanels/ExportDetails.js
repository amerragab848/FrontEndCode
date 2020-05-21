import React, { Component, Fragment } from 'react'
import moment from "moment";
import Resources from '../../resources.json';
import DED from './DocumentExportDefination.json'
import { connect } from 'react-redux';
import LoadingSection from '../publicComponants/LoadingSection'
import Signature from '../../Styles/images/mySignature.png';
import declined from '../../Styles/images/declined.png';
import approval from '../../Styles/images/approval.png';
import pending from '../../Styles/images/pending.png';

import Config from "../../Services/Config";
import { bindActionCreators } from 'redux';
import * as communicationActions from '../../store/actions/communication';
import Dataservice from '../../Dataservice.js';
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import printDocuments from "./printDocuments.json";
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
      random: 0,
      selectHeader: { label: Resources.header[currentLanguage], value: "0" },
      selectFooter: { label: Resources.footer[currentLanguage], value: "0" },
      headerList: [],
      footerList: [],
      headerPath: null,
      footerPath: null,
      rowsDocument: [3, 4, 5, 8, 12],
      rowsbackground: [3, 4, 12],
      rowspercentage: [6, 7]
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
          + ' <table>{Fields}</table><table> <h6>Document Cycles </h6></table> '
          + ' <table>{items}</table><table> <h6> Attachments </h6></table> '
          + ' <table>{attachmentTable}</table>   <table><h6>   </table> '
          + ' <table>{workflowCycles}</table>   <table> Doc. Attachments </table> '
          + ' <table>{docAttachments}</table>     '
          + '</body></html > '
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

      var Fields = '', items = '', attachmentTable = '', workflowCycles = '', docAttachments = '';
      if (!'Fields'.nodeType) Fields = document.getElementById('Fields').innerHTML

      if (this.props.items.length) items = this.props.docTypeId == 120 ? document.getElementById('interimPaymentCertificate').innerHTML : document.getElementById('items').innerHTML

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
    Dataservice.GetDataList("GetHeaderFooterByType?projectId=" + this.props.document.projectId + "&type=Header", "description", "pathImg").then(result => {
      this.setState({
        headerList: result
      });
    });

    Dataservice.GetDataList("GetHeaderFooterByType?projectId=" + this.props.document.projectId + "&type=Footers", "description", "pathImg").then(result => {
      this.setState({
        footerList: result
      });
    });
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

  paymentItems() {
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
      let nextIndex = (index + 1);
      let formatData = field.type == "D" ? moment(data[field.value]).format('DD/MM/YYYY') : data[field.value]
      if ((index % 2) === 0) {
        let notExist = find(filedsIgnor, function (x) { return x == field.name })
        return (!notExist ?
          <tr key={index}>
            <td>
              <div class="td__wrapper">
                <h4 class="ui image header">
                  <div class="content"> {Resources[field.name][currentLanguage]} :</div>
                </h4>
                <span>{formatData}</span>
              </div>
            </td>
            {nextIndex < fields.fields.length ?
              <>
                <td style={{ fontSize: '10px', maxHeight: '31px', paddingBottom: '0', paddingTop: 0 }}>
                  <div class="td__wrapper">
                    <h4 class="ui image header">
                      <div class="content"> {Resources[fields.fields[nextIndex].name][currentLanguage]} :</div>
                    </h4>
                    <span> {fields.fields[nextIndex]["type"] == "D" ? moment(data[fields.fields[nextIndex]["value"]]).format("DD/MM/YYYY") : data[fields.fields[nextIndex]["value"]]}</span>
                  </div>
                </td>
              </>
              : null}
          </tr>
          : null
        )
      }
    });

    return (
      <table id="Fields">
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }


  drawFields_Payment_pdf() {

    let fields = DED[this.props.docTypeId]
    let data = this.props.document
    let rows = fields.fields.map((field, index) => {
      let nextIndex = (index + 1);
      if ((index % 2) === 0) {

        let formatData = field.type == "D" ? moment(data[field.value]).format('DD/MM/YYYY') : field.name === 'percentageOfWorkDone' ? data[field.value].toFixed(2) : data[field.value]

        let notExist = find(filedsIgnor, function (x) { return x == field.name })
        return (!notExist ?
          <tr key={index}>
            <td>
              <div class="td__wrapper">
                <h4 class="ui image header">
                  <div class="content"> {Resources[field.name][currentLanguage]} :</div>
                </h4>
                <span>{formatData}</span>
              </div>
            </td>
            {nextIndex < fields.fields.length ?

              <Fragment>
                <td style={{ fontSize: '10px', maxHeight: '31px', paddingBottom: '0', paddingTop: 0 }}>
                  <div class="td__wrapper">
                    <h4 class="ui image header">
                      <div class="content"> {Resources[fields.fields[nextIndex].name][currentLanguage]} :</div>
                    </h4>
                    <span> {fields.fields[nextIndex]["type"] == "D" ? moment(data[fields.fields[nextIndex]["value"]]).format("DD/MM/YYYY") : data[fields.fields[nextIndex]["value"]]}</span>
                  </div>
                </td>
              </Fragment>
              : null
            }
          </tr>
          : null
        )
      }
    });

    return (
      <table id="Fields_PDF_Payment">
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
                        <p className="zero">{file.uploadedBy}</p>
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

  drawAttachments_Letter() {

    return (
      this.props.files.length > 0 ?
        <Fragment>
          <div className="print__jobs">
            <h3>Attachments:</h3>
            <div>
              {this.props.files.map((file, index) => {
                return (
                  <p><span>{(index + 1) + '-'}</span> {file.fileNameDisplay}</p>
                )
              })}
            </div>
          </div>
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
    this.setState({
      [field]: value
    });
  }

  exportPDFFile() {
    if (this.state.isExcel === true) return;

    let formatData = moment(this.props.document.docDate?this.props.document.docDate:this.props.document.documentDate).format('DD/MM/YYYY');
    let levels = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0].levels : [];
    let cycleWF = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0] : null;
    return (
      <div id="invoice" className="invoice">
        <div id="printPdf" className="printWrapper">
          {this.state.headerPath != null ?
            <div className="company__name  company__name--image">
              <img src={this.state.headerPath} alt="Procoor" title="Procoor" style={{ maxWidth: '100%' }} />
            </div>
            : null
          }
          <div className="subiGrid printGrid">
            <div className="printHead" style={{ paddingTop: this.state.headerPath != null ? '0' : '25px', marginBottom: this.props.docTypeId == 120 ? '20px' : 0 }}>
              <h3 className="zero"> {this.props.documentName} </h3>
            </div>
            {this.props.docTypeId == 120 ? null :
              <div className="docStatus">
                <div className="highClosed">
                  <span className="subiStatus">{Resources.status[currentLanguage]} </span>
                  <span className="subiPriority redSpan"> {this.props.document.status == true ? 'Opened' : 'Closed'}</span>
                </div>
                <div className="requireDate">
                  <span>{Resources.docDate[currentLanguage] + ' '}</span>
                  <span>{formatData}</span>
                </div>
              </div>}
            <div className="subiTable subCutomeTable">
              {this.drawFields_pdf()}
            </div>
          </div>

          {this.props.items.length > 0 ?

            < div className="table__withItem">{this.drawItems_pdf()}
            </div>
            : null
          }
          {this.drawAttachments_pdf()}

          {this.drawattachDocuments_pdf()}
          {this.props.workFlowCycles.length > 0 ?
            <Fragment>
              {/* <p id="pdfLength" style={{ paddingLeft: '0' }}><span>{cycleWF.subject}</span><span>{" at Level: " + cycleWF.currentLevel}</span><span> {" Sent:" + moment(cycleWF.creationDate).format('DD-MM-YYYY')}</span></p> */}
              <div className=" printSecondPage">
                {this.drawWorkFlowCycles()}
              </div>
              <div class="newPrint__workflow--comment">
                <h3>WorkFlow Notes</h3>
                {this.drawWorkFlowComment()}
              </div>
            </Fragment>
            : null
          }
          {this.state.footerPath != null ?
            <div className="footer_print">
              <img src={this.state.footerPath} alt="Logo" />
            </div>
            : null
          }

        </div>
      </div >

    )
  }

  PrintPDFPaymentCertified() {
    //if (this.state.isExcel === true) return;

    return (
      <div id="PCertified" className="invoice">
        <div id="printPdf" className="printWrapper">
          {this.state.headerPath != null ?
            <div className="company__name  company__name--image">
              <img src={this.state.headerPath} alt="Procoor" title="Procoor" style={{ maxWidth: '100%' }} />
            </div>
            : null
          }
          <div className="subiGrid printGrid" style={{ paddingLeft: '30px', paddingRight: '30px' }}>
            <div className="printHead" style={{ paddingTop: this.state.headerPath != null ? '0' : '25px', marginBottom: '20px' }}>
              <h3 className="zero"> {this.props.documentName} </h3>
            </div>

            <div className="subiTable subCutomeTable">
              {this.drawFields_Payment_pdf()}
            </div>
          </div>

          {this.props.items.length > 0 ?
            < div className="table__withItem">{this.drawItemOfPaymentCertification()} </div>
            : null}

          {this.drawAttachments_pdf()}
          {this.drawattachDocuments_pdf()}
          {this.drawWorkFlowCycles()}

          {this.state.footerPath != null ?
            <div className="footer_print">
              <img src={this.state.footerPath} alt="Logo" />
            </div>
            : null
          }
        </div>
      </div>

    )
  }

  drawWorkFlowCycles() {

    let levels = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0].levels : [];
    let cycleWF = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0] : null;
    return (
      this.props.workFlowCycles.length > 0 ?
        <Fragment>
          <p id="pdfLength"><span>{cycleWF.subject}</span><span>{" at Level: " + cycleWF.currentLevel}</span><span> {" Sent:" + moment(cycleWF.creationDate).format('DD-MM-YYYY')}</span></p>
          <div className="newPrint__workflow" style={{ margin: '15px 0', width: '100%' }}>
            {levels.map((cycle, index) => {
              return (
                <div key={'row- ' + index} className="newPrint__workflow--container">
                  <div className="newPrint__workflow--cycle">
                    <span className="workflow__level">{cycle.arrange}</span>
                    <div className="workflow__item">
                      <span>
                        <h3 className="zero">{cycle.contactName}</h3>
                        <p className="zero">{cycle.companyName}</p>
                      </span>
                      {cycle.signature != null ?
                        <div className="signature_img">
                          <img src={cycle.signature != null ? Config.getPublicConfiguartion().downloads + "/" + cycle.signature : Signature} alt="..." />
                        </div> : null}
                      <div className="workflow__statue">
                        <h5 className="zero">
                          <img style={{ margin: '0 3px' }} src={cycle.statusVal == null ? pending : cycle.statusVal === true ? approval : declined} />
                          {cycle.status}</h5>
                        <p>{moment(cycle.date).format('DD-MM-YYYY')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Fragment>
        : null
    )
  }

  drawWorkFlowComment() {

    let levels = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0].levels : [];
    let cycleWF = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0] : null;
    return (
      this.props.workFlowCycles.length > 0 ?
        <>
          {levels.map((cycle, index) => {
            return (
              cycle.comment === null || cycle.comment === "" ? null :
                <div class="workflow__comment">
                  <span>{cycle.arrange}</span>
                  <p><q>{cycle.contactName}</q> {cycle.comment}</p>
                </div>
            )
          })}
        </>
        : null
    )
  }

  drawFields_Letter() {
    let fields = DED[this.props.docTypeId]
    let data = this.props.document
    let projectName = this.props.document.projectName

    let rows = fields.fields.map((field, index) => {

      if (field.showInMainFields === false) return;

      let formatData = "";
      if (field.isConact === false) {
        formatData = field.type == "D" ? moment(data[field.value]).format('DD/MM/YYYY') : data[field.value]
      } else {
        formatData = "";
        field.fields.map(f => {
          formatData = (formatData !== "" ? formatData + "-" : "") + data[f.value]
        })
      }
      let notExist = find(filedsIgnor, function (x) { return x == field.name })
      return (!notExist ?
        <tr key={index}>
          <td>
            <h4 className="ui image header ">
              <div className="content">
                {Resources[field.name][currentLanguage]}
              </div>
            </h4>
          </td>
          <td>
            <p>
              {formatData}
            </p>
          </td>
        </tr>
        : null
      )
    });
    return (
      <table >
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }

  drawFields_Payment() {
    let fields = DED[this.props.docTypeId]
    let data = this.props.document
    let projectName = this.props.document.projectName

    let rows = fields.fields.map((field, index) => {

      if (field.showInMainFields === false) return;

      let formatData = "";
      if (field.isConact === false) {
        formatData = field.type == "D" ? moment(data[field.value]).format('DD/MM/YYYY') : data[field.value]
      } else {
        formatData = "";
        field.fields.map(f => {
          formatData = (formatData !== "" ? formatData + "-" : "") + data[f.value]
        })
      }
      let notExist = find(filedsIgnor, function (x) { return x == field.name })
      return (!notExist ?
        <tr key={index}>
          <td>
            <h4 className="ui image header ">
              <div className="content">
                {Resources[field.name][currentLanguage]}
              </div>
            </h4>
          </td>
          <td>
            <p>
              {formatData}
            </p>
          </td>
        </tr>
        : null
      )
    });
    return (
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }

  exportLetterFile() {
    if (this.state.isExcel === true) return;

    let formatData = moment(this.props.document.docDate).format('DD/MM/YYYY');
    let levels = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0].levels : [];
    let cycleWF = this.props.workFlowCycles.length > 0 ? this.props.workFlowCycles[0] : null;
    const propsLetters = {
      dangerouslySetInnerHTML: { __html: this.props.document.message },
    };
    return (
      <div id="Letter" className="invoice">
        <div className="printWrapper printSecondPage">
          <Fragment>
            {this.state.headerPath != null ?
              <div className="company__name  company__name--image">
                <img src={this.state.headerPath} alt="Procoor" title="Procoor" style={{ maxWidth: '100%' }} />
              </div>
              : null
            }
            <div className=" newPrintGrid">
              <div className="printHead">
                <h3 className="zero"> {Resources[this.props.documentName][currentLanguage]} </h3>
                <div className="divspans">
                  <div>
                    <span>{formatData}</span>
                    <span>  {'- #' + this.props.document.refDoc != null ? this.props.document.refDoc : 'No Reference'}</span>
                  </div>
                </div>
              </div>
              <div className="newPrintGrid__table">
                {this.drawFields_Letter()}
              </div>
            </div>

            <div className="divPoints">
              <ul>
                <li {...propsLetters} ></li>
              </ul>
            </div>

            {this.drawWorkFlowCycles()}
            <div class="newPrint__workflow--comment">
              <h3>WorkFlow Notes</h3>
              {this.drawWorkFlowComment()}
            </div>
            {this.drawAttachments_Letter()}
            {this.state.footerPath != null ?
              <div className="footer_print">
                <img src={this.state.footerPath} alt="Logo" />
              </div>
              : null
            }
            <p className="under__footer">Generated by and through ProCoor system.</p>
          </Fragment>
        </div>
      </div>
    )
  }

  PrintDocument() {

    this.setState({
      isExcel: false
    });

    var contents = document.getElementById("invoice").innerHTML;
    var frame1 = document.getElementById('iframePrint');
    var link = document.createElement('style');
    var css = printDocuments.cssEn;
    link.appendChild(document.createTextNode(css));
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

  PrintLetter() {

    this.setState({ isExcel: false });

    var contents = document.getElementById("Letter").innerHTML;
    var frame1 = document.getElementById('iframePrint');
    var link = document.createElement('style');

    var css = printDocuments.cssEnLetter;
    //var css = ``
    link.appendChild(document.createTextNode(css));
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

  PrintPaymentCertification() {

    this.setState({ isExcel: false });

    var contents = document.getElementById("PCertified").innerHTML;
    var frame1 = document.getElementById('iframePrint');
    var link = document.createElement('style');

    var css = printDocuments.cssEn;
    //var css = ``
    link.appendChild(document.createTextNode(css));
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

  handleChangeDropDownContract(event, field, selectedValue) {
    if (event == null) return;
    this.setState({
      [field]: event.value,
      [selectedValue]: event
    });

  }

  drawItemOfPaymentCertification() {
    return (
      <Fragment>
        <table className="attachmentTable attachmentTable__items attachmentTableAuto specialTable specialTable__certifiy" key="interimPaymentCertificate" id="interimPaymentCertificate">
          <thead>
            <tr style={{ backgroundColor: '#fafbfc', borderTop: '1px solid #e9ecf0', borderBottom: '1px solid #e9ecf0 ' }}>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderTop: '1px solid #e9ecf0', borderRight: '1px solid #e9ecf0 ', minWidth: '215px' }} colSpan="3">
                <div className="headCell">
                  {Resources["description"][currentLanguage]}
                </div>
              </th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderTop: '1px solid #e9ecf0', borderRight: '1px solid #e9ecf0 ' }} colSpan="3">
                <div className="headCell">
                  {Resources["contractAmount"][currentLanguage]}
                </div>
              </th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderTop: '1px solid #e9ecf0', borderRight: '1px solid #e9ecf0 ', textAlign: 'center' }} colSpan="3">
                <div className="headCell" >
                  {Resources["submitted"][currentLanguage]}
                </div>
              </th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderTop: '1px solid #e9ecf0', borderRight: '1px solid #e9ecf0 ', textAlign: 'center' }} colSpan="3">
                <div className="headCell">
                  {Resources["approved"][currentLanguage]}
                </div>
              </th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderTop: '1px solid #e9ecf0', borderRight: '1px solid #e9ecf0 ' }} colSpan="3">
                <div className="headCell">
                  {Resources["totalDeduction"][currentLanguage]}
                </div>
              </th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderTop: '1px solid #e9ecf0', borderRight: '1px solid #e9ecf0 ' }} colSpan="3">
                <div className="headCell">
                  {Resources["remarks"][currentLanguage]}
                </div>
              </th>
            </tr>
            <tr style={{ backgroundColor: '#fafbfc' }}>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="3"></th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="3"></th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="1">
                <div className="headCell">
                  {Resources["previous"][currentLanguage]}
                </div>
              </th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="1">
                <div className="headCell">
                  {Resources["current"][currentLanguage]}
                </div>
              </th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="1">
                <div className="headCell">
                  {Resources["total"][currentLanguage]}
                </div>
              </th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="1">
                <div className="headCell">
                  {Resources["previous"][currentLanguage]}
                </div>
              </th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="1">
                <div className="headCell">
                  {Resources["current"][currentLanguage]}
                </div>
              </th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="1">
                <div className="headCell">
                  {Resources["total"][currentLanguage]}
                </div>
              </th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="3"></th>
              <th style={{ position: 'unset', height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="3"></th>
            </tr>
          </thead>
          <tbody>{this.props.items.map((i, index) => (
            <tr key={i.id} style={{ height: '25px', background: this.state.rowsbackground.indexOf(i.refCode) > -1 ? '#edf0f2' : '' }}>
              <td style={{ height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ', minWidth: '215px', maxWidth: 'unset', width: '215px' }} colSpan="3" style={{}}>
                <div className="contentCell  " style={{ minHeight: 'unset', height: '25px', maxHeight: '25px' }} >
                  <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '', maxWidth: 'unset', width: '215px', overflow: 'visible' }}>{i.description}{this.state.rowspercentage.indexOf(i.refCode) > -1 ? ' %' : ''}</p>
                </div>
              </td>
              <td style={{ height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="3">
                <div className="contentCell  " style={{ minHeight: 'unset', height: '25px', maxHeight: '25px' }} >
                  <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.contractAmount.toLocaleString()}</p>
                </div>
              </td>
              <td style={{ height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="1">
                <div className="contentCell" style={{ minHeight: 'unset', height: '25px', maxHeight: '25px' }}>
                  <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.contractorPrevoiuse.toLocaleString()}</p>
                </div>
              </td>
              <td style={{ height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="1">
                <div className="contentCell" style={{ minHeight: 'unset', height: '25px', maxHeight: '25px' }}>
                  <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.contractorCurrentValue.toLocaleString()}</p>
                </div>
              </td>
              <td style={{ height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="1">
                <div className="contentCell" style={{ minHeight: 'unset', height: '25px', maxHeight: '25px' }}>
                  <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.contractorTotal.toLocaleString()}</p>
                </div>
              </td>
              <td style={{ height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="1">
                <div className="contentCell" style={{ minHeight: 'unset', height: '25px', maxHeight: '25px' }}>
                  <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.prevoiuse.toLocaleString()}</p>
                </div>
              </td>
              <td style={{ height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="1">
                <div className="contentCell" style={{ minHeight: 'unset', height: '25px', maxHeight: '25px' }}>
                  <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.currentValue.toLocaleString()}</p>
                </div>
              </td>
              <td style={{ height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="1">
                <div className="contentCell" style={{ minHeight: 'unset', height: '25px', maxHeight: '25px' }}>
                  <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}>{i.total.toLocaleString()}</p>
                </div>
              </td>
              <td style={{ height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="3">
                <div className="contentCell" style={{ minHeight: 'unset', height: '25px', maxHeight: '25px' }}>
                  <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '', color: i.totalDeduction != 0 ? 'red' : '' }}> {i.totalDeduction.toLocaleString()}{this.state.rowspercentage.indexOf(i.refCode) > -1 ? ' %' : ''}</p>
                </div>
              </td>
              <td style={{ height: '25px', borderBottom: '1px solid #e9ecf0 ', borderRight: '1px solid #e9ecf0 ' }} colSpan="3">
                <div className="contentCell" style={{ minHeight: 'unset', height: '25px', maxHeight: '25px' }}>
                  <p style={{ fontWeight: this.state.rowsDocument.indexOf(i.refCode) > -1 ? 'bold' : '' }}> {i.remarks}</p>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </Fragment>
    )
  }

  render() {
    return (
      <div id={'docExport'}>
        {this.state.isLoading === true ? null :
          <div className="dropWrapper readOnly__disabled ">
            <div className="proForm customProform">
              <Dropdown title="header"
                data={this.state.headerList}
                selectedValue={this.state.selectHeader}
                handleChange={event => this.handleChangeDropDownContract(event, "headerPath", "selectHeader")}
                index="headerPath"
                isClear={false}
                name="headerPath"
              />
              <Dropdown title="footer"
                data={this.state.footerList}
                selectedValue={this.state.selectFooter}
                handleChange={event => this.handleChangeDropDownContract(event, "footerPath", "selectFooter")}
                index="footerPath"
                isClear={false}
                name="footerPath"
              />
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
              <button className={"primaryBtn-1 btn mediumBtn " + (this.state.isExcel === true ? "" : ' disabled')} type="button" onClick={e => this.ExportDocument('salaryTable', 'testTable', 'procoor ')}>{Resources["export"][currentLanguage]}</button>
              {this.props.docTypeId != 120 ? null : <button className={"defaultBtn btn mediumBtn " + (this.state.isExcel == true ? " disabled" : "")} type="button" onClick={e => this.PrintPaymentCertification()}>{Resources["print"][currentLanguage] + '-' + Resources.paymentCertificationLog[currentLanguage]}</button>}
              {this.props.docTypeId == 19 ? <button className={"defaultBtn btn mediumBtn " + (this.state.isExcel == true ? " disabled" : "")} type="button" onClick={e => this.PrintLetter()}>{Resources["print"][currentLanguage] + '-' + Resources.lettertitle[currentLanguage]}</button> : null}
              {this.props.docTypeId == 19 || this.props.docTypeId == 120 ? null : <button className={"defaultBtn btn mediumBtn " + (this.state.isExcel == true ? " disabled" : "")} type="button" onClick={e => this.PrintDocument()}>{Resources["print"][currentLanguage]}</button>
              }
            </div>
            <div id="exportLink"></div>
          </div>
        }

        {this.state.isLoading === true ? <LoadingSection /> : null}
        {/* excel export */}
        <div style={{ display: 'none' }}>
          {/* {this.props.docTypeId != 19 ? this.drawFields() : null} */}
          {this.drawFields()}
          {this.props.docTypeId != 120 ? this.drawItems() : null}

          {this.drawAttachments()}
          {this.drawWorkFlow()}
          {this.drawattachDocuments()}
        </div>

        <div style={{ display: 'none' }}>

          {this.props.docTypeId == 19 || this.props.docTypeId == 120 ? null : this.exportPDFFile()}
          {this.props.docTypeId == 120 ? this.PrintPDFPaymentCertified() : null}
          {this.props.docTypeId == 19 ? this.exportLetterFile() : null}
        </div>

        <div style={{ display: 'none' }}>
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
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(communicationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportDetails);


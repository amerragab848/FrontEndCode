import React, { Component, Fragment } from 'react';
import moment from "moment";

class ExportReportCenterDetails extends Component {

    constructor(props) {
        super(props);

        this.ExportDocument = this.ExportDocument.bind(this);
    }

    ExportDocument() {

        let documentName = this.props.fileName;

        var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns: o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">'
                + '<head> '
                + '<style>td {border: 0.5pt solid #c0c0c0} .tRight {text - align: right} .tLeft {text - align: left} </style>'
                + '<xml><x: ExcelWorkbook><x: ExcelWorksheets><x: ExcelWorksheet><x: Name>{worksheet}</x: Name><x: WorksheetOptions><x: DisplayGridlines/></x: WorksheetOptions></x: ExcelWorksheet ></x: ExcelWorksheets ></x: ExcelWorkbook ></xml >'
                + '<meta http-equiv="content-type" content="text/plain; charset=UTF-8" />'
                + '<h2>' + documentName + '</h2>'
                + '</head > '
                + '<body>'
                + ' <table>{Fields}</table><table> <h6>Documents </h6></table> '
                + ' <table>{items}</table> '
                + '</body></html > '
            , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

        var Fields = '', items = '';
        if (!'Fields'.nodeType) Fields = document.getElementById('Fields').innerHTML

        if (this.props.rows.length) { items = document.getElementById('items').innerHTML }


        var ctx = {
            name: 'procoor Export',
            Fields: Fields,
            items: items
        }

        var blob = new Blob([format(template, ctx)]);
        if (this.ifIE()) {
            //csvData = table.innerHTML;
            if (window.navigator.msSaveBlob) {
                var blob = new Blob([format(template, ctx)], {
                    type: "text/html"
                });
                return navigator.msSaveBlob(blob, '' + ctx.name + '.xls');
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

    drawFields() {
        let fields = this.props.fields;

        let rows = fields.map((field, index) => {
            let data = field.type == "D" ? moment(field.value).format('DD/MM/YYYY') : field.value

            return (<tr key={index}>
                <Fragment>
                    <td><span>{data}</span></td>
                    <td style={{ backgroundColor: '#f3f6f9' }}>
                        <h4 className="ui image header">
                            <div className="content">{field.title} :</div>
                        </h4>
                    </td>
                </Fragment>
            </tr>
            )
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
        let rows = this.props.rows;
        let fieldsItems = this.props.fieldsItems;

        if (rows.length > 0) {
            return (
                <table id="items" style={{ border: 'double' }}>
                    <thead valign="top">
                        <tr key={'dd- '} style={{ border: '4px' }}>
                            {fieldsItems.map((column, index) => {
                                return (
                                    <th key={'dddd- ' + index} style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}>{column.title}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => {
                            return (
                                <tr key={'rwow- ' + index}>
                                    {fieldsItems.map((field, index) => {
                                        return (<td key={'field- ' + index}>{field.type === "date" ? moment(row[field.field]).format('DD/MM/YYYY') : row[field.field]}</td>)
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )
        }
    }

    render() {
        return (
            <div id={'docExport'}>
                <div className="dropWrapper readOnly__disabled ">
                    <div className="fullWidthWrapper">
                        <button className="primaryBtn-1 btn mediumBtn" type="button" onClick={e => this.ExportDocument()}>{"Export"}</button>
                    </div>
                    <div id="exportLink"></div>
                </div>

                {/* excel export */}
                <div style={{ display: 'none' }}>

                    {this.drawFields()}
                    {this.drawItems()}
                </div>

                <div style={{ display: 'none' }}>
                    <iframe id="iframePrint" name="iframePrint">
                    </iframe>
                </div>
            </div >
        )
    }
}

export default ExportReportCenterDetails;


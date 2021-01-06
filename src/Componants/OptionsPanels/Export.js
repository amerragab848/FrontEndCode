import React, { Component, Fragment } from 'react'
import Resources from '../../resources.json';
import Config from '../../Services/Config.js';
import { toast } from "react-toastify";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class Export extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: this.props.rows,
            columns: this.props.columns,
            fileName: this.props.fileName,
            isExport: false,
            isExportRequestPayment: this.props.isExportRequestPayment
        }
    }

    tableToExcel(title) {
        if (this.state.isExport || this.state.isExportRequestPayment) {

            var uri = 'data:application/vnd.ms-excel;base64,'
                , template = '<html xmlns: o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">'
                    + '<head> '
                    + '<style>td {border: 0.5pt solid #c0c0c0} .tRight {text - align: right} .tLeft {text - align: left} </style>'
                    + '<xml><x: ExcelWorkbook><x: ExcelWorksheets><x: ExcelWorksheet><x: Name>{worksheet}</x: Name><x: WorksheetOptions><x: DisplayGridlines/></x: WorksheetOptions></x: ExcelWorksheet ></x: ExcelWorksheets ></x: ExcelWorkbook ></xml >'
                    + '<meta http-equiv="content-type" content="text/plain; charset=UTF-8" />'
                    + '<h2> ' + title + ' </h2>'
                    + '</head > '
                    + '<body>'
                    + ' <table>{items}</table>'
                    + '</body></html > '
                , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
                , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

            var items = '';
            if (this.props.rows.length) {
                items = document.getElementById('items').innerHTML;

            }
            var ctx = {
                name: this.state.fileName,
                items: items
            }

            var blob = new Blob([format(template, ctx)]);
            this.setState({ isExpor: false, isExportRequestPayment: this.props.isExportRequestPayment })
            var a = document.createElement('a');
            document.body.appendChild(a);
            if (window.navigator.msSaveBlob) {
                var blob = new Blob([format(template, ctx)], {
                    type: "application/vnd.ms-excel"
                });
            }
            a.href = URL.createObjectURL(blob);
            a.download = 'procoor-' + title + ".xls";
            a.click();
            // lazy cleanup, note that this renders the link invalid
            setTimeout(() => { URL.revokeObjectURL(a.href); }, 500);
        }
    }

    componentDidMount() {
        if (this.state.isExportRequestPayment) {
            this.tableToExcel(this.state.fileName);
        }
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.rows !== state.rows && nextProps.isExportRequestPayment === state.isExportRequestPayment) {
            return {
                rows: nextProps.rows,
                isExportRequestPayment: nextProps.isExportRequestPayment,
            };
        }
        return null
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.isExport !== this.state.isExport) {
            this.tableToExcel(this.props.fileName);
        }
        if (prevState.isExportRequestPayment !== this.state.isExportRequestPayment) {
            this.tableToExcel(this.props.fileName);
        }
    }

    ifIE() {
        var isIE11 = navigator.userAgent.indexOf(".NET CLR") > -1;
        var isIE11orLess = isIE11 || navigator.appVersion.indexOf("MSIE") != -1;
        this.setState({ isExport: false })
        return isIE11orLess;
    }

    drawItems() {
        let fieldsItems = this.props.columns;

        let rows = this.props.rows.length > 0 ?
            (this.props.rows.map((row, index) => {
                return (
                    <tr key={index}>
                        {fieldsItems.map((field, index) => {
                            return (<td key={index + "td"}>{row[field.field]}</td>)
                        })}
                    </tr>
                )
            })) : null

        let fieldsName = this.props.columns

        if (fieldsName.length > 0) {
            return (
                <table id="items" style={{ border: 'double' }} key={this.props.key}>
                    <thead valign="top">
                        <tr style={{ border: '4px' }}>
                            {fieldsName.map((column, index) => {
                                return (<th key={index} style={{ backgroundColor: '#d6dde7', borderBottom: 'dashed' }}> {column.title}</th>)
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

    ShowMsg() { 
        if (Config.getPublicConfiguartion().activeExport != true) {
            toast.warn('This feature is disabled. Please call your administrator for assistance');
            return;
        }
    }
    render() {
        return (
            <Fragment>
                {Config.getPublicConfiguartion().activeExport === true ?
                    <button className="primaryBtn-2 btn mediumBtn"
                        type="button" onClick={e => { this.setState({ isExport: true }); this.tableToExcel(this.props.fileName) }}>
                        {this.state.isExportRequestPayment ? (this.props.type === 1 ? Resources["export"][currentLanguage] : "Export As Vo") : Resources["export"][currentLanguage]}</button>
                    :
                    <button className="primaryBtn-2 btn mediumBtn" type="button"
                     onClick={e => this.ShowMsg()} >{Resources["export"][currentLanguage]}</button>
                }
                <div style={{ display: 'none' }}>
                    {this.state.isExport === true || this.state.isExportRequestPayment ?
                        this.drawItems()
                        : null}
                </div>
            </Fragment>
        )
    }
}

export default Export;


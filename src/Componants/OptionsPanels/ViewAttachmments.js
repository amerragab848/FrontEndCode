import React, { Component } from 'react'
import 'react-table/react-table.css'
import pdf from '../../Styles/images/pdfAttache.png'
import xlsx from '../../Styles/images/attatcheXLS.png'
import doc from '../../Styles/images/attatcheDOC.png'
import Recycle from '../../Styles/images/attacheRecycle.png'
import Download from '../../Styles/images/attacthDownloadPdf.png'
import Pending from '../../Styles/images/AttacthePending.png'
import Api from '../../api';
import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class ViewAttachmnents extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            docTypeId: '64',
            docId: '158'
        }
    }
    deletehandler = (id) => {
        let urlDelete = 'DeleteAttachFileById?id=' + id
        Api.post(urlDelete).then(result => {
            console.log("success")
        }).catch(ex => {
        });
        this.getData()
    }

    versionHandler = (parentId) => {

        let urlVersion = 'GetChildFiles?docTypeId=' + this.state.docTypeId + '&docId=' + this.state.docId + '&parentId=' + parentId
        Api.post(urlVersion).then(result => {
            console.log("success")
        }).catch(ex => {
        });

    }

    componentDidMount = () => {
        this.getData()

    }
    render() {
        let tabel = this.state.data.map((item, Index) => { 
                        let extension=item['fileName'].split(".")[1] === 'xlsx' ? xlsx: (item['fileName'].split(".")[1] ==='pdf'?pdf:doc)
            return (
                <div className="gridMainRow" key={Index}>
                    <div className="stickyContent">
                        <div className="contentCell tableCell-1">
                            <span>
                                <img src={extension} alt="pdf" width="100%" height="100%" />
                            </span>
                        </div>
                        <div className="contentCell tableCell-2">
                            <a href={item['attachFile']} className="pdfPopup various zero">{item['fileName']}</a>
                        </div>
                    </div>
                    <div className="normalContent">
                        <div className="contentCell tableCell-3">
                            <p className="zero status">{item['uploadDate']}</p>
                        </div>
                        <div className="contentCell tableCell-4">
                            <h6 className="zero">{item['uploadedBy']} </h6>
                        </div>


                    </div>
                    <div className="attachmentAction">
                        <a className="attachRecycle" onClick={() => this.deletehandler(item['id'])} >
                            <img src={Recycle} alt="del" width="100%" height="100%" />
                        </a>
                        <a href={item['attachFile']} className="pdfPopup various zero attachPdf">
                            <img src={Download} alt="dLoad" width="100%" height="100%" />
                        </a>
                        <a className="attachPend" onClick={() => this.versionHandler(item['parentId'])}>
                            <img src={Pending} alt="pend" width="100%" height="100%" />
                        </a>
                    </div>


                </div>
            );
        })

        return (
            <div className="mainGridSystem attachmentPage">
                <div id="gridSort" className="gridSystemTables" tabIndex="1">
                    <div className="girdTableHeader" tabIndex="2">
                        <div className="stickyHead">
                            <div className="headCell tableCell-1">
                                <span> {Resources['arrange'][currentLanguage]} </span>
                            </div>
                            <div className="headCell tableCell-2">
                                <span>{Resources['fileName'][currentLanguage]} </span>
                            </div>
                        </div>
                        <div className="thead-row">
                            <div className="headCell tableCell-3 ui-resizable" data-sort="status">
                                <span>{Resources['docDate'][currentLanguage]}
                            </span>
                                <div className="ui-resizable-handle ui-resizable-e"></div></div>
                            <div className="headCell tableCell-4 ui-resizable" data-sort="name">
                                <span>{Resources['uploadedBy'][currentLanguage]}
                            </span>
                                <div className="ui-resizable-handle ui-resizable-e"></div></div>

                        </div>

                    </div>
                    <div className="gridTableContent list">
                        {tabel}
                    </div>
                </div>
            </div>
        )
    }

    getData() {
        let url = "GetAzureFiles?docTypeId=" + this.state.docTypeId + "&docId=" + this.state.docId
        Api.get(url).then(result => {
            result.map(item => {
                if (item['fileName']) {

                    item['fileName'] = item['fileName'].replace(new RegExp('%20', 'g'), " ").replace(new RegExp('%23', 'g'), "#")
                        .replace(new RegExp('%2C', 'g'), ",").replace(new RegExp('%28', 'g'), "(").replace(new RegExp('%29', 'g'), ")")
                }

            })

            this.setState({
                data: [...result]
            });
        }).catch(ex => {
        });
    }
}
export default ViewAttachmnents;
import React, { Component } from "react";
import dataservice from "../../Dataservice";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import GridSetup from "./GridSetup";
import Export from "../../Componants/OptionsPanels/Export";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import Config from "../../Services/Config.js";
import CryptoJS from 'crypto-js';
import moment from "moment";
import HeaderDocument from '../../Componants/OptionsPanels/HeaderDocument'
import DatePicker from '../../Componants/OptionsPanels/DatePicker'
import Api from '../../api'
import { toast } from "react-toastify";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

let docId = 0;
let projectId = 0;
let projectName = 0;
let isApproveMode = 0;
let docApprovalId = 0;
let arrange = 0;
const _ = require('lodash')
class corrRecievedSent extends Component {
    constructor(props) {
        super(props);
        const query = new URLSearchParams(this.props.location.search);
        let index = 0;
        for (let param of query.entries()) {
            if (index == 0) {
                try {
                    let obj = JSON.parse(CryptoJS.enc.Base64.parse(param[1]).toString(CryptoJS.enc.Utf8));
                    docId = obj.docId;
                    projectId = obj.projectId;
                    projectName = obj.projectName;
                    isApproveMode = obj.isApproveMode;
                    docApprovalId = obj.docApprovalId;
                    arrange = obj.arrange;
                }
                catch{
                    this.props.history.goBack();
                }
            }
            index++;
        }
        this.state = {
            currentTitle: "sendToWorkFlow",
            showModal: false,
            isViewMode: false,
            isApproveMode: isApproveMode,
            isView: false,
            docId: docId,
            docTypeId: 115,
            projectId: projectId,
            docApprovalId: docApprovalId,
            arrange: arrange,
        }

        if (!Config.IsAllow(48) || !Config.IsAllow(49) || !Config.IsAllow(51)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/claims/" + projectId
            });
        }

        this.columns = [
            {
                key: "arrange",
                name: Resources["arrange"][currentLanguage],
                width: 50,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,

            }, {
                key: "statusName",
                name: Resources["status"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,

            }, {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "fromCompanyName",
                name: Resources["fromCompany"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "fromContactName",
                name: Resources["fromContact"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "toCompanyName",
                name: Resources["toCompany"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "toContactName",
                name: Resources["ToContact"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "send_date",
                name: Resources["sendDate"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate

            }, {
                key: "docCloseDate",
                name: Resources["docClosedate"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate

            }, {
                key: "docTypeName",
                name: Resources["docType"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "sendingMethod",
                name: Resources["sendingMethod"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "refDoc",
                name: Resources["refDoc"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "lastSendTime",
                name: Resources["lastSendTime"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate

            }, {
                key: "lastApproveTime",
                name: Resources["lastApprovedTime"][currentLanguage],
                width: 80,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }]
    }
    componentDidMount() {
        var links = document.querySelectorAll(".noTabs__document .doc-container .linebylineInput");
        for (var i = 0; i < links.length; i++) {
            if ((i + 1) % 2 == 0) {
                links[i].classList.add('even');
            }
            else {
                links[i].classList.add('odd');
            }
        }
    };

    componentWillMount() {
        this.setState({isLoading:true})
        Api.get('GetCommunicationCorrespondenceReceived?projectId=2&pageNumber=0&pageSize=200').then(rows => {
            this.setState({ rows,isLoading:false })
        })
    };
    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridSetup
                rows={this.state.rows}
                pageSize={this.state.pageSize}
                cellClick={this.cellClick}
                columns={this.columns}
            />) : <LoadingSection />;
        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={this.state.pageTitle} />
            : null;
        return (
            <div className="mainContainer">
                <HeaderDocument projectName={projectName} docTitle={Resources.correspondence[currentLanguage]} moduleTitle={Resources['communicationCorrespondenceReceived'][currentLanguage]} />
                <div className="doc-container">
                    <div className="step-content">
                        <div id="step1" className="step-content-body">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    {dataGrid}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}
export default (withRouter(corrRecievedSent))
import React, { Component, Fragment } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
import Config from '../../../Services/Config';
import Dropdown from '../../../Componants/OptionsPanels/DropdownMelcous'
import moment from "moment";
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Export from "../../../Componants/OptionsPanels/Export";
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
import CryptoJS from "crypto-js";
import * as communicationActions from "../../../store/actions/communication";

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

let moduleId = Config.getPublicConfiguartion().reportsApi;
class DetailedFollowUpReport extends Component {

    constructor(props) {
        super(props);

        var columnsGrid = [
            {
                field: "serialNo",
                title: Resources["arrange"][currentLanguage],
                width: 7,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text",
                hidden: false
            },
            {
                field: "refDoc",
                title: Resources["refDoc"][currentLanguage],
                width: 7,
                groupable: true,
                fixed: true,
                sortable: true,
                type: "text",
                hidden: false
            },
            {
                field: "subject",
                title: Resources["subject"][currentLanguage],
                width: 25,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text",
                href: 'link',
                onClick: () => { },
                classes: 'bold'
            },
            {
                field: "approvalStatusName",
                title: Resources["approvalStatus"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "docDurationDays",
                title: Resources["durationDays"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "delayDays",
                title: Resources["delay"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "docDate",
                title: Resources["docDate"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "date"
            },
            {
                field: "docTypeName",
                title: Resources["docType"][currentLanguage],
                width: 12,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "projectName",
                title: Resources["projectName"][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text"
            },
            {
                field: "actionByContactName",
                title: Resources["actionByContact"][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text",
                hidden: false
            },
            {
                field: "arrange",
                title: Resources["levelNo"][currentLanguage],
                width: 7,
                groupable: true,
                fixed: false,
                sortable: true,
                type: "text",
                hidden: false
            },

        ];

        var groups = [];

        const filtersColumns = [
            {
                field: "projectName",
                name: "projectName",
                type: "string",
                isCustom: true
            },
            {
                field: "serialNo",
                name: "arrange",
                type: "number",
                isCustom: true
            },
            {
                field: "subject",
                name: "subject",
                type: "string",
                isCustom: true
            },
            {
                field: "approvalStatusName",
                name: "approvalStatus",
                type: "string",
                isCustom: true
            },
            {
                field: "arrange",
                name: "arrangeLevel",
                type: "number",
                isCustom: true
            },
            {
                field: "docTypeName",
                name: "docType",
                type: "string",
                isCustom: true
            },
            {
                field: "docDurationDays",
                name: "delay",
                type: "number",
                isCustom: true
            }
        ];

        this.state = {
            pageTitle: Resources["DetailedFollowUpReport"][currentLanguage],
            columns: columnsGrid,
            isLoading: true,
            rows: [],
            filtersColumns: filtersColumns,
            groups: groups,
            isCustom: true,
            pageSize: 50,
            pageNumber: 0,
            api: 'GetDetailedFollowUpReport?',
        };

        if (!Config.IsAllow(4030)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }
    }

    componentDidMount() {

        Api.get(this.state.api + "pageNumber=" + this.state.pageNumber + "&pageSize=" + this.state.pageSize, undefined).then(result => {//, moduleId)

            result.forEach(row => {
                let obj = {
                    docId: row.docId,
                    projectId: row.projectId,
                    projectName: row.projectName,
                    arrange: 0,
                    docApprovalId: 0,
                    isApproveMode: false,
                    perviousRoute: window.location.pathname + window.location.search
                };

                let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

                let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

                row.link = '/' + row.docLink + '?id=' + encodedPaylod;
            });

            this.setState({
                rows: result != null ? result : [],
                isLoading: false
            });
        });
    }
    GetNextData() {
        let pageNumber = this.state.pageNumber + 1;

        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        let url = this.state.api + "pageNumber=" + pageNumber + "&pageSize=50"
        Api.get(url).then(result => {
            let oldRows = this.state.rows;
            const newRows = [...oldRows, ...result];
            this.setState({
                rows: newRows,
                totalRows: newRows.length,
                pageSize: this.state.pageSize + 50,
                isLoading: false
            });
        }).catch(ex => {
            let oldRows = this.state.rows;
            this.setState({
                rows: oldRows,
                isLoading: false
            });
        });;
    }

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;
        let pageSize = this.state.pageSize - 50;

        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });

        let url = this.state.api + "pageNumber=" + pageNumber + "&pageSize=" + pageSize;

        Api.get(url).then(result => {
            let oldRows = [];
            const newRows = [...oldRows, ...result];

            this.setState({
                rows: newRows,
                totalRows: newRows.length,
                pageSize: pageSize,
                isLoading: false
            });
        }).catch(ex => {
            let oldRows = this.state.rows;
            this.setState({
                rows: oldRows,
                isLoading: false
            });
        });
    }

    render() {
        const dataGrid = this.state.isLoading === false ? (
            <GridCustom
                ref='custom-data-grid'
                gridKey="DetailedFollowUpReport"
                groups={[]}
                data={this.state.rows || []}
                cells={this.state.columns}
                pageSize={this.state.rows ? this.state.rows.length : 0}
                actions={[]}
                rowActions={[]}
                rowClick={() => { }}
            />
        ) : <LoadingSection />;

        const btnExport = this.state.isLoading === false ?
            <Export
                columns={this.state.columns} 
                rows={this.state.rows}
                fields={this.fields}
                fileName={'DetailedFollowUpReport'} />
            : null

        return (
            <div className="reports__content">
                <header className="pagination">
                    <div>
                        <h2 className="zero">{Resources.DetailedFollowUpReport[currentLanguage]}</h2>
                        {btnExport}
                    </div>
                    <div className="rowsPaginations readOnly__disabled">
                        <div className="rowsPagiRange">
                            <span>
                                {this.state.pageSize *
                                    this.state.pageNumber +
                                    1}
                            </span>{' '}
                            -
                            <span>
                                {this.state.filterMode ? this.state.totalRows : this.state.pageSize * this.state.pageNumber + this.state.pageSize}
                            </span>
                            {
                                Resources['jqxGridLanguagePagergotopagestring'][currentLanguage]
                            }
                            <span> {this.state.totalRows}</span>
                        </div>
                        <button
                            className={
                                this.state.pageNumber == 0 ? 'rowunActive' : ''
                            }
                            onClick={() => this.GetPrevoiusData()}>
                            <i className="angle left icon" />
                        </button>
                        <button
                            className={
                                this.state.totalRows !== this.state.pageSize * this.state.pageNumber + this.state.pageSize ? 'rowunActive' : ''
                            }
                            onClick={() => this.GetNextData()}>
                            <i className="angle right icon" />
                        </button>
                    </div>

                </header>

                <div className="doc-pre-cycle letterFullWidth">
                    {dataGrid}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        showModal: state.communication.showModal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailedFollowUpReport); 

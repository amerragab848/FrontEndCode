import React, { Component } from 'react'
import Api from '../../api'
import LoadingSection from '../../Componants/publicComponants/LoadingSection'
import Export from '../OptionsPanels/Export'
import GridCustom from '../../Componants/Templates/Grid/CustomGrid'
import Resources from '../../resources.json'
import CryptoJS from 'crypto-js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as communicationActions from '../../store/actions/communication'

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class FollowUpsSummaryDetails extends Component {

    constructor(props) {
        super(props);

        var columnsGrid = [
            {
                field: 'arrange',
                title: Resources['arrange'][currentLanguage],
                width: 5,
                groupable: true,
                fixed: true,
                sortable: true,
                type: 'text',
                hidden: false,
            }, {
                field: 'subject',
                title: Resources['subject'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: 'text',
                href: 'link',
                onClick: () => { },
                classes: 'bold'
            }, {
                field: 'projectName',
                title: Resources['projectName'][currentLanguage],
                width: 6,
                groupable: true,
                fixed: false,
                sortable: true,
                type: 'text',
            }, {
                field: 'fromCompany',
                title: Resources['fromCompany'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: 'text',
            }, {
                field: 'actionByContactName',
                title: Resources['actionByContact'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                sortable: true,
                type: 'text',
            }, {
                field: 'epsName',
                title: Resources['epsName'][currentLanguage],
                width: 6,
                groupable: true,
                fixed: false,
                sortable: true,
                type: 'text',
            }, {
                field: 'companyType',
                title: Resources['companyType'][currentLanguage],
                groupable: true,
                fixed: false,
                width: 10,
                sortable: true,
                type: 'text',
            }, {
                field: 'approvalStatusName',
                title: Resources['approvalStatus'][currentLanguage],
                width: 8,
                groupable: true,
                fixed: false,
                sortable: true,
                type: 'text',
            }, {
                field: 'docTypeName',
                title: Resources['docType'][currentLanguage],
                width: 7,
                groupable: true,
                fixed: false,
                sortable: true,
                type: 'text',
            }, {
                field: 'delayDuration',
                title: Resources['delay'][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                sortable: true,
                type: 'text',
            }, {
                field: 'duration2',
                title: Resources['durationDays'][currentLanguage],
                width: 5,
                groupable: true,
                fixed: false,
                sortable: true,
                type: 'text',
            }, {
                field: 'sendDate',
                title: Resources['sendDate'][currentLanguage],
                width: 6,
                groupable: true,
                fixed: false,
                sortable: true,
                type: 'date',
            }, {
                field: 'lastApprovalDate',
                title: Resources['lastApprovalDate'][currentLanguage],
                width: 6,
                groupable: true,
                fixed: false,
                sortable: true,
                type: 'date',
            },
        ];

        var groups = [];

        const filtersColumns = [
            {
                field: 'projectName',
                name: 'projectName',
                type: 'string',
                isCustom: true,
            },
            {
                field: 'fromCompany',
                name: 'fromCompany',
                type: 'string',
                isCustom: true,
            },
            {
                field: 'arrange',
                name: 'arrange',
                type: 'number',
                isCustom: true,
            },
            {
                field: 'subject',
                name: 'subject',
                type: 'string',
                isCustom: true,
            },
            {
                field: 'actionByContactName',
                name: 'actionByContact',
                type: 'string',
                isCustom: true,
            },
            {
                field: 'approvalStatusName',
                name: 'approvalStatus',
                type: 'string',
                isCustom: true,
            },
            {
                field: 'docTypeName',
                name: 'docType',
                type: 'string',
                isCustom: true,
            },
            {
                field: 'delayDuration',
                name: 'delay',
                type: 'string',
                isCustom: true,
            },
            {
                field: 'duration2',
                name: 'durationDays',
                type: 'string',
                isCustom: true,
            },
            {
                field: 'sendDate',
                name: 'sendDate',
                type: 'date',
                isCustom: true,
            },
            {
                field: 'lastApprovalDate',
                name: 'lastApprovalDate',
                type: 'date',
                isCustom: true,
            },
        ];

        this.state = {
            pageTitle: Resources['followUpsSummaryDetails'][currentLanguage],
            columns: columnsGrid,
            isLoading: true,
            rows: [],
            filtersColumns: filtersColumns,
            groups: groups,
            isCustom: true,
            filteredRows:[]
        };
    }

    componentDidMount() {
        this.props.actions.RouteToTemplate();

        Api.get('GetFollowing').then(result => {
            result = result || [];
            result.forEach(row => {
                let obj = {
                    docId: row.docId,
                    projectId: row.projectId,
                    projectName: row.projectName,
                    arrange: 0,
                    docApprovalId: 0,
                    isApproveMode: false,
                    perviousRoute: window.location.pathname + window.location.search,
                };

                let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

                let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

                row.link = '/' + row.docLink + '?id=' + encodedPaylod;
            });

            this.getFilteredRows(result);

            this.setState({
                rows: result != null ? result : [],
                isLoading: false,
            });
        });
    }

    getFilteredRows = (data) => {
        if (data != null && data != undefined)
            this.setState({ filteredRows: data || [] });
    }

    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridCustom
                    gridKey="FollowingUpSummary"
                    cells={this.state.columns}
                    data={this.state.rows}
                    groups={this.state.groups}
                    actions={[]}
                    rowActions={[]}
                    rowClick={obj => {
                        if (this.state.RouteEdit !== '') {
                            let objRout = {
                                docId: obj.docId,
                                projectId: obj.projectId,
                                projectName: obj.projectName,
                                arrange: 0,
                                docApprovalId: 0,
                                isApproveMode: false,
                                perviousRoute:
                                    window.location.pathname +
                                    window.location.search,
                            };
                            let parms = CryptoJS.enc.Utf8.parse(
                                JSON.stringify(objRout),
                            );
                            let encodedPaylod = CryptoJS.enc.Base64.stringify(
                                parms,
                            );
                            this.props.history.push({
                                pathname: '/' + obj.docLink,
                                search: '?id=' + encodedPaylod,
                            });
                        }
                    }}
                    afterFilter={this.getFilteredRows}
                />
            ) : (
                    <LoadingSection />
                );

        const btnExport =
            this.state.isLoading === false ? (
                <Export
                    rows={this.state.isLoading === false ? this.state.filteredRows : []}
                    columns={this.state.columns}
                    fileName={this.state.pageTitle}
                />
            ) : (
                    <LoadingSection />
                );


        return (
            <div className="mainContainer">
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero">{this.state.pageTitle}</h3>
                        <span>{this.state.rows.length}</span>
                    </div>
                    <div className="filterBTNS">{btnExport}</div>
                </div>
                <div>
                    <div className="doc-pre-cycle letterFullWidth">
                        <div className="precycle-grid">
                            <div className="grid-container">
                                <div className="submittalFilter readOnly__disabled">
                                    <div className="subFilter">
                                        <h3 className="zero"></h3>
                                    </div>
                                    <div className="rowsPaginations readOnly__disabled">
                                        <button className="rowunActive">
                                            <i className="angle left icon" />
                                        </button>
                                        <button className="rowunActive">
                                            <i className="angle right icon" />
                                        </button>
                                    </div>
                                </div>
                                {dataGrid}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

function mapStateToProps(state, ownProps) {
    return {
        showModal: state.communication.showModal,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FollowUpsSummaryDetails);

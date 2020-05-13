import React, { Component } from 'react'
import LoadingSection from "../publicComponants/LoadingSection";
import Api from '../../api'
import Resources from '../../resources.json';
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import moment from 'moment';
import { withRouter } from "react-router-dom";
import Export from "../OptionsPanels/Export";
import dataservice from "../../Dataservice";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";
import { toast } from "react-toastify";


let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class PettyCash extends Component {
    constructor(props) {
        super(props)
        const columnsGrid = [
            {
                field: 'subject',
                title: Resources['subject'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'projectName',
                title: Resources['projectName'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'date',
                title: Resources['docDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            },
            {
                field: 'amount',
                title: Resources['amount'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'remaining',
                title: Resources['remaining'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'statusName',
                title: Resources['statusName'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'contactName',
                title: Resources['ContactName'][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }
        ];
        this.state = {
            startDate: moment(),
            finishDate: moment(),
            Projects: [],
            projectId: '',
            columns: columnsGrid,
            isLoading: true,
            rows: [],
            btnisLoading: false,
            isLoadingsendRequest: false,
            statusClassSuccess: "disNone",
            Loading: false,
            pageSize: 50,
            pageNumber: 0,
            totalRows: 0,
            viewfilter: false,
            showDeleteModal: false,
            selectedRow: 0
        };
        this.rowActions = [
            {
                title: 'Delete',
                handleClick: value => {
                    this.setState({ selectedRow: value.id, showDeleteModal: true })
                }
            }
        ]
    }

    GetNextData = () => {
        let pageNumber = this.state.pageNumber + 1;
        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        if (this.state.projectId) {
            Api.post('GetTimeSheetByRange', { projectId: this.state.projectId, startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(result => {
                let oldRows = this.state.rows;
                const newRows = [...oldRows, ...result];

                this.setState({
                    rows: newRows,
                    totalRows: newRows.length,
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
        else {
            Api.post('GetTimeSheetByRange', { startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(result => {
                let oldRows = this.state.rows;
                const newRows = [...oldRows, ...result];

                this.setState({
                    rows: newRows,
                    totalRows: newRows.length,
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
    }
    addRecord() {
        this.props.history.push({ pathname: 'PettyCashAddEdit/0/0' })
    }

    componentDidMount = () => {
        dataservice.GetDataGrid('GetPeetyCashForContact').then(data => {
            this.setState({ rows: data, isLoading: false, totalRows: data.length, });
        })
    }

    ProjectshandleChange = (e) => {
        this.setState({ projectId: e.value, })
    }

    toggleFilter = () => {
        this.setState({ viewfilter: !this.state.viewfilter });
    }

    cellClick = (row) => {
        this.props.history.push({ pathname: `/PettyCashAddEdit/${row.id}/${row.projectId}` });
    }

    clickHandlerDeleteRows = (selectedRow) => {
        this.setState({ showDeleteModal: true, selectedRow: selectedRow.slice(-1) });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerContinueMain = () => {
        this.setState({ isLoading: true, showDeleteModal: false });

        Api.post(`DeletePeetyCash?id=${this.state.selectedRow}`).then(result => {
            let originalRows = this.state.rows
            originalRows = originalRows.filter(r => r.id !== this.state.selectedRow);
            this.setState({ isLoading: false, rows: originalRows });
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
        }).catch(ex => {
            this.setState({ isLoading: false, showDeleteModal: false });
        });
    };
    render() {
        const btnExport =
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={Resources["peetyCash"][currentLanguage]} />
        return (
            <div className="main__fulldash--container">

                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero"> {Resources["peetyCash"][currentLanguage]}</h3>
                        <span>{this.state.rows.length}</span>
                        <div className="ui labeled icon top right pointing dropdown fillter-button" tabIndex="0" onClick={this.toggleFilter}>
                        </div>
                    </div>

                    <div className="filterBTNS">
                        <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.addRecord()}>New</button>
                        {btnExport}
                    </div>
                    <div className="rowsPaginations readOnly__disabled">
                        <div className="rowsPagiRange">
                            <span>0</span> - <span>{this.state.pageSize}</span> of <span>{this.state.totalRows}</span>
                        </div>
                        <button className="rowunActive">
                            <i className="angle left icon" />
                        </button>
                        <button onClick={() => this.GetNextData()}>
                            <i className="angle right icon" />
                        </button>
                    </div>
                </div>
                <div className="filterHidden" style={{ maxHeight: this.state.viewfilter ? "" : "0px", overflow: this.state.viewfilter ? "" : "hidden" }}>
                    <div className="gridfillter-container">
                    </div>
                </div>
                <div className="grid-container">
                    {this.state.Loading ? <LoadingSection /> : null}
                    {this.state.isLoading == false ?
                        <GridCustom
                            ref='custom-data-grid'
                            key="PettyCash"
                            data={this.state.rows}
                            pageSize={this.state.rows.length}
                            groups={[]}
                            actions={[]}
                            rowActions={this.rowActions}
                            cells={this.state.columns}
                            rowClick={(cell) => { this.cellClick(cell) }}
                        />
                        : <LoadingSection />}
                </div>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources["smartDeleteMessage"][currentLanguage].content}
                        buttonName="delete"
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        clickHandlerContinue={this.clickHandlerContinueMain}

                    />
                ) : null}
            </div>
        )
    }
}
export default withRouter(PettyCash)
import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../../publicComponants/ConfirmationModal";
import GridSetup from "../../../../Pages/Communication/GridSetup";
import NotifiMsg from '../../../publicComponants/NotifiMsg'
import Export from "../../../../Componants/OptionsPanels/Export";
import config from "../../../../Services/Config";
import Resources from "../../../../resources.json";
import Api from '../../../../api';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProject=localStorage.getItem('lastSelectedprojectName')

class ExpensesWorkFlowLog extends Component {
    constructor(props) {
        super(props)

        const columnsGrid = [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "arrange",
                name: Resources["arrange"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "expensesTypeName",
                name: Resources["expensesTypeName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ]
        
        this.state = {
            showCheckbox: true,
            columns: columnsGrid.filter(column => column.visible !== false),
            isLoading: true,
            rows: [],
            selectedRows: [],
            showDeleteModal: false,
            showNotify: false,
        }
    }

    componentDidMount = () => {
        Api.get('ExpensesWorkFlowGet').then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false,
                })
            }
        )
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };
    
    clickHandlerDeleteRowsMain = (selectedRows) => {
        this.setState({
            selectedRows,
            showDeleteModal: true
        })
    }

    ConfirmDelete = () => {
        this.setState({
            isLoading: true
        })
        Api.post('DeleteMultipleExpensesWorkFlow', this.state.selectedRows).then(
            res => {
                let originalRows = this.state.rows

                this.state.selectedRows.map(i => {
                    originalRows = originalRows.filter(r => r.id !== i);
                })
                this.setState({
                    rows: originalRows,
                    showDeleteModal: false,
                    isLoading: false,
                })
                setTimeout(() => {
                    this.setState({
                        showNotify: true,
                    })
                }, 500);
            }
        ).catch(ex => {
            this.setState({
                isLoading: true,
                showNotify: false,
            })
        });
        this.setState({
            isLoading: true,
            showNotify: false,
        })
    }


    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                // onRowClick={this.cellClick.bind(this)}
                />
            ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns} fileName={Resources['expensesWorkFlow'][currentLanguage]} />
            : null;
        return (
            <Fragment>
                <NotifiMsg showNotify={this.state.showNotify} IsSuccess={true} Msg={Resources['successAlert'][currentLanguage]} />
                <div className="submittalFilter">
                    <div className="subFilter">
                        <h3 className="zero">{CurrProject + ' - ' + Resources['expensesWorkFlow'][currentLanguage]}</h3>
                        <span>
                            <svg width="16px" height="18px" viewBox="0 0 16 18" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" >
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" >
                                    <g id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                        transform="translate(-4.000000, -3.000000)" >
                                    </g>
                                </g>
                            </svg>
                        </span>
                    </div>


                    <div className="filterBTNS">
                        {config.IsAllow(1182) ?
                            <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.setState({ ShowPopup: true })}>New</button>
                            : null}
                        {btnExport}
                    </div>
                    
                </div>
                <div className="grid-container">
                    {dataGrid}
                </div>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null}
            </Fragment>
        )
    }

}

export default withRouter(ExpensesWorkFlowLog)
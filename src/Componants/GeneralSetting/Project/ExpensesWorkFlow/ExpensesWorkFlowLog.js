import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../../publicComponants/ConfirmationModal";
import NotifiMsg from '../../../publicComponants/NotifiMsg'
import Export from "../../../OptionsPanels/Export";
import config from "../../../../Services/Config";
import Resources from "../../../../resources.json";
import Api from '../../../../api';
import { toast } from "react-toastify";
import GridCustom from "../../../../Componants/Templates/Grid/CustomGrid";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProject = localStorage.getItem('lastSelectedprojectName')
class ExpensesWorkFlowLog extends Component {
    constructor(props) {
        super(props)

        if (!config.IsAllow(3664)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
            this.props.history.goBack()
        }
        const columnsGrid = [
            {
                field: "id",
                title: "",
                fixed: true,
                showTip: true,
                type: "check-box"
            },
            {
                field: 'arrange',
                title: Resources['arrange'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "number",
                sortable: true,
            },
            {
                field: 'subject',
                title: Resources['subject'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }, {
                field: 'projectName',
                title: Resources['projectName'][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'expensesTypeName',
                title: Resources['expensesTypeName'][currentLanguage],
                width: 15,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }
        ]
        this.actions = [
            {
              title:'Delete',
              handleClick:values=>{
                this.setState({
                    selectedRows:values,
                    showDeleteModal: true
                }) 
              }
            }
        ]
        this.state = {
            showCheckbox: false,
            columns: columnsGrid.filter(column => column.visible !== false),
            isLoading: true,
            rows: [],
            selectedRows: [],
            showDeleteModal: false,
            showNotify: false,
            MaxArrange: 0
        }
    }

    componentDidMount = () => {
        Api.get('ExpensesWorkFlowGet').then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false,
                    MaxArrange: Math.max.apply(Math, res.map(function (o) { return o.arrange + 1 }))
                })
            }
        )
        if (config.IsAllow(3663)) {
            this.setState({
                showCheckbox: true
            })
        }
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    // clickHandlerDeleteRowsMain = (selectedRows) => {
    //     this.setState({
    //         selectedRows,
    //         showDeleteModal: true
    //     })
    // }

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
                    MaxArrange: Math.max.apply(Math, originalRows.map(function (o) { return o.arrange + 1 }))
                })
                toast.success(Resources['smartSentAccountingMessageSuccessTitle'][currentLanguage])
            }
        ).catch(ex => {
            this.setState({
                isLoading: true,
            })
        });
        this.setState({
            isLoading: true,
        })
    }

    AddExpensesWorkFlow = () => {
        this.props.history.push({
            pathname: "/ExpensesWorkFlowAddEdit",
            search: "?arrange=" + this.state.MaxArrange
        });
    }

    onRowClick = (obj) => {
        if (!config.IsAllow(3662)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
        }
        else {
            this.props.history.push({
                pathname: "/ExpensesWorkFlowAddEdit",
                search: "?id=" + obj.id
            });
        }
    }

    render() {
        const dataGrid =
            this.state.isLoading === false ? (
                <GridCustom
                    ref='custom-data-grid'
                    gridKey="ExpensesWorkFlowLog"
                    data={this.state.rows}
                    pageSize={this.state.rows.length}
                    groups={[]}
                    actions={this.actions}
                    rowActions={[]}
                    cells={this.state.columns}
                    rowClick={(cell) => { this.onRowClick(cell) }}
                />
            ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns} fileName={Resources['expensesWorkFlow'][currentLanguage]} />
            : null;
        return (
            <Fragment>
                <NotifiMsg showNotify={this.state.showNotify} IsSuccess={true} Msg={Resources['successAlert'][currentLanguage]} />
                <div className="submittalFilter readOnly__disabled">
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
                        {config.IsAllow(3661) ?
                            <button className="primaryBtn-1 btn mediumBtn" onClick={this.AddExpensesWorkFlow}>New</button>
                            : null}
                        {btnExport}
                    </div>

                </div>
                <div className="grid-container">
                    {dataGrid}
                </div>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources["smartDeleteMessageContent"][currentLanguage]}
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
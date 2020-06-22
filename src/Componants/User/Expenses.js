import React, { Component, Fragment } from 'react'
import { withRouter } from "react-router-dom";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Api from '../../api'
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from '../../resources.json';
import DatePicker from '../OptionsPanels/DatePicker'
import moment from 'moment';
import Export from "../OptionsPanels/Export";
import ConfirmationModal from "../publicComponants/ConfirmationModal";
import CryptoJS from "crypto-js";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

let publicFonts = currentLanguage === "ar" ? 'cairo-sb' : 'Muli, sans-serif'
const filterStyle = {
    control: (styles, { isFocused }) =>
        ({
            ...styles,
            backgroundColor: '#fff',
            width: '100%',
            height: '36px',
            borderRadius: '4px',
            border: isFocused ? "solid 2px #83B4FC" : '2px solid #E9ECF0',
            boxShadow: 'none',
            transition: ' all 0.4s ease-in-out',
            minHeight: '36px',
            minWidth: '210px'
        }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled ? '#fff' : isSelected ? '#e9ecf0' : isFocused ? '#f2f6fa' : "#fff",
            color: '#3e4352',
            fontSize: '14px',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            textTransform: 'capitalize',
            fontFamily: publicFonts,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: '155'
        };
    },
    input: styles => ({ ...styles, maxWidth: '100%' }),
    placeholder: styles => ({ ...styles, color: '#A8B0BF', fontSize: '13px', width: '100%', fontFamily: publicFonts }),
    singleValue: styles => ({ ...styles, color: '#252833', fontSize: '13px', width: '100%', fontFamily: publicFonts }),
    indicatorSeparator: styles => ({ ...styles, display: 'none' }),
    menu: styles => ({ ...styles, zIndex: 155, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)', border: 'solid 1px #ccd2db' })
};

class Expenses extends Component {

    constructor(props) {
        super(props)
        const columnsGrid = [
            {
                field: 'docDate',
                title: Resources['docDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "date",
                sortable: true,
            },
            {
                field: 'description',
                title: Resources['description'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
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
                field: 'expenseTypeName',
                title: Resources['expenseType'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'refCode',
                title: Resources['referececode'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'total',
                title: Resources['total'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'workFlowName',
                title: Resources['lastWorkFlow'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'approvalStatusName',
                title: Resources['approvalStatus'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'comment',
                title: Resources['comment'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'statusText',
                title: Resources['actions'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            }
        ];
        this.actions = [
            {
                title: 'Delete',
                handleClick: values => {
                    this.clickHandlerDeleteRowsMain(values)
                }
            }
        ]
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
            selectedRows: [],
            showDeleteModal: false,
            totalExpenses: 0
        };
    }

    attachments = () => {
    }

    clickHandlerDeleteRowsMain = (selectedRows) => {
        this.setState({ selectedRows: selectedRows, showDeleteModal: true })
        Api.post('DeleteUserExpensesMultiple', selectedRows)
            .then(result => {
                let originalRows = this.state.rows;
                this.state.selectedRows.map(i => {
                    originalRows = originalRows.filter(r => r.id !== i);
                });

                this.setState({
                    rows: originalRows,
                    totalRows: originalRows.length,
                    isLoading: false,
                    showDeleteModal: false
                });
            })
            .catch(ex => {
                this.setState({
                    //isLoading: false,
                    showDeleteModal: false
                });

            });
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    RouteHandler(obj) {
        if (obj) {
            let objRout = {
                id: obj.id,
            }
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
            this.props.history.push({
                pathname: "/expensesUserAddEdit",
                search: "?id=" + encodedPaylod
            });
        } else {
            let objRout = {
                id: "0"
            }
            let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(objRout));
            let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);
            this.props.history.push({
                pathname: "/expensesUserAddEdit",
                search: "?id=" + encodedPaylod
            });
        }
    }

    GetNextData = () => {

        let pageNumber = this.state.pageNumber + 1;
        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        if (this.state.projectId) {
            Api.post('GetExpensesByDates', { projectId: this.state.projectId, startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: pageNumber, pageSize: this.state.pageSize }).then(result => {
                let oldRows = this.state.rows;
                const newRows = [...oldRows, ...result];
                let totalExpenses = 0;
                result.forEach(item => {
                    totalExpenses = totalExpenses + item.total;
                })
                this.setState({
                    rows: newRows,
                    totalExpenses:totalExpenses,
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
            Api.post('GetExpensesByDates', { startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: pageNumber, pageSize: this.state.pageSize }).then(result => {
                let oldRows = this.state.rows;
                const newRows = [...oldRows, ...result];
                let totalExpenses = 0;
                result.forEach(item => {
                    totalExpenses = totalExpenses + item.total;
                })
                this.setState({
                    rows: newRows,
                    totalExpenses:totalExpenses,
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
        alert("add new expenses record....");
    }

    componentDidMount = () => {
        this.GetData("ProjectProjectsGetAll", 'projectName', 'projectId', 'Projects');
        this.setState({ btnisLoading: true, Loading: true })
        Api.get(`GetExpenses?pageNumber=${this.state.pageNumber}&pageSize=10000`).then(
            result => {
                let totalExpenses = 0;
                result.forEach(item => {
                    totalExpenses = totalExpenses + item.total;
                })
                this.setState({
                    rows: result,
                    isLoading: false,
                    btnisLoading: false,
                    Loading: false,
                    totalRows: result.length,
                    totalExpenses: totalExpenses
                })
            }, this.setState({ isLoading: true })
        );
    }

    ProjectshandleChange = (e) => {
        this.setState({
            projectId: e.value,
        })
    }

    startDatehandleChange = (date) => {
        this.setState({ startDate: date });
    }

    finishDatehandleChange = (date) => {
        this.setState({ finishDate: date });
    }

    ViewReport = () => {
        if (this.state.projectId) {
            this.setState({ btnisLoading: true, Loading: true })
            Api.post('GetExpensesByDates', { projectId: this.state.projectId, startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(
                result => {
                    let totalExpenses = 0;
                    result.forEach(item => {
                        totalExpenses = totalExpenses + item.total;
                    })
                    this.setState({
                        rows: result,
                        isLoading: false,
                        btnisLoading: false,
                        Loading: false,
                        totalRows: result.length,
                        totalExpenses: totalExpenses
                    })
                }, this.setState({ isLoading: true })
            );
        }

        else {
            this.setState({ btnisLoading: true, Loading: true })
            Api.post('GetExpensesByDates', { startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(
                result => {
                    let totalExpenses = 0;
                    result.forEach(item => {
                        totalExpenses = totalExpenses + item.total;
                    })
                    this.setState({
                        rows: result,
                        isLoading: false,
                        btnisLoading: false,
                        Loading: false,
                        totalRows: result.length,
                        totalExpenses: totalExpenses
                    });
                }, this.setState({ isLoading: true })
            );
        }
    }

    render() {
        const btnExport =
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns} fileName={Resources['timeSheet'][currentLanguage]} />

        return (
            <div className="main__fulldash--container">

                <div className="resetPassword">

                    <div className="submittalFilter readOnly__disabled">
                        <div className="subFilter">
                            <h3 className="zero"> {Resources['expenses'][currentLanguage]}</h3>
                            <span>{this.state.rows.length}</span>
                            <span>
                                <svg
                                    width="16px"
                                    height="18px"
                                    viewBox="0 0 16 18"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink" >
                                    <g id="Symbols"
                                        stroke="none"
                                        strokeWidth="1"
                                        fill="none"
                                        fillRule="evenodd" >
                                        <g id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                            transform="translate(-4.000000, -3.000000)" >
                                        </g>
                                    </g>
                                </svg>
                            </span>
                        </div>

                        <div className="filterBTNS">
                            {btnExport}
                            <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.RouteHandler()}>New</button>
                        </div>

                        <div className="rowsPaginations readOnly__disabled">
                            <div className="rowsPagiRange">
                                <span>0</span> - <span>{this.state.pageSize}</span> of
                             <span>{this.state.totalRows}</span>
                            </div>
                            <button className="rowunActive">
                                <i className="angle left icon" />
                            </button>
                            <button onClick={() => this.GetNextData()}>
                                <i className="angle right icon" />
                            </button>
                        </div>
                    </div>

                    <div className="gridfillter-container">
                        <div className="fillter-status-container">
                            <div className="form-group fillterinput fillter-item-c">
                                <Dropdown title='Projects' data={this.state.Projects}
                                    handleChange={this.ProjectshandleChange} placeholder='Projects' styles={filterStyle} />
                            </div>
                            <div className="form-group fillterinput fillter-item-c" >
                                <DatePicker title='startDate' startDate={this.state.startDate}
                                    handleChange={this.startDatehandleChange} />
                            </div>
                            <div className="form-group fillterinput fillter-item-c" >

                                <DatePicker title='finishDate' startDate={this.state.finishDate}
                                    handleChange={this.finishDatehandleChange} />
                            </div>
                            <div className="dropBtn">
                                {this.state.btnisLoading === false ? (
                                    <button className="primaryBtn-1 btn smallBtn" onClick={this.ViewReport}>
                                        {Resources['View'][currentLanguage]}</button>
                                ) : (
                                        <button className="primaryBtn-1 btn smallBtn" >
                                            <div className="spinner">
                                                <div className="bounce1" />
                                                <div className="bounce2" />
                                                <div className="bounce3" />
                                            </div>
                                        </button>
                                    )}
                            </div>
                            <div className="form-group fillterinput fillter-item-c">
                                <label className="control-label">
                                    {Resources["total"][currentLanguage]}{" "}
                                </label>
                                <div className="inputDev ui input ">
                                    <input
                                        name="total"
                                        className="form-control"
                                        id="total"
                                        placeholder={
                                            Resources["total"][
                                            currentLanguage
                                            ]
                                        }
                                        disabled="true"
                                        autoComplete="off"
                                        defaultValue={this.state.totalExpenses}
                                        value={this.state.totalExpenses}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>


                    {this.state.Loading ? <LoadingSection /> : null}
                    {this.state.isLoading == false
                        ?
                        <GridCustom
                            ref='custom-data-grid'
                            key="UserExpenses"
                            data={this.state.rows}
                            pageSize={this.state.pageSize}
                            groups={[]}
                            actions={this.actions}
                            rowActions={[]}
                            cells={this.state.columns}
                            rowClick={(cell) => { this.RouteHandler(cell) }}
                        />
                        :
                        <div className={this.state.isLoading == false ? "disNone" : ""}>
                            <GridCustom
                                ref='custom-data-grid'
                                key="UserExpenses"
                                data={[]}
                                pageSize={0}
                                groups={[]}
                                actions={[]}
                                rowActions={[]}
                                cells={this.state.columns}
                                rowClick={() => { }}
                            />  </div>}

                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain} />
                    ) : null}

                </div>
            </div>
        )
    }

    GetData = (url, label, value, currState) => {
        let Data = []
        Api.get(url).then(result => {
            (result).forEach(item => {
                var obj = {};
                obj.label = item[label];
                obj.value = item[value];
                Data.push(obj);
            });
            this.setState({
                [currState]: [...Data]
            });
        }).catch(ex => {
        });
    }


}
export default withRouter(Expenses)
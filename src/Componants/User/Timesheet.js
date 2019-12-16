import React, { Component, Fragment } from 'react'

import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import NotifiMsg from '../publicComponants/NotifiMsg';
import Api from '../../api'
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from '../../resources.json';
import DatePicker from '../OptionsPanels/DatePicker'
import moment from 'moment';
import { withRouter } from "react-router-dom";
import GridSetup from "../../Pages/Communication/GridSetup";
import Export from "../OptionsPanels/Export";
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

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

class Timesheet extends Component {
    constructor(props) {
        super(props)

        const columnsGrid = [
            {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            },
            {
                key: "description",
                name: Resources["description"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
                filterable: true,
            },
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
                filterable: true,

            },
            {
                key: "expenseValue",
                name: Resources["hours"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            },
            {
                key: "approvalStatusName",
                name: Resources["status"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            },
            {
                key: "comment",
                name: Resources["comment"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

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
        };
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
        this.props.history.push({
            pathname: 'AddTimeSheet'
        })
    }

    addLateTimesheet = () => {
        this.props.history.push({
            pathname: 'LateTimeSheet'
        })
    }

    componentDidMount = () => {
        this.GetData("GetAccountsProjectsByIdForList", 'projectName', 'projectId', 'Projects');
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
            Api.post('GetTimeSheetByRange', { projectId: this.state.projectId, startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(
                result => {
                    this.setState({
                        rows: result,
                        isLoading: false,
                        btnisLoading: false,
                        Loading: false,
                        totalRows: result.length
                    })
                }, this.setState({ isLoading: true })
            );
        }

        else {
            this.setState({ btnisLoading: true, Loading: true })
            Api.post('GetTimeSheetByRange', { startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: this.state.pageNumber, pageSize: this.state.pageSize }).then(
                result => {
                    this.setState({
                        rows: result,
                        isLoading: false,
                        btnisLoading: false,
                        Loading: false,
                        totalRows: result.length
                    });
                }, this.setState({ isLoading: true })
            );
        }
    }

    sendRequest = () => {
        this.setState({ isLoadingsendRequest: true, statusClassSuccess: "disNone" })
        Api.post('GetTimeSheetByRangePending', { projectId: this.state.projectId, startDate: this.state.startDate, finishDate: this.state.finishDate, pageNumber: 0, pageSize: 200 }).then(
            result => {
                this.setState({ isLoadingsendRequest: false, statusClassSuccess: "animationBlock" })
            }, this.setState({ statusClassSuccess: "disNone" })
        )
    }

    render() {

        const btnExport =
            <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={this.state.columns} fileName={Resources['timeSheet'][currentLanguage]} />


        return (

            <div className="main__fulldash--container">
                <div className="resetPassword">
                    <NotifiMsg statusClass={this.state.statusClassSuccess} IsSuccess="true" Msg={Resources['successAlert'][currentLanguage]} />

                    <div className="submittalFilter">
                        <div className="subFilter">
                            <h3 className="zero"> {Resources['timeSheet'][currentLanguage]}</h3>
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
                            {this.state.isLoadingsendRequest === false ?
                                <button className="primaryBtn-1 btn" onClick={this.sendRequest} >
                                    {Resources['sendRequest'][currentLanguage]}</button>
                                : <button className="primaryBtn-1 btn"   >
                                    <div className="spinner">
                                        <div className="bounce1" />
                                        <div className="bounce2" />
                                        <div className="bounce3" />
                                    </div>
                                </button>
                            }
                            <button onClick={this.addLateTimesheet} style={{ marginRight: '8px' }} className="primaryBtn-2 btn mediumBtn">Add Late Timesheet</button>
                        </div>
                        <div className="filterBTNS">

                            <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.addRecord()}>New</button>
                            {btnExport}
                        </div>


                        <div className="rowsPaginations">
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
                                    handleChange={this.ProjectshandleChange} placeholder='Projects' styles= {filterStyle}/>
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
                        </div>
                    </div>

                    <div className="overTimeWrapper">
                        {this.state.Loading ? <LoadingSection /> : null}
                        {this.state.isLoading == false

                            ? <GridSetup columns={this.state.columns} rows={this.state.rows} showCheckbox={false} />

                            : <div className={this.state.isLoading == false ? "disNone" : ""}> <GridSetup columns={this.state.columns} showCheckbox={false} /></div>}
                    </div>
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
export default withRouter(Timesheet)
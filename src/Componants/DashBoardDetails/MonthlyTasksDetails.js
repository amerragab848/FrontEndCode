import React, { Component, Fragment } from 'react'
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Api from '../../api';
import { Formik, Form } from 'formik';
import Resources from '../../resources.json';
import DatePicker from '../OptionsPanels/DatePicker'
import Dropdown from "../OptionsPanels/DropdownMelcous";
import moment from 'moment';
import GridSetup from "../../Pages/Communication/GridSetup";
import Export from "../../Componants/OptionsPanels/Export";
import { truncateSync } from 'fs';
import fastForward from 'material-ui/svg-icons/av/fast-forward';



let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};


export default class MonthlyTasksDetails extends Component {
    constructor(props) {
        super(props)

        const columnsGrid = [
            {
                key: "arrange",
                name: Resources["arrange"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
                // formatter: dateFormate
            },

            {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
                // formatter: dateFormate
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
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
                filterable: true,
                formatter: dateFormate

            },
            {
                key: "finishDate",
                name: Resources["finishDate"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,
                formatter: dateFormate

            },
            {
                key: "bicCompanyName",
                name: Resources["CompanyName"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            },
            {
                key: "bicContactName",
                name: Resources["ContactName"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            },
            {
                key: "remaining",
                name: Resources["remaining"][currentLanguage],
                width: "50%",
                draggable: true,
                sortable: true,
                resizable: true,
                sortDescendingFirst: true,

            }
        ];

        this.state = {
            renderGrid: false,
            startDate: moment(),
            finishDate: moment(),
            contactId: '',
            columns: columnsGrid,
            isLoading: true,
            rows: [],
            btnisLoading: false,
            Loading: false,
            totalRows: 0,
            Contacts: [],
            ContactIsEmpty: true,
            valid: false
        };
    }

    ContacthandleChange = (e) => {
        this.setState({
            contactId: e.value,
            ContactIsEmpty: false,
            valid: false
        })
    }

    startDatehandleChange = (date) => {
        this.setState({ startDate: date });
    }

    finishDatehandleChange = (date) => {
        this.setState({ finishDate: date });
    }

    ViewReport = () => {
        if (this.state.ContactIsEmpty === false) {
            this.setState({
                btnisLoading: true,
                Loading: true
            })

            Api.post('GetMonthlyTaskDetailsByContactId', { startDate: this.state.startDate, finishDate: this.state.finishDate, contactId: this.state.contactId }).then(
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
            this.setState({
                valid: true,
            })
        }

    }

    componentDidMount = () => {
        Api.get('GetMonthlyTaskDetails').then(res => {
            this.setState({
                renderGrid: true, rows: res
            })
        }
        )
        this.GetData("GetAllContactsWithUser", 'contactName', 'id', 'Contacts');
    }


    render() {
        const btnExport =
            <Export rows={this.state.rows} columns={this.state.columns} fileName={Resources['monthlyTasks'][currentLanguage]} />
        return (

            <div className="mainContainer">
                <div className="resetPassword">
                    <div className="submittalFilter">
                        <div className="subFilter">
                            <h3 className="zero"> {Resources['monthlyTasks'][currentLanguage]}</h3>
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
                        </div>
                        <div className="rowsPaginations">
                            <div className="rowsPagiRange">
                                <span>{this.state.rows.length}</span> of
                            <span>{this.state.rows.length}</span>
                            </div>
                        </div>
                    </div>
                    <div className="gridfillter-container">
                        <div className="fillter-status-container">


                            <div className="form-group fillterinput fillter-item-c">

                                <div className={this.state.valid ? "has-error" : ""}>
                                    <Dropdown title='ContactName' data={this.state.Contacts}
                                        handleChange={this.ContacthandleChange} placeholder='ContactName' />
                                </div>
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

                    <div>
                        {this.state.renderGrid ?
                            <GridSetup rows={this.state.rows} columns={this.state.columns} showCheckbox={false} />
                            : null}
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
import React, { Component, Fragment } from 'react'
import ReactTable from "react-table";
import 'react-table/react-table.css';
import Api from '../../api';
import _ from "lodash";
import Recycle from '../../Styles/images/attacheRecycle.png'
import Resources from '../../resources.json';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');


class AddTimeSheet_Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            TimeSheetData: []
        }
    }
    componentDidMount = () => {
        Api.get("GetTimeSheetByDate?date=2019-02-11T16%3A16%3A05%2B02%3A00").then(
            res => {
                this.setState({
                    TimeSheetData: res
                })
            }
        )
    }
    Delete=()=>{
        alert("Delete")
    }

    render() {
        const items = this.state.TimeSheetData;
        let count = [];
        const allItems = items.length ? (items.map(item => {
            count.push(item.workHours);
            return (
                <Fragment>

                    {item.workHours === 0 ?
                        <Fragment>
                            <tr>

                                <td className="fullColumn" colSpan="8">
                                    <div className="contentCell tableCell-2">
                                        <a className="pdfPopup various zero">{item.projectName} </a>
                                    </div>
                                </td>
                            </tr>
                            {item.tasks.map(i => {
                                count.push(i.workHours)
                                return (

                                    <tr>
                                        <td className="removeTr">
                                            <div className="contentCell tableCell-1">
                                                <span className="pdfImage" onClick={this.Delete}>
                                                    <img src={Recycle} alt="pdf"  />
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-2">
                                                <a className="pdfPopup various zero">{i.taskName} </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-2">
                                                <a className="pdfPopup various zero">{i.taskProgress} </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-2">
                                                <a className="pdfPopup various zero">{i.workHours} </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contentCell tableCell-2">
                                                <a className="pdfPopup various zero">{i.workHours + "Hr(s)"}</a>
                                            </div>
                                        </td>

                                    </tr>
                                )
                            })}
                        </Fragment>
                        :
                        <tr>
                            <td>
                                <div className="contentCell tableCell-2">
                                    <a className="pdfPopup various zero">{item.projectName} </a>
                                </div>
                            </td>
                            <td>
                                <div className="contentCell tableCell-2">
                                    <a className="pdfPopup various zero">{item.workHours} </a>
                                </div>
                            </td>
                            <td>
                                <div className="contentCell tableCell-2">
                                    <a className="pdfPopup various zero">{item.workHours + "Hr(s)"}</a>
                                </div>
                            </td>
                        </tr>
                    }

                </Fragment>
            )
        })
        )
            : (<p>No items</p>)
        console.log(count)

        let total = _.sum(count); console.log(total)
        return (
            <div className="container">
                <table className="attachmentTable">
                    <thead>
                        <tr>
                            <th>
                                <div className="headCell tableCell-1">
                                    <span> </span>
                                </div>
                            </th>
                            <th>
                                <div className="headCell tableCell-2">
                                    <span>Task Name</span>
                                </div>
                            </th>
                            <th>
                                <div className="headCell tableCell-3">
                                    <span>Task Status</span>
                                </div>
                            </th>
                            <th>
                                <div className="headCell tableCell-3">
                                    <span>Working Hours</span>
                                </div>
                            </th>

                            <th>
                                <div className="headCell tableCell-4">
                                    <span>Total Hr(s)</span>
                                </div>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                        {allItems}

                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="4"><p>Total Hr(s)</p></td>
                            <td colSpan="4"><p>{total+"Hr(s)"}</p></td>
                        </tr>
                    </tfoot>
                </table>
                
            </div>
        )
    }
}
export default AddTimeSheet_Table;
import React, { Component, Fragment } from 'react';
import Resources from "../../resources.json";
import dataservice from "../../Dataservice";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class viewDistributionList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: []
        }
    }

    componentDidMount() {
        dataservice.GetDataGrid(`GetDistributionComments?id=${this.props.id}&docType=${this.props.docType}`).then(result => {
            this.setState({
                rows: result || []
            })
        })
    }

    render() {
        let ReactTBLColumns = this.state.rows.map((item, index) => {
            return (
                <tr key={index}>
                    <td>
                        <div className="contentCell tableCell-3">
                            <p className="zero status">
                                {item.contact}
                            </p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-4">
                            <p className="zero">
                                {item.action}
                            </p>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-4">
                            <p className="zero">
                                {item.comment}
                            </p>
                        </div>
                    </td>
                </tr>
            );
        })

        return (
            <div>
                {this.state.rows.length > 0 ?
                    <Fragment>
                        <header><h2 class="zero">{Resources.distributionList[currentLanguage]}</h2></header>
                        <table className="attachmentTable">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="headCell tableCell-1">
                                            <span>
                                                {Resources["ContactName"][currentLanguage]}
                                            </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="headCell tableCell-2">
                                            <span>
                                                {Resources["action"][currentLanguage]}
                                            </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="headCell tableCell-3">
                                            <span>
                                                {Resources["comment"][currentLanguage]}
                                            </span>
                                        </div>
                                    </th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>{ReactTBLColumns}</tbody>
                        </table>
                    </Fragment> : null}
            </div>
        )
    }
}

export default viewDistributionList;


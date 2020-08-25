import React, { Component, Fragment } from 'react'
import Api from '../../api'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as communicationActions from '../../store/actions/communication';
import CommentImg from "../../Styles/images/flowComment.png"

class PreviousVersions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            versions: {
                projectId: this.props.projectId,
                docId: this.props.docId,
                docType: this.props.docTypeId,
                docAlertId: this.props.document.docAlertId,
                arrange: "",
                subject: this.props.document.subject,
                status: 'true',
                docDate: moment(),
                showPopup: false,
                bodyList: []
            },
            selectedOption: 'true',
            submitLoading: false,
            prevVersions: []
        }
    }
    startDatehandleChange = (date) => {
        this.setState({ versions: { ...this.state.versions, docDate: date } });
    }
    componentDidMount = () => {
        Api.get("GetAccountsDocLogByDocAlertId?docAlertId=" + this.state.versions.docAlertId).then(result => {
            var data = result != null ? result : [];

            this.setState({
                prevVersions: data
            });
        });
    };

    showPopup(e) {
        var newList = [];
        var obj = {};
        if (e != "") {
            e.forEach(item => {
                if (item != "") {
                    let prop = item.split(':')[0];
                    let value = item.split(':')[1];

                    (prop.toLowerCase().includes("date")) ? (obj[prop] = value.trim().split(" ")[0]) : (obj[prop] = value);
                }
            });
            newList.push(obj);

            this.setState({
                showPopup: true,
                bodyList: newList
            });
        }
    }

    closePopup(e) {
        this.setState({
            showPopup: false
        });
    }
    drawColumns() {
        let bodyList = this.state.bodyList[0];
        return <ul>
            {Object.keys(bodyList).map(function (key) {
                return (
                    <ul>
                        <li style={{
                            fontSize: '16px',
                            fontWeight: '700'
                        }}>
                            {`${key}:`}
                        </li>
                        <li>
                            {`${bodyList[key]}`}
                        </li>
                    </ul>
                );
            })};
            </ul>
    }
    /* {bodyList.map((key, item) => {
                               if (item != "") {
                                   return (
                                       <ul>
                                           <li style={{
                                               fontSize: '16px',
                                               fontWeight: '700'
                                           }}>
                                               {key + ' : '}
                                           </li>
                                           <li>
                                               {item}
                                           </li>
                                       </ul>)
                               }
                           })} */



    render() {
        return (
            <Fragment>
                {(this.state.showPopup === true) ? (
                    <div className={this.state.showPopup === true ? "popupMedium active" : "popupMedium"}>
                        <button onClick={(e) => this.closePopup()} className="workflowComment__closeBtn" type="button"> x </button>
                        <div className={this.state.showPopup === true ? "ui modal smallModal active workflowComment" : "ui modal smallModal workflowComment"} id="smallModal2">
                            <h2 className="header zero">Body List</h2>
                            {this.drawColumns()}
                            <button onClick={(e) => this.closePopup()} type="button" className="smallBtn primaryBtn-1 btn approve">Close</button>
                        </div>
                    </div>
                ) : null}
                <div className="dropWrapper">
                    <table className="attachmentTable">
                        <thead>
                            <tr>
                                <th>
                                    <div className="headCell">
                                        <span>
                                            Edit By
                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell">
                                        <span>
                                            Edit Date
                    </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell">
                                        <span>
                                            Subject
                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell">
                                        <span>
                                            status
                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell">
                                        <span>
                                            Other
                        </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.prevVersions.map((ele, index) => {
                                    let formatData = moment(ele.editDate).format('DD/MM/YYYY')
                                    let bodyList = ele.body ? ele.body.split(',') : []
                                    return (
                                        <tr>
                                            <td colSpan="1">
                                                <div className="contentCell" style={{ paddingLeft: '16px' }}>
                                                    <a data-toggle="tooltip" >
                                                        {ele.lastEditBy}
                                                    </a>
                                                </div>
                                            </td>
                                            <td colSpan="1">
                                                <div className="contentCell" style={{ paddingLeft: '16px' }}>
                                                    <a data-toggle="tooltip" >
                                                        {formatData}
                                                    </a>
                                                </div>
                                            </td>

                                            <td colSpan="1">
                                                <div className="contentCell" style={{ paddingLeft: '16px' }}>
                                                    <a data-toggle="tooltip" title={ele.subject}>
                                                        {ele.subject}
                                                    </a>
                                                </div>
                                            </td>
                                            <td colSpan="1">
                                                <div className="contentCell" style={{ paddingLeft: '16px' }}>

                                                    <a data-toggle="tooltip">
                                                        {ele.statusName}
                                                    </a>
                                                </div>
                                            </td>
                                            <td colSpan="1">
                                                {bodyList ?
                                                    <div className="contentCell">
                                                        <a data-toggle="tooltip">
                                                            {bodyList}
                                                        </a>
                                                        <img src={CommentImg} alt="Cooment" onClick={e => this.showPopup(bodyList)} />
                                                    </div>
                                                    : null}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </Fragment>
        )
    }
}
function mapStateToProps(state) {
    return {
        document: state.communication.document,
        showModal: state.communication.showModal
    }
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(PreviousVersions);
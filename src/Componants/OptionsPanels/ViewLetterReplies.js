import React, { Component, Fragment } from "react"; 
import CryptoJS from "crypto-js";
import Api from "../../api";
import Resources from "../../resources.json"; 
import { connect } from "react-redux"; 
import { bindActionCreators } from "redux"; 
import * as communicationActions from "../../store/actions/communication"; 

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class ViewLetterReplies extends Component {

    constructor(props) {

        super(props);

        this.state = {
            docTypeId: this.props.docTypeId,
            docId: this.props.docId,
            projectId: this.props.projectId,
            repliesData: [],
            replystatus: 'true', 
            api: 'GetAllRepliesByLetterId?letterId=',
            repliesApi: 'GetLettersByReplyId?letterId='
        };
    }

    componentDidMount() {
        this.getReplies('true');
    }

    getReplies(viewRepliesOn) {
        if (this.props.docId > 0) {
            let url = (viewRepliesOn == 'true' ? this.state.repliesApi : this.state.api) + this.props.docId;
            this.GetLogData(url);
        }
    }

    GetLogData(url) {
        let replystatus = this.state.replystatus;
        Api.get(url, undefined, 1).then(result => {
            result.forEach(row => {
                let subject = '';
                if (row) {
                    let id = replystatus == 'false' ? row.letterId : row.replyId;
                    let obj = {
                        docId: id,
                        projectId: row.projectId,
                        projectName: row.projectName,
                        arrange: 0,
                        docApprovalId: 0,
                        isApproveMode: false,
                        perviousRoute:
                            window.location.pathname + window.location.search,
                    };
                    let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

                    let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

                    let addView = 'LettersAddEdit';
                    var doc_view = addView + '?id=' + encodedPaylod;

                    subject = doc_view;
                }
                row.link = subject;
            });
            this.setState({
                repliesData: result,
            });
        });
    }

    handleChange(e, field) {
        let replystatus = e.target.value;
  
        this.getReplies(replystatus);

        this.setState({
            replystatus: replystatus
        });
    }
    navigateToReplyFromTable(rowObj) {
        let replystatus = this.state.replystatus;
        let addView = 'LettersAddEdit';
        let id = replystatus == 'false' ? rowObj.letterId : rowObj.replyId ;
        let obj = {
            docId: id,
            prevLetterId: 0,
            replyFromCompId: rowObj.replyFromCompId,
            replyFromContId: rowObj.replyFromContId,
            replyToCompId: rowObj.replyToCompId,
            replyToContactId: rowObj.replyToContactId,
            projectId: rowObj.projectId,
            projectName: rowObj.projectName,
            arrange: 0,
            docApprovalId: 0,
            docAlertId: 0,
            isApproveMode: false,
            perviousRoute: window.location.pathname + window.location.search,
        };

        let parms = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));

        let encodedPaylod = CryptoJS.enc.Base64.stringify(parms);

        var url = addView + '?id=' + encodedPaylod;
        var win = window.open(url, '_blank');

        win.focus();
    }

    render() {
        let repliesTabel = this.state.repliesData.map((ele, index) => {
            return (
                <tr key={ele.id}> 
                    <td>
                        <div>
                            <a href="" data-toggle="tooltip"  title={ele.subject != null ? ele.subject : ''} onContextMenu={() => this.navigateToReplyFromTable(ele, index)} onClick={() => this.navigateToReplyFromTable(ele, index)}>
                                {ele.subject}
                            </a>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell">
                            <a data-toggle="tooltip" title={ele.projectName != null ? ele.projectName : ''}>
                                {ele.projectName}
                            </a>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell">
                            <a data-toggle="tooltip" title={ele.fromCompanyName != null ? ele.fromCompanyName : ''}>
                                {ele.fromCompanyName}
                            </a>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell">
                            <a data-toggle="tooltip" title={ele.fromContactName != null ? ele.fromContactName : ''}>
                                {ele.fromContactName}
                            </a>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell">
                            <a data-toggle="tooltip" title={ele.toCompanyName != null ? ele.toCompanyName : ''}>
                                {ele.toCompanyName}
                            </a>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell">
                            <a data-toggle="tooltip" title={ele.toContactName != null ? ele.toContactName : ''}>
                                {ele.toContactName}
                            </a>
                        </div>
                    </td>
                </tr>
            );
        });
        let ViewRepliesTabelDetails = () => {
            return (
                <Fragment>
                    <div class="linebylineInput valid-input even" style={{width:'35%'}}>
                        <label className="control-label" style={{marginRight : '3%'}}>
                            {Resources.replies[currentLanguage]}
                        </label>
                        <div className="ui checkbox radio radioBoxBlue" style={{marginRight : '3%'}}>
                            <input type="radio" name="reply-status" defaultChecked={this.state.replystatus === false ? null : 'checked'}
                                value="true" onChange={e => this.handleChange(e, 'replystatus')} />
                            <label>
                                {Resources.repliesOnLetter[currentLanguage]}
                            </label>
                        </div>
                        <div className="ui checkbox radio radioBoxBlue">
                            <input type="radio" name="reply-status" defaultChecked={this.state.replystatus === false ? 'checked' : null}
                                value="false" onChange={e => this.handleChange(e, 'replystatus')}
                            />
                            <label>
                                {Resources.replyFor[currentLanguage]}
                            </label>
                        </div>
                    </div>
                    <table className="attachmentTable">
                        <thead>
                            <tr> 
                                <th>
                                    <div className="headCell">
                                        <span>Subject</span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell">
                                        <span>ProjectName</span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell">
                                        <span>From Company</span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell">
                                        <span>From Contact</span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell">
                                        <span>To Company</span>
                                    </div>
                                </th>
                                <th>
                                    <div className="headCell">
                                        <span>To Contact </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>{repliesTabel}</tbody>
                    </table>
                </Fragment>
            );
        };
        return (
            <React.Fragment>
                <div>
                    <div className="drive__wrapper">
                        <h2 className="title">
                            {Resources['replies'][currentLanguage]}
                        </h2>
                    </div>

                </div>
                <div className="dropWrapper">
                    {ViewRepliesTabelDetails()}
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        files: state.communication.files,
        isLoadingFiles: state.communication.isLoadingFiles,
        changeStatus: state.communication.changeStatus
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewLetterReplies);

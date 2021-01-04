import React, { Component, Fragment } from 'react' 
import XSLfile from "./XSLfiel";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as communicationActions from '../../store/actions/communication';
 
import Config from "../../Services/Config.js";

class DocumentTemplate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            templates: {
                projectId: this.props.projectId,
                docId: this.props.docId,
                docType: this.props.docTypeId,
                docAlertId: this.props.document.docAlertId,
                arrange: "",
                subject: this.props.document.subject,
                status: 'true',
                docDate: moment(),
            },
            selectedOption: 'true',
            submitLoading: false,
        }
    }

    render() {
        return (
            <Fragment>
                <XSLfile key="docTemplate"
                    docId={this.state.templates.docId}
                    projectId={this.state.templates.projectId}
                    docType="docTemplate"
                    documentTemplate={true}
                    link={Config.getPublicConfiguartion().downloads + "/Downloads/Excel/documentTemplate.xlsx"}
                    header="addManyItems"
                    afterUpload={() => { }} />
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
export default connect(mapStateToProps, mapDispatchToProps)(DocumentTemplate);
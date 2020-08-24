import React, { Component } from 'react'
import Api from '../../api'
import Resources from '../../resources.json';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import DatePicker from "./DatePicker";
import * as communicationActions from '../../store/actions/communication';


const validationSchema_PreviousVersions = Yup.object().shape({
    subject: Yup.string().required(Resources['subjectRequired'][currentLanguage]),
})


let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

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
            },
            selectedOption: 'true',
            submitLoading: false,
            prevVersions : []
        }
    }
    startDatehandleChange = (date) => {
        this.setState({ versions: { ...this.state.versions, docDate: date } });
    }
    componentDidMount = () => {
        Api.get("GetAccountsDocLogByDocAlertId?docAlertId=" + this.state.versions.docAlertId).then(result => {
          var data = result !=null ? result : [];
            
          this.setState({
            prevVersions: data
                  });
        });
      };
    
  
    render() {
        return (
            <Formik key="create-trans-panel-form"
                validationSchema={validationSchema_PreviousVersions}
                initialValues={{ ...this.state.versions }} >
                {({ errors, touched, setFieldValue, setFieldTouched, handleBlur, handleChange }) => (
                    <Form id="create-trans-panel-form" className="proForm " noValidate="novalidate"  >
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

                                            return ( 
                                             <tr>
                                               <td colSpan="1">
                                                   <div className="contentCell" style={{  paddingLeft: '16px' }}>
                                                   <a data-toggle="tooltip" >
                                                           {ele.lastEditBy}
                                                       </a>
                                                   </div>
                                               </td>
                                               <td colSpan="1">
                                                   <div className="contentCell" style={{  paddingLeft: '16px' }}>
                                                   <a data-toggle="tooltip" >
                                                           {formatData}
                                                       </a>
                                                   </div>
                                               </td>
                                                                   
                                               <td colSpan="1">
                                                   <div className="contentCell" style={{  paddingLeft: '16px' }}>
                                                   <a data-toggle="tooltip" title={ele.subject}>
                                                           {ele.subject}
                                                       </a>
                                                   </div>
                                               </td>
                                               <td colSpan="1">
                                                   <div className="contentCell" style={{  paddingLeft: '16px' }}>
                                                 
                                                      <a data-toggle="tooltip">
                                                           {ele.statusName}
                                                       </a>
                                                   </div>
                                               </td>   
                                               <td colSpan="1">
                                                   <div className="contentCell tableCell-2">
                                                       <a data-toggle="tooltip" title={ele.body}>
                                                           {ele.body}
                                                       </a>
                                                   </div>
                                               </td> 
                                             </tr>  
                                        )})
                                    }
                                </tbody> 
                            </table>
                        </div>
                    </Form>
                )}
            </Formik>
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
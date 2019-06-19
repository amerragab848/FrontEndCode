import React, { Component, Fragment } from "react";

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import Api from "../../api";
import LoadingSection from "../publicComponants/LoadingSection";
import ConfirmationModal from "../publicComponants/ConfirmationModal";
import Resources from "../../resources.json";
import { withRouter } from "react-router-dom";
import Recycle from '../../Styles/images/attacheRecycle.png'
import { connect } from 'react-redux';
import {
    bindActionCreators
} from 'redux';
import * as communicationActions from '../../store/actions/communication';
import { toast } from "react-toastify";
import _ from "lodash";
import moment from 'moment';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const ValidtionSchema = Yup.object().shape({
    description: Yup.string()
        .required(Resources['descriptionRequired'][currentLanguage])
        .max(500, Resources['maxLength'][currentLanguage]),
})

class RiskCause extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            rows: [],
            riskId: this.props.riskId,
            showDeleteModal: false,
            rowId: 0,
            index: -1
        }
    }

    componentWillMount = () => {
          Api.get('GetRiskCause?riskId='+this.state.riskId).then(result => {
              this.setState({
                  rows: result,
              })
          })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.riskId !== this.props.riskId) {
            Api.get('GetRiskCause?riskId=' + this.state.riskId).then(result => {
                this.setState({
                    rows: result,
                    riskId: nextProps.riskId
                })
            })
        }
    }

    DeleteItem = (rowId, index) => {
        if (index === undefined) {
            this.setState({
                showDeleteModal: true,
                rowId: rowId,
            })
        }
        else {
            this.setState({
                showDeleteModal: true,
                rowId: rowId,
                index: index
            })
        }
    }

    ConfirmationDelete = () => {

        this.setState({ isLoading: true })
        let Data = this.state.rows;
        Data.splice(this.state.index, 1);
        Api.post("DeleteRiskCause?id=" + this.state.rowId).then(
            res => {
                this.setState({
                    showDeleteModal: false,
                    isLoading: false,
                    rows: Data
                })
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }
        ).catch(ex => {
            this.setState({
                showDeleteModal: false,
                isLoading: false,
            });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
    }

    AddItem = (values) => {
        this.setState({ isLoading: true })
        dataservice.addObject('AddRiskCause', {
            id: undefined,
            riskId: 1,
            comment: values.description,
            addedDate: moment()
        }).then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }
        ).catch(ex => {
            this.setState({ isLoading: false })
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
        values.description = ''
    }

    render() {

        let RenderRiskTable = this.state.rows.map((item, index) => {
            return (
                this.state.isLoading === false ?
                    <tr key={item.id}>
                        <td className="removeTr">
                            <div className="contentCell tableCell-1">
                                <span className="pdfImage" onClick={() => this.DeleteItem(item.id, index)} >
                                    <img src={Recycle} alt="pdf" />
                                </span>
                            </div>
                        </td>
                        <td>
                            <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.comment}</div>
                        </td>

                    </tr>
                    : <LoadingSection /> )
        })

        return (
            <div className="mainContainer">
                <div className="documents-stepper noTabs__document one__tab one_step">
                    <div className="doc-container">
                        <div className="step-content">
                            <div className="document-fields">
                                <div className="dropWrapper">
                                    <Formik
                                        validationSchema={ValidtionSchema}
                                        initialValues={{
                                            description: '',
                                        }}
                                        onSubmit={(values) => {
                                            this.AddItem(values)
                                        }} >
                                        {({ errors, touched, handleBlur, handleChange, values }) => (
                                            <Form id="distributionForm1" className="proForm customProform" noValidate="novalidate" >
                                                <div className="doc-input-btn customeError" style={{ border: 'none' }}>
                                                    <div className="fullInputWidth fillter-item-c ">
                                                        <label className="control-label"> {Resources['description'][currentLanguage]}</label>
                                                        <div className={"inputDev ui input " + (errors.description && touched.description ? (" has-error") : !errors.description && touched.description ? (" has-success") : " ")} >
                                                            <input name='description' autoComplete='off' id='description'
                                                                value={values.description} className="form-control" placeholder={Resources['description'][currentLanguage]}
                                                                onBlur={(e) => { handleBlur(e) }}
                                                                onChange={(e) => {
                                                                    handleChange(e)
                                                                }} />
                                                            {errors.description && touched.description ? (<em className="pError">{errors.description}</em>) : null}
                                                        </div>
                                                    </div>
                                                    <button className="primaryBtn-1 btn mediumBtn" type="submit"  >{Resources['add'][currentLanguage]}</button>
                                                </div>
                                                <div className="doc-pre-cycle letterFullWidth">

                                                    <div className='document-fields'>
                                                        <header style={{ paddingTop: '0' }}>
                                                            <h2 className="zero">{Resources['riskCause'][currentLanguage]}</h2>
                                                        </header>
                                                        <table className="attachmentTable">
                                                            <thead>
                                                                <tr>
                                                                    <th>
                                                                        <div className="headCell tableCell-1">{Resources['delete'][currentLanguage]}</div>
                                                                    </th>

                                                                    <th>
                                                                        <div className="headCell"> {Resources['description'][currentLanguage]}</div>
                                                                    </th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {RenderRiskTable}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div >
                            </div>
                        </div>
                    </div>

                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={e => this.setState({ showDeleteModal: true })}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={e => this.setState({ showDeleteModal: false })}
                            buttonName='delete' clickHandlerContinue={this.ConfirmationDelete}
                        />
                    ) : null}
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return { showModal: state.communication.showModal }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(communicationActions, dispatch) }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(RiskCause);
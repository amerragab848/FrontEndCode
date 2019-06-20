import React, { Component } from "react";

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice";
import LoadingSection from "../publicComponants/LoadingSection";
import ConfirmationModal from "../publicComponants/ConfirmationModal";
import Resources from "../../resources.json";
import Recycle from '../../Styles/images/attacheRecycle.png'
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
        let rows = this.state.rows;
        if (rows.length == 0) {
            dataservice.GetDataGrid('GetRiskCause?riskId=' + this.state.riskId).then(result => {
                if (result) {
                    this.setState({
                        rows: result,
                        isLoading: false
                    })
                }
            })

        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.riskId !== this.props.riskId) {
            dataservice.GetDataGrid('GetRiskCause?riskId=' + this.state.riskId).then(result => {
                if (result) {
                    this.setState({
                        rows: result,
                        riskId: nextProps.riskId
                    })
                }
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
        dataservice.GetDataGridPost("DeleteRiskCause?id=" + this.state.rowId).then(res => {
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
            riskId: this.state.riskId,
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
                    : <LoadingSection />)
        })

        return (
            <div className="doc-pre-cycle letterFullWidth">
                <div className="document-fields">
                    <header style={{ paddingTop: '0' }}>
                        <h2 className="zero">{Resources['riskCause'][currentLanguage]}</h2>
                    </header>
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
                                        <div className="fillter-item-c fullInputWidth">
                                            <label className="control-label"> {Resources['description'][currentLanguage]}</label>
                                            <div className={"inputDev ui input" + (errors.description && touched.description ? (" has-error") : !errors.description && touched.description ? (" has-success") : " ")} >
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

                                </Form>
                            )}
                        </Formik>

                        <div className="doc-pre-cycle letterFullWidth">
                            <div className='document-fields'>
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
            </div>
        );
    }
}
export default RiskCause;
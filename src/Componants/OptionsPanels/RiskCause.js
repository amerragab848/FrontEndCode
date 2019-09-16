import React, { Component } from "react";

import dataservice from "../../Dataservice";
import LoadingSection from "../publicComponants/LoadingSection";
import ConfirmationModal from "../publicComponants/ConfirmationModal";
import Resources from "../../resources.json"; 
import { toast } from "react-toastify";
import moment from 'moment';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    description: Yup.string().required(Resources['descriptionRequired'][currentLanguage])
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
            index: -1,
            description: '',
            hasError: false
        }
    }

    componentWillMount = () => {
        let rows = this.state.rows;
        if (rows.length == 0 && this.state.riskId > 0) {
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
        if (nextProps.riskId !== this.props.riskId && nextProps.riskId > 0) {
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

    DeleteItem = (rowId) => {
        this.setState({
            showDeleteModal: true,
            rowId: rowId,
        })
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

        this.setState({ isLoading: true });

        dataservice.addObject('AddRiskCause', {
            id: undefined,
            riskId: this.state.riskId,
            comment: values.description,
            addedDate: moment()
        }).then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false,
                    description: ''
                })
                toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
            }
        ).catch(ex => {
            this.setState({
                isLoading: false,
                description: ''
            })
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
        values.description = ''

    }


    render() {

        let RenderRiskTable = this.state.rows.map((item, index) => {
            return (
                this.state.isLoading === false ?
                    <li key={item.id + '-' + index}>
                        <p className="zero">{item.comment}</p>
                        <span onClick={() => this.DeleteItem(item.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16"
                                height="16" viewBox="0 0 16 16">
                                <g fill="none" fillRule="evenodd" transform="translate(1)">
                                    <g fill="#CCD2DB" mask="url(#b)">
                                        <path id="a"
                                            d="M5.628 2.771h2.748v-.805H5.628v.805zm5.094 1.972H3.278l.711 8.292h6.022l.71-8.292zm-9.38.015C1.106 4.73.88 4.73.67 4.676c-.444-.115-.712-.56-.663-1.05.04-.42.422-.8.846-.837.14-.012.28-.01.42-.01h2.414V2.62 1.052c.002-.643.4-1.05 1.034-1.05C6.24 0 7.76-.002 9.28.001c.634 0 1.028.405 1.03 1.052.003.518.001 1.037.001 1.555v.17h.166c.837 0 1.674-.002 2.51.001.471.002.822.244.957.65.22.661-.226 1.28-.938 1.303-.112.003-.224 0-.347 0l-.086.967a8623.91 8623.91 0 0 0-.711 8.355c-.048.567-.442.943-1.004.944H3.15c-.575 0-.96-.368-1.01-.95l-.533-6.203c-.086-1-.169-2-.254-3-.002-.031-.008-.063-.01-.088zm6.065 3.795c0-.394.015-.789-.004-1.182-.028-.6.452-1.035.93-1.038.574-.005.994.402 1.002 1.012.012.82.01 1.64 0 2.46-.006.54-.378.93-.907.984-.451.045-.884-.28-.998-.755a1.21 1.21 0 0 1-.022-.272c-.002-.403-.001-.806-.001-1.21zm-2.741 0c0-.412-.004-.825.001-1.237.006-.472.32-.864.751-.954a.955.955 0 0 1 1.174.932c.015.847.012 1.695 0 2.543a.953.953 0 0 1-.75.925c-.455.095-.881-.105-1.079-.534a1.188 1.188 0 0 1-.093-.451c-.012-.408-.004-.816-.004-1.224z">
                                        </path>
                                    </g>
                                </g>
                            </svg>
                        </span>
                    </li>
                    : <LoadingSection />)
        })

        return (
            <div className="doc-pre-cycle letterFullWidth" >
                <div className="document-fields">
                    <header className="subHeader" style={{ paddingTop: '0', paddingBottom: "0" }}>
                        <h2 className="zero">{Resources['riskCause'][currentLanguage]}</h2>
                    </header>
                    <div className="dropWrapper proForm">
                        <Formik initialValues={{
                            description: ''
                        }}
                            validationSchema={validationSchema}
                            enableReinitialize={true}
                            onSubmit={(values) => { 
                                if (values.isSecondButton) {
                                    this.AddItem(values)
                                }


                            }}>
                            {({ errors, touched, handleBlur, handleChange, handleSubmit, values, setFieldValue }) => (
                                <Form id="QsForm" className="customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                    <div className="doc-input-btn customeError" style={{ border: 'none' }}>
                                        <div className="letterFullWidth fullInputWidth" style={{ marginBottom: '0' }}>
                                            <label className="control-label"> {Resources['description'][currentLanguage]}</label>
                                            <div className={"ui input inputDev " + (errors.description && touched.description ? (" has-error") : " ")}>
                                                <input name='description' autoComplete='off' id='description' name='description'
                                                    value={values.description} className="form-control"
                                                    placeholder={Resources['description'][currentLanguage]}
                                                    onBlur={handleBlur} onChange={handleChange} />
                                                {errors.description ? (<em className="pError">{errors.description}</em>) : null}
                                            </div>

                                        </div>
                                        <button type="submit" className="primaryBtn-1 btn mediumBtn" onClick={(e) => {
                                            setFieldValue('isSecondButton', true)
                                        }}>{Resources['add'][currentLanguage]}</button>
                                    </div>

                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div className='document-fields'>
                                            <ul className="ul__deleteHover">
                                                {RenderRiskTable}
                                            </ul>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
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
export default RiskCause;
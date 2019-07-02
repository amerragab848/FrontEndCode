import React, { Component } from "react";

import dataservice from "../../Dataservice";
import LoadingSection from "../publicComponants/LoadingSection";
import ConfirmationModal from "../publicComponants/ConfirmationModal";
import Resources from "../../resources.json";
import Recycle from '../../Styles/images/attacheRecycle.png'
import { toast } from "react-toastify";
import _ from "lodash";
import moment from 'moment';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

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

        if (this.state.description.length > 0) {
            this.setState({ isLoading: true, hasError: false })

            dataservice.addObject('AddRiskCause', {
                id: undefined,
                riskId: this.state.riskId,
                comment: this.state.description,
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
        } else {
            this.setState({ hasError: true })
        }
    }

    handleChange(e) {
        this.setState({
            description: e.target.value
        });
    }

    render() {

        let RenderRiskTable = this.state.rows.map((item, index) => {
            return (
                this.state.isLoading === false ?
                    <tr key={item.id + '-' + index}>
                        <td className="removeTr">
                            <div className="contentCell tableCell-1">
                                <span className="pdfImage" onClick={(e) => this.DeleteItem(item.id)} >
                                    <img src={Recycle} alt="Delete" />
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
                    <div className="dropWrapper proForm">

                        <div className="doc-input-btn customeError" style={{ border: 'none' }}>
                            <div className="letterFullWidth fullInputWidth" style={{marginBottom : '0'}}>
                                <label className="control-label"> {Resources['description'][currentLanguage]}</label>
                                <div className={"inputDev ui input" + (this.state.hasError ? (" has-error") : " ")} >
                                    <input name='description' autoComplete='off' id='description' required
                                        value={this.state.description} className="form-control" placeholder={Resources['description'][currentLanguage]}
                                        onChange={(e) => { this.handleChange(e) }} />
                                </div>
                            </div>
                            <button className="primaryBtn-1 btn mediumBtn" type="button" onClick={e => this.AddItem(e)} >{Resources['add'][currentLanguage]}</button>
                        </div>

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
import React, { Component, Fragment } from 'react';
import Resources from "../../resources.json";
import dataservice from "../../Dataservice";
import Config from "../../Services/Config.js";
import { Formik, Form } from 'formik';
import { toast } from "react-toastify";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let contactId = Config.getPayload().cni;

class viewDistributionList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            showComment: false,
            comment: ""
        }
    }

    componentDidMount() {
        dataservice.GetDataGrid(`GetDistributionComments?id=${this.props.id}&docType=${this.props.docType}`).then(result => {
            result.map((item, index) => {
                if (contactId == item.contactId) {
                    if (item.isAction == true) {
                        this.setState({
                            showComment: true
                        })
                    }
                }
            });
            this.setState({
                rows: result || []
            })
        })
    }
    handleInputChange = (e, field) => {
        let comment = "";
        comment = e.target.value;
        this.setState({ comment: comment });
    }
    saveComment = (values) => {
        this.setState({ isLoading: true });
        let comm = this.state.comment;

        let obj = this.state.rows.filter(item => contactId == item.contactId && item.isAction == true);

        obj[0].comment = comm;

        dataservice.addObject('SaveComments', obj[0]).then(
            res => {
                this.setState({ isLoading: false, showComment: false });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(ex => {
                this.setState({ isLoading: false, showComment: false });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            })
    }
    render() {
        let ReactTBLColumns = this.state.rows.map((item, index) => {
            return (
                <tr key={index}>
                    <td style={{ width: 'auto' }}>
                        <div className="contentCell tableCell-3">
                            <p className="zero status">
                                {item.contact}
                            </p>
                        </div>
                    </td>
                    <td style={{ width: 'auto' }}>
                        <div className="contentCell tableCell-4">
                            <p className="zero">
                                {item.action}
                            </p>
                        </div>
                    </td>
                    <td style={{ width: 'auto' }}>
                        <div className="contentCell tableCell-4">
                            <p className="zero">
                                {item.comment}
                            </p>
                        </div>
                    </td>
                </tr>
            );
        })
        let RenderPopupAddEdit = () => {
            return (

                <Formik
                    initialValues={{
                        comment: this.state.comment
                    }}
                    enableReinitialize={true}
                    onSubmit={(values) => { this.saveComment(values) }}>
                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit }) => (

                        <Form className="proForm" onSubmit={handleSubmit}>
                            <div className="dropWrapper">

                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['comment'][currentLanguage]} </label>
                                    <div className={"inputDev ui input" + (errors.comment && touched.comment ?
                                        (" has-error")
                                        : !errors.comment && touched.comment ? (" has-success") : " ")} >
                                        <input
                                            name='comment'
                                            autoComplete='off'
                                            id='comment'
                                            value={this.state.comment}
                                            className="form-control"
                                            placeholder={Resources['comment'][currentLanguage]}
                                            onBlur={(e) => {
                                                handleBlur(e)
                                                handleChange(e)
                                            }}
                                            onChange={(e) => { this.handleInputChange(e, 'comment') }} />

                                        {errors.comment && touched.comment ?
                                            (<em className="pError">{errors.comment}</em>)
                                            : null}
                                    </div>
                                </div>

                                <div className="fullWidthWrapper">
                                    <button className="primaryBtn-1 btn" type='submit'>
                                        {Resources['save'][currentLanguage]}</button>
                                </div>

                            </div>
                        </Form>
                    )}
                </Formik>

            )
        }
        return (
            <div>
                {this.state.rows.length > 0 ?
                    <Fragment>
                        {this.state.showComment == true ?
                            RenderPopupAddEdit()
                            : null}
                        <header><h2 className="zero">{Resources.distributionList[currentLanguage]}</h2></header>
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


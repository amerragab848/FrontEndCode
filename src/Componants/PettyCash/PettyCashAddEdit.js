import React, { Component } from 'react';
import Dropdown from '../OptionsPanels/DropdownMelcous';
import moment from 'moment';
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import HeaderDocument from "../../Componants/OptionsPanels/HeaderDocument";
import { Formik, Form } from 'formik';
import Resources from '../../resources.json';
import DatePicker from "../../Componants/OptionsPanels/DatePicker";
import { toast } from "react-toastify";
import dataservice from "../../Dataservice";
import * as Yup from 'yup';
import LoadingSection from '../publicComponants/LoadingSection';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const validationSchema = Yup.object().shape({
    subject: Yup.string().required(Resources["subjectRequired"][currentLanguage]),
    amount: Yup.number().typeError(Resources["onlyNumbers"][currentLanguage]).required(Resources["amountRequired"][currentLanguage]),
});

class PettyCashAddEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: [],
            isLoading: false,
            document: {
                subject: '',
                projectId: '',
                date: moment().format("YYYY-MM-DD"),
                amount: '',
            },
            selectedProject: { label: Resources['projectRequired'][currentLanguage], value: 0 },
            isEdit: this.props.match.params.id > 0 ? true : false,
        };
    }

    componentDidMount() {
        dataservice.GetDataList("ProjectProjectsGetAll", "projectName", "projectId").then(result => {
            this.setState({ options: result });
        });
        if (this.state.isEdit) {
            this.setState({ isLoading: true });
            dataservice.GetDataGrid(`GetPeetyCashById?id=${this.props.match.params.id}`).then(result => {
                this.setState({
                    document: result,
                    isLoading: false,
                    selectedProject: { label: result.projectName, value: result.projectId }
                });
            });
            dataservice.GetDataGrid(`GetProjectProjectsCompaniesForList?projectId=${this.props.match.params.projectId}`).then(result => {
            });
        }
    }

    handleChangeDropDown(event, field, selectedValue, ) {
        if (event == null) return;
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = event.value;
        updated_document = Object.assign(original_document, updated_document);

        this.setState({ document: updated_document, [selectedValue]: event });

    }

    setPettyCash = (values) => {
        values.date = moment(values.date, 'YYYY-MM-DD').format('YYYY-MM-DD[T]HH:mm:ss.SSS');
        this.setState({ isLoading: true });
        if (this.state.isEdit) {
            values.projectId = this.state.selectedProject.value
            values.projectName = this.state.selectedProject.label
            dataservice.addObject("EditPeetyCashInMenu", values).then(result => {
                this.setState({ isLoading: false });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            });
        } else {
            values.projectId = this.state.selectedProject.value
            values.projectName = this.state.selectedProject.label

            this.setState({ isLoading: true });

            dataservice.addObject("AddPeetyCashInMenu", values).then(result => {
                this.setState({ isLoading: false });
                toast.success(Resources["operationSuccess"][currentLanguage]);
            });
        }
        setTimeout(() => { this.props.history.push({ pathname: '/profileSetting' }); }, 500);
    }

    render() {
        return (

            <div className="mainContainer main__fulldash white-bg">
                <div className="documents-stepper cutome__inputs noTabs__document">
                    <HeaderDocument docTitle={Resources["peetyCash"][currentLanguage]}
                        perviousRoute={'/ProfileSetting'} moduleTitle={Resources["profile"][currentLanguage]} />
                    <div className="doc-container">
                        <div className="step-content">
                            <div className="subiTabsContent">
                                <div className="document-fields">
                                    {this.state.isLoading ? <LoadingSection /> :
                                        <Formik
                                            initialValues={this.state.document}
                                            validationSchema={validationSchema}
                                            onSubmit={(values) => { this.setPettyCash(values); }}
                                        >
                                            {({ values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit }) => (
                                                <Form className="proForm customProform" noValidate="novalidate" onSubmit={handleSubmit}>
                                                    <div className="proForm datepickerContainer">

                                                        <div className="letterFullWidth fullInputWidth">
                                                            <label className="control-label">{Resources["subject"][currentLanguage]} </label>
                                                            <div className={"ui input inputDev " + (errors.subject && touched.subject ? (" has-error") : !errors.subject && touched.subject ? (" has-success") : " ")}>
                                                                <input name="subject" className="form-control" id="subject" placeholder={Resources["subject"][currentLanguage]}
                                                                    autocomplete="off" value={values.subject} onBlur={handleBlur} onChange={handleChange} />
                                                                {touched.subject ? (<em className="pError">{errors.subject}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput">
                                                            <Dropdown
                                                                title="Projects"
                                                                name="projectId"
                                                                data={this.state.options}
                                                                selectedValue={this.state.selectedProject}
                                                                handleChange={(e, value) => { setFieldValue('projectId', value.value); this.handleChangeDropDown(e, 'projectId', 'selectedProject') }}
                                                            />
                                                        </div>

                                                        <div className="linebylineInput">
                                                            <label className="control-label">{Resources["amount"][currentLanguage]}</label>
                                                            <div className={"ui input inputDev " + (errors.amount && touched.amount ? (" has-error") : !errors.amount && touched.amount ? (" has-success") : " ")}>
                                                                <input name="amount" className="form-control" id="amount" placeholder={Resources["amount"][currentLanguage]}
                                                                    autocomplete="off" value={values.amount} onBlur={handleBlur} onChange={handleChange} />
                                                                {touched.amount ? (<em className="pError">{errors.amount}</em>) : null}
                                                            </div>
                                                        </div>

                                                        <div className="linebylineInput valid-input alternativeDate">
                                                            <DatePicker
                                                                title="docDate"
                                                                startDate={values.date}
                                                                handleChange={value => setFieldValue('date', value)}
                                                            />
                                                        </div>

                                                        <div className="slider-Btns letterFullWidth">
                                                            {this.state.isLoading === false ? (
                                                                <button className="primaryBtn-1 btn largeBtn" type="submit">{Resources["save"][currentLanguage]}</button>
                                                            ) :
                                                                (
                                                                    <button className="primaryBtn-1 btn largeBtn disabled">
                                                                        <div className="spinner">
                                                                            <div className="bounce1" /><div className="bounce2" /><div className="bounce3" />
                                                                        </div>
                                                                    </button>
                                                                )}
                                                        </div>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.ConfirmDelete ? (
                    <ConfirmationModal
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.ConfirmDelete}
                        clickHandlerCancel={this.onCloseModal}
                        clickHandlerContinue={() => this.ConfirmDeleteTask()}
                        title={Resources["smartDeleteMessageContent"][currentLanguage]}
                        buttonName="delete"
                    />
                ) : null}
            </div>

        )
    }


}





export default PettyCashAddEdit;
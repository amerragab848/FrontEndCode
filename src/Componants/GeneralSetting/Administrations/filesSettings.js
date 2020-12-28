import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../publicComponants/LoadingSection";
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import Export from "../../OptionsPanels/Export";
import { SkyLightStateless } from 'react-skylight';
import { Formik, Form } from 'formik';
import config from "../../../Services/Config";
import * as Yup from 'yup';
import { toast } from "react-toastify";
import dataservice from "../../../Dataservice";
import Resources from "../../../resources.json";
import GridCustom from 'react-customized-grid';
import moment from 'moment';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};

const validationSchema = Yup.object().shape({
    replacmentText: Yup.string().required(Resources['replacmentText'][currentLanguage]),
    originalText: Yup.string().required(Resources['originalText'][currentLanguage])
})

class filesSettings extends Component {

    constructor(props) {

        super(props)

        const columnsGrid = [
            {
                field: "originalText",
                title: Resources["originalText"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 20,
                sortable: true,
                type: "text"
            },
            {
                field: "replacmentText",
                title: Resources["replacmentText"][currentLanguage],
                groupable: true,
                fixed: true,
                width: 20,
                sortable: true,
                type: "text"
            }
        ]

        this.state = {
            columns: columnsGrid,
            isLoading: false,
            rows: [],
            selectedRows: 0,
            showDeleteModal: false,
            ShowPopup: false,
            originalText: '',
            replacmentText: '',
            isAdd: true
        }

        if (!config.getPayload().uty === 'company') {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.goBack();
        }

        this.actions = [{
            title: 'Delete',
            handleClick: values => {
                this.setState({
                    showDeleteModal: true,
                    selectedRows: values
                });
            },
            classes: '',
        }];
    }

    componentDidMount = () => {

        dataservice.GetDataGrid('GetFilesSettings').then(result => {
            this.setState({ rows: result || [] });
        });
    }

    clickHandlerDeleteRowsMain = (selectedRows) => {
        this.setState({ selectedRows, showDeleteModal: true });
    }

    ConfirmDelete = () => {
        this.setState({ isLoading: true });
        dataservice.addObject('DeleteFilesSettingsByIds', this.state.selectedRows).then(res => {

            let originalData = this.state.rows;

            this.state.selectedRows.forEach(item => {
                let index = originalData.findIndex(x => x.id === item);

                if (index !== null) {
                    originalData.splice(index, 1);
                }
            });

            this.setState({
                isAdd: true,
                rows: originalData,
                showDeleteModal: false,
                isLoading: false,
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
    }

    AddSettings = (values) => {
        this.setState({ isLoading: true })

        let objSettings = {
            originalText: values.originalText,
            replacmentText: values.replacmentText
        };

        if (this.state.isAdd === true) {
            dataservice.addObject('AddFilesSettings', objSettings).then(
                result => {
                    let data = this.state.rows
                    data.push(result)
                    this.setState({ rows: data, isLoading: false, ShowPopup: false, originalText: '', replacmentText: '' });

                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });
        } else {
            dataservice.addObject('EditFilesSettings', objSettings).then(
                result => {
                    let data = this.state.rows;

                    let index = data.findIndex(x => x.id === values.id);
                    if (index) {
                        data.splice(index, 1);
                        data.push(objSettings);
                    }

                    this.setState({ rows: data, isLoading: false, ShowPopup: false, originalText: '', replacmentText: '' });

                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
                });
        }
    }


    rowClick(cell) {
        this.setState({
            ShowPopup: true,
            originalText: cell.originalText,
            replacmentText: cell.replacmentText,
            isAdd: false
        });
    }

    render() {
        const dataGrid =
            this.state.isLoading === false ?
                <GridCustom key={"GridFillesSettings"}
                    cells={this.state.columns}
                    data={this.state.rows}
                    pageSize={20000}
                    actions={this.actions}
                    rowActions={[]}
                    rowClick={cell => this.rowClick(cell)}
                    groups={[]}
                    showCheckAll={true}
                /> : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns} fileName={Resources['filesSettings'][currentLanguage]} />
            : null;

        let RenderSettings = () => {
            return (
                <div className="doc-pre-cycle">
                    <div className="subiTabsContent feilds__top">
                        <Formik
                            initialValues={{
                                originalText: this.state.originalText,
                                replacmentText: this.state.replacmentText,
                            }}
                            enableReinitialize={true}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                this.AddSettings(values)
                            }}>
                            {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                <Form onSubmit={handleSubmit}>
                                    <div className='document-fields'>
                                        <div className="proForm datepickerContainer">
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['originalText'][currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.originalText && touched.originalText ? (" has-error") : !errors.originalText && touched.originalText ? (" has-success") : " ")} >
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control" value={values.originalText} name="originalText"
                                                            onBlur={handleBlur} onChange={handleChange} placeholder={Resources['originalText'][currentLanguage]} />
                                                        {touched.originalText ? (<em className="pError">{errors.originalText}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['replacmentText'][currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.replacmentText && touched.replacmentText ? (" has-error") : !errors.replacmentText && touched.replacmentText ? (" has-success") : " ")} >
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control" value={values.replacmentText} name="replacmentText"
                                                            onBlur={handleBlur} onChange={handleChange} placeholder={Resources['replacmentText'][currentLanguage]} />
                                                        {touched.replacmentText ? (<em className="pError">{errors.replacmentText}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['save'][currentLanguage]}</button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )
        }

        return (
            <Fragment>
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero"> {Resources['filesSettings'][currentLanguage]}</h3>
                        <span>
                            <svg width="16px" height="18px" viewBox="0 0 16 18" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" >
                                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" >
                                    <g id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                        transform="translate(-4.000000, -3.000000)" >
                                    </g>
                                </g>
                            </svg>
                        </span>
                    </div>
                    <div className="filterBTNS">
                        <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.setState({ ShowPopup: true })}>New</button>
                        {btnExport}
                    </div>
                </div>
                <div className="grid-container">
                    {dataGrid}
                </div>
                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false })}
                        title={Resources['filesSettings'][currentLanguage]} isVisible={this.state.ShowPopup}
                        onCloseClicked={() => this.setState({ ShowPopup: false })} >
                        {RenderSettings()}
                    </SkyLightStateless>
                </div>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources["smartDeleteMessageContent"][currentLanguage]}
                        closed={() => this.setState({ showDeleteModal: false })}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={() => this.setState({ showDeleteModal: false })}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null}
            </Fragment>
        )
    }
}
export default withRouter(filesSettings)
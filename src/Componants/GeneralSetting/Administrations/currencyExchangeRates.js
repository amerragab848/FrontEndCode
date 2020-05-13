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
import DropdownMelcous from '../../../Componants/OptionsPanels/DropdownMelcous';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker';
import moment from 'moment';
import GridCustom from "../../../Componants/Templates/Grid/CustomGrid";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const validationDeductionSchema = Yup.object().shape({
    currency: Yup.string().required(Resources['currency'][currentLanguage]),
    currencyRates: Yup.number().required(Resources['currencyRates'][currentLanguage])
        .typeError(Resources['onlyNumbers'][currentLanguage]),
})

class currencyExchangeRates extends Component {
    constructor(props) {
        super(props)
        const columnGrid = [
            {
                field: 'currencyName',
                title: Resources['currency'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: true,
                type: "text",
                sortable: true,
            },
            {
                field: 'rate',
                title: Resources['currencyRates'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'addedByName',
                title: Resources['addedBy'][currentLanguage],
                width: 20,
                groupable: true,
                fixed: false,
                type: "text",
                sortable: true,
            },
            {
                field: 'addedDate',
                title: Resources['addedDate'][currentLanguage],
                width: 10,
                groupable: true,
                fixed: false,
                type: "date",
                sortable: true,
            }
        ]
        this.state = {
            showCheckbox: false,
            columns: columnGrid,
            isLoading: true,
            rows: [],
            selectedRow: 0,
            showDeleteModal: false,
            ShowPopup: false,
            selectedrow: '',
            addedDate: moment(),
            CurrencyData: [],
        }
        this.rowActions = [
            {
                title: 'Delete',
                handleClick: values => {
                    this.setState({ selectedRow: values.id, showDeleteModal: true });
                },
                classes: ''
            }
        ]
        if (!config.IsAllow(3744) && !config.IsAllow(3745)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.goBack();
        }
    }

    componentDidMount = () => {
        if (config.IsAllow(3746)) {
            this.setState({ showCheckbox: true });
        }

        dataservice.GetDataGrid('GetAllCurrencyRatio').then(result => {
            this.setState({ rows: result });
            dataservice.GetDataList('GetAccountsDefaultList?listType=currency&pageNumber=0&pageSize=10000', 'title', 'id').then(result => {
                this.setState({ CurrencyData: result, isLoading: false });
            });
        });
    }
    ConfirmDelete = () => {
        this.setState({ isLoading: true });
        dataservice.GetDataGridPost('DeleteCurrencyRate?currencyId=' + this.state.selectedRow).then(res => {
            let id = this.state.selectedRow[0]
            let newData = this.state.rows.filter(r => r.id !== id);
            this.setState({
                rows: newData,
                showDeleteModal: false,
                isLoading: false,
            });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
        });
    }

    AddCurrency = (values) => {
        this.setState({ isLoading: true })
        let obj = {
            currencyId: this.state.selecturrency.value, rate: values.currencyRates,
            addedDate: moment(this.state.addedDate, 'YYYY-MM-DD').format("YYYY-MM-DD[T]HH:mm:ss.SSS")
        };
        dataservice.addObject('AddCurrencyRate', obj).then(
            result => {
                let data = this.state.rows
                data.push(result)
                this.setState({ rows: data, isLoading: false, ShowPopup: false });
                values.currencyRates = ''
                values.currency = ''
                toast.success(Resources["operationSuccess"][currentLanguage]);
            }).catch(ex => {
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle)
            });
    }

    render() {
        const dataGrid =
            this.state.isLoading === false ?
                <GridCustom
                    ref='custom-data-grid'
                    key="CurrencyExchangeRates"
                    data={this.state.rows}
                    pageSize={this.state.rows.length}
                    groups={[]}
                    actions={[]}
                    rowActions={this.rowActions}
                    cells={this.state.columns}
                    rowClick={() => { }}
                />
                : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns} fileName={Resources['currencyExchangeRates'][currentLanguage]} />
            : null;

        let RenderAddCurrency = () => {
            return (
                <div className="doc-pre-cycle">
                    <div className="subiTabsContent feilds__top">
                        <Formik
                            initialValues={{
                                currency: '',
                                currencyRates: '',
                            }}
                            enableReinitialize={true}
                            validationSchema={validationDeductionSchema}
                            onSubmit={(values) => {
                                this.AddCurrency(values)
                            }}>
                            {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                <Form onSubmit={handleSubmit}>
                                    <div className='document-fields'>
                                        <div className="proForm datepickerContainer">
                                            <div className="linebylineInput valid-input">
                                                <DropdownMelcous title="currency" data={this.state.CurrencyData} name="currency"
                                                    handleChange={(e) => this.setState({ selecturrency: e })}
                                                    selectedValue={values.currency} onChange={setFieldValue} onBlur={setFieldTouched}
                                                    error={errors.currency} touched={touched.currency} value={values.currency} />
                                            </div>
                                            <div className="linebylineInput valid-input fullInputWidth">
                                                <label className="control-label">{Resources['currencyRates'][currentLanguage]}</label>
                                                <div className={"inputDev ui input" + (errors.currencyRates && touched.currencyRates ? (" has-error") : !errors.currencyRates && touched.currencyRates ? (" has-success") : " ")} >
                                                    <div className="inputDev ui input">
                                                        <input autoComplete="off" className="form-control" value={values.currencyRates} name="currencyRates"
                                                            onBlur={handleBlur} onChange={handleChange} placeholder={Resources['currencyRates'][currentLanguage]} />
                                                        {touched.currencyRates ? (<em className="pError">{errors.currencyRates}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="linebylineInput valid-input">
                                                <DatePicker title='addedDate' startDate={this.state.addedDate}
                                                    handleChange={e => this.setState({ addedDate: e })} />
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
                </div >
            )
        }

        return (
            <Fragment >
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero"> {Resources['currencyExchangeRates'][currentLanguage]}</h3>
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
                        {config.IsAllow(3745) ? <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.setState({ ShowPopup: true })}>New</button>
                            : null}
                        {btnExport}
                    </div>

                </div>
                <div className="grid-container">
                    {dataGrid}
                </div>

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false })}
                        title={Resources['currencyExchangeRates'][currentLanguage]} isVisible={this.state.ShowPopup}
                        onCloseClicked={() => this.setState({ ShowPopup: false })} >
                        {RenderAddCurrency()}
                    </SkyLightStateless>
                </div>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={() => this.setState({ showDeleteModal: false })}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={() => this.setState({ showDeleteModal: false })}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null}

            </Fragment >
        )
    }
}
export default withRouter(currencyExchangeRates)
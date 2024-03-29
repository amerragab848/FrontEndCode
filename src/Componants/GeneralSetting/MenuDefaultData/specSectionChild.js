import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom"; 
import ConfirmationModal from "../../publicComponants/ConfirmationModal"; 
import Export from "../../OptionsPanels/Export";
import { SkyLightStateless } from 'react-skylight';
import Select from '../../OptionsPanels/DropdownMelcous';
import { Formik, Form } from 'formik';
import config from "../../../Services/Config";
import * as Yup from 'yup';
import { toast } from "react-toastify";
import dataservice from "../../../Dataservice";
import Resources from "../../../resources.json";
import ReactTable from "react-table";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const ValidtionSchema = Yup.object().shape({
    title: Yup.string().required(Resources['titleEnValid'][currentLanguage]),
    titleAr: Yup.string().required(Resources['titleArValid'][currentLanguage]),
});

class specSectionChild extends Component {

    constructor(props) {
        super(props)

        this.state = {
            showCheckbox: false,
            isLoading: true,
            rows: [],
            showDeleteModal: false,
            listType: '',
            ShowPopup: false,
            specObj: {},
            IsEdit: false,
            selectedRow: '',
            specSectionData: [],
            selectedSpecSection: { label: Resources.selectSection[currentLanguage], value: "0" },
            selected: {},
        }

        if (!config.IsAllow(3342) && !config.IsAllow(3338) && !config.IsAllow(3339)) {
            toast.warn(Resources["missingPermissions"][currentLanguage]);
            this.props.history.goBack();
        }
    }

    componentDidMount = () => {

        if (config.IsAllow(3340)) {
            this.setState({ showCheckbox: true });
        }

        dataservice.GetDataList('GetAccountsDefaultList?listType=specssection&pageNumber=0&pageSize=10000', 'title', 'id').then(
            result => {
                this.setState({ specSectionData: result, isLoading: false });
            }).catch(ex => {
                this.setState({ isLoading: false });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            });
    }

    handleChangespecSection = (e) => {

        this.setState({ isLoading: true, selectedSpecSection: e });
        dataservice.GetDataGrid('GetAccountsSpecsSectionChildssBySpecSectionId?specSectionId=' + e.value).then(
            result => {
                this.setState({ rows: result, isLoading: false })
            }).catch(ex => {
                this.setState({ isLoading: false });
                toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
            });

    }

    handleInputChange = (e, field) => {
        let originalDoc = { ...this.state.specObj };
        let NewDoc = {};
        NewDoc[field] = e.target.value;
        NewDoc = Object.assign(originalDoc, NewDoc);
        this.setState({ specObj: NewDoc });
    }

    showAdd = () => {
        this.setState({
            ShowPopup: true, IsEdit: false,
            specObj: {
                title: '', titleAr: '', abbreviation: '', specsId: this.state.selectedSpecSection.value,
                id: undefined, parentId: null, specsName: this.state.selectedSpecSection.label
            }
        });
    }

    onRowClick = (obj, type) => {
        if (type === 'rt-td') {
            if (config.IsAllow(3339)) {
                this.setState({ ShowPopup: true, IsEdit: true, specObj: obj });
            }
            else {
                toast.warn(Resources["missingPermissions"][currentLanguage]);
            }
        }
    }

    clickHandlerDeleteRowsMain = (selectedRows) => {
        if (this.state.showCheckbox) {
            this.setState({ selectedRow: selectedRows, showDeleteModal: true });
        }
        else {
            this.setState({ showDeleteModal: false });
            toast.warn(Resources["missingPermissions"][currentLanguage]);
        }
    }

    ConfirmDelete = () => {

        this.setState({ isLoading: true });
        dataservice.GetDataGridPost('DeleteAccountsSpecsSectionChildsById?id=' + this.state.selectedRow).then(res => {
            let id = this.state.selectedRow
            let rows = this.state.rows.filter(r => r.id !== id);
            this.setState({ rows, showDeleteModal: false, isLoading: false });
            toast.success(Resources["operationSuccess"][currentLanguage]);
        }).catch(ex => {
            this.setState({ isLoading: false });
            toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
        })
    }

    AddEditSave = (values) => {
        this.setState({ isLoading: true });
        if (this.state.IsEdit) {
            dataservice.addObject('EditAccountsSpecsSectionChilds', this.state.specObj).then(
                res => {
                    this.setState({ rows: res, isLoading: false, ShowPopup: false, IsEdit: false });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    this.setState({ isLoading: false, ShowPopup: false, IsEdit: false });
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                })
        }
        else {
            dataservice.addObject('AddAccountsSpecsSectionChilds', this.state.specObj).then(
                res => {
                    this.setState({ rows: res, ShowPopup: false, isLoading: false });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }).catch(ex => {
                    toast.error(Resources['operationCanceled'][currentLanguage].successTitle);
                })
        }
        values.title = ''
        values.titleAr = ''
        values.abbreviation = ''
    }


    render() {

        let ReactTBLColumns = [
            {
                Header: Resources["delete"][currentLanguage],
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <div className="btn table-btn-tooltip" style={{ marginLeft: "5px" }} onClick={() => this.clickHandlerDeleteRowsMain(row.id)}>
                            <i style={{ fontSize: "1.6em" }} className="fa fa-trash-o" />
                        </div>
                    );
                },
                width: 70
            }, {
                Header: Resources['title'][currentLanguage],
                accessor: 'title',
                width: 350,
            }, {
                Header: Resources['titleAr'][currentLanguage],
                accessor: 'titleAr',
                sortabel: true,
                width: 350,
            },
            {
                Header: Resources['abbreviation'][currentLanguage],
                accessor: 'abbreviation',
                sortabel: true,
                width: 350,
            },
        ]

        let ExportColumns = [
            { key: 'title', name: Resources['title'][currentLanguage] },
            { key: 'titleAr', name: Resources['titleAr'][currentLanguage] },
            { key: 'abbreviation', name: Resources['abbreviation'][currentLanguage] }
        ]

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={ExportColumns} fileName={Resources['subSpecsSection'][currentLanguage]} />
            : null;


        let RenderPopupAddEdit = () => {
            return (

                <Formik
                    initialValues={{
                        title: this.state.specObj.title,
                        titleAr: this.state.specObj.titleAr,
                        abbreviation: this.state.specObj.abbreviation,
                    }}
                    enableReinitialize={true}
                    validationSchema={ValidtionSchema}
                    onSubmit={(values) => { this.AddEditSave(values) }}>
                    {({ errors, touched, handleBlur, handleChange, values, handleSubmit }) => (

                        <Form className="proForm" onSubmit={handleSubmit}>
                            <div className="dropWrapper">

                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['titleEn'][currentLanguage]} </label>
                                    <div className={"inputDev ui input" + (errors.title && touched.title ? (" has-error") : !errors.title && touched.title ? (" has-success") : " ")} >
                                        <input name='title' autoComplete='off' id='title' value={this.state.specObj.title}
                                            className="form-control" placeholder={Resources['titleEn'][currentLanguage]}
                                            onBlur={(e) => {
                                                handleBlur(e)
                                                handleChange(e)
                                            }}
                                            onChange={(e) => { this.handleInputChange(e, 'title') }} />
                                        {errors.title && touched.title ? (<em className="pError">{errors.title}</em>) : null}
                                    </div>
                                </div>

                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['titleAr'][currentLanguage]} </label>
                                    <div className={"inputDev ui input" + (errors.titleAr && touched.titleAr ? (" has-error") : !errors.titleAr && touched.titleAr ? (" has-success") : " ")} >
                                        <input name='titleAr' className="form-control" value={this.state.specObj.titleAr}
                                            placeholder={Resources['titleAr'][currentLanguage]} autoComplete='off' id='titleAr'
                                            onBlur={(e) => {
                                                handleBlur(e)
                                                handleChange(e)
                                            }}
                                            onChange={(e) => { this.handleInputChange(e, 'titleAr') }} />
                                        {errors.titleAr && touched.titleAr ? <em className="pError">{errors.titleAr}</em> : null}
                                    </div>
                                </div>

                                <div className="fillter-status fillter-item-c fullInputWidth">
                                    <label className="control-label">{Resources['abbreviation'][currentLanguage]} </label>
                                    <div className="ui input inputDev" >
                                        <input name='Abbreviation' autoComplete='off'
                                            placeholder={Resources['abbreviation'][currentLanguage]} value={this.state.specObj.abbreviation}
                                            className="form-control" placeholder={Resources['abbreviation'][currentLanguage]}
                                            onBlur={(e) => { handleBlur(e) }} onChange={(e) => {
                                                handleChange(e)
                                                this.handleInputChange(e, 'abbreviation')
                                            }} />
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
            <Fragment >
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero"> {Resources['subSpecsSection'][currentLanguage]}</h3>
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

                    {this.state.selectedSpecSection.value !== '0' ?
                        <div className="filterBTNS">
                            {config.IsAllow(3338) ? <button className="primaryBtn-1 btn mediumBtn" onClick={this.showAdd}>New</button>
                                : null}
                            {btnExport}
                        </div>
                        : null}

                </div>
                <div className="fullWidthWrapper textLeft proForm">
                    <div className="letterFullWidth">
                        <Select title='specsSection' data={this.state.specSectionData} handleChange={(e) => this.handleChangespecSection(e)} />
                    </div>
                </div>

                <div className="doc-pre-cycle">
                    <ReactTable data={this.state.rows} columns={ReactTBLColumns} defaultPageSize={5} noDataText={Resources["noData"][currentLanguage]}
                        className="-striped -highlight"
                        getTrProps={(state, rowInfo, column, instance) => {
                            return { onClick: e => { this.onRowClick(rowInfo.original, e.target.className) } };
                        }} />

                </div>

                <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false, IsEdit: false })}
                    title={this.state.IsEdit ? Resources['editTitle'][currentLanguage] : Resources['goAdd'][currentLanguage]}
                    onCloseClicked={() => this.setState({ ShowPopup: false, IsEdit: false })} isVisible={this.state.ShowPopup}>
                    {RenderPopupAddEdit()}
                </SkyLightStateless>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal showDeleteModal={this.state.showDeleteModal}
                        title={Resources["smartDeleteMessageContent"][currentLanguage]}
                        closed={() => this.setState({ showDeleteModal: false })}
                        clickHandlerCancel={() => this.setState({ showDeleteModal: false })}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete} />
                ) : null}

            </Fragment>
        )
    }
}
export default withRouter(specSectionChild)
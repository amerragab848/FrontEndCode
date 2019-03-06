import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import ConfirmationModal from "../../publicComponants/ConfirmationModal";
import GridSetup from "../../../Pages/Communication/GridSetup";
import NotifiMsg from '../../publicComponants/NotifiMsg'
import Export from "../../../Componants/OptionsPanels/Export";
import { SkyLightStateless } from 'react-skylight';
import Select from '../../OptionsPanels/DropdownMelcous';
import { Formik, Form } from 'formik';
import config from "../../../Services/Config";
import * as Yup from 'yup';
import dataservice from "../../../Dataservice";
import Resources from "../../../resources.json";
import Api from '../../../api';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");


const ValidtionSchema = Yup.object().shape({
    ARTitle: Yup.string()
        .required(Resources['titleArValid'][currentLanguage]),
    Abbreviation: Yup.string()
        .required(Resources['abbreviationValid'][currentLanguage]),

});

const validationEdit = Yup.object().shape({
    ARTitleForEdit: Yup.string()
        .required(Resources['titleArValid'][currentLanguage]),
    AbbreviationForEdit: Yup.string()
        .required(Resources['abbreviationValid'][currentLanguage]),
});

class GeneralList extends Component {
    constructor(props) {

        const columnsGrid = [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "title",
                name: Resources["title"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ]
        super(props)

        this.state = {
            GeneralList: [],
            showCheckbox: false,
            columns: columnsGrid.filter(column => column.visible !== false),
            isLoading: true,
            rows: [],
            selectedRows: [],
            totalRows: 0,
            pageSize: 50,
            pageNumber: 0,
            showDeleteModal: false,
            listType: '',
            ShowPopup: false,
            EditListData: {},
            IsEdit: false,
            selectedrow: '',
            showNotify: false,
            api: 'GetAccountsDefaultList?',
            showNotifyError: false,
            showNotifyPermissions: false
        }
    }

    GetNextData() {
        let pageNumber = this.state.pageNumber + 1;
        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        let url = this.state.api + "listType=" + this.state.listType + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
        Api.get(url).then(result => {
            let oldRows = this.state.rows;
            const newRows = [...oldRows, ...result]; // arr3 ==> [1,2,3,3,4,5]
            this.setState({
                rows: newRows,
                totalRows: newRows.length,
                isLoading: false
            });
        }).catch(ex => {
            let oldRows = this.state.rows;
            this.setState({
                rows: oldRows,
                isLoading: false
            });
        });;
    }

    GetPrevoiusData() {
        let pageNumber = this.state.pageNumber - 1;
        this.setState({
            isLoading: true,
            pageNumber: pageNumber
        });
        let url = this.state.api + "listType=" + this.state.listType + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
        Api.get(url).then(result => {
            let oldRows = [];// this.state.rows;
            const newRows = [...oldRows, ...result];

            this.setState({
                rows: newRows,
                totalRows: newRows.length,
                isLoading: false
            });
        }).catch(ex => {
            let oldRows = this.state.rows;
            this.setState({
                rows: oldRows,
                isLoading: false
            });
        });;
    }

    componentWillMount = () => {
        if (config.IsAllow(1179)) {
            if (config.IsAllow(1181)) {
                this.setState({
                    showCheckbox: true
                })
            }
            dataservice.GetDataList('GetListTypesOnly', 'listType', 'listType').then(
                res => {
                    this.setState({
                        GeneralList: res,
                        isLoading: false
                    })
                }
            )
        }
    }

    clickHandlerDeleteRowsMain = (selectedRows) => {
        let id = ''
        selectedRows.map(i => {
            id = i
        })
        let checkEdit = []
        checkEdit = this.state.rows.filter(s => s.id === id)
        let editable = '';
        checkEdit.map(i => {
            editable = i.editable
        })
        if (editable === true) {
            this.setState({
                selectedRows,
                showDeleteModal: true
            })
        }
        else {
            setTimeout(() => {
                this.setState({
                    showNotifyError: true,
                })
            }, 500);
            this.setState({
                showNotifyError: false,
            })
        }
    }

    ConfirmDelete = () => {
        this.setState({
            isLoading: true
        })
        Api.post('AccountsDefaultListMultipleDelete', this.state.selectedRows).then(
            res => {
                let originalRows = this.state.rows

                this.state.selectedRows.map(i => {
                    originalRows = originalRows.filter(r => r.id !== i);
                })
                this.setState({
                    rows: originalRows,
                    showDeleteModal: false,
                    isLoading: false,
                })
                setTimeout(() => {
                    this.setState({
                        showNotify: true,
                    })
                }, 500);
            }
        ).catch(ex => {
            this.setState({
                isLoading: true,
                showNotify: false,
            })
        });
        this.setState({
            isLoading: true,
            showNotify: false,
        })

    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };

    GeneralListHandelChange = (e) => {
        this.setState({
            isLoading: true,
            listType: e.value
        })
        Api.get('GetAccountsDefaultList?listType=' + e.value + '&pageNumber=' + this.state.pageNumber + '&pageSize=' + this.state.pageSize + '').then(
            res => {
                this.setState({
                    rows: res,
                    isLoading: false
                })
            }
        )
        this.setState({
            isLoading: true
        })
    }

    cellClick = (obj) => {
        if (config.IsAllow(1180)) {
            if (obj.editable) {
                Api.get('GetAccountsDefaultListForEdit?id=' + obj.id + '').then(
                    res => {
                        this.setState({
                            IsEdit: true,
                            ShowPopup: true,
                            EditListData: res,
                            selectedrow: obj.id
                        })
                    }
                )
            }

            else {
                setTimeout(() => {
                    this.setState({
                        showNotifyError: true,
                    })
                }, 500);
                this.setState({
                    showNotifyError: false,
                })

            }
        }
        else {
            setTimeout(() => {
                this.setState({
                    showNotifyPermissions: true,
                })
            }, 500);
            this.setState({
                showNotifyPermissions: false,
            })
        }
    }


    render() {
        console.log(this.state.EditListData)
        const dataGrid =
            this.state.isLoading === false ? (
                <GridSetup rows={this.state.rows} columns={this.state.columns}
                    showCheckbox={this.state.showCheckbox}
                    clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                    pageSize={this.state.pageSize}
                    onRowClick={this.cellClick.bind(this)}
                />
            ) : <LoadingSection />

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns} fileName={Resources['AccountsDefaultList'][currentLanguage]} />
            : null;

        return (
            <Fragment >

                <NotifiMsg showNotify={this.state.showNotify} IsSuccess={true} Msg={Resources['successAlert'][currentLanguage]} />
                <NotifiMsg showNotify={this.state.showNotifyError} IsSuccess={false} Msg={Resources['adminItemEditable'][currentLanguage]} />
                <NotifiMsg showNotify={this.state.showNotifyPermissions} IsSuccess={false} Msg={Resources['missingPermissions'][currentLanguage]} />

                <div className="linebylineInput valid-input">
                    <Select title='AccountsDefaultList' placeholder='AccountsDefaultList' data={this.state.GeneralList} handleChange={this.GeneralListHandelChange} />
                </div>

                <div className="submittalFilter">
                    <div className="subFilter">
                        <h3 className="zero"> {Resources['AccountsDefaultList'][currentLanguage]}</h3>
                        <span>{this.state.rows.length}</span>
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

                    {this.state.listType ?
                        <div className="filterBTNS">
                            {config.IsAllow(1182) ?
                                <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.setState({ ShowPopup: true })}>New</button>
                                : null}{btnExport}
                        </div>
                        : null}

                    <div className="rowsPaginations">
                        <div className="rowsPagiRange">
                            <span>{(this.state.pageSize * this.state.pageNumber) + 1}</span> - <span>{(this.state.pageSize * this.state.pageNumber) + this.state.pageSize}</span> of
               <span> {this.state.totalRows}</span>
                        </div>

                        <button className={this.state.pageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetPrevoiusData()}>
                            <i className="angle left icon" />
                        </button>

                        <button className={this.state.totalRows !== (this.state.pageSize * this.state.pageNumber) + this.state.pageSize ? "rowunActive" : ""} onClick={() => this.GetNextData()}>
                            <i className="angle right icon" />
                        </button>
                    </div>

                </div>

                <div className="grid-container">
                    {dataGrid}
                </div>

                <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false, IsEdit: false })} title={this.state.IsEdit ?
                    Resources['AccountsDefaultList'][currentLanguage] + ' - ' + Resources['editTitle'][currentLanguage]
                    : Resources['AccountsDefaultList'][currentLanguage] + ' - ' + Resources['goAdd'][currentLanguage]}
                    onCloseClicked={() => this.setState({ ShowPopup: false, IsEdit: false })} isVisible={this.state.ShowPopup}
                >
                        {this.state.IsEdit ?
                            <Formik
                                initialValues={{
                                    EnTitleForEdit: '',
                                    ARTitleForEdit: '',
                                    AbbreviationForEdit: ''
                                }}

                                validationSchema={validationEdit}

                                onSubmit={() => {
                                    this.setState({
                                        isLoading: true,
                                    })
                                    Api.post('EditAccountsDefaultList', this.state.EditListData).then(
                                        res => {
                                            this.setState({
                                                rows: res,
                                                isLoading: false,
                                                IsEdit: false
                                            })
                                        }
                                    )
                                    this.setState({
                                        isLoading: true,
                                        ShowPopup: false,
                                        IsEdit: false
                                    })
                                    setTimeout(() => {
                                        this.setState({
                                            showNotify: true,
                                        })
                                    }, 500);
                                    this.setState({
                                        showNotify: false,
                                    })

                                }} >

                                {({ errors, touched, handleBlur, handleChange, handleSubmit }) => (

                                    <Form onSubmit={handleSubmit}>
                                        <div className="dropWrapper">

                                            <div className="fillter-status fillter-item-c">
                                                <div className="linebylineInput valid-input label__block">
                                                    <label className="control-label">{Resources['titleEn'][currentLanguage]} </label>
                                                    <div className="ui input inputDev" >
                                                        <input type='text' name='EnTitleForEdit' className="form-control" autoComplete='off'
                                                            value={this.state.EditListData.title} placeholder={Resources['titleEn'][currentLanguage]}
                                                            onBlur={(e) => { handleBlur(e) }}
                                                            onChange={(e) => {
                                                                handleChange(e)
                                                                this.setState({ EditListData: { ...this.state.EditListData, title: e.target.value } })
                                                            }
                                                            } />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="fillter-status fillter-item-c">
                                                <div className="linebylineInput valid-input label__block">
                                                    <label className="control-label">{Resources['titleAr'][currentLanguage]} </label>
                                                    <div className={errors.ARTitleForEdit && touched.ARTitleForEdit ?
                                                        ("ui input inputDev has-error") : "ui input inputDev"} >
                                                        <input name='ARTitleForEdit' className="form-control" autoComplete='off'
                                                            value={this.state.EditListData.titleAr} placeholder={Resources['titleAr'][currentLanguage]}
                                                            onBlur={(e) => { handleBlur(e) }} onChange={(e) => {
                                                                handleChange(e)
                                                                this.setState({ EditListData: { ...this.state.EditListData, titleAr: e.target.value } })
                                                            }} />
                                                        {errors.ARTitleForEdit && touched.ARTitleForEdit ? (
                                                            <em className="pError">{errors.ARTitleForEdit}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="fillter-status fillter-item-c">
                                                <div className="linebylineInput valid-input label__block">
                                                    <label className="control-label">{Resources['abbreviation'][currentLanguage]} </label>
                                                    <div className={errors.AbbreviationForEdit && touched.AbbreviationForEdit ?
                                                        ("ui input inputDev has-error") : "ui input inputDev"} >
                                                        <input name='AbbreviationForEdit' autoComplete='off'
                                                            value={this.state.EditListData.abbreviation} className="form-control" placeholder={Resources['abbreviation'][currentLanguage]}
                                                            onBlur={(e) => { handleBlur(e) }} onChange={(e) => {
                                                                handleChange(e)
                                                                this.setState({ EditListData: { ...this.state.EditListData, abbreviation: e.target.value } })
                                                            }} />
                                                        {errors.AbbreviationForEdit && touched.AbbreviationForEdit ? (
                                                            <em className="pError">{errors.AbbreviationForEdit}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="fullWidthWrapper">
                                                <button className="primaryBtn-1 btn" type='submit'   >
                                                    {Resources['save'][currentLanguage]}</button>
                                            </div>
                                        
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                            :
                            <Formik

                                initialValues={{
                                    EnTitle: '',
                                    ARTitle: '',
                                    Abbreviation: ''
                                }}

                                validationSchema={ValidtionSchema}

                                onSubmit={(values, actions) => {
                                    this.setState({
                                        isLoading: true,
                                    })

                                    Api.post('AddAccountsDefaultList', { 'title': values.EnTitle, 'titleAr': values.ARTitle, 'abbreviation': values.Abbreviation, 'listType': this.state.listType }).then(
                                        res => {
                                            this.setState({
                                                rows: res,
                                                isLoading: false,
                                            })
                                        }
                                    )

                                    actions.setSubmitting(false);
                                    values.EnTitle = ''
                                    values.ARTitle = ''
                                    values.Abbreviation = ''
                                    this.setState({
                                        isLoading: true,
                                        ShowPopup: false
                                    })
                                    setTimeout(() => {
                                        this.setState({
                                            showNotify: true,
                                        })
                                    }, 500);
                                    this.setState({
                                        showNotify: false,
                                    })
                                }} >

                                {({ errors, touched, handleBlur, handleChange, values, handleSubmit }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <div className="dropWrapper">
                                        
                                            <div className="fillter-status fillter-item-c">
                                                <div className="linebylineInput valid-input label__block">
                                                    <label className="control-label">{Resources['titleEn'][currentLanguage]} </label>
                                                    <div className="ui input inputDev" >
                                                        <input type='text' name='EnTitle' className="form-control" autoComplete='off'
                                                            value={values.EnTitle} placeholder={Resources['titleEn'][currentLanguage]}
                                                            onBlur={(e) => { handleBlur(e) }}
                                                            onChange={(e) => { handleChange(e) }
                                                            } />

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="fillter-status fillter-item-c">
                                                <div className="linebylineInput valid-input label__block">
                                                    <label className="control-label">{Resources['titleAr'][currentLanguage]} </label>
                                                    <div className={errors.ARTitle && touched.ARTitle ?
                                                        ("ui input inputDev has-error") : "ui input inputDev"} >
                                                        <input name='ARTitle' className="form-control" autoComplete='off'
                                                            value={values.ARTitle} placeholder={Resources['titleAr'][currentLanguage]}
                                                            onBlur={(e) => { handleBlur(e) }} onChange={(e) => { handleChange(e) }} />
                                                        {errors.ARTitle && touched.ARTitle ? (
                                                            <em className="pError">{errors.ARTitle}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="fillter-status fillter-item-c">
                                                <div className="linebylineInput valid-input label__block">
                                                    <label className="control-label">{Resources['abbreviation'][currentLanguage]} </label>
                                                    <div className={errors.Abbreviation && touched.Abbreviation ?
                                                        ("ui input inputDev has-error") : "ui input inputDev"} >
                                                        <input name='Abbreviation' autoComplete='off'
                                                            value={values.Abbreviation} className="form-control" placeholder={Resources['abbreviation'][currentLanguage]}
                                                            onBlur={(e) => { handleBlur(e) }} onChange={(e) => { handleChange(e) }} />
                                                        {errors.Abbreviation && touched.Abbreviation ? (
                                                            <em className="pError">{errors.Abbreviation}</em>) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="fullWidthWrapper">
                                                <button className="primaryBtn-1 btn" type='submit'   >
                                                    {Resources['save'][currentLanguage]}</button>
                                            </div>
                                    
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        }

                </SkyLightStateless>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null}

            </Fragment>
        )
    }
}
export default withRouter(GeneralList)
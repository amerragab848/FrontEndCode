import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import LoadingSection from '../../publicComponants/LoadingSection';
import Export from '../../OptionsPanels/Export';
import config from '../../../Services/Config';
import Resources from '../../../resources.json';
import Api from '../../../api';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ReactTable from 'react-table';
let currentLanguage =
    localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let CurrProject = localStorage.getItem('lastSelectedprojectName');
class ResourcesAddEdit extends Component {
    constructor(props) {
        super(props);

        if (!config.IsAllow(3664)) {
            toast.warn(Resources['missingPermissions'][currentLanguage]);
            this.props.history.goBack();
        }

        this.columns = [
            {
                Header: Resources['ResourceKey'][currentLanguage],
                accessor: 'resourceKey',
                width: 350,
            },
            {
                Header: Resources['EnglishName'][currentLanguage],
                accessor: 'titleEn',
                sortabel: true,
                width: 350,
            },
            {
                Header: Resources['ArabicName'][currentLanguage],
                accessor: 'titleAr',
                sortabel: true,
                width: 350,
            },
        ];

        this.state = {
            showCheckbox: false,
            isLoading: true,
            rows: [],
            selectedRows: [],
            showDeleteModal: false,
            showNotify: false,
            MaxArrange: 0,
            selected: {},
            tableData: [],
        };
    }

    componentDidMount = () => {
        Api.get('GetAllAccountsResources').then(res => {
            this.setState({
                tableData: res.data,
                isLoading: false,
            });
            console.log(res);
        });
        if (config.IsAllow(3663)) {
            this.setState({
                showCheckbox: true,
            });
        }
    };

    handleSearch = (e, searchObj) => {
        e.preventDefault();
        Api.get(
            `AccountsResourcesFilter?pageNumber=0&pageSize=10&query=${JSON.stringify(
                searchObj,
            )}`,
        ).then(res => {
            this.setState({ tableData: res.data });
        });
    };

    handelAdd = (e, addObj) => {
        e.preventDefault();
        // search database with key
        Api.get(
            `AccountsResourcesFilter?pageNumber=0&pageSize=10&query=${JSON.stringify(
                addObj,
            )}`,
        ).then(res => {
            if (res.data.length > 0)
                toast.warn('This Resource Allready Exists');
            else {
                Api.post('AddAccountsResources', addObj).then(res => {
                    let newData = [...this.state.tableData];
                    addObj.id = res;
                    newData.push(addObj);
                    this.setState({
                        selected: addObj,
                        tableData: newData,
                        isLoading: false,
                    });
                    toast.success('Resource Updated Successfully');
                    console.log(this.state.tableData);
                });
            }
        });
    };

    handleUpdate = updatedResource => {
        Api.post('EditAccountsResources', updatedResource).then(res => {
            let newData = [...this.state.tableData];
            let index = newData.findIndex(
                item => item.resourceKey == updatedResource.resourceKey,
            );
            if (
                index != -1 &&
                (updatedResource.titleEn != newData[index].titleEn ||
                    updatedResource.titleAr != newData[index].titleAr)
            ) {
                newData[index] = updatedResource;
                this.setState({
                    selected: updatedResource,
                    tableData: newData,
                    isLoading: false,
                });
                toast.success('Resource Updated Successfully');
            }
            console.log(res);
        });
    };

    render() {
        const btnExport =
            this.state.isLoading === false ? (
                <Export
                    rows={this.state.isLoading === false ? this.state.rows : []}
                    columns={this.state.columns}
                    fileName={Resources['expensesWorkFlow'][currentLanguage]}
                />
            ) : null;
        return (
            <Fragment>
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero">
                            {CurrProject +
                                ' - ' +
                                Resources['LanguageResources'][currentLanguage]}
                        </h3>
                        <span>
                            <svg
                                width="16px"
                                height="18px"
                                viewBox="0 0 16 18"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g
                                    id="Symbols"
                                    stroke="none"
                                    strokeWidth="1"
                                    fill="none"
                                    fillRule="evenodd">
                                    <g
                                        id="Action-icons/Filters/Hide+text/24px/Grey_Base"
                                        transform="translate(-4.000000, -3.000000)"></g>
                                </g>
                            </svg>
                        </span>
                    </div>
                </div>
                <div className="document-fields ">
                    {this.state.isLoading === false ? null : <LoadingSection />}
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            resourceKey: this.state.selected.resourceKey || '',
                            englishName: this.state.selected.titleEn || '',
                            arabicName: this.state.selected.titleAr || '',
                        }}
                        validationSchema={this.validationSchema || ''}
                        onSubmit={values => {
                            let updatedResource = {
                                id: this.state.selected.id,
                                resourceKey: this.state.selected.resourceKey,
                                titleEn: values.englishName,
                                titleAr: values.arabicName,
                            };
                            this.handleUpdate(updatedResource);
                        }}>
                        {({
                            values,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                        }) => (
                            <Form
                                id="resourceForm"
                                className="proForm datepickerContainer"
                                noValidate="novalidate"
                                onSubmit={handleSubmit}>
                                <div className="submittalFilter resources">
                                    <div className="resources__inputs">
                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">
                                                {
                                                    Resources['ResourceKey'][
                                                        currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div className="ui input inputDev ">
                                                <input
                                                    name="resourceKey"
                                                    id="resourceKey"
                                                    type="text"
                                                    value={values.resourceKey}
                                                    className="form-control"
                                                    placeholder={
                                                        Resources[
                                                            'ResourceKey'
                                                        ][currentLanguage]
                                                    }
                                                    autoComplete="on"
                                                    onBlur={e => {
                                                        handleBlur(e);
                                                    }}
                                                    onChange={e =>
                                                        handleChange(e)
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">
                                                {
                                                    Resources['EnglishName'][
                                                        currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div className="ui input inputDev">
                                                <input
                                                    name="englishName"
                                                    type="text"
                                                    className="form-control"
                                                    id="englishName"
                                                    placeholder={
                                                        Resources[
                                                            'EnglishName'
                                                        ][currentLanguage]
                                                    }
                                                    autoComplete="on"
                                                    value={values.englishName}
                                                    onBlur={handleBlur}
                                                    onChange={e =>
                                                        handleChange(e)
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="linebylineInput fullInputWidth">
                                            <label className="control-label">
                                                {
                                                    Resources['ArabicName'][
                                                        currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div className="ui input inputDev">
                                                <input
                                                    name="arabicName"
                                                    type="text"
                                                    className="form-control"
                                                    id="arabicName"
                                                    placeholder={
                                                        Resources['ArabicName'][
                                                            currentLanguage
                                                        ]
                                                    }
                                                    autoComplete="on"
                                                    value={values.arabicName}
                                                    onBlur={handleBlur}
                                                    onChange={e =>
                                                        handleChange(e)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="filterBTNS">
                                        <button
                                            className={
                                                this.state.selected.resourceKey
                                                    ? 'primaryBtn-1 btn largeBtn'
                                                    : 'primaryBtn-1 btn largeBtn disabled'
                                            }
                                            type="submit">
                                            {
                                                Resources['update'][
                                                    currentLanguage
                                                ]
                                            }{' '}
                                        </button>
                                        <button
                                            className="primaryBtn-1 btn largeBtn "
                                            type="submit"
                                            onClick={e =>
                                                this.handleSearch(e, {
                                                    resourceKey:
                                                        values.resourceKey,
                                                    titleEn: values.englishName,
                                                    titleAr: values.arabicName,
                                                })
                                            }>
                                            {
                                                Resources['search'][
                                                    currentLanguage
                                                ]
                                            }{' '}
                                        </button>
                                        <button
                                            className={
                                                values.resourceKey
                                                    ? 'primaryBtn-1 btn largeBtn'
                                                    : 'primaryBtn-1 btn largeBtn disabled'
                                            }
                                            type="submit"
                                            onClick={e =>
                                                this.handelAdd(e, {
                                                    resourceKey:
                                                        values.resourceKey,
                                                    titleEn: values.englishName,
                                                    titleAr: values.arabicName,
                                                })
                                            }>
                                            {Resources['Add'][currentLanguage]}{' '}
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <ReactTable
                        data={this.state.tableData || []}
                        columns={this.columns}
                        defaultPageSize={50}
                        minRows={2}
                        noDataText={Resources['noData'][currentLanguage]}
                        getTrProps={(state, rowInfo) => {
                            if (rowInfo && rowInfo.row) {
                                return {
                                    onClick: e => {
                                        this.setState({
                                            selected: rowInfo.row._original,
                                        });
                                        console.log(this.state.selected);
                                    },
                                };
                            } else {
                                return {};
                            }
                        }}
                    />
                </div>
            </Fragment>
        );
    }
}

export default withRouter(ResourcesAddEdit);

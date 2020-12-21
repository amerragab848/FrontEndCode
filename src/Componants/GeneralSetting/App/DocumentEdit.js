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
class DocumentEdit extends Component {
    constructor(props) {
        super(props);

        if (!config.IsAllow(3664)) {
            toast.warn(Resources['missingPermissions'][currentLanguage]);
            this.props.history.goBack();
        }

        this.columns = [
            {
                Header: Resources['documentTitle'][currentLanguage],
                accessor: 'title',
                width: 350,
            },
            {
                Header: Resources['ArabicName'][currentLanguage],
                accessor: 'ar',
                sortabel: true,
                width: 350,
            },
            {
                Header: Resources['DocumentRefCode'][currentLanguage],
                accessor: 'refCode',
                sortabel: true,
                width: 350,
            },
            {
                Header: Resources['docName'][currentLanguage],
                accessor: 'name',
                sortabel: true,
                width: 350,
            },
        ];

        this.state = {
            showCheckbox: false,
            isLoading: false,
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
        // Api.get('ExpensesWorkFlowGet').then(res => {
        //     this.setState({
        //         rows: res,
        //         isLoading: false,
        //         MaxArrange: Math.max.apply(
        //             Math,
        //             res.map(function(o) {
        //                 return o.arrange + 1;
        //             }),
        //         ),
        //     });
        // });
        let tableData = [
            {
                title: 'title1',
                ar: 'ar1',
                refCode: 11,
                name: 'doc1',
            },
            {
                title: 'title2',
                ar: 'ar2',
                refCode: 12,
                name: 'doc2',
            },
            {
                title: 'title3',
                ar: 'ar3',
                refCode: 13,
                name: 'doc3',
            },
            {
                title: 'title4',
                ar: 'ar4',
                refCode: 14,
                name: 'doc4',
            },
        ];
        this.setState({ tableData });
        if (config.IsAllow(3663)) {
            this.setState({
                showCheckbox: true,
            });
        }
    };

    handleSearch = (e, searchObj) => {
        e.preventDefault();
        // get search tableData from Api with searchObj

        // setState search tableData

        console.log('search obj: ', searchObj);
    };

    render() {
        // const btnExport =
        //     this.state.isLoading === false ? (
        //         <Export
        //             rows={this.state.isLoading === false ? this.state.rows : []}
        //             columns={this.state.columns}
        //             fileName={Resources['expensesWorkFlow'][currentLanguage]}
        //         />
        //     ) : null;
        return (
            <Fragment>
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero">
                            {CurrProject +
                                ' - ' +
                                Resources['Modules'][currentLanguage]}
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

                    {/* <div className="filterBTNS">
                        {config.IsAllow(3661) ? (
                            <button
                                className="primaryBtn-1 btn mediumBtn"
                                onClick={this.AddExpensesWorkFlow}>
                                New
                            </button>
                        ) : null}
                        {btnExport}
                    </div> */}
                </div>
                <div className="document-fields ">
                    {this.state.isLoading === false ? null : <LoadingSection />}
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            title: this.state.selected.title || '',
                            arabicName: this.state.selected.ar || '',
                        }}
                        validationSchema={this.validationSchema || ''}
                        onSubmit={values => {
                            console.log(values);
                            let newData = [...this.state.tableData];
                            let index = newData.findIndex(
                                item => item.title == values.title,
                            );

                            if (
                                index != -1 &&
                                values.arabicName != newData[index].ar
                            ) {
                                let newSelected = {
                                    title: values.title,
                                    ar: values.arabicName,
                                    refCode: newData[index].refCode,
                                    name: newData[index].name,
                                };
                                newData[index] = newSelected;
                                console.log(newSelected, newData[index]);
                                this.setState({
                                    selected: newSelected,
                                    tableData: newData,
                                });
                                toast.success('Resource Updated Successfully');
                            }
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
                                                    Resources['ModuleTitle'][
                                                        currentLanguage
                                                    ]
                                                }
                                            </label>
                                            <div className="ui input inputDev ">
                                                <input
                                                    name="title"
                                                    id="title"
                                                    type="text"
                                                    value={values.title}
                                                    className="form-control"
                                                    placeholder={
                                                        Resources[
                                                            'ModuleTitle'
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
                                                values.title
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
                                                    title: values.title,
                                                    ar: values.arabicName,
                                                })
                                            }>
                                            {
                                                Resources['search'][
                                                    currentLanguage
                                                ]
                                            }{' '}
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

export default withRouter(DocumentEdit);

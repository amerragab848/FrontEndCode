import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import GridSetup from "../Communication/GridSetup";
import Resources from "../../resources.json";
import Api from '../../api'
import { toast } from "react-toastify";
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import moment from "moment";
import dataservice from "../../Dataservice";
import Config from "../../Services/Config.js";
import { SkyLightStateless } from 'react-skylight';
import { Formik, Form } from 'formik';
import DropdownMelcous from '../../Componants/OptionsPanels/DropdownMelcous';
import * as Yup from 'yup';
import ReactTable from "react-table";
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
let selectedRows = [];
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
}

const ValidtionSchema = Yup.object().shape({
    selectedContract: Yup.string()
        .required(Resources['selectContract'][currentLanguage])
        .nullable(true),
})

let customButton = () => {
    return <button className="companies_icon" style={{ cursor: 'pointer' }}><i className="fa fa-info" ></i></button>;
}

const BoqTypeSchema = Yup.object().shape({
    boqType: Yup.string().required(Resources['boqSubType'][currentLanguage]),
    boqChild: Yup.string().required(Resources['boqSubType'][currentLanguage]),
    boqSubType: Yup.string().required(Resources['boqSubType'][currentLanguage]),
});

class AmendmentList extends Component {

    constructor(props) {

        let Gridcolumns = [
            {
                formatter: customButton,
                key: 'customBtn'
            },
            {
                key: "subject",
                name: Resources["subject"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true

            }, {
                key: "companyName",
                name: Resources["fromCompany"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "toCompanyName",
                name: Resources["contractTo"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "toContactName",
                name: Resources["contractWithContact"][currentLanguage],
                width: 200,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "docDate",
                name: Resources["docDate"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "refDoc",
                name: Resources["refDoc"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "statusName",
                name: Resources["statusName"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "arrange",
                name: Resources["arrange"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "completionDate",
                name: Resources["completionDate"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
                formatter: dateFormate
            }, {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 150,
                draggable: true,
                sortable: true,
                editable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true,
            }
        ];

        super(props)
        this.state = {
            isLoading: true,
            selectedRow: [],
            AmendmentList: [],
            columns: Gridcolumns,
            // contractId:this.props.contractId
            contractId: 7716,
            ShowPopup: false,
            //projectId:this.props.projectId
            projectId: 2,
            ContractList: [],
            selectedContract: { label: Resources['selectContract'][currentLanguage], value: "0" },
            ShowPopupItem: false,
            AmendmentItems: [],
            selected: {},
            selectedBoqTypeEdit: { label: Resources.boqType[currentLanguage], value: "0" },
            selectedBoqTypeChildEdit: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
            selectedBoqSubTypeEdit: { label: Resources.boqSubType[currentLanguage], value: "0" },
            boqTypes: [],
            BoqTypeChilds: [],
            BoqSubTypes: [],
        }
    }

    componentWillMount = () => {

        dataservice.GetDataGrid('GetContractAmendmentByContractId?parentId=' + this.state.contractId + '').then(
            res => {
                this.setState({
                    AmendmentList: res,
                    isLoading: false
                })
            }
        )

        dataservice.GetDataList('GetContractNotAssignedToReqPay?projectId=' + this.state.projectId + '', 'subject', 'id').then(
            result => {
                this.setState({
                    ContractList: result
                })
            }
        )
    }

    componentDidMount = () => {

    }

    fillSubDropDown(url, param, value, subField_lbl, subField_value, subDatasource, subDatasource_2) {
        this.setState({ isLoading: true })
        let action = url + "?" + param + "=" + value
        dataservice.GetDataList(action, subField_lbl, subField_value).then(result => {
            this.setState({
                [subDatasource]: result,
                [subDatasource_2]: result,
                isLoading: false
            })
        });
    }

    onRowClick = (value, index, column) => {
        if (column.key == 'customBtn') {
            Api.get('ShowContractItemsByContractId?contractId=' + value.id + '&pageNumber=0&pageSize=0').then(res => {
                this.setState({
                    ShowPopupItem: true,
                    AmendmentItems: res
                })
            })

            // console.log(value.id, index, column)
        }
    }

    clickHandlerDeleteRowsMain = selectedRows => {
        this.setState({
            showDeleteModal: true,
            selectedRow: selectedRows
        });
    }

    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    onRowsSelected = selectedRows => {
        this.setState({
            selectedRow: selectedRows
        });
    }

    onRowsDeselected = () => {
        this.setState({
            selectedRow: []
        });
    }

    ConfirmDelete = () => {
        this.setState({ isLoading: true })

        Api.post('DeleteContractAmendmentByContractId?', this.state.selectedRow).then((res) => {

            let originalRows = this.state.AmendmentList
            this.state.selectedRow.map(i => {
                originalRows = originalRows.filter(r => r.id !== i);
            })
            this.setState({
                AmendmentList: originalRows,
                showDeleteModal: false,
                isLoading: false,
            })
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)

        }).catch(ex => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({
                isLoading: false,
            })
        });


    }

    handleChange = (e) => {
        this.setState({
            selectedContract: e
        })
    }

    AssignAmendment = (values) => {
        this.setState({
            isLoading: true
        })
        Api.post('AssignAmedmentContract?parentContractId=' + this.state.contractId + '&assignContractId=' + this.state.selectedContract.value + '').then(
            res => {
                let NewContractList = this.state.ContractList.filter(x => x.label !== this.state.selectedContract.label)
                this.setState({
                    selectedContract: { label: Resources['selectContract'][currentLanguage], value: "0" },
                    ContractList: NewContractList,
                    AmendmentList: res,
                    isLoading: false,
                    ShowPopup: false,
                })

            }
        )
    }

    toggleRow(obj) {


        const newSelected = Object.assign({}, this.state.selected);

        newSelected[obj.id] = !this.state.selected[obj.id];

        let setIndex = selectedRows.findIndex(x => x.id === obj.id);

        if (setIndex > -1) {
            selectedRows.splice(setIndex, 1);
        } else {
            selectedRows.push(obj);
        }

        this.setState({
            selected: newSelected
        });

    }

    assign = () => {
        this.setState({ showBoqModal: true })
    }

    assignBoqType = () => {
        this.setState({ showBoqModal: true, isLoading: true })
        let itemsId = []
        this.state.selected.forEach(element => {
            itemsId.push(element.row.id)
        })
        let boq = {
            ids: this.state.selectedBoqTypeChildEdit.value,
            boqItemId: itemsId,
            boqSubTypeId: this.state.selectedBoqSubTypeEdit.value,
        }
        Api.post('AssignedContractsOrdersItemsToBoq', boq).then(() => {
            this.setState({ showBoqModal: false, isLoading: false })
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.getTabelData()
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ showBoqModal: false, isLoading: false })
        })

    }

    render() {

        const BoqTypeContent =
            <div className="dropWrapper">
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        boqType: '',
                        boqChild: '',
                        boqSubType: ''
                    }}
                    validationSchema={BoqTypeSchema}
                    onSubmit={(values) => {
                        this.assignBoqType()
                    }}
                >
                    {({ errors, touched, setFieldTouched, setFieldValue, handleBlur, handleChange }) => (
                        <Form id="signupForm1" className="proForm datepickerContainer customProform" noValidate="novalidate" >
                            <div className="fullWidthWrapper textLeft">
                                <DropdownMelcous
                                    title="boqType"
                                    data={this.state.boqTypes}
                                    selectedValue={this.state.selectedBoqTypeEdit}
                                    handleChange={event => {
                                        this.fillSubDropDown('GetAllBoqChild', 'parentId', event.value, 'title', 'id', 'BoqSubTypes', 'BoqTypeChilds')
                                        this.setState({
                                            selectedBoqTypeEdit: event,
                                            selectedBoqTypeChildEdit: { label: Resources.boqTypeChild[currentLanguage], value: "0" },
                                            selectedBoqSubTypeEdit: { label: Resources.boqSubType[currentLanguage], value: "0" },
                                        })
                                    }}
                                    onChange={setFieldValue}
                                    onBlur={setFieldTouched}
                                    error={errors.boqType}
                                    touched={touched.boqType}
                                    name="boqType"
                                    index="boqType" />
                            </div>
                            <DropdownMelcous
                                title="boqTypeChild"
                                data={this.state.BoqTypeChilds}
                                selectedValue={this.state.selectedBoqTypeChildEdit}
                                handleChange={event => {
                                    this.setState({ selectedBoqTypeChildEdit: event })
                                }}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.boqChild}
                                touched={touched.boqChild}
                                name="boqChild"
                                index="boqChild" />
                            <DropdownMelcous
                                title="boqSubType"
                                data={this.state.BoqSubTypes}
                                selectedValue={this.state.selectedBoqSubTypeEdit}
                                handleChange={event => {
                                    this.setState({ selectedBoqSubTypeEdit: event })
                                }}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.boqSubType}
                                touched={touched.boqSubType}
                                name="boqSubType"
                                index="boqSubType" />

                            <div className={"slider-Btns fullWidthWrapper"}>
                                <button className={this.state.isViewMode === true ? "primaryBtn-1 btn  disNone" : "primaryBtn-1 btn "} type="submit" >{Resources.save[currentLanguage]}</button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>


        let columns = [
            {
                Header: Resources["checkList"][currentLanguage],
                id: "checkbox",
                accessor: "id",
                Cell: ({ row }) => {
                    return (
                        <div className="ui checked checkbox  checkBoxGray300 ">
                            <input type="checkbox" className="checkbox" checked={this.state.selected[row._original.id] === true} onChange={() => this.toggleRow(row._original)} />
                            <label />
                        </div>
                    );
                },
                width: 50
            },
            {
                Header: Resources['description'][currentLanguage],
                accessor: 'description',
                width: 100,
            }, {
                Header: Resources['boqType'][currentLanguage],
                accessor: 'boqType',
                width: 100,
            },
            {
                Header: Resources['boqTypeChild'][currentLanguage],
                accessor: 'boqTypeChild',
                width: 100,
            },
            {
                Header: Resources['boqSubType'][currentLanguage],
                accessor: 'boqSubType',
                width: 100,
            }, {
                Header: Resources['originalQuantity'][currentLanguage],
                accessor: 'quantity',
                width: 100,
            },
            {
                Header: Resources['remainingQuantity'][currentLanguage],
                accessor: 'revisedQuntitty',
                width: 100,
            }, {
                Header: Resources['unit'][currentLanguage],
                accessor: 'unit',
                width: 100,
            }
            ,
            {
                Header: Resources['unitPrice'][currentLanguage],
                accessor: 'unitPrice',
                width: 100,
            }, {
                Header: Resources['total'][currentLanguage],
                accessor: 'total',
                width: 100,
            },
            {
                Header: Resources['resourceCode'][currentLanguage],
                accessor: 'resourceCode',
                width: 100,
            }, {
                Header: Resources['itemCode'][currentLanguage],
                accessor: 'itemCode',
                width: 100,
            },
            {
                Header: Resources['specsSection'][currentLanguage],
                accessor: 'specsSection',
                width: 100,
            }, {
                Header: Resources['revQuantity'][currentLanguage],
                accessor: 'revQuantity',
                width: 100,
            }

        ]

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.AmendmentList} columns={this.state.columns} onRowClick={this.onRowClick}
                showCheckbox={true} clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain} />
        ) : <LoadingSection />

        return (
            <div>
                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopupItem: false })}
                        title={Resources['amendmentItems'][currentLanguage]}
                        onCloseClicked={() => this.setState({ ShowPopupItem: false })} isVisible={this.state.ShowPopupItem}>
                        <div className="precycle-grid">
                            <div className="reactTableActions">
                                {selectedRows.length > 0 ? (
                                    <div className={"gridSystemSelected " + (selectedRows.length > 0 ? " active" : "")} >
                                        <div className="tableselcted-items">
                                            <span id="count-checked-checkboxes">
                                                {selectedRows.length}
                                            </span>
                                            <span>Selected</span>
                                        </div>
                                        <div className="tableSelctedBTNs">
                                            <button className="defaultBtn btn smallBtn" onClick={this.assign.bind(this)}>
                                                <i className="fa fa-retweet"></i>
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                                <ReactTable
                                    ref={(r) => {
                                        this.selectTable = r;
                                    }}
                                    data={this.state.AmendmentItems}
                                    columns={columns}
                                    defaultPageSize={10}
                                    minRows={2}
                                    noDataText={Resources['noData'][currentLanguage]}
                                />
                            </div>
                        </div>
                    </SkyLightStateless>
                </div>

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ showBoqModal: false })}
                        title={Resources['boqType'][currentLanguage]}
                        onCloseClicked={() => this.setState({ showBoqModal: false })} isVisible={this.state.showBoqModal}>
                        {BoqTypeContent}
                    </SkyLightStateless>
                </div>

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={() => this.setState({ ShowPopup: false })}
                        title={Resources['assignAmendment'][currentLanguage]}
                        onCloseClicked={() => this.setState({ ShowPopup: false })} isVisible={this.state.ShowPopup}>

                        <Formik
                            initialValues={{ selectedContract: '' }}

                            enableReinitialize={true}

                            validationSchema={ValidtionSchema}

                            onSubmit={(values, actions) => {

                                this.AssignAmendment(values, actions)
                            }}>

                            {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                <Form onSubmit={handleSubmit}>


                                    <div className='dropWrapper'>
                                        <div className="letterFullWidth multiChoice">
                                            <DropdownMelcous title='contract' data={this.state.ContractList} name='selectedContract'
                                                selectedValue={this.state.selectedContract} onChange={setFieldValue}
                                                handleChange={(e) => this.handleChange(e)}
                                                onBlur={setFieldTouched}
                                                error={errors.selectedContract}
                                                touched={touched.selectedContract}
                                                value={values.selectedContract} />
                                        </div>

                                        <div className="fullWidthWrapper slider-Btns">
                                            <button className="primaryBtn-1 btn meduimBtn" type='submit' >{Resources['save'][currentLanguage]}</button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>

                    </SkyLightStateless>
                </div>

                <div className="filterBTNS">
                    <button className="primaryBtn-1 btn mediumBtn" onClick={e => this.setState({ ShowPopup: true })}>{Resources['assignAmendment'][currentLanguage]}</button>
                </div>

                <div className="grid-container">
                    {dataGrid}
                </div>

                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal closed={this.onCloseModal}
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null
                }
            </div >
        )
    }
}
export default withRouter(AmendmentList)


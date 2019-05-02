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
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const dateFormate = ({ value }) => {
    return value ? moment(value).format("DD/MM/YYYY") : "No Date";
};
const ValidtionSchema = Yup.object().shape({
    selectedContract: Yup.string()
        .required(Resources['selectContract'][currentLanguage])
        .nullable(true),
});

let customButton = () => {
    return <button className="companies_icon" style={{ cursor: 'pointer' }}><i class="fa fa-info" ></i></button>;
};

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
            selectedRow: [],
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
            selectedContract: {}
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
            res => {
                this.setState({
                    ContractList: res
                })
            }
        )
    }

    componentDidMount = () => {

    }

    onRowClick = (value, index, column) => {
        if (column.key == 'customBtn') {
            console.log(value.id, index, column)
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
            let data = [...this.state.AmendmentList]
            let length = data.length
            data.forEach((element, index) => {
                data = data.filter(item => { return item.id != element.id });
                if (index == length - 1) {
                    this.setState({ AmendmentList: data, showDeleteModal: false, isLoading: false });
                    toast.success(Resources["operationSuccess"][currentLanguage]);
                }
            })
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
            this.setState({ showDeleteModal: false, isLoading: false });
        })

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
        Api.post('AssignAmedmentContract?parentContractId='+this.state.contractId+'&assignContractId='+this.state.selectedContract.value+'').then(
            res=>{
                this.setState({
                    AmendmentList: res,
                    isLoading: false ,
                    ShowPopup:false
                })
            }
        )
    }
    render() {

        const dataGrid = this.state.isLoading === false ? (
            <GridSetup rows={this.state.AmendmentList} columns={this.state.columns} onRowClick={this.onRowClick}
                showCheckbox={true} clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain} />
        ) : <LoadingSection />

        return (
            <div className="mainContainer">




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
                                                defaultValue={this.state.selectedContract} onChange={setFieldValue}
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
                    <button className="primaryBtn-1 btn mediumBtn" onClick={e => this.setState({ ShowPopup: true })}>{Resources['add'][currentLanguage]}</button>
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
                ) : null}
            </div>
        )
    }
}
export default withRouter(AmendmentList)


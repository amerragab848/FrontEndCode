import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Resources from "../../resources.json";
import ReactTable from "react-table";
import dataservice from "../../Dataservice";
import Config from "../../Services/Config.js";
import Export from "../../Componants/OptionsPanels/Export";
import GridCustom from "../../Componants/Templates/Grid/CustomGrid";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import Api from '../../api';
import config from "../../Services/Config";
import { Formik, Form } from "formik";
import SkyLight from "react-skylight";
import * as Yup from "yup";
import { toast } from "react-toastify";
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

const AdvacedPaymentAmpontSchema = Yup.object().shape({
    amount: Yup.string().required(Resources["amountRequired"][currentLanguage])
});

let selectedRows = [];
let originalData = [];
let original = [];
class AdvacedPaymentAmount extends Component {
    constructor(props) {
        super(props)
        this.columnsGrid = [

            {
                title: '',
                type: 'check-box',
                fixed: true,
                field: 'id'
            },

            {
                field: "createdDate",
                title: Resources["dateOfAdvPaymentAmount"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "date"
            },
            {
                field: "advancedPaymentAmount",
                title: Resources["accumulativeAmount"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "number"
            },
            {
                field: "createdByName",
                title: Resources["AddBy"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "text"
            },

            {
                field: "totalAdvPayAmount",
                title: Resources["totalAmount"][currentLanguage],
                groupable: true,
                width: 16,
                sortable: true,
                type: "number"
            },
        ]

        this.groups = [];

        this.actions = [
            {
                title: 'Delete',
                handleClick: selectedRows => {
                    this.setState({
                        showDeleteModal: true,
                        selectedRows: selectedRows
                    });
                },
                classes: '',
            }
        ];

        this.rowActions = [];

        this.state = {
            Items: [],
            contractId: this.props.contractId,
            selected: {},
            columns: this.columnsGrid,
            isLoading: true,
            gridLoading: true,
            rows: [], //this.props.items,
            selectedRows: [],
            totalRows: 0,// this.props.totalRows,
            pageSize: 50,
            pageNumber: 0,
            filterMode: false,
            api: 'GetAdvancedPaymentBycontractId?',
            pageTitle: Resources['advancedPaymentAmount'][currentLanguage],
            isViewMode: this.props.isViewMode,
            obj: {
                id: 0,
                advancedPaymentAmount: 0,
                contractId: 0
            },

            isDelete: false,
            isAdd: false
        }
    }
    fillGrid = (data) => {
        if (this.state.rows.length > 0) {

            originalData = this.state.rows;

            originalData.push(data);

            this.setState({
                rows: originalData,
                isAdd: true,
                showSubPurchaseOrders: false
            });
        }
        else {

            let originalData = [];

            originalData.push(data);

            this.setState({
                rows: originalData,
                showAdvacedPaymentAmount: false,
                isAdd: true,
            });
        }
    }
    GetNextData = () => {
        let pageNumber = this.state.pageNumber + 1;

        let maxRows = this.state.totalRows;

        if (this.state.pageSize * this.state.pageNumber <= maxRows) {
            this.setState({
                isLoading: true,
                gridLoading: true,
                pageNumber: pageNumber
            });
        }

        let url = this.state.api + "contractId=" + this.state.contractId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
        Api.get(url).then(result => {
            let oldRows = result; //this.state.rows;
            const newRows = oldRows; //[...oldRows, ...result]; // arr3 ==> [1,2,3,3,4,5]
            if (result) {
                this.state.totalRows = this.state.totalRows + result.length;

            }

            this.setState({
                rows: newRows,
                isLoading: false,
                gridLoading: false,

            });
        }).catch(ex => {
            let oldRows = this.state.rows;
            this.setState({
                rows: oldRows,
                isLoading: false,
                gridLoading: false
            });
        });
    };

    GetPreviousData = () => {
        let pageNumber = this.state.pageNumber - 1;

        if (pageNumber >= 0) {

            this.setState({
                isLoading: true,
                gridLoading: true,
                pageNumber: pageNumber
            });
        }
        let url = this.state.api + "contractId=" + this.state.contractId + "&pageNumber=" + pageNumber + "&pageSize=" + this.state.pageSize
        Api.get(url).then(result => {
            let oldRows = result; //[];// this.state.rows;
            const newRows = oldRows;//[...oldRows, ...result];

            this.setState({
                rows: newRows,
                totalRows: result.length,
                isLoading: false,
                gridLoading: false,

            }).catch(() => { this.setState({ isLoading: false }) });
        }).catch(ex => {
            let oldRows = this.state.rows;
            this.setState({
                rows: oldRows,
                isLoading: false,
                gridLoading: false
            });
        });
    };
    handleChangeItems(e, field) {

        let original_amount = { ...this.state.obj };

        let updated_amount = {};

        updated_amount[field] = e.target.value;

        updated_amount = Object.assign(original_amount, updated_amount);

        this.setState({
            obj: updated_amount
        });
    }
    toggleRow(obj) {

        const newSelected = Object.assign({}, this.state.selected);

        newSelected[obj.id] = !this.state.selected[obj.id];

        let setIndex = selectedRows.findIndex(x => x === obj.id);

        if (setIndex > -1) {
            selectedRows.splice(setIndex, 1);
        } else {
            selectedRows.push(obj);
        }

        this.setState({
            selected: newSelected
        });
    }
    componentDidMount = () => {


        this.setState({
            isLoading: true,
            gridLoading: true
        })
        Api.get('GetAdvancedPaymentBycontractId?contractId=' + this.state.contractId + '&pageNumber=' + this.state.pageNumber + '&pageSize=' + this.state.pageSize).then(result => {
            let AdvPAItems = [];
            if (result.length > 0) {
                AdvPAItems = result;
                this.state.ApmPageNumber = this.state.ApmPageNumber + 1;
            }

            this.setState({
                rows: AdvPAItems,
                AdvacedPaymentDataLength: result.length,
                isLoading: false,
                gridLoading: false
            });

        }).catch(() => { this.setState({ isLoading: false }) })

        if (config.IsAllow(1181)) {
            this.setState({ showCheckbox: true, isLoading: false })

        }
    }
    formSubmitHandler = (objValues) => {
        //  e.preventDefault();
        this.setState({
            obj: objValues
        })
        this.simpleDialog.show()
    }
    showAdvacedPaymentAmount = () => {
        this.setState({ showAdvacedPaymentAmount: true });

        this.simpleDialog.show();
    };

    addAdvacedPaymentAmount = (values) => {
        let saveObj = { ...values };
        saveObj.contractId = this.state.contractId;
        this.setState({
            isLoading: true,
            gridLoading: true
        });
     
        dataservice.addObject("AddContractAdvancedPayment", saveObj).then(result => {

            this.setState({

                isLoading: false,
                gridLoading: false,
                isAdd: true,
                rows:result
              
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);
            
              //  this.fillGrid(result);

           
        });

    };
   EditAdvacedPaymentAmount = (values) => {
        let saveObj = { ...values };
        saveObj.contractId = this.state.contractId;
        this.setState({
            isLoading: true,
            gridLoading: true
        });
      
        dataservice.addObject("EditAdvancedPaymentAmount", saveObj).then(result => {

          // let data = this.state.rows;

        //    let index = data.findIndex(x => x.id === result.id);
        //    if (index!==undefined) {

        //       data.splice(index, 1);
        //       data.push(saveObj);
        //    }
        
            this.setState({

                isLoading: false,
                gridLoading: false,
                isAdd: true,
                rows: result,
            });

            toast.success(Resources["operationSuccess"][currentLanguage]);

          this.setState({
            obj: {
                id: 0,
                advancedPaymentAmount: 0,
                contractId: 0
            }
          })

        });

    };
    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    };

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    };


    clickHandlerContinueMain = () => {
        this.setState({
            isLoading: true,
            gridLoading: true
        });

        Api.post("DeleteContractAdvancedPayment?contractId="+this.state.contractId, this.state.selectedRows)
            .then(result => {
                // original = this.state.rows;

                // this.state.selectedRows.map(i => {
                //     original = original.filter(r => r.id !== i);
                // });

                this.setState({
                    rows: result,
                    isDelete: true,
                    totalRows: result.length,
                    isLoading: false,
                    showDeleteModal: false,
                    gridLoading: false
                });

                toast.success('operation complete sucessful');
            })
            .catch(ex => {
                this.setState({
                    isLoading: false,
                    showDeleteModal: false,
                });
            });
    };
    componentDidUpdate(prevProps) {

        if (this.props.items !== prevProps.items) {
            if (this.state.isAdd === true) {
                this.setState({
                    rows: originalData,
                    // gridLoading: false,
                    // isLoading:false,
                    // totalRows: this.props.totalRows,
                });
            }

            if (this.state.isDelete === true) {
                this.setState({
                    rows: original,
                    //  gridLoading: false,
                    // isLoading:false,
                });
            }

        }

    }
    render() {

        let ExportColumns = [
            { field: 'arrange', title: Resources['arrange'][currentLanguage], },

            { field: 'description', title: Resources['dateOfAdvPaymentAmount'][currentLanguage] },

            { field: 'quantity', title: Resources["accumulativeAmount"][currentLanguage] },

            { field: 'deductionValue', title: Resources["AddBy"][currentLanguage] },

            { field: 'deductionValue', title: Resources["totalAmount"][currentLanguage] },

        ]
        const btnExport = this.state.gridLoading === false ? <Export rows={this.state.isLoading === false ? this.state.rows : []} columns={ExportColumns} fileName={this.state.pageTitle} /> : null;

        const addBtn = this.state.gridLoading === false ? (
            <button className="primaryBtn-1 btn meduimBtn" type="submit" onClick={this.showAdvacedPaymentAmount}>
                {Resources["add"][currentLanguage]}
            </button>) : null

        const dataGrid =
            this.state.gridLoading === false ? (

                <GridCustom
                    gridKey="items"
                    data={this.state.rows}
                    pageSize={this.state.pageSize}
                    groups={[]}
                    actions={this.actions}
                    cells={this.columnsGrid}
                    rowActions={this.rowActions}
                    rowClick={cell => this.props.rowClick(cell)}
                    showPicker={false}
                    rowClick={this.formSubmitHandler}
                />
            ) : <LoadingSection />
        return (
            <Fragment >
                <div className="submittalFilter readOnly__disabled">
                    <div className="subFilter">
                        <h3 className="zero"> {Resources['advancedPaymentAmount'][currentLanguage]}</h3>
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
                        {btnExport}

                    </div>
                    <div className="rowsPaginations readOnly__disabled">
                        <div className="rowsPagiRange">
                            <span>{(this.state.pageSize * this.state.pageNumber) + 1}
                                {/* </span> - <span>{(this.state.pageSize * this.state.pageNumber) + this.state.pageSize}</span> of */}
                            </span> - <span>{this.state.totalRows}</span> of
                            <span>{this.state.totalRows}</span>
                        </div>
                        <button className={this.state.pageNumber <= 0 ? "rowunActive" : ""} onClick={this.GetPreviousData}>
                            <i className="angle left icon" />
                        </button>
                        <button onClick={this.GetNextData}>
                            <i className="angle right icon" />
                        </button>
                    </div>

                </div>
                {this.state.gridLoading === false ? (

                    <div className="document-fields">


                        <div className="grid-container">
                            {dataGrid}
                        </div>
                        <div>
                            {addBtn}
                        </div>
                        {this.state.showDeleteModal == true ? (
                            <ConfirmationModal
                                title={Resources["smartDeleteMessageContent"][currentLanguage]}
                                closed={this.onCloseModal}
                                showDeleteModal={this.state.showDeleteModal}
                                clickHandlerCancel={this.clickHandlerCancelMain}
                                buttonName='delete' clickHandlerContinue={this.clickHandlerContinueMain}
                            />
                        ) : null}
                        <div className="skyLight__form" >
                            <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} >
                                <div className="ui modal smallModal">
                                    <h2 className=" zero">
                                        {Resources.advancedPaymentAmount[currentLanguage]}
                                    </h2>
                                    <Formik
                                        initialValues={{ ...this.state.obj }}
                                        validationSchema={AdvacedPaymentAmpontSchema}
                                        enableReinitialize={true}
                                        onSubmit={values => {
                                            if(values.id>0){
                                                this.EditAdvacedPaymentAmount(values);
                                            }
                                            else{
                                                this.addAdvacedPaymentAmount(values);
                                            }
                                            
                                            
                                        }}>
                                        {({ errors, touched, handleBlur, handleChange, values, handleSubmit, setFieldTouched, setFieldValue }) => (
                                            <Form noValidate="novalidate" onSubmit={handleSubmit}>
                                                <div className='document-fields'>
                                                    <div className="proForm datepickerContainer">

                                                        <div className={"ui input inputDev" + (errors.amount && touched.amount ? " has-error" : "ui input inputDev")}>
                                                            <input type="text" className="form-control" id="amount"
                                                                value={values.advancedPaymentAmount}
                                                                name="amount" placeholder={Resources.amount[currentLanguage]}
                                                                onBlur={e => { handleChange(e); handleBlur(e); }}
                                                                onChange={e => this.handleChangeItems(e, "advancedPaymentAmount")} />
                                                            {errors.amount && touched.amount ? (<em className="pError">{errors.amount}</em>) : null}
                                                        </div>

                                                        <div className="slider-Btns fullWidthWrapper">
                                                            {this.state.isLoading === false ? (
                                                                <button className="primaryBtn-1 btn meduimBtn" type="submit">
                                                                    {Resources["save"][currentLanguage]}
                                                                </button>
                                                            ) :
                                                                (<button className="primaryBtn-1 btn disabled">
                                                                    <div className="spinner">
                                                                        <div className="bounce1" />
                                                                        <div className="bounce2" />
                                                                        <div className="bounce3" />
                                                                    </div>
                                                                </button>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </SkyLight>
                        </div>
                    </div>
                ) : <LoadingSection />}

            </Fragment>
        )


    }
}
export default withRouter(AdvacedPaymentAmount)


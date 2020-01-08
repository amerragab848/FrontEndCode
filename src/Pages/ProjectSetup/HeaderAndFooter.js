
import React, { Component, Fragment } from 'react';
import { withRouter } from "react-router-dom";
import ConfirmationModal from "../../Componants/publicComponants/ConfirmationModal";
import GridSetup from "../Communication/GridSetup";
import Export from "../../Componants/OptionsPanels/Export";
import config from "../../Services/Config";
import Resources from "../../resources.json";
import Api from '../../api';
import { toast } from "react-toastify";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import dataservice from "../../Dataservice"
import Filter from "../../Componants/FilterComponent/filterComponent";
import { SkyLightStateless } from 'react-skylight';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as communicationActions from "../../store/actions/communication";
import Dropzone from 'react-dropzone';
import Dropdown from "../../Componants/OptionsPanels/DropdownMelcous";
import api from '../../api'
import { tr } from 'date-fns/locale';
 
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
let CurrProjectName = localStorage.getItem('lastSelectedprojectName')

  
const ValidtionSchema = Yup.object().shape({
    type: Yup.string().required(Resources['isRequiredField'][currentLanguage]).nullable(true)
});

class HeaderAndFooter extends Component {
    constructor(props) {
        super(props)

        if (!config.IsAllow(10056)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
            this.props.history.goBack()
        }

        const columnsGrid = [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "description",
                name: Resources["description"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "type",
                name: Resources["type"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ]

        const FilterColumns = [
            {
                field: "description",
                name: "description",
                type: "string",
                isCustom: false
            }, {
                field: "type",
                name: "type",
                type: "string",
                isCustom: false
            }
        ]
        this.types = [
            { label: Resources['header'][currentLanguage], value: 'Header' },
            { label: Resources['footer'][currentLanguage], value: 'Footer' },
        ]
        this.state = {
            showCheckbox: false,
            columns: columnsGrid,
            isLoading: true,
            rows: [],
            selectedRows: [],
            showDeleteModal: false,
            IsEditModel: false,
            showPopup: false,
            FilterColumns: FilterColumns,
            ApiFilter: 'HeaderFooterFilter?projectId=' + this.props.match.params.id + '&pageNumber=0&pageSize=200&',
            viewfilter: false,
            query: '',
            PageNumber: 0,
            PageSize: 50,
            totalRows: 0,
            document: {},
            uploadedImage: null,
            uploadedImagePreview: null,
            showRemoveBtn: false,
            selectedType: null,
            selectedId: 0
        }
    }

    componentDidMount() {
        this.props.actions.FillGridLeftMenu();

        Api.get('ProjectHeaderFooterGet?projectId=' + this.props.match.params.id + '&pageNumber=' + this.state.PageNumber + '&pageSize=' + this.state.PageSize).then(res => {
            this.setState({ rows: res.data, isLoading: false, totalRows: res.total })
        })
        if (config.IsAllow(485)) {
            this.setState({
                showCheckbox: true
            })
        }

    }

    onRowClick = (obj) => {
        if (!config.IsAllow(483)) {
            toast.warn(Resources['missingPermissions'][currentLanguage])
        }
        else {
            Api.get('GetProjectHeaderFooterForEdit?id=' + obj.id).then(
                res => {
                    this.setState({
                        document: { ...res },
                        showPopup: true,
                        IsEditModel: true,
                        selectedType: this.types.find(x => x.value == res.type),
                        uploadedImage: res.pathImg,
                        uploadedImagePreview: res.pathImg,
                        selectedId: obj.id
                    })
                }
            )
        }
    }

    onCloseModal = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerDeleteRowsMain = (selectedRows) => {
        this.setState({
            selectedRows,
            showDeleteModal: true
        })
    }

    ConfirmDelete = () => {
        this.setState({
            isLoading: true
        })
        Api.post('DeleteMultipleProjectHeaderFooter', this.state.selectedRows).then(res => {
            let originalRows = this.state.rows

            this.state.selectedRows.map(i => {
                originalRows = originalRows.filter(r => r.id !== i);
            })
            this.setState({
                rows: originalRows,
                showDeleteModal: false,
                isLoading: false,
            })
            toast.success(Resources['smartSentAccountingMessage'][currentLanguage].successTitle)
        }
        ).catch(ex => {
            this.setState({
                isLoading: false,
            })
        });
    }

    showPopupModel = () => {
        if (config.IsAllow(485) )
            this.setState({ showPopup: true, IsEditModel: false, selectedId: 0, document: {} });
    }

    hideFilter(value) {
        this.setState({ viewfilter: !this.state.viewfilter });
        return this.state.viewfilter;
    }

    filterMethodMain = (event, query, apiFilter) => {
        if (query.hasOwnProperty('description') || query.hasOwnProperty('type')) {
            delete query.isCustom;
            var stringifiedQuery = JSON.stringify(query);
            let url = this.state.ApiFilter + 'query=' + stringifiedQuery;
            this.setState({ isLoading: true });
            Api.get(url).then(res => {
                this.setState({
                    rows: res,
                    isLoading: false,
                })
            })
        }
    }

    AddEditAction = (values, actions) => {
        this.setState({ isLoading: true })
        let url = this.state.IsEditModel ? "EditProjectHeaderFooter" : "AddProjectHeaderFooter";

        if (this.state.uploadedImage) {
            let formData = new FormData();
            formData.append("file", this.state.uploadedImage[0])
            api.postFile('UploadSignature', formData).then(res => {
                dataservice.addObject(url, {
                    id: this.state.selectedId,
                    projectId: this.props.match.params.id,
                    description: this.state.document.description,
                    type: this.state.document.type
                }).then(res => {
                    let _rows = [...this.state.rows];
                    if (!this.state.IsEditModel)
                        _rows.push(res)
                    else {
                        let oldrows = _rows.filter(function (x) { return x.id != res.id });
                        _rows = [...oldrows, res]
                    }
                    this.setState({ showPopup: false, rows: _rows, isLoading: false, document: {}, uploadedImage: null, uploadedImagePreview: null, showRemoveBtn: false });
                    toast.success(Resources["operationSuccess"][currentLanguage]);

                });
            }).catch(ex => {
                toast.error(Resources["operationCanceled"][currentLanguage]);
            });
        }
    }

    handleChange = (value, field) => {
        let original_document = { ...this.state.document };
        let updated_document = {};
        updated_document[field] = value;
        updated_document = Object.assign(original_document, updated_document);
        this.setState({
            document: updated_document
        });
    }
 
    onDrop = (file) => {
        this.setState({
            uploadedImage: file,
            uploadedImagePreview: URL.createObjectURL(file[0]),
            showRemoveBtn: true
        });
    }

    RemoveHandler = () => {
        this.setState({
            uploadedImage: {}, uploadedImagePreview: {}
        })
    }

    GetMoreData(flag) {

        let PageNumber = this.state.PageNumber + flag;

        if (PageNumber >= 0) {

            this.setState({ isLoading: true, PageNumber });

            Api.get('ProjectHeaderFooterGet?projectId=' + this.props.match.params.id + '&pageNumber=' + PageNumber + '&pageSize=' + this.state.PageSize).then(res => {

                let newRows = [...this.state.rows, ...res.data];
                this.setState({ rows: newRows, isLoading: false, totalRows: res.total })
            }).catch(ex => {
                this.setState({ isLoading: false });
            });
        }
    }

    render() {
        const dataGrid = this.state.isLoading === false ?
            <GridSetup rows={this.state.rows} columns={this.state.columns}
                showCheckbox={this.state.showCheckbox}
                clickHandlerDeleteRows={this.clickHandlerDeleteRowsMain}
                onRowClick={this.onRowClick.bind(this)}
            />
            : null

        const btnExport = this.state.isLoading === false ?
            <Export rows={this.state.isLoading === false ? this.state.rows : []}
                columns={this.state.columns} fileName={Resources['headerAndFooter'][currentLanguage]} />
            : null

        const ComponantFilter = this.state.isLoading === false ?
            <Filter
                filtersColumns={this.state.FilterColumns}
                filterMethod={this.filterMethodMain}
            /> : null

        return (
            <Fragment>
                <div className='mainContainer'>
                    <div className="submittalFilter readOnly__disabled">
                        <div className="subFilter">
                            <h3 className="zero">{CurrProjectName + ' - ' + Resources['headerAndFooter'][currentLanguage]}</h3>
                            <div className="ui labeled icon top right pointing dropdown fillter-button"
                                tabIndex="0" onClick={() => this.hideFilter(this.state.viewfilter)}>
                                <span>
                                    <svg width="16px" height="18px" viewBox="0 0 16 18" version="1.1"
                                        xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <g id="Action-icons/Filters/Hide+text/24px/Grey_Base" transform="translate(-4.000000, -3.000000)">
                                                <g id="Group-4"> <g id="Group-7"> <g id="filter">
                                                    <rect id="bg" fill="#80CBC4" opacity="0" x="0" y="0" width="24" height="24" />
                                                    <path d="M15.5116598,15.1012559 C14.1738351,15.1012559 13.0012477,14.2345362 12.586259,12.9819466 L4.97668038,12.9819466 C4.43781225,12.9819466 4,12.5415758 4,12 C4,11.4584242 4.43781225,11.0180534 4.97668038,11.0180534 L12.586259,11.0180534 C13.0012477,9.76546385 14.1738351,8.89874411 15.5116598,8.89874411 C16.8494845,8.89874411 18.0220719,9.76546385 18.4370606,11.0180534 L19.0233196,11.0180534 C19.5621878,11.0180534 20,11.4584242 20,12 C20,12.5415758 19.5621878,12.9819466 19.0233196,12.9819466 L18.4370606,12.9819466 C18.0220719,14.2345362 16.8494845,15.1012559 15.5116598,15.1012559 Z M15.5116598,10.8626374 C14.8886602,10.8626374 14.3813443,11.372918 14.3813443,12 C14.3813443,12.627082 14.8886602,13.1373626 15.5116598,13.1373626 C16.1346594,13.1373626 16.6419753,12.627082 16.6419753,12 C16.6419753,11.372918 16.1346594,10.8626374 15.5116598,10.8626374 Z M7.78600823,9.20251177 C6.44547873,9.20251177 5.27202225,8.33246659 4.8586039,7.07576209 C4.37264206,7.01672011 4,6.60191943 4,6.10125589 C4,5.60059914 4.37263163,5.1858019 4.85858244,5.12675203 C5.27168513,3.86979791 6.44573643,3 7.78600823,3 C9.1238329,3 10.2964204,3.86671974 10.711409,5.11930926 L19.0233196,5.11930926 C19.5621878,5.11930926 20,5.5596801 20,6.10125589 C20,6.64283167 19.5621878,7.08320251 19.0233196,7.08320251 L10.711409,7.08320251 C10.2964204,8.33579204 9.1238329,9.20251177 7.78600823,9.20251177 Z M7.78600823,4.96389325 C7.1630086,4.96389325 6.65569273,5.4741739 6.65569273,6.10125589 C6.65569273,6.72833787 7.1630086,7.23861852 7.78600823,7.23861852 C8.40900786,7.23861852 8.91632373,6.72833787 8.91632373,6.10125589 C8.91632373,5.4741739 8.40900786,4.96389325 7.78600823,4.96389325 Z M13.1695709,18.8806907 C12.7545822,20.1332803 11.5819948,21 10.2441701,21 C8.90634542,21 7.73375797,20.1332803 7.3187693,18.8806907 L4.97668038,18.8806907 C4.43781225,18.8806907 4,18.4403199 4,17.8987441 C4,17.3571683 4.43781225,16.9167975 4.97668038,16.9167975 L7.3187693,16.9167975 C7.73375797,15.664208 8.90634542,14.7974882 10.2441701,14.7974882 C11.5819948,14.7974882 12.7545822,15.664208 13.1695709,16.9167975 L19.0233196,16.9167975 C19.5621878,16.9167975 20,17.3571683 20,17.8987441 C20,18.4403199 19.5621878,18.8806907 19.0233196,18.8806907 L13.1695709,18.8806907 Z M10.2441701,16.7613815 C9.62117047,16.7613815 9.1138546,17.2716621 9.1138546,17.8987441 C9.1138546,18.5258261 9.62117047,19.0361068 10.2441701,19.0361068 C10.8671697,19.0361068 11.3744856,18.5258261 11.3744856,17.8987441 C11.3744856,17.2716621 10.8671697,16.7613815 10.2441701,16.7613815 Z"
                                                        id="Shape" fill="#5E6475" fillRule="nonzero" />
                                                </g>
                                                </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </span>
                                <span className={"text " + (this.state.viewfilter === false ? " " : " active")}>
                                    <span className="show-fillter">{Resources["showFillter"][currentLanguage]}</span>
                                    <span className="hide-fillter">{Resources["hideFillter"][currentLanguage]}</span>
                                </span>
                            </div>
                        </div>
                        <div className="filterBTNS">
                            {config.IsAllow(10053) ?
                                <button className="primaryBtn-1 btn mediumBtn" onClick={this.showPopupModel}>New</button>
                                : null}
                            {btnExport}
                        </div>
                        <div className="rowsPaginations readOnly__disabled">
                            <div className="rowsPagiRange">
                                <span>{this.state.PageSize * this.state.PageNumber + 1}</span> -
                                  <span>
                                    {(this.state.PageSize * this.state.PageNumber + this.state.PageSize) >= this.state.totalRows ? this.state.totalRows : (this.state.PageSize * this.state.PageNumber + this.state.PageSize)}
                                </span>
                                {Resources['jqxGridLanguage'][currentLanguage].localizationobj.pagerrangestring}
                                <span> {this.state.totalRows}</span>
                            </div>
                            <button className={this.state.PageNumber == 0 ? "rowunActive" : ""} onClick={() => this.GetMoreData(-1)}><i className="angle left icon" /></button>
                            <button className={this.state.totalRows !== this.state.PageSize * this.state.PageNumber + this.state.PageSize ? "rowunActive" : ""} onClick={() => this.GetMoreData(1)}>
                                <i className="angle right icon" />
                            </button>
                        </div>

                    </div>

                    <div className="filterHidden"
                        style={{
                            maxHeight: this.state.viewfilter ? "" : "0px",
                            overflow: this.state.viewfilter ? "" : "hidden"
                        }}>
                        <div className="gridfillter-container">
                            {ComponantFilter}
                        </div>
                    </div>

                    <div className="grid-container">
                        {dataGrid}
                    </div>

                    <div className="skyLight__form">
                        <SkyLightStateless onOverlayClicked={() => this.setState({ showPopup: false, IsEditModel: false })}
                            title={this.state.IsEditModel ? Resources['editTitle'][currentLanguage] : Resources['goAdd'][currentLanguage]}
                            onCloseClicked={() => this.setState({ IsEditModel: false, showPopup: false })} isVisible={this.state.showPopup}>
                            <Formik
                                initialValues={this.state.document}

                                enableReinitialize={true}

                                validationSchema={ValidtionSchema}

                                onSubmit={(values, actions) => {

                                    this.AddEditAction(values, actions)
                                }}>

                                {({ errors, touched, handleSubmit, setFieldTouched, setFieldValue }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <div className='document-fields'>
                                            <div className="proForm datepickerContainer">
                                                <div className="linebylineInput fullInputWidth">
                                                    <Dropdown title="type"
                                                        data={this.types}
                                                        isMulti={false}
                                                        selectedValue={this.state.selectedType}
                                                        handleChange={event => {
                                                            this.setState({ selectedType: event })
                                                            this.handleChange(event.value, "type")
                                                        }}
                                                        onChange={setFieldValue}
                                                        onBlur={setFieldTouched}
                                                        error={errors.type}
                                                        touched={touched.type}
                                                        name="type" id="type" />
                                                </div>
                                                <div className="linebylineInput fullInputWidth">
                                                    <label className="control-label">{Resources['description'][currentLanguage]}</label>
                                                    <div className="ui input inputDev">
                                                        <input type="text" className="form-control" id="description"
                                                            value={this.state.document.description}
                                                            name="description"
                                                            placeholder={Resources.description[currentLanguage]}
                                                            onChange={e => this.handleChange(e.target.value, "description")} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="slider-Btns">
                                                <button className="primaryBtn-1 btn meduimBtn" type='submit' >{this.state.IsEditModel ? Resources['editTitle'][currentLanguage] : Resources['addTitle'][currentLanguage]}</button>
                                            </div>
                                            <div className="thumbUploadedImg">
                                                {this.state.uploadedImage ? <img alt='' src={this.state.uploadedImage} /> : null}
                                            </div>
                                            <section className="singleUploadForm">
                                                {this.state.showRemoveBtn ?
                                                    <aside className='thumbsContainer'>
                                                        <div className="uploadedName ">
                                                            <p>{this.state.uploadedImage[0].name || null}</p>
                                                        </div>
                                                        {this.state.uploadedImage[0].name ?
                                                            <div className="thumbStyle" key={this.state.uploadedImage}>
                                                                <div className="thumbInnerStyle">
                                                                    <img alt=''
                                                                        src={this.state.uploadedImagePreview}
                                                                        className="imgStyle"
                                                                    />
                                                                </div>
                                                            </div>
                                                            : null}

                                                    </aside> : null}

                                                <Dropzone
                                                    accept="image/*"
                                                    onDrop={this.onDrop}
                                                >
                                                    {({ getRootProps, getInputProps }) => (
                                                        <div className="singleDragText" {...getRootProps()}>
                                                            <input {...getInputProps()} />
                                                            {this.state.uploadedImage ? this.state.uploadedImage[0].name : null ?
                                                                null : <p>{Resources['dragFileHere'][currentLanguage]}</p>}
                                                            <button type="button" className="primaryBtn-2 btn smallBtn">{Resources['chooseFile'][currentLanguage]}</button>
                                                        </div>
                                                    )}
                                                </Dropzone>
                                                {this.state.showRemoveBtn ?
                                                    <div className="removeBtn">
                                                        <button type="button" className="primaryBtn-2 btn smallBtn" onClick={this.RemoveHandler}>{Resources['clear'][currentLanguage]}</button>
                                                    </div> : null}
                                            </section>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </SkyLightStateless>
                    </div>

                    {this.state.showDeleteModal == true ? (
                        <ConfirmationModal
                            title={Resources['smartDeleteMessage'][currentLanguage].content}
                            closed={this.onCloseModal}
                            showDeleteModal={this.state.showDeleteModal}
                            clickHandlerCancel={this.clickHandlerCancelMain}
                            buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                        />
                    ) : null}
                </div>
            </Fragment>
        )

    }
}

function mapStateToProps(state, ownProps) {
    return {
        projectId: state.communication.projectId,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderAndFooter))
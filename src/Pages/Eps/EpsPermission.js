import React, { Component, Fragment } from 'react'
import 'react-table/react-table.css'
import pdf from '../../Styles/images/pdfAttache.png'
import xlsx from '../../Styles/images/attatcheXLS.png'
import doc from '../../Styles/images/attatcheDOC.png'
import Recycle from '../../Styles/images/attacheRecycle.png'
import EyeShow from '../../Styles/images/EyeShow.png'
import Plus from '../../Styles/images/plus-Eps.png'
import Edit from '../../Styles/images/Designmanagement.png'
import Api from '../../api';
import Resources from '../../resources.json';
import { toast } from "react-toastify";
import { connect } from 'react-redux';
import ConfirmationModal from '../../Componants/publicComponants/ConfirmationModal'
import {
    bindActionCreators
} from 'redux';
import LoadingSection from '../../Componants/publicComponants/LoadingSection';
import SkyLight from 'react-skylight';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import * as communicationActions from '../../store/actions/communication';
import Config from '../../Services/Config';
import { Record } from 'immutable';
import { element, func } from 'prop-types';

let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
const validationSchema = Yup.object().shape({
    englishTitle: Yup.string().required(Resources['titleEnValid'][currentLanguage]),
    arabicTitle: Yup.string().required(Resources['titleArValid'][currentLanguage])

});
class EpsPermission extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoadingEps: false,
            isLoading: false,
            values: {
                showInReport: true
            },
            eps: [],
            item: {},
            type: '',
            isEdit: false,
            showDeleteModal: false
        }
    }


    versionHandler = (parentId) => {
        let urlVersion = 'GetChildFiles?docTypeId=' + this.state.docTypeId + '&docId=' + this.state.docId + '&parentId=' + parentId
        Api.get(urlVersion).then(result => {

        }).catch(ex => {
        });
    }
    addEditEps = () => {
        if (this.state.isEdit) {

            this.setState({ isLoading: true })
            let item = Object.assign(this.state.item, { title: this.state.values.englishTitle }, { titleAr: this.state.values.arabicTitle }, { titleEn: this.state.values.englishTitle })
            Api.post("EditEpsById", item).then((res) => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.setState({ isLoading: false, showModal: false, type: '' })
                this.EditRecord(res)
            }).catch(res => {
                this.setState({ isLoading: false, showModal: false })

            });
        } else {
            let Eps = {
                parentId: this.state.type == 'child' ? this.state.item.id : null,
                titleEn: this.state.values.englishTitle,
                titleAr: this.state.values.arabicTitle,
                showInReport: this.state.values.showInReport
            }
            this.setState({ isLoading: true })
            Api.post("AddEps", Eps).then((res) => {
                toast.success(Resources["operationSuccess"][currentLanguage]);
                this.setState({ isLoading: false, showModal: false, type: '' })
                this.addRecord(res)
            }).catch(res => {
                this.setState({ isLoading: false, showModal: false })

            });
        }
    }


    componentDidMount() {
        this.getData()
    }
    addRecord(recod) {
        let table = this.state.eps;
        table.push(recod);
        this.setState({ esp: table })
    }
    EditRecord(recod) {
        let table = this.state.eps;
        table.forEach((element, Index) => {
            if (element.id == recod.id) {
                table[Index] = recod
                return
            }
        }, function () {
            this.setState({ esp: table })
        })

    }
    deleteRecord(recod) {
        this.setState({ isLoadingEps: true })
        Api.get('GetEps').then(res => {
            this.setState({ eps: res, isLoadingEps: false })
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
        })
    }
    onCloseModal() {
        this.setState({ showDeleteModal: false });
    }

    clickHandlerCancelMain = () => {
        this.setState({ showDeleteModal: false });
    }

    ConfirmDelete = () => {
        this.setState({ isLoading: true, showDeleteModal: false })
        Api.post("DeletEpsById?id=" + this.state.item.id).then((res) => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            this.setState({ isLoading: false, showModal: false, type: '' })
            this.deleteRecord(this.state.item)
        }).catch(res => {
            this.setState({ isLoading: false, showModal: false })
        });
    }

    getData() {
        this.setState({ isLoadingEps: true })
        Api.get('GetEps').then(res => {
            this.setState({ eps: res, isLoadingEps: false })
        }).catch(() => {
            toast.error(Resources["operationCanceled"][currentLanguage]);
        })
    }

    view = () => {
        alert('lesa mt3mlha4 implmention !!')
    }

    openModal = () => {
        if (this.state.isEdit) {
            let item = this.state.item

            this.setState({
                values: { ...this.state.values, englishTitle: item.titleEn, arabicTitle: item.titleAr, showInReport: item.showInReport },
                showModal: true
            }, function () {
                this.simpleDialog.show()
            })
        }
        else {
            this.setState({ showModal: true })
            this.simpleDialog.show()
        }
    }

    render() {
        let tabel = this.state.eps ? this.state.eps.map((item, Index) => {
            return (
                <tr key={Index}>
                    <td>
                        <div className="contentCell tableCell-1">
                            <span>

                            </span>
                        </div>
                    </td>
                    <td>
                        <div className="contentCell tableCell-2">
                            <a href={item['title']} className="pdfPopup various zero" data-toggle="tooltip" title={item['title']}>{item['titleEn']}</a>
                        </div>
                    </td>

                    <td className="tdHover">
                        <div className="attachmentAction">
                            <a className="attachPlus" onClick={() => { this.setState({ item: item, isEdit: false, type: 'child' }, function () { this.openModal(); }) }}>
                                <img src={Plus} alt="dLoad" width="100%" height="100%" />
                            </a>
                            <a className="attachEye" onClick={() => this.view(item)}>
                                <img src={EyeShow} alt="pend" width="100%" height="100%" />
                            </a>
                            <a className="attachEdit" onClick={() => { this.setState({ item: item, isEdit: true, type: 'child' }, function () { this.openModal(); }) }}>
                                <img src={Edit} alt="pend" width="100%" height="100%" />
                            </a>
                            <a className="attachRecycle" onClick={() => this.setState({ item, item, showDeleteModal: true })}>
                                <img src={Recycle} alt="del" width="100%" height="100%" />
                            </a>
                        </div>
                    </td>
                </tr>
            );
        }) : ''

        let Eps = <React.Fragment>
            <div>
                {this.state.isLoading ? <LoadingSection /> : null}
                <Formik
                    initialValues={{
                        englishTitle: this.state.values.englishTitle,
                        arabicTitle: this.state.values.arabicTitle,
                    }}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        this.addEditEps()
                    }} >
                    {({ errors, touched, handleBlur, handleChange, handleSubmit, setFieldTouched, setFieldValue, values }) => (
                        <Form id=" MinutesOfMeeting" className="proForm datepickerContainer" noValidate="novalidate" onSubmit={handleSubmit}>
                            <div className="dropWrapper fullInputWidth">
                                <div className="fillter-status fillter-item-c ">
                                    <label className="control-label">{Resources['titleEn'][currentLanguage]} </label>
                                    <div className={"inputDev ui input " + (errors.englishTitle ? 'has-error' : !errors.englishTitle && touched.englishTitle ? (" has-success") : " ")}>
                                        <input name='englishTitle'
                                            className="form-control"
                                            id="englishTitle" placeholder={Resources['titleEn'][currentLanguage]} autoComplete='off'
                                            onBlur={handleBlur} defaultValue={values.englishTitle}
                                            onChange={e => {
                                                handleChange(e);
                                                this.setState({ values: { ...this.state.values, englishTitle: e.target.value } })
                                            }} />
                                        {errors.englishTitle ? (<em className="pError">{errors.englishTitle}</em>) : null}
                                    </div>
                                </div>
                                <div className="fillter-status fillter-item-c">
                                    <label className="control-label">{Resources['titleAr'][currentLanguage]} </label>
                                    <div className={"inputDev ui input " + (errors.arabicTitle ? 'has-error' : !errors.arabicTitle && touched.arabicTitle ? (" has-success") : " ")}>
                                        <input name='arabicTitle'
                                            className="form-control"
                                            id="arabicTitle" placeholder={Resources['titleAr'][currentLanguage]} autoComplete='off'
                                            onBlur={handleBlur} defaultValue={values.arabicTitle}
                                            onChange={e => {
                                                handleChange(e);
                                                this.setState({ values: { ...this.state.values, arabicTitle: e.target.value } })
                                            }} />
                                        {errors.arabicTitle ? (<em className="pError">{errors.arabicTitle}</em>) : null}
                                    </div>
                                </div>
                                <div className="fillter-status fillter-item-c">
                                    <div className="ui checkbox checkBoxGray300 checked">
                                        <input type="checkbox" defaultChecked={this.state.item.showInReport} onChange={e => {
                                            handleChange(e);
                                            this.setState({ values: { ...this.state.values, showInReport: e.target.checked } })
                                        }} />
                                        <label>{Resources.showInReport[currentLanguage]}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="slider-Btns fullWidthWrapper">
                                <button className={"primaryBtn-1 btn"} type="submit"  >{Resources['save'][currentLanguage]}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

        </React.Fragment>

        return (
            <div className='mainContainer'>
                {this.state.isLoadingEps == true ? null :
                    <Fragment>
                        <div className="fullWidthWrapper textRight">
                            <button className="primaryBtn-1 btn mediumBtn" onClick={() => this.openModal()}>{Resources['addNew'][currentLanguage]}</button>
                        </div>
                        <table className="attachmentTable">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="headCell tableCell-1">

                                        </div>
                                    </th>
                                    <th>
                                        <div className="headCell tableCell-2">
                                            <span>{Resources['fileName'][currentLanguage]} </span>
                                        </div>
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tabel}
                            </tbody>
                        </table>
                    </Fragment>
                }
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title={Resources['smartDeleteMessage'][currentLanguage].content}
                        closed={this.onCloseModal}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={this.clickHandlerCancelMain}
                        buttonName='delete' clickHandlerContinue={this.ConfirmDelete}
                    />
                ) : null}
                <div className="largePopup largeModal " style={{ display: this.state.showModal ? 'block' : 'none' }}>
                    <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title={Resources['editEPS'][currentLanguage]}>
                        {Eps}
                    </SkyLight>
                </div>
            </div>
        )
    }

}

function mapStateToProps(state, ownProps) {
    return {
        files: state.communication.files,
        isLoadingFiles: state.communication.isLoadingFiles,
        changeStatus: state.communication.changeStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(communicationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EpsPermission)

import React, { Component } from 'react'
import Resources from "../../resources.json";
import Api from "../../api";
import dataservice from "../../Dataservice";
import { toast } from "react-toastify";
import moment from "moment";
import LoadingSection from './LoadingSection'
import ConfirmationModal from "./ConfirmationModal";
import { SkyLightStateless } from 'react-skylight';
const orderBy = require('lodash/orderBy');

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class RiskConesquence extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conesquenceList: [],
            conesquenceItems: [],
            isLoading: true,
            riskId: this.props.riskId,
            selected: {},
            showDeleteModal: false,
            ShowPopup: false
        }
    }

    componentDidMount() {
        if (this.state.riskId) {

            dataservice.GetDataGrid("GetAllConesquencesByRiskId?riskId=" + this.state.riskId).then(result => {

                let selected = this.state.selected;
                result = orderBy(result, ['conesquenceId'], ['asc']); // Use Lodash to sort array by 'name'

                result.forEach(item => {
                    selected[item.id] = item.isChecked;
                });

                this.setState({
                    conesquenceItems: result,
                    isLoading: false,
                    selected: selected
                });
            }).catch(() => {
                this.setState({
                    conesquenceItems: [], isLoading: false
                });
            });
        }
    }

    renderEditable = (cellInfo) => {

        return (
            <div style={{ color: "#4382f9 ", padding: '0px 6px', margin: '5px 0px', border: '1px dashed', cursor: 'pointer', width: '100%' }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const conesquenceItems = [...this.state.conesquenceItems];
                    conesquenceItems[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({ isLoading: true })
                    Api.post('EditConesquence', conesquenceItems[cellInfo.index]).then(() => {
                        this.setState({ conesquenceItems, isLoading: false });
                    })
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.conesquenceItems[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

    chooseConesquence = (item) => {
        let existinTable = this.state.conesquenceItems.findIndex((i) => i.conesquenceId == item.id)
        if (existinTable == -1) {
            this.setState({ [item.id]: true })
            let conesquenceObj = {
                riskId: this.state.riskId,
                conesquenceId: item.id,
                comment: '',
                addedDate: moment().format('MM/DD/YYYY'),

            }
            this.setState({ isLoading: true })
            dataservice.addObject('AddConesquence', conesquenceObj).then(result => {
                let conesquenceItems = this.state.conesquenceItems;
                let conesquenceItem = result;
                if (result.id > 0) {
                    conesquenceItems.push(conesquenceItem);
                    this.setState({ conesquenceItems, isLoading: false, [item.id]: false })
                }
                else
                    this.setState({ isLoading: false, [item.id]: false })

            })
            this.setState({ [item.id]: true });
        }
    }

    deleteConesquence = (id, e) => {
        this.setState({ isLoading: true })
        Api.post('DeleteConesquence?id=' + id).then(result => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            let conesquenceItems = this.state.conesquenceItems.filter(element => element.id != id);
            this.setState({ isLoading: false, conesquenceItems })
        }).catch(() => {
            toast.success(Resources["operationCanceled"][currentLanguage]);

        })
    }

    showModal = (e, index) => {
        this.setState({ showDeleteModal: true, comment: e.target.innerHTML, index: index })
    }

    showPopup = () => {
        this.setState({ ShowPopup: true, showDeleteModal: false })
    }

    saveComment = () => {
        let comment = this.state.comment
        let index = this.state.index
        const conesquenceItems = [...this.state.conesquenceItems];
        conesquenceItems[index].comment = comment;
        this.setState({ isLoading: true })
        Api.post('EditConesquence', conesquenceItems[index]).then(() => {
            this.setState({
                conesquenceItems,
                isLoading: false,
                showDeleteModal: false,
                ShowPopup: false
            });
        })
    }

    toggleRow(obj, index) {

        this.setState({ isLoading: true })

        const newSelected = Object.assign({}, this.state.selected);

        newSelected[obj.id] = !this.state.selected[obj.id];

        const conesquenceItems = [...this.state.conesquenceItems];

        conesquenceItems[index].isChecked = newSelected[obj.id];

        Api.post('EditConesquence', conesquenceItems[index]).then(() => {
            this.setState({
                selected: newSelected,
                isLoading: false
            });
        })
    }

    render() {


        return (
            <div className="doc-pre-cycle letterFullWidth">

                <div className="skyLight__form">
                    <SkyLightStateless onOverlayClicked={e => this.setState({ ShowPopup: false })}
                        title='Edit Comment'
                        onCloseClicked={e => this.setState({ ShowPopup: false })} isVisible={this.state.ShowPopup}>
                        <div className="doc-pre-cycle">
                            <div className="subiTabsContent feilds__top">
                                <div className='document-fields'>
                                    <div className="letterFullWidth proForm  first-proform ">
                                        <div className="linebylineInput valid-input">
                                            <label className="control-label">{Resources['comment'][currentLanguage]} </label>
                                            <div className='inputDev ui input'>
                                                <input name='comment' className="form-control" autoComplete='off'
                                                    placeholder={Resources['comment'][currentLanguage]}
                                                    value={this.state.comment}
                                                    onChange={e => this.setState({ comment: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="fullWidthWrapper">
                            <button type='button' className="primaryBtn-1 btn meduimBtn" onClick={this.saveComment}  >{Resources.save[currentLanguage]}</button>
                        </div>
                    </SkyLightStateless>
                </div>

                <header className="subHeader" style={{ padding: '0' }} >
                    <h2 className="zero">{Resources['riskConesquence'][currentLanguage]}</h2>
                </header>
                <div className="riskConContainer">
                    {this.state.isLoading == true ? <LoadingSection /> :

                        <div className="doc-pre-cycle letterFullWidth">

                            <table className="attachmentTable">
                                <thead>
                                    <tr>
                                        <th>
                                            <div className="headCell tableCell-1">{Resources['checkList'][currentLanguage]}</div>
                                        </th>
                                        <th colSpan="1">
                                            <div className="headCell tableCell-2" style={{ maxWidth: '100%' }}> {Resources.conesquenceName[currentLanguage]}</div>
                                        </th>
                                        <th colSpan="3">
                                            <div className="headCell tableCell-2"> {Resources.description[currentLanguage]}</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.conesquenceItems.map((item, index) => {
                                        return (
                                            <tr key={item.id + '-' + index}>
                                                <td className="removeTr">
                                                    <div className="ui checked checkbox  checkBoxGray300 ">
                                                        <input type="checkbox" className="checkbox" checked={this.state.selected[item.id] === true} onChange={() => this.toggleRow(item, index)} />
                                                        <label />
                                                    </div>
                                                </td>
                                                <td colSpan="1" style={{ maxWidth: "150px" }}>
                                                    <div className="contentCell tableCell-10" style={{ maxWidth: '100%', paddingLeft: '16px' }}> {item.consequenceName}</div>
                                                </td>
                                                <td colSpan="3" style={{ maxWidth: '290px' }}>
                                                    <div className="contentCell tableCell-10" style={{ maxWidth: '100%', paddingLeft: '16px' }}>
                                                        {this.state.selected[item.id] === true ?
                                                            <div style={{ color: "#4382f9 ", padding: '0px 6px', margin: '5px 0px', border: '1px dashed', cursor: 'pointer', width: '100%' }}
                                                                contentEditable
                                                                suppressContentEditableWarning
                                                                onClick={e => this.showModal(e, index)}
                                                                dangerouslySetInnerHTML={{ __html: item.comment }} />
                                                            : <div>{item.comment}
                                                            </div>}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                    }
                </div>
                {this.state.showDeleteModal == true ? (
                    <ConfirmationModal
                        title='Do You Want to Edit Comment ?'
                        closed={e => this.setState({ showDeleteModal: false })}
                        showDeleteModal={this.state.showDeleteModal}
                        clickHandlerCancel={e => this.setState({ showDeleteModal: false })}
                        buttonName='yes' clickHandlerContinue={this.showPopup} />
                ) : null}
            </div>
        );
    }
}

export default RiskConesquence
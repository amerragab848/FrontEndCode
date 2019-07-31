import React, { Component, Fragment } from 'react'
import Resources from "../../resources.json";
import Api from "../../api";
import dataservice from "../../Dataservice";
import { toast } from "react-toastify";
import moment from "moment";
import LoadingSection from './LoadingSection'

const _ = require('lodash');
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class RiskConesquence extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conesquenceList: [],
            conesquenceItems: [],
            isLoading: true,
            riskId: this.props.riskId,
            selected: {}
        }
    }

    componentWillMount() {
        if (this.state.riskId) {

            dataservice.GetDataGrid("GetAllConesquencesByRiskId?riskId=" + this.state.riskId).then(result => {

                let selected = this.state.selected;
                result = _.orderBy(result, ['conesquenceId'],['asc']); // Use Lodash to sort array by 'name'

                result.forEach(item => {
                    selected[item.id] = item.isChecked;
                });

                this.setState({
                    conesquenceItems: result, 
                    isLoading: false,
                    selected:selected
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

    updateComment(e, index) {

        const conesquenceItems = [...this.state.conesquenceItems];

        conesquenceItems[index].comment = e.target.innerHTML;

        this.setState({ isLoading: true })
        Api.post('EditConesquence', conesquenceItems[index]).then(() => {
            this.setState({
                conesquenceItems,
                isLoading: false
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
                <div className="document-fields">
                    <header style={{ paddingTop: '0' }}>
                        <h2 className="zero">{Resources['riskConesquence'][currentLanguage]}</h2>
                    </header>
                    <div className="riskConContainer">
                        {this.state.isLoading == true ? <LoadingSection /> :
                            <Fragment> 
                                <div className="doc-pre-cycle letterFullWidth">
                                    <div className='document-fields'>
                                        <table className="attachmentTable">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <div className="headCell tableCell-1">{Resources['checkList'][currentLanguage]}</div>
                                                    </th>
                                                    <th>
                                                        <div className="headCell"> {Resources.conesquenceName[currentLanguage]}</div>
                                                    </th>
                                                    <th>
                                                        <div className="headCell"> {Resources.comment[currentLanguage]}</div>
                                                    </th>
                                                    <th>
                                                        <div className="headCell"> {Resources.addedDate[currentLanguage]}</div>
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
                                                            <td>
                                                                <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.consequenceName}</div>
                                                            </td>
                                                            <td>
                                                                <div className="contentCell tableCell-3" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}>
                                                                    {
                                                                        this.state.selected[item.id] === true ?
                                                                            <div style={{ color: "#4382f9 ", padding: '0px 6px', margin: '5px 0px', border: '1px dashed', cursor: 'pointer', width: '100%' }}
                                                                                contentEditable
                                                                                suppressContentEditableWarning
                                                                                onBlur={e => this.updateComment(e, index)}
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: item.comment
                                                                                }} /> : <div>{item.comment}</div>}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.addedDate != null ? moment(item.addedDate).format('DD/MM/YYYY') : 'No Date'}</div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Fragment>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default RiskConesquence
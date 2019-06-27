import React, { Component } from 'react'
import Resources from "../../resources.json";
import Api from "../../api";
import dataservice from "../../Dataservice";
import { toast } from "react-toastify";
import ReactTable from "react-table";
import moment from "moment";
import LoadingSection from './LoadingSection'
import Recycle from '../../Styles/images/attacheRecycle.png'

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class RiskConesquence extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conesquenceList: [],
            conesquenceItems: [],
            isLoading: true,
            riskId: this.props.riskId

        }
    }

    componentWillMount() {
        dataservice.GetDataGrid("GetaccountsDefaultListForList?listType=ConsequencesFactosrs").then(result => {
            if (result) {
                this.setState({
                    conesquenceList: result, isLoading: false
                });
            }
            else
                this.setState({
                    conesquenceList: [], isLoading: false
                });
        });

        if (this.state.riskId) {
            dataservice.GetDataGrid("GetAllConesquencesByRiskId?riskId=" + this.state.riskId).then(result => {
                this.setState({
                    conesquenceItems: result, isLoading: false
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
            <div
                style={{ color: "#4382f9 ", padding: '0px 6px', margin: '5px 0px', border: '1px dashed', cursor: 'pointer', width: '100%' }}
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

    render() {
        return (
            <div className="doc-pre-cycle letterFullWidth">
                <div className="document-fields">
                    <header style={{ paddingTop: '0' }}>
                        <h2 className="zero">{Resources['riskConesquence'][currentLanguage]}</h2>
                    </header>
                    <div className="riskConContainer">
                        {this.state.isLoading == true ? <LoadingSection /> :
                            <React.Fragment>
                                {/* {checkBoxs} */}
                                <div className="doc-pre-cycle letterFullWidth">
                                    <div className='document-fields'>
                                        <table className="attachmentTable">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <div className="headCell tableCell-1">{Resources['delete'][currentLanguage]}</div>
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
                                                                <div className="contentCell tableCell-1">
                                                                    <span className="pdfImage" onClick={(e) => this.DeleteItem(item.id)} >
                                                                        <img src={Recycle} alt="Delete" />
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.consequenceName}</div>
                                                            </td>
                                                            <td>
                                                                <div className="contentCell tableCell-3" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}>
                                                                    <div
                                                                        style={{ color: "#4382f9 ", padding: '0px 6px', margin: '5px 0px', border: '1px dashed', cursor: 'pointer', width: '100%' }}
                                                                        contentEditable
                                                                        suppressContentEditableWarning
                                                                        onBlur={e => this.updateComment(e, index)}
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: this.state.conesquenceItems[index][item.id]
                                                                        }}
                                                                    /></div>
                                                            </td>
                                                            <td>
                                                                <div className="contentCell tableCell-1" style={{ maxWidth: 'inherit', paddingLeft: '16px' }}> {item.addedDate != null ? moment(item.addedDate).format('DD/MM/YYYY') : 'No Date'}</div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
export default RiskConesquence
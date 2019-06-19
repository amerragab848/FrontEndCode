import React, { Component } from 'react'
import Resources from "../../resources.json";
import Api from "../../api";
import dataservice from "../../Dataservice";
import { toast } from "react-toastify";
import ReactTable from "react-table";
import moment from "moment";
import LoadingSection from './LoadingSection'
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
class RiskConesquence extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conesquenceList: [],
            conesquenceItems: [],
            isLoading: true,
            riskId: 2

        }
    }

    componentWillMount() {
        dataservice.GetDataGrid("GetaccountsDefaultListForList?listType=consequences").then(result => {
            this.setState({
                conesquenceList: result, isLoading: false
            });
        });
    }

    renderEditable = (cellInfo) => {
        return (
            <div
                style={{ color: "#4382f9 ", padding: '0px 6px', margin: '5px 0px', border: '1px dashed', cursor: 'pointer' }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const conesquenceItems = [...this.state.conesquenceItems];
                    conesquenceItems[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    const updatedItem = conesquenceItems[cellInfo.index]
                    const updatedItems = this.state.conesquenceItems
                    let index = updatedItems.findIndex(item => item.id == updatedItem.id)
                    if (index != -1)
                        updatedItems[index] = updatedItem
                    this.setState({ conesquenceItems: updatedItem });

                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.items[cellInfo.index][cellInfo.column.id]
                }}
            />
        );

    }
    chooseConesquence = (item) => {
        let checked = this.state[item.id] ? this.state[item.id].checked : false;
        if (checked == false) {
            this.setState({ isLoading: true })
            let conesquenceObj = {
                riskId: this.state.riskId,
                conesquenceId: item.id,
                comment: '',
                addedDate: moment().format('MM/DD/YYYY')
            }
            dataservice.addObject('AddConesquence', conesquenceObj).then(result => {
                let conesquenceItems = this.state.conesquenceItems;
                conesquenceItems.push(result);
                this.setState({ conesquenceItems, isLoading: false })
            })
            this.setState({ [item.id]: true });
        }
    }
    deleteConesquence = (id, e) => {
        Api.post('DeleteConesquence?id=' + id).then(result => {
            toast.success(Resources["operationCancelled"][currentLanguage]);
        }).catch(() => {

        })
    }
    render() {
        let checkBoxs = this.state.conesquenceList.map(item => {
            return (
                <div className="project__Permissions--type " key={item.id} >
                    <div id="allSelected" className={"ui checkbox checkBoxGray300  " + (this.state[item.id] ? this.state[item.id].checked : null)}
                        onClick={e => this.chooseConesquence(item)} >
                        <input name="CheckBox" type="checkbox" id="allPermissionInput" checked={this.state[item.id] ? (this.state[item.id].checked == true ? "checked" : null) : null}
                        />
                        <label>{item.title}</label>
                    </div>
                </div>
            )
        })
        let table = <ReactTable
            data={this.state.conesquenceItems}
            columns={[
                {
                    Cell: props => {
                        return (
                            <i className='fa fa-plus-circle' onClick={e => this.deleteConesquence(props.original.id)} />
                        )

                    }, width: 30
                },
                {
                    Header: Resources.numberAbb[currentLanguage],
                    accessor: 'id'
                }, {
                    Header: Resources.description[currentLanguage],
                    accessor: 'riskId'
                }, {
                    Header: Resources.unit[currentLanguage],
                    accessor: 'conesquenceId'
                }, {
                    Header: Resources.quantity[currentLanguage],
                    accessor: 'comment',
                }, {
                    Header: Resources.stock[currentLanguage],
                    accessor: 'addedDate',
                }
            ]
            }
            defaultPageSize={5}
            className="-striped -highlight"
        />
        return (
            <div className="mainContainer">
                <div className="documents-stepper noTabs__document">
                    {this.state.isLoading == true ? <LoadingSection /> :
                        <div className="doc-container">
                            <div className="step-content">
                                <div className="subiTabsContent">
                                    <div className="document-fields">
                                        {checkBoxs}
                                    </div>
                                    <div className="document-fields">
                                        {table}
                                    </div>
                                </div>
                            </div>
                        </div>}
                </div>
            </div>

        );
    }
}
export default RiskConesquence
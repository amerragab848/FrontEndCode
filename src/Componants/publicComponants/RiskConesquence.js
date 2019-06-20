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
        dataservice.GetDataGrid("GetaccountsDefaultListForList?listType=consequences").then(result => {
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
        if(this.state.riskId){
        dataservice.GetDataGrid("GetAllConesquencesByRiskId?riskId=" + this.state.riskId).then(result => {
            this.setState({
                conesquenceItems: result, isLoading: false
            });
        }).catch(() => {
            this.setState({
                conesquenceItems: [], isLoading: false
            });
        });}
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
                addedDate: moment().format('MM/DD/YYYY')
            }
            this.setState({ isLoading: true })
            dataservice.addObject('AddConesquence', conesquenceObj).then(result => {
                let conesquenceItems = this.state.conesquenceItems;
                let conesquenceItem = result;
                if (result.id > 0) {
                    conesquenceItem.addedDate = moment(conesquenceItem).format("DD/MM/YYYY");
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

    render() {
        let checkBoxs = this.state.conesquenceList.map(item => {
            return (
                <div className="project__Permissions--type " key={item.id} >
                    <div id="allSelected" className={"ui checkbox checkBoxGray300  " + (this.state[item.id] ? (this.state[item.id] == true ? "checked" : '') : null)}
                        onClick={e => this.chooseConesquence(item)} >
                        <input name="CheckBox" type="checkbox" id="allPermissionInput" checked={this.state[item.id] ? (this.state[item.id] == true ? "checked" : null) : null}
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
                            <img src={Recycle} alt="delete" onClick={e => this.deleteConesquence(props.original.id)} />
                        )
                    }, width: 30
                },
                {
                    Header: Resources.numberAbb[currentLanguage],
                    accessor: 'id',
                    show: false,
                }, {
                    Header: "riskId",
                    accessor: 'riskId',
                    show: false,
                }, {
                    Header: 'conesquenceId',
                    accessor: 'conesquenceId',
                    show: false,
                }, {
                    Header: Resources.conesquenceName[currentLanguage],
                    accessor: 'consequenceName'
                }, {
                    Header: Resources.comment[currentLanguage],
                    accessor: 'comment',
                    Cell: this.renderEditable
                }, {
                    Header: Resources.addedDate[currentLanguage],
                    accessor: 'addedDate'
                }
            ]}
            defaultPageSize={5}
            className="-striped -highlight"
        />
        return (
            <div className="mainContainer">
                <div className="doc-pre-cycle letterFullWidth">
                    <div className="document-fields">
                        <header style={{ paddingTop: '0' }}>
                            <h2 className="zero">{Resources['riskConesquence'][currentLanguage]}</h2>
                        </header>
                        <div className="dropWrapper">
                            {this.state.isLoading == true ? <LoadingSection /> :
                                <React.Fragment>
                                    {checkBoxs}
                                    <div className="doc-pre-cycle letterFullWidth">
                                        <div className='document-fields'>
                                            {table}
                                        </div>
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default RiskConesquence
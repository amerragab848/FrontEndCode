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
                    this.setState({isLoading:true})
                    Api.post('EditConesquence',conesquenceItems[cellInfo.index]).then(()=>{
                        this.setState({ conesquenceItems ,isLoading:false}); 
                    })
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.conesquenceItems[cellInfo.index][cellInfo.column.id]
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
                let  conesquenceItem=result;
                conesquenceItem.addedDate=moment(conesquenceItem).format("DD/MM/YYYY");
                conesquenceItems.push(conesquenceItem);
                this.setState({ conesquenceItems, isLoading: false })
            })
            this.setState({ [item.id]: true });
        }
    }

    deleteConesquence = (id, e) => {
        this.setState({ isLoading: true })
        Api.post('DeleteConesquence?id=' + id).then(result => {
            toast.success(Resources["operationSuccess"][currentLanguage]);
            let consequencesItems = this.state.conesquenceItems.filter(element => element.id != id);
            this.setState({ isLoading: false, consequencesItems }) 
        }).catch(() => {
            toast.success(Resources["operationCanceled"][currentLanguage]);

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
                    accessor: 'riskId' ,
                     show: false,
                }, {
                    Header: 'conesquenceId',  
                    accessor: 'conesquenceId' ,
                    show: false,
                },  {
                    Header:  Resources.conesquenceName[currentLanguage],
                    accessor: 'consequenceName'
                }, {
                    Header:  Resources.comment[currentLanguage],
                    accessor: 'comment',
                    Cell: this.renderEditable
                }, {
                    Header:  Resources.addedDate[currentLanguage],
                    accessor: 'addedDate' 
                }
            ]  }
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
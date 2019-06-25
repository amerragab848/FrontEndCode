import React, { Component } from "react";
import Recycle from '../../Styles/images/attacheRecycle.png'
import ReactTable from "react-table";
import 'react-table/react-table.css'
import Dropdown from "../OptionsPanels/DropdownMelcous";
import api from "../../api";
import resources from '../../resources.json';
 
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

export default class DocumentEmailNotification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading:false,
            DocumentData: [],
            ChooseOk: false,
            TableData: [],
            SelectedDoc: ''
        }

    }
    componentDidMount = () => {
        api.get('GetAccountsDocTypeForDrop').then(result => {
            let TempData = []
            result.forEach(element => {
                TempData.push({ label: element.docType, value: element.id })
            });
            this.setState({ DocumentData: TempData })
        })
        api.get('GetAccountsEmailAlert').then(result => {
            this.setState({ TableData: result })
        })
    }
    DocumentAlertChange = (item) => {
        this.setState({ ChooseOk: true, SelectedDoc: item })
    }
    addDoc = (item) => {
        let url = 'AddAccountsEmailAlert?docTypeId=' + this.state.SelectedDoc.value
        this.setState({isLoading:true})
        api.post(url).then(result => {
            this.setState({ TableData: result, SelectedDoc: '', ChooseOk: false ,isLoading:false})
        })
    }
    deleteDoc = (id) => {
        let url = 'DeleteAccountDocType?id=' + id
        api.post(url).then(res => {
            api.get('GetAccountsEmailAlert').then(result => {
                this.setState({ TableData: result })
            })
        }
        )
    }
    render() {
        const columns = [
            {
                Cell: props => {
                    return (
                        <a onClick={e => this.deleteDoc(props.original.id, e)} href="#">
                            <img className="deleteImg" src={Recycle} alt="Del" />
                        </a>
                    )
                }, width: 30
            }, {
                Header: resources['docType'][currentLanguage],
                accessor: 'docTypeName',
                sortabel: true,
                filterable: true,
                //width: 150, show: true
            }, {
                Header: '',
                accessor: 'id',
                sortabel: true,
                filterable: true,
                show: false
            }
        ]

        return (
            <div className="mainContainer main__fulldash--container white-bg">
                <Dropdown title="docAlerts" data={this.state.DocumentData} handleChange={this.DocumentAlertChange}
                    index='DocumentAlert' name="DocumentAlert" selectedValue={this.state.SelectedDoc} />

                <div className="fullWidthWrapper">
                    {this.state.isLoading === false ? (
                        <button className={this.state.ChooseOk ? "primaryBtn-1 btn smallBtn" : "primaryBtn-1 ui disabled button"}
                            onClick={this.addDoc} disabled={this.state.ChooseOk ? '' : 'disabled'}>{resources['save'][currentLanguage]}</button>
                    ) :
                        (
                            <button className="primaryBtn-1 btn mediumBtn disabled" disabled="disabled">
                                <div className="spinner">
                                    <div className="bounce1" />
                                    <div className="bounce2" />
                                    <div className="bounce3" />
                                </div>
                            </button>
                        )}
                </div>


                <ReactTable
                    ref={(r) => {
                        this.selectTable = r;
                    }}
                    data={this.state.TableData}
                    columns={columns}
                    defaultPageSize={10}
                    minRows={2}
                    noDataText={resources['noData'][currentLanguage]}
                />


            </div >
        )
    }
}

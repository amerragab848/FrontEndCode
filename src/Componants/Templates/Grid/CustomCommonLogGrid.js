import React, { Component, Fragment } from 'react';

import GridCustom from 'react-customized-grid';
 
import moment from "moment"; 
import Resources from "../../../resources.json";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
 
export default class CustomGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: this.props.cells,//this.props.cells.filter(x => x.key !== "BtnActions" && x.key !== "actions"),
            rows: this.props.data,
            groupBy: this.props.groupBy != null ? this.props.groupBy : [],
            selectedIndexes: [],
            selectedRows: [],
            selectedRow: [],
            copmleteRows: [],
            expandedRows: {},
            columnsModal: false,
            ColumnsHideShow: [],
            Loading: false,
            filteredRows: this.props.data,
            setFilters: {},
            filters: [],
            ShowModelFilter: false,
            ClearFilter: "",
            isView: false,
            currentData: 0,
            date: new Date(),
            setDate: moment(new Date()).format("DD/MM/YYYY"),
            fieldDate: {},
            isFilter: false
        };
    } 
    
    componentDidMount() {

        let state = {};
        this.props.cells.map((column, index) => {
            if (column.type === "date") {
                state[index + "-column"] = moment().format("DD/MM/YYYY");
            } 
        });

        let ColumnsHideShow = this.props.cells
        for (var i in ColumnsHideShow) {
            ColumnsHideShow[i].hidden = false;
        }

        this.setState({
            ColumnsHideShow
        });

        setTimeout(() => {
            this.setState(state);
        }, 500);
    }; 
    
    static getDerivedStateFromProps(props, current_state) {
        if (current_state.rows !== props.rows && props.isFilter) {
            props.changeValueOfProps();
            return {
                rows: props.rows,
                filteredRows: props.rows
            }
        }
        return null
    };
    
    showFilterMore = () => {
        this.setState({
            ShowModelFilter: true,
            rows: this.props.data
        });
    };
    
    CloseModeFilter = () => {
        var filterArray = Array.from(document.querySelectorAll(".filterModal input"));

        filterArray.map(input => (input.value = ""));

        this.setState({ ShowModelFilter: false });
    };
    
    resetModeFilter = () => {

        var filterArray = Array.from(document.querySelectorAll(".filterModal input"));
        filterArray.map(input => (input.value = ""));

        var filterArrayParent = Array.from(document.querySelectorAll("#resetData input"));
        filterArrayParent.map(input => (input.value = ""));

        let state = this.state;

        this.props.cells.map((column, index) => {
            if (column.type === "date") {
                state[index + "-column"] = moment().format("DD/MM/YYYY");
            }
        });

        this.setState({ rows: this.props.data, setFilters: {}, state });
    };
    
    render() { 
        let RenderPopupShowColumns = this.state.ColumnsHideShow.map((item, index) => {
            return (
                <div className="grid__content" key={item.field}>
                    <div className={'ui checkbox checkBoxGray300 count checked'}>
                        <input name="CheckBox" type="checkbox" id="allPermissionInput" checked={!this.state[item.field]}
                            onChange={(e) => this.handleCheck(item.field)} />
                        <label>{item.name}</label>
                    </div>
                </div>
            )
        })
        return (
            <Fragment> 
                <GridCustom
                    key={this.props.key}
                    cells={this.props.cells}
                    data={this.state.rows}
                    pageSize={this.props.pageSize}
                    actions={this.props.actions}
                    rowActions={this.props.rowActions}
                    rowClick={cell => this.props.rowClick(cell)}
                    groups={this.props.groups}
                />

                <div className={this.state.columnsModal ? "grid__column active " : "grid__column "}>
                    <div className="grid__column--container">
                        <button className="closeColumn" onClick={this.closeModalColumn}>X</button>
                        <div className="grid__column--title">
                            <h2>{Resources.gridColumns[currentLanguage]}</h2>
                        </div>
                        <div className="grid__column--content">
                            {RenderPopupShowColumns}
                        </div>
                        <div className="grid__column--footer">
                            <button className="btn primaryBtn-1" onClick={this.closeModalColumn}>{Resources.close[currentLanguage]}</button>
                            <button className="btn primaryBtn-2" onClick={this.ResetShowHide}>{Resources.reset[currentLanguage]} </button>
                        </div>
                    </div>
                </div>

            </Fragment>
        );
    }

}

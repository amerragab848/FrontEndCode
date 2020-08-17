import React, { Component, Fragment } from 'react';
import GridCustom from 'react-customized-grid';
import moment from "moment";
import Resources from "../../../resources.json";
import { isEqual } from 'lodash';
import LoadingSection from "../../publicComponants/LoadingSection";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

export default class CustomGrid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: this.props.cells, 
            rows: this.props.data,
            groupBy: this.props.groupBy != null ? this.props.groupBy : [],
            groupsList: this.props.groups || [],

            selectedIndexes: [],
            selectedRows: [],
            selectedRow: [],
            copmleteRows: [],
            expandedRows: {},
            columnsModal: false,
            ColumnsHideShow: [],
            Loading: false,
            GridLoading: false,
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

        this.setState({ GridLoading: true })

        var selectedCols = JSON.parse(localStorage.getItem(this.props.gridKey)) || [];

        var currentGP = [];

        let itemsColumns = this.props.cells;
        if (selectedCols.length === 0) {
            var gridLocalStor = { columnsList: [], groups: [] };
            gridLocalStor.columnsList = JSON.stringify(itemsColumns);
            gridLocalStor.groups = JSON.stringify(currentGP);
            localStorage.setItem(this.props.gridKey, JSON.stringify(gridLocalStor));
        }
        else {
            var parsingList = JSON.parse(selectedCols.columnsList);
            for (var item in parsingList) {
                for (var i in itemsColumns) {
                    if (itemsColumns[i].field === parsingList[item].field) {
                        let status = parsingList[item].hidden
                        itemsColumns[i].hidden = status
                        break;
                    }
                }
            };
            currentGP = JSON.parse(selectedCols.groups);
        }
        this.setState({
            ColumnsHideShow: itemsColumns,
            columns: itemsColumns,
            groups: currentGP,
            groupsList: currentGP,
            GridLoading: false
        });

        setTimeout(() => {
            this.setState(state);
        }, 500);
    };

    static getDerivedStateFromProps(nextProps, state) { 
        if (nextProps.isFilter && isEqual(state.rows, nextProps.data)) {
            return {
                rows: nextProps.rows,
                filteredRows: nextProps.rows,
                GridLoading: true
            }
        }
        return null
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.isFilter && isEqual(prevState.rows, this.props.data)) {
            this.props.changeValueOfProps();
            this.setState({
                GridLoading: false
            });
        }
    }

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

    handleGroupEvent = (groups) => {

        var gridLocalStor = { columnsList: [], groups: [], Filters: [] };

        gridLocalStor.groups = JSON.stringify(groups);
        gridLocalStor.columnsList = JSON.stringify(this.state.columns);

        let newFilterLst = this.state.localStorFiltersList;

        gridLocalStor.Filters = JSON.stringify(newFilterLst);

        localStorage.setItem(this.props.gridKey, JSON.stringify(gridLocalStor));

        this.setState({ groupsList: groups });
    }

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
                {this.state.GridLoading === false ?

                    <GridCustom
                        key={this.props.gridKey}
                        cells={this.props.cells}
                        data={this.state.rows}
                        pageSize={this.props.pageSize}
                        actions={this.props.actions}
                        rowActions={this.props.rowActions}
                        rowClick={cell => this.props.rowClick(cell)}
                        groups={this.state.groupsList}
                        handleGroupUpdate={this.handleGroupEvent}
                        showCheckAll={this.props.showCheckAll}
                    />
                    : <LoadingSection />}


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

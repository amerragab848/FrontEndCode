import React, { Component, Fragment } from "react";
import ReactDataGrid from "react-data-grid";
import { ToolsPanel, Data, Draggable } from "react-data-grid-addons";

import "../../Styles/gridStyle.css";
import "../../Styles/scss/en-us/dataGrid.css";

import { toast } from "react-toastify";
import Resources from "../../resources.json";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const DraggableContainer = Draggable.Container;
const Toolbar = ToolsPanel.AdvancedToolbar;
const GroupedColumnsPanel = ToolsPanel.GroupedColumnsPanel;

const selectors = Data.Selectors;

let arrColumn = ['arrange', 'quantity', 'itemCode'];

class GridSetupWithFilter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: this.props.columns,
            rows: this.props.rows,
            filteredRows: this.props.rows,
            setFilters: [],
            filters: [],
            groupBy: [],
            selectedIndexes: [],
            selectedRows: [],
            selectedRow: [],
            copmleteRows: [],
            expandedRows: {},
            ShowModelFilter: false,
            ClearFilter: ''
        };

        this.groupColumn = this.groupColumn.bind(this);
        this.onRowsSelected = this.onRowsSelected.bind(this);
        this.saveFilter = this.saveFilter.bind(this);
    }

    componentDidMount() {
        this.scrolllll();
    }

    sortRows = (initialRows, sortColumn, sortDirection) => {
        const comparer = (a, b) => {
            if (sortDirection === "ASC") {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else if (sortDirection === "DESC") {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        };

        return sortDirection === "NONE" ? initialRows : [...this.state.rows].sort(comparer);
    }

    getRows = (rows, filters) => {
        return selectors.getRows({ rows, filters });
    }

    getRowsGrouping = (rows, groups) => {
        return Data.Selectors.getRows({ rows, groups });
    }

    groupColumn = columnKey => {
        const columnGroups = this.state.groupBy.slice(0);

        const activeColumn = this.state.columns.find(c => c.key === columnKey);

        const isNotInGroups = columnGroups.find(c => activeColumn.key === c.key) == null;

        if (isNotInGroups) {
            columnGroups.push({ key: activeColumn.key, name: activeColumn.name });
        }
        return columnGroups;
    }

    ungroupColumn = columnKey => {
        let columnGroups = this.state.groupBy
            .slice(0)
            .filter(g =>
                typeof g === "string" ? g !== columnKey : g.key !== columnKey
            );

        return columnGroups;
    }

    onRowsSelected = rows => {
        if (this.props.IsActiv !== undefined) {
            let Id = '';
            Id = rows.map(r => r.row.id);
            this.props.IsActiv(Id)
        }


        if (this.props.onRowsSelected !== undefined) {
            this.props.onRowsSelected(rows)
        }
        let prevRows = this.state.selectedIndexes;
        let prevRowsId = this.state.selectedRows;
        let copmleteRows = this.state.copmleteRows;


        if (this.props.single == true) {
            prevRows = [];
            prevRowsId = [];
            prevRows.push(rows[0].rowIdx);
            prevRowsId.push(rows[0].row.id);
        }
        else if (rows.length > 1) {
            prevRows = [];
            prevRowsId = [];
            prevRows = rows.map(r => r.rowIdx);
            prevRowsId = rows.map(r => r.row.id);
        } else {

            let exist = prevRows.indexOf(rows[0].rowIdx) === -1 ? false : true;
            if (exist === false) {
                if (this.props.selectedCopmleteRow != undefined) {
                    if (rows[0].row.type !== "Distribution List") {
                        prevRows.push(rows[0].rowIdx);
                        prevRowsId.push(rows[0].row.id);
                    }
                    else
                        toast.warn("Can't Send Distrbution Only Work Flow ...")
                }
                else {
                    prevRows.push(rows[0].rowIdx);
                    prevRowsId.push(rows[0].row.id);
                }
            }
        }

        this.setState({
            selectedIndexes: prevRows,
            selectedRows: prevRowsId
        });

        if (this.props.selectedRows != undefined) {
            this.props.selectedRows(this.state.selectedRows);
        }

    }

    onRowsDeselected = rows => {
        if (this.props.IsActiv !== undefined) {
            this.props.UnSelectIsActiv()
        }
        else if (this.props.onRowsDeselected !== undefined) {
            this.props.onRowsDeselected()
        }

        let prevRows = this.state.selectedIndexes;
        let prevRowsId = this.state.selectedRows;

        if (rows.length > 1) {
            prevRows = [];
            prevRowsId = [];
        } else {
            let rowIndexes = rows.map(r => r.rowIdx);
            let currRows = rows.map(r => r.row.id);
            prevRows = this.state.selectedIndexes.filter(
                i => rowIndexes.indexOf(i) === -1
            );
            prevRowsId = this.state.selectedRows.filter(
                i => currRows.indexOf(i) === -1
            );
        }

        this.setState({
            selectedIndexes: prevRows,
            selectedRows: prevRowsId
        });

        if (this.props.DeSelectedRows != undefined) {
            let currentRows = rows.map(r => r.row.id);

            var oldSelectedRows = this.state.selectedRows;

            var index = oldSelectedRows.indexOf(currentRows);

            oldSelectedRows.splice(index, 1);

            this.props.DeSelectedRows(oldSelectedRows);
        }
    }

    onRowExpandToggle({ columnGroupName, name, shouldExpand }) {
        let expandedRows = Object.assign({}, this.state.expandedRows);
        expandedRows[columnGroupName] = Object.assign(
            {},
            expandedRows[columnGroupName]
        );
        expandedRows[columnGroupName][name] = { isExpanded: shouldExpand };
        this.setState({ expandedRows: expandedRows });
    }

    onRowClick = (index, value, column) => {
        if (value) {
            if (this.props.onRowClick != undefined) {
                this.props.onRowClick(value, index, column);
                this.setState({ selectedRow: value })
            }
        }
    }

    clickHandlerDeleteRows = e => {
        this.props.clickHandlerDeleteRows(this.state.selectedRows);
    }

    onCellSelected = ({ rowIdx, idx }) => {
        if (this.props.cellClick)
            this.props.cellClick(rowIdx, idx)
    }

    onselectRowEven = ({ selectedRows }) => {
        if (this.props.onselectRowEven)
            this.props.onselectRowEven(selectedRows)
    }

    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        if (this.props.onGridRowsUpdated != undefined) {
            this.props.onGridRowsUpdated({ fromRow, toRow, updated })
        }
    }

    scrolllll() {
        document.getElementById('top__scroll').addEventListener('scroll', function () {
            document.getElementById('bottom__scroll').querySelector('.react-grid-Canvas').scrollLeft = this.scrollLeft;

        });
        document.getElementById('empty__div--scroll').style.width = document.getElementById('scrollWidthDiv').style.width;
        document.getElementById('bottom__scroll').querySelector('.react-grid-Canvas').addEventListener('scroll', function () {
            if (document.getElementById('top__scroll') != null) {
                document.getElementById('top__scroll').scrollLeft = this.scrollLeft;
            }
        });
    }

    getRowsFilter = (rows, filters) => {
        console.log(rows, filters);
        let rowsList = selectors.getRows({ rows, filters });
        console.log(rows, filters, rowsList);
        this.setState({
            rows: rowsList
        })
    }

    showFilterMore = () => {
        this.setState({
            ShowModelFilter: true
        })
    }

    saveFilter(event, index, name) {
        var filter = {};
        filter.key = event.target.name;
        filter.filterTerm = event.target.value;
        filter.column = {
            rowType: "filter",
            key: event.target.name,
            name: name,
            filterable: true,
            idx: index
        };

        const newFilters = this.state.setFilters;
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }

        let rows = [...this.state.filteredRows]
        this.getRowsFilter(rows, newFilters);
        this.setState({
            setFilters: newFilters
        })
    }

    ClearFilters = () => {
        var filterArray = Array.from(document.querySelectorAll('.filterModal input'));
        filterArray.map(input => input.value = "");
        this.setState({ rows: this.props.rows })
    }

    CloseModeFilter = () => {
        var filterArray = Array.from(document.querySelectorAll('.filterModal input'));
        filterArray.map(input => input.value = "");
        this.setState({ rows: this.props.rows, ShowModelFilter: false })
    }

    render() {

        const { groupBy, rows } = this.state;
        console.log(groupBy);
        const groupedRows = Data.Selectors.getRows({ rows, groupBy });
        const drag = Resources["jqxGridLanguage"][currentLanguage].localizationobj.groupsheaderstring;

        let CustomToolbar = ({
            groupBy,
            onColumnGroupAdded,
            onColumnGroupDeleted
        }) => {
            return (
                <Toolbar >
                    <GroupedColumnsPanel
                        groupBy={groupBy}
                        onColumnGroupAdded={onColumnGroupAdded}
                        onColumnGroupDeleted={onColumnGroupDeleted}
                        noColumnsSelectedMessage={drag}
                    />

                    {this.state.selectedRows.length > 0 && this.props.showToolBar != false ? (
                        <div className="gridSystemSelected active">
                            <div className="tableselcted-items">
                                <span id="count-checked-checkboxes">{this.state.selectedRows.length}{" "}</span><span>Selected</span>
                            </div>
                            <div className="tableSelctedBTNs">
                                {this.props.addLevel ? null : <button className="defaultBtn btn smallBtn" onClick={this.clickHandlerDeleteRows}>{this.props.NoShowDeletedBar === undefined ? 'DELETE' : 'Currency'}                                </button>}
                                {this.props.assign ? <button className="primaryBtn-1 btn smallBtn" onClick={() => this.props.assignFn()} ><i className="fa fa-retweet"></i></button> : null}
                                {this.props.addLevel ? <button className="primaryBtn-1 btn smallBtn" onClick={() => this.props.addLevel()} ><i className="fa fa-paper-plane"></i></button> : null}

                                {this.props.Panels !== undefined ?
                                    <Fragment>
                                        <button className="primaryBtn-1 btn smallBtn" onClick={() => this.props.TaskGroupFun(this.state.selectedRows)} data-toggle="tooltip" title={Resources['projectTaskGroups'][currentLanguage]} >
                                            <i class="fa fa-users" aria-hidden="true"></i>
                                        </button>

                                        <button className="primaryBtn-1 btn smallBtn" onClick={() => this.props.ProjectTaskFun(this.state.selectedRows)} data-toggle="tooltip" title={Resources['projectTask'][currentLanguage]} >
                                            <i class="fa fa-tasks" aria-hidden="true"></i>
                                        </button>
                                    </Fragment>
                                    : null}
                            </div>
                        </div>
                    ) : null}
                </Toolbar>
            );
        };

        return (
            <Fragment>
                <div className="filter__warrper" style={{ paddingRight: '16px', paddingLeft: '24px' }}>
                    <div className="filter__more" style={{ padding: 0 }}>
                        <span>5 filters applied</span>
                        {this.props.columns.length > 5 ? <button className="filter__more--btn" onClick={this.showFilterMore}>See all</button> : null}
                    </div>

                    <div className="filter__input-wrapper">

                        <form id="signupForm1" method="post" className="proForm" action="" noValidate="noValidate">
                            {this.props.columns.map((column, index) => {
                                let classX = arrColumn.findIndex(x => x == column.key) > -1 ? 'small__input--width ' : 'medium__input--width'
                                return (column.filterable === true && index <= 5 ?
                                    <div className={"form-group linebylineInput " + classX} key={index}>
                                        <label className="control-label" htmlFor={column.key}>{column.name}</label>
                                        <div className="ui input inputDev">
                                            <input autoComplete="off" placeholder={column.name} key={index} type="text"
                                                className="form-control" id={column.key} name={column.key}
                                                onChange={e => this.saveFilter(e, index, column.name)} />
                                        </div>
                                    </div>
                                    : null)
                            })}
                        </form>
                    </div>
                    <div className={this.state.ShowModelFilter ? "filterModal__container active" : "filterModal__container"} >
                        <button className="filter__close" onClick={this.CloseModeFilter}>x</button>
                        <div className="filterModal" id="largeModal"  >
                            <div className="header-filter">
                                <h2 className="zero">Filter results</h2>
                                <span>{groupedRows.length} Results</span>
                                <button className="reset__filter reset__filter--header" onClick={this.ClearFilters}>Reset all</button>
                            </div>
                            <div className="content">
                                <div className="filter__warrper" >
                                    <div className="filter__input-wrapper">
                                        <form id="signupForm1" method="post" className="proForm" action="" noValidate="noValidate">
                                            {this.props.columns.map((column, index) => {
                                                let classX = arrColumn.findIndex(x => x == column.key) > -1 ? 'small__input--width ' : 'medium__input--width'
                                                return (column.filterable === true && column.key !== 'customBtn' ?
                                                    <div className={"form-group linebylineInput " + classX} key={index}>
                                                        <label className="control-label" htmlFor={column.key}>{column.name}</label>
                                                        <div className="ui input inputDev">
                                                            <input autoComplete="off" key={index} id={column.key} placeholder={column.name}
                                                                type="text" className="form-control" name={column.key}
                                                                onChange={e => this.saveFilter(e, index, column.name)} />
                                                        </div>
                                                    </div>
                                                    : null)
                                            })}
                                        </form>

                                    </div>
                                </div>
                            </div>
                            <div className="filter__actions"> 
                                <button className="reset__filter" onClick={this.ClearFilters}>Reset all</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid-container">
                    <div id="top__scroll">
                        <div id="empty__div--scroll">
                        </div>
                    </div>
                    <div id="bottom__scroll">
                        <DraggableContainer>
                            <ReactDataGrid
                                rowKey="id"
                                minHeight={groupedRows != undefined ? (groupedRows.length < 5 ? 350 : (this.props.minHeight !== undefined ? this.props.minHeight : 750)) : 1}
                                height={this.props.minHeight !== undefined ? this.props.minHeight : 750}
                                columns={this.state.columns}
                                rowGetter={i => groupedRows[i] != null ? groupedRows[i] : ''}
                                rowsCount={groupedRows != undefined ? groupedRows.length : 1}
                                enableCellSelect={true}
                                onGridRowsUpdated={this.onGridRowsUpdated}
                                onCellSelected={this.onCellSelected}
                                onColumnResize={(idx, width, event) => {
                                    this.scrolllll();
                                }}
                                onGridSort={(sortColumn, sortDirection) =>
                                    this.setState({
                                        rows: this.sortRows(groupedRows, sortColumn, sortDirection)
                                    })
                                }
                                enableDragAndDrop={true}
                                toolbar={
                                    <CustomToolbar
                                        groupBy={this.state.groupBy}
                                        onColumnGroupAdded={columnKey =>
                                            this.setState({ groupBy: this.groupColumn(columnKey) })
                                        }
                                        onColumnGroupDeleted={columnKey =>
                                            this.setState({ groupBy: this.ungroupColumn(columnKey) })
                                        }
                                    />
                                }

                                rowSelection={{
                                    showCheckbox: this.props.showCheckbox,
                                    defaultChecked: false,
                                    enableShiftSelect: true,
                                    onRowsSelected: this.onRowsSelected,
                                    onRowsDeselected: this.onRowsDeselected,
                                    enableRowSelect: 'single',
                                    selectBy: {
                                        indexes: this.state.selectedIndexes
                                    }
                                }}

                                onRowClick={(index, value, column) => this.onRowClick(index, value, column)}
                                getCellActions={this.props.getCellActions}
                            />
                        </DraggableContainer >
                    </div>
                </div>
            </Fragment >
        );
    }
}
export default GridSetupWithFilter;;

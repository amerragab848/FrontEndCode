
import React, { Component, Fragment } from "react";

import ReactDataGrid from "react-data-grid";
import {ToolsPanel, Data, Draggable } from "react-data-grid-addons";

import "../../Styles/gridStyle.css";
import "../../Styles/scss/en-us/dataGrid.css";
import { toast } from "react-toastify";
import Resources from "../../resources.json";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const DraggableContainer = Draggable.Container;
const ToolbarGroup = ToolsPanel.AdvancedToolbar;
const GroupedColumnsPanel = ToolsPanel.GroupedColumnsPanel;

const selectors = Data.Selectors;
 
class GridSetupWithFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: this.props.columns,
            rows: this.props.rows,
            setFilters: [],
            filters: [],
            setGroupBy: this.props.rows,
            groupBy: [],
            selectedIndexes: [],
            selectedRows: [],
            selectedRow: [],
            copmleteRows: [],
            expandedRows: {},
            filteredRows: this.props.rows,
            enableFilter: true
        };

        this.groupColumn = this.groupColumn.bind(this);
        this.onRowsSelected = this.onRowsSelected.bind(this);
    }

    componentWillMount = () => { };

    componentDidMount() {
        this.scrolllll();
    }

    onHeaderDrop = (source, target) => {
        const stateCopy = Object.assign({}, this.state);

        const columnSourceIndex = this.state.columns.findIndex(
            i => i.key === source
        );
        const columnTargetIndex = this.state.columns.findIndex(
            i => i.key === target
        );

        stateCopy.columns.splice(
            columnTargetIndex,
            0,
            stateCopy.columns.splice(columnSourceIndex, 1)[0]
        );

        const emptyColumns = Object.assign({}, this.state, { columns: [] });
        this.setState(emptyColumns);

        const reorderedColumns = Object.assign({}, this.state, {
            columns: stateCopy.columns
        });
        this.setState(reorderedColumns);
        //console.log(reorderedColumns);
    };

    sortRows = (initialRows, sortColumn, sortDirection) => {
        const comparer = (a, b) => {
            if (sortDirection === "ASC") {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else if (sortDirection === "DESC") {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        };

        return sortDirection === "NONE"
            ? initialRows
            : [...this.state.rows].sort(comparer);
    };

    getValidFilterValues = (rows, columnId) => {
        rows.map(r => r[columnId])
            .filter((item, i, a) => {
                return i === a.indexOf(item);
            });
        return rows
            .map(r => r[columnId])
            .filter((item, i, a) => {
                return i === a.indexOf(item);
            });
    };

    getRows = (rows, filters) => {
        return selectors.getRows({ rows, filters });
    };

    getRowsFilter = (rows, filters) => {
        let rowsList = selectors.getRows({ rows, filters });
        this.setState({
            filteredRows: rowsList
        })
        return rowsList;
    }

    getRowsGrouping = (rows, groups) => {
        return Data.Selectors.getRows({ rows, groups });
    }

    groupColumn = columnKey => {
        const columnGroups = this.state.groupBy.slice(0);

        const activeColumn = this.state.columns.find(c => c.key === columnKey);

        const isNotInGroups =
            columnGroups.find(c => activeColumn.key === c.key) == null;

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

    };

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
    };

    rowGroupRenderer = () => {
     
    };

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
    };

    clickHandlerDeleteRows = e => {
        this.props.clickHandlerDeleteRows(this.state.selectedRows);
    };

    onCellSelected = ({ rowIdx, idx }) => {
        if (this.props.cellClick)
            this.props.cellClick(rowIdx, idx)
    };

    onselectRowEven = ({ selectedRows }) => {
        if (this.props.onselectRowEven)
            this.props.onselectRowEven(selectedRows)
    };

    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        if (this.props.onGridRowsUpdated != undefined) {
            this.props.onGridRowsUpdated({ fromRow, toRow, updated })
        }
    };

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

    handleFilterChange = (filter) => {
        const newFilters = this.state.setFilters;
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        let rows = [...this.state.rows]
        this.getRowsFilter(rows, newFilters);
        return newFilters
    }
 
    render() { 
        const drag = Resources["jqxGridLanguage"][currentLanguage].localizationobj.groupsheaderstring;

         const CustomToolbar = ({
             groupBy,
             onColumnGroupAdded,
             onColumnGroupDeleted  
         }) => {
             return (
                 <ToolbarGroup >
                     <GroupedColumnsPanel  
                         groupBy={groupBy}
                         onColumnGroupAdded={onColumnGroupAdded}
                         onColumnGroupDeleted={onColumnGroupDeleted} 
                         noColumnsSelectedMessage={drag}
                     />
                      
                      {this.state.selectedRows.length > 0 && this.props.showToolBar!=false ? (
                         <div className="gridSystemSelected active">
                             <div className="tableselcted-items">
                                 <span id="count-checked-checkboxes">{this.state.selectedRows.length}{" "}</span><span>Selected</span>
                             </div>
                             <div className="tableSelctedBTNs">
                                 {this.props.addLevel ? null : <button
                                     className="defaultBtn btn smallBtn"
                                     onClick={this.clickHandlerDeleteRows}
                                 >{this.props.NoShowDeletedBar === undefined ?
                                     'DELETE' : 'Currency'}
                                 </button>}
                                 {this.props.assign ? <button
                                     className="primaryBtn-1 btn smallBtn"
                                     onClick={() => this.props.assignFn()} >
                                     <i className="fa fa-retweet"></i>
                                 </button> : null}

                                 {this.props.addLevel ? <button
                                     className="primaryBtn-1 btn smallBtn"
                                     onClick={() => this.props.addLevel()} >
                                     <i className="fa fa-paper-plane"></i>
                                 </button> : null}

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
                 </ToolbarGroup>
             );
         };
        return (
            <div className="grid-container">
                <div id="top__scroll">
                    <div id="empty__div--scroll">
                    </div>
                </div>
                <div id="bottom__scroll">
              <DraggableContainer> 

                        <ReactDataGrid
                            rowKey="id"
                            minHeight={this.state.filteredRows != undefined ? (this.state.filteredRows.length < 5 ? 350 : (this.props.minHeight !== undefined ? this.props.minHeight : 750)) : 1}
                            height={this.props.minHeight !== undefined ? this.props.minHeight : 750}
                            columns={this.state.columns}

                            rowGetter={i => this.state.filteredRows[i] != null ? this.state.filteredRows[i] : ''}
                            rowsCount={this.state.filteredRows != undefined ? this.state.filteredRows.length : 1}


                            enableCellSelect={true}
                            onGridRowsUpdated={this.onGridRowsUpdated}
                            onCellSelected={this.onCellSelected}
                            onColumnResize={(idx, width, event) => {
                                this.scrolllll(); 
                            }}
                            onGridSort={(sortColumn, sortDirection) =>
                                this.setState({
                                    rows: this.sortRows(this.state.filteredRows, sortColumn, sortDirection)
                                })
                            }
                            enableDragAndDrop={true}
                            toolbar=
                                //   <Toolbar enableFilter={true} />
                              {
                                 <CustomToolbar
 
                                     groupBy={this.state.groupBy}
                                     onColumnGroupAdded={columnKey =>
                                         this.setState({ groupBy: this.groupColumn(columnKey) })
                                     }
                                     onColumnGroupDeleted={columnKey =>
                                         this.setState({ groupBy: this.ungroupColumn(columnKey) })
                                     } 
                                />}
                            
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

                            onAddFilter={filter => this.setState({ setFilters: this.handleFilterChange(filter) })}

                            onClearFilters={() => this.setState({ setFilters: [] })}

                            getCellActions={this.props.getCellActions}
                        />
                   </DraggableContainer > 
                </div>
            </div>
        );
    }
}
export default GridSetupWithFilter;;

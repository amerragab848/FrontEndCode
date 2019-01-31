import React, { useState,Component } from "react"; 
//import "../../Styles/css/semantic.min.css";
import ReactDataGrid from "react-data-grid";    
import { ToolsPanel, Data, Filters, Draggable } from "react-data-grid-addons";
import "../../Styles/gridStyle.css";

const DraggableContainer = Draggable.Container;
const Toolbar = ToolsPanel.AdvancedToolbar;
const GroupedColumnsPanel = ToolsPanel.GroupedColumnsPanel;
 
const selectors = Data.Selectors;
const {
  NumericFilter,
  AutoCompleteFilter,
  MultiSelectFilter,
  SingleSelectFilter
} = Filters;

class GridSetup extends Component {

   constructor(props) {

          super(props) 

          this.state={
            columns: this.props.columns,
            rows: this.props.rows,
            setFilters: {},
            filters: {},
            setGroupBy: this.props.rows,
            groupBy: [],
            selectedIndexes:[],
            selectedRows:[],
            expandedRows: {},
          }; 

     this.groupColumn =this.groupColumn.bind(this); 
  };

  componentWillMount = () => { 
    
    // this.setState({
    //   columns: this.props.columns,
    //   rows: this.props.rows 
    // })
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
    console.log(reorderedColumns);
  };

  sortRows = (initialRows, sortColumn, sortDirection) =>  {
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
 
    return sortDirection === "NONE" ? initialRows : [...this.state.rows].sort(comparer);
  };

  handleFilterChange = (filter )=> filters =>  {
    
    const newFilters = { ...filters };
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
     console.log(newFilters);
    return newFilters;
  };

  getValidFilterValues=(rows, columnId) =>  {

      console.log('getValidFilterValues');
      console.log(columnId);

      console.log(rows);
     let ar= rows
      .map(r => r[columnId])
      .filter((item, i, a) => {
        return i === a.indexOf(item);
      });
      console.log(ar);
    return rows
      .map(r => r[columnId])
      .filter((item, i, a) => {
        return i === a.indexOf(item);
      });
  };

  getRows = (rows, filters) => {
    return selectors.getRows({ rows, filters });
  }

  getRowsGrouping = (rows, groups) => {  
    return Data.Selectors.getRows({ rows, groups }); 
  }
 
  groupColumn = (columnKey)=> {
     
    console.log(columnKey);
 
    const columnGroups = this.state.groupBy.slice(0);
 
    const activeColumn = this.state.columns.find(c => c.key === columnKey);

    const isNotInGroups =columnGroups.find(c => activeColumn.key === c.name) == null;
    
    if (isNotInGroups) {
      columnGroups.push({ key: activeColumn.key, name: activeColumn.name });
    }
     console.log(columnGroups);
    return columnGroups;
  };

  ungroupColumn = (columnKey) => groupBy => {
    return groupBy.filter(g =>
      typeof g === "string" ? g !== columnKey : g.key !== columnKey
    );
  };

  onRowsSelected = rows => { 
      let prevRows=this.state.selectedIndexes; 
      let prevRowsId=this.state.selectedRows; 

       if(rows.length > 1){
          prevRows=[];
          prevRowsId=[];
          prevRows=  rows.map(r =>r.rowIdx);
          prevRowsId=  rows.map(r =>r.row.id);
       }
       else { 
          let exist=prevRows.indexOf(rows[0].rowIdx) === -1 ? false : true;
          if (exist===false) {
              prevRows.push(rows[0].rowIdx)
              prevRowsId.push(rows[0].row.id)
          }  
      }

      this.setState({
        selectedIndexes: prevRows,
        selectedRows: prevRowsId
      }); 
  };

  onRowsDeselected = rows => {
     let prevRows=this.state.selectedIndexes; 
     let prevRowsId=this.state.selectedRows; 
    
     if(rows.length > 1){ 
            prevRows =[];
            prevRowsId =[];

     } else {
            let rowIndexes = rows.map(r => r.rowIdx);
            let currRows=rows.map(r => r.row.id);
            prevRows= this.state.selectedIndexes.filter( i => rowIndexes.indexOf(i) === -1)
            prevRowsId= this.state.selectedRows.filter( i => currRows.indexOf(i) === -1)
     }

      this.setState({
        selectedIndexes: prevRows,
        selectedRows: prevRowsId,
      });
  };

  onRowExpandToggle({ columnGroupName, name, shouldExpand }) {
      let expandedRows = Object.assign({}, this.state.expandedRows);
      expandedRows[columnGroupName] = Object.assign({}, expandedRows[columnGroupName]);
      expandedRows[columnGroupName][name] = {isExpanded: shouldExpand};
      this.setState({expandedRows: expandedRows});
  }
  onRowClick= (rows,value) => {
     
     console.log('route to letterAddEdit/'+value.id);
  }
  render() {    
      const { rows,groupBy} = this.state;
      const filteredRows = this.getRows(this.state.rows, this.state.filters);
      
      const groupedRows = Data.Selectors.getRows({ rows, groupBy });

      const CustomToolbar = ({ groupBy,onColumnGroupAdded,onColumnGroupDeleted }) => {
          return (
            <Toolbar>
              <GroupedColumnsPanel
                groupBy={groupBy}
                onColumnGroupAdded={onColumnGroupAdded}
                onColumnGroupDeleted={onColumnGroupDeleted}
              />
              {
               this.state.selectedRows.length > 0 ? 
               (
                <div className="gridSystemSelected active">
                    <div className="tableselcted-items">
                        <span id="count-checked-checkboxes">1</span>
                        <span>Selected</span>
                    </div>
                    <div className="tableSelctedBTNs">
                        <button className="defaultBtn btn smallBtn">DELETE</button> 
                       
                    </div>
                </div>
                ) 
               : 
               null 
              }
            </Toolbar>

          );
        };

       return ( 
          <DraggableContainer > 
              <ReactDataGrid
                rowKey="id"
                minHeight={800}
                columns={this.state.columns}
                rowGetter={i => groupedRows[i]} 
                rowsCount={groupedRows.length} 
                enableCellSelect={false}
                onRowExpandToggle={this.onRowExpandToggle.bind(this)}
                onColumnResize={( idx, width) => 
                  console.log(`Column ${idx} has been resized to ${width}`)
                }

                onGridSort={(sortColumn, sortDirection) =>  
                   this.setState({ rows: this.sortRows(this.state.rows, sortColumn, sortDirection) })
                }
                 
                enableDragAndDrop={true}
                toolbar={
                <CustomToolbar
                      groupBy={ this.state.groupBy } 
                      onColumnGroupAdded={columnKey => this.setState({ groupBy: this.groupColumn(columnKey)})}
                      onColumnGroupDeleted={(columnKey) => this.setState({ groupBy: this.ungroupColumn(columnKey)})}
                    />
                  }

                rowSelection={{
                            showCheckbox: true,
                            enableShiftSelect: true, 
                            defaultChecked:false,
                            onRowsSelected: this.onRowsSelected,
                            onRowsDeselected: this.onRowsDeselected,
                            selectBy: {
                              indexes: this.state.selectedIndexes
                            }
                          }}
                onRowClick={(index,value) => this.onRowClick(index,value)}
                onAddFilter={filter => this.setState({ setFilters: this.handleFilterChange(filter)}) }
                onClearFilters={() =>  this.setState({ setFilters: {}}) }
                getValidFilterValues={columnKey => this.getValidFilterValues(this.state.rows, columnKey)}
              /> 
          </DraggableContainer>
    );
  }
  
}
export default GridSetup;
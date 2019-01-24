import React, { useState,Component } from "react"; 
import ReactDataGrid from "react-data-grid";   
    
import { Toolbar, Data, Filters } from "react-data-grid-addons";
const {
  DraggableHeader: { DraggableContainer }
} = require("react-data-grid-addons");

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
            columns:this.props.columns,
            rows: this.props.rows,
            setFilters: {},
            filters: {}
          }; 
     // this.sortRows =this.sortRows.bind(this); 
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
    console.log(filter);

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

  getRows=(rows, filters)=> {
    return selectors.getRows({ rows, filters });
  }

  render() {  

      //const [filters, setFilters] = useState({});
      const filteredRows = this.getRows(this.state.rows, this.state.filters);

       return ( 
          <DraggableContainer onHeaderDrop={this.onHeaderDrop}>
              <ReactDataGrid
                columns={this.state.columns}
                rowGetter={i => this.state.rows[i]}
                rowsCount={this.state.rows.length} 
                enableCellSelect={false}
                onColumnResize={(idx, width) =>
                  console.log(`Column ${idx} has been resized to ${width}`)
                }

                onGridSort={(sortColumn, sortDirection) =>  
                   this.setState({ rows:  this.sortRows(this.state.rows, sortColumn, sortDirection) })
                }
                toolbar={<Toolbar enableFilter={true} />}
                onAddFilter={filter => this.setState({ setFilters: this.handleFilterChange(filter)}) }
                onClearFilters={() =>  this.setState({ setFilters: {}}) }
                getValidFilterValues={columnKey => this.getValidFilterValues(this.state.rows, columnKey)}
              />
          </DraggableContainer>
    );
  }
  
}
export default GridSetup;
import React, { Component, Fragment } from "react";
import ReactDataGrid from "react-data-grid";
import { ToolsPanel, Data, Draggable } from "react-data-grid-addons";
import Calendar from "react-calendar";
import "../../Styles/gridStyle.css";
import "../../Styles/scss/en-us/dataGrid.css";
import { toast } from "react-toastify";
import Resources from "../../resources.json";
import moment from "moment";
const _ = require("lodash");

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const DraggableContainer = Draggable.Container;
const Toolbar = ToolsPanel.AdvancedToolbar;
const GroupedColumnsPanel = ToolsPanel.GroupedColumnsPanel;
const selectors = Data.Selectors;

let arrColumn = ["arrange", "quantity", "itemCode"];

class GridSetupWithFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [],
      rows: this.props.rows,
      filteredRows: this.props.rows,
      //setFilters: [],
      setFilters: {},
      filters: [],
      groupBy: [],
      selectedIndexes: [],
      selectedRows: [],
      selectedRow: [],
      copmleteRows: [],
      expandedRows: {},
      ShowModelFilter: false,
      ClearFilter: "",
      isView: false,
      currentData: 0,
      date: new Date(),
      setDate: moment(new Date()).format("DD/MM/YYYY"),
      fieldDate: {}
    };

    this.groupColumn = this.groupColumn.bind(this);
    this.onRowsSelected = this.onRowsSelected.bind(this);
    this.saveFilter = this.saveFilter.bind(this);
   // this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentDidMount() {
    this.scrolllll();
  }

  componentWillMount() {
    let state = {};

    this.props.columns.map((column, index) => {
      if (column.type === "date") {
        state[index + "-column"] = moment().format("DD/MM/YYYY");
      }
    });

    this.setState({
      columns: this.props.columns
    });

    setTimeout(() => {
      this.setState(state);
    }, 500);
  }

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

  getRows = (rows, filters) => {
    return selectors.getRows({ rows, filters });
  };

  getRowsGrouping = (rows, groups) => {
    return Data.Selectors.getRows({ rows, groups });
  };

  groupColumn = columnKey => {
    const columnGroups = this.state.groupBy.slice(0);

    const activeColumn = this.state.columns.find(c => c.key === columnKey);

    const isNotInGroups =
      columnGroups.find(c => activeColumn.key === c.key) == null;

    if (isNotInGroups) {
      columnGroups.push({ key: activeColumn.key, name: activeColumn.name });
    }
    return columnGroups;
  };

  ungroupColumn = columnKey => {
    let columnGroups = this.state.groupBy.slice(0).filter(g =>
        typeof g === "string" ? g !== columnKey : g.key !== columnKey
      );

    return columnGroups;
  };

  onRowsSelected = rows => {
    if (this.props.IsActiv !== undefined) {
      let Id = "";
      Id = rows.map(r => r.row.id);
      this.props.IsActiv(Id);
    }

    if (this.props.onRowsSelected !== undefined) {
      this.props.onRowsSelected(rows);
    }
    let prevRows = this.state.selectedIndexes;
    let prevRowsId = this.state.selectedRows;

    if (this.props.single === true) {
      prevRows = [];
      prevRowsId = [];
      prevRows.push(rows[0].rowIdx);
      prevRowsId.push(rows[0].row.id);
    } else if (rows.length > 1) {
      prevRows = [];
      prevRowsId = [];
      prevRows = rows.map(r => r.rowIdx);
      prevRowsId = rows.map(r => r.row.id);
    } else {
      let exist = prevRows.indexOf(rows[0].rowIdx) === -1 ? false : true;
      if (exist === false) {
        if (this.props.selectedCopmleteRow !== undefined) {
          if (rows[0].row.type !== "Distribution List") {
            prevRows.push(rows[0].rowIdx);
            prevRowsId.push(rows[0].row.id);
          } else toast.warn("Can't Send Distrbution Only Work Flow ...");
        } else {
          prevRows.push(rows[0].rowIdx);
          prevRowsId.push(rows[0].row.id);
        }
      }
    }

    this.setState({
      selectedIndexes: prevRows,
      selectedRows: prevRowsId
    });

    if (this.props.selectedRows !== undefined) {
      this.props.selectedRows(this.state.selectedRows);
    }
  };

  onRowsDeselected = rows => {
    if (this.props.IsActiv !== undefined) {
      this.props.UnSelectIsActiv();
    } else if (this.props.onRowsDeselected !== undefined) {
      this.props.onRowsDeselected();
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

    if (this.props.DeSelectedRows !== undefined) {
      let currentRows = rows.map(r => r.row.id);

      var oldSelectedRows = this.state.selectedRows;

      var index = oldSelectedRows.indexOf(currentRows);

      oldSelectedRows.splice(index, 1);

      this.props.DeSelectedRows(oldSelectedRows);
    }
  };

  onRowExpandToggle({ columnGroupName, name, shouldExpand }) {
    let expandedRows = Object.assign({}, this.state.expandedRows);
    expandedRows[columnGroupName] = Object.assign({},expandedRows[columnGroupName]);
    expandedRows[columnGroupName][name] = { isExpanded: shouldExpand };
    this.setState({ expandedRows: expandedRows });
  }

  onRowClick = (index, value, column) => {
    if (value) {
      if (this.props.onRowClick !== undefined) {
        this.props.onRowClick(value, index, column);
        this.setState({ selectedRow: value });
      }
    }
  };

  clickHandlerDeleteRows = e => {
    this.props.clickHandlerDeleteRows(this.state.selectedRows);
  };

  onCellSelected = ({ rowIdx, idx }) => {
    if (this.props.cellClick) this.props.cellClick(rowIdx, idx);
  };

  onselectRowEven = ({ selectedRows }) => {
    if (this.props.onselectRowEven) this.props.onselectRowEven(selectedRows);
  };

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    if (this.props.onGridRowsUpdated !== undefined) {
      this.props.onGridRowsUpdated({ fromRow, toRow, updated });
    }
  };

  scrolllll() {
    document.getElementById("top__scroll").addEventListener("scroll", function() {
        document.getElementById("bottom__scroll").querySelector(".react-grid-Canvas").scrollLeft = this.scrollLeft;
      });
    document.getElementById("empty__div--scroll").style.width = document.getElementById("scrollWidthDiv").style.width;
    document.getElementById("bottom__scroll").querySelector(".react-grid-Canvas").addEventListener("scroll", function() {
        if (document.getElementById("top__scroll") !== null) {
          document.getElementById("top__scroll").scrollLeft = this.scrollLeft;
        }
      });
  }

  getRowsFilter = (rows, filters) => {
    console.log(rows, filters);

    let rowsList = []; //selectors.getRows({ rows, filters });
    Object.keys(filters).forEach(key =>
      console.log(`key=${key} value=${filters[key]}`)
    );
    let matched = 0;
    rows.forEach(row => {
      matched = 0;
      Object.keys(filters).forEach(key => {
        let isValue = row[`${key}`];
      
        if(isValue != ""){
      
          if (`${filters[key]}`.includes("|")) {
          let searchDate = `${filters[key]}`.split("|"); 

          let date = moment(row[`${key}`]).format("DD/MM/YYYY");
          let startDate = searchDate[0];
          let finishDate = searchDate[1];
          
          if (date >=  startDate && date <=finishDate)
          {
            matched++; 
          }
        } else if (row[`${key}`].includes(`${filters[key]}`)) {
          matched ++; 
        } else { 
          matched = 0;
        }
    }
      });
      if (matched > 0) rowsList.push(row);
    });

    this.setState({
      rows: rowsList
    });
  };

  showFilterMore = () => {
    this.setState({
      ShowModelFilter: true
    });
  };

  saveFilter(event, index, name, type, key) {
    var filter = {};
    filter.key = type === "date" ? key : event.target.name;
    //filter.filterTerm = type ==="date"  ? event.split('|') : event.target.value;
    filter.filterTerm = "";
    filter.type = type;
    filter.column = {
      rowType: "filter",
      key: type === "date" ? key : event.target.name,
      name: name,
      filterable: true,
      idx: index
    };

    //const newFilters = this.state.setFilters;
    const newFilters = this.state.setFilters;

    if (type === "date") {
      newFilters[filter.column.key] = typeof(event) === "object" ? "" : event;
    }
    else if (event.target.value != "") {
      newFilters[filter.column.key] = event.target.value;
    } else {
      delete newFilters[filter.column.key];
    }

    let rows = [...this.state.filteredRows];

    this.getRowsFilter(rows, newFilters);

    this.setState({
      setFilters: newFilters
    });
  }

  ClearFilters = () => {
    var filterArray = Array.from(
      document.querySelectorAll(".filterModal input")
    );
    filterArray.map(input => (input.value = ""));
    this.setState({ rows: this.props.rows });
  };

  CloseModeFilter = () => {
    var filterArray = Array.from(
      document.querySelectorAll(".filterModal input")
    );
    filterArray.map(input => (input.value = ""));
    this.setState({ rows: this.props.rows, ShowModelFilter: false });
  };

  changeDate(index, type) {
    if (type == "date") {
      document.addEventListener('click', this.handleOutsideClick, false);
      this.setState({ currentData: index });
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
      this.setState({ currentData: 0 });
    }
  }

  onChange = (date, index, columnName, type, key) => {
    
    let margeDate = date != null ? moment(date[0]).format("DD/MM/YYYY") + "|" + moment(date[1]).format("DD/MM/YYYY") : "";

    this.saveFilter(margeDate, index, columnName, type, key);

    let state = this.state;

    state[index + "-column"] = margeDate;

    this.setState({ state, currentData: 0 });
  };

//   handleOutsideClick(e) {
//     if (this.index != null){
//     if (this.index.contains(e.target)) {
//       return;
//     }
//     this.changeDate();
//    }
//   }

  resetDate = () => {
    this.setState({ currentData: 0});
  }

  render() {
    const { groupBy, rows } = this.state;
    console.log(groupBy);
    const groupedRows = Data.Selectors.getRows({ rows, groupBy });
    const drag = Resources["jqxGridLanguage"][currentLanguage].localizationobj.groupsheaderstring;

    let CustomToolbar = ({ groupBy, onColumnGroupAdded, onColumnGroupDeleted }) => {
      return (
        <Toolbar>
          <GroupedColumnsPanel groupBy={groupBy} onColumnGroupAdded={onColumnGroupAdded} onColumnGroupDeleted={onColumnGroupDeleted} noColumnsSelectedMessage={drag}/>
          {this.state.selectedRows.length > 0 &&
          this.props.showToolBar != false ? (
            <div className="gridSystemSelected active">
              <div className="tableselcted-items">
                <span id="count-checked-checkboxes">
                  {this.state.selectedRows.length}
                </span>
                <span>Selected</span>
              </div>
              <div className="tableSelctedBTNs">
                {this.props.addLevel ? null : (
                  <button className="defaultBtn btn smallBtn" onClick={this.clickHandlerDeleteRows}>
                    {this.props.NoShowDeletedBar === undefined ? "DELETE" : "Currency"}
                  </button>
                )}
                {this.props.assign ? (
                  <button className="primaryBtn-1 btn smallBtn" onClick={() => this.props.assignFn()}>
                    <i className="fa fa-retweet" />
                  </button>
                ) : null}
                {this.props.addLevel ? (
                  <button className="primaryBtn-1 btn smallBtn" onClick={() => this.props.addLevel()}>
                    <i className="fa fa-paper-plane" />
                  </button>
                ) : null}
                {this.props.Panels !== undefined ? (
                  <Fragment>
                    <button className="primaryBtn-1 btn smallBtn" onClick={() => this.props.TaskGroupFun(this.state.selectedRows)}
                            data-toggle="tooltip" title={Resources["projectTaskGroups"][currentLanguage]}>
                      <i class="fa fa-users" aria-hidden="true" />
                    </button>

                    <button className="primaryBtn-1 btn smallBtn" onClick={() => this.props.ProjectTaskFun(this.state.selectedRows) }
                            data-toggle="tooltip" title={Resources["projectTask"][currentLanguage]}>
                      <i class="fa fa-tasks" aria-hidden="true" />
                    </button>
                  </Fragment>
                ) : null}
              </div>
            </div>
          ) : null}
        </Toolbar>
      );
    };

    return (
      <Fragment>
        <div className="filter__warrper" style={{ paddingRight: "16px", paddingLeft: "24px" }}>
          <div className="filter__more" style={{ padding: 0 }}>
            <span>5 filters applied</span>
            {this.props.columns.length > 5 ? (
              <button className="filter__more--btn" onClick={this.showFilterMore}>
                See all
              </button>
            ) : null}
          </div>
          <div className="filter__input-wrapper">
            <form id="signupForm1" method="post" className="proForm" action="" noValidate="noValidate">
              {this.state.columns.map((column, index) => {
                let classX = arrColumn.findIndex(x => x == column.key) > -1 ? "small__input--width " : "medium__input--width";
                if (column.type === "date") {
                  return column.filterable === true && index <= 5 ? (
                    <div className={"form-group linebylineInput " + classX} key={index}>
                      <label className="control-label" htmlFor={column.key}>
                        {column.name}
                      </label>
                      <div className="ui input inputDev" style={{ position: "relative", display: "inline-block" }} ref={node => { this.node = node;}}>
                        <input type="text" autoComplete="off" key={index} placeholder={column.name}
                               onChange={e => this.saveFilter(e, index, column.name, column.type)} value={this.state[index + "-column"]}
                               //onBlur={this.handeDateChange}
                               onClick={() => this.changeDate(index, column.type)}/>
                        {this.state.currentData === index &&
                        this.state.currentData != 0 ? (
                            <div className="viewCalender" tabIndex={0} onMouseLeave={this.resetDate}  ref={index => { this.index = index;}}>
                             <Calendar onChange={date => this.onChange( date, index, column.name, column.type, column.key)} selectRange={true}/> 
                             </div>) : 
                        ("")}
                      </div>
                    </div>
                  ) : null;
                } else {
                  return column.filterable === true && index <= 5 ? (
                    <div className={"form-group linebylineInput " + classX} key={index}>
                      <label className="control-label" htmlFor={column.key}>
                        {column.name}
                      </label>
                      <div className="ui input inputDev">
                        <input autoComplete="off" placeholder={column.name} key={index} type="text" className="form-control"
                               id={column.key} name={column.key} onChange={e => this.saveFilter(e, index, column.name)}/>
                      </div>
                    </div>
                  ) : null;
                }
              })}
            </form>
          </div>
        </div>
        <div className={ this.state.ShowModelFilter ? "filterModal__container active" : "filterModal__container" }>
          <button className="filter__close" onClick={this.CloseModeFilter}>
            x
          </button>
          <div className="filterModal" id="largeModal">
            <div className="header-filter">
              <h2 className="zero">Filter results</h2>
              <span>{groupedRows.length} Results</span>
              <button className="reset__filter reset__filter--header" onClick={this.ClearFilters}>
                Reset all
              </button>
            </div>
            <div className="content">
              <div className="filter__warrper">
                <div className="filter__input-wrapper">
                  <form id="signupForm1" method="post" className="proForm" action="" noValidate="noValidate">
                    {this.props.columns.map((column, index) => {
                      let classX = arrColumn.findIndex(x => x == column.key) > -1 ? "small__input--width " : "medium__input--width";
                      if (column.type === "date") {
                        return column.filterable === true && column.key !== "customBtn" ? (
                          <div className={"form-group linebylineInput " + classX} key={index}>
                            <label className="control-label" htmlFor={column.key}>
                              {column.name}
                            </label>
                            <div className="ui input inputDev" style={{ position: "relative", display: "inline-block"}} ref={node => { this.node = node; }}>
                              <input type="text" autoComplete="off" key={index} placeholder={column.name}
                                     onChange={e => this.saveFilter( e, index, column.name, column.type)}
                                     value={this.state[index + "-column"]} onFocus={() => this.changeDate(index, column.type)}/>
                              {this.state.currentData === index &&
                              this.state.currentData != 0 ? (
                                <div className="viewCalender" tabIndex={0} onMouseLeave={this.resetDate}  ref={index => { this.index = index;}}>
                                  <Calendar onChange={date => this.onChange(date,index,column.name,column.type,column.key)} selectRange={true} />
                                </div>) : ("")}
                            </div>
                          </div>
                        ) : null;
                      } else {
                        return column.filterable === true && column.key !== "customBtn" ? (
                          <div className={"form-group linebylineInput " + classX} key={index}>
                            <label className="control-label" htmlFor={column.key}>
                              {column.name}
                            </label>
                            <div className="ui input inputDev">
                              <input autoComplete="off" key={index} id={column.key} placeholder={column.name} type="text"
                                     className="form-control" name={column.key} onChange={e => this.saveFilter(e, index, column.name)}/>
                            </div>
                          </div>
                        ) : null;
                      }
                    })}
                  </form>
                </div>
              </div>
            </div>
            <div className="filter__actions">
              <button className="reset__filter" onClick={this.ClearFilters}>
                Reset all
              </button>
            </div>
          </div>
        </div>
        <div className="grid-container">
          <div id="top__scroll">
            <div id="empty__div--scroll" />
          </div>
          <div id="bottom__scroll">
            <DraggableContainer>
              <ReactDataGrid rowKey="id" minHeight={ groupedRows != undefined ? groupedRows.length < 5 ? 350 : this.props.minHeight !== undefined ? this.props.minHeight : 750 : 1 }
                height={ this.props.minHeight !== undefined ? this.props.minHeight : 750 } columns={this.state.columns}
                rowGetter={i => (groupedRows[i] != null ? groupedRows[i] : "")} rowsCount={groupedRows != undefined ? groupedRows.length : 1}
                enableCellSelect={true} onGridRowsUpdated={this.onGridRowsUpdated} onCellSelected={this.onCellSelected}
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
                  <CustomToolbar groupBy={this.state.groupBy} onColumnGroupAdded={columnKey => this.setState({ groupBy: this.groupColumn(columnKey) })}
                    onColumnGroupDeleted={columnKey =>
                      this.setState({ groupBy: this.ungroupColumn(columnKey) })
                    }/>
                }
                rowSelection={{
                  showCheckbox: this.props.showCheckbox,
                  defaultChecked: false,
                  enableShiftSelect: true,
                  onRowsSelected: this.onRowsSelected,
                  onRowsDeselected: this.onRowsDeselected,
                  enableRowSelect: "single",
                  selectBy: {
                    indexes: this.state.selectedIndexes
                  }
                }}
                onRowClick={(index, value, column) =>
                  this.onRowClick(index, value, column)
                }
                getCellActions={this.props.getCellActions}
              />
            </DraggableContainer>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default GridSetupWithFilter;

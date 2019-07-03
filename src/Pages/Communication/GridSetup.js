import React, { Component, Fragment } from "react";
import ReactDataGrid from "react-data-grid";
import { ToolsPanel, Data, Draggable } from "react-data-grid-addons";

import "../../Styles/gridStyle.css";
import "../../Styles/scss/en-us/dataGrid.css";
import LoadingSection from "../../Componants/publicComponants/LoadingSection";
import { toast } from "react-toastify";
import Resources from "../../resources.json";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");
const DraggableContainer = Draggable.Container;
const Toolbar = ToolsPanel.AdvancedToolbar;
const GroupedColumnsPanel = ToolsPanel.GroupedColumnsPanel;

const selectors = Data.Selectors;

class GridSetup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.props.columns,
      rows: this.props.rows,
      groupBy: [],
      selectedIndexes: [],
      selectedRows: [],
      selectedRow: [],
      copmleteRows: [],
      expandedRows: {},
      columnsModal: false,
      ColumnsHideShow: [],
      Loading: false
    };

    this.groupColumn = this.groupColumn.bind(this);
    this.onHeaderDrop = this.onHeaderDrop.bind(this);
    this.onRowsSelected = this.onRowsSelected.bind(this);
  }

  componentDidMount() {
    this.scrolllll();
  }

  componentWillMount() {
    let state = {};
    let ColumnsHideShow = this.props.columns
    for (var i in ColumnsHideShow) {
      ColumnsHideShow[i].hidden = false;
    }

    this.setState({
      columns: this.props.columns,
      ColumnsHideShow
    });

    setTimeout(() => {
      this.setState(state);
    }, 500);
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
    let columnGroups = this.state.groupBy
      .slice(0)
      .filter(g =>
        typeof g === "string" ? g !== columnKey : g.key !== columnKey
      );

    return columnGroups;
  };

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

  onRowExpandToggle = ({ columnGroupName, name, shouldExpand }) => {
    this.setState({
      Loading: true
    })

    let expandedRows = Object.assign({}, this.state.expandedRows);
    expandedRows[columnGroupName] = Object.assign({}, expandedRows[columnGroupName]);
    expandedRows[name] = { name: name };
    expandedRows[columnGroupName][name] = { isExpanded: shouldExpand };
    this.setState({
      expandedRows: expandedRows,
      Loading: false
    });
  };

  onRowExpandClick = ({ columnGroupName, name, shouldExpand }) => {
    this.setState({
      Loading: true
    })

    let expandedRows = Object.assign({}, this.state.expandedRows);
    expandedRows[columnGroupName] = Object.assign({}, expandedRows[columnGroupName]);
    expandedRows[name] = { name: name };
    expandedRows[columnGroupName][name] = { isExpanded: shouldExpand };
    this.setState({
      expandedRows: expandedRows,
      Loading: false
    });
  };
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

  onOrderColumn = (source, target) => {
    const stateCopy = Object.assign({}, this.state);
    const columnSourceIndex = this.state.columns.findIndex(i => i.key === source);

    const columnTargetIndex = this.state.columns.findIndex(i => i.key === target);

    stateCopy.columns.splice(columnTargetIndex, 0, stateCopy.columns.splice(columnSourceIndex, 1)[0]);

    const emptyColumns = Object.assign({}, this.state, { columns: [] });
    this.setState(emptyColumns);

    const reorderedColumns = Object.assign({}, this.state, { columns: stateCopy.columns });
    this.setState(reorderedColumns);
  };
  openModalColumn = () => {
    this.setState({ columnsModal: true })
  }

  closeModalColumn = () => {
    this.setState({ columnsModal: false })
  }

  handleCheck = (key) => {
    this.setState({ [key]: !this.state[key], Loading: true })
    let data = this.state.ColumnsHideShow
    for (var i in data) {
      if (data[i].key === key) {
        let status = data[i].hidden === true ? false : true
        data[i].hidden = status
        break;
      }
    }
    setTimeout(() => {
      this.setState({ columns: data.filter(i => i.hidden === false), Loading: false })
    }, 300);

  }

  ResetShowHide = () => {
    this.setState({ Loading: true })
    let ColumnsHideShow = this.props.columns
    for (var i in ColumnsHideShow) {
      ColumnsHideShow[i].hidden = false;
      let key = ColumnsHideShow[i].key
      this.setState({ [key]: false })
    }
    setTimeout(() => {
      this.setState({
        columns: ColumnsHideShow.filter(i => i.hidden === false),
        ColumnsHideShow: ColumnsHideShow.filter(i => i.hidden === false),
        Loading: false, columnsModal: false
      })
    }, 300)
  }

  render() {
    const { rows, groupBy } = this.state;
    const groupedRows = Data.Selectors.getRows({ rows, groupBy });
    const drag = Resources["jqxGridLanguage"][currentLanguage].localizationobj.groupsheaderstring;

    const CustomToolbar = ({
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
            noColumnsSelectedMessage={drag} />
          {this.state.selectedRows.length > 0 ? (
            <Fragment>
              {this.props.NoShowToolBar ? null :
                <div className="gridSystemSelected active">
                  <div className="tableselcted-items">
                    <span id="count-checked-checkboxes">{this.state.selectedRows.length}{" "}</span><span>Selected</span>
                  </div>
                  <div className="tableSelctedBTNs">
                    {this.props.addLevel ? null : <button className="defaultBtn btn smallBtn" onClick={this.clickHandlerDeleteRows}>{this.props.NoShowDeletedBar === undefined ? 'DELETE' : 'Currency'}</button>}
                    {this.props.assign ? <button className="primaryBtn-1 btn smallBtn" onClick={() => this.props.assignFn()} ><i className="fa fa-retweet"></i></button> : null}
                    {this.props.addLevel ? <button className="primaryBtn-1 btn smallBtn" onClick={() => this.props.addLevel()} ><i className="fa fa-paper-plane"></i></button> : null}

                    {this.props.Panels !== undefined ?
                      <Fragment>
                        <button className="primaryBtn-1 btn smallBtn" onClick={() => this.props.TaskGroupFun(this.state.selectedRows)} data-toggle="tooltip" title={Resources['projectTaskGroups'][currentLanguage]} >
                          <i class="fa fa-users" aria-hidden="true"></i>
                        </button>

                        <button className="primaryBtn-1 btn smallBtn" onClick={() => this.props.ProjectTaskFun(this.state.selectedRows)} data-toggle="tooltip" title={Resources['projectTask'][currentLanguage]} >
                          <i className="fa fa-tasks" aria-hidden="true"></i>
                        </button>
                      </Fragment>
                      : null}

                  </div>
                </div>}
            </Fragment>
          ) : null}
        </Toolbar>
      );
    };

    let RenderPopupShowColumns = this.state.ColumnsHideShow.map((item, index) => {
      return (
        <div className="grid__content" key={item.key}>
          <div className={'ui checkbox checkBoxGray300 count checked'}>
            <input name="CheckBox" type="checkbox" id="allPermissionInput" checked={!this.state[item.key]}
              onChange={(e) => this.handleCheck(item.key)} />
            <label>{item.name}</label>
          </div>
        </div>
      )
    })
    return (
      <Fragment>
        <div
          className={this.state.minimizeClick ? "minimizeRelative miniRows" : "minimizeRelative"}>
          <div className="minimizeSpan">
            <div className="V-tableSize"  data-toggle="tooltip" title="Filter Columns" onClick={this.openModalColumn}>
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" fillRule="evenodd" transform="translate(5 5)">
                  <g fill="#CCD2DB" mask="url(#b)">
                    <path id="a" d="M0 1.007C0 .45.45 0 1.008 0h1.225c.556 0 1.008.45 1.008 1.007v11.986C3.24 13.55 2.79 14 2.233 14H1.008C.45 14 0 13.55 0 12.993V1.007zm5.38 0C5.38.45 5.83 0 6.387 0h1.226C8.169 0 8.62.45 8.62 1.007v11.986C8.62 13.55 8.17 14 7.613 14H6.387c-.556 0-1.007-.45-1.007-1.007V1.007zm5.38 0C10.76.45 11.21 0 11.766 0h1.225C13.55 0 14 .45 14 1.007v11.986C14 13.55 13.55 14 12.992 14h-1.225c-.556 0-1.008-.45-1.008-1.007V1.007z" />
                  </g>
                </g>
              </svg>
            </div>
          </div>

          <div className="grid-container">
            <div id="top__scroll">
              <div id="empty__div--scroll">
              </div>
            </div>
            <div id="bottom__scroll">
              {this.state.Loading === false ?
                <DraggableContainer onHeaderDrop={this.onHeaderDrop}>

                  <ReactDataGrid
                    rowKey="id"
                    minHeight={groupedRows != undefined ? (groupedRows.length < 5 ? 350 : (this.props.minHeight !== undefined ? this.props.minHeight : 750)) : 1}
                    height={this.props.minHeight !== undefined ? this.props.minHeight : 750}
                    columns={this.state.columns}

                    rowGetter={i => groupedRows[i] != null ? groupedRows[i] : ''}
                    rowsCount={groupedRows != undefined ? groupedRows.length : 1}

                    //onRowExpandToggle={this.onRowExpandToggle}
                    //expandedRows={this.expandedRows}
                    onRowExpandClick={this.onRowExpandClick}
                    enableCellSelect={true}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    onCellSelected={this.onCellSelected}
                    
                    onColumnResize={(idx, width, event) => {
                      this.scrolllll();
                      //console.log(this.state.columns[idx-1]);
                      // console.log(`Column ${idx} has been resized to ${width}`);
                    }}
                    onGridSort={(sortColumn, sortDirection) =>
                      this.setState({
                        rows: this.sortRows(this.state.rows, sortColumn, sortDirection)
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
                        indexes: this.state.selectedIndexes,
                        keys: { rowKey: 'id', values: this.state.selectedIndexes }
                      }
                    }}

                    onRowClick={(index, value, column) => this.onRowClick(index, value, column)}
                    getCellActions={this.props.getCellActions}
                  />
                </DraggableContainer >
                : <LoadingSection />}
            </div>
          </div>
          <div className={this.state.columnsModal ? "grid__column active " : "grid__column "}>
            <div className="grid__column--container">
              <button className="closeColumn" onClick={this.closeModalColumn}>X</button>

              <div className="grid__column--title">
                <h2>Grid Columns</h2>
              </div>

              <div className="grid__column--content">
                {RenderPopupShowColumns}
              </div>

              <div className="grid__column--footer">
                <button className="btn primaryBtn-1" onClick={this.closeModalColumn}>Close</button>
                <button className="btn primaryBtn-2" onClick={this.ResetShowHide}>Reset</button>
              </div>

            </div>
          </div>
        </div>
      </Fragment>

    );
  }
}
export default GridSetup;

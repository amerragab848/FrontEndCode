import React, { Component, Fragment } from 'react';

import GridCustom from 'react-customized-grid';

import Calendar from "react-calendar";
import { toast } from "react-toastify";
import moment from "moment";
import LoadingSection from "../../../Componants/publicComponants/LoadingSection";
import Resources from "../../../resources.json";
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let arrColumn = ["arrange", "quantity",  "unitPrice"];

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
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.rows !== props.rows && props.isFilter) {
            props.changeValueOfProps();
            return {
                rows: props.rows,
                filteredRows: props.rows
            }
        }
        return null
    }

    resetDate = () => {
        this.setState({ currentData: 0 });
    }

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
        let ColumnsHideShow = this.props.cells
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

    ClearFilters = () => {
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

    saveFilter(event, index, name, type, key) {

        if (this.state.filteredRows.length > 0) {

            this.setState({
                Loading: true
            });

            var filter = {};
            filter.key = type === "date" ? key : event.target.name;

            filter.type = type;
            filter.column = {
                rowType: "filter",
                key: type === "date" ? key : event.target.name,
                name: name,
                filterable: true,
                idx: index
            };

            const newFilters = this.state.setFilters;

            if (type === "date") {
                newFilters[filter.column.key] = typeof (event) === "object" ? "" : event;
            }
            else if (type === "number" || arrColumn.findIndex(x => x == key) !== -1) {
                let value = parseFloat(event.target.value);
                if (!isNaN(value)) {
                    newFilters[filter.column.key] = value;
                } else {
                    delete newFilters[filter.column.key];
                }
            } else if (event.target.value != "") {
                newFilters[filter.column.key] = event.target.value;
            } else {
                delete newFilters[filter.column.key];
            }

            let rows = [...this.state.filteredRows];

            this.getRowsFilter(rows, newFilters);

            this.setState({
                isFilter: false,
                setFilters: newFilters,
                Loading: false
            });
        }
    }

    getRowsFilter = (rows, _filters) => {

        if (this.state.filteredRows.length > 0) {

            let rowsList = [];

            let matched = 0;

            let filters = Object.keys(_filters).reduce((n, k) => (n[k] = _filters[k], n), {});

            if (Object.keys(filters).length > 1) {

                rows.forEach(row => {
                    matched = 0;
                    Object.keys(filters).forEach(key => {
                        let isValue = row[`${key}`];

                        if (isValue != "" && isValue != null) {
                            if (`${filters[key]}`.includes("|")) {
                                let searchDate = `${filters[key]}`.split("|");
                                let date = moment(row[`${key}`]).format("DD/MM/YYYY");
                                let startDate = searchDate[0];
                                let finishDate = searchDate[1];

                                if (date >= startDate && date <= finishDate) {
                                    matched++;
                                } else {
                                    matched = 0;
                                }
                            } else if (!/\D/.test(filters[key])) {
                                if (row[`${key}`] === Number(filters[key])) {
                                    matched++;
                                } else if (typeof filters[key] === "number") {
                                    matched = 0;
                                }
                                else if (row[`${key}`].includes(`${filters[key]}`)) {
                                    matched++;
                                } else if (row[`${key}`] === `${filters[key]}`) {
                                    matched++;
                                } else {
                                    matched = 0;
                                }
                            } else if (typeof filters[key] === "number") {
                                matched = 0;
                            } else if (row[`${key}`].includes(`${filters[key]}`)) {
                                matched++;
                            } else if (row[`${key}`] === `${filters[key]}`) {
                                matched++;
                            }
                            else {
                                matched = 0;
                            }
                        }
                    });
                    if (matched > 0) rowsList.push(row);
                });

                this.setState({
                    rows: Object.keys(filters).length > 0 ? rowsList : this.state.filteredRows,
                    Loading: false
                });

            } else {

                rows.forEach(row => {
                    matched = 0;
                    Object.keys(filters).forEach(key => {
                        let isValue = row[`${key}`];

                        if (isValue != "" && isValue != null) {
                            if (`${filters[key]}`.includes("|")) {
                                let searchDate = `${filters[key]}`.split("|");
                                let date = moment(row[`${key}`]).format("DD/MM/YYYY");
                                let startDate = searchDate[0];
                                let finishDate = searchDate[1];

                                if (date >= startDate && date <= finishDate) {
                                    matched++;
                                } else {
                                    matched = 0;
                                }
                            } else if (!/\D/.test(filters[key])) {
                                if (row[`${key}`] === Number(filters[key])) {
                                    matched++;
                                } else if (typeof filters[key] === "number") {
                                    matched = 0;
                                } else if (row[`${key}`].includes(`${filters[key]}`)) {
                                    matched++;
                                } else if (row[`${key}`] === `${filters[key]}`) {
                                    matched++;
                                } else {
                                    matched = 0;
                                }
                            } else if (typeof filters[key] === "number") {
                                matched = 0;
                            } else if (row[`${key}`].includes(`${filters[key]}`)) {
                                matched++;
                            } else if (row[`${key}`] === `${filters[key]}`) {
                                matched++;
                            }
                            else {
                                matched = 0;
                            }
                        }
                    });
                    if (matched > 0) rowsList.push(row);
                });

                this.setState({
                    rows: Object.keys(filters).length > 0 ? rowsList : this.state.filteredRows,
                    Loading: false
                });
            }
        }
    };

    showFilterMore = () => {
        this.setState({
          ShowModelFilter: true,
          rows: this.props.data
        });
      };
    
    render() {

        const columns = this.state.columns.filter(x => x.type !== "check-box");

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
        // this.props.cells.length > 5 ? 
        return (
            <Fragment>
                <div className="filter__warrper" style={{ paddingRight: "16px", paddingLeft: "24px" }}>
                    <div className="filter__more" style={{ padding: 0 }}>
                        {/* <span>{this.props.filterColumnsLength != undefined ? this.props.filterColumnsLength : 5}{Resources.filtersApplied[currentLanguage]}</span> */}
                        <button className="filter__more--btn" onClick={this.showFilterMore}>{Resources.seeAll[currentLanguage]}</button>
                    </div>
                    <div className="filter__input-wrapper" onMouseLeave={this.resetDate} id="resetData">
                        <form id="signupForm1" method="post" className="proForm readOnly__disabled" action="" noValidate="noValidate">
                            {columns.map((column, index) => {
                                let classX = arrColumn.findIndex(x => x == column.field) > -1 ? "small__input--width " : "medium__input--width";
                                if (column.type === "date") {
                                    return column.sortable === true && index <= 5 ? (
                                        <div className={"form-group linebylineInput " + classX} key={index}>
                                            <label className="control-label" htmlFor={column.field}>
                                                {column.title}
                                            </label>
                                            <div className="ui input inputDev" style={{ position: "relative", display: "inline-block" }} ref={node => { this.node = node; }}>
                                                <input type="text" autoComplete="off" key={index} placeholder={column.title}
                                                    onChange={e => this.saveFilter(e, index, column.title, column.type, column.field)} value={this.state[index + "-column"]}
                                                    onClick={() => this.changeDate(index, column.type)} />

                                                {this.state.currentData === index && this.state.currentData != 0 ?
                                                    (<div className="viewCalender" tabIndex={0} ref={index => { this.index = index; }}>
                                                        <Calendar onChange={date => this.onChange(date, index, column.title, column.type, column.field)} selectRange={true} />
                                                    </div>) : null}
                                            </div>
                                        </div>
                                    ) : null;
                                } else if (column.type === "number") {
                                    return column.sortable === true && index <= 5 ? (
                                        <div className={"form-group linebylineInput " + classX} key={index}>
                                            <label className="control-label" htmlFor={column.field}>
                                                {column.title}
                                            </label>
                                            <div className="ui input inputDev">
                                                <input autoComplete="off" placeholder={column.title} key={index} type="number" className="form-control"
                                                    id={column.field} name={column.field} onChange={e => this.saveFilter(e, index, column.title, column.type, column.field)} />
                                            </div>
                                        </div>
                                    ) : null;
                                } else {
                                    return column.sortable === true && index <= 5 ? (
                                        <div className={"form-group linebylineInput " + classX} key={index}>
                                            <label className="control-label" htmlFor={column.field}>
                                                {column.title}
                                            </label>
                                            <div className="ui input inputDev">
                                                <input autoComplete="off" placeholder={column.title} key={index} type="text" className="form-control"
                                                    id={column.field} name={column.field} onChange={e => this.saveFilter(e, index, column.title, column.type, column.field)} />
                                            </div>
                                        </div>
                                    ) : null;
                                }
                            })}
                            <button style={{ marginBottom: '0' }} className="defaultBtn btn" onClick={this.resetModeFilter} type="button">
                                {Resources.resetAll[currentLanguage]}
                            </button>
                        </form>
                    </div>
                </div>

                <div className={this.state.ShowModelFilter ? "filterModal__container active" : "filterModal__container"}>
                    <h2 className="zero">{Resources.filterResults[currentLanguage]}</h2>
                    <button className="filter__close" onClick={this.CloseModeFilter}>x</button>
                    <div className="filterModal" id="largeModal">
                        <div style={{ position: 'relative', minHeight: '200px' }}>
                            <div className="header-filter">
                                <h2 className="zero">Filter results</h2>
                                <span><span className={this.state.Loading ? "res__load" : ""}>{this.state.rows.length}</span> Results</span>
                            </div>
                            <div className="content">
                                <div className="filter__warrper">
                                    <div className="filter__input-wrapper">
                                        <form id="signupForm1" method="post" className="proForm readOnly__disabled" action="" noValidate="noValidate">
                                            {columns.map((column, index) => {
                                                let classX = arrColumn.findIndex(x => x == column.field) > -1 ? "small__input--width " : "medium__input--width";
                                                if (column.type === "date") {
                                                    return column.sortable === true && column.field !== "customBtn" ? (
                                                        <div className={"form-group linebylineInput " + classX} key={index}>
                                                            <label className="control-label" htmlFor={column.field}>
                                                                {column.title}
                                                            </label>
                                                            <div className="ui input inputDev" style={{ position: "relative", display: "inline-block" }} ref={node => { this.node = node; }}>
                                                                <input type="text" autoComplete="off" key={index} placeholder={column.title}
                                                                    onChange={e => this.saveFilter(e, index, column.title, column.type, column.field)}
                                                                    value={this.state[index + "-column"]} onFocus={() => this.changeDate(index, column.type)} />
                                                                {this.state.currentData === index &&
                                                                    this.state.currentData != 0 ? (
                                                                        <div className="viewCalender" tabIndex={0} onMouseLeave={this.resetDate} ref={index => { this.index = index; }}>
                                                                            <Calendar onChange={date => this.onChange(date, index, column.title, column.type, column.field)} selectRange={true} />
                                                                        </div>) : ("")}
                                                            </div>
                                                        </div>
                                                    ) : null;
                                                } else if (column.type === "number") {
                                                    return column.sortable === true && column.field !== "customBtn" ? (
                                                        <div className={"form-group linebylineInput " + classX} key={index}>
                                                            <label className="control-label" htmlFor={column.field}>
                                                                {column.title}
                                                            </label>
                                                            <div className="ui input inputDev">
                                                                <input autoComplete="off" key={index} id={column.field} placeholder={column.title} type="number"
                                                                    className="form-control" name={column.field} onChange={e => this.saveFilter(e, index, column.title, column.type, column.field)} />
                                                            </div>
                                                        </div>
                                                    ) : null;
                                                } else {
                                                    return column.sortable === true && column.field !== "customBtn" ? (
                                                        <div className={"form-group linebylineInput " + classX} key={index}>
                                                            <label className="control-label" htmlFor={column.field}>
                                                                {column.title}
                                                            </label>
                                                            <div className="ui input inputDev">
                                                                <input autoComplete="off" key={index} id={column.field} placeholder={column.title} type="text"
                                                                    className="form-control" name={column.field} onChange={e => this.saveFilter(e, index, column.title, column.type, column.field)} />
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
                                <button className="reset__filter" onClick={this.ClearFilters}>Reset all</button>
                            </div>
                        </div>
                    </div>
                </div>

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

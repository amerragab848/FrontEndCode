import React, { Component, Fragment } from 'react';
import GridCustom from 'react-customized-grid';
import Calendar from "react-calendar";
import moment from "moment";
import Resources from "../../../resources.json";
import { isEqual } from 'lodash';
import LoadingSection from "../../publicComponants/LoadingSection";
// import { Slider } from 'react-semantic-ui-range';
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let arrColumn = ["arrange", "quantity", "unitPrice"];

export default class CustomGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: this.props.cells,
            rows: this.props.data,
            pagedData: this.props.data,
            groupBy: this.props.groupBy != null ? this.props.groupBy : [],
            selectedIndexes: [],
            selectedRows: [],
            localStorFiltersList: [],
            selectedRow: [],
            copmleteRows: [],
            groupsList: this.props.groups || [],
            expandedRows: {},
            columnsModal: false,
            filterLoading: false,
            ColumnsHideShow: [],
            Loading: false,
            GridLoading: true,
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
            showPicker: false,
            isFilter: false
        };
    }

    componentDidMount() {

        let state = {};

        this.props.cells.map((column, index) => {
            if (column.type === "date") {
                state[index + "-column"] = moment().format("DD/MM/YYYY");
            } else {
                state[index + "-column"] = '';
            }
        });

        var savedGrid = JSON.parse(localStorage.getItem(this.props.gridKey)) || { groups: JSON.stringify([]), Filters: JSON.stringify([]), columnsList: JSON.stringify([]) };

        var parsedFilters = savedGrid.Filters && savedGrid.Filters.length > 0 ? JSON.parse(savedGrid.Filters) : []
        var obj = {};
        if (parsedFilters.length > 0) {
            let rows = [...this.state.filteredRows];
            this.setState({ filterLoading: true })

            parsedFilters.forEach(element => {
                if (element.value) {
                    obj[element.key] = element.value;
                    state[element.index + "-column"] = element.value;
                }
            });
            this.getRowsFilter(rows, obj, 0);

            //this.chunkData(0);
        }
        // else { 
        //     this.chunkData(0);
        // }

        this.setState({ GridLoading: true })
        var currentGP = [];
        let itemsColumns = this.props.cells;
        if (JSON.parse(savedGrid.columnsList).length === 0) {

            var gridLocalStor = { columnsList: [], groups: [] };
            gridLocalStor.columnsList = JSON.stringify(itemsColumns);
            gridLocalStor.groups = JSON.stringify(currentGP);

            localStorage.setItem(this.props.gridKey, JSON.stringify(gridLocalStor));
        }
        else {
            var parsingList = JSON.parse(savedGrid.columnsList);
            for (var item in parsingList) {
                for (var i in itemsColumns) {
                    if (itemsColumns[i].field === parsingList[item].field) {
                        let status = parsingList[item].hidden
                        itemsColumns[i].hidden = status
                        itemsColumns[i].width = parsingList[item].width
                        break;
                    }
                }
            };
            currentGP = savedGrid.groups && savedGrid.groups.length > 0 ? JSON.parse(savedGrid.groups) : [];
        }

        this.setState({
            ColumnsHideShow: itemsColumns,
            columns: itemsColumns,
            groups: currentGP,
            groupsList: currentGP,
            setFilters: savedGrid.Filters && savedGrid.Filters.length > 0 ? obj : itemsColumns,
            GridLoading: false,
            filterLoading: false,
            ...state
        });
    }

    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.isFilter && isEqual(state.rows, nextProps.data)) {
            return {
                rows: nextProps.data,
                GridLoading: true
            }
        }
        return null
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.isFilter && isEqual(prevState.rows, this.props.data)) {
            this.props.changeValueOfProps();
            this.setState({
                GridLoading: false
            });
        }
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

    ResetShowHide = () => {
        this.setState({ Loading: true })

        let ColumnsHideShow = this.state.ColumnsHideShow
        for (var i in ColumnsHideShow) {
            ColumnsHideShow[i].hidden = false;
            let key = ColumnsHideShow[i].field
            this.setState({ [key]: false })
        }
        setTimeout(() => {
            this.setState({
                columns: ColumnsHideShow.filter(i => i.hidden != true),
                ColumnsHideShow: ColumnsHideShow.filter(i => i.hidden != true),
                Loading: false, columnsModal: false
            })
        }, 300)
    };

    handleCheck = (key) => {

        this.setState({ [key]: !this.state[key], Loading: true });
        let columnList = this.state.ColumnsHideShow
        for (var i in columnList) {
            if (columnList[i].field === key) {
                let status = columnList[i].hidden === true ? false : true
                columnList[i].hidden = status
                break;
            }
        }
        var gridLocalStor = { columnsList: [], groups: [] };

        gridLocalStor.columnsList = JSON.stringify(columnList);
        gridLocalStor.groups = JSON.stringify(this.state.groupsList.length > 0 ? this.state.groupsList : []);

        localStorage.setItem(this.props.gridKey, JSON.stringify(gridLocalStor));
        let showColumn = columnList.filter(i => i.hidden != true);

        setTimeout(() => {
            this.setState({
                columns: showColumn,
                Loading: false
            })
        }, 300);
    };

    ClearFilters = () => {
        var filterArray = Array.from(document.querySelectorAll(".filterModal input"));
        filterArray.map(input => (input.value = ""));

        var filterArrayParent = Array.from(document.querySelectorAll("#resetData input"));
        filterArrayParent.map(input => (input.value = ""));

        let state = this.state;

        this.props.cells.map((column, index) => {
            if (column.type === "date") {
                state[index + "-column"] = moment().format("DD/MM/YYYY");
            } else {
                state[index + "-column"] = '';
            }
        });

        this.setState({ rows: this.props.data, setFilters: {}, state });

        // this.chunkData(0);
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
            } else {
                state[index + "-column"] = '';
            }
        });
        var gridLocalStor = { columnsList: [], groups: [] };

        gridLocalStor.groups = JSON.stringify(this.state.groupsList);
        gridLocalStor.columnsList = JSON.stringify(this.state.columns);

        localStorage.setItem(this.props.gridKey, JSON.stringify(gridLocalStor));
        this.setState({ rows: this.props.data, setFilters: {}, state });

        // this.chunkData(0);
    };

    onChange = (date, index, columnName, type, key) => {
        let margeDate = date != null ? moment(date[0]).format("DD/MM/YYYY") + "|" + moment(date[1]).format("DD/MM/YYYY") : "";
        this.saveFilter(margeDate, index, columnName, type, key);
        let state = this.state;
        state[index + "-column"] = margeDate;
        this.setState({ state, currentData: 0 });
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
                newFilters[filter.column.key] = event.target.value.toUpperCase();
            } else {
                delete newFilters[filter.column.key];
            }

            let rows = [...this.state.filteredRows];

            this.getRowsFilter(rows, newFilters, index);

            let newFilterLst = this.state.localStorFiltersList;

            const i = newFilterLst.findIndex(x => x.index === index);
            if (i > -1) newFilterLst[i] = { key: filter.key, index: index, value: newFilters[filter.key] };
            else newFilterLst.push({ key: filter.key, index: index, value: newFilters[filter.key] })

            var gridLocalStor = { columnsList: [], groups: [] };
            gridLocalStor.columnsList = JSON.stringify(this.state.columns);
            gridLocalStor.groups = JSON.stringify(this.state.groupsList.length > 0 ? this.state.groupsList : []);

            localStorage.setItem(this.props.gridKey, JSON.stringify(gridLocalStor));

            this.setState({
                isFilter: false,
                setFilters: newFilters,
                localStorFiltersList: newFilterLst,
                Loading: false,
                [index + "-column"]: newFilters[filter.column.key]
            });
        }
    }

    getRowsFilter = (rows, _filters, index) => {

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
                                } else if (row[`${key}`].toString().includes(`${filters[key]}`)) {
                                    matched++;
                                } else if (row[`${key}`] === `${filters[key]}`) {
                                    matched++;
                                } else {
                                    matched = 0;
                                }
                            } else if (typeof filters[key] === "number") {
                                matched = 0;
                            } else if ((row[`${key}`].toString().toUpperCase()).includes(`${filters[key]}`)) {
                                matched++;
                            } else if (row[`${key}`].toString().toUpperCase() === `${filters[key]}`) {
                                matched++;
                            }
                            else {
                                matched = 0;
                            }
                        }
                    });
                    if (matched > 0) rowsList.push(row);
                });
                let newRows = Object.keys(filters).length > 0 ? rowsList : this.state.filteredRows;

                this.setState({
                    rows: newRows,
                    Loading: false
                });

                // this.chunkData(0);
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
                                } else if (row[`${key}`].toString().includes(`${filters[key]}`)) {
                                    matched++;
                                } else if (row[`${key}`] === `${filters[key]}`) {
                                    matched++;
                                } else {
                                    matched = 0;
                                }
                            } else if (typeof filters[key] === "number") {
                                matched = 0;
                            } else if ((row[`${key}`].toString().toUpperCase()).includes(`${filters[key]}`)) {
                                matched++;
                            } else if (row[`${key}`].toString().toUpperCase() === `${filters[key]}`) {
                                matched++;
                            }
                            else {
                                matched = 0;
                            }
                        }
                    });
                    if (matched > 0) rowsList.push(row);
                });
                let newRows = Object.keys(filters).length > 0 ? rowsList : this.state.filteredRows;
                this.setState({
                    rows: newRows,
                    Loading: false
                });
            }

        }
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

    showFilterMore = () => {
        this.setState({
            ShowModelFilter: true,
            rows: this.props.data
        });
    };

    handleGroupEvent = (groups) => {

        var gridLocalStore = { columnsList: [], groups: [] };
        gridLocalStore.groups = JSON.stringify(groups);
        gridLocalStore.columnsList = JSON.stringify(this.state.columns);
        localStorage.setItem(this.props.gridKey, JSON.stringify(gridLocalStore));

        this.setState({ groupsList: groups });
    }

    handleChangeWidth = (key, newWidth) => {

        this.setState({ GridLoading: true });

        let ColumnsHideShow = this.state.ColumnsHideShow;
        for (var i in ColumnsHideShow) {
            if (ColumnsHideShow[i].field === key) {
                ColumnsHideShow[i].width = this.props.useModal === true ? ColumnsHideShow[i].width : newWidth;
                break;
            }
        }
        var savedGrid = { columnsList: [], groups: [] };
        savedGrid.columnsList = JSON.stringify(ColumnsHideShow)
        savedGrid.groups = JSON.stringify(this.state.groupsList);
        localStorage.setItem(this.props.gridKey, JSON.stringify(savedGrid))

        setTimeout(() => {
            this.setState({
                columns: ColumnsHideShow.filter(i => i.hidden !== true),
                GridLoading: false,
            });
        }, 500);
    };

    /**
     * Returns an array with arrays of the given size.
     *
     * @param myArray {Array} array to split 
     * @param pageNumber {Integer} page called 
     */
    chunkData(pageNumber) {
        var index = 0;
        var myArray = this.state.rows;
        var arrayLength = myArray.length;
        var tempArray = [];

        let startFrom = (pageNumber * 100);

        for (index = startFrom; index < arrayLength; index += 100) {
            let myChunk = myArray.slice(startFrom, (startFrom + 100) + (pageNumber * 100));
            console.table(myChunk);
            tempArray.push(myChunk);
            break;
        }
        this.setState({
            pagedData: tempArray
        })
        //return tempArray;
    }

    timeLineBalls = (n, onClick, current, key) =>
        Array(n).fill(0).map((i, index) => (
            <div
                key={index}
                className={`timeline__ball ${current >= index ? "active" : null}`}
                onClick={() => onClick(key, (index + 1) * 12)} >
                {index + 1}
            </div>
        ));

    intermediaryBalls = 4;
    render() {

        const columns = this.state.columns.filter(x => x.type !== "check-box");
        let RenderPopupShowColumns = this.state.ColumnsHideShow.map((item, index) => {

            let container = ((this.props.useModal === true ? document.getElementById('grid-container_addAttachments').offsetWidth : document.getElementById('grid__column--content').offsetWidth) * 0.5) * 0.47 * 0.8
            let BallsWidth = container / 4
            let activeWidth = (item.width * container / BallsWidth) - BallsWidth
            let diff = (activeWidth / BallsWidth) * 4

            return (

                <div className="grid__content" key={item.field}>
                    <div className={'ui checkbox checkBoxGray300 count checked  ' + (item.fixed === true ? 'disabled' : '')}>
                        <input name="CheckBox" type="checkbox" id={item.field} checked={!item.hidden}
                            onChange={(e) => this.handleCheck(item.field)} />
                        <label>{item.title}</label>
                    </div>
                    {item.field == 'id' || item.type === "check-box" ? null :
                        <p className="rangeSlider">
                            <div className="timeline" id="timeline">
                                <div className="timeline__progress" style={{ width: `${activeWidth - (activeWidth > BallsWidth ? diff : 0)}px` }} />
                                {this.timeLineBalls(4, this.handleChangeWidth, (item.width / 12) - 1, item.field)}
                            </div>
                            <label className="rnageWidth">width</label>
                        </p>
                    }
                </div>
            )
        })

        return (
            <Fragment>
                <div className="filter__warrper" style={{ paddingRight: "16px", paddingLeft: "24px" }}>
                    <div className="filter__more" style={{ padding: 0 }}>
                        <button className="filter__more--btn" onClick={this.showFilterMore}>{Resources.seeAll[currentLanguage]}</button>
                    </div>
                    {this.state.filterLoading == false ?
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
                                                <div className={"ui input inputDev "} style={{ position: "relative", display: "inline-block" }} ref={node => { this.node = node; }}>
                                                    <input type="text" autoComplete="off" key={index} placeholder={column.title}
                                                        onChange={e => this.saveFilter(e, index, column.title, column.type, column.field)}
                                                        value={this.state[index + "-column"] != null ? this.state[index + "-column"] : ''}
                                                        onClick={() => this.changeDate(index, column.type)}
                                                    />

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
                                                <div className={"ui input inputDev test" + (this.state[index + "-column"])}>
                                                    <input autoComplete="off" placeholder={column.title} key={index} type="text" className="form-control"
                                                        id={column.field} name={column.field}
                                                        value={this.state[index + "-column"] != null ? this.state[index + "-column"] : ''}
                                                        onChange={e => this.saveFilter(e, index, column.title, column.type, column.field)} />
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
                        : <span className={"res__load"}></span>
                    }
                </div>
                <div className={this.state.ShowModelFilter ? "filterModal__container active" : "filterModal__container"}>
                    <h2 className="zero">{Resources.filterResults[currentLanguage]}</h2>
                    <button className="filter__close" onClick={this.CloseModeFilter}>x</button>
                    <div className="filterModal" id="largeModal">
                        <div style={{ position: 'relative', minHeight: '200px' }}>
                            <div className="header-filter">
                                <h2 className="zero">Filter results</h2>
                                {this.state.rows ?
                                    <span><span className={this.state.Loading ? "res__load" : ""}>{this.state.rows.length}</span> Results</span>
                                    :
                                    null
                                }
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
                                                                    value={this.state[index + "-column"] != null ? this.state[index + "-column"] : ''} onFocus={() => this.changeDate(index, column.type)} />
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
                <div className={this.state.minimizeClick ? "minimizeRelative miniRows" : "minimizeRelative"}>

                    <div className="minimizeSpan" >
                        <div className="H-tableSize" data-toggle="tooltip" title="Minimize Rows" onClick={this.handleMinimize}>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                                <g fill="none" fillRule="evenodd" transform="translate(5 5)">
                                    <g fill="#CCD2DB" mask="url(#b)">
                                        <path id="a" d="M0 1.007C0 .45.45 0 1.008 0h1.225c.556 0 1.008.45 1.008 1.007v11.986C3.24 13.55 2.79 14 2.233 14H1.008C.45 14 0 13.55 0 12.993V1.007zm5.38 0C5.38.45 5.83 0 6.387 0h1.226C8.169 0 8.62.45 8.62 1.007v11.986C8.62 13.55 8.17 14 7.613 14H6.387c-.556 0-1.007-.45-1.007-1.007V1.007zm5.38 0C10.76.45 11.21 0 11.766 0h1.225C13.55 0 14 .45 14 1.007v11.986C14 13.55 13.55 14 12.992 14h-1.225c-.556 0-1.008-.45-1.008-1.007V1.007z" />
                                    </g>
                                </g>
                            </svg>
                        </div>
                        {this.props.useModal === true ? null :
                            <div className="V-tableSize" data-toggle="tooltip" title="Filter Columns" onClick={this.openModalColumn}>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                                    <g fill="none" fillRule="evenodd" transform="translate(5 5)">
                                        <g fill="#CCD2DB" mask="url(#b)">
                                            <path id="a" d="M0 1.007C0 .45.45 0 1.008 0h1.225c.556 0 1.008.45 1.008 1.007v11.986C3.24 13.55 2.79 14 2.233 14H1.008C.45 14 0 13.55 0 12.993V1.007zm5.38 0C5.38.45 5.83 0 6.387 0h1.226C8.169 0 8.62.45 8.62 1.007v11.986C8.62 13.55 8.17 14 7.613 14H6.387c-.556 0-1.007-.45-1.007-1.007V1.007zm5.38 0C10.76.45 11.21 0 11.766 0h1.225C13.55 0 14 .45 14 1.007v11.986C14 13.55 13.55 14 12.992 14h-1.225c-.556 0-1.008-.45-1.008-1.007V1.007z" />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        }
                    </div>

                    {this.state.GridLoading === false ?
                        (
                            <>
                                <GridCustom
                                    key={this.props.gridKey}
                                    cells={this.state.columns.filter(i => i.hidden != true)}
                                    data={this.state.rows}
                                    actions={this.props.actions}
                                    rowActions={this.props.rowActions}
                                    rowClick={cell => this.props.rowClick(cell)}
                                    groups={this.state.groupsList}
                                    handleGroupUpdate={this.handleGroupEvent}
                                    showPicker={this.props.showPicker}
                                    shouldCheck={this.props.shouldCheck}
                                />

                            </>
                        )
                        : <LoadingSection />}

                </div>

                <div className={this.state.columnsModal ? "grid__column active " : "grid__column "}>
                    <div className="grid__column--container">
                        <button className="closeColumn" onClick={this.closeModalColumn}>X</button>
                        <div className="grid__column--title">
                            <h2>{Resources.gridColumns[currentLanguage]}</h2>
                        </div>
                        <div className="grid__column--content" id="grid__column--content">
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



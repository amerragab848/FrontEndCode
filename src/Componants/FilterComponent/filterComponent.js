import React, { Component } from "react";
import InputMelcous from "../OptionsPanels/InputMelcous";
import DatePicker from "../OptionsPanels/DatePicker";
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from "../../resources.json";
import moment from "moment";
import Calendar from "react-calendar";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let publicFonts = currentLanguage === "ar" ? 'cairo-sb' : 'Muli, sans-serif'


const filterStyle = {
  control: (styles, { isFocused }) =>
      ({
          ...styles,
          backgroundColor: '#fff',
          width: '100%',
          height: '36px',
          borderRadius: '4px',
          border: isFocused ? "solid 2px #83B4FC" : '2px solid #E9ECF0',
          boxShadow: 'none',
          transition: ' all 0.4s ease-in-out',
          minHeight: '36px'
      }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
      return {
          ...styles,
          backgroundColor: isDisabled ? '#fff' : isSelected ? '#e9ecf0' : isFocused ? '#f2f6fa' : "#fff",
          color: '#3e4352',
          fontSize: '14px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          textTransform: 'capitalize',
          fontFamily: publicFonts,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          zIndex: '155'
      };
  },
  input: styles => ({ ...styles, maxWidth: '100%' }),
  placeholder: styles => ({ ...styles, color: '#A8B0BF', fontSize: '13px', width: '100%', fontFamily: publicFonts }),
  singleValue: styles => ({ ...styles, color: '#252833', fontSize: '13px', width: '100%', fontFamily: publicFonts }),
  indicatorSeparator: styles => ({ ...styles, display: 'none' }),
  menu: styles => ({ ...styles, zIndex: 155, boxShadow: '0 4px 6px 0 rgba(0, 0, 0, 0.2)', border: 'solid 1px #ccd2db' })
};

class FilterComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      filtersColumns: [],
      valueColumns: [],
      isCustom: true,
      isLoading: false,
      currentData: 0,
      ShowModelFilter: false
    };
  }

  componentDidMount() { 
  }

  componentWillMount() {

    let state = {};

    this._isMounted = false;

    this.props.filtersColumns.map((column, index) => {
      if (column.type === "date") {
        state[index + "-column"] = moment().format("YYYY-MM-DD");
      } else {
        state[index + "-column"] = ""
      }
    });
    this.setState({
      filtersColumns: this.props.filtersColumns,
      state
    })
  }

  getValueHandler(event, type, field, indexx) {
    var obj = {};

    if (type === "toggle") {
      if (event["value"] === null) {
        obj.field = field;
        delete obj[field]
      }
      else {
        obj.field = field;
        obj.value = event["value"];
        obj.type = type;
      }

    } else if (type === "date") {
      obj.field = field;
      obj.value = typeof (event) === "object" ? "" : event;
      obj.type = type;

      let state = {};
      this.state[indexx + "-column"] = obj.value;
      this.setState({ state, currentData: obj.value != "" ? this.state.currentData : 0 });
    } else {
      obj.field = event.target.name;
      obj.value = event.target.value;
      obj.type = type;
    }

    let index = 0;

    index = this.state.valueColumns.findIndex(function (item) {
      return item.field === obj.field;
    });

    if (index == -1) {
      this.setState({
        valueColumns: [...this.state.valueColumns, obj]
      });
    } else {
      const columnFilter = {
        ...this.state.valueColumns[index]
      };

      columnFilter.value = obj.value;

      const columnFilters = [...this.state.valueColumns];

      columnFilters[index] = columnFilter;

      this.setState({
        valueColumns: columnFilters
      });
    }
  }

  filterMethod = (e) => {

    this.setState({
      isLoading: true
    });
    var query = {};

    this.state.valueColumns.map(column => {
      if (column.type === "date") {
        if (column.value != "") {
          let spliteDate = column.value.split("|");
          if (spliteDate.length > 1) {
            query[column.field] = column.value;
          }
          else {
            query[column.field] = column.value;
          }
        }
      } else if (column.type === "number") {
        if (column.value != "") {
          query[column.field] = parseFloat(column.value);
        }
      } else if (column.type === "toggle") {
        query[column.field] = column.value;
      } else {
        if (column.value != "") {
          query[column.field] = column.value;
        }
      }
    });

    query["isCustom"] = this.state.isCustom;

    this.props.filterMethod(e, query, this.props.apiFilter);

    this.setState({
      isLoading: false,
      ShowModelFilter: false,
      isCustom: true
    });
  }

  changeDate(index, type) {
    if (type == "date") {
      this.setState({ currentData: index });
    } else {
      this.setState({ currentData: 0 });
    }
  }

  onChange = (date, index, columnName) => {

    let margeDate = date != null ? moment(date[0]).format("DD/MM/YYYY") + "|" + moment(date[1]).format("DD/MM/YYYY") : "";

    let lastState = this.state;

    lastState[index + "-column"] = margeDate

    this.getValueHandler(margeDate, "date", columnName);

    this.setState({ lastState, currentData: 0 });
  };

  resetDate = () => {
    this.setState({ currentData: 0 });
  }

  viewSearch = () => {
    this.setState({ ShowModelFilter: true, isCustom: false, valueColumns: [] });
  }

  renderFilterColumns() {
    let count = 0;
    let columns = (
      <div>
        <div className="filter__warrper">
          {this.props.filtersColumns.length > 6 ?
            <div className="filter__more" style={{ padding: 0 }}>
              <button className="filter__more--btn" onClick={this.viewSearch}>{Resources['seeAll'][currentLanguage]}</button>
            </div> : null}

          <div className="filter__input-wrapper">
            <form id="signupForm1" method="post" className="proForm" action="" noValidate="noValidate">

              {this.state.filtersColumns.map((column, index) => {
                let classX = column.type === "number" ? "small__input--width " : "medium__input--width";
                if (this.state.isCustom && count < 6) {
                  count++
                  if (column.type === "string" || column.type === "number") {
                    return (
                      <div className={"form-group linebylineInput " + classX} key={index}>
                        <InputMelcous ref={column.name} title={column.name} index={index} key={index} type={column.type}
                          name={column.field}
                          inputChangeHandler={event =>
                            this.getValueHandler(event, column.type)
                          }
                          placeholderText={column.name} />
                      </div>
                    );
                  } else if (column.type === "toggle") {
                    return (
                      <div className={"form-group linebylineInput " + classX} key={index}>
                        <Dropdown title={column.name} index={index} key={index} placeholder={column.name}
                          handleChange={event => this.getValueHandler(event, column.type, column.field)}
                          data={[
                            { label: "all", value: null },
                            { label: Resources[column.trueLabel][currentLanguage], value: true },
                            { label: Resources[column.falseLabel][currentLanguage], value: false }
                          ]}
                          styles= {filterStyle}
                        />
                      </div>
                    );
                  } else if (column.type === "date") {
                    if (column.isRange) {
                      return (
                        <div className={"form-group linebylineInput " + classX} key={index}>
                          <label className="control-label" htmlFor={column.key}>{column.name}</label>
                          <div className="ui input inputDev" style={{ position: "relative", display: "inline-block" }}>
                            <input type="text" autoComplete="off" key={index} placeholder={column.name}
                              onChange={date => this.getValueHandler(date, column.type, column.field, index)}
                              value={this.state[index + "-column"]}
                              onClick={() => this.changeDate(index, column.type)} />
                            {this.state.currentData === index && this.state.currentData != 0 ? (
                              <div className="viewCalender" tabIndex={0} ref={index => { this.index = index; }}>
                                <Calendar onChange={(date) => this.onChange(date, index, column.name, column.type, column.key)} selectRange={true} />
                              </div>) : ("")}
                          </div>
                        </div>
                      );
                    }
                    else {
                      return (
                        <div className={"form-group linebylineInput " + classX} key={index}>
                          <DatePicker title={column.name} startDate={this.state[index + "-column"]} index={index} key={index}
                            handleChange={date =>
                              this.getValueHandler(date, column.type, column.field, index)
                            } />
                        </div>
                      );
                    }
                  }
                }
              })}

              {this.state.isLoading === false ? (
                <button type="button" className="primaryBtn-2 btn smallBtn fillter-item-c" onClick={this.filterMethod}>
                  {Resources["search"][currentLanguage]}
                </button>
              ) : (
                  <button type="button" className="primaryBtn-2 btn smallBtn fillter-item-c">
                    <div className="spinner">
                      <div className="bounce1" />
                      <div className="bounce2" />
                      <div className="bounce3" />
                    </div>
                  </button>
                )}
            </form>
          </div>

        </div>
      </div>
    );
    return columns;
  }

  CloseModeFilter = () => {

    this.setState({ ShowModelFilter: false, isCustom: true });
  };

  ClearFilters = () => {

    let state = this.state;

    this.state.filtersColumns.map((column, index) => {
      if (column.type === "date") {
        state[index + "-column"] = moment().format("DD/MM/YYYY");
      } else {
        state[index + "-column"] = "";
      }
    });

    this.setState({ valueColumns: [], state });
  };

  render() {
    return <div onMouseLeave={this.resetDate}>
      {this.renderFilterColumns()}
      <div className={this.state.ShowModelFilter ? "filterModal__container active" : "filterModal__container"}>
        <button className="filter__close" onClick={this.CloseModeFilter}>
          x
          </button>
        <div className="filterModal" id="largeModal">
          <div style={{ position: 'relative', minHeight: '200px' }}>
            <div className="header-filter">
              <h2 className="zero">{Resources['resultItems'][currentLanguage]}</h2>
            </div>
            <div className="content">
              <div className="filter__warrper">
                <div className="filter__input-wrapper">
                  <form id="signupForm1" method="post" className="proForm" action="" noValidate="noValidate">
                    {this.state.filtersColumns.map((column, index) => {
                      let classX = column.type === "number" ? "small__input--width " : "medium__input--width";
                      if (column.type === "string" || column.type === "number") {
                        return (
                          <div className={"form-group linebylineInput " + classX} key={index}>
                            <InputMelcous ref={column.name} title={column.name} index={index} key={index} type={column.type} name={column.field}
                              value={this.state[index + "-column"]}
                              inputChangeHandler={event => this.getValueHandler(event, column.type)} placeholderText={column.name} />
                          </div>
                        );
                      } else if (column.type === "toggle") {
                        return (
                          <div className={"form-group linebylineInput " + classX} key={index}>
                            <Dropdown title={column.name} index={index} key={index} placeholder={column.name}
                              handleChange={event => this.getValueHandler(event, column.type, column.field)}
                              data={[
                                { label: "all", value: null },
                                { label: Resources[column.trueLabel][currentLanguage], value: true },
                                { label: Resources[column.falseLabel][currentLanguage], value: false }
                              ]}
                              styles={filterStyle}
                            />
                          </div>
                        );
                      } else if (column.type === "date") {
                        if (column.isRange) {
                          return (
                            <div className={"form-group linebylineInput " + classX} key={index}>
                              <label className="control-label" htmlFor={column.key}>{column.name}</label>
                              <div className="ui input inputDev" style={{ position: "relative", display: "inline-block" }}>
                                <input type="text" autoComplete="off" key={index} placeholder={column.name}
                                  onChange={date => this.getValueHandler(date, column.type, column.field, index)}
                                  value={this.state[index + "-column"]}
                                  onClick={() => this.changeDate(index, column.type)} />
                                {this.state.currentData === index && this.state.currentData != 0 ? (
                                  <div className="viewCalender" tabIndex={0} ref={index => { this.index = index; }}>
                                    <Calendar onChange={(date) => this.onChange(date, index, column.name, column.type, column.key)} selectRange={true} />
                                  </div>) : ("")}
                              </div>
                            </div>
                          );
                        }
                        else {
                          return (
                            <div className={"form-group linebylineInput " + classX} key={index}>
                              <DatePicker title={column.name}
                                handleChange={date => this.getValueHandler(date, column.type, column.field, index)}
                                startDate={this.state[index + "-column"]} index={index} key={index} />
                            </div>
                          );
                        }
                      }
                    })}
                  </form>
                </div>
              </div>
            </div>
            <div className="filter__actions">
              {
                this.state.isLoading === false ? <button className="largeBtn btn primaryBtn-1" onClick={this.filterMethod}>{Resources.filter[currentLanguage]}</button> :
                  <button className="largeBtn btn primaryBtn-1">
                    <div className="spinner"> <div className="bounce1" /> <div className="bounce2" /> <div className="bounce3" /> </div>
                  </button>
              }
              <button className="reset__filter" onClick={this.ClearFilters}>{Resources['reset'][currentLanguage]}</button>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default FilterComponent;

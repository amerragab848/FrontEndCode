import React, { Component } from "react";
import InputMelcous from "../OptionsPanels/InputMelcous";
import DatePicker from "../OptionsPanels/DatePicker";
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from "../../resources.json";
import moment from "moment";
import Minimize from '../../Styles/images/minimize.png';
import plus from '../../Styles/images/plus.png';
import Calendar from "react-calendar";

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class FilterComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      filtersColumns: [],
      apiFilter: "",
      valueColumns: [],
      isCustom: true,
      isLoading: false,
      currentData:0
    }; 

//    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentDidMount() {
    if (this.props.filtersColumns.length > 6) {
      document.getElementById('showMore_input').addEventListener("click", function () {
        document.querySelector('.moreOn').classList.toggle('lessOn');
        document.querySelector('.fillter-status-container').classList.toggle('onelineFilter');
      });
    }
  }

  componentWillMount() {
 
    let state = {};
    this._isMounted = false;

    this.props.filtersColumns.map((column, index) => {
      if (column.type === "date") {
        state[index + "-column"] = moment().format("DD/MM/YYYY");
      } 
    });

    this.setState({
      filtersColumns: this.props.filtersColumns,
      apiFilter: this.props.apiFilter
    });

    setTimeout(() => {
      this.setState(state);
    }, 500);
  }

  getValueHandler(event, type, field, indexx) {
    var obj = {};

    if (type === "toggle") {
      obj.field = field;
      obj.value = event["value"];
      obj.type = type;
    } else if (type === "date") {
      obj.field = field;
      obj.value = typeof(event) === "object" ? "" : event;
      obj.type = type;

      let state = {};
      this.state[indexx + "-column"] = obj.value;
      this.setState({state,currentData : obj.value != "" ? this.state.currentData : 0});
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
          //query[column.field] = moment(column.value).format("YYYY-MM-DD");
          query[column.field] = column.value;
        }
      } else if (column.type === "number") {
        if (column.value != "") {
          query[column.field] = parseFloat(column.value);
        }
      } else {
        if (column.value != "") {
          query[column.field] = column.value;
        }
      }
    });

    query["isCustom"] = this.state.isCustom;

    this.props.filterMethod(e, query, this.state.apiFilter);

    this.setState({
      isLoading: false
    });
  }

  changeDate(index,type) {
    if (type == "date") { 
 
        document.addEventListener('click', this.handleOutsideClick, false);
         
      this.setState({ currentData:index });
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
      this.setState({ currentData:0  });
    } 
}

// handleOutsideClick(e) {
//   if (this.index != null){
 
//   if (this.index.contains(e.target)) {
//     return;
//   }
//   this.changeDate();
//  }
// }
  
onChange = (date,index,columnName,type,key) => { 

  let margeDate =date != null ? moment(date[0]).format("DD/MM/YYYY") + "|" +  moment(date[1]).format("DD/MM/YYYY") : "";
   
  let lastState = this.state;

  lastState[index+ "-column"] = margeDate 

  this.getValueHandler(margeDate,"date",columnName);

  this.setState({lastState, currentData: 0});
  };

  resetDate = () => {
    this.setState({ currentData: 0});
  }

  renderFilterColumns() {
    let columns = (
      <div>
        {this.props.filtersColumns.length > 6 ?
          <div className="showMore__btn">
            <button id="showMore_input" className="moreOn">
              <span className="more">SHOW MORE</span>
              <span className="less">SHOW Less</span>
              <img className="more" src={plus} alt="plus" />
              <img className="less" src={Minimize} alt="minimize" />
            </button>
          </div>
          : null
        }

        <div className="filter__showmore"> 
          <div className="fillter-status-container onelineFilter">
            {this.state.filtersColumns.map((column, index) => {
              if (this.state.isCustom) {
                if (column.type === "string" || column.type === "number") {
                  return (
                    <div className="form-group fillterinput fillter-item-c" key={index}>
                      <InputMelcous
                        ref={column.name}
                        title={column.name}
                        index={index}
                        key={index}
                        type={column.type}
                        name={column.field}
                        inputChangeHandler={event =>
                          this.getValueHandler(event, column.type)
                        }
                        placeholderText={column.name}
                      />
                    </div>
                  );
                } else if (column.type === "toggle") {
                  return (
                    <div className="form-group fillterinput fillter-item-c" key={index}>
                      <Dropdown
                        title={column.name}
                        index={index}
                        key={index}
                        placeholder={column.name}
                        handleChange={event =>
                          this.getValueHandler(event, column.type, column.field)
                        }
                        data={[
                          { label: "all", value: null },
                          {
                            label: Resources[column.trueLabel][currentLanguage],
                            value: true
                          },
                          {
                            label: Resources[column.falseLabel][currentLanguage],
                            value: false
                          }
                        ]}
                      />
                    </div>
                  );
                } else if (column.type === "date") {
                  return (
                    <div className="form-group fillterinput fillter-item-c"  key={index}>
                          <label className="control-label" htmlFor={column.key}>{column.name}</label>
                      <div className="ui input inputDev" style={{ position: "relative", display: "inline-block" }}>
                          <input type="text" autoComplete="off" key={index} placeholder={column.name}  
                                  onChange={date => this.getValueHandler(date, column.type, column.field, index)} 
                                  value={this.state[index + "-column"]} 
                                  
                                  onClick={() => this.changeDate(index,column.type)}/>
                          {this.state.currentData === index && this.state.currentData != 0 ? (
                           <div className="viewCalender" tabIndex={0} onMouseLeave={this.resetDate}  ref={index => { this.index = index;}}>
                            <Calendar  onChange={(date) => this.onChange(date,index,column.name,column.type,column.key)} selectRange={true}  /> 
                            </div>) : ("")}
                            </div>
                    </div>  
                  );
                }
              }
            })}

          </div>

          {this.state.isLoading === false ? (
            <button
              className="primaryBtn-2 btn smallBtn fillter-item-c"
              onClick={this.filterMethod}
            >
              {Resources["search"][currentLanguage]}
            </button>
          ) : (
              <button className="primaryBtn-2 btn smallBtn fillter-item-c">
                <div className="spinner">
                  <div className="bounce1" />
                  <div className="bounce2" />
                  <div className="bounce3" />
                </div>
              </button>
            )}
        </div>
      </div>
    );
    return columns;
  }

  render() {
    return <div>{this.renderFilterColumns()}</div>;
  }
}

export default FilterComponent;

import React, { Component } from "react";
import Api from "../../api";
import "../../Styles/scss/en-us/layout.css";
import InputMelcous from "../OptionsPanels/InputMelcous";
import DatePicker from "../OptionsPanels/DatePicker";
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from "../../resources.json";
import moment from "moment";

let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class FilterComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filtersColumns: this.props.filtersColumns,
      apiFilter: this.props.apiFilter,
      valueColumns: [],
      isCustom: true,
      isLoading: false
    };

    let state = {};

    this.state.filtersColumns.map((column, index) => {
      if (column.type === "date") {
        state[index + "-column"] = moment();
      }
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
      obj.value = event;
      obj.type = type;

      let state = {};
      this.state[indexx + "-column"] = event;
      this.setState(state);
    } else {
      obj.field = event.target.name;
      obj.value = event.target.value;
      obj.type = type;
    }

    let index = 0;

    index = this.state.valueColumns.findIndex(function(item) {
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
          query[column.field] = moment(column.value).format("YYYY-MM-DD");
        }
      } else if (column.type === "number") {
        if (column.value != "") {
          query[column.field] = parseInt(column.value);
        }
      } else {
        if (column.value != "") {
          query[column.field] = column.value;
        }
      }
    });

    query["isCustom"] = this.state.isCustom;
     
    this.props.filterMethod(e,query,this.state.apiFilter);
 
    this.setState({
      isLoading: false
    });
  }
 
  renderFilterColumns() {
    let columns = (
      <div className="fillter-status-container">
        {this.state.filtersColumns.map((column, index) => {
          if (this.state.isCustom) {
            if (column.type === "string" ||column.type === "number" ) {
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
              );
            } else if (column.type === "date") { 
              return (
                <DatePicker
                  title={column.name}
                  handleChange={date =>
                    this.getValueHandler(date, column.type, column.field, index)
                  }
                  startDate={this.state[index + "-column"]}
                  index={index}
                  key={index}
                />
              );
            }
          }
        })}

        {this.state.isLoading === false ? (
          <button
            className="primaryBtn-2 btn smallBtn fillter-item-c" 
            onClick={this.filterMethod} 
          >
            {Resources["search"][currentLanguage]}
          </button>
        ) : (
          <button className="primaryBtn-2 btn smallBtn fillter-item-c">
            <div class="spinner">
              <div class="bounce1" />
              <div class="bounce2" />
              <div class="bounce3" />
            </div>
          </button>
        )}
      </div>
    ); 
    return columns;
  }

  render() {
    return <div>{this.renderFilterColumns()}</div>;
  }
}

export default FilterComponent;

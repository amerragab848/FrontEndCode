import React, { Component } from "react";
import Api from "../../api";
import "../../Styles/scss/en-us/layout.css";
import InputMelcous from "../OptionsPanels/InputMelcous";
import DatePicker from "../OptionsPanels/DatePicker";
import Dropdown from "../OptionsPanels/DropdownMelcous";
import Resources from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class FilterComponent extends Component {
  state = {
    filtersColumns: this.props.filtersColumns,
    apiFilter: this.props.apiFilter
  };

  renderFilterColumns() {
    let columns = (
      <div className="fillter-status-container">
        {this.state.filtersColumns.map((column, index) => {
          if (column.isCustom) {
            if (column.type === "string") {
              return (
                <div className="form-group fillterinput fillter-item-c">
                  <InputMelcous
                    title={column.name}
                    index={index}
                    key={index}
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
              return <DatePicker title={column.name} index={index} key={index}/>;
            }
          }
        })}

        <button className="primaryBtn-2 btn smallBtn fillter-item-c">
          FILTER
        </button>
      </div>
    );

    return columns;
  }

  render() { 
    return <div>{this.renderFilterColumns()}</div>;
  }
}

export default FilterComponent;

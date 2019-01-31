import React, { Component } from "react";
import Api from "../../api";
import LeftMenu from "./LeftMenu";
import HeaderMenu from "./HeaderMenu";
//import Resources from "../../resources.json";
let currentLanguage =
  localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class Menu extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount = () => {};

  render() {
    return (
      <div>
        <HeaderMenu />
        <LeftMenu />
      </div>
    );
  }
}

export default Menu;

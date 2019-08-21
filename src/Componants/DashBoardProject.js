import React, { Component, Fragment } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CryptoJS from 'crypto-js';
import { SortablePane, Pane } from "react-sortable-pane";
import Rodal from "../Styles/js/rodal";
import dashBoardLogo from "../Styles/images/dashboardDots.png";
import widgets from "./WidgetsDashBoradProject";
import Resources from "../resources.json";
import IndexedDb from '../IndexedDb';

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

const _ = require('lodash');

class DashBoardProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dashBoardIndex: 0,
      viewDashBoard: false,
      widgets: widgets,
      selected: {},
      category: 1,
      categoryOrder: [],
      categories: [],
      showWidgets: false,
      widgetOrders: {}
    };
  }

  async toggleCheck(id, categoryId, checked) {

    await IndexedDb.updateDashBoardProject('widget', id, { checked: !checked });

    let new_state = {
      selected: Object.assign({}, this.state.selected)
    };

    if (checked) {
      let index = this.state.selected[categoryId].indexOf(id);

      new_state.selected[categoryId].splice(index, 1);

      this.setState(new_state);
    } else {
      let old_state = this.state.selected[categoryId] ? this.state.selected[categoryId] : [];

      new_state.selected[categoryId] = [...old_state, id];

      this.setState(new_state);
    }
  }

  async componentDidMount() {

    let categories = await IndexedDb.getCategory();

    let selected = {};

    let widgetOrders = {};

    let orders = [];

    let categoryOrder = categories.map(category => {

      orders = [];

      selected[category.id] = [];

      category.widgets.forEach(widget => {
        if (widget.checked === true) {
          selected[category.id].push(widget.id);
        }
        orders.push(widget.order.toString());
      });

      widgetOrders[category.id] = {
        order: orders
      }

      return category.order.toString();
    });

    categoryOrder = categoryOrder.sort();

    this.setState({ categoryOrder, selected, categories, widgetOrders });

  }

  openCategory(category) {

    this.setState({ showWidgets: true, category });
  }

  async toggleCheckAll(categoryId) {

    let selected = Object.assign({}, this.state.selected);

    let widgets = this.state.categories.find(category => category.id === categoryId).widgets;

    let selectedCategory = selected[categoryId];

    for (let index = 0; index < widgets.length; index++) {
      if (selectedCategory.length === widgets.length) {
        await IndexedDb.updateDashBoardProject('widget', widgets[index].id, { checked: false });

        if (index === (selectedCategory.length - 1)) {
          selectedCategory = [];
        }
      } else {
        if (selectedCategory.indexOf(widgets[index].id) === -1) {
          selectedCategory.push(widgets[index].id);

          await IndexedDb.updateDashBoardProject('widget', widgets[index].id, { checked: true });
        }
      }
    }

    selected[categoryId] = selectedCategory;

    this.setState({ selected });
  }

  toggleTab(id) {
    this.setState({
      dashBoardIndex: id - 1,
      category: this.state.types[id - 1].categories[0].id,
      showWidgets: false
    });
  }

  onClickTabItem(tabIndex) {

    let original_widgets = [...this.state.widgets];

    var refrence = original_widgets.filter(function (i) {
      return i.refrence === tabIndex;
    });

    let widgets_Order = CryptoJS.enc.Base64.parse(this.getFromLS("Widgets_Project_Order")).toString(CryptoJS.enc.Utf8)

    widgets_Order = widgets_Order != "" ? JSON.parse(widgets_Order) : {};

    let updated_state = {
      refrence,
      widgets: original_widgets,
      parent_widgets_order: [],
      dashBoardIndex: tabIndex,
      viewChild: false
    };

    if (Object.keys(widgets_Order).length > 0) {
      let getValueKey = widgets_Order[tabIndex];

      if (getValueKey) {

        getValueKey = _.orderBy(getValueKey, ['order'], ['asc']);

        getValueKey.forEach(item => {
          updated_state.parent_widgets_order.push(item.key);
        });

        updated_state.refrence = [...getValueKey];

      } else {
        updated_state.refrence.forEach(widget => {
          updated_state.parent_widgets_order.push(widget.key.toString());
        });
      }
    } else {
      updated_state.refrence.forEach(widget => {
        updated_state.parent_widgets_order.push(widget.key.toString());
      });
    }

    this.setState(updated_state);
  }

  closeModal() {
    this.setState({
      viewDashBoard: false
    });
  }

  viewCurrentMenu(event, key) {

    let widgets_Order = CryptoJS.enc.Base64.parse(this.getFromLS("Widgets_Project_Order")).toString(CryptoJS.enc.Utf8)

    widgets_Order = widgets_Order != "" ? JSON.parse(widgets_Order) : {};

    let parent = key.split("-")[0];

    let original_widgets = [...this.state.widgets];

    let thirdChild = original_widgets.find(function (i) {
      return i.key === key;
    });

    let childWidget = widgets_Order[parent];

    let childOrder = [];

    let updated_state = {
      viewChild: true,
      childRef: [],
      child_widgets_order: []
    };

    if (childWidget) {
      console.log('fromStorage...', childWidget)
      let widgetChild = childWidget.find(function (i) {
        return i.key === key
      });

      if (widgetChild.widgets.length > 0) {

        widgetChild.widgets.forEach(item => {
          updated_state.child_widgets_order.push(item.key);
        });

        updated_state.childRef = [...widgetChild.widgets];

      } else {

        thirdChild.widgets.forEach(item => {
          childOrder.push(item.key);
        });

        updated_state.childRef = [...thirdChild.widgets];

        updated_state.child_widgets_order = [...childOrder];
      }
    } else {

      console.log('thirdChild....', thirdChild);
      let order = [];

      let poolThirdWidgets = [];

      thirdChild.widgets.forEach(item => {
        if (item.canView !== true) {
          order.push(item.key.toString());
          poolThirdWidgets.push(item);
        }
      });

      updated_state.childRef = poolThirdWidgets;
      updated_state.child_widgets_order = order;
    }

    this.setState(updated_state);
  }

  saveToLS(key, value) {
    if (global.localStorage) {
      global.localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getFromLS(key) {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem(key)) || "";
      } catch (e) { }
    }
    return ls;
  }

  toggleParentCheck(event, id, index) {

    let widgets_Order = CryptoJS.enc.Base64.parse(this.getFromLS("Widgets_Project_Order")).toString(CryptoJS.enc.Utf8)

    widgets_Order = widgets_Order != "" ? JSON.parse(widgets_Order) : {};

    let refrenceValue = id.split("-")[0];

    let original_widgets = [...this.state.widgets];

    if (Object.keys(widgets_Order).length > 0) {

      let refrenceList = widgets_Order[refrenceValue];

      // if key is set
      if (refrenceList) {
        //edit in localStorage
        let setChecked = widgets_Order[refrenceValue].find((i) => {
          return i.key === id;
        });

        if (setChecked) {
          setChecked.checked = !setChecked.checked
        }

        let setIndex = widgets_Order[refrenceValue].findIndex((i) => {
          return i.key === id;
        });

        widgets_Order[refrenceValue][setIndex] = setChecked;

        let setLocalStorage = CryptoJS.enc.Utf8.parse(JSON.stringify(widgets_Order));
        let encodedsetLocalStorage = CryptoJS.enc.Base64.stringify(setLocalStorage);

        this.saveToLS("Widgets_Project_Order", encodedsetLocalStorage);

        this.setState({
          refrence: widgets_Order[refrenceValue]
        });
      }
      // if key is Notset
      else {

        let setOrder = [];

        let checkList = original_widgets.filter(function (i) {
          return i.refrence === parseInt(refrenceValue);
        });

        if (checkList.length > 0) {

          checkList.forEach((value, index) => {

            if (value.key === id) {
              value.checked = !value.checked;
            }

            let widgets = [];

            value.widgets.forEach((val, i) => {
              if (val.type === "twoWidget") {
                widgets.push({
                  key: val.key,
                  order: i + 1,
                  checked: val.checked,
                  parentId: value.key,
                  title: val.title,
                  type: val.type,
                  props: {
                    api: val.props.api,
                    value: val.props.value,
                    total: val.props.total,
                    route: val.props.route,
                    key: val.props.key
                  }
                });
              } else {
                widgets.push({
                  key: val.key,
                  order: i + 1,
                  checked: val.checked,
                  parentId: value.key,
                  title: val.title,
                  type: val.type,
                  props: {
                    api: val.props.api,
                    value: val.props.value,
                    listType: val.props.listType,
                    route: val.props.route,
                    key: val.props.key
                  }
                });
              }
            });
            setOrder.push({
              widgetCategory: value.widgetCategory,
              key: value.key,
              order: index + 1,
              checked: value.checked,
              parentId: "ref" + refrenceValue,
              widgets: widgets
            });
          });
        }

        var obj = {};

        obj[refrenceValue] = setOrder;

        let allObj = Object.assign(obj, widgets_Order);

        let setLocalStorage = CryptoJS.enc.Utf8.parse(JSON.stringify(allObj));
        let encodedsetLocalStorage = CryptoJS.enc.Base64.stringify(setLocalStorage);

        this.saveToLS("Widgets_Project_Order", encodedsetLocalStorage);

        this.setState({
          refrence: obj[refrenceValue]
        });
      }
      //set first value
    } else {

      let setOrder = [];

      var list = original_widgets.filter(function (i) {
        return i.refrence === parseInt(refrenceValue);
      });

      if (list.length > 0) {

        list.forEach((value, index) => {

          if (value.key === id) {
            value.checked = !value.checked;
          }

          let widgets = [];

          value.widgets.forEach((val, i) => {
            if (val.type === "twoWidget") {
              widgets.push({
                key: val.key,
                order: i + 1,
                checked: val.checked,
                parentId: value.key,
                title: val.title,
                type: val.type,
                props: {
                  api: val.props.api,
                  value: val.props.value,
                  total: val.props.total,
                  route: val.props.route,
                  key: val.props.key
                }
              });
            } else {
              widgets.push({
                key: val.key,
                order: i + 1,
                checked: val.checked,
                parentId: value.key,
                title: val.title,
                type: val.type,
                props: {
                  api: val.props.api,
                  value: val.props.value,
                  listType: val.props.listType,
                  route: val.props.route,
                  key: val.props.key
                }
              });
            }
          });

          setOrder.push({
            widgetCategory: value.widgetCategory,
            key: value.key,
            order: index + 1,
            checked: value.checked,
            parentId: "ref" + refrenceValue,
            widgets: widgets
          });
        });
      }

      var obj = {};

      obj[refrenceValue] = setOrder;

      let setLocalStorage = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
      let encodedsetLocalStorage = CryptoJS.enc.Base64.stringify(setLocalStorage);

      this.saveToLS("Widgets_Project_Order", encodedsetLocalStorage);

      this.setState({
        refrence: setOrder
      });
    }
  }

  parentChageOrder(order) {

    let widgets_Order = CryptoJS.enc.Base64.parse(this.getFromLS("Widgets_Project_Order")).toString(CryptoJS.enc.Utf8)

    widgets_Order = widgets_Order != "" ? JSON.parse(widgets_Order) : {};

    let refrenceValue = order[0].split("-");

    let original_widgets = [...this.state.widgets];

    if (widgets_Order) {
      //edit of order 
      let refrenceList = widgets_Order[refrenceValue[0]];

      if (refrenceList) {
        //if key Exist
        order.forEach((value, index) => {

          let getValueKey = refrenceList.findIndex(function (i) {
            return i.key === value
          });

          if (getValueKey >= 0) {
            refrenceList[getValueKey].order = (index + 1);
          }

          widgets_Order[refrenceValue[0]] = refrenceList;

        });

        let setLocalStorage = CryptoJS.enc.Utf8.parse(JSON.stringify(widgets_Order));
        let encodedsetLocalStorage = CryptoJS.enc.Base64.stringify(setLocalStorage);

        this.saveToLS("Widgets_Project_Order", encodedsetLocalStorage);

      } else {
        // if key not Exists  
        let setOrder = [];

        order.forEach((value, index) => {

          let getValueKey = original_widgets.find(function (i) {
            return i.key === value;
          });

          if (getValueKey) {

            let widgets = [];

            getValueKey.widgets.forEach((val, i) => {
              if (val.type === "twoWidget") {
                widgets.push({
                  title: val.title,
                  key: val.key,
                  order: i + 1,
                  parentId: getValueKey.key,
                  type: val.type,
                  props: {
                    api: val.props.api,
                    value: val.props.value,
                    total: val.props.total,
                    route: val.props.route,
                    key: val.props.key
                  }
                });
              } else {
                widgets.push({
                  title: val.title,
                  key: val.key,
                  order: i + 1,
                  parentId: getValueKey.key,
                  type: val.type,
                  props: {
                    api: val.props.api,
                    value: val.props.value,
                    listType: val.props.listType,
                    route: val.props.route,
                    key: val.props.key
                  }
                });
              }
            });

            setOrder.push({
              key: value,
              order: index + 1,
              checked: value.checked != undefined ? value.checked : false,
              parentId: "ref" + refrenceValue[0],
              widgets: widgets,
              widgetCategory: getValueKey.widgetCategory
            });
          }
        });

        var obj = {};

        obj[refrenceValue[0]] = setOrder;

        let allObj = Object.assign(obj, widgets_Order);

        let setLocalStorage = CryptoJS.enc.Utf8.parse(JSON.stringify(allObj));
        let encodedsetLocalStorage = CryptoJS.enc.Base64.stringify(setLocalStorage);

        this.saveToLS("Widgets_Project_Order", encodedsetLocalStorage);

      }
    } else {
      // if no localStorage 
      let setOrder = [];

      order.forEach((value, index) => {
        let getValueKey = original_widgets.find(function (i) {
          return i.key === value;
        });

        if (getValueKey) {

          let widgets = [];

          getValueKey.widgets.forEach((val, i) => {
            if (val.type === "twoWidget") {
              widgets.push({
                key: val.key,
                order: i + 1,
                checked: val.checked != undefined ? val.checked : false,
                parentId: getValueKey.key,
                title: val.title,
                type: val.type,
                props: {
                  api: val.props.api,
                  value: val.props.value,
                  total: val.props.total,
                  route: val.props.route,
                  key: val.props.key
                }
              });
            } else {
              widgets.push({
                key: val.key,
                order: i + 1,
                checked: val.checked != undefined ? val.checked : false,
                parentId: getValueKey.key,
                title: val.title,
                type: val.type,
                props: {
                  api: val.props.api,
                  value: val.props.value,
                  listType: val.props.listType,
                  route: val.props.route,
                  key: val.props.key
                }
              });
            }
          });

          setOrder.push({
            widgetCategory: getValueKey.widgetCategory,
            key: value,
            order: index + 1,
            checked: value.checked != undefined ? value.checked : false,
            parentId: "ref" + refrenceValue[0],
            widgets: widgets
          });
        }
      });

      var obj = {};
      obj[refrenceValue[0]] = setOrder;

      let setLocalStorage = CryptoJS.enc.Utf8.parse(JSON.stringify(obj));
      let encodedsetLocalStorage = CryptoJS.enc.Base64.stringify(setLocalStorage);

      this.saveToLS("Widgets_Project_Order", encodedsetLocalStorage);
    }

    this.setState({
      parent_widgets_order: order
    });
  }

  toggleChildCheck(event, id) {

    var getfirstKey = id.split("-");

    let parentKey = getfirstKey[0];

    let parent = getfirstKey[0] + "-" + getfirstKey[1];

    let original_widgets = [...this.state.widgets];

    let widgets_Order = CryptoJS.enc.Base64.parse(this.getFromLS("Widgets_Project_Order")).toString(CryptoJS.enc.Utf8)

    widgets_Order = widgets_Order != "" ? JSON.parse(widgets_Order) : {};

    let obj = widgets_Order[parentKey];

    // if key in local Storage
    if (obj != undefined) {

      let child = obj.find(function (i) {
        return i.key === parent
      });

      let parentIndex = obj.findIndex(function (i) {
        return i.key === parent
      });

      let widget = child.widgets.find(function (i) {
        return i.key === id
      });

      if (widget) {
        widget.checked = !widget.checked;
      }

      let indexxx = child.widgets.findIndex(function (i) {
        return i.key === id
      });

      widgets_Order[parentKey][parentIndex].widgets[indexxx] = widget;

      let setLocalStorage = CryptoJS.enc.Utf8.parse(JSON.stringify(widgets_Order));
      let encodedsetLocalStorage = CryptoJS.enc.Base64.stringify(setLocalStorage);

      this.saveToLS("Widgets_Project_Order", encodedsetLocalStorage);

      this.setState({
        childRef: widgets_Order[parentKey][parentIndex].widgets
      });
    }
    else {
      // لو العنصر مش موجود
      let setOrder = [];

      let checkList = original_widgets.filter(function (i) {
        return i.refrence === parseInt(parentKey);
      });

      let getIndexx = checkList.findIndex(function (i) {
        return i.key === parent;
      });

      if (checkList.length > 0) {

        checkList.forEach((value, index) => {

          let widgets = [];

          value.widgets.forEach((val, i) => {
            if (val.type === "twoWidget") {
              if (val.key === id) {
                widgets.push({
                  key: val.key,
                  order: i + 1,
                  checked: !val.checked,
                  parentId: value.key,
                  title: val.title,
                  type: val.type,
                  props: {
                    api: val.props.api,
                    value: val.props.value,
                    total: val.props.total,
                    route: val.props.route,
                    key: val.props.key
                  }
                });
              } else {
                widgets.push({
                  key: val.key,
                  order: i + 1,
                  checked: val.checked,
                  parentId: value.key,
                  title: val.title,
                  type: val.type,
                  props: {
                    api: val.props.api,
                    value: val.props.value,
                    listType: val.props.listType,
                    route: val.props.route,
                    key: val.props.key
                  }
                });
              }
            } else {
              if (val.key === id) {
                widgets.push({
                  key: val.key,
                  order: i + 1,
                  checked: !val.checked,
                  parentId: value.key,
                  title: val.title,
                  type: val.type,
                  props: {
                    api: val.props.api,
                    value: val.props.value,
                    listType: val.props.listType,
                    route: val.props.route,
                    key: val.props.key
                  }
                });
              } else {
                widgets.push({
                  key: val.key,
                  order: i + 1,
                  checked: val.checked,
                  parentId: value.key,
                  title: val.title,
                  type: val.type,
                  props: {
                    api: val.props.api,
                    value: val.props.value,
                    listType: val.props.listType,
                    route: val.props.route,
                    key: val.props.key
                  }
                });
              }
            }
          });

          setOrder.push({
            widgetCategory: value.widgetCategory,
            key: value.key,
            order: index + 1,
            checked: value.checked,
            parentId: "ref" + parentKey,
            widgets: widgets
          });
        });
      }

      var objChild = {};

      objChild[parentKey] = setOrder;

      let allObj = Object.assign(objChild, widgets_Order);

      let setLocalStorage = CryptoJS.enc.Utf8.parse(JSON.stringify(allObj));
      let encodedsetLocalStorage = CryptoJS.enc.Base64.stringify(setLocalStorage);

      this.saveToLS("Widgets_Project_Order", encodedsetLocalStorage);

      this.setState({
        childRef: objChild[parentKey][getIndexx].widgets
      });
    }
  }

  ChildchageOrder(order) {

    let getparent = order[0].split("-");

    let getKey = getparent[0] + "-" + getparent[1];

    let Widgets_Order = CryptoJS.enc.Base64.parse(this.getFromLS("Widgets_Project_Order")).toString(CryptoJS.enc.Utf8)

    Widgets_Order = Widgets_Order != "" ? JSON.parse(Widgets_Order) : {};

    let original_widgets = [...this.state.widgets];

    let getLength = Object.keys(Widgets_Order);

    if (getLength.length > 0) {

      let widgetChild = Widgets_Order[getparent[0]].find(function (i) {
        return i.key === (getparent[0] + "-" + getparent[1])
      });

      let childOrder = [];

      order.forEach((item, index) => {

        let widgets = widgetChild.widgets.find(function (i) {
          return i.key === item
        });

        if (widgets) {
          widgets.order = (index + 1)
        }

        childOrder.push(widgets);
      });

      let indexx = Widgets_Order[getparent[0]].findIndex(function (i) {
        return i.key === getKey;
      });

      Widgets_Order[getparent[0]][indexx].widgets = childOrder;

      let setLocalStorage = CryptoJS.enc.Utf8.parse(JSON.stringify(Widgets_Order));
      let encodedsetLocalStorage = CryptoJS.enc.Base64.stringify(setLocalStorage);

      this.saveToLS("Widgets_Project_Order", encodedsetLocalStorage);

    } else {
      // فى حالة ان المستخدم بدا ترتيب child قبل  parent

      //get list of refrence
      let getListRef = original_widgets.filter(function (i) {
        return i.refrence === parseInt(getparent);
      });

      if (getListRef) {
        //get object of key 
        let widget = getListRef.find(function (i) {
          return i.key === getKey
        });

        let setChildOrder = [];

        order.forEach((value, index) => {

          let listWidget = widget.widgets.find(function (i) {
            return i.key === value
          });

          if (listWidget.type === "twoWidget") {

            setChildOrder.push({
              key: listWidget.key,
              order: index + 1,
              checked: listWidget.checked != undefined ? listWidget.checked : false,
              parentId: getKey,
              title: listWidget.title,
              type: listWidget.type,
              props: {
                api: listWidget.props.api,
                value: listWidget.props.value,
                total: listWidget.props.total,
                route: listWidget.props.route,
                key: listWidget.props.key
              }
            });
          } else {
            setChildOrder.push({
              key: listWidget.key,
              order: index + 1,
              checked: listWidget.checked != undefined ? listWidget.checked : false,
              parentId: getKey,
              title: listWidget.title,
              type: listWidget.type,
              props: {
                api: listWidget.props.api,
                value: listWidget.props.value,
                listType: listWidget.props.listType,
                route: listWidget.props.route,
                key: listWidget.props.key
              }
            });
          }
        });

        let setOrder = [];

        let isExist = false;

        getListRef.forEach(item => {

          let widget = getListRef.find(function (i) {
            return i.key === getKey
          });

          if (widget) {
            if (!isExist) {
              setOrder.push({
                widgetCategory: item.widgetCategory,
                key: item.key,
                order: item.order,
                checked: item.checked,
                parentId: "ref" + getparent[0],
                widgets: setChildOrder
              });
              isExist = true;
            }
            else {
              setOrder.push({
                widgetCategory: item.widgetCategory,
                key: item.key,
                order: item.order,
                checked: item.checked,
                parentId: "ref" + getparent[0],
                widgets: item.widgets
              });
            }
          }
        });

        var objChild = {};

        objChild[getparent[0]] = setOrder;

        let setLocalStorage = CryptoJS.enc.Utf8.parse(JSON.stringify(objChild));
        let encodedsetLocalStorage = CryptoJS.enc.Base64.stringify(setLocalStorage);

        this.saveToLS("Widgets_Project_Order", encodedsetLocalStorage);
      }
    }

    this.setState({
      child_widgets_order: order
    });
  }

  async categoryOrderChanged(order) {

    let categories = this.state.categories;

    let new_categories = [];

    for (let index = 0; index < categories.length; index++) {

      let category = categories[index];

      let new_order = order.indexOf(category.order.toString());

      new_order = +`1${new_order + 1}`;

      let new_category = Object.assign({}, category);

      new_category.order = new_order;

      new_categories.push(new_category);

      await this.updateOrder(new_category);
    }
  }

  async updateOrder(category) {
    return await IndexedDb.updateDashBoardProject('widgetCategory', category.id, { order: category.order });
  }

  renderCategories() {

    let categoryPanes = {};

    categoryPanes = this.state.categories.map((category, index) => {

      let checked = this.state.selected[category.id] && this.state.selected[category.id].length;

      return (
        <Pane key={category.order} defaultSize={{ width: "50%" }} resizable={{ x: false, y: false, xy: false }}>
          <div className="secondTabs project__select ui-state-default">
            <img src={dashBoardLogo} />
            <div className={checked ? "ui checkbox checkBoxGray300 count checked" : "ui checkbox checkBoxGray300 count"}
              onClick={event => { this.openCategory(category.id); this.toggleCheckAll(category.id); }}>
              <input readOnly={true} name="CheckBox" type="checkbox" id="terms" tabIndex="0" className="hidden" checked={checked} />
              <label />
            </div>
            <div className="project__title" onClick={event => this.openCategory(category.id)}>
              <h3>{Resources[category.title][currentLanguage]}</h3>
            </div>
          </div>
        </Pane>
      );
    });

    return categoryPanes;
  }

  changeCategoryOrder(order, index) {
    let new_state = {};

    new_state.categoryOrder = [...this.state.categoryOrder];

    new_state.categoryOrder = order;

    this.setState(new_state);
  }

  async widgetOrderChanged(order) {

    let new_Widgets = [];

    let widgets = this.state.categories.find(category => category.id === this.state.category).widgets

    for (let index = 0; index < widgets.length; index++) {

      let widget = widgets[index];

      let new_order = order.indexOf(widget.order.toString());

      new_order = +`1${widget.categoryId}${new_order + 1}`;

      let new_Widget = Object.assign({}, widget);

      new_Widget.order = new_order;

      new_Widgets.push(new_Widget);

      await this.updateWidgetOrder(new_Widget);
    }
  }

  async updateWidgetOrder(widget) {
    return await IndexedDb.updateDashBoardProject('widget', widget.id, { order: widget.order });
  }

  changeWidgetCategoryOrder(order) {

    let new_state = {};

    new_state.widgetOrders = this.state.widgetOrders;

    new_state.widgetOrders[this.state.category].order = order;

    this.setState(new_state);
  }

  render() {

    let widgets = this.state.showWidgets ? this.state.categories.find(category => category.id === this.state.category).widgets.map((widget, index) => {

      let checked = this.state.selected[widget.categoryId].indexOf(widget.id) !== -1;

      return (
        <Pane key={widget.order} defaultSize={{ width: "50%" }} resizable={{ x: false, y: false, xy: false }}>
          <div className="secondTabs project__select ui-state-default">
            <img src={dashBoardLogo} />
            <div className={"ui checkbox checkBoxGray300 count" + (checked ? " checked" : "")} onClick={event => this.toggleCheck(widget.id, widget.categoryId, checked)}>
              <input name="CheckBox" type="checkbox" id="terms" tabIndex={index} className="hidden" checked={checked} />
              <label />
            </div>
            <div className="project__title">
              <h3>{Resources[widget.title][currentLanguage]}</h3>
            </div>
          </div>
        </Pane>
      );
    }) : null;

    let categoryPanes = this.state.categories && this.state.categories.length ? this.renderCategories() : [];

    let currentCategoryChecked = this.state.showWidgets ? this.state.selected[this.state.category].length === this.state.categories.find(category => category.id === this.state.category).widgets.length : false;

    return (
      <div className="customeTabs">
        <div className="dashboard__modal" style={{
          display: this.props.opened ? ' flex' : 'none', position: 'fixed', top: '0', right: '0', left: '0', bottom: '0', zIndex: '99999'
        }}>
          <button onClick={this.props.closed} style={{ cursor: 'pointer', position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '18px', color: '#fff' }}>X</button>
          <div className="dashboard__container">
            <div className="modalTitle">
              <h2>{Resources.dashboardCenter[currentLanguage]}</h2>
            </div>
            {this.state.categoryOrder.length ? <Tabs className="dashboard__Project" selectedIndex={this.state.dashBoardIndex} onSelect={dashBoardIndex => this.toggleTab(dashBoardIndex + 1)}>
              <div className="project__tabs subitTabs">
                <TabList className="zero dashDragCustom">
                  <Tab>
                    {/* counters */}
                    <span className="subUlTitle">
                      {Resources["counters"][currentLanguage]}
                    </span>
                  </Tab>
                </TabList>
              </div>
              <TabPanel>
                <div className="dash__content ui tab">
                  <div className="project__content">
                    {/* counters */}
                    <SortablePane direction="vertical" order={this.state.categoryOrder} onDragStop={(e, key, el, order) => this.categoryOrderChanged(order)} onOrderChange={order => this.changeCategoryOrder(order, this.state.category)}>
                      {categoryPanes}
                    </SortablePane>
                  </div>
                  <div className="project__content">
                    {widgets ?
                      <Fragment>
                        <Pane>
                          <div className="secondTabs project__select ui-state-default">
                            <img src={dashBoardLogo} />
                            <div className={"ui checkbox checkBoxGray300 count" + (currentCategoryChecked ? " checked" : '')} onClick={event => this.toggleCheckAll(this.state.category)}>
                              <input name="CheckBox" type="checkbox" id="terms" tabIndex={1} className="hidden" checked={currentCategoryChecked} />
                              <label />
                            </div>
                            <div className="project__title">
                              <h3>{Resources["selectAll"][currentLanguage]}</h3>
                            </div>
                          </div>
                        </Pane>
                        <SortablePane direction="vertical" order={this.state.widgetOrders[this.state.category].order} onDragStop={(e, key, el, order) => this.widgetOrderChanged(order)} onOrderChange={order => this.changeWidgetCategoryOrder(order)}>
                          {widgets}
                        </SortablePane>
                      </Fragment> : null}
                  </div>
                </div>
              </TabPanel>
            </Tabs> : null}
          </div>
        </div>
      </div>
    );
  }
}

export default DashBoardProject;

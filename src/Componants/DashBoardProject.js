import React, { Component, Fragment } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"; 
import { SortablePane, Pane } from "react-sortable-pane"; 
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
  
  closeModal() {
    this.setState({
      viewDashBoard: false
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

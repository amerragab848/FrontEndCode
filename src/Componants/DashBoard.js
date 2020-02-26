import React, { Component, Fragment } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { SortablePane, Pane } from "react-sortable-pane";
import dashBoardLogo from "../Styles/images/dashboardDots.png";
import widgets from "./WidgetsDashBorad";
import Resources from "../resources.json";
import Config from "../Services/Config";
import IndexedDb from "../IndexedDb";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class DashBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dashBoardIndex: 0,
            viewDashBoard: false,
            widgets: widgets,
            types: [],
            selected: {},
            type: 1,
            category: 1,
            categoryOrder: [],
            showWidgets: false,
            widgetOrders: {},
            orders: []
        };
    }

    async toggleCheck(id, categoryId, checked) {
        await IndexedDb.update("widget", id, { checked: !checked });

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
        let types = await IndexedDb.getTypes();

        let selected = {};

        const categoryOrder = types.map(type => {
            let orders = type.categories.map(category => {
                selected[category.id] = [];

                category.widgets.forEach(widget => {
                    if (widget.checked === true) {
                        selected[category.id].push(widget.id);
                    }
                });

                return category.order.toString();
            });

            return orders;
        });

        let widgetOrders = {};

        types[0].categories.forEach(category => {
            let type = widgetOrders[1] || {};

            type[category.id] = {
                order: [...types[0].categories.find(cat => cat.id === category.id).widgets.map(widget => widget.order.toString())]
            };

            widgetOrders[1] = type;
        });

        types[1].categories.forEach(category => {
            let type = widgetOrders[2] || {};

            type[category.id] = {
                order: types[1].categories
                    .find(cat => cat.id === category.id)
                    .widgets.map(widget => widget.order.toString())
            };

            widgetOrders[2] = type;
        });

        types[2].categories.forEach(category => {
            let type = widgetOrders[3] || {};

            type[category.id] = {
                order: types[2].categories
                    .find(cat => cat.id === category.id)
                    .widgets.map(widget => widget.order.toString())
            };

            widgetOrders[3] = type;
        });

        this.setState({
            types,
            widgets,
            categoryOrder,
            widgetOrders,
            selected
        });
    }

    // category map to number 
    openCategory(category, type) {
        this.setState({ showWidgets: false });
        this.setState({ showWidgets: true, category });
    }

    async toggleCheckAll(typeId, categoryId) {
        let selected = Object.assign({}, this.state.selected);

        let widgets = this.state.types[typeId - 1].categories.find(
            category => category.id === categoryId
        ).widgets;

        let selectedCategory = selected[categoryId];

        for (let index = 0; index < widgets.length; index++) {
            if (selectedCategory.length === widgets.length) {
                await IndexedDb.update("widget", widgets[index].id, {
                    checked: false
                });

                if (index === selectedCategory.length - 1) {
                    selectedCategory = [];
                }
            } else {
                if (selectedCategory.indexOf(widgets[index].id) === -1) {
                    selectedCategory.push(widgets[index].id);

                    await IndexedDb.update("widget", widgets[index].id, {
                        checked: true
                    });
                }
            }
        }

        selected[categoryId] = selectedCategory;

        this.setState({ selected });
    }

    toggleTab(id) {
        this.setState({
            type: id,
            dashBoardIndex: id - 1,
            category: this.state.types[id - 1].categories[0].id,
            showWidgets: false
        });
    }

    changeCategoryOrder(order, typeId) {
        let new_state = {};

        new_state.categoryOrder = [...this.state.categoryOrder];

        new_state.categoryOrder[typeId - 1] = order;

        this.setState(new_state);
    }

    changeWidgetCategoryOrder(order, typeId, categoryId) {
        let new_state = {};

        new_state.widgetOrders = this.state.widgetOrders;

        new_state.widgetOrders[typeId][categoryId].order = order;

        this.setState(new_state);
    }

    async categoryOrderChanged(order, typeId) {
        if (this.state.types && this.state.types[this.state.type]) {
            let types = [...this.state.types];

            let categories = [...types[this.state.type - 1].categories];

            let new_categories = [];

            for (let index = 0; index < categories.length; index++) {
                let category = categories[index];

                let new_order = order.indexOf(category.order.toString());

                new_order = +`${category.typeId}${new_order + 1}`;

                let new_category = Object.assign({}, category);

                new_category.order = new_order;

                new_categories.push(new_category);

                await this.updateOrder(new_category);
            }
        }
    }

    async widgetOrderChanged(order) {
        if (this.state.types && this.state.types[this.state.type]) {
            let types = [...this.state.types];

            let new_Widgets = [];

            let widgets = types[this.state.type - 1].categories.find(
                category => category.id === this.state.category
            ).widgets;

            for (let index = 0; index < widgets.length; index++) {
                let widget = widgets[index];

                let new_order = order.indexOf(widget.order.toString());

                new_order = +`${this.state.type}${
                    widget.categoryId
                    }${new_order + 1}`;

                let new_Widget = Object.assign({}, widget);

                new_Widget.order = new_order;

                new_Widgets.push(new_Widget);

                await this.updateWidgetOrder(new_Widget);
            }
        }
    }

    async updateOrder(category) {
        return await IndexedDb.update("widgetCategory", category.id, {
            order: category.order
        });
    }

    async updateWidgetOrder(widget) {
        return await IndexedDb.update("widget", widget.id, {
            order: widget.order
        });
    }

    renderCategories() {
        let categoryPanes = {};

        this.state.types.forEach(type => {
            categoryPanes[type.id] = type.categories.map((category, index) => {
                let checked =
                    this.state.selected[category.id] &&
                    this.state.selected[category.id].length;

                return (
                    <Pane key={category.order} defaultSize={{ width: "50%" }}
                        resizable={{ x: false, y: false, xy: false }}>
                        <div className="secondTabs project__select ui-state-default">
                            <img src={dashBoardLogo} />
                            <div
                                className={
                                    checked
                                        ? "ui checkbox checkBoxGray300 count checked"
                                        : "ui checkbox checkBoxGray300 count"
                                }
                                onClick={event => {
                                    this.openCategory(category.id, type.id);
                                    this.toggleCheckAll(category.typeId, category.id);
                                }}>
                                <input
                                    readOnly={true}
                                    name="CheckBox"
                                    type="checkbox"
                                    id="terms"
                                    tabIndex="0"
                                    className="hidden"
                                    checked={checked}
                                />
                                <label />
                            </div>
                            <div
                                className="project__title"
                                onClick={event =>
                                    this.openCategory(category.id, type.id)
                                }>
                                <h3>
                                    {Resources[category.title][currentLanguage]}
                                </h3>
                            </div>
                        </div>
                    </Pane>
                );
            });
        });

        return categoryPanes;
    }

    render() {

        let widgetCurrentOrder = this.state.showWidgets && this.state.widgetOrders[1] ? this.state.widgetOrders[this.state.type][this.state.category].order : null;

        let orderhavePermission = [];

        let widgets = this.state.showWidgets ?
            this.state.types[this.state.type - 1].categories.find(category => category.id === this.state.category).widgets.map((widget, index) => {
                if (widget.permission === 0 || Config.IsAllow(widget.permission)) {
                    let checked = this.state.selected[widget.categoryId].indexOf(widget.id) !== -1;
                    
                    orderhavePermission.push(widget.order.toString());

                    return (
                        <Pane width='100%' height="100%" minHeight='unset' key={widget.order} resizable={{ x: false, y: false, xy: false }}>
                            <div className="secondTabs project__select ui-state-default">
                                <img src={dashBoardLogo} />
                                <div className={"ui checkbox checkBoxGray300 count" + (checked ? " checked" : "")}
                                    onClick={event => this.toggleCheck(widget.id, widget.categoryId, checked)}>
                                    <input name="CheckBox" type="checkbox" id="terms"
                                        tabIndex={index}
                                        className="hidden"
                                        checked={checked}
                                        onChange={() => { }}
                                    />
                                    <label />
                                </div>
                                <div className="project__title">
                                    <h3>
                                        {Resources[widget.title][currentLanguage]}
                                    </h3>
                                </div>
                            </div>
                        </Pane>
                    );
                } else {
                    return null;
                }
            }) : null;

        let showWidgets = this.state.showWidgets;

        if (widgets !== null) {
            let selectedWidget = [];

            widgets.forEach(item => {
                if (item !== null) {
                    selectedWidget.push(item);
                }
            });

            showWidgets = selectedWidget.length > 0 ? true : false;

            widgets = selectedWidget;
        }

        let categoryPanes = this.state.types && this.state.types.length ? this.renderCategories() : [];

        let currentCategoryChecked = this.state.showWidgets ? this.state.selected[this.state.category].length === this.state.types[this.state.type - 1].categories.find(category => category.id === this.state.category).widgets.length : false;

        return (
            <div className="customeTabs">
                <div className="dashboard__modal" style={{ display: this.props.opened ? " flex" : "none", position: "fixed", top: "0", right: "0", left: "0", bottom: "0", zIndex: "99999" }}>
                    <button onClick={this.props.closed}
                        style={{
                            cursor: "pointer",
                            position: "absolute",
                            top: "15px",
                            right: "15px",
                            background: "transparent",
                            border: "none",
                            fontSize: "18px",
                            color: "#fff"
                        }}>
                        X
                    </button>
                    <div className="dashboard__container">
                        <div className="modalTitle">
                            <h2>
                                {Resources.dashboardCenter[currentLanguage]}
                            </h2>
                        </div>
                        {this.state.categoryOrder.length ? (
                            <Tabs className="dashboard__Project" selectedIndex={this.state.dashBoardIndex}
                                onSelect={dashBoardIndex =>
                                    this.toggleTab(dashBoardIndex + 1)
                                }>
                                <div className="project__tabs subitTabs">
                                    <TabList className="zero dashDragCustom">
                                        <Tab>
                                            {/* general */}
                                            <span className="subUlTitle">
                                                {Resources["general"][currentLanguage]}
                                            </span>
                                        </Tab>
                                        <Tab>
                                            {/* counters */}
                                            <span className="subUlTitle">
                                                {Resources["counters"][currentLanguage]}
                                            </span>
                                        </Tab>
                                        <Tab>
                                            {/* chart */}
                                            <span className="subUlTitle">
                                                {Resources["chart"][currentLanguage]}
                                            </span>
                                        </Tab>
                                    </TabList>
                                </div>
                                <TabPanel>
                                    {this.state.type === 1 ? (
                                        <div className="dash__content ui tab active">
                                            <div className="project__content">
                                                {/* general */}
                                                <SortablePane
                                                    direction="vertical"
                                                    order={this.state.categoryOrder[0]}
                                                    onDragStop={(e, key, el, order) => this.categoryOrderChanged(order)}
                                                    onOrderChange={order => this.changeCategoryOrder(order, 1)}>
                                                    {categoryPanes[1]}
                                                </SortablePane>
                                            </div>
                                            {showWidgets ?
                                                <div className={"project__content" + (showWidgets ? "  " : " ")}>
                                                    {widgets ? (
                                                        <Fragment>
                                                            <Pane width='100%' height="100%" minHeight='unset'>
                                                                <div className="secondTabs project__select ui-state-default">
                                                                    <img src={dashBoardLogo} />
                                                                    <div className={"ui checkbox checkBoxGray300 count" + (currentCategoryChecked ? " checked" : "")}
                                                                        onClick={event => this.toggleCheckAll(this.state.type, this.state.category)}>
                                                                        <input name="CheckBox" type="checkbox" id="terms" tabIndex={0} className="hidden"
                                                                            checked={currentCategoryChecked} onChange={() => { }} />
                                                                        <label />
                                                                    </div>
                                                                    <div className="project__title">
                                                                        <h3>
                                                                            {Resources["selectAll"][currentLanguage]}
                                                                        </h3>
                                                                    </div>
                                                                </div>
                                                            </Pane>
                                                            {widgets}
                                                        </Fragment>
                                                    ) : null}
                                                </div>
                                                : null
                                            }
                                        </div>
                                    ) : null}
                                </TabPanel>
                                <TabPanel>
                                    {this.state.type === 2 ? (
                                        <div className="dash__content ui tab">
                                            <div className="project__content">
                                                {/* counters */}
                                                <SortablePane direction="vertical" order={this.state.categoryOrder[1]}
                                                    onDragStop={(e, key, el, order) => this.categoryOrderChanged(order)}
                                                    onOrderChange={order => this.changeCategoryOrder(order, 2)}>
                                                    {categoryPanes[2]}
                                                </SortablePane>
                                            </div>
                                            {showWidgets ?
                                                <div className={"project__content" + (showWidgets ? "  " : " ")}>
                                                    {widgets ? (
                                                        <Fragment>
                                                            <Pane>
                                                                <div className="secondTabs project__select ui-state-default">
                                                                    <img src={dashBoardLogo} />
                                                                    <div className={"ui checkbox checkBoxGray300 count" + (currentCategoryChecked ? " checked" : "")}
                                                                        onClick={event => this.toggleCheckAll(this.state.type, this.state.category)}>
                                                                        <input name="CheckBox" type="checkbox" id="terms" tabIndex={1} className="hidden" checked={currentCategoryChecked} />
                                                                        <label />
                                                                    </div>
                                                                    <div className="project__title">
                                                                        <h3>
                                                                            {Resources["selectAll"][currentLanguage]}
                                                                        </h3>
                                                                    </div>
                                                                </div>
                                                            </Pane>
                                                            <SortablePane direction="vertical" order={orderhavePermission}
                                                                onDragStop={(e, key, el, order) => this.widgetOrderChanged(order)}
                                                                onOrderChange={order => this.changeWidgetCategoryOrder(order, 2, this.state.category)}>
                                                                {widgets}
                                                            </SortablePane>
                                                        </Fragment>
                                                    ) : null}
                                                </div> : null}
                                        </div>
                                    ) : null}
                                </TabPanel>
                                <TabPanel>
                                    {this.state.type === 3 ? (
                                        <div className="dash__content ui tab">
                                            <div className="project__content">
                                                {/* chart */}
                                                <SortablePane direction="vertical" order={this.state.categoryOrder[2]}
                                                    onDragStop={(e, key, el, order) => this.categoryOrderChanged(order)}
                                                    onOrderChange={order => this.changeCategoryOrder(order, 3)}>
                                                    {categoryPanes[3]}
                                                </SortablePane>
                                            </div>
                                            {showWidgets ?
                                                <div className={"project__content" + (showWidgets ? "  " : " ")}>
                                                    {widgets ? (
                                                        <Fragment>
                                                            <Pane>
                                                                {this.state.widgetOrders[this.state.type][this.state.category].order.length > 0 ? (
                                                                    <div className="secondTabs project__select ui-state-default">
                                                                        <img src={dashBoardLogo} />
                                                                        <div className={"ui checkbox checkBoxGray300 count" + (currentCategoryChecked ? " checked" : "")}
                                                                            onClick={event => this.toggleCheckAll(this.state.type, this.state.category)}>
                                                                            <input name="CheckBox" type="checkbox" id="terms"
                                                                                tabIndex={2} className="hidden" checked={currentCategoryChecked} />
                                                                            <label />
                                                                        </div>
                                                                        <div className="project__title">
                                                                            <h3>
                                                                                {Resources["selectAll"][currentLanguage]}
                                                                            </h3>
                                                                        </div>
                                                                    </div>
                                                                ) : null}
                                                            </Pane>
                                                            {this.state.widgetOrders[this.state.type][this.state.category].order.length > 0 ? (
                                                                <SortablePane direction="vertical" order={orderhavePermission}
                                                                    onDragStop={(e, key, el, order) => this.widgetOrderChanged(order)}
                                                                    onOrderChange={order => this.changeWidgetCategoryOrder(order, 3, this.state.category)}>
                                                                    {widgets}
                                                                </SortablePane>
                                                            ) : null}
                                                        </Fragment>
                                                    ) : null}
                                                </div> : null}
                                        </div>
                                    ) : null}
                                </TabPanel>
                            </Tabs>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default DashBoard;

import React, { Component, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Widgets, WidgetsWithText } from './CounterWidget';
import {
    ChartWidgetsData,
    BarChartComp,
    PieChartComp,
    Britecharts,
} from './ChartsWidgets';
import { ThreeWidgetsData, ApprovedWidget } from './ThreeWidgets';
import DashBoard from './DashBoard';
import language from '../resources.json';
import Config from '../Services/Config';
import IndexedDb from '../IndexedDb';
import Details from './widgetsDetails';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import orderBy from 'lodash/orderBy';
import GroupedBarCahrtComponent from './ChartJsWidgets/GroupedBarChart';

let currentLanguage =
    localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');

class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabIndex: 0,
            chartData: ChartWidgetsData,
            threeWidgets: ThreeWidgetsData,
            viewDashBoard: false,
            widgets: [],
            generalCategories: [],
            counterCategories: [],
            chartCategories: [],
        };
    }

    componentDidMount() {
        this.getWidgets();
    }

    async getWidgets() {
        const data = orderBy(
            await IndexedDb.getSelectedWidgets(),
            'order',
            'asc',
        );

        const categoryOrder = await IndexedDb.getCategoryOrder();

        let widgets = '';

        if (data.length > 0) {
            widgets = map(
                groupBy(data, widget => widget.categoryId),
                (widgets, categoryId) => {
                    return {
                        typeId: Details.categories[categoryId].type,
                        categoryId: categoryId,
                        title: Details.categories[categoryId].title,
                        widgets,
                        order: categoryOrder[categoryId].order,
                    };
                },
            );
            widgets = orderBy(widgets, 'order', 'asc');
        } else {
            const getAllWidgets = await IndexedDb.getAll('widget');

            widgets = map(
                groupBy(getAllWidgets, widget => widget.categoryId),
                (widgets, categoryId) => {
                    return {
                        typeId: Details.categories[categoryId].type,
                        categoryId: categoryId,
                        title: Details.categories[categoryId].title,
                        widgets,
                        order: categoryOrder[categoryId].order,
                    };
                },
            );
        }

        const types = groupBy(mapValues(widgets), widget => widget.typeId);

        this.setState({
            generalCategories: types['1'] || [],
            counterCategories: types['2'] || [],
            chartCategories: types['3'] || [],
        });
    }

    renderWidget(widget, index) {
        debugger;
        if (Details.widgets[widget.title].props.type === 'threeWidget') {
            return (
                <ApprovedWidget
                    key={index + 'DIV'}
                    {...Details.widgets[widget.title]}
                    title={language[widget.title][currentLanguage]}
                />
            );
        } else if (Details.widgets[widget.title].props.type === 'twoWidget') {
            return (
                <WidgetsWithText
                    key={index + 'DIV'}
                    title={widget.title}
                    {...Details.widgets[widget.title]}
                />
            );
        } else if (Details.widgets[widget.title].props.type === 'oneWidget') {
            return (
                <Widgets
                    key={index + 'DIV'}
                    title={widget.title}
                    {...Details.widgets[widget.title]}
                />
            );
        } else if (Details.widgets[widget.title].props.type === 'pie') {
            return (
                <div
                    className="col-md-6"
                    align="center"
                    key={Details.widgets[widget.title].props.key + 'DIVPie'}>
                    <PieChartComp
                        key={Details.widgets[widget.title].props.key}
                        api={Details.widgets[widget.title].props.api}
                        y={Details.widgets[widget.title].props.y}
                        name={Details.widgets[widget.title].props.name}
                        title={language[widget.title][currentLanguage]}
                    />
                </div>
            );
        } else if (Details.widgets[widget.title].props.type === 'line') {
            return (
                <Fragment key={index + 'DIVBriteCharts'}>
                    <Britecharts
                        api={Details.widgets[widget.title].props.api}
                        datasets={
                            Details.widgets[widget.title].props.topicNames
                        }
                        title={language[widget.title][currentLanguage]}
                    />
                </Fragment>
            );
        } else if (
            Details.widgets[widget.title].props.type === 'column' &&
            Details.widgets[widget.title].props.multiSeries === 'yes'
        ) {
            return (
                <Fragment key={index + 'DIVBarChart'}>
                    <div className="col-md-6">
                        <GroupedBarCahrtComponent
                            api={Details.widgets[widget.title].props.api}
                            ukey={Details.widgets[widget.title].props.id}
                            categoryName={
                                Details.widgets[widget.title].props.catagName
                            }
                            name={Details.widgets[widget.title].props.name}
                            y={Details.widgets[widget.title].props.data}
                            title={language[widget.title][currentLanguage]}
                            stack={Details.widgets[widget.title].stack}
                            yTitle={
                                language[
                                    Details.widgets[widget.title].props.yTitle
                                ][currentLanguage]
                            }
                            barContent={
                                Details.widgets[widget.title].props.barContent
                                    ? Details.widgets[widget.title].props
                                          .barContent
                                    : []
                            }
                        />
                    </div>
                </Fragment>
            );
        } else {
            return (
                <Fragment key={index + 'DIVBarChart'}>
                    <div className="col-md-6">
                        <BarChartComp
                            api={Details.widgets[widget.title].props.api}
                            ukey={Details.widgets[widget.title].props.id}
                            categoryName={
                                Details.widgets[widget.title].props.catagName
                            }
                            name={Details.widgets[widget.title].props.name}
                            y={Details.widgets[widget.title].props.data}
                            title={language[widget.title][currentLanguage]}
                            stack={Details.widgets[widget.title].stack}
                            yTitle={
                                language[
                                    Details.widgets[widget.title].props.yTitle
                                ][currentLanguage]
                            }
                            multiSeries={
                                Details.widgets[widget.title].props.multiSeries
                            }
                            barContent={
                                Details.widgets[widget.title].props.barContent
                                    ? Details.widgets[widget.title].props
                                          .barContent
                                    : []
                            }
                        />
                    </div>
                </Fragment>
            );
        }
    }

    renderCategory(category, index) {
        return (
            <div className="SummeriesContainer" key={index}>
                <Fragment>
                    <h2
                        className={
                            'SummeriesTitle ' +
                            (category.title == 'mainAlerts' ? 'disNone' : '')
                        }>
                        {language[category.title][currentLanguage]}
                    </h2>
                    <div
                        className={
                            'SummeriesContainerContent ' +
                            (category.title == 'summaries' ||
                            category.title == 'Submittal' ||
                            category.title == 'communication'
                                ? ' numbersContainerContent'
                                : ' ')
                        }>
                        {category.widgets.map((widget, widgetIndex) => {
                            if (
                                widget.permission === 0 ||
                                Config.IsAllow(widget.permission)
                            ) {
                                return this.renderWidget(widget, widgetIndex);
                            }
                        })}
                    </div>
                </Fragment>
            </div>
        );
    }

    viewDashBoardHandler() {
        this.setState({
            viewDashBoard: !this.state.viewDashBoard,
        });
    }

    closeModal() {
        this.setState({
            viewDashBoard: false,
        });

        this.getWidgets();
    }

    onClickTabItem(tabIndex) {
        this.setState({
            tabIndex: tabIndex,
        });
    }

    render() {
        let contactName =
            localStorage.getItem('contactName') !== null
                ? localStorage.getItem('contactName')
                : 'Procoor User';
        return (
            <div className="customeTabs">
                <Tabs
                    selectedIndex={this.state.tabIndex}
                    onSelect={tabIndex => this.onClickTabItem(tabIndex)}>
                    <TabList>
                        <Tab>
                            <span className="subUlTitle">
                                {language['general'][currentLanguage]}
                            </span>
                        </Tab>
                        <Tab>
                            <span className="subUlTitle">
                                {language['counters'][currentLanguage]}
                            </span>
                        </Tab>
                        <Tab>
                            <span className="subUlTitle">
                                {language['chart'][currentLanguage]}
                            </span>
                        </Tab>
                    </TabList>
                    <div className="dashboard__name">
                        <h3 className="welcome-title">
                            {language['titleDashboard'][currentLanguage]} ,{' '}
                            {contactName}
                        </h3>
                        <button
                            className="primaryBtn-2 btn mediumBtn"
                            onClick={this.viewDashBoardHandler.bind(this)}>
                            {language['customize'][currentLanguage]}
                        </button>
                    </div>
                    <TabPanel>
                        {this.state.generalCategories.map((category, index) =>
                            this.renderCategory(category, index),
                        )}
                    </TabPanel>
                    <TabPanel>
                        {this.state.counterCategories.map((category, index) =>
                            this.renderCategory(category, index),
                        )}
                    </TabPanel>
                    <TabPanel className="App">
                        <div className="row charts__row">
                            {this.state.chartCategories.map((category, index) =>
                                this.renderCategory(category, index),
                            )}
                        </div>
                    </TabPanel>
                </Tabs>
                {this.state.viewDashBoard ? (
                    <DashBoard
                        opened={this.state.viewDashBoard}
                        closed={this.closeModal.bind(this)}
                    />
                ) : null}
            </div>
        );
    }
}

export default Index;

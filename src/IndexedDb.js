import lf from 'lovefield';
import WidgetStructure from './Componants/WidgetsDashBorad';
import WidgetsDashBoradProject from './Componants/WidgetsDashBoradProject';
import keyBy from 'lodash/keyBy';

const schemaBuilder = lf.schema.create('widgets', 1);
const schemaBuilderDashBoardProjects = lf.schema.create('widgetsDashBoardProjects', 1);
const cachedData = lf.schema.create('cachedAPI', 1);

let db = null;
let dbDashBoard = null;
let api = null;

const tables = {
    'widgetType': null,
    'widgetCategory': null,
    'widget': null,
    'projects': null,
    'companies': null,
    'defaultLists': null
};

const tableProjects = {
    'widgetCategory': null,
    'widget': null
}

export default class IndexedDb {
    static initialize() {
        schemaBuilder.createTable('WidgetType').
            addColumn('id', lf.Type.INTEGER).
            addColumn('title', lf.Type.STRING).
            addPrimaryKey(['id']);

        schemaBuilder.createTable('WidgetCategory').
            addColumn('id', lf.Type.INTEGER).
            addColumn('typeId', lf.Type.INTEGER).
            addForeignKey('fk_TypeId', {
                local: 'typeId',
                ref: 'WidgetType.id'
            }).
            addColumn('order', lf.Type.INTEGER).
            addColumn('title', lf.Type.STRING).
            addPrimaryKey(['id']);

        schemaBuilder.createTable('Widget').
            addColumn('id', lf.Type.INTEGER).
            addColumn('categoryId', lf.Type.INTEGER).
            addForeignKey('fk_CategoryId', {
                local: 'categoryId',
                ref: 'WidgetCategory.id'
            }).
            addColumn('title', lf.Type.STRING).
            addColumn('order', lf.Type.INTEGER).
            addColumn('permission', lf.Type.INTEGER).
            addColumn('checked', lf.Type.BOOLEAN).
            addColumn('type', lf.Type.STRING).
            addPrimaryKey(['id']);

    }

    static initializeCachedAPI() {
        cachedData.createTable('defaultLists').
            addColumn('value', lf.Type.INTEGER).
            addColumn('label', lf.Type.STRING).
            addColumn('listType', lf.Type.STRING).
            addPrimaryKey(['value']);

        cachedData.createTable('companies').
            addColumn('value', lf.Type.INTEGER).
            addColumn('label', lf.Type.STRING).
            addColumn('projectId', lf.Type.INTEGER).
            addNullable(['projectId']).
            addPrimaryKey(['value']);

        cachedData.createTable('projects').
            addColumn('value', lf.Type.INTEGER).
            addColumn('label', lf.Type.STRING).
            addPrimaryKey(['value']);

    }

    static initializeCounterDB() {
        schemaBuilderDashBoardProjects.createTable('WidgetCategory').
            addColumn('id', lf.Type.INTEGER).
            addColumn('order', lf.Type.INTEGER).
            addColumn('title', lf.Type.STRING).
            addPrimaryKey(['id']);

        schemaBuilderDashBoardProjects.createTable('Widget').
            addColumn('id', lf.Type.INTEGER).
            addColumn('categoryId', lf.Type.INTEGER).
            addForeignKey('fk_CategoryId', {
                local: 'categoryId',
                ref: 'WidgetCategory.id'
            }).
            addColumn('title', lf.Type.STRING).
            addColumn('order', lf.Type.INTEGER).
            addColumn('checked', lf.Type.BOOLEAN).
            addPrimaryKey(['id']);
    }

    static async seed() {
        dbDashBoard = await schemaBuilderDashBoardProjects.connect();
        db = await schemaBuilder.connect();
        api = await cachedData.connect();

        tables.widgetType = db.getSchema().table('WidgetType');
        tables.widgetCategory = db.getSchema().table('WidgetCategory');
        tables.widget = db.getSchema().table('Widget');
        tableProjects.widgetCategory = dbDashBoard.getSchema().table('WidgetCategory');
        tableProjects.widget = dbDashBoard.getSchema().table('Widget');

        tables.defaultLists = api.getSchema().table('defaultLists');
        tables.companies = api.getSchema().table('companies');
        tables.projects = api.getSchema().table('projects');

        let rows = await db.select().from(tables.widgetType).exec();

        if (rows.length === 0) {
            let widgetTypeRows = [tables.widgetType.createRow({
                'id': 1,
                'title': 'general'
            }), tables.widgetType.createRow({
                'id': 2,
                'title': 'counters'
            }), tables.widgetType.createRow({
                'id': 3,
                'title': 'chart'
            })];

            let widgetRows = [];

            let widgetCategoryRows = WidgetStructure.map((category, index) => {
                let id = index + 1;

                let category_order = +`${category.refrence + 1}${category.order}`;

                category.widgets.forEach((wid, widIndex) => {


                    let widRow = tables.widget.createRow({
                        'id': +`${id}${widIndex + 1}`,
                        'categoryId': id,
                        'title': wid.title,
                        'order': +`${category_order}${wid.order}`,
                        'permission': wid.permission,
                        'checked': wid.checked,
                        'type': wid.type
                    });

                    widgetRows.push(widRow);
                });

                return tables.widgetCategory.createRow({
                    'id': id,
                    'typeId': category.refrence + 1,
                    'title': category.widgetCategory,
                    'order': category_order
                });
            });

            await db.insertOrReplace().into(tables.widgetType).values(widgetTypeRows).exec();
            await db.insertOrReplace().into(tables.widgetCategory).values(widgetCategoryRows).exec();
            await db.insertOrReplace().into(tables.widget).values(widgetRows).exec();
        };
    }

    static async setData(mainColumn, value, label, tableName, data, params) {
        let rows = [];
        data.forEach((item) => {
            let widRow = tables[tableName].createRow({
                'value': item[value],
                'label': item[label],
                [mainColumn]: params
            });
            rows.push(widRow);
        });

        await api.insertOrReplace().into(tables[tableName]).values(rows).exec();

    }

    static deleteCacheData() {  
        var req = indexedDB.deleteDatabase('cachedAPI');
        req.onsuccess = function () {
            console.log("Deleted database successfully");
        };
        req.onerror = function () {
            console.log("Couldn't delete database");
        };
        req.onblocked = function () {
            console.log("Couldn't delete database due to the operation being blocked");
        }; 
 
    }

    static async GetCachedData(params, tableName, mainColumn) {
        if (tables[tableName] === null) {
            return [];
        }
        let rows = await api.select().from(tables[tableName])
            .where(tables[tableName][mainColumn].eq(params))
            .exec();

        return rows;
    }

    static async seedWidgetCounter() {
        let rows = await dbDashBoard.select().from(tableProjects.widgetCategory).exec();

        if (rows.length === 0) {

            let widgetRows = [];

            let widgetCategoryRows = WidgetsDashBoradProject.map((category, index) => {
                let id = index + 1;

                let category_order = +`${category.refrence + 1}${category.order}`;

                category.widgets.forEach((wid, widIndex) => {
                    let widRow = tableProjects.widget.createRow({
                        'id': +`${id}${widIndex + 1}`,
                        'categoryId': id,
                        'title': wid.title,
                        'order': +`${category_order}${wid.order}`,
                        'checked': wid.checked,
                        'type': wid.type
                    });

                    widgetRows.push(widRow);
                });

                return tableProjects.widgetCategory.createRow({
                    'id': id,
                    'title': category.widgetCategory,
                    'order': category_order
                });
            });

            await dbDashBoard.insertOrReplace().into(tableProjects.widgetCategory).values(widgetCategoryRows).exec();
            await dbDashBoard.insertOrReplace().into(tableProjects.widget).values(widgetRows).exec();
        };
    }

    static async getATypes() {
        let types = await db.select().from(tables.widgetType).exec();

        for (let index = 0; index < types.length; index++) {
            let type = types[index];

            type.categories = await db.select().from(tables.widgetCategory)
                .where(tables.widgetCategory.typeId.eq(type.id))
                .orderBy(tables.widgetCategory.order)
                .exec();

            for (let index2 = 0; index2 < type.categories.length; index2++) {
                let category = type.categories[index2];

                let widgets = await db.select().from(tables.widget)
                    .where(tables.widget.categoryId.eq(category.id))
                    .orderBy(tables.widget.order)
                    .exec();

                category.widgets = widgets;
            }
        }

        return types;
    }

    static async getById(table, id) {
        let data = await db.select().from(tables[table]).where(tables[table].categoryId.eq(id)).exec();

        return data;
    }

    static async getByTypeId(table, id) {
        let data = await db.select().from(tables[table]).where(tables[table].typeId.eq(id)).exec();

        return data;
    }

    static async getSelectedWidgets() {
        let data = await db.select().from(tables.widget).where(tables.widget.checked.eq(true)).exec();

        return data;
    }

    static async getSelectedDashBoardWidgets() {
        let data = await dbDashBoard.select().from(tableProjects.widget).where(tableProjects.widget.checked.eq(true)).exec();

        return data;
    }

    static async getCategoryOrder() {
        let data = await db.select().from(tables.widgetCategory).exec();

        data = data.map(category => ({ id: category.id, order: category.order }));

        return keyBy(data, category => category.id);
    }

    static async getDashBoardCategoryOrder() {
        let data = await dbDashBoard.select().from(tableProjects.widgetCategory).exec();

        data = data.map(category => ({ id: category.id, order: category.order }));

        return keyBy(data, category => category.id);
    }

    static async getAll(table) {
        let data = await db.select().from(tables[table]).exec();

        return data;
    }

    static async getAllDashBoradProject(table) {
        let data = await dbDashBoard.select().from(tableProjects[table]).exec();

        return data;
    }

    static async getDashBoardProjectCategoryOrder() {
        let data = await dbDashBoard.select().from(tableProjects.widgetCategory).exec();

        data = data.map(category => ({ id: category.id, order: category.order }));

        return keyBy(data, category => category.id);
    }

    static async getCategory() {

        let Category = await dbDashBoard.select().from(tableProjects.widgetCategory).exec();

        for (let index = 0; index < Category.length; index++) {

            let category = Category[index];

            let widgets = await dbDashBoard.select().from(tableProjects.widget).where(tableProjects.widget.categoryId.eq(category.id))
                .orderBy(tableProjects.widget.order).exec();

            category.widgets = widgets;
        }

        return Category;
    }

    static async update(table, id, params) {
        let query = db.update(tables[table]);

        Object.keys(params).forEach(key => {
            query.set(tables[table][key], params[key]);
        });

        return await query.where(tables[table].id.eq(id)).exec();
    }

    static async updateDashBoardProject(table, id, params) {
        let query = dbDashBoard.update(tableProjects[table]);

        Object.keys(params).forEach(key => {
            query.set(tableProjects[table][key], params[key]);
        });

        return await query.where(tableProjects[table].id.eq(id)).exec();
    }
} 
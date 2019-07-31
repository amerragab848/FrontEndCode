import lf from 'lovefield';
import WidgetStructure from './Componants/WidgetsDashBorad';
import keyBy from 'lodash/keyBy';

const schemaBuilder = lf.schema.create('widgets', 1);

let db = null;

const tables = {
    'widgetType': null,
    'widgetCategory': null,
    'widget': null
};

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
            addPrimaryKey(['id']);
    }

    static async seed() {
        db = await schemaBuilder.connect();

        tables.widgetType = db.getSchema().table('WidgetType');
        tables.widgetCategory = db.getSchema().table('WidgetCategory');
        tables.widget = db.getSchema().table('Widget');

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
                        'checked': wid.checked
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

    static async getTypes() {
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

    static async getCategoryOrder() {
        let data = await db.select().from(tables.widgetCategory).exec();

        data = data.map(category => ({ id: category.id, order: category.order }));

        return keyBy(data, category => category.id);
    }

    static async getAll(table) {
        let data = await db.select().from(tables[table]).exec();

        return data;
    }

    static async update(table, id, params) {
        let query = db.update(tables[table]);

        Object.keys(params).forEach(key => {
            query.set(tables[table][key], params[key]);
        });

        return await query.where(tables[table].id.eq(id)).
            exec();
    }
}
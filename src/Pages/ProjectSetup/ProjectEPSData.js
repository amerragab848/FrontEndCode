
import Resources from "../../resources.json"; 
let CurrProject = localStorage.getItem('lastSelectedProject')
let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

let ProjectEpsData = [
   
    { title: 'Area',
        ApiData: 'GetProjectStructuresByTypeByProjectId?projectId=' + CurrProject + '&type=1',
        ApiDelete: 'DeleteProjectStructures',
        ApiAdd: 'AddProjectStructures',
        ApiEdit: 'EditProjectStructures',
        ApiGetById: 'GetProjectStructuresById?id=',
        TypeId: 1,
        Columns: [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "titleEn",
                name: Resources["titleEn"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "titleAr",
                name: Resources["titleAr"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "projectName",
                name: Resources["projectName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }
        ],
        ApiFilter: 'GetFilterProjectStructure?',
        FilterColumns: [
            {
                field: "titleEn",
                name: "titleEn",
                type: "string",
                isCustom: true
            },
            {
                field: "titleAr",
                name: "titleAr",
                type: "string",
                isCustom: true
            }
        ],
        EditPermission: 3782,
        AddPermission: 3781,
        DeletePermission:3783,
        ViewPermission: 3784,
    },

    { title: 'Location',
        ApiData: 'GetProjectStructuresByType?type=2',
        ApiDelete: 'DeleteProjectStructures',
        ApiAdd: 'AddProjectStructures',
        ApiEdit: 'EditProjectStructures',
        ApiGetById: 'GetProjectStructuresById?id=',
        ApiDrop: 'FillProjectStructureForDrop?type=1',
        DropName: 'areaName',
        TypeId: 2,
        Columns: [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "titleEn",
                name: Resources["titleEn"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "titleAr",
                name: Resources["titleAr"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "parentName",
                name: Resources["areaName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ],

        ApiFilter: 'GetFilterProjectStructure?',
        FilterColumns: [
            {
                field: "titleEn",
                name: "titleEn",
                type: "string",
                isCustom: true
            },
            {
                field: "titleAr",
                name: "titleAr",
                type: "string",
                isCustom: true
            },
        ],
        EditPermission: 3786,
        AddPermission: 3785,
        DeletePermission: 3787,
        ViewPermission: 3788,
    },
    { title: 'Building',
        ApiData: 'GetProjectStructuresByType?type=3',
        ApiDelete: 'DeleteProjectStructures',
        ApiAdd: 'AddProjectStructures',
        ApiEdit: 'EditProjectStructures',
        ApiGetById: 'GetProjectStructuresById?id=',
        ApiDrop: 'FillProjectStructureForDrop?type=2',
        DropName: 'locationName',
        TypeId: 3,
        Columns: [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "titleEn",
                name: Resources["titleEn"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "titleAr",
                name: Resources["titleAr"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "parentName",
                name: Resources["locationName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ],

        ApiFilter: 'GetFilterProjectStructure?',
        FilterColumns: [
            {
                field: "titleEn",
                name: "titleEn",
                type: "string",
                isCustom: true
            },
            {
                field: "titleAr",
                name: "titleAr",
                type: "string",
                isCustom: true
            }
        ],
 
        EditPermission: 4010,
        AddPermission: 4009,
        DeletePermission: 4011,
        ViewPermission: 4012,
    },

    {  title: 'Unit',
        ApiData: 'GetProjectStructuresByType?type=4',
        ApiDelete: 'DeleteProjectStructures',
        ApiAdd: 'AddProjectStructures',
        ApiEdit: 'EditProjectStructures',
        ApiGetById: 'GetProjectStructuresById?id=',
        ApiDrop: 'FillProjectStructureForDrop?type=3',
        DropName: 'buildingName',
        TypeId: 4,
        Columns: [
            {
                key: "id",
                visible: false,
                width: 50,
                frozen: true
            },
            {
                key: "titleEn",
                name: Resources["titleEn"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            }, {
                key: "titleAr",
                name: Resources["titleAr"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
            {
                key: "parentName",
                name: Resources["buildingName"][currentLanguage],
                width: 250,
                draggable: true,
                sortable: true,
                resizable: true,
                filterable: true,
                sortDescendingFirst: true
            },
        ],

        ApiFilter: 'GetFilterProjectStructure?',
        FilterColumns: [
            {
                field: "titleEn",
                name: "titleEn",
                type: "string",
                isCustom: true
            },
            {
                field: "titleAr",
                name: "titleAr",
                type: "string",
                isCustom: true
            },
        ],
 
        EditPermission: 4014,
        AddPermission: 4013,
        DeletePermission: 4015,
        ViewPermission: 4016,
    },

]

export const SelectedProjectEps = (ProjectEpsTitle) => {
     let data = ProjectEpsData.filter(s => s.title === ProjectEpsTitle)
     return (data)
 }



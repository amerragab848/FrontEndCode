
let routes = [
    {
        route: 'Area',
        moduleId: "ProjectSetup",
        title: "area",
        nav: true,
        settings: {
            General: true,
            permission: 3784,
            caption: "procoor-icon-BIC",
            order: 8
        }
    },
    {
        route: "Location",
        moduleId: "ProjectSetup",
        title: "location",
        nav: true,
        settings: {
            General: true,
            permission: 3788,
            caption: "procoor-icon-BIC",
            order: 9
        }
    },
    {
        route: "Building",
        moduleId: "ProjectSetup",
        title: "Buildings",
        nav: true,
        settings: {
            General: true,
            permission: 4012,
            caption: "procoor-icon-BIC",
            order: 10
        }
    },
    {
        route: "Unit",
        moduleId: "ProjectSetup",
        title: "unit",
        nav: true,
        settings: {
            General: true,
            permission: 4016,
            caption: "procoor-icon-BIC",
            order: 11
        }
    },
    {
        route: "TaskGroups",
        moduleId: "CommonLog",
        title: "projectTaskGroups",
        nav: true,
        settings: {
            General: true,
            permission: 778,
            caption: "procoor-icon-task-groups"
        }
    }, {
        route: "ActionByAlerts",
        moduleId: "ActionByAlerts",
        title: "bicAlerts",
        nav: true,
        settings: {
            General: true,
            permission: 778,
            caption: "procoor-icon-task-groups"
        }
    },
]
export default routes

let routes = [
    {
        route: 'Area',
        moduleId: "ProjectEPSLog",
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
        moduleId: "ProjectEPSLog",
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
        moduleId: "ProjectEPSLog",
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
        moduleId: "ProjectEPSLog",
        title: "unit",
        nav: true,
        settings: {
            General: true,
            permission: 4016,
            caption: "procoor-icon-BIC",
            order: 11
        }
    }
]
export default routes
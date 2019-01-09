/*SideNav Scroll Functions*/
var sodebar,
    StickySidebar;
var sidebar = new StickySidebar('#sidebar', {
    innerWrapperSelector: '.sidebar__inner',
    topSpacing: 0,
    bottomSpacing: 72
});
sidebar.updateSticky();


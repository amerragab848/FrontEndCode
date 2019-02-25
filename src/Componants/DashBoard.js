import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; 
import { SortablePane, Pane } from "react-sortable-pane"; 
import "react-sortable-tree/style.css";
import Rodal from "../Styles/js/rodal";
import "../Styles/css/rodal.css";
import dashBoardLogo from "../Styles/images/dashboardDots.png";
import widgets from "./WidgetsDashBorad";
import Resources from "../resources.json";

let currentLanguage = localStorage.getItem("lang") == null ? "en" : localStorage.getItem("lang");

class DashBoard extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      dashBoardIndex: 0,  
      viewDashBoard: false,
      checked_parent_widgets: {},
      checked_child_widgets: {},
      viewSub: false,
      viewMenu: 0,
      isLoading: false,
      viewChild: false,
      currentChild:0, 
      lastOrderChild:[]  
    };

    let current_order = this.getFromLS('parent_widgets_order') || [];
    let checked_parent_widgets = this.getFromLS('checked_parent_widgets') || {};
    
    if(current_order.length===0 && checked_parent_widgets){ 
      var setWidget=[{"Ref0":[],"Ref1":[],"Ref2":[]}]; 
      var setCheckWidget= {"Ref0":{},"Ref1":{},"Ref2":{}} ; 
      this.saveToLS('parent_widgets_order', setWidget); 
      this.saveToLS('checked_parent_widgets', setCheckWidget);  
   } 
  };

  componentWillMount() {
  
      let original_widgets = [...widgets]; 

      var refrence0 = original_widgets.filter(function(i) {
        return i.refrence === 1;
      });

      var refrence1 = original_widgets.filter(function(i) {
        return i.refrence === 2;
      });

      var refrence2 = original_widgets.filter(function(i) {
        return i.refrence === 3;
      });

      let current_order = this.getFromLS('parent_widgets_order') || [];

      let checked_parent_widgets = this.getFromLS('checked_parent_widgets') || {};  
      
      let checked_child_widgets = this.getFromLS('checked_child_widgets') || []; 

      let updated_state = {
          refrence0,
          refrence1,
          refrence2,
          widgets: original_widgets,
          checked_parent_widgets, 
          checked_child_widgets,
          parent_widgets_order_Ref1: [],
          parent_widgets_order_Ref2: [],
          parent_widgets_order_Ref3: []
      };

      if (current_order && current_order.length) {
        
        if(current_order[0]["Ref0"].length > 0) { 
             updated_state.parent_widgets_order_Ref1 = current_order[0]["Ref0"];
        }else{
          updated_state.refrence0.forEach((widget) => {
            updated_state.parent_widgets_order_Ref1.push(widget.key.toString());
         });
        }

        if(current_order[0]["Ref1"].length > 0) { ;
             updated_state.parent_widgets_order_Ref2 = current_order[0]["Ref1"];
        }else{
          updated_state.refrence1.forEach((widget) => {
            updated_state.parent_widgets_order_Ref2.push(widget.key.toString());
         });
        }

        if(current_order[0]["Ref2"].length > 0) {  
             updated_state.parent_widgets_order_Ref3 = current_order[0]["Ref2"]
        }else{
          updated_state.refrence2.forEach((widget) => {
            updated_state.parent_widgets_order_Ref3.push(widget.key.toString());
         });
        } 
      } 
 
      this.setState(updated_state);
  };
 
  onClickTabItem(tabIndex){
    this.setState({
      dashBoardIndex:tabIndex,
      viewChild:false
    });
  }
 
  closeModal() {
    this.setState({
      viewDashBoard: false
    });
  };

  viewCurrentMenu(index) { 

    let current_Child_order = this.getFromLS('child_widgets_order') || [];
 
    let checkOrder = 0;

    if(current_Child_order.length > 1)
    {  
      current_Child_order.forEach((item) => { 
        if(item[index]){
          this.setState({
            lastOrderChild:item[index],
            viewChild:true,
            currentChild:index
          });  
          checkOrder++;
        } 
      }); 
    }
 
    if(checkOrder===0){

      let getOrderChild =  this.state.widgets.find(function(i){
        return i.key === index;
      });

      let order=[];

      getOrderChild.widgets.forEach((item) => { 
        order.push(item.key);
      });  

      if(getOrderChild){
        this.setState({ 
          lastOrderChild:order,
          viewChild:true,
          currentChild:index
        });  
      }
    } 
  };

  saveToLS (key, value) {
      if (global.localStorage) {
          global.localStorage.setItem(key, JSON.stringify(value));
      }
  };

  getFromLS(key) {
      let ls = {};
      if (global.localStorage) {
          try {
              ls = JSON.parse(global.localStorage.getItem(key)) || "";
          } catch (e) { 
          }
      }
      return ls;
  };
 
  toggleParentCheck (event, id, index) {
 
    let checked_parent_widgets = Object.assign({}, this.state.checked_parent_widgets);

    let ref = "Ref"+this.state.dashBoardIndex;
 
      let updated_state = {checked_parent_widgets};
      
      if (updated_state.checked_parent_widgets[ref][id]) {
          delete checked_parent_widgets[ref][id];
      } else {
        checked_parent_widgets[ref][id] = true;
      } 

      this.saveToLS('checked_parent_widgets', checked_parent_widgets);

      updated_state.checked_parent_widgets = checked_parent_widgets;

      this.setState(updated_state);
 
  };

  toggleChildCheck (event, id) {

    var getfirstKey = id.split("-"); 
  
    getfirstKey = getfirstKey[0] +"-"+ getfirstKey[1];
 
    let checked_child_widgets = this.getFromLS('checked_child_widgets') || [];
 
      let updated_state = {checked_child_widgets}; 

      let isExist = 0;

      if(checked_child_widgets.length>0)
      {
        checked_child_widgets.forEach((key) => {
  
          if (Object.keys(key)[0] === getfirstKey) { 
            
            let exist = key[getfirstKey].findIndex(function(i){
              return Object.keys(i)[0] === id;
            });

            if(exist === -1){ 
              var childObj={};
              childObj[id]=true; 
               key[getfirstKey].push(childObj);         
            }else{  
            
              let index = key[getfirstKey].findIndex(function(i){
                return Object.keys(i)[0] === id;
              }); 

              key[getfirstKey].splice(index,1);
            }

            isExist++;
        } 
     });
    }

     if(isExist===0){ 
        var obj={};
        var childObj={};
        childObj[id]=true;
        obj[getfirstKey]=[childObj];
        checked_child_widgets.push(obj); 
     }

      this.saveToLS('checked_child_widgets', checked_child_widgets);

      updated_state.checked_child_widgets = checked_child_widgets;

      this.setState(updated_state); 
  
  };

  // order Parent Widget
  parentChageOrder(order) {
  
    let current_order = this.getFromLS('parent_widgets_order') 

    if(this.state.dashBoardIndex === 0){ 
      if(current_order&&current_order.length){ 
        current_order[0]["Ref0"]=order; 
        this.setState({parent_widgets_order_Ref1: order });
      }  
    }if(this.state.dashBoardIndex === 1){ 
      if(current_order&&current_order.length){
         current_order[0]["Ref1"]=order; 
         this.setState({ parent_widgets_order_Ref2 :order });
      }   
    }else if(this.state.dashBoardIndex === 2){ 
      if(current_order&&current_order.length){
       current_order[0]["Ref2"]=order; 
       this.setState({parent_widgets_order_Ref3: order });
      }  
    } 
 
    this.saveToLS('parent_widgets_order', current_order);  
  };

  ChildchageOrder(order) {

    var getfirstKey = order[0].split("-"); 
  
    getfirstKey=getfirstKey[0] +"-"+ getfirstKey[1];
    
    let current_Child_order = this.getFromLS('child_widgets_order') || [];

    if(current_Child_order.length){
     let index = 0;
      current_Child_order.forEach((item) => { 
        if(item[getfirstKey]){
          item[getfirstKey] = order
          index ++;  
        } 
      });

      if(index === 0) {
        var obj = {};
        obj[getfirstKey] = order; 
        current_Child_order.push(obj);
        this.saveToLS('child_widgets_order', current_Child_order); 
      }else{
        this.saveToLS('child_widgets_order', current_Child_order); 
      }
    }
    else{
      var obj = {};
      obj[getfirstKey] = order;
      current_Child_order.push(obj);
      this.saveToLS('child_widgets_order', current_Child_order); 
    } 

    this.setState({
      lastOrderChild:order
    }); 
  };

  renderChildChecked(widget)
  {
    let renderChecked ="";

    if(widget){

    let parentKey = widget.key.split("-");

    parentKey = parentKey[0]+"-"+parentKey[1]

    let checked_child_widgets = this.getFromLS('checked_child_widgets') || [];
 
    let getParent =  checked_child_widgets.find(function(i){
      return Object.keys(i)[0] === parentKey;
    }); 

      if(getParent)
      {
        let isExist = getParent[parentKey].filter(function(i){
          return Object.keys(i)[0] === widget.key;
        }); 

        if(isExist.length > 0){
          renderChecked =   <div className= "ui checkbox checkBoxGray300 count checked"
                              onClick={event => this.toggleChildCheck(event, widget.key)}>
                            <input name="CheckBox" type="checkbox"  id="terms" tabIndex="0" className="hidden"  checked={isExist[0][widget.key]} />
                            <label />
                            </div> 
        }else{
          renderChecked = <div className= "ui checkbox checkBoxGray300 count"
                          onClick={event => this.toggleChildCheck(event, widget.key)}>
                          <input name="CheckBox" type="checkbox" id="terms" tabIndex="0" className="hidden"  checked={false}/>
                          <label />
                          </div>
        }
      }else{
        //يرسم من غير اختيار
        renderChecked = <div className= "ui checkbox checkBoxGray300 count"
                        onClick={event => this.toggleChildCheck(event, widget.key)}>
                        <input name="CheckBox" type="checkbox" id="terms" tabIndex="0" className="hidden" checked={false} />
                        <label />
                    </div>
      }
      }else{
                //يرسم من غير اختيار
            renderChecked = <div className= "ui checkbox checkBoxGray300 count"
                              onClick={event => this.toggleChildCheck(event, widget.key)}>
                              <input name="CheckBox" type="checkbox" id="terms" tabIndex="0" className="hidden" checked={false} />
                              <label />
                            </div>
      } 

   return renderChecked;
  }

  render() { 

    let checked_parent_widgets= Object.assign({}, this.state.checked_parent_widgets);
  
    let data = ("refrence"+this.state.dashBoardIndex);

    let ref = ("Ref"+this.state.dashBoardIndex);
     
    var pane = this.state[data].map((widget, index) => { 
        return (
          <Pane key={widget.key} defaultSize={{ width: '50%'}} resizable={{ x: false, y: false, xy: false }}>
            <div className="secondTabs project__select ui-state-default">
              <img src={dashBoardLogo} />
              <div className={checked_parent_widgets[ref][widget.key] ? "ui checkbox checkBoxGray300 count checked" : "ui checkbox checkBoxGray300 count"}
                onClick={event => this.toggleParentCheck(event, widget.key, index)}>
                <input name="CheckBox" type="checkbox" id="terms" tabIndex="0" className="hidden" checked={checked_parent_widgets[ref][widget.key]} />
                <label />
              </div>
              <div className="project__title" onClick={() => this.viewCurrentMenu(widget.key)}>
                <h3>{Resources[widget.widgetCategory][currentLanguage]}</h3>
              </div>
            </div>
          </Pane>
        ); 
    })
 
    var paneChild ="";

    if(this.state.viewChild){
 
      let key = this.state.currentChild;

      let getParent =  this.state.widgets.find(function(i){
        return i.key === key;
      });

      paneChild = getParent.widgets.map((widget, index) => { 
        return (
          <Pane key={widget.key} defaultSize={{ width: '50%'}} resizable={{ x: false, y: false, xy: false }}>
            <div className="secondTabs project__select ui-state-default">
              <img src={dashBoardLogo} />
                  {   
                    this.renderChildChecked(widget) 
                  } 
              <div className="project__title">
                <h3>{Resources[widget.title][currentLanguage]}</h3>
              </div>
            </div>
          </Pane>
        ); 
     })
    }
 
    return (
      <div className="customeTabs">
        <Rodal visible={this.props.opened} onClose={this.props.closed}>
          <div className="dashboard__modal">
            <div className="dashboard__container">
              <div className="modalTitle">
                <h2>Dashboard center</h2>
              </div>
              <Tabs className="dashboard__Project" selectedIndex={this.state.dashBoardIndex} onSelect={dashBoardIndex => this.onClickTabItem(dashBoardIndex)}>
                <div className="project__tabs subitTabs">
                  <TabList className="zero dashDragCustom">
                    <Tab>
                      <span className="subUlTitle">{Resources["general"][currentLanguage]}</span>
                    </Tab>
                    <Tab>
                      <span className="subUlTitle">{Resources["counters"][currentLanguage]}</span>
                    </Tab>
                    <Tab>
                      <span className="subUlTitle">{Resources["projectsLogs"][currentLanguage]}</span>
                    </Tab>
                  </TabList>
                </div>
                <TabPanel>
                  <div className="dash__content ui tab active">
                    <div className="project__content">
                      <SortablePane  direction="vertical" order={this.state.parent_widgets_order_Ref1}  onOrderChange={order => this.parentChageOrder(order)}>
                        {pane}
                      </SortablePane>   
                    </div>  
                    <div className="project__content">
                      {this.state.viewChild?
                       <SortablePane  direction="vertical" order={this.state.lastOrderChild} onOrderChange={order => this.ChildchageOrder(order)}>
                          {paneChild}
                        </SortablePane>:null}
                    </div>  
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="dash__content ui tab active">
                    <div className="project__content">
                      <SortablePane direction="vertical" order={this.state.parent_widgets_order_Ref2} onOrderChange={order => this.parentChageOrder(order)}>
                      {pane}
                      </SortablePane>  
                    </div> 
                    <div className="project__content">
                    {this.state.viewChild?
                       <SortablePane  direction="vertical" order={this.state.lastOrderChild} onOrderChange={order => this.ChildchageOrder(order)}>
                          {paneChild}
                        </SortablePane>:null}
                    </div>   
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="dash__content ui tab active">
                    <div className="project__content">
                      <SortablePane  direction="vertical" order={this.state.parent_widgets_order_Ref3} onOrderChange={order => this.parentChageOrder(order)}>
                      {pane}
                      </SortablePane>  
                    </div>  
                    <div className="project__content">
                    {this.state.viewChild?
                       <SortablePane  direction="vertical"  order={this.state.lastOrderChild} onOrderChange={order => this.ChildchageOrder(order)}>
                          {paneChild}
                        </SortablePane>:null}
                    </div>  
                  </div>
                </TabPanel> 
              </Tabs>
            </div>
          </div>
        </Rodal>
      </div>
    );
  }
}

export default DashBoard;

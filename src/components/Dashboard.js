import React, { Component } from "react";

import Loading from "./Loading";
import Panel from "./Panel";

import classnames from "classnames";

//fake data for the panels
const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {
  state = { 
    loading: false,
    focused: null
   };

   //to select a specific panel
  //  selectPanel(id) {
  //   this.setState({
  //    focused: id
  //   });
  //  }

  selectPanel(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
     });
    

    if(this.state.loading) {
      return <Loading />
    }

    //map over the data to create a Panel component for each of them
    const panels = data
    .filter(
      panel => this.state.focused === null || this.state.focused === panel.id
     )
    .map(panel=> (
      <Panel
        key={panel.id}
        id={panel.id}
        label={panel.label} 
        value={panel.value}
        // onSelect={this.selectPanel}
        onSelect={event => this.selectPanel(panel.id)}
      />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
    
  }
}

export default Dashboard;

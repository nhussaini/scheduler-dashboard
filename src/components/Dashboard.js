import React, { Component } from "react";
import axios from "axios";

import Loading from "./Loading";
import Panel from "./Panel";

import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";

 import { setInterview } from "helpers/reducers";

import classnames from "classnames";

//fake data for the panels
const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {

  //state object
  state = { 
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers:{}
   };

   //to select a specific panel
  //  selectPanel(id) {
  //   this.setState({
  //    focused: id
  //   });
  //  }

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    //using axios, make requests to the API end points
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });

    //WebSockets--new instance variable for websocket connection
    this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    //converts the string data to js data types
    this.socket.onmessage = event => {
      const data = JSON.parse(event.data);
    
      if (typeof data === "object" && data.type === "SET_INTERVIEW") {
        this.setState(previousState =>
          setInterview(previousState, data.id, data.interview)
        );
      }
    };

  }

  //close the connection for the websocket
  componentWillUnmount() {
    this.socket.close();
  }

  

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

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
        // value={panel.value}
        value={panel.getValue(this.state)}
        // onSelect={this.selectPanel}
        onSelect={event => this.selectPanel(panel.id)}
      />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
    
  }
}

export default Dashboard;

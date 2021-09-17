import React from "react";
import "../App.css";

const APODDate = (props) => {
  var dt = new Date();
  var day = dt.getDate() - props;
  var month = dt.getMonth() + 1;
  var year = dt.getFullYear();
  var daysInMonth = new Date(year, month, 0).getDate();
  if (day < 0) {
    day += daysInMonth;
  }
};

export default APODDate;

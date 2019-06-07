/*
Controller for clock/time webapp
Jiahua Chen, based off Eric Li's original design
Last updated 24 Feb 2019
*/

// Gets the current date and time
var d = new Date();
// var d = new Date(2019,2,5,15,13,03,0);
// console.log(" *** d.getDate() " + d.getDate());
// console.log(" *** d.getMonth() " + d.getMonth());
// console.log(" *** dayType noClassSats" + i);

function updateD() {
  d = new Date();
}

// Gets the classification of the date, and returns 0 if it is a normal day. Also contains dictionaries for special days.
function dayType() {
  // Defines the special days
  var onbreak = true;
  var specialDays = [new calDay(3, 8), new calDay(4, 25)]; // <- For special event days
  var noClassSats = [new calDay(4, 20), new calDay(5, 4), new calDay(5, 18)]; // <- For days without Saturday classes
  var noClasses = [new calDay(4, 22), new calDay(5, 18), new calDay(5, 27), new calDay(6, 1)]; // <- For days without classes, or breaks
  var holiday = []; // <- For holidays

  for (i = 0; i < specialDays.length; i++) {
    if (specialDays[i].month == d.getMonth() && specialDays[i].date == d.getDate()) {
      return 1;
    }
    // console.log(" *** specialDays[i].month " + specialDays[i].month);
    // console.log(" *** specialDays[i].date " + specialDays[i].date);
    // console.log(" *** dayType specialDays " + i);
  }

  for (i = 0; i < noClassSats.length; i++) {
    if (noClassSats[i].month == d.getMonth() && noClassSats[i].date == d.getDate()) {
      return 2;
    }
    // console.log(" *** dayType noClassSats " + i);
  }

  for (i = 0; i < noClasses.length; i++) {
    if (noClasses[i].month == d.getMonth() && noClasses[i].date == d.getDate()) {
      return 3;
    }
    // console.log(" *** dayType noClasses " + i);
  }

  for (i = 0; i < holiday.length; i++) {
    if (holiday[i].month == d.getMonth() && holiday[i].date == d.getDate()) {
      return 4;
    }
    // console.log(" *** dayType holiday " + i);
  }

  if (onbreak) {
    return 5;
  } else {
    return 0;
  }
}

function loadTime() {
  // Adjusts into AM and PM time
  var hr = ((d.getHours() + 11) % 12 + 1);
  var sufx = (d.getHours() >= 12) ? 'PM' : 'AM';

  // Outputs to HTML
  document.getElementById("clock").innerHTML = hr + ":" + ("0" + d.getMinutes()).slice(-2) + " " + sufx;
}

function loadDate() {
  // Dictionary for text-based date
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Outputs to HTML
  document.getElementById("date").innerHTML = days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

// Below mostly code from Eric Li '13

// Defines a period
function period(title, startHr, startMin, endHr, endMin) {
  this.title = title;
  this.startHr = startHr;
  this.startMin = startMin;
  this.startRaw = startHr * 3600 + startMin * 60;
  // console.log(" *** startRaw " + this.startRaw);
  // this.start = new Date(0,0,0,startHr,startMin,0,0);
  this.endHr = endHr;
  this.endMin = endMin;
  this.endRaw = endHr * 3600 + endMin * 60;
  // this.end = new Date(0,0,0,endHr,endMin,0,0);
}

function calDay(month, date) {
  this.date = date;
  // console.log(this.date);
  this.month = month - 1;
  // console.log(this.month);
}

// Updates the clock messages
function update() {
  // Stores the dayType
  var type = dayType();
  // Debug ***
  // console.log(type);
  // Checks for special days
  if (type == 1) {
    specialSchedule();
  } else if (type == 2) {
    noClassSat();
  } else if (type == 3) {
    noClasses();
  } else if (type == 4) {
    holiday();
  } else if (type == 5) {
    schoolBreak();
  } else if (type == 0) {
    // console.log(" *** Is normal day");
    // Gets today's schedule
    var currentSchedule = getSchedule();
    // console.log(" *** currentSchedule " + currentSchedule.length);

    // Checks which period it currently is
    for (i = 0; i < currentSchedule.length; i++) {
      // console.log(" *** for i " + i);
      // console.log(" *** parseRaw " + parseRaw());

      if (parseRaw() < currentSchedule[0].startRaw) {
        beforeSchool(currentSchedule[0].title, currentSchedule[0].startRaw - parseRaw());
      }

      if (currentSchedule[i].startRaw < parseRaw() && parseRaw() < currentSchedule[i].endRaw) {
        // console.log(" *** currentSchedule[i].startRaw " + currentSchedule[i].startRaw);
        if (currentSchedule[i].title == "Passing Period") {
          normalDay(currentSchedule[i].title, currentSchedule[i].endRaw - parseRaw(), currentSchedule[i + 1].title, currentSchedule[i + 1].startRaw - parseRaw());
        } else {
          normalDay(currentSchedule[i].title, currentSchedule[i].endRaw - parseRaw(), currentSchedule[i + 2].title, currentSchedule[i + 2].startRaw - parseRaw());
        }
      }
      if (parseRaw() > currentSchedule[currentSchedule.length - 1].endRaw) {
        document.getElementById("currentEvent").innerHTML = "Have a nice day!";
        document.getElementById("nextEvent").innerHTML = "";
      }
    }
  } else {}
}

// Gets the right schedule for a regular class day
function getSchedule() {
  // console.log(" *** d.getDate() " + d.getDay());
  var weekday = d.getDay();

  // Defines the currentSchedule array
  var currentSchedule = new Array();

  // Assigns class schedules for weekday scenarios
  if (weekday == 1 || weekday == 4) {
    currentSchedule[0] = new period("Period 1", 8, 30, 9, 15);
    currentSchedule[1] = new period("Passing Period", 9, 15, 9, 20);
    currentSchedule[2] = new period("Period 2", 9, 20, 10, 5);
    currentSchedule[3] = new period("Passing Period", 10, 5, 10, 10);
    currentSchedule[4] = new period("Chapel / Class Meeting", 10, 10, 10, 35);
    currentSchedule[5] = new period("Passing Period", 10, 35, 10, 40);
    currentSchedule[6] = new period("Period 3", 10, 40, 11, 20);
    currentSchedule[7] = new period("Passing Period", 11, 20, 11, 25);
    currentSchedule[8] = new period("Period 4", 11, 25, 12, 5);
    currentSchedule[9] = new period("Passing Period", 12, 5, 12, 10);
    currentSchedule[10] = new period("Period 5A", 12, 10, 12, 55);
    currentSchedule[11] = new period("Lunch Bell", 12, 55, 12, 55);
    currentSchedule[12] = new period("Period 5B", 12, 55, 13, 40);
    currentSchedule[13] = new period("Passing Period", 13, 40, 13, 45);
    currentSchedule[14] = new period("Period 6", 13, 45, 14, 30);
    currentSchedule[15] = new period("Passing Period", 14, 30, 14, 35);
    currentSchedule[16] = new period("Period 7", 14, 35, 15, 20);
    currentSchedule[17] = new period("end of school", 15, 20, 15, 20);
    currentSchedule[18] = new period("end of school", 15, 20, 15, 20);
  } else if (weekday == 2 || weekday == 5) {
    currentSchedule[0] = new period("Period 1", 8, 30, 9, 10);
    currentSchedule[1] = new period("Passing Period", 9, 10, 9, 15);
    currentSchedule[2] = new period("Period 2", 9, 15, 9, 55);
    currentSchedule[3] = new period("Passing Period", 9, 55, 10, 00);
    currentSchedule[4] = new period("Auditorium", 10, 00, 10, 35);
    currentSchedule[5] = new period("Passing Period", 10, 35, 10, 40);
    currentSchedule[6] = new period("Period 3", 10, 40, 11, 20);
    currentSchedule[7] = new period("Passing Period", 11, 20, 11, 25);
    currentSchedule[8] = new period("Period 4", 11, 25, 12, 5);
    currentSchedule[9] = new period("Passing Period", 12, 5, 12, 10);
    currentSchedule[10] = new period("Period 5A", 12, 10, 12, 55);
    currentSchedule[11] = new period("Lunch Bell", 12, 55, 12, 55);
    currentSchedule[12] = new period("Period 5B", 12, 55, 13, 40);
    currentSchedule[13] = new period("Passing Period", 13, 40, 13, 45);
    currentSchedule[14] = new period("Period 6", 13, 45, 14, 30);
    currentSchedule[15] = new period("Passing Period", 14, 30, 14, 35);
    currentSchedule[16] = new period("Period 7", 14, 35, 15, 20);
    currentSchedule[17] = new period("end of school", 15, 20, 15, 20);
    currentSchedule[18] = new period("end of school", 15, 20, 15, 20);
  } else if (weekday == 3) {
    currentSchedule[0] = new period("Period 1", 8, 50, 9, 35);
    currentSchedule[1] = new period("Passing Period", 9, 35, 9, 40);
    currentSchedule[2] = new period("Period 2", 9, 40, 10, 25);
    currentSchedule[3] = new period("Passing Period", 10, 25, 10, 30);
    currentSchedule[4] = new period("Advisory", 10, 30, 10, 45);
    currentSchedule[5] = new period("Passing Period", 10, 45, 10, 50);
    currentSchedule[6] = new period("Period 3", 10, 50, 11, 30);
    currentSchedule[7] = new period("Passing Period", 11, 30, 11, 35);
    currentSchedule[8] = new period("Period 4", 11, 35, 12, 15);
    currentSchedule[9] = new period("end of school", 12, 15, 12, 15);
    currentSchedule[10] = new period("end of school", 12, 15, 12, 15);
  } else if (weekday == 6) {
    currentSchedule[0] = new period("Period 1", 8, 30, 9, 15);
    currentSchedule[1] = new period("Passing Period", 9, 15, 9, 20);
    currentSchedule[2] = new period("Period 2", 9, 20, 10, 5);
    currentSchedule[3] = new period("Break", 10, 5, 10, 20);
    currentSchedule[4] = new period("Period 3", 10, 20, 11, 5);
    currentSchedule[5] = new period("Passing Period", 11, 5, 11, 10);
    currentSchedule[6] = new period("Period 4", 11, 10, 11, 55);
    currentSchedule[7] = new period("end of school", 11, 55, 11, 55);
    currentSchedule[8] = new period("end of school", 11, 55, 11, 55);
  } else {
    noClasses();
  }
  return currentSchedule;
}

function specialSchedule() // <- What to print during special schedules
{
  document.getElementById("currentEvent").innerHTML = "There is a special schedule today.";
  document.getElementById("nextEvent").innerHTML = "Please consult your planner for details.";
}

function noClassSat() // <- What to print for no-class Saturdays
{
  document.getElementById("currentEvent").innerHTML = "There are no classes today.";
  document.getElementById("nextEvent").innerHTML = " Enjoy your actual weekend!";
}

function noClasses() // <- What to print when no classes
{
  document.getElementById("currentEvent").innerHTML = "There are no classes today.";
  document.getElementById("nextEvent").innerHTML = " Enjoy the day off!";
}

function holiday() // <- What to print during holidays
{
  document.getElementById("currentEvent").innerHTML = "Enjoy your holiday!";
  document.getElementById("nextEvent").innerHTML = "";
}

function schoolBreak() // <- What to print during school breaks
{
  document.getElementById("currentEvent").innerHTML = "Enjoy your break!";
  document.getElementById("nextEvent").innerHTML = "";
}

function normalDay(nowTitle, nowDiff, nextTitle, nextDiff) // <- What to print during normal days
{
  document.getElementById("currentEvent").innerHTML = "<b>" + nowTitle + "</b> ends in <b>" + rawToString(nowDiff) + "</b>.";
  document.getElementById("nextEvent").innerHTML = "It will be <b>" + nextTitle + "</b> in <b>" + rawToString(nextDiff) + "</b>.";
}

function beforeSchool(title, time) {
  document.getElementById("currentEvent").innerHTML = "";
  document.getElementById("nextEvent").innerHTML = "<b>" + title + "</b> starts in <b>" + rawToString(time) + "</b>.";
}

function parseRaw() {
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
}

function toMins(raw) {
  return Math.floor((raw % 3600) / 60);
}

function toHrs(raw) {
  return Math.floor(raw / 3600);
}

function toSecs(raw) {
  return (raw % 60);
}

var showSeconds = false;
function toggleSecond()
{
  if (!showSeconds) {
    showSeconds = true;
    document.getElementById("secondtoggle").innerHTML = "Hide Seconds";
  }
  else {
    showSeconds = false;
    document.getElementById("secondtoggle").innerHTML = "Show Seconds";
  }
}

function rawToString(raw) {
  var output = "";

  if (toHrs(raw) == 0) {} else if (toHrs(raw) == 1) {
    output += toHrs(raw) + " hour ";
  } else {
    output += toHrs(raw) + " hours ";
  }

  if (showSeconds) {
    if (toMins(raw) == 0) {
      if (toSecs(raw) == 1) {
        output += toSecs(raw) + " second";
      } else {
        output += toSecs(raw) + " seconds";
      }
    } else if (toMins(raw) == 1) {
      output += toMins(raw) + " minute ";
      if (toSecs(raw) == 1) {
        output += toSecs(raw) + " second";
      } else {
        output += toSecs(raw) + " seconds";
      }
    } else {
      output += toMins(raw) + " minutes ";
      if (toSecs(raw) == 1) {
        output += toSecs(raw) + " second";
      } else {
        output += toSecs(raw) + " seconds";
      }
    }
  } else {
    var ceilMins = toMins(raw) + 1;
    if (toMins(raw) == 0) {
      output += ceilMins + " minute";
    } else {
      output += ceilMins + " minutes";
    }
  }
  return output;
}

setInterval(loadTime, 1000);
setInterval(loadDate, 1000);
setInterval(updateD, 1000);
setInterval(update, 1000);

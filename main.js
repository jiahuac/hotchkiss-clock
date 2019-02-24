/*
Controller for clock/time webapp
Jiahua Chen, based off Eric Li's original design
Last updated 22 Feb 2019
*/

// Gets the current date and time
var d = new Date();
// var d = new Date(2019,1,4,12,55,01,0);
// console.log(" *** d.getDate() " + d.getDate());
// console.log(" *** d.getMonth() " + d.getMonth());
// console.log(" *** dayType noClassSats" + i);

function updateD()
{
	d = new Date();
}

// Gets the classification of the date, and returns 0 if it is a normal day. Also contains dictionaries for special days.
function dayType()
{
	// Defines the special days
	var specialDays = [new calDay(1,1), new calDay(2,22)];
	var noClassSats = [new calDay(2,1)];
	var noClasses = [new calDay(3,1)];
	var holiday = [new calDay(2,19)];

	for (i = 0; i < specialDays.length; i++)
	{
		if (specialDays[i].month == d.getMonth() && specialDays[i].date == d.getDate()) { return 1; }
		// console.log(" *** specialDays[i].month " + specialDays[i].month);
		// console.log(" *** specialDays[i].date " + specialDays[i].date);
		// console.log(" *** dayType specialDays " + i);
	}

	for (i = 0; i < noClassSats.length; i++)
	{
		if (noClassSats[i].month == d.getMonth() && noClassSats[i].date == d.getDate()) { return 2; }
		// console.log(" *** dayType noClassSats " + i);
	}

	for (i = 0; i < noClasses.length; i++)
	{
		if (noClasses[i].month == d.getMonth() && noClasses[i].date == d.getDate()) { return 3; }
		// console.log(" *** dayType noClasses " + i);
	}

	for (i = 0; i < holiday.length; i++)
	{
		if (holiday[i].month == d.getMonth() && holiday[i].date == d.getDate()) { return 4; }
		// console.log(" *** dayType holiday " + i);
	}

	return 0;
}

function loadTime()
{
	// Adjusts into AM and PM time
	var hr = ((d.getHours() + 11) % 12 + 1);
	var sufx = (d.getHours() >= 12)? 'PM' : 'AM';

	// Outputs to HTML
	document.getElementById("clock").innerHTML = hr + ":" + ("0" + d.getMinutes()).slice(-2) + " " + sufx;
}

function loadDate()
{
	// Dictionary for text-based date
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	// Outputs to HTML
	document.getElementById("date").innerHTML = days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

// Below mostly code from Eric Li '13

// Defines a period
function period(title, startHr, startMin, endHr, endMin)
{
	this.title = title;
	this.startHr = startHr;
	this.startMin = startMin;
	this.startRaw = startHr * 3600 + startMin * 60;
	console.log(" *** startRaw " + this.startRaw);
	// this.start = new Date(0,0,0,startHr,startMin,0,0);
	this.endHr = endHr;
	this.endMin = endMin;
	this.endRaw = endHr * 3600 + endMin * 60;
	// this.end = new Date(0,0,0,endHr,endMin,0,0);
}

function calDay(month, date)
{
	this.date = date;
	this.month = month - 1;
}

// Updates the clock messages
function update()
{
	// Stores the dayType
	var type = dayType();
	// Debug ***
	// document.getElementById("debug").innerHTML = type;
	// Checks for special days
	if (type == 1) { specialSchedule(); }
	else if (type == 2) { noClassSat(); }
	else if (type == 3) { noClasses(); }
	else if (type == 4) { holiday(); }
	else if (type == 0)
	{
		console.log(" *** Is normal day");
		// Gets today's schedule
		var currentSchedule = getSchedule();
		console.log(" *** currentSchedule " + currentSchedule.length);

		// Checks which period it currently is
		for (i = 0; i < currentSchedule.length; i++)
		{
			console.log(" *** for i " + i);
			console.log(" *** parseRaw " + parseRaw());
			if (currentSchedule[i].startRaw < parseRaw() && parseRaw() < currentSchedule[i].endRaw)
			{
				console.log(" *** currentSchedule[i].startRaw " + currentSchedule[i].startRaw);
				normalDay(currentSchedule[i].title, currentSchedule[i].endRaw - parseRaw(), currentSchedule[i + 2].title, currentSchedule[i + 2].startRaw - parseRaw())
			}
			if (parseRaw() > currentSchedule[currentSchedule.length - 1].endRaw) { document.getElementById("currentEvent").innerHTML = "Have a nice day!"; }
		}
	}
	else {}
}

// Gets the right schedule for a regular class day
function getSchedule()
{
console.log(" *** d.getDate() " + d.getDay());
	var weekday = d.getDay();

	// Defines the currentSchedule array
	var currentSchedule = new Array();

	// Assigns class schedules for weekday scenarios
	if (weekday == 1 || weekday == 4)
	{
		currentSchedule[0] = new period("Period 1", 8, 30, 9, 15);
		currentSchedule[1] = new period("Passing", 9, 15, 9, 20);
		currentSchedule[2] = new period("Period 2", 9, 20, 10, 5);
		currentSchedule[3] = new period("Passing", 10, 5, 10, 10);
		currentSchedule[4] = new period("Chapel / Class Meeting", 10, 10, 10, 35);
		currentSchedule[5] = new period("Passing", 10, 35, 10, 40);
		currentSchedule[6] = new period("Period 3", 10, 40, 11, 20);
		currentSchedule[7] = new period("Passing", 11, 20, 11, 25);
		currentSchedule[8] = new period("Period 4", 11, 25, 12, 5);
		currentSchedule[9] = new period("Passing", 12, 5, 12, 10);
		currentSchedule[10] = new period("Period 5A", 12, 10, 12, 55);
		currentSchedule[11] = new period("Period 5B", 12, 55, 13, 40);
		currentSchedule[12] = new period("Passing", 13, 40, 13, 45);
		currentSchedule[13] = new period("Period 6", 13, 45, 14, 30);
		currentSchedule[14] = new period("Passing", 14, 30, 14, 35);
		currentSchedule[15] = new period("Period 7", 14, 35, 15, 20);
		currentSchedule[16] = new period("end of school", 15, 20, 15, 20);
		currentSchedule[17] = new period("end of school", 15, 20, 15, 20);
	}
	else if (weekday == 2 || weekday == 5)
	{
		currentSchedule[0] = new period("Period 1", 8, 30, 9, 10);
		currentSchedule[1] = new period("Passing", 9, 10, 9, 15);
		currentSchedule[2] = new period("Period 2", 9, 15, 9, 55);
		currentSchedule[3] = new period("Passing", 9, 55, 10, 00);
		currentSchedule[4] = new period("Auditorium",  10, 00, 10, 35);
		currentSchedule[5] = new period("Passing", 10, 35, 10, 40);
		currentSchedule[6] = new period("Period 3", 10, 40, 11, 20);
		currentSchedule[7] = new period("Passing", 11, 20, 11, 25);
		currentSchedule[8] = new period("Period 4", 11, 25, 12, 5);
		currentSchedule[9] = new period("Passing", 12, 5, 12, 10);
		currentSchedule[10] = new period("Period 5A", 12, 10, 12, 55);
		currentSchedule[11] = new period("Period 5B", 12, 55, 13, 40);
		currentSchedule[12] = new period("Passing", 13, 40, 13, 45);
		currentSchedule[13] = new period("Period 6", 13, 45, 14, 30);
		currentSchedule[14] = new period("Passing", 14, 30, 14, 35);
		currentSchedule[15] = new period("Period 7", 14, 35, 15, 20);
		currentSchedule[16] = new period("end of school", 15, 20, 15, 20);
		currentSchedule[17] = new period("end of school", 15, 20, 15, 20);
	}
	else if (weekday == 3)
	{
		currentSchedule[0] = new period("Period 1", 8, 50, 9, 35);
		currentSchedule[1] = new period("Passing", 9, 35, 9, 40);
		currentSchedule[2] = new period("Period 2", 9, 40, 10, 25);
		currentSchedule[3] = new period("Passing", 10, 25, 10, 30);
		currentSchedule[4] = new period("Advisory", 10, 30, 10, 45);
		currentSchedule[5] = new period("Passing", 10, 45, 10, 50);
		currentSchedule[6] = new period("Period 3", 10, 50, 11, 30);
		currentSchedule[7] = new period("Passing", 11, 30, 11, 35);
		currentSchedule[8] = new period("Period 4", 11, 35, 12, 15);
		currentSchedule[9] = new period("end of school", 12, 15, 12, 15);
		currentSchedule[10] = new period("end of school", 12, 15, 12, 15);
	}
	else if (weekday == 6)
	{
		currentSchedule[0] = new period("Period 1", 8, 30, 9, 15);
		currentSchedule[1] = new period("Passing", 9, 15, 9, 20);
		currentSchedule[2] = new period("Period 2", 9, 20, 10, 5);
		currentSchedule[3] = new period("Break",  10, 5, 10, 20);
		currentSchedule[4] = new period("Period 3",  10, 20, 11, 5);
		currentSchedule[5] = new period("Passing", 11, 5, 11, 10);
		currentSchedule[6] = new period("Period 4",  11, 10, 11, 55);
		currentSchedule[7] = new period("end of school", 11, 55, 11, 55);
		currentSchedule[8] = new period("end of school", 11, 55, 11, 55);
	}
	else { noClasses(); }

	return currentSchedule;
}

function specialSchedule()
{
		document.getElementById("currentEvent").innerHTML = "There is a special schedule today.";
		document.getElementById("nextEvent").innerHTML = "Please consult your planner for details.";
}

function noClassSat()
{
	document.getElementById("currentEvent").innerHTML = "There are no classes today.";
	document.getElementById("nextEvent").innerHTML = " Enjoy your actual weekend!";
}

function noClasses()
{
	document.getElementById("currentEvent").innerHTML = "There are no classes today.";
	document.getElementById("nextEvent").innerHTML = " Enjoy the day off!";
}

function holiday()
{
	document.getElementById("currentEvent").innerHTML = "Enjoy your holiday!";
	document.getElementById("nextEvent").innerHTML = "";
}

function normalDay(nowTitle, nowDiff, nextTitle, nextDiff)
{
	document.getElementById("currentEvent").innerHTML = "It is now <u><b>" + nowTitle + "</b></u>, which is ending in <u><b>" + rawToString(nowDiff) + "</b></u>.";
	document.getElementById("nextEvent").innerHTML = "It will be <u><b>" + nextTitle + "</b></u> in <u><b>" + rawToString(nextDiff) + "</b></u>.";
}

function parseRaw()
{
	return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
}

function toMins(raw)
{
	return Math.ceil(raw / 60);
}

function toHrs(raw)
{
	return Math.floor(raw / 3600);
}

function rawToString(raw)
{
	if (toMins(raw) == 1) { return toMins(raw) + " minute"; }
	else { return toMins(raw) + " minutes"; }
}

setInterval(loadTime, 1000);
setInterval(loadDate, 1000);
setInterval(updateD, 1000);
setInterval(update, 1000);

"use strict";
// Будем переделавать календарь под паттерн MVC (Model-View-Controller)
import {CalendarView} from './calendar.js';

let currentDate = new Date();

const configCalendar = {
    selectDay: null,
    adapt: true,
    selector: "#calendar",
    day: currentDate,
    classSelectDay: ".calendar__selectDay",
}

const calendar1 = new CalendarView(configCalendar);

currentDate.setMonth(currentDate.getMonth() + 1);
configCalendar.selector = "#calendar-next";
configCalendar.day = currentDate;

const calendarNext = new CalendarView(configCalendar);

document.querySelector('#next')
    .addEventListener('click', () => {
        calendar1.nextMonth();
        calendarNext.nextMonth();
    })

document.querySelector('#prev')
    .addEventListener('click', () => {
        calendar1.preMonth();
        calendarNext.preMonth();
    })

const data = {
    ar: {},
    pushArr: function (day) {
        if (day in data.ar) {
            data.ar[day]++;
        } else {
            data.ar[day] = 1
        }
    }
};

document.querySelector(calendar1.selector).addEventListener('clickCalendar', function (target) {
    const PARAM = 50;
    const day = target.detail;
    if (day != "emptyItem") {
        data.pushArr(day);
        const Q_DAY = data.ar[day]
        console.log(data.ar);
        calendar1.selectDays({
            day: [target.detail],
            class: "str",
            color: `rgb(${Q_DAY*PARAM}, 0, 0)`,
            border: false,
            strong: true,
        })
    }
});
"use strict";

const outFirst = document.querySelector('#out-first');
const outSecond = document.querySelector('#out-second');

document.querySelector('#clear').onclick = function () {
    outFirst.innerHTML = "";
    outSecond.innerHTML = "";
}
//==========================================================

const Calendar = function (conf) {
    const {
        selectDay = null,
            adapt = true,
            selector = null,
            day = new Date(),
            classActiveDay = "",
    } = conf;
    let month = day.getMonth(); //
    let years = day.getFullYear(); //
    let firstDayOfMonth = new Date(years, month, 1).getDay();
    let lastDateOfMonth = new Date(years, month + 1, 0).getDate(); //date
    const outTag = document.querySelector(selector);
    const months = [
        "Январь", "Февраль", "Март",
        "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь",
        "Октябрь", "Ноябрь", "Декабрь"
    ];
    const weekDays = [
        "Пн", "Вт", "Ср",
        "Чт", "Пт", "Сб", "Вс",
    ];

    function getFirstDayOfMonth() {
        return firstDayOfMonth ? firstDayOfMonth - 1 : 6;
    };

    function getNewMonth() {
        return month % 12 ? month % 12 : 12;
    };

    this.nextMonth = () => {
        month++;
        years = new Date(years, getNewMonth(), 1).getFullYear();
        firstDayOfMonth = new Date(years, month, 1).getDay();
        lastDateOfMonth = new Date(years, month + 1, 0).getDate();
    };

    this.preMonth = () => {
        month--;
        years = new Date(years, getNewMonth(), 1).getFullYear();
        firstDayOfMonth = new Date(years, month, 1).getDay();
        lastDateOfMonth = new Date(years, month - 1, 0).getDate();
    };

    this.render = function () {
        let dayOfMonth = 1;
        let calendarTable = `
        <div class="calendar__month" data-month="${months[month % 12]}">
        <h3 class="calendar__monthHead">${months[month % 12]} ${years}</h3>
        <div class="calendar__row" data-head="dayOfWeek">
        `;
        for (let i = 0; i < weekDays.length; i++) {
            calendarTable += `<span class="calendar__item" data-weekDays="${i}">${weekDays[i]}</span>`;
        }
        calendarTable += `</div>`;
        for (let week = 0; week <= 5; week++) {
            calendarTable += `<div class="calendar__row" data-week="${week}">`;
            for (let value = 0; value < 7 && dayOfMonth <= lastDateOfMonth; value++) {
                if (value < getFirstDayOfMonth() && week === 0) {
                    calendarTable += `<span class="calendar__item" data-day="emptyItem"></span>`;
                } else {
                    calendarTable += `<span class="calendar__item" data-day="${dayOfMonth}">${dayOfMonth}</span>`;
                    dayOfMonth++;
                }
            }
            calendarTable += `</div>`;
        }
        calendarTable += `</div>`;
        outTag.insertAdjacentHTML("beforeend", calendarTable);
    };
};

const configCalendar = {
    selectDay: null,
    adapt: true,
    selector: "#calendar",
    day: new Date(),
    classActiveDay: ".activeDay",
}

const calendar1 = new Calendar(configCalendar);
calendar1.preMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
calendar1.nextMonth();
calendar1.render();
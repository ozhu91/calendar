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
        adapt = true,
            selector = null,
            day = new Date(),
            classActiveDay = "",
    } = conf;
    let {
        selectDay = null
    } = conf;
    let month = day.getMonth();
    let years = day.getFullYear();
    let firstDayOfMonth = new Date(years, month, 1).getDay();
    let lastDateOfMonth = new Date(years, month + 1, 0).getDate();
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

    /**
     * метод перевода недели на русскую раскладку пн-вс
     */
    function getFirstDayOfMonth() {
        return firstDayOfMonth ? firstDayOfMonth - 1 : 6;
    };

    /**
     * метод отрисовки календаря
     */
    function initRender() {
        let dayOfMonth = 1;
        let calendarTable = `
        <div class="calendar__month" data-month="${months[month]}">
        <h3 class="calendar__monthHead">${months[month]} ${years}</h3>
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
        outTag.innerHTML = calendarTable;
        isToDay();
    };

    /**
     * метод отмечает сегодняшний день
     */
    function isToDay() {
        let currentDate = new Date(years, month, 1);
        let activeDate = new Date();
        if (currentDate.getFullYear() === activeDate.getFullYear() && currentDate.getMonth() === activeDate.getMonth()) {
            let nowDate = activeDate.getDate();
            outTag.querySelector(`${selector} span[data-day='${nowDate}']`).classList.add("calendar__activeDay");
        } else return
    }

    /**
     * метод вызова следующего месяца
     */
    this.nextMonth = () => {
        if (month === 11) {
            years++;
            month = 0;
        } else {
            month++;
        }
        firstDayOfMonth = new Date(years, month, 1).getDay();
        lastDateOfMonth = new Date(years, month + 1, 0).getDate();
        initRender();
    };

    /**
     * метод вызова предыдущего месяца
     */
    this.preMonth = () => {
        if (!month) {
            month = 11;
            years--;
        } else {
            month--;
        }
        firstDayOfMonth = new Date(years, month, 1).getDay();
        lastDateOfMonth = new Date(years, month - 1, 0).getDate();
        initRender();
    };

    /**
     * метод выделения выбранных дней в календаре
     */
    this.selectingDays = (initDaysOfMonth, initClass) => {
        let arrDays = initDaysOfMonth.split(' ');
        outTag.querySelector(`${selector} span[data-day]`).classList.remove(`${initClass}`);
        arrDays.forEach(element => {
            outTag.querySelector(`${selector} span[data-day='${element}']`).classList.add(`${initClass}`);
        });
    }

    initRender();

    outTag.addEventListener("click", (event) => {
        const target = event.target;
        if (!target.dataset.day) {
            return;
        }
        if (document.querySelector(`.calendar__selectDay`) != null) {
            document.querySelectorAll(`.calendar__selectDay`).forEach(element => {
                element.classList.remove("calendar__selectDay");
            })
        }
        selectDay = Number(target.dataset.day);
        target.classList.add("calendar__selectDay");
    });


};

let currentDate = new Date();

const configCalendar = {
    selectDay: null,
    adapt: true,
    selector: "#calendar",
    day: currentDate,
    classSelectDay: ".calendar__selectDay",
}

const calendar1 = new Calendar(configCalendar);

currentDate.setMonth(currentDate.getMonth() + 1);
configCalendar.selector = "#calendar-next";
configCalendar.day = currentDate;

const calendarNext = new Calendar(configCalendar);

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

    calendar1.selectingDays('1 2 3 8 9 10 11 28 29', "calendar__selectDay");
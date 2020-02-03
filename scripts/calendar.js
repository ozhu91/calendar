import {
    Validator
} from './validation.js';

export {
    CalendarView
};

require('babel-polyfill');

const CalendarView = function (conf) {
    const {
        adapt = true,
            selector = null,
            day = new Date(),
            classActiveDay = "",
            lang = 'eng',
    } = conf;

    let month = day.getMonth();
    let years = day.getFullYear();
    let firstDayOfMonth = new Date(years, month, 1).getDay();
    let lastDateOfMonth = new Date(years, month + 1, 0).getDate();
    let monthsList = {};
    let weekDays = {};
    let url = '../calendarLists.JSON';
    const outTag = document.querySelector(selector);

    const validator = new Validator({
        day: {
            required: true,
            type: Array
        },
        color: {
            type: String,
            required: false,
        },
        class: {
            type: String
        },
        border: {
            type: String
        },
        strong: {
            type: Boolean
        },
    });

    this.selector = selector;

    function makeGETRequest(url) {
    return new Promise(resolve => {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else {
            xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const body = JSON.parse(xhr.responseText);
                resolve(body);
            }
        };
        xhr.open("GET", url);
        xhr.send();
    });
    }

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
        <div class="calendar__month" data-month="${monthsList["eng"][month]}"> 
        <div class="calendar__row" data-head="dayOfWeek">
        `;
        for (let i = 0; i < weekDays[lang].length; i++) {
            calendarTable += `
            <span 
                class="calendar__item" data-weekDays="${i}">${weekDays[lang][i]}
            </span>
            `;
        }
        calendarTable += `</div>`;
        for (let week = 0; week <= 5; week++) {
            calendarTable += `<div class="calendar__row" data-week="${week}">`;
            for (let value = 0; value < 7 && dayOfMonth <= lastDateOfMonth; value++) {
                if (value < getFirstDayOfMonth() && week === 0) {
                    calendarTable += `
                    <span class="calendar__item" data-day="emptyItem"></span>
                    `;
                } else {
                    calendarTable += `
                    <span 
                        class="calendar__item" data-day="${dayOfMonth}">${dayOfMonth}  
                    </span>
                    `;
                    dayOfMonth++;
                }
            }
            calendarTable += `</div>`;
        }
        calendarTable += `</div>`;
        outTag.innerHTML = calendarTable;
    }

    

    Object.defineProperties(this, {
        "month": {
            "get": function() { return monthsList[lang][month]; },
            "set": function(month) { return monthsList[lang][month]

            },
        },
        'year': {
            "get": function() { return years; },
            "set": function(years) { return years}
        }
    })

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
    this.selectDays = (conf) => {
        if (conf.day === day) {
            return
        }

        validator.validator(conf);
        conf.day.forEach(function (elem) {
            outTag.querySelector(`${selector} span[data-day='${elem}']`).classList.add(`${conf.class}`);
        })

        for (let item in conf)  {
            if (item in outTag.style) {
                conf.day.forEach(function (elem) {
                    outTag.querySelector(`${selector} span[data-day='${elem}']`).style[item] = conf[item];
                });
            }
        }
    };

    outTag.addEventListener("click", (e) => {
        const day = e.target;
        if (!day.dataset.day) {
            return;
        }
        const event = new CustomEvent('clickCalendar', {
            detail: day.dataset.day
        });
        outTag.dispatchEvent(event);
    });

    (async function makeGetWeekDays() {
        try {
            let body = await makeGETRequest(url);
            console.log(body);
            weekDays = body['weekDays'];
            monthsList = body["month"];
            initRender();
        } catch (e) {
            this.setError("Нет данных")
        }
    })()
};
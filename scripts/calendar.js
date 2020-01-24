import {Validator} from './validation.js';

export {CalendarView};

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
    const outTag = document.querySelector(selector);

    const monthsList = {
      rus: ["Январь", "Февраль", "Март",
            "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь",
            "Октябрь", "Ноябрь", "Декабрь"
           ],
      eng: ["January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"
           ]
    };

    const weekDays = {
            rus: ["Пн", "Вт", "Ср",
                "Чт", "Пт", "Сб", "Вс"
            ],
            eng: ["Sn", "Mn", "Ts",
                "Wd", "Th", "Fr", "St"
            ],
        };

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
            type: Boolean
        },
        strong: {
            type: Boolean
        },
    })

    this.selector = selector;

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
            calendarTable += `<span class="calendar__item" data-weekDays="${i}">${weekDays[lang][i]}</span>`;
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
    };

    this.getMonth = () => {
        return monthsList[lang][month];
    };

    this.setMonth = (lang = lang, month = month) => {
        return monthsList[lang][month];
    }

    this.getYear = () => {
        return years;
    }

    this.setYear = (year = years) => {
        return year;
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
    this.selectDays = (conf) => {
        if (conf.day === day) {
            return
        }

        validator.validator(conf);
        conf.day.forEach(function (elem) {
            outTag.querySelector(`${selector} span[data-day='${elem}']`).classList.add(`${conf.class}`);
        })

        if (conf.color) {
            conf.day.forEach(function (elem) {
                outTag.querySelector(`${selector} span[data-day='${elem}']`).style.color = conf.color;
            });
        }

        if (conf.border) {
            conf.day.forEach(function (elem) {
                outTag.querySelector(`${selector} span[data-day='${elem}']`).style.border = ".5px solid grey";
            });
        }
        if (conf.strong) {
            conf.day.forEach(function (elem) {
                outTag.querySelector(`${selector} span[data-day='${elem}']`).style.fontWeight = 'bold';
            });
        }

    }

    initRender();

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
};


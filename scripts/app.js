"use strict";
// Будем переделавать календарь под паттерн MVC (Model-View-Controller)
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

// function isValidationError(obj) {
//     let objValid = obj;
//     if (!objValid.day) {
//         throw new ValidationError(`Config - day is undefined`);
//     }
//     if (objValid.class) {
//         if (typeof objValid.class != "string") {
//             throw new ValidationError(`Config - class: is not string`);
//         }
//     }
//     if (objValid.color) {
//         if (typeof objValid.color != "string") {
//             throw new ValidationError(`Config - color: is not string`);
//         }
//     }
//     if (objValid.border) {
//         if (typeof objValid.border != "boolean") {
//             throw new ValidationError(`Config - border: is not boolean`);
//         }
//     }
//     if (objValid.strong) {
//         if (typeof objValid.strong != "boolean") {
//             throw new ValidationError(`Config - strong: is not boolean`);
//         }
//     }
//     return objValid;
// }

function isValidationError(obj) {
    let objValid = obj;
    let errors = {
        "day": () => {if (!objValid.day) throw new ValidationError(`Config - day is undefined`)},
        "class": () => {if (typeof objValid.class != "string") throw new ValidationError(`Config - class: is not string`)},
        "color": () => {if (typeof objValid.color != "string") throw new ValidationError(`Config - color: is not string`)},
        "border": () => {if (typeof objValid.border != "boolean") throw new ValidationError(`Config - border: is not boolean`)},
        "strong": () => {if (typeof objValid.strong != "boolean") throw new ValidationError(`Config - strong: is not boolean`)}
    }
    for (let key in objValid) {
        (errors[key])();
    }
    return objValid;
}

function validationSelectConf(obj) {
    try {
        return isValidationError(obj);
    } catch (err) {
        console.log("Validation error" + err.message)
    }
}

const CalendarView = function (conf) {
    const {
            adapt = true,
            selector = null,
            day = new Date(),
            classActiveDay = "",
            lang = initLang,
    } = conf;
    let month = day.getMonth();
    let years = day.getFullYear();
    let firstDayOfMonth = new Date(years, month, 1).getDay();
    let lastDateOfMonth = new Date(years, month + 1, 0).getDate();
    const outTag = document.querySelector(selector);

    const months = [{
            rus: ["Январь", "Февраль", "Март",
                "Апрель", "Май", "Июнь",
                "Июль", "Август", "Сентябрь",
                "Октябрь", "Ноябрь", "Декабрь"
            ]
        },
        {
            eng: ["January", "February", "March",
                "April", "May", "June",
                "July", "August", "September",
                "October", "November", "December"
            ]
        },
    ];

    const weekDays = [{
            rus: ["Пн", "Вт", "Ср",
                "Чт", "Пт", "Сб", "Вс"
            ]
        },
        {
            eng: ["Sn", "Mn", "Ts",
                "Wd", "Th", "Fr", "St"
            ]
        }

    ];
    this.selector = selector;

    function forSelectLang(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (String(lang) in arr[i]) {
                return arr[i][Object.keys(arr[i])[0]];
            }
        }
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
        <div class="calendar__month" data-month="${forSelectLang(months)[month]}"> 
        <h3 class="calendar__monthHead">${forSelectLang(months)[month]} ${years}</h3>
        <div class="calendar__row" data-head="dayOfWeek">
        `;
        for (let i = 0; i < forSelectLang(weekDays).length; i++) {
            calendarTable += `<span class="calendar__item" data-weekDays="${i}">${forSelectLang(weekDays)[i]}</span>`;
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

        isValidationError(conf);
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

let currentDate = new Date();

const configCalendar = {
    selectDay: null,
    adapt: true,
    selector: "#calendar",
    day: currentDate,
    classSelectDay: ".calendar__selectDay",
    lang: "rus",
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
    pushAr: function (day) {
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
        data.pushAr(day);
        const Q_DAY = data.ar[day]
        console.log(data.ar);
        calendar1.selectDays({
            day: [target.detail],
            class: "calendar__activeDay",
            color: `rgb(${Q_DAY*PARAM}, 0, 0)`,
            border: 15,
            strong: "1421312",
        })
    }
});
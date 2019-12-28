"use strict";
// Будем переделавать календарь под паттерн MVC (Model-View-Controller)

const CalendarView = function (conf) {
    // TODO: исрпавить форматирование ниже  
    const {
        adapt = true,
            selector = null,
            day = new Date(),
            classActiveDay = "",
    } = conf;
    // TODO: selectDay во View не нужна.
    let {
        lang = initLang
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
    // TODO: этот метод будет в контроллере, но пока оставь здесь
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
    // TODO: этот метод будет в контроллере, но пока оставь здесь
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
    this.selectingDays = (conf) => {
        // TODO: если я опечатаюсь и вместо ключа days напишу day,
        //       получу TypeError: Cannot read property 'forEach' of undefined
        //       что будет не совсем понятно для того, кто пользуется твоей библиотекой
        //       поэтому проверяй входной параметр и генерируй соответствующие ошибки
        //       если с ним что-то не то. смотри https://learn.javascript.ru/custom-errors
        // TODO: сделать так, чтобы для форматирования дней, кроме класса можно было
        //       передать цвет или обвести в рамку, или сделать жирным, или прозрачным
        //       т.е. вот такой объект
        //       {
        //          days: Array, *обязательное поле, остальные не обязательные
        //          class: String,
        //          color: String,
        //          border: Boolean,
        //          strong: Boolean
        //       }
        //       зачастую удобнее передовать не класс, а цвет, например
        if (conf.day === day) {
            return
        }
        if (typeof conf['day'] !== "undefined") {
            conf.day.forEach(function (elem) {
                outTag.querySelector(`${selector} span[data-day='${elem}']`).classList.add(`${conf.class}`);
            });
        } else {
            for (let i = 0; i < conf.length; i++) {
                conf[i].day.forEach(function (elem) {
                    outTag.querySelector(`${selector} span[data-day='${elem}']`).classList.add(`${conf[i].class}`);
                })
            }
        }


    }

    initRender();

    // TODO: вместо обработки клика вызывать custom event https://learn.javascript.ru/dispatch-events
    //       чтобы его можно было обработать вне объекта Calendar
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

class ConfigCalendar {
    costructor(selectDay, adapt = true, selector, day, classSelectDay, lang = 'rus') {
        this.selectDay = selectDay;
        this.adapt = adapt;
        this.selector = selector;
        this.day = day;
        this.classSelectDay = classSelectDay;
        this.lang = lang;
    }
}

class configSelectDay {
    costructor(day, activeClass = "", color = "", border = false, strong = false) {
        this.day = day;
        this.activeClass = activeClass;
        this.color = color;
        this.border = border;
        this.strong = strong;
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

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

const configSelectDays = [{
        day: [1, 2, 3, 4, 5, 6],
        class: "calendar__selectDay",
    },
    {
        day: [11, 12, 13, 14, 15, 16],
        class: "calendar__activeDay",
    },
]
calendar1.selectingDays(configSelectDays);

const configSelectDays2 = {
    day: [1, 29, 30],
    class: 55555,
    color: 9999999999,
    border: false,
    strong: true,
};

calendar1.selectingDays(validateConfSelectDay(configSelectDays2));

function validateConfSelectDay(conf) {
    if (typeof conf['day'] !== "undefined") {
        try {
            conf.day.length > 0;
            conf.activeClass == String;
            conf.color == String;
            conf.border == Boolean;
            conf.strong == Boolean;
            return conf;
        } catch (err) {
            if (conf.day.length) {
                throw err;
            } else if (!conf.activeClass === String) {
                throw new ValidationError(console.log("Неверное значение activeClass" + err));
            } else if (!conf.color === String) {
                throw new ValidationError(console.log("Неверное значение color" + err));
            } else if (!conf.border === Boolean) {
                throw new ValidationError(console.log("Неверное значение border" + err));
            } else if (!conf.strong === Boolean) {
                throw new ValidationError(console.log("Неверное значение strong" + err));
            } else {
                throw err;
            }
        }
    } else {
        for (let i = 0; i < conf.length; i++) {
            try {
                conf[i].day.length > 0;
                conf[i].activeClass == String;
                conf[i].color == String;
                conf[i].border == Boolean;
                conf[i].strong == Boolean;
                return conf;
            } catch (err) {
                if (conf[i].day.length) {
                    throw err;
                } else if (!conf[i].activeClass == String) {
                    throw new ValidationError("Неверное значение activeClass", err);
                } else if (!conf[i].color == String) {
                    throw new ValidationError("Неверное значение color", err);
                } else if (!conf[i].border == Boolean) {
                    throw new ValidationError("Неверное значение border", err);
                } else if (!conf[i].strong == Boolean) {
                    throw new ValidationError("Неверное значение strong", err);
                } else {
                    throw err;
                }
            }
        }
    }
}
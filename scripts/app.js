"use strict";
// Будем переделавать календарь под паттерн MVC (Model-View-Controller)

// Ot -> F & k in Ov | Ot -> F & !(k in Ov) |  Ot -> O & req | Ot -> O & !req | other - ERROR
//       t === t               return               t === t      key in Ov
//        return                                     return        t === t
//                                                                 return

// end state:
//   return:
//   error:
//     type error
//     absence req

const Validator = function (templateObj) {

  class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = "ValidationError";
    }
  }

  function checkType(type, value) {
    return typeof type() === typeof value
  }

  this.validator = function (validateObj) {
    for (let key in templateObj) {
      if ('required' in templateObj[key] &&
           templateObj[key].required &&
           !checkType(templateObj[key].type, validateObj[key]) ) {
        throw new ValidationError(`type error - ${key}: is not ${typeof (templateObj[key].type)()}`);

      } else if (!('required' in templateObj[key]) &&
                 key in validateObj &&
                 !checkType(templateObj[key].type, validateObj[key])) {
        throw new ValidationError(`type error - ${key}: is not ${typeof (templateObj[key].type)()}`);
      }
    }
  }
}

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
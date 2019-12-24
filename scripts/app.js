"use strict";
// Будем переделавать календарь под паттерн MVC (Model-View-Controller)

// TODO: переименовать класс в CalendarView
//       тут будет только View - предстовление,
//       т.е. то что выводит информацию
//       сюда будем только передовать текужий месяц/год и как форматировать дни
const Calendar = function (conf) {
    // TODO: исрпавить форматирование ниже  
    const {
        adapt = true,
            selector = null,
            day = new Date(),
            classActiveDay = "",
    } = conf;
    // TODO: selectDay во View не нужна.
    let {
        selectDay = null
    } = conf;
    let month = day.getMonth();
    let years = day.getFullYear();
    let firstDayOfMonth = new Date(years, month, 1).getDay();
    let lastDateOfMonth = new Date(years, month + 1, 0).getDate();
    const outTag = document.querySelector(selector);
    // TODO: пора добавить поддержку других языков.
    //       нужно переделать в массив объектов где ключь, это язык (rus, eng)
    //       а значение, это название методов
    const months = [
        "Январь", "Февраль", "Март",
        "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь",
        "Октябрь", "Ноябрь", "Декабрь"
    ];
    // TODO: пора добавить поддержку других языков.
    //       нужно переделать в массив объектов где ключь, это язык (rus, eng)
    //       а значение, это название методов
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
    // TODO: убрать этот метод он будет в контроллере, который напишем позже
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
     this.selectingDays = (arr) => {
         // TODO: сделать так, чтобы можно было кроме массива объектов 
         //       передовать просто объект и работало всё корректно
         //       т.е. я могу передать, либо массив объектов, либо объект
         //       и всё будет корректно отрисовываться
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
         for (let i = 0; i < arr.length; i++) {
            arr[i].days.forEach(function(elem) {
                outTag.querySelector(`${selector} span[data-day='${elem}']`).classList.add(`${arr[i].class}`);
            })
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

    const configSelectDays = [
        {
            days: [1, 2, 3, 4, 5, 6],
            class: "calendar__selectDay",
        },
        {
            day: [11, 12, 13, 14, 15, 16],
            class: "calendar__activeDay",
        },
    ]
    calendar1.selectingDays(configSelectDays);
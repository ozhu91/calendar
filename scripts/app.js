"use strict";

const Calendar = function (currentDay, day = new Date()) {
    let today = day;
    let month = today.getMonth();
    let years = today.getFullYear();
    let selectDay = null;
    let firstDayOfMonth = new Date(years, month, 1).getDay();
    let lastDayOfMonth = new Date(years, month + 1, 0).getDate();
    let matrixDay = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
    ];
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
     * метод заполняет полностью двумерный массив matrixDay
     */
    function buildMatrixDay() {
        let matrix = matrixDay;
        let numberMonth = 1;
        let counterDays = 0;
        let week = 0;
        buildMatrixWeekDay(counterDays, week, matrix);
        week++;
        for (week; week <= 6; week++) {
            counterDays = 0;
            for (counterDays; counterDays < 7 && numberMonth <= lastDayOfMonth; counterDays++) {
                if (counterDays < getDayOfWeek(firstDayOfMonth) && week === 1) {
                    matrix[week].push('  ');
                } else {
                    matrix[week].push(numberMonth);
                    numberMonth++;
                };
            }
        }
        return matrixDay = matrix;
    };

    function getDayOfWeek(day) {
                let counter = day;
                if (counter % 6 === 0) {
                    counter = 6;
                } else {
                    counter = count % 6;
                }
                return parseInt(counter);
    }

    function buildMatrixWeekDay(counter, week, matrix) {
            for (counter; counter < 7; counter++) {
                    matrix[week].push(weekDays[counter]);
            }; 
    }

    this.nextMonth = () => {month++};
    this.preMonth = () => {month--};

    this.printCalendar = function () {
        let i, j;
        let print = [];
        let line;
        for (i = 0; i <= matrixDay[i].length; i++) {
            line = "";
            for (j = 0; j < matrixDay[i].length; j++) {
                line = line + matrixDay[i][j] + " ";
            };
            console.log(line);
        };
    };

    this.setMatrixDay = () => {
        return buildMatrixDay();
    };

    this.getMatrixDay = (week) => {
        return matrixDay[week];
    };

    // this.setDay = (day) => selectDay = day;
    // this.getDay = () => {};
};


const calendar1 = new Calendar();
calendar1.setMatrixDay();
calendar1.printCalendar();
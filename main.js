/*
 * Your program must print string with the number of years and months and the total number of days between the dates.
 * Dates are provided in dd.mm.yyyy format.
 * You are not allowed to plug in JS libraries such as moment.js or date-fns directly into the code. All code need to be written in this file.
 * 
 * Result must be shown as a string in years, months and total days. If years or months are 0, then it should not be displayed in the output.
 *
 * Example:
 * Input: ['01.01.2000', '01.01.2016']
 * Output:
 * '16 years, total 5844 days'
 *
 * Example 2:
 * Input: ['01.11.2015', '01.02.2017']
 *
 * Output:
 * '1 year, 3 months, total 458 days'
*/
const dates = [
    ['01.01.2000', '01.01.2016'],
    ['01.01.2016', '01.08.2016'],
    ['01.11.2015', '01.02.2017'],
    ['16.01.2017', '17.12.2016', '16.01.2017'],
    ['01.01.2016', '01.01.2016'],
    ['28.02.2015', '13.04.2018'],
    ['28.01.2015', '28.02.2015'],
    ['17.03.2022', '17.03.2023'],
    ['17.02.2024', '17.02.2025'],
];
const DATE_FORMAT = 'dd.mm.yyyy';

// Add Static method to Date Object to allow creation of Date from custom format
Object.defineProperty(Date, 'fromFormat', {
    value: function(dateString, format = 'yyyy-mm-dd') {
        const parts = dateString.match(/(\d+)/g);
        const datePartsMap = {};
        let partIndex = 0;
        format.replace(/(yyyy|dd|mm)/g, part => datePartsMap[part] = partIndex++);
        return new Date(parts[datePartsMap['yyyy']], parts[datePartsMap['mm']] - 1, parts[datePartsMap['dd']]);
    }
});

// Extend Date Object to add method that calculates number of days between 2 dates
// Note: dates don't need to be ordered chronologically
Object.defineProperty(Date.prototype, 'getDaysTo', {
    value: function(to) {
        const dateTo = to instanceof Date ? to : new Date(to);
        const timeDiff = Math.abs(this.getTime() - dateTo.getTime());
        const daysDiff = Math.ceil(timeDiff / 8.64e7);
        return daysDiff;
    }
});

// Extend Date Object to add method that calculates the number of months between 2 dates
// Note: dates don't need to be ordered chronologically
Object.defineProperty(Date.prototype, 'getMonthsTo', {
    value: function(to) {
        const dateTo = to instanceof Date ? to : new Date(to);
        const startDate = this > dateTo ? this : dateTo;
        const endDate = this > dateTo ? dateTo: this;
        const yearDiff = Math.abs(startDate.getFullYear() - endDate.getFullYear());
        const monthsElapsed = endDate.getMonth() - startDate.getMonth() + 1;
        let monthsToDate = (yearDiff * 12) - monthsElapsed;

        if(startDate.getDate() >= endDate.getDate()) {
            monthsToDate++
        }

        return monthsToDate;
    }
});

// Receive string of dates one after each other
function outputDate([start, end]) {
    let result = [];
    const startDate = Date.fromFormat(start, DATE_FORMAT);
    const endDate = Date.fromFormat(end, DATE_FORMAT);

    const totalMonths = startDate.getMonthsTo(endDate);
    const months = Math.floor(totalMonths % 12);
    const years = Math.floor(totalMonths / 12);
    const days = startDate.getDaysTo(endDate);

    if(years > 0) {
        result.push(`${years} ${years > 1 ? 'years' : 'year'}`);
    }

    if(months > 0) {
        result.push(`${months} ${months > 1 ? 'months' : 'month'}`);
    }

    if(days >= 0) {
        result.push(`total ${days} days`);
    }

    return result.join(", ")
}
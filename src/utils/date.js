function sumTimes() {
    let dt = new Date(0, 0, 0, 0, 0, 0, 0);

    dt.setHours(dt.getHours() + 1);
    dt.setMinutes(dt.getMinutes() + 30);

    return dt.getHours() + ':' + dt.getMinutes();
}

function addMinutes(date, minutes) {
    date.setMinutes(date.getMinutes() + minutes);
    console.log(date)
    return date;
}

function isValidDate(year, month, day) {
    var d = new Date(year, month, day);
    if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
        return true;
    }
    return false;
}

module.exports = {
    sumTimes,
    addMinutes,
    isValidDate
}
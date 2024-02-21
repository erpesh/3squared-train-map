import {colors} from "../map/Map";

export function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // Convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Pad minutes and seconds with a zero if they are less than 10
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // If seconds are '00', don't display them
    let timeString = `${hours}:${minutes}${seconds !== '00' ? ':' + seconds : ''} ${ampm}`;

    return timeString;
}

function convertTime(inputTime) {
    inputTime = inputTime.toString();
    if (inputTime.length !== 4) return "Invalid time format";
    const hours = inputTime.substring(0, 2).padStart(2, '0');
    const minutes = inputTime.substring(2).padStart(2, '0');
    return hours + ":" + minutes;
}

function convertTimestampToTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return hours + ":" + minutes;
}

function isTimePassed(inputTime) {
    let now = new Date();
    let currentHours = now.getHours();
    let currentMinutes = now.getMinutes();
    let inputHours = Math.floor(inputTime / 100);
    let inputMinutes = inputTime % 100;
    return (currentHours > inputHours || (currentHours === inputHours && currentMinutes >= inputMinutes));
}

export const formatStation = (station) => {
    try {
        const currentDate = new Date();

        let status = null;
        let time = null;
        let delayedTime = null;
        let delay = 0;
        let isPass = false;
        let statusColor = null;
        let pass = null;
        let departure = null;
        let arrival = null;

        if (station.pass) {
            const time = convertTime(station.pass);
            isPass = isTimePassed(station.pass);
            pass = {
                planned: time,
                actual: time,
                delayInMinutes: 0,
                statusColor: colors.onTime
            }
        }

        if (station.plannedDeparture && station.actualDeparture) {
            const plannedDeparture = new Date(station.plannedDeparture);
            const actualDeparture = new Date(station.actualDeparture);

            const delayInMilliseconds = actualDeparture - plannedDeparture;
            const delayInMinutes = Math.floor(delayInMilliseconds / 1000 / 60);
            status = delayInMilliseconds === 0 ? "On Time" : delayInMilliseconds > 0 ? "Late" : "Early";
            statusColor = status === "Late" ? colors.late : status === "Early" ? colors.early : colors.onTime;

            time = convertTimestampToTime(station.plannedDeparture);
            delayedTime = convertTimestampToTime(station.actualDeparture);
            isPass = actualDeparture - currentDate < 0;

            departure = {
                planned: time,
                actual: delayedTime,
                delayInMinutes,
                statusColor
            }
        }

        if (station.plannedArrival && station.actualArrival) {
            const plannedArrival = new Date(station.plannedArrival);
            const actualArrival = new Date(station.actualArrival);

            const delayInMilliseconds = actualArrival - plannedArrival;
            const delayInMinutes = Math.floor(delayInMilliseconds / 1000 / 60);
            status = delayInMilliseconds === 0 ? "On Time" : delayInMilliseconds > 0 ? "Late" : "Early";
            statusColor = status === "Late" ? colors.late : status === "Early" ? colors.early : colors.onTime;

            isPass = actualArrival - currentDate < 0;

            arrival = {
                planned: convertTimestampToTime(station.plannedArrival),
                actual: convertTimestampToTime(station.actualArrival),
                delayInMinutes,
                statusColor
            }
        }

        if (station.plannedDeparture && station.actualDeparture &&
            station.plannedArrival && station.actualArrival &&
            station.plannedArrival === station.plannedDeparture &&
            station.actualArrival === station.actualDeparture
        ) {
            pass = departure;
        }

        return {
            ...station,
            isPass,
            eventType: station.eventType,
            location: station.location,
            tiploc: station.tiploc,
            position: {
                lat: station.latLong.latitude,
                lng: station.latLong.longitude,
            },
            arrival,
            statusColor,
            status,
            time,
            delayedTime,
            delay,
            pass,
            departure
        }
    }
    catch (error) {
        console.error('Error mapping stations: ', error);
        throw new Error("Error mapping train stations");
    }
}

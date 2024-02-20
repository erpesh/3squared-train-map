import {colors} from "../map/Map";
import {fetchTrainMovementData, fetchTrainScheduleData} from "../api";

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

const formatStation = (station) => {
    let status;
    let time;
    let delayedTime;
    let delay;

    if (station.pass) {
        status = "On Time";
        time = convertTime(station.pass);
    }
    else if (station.departure) {
        status = "On Time";
        time = convertTime(station.departure)
    }
    else if (station.plannedDeparture && station.actualDeparture) {
        const plannedDeparture = new Date(station.plannedDeparture);
        const actualDeparture = new Date(station.actualDeparture);

        const delayInMilliseconds = actualDeparture - plannedDeparture;
        const delayInMinutes = Math.floor(delayInMilliseconds / 1000 / 60);
        status = delayInMilliseconds === 0 ? "On Time" : delayInMilliseconds > 0 ? "Late" : "Early";

        time = convertTimestampToTime(station.plannedDeparture);
        delayedTime = convertTimestampToTime(station.actualDeparture);
        delay = Math.abs(delayInMinutes);
    }

    return {
        eventType: station.eventType,
        location: station.location,
        tiploc: station.tiploc,
        position: {
            lat: station.latLong.latitude,
            lng: station.latLong.longitude,
        },
        status,
        time,
        delayedTime,
        delay,
    }
}

function removeDuplicates(array, property) {
    return array.filter((obj, index, self) =>
        index === self.findIndex((o) => (
            o[property] === obj[property]
        ))
    );
}

export const getStationsAndRoutes = (movementData, scheduleData) => {
    const routeSegments = [];
    const stationsList = [];

    // Add first station
    const firstSchedule = {
        ...scheduleData[0],
        eventType: "ARRIVAL"
    };
    stationsList.push(formatStation(firstSchedule));

    for (let i = 0; i < scheduleData.length - 1; i++) {
        const currentSchedule = scheduleData[i];
        const nextSchedule = scheduleData[i + 1];

        const curLatLong = currentSchedule.latLong;
        const nextlatLong = nextSchedule.latLong;
        if (!curLatLong || !nextlatLong)
            continue

        let color = colors.scheduled;
        let station = currentSchedule;
        const movementIndex = movementData.findIndex(mov => mov.tiploc === nextSchedule.tiploc);

        // If movement data for nextSchedule exists
        if (movementIndex !== -1) {
            const movement = movementData[movementIndex];
            const plannedDep = movement.plannedDeparture ?? movement.planned;
            const actualDep = movement.actualDeparture ?? movement.actual;

            station = movement;

            // Set color to scheduled if there's no departure data
            if (plannedDep && actualDep) {
                const plannedDeparture = new Date(plannedDep).getTime();
                const actualDeparture = new Date(actualDep).getTime();
                const delay = actualDeparture - plannedDeparture;
                color = delay > 0 ? colors.late : delay < 0 ? colors.early : colors.onTime;
            }
        }

        // Add a route segment
        routeSegments.push({
            positions: [
                [currentSchedule.latLong.latitude, currentSchedule.latLong.longitude],
                [nextSchedule.latLong.latitude, nextSchedule.latLong.longitude]
            ],
            color: color,
        });

        // Add a station
        stationsList.push(formatStation(station));
    }
    // Add last station
    const lastSchedule = {
        ...scheduleData[scheduleData.length - 1],
        eventType: "ARRIVAL"
    };
    stationsList.push(formatStation(lastSchedule));

    // Remove duplicate stations
    const filteredStations = removeDuplicates(stationsList, "tiploc")
        .filter(station => station.eventType && station.eventType === "ARRIVAL");
    return {
        stations: filteredStations,
        routes: routeSegments
    }
}

const getMovementAndSchedule = async (activationId, scheduleId) => {
    const [movement, schedule] = await Promise.all([
        fetchTrainMovementData(activationId, scheduleId),
        fetchTrainScheduleData(activationId, scheduleId)
    ])
    return {
        movement,
        schedule
    };
}

export async function getTrainsWithMovement(trains) {
    const data = await Promise.all(
        trains.map(train => getMovementAndSchedule(train.activationId, train.scheduleId))
    )

    const trainsWithMovement = [];
    for (let i = 0; i < trains.length; i++) {
        const {movement, schedule} = data[i];
        const {stations} = getStationsAndRoutes(movement, schedule);

        const train = trains[i];
        const actualArrival = new Date(train.actualArrival);
        const scheduledArrival = new Date(train.scheduledArrival);

        const delayInMilliseconds = actualArrival - scheduledArrival;
        const delayInMinutes = Math.floor(delayInMilliseconds / 1000 / 60);

        const isLate = delayInMilliseconds > 0;

        trainsWithMovement.push({
            ...train,
            stations,
            movement: movement[movement.length - 1],
            isLate,
            delayInMinutes
        })
    }
    console.log(trainsWithMovement);
    return trainsWithMovement;
}
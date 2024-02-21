import {colors} from "../map/Map";
import {fetchTrainMovementData, fetchTrainScheduleData} from "../api";
import {formatStation} from "./formatters";

function removeDuplicates(array, property) {
    return array.filter((obj, index, self) =>
        index === self.findIndex((o) => (
            o[property] === obj[property]
        ))
    );
}

export const getStationsAndRoutes = (movementData, scheduleData) => {
    try {
        const routeSegments = [];
        const stationsList = [];

        const movementList = movementData.filter(m => m.latLong);
        const scheduleList = scheduleData.filter(s => s.latLong);

        // Add first station
        const firstSchedule = {
            ...scheduleList[0],
            eventType: "ARRIVAL"
        };
        stationsList.push(formatStation(firstSchedule));

        for (let i = 0; i < scheduleList.length - 1; i++) {
            const currentSchedule = scheduleList[i];
            const nextSchedule = scheduleList[i + 1];

            const curLatLong = currentSchedule.latLong;
            const nextlatLong = nextSchedule.latLong;
            if (!curLatLong || !nextlatLong)
                continue

            let color = colors.scheduled;
            let station = currentSchedule;
            const movementIndex = movementList.findIndex(mov => mov.tiploc === nextSchedule.tiploc);

            // If movement data for nextSchedule exists
            if (movementIndex !== -1) {
                const movement = movementList[movementIndex];
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
            ...scheduleList[scheduleList.length - 1],
            eventType: "ARRIVAL"
        };
        stationsList.push(formatStation(lastSchedule));

        // Remove duplicate stations
        const filteredStations = removeDuplicates(stationsList, "tiploc")
        // .filter(station => station.eventType && station.eventType === "ARRIVAL");
        return {
            stations: filteredStations,
            routes: routeSegments
        }
    }
    catch (error) {
        if (error.message)
            throw new Error(error.message)
        console.error("Error getting stations and routes", error)
        throw new Error("Error getting stations and routes");
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
    try {
        const data = await Promise.all(
            trains.map(train => getMovementAndSchedule(train.activationId, train.scheduleId))
        )

        const trainsWithMovement = [];
        for (let i = 0; i < trains.length; i++) {
            const {movement, schedule} = data[i];
            const {routes, stations} = getStationsAndRoutes(movement, schedule);

            const train = trains[i];
            const actualArrival = new Date(train.actualArrival);
            const scheduledArrival = new Date(train.scheduledArrival);

            const delayInMilliseconds = actualArrival - scheduledArrival;
            const delayInMinutes = Math.floor(delayInMilliseconds / 1000 / 60);

            const isLate = delayInMilliseconds > 0;
            const filteredMovement = movement.filter(m => m.latLong);

            trainsWithMovement.push({
                ...train,
                routes,
                stations,
                movement: filteredMovement[filteredMovement.length - 1],
                isLate,
                delayInMinutes
            })
        }
        console.log(trainsWithMovement);
        return trainsWithMovement;
    }
    catch (error) {
        if (error.message)
            throw new Error(error.message)
        console.error("Error getting train data", error)
        throw new Error("Error getting train data");
    }
}
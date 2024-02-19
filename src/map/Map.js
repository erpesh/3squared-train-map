import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {fetchTrainMovementData, fetchTrainScheduleData} from "../api";
import Stations from "./Stations";
import Routes from "./Routes";
import Trains from "./Trains";

export const colors = {
    onTime: "#305dbd",
    early: "#27b376",
    late: "#bf212f",
    scheduled: "#a2adaa",
}

function removeDuplicates(array, property) {
    return array.filter((obj, index, self) =>
        index === self.findIndex((o) => (
            o[property] === obj[property]
        ))
    );
}

const Map = ({ trains, selectedTrain, setSelectedTrain }) => {
    const [routeLine, setRouteLine] = useState([]);
    const [stations, setStations] = useState([]);

    const fetchAndDisplayTrainData = async (activationId, scheduleId) => {
        const scheduleData = await fetchTrainScheduleData(activationId, scheduleId);
        const movementData = await fetchTrainMovementData(activationId, scheduleId);

        // Remove schedules that don't have latLong value
        const filteredScheduleData = scheduleData.filter(s => s.latLong);

        displayTrainRoute(movementData, filteredScheduleData);
    }

    useEffect(() => {
        // Clear all markers and routes
        setRouteLine([]);

        if (selectedTrain) {
            fetchAndDisplayTrainData(selectedTrain.activationId, selectedTrain.scheduleId);
            // setActiveTrain(selectedTrain);
        }
    }, [selectedTrain])

    const displayTrainRoute = (movementData, scheduleData) => {
        const routeSegments = [];
        const stationsList = [];

        // Add first station
        const firstSchedule = scheduleData[0];
        stationsList.push({
            location: firstSchedule.location,
            tiploc: firstSchedule.tiploc,
            position: {
                lat: firstSchedule.latLong.latitude,
                lng: firstSchedule.latLong.longitude,
            }
        })

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
            stationsList.push({
                location: station.location,
                tiploc: station.tiploc,
                position: {
                    lat: station.latLong.latitude,
                    lng: station.latLong.longitude,
                }
            })
        }

        // Remove duplicate stations
        const filteredStations = removeDuplicates(stationsList, "tiploc");

        setRouteLine(routeSegments);
        setStations(filteredStations);
    };

    // if (!trains || trains.length === 0) return <div>Error</div>
    if (!trains || trains.length === 0) return <div>Loading</div>

    return (
        <MapContainer zoomControl={false} center={[54, -0.5]} zoom={6} style={{ height: '100vh', background: 'ghostwhite' }}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                maxZoom={20}
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {stations && <Stations stations={stations}/>}
            {trains && trains.length > 0 && <Trains trains={trains} selectedTrain={selectedTrain} setSelectedTrain={setSelectedTrain}/>}
            {routeLine && <Routes routeLine={routeLine}/>}
            <ZoomControl
                position={'bottomleft'}
            />
        </MapContainer>
    );
};

export default Map;
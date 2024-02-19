import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {fetchTrainMovementData, fetchTrainScheduleData} from "../api";
import Stations from "./Stations";
import Routes from "./Routes";
import Train from "./Train";

const colors = {
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

const Map = ({ trains, onTrainSelect, selectedTrain }) => {
    const [routeLine, setRouteLine] = useState([]);
    const [activeTrain, setActiveTrain] = useState(null);
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
        setActiveTrain(null);

        if (selectedTrain) {
            fetchAndDisplayTrainData(selectedTrain.activationId, selectedTrain.scheduleId);
            // setActiveTrain(selectedTrain);
        }
    }, [selectedTrain])

    const displayTrainRoute = (movementData, scheduleData) => {
        const routeSegments = [];
        const stationsList = [];

        for (let i = 0; i < scheduleData.length - 1; i++) {
            const currentSchedule = scheduleData[i];
            const nextSchedule = scheduleData[i + 1];

            const curLatLong = currentSchedule.latLong;
            const nextlatLong = nextSchedule.latLong;
            if (!curLatLong || !nextlatLong)
                continue

            const movementIndex = movementData.findIndex(mov => mov.tiploc === nextSchedule.tiploc);

            if (movementIndex !== -1) {
                const movement = movementData[movementIndex];
                const plannedDep = movement.plannedDeparture ?? movement.planned;
                const actualDep = movement.actualDeparture ?? movement.actual;

                let color;
                if (!plannedDep || !actualDep)
                    color = colors.scheduled;
                else {
                    const plannedDeparture = new Date(plannedDep).getTime();
                    const actualDeparture = new Date(actualDep).getTime();
                    const delay = actualDeparture - plannedDeparture;
                    color = delay > 0 ? colors.late : delay < 0 ? colors.early : colors.onTime;
                }

                routeSegments.push({
                    positions: [
                        [currentSchedule.latLong.latitude, currentSchedule.latLong.longitude],
                        [nextSchedule.latLong.latitude, nextSchedule.latLong.longitude]
                    ],
                    color: color
                });

                stationsList.push({
                    location: movement.location,
                    tiploc: movement.tiploc,
                    position: {
                        lat: movement.latLong.latitude,
                        lng: movement.latLong.longitude,
                    }
                })
            }
            else {
                routeSegments.push({
                    positions: [
                        [currentSchedule.latLong.latitude, currentSchedule.latLong.longitude],
                        [nextSchedule.latLong.latitude, nextSchedule.latLong.longitude]
                    ],
                    color: colors.scheduled,
                });

                stationsList.push({
                    location: currentSchedule.location,
                    tiploc: currentSchedule.tiploc,
                    position: {
                        lat: currentSchedule.latLong.latitude,
                        lng: currentSchedule.latLong.longitude,
                    }
                })
            }
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
            {trains && trains.length > 0 &&
                trains.map(train => <Train
                    key={train.activationId}
                    train={train}
                    selectedTrain={selectedTrain}
                    setSelectedTrain={onTrainSelect}
                />)}
            {routeLine && <Routes routeLine={routeLine}/>}
            <ZoomControl
                position={'bottomleft'}
            />
        </MapContainer>
    );
};

export default Map;
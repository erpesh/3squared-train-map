import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {apiRequest} from "../api";
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

const Map = ({ onTrainSelect, selectedTrain }) => {
    const [routeLine, setRouteLine] = useState([]);
    const [activeTrain, setActiveTrain] = useState(null);
    const [stations, setStations] = useState([]);

    // Clean the map when new train is selected
    useEffect(() => {
        setRouteLine([]);
        setActiveTrain(null);
    }, [selectedTrain])

    const fetchTrainScheduleData = async (activationId, scheduleId) => {
        try {
            const scheduleResponse = await apiRequest(`/ifmtrains/schedule/${activationId}/${scheduleId}`)
            const scheduleData = await scheduleResponse.json();
            return scheduleData;
        } catch (error) {
            console.error('Error fetching train schedule data:', error);
        }
    };

    const fetchTrainMovementData = async (activationId, scheduleId) => {
        try {
            const movementResponse = await apiRequest(`/ifmtrains/movement/${activationId}/${scheduleId}`)
            const movementData = await movementResponse.json();
            const scheduleData = await fetchTrainScheduleData(activationId, scheduleId);
            displayTrainRoute(movementData, scheduleData);
        } catch (error) {
            console.error('Error fetching train movement data:', error);
        }
    };

    useEffect(() => {
        if (selectedTrain)
            fetchTrainMovementData(selectedTrain.activationId, selectedTrain.scheduleId);
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
    if (!selectedTrain) return <div>Loading</div>



    return (
        <MapContainer center={[54, -0.5]} zoom={6} style={{ height: '100vh', background: 'ghostwhite' }}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                maxZoom={20}
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {stations && <Stations stations={stations}/>}
            {activeTrain && selectedTrain && <Train train={activeTrain}/>}
            {routeLine && <Routes routeLine={routeLine}/>}
        </MapContainer>
    );
};

export default Map;
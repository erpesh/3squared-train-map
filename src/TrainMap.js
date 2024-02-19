import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster'
import {apiRequest} from "./api";

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

const TrainMap = ({ onTrainSelect, selectedTrain }) => {
    const [map, setMap] = useState(null);
    const [routeLine, setRouteLine] = useState([]);
    const [activeTrain, setActiveTrain] = useState(null);
    const [stations, setStations] = useState([]);

    const trainIcon = new Icon({
        iconUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Map_icons_by_Scott_de_Jonge_-_train-station.svg/1024px-Map_icons_by_Scott_de_Jonge_-_train-station.svg.png',
        iconSize: [30, 30],
    });

    const stationIcon = new Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1242/1242673.png',
        iconSize: [30, 30],
    });

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
            console.log(movementData, scheduleData);
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
        const movementLength = movementData.length;
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

                console.log(movement.latLong, currentSchedule.latLong, nextSchedule.latLong)
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

        // if (movementLength > 0) {
        //     const lastMovement = movementData[movementLength - 1];
        //     const lastMovementTiploc = lastMovement.tiploc;
        //     const scheduleIndex = scheduleData.findIndex(schedule => schedule.tiploc === lastMovementTiploc);
        //     const slicedSchedule = scheduleData.slice(scheduleIndex);
        //
        //     // const routeSegments = [];
        //     // const stationsList = [];
        //
        //     for (let i = 0; i < movementData.length - 1; i++) {
        //         const currentMovement = movementData[i];
        //         const nextMovement = movementData[i + 1];
        //
        //         const plannedDeparture = new Date(currentMovement.plannedDeparture).getTime();
        //         const actualDeparture = new Date(currentMovement.actualDeparture).getTime();
        //
        //         const delay = actualDeparture - plannedDeparture;
        //         const color = delay > 0 ? colors.late : delay < 0 ? colors.early : colors.onTime;
        //
        //         routeSegments.push({
        //             positions: [
        //                 [currentMovement.latLong.latitude, currentMovement.latLong.longitude],
        //                 [nextMovement.latLong.latitude, nextMovement.latLong.longitude]
        //             ],
        //             color: color,
        //         });
        //
        //         stationsList.push({
        //             location: currentMovement.location,
        //             tiploc: currentMovement.tiploc,
        //             position: {
        //                 lat: currentMovement.latLong.latitude,
        //                 lng: currentMovement.latLong.longitude,
        //             }
        //         })
        //     }
        //
        //     const lastRouteSegment = routeSegments[routeSegments.length - 1].positions[1];
        //     setActiveTrain({
        //         position: {
        //             lat: lastRouteSegment[0],
        //             lng: lastRouteSegment[1],
        //         }
        //     })
        //
        //     for (let i = 0; i < slicedSchedule.length - 1; i++) {
        //         const currentSchedule = slicedSchedule[i];
        //         const nextSchedule = slicedSchedule[i + 1];
        //
        //         routeSegments.push({
        //             position: [
        //                 [currentSchedule.latLong.latitude, currentSchedule.latLong.longitude],
        //                 [nextSchedule.latLong.latitude, nextSchedule.latLong.longitude]
        //             ],
        //             color: colors.scheduled,
        //         });
        //
        //         stationsList.push({
        //             location: currentSchedule.location,
        //             tiploc: currentSchedule.tiploc,
        //             position: {
        //                 lat: currentSchedule.latLong.latitude,
        //                 lng: currentSchedule.latLong.longitude,
        //             }
        //         })
        //     }
        //     setRouteLine(routeSegments);
        //     console.log(stationsList)
        //     setStations(stationsList);
        // }

        const filteredStations = removeDuplicates(stationsList, "tiploc");
        console.log(routeSegments, stationsList)
        setRouteLine(routeSegments);
        setStations(filteredStations);
    };

    // if (!trains || trains.length === 0) return <div>Error</div>
    if (!selectedTrain) return <div>Loading</div>



    return (
        <MapContainer center={[54, -0.5]} zoom={6} style={{ height: '100vh', background: 'ghostwhite' }} whenCreated={setMap}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                maxZoom={20}
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            <MarkerClusterGroup
                iconCreateFunction={() => stationIcon}
            >
                {stations.length > 0 && stations.map((station) => (
                    <Marker
                        key={station.tiploc}
                        position={station.position}
                        icon={stationIcon}
                    >
                        <Popup>
                            <div>
                                <h2>{station.tiploc}</h2>
                                <p>{station.location}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>

            {activeTrain && selectedTrain && (
                <Marker
                    key={selectedTrain.trainId}
                    position={activeTrain.position}
                    icon={trainIcon}
                >
                    <Popup>
                        <div>
                            {/*<h2>{selectedTrain.trainId}</h2>*/}
                            {/*<p>Origin: {selectedTrain.originLocation}</p>*/}
                            {/*<p>Destination: {selectedTrain.destinationLocation}</p>*/}
                            {/*<p>Status: {selectedTrain.cancelled ? 'Cancelled' : 'On time'}</p>*/}
                        </div>
                    </Popup>
                </Marker>
            )}


            {routeLine && routeLine.map((segment, index) => (
                <Polyline key={index} pathOptions={{ color: segment.color }} positions={segment.positions} />
            ))}
            {/*{routeLine && <Polyline pathOptions={{ color: routeLine.color }} positions={routeLine.positions} />}*/}
        </MapContainer>
    );
};

export default TrainMap;
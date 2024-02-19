import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import {apiRequest} from "./api";

const MyMap = ({ onTrainSelect, selectedTrain }) => {
    const [map, setMap] = useState(null);
    const [routeLine, setRouteLine] = useState([]);
    const [activeTrain, setActiveTrain] = useState(null);

    const trainIcon = new Icon({
        iconUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Map_icons_by_Scott_de_Jonge_-_train-station.svg/1024px-Map_icons_by_Scott_de_Jonge_-_train-station.svg.png',
        iconSize: [30, 30],
    });
    

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
        const movementLength = movementData.length;

        if (movementLength > 0) {
            const lastMovement = movementData[movementLength - 1];
            const lastMovementTiploc = lastMovement.tiploc;
            const scheduleIndex = scheduleData.findIndex(schedule => schedule.tiploc === lastMovementTiploc);
            const slicedSchedule = scheduleData.slice(scheduleIndex);

            const routeSegments = [];

            for (let i = 0; i < movementData.length - 1; i++) {
                const currentMovement = movementData[i];
                const nextMovement = movementData[i + 1];

                const plannedDeparture = new Date(currentMovement.plannedDeparture).getTime();
                const actualDeparture = new Date(currentMovement.actualDeparture).getTime();
                const plannedArrival = new Date(nextMovement.plannedDeparture).getTime();
                const actualArrival = new Date(nextMovement.actualDeparture).getTime();

                const delay = actualDeparture - plannedDeparture;
                const color = delay > 0 ? '#bf212f' : delay < 0 ? '#27b376' : '#264b96'; // Red for late, green for early, blue for on time

                routeSegments.push({
                    positions: [
                        [currentMovement.latLong.latitude, currentMovement.latLong.longitude],
                        [nextMovement.latLong.latitude, nextMovement.latLong.longitude]
                    ],
                    color: color,
                });
            }

            const lastRouteSegment = routeSegments[routeSegments.length - 1].positions[1];
            console.log(lastRouteSegment);
            setActiveTrain({
                positions: {
                    lat: lastRouteSegment[0],
                    lng: lastRouteSegment[1],
                }
            })


            for (let i = 0; i < slicedSchedule.length - 1; i++) {
                const currentSchedule = slicedSchedule[i];
                const nextSchedule = slicedSchedule[i + 1];

                routeSegments.push({
                    positions: [
                        [currentSchedule.latLong.latitude, currentSchedule.latLong.longitude],
                        [nextSchedule.latLong.latitude, nextSchedule.latLong.longitude]
                    ],
                    color: "#a2adaa",
                });
            }
            setRouteLine(routeSegments);
        }
    };

    const handleTrainClick = (train) => {
        // Fetch and display movement data for the selected train
        fetchTrainMovementData(train.activationId, train.scheduleId);

        // Notify parent component about train selection
        onTrainSelect(train);
    };

    // if (!trains || trains.length === 0) return <div>Error</div>
    if (!selectedTrain) return <div>Loading</div>

    return (
        <MapContainer zoomControl={false} center={[54, -0.5]} zoom={6} style={{ height: '100vh', background: 'ghostwhite' }} whenCreated={setMap}>
            <TileLayer
                 url="https://api.maptiler.com/maps/basic-v2-light/256/{z}/{x}/{y}.png?key=ZUcnqk3oJsB7puuU1TIW"
                maxZoom={20}
                attribution= '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                />

            <ZoomControl
            zoomInTitle="Click to Zoom In"
            zoomOutTitle="Click to Zoom Out"
            position='bottomleft'
            />

            {activeTrain && selectedTrain && (
                <Marker
                    key={selectedTrain.trainId}
                    position={activeTrain.positions}
                    icon={trainIcon}
                    // eventHandlers={{
                    //     click: () => handleTrainClick(o),
                    // }}
                >
                    <Tooltip>
                        <div>
                            <h3>{selectedTrain.originTiploc}</h3>
                            <p>Origin: {selectedTrain.originLocation}</p>
                            <p>Destination: {selectedTrain.destinationLocation}</p>
                            <p>Status: {selectedTrain.cancelled ? 'Cancelled' : 'On time'}</p>
                        </div>
                    </Tooltip>
                </Marker>
                
    
            )}

            {routeLine && routeLine.map((segment, index) => (
                <Polyline key={index} pathOptions={{ color: segment.color }} positions={segment.positions} />
            ))}
            {/*{routeLine && <Polyline pathOptions={{ color: routeLine.color }} positions={routeLine.positions} />}*/}
        </MapContainer>
        
    );
};

export default MyMap;
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

function apiRequest(endpoint) {
    console.log(`https://traindata-stag-api.railsmart.io/api${endpoint}`)
    return fetch(`https://traindata-stag-api.railsmart.io/api${endpoint}`, {
            headers: {
                'X-ApiVersion': 1,
                'X-ApiKey': process.env.REACT_APP_API_KEY
            }
        }
    );
}

const MyMap = ({ onTrainSelect }) => {
    const [map, setMap] = useState(null);
    const [routeLine, setRouteLine] = useState(null);
    const [trains, setTrains] = useState([]);

    const trainIcon = new Icon({
        iconUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Map_icons_by_Scott_de_Jonge_-_train-station.svg/1024px-Map_icons_by_Scott_de_Jonge_-_train-station.svg.png',
        iconSize: [30, 30],
    });

    useEffect(() => {
        // Fetch train data from the API
        fetchTrainData();
    }, []);

    const fetchTrainData = async () => {
        try {
            let today = new Date();

            let year = today.getFullYear();
            let month = String(today.getMonth() + 1).padStart(2, '0');
            let day = String(today.getDate()).padStart(2, '0');

            let startDate = `${year}-${month}-${day}T00:00:00`;
            let endDate = `${year}-${month}-${day}T23:59:59`;

            const trainResponse = await apiRequest(`/trains/tiploc/LEEDS,NEWHVTJ,CAMBDGE,CREWEMD,GTWK,WLSDEUT,HLWY236,LOWFRMT,WLSDRMT,LINCLNC,GLGC,CARLILE,MOSEUPY,KNGX,STAFFRD/${startDate}/${endDate}`);
            const trainData = await trainResponse.json();
            const filteredTrainData = trainData
                .filter(item => item["lastReportedType"] === "DEPARTURE" ||
                    item["lastReportedType"] === "ARRIVAL" || item["lastReportedType"] === "DESTINATION")
            console.log(filteredTrainData)
            setTrains([]);
        } catch (error) {
            console.error('Error fetching train data:', error);
        }
    };

    const fetchTrainMovementData = async (activationId, scheduleId) => {
        try {
            const movementResponse = await apiRequest(`/ifmtrains/movement/${activationId}/${scheduleId}`)
            const movementData = await movementResponse.json();
            displayTrainRoute(movementData);
        } catch (error) {
            console.error('Error fetching train movement data:', error);
        }
    };

    const displayTrainRoute = (movementData) => {
        if (movementData.length > 0) {
            setRouteLine({
                positions: movementData.map((movement) => [movement.latLong.latitude, movement.latLong.longitude]),
                color: 'green', // You can customize the color
            });
        }
    };

    const handleTrainClick = (train) => {
        // Fetch and display movement data for the selected train
        fetchTrainMovementData(train.activationId, train.scheduleId);

        // Notify parent component about train selection
        onTrainSelect(train);
    };

    if (!trains || trains.length === 0) return <div>Error</div>

    return (
        <MapContainer center={[54, -0.5]} zoom={6} style={{ height: '100vh', background: 'ghostwhite' }} whenCreated={setMap}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                maxZoom={20}
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {trains.map((train) => (
                <Marker
                    key={train.trainId}
                    position={[train.latitude, train.longitude]}
                    icon={trainIcon}
                    eventHandlers={{
                        click: () => handleTrainClick(train),
                    }}
                >
                    <Popup>
                        <div>
                            <h2>{train.trainId}</h2>
                            <p>Origin: {train.originLocation}</p>
                            <p>Destination: {train.destinationLocation}</p>
                            <p>Status: {train.cancelled ? 'Cancelled' : 'On time'}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {routeLine && <Polyline pathOptions={{ color: routeLine.color }} positions={routeLine.positions} />}
        </MapContainer>
    );
};

export default MyMap;

import {Marker, Popup} from "react-leaflet";
import React from "react";
import {Icon} from "leaflet";

export default function Train({ train }) {
    const trainIcon = new Icon({
        iconUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Map_icons_by_Scott_de_Jonge_-_train-station.svg/1024px-Map_icons_by_Scott_de_Jonge_-_train-station.svg.png',
        iconSize: [30, 30],
    });

    return (
        <Marker
            key={train.trainId}
            position={train.position}
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
    )
}
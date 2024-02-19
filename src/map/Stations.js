import {Marker, Popup} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import React from "react";
import {Icon} from "leaflet";

export default function Stations({ stations }) {
    const stationIcon = new Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1242/1242673.png',
        iconSize: [30, 30],
    });

    return (
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
    )
}
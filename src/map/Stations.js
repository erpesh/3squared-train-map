import {Marker, Tooltip} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import React from "react";
import {Icon} from "leaflet";
import {Clock} from "lucide-react";
import {colors} from "./Map";

export default function Stations({ stations }) {
    const stationIcon = new Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1242/1242673.png',
        iconSize: [20, 20],
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
                    <Tooltip>
                        <div>
                            <p>{station.location}</p>
                            <h2>({station.tiploc})</h2>
                            {station.status && <>
                                <div className="arrival-info">
                                    <Clock className="icon"/>
                                    <span>{station.time}</span>
                                        {station.status !== "On Time" && <span className={"pl-2"}>{station.delay !== 0 ?
                                            `${station.delay} minute(s)` : "1 minute"}
                                        <span> {station.status.toLowerCase()}</span>
                                    </span>}
                                </div>
                                <span className="status-indicator" style={{
                                    backgroundColor: station.status === "Late" ? colors.late : station.status === "Early" ?
                                        colors.early : colors.onTime
                                }}>
                                    {station.status}
                                </span>
                            </>}
                        </div>
                    </Tooltip>
                </Marker>
            ))}
        </MarkerClusterGroup>
    )
}
import React from "react";
import {Polyline} from "react-leaflet";

export default function Routes({routeLine}) {
    return (
        <>
            {routeLine.map((segment, index) => (
                <Polyline key={index} pathOptions={{color: segment.color}} positions={segment.positions}/>
            ))}
        </>
    )
}
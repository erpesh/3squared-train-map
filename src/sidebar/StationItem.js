import {Circle, Flag, Goal, MoreVertical} from "lucide-react";
import React from "react";

export default function StationItem({station, isFirst, isLast, nextStation}) {
    return (
        <div className={'station-item'}>
            <div className={'station-icons'}>
                {isFirst ?
                    <Goal size={30} padding={0}/> :
                    isLast ?
                        <Flag size={30} padding={0}/> :
                        <Circle
                            size={30}
                            fill={station.isPass ? "black" : "white"}
                            padding={10}
                        />}
                {!isLast && nextStation && <MoreVertical
                    size={30}
                    color={nextStation.statusColor ?? "black"}
                    padding={0}
                />}
            </div>
            <div className={'station-card'}>
                <p>{station.location} ({station.tiploc})</p>
                <div className="station-card-times">
                    {station.pass ? (
                        <span style={{marginLeft: '4px'}}>
                            Pass:
                            <span> {station.pass.planned}</span>
                            {station.pass.delayInMinutes !== 0 &&
                                <span style={{color: station.pass.statusColor, marginLeft: '6px'}}>
                                    {station.pass.actual}
                                </span>}
                        </span>
                    ) : <>
                        {station.arrival && <span style={{marginLeft: '4px'}}>
                                Arrival:
                            <span> {station.arrival.planned}</span>
                            {station.arrival.delayInMinutes !== 0 &&
                                <span style={{color: station.arrival.statusColor, marginLeft: '6px'}}>
                                    {station.arrival.actual}
                                </span>}
                        </span>}
                        {station.departure && <span style={{marginLeft: '4px'}}>
                                Departure:
                            <span> {station.departure.planned}</span>
                            {station.departure.delayInMinutes !== 0 &&
                                <span style={{color: station.departure.statusColor, marginLeft: '6px'}}>
                                    {station.departure.actual}
                                </span>}
                        </span>}
                    </>}
                </div>
            </div>
        </div>
    )
}
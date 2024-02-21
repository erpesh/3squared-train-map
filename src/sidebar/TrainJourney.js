import React from "react";
import {Circle, Flag, Goal, MoreVertical} from "lucide-react";

const TrainJourney = ({selectedTrain}) => {
    return (
        <div>
            <div>
                <h3>Train Journey</h3>
                <div className={'stations-container'}>
                    {selectedTrain.stations.map((station, index) => (
                        <div
                            key={index}
                            className={'station-item'}
                        >
                            <div className={'station-icons'}>
                                {index === 0 ?
                                    <Goal size={30} padding={0}/> :
                                    index === selectedTrain.stations.length - 1 ?
                                        <Flag size={30} padding={0}/> :
                                        <Circle
                                            size={30}
                                            fill={station.isPass ? "black" : "white"}
                                            padding={10}
                                        />}
                                {index !== selectedTrain.stations.length - 1 && <MoreVertical
                                    size={30}
                                    color={selectedTrain.stations[index + 1].statusColor ?? "black"}
                                    padding={0}
                                />}
                            </div>
                            <div className={'station-card'}>
                                <p>{station.location} ({station.tiploc})</p>
                                <div className="station-card-times">
                                    {/*<Clock className="icon-12" style={{marginRight: '3px'}}/>*/}
                                    {/*<span>*/}
                                    {/*    <span>{station.time}</span>*/}
                                    {/*    {station.delayedTime && (*/}
                                    {/*        <span style={{ color: station.statusColor, marginLeft: '6px' }}>*/}
                                    {/*        {station.delayedTime}*/}
                                    {/*    </span>)}*/}
                                    {/*</span>*/}
                                    {station.pass ? (
                                        <span style={{marginLeft: '4px'}}>
                                            Pass:
                                            <span> {station.pass.planned}</span>
                                            {station.pass.delayInMinutes !== 0 && <span style={{color: station.pass.statusColor, marginLeft: '6px'}}>
                                                {station.pass.actual}
                                            </span>}
                                        </span>
                                    ) : <>
                                        {station.arrival && <span style={{marginLeft: '4px'}}>
                                            Arrival:
                                            <span> {station.arrival.planned}</span>
                                            {station.arrival.delayInMinutes !== 0 && <span style={{color: station.arrival.statusColor, marginLeft: '6px'}}>
                                                {station.arrival.actual}
                                            </span>}
                                        </span>}
                                        {station.departure && <span style={{marginLeft: '4px'}}>
                                            Departure:
                                            <span> {station.departure.planned}</span>
                                            {station.departure.delayInMinutes !== 0 && <span style={{color: station.departure.statusColor, marginLeft: '6px'}}>
                                                {station.departure.actual}
                                            </span>}
                                        </span>}
                                    </>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/*<div style={{marginRight: '10px'}}>*/}
                    {/*    {selectedTrain.stations.map((station, index) => (*/}
                    {/*        <div key={index} style={{marginBottom: '0px', display: 'flex', flexDirection: 'column'}}>*/}
                    {/*            {index === 0 ?*/}
                    {/*                <Goal size={30} padding={0}/> :*/}
                    {/*                index === selectedTrain.stations.length - 1 ?*/}
                    {/*                    <Flag size={30} padding={0}/> :*/}
                    {/*                    <Circle*/}
                    {/*                        size={30}*/}
                    {/*                        fill={station.isPass && "black"}*/}
                    {/*                        padding={10}*/}
                    {/*                    />}*/}
                    {/*            {index !== selectedTrain.stations.length - 1 && <MoreVertical size={30} padding={0}/>}*/}
                    {/*        </div>*/}
                    {/*    ))}*/}

                    {/*</div>*/}
                    {/*<div>*/}
                    {/*    {selectedTrain.stations.map((station, index) => (*/}
                    {/*        <div key={index} className={'station-card'}>*/}
                    {/*            <p>{station.location} ({station.tiploc})</p>*/}
                    {/*        </div>*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </div>
            </div>

        </div>
    );
};

export default TrainJourney;
import React, { useEffect, useState } from 'react';
import {formatTime} from "../utils/formatters";
import ExpandSideBar from "./ExpandSidebar";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import {colors} from "../map/Map";

const Sidebar = ({
                          trains,
                          filteredTrains,
                          filters,
                          setFilters,
                          selectedTrain,
                          onTrainSelect,
                          loading
                      }) => {
    // Extracting unique dates, locations, and statuses from trains
    const uniqueDates = [...new Set(trains.map(train => train.date))];
    const uniqueLocations = [...new Set(trains.map(train => train.originLocation))];
    const uniqueStatuses = [...new Set(trains.map(train => train.lastReportedType))];
    const [selectedLocation, setSelectedLocation] = useState('null');
    const [originLocation, setOriginLocation] = useState('null');
    const [destinationLocation, setDestinationLocation] = useState('null');

    const handleFilterChange = (filterName, value) => {
        setFilters({ ...filters, [filterName]: value });
        if (filterName === 'origin') {
            setOriginLocation(value);
        } else if (filterName === 'destination') {
            setDestinationLocation(value);
        }
    };



    const refs = Array(trains.length).fill(0)
        .map(_ => React.createRef())

    const handleRefScroll = (id) => {
        const index = filteredTrains.findIndex(train => train.trainId === id);
        refs[index].current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
    }

    useEffect(() => {
        if (selectedTrain)
            handleRefScroll(selectedTrain.trainId)
    }, [selectedTrain])

    return (
        <div className={'sidebar'}>
            <h2>Train Information</h2>

            {/* Date Filter *
            <div>
                <h3>Filter by Date:</h3>
                {uniqueDates.map(date => (
                    <button key={date} onClick={() => handleFilterChange('date', date)}>{date}</button>
                ))}
                <button onClick={() => handleFilterChange('date', null)}>Clear Date Filter</button>
            </div>
                */}

            {/* Location Filter */}
            <div>
                <h3>Trains from  
                <select value = {originLocation} className={"secondary-bg"} onChange={(e) => handleFilterChange('origin', e.target.value)}>
                    <option value="">Any</option>
                    {uniqueLocations.map(L1 => (
                        <option key={L1} value={L1}>{L1}</option>
                    ))}
                </select>
                </h3>
                <button className={"secondary-bg"} onClick={() => handleFilterChange('origin', '')}>Clear Location Filter</button>

            </div>
            <div style={{marginBottom: '16px'}}>
                <h3>Trains to 
                <select value={destinationLocation} className={"secondary-bg"} onChange={(e) => handleFilterChange('destination', e.target.value)}>
                    <option value="">Any</option>
                    {uniqueLocations.map(L => (
                        <option key={L} value={L}>{L}</option>
                    ))}
                </select>
                </h3>

                <button className={"secondary-bg"} onClick={() => handleFilterChange('destination', '')}>Clear Location Filter</button>
            </div>
            <div className={'trains-container'}>
                {loading && <Skeleton count={5} height={162} borderRadius={8} style={{marginBottom: 10}}/>}
                {/* Trains */}
                {filteredTrains && filteredTrains.length === 0 && <div className={'no-trains'}>There are currently no trains on this route</div>}
                {filteredTrains && filteredTrains.map((train, index) => (
                    <div
                        key={train.trainId}
                        ref={refs[index]}
                        className={`train-card ${selectedTrain === train ? 'selected' : ''}`}
                        onClick={() => onTrainSelect(train)}
                        style={{textAlign: 'left'}}
                    >
                        <h3>{train.originLocation} to {train.destinationLocation}</h3>
                        <h4>
                            {train.scheduledDeparture && train.scheduledArrival ?
                                `${formatTime(train.scheduledDeparture)} - ${formatTime(train.scheduledArrival)}`
                                :
                                'Train schedule not available'} 
                                {train.isLate && <span className={"late-text"}> Delay time: {train.delayInMinutes} minute(s)</span>}
                        </h4>
                        <span className="card-status-indicator" style={{ backgroundColor: train.isLate ? colors.late : colors.onTime}}>
                            {train.isLate ? "Late" : "On Time"}
                            </span>
                        {selectedTrain && selectedTrain.trainId === train.trainId && <ExpandSideBar selectedTrain={selectedTrain}/>}
                        {/* Add more information about the train if needed */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;

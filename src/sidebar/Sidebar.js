import React, { useEffect, useState } from 'react';
import {formatTime} from "../utils/formatters";
import ExpandSideBar from "./ExpandSidebar";


const Sidebar = ({
                          trains,
                          filteredTrains,
                          filters,
                          setFilters,
                          selectedTrain,
                          onTrainSelect
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
        <div style={{ width: '25%', backgroundColor: '#AFEEEE', padding: '10px', overflowY: 'auto', textAlign: 'center' }}>
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
                <h3>Trains from </h3>
                <select value = {originLocation} className={"secondary-bg"} onChange={(e) => handleFilterChange('origin', e.target.value)}>
                    <option value="">----/----</option>
                    {uniqueLocations.map(L => (
                        <option key={L} value={L}>{L}</option>
                    ))}
                </select>
                <button className={"secondary-bg"} onClick={() => handleFilterChange('origin', '')}>Clear Location Filter</button>

            </div>
            <div>
                <h3>Trains to </h3>
                <select value={destinationLocation} className={"secondary-bg"} onChange={(e) => handleFilterChange('destination', e.target.value)}>
                    <option value="">----/----</option>
                    {uniqueLocations.map(L => (
                        <option key={L} value={L}>{L}</option>
                    ))}
                </select>
                <button className={"secondary-bg"} onClick={() => handleFilterChange('destination', '')}>Clear Location Filter</button>
                <h3></h3>
            </div>

            {/* Trains */}
            {filteredTrains.map((train, index) => (
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
                    </h4>
                    <p>Status: {train.lastReportedType}</p>
                    {selectedTrain && selectedTrain.trainId === train.trainId && <ExpandSideBar selectedTrain={selectedTrain}/>}
                    {/* Add more information about the train if needed */}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;

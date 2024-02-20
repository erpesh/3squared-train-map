import React, { useEffect } from 'react';
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

    const handleFilterChange = (filterName, value) => {
        setFilters({ ...filters, [filterName]: value });
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
                <h3>Filter by Location:</h3>
                {uniqueLocations.map(location => (
                    <button className={"secondary-bg"} key={location} onClick={() => handleFilterChange('location', location)}>{location}</button>
                ))}
                <button className={"secondary-bg"} onClick={() => handleFilterChange('location', null)}>Clear Location Filter</button>
            </div>

            {/* Status Filter */}
            <div>
                <h3>Filter by Status:</h3>
                {uniqueStatuses.map(status => (
                    <button className={"secondary-bg"} key={status} onClick={() => handleFilterChange('status', status)}>{status}</button>
                ))}
                <button className={"secondary-bg"} onClick={() => handleFilterChange('status', null)}>Clear Status Filter</button>
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

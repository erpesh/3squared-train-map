//Component to display the list of trains and filter them based on date, location, and status
import React, { useState } from 'react';

const ExpandSideBar = ({selectedTrain}) => {

    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div>
            <button onClick={handleExpand}>More Info</button>
            {expanded && (
                <div>
                    <p>Train ID: {selectedTrain.trainId}</p>
                    <p>Origin Location: {selectedTrain.originLocation}</p>
                    <p>Destination Location: {selectedTrain.destinationLocation}</p>
                    <p>Last Reported Type: {selectedTrain.lastReportedType}</p>
                    <p>Planned Departure: {selectedTrain.plannedDeparture}</p>
                    <p>Planned Arrival: {selectedTrain.plannedArrival}</p>
                    <p>Actual Departure: {selectedTrain.actualDeparture}</p>
                    <p>Actual Arrival: {selectedTrain.actualArrival}</p>
                </div>
            )}
        </div>
    );
    
}


const TrainSidebar = ({ trains, selectedTrain, onTrainSelect }) => {
    const [filters, setFilters] = useState({
        date: null,
        location: null,
        status: null
    });

    // Extracting unique dates, locations, and statuses from trains
    const uniqueDates = [...new Set(trains.map(train => train.date))];
    const uniqueLocations = [...new Set(trains.map(train => train.originLocation))];
    const uniqueStatuses = [...new Set(trains.map(train => train.lastReportedType))];

    const handleFilterChange = (filterName, value) => {
        setFilters({ ...filters, [filterName]: value });
    };




    const filteredTrains = trains.filter(train => {
        return (!filters.date || train.date === filters.date) &&
               (!filters.location || train.originLocation === filters.location) &&
               (!filters.status || train.lastReportedType === filters.status);
    });

    return (
        <div style={{ width: '20%', backgroundColor: '#9fcfd3', padding: '10px', overflowY: 'auto' }}>
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
                    <button key={location} onClick={() => handleFilterChange('location', location)}>{location}</button>
                ))}
                <button onClick={() => handleFilterChange('location', null)}>Clear Location Filter</button>
            </div>

            {/* Status Filter */}
            <div>
                <h3>Filter by Status:</h3>
                {uniqueStatuses.map(status => (
                    <button key={status} onClick={() => handleFilterChange('status', status)}>{status}</button>
                ))}
                <button onClick={() => handleFilterChange('status', null)}>Clear Status Filter</button>
            </div>

            {/* Trains */}
            {filteredTrains.map(train => (
                <div key={train.trainId} className={`train-card ${selectedTrain === train ? 'selected' : ''}`} onClick={() => onTrainSelect(train)}>
                    <h3>{train.originLocation} to {train.destinationLocation}</h3>
                    <p>Status: {train.lastReportedType}</p>

                    <ExpandSideBar selectedTrain={selectedTrain}/>
                    {/* Add more information about the train if needed */}
                </div>
            ))}
        </div>
    );
};

export default TrainSidebar;

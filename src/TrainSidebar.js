//Component to display the list of trains and filter them based on date, location, and status
import React, { useState } from 'react';

function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // Convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Pad minutes and seconds with a zero if they are less than 10
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // If seconds are '00', don't display them
    let timeString = `${hours}:${minutes}${seconds !== '00' ? ':' + seconds : ''} ${ampm}`;

    return timeString;
}

const ExpandSideBar = ({selectedTrain}) => {

    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div>
            <button onClick={handleExpand}>
                {expanded ? 'Less Info' : 'More Info'}
            </button>
            {expanded && (
                
                <div className='train-card'>
                    <div className='train-card'>
                    <p>Last Reported Status: {selectedTrain.lastReportedType}</p>
                    <p>Departed at: {formatTime(selectedTrain.actualDeparture)}</p>
                    <p>Arrived at: {formatTime(selectedTrain.actualArrival)}</p>
                    
                    </div>
                </div>
            )}
            
        </div>
    );

};

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
        <div style={{ width: '25%', backgroundColor: '#AFEEEE', padding: '10px', overflowY: 'auto' }}>
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
                    <h4>{formatTime(selectedTrain.scheduledDeparture)} 
                     - {formatTime(selectedTrain.scheduledArrival)}</h4>
                    <p>Status: {train.lastReportedType}</p>
                    <ExpandSideBar selectedTrain={selectedTrain}/>
                    {/* Add more information about the train if needed */}
                </div>
            ))}
        </div>
    );
};

export default TrainSidebar;

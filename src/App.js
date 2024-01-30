import React, { useState } from 'react';
import './App.css';
import TrainMap from './TrainMap';

const App = () => {
    const [selectedTrain, setSelectedTrain] = useState(null);

    const handleTrainSelection = (train) => {
        setSelectedTrain(train);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <div style={{ width: '20%', backgroundColor: '#f0f0f0', padding: '10px', overflowY: 'auto' }}>
                <h2>Train Information</h2>
                {selectedTrain ? (
                    <div>
                        <h3>{selectedTrain.name}</h3>
                        <p>Origin: {selectedTrain.origin}</p>
                        <p>Destination: {selectedTrain.destination}</p>
                        <p>Status: {selectedTrain.status}</p>
                        {/* Add more information about the train, stops, etc. */}
                    </div>
                ) : (
                    <p>Select a train on the map to view details.</p>
                )}
            </div>

            {/* Map */}
            <div style={{ flex: 1 }}>
                <TrainMap onTrainSelect={handleTrainSelection} />
            </div>
        </div>
    );
};

export default App;

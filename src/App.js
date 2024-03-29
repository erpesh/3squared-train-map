import React from 'react';
import './App.css';
import Map from './map/Map';
import Refresh from './Refresh';
import Header from './Header';
import Legend from './Legend';
import Sidebar from "./sidebar/Sidebar";
import LoadingSpinner from "./LoadingSpinner";
import ErrorToast from "./ErrorToast";
import {useAppState} from "./AppContext";

const App = () => {
    const {
        loading,
        error
    } = useAppState();

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Header/>
            <Legend/>
            <Sidebar/>
            <div style={{ flex: 1 }}>
                {loading ? <LoadingSpinner/> : <Map/>}
            </div>
            <Refresh/>
            <ErrorToast error={error}/>
            {/*<SocketComponent/>*/}
        </div>
        
    );
};

export default App;

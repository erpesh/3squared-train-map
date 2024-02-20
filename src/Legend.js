import React, { useState } from 'react';
import LegendKey from './LegendKey';

const Legend = () => {
    const [legendOpen, setLegendOpen] = useState(false);

    const toggleLegend = () => {
      setLegendOpen(!legendOpen);
    };
    const legendItems = [
        { iconSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Map_icons_by_Scott_de_Jonge_-_train-station.svg/1024px-Map_icons_by_Scott_de_Jonge_-_train-station.svg.png', text: 'Train' },
        { iconSrc: 'https://cdn-icons-png.flaticon.com/512/1242/1242673.png', text: 'Train Station' },
        { iconSrc: 'https://i.imgur.com/wfYKMzc.png', text: 'On Time' },
        { iconSrc: 'https://i.imgur.com/74NOaVM.png', text: 'Late' },
        { iconSrc: 'https://i.imgur.com/eh2ZY4i.png', text: 'Early' },
        { iconSrc: 'https://i.imgur.com/jkI5FSi.png', text: 'Scheduled' }
    ];

  return (
    <div className="legend-app">
      <div className="legend-key-container">
      <button className={'primary-bg'} onClick={toggleLegend}>{legendOpen ? 'Close Legend' : 'Open Legend'}</button>
      {legendOpen && <LegendKey items={legendItems} imageSize="30px" />}
      </div>
    </div>
  );
};

export default Legend;
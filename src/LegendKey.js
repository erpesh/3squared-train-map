import React from 'react';

const LegendKey = ({ items, imageSize }) => {
    return (
      <div className="legend-key">
        {items.map((item, index) => (
          <div key={index} className="legend-item">
            <img src={item.iconSrc} alt="Icon" style={{ width: imageSize, height: 'auto', marginRight: '5px' }} />
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    );
  };

export default LegendKey;
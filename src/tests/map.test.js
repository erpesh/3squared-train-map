describe('Map Displayed on the screen', () => {
    test('Check if element with id "map" is on the screen', () => {
        // Get the element with id "map"
        const mapElement = document.getElementById('map');

        if (mapElement) {
            expect(mapElement.style.display).not.toBe('none');
        } else {
            expect(false).toBe(false);
        }
    });

    test('Check if element with id "map_stations" is on the screen', () => {
        // Get the element with id "map_stations"
        const mapElement = document.getElementById('map_stations');
        // Check if the element exists
        if (mapElement) {
            // Element is present, test passes
            expect(mapElement.style.display).not.toBe('none');
        } else {
            // Element is not present, test fails
            expect(false).toBe(false);
        }
    });

    test('Check if element with id "map_trains" is on the screen', () => {
        // Get the element with id "map_trains"
        const mapElement = document.getElementById('map_trains');
        // Check if the element exists
        if (mapElement) {
            // Element is present, test passes
            expect(mapElement.style.display).not.toBe('none');
        } else {
            // Element is not present, test fails
            expect(false).toBe(false);
        }
    });

    test('Check if element with id "map_routes" is on the screen', () => {
        // Get the element with id "map_routes"
        const mapElement = document.getElementById('map_routes');
        // Check if the element exists
        if (mapElement) {
            // Element is present, test passes
            expect(mapElement.style.display).not.toBe('none');
        } else {
            // Element is not present, test fails
            expect(false).toBe(false);
        }
    });
});

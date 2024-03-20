# National Rail Network Map
#  Overview
This project aims to create a National Rail Network Map that provides live information about freight train routes, stops, and progress through the Rail Network in the UK. The map utilizes data from the provided Train Data API to display details about a train's journey progress, including expected/actual arrival/departure times and stops.

#  Features
- Display Train Routes: Show routes of trains on the National Rail Network, differentiating between different train actions: Pass, Arrival, Departure.
- Location Mapping: Utilize coordinates provided by the Train Data API to map all locations on the Rail Network and plot train locations based on their coordinates.
- Timing Points: Identify and mark timing points on the map where trains can perform actions: Pass, Arrival, Departure.
- Arrival and Departure Comparison: Compare actual arrival/departure times with expected times at timing points to determine if the train is behind, on, or ahead of schedule.
- UI Features: Implement zoom, pan, tooltips, legends, and a legend key for enhanced usability and aesthetics.
- Live Updates: Allow users to receive live updates of a train's location.

## Installation

To get started with this project, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/erpesh/3squared-train-map.git

2. **Navigate to the project directory and install dependencies**:
   ```bash
   cd 3squared-train-map
   npm install

3. **Rename environment file and add your API key**:
    - Rename `.env.example` file to `.env`.
    - Open `.env` file in a text editor.
    - Add your API key in the format specified in the file. For example:
      ```
      REACT_APP_API_KEY=your_api_key_here
      ```

4. **Start the development server**:
   ```bash
   npm start

**[User Guide](https://github.com/erpesh/maps_test/blob/master/USERGUIDE.md)**
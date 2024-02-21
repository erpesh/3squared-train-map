# National Rail Network Map
#  Overview
This project aims to create a National Rail Network Map that provides live information about freight train routes, stops, and progress through the Rail Network in the UK. The map utilizes data from the provided Train Data API to display details about a train's journey progress, including expected/actual arrival/departure times and stops.

#  Features
Display Train Routes: Show routes of trains on the National Rail Network, differentiating between different train actions: Pass, Arrival, Departure.
Location Mapping: Utilize coordinates provided by the Train Data API to map all locations on the Rail Network and plot train locations based on their coordinates.
Timing Points: Identify and mark timing points on the map where trains can perform actions: Pass, Arrival, Departure.
Arrival and Departure Comparison: Compare actual arrival/departure times with expected times at timing points to determine if the train is behind, on, or ahead of schedule.
UI Features: Implement zoom, pan, tooltips, legends, and a legend key for enhanced usability and aesthetics.
Live Updates: Allow users to receive live updates of a train's location, with an option for manual trigger updates or automatic refresh.

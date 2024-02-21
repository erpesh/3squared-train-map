import {useMemo, useState} from "react";

export default function useFilters(trains) {
    const [filters, setFilters] = useState({
        origin: null,
        destination: null
    });
    const filteredTrains = useMemo(() => {
        return trains.filter(train => {
            return (!filters.origin || train.originLocation === filters.origin) &&
                (!filters.destination || train.destinationLocation === filters.destination)
        });
    }, [trains, filters]);

    return {filteredTrains, filters, setFilters};
}
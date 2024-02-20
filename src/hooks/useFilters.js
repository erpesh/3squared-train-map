import {useMemo, useState} from "react";

export default function useFilters(trains) {
    const [filters, setFilters] = useState({
        date: null,
        location: null,
        status: null
    });
    const filteredTrains = useMemo(() => {
        return trains.filter(train => {
            return (!filters.date || train.date === filters.date) &&
                (!filters.location || train.originLocation === filters.location) &&
                (!filters.status || train.lastReportedType === filters.status);
        });
    }, [trains, filters]);

    return {filteredTrains, filters, setFilters};
}
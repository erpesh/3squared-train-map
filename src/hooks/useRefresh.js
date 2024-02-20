import {useEffect, useState} from "react";

export default function useRefresh(callBack) {
    const [refresh, setRefresh] = useState(false);
    const refreshTrains = () => setRefresh(!refresh);

    useEffect(() => {
        callBack();
    }, [refresh]);

    return refreshTrains;
}
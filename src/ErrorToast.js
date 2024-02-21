import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useEffect} from "react";

export default function ErrorToast({error}) {
    const notify = (e) => toast.error(`An error occurred: ${e.message}`);

    useEffect(() => {
        console.log(error)
        if (error)
            notify(error)
    }, [error])

    return <ToastContainer
        position={'bottom-right'}
        hideProgressBar
        theme={'light'}
    />
}
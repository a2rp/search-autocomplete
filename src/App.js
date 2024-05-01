import React from 'react'
import SearchAutoComplete from "./searchAutoComplete";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <div>
            <SearchAutoComplete />

            <ToastContainer />
        </div>
    )
}

export default App


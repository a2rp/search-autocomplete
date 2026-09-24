import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchAutoComplete from "./searchAutoComplete";

export default function App() {
    return (
        <>
            <SearchAutoComplete />
            <ToastContainer position="bottom-right" theme="dark" />
        </>
    );
}

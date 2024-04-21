import { useNavigate } from "react-router-dom";
import { useFirebase } from "../Firebase/context"
import { logOut } from "../Firebase/firebase"

export default function SignOut() {
    const navigate = useNavigate();

    const handleSignOut = async() => {
        logOut()
        .then(() => {
            navigate("/");
        })
        .catch(error => {
            console.error("Logout failed: ", error.message);
        });
    }

    return (
        <button onClick={handleSignOut}>Sign Out</button>
    )
}
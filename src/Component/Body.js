import { useEffect, useState } from "react";

function Body() {

    const [Profile, setProfile] = useState([]);
    const [numberofProfile, setnumberofProfile] = useState("");

    async function generateProfile(count = 10) {
        try {
            let rand = Math.floor(1 + Math.random() * 1000);

            const response = await fetch(
                `https://api.github.com/users?since=${rand}&per_page=${count}`
            );

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();
            setProfile(data);

        } catch (error) {
            console.error("Error fetching GitHub profiles:", error);
            setProfile([]); // Clear profiles if an error occurs
        }
    }

    useEffect(() => {
        generateProfile();
    }, []);

    return (
        <div className="but">
            <input type="number" className="inpu" placeholder="Search profile here..." value={numberofProfile} onChange={(e) => setnumberofProfile(e.target.value)}/>
            <button onClick={() => generateProfile(Number(numberofProfile))}>Search Profile</button>
            <div className="profiles">
                {Array.isArray(Profile) &&
                    Profile.map((value) => (
                        <div key={value.id} className="cards">
                            <img src={value.avatar_url} alt={value.login} />
                            <h2>{value.login}</h2>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Body;
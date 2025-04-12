import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style/index.css'; // Add this line to import the CSS file

function SaveProfile({ notes, setNotes }) {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [bio, setBio] = useState("");
    const [friends, setFriends] = useState([]);
    const [friendInput, setFriendInput] = useState("");
    const [checked, setChecked] = useState(false);
    const [dogImage, setDogImage] = useState("");
    const [loadingImage, setLoadingImage] = useState(false);

    const navigate = useNavigate();

    const fetchDogImage = async () => {
        setLoadingImage(true);
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            setDogImage(data.message);
        } catch (error) {
            console.error("Error fetching dog image:", error);
        } finally {
            setLoadingImage(false);
        }
    };

    const addFriend = () => {
        if (friendInput.trim() && !friends.includes(friendInput.trim())) {
            setFriends([...friends, friendInput.trim()]);
            setFriendInput("");
        }
    };

    const removeFriend = (friendToRemove) => {
        setFriends(friends.filter(friend => friend !== friendToRemove));
    };

    const saveDog = async (e) => {
        e.preventDefault();

        if (!name || !age || !bio) {
            alert("Please fill all fields.");
            return;
        }

        const newDog = { name, age: Number(age), bio, friends, presentToday: checked, dogImage };

        try {
            const response = await axios.post("http://localhost:5000/dogs", newDog);
            if (response.status === 201) {
                setNotes([...notes, response.data]);
                navigate('/saved-dogs');
            } else {
                alert("Failed to save dog.");
            }
        } catch (error) {
            console.error("Error saving dog:", error);
            alert("An error occurred while saving the dog.");
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">Create Dog Profile</h1>
            <form className="profile-form" onSubmit={saveDog}>
                <input type="text" placeholder="Dog's Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="number" placeholder="Dog's Age" value={age} onChange={(e) => setAge(e.target.value)} required />
                <textarea placeholder="Dog's Bio" value={bio} onChange={(e) => setBio(e.target.value)} required />

                <div className="friend-section">
                    <input type="text" placeholder="Add a Friend's Name" value={friendInput} onChange={(e) => setFriendInput(e.target.value)} />
                    <button type="button" className="secondary-btn" onClick={addFriend}>Add Friend</button>
                </div>

                <ul className="friend-list">
                    {friends.map((friend, index) => (
                        <li key={index}>
                            {friend} <button type="button" className="remove-btn" onClick={() => removeFriend(friend)}>❌</button>
                        </li>
                    ))}
                </ul>

                <label className="checkbox-label">
                    <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
                    Present today
                </label>

                <button type="button" className="secondary-btn" onClick={fetchDogImage} disabled={loadingImage}>
                    {loadingImage ? 'Loading...' : 'Get Random Dog Image'}
                </button>

                {dogImage && <img className="dog-preview" src={dogImage} alt="Dog" />}

                <button type="submit" className="submit-btn">Save Profile</button>
            </form>
        </div>
    );
}

export default SaveProfile;

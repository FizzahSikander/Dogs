import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './style/index.css'; // 👈 Import the new CSS

function EditDog({ notes, setNotes }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [dog, setDog] = useState(null);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [bio, setBio] = useState("");
    const [friends, setFriends] = useState([]);
    const [friendInput, setFriendInput] = useState("");
    const [checked, setChecked] = useState(false);
    const [dogImage, setDogImage] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/dogs/${id}`)
            .then(response => {
                const dogData = response.data;
                setDog(dogData);
                setName(dogData.name);
                setAge(dogData.age);
                setBio(dogData.bio);
                setFriends(dogData.friends || []);
                setChecked(dogData.presentToday);
                setDogImage(dogData.dogImage);
            })
            .catch(error => {
                console.error("Error fetching dog profile:", error);
                navigate("/saved-dogs");
            });
    }, [id, navigate]);

    const fetchDogImage = async () => {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            setDogImage(data.message);
        } catch (error) {
            console.error("Error fetching dog image:", error);
        }
    };

    const saveEditedDog = async (e) => {
        e.preventDefault();

        const updatedDog = {
            name,
            age,
            bio,
            friends,
            presentToday: checked,
            dogImage,
        };

        try {
            const response = await axios.put(`http://localhost:5000/dogs/${id}`, updatedDog);
            const updatedFromDB = response.data;
            const updatedNotes = notes.map(note => note._id === id ? updatedFromDB : note);
            setNotes(updatedNotes);
            navigate("/saved-dogs");
        } catch (error) {
            console.error("Error updating dog profile:", error);
        }
    };

    const addFriend = () => {
        if (friendInput.trim() && !friends.includes(friendInput.trim())) {
            setFriends([...friends, friendInput.trim()]);
            setFriendInput("");
        }
    };

    const removeFriend = (index) => {
        setFriends(friends.filter((_, i) => i !== index));
    };

    if (!dog) return <p className="loading">Loading...</p>;

    return (
        <div className="edit-dog-container">
            <h1 className="form-title">Edit Dog Details</h1>
            <form className="edit-dog-form" onSubmit={saveEditedDog}>
                <input className="input-field" type="text" placeholder="Dog's Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input className="input-field" type="number" placeholder="Dog's Age" value={age} onChange={(e) => setAge(e.target.value)} required />
                <input className="input-field" type="text" placeholder="Dog's Bio" value={bio} onChange={(e) => setBio(e.target.value)} required />

                <div className="friends-section">
                    <h3>Friends</h3>
                    <ul className="friend-list">
                        {friends.map((friend, index) => (
                            <li key={index}>
                                {friend}
                                <button className="remove-btn" type="button" onClick={() => removeFriend(index)}>❌</button>
                            </li>
                        ))}
                    </ul>
                    <div className="add-friend">
                        <input type="text" value={friendInput} placeholder="Add friend" onChange={(e) => setFriendInput(e.target.value)} />
                        <button type="button" onClick={addFriend}>Add Friend</button>
                    </div>
                </div>

                <label className="checkbox-wrapper">
                    <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
                    Present today
                </label>

                <button className="image-btn" type="button" onClick={fetchDogImage}>Get Random Dog Image</button>
                {dogImage && <img className="dog-preview" src={dogImage} alt="Random Dog" />}

                <button className="submit-btn" type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default EditDog;

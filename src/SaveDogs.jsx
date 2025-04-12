import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function SavedDogs() {
    const [dogs, setDogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/dogs")
            .then(response => setDogs(response.data))
            .catch(error => console.error("Error fetching dogs:", error));
    }, []);

    const deleteDog = async (id, name) => {
        try {
            await axios.delete(`http://localhost:5000/dogs/${id}`);
            const updatedDogs = dogs.filter(dog => dog._id !== id);
            updatedDogs.forEach(dog => {
                dog.friends = dog.friends.filter(friend => friend !== name);
            });
            setDogs(updatedDogs);
        } catch (error) {
            console.error("Error deleting dog:", error);
        }
    };

    return (
        <div className="saved-dogs-container">
            <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
            <h2 className="page-title">Saved Dogs</h2>

            <ul className="dog-list">
                {dogs.map((dog) => (
                    <li className="dog-card" key={dog._id}>
                        <div><strong>Name:</strong> {dog.name}</div>
                        <div><strong>Age:</strong> {dog.age} years old</div>
                        <div><strong>Bio:</strong> {dog.bio}</div>

                        <div>
                            <strong>Friends:</strong>
                            <ul className="friend-list">
                                {dog.friends.map((friend, index) => (
                                    <li key={index}>{friend}</li>
                                ))}
                            </ul>
                        </div>

                        {dog.presentToday && <div className="badge">In Yard Today</div>}

                        {dog.dogImage && (
                            <div className="dog-image-wrapper">
                                <img src={dog.dogImage} alt={dog.name} className="dog-image" />
                            </div>
                        )}

                        <div className="button-group">
                            <Link className="edit-btn" to={`/edit-dog/${dog._id}`}>Edit</Link>
                            <button className="delete-btn" onClick={() => deleteDog(dog._id, dog.name)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SavedDogs;

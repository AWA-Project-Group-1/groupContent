import React from 'react';
import styles from './ProfilePage.module.css';
import Navitation from '../components/Navigation';


const Profile = () => {
    return (
    <div>
        <Navitation />
      <div className={styles.profileContainer}>
        <h1>Profile</h1>
        <p>Welcome to your profile site</p>
        <div className={styles.profileDetails}>
          <div>
            <label>Name:</label>
            <span>John Doe</span>
          </div>
          <div>
            <label>Email:</label>
            <span>john.doe@example.com</span>
          </div>
          {/* Add more profile details here */}
        </div>
      </div>
      <div className={styles.favoritesContainer}>
        <h2>Your favorites</h2>
        <ul>
          <li>Favorite Movie 1</li>
          <li>Favorite Movie 2</li>
          <li>Favorite Movie 3</li>
          {/* Add more favorite items here */}
        </ul>
      </div>
    </div>
    );
  };
  
  export default Profile;
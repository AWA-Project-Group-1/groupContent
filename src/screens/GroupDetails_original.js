import React, { useEffect, useState } from "react";
//import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
//import MoviePage from "./GroupDetailsMovies.js";

//const url = 'http://localhost:3001'

export default function GroupDetails({ groupId }) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Group ID being requested:", groupId); // debug
    
  useEffect(() => {
    const fetchGroupDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("token");
        console.log("Token before authorization request:", token);

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`/group/${groupId}`, { headers });

        console.log("Authorization response:", response.data);
        setGroup(response.data);
      } catch (err) {
        console.error("An error occurred when fetching group details!", err);
        setError(err.response?.data?.message || "Failed to load group details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  if (loading) return <p>Loading group details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!group) return <p>No group found.</p>;

  return (
    <div>
      <h1>{group.name}</h1>
      <p>{group.description}</p>
      <hr />
      
    </div>
  );
}

//<MoviePage groupId={groupId} />
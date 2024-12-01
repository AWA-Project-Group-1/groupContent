import React from "react";
import { useNavigate } from "react-router-dom";

export default function Row({ item, deleteGroup }) {
  const navigate = useNavigate();
  
  const goToDetails = () => {
    navigate(`/group/${item.id}`);
  };

  return (
    <div className="group-card" onClick={goToDetails}>
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteGroup(item.id);
        }}
      >
        Delete
      </button>
    </div>
  );
}

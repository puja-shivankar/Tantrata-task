import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainForm() {
  let navigate = useNavigate();
  const [data, setData] = useState({ name: "", room: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    console.log(event.target.name, event.target.value);
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const validation = () => {
    if (!data.name) {
      setError("Please enter your Name");
      return false;
    }
    if (!data.room) {
      setError("Please Select Room");
      return false;
    }
    setError("");
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validation();
    if (isValid) {
      navigate(`/chat/${data.error}`, { state: data });
    }
  };
  return (
    <div className="px-3 py-4 shadow bg-white text-dark border rounded row">
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <h2 className="mb-4" style={{ color: "#008080" }}>
            Welcome To chatRoom{" "}
          </h2>
        </div>
        <div className="form-group mb-4">
          <input
            type="text"
            className="form-control bg-light "
            name="name"
            onChange={handleChange}
            placeholder="Enter Name"
          />
        </div>
        <div className="form-group mb-4">
          <select
            className="form-select bg-light"
            name="room"
            onChange={handleChange}
          >
            <option value="">Select Room</option>
            <option value="Gaming">Gaming</option>
            <option value="Coading">Coading</option>
            <option value="socialMedia">Social Media</option>
          </select>
        </div>
        <button
          type="submit"
          className=" btn w-100 mb-2"
          style={{ backgroundColor: "#008080", color: "white" }}
        >
          Submit
        </button>
        {error ? <small className="text-danger">{error}</small> : ""}
      </form>
    </div>
  );
}

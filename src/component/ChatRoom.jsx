import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Moment from "react-moment";
import { io } from "socket.io-client";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import MainForm from "./MainForm";

export default function ChatRoom() {
  const navigate = useNavigate();
  const msgBoxRef = useRef();

  const [data, setData] = useState({});
  const [msg, setMsg] = useState("");
  const [allMessages, setMessages] = useState([]);
  const [socket, setSocket] = useState();

  const location = useLocation();
  useEffect(() => {
    const socket = io("http://localhost:8000/");
    setSocket(socket);
    socket.on("connect", () => {
      // console.log(socket.id); // x8WIv7-mJelg7on_ALbx

      socket.emit("joinRoom", location.state.room);
    });
  }, []);

  useEffect(() => {
    setData(location.state);
    console.log(data);
  }, [location]);

  const handleChange = (e) => {
    setMsg(e.target.value);
  };
  const onSubmit = () => {
    if (msg) {
      const newMessage = { time: new Date(), msg, name: data.name };
      socket.emit("newMessage", { newMessage, room: data.room });
    }

    //  setMessages([...allMessages, newMessage]);
  };

  useEffect(() => {
    if (socket) {
      socket.on("getLatestMessage", (newMessage) => {
        // console.log(newMessage);
        setMessages([...allMessages, newMessage]);
        msgBoxRef.current.scrollIntoView({ behavior: "smooth" });
        setMsg("");
      });
    }
  }, [socket, allMessages]);
  const handleKeyDown = (e) => (e.keyCode === 13 ? onSubmit() : "");

  return (
    <>
      <div
        className="text-center px-3 mb-4 text-capitalize"
        style={{ fontFamily: "sans-serif" }}
      ></div>
      <div className="py-4 m-5 w-50 shadow bg-white text-dark border rounded container">
        <h3 className="text-info mt-2 mb-2">{data?.room} Chat Room</h3>

        <hr style={{ border: "2px solid #B0E0E6" }} />
        <ArrowCircleLeftIcon
          style={{ color: "#008080" , cursor:"pointer"}}
          onClick={() => {
            navigate("/");
          }}
        ></ArrowCircleLeftIcon>
        <strong className="m-1" style={{ color: "#008080" }}>
          {data.name}
        </strong>
        <div
          className="bg-light border rounded p-3 mb-4"
          style={{ height: "450px", overflow: "scroll" }}
        >
          {allMessages.map((msg, key) => {
            return data.name === msg.name ? (
              <div className="row justify-content-end pl-5">
                <div style={{ textAlign: "right" }}>
                  <strong className="m-1 text-secondary">{msg.name}</strong>
                  <small>
                    <Moment fromNow>{msg.time}</Moment>
                  </small>
                </div>
                <div
                  style={{ borderRadius: "20%", backgroundColor: "#B0E0E6" }}
                  className="d-flex flex-column align-items-end m-2 shadow border rounded w-auto "
                >
                  <div></div>
                  <h4 className="m-1 text-secondary">{msg.msg}</h4>
                </div>
              </div>
            ) : (
              <div className="row justify-content-start">
                <div>
                  <strong className="m-1 text-secondary">{msg.name}</strong>
                  <small className=" m-1">
                    <Moment fromNow>{msg.time}</Moment>
                  </small>
                </div>
                <div
                  className="d-flex flex-column m-2 p-2 shadow  border rounded w-auto"
                  style={{ backgroundColor: "#008080" }}
                >
                  <h4 className="m-1" style={{ color: "#B0E0E6" }}>
                    {msg.msg}
                  </h4>
                </div>
              </div>
            );
          })}
          <div ref={msgBoxRef}></div>
        </div>
        <div className="form-group d-flex">
          <input
            type="text"
            className="form-control bg-light"
            name=" message"
            placeholder="Type Something"
            value={msg}
            style={{
              borderRadius: "10px",
              boxShadow: " 0 0 0 0.2rem rgba(176,224,230)",
            }}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            iconStart={<AddCircleIcon sx={{ color: "green", fontSize: 20 }} />}
          />

          <button type="button" className="btn  mx-2" onClick={onSubmit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="bi bi-send"
              viewBox="0 1 16 16"
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

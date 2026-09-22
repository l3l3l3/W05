import { useEffect, useRef, useState } from "react";

import fieldImage from "../assets/field.jpg";
import basketballImage from "../assets/basketball.png";
import footballImage from "../assets/football.png";
import volleyballImage from "../assets/volleyball.png";
import faceImage from "../assets/face.jpg";
import cartoonImage from "../assets/cartoon.jpeg";
import logoImage from "../assets/logo.jpeg";

const Animation = ({
  fieldWidth,
  fieldHeight,
  ballRadius,
  velocity,
  keyEvent,
}) => {
  // default
  const _keyEvent = keyEvent || null;
  const _fieldWidth = fieldWidth || 870;
  const _fieldHeight = fieldHeight || 480;
  const _ballRadius = ballRadius || 50;
  const _velocity = velocity || 100; // px/s

  // internal calculate
  const xVelocity = Math.round(_velocity / Math.sqrt(2));
  const yVelocity = Math.round(_velocity / Math.sqrt(2));

  const frameRate = 25; // f/s
  const frameTime = 1 / frameRate; // s
  const _ballDiameter = 2 * _ballRadius;
  const maxX = _fieldWidth - _ballDiameter;
  const maxY = _fieldHeight - _ballDiameter;

  // state
  const [ballType, setBallType] = useState("none");
  const [running, setRunning] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [moveLeft, setMoveLeft] = useState(true); // true -> , false = <-
  const [moveDown, setMoveDown] = useState(true); // true = v , false = ^

  // Keyboard Event
  useEffect(() => {
    if (_keyEvent != null) {
      if (_keyEvent.key === " ") setRunning((prev) => !prev);
      else if (_keyEvent.key === "0") setBallType("none");
      else if (_keyEvent.key === "1") setBallType("basketball");
      else if (_keyEvent.key === "2") setBallType("football");
      else if (_keyEvent.key === "3") setBallType("volleyball");
      else if (_keyEvent.key === "4") setBallType("face");
      else if (_keyEvent.key === "5") setBallType("cartoon");
      else if (_keyEvent.key === "6") setBallType("logo");
    }
  }, [_keyEvent]);

  // refer
  const ballRef = useRef();
  const timer = useRef(null);

  // Calculate Next Frame)
  const calculateNextFrame = () => {
    // x axis
    setX((prevX) => {
      let nextX = prevX + (moveLeft ? xVelocity : -xVelocity) / frameRate;
      if (nextX >= maxX) {
        setMoveLeft(false);
        return maxX;
      } else if (nextX <= 0) {
        setMoveLeft(true);
        return 0;
      }
      return nextX;
    });

    // y axis
    setY((prevY) => {
      let nextY = prevY + (moveDown ? yVelocity : -yVelocity) / frameRate;
      if (nextY >= maxY) {
        setMoveDown(false);
        return maxY;
      } else if (nextY <= 0) {
        setMoveDown(true);
        return 0;
      }
      return nextY;
    });

    // Rotate
    setRotation((prevRot) => (prevRot + 90 * frameTime) % 360);
  };

  // Timer
  useEffect(() => {
    if (running) {
      timer.current = setTimeout(() => {
        calculateNextFrame();
      }, frameTime * 1000);
    }
    return () => {
      clearTimeout(timer.current);
      timer.current = null;
    };
  }, [running, x, y, moveLeft, moveDown]);

  // BallType
  useEffect(() => {
    if (!ballRef.current) return;
    if (ballType === "none") ballRef.current.style.backgroundImage = "none";
    else if (ballType === "basketball")
      ballRef.current.style.backgroundImage = `url(${basketballImage})`;
    else if (ballType === "football")
      ballRef.current.style.backgroundImage = `url(${footballImage})`;
    else if (ballType === "volleyball")
      ballRef.current.style.backgroundImage = `url(${volleyballImage})`;
    else if (ballType === "face")
      ballRef.current.style.backgroundImage = `url(${faceImage})`;
    else if (ballType === "cartoon")
      ballRef.current.style.backgroundImage = `url(${cartoonImage})`;
    else if (ballType === "logo")
      ballRef.current.style.backgroundImage = `url(${logoImage})`;
  }, [ballType]);

  return (
    <>
      {/* animation container */}
      <div className="mx-auto mt-3" style={{ width: "fit-content" }}>
        {/* field */}
        <div
          className="border border-black border-2 rounded-3 position-relative overflow-hidden"
          style={{
            width: `${_fieldWidth}px`,
            height: `${_fieldHeight}px`,
            backgroundImage: `url(${fieldImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          {/* ball */}
          <div
            className="border border-1 border-black rounded-circle position-absolute"
            style={{
              width: `${_ballDiameter}px`,
              height: `${_ballDiameter}px`,
              backgroundColor: "lightgray",
              backgroundSize: "cover",
              backgroundPosition: "center",
              top: `${y}px`,
              left: `${x}px`,
              transform: `rotate(${rotation}deg)`,
            }}
            ref={ballRef}
          ></div>
        </div>

        {/* button row */}
        <div className="d-flex justify-content-between align-items-center gap-4 mt-2">
          {/*Play / Pause button) */}
          <button
            className={`btn btn-lg ${running ? "btn-danger" : "btn-success"}`}
            style={{ minWidth: "110px" }}
            onClick={() => setRunning(!running)}
          >
            {running ? "Pause" : "Play"}
          </button>

          {/* ball type */}
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-lg btn-outline-secondary"
              onClick={() => setBallType("none")}
            >
              None
            </button>
            <button
              className="btn btn-lg btn-outline-primary"
              onClick={() => setBallType("basketball")}
            >
              Basketball
            </button>
            <button
              className="btn btn-lg btn-outline-primary"
              onClick={() => setBallType("football")}
            >
              Football
            </button>
            <button
              className="btn btn-lg btn-outline-primary"
              onClick={() => setBallType("volleyball")}
            >
              Volleyball
            </button>
            <button
              className="btn btn-lg btn-outline-primary"
              onClick={() => setBallType("face")}
            >
              Face
            </button>
            <button
              className="btn btn-lg btn-outline-primary"
              onClick={() => setBallType("cartoon")}
            >
              Cartoon
            </button>
            <button
              className="btn btn-lg btn-outline-primary"
              onClick={() => setBallType("logo")}
            >
              Logo
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Animation;
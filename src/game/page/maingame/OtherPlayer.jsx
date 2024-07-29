import React, { useState } from "react";
import P2 from "./P2";
import P3 from "./P3";
import P4 from "./P4";

function OtherPlayer({ show, setShow }) {
  const [p2z, setP2z] = useState(0);
  const [p3z, setP3z] = useState(0);
  const [p4z, setP4z] = useState(10);
  const setZIndex = (n) => {
    if (n === 2) {
      setP2z(10);
      setP3z(0);
      setP4z(0);
    }
    if (n === 3) {
      setP2z(0);
      setP3z(10);
      setP4z(0);
    }
    if (n === 4) {
      setP2z(0);
      setP3z(0);
      setP4z(10);
    }
  };
  return (
    <div className={"otherpinfo-container"}>
      <P2 show={show} setShow={setShow} setZ={setZIndex} z={p2z} />
      <P3 show={show} setShow={setShow} setZ={setZIndex} z={p3z} />
      <P4 show={show} setShow={setShow} setZ={setZIndex} z={p4z} />
    </div>
  );
}

export default OtherPlayer;

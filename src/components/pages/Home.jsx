import React, { useState } from "react";
import Map from "../Map";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div id="map">
      <Map />
      <button onClick={togglePopup}>Click me for instructions!!</button>
      {showPopup && (
        <div className="popup">
          <p>Welcome to Find One And Skate! Here, you can find spots on a map that are perfect for skateboarding. To get started, simply navigate the map by zooming in and out and panning around, and you'll see markers that indicate skateboarding spots. Click on any of these markers to view the name and description of that spot.

          You can also add your own skateboarding spots to the map by double-clicking on the map. If you are logged in, a form will appear for you to fill out with the spot's name, description, picture, and video. If you are not logged in, you will be prompted to do so before you can add a spot.

          To make navigation easier, we've added several controls to the map, including a navigation control, a geolocate control, a fullscreen control, and a scale control. We hope you enjoy using our site to find and share your favorite skateboarding spots!</p>
        </div>
      )}
    </div>
  );
}
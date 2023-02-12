import React, { useState } from "react";
import mapboxgl from "mapbox-gl";

// create marker component that will be used to display the marker
const Marker = (props) => {
    const [showInfo, setShowInfo] = useState(false);
// create a function that will handle the click event which will toggle the showInfo state
    const handleClick = () => {
        setShowInfo(!showInfo);
    }

    return (
        <div> //
            <div className="marker" 
            onClick={handleClick}
            style={{
                cursor: "pointer",
                background: "#03a9f4",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
            }}
            />
            {showInfo && (
                <div className="marker-info">
                    <p>{props.description}</p>
                    <p>{props.name}</p>
                    <img src={props.image} alt={props.name} />
                </div>
            )}
        </div>
    )
}

export default Marker;
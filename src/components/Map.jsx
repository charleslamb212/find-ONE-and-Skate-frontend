import React, { useRef, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "../index.css";
import axios from "axios";
import GeocodeForm from "./GeocodeForm";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function Map(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-98.201727);
  const [lat, setLat] = useState(38.34501);
  const [zoom] = useState(2);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/spots`
      );
      const spots = response.data;
      const features = spots.map((spot) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [spot.lng, spot.lat],
          },
          properties: {
            title: spot.name, // add a title to display in the popup
            description: spot.description, // add a description to display in the popup
            id: spot._id,
          },
        };
      });
      map.current.addLayer({
        id: "markers",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: features,
          },
        },
        layout: {
          "icon-image": "dot-11",
          "icon-size": 3,
        },
      });

      // Add a popup to display on click
      map.current.on("click", "markers", (e) => {
        const { title, description } = e.features[0].properties;
        const { id } = e.features[0].properties;
        if (localStorage.getItem("jwt")) {
        new mapboxgl.Popup()
          .setLngLat(e.features[0].geometry.coordinates)
          .setHTML(`
            <h3>${title}</h3>
            <p>${description}</p>
            <h3>Upload your photo or video of this spot!</h3>
            <form id="spotForm" enctype="multipart/form-data">

              <label for="image">Picture:</label>
              <input type="file" id="image" name="image"><br><br>
              <label for="video">Video:</label>
              <input type="file" id="video" name="video"><br><br>

              <input type="submit" value="Submit">
            </form>
          `)
          .addTo(map.current);
        const spotForm = document.getElementById("spotForm");
        spotForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const formData = new FormData(event.target);
          formData.set("image", formData.get("image")); // use "image" instead of "picture"
          const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/images`,formData);
          console.log('this is the data that holds the url ----',data.cloudImage);
          console.log(typeof id)
          console.log('this is the id',id)
          // const { dataVideo } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/videos`,formData);
          await axios.post(`${process.env.REACT_APP_SERVER_URL}/spots/${id}`, {
              image: data.cloudImage,
              // video: dataVideo.cloudVideo,
            }
          );
        })
        } else {
          new mapboxgl.Popup()
          .setLngLat(e.features[0].geometry.coordinates)
          .setHTML(`
          <h3>${title}</h3>
          <p>${description}</p>
          <p>You must be logged in to upload photos or videos!</p>
          `)
          .addTo(map.current);
        }
      });
    });

    // add navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    // add geolocate control to the map.
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    // add fullscreen control to the map.
    map.current.addControl(new mapboxgl.FullscreenControl());

    // add scale control to the map.
    map.current.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: "imperial",
      })
    );

    // add a layer of dots to the map on mouse clicks
    map.current.on("load", () => {
      map.current.addLayer({
        id: "points",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        },
        layout: {
          "icon-image": "dot-11",
          "icon-size": 3,
        },
      });

      map.current.on("dblclick", (e) => {
        if (localStorage.getItem("jwt")) {
          // allow user to add a spot if they are authenticated
          let features = map.current.getSource("points")._data.features;
          features.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [e.lngLat.lng, e.lngLat.lat],
            },
            properties: {},
          });

          map.current.getSource("points").setData({
            type: "FeatureCollection",
            features: features,
          });
        } else {
          // if user is not authenticated, send alert to login
          alert("You must be logged in to add spots to the map!");
        }
      });
    });

    // add popup to marker
    map.current.on("click", "points", (e) => {
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        // add a button in the popup to add a new spot
        .setHTML(
          `
          <form id="spotForm" enctype="multipart/form-data">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name"><br><br>

            <label for="description">Description:</label>
            <textarea id="description" name="description" rows="4"></textarea><br><br>

            <label for="image">Picture:</label>
            <input type="file" id="image" name="image"><br><br>

            <label for="video">Video:</label>
            <input type="file" id="video" name="video"><br><br>

            <input type="submit" value="Submit">
          </form>
        `
        )
        .addTo(map.current);

      const spotForm = document.getElementById("spotForm");
      spotForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.set("image", formData.get("image")); // use "image" instead of "picture"
        const { data } = await axios.post(`${process.env.REACT_APP_SERVER_URL}/images`,formData);
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/spots`, {
            lng: e.lngLat.lng,
            lat: e.lngLat.lat,
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            image: data.cloudImage,
          }
        );
      });
    });

    if (map.current) {
      map.current.on("click", "markers", (e) => {
        const getSpots = async () => {
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/spots/${e.features[0].properties.id}`
          );
          const spot = response.data;
          const newDiv = document.createElement("div");
          newDiv.id = "newDiv";
          newDiv.innerHTML = `
        <h3>${spot.spotDetails.name}</h3>
        <p>${spot.spotDetails.description}</p>
        <img src="${spot.spotDetails.images[0]}" alt="spot image" height="200" width="200" />
        <img src="${spot.spotDetails.images[1]}" alt="spot image" height="200" width="200" />
        <img src="${spot.spotDetails.images[2]}" alt="spot image" height="200" width="200" />
        `;
        // foreach image in the spot, create an image element and append it to the div
        // use forEach instead of map because map returns a new array
        // spot.spotImages.forEach((image) => {
        //   newDiv.innerHTML += `<img src="${image.image}" alt="spot image" />`;
        // })
          const existingDiv = document.getElementById("newDiv");
          if (existingDiv) {
            existingDiv.parentNode.replaceChild(newDiv, existingDiv);
          } else {
            setTimeout(() => {
              const mapElem = document.getElementById("map");
              if (mapElem) {
                mapElem.appendChild(newDiv);
              } else {
                console.log("#map element not found");
              }
            }, 0);
          }
        };
        getSpots().catch((error) => {
          console.log(error);
        });
      });
    } else {
      console.log("map.current is null");
    }

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.current.on("mouseenter", "points", "markers", () => {
      map.current.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.current.on("mouseleave", "points", () => {
      map.current.getCanvas().style.cursor = "";
    });
  });

  // update map position when state changes
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    // Fly to the new location when the lat and lng state values change
    map.current.flyTo({
      center: [lng, lat],
      zoom: zoom,
      speed: 1, // animation speed, in seconds
      curve: 1, // animation curve, controls the easing
    });
  }, [lat, lng, zoom]);

  return (
    <div>
      <GeocodeForm setLat={setLat} setLng={setLng} />
      {/* <div className="sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div> */}
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

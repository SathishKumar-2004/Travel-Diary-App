import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import "./Map.css";

const Map = (props) => {
  const { center, zoom, className, style, address } = props;

  var myIcon = L.icon({
    iconUrl: "/marker-icon.png",
    iconSize: [30, 60],
    iconAnchor: [22, 60],
    popupAnchor: [-3, -76],
    shadowUrl: "/marker-shadow.png",
    shadowSize: [68, 95],
    shadowAnchor: [22, 94],
  });

  return (
    <div className={`map ${className}`} style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <Marker position={center} icon={myIcon}>
          <img src="/marker-icon.png" alt="" />
          <Popup>{address}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;

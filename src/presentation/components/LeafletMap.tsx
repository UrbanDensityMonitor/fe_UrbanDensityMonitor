// src/presentation/components/LeafletMap.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import semarangGeoJson from "@/data/semarang.json";
import { GeoJsonObject } from "geojson";

export default function LeafletMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 w-full h-full">
      <MapContainer
        center={[-6.9908, 110.4223]}
        zoom={13}
        zoomControl={false}
        style={{ width: "100%", height: "100%", background: "#1A171A" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark-map-tiles"
        />
        {semarangGeoJson.features && semarangGeoJson.features.length > 0 && (
          <GeoJSON
            data={semarangGeoJson as GeoJsonObject}
            style={{
              color: "#E879F9",
              weight: 2,
              opacity: 0.8,
              fillColor: "#F0ABFC",
              fillOpacity: 0.15,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

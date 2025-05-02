import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix missing marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapWithMarkers({ tasks, selectedTask }) {
  const [geoTasks, setGeoTasks] = useState([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const results = await Promise.all(
        tasks.map(async (task) => {
          if (!task.location) return null;
          try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
              params: {
                q: task.location,
                format: 'json',
                limit: 1,
              },
            });
            const { lat, lon } = res.data[0] || {};
            return lat && lon
              ? { ...task, lat: parseFloat(lat), lng: parseFloat(lon) }
              : null;
          } catch (err) {
            console.warn("Geocoding failed:", task.location);
            return null;
          }
        })
      );
      setGeoTasks(results.filter(Boolean));
    };

    fetchCoordinates();
  }, [tasks]);

  return (
    <MapContainer center={[20, 0]} zoom={2} className="h-full w-full z-10">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoTasks.map((task) => (
        <Marker key={task.id} position={[task.lat, task.lng]}>
          <Popup>
            <strong>{task.title || "No title"}</strong>
            <br />
            {task.location}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

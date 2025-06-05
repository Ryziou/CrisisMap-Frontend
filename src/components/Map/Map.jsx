import './Map.css'
import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { getDisasters } from '../../services/reliefDisasters'

export default function Map() {
    const mapRef = useRef()
    const mapContainerRef = useRef()

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_API_SECRET_TOKEN
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [-1.91, 53.40],
            zoom: 4
        });

        const fetchDisasters = async () => {
            try {
                const { data } = await getDisasters()
                const events = data.data

                events.forEach(disaster => {
                    const fieldsData = disaster.fields
                    const lat = fieldsData.primary_country.location.lat
                    const long = fieldsData.primary_country.location.lon
                    if (!lat || !long) return

                    const el = document.createElement('div')
                    el.className = 'marker'

                    new mapboxgl.Marker(el)
                        .setLngLat([long, lat])
                        .setPopup(
                            new mapboxgl.Popup({ offset: 25 })
                                .setHTML(
                                    `<h3>${fieldsData.name.split(':')[0]}</h3>
                                     <p>${fieldsData.name.split(':')[1]}</p>
                                     <p>${fieldsData.date.created.split('T')[0]}</p>`
                                )
                        )
                        .addTo(mapRef.current)
                });

            } catch (error) {
                console.log(error);

            }
        }

        fetchDisasters()

        return () => {
            mapRef.current.remove();
        };
    }, []);

    return <div ref={mapContainerRef} style={{ height: '100vh' }} />;
};
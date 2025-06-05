import './Map.css'
import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { getDisasters } from '../../services/reliefDisasters'
import SidebarTab from '../Sidebar/Sidebar'

export default function Map() {
    const mapRef = useRef()
    const mapContainerRef = useRef()
    const [selectedDisaster, setSelectedDisaster] = useState(null)

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
                const markerIcons = {
                    alert: '/red.png',
                    ongoing: '/yellow.png',
                    past: '/blue.png'
                }

                events.forEach(disaster => {
                    const fieldsData = disaster.fields
                    const status = fieldsData.status.toLowerCase()
                    const markerImage = markerIcons[status] || markerIcons['past']
                    const lat = fieldsData.primary_country.location.lat
                    const long = fieldsData.primary_country.location.lon
                    if (!lat || !long) return

                    const el = document.createElement('div')
                    el.className = 'marker'
                    el.style.backgroundImage = `url(${markerImage})`
                    el.addEventListener('click', () => {
                        setSelectedDisaster(fieldsData)
                    })

                    new mapboxgl.Marker(el)
                        .setLngLat([long, lat])
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

    return (
        <>
        <div className="map-holder">
        {selectedDisaster && (
            <SidebarTab disaster={selectedDisaster} onClose={() => setSelectedDisaster(null)} />
        )}
        <div ref={mapContainerRef} className='map-container' />
        </div>
        </>
    )
};
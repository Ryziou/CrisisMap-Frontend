import './Map.css'
import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function Map() {
    const mapRef = useRef()
    const mapContainerRef = useRef()

    useEffect(() => {
        mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [-2.98, 53.40],
            zoom: 9
        });

        return () => {
            mapRef.current.remove()
        }
    }, [])

    return (
        <>
            <div id="map-container" ref={mapContainerRef} />
        </>
    )
}
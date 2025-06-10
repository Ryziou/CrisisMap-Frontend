export function markerCursors(map, layers) {
    layers.forEach(layer => {
        map.on('mouseenter', layer, () => {
            map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', layer, () => {
            map.getCanvas().style.cursor = ''
        })
    })
}

export function markerImages(map, imageList) {
    imageList.forEach(({ name, url }) => {
        map.loadImage(url, (error, image) => {
            if (!error && image) {
                map.addImage(name, image)
            }
        })
    })
}
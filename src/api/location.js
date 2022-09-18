import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import Style from 'ol/style/Style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Icon from 'ol/style/Icon'
// import Circle from 'ol/style/Circle'
// import Fill from 'ol/style/Fill'

let openMap
let vectorLayer
let _position
export function LocationWatch (map) {
  // Throw an error if no update is received every 30 seconds
  openMap = map
  // ceshi()
  let options = {maximumAge: 30000, timeout: 30000, enableHighAccuracy: 1}
  navigator.geolocation.watchPosition(onSuccess, onError, options)
}
export function CenterAt () {
  if (_position) {
    let lat = _position.coords.latitude
    let lng = _position.coords.longitude
    let center = [lng, lat]
    openMap.getView().setCenter(center)
  }
}

// function ceshi () {
//   let lat = 26.65
//   let lng = 106.63
//   let geometry = new Point([lng, lat])
//   let p = new Feature(geometry)
//   p.setStyle(
//     new Style({
//       image: new Icon({
//         src: './static/img/arrow.png', // 加. 从index.html的当前目录开始算 这样android就可以接收到了
//         rotation: -Math.PI / 4
//       })
//     })
//   )
//   let vectorSource = new VectorSource({
//     features: [p]
//   })
//   if (vectorLayer) {
//     openMap.removeLayer(vectorLayer)
//     vectorLayer = undefined
//   }
//   vectorLayer = new VectorLayer({
//     projection: 'EPSG:4326',
//     source: vectorSource
//   })
//   vectorLayer.setZIndex(99)
//   openMap.addLayer(vectorLayer)
// }
// onSuccess Geolocation
//
function onSuccess (position) {
  // alert('success\n' + 'Latitude:\t' + position.coords.latitude + '\n' +
  //   'Longitude:\t' + position.coords.longitude + '\n' +
  //   'Altitude:\t' + position.coords.altitude + '\n' +
  //   'Accuracy:\t' + position.coords.accuracy + '\n' +
  //   'Altitude Accuracy:\t' + position.coords.altitudeAccuracy + '\n' +
  //   'Heading:\t' + position.coords.heading + '\n' +
  //   'Speed:\t' + position.coords.speed + '\n' +
  //   'Timestamp:\t' + position.timestamp + '\n')
  _position = position
  let lat = position.coords.latitude
  let lng = position.coords.longitude
  let geometry = new Point([lng, lat])
  let p = new Feature(geometry)
  p.setStyle(
    new Style({
      image: new Icon({
        src: './static/img/arrow.png',
        rotation: -Math.PI / 4 + position.coords.heading / 180 * Math.PI
      })
      // image: new Circle({
      //   fill: new Fill({
      //     color: 'rgba(55,161,255,1)'
      //   }),
      //   radius: 8
      // })
    })
  )
  let vectorSource = new VectorSource({
    features: [p]
  })
  if (vectorLayer) {
    openMap.removeLayer(vectorLayer)
    vectorLayer = undefined
  }
  vectorLayer = new VectorLayer({
    projection: 'EPSG:4326',
    source: vectorSource
  })
  vectorLayer.setZIndex(99)
  openMap.addLayer(vectorLayer)
}

// onError Callback receives a PositionError object
//
function onError (error) {
  console.log(error)
}



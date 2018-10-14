import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { LeafletMouseEvent } from 'leaflet';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {

  private map: L.Map
  private markers: Array<L.LatLng> = []
  private latLng: L.LatLng = L.latLng(18.5204, 73.8567)

  private mapUrl = `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
  private mapConfig = {
    attribution: `Map data <a target="_blank" href="http://www.openstreetmap.org">OpenStreetMap.org</a>
      contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>`,
    maxZoom: 18,
  }

  constructor() { }

  ngOnInit() {

    this.initMap()

    this.addMarker(this.latLng)
  }

  private initMap() {
    this.map = L.map('map').setView(this.latLng, 13);
    this.map.on('click', (leafEv: LeafletMouseEvent) => {
      this.addMarker(leafEv.latlng)
      //this.wayPoints(leafEv.latlng)
    })
    L.tileLayer(this.mapUrl, this.mapConfig).addTo(this.map);
  }

  addMarker(latLng?: L.LatLng) {
    let mrk = L.marker(latLng, { draggable: true }).addTo(this.map);
    mrk.bindPopup(`${latLng.lat}, ${latLng.lng}`)
    this.markers.push(mrk.getLatLng())
  }

  private wayPoints(position: L.LatLng) {
    L.routing.control({
      waypoints: [
        L.latLng(this.latLng), position
      ],
      routeWhileDragging: true
    }).addTo(this.map).hide();
  }

  drawPolyline() {
    L.polyline(this.markers, {
      color: 'blue',
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    }).addTo(this.map)
  }

  clearMap() {
    this.map.eachLayer(layer => this.map.removeLayer(layer))
    L.tileLayer(this.mapUrl, this.mapConfig).addTo(this.map);
    this.markers = []
  }
}

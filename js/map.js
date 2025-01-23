// map.js

// สร้างแผนที่
function createMap() {
    var map = L.map('map').setView([13.7, 100.5], 9); // กำหนดให้แผนที่เริ่มต้นที่กรุงเทพฯ
  
    // เพิ่มแผนที่พื้นหลังจาก OpenStreetMap
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // เพิ่มแผนที่พื้นหลังจาก CartoDB
    var cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
    });
  
    // เพิ่มแผนที่พื้นหลังจาก Esri
    var esriLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a> contributors'
    });
  
    // เพิ่ม Layers Control
    L.control.layers({
      "OpenStreetMap": osmLayer,
      "CartoDB": cartoLayer,
      "Esri Satellite": esriLayer
    }).addTo(map);
  
    // เพิ่มแผนที่พื้นหลังเริ่มต้นที่ OpenStreetMap
    osmLayer.addTo(map);
  
    return map;
  }
  
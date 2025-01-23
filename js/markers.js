// // markers.js

// // ตัวแปรสำหรับ markers
// var markersLayer = L.layerGroup();

// // ฟังก์ชันสำหรับเพิ่ม markers จากข้อมูลตำแหน่ง
// function addMarkersToMap(locations) {
//   // ลบ markers เก่าออกก่อน
//   markersLayer.clearLayers();

//   // เพิ่ม markers ใหม่จากข้อมูลที่ได้รับ
//   locations.forEach(location => {
//     var marker = L.marker([location.lat, location.lng])
//       .bindPopup(location.popup)
//       .addTo(markersLayer);
//   });

//   // เพิ่ม markers layer ลงในแผนที่
//   markersLayer.addTo(map);
// }

// // ฟังก์ชันสำหรับลบ markers ออกจากแผนที่
// function removeMarkers() {
//   markersLayer.clearLayers();
// }

// ฟังก์ชันเพิ่ม markers ลงในแผนที่
// ฟังก์ชันเพิ่ม markers ลงในแผนที่
function addMarkers(map, locations) {
    // ลบ markers เก่าออกก่อน
    if (window.markers) {
        window.markers.forEach(marker => {
            map.removeLayer(marker);
        });
    }
    window.markers = []; // รีเซ็ต markers ใหม่

    // เพิ่ม markers ใหม่จากข้อมูลที่ได้รับ
    locations.forEach(location => {
        // แปลงค่าพิกัดเป็นตัวเลข
        var lat = parseFloat(location.latitude);
        var lng = parseFloat(location.longitude);

        // เพิ่ม marker ลงในแผนที่
        var marker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>GPS Name: ${location.gpsName}</b><br>Alt: ${location.altitude} meters<br>Time: ${location.time}`);

        window.markers.push(marker);  // เก็บ markers ที่เพิ่มไว้ใน array
    });
}


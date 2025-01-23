// ฟังก์ชันเพิ่ม Polyline จากหลาย API พร้อมสีที่แตกต่างกัน
function addPolyline(map, paths, color) {
    // ลบเส้นทางเก่าก่อนที่จะเพิ่มเส้นทางใหม่
    if (window.polylines) {
        window.polylines.forEach(polyline => {
            map.removeLayer(polyline);
        });
    }
    window.polylines = []; // รีเซ็ตเส้นทางใหม่

    // สร้างเส้น Polyline จากพิกัดที่ได้รับจาก API
    paths.forEach(pathData => {
        var latLngs = pathData.map(path => {
            var lat = parseFloat(path.latitude);
            var lng = parseFloat(path.longitude);
            return [lat, lng];
        });

        // สร้าง Polyline โดยใช้สีที่กำหนด
        var polyline = L.polyline(latLngs, { color: color }).addTo(map);

        // เพิ่ม Popup สำหรับ Polyline (หากต้องการ)
        polyline.bindPopup(`<b>Path ID: ${pathData[0].gpsName}</b><br>จำนวนจุด: ${latLngs.length}`);

        // เก็บ Polyline ที่เพิ่มไว้ใน array เพื่อให้สามารถลบออกได้ภายหลัง
        window.polylines.push(polyline);
    });
}

// ฟังก์ชันดึงข้อมูลเส้นทางจาก API
function getPathsFromAPI(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                return data;
            } else {
                throw new Error('No data found');
            }
        })
        .catch(error => console.error('Error fetching paths:', error));
}

// ฟังก์ชันอัพเดตเส้นทางจากหลาย API ทุกๆ 1 วินาที
function updatePaths(map, urls) {
    const colors = ['red', 'blue', 'green', 'orange', 'purple', 'cyan', 'yellow'];  // กำหนดสีต่างๆ ให้กับแต่ละ API

    setInterval(() => {
        // ดึงข้อมูลจากหลายๆ API
        Promise.all(urls.map(url => getPathsFromAPI(url)))
            .then(allPathsData => {
                // เพิ่ม polyline จากข้อมูลหลาย API พร้อมสีที่แตกต่างกัน
                allPathsData.forEach((paths, index) => {
                    var color = colors[index % colors.length];  // เลือกสีจาก array ที่กำหนด
                    addPolyline(map, paths, color);
                });
            })
            .catch(error => console.error('Error fetching paths from multiple APIs:', error));
    }, 1000);  // ทุกๆ 1 วินาที
}

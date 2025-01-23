// ฟังก์ชันเพิ่ม Polyline จากหลาย API
function addPolyline(map, paths, color) {
    // ลบเส้นทางเก่าก่อนที่จะเพิ่มเส้นทางใหม่
    if (window.polylines) {
        window.polylines.forEach(polyline => {
            map.removeLayer(polyline);
        });
    }
    window.polylines = []; // รีเซ็ตเส้นทางใหม่

    // ตรวจสอบว่า paths เป็น array หรือไม่
    if (!Array.isArray(paths)) {
        console.error('paths is not an array:', paths);
        return; // ถ้าไม่ใช่ array ให้หยุดการทำงาน
    }

    // สร้างเส้น Polyline จากพิกัดที่ได้รับจาก API
    paths.forEach(pathData => {
        // ตรวจสอบว่า pathData เป็น array หรือไม่
        if (!Array.isArray(pathData)) {
            console.error('pathData is not an array:', pathData);
            return; // ถ้า pathData ไม่ใช่ array ให้หยุดการทำงาน
        }

        // สร้าง latLngs จาก pathData (ดึง latitude และ longitude จากแต่ละ object)
        var latLngs = pathData.map(coord => {
            var lat = parseFloat(coord.latitude);
            var lng = parseFloat(coord.longitude);
            return [lat, lng];
        });

        // สร้าง Polyline
        var polyline = L.polyline(latLngs, { color: color }).addTo(map);

        // เพิ่ม Popup สำหรับ Polyline (หากต้องการ)
        polyline.bindPopup(`<b>GPS Name: ${pathData[0].gpsName}</b><br>จำนวนจุด: ${latLngs.length}`);

        // เก็บ Polyline ที่เพิ่มไว้ใน array เพื่อให้สามารถลบออกได้ภายหลัง
        window.polylines.push(polyline);
    });
}

// ฟังก์ชันดึงข้อมูลเส้นทางจาก API
function getPathsFromAPI(url) {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Data from API:', data); // พิมพ์ข้อมูลที่ได้จาก API
            if (Array.isArray(data)) {
                return [data];  // แปลงเป็น array ของ array สำหรับเส้นทางเดียว
            } else {
                return [data];  // หากไม่ได้เป็น array ก็แปลงเป็น array ที่มี object เดียว
            }
        })
        .catch(error => {
            console.error('Error fetching paths:', error);
            throw error; // เพิ่ม throw เพื่อให้ Promise ถูก reject
        });
}

// ฟังก์ชันอัพเดตเส้นทางจากหลาย API ทุกๆ 1 วินาที
function updatePaths(map, urls) {
    setInterval(() => {
        // ดึงข้อมูลจากหลายๆ API
        Promise.all(urls.map(url => getPathsFromAPI(url)))
            .then(allPathsData => {
                // เพิ่ม polyline จากข้อมูลหลาย API
                allPathsData.forEach((paths, index) => {
                    // สร้างสีที่แตกต่างกันสำหรับแต่ละ API
                    const color = index % 2 === 0 ? 'blue' : 'green'; // กำหนดสีให้ต่างกัน
                    addPolyline(map, paths, color);
                });
            })
            .catch(error => console.error('Error fetching paths from multiple APIs:', error));
    }, 1000);  // ทุกๆ 1 วินาที
}

// เมื่อเอกสารพร้อมโหลด
document.addEventListener('DOMContentLoaded', function () {
    // สร้างแผนที่
    var map = L.map('map').setView([13.75, 100.50], 13); // กำหนดจุดศูนย์กลางแผนที่

    // ตั้งค่าภาพพื้นหลังแผนที่
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // URLs ของหลายๆ API
    var apiUrls = [
        'http://183.88.215.106:1880/node1', // URL ตัวอย่าง API 1
        'http://183.88.215.106:1880/node2'      // URL ตัวอย่าง API 2
    ];

    // อัพเดตเส้นทางจากหลาย API ทุกๆ 1 วินาที
    updatePaths(map, apiUrls);
});

// app.js

    // ฟังก์ชันแปลงละติจูดและลองจิจูดเป็น MGRS
    function latLonToMGRS(latitude, longitude, precision = 5) {
        try {
          return mgrs.forward([longitude, latitude], precision);
        } catch (error) {
          console.error('Error converting Lat/Lon to MGRS:', error);
          return null;
        }
      }

      function mgrsToLatLon(mgrsString) {
        try {
          const [longitude, latitude] = mgrs.toPoint(mgrsString);
          return { latitude, longitude };
        } catch (error) {
          console.error('Error converting MGRS to Lat/Lon:', error);
          return null;
        }
      }

// กำหนด configurations สำหรับ Markers API ก่อนใช้งาน
const markersApiConfigs = [
    {
        name: "node1", // ชื่อของ Layer Group สำหรับ Markers API แรก
        url: 'http://183.88.215.106:1880/nownode1', // URL ของ API ที่ให้ข้อมูล markers
        color: 'blue', // สีของ markers (ถ้าต้องการแยกสีสำหรับแต่ละ API)
        iconUrl: 'images/111.gif' // ไอคอนสำหรับ Markers API แรก
    },
    {
        name: "node2",
        url: 'http://183.88.215.106:1880/nownode2',
        color: 'green',
        iconUrl: 'images/222.gif'
    },
    {
        name: "node3",
        url: 'http://183.88.215.106:1880/nownode3',
        color: 'green',
        iconUrl: 'images/333.gif'
    },
    {
        name: "node4",
        url: 'http://183.88.215.106:1880/nownode4',
        color: 'green',
        iconUrl: 'images/444.gif'
    },
    {
        name: "node5",
        url: 'http://183.88.215.106:1880/nownode5',
        color: 'green',
        iconUrl: 'images/555.gif'
    },
    // สามารถเพิ่ม configurations สำหรับ API อื่น ๆ ได้ตามต้องการ
  ];
  
  // กำหนด configurations สำหรับ Polylines API ก่อนใช้งาน
  const polylinesApiConfigs = [
    {
        name: "Polylines node 1",
        url: 'http://183.88.215.106:1880/node3',
        color: 'red'
    },
    {
        name: "Polylines node 2",
        url: 'http://183.88.215.106:1880/node2',
        color: 'blue'
    },
    {
        name: "Polylines node 3",
        url: 'http://183.88.215.106:1880/node3',
        color: 'orange'
    },
    {
        name: "Polylines node 4",
        url: 'http://183.88.215.106:1880/node4',
        color: 'green'
    },
    {
        name: "Polylines node 5",
        url: 'http://183.88.215.106:1880/node5',
        color: 'purple'
    },
    // สามารถเพิ่ม configurations สำหรับ Polylines API อื่น ๆ ได้ตามต้องการ
  ];
  
  // กำหนด configurations สำหรับ WMS Layers
  const wmsLayerConfigs = [
    {
        name: "Map50k:51364", // ชื่อของ WMS Layer
        url: 'http://183.88.215.106:8086/geoserver/Map50k/wms', // URL ของ WMS Service
        layers: 'Map50k:51364', // เลเยอร์ที่ต้องการแสดง
        format: 'image/png', // รูปแบบภาพ
        transparent: true, // ให้พื้นหลังโปร่งใส
        attribution: '&copy; GeoServer' // ข้อความเครดิต
    },
    {
        name: "Map50k:54382",
        url: 'http://183.88.215.106:8086/geoserver/Map50k/wms',
        layers: 'Map50k:54382',
        format: 'image/png',
        transparent: true,
        attribution: '&copy; GeoServer'
    },
    // สามารถเพิ่ม configurations สำหรับ WMS Layer อื่น ๆ ได้ตามต้องการ
  ];
  
  // ฟังก์ชันสร้างแผนที่และตั้งค่าพื้นฐาน
  function createMap() {
      console.log('Initializing map...');
      const map = L.map('map').setView([13.7912, 102.1516], 13);
  
      // เพิ่ม base layer จาก OpenStreetMap
      const openStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      
      const stamenTerrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {
        attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap contributors' // ข้อความเครดิตสำหรับ Stamen Terrain
    });
      
  
      // สร้าง Layer Group สำหรับ Markers, Polylines และ WMS Layers
      const markersLayerGroup = {};
      const polylinesLayerGroup = {};
      const wmsLayerGroup = {};
  
      // กำหนด base layers
      const baseLayers = {
          "OpenStreetMap": openStreetMap,
          "Stamen Terrain": stamenTerrain // เพิ่ม Stamen Terrain เป็นหนึ่งใน base layers
          // เพิ่ม base layers อื่นๆ ตามต้องการ
      };
  
      // กำหนด overlays
      const overlays = {};
  
      // สร้าง Layer Group สำหรับแต่ละ Markers API และเพิ่มเข้าไปใน overlays
      markersApiConfigs.forEach(config => {
          markersLayerGroup[config.name] = L.layerGroup().addTo(map);
          overlays[config.name] = markersLayerGroup[config.name];
      });
  
      // สร้าง Layer Group สำหรับแต่ละ Polylines API และเพิ่มเข้าไปใน overlays
      polylinesApiConfigs.forEach(config => {
          polylinesLayerGroup[config.name] = L.layerGroup().addTo(map);
          overlays[config.name] = polylinesLayerGroup[config.name];
      });
  
      // สร้าง WMS Layers และเพิ่มเข้าไปใน overlays
      wmsLayerConfigs.forEach(config => {
          wmsLayerGroup[config.name] = L.tileLayer.wms(config.url, {
              layers: config.layers,
              format: config.format,
              transparent: config.transparent,
              attribution: config.attribution
          }).addTo(map);
          overlays[config.name] = wmsLayerGroup[config.name];
      });
  
      // เพิ่ม layer controls ไปยังแผนที่
      L.control.layers(baseLayers, overlays).addTo(map);
  
      return { map, markersLayerGroup, polylinesLayerGroup, wmsLayerGroup };
  }
  
  // ฟังก์ชันดึงข้อมูล markers จาก API
  async function getMarkersFromAPI(url) {
      try {
          const response = await fetch(url); // ส่งคำขอ HTTP GET ไปยัง URL ที่กำหนด
          const data = await response.json(); // แปลงข้อมูลที่ได้รับเป็น JSON
          console.log('Markers data from', url, ':', data);
          return Array.isArray(data) ? data : []; // ตรวจสอบว่า data เป็นอาร์เรย์หรือไม่ ถ้าไม่ให้คืนค่าเป็นอาร์เรย์ว่าง
      } catch (error) {
          console.error('Error fetching markers from', url, ':', error); // แสดงข้อผิดพลาดใน console
          return []; // คืนค่าเป็นอาร์เรย์ว่างในกรณีเกิดข้อผิดพลาด
      }
  }
  
  // ฟังก์ชันเพิ่ม markers ลงใน Layer Group
  function addMarkers(locations, customIcon, markersLayer) {
      locations.forEach(location => { // วนลูปผ่านแต่ละ location ในอาร์เรย์ locations
          const lat = parseFloat(location.latitude); // แปลงค่าพิกัดละติจูดเป็นตัวเลขทศนิยม
          const lng = parseFloat(location.longitude); // แปลงค่าพิกัดลองจิจูดเป็นตัวเลขทศนิยม
  
          if (isNaN(lat) || isNaN(lng)) { // ตรวจสอบว่าพิกัดเป็นตัวเลขหรือไม่
              console.warn('Invalid coordinates:', location); // ถ้าไม่ใช่ ให้แสดงคำเตือนใน console
              return; // ข้ามการเพิ่ม marker สำหรับ location นี้
          }
  
          const marker = L.marker([lat, lng], { icon: customIcon }); // สร้าง marker ใหม่ที่ตำแหน่ง lat, lng และใช้ไอคอนที่กำหนด
          marker.bindPopup(`<b>GPS Name: ${location.gpsName}</b><br>Time: ${location.time}<br>${location.latitude} | ${location.longitude}`); // ผูก popup กับ marker เพื่อแสดงข้อมูลเมื่อคลิก
          markersLayer.addLayer(marker); // เพิ่ม marker ลงใน Layer Group ที่กำหนด
      });
  }
  
  // ฟังก์ชันอัพเดท markers ทุกๆ 1 วินาที สำหรับแต่ละ API
  function updateMarkers(config, customIcon, markersLayer) {
      let prevLocations = []; // ตัวแปรเก็บสถานะก่อนหน้าเพื่อเปรียบเทียบ
  
      setInterval(async () => { // ตั้งค่าการทำงานซ้ำทุกๆ 1000 มิลลิวินาที (1 วินาที)
          const locations = await getMarkersFromAPI(config.url); // ดึงข้อมูล markers จาก API
          const isSame = JSON.stringify(locations) === JSON.stringify(prevLocations); // เปรียบเทียบข้อมูลปัจจุบันกับข้อมูลก่อนหน้า
  
          if (!isSame) { // ถ้าข้อมูลเปลี่ยนแปลง
              prevLocations = locations; // อัปเดตข้อมูลก่อนหน้า
              markersLayer.clearLayers(); // ล้าง markers เก่าใน Layer Group
              addMarkers(locations, customIcon, markersLayer); // เพิ่ม markers ใหม่ลงใน Layer Group
              updateMarkersTable(config.name, locations); // อัปเดตตารางข้อมูลใน Sidebar
          }
      }, 1000); // เวลาที่ตั้งไว้คือ 1000 มิลลิวินาที (1 วินาที)
  }
  
  // ฟังก์ชันดึงข้อมูล polylines จาก API
  async function getPolylinesFromAPI(url) {
      try {
          const response = await fetch(url); // ส่งคำขอ HTTP GET ไปยัง URL ที่กำหนด
          const data = await response.json(); // แปลงข้อมูลที่ได้รับเป็น JSON
          console.log('Polylines data from', url, ':', data);
  
          if (Array.isArray(data.paths)) { // ตรวจสอบว่า data.paths เป็นอาร์เรย์หรือไม่
              return data.paths; // คืนค่า data.paths ถ้าใช่
          } else if (Array.isArray(data)) { // ถ้า data เองเป็นอาร์เรย์
              return [data]; // คืนค่าเป็นอาร์เรย์ของ data
          } else {
              throw new Error('Invalid data format for polylines'); // ถ้าไม่ใช่ ให้โยนข้อผิดพลาด
          }
      } catch (error) {
          console.error('Error fetching polylines from', url, ':', error); // แสดงข้อผิดพลาดใน console
          return []; // คืนค่าเป็นอาร์เรย์ว่างในกรณีเกิดข้อผิดพลาด
      }
  }
  
  // ฟังก์ชันเพิ่ม polylines ลงใน Layer Group
  function addPolylines(paths, polylinesLayer, color) {
      paths.forEach(path => { // วนลูปผ่านแต่ละ path ในอาร์เรย์ paths
          if (!Array.isArray(path)) { // ตรวจสอบว่า path เป็นอาร์เรย์หรือไม่
              console.error('Path is not an array:', path); // ถ้าไม่ใช่ ให้แสดงข้อผิดพลาดใน console
              return; // ข้ามการเพิ่ม polyline สำหรับ path นี้
          }
  
          const latLngs = path.map(coord => { // แปลงแต่ละ coord ใน path เป็นพิกัด lat, lng
              const lat = parseFloat(coord.latitude); // แปลงค่าพิกัดละติจูดเป็นตัวเลขทศนิยม
              const lng = parseFloat(coord.longitude); // แปลงค่าพิกัดลองจิจูดเป็นตัวเลขทศนิยม
              return [lat, lng]; // คืนค่าพิกัดในรูปแบบ [lat, lng]
          }).filter(latLng => !isNaN(latLng[0]) && !isNaN(latLng[1])); // กรองพิกัดที่ไม่ใช่ตัวเลข
  
          if (latLngs.length === 0) { // ตรวจสอบว่ามีพิกัดที่ถูกต้องหรือไม่
              console.warn('No valid coordinates for polyline:', path); // ถ้าไม่มี ให้แสดงคำเตือนใน console
              return; // ข้ามการเพิ่ม polyline สำหรับ path นี้
          }
  
          console.log('Adding polyline with points:', latLngs);
  
          const polyline = L.polyline(latLngs, { color: color, weight: 5, opacity: 0.7 }); // สร้าง polyline ใหม่ด้วยพิกัดและสีที่กำหนด
          polyline.bindPopup(`<b>GPS Name: ${path[0].gpsName}</b><br>Number of points: ${latLngs.length}`); // ผูก popup กับ polyline เพื่อแสดงข้อมูลเมื่อคลิก
          polylinesLayer.addLayer(polyline); // เพิ่ม polyline ลงใน Layer Group ที่กำหนด
      });
  }
  
  // ฟังก์ชันอัพเดท polylines ทุกๆ 1 วินาที สำหรับแต่ละ API
  function updatePolylines(config, polylinesLayer, color) {
      let prevPaths = []; // ตัวแปรเก็บสถานะก่อนหน้าเพื่อเปรียบเทียบ
  
      setInterval(async () => { // ตั้งค่าการทำงานซ้ำทุกๆ 1000 มิลลิวินาที (1 วินาที)
          const paths = await getPolylinesFromAPI(config.url); // ดึงข้อมูล polylines จาก API
          const isSame = JSON.stringify(paths) === JSON.stringify(prevPaths); // เปรียบเทียบข้อมูลปัจจุบันกับข้อมูลก่อนหน้า
  
          if (!isSame) { // ถ้าข้อมูลเปลี่ยนแปลง
              prevPaths = paths; // อัปเดตข้อมูลก่อนหน้า
              polylinesLayer.clearLayers(); // ล้าง polylines เก่าใน Layer Group
              addPolylines(paths, polylinesLayer, color); // เพิ่ม polylines ใหม่ลงใน Layer Group
          }
      }, 1000); // เวลาที่ตั้งไว้คือ 1000 มิลลิวินาที (1 วินาที)
  }
  
  // ฟังก์ชันอัพเดทตารางข้อมูลใน Sidebar
  function updateMarkersTable(apiName, locations) {
      const tableBody = document.querySelector('#markersTable tbody'); // เลือกส่วน tbody ของตารางใน Sidebar
  
      // ลบแถวเก่าที่เกี่ยวข้องกับ API นี้
      const existingRows = tableBody.querySelectorAll(`tr[data-api="${apiName}"]`); // เลือกแถวทั้งหมดที่มี data-api เท่ากับ apiName
      existingRows.forEach(row => row.remove()); // ลบแถวเหล่านั้นออกจากตาราง
  
      // เพิ่มแถวใหม่
      locations.forEach(location => { // วนลูปผ่านแต่ละ location ในอาร์เรย์ locations
          const tr = document.createElement('tr'); // สร้าง element แถวใหม่
          tr.setAttribute('data-api', apiName); // กำหนด attribute data-api ให้กับแถว
  
          const tdApi = document.createElement('td'); // สร้าง cell สำหรับ API Name
          tdApi.textContent = apiName; // ตั้งค่าข้อความใน cell เป็นชื่อ API
  
          const tdName = document.createElement('td'); // สร้าง cell สำหรับ Name
          tdName.textContent = location.gpsName || 'N/A'; // ตั้งค่าข้อความใน cell เป็นชื่อ GPS หรือ 'N/A' ถ้าไม่มี
  
          const tdLat = document.createElement('td'); // สร้าง cell สำหรับ Latitude
          tdLat.textContent = location.latitude || 'N/A'; // ตั้งค่าข้อความใน cell เป็นค่าละติจูด หรือ 'N/A' ถ้าไม่มี
  
          const tdLng = document.createElement('td'); // สร้าง cell สำหรับ Longitude
          tdLng.textContent = location.longitude || 'N/A'; // ตั้งค่าข้อความใน cell เป็นค่าลองจิจูด หรือ 'N/A' ถ้าไม่มี

        //   const mgrsCoord = latLonToMGRS(location.latitude, location.longitude);
          
        //   const tdMGRS = document.createElement('td'); // สร้าง cell สำหรับ Longitude
        //   tdMGRS.textContent = mgrsCoord || 'N/A'; // ตั้งค่าข้อความใน cell เป็นค่าลองจิจูด หรือ 'N/A' ถ้าไม่มี

          const tdTime = document.createElement('td'); // สร้าง cell สำหรับ Longitude
          tdTime.textContent = location.time || 'N/A'; // ตั้งค่าข้อความใน cell เป็นค่าลองจิจูด หรือ 'N/A' ถ้าไม่มี
  
          tr.appendChild(tdApi); // เพิ่ม cell API Name ลงในแถว
          tr.appendChild(tdName); // เพิ่ม cell Name ลงในแถว
          tr.appendChild(tdLat); // เพิ่ม cell Latitude ลงในแถว
          tr.appendChild(tdLng); // เพิ่ม cell Longitude ลงในแถว
        //   tr.appendChild(tdMGRS); // เพิ่ม cell Longitude ลงในแถว
          tr.appendChild(tdTime); // เพิ่ม cell time ลงในแถว
  
          tableBody.appendChild(tr); // เพิ่มแถวใหม่ลงใน tbody ของตาราง
      });
  }
  
  // เมื่อลง DOM เสร็จสมบูรณ์
  document.addEventListener('DOMContentLoaded', function () {
      console.log('DOM fully loaded and parsed'); // แสดงข้อความใน console ว่า DOM ถูกโหลดเสร็จแล้ว
      const { map, markersLayerGroup, polylinesLayerGroup, wmsLayerGroup } = createMap(); // สร้างแผนที่และ Layer Groups
  
      // ตั้งค่าอัพเดท markers สำหรับแต่ละ API
      markersApiConfigs.forEach(config => { // วนลูปผ่านแต่ละ configuration ของ Markers API
          const customIcon = L.icon({ // สร้างไอคอนแบบกำหนดเองสำหรับ marker
              iconUrl: config.iconUrl, // กำหนด URL ของไอคอน
              iconSize: [32, 32], // กำหนดขนาดของไอคอน (ความกว้าง, ความสูง)
              iconAnchor: [16, 32], // กำหนดจุด anchor ของไอคอน (ตำแหน่งที่จะใช้เพื่อวาง marker บนแผนที่)
              popupAnchor: [0, -32] // กำหนดตำแหน่งของ popup เมื่อคลิก marker
          });
  
          updateMarkers(config, customIcon, markersLayerGroup[config.name]); // เรียกใช้ฟังก์ชันอัพเดท markers สำหรับ API นี้
      });
  
      // ตั้งค่าอัพเดท polylines สำหรับแต่ละ API
      polylinesApiConfigs.forEach(config => { // วนลูปผ่านแต่ละ configuration ของ Polylines API
          updatePolylines(config, polylinesLayerGroup[config.name], config.color); // เรียกใช้ฟังก์ชันอัพเดท polylines สำหรับ API นี้
      });
  });

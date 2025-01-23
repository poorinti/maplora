// app.js

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
  // สามารถเพิ่ม configurations สำหรับ API อื่น ๆ ได้ตามต้องการ
];

// กำหนด configurations สำหรับ WMS Layers
const wmsLayerConfigs = [
  {
      name: "WMS Layer 1", // ชื่อของ WMS Layer
      url: 'http://183.88.215.106:8086/geoserver/Map50k/wms', // URL ของ WMS Service
      layers: 'Map50k:51364', // เลเยอร์ที่ต้องการแสดง
      format: 'image/png', // รูปแบบภาพ
      transparent: true, // ให้พื้นหลังโปร่งใส
      attribution: '&copy; GeoServer' // ข้อความเครดิต
  },
  {
      name: "WMS Layer 2",
      url: 'http://your-geoserver-domain/geoserver/wms',
      layers: 'workspace:layer2',
      format: 'image/png',
      transparent: true,
      attribution: '&copy; GeoServer'
  },
  // สามารถเพิ่ม configurations สำหรับ WMS Layer อื่น ๆ ได้ตามต้องการ
];

// ฟังก์ชันสร้างแผนที่และตั้งค่าพื้นฐาน
function createMap() {
  // สร้างแผนที่ Leaflet โดยกำหนดจุดเริ่มต้นที่พิกัดละติจูด 13.7912 และลองจิจูด 102.1516 พร้อมกับระดับการซูมที่ 13
  var map = L.map('map').setView([13.7912, 102.1516], 13);

  // สร้าง base layer แรกจาก OpenStreetMap
  var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors' // ข้อความเครดิตสำหรับ OpenStreetMap
  });

  // สร้าง base layer ที่สองจาก Stamen Terrain
  var stamenTerrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {
      attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap contributors' // ข้อความเครดิตสำหรับ Stamen Terrain
  });

  // เพิ่ม base layer OpenStreetMap ไปยังแผนที่
  openStreetMap.addTo(map);

  // สร้าง object เพื่อเก็บ Layer Group สำหรับ markers จากแต่ละ API
  var markersLayerGroup = {}; // Object สำหรับเก็บ Layer Group ของแต่ละ API

  // สร้าง object เพื่อเก็บ Layer Group สำหรับ polylines จากแต่ละ API
  var polylinesLayerGroup = {}; // Object สำหรับเก็บ Layer Group ของแต่ละ API

  // สร้าง object เพื่อเก็บ Layer Group สำหรับ WMS Layers
  var wmsLayerGroup = {}; // Object สำหรับเก็บ Layer Group ของแต่ละ WMS Layer

  // กำหนด base layers สำหรับการควบคุม layer บนแผนที่
  var baseLayers = {
      "OpenStreetMap": openStreetMap, // เพิ่ม OpenStreetMap เป็นหนึ่งใน base layers
      "Stamen Terrain": stamenTerrain // เพิ่ม Stamen Terrain เป็นหนึ่งใน base layers
  };

  // กำหนด overlays สำหรับการควบคุม layer บนแผนที่
  var overlays = {
      // จะถูกเพิ่มในภายหลังจากการวนลูปผ่าน polylinesApiConfigs และ wmsLayerConfigs
  };

  // สร้าง Layer Group สำหรับแต่ละ Markers API และเพิ่มเข้าไปใน overlays
  markersApiConfigs.forEach(config => {
      markersLayerGroup[config.name] = L.layerGroup().addTo(map); // สร้าง Layer Group สำหรับแต่ละ API
      overlays[config.name] = markersLayerGroup[config.name]; // เพิ่ม Layer Group เข้าไปใน overlays ด้วยชื่อที่กำหนด
  });

  // สร้าง Layer Group สำหรับแต่ละ Polylines API และเพิ่มเข้าไปใน overlays
  polylinesApiConfigs.forEach(config => {
      polylinesLayerGroup[config.name] = L.layerGroup().addTo(map); // สร้าง Layer Group สำหรับแต่ละ API
      overlays[config.name] = polylinesLayerGroup[config.name]; // เพิ่ม Layer Group เข้าไปใน overlays ด้วยชื่อที่กำหนด
  });

  // สร้าง WMS Layers และเพิ่มเข้าไปใน overlays
  wmsLayerConfigs.forEach(config => {
      wmsLayerGroup[config.name] = L.tileLayer.wms(config.url, {
          layers: config.layers,
          format: config.format,
          transparent: config.transparent,
          attribution: config.attribution
      }).addTo(map); // สร้าง WMS Layer และเพิ่มเข้าไปในแผนที่
      overlays[config.name] = wmsLayerGroup[config.name]; // เพิ่ม WMS Layer เข้าไปใน overlays ด้วยชื่อที่กำหนด
  });

  // เพิ่ม layer controls ไปยังแผนที่ เพื่อให้สามารถสลับ layers ได้
  L.control.layers(baseLayers, overlays).addTo(map);

  // ส่งคืน object ที่ประกอบด้วย map, markersLayerGroup, polylinesLayerGroup และ wmsLayerGroup
  return { map: map, markersLayerGroup: markersLayerGroup, polylinesLayerGroup: polylinesLayerGroup, wmsLayerGroup: wmsLayerGroup };
}

// ฟังก์ชันดึงข้อมูล markers จาก API โดยใช้ async/await
async function getMarkersFromAPI(url) {
  try {
      // ส่งคำขอไปยัง URL ของ API
      const response = await fetch(url);
      // แปลงการตอบกลับเป็น JSON
      const data = await response.json();
      // แสดงข้อมูล markers ใน console พร้อมกับ URL ของ API
      console.log('Markers data from', url, ':', data);
      // ตรวจสอบว่า data เป็น array หรือไม่ ถ้าใช่ คืนค่า data, ถ้าไม่ใช่ คืนค่า array ว่าง
      return Array.isArray(data) ? data : [];
  } catch (error) {
      // ถ้ามีข้อผิดพลาดในการดึงข้อมูลจาก API, แสดงข้อผิดพลาดใน console
      console.error('Error fetching markers from', url, ':', error);
      // คืนค่า array ว่างในกรณีที่เกิดข้อผิดพลาด
      return [];
  }
}

// ฟังก์ชันเพิ่ม markers ลงใน Layer Group
function addMarkers(locations, customIcon, markersLayer) {
  // วนลูปผ่านแต่ละ location ใน array ของ locations
  locations.forEach(location => {
      // แปลงค่าพิกัด latitude และ longitude เป็นตัวเลข
      var lat = parseFloat(location.latitude);
      var lng = parseFloat(location.longitude);

      // ตรวจสอบว่าพิกัดเป็นตัวเลขที่ถูกต้องหรือไม่
      if (isNaN(lat) || isNaN(lng)) {
          // ถ้าพิกัดไม่ถูกต้อง, แจ้งเตือนใน console และข้ามการทำงานสำหรับ location นี้
          console.warn('Invalid coordinates:', location);
          return;
      }

      // สร้าง marker ด้วยพิกัดและไอคอนที่กำหนด
      var marker = L.marker([lat, lng], { icon: customIcon });
      // เพิ่ม popup ให้กับ marker โดยแสดงชื่อ GPS และเวลาที่บันทึก
      marker.bindPopup(`<b>GPS Name: ${location.gpsName}</b><br>Time: ${location.time}<br>${location.latitude} | ${location.longitude}`);
      // เพิ่ม marker ลงใน markersLayer
      markersLayer.addLayer(marker);
  });
}

// ฟังก์ชันอัพเดท markers ทุกๆ 1 วินาที สำหรับแต่ละ API
function updateMarkers(config, customIcon, markersLayer) {
  let prevLocations = []; // ตัวแปรเก็บสถานะก่อนหน้าของ markers

  // ใช้ setInterval เพื่อเรียกฟังก์ชันทุกๆ 1000 มิลลิวินาที (1 วินาที)
  setInterval(async () => {
      // ดึงข้อมูล markers จาก API โดยใช้ URL ที่กำหนดใน config
      const locations = await getMarkersFromAPI(config.url);
      // ตรวจสอบว่า markers ใหม่เหมือนกับ markers ก่อนหน้าหรือไม่โดยการเปรียบเทียบ JSON ของทั้งสอง
      const isSame = JSON.stringify(locations) === JSON.stringify(prevLocations);

      if (!isSame) { // ถ้าข้อมูล markers เปลี่ยนแปลง
          prevLocations = locations; // อัพเดตสถานะของ markers ให้เป็นข้อมูลใหม่
          markersLayer.clearLayers(); // ล้าง markers เก่าจากแผนที่
          addMarkers(locations, customIcon, markersLayer); // เพิ่ม markers ใหม่ลงในแผนที่
      }
      // ถ้า markers ไม่เปลี่ยนแปลง ก็ไม่ต้องทำอะไร
  }, 1000); // ทุกๆ 1 วินาที
}

// ฟังก์ชันดึงข้อมูล polylines จาก API โดยใช้ async/await
async function getPolylinesFromAPI(url) {
  try {
      // ส่งคำขอไปยัง URL ของ API
      const response = await fetch(url);
      // แปลงการตอบกลับเป็น JSON
      const data = await response.json();
      // แสดงข้อมูล polylines ใน console พร้อมกับ URL ของ API
      console.log('Polylines data from', url, ':', data);

      // ตรวจสอบว่า data.paths เป็น array หรือไม่
      if (Array.isArray(data.paths)) {
          return data.paths; // ถ้า data.paths เป็น array, คืนค่า data.paths
      } else if (Array.isArray(data)) {
          return [data]; // ถ้า data เป็น array ของ objects โดยตรง, ห่อข้อมูลเป็น array ของ paths เพื่อให้ฟังก์ชัน addPolylines สามารถประมวลผลได้
      } else {
          // ถ้า data ไม่ตรงกับรูปแบบที่คาดหวัง, โยนข้อผิดพลาด
          throw new Error('Invalid data format for polylines');
      }
  } catch (error) {
      // ถ้ามีข้อผิดพลาดในการดึงข้อมูลจาก API, แสดงข้อผิดพลาดใน console
      console.error('Error fetching polylines from', url, ':', error);
      // คืนค่า array ว่างในกรณีที่เกิดข้อผิดพลาด
      return [];
  }
}

// ฟังก์ชันเพิ่ม polylines ลงใน Layer Group
function addPolylines(paths, polylinesLayer, color) {
  // วนลูปผ่านแต่ละ path ใน array ของ paths
  paths.forEach(path => {
      // ตรวจสอบว่า path เป็น array หรือไม่
      if (!Array.isArray(path)) {
          // ถ้า path ไม่ใช่ array, แจ้งข้อผิดพลาดใน console และข้ามการทำงานสำหรับ path นี้
          console.error('Path is not an array:', path);
          return;
      }

      // แปลงค่าพิกัดใน path เป็น array ของ [latitude, longitude]
      var latLngs = path.map(coord => {
          var lat = parseFloat(coord.latitude); // แปลง latitude เป็นตัวเลข
          var lng = parseFloat(coord.longitude); // แปลง longitude เป็นตัวเลข
          return [lat, lng]; // คืนค่าเป็น array ของ [lat, lng]
      }).filter(latLng => !isNaN(latLng[0]) && !isNaN(latLng[1])); // กรองพิกัดที่ไม่ถูกต้องออก

      // ตรวจสอบว่ามีพิกัดที่ถูกต้องหรือไม่
      if (latLngs.length === 0) {
          // ถ้าไม่มีพิกัดที่ถูกต้อง, แจ้งเตือนใน console และข้ามการทำงานสำหรับ path นี้
          console.warn('No valid coordinates for polyline:', path);
          return;
      }

      // แสดงพิกัดที่ใช้ในการสร้าง polyline ใน console เพื่อการดีบัก
      console.log('Adding polyline with points:', latLngs);

      // สร้าง polyline ด้วยพิกัดและสีที่กำหนด
      var polyline = L.polyline(latLngs, { color: color, weight: 5, opacity: 0.7 });
      // เพิ่ม popup ให้กับ polyline โดยแสดงชื่อ GPS และจำนวนจุด
      polyline.bindPopup(`<b>GPS Name: ${path[0].gpsName}</b><br>Number of points: ${latLngs.length}`);
      // เพิ่ม polyline ลงใน polylinesLayer
      polylinesLayer.addLayer(polyline);
  });
}

// ฟังก์ชันอัพเดท polylines ทุกๆ 1 วินาที สำหรับแต่ละ API
function updatePolylines(config, polylinesLayer, color) {
  let prevPaths = []; // ตัวแปรเก็บสถานะก่อนหน้าของ polylines

  // ใช้ setInterval เพื่อเรียกฟังก์ชันทุกๆ 1000 มิลลิวินาที (1 วินาที)
  setInterval(async () => {
      // ดึงข้อมูล polylines จาก API โดยใช้ URL ที่กำหนดใน config
      const paths = await getPolylinesFromAPI(config.url);
      // ตรวจสอบว่า polylines ใหม่เหมือนกับ polylines ก่อนหน้าหรือไม่โดยการเปรียบเทียบ JSON ของทั้งสอง
      const isSame = JSON.stringify(paths) === JSON.stringify(prevPaths);

      if (!isSame) { // ถ้าข้อมูล polylines เปลี่ยนแปลง
          prevPaths = paths; // อัพเดตสถานะของ polylines ให้เป็นข้อมูลใหม่
          polylinesLayer.clearLayers(); // ล้าง polylines เก่าจากแผนที่
          addPolylines(paths, polylinesLayer, color); // เพิ่ม polylines ใหม่ลงในแผนที่
      }
      // ถ้า polylines ไม่เปลี่ยนแปลง ก็ไม่ต้องทำอะไร
  }, 1000); // ทุกๆ 1 วินาที
}

// เมื่อลง DOM (Document Object Model) เสร็จสมบูรณ์
document.addEventListener('DOMContentLoaded', function () {
  // สร้างแผนที่ และรับ layers สำหรับ markers, polylines และ WMS จากฟังก์ชัน createMap()
  var { map, markersLayerGroup, polylinesLayerGroup, wmsLayerGroup } = createMap();

  // ตั้งค่าอัพเดท markers สำหรับแต่ละ API ตาม configurations ที่กำหนดใน markersApiConfigs
  markersApiConfigs.forEach(config => {
      // สร้าง custom icon สำหรับแต่ละ API
      var customIcon = L.icon({
          iconUrl: config.iconUrl, // ใช้ iconUrl จาก config
          iconSize: [32, 32], // ขนาดของไอคอน (ความกว้าง 32px, ความสูง 32px)
          iconAnchor: [16, 32], // จุดที่ใช้จับพิกัดของ marker (กลางด้านล่างของไอคอน)
          popupAnchor: [0, -32] // จุดที่ popup จะปรากฏเมื่อคลิก marker (เหนือ marker)
      });

      // เรียกใช้ฟังก์ชันอัพเดท markers สำหรับแต่ละ API โดยส่ง configuration, customIcon, และ Layer Group ที่เกี่ยวข้อง
      updateMarkers(config, customIcon, markersLayerGroup[config.name]); // เรียกใช้ฟังก์ชันอัพเดท markers สำหรับแต่ละ API
  });

  // ตั้งค่าอัพเดท polylines สำหรับแต่ละ API ตาม configurations ที่กำหนดใน polylinesApiConfigs
  polylinesApiConfigs.forEach(config => {
      // เรียกใช้ฟังก์ชันอัพเดท polylines สำหรับแต่ละ API โดยส่ง configuration, Layer Group ที่เกี่ยวข้อง, และสีที่กำหนด
      updatePolylines(config, polylinesLayerGroup[config.name], config.color); // เรียกใช้ฟังก์ชันอัพเดท polylines สำหรับแต่ละ API
  });

  // ตั้งค่าอัพเดท WMS Layers (ถ้าจำเป็น)
  // หากคุณต้องการอัพเดท WMS Layers แบบไดนามิก สามารถเพิ่มฟังก์ชันการอัพเดทได้ที่นี่
  // แต่โดยปกติ WMS Layers มักจะไม่ต้องอัพเดทบ่อยครั้ง
});

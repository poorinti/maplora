<?php
// ตัวอย่างข้อมูลตำแหน่ง (ในกรณีนี้ใช้ข้อมูลตัวอย่าง)
// ถ้าคุณใช้ฐานข้อมูลจริง สามารถปรับให้ดึงข้อมูลจากฐานข้อมูลได้
$locations = [
    ["lat" => 13.7, "lng" => 100.5, "popup" => "Marker 1"],
    ["lat" => 13.8, "lng" => 100.6, "popup" => "Marker 2"],
    ["lat" => 13.9, "lng" => 100.7, "popup" => "Marker 3"]
];

// กำหนด header ให้เป็น JSON
header('Content-Type: application/json');

// ส่งข้อมูลในรูปแบบ JSON
echo json_encode($locations);
?>

const Category = require('../models/Category');
const Product  = require('../models/Product');

const CATEGORIES = [
  { name: 'CCTV & Video Surveillance',      slug: 'cctv',           icon: '📹', description: 'Complete video surveillance solutions for homes, offices and industrial sites. HD, 4K and IP camera systems with cloud & local storage.' },
  { name: 'Intrusion & Burglar Alarms',     slug: 'alarms',         icon: '🚨', description: 'Smart alarm systems to detect and deter unauthorized entry. Wired, wireless and hybrid solutions with remote monitoring.' },
  { name: 'Biometric & Access Control',     slug: 'access-control', icon: '🔐', description: 'Advanced fingerprint, face recognition and RFID access control systems for secure entry management in any premises.' },
  { name: 'Video Door Phones & Intercoms',  slug: 'intercoms',      icon: '📞', description: 'See and speak to visitors before opening the door. HD video door phones and intercom systems for apartments and offices.' },
  { name: 'Home & Building Automation',     slug: 'automation',     icon: '🏠', description: 'Smart home and building automation solutions. Control lights, curtains, HVAC and security from one app.' },
  { name: 'Fire Detection & Alarm Systems', slug: 'fire',           icon: '🔥', description: 'Early fire detection and alarm systems. Smoke detectors, heat sensors and complete fire alarm panels for safety compliance.' },
  { name: 'Gate Automation & Parking',      slug: 'gate',           icon: '🚧', description: 'Automated gate systems, boom barriers and parking solutions. Reliable motors and controllers for smooth vehicle access.' },
  { name: 'Networking & Structured Cabling',slug: 'networking',     icon: '🌐', description: 'Enterprise-grade networking infrastructure. Structured cabling, switches, routers and passive components for reliable connectivity.' },
];

const PRODUCTS = [
  /* ── CCTV ─────────────────────────────────────────── */
  { name: 'Hikvision 4MP ColorVu Bullet Camera', category: 'cctv', brand: 'Hikvision', price: 4500, description: '4MP full-colour night vision bullet camera with built-in white light. 60m illumination distance, IP67 weatherproof, H.265+ compression. Ideal for parking lots and outdoor perimeters.', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=75', inStock: true },
  { name: 'Dahua 2MP Dome Camera (IR 30m)',       category: 'cctv', brand: 'Dahua',    price: 2800, description: '2MP Full HD 1080p dome camera with 30m IR night vision. Vandal-resistant IK10 housing, IP67 rating, smart motion detection. Perfect for indoor/outdoor use.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75', inStock: true },
  { name: 'CP Plus 8Ch 4K NVR Kit',              category: 'cctv', brand: 'CP Plus',  price: 18500, description: '8-channel 4K NVR with 4 x 4MP IP cameras. 2TB HDD included, mobile app viewing, motion alerts, HDMI output. Complete plug-and-play kit for small businesses.', image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&q=75', inStock: true },
  { name: 'Hikvision PTZ 36x Optical Zoom',      category: 'cctv', brand: 'Hikvision', price: 32000, description: '2MP PTZ network camera with 36× optical zoom, IR 100m. Auto-tracking, wiper, IP66 & IK10, ideal for large areas, perimeter surveillance and traffic monitoring.', image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=400&q=75', inStock: false },

  /* ── Alarms ────────────────────────────────────────── */
  { name: 'DSC PowerSeries Neo Alarm Panel',      category: 'alarms', brand: 'DSC',    price: 12000, description: 'Professional 8-zone expandable alarm panel with up to 128 zones. Supports wireless and wired detectors, remote arm/disarm via app, event logging and central monitoring.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75', inStock: true },
  { name: 'Honeywell Wireless PIR Detector',      category: 'alarms', brand: 'Honeywell', price: 2200, description: 'Wireless passive infrared motion detector with 15m × 15m coverage. Pet immunity up to 25kg, tamper protection, low battery alert. Compatible with most alarm panels.', image: 'https://media.istockphoto.com/id/2296690744/photo/energy-distribution-plug-in-distribution-system-complete-line-protection-eletric-control.webp?a=1&b=1&s=612x612&w=0&k=20&c=ap7NjGvckjciUo3L6gQdLvrSGYR5AJywjdxI_GA7Alk=', inStock: true },
  { name: 'Bosch Solution 2000 Alarm Kit',        category: 'alarms', brand: 'Bosch',   price: 9500, description: 'Complete home alarm kit: control panel, keypad, 2 PIR sensors, door contact, indoor siren and remote. Easy DIY installation with professional grade reliability.', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=75', inStock: true },

  /* ── Access Control ────────────────────────────────── */
  { name: 'ZKTeco SpeedFace V5L Face + Palm',     category: 'access-control', brand: 'ZKTeco',    price: 22000, description: 'Multi-biometric reader with face recognition, palm vein and RFID. 50000 face templates, visible light algorithm, supports mask detection. Perfect for high-security entry points.', image: 'https://media.istockphoto.com/id/2296690744/photo/energy-distribution-plug-in-distribution-system-complete-line-protection-eletric-control.webp?a=1&b=1&s=612x612&w=0&k=20&c=ap7NjGvckjciUo3L6gQdLvrSGYR5AJywjdxI_GA7Alk=', inStock: true },
  { name: 'eSSL Fingerprint Access Controller',   category: 'access-control', brand: 'eSSL',      price: 7500,  description: 'Fingerprint + RFID access controller with 3000 fingerprint capacity. TCP/IP connectivity, real-time monitoring, anti-passback, supports electric lock and exit button.', image: 'https://images.unsplash.com/photo-1562564055-71e051d33c19?w=400&q=75', inStock: true },
  { name: 'Hikvision RFID Card Reader (IP65)',    category: 'access-control', brand: 'Hikvision',  price: 4800,  description: 'Mifare RFID card reader with keypad. IP65 weatherproof, RS-485 & Wiegand output, supports 10,000 cards. Suitable for office doors, gates and turnstiles.', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=75', inStock: true },

  /* ── Intercoms ─────────────────────────────────────── */
  { name: 'Hikvision 7" Color Video Door Phone',  category: 'intercoms', brand: 'Hikvision', price: 8500,  description: '7-inch TFT color monitor with HD door station. Two-way audio, snapshot & recording, do-not-disturb mode, remotely unlock door via app. Suitable for villas and apartments.', image: 'https://media.istockphoto.com/id/2296690744/photo/energy-distribution-plug-in-distribution-system-complete-line-protection-eletric-control.webp?a=1&b=1&s=612x612&w=0&k=20&c=ap7NjGvckjciUo3L6gQdLvrSGYR5AJywjdxI_GA7Alk=', inStock: true },
  { name: 'CP Plus CP-VDP-D1 Video Door Bell',    category: 'intercoms', brand: 'CP Plus',   price: 3200,  description: 'HD video doorbell with motion detection and night vision. Wi-Fi enabled, two-way talk, mobile notifications, wide-angle 150° lens. Easy installation, works with Android & iOS.', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=75', inStock: true },
  { name: 'Aiphone GT Series Apartment Intercom', category: 'intercoms', brand: 'Aiphone',   price: 15000, description: 'Multi-apartment video intercom system. Master station with 4.3" color screen, hands-free communication, door release, expandable up to 4 door stations. Ideal for residential complexes.', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=75', inStock: false },

  /* ── Automation ────────────────────────────────────── */
  { name: 'Schneider Wiser Smart Home Kit',       category: 'automation', brand: 'Schneider', price: 35000, description: 'Complete smart home starter kit: hub, 4 smart switches, motion sensor and door sensor. App-controlled, voice assistant compatible (Alexa, Google), energy monitoring built-in.', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=75', inStock: true },
  { name: 'Legrand MyHOME BUS System',            category: 'automation', brand: 'Legrand',   price: 55000, description: 'Professional KNX-based building automation system. Control lighting, HVAC, blinds and security from single platform. Scalable from single room to entire building.', image: 'https://media.istockphoto.com/id/2296690744/photo/energy-distribution-plug-in-distribution-system-complete-line-protection-eletric-control.webp?a=1&b=1&s=612x612&w=0&k=20&c=ap7NjGvckjciUo3L6gQdLvrSGYR5AJywjdxI_GA7Alk=', inStock: true },
  { name: 'Sonoff Wi-Fi Smart Switch (4-pack)',   category: 'automation', brand: 'Sonoff',    price: 2800,  description: 'Wi-Fi smart switch for retrofitting existing lights and appliances. No hub required, works with Alexa & Google Home, timer schedules, energy monitoring. DIY-friendly installation.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75', inStock: true },

  /* ── Fire ──────────────────────────────────────────── */
  { name: 'Notifier NFS2-3030 Fire Alarm Panel',  category: 'fire', brand: 'Notifier',  price: 28000, description: 'Addressable fire alarm control panel supporting 318 devices per loop. LCD display, event logging, network capability, remote monitoring. Suitable for commercial and industrial buildings.', image: 'https://images.unsplash.com/photo-1562564055-71e051d33c19?w=400&q=75', inStock: true },
  { name: 'Bosch Optical Smoke Detector (IP44)',   category: 'fire', brand: 'Bosch',     price: 1200,  description: 'Addressable optical smoke detector with built-in sounder. 360° LED status indicator, IP44 rated, test button, low standby current. Compatible with Bosch FPA panels.', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=75', inStock: true },
  { name: 'Agni Conventional 4-Zone Fire Panel',  category: 'fire', brand: 'Agni',      price: 6500,  description: 'Conventional 4-zone fire alarm panel with LCD display. Supports smoke, heat and manual call-point detectors. Built-in charger, relay outputs for HVAC/lifts, BIS certified.', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=75', inStock: true },

  /* ── Gate ──────────────────────────────────────────── */
  { name: 'FAAC 740 Sliding Gate Motor',          category: 'gate', brand: 'FAAC',      price: 24000, description: 'Heavy duty sliding gate motor for gates up to 500kg, 7m length. 24V DC brushless motor, encoder feedback, obstacle detection, remote control included. Suitable for residential and commercial gates.', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=75', inStock: true },
  { name: 'BFT Boom Barrier 4m (Vehicle Loop)',   category: 'gate', brand: 'BFT',       price: 42000, description: '4-metre traffic boom barrier with vehicle loop detector. 1.5-second opening time, anti-crash system, LED arm lighting, complete with remote. Ideal for parking lots and security checkpoints.', image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&q=75', inStock: true },
  { name: 'Roger Swing Gate Motor (400kg)',        category: 'gate', brand: 'Roger',     price: 18500, description: 'Underground swing gate motor for leaf up to 400kg / 3m. 24V low-voltage, integrated control board, obstacle detection, 2 remotes included. Minimal visual impact installation.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75', inStock: false },

  /* ── Networking ─────────────────────────────────────── */
  { name: 'Cisco SG350-28 28-Port Managed Switch', category: 'networking', brand: 'Cisco',  price: 32000, description: '28-port Gigabit managed switch with 24 copper + 2 combo SFP + 2 SFP ports. VLAN, QoS, LACP, IGMP snooping, CLI and web management. Rack-mountable, lifetime warranty.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=75', inStock: true },
  { name: 'D-Link 24-Port Cat6 Patch Panel',       category: 'networking', brand: 'D-Link', price: 3800,  description: '24-port Cat6 UTP patch panel, 110-type punch-down, 1U rack mount. Colour-coded port labelling, universal clip, compatible with TIA/EIA-568A/B wiring standards.', image: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=400&q=75', inStock: true },
  { name: 'Ubiquiti UniFi 6 Lite Access Point',    category: 'networking', brand: 'Ubiquiti',price: 8500,  description: 'Wi-Fi 6 access point with 1.5 Gbps throughput. 2.4 GHz + 5 GHz dual-band, 300+ client devices, PoE powered, cloud management via UniFi controller. Ideal for offices and retail spaces.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=75', inStock: true },
];

const seedProducts = async () => {
  const catCount  = await Category.countDocuments();
  const prodCount = await Product.countDocuments();
  if (catCount > 0 && prodCount > 0) return; // already seeded

  if (catCount === 0) {
    await Category.insertMany(CATEGORIES);
    console.log(`✅ Seeded ${CATEGORIES.length} categories`);
  }
  if (prodCount === 0) {
    await Product.insertMany(PRODUCTS);
    console.log(`✅ Seeded ${PRODUCTS.length} products`);
  }
};

module.exports = seedProducts;

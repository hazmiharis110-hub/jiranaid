import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import type {
  ToolItem,
  User,
  BorrowRequest,
  ChatMessage,
  Neighborhood,
  Review,
} from './src/types.ts';

const PORT = 3000;

// ==========================================
// In-Memory Database for JiranAid Tool Library
// ==========================================

const neighborhoods: Neighborhood[] = [
  {
    id: 'taman-melawati',
    name: 'Taman Melawati & Riverview',
    postcode: '53100',
    city: 'Ampang / Kuala Lumpur',
    activeMembers: 142,
    activeTools: 68,
    estimatedMoneySaved: 14850,
  },
  {
    id: 'section-7-shah-alam',
    name: 'Section 7 Community Green',
    postcode: '40000',
    city: 'Shah Alam',
    activeMembers: 98,
    activeTools: 43,
    estimatedMoneySaved: 9400,
  },
  {
    id: 'damansara-heights',
    name: 'Bukit Damansara West',
    postcode: '50490',
    city: 'Kuala Lumpur',
    activeMembers: 116,
    activeTools: 52,
    estimatedMoneySaved: 12200,
  },
  {
    id: 'greenwood-terrace',
    name: 'Greenwood Maple Terrace',
    postcode: '94025',
    city: 'Silicon Valley / Menlo Park',
    activeMembers: 84,
    activeTools: 39,
    estimatedMoneySaved: 11100,
  },
];

let users: User[] = [
  {
    id: 'user-current',
    name: 'Aiman Zikri',
    email: 'aiman.zikri@neighborhood.my',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+60 12-345 6789',
    neighborhoodId: 'taman-melawati',
    neighborhoodName: 'Taman Melawati & Riverview',
    postcode: '53100',
    isVerified: true,
    verificationMethod: 'postcode',
    trustScore: 4.9,
    totalBorrows: 12,
    totalLends: 7,
    onTimeReturnRate: 100,
    badges: ['Super Lender', 'Careful Handler', 'Punctual Neighbor'],
    joinedDate: 'March 2024',
  },
  {
    id: 'user-siti',
    name: 'Kak Siti Hajar',
    email: 'siti.hajar@community.org',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+60 13-987 6543',
    neighborhoodId: 'taman-melawati',
    neighborhoodName: 'Taman Melawati & Riverview',
    postcode: '53100',
    isVerified: true,
    verificationMethod: 'gps',
    trustScore: 5.0,
    totalBorrows: 24,
    totalLends: 18,
    onTimeReturnRate: 100,
    badges: ['Community Veteran', 'Master Gardener', '100% On-Time'],
    joinedDate: 'January 2024',
  },
  {
    id: 'user-dev',
    name: 'Devanathan R.',
    email: 'dev.ramesh@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+60 17-234 5678',
    neighborhoodId: 'taman-melawati',
    neighborhoodName: 'Taman Melawati & Riverview',
    postcode: '53100',
    isVerified: true,
    verificationMethod: 'utility_bill',
    trustScore: 4.8,
    totalBorrows: 8,
    totalLends: 14,
    onTimeReturnRate: 97,
    badges: ['Power Tool Guru', 'Quick Responder'],
    joinedDate: 'May 2024',
  },
  {
    id: 'user-mei',
    name: 'Mei Ling Tan',
    email: 'meiling.tan@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+60 16-332 1199',
    neighborhoodId: 'taman-melawati',
    neighborhoodName: 'Taman Melawati & Riverview',
    postcode: '53100',
    isVerified: true,
    verificationMethod: 'gps',
    trustScore: 4.95,
    totalBorrows: 15,
    totalLends: 9,
    onTimeReturnRate: 100,
    badges: ['Home Renovation Ace', 'Safe Handler'],
    joinedDate: 'February 2024',
  },
];

let currentUserId = 'user-current';

let tools: ToolItem[] = [
  {
    id: 'tool-1',
    title: 'Kärcher K3 High Pressure Water Jet',
    brand: 'Kärcher',
    model: 'K3 Full Control 120 Bar',
    category: 'Cleaning & Steam',
    description: 'Perfect for patio washdowns, car porch paving moss cleaning, and driveways. Comes with dirt blaster nozzle and detergent tube.',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-siti',
    ownerName: 'Kak Siti Hajar',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    ownerRating: 5.0,
    ownerBorrowsCount: 18,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.3,
    locationSnippet: 'Lorong Melawati 4 (300m away)',
    status: 'available',
    maintenanceFeePerDay: 4,
    depositAmount: 30,
    maxDays: 4,
    instructions: 'Please release water pressure trigger before detaching high-pressure hose. Keep nozzle 15cm away from delicate timber.',
    pickupNote: 'Pick up anytime after 9 AM. I will leave it by the shaded porch or greet you.',
    createdAt: '2025-01-15',
  },
  {
    id: 'tool-2',
    title: 'Makita 18V Brushless Cordless Drill & Driver Kit',
    brand: 'Makita',
    model: 'DHP484 with 2x 4.0Ah Li-Ion Batteries',
    category: 'Power Tools',
    description: 'Heavy duty hammer drill driver with masonry bits, wood drill bits, Philips/Torx screw bit set, and dual-port rapid charger.',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-dev',
    ownerName: 'Devanathan R.',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.8,
    ownerBorrowsCount: 14,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.5,
    locationSnippet: 'Jalan Melawati 2B (500m away)',
    status: 'available',
    maintenanceFeePerDay: 5,
    depositAmount: 40,
    maxDays: 5,
    instructions: 'Avoid running drill dry against heavy concrete; let hammer action do the work. Return with both batteries recharged.',
    pickupNote: 'Ring door bell at #24. Usually home after 5:30 PM.',
    createdAt: '2025-01-20',
  },
  {
    id: 'tool-3',
    title: 'Ryobi 36V Cordless Telescopic Pole Hedge Trimmer',
    brand: 'Ryobi',
    model: 'RPHT3600 (2.7m Reach)',
    category: 'Gardening & Yard',
    description: 'Safely trim tall garden bougainvillea, hedges, and overhanging tree branches without wobbling on an unsafe ladder.',
    condition: 'Good Condition',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb228cc?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-current',
    ownerName: 'Aiman Zikri',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.9,
    ownerBorrowsCount: 7,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.1,
    locationSnippet: 'Lorong Melawati 3 (Your listing)',
    status: 'available',
    maintenanceFeePerDay: 3,
    depositAmount: 25,
    maxDays: 3,
    instructions: 'Check blade lubricated with mineral oil. Wear protective eyewear provided in the kit bag.',
    pickupNote: 'Self pickup from side garage box with code.',
    createdAt: '2025-02-01',
  },
  {
    id: 'tool-4',
    title: '3.8m Heavy-Duty Aluminum Telescopic Extension Ladder',
    brand: 'Cosco Pro',
    model: 'Smart-Close EN131 Certified',
    category: 'Ladders & Access',
    description: 'Compact 3.8m telescopic ladder. Collapses down to 85cm so it fits inside any compact sedan trunk easily. Great for roof inspection or ceiling light changes.',
    condition: 'Good Condition',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-mei',
    ownerName: 'Mei Ling Tan',
    ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.95,
    ownerBorrowsCount: 9,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.7,
    locationSnippet: 'Jalan Melawati 7 (700m away)',
    status: 'borrowed',
    maintenanceFeePerDay: 2,
    depositAmount: 35,
    maxDays: 4,
    instructions: 'Ensure all red/green locking pins click securely before climbing. Always set up on solid level ground.',
    pickupNote: 'Currently loaned out to Uncle Wong until tomorrow evening.',
    createdAt: '2025-02-05',
  },
  {
    id: 'tool-5',
    title: 'Bissell SpotClean Pro Carpet & Upholstery Washer',
    brand: 'Bissell',
    model: 'SpotClean Pro 1558E',
    category: 'Cleaning & Steam',
    description: 'Commercial quality extractor for fabric sofa stains, car seats, pet messes, and mattresses. Includes concentrated pet stain formula sample bottle.',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-siti',
    ownerName: 'Kak Siti Hajar',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    ownerRating: 5.0,
    ownerBorrowsCount: 18,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.3,
    locationSnippet: 'Lorong Melawati 4 (300m away)',
    status: 'available',
    maintenanceFeePerDay: 6,
    depositAmount: 50,
    maxDays: 3,
    instructions: 'Rinse dirty water tank thoroughly after use with warm water to prevent odor. Do not use bleach or boiling water.',
    pickupNote: 'Available today. Please bring a tote bag for the hose attachments.',
    createdAt: '2025-02-10',
  },
  {
    id: 'tool-6',
    title: 'Bosch Professional Orbital Palm Sander',
    brand: 'Bosch',
    model: 'GSS 140 A Multi-sheet Clamp',
    category: 'Woodworking',
    description: 'Low vibration palm sheet sander with microfilter dust canister. Great for DIY dining table refinishing, doors, or smoothing pallet wood.',
    condition: 'Good Condition',
    imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-dev',
    ownerName: 'Devanathan R.',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.8,
    ownerBorrowsCount: 14,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.5,
    locationSnippet: 'Jalan Melawati 2B (500m away)',
    status: 'available',
    maintenanceFeePerDay: 3,
    depositAmount: 20,
    maxDays: 4,
    instructions: 'Comes with 3 assorted grit sandpaper sheets (80, 120, 240). Empty dust filter box every 20 minutes.',
    pickupNote: 'Free to pick up this weekend.',
    createdAt: '2025-02-14',
  },
  {
    id: 'tool-7',
    title: 'Ninja Foodi 8-in-1 Digital Air Fry Oven & Dehydrator',
    brand: 'Ninja',
    model: 'SP101 Flip-Away Countertop',
    category: 'Kitchen Appliances',
    description: 'High capacity air fry, roast, broil, and dehydrate oven. Great for batch meal prepping, baking for neighborhood potlucks, or fruit drying.',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-mei',
    ownerName: 'Mei Ling Tan',
    ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.95,
    ownerBorrowsCount: 9,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.7,
    locationSnippet: 'Jalan Melawati 7 (700m away)',
    status: 'available',
    maintenanceFeePerDay: 5,
    depositAmount: 45,
    maxDays: 7,
    instructions: 'Wash crumb tray and wire rack with non-scratch sponge only. Keep appliance 10cm from wall while operating.',
    pickupNote: 'Includes original box with handles for easy carrying.',
    createdAt: '2025-02-18',
  },
  {
    id: 'tool-8',
    title: 'NOCO Boost Plus GB40 1000A 12V Car Battery Jump Starter',
    brand: 'NOCO',
    model: 'GB40 Lithium Jump Pack',
    category: 'Automotive',
    description: 'Safely jump-start a dead vehicle battery in seconds without needing another car. Built-in LED flashlight and USB phone charging port.',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-current',
    ownerName: 'Aiman Zikri',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.9,
    ownerBorrowsCount: 7,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.1,
    locationSnippet: 'Lorong Melawati 3 (Your listing)',
    status: 'available',
    maintenanceFeePerDay: 0,
    depositAmount: 30,
    maxDays: 2,
    instructions: 'Spark-proof clamps. Connect red to positive first, then black to negative chassis grounding.',
    pickupNote: 'Keep in car emergency kit. Free community maintenance contribution.',
    createdAt: '2025-02-22',
  },
  {
    id: 'tool-9',
    title: 'DeWalt 20V Max XR Brushless Impact Driver',
    brand: 'DeWalt',
    model: 'DCF887 3-Speed with 4.0Ah Battery',
    category: 'Power Tools',
    description: 'High torque compact impact driver for driving long deck screws, lag bolts, and assembling heavy timber furniture. Includes magnetic bit holder.',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-siti',
    ownerName: 'Kak Siti Hajar',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    ownerRating: 5.0,
    ownerBorrowsCount: 18,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.3,
    locationSnippet: 'Lorong Melawati 4 (300m away)',
    status: 'available',
    maintenanceFeePerDay: 5,
    depositAmount: 40,
    maxDays: 4,
    instructions: 'Use correct size impact bits to prevent stripping screw heads. Fully charge before return.',
    pickupNote: 'Pick up from porch anytime after 10 AM.',
    createdAt: '2025-02-24',
  },
  {
    id: 'tool-10',
    title: 'Bosch Professional 125mm Cordless Angle Grinder',
    brand: 'Bosch Pro',
    model: 'GWS 18V-10 with Protective Guard & Discs',
    category: 'Power Tools',
    description: 'Cordless grinder for cutting rebar, trimming floor tiles, grinding weld beads, or sharpening lawnmower blades. Comes with wrench and safety guard.',
    condition: 'Good Condition',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-dev',
    ownerName: 'Devanathan R.',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.8,
    ownerBorrowsCount: 14,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.5,
    locationSnippet: 'Jalan Melawati 2B (500m away)',
    status: 'available',
    maintenanceFeePerDay: 6,
    depositAmount: 45,
    maxDays: 3,
    instructions: 'MUST wear full safety goggles and heavy gloves. Do not remove safety wheel guard under any circumstances.',
    pickupNote: 'Call ahead 15 mins before arrival.',
    createdAt: '2025-02-26',
  },
  {
    id: 'tool-11',
    title: 'Makita 18V Cordless Jigsaw with Curve Cut Blades',
    brand: 'Makita',
    model: 'DJV180Z Variable Speed Orbital',
    category: 'Power Tools',
    description: 'Precision variable speed orbital jigsaw for intricate curve cuts in wood, sink cutouts in kitchen countertops, and aluminum trimming.',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-mei',
    ownerName: 'Mei Ling Tan',
    ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.95,
    ownerBorrowsCount: 9,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.7,
    locationSnippet: 'Jalan Melawati 7 (700m away)',
    status: 'available',
    maintenanceFeePerDay: 4,
    depositAmount: 35,
    maxDays: 4,
    instructions: 'Keep base plate flat against the workpiece. Blade clamp is toolless tool-change.',
    pickupNote: 'Ring bell at unit 12.',
    createdAt: '2025-03-01',
  },
  {
    id: 'tool-12',
    title: 'Stanley FatMax 150-Piece Master Home Toolkit',
    brand: 'Stanley',
    model: 'Professional Mechanics & DIY Case',
    category: 'Home Improvement',
    description: 'Comprehensive chrome vanadium toolkit including ratchet sockets, combination spanners, magnetic screwdrivers, pliers, spirit level, and claw hammer.',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-current',
    ownerName: 'Aiman Zikri',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.9,
    ownerBorrowsCount: 7,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.1,
    locationSnippet: 'Lorong Melawati 3 (Your listing)',
    status: 'available',
    maintenanceFeePerDay: 2,
    depositAmount: 25,
    maxDays: 7,
    instructions: 'Please check all sockets and bits back into their molded slots before returning.',
    pickupNote: 'Pick up from porch side box.',
    createdAt: '2025-03-02',
  },
  {
    id: 'tool-13',
    title: 'Bosch Laser Level & 50m Digital Distance Measurer',
    brand: 'Bosch',
    model: 'GLM 50 C Bluetooth Smart Measure',
    category: 'Home Improvement',
    description: 'High precision green laser measure with angle sensor and 360-degree cross-line leveling. Ideal for tiling, hanging framed pictures perfectly straight, or measuring curtains.',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-siti',
    ownerName: 'Kak Siti Hajar',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    ownerRating: 5.0,
    ownerBorrowsCount: 18,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.3,
    locationSnippet: 'Lorong Melawati 4 (300m away)',
    status: 'available',
    maintenanceFeePerDay: 3,
    depositAmount: 30,
    maxDays: 3,
    instructions: 'Do not stare into laser beam. Clean optics lens gently with microfiber cloth only.',
    pickupNote: 'Ready anytime on weekends.',
    createdAt: '2025-03-03',
  },
  {
    id: 'tool-14',
    title: 'Black+Decker Cordless Grass Line Trimmer & Lawn Edger',
    brand: 'Black+Decker',
    model: 'PowerCommand 18V String Trimmer',
    category: 'Gardening & Yard',
    description: 'Lightweight cordless grass strimmer with flip-to-edge wheel guide for clean lawn borders and curbs. Includes two spools of 1.6mm nylon line.',
    condition: 'Good Condition',
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-dev',
    ownerName: 'Devanathan R.',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.8,
    ownerBorrowsCount: 14,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.5,
    locationSnippet: 'Jalan Melawati 2B (500m away)',
    status: 'available',
    maintenanceFeePerDay: 4,
    depositAmount: 30,
    maxDays: 3,
    instructions: 'Wear closed-toe shoes and safety glasses while trimming near pebbles or fences.',
    pickupNote: 'Pick up after 5:30 PM.',
    createdAt: '2025-03-04',
  },
  {
    id: 'tool-15',
    title: 'Werner 6ft Fiberglass Heavy-Duty Step Ladder (Non-Conductive)',
    brand: 'Werner',
    model: 'Electro-Safe 150kg Industrial Step',
    category: 'Ladders & Access',
    description: 'Non-conductive fiberglass 6-step ladder for safe electrical work, ceiling fan installation, and indoor painting. Features multi-functional tool holster top.',
    condition: 'Good Condition',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-mei',
    ownerName: 'Mei Ling Tan',
    ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.95,
    ownerBorrowsCount: 9,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.7,
    locationSnippet: 'Jalan Melawati 7 (700m away)',
    status: 'available',
    maintenanceFeePerDay: 3,
    depositAmount: 35,
    maxDays: 4,
    instructions: 'Ensure spreader braces lock completely open before stepping onto ladder. Never stand on the top plastic shelf.',
    pickupNote: 'Transport requires SUV or open car boot.',
    createdAt: '2025-03-05',
  },
  {
    id: 'tool-16',
    title: 'Kärcher SC3 EasyFix Multi-Surface Steam Mop',
    brand: 'Kärcher',
    model: 'SC3 EasyFix Continuous Steam 3.5 Bar',
    category: 'Cleaning & Steam',
    description: 'Chemical-free hygienic floor steam cleaner kills 99.99% of household bacteria using tap water. Heats up in 30 seconds. Includes tile brush and microfiber floor cloths.',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-siti',
    ownerName: 'Kak Siti Hajar',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    ownerRating: 5.0,
    ownerBorrowsCount: 18,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.3,
    locationSnippet: 'Lorong Melawati 4 (300m away)',
    status: 'available',
    maintenanceFeePerDay: 5,
    depositAmount: 40,
    maxDays: 3,
    instructions: 'Use clean filtered tap water. Wash microfiber pads in washing machine (no fabric softener) before return.',
    pickupNote: 'Ready on front porch.',
    createdAt: '2025-03-05',
  },
  {
    id: 'tool-17',
    title: 'DeWalt 210mm Compact Jobsite Table Saw with Rolling Stand',
    brand: 'DeWalt',
    model: 'DWE7485 Rack & Pinion Fence 1850W',
    category: 'Woodworking',
    description: 'High precision table saw with rack-and-pinion telescoping fence system. Perfect for rip cuts, trimming cabinet plywood, and shelving boards.',
    condition: 'Good Condition',
    imageUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-dev',
    ownerName: 'Devanathan R.',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.8,
    ownerBorrowsCount: 14,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.5,
    locationSnippet: 'Jalan Melawati 2B (500m away)',
    status: 'available',
    maintenanceFeePerDay: 8,
    depositAmount: 80,
    maxDays: 3,
    instructions: 'Always use push stick provided. Never operate without blade riving knife and transparent dust shield.',
    pickupNote: 'Heavy item (22kg); please bring two people to load into car trunk.',
    createdAt: '2025-03-06',
  },
  {
    id: 'tool-18',
    title: 'Philips Digital Airfryer XL Rapid Air 4.1L',
    brand: 'Philips',
    model: 'HD9270/91 2000W Touchscreen',
    category: 'Kitchen Appliances',
    description: 'Extra large 4.1L capacity air fryer for roasting whole chickens, crispy homemade fries, and baking cakes. Dishwasher-safe removable basket.',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-siti',
    ownerName: 'Kak Siti Hajar',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    ownerRating: 5.0,
    ownerBorrowsCount: 18,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.3,
    locationSnippet: 'Lorong Melawati 4 (300m away)',
    status: 'available',
    maintenanceFeePerDay: 4,
    depositAmount: 35,
    maxDays: 4,
    instructions: 'Do not use metal utensils inside the non-stick basket. Clean basket with soft sponge only.',
    pickupNote: 'Pick up on weekends or weekday evenings.',
    createdAt: '2025-03-07',
  },
  {
    id: 'tool-19',
    title: 'Michelin Digital Heavy-Duty Tire Inflator & 12V Air Compressor',
    brand: 'Michelin',
    model: 'Programmable Digital 12V Preset Pump',
    category: 'Automotive',
    description: 'Compact 12V digital compressor with auto-stop preset. Inflates a flat car tire from 0 to 35 PSI in 3 minutes. Includes bicycle and sports ball nozzle adaptors.',
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-mei',
    ownerName: 'Mei Ling Tan',
    ownerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.95,
    ownerBorrowsCount: 9,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.7,
    locationSnippet: 'Jalan Melawati 7 (700m away)',
    status: 'available',
    maintenanceFeePerDay: 2,
    depositAmount: 25,
    maxDays: 3,
    instructions: 'Plug into 12V car cigarette lighter port. Set desired PSI and press start; pump stops automatically.',
    pickupNote: 'Available today.',
    createdAt: '2025-03-07',
  },
  {
    id: 'tool-20',
    title: 'Fiskars PowerGear Telescopic Tree Lopper & Pole Pruner',
    brand: 'Fiskars',
    model: 'UPX86 Telescopic Universal Cutter (4m Reach)',
    category: 'Gardening & Yard',
    description: 'Effortlessly cut tree branches up to 32mm in diameter high overhead without climbing a ladder. Features 230-degree adjustable cutting head.',
    condition: 'Good Condition',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb228cc?w=800&auto=format&fit=crop&q=80',
    ownerId: 'user-current',
    ownerName: 'Aiman Zikri',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ownerRating: 4.9,
    ownerBorrowsCount: 7,
    neighborhoodId: 'taman-melawati',
    distanceKm: 0.1,
    locationSnippet: 'Lorong Melawati 3 (Your listing)',
    status: 'available',
    maintenanceFeePerDay: 3,
    depositAmount: 25,
    maxDays: 4,
    instructions: 'Wipe blade sap after pruning and spray light lubricant before returning.',
    pickupNote: 'Pick up from porch side box.',
    createdAt: '2025-03-07',
  },
];

let borrowRequests: BorrowRequest[] = [
  {
    id: 'req-101',
    toolId: 'tool-4',
    toolTitle: '3.8m Heavy-Duty Aluminum Telescopic Extension Ladder',
    toolImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    toolCategory: 'Ladders & Access',
    ownerId: 'user-mei',
    ownerName: 'Mei Ling Tan',
    borrowerId: 'user-current',
    borrowerName: 'Aiman Zikri',
    borrowerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    borrowerTrust: 4.9,
    startDate: '2025-09-02',
    endDate: '2025-09-05',
    daysCount: 3,
    maintenanceFee: 6,
    depositFee: 35,
    totalPaid: 41,
    depositRefunded: false,
    status: 'active',
    purposeNote: 'Need to inspect roof gutter before monsoon rains next week.',
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2025-09-02T08:30:00Z',
  },
  {
    id: 'req-102',
    toolId: 'tool-3',
    toolTitle: 'Ryobi 36V Cordless Telescopic Pole Hedge Trimmer',
    toolImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb228cc?w=800&auto=format&fit=crop&q=80',
    toolCategory: 'Gardening & Yard',
    ownerId: 'user-current',
    ownerName: 'Aiman Zikri',
    borrowerId: 'user-siti',
    borrowerName: 'Kak Siti Hajar',
    borrowerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    borrowerTrust: 5.0,
    startDate: '2025-09-06',
    endDate: '2025-09-07',
    daysCount: 2,
    maintenanceFee: 6,
    depositFee: 25,
    totalPaid: 31,
    depositRefunded: false,
    status: 'pending',
    purposeNote: 'Trimming back my front garden jasmine bush over the driveway.',
    createdAt: '2025-09-03T14:15:00Z',
    updatedAt: '2025-09-03T14:15:00Z',
  },
];

let chatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    requestId: 'req-101',
    toolId: 'tool-4',
    toolTitle: '3.8m Heavy-Duty Aluminum Telescopic Extension Ladder',
    senderId: 'user-current',
    senderName: 'Aiman Zikri',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    receiverId: 'user-mei',
    receiverName: 'Mei Ling Tan',
    message: 'Hi Mei Ling! Request approved, thanks so much. Can I swing by around 5:30 PM to pick up the ladder?',
    timestamp: 'Yesterday 4:10 PM',
  },
  {
    id: 'msg-2',
    requestId: 'req-101',
    toolId: 'tool-4',
    toolTitle: '3.8m Heavy-Duty Aluminum Telescopic Extension Ladder',
    senderId: 'user-mei',
    senderName: 'Mei Ling Tan',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    receiverId: 'user-current',
    receiverName: 'Aiman Zikri',
    message: 'Sure Aiman! It is collapsed and sitting right next to the front planter. Just ring the intercom when you arrive.',
    timestamp: 'Yesterday 4:32 PM',
  },
  {
    id: 'msg-3',
    requestId: 'req-102',
    toolId: 'tool-3',
    toolTitle: 'Ryobi 36V Cordless Telescopic Pole Hedge Trimmer',
    senderId: 'user-siti',
    senderName: 'Kak Siti Hajar',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    receiverId: 'user-current',
    receiverName: 'Aiman Zikri',
    message: 'Salam Aiman! Sent a booking request for this Saturday for your Ryobi hedge trimmer. Let me know if that time works!',
    timestamp: 'Today 2:15 PM',
  },
];

let reviews: Review[] = [
  {
    id: 'rev-1',
    toolId: 'tool-1',
    toolTitle: 'Kärcher K3 High Pressure Water Jet',
    toolCategory: 'Cleaning & Pressure Washers',
    toolImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    targetUserId: 'user-siti',
    targetUserName: 'Kak Siti Hajar',
    reviewerId: 'user-current',
    reviewerName: 'Aiman Zikri',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    careRating: 5,
    punctualityRating: 5,
    feedbackType: 'item',
    comment: 'Super clean tool in pristine condition! Water pressure was phenomenal for clearing stubborn patio algae. Kak Siti explained the quick-connect hose locking mechanism clearly. Saved me RM250 on professional power washing.',
    wouldRecommend: true,
    date: 'August 28, 2025',
    helpfulCount: 7,
  },
  {
    id: 'rev-2',
    toolId: 'tool-2',
    toolTitle: 'Makita 18V Brushless Cordless Drill & Driver Kit',
    toolCategory: 'Power Tools',
    toolImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    targetUserId: 'user-dev',
    targetUserName: 'Devanathan R.',
    reviewerId: 'user-siti',
    reviewerName: 'Kak Siti Hajar',
    reviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    careRating: 5,
    punctualityRating: 5,
    feedbackType: 'service',
    comment: 'Dev is a wonderful, punctual neighbor! The drill came with both 18V batteries fully charged and all driver bits neatly arranged in the hard case. Friendly handoff at his porch.',
    wouldRecommend: true,
    date: 'August 21, 2025',
    helpfulCount: 4,
  },
  {
    id: 'rev-3',
    toolId: 'tool-4',
    toolTitle: '3.8m Heavy-Duty Aluminum Telescopic Extension Ladder',
    toolCategory: 'Ladders & Access',
    toolImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    targetUserId: 'user-mei',
    targetUserName: 'Mei Ling Tan',
    reviewerId: 'user-dev',
    reviewerName: 'Devanathan R.',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    careRating: 5,
    punctualityRating: 5,
    feedbackType: 'item',
    comment: 'Ladder was rock solid and easy to extend. The safety pin lock indicators give great peace of mind when working on roof gutters. Compact enough to fit in my Myvi trunk.',
    wouldRecommend: true,
    date: 'August 14, 2025',
    helpfulCount: 9,
  },
  {
    id: 'rev-4',
    toolId: 'tool-5',
    toolTitle: 'Bissell SpotClean Pro Carpet & Upholstery Washer',
    toolCategory: 'Cleaning & Steam',
    toolImage: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
    targetUserId: 'user-siti',
    targetUserName: 'Kak Siti Hajar',
    reviewerId: 'user-current',
    reviewerName: 'Aiman Zikri',
    reviewerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    careRating: 5,
    punctualityRating: 5,
    feedbackType: 'item',
    comment: 'Incredible cleaning power! Managed to remove coffee spills from our living room sofa. The extractor was handed over thoroughly cleaned with fresh solution included.',
    wouldRecommend: true,
    date: 'August 08, 2025',
    helpfulCount: 6,
  },
  {
    id: 'rev-5',
    toolId: 'tool-8',
    toolTitle: 'NOCO Boost Plus GB40 1000A 12V Car Battery Jump Starter',
    toolCategory: 'Automotive',
    toolImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
    targetUserId: 'user-current',
    targetUserName: 'Aiman Zikri',
    reviewerId: 'user-mei',
    reviewerName: 'Mei Ling Tan',
    reviewerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    careRating: 5,
    punctualityRating: 5,
    feedbackType: 'service',
    comment: 'Lender service was immediate and saved the day! Aiman responded instantly when my car battery died on Monday morning. Equipment worked on the very first crank.',
    wouldRecommend: true,
    date: 'July 30, 2025',
    helpfulCount: 11,
  },
];

// ==========================================
// Express Application Setup
// ==========================================

async function startServer() {
  const app = express();
  app.use(express.json());

  // ----------------------------------------
  // Neighborhood API Routes
  // ----------------------------------------
  app.get('/api/neighborhoods', (req, res) => {
    res.json({
      success: true,
      neighborhoods,
    });
  });

  // ----------------------------------------
  // User Authentication & Profile Endpoints
  // ----------------------------------------
  app.get('/api/auth/me', (req, res) => {
    const user = currentUserId ? users.find((u) => u.id === currentUserId) || null : null;
    res.json({
      success: true,
      user,
      allUsers: users, // For testing/switching neighbor persona
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, userId } = req.body;
    let found: User | undefined;

    if (userId) {
      found = users.find((u) => u.id === userId);
    } else if (email) {
      found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      // If email doesn't exist yet, auto-create a resident account for quick onboarding
      if (!found) {
        const emailName = email.split('@')[0];
        const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        found = {
          id: `user-${Date.now()}`,
          name: formattedName || 'Verified Neighbor',
          email: email.trim(),
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          phone: '+60 12-555 0192',
          neighborhoodId: 'taman-melawati',
          neighborhoodName: 'Taman Melawati & Riverview',
          postcode: '53100',
          isVerified: true,
          verificationMethod: 'postcode',
          trustScore: 5.0,
          totalBorrows: 0,
          totalLends: 0,
          onTimeReturnRate: 100,
          badges: ['Verified Resident', 'Active Neighbor'],
          joinedDate: 'September 2025',
        };
        users.push(found);
      }
    }

    if (!found) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    currentUserId = found.id;
    res.json({
      success: true,
      message: `Welcome back, ${found.name}!`,
      user: found,
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    currentUserId = '';
    res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  });

  app.post('/api/auth/switch-user', (req, res) => {
    const { userId } = req.body;
    const found = users.find((u) => u.id === userId);
    if (!found) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    currentUserId = userId;
    res.json({ success: true, user: found });
  });

  app.post('/api/auth/verify-location', (req, res) => {
    const { neighborhoodId, postcode, method } = req.body;
    const userIndex = users.findIndex((u) => u.id === currentUserId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const neigh = neighborhoods.find((n) => n.id === neighborhoodId) || neighborhoods[0];

    users[userIndex].neighborhoodId = neigh.id;
    users[userIndex].neighborhoodName = neigh.name;
    users[userIndex].postcode = postcode || neigh.postcode;
    users[userIndex].isVerified = true;
    users[userIndex].verificationMethod = method || 'gps';

    res.json({
      success: true,
      message: `Verified and bound to ${neigh.name}!`,
      user: users[userIndex],
    });
  });

  app.post(['/api/auth/signup', '/api/auth/register'], (req, res) => {
    const { name, email, phone, neighborhoodId, postcode } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }
    const neigh = neighborhoods.find((n) => n.id === neighborhoodId) || neighborhoods[0];
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: phone || '+60 12-000 0000',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      neighborhoodId: neigh.id,
      neighborhoodName: neigh.name,
      postcode: postcode || neigh.postcode,
      isVerified: true,
      verificationMethod: 'postcode',
      trustScore: 5.0,
      totalBorrows: 0,
      totalLends: 0,
      onTimeReturnRate: 100,
      badges: ['Verified Resident', 'New Neighbor'],
      joinedDate: 'September 2025',
    };
    users.push(newUser);
    currentUserId = newUser.id;
    res.status(201).json({ success: true, user: newUser });
  });

  // ----------------------------------------
  // Tool Inventory & Listings (CRUD)
  // ----------------------------------------
  app.get(['/api/tools', '/api/items'], (req, res) => {
    const { search, category, status, maxFee, neighborhoodId, sort } = req.query;
    let filtered = [...tools];

    if (neighborhoodId && neighborhoodId !== 'all') {
      filtered = filtered.filter((t) => t.neighborhoodId === neighborhoodId);
    }

    if (category && category !== 'All') {
      filtered = filtered.filter((t) => t.category === category);
    }

    if (status && status !== 'all') {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (maxFee) {
      const max = Number(maxFee);
      if (!isNaN(max)) {
        filtered = filtered.filter((t) => t.maintenanceFeePerDay <= max);
      }
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.brand.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sort === 'distance') {
      filtered.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sort === 'fee-low') {
      filtered.sort((a, b) => a.maintenanceFeePerDay - b.maintenanceFeePerDay);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.ownerRating - a.ownerRating);
    } else {
      // newest
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json({
      success: true,
      total: filtered.length,
      tools: filtered,
    });
  });

  app.get(['/api/tools/:id', '/api/items/:id'], (req, res) => {
    const tool = tools.find((t) => t.id === req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found.' });
    }
    const toolReviews = reviews.filter((r) => r.toolId === tool.id);
    res.json({
      success: true,
      tool,
      reviews: toolReviews,
    });
  });

  app.post(['/api/tools', '/api/items'], (req, res) => {
    const {
      title,
      brand,
      model,
      category,
      description,
      condition,
      imageUrl,
      maintenanceFeePerDay,
      depositAmount,
      maxDays,
      instructions,
      pickupNote,
    } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ success: false, message: 'Please provide title, category, and description.' });
    }

    const currentUser = users.find((u) => u.id === currentUserId);
    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'Please log in to list a tool.' });
    }

    const newTool: ToolItem = {
      id: `tool-${Date.now()}`,
      title,
      brand: brand || 'Standard',
      model: model || '',
      category,
      description,
      condition: condition || 'Good Condition',
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      ownerRating: currentUser.trustScore,
      ownerBorrowsCount: currentUser.totalLends,
      neighborhoodId: currentUser.neighborhoodId,
      distanceKm: 0.1,
      locationSnippet: `${currentUser.neighborhoodName} (Your listing)`,
      status: 'available',
      maintenanceFeePerDay: Number(maintenanceFeePerDay) || 0,
      depositAmount: Number(depositAmount) || 20,
      maxDays: Number(maxDays) || 5,
      instructions: instructions || 'Please handle with care and return wiped clean.',
      pickupNote: pickupNote || 'Contact for pickup address after request confirmation.',
      createdAt: new Date().toISOString().split('T')[0],
    };

    tools.unshift(newTool);
    currentUser.totalLends += 1;

    res.status(201).json({
      success: true,
      message: 'Tool listing created successfully!',
      tool: newTool,
    });
  });

  app.put(['/api/tools/:id', '/api/items/:id'], (req, res) => {
    const index = tools.findIndex((t) => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Tool not found.' });
    }

    const updated = {
      ...tools[index],
      ...req.body,
    };
    tools[index] = updated;

    res.json({
      success: true,
      message: 'Tool listing updated.',
      tool: updated,
    });
  });

  app.delete(['/api/tools/:id', '/api/items/:id'], (req, res) => {
    const index = tools.findIndex((t) => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Tool not found.' });
    }
    const removed = tools.splice(index, 1);
    res.json({
      success: true,
      message: 'Tool listing removed.',
      tool: removed[0],
    });
  });

  // ----------------------------------------
  // Borrow Requests & Workflow Endpoints
  // ----------------------------------------
  app.get('/api/borrow-requests', (req, res) => {
    const { role } = req.query; // 'borrower' | 'lender' | 'all'
    const currentUser = users.find((u) => u.id === currentUserId);
    if (!currentUser) {
      return res.json({ success: true, requests: [] });
    }

    let result = [...borrowRequests];
    if (role === 'borrower') {
      result = result.filter((r) => r.borrowerId === currentUser.id);
    } else if (role === 'lender') {
      result = result.filter((r) => r.ownerId === currentUser.id);
    } else {
      result = result.filter(
        (r) => r.borrowerId === currentUser.id || r.ownerId === currentUser.id
      );
    }

    res.json({
      success: true,
      requests: result,
    });
  });

  app.post('/api/borrow-requests', (req, res) => {
    const { toolId, startDate, endDate, purposeNote } = req.body;
    const tool = tools.find((t) => t.id === toolId);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found.' });
    }

    const currentUser = users.find((u) => u.id === currentUserId);
    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'Please log in to submit a borrow request.' });
    }

    // Calculate duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const maintenanceFee = tool.maintenanceFeePerDay * daysCount;
    const depositFee = tool.depositAmount;
    const totalPaid = maintenanceFee + depositFee;

    const newRequest: BorrowRequest = {
      id: `req-${Date.now()}`,
      toolId: tool.id,
      toolTitle: tool.title,
      toolImage: tool.imageUrl,
      toolCategory: tool.category,
      ownerId: tool.ownerId,
      ownerName: tool.ownerName,
      borrowerId: currentUser.id,
      borrowerName: currentUser.name,
      borrowerAvatar: currentUser.avatar,
      borrowerTrust: currentUser.trustScore,
      startDate,
      endDate,
      daysCount,
      maintenanceFee,
      depositFee,
      totalPaid,
      depositRefunded: false,
      status: 'pending',
      purposeNote: purposeNote || 'Community household project use.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    borrowRequests.unshift(newRequest);

    // Also send an automated coordination chat message
    chatMessages.push({
      id: `msg-${Date.now()}`,
      requestId: newRequest.id,
      toolId: tool.id,
      toolTitle: tool.title,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: tool.ownerId,
      receiverName: tool.ownerName,
      message: `Hi ${tool.ownerName}! I've submitted a borrow request for "${tool.title}" (${startDate} to ${endDate}). Note: ${purposeNote || 'Looking forward to borrowing!'}`,
      timestamp: 'Just now',
    });

    res.status(201).json({
      success: true,
      message: 'Borrow request sent to owner!',
      request: newRequest,
    });
  });

  app.patch('/api/borrow-requests/:id/status', (req, res) => {
    const { status, action } = req.body;
    const requestIndex = borrowRequests.findIndex((r) => r.id === req.params.id);
    if (requestIndex === -1) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const currentReq = borrowRequests[requestIndex];
    let newStatus = status;

    if (action === 'approve') {
      newStatus = 'approved';
      // Mark tool as reserved or soon borrowed
    } else if (action === 'pickup') {
      newStatus = 'active';
      const t = tools.find((x) => x.id === currentReq.toolId);
      if (t) t.status = 'borrowed';
    } else if (action === 'return') {
      newStatus = 'returned';
      currentReq.depositRefunded = true; // Auto release deposit upon verified safe return
      const t = tools.find((x) => x.id === currentReq.toolId);
      if (t) t.status = 'available';

      // Update borrow count
      const borrower = users.find((u) => u.id === currentReq.borrowerId);
      if (borrower) borrower.totalBorrows += 1;
    } else if (action === 'reject') {
      newStatus = 'rejected';
      currentReq.depositRefunded = true;
    }

    currentReq.status = newStatus;
    currentReq.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: `Request status updated to ${newStatus}.`,
      request: currentReq,
    });
  });

  // ----------------------------------------
  // Neighborhood Chat & Messages
  // ----------------------------------------
  app.get('/api/messages', (req, res) => {
    const currentUser = users.find((u) => u.id === currentUserId) || users[0];
    const userMessages = chatMessages.filter(
      (m) => m.senderId === currentUser.id || m.receiverId === currentUser.id
    );
    res.json({
      success: true,
      messages: userMessages,
    });
  });

  app.post('/api/messages', (req, res) => {
    const { receiverId, receiverName, message, toolId, toolTitle, requestId } = req.body;
    if (!receiverId || !message) {
      return res.status(400).json({ success: false, message: 'Receiver and message are required.' });
    }
    const currentUser = users.find((u) => u.id === currentUserId) || users[0];

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      requestId,
      toolId,
      toolTitle,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId,
      receiverName: receiverName || 'Neighbor',
      message: message.trim(),
      timestamp: 'Just now',
    };

    chatMessages.push(newMsg);
    res.status(201).json({
      success: true,
      message: newMsg,
    });
  });

  // ----------------------------------------
  // Reviews & Community Item/Service Feedback
  // ----------------------------------------
  app.get('/api/reviews', (req, res) => {
    res.json({
      success: true,
      reviews,
    });
  });

  app.post('/api/reviews', (req, res) => {
    const {
      toolId,
      toolTitle,
      toolCategory,
      toolImage,
      targetUserId,
      targetUserName,
      rating,
      careRating,
      punctualityRating,
      feedbackType,
      comment,
      wouldRecommend,
    } = req.body;
    const currentUser = users.find((u) => u.id === currentUserId) || users[0];
    const tool = toolId ? tools.find((t) => t.id === toolId) : undefined;
    const targetUser = targetUserId ? users.find((u) => u.id === targetUserId) : undefined;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      toolId: tool?.id || toolId || '',
      toolTitle: toolTitle || tool?.title || 'Community Equipment',
      toolCategory: toolCategory || tool?.category || 'General Equipment',
      toolImage: toolImage || tool?.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      targetUserId: targetUserId || tool?.ownerId || '',
      targetUserName: targetUserName || targetUser?.name || tool?.ownerName || 'Verified Neighbor',
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatar,
      rating: Number(rating) || 5,
      careRating: Number(careRating) || 5,
      punctualityRating: Number(punctualityRating) || 5,
      feedbackType: feedbackType || 'item',
      comment: comment?.trim() || 'Smooth pickup and return, great neighborly interaction and quality tool!',
      wouldRecommend: wouldRecommend !== undefined ? Boolean(wouldRecommend) : true,
      date: 'Today',
      helpfulCount: 0,
    };

    reviews.unshift(newReview);
    res.status(201).json({
      success: true,
      message: 'Item & service feedback submitted! Thank you for strengthening community trust.',
      review: newReview,
    });
  });

  app.post('/api/reviews/:id/helpful', (req, res) => {
    const rev = reviews.find((r) => r.id === req.params.id);
    if (!rev) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    rev.helpfulCount = (rev.helpfulCount || 0) + 1;
    res.json({
      success: true,
      helpfulCount: rev.helpfulCount,
    });
  });

  // ----------------------------------------
  // Community Impact Stats
  // ----------------------------------------
  app.get('/api/stats', (req, res) => {
    const totalTools = tools.length;
    const availableTools = tools.filter((t) => t.status === 'available').length;
    const activeBorrows = borrowRequests.filter((r) => r.status === 'active' || r.status === 'pending').length;
    const totalSavedRM = tools.reduce((acc, t) => acc + (t.depositAmount * 2), 16400);

    res.json({
      success: true,
      stats: {
        totalTools,
        availableTools,
        activeBorrows,
        totalNeighbors: users.length * 28,
        totalSavingsEstimate: totalSavedRM,
        landfillWasteDivertedKg: 310,
      },
    });
  });

  // ----------------------------------------
  // Vite Middleware (Dev vs Prod)
  // ----------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JiranAid server running on http://localhost:${PORT}`);
  });
}

startServer();

-- 1. Insert Neighborhoods (Including Shah Alam key sections & surrounding areas)
INSERT INTO neighborhoods (name, city, postcode) VALUES
   ('Taman Puchong Prima', 'Puchong', '47150'),
   ('Seksyen 14 (Dataran Bandaraya)', 'Shah Alam', '40000'),
   ('Seksyen 13 (Stadium Area)', 'Shah Alam', '40100'),
   ('Setia Alam / Seksyen U13', 'Shah Alam', '40170'),
   ('Subang Bestari / Seksyen U5', 'Shah Alam', '40150'),
   ('Seksyen 7 (UiTM / Unisel Area)', 'Shah Alam', '40000'),
   ('Alam Impian / Seksyen 35', 'Shah Alam', '40470'),
   ('Kuala Lumpur', 'Kuala Lumpur', '50088');

-- 2. Insert Seeded Test Accounts (Standard password: password123)
-- Hash generated with bcryptjs for password123: $2b$10$NDFoI.91VEgwNJHM81cR6e5mEXuD7aCi8EoCE0a3XitXVC4sK8mda
INSERT INTO users (name, email, password_hash, phone, role, neighborhood_id) VALUES
   ('Haris', 'haris@jiranaid.test', '$2b$10$NDFoI.91VEgwNJHM81cR6e5mEXuD7aCi8EoCE0a3XitXVC4sK8mda', '+60123456781', 1, 2),
   ('Khairil', 'khairil@jiranaid.test', '$2b$10$NDFoI.91VEgwNJHM81cR6e5mEXuD7aCi8EoCE0a3XitXVC4sK8mda', '+60123456782', 1, 5),
   ('Shathi', 'shathi@jiranaid.test', '$2b$10$NDFoI.91VEgwNJHM81cR6e5mEXuD7aCi8EoCE0a3XitXVC4sK8mda', '+60123456783', 1, 7),
   ('Sufiya', 'sufiya@jiranaid.test', '$2b$10$NDFoI.91VEgwNJHM81cR6e5mEXuD7aCi8EoCE0a3XitXVC4sK8mda', '+60123456784', 1, 1),
   ('Coo', 'coo@jiranaid.test', '$2b$10$NDFoI.91VEgwNJHM81cR6e5mEXuD7aCi8EoCE0a3XitXVC4sK8mda', '+60123456785', 1, 6)
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Initial Equipment Library Items
INSERT INTO items (title, description, price, deposit, category, image_url, pickup_note, user_id) VALUES
   ('Kärcher K3 High Pressure Water Jet', 'Perfect for patio washdowns, car porch paving moss cleaning, and driveways. Comes with dirt blaster nozzle and detergent tube.', 4.00, 30.00, 'Cleaning & Steam', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80', 'Pick up anytime after 9 AM. I will leave it by the shaded porch or greet you.', 1),
   ('Makita 18V Brushless Cordless Drill Kit', 'Heavy duty hammer drill driver with masonry bits, wood drill bits, screw bit set, and dual-port rapid charger.', 5.00, 40.00, 'Power Tools', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80', 'Ring doorbell at #24. Usually home after 5:30 PM.', 2),
   ('Ryobi 36V Cordless Telescopic Pole Hedge Trimmer', 'Safely trim tall garden bougainvillea, hedges, and overhanging tree branches without wobbling on an unsafe ladder.', 3.00, 25.00, 'Gardening & Yard', 'https://images.unsplash.com/photo-1592417817098-8f3d6eb228cc?w=800&auto=format&fit=crop&q=80', 'Self pickup from side garage box with code.', 1),
   ('3.8m Aluminum Telescopic Extension Ladder', 'Compact 3.8m telescopic ladder. Collapses down to 85cm so it fits inside any compact sedan trunk easily. EN131 certified.', 2.00, 35.00, 'Ladders & Access', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80', 'Available for porch pickup anytime this week.', 2),
   ('Bissell SpotClean Pro Carpet & Upholstery Washer', 'Commercial quality extractor for fabric sofa stains, car seats, pet messes, and mattresses. Includes concentrated pet formula bottle.', 6.00, 50.00, 'Cleaning & Steam', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80', 'Available today. Please bring a tote bag for hose attachments.', 1),
   ('Bosch Professional Orbital Palm Sander', 'Low vibration palm sheet sander with microfilter dust canister. Great for DIY dining table refinishing, doors, or smoothing pallet wood.', 3.00, 20.00, 'Woodworking', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&auto=format&fit=crop&q=80', 'Free to pick up this weekend.', 2),
   ('Ninja Foodi 8-in-1 Digital Air Fry Oven', 'High capacity air fry, roast, broil, and dehydrate oven. Great for batch meal prepping or neighborhood potluck baking.', 5.00, 45.00, 'Kitchen Appliances', 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80', 'Includes original box with handles for easy carrying.', 1),
   ('NOCO Boost Plus GB40 1000A Car Jump Starter', 'Safely jump-start a dead vehicle battery in seconds without needing another car. Built-in LED flashlight and USB phone charging port.', 2.00, 30.00, 'Automotive', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80', 'Emergency tool. Keep in car or return after battery start.', 2);


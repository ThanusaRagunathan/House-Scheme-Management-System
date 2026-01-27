USE house_scheme_management_system;

-- USERS (Owner, Treasurer, Tenants)
INSERT INTO users (username, password, role, email, phone) VALUES
('suresh.owner', 'password123', 'Owner', 'suresh@example.com', '0771112233'),
('aravinth.treasurer', 'password123', 'Treasurer', 'aravinth@example.com', '0774445566'),
('karthik.s', 'password123', 'Tenant', 'karthik@example.com', '0779001122'),
('priya.r', 'password123', 'Tenant', 'priya@example.com', '0779001133'),
('naveen.k', 'password123', 'Tenant', 'naveen@example.com', '0779001144'),
('meena.p', 'password123', 'Tenant', 'meena@example.com', '0779001155'),
('vijay.l', 'password123', 'Tenant', 'vijay@example.com', '0779001166');

-- HOUSES (Colombo Addresses)
INSERT INTO houses (address, rooms, rent_amount, status, owner_id) VALUES
('No 12, Galle Road, Colombo 03', 3, 35000.00, 'Occupied', 1),
('No 45, Wellawatte Road, Colombo 06', 2, 28000.00, 'Occupied', 1),
('No 78, Marine Drive, Colombo 04', 4, 45000.00, 'Vacant', 1),
('No 22, Duplication Road, Colombo 04', 3, 32000.00, 'Occupied', 1),
('No 90, Baseline Road, Colombo 09', 2, 25000.00, 'Occupied', 1);

-- TENANTS (Personal Information)
INSERT INTO tenants (user_id, occupation, date_of_birth) VALUES
(3, 'Software Engineer', '1994-06-12'),
(4, 'School Teacher', '1992-09-25'),
(5, 'Bank Officer', '1990-03-18'),
(6, 'HR Executive', '1995-11-02'),
(7, 'Civil Engineer', '1989-01-30');

-- TENANCIES (Tenant ↔ House Mapping)
INSERT INTO tenancies (tenant_id, house_id, start_date) VALUES
(1, 1, '2024-01-01'),
(2, 2, '2024-02-15'),
(3, 4, '2023-12-01'),
(4, 5, '2024-03-10'),
(5, 3, '2024-04-01');

-- PAYMENTS
INSERT INTO payments (tenancy_id, amount, status, paid_date, due_date, invoice_no, payment_method) VALUES
(1, 35000.00, 'Paid', '2025-08-01', '2025-08-05', 'INV-001', 'Online'),
(2, 28000.00, 'Paid', '2025-08-03', '2025-08-05', 'INV-002', 'Offline'),
(3, 32000.00, 'Pending', NULL, '2025-08-10', 'INV-003', 'Online'),
(4, 25000.00, 'Paid', '2025-08-02', '2025-08-05', 'INV-004', 'Online'),
(5, 45000.00, 'Pending', NULL, '2025-08-15', 'INV-005', 'Offline');

-- COMPLAINTS
INSERT INTO complaints (tenancy_id, title, description, status, response) VALUES
(1, 'Water Leakage', 'Bathroom pipe is leaking continuously.', 'Resolved', 'Pipe replaced successfully'),
(2, 'Electricity Issue', 'Frequent power trips in the kitchen.', 'In Progress', NULL),
(3, 'AC Problem', 'Air conditioner not cooling properly.', 'Open', NULL),
(4, 'Window Damage', 'Living room window glass is broken.', 'Resolved', 'Glass replaced'),
(5, 'Low Water Pressure', 'Water pressure is very low in the shower.', 'Open', NULL);

-- MAINTENANCE TASKS
INSERT INTO maintenance_tasks (house_id, description, cost, task_status, scheduled_date, completion_date) VALUES
(1, 'Bathroom pipe repair', 1500.00, 'Completed', '2025-08-02', '2025-08-02'),
(2, 'Electrical wiring check', 2000.00, 'In Progress', '2025-08-06', NULL),
(3, 'AC servicing', 3000.00, 'Pending', '2025-08-10', NULL),
(4, 'Window glass replacement', 2500.00, 'Completed', '2025-08-03', '2025-08-03'),
(5, 'Water tank cleaning', 1800.00, 'Pending', '2025-08-12', NULL);

-- DOCUMENTS
INSERT INTO documents (document_name, document_type, house_id) VALUES
('Rental Agreement – Karthik', 'Agreement', 1),
('Invoice August 2025 – H001', 'Invoice', 1),
('Rental Agreement – Priya', 'Agreement', 2),
('Maintenance Report – AC', 'Report', 3),
('Invoice August 2025 – H005', 'Invoice', 5);

-- NOTIFICATIONS
INSERT INTO notifications (user_id, title, description, status) VALUES
(1, 'Rent Due Reminder', 'Tenant rent payments due within 5 days.', 'New'),
(2, 'Maintenance Alert', 'Pending maintenance tasks need review.', 'New'),
(3, 'Payment Confirmation', 'Your rent payment has been received.', 'Read'),
(4, 'Complaint Update', 'Your complaint status has been updated.', 'New'),
(5, 'Rent Reminder', 'Please pay rent before due date.', 'Read');

-- REPORTS
INSERT INTO reports (report_name, report_type, content, generated_by) VALUES
('August Rent Collection', 'Financial', 'Summary of rent collected for August 2025.', 2),
('Pending Maintenance Tasks', 'Maintenance', 'List of all pending maintenance works.', 2),
('House Occupancy Status', 'Occupancy', 'Occupied and vacant houses summary.', 1);

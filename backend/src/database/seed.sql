USE house_scheme_management_system;

-- USERS (Owner, Treasurer, Tenants)
INSERT INTO users (username, password, role, email, phone) VALUES
('suresh.owner', '$2b$10$YBzSu2FVYcbfmqNv4K2BC.OeWwVVVtDZq/K2Ck/Q6fOVhwjSUgJ/i', 'Owner', 'suresh@example.com', '0771112233'),
('aravinth.treasurer', '$2b$10$YBzSu2FVYcbfmqNv4K2BC.OeWwVVVtDZq/K2Ck/Q6fOVhwjSUgJ/i', 'Treasurer', 'aravinth@example.com', '0774445566'),
('karthik.s', '$2b$10$YBzSu2FVYcbfmqNv4K2BC.OeWwVVVtDZq/K2Ck/Q6fOVhwjSUgJ/i', 'Tenant', 'karthik@example.com', '0779001122'),
('priya.r', '$2b$10$YBzSu2FVYcbfmqNv4K2BC.OeWwVVVtDZq/K2Ck/Q6fOVhwjSUgJ/i', 'Tenant', 'priya@example.com', '0779001133'),
('naveen.k', '$2b$10$YBzSu2FVYcbfmqNv4K2BC.OeWwVVVtDZq/K2Ck/Q6fOVhwjSUgJ/i', 'Tenant', 'naveen@example.com', '0779001144'),
('meena.p', '$2b$10$YBzSu2FVYcbfmqNv4K2BC.OeWwVVVtDZq/K2Ck/Q6fOVhwjSUgJ/i', 'Tenant', 'meena@example.com', '0779001155'),
('vijay.l', '$2b$10$YBzSu2FVYcbfmqNv4K2BC.OeWwVVVtDZq/K2Ck/Q6fOVhwjSUgJ/i', 'Tenant', 'vijay@example.com', '0779001166');

-- HOUSES (Colombo Addresses)
INSERT INTO houses (reference_code, address, rooms, rent_amount, status, owner_id) VALUES
('H-000A', 'No 12, Galle Road, Colombo 03', 3, 35000.00, 'Occupied', 1),
('H-000B', 'No 45, Wellawatte Road, Colombo 06', 2, 28000.00, 'Occupied', 1),
('H-000C', 'No 78, Marine Drive, Colombo 04', 4, 45000.00, 'Vacant', 1),
('H-000D', 'No 22, Duplication Road, Colombo 04', 3, 32000.00, 'Occupied', 1),
('H-000E', 'No 90, Baseline Road, Colombo 09', 2, 25000.00, 'Occupied', 1),
('H-001', 'No. 12, Galle Road, Dehiwala', 3, 45000.00, 'Vacant', 1),
('H-002', 'No. 45, Station Road, Wellawatte', 2, 40000.00, 'Occupied', 1),
('H-003', 'No. 78, Temple Road, Bambalapitiya', 4, 65000.00, 'Maintenance', 1),
('H-004', 'No. 23, Hill Street, Mount Lavinia', 3, 55000.00, 'Vacant', 1),
('H-005', 'No. 90, High Level Road, Nugegoda', 2, 38000.00, 'Occupied', 1),
('H-006', 'No. 15, Mosque Road, Maradana', 3, 50000.00, 'Vacant', 1),
('H-007', 'No. 66, Sea Street, Colombo Fort', 1, 30000.00, 'Occupied', 1),
('H-008', 'No. 34, Church Lane, Kotahena', 2, 42000.00, 'Maintenance', 1),
('H-009', 'No. 120, Old Kottawa Road, Pannipitiya', 4, 60000.00, 'Vacant', 1),
('H-010', 'No. 5, Main Street, Slave Island', 2, 45000.00, 'Occupied', 1),
('H-011', 'No. 88, Jaffna Street, Wellawatte', 3, 52000.00, 'Vacant', 1),
('H-012', 'No. 19, Beach Road, Dehiwala', 2, 43000.00, 'Occupied', 1),
('H-013', 'No. 27, Lake Road, Boralesgamuwa', 3, 48000.00, 'Maintenance', 1),
('H-014', 'No. 50, Park Street, Colombo 02', 1, 35000.00, 'Vacant', 1),
('H-015', 'No. 72, Station Lane, Mount Lavinia', 4, 70000.00, 'Occupied', 1),
('H-016', 'No. 11, Flower Road, Colombo 07', 3, 80000.00, 'Vacant', 1),
('H-017', 'No. 64, Temple Lane, Rajagiriya', 2, 46000.00, 'Occupied', 1),
('H-018', 'No. 29, Market Road, Pettah', 1, 32000.00, 'Maintenance', 1),
('H-019', 'No. 101, School Road, Wellawatte', 3, 54000.00, 'Vacant', 1),
('H-020', 'No. 39, Hospital Road, Kalubowila', 2, 47000.00, 'Occupied', 1);

-- TenantS (Personal Information)
INSERT INTO Tenants (user_id, occupation, date_of_birth) VALUES
(3, 'Software Engineer', '1994-06-12'),
(4, 'School Teacher', '1992-09-25'),
(5, 'Bank Officer', '1990-03-18'),
(6, 'HR Executive', '1995-11-02'),
(7, 'Civil Engineer', '1989-01-30');

-- TENANCIES (Tenant ↔ House Mapping)
INSERT INTO tenancies (Tenant_id, house_id, start_date) VALUES
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

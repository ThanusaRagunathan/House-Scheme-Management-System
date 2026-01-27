-- Create Database
CREATE DATABASE house_scheme_management_system;
USE house_scheme_management_system;

-- Users Table (Owner, Treasurer, Tenant)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Owner', 'Treasurer', 'Tenant') NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Houses Table
CREATE TABLE houses (
    house_id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    rooms INT NOT NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    status ENUM('Occupied','Vacant') NOT NULL,
    owner_id INT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Tenants Table (Personal Information Only)
CREATE TABLE tenants (
    tenant_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    occupation VARCHAR(50),
    date_of_birth DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Tenancies Table (Tenant–House Relationship)
CREATE TABLE tenancies (
    tenancy_id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    house_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id)
        ON DELETE CASCADE,
    FOREIGN KEY (house_id) REFERENCES houses(house_id)
        ON DELETE CASCADE
);

-- Payments Table (3NF – No Transitive Dependency)
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    tenancy_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('Paid','Pending') NOT NULL,
    paid_date DATE,
    due_date DATE,
    invoice_no VARCHAR(50) NOT NULL UNIQUE,
    payment_method ENUM('Online','Offline') NOT NULL,
    FOREIGN KEY (tenancy_id) REFERENCES tenancies(tenancy_id)
        ON DELETE CASCADE
);

-- Complaints Table
CREATE TABLE complaints (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    tenancy_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Open','In Progress','Resolved') NOT NULL,
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP NULL,
    response TEXT,
    FOREIGN KEY (tenancy_id) REFERENCES tenancies(tenancy_id)
        ON DELETE CASCADE
);

-- Maintenance Tasks Table
CREATE TABLE maintenance_tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    house_id INT NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(10,2),
    task_status ENUM('Pending','In Progress','Completed') NOT NULL,
    scheduled_date DATE,
    completion_date DATE,
    FOREIGN KEY (house_id) REFERENCES houses(house_id)
        ON DELETE CASCADE
);

-- Documents Table
CREATE TABLE documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    document_name VARCHAR(255),
    document_type ENUM('Agreement','Invoice','Report') NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    house_id INT NOT NULL,
    FOREIGN KEY (house_id) REFERENCES houses(house_id)
        ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    description TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('New','Read') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Reports Table
CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(255),
    report_type ENUM('Financial','Maintenance','Occupancy') NOT NULL,
    content TEXT NOT NULL,
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by INT NOT NULL,
    FOREIGN KEY (generated_by) REFERENCES users(user_id)
        ON DELETE CASCADE
);

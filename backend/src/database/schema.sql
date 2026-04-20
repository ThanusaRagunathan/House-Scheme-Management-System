-- Create Database
CREATE DATABASE house_scheme_management_system;
USE house_scheme_management_system;

-- Users Table (Owner, Treasurer, Tenant)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isFirstLogin BOOLEAN DEFAULT TRUE,
    is_deleted TINYINT(1) DEFAULT 0
);


-- Houses Table
CREATE TABLE houses (
    house_id INT AUTO_INCREMENT PRIMARY KEY,
    reference_code VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    rooms INT NOT NULL,
    rent_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    owner_id INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    FOREIGN KEY (owner_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Tenants Table (Personal Information Only)
CREATE TABLE Tenants (
    Tenant_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    nic VARCHAR(15) NOT NULL,
    occupation VARCHAR(50),
    date_of_birth DATE,
    is_deleted TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Tenancies Table (Tenant–House Relationship)
CREATE TABLE tenancies (
    tenancy_id INT AUTO_INCREMENT PRIMARY KEY,
    Tenant_id INT NOT NULL,
    house_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    is_deleted TINYINT(1) DEFAULT 0,
    FOREIGN KEY (Tenant_id) REFERENCES Tenants(Tenant_id)
        ON DELETE CASCADE,
    FOREIGN KEY (house_id) REFERENCES houses(house_id)
        ON DELETE CASCADE
);

-- Payments Table (3NF – No Transitive Dependency)
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    tenancy_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    paid_date DATE,
    due_date DATE,
    invoice_no VARCHAR(50) NOT NULL UNIQUE,
    payment_method VARCHAR(50) NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    FOREIGN KEY (tenancy_id) REFERENCES tenancies(tenancy_id)
        ON DELETE CASCADE
);

-- Complaints Table
CREATE TABLE complaints (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    tenancy_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP NULL,
    response TEXT,
    is_deleted TINYINT(1) DEFAULT 0,
    FOREIGN KEY (tenancy_id) REFERENCES tenancies(tenancy_id)
        ON DELETE CASCADE
);

-- Maintenance Tasks Table
CREATE TABLE maintenance_tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    house_id INT NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(10,2),
    task_status VARCHAR(20) NOT NULL,
    scheduled_date DATE,
    completion_date DATE,
    is_deleted TINYINT(1) DEFAULT 0,
    FOREIGN KEY (house_id) REFERENCES houses(house_id)
        ON DELETE CASCADE
);

-- Documents Table
CREATE TABLE documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    document_name VARCHAR(255),
    document_type VARCHAR(50) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    house_id INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
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
    status VARCHAR(20) NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Reports Table
CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(255),
    report_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by INT NOT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    FOREIGN KEY (generated_by) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Family Members Table
CREATE TABLE family_members (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    Tenant_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    relation VARCHAR(100),
    occupation VARCHAR(100),
    nic VARCHAR(15),
    date_of_birth DATE,
    FOREIGN KEY (Tenant_id) REFERENCES Tenants(Tenant_id)
        ON DELETE CASCADE
);

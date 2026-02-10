-- =============================================
-- Issue Tracker Database Schema (MySQL)
-- =============================================
-- Run this script to create the database and tables
-- MySQL 8.0+
-- =============================================

-- Create database (run this separately if needed)
-- CREATE DATABASE IF NOT EXISTS issue_tracker_db;
-- USE issue_tracker_db;

-- =============================================
-- Users Table
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_enabled BOOLEAN DEFAULT TRUE,
    CHECK (role IN ('admin', 'user'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_enabled ON users(is_enabled);

-- =============================================
-- Issues Table
-- =============================================
CREATE TABLE IF NOT EXISTS issues (
    issue_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    created_by INT NOT NULL,
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    attachment VARCHAR(500),

    -- Foreign Keys
    CONSTRAINT fk_issues_created_by FOREIGN KEY (created_by)
        REFERENCES users(user_id) ON DELETE RESTRICT,
    CONSTRAINT fk_issues_assigned_to FOREIGN KEY (assigned_to)
        REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for performance
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_priority ON issues(priority);
CREATE INDEX idx_issues_created_by ON issues(created_by);
CREATE INDEX idx_issues_assigned_to ON issues(assigned_to);
CREATE INDEX idx_issues_created_at ON issues(created_at);

-- =============================================
-- Notes:
-- =============================================
-- MySQL uses ON UPDATE CURRENT_TIMESTAMP instead of triggers
-- for auto-updating the updated_at column.
-- ENUM types are defined inline in the column definition.

-- =============================================
-- Useful Queries for Testing
-- =============================================
-- SELECT * FROM users;
-- SELECT * FROM issues;
-- SELECT status, COUNT(*) as count FROM issues GROUP BY status;

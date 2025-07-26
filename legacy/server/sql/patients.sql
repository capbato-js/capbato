CREATE TABLE patients (
    PatientID VARCHAR(15) PRIMARY KEY,
    LastName VARCHAR(120),
    FirstName VARCHAR(120),
    MiddleName VARCHAR(120),
    DateOfBirth DATE,
    Age INT(3),
    Gender VARCHAR(6),
    ContactNumber INT(11),
    Address VARCHAR(240),

    GuardianName VARCHAR(255),
    GuardianGender VARCHAR(10),
    GuardianRelationship VARCHAR(100),
    GuardianContactNumber BIGINT(11),
    GuardianAddress VARCHAR(240)
);

-- MySQL dump 10.13  Distrib 8.0.42, for macos15.2 (arm64)
--
-- Host: localhost    Database: clinic_management_system
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(100) NOT NULL,
  `visit_type` varchar(100) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('Pending','Confirmed','Cancelled') NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,'March Thirty One','Visit Type 1','2025-03-31','17:41:00','Confirmed','2025-03-19 09:41:40'),(2,'March Thirty One B','Visit Type 1','2025-03-31','18:20:00','Confirmed','2025-03-19 10:20:16');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `PatientID` int NOT NULL AUTO_INCREMENT,
  `LastName` varchar(120) NOT NULL,
  `FirstName` varchar(120) NOT NULL,
  `MiddleName` varchar(120) DEFAULT NULL,
  `DateOfBirth` date NOT NULL,
  `Age` int DEFAULT NULL,
  `Gender` varchar(10) NOT NULL,
  `ContactNumber` bigint NOT NULL,
  `MaritalStatus` varchar(25) DEFAULT NULL,
  `Occupation` varchar(50) DEFAULT NULL,
  `Weight` int DEFAULT NULL,
  `Height` int DEFAULT NULL,
  `Address` varchar(240) DEFAULT NULL,
  `GLastName` varchar(120) DEFAULT NULL,
  `GFirstName` varchar(120) DEFAULT NULL,
  `GMiddleName` varchar(120) DEFAULT NULL,
  `GDateOfBirth` date DEFAULT NULL,
  `GAge` int DEFAULT NULL,
  `GContactNumber` bigint DEFAULT NULL,
  `GRelationship` varchar(50) DEFAULT NULL,
  `GAddress` varchar(240) DEFAULT NULL,
  PRIMARY KEY (`PatientID`),
  CONSTRAINT `patients_chk_1` CHECK ((`Age` >= 0)),
  CONSTRAINT `patients_chk_2` CHECK ((`Weight` > 0)),
  CONSTRAINT `patients_chk_3` CHECK ((`Height` > 0)),
  CONSTRAINT `patients_chk_4` CHECK ((`GAge` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` enum('admin','receptionist','doctor') NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-29 15:49:58

-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: clinic-management-system
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(100) NOT NULL,
  `reason_for_visit` varchar(100) DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('Confirmed','Cancelled') NOT NULL DEFAULT 'Confirmed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `patient_id` varchar(50) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `doctor_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (100,'SOLEIL CERVANTES RIEGO','Consultation','2025-05-20','08:00:00','Confirmed','2025-05-19 13:26:01','R1','09083421788',NULL),(101,'SOLEIL CERVANTES RIEGO','Consultation','2025-05-19','08:00:00','Confirmed','2025-05-19 13:26:51','R1','09083421788',NULL),(102,'ALI MERCADEJAS RIEGO','Consultation','2025-05-20','08:00:00','Confirmed','2025-05-19 15:04:28','R2','09083421788',NULL),(103,'LILIENNE ALTAMIRANO ALLEJE','Consultation','2025-05-20','08:00:00','Confirmed','2025-05-19 15:04:46','A1','2147483647',NULL),(104,'CARISSA PICHO LABAYANDOY','Consultation','2025-05-21','08:00:00','Confirmed','2025-05-20 07:55:59','L1','09083421788',NULL),(105,'LILIENNE ALTAMIRANO ALLEJE','Consultation','2025-05-21','08:00:00','Confirmed','2025-05-20 08:01:37','A1','2147483647',NULL),(106,'LILIENNE ALTAMIRANO ALLEJE','Consultation','2025-06-29','11:00:00','Confirmed','2025-06-29 01:21:01','A1','2147483647',NULL),(107,'SOLEIL CERVANTES RIEGO','Consultation','2025-06-29','11:00:00','Confirmed','2025-06-29 02:14:24','R1','09083421788',NULL),(108,'GINA EMEROT HABUBOT','Consultation','2025-06-29','12:00:00','Confirmed','2025-06-29 03:18:17','H1','096457382','Doe, John (Cardiology)'),(109,'RAJ VA RIEGO','Consultation','2025-06-29','12:30:00','Confirmed','2025-06-29 04:08:44','R3','09083421788','Doe, John (Cardiology)'),(110,'ALI MERCADEJAS RIEGO','Consultation','2025-06-29','12:45:00','Confirmed','2025-06-29 04:29:05','R2','09083421788','Doe, John (Cardiology)');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_schedule`
--

DROP TABLE IF EXISTS `doctor_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctor_schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doctor_name` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_schedule`
--

LOCK TABLES `doctor_schedule` WRITE;
/*!40000 ALTER TABLE `doctor_schedule` DISABLE KEYS */;
INSERT INTO `doctor_schedule` VALUES (1,'Sunny Aragon','2025-05-19','9AM-5PM'),(2,'Sunny Aragon','2025-05-16','9AM-5PM'),(5,'Sunny Aragon','2025-05-20','9AM-5PM');
/*!40000 ALTER TABLE `doctor_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctors` (
  `DoctorID` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Specialization` varchar(100) DEFAULT NULL,
  `ContactNumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`DoctorID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'John','Doe','Cardiology','1234567890'),(2,'Alice','Smith','Pediatrics','0987654321');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_request_entries`
--

DROP TABLE IF EXISTS `lab_request_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lab_request_entries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(20) DEFAULT NULL,
  `patient_name` varchar(100) DEFAULT NULL,
  `age_gender` varchar(50) DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `cbc_with_platelet` varchar(3) DEFAULT NULL,
  `pregnancy_test` varchar(3) DEFAULT NULL,
  `urinalysis` varchar(3) DEFAULT NULL,
  `fecalysis` varchar(3) DEFAULT NULL,
  `occult_blood_test` varchar(3) DEFAULT NULL,
  `hepa_b_screening` varchar(3) DEFAULT NULL,
  `hepa_a_screening` varchar(3) DEFAULT NULL,
  `hepatitis_profile` varchar(3) DEFAULT NULL,
  `vdrl_rpr` varchar(3) DEFAULT NULL,
  `dengue_ns1` varchar(3) DEFAULT NULL,
  `ca_125_cea_psa` varchar(3) DEFAULT NULL,
  `fbs` varchar(3) DEFAULT NULL,
  `bun` varchar(3) DEFAULT NULL,
  `creatinine` varchar(3) DEFAULT NULL,
  `blood_uric_acid` varchar(3) DEFAULT NULL,
  `lipid_profile` varchar(3) DEFAULT NULL,
  `sgot` varchar(3) DEFAULT NULL,
  `sgpt` varchar(3) DEFAULT NULL,
  `alp` varchar(3) DEFAULT NULL,
  `sodium_na` varchar(3) DEFAULT NULL,
  `potassium_k` varchar(3) DEFAULT NULL,
  `hbalc` varchar(3) DEFAULT NULL,
  `ecg` varchar(3) DEFAULT NULL,
  `t3` varchar(3) DEFAULT NULL,
  `t4` varchar(3) DEFAULT NULL,
  `ft3` varchar(3) DEFAULT NULL,
  `ft4` varchar(3) DEFAULT NULL,
  `tsh` varchar(3) DEFAULT NULL,
  `others` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT 'Pending',
  `date_taken` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_request_entries`
--

LOCK TABLES `lab_request_entries` WRITE;
/*!40000 ALTER TABLE `lab_request_entries` DISABLE KEYS */;
INSERT INTO `lab_request_entries` VALUES (78,'R2','ALI MERCADEJAS RIEGO','12 / MALE','2025-05-20','no','no','no','no','no','no','no','no','no','no','no','1','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','','2025-05-20 04:18:53','Complete','2025-05-20'),(79,'R1','SOLEIL CERVANTES RIEGO','5 / FEMALE','2025-05-20','no','no','no','no','no','yes','yes','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','','2025-05-20 04:40:18','Pending',NULL);
/*!40000 ALTER TABLE `lab_request_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patients` (
  `PatientID` varchar(10) NOT NULL,
  `LastName` varchar(120) NOT NULL,
  `FirstName` varchar(120) NOT NULL,
  `MiddleName` varchar(120) NOT NULL,
  `DateOfBirth` date NOT NULL,
  `Age` int(3) NOT NULL,
  `Gender` varchar(6) NOT NULL,
  `ContactNumber` varchar(15) DEFAULT NULL,
  `Address` varchar(240) NOT NULL,
  `GuardianName` varchar(255) DEFAULT NULL,
  `GuardianGender` varchar(10) DEFAULT NULL,
  `GuardianRelationship` varchar(100) DEFAULT NULL,
  `GuardianContactNumber` varchar(15) DEFAULT NULL,
  `GuardianAddress` varchar(240) DEFAULT NULL,
  PRIMARY KEY (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES ('A1','ALLEJE','LILIENNE','ALTAMIRANO','2025-03-02',123,'MALE','2147483647','PH 4 PKG 5 BLK 34 LOT 17','ANJELA DEPANES','MALE','AAA','9083421788','PH 4 PKG 5 BLK 34 LOT 17'),('G1','GARCIA','GAEL','MAGBANUA','2025-05-14',18,'FEMALE','1234567898','JHFDHFH','GAEL GARCA','FEMALE','SISTER','09769863903','KJFKJFSGFSHF'),('H1','HABUBOT','GINA','EMEROT','2004-01-05',20,'FEMALE','096457382','PHS 3 HARUROT','GINE','MALE','FATHER','0943874635','JHTKRETHEOAK'),('L1','LABAYANDOY','CARISSA','PICHO','2025-12-31',12,'MALE','09083421788','PH 4 PKG 5 BLK 34 LOT 17','ANJELA DEPANES','FEMALE','AAA','09083421788','PH 4 PKG 5 BLK 34 LOT 17'),('M1','MONTEFALCO','KLARE','TY','2025-02-06',12,'FEMALE','09083421788','PH 4 PKG 5 BLK 34 LOT 17','ANJELA DEPANES','FEMALE','AAA','09083421788','PH 4 PKG 5 BLK 34 LOT 17'),('R1','RIEGO','SOLEIL','CERVANTES','2020-01-09',5,'FEMALE','09083421788','PH 4 PKG 5 BLK 34 LOT 17','RAJ','MALE','AAA','09083421788','PH 4 PKG 5 BLK 34 LOT 17'),('R2','RIEGO','ALI','MERCADEJAS','2025-04-03',12,'MALE','09083421788','PH 4 PKG 5 BLK 34 LOT 17','ANJELA DEPANES','FEMALE','SDSDSDS','09083421788','PH 4 PKG 5 BLK 34 LOT 17'),('R3','RIEGO','RAJ','VA','2020-02-14',12,'FEMALE','09083421788','PH 4 PKG 5 BLK 34 LOT 17','ANJELA DEPANES','FEMALE','AAA','09083421788','PH 4 PKG 5 BLK 34 LOT 17');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` enum('admin','receptionist','doctor') NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'receptionist','anjeladepanes','$2b$10$03ZU9WCfXE//Zod4E5rhGuoRsQ.PBBBqqo6SFPqYFSlesnOgwpWna','Anjela Depanes','anjeladepanes09@gmail.com',NULL,'2025-03-07 04:34:47','2025-03-07 04:34:47'),(2,'receptionist','abcd','$2b$10$6Q1vM2RwFDlrdGP.m1x/iuRd.3o4u8UCCJOq/UXWxm5xcUk9gJXF6','abcd','brooklynriego4@gmail.com',NULL,'2025-03-07 12:30:03','2025-03-07 12:30:03');
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

-- Dump completed on 2025-06-29 14:11:53

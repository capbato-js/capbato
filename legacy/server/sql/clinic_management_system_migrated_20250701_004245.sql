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
-- Current Database: `clinic_management_system`
--

/*!40000 DROP DATABASE IF EXISTS `clinic_management_system`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `clinic_management_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `clinic_management_system`;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `reason_for_visit` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('Confirmed','Cancelled') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Confirmed',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `patient_id` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contact_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `doctor_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` (`id`, `patient_name`, `reason_for_visit`, `appointment_date`, `appointment_time`, `status`, `created_at`, `patient_id`, `contact_number`, `doctor_name`) VALUES (100,'SOLEIL CERVANTES RIEGO','Consultation','2025-05-20','08:00:00','Confirmed','2025-05-19 13:26:01','2025-R1','09083421788',NULL),(101,'SOLEIL CERVANTES RIEGO','Consultation','2025-05-19','08:00:00','Confirmed','2025-05-19 13:26:51','2025-R1','09083421788',NULL),(102,'ALI MERCADEJAS RIEGO','Consultation','2025-05-20','08:00:00','Confirmed','2025-05-19 15:04:28','2025-R2','09083421788',NULL),(103,'LILIENNE ALTAMIRANO ALLEJE','Consultation','2025-05-20','08:00:00','Confirmed','2025-05-19 15:04:46','2025-A1','2147483647',NULL),(104,'CARISSA PICHO LABAYANDOY','Consultation','2025-05-21','08:00:00','Confirmed','2025-05-20 07:55:59','2025-L1','09083421788',NULL),(105,'LILIENNE ALTAMIRANO ALLEJE','Consultation','2025-05-21','08:00:00','Confirmed','2025-05-20 08:01:37','2025-A1','2147483647',NULL),(106,'LILIENNE ALTAMIRANO ALLEJE','Consultation','2025-06-29','11:00:00','Confirmed','2025-06-29 01:21:01','2025-A1','2147483647',NULL),(107,'SOLEIL CERVANTES RIEGO','Consultation','2025-06-29','11:00:00','Confirmed','2025-06-29 02:14:24','2025-R1','09083421788',NULL),(108,'GINA EMEROT HABUBOT','Consultation','2025-06-29','12:00:00','Confirmed','2025-06-29 03:18:17','2025-H1','096457382','Doe, John (Cardiology)'),(109,'RAJ VA RIEGO','Consultation','2025-06-29','12:30:00','Confirmed','2025-06-29 04:08:44','2025-R3','09083421788','Doe, John (Cardiology)'),(110,'ALI MERCADEJAS RIEGO','Consultation','2025-06-29','12:45:00','Confirmed','2025-06-29 04:29:05','2025-R2','09083421788','Doe, John (Cardiology)'),(111,'SOLEIL CERVANTES RIEGO','Visit Type SOLEIL','2025-06-30','11:45:00','Confirmed','2025-06-30 03:30:21','2025-R1','09083421788','Doe, John (Cardiology)'),(112,'ALI MERCADEJAS RIEGO','Visit Type ALI','2025-06-30','12:00:00','Confirmed','2025-06-30 03:30:48','2025-R2','09083421788','Smith, Alice (Pediatrics)'),(113,'CARISSA PICHO LABAYANDOY','Visit Type CARISSA','2025-06-30','13:15:00','Confirmed','2025-06-30 05:13:27','2025-L1','09083421788','Doe, John (Cardiology)'),(114,'RAJ VA RIEGO','Visit Type RAJ','2025-06-30','14:00:00','Confirmed','2025-06-30 05:47:58','2025-R3','09083421788','Doe, John (Cardiology)'),(117,'ALI MERCADEJAS RIEGO','Visit Type 1','2025-07-02','08:00:00','Confirmed','2025-06-30 11:33:14','2025-R2','09083421788','Doe, John (Cardiology)'),(118,'SOLEIL CERVANTES RIEGO','Visit Type 1','2025-07-02','08:00:00','Confirmed','2025-06-30 11:34:59','2025-R1','09083421788','Doe, John (Cardiology)'),(119,'RAJ VA RIEGO','Visit Type 1','2025-07-02','08:15:00','Confirmed','2025-06-30 11:39:59','2025-R3','09083421788','Smith, Alice (Pediatrics)');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_schedule`
--

DROP TABLE IF EXISTS `doctor_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `time` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_schedule`
--

LOCK TABLES `doctor_schedule` WRITE;
/*!40000 ALTER TABLE `doctor_schedule` DISABLE KEYS */;
INSERT INTO `doctor_schedule` (`id`, `doctor_name`, `date`, `time`) VALUES (1,'Sunny Aragon','2025-05-19','9AM-5PM'),(2,'Sunny Aragon','2025-05-16','9AM-5PM'),(5,'Sunny Aragon','2025-05-20','9AM-5PM');
/*!40000 ALTER TABLE `doctor_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `DoctorID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `LastName` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `Specialization` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ContactNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`DoctorID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` (`DoctorID`, `FirstName`, `LastName`, `Specialization`, `ContactNumber`) VALUES (1,'John','Doe','Cardiology','1234567890'),(2,'Alice','Smith','Pediatrics','0987654321');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_request_entries`
--

DROP TABLE IF EXISTS `lab_request_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_request_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `patient_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `age_gender` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `cbc_with_platelet` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pregnancy_test` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `urinalysis` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecalysis` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `occult_blood_test` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hepa_b_screening` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hepa_a_screening` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hepatitis_profile` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vdrl_rpr` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dengue_ns1` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ca_125_cea_psa` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fbs` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bun` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `creatinine` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `blood_uric_acid` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lipid_profile` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sgot` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sgpt` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alp` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sodium_na` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `potassium_k` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hbalc` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ecg` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `t3` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `t4` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ft3` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ft4` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tsh` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `others` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Pending',
  `date_taken` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_request_entries`
--

LOCK TABLES `lab_request_entries` WRITE;
/*!40000 ALTER TABLE `lab_request_entries` DISABLE KEYS */;
INSERT INTO `lab_request_entries` (`id`, `patient_id`, `patient_name`, `age_gender`, `request_date`, `cbc_with_platelet`, `pregnancy_test`, `urinalysis`, `fecalysis`, `occult_blood_test`, `hepa_b_screening`, `hepa_a_screening`, `hepatitis_profile`, `vdrl_rpr`, `dengue_ns1`, `ca_125_cea_psa`, `fbs`, `bun`, `creatinine`, `blood_uric_acid`, `lipid_profile`, `sgot`, `sgpt`, `alp`, `sodium_na`, `potassium_k`, `hbalc`, `ecg`, `t3`, `t4`, `ft3`, `ft4`, `tsh`, `others`, `created_at`, `status`, `date_taken`) VALUES (78,'2025-R2','ALI MERCADEJAS RIEGO','12 / MALE','2025-05-20','no','no','no','no','no','no','no','no','no','no','no','1','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','','2025-05-20 04:18:53','Complete','2025-05-20'),(79,'2025-R1','SOLEIL CERVANTES RIEGO','5 / FEMALE','2025-05-20','no','no','no','no','no','yes','yes','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','','2025-05-20 04:40:18','Pending',NULL),(91,'2025-R3','RAJ VA RIEGO','12 / FEMALE','2025-07-01','no','no','no','no','no','no','no','no','no','no','no','yes','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','','2025-06-30 12:39:01','Pending',NULL),(92,'2025-R3','RAJ VA RIEGO','12 / FEMALE','2025-06-30','no','no','no','no','no','no','no','no','no','no','no','2','3','no','no','no','no','no','no','no','no','no','no','no','no','no','no','no','','2025-06-30 12:42:15','Complete','2025-06-30');
/*!40000 ALTER TABLE `lab_request_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `PatientID` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `LastName` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `FirstName` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `MiddleName` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `DateOfBirth` date NOT NULL,
  `Age` int NOT NULL,
  `Gender` varchar(6) COLLATE utf8mb4_general_ci NOT NULL,
  `ContactNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Address` varchar(240) COLLATE utf8mb4_general_ci NOT NULL,
  `GuardianName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `GuardianGender` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `GuardianRelationship` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `GuardianContactNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `GuardianAddress` varchar(240) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` (`PatientID`, `LastName`, `FirstName`, `MiddleName`, `DateOfBirth`, `Age`, `Gender`, `ContactNumber`, `Address`, `GuardianName`, `GuardianGender`, `GuardianRelationship`, `GuardianContactNumber`, `GuardianAddress`) VALUES ('2025-A1','ALLEJE','LILIENNE','ALTAMIRANO','2025-03-02',123,'MALE','2147483647','PH 4 PKG 5 BLK 34 LOT 17','ANJELA DEPANES','MALE','AAA','9083421788','PH 4 PKG 5 BLK 34 LOT 17'),('2025-G1','GARCIA','GAEL','MAGBANUA','2025-05-14',18,'FEMALE','1234567898','JHFDHFH','GAEL GARCA','FEMALE','SISTER','09769863903','KJFKJFSGFSHF'),('2025-H1','HABUBOT','GINA','EMEROT','2004-01-05',20,'FEMALE','096457382','PHS 3 HARUROT','GINE','MALE','FATHER','0943874635','JHTKRETHEOAK'),('2025-L1','LABAYANDOY','CARISSA','PICHO','2025-12-31',12,'MALE','09083421788','PH 4 PKG 5 BLK 34 LOT 17','ANJELA DEPANES','FEMALE','AAA','09083421788','PH 4 PKG 5 BLK 34 LOT 17'),('2025-M1','MONTEFALCO','KLARE','TY','2025-02-06',12,'FEMALE','09083421788','PH 4 PKG 5 BLK 34 LOT 17','ANJELA DEPANES','FEMALE','AAA','09083421788','PH 4 PKG 5 BLK 34 LOT 17'),('2025-R1','RIEGO','SOLEIL','CERVANTES','2020-01-09',5,'FEMALE','09083421788','PH 4 PKG 5 BLK 34 LOT 17','RAJ','MALE','AAA','09083421788','PH 4 PKG 5 BLK 34 LOT 17'),('2025-R2','RIEGO','ALI','MERCADEJAS','2025-04-03',12,'MALE','09083421788','PH 4 PKG 5 BLK 34 LOT 17','ANJELA DEPANES','FEMALE','SDSDSDS','09083421788','PH 4 PKG 5 BLK 34 LOT 17'),('2025-R3','RIEGO','RAJ','VA','2020-02-14',12,'FEMALE','09083421788','PH 4 PKG 5 BLK 34 LOT 17','ANJELA DEPANES','FEMALE','AAA','09083421788','PH 4 PKG 5 BLK 34 LOT 17'),('2025-R4','RIEGO','AJ','','2000-10-09',24,'FEMALE','09123456780','34, CRISPIN ST., ALABANG, MUNTINLUPA, METRO MANILA','ANJELA DEPANES','FEMALE','SISTER','09123456780','BLOCK 34 LOT 17, PHASE 4C PKG 5, BAGONG SILANG, CALOOCAN, METRO MANILA');
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
  `role` enum('admin','receptionist','doctor') COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `role`, `username`, `password`, `full_name`, `email`, `phone`, `created_at`, `updated_at`) VALUES (1,'receptionist','anjeladepanes','$2b$10$03ZU9WCfXE//Zod4E5rhGuoRsQ.PBBBqqo6SFPqYFSlesnOgwpWna','Anjela Depanes','anjeladepanes09@gmail.com',NULL,'2025-03-07 04:34:47','2025-03-07 04:34:47'),(2,'receptionist','abcd','$2b$10$6Q1vM2RwFDlrdGP.m1x/iuRd.3o4u8UCCJOq/UXWxm5xcUk9gJXF6','abcd','brooklynriego4@gmail.com',NULL,'2025-03-07 12:30:03','2025-03-07 12:30:03'),(3,'doctor','johndoe','$2b$10$AMYrZqVp5Hkh/H6fghIR3e/VYsVc25XtEK9w.cVStG5qHKv.XNSkK','John Doe','johndoe@gmail.com',NULL,'2025-06-30 07:13:11','2025-06-30 07:13:11'),(5,'admin','admin','$2b$10$IYjOlIYOmFOvN226Kn6P8O9BSxXzWyuIj1H.v4v1xDf.3L4oJXGOK','Aj Admin','admin@gmail.com',NULL,'2025-06-30 16:32:29','2025-06-30 16:32:29');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'clinic_management_system'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-01  0:42:49

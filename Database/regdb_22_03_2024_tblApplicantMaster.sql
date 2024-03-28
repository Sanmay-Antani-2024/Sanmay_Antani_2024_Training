-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: regdb_22_03_2024
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tblApplicantMaster`
--

DROP TABLE IF EXISTS `tblApplicantMaster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblApplicantMaster` (
  `applID` int NOT NULL AUTO_INCREMENT,
  `fName` varchar(20) NOT NULL,
  `lName` varchar(20) NOT NULL,
  `gender` char(1) NOT NULL,
  `designation` varchar(40) NOT NULL,
  `relationSt` varchar(7) NOT NULL,
  `add1` varchar(255) NOT NULL,
  `add2` varchar(255) DEFAULT NULL,
  `dob` date NOT NULL,
  `city` varchar(40) NOT NULL,
  `state` varchar(40) NOT NULL,
  `zip` char(6) NOT NULL,
  `email` varchar(64) NOT NULL,
  `contact` char(10) DEFAULT NULL,
  PRIMARY KEY (`applID`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  CONSTRAINT `tblApplicantMaster_chk_1` CHECK ((`gender` in (_utf8mb4'M',_utf8mb4'F')))
) ENGINE=InnoDB AUTO_INCREMENT=219 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblApplicantMaster`
--

LOCK TABLES `tblApplicantMaster` WRITE;
/*!40000 ALTER TABLE `tblApplicantMaster` DISABLE KEYS */;
INSERT INTO `tblApplicantMaster` VALUES (194,'Sanmay','Antani','F','SDL-1','S','302,DivyaJyoat','601,Edifice','2002-02-27','Surat','Maharashtra','147852','sanmay2@gmail.com','9513572584'),(197,'Chinmay','Antani','F','SDL-1','M','302,DivyaJyoat','','1994-10-15','Surat','Maharashtra','987159','chinmay@gmail.com','9513571470'),(198,'Uday','Antani','M','Manager','S','302,Ramnagar','','1965-10-20','Surat','Gujarat','963210','uday@gmail.com','9512104125'),(218,'Beena','Antani','F','SDL-3','M','302,Ramnagar','','1969-09-24','Surat','Gujarat','147856','B@123gmail.com','9514741201');
/*!40000 ALTER TABLE `tblApplicantMaster` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-27 18:55:30

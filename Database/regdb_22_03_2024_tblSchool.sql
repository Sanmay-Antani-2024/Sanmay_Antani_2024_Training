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
-- Table structure for table `tblSchool`
--

DROP TABLE IF EXISTS `tblSchool`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblSchool` (
  `applID` int NOT NULL,
  `board` varchar(10) NOT NULL,
  `passYear` year NOT NULL,
  `percent` float NOT NULL,
  `std` varchar(11) NOT NULL,
  PRIMARY KEY (`applID`,`std`),
  CONSTRAINT `tblSchool_ibfk_1` FOREIGN KEY (`applID`) REFERENCES `tblApplicantMaster` (`applID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblSchool`
--

LOCK TABLES `tblSchool` WRITE;
/*!40000 ALTER TABLE `tblSchool` DISABLE KEYS */;
INSERT INTO `tblSchool` VALUES (194,'BCA',2022,70,'Graduation'),(194,'CBSE',2019,63,'HSC'),(194,'MCA',2024,70,'Master'),(194,'GSEB',2017,73,'SSC'),(197,'GSEB',2012,81,'HSC'),(197,'GSEB',2010,91,'SSC'),(198,'GSEB',2002,75,'SSC'),(218,'CBSE',2000,70,'HSC'),(218,'GSEB',1980,80,'SSC');
/*!40000 ALTER TABLE `tblSchool` ENABLE KEYS */;
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

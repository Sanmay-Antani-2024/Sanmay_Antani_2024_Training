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
-- Table structure for table `studentMasterAttRep`
--

DROP TABLE IF EXISTS `studentMasterAttRep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentMasterAttRep` (
  `stID` int NOT NULL AUTO_INCREMENT,
  `studentName` varchar(20) NOT NULL,
  PRIMARY KEY (`stID`)
) ENGINE=InnoDB AUTO_INCREMENT=228 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentMasterAttRep`
--

LOCK TABLES `studentMasterAttRep` WRITE;
/*!40000 ALTER TABLE `studentMasterAttRep` DISABLE KEYS */;
INSERT INTO `studentMasterAttRep` VALUES (1,'Vraj'),(2,'Parth'),(3,'Priyank'),(4,'Sona'),(5,'Yukta'),(6,'Dixit'),(7,'Kimisha'),(8,'Yashvi'),(9,'Anjali'),(10,'Chirag'),(11,'Yash'),(12,'Mihir'),(13,'Dhaval'),(14,'Alpesh'),(15,'Harshal'),(16,'Ashutosh'),(17,'Faizan'),(18,'Sanketkumar'),(19,'Darshan'),(20,'Vikram'),(21,'Abhishek'),(22,'Suvarna'),(23,'Vijaykumar'),(24,'Yash'),(25,'Krushi'),(26,'Jeel'),(27,'Brijesh'),(28,'Nandini'),(29,'Hadiya'),(30,'Darshak'),(31,'Aryaman'),(32,'Vansh'),(33,'Vivek'),(34,'Diya'),(35,'Rithesh'),(36,'Hardevsinh'),(37,'Vishvas'),(38,'Ashish'),(39,'Rajkumar'),(40,'Vivek'),(41,'Harshika'),(42,'Kajal'),(43,'Rushikesh'),(44,'Darshan'),(45,'Jyot'),(46,'Darshkumar'),(47,'Adnan'),(48,'Dhyey'),(49,'Vasu'),(50,'Parth'),(51,'Bharat'),(52,'Ruhifatima'),(53,'Kamyab'),(54,'Kaushal'),(55,'Shruti'),(56,'Puja'),(57,'Nikita'),(58,'Mohit'),(59,'Sakshi'),(60,'Surbhi'),(61,'Rijvan'),(62,'Manil'),(63,'Rajnikumar'),(64,'Yashvi'),(65,'Sanmay'),(66,'Chirag'),(67,'Abhishek'),(68,'Honey'),(69,'Harsh'),(70,'Keyur'),(71,'Parmeshwar'),(72,'Rutvi'),(73,'Shalieshbhai'),(74,'Tushar'),(75,'Jasmin'),(76,'Krish'),(77,'Rasheshkumar'),(78,'Prathvik'),(79,'Shivam'),(80,'KavinKumar'),(81,'Kishan'),(82,'Hardik'),(83,'Jay'),(84,'Lalit'),(85,'Ayush'),(86,'Nimi'),(87,'Gulshan'),(88,'Parth'),(89,'Yash'),(90,'Dharam'),(91,'Shivam'),(92,'Jil'),(93,'Ganpat'),(94,'Grishma'),(95,'Nehaben'),(96,'Hareshkumar'),(97,'Gagan'),(98,'Saurav'),(99,'Simran'),(100,'Satish'),(101,'Vraj'),(102,'Parth'),(103,'Priyank'),(104,'Sona'),(105,'Yukta'),(106,'Dixit'),(107,'Kimisha'),(108,'Yashvi'),(109,'Anjali'),(110,'Chirag'),(111,'Yash'),(112,'Mihir'),(113,'Dhaval'),(114,'Alpesh'),(115,'Harshal'),(116,'Ashutosh'),(117,'Faizan'),(118,'Sanketkumar'),(119,'Darshan'),(120,'Vikram'),(121,'Abhishek'),(122,'Suvarna'),(123,'Vijaykumar'),(124,'Yash'),(125,'Krushi'),(126,'Jeel'),(127,'Brijesh'),(128,'Nandini'),(129,'Hadiya'),(130,'Darshak'),(131,'Aryaman'),(132,'Vansh'),(133,'Vivek'),(134,'Diya'),(135,'Rithesh'),(136,'Hardevsinh'),(137,'Vishvas'),(138,'Ashish'),(139,'Rajkumar'),(140,'Vivek'),(141,'Harshika'),(142,'Kajal'),(143,'Rushikesh'),(144,'Darshan'),(145,'Jyot'),(146,'Darshkumar'),(147,'Adnan'),(148,'Dhyey'),(149,'Vasu'),(150,'Parth'),(151,'Bharat'),(152,'Ruhifatima'),(153,'Kamyab'),(154,'Kaushal'),(155,'Shruti'),(156,'Puja'),(157,'Nikita'),(158,'Mohit'),(159,'Sakshi'),(160,'Surbhi'),(161,'Rijvan'),(162,'Manil'),(163,'Rajnikumar'),(164,'Yashvi'),(165,'Sanmay'),(166,'Chirag'),(167,'Abhishek'),(168,'Honey'),(169,'Harsh'),(170,'Keyur'),(171,'Parmeshwar'),(172,'Rutvi'),(173,'Shalieshbhai'),(174,'Tushar'),(175,'Jasmin'),(176,'Krish'),(177,'Rasheshkumar'),(178,'Prathvik'),(179,'Shivam'),(180,'KavinKumar'),(181,'Kishan'),(182,'Hardik'),(183,'Jay'),(184,'Lalit'),(185,'Ayush'),(186,'Nimi'),(187,'Gulshan'),(188,'Parth'),(189,'Yash'),(190,'Dharam'),(191,'Shivam'),(192,'Jil'),(193,'Ganpat'),(194,'Grishma'),(195,'Nehaben'),(196,'Hareshkumar'),(197,'Gagan'),(198,'Saurav'),(199,'Simran'),(200,'Satish');
/*!40000 ALTER TABLE `studentMasterAttRep` ENABLE KEYS */;
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

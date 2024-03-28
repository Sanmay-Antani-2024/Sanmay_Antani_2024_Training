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
-- Table structure for table `Users_Regs_Master`
--

DROP TABLE IF EXISTS `Users_Regs_Master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users_Regs_Master` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Fname` varchar(30) NOT NULL,
  `Lname` varchar(30) NOT NULL,
  `email` varchar(64) NOT NULL,
  `Contact` char(10) NOT NULL,
  `gender` char(1) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `salt` char(4) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users_Regs_Master`
--

LOCK TABLES `Users_Regs_Master` WRITE;
/*!40000 ALTER TABLE `Users_Regs_Master` DISABLE KEYS */;
INSERT INTO `Users_Regs_Master` VALUES (5,'Sanmay','Antani','s@gmail.com','9856321478','M',NULL,NULL,0),(6,'Sanmay','Antani','s@gmail.com','9874561230','M',NULL,NULL,0),(7,'Uday','Antani','u@gmail.com','9632587410','M',NULL,NULL,0),(8,'Sanmay2','Antani','sanmay2@gmail.com','9631478523','M',NULL,NULL,0),(9,'Sanmay3','Antani','sanmay3@gmail.com','9631478523','M',NULL,NULL,0),(10,'Sanmay4','Antani4','Sanmay4@gmail.com','9632587410','M',NULL,NULL,0),(11,'Sanmay5','Antani5','s@gmail.com','8521479630','M',NULL,NULL,0),(12,'Sanmay','Antani','Sanm@gmail.com','6543219870','M',NULL,NULL,0),(13,'Ramesh','Patel','R@gmail.com','6321457891','M',NULL,NULL,0),(14,'Bina','Antani','B@gmail.com','9654781230','M',NULL,NULL,0),(15,'Prem','Trivedi','p@gmail.com','8521012021','M',NULL,NULL,0),(16,'abc','XYZ','abc@gmail.com','6547893210','M',NULL,NULL,0),(17,'Suresh','Patel','Su@gmail.com','9632587410','M',NULL,NULL,0),(18,'DEF','GHI','d@gmail.com','9876543210','M',NULL,NULL,0),(19,'jhb','vfyu','gkv@vkg','9876543210','M',NULL,NULL,0),(20,'jhbjk','kgjhv','vkjv@iu','9876543210','M',NULL,NULL,0),(21,'Sanmay','iyl','lyuhv@lhvb','9876543210','M',NULL,NULL,0),(22,'iojhn','jkbjb','jkub@jkb','9876543210','M','7e80f6e518fe01f4407648643b80765c','90',1),(23,'jkbb','klv','ljvjv@jhlvhlj','9876541590','M','e972181bc86c2485dab3fd9ac7cf1381','643',1),(24,'iuohgliu','gfiygu','hiybb@jhvb','9876543210','M','4e43ffb4dc29e199e850a4d3d73485f2','7203',1),(25,'lhbljhb','lhbl','jhlb@lhib','9876543210','M','005b4b700ddd92a01b10b8e185d75dac','64',1),(26,'ktfkf','yuf','ghfkvkG@jufvlu','9876543210','M',NULL,NULL,0),(27,'hello','hi','h@gmail.com','9876543210','M','001a937d1b784dffd8cc9fa51063e179','9863',1),(28,'Shivam','Rana','Shivam@gmail.com','9876543210','M','13baeadfca8d353f8db806e7a3ad4bb3','9630',1),(29,'Shivam','Rana','sh@gmail.com','9876543210','M','f674458e694ab7aae1b3c47f567439dc','1777',1),(30,'jkiuhb',';bi;','bHJKLb@hljkbl','9876543210','M',NULL,NULL,0),(31,'vvbjlhyv','jhlvjhlv','jhvj,@jlhbljv','9876543210','M',NULL,NULL,0),(32,'jhlylvbjlv','jhvgjhv','khgv@kvghvkh','9876543210','M',NULL,NULL,0),(33,'jkgvfkhugv','fkyutfuy','khyugtvf@kjvhk','9876543210','M',NULL,NULL,0),(34,'ygugyu','gfvyugf','ugf@jhlvjlhv','9876543210','M',NULL,NULL,0),(35,'iphgiug','iyg','hjlgb@ljbhbl','9876543210','M',NULL,NULL,0),(36,'jhlygvlyuj','gvljv','ljhvjhl@jhlvjhl','9876543210','M',NULL,NULL,0),(37,'YUGVYU','FGKYFG','JKHGVBJ@JHLB','9876543210','M',NULL,NULL,0),(38,'JKHYFK','YUKTFG','IYGGH@JHYGB','9876543210','M',NULL,NULL,0),(39,'JKHLIUGL','YU','GUYKJGV@JHB','9876543210','M',NULL,NULL,0),(40,'JKHGVJHGK','VJHGKVK','JKHGVV@JHV','9876543210','M',NULL,NULL,0),(41,'JHVKYU','VKUV','JHV@JHVBVHL','9786543210','M',NULL,NULL,0),(42,'IYG','JHLVB','JHKVBK@LJHB','9876543210','M',NULL,NULL,0),(43,'JHGV','OGILOYG','JLUHYGV@BLH','9876543210','M',NULL,NULL,0),(44,'HYGG','LIG','GHYL@LHJKB','9876543210','M',NULL,NULL,0),(45,'JVKHG','VHKGV','KHGV@KJHV','9876543210','M',NULL,NULL,0),(46,'IUGIUG','LGVBLU','JHVBJL@IHUB;','9876543210','M',NULL,NULL,0),(47,'ILGYUOG','LUGL','LHVBLV@LJHVBJ','9876543210','M',NULL,NULL,0),(48,'KYGUVFKHYGUT','VFKHYGUVFKG','HGKV@JHVJKV','8976543210','M',NULL,NULL,0),(49,'UYVFU','KVVGJHUV','KGV@JKVJ','9876543210','M',NULL,NULL,0),(50,'YUGU','UYVFK','KUJV@KJUVKJUV','9876543210','M',NULL,NULL,0),(51,'YUGL','YU','LLJUV@JHLVHLJ','9876543210','M',NULL,NULL,0),(52,'yigvl','lyugv','ljlhv@jhlvljv','9876543210','M',NULL,NULL,0),(53,'iyglgb','ljhvb','hljb@ljkhb','9876543210','M',NULL,NULL,0),(54,'jkjkb','bkljhb','jhbJ@jkbk;b','9876543210','M',NULL,NULL,0),(55,'ygvjliuv','jlhvlj','vjlhv@jhlvhjlv','9876543210','M',NULL,NULL,0),(56,'yuvlgjuv','jlhvg','vjv@hljuv','9876543210','M',NULL,NULL,0),(57,'jkhug','ygfjklyu','fvjkhgv@jhvhj','9876543210','M','d97f5c0d9b9b784c23fb00f3026b092a','9501',1),(58,'vuvluv','lvluv','lvljv@iug','9876543210','M','13f514ee9110489d519871dfcf040dfe','3254',1),(59,'bhjkb','jhvjkhv','vjv@jhvjh','9876543210','M','e8841249dba226bfd97fe91d41939000','6893',1),(60,'yugbjy','jhbjh','jhv@hbjh','9876543210','M',NULL,NULL,0),(61,'hgchg','cfku','hkgc@gvk','9876543210','M','fbf827ebcf1ec84128c2c718d8662545','9117',1),(62,'jhvb','jhlvvj','jhlv@jhlv','9876543210','M',NULL,NULL,0),(63,'iuolhnih','kjlihbnjkub','jkbjk@jkbjkb','9876543210','M',NULL,NULL,0),(64,'hgvm','vch','vhg@jkgvgjkhv','9876543210','M','cd234320b6212154c7d9df4d81d203c3','3931',1),(65,'Sanmay','Antani','sua@gmail.com','9876543210','M','2b3c8cab9c525e3b0e0cd8ce4505090b','5859',1),(66,'hgvj','vjhgkv','gvhkv@jlhvbhj','9876543210','M',NULL,NULL,0),(67,'boub','uovbugv','vivGV@vov','9876543210','M',NULL,NULL,0),(68,'ftvcf','htcfhyty','hgc@GHvh','9876543210','M',NULL,NULL,0);
/*!40000 ALTER TABLE `Users_Regs_Master` ENABLE KEYS */;
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

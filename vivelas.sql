-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: vivelas
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `idCli` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `idTipoCli` int DEFAULT '1',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idCli`),
  UNIQUE KEY `email` (`email`),
  KEY `idTipoCli` (`idTipoCli`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`idTipoCli`) REFERENCES `tipo_clientes` (`idTipoCli`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `urlImg` varchar(256) DEFAULT NULL,
  `deleted` tinyint DEFAULT NULL,
  `medida` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Bombe',11100.00,'https://i.postimg.cc/Wzcb5NtJ/bombe.png',0,'310'),(2,'Chiquitin',2900.00,'https://i.postimg.cc/tTx4dZRj/chiquitin.png',0,'42'),(3,'Lata',4400.00,'https://i.postimg.cc/MH0Z4Cj3/lata.png',0,'90'),(4,'Lolo',4500.00,'https://i.postimg.cc/pLLVG1Vk/lolo.png',0,'110'),(5,'Moon',4600.00,'https://i.postimg.cc/Nf4fxwt5/moon.png',0,'105'),(6,'Whisky sin tapa',6900.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'190'),(16,'nuevo',200.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'100'),(17,'otro',200.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'100'),(18,'prueba',200.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',NULL,'100'),(19,'hola',200.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',NULL,'100'),(20,'moon',1500.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',NULL,'300'),(21,'aa',32.03,NULL,NULL,'aaa');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_clientes`
--

DROP TABLE IF EXISTS `tipo_clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_clientes` (
  `idTipoCli` int NOT NULL AUTO_INCREMENT,
  `nombreTipo` varchar(50) NOT NULL,
  `descuento` decimal(5,2) DEFAULT '0.00',
  PRIMARY KEY (`idTipoCli`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_clientes`
--

LOCK TABLES `tipo_clientes` WRITE;
/*!40000 ALTER TABLE `tipo_clientes` DISABLE KEYS */;
INSERT INTO `tipo_clientes` VALUES (1,'Inicial',0.00),(2,'Medium',5.00),(3,'Premium',10.00);
/*!40000 ALTER TABLE `tipo_clientes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-09 17:53:29

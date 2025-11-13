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
  `nombreCli` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `idTipoCli` int DEFAULT '2',
  PRIMARY KEY (`idCli`),
  UNIQUE KEY `email` (`email`),
  KEY `idTipoCli` (`idTipoCli`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`idTipoCli`) REFERENCES `tipo_clientes` (`idTipoCli`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'lauti','ponce','amenabar','lauti@gmail.com','$2b$10$FwgRBHhMpMkci9wVM3YX3Omg3NIUJa/Kc1w3zpfWV9exNnFqAk7Ba','2025-10-10 14:15:55',2),(2,'el pepe ','jaja','9dejulio','lauti03@gmail.com','$2b$10$vqsAtQpHQWLeBEBKqaJiK.mW7C2qWASumtYiAJ5jst3ByQITpGt2m','2025-10-10 14:45:08',2),(3,'aaa','aaa','aaa','aaa@gmail.com','$2b$10$yINt.xYriHanb6tb83qKCOtARqCSsBxlGjEqw2OEa6tOwmz3Hxlhm','2025-10-10 15:34:17',3),(4,'pepe','pepe','pepe','pepe@gmail.com','$2b$10$D.G/ajWDF07sw6.S/HGkLecDFCKt/aHjH3QwoAVR8cCF6dT2951e.','2025-10-10 18:02:19',4);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_clientes`
--

LOCK TABLES `tipo_clientes` WRITE;
/*!40000 ALTER TABLE `tipo_clientes` DISABLE KEYS */;
INSERT INTO `tipo_clientes` VALUES (1,'Admin',0.00),(2,'Inicial','0.00'),(3,'Medium',5.00),(4,'Premium',10.00);
/*!40000 ALTER TABLE `tipo_clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `idProd` int NOT NULL AUTO_INCREMENT,
  `nombreProd` varchar(100) NOT NULL,
  `precioProd` decimal(10,2) NOT NULL,
  `urlImg` varchar(256) DEFAULT NULL,
  `deleted` tinyint DEFAULT NULL,
  `medida` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idProd`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Bombe',11100.00,'https://i.postimg.cc/Wzcb5NtJ/bombe.png',0,'310'),(2,'Chiquitin',2900.00,'https://i.postimg.cc/tTx4dZRj/chiquitin.png',0,'42'),(3,'Lata',4400.00,'https://i.postimg.cc/MH0Z4Cj3/lata.png',0,'90'),(4,'Lolo',4500.00,'https://i.postimg.cc/pLLVG1Vk/lolo.png',0,'110'),(5,'Moon',4600.00,'https://i.postimg.cc/Nf4fxwt5/moon.png',0,'105'),(6,'Whisky sin tapa',6900.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'190'),(7,'otro',200.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'100'),(8,'prueba',200.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'100'),(9,'hola',200.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'100'),(10,'moon',1500.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'300'),(11,'nuevo',200.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'100'),(12,'aa',32.03,null,0,'aaa');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `descuentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE descuentos (
  `idDesc` int NOT NULL AUTO_INCREMENT,
  `porcentaje` DECIMAL(5,2) NOT NULL,
  `fechaDesde` DATE NOT NULL,
  `fechaHasta` DATE NOT NULL,
  PRIMARY KEY (`idDesc`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `descuentos`
--

LOCK TABLES `descuentos` WRITE;
/*!40000 ALTER TABLE `descuentos` DISABLE KEYS */;
INSERT INTO `descuentos` VALUES (1,10.00,'2025-10-14','2026-01-01'),(2,15.00,'2025-10-14','2026-01-01'),(3,20.00,'2025-10-14','2026-01-01'),(4,25.00,'2025-10-14','2026-01-01');
/*!40000 ALTER TABLE `descuentos` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `productos_descuentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos_descuentos` (
  `idProd` INT NOT NULL,
  `idDesc` INT NOT NULL,
  KEY `idProd` (`idProd`),
  KEY `idDesc` (`idDesc`),
  PRIMARY KEY (`idProd`, `idDesc`),
  CONSTRAINT `productos_descuentos_ibfk_1` FOREIGN KEY (`idProd`) REFERENCES `productos` (`idProd`),
  CONSTRAINT `productos_descuentos_ibfk_2` FOREIGN KEY (`idDesc`) REFERENCES `descuentos` (`idDesc`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `descuentos`
--

LOCK TABLES `productos_descuentos` WRITE;
/*!40000 ALTER TABLE `productos_descuentos` DISABLE KEYS */;
INSERT INTO `productos_descuentos` VALUES (1,1),(2,1),(3,2);
/*!40000 ALTER TABLE `productos_descuentos` ENABLE KEYS */;
UNLOCK TABLES;
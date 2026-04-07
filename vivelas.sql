-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: vivelas
-- ------------------------------------------------------
-- Server version	8.0.45

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
  `apellido` varchar(100) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `creado_en` timestamp NOT NULL,
  `idTipoCli` int NOT NULL,
  PRIMARY KEY (`idCli`),
  UNIQUE KEY `IDX_3cd5652ab34ca1a0a2c7a25531` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'lauti','ponce','amenabar','lauti@gmail.com','$2b$10$FwgRBHhMpMkci9wVM3YX3Omg3NIUJa/Kc1w3zpfWV9exNnFqAk7Ba','2025-10-10 14:15:55',2),(2,'el pepe ','jaja','9dejulio','lauti03@gmail.com','$2b$10$vqsAtQpHQWLeBEBKqaJiK.mW7C2qWASumtYiAJ5jst3ByQITpGt2m','2025-10-10 14:45:08',2),(3,'aaa','aaa','aaa','aaa@gmail.com','$2b$10$yINt.xYriHanb6tb83qKCOtARqCSsBxlGjEqw2OEa6tOwmz3Hxlhm','2025-10-10 15:34:17',3),(4,'pepe','pepe','pepe','pepe@gmail.com','$2b$10$D.G/ajWDF07sw6.S/HGkLecDFCKt/aHjH3QwoAVR8cCF6dT2951e.','2025-10-10 18:02:19',4),(5,'Victoria','Caracchi','a','vickypau1d@gmail.com','$2b$10$b8PAe9spelRTgKL7rh8hgu.uhk6FfmmHxBLMVoGC.zg/ZXEucVnWy','2026-03-21 13:42:04',1);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `descuentos`
--

DROP TABLE IF EXISTS `descuentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `descuentos` (
  `idDesc` int NOT NULL AUTO_INCREMENT,
  `porcentaje` decimal(5,2) NOT NULL,
  `fechaDesde` date NOT NULL,
  `fechaHasta` date NOT NULL,
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

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `idPedido` int NOT NULL AUTO_INCREMENT,
  `fechaPedido` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estadoPedido` varchar(50) NOT NULL,
  `formaEntrega` varchar(30) DEFAULT NULL,
  `medioPago` varchar(30) DEFAULT NULL,
  `montoTotal` decimal(10,2) DEFAULT NULL,
  `montoPagado` decimal(10,2) DEFAULT NULL,
  `vuelto` decimal(10,2) DEFAULT NULL,
  `idCli` int NOT NULL,
  PRIMARY KEY (`idPedido`),
  KEY `FK_99d99882ba54e6bb488c973305d` (`idCli`),
  CONSTRAINT `FK_99d99882ba54e6bb488c973305d` FOREIGN KEY (`idCli`) REFERENCES `clientes` (`idCli`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos_productos`
--

DROP TABLE IF EXISTS `pedidos_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos_productos` (
  `idPedido` int NOT NULL,
  `idProd` int NOT NULL,
  `cantidadProdPed` int NOT NULL,
  PRIMARY KEY (`idPedido`,`idProd`),
  KEY `FK_2cc1ac278b94186facd83537a3f` (`idProd`),
  CONSTRAINT `FK_2cc1ac278b94186facd83537a3f` FOREIGN KEY (`idProd`) REFERENCES `productos` (`idProd`) ON DELETE CASCADE,
  CONSTRAINT `FK_ab69eec2df152952fd215182583` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`idPedido`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos_productos`
--

LOCK TABLES `pedidos_productos` WRITE;
/*!40000 ALTER TABLE `pedidos_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos_productos` ENABLE KEYS */;
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
  `deleted` tinyint NOT NULL DEFAULT '0',
  `medida` varchar(45) DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `encargo` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`idProd`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Bombe',11100.00,'https://i.postimg.cc/Wzcb5NtJ/bombe.png',0,'310',3,0),(2,'Chiquitin',2900.00,'https://i.postimg.cc/tTx4dZRj/chiquitin.png',1,'42',10,0),(3,'Lata',4400.00,'https://i.postimg.cc/MH0Z4Cj3/lata.png',0,'90',6,0),(4,'Lolo',4500.00,'https://i.postimg.cc/pLLVG1Vk/lolo.png',0,'110',3,0),(5,'Moon',4600.00,'https://i.postimg.cc/Nf4fxwt5/moon.png',0,'105',2,0),(6,'Whisky sin tapa',6900.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'190',0,0),(7,'otro',200.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'100',0,0),(8,'prueba',200.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'100',0,0),(9,'hola',200.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'100',0,0),(10,'moon',1500.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'300',0,0),(11,'nuevo',200.00,'https://i.postimg.cc/kgYJkFBC/whisky.png',0,'100',0,0),(13,'aaa',100.00,'/fotosProductos/1774102214502-628689941.png',0,'10',10,0);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos_descuentos`
--

DROP TABLE IF EXISTS `productos_descuentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos_descuentos` (
  `idProd` int NOT NULL,
  `idDesc` int NOT NULL,
  PRIMARY KEY (`idProd`,`idDesc`),
  KEY `FK_a5088bb82aa5e6c24bb7806594c` (`idDesc`),
  CONSTRAINT `FK_69afe69e74eb1400b6f23273464` FOREIGN KEY (`idProd`) REFERENCES `productos` (`idProd`) ON DELETE CASCADE,
  CONSTRAINT `FK_a5088bb82aa5e6c24bb7806594c` FOREIGN KEY (`idDesc`) REFERENCES `descuentos` (`idDesc`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos_descuentos`
--

LOCK TABLES `productos_descuentos` WRITE;
/*!40000 ALTER TABLE `productos_descuentos` DISABLE KEYS */;
INSERT INTO `productos_descuentos` VALUES (1,1),(2,1),(3,2);
/*!40000 ALTER TABLE `productos_descuentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_clientes`
--

DROP TABLE IF EXISTS `tipo_clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_clientes` (
  `idTipoCli` int NOT NULL AUTO_INCREMENT,
  `nombreTipo` varchar(100) NOT NULL,
  `descuento` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`idTipoCli`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_clientes`
--

LOCK TABLES `tipo_clientes` WRITE;
/*!40000 ALTER TABLE `tipo_clientes` DISABLE KEYS */;
INSERT INTO `tipo_clientes` VALUES (1,'admin',0),(2,'inicial',0),(3,'intermedio',5),(4,'premium',10);
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

-- Dump completed on 2026-03-21 11:15:33

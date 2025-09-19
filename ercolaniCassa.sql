-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Creato il: Set 19, 2025 alle 17:10
-- Versione del server: 8.0.36-0ubuntu0.22.04.1
-- Versione PHP: 8.1.2-1ubuntu2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ercolaniCassa`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `catalog`
--

CREATE TABLE `catalog` (
  `id` int UNSIGNED NOT NULL,
  `descrizione` varchar(64) NOT NULL,
  `valore` varchar(10) NOT NULL,
  `custom` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Struttura della tabella `pdf`
--

CREATE TABLE `pdf` (
  `id` int NOT NULL,
  `shipment_id` int NOT NULL,
  `pdf` varchar(64) NOT NULL,
  `is_new` tinyint NOT NULL,
  `creato` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cancellato` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Struttura della tabella `shipdetails`
--

CREATE TABLE `shipdetails` (
  `id` int UNSIGNED NOT NULL,
  `shipment_id` int NOT NULL,
  `catalog_id` int NOT NULL,
  `qty` int NOT NULL,
  `price` decimal(20,0) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Struttura della tabella `shipments`
--

CREATE TABLE `shipments` (
  `id` int UNSIGNED NOT NULL,
  `track` varchar(16) NOT NULL,
  `nome` varchar(32) NOT NULL,
  `cognome` varchar(32) NOT NULL,
  `indirizzo` varchar(32) NOT NULL,
  `citta` varchar(32) NOT NULL,
  `cap` varchar(10) NOT NULL,
  `nazione` varchar(32) NOT NULL,
  `telefono` varchar(32) NOT NULL,
  `email` varchar(64) NOT NULL,
  `prov` varchar(10) NOT NULL,
  `nascita` varchar(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `catalog`
--
ALTER TABLE `catalog`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `pdf`
--
ALTER TABLE `pdf`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `shipdetails`
--
ALTER TABLE `shipdetails`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `shipments`
--
ALTER TABLE `shipments`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `catalog`
--
ALTER TABLE `catalog`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `pdf`
--
ALTER TABLE `pdf`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `shipdetails`
--
ALTER TABLE `shipdetails`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `shipments`
--
ALTER TABLE `shipments`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

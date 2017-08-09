CREATE DATABASE `kidtracker`;
USE `kidtracker`;

CREATE TABLE `Action` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  `familyId` int(11) unsigned DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `icon` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`) USING BTREE,
  KEY `family` (`familyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ActionLog` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  `actionId` int(11) NOT NULL,
  `kidId` int(11) unsigned NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `weekId` int(11) unsigned DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `notes` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `kid` (`kidId`,`weekId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Family` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `timezone` varchar(100) DEFAULT 'EST5EDT',
  `theme` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Kid` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  `userId` int(11) unsigned DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `familyId` int(11) unsigned DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `age` tinyint(4) DEFAULT NULL,
  `icon` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `family` (`familyId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `User` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT NULL,
  `name` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `emailConfirm` varchar(6) DEFAULT NULL,
  `hash` varchar(32) DEFAULT NULL,
  `familyId` int(11) unsigned DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `loginAttempts` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


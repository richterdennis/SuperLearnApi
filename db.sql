-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Struktur von Tabelle superlearn.answers
CREATE TABLE IF NOT EXISTS `answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `correct` tinyint(1) NOT NULL DEFAULT '0',
  `text` varchar(50) NULL DEFAULT NULL,
  `question_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.app
CREATE TABLE IF NOT EXISTS `app` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(32) NOT NULL,
  `text` varchar(50) NOT NULL,
  `valid` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.logins
CREATE TABLE IF NOT EXISTS `logins` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `device_id` varchar(50) NOT NULL,
  `token` varchar(250) NOT NULL,
  `expires` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.medals
CREATE TABLE IF NOT EXISTS `medals` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `text` varchar(150) NOT NULL,
  `bronze` int(10) unsigned NOT NULL,
  `silver` int(10) unsigned NOT NULL,
  `gold` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.modules
CREATE TABLE IF NOT EXISTS `modules` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `short` varchar(4) NOT NULL,
  `long` varchar(150) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.modules_user_rel
CREATE TABLE IF NOT EXISTS `modules_user_rel` (
  `module_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `status` TINYINT(1) UNSIGNED NOT NULL DEFAULT '0' COMMENT '0:default 1:fav 2:passed',
  `level` INT(10) UNSIGNED NOT NULL DEFAULT '0',
  `exp` INT(10) UNSIGNED NOT NULL DEFAULT '0',
  `reached_milestones` INT(10) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`module_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.pwd_resets
CREATE TABLE IF NOT EXISTS `pwd_resets` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `reset_token` varchar(250) NOT NULL,
  `destination` varchar(150) NOT NULL,
  `expires` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.questions
CREATE TABLE IF NOT EXISTS `questions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `text` varchar(250) NOT NULL,
  `image` varchar(150) DEFAULT NULL,
  `score` int(11) NOT NULL DEFAULT '0',
  `question_type_id` int(10) unsigned NOT NULL COMMENT '1:boolean, 2:four, 3:exact',
  `module_id` int(10) unsigned NOT NULL,
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_type_id` (`question_type_id`),
  KEY `module_id` (`module_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.questions_question_tags_rel
CREATE TABLE IF NOT EXISTS `questions_question_tags_rel` (
  `question_id` int(10) unsigned NOT NULL,
  `question_tag_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`question_id`,`question_tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.question_tags
CREATE TABLE IF NOT EXISTS `question_tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `text` varchar(50) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.reports
CREATE TABLE IF NOT EXISTS `reports` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `report_type_id` int(10) unsigned NOT NULL COMMENT '1:offensive, 2:duplicate, 3:spelling, 4:troll, 5:other',
  `text` varchar(250) NOT NULL,
  `processed` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `question_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `report_type_id` (`report_type_id`),
  KEY `question_id` (`question_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.rounds
CREATE TABLE IF NOT EXISTS `rounds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `module_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `state` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `module_id` (`module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.solutions
CREATE TABLE IF NOT EXISTS `solutions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `text` varchar(150) NOT NULL,
  `image` varchar(150) DEFAULT NULL,
  `question_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.studies_courses
CREATE TABLE IF NOT EXISTS `studies_courses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `text` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.studies_courses_modules_rel
CREATE TABLE IF NOT EXISTS `studies_courses_modules_rel` (
  `studies_course_id` int(10) unsigned NOT NULL,
  `semester` tinyint(3) unsigned DEFAULT '1',
  `module_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`studies_course_id`,`module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `image` varchar(150) DEFAULT NULL,
  `score` int(11) NOT NULL DEFAULT '0',
  `rank_id` int(10) unsigned NOT NULL COMMENT '1:student, 2:admin, 3:prof, 4:lecturer',
  `confirmed` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `banned` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `rank_id` (`rank_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.user_medals_rel
CREATE TABLE IF NOT EXISTS `user_medals_rel` (
  `user_id` int(10) unsigned NOT NULL,
  `medal_id` int(10) unsigned NOT NULL,
  `value` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`,`medal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.user_questions_rel
CREATE TABLE IF NOT EXISTS `user_questions_rel` (
  `user_id` int(10) unsigned NOT NULL,
  `question_id` int(10) unsigned NOT NULL,
  `star_counter` int(10) unsigned NOT NULL DEFAULT '0',
  `max_star_counter` int(10) unsigned NOT NULL DEFAULT '0',
  `answered_counter` int(10) unsigned NOT NULL DEFAULT '0',
  `wrong_counter` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`,`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.user_studies_courses_rel
CREATE TABLE IF NOT EXISTS `user_studies_courses_rel` (
  `user_id` int(10) unsigned NOT NULL,
  `studies_course_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`studies_course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.votings
CREATE TABLE IF NOT EXISTS `votings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `score` tinyint(4) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.votings_questions_rel
CREATE TABLE IF NOT EXISTS `votings_questions_rel` (
  `voting_id` int(10) unsigned NOT NULL,
  `question_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`voting_id`,`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Struktur von Tabelle superlearn.votings_user_rel
CREATE TABLE IF NOT EXISTS `votings_user_rel` (
  `voting_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`voting_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/* 
 * SQL file for preparing acNotes running on MySql/MadriaDB (Delta) 
 * Version: 0.5
 * Created: 2015/05/16
 * (C) Copyright by Alva Chien, 2014 - 2016
 *
 */

/*======================================================
    Tables 
  ====================================================== */

-- User part
CREATE TABLE IF NOT EXISTS `t_user` (
  `USER` varchar(25) NOT NULL,
  `ALIAS` varchar(50) NOT NULL,
  `PASSWORD` varchar(150) NOT NULL,
  `CREATEDON` datetime NOT NULL,
  `OTHER` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`USER`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='User';

-- User part
CREATE TABLE IF NOT EXISTS `t_user_log` (
  `USER` varchar(25) NOT NULL,
  `SEQNO` int(11) NOT NULL,
  `LOGTYPE` varchar(1) NOT NULL,
  `STARTPOINT` datetime NOT NULL,
  `OTHERS` varchar(50) NOT NULL,
  PRIMARY KEY (`USER`, `SEQNO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='User Log';

-- Note part
CREATE TABLE IF NOT EXISTS `t_note` (
  `ID` varchar(32) NOT NULL,
  `NAME` varchar(50) NOT NULL,
  `CONTENT` text NOT NULL,
  `PARID` varchar(32) NOT NULL,
  `TAGS` varchar(50) NOT NULL,
  `CREATEDAT` datetime NOT NULL,
  `LASTCHGEDAT` datetime NOT NULL,
  `CREATEDBY` datetime NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Note';

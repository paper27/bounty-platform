Storage 1byte(s) = 8bit(s) | A bit can be either 0 or 1

MySQL Data Types:
Integers: TINYINT | SMALLINT | MEDIUMINT | INT | BIGINT (any other variants are just aliases)

eg to create integer with no neg values: SMALLINT UNSIGNED

Strings: CHAR | VARCHAR | BINARY | VARBINARY | BLOB | TEXT | ENUM | SET

TEXT: TINYTEXT (max 255 char) | TEXT (max 65,535 char) | MEDIUMTEXT (max 16MB) | LONGTEXT (max 4GB)

address CHAR(42) - non case sensitive | ref: https://support.metamask.io/hc/en-us/articles/4702972178459-The-Ethereum-address-format-and-why-it-matters-when-using-MetaMask#:~:text=On%20Ethereum%20and%20other%20networks,re%20also%20not%20case%20sensitive.

nonce INT UNSIGNED

details TEXT

createdAt DATETIME (so can sort latest at frontend)

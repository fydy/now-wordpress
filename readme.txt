请使用稳定版：now-wordpress@1.3.25

Please use the stable version: now-wordpress@1.3.25

基于now平台搭建wordpress.

## 使用方法：

- 安装nodejs环境，推荐使用NVM安装

- 安装now

```
npm i -g now@latest
```

- 创建MYSQL数据库信息，我使用的市AWS RDS

- 创建wp-config.php，并配置数据库信息，数据库信息在now.json中直接填写配置，或者使用`now secret add`

```
<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', $_ENV['DB_NAME']);

/** MySQL database username */
define('DB_USER', $_ENV['DB_USER']);

/** MySQL database password */
define('DB_PASSWORD', $_ENV['DB_PASSWORD']);

/** MySQL hostname */
define('DB_HOST', $_ENV['DB_HOST']);

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'WPSALT');
define('SECURE_AUTH_KEY',  'WPSALT');
define('LOGGED_IN_KEY',    'WPSALT');
define('NONCE_KEY',        'WPSALT');
define('AUTH_SALT',        'WPSALT');
define('SECURE_AUTH_SALT', 'WPSALT');
define('LOGGED_IN_SALT',   'WPSALT');
define('NONCE_SALT',       'WPSALT');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

define( 'WP_SITEURL', 'https://' . $_SERVER['HTTP_HOST'] );
define( 'WP_HOME', 'https://' . $_SERVER['HTTP_HOST'] );
define( 'WP_CONTENT_URL', 'https://' . $_SERVER['HTTP_HOST'] . '/wp-content' );

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
        define('ABSPATH', dirname(__FILE__) . '/');

// define( 'MYSQL_SSL_CA', ABSPATH . 'ca.pem' );
// define( 'MYSQL_CLIENT_FLAGS', MYSQLI_CLIENT_SSL );

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
```

- 创建now.json

```
{
  "version": 2,
  "builds": [
    { "src": "wp-config.php", "use": "@now-wordpress@1.3.25" }
  ],
  "routes": [
    { "src": "/wp-admin/?", "dest": "index.php" },
    { "src": ".*\\.php$", "dest": "index.php" }
  ],
  "env": {
    "DB_NAME": "@wordpress_db_name",
    "DB_USER": "@wordpress_db_user",
    "DB_PASSWORD": "@wordpress_db_password",
    "DB_HOST": "@wordpress_db_host"
  }
}
```

- 现在文件准备好了，运行`now login`命令登录

- 运行`now dev`本地测试，或者运行`now`直接部署到now平台

PHP版本：php7.3.12

已启用的PHP扩展：
Core, date, libxml, openssl, pcre, zlib, filter, hash, Reflection, SPL, session, standard, cgi-fcgi, bcmath, bz2, calendar, ctype, curl, dom, mbstring, fileinfo, ftp, gd, gettext, iconv, imap, intl, json, exif, mcrypt, mysqlnd, PDO, pgsql, Phar, SimpleXML, soap, sockets, sodium, sqlite3, tokenizer, xml, xmlwriter, xsl, mysqli, pdo_mysql, pdo_pgsql, pdo_sqlite, xmlreader, xmlrpc, apcu, ds, phalcon, swoole, Zend OPcache

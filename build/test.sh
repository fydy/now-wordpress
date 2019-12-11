mkdir -p /root/app/modules
cp /usr/bin/php /root/app/php
cp /usr/sbin/php-fpm /root/app/php-fpm
cp /usr/lib64/php/modules/* /root/app/modules
cp /usr/lib64/libgd.so.3 /root/app/modules
cp /usr/lib64/libX11.so.6 /root/app/modules
cp /usr/lib64/libXpm.so.4 /root/app/modules
cp /usr/lib64/libpng12.so.0 /root/app/modules
cp /usr/lib64/libjpeg.so.62 /root/app/modules
cp /usr/lib64/libfreetype.so.6 /root/app/modules
cp /usr/lib64/libfontconfig.so.1 /root/app/modules
rm -rf $(which php)
rm -rf $(which php-fpm)
rm -rf /usr/lib64/php
rm -rf /usr/lib64/mysql
rm -rf /usr/lib64/libgd.so.3
rm -rf /usr/lib64/libX11.so.6
rm -rf /usr/lib64/libXpm.so.4
rm -rf /usr/lib64/libpng12.so.0
rm -rf /usr/lib64/libjpeg.so.62
rm -rf /usr/lib64/libfreetype.so.6
rm -rf /usr/lib64/libfontconfig.so.1
rm -rf /etc/php.d
./php-fpm --help
./php -c php.ini test.php
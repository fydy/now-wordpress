FROM library/centos:6.8
ARG PHP_VERSION=73
ARG PHALCON_VERSION=3.4.5

RUN yum -y install wget git gcc make file
RUN yum install -y yum-utils epel-release which
RUN yum -y install -y http://rpms.famillecollet.com/enterprise/remi-release-6.rpm
RUN yum-config-manager --enable remi-php$PHP_VERSION
RUN yum --enablerepo=remi-safe -y install \
	    php \
	    php-devel \
	    php-cli \
	    php-fpm \
	    php-opcache \
	    php-common \
	    php-mcrypt \
	    php-gd \
	    php-xml \
	    php-mysqli \
	    php-mbstring \
	    php-tokenizer \
	    php-zip \
	    php-imap \
	    php-apcu \
        php-bcmath \
        php-cgi \
        php-ds \
        php-intl \
        php-json \
        php-mbstring \
        php-mysqlnd \
        php-opcache \
        php-pdo \
        php-pgsql \
        php-soap \
        php-sodium \
        php-swoole \
        php-tokenizer \
        php-xmlrpc

RUN yum install --enablerepo=remi --enablerepo=remi-php73 php-xml

RUN yum -y install patchelf gdb

RUN curl -L -O http://ftp.gnu.org/gnu/autoconf/autoconf-2.69.tar.gz && \
    tar zxf autoconf-2.69.tar.gz && \
    cd autoconf-2.69 && \
    yum install -y openssl-devel && \
    ./configure && make && make install

RUN wget https://nih.at/libzip/libzip-1.2.0.tar.gz && tar -zxvf libzip-1.2.0.tar.gz && cd libzip-1.2.0 && ./configure && make && make install

RUN wget https://github.com/phalcon/cphalcon/archive/v$PHALCON_VERSION.tar.gz && tar zxf v$PHALCON_VERSION.tar.gz
RUN cd cphalcon-$PHALCON_VERSION/build && ./install

RUN mkdir -p /root/app/public

WORKDIR /root/app
COPY ./php-modules.conf /root/app/php-modules.conf
COPY ./php.ini /root/app/php.ini
COPY ./php-fpm.ini /root/app/php-fpm.ini
COPY ./test.php /root/app/test.php
COPY ./test.sh /root/app/test.sh
COPY ./php-modules.php /root/app/php-modules.php
RUN php php-modules.php

RUN patchelf --set-rpath '$ORIGIN' /usr/bin/php
RUN patchelf --set-rpath '$ORIGIN' /usr/sbin/php-fpm
RUN patchelf --set-rpath '$ORIGIN' /usr/lib64/php/modules/mysqli.so
RUN patchelf --set-rpath '$ORIGIN' /usr/lib64/php/modules/mysqlnd.so
RUN patchelf --set-rpath '$ORIGIN' /usr/lib64/php/modules/mcrypt.so
RUN patchelf --set-rpath '$ORIGIN' /usr/lib64/php/modules/gd.so
RUN patchelf --set-rpath '$ORIGIN' /usr/lib64/libfreetype.so.6
RUN patchelf --set-rpath '$ORIGIN' /usr/lib64/libgd.so.3

CMD ["/bin/bash", "test.sh"]

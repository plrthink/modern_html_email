Morden html email workflow
-------------
####setup

    gem install premailer nokogiri
    npm install -g gulp bower
    cd /path/to/your/folder
    npm install
    bower install

####write some code

    gulp watch

####for production

    gulp
    gulp premailer

then index.html in dest folder is what you want.

####todo

* more fancy style
* become a yeoman generator

waiting for your pull request~
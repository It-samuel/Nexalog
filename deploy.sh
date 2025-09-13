sudo chown -R nexalog:nexalog /home/nexalog/Nexalog

npm run build
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/

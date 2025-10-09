echo "updating..."

ssh kop << EOF
    . ~/.nvm/nvm.sh
    echo "Going to directory..."
    cd /var/www/projectname
    echo "Pulling new code..."
    git pull
    echo "Done pulling code..."

    echo "Restarting server..."
    pm2 restart projectname
    pm2 save
EOF

echo "Done updating..."


#!/bin/bash
# Commands to configure nginx with SSL for api.feelyourvybe.com

echo "🔧 Configuring nginx with SSL for api.feelyourvybe.com..."

# 1. Create the nginx site configuration
sudo tee /etc/nginx/sites-available/api.feelyourvybe.com > /dev/null << 'EOF'
server {
    listen 80;
    server_name api.feelyourvybe.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.feelyourvybe.com;

    # SSL Configuration - Let's Encrypt certificates
    ssl_certificate /etc/letsencrypt/live/api.feelyourvybe.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.feelyourvybe.com/privkey.pem;
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # CORS Headers for API
    add_header Access-Control-Allow-Origin "https://feelyourvybe.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
    add_header Access-Control-Allow-Credentials "true" always;

    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin "https://feelyourvybe.com";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With";
        add_header Access-Control-Allow-Credentials "true";
        add_header Access-Control-Max-Age 86400;
        add_header Content-Type "text/plain charset=UTF-8";
        add_header Content-Length 0;
        return 204;
    }

    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Logging
    access_log /var/log/nginx/api.feelyourvybe.com.access.log;
    error_log /var/log/nginx/api.feelyourvybe.com.error.log;
}
EOF

# 2. Enable the site
sudo ln -sf /etc/nginx/sites-available/api.feelyourvybe.com /etc/nginx/sites-enabled/

# 3. Remove default nginx site if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# 4. Test nginx configuration
sudo nginx -t

# 5. If test passes, reload nginx
if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid. Reloading nginx..."
    sudo systemctl reload nginx
    echo "🚀 Nginx reloaded successfully!"
    echo ""
    echo "🔍 Testing HTTPS endpoint..."
    curl -I https://api.feelyourvybe.com/health
else
    echo "❌ Nginx configuration test failed. Please check the configuration."
    exit 1
fi

echo ""
echo "🎉 SSL configuration complete!"
echo "Your API should now be accessible at: https://api.feelyourvybe.com"

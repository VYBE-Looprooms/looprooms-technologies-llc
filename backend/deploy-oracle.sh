#!/bin/bash
# Oracle Cloud VPS Deployment Script for VYBE LOOPROOMS™ Backend

echo "🚀 Starting VYBE LOOPROOMS™ Backend deployment on Oracle Cloud VPS..."

# Update system
sudo yum update -y

# Install Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install git if not already installed
sudo yum install -y git

# Clone repository (replace with your repo URL)
git clone https://github.com/VYBE-Looprooms/looprooms-technologies-llc.git
cd looprooms-technologies-llc/backend

# Install dependencies
npm install --production

# Copy environment file
cp .env.production .env

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure firewall for port 3003
sudo firewall-cmd --permanent --add-port=3003/tcp
sudo firewall-cmd --reload

# Install and configure nginx as reverse proxy
sudo yum install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

echo "✅ Backend deployment completed!"
echo "🌐 Backend should be accessible at http://your-oracle-ip:3003"

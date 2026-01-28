#!/bin/bash
# TrendiMovies Server Setup Script for Contabo

set -e

echo "=== TrendiMovies Server Setup ==="

# Install Docker Compose plugin
echo "Installing Docker Compose..."
apt-get update
apt-get install -y docker-compose-plugin

# Verify installation
docker compose version

# Install git if not present
apt-get install -y git

# Create app directory
mkdir -p /var/www/trendimovies
cd /var/www/trendimovies

echo "Server setup complete!"

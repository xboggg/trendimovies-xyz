#!/bin/bash

# TrendiMovies Deployment Script for Contabo VPS
# Usage: ./deploy.sh [build|start|stop|restart|logs|ssl]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | xargs)
fi

# Check required environment variables
check_env() {
    if [ -z "$TMDB_API_KEY" ]; then
        echo -e "${RED}Error: TMDB_API_KEY is not set${NC}"
        echo "Please create a .env file with your TMDB API key"
        exit 1
    fi
}

# Build the Docker image
build() {
    echo -e "${GREEN}Building TrendiMovies...${NC}"
    check_env
    docker-compose build --no-cache
    echo -e "${GREEN}Build complete!${NC}"
}

# Start the application
start() {
    echo -e "${GREEN}Starting TrendiMovies...${NC}"
    check_env
    docker-compose up -d
    echo -e "${GREEN}TrendiMovies is now running!${NC}"
    echo -e "Visit: ${YELLOW}https://trendimovies.xyz${NC}"
}

# Stop the application
stop() {
    echo -e "${YELLOW}Stopping TrendiMovies...${NC}"
    docker-compose down
    echo -e "${GREEN}TrendiMovies stopped${NC}"
}

# Restart the application
restart() {
    echo -e "${YELLOW}Restarting TrendiMovies...${NC}"
    docker-compose restart
    echo -e "${GREEN}TrendiMovies restarted${NC}"
}

# View logs
logs() {
    docker-compose logs -f --tail=100
}

# Setup SSL with Let's Encrypt
setup_ssl() {
    echo -e "${GREEN}Setting up SSL with Let's Encrypt...${NC}"

    # Create SSL directory
    mkdir -p nginx/ssl

    # Install certbot if not present
    if ! command -v certbot &> /dev/null; then
        echo "Installing certbot..."
        apt-get update
        apt-get install -y certbot
    fi

    # Get certificate
    certbot certonly --standalone \
        -d trendimovies.xyz \
        -d www.trendimovies.xyz \
        --non-interactive \
        --agree-tos \
        --email admin@trendimovies.xyz

    # Copy certificates to nginx directory
    cp /etc/letsencrypt/live/trendimovies.xyz/fullchain.pem nginx/ssl/
    cp /etc/letsencrypt/live/trendimovies.xyz/privkey.pem nginx/ssl/

    echo -e "${GREEN}SSL setup complete!${NC}"
}

# Update application
update() {
    echo -e "${GREEN}Updating TrendiMovies...${NC}"
    git pull origin main
    build
    restart
    echo -e "${GREEN}Update complete!${NC}"
}

# Show status
status() {
    docker-compose ps
}

# Show help
help() {
    echo "TrendiMovies Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build    Build Docker image"
    echo "  start    Start the application"
    echo "  stop     Stop the application"
    echo "  restart  Restart the application"
    echo "  logs     View application logs"
    echo "  ssl      Setup SSL with Let's Encrypt"
    echo "  update   Pull latest code and rebuild"
    echo "  status   Show container status"
    echo "  help     Show this help message"
}

# Main command handler
case "$1" in
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs
        ;;
    ssl)
        setup_ssl
        ;;
    update)
        update
        ;;
    status)
        status
        ;;
    help|--help|-h)
        help
        ;;
    *)
        echo -e "${YELLOW}Usage: ./deploy.sh [build|start|stop|restart|logs|ssl|update|status|help]${NC}"
        exit 1
        ;;
esac

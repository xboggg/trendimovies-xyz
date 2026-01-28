# TrendiMovies Admin Access

## Admin Login Credentials

**URL:** https://trendimovies.xyz/login

**Email:** admin@trendimovies.xyz
**Password:** Admin@2025

## Important Notes

1. **Change Password:** Please change this password after your first login
2. **Admin Panel:** After logging in, access the admin panel at https://trendimovies.xyz/admin
3. **Features Available:**
   - Manage news articles
   - AI-powered news generation
   - Manage franchises
   - Manage curated lists
   - User management (coming soon)

## User Roles

- **admin** - Full access to all features
- **editor** - Can manage content but not system settings
- **user** - Regular user with watchlist and favorites

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- POST `/api/auth/logout` - User logout
- GET `/api/auth/me` - Get current user session

### News Management
- POST `/api/news/fetch` - AI-powered news generation (admin only)

## Database Tables

### users
- Stores user accounts with bcrypt-hashed passwords
- Roles: user, editor, admin
- Status: active, inactive, suspended

### news_articles
- News content with AI generation tracking
- Categories: entertainment, movies, tv, streaming, celebrity
- Status: draft, pending, published, archived

### franchises
- Movie franchises (MCU, Star Wars, etc.)
- Linked to TMDB collections

### curated_lists
- Best-of lists, awards, recommendations
- Custom movie/TV show collections

## Security Features

- HTTP-only session cookies
- Bcrypt password hashing
- Role-based access control
- HTTPS enforced
- XSS protection headers
- CSRF protection (coming soon)

---

**Need Help?** Contact the development team or check the documentation.

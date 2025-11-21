# XR Labs Deployment Guide

**Complete deployment and testing guide for the Extended Reality (VR/AR/MR) platform**

---

## 📋 Overview

This guide covers the complete deployment process for the EUREKA XR Labs platform, including:
- Database setup
- Backend service deployment
- Frontend integration
- VR/AR device testing
- Production optimization
- Monitoring and maintenance

---

## 🎯 Prerequisites

### Required Software

- **Node.js**: 18.x or higher
- **PostgreSQL**: 14.x or higher with pgvector extension
- **npm or yarn**: Latest version
- **AWS Account**: For S3 storage
- **SSL Certificate**: For HTTPS (required for WebXR)

### Optional (for testing)

- **VR Headset**: Meta Quest, HTC Vive, or Valve Index
- **Mobile Device**: iOS or Android with ARCore/ARKit support
- **WebXR-compatible browser**: Chrome, Edge, or Firefox

---

## 📦 Step 1: Database Setup

### 1.1 Install PostgreSQL and Extensions

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Install pgvector extension
cd /tmp
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install
```

### 1.2 Create Database

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE eureka;
\c eureka

# Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

# Exit psql
\q
```

### 1.3 Run XR Labs Migration

```bash
cd /path/to/EUREKA-Educational-Universal-Reasoning-Enhanced-Knowledge-Architecture

# Run migration
psql -U postgres -d eureka -f database/migrations/add-xr-labs-comprehensive.sql
```

**Verify tables created:**
```sql
\c eureka
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'xr_%' OR table_name LIKE 'vr_%' OR table_name = 'virtual_labs';
```

Expected output: 18 tables

---

## 🚀 Step 2: Backend Service Deployment

### 2.1 Install Dependencies

```bash
cd services/xr-labs
npm install
```

### 2.2 Configure Environment

```bash
cp .env.example .env
nano .env
```

**Required environment variables:**

```env
# Server
PORT=3005
NODE_ENV=production

# Database
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=eureka
DB_USER=postgres
DB_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=eureka-xr-assets

# CDN (optional)
CDN_BASE_URL=https://cdn.eureka-xr.com

# WebXR
WEBXR_ENABLED=true
MAX_CONCURRENT_VR_SESSIONS=100

# Collaborative VR
MAX_ROOM_PARTICIPANTS=10
VOICE_CHAT_ENABLED=true

# 3D Assets
MAX_ASSET_SIZE_MB=100
SUPPORTED_FORMATS=glb,gltf,fbx,obj,usdz
AUTO_OPTIMIZE_ASSETS=true

# Performance
TARGET_FPS=90
MAX_POLYGON_COUNT=1000000

# Monitoring
ENABLE_ANALYTICS=true
LOG_LEVEL=info
```

### 2.3 Build and Start Service

```bash
# Build TypeScript
npm run build

# Start service
npm start

# Or use PM2 for production
npm install -g pm2
pm2 start dist/app.js --name xr-labs-backend
pm2 save
pm2 startup
```

### 2.4 Verify Backend is Running

```bash
curl http://localhost:3005/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "XR Labs Backend",
  "version": "1.0.0",
  "timestamp": "2025-11-18T10:00:00Z"
}
```

---

## 🎨 Step 3: Frontend Integration

### 3.1 Update Frontend Environment

```bash
cd ../../eureka/apps/web
nano .env.local
```

Add XR Labs configuration:

```env
NEXT_PUBLIC_XR_API_URL=https://api.eureka-xr.com/api/xr
NEXT_PUBLIC_XR_WS_URL=https://api.eureka-xr.com
```

### 3.2 Install Frontend Dependencies

```bash
npm install three socket.io-client
npm install --save-dev @types/three
```

### 3.3 Build and Deploy Frontend

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Or deploy to Vercel/Netlify
vercel deploy --prod
```

---

## 🔐 Step 4: SSL/HTTPS Setup (Required for WebXR)

**WebXR requires HTTPS to function. HTTP will not work.**

### Option 1: Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.eureka-xr.com -d eureka-xr.com
```

### Option 2: Cloudflare (Recommended)

1. Add domain to Cloudflare
2. Enable "Full (strict)" SSL mode
3. Use Cloudflare Origin Certificates
4. Enable WebSockets in Network settings

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.eureka-xr.com;

    ssl_certificate /etc/letsencrypt/live/api.eureka-xr.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.eureka-xr.com/privkey.pem;

    # Backend API
    location /api/xr {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## ☁️ Step 5: AWS S3 Setup

### 5.1 Create S3 Bucket

```bash
aws s3 mb s3://eureka-xr-assets --region us-east-1
```

### 5.2 Configure CORS

Create `cors-config.json`:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://eureka-xr.com", "https://api.eureka-xr.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

Apply CORS:

```bash
aws s3api put-bucket-cors --bucket eureka-xr-assets --cors-configuration file://cors-config.json
```

### 5.3 Set Bucket Policy (Public Read)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::eureka-xr-assets/*"
    }
  ]
}
```

### 5.4 Enable CloudFront CDN (Optional but Recommended)

1. Create CloudFront distribution
2. Set origin to S3 bucket
3. Enable gzip compression
4. Set cache behavior for `.glb`, `.gltf` files
5. Update `CDN_BASE_URL` in backend `.env`

---

## 🧪 Step 6: Testing

### 6.1 API Testing

**Test 3D Asset Upload:**

```bash
curl -X POST https://api.eureka-xr.com/api/xr/assets/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "asset=@/path/to/model.glb" \
  -F "asset_name=Test Model" \
  -F "category=molecule" \
  -F "polygon_count=5000" \
  -F "has_animations=false"
```

**Test Experience Creation:**

```bash
curl -X POST https://api.eureka-xr.com/api/xr/experiences \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test VR Lab",
    "description": "Test experience",
    "experience_type": "vr_lab",
    "difficulty_level": "beginner",
    "duration_minutes": 10,
    "supported_devices": ["web_browser", "meta_quest"],
    "scene_file_url": "https://cdn.eureka-xr.com/scenes/test.glb",
    "tags": ["test"]
  }'
```

### 6.2 WebXR Browser Testing

**Desktop Testing (Chrome/Edge):**

1. Navigate to `https://eureka-xr.com/xr-labs`
2. Select an experience
3. Click "Launch VR"
4. Allow WebXR permissions
5. Test with mouse/keyboard (no headset)

**Meta Quest Testing:**

1. Put on Quest headset
2. Open Oculus Browser or Firefox Reality
3. Navigate to `https://eureka-xr.com/xr-labs`
4. Select an experience
5. Click "Launch VR"
6. Test with controllers

**Mobile AR Testing (iOS/Android):**

1. Open Chrome or Safari on mobile
2. Navigate to `https://eureka-xr.com/xr-labs`
3. Select AR experience
4. Click "Launch AR"
5. Point camera at surface
6. Test placement and interaction

### 6.3 Collaborative VR Room Testing

**Create Room:**

```bash
curl -X POST https://api.eureka-xr.com/api/xr/rooms/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "experience_id": "EXPERIENCE_UUID",
    "max_participants": 10,
    "voice_chat_enabled": true
  }'
```

**Join Room (from frontend):**

1. Go to "Collaborative Rooms" tab
2. Click "Join Room" on any active room
3. Enter VR mode
4. Test voice chat and shared state

### 6.4 Performance Testing

**Load Testing with Artillery:**

```bash
npm install -g artillery

# Create test config
cat > artillery-test.yml <<EOF
config:
  target: 'https://api.eureka-xr.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Get Experiences"
    flow:
      - get:
          url: "/api/xr/experiences"
EOF

# Run test
artillery run artillery-test.yml
```

**Target Metrics:**

- **Response Time**: < 200ms for API calls
- **3D Load Time**: < 5 seconds for GLTF models
- **WebSocket Latency**: < 50ms for position updates
- **FPS in VR**: 90 FPS minimum (Quest 2/3)
- **Concurrent Sessions**: 100+ simultaneous users

---

## 📊 Step 7: Monitoring & Analytics

### 7.1 Backend Logging

```bash
# View logs
tail -f services/xr-labs/logs/combined.log

# View errors only
tail -f services/xr-labs/logs/error.log

# PM2 logs
pm2 logs xr-labs-backend
```

### 7.2 Database Monitoring

```sql
-- Active sessions
SELECT COUNT(*) FROM xr_user_sessions WHERE ended_at IS NULL;

-- Total experiences
SELECT COUNT(*) FROM xr_experiences WHERE is_published = true;

-- Active VR rooms
SELECT COUNT(*) FROM vr_collaborative_rooms WHERE status IN ('waiting', 'active');

-- Daily analytics
SELECT * FROM xr_analytics_daily ORDER BY date DESC LIMIT 7;
```

### 7.3 Performance Monitoring

**Setup Prometheus + Grafana (Optional):**

```bash
# Install Prometheus
docker run -d -p 9090:9090 prom/prometheus

# Install Grafana
docker run -d -p 3000:3000 grafana/grafana

# Add Prometheus datasource in Grafana
# Create dashboards for:
# - API response times
# - Active VR sessions
# - 3D asset downloads
# - WebSocket connections
```

---

## 🔧 Step 8: Troubleshooting

### Common Issues

**Issue 1: WebXR not available**

```
Error: navigator.xr is undefined
```

**Solutions:**

- Ensure HTTPS is enabled
- Use Chrome/Edge browser (latest version)
- Check if VR headset is connected
- Enable WebXR flag in browser: `chrome://flags/#webxr`

---

**Issue 2: 3D models not loading**

```
Error: Failed to load GLTF
```

**Solutions:**

- Verify S3 CORS configuration
- Check file URL is accessible
- Ensure file format is correct (GLB/GLTF)
- Check browser console for specific errors

---

**Issue 3: WebSocket connection fails**

```
Error: WebSocket connection failed
```

**Solutions:**

- Verify WebSocket is allowed through firewall
- Check Nginx WebSocket proxy config
- Ensure Socket.IO versions match (client/server)
- Test WebSocket endpoint: `wss://api.eureka-xr.com/socket.io`

---

**Issue 4: Poor VR performance (low FPS)**

**Solutions:**

- Reduce polygon count of 3D models (< 100k recommended)
- Optimize textures (max 2048x2048)
- Enable LOD (Level of Detail)
- Reduce number of lights in scene
- Use baked lighting instead of real-time

---

**Issue 5: Database connection errors**

**Solutions:**

- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check connection pool settings
- Increase max connections in PostgreSQL config
- Verify database credentials in `.env`

---

## 🚀 Step 9: Production Optimization

### 9.1 3D Asset Optimization

**Optimize GLTF models:**

```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Optimize model
gltf-pipeline -i input.gltf -o output.glb --draco.compressionLevel 10
```

**Target metrics:**

- **Polygon count**: < 100,000 for mobile, < 500,000 for desktop VR
- **Texture size**: 2048x2048 max, use compressed formats (KTX2, Basis)
- **File size**: < 10MB for quick loading

### 9.2 Backend Optimization

**Enable caching:**

```typescript
// Add Redis caching for experiences
import Redis from 'ioredis';
const redis = new Redis();

app.get('/api/xr/experiences', async (req, res) => {
  const cached = await redis.get('experiences:all');
  if (cached) return res.json(JSON.parse(cached));

  // Fetch from database
  const experiences = await fetchExperiences();
  await redis.setex('experiences:all', 300, JSON.stringify(experiences));
  res.json(experiences);
});
```

**Database indexing:**

```sql
-- Add indexes for common queries
CREATE INDEX idx_experiences_type ON xr_experiences(experience_type);
CREATE INDEX idx_experiences_subject ON xr_experiences(lab_subject);
CREATE INDEX idx_sessions_user ON xr_user_sessions(user_id);
```

### 9.3 CDN Setup

- Serve 3D assets from CloudFront/CDN
- Enable gzip/brotli compression
- Set cache headers for static assets
- Use HTTP/2 for faster loading

---

## 📱 Step 10: Device-Specific Setup

### Meta Quest Setup

1. **Enable Developer Mode:**
   - Install Meta Quest app on phone
   - Enable Developer Mode in settings
   - Connect Quest to WiFi

2. **Sideload Test App (Optional):**
   ```bash
   adb devices
   adb install app.apk
   ```

3. **Test WebXR in Browser:**
   - Open Oculus Browser
   - Navigate to app URL
   - Allow WebXR permissions

### iOS AR Setup

1. **Requirements:**
   - iOS 11+ with ARKit support
   - Safari browser
   - HTTPS enabled

2. **Test:**
   - Open Safari on iPhone/iPad
   - Navigate to app
   - Click AR experience
   - Allow camera access

---

## ✅ Step 11: Post-Deployment Checklist

- [ ] Database migration completed (18 tables)
- [ ] Backend service running and accessible
- [ ] Frontend deployed with HTTPS
- [ ] SSL certificate installed
- [ ] AWS S3 bucket configured with CORS
- [ ] WebXR tested in Chrome/Edge
- [ ] VR headset testing completed (if available)
- [ ] Mobile AR testing completed (if available)
- [ ] WebSocket real-time features working
- [ ] Monitoring and logging configured
- [ ] Backup strategy implemented
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Performance benchmarks met
- [ ] Documentation updated

---

## 📚 Additional Resources

- [WebXR Device API Spec](https://www.w3.org/TR/webxr/)
- [Three.js Documentation](https://threejs.org/docs/)
- [GLTF 2.0 Specification](https://www.khronos.org/gltf/)
- [Meta Quest Developer Docs](https://developer.oculus.com/)
- [ARCore Documentation](https://developers.google.com/ar)
- [ARKit Documentation](https://developer.apple.com/arkit/)

---

## 🆘 Support

For issues or questions:
- GitHub Issues: [Create issue](https://github.com/eureka/issues)
- Email: support@eureka-platform.com
- Discord: [Join community](https://discord.gg/eureka)

---

**Deployment Status:** ✅ Ready for Production

**Last Updated:** 2025-11-18

---

*Built with 🥽 for the future of immersive education*

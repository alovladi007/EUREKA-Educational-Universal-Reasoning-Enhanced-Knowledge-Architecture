# XR Labs Backend Service

**Extended Reality Labs Platform for Immersive STEM Education**

A comprehensive backend service for managing VR/AR/MR experiences, 3D assets, collaborative virtual rooms, and real-time multi-user interactions.

---

## 🎯 Features

### Core Functionality

- **3D Asset Management** - Upload, store, and manage 3D models (GLB, GLTF, FBX, OBJ, USDZ)
- **XR Experience Catalog** - Create and manage VR/AR/MR experiences
- **Session Tracking** - Monitor user sessions, performance metrics, and analytics
- **Collaborative VR Rooms** - Real-time multi-user virtual environments with WebSocket
- **Achievement System** - Gamification with badges and progression tracking
- **Virtual Lab Controls** - Manage chemistry, physics, biology lab environments
- **AR Marker Management** - Image markers, QR codes, face/body tracking
- **Equipment Checkout** - Physical VR/AR device management

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL with pgvector
- **Real-time**: Socket.IO for WebSocket communication
- **Storage**: AWS S3 for 3D assets and media
- **Authentication**: JWT tokens
- **3D Processing**: Three.js (server-side)
- **Logging**: Winston

---

## 📦 Installation

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14+ with pgvector extension
- AWS account (for S3 storage)
- npm or yarn

### Setup Steps

1. **Install Dependencies**

```bash
cd services/xr-labs
npm install
```

2. **Configure Environment**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3005
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eureka
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-jwt-secret
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=eureka-xr-assets
```

3. **Run Database Migrations**

```bash
psql -U postgres -d eureka -f ../../database/migrations/add-xr-labs-comprehensive.sql
```

4. **Start Development Server**

```bash
npm run dev
```

5. **Build for Production**

```bash
npm run build
npm start
```

---

## 🔌 API Endpoints

### 3D Asset Management

#### Upload 3D Asset

```http
POST /api/xr/assets/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- asset (file): 3D model file
- asset_name (string): Asset name
- category (string): molecule|organ|equipment|building|astronomical|geological
- description (string): Description
- polygon_count (number): Polygon count
- has_animations (boolean): Has animations
- animation_count (number): Number of animations
- is_physics_enabled (boolean): Physics enabled
- tags (array): Tags for search
```

**Response:**
```json
{
  "message": "3D asset uploaded successfully",
  "asset": {
    "id": "uuid",
    "asset_name": "Water Molecule",
    "file_url": "https://s3.../molecule.glb",
    "file_size_mb": 2.5,
    "polygon_count": 5000,
    "has_animations": true
  }
}
```

#### Get All 3D Assets

```http
GET /api/xr/assets?category=molecule&format=glb&search=water&limit=50&offset=0
```

**Response:**
```json
{
  "assets": [...],
  "total": 15,
  "limit": 50,
  "offset": 0
}
```

#### Get Single 3D Asset

```http
GET /api/xr/assets/:id
```

#### Delete 3D Asset

```http
DELETE /api/xr/assets/:id
Authorization: Bearer <token>
```

---

### XR Experience Management

#### Create XR Experience

```http
POST /api/xr/experiences
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Virtual Chemistry Lab",
  "description": "Mix chemicals and observe reactions",
  "experience_type": "vr_lab",
  "lab_subject": "chemistry",
  "difficulty_level": "beginner",
  "duration_minutes": 30,
  "supported_devices": ["meta_quest", "htc_vive", "web_browser"],
  "scene_file_url": "https://s3.../chemistry-lab.glb",
  "thumbnail_url": "https://s3.../thumb.jpg",
  "motion_intensity": "comfortable",
  "min_age": 13,
  "max_concurrent_users": 10,
  "tags": ["chemistry", "molecules", "reactions"],
  "learning_objectives": ["Understand chemical reactions", "Mix compounds safely"]
}
```

#### Get All Experiences

```http
GET /api/xr/experiences?type=vr_lab&subject=chemistry&difficulty=beginner&device=meta_quest&search=lab
```

**Filters:**
- `type`: vr_lab|ar_overlay|mixed_reality|3d_model|simulation|virtual_tour|360_video|hologram
- `subject`: chemistry|physics|biology|anatomy|engineering|astronomy|geology|environmental_science|mathematics|computer_science
- `difficulty`: beginner|intermediate|advanced
- `device`: meta_quest|htc_vive|valve_index|pico|web_browser|mobile_ar|hololens|magic_leap
- `search`: Full-text search in title and description

#### Get Single Experience

```http
GET /api/xr/experiences/:id
```

#### Update Experience

```http
PUT /api/xr/experiences/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "is_published": true
}
```

#### Delete Experience

```http
DELETE /api/xr/experiences/:id
Authorization: Bearer <token>
```

---

### Session Tracking & Analytics

#### Start XR Session

```http
POST /api/xr/sessions/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "experience_id": "uuid",
  "device_type": "meta_quest"
}
```

**Response:**
```json
{
  "message": "XR session started",
  "session": {
    "id": "uuid",
    "user_id": "uuid",
    "experience_id": "uuid",
    "device_type": "meta_quest",
    "started_at": "2025-11-18T10:00:00Z"
  }
}
```

#### End XR Session

```http
POST /api/xr/sessions/:sessionId/end
Authorization: Bearer <token>
Content-Type: application/json

{
  "completion_percentage": 100,
  "objectives_achieved": ["objective1", "objective2"],
  "quiz_score": 95,
  "avg_fps": 90,
  "avg_latency_ms": 15,
  "interactions_count": 50,
  "objects_manipulated": 10,
  "comfort_rating": 5,
  "motion_sickness_reported": false,
  "user_rating": 5,
  "feedback": "Great experience!"
}
```

#### Get My Sessions

```http
GET /api/xr/sessions/my-sessions?limit=20&offset=0
Authorization: Bearer <token>
```

**Response:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "experience_title": "Virtual Chemistry Lab",
      "session_duration": 28.5,
      "completion_percentage": 100,
      "user_rating": 5,
      "started_at": "2025-11-18T10:00:00Z"
    }
  ],
  "total": 15
}
```

#### Get Analytics Summary

```http
GET /api/xr/analytics/summary
Authorization: Bearer <token>
```

**Response:**
```json
{
  "analytics": {
    "total_sessions": 25,
    "total_time_minutes": 450,
    "avg_completion": 85.5,
    "avg_rating": 4.7,
    "unique_experiences": 8
  }
}
```

---

### Collaborative VR Rooms

#### Create VR Room

```http
POST /api/xr/rooms/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "experience_id": "uuid",
  "max_participants": 10,
  "is_private": false,
  "voice_chat_enabled": true,
  "text_chat_enabled": true
}
```

**Response:**
```json
{
  "message": "VR room created successfully",
  "room": {
    "id": "uuid",
    "room_code": "AB12CD",
    "experience_id": "uuid",
    "host_user_id": "uuid",
    "max_participants": 10,
    "status": "waiting"
  }
}
```

#### Join VR Room

```http
POST /api/xr/rooms/:roomCode/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "avatar_url": "https://cdn.../avatar.glb"
}
```

#### Leave VR Room

```http
POST /api/xr/rooms/:roomCode/leave
Authorization: Bearer <token>
```

#### Get Active Rooms

```http
GET /api/xr/rooms/active
```

**Response:**
```json
{
  "rooms": [
    {
      "id": "uuid",
      "room_code": "AB12CD",
      "experience_title": "Physics Lab - Projectile Motion",
      "current_participants": 3,
      "max_participants": 10,
      "status": "active"
    }
  ]
}
```

---

### Achievement System

#### Get My Achievements

```http
GET /api/xr/achievements/my-achievements
Authorization: Bearer <token>
```

**Response:**
```json
{
  "achievements": [
    {
      "achievement_name": "First Steps in VR",
      "description": "Complete your first VR lab",
      "icon_url": "https://cdn.../icon.png",
      "points": 100,
      "rarity": "common",
      "earned_at": "2025-11-18T10:30:00Z"
    }
  ],
  "total_achievements": 5,
  "total_points": 800
}
```

#### Get All Available Achievements

```http
GET /api/xr/achievements
```

---

### Virtual Labs

#### Get Virtual Lab Details

```http
GET /api/xr/labs/:experienceId
```

**Response:**
```json
{
  "lab": {
    "id": "uuid",
    "lab_type": "chemistry",
    "available_equipment": {
      "beakers": true,
      "bunsen_burner": true,
      "pipettes": true,
      "flasks": true
    },
    "allows_mixing": true,
    "allows_heating": true,
    "physics_simulation": true,
    "supports_multiplayer": true
  }
}
```

#### Get Simulations

```http
GET /api/xr/simulations?subject=physics&difficulty=intermediate
```

---

### AR Marker Management

#### Get AR Markers

```http
GET /api/xr/ar-markers?experience_id=uuid&marker_type=image
```

**Marker Types:**
- `image` - Image-based tracking
- `qr_code` - QR code markers
- `face` - Face tracking
- `body` - Body tracking
- `surface` - Surface detection

---

### Equipment Management

#### Get Available Equipment

```http
GET /api/xr/equipment?device_type=meta_quest&status=available
```

#### Checkout Equipment

```http
POST /api/xr/equipment/:id/checkout
Authorization: Bearer <token>
```

#### Return Equipment

```http
POST /api/xr/equipment/:id/return
Authorization: Bearer <token>
Content-Type: application/json

{
  "condition_notes": "Device in good condition"
}
```

---

## 🔌 WebSocket Events

Connect to WebSocket server:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3005', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

#### Join Room

```javascript
socket.emit('join_room', {
  roomCode: 'AB12CD',
  userId: 'user-uuid'
});

// Server response
socket.on('room_state', (data) => {
  console.log('Room:', data.room);
  console.log('Participants:', data.participants);
});
```

#### Update Position (VR Avatar)

```javascript
socket.emit('update_position', {
  roomCode: 'AB12CD',
  userId: 'user-uuid',
  position: { x: 1.5, y: 0.0, z: -2.0 },
  rotation: { x: 0, y: 45, z: 0 }
});

// Receive others' positions
socket.on('participant_moved', (data) => {
  console.log('User moved:', data.userId, data.position);
});
```

#### Voice Activity

```javascript
socket.emit('voice_activity', {
  roomCode: 'AB12CD',
  userId: 'user-uuid',
  isSpeaking: true
});

socket.on('participant_speaking', (data) => {
  console.log('User speaking:', data.userId, data.isSpeaking);
});
```

#### Chat Message

```javascript
socket.emit('chat_message', {
  roomCode: 'AB12CD',
  userId: 'user-uuid',
  message: 'Hello everyone!'
});

socket.on('chat_message', (data) => {
  console.log(`${data.userId}: ${data.message}`);
});
```

#### Shared State Update (Synchronized Experiment)

```javascript
socket.emit('update_shared_state', {
  roomCode: 'AB12CD',
  sharedState: {
    experimentStep: 3,
    temperature: 75,
    chemicals: ['H2O', 'NaCl']
  }
});

socket.on('shared_state_updated', (data) => {
  console.log('Shared state:', data.sharedState);
});
```

---

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

JWT payload should contain:
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "student"
}
```

---

## 📊 Performance Metrics

The service tracks:

- **FPS (Frames Per Second)**: Target 90 FPS for VR
- **Latency**: Average network latency in milliseconds
- **Session Duration**: Time spent in experience
- **Completion Rate**: Percentage of experience completed
- **Interaction Count**: Number of user interactions
- **Objects Manipulated**: 3D objects touched/moved

---

## 🎮 Supported Devices

- **Meta Quest** (Quest 2, Quest 3, Quest Pro)
- **HTC Vive** (Vive, Vive Pro)
- **Valve Index**
- **Pico** (Pico 4)
- **Web Browser** (WebXR compatible)
- **Mobile AR** (iOS ARKit, Android ARCore)
- **HoloLens** (HoloLens 2)
- **Magic Leap**

---

## 🧪 Experience Types

- `vr_lab` - Virtual Reality laboratory
- `ar_overlay` - Augmented Reality overlay
- `mixed_reality` - Mixed Reality experience
- `3d_model` - 3D model viewer
- `simulation` - Interactive simulation
- `virtual_tour` - Virtual campus/facility tour
- `360_video` - 360-degree video
- `hologram` - Holographic display

---

## 📚 Subject Areas

- Chemistry
- Physics
- Biology
- Anatomy
- Mechanical Engineering
- Electrical Engineering
- Astronomy
- Geology
- Environmental Science
- Mathematics
- Computer Science

---

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Helmet.js** - HTTP security headers
- **File Upload Validation** - Whitelist allowed file formats
- **Max File Size** - Configurable upload limits (default 100MB)
- **CORS Protection** - Configurable allowed origins

---

## 📈 Monitoring & Logging

### Winston Logger

Logs are written to:
- `logs/error.log` - Error-level logs
- `logs/combined.log` - All logs
- Console output (development)

### Log Levels

```env
LOG_LEVEL=info  # error, warn, info, debug
```

### Key Events Logged

- User authentication
- 3D asset uploads/deletions
- XR session start/end
- VR room creation/join/leave
- Achievement awards
- Equipment checkout/return
- WebSocket connections
- Errors and exceptions

---

## 🚀 Deployment

### Docker Deployment (Recommended)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY dist ./dist

EXPOSE 3005

CMD ["node", "dist/app.js"]
```

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=3005
DB_HOST=production-db.example.com
JWT_SECRET=<strong-random-secret>
AWS_ACCESS_KEY_ID=<aws-key>
AWS_SECRET_ACCESS_KEY=<aws-secret>
AWS_S3_BUCKET=production-xr-assets
ENABLE_ANALYTICS=true
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "XR Labs Backend",
  "version": "1.0.0",
  "timestamp": "2025-11-18T10:00:00Z"
}
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint
```

---

## 📖 Additional Resources

- [WebXR Device API](https://www.w3.org/TR/webxr/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [AWS S3 SDK](https://docs.aws.amazon.com/sdk-for-javascript/)

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Submit pull request

---

## 📝 License

MIT License - EUREKA Platform

---

## 🆘 Support

For issues or questions:
- Create GitHub issue
- Email: support@eureka-platform.com

---

**Built with 🥽 for immersive STEM education**

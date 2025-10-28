# EUREKA Platform - Complete Service & Page Map

## 🌐 Main Web Application - Port 4500
**URL**: http://localhost:4500
**Status**: ✅ Running with Session 4 Integration

### Landing & Public Pages
- **Homepage** → http://localhost:4500
  - New gradient design with modern hero section
  - Feature cards for students, teachers, and institutions
  - Call-to-action buttons
  
- **Demo Page** → http://localhost:4500/demo
  - Interactive platform features showcase
  - Feature demonstrations
  - Trial access information

### Authentication Pages
- **Login** → http://localhost:4500/auth/login
  - Test credentials displayed on page
  - Email/password authentication
  - Remember me option
  
- **Register** → http://localhost:4500/auth/register
  - Full name, email, password fields
  - Education level selection (HS/UG/Grad/Med/Law/MBA/Eng)
  - Role selection (Student/Teacher/Parent/Admin)

### Dashboard Pages (Requires Browser Access - Client-Side Rendered)
**Note**: These pages use localStorage and React hooks, so they require browser access

- **Main Dashboard** → http://localhost:4500/dashboard
  - Welcome message and stats overview
  - 4 stat cards: Courses in Progress, Assignments Completed, Average Score, Time Spent
  - Continue Learning section with course progress bars
  - Upcoming Assessments widget
  - Recent Activity feed
  - Quick Actions (AI Tutor, Browse Courses, Analytics, Achievements)
  
- **My Courses** → http://localhost:4500/dashboard/courses
  - Course catalog and enrolled courses
  - Course management interface
  
- **Assessments** → http://localhost:4500/dashboard/assessments
  - Upcoming and past assessments
  - Quiz and exam management
  
- **Learning Path** → http://localhost:4500/dashboard/learning-path
  - Personalized learning recommendations
  - Progress tracking
  
- **Analytics** → http://localhost:4500/dashboard/analytics
  - Performance metrics
  - Learning insights
  - Progress visualization
  
- **AI Tutor** → http://localhost:4500/dashboard/tutor
  - Interactive AI tutoring interface
  - Real-time Q&A

### Educational Tier Pages
- **High School** → http://localhost:4500/tiers/hs
- **Undergraduate** → http://localhost:4500/tiers/ug
- **Graduate** → http://localhost:4500/tiers/grad
- **Medical School** → http://localhost:4500/tiers/med
- **Law School** → http://localhost:4500/tiers/law
- **MBA** → http://localhost:4500/tiers/mba
- **Engineering** → http://localhost:4500/tiers/eng

## 🔧 Backend REST API Services

### Python/FastAPI Services
| Service | Port | Description | URL |
|---------|------|-------------|-----|
| Main API Gateway | 8000 | Central API gateway | http://localhost:8000 |
| Tier HS Service | 8001 | High School tier | http://localhost:8001 |
| Tier UG Service | 8002 | Undergraduate tier | http://localhost:8002 |
| Tier Grad Service | 8003 | Graduate tier | http://localhost:8003 |
| Pro Med Service | 8004 | Medical School | http://localhost:8004 |
| Pro Law/MBA/Eng | 8005 | Professional tiers | http://localhost:8005 |
| Analytics Service | 8080 | Analytics & insights | http://localhost:8080 |
| Content Service | 8100 | Content management | http://localhost:8100 |
| Assessment Service | 5002 | Tests & quizzes | http://localhost:5002 |
| Adaptive Service | 5007 | Adaptive learning | http://localhost:5007 |
| Tutor LLM Service | 5008 | AI tutoring | http://localhost:5008 |

### Node.js Services  
| Service | Port | Description | URL |
|---------|------|-------------|-----|
| Admin Portal | 3001 | Administrative interface | http://localhost:3001 |
| Web Grad Portal | 3002 | Graduate web portal | http://localhost:3002 |
| Web HS Portal | 3003 | High School portal | http://localhost:3003 |
| Web UG Portal | 3004 | Undergrad portal | http://localhost:3004 |
| Mobile API | 3005 | Mobile app backend | http://localhost:3005 |
| Ingestion Service | 3007 | Data ingestion | http://localhost:3007 |
| Gamification | 3008 | Badges & achievements | http://localhost:3008 |
| Pro Eng Service | 3009 | Engineering tier | http://localhost:3009 |
| Additional Services | 3011-3050 | Various microservices | Various ports |

## 🔐 Test Credentials

### For Login (http://localhost:4500/auth/login)
```
Admin Account:
Email: admin@eureka.edu
Password: TestPass123!

Teacher Account:
Email: teacher@springfield-hs.edu
Password: TestPass123!

Student Account:
Email: student@midwest-state.edu
Password: TestPass123!
```

## 📊 Session 4 Integration Status

### ✅ Completed Features
- New gradient landing page with modern design
- Complete authentication flow (login/register)
- Dashboard with sidebar navigation
- shadcn/ui component system
- All UI components (button, input, card, avatar, badge, progress)
- Educational tier pages (7 tiers)
- Demo page with interactive features
- Responsive layouts
- Dark mode support (configured)
- Tailwind CSS with custom theme

### 🎨 UI Components Available
- Button (6 variants: default, destructive, outline, secondary, ghost, link)
- Input (with label, error, helper text support)
- Card (with Header, Title, Description, Content, Footer)
- Avatar
- Badge
- Progress Bar

## 🚀 Quick Start

1. Open browser and navigate to: **http://localhost:4500**
2. Click **"Login"** button in top-right corner
3. Use one of the test credentials above
4. Explore the dashboard and all features

## 📁 File Structure

```
eureka/apps/web/src/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── auth/
│   │   ├── login/page.tsx       # Login page
│   │   └── register/page.tsx    # Registration page
│   ├── dashboard/
│   │   ├── layout.tsx           # Dashboard layout with sidebar
│   │   ├── page.tsx             # Main dashboard
│   │   ├── courses/page.tsx     # Courses page
│   │   ├── assessments/page.tsx # Assessments page
│   │   ├── analytics/page.tsx   # Analytics page
│   │   ├── learning-path/page.tsx # Learning path
│   │   └── tutor/page.tsx       # AI tutor
│   ├── demo/page.tsx            # Demo page
│   └── tiers/[tier]/page.tsx    # Dynamic tier pages
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   └── progress.tsx
│   └── dashboard/
│       ├── header.tsx           # Dashboard header
│       └── sidebar.tsx          # Dashboard sidebar
└── types/
    └── index.ts                 # TypeScript type definitions
```

## 🎯 Next Steps

1. **Test Dashboard**: Open http://localhost:4500 in browser and log in
2. **Backend Integration**: Connect frontend to REST APIs
3. **Authentication**: Implement real JWT authentication
4. **Database**: Connect to actual database instead of mock data
5. **Testing**: Add unit and integration tests
6. **Deployment**: Prepare for production deployment

---

**Last Updated**: October 28, 2025
**Session**: Session 4 Integration Complete
**Version**: 1.0.0

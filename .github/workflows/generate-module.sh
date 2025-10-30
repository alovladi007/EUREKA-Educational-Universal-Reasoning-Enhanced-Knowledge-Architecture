#!/bin/bash
# Helper script to generate module content with proper feature lists

MODULE_NAME="$1"
MODULE_SLUG="$2"
VERSION="$3"
TIMESTAMP="$4"

# Define features for each module
declare -A MEDICAL_FEATURES=(
    [0]="USMLE Question Bank"
    [1]="Clinical Case Simulations"
    [2]="3D Anatomy Models"
    [3]="Medical Literature Integration"
    [4]="Diagnostic Reasoning Practice"
)

declare -A LAW_FEATURES=(
    [0]="Case Law Database"
    [1]="Legal Writing Feedback"
    [2]="Moot Court Simulations"
    [3]="Contract Analysis Tools"
    [4]="Bar Exam Preparation"
)

declare -A MBA_FEATURES=(
    [0]="Financial Modeling Tools"
    [1]="Business Case Library"
    [2]="Market Analysis Simulations"
    [3]="Team Collaboration Features"
    [4]="Executive Decision Games"
)

declare -A ENGINEERING_FEATURES=(
    [0]="Circuit Simulators"
    [1]="CAD Integration"
    [2]="FE/PE Practice Exams"
    [3]="Engineering Problem Sets"
    [4]="Lab Simulation Tools"
)

# Get features array based on module slug
get_features() {
    case "$MODULE_SLUG" in
        medical-school)
            for key in "${!MEDICAL_FEATURES[@]}"; do
                echo "${MEDICAL_FEATURES[$key]}"
            done | sort
            ;;
        law-school)
            for key in "${!LAW_FEATURES[@]}"; do
                echo "${LAW_FEATURES[$key]}"
            done | sort
            ;;
        mba)
            for key in "${!MBA_FEATURES[@]}"; do
                echo "${MBA_FEATURES[$key]}"
            done | sort
            ;;
        engineering)
            for key in "${!ENGINEERING_FEATURES[@]}"; do
                echo "${ENGINEERING_FEATURES[$key]}"
            done | sort
            ;;
    esac
}

# Generate Frontend Component
generate_frontend() {
    local features=($(get_features))
    
    cat > "modules/$MODULE_SLUG/frontend/${MODULE_NAME// /}Dashboard.tsx" << 'FRONTEND_EOF'
/**
 * MODULE_NAME_PLACEHOLDER Dashboard Component
 * Generated: TIMESTAMP_PLACEHOLDER
 * Version: VERSION_PLACEHOLDER
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardProps {
  userId: string;
}

export const MODULE_COMPONENT_NAMEDashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, [userId]);
  
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(\`/api/v1/MODULE_SLUG_PLACEHOLDER/profile/\${userId}\`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  const features = [
FEATURES_PLACEHOLDER
  ];
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">MODULE_NAME_PLACEHOLDER Dashboard</h1>
        <Badge variant="outline">MODULE_SLUG_PLACEHOLDER</Badge>
      </div>
      
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{feature}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Access {feature.toLowerCase()} and track your progress
              </p>
              <Button className="mt-4 w-full" variant="outline">
                Open {feature}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">No recent activity</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MODULE_COMPONENT_NAMEDashboard;
FRONTEND_EOF

    # Replace placeholders
    sed -i "s/MODULE_NAME_PLACEHOLDER/$MODULE_NAME/g" "modules/$MODULE_SLUG/frontend/${MODULE_NAME// /}Dashboard.tsx"
    sed -i "s/MODULE_COMPONENT_NAME/${MODULE_NAME// /}/g" "modules/$MODULE_SLUG/frontend/${MODULE_NAME// /}Dashboard.tsx"
    sed -i "s/MODULE_SLUG_PLACEHOLDER/$MODULE_SLUG/g" "modules/$MODULE_SLUG/frontend/${MODULE_NAME// /}Dashboard.tsx"
    sed -i "s/VERSION_PLACEHOLDER/$VERSION/g" "modules/$MODULE_SLUG/frontend/${MODULE_NAME// /}Dashboard.tsx"
    sed -i "s/TIMESTAMP_PLACEHOLDER/$TIMESTAMP/g" "modules/$MODULE_SLUG/frontend/${MODULE_NAME// /}Dashboard.tsx"
    
    # Insert features
    local features_list=""
    for feature in "${features[@]}"; do
        features_list="${features_list}    \"${feature}\",\n"
    done
    sed -i "s/FEATURES_PLACEHOLDER/$features_list/" "modules/$MODULE_SLUG/frontend/${MODULE_NAME// /}Dashboard.tsx"
}

# Generate Documentation with features
generate_docs() {
    local features=($(get_features))
    
    cat > "modules/$MODULE_SLUG/docs/README.md" << 'DOCS_EOF'
# MODULE_NAME_PLACEHOLDER Module

**Version:** VERSION_PLACEHOLDER  
**Generated:** TIMESTAMP_PLACEHOLDER  
**Label:** \`tier:MODULE_SLUG_PLACEHOLDER\`

## Overview

This module provides comprehensive features for MODULE_NAME_PLACEHOLDER education.

## Features

FEATURES_LIST_PLACEHOLDER

## Architecture

### Database Schema

See \`database/schema.sql\` for the complete database schema including:

- User profiles (tier-specific)
- Course data
- Assessments and submissions
- Learning paths
- Progress tracking
- Analytics events

## API Endpoints

Base URL: \`/api/v1/MODULE_SLUG_PLACEHOLDER\`

### User Profile
- \`GET /profile/{user_id}\` - Get user profile
- \`PUT /profile/{user_id}\` - Update user profile

### Assessments
- \`GET /assessments\` - List assessments
- \`POST /assessments\` - Create assessment
- \`GET /assessments/{id}\` - Get assessment details
- \`POST /assessments/{id}/submit\` - Submit assessment

### Learning Paths
- \`GET /learning-paths/{user_id}\` - Get learning paths
- \`POST /learning-paths\` - Create learning path

### Progress Tracking
- \`GET /progress/{user_id}\` - Get progress
- \`PUT /progress/{user_id}\` - Update progress

### Analytics
- \`POST /analytics/track\` - Track event
- \`GET /analytics/{user_id}/summary\` - Get analytics summary

## Frontend Components

Main dashboard component: \`frontend/MODULE_COMPONENT_NAMEDashboard.tsx\`

### Usage

\`\`\`tsx
import { MODULE_COMPONENT_NAMEDashboard } from '@/modules/MODULE_SLUG_PLACEHOLDER/frontend';

function App() {
  return <MODULE_COMPONENT_NAMEDashboard userId="user-id" />;
}
\`\`\`

## Testing

\`\`\`bash
# Run unit tests
npm test -- modules/MODULE_SLUG_PLACEHOLDER

# Run integration tests
npm run test:integration -- modules/MODULE_SLUG_PLACEHOLDER
\`\`\`

## Development

### Setup

1. Install dependencies:
\`\`\`bash
npm install
pip install -r requirements.txt
\`\`\`

2. Initialize database:
\`\`\`bash
psql -d your_database -f modules/MODULE_SLUG_PLACEHOLDER/database/schema.sql
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

### Environment Variables

\`\`\`env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
API_BASE_URL=http://localhost:8000
MODULE_UPPER_TIER_ENABLED=true
\`\`\`

## Support

For issues or questions:
- Create an issue with the \`tier:MODULE_SLUG_PLACEHOLDER\` label
- Contact the development team

## License

Copyright © 2025. All rights reserved.
DOCS_EOF

    # Replace placeholders
    sed -i "s/MODULE_NAME_PLACEHOLDER/$MODULE_NAME/g" "modules/$MODULE_SLUG/docs/README.md"
    sed -i "s/MODULE_COMPONENT_NAME/${MODULE_NAME// /}/g" "modules/$MODULE_SLUG/docs/README.md"
    sed -i "s/MODULE_SLUG_PLACEHOLDER/$MODULE_SLUG/g" "modules/$MODULE_SLUG/docs/README.md"
    sed -i "s/MODULE_UPPER/${MODULE_SLUG^^}/g" "modules/$MODULE_SLUG/docs/README.md"
    sed -i "s/VERSION_PLACEHOLDER/$VERSION/g" "modules/$MODULE_SLUG/docs/README.md"
    sed -i "s/TIMESTAMP_PLACEHOLDER/$TIMESTAMP/g" "modules/$MODULE_SLUG/docs/README.md"
    
    # Insert features
    local features_list=""
    for feature in "${features[@]}"; do
        features_list="${features_list}- ✅ ${feature}\n"
    done
    sed -i "s|FEATURES_LIST_PLACEHOLDER|$features_list|" "modules/$MODULE_SLUG/docs/README.md"
}

# Generate BUILD_INFO with features
generate_build_info() {
    local features=($(get_features))
    
    cat > "modules/$MODULE_SLUG/BUILD_INFO.txt" << BUILD_EOF
Module: $MODULE_NAME
Slug: $MODULE_SLUG
Version: $VERSION
Build Time: $TIMESTAMP

Features Included:
BUILD_EOF

    for feature in "${features[@]}"; do
        echo "- $feature" >> "modules/$MODULE_SLUG/BUILD_INFO.txt"
    done
}

# Main execution
echo "Generating content for $MODULE_NAME..."
generate_frontend
generate_docs
generate_build_info
echo "✅ Content generation complete for $MODULE_NAME"

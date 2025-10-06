# Mind_Care Repository Cleanup Script (PowerShell)
# This script helps organize and clean up the repository structure

Write-Host "🧹 Starting Mind_Care Repository Cleanup..." -ForegroundColor Green

# Check current status
Write-Host "📊 Current repository status:" -ForegroundColor Yellow
$currentBranch = git branch --show-current
$uncommittedChanges = (git status --porcelain | Measure-Object).Count
Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan
Write-Host "Uncommitted changes: $uncommittedChanges files" -ForegroundColor Cyan

# Function to create organized directory structure
function Create-Structure {
    Write-Host "📁 Creating organized directory structure..." -ForegroundColor Yellow
    
    # Create directory structure
    $dirs = @(
        "docs\guides",
        "docs\api", 
        "docs\examples",
        "src\components\ui",
        "src\components\features",
        "src\components\layout",
        "src\components\common",
        "src\features\dashboard",
        "src\features\chat",
        "src\features\meditation",
        "src\features\booking",
        "src\features\profile",
        "src\hooks\ui",
        "src\hooks\data",
        "src\hooks\auth",
        "src\hooks\utils",
        "src\utils\api",
        "src\utils\helpers",
        "src\utils\constants",
        "src\utils\validation",
        "tests\components",
        "tests\hooks",
        "tests\utils",
        "tests\e2e"
    )
    
    foreach ($dir in $dirs) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    Write-Host "✅ Directory structure created" -ForegroundColor Green
}

# Function to create consolidated showcase
function Create-ComponentShowcase {
    Write-Host "🎭 Creating consolidated component showcase..." -ForegroundColor Yellow
    
    $showcaseContent = @'
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ComponentShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('overview');

  const componentSections = [
    {
      id: 'dashboard',
      title: 'Dashboard Components',
      description: 'Mood tracking, analytics, and wellness insights',
      components: ['MoodTracker', 'Analytics', 'GoalsTracker', 'QuickActions']
    },
    {
      id: 'chat',
      title: 'AI Chat System', 
      description: 'Intelligent mental health support conversations',
      components: ['ChatWidget', 'MessageBubble', 'TypingIndicator', 'CrisisDetection']
    },
    {
      id: 'meditation',
      title: 'Meditation & Wellness',
      description: 'Guided meditation and breathing exercises',
      components: ['MeditationTimer', 'BreathingExercise', 'AmbientSounds', 'ProgressTracker']
    },
    {
      id: 'booking',
      title: 'Appointment System',
      description: 'Counselor booking and session management', 
      components: ['BookingForm', 'CounselorCard', 'SessionCalendar', 'VideoCall']
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Mind_Care Component Showcase
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Interactive demonstration of all Mind_Care components and features designed for mental health support
        </p>
        <Badge variant="secondary" className="text-sm">
          🧠 Mental Health Platform • Open Source
        </Badge>
      </div>

      {/* Component Sections */}
      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="meditation">Wellness</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🌟</span>
                Welcome to Mind_Care Components
              </CardTitle>
              <CardDescription>
                This showcase demonstrates all the components and features available in the Mind_Care platform.
                Each section focuses on different aspects of mental health support technology.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {componentSections.map((section) => (
                  <Card key={section.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setActiveDemo(section.id)}>
                    <CardHeader>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {section.components.map((component) => (
                          <Badge key={component} variant="outline" className="text-xs">
                            {component}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {componentSections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Component demonstrations for {section.title} will be implemented here.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is a placeholder for the actual component showcase.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Footer Info */}
      <div className="text-center text-sm text-muted-foreground border-t pt-6">
        <p>
          Mind_Care is an open-source mental health platform built with React, TypeScript, and modern web technologies.
        </p>
        <p className="mt-2">
          Contribute to making mental health support accessible to everyone! 💚
        </p>
      </div>
    </div>
  );
};

export default ComponentShowcase;
'@

    $showcaseContent | Out-File -FilePath "src\pages\ComponentShowcase.tsx" -Encoding utf8
    Write-Host "✅ Created ComponentShowcase.tsx" -ForegroundColor Green
}

# Function to organize documentation  
function Organize-Docs {
    Write-Host "📚 Organizing documentation..." -ForegroundColor Yellow
    
    # Move docs to organized structure
    if (Test-Path "DEVELOPMENT_SETUP.md") {
        Move-Item "DEVELOPMENT_SETUP.md" "docs\DEVELOPMENT.md" -Force
    }
    
    if (Test-Path "CODE_OF_CONDUCT.md") {
        Move-Item "CODE_OF_CONDUCT.md" "docs\CODE_OF_CONDUCT.md" -Force  
    }
    
    if (Test-Path "CONTRIBUTING.md") {
        Move-Item "CONTRIBUTING.md" "docs\CONTRIBUTING.md" -Force
    }
    
    Write-Host "✅ Documentation organized" -ForegroundColor Green
}

# Function to create development guide
function Create-DevGuide {
    Write-Host "📖 Creating development guide..." -ForegroundColor Yellow
    
    $devGuide = @'
# Mind_Care Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Project Structure

```
Mind_Care/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── features/  # Feature-specific components
│   │   ├── layout/    # Layout components
│   │   └── common/    # Shared utilities
│   ├── features/      # Feature modules
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript types
├── docs/              # Documentation
└── tests/             # Test files
```

## Component Guidelines

### Creating New Components

1. Use TypeScript for all components
2. Include prop interfaces with JSDoc comments
3. Follow the established naming conventions
4. Add accessibility features (ARIA labels, keyboard navigation)
5. Include error handling for mental health safety

### Example Component Structure

```tsx
import React from 'react';

/**
 * Example component with proper TypeScript and accessibility
 */
interface ExampleProps {
  /** The title to display */
  title: string;
  /** Optional callback when clicked */
  onClick?: () => void;
  /** Custom CSS classes */
  className?: string;
}

export const Example: React.FC<ExampleProps> = ({ 
  title, 
  onClick, 
  className 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn("base-styles", className)}
      aria-label={`Example button: ${title}`}
    >
      {title}
    </button>
  );
};
```

## Mental Health Considerations

- Always provide crisis resources in error states
- Use calm, supportive language in UI text
- Respect user privacy and data sensitivity
- Ensure accessibility for users with disabilities
- Test with screen readers and keyboard navigation

## Getting Help

- Check existing issues on GitHub
- Read the documentation in `/docs`
- Ask questions in discussions
- Follow the code of conduct

---

Happy coding! 💚
'@

    $devGuide | Out-File -FilePath "docs\DEVELOPMENT.md" -Encoding utf8
    Write-Host "✅ Created development guide" -ForegroundColor Green
}

# Main execution
function Main {
    Write-Host "🚀 Starting cleanup process..." -ForegroundColor Green
    
    # Confirm before proceeding
    $continue = Read-Host "This will make changes to your repository. Continue? (y/N)"
    
    if ($continue -match "^[Yy]$") {
        try {
            Create-Structure
            Create-ComponentShowcase  
            Organize-Docs
            Create-DevGuide
            
            Write-Host ""
            Write-Host "✨ Cleanup completed successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📋 Next steps:" -ForegroundColor Yellow
            Write-Host "1. Review the changes: git status" -ForegroundColor Cyan
            Write-Host "2. Test the application: npm run dev" -ForegroundColor Cyan
            Write-Host "3. Update imports as needed" -ForegroundColor Cyan
            Write-Host "4. Commit changes: git add . && git commit -m 'Repository cleanup and reorganization'" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "📖 See CLEANUP_GUIDE.md for detailed next steps" -ForegroundColor Magenta
        }
        catch {
            Write-Host "❌ Error during cleanup: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "❌ Cleanup cancelled" -ForegroundColor Red
    }
}

# Run the script
Main
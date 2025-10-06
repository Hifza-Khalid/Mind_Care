#!/bin/bash

# Mind_Care Repository Cleanup Script
# This script helps organize and clean up the repository structure

echo "🧹 Starting Mind_Care Repository Cleanup..."

# Create backup branch first
echo "📋 Creating backup branch..."
git checkout -b backup-$(date +%Y%m%d-%H%M%S)
git checkout -

# Check current status
echo "📊 Current repository status:"
echo "Current branch: $(git branch --show-current)"
echo "Uncommitted changes: $(git status --porcelain | wc -l) files"

# Function to create organized directory structure
create_structure() {
    echo "📁 Creating organized directory structure..."
    
    mkdir -p docs/{guides,api,examples}
    mkdir -p src/components/{ui,features,layout,common}
    mkdir -p src/features/{dashboard,chat,meditation,booking,profile}
    mkdir -p src/hooks/{ui,data,auth,utils}
    mkdir -p src/utils/{api,helpers,constants,validation}
    mkdir -p tests/{components,hooks,utils,e2e}
}

# Function to consolidate demo pages
consolidate_demos() {
    echo "🎭 Consolidating demo pages..."
    
    # Create combined showcase page
    cat > src/pages/ComponentShowcase.tsx << 'EOF'
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ComponentShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('overview');

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Mind_Care Component Showcase</h1>
        <p className="text-lg text-muted-foreground">
          Interactive demonstration of all Mind_Care components and features
        </p>
      </div>

      <Tabs value={activeDemo} onValueChange={setActiveDemo}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="meditation">Meditation</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Mind_Care Components</CardTitle>
              <CardDescription>
                This showcase demonstrates all the components and features available in the Mind_Care platform.
                Use the tabs above to explore different sections.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Dashboard Components</h3>
                  <p className="text-sm text-muted-foreground">
                    Mood tracking, analytics, and wellness insights
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">AI Chat System</h3>
                  <p className="text-sm text-muted-foreground">
                    Intelligent mental health support conversations
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Meditation Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Guided meditation and breathing exercises
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add other tab contents here */}
      </Tabs>
    </div>
  );
};

export default ComponentShowcase;
EOF

    echo "✅ Created consolidated ComponentShowcase.tsx"
}

# Function to organize documentation
organize_docs() {
    echo "📚 Organizing documentation..."
    
    # Keep essential docs, move others to docs/guides/
    if [ -f "DEVELOPMENT_SETUP.md" ]; then
        mv DEVELOPMENT_SETUP.md docs/DEVELOPMENT.md
    fi
    
    if [ -f "CODE_OF_CONDUCT.md" ]; then
        mv CODE_OF_CONDUCT.md docs/CODE_OF_CONDUCT.md
    fi
    
    if [ -f "CONTRIBUTING.md" ]; then
        mv CONTRIBUTING.md docs/CONTRIBUTING.md
    fi
}

# Function to update package.json scripts
update_scripts() {
    echo "🔧 Updating package.json scripts..."
    
    # Add useful development scripts
    cat > scripts/dev-scripts.json << 'EOF'
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "clean": "rimraf dist node_modules/.vite",
    "clean:install": "npm run clean && npm install"
  }
}
EOF
    
    echo "✅ Created development scripts reference"
}

# Main execution
main() {
    echo "🚀 Starting cleanup process..."
    
    # Confirm before proceeding
    read -p "This will make changes to your repository. Continue? (y/N) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        create_structure
        consolidate_demos
        organize_docs
        update_scripts
        
        echo ""
        echo "✨ Cleanup completed successfully!"
        echo ""
        echo "📋 Next steps:"
        echo "1. Review the changes: git status"
        echo "2. Test the application: npm run dev"  
        echo "3. Update imports as needed"
        echo "4. Commit changes: git add . && git commit -m 'Repository cleanup and reorganization'"
        echo ""
        echo "📖 See CLEANUP_GUIDE.md for detailed next steps"
    else
        echo "❌ Cleanup cancelled"
    fi
}

# Run the script
main
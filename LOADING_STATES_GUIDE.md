# Loading States Implementation Guide

## Overview

This implementation provides comprehensive loading states for the Mind Care mental health platform, focusing on anxiety-reducing, gentle animations and accessibility-first design.

## Components Created

### 1. Spinner Components (`/src/components/ui/spinner.tsx`)

Basic spinner components for various loading scenarios:

```tsx
import { Spinner, InlineSpinner, LoadingOverlay, CardSpinner } from '@/components/ui/spinner';

// Basic usage
<Spinner size="md" variant="gentle" text="Loading your wellness data..." />

// Inline spinner for buttons
<InlineSpinner size="sm" />

// Full-page overlay
<LoadingOverlay text="Preparing your dashboard..." />

// Card content loading
<CardSpinner text="Loading mood insights..." />
```

**Key Features:**
- Multiple size variants (xs, sm, md, lg, xl)
- Color variants (default, primary, secondary, gentle, success, warning)
- Crisis-conscious design with gentle animations
- Accessibility support with screen reader text

### 2. Loading Animations (`/src/components/ui/loading-animations.tsx`)

Mental health-themed loading animations:

```tsx
import { 
  HeartbeatLoader, 
  BreathingLoader, 
  WaveLoader, 
  GentlePulseLoader,
  ActivityRingsLoader,
  ZenDotsLoader,
  TypingIndicator,
  DashboardLoader
} from '@/components/ui/loading-animations';

// Heartbeat animation for mood-related content
<HeartbeatLoader text="Loading your mood data..." />

// Breathing animation for meditation content
<BreathingLoader text="Preparing your meditation session..." />

// Wave animation for analytics
<WaveLoader text="Analyzing your wellness trends..." />

// Complete dashboard loading
<DashboardLoader />
```

**Animation Types:**
- **HeartbeatLoader**: For mood and emotional content
- **BreathingLoader**: For meditation and relaxation features
- **WaveLoader**: For analytics and data visualization
- **GentlePulseLoader**: For sensitive content areas
- **ActivityRingsLoader**: For progress tracking
- **ZenDotsLoader**: For mindfulness features
- **TypingIndicator**: For AI chat interactions

### 3. Skeleton Loaders (`/src/components/ui/loading-skeletons.tsx`)

Specialized skeleton loaders for dashboard components:

```tsx
import { 
  MoodTrackerSkeleton,
  MoodAnalyticsSkeleton,
  MoodWidgetSkeleton,
  InteractiveAnalyticsSkeleton,
  QuickMoodSkeleton
} from '@/components/ui/loading-skeletons';

// Mood tracker loading state
<MoodTrackerSkeleton />

// Different mood widget variants
<MoodWidgetSkeleton variant="summary" />
<MoodWidgetSkeleton variant="trend" />
<MoodWidgetSkeleton variant="streak" />
<MoodWidgetSkeleton variant="weekly" />

// Analytics components
<MoodAnalyticsSkeleton />
<InteractiveAnalyticsSkeleton />
```

**Skeleton Types:**
- **MoodTrackerSkeleton**: Matches MoodTracker component layout
- **MoodWidgetSkeleton**: Variants for different widget types
- **MoodAnalyticsSkeleton**: For mood analytics with tabs and charts
- **InteractiveAnalyticsSkeleton**: For interactive analytics dashboard
- **QuickMoodSkeleton**: For quick mood check-in components

### 4. Enhanced Components with Loading States

#### Enhanced Mood Tracker (`/src/components/dashboard/EnhancedMoodTracker.tsx`)

```tsx
import { EnhancedMoodTracker, QuickMoodCheckIn } from '@/components/dashboard/EnhancedMoodTracker';

// Mood tracker with comprehensive loading states
<EnhancedMoodTracker 
  onMoodLogged={(data) => console.log('Mood logged:', data)}
  compact={false}
  readOnly={false}
/>

// Quick mood check-in with loading
<QuickMoodCheckIn 
  onMoodSelected={(mood) => console.log('Quick mood:', mood)}
  loading={false}
/>
```

**Features:**
- Initial loading with skeleton
- Mood submission loading with inline spinners
- Error states with retry functionality
- Real-time feedback notifications
- Streak tracking and celebration
- Accessibility-compliant mood selection

#### Loading States Demo (`/src/components/dashboard/LoadingStatesDemo.tsx`)

Comprehensive demonstration of all loading patterns:

```tsx
import { 
  LoadingMoodTracker,
  LoadingMoodWidgets,
  LoadingMoodAnalytics,
  LoadingDashboardDemo
} from '@/components/dashboard/LoadingStatesDemo';

// Individual component demos
<LoadingMoodTracker forceLoading={false} slowLoading={false} />
<LoadingMoodWidgets forceLoading={false} slowLoading={false} />
<LoadingMoodAnalytics forceLoading={false} slowLoading={false} />

// Complete dashboard demo
<LoadingDashboardDemo showLoading={false} progressiveLoading={true} />
```

## Implementation Patterns

### 1. Progressive Loading

Load components in stages to provide immediate feedback:

```tsx
const [loadingStates, setLoadingStates] = useState({
  summary: true,
  trend: true,
  streak: true,
  weekly: true
});

useEffect(() => {
  const loadComponents = async () => {
    // Load summary first
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoadingStates(prev => ({ ...prev, summary: false }));
    
    // Then other components...
  };
  
  loadComponents();
}, []);
```

### 2. Error States with Retry

Provide clear error messages and retry functionality:

```tsx
const [error, setError] = useState<string | null>(null);

if (error) {
  return (
    <div className="text-center space-y-4">
      <div className="text-red-500">⚠️ {error}</div>
      <button onClick={retryLoad}>Retry</button>
    </div>
  );
}
```

### 3. Inline Loading for Actions

Use inline spinners for form submissions and actions:

```tsx
<button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <InlineSpinner size="sm" className="mr-2" />
      Saving...
    </>
  ) : (
    'Save Mood'
  )}
</button>
```

## Accessibility Features

### 1. Screen Reader Support

All loading components include proper ARIA attributes:

```tsx
<div role="status" aria-label="Loading mood tracker">
  <MoodTrackerSkeleton />
</div>
```

### 2. Reduced Motion Support

Respect user's motion preferences:

```tsx
const HeartbeatLoader = ({ reduceMotion = false }) => (
  <Heart className={cn(
    'w-full h-full',
    !reduceMotion ? 'animate-pulse' : ''
  )} />
);
```

### 3. Focus Management

Maintain focus appropriately during loading transitions:

```tsx
useEffect(() => {
  if (!isLoading && previouslyLoading) {
    // Restore focus to appropriate element
    focusElement?.focus();
  }
}, [isLoading]);
```

## Mental Health Considerations

### 1. Gentle Animations

All animations are designed to be calming and non-jarring:

- Use `animate-pulse` instead of `animate-spin` for sensitive content
- Slower animation durations (1.2s+) for reduced anxiety
- Soft color transitions and gentle scaling

### 2. Crisis-Aware Design

Loading states are designed with crisis situations in mind:

- No rapid flashing or aggressive animations
- Calming color palettes (blues, gentle greens)
- Clear, reassuring messaging
- Quick access to help when loading fails

### 3. Positive Reinforcement

Loading messages provide encouragement:

```tsx
<Spinner text="Preparing your mental wellness insights..." />
<DashboardLoader text="Loading your wellness dashboard..." />
```

## Usage in Existing Components

### Integrating with MoodTracker

```tsx
import { MoodTrackerSkeleton } from '@/components/ui/loading-skeletons';
import { InlineSpinner } from '@/components/ui/spinner';

export const MoodTracker = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return <MoodTrackerSkeleton />;
  }

  return (
    <Card>
      {/* Component content */}
      <Button disabled={isSubmitting}>
        {isSubmitting ? <InlineSpinner size="sm" className="mr-2" /> : null}
        Save Mood
      </Button>
    </Card>
  );
};
```

### Integrating with Dashboard

```tsx
import { DashboardLoader } from '@/components/ui/loading-animations';

export const Dashboard = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  if (isInitialLoading) {
    return <DashboardLoader />;
  }

  return (
    <div className="dashboard">
      {/* Dashboard content */}
    </div>
  );
};
```

## Performance Considerations

### 1. Lazy Loading

Use React.lazy for code splitting:

```tsx
const MoodAnalytics = lazy(() => import('./MoodAnalytics'));

<Suspense fallback={<MoodAnalyticsSkeleton />}>
  <MoodAnalytics />
</Suspense>
```

### 2. Skeleton Matching

Ensure skeletons closely match actual content:

```tsx
// Skeleton should mirror the actual component structure
<MoodTrackerSkeleton /> // matches <MoodTracker /> layout exactly
```

### 3. Animation Performance

Use CSS transforms for better performance:

```tsx
// Good: Uses transform
className="animate-pulse"

// Avoid: Changes layout properties
style={{ width: animatedWidth }}
```

## Testing Loading States

### 1. Force Loading States

Use props to force loading states for testing:

```tsx
<MoodTracker forceLoading={true} />
<LoadingDashboardDemo showLoading={true} />
```

### 2. Slow Network Simulation

Test with slow network conditions:

```tsx
// Simulate slow loading
await new Promise(resolve => setTimeout(resolve, 3000));
```

### 3. Error State Testing

Test error scenarios and recovery:

```tsx
const [showError, setShowError] = useState(false);

<LoadingMoodTracker showError={showError} />
```

## Future Enhancements

### 1. Smart Loading

Implement intelligent loading based on user patterns:

```tsx
// Preload commonly used components
const shouldPreload = userFrequentlyUsesMoodAnalytics();
```

### 2. Offline Support

Add offline indicators and functionality:

```tsx
const isOffline = !navigator.onLine;
if (isOffline) {
  return <OfflineIndicator />;
}
```

### 3. Loading Analytics

Track loading performance and user experience:

```tsx
// Measure loading times
const startTime = Date.now();
// ... loading complete
const loadTime = Date.now() - startTime;
analytics.track('component_load_time', { component: 'MoodTracker', time: loadTime });
```

## Best Practices

1. **Always provide loading feedback** for operations > 200ms
2. **Use skeleton loaders** for predictable layouts
3. **Show progress** for longer operations when possible
4. **Provide clear error messages** and retry options
5. **Respect accessibility preferences** (reduced motion, screen readers)
6. **Keep animations gentle** and mental health-conscious
7. **Test loading states** as thoroughly as success states
8. **Match skeleton layouts** to actual component structure
9. **Use appropriate loading types** for different contexts
10. **Provide meaningful loading messages** that reassure users

This implementation provides a comprehensive foundation for loading states that prioritize user experience, accessibility, and mental health considerations throughout the Mind Care platform.
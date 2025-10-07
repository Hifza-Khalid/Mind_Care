/**
 * Loading States Components Index
 * 
 * Central export file for all loading state components in the Mind Care platform.
 * This provides a convenient way to import loading components throughout the application.
 * 
 * @example
 * ```tsx
 * // Import individual components
 * import { Spinner, MoodTrackerSkeleton, HeartbeatLoader } from '@/components/loading';
 * 
 * // Import by category
 * import { Spinners, Skeletons, Animations } from '@/components/loading';
 * ```
 */

// Spinner Components
export {
  Spinner,
  InlineSpinner,
  LoadingOverlay,
  CardSpinner
} from '../ui/spinner';

// Loading Animations
export {
  HeartbeatLoader,
  BreathingLoader,
  WaveLoader,
  GentlePulseLoader,
  ActivityRingsLoader,
  ZenDotsLoader,
  TypingIndicator,
  DashboardLoader
} from '../ui/loading-animations';

// Skeleton Loaders
export {
  GentleSkeleton,
  MoodTrackerSkeleton,
  MoodAnalyticsSkeleton,
  MoodWidgetSkeleton,
  InteractiveAnalyticsSkeleton,
  DashboardWidgetSkeleton,
  QuickMoodSkeleton
} from '../ui/loading-skeletons';

// Enhanced Components with Loading States
export {
  EnhancedMoodTracker,
  QuickMoodCheckIn
} from '../dashboard/EnhancedMoodTracker';

// Loading State Demonstrations
export {
  LoadingMoodTracker,
  LoadingMoodWidgets,
  LoadingMoodAnalytics,
  LoadingQuickActions,
  LoadingAnimationsShowcase,
  LoadingDashboardDemo
} from '../dashboard/LoadingStatesDemo';

// Type definitions
export type { SpinnerProps } from '../ui/spinner';
export type { LoaderProps } from '../ui/loading-animations';
export type { SkeletonProps } from '../ui/loading-skeletons';
export type { 
  EnhancedMoodTrackerProps 
} from '../dashboard/EnhancedMoodTracker';
export type { LoadingStateProps } from '../dashboard/LoadingStatesDemo';

// Grouped exports for convenience
export const Spinners = {
  Spinner,
  InlineSpinner,
  LoadingOverlay,
  CardSpinner
};

export const Animations = {
  HeartbeatLoader,
  BreathingLoader,
  WaveLoader,
  GentlePulseLoader,
  ActivityRingsLoader,
  ZenDotsLoader,
  TypingIndicator,
  DashboardLoader
};

export const Skeletons = {
  GentleSkeleton,
  MoodTrackerSkeleton,
  MoodAnalyticsSkeleton,
  MoodWidgetSkeleton,
  InteractiveAnalyticsSkeleton,
  DashboardWidgetSkeleton,
  QuickMoodSkeleton
};

export const EnhancedComponents = {
  EnhancedMoodTracker,
  QuickMoodCheckIn
};

export const Demos = {
  LoadingMoodTracker,
  LoadingMoodWidgets,
  LoadingMoodAnalytics,
  LoadingQuickActions,
  LoadingAnimationsShowcase,
  LoadingDashboardDemo
};

// Default export with all components
export default {
  ...Spinners,
  ...Animations,
  ...Skeletons,
  ...EnhancedComponents,
  ...Demos
};
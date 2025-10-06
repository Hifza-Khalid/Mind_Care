# TypeScript Interfaces & Props Documentation

This document provides comprehensive documentation for all TypeScript interfaces and props used throughout the Mind Care application components.

## Component Props Interfaces

### UI Components

#### Button Props
**File:** `src/components/ui/button.tsx`

```tsx
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  
  /** Render as Radix Slot for polymorphic components */
  asChild?: boolean;
  
  /** Accessible name for screen readers (required for icon-only buttons) */
  'aria-label'?: string;
  
  /** References to elements describing this button */
  'aria-describedby'?: string;
  
  /** Collapsible element state for dropdowns */
  'aria-expanded'?: boolean;
  
  /** Toggle button pressed state */
  'aria-pressed'?: boolean;
}

// Variant types from class-variance-authority
type ButtonVariants = 
  | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  | 'hero' | 'trust' | 'gentle' | 'safety' | 'calm' | 'support' | 'premium';

type ButtonSizes = 'default' | 'sm' | 'lg' | 'xl' | 'icon';
```

#### Input Props
**File:** `src/components/ui/input.tsx`

```tsx
export interface InputProps extends React.ComponentProps<'input'> {
  /** Accessible name when visual label isn't present */
  'aria-label'?: string;
  
  /** Links to help text, errors, or descriptions */
  'aria-describedby'?: string;
  
  /** Validation error state for screen readers */
  'aria-invalid'?: boolean;
  
  /** Required field indicator for accessibility */
  'aria-required'?: boolean;
}
```

### Dashboard Components

#### MoodTracker Props
**File:** `src/components/dashboard/MoodTracker.tsx`

```tsx
export interface MoodTrackerProps {
  /** Optional callback when mood is successfully logged */
  onMoodLogged?: (moodData: {
    level: number;
    note?: string;
    timestamp: Date;
    streak: number;
  }) => void;
  
  /** Show compact version without detailed analytics */
  compact?: boolean;
  
  /** Custom CSS classes for styling */
  className?: string;
  
  /** Disable mood entry (view-only mode) */
  readOnly?: boolean;
}

// Internal mood data structure
interface MoodEntry {
  id: string;
  level: number; // 1-5 scale
  note?: string;
  timestamp: Date;
  tags?: string[];
  triggers?: string[];
}

interface MoodAnalytics {
  weeklyAverage: number;
  trend: 'improving' | 'declining' | 'stable';
  streak: number;
  totalEntries: number;
}
```

#### GoalsTracker Props
**File:** `src/components/dashboard/GoalsTracker.tsx`

```tsx
export interface GoalsTrackerProps {
  /** Maximum number of active goals allowed */
  maxGoals?: number;
  
  /** Callback when goal is completed */
  onGoalComplete?: (goal: Goal) => void;
  
  /** Show celebration animations */
  enableAnimations?: boolean;
  
  /** Custom categories for goal organization */
  categories?: GoalCategory[];
}

interface Goal {
  id: string;
  title: string;
  description?: string;
  category: 'wellness' | 'academic' | 'social' | 'personal' | 'therapy';
  priority: 'low' | 'medium' | 'high';
  targetDate?: Date;
  progress: number; // 0-100 percentage
  milestones: Milestone[];
  completed: boolean;
  createdAt: Date;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

interface GoalCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}
```

### Chat & Communication

#### ChatWidget Props
**File:** `src/components/chat/ChatWidget.tsx`

```tsx
export interface ChatWidgetProps {
  /** Initial language for the chat interface */
  initialLanguage?: string;
  
  /** Start the chat in minimized state */
  startMinimized?: boolean;
  
  /** Custom emergency contact numbers by region */
  emergencyContacts?: EmergencyContacts;
  
  /** Callback when crisis is detected in conversation */
  onCrisisDetected?: (level: CrisisLevel, details: CrisisDetails) => void;
  
  /** Theme variant for the chat widget */
  theme?: 'default' | 'calm' | 'professional';
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high' | 'crisis';
  language?: string;
  actions?: ActionButton[];
  confidence?: number; // 0-1 AI confidence score
  triggers?: string[]; // Keywords that triggered response
  riskFactors?: RiskFactor[];
}

interface ActionButton {
  type: 'emergency' | 'counselor' | 'resources' | 'followup';
  label: string;
  urgent?: boolean;
}

type CrisisLevel = 'low' | 'medium' | 'high' | 'crisis';

interface CrisisDetails {
  triggers: string[];
  riskFactors: RiskFactor[];
  confidence: number;
  immediateAction: boolean;
}

type RiskFactor = 
  | 'isolation' | 'substance' | 'trauma' | 'loss' 
  | 'financial' | 'relationship' | 'academic';
```

### Meditation & Wellness

#### MeditationTimer Props
**File:** `src/components/meditation/MeditationTimer.tsx`

```tsx
export interface MeditationTimerProps {
  /** Callback when meditation session completes */
  onSessionComplete?: (sessionData: SessionCompletionData) => void;
  
  /** Callback when session starts */
  onSessionStart?: () => void;
  
  /** Callback when session is paused */
  onSessionPause?: () => void;
  
  /** Custom CSS classes */
  className?: string;
  
  /** Default meditation duration in minutes */
  defaultDuration?: number;
  
  /** Available meditation types */
  availableTypes?: MeditationType[];
  
  /** Enable ambient sound integration */
  enableAmbientSounds?: boolean;
}

interface SessionCompletionData {
  duration: number; // Planned duration in minutes
  actualDuration: number; // Time actually meditated
  type: MeditationType;
  ambientSound?: AmbientSoundType;
  interrupted: boolean;
  completionRate: number; // 0-100 percentage
  notes?: string;
}

type MeditationType = 
  | 'breathing' | 'mindfulness' | 'body-scan' 
  | 'loving-kindness' | 'walking' | 'guided';

type AmbientSoundType = 
  | 'nature' | 'rain' | 'ocean' | 'forest' 
  | 'silence' | 'binaural' | 'singing-bowls';
```

### Video & Communication

#### VideoCallWidget Props
**File:** `src/components/video/VideoCallWidget.tsx`

```tsx
export interface VideoCallWidgetProps {
  /** Unique session identifier */
  sessionId: string;
  
  /** Type of participant (student, counselor, admin) */
  participantType: 'student' | 'counselor' | 'admin';
  
  /** Counselor ID for individual sessions */
  counselorId?: string;
  
  /** Group session configuration */
  isGroupSession?: boolean;
  maxParticipants?: number;
  moderatorId?: string;
  
  /** Crisis session priority */
  priorityLevel?: 'routine' | 'urgent' | 'emergency';
  crisisResources?: CrisisResource[];
  
  /** Session callbacks */
  onSessionStart?: () => void;
  onSessionEnd?: (sessionMetrics: SessionMetrics) => void;
  onParticipantJoin?: (participant: Participant) => void;
  onParticipantLeave?: (participantId: string) => void;
  
  /** Technical configuration */
  enableRecording?: boolean;
  requireConsent?: boolean;
  audioOnly?: boolean;
}

interface SessionMetrics {
  duration: number; // Minutes
  participantCount: number;
  connectionQuality: 'poor' | 'fair' | 'good' | 'excellent';
  technicalIssues: TechnicalIssue[];
  notes: SessionNote[];
}

interface Participant {
  id: string;
  name: string;
  type: 'student' | 'counselor' | 'admin';
  joinedAt: Date;
  connectionStatus: 'connected' | 'reconnecting' | 'disconnected';
}

interface SessionNote {
  id: string;
  timestamp: Date;
  content: string;
  authorId: string;
  confidential: boolean;
}

interface TechnicalIssue {
  type: 'audio' | 'video' | 'connection' | 'other';
  timestamp: Date;
  description: string;
  resolved: boolean;
}
```

### Feedback & Assessment

#### FeedbackForm Props
**File:** `src/components/feedback/FeedbackForm.tsx`

```tsx
export interface FeedbackFormProps {
  /** Session being evaluated */
  sessionId: string;
  studentId: string;
  counselorId: string;
  
  /** Optional session metadata */
  sessionDate?: string;
  sessionDuration?: number; // Minutes
  counselorName?: string;
  
  /** Callback functions */
  onSubmit?: (feedback: SessionFeedback) => void;
  onQuickSubmit?: (feedback: QuickFeedback) => void;
  
  /** Form configuration */
  allowAnonymous?: boolean;
  requireComments?: boolean;
  customCategories?: FeedbackCategory[];
}

interface SessionFeedback {
  sessionId: string;
  studentId: string;
  counselorId: string;
  ratings: CategoryRatings;
  overallRating: number; // 1-5 scale
  comments?: string;
  anonymous: boolean;
  submittedAt: Date;
  wouldRecommend: boolean;
}

interface CategoryRatings {
  communication: number; // 1-5 scale
  empathy: number;
  effectiveness: number;
  environment: number;
  professionalism: number;
}

interface QuickFeedback {
  sessionId: string;
  satisfied: boolean;
  submittedAt: Date;
}

interface FeedbackCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
}
```

### Administrative Components

#### Dashboard Props (Admin)
**File:** `src/pages/Dashboard.tsx`

```tsx
export interface AdminDashboardProps {
  /** Auto-refresh interval in seconds */
  refreshInterval?: number;
  
  /** Default time range for analytics */
  defaultTimeRange?: '24h' | '7d' | '30d' | '90d';
  
  /** Crisis alert configuration */
  crisisAlertConfig?: CrisisAlertConfig;
  
  /** Export functionality */
  enableExport?: boolean;
  exportFormats?: ExportFormat[];
}

interface CrisisAlertConfig {
  enableRealTime: boolean;
  alertThreshold: CrisisLevel;
  notificationChannels: NotificationChannel[];
  escalationRules: EscalationRule[];
}

interface Student {
  id: string;
  name: string;
  email: string;
  institution: string;
  riskLevel: 'low' | 'medium' | 'high' | 'crisis';
  lastActivity: Date;
  sessionsCompleted: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  flags: StudentFlag[];
}

interface LiveSession {
  id: string;
  studentId: string;
  counselorId: string;
  type: 'individual' | 'group' | 'crisis';
  startTime: Date;
  status: 'active' | 'paused' | 'ending';
  participants: number;
}

interface CrisisAlert {
  id: string;
  studentId: string;
  severity: CrisisLevel;
  triggerMessage: string;
  detectedAt: Date;
  riskFactors: RiskFactor[];
  actionsTaken: CrisisAction[];
  resolved: boolean;
}

type StudentFlag = 'new-user' | 'frequent-user' | 'crisis-history' | 'no-show' | 'technical-issues';
type NotificationChannel = 'email' | 'sms' | 'push' | 'dashboard';
type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';
```

## Utility & Hook Interfaces

### Dashboard Features Hook
**File:** `src/hooks/useDashboardFeatures.ts`

```tsx
// Mood tracking hook
export interface UseMoodTrackingReturn {
  moods: MoodEntry[];
  addMoodEntry: (mood: number, note?: string) => void;
  getTodayMood: () => MoodEntry | null;
  getWeeklyMoodAverage: () => number;
  getMoodTrend: () => 'improving' | 'declining' | 'stable';
  deleteMoodEntry: (id: string) => void;
}

// Goals tracking hook  
export interface UseGoalsReturn {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  completeGoal: (id: string) => void;
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];
}

// Activity tracking hook
export interface UseActivityLogReturn {
  activities: ActivityEntry[];
  logActivity: (type: ActivityType, data?: any) => void;
  getTodayActivities: () => ActivityEntry[];
  getActivityStreak: (type: ActivityType) => number;
}

interface ActivityEntry {
  id: string;
  type: ActivityType;
  timestamp: Date;
  data?: any;
}

type ActivityType = 
  | 'mood_log' | 'meditation' | 'goal_progress' | 'session_attend' 
  | 'resource_view' | 'chat_interaction' | 'feedback_submit';
```

### Accessibility Utilities
**File:** `src/utils/accessibility.ts`

```tsx
// Screen reader announcement function
export function announceToScreenReader(
  message: string, 
  priority: 'polite' | 'assertive'
): void;

// Keyboard navigation manager class
export class KeyboardNavigationManager {
  constructor(elements: HTMLElement[]);
  handleKeyDown(event: KeyboardEvent): void;
  setCurrentIndex(index: number): void;
}

// Color contrast checker
export function checkColorContrast(
  backgroundColor: string, 
  textColor: string
): {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  wcagAALarge: boolean;
};

// Form accessibility enhancement
export function enhanceFormAccessibility(
  formElement: HTMLFormElement
): void;

// Skip link creation
export function createSkipLink(): HTMLAnchorElement;

// Preference detection utilities
export function prefersReducedMotion(): boolean;
export function prefersHighContrast(): boolean;
export function isScreenReaderActive(): boolean;
```

## Context Interfaces

### Theme Context
**File:** `src/contexts/ThemeContext.tsx`

```tsx
export interface ThemeContextValue {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Accessibility preferences
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}
```

### Auth Context  
**File:** `src/contexts/AuthContext.tsx`

```tsx
export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'counselor' | 'admin';
  institution: string;
  preferences: UserPreferences;
  createdAt: Date;
  lastLogin: Date;
}

interface LoginCredentials {
  email: string;
  password: string;
  role: 'student' | 'counselor' | 'admin';
}

interface UserPreferences {
  language: string;
  notifications: NotificationPreferences;
  accessibility: AccessibilityPreferences;
  privacy: PrivacyPreferences;
}
```

This comprehensive interface documentation ensures type safety and provides clear contracts for all component interactions throughout the Mind Care application.
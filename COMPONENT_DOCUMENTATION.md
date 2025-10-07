# Component Documentation - Mind Care Application

## Overview

This document provides comprehensive documentation for all React components in the Mind Care mental health platform. Each component is designed with accessibility, mental health best practices, and user safety as primary concerns.

## Architecture Principles

### 1. Accessibility-First Design
All components implement WCAG 2.1 AA standards:
- Comprehensive ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management for anxiety reduction

### 2. Mental Health-Focused UX
- Calming color palettes and animations
- Crisis-aware interaction patterns
- Trauma-informed design principles
- Clear, non-judgmental language
- Progressive disclosure of complex information

### 3. Type Safety & Documentation
- Comprehensive TypeScript interfaces
- JSDoc comments with usage examples
- Props documentation with mental health context
- Integration patterns and best practices

## Component Categories

### Core UI Components (`/src/components/ui/`)

#### Button Component
**File:** `src/components/ui/button.tsx`
**Purpose:** Accessible, mental health-focused button with specialized variants

**Key Features:**
- 13 visual variants including mental health-specific styles
- Crisis-appropriate styling (trust, safety, gentle, calm variants)
- Comprehensive ARIA support for emergency scenarios
- Polymorphic rendering via Radix Slot

**Usage Examples:**
```tsx
// Emergency crisis button
<Button variant="destructive" size="lg" aria-label="Get immediate help">
  Emergency Support
</Button>

// Gentle therapy booking
<Button variant="gentle" aria-describedby="booking-help">
  Schedule Session
</Button>

// Toggle for mood tracking
<Button 
  variant="outline" 
  aria-pressed={isActive}
  onClick={() => setIsActive(!isActive)}
>
  Track Mood
</Button>
```

#### Input Component
**File:** `src/components/ui/input.tsx`
**Purpose:** Accessible form input with mental health-focused styling

**Key Features:**
- WCAG 2.1 AA compliant accessibility
- Anxiety-friendly focus indicators
- Built-in validation state communication
- Responsive text sizing for readability

**Usage Examples:**
```tsx
// Crisis form input with validation
<Input
  type="tel"
  aria-label="Emergency contact phone number"
  aria-describedby="phone-help"
  aria-required={true}
  aria-invalid={hasError}
  placeholder="(555) 123-4567"
/>

// Therapy session notes
<Input
  aria-label="Session goals and topics to discuss"
  placeholder="What would you like to focus on today?"
/>
```

### Dashboard Components (`/src/components/dashboard/`)

#### MoodTracker Component
**File:** `src/components/dashboard/MoodTracker.tsx`
**Purpose:** Interactive daily mood logging with trend analysis

**Key Features:**
- 5-point emoji-based mood scale
- Optional contextual note capture
- Real-time trend calculation
- Streak tracking with celebration feedback
- Crisis-level mood detection

**Integration:**
```tsx
import { MoodTracker } from '@/components/dashboard/MoodTracker';

// In StudentDashboard
<MoodTracker />
```

**Data Flow:**
- Uses `useMoodTracking` hook for state management
- Integrates with notification system for reminders
- Provides analytics data for counselor dashboard

#### GoalsTracker Component
**File:** `src/components/dashboard/GoalsTracker.tsx`
**Purpose:** Personal goal setting and progress monitoring

**Key Features:**
- SMART goal creation interface
- Category-based goal organization
- Progress visualization with milestones
- Achievement celebration system
- Integration with mood and activity data

#### InteractiveAnalytics Component
**File:** `src/components/dashboard/InteractiveAnalytics.tsx`
**Purpose:** Visual analytics dashboard for personal wellness data

**Key Features:**
- Multiple chart types (bar, line, pie, area)
- Interactive trend analysis
- Correlation insights (mood vs. sleep, activity vs. wellness)
- Exportable data for healthcare providers

### Chat & Communication (`/src/components/chat/`)

#### ChatWidget Component
**File:** `src/components/chat/ChatWidget.tsx`
**Purpose:** AI-powered mental health support chat with crisis detection

**Key Features:**
- Advanced crisis detection algorithms
- Multi-language support (12+ languages)
- Real-time sentiment analysis
- Contextual action routing (emergency, counseling, resources)
- Offline message queuing

**Crisis Detection Levels:**
1. **Low:** General wellness, positive mood, minor stress
2. **Medium:** Moderate anxiety, academic pressure, relationship issues
3. **High:** Significant distress, depression indicators, isolation
4. **Crisis:** Suicide ideation, self-harm, immediate danger

**Usage:**
```tsx
// Self-managing chat widget
<ChatWidget />

// The widget automatically handles:
// - Language detection and selection
// - Crisis intervention protocols
// - Resource routing
// - Emergency service contact
```

### Meditation & Wellness (`/src/components/meditation/`)

#### MeditationTimer Component
**File:** `src/components/meditation/MeditationTimer.tsx`
**Purpose:** Comprehensive guided meditation timer with ambient sounds

**Key Features:**
- Multiple meditation types (breathing, mindfulness, body scan)
- Customizable duration (5 minutes to 2+ hours)
- Ambient soundscape integration
- Session analytics and completion tracking
- Interruption handling and resume capability

**Meditation Types:**
- **Breathing:** Focused breath awareness exercises
- **Mindfulness:** Present-moment awareness practice
- **Body Scan:** Progressive relaxation technique
- **Loving-Kindness:** Compassion cultivation
- **Walking:** Moving meditation for active practice

**Usage:**
```tsx
<MeditationTimer
  onSessionComplete={(data) => {
    updateWellnessMetrics(data);
    celebrateCompletion();
  }}
  onSessionStart={() => setMeditating(true)}
/>
```

#### BreathingAnimation Component
**File:** `src/components/meditation/BreathingAnimation.tsx`
**Purpose:** Visual breathing guide with customizable patterns

#### AmbientSoundPlayer Component
**File:** `src/components/meditation/AmbientSoundPlayer.tsx`
**Purpose:** Integrated soundscape player for meditation enhancement

### Peer Support (`/src/components/peer-matching/`)

#### PeerBuddyMatching Component
**File:** `src/components/peer-matching/PeerBuddyMatching.tsx`
**Purpose:** Anonymous peer support matching system

#### StudyGroupSystem Component
**File:** `src/components/peer-matching/StudyGroupSystem.tsx`
**Purpose:** Academic support group formation and management

#### MentorMatchingSystem Component
**File:** `src/components/peer-matching/MentorMatchingSystem.tsx`
**Purpose:** Student-to-student mentorship program

### Page Components (`/src/pages/`)

#### Dashboard (Admin)
**File:** `src/pages/Dashboard.tsx`
**Purpose:** Administrative oversight dashboard with real-time monitoring

**Key Features:**
- Real-time student risk assessment monitoring
- Crisis alert management and emergency protocols
- Live session tracking and counselor dispatch
- Platform analytics and institutional reporting
- Auto-refresh capabilities for continuous monitoring

**Data Management:**
```tsx
// Wrapped with real-time data provider
<AdminDataProvider>
  <AdminDashboard />
</AdminDataProvider>
```

#### StudentDashboard
**File:** `src/pages/StudentDashboard.tsx`
**Purpose:** Student wellness dashboard with integrated tools

#### Login
**File:** `src/pages/Login.tsx`
**Purpose:** Multi-role authentication with institutional integration

#### Booking
**File:** `src/pages/Booking.tsx`
**Purpose:** Counseling session scheduling with crisis prioritization

## Usage Patterns

### 1. Crisis-Aware Components
Components that handle potential mental health emergencies:

```tsx
// Automatic crisis detection and routing
<ChatWidget />

// Crisis-priority booking
<BookingComponent prioritizeCrisis={true} />

// Emergency contact integration
<Button variant="destructive" onClick={handleEmergencyContact}>
  Emergency Support
</Button>
```

### 2. Accessibility Integration
All components support comprehensive accessibility:

```tsx
// Screen reader friendly
<Input
  aria-label="Describe your current feelings"
  aria-describedby="mood-help crisis-resources"
  aria-required={true}
/>

// Keyboard navigation
<MoodSelector onKeyDown={handleKeyboardNavigation} />

// High contrast support
<Button variant="calm" className="high-contrast-mode">
  Continue
</Button>
```

### 3. Real-Time Features
Components with live data integration:

```tsx
// Real-time mood analytics
<InteractiveAnalytics refreshInterval={30000} />

// Live session monitoring
<AdminDashboard autoRefresh={true} />

// Instant crisis alerts
<CrisisAlertSystem onAlert={handleImmediate} />
```

### 4. Multilingual Support
International accessibility features:

```tsx
// Language-aware components
<ChatWidget initialLanguage="es" />
<ResourceLibrary filterByLanguage={true} />
<EmergencyContacts localized={true} />
```

## Development Guidelines

### 1. Adding New Components
When creating new components:

1. **Start with accessibility:** Implement ARIA attributes from the beginning
2. **Consider mental health context:** Use calming colors, clear language
3. **Add comprehensive JSDoc:** Include usage examples and prop documentation
4. **Implement TypeScript interfaces:** Ensure type safety and auto-completion
5. **Test with screen readers:** Verify accessibility with actual assistive technology

### 2. Crisis-Aware Development
For components handling sensitive mental health data:

1. **Implement crisis detection:** Use established keywords and patterns
2. **Provide immediate resources:** Always offer help and emergency contacts
3. **Log appropriately:** Balance user privacy with safety monitoring
4. **Test emergency workflows:** Ensure crisis pathways function correctly
5. **Collaborate with clinicians:** Validate approaches with mental health professionals

### 3. Documentation Standards
Each component should include:

```tsx
/**
 * @fileoverview Component purpose and mental health context
 * 
 * Key features, accessibility notes, and crisis considerations
 * 
 * @example Usage examples with mental health scenarios
 * @see Links to related components and documentation
 */
```

## Integration Examples

### Student Wellness Dashboard
```tsx
function StudentDashboard() {
  return (
    <Layout>
      <MoodTracker />
      <GoalsTracker />
      <InteractiveAnalytics />
      <ChatWidget />
      
      {/* Crisis resources always available */}
      <EmergencyResourcesCard />
    </Layout>
  );
}
```

### Administrative Oversight
```tsx
function AdminDashboard() {
  return (
    <AdminDataProvider>
      <CrisisAlertMonitor />
      <LiveSessionTracker />
      <StudentRiskAnalytics />
      <PlatformHealthMetrics />
    </AdminDataProvider>
  );
}
```

### Crisis Intervention Flow
```tsx
function CrisisDetectionFlow() {
  const [crisisLevel, setCrisisLevel] = useState(null);
  
  return (
    <>
      <ChatWidget onCrisisDetected={setCrisisLevel} />
      
      {crisisLevel === 'high' && (
        <CrisisInterventionModal 
          resources={emergencyContacts}
          onConnect={handleEmergencyConnection}
        />
      )}
      
      <EmergencyButton alwaysVisible={true} />
    </>
  );
}
```

## Testing Considerations

### Accessibility Testing
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- High contrast mode functionality
- Focus management and indicators

### Mental Health Scenario Testing
- Crisis detection accuracy
- Emergency resource accessibility
- Trauma-informed interaction patterns
- Cultural sensitivity validation

### Performance Testing
- Real-time data update performance
- Large dataset handling (institutional scale)
- Crisis response time optimization
- Mobile device compatibility

## Future Development

### Planned Enhancements
1. **Enhanced AI Crisis Detection:** Improved natural language processing
2. **Biometric Integration:** Heart rate and stress level monitoring
3. **Predictive Analytics:** Early warning systems for mental health decline
4. **VR/AR Therapy Tools:** Immersive meditation and therapy experiences
5. **Family/Guardian Dashboard:** Appropriate monitoring for minors

### Accessibility Roadmap
1. **Voice Interface:** Hands-free interaction for crisis situations
2. **Cognitive Load Reduction:** Simplified interfaces for acute stress
3. **Multi-Modal Support:** Visual, auditory, and haptic feedback
4. **Cultural Localization:** Region-specific mental health resources

---

*This documentation is maintained by the Mind Care development team and reviewed by licensed mental health professionals. For questions about crisis intervention protocols, consult with clinical staff.*
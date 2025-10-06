# Component Usage Examples - Mind Care Application

This document provides practical examples for using Mind Care components in real-world scenarios with focus on mental health contexts and accessibility.

## Quick Start Examples

### Basic Student Dashboard Setup

```tsx
import React from 'react';
import { MoodTracker } from '@/components/dashboard/MoodTracker';
import { GoalsTracker } from '@/components/dashboard/GoalsTracker';
import { InteractiveAnalytics } from '@/components/dashboard/InteractiveAnalytics';
import ChatWidget from '@/components/chat/ChatWidget';

function StudentDashboard() {
  return (
    <div className="dashboard-layout">
      {/* Always-visible crisis support */}
      <ChatWidget />
      
      {/* Daily wellness tracking */}
      <section aria-label="Daily wellness tracking">
        <MoodTracker />
      </section>
      
      {/* Personal goal management */}
      <section aria-label="Personal goals and achievements">
        <GoalsTracker />
      </section>
      
      {/* Analytics and insights */}
      <section aria-label="Wellness analytics and trends">
        <InteractiveAnalytics />
      </section>
    </div>
  );
}
```

### Crisis-Aware Booking Form

```tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

function EmergencyBookingForm({ onCrisisDetected }) {
  const [urgencyLevel, setUrgencyLevel] = useState('routine');
  const [reasonText, setReasonText] = useState('');

  const handleReasonChange = (value) => {
    setReasonText(value);
    
    // Crisis detection keywords
    const crisisKeywords = ['suicide', 'self-harm', 'emergency', 'crisis'];
    const hasCrisisKeyword = crisisKeywords.some(keyword => 
      value.toLowerCase().includes(keyword)
    );
    
    if (hasCrisisKeyword) {
      setUrgencyLevel('emergency');
      onCrisisDetected?.(true);
    }
  };

  return (
    <form className="crisis-aware-form">
      {urgencyLevel === 'emergency' && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            We've detected this may be an emergency. Immediate support is available.
          </AlertDescription>
        </Alert>
      )}
      
      <Textarea
        aria-label="Describe what you'd like to discuss in your session"
        aria-describedby="reason-help crisis-notice"
        aria-required={true}
        value={reasonText}
        onChange={(e) => handleReasonChange(e.target.value)}
        placeholder="What would you like to focus on in your session?"
      />
      
      <div className="crisis-actions">
        {urgencyLevel === 'emergency' ? (
          <Button variant="destructive" size="lg">
            Get Immediate Help
          </Button>
        ) : (
          <Button variant="default">
            Schedule Session
          </Button>
        )}
      </div>
    </form>
  );
}
```

### Accessible Form Components

```tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function AccessibleLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  return (
    <form aria-label="Sign in to Mind Care">
      <div className="form-field">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          aria-label="Email address for your Mind Care account"
          aria-describedby="email-help"
          aria-invalid={!!errors.email}
          aria-required={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div id="email-help" className="help-text">
          Use your institutional email for student accounts
        </div>
        {errors.email && (
          <div className="error-message" role="alert">
            {errors.email}
          </div>
        )}
      </div>

      <div className="form-field">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          aria-label="Your Mind Care password"
          aria-describedby="password-requirements"
          aria-invalid={!!errors.password}
          aria-required={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div id="password-requirements" className="help-text">
          Password must be at least 8 characters
        </div>
      </div>

      <Button 
        type="submit" 
        variant="hero"
        aria-describedby="login-disclaimer"
        className="w-full"
      >
        Sign In Securely
      </Button>
      
      <div id="login-disclaimer" className="disclaimer">
        Your privacy and security are our top priorities
      </div>
    </form>
  );
}
```

### Meditation Timer Integration

```tsx
import React, { useState } from 'react';
import { MeditationTimer } from '@/components/meditation/MeditationTimer';
import { BreathingAnimation } from '@/components/meditation/BreathingAnimation';
import { AmbientSoundPlayer } from '@/components/meditation/AmbientSoundPlayer';
import { Button } from '@/components/ui/button';

function MeditationDashboard() {
  const [isInSession, setIsInSession] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  const handleSessionComplete = (data) => {
    setSessionData(data);
    setIsInSession(false);
    
    // Log to wellness analytics
    console.log('Meditation completed:', data);
    
    // Show completion celebration
    showCompletionFeedback(data);
  };

  return (
    <div className="meditation-space">
      <h1>Mindfulness & Meditation</h1>
      
      {!isInSession ? (
        <div className="meditation-setup">
          <MeditationTimer
            onSessionStart={() => setIsInSession(true)}
            onSessionComplete={handleSessionComplete}
            className="meditation-timer-main"
          />
          
          <div className="quick-actions">
            <Button variant="calm" onClick={() => startQuickSession(5)}>
              5 Min Quick Session
            </Button>
            <Button variant="gentle" onClick={() => startGuidedSession()}>
              Guided Breathing
            </Button>
          </div>
        </div>
      ) : (
        <div className="active-session">
          <BreathingAnimation 
            pattern="4-7-8"
            isActive={isInSession}
          />
          <AmbientSoundPlayer 
            soundType="nature"
            volume={0.3}
          />
        </div>
      )}
      
      {sessionData && (
        <div className="session-summary">
          <h3>Great job! 🧘‍♀️</h3>
          <p>You meditated for {sessionData.actualDuration} minutes</p>
          <Button variant="outline" onClick={() => logToJournal(sessionData)}>
            Add to Wellness Journal
          </Button>
        </div>
      )}
    </div>
  );
}
```

### Admin Crisis Monitoring

```tsx
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminData } from '@/contexts/AdminDataContext';

function CrisisMonitoringDashboard() {
  const { crisisAlerts, handleCrisisAlert, students } = useAdminData();
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    // Filter high-priority alerts
    const urgent = crisisAlerts.filter(alert => 
      alert.severity === 'crisis' || alert.severity === 'high'
    );
    setActiveAlerts(urgent);
  }, [crisisAlerts]);

  const handleEmergencyResponse = (alertId, action) => {
    switch (action) {
      case 'emergency_services':
        // Contact emergency services
        contactEmergencyServices(alertId);
        break;
      case 'immediate_counselor':
        // Dispatch available counselor
        dispatchCounselor(alertId);
        break;
      case 'family_contact':
        // Contact emergency contacts
        contactFamily(alertId);
        break;
    }
    
    handleCrisisAlert(alertId, action);
  };

  return (
    <div className="crisis-dashboard">
      <h1 className="sr-only">Crisis Monitoring Dashboard</h1>
      
      {activeAlerts.length > 0 && (
        <Alert className="crisis-alert border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{activeAlerts.length} active crisis alert(s)</strong>
            <div className="crisis-actions mt-2">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleEmergencyResponse(activeAlerts[0].id, 'emergency_services')}
              >
                Emergency Services
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEmergencyResponse(activeAlerts[0].id, 'immediate_counselor')}
              >
                Dispatch Counselor
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="alert-list">
        {activeAlerts.map((alert) => (
          <div key={alert.id} className="alert-card">
            <div className="alert-header">
              <Badge variant={alert.severity === 'crisis' ? 'destructive' : 'secondary'}>
                {alert.severity.toUpperCase()}
              </Badge>
              <span className="timestamp">{alert.timestamp}</span>
            </div>
            
            <div className="alert-content">
              <h3>Student: {alert.studentName}</h3>
              <p>{alert.triggerMessage}</p>
              
              <div className="detected-factors">
                <strong>Risk Factors:</strong>
                {alert.riskFactors.map((factor) => (
                  <Badge key={factor} variant="outline">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="alert-actions">
              <Button 
                variant="destructive"
                onClick={() => handleEmergencyResponse(alert.id, 'emergency_services')}
                aria-label={`Contact emergency services for ${alert.studentName}`}
              >
                Emergency Response
              </Button>
              <Button 
                variant="secondary"
                onClick={() => handleEmergencyResponse(alert.id, 'immediate_counselor')}
              >
                Connect Counselor
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Accessibility Patterns

### Screen Reader Announcements

```tsx
import React, { useEffect } from 'react';
import { announceToScreenReader } from '@/utils/accessibility';

function MoodSubmissionFeedback({ moodLevel, streak }) {
  useEffect(() => {
    // Announce mood submission success
    announceToScreenReader(
      `Mood logged successfully. Current level: ${moodLevel}. Tracking streak: ${streak} days.`,
      'polite'
    );
  }, [moodLevel, streak]);

  return (
    <div className="mood-feedback" role="status" aria-live="polite">
      <p>Mood logged for today!</p>
      <p>You're on a {streak}-day tracking streak 🎉</p>
    </div>
  );
}
```

### Keyboard Navigation

```tsx
import React, { useRef } from 'react';
import { KeyboardNavigationManager } from '@/utils/accessibility';
import { Button } from '@/components/ui/button';

function MoodSelector({ onMoodSelect }) {
  const moodButtonsRef = useRef([]);
  const navigationManager = useRef(null);

  useEffect(() => {
    navigationManager.current = new KeyboardNavigationManager(
      moodButtonsRef.current
    );
  }, []);

  const handleKeyDown = (event) => {
    navigationManager.current?.handleKeyDown(event);
  };

  return (
    <div 
      className="mood-selector" 
      onKeyDown={handleKeyDown}
      role="radiogroup"
      aria-label="Select your current mood level"
    >
      {[1, 2, 3, 4, 5].map((mood) => (
        <Button
          key={mood}
          ref={(el) => moodButtonsRef.current[mood - 1] = el}
          variant="outline"
          role="radio"
          aria-checked={selectedMood === mood}
          aria-label={`Mood level ${mood}: ${moodEmojis[mood].label}`}
          onClick={() => onMoodSelect(mood)}
        >
          {moodEmojis[mood].emoji}
        </Button>
      ))}
    </div>
  );
}
```

## Crisis-Aware Patterns

### Emergency Detection & Response

```tsx
import React, { useState, useEffect } from 'react';
import ChatWidget from '@/components/chat/ChatWidget';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

function CrisisAwareInterface() {
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [emergencyContacts] = useState({
    crisis: '988', // National Suicide Prevention Lifeline
    emergency: '911',
    campus: '555-HELP'
  });

  const handleCrisisDetection = (level, details) => {
    if (level === 'crisis') {
      setCrisisDetected(true);
      
      // Log for immediate response
      console.error('CRISIS DETECTED:', details);
      
      // Notify administrators
      notifyEmergencyTeam(details);
      
      // Show immediate resources
      showEmergencyResources();
    }
  };

  return (
    <div className="crisis-aware-interface">
      <ChatWidget 
        onCrisisDetected={handleCrisisDetection}
        emergencyContacts={emergencyContacts}
      />
      
      {crisisDetected && (
        <div className="emergency-overlay" role="alert" aria-live="assertive">
          <Alert className="border-red-600 bg-red-50">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription>
              <h3 className="font-bold text-red-800">Immediate Support Available</h3>
              <p>If you're in crisis, please reach out for help right now:</p>
              
              <div className="emergency-buttons mt-3 space-y-2">
                <Button 
                  variant="destructive" 
                  size="lg"
                  onClick={() => window.open(`tel:${emergencyContacts.crisis}`)}
                  className="w-full"
                >
                  Crisis Hotline: {emergencyContacts.crisis}
                </Button>
                
                <Button 
                  variant="destructive"
                  size="lg" 
                  onClick={() => window.open(`tel:${emergencyContacts.emergency}`)}
                  className="w-full"
                >
                  Emergency: {emergencyContacts.emergency}
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={() => connectToCounselor()}
                  className="w-full"
                >
                  Connect to Counselor Now
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
```

## Integration Best Practices

### State Management

```tsx
// Use context for app-wide state
import { AdminDataProvider } from '@/contexts/AdminDataContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider } from '@/contexts/MusicContext';

function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <AdminDataProvider>
          <Router>
            <Routes>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/sessions" element={<VideoSessions />} />
            </Routes>
          </Router>
        </AdminDataProvider>
      </MusicProvider>
    </ThemeProvider>
  );
}
```

### Error Handling

```tsx
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

function ErrorBoundary({ children, fallback }) {
  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <Alert className="border-orange-500 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <h3>Something went wrong</h3>
            <p>Don't worry - your data is safe. Please try again.</p>
            <Button variant="outline" onClick={retry} className="mt-2">
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
```

This documentation provides practical, copy-paste examples for implementing Mind Care components with proper accessibility, crisis awareness, and mental health considerations.
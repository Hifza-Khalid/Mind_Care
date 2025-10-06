# Error Handling Implementation Guide

## Overview

This document outlines the comprehensive error handling system implemented for the Mind Care mental health platform. The system provides crisis-aware error boundaries, user-friendly fallback UIs, and robust error reporting with privacy considerations.

## Architecture

### Core Components

1. **Error Boundary System** (`src/components/error/ErrorBoundary.tsx`)
   - `ErrorBoundary` - Main error boundary class component
   - `PageErrorBoundary` - Page-level error handling
   - `ComponentErrorBoundary` - Component-level error handling
   - `CriticalErrorBoundary` - High-priority error handling

2. **Fallback UI Components** (`src/components/error/FallbackComponents.tsx`)
   - `NetworkErrorFallback` - Connection issues
   - `ComponentErrorFallback` - Component-specific errors
   - `DataErrorFallback` - Data loading/saving errors
   - `PermissionErrorFallback` - Access control issues
   - `AuthenticationErrorFallback` - Login/session errors
   - `ServerErrorFallback` - 5xx server errors
   - `MaintenanceFallback` - Scheduled maintenance
   - `GenericErrorFallback` - Catch-all error UI

3. **Error Handling Hooks** (`src/hooks/useErrorHandling.ts`)
   - `useErrorHandler` - Main error handling hook
   - `useAsyncError` - Async error propagation
   - `useRetry` - Retry mechanisms with backoff
   - `useCrisisDetection` - Mental health crisis detection
   - `useNetworkError` - Network-specific error handling
   - `useFormError` - Form validation and submission errors

4. **Error Reporting Service** (`src/services/errorReportingService.ts`)
   - Privacy-compliant error reporting
   - Error classification and severity assessment
   - Crisis detection and response
   - Rate limiting and deduplication

## Mental Health-Specific Features

### Crisis Detection

The system automatically detects potential crisis situations based on:

- Error message content analysis
- User behavior patterns
- Component context (e.g., mood tracking errors)
- Error severity and frequency

When a crisis is detected:
- Immediate access to crisis resources (988, 741741)
- Emergency AI chat availability
- Enhanced error messaging with supportive tone
- Escalated error reporting for immediate attention

### Supportive Error Messaging

All error messages are crafted with mental health considerations:

```tsx
// Crisis-aware messaging
const messages = {
  network: "We're having trouble connecting, but help is still available. If this is urgent, please call 988.",
  general: "Something unexpected happened, but you're safe. We're here to help."
};
```

### Privacy Protection

- User data sanitization in error reports
- Anonymized error tracking
- HIPAA-compliant error logging
- Opt-out mechanisms for privacy-conscious users

## Implementation Examples

### Basic Error Boundary Usage

```tsx
import { ErrorBoundary } from '@/components/error';

function MyComponent() {
  return (
    <ErrorBoundary
      componentName="MoodTracker"
      showCrisisResources={true}
      onError={(error, errorInfo, errorId) => {
        console.log('Error reported:', errorId);
      }}
    >
      <MoodTrackingWidget />
    </ErrorBoundary>
  );
}
```

### Component-Level Error Handling

```tsx
import { ComponentErrorBoundary } from '@/components/error';

function DashboardWidget() {
  return (
    <ComponentErrorBoundary componentName="Dashboard Widget">
      <ComplexComponent />
    </ComponentErrorBoundary>
  );
}
```

### Hook-Based Error Handling

```tsx
import { useErrorHandler, useCrisisDetection } from '@/hooks/useErrorHandling';

function MyComponent() {
  const { handleError } = useErrorHandler();
  const { checkForCrisis } = useCrisisDetection();

  const handleSubmit = async (data) => {
    try {
      await submitData(data);
    } catch (error) {
      // Automatic crisis detection and reporting
      await handleError(error, {
        context: { component: 'DataSubmission', action: 'submit' }
      });
      
      // Check if crisis intervention is needed
      const isCrisis = checkForCrisis(error, { userInput: data.message });
    }
  };
}
```

### Async Operations with Retry

```tsx
import { useAsyncOperation } from '@/hooks/useErrorHandling';

function AsyncComponent() {
  const { execute, loading, error, data } = useAsyncOperation(
    async () => {
      const response = await fetch('/api/mood-data');
      if (!response.ok) throw new Error('Failed to load mood data');
      return response.json();
    },
    {
      retryConfig: { maxAttempts: 3, initialDelay: 1000 }
    }
  );

  return (
    <div>
      {loading && <LoadingSkeleton />}
      {error && <DataErrorFallback onRetry={execute} />}
      {data && <MoodDisplay data={data} />}
    </div>
  );
}
```

### Form Error Handling

```tsx
import { useFormError } from '@/hooks/useErrorHandling';

function ContactForm() {
  const { 
    fieldErrors, 
    generalError, 
    handleSubmissionError,
    setFieldError,
    clearAllErrors 
  } = useFormError();

  const handleSubmit = async (formData) => {
    try {
      clearAllErrors();
      await submitForm(formData);
    } catch (error) {
      await handleSubmissionError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        className={fieldErrors.email ? 'border-red-500' : ''} 
      />
      {fieldErrors.email && (
        <span className="text-red-500">{fieldErrors.email}</span>
      )}
      
      {generalError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription>{generalError}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
```

## Fallback UI Patterns

### Network Errors

```tsx
<NetworkErrorFallback 
  offline={true}
  onRetry={handleRetry}
  showCrisisResources={true}
  customMessage="Connection lost. Crisis resources remain available below."
/>
```

### Data Loading Errors

```tsx
<DataErrorFallback 
  dataType="mood history"
  action="loading"
  onRetry={retryLoad}
  customMessage="Unable to load your mood data. Your information is safe."
/>
```

### Permission Errors

```tsx
<PermissionErrorFallback 
  resourceName="therapy sessions"
  suggestedAction="Please contact your therapist or support team."
  onContactSupport={openSupportChat}
/>
```

## Best Practices

### 1. Wrap Critical Components

Always wrap important components with appropriate error boundaries:

```tsx
// High-priority components
<CriticalErrorBoundary>
  <CrisisDetectionWidget />
</CriticalErrorBoundary>

// Regular components
<ComponentErrorBoundary componentName="MoodChart">
  <MoodVisualization />
</ComponentErrorBoundary>
```

### 2. Provide Context

Include relevant context in error handling:

```tsx
handleError(error, {
  context: {
    component: 'MoodTracker',
    action: 'saveMood',
    moodValue: selectedMood,
    timestamp: new Date(),
    mentalHealthContext: {
      crisisIndicators: checkForCrisisKeywords(userInput)
    }
  }
});
```

### 3. Mental Health Considerations

- Always provide crisis resources for severe errors
- Use calm, supportive language in error messages
- Avoid technical jargon that might increase anxiety
- Ensure offline access to emergency resources

### 4. Privacy Protection

```tsx
// Sanitize sensitive data before reporting
const sanitizedContext = {
  ...context,
  userId: hashUserId(context.userId),
  sensitiveData: '[REDACTED]'
};
```

### 5. Graceful Degradation

```tsx
// Provide alternative functionality when main feature fails
{error ? (
  <SimpleMoodSelector onMoodSelect={handleFallbackMood} />
) : (
  <AdvancedMoodTracker />
)}
```

## Crisis Response Protocols

### Automatic Crisis Detection

The system monitors for crisis-related patterns:

```typescript
const CRISIS_KEYWORDS = [
  'self-harm', 'suicide', 'hurt myself', 'end it all',
  'no point', 'give up', 'can\'t go on'
];

const detectCrisis = (text: string): boolean => {
  return CRISIS_KEYWORDS.some(keyword => 
    text.toLowerCase().includes(keyword)
  );
};
```

### Crisis Response UI

When crisis is detected, the system displays:

1. **Immediate Resources**
   - 988 Suicide & Crisis Lifeline
   - Crisis Text Line (741741)
   - Emergency AI Chat

2. **Supportive Messaging**
   - "You're not alone"
   - "Help is available right now"
   - "This is temporary"

3. **Enhanced Accessibility**
   - Large, visible crisis buttons
   - High contrast colors
   - Clear, simple language

## Testing Error Handling

### Error Boundary Demo

Visit `/app/error-demo` to interact with:
- Different error boundary types
- Various fallback UI components
- Crisis detection scenarios
- Hook-based error handling

### Manual Testing

```tsx
// Trigger different error types for testing
const triggerNetworkError = () => {
  throw new Error('Network request failed');
};

const triggerCrisisError = () => {
  throw new Error('Crisis detected: self-harm indicators');
};

const triggerValidationError = () => {
  throw new Error('Validation failed: invalid input');
};
```

## Monitoring and Analytics

### Error Metrics

Track important error metrics:
- Error frequency by component
- Crisis detection rates
- User recovery actions (retry, contact support)
- Error resolution times

### Privacy-Compliant Logging

```typescript
const errorReport = {
  errorId: generateUniqueId(),
  type: classifyError(error),
  severity: assessSeverity(error),
  component: 'MoodTracker',
  userId: hashUserId(userId), // Anonymized
  timestamp: new Date(),
  context: sanitizeContext(context),
  resolved: false
};
```

## Integration with External Services

### Error Reporting Services

Configure error reporting (optional):

```typescript
errorReportingService.updateConfig({
  enableReporting: true,
  reportingEndpoint: '/api/errors',
  privacyMode: true,
  crisisDetectionEnabled: true
});
```

### Crisis Hotline Integration

```typescript
// Automatic hotline dialing (mobile)
const callCrisisLine = () => {
  if (window.location.protocol === 'tel:') {
    window.location.href = 'tel:988';
  }
};
```

## Accessibility Compliance

All error handling components follow WCAG 2.1 AA guidelines:

- Screen reader compatibility
- Keyboard navigation support
- High contrast color schemes
- Clear, descriptive ARIA labels
- Focus management during errors

## Conclusion

The error handling system provides comprehensive protection for users of the Mind Care platform while maintaining the supportive, crisis-aware approach essential for mental health applications. The system prioritizes user safety, privacy, and accessibility while providing developers with powerful tools for managing application errors.

For questions or suggestions regarding error handling, please contact the development team or refer to the interactive demo at `/app/error-demo`.
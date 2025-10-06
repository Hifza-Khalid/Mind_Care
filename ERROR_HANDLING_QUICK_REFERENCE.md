# Error Handling Quick Reference - Mind Care Platform

## 🚀 Quick Start

### Basic Error Boundary
```tsx
import { ErrorBoundary } from '@/components/error';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Component Error Boundary
```tsx
import { ComponentErrorBoundary } from '@/components/error';

<ComponentErrorBoundary componentName="MoodTracker">
  <MoodTrackerWidget />
</ComponentErrorBoundary>
```

### Error Handler Hook
```tsx
import { useErrorHandler } from '@/hooks/useErrorHandling';

const { handleError } = useErrorHandler();

try {
  await riskyOperation();
} catch (error) {
  handleError(error);
}
```

## 🛡️ Error Boundary Types

| Component | Use Case | Crisis Support |
|-----------|----------|----------------|
| `ErrorBoundary` | General purpose | ✅ Configurable |
| `ComponentErrorBoundary` | Widget-level | ✅ Yes |
| `PageErrorBoundary` | Page-level | ✅ Yes |
| `CriticalErrorBoundary` | High-priority | ✅ Always |

## 🎯 Fallback Components

| Component | Scenario | Example |
|-----------|----------|---------|
| `NetworkErrorFallback` | Connection issues | `<NetworkErrorFallback offline={true} />` |
| `DataErrorFallback` | Data loading | `<DataErrorFallback dataType="mood history" />` |
| `ComponentErrorFallback` | Widget failure | `<ComponentErrorFallback componentName="Chart" />` |
| `AuthenticationErrorFallback` | Login issues | `<AuthenticationErrorFallback sessionExpired />` |

## 🪝 Essential Hooks

```tsx
// Main error handler
const { handleError, getUserMessage } = useErrorHandler();

// Crisis detection
const { checkForCrisis, crisisDetected } = useCrisisDetection();

// Retry with backoff
const { execute, loading, error } = useAsyncOperation(asyncFn);

// Form error handling
const { fieldErrors, handleSubmissionError } = useFormError();

// Network awareness
const { isOnline, handleNetworkError } = useNetworkError();
```

## 🧠 Crisis Detection

Crisis keywords automatically trigger enhanced support:
- `self-harm`, `suicide`, `hurt myself`
- `no point`, `give up`, `can't go on`

### Crisis Response
When detected, users get immediate access to:
- 🆘 **988 Crisis Lifeline** 
- 💬 **Crisis Text Line (741741)**
- 🤖 **Emergency AI Chat**

## 📱 Crisis Resources (Always Available)

```tsx
// Emergency contacts
<Button onClick={() => window.open('tel:988')}>
  Call 988 Crisis Lifeline
</Button>

<Button onClick={() => window.open('sms:741741')}>  
  Text Crisis Line
</Button>

<Button onClick={() => navigate('/app/chat')}>
  Emergency AI Chat
</Button>
```

## 🎨 Mental Health UX Principles

### ✅ Do's
- Use calm, supportive language
- Provide immediate crisis resources
- Show "Your data is safe" messages
- Offer multiple recovery options
- Respect `prefers-reduced-motion`

### ❌ Don'ts  
- Show technical error details to users
- Use alarming or panic-inducing language
- Block access to crisis resources
- Make users feel trapped or helpless
- Ignore accessibility requirements

## 🔒 Privacy Protection

Error reports automatically sanitize:
- Email addresses → `[EMAIL]`
- SSN format → `[SSN]`  
- Credit cards → `[CARD]`
- Auth tokens → `[REDACTED]`
- User IDs → Hashed

## 🧪 Testing

Visit `/app/error-demo` to test:
- Different error boundary types
- Fallback UI components  
- Crisis detection scenarios
- Hook-based error handling
- Retry mechanisms

## 📚 Import Paths

```tsx
// Error boundaries & fallbacks
import { 
  ErrorBoundary, 
  NetworkErrorFallback, 
  ComponentErrorFallback 
} from '@/components/error';

// Error handling hooks  
import { 
  useErrorHandler, 
  useCrisisDetection, 
  useAsyncOperation 
} from '@/hooks/useErrorHandling';

// Error reporting service
import { errorReportingService } from '@/services/errorReportingService';
```

## ⚡ Common Patterns

### Async API Calls
```tsx
const { execute, loading, error } = useAsyncOperation(
  () => fetch('/api/mood-data').then(r => r.json()),
  { retryConfig: { maxAttempts: 3 } }
);

if (loading) return <LoadingSkeleton />;
if (error) return <DataErrorFallback onRetry={execute} />;
return <DataDisplay data={data} />;
```

### Form Submission
```tsx
const { handleSubmissionError } = useFormError();

const onSubmit = async (data) => {
  try {
    await submitForm(data);
  } catch (error) {
    handleSubmissionError(error);
  }
};
```

### Component Protection  
```tsx
<ComponentErrorBoundary componentName="MoodChart">
  <MoodVisualizationChart data={moodData} />
</ComponentErrorBoundary>
```

## 🎉 Key Benefits

- 🛡️ **User Safety**: Crisis resources always accessible
- 🧠 **Mental Health Focused**: Supportive, anxiety-reducing UX
- 🔒 **Privacy Compliant**: HIPAA-conscious error handling
- ♿ **Accessible**: WCAG 2.1 AA compliant interfaces
- 🔧 **Developer Friendly**: Simple hooks and components
- 📊 **Production Ready**: Comprehensive error tracking

---

**Need help?** Check the full documentation in `ERROR_HANDLING_GUIDE.md` or visit `/app/error-demo` for interactive examples!
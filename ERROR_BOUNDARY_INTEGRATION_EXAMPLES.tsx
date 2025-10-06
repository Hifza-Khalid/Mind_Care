/**
 * @fileoverview Error Boundary Integration Examples
 * 
 * Practical examples of how to integrate error boundaries throughout the Mind Care platform.
 * Shows real-world integration patterns for different component types and use cases.
 * 
 * This file serves as a reference guide for developers implementing error handling
 * in existing and new components throughout the application.
 */

import React from 'react';
import { 
  ErrorBoundary, 
  ComponentErrorBoundary, 
  CriticalErrorBoundary,
  NetworkErrorFallback,
  DataErrorFallback,
  ComponentErrorFallback
} from '@/components/error';
import { 
  useErrorHandler, 
  useCrisisDetection, 
  useAsyncOperation,
  useFormError 
} from '@/hooks/useErrorHandling';

/**
 * Example 1: Dashboard Widget Integration
 * Wraps mood tracking widgets with component-level error boundaries
 */
export const MoodTrackingDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Critical mood tracking component */}
      <CriticalErrorBoundary>
        <MoodTrackerWidget />
      </CriticalErrorBoundary>

      {/* Standard mood analytics */}
      <ComponentErrorBoundary componentName="Mood Analytics">
        <MoodAnalyticsWidget />
      </ComponentErrorBoundary>

      {/* Mood trend visualization */}
      <ComponentErrorBoundary componentName="Mood Trends">
        <MoodTrendsChart />
      </ComponentErrorBoundary>
    </div>
  );
};

/**
 * Example 2: Form with Crisis Detection
 * Integrates error handling with crisis detection for user input forms
 */
export const CrisisAwareContactForm: React.FC = () => {
  const { 
    fieldErrors, 
    generalError, 
    handleSubmissionError,
    setFieldError,
    clearAllErrors 
  } = useFormError();
  
  const { checkForCrisis } = useCrisisDetection();
  const { handleError } = useErrorHandler({ componentName: 'ContactForm' });

  const handleSubmit = async (formData: { message: string; email: string }) => {
    try {
      clearAllErrors();
      
      // Check for crisis indicators in user message
      const isCrisis = checkForCrisis(
        new Error('User input analysis'), 
        { 
          mentalHealthContext: { 
            crisisIndicators: containsCrisisKeywords(formData.message) 
          } 
        }
      );

      if (isCrisis) {
        // Show immediate crisis resources while still processing form
        showCrisisResourcesModal();
      }

      await submitContactForm(formData);
    } catch (error) {
      await handleSubmissionError(error as Error);
    }
  };

  return (
    <ErrorBoundary
      componentName="ContactForm"
      showCrisisResources={true}
      onError={(error, errorInfo, errorId) => {
        // Log form errors for analysis
        console.log('Contact form error:', { error, errorId });
      }}
    >
      <form onSubmit={(e) => { 
        e.preventDefault(); 
        handleSubmit(getFormData(e.target)); 
      }}>
        {/* Form fields with error handling */}
        <input 
          type="email" 
          className={fieldErrors.email ? 'border-red-500' : ''} 
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
        />
        {fieldErrors.email && (
          <div id="email-error" className="text-red-500 text-sm">
            {fieldErrors.email}
          </div>
        )}

        <textarea 
          name="message"
          className={fieldErrors.message ? 'border-red-500' : ''}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? 'message-error' : undefined}
          placeholder="Tell us how we can help..."
        />
        {fieldErrors.message && (
          <div id="message-error" className="text-red-500 text-sm">
            {fieldErrors.message}
          </div>
        )}

        {generalError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            {generalError}
          </div>
        )}

        <button type="submit">Send Message</button>
      </form>
    </ErrorBoundary>
  );
};

/**
 * Example 3: Async Data Loading with Retry
 * Shows how to handle async operations with automatic retry and fallback UIs
 */
export const MoodHistoryLoader: React.FC<{ userId: string }> = ({ userId }) => {
  const { execute, loading, error, data } = useAsyncOperation(
    async () => {
      const response = await fetch(`/api/users/${userId}/mood-history`);
      if (!response.ok) {
        throw new Error(`Failed to load mood history: ${response.statusText}`);
      }
      return response.json();
    },
    {
      retryConfig: { 
        maxAttempts: 3, 
        initialDelay: 1000,
        backoffMultiplier: 2 
      },
      onError: (error) => {
        console.error('Mood history loading failed:', error);
      }
    }
  );

  // Execute on mount
  React.useEffect(() => {
    execute();
  }, [userId, execute]);

  if (loading) {
    return <MoodHistoryLoadingSkeleton />;
  }

  if (error) {
    return (
      <DataErrorFallback
        dataType="mood history"
        action="loading"
        onRetry={execute}
        showCrisisResources={true}
        customMessage="We couldn't load your mood history. Your data is safe and secure."
      />
    );
  }

  if (!data) {
    return <div>No mood history available</div>;
  }

  return <MoodHistoryVisualization data={data} />;
};

/**
 * Example 4: Network-Aware Component
 * Handles network connectivity issues gracefully
 */
export const OnlineStatusAwareMoodTracker: React.FC = () => {
  const { isOnline, networkError, handleNetworkError } = useNetworkError();
  const [moodData, setMoodData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const saveMood = async (moodValue: number, note: string) => {
    if (!isOnline) {
      // Save to local storage for sync later
      saveToLocalStorage({ moodValue, note, timestamp: new Date() });
      showOfflineNotification();
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: moodValue, note })
      });
      
      showSuccessNotification('Mood saved successfully');
    } catch (error) {
      await handleNetworkError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  if (networkError && !isOnline) {
    return (
      <NetworkErrorFallback
        offline={true}
        onRetry={() => window.location.reload()}
        showCrisisResources={true}
        customMessage="You're offline. Your mood data will sync when reconnected."
      />
    );
  }

  return (
    <ComponentErrorBoundary componentName="MoodTracker">
      <MoodTrackerInterface 
        onSaveMood={saveMood}
        loading={loading}
        disabled={!isOnline && !hasOfflineSupport()}
      />
    </ComponentErrorBoundary>
  );
};

/**
 * Example 5: Chat Interface with Crisis Detection
 * AI chat with real-time crisis detection and intervention
 */
export const CrisisAwareChatInterface: React.FC = () => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  
  const { checkForCrisis, crisisDetected, getCrisisResources } = useCrisisDetection();
  const { handleError } = useErrorHandler({ componentName: 'ChatInterface' });

  const sendMessage = async (message: string) => {
    try {
      // Add user message
      const userMessage = { id: Date.now(), text: message, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);

      // Check for crisis indicators
      const isCrisis = checkForCrisis(new Error('Chat analysis'), {
        mentalHealthContext: {
          crisisIndicators: containsCrisisKeywords(message)
        }
      });

      if (isCrisis) {
        // Immediate crisis intervention
        const crisisMessage = {
          id: Date.now() + 1,
          text: "I notice you might be going through a difficult time. You're not alone. Would you like me to connect you with immediate support resources?",
          sender: 'ai',
          type: 'crisis-intervention'
        };
        setMessages(prev => [...prev, crisisMessage]);
        showCrisisResourcesPanel();
      }

      // Send to AI service
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, crisisContext: isCrisis })
      });

      const aiResponse = await response.json();
      const aiMessage = {
        id: Date.now() + 2,
        text: aiResponse.message,
        sender: 'ai'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setInputValue('');
    } catch (error) {
      await handleError(error as Error, {
        context: {
          action: 'sendChatMessage',
          messageLength: message.length,
          crisisDetected
        }
      });
    }
  };

  return (
    <ErrorBoundary
      variant="default"
      componentName="ChatInterface"
      showCrisisResources={true}
    >
      <div className="chat-container">
        <div className="messages">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        {crisisDetected && (
          <div className="crisis-resources-banner">
            <h3>Immediate Support Available</h3>
            <div className="crisis-buttons">
              <button onClick={() => window.open('tel:988')}>
                Call 988 Crisis Lifeline
              </button>
              <button onClick={() => window.open('sms:741741')}>
                Text Crisis Line
              </button>
            </div>
          </div>
        )}

        <div className="input-area">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
            placeholder="Type your message..."
            aria-label="Chat message input"
          />
          <button 
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

/**
 * Example 6: Page-Level Error Boundary Integration
 * Shows how to wrap entire pages with appropriate error boundaries
 */
export const TherapySessionsPage: React.FC = () => {
  return (
    <ErrorBoundary
      variant="page"
      componentName="TherapySessionsPage"
      showCrisisResources={true}
      onError={(error, errorInfo, errorId) => {
        // Page-level error tracking
        trackPageError('therapy-sessions', errorId, error);
      }}
    >
      <div className="page-content">
        <h1>Your Therapy Sessions</h1>
        
        {/* Upcoming sessions with error boundary */}
        <ComponentErrorBoundary componentName="UpcomingSessions">
          <UpcomingSessionsWidget />
        </ComponentErrorBoundary>

        {/* Session history with retry capability */}
        <ComponentErrorBoundary componentName="SessionHistory">
          <SessionHistoryLoader />
        </ComponentErrorBoundary>

        {/* Therapist notes (critical component) */}
        <CriticalErrorBoundary>
          <TherapistNotesViewer />
        </CriticalErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

/**
 * Example 7: Higher-Order Component for Error Handling
 * Creates a reusable HOC for adding error boundaries to any component
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    componentName?: string;
    variant?: 'default' | 'minimal' | 'page' | 'critical';
    showCrisisResources?: boolean;
    onError?: (error: Error, errorInfo: React.ErrorInfo, errorId: string) => void;
  }
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary
        variant={options?.variant || 'default'}
        componentName={options?.componentName || WrappedComponent.displayName || 'Component'}
        showCrisisResources={options?.showCrisisResources !== false}
        onError={options?.onError}
      >
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// Usage of HOC
const SafeMoodTracker = withErrorBoundary(MoodTrackerWidget, {
  componentName: 'MoodTracker',
  variant: 'default',
  showCrisisResources: true
});

/**
 * Example 8: Custom Hook for Component Error Handling
 * Provides error handling functionality to any component
 */
export function useSafeAsyncOperation<T>(
  operation: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const { handleError } = useErrorHandler();

  const execute = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      await handleError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  React.useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, retry: execute };
}

// Usage of custom hook
export const UserProfileLoader: React.FC<{ userId: string }> = ({ userId }) => {
  const { data, loading, error, retry } = useSafeAsyncOperation(
    () => fetch(`/api/users/${userId}`).then(res => res.json()),
    [userId]
  );

  if (loading) return <UserProfileSkeleton />;
  if (error) return (
    <ComponentErrorFallback 
      componentName="User Profile"
      onRetry={retry}
    />
  );
  if (!data) return <div>No profile data found</div>;

  return <UserProfileDisplay profile={data} />;
};

// Utility functions (would be implemented elsewhere)
function containsCrisisKeywords(text: string): boolean {
  const crisisKeywords = ['suicide', 'self-harm', 'hurt myself', 'end it all'];
  return crisisKeywords.some(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}

function getFormData(form: EventTarget): { message: string; email: string } {
  const formData = new FormData(form as HTMLFormElement);
  return {
    message: formData.get('message') as string,
    email: formData.get('email') as string
  };
}

function showCrisisResourcesModal(): void {
  // Implementation would show modal with crisis resources
}

function submitContactForm(data: { message: string; email: string }): Promise<void> {
  return fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => {
    if (!res.ok) throw new Error('Failed to submit form');
  });
}

function saveToLocalStorage(data: any): void {
  localStorage.setItem('offline-mood-data', JSON.stringify(data));
}

function showOfflineNotification(): void {
  // Show user-friendly offline notification
}

function showSuccessNotification(message: string): void {
  // Show success toast/notification
}

function hasOfflineSupport(): boolean {
  return 'serviceWorker' in navigator;
}

function showCrisisResourcesPanel(): void {
  // Show crisis resources in chat interface
}

function trackPageError(page: string, errorId: string, error: Error): void {
  // Track page-level errors for analytics
}

// Placeholder components (would be real components in the app)
const MoodTrackerWidget: React.FC = () => <div>Mood Tracker Widget</div>;
const MoodAnalyticsWidget: React.FC = () => <div>Mood Analytics Widget</div>;
const MoodTrendsChart: React.FC = () => <div>Mood Trends Chart</div>;
const MoodHistoryLoadingSkeleton: React.FC = () => <div>Loading...</div>;
const MoodHistoryVisualization: React.FC<{ data: any }> = () => <div>Mood History</div>;
const MoodTrackerInterface: React.FC<any> = () => <div>Mood Tracker</div>;
const ChatMessage: React.FC<{ message: any }> = () => <div>Chat Message</div>;
const UpcomingSessionsWidget: React.FC = () => <div>Upcoming Sessions</div>;
const SessionHistoryLoader: React.FC = () => <div>Session History</div>;
const TherapistNotesViewer: React.FC = () => <div>Therapist Notes</div>;
const UserProfileSkeleton: React.FC = () => <div>Loading profile...</div>;
const UserProfileDisplay: React.FC<{ profile: any }> = () => <div>User Profile</div>;

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  type?: 'crisis-intervention';
}

export default {
  MoodTrackingDashboard,
  CrisisAwareContactForm,
  MoodHistoryLoader,
  OnlineStatusAwareMoodTracker,
  CrisisAwareChatInterface,
  TherapySessionsPage,
  withErrorBoundary,
  useSafeAsyncOperation
};
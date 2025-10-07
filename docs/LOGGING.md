# Logging Service Documentation

The Mind Care application uses a structured logging service instead of direct console.log statements. This provides better control over logging in different environments and enables future integration with external logging services.

## Usage

### Basic Import

```typescript
import { logger } from '@/services/logger';
// or import specific convenience functions
import { logAudioError, logVideoCall, logMeditation } from '@/services/logger';
```

### Logging Methods

#### General Methods
```typescript
// Debug level (only shown in development)
logger.debug('CATEGORY', 'Debug message', { additionalData: 'value' });

// Info level
logger.info('CATEGORY', 'Info message', { userId: 123 });

// Warning level
logger.warn('CATEGORY', 'Warning message', { warningData: 'value' });

// Error level
logger.error('CATEGORY', 'Error message', new Error('Something went wrong'), { context: 'data' });
```

#### Specialized Methods
```typescript
// Audio-related errors
logAudioError('Failed to play track', error, { trackId: 'track_001' });

// Video call events
logVideoCall('User joined session', { sessionId: 'session_123', userId: 'user_456' });
logVideoCallError('WebRTC connection failed', error, { sessionId: 'session_123' });

// Meditation tracking
logMeditation('Session completed', { duration: 300, type: 'mindfulness' });

// Study group events
logStudyGroup('User joined group', { groupId: 'group_001', userId: 'user_123' });

// User preferences
logUserPrefs('Preferences saved', { theme: 'dark', notifications: true });

// Performance monitoring
logPerformance('Component render time', { component: 'MoodTracker', duration: 45 });
```

## Log Levels

- **DEBUG (0)**: Detailed information for debugging (development only)
- **INFO (1)**: General informational messages
- **WARN (2)**: Warning messages for potential issues
- **ERROR (3)**: Error messages for actual problems

## Environment Behavior

### Development Mode
- All log levels are output to console
- Detailed formatting with timestamps and categories
- Full log history is maintained

### Production Mode
- Only WARN and ERROR levels are output to console
- ERROR logs can be sent to external services
- Reduced console output for performance

## Configuration

### Setting Log Level
```typescript
import { logger, LogLevel } from '@/services/logger';

// Set minimum log level
logger.setLogLevel(LogLevel.WARN); // Only show warnings and errors
```

### Accessing Log History
```typescript
// Get all logged entries
const history = logger.getLogHistory();

// Clear log history
logger.clearHistory();
```

## Integration with External Services

The logging service is designed to integrate with external logging and error tracking services:

```typescript
// Example integration (in logger.ts)
private sendToExternalService(entry: LogEntry): void {
  if (!this.isDevelopment && entry.level >= LogLevel.ERROR) {
    // Send to Sentry, LogRocket, etc.
    sentryService.captureError(entry);
  }
}
```

## Migration from Console Logs

### Before (❌)
```typescript
console.log('User joined session');
console.error('Failed to load audio:', error);
console.warn('Connection quality is poor');
```

### After (✅)
```typescript
logVideoCall('User joined session', { sessionId, userId });
logAudioError('Failed to load audio', error, { trackId });
logger.warn('VIDEO_CALL', 'Connection quality is poor', { quality: 'poor' });
```

## Benefits

1. **Environment Awareness**: Different behavior in development vs production
2. **Structured Data**: Consistent log formatting and categorization
3. **Performance**: Reduced console output in production
4. **Debugging**: Log history and filtering capabilities
5. **Monitoring**: Easy integration with external services
6. **Maintenance**: Centralized logging configuration

## Best Practices

1. **Use appropriate log levels**: Debug for development, Info for normal operations, Warn for potential issues, Error for actual problems
2. **Include context**: Add relevant data objects to provide debugging context
3. **Use categories**: Consistent category naming helps with filtering and searching
4. **Avoid sensitive data**: Don't log passwords, tokens, or personal information
5. **Be descriptive**: Write clear, actionable log messages

## Examples in the Codebase

### Audio Context Logging
```typescript
// Loading preferences
logUserPrefs('Music preferences loaded successfully', { autoPlay, volume });

// Audio errors
logAudioError('Failed to play track', error, { trackId: track.id, trackName: track.title });
```

### Video Call Logging
```typescript
// Connection events
logVideoCall('WebRTC connection established', { sessionId, participants: 2 });

// Error handling
logVideoCallError('Failed to initialize camera', error, { sessionId, permissions });
```

### Meditation Tracking
```typescript
// Session completion
logMeditation('Breathing exercise completed', { 
  duration: 300, 
  technique: '4-7-8', 
  completion: 100 
});
```

This logging system provides a robust foundation for monitoring application behavior and debugging issues while maintaining good performance in production environments.
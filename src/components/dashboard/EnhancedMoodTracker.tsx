import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useMoodTracking } from '@/hooks/useDashboardFeatures';
import {
  useRealTimeUpdates,
  useSmoothAnimations,
  useStreakTracking,
} from '@/hooks/useRealTimeFeatures';
import { showRealTimeNotification, AnimatedCounter } from '@/components/dashboard/RealTimeFeedback';
import notificationService from '@/services/notificationService';
import { Heart, Smile, TrendingUp, TrendingDown, Minus, CheckCircle2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ComponentErrorBoundary } from '@/components/error/ErrorBoundary';
import { useErrorHandler } from '@/hooks/useErrorHandling';

// Loading State Components
import { 
  MoodTrackerSkeleton, 
  MoodWidgetSkeleton, 
  QuickMoodSkeleton,
  GentleSkeleton
} from '@/components/ui/loading-skeletons';
import { 
  Spinner,
  InlineSpinner
} from '@/components/ui/spinner';
import { HeartbeatLoader, GentlePulseLoader } from '@/components/ui/loading-animations';

/**
 * Enhanced MoodTracker with Loading States
 * 
 * Provides comprehensive loading states for all mood tracking interactions:
 * - Initial component loading
 * - Mood submission loading
 * - Data fetching states
 * - Real-time updates
 * 
 * @example
 * ```tsx
 * // Basic usage with loading states
 * <EnhancedMoodTracker />
 * 
 * // Loading states automatically handle:
 * // - Initial data loading with skeleton
 * // - Mood submission with inline spinner
 * // - Real-time updates with gentle animations
 * // - Error states with retry functionality
 * ```
 */

export interface EnhancedMoodTrackerProps {
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
  
  /** Force loading state for demo purposes */
  forceLoading?: boolean;
}

const moodEmojis = {
  1: {
    emoji: '😢',
    label: 'Very Sad',
    color: 'text-red-500',
    bgColor: 'bg-red-50 hover:bg-red-100',
    description: 'Feeling very down, may need support'
  },
  2: {
    emoji: '😕',
    label: 'Sad',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
    description: 'Low mood, could use some encouragement'
  },
  3: {
    emoji: '😐',
    label: 'Neutral',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
    description: 'Balanced, neither good nor bad'
  },
  4: {
    emoji: '😊',
    label: 'Happy',
    color: 'text-green-500',
    bgColor: 'bg-green-50 hover:bg-green-100',
    description: 'Feeling positive and content'
  },
  5: {
    emoji: '😄',
    label: 'Very Happy',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    description: 'Excellent mood, feeling great!'
  },
};

export const EnhancedMoodTracker: React.FC<EnhancedMoodTrackerProps> = ({
  onMoodLogged,
  compact = false,
  className,
  readOnly = false,
  forceLoading = false
}) => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Error handling
  const { handleError } = useErrorHandler({ componentName: 'MoodTracker' });

  // Hooks
  const { 
    moods, 
    addMoodEntry, 
    getTodayMood, 
    getWeeklyMoodAverage, 
    getMoodTrend 
  } = useMoodTracking();
  const { isAnimating } = useSmoothAnimations();
  const { updateStreak } = useStreakTracking();
  
  // Calculated values
  const weeklyAverage = getWeeklyMoodAverage();
  const moodStreak = moods.length; // Simple streak calculation for demo

  // Simulate initial loading
  useEffect(() => {
    if (forceLoading) {
      setIsLoading(true);
      return;
    }

    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load mood data');
        setError('Failed to load mood data');
        setIsLoading(false);
        handleError(error, {
          context: { action: 'loadMoodData' }
        });
      }
    };

    loadData();
  }, [forceLoading]);

  // Get today's mood
  const todayMood = getTodayMood();

  // Handle mood submission
  const handleMoodSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const moodData = {
        level: selectedMood,
        note: moodNote,
        timestamp: new Date(),
        streak: moodStreak + 1
      };

      addMoodEntry(selectedMood, moodNote);
      updateStreak('mood');
      
      // Show success notification
      showRealTimeNotification('success', 'Mood logged successfully! 🎉');

      // Show achievement notification for streak milestones
      if (moodStreak + 1 === 7) {
        showRealTimeNotification('achievement', 'Week Streak! 🔥 You\'ve logged your mood for 7 days straight!');
      }

      onMoodLogged?.(moodData);
      setIsDialogOpen(false);
      setSelectedMood(null);
      setMoodNote('');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save mood');
      setError('Failed to save mood. Please try again.');
      handleError(error, {
        context: {
          action: 'saveMood',
          mood: selectedMood,
          hasNote: !!moodNote
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get trend information
  const trend = getMoodTrend();

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'improving':
        return 'Improving ↗';
      case 'declining':
        return 'Needs attention ↘';
      default:
        return 'Stable →';
    }
  };

  // Show loading skeleton during initial load
  if (isLoading) {
    return <MoodTrackerSkeleton className={className} />;
  }

  // Error state with retry
  if (error && !todayMood) {
    return (
      <Card className={cn('hover:shadow-medium transition-all duration-300', className)}>
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="text-red-500 mb-2">⚠️ {error}</div>
            <Button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
              }}
              variant="outline"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'enhanced-card hover:shadow-medium transition-all duration-300',
        isAnimating ? 'scale-105 shadow-lg' : '',
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                'p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 transition-all duration-300',
                isAnimating ? 'scale-110' : ''
              )}
            >
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Mood Tracker</CardTitle>
              {moodStreak > 0 && (
                <Badge
                  variant="outline"
                  className="text-xs mt-1 bg-orange-50 text-orange-700 border-orange-200"
                >
                  <Smile className="h-3 w-3 mr-1" />
                  <AnimatedCounter value={moodStreak} suffix=" day streak" />
                </Badge>
              )}
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                disabled={readOnly}
              >
                {todayMood ? 'Update' : 'Track Mood'}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>How are you feeling today?</span>
                </DialogTitle>
                <DialogDescription>
                  Select your current mood and add any notes you'd like.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Mood Selection */}
                <div className="space-y-4">
                  <div className="text-sm font-medium text-muted-foreground">
                    Choose your mood:
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(moodEmojis).map(([value, { emoji, label, bgColor, description }]) => (
                      <div key={value} className="text-center">
                        <Button
                          onClick={() => setSelectedMood(Number(value))}
                          variant="outline"
                          size="lg"
                          className={cn(
                            'h-16 w-full p-2 flex flex-col items-center justify-center space-y-1',
                            bgColor,
                            'transition-all duration-200 hover:scale-105',
                            selectedMood === Number(value) ? 'ring-2 ring-primary border-primary' : ''
                          )}
                          title={`${label}: ${description}`}
                        >
                          <span className="text-2xl">{emoji}</span>
                          <span className="text-xs font-medium">{label}</span>
                        </Button>
                      </div>
                    ))}
                  </div>

                  {selectedMood && (
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Selected: <span className="font-medium">{moodEmojis[selectedMood].label}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {moodEmojis[selectedMood].description}
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Note */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">
                    Add a note (optional):
                  </label>
                  <Textarea
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    placeholder="What's contributing to your mood today?"
                    rows={3}
                    className="resize-none"
                    maxLength={200}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {moodNote.length}/200 characters
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="text-sm text-red-500 text-center p-2 bg-red-50 rounded">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      setIsDialogOpen(false);
                      setSelectedMood(null);
                      setMoodNote('');
                      setError(null);
                    }}
                    variant="outline"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleMoodSubmit}
                    disabled={!selectedMood || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <InlineSpinner size="sm" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Mood'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Mood Display */}
        {todayMood ? (
          <div className="flex items-center justify-center p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
            <div className="text-center">
              <div className="text-2xl mb-1">{moodEmojis[todayMood.mood].emoji}</div>
              <div className="font-medium text-sm">
                Today's mood: {moodEmojis[todayMood.mood].label}
              </div>
              {todayMood.note && (
                <div className="text-xs text-muted-foreground mt-1 italic">
                  "{todayMood.note}"
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            Track your mood today to start building insights
          </div>
        )}

        {/* Analytics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold text-primary">
              <AnimatedCounter value={weeklyAverage || 0} duration={800} />
            </div>
            <div className="text-xs text-muted-foreground">Weekly Average</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center space-x-1 font-semibold text-primary">
              {getTrendIcon()}
              <span className="text-sm">{getTrendText()}</span>
            </div>
            <div className="text-xs text-muted-foreground">Trend</div>
          </div>
        </div>

        {/* Recent Entries */}
        {moods.length > 0 && (
          <div className="pt-2 border-t space-y-2">
            <div className="text-xs text-muted-foreground mb-2">Recent entries:</div>
            <div className="flex space-x-1">
              {moods.slice(-7).map((mood, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-1"
                  title={`${mood.date}: ${moodEmojis[mood.mood].label}`}
                >
                  <span className="text-sm">{moodEmojis[mood.mood].emoji}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(mood.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Quick Mood Check-in with Loading States
 */
export const QuickMoodCheckIn: React.FC<{
  className?: string;
  onMoodSelected?: (mood: number) => void;
  loading?: boolean;
}> = ({ className, onMoodSelected, loading = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError } = useErrorHandler({ componentName: 'QuickMoodCheckIn' });
  
  if (loading) {
    return <QuickMoodSkeleton className={className} />;
  }

  const handleQuickMood = async (mood: number) => {
    setIsSubmitting(true);
    
    try {
      // Simulate quick mood submission
      await new Promise(resolve => setTimeout(resolve, 500));
      onMoodSelected?.(mood);
      
      showRealTimeNotification(
        'success',
        `Quick mood logged: ${moodEmojis[mood].emoji} ${moodEmojis[mood].label}`
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save quick mood');
      showRealTimeNotification('error', 'Failed to save mood');
      handleError(error, {
        context: {
          action: 'saveQuickMood',
          mood: mood
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn('hover:shadow-medium transition-all duration-300', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Quick Mood Check</span>
          </div>
          {isSubmitting && <InlineSpinner size="xs" />}
        </div>
        
        <div className="grid grid-cols-5 gap-1">
          {Object.entries(moodEmojis).map(([value, { emoji, label }]) => (
            <Button
              key={value}
              onClick={() => handleQuickMood(Number(value))}
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 transition-all duration-200 hover:scale-110"
              title={label}
              disabled={isSubmitting}
            >
              <span className="text-lg">{emoji}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced MoodTracker wrapped with error boundary for safe rendering
const EnhancedMoodTrackerWithErrorBoundary: React.FC<EnhancedMoodTrackerProps> = (props) => (
  <ComponentErrorBoundary componentName="Enhanced Mood Tracker">
    <EnhancedMoodTracker {...props} />
  </ComponentErrorBoundary>
);

export default EnhancedMoodTrackerWithErrorBoundary;
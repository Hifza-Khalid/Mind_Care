import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useMoodTracking } from '@/hooks/useDashboardFeatures';
import { useRealTimeUpdates, useSmoothAnimations, useStreakTracking } from '@/hooks/useRealTimeFeatures';
import { showRealTimeNotification, AnimatedCounter, ProgressFeedback } from '@/components/dashboard/RealTimeFeedback';
import { Smile, Frown, Meh, Heart, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const moodEmojis = {
  1: { emoji: '😢', label: 'Very Sad', color: 'text-red-500' },
  2: { emoji: '😕', label: 'Sad', color: 'text-orange-500' },
  3: { emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
  4: { emoji: '😊', label: 'Happy', color: 'text-green-500' },
  5: { emoji: '😄', label: 'Very Happy', color: 'text-blue-500' }
};

export const MoodTracker = () => {
  const { moods, addMoodEntry, getTodayMood, getWeeklyMoodAverage, getMoodTrend } = useMoodTracking();
  const { triggerUpdate } = useRealTimeUpdates();
  const { smoothTransition, isAnimating } = useSmoothAnimations();
  const { updateStreak, getStreak } = useStreakTracking();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const todayMood = getTodayMood();
  const weeklyAverage = getWeeklyMoodAverage();
  const trend = getMoodTrend();
  const moodStreak = getStreak('mood_tracking');

  const handleMoodSubmit = () => {
    if (selectedMood) {
      smoothTransition(() => {
        addMoodEntry(selectedMood, moodNote);
        
        // Update streak and trigger real-time updates
        const newStreak = updateStreak('mood_tracking');
        triggerUpdate('mood_logged', { mood: selectedMood, streak: newStreak });
        
        // Show success notification
        showRealTimeNotification('success', `Mood logged! ${moodEmojis[selectedMood as keyof typeof moodEmojis].label}`);
        
        // Check for streak milestones
        if (newStreak > 0 && newStreak % 7 === 0) {
          showRealTimeNotification('milestone', `🔥 ${newStreak} day mood tracking streak!`);
        }
        
        setSelectedMood(null);
        setMoodNote('');
        setIsDialogOpen(false);
      });
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'improving': return 'Improving ↗';
      case 'declining': return 'Needs attention ↘';
      default: return 'Stable →';
    }
  };

  return (
    <Card className={`enhanced-card hover:shadow-medium transition-all duration-300 ${
      isAnimating ? 'scale-105 shadow-lg' : ''
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 transition-all duration-300 ${
              isAnimating ? 'scale-110' : ''
            }`}>
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Mood Tracker</CardTitle>
              {moodStreak > 0 && (
                <Badge variant="outline" className="text-xs mt-1 bg-orange-50 text-orange-700 border-orange-200">
                  <Smile className="h-3 w-3 mr-1" />
                  <AnimatedCounter value={moodStreak} suffix=" day streak" />
                </Badge>
              )}
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-xs">
                {todayMood ? 'Update' : 'Track Mood'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>How are you feeling today?</DialogTitle>
                <DialogDescription>
                  Track your daily mood to better understand your wellbeing patterns.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(moodEmojis).map(([value, { emoji, label, color }]) => (
                    <button
                      key={value}
                      onClick={() => setSelectedMood(Number(value))}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedMood === Number(value)
                          ? 'border-primary bg-primary/10 scale-110'
                          : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                      }`}
                    >
                      <div className="text-2xl mb-1">{emoji}</div>
                      <div className={`text-xs font-medium ${color}`}>{label}</div>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Optional note:</label>
                  <Textarea
                    placeholder="What's influencing your mood today? (optional)"
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleMoodSubmit}
                    disabled={!selectedMood}
                    className="flex-1 bg-gradient-primary hover:shadow-glow"
                  >
                    Save Mood
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedMood(null);
                      setMoodNote('');
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {todayMood ? (
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{moodEmojis[todayMood.mood].emoji}</span>
                <div>
                  <div className="font-semibold text-sm">Today's Mood</div>
                  <div className={`text-xs ${moodEmojis[todayMood.mood].color}`}>
                    {moodEmojis[todayMood.mood].label}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                Logged
              </Badge>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Track your mood today to start building insights
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg transition-all duration-300 hover:scale-105">
              <div className="font-semibold text-primary">
                <AnimatedCounter value={weeklyAverage || 0} duration={800} />
              </div>
              <div className="text-xs text-muted-foreground">Weekly Average</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-center space-x-1 font-semibold text-primary">
                {getTrendIcon()}
                <span className="text-sm">{getTrendText()}</span>
              </div>
              <div className="text-xs text-muted-foreground">Trend</div>
            </div>
          </div>
          
          {moods.length > 0 && (
            <div className="pt-2 border-t">
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
        </div>
      </CardContent>
    </Card>
  );
};
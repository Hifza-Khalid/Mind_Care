import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDailyTips } from '@/hooks/useDashboardFeatures';
import { useRealTimeUpdates, useSmoothAnimations } from '@/hooks/useRealTimeFeatures';
import { ProgressFeedback, AnimatedCounter } from '@/components/dashboard/RealTimeFeedback';
import { 
  Target, Timer, Heart, Smile, Coffee, Moon, Brain, Activity, 
  Lightbulb, RefreshCw, CheckCircle, X, Sparkles 
} from 'lucide-react';

const iconMap = {
  Target,
  Timer,
  Heart,
  Smile,
  Coffee,
  Moon,
  Brain,
  Activity
};

const colorClasses = {
  primary: 'from-primary/10 to-primary/20 text-primary border-primary/20',
  secondary: 'from-secondary/10 to-secondary/20 text-secondary border-secondary/20',
  accent: 'from-accent/10 to-accent/20 text-accent border-accent/20',
  success: 'from-green-100/50 to-green-200/50 text-green-600 border-green-200/50'
};

interface CompletedTip {
  id: string;
  completedAt: number;
}

export const EnhancedDailyTips = () => {
  const { getDailyTips } = useDailyTips();
  const { triggerUpdate } = useRealTimeUpdates();
  const { smoothTransition } = useSmoothAnimations();
  
  const [completedTips, setCompletedTips] = useState<CompletedTip[]>(() => {
    const stored = localStorage.getItem('completed_daily_tips');
    const today = new Date().toDateString();
    
    if (stored) {
      const parsed = JSON.parse(stored);
      // Filter out tips completed on previous days
      return parsed.filter((tip: CompletedTip) => 
        new Date(tip.completedAt).toDateString() === today
      );
    }
    return [];
  });

  const [refreshCount, setRefreshCount] = useState(0);
  const dailyTips = getDailyTips(6);

  const markTipCompleted = async (tipIndex: number) => {
    const tipId = `${new Date().toDateString()}-${tipIndex}`;
    const newCompleted = [...completedTips, { id: tipId, completedAt: Date.now() }];
    
    await smoothTransition(() => {
      setCompletedTips(newCompleted);
      localStorage.setItem('completed_daily_tips', JSON.stringify(newCompleted));
      triggerUpdate('tip_completed', { tipIndex, tipId, total: newCompleted.length });
    });
  };

  const removeTip = async (tipIndex: number) => {
    const tipId = `${new Date().toDateString()}-${tipIndex}`;
    const newCompleted = completedTips.filter(tip => tip.id !== tipId);
    
    await smoothTransition(() => {
      setCompletedTips(newCompleted);
      localStorage.setItem('completed_daily_tips', JSON.stringify(newCompleted));
      triggerUpdate('tip_removed', { tipIndex, tipId, total: newCompleted.length });
    });
  };

  const isTipCompleted = (tipIndex: number) => {
    const tipId = `${new Date().toDateString()}-${tipIndex}`;
    return completedTips.some(tip => tip.id === tipId);
  };

  const refreshTips = () => {
    setRefreshCount(prev => prev + 1);
    triggerUpdate('tips_refreshed', { count: refreshCount + 1 });
  };

  const completedCount = dailyTips.filter((_, index) => isTipCompleted(index)).length;

  return (
    <div className="space-y-4">
      {/* Enhanced Header with Real-time Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-heading flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span>Daily Wellness Tips</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            <AnimatedCounter value={completedCount} suffix={` of ${dailyTips.length} completed today`} />
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <ProgressFeedback 
            progress={(completedCount / dailyTips.length) * 100}
            label={`${completedCount}/${dailyTips.length}`}
            isAnimating={completedCount > 0}
          />
          <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-secondary/10 animate-in slide-in-from-right duration-300">
            <Lightbulb className="h-3 w-3 mr-1" />
            {completedCount}/{dailyTips.length}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshTips}
            className="text-xs hover:bg-primary/5 transition-all duration-200"
            disabled={refreshCount >= 3}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${refreshCount > 0 ? 'animate-spin' : ''}`} />
            Refresh {refreshCount > 0 && `(${3 - refreshCount} left)`}
          </Button>
        </div>
      </div>

      {/* Enhanced Progress Bar with Animation */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-700 ease-out relative"
          style={{ width: `${(completedCount / dailyTips.length) * 100}%` }}
        >
          {completedCount > 0 && (
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
          )}
        </div>
      </div>

      {/* Enhanced Tips Grid with Staggered Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {dailyTips.map((tip, index) => {
          const IconComponent = iconMap[tip.icon as keyof typeof iconMap];
          const isCompleted = isTipCompleted(index);
          
          return (
            <Card 
              key={`${tip.title}-${refreshCount}-${index}`}
              className={`enhanced-card group cursor-pointer transition-all duration-300 animate-in slide-in-from-bottom ${
                isCompleted 
                  ? 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 scale-95 opacity-90 hover:opacity-100' 
                  : 'hover:shadow-soft hover:-translate-y-1 hover:scale-105'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4 relative">
                {isCompleted && (
                  <>
                    <div className="absolute top-2 right-2 animate-in zoom-in-50 duration-300">
                      <CheckCircle className="h-4 w-4 text-green-600 drop-shadow-sm" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTip(index);
                      }}
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                      title="Mark as incomplete"
                    >
                      <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
                    </button>
                  </>
                )}
                
                <div 
                  className="flex items-start space-x-3 h-full"
                  onClick={() => !isCompleted && markTipCompleted(index)}
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${colorClasses[tip.color as keyof typeof colorClasses]} flex-shrink-0 ${
                    !isCompleted ? 'group-hover:scale-110 group-hover:rotate-3' : 'opacity-75'
                  } transition-all duration-300`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className={`font-semibold text-sm leading-tight transition-all duration-300 ${
                      isCompleted 
                        ? 'text-green-700 line-through' 
                        : 'group-hover:text-primary'
                    }`}>
                      {tip.title}
                    </h4>
                    <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                      isCompleted ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {tip.description}
                    </p>
                  </div>
                </div>
                
                {!isCompleted && (
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full h-6 text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        markTipCompleted(index);
                      }}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Mark as Done
                    </Button>
                  </div>
                )}

                {isCompleted && (
                  <div className="mt-3 pt-2 border-t border-green-100">
                    <div className="text-xs text-center text-green-600 font-medium animate-in fade-in duration-500">
                      ✓ Completed
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Completion Celebration */}
      {completedCount === dailyTips.length && (
        <Card className="enhanced-card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 animate-in slide-in-from-bottom duration-500">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="animate-bounce text-2xl">🎉</div>
              <h4 className="font-bold text-green-700 text-lg">All tips completed!</h4>
              <div className="animate-bounce text-2xl">✨</div>
            </div>
            <p className="text-sm text-green-600 mb-3">
              Great job prioritizing your wellness today! Come back tomorrow for new tips.
            </p>
            <ProgressFeedback 
              progress={100}
              label="Perfect Day!"
              isAnimating={true}
            />
          </CardContent>
        </Card>
      )}

      {refreshCount >= 3 && (
        <div className="text-center animate-in fade-in duration-300">
          <p className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded-lg border border-yellow-200">
            💡 Tip refresh limit reached. New tips will be available tomorrow!
          </p>
        </div>
      )}
    </div>
  );
};
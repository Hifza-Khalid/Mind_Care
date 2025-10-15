'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  StarIcon,
  HeartIcon,
  MoonIcon,
  FaceSmileIcon,
  BeakerIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Constants
const iconMap = {
  Star: StarIcon,
  Heart: HeartIcon,
  Moon: MoonIcon,
  Smile: FaceSmileIcon,
  Brain: BeakerIcon,
  Activity: BoltIcon,
  Target: FireIcon,
  Sparkles: SparklesIcon,
} as const;

// Types
type IconName = keyof typeof iconMap;
type ColorVariant = 'primary' | 'secondary' | 'accent' | 'success';

interface CompletedTip {
  id: string;
  completedAt: number;
}

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  category: string;
  color?: ColorVariant;
}

interface TipCardProps {
  tip: Tip;
  onComplete: (id: string) => void;
  completed: boolean;
  onRemove?: (id: string) => void;
}

// Mock data
const mockTips: Tip[] = [
  {
    id: '1',
    title: 'Daily Meditation',
    description: 'Take 5 minutes to practice mindful breathing',
    icon: 'Moon',
    category: 'Mindfulness',
    color: 'primary'
  },
  {
    id: '2',
    title: 'Quick Exercise',
    description: 'Do a quick stretching routine',
    icon: 'Activity',
    category: 'Physical',
    color: 'secondary'
  },
  {
    id: '3',
    title: 'Positive Affirmation',
    description: 'Say three things you are grateful for',
    icon: 'Heart',
    category: 'Mental',
    color: 'accent'
  },
];

// TipCard component
const TipCard = React.memo<TipCardProps>((props: TipCardProps) => {
  const { tip, onComplete, completed, onRemove } = props;
  const Icon = iconMap[tip.icon];
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300
        ${completed ? 'bg-green-50 dark:bg-green-900/20' : ''}
        ${isHovered ? 'scale-105' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`
              p-2 rounded-full
              ${completed ? 'bg-green-100 dark:bg-green-800' : 'bg-blue-100 dark:bg-blue-800'}
            `}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">{tip.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tip.description}
              </p>
            </div>
          </div>
          
          <div className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
            transition-colors duration-300
            ${completed
              ? 'bg-green-50 text-green-700'
              : isHovered
                ? 'bg-blue-500 text-white'
                : 'bg-blue-50 text-blue-700'
            }
          `}>
            {tip.category}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => onComplete(tip.id)}
            disabled={completed}
            variant={completed ? "outline" : "default"}
            className="flex-1"
          >
            {completed ? (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Completed
              </>
            ) : 'Mark as Complete'}
          </Button>
          
          {completed && onRemove && (
            <Button
              onClick={() => onRemove(tip.id)}
              variant="ghost"
              size="icon"
              className="hover:bg-red-50 hover:text-red-500"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

TipCard.displayName = 'TipCard';

// Main component
export default function EnhancedDailyTips() {
  const [completedTips, setCompletedTips] = React.useState<CompletedTip[]>(() => {
    try {
      const stored = localStorage.getItem('completed_daily_tips');
      const today = new Date().toDateString();

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (tip: CompletedTip) => new Date(tip.completedAt).toDateString() === today
          );
        }
      }
    } catch (error) {
      console.error('Failed to parse completed daily tips:', error);
      localStorage.removeItem('completed_daily_tips');
    }
    return [];
  });

  const handleComplete = React.useCallback((id: string) => {
    setCompletedTips((prev: CompletedTip[]) => {
      const newTips = [...prev, { id, completedAt: Date.now() }];
      localStorage.setItem('completed_daily_tips', JSON.stringify(newTips));
      return newTips;
    });
  }, []);

  const handleRemove = React.useCallback((id: string) => {
    setCompletedTips((prev: CompletedTip[]) => {
      const newTips = prev.filter((tip: CompletedTip) => tip.id !== id);
      localStorage.setItem('completed_daily_tips', JSON.stringify(newTips));
      return newTips;
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockTips.map((tip) => (
          <TipCard
            key={tip.id}
            tip={tip}
            onComplete={handleComplete}
            onRemove={handleRemove}
            completed={completedTips.some((ct: CompletedTip) => ct.id === tip.id)}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          {completedTips.length} of {mockTips.length} tips completed today
        </p>
      </div>
    </div>
  );
}
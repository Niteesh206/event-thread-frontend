import React, { useState } from 'react';
import { Modal, Button, CategoryChip } from './ui';
import { Sparkles, Calendar, Trophy, Users, Coffee, Film, Code, Book, Music, Dumbbell, Gamepad2 } from 'lucide-react';

/**
 * OnboardingModal - Welcome new users and help them choose interests
 */
export const OnboardingModal = ({ open, onClose, onComplete }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    { id: 'sports', label: 'Sports', icon: <Trophy className="w-4 h-4" /> },
    { id: 'food', label: 'Food & Drinks', icon: <Coffee className="w-4 h-4" /> },
    { id: 'entertainment', label: 'Entertainment', icon: <Film className="w-4 h-4" /> },
    { id: 'tech', label: 'Tech & Coding', icon: <Code className="w-4 h-4" /> },
    { id: 'study', label: 'Study Groups', icon: <Book className="w-4 h-4" /> },
    { id: 'music', label: 'Music', icon: <Music className="w-4 h-4" /> },
    { id: 'fitness', label: 'Fitness', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'gaming', label: 'Gaming', icon: <Gamepad2 className="w-4 h-4" /> },
  ];

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleComplete = () => {
    onComplete(selectedCategories);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Welcome to Prastha! 👋"
      description="Let's personalize your experience. Choose your interests to see relevant event threads."
      size="lg"
    >
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/30">
            <Sparkles className="w-8 h-8 text-brand-500" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Discover Temporary Interest-Based Connections
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Create or join event threads that automatically expire, perfect for spontaneous meetups and focused discussions.
          </p>
        </div>

        {/* Category Selection */}
        <div>
          <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            What are you interested in? (Select all that apply)
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map(category => (
              <CategoryChip
                key={category.id}
                active={selectedCategories.includes(category.id)}
                icon={category.icon}
                label={category.label}
                onClick={() => toggleCategory(category.id)}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
            You can change these preferences anytime from filters
          </p>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          {[
            { icon: <Calendar className="w-5 h-5" />, title: 'Auto-Expiring', desc: 'Threads automatically close after set duration' },
            { icon: <Users className="w-5 h-5" />, title: 'Request to Join', desc: 'Creator approves members for quality discussions' },
          ].map((feature, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
                {feature.icon}
              </div>
              <div>
                <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h6>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Skip for now
          </Button>
          <Button
            variant="primary"
            onClick={handleComplete}
            className="flex-1"
            disabled={selectedCategories.length === 0}
          >
            Continue {selectedCategories.length > 0 && `(${selectedCategories.length})`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OnboardingModal;

'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface FeedbackAnimationProps {
  isCorrect: boolean;
  streak?: number;
}

const getStreakEmoji = (streak: number): string => {
  const emojis = ['🔥', '⭐', '🌟', '✨', '💫', '🎯', '🏆', '👑'];
  return emojis[streak % emojis.length];
};

const congratsMessages = [
  "Awesome job! 🎉",
  "You got it! ⭐",
  "Way to go! 🌟",
  "Brilliant! 🎯",
  "That's correct! ✨",
  "Super smart! 🧠",
  "You're on fire! 🔥",
  "Fantastic! 🌈",
  "Nailed it! 🎪",
  "You rock! 🎸",
  "Amazing work! 🏆",
  "Perfect! 💫",
  "Spot on! 🎯",
  "Great thinking! 💡",
  "You're crushing it! 💪"
];

const getRandomCongratsMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * congratsMessages.length);
  return congratsMessages[randomIndex];
};

const incorrectMessages = [
  "Hmm, not quite right...",
  "Oops, that's not it",
  "Sorry, that's wrong",
  "Incorrect",
  "You missed that one!",
  "Missed it",
  "Oops, you missed it"
];

const getRandomIncorrectMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * incorrectMessages.length);
  return incorrectMessages[randomIndex];
};

export default function FeedbackAnimation({ isCorrect, streak = 0 }: FeedbackAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div className="absolute inset-0 bg-black/30" />
      
      <motion.div className="relative z-10">
        {isCorrect ? (
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [-10, 10, 0]
            }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center gap-4">
              <Image 
                src="/images/happy-bear.svg" 
                alt="Happy bear" 
                width={192}
                height={192}
                className="object-contain"
              />
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-purple-600 dark:text-purple-300 text-center"
              >
                {streak >= 3 
                  ? `That's ${streak} in a row ${getStreakEmoji(streak)}`
                  : getRandomCongratsMessage()
                }
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, rotate: 10 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [10, -10, 0]
            }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center gap-4">
              <Image 
                src="/images/sad-bear.svg" 
                alt="Sad bear" 
                width={192}
                height={192}
                className="object-contain"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-blue-600 dark:text-blue-300 text-center"
              >
                {getRandomIncorrectMessage()}
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
} 
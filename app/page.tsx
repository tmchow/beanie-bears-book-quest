'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackAnimation from './components/FeedbackAnimation';
import audioManager from './lib/AudioManager';

interface Question {
  id: number;
  bookTitle: string;
  question: string;
  type: 'multiple-choice' | 'true-false';
  correctAnswer: string | boolean;
  choices: string[];
  pageReference: number | string;
}

export default function Home() {
  const [score, setScore] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showBear, setShowBear] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bestStreak, setBestStreak] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState<number[]>([]);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const savedScore = localStorage.getItem('quizScore');
    const savedBestStreak = localStorage.getItem('bestStreak');
    
    if (savedScore) {
      setScore(parseInt(savedScore));
    }
    if (savedBestStreak) {
      setBestStreak(parseInt(savedBestStreak));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('quizScore', score.toString());
      localStorage.setItem('bestStreak', bestStreak.toString());
    }
  }, [score, isClient, bestStreak]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/questions/random', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usedQuestionIds }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch question');
        }
        
        const question = await response.json();
        if (question.error) {
          throw new Error(question.error);
        }

        const MAX_RECENT_QUESTIONS = 5;

        setUsedQuestionIds(prev => {
          const newIds = [...prev, question.id];
          return newIds.slice(-MAX_RECENT_QUESTIONS);
        });

        setCurrentQuestion(question);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowBear(false);
        setShowNextButton(false);
      } catch (error) {
        console.error('Error loading question:', error);
        setError('Failed to load question. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [fetchTrigger]);

  const handleAnswerSelect = async (answer: string) => {
    if (isAnswered) return;
    
    const correct = answer.toLowerCase() === String(currentQuestion?.correctAnswer).toLowerCase();
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setIsAnswered(true);
    setScore(prev => prev + (correct ? 10 : -5));
    setShowBear(true);

    if (correct) {
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
      await audioManager.playCorrect();
      setTimeout(() => {
        setShowBear(false);
        setFetchTrigger(prev => prev + 1);
      }, 2000);
    } else {
      setStreak(0);
      await audioManager.playIncorrect();
      setTimeout(() => {
        setShowBear(false);
        setShowNextButton(true);
      }, 1500);
    }
  };

  const handleNextQuestion = () => {
    setFetchTrigger(prev => prev + 1);
  };

  const handleReset = () => {
    setScore(0);
    setStreak(0);
    setUsedQuestionIds([]);
    setFetchTrigger(prev => prev + 1);
  };

  const handleClearAllData = () => {
    localStorage.removeItem('quizScore');
    localStorage.removeItem('bestStreak');
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setUsedQuestionIds([]);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-purple-950 dark:to-blue-950 p-8 font-fredoka">
      <header className="text-center mb-12">
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-300 mb-6 animate-float font-nunito">
            Beanie Bears Book Quest
          </h1>
          
          <button
            onClick={() => setShowSettings(true)}
            className="absolute right-0 top-0 p-2 text-purple-600 dark:text-purple-300 
              hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-full transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>

          {showSettings && (
            <div className="fixed inset-0 bg-black/30 dark:bg-black/50 flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl"
              >
                <h2 className="text-xl font-bold text-purple-600 dark:text-purple-300 mb-4">
                  Settings
                </h2>
                
                <button
                  onClick={handleClearAllData}
                  className="w-full bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300
                    px-4 py-3 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 
                    transition mb-4 text-left font-medium"
                >
                  Reset All Game Data
                </button>
                
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                    px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
                    transition text-left font-medium"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
          
          {isClient && (
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-purple-600 dark:text-purple-300 font-medium">Score</span>
                    <span className="text-2xl font-bold text-purple-700 dark:text-purple-200">
                      {score}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-purple-600 dark:text-purple-300 font-medium">Current Streak</span>
                    <span className="text-2xl font-bold text-purple-700 dark:text-purple-200">
                      {streak}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-purple-600 dark:text-purple-300 font-medium">Best Streak</span>
                    <span className="text-2xl font-bold text-purple-700 dark:text-purple-200">
                      {bestStreak}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleReset}
                  className="bg-purple-200 text-purple-700 dark:bg-purple-800 dark:text-purple-200 
                    px-4 py-2 rounded-full hover:bg-purple-300 dark:hover:bg-purple-700 
                    transition transform hover:scale-105 text-sm font-medium"
                >
                  Restart Game
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl">
            <p className="text-lg text-purple-600 dark:text-purple-300">Loading question...</p>
          </div>
        ) : error ? (
          <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl">
            <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => setFetchTrigger(prev => prev + 1)}
              className="mt-4 bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600"
            >
              Try Again
            </button>
          </div>
        ) : currentQuestion ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-10 relative"
          >
            <div className="text-xl text-purple-600 dark:text-purple-300 mb-4">
              {currentQuestion.bookTitle}
            </div>
            
            <h2 className="text-2xl mb-8 dark:text-white font-medium	">
              {currentQuestion.question}
            </h2>
            
            <div className="grid gap-4">
              {currentQuestion.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(choice)}
                  disabled={isAnswered}
                  className={`p-4 rounded-lg text-left text-lg transition relative
                    pl-8 pr-12 overflow-hidden border-2 dark:text-white 
                    ${isAnswered && String(currentQuestion.correctAnswer).toLowerCase() === choice.toLowerCase()
                      ? 'bg-green-100 dark:bg-green-900/50 border-l-8 border-green-500'
                      : isAnswered && choice === selectedAnswer
                      ? 'bg-red-100 dark:bg-red-900/50 border-l-8 border-red-500'
                      : isAnswered
                      ? 'bg-gray-50 dark:bg-gray-700 border-l-8 border-transparent'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-l-8'
                    } ${
                      isAnswered ? 'cursor-default' : 'cursor-pointer'
                    } border-slate-200 dark:border-slate-400`}
                >
                  {choice}
                </motion.button>
              ))}
            </div>

            {/* Show feedback and next button for incorrect answers */}
            {isAnswered && !isCorrect && showNextButton && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-10 space-y-6"
              >
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border-l-8 border-blue-300 dark:border-blue-500">
                  <p className="text-lg text-blue-800 dark:text-blue-200">
                    Reference page {currentQuestion.pageReference} in &ldquo;{currentQuestion.bookTitle}&rdquo;
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextQuestion}
                  className="w-full bg-purple-500 dark:bg-purple-600 text-white text-2xl px-8 py-4 
                    rounded-full hover:bg-purple-600 dark:hover:bg-purple-500 transition"
                >
                  Next Question
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl">
            <p className="text-2xl text-purple-600 dark:text-purple-300">No question available</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showBear && (
          <FeedbackAnimation 
            isCorrect={isCorrect} 
            streak={streak}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

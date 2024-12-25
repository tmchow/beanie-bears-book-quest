'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Book {
  title: string;
  questionCount: number;
}

interface BookSelectionProps {
  onStart: (selectedBooks: string[]) => void;
}

export default function BookSelection({ onStart }: BookSelectionProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/questions/metadata');
        const data = await response.json();
        setBooks(data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const toggleBook = (title: string) => {
    setSelectedBooks(prev => 
      prev.includes(title)
        ? prev.filter(book => book !== title)
        : [...prev, title]
    );
  };

  const selectAllBooks = () => {
    setSelectedBooks(books.map(book => book.title));
  };

  const clearSelection = () => {
    setSelectedBooks([]);
  };

  const handleStart = () => {
    if (selectedBooks.length > 0) {
      onStart(selectedBooks);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-purple-950 dark:to-blue-950 flex items-center justify-center font-fredoka">
        <div className="text-2xl text-purple-600 dark:text-purple-300">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-purple-950 dark:to-blue-950 p-8 font-fredoka">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-700 dark:text-purple-300">
          Choose Your Books
        </h1>
        
        <div className="mb-6 flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={selectAllBooks}
            className="bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-full 
              hover:bg-purple-700 dark:hover:bg-purple-400 transition shadow-lg"
          >
            Select All Books
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearSelection}
            className="bg-gray-500 dark:bg-gray-600 text-white px-6 py-3 rounded-full 
              hover:bg-gray-600 dark:hover:bg-gray-500 transition shadow-lg"
          >
            Clear Selection
          </motion.button>
        </div>

        <div className="grid gap-4 mb-8">
          {books.map((book) => (
            <motion.div
              key={book.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-2xl cursor-pointer transition-all shadow-lg
                ${selectedBooks.includes(book.title)
                  ? 'bg-purple-100 dark:bg-purple-800 border-2 border-purple-500 dark:border-purple-400'
                  : 'bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700'
                }`}
              onClick={() => toggleBook(book.title)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-bold mb-1
                    ${selectedBooks.includes(book.title)
                      ? 'text-purple-700 dark:text-purple-300'
                      : 'text-gray-800 dark:text-gray-200'
                    }`}>
                    {book.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {book.questionCount} questions
                  </p>
                </div>
                {selectedBooks.includes(book.title) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-3xl text-purple-500 dark:text-purple-400"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          disabled={selectedBooks.length === 0}
          className={`w-full py-4 rounded-full text-xl font-bold shadow-lg transition
            ${selectedBooks.length > 0
              ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-500'
              : 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
            }`}
        >
          Start Quiz
        </motion.button>
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Topic, UserProgress, Word } from './types';
import { vocabularyData } from './data/vocabulary';
import { TopicCard } from './components/TopicCard';
import { WordDetail } from './components/WordDetail';
import { Quiz } from './components/Quiz';
import { ProgressTracker } from './components/ProgressTracker';
import { Layout, Book, GraduationCap, BarChart3, ChevronLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ViewState = 'home' | 'topic' | 'quiz' | 'progress';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('vocab_progress');
    return saved ? JSON.parse(saved) : {
      completedTopics: [],
      quizScores: {},
      learnedWords: []
    };
  });

  useEffect(() => {
    localStorage.setItem('vocab_progress', JSON.stringify(progress));
  }, [progress]);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentWordIndex(0);
    setView('topic');
  };

  const handleWordComplete = (word: Word) => {
    if (!progress.learnedWords.includes(word.id)) {
      setProgress(prev => ({
        ...prev,
        learnedWords: [...prev.learnedWords, word.id]
      }));
    }
  };

  const handleQuizComplete = (score: number) => {
    if (selectedTopic) {
      setProgress(prev => ({
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [selectedTopic.id]: Math.max(prev.quizScores[selectedTopic.id] || 0, score)
        },
        completedTopics: score >= 8 && !prev.completedTopics.includes(selectedTopic.id) 
          ? [...prev.completedTopics, selectedTopic.id] 
          : prev.completedTopics
      }));
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-black text-slate-800 tracking-tight">
                Master Your <span className="text-blue-600">English</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                Learn 50 essential words across 5 topics with interactive practice modules. 
                No internet required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vocabularyData.map(topic => {
                const topicWords = topic.words.map(w => w.id);
                const learnedInTopic = progress.learnedWords.filter(id => topicWords.includes(id)).length;
                const percentage = Math.round((learnedInTopic / topic.words.length) * 100);
                
                return (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    progress={percentage}
                    onClick={() => handleTopicSelect(topic)}
                  />
                );
              })}
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Ready for a challenge?</h2>
                <p className="text-slate-400">Test your knowledge with a comprehensive assessment.</p>
              </div>
              <button 
                onClick={() => setView('progress')}
                className="px-8 py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-700 transition-all whitespace-nowrap"
              >
                View My Progress
              </button>
            </div>
          </div>
        );

      case 'topic':
        if (!selectedTopic) return null;
        const currentWord = selectedTopic.words[currentWordIndex];
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setView('home')}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
              >
                <ChevronLeft size={20} />
                Back to Topics
              </button>
              <div className="flex gap-4">
                <button 
                  onClick={() => setView('quiz')}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-bold hover:bg-yellow-200 transition-colors"
                >
                  <GraduationCap size={20} />
                  Take Quiz
                </button>
              </div>
            </div>

            <WordDetail 
              word={currentWord}
              isFirst={currentWordIndex === 0}
              isLast={currentWordIndex === selectedTopic.words.length - 1}
              onNext={() => {
                handleWordComplete(currentWord);
                setCurrentWordIndex(i => i + 1);
              }}
              onPrev={() => setCurrentWordIndex(i => i - 1)}
              onComplete={() => {
                handleWordComplete(currentWord);
                setView('quiz');
              }}
            />
          </div>
        );

      case 'quiz':
        if (!selectedTopic) return null;
        return (
          <Quiz 
            topic={selectedTopic} 
            onComplete={handleQuizComplete}
            onExit={() => setView('home')}
          />
        );

      case 'progress':
        return (
          <div className="space-y-8">
            <button 
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
            >
              <ChevronLeft size={20} />
              Back to Home
            </button>
            <ProgressTracker progress={progress} topics={vocabularyData} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setView('home')}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Book size={24} />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-800">VocabMaster</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => setView('home')}
                className={`flex items-center gap-2 font-bold transition-colors ${view === 'home' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Layout size={20} />
                Topics
              </button>
              <button 
                onClick={() => setView('progress')}
                className={`flex items-center gap-2 font-bold transition-colors ${view === 'progress' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <BarChart3 size={20} />
                Progress
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Learned</p>
                <p className="text-sm font-black text-slate-800">{progress.learnedWords.length} / 50</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-500">
                <Info size={20} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-100 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-slate-400 font-medium">© 2026 English Vocabulary Master. Built for offline learning.</p>
          <div className="flex justify-center gap-6 text-slate-300">
            <span className="hover:text-slate-500 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-500 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-slate-500 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

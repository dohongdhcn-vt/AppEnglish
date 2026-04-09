import React, { useState } from 'react';
import { Topic, Word } from '../types';
import { CheckCircle2, XCircle, Trophy, RefreshCw, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface QuizProps {
  topic: Topic;
  onComplete: (score: number) => void;
  onExit: () => void;
}

interface Question {
  id: number;
  word: Word;
  options: string[];
  correctAnswer: string;
  type: 'meaning' | 'listening' | 'reading';
}

export const Quiz: React.FC<QuizProps> = ({ topic, onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate questions
  const questions: Question[] = topic.words.map((word, index) => {
    const types: ('meaning' | 'listening' | 'reading')[] = ['meaning', 'listening', 'reading'];
    const type = types[index % 3];
    
    // Generate random options
    const otherWords = topic.words.filter(w => w.id !== word.id);
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
    const options = [
      type === 'meaning' ? word.meaning : word.word,
      type === 'meaning' ? shuffledOthers[0].meaning : shuffledOthers[0].word,
      type === 'meaning' ? shuffledOthers[1].meaning : shuffledOthers[1].word,
      type === 'meaning' ? shuffledOthers[2].meaning : shuffledOthers[2].word,
    ].sort(() => 0.5 - Math.random());

    return {
      id: index,
      word,
      options,
      correctAnswer: type === 'meaning' ? word.meaning : word.word,
      type
    };
  });

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score);
    }
  };

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100"
        >
          <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Quiz Completed!</h2>
          <p className="text-slate-500 mb-8">You've finished the {topic.title} assessment.</p>
          
          <div className="text-6xl font-black text-blue-600 mb-2">{score}/{questions.length}</div>
          <p className="text-lg font-bold text-slate-400 mb-10">{percentage}% Accuracy</p>

          <div className="space-y-3">
            <button 
              onClick={() => {
                setCurrentQuestionIndex(0);
                setScore(0);
                setShowResult(false);
                setSelectedOption(null);
                setIsAnswered(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
            <button 
              onClick={onExit}
              className="w-full flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
            >
              <Home size={20} />
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Topic Quiz</h2>
          <p className="text-sm text-slate-500">{topic.title}</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-blue-600">Question {currentQuestionIndex + 1}</span>
          <div className="text-xs text-slate-400">of {questions.length}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-100 rounded-full mb-12 overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8">
        <div className="mb-8">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">
            {currentQuestion.type === 'meaning' ? 'Vocabulary Check' : 
             currentQuestion.type === 'listening' ? 'Listening Check' : 'Reading Context'}
          </p>
          <h3 className="text-3xl font-bold text-slate-800">
            {currentQuestion.type === 'meaning' ? `What does "${currentQuestion.word.word}" mean?` :
             currentQuestion.type === 'listening' ? 'Listen to the word and identify it.' :
             `Fill in the blank: "${currentQuestion.word.example.replace(currentQuestion.word.word, "____")}"`}
          </h3>
          {currentQuestion.type === 'listening' && (
            <button 
              onClick={() => {
                const audio = new Audio(currentQuestion.word.audioUrl);
                audio.play();
              }}
              className="mt-6 p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-colors"
            >
              <RefreshCw size={24} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, i) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedOption;
            
            let btnClass = "border-2 border-slate-100 text-slate-700 hover:border-blue-500 hover:bg-blue-50";
            if (isAnswered) {
              if (isCorrect) btnClass = "border-green-500 bg-green-50 text-green-700";
              else if (isSelected) btnClass = "border-red-500 bg-red-50 text-red-700";
              else btnClass = "border-slate-100 text-slate-300 opacity-50";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`flex items-center justify-between w-full p-5 rounded-2xl font-bold text-left transition-all ${btnClass}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="text-green-500" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleNext}
          className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </motion.button>
      )}
    </div>
  );
};

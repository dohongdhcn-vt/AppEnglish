import React, { useState, useRef } from 'react';
import { Word } from '../types';
import { Volume2, Play, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WordDetailProps {
  word: Word;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  onComplete: () => void;
}

type PracticeMode = 'study' | 'listen' | 'speak' | 'read' | 'write';

export const WordDetail: React.FC<WordDetailProps> = ({ 
  word, 
  onNext, 
  onPrev, 
  isFirst, 
  isLast,
  onComplete
}) => {
  const [mode, setMode] = useState<PracticeMode>('study');
  const [writeInput, setWriteInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleCheckWrite = () => {
    const correct = writeInput.toLowerCase().trim() === word.word.toLowerCase().trim();
    setIsCorrect(correct);
    if (correct) {
      setTimeout(() => {
        setIsCorrect(null);
        setWriteInput('');
        if (isLast) onComplete();
        else onNext();
      }, 1500);
    }
  };

  const renderPracticeMode = () => {
    switch (mode) {
      case 'study':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-5xl font-black text-slate-800 mb-2">{word.word}</h2>
              <p className="text-xl text-blue-600 font-mono">{word.ipa}</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <p className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Meaning</p>
              <p className="text-2xl font-bold text-slate-800">{word.meaning}</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Example</p>
              <p className="text-lg text-slate-700 italic mb-2">"{word.example}"</p>
              <p className="text-slate-500">{word.exampleMeaning}</p>
            </div>

            <button 
              onClick={playAudio}
              className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              <Volume2 size={24} />
              Listen Pronunciation
            </button>
          </div>
        );

      case 'listen':
        return (
          <div className="flex flex-col items-center justify-center py-12 space-y-8">
            <button 
              onClick={playAudio}
              className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-xl shadow-blue-200"
            >
              <Play size={48} fill="currentColor" />
            </button>
            <p className="text-slate-500 font-medium">Listen and identify the word</p>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              {[word.word, "Other", "Random", "Word"].sort().map((w, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (w === word.word) {
                      setIsCorrect(true);
                      setTimeout(() => { setIsCorrect(null); onNext(); }, 1000);
                    } else {
                      setIsCorrect(false);
                      setTimeout(() => setIsCorrect(null), 1000);
                    }
                  }}
                  className="py-4 rounded-xl border-2 border-slate-100 font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        );

      case 'speak':
        return (
          <div className="flex flex-col items-center py-12 space-y-8 text-center">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-800">{word.word}</h2>
              <p className="text-xl text-blue-600 font-mono">{word.ipa}</p>
            </div>
            
            <div className="p-8 bg-orange-50 rounded-full border-4 border-orange-100 animate-pulse">
              <Volume2 size={64} className="text-orange-500" />
            </div>
            
            <div className="max-w-xs">
              <p className="text-slate-600 leading-relaxed">
                Practice saying the word out loud. Focus on the IPA symbols and the audio guide.
              </p>
            </div>

            <button 
              onClick={playAudio}
              className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-900 transition-colors"
            >
              Play Guide
            </button>
          </div>
        );

      case 'read':
        return (
          <div className="space-y-8 py-6">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <p className="text-2xl text-slate-800 leading-relaxed font-medium">
                Question: What is the meaning of the word <span className="text-blue-600 font-bold">"{word.word}"</span> in the following context?
              </p>
              <p className="mt-4 text-lg text-slate-500 italic">
                "{word.example}"
              </p>
            </div>

            <div className="space-y-3">
              {[word.meaning, "Một nghĩa khác", "Nghĩa sai", "Không liên quan"].sort().map((m, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (m === word.meaning) {
                      setIsCorrect(true);
                      setTimeout(() => { setIsCorrect(null); onNext(); }, 1000);
                    } else {
                      setIsCorrect(false);
                      setTimeout(() => setIsCorrect(null), 1000);
                    }
                  }}
                  className="w-full py-4 px-6 text-left rounded-2xl border-2 border-slate-100 font-bold text-slate-700 hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        );

      case 'write':
        return (
          <div className="flex flex-col items-center py-12 space-y-8">
            <div className="text-center space-y-2">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Translate to English</p>
              <h2 className="text-4xl font-black text-slate-800">{word.meaning}</h2>
            </div>

            <div className="w-full max-w-md space-y-4">
              <input 
                type="text"
                value={writeInput}
                onChange={(e) => setWriteInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCheckWrite()}
                placeholder="Type the word here..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 ring-offset-0 outline-none text-xl font-bold text-center transition-all"
                autoFocus
              />
              <button 
                onClick={handleCheckWrite}
                className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-colors"
              >
                Check Answer
              </button>
            </div>

            <button 
              onClick={playAudio}
              className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700"
            >
              <Volume2 size={20} />
              Listen Hint
            </button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <audio ref={audioRef} src={word.audioUrl} />
      
      {/* Mode Selector */}
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
        {(['study', 'listen', 'speak', 'read', 'write'] as PracticeMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl capitalize transition-all ${
              mode === m ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode + word.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderPracticeMode()}
          </motion.div>
        </AnimatePresence>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {isCorrect !== null && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-3xl z-10"
            >
              <div className={`flex flex-col items-center gap-4 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {isCorrect ? <CheckCircle2 size={100} /> : <AlertCircle size={100} />}
                <p className="text-3xl font-black">{isCorrect ? 'Excellent!' : 'Try Again'}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
        <button 
          onClick={onPrev}
          disabled={isFirst}
          className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all ${
            isFirst ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        
        <div className="flex gap-1">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-all ${
                i === parseInt(word.id.replace(/\D/g, '')) - 1 ? 'w-6 bg-blue-500' : 'bg-slate-200'
              }`} 
            />
          ))}
        </div>

        <button 
          onClick={isLast ? onComplete : onNext}
          className="flex items-center gap-2 font-bold px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-all"
        >
          {isLast ? 'Finish' : 'Next Word'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

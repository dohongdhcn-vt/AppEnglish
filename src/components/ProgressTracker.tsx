import React from 'react';
import { UserProgress, Topic } from '../types';
import { CheckCircle2, BookOpen, Award, TrendingUp } from 'lucide-react';

interface ProgressTrackerProps {
  progress: UserProgress;
  topics: Topic[];
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress, topics }) => {
  const totalWords = topics.reduce((acc, t) => acc + t.words.length, 0);
  const learnedCount = progress.learnedWords.length;
  const learnedPercentage = Math.round((learnedCount / totalWords) * 100) || 0;
  const completedTopicsCount = progress.completedTopics.length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Words Learned</p>
            <p className="text-2xl font-black text-slate-800">{learnedCount} / {totalWords}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Topics Mastered</p>
            <p className="text-2xl font-black text-slate-800">{completedTopicsCount} / {topics.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Overall Mastery</p>
            <p className="text-2xl font-black text-slate-800">{learnedPercentage}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-blue-600" />
          <h3 className="text-xl font-bold text-slate-800">Learning Journey</h3>
        </div>
        
        <div className="space-y-6">
          {topics.map(topic => {
            const topicWords = topic.words.map(w => w.id);
            const learnedInTopic = progress.learnedWords.filter(id => topicWords.includes(id)).length;
            const percentage = Math.round((learnedInTopic / topic.words.length) * 100);
            const score = progress.quizScores[topic.id];

            return (
              <div key={topic.id} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-bold text-slate-700">{topic.title}</p>
                    <p className="text-xs text-slate-400">{learnedInTopic} of {topic.words.length} words learned</p>
                  </div>
                  <div className="text-right">
                    {score !== undefined && (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg mr-2">
                        Best Score: {score}/10
                      </span>
                    )}
                    <span className="text-sm font-black text-blue-600">{percentage}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

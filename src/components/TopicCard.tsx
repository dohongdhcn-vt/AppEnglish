import React from 'react';
import { Topic } from '../types';
import * as LucideIcons from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
  progress: number;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick, progress }) => {
  // @ts-ignore
  const IconComponent = LucideIcons[topic.icon] || LucideIcons.Book;

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
          <IconComponent size={24} />
        </div>
        <div className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
          {topic.words.length} words
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2">{topic.title}</h3>
      <p className="text-sm text-slate-500 mb-6 line-clamp-2">{topic.description}</p>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-400">Progress</span>
          <span className="text-blue-600">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

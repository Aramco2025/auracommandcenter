
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

const tools = [
  { name: 'Gmail', icon: '📧', color: 'bg-red-100 text-red-700' },
  { name: 'Google Calendar', icon: '📅', color: 'bg-blue-100 text-blue-700' },
  { name: 'Notion', icon: '📝', color: 'bg-purple-100 text-purple-700' },
  { name: 'Slack', icon: '💬', color: 'bg-green-100 text-green-700' },
  { name: 'Trello', icon: '📋', color: 'bg-cyan-100 text-cyan-700' },
  { name: 'Asana', icon: '✅', color: 'bg-orange-100 text-orange-700' },
  { name: 'Zoom', icon: '🎥', color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Microsoft Teams', icon: '👥', color: 'bg-violet-100 text-violet-700' },
  { name: 'Salesforce', icon: '☁️', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'HubSpot', icon: '🎯', color: 'bg-amber-100 text-amber-700' },
  { name: 'Jira', icon: '🐛', color: 'bg-blue-100 text-blue-700' },
  { name: 'GitHub', icon: '🐙', color: 'bg-gray-100 text-gray-700' }
];

export const ToolsBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleTools, setVisibleTools] = useState(6);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tools.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleTools(3);
      } else if (window.innerWidth < 1024) {
        setVisibleTools(4);
      } else {
        setVisibleTools(6);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getVisibleTools = () => {
    const result = [];
    for (let i = 0; i < visibleTools; i++) {
      const index = (currentIndex + i) % tools.length;
      result.push(tools[index]);
    }
    return result;
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-white to-emerald-50 border-y border-blue-100 py-8 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold text-slate-700">Seamlessly Connects With</span>
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-slate-600 text-sm">
            Integrate with your favorite tools and let AI handle the rest
          </p>
        </div>

        <div className="relative">
          {/* Main tools display */}
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {getVisibleTools().map((tool, index) => (
              <Badge
                key={`${tool.name}-${currentIndex}-${index}`}
                className={`${tool.color} border-0 px-4 py-2 text-sm font-medium transition-all duration-500 transform hover:scale-105 animate-fade-in`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <span className="mr-2 text-lg">{tool.icon}</span>
                {tool.name}
              </Badge>
            ))}
          </div>

          {/* Floating animation elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-pulse"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 20}%`,
                  animationDelay: `${i * 200}ms`
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {tools.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-blue-600 w-6'
                  : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            ✨ <span className="font-medium">50+ integrations</span> and growing
          </p>
        </div>
      </div>
    </div>
  );
};

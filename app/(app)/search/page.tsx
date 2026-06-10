'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Command, Briefcase, BookOpen, Users, Clock, ArrowRight, X } from 'lucide-react';
import { searchEmptyState } from '@/lib/mock-data';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState(['React', 'TypeScript', 'GraphQL']);

  const mockResults = [
    { id: '1', type: 'job', title: 'Senior Frontend Engineer at Stripe', company: 'Stripe', match: 92 },
    { id: '2', type: 'skill', title: 'GraphQL Mastery', category: 'Backend', proficiency: 'Intermediate' },
    { id: '3', type: 'course', title: 'Advanced GraphQL Course', platform: 'Frontend Masters', duration: '6 hours' },
    { id: '4', type: 'milestone', title: 'System Design Foundations', progress: 45, status: 'In Progress' },
  ];

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length > 0) {
      setResults(mockResults.filter(r => 
        r.title.toLowerCase().includes(q.toLowerCase()) || 
        (r.company && r.company.toLowerCase().includes(q.toLowerCase()))
      ));
    } else {
      setResults([]);
    }
  };

  const addRecentSearch = (s: string) => {
    if (!recentSearches.includes(s)) {
      setRecentSearches([s, ...recentSearches.slice(0, 4)]);
    }
    handleSearch(s);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-foreground mb-8">Search Everything</h1>

        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs, skills, courses, roadmaps..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg bg-input border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            autoFocus
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Results */}
        {query && results.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold text-foreground">{results.length} Results for "{query}"</h2>
            {results.map((result) => (
              <Link key={result.id} href="#">
                <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 flex-1">
                    {result.type === 'job' && <Briefcase className="w-5 h-5 text-primary flex-shrink-0" />}
                    {result.type === 'skill' && <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />}
                    {result.type === 'course' && <Clock className="w-5 h-5 text-primary flex-shrink-0" />}
                    {result.type === 'milestone' && <Users className="w-5 h-5 text-primary flex-shrink-0" />}
                    
                    <div>
                      <p className="font-medium text-foreground">{result.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.company || result.platform || result.category || result.status}
                      </p>
                    </div>
                  </div>

                  {result.match && <span className="text-primary font-bold">{result.match}%</span>}
                  {result.progress && <span className="text-muted-foreground text-sm">{result.progress}%</span>}
                  <ArrowRight className="w-5 h-5 text-muted-foreground ml-4" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="space-y-8">
            {/* Recent Searches */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => addRecentSearch(search)}
                    className="px-4 py-2 bg-card border border-border rounded-lg hover:border-primary text-foreground transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Searches */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Popular Searches</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['Frontend Engineer', 'System Design', 'Leadership', 'GraphQL'].map((search) => (
                  <button
                    key={search}
                    onClick={() => addRecentSearch(search)}
                    className="p-4 bg-card border border-border rounded-lg hover:border-primary text-left transition-colors"
                  >
                    <Search className="w-4 h-4 text-muted-foreground inline mr-2" />
                    <span className="text-foreground font-medium">{search}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Command className="w-5 h-5 text-primary" />
                Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Press <kbd className="px-2 py-1 bg-background border border-border rounded text-xs font-mono">Ctrl+K</kbd> to open search anywhere</li>
                <li>• Search by job title, company, skill, or course name</li>
                <li>• Filter results by category for better results</li>
              </ul>
            </div>
          </div>
        )}

        {/* No Results */}
        {query && results.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No results for "{query}"</h3>
            <p className="text-muted-foreground mb-6">
              Try searching for a different term or explore our suggestions below.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground mb-3">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {searchEmptyState.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => addRecentSearch(suggestion)}
                    className="px-3 py-2 bg-card border border-border rounded-lg hover:border-primary text-sm text-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

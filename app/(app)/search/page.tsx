'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Search, Command, Briefcase, BookOpen, Users, ArrowRight, X, Loader2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(r => r.data);

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['React', 'TypeScript', 'GraphQL']);

  const { data: results = [], isLoading } = useSWR(
    query.trim() ? `/api/search?q=${encodeURIComponent(query)}` : null,
    fetcher
  );

  const addRecentSearch = (s: string) => {
    if (!recentSearches.includes(s)) {
      setRecentSearches([s, ...recentSearches.slice(0, 4)]);
    }
    setQuery(s);
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
            placeholder="Search jobs, interview prep, roadmaps..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 text-lg bg-input border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
            autoFocus
          />
          {(query || isLoading) && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {isLoading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {query && results.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold text-foreground">{results.length} Results for "{query}"</h2>
            {results.map((result: any) => (
              <Link key={`${result.type}-${result.id}`} href={result.href}>
                <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 flex-1">
                    {result.type === 'job' && <Briefcase className="w-5 h-5 text-primary flex-shrink-0" />}
                    {result.type === 'roadmap' && <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />}
                    {result.type === 'interview' && <Users className="w-5 h-5 text-primary flex-shrink-0" />}
                    
                    <div>
                      <p className="font-medium text-foreground">{result.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {result.subtitle} • {result.type}
                      </p>
                    </div>
                  </div>

                  {result.score !== null && result.score !== undefined && (
                    <span className="text-primary font-bold mr-2">{result.score}%</span>
                  )}
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
                <li>• Search by job title, company, or roadmap criteria</li>
                <li>• Real-time updates match live records in your career vault</li>
              </ul>
            </div>
          </div>
        )}

        {/* No Results */}
        {query && !isLoading && results.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No results for "{query}"</h3>
            <p className="text-muted-foreground mb-6">
              Try searching for a different term or explore our suggestions below.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground mb-3">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['React', 'TypeScript', 'System Design', 'Frontend Engineer', 'GraphQL'].map((suggestion) => (
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

export function PageSkeleton() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-10 bg-muted rounded-lg w-1/3"></div>
        <div className="h-5 bg-muted rounded-lg w-1/2"></div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-1/4"></div>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-3 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-8 bg-muted rounded"></div>
      <div className="h-3 bg-muted rounded w-2/3"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      {/* Header */}
      <div className="bg-muted border-b border-border p-4 grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-border rounded"></div>
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="border-b border-border p-4 grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, j) => (
            <div key={j} className="h-4 bg-muted rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
          <div className="w-16 h-4 bg-muted rounded"></div>
        </div>
      ))}
    </div>
  );
}

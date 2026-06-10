'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type?: 'center' | 'skill' | 'project' | 'company';
}

interface KnowledgeGraphProps {
  nodes: Node[];
  title?: string;
  onNodeClick?: (node: Node) => void;
  className?: string;
}

export function KnowledgeGraph({
  nodes,
  title,
  onNodeClick,
  className = '',
}: KnowledgeGraphProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const nodeColorMap = {
    center: 'fill-primary',
    skill: 'fill-blue-500',
    project: 'fill-purple-500',
    company: 'fill-amber-500',
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));

  return (
    <div className={`rounded-lg border border-border bg-card p-6 ${className}`}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <div className="flex gap-2">
            <button
              onClick={handleZoomIn}
              className="rounded-lg border border-border bg-transparent p-2 hover:bg-muted"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="rounded-lg border border-border bg-transparent p-2 hover:bg-muted"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="relative h-96 overflow-hidden rounded-lg bg-muted">
        <svg className="h-full w-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
          {/* Draw connections */}
          {nodes.map((node, idx) => {
            if (node.type === 'center') {
              return nodes.map((target, targetIdx) => {
                if (target.type === 'center') return null;
                return (
                  <line
                    key={`connection-${idx}-${targetIdx}`}
                    x1={node.x}
                    y1={node.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-border"
                  />
                );
              });
            }
            return null;
          })}

          {/* Draw nodes */}
          {nodes.map((node) => (
            <g
              key={node.id}
              onClick={() => onNodeClick?.(node)}
              className="cursor-pointer"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={node.type === 'center' ? 40 : 25}
                className={`${nodeColorMap[node.type || 'skill']} transition-opacity hover:opacity-80`}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-xs font-semibold"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute bottom-4 right-4 rounded-lg bg-black/50 px-3 py-1 text-xs text-white">
          {zoom.toFixed(1)}x
        </div>
      </div>
    </div>
  );
}

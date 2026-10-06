import React, { useState, useMemo } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';

export const Visualization: React.FC = () => {
  const { currentResult } = useCaseStore();
  const [chartType, setChartType] = useState<'bar' | 'line' | 'donut'>('bar');
  const [xAxisKey, setXAxisKey] = useState<string>('');
  const [yAxisKey, setYAxisKey] = useState<string>('');

  // Transform rows to array of objects for Recharts
  const chartData = useMemo(() => {
    if (!currentResult || currentResult.rows.length === 0) return [];
    return currentResult.rows.map((row) => {
      const obj: Record<string, any> = {};
      currentResult.columns.forEach((col, idx) => {
        const val = row[idx];
        const num = Number(val);
        obj[col] = !isNaN(num) && typeof val !== 'boolean' && val !== null ? num : val;
      });
      return obj;
    });
  }, [currentResult]);

  // Set default axis columns when result changes
  React.useEffect(() => {
    if (currentResult && currentResult.columns.length > 0) {
      setXAxisKey(currentResult.columns[0]);
      // Find first numeric column for Y axis
      const numericCol = currentResult.columns.find((col, colIdx) => {
        return currentResult.rows.some((r) => typeof r[colIdx] === 'number');
      }) || currentResult.columns[1] || currentResult.columns[0];
      setYAxisKey(numericCol);
    }
  }, [currentResult]);

  if (!currentResult || currentResult.rows.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-investigative-text-muted">
        <BarChart3 className="w-8 h-8 mb-2 text-investigative-border-muted/50" />
        <p className="text-xs">Run a query with numeric results to render visualizations.</p>
      </div>
    );
  }

  // Dark violet monochromatic color ramp
  const VIOLET_COLORS = ['#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#3b0764', '#8b5cf6'];

  return (
    <div className="h-full flex flex-col p-4 bg-investigative-surface/60 overflow-hidden">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-investigative-border/50 text-sm mb-3 shrink-0">
        <div className="flex items-center space-x-1 border border-investigative-border/60 rounded-xl p-1 bg-investigative-surface-raised/40">
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              chartType === 'bar'
                ? 'bg-investigative-violet text-white font-medium shadow-xs'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Bar</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              chartType === 'line'
                ? 'bg-investigative-violet text-white font-medium shadow-xs'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <LineChartIcon className="w-4 h-4" />
            <span>Line</span>
          </button>
          <button
            onClick={() => setChartType('donut')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              chartType === 'donut'
                ? 'bg-investigative-violet text-white font-medium shadow-xs'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            <span>Donut</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 font-mono text-sm">
            <span className="text-investigative-text-muted">X-Axis:</span>
            <select
              value={xAxisKey}
              onChange={(e) => setXAxisKey(e.target.value)}
              className="bg-investigative-surface-raised border border-investigative-border/70 text-investigative-text px-3 py-1.5 rounded-xl text-sm focus:outline-none focus:border-investigative-violet"
            >
              {currentResult.columns.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 font-mono text-sm">
            <span className="text-investigative-text-muted">Y-Axis:</span>
            <select
              value={yAxisKey}
              onChange={(e) => setYAxisKey(e.target.value)}
              className="bg-investigative-surface-raised border border-investigative-border/70 text-investigative-text px-3 py-1.5 rounded-xl text-sm focus:outline-none focus:border-investigative-violet"
            >
              {currentResult.columns.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey={xAxisKey} stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '13px',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey={yAxisKey} fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey={xAxisKey} stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '13px',
                  borderRadius: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey={yAxisKey}
                stroke="#7c3aed"
                strokeWidth={2.5}
                dot={{ fill: '#7c3aed', r: 4 }}
                activeDot={{ r: 6, fill: '#8b5cf6' }}
              />
            </LineChart>
          ) : (
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '13px',
                  borderRadius: '12px',
                }}
              />
              <Pie
                data={chartData}
                dataKey={yAxisKey}
                nameKey={xAxisKey}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={VIOLET_COLORS[index % VIOLET_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

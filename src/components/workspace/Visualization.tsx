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
        <BarChart3 className="w-8 h-8 mb-2 text-investigative-border-muted" />
        <p className="text-xs">Run a query with numeric results to render visualizations.</p>
      </div>
    );
  }

  const COLORS = ['#b91c1c', '#991b1b', '#7f1d1d', '#52525b', '#3f3f46', '#27272a'];

  return (
    <div className="h-full flex flex-col p-4 bg-investigative-surface overflow-hidden">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-investigative-border text-xs mb-3 shrink-0">
        <div className="flex items-center space-x-1 border border-investigative-border rounded p-0.5 bg-investigative-surface-raised">
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
              chartType === 'bar'
                ? 'bg-investigative-red text-white'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            <span>Bar</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
              chartType === 'line'
                ? 'bg-investigative-red text-white'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <LineChartIcon className="w-3 h-3" />
            <span>Line</span>
          </button>
          <button
            onClick={() => setChartType('donut')}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
              chartType === 'donut'
                ? 'bg-investigative-red text-white'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <PieChartIcon className="w-3 h-3" />
            <span>Donut</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-mono">
            <span className="text-investigative-text-muted">X-Axis:</span>
            <select
              value={xAxisKey}
              onChange={(e) => setXAxisKey(e.target.value)}
              className="bg-investigative-surface-raised border border-investigative-border text-investigative-text px-2 py-1 rounded text-xs focus:outline-none focus:border-investigative-red"
            >
              {currentResult.columns.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5 font-mono">
            <span className="text-investigative-text-muted">Y-Axis:</span>
            <select
              value={yAxisKey}
              onChange={(e) => setYAxisKey(e.target.value)}
              className="bg-investigative-surface-raised border border-investigative-border text-investigative-text px-2 py-1 rounded text-xs focus:outline-none focus:border-investigative-red"
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
                  fontSize: '12px',
                  borderRadius: '4px',
                }}
              />
              <Bar dataKey={yAxisKey} fill="#b91c1c" radius={[2, 2, 0, 0]} />
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey={xAxisKey} stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '12px',
                  borderRadius: '4px',
                }}
              />
              <Line
                type="monotone"
                dataKey={yAxisKey}
                stroke="#b91c1c"
                strokeWidth={2}
                dot={{ fill: '#b91c1c', r: 3 }}
                activeDot={{ r: 5, fill: '#ef4444' }}
              />
            </LineChart>
          ) : (
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '12px',
                  borderRadius: '4px',
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
                paddingAngle={2}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

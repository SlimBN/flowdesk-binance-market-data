import React, { useState, useCallback } from 'react';
import { BarChart3, LineChart as LineChartIcon, RotateCcw, TrendingUp, Settings2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ChartDataPoint, ChartType, ScaleType, ChartScaleConfig } from '../types/binance';
import { CHART_CONFIG } from '../constants/config';

interface TradesChartProps {
  data: ChartDataPoint[];
  symbol: string;
}

const TradesChart: React.FC<TradesChartProps> = ({ data, symbol }) => {
  const { t } = useTranslation();
  const [chartType, setChartType] = useState<ChartType>('price');
  const [scaleConfig, setScaleConfig] = useState<ChartScaleConfig>({
    yScale: 'linear',
    yDomain: ['auto', 'auto'],
    xDomain: ['auto', 'auto'],
  });

  const renderTooltip = useCallback((props: unknown) => {
    const tooltipProps = props as { active?: boolean; payload?: Array<{ payload: ChartDataPoint }> };
    if (!tooltipProps.active || !tooltipProps.payload || !tooltipProps.payload[0]) return null;

    const data = tooltipProps.payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
        <div className="space-y-1">
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-gray-500 dark:text-gray-400">{t('charts.tooltip.time')}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{data.time}</span>
          </div>
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-gray-500 dark:text-gray-400">{t('charts.tooltip.price')}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">${data.price.toFixed(4)}</span>
          </div>
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-gray-500 dark:text-gray-400">{t('charts.tooltip.quantity')}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{data.quantity.toFixed(6)}</span>
          </div>
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-gray-500 dark:text-gray-400">{t('charts.tooltip.volume')}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">${data.volume.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-gray-500 dark:text-gray-400">{t('charts.tooltip.type')}:</span>
            <span className={`font-medium ${
              data.isBuy 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {data.isBuy ? t('charts.tooltip.buy') : t('charts.tooltip.sell')}
            </span>
          </div>
        </div>
      </div>
    );
  }, [t]);

  const handleScaleChange = useCallback((field: keyof ChartScaleConfig, value: ScaleType | number | 'auto') => {
    setScaleConfig(prev => ({
      ...prev,
      [field]: field === 'yScale' ? value : 
               field === 'yDomain' ? [prev.yDomain[0], value] :
               field === 'xDomain' ? [prev.xDomain[0], value] : value
    }));
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('charts.title')}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          {t('charts.noData')}
        </div>
      </div>
    );
  }

  const getYAxisDomain = (): [number | string, number | string] => {
    // Determine which field to use for Y axis based on chart type
    let values: number[] = [];
    if (chartType === 'price') {
      values = data.map(d => d.price);
    } else if (chartType === 'volume') {
      values = data.map(d => d.volume);
    } else if (chartType === 'quantity') {
      values = data.map(d => d.quantity);
    }

    if (scaleConfig.yDomain[0] === 'auto' && scaleConfig.yDomain[1] === 'auto') {
      if (values.length === 0) return ['auto', 'auto'];
      const min = Math.min(...values);
      const max = Math.max(...values);
      const margin = (max - min) * CHART_CONFIG.MARGIN_PERCENT || 1; // Use constant for margin
      return [min - margin, max + margin];
    }
    return [
      scaleConfig.yDomain[0] === 'auto' ? (values.length ? Math.min(...values) : 'auto') : scaleConfig.yDomain[0],
      scaleConfig.yDomain[1] === 'auto' ? (values.length ? Math.max(...values) : 'auto') : scaleConfig.yDomain[1]
    ];
  };

  // Theme-aware chart colors
  const chartColors = {
    grid: '#e5e7eb', // gray-200
    gridDark: '#374151', // gray-700
    axis: '#6b7280', // gray-500
    axisDark: '#9ca3af', // gray-400
    price: '#f59e0b', // amber-500
    volume: '#3b82f6', // blue-500
    buy: '#10b981', // emerald-500
    sell: '#ef4444', // red-500
  };

  const renderChart = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? chartColors.gridDark : chartColors.grid;
    const axisColor = isDark ? chartColors.axisDark : chartColors.axis;

    switch (chartType) {
      case 'price':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: axisColor }}
                stroke={axisColor}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: axisColor }}
                stroke={axisColor}
                domain={getYAxisDomain()}
                scale={scaleConfig.yScale}
              />
              <Tooltip content={renderTooltip} />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke={chartColors.price}
                strokeWidth={2}
                dot={{ fill: chartColors.price, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: chartColors.price, strokeWidth: 2 }}
                name="Price (USDT)"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'volume':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: axisColor }}
                stroke={axisColor}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: axisColor }}
                stroke={axisColor}
                domain={getYAxisDomain()}
                scale={scaleConfig.yScale}
              />
              <Tooltip content={renderTooltip} />
              <Legend />
              <Bar 
                dataKey="volume" 
                name="Volume (USDT)"
                fill={chartColors.volume}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'quantity':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                type="category"
                dataKey="time" 
                tick={{ fontSize: 12, fill: axisColor }}
                stroke={axisColor}
              />
              <YAxis 
                type="number"
                dataKey="quantity"
                tick={{ fontSize: 12, fill: axisColor }}
                stroke={axisColor}
                name="Quantity"
                domain={getYAxisDomain()}
                scale={scaleConfig.yScale}
              />
              <Tooltip content={renderTooltip} />
              <Legend />
              <Scatter 
                name="Buy Orders" 
                dataKey="quantity"
                fill={chartColors.buy}
                shape="circle"
                data={data.filter(d => d.isBuy)}
              />
              <Scatter 
                name="Sell Orders" 
                dataKey="quantity"
                fill={chartColors.sell}
                shape="triangle"
                data={data.filter(d => !d.isBuy)}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'price':
        return t('charts.priceChart', { symbol });
      case 'volume':
        return t('charts.volumeChart', { symbol });
      case 'quantity':
        return t('charts.quantityChart', { symbol });
      default:
        return t('charts.title', { symbol });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {getChartTitle()}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('charts.subtitle')}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <Settings2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </div>
      </div>

      {/* Chart Controls */}
      <div className="space-y-4">
        {/* Chart Type Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setChartType('price')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
              chartType === 'price'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <LineChartIcon className="w-4 h-4" />
            <span>{t('charts.controls.price')}</span>
          </button>
          <button
            onClick={() => setChartType('volume')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
              chartType === 'volume'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t('charts.controls.volume')}</span>
          </button>
          <button
            onClick={() => setChartType('quantity')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
              chartType === 'quantity'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t('charts.controls.quantity')}</span>
          </button>
        </div>

        {/* Scale Controls */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('charts.controls.yScale')}:
            </span>
            <button
              onClick={() => handleScaleChange('yScale', 'linear')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                scaleConfig.yScale === 'linear'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('charts.controls.linear')}
            </button>
            <button
              onClick={() => handleScaleChange('yScale', 'log')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                scaleConfig.yScale === 'log'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('charts.controls.log')}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              {t('charts.controls.yMin')}:
            </label>
            <input
              type="number"
              placeholder={t('charts.controls.auto')}
              value={scaleConfig.yDomain[0] === 'auto' ? '' : scaleConfig.yDomain[0]}
              onChange={(e) => {
                const value = e.target.value === '' ? 'auto' : parseFloat(e.target.value);
                setScaleConfig(prev => ({
                  ...prev,
                  yDomain: [value, prev.yDomain[1]]
                }));
              }}
              className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              {t('charts.controls.yMax')}:
            </label>
            <input
              type="number"
              placeholder={t('charts.controls.auto')}
              value={scaleConfig.yDomain[1] === 'auto' ? '' : scaleConfig.yDomain[1]}
              onChange={(e) => {
                const value = e.target.value === '' ? 'auto' : parseFloat(e.target.value);
                setScaleConfig(prev => ({
                  ...prev,
                  yDomain: [prev.yDomain[0], value]
                }));
              }}
              className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setScaleConfig({
              yScale: 'linear',
              yDomain: ['auto', 'auto'],
              xDomain: ['auto', 'auto'],
            })}
            className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('charts.controls.reset')}</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-96 w-full">
        {renderChart()}
      </div>
    </div>
  );
};

export default TradesChart;
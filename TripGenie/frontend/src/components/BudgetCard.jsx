import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { DollarSign, Wallet, PiggyBank, Users, TrendingDown } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetCard({ budgetBreakdown, travelers = 1 }) {
  if (!budgetBreakdown) return null;

  const {
    accommodation = 0,
    food = 0,
    activities = 0,
    transport = 0,
    miscellaneous = 0,
    total = 0,
    currency = 'INR',
    savingsTip,
    perPersonCost
  } = budgetBreakdown;

  const totalCalculated = total || (accommodation + food + activities + transport + miscellaneous);
  const perPerson = perPersonCost || Math.round(totalCalculated / Math.max(1, travelers));

  const chartData = {
    labels: [
      'Accommodation & Stays',
      'Food & Dining',
      'Activities & Entry',
      'Local Transport',
      'Miscellaneous & Buffer'
    ],
    datasets: [
      {
        data: [accommodation, food, activities, transport, miscellaneous],
        backgroundColor: [
          '#6366f1', // Indigo
          '#10b981', // Emerald
          '#f59e0b', // Amber
          '#0ea5e9', // Sky
          '#ec4899', // Pink
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const val = context.raw || 0;
            const pct = ((val / Math.max(1, totalCalculated)) * 100).toFixed(1);
            return ` ${currency} ${val.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
    cutout: '72%',
  };

  const categories = [
    { label: 'Accommodation', amount: accommodation, color: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Food & Dining', amount: food, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Activities & Entry', amount: activities, color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    { label: 'Local Transport', amount: transport, color: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400' },
    { label: 'Buffer / Shopping', amount: miscellaneous, color: 'bg-pink-500', text: 'text-pink-600 dark:text-pink-400' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Estimated Budget Estimation</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Statistical distribution based on travel preferences & duration
          </p>
        </div>
      </div>

      {/* Top Total Cost Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl gradient-bg shadow-lg shadow-indigo-500/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100">
            Total Trip Estimate
          </p>
          <p className="text-2xl sm:text-3xl font-black font-display mt-1">
            {currency} {totalCalculated.toLocaleString()}
          </p>
          <p className="text-[11px] text-indigo-200 mt-1">
            All-inclusive estimated expenditure
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>Per-Person Allocation</span>
          </p>
          <p className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white mt-1">
            {currency} {perPerson.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            For {travelers} traveler{travelers > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Chart and Progress Bars */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Doughnut Chart */}
        <div className="md:col-span-5 relative h-52 flex items-center justify-center">
          <Doughnut data={chartData} options={chartOptions} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Breakdown</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-200">5 Categories</span>
          </div>
        </div>

        {/* Progress List */}
        <div className="md:col-span-7 space-y-3.5">
          {categories.map((cat, i) => {
            const pct = ((cat.amount / Math.max(1, totalCalculated)) * 100).toFixed(1);
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                    <span>{cat.label}</span>
                  </div>
                  <span>
                    {currency} {cat.amount.toLocaleString()}{' '}
                    <span className="text-slate-400 font-normal">({pct}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Savings Tip Banner */}
      {savingsTip && (
        <div className="mt-6 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start space-x-3">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              AI Budget Saving Recommendation
            </h5>
            <p className="text-xs text-emerald-800 dark:text-emerald-300/90 mt-0.5 leading-relaxed font-medium">
              {savingsTip}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

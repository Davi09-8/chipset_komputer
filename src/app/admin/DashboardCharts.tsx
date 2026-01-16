'use client';

import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

interface ChartData {
    name: string;
    sales: number;
    revenue: number;
}

interface DashboardChartsProps {
    initialData: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg z-50">
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name === 'sales' ? 'Penjualan' : 'Pendapatan'}:
                        {entry.name === 'revenue'
                            ? ` Rp ${entry.value.toLocaleString('id-ID')}`
                            : ` ${entry.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function DashboardCharts({ initialData }: DashboardChartsProps) {
    const [data, setData] = useState<ChartData[]>(initialData);
    const [viewMode, setViewMode] = useState<'yearly' | 'monthly'>('yearly');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    const fetchMonthData = async (date: Date) => {
        setIsLoading(true);
        try {
            const dateStr = date.toISOString().split('T')[0];
            const res = await fetch(`/api/admin/stats?range=specific_month&date=${dateStr}`, { cache: 'no-store' });
            const json = await res.json();
            if (json.success && json.data.chartData) {
                setData(json.data.chartData);
            }
        } catch (error) {
            console.error('Failed to fetch chart data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBarClick = (entry: any, index: number) => {
        if (viewMode === 'monthly') return;

        // Determine the clicked month relative to the end of the data array.
        // Assuming the last item in 'initialData' is the current month.
        const monthsAgo = initialData.length - 1 - index;
        const targetDate = new Date();
        targetDate.setDate(1); // Safer to set to 1st
        targetDate.setMonth(targetDate.getMonth() - monthsAgo);

        setCurrentDate(targetDate);
        setViewMode('monthly');
        fetchMonthData(targetDate);
    };

    const handleBack = () => {
        setViewMode('yearly');
        setData(initialData);
    };

    const handleMonthChange = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        setCurrentDate(newDate);
        fetchMonthData(newDate);
    };

    const formatXAxis = (tickItem: string) => {
        if (viewMode === 'monthly') return tickItem;
        // For yearly, if it's "Jan 2024", split and take "Jan"
        return tickItem.split(' ')[0];
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    {viewMode === 'monthly' && (
                        <button
                            onClick={handleBack}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                            title="Kembali ke Ringkasan"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {viewMode === 'yearly'
                                ? 'Analisis Penjualan & Pendapatan'
                                : currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                            }
                        </h2>
                        <p className="text-sm text-gray-500">
                            {viewMode === 'yearly' ? 'Ringkasan 12 Bulan Terakhir' : 'Detail Harian'}
                        </p>
                    </div>
                </div>

                {viewMode === 'monthly' && (
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => handleMonthChange('prev')}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => handleMonthChange('next')}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
                            disabled={new Date(currentDate).getMonth() === new Date().getMonth() && new Date(currentDate).getFullYear() === new Date().getFullYear()}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Aktivitas Penjualan</h3>
                        <p className="text-sm text-gray-500">
                            {viewMode === 'yearly' ? 'Klik batang untuk detail harian' : 'Total pesanan per hari'}
                        </p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart key={viewMode} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 11 }}
                                    dy={10}
                                    tickFormatter={formatXAxis}
                                    interval={0}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6' }} />
                                <Bar
                                    dataKey="sales"
                                    fill="#3B82F6"
                                    radius={[4, 4, 0, 0]}
                                    barSize={viewMode === 'yearly' ? 30 : 10}
                                    activeBar={{ fill: '#2563EB', cursor: 'pointer' }}
                                    onClick={handleBarClick}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Pendapatan</h3>
                        <p className="text-sm text-gray-500">
                            {viewMode === 'yearly' ? 'Klik untuk detail bulanan' : 'Total pendapatan per hari'}
                        </p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart key={viewMode} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 11 }}
                                    dy={10}
                                    tickFormatter={formatXAxis}
                                    interval={0}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    tickFormatter={(value) => {
                                        if (value >= 1000000) return `${(value / 1000000).toFixed(0)}jt`;
                                        if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
                                        return value;
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    activeDot={{ r: 6, cursor: 'pointer', onClick: (props: any) => handleBarClick(null, props.index) }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    LineChart, Line,
    LabelList
} from 'recharts';
import { useExperiences } from '../../hooks/useExperiences';
import { useCurrentChild } from '../../hooks/useCurrentChild';
import { ChildSelectorSimple as ChildSelector } from '../../components/ui/ChildSelector';
import { Card } from '../../components/ui/Card';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

// ... (Tooltip interfaces remain same)

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        payload: {
            name: string;
            count: number;
        };
    }>;
    label?: string;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-slate-200 rounded shadow-sm text-xs">
                <p className="font-semibold">{payload[0].payload.name}</p>
                <p className="text-slate-600">횟수: {payload[0].value}</p>
            </div>
        );
    }
    return null;
};

export const StatsPage = () => {
    const { currentChild, children, setCurrentChild, loading: childLoading } = useCurrentChild();
    const { experiences, loading: expLoading } = useExperiences({
        childId: currentChild?.id
    });
    const loading = childLoading || expLoading;

    const [timeRange, setTimeRange] = useState('all');

    const filteredExperiences = useMemo(() => {
        if (timeRange === 'all') return experiences;

        const now = new Date();
        const cutoff = new Date();
        if (timeRange === '3m') {
            cutoff.setMonth(now.getMonth() - 3);
        } else if (timeRange === 'year') {
            cutoff.setFullYear(now.getFullYear(), 0, 1);
            cutoff.setHours(0, 0, 0, 0);
        }

        return experiences.filter(exp => {
            if (!exp.date) return false;
            return new Date(exp.date) >= cutoff;
        });
    }, [experiences, timeRange]);

    const categoryStats = useMemo(() => {
        const stats: Record<string, number> = {};
        filteredExperiences.forEach(exp => {
            exp.tags_category?.forEach(tag => {
                stats[tag] = (stats[tag] || 0) + 1;
            });
        });
        return Object.entries(stats)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [filteredExperiences]);

    const competencyStats = useMemo(() => {
        const stats: Record<string, number> = {};
        filteredExperiences.forEach(exp => {
            exp.tags_competency?.forEach(tag => {
                stats[tag] = (stats[tag] || 0) + 1;
            });
        });
        return Object.entries(stats)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [filteredExperiences]);

    const areaSatisfactionStats = useMemo(() => {
        const catStats: Record<string, { total: number, count: number }> = {};
        const compStats: Record<string, { total: number, count: number }> = {};

        filteredExperiences.forEach(exp => {
            const score = exp.satisfaction_score || 0;
            if (score === 0) return;

            exp.tags_category?.forEach(tag => {
                if (!catStats[tag]) catStats[tag] = { total: 0, count: 0 };
                catStats[tag].total += score;
                catStats[tag].count += 1;
            });

            exp.tags_competency?.forEach(tag => {
                if (!compStats[tag]) compStats[tag] = { total: 0, count: 0 };
                compStats[tag].total += score;
                compStats[tag].count += 1;
            });
        });

        const catResult = Object.entries(catStats)
            .map(([name, s]) => ({ name, avg: Number((s.total / s.count).toFixed(1)), count: s.count, type: '분야' }));
        const compResult = Object.entries(compStats)
            .map(([name, s]) => ({ name, avg: Number((s.total / s.count).toFixed(1)), count: s.count, type: '역량' }));

        return [...catResult, ...compResult]
            .sort((a, b) => b.avg - a.avg || b.count - a.count)
            .slice(0, 6);
    }, [filteredExperiences]);

    const satisfactionAvg = useMemo(() => {
        const total = filteredExperiences.reduce((acc, exp) => acc + (exp.satisfaction_score || 0), 0);
        return filteredExperiences.length > 0 ? (total / filteredExperiences.length).toFixed(1) : "0.0";
    }, [filteredExperiences]);

    const monthlyStats = useMemo(() => {
        const stats: Record<string, number> = {};
        // Last 6 months or all if year
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
            stats[key] = 0;
        }

        filteredExperiences.forEach(exp => {
            if (exp.date) {
                const d = new Date(exp.date);
                const key = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
                if (stats[key] !== undefined) stats[key]++;
            }
        });

        return Object.entries(stats).map(([name, count]) => ({ name, count }));
    }, [filteredExperiences]);

    const recentCompetencyStats = useMemo(() => {
        const stats: Record<string, number> = {};
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        experiences.filter(exp => exp.date && new Date(exp.date) >= oneMonthAgo).forEach(exp => {
            exp.tags_competency?.forEach(tag => {
                stats[tag] = (stats[tag] || 0) + 1;
            });
        });
        return Object.entries(stats).sort((a, b) => b[1] - a[1]);
    }, [experiences]);

    const insights = useMemo(() => {
        if (filteredExperiences.length === 0) return ["선택한 기간에는 기록된 경험이 없습니다."];

        const items = [
            `선택한 기간 동안 총 ${filteredExperiences.length}건의 경험이 기록되었습니다.`
        ];

        if (categoryStats.length > 0) {
            const maxCount = categoryStats[0].count;
            const topCategories = categoryStats.filter(s => s.count === maxCount).map(s => s.name);
            const categoryText = topCategories.length > 1
                ? `'${topCategories.join("', '")}' 분야`
                : `'${topCategories[0]}' 분야`;
            items.push(`가장 많은 활동이 이루어진 곳은 ${categoryText}입니다.`);
        }

        if (competencyStats.length > 0) {
            items.push(`전체적으로 가장 돋보인 핵심 역량은 '${competencyStats[0].name}'입니다.`);
        }

        if (recentCompetencyStats.length > 0) {
            items.push(`최근 한 달간은 '${recentCompetencyStats[0][0]}' 역량이 눈에 띄게 성장하고 있어요!`);
        }

        if (areaSatisfactionStats.length > 0) {
            const maxAvg = areaSatisfactionStats[0].avg;
            const topAreas = areaSatisfactionStats.filter(s => s.avg === maxAvg);
            const areaNames = topAreas.map(s => `'${s.name}'`).join(', ');
            const typeText = topAreas.every(s => s.type === topAreas[0].type)
                ? topAreas[0].type
                : '분야 및 역량';

            items.push(`특히 아이는 ${areaNames} ${typeText}에서 평균 ${maxAvg}점의 높은 만족도를 보였습니다.`);
        }

        return items;
    }, [filteredExperiences, categoryStats, competencyStats, recentCompetencyStats, areaSatisfactionStats]);

    if (loading) return <div className="p-8 text-center text-slate-500">불러오는 중...</div>;

    return (
        <div className="p-4 space-y-6 pb-24 max-w-4xl mx-auto bg-gray-50 min-h-screen">
            <header className="flex flex-col gap-6 px-2 pt-2">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">통계 리포트</h1>
                        <p className="text-sm font-medium text-slate-400 mt-1">
                            아이의 성장을 수치로 확인해 보세요
                        </p>
                    </div>
                    {/* Time Range Selector as a distinct action */}
                    <div className="relative">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="appearance-none bg-indigo-50 text-indigo-700 font-bold text-xs py-2.5 pl-4 pr-8 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer shadow-sm border border-indigo-100"
                        >
                            <option value="3m">최근 3개월</option>
                            <option value="year">올해 전체</option>
                            <option value="all">전체 기간</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <ChildSelector
                        children={children}
                        currentChild={currentChild}
                        onSelect={setCurrentChild}
                    />
                </div>
            </header>

            <section className="px-1">
                <div className="bg-gradient-to-br from-indigo-50/80 to-white p-5 rounded-[24px] border border-indigo-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                        AI 인사이트
                    </h4>
                    <div className="space-y-2 relative z-10">
                        {insights.map((text, i) => (
                            <p key={i} className="text-sm font-bold text-slate-700 leading-relaxed flex items-start gap-2.5">
                                <span className="text-indigo-400 mt-1 shrink-0">•</span>
                                <span>{text}</span>
                            </p>
                        ))}
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card padding className="bg-white border-none shadow-sm flex flex-col items-center justify-center py-8">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">기록 수</span>
                    <span className="text-4xl font-black text-indigo-600">{filteredExperiences.length}</span>
                </Card>
                <Card padding className="bg-white border-none shadow-sm flex flex-col items-center justify-center py-8">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">평균 만족도</span>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-black text-yellow-500">{satisfactionAvg}</span>
                        <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} className={`text-[10px] ${Number(satisfactionAvg) >= star ? 'text-yellow-500' : 'text-slate-200'}`}>★</span>
                            ))}
                        </div>
                    </div>
                </Card>
                <Card padding className="bg-white border-none shadow-sm flex flex-col items-center justify-center py-8">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">주요 역량</span>
                    <span className="text-xl font-black text-emerald-600 truncate max-w-full">
                        {competencyStats[0]?.name || '-'}
                    </span>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card padding className="bg-white border-none shadow-sm h-full">
                    <h3 className="font-black text-slate-800 mb-6 flex items-center">
                        <span className="w-1.5 h-6 bg-indigo-500 rounded-full mr-3"></span>
                        활동 분야별 분포
                    </h3>
                    {categoryStats.length > 0 ? (
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryStats} layout="vertical" margin={{ left: -10, right: 40, top: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={100}
                                        tick={{ fontSize: 13, fill: '#64748b', fontWeight: 700 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                                        {categoryStats.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                        <LabelList dataKey="count" position="right" style={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-72 flex items-center justify-center text-slate-400 text-sm italic">
                            기록을 추가하면 통계가 표시됩니다.
                        </div>
                    )}
                </Card>

                <Card padding className="bg-white border-none shadow-sm h-full">
                    <h3 className="font-black text-slate-800 mb-6 flex items-center">
                        <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
                        핵심 역량 리포트
                    </h3>
                    {competencyStats.length > 0 ? (
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {competencyStats.length >= 3 ? (
                                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={competencyStats}>
                                        <PolarGrid stroke="#f1f5f9" />
                                        <PolarAngleAxis
                                            dataKey="name"
                                            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }}
                                        />
                                        <Radar
                                            name="역량"
                                            dataKey="count"
                                            stroke="#10b981"
                                            fill="#10b981"
                                            fillOpacity={0.5}
                                        />
                                        <Tooltip />
                                    </RadarChart>
                                ) : (
                                    <BarChart data={competencyStats} layout="vertical" margin={{ left: -10, right: 40, top: 20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 700 }} axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24}>
                                            <LabelList dataKey="count" position="right" style={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                                        </Bar>
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-72 flex items-center justify-center text-slate-400 text-sm italic">
                            충분한 데이터가 쌓이면 역량이 분석됩니다.
                        </div>
                    )}
                </Card>

                <Card padding className="bg-white border-none shadow-sm h-full">
                    <h3 className="font-black text-slate-800 mb-6 flex items-center">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                        월별 성장 곡선
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyStats} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card padding className="bg-white border-none shadow-sm h-full">
                    <h3 className="font-black text-slate-800 mb-6 flex items-center">
                        <span className="w-1.5 h-6 bg-yellow-500 rounded-full mr-3"></span>
                        영역별 즐거움 지수 (평균 만족도)
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {areaSatisfactionStats.length > 0 ? (
                                <BarChart data={areaSatisfactionStats} layout="vertical" margin={{ left: -10, right: 40, top: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" domain={[0, 5]} hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={100}
                                        tick={{ fontSize: 13, fill: '#64748b', fontWeight: 700 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        formatter={(value: number | string | (number | string)[] | undefined) => [`${value ?? 0}점`, '평균 점수']}
                                        labelStyle={{ fontWeight: 700 }}
                                    />
                                    <Bar dataKey="avg" radius={[0, 4, 4, 0]} barSize={24}>
                                        {areaSatisfactionStats.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.avg >= 4 ? '#f59e0b' : entry.avg >= 3 ? '#fbbf24' : '#e2e8f0'}
                                            />
                                        ))}
                                        <LabelList dataKey="avg" position="right" style={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                                    </Bar>
                                </BarChart>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                                    만족도 데이터가 없습니다.
                                </div>
                            )}
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

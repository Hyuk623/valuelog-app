import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExperiences } from '../../hooks/useExperiences';
import { useChildren } from '../../hooks/useChildren';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Plus, Filter, Calendar, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import type { Experience } from '../../types/models';

import { ChildSelectorSimple as ChildSelector } from '../../components/ui/ChildSelector';

export const ExperienceListPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeChildId = searchParams.get('child_id') || '';
    const activeCategory = searchParams.get('category') || '';

    const { children, loading: childrenLoading } = useChildren();

    // Optimized: using minimal: true to select only necessary columns
    const {
        experiences,
        loading: experiencesLoading,
        error,
        refresh,
        categoryHistory
    } = useExperiences({ childId: activeChildId, minimal: true });

    const [searchTerm, setSearchTerm] = useState('');

    const filteredExperiences = useMemo(() => {
        return experiences.filter((exp: Experience) => {
            const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exp.activity_type?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !activeCategory || exp.tags_category?.includes(activeCategory);
            return matchesSearch && matchesCategory;
        });
    }, [experiences, searchTerm, activeCategory]);

    const activeChild = children.find(c => c.id === activeChildId);

    // Add 'All' option for the selector
    const selectorChildren = [
        { id: '', name: '전체 보기', user_id: '', created_at: '', birth_date: '' },
        ...children
    ];
    const currentSelectorChild = activeChild || selectorChildren[0];

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] p-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">기록을 불러올 수 없습니다</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{error}</p>
                <Button onClick={refresh} variant="outline" className="gap-2 rounded-xl">
                    <RefreshCw className="w-4 h-4" /> 다시 시도
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-24 max-w-[420px] mx-auto p-4">
            <header className="flex flex-col gap-6 px-2 pt-2">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">경험 기록부</h1>
                        <p className="text-sm font-medium text-slate-400 mt-1">
                            {activeChild ? `${activeChild.name}의 활동 아카이브` : '아이들의 모든 성장을 기록합니다'}
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate(activeChildId ? `/experiences/new?child_id=${activeChildId}` : '/experiences/new')}
                        className="rounded-2xl h-12 w-12 p-0 shadow-lg shadow-indigo-200/50 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all shrink-0"
                    >
                        <Plus className="w-6 h-6 text-white" />
                    </Button>
                </div>

                <div className="w-full">
                    <ChildSelector
                        children={selectorChildren as any}
                        currentChild={currentSelectorChild as any}
                        onSelect={(child) => {
                            const params = new URLSearchParams(searchParams);
                            if (child.id) {
                                params.set('child_id', child.id);
                            } else {
                                params.delete('child_id');
                            }
                            setSearchParams(params);
                        }}
                    />
                </div>
            </header>

            <div className="sticky top-0 bg-gray-50/95 backdrop-blur-xl py-4 z-20 px-2 -mx-2 space-y-3 transition-all border-b border-gray-100/50">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-slate-400" />
                    </div>
                    <Input
                        placeholder="어떤 활동을 찾고 계신가요?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border-slate-200 shadow-sm rounded-2xl h-12 pl-10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 pt-1 px-1 no-scrollbar mask-linear-fade">
                    <button
                        onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.delete('category');
                            setSearchParams(params);
                        }}
                        className={`
                            px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-200 border
                            ${!activeCategory
                                ? 'bg-slate-800 text-white border-slate-800 shadow-md shadow-slate-200 ring-2 ring-slate-100'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                        `}
                    >
                        전체 보기
                    </button>
                    {categoryHistory.map((cat: string) => (
                        <button
                            key={cat}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.set('category', cat);
                                setSearchParams(params);
                            }}
                            className={`
                                px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-200 border
                                ${activeCategory === cat
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 ring-2 ring-indigo-50'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4 px-1">
                {(experiencesLoading || childrenLoading) ? (
                    [1, 2, 3].map(i => (
                        <Card key={i} className="h-36 animate-pulse bg-white border-none shadow-sm rounded-[24px]" />
                    ))
                ) : filteredExperiences.length > 0 ? (
                    filteredExperiences.map((exp: Experience) => (
                        <Card
                            key={exp.id}
                            padding={false}
                            className="group hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer rounded-[28px] border-none bg-white shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] overflow-hidden"
                            onClick={() => navigate(`/experiences/${exp.id}`)}
                        >
                            <div className="flex min-h-[140px] sm:min-h-[100px]">
                                {/* Image Section */}
                                <div className="w-32 sm:w-40 shrink-0 relative overflow-hidden">
                                    {exp.image_url ? (
                                        <img
                                            src={exp.image_url}
                                            alt={exp.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-300">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm">
                                                <Filter className="w-6 h-6 text-slate-200" />
                                            </div>
                                        </div>
                                    )}
                                    {/* Type Badge Overlay */}
                                    {exp.activity_type && (
                                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black text-slate-700 shadow-sm border border-white/50">
                                            {exp.activity_type}
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 p-5 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <h3 className="text-lg font-black text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                {exp.title}
                                            </h3>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs font-bold text-slate-400 mb-3">
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{exp.date}</span>
                                            </div>
                                            {exp.location && (
                                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg max-w-[120px] truncate">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="truncate">{exp.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                        {exp.tags_category?.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-100/50 rounded-lg text-[10px] font-bold">
                                                #{tag}
                                            </span>
                                        ))}
                                        {exp.tags_competency?.slice(0, 2).map((tag: string) => (
                                            <span key={tag} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100/50 rounded-lg text-[10px] font-bold">
                                                #{tag}
                                            </span>
                                        ))}
                                        {((exp.tags_category?.length || 0) + (exp.tags_competency?.length || 0)) === 0 && (
                                            <span className="text-[10px] text-slate-300 font-medium px-1">태그 없음</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="w-20 h-20 bg-indigo-50/50 rounded-full flex items-center justify-center mb-6 ring-8 ring-indigo-50/20">
                            <Plus className="w-8 h-8 text-indigo-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">첫 번째 기록을 기다리고 있어요</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed max-w-[240px]">
                            아이와 함께한 특별한 순간들을<br />
                            하나씩 기록해 보세요.
                        </p>
                        <Button
                            onClick={() => navigate(activeChildId ? `/experiences/new?child_id=${activeChildId}` : '/experiences/new')}
                            className="rounded-2xl px-8 h-12 font-bold shadow-xl shadow-indigo-200/50 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all text-white"
                        >
                            기록 시작하기
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

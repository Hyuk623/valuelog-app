import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExperiences } from '../../hooks/useExperiences';
import { useChildren } from '../../hooks/useChildren';
import { Card } from '../../components/ui/Card';
import { Plus, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ExperienceListPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialChildId = searchParams.get('child_id');

    const { children } = useChildren();
    const activeChildId = initialChildId || (children.length > 0 ? children[0].id : undefined);

    const { experiences, loading, categoryHistory } = useExperiences(activeChildId);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredExperiences = useMemo(() => {
        if (!selectedCategory) return experiences;
        return experiences.filter(exp => exp.tags_category?.includes(selectedCategory));
    }, [experiences, selectedCategory]);

    const handleChildChange = (id: string) => {
        setSearchParams({ child_id: id });
        setSelectedCategory(null); // Reset category filter when switching children
    };

    if (loading) return <div className="p-8 text-center text-gray-500">불러오는 중...</div>;

    return (
        <div className="p-4 space-y-4 pb-24">
            {/* Child Selector Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
                {children.map(child => (
                    <button
                        key={child.id}
                        onClick={() => handleChildChange(child.id)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeChildId === child.id
                            ? 'bg-indigo-600 text-white shadow-md scale-105'
                            : 'bg-white text-gray-500 border border-gray-100'
                            }`}
                    >
                        {child.name}
                    </button>
                ))}
                <button
                    onClick={() => navigate('/children/new')}
                    className="px-4 py-2 rounded-full bg-gray-50 text-gray-400 text-sm font-bold border border-dashed border-gray-200"
                >
                    + 아이 추가
                </button>
            </div>

            {/* Category Filter Chips */}
            {categoryHistory.length > 0 && (
                <div className="flex items-center gap-3 py-1">
                    <div className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400">
                        <Filter className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex overflow-x-auto gap-2 scrollbar-none py-1">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${!selectedCategory
                                ? 'bg-slate-800 text-white'
                                : 'bg-white text-slate-500 border border-slate-100'}`}
                        >
                            전체
                        </button>
                        {categoryHistory.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === cat
                                    ? 'bg-teal-600 text-white shadow-sm'
                                    : 'bg-white text-slate-500 border border-slate-100'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* List */}
            <div className="space-y-3">
                {filteredExperiences.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-100">
                        <p className="text-gray-400 text-sm mb-4 font-medium">
                            {selectedCategory ? `'${selectedCategory}' 카테고리의 기록이 없습니다.` : '등록된 경험이 없습니다.'}
                        </p>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/experiences/new?child_id=${activeChildId}`)}>
                            <Plus className="w-4 h-4 mr-1" /> 새 경험 기록하기
                        </Button>
                    </div>
                ) : (
                    filteredExperiences.map(exp => (
                        <Card
                            key={exp.id}
                            padding
                            className="cursor-pointer active:scale-[0.98] transition-all hover:shadow-md border-transparent hover:border-indigo-100"
                            onClick={() => navigate(`/experiences/${exp.id}`)}
                        >
                            <div className="flex gap-4">
                                {exp.image_url ? (
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-50 shadow-sm">
                                        <img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-gray-50">
                                        <span className="text-2xl opacity-20">📝</span>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-900 truncate text-base">{exp.title}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className="text-[10px] font-black text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                            {exp.date}
                                        </span>
                                        {exp.tags_category?.slice(0, 2).map(cat => (
                                            <span key={cat} className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                                        {Object.values(exp.responses).filter(v => typeof v === 'string' && v.length > 0)[0] || '기록된 내용이 없습니다.'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

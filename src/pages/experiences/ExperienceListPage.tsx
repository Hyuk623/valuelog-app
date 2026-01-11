import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useExperiences } from '../../hooks/useExperiences';
import { useChildren } from '../../hooks/useChildren';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Plus, Filter, Calendar, MapPin, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import type { Experience } from '../../types/models';

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
            <header className="flex justify-between items-end px-1">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">경험 기록부</h1>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                        {activeChild ? `${activeChild.name}의 활동 목록` : '모든 아이들의 활동 목록'}
                    </p>
                </div>
                <Button onClick={() => navigate(activeChildId ? `/experiences/new?child_id=${activeChildId}` : '/experiences/new')} className="rounded-2xl h-12 w-12 p-0 shadow-lg shadow-indigo-100 shrink-0">
                    <Plus className="w-6 h-6" />
                </Button>
            </header>

            <div className="space-y-4 sticky top-0 bg-gray-50/80 backdrop-blur-md py-2 z-10 px-1">
                <Input
                    placeholder="활동 제목, 유형 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border-none shadow-sm rounded-2xl h-12"
                />

                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <button
                        onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.delete('category');
                            setSearchParams(params);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${!activeCategory ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'}`}
                    >
                        전체
                    </button>
                    {categoryHistory.map((cat: string) => (
                        <button
                            key={cat}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.set('category', cat);
                                setSearchParams(params);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {(experiencesLoading || childrenLoading) ? (
                    [1, 2, 3].map(i => (
                        <Card key={i} className="h-32 animate-pulse bg-gray-100" />
                    ))
                ) : filteredExperiences.length > 0 ? (
                    filteredExperiences.map((exp: Experience) => (
                        <Card
                            key={exp.id}
                            padding={false}
                            className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer rounded-[32px] border-none bg-white shadow-sm"
                            onClick={() => navigate(`/experiences/${exp.id}`)}
                        >
                            <div className="flex h-32">
                                {exp.image_url ? (
                                    <div className="w-32 h-full shrink-0">
                                        <img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-32 h-full bg-indigo-50 shrink-0 flex items-center justify-center">
                                        <Filter className="w-8 h-8 text-indigo-200" />
                                    </div>
                                )}
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-black text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{exp.title}</h3>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                                            <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {exp.date}</div>
                                            {exp.location && <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp.location}</div>}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {exp.tags_category?.slice(0, 2).map((tag: string) => (
                                            <span key={tag} className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded-lg text-[10px] font-black">{tag}</span>
                                        ))}
                                        {exp.tags_competency?.slice(0, 2).map((tag: string) => (
                                            <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="py-12 text-center bg-white rounded-[32px] shadow-sm px-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="w-8 h-8 text-gray-200" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-1">기록이 없습니다</h3>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">아이의 소중한 순간들을<br />기록하기 시작해 보세요.</p>
                        <Button onClick={() => navigate('/experiences/new')} className="rounded-2xl px-8 font-black shadow-lg shadow-indigo-50">첫 기록 남기기</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

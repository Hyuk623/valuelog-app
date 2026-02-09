import { useNavigate } from 'react-router-dom';
import { ChevronRight, Baby, Plus, Sparkles, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useChildren } from '../../hooks/useChildren';
import { useExperiences } from '../../hooks/useExperiences';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import type { Child } from '../../types/models';

export const ChildrenPage = () => {
    const navigate = useNavigate();
    const { children, loading: childrenLoading } = useChildren();
    // Fetch all experiences to show recent activity and stats
    const { experiences, loading: expLoading } = useExperiences({ minimal: true });

    const loading = childrenLoading || expLoading;

    // Get recent 3 experiences
    const recentExperiences = experiences.slice(0, 3);
    const totalExperiences = experiences.length;

    if (loading) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500 text-sm">데이터를 불러오는 중...</p>
        </div>
    );

    return (
        <div className="p-4 space-y-8 pb-24 max-w-md mx-auto">
            {/* 1. Header & Greeting */}
            <header className="pt-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">
                            안녕하세요, 부모님! <span className="inline-block animate-wave">👋</span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            오늘도 아이의 성장을 기록해 볼까요?
                        </p>
                    </div>
                </div>
            </header>

            {/* 2. Insight / Status Card */}
            <section>
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[28px] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span className="text-xs font-bold tracking-widest uppercase">Growth Journey</span>
                        </div>

                        <div className="mb-6">
                            {totalExperiences === 0 ? (
                                <div>
                                    <h2 className="text-2xl font-black leading-tight mb-2">
                                        첫 기록을<br />시작해 보세요
                                    </h2>
                                    <p className="text-indigo-100 text-sm font-medium opacity-90">
                                        아이의 작은 경험들이 모여<br />미래의 포트폴리오가 됩니다.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-3xl font-black leading-tight mb-1">
                                        총 <span className="text-yellow-300">{totalExperiences}</span>개의<br />성장이 기록되었어요
                                    </h2>
                                    <p className="text-indigo-100 text-xs font-medium mt-2 opacity-80">
                                        꾸준한 기록은 아이의 자존감을 높여줍니다.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate('/stats')}
                                className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/10"
                            >
                                <TrendingUp className="w-3.5 h-3.5" />
                                성장 리포트 보기
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. My Children List */}
            <section className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                        <Baby className="w-5 h-5 text-indigo-500" />
                        우리 아이
                    </h2>
                    <button
                        onClick={() => navigate('/children/new')}
                        className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                        + 아이 추가
                    </button>
                </div>

                {children.length === 0 ? (
                    <Card padding className="border-dashed border-2 border-gray-200 bg-gray-50 flex flex-col items-center justify-center py-8 text-center">
                        <Baby className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-gray-500 font-bold mb-4 text-sm">등록된 아이가 없습니다</p>
                        <Button onClick={() => navigate('/children/new')} size="sm" className="rounded-xl">
                            아이 등록하기
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-3">
                        {children.map((child: Child) => (
                            <div
                                key={child.id}
                                onClick={() => navigate(`/experiences?child_id=${child.id}`)}
                                className="group relative bg-white border border-gray-100 rounded-[20px] p-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors text-xl">
                                        <Baby className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-gray-800 text-base truncate group-hover:text-indigo-700 transition-colors">
                                            {child.name}
                                        </h3>
                                        {child.birth_date ? (
                                            <p className="text-xs text-gray-400 font-medium truncate mt-0.5">
                                                {child.birth_date} 생
                                            </p>
                                        ) : null}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/experiences/new?child_id=${child.id}`);
                                        }}
                                        className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all z-10"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 4. Recent Activities */}
            {experiences.length > 0 && (
                <section className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-emerald-500" />
                            최근 활동
                        </h2>
                        <button
                            onClick={() => navigate('/experiences')}
                            className="text-xs font-bold text-gray-400 hover:text-gray-600"
                        >
                            전체보기
                        </button>
                    </div>

                    <div className="space-y-3">
                        {recentExperiences.map((exp) => (
                            <div
                                key={exp.id}
                                onClick={() => navigate(`/experiences/${exp.id}`)}
                                className="bg-white border border-gray-100 rounded-[20px] p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                            >
                                <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
                                    {exp.image_url ? (
                                        <img src={exp.image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                            {exp.date}
                                        </span>
                                        {exp.activity_type && (
                                            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">
                                                {exp.activity_type}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-gray-800 text-sm truncate leading-tight">
                                        {exp.title}
                                    </h4>
                                    <div className="flex gap-1 mt-1.5 overflow-hidden">
                                        {exp.tags_competency?.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[10px] text-gray-400 px-1 border border-gray-100 rounded">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 5. Value Proposition / Educational Banner */}
            <section className="pt-2">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-[24px] p-5">
                    <h3 className="font-black text-emerald-800 text-sm mb-1">💡 왜 STARR로 기록해야 할까요?</h3>
                    <p className="text-xs text-emerald-700/80 leading-relaxed font-medium">
                        구체적인 상황(S)과 과제(T), 행동(A), 결과(R)를 정리하면 아이의 성장을 논리적으로 보여줄 수 있어요. 나중에 자소서나 포트폴리오를 만들 때 큰 자산이 됩니다!
                    </p>
                </div>
            </section>
        </div>
    );
};

import { useNavigate } from 'react-router-dom';
import { UserPlus, ChevronRight, Baby, Plus } from 'lucide-react';
import { useChildren } from '../../hooks/useChildren';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import type { Child } from '../../types/models';

export const ChildrenPage = () => {
    const navigate = useNavigate();
    const { children, loading } = useChildren();

    if (loading) return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500 text-sm">아이 목록을 불러오는 중...</p>
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">아이 목록</h1>
                    <p className="text-xs text-gray-500 mt-1">기록할 아이를 선택해 주세요</p>
                </div>
                <button
                    onClick={() => navigate('/children/new')}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                >
                    <UserPlus className="w-5 h-5" />
                </button>
            </header>

            {children.length === 0 ? (
                <div className="py-12 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Baby className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">아직 등록된 아이가 없어요</h2>
                    <p className="text-sm text-gray-400 mb-6 px-8">
                        우리 아이의 첫 소중한 경험을 기록하기 위해<br />먼저 아이를 등록해 주세요.
                    </p>
                    <Button onClick={() => navigate('/children/new')} className="rounded-2xl px-8 h-12">
                        + 첫 아이 등록하기
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {children.map((child: Child) => (
                        <Card
                            key={child.id}
                            className="group hover:border-indigo-200 transition-all cursor-pointer active:scale-[0.98] border-2 border-gray-50 bg-gradient-to-br from-white to-gray-50/30"
                            onClick={() => navigate(`/experiences?child_id=${child.id}`)}
                            padding
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Baby className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-lg text-gray-800 group-hover:text-indigo-600 transition-colors">
                                        {child.name}
                                    </h3>
                                    {child.birth_date ? (
                                        <p className="text-xs text-gray-400 mt-0.5 font-medium">
                                            🎂 {child.birth_date}
                                        </p>
                                    ) : (
                                        <p className="text-[10px] text-gray-300 mt-0.5 uppercase font-bold tracking-tight">
                                            생일 정보 없음
                                        </p>
                                    )}
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                            </div>
                        </Card>
                    ))}

                    <button
                        onClick={() => navigate('/children/new')}
                        className="w-full py-4 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 text-sm font-bold hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> 아이 추가 등록하기
                    </button>
                </div>
            )}
        </div>
    );
};

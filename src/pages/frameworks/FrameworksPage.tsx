
import { Plus, Edit3 } from 'lucide-react';
import { useFrameworks } from '../../hooks/useFrameworks';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const FrameworksPage = () => {
    //   const navigate = useNavigate(); // Will use for edit later
    const { frameworks, loading } = useFrameworks();

    if (loading) return <div className="p-8 text-center text-gray-500">불러오는 중...</div>;

    return (
        <div className="p-4 space-y-4">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-gray-900">회고 템플릿</h1>
                {/* <Button size="sm" onClick={() => navigate('/frameworks/new')}>
          <Plus className="w-4 h-4 mr-1" /> 만들기
        </Button> */}
                <Button size="sm" disabled title="Coming soon">
                    <Plus className="w-4 h-4 mr-1" /> 만들기
                </Button>
            </header>

            <div className="grid gap-3">
                {frameworks.map((fw) => (
                    <Card key={fw.id} padding className="border-l-4 border-l-orange-400">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-800">{fw.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    질문 {fw.schema.questions.length}개
                                </p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 disabled:opacity-30" disabled>
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                            {fw.schema.questions.slice(0, 3).map(q => (
                                <span key={q.key} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                    {q.label.length > 10 ? q.label.substring(0, 10) + '...' : q.label}
                                </span>
                            ))}
                            {fw.schema.questions.length > 3 && (
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md">...</span>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            <p className="text-xs text-center text-gray-400 mt-8">
                * 더 많은 커스텀 기능이 곧 추가됩니다.
            </p>
        </div>
    );
};

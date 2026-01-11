import { useState, useEffect, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChildren } from '../../hooks/useChildren';
import { useFrameworks } from '../../hooks/useFrameworks';
import { useExperiences } from '../../hooks/useExperiences';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Image as ImageIcon, CircleHelp } from 'lucide-react';
import { STARR_PRESETS } from '../../config/starrPresets';
import { getAgeGroup, getTopicGroup } from '../../utils/experienceUtils';

export const EditExperiencePage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { children } = useChildren();
    const { frameworks } = useFrameworks();
    const { getExperience, updateExperience, uploadImage, activityTypes, competencyHistory, categoryHistory } = useExperiences();

    const [loading, setLoading] = useState(true);

    // Form State
    const [childId, setChildId] = useState('');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [activityType, setActivityType] = useState('');
    const [location, setLocation] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [frameworkId, setFrameworkId] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [satisfactionScore, setSatisfactionScore] = useState<number | null>(5);
    const [tagsCompetency, setTagsCompetency] = useState<string[]>([]);
    const [tagsCategory, setTagsCategory] = useState<string[]>([]);
    const [customTag, setCustomTag] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [showExamples, setShowExamples] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

    const COMPETENCY_DEFAULTS = ['협동심', '호기심', '끈기', '리더십', '문제해결', '창의성', '공감', '소통'];
    const CATEGORY_DEFAULTS = ['예술', '과학', '스포츠', '봉사', '진로', '컴퓨팅', '음악', '언어', '독서'];

    useEffect(() => {
        let isMounted = true;
        async function load() {
            if (!id) return;
            setLoading(true);
            try {
                const exp = await getExperience(id);
                if (exp && isMounted) {
                    setChildId(exp.child_id || '');
                    setTitle(exp.title || '');
                    setDate(exp.date || '');
                    setActivityType(exp.activity_type || '');
                    setLocation(exp.location || '');
                    setFrameworkId(exp.framework_id || '');
                    setResponses(exp.responses || {});
                    setTagsCategory(exp.tags_category || []);
                    setTagsCompetency(exp.tags_competency || []);
                    setSatisfactionScore(exp.satisfaction_score ?? 5);
                    setExistingImageUrl(exp.image_url);
                    setImagePreview(exp.image_url);
                }
            } catch (e) {
                if (isMounted) {
                    console.error('Failed to load experience:', e);
                    alert('기록을 불러오는데 실패했습니다.');
                    navigate('/experiences');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        load();
        return () => { isMounted = false; };
    }, [id, getExperience, navigate]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const toggleTag = (tag: string, type: 'competency' | 'category') => {
        if (type === 'competency') {
            setTagsCompetency(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
        } else {
            setTagsCategory(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
        }
    };

    const handleAddCustomTag = () => {
        if (customTag && !tagsCompetency.includes(customTag)) {
            setTagsCompetency([...tagsCompetency, customTag]);
            setCustomTag('');
        }
    };

    const handleAddCustomCategory = () => {
        if (customCategory && !tagsCategory.includes(customCategory)) {
            setTagsCategory([...tagsCategory, customCategory]);
            setCustomCategory('');
        }
    };

    const toggleExample = (key: string) => {
        setShowExamples(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const currentChild = children.find(c => c.id === childId);
    const ageGroup = getAgeGroup(currentChild?.birth_date || null);
    const topicGroup = getTopicGroup(tagsCategory);

    const currentFramework = useMemo(() => {
        return frameworks.find(f => f.id === frameworkId) || (frameworks.length > 0 ? frameworks[0] : null);
    }, [frameworks, frameworkId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        if (!childId || !title || !date) {
            alert('필수 정보를 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            let imageUrl = existingImageUrl;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            await updateExperience(id, {
                child_id: childId,
                title,
                date,
                activity_type: activityType,
                location,
                image_url: imageUrl,
                framework_id: frameworkId || (currentFramework?.id as string),
                responses,
                tags_competency: tagsCompetency,
                tags_category: tagsCategory,
                satisfaction_score: satisfactionScore
            });
            alert('기록이 수정되었습니다.');
            navigate(`/experiences/${id}`);
        } catch (error) {
            console.error('Update failed:', error);
            alert('수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-30 border-b border-gray-100">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">기록 수정</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="max-w-md mx-auto px-4 pt-20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info Card */}
                    <Card className="p-5 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                            <h2 className="font-bold text-gray-900">기본 정보</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">아이 선택</label>
                                <select
                                    value={childId}
                                    onChange={(e) => setChildId(e.target.value)}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 bg-gray-50 border px-3"
                                    required
                                >
                                    <option value="">아이를 선택해주세요</option>
                                    {children.map(child => (
                                        <option key={child.id} value={child.id}>{child.name}</option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label="제목"
                                value={title}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                placeholder="예: 국립과학관 탐방"
                                className="bg-gray-50 border-gray-100"
                                required
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="날짜"
                                    type="date"
                                    value={date}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                                    className="bg-gray-50 border-gray-100"
                                    required
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">활동 유형</label>
                                    <input
                                        list="activity-types"
                                        value={activityType}
                                        onChange={(e) => setActivityType(e.target.value)}
                                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 bg-gray-50 border px-3"
                                        placeholder="유형 선택/입력"
                                    />
                                    <datalist id="activity-types">
                                        {activityTypes.map(type => (
                                            <option key={type} value={type} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            <Input
                                label="장소 (선택)"
                                value={location}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                                placeholder="어디서 했나요?"
                                className="bg-gray-50 border-gray-100"
                            />
                        </div>
                    </Card>

                    {/* Image Card */}
                    <Card className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                            <h2 className="font-bold text-gray-900">사진</h2>
                        </div>
                        <div
                            onClick={() => document.getElementById('image-upload')?.click()}
                            className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-300 transition-all group"
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-sm font-medium">사진 변경하기</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="p-3 bg-white rounded-full shadow-sm mb-2 mx-auto w-fit">
                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">사진을 추가해보세요</p>
                                </div>
                            )}
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                    </Card>

                    {/* STARR Content */}
                    <Card className="p-5 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                                <h2 className="font-bold text-gray-900">활동 내용 (STARR)</h2>
                            </div>
                            <select
                                value={frameworkId}
                                onChange={(e) => setFrameworkId(e.target.value)}
                                className="text-xs font-bold text-indigo-600 bg-indigo-50 border-none rounded-lg py-1 pl-2 pr-6 focus:ring-0"
                            >
                                {frameworks.map(fw => (
                                    <option key={fw.id} value={fw.id}>{fw.name}</option>
                                ))}
                            </select>
                        </div>

                        <p className="text-[11px] text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <strong>STARR 기법:</strong> {currentFramework?.description || '질문을 따라가며 경험을 기록해보세요.'} 5단계로 구성된 체계적인 기록 방식입니다.
                        </p>

                        <div className="space-y-8 relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100 -z-0"></div>
                            {Object.entries(STARR_PRESETS[ageGroup][topicGroup]).map(([key, q], idx) => {
                                const showExample = showExamples[key] || false;
                                return (
                                    <div key={key} className="relative z-10">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-4 ring-white">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-sm font-black text-gray-800 tracking-tight">
                                                        {q.label}
                                                    </label>
                                                    {q.example && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleExample(key)}
                                                            className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                                                        >
                                                            <CircleHelp className="w-3 h-3" />
                                                            {showExample ? '예시 닫기' : '예시 보기'}
                                                        </button>
                                                    )}
                                                </div>

                                                {showExample && q.example && (
                                                    <div className="mb-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-[11px] text-indigo-700 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <span className="font-bold mr-1">💡 예시:</span>
                                                        {q.example}
                                                    </div>
                                                )}

                                                <textarea
                                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setResponses({ ...responses, [key]: e.target.value })}
                                                    placeholder={q.placeholder}
                                                    className="w-full rounded-2xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4 bg-gray-50/50 min-h-[100px] border resize-none transition-all focus:bg-white"
                                                    required
                                                />
                                                <div className="mt-1.5 flex justify-end">
                                                    <span className={`text-[10px] font-bold ${(responses[key] || '').length >= 10 ? 'text-green-500' : 'text-gray-400'}`}>
                                                        {(responses[key] || '').length} / 최소 10자
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Tags Card */}
                    <Card className="p-5 space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                                <h2 className="font-bold text-gray-900">역량 태그</h2>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {COMPETENCY_DEFAULTS.concat(competencyHistory).filter((v, i, a) => a.indexOf(v) === i).map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag, 'competency')}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tagsCompetency.includes(tag)
                                            ? 'bg-green-500 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customTag}
                                    onChange={(e) => setCustomTag(e.target.value)}
                                    placeholder="직접 입력"
                                    className="flex-1 rounded-xl border-gray-200 text-sm px-3 py-2 bg-gray-50 border focus:bg-white"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                                />
                                <button type="button" onClick={handleAddCustomTag} className="px-4 py-2 bg-gray-800 text-white rounded-xl text-xs font-bold">추가</button>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                <h2 className="font-bold text-gray-900">활동 분야</h2>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {CATEGORY_DEFAULTS.concat(categoryHistory).filter((v, i, a) => a.indexOf(v) === i).map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag, 'category')}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tagsCategory.includes(tag)
                                            ? 'bg-blue-500 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    placeholder="직접 입력"
                                    className="flex-1 rounded-xl border-gray-200 text-sm px-3 py-2 bg-gray-50 border focus:bg-white"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomCategory())}
                                />
                                <button type="button" onClick={handleAddCustomCategory} className="px-4 py-2 bg-gray-800 text-white rounded-xl text-xs font-bold">추가</button>
                            </div>
                        </div>
                    </Card>

                    {/* Satisfaction Card */}
                    <Card className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-4 bg-yellow-400 rounded-full"></div>
                            <h2 className="font-bold text-gray-900">이번 활동은 어땠나요?</h2>
                        </div>
                        <div className="flex justify-between items-center px-4">
                            {[1, 2, 3, 4, 5].map((score) => (
                                <button
                                    key={score}
                                    type="button"
                                    onClick={() => setSatisfactionScore(score)}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${satisfactionScore === score
                                        ? 'bg-yellow-400 text-white shadow-md scale-110'
                                        : 'bg-gray-50 text-gray-300 hover:bg-gray-100 hover:text-gray-400'
                                        }`}
                                >
                                    <span className="text-lg font-black">{score}</span>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between mt-3 px-4 text-[10px] font-bold text-gray-400">
                            <span>아쉬웠어요</span>
                            <span>평범해요</span>
                            <span>최고였어요!</span>
                        </div>
                    </Card>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-2xl text-lg font-black shadow-lg shadow-indigo-100"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>저장 중...</span>
                            </div>
                        ) : '기록 수정하기'}
                    </Button>
                </form>
            </main>
        </div>
    );
};

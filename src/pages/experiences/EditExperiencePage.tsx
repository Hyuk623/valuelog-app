import { useState, useEffect, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChildren } from '../../hooks/useChildren';
import { useFrameworks } from '../../hooks/useFrameworks';
import { useExperiences } from '../../hooks/useExperiences';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Image as ImageIcon, X, Check, HelpCircle } from 'lucide-react';
import { STARR_PRESETS } from '../../config/starrPresets';
import type { StarrFieldKey } from '../../config/starrPresets';
import { getAgeGroup, getTopicGroup } from '../../utils/experienceUtils';

export const EditExperiencePage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { children } = useChildren();
    const { frameworks } = useFrameworks();
    const { getExperience, updateExperience, uploadImage, activityTypes, competencyHistory, categoryHistory } = useExperiences();

    const [step, setStep] = useState(1);
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

    const addCustomTag = () => {
        if (!customTag.trim()) return;
        if (!tagsCompetency.includes(customTag.trim())) {
            setTagsCompetency(prev => [...prev, customTag.trim()]);
        }
        setCustomTag('');
    };

    const addCustomCategory = () => {
        if (!customCategory.trim()) return;
        if (!tagsCategory.includes(customCategory.trim())) {
            setTagsCategory(prev => [...prev, customCategory.trim()]);
        }
        setCustomCategory('');
    };

    const handleSubmit = async () => {
        if (!id || !childId || !frameworkId || !title) return;

        setIsSubmitting(true);
        try {
            const selectedFramework = frameworks.find(f => f.id === frameworkId);

            let imageUrl = existingImageUrl;
            if (imageFile) {
                try {
                    imageUrl = await uploadImage(imageFile);
                } catch (e) {
                    const proceed = confirm((e as Error).message + '\n\n이미지 업데이트 없이 내용만 수정할까요?');
                    if (!proceed) {
                        setIsSubmitting(false);
                        return;
                    }
                }
            } else if (imagePreview === null) {
                // Image was deleted
                imageUrl = null;
            }

            await updateExperience(id, {
                child_id: childId,
                title,
                date,
                activity_type: activityType || null,
                location: location || null,
                framework_id: frameworkId,
                framework_version: selectedFramework?.version || 1,
                responses,
                tags_category: tagsCategory,
                tags_competency: tagsCompetency,
                satisfaction_score: satisfactionScore,
                image_url: imageUrl
            });
            navigate(`/experiences/${id}`, { replace: true });
        } catch (e) {
            alert('수정 실패: ' + (e as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedFramework = useMemo(() => {
        return frameworks.find(f => f.id === frameworkId) || (frameworks.length > 0 ? frameworks[0] : null);
    }, [frameworks, frameworkId]);

    const currentChild = useMemo(() => {
        return children.find(c => c.id === childId);
    }, [children, childId]);

    const ageGroup = useMemo(() => getAgeGroup(currentChild?.birth_date || null), [currentChild]);
    const topicGroup = useMemo(() => getTopicGroup(tagsCategory), [tagsCategory]);

    const allCompetencies = useMemo(() => {
        const set = new Set(COMPETENCY_DEFAULTS);
        competencyHistory.forEach(t => set.add(t));
        tagsCompetency.forEach(t => set.add(t));
        return Array.from(set);
    }, [competencyHistory, tagsCompetency]);

    const allCategories = useMemo(() => {
        const set = new Set(CATEGORY_DEFAULTS);
        categoryHistory.forEach(t => set.add(t));
        tagsCategory.forEach(t => set.add(t));
        return Array.from(set);
    }, [categoryHistory, tagsCategory]);

    const toggleExample = (key: string) => {
        setShowExamples(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) return <div className="p-8 text-center text-gray-500">불러오는 중...</div>;

    return (
        <div className="flex flex-col h-screen bg-gray-50 max-w-[420px] mx-auto overflow-hidden">
            <header className="flex items-center gap-2 p-4 bg-white border-b border-gray-100 shrink-0">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-black text-gray-900 leading-tight">기록 수정</h1>
                    <div className="flex gap-1 mt-1.5 px-0.5">
                        <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                        <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                        <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pb-24">
                <div className="p-4">
                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <section>
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 px-1">1. 기본 정보</h2>
                                <Card padding className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">아이 선택</label>
                                        <select
                                            className="block w-full rounded-xl border-gray-100 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3 border appearance-none outline-none"
                                            value={childId}
                                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setChildId(e.target.value)}
                                        >
                                            {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>

                                    <Input label="제목" value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} placeholder="예: 국립과학관 탐방" className="bg-gray-50 border-gray-100" />
                                    <Input label="날짜" type="date" value={date} onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} className="bg-gray-50 border-gray-100" />

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">활동 유형 (추천 선택)</label>
                                        <div className="relative">
                                            <Input
                                                value={activityType}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setActivityType(e.target.value)}
                                                placeholder="예: 체험학습, 캠프"
                                                className="bg-gray-50 border-gray-100"
                                            />
                                        </div>
                                        {activityTypes.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {activityTypes.slice(0, 5).map(type => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setActivityType(type)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activityType === type ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <Input label="장소 (선택)" value={location} onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} placeholder="예: 서울" className="bg-gray-50 border-gray-100" />

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">아이 만족도 {satisfactionScore && `(${satisfactionScore}점)`}</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setSatisfactionScore(star)}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${satisfactionScore && satisfactionScore >= star ? 'bg-yellow-100 text-yellow-500 scale-110' : 'bg-gray-50 text-gray-300'}`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">대표 이미지 (선택)</label>
                                        {imagePreview ? (
                                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-100 group">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full min-h-[120px] rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all text-gray-400 group">
                                                <ImageIcon className="w-8 h-8 mb-2 group-hover:text-indigo-400 transition-colors" />
                                                <span className="text-xs font-bold">이미지 추가하기</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        )}
                                    </div>
                                </Card>
                            </section>

                            <section>
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 px-1">역량 및 활동 태그</h2>
                                <Card padding className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-3 ml-1">나타난 역량 (다중 선택)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {allCompetencies.map(tag => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => toggleTag(tag, 'competency')}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tagsCompetency.includes(tag) ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <input
                                                type="text"
                                                value={customTag}
                                                onChange={(e) => setCustomTag(e.target.value)}
                                                placeholder="직접 입력..."
                                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                                                onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
                                            />
                                            <button
                                                type="button"
                                                onClick={addCustomTag}
                                                className="px-3 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold"
                                            >
                                                추가
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-3 ml-1">활동 분야 (다중 선택)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {allCategories.map(tag => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => toggleTag(tag, 'category')}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tagsCategory.includes(tag) ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <input
                                                type="text"
                                                value={customCategory}
                                                onChange={(e) => setCustomCategory(e.target.value)}
                                                placeholder="직접 입력..."
                                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
                                                onKeyDown={(e) => e.key === 'Enter' && addCustomCategory()}
                                            />
                                            <button
                                                type="button"
                                                onClick={addCustomCategory}
                                                className="px-3 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold"
                                            >
                                                추가
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            </section>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <section>
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 px-1">2. 기록 템플릿 선택</h2>
                                <div className="grid gap-3">
                                    {frameworks.map(fw => (
                                        <Card
                                            key={fw.id}
                                            padding
                                            className={`cursor-not-allowed opacity-80 border-2 rounded-2xl relative overflow-hidden group ${frameworkId === fw.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-white'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className={`font-black text-lg ${frameworkId === fw.id ? 'text-indigo-600' : 'text-gray-800'}`}>
                                                        {fw.name.includes('STARR') ? 'STARR 회고 템플릿' : fw.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-400 mt-1 font-medium">{fw.description || `질문 ${fw.schema.questions.length}개로 구성된 기록 방식입니다.`}</p>
                                                    <p className="text-[10px] text-amber-600 mt-1 font-bold">* 수정 모드에서는 템플릿 변경이 불가합니다.</p>
                                                </div>
                                                {frameworkId === fw.id && (
                                                    <div className="bg-indigo-600 text-white p-1 rounded-full">
                                                        <Check className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {step === 3 && selectedFramework && (
                        <div className="space-y-6 animate-fadeIn">
                            <section>
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                                    3. {selectedFramework.name.includes('STARR') ? 'STARR 회고' : selectedFramework.name} 수정
                                </h2>
                                <div className="space-y-6">
                                    {selectedFramework.schema.questions.map((q) => {
                                        const isStarr = selectedFramework.name.includes('STARR');
                                        const preset = isStarr ? STARR_PRESETS[ageGroup][topicGroup][q.key as StarrFieldKey] : null;

                                        const label = preset?.label || q.label;
                                        const placeholder = preset?.placeholder || (q.type === 'textarea' ? `${q.label} 내용을 입력해 주세요...` : '');
                                        const example = preset?.example;
                                        const value = (responses[q.key] || '') as string;
                                        const showExample = showExamples[q.key];

                                        return (
                                            <div key={q.key} className="space-y-2">
                                                <div className="flex items-center justify-between px-1">
                                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-tighter">
                                                        {label} {q.required && <span className="text-red-400">*</span>}
                                                    </label>
                                                    {example && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleExample(q.key)}
                                                            className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                                                        >
                                                            <HelpCircle className="w-3 h-3" />
                                                            {showExample ? '예시 닫기' : '예시 보기'}
                                                        </button>
                                                    )}
                                                </div>

                                                {showExample && example && (
                                                    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 animate-fadeIn">
                                                        <p className="text-[11px] text-indigo-700 leading-relaxed">
                                                            <span className="font-bold mr-1">💡 예시:</span>
                                                            {example}
                                                        </p>
                                                    </div>
                                                )}

                                                {q.type === 'textarea' ? (
                                                    <textarea
                                                        className="block w-full rounded-2xl border-gray-100 border bg-white p-4 min-h-[140px] text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all resize-none shadow-sm"
                                                        value={value}
                                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setResponses({ ...responses, [q.key]: e.target.value })}
                                                        required={q.required}
                                                        placeholder={placeholder}
                                                    />
                                                ) : (
                                                    <Input
                                                        value={value}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setResponses({ ...responses, [q.key]: e.target.value })}
                                                        required={q.required}
                                                        className="bg-white border-gray-100 rounded-2xl p-4"
                                                        placeholder={placeholder}
                                                    />
                                                )}

                                                {value.length > 0 && value.length < 20 && (
                                                    <p className="text-[11px] text-amber-600 font-medium px-1 flex items-center gap-1">
                                                        <span>✨</span> 조금 더 구체적으로 적어볼까요? (현재 {value.length}자)
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 pb-24 bg-white/80 backdrop-blur-md border-t border-gray-100 sticky bottom-0 z-20">
                {step === 1 && (
                    <Button
                        fullWidth
                        onClick={() => {
                            if (!title) return alert('제목을 입력해주세요.');
                            setStep(2);
                        }}
                        className="h-14 rounded-2xl shadow-lg shadow-indigo-100 text-lg font-black"
                    >
                        다음 단계로
                    </Button>
                )}
                {step === 2 && (
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold border-gray-100" onClick={() => setStep(1)}>이전</Button>
                        <Button className="flex-1 h-14 rounded-2xl shadow-lg shadow-indigo-100 font-black text-lg" onClick={() => setStep(3)}>수정 시작하기</Button>
                    </div>
                )}
                {step === 3 && (
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold border-gray-100" onClick={() => setStep(2)}>이전</Button>
                        <Button
                            className="flex-1 h-14 rounded-2xl shadow-lg shadow-indigo-100 font-black text-lg"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? '저장 중...' : '수정 완료하기'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

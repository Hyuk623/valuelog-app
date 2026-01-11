import { useState, useEffect, useMemo, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useChildren } from '../../hooks/useChildren';
import { useFrameworks } from '../../hooks/useFrameworks';
import { useExperiences } from '../../hooks/useExperiences';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Image as ImageIcon, X, Check, AlertCircle } from 'lucide-react';
import { STARR_PRESETS } from '../../config/starrPresets';
import type { StarrFieldKey } from '../../config/starrPresets';
import { getAgeGroup, getTopicGroup } from '../../utils/experienceUtils';

export const NewExperiencePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialChildId = searchParams.get('child_id');

    const { children } = useChildren();
    const { frameworks } = useFrameworks();
    const { createExperience, updateExperience, uploadImage, activityTypes, competencyHistory, categoryHistory } = useExperiences();

    const [step, setStep] = useState(1); // 1: Info, 2: Template, 3: Write

    // Form State
    const [childId, setChildId] = useState(initialChildId || '');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
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
    const [showExamples, setShowExamples] = useState<Record<string, boolean>>({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const formTopRef = useRef<HTMLDivElement>(null);

    const COMPETENCY_DEFAULTS = ['협동심', '호기심', '끈기', '리더십', '문제해결', '창의성', '공감', '소통'];
    const CATEGORY_DEFAULTS = ['예술', '과학', '스포츠', '봉사', '진로', '컴퓨팅', '음악', '언어', '독서'];

    useEffect(() => {
        if (initialChildId) setChildId(initialChildId);
        else if (children.length > 0 && !childId) setChildId(children[0].id);
    }, [children, initialChildId, childId]);

    useEffect(() => {
        if (frameworks.length > 0 && !frameworkId) {
            const starr = frameworks.find(f => f.name.includes('STARR'));
            if (starr) setFrameworkId(starr.id);
            else setFrameworkId(frameworks[0].id);
        }
    }, [frameworks, frameworkId]);

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!childId) newErrors.childId = '아이를 선택해 주세요.';
        if (!title.trim()) newErrors.title = '제목을 입력해 주세요.';
        else if (title.trim().length > 80) newErrors.title = '제목은 최대 80자까지 가능합니다.';

        if (imageFile && imageFile.size > 5 * 1024 * 1024) {
            newErrors.image = '이미지 용량은 5MB 이하만 가능합니다.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors: Record<string, string> = {};
        Object.entries(responses).forEach(([key, val]) => {
            if (typeof val === 'string' && val.length > 800) {
                newErrors[key] = '내용이 너무 깁니다. 800자 이내로 작성해 주세요.';
            }
        });

        if (tagsCategory.length > 5) newErrors.tagsCategory = '카테고리 태그는 최대 5개까지 가능합니다.';
        if (tagsCompetency.length > 8) newErrors.tagsCompetency = '역량 태그는 최대 8개까지 가능합니다.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('JPG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('이미지 용량은 5MB를 초과할 수 없습니다.');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const toggleTag = (tag: string, type: 'competency' | 'category') => {
        if (type === 'competency') {
            if (!tagsCompetency.includes(tag) && tagsCompetency.length >= 8) return;
            setTagsCompetency(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
        } else {
            if (!tagsCategory.includes(tag) && tagsCategory.length >= 5) return;
            setTagsCategory(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!validateStep1() || !validateStep3()) {
            formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);
        try {
            const selectedFramework = frameworks.find(f => f.id === frameworkId);
            const record = await createExperience({
                child_id: childId,
                title: title.trim(),
                date,
                activity_type: activityType.trim() || null,
                location: location.trim() || null,
                framework_id: frameworkId,
                framework_version: selectedFramework?.version || 1,
                responses,
                tags_category: tagsCategory,
                tags_competency: tagsCompetency,
                satisfaction_score: satisfactionScore,
                image_url: null
            });

            if (imageFile && record) {
                try {
                    const imageUrl = await uploadImage(imageFile);
                    await updateExperience(record.id, { image_url: imageUrl });
                } catch (imgErr) {
                    console.error('Image upload failed but record saved:', imgErr);
                    alert('기록은 저장되었으나 이미지 업로드에 실패했습니다. (나중에 수정 가능)');
                }
            }
            navigate('/experiences');
        } catch (e) {
            setErrors({ submit: (e as Error).message });
            formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedFramework = useMemo(() => frameworks.find(f => f.id === frameworkId) || null, [frameworks, frameworkId]);
    const currentChild = useMemo(() => children.find(c => c.id === childId), [children, childId]);
    const ageGroup = useMemo(() => getAgeGroup(currentChild?.birth_date || null), [currentChild]);
    const topicGroup = useMemo(() => getTopicGroup(tagsCategory), [tagsCategory]);

    const allCompetencies = useMemo(() => Array.from(new Set([...COMPETENCY_DEFAULTS, ...competencyHistory, ...tagsCompetency])), [competencyHistory, tagsCompetency]);
    const allCategories = useMemo(() => Array.from(new Set([...CATEGORY_DEFAULTS, ...categoryHistory, ...tagsCategory])), [categoryHistory, tagsCategory]);

    return (
        <div className="flex flex-col h-screen bg-gray-50 max-w-[420px] mx-auto overflow-hidden">
            <header className="flex items-center gap-2 p-4 bg-white border-b border-gray-100 shrink-0">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-black text-gray-900 leading-tight">새 경험 기록</h1>
                    <div className="flex gap-1 mt-1.5 px-0.5">
                        <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                        <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                        <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pb-24" ref={formTopRef}>
                <div className="p-4">
                    {errors.submit && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-red-700 text-xs font-bold animate-fadeIn">
                            <AlertCircle className="w-4 h-4" />
                            {errors.submit}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <section>
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 px-1">1. 기본 정보</h2>
                                <Card padding className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">아이 선택</label>
                                        <select
                                            className={`block w-full rounded-xl border-gray-100 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3 border appearance-none outline-none ${errors.childId ? 'border-red-300' : ''}`}
                                            value={childId}
                                            onChange={(e) => setChildId(e.target.value)}
                                        >
                                            <option value="">아이를 선택해 주세요</option>
                                            {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        {errors.childId && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.childId}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Input label="제목 (최대 80자)" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 국립과학관 탐방" className={`bg-gray-50 border-gray-100 ${errors.title ? 'border-red-300' : ''}`} />
                                        {errors.title && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.title}</p>}
                                    </div>

                                    <Input label="날짜" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-gray-50 border-gray-100" />

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">활동 유형 (추천 선택)</label>
                                        <Input
                                            value={activityType}
                                            onChange={(e) => setActivityType(e.target.value)}
                                            placeholder="예: 체험학습, 캠프"
                                            className="bg-gray-50 border-gray-100"
                                        />
                                        {activityTypes.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2 font-sans">
                                                {activityTypes.slice(0, 5).map(type => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setActivityType(type)}
                                                        className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-tight transition-all ${activityType === type ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-gray-100 text-gray-400'}`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <Input label="장소 (선택)" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="예: 서울" className="bg-gray-50 border-gray-100" />

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
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">대표 이미지 (최대 5MB)</label>
                                        {imagePreview ? (
                                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-100 group shadow-sm">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full min-h-[120px] rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 cursor-pointer hover:bg-white hover:border-indigo-200 transition-all text-gray-400 group">
                                                <ImageIcon className="w-8 h-8 mb-2 group-hover:text-indigo-400" />
                                                <span className="text-xs font-bold">이미지 추가하기</span>
                                                <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                                            </label>
                                        )}
                                        {errors.image && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{errors.image}</p>}
                                    </div>
                                </Card>
                            </section>

                            <section>
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 px-1">태그 설정</h2>
                                <Card padding className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-3 ml-1">
                                            <label className="block text-xs font-bold text-gray-500">나타난 역량 (최대 8개)</label>
                                            <span className="text-[10px] font-black text-indigo-400">{tagsCompetency.length}/8</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {allCompetencies.map(tag => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    disabled={!tagsCompetency.includes(tag) && tagsCompetency.length >= 8}
                                                    onClick={() => toggleTag(tag, 'competency')}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tagsCompetency.includes(tag) ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-3 ml-1">
                                            <label className="block text-xs font-bold text-gray-500">활동 분야 (최대 5개)</label>
                                            <span className="text-[10px] font-black text-teal-600">{tagsCategory.length}/5</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {allCategories.map(tag => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    disabled={!tagsCategory.includes(tag) && tagsCategory.length >= 5}
                                                    onClick={() => toggleTag(tag, 'category')}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tagsCategory.includes(tag) ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </section>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 px-1">2. 기록 템플릿 선택</h2>
                            <div className="grid gap-4">
                                {frameworks.map(fw => (
                                    <div
                                        key={fw.id}
                                        onClick={() => setFrameworkId(fw.id)}
                                        className={`p-6 bg-white rounded-[32px] border-2 cursor-pointer transition-all duration-300 ${frameworkId === fw.id ? 'border-indigo-600 shadow-xl shadow-indigo-50 -translate-y-1' : 'border-transparent hover:border-gray-100'}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className={`font-black text-lg ${frameworkId === fw.id ? 'text-indigo-600' : 'text-gray-900'}`}>{fw.name}</h3>
                                                <p className="text-xs text-gray-400 mt-1 font-medium italic">{fw.description || '표준 질문으로 구성된 성찰 템플릿'}</p>
                                            </div>
                                            {frameworkId === fw.id && <div className="bg-indigo-600 text-white rounded-full p-1"><Check className="w-4 h-4" /></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && selectedFramework && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 px-1">3. {selectedFramework.name} 작성</h2>
                            <div className="space-y-6">
                                {selectedFramework.schema.questions.map((q) => {
                                    const isStarr = selectedFramework.name.includes('STARR');
                                    const preset = isStarr ? STARR_PRESETS[ageGroup][topicGroup][q.key as StarrFieldKey] : null;
                                    const value = (responses[q.key] || '') as string;
                                    const fieldError = errors[q.key];
                                    return (
                                        <div key={q.key} className="space-y-2">
                                            <div className="flex items-center justify-between px-1">
                                                <label className="text-xs font-black text-gray-500 uppercase">{preset?.label || q.label}</label>
                                                {preset?.example && (
                                                    <button type="button" onClick={() => setShowExamples(p => ({ ...p, [q.key]: !p[q.key] }))} className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
                                                        {showExamples[q.key] ? 'CLOSE' : 'EXAMPLE'}
                                                    </button>
                                                )}
                                            </div>
                                            {showExamples[q.key] && (
                                                <div className="p-3 bg-white border border-indigo-100 rounded-2xl text-[11px] text-gray-500 leading-relaxed shadow-sm">
                                                    <span className="font-black text-indigo-400 mr-1">TIPS:</span> {preset?.example}
                                                </div>
                                            )}
                                            <textarea
                                                className={`w-full bg-white border rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all placeholder:text-gray-300 min-h-[140px] resize-none ${fieldError ? 'border-red-300' : 'border-gray-100'}`}
                                                value={value}
                                                onChange={(e) => setResponses({ ...responses, [q.key]: e.target.value })}
                                                placeholder={preset?.placeholder || q.label}
                                            />
                                            <div className="flex justify-between px-1 items-center">
                                                {fieldError ? (
                                                    <p className="text-[10px] text-red-500 font-bold">{fieldError}</p>
                                                ) : (
                                                    <p className={`text-[10px] font-bold ${value.length < 100 ? 'text-indigo-300' : 'text-emerald-500'}`}>
                                                        {value.length < 100 ? '💡 최소 100자 이상 작성을 권장합니다' : '✨ 양질의 기록이 작성되었습니다'}
                                                    </p>
                                                )}
                                                <span className={`text-[10px] font-bold ${value.length > 800 ? 'text-red-500' : (value.length >= 100 ? 'text-emerald-500' : 'text-gray-300')}`}>
                                                    {value.length}/800
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <footer className="p-4 pb-24 bg-white/80 backdrop-blur-md border-t border-gray-100 sticky bottom-0">
                {step === 1 && (
                    <Button fullWidth onClick={() => validateStep1() && setStep(2)} className="h-14 rounded-2xl font-black text-lg shadow-lg shadow-indigo-50">다음 단계로</Button>
                )}
                {step === 2 && (
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black" onClick={() => setStep(1)}>이전</Button>
                        <Button className="flex-1 h-14 rounded-2xl font-black text-lg bg-gray-900" onClick={() => setStep(3)}>작성 시작하기</Button>
                    </div>
                )}
                {step === 3 && (
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black" onClick={() => setStep(2)}>이전</Button>
                        <Button className="flex-1 h-14 rounded-2xl font-black text-lg" disabled={isSubmitting} onClick={handleSubmit}>
                            {isSubmitting ? '저장 중...' : '기록 완료하기'}
                        </Button>
                    </div>
                )}
            </footer>
        </div>
    );
};

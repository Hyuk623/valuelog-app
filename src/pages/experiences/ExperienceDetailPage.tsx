import { useEffect, useState } from 'react';
import { ConversationOverlay } from '../../components/experiences/ConversationOverlay';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { SYSTEM_TEMPLATES } from '../../config/systemTemplates';
import type { Experience, Framework } from '../../types/models';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Calendar, MapPin, Tag, Copy, Check as CheckIcon, Trash2, PartyPopper } from 'lucide-react';
import { useExperiences } from '../../hooks/useExperiences';

/**
 * [SUB-COMPONENT] CopyButton
 * Moved above main component to ensure definition availability
 */
export const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };
    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${copied
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
                }`}
        >
            {copied ? (
                <>
                    <CheckIcon className="w-3 h-3" />
                    복사됨
                </>
            ) : (
                <>
                    <Copy className="w-3 h-3" />
                    복사
                </>
            )}
        </button>
    );
};

// [HELPER] ensurePeriod - Ensures sentence ends with punctuation
const ensurePeriod = (str?: any): string => {
    const s = String(str || "").trim();
    if (!s) return "";
    return s.match(/[.!?]$/) ? s : s + ".";
};

// [HELPER] convertToNounEnding - Simple heuristic to convert Korean sentence endings to noun form
const convertToNounEnding = (str?: any): string => {
    let s = String(str || "").trim();
    if (!s) return "";
    s = s.replace(/[.!?]+$/, ""); // Remove period for processing

    const endings = [
        ['했습니다', '함'], ['았습니다', '았음'], ['었습니다', '었음'],
        ['합니다', '함'], ['입니다', '임'],
        ['였다', '였음'], ['했다', '했음'], ['이다', '임'],
        ['된다', '됨'], ['한다', '함'], ['본다', '봄'],
        ['준다', '줌'], ['싶다', '싶음'], ['있다', '있음'],
        ['없다', '없음'], ['같다', '같음'], ['습니다', '음']
    ];

    for (const [from, to] of endings) {
        if (s.endsWith(from)) {
            return s.slice(0, -from.length) + to;
        }
    }
    return s;
};

// [LOGIC] generateNarrative
const generateNarrative = (exp: Experience) => {
    const { date, title, responses, tags_category, tags_competency, satisfaction_score } = exp;
    const res = (responses || {}) as any;

    const s = ensurePeriod(res['S']);
    const t = ensurePeriod(res['T']);
    const a = ensurePeriod(res['A']);
    const r = ensurePeriod(res['R']);
    const r2 = ensurePeriod(res['R2']);

    const hasStarr = !!(s || t || a || r || r2);

    if (!hasStarr) {
        let fallback = `나는 ${date || '최근'}에 '${title}' 활동에 참여하며 뜻깊은 시간을 보냈다.`;
        if (Array.isArray(tags_category) && tags_category.length > 0) {
            fallback += ` 이번 활동은 평소 관심 있던 ${tags_category.join(', ')} 분야의 경험을 쌓을 수 있는 좋은 기회였다.`;
        }
        if (Array.isArray(tags_competency) && tags_competency.length > 0) {
            fallback += ` 특히 활동 과정에서 ${tags_competency.join(', ')} 역량을 발휘하며 스스로의 가능성을 확인했다.`;
        }
        if (satisfaction_score && satisfaction_score >= 4) {
            fallback += ` 활동 전반에 대한 만족도가 매우 높았으며, 다음에도 기회가 된다면 꼭 다시 참여하고 싶다.`;
        }
        return fallback;
    }

    let text = `나는 ${date || '최근'}에 '${title}' 활동에 참여했다.`;

    if (s) text += ` ${s}`;
    if (t) text += ` 당시 ${t}`;
    if (a) text += ` 이를 위해 ${a}`;
    if (r) text += ` 그 결과 ${r}`;
    if (r2) text += ` 이 경험을 통해 ${r2}`;

    return text.replace(/\s+/g, " ").trim();
};

// [LOGIC] generateSummary
const generateSummary = (exp: Experience) => {
    const { title, responses } = exp;
    const res = (responses || {}) as any;

    const s = convertToNounEnding(res['S']);
    const t = convertToNounEnding(res['T']);
    const a = convertToNounEnding(res['A']);
    const r = convertToNounEnding(res['R']);
    const r2 = convertToNounEnding(res['R2']);

    const parts: string[] = [];

    // Title
    if (title) parts.push(`[${title}] 활동 수행.`);

    // STARR
    if (s) parts.push(`${s}.`);
    if (t) parts.push(`${t}.`);
    if (a) parts.push(`구체적으로 ${a}.`);
    if (r) parts.push(`그 결과 ${r}.`);
    if (r2) parts.push(`${r2}.`);

    return parts.join(" ");
};

/**
 * [PAGE COMPONENT] ExperienceDetailPage
 */
export const ExperienceDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const isNew = location.state?.isNew as boolean;

    const [experience, setExperience] = useState<Experience | null>(null);
    const [framework, setFramework] = useState<Framework | null>(null);
    const [loading, setLoading] = useState(true);
    const [showConversation, setShowConversation] = useState(false);

    // Fetch all experiences to show related items
    const { deleteExperience, experiences: allExperiences } = useExperiences({ minimal: true });

    // Calculate related experiences (exclude current, same child, max 3)
    const relatedExperiences = allExperiences
        .filter(e => e.id !== id && e.child_id === experience?.child_id)
        .slice(0, 3);


    useEffect(() => {
        async function load() {
            if (!id) return;
            try {
                const { data, error: expError } = await supabase
                    .from('experiences')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (expError || !data) {
                    console.error('Error fetching experience:', expError);
                    alert('기록을 찾을 수 없습니다.');
                    navigate('/experiences');
                    return;
                }

                const exp = data as unknown as Experience;
                setExperience(exp);

                // Framework Resolution Strategy:
                // 1. Check System Templates (Memory) first for known IDs or default fallback
                // 2. Then check Database for custom/user templates
                let resolvedFramework: Framework | null = null;
                const fwId = exp.framework_id;

                // A. Check Memory (System Templates)
                // Handle 'system-starr' explicitly, or fallback to it if ID is null (legacy default)
                const systemTemplate = SYSTEM_TEMPLATES.find(t =>
                    t.id === fwId || (!fwId && t.id === 'system-starr')
                );

                if (systemTemplate) {
                    resolvedFramework = {
                        id: systemTemplate.id,
                        user_id: 'system',
                        name: systemTemplate.name,
                        description: systemTemplate.description,
                        version: systemTemplate.version,
                        schema: systemTemplate.schema,
                        created_at: new Date().toISOString()
                    };
                }
                // B. Fetch from DB if not a system template
                else if (fwId) {
                    const { data: fw } = await supabase
                        .from('frameworks')
                        .select('*')
                        .eq('id', fwId)
                        .single();
                    if (fw) resolvedFramework = fw as Framework;
                }

                setFramework(resolvedFramework);
            } catch (err) {
                console.error('Data loading error:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id, navigate]);

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold">데이터를 불러오는 중...</div>;
    if (!experience) return <div className="p-8 text-center text-red-500">기록을 찾을 수 없습니다.</div>;

    return (
        <div className="p-4 space-y-4 pb-24 bg-gray-50 min-h-screen">
            {isNew && (
                <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[24px] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden animate-fadeIn">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="relative z-10 text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-3 backdrop-blur-sm animate-bounce">
                            <PartyPopper className="w-8 h-8 text-yellow-300" />
                        </div>
                        <h2 className="text-2xl font-black mb-1">기록 완료!</h2>
                        <p className="text-indigo-100 text-sm font-medium">
                            아이의 멋진 성장이 기록되었어요.<br />
                            하단에서 <span className="text-yellow-300 font-bold border-b border-yellow-300/50">자동 생성된 포트폴리오</span>를 확인해보세요!
                        </p>
                    </div>
                </div>
            )}

            {showConversation && experience && (
                <ConversationOverlay
                    experience={experience}
                    onClose={() => setShowConversation(false)}
                />
            )}

            <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="font-black text-gray-900">기록 상세</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConversation(true)}
                    className="text-xs font-bold text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100 rounded-xl"
                >
                    <PartyPopper className="w-3.5 h-3.5 mr-1.5" />
                    아이와 함께 보기
                </Button>
            </header>


            <div className="space-y-4">
                {experience.image_url && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 border border-gray-100 shadow-sm bg-gray-200">
                        <img src={experience.image_url} alt={experience.title} className="w-full h-full object-cover" />
                    </div>
                )}
                <h1 className="text-2xl font-black text-gray-900 leading-tight">{experience.title}</h1>
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    {experience.date && (
                        <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-100">
                            <Calendar className="w-3.5 h-3.5" />
                            {experience.date}
                        </div>
                    )}
                    {experience.location && (
                        <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-gray-100">
                            <MapPin className="w-3.5 h-3.5" />
                            {experience.location}
                        </div>
                    )}
                    {experience.activity_type && (
                        <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100 font-bold">
                            <Tag className="w-3.5 h-3.5" />
                            {experience.activity_type}
                        </div>
                    )}
                </div>
            </div>

            <Card padding className="space-y-6 mt-6">
                {(framework?.schema?.questions && Array.isArray(framework.schema.questions)) ? (
                    framework.schema.questions.map(q => {
                        const answer = (experience.responses as any)?.[q.key];
                        if (!answer) return null;
                        return (
                            <div key={q.key} className="space-y-1.5">
                                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest px-1">{q.label}</h4>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                                    {answer}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-amber-50 p-5 rounded-2xl text-xs text-amber-800 border border-amber-100">
                        <p className="font-bold mb-2">💡 템플릿 정보 없이 저장된 기록입니다.</p>
                        <pre className="p-3 bg-white/50 rounded-xl overflow-x-auto">
                            {JSON.stringify(experience.responses || {}, null, 2)}
                        </pre>
                    </div>
                )}
            </Card>

            <section className="mt-10 space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">포트폴리오 전환</h3>
                <Card padding className="bg-slate-50 border-none shadow-inner space-y-8">
                    {/* Narrative Card */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-500 flex items-center gap-1.5">
                                <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                                포트폴리오·일기형 서술형
                            </span>
                            <CopyButton text={generateNarrative(experience)} />
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-line shadow-sm min-h-[60px]">
                            {generateNarrative(experience)}
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="pt-4 space-y-3 border-t border-slate-200/50">
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-slate-500 flex items-center gap-1.5">
                                    <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                                    요약 텍스트 (자소서·체험학습 보고서용)
                                </span>
                                <CopyButton text={generateSummary(experience)} />
                            </div>
                            <p className="text-[10px] text-slate-400 ml-2.5 leading-tight font-medium">
                                *체험학습 보고서, 자기소개서, 활동 소감문 등에 활용할 수 있는 요약 문장입니다.
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-line shadow-sm min-h-[60px]">
                            {generateSummary(experience)}
                        </div>
                    </div>
                </Card>
            </section>

            {relatedExperiences.length > 0 && (
                <section className="pt-8 border-t border-gray-200/50">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 px-1">
                        이 아이의 다른 경험들
                    </h3>
                    <div className="space-y-3">
                        {relatedExperiences.map(item => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/experiences/${item.id}`)}
                                className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm truncate">{item.title}</h4>
                                    <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
                                </div>
                                <div className="mr-2">
                                    <ArrowLeft className="w-4 h-4 text-gray-300 rotate-180" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="flex justify-end gap-3 pt-8">

                <Button
                    variant="outline"
                    className="flex-1 h-12 text-red-500 border-red-100 hover:bg-red-50 rounded-2xl font-bold"
                    onClick={async () => {
                        if (confirm('이 기록을 삭제하시겠습니까?')) {
                            try {
                                await deleteExperience(experience.id);
                                navigate('/experiences', { replace: true });
                            } catch (e) {
                                alert('삭제에 실패했습니다.');
                            }
                        }
                    }}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                </Button>
                <Button
                    className="flex-[2] h-12 rounded-2xl font-black text-lg"
                    onClick={() => navigate(`/experiences/${experience.id}/edit`)}
                >
                    내용 수정하기
                </Button>
            </div>
        </div>
    );
};

export default ExperienceDetailPage;

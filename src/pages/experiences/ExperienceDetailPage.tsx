import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import type { Experience, Framework } from '../../types/models';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Calendar, MapPin, Tag, Copy, Check as CheckIcon, Trash2 } from 'lucide-react';
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

// [HELPER] cleanSentence - Escaped special characters for safety
const cleanSentence = (raw?: any): string => {
    if (raw === undefined || raw === null) return "";
    const str = String(raw).trim();
    if (!str) return "";
    // 제거: . ! ? \u2026 (ellipsis) " ' \u201d (smart quote) \u2019 (smart quote)
    return str.replace(/[.!?\u2026]+$/g, "").replace(/["'\u201d\u2019]+$/g, "").trim();
};

// [LOGIC] generateNarrative
const generateNarrative = (exp: Experience) => {
    const { date, title, responses, tags_category, tags_competency, satisfaction_score } = exp;
    const res = (responses || {}) as any;
    const s = cleanSentence(res['S']);
    const t = cleanSentence(res['T']);
    const a = cleanSentence(res['A']);
    const r = cleanSentence(res['R']);
    const r2 = cleanSentence(res['R2']);

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
    if (s || t) {
        text += " 이번 활동을 통해";
        if (s) text += ` ${s} 상황에서`;
        if (t) text += ` '${t}'라는 목표를 달성하고자 노력했다.`;
        else text += " 구체적인 목표를 세워 실천했다.";
    }
    if (a) text += ` 특히 ${a}와(과) 같은 구체적인 행동을 직접 수행하며 적극적으로 임했다.`;
    if (r) text += ` 그 결과 ${r} 성과를 거둘 수 있었다.`;
    if (r2) text += ` 이 소중한 경험을 통해 ${r2} 점을 깊이 깨달으며 한 단계 더 성장할 수 있었다.`;
    return text;
};

// [LOGIC] generateSummary
const generateSummary = (exp: Experience) => {
    const { title, responses, tags_competency } = exp;
    const res = (responses || {}) as any;

    const s = cleanSentence(res['S']);
    const a = cleanSentence(res['A']);
    const r = cleanSentence(res['R']);
    const r2 = cleanSentence(res['R2']);
    const titleClean = cleanSentence(title);

    // 핵심 역량: 최대 3개 선택하여 join
    const comps = (Array.isArray(tags_competency) ? tags_competency : []).map(t => cleanSentence(t)).filter(Boolean);
    const compPhrase = comps.slice(0, 3).length > 0
        ? `${comps.slice(0, 3).join(", ")} 역량을`
        : "핵심 역량을";

    // 1. 활동/상황 구성
    let situationPart = "";
    if (s && s.length > 5) {
        situationPart = `${s} 과정에서`;
    } else if (titleClean) {
        situationPart = `${titleClean} 활동에서`;
    } else {
        situationPart = "이번 활동을 통해";
    }

    // 2. 행동 및 결과/배움 압축
    let actionResultPart = "";

    if (a && (r || r2)) {
        const outcome = r || r2;
        actionResultPart = `${a}을(를) 주도적으로 수행하며 ${compPhrase} 강화하였고, 그 결과 ${outcome} 성과를 거둔 의미 있는 경험임.`;
    } else if (a) {
        actionResultPart = `${a}을(를) 직접 계획하고 실행하며 ${compPhrase} 집중적으로 키운 과정임.`;
    } else if (r || r2) {
        const outcome = r || r2;
        actionResultPart = `적극적인 참여를 통해 ${compPhrase} 발휘하였으며, ${outcome} 점을 깊이 체감한 성장형 경험임.`;
    } else {
        actionResultPart = `성실한 태도로 임하며 ${compPhrase} 기르고 성취감을 맛본 유의미한 시간이었음.`;
    }

    const final = `${situationPart} ${actionResultPart}`;
    return final.replace(/\s+/g, " ").trim();
};

/**
 * [PAGE COMPONENT] ExperienceDetailPage
 */
export const ExperienceDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [experience, setExperience] = useState<Experience | null>(null);
    const [framework, setFramework] = useState<Framework | null>(null);
    const [loading, setLoading] = useState(true);
    const { deleteExperience } = useExperiences();

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

                if (exp.framework_id) {
                    const { data: fw } = await supabase
                        .from('frameworks')
                        .select('*')
                        .eq('id', exp.framework_id)
                        .single();
                    if (fw) setFramework(fw as Framework);
                }
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
            <header className="flex items-center gap-2 mb-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="font-black text-gray-900">기록 상세</span>
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

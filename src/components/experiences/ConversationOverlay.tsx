import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import type { Experience } from '../../types/models';
import { Button } from '../ui/Button';

interface ConversationOverlayProps {
    experience: Experience;
    onClose: () => void;
}

export const ConversationOverlay = ({ experience, onClose }: ConversationOverlayProps) => {
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Questions extracted from responses
    const questions = [
        {
            type: 'intro',
            title: '사진을 보며 이야기해 볼까요?',
            content: experience.title,
            image: experience.image_url,
            prompt: '이때 어떤 기분이었는지 기억나니?'
        },
        {
            type: 'S',
            key: 'S',
            title: '어떤 상황이었나요?',
            prompt: '무슨 일이 있었는지 차근차근 말해 줄래?'
        },
        {
            type: 'T',
            key: 'T',
            title: '어떤 어려움이나 목표가 있었나요?',
            prompt: '그때 어떤 문제를 해결하고 싶었어?'
        },
        {
            type: 'A',
            key: 'A',
            title: '어떻게 행동했나요?',
            prompt: '그래서 어떻게 하기로 결심했니?'
        },
        {
            type: 'R',
            key: 'R',
            title: '결과는 어땠나요?',
            prompt: '노력한 결과가 어떻게 되었어?'
        },
        {
            type: 'feeling',
            title: '마무리하며...',
            prompt: '정말 멋진 경험이었어! 이번 일을 통해 무엇을 느꼈니?'
        }
    ];

    // Filter steps that have content (except intro/outro)
    const activeSteps = questions.filter(q =>
        q.type === 'intro' ||
        q.type === 'feeling' ||
        (q.key && (experience.responses as any)?.[q.key])
    );

    const currentStep = activeSteps[step];
    const progress = ((step + 1) / activeSteps.length) * 100;

    const handleNext = () => {
        if (step < activeSteps.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setStep(s => s + 1);
                setIsAnimating(false);
            }, 300);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setStep(s => s - 1);
                setIsAnimating(false);
            }, 300);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'Space') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step]);

    return (
        <div className="fixed inset-0 z-50 bg-indigo-900/95 backdrop-blur-md flex flex-col text-white animate-fadeIn">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 sm:p-6">
                <div className="flex items-center gap-2">
                    <span className="bg-white/20 p-1.5 rounded-full">
                        <MessageCircle className="w-4 h-4 text-yellow-300" />
                    </span>
                    <span className="font-bold text-lg tracking-tight">회고 대화 모드</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10">
                <div
                    className="h-full bg-yellow-400 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto w-full">
                <div className={`transition-all duration-300 transform ${isAnimating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>

                    <h2 className="text-xl sm:text-2xl font-black mb-8 text-indigo-200 uppercase tracking-widest">
                        {currentStep.title}
                    </h2>

                    {currentStep.image && (
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/50 max-h-[30vh] mx-auto border-4 border-white/10">
                            <img src={currentStep.image} alt="Experience" className="w-full h-full object-contain" />
                        </div>
                    )}

                    {currentStep.content && (
                        <h1 className="text-2xl sm:text-4xl font-black mb-8 leading-tight">
                            "{currentStep.content}"
                        </h1>
                    )}

                    {currentStep.key && (
                        <p className="text-lg sm:text-2xl font-medium leading-relaxed mb-8 bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/10">
                            {(experience.responses as any)?.[currentStep.key]}
                        </p>
                    )}

                    <div className="inline-flex items-center gap-3 bg-yellow-400/20 px-6 py-3 rounded-full border border-yellow-400/30">
                        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                        <span className="font-bold text-yellow-100 text-sm sm:text-base">
                            질문: {currentStep.prompt}
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation (Bottom) */}
            <div className="p-6 sm:p-8 flex justify-between items-center max-w-2xl mx-auto w-full">
                <Button
                    variant="ghost"
                    onClick={handlePrev}
                    disabled={step === 0}
                    className="text-white hover:bg-white/10 disabled:opacity-30"
                >
                    <ChevronLeft className="w-6 h-6 mr-1" />
                    이전
                </Button>

                <div className="flex gap-1.5">
                    {activeSteps.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-white scale-125' : 'bg-white/30'}`}
                        />
                    ))}
                </div>

                <Button
                    onClick={handleNext}
                    className="bg-white text-indigo-900 hover:bg-indigo-50 font-black px-6"
                >
                    {step === activeSteps.length - 1 ? '대화 종료' : '다음'}
                    {step < activeSteps.length - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
                </Button>
            </div>
        </div>
    );
};

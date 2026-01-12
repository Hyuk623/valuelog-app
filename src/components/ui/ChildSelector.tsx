import { ChevronDown, User, Users } from 'lucide-react';
import type { Child } from '../../types/models';

interface ChildSelectorProps {
    children: Child[];
    currentChild: Child | null;
    onSelect: (child: Child) => void;
    variant?: 'default' | 'minimal';
}

export function ChildSelector({ children, currentChild, onSelect, variant = 'default' }: ChildSelectorProps) {
    if (children.length === 0) return null;

    // Render a sleek, pill-shaped selector that looks like a profile switcher
    return (
        <div className="relative group">
            <div className={`
        relative flex items-center bg-white border border-slate-200 
        rounded-2xl shadow-sm hover:border-indigo-300 hover:shadow-md 
        transition-all duration-200 cursor-pointer overflow-hidden
        ${variant === 'minimal' ? 'h-10 pl-2 pr-8' : 'h-12 pl-3 pr-10'}
      `}>
                {/* Avatar / Icon Area */}
                <div className={`
          flex items-center justify-center rounded-full shrink-0
          ${currentChild ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}
          ${variant === 'minimal' ? 'w-6 h-6' : 'w-8 h-8'}
        `}>
                    {currentChild ? (
                        <span className="text-xs font-black">{currentChild.name.slice(0, 1)}</span>
                    ) : (
                        <Users size={variant === 'minimal' ? 12 : 14} />
                    )}
                </div>

                {/* Text Area */}
                <div className="ml-2 flex flex-col justify-center min-w-[60px]">
                    <span className={`
             font-bold text-slate-700 truncate block
             ${variant === 'minimal' ? 'text-xs' : 'text-sm'}
           `}>
                        {currentChild ? currentChild.name : '아이 선택'}
                    </span>
                    {/* Optional: Add 'Select Child' label if space permits, but clean is better */}
                </div>

                {/* Chevron */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown
                        size={variant === 'minimal' ? 14 : 16}
                        className="text-slate-400 group-hover:text-indigo-500 transition-colors"
                    />
                </div>

                {/* Native Select Overlay */}
                <select
                    value={currentChild?.id || ''}
                    onChange={(e) => {
                        const selected = children.find(c => c.id === e.target.value);
                        if (selected) onSelect(selected);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="아이 선택"
                >
                    {/* If 'minimal' is used (often for 'All' view), we might want a placeholder option if needed, 
                but usually standard logic handles it. 
            */}
                    {children.map((child) => (
                        <option key={child.id || 'all'} value={child.id}>
                            {child.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

// Export as ChildSelectorSimple to maintain compatibility if imports used it
export const ChildSelectorSimple = ChildSelector;
export default ChildSelector;

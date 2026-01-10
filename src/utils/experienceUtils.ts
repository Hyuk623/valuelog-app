import type { AgeGroup, TopicGroup } from '../config/starrPresets';

export function getAgeGroup(birthDate: string | null): AgeGroup {
    if (!birthDate) return "default";

    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        age--;
    }

    if (age <= 12) return "elementary";
    if (age <= 15) return "middle";
    return "default";
}

export function getTopicGroup(tagsCategory: string[] | null): TopicGroup {
    if (!tagsCategory || tagsCategory.length === 0) return "generic";

    const category = tagsCategory[0]; // Pick the first as representative

    if (category.includes('예술') || category.includes('음악') || category.includes('미술')) return "art";
    if (category.includes('과학') || category.includes('컴퓨팅')) return "science";
    if (category.includes('스포츠') || category.includes('운동')) return "sports";
    if (category.includes('진로')) return "career";

    return "generic";
}

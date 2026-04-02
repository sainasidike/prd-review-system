'use client';

interface ReviewerAvatarProps {
  reviewerId: string;
  size?: number;
}

export default function ReviewerAvatar({ reviewerId, size = 40 }: ReviewerAvatarProps) {
  const s = size;
  const avatars: Record<string, JSX.Element> = {
    // 运营团队 Leader - 戴耳机的活力女生，短发
    operation: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#D1FAE5" />
        {/* Hair */}
        <ellipse cx="40" cy="32" rx="22" ry="20" fill="#4B3621" />
        {/* Face */}
        <ellipse cx="40" cy="40" rx="18" ry="19" fill="#FDDCB5" />
        {/* Blush */}
        <circle cx="28" cy="45" r="4" fill="#FDBA9B" opacity="0.5" />
        <circle cx="52" cy="45" r="4" fill="#FDBA9B" opacity="0.5" />
        {/* Eyes - sparkly */}
        <circle cx="33" cy="40" r="3" fill="#2D2D2D" />
        <circle cx="47" cy="40" r="3" fill="#2D2D2D" />
        <circle cx="34" cy="39" r="1" fill="white" />
        <circle cx="48" cy="39" r="1" fill="white" />
        {/* Smile */}
        <path d="M35 48 Q40 53 45 48" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Headset */}
        <path d="M18 36 Q18 22 40 22 Q62 22 62 36" stroke="#10B981" strokeWidth="3" fill="none" />
        <rect x="14" y="33" width="7" height="10" rx="3" fill="#10B981" />
        <rect x="59" y="33" width="7" height="10" rx="3" fill="#10B981" />
        {/* Headset mic */}
        <path d="M14 40 L10 48" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <circle cx="9" cy="49" r="2.5" fill="#10B981" />
        {/* Bangs */}
        <path d="M24 28 Q30 18 40 22 Q34 24 28 30" fill="#4B3621" />
        <path d="M56 28 Q50 18 40 22 Q46 24 52 30" fill="#4B3621" />
      </svg>
    ),

    // 品牌团队 Leader - 戴贝雷帽的时尚女生
    brand: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#EDE9FE" />
        {/* Long hair */}
        <path d="M20 35 Q20 18 40 16 Q60 18 60 35 L60 55 Q58 60 55 58 L55 38 Q55 25 40 22 Q25 25 25 38 L25 58 Q22 60 20 55 Z" fill="#1A1A2E" />
        {/* Face */}
        <ellipse cx="40" cy="40" rx="17" ry="18" fill="#FDE8D0" />
        {/* Blush */}
        <circle cx="28" cy="44" r="3.5" fill="#F9A8D4" opacity="0.4" />
        <circle cx="52" cy="44" r="3.5" fill="#F9A8D4" opacity="0.4" />
        {/* Eyes - elegant */}
        <ellipse cx="33" cy="39" rx="2.5" ry="3" fill="#2D2D2D" />
        <ellipse cx="47" cy="39" rx="2.5" ry="3" fill="#2D2D2D" />
        <circle cx="34" cy="38" r="1" fill="white" />
        <circle cx="48" cy="38" r="1" fill="white" />
        {/* Eyelashes */}
        <path d="M30 36 L28 34" stroke="#2D2D2D" strokeWidth="1" strokeLinecap="round" />
        <path d="M50 36 L52 34" stroke="#2D2D2D" strokeWidth="1" strokeLinecap="round" />
        {/* Smile */}
        <path d="M36 47 Q40 51 44 47" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Beret */}
        <ellipse cx="40" cy="22" rx="20" ry="8" fill="#8B5CF6" />
        <ellipse cx="40" cy="20" rx="16" ry="6" fill="#A78BFA" />
        <circle cx="40" cy="14" r="3" fill="#8B5CF6" />
        {/* Earring */}
        <circle cx="23" cy="46" r="2" fill="#8B5CF6" />
      </svg>
    ),

    // 技术团队 Leader - 戴眼镜的程序员男生
    tech: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#DBEAFE" />
        {/* Hair - short messy */}
        <path d="M22 32 Q22 16 40 14 Q58 16 58 32 L56 30 Q54 18 40 18 Q26 18 24 30 Z" fill="#3D2B1F" />
        <path d="M26 20 Q30 14 36 18" fill="#3D2B1F" />
        <path d="M44 16 Q50 12 54 18" fill="#3D2B1F" />
        {/* Face */}
        <ellipse cx="40" cy="40" rx="17" ry="18" fill="#FDDCB5" />
        {/* Glasses */}
        <rect x="25" y="35" width="13" height="11" rx="3" stroke="#3B82F6" strokeWidth="2" fill="white" fillOpacity="0.3" />
        <rect x="42" y="35" width="13" height="11" rx="3" stroke="#3B82F6" strokeWidth="2" fill="white" fillOpacity="0.3" />
        <line x1="38" y1="40" x2="42" y2="40" stroke="#3B82F6" strokeWidth="2" />
        <line x1="25" y1="40" x2="21" y2="38" stroke="#3B82F6" strokeWidth="2" />
        <line x1="55" y1="40" x2="59" y2="38" stroke="#3B82F6" strokeWidth="2" />
        {/* Eyes behind glasses */}
        <circle cx="31.5" cy="41" r="2" fill="#2D2D2D" />
        <circle cx="48.5" cy="41" r="2" fill="#2D2D2D" />
        <circle cx="32" cy="40" r="0.8" fill="white" />
        <circle cx="49" cy="40" r="0.8" fill="white" />
        {/* Small smile */}
        <path d="M36 49 Q40 52 44 49" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Code brackets on shirt */}
        <path d="M32 62 L28 66 L32 70" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M48 62 L52 66 L48 70" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    ),

    // 产品团队 Leader - 灯泡脑袋的思考者，圆脸男生
    product: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#FEF3C7" />
        {/* Hair */}
        <path d="M23 34 Q23 16 40 14 Q57 16 57 34 L55 32 Q53 20 40 18 Q27 20 25 32 Z" fill="#5C3D2E" />
        {/* Face */}
        <ellipse cx="40" cy="41" rx="17" ry="18" fill="#FDDCB5" />
        {/* Eyes - curious big eyes */}
        <circle cx="33" cy="40" r="3.5" fill="white" />
        <circle cx="47" cy="40" r="3.5" fill="white" />
        <circle cx="34" cy="40" r="2.2" fill="#2D2D2D" />
        <circle cx="48" cy="40" r="2.2" fill="#2D2D2D" />
        <circle cx="35" cy="39" r="0.8" fill="white" />
        <circle cx="49" cy="39" r="0.8" fill="white" />
        {/* Eyebrows - thinking */}
        <path d="M29 35 Q33 33 37 35" stroke="#5C3D2E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M43 35 Q47 33 51 35" stroke="#5C3D2E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Smile */}
        <path d="M35 49 Q40 53 45 49" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Lightbulb above head */}
        <ellipse cx="52" cy="14" rx="6" ry="7" fill="#FCD34D" />
        <rect x="49" y="20" width="6" height="3" rx="1" fill="#FBBF24" />
        <line x1="52" y1="5" x2="52" y2="3" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="58" y1="8" x2="60" y2="6" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="46" y1="8" x2="44" y2="6" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" />
        {/* Blush */}
        <circle cx="28" cy="45" r="3" fill="#FDBA9B" opacity="0.4" />
        <circle cx="52" cy="45" r="3" fill="#FDBA9B" opacity="0.4" />
      </svg>
    ),

    // 交互团队 Leader - 拿画笔的创意女生，扎马尾
    ux: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#FCE7F3" />
        {/* Ponytail */}
        <path d="M55 26 Q65 20 68 30 Q70 40 62 42 Q58 36 56 32" fill="#8B4513" />
        {/* Hair */}
        <path d="M23 34 Q23 16 40 15 Q57 16 57 34 Q56 28 40 22 Q24 28 23 34" fill="#8B4513" />
        {/* Hair tie */}
        <circle cx="58" cy="28" r="2.5" fill="#EC4899" />
        {/* Face */}
        <ellipse cx="40" cy="40" rx="17" ry="18" fill="#FDE8D0" />
        {/* Eyes - creative sparkle */}
        <ellipse cx="33" cy="39" rx="2.5" ry="3" fill="#2D2D2D" />
        <ellipse cx="47" cy="39" rx="2.5" ry="3" fill="#2D2D2D" />
        <circle cx="34.5" cy="38" r="1.2" fill="white" />
        <circle cx="48.5" cy="38" r="1.2" fill="white" />
        {/* Happy closed-eye smile on one side */}
        <path d="M35 48 Q40 52 45 48" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Blush */}
        <circle cx="28" cy="44" r="3.5" fill="#F9A8D4" opacity="0.45" />
        <circle cx="52" cy="44" r="3.5" fill="#F9A8D4" opacity="0.45" />
        {/* Pen in hand */}
        <line x1="14" y1="58" x2="22" y2="48" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="13,60 11,64 15,62" fill="#EC4899" />
        {/* Star sparkle */}
        <path d="M62 12 L63 15 L66 15 L64 17 L65 20 L62 18 L59 20 L60 17 L58 15 L61 15 Z" fill="#F472B6" />
      </svg>
    ),

    // BI 团队 Leader - 戴鸭舌帽的数据达人
    bi: (
      <svg width={s} height={s} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="40" fill="#CFFAFE" />
        {/* Hair sides */}
        <path d="M24 34 L24 44 Q24 46 26 44 L26 34" fill="#2C1810" />
        <path d="M54 34 L54 44 Q56 46 56 44 L56 34" fill="#2C1810" />
        {/* Face */}
        <ellipse cx="40" cy="41" rx="17" ry="18" fill="#FDDCB5" />
        {/* Cap */}
        <path d="M22 32 Q22 20 40 18 Q58 20 58 32 Z" fill="#06B6D4" />
        <path d="M20 32 L60 32 L62 34 L18 34 Z" fill="#0891B2" />
        {/* Cap brim */}
        <path d="M22 33 Q14 32 16 36 Q18 38 28 35" fill="#0891B2" />
        {/* Eyes - analytical */}
        <circle cx="33" cy="41" r="2.5" fill="#2D2D2D" />
        <circle cx="47" cy="41" r="2.5" fill="#2D2D2D" />
        <circle cx="34" cy="40" r="0.8" fill="white" />
        <circle cx="48" cy="40" r="0.8" fill="white" />
        {/* Thinking expression */}
        <path d="M36 50 Q40 52 44 50" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Mini bar chart near ear */}
        <rect x="60" y="46" width="3" height="6" rx="0.5" fill="#06B6D4" opacity="0.7" />
        <rect x="64" y="42" width="3" height="10" rx="0.5" fill="#06B6D4" opacity="0.8" />
        <rect x="68" y="44" width="3" height="8" rx="0.5" fill="#06B6D4" opacity="0.6" />
        {/* Blush */}
        <circle cx="28" cy="46" r="3" fill="#FDBA9B" opacity="0.35" />
        <circle cx="52" cy="46" r="3" fill="#FDBA9B" opacity="0.35" />
      </svg>
    ),
  };

  return avatars[reviewerId] || <div className="w-full h-full rounded-full bg-gray-200" />;
}

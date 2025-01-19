import Image from 'next/image';

export default function SocialIcon({ name }: { name: string }) {
  return (
    <div className="relative w-6 h-6">
      <Image
        src={`/images/social/${name.toLowerCase()}.png`}
        alt={`${name} icon`}
        width={24}
        height={24}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
} 
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  id: string;
  title: string;
  category: string | { name: string };
  price: number;
  image: string;
}

export default function Card({ id, title, category, price, image }: CardProps) {
  const categoryName = typeof category === 'string' ? category : category.name;

  return (
    <Link href={`/new/${id}`}>
      <div className="group cursor-pointer border rounded-lg p-4 hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden rounded-md bg-white">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium line-clamp-1 overflow-hidden group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-gray-500 capitalize">{categoryName}</p>
          <p className="text-sm font-semibold text-gray-900">${price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}


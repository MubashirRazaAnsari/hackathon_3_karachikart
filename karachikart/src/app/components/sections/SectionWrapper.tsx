import Link from "next/link";

interface SectionWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
}

export default function SectionWrapper({ 
  children, 
  title, 
  description, 
  buttonText, 
  href 
}: SectionWrapperProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="space-y-2">
              {title && <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>}
              {description && <p className="text-gray-600">{description}</p>}
            </div>
            {buttonText && href && (
              <Link href={href}>
                <button className="text-gray-900 hover:text-black font-medium underline">
                  {buttonText} →
                </button>
              </Link>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
} 
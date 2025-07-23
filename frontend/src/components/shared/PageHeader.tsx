import React from "react";
import { ComponentType } from "react";

interface PageHeaderProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`mb-6 sm:mb-8 ${className}`}>
      <div className="flex items-center space-x-4 mb-3">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

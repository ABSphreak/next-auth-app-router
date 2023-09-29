'use client';

import { LucideLoader } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonProps = {
	children: React.ReactNode;
	className?: string;
	loading?: boolean;
	onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ loading, children, className, ...props }) => {
	return (
		<button
			{...(loading && { disabled: true })}
			type="button"
			className={cn(
				'bg-blue-700 flex justify-center disabled:bg-blue-400 disabled:cursor-not-allowed disabled:text-slate-200 items-center gap-x-2 text-white px-2 py-1 rounded-md hover:bg-blue-800 active:bg-blue-900',
				className
			)}
			{...props}>
			{children}
			{loading && <LucideLoader className="animate-spin" width={16} height={16} />}
		</button>
	);
};

export default Button;

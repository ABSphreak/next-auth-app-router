import { cn } from '@/lib/utils';

type InputProps = {
	className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = ({ className, ...props }) => {
	return <input className={cn('py-2 px-3 border rounded-md border-slate-100', className)} {...props} />;
};

export default Input;

import { cn } from "@/lib/utils";

interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export default function Wrapper({ children, className, ...props }: WrapperProps) {
    return (
        <div
            className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-6 md:px-8 xl:px-0", className)}
            {...props}
        >
            {children}
        </div>
    );
}

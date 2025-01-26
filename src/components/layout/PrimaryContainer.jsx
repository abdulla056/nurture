export default function PrimaryContainer({children, className = ""}) {
    
    return <div className={`gap-6 items-center py-4 px-6 bg-white rounded-xl flex flex-col shadow-[0px_0px_7px_0px_rgba(0,0,0,0.05)] ${className}`}>
        {children}
    </div>
}
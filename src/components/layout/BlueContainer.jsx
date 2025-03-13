export default function BlueContainer({children, className = "", onClick}) {
    
    return <div onClick={onClick} className={`w-full px-4 py-4 bg-background rounded-2xl flex flex-col ${className}`}>
        {children}
    </div>
}
export default function PredictionToggleButton({children, onClick, isActive}) {
    return (
        <button onClick={onClick} className={`w-1/2 flex items-center justify-center p-4 text-lg transition-all duration-150 ${isActive && "bg-primary text-white rounded-xl"}`}>
            {children}
        </button>
    )
}
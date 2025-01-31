export default function PredictionToggleButton({children, onClick, isActive}) {
    return (
        <button onClick={onClick} className={`z-40 w-1/2 flex items-center justify-center p-4 text-lg transition-all duration-150 ${isActive && "text-white"}`}>
            {children}
        </button>
    )
}
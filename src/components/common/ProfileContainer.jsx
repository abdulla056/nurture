export default function ProfileContainer({children, className}){
    return (
        <div className={`py-5 px-8 border rounded-3xl ${className}`}>
            {children}
        </div>
    )
}
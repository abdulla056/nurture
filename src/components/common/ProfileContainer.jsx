export default function ProfileContainer({children, className, ...props}){
    return (
        <div className={`py-5 px-8 border rounded-3xl ${className}`} {...props}>
            {children}
        </div>
    )
}
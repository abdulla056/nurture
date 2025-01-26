export default function IconButton({icon}) {
    return (
        <button className="bg-primary rounded-full w-12 p-3 hover:bg-secondary hover:bg-opacity-70 transition-all duration-200">
            <img src={icon} alt="Icon" className=""/>
        </button>
    )
}
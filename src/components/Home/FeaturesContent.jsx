export default function FeaturesContent({ feature, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex rounded-lg w-3/5 py-4 flex-col items-start px-4 transition-all duration-300 gap-2
        ${
          isActive
            ? "text-regular bg-[#A1D6E2] h-36"
            : "text-regular bg-[#F0F0F0] h-14 hover:bg-[#A1D6E2] hover:cursor-pointer justify-center"
        }`}
    >
      <p className="text-regular">{feature.title}</p>
      {isActive && <p className="text-small">{feature.description}</p>}
    </div>
  );
}

export default function PrimaryButton({onClick, type = "button", children}) {
    return (
        <button
            type={type}
            className="gap-2.5 self-stretch px-52 py-3 mt-12 max-w-full text-base font-semibold text-white whitespace-nowrap rounded-xl bg-primary min-h-[43px] w-[490px] max-md:px-5 max-md:mt-10"
          >
            {children}
        </button>
    )
}
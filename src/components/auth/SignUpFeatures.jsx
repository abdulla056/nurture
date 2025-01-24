import * as React from "react";

const features = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/c02fab8862c742a5a119c587d0a4921b/96bf578f820aa234d673c4aacb12b96f603fa1eee55f821b4cddc3751bb4e854?apiKey=c02fab8862c742a5a119c587d0a4921b&",
    title: "Predict causes of fetal mortality",
    description: "Save lives by predicting causes of fetal mortality.",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/c02fab8862c742a5a119c587d0a4921b/9abde9455b414165d7a42ab4c08dce06dd1456b5a5506cc2e1e0feb54b451eac?apiKey=c02fab8862c742a5a119c587d0a4921b&",
    title: "Visualize causes",
    description: "Visualize possible through graphs and interactive methods.",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/c02fab8862c742a5a119c587d0a4921b/0153b9472aa0af9dfd1768c80499595e60bd1fc59c515d31951529a36a9c757c?apiKey=c02fab8862c742a5a119c587d0a4921b&",
    title: "Real-time alerts",
    description: "Get alerted in real time at any emergency scenarios",
  },
];

function FeatureItem({ icon, title, description }) {
  return (
    <div className="flex flex-col mt-11 w-full max-md:mt-10">
      <div className="flex gap-4 text-xl font-bold text-white">
        <img
          loading="lazy"
          src={icon}
          alt=""
          className="object-contain shrink-0 my-auto aspect-[1.06] w-[17px]"
        />
        <div className="basis-auto">{title}</div>
      </div>
      <div className="mt-2.5 text-lg font-light text-white left-aligned">{description}</div>
    </div>
  );
}

export function SignUpFeatures() {
  return (
    <div className="flex flex-col min-w-[240px] w-[341px]">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/c02fab8862c742a5a119c587d0a4921b/879bea75e6f1cda64e2dd8ec2a83fa6e2c00f3eb69341aebea80014a2963363b?apiKey=c02fab8862c742a5a119c587d0a4921b&"
        alt="Nurture Logo"
        className="object-contain self-center max-w-full aspect-[2.98] w-[271px]"
      />
      {features.map((feature, index) => (
        <FeatureItem key={index} {...feature} />
      ))}
    </div>
  );
}

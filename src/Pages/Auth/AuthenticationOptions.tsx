import { useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "../../component/Buttons/PrimaryButton";

type AuthenticationOptionsProps = {
  option1?: string;
  option2?: string;
};
const AuthenticationOptions = ({
  option1,
  option2,
}: AuthenticationOptionsProps) => {
  const { t } = useTranslation();
  const [showOptions, setShowOptions] = useState(false);
  return (
    <>
      <div className="w-[400px] flex flex-col ">
        <div
          className={`${showOptions ? "border-b-1 border-gray-500 pb-2" : ""}`}
        >
          <PrimaryButton
            title={t("auth.moreOptions")}
            onClick={() => setShowOptions(!showOptions)}
          />
        </div>
        {showOptions && (
          <div className="flex flex-col transition-all transform duration-300 opacity-100 animate-fadeIn">
            <PrimaryButton title={option1} onClick={() => {}} />
            <PrimaryButton title={option2} onClick={() => {}} />
          </div>
        )}
      </div>
    </>
  );
};

export default AuthenticationOptions;

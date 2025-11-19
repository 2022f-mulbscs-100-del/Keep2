import { PiCodesandboxLogo } from "react-icons/pi";

interface SandboxMoadlProps {
  onclose: () => void;
}
function SandboxMoadl({ onclose }: SandboxMoadlProps) {
  return (
    <>
      <div className="fixed top-0 left-0 inset-0 bg-black/10 flex justify-center items-center z-50">
        <div className="bg-black p-4 rounded-lg  flex flex-col">
          <div
            className="cursor-pointer text-white text-xl font-bold p-2 flex justify-end"
            onClick={onclose}
          >
            X
          </div>
          <div className="flex justify-center items-center ">
            <PiCodesandboxLogo className="size-15" />
          </div>

          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-4  p-1 rounded-[4px] bg-transparent border border-[#525355] ">
              <input
                className="outline-none w-full"
                type="number"
                placeholder=""
              />
            </div>
            <button
              className="w-full cursor-pointer "
              onClick={() => {
                console.log("Generate Data");
              }}
            >
              Generate Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SandboxMoadl;

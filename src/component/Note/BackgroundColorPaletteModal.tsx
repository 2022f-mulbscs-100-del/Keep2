import { useEffect, useRef } from "react";
import ColorPalette from "./ColorPalette";
import { useModal } from "../../Context/ModalProvider";
type BackgroundPaletteModalProps = {
  setColor: React.Dispatch<React.SetStateAction<string>>;
  iconRef?: React.RefObject<HTMLDivElement | null>;
  noteID?: number;
};

const BackgroundPaletteModal = ({
  setColor,
  iconRef,
  noteID,
}: BackgroundPaletteModalProps) => {
  const { setBackgroundColorModal } = useModal();
  // const ref = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current && iconRef?.current) {
      const iconRect = iconRef.current.getBoundingClientRect();
      const modalRect = modalRef.current.getBoundingClientRect();
      // Position modal below and aligned with the icon
      modalRef.current.style.top = `${iconRect.bottom + 5}px`;
      modalRef.current.style.left = `${iconRect.left - modalRect.width / 2 + iconRect.width / 2}px`;
    }
  }, [iconRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setBackgroundColorModal(null);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div
      ref={modalRef}
      className="fixed bg-secondary p-4 rounded-lg shadow-2xl flex justify-center items-center z-20"
    >
      <ColorPalette noteID={noteID} setColor={setColor} />
    </div>
  );
};

export default BackgroundPaletteModal;

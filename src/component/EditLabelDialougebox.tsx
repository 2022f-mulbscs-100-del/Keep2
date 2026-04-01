import { FaPlus } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdOutlineDone } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useEditLaber } from "../Context/editLabelContext";
import { useRef, useState } from "react";
import { useTheme } from "../Context/themeSwitcherContext";
import PrimaryButton from "./Buttons/PrimaryButton";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import axios from "axios";

const Dialougebox = ({
  setisActive,
}: {
  setisActive: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const { t } = useTranslation();
  const [focus, setFocus] = useState(false);
  const [input, setInput] = useState("");
  const [labelFocus, setLabelFocus] = useState(false);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLInputElement>(null);

  const { label, setLabel } = useEditLaber();
  const { theme } = useTheme();

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const InputHandler = async () => {
    if (input.trim() === "") {
      toast.error(t("modals.labels.cannotBeEmpty"));
      return;
    }
    ref.current?.focus();
    setTimeout(() => {
      setFocus(true);
    }, 100);
    setLabel((prev) => {
      return [
        ...prev,
        {
          id: prev.length + 1,
          categoryName: input,
          isDisabled: true,
        },
      ];
    });
    setInput("");
    await axiosClient
      .post("/createLabelCategories", {
        categoryName: input,
        colorCode: "#ffffff",
      })
      .then(() => {
        toast.success(t("modals.labels.createdSuccess"));
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || t("modals.labels.failedCreate"),
        );
      });
  };

  const deleteLabel = async (id: number) => {
    try {
      await axiosClient.delete(`/deleteLabelCategories/${id}`);
      setLabel((prev) => prev.filter((item) => item.id !== id));
      toast.success(t("modals.labels.deletedSuccess"));
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || t("modals.labels.failedDelete"));
    }
  };

  return (
    <>
      <div className="fixed bg-black/60 top-0 left-0 w-full h-full flex justify-center items-center z-10">
        <div
          className={` border-borderColor border rounded-[8px] min-w-[35%] m-8 p-4  ${theme !== "dark" ? " bg-white" : " bg-black"} relative`}
        >
          <div className="p-4 pt-0 border-b-2 border-borderColor">
            <div className="py-2">
              <h1>{t("modals.labels.editLabels")}</h1>
            </div>

            {/* input field */}
            <div>
              <div className="flex py-3 gap-4 items-center ">
                <FaPlus
                  className="cursor-pointer rounded-full w-[25px] h-[25px] p-1 hover:bg-secondary"
                  onClick={() => {
                    setFocus(!focus);
                    if (!focus) {
                      ref.current?.focus();
                    } else {
                      ref.current?.blur();
                    }
                  }}
                />

                <input
                  ref={ref}
                  className="py-1 w-full border-b border-transparent focus:border-b focus:border-borderColor outline-none "
                  type="text"
                  value={input}
                  placeholder={t("modals.labels.createNew")}
                  onChange={HandleChange}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setTimeout(() => setFocus(false), 100)}
                />

                {focus && (
                  <MdOutlineDone
                    onClick={() => InputHandler()}
                    className="cursor-pointer rounded-full w-[25px] h-[25px] p-1 hover:bg-secondary"
                  />
                )}
              </div>

              {label.map((item, index) => {
                if (item.categoryName === "") return;
                return (
                  <div
                    className="flex py-2 justify-between items-center"
                    key={index}
                  >
                    <MdDelete
                      onClick={() => {
                        deleteLabel(item.id);
                      }}
                      className="cursor-pointer rounded-full w-[25px] h-[25px] p-1 hover:bg-secondary"
                    />
                    <input
                      ref={labelInputRef}
                      className="py-1  border-b border-transparent focus:border-b focus:border-borderColor outline-none "
                      type="text"
                      key={item.id}
                      defaultValue={item.categoryName}
                      disabled={item.isDisabled}
                      placeholder={t("modals.labels.createNew")}
                      onBlur={() => {
                        setLabelFocus(false);
                        setLabel((prev) => {
                          return prev.map((lab) => {
                            if (lab.id === item.id) {
                              return {
                                ...lab,
                                isDisabled: true,
                              };
                            }
                            return lab;
                          });
                        });
                      }}
                    />

                    {!labelFocus && (
                      <MdEdit
                        onClick={() => {
                          setLabel((prev) => {
                            return prev.map((lab) => {
                              if (lab.id === item.id) {
                                return {
                                  ...lab,
                                  isDisabled: !lab.isDisabled,
                                };
                              }
                              return lab;
                            });
                          });
                          setTimeout(() => {
                            labelInputRef.current?.focus();
                          }, 100);
                          setLabelFocus(true);
                        }}
                        className="cursor-pointer rounded-full w-[25px] h-[25px] p-1 hover:bg-secondary"
                      />
                    )}

                    {labelFocus && (
                      <MdOutlineDone
                        onClick={() => {
                          labelInputRef.current?.blur();
                        }}
                        className="cursor-pointer rounded-full w-[25px] h-[25px] p-1 hover:bg-secondary"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* footer */}
          <div className=" flex justify-end items-center ">
            <PrimaryButton
              title={t("modals.labels.done")}
              onClick={() => {
                // InputHandler();
                setisActive(4);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dialougebox;

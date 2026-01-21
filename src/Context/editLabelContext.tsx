"use client";

import React, { useContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
type EditLabelType = {
  id: number;
  categoryName: string;
  isDisabled: boolean;
  colorCode?: string;
};
type EditLabelContextType = {
  label: EditLabelType[];
  setLabel: React.Dispatch<React.SetStateAction<EditLabelType[]>>;
};
//eslint-disable-next-line
export const EditLabelContext = React.createContext<
  EditLabelContextType | undefined
>(undefined);

export const EditLabelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [label, setLabel] = useState<EditLabelType[]>([
    {
      id: 0,
      categoryName: "",
      isDisabled: true,
      colorCode: "#ffffff",
    },
  ]);

  useEffect(() => {
    axiosClient
      .get("/getLabelCategories")
      .then((response) => {
        const res = response.data;
        setLabel(
          res.map((item: EditLabelType) => ({
            id: item.id,
            categoryName: item.categoryName,
            isDisabled: item.isDisabled,
          })),
        );
      })
      .catch((error) => {
        toast.error("Error fetching label categories: " + error.message);
      });
  }, []);
  return (
    <EditLabelContext.Provider value={{ label, setLabel }}>
      {children}
    </EditLabelContext.Provider>
  );
};

//eslint-disable-next-line
export const useEditLaber = () => {
  const editlabel = useContext(EditLabelContext);
  if (!editlabel) {
    throw new Error("useSidebar must be used within a SideBarProvider");
  }
  return editlabel;
};

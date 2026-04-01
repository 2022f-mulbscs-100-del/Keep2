import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../../Context/UserContext";
// import { z } from "zod";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineDone } from "react-icons/md";
import axiosClient from "../../api/axiosClient";
import { useModal } from "../../Context/ModalProvider";
import { Logger } from "../../utils/Logger";
import { toast } from "react-toastify";
import { useNote } from "../../Context/noteContext";

type CollaboratorType = {
  name: string;
  collaborator: string;
  profileImage: string;
};
const CollaboratorModal = () => {
  const { t } = useTranslation();
  const { profileData } = useUser();
  const { noteId, setCollaboratorModal } = useModal();
  const [email, setEmail] = useState("");
  const { Notes } = useNote();
  const ref = useRef<HTMLDivElement | null>(null);

  // const emailParsing = z.email("Invalid email address");
  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const [CollaboratorList, setCollaboratorList] = useState<CollaboratorType[]>(
    [],
  );

  useEffect(() => {
    axiosClient
      .get(`/getCollaborators/${noteId}`)
      .then((res) => {
        res.data.collaborators.map((collaborator: CollaboratorType) => {
          axiosClient
            .get(`/getUser/${collaborator.collaborator}`)
            .then((userRes) => {
              setCollaboratorList((prevList) => [
                ...prevList,
                {
                  name: userRes.data.name,
                  collaborator: userRes.data.email,
                  profileImage: userRes.data.profileImage,
                },
              ]);
            })
            .catch((error) => {
              Logger("Error fetching user data:", error);
            });
        });
      })
      .catch((error) => {
        toast.error(t("collaboration.failedToFetchCollaborators"));
        Logger("Error fetching collaborators:", error);
      });
  }, [noteId]);

  const openNote = Notes.find((note) => note.id === noteId);

  console.log(openNote);

  const removeCollaborator = (email: string) => {
    setCollaboratorList((prevList) =>
      prevList.filter((collaborator) => collaborator.collaborator !== email),
    );
    axiosClient.delete("/deleteCollaborator", {
      data: { noteId: noteId, collaborator: email },
    });
  };

  const addCollaborator = async () => {
    if (email.trim() === "") return;
    if (email === profileData?.email) {
      toast.error(t("collaboration.cannotAddYourself"));
      setEmail("");
      return;
    }
    if (CollaboratorList.find((collab) => collab.collaborator === email)) {
      toast.error(t("collaboration.collaboratorAlreadyAdded"));
      setEmail("");
      return;
    }
    const res = await axiosClient.get(`getUser/${email}`);
    setCollaboratorList([
      ...CollaboratorList,
      { name: res.data.name, collaborator: email, profileImage: "" },
    ]);
    setEmail("");
    try {
      axiosClient.post("/addCollaborator", {
        noteId: noteId,
        collaborator: email,
      });
    } catch (error) {
      Logger("Error adding collaborator:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setCollaboratorModal(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [setCollaboratorModal]);

  const finalCollaboratorList = Array.from(
    CollaboratorList.reduce((map, collaborator) => {
      if (map.has(collaborator.collaborator)) {
        return map;
      }
      map.set(collaborator.collaborator, collaborator);
      return map;
    }, new Map()).values(),
  );

  console.log("final collaborator list", finalCollaboratorList);
  return (
    <>
      <div className="fixed bg-black/60 top-0 left-0 w-full h-full flex justify-center items-center z-50">
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className="border-borderColor border rounded-lg w-[90%] md:w-[60%] lg:w-[40%] p-6 bg-background relative shadow-2xl
                    min-h-[300px] max-h-[700px] overflow-y-auto customScrollBar
                    "
        >
          <div className=" border-b p-2">
            <h1 className="text-subheading2 bold">
              {t("collaboration.collaborators")}
            </h1>
          </div>

          <div className="flex items-center gap-3 py-4 w-full">
            <div className="h-[35px] w-[35px] rounded-full border border-amber-50 overflow-hidden">
              <img
                src={profileData?.profileImage || "/HN-PAT-ALK-2000X2000-2.jpg"}
                alt={profileData?.name}
              />
            </div>
            <div>
              <div>
                <h2 className="bold">
                  {openNote?.OwnerAttributes?.name || profileData?.name}
                  <span>{t("collaboration.owner")}</span>
                </h2>
              </div>
              <p className="opacity-50">
                {openNote?.OwnerAttributes?.email || profileData?.email}
              </p>
            </div>
          </div>

          {CollaboratorList.map((collaborator, index) => (
            <div className="flex items-center gap-3 py-4 w-full" key={index}>
              <div className="h-[35px] w-[35px] rounded-full border border-amber-50 overflow-hidden">
                <img
                  src={
                    collaborator.profileImage || "/HN-PAT-ALK-2000X2000-2.jpg"
                  }
                  alt={collaborator.name}
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <div>
                  <div>
                    <h2 className="bold">{collaborator.name}</h2>
                  </div>
                  <p className="opacity-50">{collaborator.collaborator}</p>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => removeCollaborator(collaborator.collaborator)}
                >
                  <RxCross2 />
                </div>
              </div>
            </div>
          ))}

          {/* <div className="flex items-center">
                         <div>
                         <img src="" alt="" />
                         </div>
                         <div>
                         <h2>User Name</h2><span>Owner</span>
                         <p>email</p>
                         </div>
                     </div> */}

          <div className="flex items-center gap-3 py-4 w-full">
            <div className="h-[35px] w-[35px] rounded-full border border-amber-50 overflow-hidden">
              <img
                src={profileData?.profileImage || "/HN-PAT-ALK-2000X2000-2.jpg"}
                alt={profileData?.name}
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <input
                className="focus:outline-0 w-full"
                placeholder={t("collaboration.emailPlaceholder")}
                value={email}
                onChange={HandleChange}
                type="text"
              />

              <div className="cursor-pointer" onClick={addCollaborator}>
                <MdOutlineDone />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollaboratorModal;

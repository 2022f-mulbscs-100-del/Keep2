import { useEffect, useRef, useState } from "react";
import axiosClient from "../../api/axiosClient";
// import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { useUser } from "../../Context/UserContext";
import Pills from "../../component/Pills/Pill";
import ProfileLowerSidebar from "./ProfileLowerSIdebar";
import { useScreenSize } from "../../component/CustomHooks/useScreenSize";
import { toast } from "react-toastify";
import { Logger } from "../../utils/Logger";
import LiveSearchInput from "../../component/InputFields/LiverSearchInput";
import AutoLogoutBlock from "../Settings/UserPrefrences/AutoLogutBlock";
import DateFormatBlock from "../Settings/UserPrefrences/DateFormatBlock";
import TwoFABlock from "../Settings/Security/TwoFABlock";
import ResetPasswordBlock from "../Settings/Security/ResetPasswordBlock";
import MFABlock from "../Settings/Security/MFABlock";
import Theme from "../Settings/Theme";
import Logout from "../Settings/Logout";
import DeleteAccount from "../Settings/DeleteAccount";
import PersonalInfo from "../Settings/Personal-info/PersonalInfo";
// import ChangeSubscriptionPlan from "../Settings/SubscriptionPage/ChangeSubcriptionPlan";
// import UpdatePaymentMethod from "../Settings/SubscriptionPage/UpdatePaymentMethod";

const Profile = () => {
  const { size } = useScreenSize();
  const imageRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const {
    profileData,
    setProfileData,
    fetchUserProfile,
    setError,
    error: ProfileError,
  } = useUser();

  const itemsToFilter = [
    {
      id: 1,
      name: "auto logout",
      Component: <AutoLogoutBlock />,
      metaData: [
        "autologout",
        "logouttime",
        "sessiontimeout",
        "idletimeout",
        "autosignout",
        "inactivelogout",
        "security",
        "userpreferences",
      ],
    },
    {
      id: 2,
      name: "date format",
      Component: <DateFormatBlock />,
      metaData: [
        "dateformat",
        "timeformat",
        "datetime",
        "clockformat",
        "12hour",
        "24hour",
        "locale",
        "regionalsettings",
        "userpreferences",
      ],
    },
    {
      id: 3,
      name: "TWOFA",
      Component: <TwoFABlock />,
      metaData: [
        "twofactorauthentication",
        "2fa",
        "twostepverification",
        "otp",
        "onetimepassword",
        "security",
        "loginsecurity",
        "accountprotection",
      ],
    },
    {
      id: 4,
      name: "Reset Password",
      Component: <ResetPasswordBlock />,
      metaData: [
        "resetpassword",
        "changepassword",
        "forgotpassword",
        "updatepassword",
        "passwordrecovery",
        "security",
        "credentials",
      ],
    },
    {
      id: 5,
      name: "MFA",
      Component: <MFABlock />,
      metaData: [
        "multifactorauthentication",
        "mfa",
        "advancedsecurity",
        "loginverification",
        "authenticatorapp",
        "security",
        "accountsafety",
      ],
    },
    {
      id: 6,
      name: "appearance",
      Component: <Theme />,
      metaData: [
        "theme",
        "appearance",
        "darkmode",
        "lightmode",
        "uitheme",
        "displaysettings",
        "colorscheme",
      ],
    },
    {
      id: 7,
      name: "Logout",
      Component: <Logout />,
      metaData: ["logout", "logout", "signout", "exitaccount", "endsession"],
    },
    {
      id: 8,
      name: "Delete Account",
      Component: <DeleteAccount />,
      metaData: [
        "deleteaccount",
        "removeaccount",
        "closeaccount",
        "accountdeletion",
        "deleteprofile",
        "permanentlydelete",
        "dangerzone",
      ],
    },
    {
      id: 9,
      name: "Personal Info",
      Component: <PersonalInfo />,
      metaData: [
        "personalinfo",
        "profile",
        "userprofile",
        "accountdetails",
        "editprofile",
        "name",
        "email",
        "phone",
        "address",
        "contactinformation",
      ],
    },
  ];

  const filterItem = itemsToFilter.filter((item) => {
    const normalizeQuery = query.toLowerCase().replace(/\s+/g, "").trim();
    return (
      normalizeQuery.toLowerCase() !== "" &&
      (item.name.toLowerCase().includes(normalizeQuery) ||
        item.metaData.some((meta: string) =>
          meta.toLowerCase().includes(normalizeQuery),
        ))
    );
    //using some instead of map cause map returns array while some returns boolean
    //Checks if at least one item matches a condition
    //Returns a boolean
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserProfile();
        //eslint-disable-next-line
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      setError!({ ...ProfileError, ProfileError: null });
    };
  }, []);
  const UploadToCloudinary = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FormData();
    //eslint-disable-next-line
    data.append("file", e.target.files?.[0] as any);
    data.append("upload_preset", "keepNote");
    data.append("cloud_name", "dxxbj1gjf");

    try {
      axios
        .post("https://api.cloudinary.com/v1_1/dxxbj1gjf/image/upload", data)
        .then((res) => {
          setProfileData({
            ...profileData!, // tells to TypeScript: "Trust me, profileData is not null or undefined here." non-null assertion operator.
            profileImage: res.data.url,
          });
          UpdateBackend(res.data.url);
        })
        .catch((err) => {
          Logger("Error uploading image to Cloudinary:", err);
        });
    } catch {
      toast.error("Error uploading image");
    }
  };

  const UpdateBackend = (url: string) => {
    const latestProfile = {
      ...profileData!,
      profileImage: url,
    };
    axiosClient
      .patch("/updateProfile", { profileData: latestProfile })
      .then((res) => setProfileData(res.data))
      .catch((error) => toast.error(error.message));
  };

  return (
    <>
      <div
        className=" 
        flex  items-center justify-center gap-5    flex-col
      md:m-10 md:px-10
        xsm:m-2   
        transition-all duration-300
        "
      >
        <div
          className="flex lg:justify-start
                md:justify-center   "
        >
          <div
            className="md:h-[200px] md:w-[200px] rounded-full  bg-black/10 cursor-pointer z-10 overflow-hidden  
            
            xsm:h-[150px] xsm:w-[150px]
            "
            onClick={() => {
              imageRef.current?.click();
            }}
          >
            <img
              className="w-full h-full object-cover "
              src={profileData?.profileImage || "HN-PAT-ALK-2000X2000-2.jpg"}
              alt="Profile"
            />
          </div>
        </div>

        <div
          className="flex lg:flex-col  justify-center items-center 
          lg:text-center
                xsm:flex-row w-full

                "
        >
          <div className="flex  flex-col gap-2 text-center">
            <div>
              <h2
                className=" font-bold
              text-subheading
                "
              >
                {profileData?.name}
              </h2>
            </div>
            <div>
              <h2
                className=" 
              text-body
              "
              >
                {profileData?.email}
              </h2>
            </div>
          </div>
        </div>

        <div className=""></div>
      </div>

      <div className="flex flex-wrap flex-col gap-4 m-auto p-2  ">
        <LiveSearchInput query={query} setQuery={setQuery} />
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Pills title="Passwords" />
          <Pills title="Delete Account" />
          <Pills title="Theme" />
          <Pills title="Logout" />
        </div>
      </div>

      {query.length >= 1 && (
        <div className="flex flex-col w-full justify-center items-center m-4">
          {query.length >= 1 && filterItem.length === 0 ? (
            <p className="p-2">No results found</p>
          ) : (
            filterItem.map((item) => (
              <div key={item.id} className=" w-full m-2">
                <p className="text-caption text-gray-400">{item.Component}</p>
              </div>
            ))
          )}
        </div>
      )}
      {size < 1000 && query.length < 1 && (
        <div className="flex justify-center items-center mt-4">
          <ProfileLowerSidebar />
        </div>
      )}
      <input
        ref={imageRef}
        className="hidden"
        accept="image/*"
        type="file"
        onChange={UploadToCloudinary}
      />
    </>
  );
};
export default Profile;

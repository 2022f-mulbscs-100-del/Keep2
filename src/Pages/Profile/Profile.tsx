import { useEffect, useRef } from "react";
import axiosClient from "../../api/axiosClient";
// import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { useUser } from "../../Context/UserContext";
import Input from "../../component/InputFields/Input";
import Pills from "../../component/Pills/Pill";
import ProfileLowerSidebar from "./ProfileLowerSIdebar";
import { useScreenSize } from "../../component/CustomHooks/useScreenSize";
import { toast } from "react-toastify";

const Profile = () => {
  const { size } = useScreenSize();
  const imageRef = useRef<HTMLInputElement>(null);
  //   const { userData } = useAuth();

  const {
    profileData,
    setProfileData,
    fetchUserProfile,
    setError,
    error: ProfileError,
  } = useUser();
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setProfileData({
  //         ...profileData!,
  //         [name]: value,
  //     });
  // };

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
        .catch((err) => console.error(err));
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
              src={profileData?.profileImage}
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
                className="md:text-4xl font-bold
              xms:text-[22px]
              "
              >
                {profileData?.name}
              </h2>
            </div>
            <div>
              <h2
                className=" 
              xsm:text-[14px]
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
        <Input />
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Pills title="Passwords" />
          <Pills title="Delete Account" />
          <Pills title="Theme" />
          <Pills title="Logout" />
        </div>
      </div>

      {size < 1000 && (
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

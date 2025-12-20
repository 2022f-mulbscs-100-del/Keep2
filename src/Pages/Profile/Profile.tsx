import { useRef } from "react";
import axiosClient from "../../api/axiosClient";
// import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { useUser } from "../../Context/UserContext";
import Input from "../../component/InputFields/Input";
import Pills from "../../component/Pills/Pill";

const Profile = () => {
  const imageRef = useRef<HTMLInputElement>(null);
  //   const { userData } = useAuth();

  const { profileData, setProfileData } = useUser();
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setProfileData({
  //         ...profileData!,
  //         [name]: value,
  //     });
  // };

  const UploadToCloudinary = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files?.[0]);
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
          console.log(res.data.url);
        })
        .catch((err) => console.error(err));
      UpdateBackend();
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateBackend = () => {
    console.log(profileData);
    axiosClient
      .post("/updateProfile", { profileData })
      .then((res) => setProfileData(res.data))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div
        className=" m-10 px-10
        flex flex-col items-center justify-center gap-5
            "
      >
        <div
          className="flex lg:justify-start
                md:justify-center
                "
        >
          <div
            className="h-[200px] w-[200px] rounded-full  bg-black/10 cursor-pointer z-10 overflow-hidden  "
            onClick={() => imageRef.current?.click()}
          >
            <img
              className="w-full h-full object-cover "
              src={profileData?.profileImage}
              alt="Profile"
            />
          </div>
        </div>

        <div
          className="flex lg:flex-col
                xsm:flex-row w-full
                "
        >
          <div className="flex items-center flex-col gap-2">
            <div>
              <h2 className="text-4xl font-bold">{profileData?.name}</h2>
            </div>
            <div>
              <h2 className=" ">{profileData?.email}</h2>
            </div>
          </div>
        </div>

        <div className=""></div>
      </div>
      <div className="flex flex-col gap-4 max-w-[600px] m-auto ">
        <Input />
        <div className="flex justify-center items-center gap-4">
          <Pills title="Passwords" />
          <Pills title="Delete Account" />
          <Pills title="Theme" />
          <Pills title="Logout" />
        </div>
      </div>

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

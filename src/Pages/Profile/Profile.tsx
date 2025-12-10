import { useEffect, useRef, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";

type ProfileDataType = {
  name: string;
  email: string;
  profileImage: string;
  phone: number | null;
};

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileDataType | null>({
    name: "",
    email: "",
    profileImage: "",
    phone: null,
  });

  const imageRef = useRef<HTMLInputElement>(null);
  const { userData } = useAuth();
  useEffect(() => {
    const fetchUserProfile = () => {
      axiosClient
        .get(`userProfile/${userData?.id}`)
        .then((res) => setProfileData(res.data))
        .catch((error) => console.log(error));
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData!,
      [name]: value,
    });
  };

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
        })
        .catch((err) => console.error(err));
      UpdateBackend();
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateBackend = () => {
    axiosClient
      .post("/updateProfile", { profileData })
      .then((res) => setProfileData(res.data))
      .catch((error) => console.log(error));
  };
  return (
    <>
      <div
        className=" pt-10
            grid lg:grid-cols-2 gap-4
            md:grid-cols-1
            "
      >
        <div
          className="flex lg:justify-end
                md:justify-center
                "
        >
          <div
            className="h-[250px] rounded-[15px] max-w-[400px] min-w-[400px] bg-black/10 cursor-pointer z-10  "
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
          className="flex lg:flex-col lg:justify-center
                xsm:flex-row xsm:justify-center
                "
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4   lg:max-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] ">
              <input
                className="outline-none w-full"
                type="text"
                placeholder="Name"
                name="name"
                value={profileData?.name}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-4 max-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] ">
              <input
                className="outline-none w-full"
                type="email"
                placeholder="Email"
                name="email"
                value={profileData?.email}
                disabled={true}
              />
            </div>
            <div className="flex items-center gap-4 max-w-[400px]  px-4  py-2 rounded-[8px] bg-transparent border border-[#525355] ">
              <input
                className="outline-none w-full"
                type="text"
                placeholder="Phone"
                name="phone"
                value={profileData?.phone ?? ""}
              />
            </div>
            <div className="hover:bg-[#52535596] flex items-center gap-4 max-w-[400px] justify-center cursor-pointer  p-2 mt-4 rounded-lg">
              <button
                onClick={UpdateBackend}
                className="cursor-pointer"
                type="submit"
              >
                Save Changes
              </button>
            </div>
          </div>
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

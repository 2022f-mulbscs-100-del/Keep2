import { useAuth } from "../../Context/AuthContext";

type GoogleLoginButtonProps = {
  title: string;
  url: string;
  provider: string;
  icon: React.ReactNode;
};

interface GoogleAuthMessage {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    [key: string]: unknown;
  };
}
const SocialLoginButton = ({
  title,
  url,
  provider,
  icon,
}: GoogleLoginButtonProps) => {
  const { setUserData } = useAuth();

  const openPopup = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      url,
      provider,
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    const handleMessage = (event: MessageEvent<GoogleAuthMessage>) => {
      if (event.origin !== "http://localhost:2404") return;

      const { token, user } = event.data;

      localStorage.setItem("refreshToken", token);

      if (setUserData)
        setUserData({
          id: Number(user.id),
          name: user.name,
          email: user.email,
          profileImage: (user.picture as string) || null,
        });

      window.location.href = "/";

      popup?.close();

      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <button
      type="button"
      className="w-full hover:bg-secondary cursor-pointer flex justify-center items-center gap-4 p-2 mt-4 rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
      onClick={openPopup}
    >
      {icon}

      {title}
    </button>
  );
};

export default SocialLoginButton;

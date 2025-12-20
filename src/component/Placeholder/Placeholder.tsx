const Placeholder = ({
  width = "100%",
  height = "20px",
  borderRadius = "4px",
  className = "",
}) => {
  return (
    <>
      <div
        className={`skeleton ${className}`}
        style={{
          width,
          height,
          borderRadius,
        }}
      />
      <style>{`
        .skeleton {
          background: linear-gradient(
            90deg,
            #2a2a2a 0%,
            #3a3a3a 20%,
            #2a2a2a 40%,
            #2a2a2a 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </>
  );
};

export default Placeholder;

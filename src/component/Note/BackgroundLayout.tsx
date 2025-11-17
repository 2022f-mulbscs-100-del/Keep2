import Home from "../../Pages/Home/Home"


function BackgroundLayout({children}: {children: React.ReactNode}) {
  return (
  <>
  <Home/>
  {children}
  </>
  )
}

export default BackgroundLayout;
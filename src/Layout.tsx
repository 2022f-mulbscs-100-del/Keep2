
import Navbar from './component/Navbar/Navbar'
import Sidebar from './component/sidebar/Sidebar'


function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>

      <div className='flex flex-col'>
        <div>

          <Navbar />
        </div>
        <div className='flex '>
          <div>

            <Sidebar />
          </div>
          <div className='flex-1 '>

            {children}
          </div>
        </div>
      </div>
    </>

  )
}

export default Layout
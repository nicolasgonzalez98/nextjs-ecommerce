import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "@/components/Nav"
import { useState } from "react"
import Logo from "./Logo"

export default function Layout({children}) {
  const [showNav, setShowNav] = useState(false)
  const { data: session } = useSession()

  if(!session){
    return (
      <div className="bg-bgGray w-screen h-screen flex items-center ">
        <div className="text-center w-full">
          
          <button className="bg-white p-2 px-4 rounded-md" onClick={() => signIn('google')}>Login with Google</button>
        </div>
      </div>  
    )
  }
  else{
    return (
      <div className="bg-bgGray min-h-screen ">
        <div className="block flex md:hidden items-center p-4">
            <button onClick={() => setShowNav(!showNav ? true : false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
              </svg>

            </button>
            <div className="flex grow justify-center mr-6">
              <Logo />
            </div>
            
        </div>
        <div className="flex">
          <Nav show={showNav}/>

          <div className="bg-white flex-grow mt-2 mr-2 rounded-lg p-4 mb-2">{children}</div>
        
        </div>
      </div>
    )
  }
}
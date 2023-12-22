import Layout from "@/components/Layout"
import { useSession } from "next-auth/react"


export default function Home() {
  const {data: session} = useSession()
  
  return <Layout>
          <div className="text-blue-900 flex justify-between">
              <h2>
                Hello, <b>{session?.user?.name}</b>
              </h2>

              <div className="bg-gray-300 text-black flex gap-1 rounded-lg overflow-hidden">
                <img src={session?.user?.image} alt="usuario" className="w-6 h-6"/>
                <b><span className="px-2">{session?.user?.name}</span></b>
              </div>
          </div>
        </Layout>
}

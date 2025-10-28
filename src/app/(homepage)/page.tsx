import Wrapper from "@/components/wrapper"
import Homepage from "./components"
import { headers } from "next/headers";
import { getSubdomain } from "@/lib/helpers/getSubdomain";
import BlogList from "../(blog)";

const Home = async () => {
  const host = (await headers()).get('host') || '';
  const subdomain = getSubdomain(host);
  return (
    <Wrapper className="min-h-[100vh]">
      {subdomain === 'blog' ? <BlogList /> : <Homepage />}
    </Wrapper>
  )
}
export default Home
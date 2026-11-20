import Wrapper from "@/components/wrapper"
import Footer from "@/components/footer";
import Homepage from "./components"
import { headers } from "next/headers";
import { getSubdomain } from "@/lib/helpers/getSubdomain";
import BlogList from "../(blog)";
import EventsPage, { getEventsMetadata } from "../(events)";

type Props = { searchParams: Promise<{ event?: string }> }

const getCurrentSubdomain = async () => getSubdomain((await headers()).get('host') || '')

export const generateMetadata = async ({ searchParams }: Props) =>
  (await getCurrentSubdomain()) === 'events'
    ? getEventsMetadata((await searchParams).event)
    : {}

const Home = async ({ searchParams }: Props) => {
  const subdomain = await getCurrentSubdomain();
  const isSection = subdomain === 'blog' || subdomain === 'events'
  return (
    <>
      <Wrapper>
        {subdomain === 'blog' && <BlogList />}
        {subdomain === 'events' && <EventsPage eventSlug={(await searchParams).event} />}
        {!isSection && <Homepage />}
      </Wrapper>
      {isSection && <Footer />}
    </>
  )
}
export default Home

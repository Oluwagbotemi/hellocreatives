import Wrapper from "@/components/wrapper"
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
  return (
    <Wrapper>
      {subdomain === 'blog' && <BlogList />}
      {subdomain === 'events' && <EventsPage eventSlug={(await searchParams).event} />}
      {subdomain !== 'blog' && subdomain !== 'events' && <Homepage />}
    </Wrapper>
  )
}
export default Home

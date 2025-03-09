import { SearchParams } from "next/dist/server/request/search-params"
import AutosigninClient from "./autosigninclient"

export default async function AutosigninPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { email } = await searchParams
  return <AutosigninClient emailParams={email} />
}

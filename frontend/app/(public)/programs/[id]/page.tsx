import { notFound } from "next/navigation"

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const data = await fetch(`${process.env.API_URL}/api/programs/${id}`)
  if (!data.ok) notFound()

  const program = await data.json()

  return (
    <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
      <dl className="-my-3 divide-y divide-gray-100 text-sm">
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Title</dt>
          <dd className="text-gray-700 sm:col-span-2">{program.data.title}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Price</dt>
          <dd className="text-gray-700 sm:col-span-2">{program.data.price}</dd>
        </div>

        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium text-gray-900">Description</dt>
          <dd className="text-gray-700 sm:col-span-2">
            {program.data.content}
          </dd>
        </div>
      </dl>
    </div>
  )
}

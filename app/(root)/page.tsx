import AllFiles from '@/components/Allfiles'
import { getTotalSpaceUsed } from '@/lib/actions/file.actions'
import { convertFileSize } from '@/lib/utils'

const Page = async () => {
  const totalSpace = await getTotalSpaceUsed();

  return (
    <div className="min-h-screen bg-bg-grey text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-semibold capitalize tracking-wide">All Files</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-0">
          </div>
        </div>

        {/* Table */}
        <div className="bg-bg-grey rounded-lg overflow-hidden">
          <AllFiles />
        </div>
      </div>
    </div>
  )
}

export default Page
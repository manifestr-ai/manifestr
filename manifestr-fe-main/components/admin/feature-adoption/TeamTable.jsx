import DataTableWithSearch from './DataTableWithSearch'

const DEFAULT_ROWS = [
  { member: 'J. Smith', role: 'Admin', docsCreated: 12, exports: 63, lastActive: '15/03/2024' },
  { member: 'L. Wong', role: 'Editor', docsCreated: 41, exports: 423, lastActive: '15/03/2024' },
  { member: 'A. Khan', role: 'Viewer', docsCreated: 52, exports: 142, lastActive: '15/03/2024' },
  { member: 'J. Smith', role: 'Editor', docsCreated: 13, exports: 15, lastActive: '15/03/2024' },
  { member: 'L. Wong', role: 'Editor', docsCreated: 4, exports: 73, lastActive: '15/03/2024' },
]

const COLUMNS = [
  { key: 'member', label: 'Member', flex: true, emphasis: true },
  { key: 'role', label: 'Role', width: 'w-[140px]' },
  { key: 'docsCreated', label: 'Docs Created', width: 'w-[140px]' },
  { key: 'exports', label: 'Exports', width: 'w-[120px]' },
  { key: 'lastActive', label: 'Last Active', width: 'w-[140px]' },
]

export default function TeamTable({ data }) {
  const title = data?.title || 'Team'
  const rows = data?.rows || DEFAULT_ROWS
  const searchPlaceholder = data?.searchPlaceholder || 'Search accounts...'

  return (
    <DataTableWithSearch
      title={title}
      columns={COLUMNS}
      rows={rows}
      searchPlaceholder={searchPlaceholder}
      flexBasis="w-full"
    />
  )
}

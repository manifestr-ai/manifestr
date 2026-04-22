import DataTableWithSearch from './DataTableWithSearch'

const DEFAULT_ROWS = [
  { project: 'Pitch Deck v3', members: 8, docs: 12, exports: 63, lastActive: '15/03/2024' },
  { project: 'BrightLabs', members: 9, docs: 41, exports: 423, lastActive: '15/03/2024' },
  { project: 'Nova Health', members: 3, docs: 52, exports: 142, lastActive: '15/03/2024' },
  { project: 'Pitch Deck v3', members: 45, docs: 13, exports: 15, lastActive: '15/03/2024' },
  { project: 'Orion Tech', members: 13, docs: 4, exports: 73, lastActive: '15/03/2024' },
]

const COLUMNS = [
  { key: 'project', label: 'Project', flex: true, emphasis: true },
  { key: 'members', label: 'Members', width: 'w-[120px]' },
  { key: 'docs', label: 'Docs', width: 'w-[100px]' },
  { key: 'exports', label: 'Exports', width: 'w-[120px]' },
  { key: 'lastActive', label: 'Last Active', width: 'w-[140px]' },
]

export default function TopCollaborativeProjects({ data }) {
  const title = data?.title || 'Top Collaborative Projects'
  const rows = data?.rows || DEFAULT_ROWS
  const searchPlaceholder = data?.searchPlaceholder || 'Search accounts...'

  return (
    <DataTableWithSearch
      title={title}
      columns={COLUMNS}
      rows={rows}
      searchPlaceholder={searchPlaceholder}
      flexBasis="flex-1"
    />
  )
}

export const VAULT_FOLDER_DESCRIPTION = 'Your secure workspace for every project, deck & document.'

export const VAULT_FOLDERS = [
  {
    id: 'marketing-materials',
    name: 'Marketing Materials',
    headerTitle: 'MARKETING materials',
  },
  {
    id: 'finance-reports',
    name: 'Finance Reports',
    headerTitle: 'FINANCE reports',
  },
  {
    id: 'presentations',
    name: 'Presentations',
    headerTitle: 'PRESENTATIONS',
  },
  {
    id: 'client-assets',
    name: 'Client Assets',
    headerTitle: 'CLIENT assets',
  },
]

export const getVaultFolderHref = (folderId) => `/vault/collabs/${folderId}`

export const getVaultFolderById = (folderId) =>
  VAULT_FOLDERS.find((f) => f.id === folderId) || null

export const getVaultFolderDocuments = (folderId) => {
  const folder = getVaultFolderById(folderId)
  const folderName = folder?.name || 'Folder'

  return [
    {
      id: `${folderId}-1`,
      title: `${folderName} Doc 1`,
      project: 'Project: Brand Refresh',
      status: 'In Progress',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=430&h=246&fit=crop',
      collaborators: [
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=2' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=3' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=4' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      rawData: { id: `${folderId}-1`, type: 'document' },
      isDummy: true,
    },
    {
      id: `${folderId}-2`,
      title: `${folderName} Doc 2`,
      project: 'Project: Brand Refresh',
      status: 'In Review',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=430&h=246&fit=crop',
      collaborators: [
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=6' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=7' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=8' },
        { name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=9' },
        { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=10' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      rawData: { id: `${folderId}-2`, type: 'document' },
      isDummy: true,
    },
    {
      id: `${folderId}-3`,
      title: `${folderName} Doc 3`,
      project: 'Project: Brand Refresh',
      status: 'Final',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=430&h=246&fit=crop',
      collaborators: [
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=11' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=12' },
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=13' },
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=14' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: false,
      rawData: { id: `${folderId}-3`, type: 'document' },
      isDummy: true,
    },
    {
      id: `${folderId}-4`,
      title: `${folderName} Doc 4`,
      project: 'Project: Brand Refresh',
      status: 'Draft',
      thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=430&h=246&fit=crop',
      collaborators: [
        { name: 'Tom', avatar: 'https://i.pravatar.cc/150?img=15' },
        { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=16' },
        { name: 'Leah', avatar: 'https://i.pravatar.cc/150?img=17' },
        { name: 'Jess', avatar: 'https://i.pravatar.cc/150?img=18' },
      ],
      lastEdited: '2 hours ago',
      type: 'document',
      isShared: true,
      rawData: { id: `${folderId}-4`, type: 'document' },
      isDummy: true,
    },
  ]
}


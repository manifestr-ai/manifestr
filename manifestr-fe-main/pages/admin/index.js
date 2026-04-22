export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/admin/overview',
      permanent: false,
    },
  }
}

export default function AdminIndexRedirect() {
  return null
}

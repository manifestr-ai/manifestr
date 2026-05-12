export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/playbook/knowledge-base/getting-started',
      permanent: false,
    },
  }
}

export default function LegacyGettingStartedRedirect() {
  return null
}

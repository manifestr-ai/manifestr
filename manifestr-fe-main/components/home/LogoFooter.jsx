import Image from 'next/image'

export default function LogoFooter({ backgroundColor = '#ffffff', gray = false }) {
  return (
    <footer className="w-full" style={{ backgroundColor }}>
      <div className="w-full flex items-center justify-center py-8">
        <Image
          src={gray ? "/assets/banners/logo-footer-gray.svg" : "/assets/banners/logo-footer.svg"}
          alt="Manifestr Logo"
          width={1200}
          height={200}
          quality={100}
          className="w-full h-auto"
          priority
        />
      </div>
    </footer>
  )
}


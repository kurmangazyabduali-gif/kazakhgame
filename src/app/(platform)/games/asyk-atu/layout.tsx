export default function AsykAtuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full h-full flex flex-col m-0 p-0 overflow-hidden absolute inset-0 z-50 bg-background">
      {/* 
        This layout overrides the main padding to allow the canvas to be full screen.
        z-50 puts it over the main Navbar if we want a fully immersive mode, 
        or we can just let it sit inside the main layout.
        For this MVP, we want it to cover everything below the navbar, 
        but we don't want the platform padding to apply.
      */}
      {children}
    </div>
  )
}

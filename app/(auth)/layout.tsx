import type React from "react"
import MainNav from "@/components/main-nav"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MainNav />
      <main>{children}</main>
    </>
  )
}


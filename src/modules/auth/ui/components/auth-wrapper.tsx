import { ShaderAnimation } from "@/components/shader-lines"

type AuthWrapperProps = React.PropsWithChildren<{
  title: string
  welcomeText: string
}>

export function AuthWrapper({ children, title, welcomeText }: AuthWrapperProps) {
  return (
    <section className="flex min-h-screen flex-col overflow-hidden bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="flex flex-1 flex-col">
        <div className="w-full">
          <div className="relative mx-auto max-w-7xl border-x border-b border-border before:absolute before:right-full before:-bottom-px before:h-px before:w-screen before:bg-border after:absolute after:-bottom-px after:left-full after:h-px after:w-screen after:bg-border">
            <div className="flex flex-col gap-4 px-8 py-16">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                <p className="text-base font-normal text-muted-foreground">{welcomeText}</p>
              </div>
              <h1 className="text-5xl font-semibold text-foreground md:text-6xl lg:text-7xl">
                {title}
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="relative mx-auto max-w-7xl border-x border-b border-border before:absolute before:right-full before:-bottom-px before:h-px before:w-screen before:bg-border after:absolute after:-bottom-px after:left-full after:h-px after:w-screen after:bg-border">
            <div className="relative grid grid-cols-1 overflow-hidden md:grid-cols-12">
              <div className="relative hidden overflow-hidden md:col-span-7 md:block">
                <ShaderAnimation />
              </div>
              <div className="flex flex-col justify-center px-8 py-10 md:col-span-5">
                {children}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-7xl flex-1 border-x border-border py-16" />
      </div>
    </section>
  )
}

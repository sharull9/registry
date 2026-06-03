import { NuqsAdapter } from 'nuqs/adapters/next/app'
import React from 'react'

export function NuqsProvider({ children }: React.PropsWithChildren) {
	return <NuqsAdapter>{children}</NuqsAdapter>
}

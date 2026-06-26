"use client"

import { ComponentPreview } from "@/components/docs/component-preview"
import {
  Form,
  FormControl,
  FormDescription,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useForm } from "react-hook-form"
import z from "zod"

const schema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof schema>

const code = `import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import z from "zod"
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormDescription, FormErrorMessage,
} from "@/components/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function LoginForm() {
  const form = useForm({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email.</FormDescription>
              <FormErrorMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </Form>
  )
}`

function LoginForm() {
  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="w-full max-w-sm space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>We&apos;ll never share your email.</FormDescription>
              <FormErrorMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </Form>
  )
}

export default function FormPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Form</h1>
        <p className="mt-1 text-muted-foreground">
          React Hook Form wrapper with accessible labels, descriptions, and inline error messages.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Login form</h2>
        <ComponentPreview code={code}>
          <LoginForm />
        </ComponentPreview>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Exports</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pr-4 pb-2 font-medium">Export</th>
              <th className="pb-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["Form", "FormProvider wrapper — pass spread of useForm() return value"],
              ["FormField", "Controller wrapper — provides field context to children"],
              ["FormItem", "Container div that generates a unique id for aria wiring"],
              ["FormLabel", "Label with optional required asterisk and error color"],
              ["FormControl", "Slot that wires aria-describedby and aria-invalid to the input"],
              ["FormDescription", "Muted helper text linked via aria-describedby"],
              ["FormErrorMessage", "Shows the field error message from react-hook-form"],
              ["useFormField", "Hook that returns id, name, and field state from context"],
            ].map(([name, desc]) => (
              <tr key={name} className="border-b last:border-0">
                <td className="py-2 pr-4 font-mono text-foreground">{name}</td>
                <td className="py-2">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

"use client"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useControllableState } from "@radix-ui/react-use-controllable-state"
import { EyeIcon, EyeOffIcon } from "lucide-react"

type InputGroupInputProps = React.ComponentProps<typeof InputGroupInput> & {
  visibilityState?: InputGroupInputProps["type"]
  onVisibilityChange?: (state: InputGroupInputProps["type"]) => void
  visibleIcon?: React.ReactNode
  hiddenIcon?: React.ReactNode
}

export function PasswordInput({
  type: typeProp = "password",
  visibilityState,
  onVisibilityChange,
  visibleIcon = <EyeIcon />,
  hiddenIcon = <EyeOffIcon />,
  ...props
}: InputGroupInputProps) {
  const [type, setType] = useControllableState<InputGroupInputProps["type"]>({
    defaultProp: typeProp,
    prop: visibilityState,
    onChange: onVisibilityChange,
  })

  return (
    <InputGroup className="h-10!">
      <InputGroupInput
        placeholder="********"
        {...props}
        className="h-full! rounded-full bg-white"
        type={type}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={() => setType(type === "password" ? "text" : "password")}>
          {type === "password" ? visibleIcon : hiddenIcon}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

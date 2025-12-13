import type { RootState } from "@/store";
import { Center, type CenterProps } from "@chakra-ui/react";
import { useSelector } from "react-redux";

type Props = CenterProps & {
  children: React.ReactNode;
  pageScope: number;
};

export default function Page({ children, pageScope, ...props }: Props) {
  const scope = useSelector((state: RootState) => state.scope.value),
    direction = { in: "left", out: "right" };

  return (
    <Center
      columnGap={15}
      userSelect={"none"}
      position={"absolute"}
      top={0}
      left={0}
      bottom={0}
      right={0}
      {...props}
      data-state={scope === pageScope ? "open" : "closed"}
      zIndex={scope === pageScope ? 5 : 1}
      _open={{
        animationName: `slide-in-${direction.in}`,
        animationDuration: `400ms`,
      }}
      _closed={{
        animationName: `slide-out-${direction.out}`,
        animationFillMode: "forwards",
        animationDuration: `400ms`,
      }}
    >
      {children}
    </Center>
  );
}

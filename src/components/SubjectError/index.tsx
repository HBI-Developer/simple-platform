import { Center, Flex, type CenterProps } from "@chakra-ui/react";

type Props = CenterProps & {
  code: number;
};

export default function SubjectError({ code, ...props }: Props) {
  return (
    <Center
      backgroundColor={"#313131"}
      height={"100%"}
      userSelect={"none"}
      paddingInline={"5%"}
      {...props}
    >
      <Flex direction={"column"}>{code}</Flex>
    </Center>
  );
}

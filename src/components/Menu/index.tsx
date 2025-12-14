import { Box, Carousel } from "@chakra-ui/react";
import type { JSX } from "react";

interface Props<T> {
  items: Array<T>;
  item: (item: { item: T }) => JSX.Element;
  height?: string | number;
  slidesPerPage?: number;
}

export default function Menu<T extends object>({
  items,
  item: Item,
  height,
  slidesPerPage = 4,
}: Props<T>) {
  return (
    <Carousel.Root
      orientation="vertical"
      slideCount={items.length}
      slidesPerPage={slidesPerPage}
      mx="auto"
      direction="rtl"
      marginTop={"1rem"}
      paddingInlineStart={"1.5rem"}
      justifyContent={"flex-start"}
      allowMouseDrag
      h={height ?? "100%"}
      paddingBottom={10}
    >
      <Carousel.ItemGroup w={"100%"}>
        {items.map((item, index) => (
          <Carousel.Item
            key={index}
            index={index}
            boxSize={"100%"}
            direction={"rtl"}
          >
            <Box boxSize={"100%"} rounded="lg">
              <Item item={item} />
            </Box>
          </Carousel.Item>
        ))}
      </Carousel.ItemGroup>
    </Carousel.Root>
  );
}

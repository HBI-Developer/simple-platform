import useImagesTracker from "@/hooks/useImagesTracker";
import { setSubjectLoading } from "@/store/slice/subject";
import {
  Carousel as ChakraCarousel,
  Flex,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import SubjectError from "../SubjectError";
import type { RootState } from "@/store";
import useScreenState from "@/hooks/useScreenState";

interface Props {
  resource: Array<string>;
}

export default function Carousel({ resource }: Props) {
  const { tracker, isLoaded, failures } = useImagesTracker(),
    color = useSelector((state: RootState) => state.color),
    dispatch = useDispatch(),
    { isVertical } = useScreenState();

  useEffect(() => {
    if (isLoaded) dispatch(setSubjectLoading(false));
  }, [isLoaded]);

  return (
    <>
      {isVertical ? (
        <Flex direction={"column"} gap={4} overflowY={"auto"}>
          {resource.map((image, index) => {
            const failure = failures.find((fail) => fail.url === image);

            return !failure ? (
              <Image
                src={image}
                w="100%"
                key={index}
                backgroundColor={"#000"}
                aspectRatio={16 / 9}
                h={"auto"}
                objectFit={"contain"}
              />
            ) : (
              <SubjectError
                code={failure.code}
                w={"100%"}
                key={index}
                aspectRatio={16 / 9}
                h={"auto"}
              />
            );
          })}
        </Flex>
      ) : (
        <ChakraCarousel.Root
          loop={true}
          ref={tracker}
          slideCount={resource.length}
          maxW={{ base: "md", lg: "xl" }}
          mx="auto"
          width={{ base: "90%", sm: "75%", md: "65%", lg: "50%" }}
          display="grid"
          gridTemplateRows={"1fr auto"}
          aspectRatio={16 / 9}
          allowMouseDrag
        >
          <ChakraCarousel.ItemGroup>
            {resource.map((image, index) => {
              const failure = failures.find((fail) => fail.url === image);

              return (
                <ChakraCarousel.Item
                  key={index}
                  index={index}
                  position={"relative"}
                >
                  {!failure ? (
                    <Image
                      src={image}
                      position={"absolute"}
                      top={0}
                      left={0}
                      boxSize="100%"
                      backgroundColor={"#000"}
                      objectFit={"contain"}
                    />
                  ) : (
                    <SubjectError
                      code={failure.code}
                      position={"absolute"}
                      top={0}
                      left={0}
                      boxSize="100%"
                    />
                  )}
                </ChakraCarousel.Item>
              );
            })}
          </ChakraCarousel.ItemGroup>

          <ChakraCarousel.Control justifyContent="center" gap="4">
            <ChakraCarousel.PrevTrigger asChild>
              <IconButton size="xs" variant="ghost" colorPalette={color.value}>
                <LuChevronLeft />
              </IconButton>
            </ChakraCarousel.PrevTrigger>

            <ChakraCarousel.Indicators colorPalette={color.value} />

            <ChakraCarousel.NextTrigger asChild>
              <IconButton size="xs" variant="ghost" colorPalette={color.value}>
                <LuChevronRight />
              </IconButton>
            </ChakraCarousel.NextTrigger>
          </ChakraCarousel.Control>
        </ChakraCarousel.Root>
      )}
    </>
  );
}

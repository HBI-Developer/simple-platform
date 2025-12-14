import {
  Box,
  Center,
  CloseButton,
  createOverlay,
  Dialog,
  Portal,
  Presence,
  Spinner,
} from "@chakra-ui/react";
import AudioPlayer from "../AudioPlayer";
import VideoPlayer from "../VideoPlayer";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useEffect } from "react";
import { setSubjectLoading } from "@/store/slice/subject";
import Carousel from "../Carousel";
import SubjectHeader from "../SubjectHeader";
import useScreenState from "@/hooks/useScreenState";

interface Props {
  title: string;
  type: "pdf" | "image" | "audio" | "video";
  resource: string | Array<string>;
  description?: string;
}

const Subject = createOverlay<Props>(
  ({ title, type, resource, description, ...rest }) => {
    const color = useSelector((state: RootState) => state.color),
      subject = useSelector((state: RootState) => state.subject),
      dispatch = useDispatch(),
      { isMobile, isVertical } = useScreenState(),
      onLoad = () => dispatch(setSubjectLoading(false)),
      createSubject = () => {
        switch (type) {
          case "image": {
            if (!Array.isArray(resource)) return "";
            return <Carousel resource={resource} />;
          }
          case "pdf": {
            if (typeof resource !== "string") return;
            return (
              <Box width={"100%"} marginInline={"auto"} height={"auto"}>
                <iframe
                  src={resource}
                  width={"100%"}
                  height={"100%"}
                  onLoad={onLoad}
                  onLoadedData={onLoad}
                  onError={onLoad}
                ></iframe>
              </Box>
            );
          }
          case "audio": {
            if (typeof resource !== "string") return;
            return (
              <Box>
                <AudioPlayer src={resource} />
              </Box>
            );
          }
          case "video": {
            if (typeof resource !== "string") return;
            return (
              <Box>
                <VideoPlayer src={resource} />
              </Box>
            );
          }
        }
      };

    useEffect(() => {
      dispatch(setSubjectLoading(true));
    }, []);

    return (
      <Dialog.Root {...rest} size={isMobile ? "full" : "cover"}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner
            overflow={isVertical && type === "image" ? "hidden" : "auto"}
          >
            <Dialog.Content direction="rtl" height={"100%"}>
              {title && (
                <Dialog.Header
                  justifyContent={"center"}
                  position={"relative"}
                  paddingInline={"15%"}
                >
                  <Dialog.Title
                    textAlign={"center"}
                    fontSize={{ base: "md", md: "lg", lg: "xl" }}
                  >
                    {title}
                  </Dialog.Title>
                  <Presence
                    animationName={{ _closed: "fade-out" }}
                    animationDuration="moderate"
                    present={!subject.loading}
                  >
                    <SubjectHeader title={title} resource={resource} />
                  </Presence>
                  <Dialog.CloseTrigger
                    top="50%"
                    transform="translateY(-50%)"
                    left="2.5%"
                    right="unset"
                    asChild
                  >
                    <CloseButton
                      variant={"subtle"}
                      size={{ base: "sm", md: "md" }}
                    />
                  </Dialog.CloseTrigger>
                </Dialog.Header>
              )}
              <Dialog.Body
                spaceY="4"
                position={"relative"}
                display={"grid"}
                gridTemplateRows={"auto 1fr"}
                height={"100%"}
                overflow={
                  (isVertical && type === "image") || subject.loading
                    ? "hidden"
                    : "auto"
                }
              >
                {description && (
                  <Dialog.Description textAlign={"center"} direction={"rtl"}>
                    {description}
                  </Dialog.Description>
                )}
                {createSubject()}
                <Presence
                  position={"absolute"}
                  top={"-3%"}
                  left={0}
                  width="100%"
                  height="100%"
                  animationName={{ _closed: "fade-out" }}
                  animationDuration="moderate"
                  backgroundColor="{colors.bg.panel}"
                  present={subject.loading}
                  zIndex={9999}
                  unmountOnExit
                >
                  <Center height={"100%"}>
                    <Spinner size="lg" borderWidth="3px" color={color.value} />
                  </Center>
                </Presence>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    );
  }
);

export default Subject;

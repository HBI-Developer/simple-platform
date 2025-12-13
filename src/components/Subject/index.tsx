import {
  Box,
  Center,
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
              <Box
                width={{ base: "90%", md: "75%", lg: "50%" }}
                marginInline={"auto"}
                height={"90%"}
              >
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
            return <AudioPlayer src={resource} />;
          }
          case "video": {
            if (typeof resource !== "string") return;
            return <VideoPlayer src={resource} />;
          }
        }
      };

    useEffect(() => {
      dispatch(setSubjectLoading(true));
    }, []);

    return (
      <Dialog.Root {...rest} size="cover">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content direction="rtl">
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
                </Dialog.Header>
              )}
              <Dialog.Body spaceY="4" position={"relative"}>
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

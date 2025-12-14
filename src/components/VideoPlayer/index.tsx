import { AspectRatio } from "@chakra-ui/react";
import isPlatform from "./functions/isPlatform";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { setSubjectLoading } from "@/store/slice/subject";
import type { RootState } from "@/store";
import Video from "../Video";

interface Props {
  src: string;
}

export default function VideoPlayer({ src }: Props) {
  const dispatch = useDispatch(),
    loaded = useSelector((state: RootState) => state.subject.loading),
    onFinished = () => {
      if (loaded) dispatch(setSubjectLoading(false));
    };

  return (
    <AspectRatio
      ratio={16 / 9}
      overflow={"hidden"}
      borderRadius={".5rem"}
      width={{ base: "100%", sm: "75%", md: "65%", lg: "50%" }}
      marginInline={"auto"}
    >
      {isPlatform(src) ? (
        <ReactPlayer
          src={src}
          width={"100%"}
          onLoad={onFinished}
          onLoadCapture={onFinished}
          onLoadedData={onFinished}
          onLoadedMetadata={onFinished}
          onError={onFinished}
          height={"100%"}
        />
      ) : (
        <Video src={src} />
      )}
    </AspectRatio>
  );
}

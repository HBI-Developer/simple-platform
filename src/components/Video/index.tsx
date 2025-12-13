import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, Flex, Text, IconButton, Spinner, Slider } from "@chakra-ui/react";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { MdPictureInPictureAlt, MdForward10, MdReplay10 } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setSubjectLoading } from "@/store/slice/subject";

// تعريف أنواع الخصائص
interface VideoPlayerProps {
  src: string;
}

// تعريف أنواع الأخطاء
interface VideoErrorState {
  code: number;
  message: string;
}

export default function Video({ src }: VideoPlayerProps) {
  const dispatch = useDispatch();
  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);

  // --- States ---
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<VideoErrorState | null>(null);
  const [doubleTapAnimation, setDoubleTapAnimation] = useState<
    "left" | "right" | null
  >(null);
  const onLoad = () => {
    dispatch(setSubjectLoading(false));
  };

  // --- Helpers: Formatting Time ---
  const formatTime = (time: number): string => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // --- Handlers: Playback ---
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch((e) => console.error("Play error:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, []);

  const handleVolumeChange = (details: { value: number[] }) => {
    const newVol = details.value[0];
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (!newMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  // --- Handlers: Seeking ---
  const handleSeek = (details: { value: number[] }) => {
    const time = details.value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipTime = useCallback((amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  }, []);

  // --- Handlers: Fullscreen & PiP ---
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  const togglePiP = useCallback(async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    }
  }, []);

  // --- Handlers: Controls Visibility ---
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  const handleInteraction = () => {
    resetControlsTimeout();
  };

  // --- Handlers: Gestures (Double Tap) ---
  const handleZoneClick = (
    e: React.MouseEvent<HTMLDivElement>,
    zone: "left" | "center" | "right"
  ) => {
    e.stopPropagation();
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double Tap Detected
      if (zone === "left") {
        skipTime(-10);
        setDoubleTapAnimation("left");
        setTimeout(() => setDoubleTapAnimation(null), 500);
      } else if (zone === "right") {
        skipTime(10);
        setDoubleTapAnimation("right");
        setTimeout(() => setDoubleTapAnimation(null), 500);
      } else {
        togglePlay(); // Center double tap usually implies play/pause or fullscreen, let's keep it simple
      }
      lastTapRef.current = 0; // Reset
    } else {
      // Single Tap
      lastTapRef.current = now;
      if (zone === "center") {
        // إذا كانت الأزرار مخفية، أظهرها فقط. إذا ظاهرة، شغل/أوقف
        if (!showControls) {
          setShowControls(true);
        } else {
          togglePlay();
        }
      } else {
        // Side taps just show controls on mobile usually
        setShowControls((prev) => !prev);
      }
    }
    resetControlsTimeout();
  };

  // --- Effects ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("load", onLoad);

    return () => {
      video.removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      setIsPlaying(true);
      resetControlsTimeout();
    };
    const onPause = () => {
      setIsPlaying(false);
      setShowControls(true); // دائماً أظهر التحكم عند التوقف
    };
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      onLoad();
    };
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => {
      setIsLoading(false);
      onLoad();
    };

    const onError = () => {
      setIsLoading(false);
      if (video.error) {
        let msg = "حدث خطأ غير معروف";
        switch (video.error.code) {
          case 1:
            msg = "تم إلغاء عملية جلب الفيديو";
            break;
          case 2:
            msg = "حدث خطأ في الشبكة أثناء تحميل الفيديو";
            break;
          case 3:
            msg = "حدث خطأ أثناء فك ترميز الفيديو";
            break;
          case 4:
            msg = "صيغة الفيديو غير مدعومة أو المصدر غير موجود";
            break;
        }
        setError({ code: video.error.code, message: msg });
      }

      console.log("Error");

      dispatch(setSubjectLoading(false));
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);

    video.addEventListener("error", onError);

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);

      video.removeEventListener("error", onError);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [resetControlsTimeout]);

  if (error) {
    return (
      <Flex
        height="300px"
        bg="gray.900"
        color="white"
        align="center"
        justify="center"
        direction="column"
        gap={4}
        dir="rtl"
      >
        <Text fontSize="xl" fontWeight="bold" color="red.400">
          ⚠️ خطأ {error.code}
        </Text>
        <Text>{error.message}</Text>
      </Flex>
    );
  }

  return (
    <Box
      ref={containerRef}
      position="relative"
      width={"100%"}
      aspectRatio={16 / 9}
      bg="black"
      overflow="hidden"
      onMouseMove={handleInteraction}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      dir="ltr" // إجباري كما هو مطلوب
      borderRadius="lg"
      boxShadow="xl"
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        onClick={(e) => e.preventDefault()} // نلغي النقر الافتراضي للتحكم به يدوياً
      />

      {/* --- Overlay Click Zones (Left/Center/Right) --- */}
      <Flex
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={10}
      >
        {/* Left Zone (Rewind) */}
        <Box
          width="30%"
          height="100%"
          onClick={(e) => handleZoneClick(e, "left")}
          cursor="pointer"
          _active={{ bg: "whiteAlpha.100" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {doubleTapAnimation === "left" && (
            <Flex direction="column" align="center" color="white">
              <MdReplay10 size={40} />
              <Text fontSize="xs" fontWeight="bold">
                -10s
              </Text>
            </Flex>
          )}
        </Box>

        {/* Center Zone (Play/Pause/Toggle) */}
        <Box
          width="40%"
          height="100%"
          onClick={(e) => handleZoneClick(e, "center")}
          cursor="pointer"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* Spinner when waiting */}
          {isLoading && <Spinner size="xl" color="red.500" borderWidth="4px" />}
          {/* Big Play Button Animation if toggled via center (Optional) */}
        </Box>

        {/* Right Zone (Forward) */}
        <Box
          width="30%"
          height="100%"
          onClick={(e) => handleZoneClick(e, "right")}
          cursor="pointer"
          _active={{ bg: "whiteAlpha.100" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {doubleTapAnimation === "right" && (
            <Flex direction="column" align="center" color="white">
              <MdForward10 size={40} />
              <Text fontSize="xs" fontWeight="bold">
                +10s
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>

      {/* --- Controls Overlay --- */}
      <Flex
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bgGradient="to-t"
        gradientFrom="blackAlpha.900"
        gradientTo="transparent"
        p={4}
        direction="column"
        gap={2}
        opacity={showControls ? 1 : 0}
        transition="opacity 0.3s ease"
        zIndex={20}
        pointerEvents={showControls ? "auto" : "none"}
      >
        {/* Progress Bar (Chakra V3 Slider) */}
        <Box>
          <Slider.Root
            value={[currentTime]}
            max={duration || 100}
            min={0}
            step={0.1}
            onValueChange={handleSeek}
            onValueChangeEnd={handleInteraction}
            size={"sm"}
            width="100%"
          >
            <Slider.Control>
              <Slider.Track bg="whiteAlpha.300">
                <Slider.Range bg="red.500" />
              </Slider.Track>
              <Slider.Thumb index={0} boxSize={4} bg="red.500" />
            </Slider.Control>
          </Slider.Root>
        </Box>

        {/* Buttons Row */}
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={4}>
            {/* Play/Pause */}
            <IconButton
              aria-label={isPlaying ? "Pause" : "Play"}
              onClick={togglePlay}
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              size="sm"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </IconButton>

            {/* Volume Control */}
            <Flex
              align="center"
              gap={2}
              display={{ base: "none", md: "flex" }} // إخفاء على الموبايل لتوفير المساحة
            >
              <IconButton
                aria-label="Mute"
                onClick={toggleMute}
                variant="ghost"
                color="white"
                size="sm"
              >
                {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </IconButton>
              <Box width="80px">
                <Slider.Root
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.05}
                  onValueChange={handleVolumeChange}
                  size="sm"
                >
                  <Slider.Track bg="whiteAlpha.300">
                    <Slider.Range bg="white" />
                  </Slider.Track>
                  <Slider.Thumb index={0} boxSize={3} />
                </Slider.Root>
              </Box>
            </Flex>

            {/* Time */}
            <Text
              color="white"
              fontSize="xs"
              fontFamily="monospace"
              userSelect={"none"}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </Flex>

          <Flex align="center" gap={2}>
            {/* PiP */}
            <IconButton
              aria-label="Picture in Picture"
              onClick={togglePiP}
              variant="ghost"
              color="white"
              size="sm"
              display={{ base: "none", sm: "inline-flex" }}
            >
              <MdPictureInPictureAlt />
            </IconButton>

            {/* Fullscreen */}
            <IconButton
              aria-label="Fullscreen"
              onClick={toggleFullscreen}
              variant="ghost"
              color="white"
              size="sm"
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </IconButton>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

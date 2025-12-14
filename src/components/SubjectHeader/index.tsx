import { Flex, IconButton, Link, Show } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Tooltip } from "../ui/tooltip";
import { LuDownload, LuExternalLink } from "react-icons/lu";
import JSZip from "jszip";
import download from "downloadjs";
import { toaster } from "../ui/toaster";

interface Props {
  title: string;
  resource: string | Array<string>;
}

export default function SubjectHeader({ title, resource }: Props) {
  const [isDownloadHidden, setIsDownloadHidden] = useState(false),
    onDownload = async () => {
      if (Array.isArray(resource)) {
        const zip = new JSZip();

        try {
          let counter = 0;
          const promises = resource.map(async (url, index) => {
            const response = await fetch(url);

            if (!response.ok) {
              counter++;
              return;
            }

            const blob = await response.blob();

            const fileName =
              url.substring(url.lastIndexOf("/") + 1) || `image-${index}.jpg`;

            zip.file(fileName, blob);
          });

          await Promise.all(promises);

          const zipBlob = await zip.generateAsync({ type: "blob" });

          download(zipBlob, `${title}.zip`);

          toaster.create({
            description: "بدء التحميل بنجاح!",
            type: "success",
          });

          if (counter > 0) {
            if (counter === resource.length) {
              toaster.create({
                description: `فشل تحميل جميع الصور، رجاءً قم بإعادة المحاولة إذا كان ممكناً.`,
                type: "error",
              });
            } else {
              toaster.create({
                description: `فشل تحميل بعض الصور.`,
                type: "error",
              });
            }
          }
        } catch (_) {
          toaster.create({
            description: `حدث خطأ في عملية التحميل، أعد المحاولة رجاءً`,
            type: "error",
          });
        }
      }
    };

  useEffect(() => {
    if (typeof resource === "string") {
      setIsDownloadHidden(true);
    }
  }, [resource]);
  return (
    <Flex
      position={"absolute"}
      top={"50%"}
      left={0}
      width={"100%"}
      paddingInline={"2.5%"}
      transform={"translateY(-50%)"}
      justifyContent={"space-between"}
    >
      <Show
        when={typeof resource === "string"}
        fallback={
          <Tooltip content="تحميل" positioning={{ placement: "bottom" }}>
            <IconButton
              visibility={isDownloadHidden ? "hidden" : "visible"}
              onClick={onDownload}
              variant={"subtle"}
              size={{ base: "sm", md: "md" }}
            >
              <LuDownload />
            </IconButton>
          </Tooltip>
        }
      >
        <Tooltip content="إلى المورد" positioning={{ placement: "bottom" }}>
          <Link
            href={typeof resource === "string" ? resource : "#"}
            target={"_blank"}
            visibility={typeof resource === "string" ? "visible" : "hidden"}
          >
            <IconButton variant={"subtle"} size={{ base: "sm", md: "md" }}>
              <LuExternalLink />
            </IconButton>
          </Link>
        </Tooltip>
      </Show>
    </Flex>
  );
}

import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Icon,
  ProgressCircle,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import { setColor } from "./store/slice/color";
import { useEffect, useState } from "react";
import { setScope } from "./store/slice/scope";
import { Menu, Page, subject } from "./components";
import {
  TbAlphabetLatin,
  TbAtom,
  TbBrandParsinta,
  TbBrush,
  TbChevronLeft,
  TbChevronRight,
  TbFileTypePdf,
  TbHeadphones,
  TbHelpHexagon,
  TbMath,
  TbMicroscope,
  TbPhoto,
} from "react-icons/tb";

import "./App.css";
import { Toaster } from "./components/ui/toaster";

const colors = [
  "gray",
  "red",
  "green",
  "teal",
  "blue",
  "pink",
  "purple",
  "cyan",
  "orange",
  "yellow",
  "white",
] as const;

function App() {
  const color = useSelector((state: RootState) => state.color.value),
    scope = useSelector((state: RootState) => state.scope.value),
    [subjectType, setSubjectType] = useState(0),
    [subjectName, setSubjectName] = useState(""),
    dispatch = useDispatch(),
    changeColor = () => {
      const number = Math.floor(Math.random() * (colors.length - 1)),
        randomColor = colors.filter((c) => c !== color)[number];

      dispatch(setColor(randomColor));
    },
    setPage = (page: number) => {
      setTimeout(() => {
        dispatch(setScope(-1));

        setTimeout(() => {
          dispatch(setScope(page));
        }, 400);
      }, 1000);
    },
    groups = [
      { icon: <TbMath />, name: "المجموعة الأولى", category: 1 },
      { icon: <TbAtom />, name: "المجموعة الثانية", category: 2 },
      { icon: <TbAlphabetLatin />, name: "المجموعة الثالثة", category: 3 },
      { icon: <TbMicroscope />, name: "المجموعة الرابعة", category: 4 },
      { icon: <TbBrush />, name: "المجموعة الخامسة", category: 5 },
    ],
    subjects = [
      {
        type: "pdf",
        title: "كتاب الرياضيات ثالث ثانوي مسارات الفصل الاول",
        category: 1,
        resource:
          "https://www.wajibati.net/wp-content/uploads/2025/08/kp-ry3sf1_1_wm99k40zrh.pdf",
      },
      {
        type: "pdf",
        title: "كتاب: بايثون لعلوم البيانات",
        category: 5,
        resource:
          "https://jakevdp.github.io/PythonDataScienceHandbook/PythonDataScienceHandbook.pdf",
      },
      {
        type: "pdf",
        title: "مقدمة في نظرية الحوسبة",
        category: 2,
        resource: "https://arxiv.org/pdf/1603.04395.pdf",
      },
      {
        type: "pdf",
        title: "دليل لغة جافا سكريبت المختصر",
        category: 3,
        resource:
          "https://media.prod.mdn.mozit.cloud/attachments/2012/07/09/3568/7057e93734000305abab312892994966/JS_Cheat_Sheet.pdf", // MDN Archive or similar
      },
      {
        type: "pdf",
        title: "أساسيات تعلم الآلة والشبكات العصبية",
        category: 4,
        resource: "https://arxiv.org/pdf/1803.08823.pdf",
      },
      {
        type: "pdf",
        title: "كتاب: التحكم في الإصدارات Git",
        category: 1,
        resource:
          "https://github.com/progit/progit2/releases/download/2.1.424/progit.pdf",
      },
      {
        type: "pdf",
        title: "مستقبل التعليم والذكاء الاصطناعي",
        category: 5,
        resource:
          "https://unesdoc.unesco.org/in/rest/annotationSVC/DownloadWatermarkedAttachment/attach_import_66b5c00e-c290-40e9-8664-d3221e855d04?_=387252eng.pdf&to=25&from=1", // UNESCO Doc
      },
      {
        type: "pdf",
        title: "فيزياء الثقوب السوداء",
        category: 3,
        resource: "https://arxiv.org/pdf/hep-th/0409028.pdf",
      },
      {
        type: "pdf",
        title: "دليل إدارة المشاريع الرشيقة",
        category: 2,
        resource:
          "https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US-English.pdf",
      },
      {
        type: "pdf",
        title: "تقرير عن التغير المناخي العالمي",
        category: 4,
        resource:
          "https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_SPM.pdf",
      },
      {
        type: "pdf",
        title: "مرجع أوامر نظام لينكس",
        category: 1,
        resource: "https://files.fosswire.com/2007/08/fwunixref.pdf",
      },
      {
        type: "pdf",
        title: "مبادئ التصميم الجرافيكي الحديث",
        category: 5,
        resource:
          "https://cdn.standards.iteh.ai/samples/67635/e060037f54494101851e390234149022/ISO-14001-2015.pdf",
      },
      {
        type: "image",
        title: "مجرة درب التبانة تتلألأ ليلاً",
        category: 3,
        resource: [
          "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86",
          "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a",
        ],
      },
      {
        type: "image",
        title: "جبال خضراء وبحيرة صافية",
        category: 2,
        resource: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
          "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9",
        ],
      },
      {
        type: "image",
        title: "صورة مقربة لزهرة عباد الشمس",
        category: 4,
        resource: [
          "https://images.unsplash.com/photo-1471943038827-048754b2d4aa",
        ],
      },
      {
        type: "image",
        title: "جمال الغابات الاستوائية المطيرة",
        category: 1,
        resource: [
          "https://images.unsplash.com/photo-1511497584788-876760111969",
          "https://images.unsplash.com/photo-1516214104703-d870798883c5",
          "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
          "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
          "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c",
        ],
      },
      {
        type: "image",
        title: "سديم الفضاء الخارجي الملون",
        category: 5,
        resource: [
          "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
          "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986",
        ],
      },
      {
        type: "image",
        title: "صحراء واسعة وكثبان رملية",
        category: 2,
        resource: [
          "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
          "https://images.unsplash.com/photo-1542401886-65d6c61db217",
        ],
      },
      {
        type: "image",
        title: "انعكاس الجبال على سطح الماء",
        category: 4,
        resource: [
          "https://images.unsplash.com/photo-1439853949127-fa647821eba0",
          "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
        ],
      },
      {
        type: "image",
        title: "مشهد الغروب فوق المحيط",
        category: 3,
        resource: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        ],
      },
      {
        type: "image",
        title: "أضواء الشفق القطبي الخلابة",
        category: 1,
        resource: [
          "https://images.unsplash.com/photo-1483347752412-bf2e183b30a9",
          "https://images.unsplash.com/photo-1531366936337-7c912a4589a7",
          "https://images.unsplash.com/photo-1564634293881-807185c74291",
          "https://images.unsplash.com/photo-1574169208507-84376144848b",
        ],
      },
      {
        type: "image",
        title: "فراشة ملونة على ورقة شجر",
        category: 5,
        resource: [
          "https://images.unsplash.com/photo-1459664018906-085c36f472af",
          "https://images.unsplash.com/photo-1555465910-31f7f20a184d",
        ],
      },
      {
        type: "image",
        title: "قمر مكتمل في سماء صافية",
        category: 2,
        resource: [
          "https://images.unsplash.com/photo-1532693322450-2cb5c511067d",
          "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe",
        ],
      },
      {
        type: "image",
        title: "تساقط الثلوج في غابة شتوية",
        category: 4,
        resource: [
          "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22",
          "https://images.unsplash.com/photo-1516465723323-6e1c3fcd0307",
        ],
      },
      {
        type: "audio",
        title: "سورة الفاتحة - مشاري العفاسي",
        category: 1,
        resource: "https://server8.mp3quran.net/afs/001.mp3",
      },
      {
        type: "audio",
        title: "سورة الرحمن - محمد صديق المنشاوي",
        category: 5,
        resource: "https://server10.mp3quran.net/minsh/055.mp3",
      },
      {
        type: "audio",
        title: "أذان المدينة المنورة العذب",
        category: 2,
        resource:
          "https://ia800300.us.archive.org/12/items/Adhan_Makkah_Madinah/Adhan_Madinah.mp3",
      },
      {
        type: "audio",
        title: "آية الكرسي مكررة للراحة",
        category: 3,
        resource: "https://server11.mp3quran.net/yasser/002.mp3",
      },
      {
        type: "audio",
        title: "سورة الكهف - إسلام صبحي",
        category: 4,
        resource:
          "https://ia801509.us.archive.org/5/items/Islam_Sobhi_Quran/018.mp3",
      },
      {
        type: "audio",
        title: "أنشودة: فرشي التراب (بدون إيقاع)",
        category: 1,
        resource:
          "https://ia800606.us.archive.org/21/items/Nasheed_Collection/Farshy_Al_Turab.mp3",
      },
      {
        type: "audio",
        title: "محاضرة: فضل ذكر الله",
        category: 5,
        resource:
          "https://ia600205.us.archive.org/1/items/Mohd-rateb-alnablsi-Lessons/001.mp3",
      },
      {
        type: "audio",
        title: "سورة يوسف - سعد الغامدي",
        category: 2,
        resource: "https://server7.mp3quran.net/s_gmd/012.mp3",
      },
      {
        type: "audio",
        title: "أذكار الصباح والمساء كاملة",
        category: 3,
        resource:
          "https://ia801903.us.archive.org/20/items/Athkar_Sabah_Masa/Athkar.mp3",
      },
      {
        type: "audio",
        title: "تلاوة هادئة قبل النوم",
        category: 4,
        resource: "https://server12.mp3quran.net/maher/067.mp3",
      },
      {
        type: "audio",
        title: "تكبيرات العيد الحرم المكي",
        category: 1,
        resource:
          "https://ia601406.us.archive.org/22/items/Takbeerat/Takbeerat_Makkah.mp3",
      },
      {
        type: "audio",
        title: "سورة مريم - ناصر القطامي",
        category: 5,
        resource: "https://server6.mp3quran.net/qtm/019.mp3",
      },
      {
        type: "audio",
        title: "أنشودة: سوف نبقى هنا",
        category: 2,
        resource:
          "https://ia902609.us.archive.org/3/items/Nasheed_Sowfa_Nabqa_Hona/Sowfa_Nabqa_Hona.mp3",
      },
      {
        type: "video",
        title: "كيف يعمل الإنترنت؟ (شرح مبسط)",
        category: 3,
        resource: "https://www.youtube.com/watch?v=7_LPdttKXPc",
      },
      {
        type: "video",
        title: "تعلم الجافا سكريبت في ساعة",
        category: 4,
        resource: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
      },
      {
        type: "video",
        title: "تاريخ الحرب العالمية الثانية باختصار",
        category: 1,
        resource: "https://www.youtube.com/watch?v=_uk_6vfqwTA",
      },
      {
        type: "video",
        title: "فيزياء: ما هي الجاذبية؟",
        category: 5,
        resource: "https://www.youtube.com/watch?v=XRr1kaXKBs0",
      },
      {
        type: "video",
        title: "كيف تبدأ في تعلم البرمجة",
        category: 2,
        resource: "https://www.youtube.com/watch?v=zOjov-2OZ0E",
      },
      {
        type: "video",
        title: "دورة تعلم الفوتوشوب للمبتدئين",
        category: 3,
        resource: "https://www.youtube.com/watch?v=IyR_uYsRdPs",
      },
      {
        type: "video",
        title: "وثائقي: رحلة إلى حافة الكون",
        category: 4,
        resource: "https://www.youtube.com/watch?v=b_J9gXJ_Jms",
      },
      {
        type: "video",
        title: "تعلم اللغة الإنجليزية: المحادثة",
        category: 1,
        resource: "https://www.youtube.com/watch?v=59i3Z3f9p6A",
      },
      {
        type: "video",
        title: "كيف يعمل محرك الاحتراق الداخلي",
        category: 5,
        resource: "https://www.youtube.com/watch?v=5tNDi6hOa54",
      },
      {
        type: "video",
        title: "أساسيات علم الاقتصاد والمال",
        category: 2,
        resource: "https://www.youtube.com/watch?v=3ez10ADR_gM",
      },
      {
        type: "video",
        title: "طريقة حل مكعب روبيك بسهولة",
        category: 3,
        resource: "https://www.youtube.com/watch?v=7Ron6MN45LY",
      },
      {
        type: "video",
        title: "شرح نظرية النسبية لأينشتاين",
        category: 4,
        resource: "https://www.youtube.com/watch?v=tzQC3uYL67U",
      },
      {
        type: "video",
        title: "تعلم الطبخ: مكرونة إيطالية",
        category: 1,
        resource: "https://www.youtube.com/watch?v=H30s096eKkg", // Jamie Oliver
      },
      {
        type: "video",
        title: "Digital Show & Tell",
        category: 2,
        resource:
          "https://ftp.osuosl.org/pub/xiph/video/Digital_Show_and_Tell-480p.webm",
      },
    ] as const;

  useEffect(() => {
    setPage(1);
  }, []);

  return (
    <>
      <Grid
        templateRows={"auto 1fr"}
        direction={"rtl"}
        minH={"-webkit-fill-available"}
      >
        <Flex
          backgroundColor="#eeeeee10"
          padding=".5rem 1rem"
          justifyContent={"flex-end"}
        >
          <Button
            colorPalette={color}
            size="sm"
            variant="outline"
            onClick={changeColor}
          >
            تغيير اللون
          </Button>
        </Flex>
        <main style={{ position: "relative" }}>
          <Center
            h={"100%"}
            w={"100%"}
            position={"absolute"}
            top={0}
            left={0}
            data-state={scope === 0 ? "open" : "closed"}
            zIndex={5}
            bg="{colors.black}"
            _closed={{
              animationName: "slide-out-right",
              animationFillMode: "forwards",
              animationDuration: `400ms`,
            }}
          >
            <ProgressCircle.Root value={null} size="sm" colorPalette={color}>
              <ProgressCircle.Circle>
                <ProgressCircle.Track />
                <ProgressCircle.Range />
              </ProgressCircle.Circle>
            </ProgressCircle.Root>
          </Center>
          <Page pageScope={1}>
            <Heading size={"6xl"} fontWeight={"bold"}>
              منصة
            </Heading>
            <Button
              variant={"solid"}
              colorPalette={color}
              onClick={() => dispatch(setScope(2))}
            >
              <Icon size="xl">
                <TbChevronLeft />
              </Icon>
            </Button>
          </Page>
          <Page
            pageScope={2}
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
          >
            <Box height={"100%"} width={"100%"}>
              <Menu
                items={groups}
                item={({ item }) => (
                  <Box
                    width={{ base: "80%", md: "50%" }}
                    borderRadius={".5rem"}
                    bg={"#eeeeee10"}
                    cursor={"pointer"}
                    height={"100%"}
                    onClick={() => {
                      dispatch(setScope(3));
                      setSubjectType(item.category);
                      setSubjectName(item.name);
                    }}
                    _hover={{ background: "#eeeeee18" }}
                    transition=".2s background ease-in-out"
                  >
                    <Grid
                      gridTemplateColumns={"auto 1fr"}
                      alignItems={"center"}
                      height={"100%"}
                    >
                      <Flex
                        padding={"0 1.5em"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        bg="#00000010"
                        height={"100%"}
                      >
                        <Icon
                          size={{ base: "md", md: "lg", lg: "xl" }}
                          color={color}
                        >
                          {item.icon}
                        </Icon>
                      </Flex>
                      <Flex
                        alignItems={"center"}
                        padding=".5rem 1rem"
                        height={"100%"}
                      >
                        <Text
                          color={color}
                          fontSize={{ base: "xs", md: "sm", lg: "lg" }}
                          fontWeight={"bold"}
                        >
                          {item.name}
                        </Text>
                      </Flex>
                    </Grid>
                  </Box>
                )}
              />
            </Box>
          </Page>
          <Page
            pageScope={3}
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
          >
            <Grid
              height={"100%"}
              width={"100%"}
              templateRows={"auto 1fr"}
              templateColumns={"1fr"}
            >
              <Flex
                marginTop={2}
                alignItems={"center"}
                position="relative"
                columnGap={5}
                width="max-content"
                padding={"5px 0 5px 10px"}
                onClick={() => dispatch(setScope(2))}
                cursor={"pointer"}
              >
                <TbChevronRight color={color} size={35} />
                <Text color={color} fontSize={20}>
                  {subjectName}
                </Text>
              </Flex>
              <Box h="auto" minH={0}>
                <Menu
                  items={subjects.filter((s) => s.category === subjectType)}
                  item={({ item }) => (
                    <Box
                      width={{ base: "80%", md: "50%" }}
                      borderRadius={".5rem"}
                      bg={"#eeeeee10"}
                      height={"100%"}
                      onClick={() => {
                        subject.open("a", {
                          title: item.title,
                          type: item.type,
                          description: "This's description",
                          resource: item.resource as string | Array<string>,
                        });
                      }}
                      marginInlineStart={".5rem"}
                      cursor={"pointer"}
                      _hover={{ background: "#eeeeee18" }}
                      transition=".2s background ease-in-out"
                    >
                      <Grid
                        gridTemplateColumns={"auto 1fr"}
                        alignItems={"center"}
                        height={"100%"}
                      >
                        <Box p={"1.5rem"} bg="#00000010">
                          <Icon
                            size={{ base: "md", md: "lg", lg: "xl" }}
                            color={color}
                          >
                            {(() => {
                              switch (item.type) {
                                case "pdf": {
                                  return <TbFileTypePdf />;
                                }
                                case "image": {
                                  return <TbPhoto />;
                                }
                                case "audio": {
                                  return <TbHeadphones />;
                                }
                                case "video": {
                                  return <TbBrandParsinta />;
                                }
                                default: {
                                  return <TbHelpHexagon />;
                                }
                              }
                            })()}
                          </Icon>
                        </Box>
                        <Flex
                          alignItems={"center"}
                          padding=".5rem 1rem"
                          height={"100%"}
                        >
                          <Text
                            color={color}
                            fontSize={{ base: "xs", md: "sm", lg: "lg" }}
                            fontWeight={"bold"}
                          >
                            {item.title}
                          </Text>
                        </Flex>
                      </Grid>
                    </Box>
                  )}
                />
              </Box>
            </Grid>
          </Page>
          <subject.Viewport />
          <Toaster />
        </main>
      </Grid>
    </>
  );
}

export default App;

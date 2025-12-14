import { useRef, useEffect } from "react";

interface Options {
  /**
   * معامل الاحتكاك (Friction/Decay).
   * القيمة يجب أن تكون بين 0 و 1.
   * القيمة الأقرب لـ 1 تعني انزلاقاً أطول (زخم عالٍ).
   * القيمة الأقرب لـ 0 تعني توقفاً سريعاً.
   * الافتراضي: 0.95
   */
  decay?: number;
  /**
   * سرعة السحب (Multiplier).
   * الافتراضي: 1
   */
  velocityScale?: number;
}

export const useDraggableScroll = <T extends HTMLElement>(
  options: Options = {}
): React.RefObject<T | null> => {
  const { decay = 0.95, velocityScale = 1 } = options;
  const ref = useRef<T>(null);

  // استخدام refs للمتغيرات لتجنب إعادة التصيير (Re-renders) غير الضرورية
  const internalState = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    velX: 0,
    velY: 0,
    lastX: 0, // لحساب السرعة اللحظية
    lastY: 0,
    animationId: 0,
  });

  useEffect(() => {
    const slider = ref.current;
    if (!slider) return;

    const state = internalState.current;

    // دالة إيقاف الزخم الحالي (عند بداية سحب جديد)
    const cancelMomentum = () => {
      cancelAnimationFrame(state.animationId);
    };

    // دالة تنفيذ الزخم (Inertia)
    const beginMomentum = () => {
      cancelMomentum();

      const step = () => {
        // إذا كانت السرعة ضئيلة جداً، نوقف الحركة لتوفير الموارد
        if (Math.abs(state.velX) < 0.5 && Math.abs(state.velY) < 0.5) return;

        if (slider) {
          slider.scrollLeft -= state.velX;
          slider.scrollTop -= state.velY;
        }

        // تطبيق الاحتكاك (Decay)
        state.velX *= decay;
        state.velY *= decay;

        state.animationId = requestAnimationFrame(step);
      };

      state.animationId = requestAnimationFrame(step);
    };

    // --- Mouse Events ---
    const onMouseDown = (e: MouseEvent) => {
      state.isDown = true;
      state.startX = e.pageX - slider.offsetLeft;
      state.startY = e.pageY - slider.offsetTop;
      state.scrollLeft = slider.scrollLeft;
      state.scrollTop = slider.scrollTop;
      state.lastX = e.pageX;
      state.lastY = e.pageY;
      state.velX = 0;
      state.velY = 0;

      cancelMomentum();
      slider.style.cursor = "grabbing";
      slider.style.userSelect = "none"; // منع تحديد النصوص
    };

    const onMouseLeave = () => {
      state.isDown = false;
      slider.style.cursor = "grab";
      slider.style.removeProperty("user-select");
    };

    const onMouseUp = () => {
      state.isDown = false;
      slider.style.cursor = "grab";
      slider.style.removeProperty("user-select");
      beginMomentum();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!state.isDown) return;
      e.preventDefault();

      const x = e.pageX - slider.offsetLeft;
      const y = e.pageY - slider.offsetTop;

      // المسافة المقطوعة
      const walkX = (x - state.startX) * velocityScale;
      const walkY = (y - state.startY) * velocityScale;

      // حساب السرعة اللحظية للزخم
      state.velX = e.pageX - state.lastX;
      state.velY = e.pageY - state.lastY;
      state.lastX = e.pageX;
      state.lastY = e.pageY;

      slider.scrollLeft = state.scrollLeft - walkX;
      slider.scrollTop = state.scrollTop - walkY;
    };

    // --- Touch Events (للهواتف والتابلت) ---
    const onTouchStart = (e: TouchEvent) => {
      state.isDown = true;
      const touch = e.touches[0];
      state.startX = touch.pageX - slider.offsetLeft;
      state.startY = touch.pageY - slider.offsetTop;
      state.scrollLeft = slider.scrollLeft;
      state.scrollTop = slider.scrollTop;
      state.lastX = touch.pageX;
      state.lastY = touch.pageY;
      state.velX = 0;
      state.velY = 0;

      cancelMomentum();
    };

    const onTouchEnd = () => {
      state.isDown = false;
      beginMomentum();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!state.isDown) return;
      const touch = e.touches[0];

      const x = touch.pageX - slider.offsetLeft;
      const y = touch.pageY - slider.offsetTop;

      const walkX = (x - state.startX) * velocityScale;
      const walkY = (y - state.startY) * velocityScale;

      // حساب الزخم
      state.velX = touch.pageX - state.lastX;
      state.velY = touch.pageY - state.lastY;
      state.lastX = touch.pageX;
      state.lastY = touch.pageY;

      slider.scrollLeft = state.scrollLeft - walkX;
      slider.scrollTop = state.scrollTop - walkY;
    };

    // إضافة المستمعين
    slider.addEventListener("mousedown", onMouseDown);
    slider.addEventListener("mouseleave", onMouseLeave);
    slider.addEventListener("mouseup", onMouseUp);
    slider.addEventListener("mousemove", onMouseMove);

    slider.addEventListener("touchstart", onTouchStart);
    slider.addEventListener("touchend", onTouchEnd);
    slider.addEventListener("touchmove", onTouchMove);

    // تنظيف المستمعين عند إلغاء المكون
    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      slider.removeEventListener("mouseleave", onMouseLeave);
      slider.removeEventListener("mouseup", onMouseUp);
      slider.removeEventListener("mousemove", onMouseMove);

      slider.removeEventListener("touchstart", onTouchStart);
      slider.removeEventListener("touchend", onTouchEnd);
      slider.removeEventListener("touchmove", onTouchMove);
      cancelMomentum();
    };
  }, [decay, velocityScale]);

  return ref;
};

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

// Nếu bạn có hàm cn thì giữ lại, không thì thay bằng nối chuỗi đơn giản:
const cn = (...cls: (string | undefined | false)[]) => cls.filter(Boolean).join(" ");

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  mode = "single",
  showOutsideDays = true,
  initialFocus,
  ...props
}: CalendarProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  // Tự focus vào ngày "hôm nay", hoặc ngày đang chọn, hoặc ngày đầu tiên hợp lệ
  React.useEffect(() => {
    if (!initialFocus) return;
    const t = setTimeout(() => {
      const root = rootRef.current;
      if (!root) return;
      const todayBtn = root.querySelector<HTMLButtonElement>(".rdp-day_today");
      const selectedBtn = root.querySelector<HTMLButtonElement>(".rdp-day[aria-selected='true']");
      const firstEnabled = root.querySelector<HTMLButtonElement>(".rdp-day:not([disabled])");
      (todayBtn || selectedBtn || firstEnabled)?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [initialFocus, props.month, props.selected]);

  return (
    <div ref={rootRef}>
      <DayPicker
        mode={mode}
        showOutsideDays={showOutsideDays}
        // initialFocus không phải lúc nào cũng hoạt động trong Popover, nhưng ta vẫn truyền để tương thích
        initialFocus={initialFocus}
        className={cn("p-2", className)}
        weekStartsOn={1}
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";
export { Calendar };

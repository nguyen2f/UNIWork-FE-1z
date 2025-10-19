import { Button, DatePicker, Dropdown, Space } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useRef, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { RangePickerProps } from "antd/es/date-picker";

dayjs.extend(customParseFormat);

export type BaseDateRangePickerProps = RangePickerProps & {
    isRow?: boolean;
    value?: [dayjs.Dayjs, dayjs.Dayjs];
    onChange?: (value: [dayjs.Dayjs, dayjs.Dayjs]) => void;
    format?: string;
};

export const DateRangePicker = ({
    value,
    defaultValue = [dayjs().startOf("day"), dayjs().endOf("day")],
    isRow = false,
    onChange,
    format = "DD/MM/YYYY - HH:mm",
    ...rest
}: BaseDateRangePickerProps) => {
    // Nếu không truyền `value`, dùng internalValue với mặc định là "Hôm nay"
    const [internalValue, setInternalValue] = useState<[dayjs.Dayjs, dayjs.Dayjs]>(defaultValue);
    const controlledValue = value === undefined ? internalValue : value;

    const [selectedLabel, setSelectedLabel] = useState("Today");

    const rangePresets = [
        {
            key: "today",
            label: "Today",
            value: [dayjs().startOf("day"), dayjs().endOf("day")],
        },
        {
            key: "yesterday",
            label: "Yesterday",
            value: [dayjs().add(-1, "d").startOf("day"), dayjs().add(-1, "d").endOf("day")],
        },
        {
            key: "this_month",
            label: "This Month",
            value: [dayjs().startOf("month"), dayjs().endOf("month")],
        },
        {
            key: "last_month",
            label: "Last Month",
            value: [dayjs().add(-1, "month").startOf("month"), dayjs().add(-1, "month").endOf("month")],
        },
        {
            key: "LAST_7",
            label: "Last 7 Days",
            value: [dayjs().add(-6, "d").startOf("day"), dayjs().endOf("day")],
        },
        {
            key: "LAST_30",
            label: "Last 30 Days",
            value: [dayjs().add(-29, "d").startOf("day"), dayjs().endOf("day")],
        },
    ];

    // Nếu không có value từ ngoài, trigger onChange mặc định hôm nay
    useEffect(() => {
        if (!value) {
            onChange?.(rangePresets[0].value);
        }
    }, []);

    useEffect(() => {
        const found = rangePresets.find(
            (e) =>
                e.value[0].isSame(controlledValue?.[0], "date") &&
                e.value[1].isSame(controlledValue?.[1], "date"),
        );
        setSelectedLabel(found?.label || "Select");
    }, [controlledValue]);

    const handleMenuClick = ({ key }: { key: string }) => {
        const preset = rangePresets.find((p) => p.key === key);
        if (preset) {
            setSelectedLabel(preset.label);
            if (!value) setInternalValue(preset.value); // Nếu uncontrolled
            onChange?.(preset.value as [dayjs.Dayjs, dayjs.Dayjs]);
        }
    };

    // useEffect(() => {
    //   const inputs = document.querySelectorAll<HTMLInputElement>(".ant-picker-input input");

    //   const handleEnterKey = (e: KeyboardEvent) => {
    //     if (e.key !== "Enter") return;
    //     e.preventDefault();
    //     // e.stopPropagation();

    //     const startRaw = inputs[0]?.value || "";
    //     const endRaw = inputs[1]?.value || "";

    //     const tryParse = (val: string) => {
    //       if (/^\d{6}$/.test(val)) return dayjs(val, "DDMMYY", true);
    //       if (/^\d{8}$/.test(val)) return dayjs(val, "DDMMYYYY", true);
    //       if (/^\d{12}$/.test(val)) return dayjs(val, "DDMMYYHHmmss", true);
    //       if (/^\d{14}$/.test(val)) return dayjs(val, "DDMMYYYYHHmmss", true);
    //       return dayjs(val, format, true);
    //     };

    //     let start = tryParse(startRaw);
    //     let end = tryParse(endRaw);

    //     // ⏰ Nếu không nhập giờ ở ngày kết thúc → mặc định 23:59:59
    //     if ((/^\d{6}$/.test(endRaw) || /^\d{8}$/.test(endRaw)) && end.isValid()) {
    //       end = end.set("hour", 23).set("minute", 59).set("second", 59);
    //     }

    //     if (start.isValid() && end.isValid()) {
    //       const newRange: [dayjs.Dayjs, dayjs.Dayjs] = [start, end];

    //       // ✅ Cập nhật input DOM để re-render đúng định dạng
    //       inputs[0].value = start.format(format);
    //       inputs[1].value = end.format(format);

    //       // ✅ Gọi lại onChange
    //       if (!value) setInternalValue(newRange);
    //       onChange?.(newRange);

    //       // ✅ Bỏ focus (unfocus) và đóng popup
    //       inputs.forEach((input) => {
    //         input.blur();
    //         input.dispatchEvent(new Event("blur")); // ép đóng
    //       });

    //       // ✅ Optionally, remove keyboard focus khỏi RangePicker container
    //       const pickerContainer = document.querySelector(".ant-picker");
    //       if (pickerContainer instanceof HTMLElement) {
    //         pickerContainer.blur();
    //       }
    //     }
    //   };

    //   inputs.forEach((input) => input.addEventListener("keydown", handleEnterKey));
    //   return () => {
    //     inputs.forEach((input) => input.removeEventListener("keydown", handleEnterKey));
    //   };
    // }, [value, format, onChange]);

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>,
        value?: [dayjs.Dayjs, dayjs.Dayjs],
        onChange?: (val: [dayjs.Dayjs, dayjs.Dayjs]) => void,
        setInternalValue?: React.Dispatch<React.SetStateAction<[dayjs.Dayjs, dayjs.Dayjs]>>
    ) => {
        if (e.key !== "Enter") return;

        e.preventDefault();

        const inputs = (e.currentTarget as HTMLDivElement).querySelectorAll<HTMLInputElement>("input");
        if (inputs.length < 2) return;

        const [startRaw, endRaw] = [inputs[0].value, inputs[1].value];

        const parseDate = (val: string) => dayjs(val, "DD/MM/YYYY - HH:mm", true);

        const start = parseDate(startRaw);
        let end = parseDate(endRaw);

        if (!start.isValid() || !end.isValid()) return;

        end = end.set("hour", 23).set("minute", 59).set("second", 59);

        const newRange: [dayjs.Dayjs, dayjs.Dayjs] = [start, end];

        if (setInternalValue) setInternalValue(newRange);

        onChange?.(newRange);

        inputs.forEach((input) => input.blur());
    };

    const dropdownMenu = {
        items: rangePresets.map(({ label, key }) => ({ label, key })),
        onClick: handleMenuClick,
    };

    return isRow ? (
        <div className="flex items-center w-full">
            <DatePicker.RangePicker
                className="w-full"
                format={format}
                value={controlledValue}
                onCalendarChange={(v) => {
                    if (v && v[0] && v[1]) {
                        if (!value) setInternalValue(v as [dayjs.Dayjs, dayjs.Dayjs]);
                        onChange?.(v as [dayjs.Dayjs, dayjs.Dayjs]);
                    }
                }}
                onChange={(v) => {
                    if (!value) setInternalValue(v as [dayjs.Dayjs, dayjs.Dayjs]);
                    onChange?.(v as [dayjs.Dayjs, dayjs.Dayjs]);
                }}
                onKeyDown={(e) => handleKeyDown(e, value, onChange, setInternalValue)}
                {...rest}
            />
            <Dropdown disabled={Boolean(rest?.disabled)} menu={dropdownMenu}>
                <Button className="!h-[32px] px-2" type="link">
                    <Space>
                        <span>{selectedLabel}</span>
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
        </div>
    ) : (
        <div className="w-full relative">
            <div className="absolute -top-8 -right-2 z-10 flex justify-between items-center">
                <Dropdown disabled={Boolean(rest?.disabled)} menu={dropdownMenu}>
                    <Button className="!h-[32px] px-2" type="link">
                        <Space>
                            <span>{selectedLabel}</span>
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <DatePicker.RangePicker
                className="w-full"
                format={format}
                value={controlledValue}
                onCalendarChange={(v) => {
                    if (v && v[0] && v[1]) {
                        if (!value) setInternalValue(v as [dayjs.Dayjs, dayjs.Dayjs]);
                        onChange?.(v as [dayjs.Dayjs, dayjs.Dayjs]);
                    }
                }}
                onChange={(v) => {
                    if (!value) setInternalValue(v as [dayjs.Dayjs, dayjs.Dayjs]);
                    onChange?.(v as [dayjs.Dayjs, dayjs.Dayjs]);
                }}
                onKeyDown={(e) => handleKeyDown(e, value, onChange, setInternalValue)}
                {...rest}
            />
        </div>
    );
};

export default DateRangePicker;

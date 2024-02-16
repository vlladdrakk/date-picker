import { h, FunctionalComponent } from "@stencil/core"
import { DuetLocalizedText } from "./date-localization"
import { DaysOfWeek, getStartOfWeekDate } from "./date-utils"

type DatePickerInputProps = {
  value: string
  formattedValue: string
  valueAsDate: Date
  localization: DuetLocalizedText
  name: string
  identifier: string
  disabled: boolean
  required: boolean
  role: string
  dateFormatter: Intl.DateTimeFormat
  onClick: (event: MouseEvent) => void
  onInput: (event: InputEvent) => void
  onBlur: (event: FocusEvent) => void
  onFocus: (event: FocusEvent) => void
  buttonRef: (element: HTMLButtonElement) => void
  inputRef: (element: HTMLInputElement) => void
  selectByWeek: boolean
  firstDayOfWeek: DaysOfWeek
}

function getWeekNumber(currentDate) {
  const startDate = new Date(currentDate.getFullYear(), 0, 1)
  const days = Math.floor((currentDate - startDate.getTime()) / (24 * 60 * 60 * 1000))

  return Math.ceil(days / 7)
    .toString()
    .padStart(2, "0")
}

export const DatePickerInput: FunctionalComponent<DatePickerInputProps> = ({
  onClick,
  dateFormatter,
  localization,
  name,
  formattedValue,
  valueAsDate,
  value,
  identifier,
  disabled,
  required,
  role,
  buttonRef,
  inputRef,
  onInput,
  onBlur,
  onFocus,
  selectByWeek,
  firstDayOfWeek,
}) => {
  let actualValue = value
  let formattedDate = formattedValue

  if (selectByWeek && value !== "") {
    const startOfWeek = getStartOfWeekDate(valueAsDate, firstDayOfWeek)
    const formatter = new Intl.DateTimeFormat(localization.locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })

    actualValue = `${valueAsDate.getFullYear()}-W${getWeekNumber(valueAsDate)}`
    formattedDate = `Week of ${formatter.format(startOfWeek)}`
  }

  return (
    <div class="duet-date__input-wrapper">
      <input
        class="duet-date__input"
        value={formattedDate}
        placeholder={selectByWeek ? localization.weekPlaceholder : localization.placeholder}
        id={identifier}
        disabled={disabled}
        role={role}
        required={required ? true : undefined}
        aria-autocomplete="none"
        onInput={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete="off"
        ref={inputRef}
      />
      <input type="hidden" name={name} value={actualValue} />
      <button class="duet-date__toggle" onClick={onClick} disabled={disabled} ref={buttonRef} type="button">
        <span class="duet-date__toggle-icon">
          <svg aria-hidden="true" height="24" viewBox="0 0 21 21" width="24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fill-rule="evenodd" transform="translate(2 2)">
              <path
                d="m2.5.5h12c1.1045695 0 2 .8954305 2 2v12c0 1.1045695-.8954305 2-2 2h-12c-1.1045695 0-2-.8954305-2-2v-12c0-1.1045695.8954305-2 2-2z"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path d="m.5 4.5h16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
              <g fill="currentColor">
                <circle cx="8.5" cy="8.5" r="1" />
                <circle cx="4.5" cy="8.5" r="1" />
                <circle cx="12.5" cy="8.5" r="1" />
                <circle cx="8.5" cy="12.5" r="1" />
                <circle cx="4.5" cy="12.5" r="1" />
                <circle cx="12.5" cy="12.5" r="1" />
              </g>
            </g>
          </svg>
        </span>
        <span class="duet-date__vhidden">
          {localization.buttonLabel}
          {valueAsDate && (
            <span>
              , {localization.selectedDateMessage} {dateFormatter.format(valueAsDate)}
            </span>
          )}
        </span>
      </button>
    </div>
  )
}

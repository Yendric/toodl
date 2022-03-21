import {
  ScheduleComponent,
  Day,
  Week,
  Month,
  Inject,
  TimelineMonth,
  ViewsDirective,
  ViewDirective,
  Print,
} from "@syncfusion/ej2-react-schedule";
import { useTodo } from "../../context/TodoState";
import { ActionEventArgs, EventRenderedArgs, ICalendarImport, PopupOpenEventArgs } from "@syncfusion/ej2-schedule";
import { DropDownList } from "@syncfusion/ej2-dropdowns";
import ITodo from "../../types/ITodo";
import nl from "@syncfusion/ej2-locale/src/nl.json";
import { createElement, L10n, setCulture, loadCldr } from "@syncfusion/ej2-base";
import { useRef } from "react";
import { useList } from "../../context/ListState";
import { useSmartschoolEvents } from "../../context/SmartschoolEventsState";

export default function Planning() {
  const { todos, create, destroy, update } = useTodo();
  const { events } = useSmartschoolEvents();

  const { lists } = useList();
  const schedule = useRef<ScheduleComponent | null>(null);

  loadCldr(
    require("cldr-data/supplemental/numberingSystems.json"),
    require("cldr-data/main/nl/ca-gregorian.json"),
    require("cldr-data/main/nl/numbers.json"),
    require("cldr-data/main/nl/timeZoneNames.json")
  );
  L10n.load({ nl: nl.nl });
  setCulture("nl");

  function translate(todo: Record<string, any>, direction = false) {
    const translated: Record<string, any> = {};
    Object.entries(todo).forEach(([key, value]) => {
      translated[(direction ? key[0].toUpperCase() : key[0].toLowerCase()) + key.slice(1)] = value;
    });
    return translated;
  }

  function onActionBegin(args: ActionEventArgs) {
    if (args.requestType === "toolbarItemRendering") {
      if (!args.items) return;
      args.items.push({
        align: "Right",
        showTextOn: "Both",
        text: "Afdrukken",
        click: printSchedule,
      });
    } else {
      let data = args.data as Record<string, any>;
      if (Array.isArray(data)) data = data[0];
      if (!data) return;
      if (data?.Origin === "Smartschool") return;
      const todo = translate(data) as ITodo;
      if (args.requestType === "eventCreate") {
        create(todo);
      } else if (args.requestType === "eventRemove") {
        destroy(todo);
      } else if (args.requestType === "eventChange") {
        update(todo);
      }
    }
  }

  function printSchedule() {
    if (!schedule.current) return;
    schedule.current.print({
      height: "auto",
      width: "auto",
      showHeaderBar: false,
      workHours: { highlight: false },
    });
  }

  function eventRendered(args: EventRenderedArgs) {
    const list = lists.find((list) => list.id === args.data.ListId);
    if (list) args.element.style.backgroundColor = list.color;
  }

  function popupOpen(args: PopupOpenEventArgs) {
    if (args.type === "Editor") {
      if (!args.element.querySelector(".todoList")) {
        const row: HTMLElement = createElement("div", { className: "todoList" });
        const formElement: HTMLElement | null = args.element.querySelector(".e-schedule-form");
        formElement?.firstChild?.insertBefore(row, args.element.querySelector(".e-title-location-row"));
        const container: HTMLElement = createElement("div", { className: "todoListContainer" });
        const inputEle: HTMLInputElement = createElement("input", {
          className: "e-field",
          attrs: { name: "ListId" },
        }) as HTMLInputElement;
        container.appendChild(inputEle);
        row.appendChild(container);

        const dropDownList: DropDownList = new DropDownList({
          dataSource: [
            { text: "Geen lijst (enkel planning)" },
            ...lists.map((list) => {
              return {
                text: list.name,
                value: list.id,
              };
            }),
          ],
          fields: { text: "text", value: "value" },
          value: args.data?.ListId as string,
          floatLabelType: "Always",
          placeholder: "Todo lijst",
        });

        dropDownList.appendTo(inputEle);
        inputEle.setAttribute("name", "ListId");
      }
    }
  }

  return (
    <ScheduleComponent
      workHours={{ highlight: false }}
      timeScale={{ enable: true, interval: 60 }}
      ref={schedule}
      startHour="6:00"
      actionBegin={onActionBegin}
      firstDayOfWeek={1}
      eventSettings={{
        dataSource: [...todos.map((todo) => translate(todo, true)), ...events.map((event) => translate(event, true))],
      }}
      eventRendered={eventRendered}
      popupOpen={popupOpen}
      allowMultiCellSelection={false}
    >
      <ViewsDirective>
        <ViewDirective option="Week" />
        <ViewDirective option="Day" />
        <ViewDirective option="Month" />
        <ViewDirective option="TimelineMonth" />
      </ViewsDirective>
      <Inject services={[Day, Week, Month, TimelineMonth, Print, ICalendarImport]} />
    </ScheduleComponent>
  );
}

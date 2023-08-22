import { L10n, createElement, loadCldr, setCulture } from "@syncfusion/ej2-base";
import { DropDownList } from "@syncfusion/ej2-dropdowns";
import nl from "@syncfusion/ej2-locale/src/nl.json";
import {
  Day,
  Inject,
  Month,
  Print,
  ScheduleComponent,
  TimelineMonth,
  ViewDirective,
  ViewsDirective,
  Week,
} from "@syncfusion/ej2-react-schedule";
import { ActionEventArgs, EventRenderedArgs, PopupOpenEventArgs } from "@syncfusion/ej2-schedule";
import caGregorian from "cldr-data/main/nl/ca-gregorian.json";
import numbers from "cldr-data/main/nl/numbers.json";
import timeZoneNames from "cldr-data/main/nl/timeZoneNames.json";
import numberingSystems from "cldr-data/supplemental/numberingSystems.json";
import { useSnackbar } from "notistack";
import { FC, useEffect, useRef } from "react";
import { useIcals } from "../../api/icals/getIcals";
import { useLists } from "../../api/list/getLists";
import { useCreateTodo } from "../../api/todo/createTodo";
import { useDeleteTodo } from "../../api/todo/destroyTodo";
import { useTodos } from "../../api/todo/getTodos";
import { useUpdateTodo } from "../../api/todo/updateTodo";
import ITodo from "../../types/ITodo";
import "./Planning.scss";

loadCldr(numberingSystems, caGregorian, numbers, timeZoneNames);
L10n.load({ nl: nl.nl });
setCulture("nl");

const PlanningContainer: FC = () => {
  const { data: todos, isSuccess: todoSuccess } = useTodos();
  const { data: lists, isSuccess: listSuccess } = useLists();
  const { data: events, isSuccess: icalSuccess } = useIcals();

  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const { enqueueSnackbar } = useSnackbar();

  const schedule = useRef<ScheduleComponent | null>(null);

  useEffect(() => {
    if (!schedule.current) return;
    schedule.current.refresh();
  }, [lists]);

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
      if (data?.origin === "iCal")
        return enqueueSnackbar("iCal events kunnen niet worden bewerkt.", { variant: "warning" });

      const todo = data as ITodo;

      if (args.requestType === "eventCreate") {
        createTodoMutation.mutate(todo);
      } else if (args.requestType === "eventRemove") {
        deleteTodoMutation.mutate(todo);
      } else if (args.requestType === "eventChange") {
        updateTodoMutation.mutate(todo);
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
    if (!listSuccess) return;

    const list = lists.find((list) => list.id === args.data.listId);
    if (list) args.element.style.backgroundColor = list.color;
  }

  function popupOpen(args: PopupOpenEventArgs) {
    if (!listSuccess) return;

    /* Voeg de lijst input toe aan de bewerkingspopup */
    if (args.type === "Editor") {
      if (!args.element.querySelector(".todoList")) {
        const row: HTMLElement = createElement("div", { className: "todoList" });
        const formElement: HTMLElement | null = args.element.querySelector(".e-schedule-form");
        formElement?.firstChild?.insertBefore(row, args.element.querySelector(".e-title-location-row"));
        const container: HTMLElement = createElement("div", { className: "todoListContainer" });
        const inputEle: HTMLInputElement = createElement("input", {
          className: "e-field",
          attrs: { name: "listId" },
        }) as HTMLInputElement;
        container.appendChild(inputEle);
        row.appendChild(container);

        const dropDownList: DropDownList = new DropDownList({
          dataSource: [
            { text: "Geen lijst (enkel zichtbaar in planningsweergave)" },
            ...lists
              .filter((list) => !list.withoutDates)
              .map((list) => {
                return {
                  text: list.name,
                  value: list.id,
                };
              }),
          ],
          fields: { text: "text", value: "value" },
          value: args.data?.listId as string,
          floatLabelType: "Always",
          placeholder: "Todo lijst",
        });

        dropDownList.appendTo(inputEle);
        inputEle.setAttribute("name", "listId");
      }
    }
  }

  if (!listSuccess || !todoSuccess || !icalSuccess) {
    return (
      <ScheduleComponent
        id="toodl-scheduler"
        disabled={true}
        workHours={{ highlight: false }}
        timeScale={{ enable: true, interval: 60 }}
        startHour="6:00"
      >
        <ViewsDirective>
          <ViewDirective option="Week" />
          <ViewDirective option="Day" />
          <ViewDirective option="Month" />
          <ViewDirective option="TimelineMonth" />
        </ViewsDirective>
        <Inject services={[Day, Week, Month, TimelineMonth, Print]} />
      </ScheduleComponent>
    );
  }

  return (
    <ScheduleComponent
      id="toodl-scheduler"
      workHours={{ highlight: false }}
      timeScale={{ enable: true, interval: 60 }}
      ref={schedule}
      startHour="6:00"
      actionBegin={onActionBegin}
      firstDayOfWeek={1}
      eventSettings={{
        dataSource: [
          ...todos.filter((todo) => !lists.find((list) => list.id === todo.listId)?.withoutDates),
          ...events,
        ],
        fields: {
          id: "id",
          subject: { name: "subject" },
          description: { name: "description" },
          isAllDay: { name: "isAllDay" },
          location: { name: "location" },
          recurrenceRule: { name: "recurrenceRule" },
          startTimeZone: { name: "startTimeZone" },
          endTimeZone: { name: "endTimeZone" },
          startTime: { name: "startTime" },
          endTime: { name: "endTime" },
          recurrenceException: { name: "recurrenceException" },
          done: { name: "done" },
          listId: { name: "listId" },
        },
      }}
      eventRendered={eventRendered}
      popupOpen={popupOpen}
      allowMultiCellSelection={false}
      enablePersistence={true}
    >
      <ViewsDirective>
        <ViewDirective option="Week" />
        <ViewDirective option="Day" />
        <ViewDirective option="Month" />
        <ViewDirective option="TimelineMonth" />
      </ViewsDirective>
      <Inject services={[Day, Week, Month, TimelineMonth, Print]} />
    </ScheduleComponent>
  );
};

export default PlanningContainer;
